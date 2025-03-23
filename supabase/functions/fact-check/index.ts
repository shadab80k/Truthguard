
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
    const { statement, userId } = await req.json();
    
    if (!statement) {
      throw new Error('Statement is required');
    }

    // Initialize the OpenAI API client
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      throw new Error('OpenAI API key is not configured');
    }

    console.log(`Processing fact check for statement: ${statement}`);

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
      const errorData = await factCheckResponse.json();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const completion = await factCheckResponse.json();
    const resultJson = JSON.parse(completion.choices[0].message.content);
    
    console.log('Fact check result:', resultJson);

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || 'https://jeyxcpfhzydsfnsccgnw.supabase.co';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || Deno.env.get('SUPABASE_ANON_KEY');
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Insert the fact check result into the database
    let factCheckId;
    if (userId) {
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
        throw new Error(`Error saving fact check: ${factCheckError.message}`);
      }

      factCheckId = factCheckData.id;

      // Insert sources
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
  } catch (error) {
    console.error('Error in fact-check function:', error);

    return new Response(
      JSON.stringify({
        error: error.message,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
