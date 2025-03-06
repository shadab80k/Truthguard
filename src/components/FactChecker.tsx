
import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import AnalysisResult, { ResultData } from './fact-checker/AnalysisResult';
import LoadingIndicator from './fact-checker/LoadingIndicator';
import FactCheckerForm from './fact-checker/FactCheckerForm';

type ResultStatus = "loading" | "idle" | "complete";

export default function FactChecker() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<ResultStatus>("idle");
  const [result, setResult] = useState<ResultData | null>(null);
  const { toast } = useToast();
  const { t } = useLanguage();

  const handleCheck = () => {
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

    // Simulate API call with a delayed response
    setTimeout(() => {
      // Determine randomly whether the statement is true, questionable, or fake for demo purposes
      const randomNum = Math.random();
      let resultData: ResultData;

      if (randomNum < 0.33) {
        resultData = {
          status: "true",
          confidence: Math.round((0.7 + Math.random() * 0.3) * 100) / 100,
          sources: ["reuters.com", "apnews.com", "bbc.com"],
          reasoning: "This statement aligns with verified information from credible sources. Multiple fact-checking organizations have confirmed its accuracy.",
          sourceDetails: [
            {
              name: "reuters.com",
              url: "https://reuters.com/fact-check",
              credibility: "high",
              summary: "Reuters verified this claim through multiple independent sources and official records."
            },
            {
              name: "apnews.com",
              url: "https://apnews.com/fact-check",
              credibility: "high",
              summary: "AP News confirmed the accuracy of this statement with primary source documentation."
            },
            {
              name: "bbc.com",
              url: "https://bbc.com/fact-check",
              credibility: "high",
              summary: "BBC's fact-checking team validated this information through interviews with experts and document analysis."
            }
          ]
        };
      } else if (randomNum < 0.66) {
        resultData = {
          status: "questionable",
          confidence: Math.round((0.4 + Math.random() * 0.3) * 100) / 100,
          sources: ["factcheck.org", "politifact.com"],
          reasoning: "This statement contains some accurate information but may be misleading due to omission of important context or exaggeration of certain aspects.",
          sourceDetails: [
            {
              name: "factcheck.org",
              url: "https://factcheck.org/recent",
              credibility: "medium",
              summary: "FactCheck.org found the core claim has some truth but omits critical context that changes its interpretation."
            },
            {
              name: "politifact.com",
              url: "https://politifact.com/fact-checks",
              credibility: "medium",
              summary: "PolitiFact rates this claim as 'Half True' as it contains elements of truth but exaggerates key details."
            }
          ]
        };
      } else {
        resultData = {
          status: "fake",
          confidence: Math.round((0.7 + Math.random() * 0.3) * 100) / 100,
          sources: ["snopes.com", "factcheck.org", "politifact.com"],
          reasoning: "This statement contains false information that has been debunked by multiple fact-checking organizations. The claim contradicts established facts and evidence.",
          sourceDetails: [
            {
              name: "snopes.com",
              url: "https://snopes.com/fact-check",
              credibility: "high",
              summary: "Snopes has thoroughly debunked this claim and provides contrary evidence from reliable sources."
            },
            {
              name: "factcheck.org",
              url: "https://factcheck.org/recent",
              credibility: "high",
              summary: "This statement has been investigated by FactCheck.org and found to contain demonstrably false information."
            },
            {
              name: "politifact.com",
              url: "https://politifact.com/fact-checks",
              credibility: "high",
              summary: "PolitiFact rates this claim as 'False' based on multiple contradicting pieces of evidence."
            }
          ]
        };
      }

      setResult(resultData);
      setStatus("complete");
    }, 2000);
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
