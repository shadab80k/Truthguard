
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

    // Initialize the OpenAI API client
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      console.error('OpenAI API key is not configured');
      return new Response(
        JSON.stringify({ error: 'OpenAI API key is not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Processing fact check for statement: ${statement}`);

    try {
      // Call OpenAI for fact checking
      const factCheckResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openaiApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
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
              content: `Fact check the following statement: "${statement}"`
            }
          ],
          temperature: 0.1,
          response_format: { type: "json_object" }
        }),
      });

      if (!factCheckResponse.ok) {
        const errorText = await factCheckResponse.text();
        console.error('OpenAI API error status:', factCheckResponse.status);
        console.error('OpenAI API error response:', errorText);
        
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch (e) {
          errorData = { error: { message: 'Unknown error from OpenAI API' } };
        }
        
        return new Response(
          JSON.stringify({ error: `OpenAI API error: ${errorData.error?.message || 'Unknown error'}` }),
          { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const completion = await factCheckResponse.json();
      
      if (!completion.choices || !completion.choices[0] || !completion.choices[0].message) {
        console.error('Unexpected OpenAI response format:', completion);
        return new Response(
          JSON.stringify({ error: 'Unexpected response format from OpenAI' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      let resultJson;
      try {
        resultJson = JSON.parse(completion.choices[0].message.content);
      } catch (e) {
        console.error('Error parsing JSON from OpenAI:', e);
        console.error('Raw content:', completion.choices[0].message.content);
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
    } catch (openAiError) {
      console.error('Error calling OpenAI:', openAiError);
      return new Response(
        JSON.stringify({ error: 'Error communicating with AI service: ' + openAiError.message }),
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
