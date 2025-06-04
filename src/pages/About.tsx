import React from 'react';
import Layout from "@/components/layout/Layout";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Users, MessageCircle } from "lucide-react";
import { Instagram, Send } from "lucide-react"; // Send = Telegram style icon
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/data/translations';

const TEAM_INSTAGRAM = "https://instagram.com/alpha_team.iq";
const TEAM_TELEGRAM = "https://t.me/alphateam_iq";

const teamMembers = [
  {
    name: "حسين حيدر",
    role: {
      en: "Team Founder",
      ar: "مؤسس الفريق"
    },
    img: "https://res.cloudinary.com/dmao2zbvt/image/upload/v1748567698/bghcpeiacxnthdxgiup6.jpg",
    link: "https://linktr.ee/hsabadix",
  },
  {
    name: "حسنين عباس",
    role: {
      en: "Assistant Leader",
      ar: "قائد مساعد"
    },
    img: "https://res.cloudinary.com/dmao2zbvt/image/upload/v1748567698/uhen7u7sr3aa2rx1uxpa.jpg",
    link: "https://linktr.ee/4pv_1",
  },
  {
    name: "كرار امير",
    role: {
      en: "Development Team Lead",
      ar: "رئيس فريق التطوير"
    },
    img: "https://res.cloudinary.com/dmao2zbvt/image/upload/v1748571325/cka4s6p8geysflkp2s77.jpg",
    link: "http://Linktr.ee/wski4",
  },
  {
    name: "حسن علي",
    role: {
      en: "Development Team Member",
      ar: "عضو فريق التطوير"
    },
    img: "https://res.cloudinary.com/dmao2zbvt/image/upload/v1748568146/jcs4zyfsmg7xqyllzcmb.jpg",
    link: "https://linktr.ee/Hasan.21",
  },
  {
    name: "همام علي",
    role: {
      en: "Development Team Member",
      ar: "عضو فريق التطوير"
    },
    img: "https://res.cloudinary.com/dmao2zbvt/image/upload/v1748571325/ni2wrrr54v2ep3pnef2v.jpg",
    link: "https://linktr.ee/humam1500",
  },
  {
    name: "حسين محمد",
    role: {
      en: "Development Team Member",
      ar: "عضو فريق التطوير"
    },
    img: "https://res.cloudinary.com/dmao2zbvt/image/upload/v1748571324/zyfjcos1xkgtrixnwfia.jpg",
    link: "https://linktr.ee/Dve_Hussein",
  },
  {
    name: "ايلاف محمد",
    role: {
      en: "Media Team Member",
      ar: "فريق الاعلام"
    },
    img: "https://res.cloudinary.com/dmao2zbvt/image/upload/v1748618880/qwbvrxcuo700z8zdqi2g.jpg",
    link: "https://linktr.ee/elaf_8",
  },
  {
    name: "سجاد فراس",
    role: {
      en: "Media Team Member",
      ar: "فريق الاعلام"
    },
    img: "https://res.cloudinary.com/dmao2zbvt/image/upload/v1748571325/wqltditgxyk9skpksxxo.jpg",
    link: "https://linktr.ee/sa_is1",
  },
  {
    name: "سيف حسام",
    role: {
      en: "Media Team Member",
      ar: "فريق الاعلام"
    },
    img: "https://res.cloudinary.com/dmao2zbvt/image/upload/v1748571325/gt1tologlhpmtor694nk.jpg",
    link: "https://linktr.ee/xalpha_team",
  },
  {
    name: "اوس ياس",
    role: {
      en: "Media Team Member",
      ar: "فريق الاعلام"
    },
    img: "https://res.cloudinary.com/dmao2zbvt/image/upload/v1748571324/wg9xa205iy3oxgknzome.jpg",
    link: "https://linktr.ee/awsyaas",
  },
  {
    name: "ايهم مهدي",
    role: {
      en: "Media Team Member",
      ar: "فريق الاعلام"
    },
    img: "https://res.cloudinary.com/dmao2zbvt/image/upload/v1748571324/xzlcssrx6wpjy7rwpbg8.jpg",
    link: "https://linktr.ee/null4",
  },
];

const About = () => {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center mb-12">
          <Users className="h-16 w-16 text-primary mb-4" />
          <h1 className="text-4xl md:text-5xl font-extrabold text-primary mb-4 text-center">
            {language === 'en' ? 'About Alpha Team' : 'عن Alpha Team'}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground text-center max-w-2xl">
            {t.aboutUsDesc}
          </p>
          {/* حسابات الفريق */}
          <div className="flex gap-4 mt-6">
            <a
              href={TEAM_INSTAGRAM}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="rounded-full bg-primary/10 hover:bg-primary/20 text-primary p-3 transition"
            >
              <Instagram className="h-6 w-6" />
            </a>
            <a
              href={TEAM_TELEGRAM}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Telegram"
              className="rounded-full bg-primary/10 hover:bg-primary/20 text-primary p-3 transition"
            >
              <Send className="h-6 w-6" />
            </a>
          </div>
        </div>
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-primary mb-6 text-center">
            {language === 'en' ? 'Our Team' : 'فريق العمل'}
          </h2>
          {/* قائد الفريق في الأعلى */}
          <div className="flex justify-center mb-10">
            <Card className="w-full max-w-md text-center shadow-lg border-0 bg-card/90 rounded-2xl">
              <CardHeader>
                <img
                  src={teamMembers[0].img}
                  alt={teamMembers[0].name}
                  className="w-28 h-28 rounded-full mx-auto mb-4 border-2 border-primary object-cover"
                />
                <CardTitle className="text-xl font-bold text-primary">{teamMembers[0].name}</CardTitle>
                <CardDescription className="text-muted-foreground">{teamMembers[0].role[language]}</CardDescription>
              </CardHeader>
              <CardContent>
                <a
                  href={teamMembers[0].link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-4 py-2 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition text-sm font-medium"
                >
                  <MessageCircle className="h-4 w-4" />
                  {language === 'en' ? 'Contact' : 'تواصل'}
                </a>
              </CardContent>
            </Card>
          </div>
          {/* باقي الفريق */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {teamMembers.slice(1).map((member, idx) => (
              <Card key={idx} className="text-center shadow-md border-0 bg-card/80 rounded-2xl">
                <CardHeader>
                  <img
                    src={member.img}
                    alt={member.name}
                    className="w-24 h-24 rounded-full mx-auto mb-4 border-2 border-primary object-cover"
                  />
                  <CardTitle className="text-lg font-bold text-primary">{member.name}</CardTitle>
                  <CardDescription className="text-muted-foreground">{member.role[language]}</CardDescription>
                </CardHeader>
                <CardContent>
                  <a
                    href={member.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-4 py-2 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition text-sm font-medium"
                  >
                    <MessageCircle className="h-4 w-4" />
                    {language === 'en' ? 'Contact' : 'تواصل'}
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default About;