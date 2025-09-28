import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Trusted news sources for scraping
const TRUSTED_SOURCES = [
  'bbc.com',
  'reuters.com',
  'ap.org', 
  'cnn.com',
  'theguardian.com',
  'npr.org'
];

// Fact-checking specific sites
const FACT_CHECK_SITES = [
  'snopes.com',
  'factcheck.org',
  'politifact.com',
  'fullfact.org'
];

interface ScrapedSource {
  title: string;
  url: string;
  snippet: string;
  source: string;
  publishDate?: string;
}

// Google Search scraping function
async function scrapeGoogleSearch(query: string, sites: string[]): Promise<ScrapedSource[]> {
  const results: ScrapedSource[] = [];
  
  try {
    // Enhanced search query with site restrictions
    const siteQuery = sites.map(site => `site:${site}`).join(' OR ');
    const searchQuery = encodeURIComponent(`"${query}" (${siteQuery})`);
    
    // Using Google Custom Search API (requires API key)
    const googleApiKey = Deno.env.get('GOOGLE_SEARCH_API_KEY');
    const searchEngineId = Deno.env.get('GOOGLE_SEARCH_ENGINE_ID');
    
    if (googleApiKey && searchEngineId) {
      const searchUrl = `https://www.googleapis.com/customsearch/v1?key=${googleApiKey}&cx=${searchEngineId}&q=${searchQuery}&num=10`;
      
      const response = await fetch(searchUrl);
      const data = await response.json();
      
      if (data.items) {
        data.items.forEach((item: any) => {
          results.push({
            title: item.title,
            url: item.link,
            snippet: item.snippet,
            source: new URL(item.link).hostname,
            publishDate: item.pagemap?.metatags?.[0]?.['article:published_time']
          });
        });
      }
    }
    
  } catch (error) {
    console.error('Error scraping Google search:', error);
  }
  
  return results;
}

// News API integration
async function fetchNewsArticles(query: string): Promise<ScrapedSource[]> {
  const results: ScrapedSource[] = [];
  
  try {
    const newsApiKey = Deno.env.get('NEWS_API_KEY');
    
    if (newsApiKey) {
      const newsUrl = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&sources=bbc-news,reuters,associated-press,cnn,the-guardian-uk&sortBy=relevancy&language=en&apiKey=${newsApiKey}`;
      
      const response = await fetch(newsUrl);
      const data = await response.json();
      
      if (data.articles) {
        data.articles.forEach((article: any) => {
          results.push({
            title: article.title,
            url: article.url,
            snippet: article.description,
            source: article.source.name,
            publishDate: article.publishedAt
          });
        });
      }
    }
    
  } catch (error) {
    console.error('Error fetching news articles:', error);
  }
  
  return results;
}

// Enhanced AI analysis with real sources
async function analyzeWithRealSources(statement: string, scrapedSources: ScrapedSource[]): Promise<any> {
  const groqApiKey = Deno.env.get('GROQ_API_KEY');
  
  if (!groqApiKey) {
    throw new Error('Groq API key not configured');
  }
  
  // Prepare context from scraped sources
  const sourceContext = scrapedSources.map(source => 
    `Source: ${source.source}\nTitle: ${source.title}\nContent: ${source.snippet}\nURL: ${source.url}`
  ).join('\n\n---\n\n');
  
  const prompt = `You are a professional fact-checker. Analyze the following statement using the provided real-world sources.

Statement to fact-check: "${statement}"

Real sources found:
${sourceContext}

Based on these actual sources, provide a comprehensive fact-check analysis in JSON format:

{
  "status": "true" | "questionable" | "fake",
  "confidence": <number between 0.1 and 1.0>,
  "reasoning": "<detailed analysis based on the provided sources>",
  "sources": [
    {
      "name": "<source name from provided data>",
      "url": "<actual URL from provided data>", 
      "credibility": "high" | "medium" | "low",
      "summary": "<how this specific source supports or contradicts the statement>",
      "publishDate": "<date if available>"
    }
  ],
  "evidence_score": <number between 0-100 indicating strength of evidence>,
  "cross_reference_count": <number of sources that corroborate the finding>
}

Guidelines:
- Use ONLY the provided sources in your analysis
- Cross-reference multiple sources for consistency
- Consider source credibility and publication date
- Provide specific evidence from the scraped content
- Be transparent about conflicting information
- Rate evidence strength based on source quality and quantity`;

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
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
          content: 'You are a professional fact-checker who analyzes real sources. Respond with valid JSON only.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.1,
      max_tokens: 2000,
      top_p: 0.9
    })
  });
  
  const data = await response.json();
  const textContent = data.choices[0].message.content;
  
  // Parse JSON response
  let jsonString = textContent.trim();
  if (jsonString.startsWith('```json')) {
    jsonString = jsonString.replace(/```json\s*/, '').replace(/```\s*$/, '');
  }
  
  const jsonStartIndex = jsonString.indexOf('{');
  const jsonEndIndex = jsonString.lastIndexOf('}') + 1;
  
  if (jsonStartIndex !== -1 && jsonEndIndex !== -1) {
    jsonString = jsonString.substring(jsonStartIndex, jsonEndIndex);
    return JSON.parse(jsonString);
  }
  
  throw new Error('Failed to parse AI response');
}

serve(async (req) => {
  console.log('Advanced fact-check function called:', req.method);
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { statement, userId } = body;
    
    if (!statement) {
      return new Response(
        JSON.stringify({ error: 'Statement is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Processing advanced fact-check for:', statement);

    // Step 1: Scrape Google search results
    console.log('Scraping Google search results...');
    const googleResults = await scrapeGoogleSearch(statement, [...TRUSTED_SOURCES, ...FACT_CHECK_SITES]);
    
    // Step 2: Fetch news articles
    console.log('Fetching news articles...');
    const newsResults = await fetchNewsArticles(statement);
    
    // Step 3: Combine all sources
    const allSources = [...googleResults, ...newsResults].slice(0, 10); // Limit to top 10 sources
    
    console.log(`Found ${allSources.length} relevant sources`);
    
    // Step 4: AI analysis with real sources
    console.log('Analyzing with AI using real sources...');
    const analysis = await analyzeWithRealSources(statement, allSources);
    
    // Step 5: Save to database
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || Deno.env.get('SUPABASE_ANON_KEY');
    
    let factCheckId = null;
    
    if (supabaseUrl && supabaseKey) {
      try {
        const supabase = createClient(supabaseUrl, supabaseKey);
        
        const { data: factCheckData, error } = await supabase
          .from('fact_checks')
          .insert({
            statement,
            status: analysis.status,
            confidence: analysis.confidence,
            reasoning: analysis.reasoning,
            user_id: userId || null,
            is_public: true,
            metadata: {
              evidence_score: analysis.evidence_score,
              cross_reference_count: analysis.cross_reference_count,
              source_count: allSources.length
            }
          })
          .select('id')
          .single();
          
        if (!error && factCheckData) {
          factCheckId = factCheckData.id;
          
          // Save sources
          if (analysis.sources && analysis.sources.length > 0) {
            await supabase.from('sources').insert(
              analysis.sources.map((source: any) => ({
                fact_check_id: factCheckId,
                name: source.name,
                url: source.url,
                credibility: source.credibility,
                summary: source.summary,
                metadata: {
                  publishDate: source.publishDate
                }
              }))
            );
          }
        }
      } catch (dbError) {
        console.error('Database error:', dbError);
      }
    }

    return new Response(
      JSON.stringify({
        id: factCheckId || `advanced_${Date.now()}`,
        status: analysis.status,
        confidence: analysis.confidence,
        reasoning: analysis.reasoning,
        sources: analysis.sources || [],
        evidence_score: analysis.evidence_score,
        cross_reference_count: analysis.cross_reference_count,
        source_count: allSources.length,
        scraping_enabled: true
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Advanced fact-check error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Advanced fact-checking failed' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});