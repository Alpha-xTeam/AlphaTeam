import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom'; // Added useLocation
import Footer from './Footer';
import { onAuthStateChanged, signOut, User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { UserCircle, LogOut, Mail, User as UserIcon } from 'lucide-react'; // Added Mail and UserIcon
import { motion, AnimatePresence } from 'framer-motion'; // Import motion and AnimatePresence

interface LayoutProps {
  children: React.ReactNode;
}

interface UserProfile {
  fullName?: string; // Changed from firstName, lastName
  email: string;
  role?: string; // Add role to UserProfile interface
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Fetch user profile from Firestore
        const userRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
          setUserProfile(docSnap.data() as UserProfile);
        } else {
          // If user exists in Auth but not Firestore (e.g., first Google login)
          // Use displayName from FirebaseUser as fallback
          setUserProfile({
            fullName: currentUser.displayName || 'مستخدم', // Use displayName for fullName
            email: currentUser.email || 'لا يوجد بريد إلكتروني',
          });
        }
      } else {
        setUserProfile(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/'); // Redirect to home page after logout
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header (Navbar) */}
      <header className="bg-card shadow-sm border-b border-border">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-md">
              <span className="text-primary-foreground font-bold text-lg">A</span>
            </div>
            <h1 className="text-2xl font-bold text-foreground">Alpha Team</h1>
          </div>
          <nav className="flex space-x-6 items-center">
            <Link to="/" className="text-muted-foreground hover:text-primary transition-colors duration-300">الرئيسية</Link>
            <Link to="/lectures" className="text-muted-foreground hover:text-primary transition-colors duration-300">المحاضرات</Link>
            <Link to="/ai-chat" className="text-muted-foreground hover:text-primary transition-colors duration-300">تحدث مع الذكاء الاصطناعي</Link> {/* New AI Chat Link */}
            <Link to="/lecture-translation" className="text-muted-foreground hover:text-primary transition-colors duration-300">ترجمة المحاضرة</Link>
            {userProfile?.role === 'admin' && ( // Conditionally render Admin Dashboard link
              <Link to="/admin-dashboard" className="text-muted-foreground hover:text-primary transition-colors duration-300">لوحة التحكم</Link>
            )}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full transition-all duration-300 hover:scale-105 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
                    <Avatar className="h-9 w-9">
                      {/* If user has a photoURL, use AvatarImage */}
                      {/* <AvatarImage src={user?.photoURL || ""} alt={userProfile ? `${userProfile.fullName}` : "User"} /> */}
                      <AvatarFallback className="bg-primary text-primary-foreground font-bold text-lg">
                        {userProfile?.fullName ? userProfile.fullName.charAt(0).toUpperCase() : 'A'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-72 p-4 shadow-xl rounded-lg border border-border animate-in fade-in-0 zoom-in-95" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal p-0 mb-3">
                    <div className="flex items-center space-x-3 rtl:space-x-reverse">
                      <Avatar className="h-10 w-10">
                        {/* <AvatarImage src={user?.photoURL || ""} alt={userProfile ? `${userProfile.fullName}` : "User"} /> */}
                        <AvatarFallback className="bg-primary text-primary-foreground font-bold text-xl">
                          {userProfile?.fullName ? userProfile.fullName.charAt(0).toUpperCase() : 'A'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col space-y-1">
                        <p className="text-base font-semibold leading-none text-foreground flex items-center">
                          <UserIcon className="h-4 w-4 ml-2 text-muted-foreground" />
                          {userProfile?.fullName || 'مستخدم'}
                        </p>
                        <p className="text-sm leading-none text-muted-foreground flex items-center">
                          <Mail className="h-4 w-4 ml-2 text-muted-foreground" />
                          {userProfile?.email || user?.email}
                        </p>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="my-3 bg-border" />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer flex items-center text-red-500 hover:bg-red-50 focus:bg-red-50 hover:text-red-600 focus:text-red-600 rounded-md p-2 transition-colors duration-200">
                    <LogOut className="h-4 w-4 ml-2" />
                    تسجيل الخروج
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/login" className="text-muted-foreground hover:text-primary transition-colors duration-300">تسجيل الدخول</Link>
            )}
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname} // Use location.pathname as key for re-animation on route change
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="h-full" // Ensure it takes full height
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Layout;
