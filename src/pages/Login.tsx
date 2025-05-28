import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Mail, Lock, LogIn, Chrome } from 'lucide-react'; // Keeping Chrome as Google icon alternative
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth, db } from '@/firebase/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { motion } from 'framer-motion'; // For animations
import { logActivity } from '@/firebase/activityLogger';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Basic frontend validation for email format (not starting with a number)
    if (!email || !/^[^\d][\w.-]*@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      setError('البريد الإلكتروني غير صالح. يجب ألا يبدأ برقم.');
      return;
    }

    if (!password) {
      setError('الرجاء إدخال كلمة المرور.');
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Removed activity logging for 'login' as per new requirements.
      // This type is not in ALLOWED_ACTIVITY_TYPES in activityLogger.ts.

      navigate('/'); // Redirect to home page on successful login
    } catch (err: any) {
      console.error("Login error:", err);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError('البريد الإلكتروني أو كلمة المرور غير صحيحة.');
      } else if (err.code === 'auth/invalid-email') {
        setError('صيغة البريد الإلكتروني غير صحيحة.');
      } else {
        setError('حدث خطأ أثناء تسجيل الدخول. يرجى المحاولة مرة أخرى.');
      }
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Save user info to Firestore if it's a new user or update existing
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, {
        email: user.email,
        fullName: user.displayName || '', // Use displayName for fullName
        role: 'user', // Default role for new users
        createdAt: new Date(),
      }, { merge: true }); // Use merge: true to update if exists, create if not

      // Removed activity logging for 'google_login' as per new requirements.
      // This type is not in ALLOWED_ACTIVITY_TYPES in activityLogger.ts.

      navigate('/'); // Redirect to home page on successful login
    } catch (err: any) {
      console.error("Google login error:", err);
      setError('فشل تسجيل الدخول باستخدام Google. يرجى المحاولة مرة أخرى.');
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
              <LogIn className="h-10 w-10 text-primary-foreground" />
            </motion.div>
            <CardTitle className="text-4xl font-extrabold text-primary mb-2">تسجيل الدخول</CardTitle>
            <CardDescription className="text-lg text-muted-foreground">
              ادخل بياناتك للوصول إلى حسابك
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleLogin} className="space-y-6">
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
              {error && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-sm text-center mt-4">{error}</motion.p>}
              <Button type="submit" className="w-full py-3 text-lg font-semibold bg-primary hover:bg-primary/90 transition-all duration-300 rounded-lg">
                تسجيل الدخول
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
            <Button variant="outline" className="w-full py-3 text-lg flex items-center justify-center border-input bg-background hover:bg-secondary/50 transition-all duration-300 rounded-lg" onClick={handleGoogleLogin}>
              <Chrome className="h-6 w-6 mr-3" />
              تسجيل الدخول باستخدام Google
            </Button>
            <p className="text-center text-base text-muted-foreground mt-8">
              ليس لديك حساب؟{' '}
              <Link to="/register" className="text-primary hover:underline font-semibold">
                سجل الآن
              </Link>
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Login;
