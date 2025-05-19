
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

    // Initialize the Grok AI API client
    const grokApiKey = Deno.env.get('GOOGLE_AI_API_KEY'); // We're reusing the same env variable
    if (!grokApiKey) {
      console.error('Grok AI API key is not configured');
      return new Response(
        JSON.stringify({ error: 'Grok AI API key is not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Processing fact check for statement: ${statement}`);

    try {
      // Call Grok's AI API for fact checking with a timeout
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 30000); // 30 second timeout
      
      // Updated API endpoint for Grok AI
      const factCheckResponse = await fetch('https://api.grok.x.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${grokApiKey}`,
        },
        body: JSON.stringify({
          model: "grok-1",
          messages: [
            {
              role: 'system',
              content: `You are a fact-checking assistant. Analyze the statement for factual accuracy and provide a detailed assessment.
              Return a JSON response with the following structure:
              {
                "status": "true" | "questionable" | "fake",
                "confidence": <number between 0 and 1>,
                "reasoning": "<detailed explanation>",
                "sources": [
                  {
                    "name": "<source name>",
                    "url": "<source url>",
                    "credibility": "high" | "medium" | "low",
                    "summary": "<how this source addresses the fact>"
                  }
                ]
              }`
            },
            {
              role: 'user',
              content: `Fact check this statement: "${statement}"`
            }
          ],
          temperature: 0.1
        }),
        signal: controller.signal
      });
      
      clearTimeout(timeout);

      if (!factCheckResponse.ok) {
        const errorText = await factCheckResponse.text();
        console.error('Grok AI API error status:', factCheckResponse.status);
        console.error('Grok AI API error response:', errorText);
        
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch (e) {
          errorData = { error: { message: 'Unknown error from Grok AI API' } };
        }
        
        let errorMessage = errorData.error?.message || 'Unknown error';
        
        // Check for quota exceeded error
        if (errorMessage.includes('quota') || errorMessage.includes('billing') || errorMessage.includes('limit') || factCheckResponse.status === 429) {
          console.error('Grok AI API quota exceeded or billing issue');
          return new Response(
            JSON.stringify({ error: `Grok AI API quota exceeded: ${errorMessage}` }),
            { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        
        // Check for rate limiting or other temporary issues
        if (factCheckResponse.status === 503 || factCheckResponse.status === 429) {
          return new Response(
            JSON.stringify({ error: `Grok AI service temporarily unavailable: ${errorMessage}` }),
            { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        
        return new Response(
          JSON.stringify({ error: `Grok AI API error: ${errorMessage}` }),
          { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const responseData = await factCheckResponse.json();
      
      if (!responseData.choices || !responseData.choices[0] || !responseData.choices[0].message) {
        console.error('Unexpected Grok AI response format:', responseData);
        return new Response(
          JSON.stringify({ error: 'Unexpected response format from Grok AI' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      const textContent = responseData.choices[0].message.content;
      
      // Extract JSON from the response text
      let resultJson;
      try {
        // Find the start and end of JSON in the response text
        const jsonStartIndex = textContent.indexOf('{');
        const jsonEndIndex = textContent.lastIndexOf('}') + 1;
        
        if (jsonStartIndex !== -1 && jsonEndIndex !== -1) {
          const jsonString = textContent.substring(jsonStartIndex, jsonEndIndex);
          resultJson = JSON.parse(jsonString);
        } else {
          throw new Error('No JSON found in response');
        }
      } catch (e) {
        console.error('Error parsing JSON from Grok AI:', e);
        console.error('Raw content:', textContent);
        return new Response(
          JSON.stringify({ error: 'Error parsing AI response' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      console.log('Fact check result:', resultJson);

      // Initialize Supabase client
      const supabaseUrl = Deno.env.get('SUPABASE_URL') || 'https://jeyxcpfhzydsfnsccgnw.supabase.co';
      const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || Deno.env.get('SUPABASE_ANON_KEY');
      
      if (!supabaseUrl || !supabaseKey) {
        console.error('Supabase credentials not configured');
        return new Response(
          JSON.stringify({ error: 'Database connection error' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      const supabase = createClient(supabaseUrl, supabaseKey);

      // Insert the fact check result into the database
      let factCheckId;
      if (userId) {
        try {
          // If user is authenticated, save the result to the database
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
            // Continue without saving to database
          } else {
            factCheckId = factCheckData.id;

            // Insert sources
            if (resultJson.sources && Array.isArray(resultJson.sources)) {
              const sourcesInserts = resultJson.sources.map(source => ({
                fact_check_id: factCheckId,
                name: source.name,
                url: source.url,
                credibility: source.credibility,
                summary: source.summary
              }));

              const { error: sourcesError } = await supabase
                .from('sources')
                .insert(sourcesInserts);

              if (sourcesError) {
                console.error('Error saving sources:', sourcesError);
                // Continue anyway, we at least have the fact check
              }
            }
          }
        } catch (dbError) {
          console.error('Database operation error:', dbError);
          // Continue without saving to database
        }
      }

      return new Response(
        JSON.stringify({
          id: factCheckId || null,
          status: resultJson.status,
          confidence: resultJson.confidence,
          reasoning: resultJson.reasoning,
          sources: resultJson.sources
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    } catch (aiError) {
      // Check if this is an AbortController timeout
      if (aiError.name === 'AbortError') {
        console.error('Request timed out when calling Grok AI');
        return new Response(
          JSON.stringify({ error: 'Request timed out when calling the AI service. Please try again later.' }),
          { status: 504, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      console.error('Error calling Grok AI:', aiError);
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
