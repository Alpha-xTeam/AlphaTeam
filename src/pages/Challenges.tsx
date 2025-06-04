import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Plus, Trash2, Edit2, X, Trophy, Medal, Clock, ArrowRight } from "lucide-react";
import { doc, getDoc, setDoc, updateDoc, arrayUnion, collection, query, orderBy, limit, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase/firebase";
import { useToast } from "@/components/ui/use-toast";
import { Question, INITIAL_QUESTIONS } from "@/data/questions";

type LeaderboardUser = {
  id: string;
  fullName: string;
  challengeScore: number;
  avatar?: string;
};

export default function Challenges() {
  const [language] = useState<string>("python");
  const [questions, setQuestions] = useState<Question[]>(INITIAL_QUESTIONS);
  const [currentQuestionId, setCurrentQuestionId] = useState<number | null>(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [showAddPanel, setShowAddPanel] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<{ question: string; code?: string; options: string[]; answer: string }>({
    question: "",
    code: "",
    options: ["", "", "", ""],
    answer: "",
  });

  const handleEdit = (question: Question) => {
    setForm({
      question: question.question,
      code: question.code || "",
      options: question.options,
      answer: question.answer
    });
    setEditId(question.id);
  };
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [answeredIds, setAnsweredIds] = useState<number[]>([]);
  const [topUsers, setTopUsers] = useState<LeaderboardUser[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();
  const maxRepeatCount = 2;

  const [timer, setTimer] = useState<number>(30);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [isStarted, setIsStarted] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const hasAnsweredRef = useRef<boolean>(false);
  const penaltyAppliedRef = useRef(false);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);

  useEffect(() => {
    if (!user) {
      if (performance.navigation.type !== 1) {
        navigate('/login');
      }
      return;
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (user?.uid) {
        try {
          const userDocRef = doc(db, "users", user.uid);
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            setUserRole(userDocSnap.data().role || null);
          } else {
            setUserRole(null);
          }
        } catch (err) {
          setUserRole(null);
        }
      } else {
        setUserRole(null);
      }
    };
    fetchUserRole();
  }, [user]);

  useEffect(() => {
    const fetchUserProgress = async () => {
      if (user?.uid) {
        try {
          const userDocRef = doc(db, "users", user.uid);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            setScore(userData.challengeScore || 0);
            setAnsweredIds(userData.completedChallenges || []);
            if (userData.questionsRepeatCount) {
              setQuestions(prev => prev.map(q => ({
                ...q,
                repeatCount: userData.questionsRepeatCount[q.id] || 0
              })));
            }
          } else {
            await setDoc(userDocRef, {
              challengeScore: 0,
              completedChallenges: [],
              questionsRepeatCount: {},
              fullName: user.displayName || "مستخدم جديد",
              email: user.email,
              createdAt: new Date().toISOString()
            });
          }
        } catch (err) {
          console.error("Error loading user progress:", err);
          toast({
            title: "خطأ",
            description: "حدث خطأ في تحميل تقدمك",
            variant: "destructive"
          });
        }
      }
    };

    fetchUserProgress();
  }, [user]);

  const saveProgress = async (newScore: number, newAnsweredIds: number[], questionsRepeatCount = {}) => {
    if (!user?.uid) return;
    
    try {
      const userDocRef = doc(db, "users", user.uid);
      await setDoc(userDocRef, {
        challengeScore: newScore,
        completedChallenges: newAnsweredIds,
        questionsRepeatCount,
        lastUpdated: new Date().toISOString()
      }, { merge: true });
    } catch (err) {
      console.error("Error saving progress:", err);
      toast({
        title: "خطأ",
        description: "حدث خطأ في حفظ تقدمك",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    const q = query(
      collection(db, "users"),
      orderBy("challengeScore", "desc"),
      limit(10)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const users: LeaderboardUser[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data.challengeScore !== undefined) {
          users.push({
            id: doc.id,
            fullName: data.fullName || "مستخدم مجهول",
            challengeScore: data.challengeScore,
            avatar: data.avatar,
          });
        }
      });
      setTopUsers(users);
    });

    return () => unsubscribe();
  }, []);

  const unansweredQuestions = questions.filter(
    (q) => !answeredIds.includes(q.id) && (!q.repeatCount || q.repeatCount < maxRepeatCount)
  );

  const currentQuestion = unansweredQuestions.find(q => q.id === currentQuestionId) || (unansweredQuestions.length > 0 ? unansweredQuestions[0] : null);

  const handleStartChallenge = () => {
    setIsStarted(true);
    setShowCorrectAnswer(false);
    setError(null);
    setUserAnswer("");
    setCurrentQuestionId(unansweredQuestions.length > 0 ? unansweredQuestions[0].id : null);
  };

  const goToNextQuestion = () => {
    if (!currentQuestion) return;
    const idx = unansweredQuestions.findIndex(q => q.id === currentQuestion.id);
    if (idx !== -1 && idx + 1 < unansweredQuestions.length) {
      setCurrentQuestionId(unansweredQuestions[idx + 1].id);
    } else {
      setCurrentQuestionId(null);
    }
    setShowCorrectAnswer(false);
    setError(null);
    setUserAnswer("");
    setTimer(30);
    setIsTimerRunning(true);
    hasAnsweredRef.current = false;
  };

  const goToPrevQuestion = () => {
    if (!currentQuestion) return;
    const idx = unansweredQuestions.findIndex(q => q.id === currentQuestion.id);
    if (idx > 0) {
      setCurrentQuestionId(unansweredQuestions[idx - 1].id);
      setShowCorrectAnswer(false);
      setError(null);
      setUserAnswer("");
      setTimer(30);
      setIsTimerRunning(true);
      hasAnsweredRef.current = false;
    }
  };

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm("هل أنت متأكد من حذف هذا السؤال؟");
    if (!confirmed) return;
    setQuestions((prev) => prev.filter((q) => q.id !== id));
    if (currentQuestionId === id) {
      goToNextQuestion();
    }
  };

  const handleAnswer = (answer: string) => {
    if (!answer || !currentQuestion || !user?.uid || hasAnsweredRef.current) {
      return;
    }
    hasAnsweredRef.current = true;
    clearInterval(timerRef.current!);

    const correctAnswer = currentQuestion.answer.trim().toLowerCase();
    const cleanUserAnswer = answer.trim().toLowerCase();

    if (cleanUserAnswer === correctAnswer) {
      const newScore = score + 1;
      setScore(newScore);
      const newAnsweredIds = [...answeredIds, currentQuestion.id];
      setAnsweredIds(newAnsweredIds);
      saveProgress(newScore, newAnsweredIds);
      toast({
        title: "أحسنت!",
        description: "إجابة صحيحة",
        // hello
        variant: "default",
      });

      if (unansweredQuestions.length === 1) {
        setCurrentQuestionId(null);
      } else {
        setTimeout(() => {
          goToNextQuestion();
        }, 1000);
      }
    } else {
      // فقط أظهر الإجابة الصحيحة ولا تنتقل تلقائياً
      handleWrongAnswer();
      // لا تستدعي goToNextQuestion هنا ولا أي setTimeout
    }
  };

  const handleEndChallenge = () => {
    const confirmed = window.confirm("هل أنت متأكد من إنهاء التحدي؟ سيتم حفظ تقدمك الحالي.");
    if (confirmed) {
      setIsStarted(false);
      setCurrentQuestionId(null);
      setUserAnswer("");
      setShowCorrectAnswer(false);
      setError(null);
      setTimer(30);
      setIsTimerRunning(false);
    }
  };

  const handleShowNext = () => {
    goToNextQuestion();
  };

  useEffect(() => {
    if (isStarted && unansweredQuestions.length > 0 && (currentQuestionId === null || !unansweredQuestions.some(q => q.id === currentQuestionId))) {
      setCurrentQuestionId(unansweredQuestions[0].id);
    }
    if (!isStarted) {
      setCurrentQuestionId(null);
    }
  }, [isStarted, questions, answeredIds]);

  useEffect(() => {
    penaltyAppliedRef.current = false;
  }, [isStarted]);

  useEffect(() => {
    const applyPenalty = async () => {
      if (
        user?.uid &&
        score > 0 &&
        isStarted &&
        currentQuestion
      ) {
        const newScore = score - 1;
        try {
          await updateDoc(doc(db, "users", user.uid), {
            challengeScore: newScore,
            lastUpdated: new Date().toISOString()
          });
          setScore(newScore);
          toast({
            title: "تم خصم نقطة",
            description: "تم خصم نقطة بسبب مغادرة أو إخفاء الصفحة أثناء التحدي.",
            variant: "destructive"
          });
        } catch (error) {
          console.error("Error updating score:", error);
        }
      }
    };

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (
        user?.uid &&
        score > 0 &&
        isStarted &&
        currentQuestion
      ) {
        applyPenalty();
        e.preventDefault();
        e.returnValue = "سيتم خصم نقطة عند الخروج. هل أنت متأكد؟";
        return e.returnValue;
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        applyPenalty();
      }
    };

    const handlePageHide = () => {
      applyPenalty();
    };

    const handleBlur = () => {
      applyPenalty();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('pagehide', handlePageHide);
    window.addEventListener('blur', handleBlur);

    const preventCheating = (e: any) => {
      e.preventDefault();
      return false;
    };
    document.addEventListener('copy', preventCheating);
    document.addEventListener('paste', preventCheating);
    document.addEventListener('contextmenu', preventCheating);
    document.addEventListener('cut', preventCheating);
    document.addEventListener('selectstart', preventCheating);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('pagehide', handlePageHide);
      window.removeEventListener('blur', handleBlur);
      document.removeEventListener('copy', preventCheating);
      document.removeEventListener('paste', preventCheating);
      document.removeEventListener('contextmenu', preventCheating);
      document.removeEventListener('cut', preventCheating);
      document.removeEventListener('selectstart', preventCheating);
    };
  }, [user, score, isStarted, currentQuestion, toast]);

  useEffect(() => {
    if (currentQuestion) {
      hasAnsweredRef.current = false;
      setTimer(30);
      setIsTimerRunning(true);
      setUserAnswer("");
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [currentQuestion?.id]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    if (currentQuestion && isTimerRunning && !hasAnsweredRef.current) {
      intervalId = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer <= 1) {
            clearInterval(intervalId!);
            handleTimeUp();
            return 30;
          }
          return prevTimer - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [currentQuestion, isTimerRunning, hasAnsweredRef.current]);

  const handleTimeUp = () => {
    if (!hasAnsweredRef.current && currentQuestion) {
      hasAnsweredRef.current = true;
      setIsTimerRunning(false);
      setError("انتهى الوقت!");
      setShowCorrectAnswer(true);
      
      const updatedQuestions = questions.map(q =>
        q.id === currentQuestion?.id
          ? { ...q, repeatCount: (q.repeatCount || 0) + 1 }
          : q
      );
      
      setQuestions(updatedQuestions);
      
      const questionsRepeatCount = updatedQuestions.reduce((acc, q) => ({
        ...acc,
        [q.id]: q.repeatCount || 0
      }), {});
      
      saveProgress(score, answeredIds, questionsRepeatCount);
    }
  };

  const handleWrongAnswer = () => {
    const updatedQuestions = questions.map(q =>
      q.id === currentQuestion?.id
        ? { ...q, repeatCount: (q.repeatCount || 0) + 1 }
        : q
    );
    
    setQuestions(updatedQuestions);
    
    const questionsRepeatCount = updatedQuestions.reduce((acc, q) => ({
      ...acc,
      [q.id]: q.repeatCount || 0
    }), {});
    
    saveProgress(score, answeredIds, questionsRepeatCount);
    setError("إجابة غير صحيحة");
    setShowCorrectAnswer(true);
  };

  const handleSave = () => {
    if (!form.question.trim() || form.options.some((o) => !o.trim()) || !form.answer.trim()) {
      setError("يرجى ملء جميع الحقول واختيار الإجابة الصحيحة.");
      return;
    }
    if (!form.options.includes(form.answer)) {
      setError("الإجابة الصحيحة يجب أن تكون من ضمن الخيارات.");
      return;
    }
    if (editId) {
      setQuestions((prev) =>
        prev.map((q) =>
          q.id === editId
            ? { ...q, question: form.question, code: form.code, options: form.options, answer: form.answer }
            : q
        )
      );
    } else {
      setQuestions((prev) => [
        ...prev,
        {
          id: Date.now(),
          question: form.question,
          code: form.code,
          options: form.options,
          answer: form.answer,
        },
      ]);
    }
    setForm({ question: "", code: "", options: ["", "", "", ""], answer: "" });
    setEditId(null);
    setShowAddPanel(false);
    setError(null);
  };

  const TimerComponent = () => (
    <div className="absolute top-4 right-4 bg-white/90 dark:bg-gray-800/90 px-6 py-3 rounded-2xl shadow-lg backdrop-blur-sm">
      <div className="flex items-center gap-2">
        <Clock className="h-5 w-5 text-primary" />
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground">الوقت المتبقي</span>
          <span className={`font-bold text-xl ${
            timer <= 10 
              ? 'text-red-500' 
              : timer <= 20 
                ? 'text-yellow-500' 
                : 'text-primary'
          }`}>
            {timer} ثانية
          </span>
        </div>
      </div>
    </div>
  );

  const StartScreen = () => (
    <Card className="text-center p-16 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-3xl shadow-2xl">
      <div className="space-y-8">
        <div className="text-6xl">🎯</div>
        <h3 className="text-4xl font-bold text-primary">مرحباً بك في التحديات البرمجية</h3>
        <p className="text-xl text-muted-foreground">
          اختبر معلوماتك البرمجية وتنافس مع الآخرين
        </p>
        <div className="flex flex-col gap-4 items-center">
          <p className="text-sm text-muted-foreground">
            لديك 30 ثانية للإجابة على كل سؤال
          </p>
          <Button
            size="lg"
            onClick={handleStartChallenge}
            className="text-xl px-8 py-6 rounded-full bg-primary hover:bg-primary/90 transition-all duration-300 hover:scale-105"
          >
            ابدأ التحدي
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </Card>
  );

  const TopThree = () => {
    const first = topUsers[0];
    const second = topUsers[1];
    const third = topUsers[2];

    return (
      <div className="relative w-full h-[200px] mb-8 flex justify-center items-end gap-2">
        {second && (
          <div className="relative group max-w-[110px] flex flex-col items-center order-1" style={{zIndex: 2}}>
            <div className="w-24 h-24 rounded-full border-4 border-gray-300 bg-gray-100 dark:bg-gray-700 shadow-md flex items-center justify-center relative overflow-hidden">
              <img
                src={
                  second.avatar && second.avatar.startsWith("http")
                    ? second.avatar
                    : "https://res.cloudinary.com/dmao2zbvt/image/upload/v1749047282/insghjql3cf7hep1aidk.png"
                }
                alt="avatar"
                className="w-full h-full rounded-full object-cover absolute inset-0"
                style={{ zIndex: 1 }}
                onError={e => { (e.target as HTMLImageElement).src = "https://res.cloudinary.com/dmao2zbvt/image/upload/v1749047282/insghjql3cf7hep1aidk.png"; }}
              />
              <span
                className="absolute -top-3 -right-3 bg-yellow-400 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-xl border-4 border-background"
                style={{zIndex: 2}}
              >
                2
              </span>
            </div>
            <div className="mt-2 text-center truncate">
              <p className="font-semibold text-gray-800 dark:text-gray-200 truncate px-1 break-all text-xs md:text-sm max-w-full">{second.fullName}</p>
              <p className="text-gray-600 dark:text-gray-400 text-xs">{second.challengeScore} نقطة</p>
            </div>
          </div>
        )}

        {first && (
          <div className="relative group max-w-[140px] flex flex-col items-center order-2" style={{zIndex: 3}}>
            <div className="w-32 h-32 rounded-full border-4 border-yellow-400 bg-yellow-100 dark:bg-yellow-700 shadow-xl flex items-center justify-center relative overflow-hidden">
              <img
                src={
                  first.avatar && first.avatar.startsWith("http")
                    ? first.avatar
                    : "https://res.cloudinary.com/dmao2zbvt/image/upload/v1749047282/insghjql3cf7hep1aidk.png"
                }
                alt="avatar"
                className="w-full h-full rounded-full object-cover absolute inset-0"
                style={{ zIndex: 1 }}
                onError={e => { (e.target as HTMLImageElement).src = "https://res.cloudinary.com/dmao2zbvt/image/upload/v1749047282/insghjql3cf7hep1aidk.png"; }}
              />
              <span
                className="absolute -top-4 -right-4 bg-yellow-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-2xl border-4 border-background"
                style={{zIndex: 2}}
              >
                1
              </span>
              <Trophy className="h-12 w-12 text-yellow-600 group-hover:text-white z-10 absolute left-1/2 -translate-x-1/2 bottom-2" />
            </div>
            <div className="mt-2 text-center truncate">
              <p className="font-bold text-yellow-600 dark:text-yellow-400 truncate px-1 break-all text-base md:text-lg max-w-full">{first.fullName}</p>
              <p className="text-yellow-600 dark:text-yellow-400 text-xs">{first.challengeScore} نقطة</p>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">المركز الأول</p>
            </div>
          </div>
        )}

        {third && (
          <div className="relative group max-w-[90px] flex flex-col items-center order-3" style={{zIndex: 1}}>
            <div className="w-20 h-20 rounded-full border-4 border-amber-600 bg-amber-100 dark:bg-amber-700 shadow-md flex items-center justify-center relative overflow-hidden">
              <img
                src={
                  third.avatar && third.avatar.startsWith("http")
                    ? third.avatar
                    : "https://res.cloudinary.com/dmao2zbvt/image/upload/v1749047282/insghjql3cf7hep1aidk.png"
                }
                alt="avatar"
                className="w-full h-full rounded-full object-cover absolute inset-0"
                style={{ zIndex: 1 }}
                onError={e => { (e.target as HTMLImageElement).src = "https://res.cloudinary.com/dmao2zbvt/image/upload/v1749047282/insghjql3cf7hep1aidk.png"; }}
              />
              <span
                className="absolute -top-2 -right-2 bg-amber-500 text-white rounded-full w-7 h-7 flex items-center justify-center font-bold text-lg border-4 border-background"
                style={{zIndex: 2}}
              >
                3
              </span>
            </div>
            <div className="mt-2 text-center truncate">
              <p className="font-semibold text-amber-800 dark:text-amber-200 truncate px-1 break-all text-xs md:text-sm max-w-full">{third.fullName}</p>
              <p className="text-amber-700 dark:text-amber-300 text-xs">{third.challengeScore} نقطة</p>
            </div>
          </div>
        )}
      </div>
    );
  };

  const LeaderboardCard = () => (
    <Card className="border-0 shadow-2xl rounded-3xl overflow-hidden bg-white/90 dark:bg-[#1e293b]/90 backdrop-blur-sm transform transition-all duration-300 hover:translate-y-[-2px]">
      <CardHeader className="bg-gradient-to-br from-primary via-primary/90 to-secondary p-6 text-center">
        <div className="flex items-center justify-center gap-2">
          <Medal className="h-7 w-7 text-white animate-pulse" />
          <h2 className="text-2xl font-bold text-white">المتصدرين</h2>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-2">
          {topUsers.slice(3, 10).map((leaderboardUser, index) => (
            <div
              key={leaderboardUser.id}
              className="flex items-center justify-between p-3 rounded-xl transition-all duration-300 hover:bg-muted/50 border border-transparent hover:border-primary/10"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-muted/50">
                  <span className="font-bold text-foreground/80">{index + 4}</span>
                </div>
                <img
                  src={
                    leaderboardUser.avatar && leaderboardUser.avatar.startsWith("http")
                      ? leaderboardUser.avatar
                      : "https://res.cloudinary.com/dmao2zbvt/image/upload/v1749047282/insghjql3cf7hep1aidk.png"
                  }
                  alt="avatar"
                  className="w-8 h-8 rounded-full object-cover border-2 border-yellow-400 bg-[#222]"
                  onError={e => { (e.target as HTMLImageElement).src = "https://res.cloudinary.com/dmao2zbvt/image/upload/v1749047282/insghjql3cf7hep1aidk.png"; }}
                />
                <span className="font-medium text-foreground truncate break-all text-xs md:text-sm max-w-[120px]">
                  {leaderboardUser.fullName}
                </span>
              </div>
              <span className="font-bold text-primary text-xs md:text-sm">{leaderboardUser.challengeScore} نقطة</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const renderOptions = () => (
    <div className="grid grid-cols-2 gap-x-5 gap-y-8">
      {currentQuestion?.options.map((opt, i) => (
        <Button
          key={i}
          variant={userAnswer === opt ? "default" : "outline"}
          onClick={() => {
            if (!showCorrectAnswer) {
              setUserAnswer(opt);
              setError(null);
            }
          }}
          className={`w-full justify-start text-right text-lg py-5 px-6 rounded-2xl border-2 transition-all
            ${userAnswer === opt ? "bg-primary/10 border-primary/30 shadow-lg" : "border-muted/20"}
            ${showCorrectAnswer && opt === currentQuestion.answer ? "border-green-500 bg-green-50 dark:bg-green-900/20" : ""}
            ${showCorrectAnswer && userAnswer === opt && opt !== currentQuestion.answer ? "border-red-500 bg-red-50 dark:bg-red-900/20" : ""}
            hover:scale-[1.02] hover:shadow-md`}
          disabled={showCorrectAnswer}
        >
          {opt}
        </Button>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-background to-muted/40">
      <header className="relative overflow-hidden py-8 px-2 md:py-12 md:px-4 mb-6 md:mb-8">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent" />
        <div className="max-w-2xl md:max-w-4xl mx-auto relative z-10">
          <div className="flex flex-col items-center gap-4 md:gap-6">
            <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-2 md:mb-4 text-center leading-tight">
              تحديات برمجية
            </h1>
            <div className="flex items-center gap-2 md:gap-3 bg-primary/10 px-4 md:px-6 py-2 md:py-3 rounded-xl md:rounded-2xl shadow-lg">
              <Trophy className="h-5 w-5 md:h-6 md:w-6 text-primary" />
              <span className="font-semibold text-lg md:text-xl">النقاط: {score}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-full md:max-w-7xl mx-auto px-2 md:px-4 py-4 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-12">
          <div className="lg:col-span-8 space-y-6 md:space-y-8">
            {!isStarted ? (
              <StartScreen />
            ) : currentQuestion ? (
              <Card className="overflow-hidden border-0 shadow-2xl bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-2xl md:rounded-3xl">
                <CardHeader className="border-b bg-gradient-to-r from-primary/5 to-secondary/5 px-4 md:px-8 py-4 md:py-6 relative">
                  <TimerComponent />
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      {(userRole === "admin" || userRole === "owner") && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setShowAddPanel(true);
                              handleEdit(currentQuestion);
                            }}
                          >
                            <Edit2 className="h-5 w-5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(currentQuestion.id)}
                          >
                            <Trash2 className="h-5 w-5 text-destructive" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4 md:p-8">
                  <div className="space-y-10">
                    <h2 className="text-3xl font-bold text-center mb-8">{currentQuestion.question}</h2>
                    {currentQuestion.code && (
                      <pre className="bg-muted/30 p-6 rounded-2xl overflow-x-auto font-mono text-base text-left mb-6">
                        <code>{currentQuestion.code}</code>
                      </pre>
                    )}
                    {renderOptions()}
                    {error && (
                      <div className="space-y-4">
                        <div className="p-4 rounded-xl bg-destructive/10 text-destructive text-center text-lg font-medium">
                          {error}
                        </div>
                        {showCorrectAnswer && (
                          <div className="p-4 rounded-xl bg-green-100 dark:bg-green-900/20 border-2 border-green-500 text-center space-y-4">
                            <p className="font-semibold text-green-700 dark:text-green-300">الإجابة الصحيحة هي:</p>
                            <p className="text-lg text-green-800 dark:text-green-200">{currentQuestion?.answer}</p>
                            <Button
                              onClick={handleShowNext}
                              className="bg-green-600 hover:bg-green-700 text-white px-8 py-2 rounded-full"
                            >
                              السؤال التالي
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                    {!showCorrectAnswer && !hasAnsweredRef.current && (
                      <div className="flex flex-col items-center gap-4">
                        <div className="flex justify-center gap-8">
                          <Button
                            variant="ghost"
                            onClick={goToPrevQuestion}
                            disabled={!currentQuestion || unansweredQuestions.findIndex(q => q.id === currentQuestion?.id) === 0}
                            className="rounded-full w-14 h-14"
                            aria-label="السابق"
                          />
                          <Button
                            onClick={() => handleAnswer(userAnswer)}
                            disabled={!userAnswer}
                            className="px-12 py-4 text-xl rounded-full shadow-lg bg-primary hover:bg-primary/90 text-white"
                          >
                            تحقق
                          </Button>
                          <Button
                            variant="ghost"
                            onClick={goToNextQuestion}
                            disabled={
                              !currentQuestion ||
                              unansweredQuestions.findIndex(q => q.id === currentQuestion?.id) === unansweredQuestions.length - 1
                            }
                            className="rounded-full w-14 h-14"
                            aria-label="التالي"
                          />
                        </div>
                        <Button
                          variant="destructive"
                          onClick={handleEndChallenge}
                          className="mt-4 px-8 py-2 rounded-xl hover:scale-105 transition-all duration-300"
                        >
                          إنهاء التحدي
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="text-center p-8 md:p-16 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl md:rounded-3xl shadow-2xl">
                <div className="space-y-6 md:space-y-8">
                  <div className="text-6xl md:text-8xl">🎉</div>
                  <h3 className="text-2xl md:text-4xl font-bold text-primary">أحسنت!</h3>
                  <p className="text-lg md:text-2xl">لقد أجبت على جميع الأسئلة</p>
                  <p className="text-2xl md:text-4xl font-bold text-primary">
                    مجموع نقاطك: {score}
                  </p>
                </div>
              </Card>
            )}
          </div>
          
          <aside className="lg:col-span-4 lg:sticky lg:top-8 space-y-8 md:space-y-12">
            <TopThree />
            <LeaderboardCard />
          </aside>
        </div>
      </main>

      {showAddPanel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 md:p-4 bg-black/40">
          <Card className="relative w-full max-w-xs sm:max-w-md md:max-w-lg rounded-xl md:rounded-2xl shadow-2xl">
            <CardHeader>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-2"
                onClick={() => {
                  setShowAddPanel(false);
                  setEditId(null);
                  setForm({ question: "", code: "", options: ["", "", "", ""], answer: "" });
                  setError(null);
                }}
              >
                <X className="h-4 w-4" />
              </Button>
              <h3 className="text-lg font-bold text-center">
                {editId ? "تعديل سؤال" : "إضافة سؤال جديد"}
              </h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <input
                className="w-full border rounded-lg px-4 py-2"
                placeholder="نص السؤال"
                value={form.question}
                onChange={(e) => setForm((f) => ({ ...f, question: e.target.value }))}
              />
              <input
                className="w-full border rounded-lg px-4 py-2"
                placeholder="كود (اختياري)"
                value={form.code}
                onChange={(e) => setForm((f) => ({ ...f, code: e.target.value }))}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {form.options.map((opt, i) => (
                  <input
                    key={i}
                    className="border rounded-lg px-4 py-2"
                    placeholder={`خيار ${i + 1}`}
                    value={opt}
                    onChange={(e) => {
                      const opts = [...form.options];
                      opts[i] = e.target.value;
                      setForm((f) => ({ ...f, options: opts }));
                    }}
                  />
                ))}
              </div>
              <select
                className="w-full border rounded-lg px-4 py-2"
                value={form.answer}
                onChange={(e) => setForm((f) => ({ ...f, answer: e.target.value }))}
              >
                <option value="">اختر الإجابة الصحيحة</option>
                {form.options.map((opt, i) =>
                  opt ? (
                    <option key={i} value={opt}>
                      {opt}
                    </option>
                  ) : null
                )}
              </select>
              {error && <p className="text-red-500 text-center">{error}</p>}
              <div className="flex justify-center gap-3">
                <Button
                  onClick={handleSave}
                  className="px-6 py-2"
                >
                  {editId ? "تعديل" : "إضافة"}
                </Button>
                {editId && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setEditId(null);
                      setForm({ question: "", code: "", options: ["", "", "", ""], answer: "" });
                      setError(null);
                    }}
                  >
                    إلغاء
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <style>{`
        @media (max-width: 767px) {
          .card, .rounded-3xl, .rounded-2xl {
            border-radius: 1rem !important;
          }
          .card-header, .card-content {
            padding-left: 1rem !important;
            padding-right: 1rem !important;
            padding-top: 1rem !important;
            padding-bottom: 1rem !important;
          }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes float-slower {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
        @keyframes ping-slow {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(1.5); opacity: 0; }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        .animate-float-slow {
          animation: float-slow 4.5s ease-in-out infinite;
        }
        .animate-float-slower {
          animation: float-slower 5s ease-in-out infinite;
        }
        .animate-ping-slow {
          animation: ping-slow 2s infinite;
        }
      `}</style>
    </div>
  );
}