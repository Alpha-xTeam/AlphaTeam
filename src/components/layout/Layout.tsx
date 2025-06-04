import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Footer from './Footer';
import { onAuthStateChanged, signOut, User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/firebase/firebase';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserCircle, LogOut, Mail, User as UserIcon, Menu, X, Upload, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/data/translations';
import { LanguageSwitcher } from '../LanguageSwitcher';
import ThemeToggle from '@/components/ui/theme-toggle';
import { toast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface LayoutProps {
  children: React.ReactNode;
}

interface UserProfile {
  fullName?: string;
  email: string;
  role?: string;
  photoURL?: string;
  avatar?: string;
}

const avatarList = [
  "https://res.cloudinary.com/dmao2zbvt/image/upload/v1749047283/uchgfbvn93vankxi8ngt.png",
  "https://res.cloudinary.com/dmao2zbvt/image/upload/v1749047283/uemk18ecy4s9l5hkusfg.png",
  "https://res.cloudinary.com/dmao2zbvt/image/upload/v1749047283/ldf6gddraviuecktdv6r.png",
  "https://res.cloudinary.com/dmao2zbvt/image/upload/v1749047283/ypkhs51swkfc6dlwjvsw.png",
  "https://res.cloudinary.com/dmao2zbvt/image/upload/v1749047283/ezpug86k3gkypdx7u0bd.png",
  "https://res.cloudinary.com/dmao2zbvt/image/upload/v1749047282/mwqpkyy8mnhq5eybpxgr.png",
  "https://res.cloudinary.com/dmao2zbvt/image/upload/v1749047282/uivpymjbxjfpoiy0i659.png",
  "https://res.cloudinary.com/dmao2zbvt/image/upload/v1749047282/insghjql3cf7hep1aidk.png"
];

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [toolsMenuOpen, setToolsMenuOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { language } = useLanguage();
  const [isDesktop, setIsDesktop] = useState(false);
  const [showAvatarDialog, setShowAvatarDialog] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);

  useEffect(() => {
    const check = () => setIsDesktop(window.matchMedia("(min-width: 768px)").matches);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const navigationItems = [
    { name: language === 'en' ? translations.en.home : translations.ar.home, path: "/" },
    { name: language === 'en' ? translations.en.news : translations.ar.news, path: "/news" },
    { name: language === 'en' ? translations.en.about : translations.ar.about, path: "/about" },
  ];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      console.log("onAuthStateChanged fired. currentUser:", currentUser);
      setUser(currentUser);
      if (currentUser) {
        const userRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(userRef);
        console.log("Fetched user docSnap.exists():", docSnap.exists());
        if (docSnap.exists()) {
          console.log("userProfile from Firestore:", docSnap.data());
          setUserProfile(docSnap.data() as UserProfile);
        } else {
          console.log("No user doc in Firestore, using fallback profile.");
          setUserProfile({
            fullName: currentUser.displayName || (language === 'en' ? 'User' : 'مستخدم'),
            email: currentUser.email || (language === 'en' ? 'No email' : 'لا يوجد بريد إلكتروني'),
          });
        }
      } else {
        setUserProfile(null);
      }
    });
    return () => unsubscribe();
  }, [language]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("User signed out successfully.");
      navigate('/');
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const uploadProfileImageToCloudinary = async (file: File): Promise<string | null> => {
    const cloudName = "dmao2zbvt";
    const uploadPreset = "news_unsigned";

    console.log("uploadProfileImageToCloudinary started", { 
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
      cloudName,
      uploadPreset
    });

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", uploadPreset);
      formData.append("cloud_name", cloudName);

      console.log("Sending request to Cloudinary...");
      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: formData,
        mode: 'cors'
      });

      console.log("Response received", { 
        status: response.status,
        ok: response.ok,
        statusText: response.statusText
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Upload failed response:", errorText);
        throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Cloudinary response data:", data);

      if (!data.secure_url) {
        console.error("No secure_url in response:", data);
        throw new Error("Missing secure_url in response");
      }

      console.log("Upload successful, secure_url:", data.secure_url);
      return data.secure_url;

    } catch (error) {
      console.error("Detailed upload error:", error);
      toast({
        title: "خطأ في الرفع",
        description: error instanceof Error ? error.message : "فشل في رفع الصورة",
        variant: "destructive"
      });
      return null;
    }
  };

  const handleFileInputClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("handleFileSelect triggered");
    const file = e.target.files?.[0];
    console.log("Selected file:", { name: file?.name, type: file?.type, size: file?.size });
    
    if (!file) {
      console.log("No file selected");
      return;
    }

    console.log("File validation starting...");
    // التحقق من الملف
    if (!file.type.match(/^image\/(jpeg|jpg|png|gif)$/i)) {
      console.log("Invalid file type:", file.type);
      toast({
        title: "نوع ملف غير مدعوم",
        description: "يرجى اختيار صورة من نوع JPG أو PNG أو GIF",
        variant: "destructive"
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      console.log("File too large:", file.size);
      toast({
        title: "حجم الملف كبير جداً",
        description: "يجب أن يكون حجم الصورة أقل من 5 ميجابايت",
        variant: "destructive"
      });
      return;
    }

    console.log("File validation passed, proceeding to upload...");
    setUploading(true);

    try {
      console.log("Starting upload to Cloudinary...");
      const imageUrl = await uploadProfileImageToCloudinary(file);
      console.log("Upload result:", imageUrl);

      if (!imageUrl || !user) {
        console.error("Upload failed or user not found");
        throw new Error("فشل في رفع الصورة");
      }

      console.log("Updating Firestore...");
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        photoURL: imageUrl,
        updatedAt: serverTimestamp()
      });
      console.log("Firestore update successful");

      // تحديث صورة الحساب في Firebase Auth أيضاً (اختياري لكن مهم للمنتدى)
      // Note: updateProfile is not available on modular User, so skip if not present
      if ("updateProfile" in user && typeof user.updateProfile === "function") {
        // @ts-ignore
        await user.updateProfile({ photoURL: imageUrl });
      }

      setUserProfile(prev => prev ? { ...prev, photoURL: imageUrl } : prev);

      toast({
        title: "تم بنجاح",
        description: "تم تحديث صورة الملف الشخصي",
      });

    } catch (error) {
      console.error("Full error details:", error);
      toast({
        title: "خطأ",
        description: error instanceof Error ? error.message : "فشل في تحديث الصورة",
        variant: "destructive"
      });
    } finally {
      console.log("Upload process completed");
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleChangeAvatar = async (avatar: string) => {
    if (!user) return;
    setAvatarLoading(true);
    try {
      // Update Firestore
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        avatar,
        updatedAt: serverTimestamp()
      });
      // Optionally update Auth profile
      if ("updateProfile" in user && typeof user.updateProfile === "function") {
        // @ts-ignore
        await user.updateProfile({ photoURL: avatar });
      }
      setUserProfile(prev => prev ? { ...prev, avatar } : prev);
      toast({ title: "تم تغيير الأفتار بنجاح" });
      setShowAvatarDialog(false);
    } catch (err) {
      toast({ title: "حدث خطأ أثناء تغيير الأفتار", variant: "destructive" });
    }
    setAvatarLoading(false);
  };

  return (
    <div className={`min-h-screen bg-background text-foreground flex flex-col ${language === 'ar' ? 'rtl' : 'ltr'}`}>
      <header className="bg-card/80 backdrop-blur-xl sticky top-0 z-50 w-full shadow-xl transition-all duration-300 ease-in-out">
        <div className="container mx-auto px-4 py-3 lg:py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-2 group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-md">
              <img src="https://res.cloudinary.com/dmao2zbvt/image/upload/v1748569111/tgcdnvngwpqqdz8cbxhm.png" alt="Alpha Team Logo" className="h-12 w-12 rounded-lg transition-transform group-hover:scale-105 group-focus:scale-105 shadow-md" />
            </Link>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            {navigationItems.map((item, index) =>
              <Link
                key={item.path}
                to={item.path}
                className={`relative text-sm font-medium transition-colors duration-300 ease-in-out after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-primary after:transition-all after:duration-300 after:ease-in-out hover:after:w-full focus:outline-none focus-visible:text-primary
                  ${location.pathname === item.path ? 'text-primary after:w-full' : 'text-muted-foreground hover:text-primary'}
                  ${language === 'ar' && index < navigationItems.length - 1 ? 'ml-4' : ''}
                `}
              >
                {item.name}
              </Link>
            )}
            {/* رابط التحديات البرمجية */}
           
            <div className="relative group">
              <button
                className="relative text-sm font-medium flex items-center gap-1 transition-colors duration-300 focus:outline-none focus-visible:text-primary text-muted-foreground hover:text-primary"
                tabIndex={0}
                type="button"
              >
                {language === 'ar' ? 'الادوات' : 'Tools'}
                <ChevronDown className="h-4 w-4" />
              </button>
              <div className={`
                absolute left-0 mt-2 min-w-[160px] bg-card border border-border rounded-lg shadow-lg
                transition-opacity duration-200 z-50
                ${isDesktop ? "opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto" : "hidden"}
              `}>
                <Link
                  to="/resources"
                  className="block px-4 py-2 text-sm text-foreground hover:bg-primary/10 hover:text-primary rounded transition"
                >
                  {language === 'ar' ? 'المصادر' : 'Resources'}
                </Link>
                <Link
                  to="/challenges"
                  className="block px-4 py-2 text-sm text-foreground hover:bg-primary/10 hover:text-primary rounded transition"
                >
                  {language === 'ar' ? 'تحديات برمجية' : 'Programming Challenges'}
                </Link>
              </div>
            </div>
            {(userProfile?.role === 'admin' || userProfile?.role === 'owner') && (
              <Link to="/admin-dashboard" className={`relative text-sm font-medium transition-colors duration-300 ease-in-out after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-primary after:transition-all after:duration-300 after:ease-in-out hover:after:w-full focus:outline-none focus-visible:text-primary
                ${location.pathname === '/admin-dashboard' ? 'text-primary after:w-full' : 'text-muted-foreground hover:text-primary'}
              `}>{language === 'en' ? 'Dashboard' : 'لوحة التحكم'}</Link>
            )}
            {user ? (
              <div className="flex items-center gap-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full transition-all duration-300 hover:scale-110 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 p-0">
                      <Avatar className="h-10 w-10 border-2 border-primary/50 shadow-sm">
                        <AvatarImage
                          src={
                            userProfile?.avatar && userProfile.avatar.startsWith('https://res.cloudinary.com')
                              ? userProfile.avatar
                              : "https://res.cloudinary.com/dmao2zbvt/image/upload/v1749047282/insghjql3cf7hep1aidk.png"
                          }
                          alt={userProfile?.fullName || "User"}
                          onError={e => { e.currentTarget.src = "https://res.cloudinary.com/dmao2zbvt/image/upload/v1749047282/insghjql3cf7hep1aidk.png"; }}
                        />
                        <AvatarFallback className="h-full w-full flex items-center justify-center bg-muted/50">
                          {userProfile?.fullName?.[0] || "U"}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-64 p-3 shadow-2xl rounded-lg border border-border animate-in fade-in-0 zoom-in-95" align={language === 'ar' ? 'start' : 'end'} forceMount>
                    <DropdownMenuLabel className="font-normal p-0 mb-3">
                      <div className="flex items-center space-x-3 rtl:space-x-reverse">
                        <Avatar className="h-10 w-10 border-2 border-primary/50 shadow-sm">
                          <AvatarImage
                            src={
                              userProfile?.avatar && userProfile.avatar.startsWith('https://res.cloudinary.com')
                                ? userProfile.avatar
                                : "https://res.cloudinary.com/dmao2zbvt/image/upload/v1749047282/insghjql3cf7hep1aidk.png"
                            }
                            alt={userProfile?.fullName || "User"}
                            onError={e => { e.currentTarget.src = "https://res.cloudinary.com/dmao2zbvt/image/upload/v1749047282/insghjql3cf7hep1aidk.png"; }}
                          />
                          <AvatarFallback className="h-full w-full flex items-center justify-center bg-muted/50">
                            {userProfile?.fullName?.[0] || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col space-y-1 text-right">
                          <p className="text-sm font-semibold leading-none text-foreground flex items-center justify-end gap-1">
                            {userProfile?.fullName || (language === 'en' ? 'User' : 'مستخدم')}
                            <UserIcon className="h-4 w-4 text-muted-foreground" />
                          </p>
                          <p className="text-xs leading-none text-muted-foreground flex items-center justify-end gap-1">
                            {userProfile?.email || user?.email}
                          </p>
                          {userProfile?.role && (
                            <p className="text-xs leading-none text-muted-foreground flex items-center justify-end gap-1 mt-1">
                              <Mail className="h-4 w-4 text-muted-foreground" />
                              {userProfile.role === 'owner' ? (language === 'en' ? 'Owner' : 'المالك') :
                                userProfile.role === 'admin' ? (language === 'en' ? 'Admin' : 'مسؤول') :
                                  (language === 'en' ? 'User' : 'مستخدم')}
                              <UserIcon className="h-4 w-4 text-muted-foreground" />
                            </p>
                          )}
                        </div>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="my-2 bg-border" />
                    <button
                      className="w-full text-right px-2 py-2 hover:bg-muted rounded transition"
                      onClick={() => setShowAvatarDialog(true)}
                    >
                      🖼️ تغيير الأفتار
                    </button>
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer flex items-center justify-end text-red-500 hover:bg-red-50 focus:bg-red-50 hover:text-red-600 focus:text-red-600 rounded-md p-2 transition-colors duration-200 focus:outline-none focus-visible:ring-1 focus-visible:ring-red-500">
                      <LogOut className="h-4 w-4 mr-2" />
                      {language === 'en' ? 'Logout' : 'تسجيل الخروج'}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <Link to="/login" className="relative text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-300 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-primary after:transition-all after:duration-300 hover:after:w-full focus:outline-none focus-visible:text-primary">
                {language === 'en' ? 'Login' : 'تسجيل الدخول'}
              </Link>
            )}
          </nav>
          {/* زر تغيير الأفتار للأجهزة المحمولة */}
          <div className="md:hidden flex items-center gap-2">
            {user && (
              <Button
                variant="ghost"
                className="p-0 h-10 w-10 rounded-full border-2 border-primary/50 shadow-sm"
                onClick={() => setShowAvatarDialog(true)}
                title="تغيير الأفتار"
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={
                      userProfile?.avatar && userProfile.avatar.startsWith('https://res.cloudinary.com')
                        ? userProfile.avatar
                        : "https://res.cloudinary.com/dmao2zbvt/image/upload/v1749047282/insghjql3cf7hep1aidk.png"
                    }
                    alt={userProfile?.fullName || "User"}
                  />
                  <AvatarFallback className="h-full w-full flex items-center justify-center bg-muted/50">
                    {userProfile?.fullName?.[0] || "U"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            )}
          </div>
          <button
            className="md:hidden text-muted-foreground hover:text-primary transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            onClick={() => {
              setMenuOpen(!menuOpen);
              setToolsMenuOpen(false);
            }}
            aria-label={menuOpen ? (language === 'en' ? "Close menu" : "إغلاق القائمة") : (language === 'en' ? "Open menu" : "فتح القائمة")}
          >
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
        <AnimatePresence>
          {menuOpen && !toolsMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="md:hidden bg-card border-t border-border shadow-inner"
            >
              <div className="flex flex-col space-y-3 p-4">
                {navigationItems.map((item) =>
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMenuOpen(false)}
                    className={`text-base font-medium transition-colors duration-300 ease-in-out focus:outline-none focus-visible:text-primary
                      ${location.pathname === item.path ? 'text-primary' : 'text-foreground hover:text-primary'}
                    `}
                  >
                    {item.name}
                  </Link>
                )}                
                <div className="relative group">
                  <button
                    className="relative text-base font-medium flex items-center gap-1 transition-colors duration-300 focus:outline-none focus-visible:text-primary text-muted-foreground hover:text-primary"
                    tabIndex={0}
                    onClick={() => setToolsMenuOpen(true)}
                  >
                    {language === 'ar' ? 'الادوات' : 'Tools'}
                    <ChevronDown className="h-4 w-4" />
                  </button>
                </div>
                {(userProfile?.role === 'admin' || userProfile?.role === 'owner') && (
                  <Link to="/admin-dashboard" className={`text-base font-medium transition-colors duration-300 ease-in-out focus:outline-none focus-visible:text-primary
                    ${location.pathname === '/admin-dashboard' ? 'text-primary' : 'text-foreground hover:text-primary'}
                  `} onClick={() => setMenuOpen(false)}>{language === 'en' ? 'Dashboard' : 'لوحة التحكم'}</Link>
                )}
                <div className="border-t border-border pt-4 mt-4 flex items-center space-x-3 rtl:space-x-reverse">
                  {user ? (
                    <>
                      <Avatar className="h-12 w-12 flex-shrink-0 border-2 border-primary/50 shadow-md">
                        <AvatarImage
                          src={
                            userProfile?.avatar && userProfile.avatar.startsWith('https://res.cloudinary.com')
                              ? userProfile.avatar
                              : "https://res.cloudinary.com/dmao2zbvt/image/upload/v1749047282/insghjql3cf7hep1aidk.png"
                          }
                          alt="avatar"
                          className="object-cover"
                          onError={e => { e.currentTarget.src = "https://res.cloudinary.com/dmao2zbvt/image/upload/v1749047282/insghjql3cf7hep1aidk.png"; }}
                        />
                        <AvatarFallback className="h-full w-full flex items-center justify-center bg-muted/50">
                          {userProfile?.fullName?.[0] || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col text-right">
                        <p className="text-base font-semibold text-foreground flex items-center justify-end gap-1">
                          {userProfile?.fullName || (language === 'en' ? 'User' : 'مستخدم')}
                          <UserIcon className="h-4 w-4 text-muted-foreground" />
                        </p>
                        <p className="text-sm text-muted-foreground flex items-center justify-end gap-1">
                          {userProfile?.email || user?.email}
                        </p>
                        {userProfile?.role && (
                          <p className="text-sm text-muted-foreground flex items-center justify-end gap-1 mt-1">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            {userProfile.role === 'owner' ? (language === 'en' ? 'Owner' : 'المالك') :
                              userProfile.role === 'admin' ? (language === 'en' ? 'Admin' : 'مسؤول') :
                                (language === 'en' ? 'User' : 'مستخدم')}
                            <UserIcon className="h-4 w-4 text-muted-foreground" />
                          </p>
                        )}
                        <button
                          onClick={() => {
                            handleLogout();
                            setMenuOpen(false);
                          }}
                          className="text-red-500 hover:text-red-600 transition-colors duration-300 text-right font-medium mt-2 flex items-center justify-end gap-1 focus:outline-none focus-visible:ring-1 focus-visible:ring-red-500"
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          {language === 'en' ? 'Logout' : 'تسجيل الخروج'}
                        </button>
                      </div>
                    </>
                  ) : (
                    <Link to="/login" className="text-base font-medium text-foreground hover:text-primary transition-colors duration-300 pt-4 border-t border-border mt-4 focus:outline-none focus-visible:text-primary" onClick={() => setMenuOpen(false)}>
                      {language === 'en' ? 'Login' : 'تسجيل الدخول'}
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          )}
          {menuOpen && toolsMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="md:hidden bg-card border-t border-border shadow-inner"
            >
              <div className="flex flex-col space-y-3 p-4">
                <button
                  className="flex items-center gap-2 text-base font-medium text-muted-foreground hover:text-primary transition-colors mb-2"
                  onClick={() => setToolsMenuOpen(false)}
                >
                  {language === 'ar' ? '← رجوع' : '← Back'}
                </button>
                <Link
                  to="/resources"
                  className="block px-4 py-2 text-base text-foreground hover:bg-primary/10 hover:text-primary rounded transition"
                  onClick={() => {
                    setMenuOpen(false);
                    setToolsMenuOpen(false);
                  }}
                >
                  {language === 'ar' ? 'المصادر' : 'Resources'}
                </Link>
                <Link
                  to="/challenges"
                  className="block px-4 py-2 text-base text-foreground hover:bg-primary/10 hover:text-primary rounded transition"
                  onClick={() => {
                    setMenuOpen(false);
                    setToolsMenuOpen(false);
                  }}
                >
                  {language === 'ar' ? 'تحديات برمجية' : 'Programming Challenges'}
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
      <div className="fixed bottom-4 right-4 z-50 flex items-center gap-4">
        <LanguageSwitcher />
        <ThemeToggle />
      </div>
      <Dialog open={showAvatarDialog} onOpenChange={setShowAvatarDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>اختر صورة الأفتار الجديدة</DialogTitle>
          </DialogHeader>
          <div className="flex flex-wrap gap-4 justify-center py-2">
            {avatarList.map((avatar, idx) => (
              <img
                key={idx}
                src={avatar}
                alt="avatar"
                style={{
                  border: userProfile?.avatar === avatar ? '2px solid #2563eb' : '2px solid transparent',
                  width: 60, height: 60, borderRadius: '50%', cursor: avatarLoading ? 'not-allowed' : 'pointer', opacity: avatarLoading ? 0.5 : 1
                }}
                onClick={() => !avatarLoading && handleChangeAvatar(avatar)}
              />
            ))}
          </div>
          {avatarLoading && <div className="text-center py-2">جاري التغيير...</div>}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Layout;
