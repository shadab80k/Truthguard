
import { Search, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/contexts/LanguageContext';

interface FactCheckerFormProps {
  query: string;
  setQuery: (query: string) => void;
  handleCheck: () => void;
  isLoading: boolean;
}

export default function FactCheckerForm({ query, setQuery, handleCheck, isLoading }: FactCheckerFormProps) {
  const { t } = useLanguage();

  return (
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
        disabled={isLoading}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            {t("analyzing")}
          </span>
        ) : t("checkFact")}
      </Button>
    </div>
  );
}
