export interface HomePageText {
  // HeroSection
  appTitle: string;
  tagline: string;
  ctaButton: string;

  // FeaturesSection
  coreFeaturesBadge: string;
  sectionTitlePart1: string;
  sectionTitlePart2: string;
  sectionSubtitle: string;
  featureTitles: string[];
  featureDescriptions: string[];

  // SupportedFormats
  formatsSectionTitle: string;
  formatsSectionSubtitle: string;
  formatNames: string[];
  formatDescriptions: string[];

  // HowItWorksSection
  simpleProcessBadge: string;
  howItWorksTitlePart1: string;
  howItWorksTitlePart2: string;
  howItWorksSubtitle: string;
  stepTitles: string[];
  stepDescriptions: string[];

  // StatsSection
  statLabels: string[];

  // CTASection
  ctaIcon: string;
  ctaTitle: string;
  ctaDescription: string;
  primaryButton: string;
  secondaryButton: string;

  // FAQSection
  faqBadge: string;
  faqSectionTitlePart1: string;
  faqSectionTitlePart2: string;
  faqSubtitle: string;
  faqQuestions: string[];
  faqAnswers: string[];

  // AboutAuthor
  aboutAuthorBadge: string;
  authorName: string;
  authorRole: string;
  bioTexts: string[];
  skillLabels: string[];

  // HomeFooter
  brandName: string;
  brandDescription: string;
  productColumnTitle: string;
  resourcesColumnTitle: string;
  companyColumnTitle: string;
  productLinks: string[];
  resourceLinks: string[];
  companyLinks: string[];
  copyrightText: string;
  privacyPolicy: string;
  termsOfService: string;
  cookieSettings: string;
}

const supportedLanguages = [
  "English",
  "Mandarin Chinese",
  "Romanian",
  "Spanish",
  "Modern Standard Arabic",
  "French",
  "Russian",
  "German",
  "Japanese",
  "Vietnamese",
  "Turkish",
] as const;

export type HomeLanguage = (typeof supportedLanguages)[number];

export const homeTexts: Record<HomeLanguage, HomePageText> = {
  English: {
    appTitle: "AI Study Assistant",
    tagline: "Upload your lecture notes, textbooks, and study materials to generate AI-powered summaries, quizzes, and interactive Q&A.",
    ctaButton: "Start Studying",

    coreFeaturesBadge: "✨ Core Features",
    sectionTitlePart1: "Everything You Need to",
    sectionTitlePart2: "Ace Your Exams",
    sectionSubtitle: "Powerful AI tools designed specifically for students who want to study smarter, not harder.",
    featureTitles: [
      "AI-Powered Summaries (Sinteză)",
      "Smart Document Q&A",
      "Auto Quiz Generation",
      "Subject Organization",
      "Multi-Format Support",
      "Progress Tracking",
    ],
    featureDescriptions: [
      "Generate comprehensive, structured summaries from any PDF, DOCX, or presentation file using advanced AI models that understand academic content.",
      "Ask specific questions about your uploaded documents and get instant, context-aware answers powered by AI — like having a tutor available 24/7.",
      "Create customized multiple-choice quizzes from your study materials. Configure question count and difficulty for effective self-assessment.",
      "Organize all your study materials by subject (materie). Keep everything structured and easily accessible throughout the semester.",
      "Upload PDFs, Word documents, PowerPoint presentations, and images. The AI processes and extracts key information from any format.",
      "Track your learning progress with built-in analytics. See which topics you've mastered and where you need more practice.",
    ],

    formatsSectionTitle: "Supported File Formats",
    formatsSectionSubtitle: "Upload any of these file types and let AI extract the key information for you.",
    formatNames: ["PDF", "DOCX", "PPTX", "JPG/PNG", "TXT"],
    formatDescriptions: [
      "Portable Document",
      "Word Documents",
      "PowerPoint",
      "Images",
      "Plain Text",
    ],

    simpleProcessBadge: "📋 Simple Process",
    howItWorksTitlePart1: "How It",
    howItWorksTitlePart2: "Works",
    howItWorksSubtitle: "Get started in four simple steps and transform the way you study.",
    stepTitles: [
      "Upload Materials",
      "AI Processing",
      "Generate Content",
      "Study & Succeed",
    ],
    stepDescriptions: [
      "Drag and drop your PDFs, Word docs, PowerPoint presentations, or images into the platform.",
      "Our AI analyzes and understands your documents, extracting key concepts and important information.",
      "Get AI-generated summaries, interactive quizzes, and study materials tailored to your content.",
      "Use the generated materials to study effectively and ace your exams with confidence.",
    ],

    statLabels: [
      "Documents Processed",
      "Quiz Questions Generated",
      "Active Subjects",
      "Students Helping",
    ],

    ctaIcon: "🚀",
    ctaTitle: "Ready to Transform Your Study Game?",
    ctaDescription: "Join thousands of students who are already using AI to study smarter, not harder. Start creating powerful summaries and quizzes in seconds.",
    primaryButton: "Get Started Free",
    secondaryButton: "Learn More",

    faqBadge: "❓ FAQ",
    faqSectionTitlePart1: "Frequently Asked",
    faqSectionTitlePart2: "Questions",
    faqSubtitle: "Everything you need to know about the AI Study Assistant.",
    faqQuestions: [
      "What file formats are supported?",
      "How does the AI summary generation work?",
      "Can I create custom quizzes from my materials?",
      "Is my data safe and private?",
      "How much does it cost?",
      "Can I use this on my mobile device?",
    ],
    faqAnswers: [
      "We support PDF, DOCX (Word documents), PPTX (PowerPoint presentations), JPG/PNG images, and plain text files. You can upload multiple files at once for comprehensive study materials.",
      "Our AI analyzes your uploaded documents using advanced natural language processing models. It identifies key concepts, structures information hierarchically, and generates comprehensive summaries that capture the essential points of your material.",
      "Yes! You can generate multiple-choice quizzes from any uploaded document. Customize the number of questions, difficulty level, and topics you want to be tested on. The AI creates relevant questions based on your actual study content.",
      "Absolutely. All uploaded documents are processed securely and stored encrypted. We never share your data with third parties. You can delete your account and all associated data at any time.",
      "The basic features are completely free for students, including document upload, AI summaries, and quiz generation. Premium features with advanced analytics and unlimited uploads are available through an affordable student subscription plan.",
      "Yes! Our web application is fully responsive and works great on smartphones, tablets, laptops, and desktop computers. Study anywhere, anytime without needing to install any additional apps.",
    ],

    aboutAuthorBadge: "👤 About the Author",
    authorName: "Mihai Nicolae",
    authorRole: "Student at Universitatea Romano-Americana • Aspiring Software Developer",
    bioTexts: [
      "Numele meu este Mihai Nicolae, am {age} de ani și sunt student în anul I la Facultatea de Informatică Managerială din cadrul Universității Romano-Americane. Sunt pasionat de tehnologie și programare, domeniu pe care îl studiaz autodidact de peste 3 ani.",
      "Acest proiect este un portfolio personal — am creat AI Study Assistant pentru a arăta angajatorilor că îmi place să construiesc lucruri utile și să învăț constant tehnologii noi. Obiectivul meu este să obțin o calificare profesională în IT și să dobândesc experiență practică printr-un job în domeniu.",
    ],
    skillLabels: [
      "React / TypeScript",
      "Node.js / Express",
      "AI / LLM Integration",
      "Git / GitHub",
    ],

    brandName: "🎓 AI Study Assistant",
    brandDescription: "Transform your study materials with AI-powered learning tools. Summaries, quizzes, and Q&A — all from your own documents.",
    productColumnTitle: "Product",
    resourcesColumnTitle: "Resources",
    companyColumnTitle: "Company",
    productLinks: ["Features", "Pricing", "Upload Docs", "Quiz Generator"],
    resourceLinks: ["Documentation", "Tutorials", "Blog", "API"],
    companyLinks: ["About Us", "Contact", "Careers", "Press Kit"],
    copyrightText: "© 2025 AI Study Assistant. All rights reserved.",
    privacyPolicy: "Privacy Policy",
    termsOfService: "Terms of Service",
    cookieSettings: "Cookie Settings",
  },

  "Mandarin Chinese": {
    appTitle: "AI 学习助手",
    tagline: "上传您的讲义、教科书和学习资料，生成 AI 驱动的学习摘要、测验和互动问答。",
    ctaButton: "开始学习",

    coreFeaturesBadge: "✨ 核心功能",
    sectionTitlePart1: "您需要的一切来",
    sectionTitlePart2: "轻松应对考试",
    sectionSubtitle: "专为希望更高效学习的学生设计的强大 AI 工具。",
    featureTitles: [
      "AI 驱动摘要（Sinteză）",
      "智能文档问答",
      "自动测验生成",
      "科目组织",
      "多格式支持",
      "进度跟踪",
    ],
    featureDescriptions: [
      "使用理解学术内容的高级 AI 模型，从任何 PDF、DOCX 或演示文件中生成全面、结构化的摘要。",
      "就上传的文档提出具体问题，获取即时且上下文感知的 AI 驱动答案——就像有一位 24/7 可用的导师。",
      "从您的学习资料中创建自定义多项选择题测验。配置问题数量和难度以进行有效的自我评估。",
      "按科目（materie）组织所有学习资料。在整个学期中保持所有内容结构化且易于访问。",
      "上传 PDF、Word 文档、PowerPoint 演示和图像。AI 处理并提取任何格式的关键信息。",
      "通过内置分析跟踪您的学习进度。查看您已掌握的主题以及需要更多练习的地方。",
    ],

    formatsSectionTitle: "支持的文件格式",
    formatsSectionSubtitle: "上传这些文件类型之一，让 AI 为您提取关键信息。",
    formatNames: ["PDF", "DOCX", "PPTX", "JPG/PNG", "TXT"],
    formatDescriptions: [
      "便携式文档",
      "Word 文档",
      "PowerPoint",
      "图片",
      "纯文本",
    ],

    simpleProcessBadge: "📋 简单流程",
    howItWorksTitlePart1: "如何",
    howItWorksTitlePart2: "运作",
    howItWorksSubtitle: "通过四个简单的步骤开始使用，改变您的学习方式。",
    stepTitles: [
      "上传资料",
      "AI 处理",
      "生成内容",
      "学习成功",
    ],
    stepDescriptions: [
      "将 PDF、Word 文档、PowerPoint 演示或图像拖放到平台上。",
      "我们的 AI 分析并理解您的文档，提取关键概念和重要信息。",
      "获取 AI 生成的摘要、互动测验和针对您内容定制的学习资料。",
      "使用生成的材料有效学习，自信地应对考试。",
    ],

    statLabels: [
      "已处理文档",
      "生成的测验问题",
      "活跃科目",
      "受益学生",
    ],

    ctaIcon: "🚀",
    ctaTitle: "准备好改变您的学习方式了吗？",
    ctaDescription: "加入数千名已经使用 AI 更高效学习的学生。在几秒钟内开始创建强大的摘要和测验。",
    primaryButton: "免费开始",
    secondaryButton: "了解更多",

    faqBadge: "❓ 常见问题",
    faqSectionTitlePart1: "经常问的",
    faqSectionTitlePart2: "问题",
    faqSubtitle: "了解 AI 学习助手所需的一切。",
    faqQuestions: [
      "支持哪些文件格式？",
      "AI 摘要生成如何工作？",
      "我可以从我的材料中创建自定义测验吗？",
      "我的数据安全私密吗？",
      "费用是多少？",
      "我可以在移动设备上使用吗？",
    ],
    faqAnswers: [
      "我们支持 PDF、DOCX（Word 文档）、PPTX（PowerPoint 演示）、JPG/PNG 图片和纯文本文件。您可以一次上传多个文件以获取全面的学习资料。",
      "我们的 AI 使用高级自然语言处理模型分析您上传的文档。它识别关键概念，分层结构化信息，并生成捕捉您材料要点的综合摘要。",
      "可以！您可以从任何上传的文档中生成多项选择题测验。自定义问题数量、难度级别和您要测试的主题。AI 根据您的实际学习内容创建相关问题。",
      "绝对安全。所有上传的文档都经过安全处理并以加密方式存储。我们永远不会与第三方共享您的数据。您可以随时删除您的账户和所有关联数据。",
      "基本功能对学生完全免费，包括文档上传、AI 摘要和测验生成。具有高级分析和无限上传的高级功能可通过实惠的学生订阅计划获得。",
      "可以！我们的 Web 应用完全响应式，在智能手机、平板电脑、笔记本电脑和台式机上都能很好地工作。随时随地学习，无需安装额外的应用程序。",
    ],

    aboutAuthorBadge: "👤 关于作者",
    authorName: "Mihai Nicolae",
    authorRole: "罗马尼亚美利坚大学学生 •  aspiring 软件开发者",
    bioTexts: [
      "我叫 Mihai Nicolae，今年 {age} 岁，是罗马尼亚美利坚大学管理信息学院一年级学生。我对技术和编程充满热情，自学已超过 3 年。",
      "这个项目是一个个人作品集——我创建了 AI Study Assistant 向雇主展示我喜欢构建有用的东西并不断学习新技术。我的目标是在 IT 领域获得专业资格并通过相关工作获得实践经验。",
    ],
    skillLabels: [
      "React / TypeScript",
      "Node.js / Express",
      "AI / LLM 集成",
      "Git / GitHub",
    ],

    brandName: "🎓 AI 学习助手",
    brandDescription: "用 AI 驱动的学习工具转变您的学习资料。摘要、测验和问答——全部来自您自己的文档。",
    productColumnTitle: "产品",
    resourcesColumnTitle: "资源",
    companyColumnTitle: "公司",
    productLinks: ["功能", "定价", "上传文档", "测验生成器"],
    resourceLinks: ["文档", "教程", "博客", "API"],
    companyLinks: ["关于我们", "联系我们", "招聘", "媒体资料"],
    copyrightText: "© 2025 AI 学习助手。保留所有权利。",
    privacyPolicy: "隐私政策",
    termsOfService: "服务条款",
    cookieSettings: "Cookie 设置",
  },

  Romanian: {
    appTitle: "Asistent AI de Studiu",
    tagline: "Încărcați notițele de curs, manualele și materialele de studiu pentru a genera rezumate generate de IA, teste și Q&A interactiv.",
    ctaButton: "Începe să Înveți",

    coreFeaturesBadge: "✨ Funcții Principale",
    sectionTitlePart1: "Tot Ce Ai Nevoie Pentru A",
    sectionTitlePart2: "Să Dai Examenul",
    sectionSubtitle: "Unelte AI puternice concepute special pentru studenții care vor să învețe mai inteligent, nu mai greu.",
    featureTitles: [
      "Rezumate AI-Powered (Sinteză)",
      "Q&A Inteligent de Documente",
      "Generare Automată de Teste",
      "Organizarea Materiei",
      "Suport Multi-Format",
      "Urmărirea Progresului",
    ],
    featureDescriptions: [
      "Generează rezumate cuprinzătoare și structurate din orice fișier PDF, DOCX sau prezentare folosind modele avansate de IA care înțeleg conținutul academic.",
      "Pune întrebări specifice despre documentele tale încărcate și primește răspunsuri instantaneu, context-awares, populate de AI — ca și cum ai avea un tutor disponibil 24/7.",
      "Creează teste personalizate cu alegere multiplă din materialele tale de studiu. Configurează numărul de întrebări și dificultatea pentru autoevaluare eficientă.",
      "Organizează toate materialele tale de studiu pe materii. Păstrează totul structurat și ușor accesibil pe parcursul semestrului.",
      "Încarcă PDF-uri, documente Word, prezentări PowerPoint și imagini. AI procesează și extrage informații cheie din orice format.",
      "Urmărește-ți progresul de învățare cu analitică integrată. Vezi ce subiecte ai stăpânit și unde ai nevoie de mai multă practică.",
    ],

    formatsSectionTitle: "Formate de Fișiere Suportate",
    formatsSectionSubtitle: "Încarcă oricare dintre aceste tipuri de fișiere și las AI să extragă informațiile cheie pentru tine.",
    formatNames: ["PDF", "DOCX", "PPTX", "JPG/PNG", "TXT"],
    formatDescriptions: [
      "Document Portabil",
      "Documente Word",
      "PowerPoint",
      "Imagini",
      "Text Simplu",
    ],

    simpleProcessBadge: "📋 Proces Simplu",
    howItWorksTitlePart1: "Cum Funcționează",
    howItWorksTitlePart2: "",
    howItWorksSubtitle: "Începe în patru pași simpli și transformă modul în care înveți.",
    stepTitles: [
      "Încarcă Materialele",
      "Procesare AI",
      "Generează Conținut",
      "Învață & Reușește",
    ],
    stepDescriptions: [
      "Trage și plasează PDF-urile, documentele Word, prezentările PowerPoint sau imaginile în platformă.",
      "AI-ul nostru analizează și înțelege documentele tale, extrăgând conceptele cheie și informațiile importante.",
      "Primește rezumate generate de AI, teste interactive și materiale de studiu adaptate conținutului tău.",
      "Folosește materialele generate pentru a învăța eficient și să dai examenul cu încredere.",
    ],

    statLabels: [
      "Documente Procesate",
      "Întrebări Teste Generate",
      "Materii Active",
      "Studenți Ajutați",
    ],

    ctaIcon: "🚀",
    ctaTitle: "Gata să-ți Transformi Modul de Studiu?",
    ctaDescription: "Alătură-te miilor de studenți care folosesc deja AI pentru a învăța mai inteligent. Începe să creezi rezumate și teste puternice în secunde.",
    primaryButton: "Începe Gratuit",
    secondaryButton: "Află Mai Multe",

    faqBadge: "❓ Întrebări Frecvente",
    faqSectionTitlePart1: "Întrebări Frecvent",
    faqSectionTitlePart2: "Puse",
    faqSubtitle: "Tot ce trebuie să știi despre Asistentul AI de Studiu.",
    faqQuestions: [
      "Ce formate de fișiere sunt suportate?",
      "Cum funcționează generarea de rezumate AI?",
      "Pot crea teste personalizate din materialele mele?",
      "Datele mele sunt sigure și private?",
      "Cât costă?",
      "Pot folosi asta pe dispozitivul meu mobil?",
    ],
    faqAnswers: [
      "Suportăm PDF, DOCX (documente Word), PPTX (prezentări PowerPoint), imagini JPG/PNG și fișiere text simplu. Poți încărca mai multe fișiere simultan pentru materiale complete de studiu.",
      "AI-ul nostru analizează documentele tale încărcate folosind modele avansate de procesare a limbajului natural. Identifică conceptele cheie, structurează informațiile ierarhic și generează rezumate cuprinzătoare care surprind punctele esențiale ale materialului tău.",
      "Da! Poți genera teste cu alegere multiplă din orice document încărcat. Personalizează numărul de întrebări, nivelul de dificultate și subiectele pe vrei să fii testat. AI creează întrebări relevante bazate pe conținutul tău real de studiu.",
      "Absolut. Toate documentele încărcate sunt procesate securizat și stocate criptat. Nu partajăm niciodată datele tale cu terți. Poți șterge contul și toate datele asociate în orice moment.",
      "Funcțiile de bază sunt complet gratuite pentru studenți, inclusiv încărcarea documentelor, rezumatele AI și generarea de teste. Funcțiile premium cu analitică avansată și încărcări nelimitate sunt disponibile printr-un plan de abonament studentesc accesibil.",
      "Da! Aplicația noastră web este complet responsive și funcționează excelent pe smartphone-uri, tablete, laptopuri și calculatoare desktop. Învață oriunde, oricând fără a fi nevoie să instalezi aplicații suplimentare.",
    ],

    aboutAuthorBadge: "👤 Despre Autor",
    authorName: "Mihai Nicolae",
    authorRole: "Student la Universitatea Romano-Americana • Dezvoltator Software Aspirant",
    bioTexts: [
      "Numele meu este Mihai Nicolae, am {age} de ani și sunt student în anul I la Facultatea de Informatică Managerială din cadrul Universității Romano-Americane. Sunt pasionat de tehnologie și programare, domeniu pe care îl studiaz autodidact de peste 3 ani.",
      "Acest proiect este un portfolio personal — am creat AI Study Assistant pentru a arăta angajatorilor că îmi place să construiesc lucruri utile și să învăț constant tehnologii noi. Obiectivul meu este să obțin o calificare profesională în IT și să dobândesc experiență practică printr-un job în domeniu.",
    ],
    skillLabels: [
      "React / TypeScript",
      "Node.js / Express",
      "AI / Integrare LLM",
      "Git / GitHub",
    ],

    brandName: "🎓 Asistent AI de Studiu",
    brandDescription: "Transformă-ți materialele de studiu cu unelte de învățare populate de AI. Rezumate, teste și Q&A — totul din propriile tale documente.",
    productColumnTitle: "Produs",
    resourcesColumnTitle: "Resurse",
    companyColumnTitle: "Companie",
    productLinks: ["Funcții", "Prețuri", "Încarcă Documente", "Generator Teste"],
    resourceLinks: ["Documentație", "Tutoriale", "Blog", "API"],
    companyLinks: ["Despre Noi", "Contact", "Cariere", "Kit Presă"],
    copyrightText: "© 2025 Asistent AI de Studiu. Toate drepturile rezervate.",
    privacyPolicy: "Politica de Confidențialitate",
    termsOfService: "Termeni și Condiții",
    cookieSettings: "Setări Cookie",
  },

  Spanish: {
    appTitle: "Asistente de Estudio con IA",
    tagline: "Sube tus apuntes, libros de texto y materiales de estudio para generar resúmenes, cuestionarios y preguntas y respuestas interactivas impulsados por IA.",
    ctaButton: "Empieza a Estudiar",

    coreFeaturesBadge: "✨ Funciones Principales",
    sectionTitlePart1: "Todo lo que Necesitas Para",
    sectionTitlePart2: "Sacar Excelente en los Exámenes",
    sectionSubtitle: "Herramientas de IA potentes diseñadas específicamente para estudiantes que quieren estudiar de forma más inteligente, no más dura.",
    featureTitles: [
      "Resúmenes Impulsados por IA (Sinteză)",
      "Preguntas Inteligentes de Documentos",
      "Generación Automática de Cuestionarios",
      "Organización de Materias",
      "Soporte Multi-Formato",
      "Seguimiento del Progreso",
    ],
    featureDescriptions: [
      "Genera resúmenes completos y estructurados desde cualquier archivo PDF, DOCX o presentación usando modelos avanzados de IA que entienden contenido académico.",
      "Haz preguntas específicas sobre tus documentos subidos y obtén respuestas instantáneas y contextuales impulsadas por IA — como tener un tutor disponible 24/7.",
      "Crea cuestionarios personalizados de opción múltiple a partir de tus materiales de estudio. Configura el número de preguntas y dificultad para una autoevaluación efectiva.",
      "Organiza todos tus materiales de estudio por materia. Mantén todo estructurado y fácilmente accesible durante el semestre.",
      "Sube PDFs, documentos Word, presentaciones PowerPoint e imágenes. La IA procesa y extrae información clave de cualquier formato.",
      "Rastrea tu progreso de aprendizaje con analíticas integradas. Ve qué temas has dominado y dónde necesitas más práctica.",
    ],

    formatsSectionTitle: "Formatos de Archivo Soportados",
    formatsSectionSubtitle: "Sube cualquiera de estos tipos de archivos y deja que la IA extraiga la información clave para ti.",
    formatNames: ["PDF", "DOCX", "PPTX", "JPG/PNG", "TXT"],
    formatDescriptions: [
      "Documento Portátil",
      "Documentos Word",
      "PowerPoint",
      "Imágenes",
      "Texto Plano",
    ],

    simpleProcessBadge: "📋 Proceso Simple",
    howItWorksTitlePart1: "Cómo Funciona",
    howItWorksTitlePart2: "",
    howItWorksSubtitle: "Empieza en cuatro simples pasos y transforma la forma en que estudias.",
    stepTitles: [
      "Sube Materiales",
      "Procesamiento IA",
      "Generar Contenido",
      "Estudia y Triunfa",
    ],
    stepDescriptions: [
      "Arrastra y suelta tus PDFs, documentos Word, presentaciones PowerPoint o imágenes en la plataforma.",
      "Nuestra IA analiza y entiende tus documentos, extrayendo conceptos clave e información importante.",
      "Obtén resúmenes generados por IA, cuestionarios interactivos y materiales de estudio adaptados a tu contenido.",
      "Usa los materiales generados para estudiar eficazmente y sacar excelente en tus exámenes con confianza.",
    ],

    statLabels: [
      "Documentos Procesados",
      "Preguntas de Cuestionario Generadas",
      "Materias Activas",
      "Estudiantes Ayudados",
    ],

    ctaIcon: "🚀",
    ctaTitle: "¿Listo para Transformar tu Forma de Estudiar?",
    ctaDescription: "Únete a miles de estudiantes que ya están usando IA para estudiar de forma más inteligente. Empieza a crear resúmenes y cuestionarios potentes en segundos.",
    primaryButton: "Empieza Gratis",
    secondaryButton: "Saber Más",

    faqBadge: "❓ Preguntas Frecuentes",
    faqSectionTitlePart1: "Preguntas Frecuentes",
    faqSectionTitlePart2: "",
    faqSubtitle: "Todo lo que necesitas saber sobre el Asistente de Estudio con IA.",
    faqQuestions: [
      "¿Qué formatos de archivo son soportados?",
      "¿Cómo funciona la generación de resúmenes con IA?",
      "¿Puedo crear cuestionarios personalizados desde mis materiales?",
      "¿Mis datos están seguros y privados?",
      "¿Cuánto cuesta?",
      "¿Puedo usar esto en mi dispositivo móvil?",
    ],
    faqAnswers: [
      "Soportamos PDF, DOCX (documentos Word), PPTX (presentaciones PowerPoint), imágenes JPG/PNG y archivos de texto plano. Puedes subir múltiples archivos a la vez para materiales completos de estudio.",
      "Nuestra IA analiza tus documentos subidos usando modelos avanzados de procesamiento de lenguaje natural. Identifica conceptos clave, estructura información jerárquicamente y genera resúmenes completos que capturan los puntos esenciales de tu material.",
      "¡Sí! Puedes generar cuestionarios de opción múltiple desde cualquier documento subido. Personaliza el número de preguntas, nivel de dificultad y temas en los que quieres ser evaluado. La IA crea preguntas relevantes basadas en tu contenido real de estudio.",
      "Absolutamente. Todos los documentos subidos se procesan de forma segura y se almacenan cifrados. Nunca compartimos tus datos con terceros. Puedes eliminar tu cuenta y todos los datos asociados en cualquier momento.",
      "Las funciones básicas son completamente gratuitas para estudiantes, incluyendo subida de documentos, resúmenes IA y generación de cuestionarios. Las funciones premium con analíticas avanzadas y subidas ilimitadas están disponibles a través de un plan de suscripción estudiantil asequible.",
      "¡Sí! Nuestra aplicación web es totalmente responsiva y funciona genial en smartphones, tabletas, portátiles y ordenadores de escritorio. Estudia donde sea, cuando sea sin necesidad de instalar aplicaciones adicionales.",
    ],

    aboutAuthorBadge: "👤 Sobre el Autor",
    authorName: "Mihai Nicolae",
    authorRole: "Estudiante en Universitatea Romano-Americana • Desarrollador de Software Aspirante",
    bioTexts: [
      "Me llamo Mihai Nicolae, tengo {age} años y soy estudiante del primer año en la Facultad de Informática Gerencial de la Universidad Romano-Americana. Soy apasionado por la tecnología y la programación, disciplinas que estudio de forma autodidacta desde hace más de 3 años.",
      "Este proyecto es un portafolio personal — creé AI Study Assistant para mostrar a los empleadores que me gusta construir cosas útiles y aprender constantemente tecnologías nuevas. Mi objetivo es obtener una cualificación profesional en TI y adquirir experiencia práctica mediante un trabajo en el sector.",
    ],
    skillLabels: [
      "React / TypeScript",
      "Node.js / Express",
      "Integración IA / LLM",
      "Git / GitHub",
    ],

    brandName: "🎓 Asistente de Estudio con IA",
    brandDescription: "Transforma tus materiales de estudio con herramientas de aprendizaje impulsadas por IA. Resúmenes, cuestionarios y preguntas y respuestas — todo desde tus propios documentos.",
    productColumnTitle: "Producto",
    resourcesColumnTitle: "Recursos",
    companyColumnTitle: "Empresa",
    productLinks: ["Funciones", "Precios", "Subir Documentos", "Generador de Cuestionarios"],
    resourceLinks: ["Documentación", "Tutoriales", "Blog", "API"],
    companyLinks: ["Sobre Nosotros", "Contacto", "Carreras", "Kit de Prensa"],
    copyrightText: "© 2025 Asistente de Estudio con IA. Todos los derechos reservados.",
    privacyPolicy: "Política de Privacidad",
    termsOfService: "Términos de Servicio",
    cookieSettings: "Configuración de Cookies",
  },

  "Modern Standard Arabic": {
    appTitle: "مساعد الدراسة بالذكاء الاصطناعي",
    tagline: "قم برفع ملاحظات المحاضرات والكتب الدراسية ومواد الدراسة لتوليد ملخصات واختبارات وأسئلة وأجوبة تفاعلية مدعومة بالذكاء الاصطناعي.",
    ctaButton: "ابدأ الدراسة",

    coreFeaturesBadge: "✨ الوظائف الأساسية",
    sectionTitlePart1: "كل ما تحتاجه لـ",
    sectionTitlePart2: "التفوق في امتحاناتك",
    sectionSubtitle: "أدوات ذكاء اصطناعي قوية مصممة خصيصاً للطلاب الذين يريدون الدراسة بذكاء، ليس بصعوبة.",
    featureTitles: [
      "الملخصات المدعومة بالذكاء الاصطناعي (Sinteză)",
      "أسئلة وأجوبة ذكية للمستندات",
      "توليد الاختبارات تلقائياً",
      "تنظيم المواد الدراسية",
      "دعم متعدد الصيغ",
      "تتبع التقدم",
    ],
    featureDescriptions: [
      "أنشئ ملخصات شاملة ومنظمة من أي ملف PDF أو DOCX أو عرض تقديمي باستخدام نماذج ذكاء اصطناعي متقدمة تفهم المحتوى الأكاديمي.",
      "اطرح أسئلة محددة حول مستنداتك المرفوعة واحصل على فورية، إجابات سياقية مدعومة بالذكاء الاصطناعي — كأن يكون لديك معلم متاح 24/7.",
      "أنشئ اختبارات اختيار من متعدد مخصصة من مواد دراستك. اضبط عدد الأسئلة والصعوبة للتقييم الذاتي الفعال.",
      "نظم جميع مواد دراستك حسب المادة (materie). احتفظ بكل شيء منظمًا وسهل الوصول طوال الفصل الدراسي.",
      "ارفع ملفات PDF وWord وعروض PowerPoint وصور. يعالج الذكاء الاصطناعي ويستخرج المعلومات الرئيسية من أي صيغة.",
      "تبع تقدم تعلمك مع التحليلات المدمجة. انظر المواضيع التي أتقنتها وتلك التي تحتاج لممارسة أكثر.",
    ],

    formatsSectionTitle: "صيغ الملفات المدعومة",
    formatsSectionSubtitle: "ارفع أي من هذه الأنواع من الملفات ودع الذكاء الاصطناعي يستخرج المعلومات الرئيسية لك.",
    formatNames: ["PDF", "DOCX", "PPTX", "JPG/PNG", "TXT"],
    formatDescriptions: [
      "مستند محمول",
      "مستندات Word",
      "PowerPoint",
      "صور",
      "نص عادي",
    ],

    simpleProcessBadge: "📋 عملية بسيطة",
    howItWorksTitlePart1: "كيف تعمل",
    howItWorksTitlePart2: "",
    howItWorksSubtitle: "ابدأ في أربع خطوات بسيطة وغير طريقة دراستك.",
    stepTitles: [
      "ارفع المواد",
      "معالجة الذكاء الاصطناعي",
      "توليد المحتوى",
      "ادرس ونجح",
    ],
    stepDescriptions: [
      "اسحب وأفلت ملفات PDF وWord وعروض PowerPoint أو صور في المنصة.",
      "يحلل ذكاء اصطناعي الخاص بك ويفهم مستنداتك، مستخرجاً المفاهيم الرئيسية والمعلومات المهمة.",
      "احصل على ملخصات مدعومة بالذكاء الاصطناعي واختبارات تفاعلية ومواد دراسة مخصصة لمحتواك.",
      "استخدم المواد المولدة للدراسة بفعالية وتفوق في امتحاناتك بثقة.",
    ],

    statLabels: [
      "مستند تمت معالجتها",
      "أسئلة اختبارات تم توليدها",
      "مواد نشطة",
      "طلاب تم مساعدتهم",
    ],

    ctaIcon: "🚀",
    ctaTitle: "هل أنت مستعد لتغيير طريقة دراستك؟",
    ctaDescription: "انضم إلى آلاف الطلاب الذين يستخدمون بالفعل الذكاء الاصطناعي للدراسة بذكاء. ابدأ بإنشاء ملخصات واختبارات قوية في ثوانٍ.",
    primaryButton: "ابدأ مجاناً",
    secondaryButton: "اعرف المزيد",

    faqBadge: "❓ أسئلة شائعة",
    faqSectionTitlePart1: "الأسئلة الشائعة",
    faqSectionTitlePart2: "",
    faqSubtitle: "كل ما تحتاج معرفته عن مساعد الدراسة بالذكاء الاصطناعي.",
    faqQuestions: [
      "ما هي صيغ الملفات المدعومة؟",
      "كيف يعمل توليد الملخصات بالذكاء الاصطناعي؟",
      "هل يمكنني إنشاء اختبارات مخصصة من موادى؟",
      "هل بياناتي آمنة وخاصة؟",
      "كم يكلف؟",
      "هل يمكنني استخدام هذا على جهازِي المحمول؟",
    ],
    faqAnswers: [
      "ندعم PDF وDOCX (مستندات Word) وPPTX (عروض PowerPoint) وصور JPG/PNG وملفات نص عادي. يمكنك رفع ملفات متعددة في وقت واحد لمواد دراسة شاملة.",
      "يحلل ذكاء اصطناعي الخاص بك مستنداتك المرفوعة باستخدام نماذج متقدمة لمعالجة اللغة الطبيعية. يحدد المفاهيم الرئيسية، وينظم المعلومات بشكل تسلسلي، ويولد ملخصات شاملة تلتقط النقاط الأساسية من مادتك.",
      "نعم! يمكنك توليد اختبارات اختيار من متعدد من أي مستند مرفوع. اضبط عدد الأسئلة ومستوى الصعوبة والمواضيع التي تريد أن تختبر فيها. ينشئ الذكاء الاصطناعي أسئلة ذات صلة بناءً على محتوى دراستك الفعلي.",
      "بالتأكيد. جميع المستندات المرفوعة تتم معالجتها بشكل آمن وتخزينها مشفرة. نحن لا نشارك بياناتك أبداً مع أطراف ثالثة. يمكنك حذف حسابك وجميع البيانات المرتبطة به في أي وقت.",
      "الميزات الأساسية مجانية تماماً للطلاب، بما في ذلك رفع المستندات والملخصات الذكاء الاصطناعي وتوليد الاختبارات. الميزات المميزة مع التحليلات المتقدمة والرفع غير المحدود متاحة من خلال خطة اشتراك طالب بأسعار معقولة.",
      "نعم! تطبيق الويب الخاص بنا متجاوب بالكامل ويعمل بشكل رائع على الهواتف الذكية والأجهزة اللوحية وأجهزة الكمبيوتر المحمولة وأجهزة سطح المكتب. ادرس في أي مكان، في أي وقت دون الحاجة لتثبيت تطبيقات إضافية.",
    ],

    aboutAuthorBadge: "👤 عن المؤلف",
    authorName: "Mihai Nicolae",
    authorRole: "طالب في الجامعة الرومانية الأمريكية • مطور برمجيات طموح",
    bioTexts: [
      "اسمي Mihai Nicolae، عمري {age} سنوات وأنا طالب في السنة الأولى في كلية الإدارة المعلوماتية من الجامعة الرومانية-الأمريكية. أنا شغوف بالتكنولوجيا والبرمجة، مجال أدرس بشكل ذاتي لأكثر من 3 سنوات.",
      "هذا المشروع هو محفظة شخصية — أنشأت AI Study Assistant لإظهار لأصحاب العمل أنني أحب بناء أشياء مفيدة وتعلم تقنيات جديدة باستمرار. هدفي هو الحصول على مؤهل مهني في تكنولوجيا المعلومات واكتساب خبرة عملية من خلال وظيفة في المجال.",
    ],
    skillLabels: [
      "React / TypeScript",
      "Node.js / Express",
      "تكامل الذكاء الاصطناعي / LLM",
      "Git / GitHub",
    ],

    brandName: "🎓 مساعد الدراسة بالذكاء الاصطناعي",
    brandDescription: "حول مواد دراستك بأدوات تعلم مدعومة بالذكاء الاصطناعي. ملخصات واختبارات وأسئلة وأجوبة — كل ذلك من مستنداتك الخاصة.",
    productColumnTitle: "المنتج",
    resourcesColumnTitle: "الموارد",
    companyColumnTitle: "الشركة",
    productLinks: ["الوظائف", "التسعير", "رفع المستندات", "مولد الاختبارات"],
    resourceLinks: ["التوثيق", "الدروس التعليمية", "المدونة", "API"],
    companyLinks: ["من نحن", "اتصل بنا", "الوظائف", "مجموعة الصحافة"],
    copyrightText: "© 2025 مساعد الدراسة بالذكاء الاصطناعي. جميع الحقوق محفوظة.",
    privacyPolicy: "سياسة الخصوصية",
    termsOfService: "شروط الخدمة",
    cookieSettings: "إعدادات ملفات تعريف الارتباط",
  },

  French: {
    appTitle: "Assistant d'Étude IA",
    tagline: "Téléchargez vos notes de cours, manuels et supports de study pour générer des résumés, quiz et Q&A interactifs propulsés par l'IA.",
    ctaButton: "Commencez à Étudier",

    coreFeaturesBadge: "✨ Fonctionnalités Principales",
    sectionTitlePart1: "Tout ce dont vous avez besoin pour",
    sectionTitlePart2: "Réussir vos Examens",
    sectionSubtitle: "Des outils d'IA puissants conçus spécifiquement pour les étudiants qui veulent étudier plus intelligemment, pas plus dur.",
    featureTitles: [
      "Résumés Propulsés par IA (Sinteză)",
      "Q&A Intelligent de Documents",
      "Génération Automatique de Quiz",
      "Organisation des Matières",
      "Support Multi-Format",
      "Suivi des Progrès",
    ],
    featureDescriptions: [
      "Générez des résumés complets et structurés à partir de tout fichier PDF, DOCX ou présentation en utilisant des modèles d'IA avancés qui comprennent le contenu académique.",
      "Posez des questions spécifiques sur vos documents téléchargés et obtenez des réponses instantanées et contextuelles propulsées par l'IA — comme ayant un tuteur disponible 24/7.",
      "Créez des quiz personnalisés à choix multiples à partir de vos supports d'étude. Configurez le nombre de questions et la difficulté pour une auto-évaluation efficace.",
      "Organisez tous vos supports d'étude par matière (materie). Gardez tout structuré et facilement accessible tout au long du semestre.",
      "Téléchargez des PDF, documents Word, présentations PowerPoint et images. L'IA traite et extrait les informations clés de n'importe quel format.",
      "Suivez votre progression d'apprentissage avec l'analytics intégrée. Voyez quels sujets vous avez maîtrisés et où vous avez besoin de plus de pratique.",
    ],

    formatsSectionTitle: "Formats de Fichiers Supportés",
    formatsSectionSubtitle: "Téléchargez n'importe lequel de ces types de fichiers et laissez l'IA extraire les informations clés pour vous.",
    formatNames: ["PDF", "DOCX", "PPTX", "JPG/PNG", "TXT"],
    formatDescriptions: [
      "Document Portable",
      "Documents Word",
      "PowerPoint",
      "Images",
      "Texte Simple",
    ],

    simpleProcessBadge: "📋 Processus Simple",
    howItWorksTitlePart1: "Comment ça",
    howItWorksTitlePart2: "Fonctionne",
    howItWorksSubtitle: "Commencez en quatre étapes simples et transformez votre façon d'étudier.",
    stepTitles: [
      "Téléchargez les Matériaux",
      "Traitement IA",
      "Générer du Contenu",
      "Étudiez & Réussissez",
    ],
    stepDescriptions: [
      "Glissez-déposez vos PDF, documents Word, présentations PowerPoint ou images sur la plateforme.",
      "Notre IA analyse et comprend vos documents, en extrayant les concepts clés et les informations importantes.",
      "Obtenez des résumés générés par l'IA, des quiz interactifs et des supports d'étude adaptés à votre contenu.",
      "Utilisez les matériaux générés pour étudier efficacement et réussir vos examens en toute confiance.",
    ],

    statLabels: [
      "Documents Traités",
      "Questions de Quiz Générées",
      "Matières Actives",
      "Étudiants Aidés",
    ],

    ctaIcon: "🚀",
    ctaTitle: "Prêt à Transformer Votre Manière d'Étudier ?",
    ctaDescription: "Rejoignez des milliers d'étudiants qui utilisent déjà l'IA pour étudier plus intelligemment. Commencez à créer de puissants résumés et quiz en quelques secondes.",
    primaryButton: "Commencer Gratuitement",
    secondaryButton: "En Savoir Plus",

    faqBadge: "❓ Questions Fréquentes",
    faqSectionTitlePart1: "Questions Fréquemment",
    faqSectionTitlePart2: "Posées",
    faqSubtitle: "Tout ce que vous devez savoir sur l'Assistant d'Étude IA.",
    faqQuestions: [
      "Quels formats de fichiers sont supportés ?",
      "Comment fonctionne la génération de résumés par IA ?",
      "Puis-je créer des quiz personnalisés à partir de mes supports ?",
      "Mes données sont-elles sûres et privées ?",
      "Combien ça coûte ?",
      "Puis-je utiliser cela sur mon appareil mobile ?",
    ],
    faqAnswers: [
      "Nous supportons les PDF, DOCX (documents Word), PPTX (présentations PowerPoint), images JPG/PNG et fichiers texte simple. Vous pouvez télécharger plusieurs fichiers à la fois pour des supports d'étude complets.",
      "Notre IA analyse vos documents téléchargés en utilisant des modèles avancés de traitement du langage naturel. Elle identifie les concepts clés, structure l'information hiérarchiquement et génère des résumés complets qui capturent les points essentiels de votre matériel.",
      "Oui ! Vous pouvez générer des quiz à choix multiples à partir de n'importe quel document téléchargé. Personnalisez le nombre de questions, le niveau de difficulté et les sujets sur lesquels vous voulez être testé. L'IA crée des questions pertinentes basées sur votre contenu d'étude réel.",
      "Absolument. Tous les documents téléchargés sont traités en toute sécurité et stockés de manière chiffrée. Nous ne partageons jamais vos données avec des tiers. Vous pouvez supprimer votre compte et toutes les données associées à tout moment.",
      "Les fonctionnalités de base sont complètement gratuites pour les étudiants, y compris le téléchargement de documents, les résumés IA et la génération de quiz. Les fonctionnalités premium avec l'analytics avancée et les téléchargements illimités sont disponibles via un plan d'abonnement étudiant abordable.",
      "Oui ! Notre application web est entièrement responsive et fonctionne parfaitement sur les smartphones, tablettes, ordinateurs portables et ordinateurs de bureau. Étudiez n'importe où, n'importe quand sans avoir besoin d'installer des applications supplémentaires.",
    ],

    aboutAuthorBadge: "👤 À Propos de l'Auteur",
    authorName: "Mihai Nicolae",
    authorRole: "Étudiant à Universitatea Romano-Americana • Développeur Logiciel Aspirant",
    bioTexts: [
      "Je m'appelle Mihai Nicolae, j'ai {age} ans et je suis étudiant en première année à la Faculté d'Informatique Managériale de l'Université Romano-Américaine. Je suis passionné par la technologie et la programmation, domaine que j'étudie en autodidacte depuis plus de 3 ans.",
      "Ce projet est un portfolio personnel — j'ai créé AI Study Assistant pour montrer aux employeurs que j'aime construire des choses utiles et apprendre constamment de nouvelles technologies. Mon objectif est d'obtenir une qualification professionnelle en informatique et d'acquérir une expérience pratique par un travail dans le domaine.",
    ],
    skillLabels: [
      "React / TypeScript",
      "Node.js / Express",
      "Intégration IA / LLM",
      "Git / GitHub",
    ],

    brandName: "🎓 Assistant d'Étude IA",
    brandDescription: "Transformez vos supports d'étude avec des outils d'apprentissage propulsés par l'IA. Résumés, quiz et Q&A — tout à partir de vos propres documents.",
    productColumnTitle: "Produit",
    resourcesColumnTitle: "Ressources",
    companyColumnTitle: "Entreprise",
    productLinks: ["Fonctionnalités", "Tarifs", "Télécharger Docs", "Générateur de Quiz"],
    resourceLinks: ["Documentation", "Tutoriels", "Blog", "API"],
    companyLinks: ["À Propos", "Contact", "Carrières", "Kit Presse"],
    copyrightText: "© 2025 Assistant d'Étude IA. Tous droits réservés.",
    privacyPolicy: "Politique de Confidentialité",
    termsOfService: "Conditions d'utilisation",
    cookieSettings: "Paramètres des Cookies",
  },

  Russian: {
    appTitle: "Учебный Помощник с ИИ",
    tagline: "Загрузите свои конспекты, учебники и учебные материалы для генации резюме, тестов и интерактивных вопросов и ответов с помощью ИИ.",
    ctaButton: "Начать Учиться",

    coreFeaturesBadge: "✨ Основные Функции",
    sectionTitlePart1: "Всё что вам нужно для",
    sectionTitlePart2: "Сдачи Экзаменов",
    sectionSubtitle: "Мощные инструменты ИИ, разработанные специально для студентов, которые хотят учиться умнее, а не сложнее.",
    featureTitles: [
      "Резюме на базе ИИ (Sinteză)",
      "Умные Вопросы и Ответы по Документам",
      "Автоматическая Генерация Тестов",
      "Организация Предметов",
      "Многоформатная Поддержка",
      "Отслеживание Прогресса",
    ],
    featureDescriptions: [
      "Создавайте подробные структурированные резюме из любого PDF, DOCX или презентационного файла с помощью продвинутых моделей ИИ, понимающих академический контент.",
      "Задавайте конкретные вопросы о загруженных документах и получайте мгновенные контекстные ответы на базе ИИ — как будто у вас есть репетитор доступный 24/7.",
      "Создавайте пользовательские тесты с множественным выбором из ваших учебных материалов. Настраивайте количество вопросов и сложность для эффективной самопроверки.",
      "Организуйте все ваши учебные материалы по предметам (materie). Держите всё структурированным и легко доступным в течение всего семестра.",
      "Загружайте PDF, документы Word, презентации PowerPoint и изображения. ИИ обрабатывает и извлекает ключевую информацию из любого формата.",
      "Отслеживайте свой прогресс обучения с встроенной аналитикой. Смотрите какие темы вы освоили, а где нужна ещё практика.",
    ],

    formatsSectionTitle: "Поддерживаемые Форматы Файлов",
    formatsSectionSubtitle: "Загрузите любой из этих типов файлов и позвольте ИИ извлечь ключевую информацию для вас.",
    formatNames: ["PDF", "DOCX", "PPTX", "JPG/PNG", "TXT"],
    formatDescriptions: [
      "Портативный Документ",
      "Документы Word",
      "PowerPoint",
      "Изображения",
      "Текстовый Файл",
    ],

    simpleProcessBadge: "📋 Простой Процесс",
    howItWorksTitlePart1: "Как это",
    howItWorksTitlePart2: "Работает",
    howItWorksSubtitle: "Начните за четыре простых шага и измените свой способ обучения.",
    stepTitles: [
      "Загрузите Материалы",
      "Обработка ИИ",
      "Генерация Контента",
      "Учитесь & Добивайтесь Успеха",
    ],
    stepDescriptions: [
      "Перетащите ваши PDF, документы Word, презентации PowerPoint или изображения на платформу.",
      "Наш ИИ анализирует и понимает ваши документы, извлекая ключевые концепции и важную информацию.",
      "Получайте резюме, генерируемые ИИ, интерактивные тесты и учебные материалы, адаптированные к вашему контенту.",
      "Используйте сгенерированные материалы для эффективного обучения и успешной сдачи экзаменов с уверенностью.",
    ],

    statLabels: [
      "Обработанных Документов",
      "Сгенерированных Вопросов Тестов",
      "Активных Предметов",
      "Поможенных Студентов",
    ],

    ctaIcon: "🚀",
    ctaTitle: "Готовы Изменить Ваш Способ Учиться?",
    ctaDescription: "Присоединяйтесь к тысячам студентов, которые уже используют ИИ для более умного обучения. Начните создавать мощные резюме и тесты за секунды.",
    primaryButton: "Начать Бесплатно",
    secondaryButton: "Узнать Больше",

    faqBadge: "❓ Частые Вопросы",
    faqSectionTitlePart1: "Часто Задаваемые",
    faqSectionTitlePart2: "Вопросы",
    faqSubtitle: "Всё что вам нужно знать о Учебном Помощнике с ИИ.",
    faqQuestions: [
      "Какие форматы файлов поддерживаются?",
      "Как работает генация резюме с помощью ИИ?",
      "Могу ли я создавать пользовательские тесты из моих материалов?",
      "Безопасны и приватны ли мои данные?",
      "Сколько это стоит?",
      "Могу ли я использовать это на мобильном устройстве?",
    ],
    faqAnswers: [
      "Мы поддерживаем PDF, DOCX (документы Word), PPTX (презентации PowerPoint), изображения JPG/PNG и текстовые файлы. Вы можете загружать несколько файлов одновременно для полных учебных материалов.",
      "Наш ИИ анализирует ваши загруженные документы с помощью продвинутых моделей обработки естественного языка. Он определяет ключевые концепции, структурирует информацию иерархически и генует подробные резюме, которые захватывают основные пункты вашего материала.",
      "Да! Вы можете генать тесты с множественным выбором из любого загруженного документа. Настраивайте количество вопросов, уровень сложности и темы, по которым вы хотите быть протестированы. ИИ создает релевантные вопросы на основе вашего реального учебного контента.",
      "Абсолютно. Все загруженные документы обрабатываются безопасно и хранятся зашифрованными. Мы никогда не делимся вашими данными с третьими лицами. Вы можете удалить свой аккаунт и все связанные данные в любое время.",
      "Базовые функции совершенно бесплатны для студентов, включая загрузку документов, резюме ИИ и генацию тестов. Премиум-функции с продвинутой аналитикой и неограниченными загрузками доступны через доступный студенческий подписной план.",
      "Да! Наше веб-приложение полностью адаптивно и отлично работает на смартфонах, планшетах, ноутбуках и настольных компьютерах. Учитесь где угодно, когда угодно без необходимости устанавливать дополнительные приложения.",
    ],

    aboutAuthorBadge: "👤 Об Авторе",
    authorName: "Mihai Nicolae",
    authorRole: "Студент Университета Румяно-Американа • Начинающий Разработчик Программного Обеспечения",
    bioTexts: [
      "Меня зовут Mihai Nicolae, мне {age} лет и я студент первого курса Факультета Управления Информатикой Университета Румяно-Американского. Я увлечён технологиями и программированием — областью, которую изучаю самостоятельно уже более 3 лет.",
      "Этот проект — портфолио — я создал AI Study Assistant, чтобы показать работодателям, что мне нравится создавать полезные вещи и постоянно изучать новые технологии. Моя цель — получить профессиональную квалификацию в IT и приобрести практический опыт через работу в этой области.",
    ],
    skillLabels: [
      "React / TypeScript",
      "Node.js / Express",
      "Интеграция ИИ / LLM",
      "Git / GitHub",
    ],

    brandName: "🎓 Учебный Помощник с ИИ",
    brandDescription: "Преобразуйте свои учебные материалы с помощью инструментов обучения на базе ИИ. Резюме, тесты и вопросы-ответы — всё из ваших собственных документов.",
    productColumnTitle: "Продукт",
    resourcesColumnTitle: "Ресурсы",
    companyColumnTitle: "Компания",
    productLinks: ["Функции", "Цены", "Загрузить Документы", "Генератор Тестов"],
    resourceLinks: ["Документация", "Учебные материалы", "Блог", "API"],
    companyLinks: ["О Нас", "Контакт", "Карьера", "Пресс-кит"],
    copyrightText: "© 2025 Учебный Помощник с ИИ. Все права защищены.",
    privacyPolicy: "Политика Конфиденциальности",
    termsOfService: "Условия Использования",
    cookieSettings: "Настройки Файлов Cookie",
  },

  German: {
    appTitle: "KI-Studienassistent",
    tagline: "Laden Sie Ihre Vorlesungsnotizen, Lehrbücher und Studienmaterialien hoch, um KI-generierte Zusammenfassungen, Quizfragen und interaktive Q&A zu erstellen.",
    ctaButton: "Jetzt Lernen Starten",

    coreFeaturesBadge: "✨ Kernfunktionen",
    sectionTitlePart1: "Alles was Sie brauchen, um",
    sectionTitlePart2: "Ihre Prüfungen zu Bestehen",
    sectionSubtitle: "Leistungsstarke KI-Tools, die speziell für Studierende entwickelt wurden, die intelligenter und nicht schwerer lernen wollen.",
    featureTitles: [
      "KI-generierte Zusammenfassungen (Sinteză)",
      "Intelligente Dokumenten-Q&A",
      "Automatische Quizgenerierung",
      "Fachorganisation",
      "Multi-Format-Unterstützung",
      "Fortschrittsverfolgung",
    ],
    featureDescriptions: [
      "Erstellen Sie umfassende, strukturierte Zusammenfassungen aus beliebigen PDF-, DOCX- oder Präsentationsdateien mit fortschrittlichen KI-Modellen, die akademische Inhalte verstehen.",
      "Stellen Sie spezifische Fragen zu Ihren hochgeladenen Dokumenten und erhalten Sie sofortige, kontextbewusste Antworten von der KI — wie ein 24/7 verfügbarer Tutor.",
      "Erstellen Sie benutzerdefinierte Multiple-Choice-Quizfragen aus Ihren Studienmaterialien. Konfigurieren Sie Anzahl und Schwierigkeitsgrad der Fragen für effektive Selbstbewertung.",
      "Organisieren Sie alle Ihre Studienmaterialien nach Fächern (materie). Halten Sie alles strukturiert und leicht zugänglich während des gesamten Semesters.",
      "Laden Sie PDFs, Word-Dokumente, PowerPoint-Präsentationen und Bilder hoch. Die KI verarbeitet und extrahiert Schlüsselinformationen aus jedem Format.",
      "Verfolgen Sie Ihren Lernfortschritt mit integrierter Analytik. Sehen Sie, welche Themen Sie gemeistert haben und wo Sie mehr Übung brauchen.",
    ],

    formatsSectionTitle: "Unterstützte Dateiformate",
    formatsSectionSubtitle: "Laden Sie einen dieser Dateitypen hoch und lassen Sie die KI die Schlüsselinformationen für Sie extrahieren.",
    formatNames: ["PDF", "DOCX", "PPTX", "JPG/PNG", "TXT"],
    formatDescriptions: [
      "Portables Dokument",
      "Word-Dokumente",
      "PowerPoint",
      "Bilder",
      "Klartext",
    ],

    simpleProcessBadge: "📋 Einfacher Prozess",
    howItWorksTitlePart1: "So Funktioniert es",
    howItWorksTitlePart2: "",
    howItWorksSubtitle: "Starten Sie in vier einfachen Schritten und verändern Sie Ihre Art zu lernen.",
    stepTitles: [
      "Materialien Hochladen",
      "KI-Verarbeitung",
      "Inhalt Generieren",
      "Lernen & Erfolgreich Sein",
    ],
    stepDescriptions: [
      "Ziehen Sie Ihre PDFs, Word-Dokumente, PowerPoint-Präsentationen oder Bilder auf die Plattform.",
      "Unsere KI analysiert und versteht Ihre Dokumente und extrahiert Schlüsselkonzepte und wichtige Informationen.",
      "Erhalten Sie KI-generierte Zusammenfassungen, interaktive Quizfragen und Studienmaterialien, die auf Ihren Inhalt zugeschnitten sind.",
      "Verwenden Sie die generierten Materialien, um effektiv zu lernen und bestehen Sie Ihre Prüfungen mit Vertrauen.",
    ],

    statLabels: [
      "Verarbeitete Dokumente",
      "Generierte Quizfragen",
      "Aktive Fächer",
      "Hilfsstudierende",
    ],

    ctaIcon: "🚀",
    ctaTitle: "Bereit, Ihre Lernweise zu Transformieren?",
    ctaDescription: "Schließen Sie sich Tausenden von Studierenden an, die bereits KI nutzen, um intelligenter zu lernen. Erstellen Sie in Sekundenschnelle leistungsstarke Zusammenfassungen und Quizfragen.",
    primaryButton: "Kostenlos Starten",
    secondaryButton: "Mehr Erfahren",

    faqBadge: "❓ Häufig gestellte Fragen",
    faqSectionTitlePart1: "Häufig Gestellte",
    faqSectionTitlePart2: "Fragen",
    faqSubtitle: "Alles was Sie über den KI-Studienassistenten wissen müssen.",
    faqQuestions: [
      "Welche Dateiformate werden unterstützt?",
      "Wie funktioniert die KI-Zusammenfassungsgenerierung?",
      "Kann ich benutzerdefinierte Quizfragen aus meinen Materialien erstellen?",
      "Sind meine Daten sicher und privat?",
      "Was kostet es?",
      "Kann ich das auf meinem Mobilgerät verwenden?",
    ],
    faqAnswers: [
      "Wir unterstützen PDF, DOCX (Word-Dokumente), PPTX (PowerPoint-Präsentationen), JPG/PNG-Bilder und Klartextdateien. Sie können mehrere Dateien gleichzeitig für umfassende Studienmaterialien hochladen.",
      "Unsere KI analysiert Ihre hochgeladenen Dokumente mit fortschrittlichen Modellen zur Verarbeitung natürlicher Sprache. Sie identifiziert Schlüsselkonzepte, strukturiert Informationen hierarchisch und generiert umfassende Zusammenfassungen, die die wesentlichen Punkte Ihres Materials erfassen.",
      "Ja! Sie können Multiple-Choice-Quizfragen aus jedem hochgeladenen Dokument erstellen. Passen Sie die Anzahl der Fragen, das Schwierigkeitsgrad und die Themen an, auf denen Sie getestet werden möchten. Die KI erstellt relevante Fragen basierend auf Ihrem tatsächlichen Studieninhalt.",
      "Absolut. Alle hochgeladenen Dokumente werden sicher verarbeitet und verschlüsselt gespeichert. Wir teilen Ihre Daten niemals mit Dritten. Sie können Ihr Konto und alle zugehörigen Daten jederzeit löschen.",
      "Die Grundfunktionen sind für Studierende völlig kostenlos, einschließlich Dokumentenhochladen, KI-Zusammenfassungen und Quizgenerierung. Premium-Funktionen mit fortschrittlicher Analytik und unbegrenzten Uploads sind über einen erschwinglichen Studenten-Abonnementplan verfügbar.",
      "Ja! Unsere Webanwendung ist vollständig responsiv und funktioniert hervorragend auf Smartphones, Tablets, Laptops und Desktop-Computern. Lernen Sie überall, jederzeit ohne zusätzliche Apps installieren zu müssen.",
    ],

    aboutAuthorBadge: "👤 Über den Autor",
    authorName: "Mihai Nicolae",
    authorRole: "Student an der Universitatea Romano-Americana • Aspirierender Softwareentwickler",
    bioTexts: [
      "Ich heiße Mihai Nicolae, bin {age} Jahre alt und studiere im ersten Jahr an der Fakultät für Managementinformatik der Rumänisch-Amerikanischen Universität. Ich bin begeistert von Technologie und Programmierung — einem Bereich, den ich seit über 3 Jahren autodidaktisch studiere.",
      "Dieses Projekt ist ein persönliches Portfolio — ich habe AI Study Assistant erstellt, um Arbeitgebern zu zeigen, dass ich nützliche Dinge baue und ständig neue Technologien lerne. Mein Ziel ist es, eine berufliche Qualifikation in IT zu erhalten und praktische Erfahrung durch einen Job in diesem Bereich zu sammeln.",
    ],
    skillLabels: [
      "React / TypeScript",
      "Node.js / Express",
      "KI / LLM-Integration",
      "Git / GitHub",
    ],

    brandName: "🎓 KI-Studienassistent",
    brandDescription: "Transformieren Sie Ihre Studienmaterialien mit KI-gestützten Lernwerkzeugen. Zusammenfassungen, Quizfragen und Q&A — alles aus Ihren eigenen Dokumenten.",
    productColumnTitle: "Produkt",
    resourcesColumnTitle: "Ressourcen",
    companyColumnTitle: "Unternehmen",
    productLinks: ["Funktionen", "Preise", "Dokumente Hochladen", "Quizgenerator"],
    resourceLinks: ["Dokumentation", "Tutorials", "Blog", "API"],
    companyLinks: ["Über Uns", "Kontakt", "Karriere", "Pressemappe"],
    copyrightText: "© 2025 KI-Studienassistent. Alle Rechte vorbehalten.",
    privacyPolicy: "Datenschutzrichtlinie",
    termsOfService: "Nutzungsbedingungen",
    cookieSettings: "Cookie-Einstellungen",
  },

  Japanese: {
    appTitle: "AI学習アシスタント",
    tagline: "講義ノート、教科書、学習資料をアップロードして、AI搭載の要約、クイズ、インタラクティブQ&Aを生成しましょう。",
    ctaButton: "学習を開始",

    coreFeaturesBadge: "✨ 主要機能",
    sectionTitlePart1: "試験で",
    sectionTitlePart2: "高得点に必要な全て",
    sectionSubtitle: "より賢く勉強したい学生のために特別に設計された強力なAIツール。",
    featureTitles: [
      "AI搭載要約（Sinteză）",
      "スマートドキュメントQ&A",
      "自動クイズ生成",
      "科目整理",
      "マルチフォーマットサポート",
      "進捗追跡",
    ],
    featureDescriptions: [
      "学術コンテンツを理解する高度なAIモデルを使用して、PDF、DOCX、プレゼンテーションファイルから包括的で構造化された要約を生成します。",
      "アップロードしたドキュメントについて具体的な質問をし、AI搭載の即座で文脈対応の回答を取得 — 24/7利用可能なチューターを持っているようなもの。",
      "学習資料からカスタマイズされた複数選択クイズを作成。効果的な自己評価のために問題数と難易度を設定できます。",
      "すべての学習資料を科目（materie）別に整理。学期を通じて全てを構造化し、簡単にアクセスできるように保ちます。",
      "PDF、Wordドキュメント、PowerPointプレゼンテーション、画像をアップロード。AIはあらゆるフォーマットから主要情報を処理・抽出します。",
      "内蔵分析で学習進捗を追跡。どのトピックを習得したか、どこでもっと練習が必要かを確認しましょう。",
    ],

    formatsSectionTitle: "サポートされているファイル形式",
    formatsSectionSubtitle: "これらのファイルタイプのいずれかをアップロードし、AIが主要情報を抽出します。",
    formatNames: ["PDF", "DOCX", "PPTX", "JPG/PNG", "TXT"],
    formatDescriptions: [
      "ポータブルドキュメント",
      "Wordドキュメント",
      "PowerPoint",
      "画像",
      "プレーンテキスト",
    ],

    simpleProcessBadge: "📋 シンプルなプロセス",
    howItWorksTitlePart1: "使い方",
    howItWorksTitlePart2: "",
    howItWorksSubtitle: "4つの簡単なステップで始めて、勉強の仕方を変えましょう。",
    stepTitles: [
      "資料をアップロード",
      "AI処理",
      "コンテンツ生成",
      "学習して成功",
    ],
    stepDescriptions: [
      "PDF、Wordドキュメント、PowerPointプレゼンテーション、または画像をプラットフォームにドラッグアンドドロップします。",
      "AIはドキュメントを分析・理解し、主要概念と重要な情報を抽出します。",
      "コンテンツに合わせて調整されたAI生成要約、インタラクティブクイズ、学習資料を取得しましょう。",
      "生成された資料を使用して効果的に勉強し、自信を持って試験に臨みましょう。",
    ],

    statLabels: [
      "処理されたドキュメント",
      "生成されたクイズ問題",
      "アクティブな科目",
      "支援された学生",
    ],

    ctaIcon: "🚀",
    ctaTitle: "勉強の仕方を変えませんか？",
    ctaDescription: "すでにAIを使用して賢く勉強している何千人もの学生に参加しましょう。数秒で強力な要約とクイズの作成を開始します。",
    primaryButton: "無料で始める",
    secondaryButton: "詳しく学ぶ",

    faqBadge: "❓ よくある質問",
    faqSectionTitlePart1: "よくある",
    faqSectionTitlePart2: "ご質問",
    faqSubtitle: "AI学習アシスタントについて知る必要がある全て。",
    faqQuestions: [
      "どのようなファイル形式がサポートされていますか？",
      "AI要約生成はどのように機能しますか？",
      "資料からカスタムクイズを作成できますか？",
      "私のデータは安全でプライベートですか？",
      "コストはいくらですか？",
      "モバイルデバイスで使用できますか？",
    ],
    faqAnswers: [
      "PDF、DOCX（Wordドキュメント）、PPTX（PowerPointプレゼンテーション）、JPG/PNG画像、プレーンテキストファイルをサポートしています。包括的な学習資料のために複数のファイルを一度にアップロードできます。",
      "AIは高度な自然言語処理モデルを使用してアップロードされたドキュメントを分析します。主要概念を特定し、情報を階層的に構造化し、教材の重要なポイントを捉えた包括的な要約を生成します。",
      "はい！アップロードされたドキュメントから複数選択クイズを生成できます。問題数、難易度レベル、テストされるトピックをカスタマイズできます。AIは実際の学習コンテンツに基づいて関連性の高い質問を作成します。",
      "もちろん。すべてのアップロードされたドキュメントは安全に処理され、暗号化されて保存されます。第三者とデータを共有することは決してありません。いつでもアカウントと関連データを削除できます。",
      "基本機能は学生にとって完全に無料で、ドキュメントのアップロード、AI要約、クイズ生成が含まれます。高度な分析と無制限のアップロードを備えたプレミアム機能は、手頃な学生のサブスクリプションプランで利用可能です。",
      "はい！ウェブアプリケーションは完全にレスポンシブで、スマートフォン、タブレット、ラップトップ、デスクトップコンピュータで素晴らしい動作を実現します。追加アプリをインストールすることなく、いつでもどこでも学習できます。",
    ],

    aboutAuthorBadge: "👤 著者について",
    authorName: "Mihai Nicolae",
    authorRole: "罗马ニア・アメリカナ大学学生 • アスピリングソフトウェア開発者",
    bioTexts: [
      "私の名前はMihai Nicolae、{age}歳で、ロマネアメリカナ大学の管理情報学部一年生です。テクノロジーとプログラミングに情熱を持っています — 3年以上独学で勉強している分野です。",
      "このプロジェクトはポートフォリオです — 雇用者に有用なものを構築し、常に新しい技術を学ぶことが好きであることを示すためにAI Study Assistantを作成しました。私の目標はITで専門的な資格を取得し、この分野の仕事を通じて実践経験を積むことです。",
    ],
    skillLabels: [
      "React / TypeScript",
      "Node.js / Express",
      "AI / LLM統合",
      "Git / GitHub",
    ],

    brandName: "🎓 AI学習アシスタント",
    brandDescription: "AI搭載の学習ツールで学習資料を変革しましょう。要約、クイズ、Q&A — 全て自分のドキュメントから。",
    productColumnTitle: "製品",
    resourcesColumnTitle: "リソース",
    companyColumnTitle: "会社",
    productLinks: ["機能", "価格", "ドキュメントアップロード", "クイズジェネレーター"],
    resourceLinks: ["ドキュメント", "チュートリアル", "ブログ", "API"],
    companyLinks: ["会社概要", "お問い合わせ", "採用情報", "プレスキット"],
    copyrightText: "© 2025 AI学習アシスタント。全著作権所有。",
    privacyPolicy: "プライバシーポリシー",
    termsOfService: "利用規約",
    cookieSettings: "Cookie設定",
  },

  Vietnamese: {
    appTitle: "Trợ Lý Học Tập AI",
    tagline: "Tải lên ghi chú bài giảng, sách giáo khoa và tài liệu học tập của bạn để tạo tóm tắt, câu hỏi trắc nghiệm và Q&A tương tác được cung cấp bởi AI.",
    ctaButton: "Bắt Đầu Học",

    coreFeaturesBadge: "✨ Tính Năng Cốt Lõi",
    sectionTitlePart1: "Tất Cả Những Gì Bạn Cần Để",
    sectionTitlePart2: "Đậu Kỳ Thi",
    sectionSubtitle: "Công cụ AI mạnh mẽ được thiết kế đặc biệt cho sinh viên muốn học thông minh hơn, không phải khó hơn.",
    featureTitles: [
      "Tóm Tắt AI-Powered (Sinteză)",
      "Hỏi Đáp Thông Minh Về Tài Liệu",
      "Tự Động Tạo Câu Hỏi Trắc Nghiệm",
      "Tổ Chức Môn Học",
      "Hỗ Trợ Đa Định Dạng",
      "Theo Dấu Tiến Bộ",
    ],
    featureDescriptions: [
      "Tạo tóm tắt toàn diện, có cấu trúc từ bất kỳ tệp PDF, DOCX hoặc bài thuyết trình nào bằng cách sử dụng các mô hình AI tiên tiến hiểu nội dung học thuật.",
      "Đặt câu hỏi cụ thể về tài liệu đã tải lên và nhận câu trả lời tức thì, có ngữ cảnh được cung cấp bởi AI — như có một gia sư sẵn sàng 24/7.",
      "Tạo bài kiểm tra tùy chỉnh từ tài liệu học tập của bạn. Cấu hình số lượng câu hỏi và mức độ khó để tự đánh giá hiệu quả.",
      "Tổ chức tất cả tài liệu học tập theo môn học (materie). Giữ mọi thứ có cấu trúc và dễ dàng truy cập trong suốt học kỳ.",
      "Tải lên PDF, tài liệu Word, bài thuyết trình PowerPoint và hình ảnh. AI xử lý và trích xuất thông tin quan trọng từ bất kỳ định dạng nào.",
      "Theo dõi tiến bộ học tập với phân tích tích hợp. Xem chủ đề nào bạn đã thành thạo và nơi cần nhiều thực hành hơn.",
    ],

    formatsSectionTitle: "Định Dạng Tệp Được Hỗ Trợ",
    formatsSectionSubtitle: "Tải lên bất kỳ loại tệp nào trong những loại này và để AI trích xuất thông tin quan trọng cho bạn.",
    formatNames: ["PDF", "DOCX", "PPTX", "JPG/PNG", "TXT"],
    formatDescriptions: [
      "Tài Liệu Di Động",
      "Tài Liệu Word",
      "PowerPoint",
      "Hình Ảnh",
      "Văn Bản Đơn Giản",
    ],

    simpleProcessBadge: "📋 Quy Trình Đơn Giản",
    howItWorksTitlePart1: "Cách Hoạt Động",
    howItWorksTitlePart2: "",
    howItWorksSubtitle: "Bắt đầu với bốn bước đơn giản và thay đổi cách bạn học.",
    stepTitles: [
      "Tải Lên Tài Liệu",
      "Xử Lý AI",
      "Tạo Nội Dung",
      "Học & Thành Công",
    ],
    stepDescriptions: [
      "Kéo và thả PDF, tài liệu Word, bài thuyết trình PowerPoint hoặc hình ảnh vào nền tảng.",
      "AI của chúng tôi phân tích và hiểu tài liệu của bạn, trích xuất các khái niệm quan trọng và thông tin quan trọng.",
      "Nhận tóm tắt do AI tạo, câu hỏi trắc nghiệm tương tác và tài liệu học tập được điều chỉnh theo nội dung của bạn.",
      "Sử dụng tài liệu được tạo để học hiệu quả và vượt qua kỳ thi với sự tự tin.",
    ],

    statLabels: [
      "Tài Liệu Đã Xử Lý",
      "Câu Hỏi Trắc Nghiệm Đã Tạo",
      "Môn Học Đang Hoạt Động",
      "Sinh Viên Được Giúp Đỡ",
    ],

    ctaIcon: "🚀",
    ctaTitle: "Sẵn Sàng Thay Đổi Cách Học Của Bạn?",
    ctaDescription: "Tham gia hàng ngàn sinh viên đang sử dụng AI để học thông minh hơn. Bắt đầu tạo tóm tắt và câu hỏi trắc nghiệm mạnh mẽ trong vài giây.",
    primaryButton: "Bắt Đầu Miễn Phí",
    secondaryButton: "Tìm Hiểu Thêm",

    faqBadge: "❓ Câu Hỏi Thường Gặp",
    faqSectionTitlePart1: "Câu Hỏi Thường",
    faqSectionTitlePart2: "Gặp",
    faqSubtitle: "Tất cả những gì bạn cần biết về Trợ Lý Học Tập AI.",
    faqQuestions: [
      "Những định dạng tệp nào được hỗ trợ?",
      "Cách tạo tóm tắt AI hoạt động như thế nào?",
      "Tôi có thể tạo câu hỏi trắc nghiệm tùy chỉnh từ tài liệu của mình không?",
      "Dữ liệu của tôi có an toàn và riêng tư không?",
      "Chi phí bao nhiêu?",
      "Tôi có thể sử dụng trên thiết bị di động không?",
    ],
    faqAnswers: [
      "Chúng tôi hỗ trợ PDF, DOCX (tài liệu Word), PPTX (bài thuyết trình PowerPoint), hình ảnh JPG/PNG và tệp văn bản đơn giản. Bạn có thể tải lên nhiều tệp cùng một lúc để có tài liệu học tập toàn diện.",
      "AI của chúng tôi phân tích tài liệu đã tải lên bằng cách sử dụng các mô hình xử lý ngôn ngữ tự nhiên tiên tiến. Nó xác định các khái niệm quan trọng, cấu trúc thông tin theo thứ bậc và tạo tóm tắt toàn diện nắm bắt các điểm thiết yếu của tài liệu.",
      "Có! Bạn có thể tạo câu hỏi trắc nghiệm từ bất kỳ tài liệu nào đã tải lên. Tùy chỉnh số lượng câu hỏi, mức độ khó và chủ đề bạn muốn được kiểm tra. AI tạo câu hỏi liên quan dựa trên nội dung học tập thực tế của bạn.",
      "Chắc chắn rồi. Tất cả tài liệu được tải lên được xử lý an toàn và lưu trữ mã hóa. Chúng tôi không bao giờ chia sẻ dữ liệu của bạn với bên thứ ba. Bạn có thể xóa tài khoản và tất cả dữ liệu liên kết bất cứ lúc nào.",
      "Các tính năng cơ bản hoàn toàn miễn phí cho sinh viên, bao gồm tải lên tài liệu, tóm tắt AI và tạo câu hỏi trắc nghiệm. Các tính năng cao cấp với phân tích tiên tiến và tải lên không giới hạn có sẵn qua gói đăng ký sinh viên giá cả phải chăng.",
      "Có! Ứng dụng web của chúng tôi hoàn toàn responsive và hoạt động tuyệt vời trên điện thoại thông minh, máy tính bảng, laptop và máy tính để bàn. Học mọi lúc, mọi nơi mà không cần cài đặt thêm ứng dụng.",
    ],

    aboutAuthorBadge: "👤 Về Tác Giả",
    authorName: "Mihai Nicolae",
    authorRole: "Sinh viên tại Universitatea Romano-Americana • Nhà Phát Triển Phần Mềm Tương Lai",
    bioTexts: [
      "Tên tôi là Mihai Nicolae, tôi {age} tuổi và là sinh viên năm nhất tại Khoa Quản lý Tin học thuộc Đại học Romano-Americana. Tôi đam mê công nghệ và lập trình — lĩnh vực mà tôi tự nghiên cứu hơn 3 năm.",
      "Dự án này là một portfolio cá nhân — tôi đã tạo AI Study Assistant để chứng minh cho nhà tuyển dụng rằng tôi thích xây dựng những thứ hữu ích và liên tục học hỏi công nghệ mới. Mục tiêu của tôi là đạt được bằng cấp chuyên môn về CNTT và tích lũy kinh nghiệm thực tế thông qua công việc trong lĩnh vực này.",
    ],
    skillLabels: [
      "React / TypeScript",
      "Node.js / Express",
      "Tích Hợp AI / LLM",
      "Git / GitHub",
    ],

    brandName: "🎓 Trợ Lý Học Tập AI",
    brandDescription: "Chuyển đổi tài liệu học tập của bạn với công cụ học tập được cung cấp bởi AI. Tóm tắt, câu hỏi trắc nghiệm và Q&A — tất cả từ chính tài liệu của bạn.",
    productColumnTitle: "Sản Phẩm",
    resourcesColumnTitle: "Tài Nguyên",
    companyColumnTitle: "Công Ty",
    productLinks: ["Tính Năng", "Giá Cả", "Tải Lên Tài Liệu", "Trình Tạo Câu Hỏi Trắc Nghiệm"],
    resourceLinks: ["Tài Liệu", "Hướng Dẫn", "Blog", "API"],
    companyLinks: ["Về Chúng Tôi", "Liên Hệ", "Nghề Nghiệp", "Gói Báo Chí"],
    copyrightText: "© 2025 Trợ Lý Học Tập AI. Mọi quyền được bảo lưu.",
    privacyPolicy: "Chính Sách Bảo Mật",
    termsOfService: "Điều Khoản Dịch Vụ",
    cookieSettings: "Cài Đặt Cookie",
  },

  Turkish: {
    appTitle: "AI Çalışma Asistanı",
    tagline: "Ders notlarınızı, ders kitaplarınızı ve çalışma materyallerinizi yükleyerek AI destekli özetler, quizler ve etkileşimli S&Y oluşturun.",
    ctaButton: "Çalışmaya Başla",

    coreFeaturesBadge: "✨ Temel Özellikler",
    sectionTitlePart1: "Sınavlarda",
    sectionTitlePart2: "Başarmak İçin İhtiyacın Olan Her Şey",
    sectionSubtitle: "Daha zor değil, daha akıllı çalışmak isteyen öğrenciler için özel olarak tasarlanmış güçlü AI araçları.",
    featureTitles: [
      "AI Destekli Özetler (Sinteză)",
      "Akıllı Belge S&Y",
      "Otomatik Quiz Oluşturma",
      "Ders Organizasyonu",
      "Çok Biçimli Destek",
      "İlerleme Takibi",
    ],
    featureDescriptions: [
      "Akademik içeriği anlayan gelişmiş AI modellerini kullanarak herhangi bir PDF, DOCX veya sunu dosyasından kapsamlı, yapılandırılmış özetler oluşturun.",
      "Yüklediğiniz belgeler hakkında spesifik sorular sorun ve 7/24 mevcut bir özel hoca gibi AI destekli anlık, bağlamsal yanıtlar alın.",
      "Çalışma materyallerinizden özelleştirilmiş çok seçkli quizler oluşturun. Etkili kendi kendine değerlendirme için soru sayısını ve zorluk seviyesini yapılandırın.",
      "Tüm çalışma materyallerinizi derslere (materie) göre düzenleyin. Tüm yarıyıl boyunca her şeyi yapılandırılmış ve kolay erişilebilir tutun.",
      "PDF'leri, Word belgelerini, PowerPoint sunumlarını ve resimleri yükleyin. AI herhangi bir biçimden anahtar bilgileri işler ve çıkarır.",
      "Dahili analitik ile öğrenme ilerlemenizi takip edin. Hangi konuları kavradığınızı ve nerede daha fazla pratiğe ihtiyacınız olduğunu görün.",
    ],

    formatsSectionTitle: "Desteklenen Dosya Biçimleri",
    formatsSectionSubtitle: "Bu dosya türlerinden herhangi birini yükleyin ve AI'nın anahtar bilgileri sizin için çıkarmasına izin verin.",
    formatNames: ["PDF", "DOCX", "PPTX", "JPG/PNG", "TXT"],
    formatDescriptions: [
      "Taşınabilir Belge",
      "Word Belgeleri",
      "PowerPoint",
      "Resimler",
      "Düz Metin",
    ],

    simpleProcessBadge: "📋 Basit Süreç",
    howItWorksTitlePart1: "Nasıl Çalışır",
    howItWorksTitlePart2: "",
    howItWorksSubtitle: "Dört basit adımda başlayın ve çalışma şeklinizi dönüştürün.",
    stepTitles: [
      "Materyalleri Yükleyin",
      "AI İşleme",
      "İçerik Oluşturun",
      "Çalışın & Başarın",
    ],
    stepDescriptions: [
      "PDF'lerinizi, Word belgelerinizi, PowerPoint sunumlarınızı veya resimlerinizi platforma sürükleyip bırakın.",
      "AI belgelerinizi analiz eder ve anlar, ana kavramları ve önemli bilgileri çıkarır.",
      "İçeriğinize göre uyarlanmış AI oluşturulmuş özetler, etkileşimli quizler ve çalışma materyalleri alın.",
      "Etkili çalışmak ve sınavlara güvenle girmek için oluşturulan materyalleri kullanın.",
    ],

    statLabels: [
      "İşlenen Belgeler",
      "Oluşturulan Quiz Soruları",
      "Aktif Dersler",
      "Yardımla Alan Öğrenciler",
    ],

    ctaIcon: "🚀",
    ctaTitle: "Çalışma Şeklinizi Dönüştürmeye Hazır mısınız?",
    ctaDescription: "Zaten daha akıllı çalışmak için AI kullanan binlerce öğrenciye katılın. Saniyeler içinde güçlü özetler ve quizler oluşturmaya başlayın.",
    primaryButton: "Ücretsiz Başla",
    secondaryButton: "Daha Fazla Bilgi",

    faqBadge: "❓ Sıkça Sorulan Sorular",
    faqSectionTitlePart1: "Sıkça Sorulan",
    faqSectionTitlePart2: "Sorular",
    faqSubtitle: "AI Çalışma Asistanı hakkında bilmeniz gereken her şey.",
    faqQuestions: [
      "Hangi dosya biçimleri destekleniyor?",
      "AI özet oluşturma nasıl çalışır?",
      "Materyallerimden özel quizler oluşturabilir miyim?",
      "Verilerim güvende ve gizli mi?",
      "Ne kadar maliyetli?",
      "Mobil cihazımda bunu kullanabilir miyim?",
    ],
    faqAnswers: [
      "PDF, DOCX (Word belgeleri), PPTX (PowerPoint sunumları), JPG/PNG resimler ve düz metin dosyalarını destekliyoruz. Kapsamlı çalışma materyalleri için birden fazla dosyayı aynı anda yükleyebilirsiniz.",
      "AI, gelişmiş doğal dil işleme modellerini kullanarak yüklediğiniz belgeleri analiz eder. Ana kavramları tanımlar, bilgileri hiyerarşik olarak yapılandırır ve materyalinizin temel noktalarını yakalayan kapsamlı özetler oluşturur.",
      "Evet! Yüklenen herhangi bir belgeden çok seçkli quizler oluşturabilirsiniz. Soru sayısını, zorluk seviyesini ve test edilmek istediğiniz konuları özelleştirin. AI, gerçek çalışma içeriğinize göre ilgili sorular oluşturur.",
      "Kesinlikle. Tüm yüklenen belgeler güvenli şekilde işlenir ve şifreli olarak saklanır. Verilerinizi asla üçüncü taraflarla paylaşmayız. Hesabınızı ve tüm ilişkili verileri istediğiniz zaman silebilirsiniz.",
      "Temel özellikler öğrenciler için tamamen ücretsizdir; belge yükleme, AI özetleri ve quiz oluşturma dahil. Gelişmiş analitik ve sınırsız yüklemelerle premium özellikler uygun fiyatlı bir öğrenci abonelik planı aracılığıyla kullanılabilir.",
      "Evet! Web uygulamamız tam responsive'dir ve akıllı telefonlarda, tabletlerde, dizüstü bilgisayarlarda ve masaüstü bilgisayarlarda harika çalışır. Ek uygulama yüklemeye ihtiyaç duymadan her yerde, her zaman çalışın.",
    ],

    aboutAuthorBadge: "👤 Yazar Hakkında",
    authorName: "Mihai Nicolae",
    authorRole: "Universitatea Romano-Americana'da Öğrenci • Umutlu Yazılım Geliştirici",
    bioTexts: [
      "Benim adım Mihai Nicolae, {age} yaşındayım ve Romano-Amerikan Üniversitesi Yönetimsel Bilgi Bilimleri Fakültesi birinci sınıf öğrencisiyim. Teknolojiye ve programlamaya tutkuyla bağlıyım — 3 yıldan fazla süredir kendi kendime öğrendiğim bir alan.",
      "Bu proje kişisel bir portfolyo — işverenlere yararlı şeyler inşa etmeyi ve sürekli yeni teknolojiler öğrenmeyi sevdiğimi göstermek için AI Study Assistant'ı oluşturdum. Hedefim, BT'de profesyonel nitelik elde etmek ve bu alandaki bir iş aracılığıyla pratik deneyim kazanmaktır.",
    ],
    skillLabels: [
      "React / TypeScript",
      "Node.js / Express",
      "AI / LLM Entegrasyonu",
      "Git / GitHub",
    ],

    brandName: "🎓 AI Çalışma Asistanı",
    brandDescription: "AI destekli öğrenme araçlarıyla çalışma materyallerinizi dönüştürün. Özetler, quizler ve S&Y — hepsi kendi belgelerinizden.",
    productColumnTitle: "Ürün",
    resourcesColumnTitle: "Kaynaklar",
    companyColumnTitle: "Şirket",
    productLinks: ["Özellikler", "Fiyatlandırma", "Belge Yükle", "Quiz Oluşturucu"],
    resourceLinks: ["Dokümantasyon", "Eğitimler", "Blog", "API"],
    companyLinks: ["Hakkımızda", "İletişim", "Kariyer", "Basın Kiti"],
    copyrightText: "© 2025 AI Çalışma Asistanı. Tüm hakları saklıdır.",
    privacyPolicy: "Gizlilik Politikası",
    termsOfService: "Hizmet Şartları",
    cookieSettings: "Çerez Ayarları",
  },
};

export function getHomePageText(language: string): HomePageText {
  return homeTexts[language as HomeLanguage] ?? homeTexts["English"];
}

export { supportedLanguages };

export const homePageTextsArray: HomePageText[] = [...supportedLanguages].map(
  (lang) => homeTexts[lang]
);

export default homeTexts;