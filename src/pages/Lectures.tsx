
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, GraduationCap } from "lucide-react";
import { getStages } from "@/firebase/firebase"; // Import getStages

interface StageData {
  id: string;
  name: string;
  description?: string; // Add description as it's used in the component
  color?: string; // Add color as it's used in the component
}

const Lectures = () => {
  const [stages, setStages] = useState<StageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStagesData = async () => {
      try {
        setLoading(true);
        setError('');
        const stagesList: StageData[] = await getStages() as StageData[];
        // Sort stages based on their name (e.g., "المرحلة الأولى", "المرحلة الثانية")
        const sortedStages = stagesList.sort((a, b) => {
          const getStageNumber = (name: string) => {
            const match = name.match(/المرحلة (\S+)/);
            if (match && match[1]) {
              const arabicNumerals: { [key: string]: number } = {
                'الأولى': 1, 'الثانية': 2, 'الثالثة': 3, 'الرابعة': 4,
                'الخامسة': 5, 'السادسة': 6, 'السابعة': 7, 'الثامنة': 8,
                'التاسعة': 9, 'العاشرة': 10
              };
              return arabicNumerals[match[1]] || Infinity; // Return number or Infinity if not found
            }
            return Infinity; // If no match, put it at the end
          };
          return getStageNumber(a.name) - getStageNumber(b.name);
        });
        setStages(sortedStages);
      } catch (err) {
        console.error("Error fetching stages:", err);
        setError('فشل في جلب المراحل الدراسية.');
      } finally {
        setLoading(false);
      }
    };

    fetchStagesData();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-muted-foreground text-lg">جاري تحميل المراحل الدراسية...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-3xl font-bold text-red-500 mb-4">حدث خطأ</h2>
        <p className="text-muted-foreground mb-8">{error}</p>
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <GraduationCap className="h-12 w-12 text-primary mr-3" />
            <h2 className="text-4xl font-bold text-foreground">المحاضرات</h2>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            اختر المرحلة الدراسية للوصول إلى المواد والمحاضرات المطلوبة
          </p>
        </div>

        {/* Stages Grid */}
        {stages.length === 0 ? (
          <div className="text-center py-12">
            <GraduationCap className="h-20 w-20 text-muted-foreground mx-auto mb-6" />
            <h3 className="text-2xl font-semibold text-foreground mb-2">لا توجد مراحل دراسية حاليًا.</h3>
            <p className="text-muted-foreground">
              يبدو أنه لم يتم إضافة أي مراحل دراسية حتى الآن.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stages.map((stage) => (
              <Link key={stage.id} to={`/lectures/${stage.id}`}>
                <Card className="shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer">
                  <CardHeader className="text-center">
                    <div className={`w-16 h-16 ${stage.color || 'bg-gray-500'} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-inner`}>
                      <GraduationCap className="h-8 w-8 text-primary-foreground" />
                    </div>
                    <CardTitle className="text-xl font-semibold text-foreground">{stage.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className={`flex items-center justify-center font-medium text-${stage.color?.split('-')[1] || 'gray'}-600`}>
                      <span>عرض المواد</span>
                      <ArrowRight className={`mr-2 h-4 w-4 text-${stage.color?.split('-')[1] || 'gray'}-600`} />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Lectures;
