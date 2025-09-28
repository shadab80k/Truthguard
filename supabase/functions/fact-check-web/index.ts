import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.38/deno-dom-wasm.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Trusted fact-checking sources
const FACT_CHECK_SOURCES = [
  { 
    name: "Reuters Fact Check", 
    baseUrl: "https://www.reuters.com/fact-check/",
    searchUrl: "https://www.reuters.com/site-search/?query=",
    domain: "reuters.com"
  },
  { 
    name: "BBC Reality Check", 
    baseUrl: "https://www.bbc.com/news/reality_check",
    searchUrl: "https://www.bbc.com/search?q=",
    domain: "bbc.com"
  },
  { 
    name: "AP Fact Check", 
    baseUrl: "https://apnews.com/hub/ap-fact-check",
    searchUrl: "https://apnews.com/search?q=",
    domain: "apnews.com"
  }
];

interface WebSource {
  title: string;
  url: string;
  snippet: string;
  source: string;
  relevance: number;
}

// Direct web scraping without APIs
async function scrapeDirectSources(query: string): Promise<WebSource[]> {
  const results: WebSource[] = [];
  
  // Create search queries
  const searchTerms = [
    `"${query}" fact check`,
    `"${query}" true false`,
    `"${query}" verification`,
    `${query} debunk myth`
  ];

  // Use DuckDuckGo search (no API key required)
  for (const term of searchTerms.slice(0, 2)) { // Limit to 2 searches
    try {
      const searchUrl = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(term + " site:reuters.com OR site:bbc.com OR site:apnews.com OR site:snopes.com")}`;
      
      const response = await fetch(searchUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      
      if (response.ok) {
        const html = await response.text();
        const doc = new DOMParser().parseFromString(html, "text/html");
        
        // Parse search results
        const resultElements = doc.querySelectorAll('.result');
        
        resultElements.forEach((element, index) => {
          if (index < 5) { // Limit results per search
            const titleElement = element.querySelector('.result__title a');
            const snippetElement = element.querySelector('.result__snippet');
            const urlElement = element.querySelector('.result__url');
            
            if (titleElement && snippetElement && urlElement) {
              const title = titleElement.textContent?.trim() || '';
              const snippet = snippetElement.textContent?.trim() || '';
              let url = titleElement.getAttribute('href') || '';
              
              // Clean up URL
              if (url.startsWith('//duckduckgo.com/l/?uddg=')) {
                const urlMatch = url.match(/url=([^&]+)/);
                if (urlMatch) {
                  url = decodeURIComponent(urlMatch[1]);
                }
              }
              
              // Determine source
              let source = 'Unknown';
              if (url.includes('reuters.com')) source = 'Reuters';
              else if (url.includes('bbc.com')) source = 'BBC';
              else if (url.includes('apnews.com')) source = 'AP News';
              else if (url.includes('snopes.com')) source = 'Snopes';
              
              // Calculate relevance score
              const relevance = calculateRelevance(query, title, snippet);
              
              if (relevance > 0.3 && title.length > 10) {
                results.push({
                  title,
                  url,
                  snippet,
                  source,
                  relevance
                });
              }
            }
          }
        });
      }
      
      // Add delay between requests
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      console.error(`Error scraping for term "${term}":`, error);
    }
  }
  
  // Sort by relevance and remove duplicates
  const uniqueResults = results
    .filter((result, index, self) => 
      index === self.findIndex(r => r.url === result.url)
    )
    .sort((a, b) => b.relevance - a.relevance)
    .slice(0, 8); // Top 8 results
  
  return uniqueResults;
}

// Calculate relevance score based on query match
function calculateRelevance(query: string, title: string, snippet: string): number {
  const queryLower = query.toLowerCase();
  const titleLower = title.toLowerCase();
  const snippetLower = snippet.toLowerCase();
  
  let score = 0;
  
  // Exact phrase match
  if (titleLower.includes(queryLower)) score += 0.8;
  if (snippetLower.includes(queryLower)) score += 0.6;
  
  // Individual word matches
  const queryWords = queryLower.split(' ').filter(word => word.length > 2);
  queryWords.forEach(word => {
    if (titleLower.includes(word)) score += 0.2;
    if (snippetLower.includes(word)) score += 0.1;
  });
  
  // Fact-checking indicators
  const factCheckTerms = ['fact check', 'false', 'true', 'misleading', 'verify', 'debunk'];
  factCheckTerms.forEach(term => {
    if (titleLower.includes(term) || snippetLower.includes(term)) {
      score += 0.3;
    }
  });
  
  return Math.min(score, 1.0);
}

// Enhanced AI analysis with scraped web data
async function analyzeWithWebSources(statement: string, webSources: WebSource[]): Promise<any> {
  const groqApiKey = Deno.env.get('GROQ_API_KEY');
  
  if (!groqApiKey) {
    throw new Error('Groq API key not configured');
  }
  
  // Prepare context from web sources
  const webContext = webSources.length > 0 
    ? webSources.map((source, index) => 
        `Source ${index + 1}: ${source.source}\nTitle: ${source.title}\nContent: ${source.snippet}\nURL: ${source.url}\nRelevance: ${(source.relevance * 100).toFixed(0)}%`
      ).join('\n\n---\n\n')
    : "No specific web sources found for this statement.";
  
  const prompt = `You are a professional fact-checker. Analyze the following statement using the provided web search results from trusted sources.

Statement to fact-check: "${statement}"

Web sources found:
${webContext}

Based on these web sources ${webSources.length > 0 ? 'and your knowledge' : 'and your knowledge (no specific sources found)'}, provide a comprehensive fact-check analysis in JSON format:

{
  "status": "true" | "questionable" | "fake",
  "confidence": <number between 0.1 and 1.0>,
  "reasoning": "<detailed analysis explaining your verdict>",
  "sources": [
    {
      "name": "<source name>",
      "url": "<source URL>",
      "credibility": "high" | "medium" | "low",
      "summary": "<how this source relates to the statement>"
    }
  ],
  "web_sources_found": ${webSources.length},
  "analysis_method": "${webSources.length > 0 ? 'web_scraping_enhanced' : 'ai_knowledge_only'}"
}

Guidelines:
- Use web sources as primary evidence when available
- If no relevant web sources found, rely on your training knowledge
- Be transparent about evidence quality
- Consider source credibility (Reuters, BBC, AP News = high; others = medium)
- Provide specific reasoning for your verdict`;

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
          content: 'You are a professional fact-checker. Analyze statements using web sources when available and respond with valid JSON only.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.1,
      max_tokens: 1800,
      top_p: 0.9
    })
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(`Groq API error: ${data.error?.message || 'Unknown error'}`);
  }
  
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
  console.log('Web-enhanced fact-check function called:', req.method);
  
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

    console.log('Processing web-enhanced fact-check for:', statement);

    // Step 1: Scrape web sources
    console.log('Scraping web sources...');
    const webSources = await scrapeDirectSources(statement);
    console.log(`Found ${webSources.length} relevant web sources`);
    
    // Step 2: AI analysis with web data
    console.log('Analyzing with AI using web sources...');
    const analysis = await analyzeWithWebSources(statement, webSources);
    
    // Step 3: Save to database
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
              web_sources_found: analysis.web_sources_found,
              analysis_method: analysis.analysis_method,
              source_count: webSources.length
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
                summary: source.summary
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
        id: factCheckId || `web_${Date.now()}`,
        status: analysis.status,
        confidence: analysis.confidence,
        reasoning: analysis.reasoning,
        sources: analysis.sources || [],
        web_sources_found: analysis.web_sources_found || webSources.length,
        analysis_method: analysis.analysis_method || 'web_scraping_enhanced',
        scraping_enabled: true,
        source_count: webSources.length
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Web-enhanced fact-check error:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Web-enhanced fact-checking failed',
        scraping_enabled: false 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});