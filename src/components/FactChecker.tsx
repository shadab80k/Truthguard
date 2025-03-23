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

type ResultStatus = "loading" | "idle" | "complete";

export default function FactChecker() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<ResultStatus>("idle");
  const [result, setResult] = useState<ResultData | null>(null);
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

    try {
      // Get current user (if logged in)
      const { data: { user } } = await supabase.auth.getUser();
      const userId = user?.id;

      // Call the fact-check function
      const { data, error } = await supabase.functions.invoke('fact-check', {
        body: { statement: query, userId }
      });

      if (error) {
        throw new Error(error.message);
      }

      // Add a short delay to show the loading animation (can be removed in production)
      setTimeout(() => {
        setResult(data);
        setStatus("complete");
      }, 1000);

    } catch (error) {
      console.error('Error during fact checking:', error);
      toast({
        title: "Error checking facts",
        description: error.message || "There was an error processing your request",
        variant: "destructive",
      });
      setStatus("idle");
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
