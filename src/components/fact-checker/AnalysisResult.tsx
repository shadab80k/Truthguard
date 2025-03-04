
import { motion } from 'framer-motion';
import { CheckCircle, AlertTriangle, ShieldAlert, ExternalLink, Copy } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';

export type TruthStatus = "true" | "questionable" | "fake" | null;

export interface ResultData {
  status: TruthStatus;
  confidence: number;
  sources: string[];
  reasoning: string;
}

interface AnalysisResultProps {
  result: ResultData;
  query: string;
}

export default function AnalysisResult({ result, query }: AnalysisResultProps) {
  const { t } = useLanguage();
  const { toast } = useToast();

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
