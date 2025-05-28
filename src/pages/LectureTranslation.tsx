import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea"; // استيراد Textarea
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"; // استيراد Tooltip
import { ArrowRight, Languages, Download, Loader2, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/theme-context';
import { PDFDocument, rgb } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import { saveAs } from 'file-saver';
import * as pdfjs from 'pdfjs-dist';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { auth } from '@/firebase/firebase'; // Import auth
import { logActivity } from '@/firebase/activityLogger'; // Import logActivity
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

interface MessageContent {
  type: 'text';
  text?: string;
}

interface Message {
  role: 'user' | 'assistant';
  content: string | MessageContent[];
}

const LectureTranslation = () => {
  const [file, setFile] = useState<File | null>(null);
  const [fileContent, setFileContent] = useState('');
  const [targetLanguage, setTargetLanguage] = useState('en');
  const [translatedContent, setTranslatedContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastTranslationTime, setLastTranslationTime] = useState<number>(0); // لتخزين وقت آخر ترجمة
  const { theme } = useTheme();

  const TRANSLATION_COOLDOWN = 5 * 60 * 1000; // 5 دقائق بالمللي ثانية

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setTranslatedContent('');
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFile(file);

      if (file.type === 'application/pdf') {
        const arrayBuffer = await file.arrayBuffer();
        const pdfDoc = await pdfjs.getDocument({ data: arrayBuffer }).promise;
        let fullText = '';
        for (let i = 1; i <= pdfDoc.numPages; i++) {
          const page = await pdfDoc.getPage(i);
          const textContent = await page.getTextContent();
          fullText += textContent.items.map((item: any) => item.str).join(' ') + '\n';
        }
        setFileContent(fullText);
      } else {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFileContent(reader.result as string);
        };
        reader.readAsText(file);
      }
    } else {
      setFile(null);
      setFileContent('');
    }
  };

  const handleTranslate = async () => {
    if (!fileContent) {
      setError('الرجاء تحميل ملف للترجمة.');
      return;
    }

    const now = Date.now();
    const timeSinceLastTranslation = now - lastTranslationTime;

    if (timeSinceLastTranslation < TRANSLATION_COOLDOWN) {
      const remainingTime = Math.ceil((TRANSLATION_COOLDOWN - timeSinceLastTranslation) / 1000 / 60);
      setError(`الرجاء الانتظار ${remainingTime} دقائق قبل طلب ترجمة أخرى.`);
      return;
    }

    setLoading(true);
    setTranslatedContent('');
    setError(null);

    try {
      const userMessageContent: MessageContent[] = [{ type: 'text', text: `Translate the following text to ${targetLanguage}: ${fileContent}` }];
      const messages: Message[] = [
        { role: 'user', content: userMessageContent }
      ];

      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": "Bearer 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",
          "HTTP-Referer": "YOUR_SITE_URL", // Optional. Site URL for rankings on openrouter.ai.
          "X-Title": "ALPHA TEAM", // Optional. Site title for rankings on openrouter.ai.
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "model": "deepseek/deepseek-chat:free",
          "messages": messages
        })
      });

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error('Too Many Requests: لقد تجاوزت حدود معدل الاستخدام لـ AI. يرجى المحاولة لاحقًا.');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const assistantMessageContent = data.choices[0].message.content;
      setTranslatedContent(assistantMessageContent);
      setLastTranslationTime(now); // تحديث وقت آخر ترجمة بنجاح

      // Log activity for translation
      if (auth.currentUser) {
        await logActivity({
          type: 'translate_lecture',
          userId: auth.currentUser.uid,
          username: auth.currentUser.email || 'N/A',
          details: `المستخدم ${auth.currentUser.email} قام بترجمة ملف إلى ${targetLanguage}.`,
        });
      }

    } catch (err: any) {
      console.error("Error translating content:", err);
      let errorMessage = 'عذرًا، حدث خطأ أثناء الاتصال بالذكاء الاصطناعي.';
      if (err.message.includes('Too Many Requests')) {
        errorMessage = err.message;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!translatedContent) return;

    const pdfDoc = await PDFDocument.create();
    pdfDoc.registerFontkit(fontkit);

    const fontBytes = await fetch('/fonts/NotoSansArabic-Regular.ttf').then(res => res.arrayBuffer());
    const customFont = await pdfDoc.embedFont(fontBytes);

    let page = pdfDoc.addPage();
    
    const lines = translatedContent.split('\n');
    let yPosition = page.getHeight() - 50;
    const fontSize = 12;
    const lineHeight = fontSize * 1.2;
    const margin = 50;

    for (const line of lines) {
      const textWidth = customFont.widthOfTextAtSize(line, fontSize);
      const xPosition = page.getWidth() - margin - textWidth; 

      if (yPosition < margin) {
        page = pdfDoc.addPage();
        yPosition = page.getHeight() - 50;
      }
      page.drawText(line, {
        x: xPosition,
        y: yPosition,
        font: customFont,
        size: fontSize,
        color: rgb(0, 0, 0),
      });
      yPosition -= lineHeight;
    }

    const modifiedPdfBytes = await pdfDoc.save();
    const blob = new Blob([modifiedPdfBytes], { type: 'application/pdf' });
    const fileName = file?.name ? `translated_${file.name}` : 'translated_document.pdf';
    saveAs(blob, fileName);
  };

  return (
    <TooltipProvider>
      <div className={`min-h-screen flex items-center justify-center p-4 ${theme === 'dark' ? 'bg-gray-950 text-white' : 'bg-gradient-to-br from-blue-50 to-purple-100 text-foreground'}`}>
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-6xl"
        >
          <Card className={`shadow-2xl border-none rounded-3xl overflow-hidden ${theme === 'dark' ? 'bg-gray-800' : 'bg-card'}`}>
            <CardHeader className={`text-center py-8 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gradient-to-r from-blue-600 to-purple-600'} rounded-t-3xl`}>
              <CardTitle className="text-4xl font-extrabold text-white flex items-center justify-center">
                <Languages className="h-10 w-10 mr-4" />
                ترجمة المحاضرة
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-6">
                {/* قسم تحميل الملف واللغة المستهدفة */}
                <div className="lg:col-span-1 flex flex-col space-y-6">
                  <div>
                    <label htmlFor="fileUpload" className="block text-lg font-medium mb-2 flex items-center">
                      <FileText className="h-5 w-5 mr-2" />
                      تحميل ملف المحاضرة
                    </label>
                    <Input
                      id="fileUpload"
                      type="file"
                      accept=".txt,.pdf"
                      className={`w-full p-4 text-lg border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 rounded-xl ${theme === 'dark' ? 'bg-gray-700 text-white border-gray-600' : ''}`}
                      onChange={handleFileChange}
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <label htmlFor="targetLanguage" className="block text-lg font-medium mb-2 flex items-center">
                      <Languages className="h-5 w-5 mr-2" />
                      اللغة المستهدفة
                    </label>
                    <select
                      id="targetLanguage"
                      className={`w-full p-4 text-lg border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 rounded-xl ${theme === 'dark' ? 'bg-gray-700 text-white border-gray-600' : ''}`}
                      value={targetLanguage}
                      onChange={(e) => setTargetLanguage(e.target.value)}
                      disabled={loading}
                    >
                      <option value="en">English</option>
                      <option value="es">Español</option>
                      <option value="fr">Français</option>
                      <option value="de">Deutsch</option>
                      <option value="it">Italiano</option>
                      <option value="pt">Português</option>
                      <option value="ru">Русский</option>
                      <option value="zh">中文</option>
                      <option value="ja">日本語</option>
                      <option value="ko">한국어</option>
                      <option value="ar">العربية</option>
                    </select>
                  </div>
                  <Button
                    onClick={handleTranslate}
                    disabled={loading || !fileContent}
                    className="w-full py-3 px-6 text-lg font-semibold bg-primary hover:bg-primary/90 transition-all duration-300 rounded-xl shadow-md"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-6 w-6 mr-2 animate-spin" />
                        جاري الترجمة...
                      </>
                    ) : (
                      <>
                        ترجمة
                        <ArrowRight className="h-6 w-6 ml-2" />
                      </>
                    )}
                  </Button>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg text-center font-medium"
                    >
                      {error}
                    </motion.div>
                  )}
                </div>

                {/* قسم النص الأصلي */}
                <div className="lg:col-span-1">
                  <h3 className="text-xl font-semibold mb-3 flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    النص الأصلي
                  </h3>
                  <Textarea
                    value={fileContent}
                    readOnly
                    placeholder="سيظهر النص الأصلي هنا بعد تحميل الملف..."
                    className={`w-full p-4 rounded-2xl shadow-inner h-80 overflow-y-auto resize-none ${theme === 'dark' ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-100 text-gray-800 border-gray-200'}`}
                  />
                </div>

                {/* قسم النص المترجم */}
                <div className="lg:col-span-1">
                  <h3 className="text-xl font-semibold mb-3 flex items-center">
                    <Languages className="h-5 w-5 mr-2" />
                    النص المترجم
                  </h3>
                  <div className={`p-4 rounded-2xl shadow-lg h-80 overflow-y-auto ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-800'}`}>
                    {translatedContent ? (
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          h1: (props) => <h1 className="text-2xl font-bold mb-2" {...props} />,
                          h2: (props) => <h2 className="text-xl font-semibold mb-2" {...props} />,
                          h3: (props) => <h3 className="text-lg font-medium mb-2" {...props} />,
                          p: (props) => <p className="mb-2 leading-relaxed" {...props} />,
                          ul: (props) => <ul className="list-disc list-inside mb-2" {...props} />,
                          ol: (props) => <ol className="list-decimal list-inside mb-2" {...props} />,
                          li: (props) => <li className="mb-1" {...props} />,
                          a: (props) => <a className="text-blue-400 hover:underline" {...props} />,
                          strong: (props) => <strong className="font-bold" {...props} />,
                          em: (props) => <em className="italic" {...props} />,
                          blockquote: (props) => <blockquote className="border-l-4 border-gray-500 pl-4 italic my-2" {...props} />,
                          code: (props) => {
                            const classNames = props.node?.properties?.className;
                            const className = Array.isArray(classNames) ? classNames.join(' ') : '';
                            const isInline = !className.includes('language-');
                            const codeClassName = isInline ? "bg-gray-700 px-1 rounded" : "block bg-gray-700 p-2 rounded-md text-sm overflow-x-auto my-2";
                            return <code className={codeClassName} {...props} />;
                          },
                          pre: (props) => <pre className="bg-gray-700 p-2 rounded-md text-sm overflow-x-auto my-2" {...props} />,
                          table: (props) => <table className="table-auto w-full my-2 border-collapse border border-gray-600" {...props} />,
                          th: (props) => <th className="border border-gray-600 px-4 py-2 text-left bg-gray-600" {...props} />,
                          td: (props) => <td className="border border-gray-600 px-4 py-2" {...props} />,
                        }}
                      >
                        {translatedContent}
                      </ReactMarkdown>
                    ) : (
                      <p className="text-center text-gray-500 mt-10">
                        {loading ? "جاري الترجمة..." : "سيظهر النص المترجم هنا."}
                      </p>
                    )}
                  </div>
                  {translatedContent && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          onClick={handleDownload}
                          className="mt-4 py-3 px-6 text-lg font-semibold bg-secondary hover:bg-secondary/90 transition-all duration-300 rounded-xl shadow-md w-full"
                        >
                          تنزيل الملف المترجم
                          <Download className="h-6 w-6 ml-2" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>تنزيل النص المترجم كملف PDF</p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </TooltipProvider>
  );
};

export default LectureTranslation;
