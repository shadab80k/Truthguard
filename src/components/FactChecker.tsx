
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Loader2, AlertTriangle, CheckCircle, ShieldAlert, ExternalLink, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

type ResultStatus = "loading" | "idle" | "complete";
type TruthStatus = "true" | "questionable" | "fake" | null;

interface ResultData {
  status: TruthStatus;
  confidence: number;
  sources: string[];
  reasoning: string;
}

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
          reasoning: "This statement aligns with verified information from credible sources. Multiple fact-checking organizations have confirmed its accuracy."
        };
      } else if (randomNum < 0.66) {
        resultData = {
          status: "questionable",
          confidence: Math.round((0.4 + Math.random() * 0.3) * 100) / 100,
          sources: ["factcheck.org", "politifact.com"],
          reasoning: "This statement contains some accurate information but may be misleading due to omission of important context or exaggeration of certain aspects."
        };
      } else {
        resultData = {
          status: "fake",
          confidence: Math.round((0.7 + Math.random() * 0.3) * 100) / 100,
          sources: ["snopes.com", "factcheck.org", "politifact.com"],
          reasoning: "This statement contains false information that has been debunked by multiple fact-checking organizations. The claim contradicts established facts and evidence."
        };
      }

      setResult(resultData);
      setStatus("complete");
    }, 2000);
  };

  const getStatusIcon = (status: TruthStatus) => {
    switch (status) {
      case "true":
        return <CheckCircle className="h-6 w-6 text-truth-green" />;
      case "questionable":
        return <AlertTriangle className="h-6 w-6 text-truth-yellow" />;
      case "fake":
        return <ShieldAlert className="h-6 w-6 text-truth-red" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: TruthStatus) => {
    switch (status) {
      case "true":
        return "bg-truth-green/10 text-truth-green border-truth-green/20";
      case "questionable":
        return "bg-truth-yellow/10 text-truth-yellow border-truth-yellow/20";
      case "fake":
        return "bg-truth-red/10 text-truth-red border-truth-red/20";
      default:
        return "";
    }
  };

  const getStatusText = (status: TruthStatus) => {
    switch (status) {
      case "true":
        return t("verified");
      case "questionable":
        return t("questionable");
      case "fake":
        return t("false");
      default:
        return "";
    }
  };

  const copyToClipboard = () => {
    if (!result) return;
    
    const text = `
TruthGuard Analysis:
Statement: "${query}"
Result: ${getStatusText(result.status)}
Confidence: ${result.confidence * 100}%
Reasoning: ${result.reasoning}
Sources: ${result.sources.join(", ")}
    `;
    
    navigator.clipboard.writeText(text);
    
    toast({
      title: "Copied to clipboard",
      description: "Analysis results have been copied to your clipboard",
    });
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
            <div className="flex flex-col gap-4">
              <div className="relative">
                <Input
                  placeholder={t("enterStatement")}
                  className="pl-10 py-6 text-base dark:bg-gray-700 dark:border-gray-600"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleCheck()}
                />
                <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              </div>
              
              <Button 
                className="w-full py-6" 
                onClick={handleCheck}
                disabled={status === "loading"}
              >
                {status === "loading" ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {t("analyzing")}
                  </span>
                ) : t("checkFact")}
              </Button>
            </div>

            <AnimatePresence>
              {status === "loading" && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-6 flex flex-col items-center py-10"
                >
                  <div className="flex justify-center space-x-2 mb-4">
                    <div className="w-3 h-3 rounded-full bg-primary loading-dot"></div>
                    <div className="w-3 h-3 rounded-full bg-primary loading-dot"></div>
                    <div className="w-3 h-3 rounded-full bg-primary loading-dot"></div>
                  </div>
                  <p className="text-muted-foreground text-sm animate-pulse">
                    {t("analyzing")}...
                  </p>
                </motion.div>
              )}

              {status === "complete" && result && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="mt-6 border rounded-lg overflow-hidden dark:border-gray-700"
                >
                  <div className="p-4 flex items-center justify-between border-b dark:border-gray-700">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(result.status)}
                      <div>
                        <h3 className="font-medium">Analysis Result</h3>
                        <p className="text-sm text-muted-foreground">Based on multiple sources</p>
                      </div>
                    </div>
                    <Badge 
                      className={`px-3 py-1 ${getStatusColor(result.status)}`}
                    >
                      {getStatusText(result.status)}
                    </Badge>
                  </div>
                  
                  <div className="p-4 border-b dark:border-gray-700">
                    <h4 className="font-medium mb-2">{t("statement")}</h4>
                    <p className="text-sm bg-muted p-3 rounded dark:bg-gray-700">{query}</p>
                  </div>
                  
                  <div className="p-4 border-b dark:border-gray-700">
                    <h4 className="font-medium mb-2">{t("reasoning")}</h4>
                    <p className="text-sm">{result.reasoning}</p>
                  </div>
                  
                  <div className="p-4 grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-sm mb-2">{t("confidenceScore")}</h4>
                      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${result.confidence * 100}%` }}
                          transition={{ duration: 0.8, delay: 0.1 }}
                          className={`h-full ${
                            result.status === "true" 
                              ? "bg-truth-green" 
                              : result.status === "questionable" 
                                ? "bg-truth-yellow" 
                                : "bg-truth-red"
                          }`}
                        />
                      </div>
                      <p className="text-xs mt-1 text-right">{Math.round(result.confidence * 100)}%</p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-sm mb-2">{t("sources")}</h4>
                      <div className="flex flex-wrap gap-2">
                        {result.sources.map((source, i) => (
                          <Badge key={i} variant="secondary" className="flex items-center gap-1 text-xs dark:bg-gray-700">
                            <ExternalLink className="h-3 w-3" />
                            {source}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
          
          {status === "complete" && result && (
            <CardFooter className="flex justify-end border-t pt-4 dark:border-gray-700">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-2 dark:border-gray-600"
                onClick={copyToClipboard}
              >
                <Copy className="h-4 w-4" />
                <span>{t("copyResults")}</span>
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>
    </section>
  );
}
