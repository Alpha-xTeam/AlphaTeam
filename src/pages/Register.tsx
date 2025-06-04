import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Mail, Lock, User, Chrome, UserPlus } from 'lucide-react';
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, sendEmailVerification } from 'firebase/auth';
import { auth, db } from '@/firebase/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { motion } from 'framer-motion'; // For animations
import { logActivity } from '@/firebase/activityLogger';
import { toast } from "@/components/ui/use-toast"; // Import toast

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

const Register = () => {
  const [fullName, setFullName] = useState(''); // Changed from firstName, lastName
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(avatarList[0]);
  const [showAvatarDialog, setShowAvatarDialog] = useState(false);
  const [googleUser, setGoogleUser] = useState<any>(null);
  const navigate = useNavigate();

  const validateEmail = (email: string) => {
    // Email should not start with a number, but numbers are allowed after the first character
    return /^[^\d][\w.-]*@([\w-]+\.)+[\w-]{2,4}$/.test(email);
  };

  const validateArabicFullName = (name: string) => {
    // Allow Arabic characters and spaces, ensure at least two words (for full name)
    return /^[\u0600-\u06FF\s]+$/.test(name) && name.trim().split(/\s+/).length >= 2;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!fullName || !email || !password || !confirmPassword) {
      setError('الرجاء ملء جميع الحقول.');
      return;
    }

    if (!validateArabicFullName(fullName)) {
      setError('الاسم الكامل يجب أن يحتوي على أحرف عربية فقط ويتكون من كلمتين على الأقل.');
      return;
    }

    if (!validateEmail(email)) {
      setError('البريد الإلكتروني غير صالح. يجب ألا يبدأ برقم.');
      return;
    }

    if (password.length < 6) {
      setError('كلمة المرور يجب أن تتكون من 6 أحرف على الأقل.');
      return;
    }

    if (password !== confirmPassword) {
      setError('كلمة المرور وتأكيد كلمة المرور غير متطابقين.');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Send email verification
      await sendEmailVerification(user);

      // Save additional user info to Firestore
      await setDoc(doc(db, "users", user.uid), {
        fullName: fullName, // Changed to fullName
        email: email,
        avatar: selectedAvatar, // Include selected avatar
        role: 'user', // Default role for new users
        createdAt: new Date(),
      });

      // تسجيل نشاط إنشاء الحساب
      await logActivity({
        type: 'register',
        userId: user.uid,
        username: email,
        details: `قام المستخدم ${fullName || email} بإنشاء حساب جديد`,
      });

      // Inform the user to verify their email
      toast({
        title: "تم إرسال رابط التحقق",
        description: "يرجى التحقق من بريدك الإلكتروني لتأكيد حسابك قبل تسجيل الدخول.",
        variant: "default", // You can adjust the variant (e.g., "success", "warning")
        duration: 5000, // Duration in milliseconds
      });

      navigate('/login'); // Redirect to login page on successful registration
    } catch (err: any) {
      console.error("Registration error:", err);
      if (err.code === 'auth/email-already-in-use') {
        setError('هذا البريد الإلكتروني مستخدم بالفعل.');
      } else if (err.code === 'auth/invalid-email') {
        setError('صيغة البريد الإلكتروني غير صحيحة.');
      } else if (err.code === 'auth/weak-password') {
        setError('كلمة المرور ضعيفة جداً. يرجى اختيار كلمة مرور أقوى.');
      } else {
        setError('حدث خطأ أثناء التسجيل. يرجى المحاولة مرة أخرى.');
      }
    }
  };

  const handleGoogleRegister = async () => {
    setError('');
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Store user temporarily and show avatar dialog
      setGoogleUser(user);
      setShowAvatarDialog(true);
    } catch (err: any) {
      console.error("Google registration error:", err);
      if (err.code === 'auth/popup-closed-by-user') {
        setError('تم إغلاق نافذة تسجيل الدخول من Google. يرجى المحاولة مرة أخرى.');
      } else if (err.code === 'auth/cancelled-popup-request') {
        setError('تم إلغاء طلب النافذة المنبثقة. يرجى المحاولة مرة أخرى.');
      } else if (err.code === 'auth/operation-not-allowed') {
        setError('تم تعطيل تسجيل الدخول باستخدام Google. يرجى الاتصال بالمسؤول.');
      } else if (err.code === 'auth/unauthorized-domain') {
        setError('النطاق غير مصرح به لعمليات OAuth. يرجى التحقق من إعدادات Firebase.');
      } else {
        setError('فشل التسجيل باستخدام Google. يرجى المحاولة مرة أخرى. (قد تكون مشكلة في أذونات Firebase)');
      }
    }
  };

  // Handle avatar selection after Google registration
  const handleGoogleAvatarSelect = async (avatar: string) => {
    if (!googleUser) return;
    try {
      const userRef = doc(db, "users", googleUser.uid);
      await setDoc(userRef, {
        email: googleUser.email,
        fullName: googleUser.displayName || '',
        avatar: avatar,
        role: 'user',
        createdAt: new Date(),
      }, { merge: true });

      await logActivity({
        type: 'register',
        userId: googleUser.uid,
        username: googleUser.email || 'N/A',
        details: `مستخدم جديد ${googleUser.email} سجل باستخدام Google.`,
      });

      setShowAvatarDialog(false);
      setGoogleUser(null);
      navigate('/'); // Redirect to home page after avatar selection
    } catch (err: any) {
      setError('حدث خطأ أثناء حفظ الأفتار. يرجى المحاولة مرة أخرى.');
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4 relative">
      <Link to="/" className="absolute top-4 right-4 z-10">
        <Button variant="ghost" className="text-muted-foreground hover:text-primary">
          العودة إلى الرئيسية
        </Button>
      </Link>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-2xl border border-border rounded-xl overflow-hidden bg-card">
          <CardHeader className="text-center bg-secondary/20 py-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
              className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"
            >
              <UserPlus className="h-10 w-10 text-primary-foreground" />
            </motion.div>
            <CardTitle className="text-4xl font-extrabold text-primary mb-2">إنشاء حساب جديد</CardTitle>
            <CardDescription className="text-lg text-muted-foreground">
              املأ البيانات لإنشاء حسابك
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleRegister} className="space-y-6">
              <div>
                <Label htmlFor="fullName" className="text-base font-medium">الاسم الكامل (ثلاثي)</Label>
                <div className="relative mt-2">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="ادخل اسمك الثلاثي الكامل"
                    className="pl-10 pr-4 py-2 text-base border-input bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="email" className="text-base font-medium">البريد الإلكتروني</Label>
                <div className="relative mt-2">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="ادخل بريدك الإلكتروني"
                    className="pl-10 pr-4 py-2 text-base border-input bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="password" className="text-base font-medium">كلمة المرور</Label>
                <div className="relative mt-2">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="ادخل كلمة المرور"
                    className="pl-10 pr-4 py-2 text-base border-input bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="confirmPassword" className="text-base font-medium">تأكيد كلمة المرور</Label>
                <div className="relative mt-2">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="أعد إدخال كلمة المرور"
                    className="pl-10 pr-4 py-2 text-base border-input bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block mb-2 font-medium">اختر الأفتار:</label>
                <div className="flex flex-wrap gap-4 justify-center mb-4">
                  {avatarList.map((avatar, idx) => (
                    <img
                      key={idx}
                      src={avatar}
                      alt="avatar"
                      style={{
                        border: selectedAvatar === avatar ? '2px solid #2563eb' : '2px solid transparent',
                        width: 60, height: 60, borderRadius: '50%', cursor: 'pointer'
                      }}
                      onClick={() => setSelectedAvatar(avatar)}
                    />
                  ))}
                </div>
              </div>
              {error && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-sm text-center mt-4">{error}</motion.p>}
              <Button type="submit" className="w-full py-3 text-lg font-semibold bg-primary hover:bg-primary/90 transition-all duration-300 rounded-lg">
                تسجيل
              </Button>
            </form>
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-sm uppercase">
                <span className="bg-card px-3 text-muted-foreground font-medium">أو</span>
              </div>
            </div>
            <Button variant="outline" className="w-full py-3 text-lg flex items-center justify-center border-input bg-background hover:bg-secondary/50 transition-all duration-300 rounded-lg" onClick={handleGoogleRegister}>
              <Chrome className="h-6 w-6 mr-3" />
              التسجيل باستخدام Google
            </Button>
            <p className="text-center text-base text-muted-foreground mt-8">
              لديك حساب بالفعل؟{' '}
              <Link to="/login" className="text-primary hover:underline font-semibold">
                سجل الدخول
              </Link>
            </p>
          </CardContent>
        </Card>
      </motion.div>
      {/* Dialog for Google avatar selection */}
      {showAvatarDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-card rounded-xl p-8 shadow-2xl max-w-xs w-full">
            <h2 className="text-xl font-bold mb-4 text-center">اختر صورة الأفتار</h2>
            <div className="flex flex-wrap gap-4 justify-center mb-4">
              {avatarList.map((avatar, idx) => (
                <img
                  key={idx}
                  src={avatar}
                  alt="avatar"
                  style={{
                    border: selectedAvatar === avatar ? '2px solid #2563eb' : '2px solid transparent',
                    width: 60, height: 60, borderRadius: '50%', cursor: 'pointer'
                  }}
                  onClick={() => setSelectedAvatar(avatar)}
                />
              ))}
            </div>
            <Button
              className="w-full"
              onClick={() => handleGoogleAvatarSelect(selectedAvatar)}
            >
              حفظ الأفتار والمتابعة
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;
