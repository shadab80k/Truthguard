
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
import { XCircle, AlertTriangle, Info } from 'lucide-react';

type ResultStatus = "loading" | "idle" | "complete" | "error";

export default function FactChecker() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<ResultStatus>("idle");
  const [result, setResult] = useState<ResultData | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
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

      // Call the fact-check function with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

      try {
        // Call the fact-check function
        const { data, error } = await supabase.functions.invoke('fact-check', {
          body: { 
            statement: query, 
            userId,
            retry: retryCount > 0 // Signal to the edge function that this is a retry
          },
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (error) {
          console.error('Error from Supabase function:', error);
          
          // Enhanced error handling for various edge function errors
          if (error.message && (error.message.includes('quota') || error.status === 402 || error.status === 429)) {
            setErrorMessage("AI API quota exceeded. Please try again later or contact support.");
          } else if (error.status >= 500) {
            setErrorMessage("Server error. The fact-checking service is currently unavailable. Please try again later.");
          } else if (error.status === 404) {
            setErrorMessage("Edge function not found. Please ensure the function is properly deployed.");
          } else if (error.message && error.message.includes('AbortError')) {
            setErrorMessage("Request timed out. The AI service may be experiencing high load. Please try again later.");
          } else if (error.message && error.message.includes('Edge Function returned a non-2xx status code')) {
            setErrorMessage("The fact-checking service encountered an error. The API may be experiencing high traffic or maintenance.");
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

        // Add a short delay to show the loading animation (can be removed in production)
        setTimeout(() => {
          setResult(data);
          setStatus("complete");
          // Reset retry count on success
          setRetryCount(0);
        }, 1000);
      } catch (fetchError) {
        clearTimeout(timeoutId);
        
        if (fetchError.name === 'AbortError') {
          setErrorMessage("Request timed out. The AI service may be experiencing high load. Please try again later.");
        } else {
          setErrorMessage(`Network error: ${fetchError.message}`);
        }
        setStatus("error");
      }

    } catch (error) {
      console.error('Exception during fact checking:', error);
      setErrorMessage(error.message || "There was an unexpected error processing your request");
      setStatus("error");
    }
  };

  // Function to retry with fallback service
  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    handleCheck();
  };

  return (
    <section id="fact-checker" className="py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <Badge variant="outline" className="mb-4 px-3 py-1 text-primary">
            Fact Checker
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t("verifyStatement")}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Enter any statement, news headline, or claim to get an AI-powered analysis of its credibility in seconds.
          </p>
        </div>

        <Card className="shadow-soft mx-auto overflow-hidden transition-all duration-300 hover:shadow-xl border-t-4 border-t-primary dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-medium">TruthGuard Analyzer</CardTitle>
            <CardDescription>
              Get instant fact-checking results with AI-powered analysis
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <FactCheckerForm 
              query={query}
              setQuery={setQuery}
              handleCheck={handleCheck}
              isLoading={status === "loading"}
            />

            <AnimatePresence>
              {status === "loading" && <LoadingIndicator />}

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
                  <AlertDescription>
                    <p className="mb-4">{errorMessage}</p>
                    <button 
                      onClick={handleRetry} 
                      className="text-sm underline flex items-center gap-1 hover:text-white"
                    >
                      <Info size={14} />
                      Try again with {retryCount === 0 ? 'alternate AI provider' : 'different parameters'}
                    </button>
                  </AlertDescription>
                </Alert>
              )}

              {status === "complete" && result && (
                <AnalysisResult result={result} query={query} />
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
