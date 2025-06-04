import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, Timestamp } from 'firebase/firestore';
import { db } from '@/firebase/firebase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LogIn, UserPlus, Trash2, Ban, CheckCircle2, 
  FileText, BookOpen, Edit, AlertCircle 
} from 'lucide-react';

interface Activity {
  id: string;
  type: string;
  userId?: string;
  username?: string;
  ipAddress?: string;
  details?: string;
  subjectName?: string;
  lectureTitle?: string;
  stageName?: string;
  timestamp: Timestamp;
}

const ActivityLog = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'activities'), orderBy('timestamp', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedActivities: Activity[] = [];
      snapshot.forEach((doc) => {
        fetchedActivities.push({ id: doc.id, ...doc.data() } as Activity);
      });
      setActivities(fetchedActivities);
      setLoading(false);
    }, (err) => {
      console.error("Error fetching activities:", err);
      setError("فشل في جلب سجلات الأنشطة");
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const getActivityTypeInfo = (type: string) => {
    const types = {
      'register': { icon: UserPlus, color: 'bg-green-500', text: 'تسجيل حساب جديد' },
      'add_lecture': { icon: FileText, color: 'bg-blue-500', text: 'إضافة محاضرة' },
      'delete_lecture': { icon: Trash2, color: 'bg-red-500', text: 'حذف محاضرة' },
      'add_subject': { icon: BookOpen, color: 'bg-purple-500', text: 'إضافة مادة' },
      'delete_subject': { icon: Trash2, color: 'bg-red-500', text: 'حذف مادة' },
      'update_lecture': { icon: Edit, color: 'bg-yellow-500', text: 'تعديل محاضرة' },
      'update_subject': { icon: Edit, color: 'bg-yellow-500', text: 'تعديل مادة' },
      'delete_user_by_admin': { icon: Trash2, color: 'bg-red-500', text: 'حذف مستخدم' },
      'ban_user_by_admin': { icon: Ban, color: 'bg-red-500', text: 'حظر مستخدم' },
      'unban_user': { icon: CheckCircle2, color: 'bg-green-500', text: 'إلغاء حظر مستخدم' }
    };
    return types[type] || { icon: AlertCircle, color: 'bg-gray-500', text: type };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Card className="shadow-lg">
      <CardContent className="p-0">
        <div className="divide-y divide-border">
          <AnimatePresence>
            {activities.map((activity) => {
              const typeInfo = getActivityTypeInfo(activity.type);
              const Icon = typeInfo.icon;

              return (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="p-4 hover:bg-accent/50 transition-colors"
                >
                  <button
                    onClick={() => {
                      setSelectedActivity(activity);
                      setDialogOpen(true);
                    }}
                    className="w-full text-right"
                  >
                    <div className="flex items-center gap-4">
                      <Badge className={`${typeInfo.color} p-2`}>
                        <Icon className="h-4 w-4 text-white" />
                      </Badge>
                      <div className="flex-1">
                        <p className="font-semibold text-foreground">{typeInfo.text}</p>
                        <p className="text-sm text-muted-foreground">
                          {format(activity.timestamp.toDate(), 'PPpp', { locale: ar })}
                        </p>
                        {activity.details && (
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                            {activity.details}
                          </p>
                        )}
                      </div>
                    </div>
                  </button>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </CardContent>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold mb-4">تفاصيل النشاط</DialogTitle>
          </DialogHeader>
          {selectedActivity && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="font-semibold text-primary">نوع النشاط</p>
                  <p>{getActivityTypeInfo(selectedActivity.type).text}</p>
                </div>
                <div className="space-y-2">
                  <p className="font-semibold text-primary">المستخدم</p>
                  <p>{selectedActivity.username || 'غير معروف'}</p>
                </div>
              </div>

              {selectedActivity.subjectName && (
                <div className="space-y-2">
                  <p className="font-semibold text-primary">المادة</p>
                  <p>{selectedActivity.subjectName}</p>
                </div>
              )}

              {selectedActivity.lectureTitle && (
                <div className="space-y-2">
                  <p className="font-semibold text-primary">المحاضرة</p>
                  <p>{selectedActivity.lectureTitle}</p>
                </div>
              )}

              <div className="space-y-2">
                <p className="font-semibold text-primary">التفاصيل</p>
                <p>{selectedActivity.details || 'لا توجد تفاصيل إضافية'}</p>
              </div>

              <div className="space-y-2">
                <p className="font-semibold text-primary">الوقت</p>
                <p>{format(selectedActivity.timestamp.toDate(), 'PPpp', { locale: ar })}</p>
              </div>

              {selectedActivity.ipAddress && (
                <div className="space-y-2">
                  <p className="font-semibold text-primary">عنوان IP</p>
                  <p className="font-mono">{selectedActivity.ipAddress}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setDialogOpen(false)}>إغلاق</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default ActivityLog;
