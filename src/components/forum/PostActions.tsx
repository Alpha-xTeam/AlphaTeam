import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle, Trash } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Post } from "@/types/forum";
// Define UserProfile type locally
interface UserProfile {
  id: string;
  name: string;
  role: "admin" | "owner" | "user"; // Adjust roles as needed
}

interface PostActionsProps {
  post: Post;
  user: any;
  userProfile: UserProfile | null;
  handleDeletePost: (postId: string) => Promise<void>;
  handlePinPost: (postId: string) => Promise<void>;
  handleEditPost: (post: Post) => void;
  setExpandedPostId: (id: string | null) => void;
  expandedPostId: string | null;
  isPinned: boolean;
}

export function PostActions({
  post,
  user,
  userProfile,
  handleDeletePost,
  handlePinPost,
  handleEditPost,
  setExpandedPostId,
  expandedPostId,
  isPinned,
}: PostActionsProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm("هل أنت متأكد من حذف هذا المنشور؟")) return;
    setIsDeleting(true);
    try {
      await handleDeletePost(post.id);
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء حذف المنشور",
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button
        variant="ghost"
        onClick={() => setExpandedPostId(expandedPostId === post.id ? null : post.id)}
        className="flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-primary/10 to-accent/10"
      >
        <MessageCircle className="h-5 w-5" />
        <span className="font-semibold">{post.comments.length} تعليق</span>
      </Button>

      {(user?.uid === post.userId || userProfile?.role === "admin" || userProfile?.role === "owner") && (
        <div className="flex gap-2 items-center">
          {(userProfile?.role === "admin" || userProfile?.role === "owner") && (
            <Button
              variant="ghost"
              className="bg-yellow-100/60 dark:bg-yellow-900/40 text-yellow-600"
              onClick={() => handlePinPost(post.id)}
            >
              {isPinned ? "إلغاء التثبيت" : "تثبيت"}
            </Button>
          )}

          <Button
            variant="ghost"
            className="bg-primary/10 text-primary"
            onClick={() => handleEditPost(post)}
          >
            تعديل
          </Button>

          <Button
            variant="ghost"
            className="bg-red-100/60 dark:bg-red-900/40 text-red-600"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
