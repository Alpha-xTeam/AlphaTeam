// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth"; // Import Auth
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, where, Timestamp } from "firebase/firestore"; // Import Firestore and other necessary functions

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBEQ4RINpi53JYlQfDwtuE8RZ9m9l87BvM",
  authDomain: "alpha-project-713de.firebaseapp.com",
  projectId: "alpha-project-713de",
  storageBucket: "alpha-project-713de.appspot.com",
  messagingSenderId: "551038009112",
  appId: "1:551038009112:web:9a3f5ddd6c0d2a0164286d",
  measurementId: "G-T1LYWSN7PS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app); // Initialize and export Auth
export const db = getFirestore(app); // Initialize and export Firestore


// Placeholder functions for Google API compatibility (will not be used with MEGA)
export const loadGoogleApi = (callback: () => void) => {
  console.log("Google API client library is not loaded as MEGA is used.");
  callback(); // Call callback immediately as no async loading is needed for Google API
};

export const handleAuthClick = () => {
  console.log("Google Drive authentication is not needed as MEGA is used.");
};

export const handleSignoutClick = () => {
  console.log("User signed out from Google Drive (client-side) - not applicable with MEGA.");
};

// Subject Management Functions
export const addSubject = async (name: string, stageId: string) => {
  try {
    const docRef = await addDoc(collection(db, "subjects"), {
      name,
      stageId,
      createdAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (e) {
    console.error("Error adding subject: ", e);
    throw e;
  }
};

export const getSubjects = async () => {
  try {
    const subjectsCollectionRef = collection(db, "subjects");
    const querySnapshot = await getDocs(subjectsCollectionRef);
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name || '',
        stageId: data.stageId || '',
        createdAt: data.createdAt || null,
      };
    });
  } catch (e) {
    console.error("Error getting subjects: ", e);
    throw e;
  }
};

export const updateSubject = async (id: string, name: string, stageId: string) => {
  try {
    const subjectRef = doc(db, "subjects", id);
    await updateDoc(subjectRef, {
      name,
      stageId,
    });
  } catch (e) {
    console.error("Error updating subject: ", e);
    throw e;
  }
};

export const deleteSubject = async (id: string) => {
  try {
    await deleteDoc(doc(db, "subjects", id));
  } catch (e) {
    console.error("Error deleting subject: ", e);
    throw e;
  }
};

// Stage Management Functions (assuming stages are static or managed elsewhere, but providing a getter)
export const getStages = async () => {
  try {
    const stagesCollectionRef = collection(db, "stages");
    const querySnapshot = await getDocs(stagesCollectionRef);
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name || '',
      };
    });
  } catch (e) {
    console.error("Error getting stages: ", e);
    throw e;
  }
};

import { uploadFileToGofile, deleteGofileFile } from './gofile';

export const addLecture = async (subjectId: string, title: string, description: string, file: File) => {
  try {
    const uploadedFileInfo = await uploadFileToGofile(file);

    if (!uploadedFileInfo || !uploadedFileInfo.fileId || !uploadedFileInfo.fileName || !uploadedFileInfo.fileUrl) {
      throw new Error('Failed to upload file to Gofile, missing file information.');
    }

    const docRef = await addDoc(collection(db, "lectures"), {
      subjectId,
      title,
      description,
      fileId: uploadedFileInfo.fileId, // Store Gofile File ID
      fileName: uploadedFileInfo.fileName,
      fileUrl: uploadedFileInfo.fileUrl, // Store Gofile File URL
      createdAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (e) {
    console.error("Error adding lecture: ", e);
    throw e;
  }
};

export const getLectures = async (subjectId?: string) => {
  try {
    const lecturesCollectionRef = collection(db, "lectures");
    const q = subjectId
      ? query(lecturesCollectionRef, where("subjectId", "==", subjectId))
      : lecturesCollectionRef;
    const querySnapshot = await getDocs(q);
    const lectures = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        subjectId: data.subjectId || '',
        title: data.title || '',
        description: data.description || '',
        fileId: data.fileId || '', // Retrieve Gofile File ID
        fileName: data.fileName || '',
        fileUrl: data.fileUrl || '', // Retrieve Gofile File URL
        createdAt: data.createdAt || null,
      };
    });
    return lectures;
  } catch (e) {
    console.error("Error getting lectures: ", e);
    throw e;
  }
};

export const updateLecture = async (id: string, title: string, description: string, newFile?: File, oldFileId?: string) => {
  try {
    const lectureRef = doc(db, "lectures", id);
    let fileId = oldFileId;
    let fileName = '';
    let fileUrl = '';

    if (newFile) {
      // Delete old file from Gofile if it exists
      if (oldFileId) {
        try {
          await deleteGofileFile(oldFileId);
        } catch (err) {
          console.warn("Could not delete old Gofile file, it might not exist or permissions are insufficient:", err);
        }
      }

      // Upload new file to Gofile
      const uploadedFileInfo = await uploadFileToGofile(newFile);
      
      if (!uploadedFileInfo || !uploadedFileInfo.fileId || !uploadedFileInfo.fileUrl) {
        throw new Error('Failed to upload new file to Gofile, missing file information.');
      }

      fileId = uploadedFileInfo.fileId;
      fileName = uploadedFileInfo.fileName;
      fileUrl = uploadedFileInfo.fileUrl;
    }

    await updateDoc(lectureRef, {
      title,
      description,
      fileId,
      fileName,
      fileUrl,
    });
  } catch (e) {
    console.error("Error updating lecture: ", e);
    throw e;
  }
};

export const deleteLecture = async (id: string, fileId: string) => {
  try {
    // Delete file from Gofile
    if (fileId) {
      try {
        await deleteGofileFile(fileId);
      } catch (err) {
        console.warn("Could not delete Gofile file, it might not exist or permissions are insufficient:", err);
      }
    }
    // Delete lecture data from Firestore
    await deleteDoc(doc(db, "lectures", id));
  } catch (e) {
    console.error("Error deleting lecture: ", e);
    throw e;
  }
};
