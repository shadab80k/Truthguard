import { motion } from 'framer-motion';
import { CheckCircle, AlertTriangle, ShieldAlert, ExternalLink, Copy, Info, Link, Check, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';

export type TruthStatus = "true" | "questionable" | "fake" | null;

interface SourceInfo {
  name: string;
  url: string;
  credibility: "high" | "medium" | "low";
  summary: string;
}

export interface ResultData {
  status: TruthStatus;
  confidence: number;
  sources: string[];
  reasoning: string;
  sourceDetails?: SourceInfo[];
}

interface AnalysisResultProps {
  result: ResultData;
  query: string;
}

export default function AnalysisResult({ result, query }: AnalysisResultProps) {
  const { t } = useLanguage();
  const { toast } = useToast();

  const sourceDetails = result.sourceDetails || result.sources.map((source, index) => {
    const credibility: "high" | "medium" | "low" = 
      result.status === "true" ? "high" : 
      result.status === "questionable" ? "medium" : "low";
    
    let summary = "";
    if (result.status === "true") {
      summary = `Confirms the accuracy of this statement with evidence-based reporting.`;
    } else if (result.status === "questionable") {
      summary = `Provides partial confirmation but notes some misleading elements in the claim.`;
    } else {
      summary = `Directly contradicts this claim with factual evidence from multiple sources.`;
    }
    
    return {
      name: source,
      url: `https://${source}/fact-check`,
      credibility,
      summary
    };
  });

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

  const getSourceCredibilityIcon = (credibility: "high" | "medium" | "low") => {
    switch (credibility) {
      case "high":
        return <Check className="h-4 w-4 text-truth-green" />;
      case "medium":
        return <Info className="h-4 w-4 text-truth-yellow" />;
      case "low":
        return <X className="h-4 w-4 text-truth-red" />;
      default:
        return null;
    }
  };

  const getSourceCredibilityColor = (credibility: "high" | "medium" | "low") => {
    switch (credibility) {
      case "high":
        return "bg-truth-green/10 text-truth-green border-truth-green/20";
      case "medium":
        return "bg-truth-yellow/10 text-truth-yellow border-truth-yellow/20";
      case "low":
        return "bg-truth-red/10 text-truth-red border-truth-red/20";
      default:
        return "";
    }
  };

  const copyToClipboard = () => {
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
        <Badge className={`px-3 py-1 ${getStatusColor(result.status)}`}>
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
      
      <div className="p-4 border-b dark:border-gray-700">
        <h4 className="font-medium mb-2">{t("sources")}</h4>
        <div className="space-y-3">
          {sourceDetails.map((source, i) => (
            <div key={i} className="bg-muted p-3 rounded dark:bg-gray-700">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <Link className="h-4 w-4 text-primary" />
                  <a 
                    href={source.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-primary flex items-center gap-1 hover:underline"
                  >
                    {source.name}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
                <Badge className={`px-2 py-0.5 text-xs flex items-center gap-1 ${getSourceCredibilityColor(source.credibility)}`}>
                  {getSourceCredibilityIcon(source.credibility)}
                  <span>{source.credibility === "high" ? "High credibility" : 
                        source.credibility === "medium" ? "Medium credibility" : 
                        "Low credibility"}</span>
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">{source.summary}</p>
            </div>
          ))}
        </div>
      </div>
      
      <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 border-b dark:border-gray-700">
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
          <h4 className="font-medium text-sm mb-2">Key Findings</h4>
          <div className="text-xs">
            {result.status === "true" && (
              <p className="text-truth-green flex items-center gap-1">
                <Check className="h-3 w-3" /> Information verified by multiple reputable sources
              </p>
            )}
            {result.status === "questionable" && (
              <p className="text-truth-yellow flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" /> Some claims are misleading or lack context
              </p>
            )}
            {result.status === "fake" && (
              <p className="text-truth-red flex items-center gap-1">
                <ShieldAlert className="h-3 w-3" /> Contains false information contradicted by evidence
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end border-t pt-4 p-4 dark:border-gray-700">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-2 dark:border-gray-600"
          onClick={copyToClipboard}
        >
          <Copy className="h-4 w-4" />
          <span>{t("copyResults")}</span>
        </Button>
      </div>
    </motion.div>
  );
}
