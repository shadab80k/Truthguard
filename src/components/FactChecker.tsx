
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
import { XCircle, AlertTriangle } from 'lucide-react';

type ResultStatus = "loading" | "idle" | "complete" | "error";

export default function FactChecker() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<ResultStatus>("idle");
  const [result, setResult] = useState<ResultData | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
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

      // Call the fact-check function
      const { data, error } = await supabase.functions.invoke('fact-check', {
        body: { statement: query, userId }
      });

      if (error) {
        console.error('Error from Supabase function:', error);
        
        // Check if it's a quota exceeded error
        if (error.message && (error.message.includes('quota') || error.status === 402)) {
          setErrorMessage("Google AI API quota exceeded. Please try again later or contact support to update your API key.");
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
              Get instant fact-checking results with Google AI-powered analysis
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
                  {errorMessage.includes('quota') || errorMessage.includes('API key') ? (
                    <AlertTriangle className="h-4 w-4" />
                  ) : (
                    <XCircle className="h-4 w-4" />
                  )}
                  <AlertTitle>
                    {errorMessage.includes('quota') || errorMessage.includes('API key') ? 'API Limit Reached' : 'Error checking facts'}
                  </AlertTitle>
                  <AlertDescription>{errorMessage}</AlertDescription>
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
