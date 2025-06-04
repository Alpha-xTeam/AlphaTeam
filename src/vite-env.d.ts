/// <reference types="vite/client" />

interface MessageContentPart {
  type: 'text' | 'image_url';
  text?: string;
  image_url?: { url: string };
}

interface PuterAI {
  chat: {
    completions: {
      create(options: {
        model: string;
        messages: Array<{
          role: 'user' | 'assistant';
          content: string | MessageContentPart[];
        }>;
      }): Promise<Response>;
    };
  };
}

interface Window {
  puter: {
    ai: PuterAI;
  };
}
