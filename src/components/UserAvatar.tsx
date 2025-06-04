import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface UserAvatarProps {
  user?: {
    displayName?: string | null;
    photoURL?: string | null;
    email?: string | null;
  } | null;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const UserAvatar: React.FC<UserAvatarProps> = ({ 
  user, 
  className = '',
  size = 'md'
}) => {
  // تحديد الحجم بناءً على الخيار المحدد
  const sizeClass = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-14 w-14'
  }[size];

  // استخلاص معلومات المستخدم للعرض
  const displayName = user?.displayName || user?.email?.split('@')[0] || '';
  const photoURL = user?.photoURL || undefined;

  return (
    <Avatar className={`${sizeClass} ${className}`}>
      {photoURL && (
        <AvatarImage 
          src={photoURL} 
          alt={`${displayName}'s profile picture`} 
        />
      )}
      <AvatarFallback name={displayName}>
        {!displayName && '👤'}
      </AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
