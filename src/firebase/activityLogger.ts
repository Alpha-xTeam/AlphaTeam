import { db } from './firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

interface Activity {
  type: string;
  userId?: string;
  username?: string;
  ipAddress?: string;
  details?: string;
  subjectName?: string;
  lectureTitle?: string;
  stageName?: string;
  timestamp?: any;
}

const ALLOWED_ACTIVITY_TYPES = [
  'register',
  'login',
  'logout',
  'delete_user_by_admin',
  'ban_user_by_admin',
  'unban_user',
  'add_lecture',
  'delete_lecture',
  'add_subject',
  'delete_subject',
  'update_lecture',
  'update_subject'
];

export const logActivity = async (activity: Activity) => {
  if (!ALLOWED_ACTIVITY_TYPES.includes(activity.type)) {
    console.warn(`Activity type '${activity.type}' is not allowed for logging.`);
    return;
  }

  try {
    const ipResponse = await fetch('https://api.ipify.org?format=json');
    if (!ipResponse.ok) {
      throw new Error(`Failed to fetch IP address: ${ipResponse.statusText}`);
    }
    const ipData = await ipResponse.json();

    await addDoc(collection(db, 'activities'), {
      ...activity,
      ipAddress: ipData.ip,
      timestamp: serverTimestamp(),
      metadata: {
        browser: navigator.userAgent,
        platform: navigator.platform,
        timestamp_client: new Date().toISOString(),
      },
    });

    console.log('Activity logged successfully:', activity.type);
  } catch (error: any) {
    if (error.code === 'permission-denied') {
      console.error('Error logging activity: Missing or insufficient permissions.');
    } else {
      console.error('Error logging activity:', error);
    }
    throw new Error('Failed to log activity. Please check Firestore rules or network connectivity.');
  }
};
