
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

    // Initialize News API key
    const newsApiKey = Deno.env.get('NEWS_API_KEY');
    if (!newsApiKey) {
      console.error('News API key is not configured');
      console.log('Continuing without real-time news data');
    }

    console.log(`Processing fact check for statement: ${statement}`);

    // Detect if the statement is about a date-based event
    const isDateEvent = /\b(calendar|date|holiday|festival|celebrate|celebrated|celebration|event|eid|diwali|christmas|new year|easter|hanukkah|ramadan|passover|day|month|year|2023|2024|2025|january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|jun|jul|aug|sep|oct|nov|dec)\b/i.test(statement.toLowerCase());

    // Create specialized search queries for different types of statements
    let newsQuery = '';
    let additionalContext = '';

    if (isDateEvent) {
      console.log("Detected a date-based or calendar event statement");
      
      // Extract potential entities (holidays, dates, locations)
      const holidayMatch = statement.match(/\b(eid|diwali|christmas|new year|easter|hanukkah|ramadan|passover|lunar new year|thanksgiving|independence day)\b/i);
      const dateMatch = statement.match(/\b(\d{1,2}(?:st|nd|rd|th)?\s+(?:january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)(?:\s+\d{4})?|\d{4})\b/i);
      const locationMatch = statement.match(/\b(in|at|on|across)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\b/);
      
      const holiday = holidayMatch ? holidayMatch[0] : '';
      const date = dateMatch ? dateMatch[0] : '';
      const location = locationMatch ? locationMatch[2] : '';
      
      // Build a more specialized search query for the news API
      const searchTerms = [holiday, date, location].filter(term => term).join(' ');
      newsQuery = searchTerms || statement;
      
      // Add specialized context about calendar systems for religious events
      if (holiday.toLowerCase().includes('eid') || holiday.toLowerCase().includes('ramadan')) {
        additionalContext = `
The Islamic calendar (Hijri calendar) is a lunar calendar, and religious events like Eid are determined by moon sightings. 
This means:
1. Dates for Islamic holidays can vary by 1-2 days depending on location and moon sightings
2. Unlike the Gregorian calendar, the Islamic year is about 11 days shorter
3. Islamic holidays move backwards through the Gregorian calendar by about 11 days each year
4. Different countries and communities might celebrate on slightly different days based on local moon sightings
5. The dates for future Islamic holidays are often predicted but may change based on actual moon sightings closer to the date
`;
      } else if (holiday.toLowerCase().includes('diwali') || holiday.toLowerCase().includes('holi')) {
        additionalContext = `
Hindu festivals like Diwali and Holi follow the lunisolar Hindu calendar:
1. Dates in the Gregorian calendar change each year but generally fall in the same Hindu calendar month
2. Different regions in India might celebrate on slightly different days or with different customs
3. Future dates are calculated astronomically and are generally predictable
`;
      }
    } else {
      // For non-date statements, use keyword extraction
      const keywords = statement
        .toLowerCase()
        .split(/\s+/)
        .filter(word => word.length > 3)
        .filter(word => !['what', 'when', 'where', 'which', 'who', 'whom', 'whose', 'why', 'how', 'that', 'this', 'these', 'those', 'with', 'from', 'into', 'during', 'including', 'until', 'against', 'among', 'throughout', 'despite', 'towards', 'upon', 'while', 'about', 'above', 'across', 'after', 'along', 'around', 'because', 'before', 'behind', 'below', 'beneath', 'beside', 'between', 'beyond', 'during', 'except', 'inside', 'outside', 'through', 'toward', 'under', 'underneath', 'unlike', 'since'].includes(word))
        .join(' OR ');
      
      newsQuery = keywords;
    }

    // Fetch recent news articles related to the statement
    let recentNews = [];
    if (newsApiKey && newsQuery.length > 0) {
      try {
        console.log(`Searching news API for keywords: ${newsQuery}`);
        const newsResponse = await fetch(
          `https://newsapi.org/v2/everything?q=${encodeURIComponent(newsQuery)}&language=en&sortBy=publishedAt&pageSize=5`,
          {
            headers: {
              'X-Api-Key': newsApiKey
            }
          }
        );

        if (!newsResponse.ok) {
          throw new Error(`News API returned status ${newsResponse.status}`);
        }

        const newsData = await newsResponse.json();
        
        // Process news articles
        if (newsData.articles && newsData.articles.length > 0) {
          recentNews = newsData.articles.map(article => ({
            title: article.title,
            url: article.url,
            source: article.source.name,
            publishedAt: article.publishedAt,
            description: article.description
          }));
          console.log(`Found ${recentNews.length} recent news articles`);
        } else {
          console.log('No recent news articles found');
        }
      } catch (newsError) {
        console.error('Error fetching news data:', newsError);
        // Continue without news data
      }
    }

    try {
      // Prepare the prompt for Gemini with real-time news context
      let promptText = `You are a fact-checking assistant specializing in verification of statements, including those about date-based events and cultural/religious celebrations. Analyze the statement for factual accuracy and provide a detailed assessment.`;
      
      // Add specialized context for date-based events if applicable
      if (additionalContext) {
        promptText += `\n\nSPECIAL CONTEXT FOR THIS TYPE OF STATEMENT:\n${additionalContext}`;
      }
      
      // Add real-time news context if available
      if (recentNews.length > 0) {
        promptText += `\n\nHere is recent news information related to this statement:`;
        recentNews.forEach((article, index) => {
          promptText += `\n${index + 1}. ${article.title} (${article.source}, ${new Date(article.publishedAt).toLocaleDateString()})`;
          if (article.description) {
            promptText += `\n   ${article.description}`;
          }
        });
        promptText += `\n\nPlease carefully consider this recent information in your analysis.`;
      }
      
      // Critical thinking instructions for religious/cultural date verification
      promptText += `\n\nIMPORTANT INSTRUCTIONS FOR RELIGIOUS AND CULTURAL DATES:
1. For Islamic holidays (like Eid), remember they follow the lunar calendar and can vary by location
2. For Hindu festivals (like Diwali), remember they follow the lunisolar calendar 
3. For predicted future dates of holidays, be cautious about marking them as "fake" - instead mark as "questionable" if there's uncertainty
4. For statements about dates more than 6 months in the future, acknowledge the potential for prediction error
5. Reference religious or cultural authorities when verifying dates of religious observances
6. Consider the cultural context when assessing statements about celebrations
7. Apply critical thinking before marking any cultural or religious event date as false`;
      
      promptText += `\nReturn a JSON response with the following structure:
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
      }
      
      Fact check this statement: "${statement}"`;

      // Call Google's Gemini API for fact checking
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
                  text: promptText
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.1,
            candidateCount: 1,
          }
        }),
      });

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
        if (errorMessage.includes('quota') || errorMessage.includes('billing') || errorMessage.includes('limit')) {
          console.error('Google AI API quota exceeded or billing issue');
          return new Response(
            JSON.stringify({ error: `Google AI API quota exceeded: ${errorMessage}` }),
            { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        
        return new Response(
          JSON.stringify({ error: `Google AI API error: ${errorMessage}` }),
          { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const responseData = await factCheckResponse.json();
      
      if (!responseData.candidates || !responseData.candidates[0] || !responseData.candidates[0].content) {
        console.error('Unexpected Google AI response format:', responseData);
        return new Response(
          JSON.stringify({ error: 'Unexpected response format from Google AI' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      const textContent = responseData.candidates[0].content.parts[0].text;
      
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
        console.error('Error parsing JSON from Google AI:', e);
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
          sources: resultJson.sources,
          recentNews: recentNews
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    } catch (aiError) {
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
