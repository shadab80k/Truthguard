
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  console.log('Edge Function called:', req.method, req.url);
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse the request body
    let body;
    try {
      const text = await req.text();
      console.log('Raw request body:', text);
      body = JSON.parse(text);
    } catch (e) {
      console.error("Error parsing request body:", e);
      return new Response(
        JSON.stringify({ error: "Invalid JSON in request body" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { statement, userId } = body;
    console.log('Processing statement:', statement);
    
    if (!statement) {
      return new Response(
        JSON.stringify({ error: 'Statement is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Initialize the Groq API client
    const groqApiKey = Deno.env.get('GROQ_API_KEY');
    if (!groqApiKey) {
      console.error('Groq API key is not configured');
      return new Response(
        JSON.stringify({ error: 'Groq API key is not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Processing fact check for statement: ${statement}`);

    try {
      // Call Groq API for fact checking
      console.log('Calling Groq API...');
      
      const factCheckResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${groqApiKey}`,
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            {
              role: 'user',
              content: `Fact-check this statement and respond with JSON only: "${statement}". Use format: {"status":"true/questionable/fake","confidence":0.8,"reasoning":"explanation","sources":[{"name":"source","url":"url","credibility":"high","summary":"summary"}]}`
            }
          ],
          temperature: 0.3,
          max_tokens: 1000
        })
      });
      
      console.log('Groq API response status:', factCheckResponse.status);

      if (!factCheckResponse.ok) {
        const errorText = await factCheckResponse.text();
        console.error('Groq API error status:', factCheckResponse.status);
        console.error('Groq API error response:', errorText);
        
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch (e) {
          errorData = { error: { message: 'Unknown error from Groq API' } };
        }
        
        let errorMessage = errorData.error?.message || 'Unknown error';
        
        // Check for quota exceeded error
        if (errorMessage.includes('quota') || errorMessage.includes('limit') || factCheckResponse.status === 429) {
          console.error('Groq API quota exceeded');
          return new Response(
            JSON.stringify({ error: `Groq API quota exceeded. Please check your API key and usage limits.` }),
            { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        
        // Check for invalid API key
        if (factCheckResponse.status === 401) {
          return new Response(
            JSON.stringify({ error: `Invalid Groq API key. Please check your API key configuration.` }),
            { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        
        // Check for rate limiting or other temporary issues
        if (factCheckResponse.status === 503 || factCheckResponse.status === 429) {
          return new Response(
            JSON.stringify({ error: `Groq service temporarily unavailable. Please try again in a few minutes.` }),
            { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        
        return new Response(
          JSON.stringify({ error: `Groq API error: ${errorMessage}` }),
          { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const responseData = await factCheckResponse.json();
      console.log('Raw Groq API response:', JSON.stringify(responseData, null, 2));
      
      if (!responseData.choices || !responseData.choices[0] || !responseData.choices[0].message) {
        console.error('Unexpected Groq API response format:', responseData);
        return new Response(
          JSON.stringify({ error: 'Unexpected response format from Groq API' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      const textContent = responseData.choices[0].message.content;
      console.log('AI response text:', textContent);
      
      // Extract JSON from the response text
      let resultJson;
      try {
        // Clean the response text and extract JSON
        let jsonString = textContent.trim();
        
        // Remove markdown code blocks if present
        if (jsonString.startsWith('```json')) {
          jsonString = jsonString.replace(/```json\s*/, '').replace(/```\s*$/, '');
        } else if (jsonString.startsWith('```')) {
          jsonString = jsonString.replace(/```\s*/, '').replace(/```\s*$/, '');
        }
        
        // Find the start and end of JSON in the response text
        const jsonStartIndex = jsonString.indexOf('{');
        const jsonEndIndex = jsonString.lastIndexOf('}') + 1;
        
        if (jsonStartIndex !== -1 && jsonEndIndex !== -1) {
          jsonString = jsonString.substring(jsonStartIndex, jsonEndIndex);
          resultJson = JSON.parse(jsonString);
        } else {
          throw new Error('No JSON found in response');
        }

        // Validate the required fields
        if (!resultJson.status || !resultJson.confidence || !resultJson.reasoning) {
          throw new Error('Missing required fields in AI response');
        }

        // Ensure sources is an array
        if (!resultJson.sources || !Array.isArray(resultJson.sources)) {
          resultJson.sources = [];
        }

        // Validate confidence is a number between 0 and 1
        if (typeof resultJson.confidence !== 'number' || resultJson.confidence < 0 || resultJson.confidence > 1) {
          resultJson.confidence = 0.5; // Default confidence
        }

        // Validate status
        if (!['true', 'questionable', 'fake'].includes(resultJson.status)) {
          resultJson.status = 'questionable'; // Default status
        }

      } catch (e) {
        console.error('Error parsing JSON from Groq API:', e);
        console.error('Raw content:', textContent);
        
        // Create a fallback response
        resultJson = {
          status: 'questionable',
          confidence: 0.3,
          reasoning: 'Unable to process the statement properly. The AI service returned an unexpected response format.',
          sources: []
        };
      }
      
      console.log('Processed fact check result:', resultJson);

      // Return the successful response (without database operations for now)
      return new Response(
        JSON.stringify({
          id: `fact_${Date.now()}`,
          status: resultJson.status,
          confidence: resultJson.confidence,
          reasoning: resultJson.reasoning,
          sources: resultJson.sources || []
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
      
    } catch (aiError) {
      // Check if this is an AbortController timeout
      if (aiError.name === 'AbortError') {
        console.error('Request timed out when calling Groq API');
        return new Response(
          JSON.stringify({ error: 'Request timed out. The AI service is taking too long to respond. Please try again.' }),
          { status: 504, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      console.error('Error calling Groq API:', aiError);
      return new Response(
        JSON.stringify({ error: 'Error communicating with AI service: ' + aiError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('Unhandled error in fact-check function:', error);

    return new Response(
      JSON.stringify({
        error: 'Internal server error: ' + (error.message || 'Unknown error'),
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
