export interface TranslationKeys {
  // Navigation
  home: string;
  about: string;
  services: string;
  contact: string;
  lectures: string;
  news: string;
  // Common
  readMore: string;
  learnMore: string;
  // Buttons
  submit: string;
  cancel: string;
  save: string;
  // Language
  switchToArabic: string;
  switchToEnglish: string;
  // Index Page
  welcomeMessage: string;
  platformDescription: string;
  organizedLectures: string;
  organizedLecturesDesc: string;
  specializedTeam: string;
  specializedTeamDesc: string;
  highQuality: string;
  highQualityDesc: string;
  latestNews: string;
  latestNewsDesc: string;
  aboutUs: string;
  aboutUsDesc: string;
  joinUs: string;
  joinUsDesc: string;
  registerNow: string;
  contactUs: string;
  learnAboutOurTeam: string;
  startBrowsing: string;
  viewAllNews: string;
  // About Page
  ourMission: string;
  ourMissionDesc: string;
  contentQuality: string;
  contentQualityDesc: string;
  easeOfUse: string;
  easeOfUseDesc: string;
  continuousSupport: string;
  continuousSupportDesc: string;
  ourVision: string;
  ourVisionDesc: string;
  distinguishedContent: string;
  distinguishedContentDesc: string;
  specializedTeamAbout: string;
  specializedTeamAboutDesc: string;
  ourValues: string;
  ourValuesDesc: string;
  studentTestimonials: string;
  // News Page
  noNews: string;
  followUpdates: string;
  addNews: string;
  close: string;
  // Lecture Translation Page
  lectureTranslation: string;
  translationDescription: string;
  uploadLecture: string;
  clickToUpload: string;
  supportedFormats: string;
  targetLanguage: string;
  translate: string;
  translating: string;
  originalText: string;
  originalTextPlaceholder: string;
  translatedText: string;
  translatedTextPlaceholder: string;
  downloadTranslated: string;
  downloadTooltip: string;
  copyToClipboard: string;
  pleaseSelectFile: string;
  translationError: string;
  // Error Messages
  pleaseUploadFile: string;
  waitMinutes: string;
  aiError: string;
  tooManyRequests: string;
  // Lectures Page
  loadingStages: string;
  errorMessageTitle: string;
  lecturesTitle: string;
  lecturesDescription: string;
  searchLecturePlaceholder: string;
  allStages: string;
  academicStages: string;
  noStagesAvailable: string;
  noStagesAddedYet: string;
  viewMaterials: string;
  filteredResultsTitle: string;
  noLecturesMatchCriteria: string;
  dateNotAvailable: string;
  viewLecture: string;
  latestLecturesAdded: string;
  loadingLatestLectures: string;
  fetchStagesError: string;
  fetchLatestLecturesError: string;
  fetchAllLecturesError: string;

  // Added keys based on linter errors and Stage.tsx usage
  firstCourse: string;
  secondCourse: string;
  loadingStageData: string;
  fetchStageError: string;
  backToStages: string;
  stageNotFound: string;
  stageNotFoundDescription: string;
  stageLabel: string;
  availableSubjectsForStage: string;
  noSubjectsInFirstCourse: string;
  firstCourseSubjectsLater: string;
  noSubjectsAvailable: string;
  noSubjectsAddedYet: string;
  exploreSubjectsLectures: string;
  viewLectures: string;

  // New keys for Lectures Page enhancements
  popularLecturesTitle: string;
  loadingPopularLectures: string;
  noPopularLecturesAvailable: string;
  noPopularLecturesAddedYet: string;
  noDescriptionAvailable: string;
  allLecturesTitle: string;
  loadingAllLectures: string;
  noLecturesFound: string;
  tryDifferentSearch: string;
  page: string;
  of: string;
  trendingLectures: string;
  recentlyAddedLectures: string;

  // New keys for Resources Page
  resources: string;
  resourceLibrary: string;
  resourceLibraryDesc: string;
  searchResources: string;
  categories: string;
  download: string;
  visit: string;

  // Resource management
  addResource: string;
  addNewResource: string;
  addResourceDesc: string;
  resourceTitlePlaceholder: string;
  resourceDescPlaceholder: string;
  resourceLinkPlaceholder: string;
  selectCategory: string;
  selectType: string;
  book: string;
  tool: string;
  type: string;
  link: string;
  adding: string;
  add: string;
  title: string;
  description: string;
  category: string;
  error: string;
  success: string;
  fillAllFields: string;
  resourceAddedSuccess: string;
  resourceAddError: string;

  // Resource management additional translations
  noResourcesFound: string;
  noResourcesAvailable: string;
  resourceFetchError: string;
}

export const translations: Record<string, TranslationKeys> = {
  en: {
    // Navigation
    home: 'Home',
    about: 'About',
    services: 'Services',
    contact: 'Contact',
    lectures: 'Lectures',
    news: 'News',
    // Common
    readMore: 'Read More',
    learnMore: 'Learn More',
    // Buttons
    submit: 'Submit',
    cancel: 'Cancel',
    save: 'Save',
    // Language
    switchToArabic: 'عربي',
    switchToEnglish: 'English',
    // Index Page
    welcomeMessage: 'Welcome to our educational platform',
    platformDescription: 'A comprehensive platform to help students access lectures and study materials easily and conveniently. We aim to provide an exceptional and organized educational experience for all academic levels.',
    organizedLectures: 'Organized Lectures',
    organizedLecturesDesc: 'All lectures are arranged by stages and subjects for easy access and follow-up',
    specializedTeam: 'Specialized Team',
    specializedTeamDesc: 'The Alpha Team works hard to provide the best educational materials and support for students',
    highQuality: 'High Quality',
    highQualityDesc: 'High-quality content that is constantly updated to ensure the best educational experience',
    latestNews: 'Latest News and Updates',
    latestNewsDesc: 'Check out the latest 3 news and updates on our platform',
    aboutUs: 'Who are we?',
    aboutUsDesc: 'Alpha Team is a group of students and specialists who aim to facilitate the educational process and provide the necessary resources for students\' success in their academic journey. We believe that education should be accessible, organized, and easy to reach, which is why we created this platform to be a digital home for all lectures and study materials required in different stages.',
    joinUs: 'Join Us Today',
    joinUsDesc: 'Start your learning journey with us and discover a world of knowledge and opportunities',
    registerNow: 'Register Now',
    contactUs: 'Contact Us',
    learnAboutOurTeam: 'Learn About Our Team',
    startBrowsing: 'Start Browsing',
    viewAllNews: 'View All News',
    // About Page
    ourMission: 'Our Mission',
    ourMissionDesc: 'We strive to provide an integrated educational platform that helps students achieve their academic goals by providing high-quality educational content, an easy and enjoyable user experience, and continuous support from a specialized team.',
    contentQuality: 'Content Quality',
    contentQualityDesc: 'We provide high-quality educational content organized professionally',
    easeOfUse: 'Ease of Use',
    easeOfUseDesc: 'A simple and easy user interface that enables students to access content quickly',
    continuousSupport: 'Continuous Support',
    continuousSupportDesc: 'A specialized support team always available to help students',
    ourVision: 'Our Vision',
    ourVisionDesc: 'To be the first educational platform in the Arab world that provides organized and up-to-date content for all academic levels.',
    distinguishedContent: 'Distinguished Content',
    distinguishedContentDesc: 'Providing high-quality lectures, summaries, and educational materials, organized and easy to search and use.',
    specializedTeamAbout: 'Specialized Team',
    specializedTeamAboutDesc: 'An elite group of programmers and teachers working together to provide the best digital educational experience.',
    ourValues: 'Our Values',
    ourValuesDesc: 'Transparency, cooperation, innovation, and supporting students in their educational journey.',
    studentTestimonials: 'Student Testimonials',
    // News Page
    noNews: 'No news at the moment.',
    followUpdates: 'Follow the latest developments and updates on the Alpha educational platform',
    addNews: 'Add News',
    close: 'Close',
    // Lecture Translation Page
    lectureTranslation: 'Lecture Translation',
    translationDescription: 'Upload your lecture file and get it translated to your desired language.',
    uploadLecture: 'Upload Lecture File',
    clickToUpload: 'Click to upload or drag and drop',
    supportedFormats: 'PDF, DOC, DOCX, TXT (max. 10MB)',
    targetLanguage: 'Target Language',
    translate: 'Translate',
    translating: 'Translating...',
    originalText: 'Original Text',
    originalTextPlaceholder: 'The original text will appear here after uploading the file...',
    translatedText: 'Translated Text',
    translatedTextPlaceholder: 'The translated text will appear here.',
    downloadTranslated: 'Download Translated File',
    downloadTooltip: 'Download the translated text as a PDF file',
    copyToClipboard: 'Copy to Clipboard',
    pleaseSelectFile: 'Please select a file first.',
    translationError: 'An error occurred during translation. Please try again.',
    // Error Messages
    pleaseUploadFile: 'Please upload a file for translation.',
    waitMinutes: 'Please wait {minutes} minutes before requesting another translation.',
    aiError: 'Sorry, an error occurred while connecting to AI.',
    tooManyRequests: 'Too Many Requests: You have exceeded the AI usage rate limits. Please try again later.',
    // Lectures Page
    loadingStages: "Loading academic stages...",
    errorMessageTitle: "Error",
    lecturesTitle: "Lectures",
    lecturesDescription: "Select an academic stage to access required materials and lectures or search for a specific lecture",
    searchLecturePlaceholder: "Search for a lecture...",
    allStages: "All Stages",
    academicStages: "Academic Stages",
    noStagesAvailable: "No academic stages available currently.",
    noStagesAddedYet: "It seems no academic stages have been added yet.",
    viewMaterials: "View Materials",
    filteredResultsTitle: "Filtered Results and Lectures",
    noLecturesMatchCriteria: "No lectures match the search or filter criteria.",
    dateNotAvailable: "Date not available",
    viewLecture: "View Lecture",
    latestLecturesAdded: "Latest Added Lectures",
    loadingLatestLectures: "Loading latest lectures...",
    fetchStagesError: "Failed to fetch academic stages.",
    fetchLatestLecturesError: "Failed to fetch latest lectures.",
    fetchAllLecturesError: "Failed to fetch all lectures.",
    // Stage Page
    firstCourse: "First Course",
    secondCourse: "Second Course",
    loadingStageData: "Loading stage data...",
    fetchStageError: "Failed to fetch stage data.",
    backToStages: "Back to Stages",
    stageNotFound: "Stage not found.",
    stageNotFoundDescription: "The requested stage could not be found.",
    stageLabel: "Stage",
    availableSubjectsForStage: "Available subjects for this stage:",
    noSubjectsInFirstCourse: "No subjects available in the first course yet.",
    firstCourseSubjectsLater: "Subjects for the first course will be added later.",
    noSubjectsAvailable: "No subjects available yet.",
    noSubjectsAddedYet: "It seems no subjects have been added yet.",
    exploreSubjectsLectures: "Explore subjects and lectures",
    viewLectures: "View Lectures",

    // New translations for Lectures Page enhancements
    popularLecturesTitle: "Popular Lectures",
    loadingPopularLectures: "Loading popular lectures...",
    noPopularLecturesAvailable: "No Popular Lectures Available",
    noPopularLecturesAddedYet: "Popular lectures will appear here soon.",
    noDescriptionAvailable: "No description available.",
    allLecturesTitle: "All Lectures",
    loadingAllLectures: "Loading all lectures...",
    noLecturesFound: "No Lectures Found",
    tryDifferentSearch: "Try a different search term or filter.",
    page: "Page",
    of: "of",
    trendingLectures: "Trending Lectures",
    recentlyAddedLectures: "Recently Added Lectures",

    // New translations for Resources Page
    resources: "Resources",
    resourceLibrary: "Resource Library",
    resourceLibraryDesc: "Discover our collection of technical resources, tools, and learning materials",
    searchResources: "Search resources...",
    categories: "Categories",
    download: "Download",
    visit: "Visit",

    // Resource management
    addResource: "Add Resource",
    addNewResource: "Add New Resource",
    addResourceDesc: "Add a new resource to the library",
    resourceTitlePlaceholder: "Enter resource title",
    resourceDescPlaceholder: "Enter resource description",
    resourceLinkPlaceholder: "Enter resource link",
    selectCategory: "Select a category",
    selectType: "Select resource type",
    book: "Book",
    tool: "Tool",
    type: "Type",
    link: "Link",
    adding: "Adding...",
    add: "Add",
    title: "Title",
    description: "Description",
    category: "Category",
    error: "Error",
    success: "Success",
    fillAllFields: "Please fill all fields",
    resourceAddedSuccess: "Resource added successfully",
    resourceAddError: "Error adding resource",

    // Resource management additional translations
    noResourcesFound: "No resources match your search",
    noResourcesAvailable: "No resources available yet",
    resourceFetchError: "Failed to load resources",
  },
  ar: {
    // Navigation
    home: 'الرئيسية',
    about: 'من نحن',
    services: 'خدماتنا',
    contact: 'اتصل بنا',
    lectures: 'المحاضرات',
    news: 'الأخبار',
    // Common
    readMore: 'اقرأ المزيد',
    learnMore: 'اعرف المزيد',
    // Buttons
    submit: 'إرسال',
    cancel: 'إلغاء',
    save: 'حفظ',
    // Language
    switchToArabic: 'عربي',
    switchToEnglish: 'English',
    // Index Page
    welcomeMessage: 'مرحباً بك في منصتنا التعليمية',
    platformDescription: 'منصة شاملة لمساعدة الطلاب في الوصول إلى المحاضرات والمواد الدراسية بسهولة ويسر. نهدف إلى توفير تجربة تعليمية متميزة ومنظمة لجميع المراحل الدراسية.',
    organizedLectures: 'محاضرات منظمة',
    organizedLecturesDesc: 'جميع المحاضرات مرتبة حسب المراحل والمواد لسهولة الوصول والمتابعة',
    specializedTeam: 'فريق متخصص',
    specializedTeamDesc: 'فريق Alpha Team يعمل بجد لتوفير أفضل المواد التعليمية والدعم للطلاب',
    highQuality: 'جودة عالية',
    highQualityDesc: 'محتوى عالي الجودة ومحدث باستمرار لضمان أفضل تجربة تعليمية',
    latestNews: 'آخر الأخبار والتحديثات',
    latestNewsDesc: 'اطلع على آخر 3 أخبار وتحديثات في منصتنا',
    aboutUs: 'من نحن؟',
    aboutUsDesc: 'فريق Alpha Team هو مجموعة من الطلاب والمختصين الذين يهدفون إلى تسهيل العملية التعليمية وتوفير الموارد اللازمة لنجاح الطلاب في مسيرتهم الأكاديمية. نحن نؤمن بأن التعليم يجب أن يكون متاحاً ومنظماً وسهل الوصول إليه، لذلك أنشأنا هذه المنصة لتكون بيتاً رقمياً لجميع المحاضرات والمواد الدراسية المطلوبة في المراحل المختلفة.',
    joinUs: 'انضم إلينا اليوم',
    joinUsDesc: 'ابدأ رحلة التعلم معنا واكتشف عالم من المعرفة والفرص',
    registerNow: 'سجل الآن',
    contactUs: 'تواصل معنا',
    learnAboutOurTeam: 'تعرف على فريقنا',
    startBrowsing: 'ابدأ التصفح',
    viewAllNews: 'عرض جميع الأخبار',
    // About Page
    ourMission: 'رسالتنا',
    ourMissionDesc: 'نسعى جاهدين لتوفير منصة تعليمية متكاملة تساعد الطلاب على تحقيق أهدافهم الأكاديمية من خلال تقديم محتوى تعليمي عالي الجودة، وتجربة مستخدم سهلة وممتعة، ودعم مستمر من فريق متخصص.',
    contentQuality: 'جودة المحتوى',
    contentQualityDesc: 'نقدم محتوى تعليمي عالي الجودة ومنظم بشكل احترافي',
    easeOfUse: 'سهولة الاستخدام',
    easeOfUseDesc: 'واجهة مستخدم سهلة وبسيطة تمكن الطلاب من الوصول للمحتوى بسرعة',
    continuousSupport: 'دعم مستمر',
    continuousSupportDesc: 'فريق دعم متخصص متاح دائماً لمساعدة الطلاب',
    ourVision: 'رؤيتنا',
    ourVisionDesc: 'أن نكون المنصة التعليمية الأولى في العالم العربي التي توفر محتوى منظم وحديث لجميع المراحل الدراسية.',
    distinguishedContent: 'محتوى متميز',
    distinguishedContentDesc: 'توفير محاضرات وملخصات ومواد تعليمية عالية الجودة، منظمة وسهلة البحث والاستخدام.',
    specializedTeamAbout: 'فريق متخصص',
    specializedTeamAboutDesc: 'نخبة من المبرمجين والمعلمين يعملون معًا لتقديم أفضل تجربة تعليمية رقمية.',
    ourValues: 'قيمنا',
    ourValuesDesc: 'الشفافية، التعاون، الابتكار، ودعم الطلاب في رحلتهم التعليمية.',
    studentTestimonials: 'آراء طلابنا',
    // News Page
    noNews: 'لا توجد أخبار حالياً.',
    followUpdates: 'تابع أحدث المستجدات والتحديثات على منصة Alpha التعليمية',
    addNews: 'إضافة خبر',
    close: 'إغلاق',
    // Lecture Translation Page
    lectureTranslation: 'ترجمة المحاضرة',
    translationDescription: 'قم بتحميل ملف المحاضرة واحصل على ترجمته إلى اللغة المطلوبة.',
    uploadLecture: 'تحميل ملف المحاضرة',
    clickToUpload: 'انقر للتحميل أو اسحب وأفلت',
    supportedFormats: 'PDF, DOC, DOCX, TXT (الحد الأقصى 10 ميجابايت)',
    targetLanguage: 'اللغة المستهدفة',
    translate: 'ترجمة',
    translating: 'جاري الترجمة...',
    originalText: 'النص الأصلي',
    originalTextPlaceholder: 'سيظهر النص الأصلي هنا بعد تحميل الملف...',
    translatedText: 'النص المترجم',
    translatedTextPlaceholder: 'سيظهر النص المترجم هنا.',
    downloadTranslated: 'تنزيل الملف المترجم',
    downloadTooltip: 'تنزيل النص المترجم كملف PDF',
    copyToClipboard: 'نسخ إلى الحافظة',
    pleaseSelectFile: 'الرجاء اختيار ملف أولاً.',
    translationError: 'حدث خطأ أثناء الترجمة. يرجى المحاولة مرة أخرى.',
    // Error Messages
    pleaseUploadFile: 'الرجاء تحميل ملف للترجمة.',
    waitMinutes: 'الرجاء الانتظار {minutes} دقائق قبل طلب ترجمة أخرى.',
    aiError: 'عذراً، حدث خطأ أثناء الاتصال بالذكاء الاصطناعي.',
    tooManyRequests: 'Too Many Requests: لقد تجاوزت حدود معدل الاستخدام لـ AI. يرجى المحاولة لاحقاً.',
    // Lectures Page
    loadingStages: "جاري تحميل المراحل الدراسية...",
    errorMessageTitle: "حدث خطأ",
    lecturesTitle: "المحاضرات",
    lecturesDescription: "اختر المرحلة الدراسية للوصول إلى المواد والمحاضرات المطلوبة أو ابحث عن محاضرة معينة",
    searchLecturePlaceholder: "البحث عن محاضرة...",
    allStages: "جميع المراحل",
    academicStages: "المراحل الدراسية",
    noStagesAvailable: "لا توجد مراحل دراسية حاليًا.",
    noStagesAddedYet: "يبدو أنه لم يتم إضافة أي مراحل دراسية حتى الآن.",
    viewMaterials: "عرض المواد",
    filteredResultsTitle: "نتائج البحث والمحاضرات المفلترة",
    noLecturesMatchCriteria: "لا توجد محاضرات تطابق معايير البحث أو التصفية.",
    dateNotAvailable: "التاريخ غير متاح",
    viewLecture: "عرض المحاضرة",
    latestLecturesAdded: "آخر المحاضرات المضافة",
    loadingLatestLectures: "جاري تحميل آخر المحاضرات...",
    fetchStagesError: "فشل في جلب المراحل الدراسية.",
    fetchLatestLecturesError: "فشل في جلب آخر المحاضرات.",
    fetchAllLecturesError: "فشل في جلب جميع المحاضرات.",
    // Stage Page
    firstCourse: "الفصل الدراسي الأول",
    secondCourse: "الفصل الدراسي الثاني",
    loadingStageData: "جاري تحميل بيانات المرحلة...",
    fetchStageError: "فشل في جلب بيانات المرحلة.",
    backToStages: "العودة إلى المراحل",
    stageNotFound: "لم يتم العثور على المرحلة.",
    stageNotFoundDescription: "لا يمكن العثور على المرحلة المطلوبة.",
    stageLabel: "المرحلة",
    availableSubjectsForStage: "المواد المتاحة لهذه المرحلة:",
    noSubjectsInFirstCourse: "لا توجد مواد متاحة في الفصل الدراسي الأول حتى الآن.",
    firstCourseSubjectsLater: "ستتم إضافة مواد الفصل الدراسي الأول لاحقًا.",
    noSubjectsAvailable: "لا توجد مواد متاحة حتى الآن.",
    noSubjectsAddedYet: "يبدو أنه لم يتم إضافة أي مواد حتى الآن.",
    exploreSubjectsLectures: "استكشاف المواد والمحاضرات",
    viewLectures: "عرض المحاضرات",

    // New translations for Lectures Page enhancements
    popularLecturesTitle: 'المحاضرات الأكثر شيوعًا',
    loadingPopularLectures: 'تحميل المحاضرات الأكثر شيوعًا...',
    noPopularLecturesAvailable: 'لا توجد محاضرات شائعة حاليًا.',
    noPopularLecturesAddedYet: 'ستظهر المحاضرات الشائعة هنا قريباً.',
    noDescriptionAvailable: 'لا يوجد وصف متاح.',
    allLecturesTitle: 'جميع المحاضرات',
    loadingAllLectures: 'تحميل جميع المحاضرات...',
    noLecturesFound: 'لم يتم العثور على محاضرات',
    tryDifferentSearch: 'جرب مصطلح بحث أو تصفية مختلف.',
    page: 'صفحة',
    of: 'من',
    trendingLectures: "المحاضرات الرائجة",
    recentlyAddedLectures: "المحاضرات المضافة حديثاً",

    // New translations for Resources Page
    resources: "المصادر",
    resourceLibrary: "مكتبة المصادر",
    resourceLibraryDesc: "اكتشف مجموعتنا من المصادر التقنية والأدوات والمواد التعليمية",
    searchResources: "البحث في المصادر...",
    categories: "التصنيفات",
    download: "تحميل",
    visit: "زيارة",

    // Resource management
    addResource: "إضافة مصدر",
    addNewResource: "إضافة مصدر جديد",
    addResourceDesc: "إضافة مصدر جديد إلى المكتبة",
    resourceTitlePlaceholder: "أدخل عنوان المصدر",
    resourceDescPlaceholder: "أدخل وصف المصدر",
    resourceLinkPlaceholder: "أدخل رابط المصدر",
    selectCategory: "اختر الفئة",
    selectType: "اختر نوع المصدر",
    book: "كتاب",
    tool: "أداة",
    type: "النوع",
    link: "الرابط",
    adding: "جاري الإضافة...",
    add: "إضافة",
    title: "العنوان",
    description: "الوصف",
    category: "الفئة",
    error: "خطأ",
    success: "نجاح",
    fillAllFields: "يرجى ملء جميع الحقول",
    resourceAddedSuccess: "تمت إضافة المصدر بنجاح",
    resourceAddError: "حدث خطأ أثناء إضافة المصدر",

    // Resource management additional translations
    noResourcesFound: "لا توجد مصادر تطابق بحثك",
    noResourcesAvailable: "لا توجد مصادر متاحة حالياً",
    resourceFetchError: "فشل في تحميل المصادر",
  },
};