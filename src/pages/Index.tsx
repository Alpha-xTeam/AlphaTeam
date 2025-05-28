
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Users, Star, ArrowRight } from "lucide-react";
import Footer from "@/components/layout/Footer"; // Import the new Footer component

const Index = () => {
  return (
    <>
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-extrabold text-foreground mb-6 leading-tight">
            مرحباً بك في <span className="text-primary">Alpha Team</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            منصة شاملة لمساعدة الطلاب في الوصول إلى المحاضرات والمواد الدراسية بسهولة ويسر.
            نهدف إلى توفير تجربة تعليمية متميزة ومنظمة لجميع المراحل الدراسية.
          </p>
          <div className="mt-10">
            <Link to="/lectures">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-10 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
                ابدأ التصفح
                <ArrowRight className="mr-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <Card className="text-center shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
            <CardHeader>
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
                <BookOpen className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-xl font-semibold text-foreground">محاضرات منظمة</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-muted-foreground">
                جميع المحاضرات مرتبة حسب المراحل والمواد لسهولة الوصول والمتابعة
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
            <CardHeader>
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-xl font-semibold text-foreground">فريق متخصص</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-muted-foreground">
                فريق Alpha Team يعمل بجد لتوفير أفضل المواد التعليمية والدعم للطلاب
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
            <CardHeader>
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
                <Star className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-xl font-semibold text-foreground">جودة عالية</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-muted-foreground">
                محتوى عالي الجودة ومحدث باستمرار لضمان أفضل تجربة تعليمية
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* About Alpha Team */}
        <Card className="bg-card shadow-md">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-foreground">من نحن؟</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-lg text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              فريق Alpha Team هو مجموعة من الطلاب والمختصين الذين يهدفون إلى تسهيل العملية التعليمية
              وتوفير الموارد اللازمة لنجاح الطلاب في مسيرتهم الأكاديمية. نحن نؤمن بأن التعليم يجب أن يكون
              متاحاً ومنظماً وسهل الوصول إليه، لذلك أنشأنا هذه المنصة لتكون بيتاً رقمياً لجميع المحاضرات
              والمواد الدراسية المطلوبة في المراحل المختلفة.
            </p>
          </CardContent>
        </Card>
      </section>
    </>
  );
};

export default Index;
