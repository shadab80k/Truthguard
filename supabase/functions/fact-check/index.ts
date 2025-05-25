
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse the request body
    let body;
    try {
      body = await req.json();
    } catch (e) {
      console.error("Error parsing request body:", e);
      return new Response(
        JSON.stringify({ error: "Invalid JSON in request body" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { statement, userId } = body;
    
    if (!statement) {
      return new Response(
        JSON.stringify({ error: 'Statement is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Initialize the Google AI API client
    const googleApiKey = Deno.env.get('GOOGLE_AI_API_KEY');
    if (!googleApiKey) {
      console.error('Google AI API key is not configured');
      return new Response(
        JSON.stringify({ error: 'Google AI API key is not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Processing fact check for statement: ${statement}`);

    try {
      // Call Google's Gemini API for fact checking with improved timeout
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 45000); // 45 second timeout
      
      const factCheckResponse = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': googleApiKey,
        },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: `You are a professional fact-checking assistant. Analyze the following statement for factual accuracy and provide a detailed assessment in JSON format.

Statement to fact-check: "${statement}"

You must respond with a valid JSON object with this exact structure:
{
  "status": "true" | "questionable" | "fake",
  "confidence": <number between 0 and 1>,
  "reasoning": "<detailed explanation of your analysis>",
  "sources": [
    {
      "name": "<credible source name>",
      "url": "<source URL if available>",
      "credibility": "high" | "medium" | "low",
      "summary": "<how this source supports or contradicts the statement>"
    }
  ]
}

Guidelines:
- "true" = Statement is factually accurate
- "questionable" = Partially true or needs more context  
- "fake" = Statement is false or misleading
- Confidence should reflect how certain you are (0.1 = very uncertain, 1.0 = completely certain)
- Include at least 2-3 credible sources when possible
- Provide clear reasoning based on available evidence`
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.2,
            candidateCount: 1,
            maxOutputTokens: 2048,
          }
        }),
        signal: controller.signal
      });
      
      clearTimeout(timeout);

      if (!factCheckResponse.ok) {
        const errorText = await factCheckResponse.text();
        console.error('Google AI API error status:', factCheckResponse.status);
        console.error('Google AI API error response:', errorText);
        
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch (e) {
          errorData = { error: { message: 'Unknown error from Google AI API' } };
        }
        
        let errorMessage = errorData.error?.message || 'Unknown error';
        
        // Check for quota exceeded error
        if (errorMessage.includes('quota') || errorMessage.includes('billing') || errorMessage.includes('limit') || factCheckResponse.status === 429) {
          console.error('Google AI API quota exceeded or billing issue');
          return new Response(
            JSON.stringify({ error: `Google AI API quota exceeded. Please check your API key and billing settings.` }),
            { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        
        // Check for invalid API key
        if (factCheckResponse.status === 400 && errorMessage.includes('API key')) {
          return new Response(
            JSON.stringify({ error: `Invalid Google AI API key. Please check your API key configuration.` }),
            { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        
        // Check for rate limiting or other temporary issues
        if (factCheckResponse.status === 503 || factCheckResponse.status === 429) {
          return new Response(
            JSON.stringify({ error: `Google AI service temporarily unavailable. Please try again in a few minutes.` }),
            { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        
        return new Response(
          JSON.stringify({ error: `Google AI API error: ${errorMessage}` }),
          { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const responseData = await factCheckResponse.json();
      console.log('Raw Google AI response:', JSON.stringify(responseData, null, 2));
      
      if (!responseData.candidates || !responseData.candidates[0] || !responseData.candidates[0].content) {
        console.error('Unexpected Google AI response format:', responseData);
        return new Response(
          JSON.stringify({ error: 'Unexpected response format from Google AI' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      const textContent = responseData.candidates[0].content.parts[0].text;
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
        console.error('Error parsing JSON from Google AI:', e);
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
      const supabaseUrl = Deno.env.get('SUPABASE_URL') || 'https://jeyxcpfhzydsfnsccgnw.supabase.co';
      const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || Deno.env.get('SUPABASE_ANON_KEY');
      
      if (!supabaseUrl || !supabaseKey) {
        console.error('Supabase credentials not configured');
        // Continue without saving to database
      } else {
        const supabase = createClient(supabaseUrl, supabaseKey);

        // Insert the fact check result into the database if user is provided
        let factCheckId;
        if (userId) {
          try {
            const { data: factCheckData, error: factCheckError } = await supabase
              .from('fact_checks')
              .insert({
                statement,
                status: resultJson.status,
                confidence: resultJson.confidence,
                reasoning: resultJson.reasoning,
                user_id: userId,
                is_public: true
              })
              .select('id')
              .single();

            if (factCheckError) {
              console.error('Error saving fact check:', factCheckError);
            } else if (factCheckData) {
              factCheckId = factCheckData.id;

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
                }
              }
            }
          } catch (dbError) {
            console.error('Database operation error:', dbError);
          }
        }
      }

      // Return the successful response
      return new Response(
        JSON.stringify({
          id: factCheckId || null,
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
        console.error('Request timed out when calling Google AI');
        return new Response(
          JSON.stringify({ error: 'Request timed out. The AI service is taking too long to respond. Please try again.' }),
          { status: 504, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      console.error('Error calling Google AI:', aiError);
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
