export interface Comment {
  id: number;
  author: string;
  userId: string;
  photoURL?: string;
  text: string;
  createdAt: number | { seconds: number };
}

export interface Post {
  id: string;
  author: string;
  userId: string;
  photoURL?: string;
  createdAt: { seconds: number } | null;
  category: string;
  title: string;
  content: string;
  attachments: any[];
  comments: Comment[];
  showAllComments?: boolean;
  authorRole?: string;
  pinned?: boolean;
}
