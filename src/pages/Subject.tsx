import React, { useState, useEffect } from 'react';
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, BookOpen, FileText, ExternalLink } from "lucide-react";
import { getSubjects, getLectures, getStages } from "@/firebase/firebase";
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

interface LectureData {
  id: string;
  subjectId: string;
  title: string;
  description: string;
  fileUrl: string;
  fileName: string;
  createdAt: any;
}

const Subject = () => {
  const { stageId, subjectId } = useParams<{ stageId: string; subjectId: string }>();
  const [subject, setSubject] = useState<SubjectData | null>(null);
  const [lectures, setLectures] = useState<LectureData[]>([]);
  const [stageName, setStageName] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');

        // Fetch stages to get stage name
        const allStages: StageData[] = await getStages() as StageData[];
        const currentStage = allStages.find(s => s.id === stageId);
        if (currentStage) {
          setStageName(currentStage.name);
        }

        // Fetch subjects
        const allSubjects: SubjectData[] = await getSubjects() as SubjectData[];
        const currentSubject = allSubjects.find(s => s.id === subjectId && s.stageId === stageId);
        setSubject(currentSubject || null);

        if (currentSubject) {
          // Fetch lectures for the current subject
          const subjectLectures: LectureData[] = await getLectures(currentSubject.id) as LectureData[];
          setLectures(subjectLectures);
        }
      } catch (err) {
        console.error("Error fetching data for subject page:", err);
        setError('فشل في جلب بيانات المادة والمحاضرات.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [stageId, subjectId]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-muted-foreground text-lg">جاري تحميل بيانات المادة...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-3xl font-bold text-red-500 mb-4">حدث خطأ</h2>
        <p className="text-muted-foreground mb-8">{error}</p>
        <Link to={`/lectures/${stageId}`} className="text-primary hover:underline flex items-center justify-center">
          <ArrowLeft className="ml-2 h-4 w-4" />
          العودة إلى المرحلة
        </Link>
      </div>
    );
  }

  if (!subject) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-3xl font-bold text-foreground mb-4">المادة غير موجودة.</h2>
        <p className="text-muted-foreground mb-8">
          يبدو أن المادة التي تبحث عنها غير موجودة أو تم حذفها.
        </p>
        <Link to={`/lectures/${stageId}`} className="text-primary hover:underline flex items-center justify-center">
          <ArrowLeft className="ml-2 h-4 w-4" />
          العودة إلى المرحلة
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link to={`/lectures/${stageId}`} className="text-primary hover:underline flex items-center w-fit mb-4">
          <ArrowLeft className="ml-2 h-4 w-4" />
          العودة إلى {stageName || 'المرحلة'}
        </Link>
        <h1 className="text-4xl font-bold text-foreground mb-2 flex items-center">
          <BookOpen className="h-8 w-8 ml-3 text-primary" />
          {subject.name}
        </h1>
        <p className="text-xl text-muted-foreground">
          المحاضرات المتاحة لهذه المادة.
        </p>
      </div>

      {lectures.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="h-20 w-20 text-muted-foreground mx-auto mb-6" />
          <h3 className="text-2xl font-semibold text-foreground mb-2">لا توجد محاضرات حاليًا.</h3>
          <p className="text-muted-foreground">
            يبدو أن هذه المادة لا تحتوي على أي محاضرات حتى الآن.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lectures.map((lecture) => (
            <Card key={lecture.id} className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-xl font-semibold flex items-center">
                  <FileText className="h-5 w-5 ml-2 text-primary" />
                  {lecture.title}
                </CardTitle>
                <CardDescription className="text-muted-foreground mt-2">
                  {lecture.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-end">
                {lecture.fileUrl && (
                  <Button asChild>
                    <a href={lecture.fileUrl} target="_blank" rel="noopener noreferrer" className="flex items-center">
                      عرض المحاضرة
                      <ExternalLink className="mr-2 h-4 w-4" />
                    </a>
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Subject;
