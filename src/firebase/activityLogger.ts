import { db } from './firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

interface Activity {
  type: string;
  userId?: string;
  username?: string;
  ipAddress?: string;
  details?: string;
}

// Define allowed activity types
const ALLOWED_ACTIVITY_TYPES = [
  'download_lecture',
  'translate_lecture',
  'register',
  'delete_user_by_admin',
  'ban_user_by_admin',
];

export const logActivity = async (activity: Activity) => {
  // Only log activity if its type is in the ALLOWED_ACTIVITY_TYPES list
  if (!ALLOWED_ACTIVITY_TYPES.includes(activity.type)) {
    console.warn(`Activity type '${activity.type}' is not allowed for logging.`);
    return;
  }

  try {
    await addDoc(collection(db, 'activities'), {
      ...activity,
      timestamp: serverTimestamp(),
    });
    console.log('Activity logged successfully:', activity.type);
  } catch (error) {
    console.error('Error logging activity:', error);
  }
};
