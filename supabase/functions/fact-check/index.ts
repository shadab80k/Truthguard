
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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
      // Call Groq API for fact checking with timeout
      console.log('Calling Groq API...');
      
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 30000); // 30 second timeout
      
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
              role: 'system',
              content: 'You are a professional fact-checking assistant. Analyze statements for factual accuracy and respond with valid JSON only. No markdown, no explanations outside JSON.'
            },
            {
              role: 'user',
              content: `Analyze this statement for factual accuracy: "${statement}"

Respond with valid JSON in this exact format:
{
  "status": "true" | "questionable" | "fake",
  "confidence": <number between 0.1 and 1.0>,
  "reasoning": "<detailed explanation of your analysis>",
  "sources": [
    {
      "name": "<credible source name>",
      "url": "<source URL or # if not available>",
      "credibility": "high" | "medium" | "low",
      "summary": "<how this source supports or contradicts the statement>"
    }
  ]
}

Guidelines:
- "true" = Statement is factually accurate and verifiable
- "questionable" = Partially true, misleading, or requires more context
- "fake" = Statement is demonstrably false or misleading
- Include 2-3 relevant sources when possible
- Confidence should reflect certainty level
- Provide clear, evidence-based reasoning`
            }
          ],
          temperature: 0.2,
          max_tokens: 1500,
          top_p: 0.9
        }),
        signal: controller.signal
      });
      
      clearTimeout(timeout);
      
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

      // Initialize Supabase client for database operations
      const supabaseUrl = Deno.env.get('SUPABASE_URL') || 'https://ekpumpitqanmmjpgpeiv.supabase.co';
      const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || Deno.env.get('SUPABASE_ANON_KEY');
      
      let factCheckId = null;
      
      if (supabaseUrl && supabaseKey) {
        try {
          const supabase = createClient(supabaseUrl, supabaseKey);

          // Insert the fact check result into the database
          const { data: factCheckData, error: factCheckError } = await supabase
            .from('fact_checks')
            .insert({
              statement,
              status: resultJson.status,
              confidence: resultJson.confidence,
              reasoning: resultJson.reasoning,
              user_id: userId || null,
              is_public: true
            })
            .select('id')
            .single();

          if (factCheckError) {
            console.error('Error saving fact check:', factCheckError);
          } else if (factCheckData) {
            factCheckId = factCheckData.id;
            console.log('Saved fact check with ID:', factCheckId);

            // Insert sources if available
            if (resultJson.sources && Array.isArray(resultJson.sources) && resultJson.sources.length > 0) {
              const sourcesInserts = resultJson.sources.map(source => ({
                fact_check_id: factCheckId,
                name: source.name || 'Unknown Source',
                url: source.url || '#',
                credibility: source.credibility || 'medium',
                summary: source.summary || 'No summary available'
              }));

              const { error: sourcesError } = await supabase
                .from('sources')
                .insert(sourcesInserts);

              if (sourcesError) {
                console.error('Error saving sources:', sourcesError);
              } else {
                console.log('Saved sources for fact check:', factCheckId);
              }
            }
          }
        } catch (dbError) {
          console.error('Database operation error:', dbError);
        }
      } else {
        console.warn('Supabase credentials not configured, skipping database save');
      }

      // Return the successful response
      return new Response(
        JSON.stringify({
          id: factCheckId || `fact_${Date.now()}`,
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
      
      // Handle network errors
      if (aiError instanceof TypeError && aiError.message.includes('fetch')) {
        console.error('Network error calling Groq API:', aiError);
        return new Response(
          JSON.stringify({ error: 'Network error communicating with AI service. Please check your connection and try again.' }),
          { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      console.error('Error calling Groq API:', aiError);
      return new Response(
        JSON.stringify({ error: 'Error communicating with AI service: ' + (aiError.message || 'Unknown error') }),
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
