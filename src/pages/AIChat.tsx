import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Bot, User, Image as ImageIcon, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/theme-context'; // Import useTheme
import { Avatar, AvatarFallback } from "@/components/ui/avatar"; // Import Avatar components
import OpenAI from 'openai';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import { ChatCompletionMessageParam } from 'openai/resources/chat/completions';

interface MessageContentPart {
  type: 'text' | 'image_url';
  text?: string;
  image_url?: { url: string };
}

interface Message {
  role: 'user' | 'assistant';
  content: string | MessageContentPart[];
}

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: "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", // استخدم مفتاح OpenRouter API الخاص بك
  defaultHeaders: {
    "HTTP-Referer": "YOUR_SITE_URL", // Optional. Site URL for rankings on openrouter.ai.
    "X-Title": "ALPHA TEAM", // Optional. Site title for rankings on openrouter.ai.
  },
  dangerouslyAllowBrowser: true, // السماح بالاستخدام في المتصفح
});

const AIChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme(); // Get current theme

  const scrollToBottom = () => {
    const chatContainer = messagesEndRef.current?.parentElement;
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  };

  // تفعيل التمرير التلقائي عند كل تحديث للرسائل
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImageFile(null);
      setImagePreview(null);
    }
  };

  const handleSendMessage = async () => {
    if (input.trim() === '' && !imageFile) return;

    let userMessageContent: MessageContentPart[] = [];
    if (input.trim() !== '') {
      userMessageContent.push({ type: 'text', text: input.trim() });
    }
    if (imagePreview) {
      userMessageContent.push({ type: 'image_url', image_url: { url: imagePreview } });
    }

    const userMessage: Message = { role: 'user', content: userMessageContent };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput('');
    setImageFile(null);
    setImagePreview(null);
    setLoading(true);

    try {
      const apiMessages: ChatCompletionMessageParam[] = [
        ...messages.map(msg => {
          if (typeof msg.content === 'string') {
            return { role: msg.role, content: msg.content } as ChatCompletionMessageParam;
          }
          return {
            role: msg.role,
            content: msg.content.map(part => {
              if (part.type === 'text') {
                return { type: 'text', text: part.text || '' };
              } else if (part.type === 'image_url' && part.image_url) {
                return { type: 'image_url', image_url: { url: part.image_url.url } };
              }
              return { type: 'text', text: '' }; // Fallback to text type
            }),
          } as ChatCompletionMessageParam;
        }),
        {
          role: userMessage.role,
          content: typeof userMessage.content === 'string'
            ? userMessage.content
            : userMessage.content.map(part => {
                if (part.type === 'text') {
                  return { type: 'text', text: part.text || '' };
                } else if (part.type === 'image_url' && part.image_url) {
                  return { type: 'image_url', image_url: { url: part.image_url.url } };
                }
                return { type: 'text', text: '' };
              }),
        } as ChatCompletionMessageParam,
      ];

      const completion = await openai.chat.completions.create({
        model: "deepseek/deepseek-chat:free",
        messages: apiMessages,
      });

      const assistantMessageContent = completion.choices[0].message.content;
      const assistantMessage: Message = { role: 'assistant', content: assistantMessageContent || '' };
      setMessages((prevMessages) => [...prevMessages, assistantMessage]);

    } catch (error: any) {
      console.error("Error communicating with AI:", error);
      let errorMessage = 'عذرًا، حدث خطأ أثناء الاتصال بالذكاء الاصطناعي.';
      if (error.message.includes('Too Many Requests')) {
        errorMessage = error.message;
      }
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: 'assistant', content: errorMessage }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const renderMessageContent = (content: string | MessageContentPart[]) => {
    if (typeof content === 'string') {
      return (
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            // تخصيص عرض العناصر لـ Tailwind CSS
            h1: ({node, ...props}) => <h1 className="text-2xl font-bold mb-2" {...props} />,
            h2: ({node, ...props}) => <h2 className="text-xl font-semibold mb-2" {...props} />,
            h3: ({node, ...props}) => <h3 className="text-lg font-medium mb-2" {...props} />,
            p: ({node, ...props}) => <p className="mb-2 leading-relaxed" {...props} />,
            ul: ({node, ...props}) => <ul className="list-disc list-inside mb-2" {...props} />,
            ol: ({node, ...props}) => <ol className="list-decimal list-inside mb-2" {...props} />,
            li: ({node, ...props}) => <li className="mb-1" {...props} />,
            a: ({node, ...props}) => <a className="text-blue-400 hover:underline" {...props} />,
            strong: ({node, ...props}) => <strong className="font-bold" {...props} />,
            em: ({node, ...props}) => <em className="italic" {...props} />,
            blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-gray-500 pl-4 italic my-2" {...props} />,
            code: ({node, ...props}) => {
              const classNames = node?.properties?.className;
              const className = Array.isArray(classNames) ? classNames.join(' ') : '';
              const isInline = !className.includes('language-'); // Heuristic to check if it's an inline code block
              const codeClassName = isInline ? "bg-gray-700 px-1 rounded" : "block bg-gray-700 p-2 rounded-md text-sm overflow-x-auto my-2";
              return <code className={codeClassName} {...props} />;
            },
            pre: ({node, ...props}) => <pre className="bg-gray-700 p-2 rounded-md text-sm overflow-x-auto my-2" {...props} />,
            table: ({node, ...props}) => <table className="table-auto w-full my-2 border-collapse border border-gray-600" {...props} />,
            th: ({node, ...props}) => <th className="border border-gray-600 px-4 py-2 text-left bg-gray-600" {...props} />,
            td: ({node, ...props}) => <td className="border border-gray-600 px-4 py-2" {...props} />,
          }}
        >
          {content}
        </ReactMarkdown>
      );
    }
    return content.map((part, idx) => {
      if (part.type === 'text') {
        return (
          <ReactMarkdown
            key={idx}
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({node, ...props}) => <h1 className="text-2xl font-bold mb-2" {...props} />,
              h2: ({node, ...props}) => <h2 className="text-xl font-semibold mb-2" {...props} />,
              h3: ({node, ...props}) => <h3 className="text-lg font-medium mb-2" {...props} />,
              p: ({node, ...props}) => <p className="mb-2 leading-relaxed" {...props} />,
              ul: ({node, ...props}) => <ul className="list-disc list-inside mb-2" {...props} />,
              ol: ({node, ...props}) => <ol className="list-decimal list-inside mb-2" {...props} />,
              li: ({node, ...props}) => <li className="mb-1" {...props} />,
              a: ({node, ...props}) => <a className="text-blue-400 hover:underline" {...props} />,
              strong: ({node, ...props}) => <strong className="font-bold" {...props} />,
              em: ({node, ...props}) => <em className="italic" {...props} />,
              blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-gray-500 pl-4 italic my-2" {...props} />,
              code: ({node, ...props}) => {
                const classNames = node?.properties?.className;
                const className = Array.isArray(classNames) ? classNames.join(' ') : '';
                const isInline = !className.includes('language-');
                const codeClassName = isInline ? "bg-gray-700 px-1 rounded" : "block bg-gray-700 p-2 rounded-md text-sm overflow-x-auto my-2";
                return <code className={codeClassName} {...props} />;
              },
              pre: ({node, ...props}) => <pre className="bg-gray-700 p-2 rounded-md text-sm overflow-x-auto my-2" {...props} />,
              table: ({node, ...props}) => <table className="table-auto w-full my-2 border-collapse border border-gray-600" {...props} />,
              th: ({node, ...props}) => <th className="border border-gray-600 px-4 py-2 text-left bg-gray-600" {...props} />,
              td: ({node, ...props}) => <td className="border border-gray-600 px-4 py-2" {...props} />,
            }}
          >
            {part.text}
          </ReactMarkdown>
        );
      } else if (part.type === 'image_url' && part.image_url) {
        return <img key={idx} src={part.image_url.url} alt="User uploaded" className="max-w-xs max-h-48 rounded-lg mt-2 shadow-md" />;
      }
      return null;
    });
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${theme === 'dark' ? 'bg-gray-950 text-white' : 'bg-gradient-to-br from-blue-50 to-purple-100 text-foreground'}`}>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-5xl" 
      >
        <Card className={`shadow-2xl border-none rounded-3xl overflow-hidden ${theme === 'dark' ? 'bg-gray-800' : 'bg-card'}`}>
          <CardHeader className={`text-center py-8 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gradient-to-r from-blue-600 to-purple-600'} rounded-t-3xl`}>
            <CardTitle className="text-4xl font-extrabold text-white flex items-center justify-center">
              <Bot className="h-10 w-10 mr-4" />
              تحدث مع الذكاء الاصطناعي
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className={`h-[300px] overflow-y-auto mb-1 p-4 rounded-2xl shadow-inner ${theme === 'dark' ? 'bg-gray-900 border border-gray-700' : 'bg-gray-50 border border-gray-200'} custom-scrollbar`}>
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                  <Bot className="h-16 w-16 mb-4 text-primary" />
                  <p className="text-xl font-medium">ابدأ محادثة مع الذكاء الاصطناعي</p>
                </div>
              ) : (
                messages.map((msg, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex items-start mb-6 gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {msg.role === 'assistant' && (
                      <Avatar className="h-10 w-10 flex-shrink-0 shadow-md">
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                          <Bot className="h-6 w-6" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={`p-4 rounded-2xl max-w-[80%] shadow-lg ${
                        msg.role === 'user'
                          ? `${theme === 'dark' ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'} rounded-br-none`
                          : `${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-800'} rounded-bl-none`
                      }`}
                    >
                      {renderMessageContent(msg.content)}
                    </div>
                    {msg.role === 'user' && (
                      <Avatar className="h-10 w-10 flex-shrink-0 shadow-md">
                        <AvatarFallback className="bg-gradient-to-br from-green-500 to-teal-500 text-white">
                          <User className="h-6 w-6" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </motion.div>
                ))
              )}
              {loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className={`flex items-center mb-6 gap-3 ${theme === 'dark' ? 'text-gray-400' : 'text-muted-foreground'}`}
                >
                  <Avatar className="h-10 w-10 flex-shrink-0 shadow-md">
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                      <Bot className="h-6 w-6" />
                    </AvatarFallback>
                  </Avatar>
                  <div className={`p-4 rounded-2xl max-w-[80%] shadow-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}>
                    <span className="typing-indicator">
                      <span className="dot">.</span>
                      <span className="dot">.</span>
                      <span className="dot">.</span>
                    </span>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>
            {/* تم نقل CSS لمؤشر الكتابة إلى index.css */}
            {imagePreview && (
              <div className="mb-6 flex items-center justify-between p-4 border rounded-xl bg-background/50 shadow-md">
                <img src={imagePreview} alt="Image preview" className="max-w-[120px] max-h-[120px] rounded-lg object-cover border border-border shadow-sm" />
                <Button variant="ghost" onClick={() => { setImagePreview(null); setImageFile(null); }} className="text-red-500 hover:bg-red-50 focus:bg-red-50">
                  إزالة الصورة
                </Button>
              </div>
            )}
            <div className="flex space-x-3">
              <Input
                type="text"
                placeholder="اكتب رسالتك هنا..."
                className={`flex-1 pr-4 py-3 text-lg border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 rounded-xl ${theme === 'dark' ? 'bg-gray-700 text-white border-gray-600' : ''}`}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                disabled={loading}
              />
              <label htmlFor="image-upload" className={`flex items-center justify-center p-3 rounded-xl cursor-pointer ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-secondary hover:bg-secondary/80'} transition-colors duration-300 shadow-md`}>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                  disabled={loading}
                />
                <ImageIcon className={`h-7 w-7 ${theme === 'dark' ? 'text-gray-300' : 'text-muted-foreground'}`} />
              </label>
              <Button onClick={handleSendMessage} disabled={loading} className="py-3 px-6 text-lg font-semibold bg-primary hover:bg-primary/90 transition-all duration-300 rounded-xl shadow-md">
                {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : <Send className="h-6 w-6" />}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default AIChat;
