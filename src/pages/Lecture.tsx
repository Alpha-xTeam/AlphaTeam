import React, { useState, useEffect } from 'react';
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { getLectures } from '@/firebase/firebase';
import { getSubjects, getStages, auth } from '@/firebase/firebase'; // Import auth
import { Button } from "@/components/ui/button"; // Import Button component
import { logActivity } from '@/firebase/activityLogger'; // Import logActivity

interface LectureData {
  id: string;
  subjectId: string;
  title: string;
  description: string;
  fileId: string; // MEGA File ID
  fileUrl: string; // MEGA File URL
  fileName: string;
  createdAt: any;
}

interface SubjectData {
  id: string;
  name: string;
  stageId: string;
  createdAt: any;
}

interface StageData {
  id: string;
  name: string;
}

const Lecture = () => {
  const { stageId, subjectId, lectureId } = useParams();
  const [lecture, setLecture] = useState<LectureData | null>(null);
  const [subject, setSubject] = useState<SubjectData | null>(null);
  const [stage, setStage] = useState<StageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLectureData = async () => {
      setLoading(true);
      setError('');
      try {
        const allLectures: LectureData[] = await getLectures(subjectId);
        const foundLecture = allLectures.find(l => l.id === lectureId);

        if (foundLecture) {
          setLecture(foundLecture);
          // Fetch subject and stage data for display
          const subjectsList: SubjectData[] = await getSubjects();
          const foundSubject = subjectsList.find(s => s.id === foundLecture.subjectId);
          setSubject(foundSubject || null);

          if (foundSubject) {
            const stagesList: StageData[] = await getStages();
            const foundStage = stagesList.find(st => st.id === foundSubject.stageId);
            setStage(foundStage || null);
          }

          // Removed automatic download. User will click the button.
        } else {
          setError('المحاضرة غير موجودة.');
        }
      } catch (err) {
        console.error("Error fetching lecture data:", err);
        setError('فشل في جلب بيانات المحاضرة.');
      } finally {
        setLoading(false);
      }
    };

    fetchLectureData();
  }, [stageId, subjectId, lectureId]);

  const handleDownload = async () => {
    if (lecture?.fileUrl) {
      const link = document.createElement('a');
      link.href = lecture.fileUrl;
      link.download = lecture.fileName || "lecture.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Log activity for download
      if (auth.currentUser) {
        await logActivity({
          type: 'download_lecture',
          userId: auth.currentUser.uid,
          username: auth.currentUser.email || 'N/A',
          details: `المستخدم ${auth.currentUser.email} قام بتنزيل المحاضرة: ${lecture.title}`,
        });
      }
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-muted-foreground text-lg">جاري تحميل المحاضرة...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-3xl font-bold text-red-500 mb-4">خطأ: {error}</h2>
        <p className="text-muted-foreground mb-8">
          حدث خطأ أثناء جلب المحاضرة.
        </p>
        <Link to={`/lectures/${stageId}/${subjectId}`} className="text-primary hover:underline flex items-center justify-center">
          <ArrowLeft className="ml-2 h-4 w-4" />
          العودة إلى المادة
        </Link>
      </div>
    );
  }

  if (!lecture) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-3xl font-bold text-foreground mb-4">المحاضرة غير موجودة حاليًا.</h2>
        <p className="text-muted-foreground mb-8">
          يبدو أن هذه المحاضرة غير متاحة أو لا توجد محاضرات في هذه المادة.
        </p>
        <Link to={`/lectures/${stageId}/${subjectId}`} className="text-primary hover:underline flex items-center justify-center">
          <ArrowLeft className="ml-2 h-4 w-4" />
          العودة إلى المادة
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Link to={`/lectures/${stageId}/${subjectId}`} className="text-primary hover:underline flex items-center">
          <ArrowLeft className="ml-2 h-5 w-5" />
          العودة إلى {subject?.name || 'المادة'}
        </Link>
      </div>

      <h1 className="text-4xl font-bold text-foreground mb-4">{lecture.title}</h1>
      <p className="text-muted-foreground text-lg mb-6">{lecture.description}</p>

      {lecture.fileUrl ? (
        <div className="flex flex-col items-center">
          <Button
            onClick={handleDownload} // Changed to Button with onClick
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 mb-4"
          >
            تنزيل المحاضرة
          </Button>
          <div className="w-full h-[80vh] bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg">
            {/* Using an iframe to embed the PDF */}
            <iframe
              src={lecture.fileUrl}
              className="w-full h-full border-none"
              title={lecture.fileName || "Lecture PDF"}
              allowFullScreen
            ></iframe>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 border rounded-lg bg-card text-muted-foreground">
          <p className="text-xl">لا يوجد ملف محاضرة متاح للعرض.</p>
          <p className="mt-2">الرجاء التأكد من تحميل الملف بشكل صحيح.</p>
        </div>
      )}
    </div>
  );
};

export default Lecture;
