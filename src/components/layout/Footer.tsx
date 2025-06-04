import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Mail, Phone, MapPin, Instagram, Send } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/data/translations';

const Footer = () => {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <footer className="bg-card text-foreground border-t border-border py-8 md:py-12">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Section 1: Logo and Description */}
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-8 md:w-10 h-8 md:h-10 rounded-lg flex items-center justify-center shadow-md">
              <img 
                src="https://res.cloudinary.com/dmao2zbvt/image/upload/v1748569111/tgcdnvngwpqqdz8cbxhm.png" 
                alt="Alpha Team Logo" 
                className="w-full h-full object-contain rounded-lg"
              />
            </div>
            <h3 className="text-xl md:text-2xl font-bold">Alpha Team</h3>
          </div>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            {t.platformDescription}
          </p>
        </div>

        {/* Section 2: Quick Links */}
        <div>
          <h4 className="text-lg font-semibold mb-4">{language === 'en' ? 'Quick Links' : 'روابط سريعة'}</h4>
          <ul className="space-y-2 text-muted-foreground">
            <li><Link to="/" className="hover:text-primary transition-colors duration-300">{t.home}</Link></li>
            <li><Link to="/lectures" className="hover:text-primary transition-colors duration-300">{t.lectures}</Link></li>
            <li><Link to="/about" className="hover:text-primary transition-colors duration-300">{t.about}</Link></li>
            <li><Link to="/contact" className="hover:text-primary transition-colors duration-300">{t.contact}</Link></li>
          </ul>
        </div>

        {/* Section 3: Contact Info */}
        <div>
          <h4 className="text-lg font-semibold mb-4">{language === 'en' ? 'Contact Us' : 'اتصل بنا'}</h4>
          <ul className="space-y-2 text-muted-foreground">
            <li className="flex items-center">
              <Mail className="h-4 w-4 mr-2 text-primary" />
              <span>alphateam.dev1234@gmail.com</span>
            </li>
           
            <li className="flex items-center">
              <MapPin className="h-4 w-4 mr-2 text-primary" />
              <span>{language === 'en' ? 'Babil, Iraq' : 'بابل, العراق'}</span>
            </li>
            <li className="flex items-center">
              <Instagram className="h-4 w-4 mr-2 text-primary" />
              <a 
                href="https://www.instagram.com/talpha.dev" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors duration-300"
              >
                @talpha.dev
              </a>
            </li>
            <li className="flex items-center">
              <Send className="h-4 w-4 mr-2 text-primary" />
              <a 
                href="https://t.me/xteam_alpha" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors duration-300"
              >
                @xteam_alpha
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-8 pt-8 border-t border-border text-center text-xs md:text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Alpha Team. {language === 'en' ? 'All rights reserved.' : 'جميع الحقوق محفوظة.'}</p>
      </div>
    </footer>
  );
};

export default Footer;
