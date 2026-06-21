/**
 * Mock fallback data used when PostgreSQL is not available.
 * Allows all pages to render with realistic sample data without a database.
 */

export const mockProfile = {
  id: 1,
  name: "Pranav Pawar",
  university: "Mumbai University",
  course: "B.E. Computer Engineering",
  semester: 4,
  streakDays: 12,
  premiumTier: "free",
  joinedAt: new Date("2024-01-15"),
};

export const mockDoubts = [
  {
    id: 1,
    subject: "Data Structures",
    question: "What is the time complexity of quicksort in the worst case?",
    answer:
      "**Worst case: O(n²)**\n\nHappens when pivot is consistently smallest/largest (e.g. sorted array). Avoid with *randomized quicksort*.",
    rating: 1,
    createdAt: new Date(Date.now() - 1000 * 60 * 20),
  },
  {
    id: 2,
    subject: "DBMS",
    question: "Explain the difference between INNER JOIN and LEFT JOIN.",
    answer:
      "**INNER JOIN** returns only matching rows from both tables.\n**LEFT JOIN** returns all rows from the left table, with NULL for non-matching right rows.",
    rating: 1,
    createdAt: new Date(Date.now() - 1000 * 60 * 90),
  },
  {
    id: 3,
    subject: "Operating Systems",
    question: "What is a deadlock and how can it be prevented?",
    answer:
      "**Deadlock** occurs when processes are waiting for each other's resources indefinitely.\n\nPrevention:\n- **Mutual Exclusion**: avoid where possible\n- **Hold & Wait**: request all resources at once\n- **No Preemption**: allow resource preemption\n- **Circular Wait**: use resource ordering",
    rating: null,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3),
  },
];

export const mockNotes = [
  {
    id: 1,
    title: "Data Structures Complete Notes – Sem 4",
    subject: "Data Structures",
    semester: 4,
    university: "Mumbai University",
    author: "Ananya Desai",
    description: "Covers arrays, linked lists, trees, graphs, and sorting algorithms with examples.",
    pageCount: 38,
    likes: 142,
    downloads: 87,
    status: "approved",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
  },
  {
    id: 2,
    title: "DBMS Short Notes with SQL Queries",
    subject: "DBMS",
    semester: 4,
    university: "Mumbai University",
    author: "Rahul More",
    description: "Concise notes on normalization, transactions, and SQL with examples.",
    pageCount: 22,
    likes: 98,
    downloads: 56,
    status: "approved",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
  },
  {
    id: 3,
    title: "Operating Systems – Process Management",
    subject: "Operating Systems",
    semester: 4,
    university: "Pune University",
    author: "Priya Kulkarni",
    description: "Process scheduling, deadlocks, memory management covered in depth.",
    pageCount: 45,
    likes: 76,
    downloads: 44,
    status: "approved",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12),
  },
  {
    id: 4,
    title: "Computer Networks OSI Model",
    subject: "Computer Networks",
    semester: 4,
    university: "Nagpur University",
    author: "Sameer Joshi",
    description: "Complete breakdown of all 7 layers with protocols and diagrams.",
    pageCount: 29,
    likes: 63,
    downloads: 31,
    status: "approved",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15),
  },
];

export const mockPyqs = [
  {
    id: 1,
    subject: "Data Structures",
    university: "Mumbai University",
    year: 2023,
    paperType: "End Semester",
    semester: 4,
    downloads: 234,
    bookmarked: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
  },
  {
    id: 2,
    subject: "DBMS",
    university: "Mumbai University",
    year: 2023,
    paperType: "Mid Semester",
    semester: 4,
    downloads: 187,
    bookmarked: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 35),
  },
  {
    id: 3,
    subject: "Operating Systems",
    university: "Pune University",
    year: 2022,
    paperType: "End Semester",
    semester: 4,
    downloads: 156,
    bookmarked: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60),
  },
  {
    id: 4,
    subject: "Computer Networks",
    university: "Mumbai University",
    year: 2022,
    paperType: "End Semester",
    semester: 4,
    downloads: 123,
    bookmarked: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 90),
  },
];

export const mockCompanies = [
  { id: 1, name: "TCS", category: "IT", logo: "🔵", practiceCount: 24, questionCount: 24 },
  { id: 2, name: "Infosys", category: "IT", logo: "🟢", practiceCount: 18, questionCount: 18 },
  { id: 3, name: "Wipro", category: "IT", logo: "🟡", practiceCount: 15, questionCount: 15 },
  { id: 4, name: "Deloitte", category: "Consulting", logo: "🟣", practiceCount: 12, questionCount: 12 },
  { id: 5, name: "Goldman Sachs", category: "Finance", logo: "🔷", practiceCount: 20, questionCount: 20 },
  { id: 6, name: "Microsoft", category: "IT", logo: "🪟", practiceCount: 22, questionCount: 22 },
];

export const mockCompanyQuestions = [
  { id: 1, companyId: 1, question: "Explain the difference between stack and heap memory.", category: "Technical", difficulty: "Easy", modelAnswer: "Stack: LIFO, stores function calls/local vars, fixed size. Heap: dynamic allocation, larger, slower access.", attempts: 45 },
  { id: 2, companyId: 1, question: "What is a binary search tree? Write code to insert a node.", category: "Coding", difficulty: "Med", modelAnswer: "BST: left < root < right. Insert by comparing and traversing until null position found.", attempts: 32 },
  { id: 3, companyId: 2, question: "Tell me about yourself.", category: "HR", difficulty: "Easy", modelAnswer: "Structured response: Background → Education → Skills → Why this company.", attempts: 67 },
  { id: 4, companyId: 2, question: "Solve: Find duplicate numbers in an array in O(n) time.", category: "Aptitude", difficulty: "Med", modelAnswer: "Use a HashSet: iterate, if element exists it's a duplicate. Time O(n), Space O(n).", attempts: 28 },
  { id: 5, companyId: 5, question: "Explain derivatives and options in simple terms.", category: "Technical", difficulty: "Hard", modelAnswer: "Derivative: contract deriving value from underlying asset. Option: right (not obligation) to buy/sell at set price.", attempts: 15 },
  { id: 6, companyId: 6, question: "Design a URL shortener like bit.ly.", category: "Coding", difficulty: "Hard", modelAnswer: "Components: URL hash generation (MD5/Base62), key-value store, redirect service, analytics.", attempts: 22 },
];

export const mockForumPosts = [
  { id: 1, category: "Doubt", title: "How to approach DBMS normalization questions in exam?", body: "I keep confusing 2NF and 3NF. Any tricks to remember?", author: "Rohan S", university: "Mumbai University", upvotes: 47, comments: 12, tags: "dbms,normalization,exam", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2) },
  { id: 2, category: "Resource", title: "Best YouTube channels for DSA preparation [Updated 2024]", body: "CodeWithHarry, Love Babbar's DSA playlist, and Apna College are my top picks. Links inside!", author: "Priya M", university: "Pune University", upvotes: 134, comments: 28, tags: "dsa,youtube,resources", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8) },
  { id: 3, category: "Discussion", title: "TCS NQT exam experience – Nov 2024", body: "Just gave the TCS NQT. Questions were mostly on verbal ability, quant, and programming logic. Sharing my experience.", author: "Amit K", university: "Nagpur University", upvotes: 89, comments: 34, tags: "tcs,placement,experience", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24) },
  { id: 4, category: "Announcement", title: "Mumbai University Sem 4 Results Declared!", body: "Results are live on the official portal. Good luck everyone!", author: "Admin", university: "Mumbai University", upvotes: 203, comments: 67, tags: "results,mumbai-university", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2) },
];

export const mockLeaderboard = [
  { id: 1, rank: 1, name: "Ananya Desai", university: "Mumbai University", points: 2840, badges: 8, avatar: "🏆" },
  { id: 2, rank: 2, name: "Rahul More", university: "Pune University", points: 2456, badges: 6, avatar: "🥈" },
  { id: 3, rank: 3, name: "Priya Kulkarni", university: "Mumbai University", points: 2102, badges: 5, avatar: "🥉" },
  { id: 4, rank: 4, name: "Sameer Joshi", university: "Nagpur University", points: 1893, badges: 4, avatar: "⭐" },
  { id: 5, rank: 5, name: "Meera Shah", university: "Pune University", points: 1744, badges: 3, avatar: "🌟" },
];

export const mockResume = {
  id: 1,
  fullName: "",
  headline: "",
  email: "",
  phone: "",
  address: "",
  linkedin: "",
  github: "",
  portfolio: "",
  summary: "",
  education: "",
  skills: "",
  projects: "",
  experience: "",
  certificates: "",
  languages: "",
  aiScore: 0,
  aiFeedback: "",
  updatedAt: new Date(),
};
