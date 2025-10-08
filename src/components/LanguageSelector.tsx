
import { useLanguage, Language } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe } from "lucide-react";

const languages = [
  { code: "en", name: "English", available: true },
  { code: "hi", name: "हिंदी", available: false },
  { code: "es", name: "Español", available: false },
  { code: "fr", name: "Français", available: false },
];

export default function LanguageSelector() {
  const { language, setLanguage } = useLanguage();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Select language">
          <Globe className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => lang.available && setLanguage(lang.code as Language)}
            disabled={!lang.available}
            className={language === lang.code ? "bg-muted" : ""}
          >
            <span className="flex items-center justify-between w-full">
              {lang.name}
              {!lang.available && (
                <span className="ml-2 text-xs text-muted-foreground">(Coming Soon)</span>
              )}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
