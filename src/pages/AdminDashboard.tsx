import React, { useState, useEffect } from 'react';
import { collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db, auth } from '@/firebase/firebase';
import { logActivity } from '@/firebase/activityLogger';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"; // Import CardDescription
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
import { Users, Activity, Trash2, Ban, CalendarIcon, CheckCircle2, XCircle, UserCheck, UserX, UserPlus, BarChart, PieChart, LayoutDashboard } from 'lucide-react'; // Added more icons
import { cn } from '@/lib/utils';
import { ResponsiveContainer, BarChart as RechartsBarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart as RechartsPieChart, Pie, Cell } from 'recharts'; // Recharts components
import ActivityLog from '@/components/admin/ActivityLog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"; // Import Tabs components
import { PlusCircle, BookOpen, FileText, Edit, Upload, File } from 'lucide-react'; // New icons for subjects and lectures
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { addSubject, getSubjects, updateSubject, deleteSubject, addLecture, getLectures, updateLecture, deleteLecture } from '@/firebase/firebase'; // Import new Firebase functions

interface UserData {
  id: string;
  fullName?: string; // Changed from firstName, lastName
  email: string;
  role: string;
  createdAt: any; // Firebase Timestamp
  isBanned?: boolean;
  banUntil?: any; // Firebase Timestamp
}

interface StageData {
  id: string;
  name: string;
}

interface SubjectData {
  id: string;
  name: string;
  stageId: string; // Assuming subjects are linked to a stage
  createdAt: any;
}

interface LectureData {
  id: string;
  subjectId: string;
  title: string;
  description: string;
  fileId: string; // MEGA File ID
  fileUrl: string; // MEGA File URL
  fileName: string; // Name of the file
  createdAt: any;
}

const AdminDashboard = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [subjects, setSubjects] = useState<SubjectData[]>([]);
  const [lectures, setLectures] = useState<LectureData[]>([]);
  const [stages, setStages] = useState<StageData[]>([]); // State for stages
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedBanDate, setSelectedBanDate] = useState<Date | undefined>(undefined);
  const [userToBan, setUserToBan] = useState<UserData | null>(null);
  const currentUserId = auth.currentUser?.uid;
  const { toast } = useToast();

  // Subject Form States
  const [newSubjectName, setNewSubjectName] = useState('');
  const [newSubjectStage, setNewSubjectStage] = useState('');
  const [editingSubject, setEditingSubject] = useState<SubjectData | null>(null);

  // Lecture Form States
  const [newLectureTitle, setNewLectureTitle] = useState('');
  const [newLectureDescription, setNewLectureDescription] = useState('');
  const [newLectureFile, setNewLectureFile] = useState<File | null>(null);
  const [newLectureSubject, setNewLectureSubject] = useState('');
  const [editingLecture, setEditingLecture] = useState<LectureData | null>(null);

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
      const lecturesList: LectureData[] = await getLectures(); // getLectures now returns LectureData with fileId and fileUrl
      setLectures(lecturesList);
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
      console.log("Fetched stages:", stagesList); // Debugging line
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
  }, []);

  console.log("Rendering AdminDashboard. Loading:", loading, "Error:", error); // Debugging line

  const handleDeleteUser = async (userId: string) => {
    try {
      const userToDelete = users.find(u => u.id === userId);
      if (!userToDelete) return;

      await deleteDoc(doc(db, "users", userId));
      setUsers(users.filter(user => user.id !== userId));

      // Log activity
      await logActivity({
        type: 'delete_user_by_admin', // Changed type
        userId: auth.currentUser?.uid,
        username: auth.currentUser?.email || 'N/A',
        details: `المسؤول ${auth.currentUser?.email} حذف المستخدم ${userToDelete.fullName || userToDelete.email}.`,
      });

    } catch (err) {
      console.error("Error deleting user:", err);
      setError('فشل في حذف المستخدم.');
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

      // Log activity
      await logActivity({
        type: 'ban_user_by_admin', // Changed type
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

      // Removed activity logging for 'unban_user' as it's not in ALLOWED_ACTIVITY_TYPES.

    } catch (err) {
      console.error("Error unbanning user:", err);
      setError('فشل في إلغاء حظر المستخدم.');
    }
  };

  // Dashboard Metrics
  const totalUsers = users.length;
  const activeUsers = users.filter(user => !user.isBanned).length;
  const bannedUsers = users.filter(user => user.isBanned).length;

  // Chart Data
  const roleDistributionData = [
    { name: 'مسؤول', value: users.filter(u => u.role === 'admin').length },
    { name: 'مستخدم', value: users.filter(u => u.role === 'user').length },
  ];

  const userStatusData = [
    { name: 'نشط', value: activeUsers },
    { name: 'محظور', value: bannedUsers },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <div className="flex items-center justify-center mb-4">
          <LayoutDashboard className="h-12 w-12 text-primary mr-3" />
          <h2 className="text-4xl font-bold text-foreground">لوحة تحكم المسؤول</h2>
        </div>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          إدارة شاملة للمستخدمين، المواد، والمحاضرات في نظام Alpha Team.
        </p>
      </div>

      {loading && <p className="text-center text-muted-foreground text-lg">جاري تحميل بيانات لوحة التحكم...</p>}
      {error && <p className="text-center text-red-500 text-lg">{error}</p>}

      {!loading && !error && (
        <Tabs defaultValue="users" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="users" className="flex items-center justify-center">
              <Users className="h-5 w-5 ml-2" />
              إدارة المستخدمين
            </TabsTrigger>
            <TabsTrigger value="subjects" className="flex items-center justify-center">
              <BookOpen className="h-5 w-5 ml-2" />
              إدارة المواد
            </TabsTrigger>
            <TabsTrigger value="lectures" className="flex items-center justify-center">
              <FileText className="h-5 w-5 ml-2" />
              إدارة المحاضرات
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            {/* Top Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="shadow-lg p-6 text-center">
                <Users className="h-10 w-10 text-blue-500 mx-auto mb-3" />
                <CardTitle className="text-3xl font-bold text-foreground">{totalUsers}</CardTitle>
                <CardDescription className="text-muted-foreground">إجمالي المستخدمين</CardDescription>
              </Card>
              <Card className="shadow-lg p-6 text-center">
                <UserCheck className="h-10 w-10 text-green-500 mx-auto mb-3" />
                <CardTitle className="text-3xl font-bold text-foreground">{activeUsers}</CardTitle>
                <CardDescription className="text-muted-foreground">المستخدمون النشطون</CardDescription>
              </Card>
              <Card className="shadow-lg p-6 text-center">
                <UserX className="h-10 w-10 text-red-500 mx-auto mb-3" />
                <CardTitle className="text-3xl font-bold text-foreground">{bannedUsers}</CardTitle>
                <CardDescription className="text-muted-foreground">المستخدمون المحظورون</CardDescription>
              </Card>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <Card className="shadow-lg p-6">
                <CardHeader className="p-0 mb-4">
                  <CardTitle className="text-xl font-semibold flex items-center">
                    <BarChart className="h-5 w-5 ml-2 text-primary" />
                    توزيع الأدوار
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-64 p-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart data={roleDistributionData}>
                      <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                      <YAxis stroke="hsl(var(--muted-foreground))" />
                      <Tooltip cursor={{ fill: 'hsl(var(--accent))' }} contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                      <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="shadow-lg p-6">
                <CardHeader className="p-0 mb-4">
                  <CardTitle className="text-xl font-semibold flex items-center">
                    <PieChart className="h-5 w-5 ml-2 text-primary" />
                    حالة المستخدمين
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-64 p-0 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={userStatusData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {userStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                      <Legend />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Users Table */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-2xl font-semibold">
                  <Activity className="h-6 w-6 ml-2 text-primary" />
                  جميع المستخدمين
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>الاسم الكامل</TableHead>
                        <TableHead>البريد الإلكتروني</TableHead>
                        <TableHead>الدور</TableHead>
                        <TableHead>تاريخ التسجيل</TableHead>
                        <TableHead>الحالة</TableHead>
                        <TableHead className="text-right">الإجراءات</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.fullName || 'N/A'}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{user.role}</TableCell>
                          <TableCell>{user.createdAt ? format(user.createdAt.toDate(), 'yyyy-MM-dd HH:mm') : 'N/A'}</TableCell>
                          <TableCell>
                            {user.isBanned ? (
                              <span className="flex items-center text-red-500">
                                <XCircle className="h-4 w-4 ml-1" />
                                محظور {user.banUntil ? `حتى ${format(user.banUntil.toDate(), 'yyyy-MM-dd')}` : 'بشكل دائم'}
                              </span>
                            ) : (
                              <span className="flex items-center text-green-500">
                                <CheckCircle2 className="h-4 w-4 ml-1" />
                                نشط
                              </span>
                            )}
                          </TableCell>
                          <TableCell className="text-right space-x-2 rtl:space-x-reverse">
                            {/* Removed the condition user.id !== currentUserId */}
                            <>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="destructive" size="sm">
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>هل أنت متأكد تمامًا؟</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      سيؤدي هذا الإجراء إلى حذف المستخدم {user.fullName || user.email} بشكل دائم من قاعدة البيانات. لا يمكن التراجع عن هذا الإجراء.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>إلغاء</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDeleteUser(user.id)}>
                                      حذف
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>

                              {user.isBanned ? (
                                <Button variant="outline" size="sm" onClick={() => handleUnbanUser(user.id)}>
                                  إلغاء الحظر
                                </Button>
                              ) : (
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <Button variant="secondary" size="sm" onClick={() => handleBanUser(user)}>
                                      <Ban className="h-4 w-4 ml-1" />
                                      حظر
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-auto p-0">
                                    <Calendar
                                      mode="single"
                                      selected={selectedBanDate}
                                      onSelect={setSelectedBanDate}
                                      initialFocus
                                    />
                                    <div className="p-4 border-t flex justify-end">
                                      <Button onClick={confirmBanUser} disabled={!selectedBanDate}>
                                        تأكيد الحظر
                                      </Button>
                                    </div>
                                  </PopoverContent>
                                </Popover>
                              )}
                            </>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                {users.length === 0 && (
                  <p className="text-center text-muted-foreground mt-4">لا يوجد مستخدمون لعرضهم.</p>
                )}
              </CardContent>
            </Card>

            {/* Activity Log Section */}
            <div className="mt-8">
              <ActivityLog />
            </div>
          </TabsContent>

          <TabsContent value="subjects">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-2xl font-semibold">
                  <BookOpen className="h-6 w-6 ml-2 text-primary" />
                  إدارة المواد
                </CardTitle>
                <CardDescription>
                  إضافة وتعديل وحذف المواد الدراسية.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={async (e) => {
                  e.preventDefault();
                  try {
                    if (editingSubject) {
                      await updateSubject(editingSubject.id, newSubjectName, newSubjectStage);
                      toast({
                        title: "نجاح",
                        description: "تم تحديث المادة بنجاح.",
                      });
                      setEditingSubject(null);
                    } else {
                      await addSubject(newSubjectName, newSubjectStage);
                      toast({
                        title: "نجاح",
                        description: "تم إضافة المادة بنجاح.",
                      });
                    }
                    setNewSubjectName('');
                    setNewSubjectStage('');
                    fetchSubjects(); // Refresh subjects list
                    // Removed activity logging for 'add_subject'/'update_subject' as per new requirements.
                  } catch (err) {
                    console.error("Error managing subject:", err);
                    toast({
                      title: "خطأ",
                      description: `فشل في ${editingSubject ? 'تحديث' : 'إضافة'} المادة.`,
                      variant: "destructive",
                    });
                  }
                }} className="space-y-4 mb-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="subjectName">اسم المادة</Label>
                      <Input
                        id="subjectName"
                        value={newSubjectName}
                        onChange={(e) => setNewSubjectName(e.target.value)}
                        placeholder="أدخل اسم المادة"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="subjectStage">المرحلة الدراسية</Label>
                      <Select value={newSubjectStage} onValueChange={setNewSubjectStage} required>
                        <SelectTrigger className="w-full">
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
                    </div>
                  </div>
                  <Button type="submit" className="w-full">
                    {editingSubject ? (
                      <>
                        <Edit className="h-4 w-4 ml-2" />
                        تعديل المادة
                      </>
                    ) : (
                      <>
                        <PlusCircle className="h-4 w-4 ml-2" />
                        إضافة مادة
                      </>
                    )}
                  </Button>
                  {editingSubject && (
                    <Button variant="outline" className="w-full mt-2" onClick={() => {
                      setEditingSubject(null);
                      setNewSubjectName('');
                      setNewSubjectStage('');
                    }}>
                      إلغاء التعديل
                    </Button>
                  )}
                </form>

                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <BookOpen className="h-5 w-5 ml-2 text-primary" />
                  المواد الموجودة
                </h3>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>اسم المادة</TableHead>
                        <TableHead>المرحلة</TableHead>
                        <TableHead className="text-right">الإجراءات</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {subjects.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={3} className="text-center text-muted-foreground">
                            لا توجد مواد لعرضها.
                          </TableCell>
                        </TableRow>
                      ) : (
                        subjects.map((subject) => (
                          <TableRow key={subject.id}>
                            <TableCell className="font-medium">{subject.name}</TableCell>
                            <TableCell>
                              {stages.find(s => s.id === subject.stageId)?.name || 'غير معروفة'}
                            </TableCell>
                            <TableCell className="text-right space-x-2 rtl:space-x-reverse">
                              <Button variant="outline" size="sm" onClick={() => {
                                setEditingSubject(subject);
                                setNewSubjectName(subject.name);
                                setNewSubjectStage(subject.stageId);
                              }}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="destructive" size="sm">
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>هل أنت متأكد تمامًا؟</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      سيؤدي هذا الإجراء إلى حذف المادة "{subject.name}" وجميع المحاضرات المرتبطة بها بشكل دائم. لا يمكن التراجع عن هذا الإجراء.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>إلغاء</AlertDialogCancel>
                                    <AlertDialogAction onClick={async () => {
                                      try {
                                        // Delete associated lectures first
                                        const associatedLectures = await getLectures(subject.id);
                                        for (const lecture of associatedLectures) {
                                          await deleteLecture(lecture.id, lecture.fileUrl);
                                        }
                                        await deleteSubject(subject.id);
                                        fetchSubjects();
                                        fetchLectures(); // Refresh lectures as well
                                        toast({
                                          title: "نجاح",
                                          description: "تم حذف المادة والمحاضرات المرتبطة بها بنجاح.",
                                        });
                                        // Removed activity logging for 'delete_subject' as per new requirements.
                                      } catch (err) {
                                        console.error("Error deleting subject:", err);
                                        toast({
                                          title: "خطأ",
                                          description: "فشل في حذف المادة.",
                                          variant: "destructive",
                                        });
                                      }
                                    }}>
                                      حذف
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="lectures">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-2xl font-semibold">
                  <FileText className="h-6 w-6 ml-2 text-primary" />
                  إدارة المحاضرات
                </CardTitle>
                <CardDescription>
                  إضافة وتعديل وحذف المحاضرات للمواد.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Removed Google Drive authentication button */}
                <form onSubmit={async (e) => {
                  e.preventDefault();
                  try {
                    if (editingLecture) {
                      await updateLecture(editingLecture.id, newLectureTitle, newLectureDescription, newLectureFile || undefined, editingLecture.fileId);
                      toast({
                        title: "نجاح",
                        description: "تم تحديث المحاضرة بنجاح.",
                      });
                      setEditingLecture(null);
                    } else {
                      if (!newLectureFile) {
                        toast({
                          title: "خطأ",
                          description: "الرجاء اختيار ملف للمحاضرة.",
                          variant: "destructive",
                        });
                        return;
                      }
                      await addLecture(newLectureSubject, newLectureTitle, newLectureDescription, newLectureFile);
                      toast({
                        title: "نجاح",
                        description: "تم إضافة المحاضرة بنجاح.",
                      });
                    }
                    setNewLectureTitle('');
                    setNewLectureDescription('');
                    setNewLectureFile(null);
                    setNewLectureSubject('');
                    fetchLectures(); // Refresh lectures list
                    // Removed activity logging for 'add_lecture'/'update_lecture' as per new requirements.
                  } catch (err) {
                    console.error("Error managing lecture:", err);
                    toast({
                      title: "خطأ",
                      description: `فشل في ${editingLecture ? 'تحديث' : 'إضافة'} المحاضرة.`,
                      variant: "destructive",
                    });
                  }
                }} className="space-y-4 mb-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="lectureTitle">عنوان المحاضرة</Label>
                      <Input
                        id="lectureTitle"
                        value={newLectureTitle}
                        onChange={(e) => setNewLectureTitle(e.target.value)}
                        placeholder="أدخل عنوان المحاضرة"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="lectureDescription">وصف المحاضرة</Label>
                      <Input
                        id="lectureDescription"
                        value={newLectureDescription}
                        onChange={(e) => setNewLectureDescription(e.target.value)}
                        placeholder="أدخل وصف المحاضرة"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="lectureSubject">المادة المرتبطة</Label>
                      <Select value={newLectureSubject} onValueChange={setNewLectureSubject} required>
                        <SelectTrigger className="w-full">
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
                    </div>
                    <div>
                      <Label htmlFor="lectureFile">ملف المحاضرة (PDF)</Label>
                      <Input
                        id="lectureFile"
                        type="file"
                        accept=".pdf"
                        onChange={(e) => setNewLectureFile(e.target.files ? e.target.files[0] : null)}
                        required={!editingLecture} // File is required only for new lectures
                      />
                      {editingLecture && editingLecture.fileName && (
                        <p className="text-sm text-muted-foreground mt-1">
                          الملف الحالي: {editingLecture.fileName}
                        </p>
                      )}
                    </div>
                  </div>
                  <Button type="submit" className="w-full">
                    {editingLecture ? (
                      <>
                        <Edit className="h-4 w-4 ml-2" />
                        تعديل المحاضرة
                      </>
                    ) : (
                      <>
                        <PlusCircle className="h-4 w-4 ml-2" />
                        إضافة محاضرة
                      </>
                    )}
                  </Button>
                  {editingLecture && (
                    <Button variant="outline" className="w-full mt-2" onClick={() => {
                      setEditingLecture(null);
                      setNewLectureTitle('');
                      setNewLectureDescription('');
                      setNewLectureFile(null);
                      setNewLectureSubject('');
                    }}>
                      إلغاء التعديل
                    </Button>
                  )}
                </form>

                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <FileText className="h-5 w-5 ml-2 text-primary" />
                  المحاضرات الموجودة
                </h3>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>عنوان المحاضرة</TableHead>
                        <TableHead>الوصف</TableHead>
                        <TableHead>المادة</TableHead>
                        <TableHead>الملف</TableHead>
                        <TableHead className="text-right">الإجراءات</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {lectures.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center text-muted-foreground">
                            لا توجد محاضرات لعرضها.
                          </TableCell>
                        </TableRow>
                      ) : (
                        lectures.map((lecture) => (
                          <TableRow key={lecture.id}>
                            <TableCell className="font-medium">{lecture.title}</TableCell>
                            <TableCell>{lecture.description}</TableCell>
                            <TableCell>
                              {subjects.find(s => s.id === lecture.subjectId)?.name || 'غير معروفة'}
                            </TableCell>
                            <TableCell>
                              {lecture.fileUrl ? (
                                <a href={lecture.fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline flex items-center">
                                  <File className="h-4 w-4 ml-1" />
                                  {lecture.fileName || 'عرض الملف'}
                                </a>
                              ) : 'لا يوجد ملف'}
                            </TableCell>
                            <TableCell className="text-right space-x-2 rtl:space-x-reverse">
                              <Button variant="outline" size="sm" onClick={() => {
                                setEditingLecture(lecture);
                                setNewLectureTitle(lecture.title);
                                setNewLectureDescription(lecture.description);
                                setNewLectureSubject(lecture.subjectId);
                                setNewLectureFile(null); // Reset file input
                              }}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="destructive" size="sm">
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>هل أنت متأكد تمامًا؟</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      سيؤدي هذا الإجراء إلى حذف المحاضرة "{lecture.title}" بشكل دائم. لا يمكن التراجع عن هذا الإجراء.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>إلغاء</AlertDialogCancel>
                                    <AlertDialogAction onClick={async () => {
                                      try {
                                        await deleteLecture(lecture.id, lecture.fileId);
                                        fetchLectures();
                                        toast({
                                          title: "نجاح",
                                          description: "تم حذف المحاضرة بنجاح.",
                                        });
                                        // Removed activity logging for 'delete_lecture' as per new requirements.
                                      } catch (err) {
                                        console.error("Error deleting lecture:", err);
                                        toast({
                                          title: "خطأ",
                                          description: "فشل في حذف المحاضرة.",
                                          variant: "destructive",
                                        });
                                      }
                                    }}>
                                      حذف
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default AdminDashboard;
