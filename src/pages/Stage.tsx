
import React, { useState, useEffect } from 'react';
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, BookOpen, GraduationCap } from "lucide-react";
import { getSubjects, getStages } from "@/firebase/firebase";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface StageData {
  id: string;
  name: string;
}

interface SubjectData {
  id: string;
  name: string;
  stageId: string;
  createdAt: any;
}

const Stage = () => {
  const { stageId } = useParams<{ stageId: string }>();
  const [stage, setStage] = useState<StageData | null>(null);
  const [subjects, setSubjects] = useState<SubjectData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');

        // Fetch stages
        const allStages: StageData[] = await getStages() as StageData[];
        const currentStage = allStages.find(s => s.id === stageId);
        setStage(currentStage || null);

        if (currentStage) {
          // Fetch subjects for the current stage
          const allSubjects: SubjectData[] = await getSubjects() as SubjectData[];
          const stageSubjects = allSubjects.filter(s => s.stageId === currentStage.id);
          setSubjects(stageSubjects);
        }
      } catch (err) {
        console.error("Error fetching data for stage page:", err);
        setError('فشل في جلب بيانات المرحلة والمواد.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [stageId]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-muted-foreground text-lg">جاري تحميل بيانات المرحلة...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-3xl font-bold text-red-500 mb-4">حدث خطأ</h2>
        <p className="text-muted-foreground mb-8">{error}</p>
        <Link to="/lectures" className="text-primary hover:underline flex items-center justify-center">
          <ArrowLeft className="ml-2 h-4 w-4" />
          العودة إلى المراحل
        </Link>
      </div>
    );
  }

  if (!stage) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-3xl font-bold text-foreground mb-4">المرحلة غير موجودة.</h2>
        <p className="text-muted-foreground mb-8">
          يبدو أن المرحلة التي تبحث عنها غير موجودة أو تم حذفها.
        </p>
        <Link to="/lectures" className="text-primary hover:underline flex items-center justify-center">
          <ArrowLeft className="ml-2 h-4 w-4" />
          العودة إلى المراحل
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link to="/lectures" className="text-primary hover:underline flex items-center w-fit mb-4">
          <ArrowLeft className="ml-2 h-4 w-4" />
          العودة إلى المراحل
        </Link>
        <h1 className="text-4xl font-bold text-foreground mb-2 flex items-center">
          <GraduationCap className="h-8 w-8 ml-3 text-primary" />
          مرحلة {stage.name}
        </h1>
        <p className="text-xl text-muted-foreground">
          المواد المتاحة لهذه المرحلة.
        </p>
      </div>

      {subjects.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="h-20 w-20 text-muted-foreground mx-auto mb-6" />
          <h3 className="text-2xl font-semibold text-foreground mb-2">لا توجد مواد حاليًا.</h3>
          <p className="text-muted-foreground">
            يبدو أن هذه المرحلة لا تحتوي على أي مواد حتى الآن.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((subject) => (
            <Card key={subject.id} className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-xl font-semibold flex items-center">
                  <BookOpen className="h-5 w-5 ml-2 text-primary" />
                  {subject.name}
                </CardTitle>
                <CardDescription className="text-muted-foreground mt-2">
                  استكشف المحاضرات المتاحة لهذه المادة.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-end">
                <Button asChild>
                  <Link to={`/lectures/${stage.id}/${subject.id}`} className="flex items-center">
                    عرض المحاضرات
                    <ArrowLeft className="mr-2 h-4 w-4 rotate-180" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Stage;
