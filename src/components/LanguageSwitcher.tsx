import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../data/translations';
import { Button } from "@/components/ui/button";

export const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleLanguage}
      className="h-10 w-10 rounded-full border-2 border-primary/50 bg-background shadow-lg hover:shadow-xl hover:border-primary hover:bg-background/95 transition-all duration-300"
    >
      <span className="text-sm font-semibold text-primary">
        {language === 'en' ? 'عربي' : 'EN'}
      </span>
    </Button>
  );
}; 