import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import AnalysisResult, { ResultData } from './fact-checker/AnalysisResult';
import LoadingIndicator from './fact-checker/LoadingIndicator';
import FactCheckerForm from './fact-checker/FactCheckerForm';
import { supabase } from '@/integrations/supabase/client';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { XCircle, AlertTriangle, Globe, Search, Zap } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

type ResultStatus = "loading" | "idle" | "complete" | "error";

interface AdvancedResultData extends ResultData {
  evidence_score?: number;
  cross_reference_count?: number;
  source_count?: number;
  scraping_enabled?: boolean;
}

export default function AdvancedFactChecker() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<ResultStatus>("idle");
  const [result, setResult] = useState<AdvancedResultData | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [useAdvanced, setUseAdvanced] = useState(false);
  const { toast } = useToast();
  const { t } = useLanguage();

  const handleCheck = async () => {
    if (!query.trim()) {
      toast({
        title: "Please enter a statement",
        description: "Enter a statement or news headline to fact-check",
        variant: "destructive",
      });
      return;
    }

    setStatus("loading");
    setResult(null);
    setErrorMessage(null);

    try {
      // Get current user (if logged in)
      const { data: { user } } = await supabase.auth.getUser();
      const userId = user?.id;

      // Choose function based on mode
      const functionName = useAdvanced ? 'fact-check-web-improved' : 'fact-check';
      
      console.log(`Using ${functionName} for fact-checking...`);

      // Call the appropriate fact-check function
      const { data, error } = await supabase.functions.invoke(functionName, {
        body: { statement: query, userId }
      });

      if (error) {
        console.error(`Error from ${functionName} function:`, error);
        
        // Enhanced error handling
        if (error.message && (error.message.includes('quota') || error.status === 402 || error.status === 429)) {
          setErrorMessage("API quota exceeded. Please try again later or contact support.");
        } else if (error.status >= 500) {
          setErrorMessage("Server error. The fact-checking service is currently unavailable. Please try again later.");
        } else if (error.status === 404) {
          setErrorMessage("Fact-checking service not found. Please ensure the function is properly deployed.");
        } else {
          setErrorMessage(`Error: ${error.message || "Failed to check facts"}`);
        }
        
        setStatus("error");
        return;
      }

      if (!data) {
        setErrorMessage("No data returned from fact-checking service");
        setStatus("error");
        return;
      }

      // Show success toast for advanced mode
      if (useAdvanced && data.source_count) {
        toast({
          title: "Advanced Analysis Complete!",
          description: `Analyzed ${data.source_count} real sources for enhanced accuracy`,
        });
      }

      // Add a short delay to show the loading animation
      setTimeout(() => {
        setResult(data);
        setStatus("complete");
      }, 1000);

    } catch (error) {
      console.error('Exception during fact checking:', error);
      setErrorMessage(error.message || "There was an unexpected error processing your request");
      setStatus("error");
    }
  };

  return (
    <section id="fact-checker" className="py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <Badge variant="outline" className="mb-4 px-3 py-1 text-primary">
            {useAdvanced ? "Advanced AI + Web Scraping" : "Standard AI Analysis"}
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t("verifyStatement")}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {useAdvanced 
              ? "Get AI analysis powered by real-time web scraping from trusted news sources and fact-checking websites."
              : "Enter any statement, news headline, or claim to get an AI-powered analysis of its credibility in seconds."
            }
          </p>
        </div>

        <Card className="shadow-soft mx-auto overflow-hidden transition-all duration-300 hover:shadow-xl border-t-4 border-t-primary dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-medium flex items-center gap-2">
                  {useAdvanced ? (
                    <>
                      <Globe className="h-5 w-5 text-primary" />
                      TruthGuard Advanced
                    </>
                  ) : (
                    <>
                      <Zap className="h-5 w-5 text-primary" />
                      TruthGuard Analyzer
                    </>
                  )}
                </CardTitle>
                <CardDescription>
                  {useAdvanced
                    ? "Real-time web scraping + AI analysis for maximum accuracy"
                    : "Get instant fact-checking results with Google AI-powered analysis"
                  }
                </CardDescription>
              </div>
              
              <div className="flex items-center space-x-2">
                <Label htmlFor="advanced-mode" className="text-sm font-medium">
                  Advanced Mode
                </Label>
                <Switch
                  id="advanced-mode"
                  checked={useAdvanced}
                  onCheckedChange={setUseAdvanced}
                  disabled={status === "loading"}
                />
              </div>
            </div>

            {useAdvanced && (
              <div className="mt-3 p-3 bg-primary/5 rounded-lg border border-primary/10">
                <div className="flex items-center gap-2 text-sm text-primary font-medium mb-1">
                  <Search className="h-4 w-4" />
                  Advanced Features Enabled
                </div>
                <div className="text-xs text-muted-foreground space-y-1">
                  <div>• Direct web scraping from Reuters, BBC, AP News</div>
                  <div>• Real-time search through fact-checking websites</div>
                  <div>• Cross-reference with Snopes and other trusted sources</div>
                  <div>• Relevance scoring and credibility analysis</div>
                </div>
              </div>
            )}
          </CardHeader>
          <CardContent className="pt-4">
            <FactCheckerForm 
              query={query}
              setQuery={setQuery}
              handleCheck={handleCheck}
              isLoading={status === "loading"}
            />

            <AnimatePresence>
              {status === "loading" && (
                <div className="space-y-4">
                  <LoadingIndicator />
                  {useAdvanced && (
                    <div className="text-center text-sm text-muted-foreground">
                      <div className="animate-pulse">
                        {status === "loading" && (
                          <div className="space-y-2">
                            <div>🔍 Scraping Reuters, BBC, AP News...</div>
                            <div>🔎 Searching fact-check websites...</div>
                            <div>🤖 AI analyzing web sources...</div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {status === "error" && errorMessage && (
                <Alert variant="destructive" className="mt-6">
                  {errorMessage.includes('quota') || errorMessage.includes('API key') || errorMessage.includes('traffic') ? (
                    <AlertTriangle className="h-4 w-4" />
                  ) : (
                    <XCircle className="h-4 w-4" />
                  )}
                  <AlertTitle>
                    {errorMessage.includes('quota') || errorMessage.includes('API key') ? 'API Limit Reached' : 
                    errorMessage.includes('traffic') || errorMessage.includes('service') ? 'Service Unavailable' : 'Error checking facts'}
                  </AlertTitle>
                  <AlertDescription>{errorMessage}</AlertDescription>
                </Alert>
              )}

              {status === "complete" && result && (
                <div className="space-y-4">
                  <AnalysisResult result={result} query={query} />
                  
                  {/* Advanced Mode Results Display */}
                  {useAdvanced && result.scraping_enabled && (
                    <Card className="border-2 border-primary/20 bg-primary/5">
                      <CardContent className="pt-4">
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          <Globe className="h-4 w-4 text-primary" />
                          Advanced Analysis Results
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                            <div className="font-bold text-lg text-primary">{result.source_count || 0}</div>
                            <div className="text-muted-foreground">Sources Analyzed</div>
                          </div>
                          <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                            <div className="font-bold text-lg text-primary">{result.evidence_score || 0}%</div>
                            <div className="text-muted-foreground">Evidence Score</div>
                          </div>
                          <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                            <div className="font-bold text-lg text-primary">{result.cross_reference_count || 0}</div>
                            <div className="text-muted-foreground">Cross-References</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}