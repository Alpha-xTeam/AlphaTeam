import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '@/firebase/firebase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import { LogIn, UserPlus, Trash2, Ban, CheckCircle2, Eye, Globe } from 'lucide-react'; // Import icons
import { Badge } from '@/components/ui/badge'; // Assuming you have a Badge component

interface Activity {
  id: string;
  type: string;
  userId?: string;
  username?: string;
  ipAddress?: string;
  details?: string;
  timestamp: any; // Firebase Timestamp
}

const ActivityLog = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Helper function to get icon and color based on activity type
  const getActivityTypeDisplay = (type: string) => {
    switch (type) {
      case 'login':
        return { icon: <LogIn className="h-4 w-4 mr-2" />, text: 'تسجيل دخول', color: 'bg-blue-500' };
      case 'google_login':
        return { icon: <Globe className="h-4 w-4 mr-2" />, text: 'تسجيل دخول (جوجل)', color: 'bg-blue-600' };
      case 'register':
        return { icon: <UserPlus className="h-4 w-4 mr-2" />, text: 'تسجيل جديد', color: 'bg-green-500' };
      case 'google_register':
        return { icon: <Globe className="h-4 w-4 mr-2" />, text: 'تسجيل جديد (جوجل)', color: 'bg-green-600' };
      case 'delete_user':
        return { icon: <Trash2 className="h-4 w-4 mr-2" />, text: 'حذف مستخدم', color: 'bg-red-500' };
      case 'ban_user':
        return { icon: <Ban className="h-4 w-4 mr-2" />, text: 'حظر مستخدم', color: 'bg-yellow-500' };
      case 'unban_user':
        return { icon: <CheckCircle2 className="h-4 w-4 mr-2" />, text: 'إلغاء حظر', color: 'bg-teal-500' };
      case 'page_view':
        return { icon: <Eye className="h-4 w-4 mr-2" />, text: 'زيارة صفحة', color: 'bg-gray-500' };
      case 'user_visit':
        return { icon: <Eye className="h-4 w-4 mr-2" />, text: 'زيارة مستخدم', color: 'bg-purple-500' };
      default:
        return { icon: null, text: type, color: 'bg-gray-400' };
    }
  };

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
      setError("فشل في جلب سجلات الأنشطة.");
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <p className="text-center text-muted-foreground">جاري تحميل سجلات الأنشطة...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">سجل نشاطات الموقع</CardTitle>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <p className="text-center text-muted-foreground">لا توجد نشاطات لعرضها.</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>النوع</TableHead>
                  <TableHead>المستخدم</TableHead>
                  <TableHead>التفاصيل</TableHead>
                  <TableHead>عنوان IP</TableHead>
                  <TableHead>الوقت</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activities.map((activity) => (
                  <TableRow key={activity.id}>
                    <TableCell className="font-medium">
                      <Badge className={`flex items-center justify-center ${getActivityTypeDisplay(activity.type).color}`}>
                        {getActivityTypeDisplay(activity.type).icon}
                        {getActivityTypeDisplay(activity.type).text}
                      </Badge>
                    </TableCell>
                    <TableCell>{activity.username || activity.userId || <span className="text-muted-foreground">غير معروف</span>}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{activity.details || <span className="text-muted-foreground">لا توجد تفاصيل</span>}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{activity.ipAddress || 'غير متوفر'}</TableCell>
                    <TableCell className="text-sm">{activity.timestamp ? format(activity.timestamp.toDate(), 'yyyy-MM-dd HH:mm:ss') : 'N/A'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ActivityLog;
