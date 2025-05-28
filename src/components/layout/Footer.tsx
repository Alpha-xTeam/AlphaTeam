import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-card text-foreground border-t border-border py-12">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Section 1: Logo and Description */}
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center shadow-md">
              <span className="text-primary-foreground font-bold text-xl">A</span>
            </div>
            <h3 className="text-2xl font-bold">Alpha Team</h3>
          </div>
          <p className="text-muted-foreground text-sm leading-relaxed">
            منصة شاملة لمساعدة الطلاب في الوصول إلى المحاضرات والمواد الدراسية بسهولة ويسر.
            نهدف إلى توفير تجربة تعليمية متميزة ومنظمة لجميع المراحل الدراسية.
          </p>
        </div>

        {/* Section 2: Quick Links */}
        <div>
          <h4 className="text-lg font-semibold mb-4">روابط سريعة</h4>
          <ul className="space-y-2 text-muted-foreground">
            <li><Link to="/" className="hover:text-primary transition-colors duration-300">الرئيسية</Link></li>
            <li><Link to="/lectures" className="hover:text-primary transition-colors duration-300">المحاضرات</Link></li>
            <li><Link to="/about" className="hover:text-primary transition-colors duration-300">عنّا</Link></li>
            <li><Link to="/contact" className="hover:text-primary transition-colors duration-300">اتصل بنا</Link></li>
          </ul>
        </div>

        {/* Section 3: Contact Info */}
        <div>
          <h4 className="text-lg font-semibold mb-4">اتصل بنا</h4>
          <ul className="space-y-2 text-muted-foreground">
            <li className="flex items-center">
              <Mail className="h-4 w-4 mr-2 text-primary" />
              <span>info@alphateam.com</span>
            </li>
            <li className="flex items-center">
              <Phone className="h-4 w-4 mr-2 text-primary" />
              <span>+964 770 123 4567</span>
            </li>
            <li className="flex items-center">
              <MapPin className="h-4 w-4 mr-2 text-primary" />
              <span>بغداد، العراق</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Alpha Team. جميع الحقوق محفوظة.</p>
      </div>
    </footer>
  );
};

export default Footer;
