import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Book, Code, FileDown, Link as LinkIcon, Search, BookOpen, Shield, Brain, Download, ExternalLink, Plus, Loader2, Award } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/data/translations';
import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useAuth } from '@/context/AuthContext';
import { addDoc, collection, getDocs, query, orderBy, doc, getDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/firebase/firebase';
import { toast } from '@/components/ui/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from '@/components/ui/label';
import { Badge } from "@/components/ui/badge";

const defaultCategories = [
  { id: 'all', icon: BookOpen, label: { en: 'All', ar: 'الكل' } },
  { id: 'programming', icon: Code, label: { en: 'Programming', ar: 'البرمجة' } },
  { id: 'security', icon: Shield, label: { en: 'Cybersecurity', ar: 'الأمن السيبراني' } },
  { id: 'ai', icon: Brain, label: { en: 'AI', ar: 'الذكاء الاصطناعي' } },
  { id: 'certificates', icon: Award, label: { en: 'Certificates', ar: 'شهادات' } },
];

interface Resource {
  id: string;
  title: string;
  type: 'book' | 'tool';
  category: string;
  description: string;
  link: string;
  createdAt: any;
  createdBy: string;
}

interface UserWithRole {
  uid: string;
  role?: string;
  [key: string]: any;
}

const Resources = () => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const t = translations[language];
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [resources, setResources] = useState<Resource[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState(defaultCategories);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryNameAr, setNewCategoryNameAr] = useState('');
  const [newCategoryIcon, setNewCategoryIcon] = useState('BookOpen');
  const [editCategoryId, setEditCategoryId] = useState<string | null>(null);
  const [editCategoryName, setEditCategoryName] = useState('');
  const [editCategoryNameAr, setEditCategoryNameAr] = useState('');
  const [editCategoryIcon, setEditCategoryIcon] = useState('BookOpen');
  const [editResourceId, setEditResourceId] = useState<string | null>(null);
  const [editResource, setEditResource] = useState<Resource | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [type, setType] = useState('');
  const [link, setLink] = useState('');

  // جلب الدور من بيانات المستخدم
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (user?.uid) {
        // جلب الدور من قاعدة البيانات
        try {
          const userDocRef = doc(db, "users", user.uid);
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            setRole(userDocSnap.data().role || null);
          } else {
            setRole(null);
          }
        } catch (err) {
          setRole(null);
        }
      } else {
        setRole(null);
      }
    };
    fetchUserRole();
  }, [user]);

  const isAdmin = role === 'admin' || role === 'owner';

  // Fetch resources
  useEffect(() => {
    const fetchResources = async () => {
      try {
        setIsLoading(true);
        const resourcesQuery = query(
          collection(db, "resources"),
          orderBy("createdAt", "desc")
        );
        const querySnapshot = await getDocs(resourcesQuery);
        const fetchedResources = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Resource[];
        setResources(fetchedResources);
        setError(null);
      } catch (err) {
        console.error("Error fetching resources:", err);
        setError(t.resourceFetchError);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResources();
  }, [t]);

  const handleAddResource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !category || !type || !link) {
      toast({
        title: t.error,
        description: t.fillAllFields,
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const docRef = await addDoc(collection(db, "resources"), {
        title,
        description,
        category,
        type,
        link,
        createdAt: new Date(),
        createdBy: user?.uid,
      });

      // Add the new resource to the state
      setResources(prev => [{
              id: docRef.id,
              title,
              description,
              category,
              type: type as "book" | "tool",
              link,
              createdAt: new Date(),
              createdBy: user?.uid,
            }, ...prev]);

      toast({
        title: t.success,
        description: t.resourceAddedSuccess,
      });

      setShowAddDialog(false);
      setTitle('');
      setDescription('');
      setCategory('');
      setType('');
      setLink('');
    } catch (error) {
      console.error("Error adding resource:", error);
      toast({
        title: t.error,
        description: t.resourceAddError,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim() || !newCategoryNameAr.trim()) return;
    setCategories(prev => [
      ...prev,
      {
        id: newCategoryName.toLowerCase().replace(/\s+/g, '-'),
        icon: getIconComponent(newCategoryIcon),
        label: { en: newCategoryName, ar: newCategoryNameAr }
      }
    ]);
    setNewCategoryName('');
    setNewCategoryNameAr('');
    setNewCategoryIcon('BookOpen');
    setShowAddCategory(false);
  };

  const handleDeleteCategory = (id: string) => {
    setCategories(prev => prev.filter(cat => cat.id !== id));
    if (selectedCategory === id) setSelectedCategory('all');
  };

  const handleStartEditCategory = (cat: typeof categories[0]) => {
    setEditCategoryId(cat.id);
    setEditCategoryName(cat.label.en);
    setEditCategoryNameAr(cat.label.ar);
    setEditCategoryIcon(getIconName(cat.icon));
    setShowAddCategory(true);
  };

  const handleEditCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editCategoryId || !editCategoryName.trim() || !editCategoryNameAr.trim()) return;
    setCategories(prev =>
      prev.map(cat =>
        cat.id === editCategoryId
          ? {
              ...cat,
              label: { en: editCategoryName, ar: editCategoryNameAr },
              icon: getIconComponent(editCategoryIcon),
              id: editCategoryName.toLowerCase().replace(/\s+/g, '-'),
            }
          : cat
      )
    );
    setEditCategoryId(null);
    setEditCategoryName('');
    setEditCategoryNameAr('');
    setEditCategoryIcon('BookOpen');
    setShowAddCategory(false);
  };

  function getIconComponent(iconName: string) {
    switch (iconName) {
      case 'BookOpen': return BookOpen;
      case 'Code': return Code;
      case 'Shield': return Shield;
      case 'Brain': return Brain;
      case 'Book': return Book;
      case 'Award': return Award;
      default: return BookOpen;
    }
  }

  function getIconName(icon: any) {
    if (icon === BookOpen) return 'BookOpen';
    if (icon === Code) return 'Code';
    if (icon === Shield) return 'Shield';
    if (icon === Brain) return 'Brain';
    if (icon === Book) return 'Book';
    if (icon === Award) return 'Award';
    return 'BookOpen';
  }

  const handleDeleteResource = async (id: string) => {
    try {
      await deleteDoc(doc(db, "resources", id));
      setResources(prev => prev.filter(res => res.id !== id));
      toast({
        title: t.success,
        description: language === "ar" ? "تم حذف المصدر بنجاح" : "Resource deleted successfully",
      });
    } catch (error) {
      toast({
        title: t.error,
        description: language === "ar" ? "حدث خطأ أثناء الحذف" : "Error deleting resource",
        variant: "destructive",
      });
    }
  };

  const handleStartEditResource = (resource: Resource) => {
    setEditResourceId(resource.id);
    setEditResource(resource);
    setTitle(resource.title);
    setDescription(resource.description);
    setCategory(resource.category);
    setType(resource.type);
    setLink(resource.link);
    setShowAddDialog(true);
  };

  const handleEditResource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editResourceId || !title || !description || !category || !type || !link) return;
    setIsSubmitting(true);
    try {
      setResources(prev =>
        prev.map(res =>
          res.id === editResourceId
            ? { ...res, title, description, category, type: type as "book" | "tool", link }
            : res
        )
      );
      toast({ title: t.success, description: language === "ar" ? "تم تعديل المصدر بنجاح" : "Resource updated successfully" });
      setShowAddDialog(false);
      setEditResourceId(null);
      setEditResource(null);
      setTitle('');
      setDescription('');
      setCategory('');
      setType('');
      setLink('');
    } catch (error) {
      toast({ title: t.error, description: t.resourceAddError, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getIconForResource = (type: string) => {
    switch (type) {
      case 'book':
        return Book;
      case 'tool':
        return Code;
      default:
        return FileDown;
    }
  };

  return (
    <div className="container mx-auto px-2 md:px-6 py-8">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-center mb-12"
      >
        <div className="flex justify-center mb-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 10 }}
            className="bg-gradient-to-tr from-primary/90 to-secondary/80 rounded-full p-7 shadow-2xl border-4 border-background/40 backdrop-blur-md"
          >
            <BookOpen className="h-16 w-16 text-white drop-shadow-2xl transition-transform duration-300 group-hover:rotate-6" />
          </motion.div>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary drop-shadow-lg tracking-tight">
          {t.resourceLibrary}
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-2 font-medium">
          {t.resourceLibraryDesc}
        </p>
        <div className="flex justify-center gap-4 mt-2">
          <Badge variant="secondary" className="text-base px-5 py-1 rounded-full bg-primary/10 text-primary font-semibold shadow">
            {filteredResources.length} {language === "ar" ? "مصدر" : "Resources"}
          </Badge>
        </div>
        {/* Add Resource Button for Admins */}
        {isAdmin && (
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button className="mt-7 bg-gradient-to-r from-primary to-secondary text-white shadow-xl hover:from-primary/90 hover:to-secondary/90 px-10 py-3 text-lg rounded-full font-bold transition-all duration-200">
                <Plus className="mr-2 h-5 w-5" />
                {t.addResource}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t.addNewResource}</DialogTitle>
                <DialogDescription>{t.addResourceDesc}</DialogDescription>
              </DialogHeader>
              <form onSubmit={editResourceId ? handleEditResource : handleAddResource} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">{t.title}</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder={t.resourceTitlePlaceholder}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">{t.description}</Label>
                  <Input
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder={t.resourceDescPlaceholder}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">{t.category}</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder={t.selectCategory} />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.label[language]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">{t.type}</Label>
                  <Select value={type} onValueChange={setType}>
                    <SelectTrigger>
                      <SelectValue placeholder={t.selectType} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="book">{t.book}</SelectItem>
                      <SelectItem value="tool">{t.tool}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="link">{t.link}</Label>
                  <Input
                    id="link"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    placeholder={t.resourceLinkPlaceholder}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? t.adding : editResourceId ? (language === "ar" ? "تعديل" : "Edit") : t.add}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </motion.div>

      {/* Search & Categories Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
        {/* Search */}
        <div className="relative w-full md:w-1/2">
          <div className="absolute left-3 top-1/2 -translate-y-1/2">
            <Search className="h-5 w-5 text-muted-foreground" />
          </div>
          <Input
            placeholder={t.searchResources}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 rounded-xl shadow bg-background/80 border border-border focus:ring-2 focus:ring-primary/30 transition-all"
          />
        </div>
        {/* Categories */}
        <div className="flex flex-wrap gap-2 justify-center md:justify-end items-center">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center gap-1">
              <Button
                variant={selectedCategory === category.id ? "default" : "ghost"}
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold transition-all duration-200 border-2 ${
                  selectedCategory === category.id
                    ? "bg-gradient-to-r from-primary/90 to-secondary/80 text-white shadow-lg border-primary"
                    : "hover:bg-primary/10 border-transparent"
                }`}
                onClick={() => setSelectedCategory(category.id)}
              >
                <category.icon className="h-5 w-5 transition-transform duration-200 group-hover:scale-110" />
                {category.label[language]}
              </Button>
              {isAdmin && category.id !== 'all' && (
                <>
                  <Button size="icon" variant="ghost" className="p-1" title={language === "ar" ? "تعديل" : "Edit"} onClick={() => handleStartEditCategory(category)}>
                    <Code className="h-4 w-4 text-yellow-500 hover:scale-110 transition-transform" />
                  </Button>
                  <Button size="icon" variant="ghost" className="p-1" title={language === "ar" ? "حذف" : "Delete"} onClick={() => handleDeleteCategory(category.id)}>
                    <FileDown className="h-4 w-4 text-red-500 hover:scale-110 transition-transform" />
                  </Button>
                </>
              )}
            </div>
          ))}
          {isAdmin && (
            <>
              <Button
                variant="outline"
                className="rounded-full px-3 py-2 border-2 border-primary/30 hover:border-primary transition-all"
                onClick={() => {
                  setShowAddCategory(true);
                  setEditCategoryId(null);
                  setEditCategoryName('');
                  setEditCategoryNameAr('');
                  setEditCategoryIcon('BookOpen');
                }}
                title={language === "ar" ? "إضافة فئة" : "Add Category"}
              >
                <Plus className="h-4 w-4" />
              </Button>
              <Dialog open={showAddCategory} onOpenChange={setShowAddCategory}>
                <DialogContent className="max-w-md rounded-2xl shadow-2xl bg-background border border-border p-6">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold mb-2 text-primary text-center">
                      {editCategoryId
                        ? (language === "ar" ? "تعديل الفئة" : "Edit Category")
                        : (language === "ar" ? "إضافة فئة جديدة" : "Add New Category")}
                    </DialogTitle>
                  </DialogHeader>
                  <form onSubmit={editCategoryId ? handleEditCategory : handleAddCategory} className="space-y-5">
                    <div className="flex flex-col md:flex-row gap-3">
                      <div className="flex-1">
                        <Label className="mb-1 block">{language === "ar" ? "اسم الفئة (إنجليزي)" : "Category Name (EN)"}</Label>
                        <Input
                          value={editCategoryId ? editCategoryName : newCategoryName}
                          onChange={e => editCategoryId ? setEditCategoryName(e.target.value) : setNewCategoryName(e.target.value)}
                          placeholder={language === "ar" ? "مثال: Math" : "e.g. Math"}
                          required
                        />
                      </div>
                      <div className="flex-1">
                        <Label className="mb-1 block">{language === "ar" ? "اسم الفئة (عربي)" : "Category Name (AR)"}</Label>
                        <Input
                          value={editCategoryId ? editCategoryNameAr : newCategoryNameAr}
                          onChange={e => editCategoryId ? setEditCategoryNameAr(e.target.value) : setNewCategoryNameAr(e.target.value)}
                          placeholder={language === "ar" ? "مثال: رياضيات" : "e.g. رياضيات"}
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="mb-1 block">{language === "ar" ? "الأيقونة" : "Icon"}</Label>
                      <Select value={editCategoryId ? editCategoryIcon : newCategoryIcon} onValueChange={val => editCategoryId ? setEditCategoryIcon(val) : setNewCategoryIcon(val)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="BookOpen"><BookOpen className="inline h-4 w-4 mr-2" />BookOpen</SelectItem>
                          <SelectItem value="Code"><Code className="inline h-4 w-4 mr-2" />Code</SelectItem>
                          <SelectItem value="Shield"><Shield className="inline h-4 w-4 mr-2" />Shield</SelectItem>
                          <SelectItem value="Brain"><Brain className="inline h-4 w-4 mr-2" />Brain</SelectItem>
                          <SelectItem value="Book"><Book className="inline h-4 w-4 mr-2" />Book</SelectItem>
                          <SelectItem value="Award"><Award className="inline h-4 w-4 mr-2" />Award</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button
                      type="submit"
                      className="w-full py-3 text-lg font-semibold bg-gradient-to-r from-primary to-destructive hover:from-primary/90 hover:to-destructive/90 text-white rounded-xl shadow-lg transition-all duration-300"
                    >
                      {editCategoryId
                        ? (language === "ar" ? "تعديل" : "Edit")
                        : (language === "ar" ? "إضافة" : "Add")}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </>
          )}
        </div>
      </div>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="col-span-3">
          {isLoading ? (
            <div className="flex items-center justify-center min-h-[200px]">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="text-center text-red-500 py-8 text-lg font-semibold">
              {error}
            </div>
          ) : filteredResources.length === 0 ? (
            <div className="text-center text-muted-foreground py-12 text-xl font-medium">
              {searchQuery ? t.noResourcesFound : t.noResourcesAvailable}
            </div>
          ) : (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: {
                  transition: {
                    staggerChildren: 0.08,
                  },
                },
              }}
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
            >
              {filteredResources.map((resource, idx) => {
                const ResourceIcon = getIconForResource(resource.type);
                return (
                  <motion.div
                    key={resource.id}
                    initial={{ opacity: 0, y: 40, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.5, delay: idx * 0.08, type: "spring" }}
                    whileHover={{ scale: 1.04, boxShadow: "0 12px 40px 0 rgba(80,80,200,0.13)" }}
                  >
                    <Card className="relative h-full overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-300 border-0 bg-gradient-to-br from-background/90 via-card/80 to-background/80 rounded-3xl group backdrop-blur-xl">
                      {/* Decorative background blur */}
                      <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/20 rounded-full blur-2xl opacity-60 z-0 pointer-events-none" />
                      {/* Badge for type */}
                      <Badge
                        className={`absolute top-5 right-5 z-10 px-5 py-1 rounded-full text-xs font-bold shadow-lg tracking-wider ${
                          resource.type === "book"
                            ? "bg-primary/90 text-white"
                            : "bg-secondary/90 text-white"
                        }`}
                        style={{ letterSpacing: "1px" }}
                      >
                        {resource.type === "book" ? t.book : t.tool}
                      </Badge>
                      <CardHeader className="flex flex-col items-center justify-center pt-12 pb-4 z-10 relative">
                        <div className="mb-4 rounded-full bg-gradient-to-tr from-primary/80 to-secondary/80 p-4 shadow-lg group-hover:scale-110 transition-transform">
                          <ResourceIcon className="h-10 w-10 text-white drop-shadow-xl" />
                        </div>
                        <CardTitle className="text-2xl font-bold text-foreground text-center mb-2 line-clamp-2">{resource.title}</CardTitle>
                        <CardDescription className="text-base text-muted-foreground text-center line-clamp-3">{resource.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="flex flex-col gap-3 items-center pb-8 z-10 relative">
                        <Button
                          variant="outline"
                          className="w-full bg-gradient-to-r from-primary/10 to-secondary/10 hover:from-primary/20 hover:to-secondary/20 text-primary font-semibold rounded-full shadow transition-all duration-300 text-base py-3"
                          asChild
                        >
                          <a href={resource.link} target="_blank" rel="noopener noreferrer">
                            {resource.type === 'book'
                              ? <Download className="mr-2 h-5 w-5" />
                              : <ExternalLink className="mr-2 h-5 w-5" />}
                            {resource.type === 'book' ? t.download : t.visit}
                          </a>
                        </Button>
                        <span className="text-xs text-muted-foreground mt-1">
                          {language === "ar"
                            ? `أضيفت في ${new Date(resource.createdAt?.toDate?.() || resource.createdAt).toLocaleDateString("ar-EG")}`
                            : `Added on ${new Date(resource.createdAt?.toDate?.() || resource.createdAt).toLocaleDateString("en-US")}`}
                        </span>
                        {isAdmin && (
                          <div className="flex gap-2 mt-2">
                            <Button size="sm" variant="outline" className="rounded-lg" onClick={() => handleStartEditResource(resource)}>
                              {language === "ar" ? "تعديل" : "Edit"}
                            </Button>
                            <Button size="sm" variant="destructive" className="rounded-lg" onClick={() => handleDeleteResource(resource.id)}>
                              {language === "ar" ? "حذف" : "Delete"}
                            </Button>
                          </div>
                        )}
                      </CardContent>
                      {/* Subtle bottom gradient for depth */}
                      <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-background/80 to-transparent pointer-events-none z-0" />
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Resources;
