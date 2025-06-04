import { motion } from "framer-motion";
import UserAvatar from "@/components/UserAvatar";
import { Comment } from "@/types/forum";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

interface PostCommentProps {
  postId: string;
  comments: Comment[];
  user: any;
  userProfile: any;
  commentInputs: { [postId: string]: string };
  setCommentInputs: React.Dispatch<React.SetStateAction<{ [postId: string]: string }>>;
  handleAddComment: (postId: string) => void;
}

export function PostComment({
  postId,
  comments,
  user,
  userProfile,
  commentInputs,
  setCommentInputs,
  handleAddComment,
}: PostCommentProps) {
  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <motion.div
          key={comment.id}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex gap-3 p-4 bg-gradient-to-r from-background/80 via-card/80 to-muted/70 rounded-xl border border-border/30 transition-all hover:shadow-md shadow-sm"
        >
          <UserAvatar
            user={{
              displayName: comment.author,
              photoURL: comment.photoURL,
            }}
            className="h-10 w-10"
          />
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <span className="font-medium text-sm text-primary">{comment.author}</span>
              <span className="text-xs text-muted-foreground">
                {typeof comment.createdAt === "object"
                  ? new Date(comment.createdAt.seconds * 1000).toLocaleString("ar-EG")
                  : new Date(comment.createdAt).toLocaleString("ar-EG")}
              </span>
            </div>
            <p className="text-sm mt-1 text-foreground" dir="rtl">
              {comment.text}
            </p>
          </div>
        </motion.div>
      ))}
      {user && (
        <div className="flex gap-2 mt-6 items-end">
          <Textarea
            placeholder="اكتب تعليق..."
            value={commentInputs[postId] || ""}
            onChange={(e) =>
              setCommentInputs({
                ...commentInputs,
                [postId]: e.target.value,
              })
            }
            className="flex-1 py-5 text-base rounded-2xl border-0 shadow focus:ring-2 focus:ring-primary/30 bg-primary/10 dark:bg-zinc-800/60 text-foreground"
            dir="rtl"
          />
          <Button
            size="lg"
            onClick={() => handleAddComment(postId)}
            disabled={!commentInputs[postId]?.trim()}
            className="rounded-full px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white shadow-lg hover:scale-105 hover:shadow-xl transition-all"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      )}
    </div>
  );
}
