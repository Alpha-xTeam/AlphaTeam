import React, { useState, useEffect } from 'react';
import { collection, getDocs, deleteDoc, doc, updateDoc, query, orderBy, limit, onSnapshot, getDoc, where } from 'firebase/firestore';
import { db, auth } from '@/firebase/firebase';
import { logActivity } from '@/firebase/activityLogger';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from 'date-fns';
import { Users, Activity, Trash2, Ban, CalendarIcon, CheckCircle2, XCircle, UserCheck, UserX, UserPlus, BarChart, PieChart, LayoutDashboard, ArrowRightLeft, Sparkles, FileText, Plus, User, Edit, AlertCircle, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ResponsiveContainer, BarChart as RechartsBarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, Legend, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';
import ActivityLog from '@/components/admin/ActivityLog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, BookOpen, File, Upload } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { addSubject, getSubjects, updateSubject, deleteSubject, addLecture, getLectures, updateLecture, deleteLecture } from '@/firebase/firebase';
import { uploadFileToGofile } from '@/firebase/gofile';
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { ar } from 'date-fns/locale';
import { deleteUser } from 'firebase/auth';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose
} from "@/components/ui/sheet";

interface UserData {
  id: string;
  fullName?: string;
  email: string;
  role: string;
  createdAt: any;
  isBanned?: boolean;
  banUntil?: any;
}

interface StageData {
  id: string;
  name: string;
}

interface SubjectData {
  id: string;
  name: string;
  stageId: string;
  course: '1' | '2';
  createdAt: any;
}

interface LectureData {
  id: string;
  subjectId: string;
  title: string;
  description: string;
  fileId: string;
  fileUrl: string;
  fileName: string;
  createdAt: any;
}

interface Activity {
  id: string;
  type: string;
  details: string;
  timestamp: any;
}

const AdminDashboard = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [subjects, setSubjects] = useState<SubjectData[]>([]);
  const [lectures, setLectures] = useState<LectureData[]>([]);
  const [stages, setStages] = useState<StageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedBanDate, setSelectedBanDate] = useState<Date | undefined>(undefined);
  const [userToBan, setUserToBan] = useState<UserData | null>(null);
  const currentUserId = auth.currentUser?.uid;
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);
  const { toast } = useToast();
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedStageFilter, setSelectedStageFilter] = useState<string>('all');

  const [newSubjectName, setNewSubjectName] = useState('');
  const [newSubjectStage, setNewSubjectStage] = useState('');
  const [newSubjectCourse, setNewSubjectCourse] = useState<'1' | '2'>('2');
  const [editingSubject, setEditingSubject] = useState<SubjectData | null>(null);

  const [newLectureTitle, setNewLectureTitle] = useState('');
  const [newLectureDescription, setNewLectureDescription] = useState('');
  const [newLectureFile, setNewLectureFile] = useState<File | null>(null);
  const [newLectureSubject, setNewLectureSubject] = useState('');
  const [newLectureStage, setNewLectureStage] = useState('');
  const [editingLecture, setEditingLecture] = useState<LectureData | null>(null);

  const [recentActivities, setRecentActivities] = useState<Activity[]>([]);

  const [activeTab, setActiveTab] = useState('users');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');
      const usersCollectionRef = collection(db, "users");
      const querySnapshot = await getDocs(usersCollectionRef);
      const usersList: UserData[] = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data() as Omit<UserData, 'id'>
      }));
      setUsers(usersList);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError('فشل في جلب بيانات المستخدمين.');
    } finally {
      setLoading(false);
    }
  };

  const fetchSubjects = async () => {
    try {
      const subjectsList: any = await getSubjects();
      setSubjects(subjectsList);
    } catch (err) {
      console.error("Error fetching subjects:", err);
      toast({
        title: "خطأ",
        description: "فشل في جلب المواد.",
        variant: "destructive",
      });
    }
  };

  const fetchLectures = async () => {
    try {
      const lecturesList: LectureData[] = await getLectures();
      // ترتيب المحاضرات من الأقدم إلى الأحدث
      const sortedLectures = lecturesList.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt.toMillis()) : new Date(0);
        const dateB = b.createdAt ? new Date(b.createdAt.toMillis()) : new Date(0);
        return dateA.getTime() - dateB.getTime();
      });
      setLectures(sortedLectures);
    } catch (err) {
      console.error("Error fetching lectures:", err);
      toast({
        title: "خطأ",
        description: "فشل في جلب المحاضرات.",
        variant: "destructive",
      });
    }
  };

  const fetchStages = async () => {
    try {
      const stagesCollectionRef = collection(db, "stages");
      const querySnapshot = await getDocs(stagesCollectionRef);
      const stagesList: StageData[] = querySnapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name,
      }));
      setStages(stagesList);
    } catch (err) {
      console.error("Error fetching stages:", err);
      toast({
        title: "خطأ",
        description: "فشل في جلب المراحل الدراسية.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchSubjects();
    fetchLectures();
    fetchStages();

    // Fetch current user's role
    const fetchCurrentUserRole = async () => {
      const user = auth.currentUser;
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
          setCurrentUserRole(docSnap.data().role);
        }
      }
    };
    fetchCurrentUserRole();

    // جلب آخر 5 نشاطات
    const q = query(
      collection(db, 'activities'), 
      orderBy('timestamp', 'desc'), 
      limit(5)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedActivities = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Activity[];
      setRecentActivities(fetchedActivities);
    });

    return () => unsubscribe();
  }, []);

  const handleDeleteUser = async (userId: string) => {
    try {
      const userToDelete = users.find(u => u.id === userId);
      if (!userToDelete) {
        console.warn("User not found in the current state.");
        return;
      }

      // 1. Delete user's activities
      const activitiesQuery = query(collection(db, "activities"), where("userId", "==", userId));
      const activitiesSnapshot = await getDocs(activitiesQuery);
      const deleteActivitiesPromises = activitiesSnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deleteActivitiesPromises);

      // 2. Delete user's lectures (if they created any)
      const lecturesQuery = query(collection(db, "lectures"), where("createdBy", "==", userId));
      const lecturesSnapshot = await getDocs(lecturesQuery);
      const deleteLecturesPromises = lecturesSnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deleteLecturesPromises);

      // 3. Delete user's subjects (if they created any)
      const subjectsQuery = query(collection(db, "subjects"), where("createdBy", "==", userId));
      const subjectsSnapshot = await getDocs(subjectsQuery);
      const deleteSubjectsPromises = subjectsSnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deleteSubjectsPromises);

      // 4. Delete user's news (if they created any)
      const newsQuery = query(collection(db, "news"), where("createdBy", "==", userId));
      const newsSnapshot = await getDocs(newsQuery);
      const deleteNewsPromises = newsSnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deleteNewsPromises);

      // 5. Delete user document from Firestore
      await deleteDoc(doc(db, "users", userId));

      // 6. Try to delete user from Firebase Auth
      try {
        // Get the user's auth token
        // const userToDeleteAuth = await auth.getUser(userId); // This is an Admin SDK function
        // if (userToDeleteAuth) {
        //   await deleteUser(userToDeleteAuth); // This requires Admin SDK or a special token
        // }
        console.warn("Client-side Firebase Auth user deletion is not supported. User must be deleted from Auth via Admin SDK.");
      } catch (authError) {
        console.warn("Could not delete user from Auth:", authError);
        // Continue with the process even if Auth deletion fails
      }

      // 7. If the deleted user is currently logged in, sign them out
      if (auth.currentUser?.uid === userId) {
        await auth.signOut();
      }

      // Update the local state to remove the user without reloading
      setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));

      // Log the activity
      await logActivity({
        type: 'delete_user_by_admin',
        userId: auth.currentUser?.uid,
        username: auth.currentUser?.email || 'N/A',
        details: `المالك ${auth.currentUser?.email} حذف المستخدم ${userToDelete.fullName || userToDelete.email} وجميع بياناته من النظام.`,
      });

      // Show a success toast
      toast({
        title: "تم حذف المستخدم",
        description: `تم حذف المستخدم (${userToDelete.fullName || userToDelete.email}) وجميع بياناته من النظام بنجاح.`,
        variant: "default",
      });
    } catch (err) {
      console.error("Error deleting user:", err);
      setError('فشل في حذف المستخدم.');
      toast({
        title: "خطأ",
        description: "فشل في حذف المستخدم وجميع بياناته.",
        variant: "destructive",
      });
    }
  };

  const handleBanUser = async (user: UserData) => {
    setUserToBan(user);
    setSelectedBanDate(undefined);
  };

  const confirmBanUser = async () => {
    if (!userToBan) return;

    try {
      const userRef = doc(db, "users", userToBan.id);
      await updateDoc(userRef, {
        isBanned: true,
        banUntil: selectedBanDate || null,
      });
      setUsers(users.map(u => u.id === userToBan.id ? { ...u, isBanned: true, banUntil: selectedBanDate } : u));
      setUserToBan(null);
      setSelectedBanDate(undefined);

      await logActivity({
        type: 'ban_user_by_admin',
        userId: auth.currentUser?.uid,
        username: auth.currentUser?.email || 'N/A',
        details: `المسؤول ${auth.currentUser?.email} حظر المستخدم ${userToBan.fullName || userToBan.email} حتى ${selectedBanDate ? format(selectedBanDate, 'yyyy-MM-dd') : 'أجل غير مسمى'}.`,
      });

    } catch (err) {
      console.error("Error banning user:", err);
      setError('فشل في حظر المستخدم.');
    }
  };

  const handleUnbanUser = async (userId: string) => {
    try {
      const userToUnban = users.find(u => u.id === userId);
      if (!userToUnban) return;

      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, {
        isBanned: false,
        banUntil: null,
      });
      setUsers(users.map(u => u.id === userId ? { ...u, isBanned: false, banUntil: null } : u));

    } catch (err) {
      console.error("Error unbanning user:", err);
      setError('فشل في إلغاء حظر المستخدم.');
    }
  };

  const handleUploadLecture = async (file: File) => {
    try {
      setError('');
      setLoading(true);

      // Log file details for debugging
      console.log('Uploading file:', {
        name: file.name,
        size: file.size,
        type: file.type,
      });

      // Upload the file to GoFile
      const { fileId, fileName, fileUrl } = await uploadFileToGofile(file);

      console.log('File uploaded successfully:', { fileId, fileName, fileUrl });

      // Add lecture details to Firestore
      await addLecture(newLectureSubject, newLectureTitle, newLectureDescription, file);

      toast({
        title: "نجاح",
        description: "تم رفع المحاضرة بنجاح.",
      });

      // Clear form fields
      setNewLectureTitle('');
      setNewLectureDescription('');
      setNewLectureSubject('');
      setNewLectureFile(null);

      // Refresh lectures list
      fetchLectures();
    } catch (err: any) {
      console.error('Error uploading lecture:', err);

      // Display error details in the toast
      toast({
        title: "خطأ",
        description: `فشل في رفع الملف: ${err.message || 'خطأ غير معروف'}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMoveSubjectCourse = async (subject: SubjectData) => {
    try {
      const newCourse = subject.course === '1' ? '2' : '1';
      await updateSubject(subject.id, subject.name, subject.stageId, newCourse);
      toast({
        title: "نجاح",
        description: `تم نقل المادة "${subject.name}" إلى ${newCourse === '1' ? 'الكورس الأول' : 'الكورس الثاني'}.`,
      });
      fetchSubjects();
    } catch (err) {
      console.error("Error moving subject course:", err);
      toast({
        title: "خطأ",
        description: "فشل في نقل المادة إلى كورس آخر.",
        variant: "destructive",
      });
    }
  };

  const handleRoleChange = async (userId: string, newRole: 'admin' | 'user') => {
    try {
      const userToUpdate = users.find(u => u.id === userId);
      if (!userToUpdate) {
        console.warn("User not found in the current state.");
        return;
      }

      // Update user role in Firestore
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, {
        role: newRole,
        updatedAt: new Date()
      });

      // Update local state
      setUsers(users.map(u => 
        u.id === userId ? { ...u, role: newRole } : u
      ));

      // Log the activity
      await logActivity({
        type: 'change_user_role',
        userId: auth.currentUser?.uid,
        username: auth.currentUser?.email || 'N/A',
        details: `المالك ${auth.currentUser?.email} قام بتغيير رتبة المستخدم ${userToUpdate.fullName || userToUpdate.email} إلى ${newRole === 'admin' ? 'مسؤول' : 'مستخدم'}.`,
      });

      // Show success toast
      toast({
        title: "تم تغيير الرتبة",
        description: `تم تغيير رتبة المستخدم (${userToUpdate.fullName || userToUpdate.email}) إلى ${newRole === 'admin' ? 'مسؤول' : 'مستخدم'} بنجاح.`,
        variant: "default",
      });
    } catch (err) {
      console.error("Error changing user role:", err);
      toast({
        title: "خطأ",
        description: "فشل في تغيير رتبة المستخدم.",
        variant: "destructive",
      });
    }
  };

  const totalUsers = users.length;
  const activeUsers = users.filter(user => !user.isBanned).length;
  const bannedUsers = users.filter(user => user.isBanned).length;

  const roleDistributionData = [
    { name: 'مسؤول', value: users.filter(u => u.role === 'admin').length },
    { name: 'مستخدم', value: users.filter(u => u.role === 'user').length },
  ];

  const userStatusData = [
    { name: 'نشط', value: activeUsers },
    { name: 'محظور', value: bannedUsers },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const filteredLectures = lectures.filter(lecture =>
    selectedSubject === 'all' || lecture.subjectId === selectedSubject
  );

  const stats = [
    { label: "عدد المستخدمين", value: users.length, icon: <Users className="h-7 w-7 text-primary" /> },
    { label: "عدد المحاضرات", value: lectures.length, icon: <FileText className="h-7 w-7 text-primary" /> },
    { label: "عدد المواد", value: subjects.length, icon: <BookOpen className="h-7 w-7 text-primary" /> },
  ];

  const getActivityTypeInfo = (type: string) => {
    const types = {
      'register': { text: 'تسجيل حساب جديد', color: 'bg-green-500', icon: UserPlus },
      'add_lecture': { text: 'إضافة محاضرة', color: 'bg-blue-500', icon: FileText },
      'delete_lecture': { text: 'حذف محاضرة', color: 'bg-red-500', icon: Trash2 },
      'add_subject': { text: 'إضافة مادة', color: 'bg-purple-500', icon: BookOpen },
      'delete_subject': { text: 'حذف مادة', color: 'bg-red-500', icon: Trash2 },
      'update_lecture': { text: 'تعديل محاضرة', color: 'bg-yellow-500', icon: Edit },
      'update_subject': { text: 'تعديل مادة', color: 'bg-yellow-500', icon: Edit },
      'delete_user_by_admin': { text: 'حذف مستخدم', color: 'bg-red-500', icon: Trash2 },
      'ban_user_by_admin': { text: 'حظر مستخدم', color: 'bg-red-500', icon: Ban },
      'unban_user': { text: 'إلغاء حظر مستخدم', color: 'bg-green-500', icon: CheckCircle2 }
    };
    return types[type] || { text: 'نشاط غير معروف', color: 'bg-gray-500', icon: AlertCircle };
  };

  const renderRecentActivities = () => null; // Remove recent activities from the main dashboard

  return (
    <div className="container mx-auto py-8 animate-fade-in">
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative rounded-2xl bg-gradient-to-r from-primary/80 to-primary/40 p-8 mb-8 flex items-center shadow-lg overflow-hidden"
      >
        <Sparkles className="absolute right-6 top-6 text-white/30 h-16 w-16 animate-pulse" />
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 flex items-center gap-2">
            <LayoutDashboard className="h-8 w-8 text-white/90" />
            لوحة تحكم المسؤول
          </h1>
          <p className="text-lg text-white/80">مرحبًا بك في لوحة التحكم. يمكنك إدارة المستخدمين، المواد، والمحاضرات بكل سهولة واحترافية.</p>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * idx, duration: 0.6, type: "spring" }}
            className="dashboard-card flex items-center gap-4 p-6 bg-background/80 hover:scale-[1.03] transition-transform"
          >
            <div className="flex-shrink-0">{stat.icon}</div>
            <div>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <div className="text-muted-foreground">{stat.label}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Existing Dashboard Sections */}
      <div className="md:hidden flex justify-end mb-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64">
            <SheetHeader>
              <SheetTitle>لوحة التحكم</SheetTitle>
              <SheetDescription>
                انتقل بين أقسام لوحة التحكم.
              </SheetDescription>
            </SheetHeader>
            <div className="flex flex-col space-y-4 py-6">
              <SheetClose asChild>
                <Button variant="ghost" className="justify-start" onClick={() => setActiveTab('users')}>
                  <Users className="h-5 w-5 ml-2" /> إدارة المستخدمين
                </Button>
              </SheetClose>
              <SheetClose asChild>
                <Button variant="ghost" className="justify-start" onClick={() => setActiveTab('subjects')}>
                  <BookOpen className="h-5 w-5 ml-2" /> إدارة المواد
                </Button>
              </SheetClose>
              <SheetClose asChild>
                <Button variant="ghost" className="justify-start" onClick={() => setActiveTab('lectures')}>
                  <FileText className="h-5 w-5 ml-2" /> إدارة المحاضرات
                </Button>
              </SheetClose>
              <SheetClose asChild>
                <Button variant="ghost" className="justify-start" onClick={() => setActiveTab('activities')}>
                  <Activity className="h-5 w-5 ml-2" /> سجل النشاطات
                </Button>
              </SheetClose>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <Tabs defaultValue="users" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="hidden md:grid md:grid-cols-4 gap-0 mb-8 p-1 bg-muted rounded-lg">
          <TabsTrigger value="users" className="flex items-center justify-center data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all">
            <Users className="h-5 w-5 ml-2" />
            إدارة المستخدمين
          </TabsTrigger>
          <TabsTrigger value="subjects" className="flex items-center justify-center data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all">
            <BookOpen className="h-5 w-5 ml-2" />
            إدارة المواد
          </TabsTrigger>
          <TabsTrigger value="lectures" className="flex items-center justify-center data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all">
            <FileText className="h-5 w-5 ml-2" />
            إدارة المحاضرات
          </TabsTrigger>
          <TabsTrigger value="activities" className="flex items-center justify-center data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all">
            <Activity className="h-5 w-5 ml-2" />
            سجل النشاطات
          </TabsTrigger>
        </TabsList>

        {/* Users Section */}
        <TabsContent value="users" className="space-y-6">
          <Card className="shadow-lg hover:shadow-xl transition-all">
            <CardHeader className="p-6">
              <CardTitle className="text-xl font-semibold flex items-center">
                <Users className="h-6 w-6 ml-2 text-primary" />
                قائمة المستخدمين
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table className="admin-dashboard-table">
                  <TableHeader>
                    <TableRow>
                      <TableHead>الاسم</TableHead>
                      <TableHead>البريد الإلكتروني</TableHead>
                      <TableHead>الدور</TableHead>
                      <TableHead>الحالة</TableHead>
                      <TableHead className="text-right">الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.fullName || '-'}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          {user.role === 'owner' ? 'المالك' : user.role === 'admin' ? 'مسؤول' : 'مستخدم'}
                        </TableCell>
                        <TableCell>
                          {user.isBanned ? (
                            <span className="text-red-500">محظور</span>
                          ) : (
                            <span className="text-green-600">نشط</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right space-x-2 rtl:space-x-reverse">
                          {currentUserRole === 'owner' && user.role !== 'owner' && user.id !== currentUserId && (
                            <>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="destructive"
                                    size="icon"
                                  >
                                    <Trash2 className="h-5 w-5" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>هل أنت متأكد من حذف هذا المستخدم؟</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      هذا الإجراء لا يمكن التراجع عنه. سيتم حذف المستخدم نهائياً من النظام.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>إلغاء</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDeleteUser(user.id)}>تأكيد الحذف</AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                              
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className={user.role === 'admin' ? 'text-yellow-500 hover:text-yellow-600' : 'text-blue-500 hover:text-blue-600'}
                                  >
                                    {user.role === 'admin' ? <UserX className="h-5 w-5" /> : <UserCheck className="h-5 w-5" />}
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      {user.role === 'admin' ? 'إلغاء صلاحيات المسؤول' : 'ترقية إلى مسؤول'}
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      {user.role === 'admin' 
                                        ? 'هل أنت متأكد من إلغاء صلاحيات المسؤول عن هذا المستخدم؟'
                                        : 'هل أنت متأكد من ترقية هذا المستخدم إلى مسؤول؟'}
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>إلغاء</AlertDialogCancel>
                                    <AlertDialogAction 
                                      onClick={() => handleRoleChange(user.id, user.role === 'admin' ? 'user' : 'admin')}
                                    >
                                      {user.role === 'admin' ? 'إلغاء الصلاحيات' : 'ترقية'}
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </>
                          )}
                          {user.isBanned ? (
                            <Button
                              variant="outline"
                              onClick={() => handleUnbanUser(user.id)}
                              size="icon"
                            >
                              <CheckCircle2 className="h-5 w-5 text-green-600" />
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              onClick={() => handleBanUser(user)}
                              size="icon"
                            >
                              <Ban className="h-5 w-5 text-red-500" />
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Subjects Section */}
        <TabsContent value="subjects">
          <Card className="shadow-lg hover:shadow-xl transition-all">
            <CardHeader className="p-6">
              <CardTitle className="text-xl font-semibold flex items-center">
                <BookOpen className="h-6 w-6 ml-2 text-primary" />
                إدارة المواد
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* نموذج إضافة مادة */}
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  try {
                    const subjectId = await addSubject(newSubjectName, newSubjectStage, newSubjectCourse);
                    toast({
                      title: "نجاح الإضافة",
                      description: "تم إضافة المادة بنجاح.",
                    });
                    fetchSubjects();
                  } catch (error) {
                    console.error("Error adding subject: ", error);
                    toast({
                      title: "خطأ",
                      description: "حدث خطأ أثناء إضافة المادة.",
                      variant: "destructive",
                    });
                  }
                }}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    placeholder="اسم المادة"
                    value={newSubjectName}
                    onChange={(e) => setNewSubjectName(e.target.value)}
                  />
                  <Select
                    value={newSubjectStage}
                    onValueChange={(value) => setNewSubjectStage(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر المرحلة" />
                    </SelectTrigger>
                    <SelectContent>
                      {stages.map((stage) => (
                        <SelectItem key={stage.id} value={stage.id}>
                          {stage.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select
                    value={newSubjectCourse}
                    onValueChange={(value) => setNewSubjectCourse(value as '1' | '2')}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الكورس" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">الكورس الأول</SelectItem>
                      <SelectItem value="2">الكورس الثاني</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" className="w-full">
                  إضافة مادة
                </Button>
              </form>
              {/* جدول المواد */}
              <div className="overflow-x-auto mt-6">
                <Table className="admin-dashboard-table">
                  <TableHeader>
                    <TableRow>
                      <TableHead>اسم المادة</TableHead>
                      <TableHead>المرحلة</TableHead>
                      <TableHead>الكورس</TableHead>
                      <TableHead className="text-right">الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {subjects.map((subject) => (
                      <TableRow key={subject.id}>
                        <TableCell>{subject.name}</TableCell>
                        <TableCell>
                          {stages.find((stage) => stage.id === subject.stageId)?.name || '-'}
                        </TableCell>
                        <TableCell>{subject.course === '1' ? 'الكورس الأول' : 'الكورس الثاني'}</TableCell>
                        <TableCell className="text-right space-x-2 rtl:space-x-reverse">
                          <Button variant="outline" onClick={() => handleMoveSubjectCourse(subject)} size="icon">
                            <ArrowRightLeft className="h-5 w-5" />
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={async () => {
                              try {
                                await deleteSubject(subject.id);
                                toast({
                                  title: "نجاح",
                                  description: "تم حذف المادة بنجاح",
                                });
                                fetchSubjects();
                              } catch (error) {
                                console.error("Error deleting subject: ", error);
                                toast({
                                  title: "خطأ",
                                  description: "فشل حذف المادة",
                                  variant: "destructive",
                                });
                              }
                            }}
                            size="icon"
                          >
                            <Trash2 className="h-5 w-5" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Lectures Section */}
        <TabsContent value="lectures">
          <Card className="shadow-lg hover:shadow-xl transition-all">
            <CardHeader className="p-6">
              <CardTitle className="text-xl font-semibold flex items-center">
                <FileText className="h-6 w-6 ml-2 text-primary" />
                إدارة المحاضرات
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* نموذج إضافة محاضرة */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!newLectureSubject) {
                    toast({
                      title: "خطأ",
                      description: "يرجى اختيار المادة للمحاضرة",
                      variant: "destructive",
                    });
                    return;
                  }
                  if (newLectureFile) {
                    handleUploadLecture(newLectureFile);
                  }
                }}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Input
                    placeholder="عنوان المحاضرة"
                    value={newLectureTitle}
                    onChange={(e) => setNewLectureTitle(e.target.value)}
                  />
                  <Input
                    placeholder="وصف المحاضرة"
                    value={newLectureDescription}
                    onChange={(e) => setNewLectureDescription(e.target.value)}
                  />
                  <Select
                    value={newLectureSubject}
                    onValueChange={(value) => setNewLectureSubject(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر المادة" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map((subject) => (
                        <SelectItem key={subject.id} value={subject.id}>
                          {subject.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    type="file"
                    onChange={(e) => setNewLectureFile(e.target.files?.[0] || null)}
                  />
                </div>
                <Button type="submit" className="w-full">
                  رفع محاضرة
                </Button>
              </form>
              {/* جدول المحاضرات */}
              <div className="overflow-x-auto mt-6">
                <Table className="admin-dashboard-table">
                  <TableHeader>
                    <TableRow>
                      <TableHead>اسم المادة</TableHead>
                      <TableHead>عنوان المحاضرة</TableHead>
                      <TableHead>الوصف</TableHead>
                      <TableHead>اسم الملف</TableHead>
                      <TableHead className="text-right">الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {lectures.map((lecture) => (
                      <TableRow key={lecture.id}>
                        <TableCell>
                          {subjects.find((subject) => subject.id === lecture.subjectId)?.name || '-'}
                        </TableCell>
                        <TableCell>{lecture.title}</TableCell>
                        <TableCell>{lecture.description}</TableCell>
                        <TableCell>{lecture.fileName}</TableCell>
                        <TableCell className="text-right space-x-2 rtl:space-x-reverse">
                          <Button variant="outline" onClick={() => updateLecture(lecture.id, lecture.title, lecture.description)} size="icon">
                            <Edit className="h-5 w-5" />
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={async () => {
                              try {
                                await deleteLecture(lecture.id, lecture.fileId);
                                toast({
                                  title: "نجاح",
                                  description: "تم حذف المحاضرة بنجاح",
                                });
                                fetchLectures();
                              } catch (error) {
                                console.error("Error deleting lecture: ", error);
                                toast({
                                  title: "خطأ",
                                  description: "فشل حذف المحاضرة",
                                  variant: "destructive",
                                });
                              }
                            }}
                            size="icon"
                          >
                            <Trash2 className="h-5 w-5" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Activities Section */}
        <TabsContent value="activities" className="space-y-6">
          <Card className="shadow-lg hover:shadow-xl transition-all">
            <CardHeader className="p-6">
              <CardTitle className="text-xl font-semibold flex items-center">
                <Activity className="h-6 w-6 ml-2 text-primary" />
                سجل النشاطات
              </CardTitle>
              <CardDescription>
                جميع الأنشطة والتغييرات التي تتم في النظام
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ActivityLog />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Floating Action Button */}
      <motion.button
        whileHover={{ scale: 1.1, rotate: 10 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-8 left-8 z-50 bg-primary text-white rounded-full shadow-lg p-4 flex items-center gap-2 dashboard-button"
        onClick={() => {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        title="إضافة عنصر جديد"
      >
        <Plus className="h-6 w-6" />
        إضافة
      </motion.button>
    </div>
  );
};

export default AdminDashboard;
