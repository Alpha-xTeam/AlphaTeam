import React from 'react';
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Users, Star, ArrowRight, Sparkles, Newspaper, Calendar, BookMarked, Award } from "lucide-react";
import Footer from "@/components/layout/Footer";
import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "@/firebase/firebase";
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/data/translations';

interface NewsItem {
  id: string;
  title: string;
  description: string;
  imageUrls: string[];
  createdAt: any;
  tag?: string;
  likes: number;
}

const Index = () => {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = translations[language];

  useEffect(() => {
    const fetchLatestNews = async () => {
      try {
        setLoading(true);
        // Create a query to get the latest 3 news items
        const newsRef = collection(db, "news");
        const q = query(
          newsRef,
          orderBy("createdAt", "desc"), // Order by creation date descending
          limit(3) // Limit to 3 items
        );

        const querySnapshot = await getDocs(q);
        const latestNews = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<NewsItem, "id">),
        }));

        setNewsItems(latestNews);
      } catch (error) {
        console.error("Error fetching latest news:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestNews();
  }, []);

  const handleNewsClick = (newsId: string) => {
    console.log('Navigating to news with ID:', newsId);
    navigate(`/news/${newsId}`);
  };

  const handleAllNewsClick = () => {
    console.log('Navigating to /news');
    navigate('/news');
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-screen container mx-auto px-4 py-20 overflow-hidden bg-gradient-to-b from-background via-background/95 to-muted">
        {/* Animated background particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-primary/20 rounded-full"
              initial={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
              }}
              animate={{
                y: [0, -100],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        {/* Decorative background elements with enhanced animations */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.3, scale: 1 }}
          transition={{ duration: 2, ease: "easeOut", repeat: Infinity, repeatType: "reverse" }}
          className="absolute top-10 left-10 w-32 h-32 bg-primary rounded-full mix-blend-multiply filter blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.3, scale: 1 }}
          transition={{ duration: 2, ease: "easeOut", repeat: Infinity, repeatType: "reverse", delay: 0.5 }}
          className="absolute bottom-10 right-10 w-40 h-40 bg-secondary rounded-full mix-blend-multiply filter blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.3, scale: 1 }}
          transition={{ duration: 2, ease: "easeOut", repeat: Infinity, repeatType: "reverse", delay: 1 }}
          className="absolute top-1/4 right-20 w-28 h-28 bg-accent rounded-full mix-blend-multiply filter blur-3xl"
        />

        <div className="relative z-10 text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="inline-block"
          >
            <span className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4 mr-2" />
              {t.welcomeMessage}
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-5xl md:text-6xl font-extrabold text-foreground mb-6 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary"
          >
            <span className="text-primary">ALPHA TEAM</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
          >
            {t.platformDescription}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.8, type: "spring" }}
            className="mt-10"
          >
            <Link to="/news">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground px-10 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                {t.startBrowsing}
                <ArrowRight className="mr-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Features with enhanced animations */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {[
            {
              icon: <BookOpen className="h-8 w-8 text-primary" />,
              title: t.organizedLectures,
              description: t.organizedLecturesDesc
            },
            {
              icon: <Users className="h-8 w-8 text-primary" />,
              title: t.specializedTeam,
              description: t.specializedTeamDesc
            },
            {
              icon: <Star className="h-8 w-8 text-primary" />,
              title: t.highQuality,
              description: t.highQualityDesc
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true, amount: 0.5 }}
            >
              <Card className="text-center shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-gradient-to-b from-card to-card/80 backdrop-blur-sm border-primary/20">
                <CardHeader>
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4"
                  >
                    {feature.icon}
                  </motion.div>
                  <CardTitle className="text-xl font-semibold text-foreground">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base text-muted-foreground">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* News Section */}
        <section className="py-20 bg-gradient-to-b from-muted to-background">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary mb-4">
                {t.latestNews}
              </h2>
              <p className="text-xl text-muted-foreground">
                {t.latestNewsDesc}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {loading ? (
                // Loading skeleton
                Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="animate-pulse">
                    <div className="bg-muted rounded-lg h-48 mb-4"></div>
                    <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-muted rounded w-1/2"></div>
                  </div>
                ))
              ) : newsItems.length > 0 ? (
                newsItems.map((news, index) => (
                  <motion.div
                    key={news.id}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.2 }}
                    viewport={{ once: true }}
                  >
                    <Card 
                      className="overflow-hidden hover:shadow-xl transition-all duration-300 h-full cursor-pointer"
                      onClick={() => handleNewsClick(news.id)}
                    >
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={news.imageUrls[0] || "https://placehold.co/600x400"}
                          alt={news.title}
                          className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-300"
                        />
                        {news.tag && (
                          <div className="absolute top-4 right-4 bg-primary/90 text-primary-foreground px-3 py-1 rounded-full text-sm">
                            {news.tag}
                          </div>
                        )}
                      </div>
                      <CardHeader>
                        <div className="flex items-center text-sm text-muted-foreground mb-2">
                          <Calendar className="w-4 h-4 mr-2" />
                          {news.createdAt?.toDate().toLocaleDateString('ar-SA', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </div>
                        <CardTitle className="text-xl font-semibold line-clamp-2">{news.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="flex flex-col justify-between h-full">
                        <CardDescription className="text-base line-clamp-2 mb-4">
                          {news.description}
                        </CardDescription>
                        <div className="mt-auto flex items-center justify-between">
                          <div className="flex items-center text-muted-foreground">
                            <Star className="w-4 h-4 mr-1" />
                            {news.likes}
                          </div>
                          <Button 
                            variant="ghost" 
                            className="text-primary hover:text-primary/80"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleNewsClick(news.id);
                            }}
                          >
                            اقرأ المزيد
                            <ArrowRight className="mr-2 h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-3 text-center py-12">
                  <p className="text-xl text-muted-foreground">لا توجد أخبار حالياً</p>
                </div>
              )}
            </div>

          </div>
        </section>

        {/* About Section with parallax effect */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, amount: 0.3 }}
          className="relative mt-20"
        >
          <Card className="bg-gradient-to-br from-card to-card/80 backdrop-blur-sm border-primary/20 shadow-xl">
            <CardHeader className="text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <CardTitle className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                  {t.aboutUs}
                </CardTitle>
              </motion.div>
            </CardHeader>
            <CardContent className="text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed mb-8">
                  {t.aboutUsDesc}
                </p>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link to="/about">
                    <Button 
                      size="lg" 
                      variant="outline"
                      className="bg-transparent hover:bg-primary/10 text-primary border-primary hover:border-primary/80 px-10 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      {t.readMore}
                      <ArrowRight className="mr-2 h-5 w-5" />
                    </Button>
                  </Link>
                </motion.div>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Call to Action Section */}
        <section className="py-20 bg-gradient-to-b from-muted to-background">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary mb-6">
                {t.joinUs}
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                {t.joinUsDesc}
              </p>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link to="/register">
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground px-10 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    {t.registerNow}
                    <ArrowRight className="mr-2 h-5 w-5" />
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </section>
    </>
  );
};

export default Index;
