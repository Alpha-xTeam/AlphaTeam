import React, { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Newspaper, Plus, Image as ImageIcon, Loader2, Calendar, X, 
  Trash2, Instagram, Send, Copy, ChevronRight, ChevronLeft, Share2, 
  Bookmark, Eye, Filter, Search, Tag, Clock, TrendingUp, MessageSquare,
  ThumbsUp, ThumbsDown, Flag, MoreVertical, Download, Printer, Pencil
} from "lucide-react";
import Layout from "@/components/layout/Layout";
import { auth, db } from "@/firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, collection, addDoc, getDocs, orderBy, query, Timestamp, updateDoc, increment, arrayUnion, arrayRemove, deleteDoc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { toast } from "@/components/ui/use-toast";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
// Import react-easy-crop components and types
import Cropper from 'react-easy-crop';
import { Area, Point } from 'react-easy-crop';
// Assuming a slider component is available or will be added. Using basic input type=range for now.
// import Slider from '@react-native-community/slider';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../data/translations';
import { useAuth } from '../context/AuthContext';

interface NewsItem {
  id: string;
  title: string;
  description: string;
  imageUrls: string[];
  imageNames: string[];
  createdAt: any;
  tag?: string;
  likes: number;
  likedBy: string[];
  category?: string;
  author?: string;
  readTime?: number;
  comments?: number;
  trending?: boolean;
}

// تعديل دالة رفع الصور لقبول أكثر من صورة
const uploadImagesToCloudinary = async (files: File[]): Promise<{ urls: string[], names: string[] }> => {
  const cloudName = "dmao2zbvt";
  const uploadPreset = "news_unsigned";
  const urls: string[] = [];
  const names: string[] = [];
  for (const file of files) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);
    formData.append("cloud_name", cloudName);

    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: "POST",
      body: formData,
      mode: 'cors',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`فشل رفع الصورة: ${errorData.error?.message || response.statusText}`);
    }
    const data = await response.json();
    if (!data.secure_url) throw new Error('لم يتم استلام رابط الصورة من Cloudinary');
    urls.push(data.secure_url);
    names.push(file.name);
  }
  return { urls, names };
};

const News = () => {
  const { language } = useLanguage();
  const t = translations[language];
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  // Updated state for single image file for cropping
  const [imageFilesToCrop, setImageFilesToCrop] = useState<File[]>([]); // List of files to be cropped
  const [currentImageIndexToCrop, setCurrentImageIndexToCrop] = useState<number>(0); // Index of the image currently being cropped
  const [croppedImageFiles, setCroppedImageFiles] = useState<File[]>([]); // List of cropped files
  const [formError, setFormError] = useState<string | null>(null);

  // Cropper state
  const [showCropperModal, setShowCropperModal] = useState(false);
  const [imageSrcToCrop, setImageSrcToCrop] = useState<string | null>(null);
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  // New state for selected but not yet cropped image files
  const [selectedImageFiles, setSelectedImageFiles] = useState<File[]>([]);
  // New state for image previews in Add News form
  const [selectedImagePreviews, setSelectedImagePreviews] = useState<string[]>([]);

  // Edit form state
  const [editNews, setEditNews] = useState<NewsItem | null>(null);
  const [editFormOpen, setEditFormOpen] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  // Updated state for edit form images
  const [editImageFilesToCrop, setEditImageFilesToCrop] = useState<File[]>([]); // New files selected for cropping in edit form
  const [editCurrentImageIndexToCrop, setEditCurrentImageIndexToCrop] = useState<number>(0); // Index of the new image being cropped in edit form
  const [editedCroppedImageFiles, setEditedCroppedImageFiles] = useState<File[]>([]); // Newly cropped files in edit form
  const [editImagesToRemove, setEditImagesToRemove] = useState<number[]>([]);

  // Edit form cropper state (reusing cropper logic but with different state)
  const [editShowCropperModal, setEditShowCropperModal] = useState(false);
  const [editImageSrcToCrop, setEditImageSrcToCrop] = useState<string | null>(null);
  const [editCrop, setEditCrop] = useState<Point>({ x: 0, y: 0 });
  const [editZoom, setEditZoom] = useState(1);
  const [editCroppedAreaPixels, setEditCroppedAreaPixels] = useState<Area | null>(null);
  // Reusing imgRef as the cropper likely only needs one instance to handle one image at a time.
  // const editImgRef = useRef<HTMLImageElement>(null);

  // أضف حالة lightbox لعرض الصورة المكبرة
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);

  const [isBookmarked, setIsBookmarked] = useState<{[key: string]: boolean}>({});

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'latest' | 'trending' | 'popular'>('latest');
  const [showFilters, setShowFilters] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);

  // Categories for filtering
  const categories = [
    { id: 'all', name: 'الكل' },
    { id: 'education', name: 'تعليم' },
    { id: 'technology', name: 'تكنولوجيا' },
    { id: 'events', name: 'فعاليات' },
    { id: 'announcements', name: 'إعلانات' }
  ];

  // Add like animation state
  const [likeAnimations, setLikeAnimations] = useState<{[key: string]: boolean}>({});

  // Filter and sort news
  const filteredNews = newsList
    .filter(news => {
      const matchesSearch = news.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          news.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = !selectedCategory || selectedCategory === 'all' || news.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'trending':
          return (b.trending ? 1 : 0) - (a.trending ? 1 : 0);
        case 'popular':
          return (b.likes || 0) - (a.likes || 0);
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

  // Print news
  const printNews = (news: NewsItem) => {
    setIsPrinting(true);
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html dir="rtl">
          <head>
            <title>${news.title}</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              .header { text-align: center; margin-bottom: 20px; }
              .image { max-width: 100%; height: auto; margin: 20px 0; }
              .content { line-height: 1.6; }
              .footer { margin-top: 20px; text-align: center; font-size: 0.8em; color: #666; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>${news.title}</h1>
              <p>${new Date(news.createdAt).toLocaleDateString('ar-EG')}</p>
            </div>
            ${news.imageUrls[0] ? `<img src="${news.imageUrls[0]}" class="image" alt="${news.title}">` : ''}
            <div class="content">${news.description}</div>
            <div class="footer">
              <p>منصة Alpha التعليمية</p>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
      setIsPrinting(false);
    }
  };

  // Download news as PDF
  const downloadNews = async (news: NewsItem) => {
    // Implementation for PDF download
    toast({
      title: "قريباً",
      description: "سيتم إضافة خاصية تحميل PDF قريباً",
    });
  };

  // Remove the auth state change listener since we're using AuthContext
  useEffect(() => {
    const checkAdmin = async () => {
      if (!user) return setIsAdmin(false);
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
      setIsAdmin(userSnap.exists() && userSnap.data().role === "owner" || userSnap.data().role === "admin");
    };
    checkAdmin();
  }, [user]);

  // Fetch news
  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      const q = query(collection(db, "news"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      setNewsList(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<NewsItem, "id">),
        }))
      );
      setLoading(false);
    };
    fetchNews();
  }, []);

  // Handle image selection for cropping
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      setSelectedImageFiles(files); // Store selected files
      setImageFilesToCrop(files); // Set files to crop (starting the process)
      setCroppedImageFiles([]); // Clear previously cropped files
      setCurrentImageIndexToCrop(0); // Start with the first image
      setFormError(null); // Clear any previous form errors related to files

      // Generate previews for selected files
      const readers: FileReader[] = [];
      let isCancelled = false;
      const promise = Promise.all(
        files.map(file =>
          new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.addEventListener("load", () => resolve(reader.result as string), { once: true });
            reader.addEventListener("error", () => {
              console.error("Error reading file", file);
              if (!isCancelled) {
                reject(new Error(`Failed to read file: ${file.name}`));
              }
            }, { once: true });
            reader.readAsDataURL(file);
            readers.push(reader);
          })
        )
      );

      promise.then(previews => {
        if (!isCancelled) {
          setSelectedImagePreviews(previews);
        }
      }).catch(error => {
        console.error("Error generating previews:", error);
        if (!isCancelled) {
          // Handle error, maybe clear previews or show an error message
          setSelectedImagePreviews([]);
          setFormError("Failed to load image previews.");
        }
      });

      // Clean up readers if the component unmounts or files change again
      const cleanup = () => {
        isCancelled = true;
        readers.forEach((r) => r && r.abort && r.abort());
      };

      return cleanup; // Return cleanup function for useEffect if this were in one
    }
  };

  // Function to handle selecting an image preview for cropping
  const handleSelectImageForCropping = (index: number) => {
    if (selectedImageFiles.length > index) {
      const file = selectedImageFiles[index];
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setImageSrcToCrop(reader.result as string);
        setCurrentImageIndexToCrop(index); // Keep track of the original index
        setShowCropperModal(true); // Open cropper modal
        setZoom(1); // Reset zoom
        setCrop({ x: 0, y: 0 }); // Reset crop position
      });
      reader.readAsDataURL(file);
    }
  };

  // Handle crop complete
  const onCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  // Generate cropped image and set as file
  const showCroppedImage = useCallback(async () => {
    if (!imageSrcToCrop || !croppedAreaPixels || imageFilesToCrop.length === 0 || !imgRef.current) {
      return null;
    }
    try {
      const canvas = document.createElement('canvas');
      const image = imgRef.current;
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;

      canvas.width = croppedAreaPixels.width;
      canvas.height = croppedAreaPixels.height;
      const ctx = canvas.getContext('2d');

      if (!ctx) return null;

      ctx.drawImage(
        image,
        croppedAreaPixels.x * scaleX,
        croppedAreaPixels.y * scaleY,
        croppedAreaPixels.width * scaleX,
        croppedAreaPixels.height * scaleY,
        0,
        0,
        croppedAreaPixels.width,
        croppedAreaPixels.height
      );

      return new Promise<File | null>((resolve) => {
        canvas.toBlob((blob) => {
          if (blob) {
            // Create a File object from the blob
            const croppedFile = new File([blob], `cropped_${imageFilesToCrop[currentImageIndexToCrop].name}`, { type: blob.type });
            resolve(croppedFile);
          } else {
            resolve(null);
          }
        }, imageFilesToCrop[currentImageIndexToCrop].type, 1); // Use original file type and quality 1
      });

    } catch (e) {
      console.error("Error cropping image:", e);
      return null;
    }
  }, [imageSrcToCrop, croppedAreaPixels, imageFilesToCrop, currentImageIndexToCrop, imgRef]);

  // Function to handle "Done" button click in cropper modal
  const handleCropDone = useCallback(async () => {
    const croppedFile = await showCroppedImage();
    if (croppedFile) {
      setCroppedImageFiles(prev => [...prev, croppedFile]); // Add cropped file to the list
      // Move to the next image or close modal
      if (currentImageIndexToCrop < imageFilesToCrop.length - 1) {
        setCurrentImageIndexToCrop(prev => prev + 1);
        // Load the next image into the cropper
        const reader = new FileReader();
        reader.addEventListener("load", () => {
          setImageSrcToCrop(reader.result as string);
          setZoom(1); // Reset zoom for the new image
          setCrop({ x: 0, y: 0 }); // Reset crop position
        });
        reader.readAsDataURL(imageFilesToCrop[currentImageIndexToCrop + 1]);
      } else {
        setShowCropperModal(false); // Close modal if all images are cropped
        setImageSrcToCrop(null); // Clear image source
        setCurrentImageIndexToCrop(0); // Reset index
        setImageFilesToCrop([]); // Clear files to crop
      }
    } else {
      // Handle error if cropping failed for the current image
      toast({
        title: "خطأ في القص",
        description: "حدث خطأ أثناء قص الصورة. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
       // Decide whether to skip this image or stop the process
       if (currentImageIndexToCrop < imageFilesToCrop.length - 1) {
        setCurrentImageIndexToCrop(prev => prev + 1);
        // Load the next image into the cropper
        const reader = new FileReader();
        reader.addEventListener("load", () => {
          setImageSrcToCrop(reader.result as string);
          setZoom(1); // Reset zoom for the new image
          setCrop({ x: 0, y: 0 }); // Reset crop position
        });
        reader.readAsDataURL(imageFilesToCrop[currentImageIndexToCrop + 1]);
      } else {
        setShowCropperModal(false); // Close modal if all images are attempted
        setImageSrcToCrop(null); // Clear image source
        setCurrentImageIndexToCrop(0); // Reset index
        setImageFilesToCrop([]); // Clear files to crop
      }
    }
  }, [showCroppedImage, currentImageIndexToCrop, imageFilesToCrop, setCroppedImageFiles, setCurrentImageIndexToCrop, setShowCropperModal, setImageSrcToCrop, setZoom, setCrop]);

  // Add news handler (Cloudinary) - Updated to use cropped image
  const handleAddNews = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!title.trim() || !description.trim() || croppedImageFiles.length === 0) {
      setFormError("يرجى ملء جميع الحقول وإرفاق صورة واحدة على الأقل.");
      return;
    }
    setLoading(true);
    try {
      // رفع جميع الصور إلى Cloudinary
      const { urls: imageUrls, names: imageNames } = await uploadImagesToCloudinary(croppedImageFiles);

      // إضافة الخبر إلى Firestore
      const docRef = await addDoc(collection(db, "news"), {
        title: title.trim(),
        description: description.trim(),
        imageUrls,
        imageNames,
        createdAt: Timestamp.now(),
        tag: "خبر",
        likes: 0,
        likedBy: []
      });
      setShowAddForm(false);
      setTitle("");
      setDescription("");
      setImageFilesToCrop([]);
      setCurrentImageIndexToCrop(0);
      setCroppedImageFiles([]); // Clear cropped files after successful upload
      setSelectedImageFiles([]); // Clear selected files after successful upload
      setNewsList((prev) => [
        {
          id: docRef.id,
          title: title.trim(),
          description: description.trim(),
          imageUrls,
          imageNames,
          createdAt: new Date(),
          tag: "خبر",
          likes: 0,
          likedBy: [],
        },
        ...prev,
      ]);
    } catch (err: any) {
      setFormError("حدث خطأ أثناء إضافة الخبر.");
    }
    setLoading(false);
  };

  // فتح نموذج التعديل وتعبئة البيانات
  const openEditForm = (news: NewsItem) => {
    setEditNews(news);
    setEditTitle(news.title);
    setEditDescription(news.description);
    // Clear states for new image uploads in edit form
    setEditImageFilesToCrop([]);
    setEditCurrentImageIndexToCrop(0);
    setEditedCroppedImageFiles([]);
    setEditImagesToRemove([]);
    setEditShowCropperModal(false);
    setEditImageSrcToCrop(null);
    setEditCrop({ x: 0, y: 0 });
    setEditZoom(1);
    setEditCroppedAreaPixels(null);
    setEditFormOpen(true);
  };

  // Handle new file selection in edit form and initiate cropping
  const onEditFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      setEditImageFilesToCrop(files); // Store selected new files for cropping
      setEditedCroppedImageFiles([]); // Clear previously cropped new files
      setEditCurrentImageIndexToCrop(0); // Start with the first new image

      // Process the first image immediately if files are selected
      if (files.length > 0) {
        const reader = new FileReader();
        reader.addEventListener("load", () => {
          setEditImageSrcToCrop(reader.result as string);
          setEditShowCropperModal(true); // Open cropper modal for edit form
        });
        reader.readAsDataURL(files[0]);
      }
    }
  };

  // Generate cropped image for edit form
  const showEditedCroppedImage = useCallback(async () => {
    if (!editImageSrcToCrop || !editCroppedAreaPixels || editImageFilesToCrop.length === 0 || !imgRef.current) {
      return null;
    }
    try {
      const canvas = document.createElement('canvas');
      const image = imgRef.current;
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;

      canvas.width = editCroppedAreaPixels.width;
      canvas.height = editCroppedAreaPixels.height;
      const ctx = canvas.getContext('2d');

      if (!ctx) return null;

      ctx.drawImage(
        image,
        editCroppedAreaPixels.x * scaleX,
        editCroppedAreaPixels.y * scaleY,
        editCroppedAreaPixels.width * scaleX,
        editCroppedAreaPixels.height * scaleY,
        0,
        0,
        editCroppedAreaPixels.width,
        editCroppedAreaPixels.height
      );

      return new Promise<File | null>((resolve) => {
        canvas.toBlob((blob) => {
          if (blob) {
            // Create a File object from the blob
            const croppedFile = new File([blob], `cropped_edit_${editImageFilesToCrop[editCurrentImageIndexToCrop].name}`, { type: blob.type });
            resolve(croppedFile);
          } else {
            resolve(null);
          }
        }, editImageFilesToCrop[editCurrentImageIndexToCrop].type, 1); // Use original file type and quality 1
      });

    } catch (e) {
      console.error("Error cropping image:", e);
      return null;
    }
  }, [editImageSrcToCrop, editCroppedAreaPixels, editImageFilesToCrop, editCurrentImageIndexToCrop, imgRef]);

  // Function to handle "Done" button click in edit form cropper modal
  const handleEditCropDone = useCallback(async () => {
    const croppedFile = await showEditedCroppedImage();
    if (croppedFile) {
      setEditedCroppedImageFiles(prev => [...prev, croppedFile]); // Add cropped file to the list
      // Move to the next image or close modal
      if (editCurrentImageIndexToCrop < editImageFilesToCrop.length - 1) {
        setEditCurrentImageIndexToCrop(prev => prev + 1);
        // Load the next image into the cropper
        const reader = new FileReader();
        reader.addEventListener("load", () => {
          setEditImageSrcToCrop(reader.result as string);
          setEditZoom(1); // Reset zoom for the new image
          setEditCrop({ x: 0, y: 0 }); // Reset crop position
        });
        reader.readAsDataURL(editImageFilesToCrop[editCurrentImageIndexToCrop + 1]);
      } else {
        setEditShowCropperModal(false); // Close modal if all images are cropped
        setEditImageSrcToCrop(null); // Clear image source
        setEditCurrentImageIndexToCrop(0); // Reset index
        setEditImageFilesToCrop([]); // Clear files to crop
      }
    } else {
      // Handle error if cropping failed for the current image
      toast({
        title: "خطأ في القص",
        description: "حدث خطأ أثناء قص الصورة. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
       // Decide whether to skip this image or stop the process
       if (editCurrentImageIndexToCrop < editImageFilesToCrop.length - 1) {
        setEditCurrentImageIndexToCrop(prev => prev + 1);
        // Load the next image into the cropper
        const reader = new FileReader();
        reader.addEventListener("load", () => {
          setEditImageSrcToCrop(reader.result as string);
          setEditZoom(1); // Reset zoom for the new image
          setEditCrop({ x: 0, y: 0 }); // Reset crop position
        });
        reader.readAsDataURL(editImageFilesToCrop[editCurrentImageIndexToCrop + 1]);
      } else {
        setEditShowCropperModal(false); // Close modal if all images are attempted
        setEditImageSrcToCrop(null); // Clear image source
        setEditCurrentImageIndexToCrop(0); // Reset index
        setEditImageFilesToCrop([]); // Clear files to crop
      }
    }
  }, [showEditedCroppedImage, editCurrentImageIndexToCrop, editImageFilesToCrop, setEditedCroppedImageFiles, setEditCurrentImageIndexToCrop, setEditShowCropperModal, setEditImageSrcToCrop, setEditZoom, setEditCrop]);

  // دالة تعديل الخبر
  const handleEditNews = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editNews) return;
    setLoading(true);
    try {
      // الصور القديمة بعد الحذف (حسب المؤشرات)
      const oldImageUrls = editNews.imageUrls.filter((_, idx) => !editImagesToRemove.includes(idx));
      const oldImageNames = editNews.imageNames.filter((_, idx) => !editImagesToRemove.includes(idx));
      // رفع الصور الجديدة إذا وجدت (الصور المقصوصة الجديدة)
      let newImageUrls: string[] = [];
      let newImageNames: string[] = [];
      if (editedCroppedImageFiles.length > 0) {
        const uploaded = await uploadImagesToCloudinary(editedCroppedImageFiles);
        newImageUrls = uploaded.urls;
        newImageNames = uploaded.names;
      }
      const updatedImageUrls = [...oldImageUrls, ...newImageUrls];
      const updatedImageNames = [...oldImageNames, ...newImageNames];

      // تحديث الخبر في Firestore
      await updateDoc(doc(db, "news", editNews.id), {
        title: editTitle.trim(),
        description: editDescription.trim(),
        imageUrls: updatedImageUrls,
        imageNames: updatedImageNames,
      });

      // تحديث القائمة محليًا
      setNewsList((prev) =>
        prev.map((item) =>
          item.id === editNews.id
            ? {
                ...item,
                title: editTitle.trim(),
                description: editDescription.trim(),
                imageUrls: updatedImageUrls,
                imageNames: updatedImageNames,
              }
            : item
        )
      );
      setEditFormOpen(false);
      setEditNews(null);
      // Clear states after successful edit
      setEditImageFilesToCrop([]);
      setEditCurrentImageIndexToCrop(0);
      setEditedCroppedImageFiles([]);
      setEditImagesToRemove([]);
      setEditShowCropperModal(false);
      setEditImageSrcToCrop(null);
      setEditCrop({ x: 0, y: 0 });
      setEditZoom(1);
      setEditCroppedAreaPixels(null);

      toast({ title: "تم التعديل", description: "تم تعديل الخبر بنجاح." });
    } catch (err) {
      toast({ title: "خطأ", description: "حدث خطأ أثناء تعديل الخبر", variant: "destructive" });
    }
    setLoading(false);
  };

  // Enhanced like handler with animation
  const handleLike = async (newsId: string) => {
    if (!user) {
      toast({
        title: "تنبيه",
        description: "يجب تسجيل الدخول أولاً",
        variant: "destructive",
      });
      return;
    }

    // Trigger animation
    setLikeAnimations(prev => ({...prev, [newsId]: true}));
    setTimeout(() => {
      setLikeAnimations(prev => ({...prev, [newsId]: false}));
    }, 1000);

    const newsRef = doc(db, "news", newsId);
    const newsDoc = await getDoc(newsRef);

    if (newsDoc.exists()) {
      const newsData = newsDoc.data();
      const likedBy = newsData.likedBy || [];
      const isLiked = likedBy.includes(user.uid);

      if (isLiked) {
        // إلغاء الإعجاب
        await updateDoc(newsRef, {
          likes: increment(-1),
          likedBy: arrayRemove(user.uid)
        });
        setNewsList(prev => prev.map(news =>
          news.id === newsId
            ? {
              ...news,
              likes: (news.likes || 0) - 1,
              likedBy: news.likedBy.filter(id => id !== user.uid)
            }
            : news
        ));
      } else {
        // إضافة إعجاب
        await updateDoc(newsRef, {
          likes: increment(1),
          likedBy: arrayUnion(user.uid)
        });
        setNewsList(prev => prev.map(news =>
          news.id === newsId
            ? {
              ...news,
              likes: (news.likes || 0) + 1,
              likedBy: [...(news.likedBy || []), user.uid]
            }
            : news
        ));
      }
    }
  };

  // دالة حذف الخبر
  const handleDeleteNews = async (newsId: string) => {
    try {
      await deleteDoc(doc(db, "news", newsId));
      setNewsList((prev) => prev.filter((news) => news.id !== newsId));
      setDialogOpen(false);
      toast({
        title: "تم حذف الخبر",
        description: "تم حذف الخبر بنجاح",
      });
    } catch (error) {
      console.error("Error deleting news:", error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء حذف الخبر",
        variant: "destructive",
      });
    }
  };

  // إضافة دالة لنسخ رابط الخبر
  const handleCopyLink = async (newsId: string) => {
    const newsUrl = `${window.location.origin}/#news/${newsId}`;
    try {
      await navigator.clipboard.writeText(newsUrl);
      toast({
        title: "تم النسخ",
        description: "تم نسخ رابط الخبر إلى الحافظة.",
      });
    } catch (err) {
      console.error("Failed to copy link: ", err);
      toast({
        title: "خطأ",
        description: "فشل نسخ رابط الخبر.",
        variant: "destructive",
      });
    }
  };

  // Toggle bookmark
  const toggleBookmark = (newsId: string) => {
    setIsBookmarked(prev => ({...prev, [newsId]: !prev[newsId]}));
    toast({
      title: isBookmarked[newsId] ? "تم إزالة الإشارة المرجعية" : "تم إضافة الإشارة المرجعية",
      description: isBookmarked[newsId] ? "تمت إزالة الخبر من الإشارات المرجعية" : "تم إضافة الخبر إلى الإشارات المرجعية",
    });
  };

  // Share news
  const shareNews = async (news: NewsItem) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: news.title,
          text: news.description,
          url: `${window.location.origin}/#news/${news.id}`,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      handleCopyLink(news.id);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto py-6 px-1 md:px-0 animate-fade-in">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mb-12 text-center relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 blur-3xl -z-10" />
          <div className="flex justify-center mb-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 10 }}
            >
              <Newspaper className="h-16 w-16 text-primary drop-shadow-lg" />
            </motion.div>
          </div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-5xl font-extrabold text-primary mb-2 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80"
          >
            {t.news}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-lg md:text-xl text-muted-foreground font-medium"
          >
            {newsList.length === 0 ? t.noNews : t.followUpdates}
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex justify-center items-center gap-4 mt-4"
          >
            <a
              href="https://www.instagram.com/talpha.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-all duration-300 transform hover:scale-110"
            >
              <Instagram className="h-6 w-6" />
            </a>
            <a
              href="https://t.me/xteam_alpha"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-all duration-300 transform hover:scale-110"
            >
              <Send className="h-6 w-6" />
            </a>
          </motion.div>
        </motion.div>

        {isAdmin && (
          <div className="flex justify-center mt-8 mb-8">
            <Button
              size="lg"
              className="flex items-center gap-2 text-lg font-bold"
              onClick={() => {
                setShowAddForm((v) => !v);
                // Clear image states when opening the form
                if (!showAddForm) {
                  setSelectedImageFiles([]);
                  setSelectedImagePreviews([]);
                  setImageFilesToCrop([]);
                  setCroppedImageFiles([]);
                  setCurrentImageIndexToCrop(0);
                  setImageSrcToCrop(null);
                  setCrop({ x: 0, y: 0 });
                  setZoom(1);
                  setCroppedAreaPixels(null);
                  setFormError(null);
                }
              }}
              variant={showAddForm ? "secondary" : "default"}
            >
              <Plus className="h-5 w-5" />
              {showAddForm ? t.close : t.addNews}
            </Button>
          </div>
        )}

        {showAddForm && isAdmin && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-2xl mx-auto mb-12"
          >
            <Card>
              <CardHeader>
                <CardTitle>{t.addNews}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddNews} className="space-y-4">
                  <div>
                    <Input
                      type="text"
                      placeholder="News Title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Textarea
                      placeholder="News Content"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="imageUpload" className="block text-sm font-medium text-muted-foreground mb-1">إرفاق صور (يمكن اختيار أكثر من صورة)</label>
                    <Input
                      id="imageUpload"
                      type="file"
                      accept="image/*"
                      multiple // Allow multiple file selection
                      onChange={onFileChange}
                      className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                    />
                  </div>
                  {/* Display selected image previews */}
                  {selectedImagePreviews.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-md font-medium mb-2">الصور المختارة:</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedImagePreviews.map((previewUrl, index) => (
                          <div 
                            key={index} 
                            className="relative w-24 h-24 border rounded-md overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() => handleSelectImageForCropping(index)}
                          >
                            <img
                              src={previewUrl}
                              alt={`Selected image ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {croppedImageFiles.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-md font-medium mb-2">الصور المقصوصة:</h4>
                      <div className="flex flex-wrap gap-2">
                        {croppedImageFiles.map((file, index) => (
                          <div key={index} className="relative w-24 h-24 border rounded-md overflow-hidden">
                            <img
                              src={URL.createObjectURL(file)}
                              alt={`Cropped image ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                             <Button
                              variant="destructive"
                              size="icon"
                              className="absolute top-1 right-1 h-5 w-5 rounded-full"
                              onClick={() => setCroppedImageFiles(prev => prev.filter((_, i) => i !== index))}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {formError && (
                    <p className="text-red-500 text-sm">{formError}</p>
                  )}
                  <Button type="submit" className="w-full" disabled={loading || croppedImageFiles.length === 0}>
                    {loading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="mr-2 h-4 w-4" />
                    )}
                    {t.submit}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* نموذج تعديل الخبر */}
        {isAdmin && editFormOpen && editNews && (
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            onSubmit={handleEditNews}
            className="max-w-xl mx-auto bg-card rounded-xl shadow-lg p-6 mb-12 border border-border space-y-5"
          >
            <h2 className="text-2xl font-bold mb-4 text-primary flex items-center gap-2">
              <Pencil className="h-6 w-6" /> تعديل الخبر
            </h2>
            <Input
              placeholder="عنوان الخبر"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="mb-3"
              maxLength={120}
              required
            />
            <Textarea
              placeholder="وصف الخبر"
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              className="mb-3"
              rows={4}
              maxLength={800}
              required
            />
            <div className="mb-3">
              <label className="block mb-2 font-medium text-foreground flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                صور الخبر الحالية
              </label>
              <div className="flex flex-wrap gap-3 items-center">
                {editNews.imageUrls.map((url, idx) =>
                  editImagesToRemove.includes(idx) ? null : (
                    <div key={idx} className="relative">
                      <img src={url} alt={`صورة ${idx + 1}`} className="max-h-32 rounded-lg shadow border mb-2" />
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        className="absolute top-1 left-1 text-red-500"
                        onClick={() => setEditImagesToRemove((prev) => [...prev, idx])}
                        title="إزالة الصورة"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )
                )}
              </div>
            </div>
            <div className="mb-3">
              <label className="block mb-2 font-medium text-foreground flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                إضافة صور جديدة (اختياري)
              </label>
              <Input
                type="file"
                accept="image/*"
                multiple
                onChange={onEditFileChange}
                className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
              />
              {/* Display selected new file names */}
              {editImageFilesToCrop.length > 0 && !editShowCropperModal && (
                  <div className="mt-2 text-sm text-muted-foreground">
                    Files selected for cropping: {editImageFilesToCrop.map(file => file.name).join(', ')}
                  </div>
              )}
              {/* Display newly cropped images */}
              {editedCroppedImageFiles.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-md font-medium mb-2">الصور الجديدة المقصوصة:</h4>
                  <div className="flex flex-wrap gap-2">
                    {editedCroppedImageFiles.map((file, index) => (
                      <div key={index} className="relative w-24 h-24 border rounded-md overflow-hidden">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Cropped new image ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                         <Button
                          variant="destructive"
                          size="icon"
                          className="absolute top-1 right-1 h-5 w-5 rounded-full"
                          onClick={() => setEditedCroppedImageFiles(prev => prev.filter((_, i) => i !== index))}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={loading || (editedCroppedImageFiles.length === 0 && editImagesToRemove.length === 0 && editTitle.trim() === editNews?.title && editDescription.trim() === editNews?.description)}>
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  جاري التعديل...
                </>
              ) : (
                "حفظ التعديلات"
              )}
            </Button>
            <Button
              type="button"
              variant="secondary"
              className="w-full mt-2"
              onClick={() => setEditFormOpen(false)}
            >
              إلغاء
            </Button>
          </motion.form>
        )}

        {/* Cropper Modal for Edit Form */}
        <Dialog open={editShowCropperModal} onOpenChange={setEditShowCropperModal}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>قص الصورة الجديدة {editCurrentImageIndexToCrop + 1} من {editImageFilesToCrop.length}</DialogTitle>
            </DialogHeader>
            <div className="relative w-full h-[300px] sm:h-[400px]">
              {editImageSrcToCrop && (
                <Cropper
                  image={editImageSrcToCrop}
                  crop={editCrop}
                  zoom={editZoom}
                  aspect={16 / 9} // Or your desired aspect ratio
                  onCropChange={setEditCrop}
                  onZoomChange={setEditZoom}
                  onCropComplete={onCropComplete} // Reusing onCropComplete as it only sets croppedAreaPixels
                  // Add imgRef to Cropper if it supports it, otherwise ensure your image element uses the ref
                />
              )}
               {/* Add an image element here to use the ref */}
               {/* This is needed for the showEditedCroppedImage function to access the image dimensions */}
               <img ref={imgRef} src={editImageSrcToCrop || ''} alt="New image to crop" className="hidden" />
            </div>
            <div className="flex items-center justify-center space-x-4">
              <label className="text-sm text-muted-foreground">Zoom:</label>
              <Input
                type="range"
                min={1}
                max={3}
                step={0.1}
                value={editZoom}
                onChange={(e) => setEditZoom(parseFloat(e.target.value))}
                className="w-2/3"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setEditShowCropperModal(false)}> {/* Consider adding a "Skip" button */}
                إلغاء
              </Button>
              <Button onClick={handleEditCropDone} disabled={!editCroppedAreaPixels}>
                تطبيق القص
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* نافذة تكبير الصورة (Lightbox) */}
        {lightboxImg && (
          <div
            className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center"
            onClick={() => setLightboxImg(null)}
          >
            <img
              src={lightboxImg}
              alt="صورة الخبر"
              className="max-w-full max-h-full rounded-lg shadow-2xl border-4 border-white"
              style={{ objectFit: "contain" }}
            />
            <button
              className="absolute top-4 left-4 bg-white/80 rounded-full p-2 text-black"
              onClick={() => setLightboxImg(null)}
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        )}

        {/* عرض الأخبار */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-8">
          <AnimatePresence>
            {filteredNews.map((news, idx) => (
              <motion.div
                key={news.id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: 0.1 * idx, duration: 0.6, type: "spring" }}
                onClick={() => {
                  setSelectedNews(news);
                  setDialogOpen(true);
                }}
                className="group"
              >
                <Card className="relative overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 rounded-2xl border bg-gradient-to-br from-card via-background/50 to-background flex flex-col h-full">
                  {/* صورة الخبر */}
                  <div className="relative card-image w-full h-48 sm:h-56 object-cover rounded-t-xl overflow-hidden">
                    {news.imageUrls && news.imageUrls.length > 0 ? (
                      <motion.img
                        src={news.imageUrls[0]}
                        alt={news.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        loading="lazy"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.5 }}
                      />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground">
                        لا توجد صورة
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                    {news.imageUrls && news.imageUrls.length > 1 && (
                      <motion.span 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full backdrop-blur-sm"
                      >
                        {news.imageUrls.length} صور
                      </motion.span>
                    )}
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute top-2 right-2 flex gap-2"
                    >
                      <Button
                        variant="ghost"
                        size="icon"
                        className="bg-black/40 hover:bg-black/60 text-white rounded-full"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleBookmark(news.id);
                        }}
                      >
                        <Bookmark className={`h-4 w-4 ${isBookmarked[news.id] ? 'fill-white' : ''}`} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="bg-black/40 hover:bg-black/60 text-white rounded-full"
                        onClick={(e) => {
                          e.stopPropagation();
                          shareNews(news);
                        }}
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  </div>

                  {/* محتوى الخبر */}
                  <div className="relative p-4 sm:p-6 z-10 flex-grow">
                    <div className="bg-card/80 backdrop-blur-md rounded-xl p-4 sm:p-6 shadow-lg border border-border/50">
                      <div className="flex justify-between items-start mb-4">
                        <CardTitle className="text-lg sm:text-xl md:text-2xl font-bold line-clamp-2 text-foreground flex-1 ml-4">
                          {news.title}
                        </CardTitle>
                        {isAdmin && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              openEditForm(news);
                              setDialogOpen(false);
                            }}
                          >
                            <Pencil className="h-4 w-4 ml-2" />
                            تعديل
                          </Button>
                        )}
                      </div>
                      <CardDescription className="text-xs sm:text-sm md:text-base text-muted-foreground/90 line-clamp-3 mb-4">
                        {news.description}
                      </CardDescription>
                      <div className="flex items-center justify-between gap-4 mb-4">
                        <div className="flex items-center gap-4">
                          <a
                            href="https://www.instagram.com/talpha.dev"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-primary transition-all duration-300 transform hover:scale-110"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Instagram className="h-4 w-4" />
                          </a>
                          <a
                            href="https://t.me/xteam_alpha"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-primary transition-all duration-300 transform hover:scale-110"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Send className="h-4 w-4" />
                          </a>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-muted-foreground hover:text-primary"
                            onClick={(e) => {
                              e.stopPropagation();
                              printNews(news);
                            }}
                            title="طباعة"
                          >
                            <Printer className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-muted-foreground hover:text-primary"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleLike(news.id);
                            }}
                          >
                            <ThumbsUp className={`h-4 w-4 ${news.likedBy?.includes(user?.uid) ? 'fill-primary' : ''}`} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-muted-foreground hover:text-primary"
                            onClick={(e) => {
                              e.stopPropagation();
                              shareNews(news);
                            }}
                          >
                            <Share2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  {isAdmin && (
                    <div className="absolute bottom-4 left-4 z-20">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Trash2 className="h-4 w-4 ml-2" />
                            حذف الخبر
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>هل أنت متأكد من حذف الخبر؟</AlertDialogTitle>
                            <AlertDialogDescription>
                              لا يمكن التراجع عن هذا الإجراء. سيتم حذف الخبر بشكل دائم.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel onClick={(e) => e.stopPropagation()}>إلغاء</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteNews(news.id);
                              }}
                            >
                              حذف
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  )}
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* نافذة تفاصيل الخبر */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-4xl">
            {selectedNews && (
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-1/2">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold mb-4">
                      {selectedNews.title}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <p className="text-muted-foreground whitespace-pre-line">
                      {selectedNews.description}
                    </p>
                    <div className="flex items-center gap-4 text-muted-foreground">
                      <time className="text-sm">
                        {selectedNews.createdAt instanceof Timestamp
                          ? new Date(selectedNews.createdAt.toMillis()).toLocaleDateString('ar-EG')
                          : new Date(selectedNews.createdAt).toLocaleDateString('ar-EG')}
                      </time>
                    </div>
                  </div>
                </div>
                <div className="w-full md:w-1/2">
                  {selectedNews.imageUrls && selectedNews.imageUrls.length > 0 && (
                    <Carousel>
                      <CarouselContent>
                        {selectedNews.imageUrls.map((url, idx) => (
                          <CarouselItem key={idx}>
                            <img
                              src={url}
                              alt={`${selectedNews.title} - صورة ${idx + 1}`}
                              className="w-full h-auto rounded-lg"
                            />
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      <CarouselPrevious />
                      <CarouselNext />
                    </Carousel>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Cropper Modal */}
        <Dialog open={showCropperModal} onOpenChange={setShowCropperModal}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>قص الصورة {currentImageIndexToCrop + 1} من {imageFilesToCrop.length}</DialogTitle>
            </DialogHeader>
            <div className="relative w-full h-[300px] sm:h-[400px]">
              {imageSrcToCrop && (
                <Cropper
                  image={imageSrcToCrop}
                  crop={crop}
                  zoom={zoom}
                  aspect={16 / 9} // Or your desired aspect ratio
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                  // Add imgRef to Cropper if it supports it, otherwise ensure your image element uses the ref
                />
              )}
               {/* Add an image element here to use the ref */}
               <img ref={imgRef} src={imageSrcToCrop || ''} alt="Image to crop" className="hidden" />
            </div>
            <div className="flex items-center justify-center space-x-4">
              <label className="text-sm text-muted-foreground">Zoom:</label>
              <Input
                type="range"
                min={1}
                max={3}
                step={0.1}
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="w-2/3"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowCropperModal(false)}> {/* Consider adding a "Skip" button */}
                إلغاء
              </Button>
              <Button onClick={handleCropDone} disabled={!croppedAreaPixels}>
                تطبيق القص
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}

export default News;
