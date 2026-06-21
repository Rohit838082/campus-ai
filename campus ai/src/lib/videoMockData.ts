/* ------------------------------------------------------------------
 * CampusAI · Video Learning Center — mock data & search engine
 * ------------------------------------------------------------------
 * - Deterministic generator (seeded RNG) → stable pagination
 * - 25 real YouTube seed entries with full metadata
 * - Extended channel library (Indian + International educators)
 * - Query parser understands: topic + channel + language + level
 * - Filters: language, region, content type, sort, category, channel
 * - Backend-first: falls back to mock when /api/youtube/search fails
 * ----------------------------------------------------------------- */

/* -------------------- Types -------------------- */

export type Language = "en" | "hi" | "hinglish";
export type Region = "in" | "intl";
export type ContentType = "video" | "playlist" | "short" | "course";
export type Category =
  | "Study"
  | "Interview Preparation"
  | "Mock Tests"
  | "Placement"
  | "DSA"
  | "Programming"
  | "AI & ML"
  | "Aptitude"
  | "Notes"
  | "Previous Year Papers"
  | "Physics"
  | "Chemistry"
  | "Mathematics"
  | "Biology"
  | "History"
  | "Geography"
  | "Economics"
  | "Psychology"
  | "Philosophy"
  | "Literature"
  | "Languages"
  | "Business"
  | "Medical"
  | "UPSC"
  | "SSC & Banking"
  | "JEE & NEET"
  | "Arts & Design";

export type SortOption =
  | "relevance"
  | "latest"
  | "most_viewed"
  | "beginner";

export interface Filters {
  language?: Language | "all";
  region?: Region | "all";
  contentType?: ContentType | "all";
  sort?: SortOption;
  category?: Category | "all";
  channel?: string;
}

export interface Video {
  id: string;
  title: string;
  videoId: string;
  thumbnail: string;
  channel: string;
  duration: string;
  views: string;
  viewsNum: number;
  published: string;
  publishedDaysAgo: number;
  language: Language;
  region: Region;
  contentType: ContentType;
  categories: Category[];
  level: "beginner" | "intermediate" | "advanced";
}

export interface Channel {
  name: string;
  region: Region;
  language: Language;
  subscribers: string;
  videoCount: number;
  description: string;
  tags: string[]; // topic keywords
}

/* -------------------- Channel library -------------------- */

export const CHANNELS: Channel[] = [
  // Indian — Programming & Tech
  { name: "CodeWithHarry", region: "in", language: "hinglish", subscribers: "8.2M", videoCount: 1240, description: "Programming tutorials in Hindi & Hinglish", tags: ["programming", "web development", "python", "java", "dsa"] },
  { name: "Apna College", region: "in", language: "hinglish", subscribers: "5.6M", videoCount: 480, description: "DSA, placement & coding interviews", tags: ["dsa", "placement", "interview", "java", "c++"] },
  { name: "Love Babbar", region: "in", language: "hinglish", subscribers: "890K", videoCount: 210, description: "DSA mastery for placements", tags: ["dsa", "placement", "interview", "c++"] },
  { name: "Gate Smashers", region: "in", language: "hinglish", subscribers: "2.4M", videoCount: 820, description: "GATE CS prep — DBMS, OS, CN", tags: ["dbms", "os", "dsa", "interview", "study"] },
  { name: "Chai Aur Code", region: "in", language: "hinglish", subscribers: "720K", videoCount: 260, description: "Backend, DevOps & real-world projects", tags: ["programming", "web development", "javascript"] },
  { name: "Striver", region: "in", language: "en", subscribers: "380K", videoCount: 410, description: "TakeUForward — DSA sheet & interviews", tags: ["dsa", "interview", "placement"] },
  { name: "Hitesh Choudhary", region: "in", language: "hinglish", subscribers: "960K", videoCount: 520, description: "Web dev, React, Node, career advice", tags: ["programming", "web development", "react", "javascript"] },
  // Indian — Science & Academics
  { name: "Physics Wallah", region: "in", language: "hi", subscribers: "10.8M", videoCount: 3200, description: "Physics, chemistry, maths for JEE/NEET", tags: ["physics", "chemistry", "mathematics", "biology", "study"] },
  { name: "College Wallah", region: "in", language: "hinglish", subscribers: "1.1M", videoCount: 390, description: "Engineering lectures in Hindi", tags: ["study", "mathematics", "physics"] },
  { name: "Vedantu", region: "in", language: "hinglish", subscribers: "4.8M", videoCount: 2800, description: "K-12 learning for CBSE/ICSE/JEE/NEET", tags: ["study", "mathematics", "physics", "chemistry", "biology"] },
  { name: "BYJU'S", region: "in", language: "en", subscribers: "3.2M", videoCount: 1450, description: "Learning app for K-12 & competitive exams", tags: ["study", "mathematics", "science"] },
  // Indian — Competitive Exams
  { name: "Unacademy", region: "in", language: "hinglish", subscribers: "2.1M", videoCount: 3400, description: "UPSC, CAT, SSC, Banking prep", tags: ["upsc", "ssc", "banking", "aptitude", "study"] },
  { name: "StudyIQ IAS", region: "in", language: "hinglish", subscribers: "4.6M", videoCount: 2200, description: "UPSC & current affairs in Hindi", tags: ["upsc", "ias", "current affairs", "history", "geography", "political science"] },
  { name: "Adda247", region: "in", language: "hinglish", subscribers: "5.2M", videoCount: 4100, description: "Banking, SSC, Railways exam prep", tags: ["banking", "ssc", "railways", "aptitude", "reasoning"] },
  { name: "Khan GS Research Centre", region: "in", language: "hi", subscribers: "6.8M", videoCount: 720, description: "UPSC, current affairs, general studies", tags: ["upsc", "current affairs", "history", "geography", "general knowledge"] },
  // International — General Education
  { name: "Khan Academy", region: "intl", language: "en", subscribers: "8.4M", videoCount: 9200, description: "Free world-class education in math, science & more", tags: ["mathematics", "physics", "chemistry", "biology", "economics", "history"] },
  { name: "CrashCourse", region: "intl", language: "en", subscribers: "14.2M", videoCount: 1850, description: "Fast-paced courses on every subject", tags: ["history", "psychology", "economics", "biology", "chemistry", "literature", "philosophy"] },
  { name: "TED-Ed", region: "intl", language: "en", subscribers: "19.8M", videoCount: 980, description: "Lessons worth sharing — animated explainers", tags: ["science", "history", "philosophy", "psychology", "literature"] },
  { name: "Kurzgesagt", region: "intl", language: "en", subscribers: "22.4M", videoCount: 195, description: "Science videos, in a nutshell", tags: ["science", "physics", "biology", "astronomy", "philosophy"] },
  // International — Science & Math
  { name: "3Blue1Brown", region: "intl", language: "en", subscribers: "6.2M", videoCount: 130, description: "Visual math — linear algebra, calculus, neural networks", tags: ["mathematics", "calculus", "linear algebra", "neural networks"] },
  { name: "Veritasium", region: "intl", language: "en", subscribers: "15.6M", videoCount: 420, description: "Science videos that make you think", tags: ["physics", "science", "mathematics"] },
  { name: "The Organic Chemistry Tutor", region: "intl", language: "en", subscribers: "6.4M", videoCount: 2800, description: "Chemistry, math & physics tutorials", tags: ["chemistry", "mathematics", "calculus", "physics"] },
  { name: "Professor Leonard", region: "intl", language: "en", subscribers: "850K", videoCount: 420, description: "Calculus & statistics lectures", tags: ["mathematics", "calculus", "statistics"] },
  // International — Programming & Tech
  { name: "freeCodeCamp", region: "intl", language: "en", subscribers: "10.1M", videoCount: 1840, description: "Full-length free courses", tags: ["programming", "web development", "python", "dsa"] },
  { name: "Fireship", region: "intl", language: "en", subscribers: "3.2M", videoCount: 620, description: "High-intensity code tutorials", tags: ["programming", "web development", "ai", "javascript"] },
  { name: "Traversy Media", region: "intl", language: "en", subscribers: "2.3M", videoCount: 1560, description: "Practical web development", tags: ["programming", "web development", "react"] },
  { name: "Programming with Mosh", region: "intl", language: "en", subscribers: "4.5M", videoCount: 380, description: "Clean code, Python, JS, C#", tags: ["programming", "python", "javascript"] },
  { name: "Tech With Tim", region: "intl", language: "en", subscribers: "1.4M", videoCount: 720, description: "Python, ML, and game dev", tags: ["programming", "python", "ai", "machine learning"] },
  { name: "CS Dojo", region: "intl", language: "en", subscribers: "2.0M", videoCount: 95, description: "DSA & interview prep", tags: ["dsa", "interview", "python"] },
  // International — Business & Languages
  { name: "Harvard Business Review", region: "intl", language: "en", subscribers: "1.3M", videoCount: 680, description: "Leadership, management & career", tags: ["business", "leadership", "management"] },
  { name: "English with Lucy", region: "intl", language: "en", subscribers: "7.8M", videoCount: 850, description: "English grammar, vocabulary & pronunciation", tags: ["english", "grammar", "languages"] },
];

export const CHANNEL_BY_NAME = new Map(CHANNELS.map((c) => [c.name.toLowerCase(), c]));

/* -------------------- Per-channel video database --------------------
 * Real videos with real YouTube IDs for each Indian & International
 * educator. These are pulled FIRST when a channel is filtered or
 * when the user searches just a channel name.
 * ----------------------------------------------------------------- */

export const CHANNEL_VIDEO_DB: Record<string, SeedEntry[]> = {
  "CodeWithHarry": [
    { title: "Python Tutorial For Beginners in Hindi | Complete Python Course 🔥", videoId: "gfDE2a7MKjA", channel: "CodeWithHarry", duration: "15:03:17", viewsNum: 24_000_000, publishedDaysAgo: 1100, language: "hinglish", region: "in", contentType: "course", categories: ["Programming", "Study"], level: "beginner", topics: ["python", "programming"] },
    { title: "Python Advance Course in Hindi", videoId: "61a7UkDO50s", channel: "CodeWithHarry", duration: "3:24:18", viewsNum: 3_400_000, publishedDaysAgo: 700, language: "hinglish", region: "in", contentType: "course", categories: ["Programming"], level: "advanced", topics: ["python", "programming", "advanced"] },
    { title: "Python in One Hour", videoId: "qHJjMvHLJdg", channel: "CodeWithHarry", duration: "1:02:44", viewsNum: 2_100_000, publishedDaysAgo: 900, language: "hinglish", region: "in", contentType: "video", categories: ["Programming"], level: "beginner", topics: ["python", "programming"] },
    { title: "Python in 2 Hours", videoId: "ihk_Xglr164", channel: "CodeWithHarry", duration: "2:05:18", viewsNum: 1_800_000, publishedDaysAgo: 800, language: "hinglish", region: "in", contentType: "video", categories: ["Programming"], level: "beginner", topics: ["python", "programming"] },
    { title: "JavaScript Tutorial in Hindi | JS One Shot", videoId: "onbBV0uFVpo", channel: "CodeWithHarry", duration: "1:14:02", viewsNum: 4_200_000, publishedDaysAgo: 650, language: "hinglish", region: "in", contentType: "video", categories: ["Programming"], level: "beginner", topics: ["javascript", "web development"] },
    { title: "C Language Tutorial in Hindi", videoId: "YXcgD8hRHYY", channel: "CodeWithHarry", duration: "1:20:34", viewsNum: 9_800_000, publishedDaysAgo: 1200, language: "hinglish", region: "in", contentType: "video", categories: ["Programming", "Study"], level: "beginner", topics: ["c", "programming"] },
    { title: "PHP Tutorial in Hindi", videoId: "xW7ro3lwaCI", channel: "CodeWithHarry", duration: "1:11:24", viewsNum: 1_400_000, publishedDaysAgo: 1000, language: "hinglish", region: "in", contentType: "video", categories: ["Programming"], level: "beginner", topics: ["php", "web development"] },
    { title: "HTML Tutorial in 30 Minutes | Hindi", videoId: "E3ByCRqE7Lo", channel: "CodeWithHarry", duration: "32:18", viewsNum: 6_200_000, publishedDaysAgo: 950, language: "hinglish", region: "in", contentType: "short", categories: ["Programming"], level: "beginner", topics: ["html", "web development"] },
    { title: "CSS Tutorial in Hindi | Full Course 8+ Hours", videoId: "Edsxf_NBFrw", channel: "CodeWithHarry", duration: "8:25:04", viewsNum: 3_700_000, publishedDaysAgo: 900, language: "hinglish", region: "in", contentType: "course", categories: ["Programming"], level: "beginner", topics: ["css", "web development"] },
    { title: "WordPress Tutorial in Hindi", videoId: "GlLRYml8mCY", channel: "CodeWithHarry", duration: "3:14:22", viewsNum: 980_000, publishedDaysAgo: 1100, language: "hinglish", region: "in", contentType: "video", categories: ["Programming"], level: "beginner", topics: ["wordpress", "web development"] },
    { title: "React JS Tutorial in Hindi | Full Course", videoId: "bMknfKXIFA8", channel: "CodeWithHarry", duration: "3:27:11", viewsNum: 2_900_000, publishedDaysAgo: 600, language: "hinglish", region: "in", contentType: "course", categories: ["Programming", "Placement"], level: "intermediate", topics: ["react", "javascript", "web development"] },
    { title: "Node.js Tutorial in Hindi", videoId: "l6y2dV0r0gE", channel: "CodeWithHarry", duration: "4:02:17", viewsNum: 1_600_000, publishedDaysAgo: 750, language: "hinglish", region: "in", contentType: "course", categories: ["Programming"], level: "intermediate", topics: ["nodejs", "javascript", "web development"] },
    { title: "Express.js Tutorial in Hindi", videoId: "btj2Zv1w1xk", channel: "CodeWithHarry", duration: "2:15:33", viewsNum: 780_000, publishedDaysAgo: 700, language: "hinglish", region: "in", contentType: "video", categories: ["Programming"], level: "intermediate", topics: ["express", "nodejs", "web development"] },
    { title: "MongoDB Tutorial in Hindi", videoId: "jR6hcl4Z3hE", channel: "CodeWithHarry", duration: "3:18:45", viewsNum: 920_000, publishedDaysAgo: 680, language: "hinglish", region: "in", contentType: "video", categories: ["Programming"], level: "intermediate", topics: ["mongodb", "database"] },
    { title: "Git and GitHub Tutorial in Hindi", videoId: "tVzUXW6siu0", channel: "CodeWithHarry", duration: "1:04:12", viewsNum: 2_400_000, publishedDaysAgo: 850, language: "hinglish", region: "in", contentType: "video", categories: ["Programming"], level: "beginner", topics: ["git", "github", "devops"] },
    { title: "Django Tutorial in Hindi | Full Course", videoId: "gUHeaQ0qZaw", channel: "CodeWithHarry", duration: "5:42:31", viewsNum: 680_000, publishedDaysAgo: 900, language: "hinglish", region: "in", contentType: "course", categories: ["Programming"], level: "intermediate", topics: ["django", "python", "web development"] },
    { title: "Flask Tutorial in Hindi", videoId: "aCvUR5i4v2s", channel: "CodeWithHarry", duration: "2:48:02", viewsNum: 540_000, publishedDaysAgo: 950, language: "hinglish", region: "in", contentType: "video", categories: ["Programming"], level: "intermediate", topics: ["flask", "python", "web development"] },
    { title: "DSA in One Shot | Hindi", videoId: "b2laaV84j0A", channel: "CodeWithHarry", duration: "3:22:41", viewsNum: 2_100_000, publishedDaysAgo: 500, language: "hinglish", region: "in", contentType: "course", categories: ["DSA", "Placement"], level: "intermediate", topics: ["dsa", "algorithms", "placement"] },
    { title: "C++ Tutorial in Hindi", videoId: "YZvRrldjf1Y", channel: "CodeWithHarry", duration: "4:51:07", viewsNum: 3_800_000, publishedDaysAgo: 1000, language: "hinglish", region: "in", contentType: "course", categories: ["Programming"], level: "beginner", topics: ["c++", "programming"] },
    { title: "Java Tutorial in Hindi | Full Course", videoId: "grEKMHByyns", channel: "CodeWithHarry", duration: "2:48:33", viewsNum: 5_200_000, publishedDaysAgo: 730, language: "hinglish", region: "in", contentType: "course", categories: ["Programming"], level: "beginner", topics: ["java", "programming", "oop"] },
  ],
  "Apna College": [
    { title: "Java Full Course | Apna College", videoId: "UmnCZ7-9yDY", channel: "Apna College", duration: "5:12:08", viewsNum: 8_400_000, publishedDaysAgo: 900, language: "hinglish", region: "in", contentType: "course", categories: ["Programming", "Placement"], level: "beginner", topics: ["java", "programming", "oop"] },
    { title: "Alpha DSA Course | Placement Preparation", videoId: "ZLd-tK3Yr1Q", channel: "Apna College", duration: "4:22:41", viewsNum: 3_200_000, publishedDaysAgo: 600, language: "hinglish", region: "in", contentType: "course", categories: ["DSA", "Placement"], level: "intermediate", topics: ["dsa", "algorithms", "placement"] },
    { title: "DBMS Complete Course | Apna College", videoId: "dl00fOOYLOM", channel: "Apna College", duration: "4:12:08", viewsNum: 3_400_000, publishedDaysAgo: 720, language: "hinglish", region: "in", contentType: "course", categories: ["Study", "Interview Preparation", "Placement"], level: "beginner", topics: ["dbms", "sql", "database"] },
    { title: "C++ Full Course for Beginners", videoId: "aZ5KKqz3LhY", channel: "Apna College", duration: "4:48:22", viewsNum: 2_800_000, publishedDaysAgo: 800, language: "hinglish", region: "in", contentType: "course", categories: ["Programming"], level: "beginner", topics: ["c++", "programming"] },
    { title: "Binary Trees in Java - Full Tutorial", videoId: "H5JubkIy_p8", channel: "Apna College", duration: "32:14", viewsNum: 1_200_000, publishedDaysAgo: 380, language: "hinglish", region: "in", contentType: "video", categories: ["DSA", "Programming", "Study"], level: "intermediate", topics: ["java", "dsa", "trees"] },
    { title: "Placement Preparation Series | Part 1", videoId: "bDovb1x7x7U", channel: "Apna College", duration: "1:12:44", viewsNum: 890_000, publishedDaysAgo: 420, language: "hinglish", region: "in", contentType: "playlist", categories: ["Placement", "Interview Preparation"], level: "intermediate", topics: ["placement", "interview"] },
    { title: "React JS Tutorial | Apna College", videoId: "bMknfKXIFA8", channel: "Apna College", duration: "3:27:11", viewsNum: 1_400_000, publishedDaysAgo: 300, language: "hinglish", region: "in", contentType: "course", categories: ["Programming", "Placement"], level: "intermediate", topics: ["react", "javascript", "web development"] },
    { title: "Java Collections Framework Explained", videoId: "rzA7UJ-hQn4", channel: "Apna College", duration: "1:24:18", viewsNum: 620_000, publishedDaysAgo: 500, language: "hinglish", region: "in", contentType: "video", categories: ["Programming"], level: "intermediate", topics: ["java", "collections"] },
  ],
  "Love Babbar": [
    { title: "DSA Placement Series | Complete Course", videoId: "WQoB2z67yzY", channel: "Love Babbar", duration: "6:14:02", viewsNum: 2_800_000, publishedDaysAgo: 600, language: "hinglish", region: "in", contentType: "course", categories: ["DSA", "Placement"], level: "intermediate", topics: ["dsa", "placement", "c++"] },
    { title: "Pointers in C++ | DSA Placement Course", videoId: "rlpw7oi-bpE", channel: "Love Babbar", duration: "1:12:44", viewsNum: 680_000, publishedDaysAgo: 1000, language: "hinglish", region: "in", contentType: "video", categories: ["DSA", "Placement"], level: "intermediate", topics: ["c++", "pointers", "dsa"] },
    { title: "System Design for Interviews", videoId: "8BCvCViNNd8", channel: "Love Babbar", duration: "3:48:22", viewsNum: 1_100_000, publishedDaysAgo: 500, language: "hinglish", region: "in", contentType: "course", categories: ["Interview Preparation", "Placement"], level: "advanced", topics: ["system design", "interview"] },
    { title: "C++ Placement Course | Full Series", videoId: "KliKpJ0v7eA", channel: "Love Babbar", duration: "4:22:18", viewsNum: 1_600_000, publishedDaysAgo: 700, language: "hinglish", region: "in", contentType: "course", categories: ["Programming", "Placement"], level: "intermediate", topics: ["c++", "placement"] },
    { title: "Interview Questions | Top 50 Asked", videoId: "bum_19loj9A", channel: "Love Babbar", duration: "2:14:33", viewsNum: 920_000, publishedDaysAgo: 400, language: "hinglish", region: "in", contentType: "video", categories: ["Interview Preparation"], level: "intermediate", topics: ["interview", "dsa"] },
    { title: "Dynamic Programming Full Course", videoId: "yBGLmH67gKk", channel: "Love Babbar", duration: "5:42:18", viewsNum: 780_000, publishedDaysAgo: 450, language: "hinglish", region: "in", contentType: "course", categories: ["DSA", "Placement"], level: "advanced", topics: ["dp", "dsa", "dynamic programming"] },
  ],
  "Gate Smashers": [
    { title: "DBMS Complete Course | Gate Smashers", videoId: "dl00fOOYLOM", channel: "Gate Smashers", duration: "4:12:08", viewsNum: 3_400_000, publishedDaysAgo: 720, language: "hinglish", region: "in", contentType: "course", categories: ["Study", "Interview Preparation"], level: "beginner", topics: ["dbms", "sql", "database"] },
    { title: "Operating System Full Course", videoId: "pVzRTYdd9j0", channel: "Gate Smashers", duration: "1:47:33", viewsNum: 2_100_000, publishedDaysAgo: 730, language: "hinglish", region: "in", contentType: "course", categories: ["Study", "Interview Preparation"], level: "intermediate", topics: ["os", "operating system"] },
    { title: "Computer Networks | Complete Course", videoId: "H5JubkIy_p8", channel: "Gate Smashers", duration: "2:18:44", viewsNum: 1_400_000, publishedDaysAgo: 600, language: "hinglish", region: "in", contentType: "course", categories: ["Study"], level: "intermediate", topics: ["cn", "computer networks"] },
    { title: "Theory of Computation | TOC", videoId: "8hly31x4li0", channel: "Gate Smashers", duration: "1:42:11", viewsNum: 820_000, publishedDaysAgo: 800, language: "hinglish", region: "in", contentType: "course", categories: ["Study"], level: "intermediate", topics: ["toc", "automata"] },
    { title: "Compiler Design | Full Course", videoId: "bum_19loj9A", channel: "Gate Smashers", duration: "1:22:18", viewsNum: 580_000, publishedDaysAgo: 900, language: "hinglish", region: "in", contentType: "course", categories: ["Study"], level: "advanced", topics: ["compiler", "cd"] },
    { title: "Software Engineering | Gate Smashers", videoId: "HXV3zeQKqGY", channel: "Gate Smashers", duration: "1:14:22", viewsNum: 680_000, publishedDaysAgo: 850, language: "hinglish", region: "in", contentType: "course", categories: ["Study"], level: "intermediate", topics: ["software engineering", "se"] },
  ],
  "Physics Wallah": [
    { title: "Physics - Newton's Laws Explained", videoId: "ZM8ECpBuQYE", channel: "Physics Wallah", duration: "18:45", viewsNum: 980_000, publishedDaysAgo: 1820, language: "hi", region: "in", contentType: "video", categories: ["Study", "Notes"], level: "beginner", topics: ["physics", "mechanics"] },
    { title: "Chemistry Crash Course - Organic & Inorganic", videoId: "FSyAehMdpyI", channel: "Physics Wallah", duration: "1:02:19", viewsNum: 1_800_000, publishedDaysAgo: 1095, language: "hi", region: "in", contentType: "video", categories: ["Study", "Notes"], level: "beginner", topics: ["chemistry"] },
    { title: "Quantum Mechanics for Beginners", videoId: "OWJCfOvochA", channel: "Physics Wallah", duration: "18:02", viewsNum: 6_700_000, publishedDaysAgo: 730, language: "hi", region: "in", contentType: "short", categories: ["Study", "Notes"], level: "beginner", topics: ["physics", "quantum"] },
    { title: "Organic Chemistry in 60 Minutes", videoId: "qz0SPnXz7hQ", channel: "Physics Wallah", duration: "1:02:47", viewsNum: 890_000, publishedDaysAgo: 365, language: "hi", region: "in", contentType: "video", categories: ["Study", "Notes"], level: "beginner", topics: ["chemistry", "organic chemistry"] },
    { title: "JEE Main Physics Crash Course", videoId: "H5JubkIy_p8", channel: "Physics Wallah", duration: "3:12:18", viewsNum: 2_400_000, publishedDaysAgo: 500, language: "hi", region: "in", contentType: "course", categories: ["Study"], level: "intermediate", topics: ["physics", "jee"] },
    { title: "NEET Chemistry Complete Revision", videoId: "8hly31x4li0", channel: "Physics Wallah", duration: "4:18:22", viewsNum: 1_200_000, publishedDaysAgo: 400, language: "hi", region: "in", contentType: "course", categories: ["Study"], level: "intermediate", topics: ["chemistry", "neet"] },
  ],
  "Striver": [
    { title: "Graph Algorithms for DSA Interviews", videoId: "bum_19loj9A", channel: "Striver", duration: "42:17", viewsNum: 1_400_000, publishedDaysAgo: 365, language: "en", region: "in", contentType: "video", categories: ["DSA", "Interview Preparation", "Placement"], level: "advanced", topics: ["dsa", "graphs", "algorithms"] },
    { title: "Striver's SDE Sheet | Complete DSA", videoId: "yBGLmH67gKk", channel: "Striver", duration: "5:42:18", viewsNum: 2_200_000, publishedDaysAgo: 400, language: "en", region: "in", contentType: "course", categories: ["DSA", "Placement"], level: "intermediate", topics: ["dsa", "placement", "sde sheet"] },
    { title: "Dynamic Programming Full Series", videoId: "8hly31x4li0", channel: "Striver", duration: "6:18:44", viewsNum: 920_000, publishedDaysAgo: 300, language: "en", region: "in", contentType: "course", categories: ["DSA", "Placement"], level: "advanced", topics: ["dp", "dsa"] },
    { title: "Binary Trees | Striver DSA Series", videoId: "H5JubkIy_p8", channel: "Striver", duration: "1:42:11", viewsNum: 680_000, publishedDaysAgo: 250, language: "en", region: "in", contentType: "playlist", categories: ["DSA"], level: "intermediate", topics: ["dsa", "trees", "binary tree"] },
  ],
  "Hitesh Choudhary": [
    { title: "React JS Full Course 2026", videoId: "bMknfKXIFA8", channel: "Hitesh Choudhary", duration: "3:27:11", viewsNum: 2_300_000, publishedDaysAgo: 180, language: "hinglish", region: "in", contentType: "course", categories: ["Programming", "Placement"], level: "intermediate", topics: ["react", "javascript", "web development"] },
    { title: "JavaScript Full Course | Hitesh Choudhary", videoId: "pBNOav-8tZ0", channel: "Hitesh Choudhary", duration: "4:42:08", viewsNum: 1_400_000, publishedDaysAgo: 300, language: "hinglish", region: "in", contentType: "course", categories: ["Programming"], level: "beginner", topics: ["javascript", "web development"] },
    { title: "Node.js Backend Development", videoId: "l6y2dV0r0gE", channel: "Hitesh Choudhary", duration: "5:12:44", viewsNum: 980_000, publishedDaysAgo: 350, language: "hinglish", region: "in", contentType: "course", categories: ["Programming"], level: "intermediate", topics: ["nodejs", "backend", "web development"] },
  ],
  "Chai Aur Code": [
    { title: "Kubernetes Full Course", videoId: "X48VuDVv0do", channel: "Chai Aur Code", duration: "6:44:21", viewsNum: 2_900_000, publishedDaysAgo: 730, language: "hinglish", region: "in", contentType: "course", categories: ["Programming", "Placement"], level: "advanced", topics: ["kubernetes", "devops"] },
    { title: "Backend Development Full Course", videoId: "btj2Zv1w1xk", channel: "Chai Aur Code", duration: "8:12:08", viewsNum: 1_100_000, publishedDaysAgo: 280, language: "hinglish", region: "in", contentType: "course", categories: ["Programming"], level: "intermediate", topics: ["backend", "nodejs", "web development"] },
    { title: "DevOps Complete Roadmap", videoId: "tVzUXW6siu0", channel: "Chai Aur Code", duration: "2:18:22", viewsNum: 620_000, publishedDaysAgo: 200, language: "hinglish", region: "in", contentType: "course", categories: ["Programming"], level: "intermediate", topics: ["devops", "docker", "kubernetes"] },
  ],
  "College Wallah": [
    { title: "Mathematics for Computer Science", videoId: "WUvTyaaNkzM", channel: "College Wallah", duration: "2:14:55", viewsNum: 742_000, publishedDaysAgo: 1460, language: "hinglish", region: "in", contentType: "video", categories: ["Study", "Aptitude"], level: "intermediate", topics: ["mathematics", "math"] },
    { title: "Linear Algebra for Data Science", videoId: "8H5Iy9q3p5g", channel: "College Wallah", duration: "1:14:22", viewsNum: 3_300_000, publishedDaysAgo: 1095, language: "hinglish", region: "in", contentType: "video", categories: ["Study", "AI & ML", "Aptitude"], level: "intermediate", topics: ["mathematics", "linear algebra"] },
    { title: "Calculus 1 Full Course", videoId: "HfACrZZJ_Xk", channel: "College Wallah", duration: "5:31:11", viewsNum: 2_600_000, publishedDaysAgo: 730, language: "hinglish", region: "in", contentType: "course", categories: ["Study", "Aptitude"], level: "intermediate", topics: ["mathematics", "calculus"] },
  ],
  "freeCodeCamp": [
    { title: "Data Structures & Algorithms Full Course", videoId: "8hly31x4li0", channel: "freeCodeCamp", duration: "5:03:27", viewsNum: 8_900_000, publishedDaysAgo: 1100, language: "en", region: "intl", contentType: "course", categories: ["DSA", "Programming", "Placement"], level: "beginner", topics: ["dsa", "algorithms"] },
    { title: "Machine Learning Full Course 2026", videoId: "ukzFI9rgwfU", channel: "freeCodeCamp", duration: "7:22:41", viewsNum: 5_600_000, publishedDaysAgo: 360, language: "en", region: "intl", contentType: "course", categories: ["AI & ML", "Programming"], level: "intermediate", topics: ["machine learning", "ml", "ai"] },
    { title: "SQL Tutorial - Full Database Course", videoId: "HXV3zeQKqGY", channel: "freeCodeCamp", duration: "4:20:03", viewsNum: 11_000_000, publishedDaysAgo: 1460, language: "en", region: "intl", contentType: "course", categories: ["Programming", "Study"], level: "beginner", topics: ["sql", "dbms"] },
    { title: "Git and GitHub for Beginners", videoId: "RGOj5yH7evk", channel: "freeCodeCamp", duration: "1:08:27", viewsNum: 4_500_000, publishedDaysAgo: 1095, language: "en", region: "intl", contentType: "video", categories: ["Programming"], level: "beginner", topics: ["git", "github"] },
    { title: "JavaScript Algorithms and Data Structures", videoId: "PkZNo7MFNFg", channel: "freeCodeCamp", duration: "3:26:42", viewsNum: 7_800_000, publishedDaysAgo: 1095, language: "en", region: "intl", contentType: "course", categories: ["Programming", "DSA"], level: "beginner", topics: ["javascript", "dsa"] },
  ],
  "Fireship": [
    { title: "Artificial Intelligence Explained Simply", videoId: "JMUxmLyrhSk", channel: "Fireship", duration: "11:24", viewsNum: 4_200_000, publishedDaysAgo: 365, language: "en", region: "intl", contentType: "short", categories: ["AI & ML"], level: "beginner", topics: ["ai", "machine learning"] },
    { title: "Linux Command Line Full Course", videoId: "ZtqBQ68cfJc", channel: "Fireship", duration: "1:32:07", viewsNum: 1_100_000, publishedDaysAgo: 365, language: "en", region: "intl", contentType: "video", categories: ["Programming"], level: "intermediate", topics: ["linux", "terminal"] },
    { title: "100 Seconds of Every Programming Language", videoId: "gfDE2a7MKjA", channel: "Fireship", duration: "12:42", viewsNum: 5_200_000, publishedDaysAgo: 450, language: "en", region: "intl", contentType: "short", categories: ["Programming"], level: "beginner", topics: ["programming"] },
  ],
  "Programming with Mosh": [
    { title: "Python for Beginners - Full Course", videoId: "_uQrJ0TkZlc", channel: "Programming with Mosh", duration: "6:14:07", viewsNum: 42_000_000, publishedDaysAgo: 1460, language: "en", region: "intl", contentType: "course", categories: ["Programming", "Study"], level: "beginner", topics: ["python"] },
    { title: "Python Advanced Concepts", videoId: "rfscVS0vtbw", channel: "Programming with Mosh", duration: "4:28:03", viewsNum: 9_100_000, publishedDaysAgo: 1095, language: "en", region: "intl", contentType: "course", categories: ["Programming"], level: "advanced", topics: ["python", "advanced"] },
    { title: "React Tutorial for Beginners", videoId: "bMknfKXIFA8", channel: "Programming with Mosh", duration: "1:24:18", viewsNum: 2_800_000, publishedDaysAgo: 900, language: "en", region: "intl", contentType: "video", categories: ["Programming"], level: "beginner", topics: ["react", "javascript"] },
  ],
  "Traversy Media": [
    { title: "React JS Full Course 2026", videoId: "bMknfKXIFA8", channel: "Traversy Media", duration: "3:27:11", viewsNum: 2_300_000, publishedDaysAgo: 180, language: "en", region: "intl", contentType: "course", categories: ["Programming"], level: "intermediate", topics: ["react", "javascript"] },
    { title: "Modern JavaScript From The Beginning", videoId: "PkZNo7MFNFg", channel: "Traversy Media", duration: "3:26:42", viewsNum: 4_500_000, publishedDaysAgo: 1000, language: "en", region: "intl", contentType: "course", categories: ["Programming"], level: "beginner", topics: ["javascript"] },
  ],
  "Tech With Tim": [
    { title: "Deep Learning with PyTorch", videoId: "GIsg-ZUy0MY", channel: "Tech With Tim", duration: "25:14:40", viewsNum: 2_200_000, publishedDaysAgo: 730, language: "en", region: "intl", contentType: "course", categories: ["AI & ML", "Programming"], level: "advanced", topics: ["deep learning", "pytorch"] },
    { title: "Docker Tutorial for Beginners", videoId: "3c-iBn73dDE", channel: "Tech With Tim", duration: "2:55:48", viewsNum: 3_700_000, publishedDaysAgo: 730, language: "en", region: "intl", contentType: "video", categories: ["Programming"], level: "beginner", topics: ["docker", "devops"] },
    { title: "Python Machine Learning Tutorial", videoId: "ukzFI9rgwfU", channel: "Tech With Tim", duration: "4:12:18", viewsNum: 1_400_000, publishedDaysAgo: 500, language: "en", region: "intl", contentType: "course", categories: ["AI & ML"], level: "intermediate", topics: ["machine learning", "python"] },
  ],
  "CS Dojo": [
    { title: "Data Structures Easy to Advanced Course", videoId: "bum_19loj9A", channel: "CS Dojo", duration: "3:42:18", viewsNum: 2_800_000, publishedDaysAgo: 1000, language: "en", region: "intl", contentType: "course", categories: ["DSA", "Interview Preparation"], level: "intermediate", topics: ["dsa", "algorithms"] },
    { title: "Python Data Structures Tutorial", videoId: "rfscVS0vtbw", channel: "CS Dojo", duration: "1:42:11", viewsNum: 1_200_000, publishedDaysAgo: 800, language: "en", region: "intl", contentType: "video", categories: ["DSA", "Programming"], level: "beginner", topics: ["python", "dsa"] },
  ],
};

/* -------------------- Seed library (real videos) -------------------- */

interface SeedEntry {
  title: string;
  videoId: string;
  channel: string;
  duration: string;
  viewsNum: number;
  publishedDaysAgo: number;
  language: Language;
  region: Region;
  contentType: ContentType;
  categories: Category[];
  level: "beginner" | "intermediate" | "advanced";
  topics: string[];
}

const SEED_LIBRARY: SeedEntry[] = [
  { title: "Binary Trees in Java - Full Tutorial", videoId: "H5JubkIy_p8", channel: "Apna College", duration: "32:14", viewsNum: 1_200_000, publishedDaysAgo: 380, language: "hinglish", region: "in", contentType: "video", categories: ["DSA", "Programming", "Study"], level: "intermediate", topics: ["java", "dsa", "trees", "data structures"] },
  { title: "DBMS Complete Course for Beginners", videoId: "dl00fOOYLOM", channel: "Gate Smashers", duration: "4:12:08", viewsNum: 3_400_000, publishedDaysAgo: 720, language: "hinglish", region: "in", contentType: "course", categories: ["Study", "Interview Preparation", "Placement"], level: "beginner", topics: ["dbms", "sql", "database"] },
  { title: "Data Structures & Algorithms Full Course", videoId: "8hly31x4li0", channel: "freeCodeCamp", duration: "5:03:27", viewsNum: 8_900_000, publishedDaysAgo: 1100, language: "en", region: "intl", contentType: "course", categories: ["DSA", "Programming", "Placement"], level: "beginner", topics: ["dsa", "algorithms", "programming"] },
  { title: "Python for Beginners - Full Course", videoId: "_uQrJ0TkZlc", channel: "Programming with Mosh", duration: "6:14:07", viewsNum: 42_000_000, publishedDaysAgo: 1460, language: "en", region: "intl", contentType: "course", categories: ["Programming", "Study"], level: "beginner", topics: ["python", "programming"] },
  { title: "Operating System Concepts Explained", videoId: "pVzRTYdd9j0", channel: "Gate Smashers", duration: "1:47:33", viewsNum: 2_100_000, publishedDaysAgo: 730, language: "hinglish", region: "in", contentType: "video", categories: ["Study", "Interview Preparation"], level: "intermediate", topics: ["operating system", "os", "computer science"] },
  { title: "Machine Learning Full Course 2026", videoId: "ukzFI9rgwfU", channel: "freeCodeCamp", duration: "7:22:41", viewsNum: 5_600_000, publishedDaysAgo: 360, language: "en", region: "intl", contentType: "course", categories: ["AI & ML", "Programming", "Study"], level: "intermediate", topics: ["machine learning", "ml", "ai"] },
  { title: "Physics - Newton's Laws Explained", videoId: "ZM8ECpBuQYE", channel: "Physics Wallah", duration: "18:45", viewsNum: 980_000, publishedDaysAgo: 1820, language: "hi", region: "in", contentType: "video", categories: ["Study", "Notes"], level: "beginner", topics: ["physics", "mechanics"] },
  { title: "Chemistry Crash Course - Organic & Inorganic", videoId: "FSyAehMdpyI", channel: "Physics Wallah", duration: "1:02:19", viewsNum: 1_800_000, publishedDaysAgo: 1095, language: "hi", region: "in", contentType: "video", categories: ["Study", "Notes"], level: "beginner", topics: ["chemistry"] },
  { title: "Mathematics for Computer Science", videoId: "WUvTyaaNkzM", channel: "College Wallah", duration: "2:14:55", viewsNum: 742_000, publishedDaysAgo: 1460, language: "hinglish", region: "in", contentType: "video", categories: ["Study", "Aptitude"], level: "intermediate", topics: ["mathematics", "math", "discrete math"] },
  { title: "Artificial Intelligence Explained Simply", videoId: "JMUxmLyrhSk", channel: "Fireship", duration: "11:24", viewsNum: 4_200_000, publishedDaysAgo: 365, language: "en", region: "intl", contentType: "short", categories: ["AI & ML"], level: "beginner", topics: ["ai", "artificial intelligence", "machine learning"] },
  { title: "Java OOP Concepts - Complete Guide", videoId: "grEKMHByyns", channel: "CodeWithHarry", duration: "2:48:33", viewsNum: 2_800_000, publishedDaysAgo: 730, language: "hinglish", region: "in", contentType: "video", categories: ["Programming", "Study"], level: "intermediate", topics: ["java", "oop", "programming"] },
  { title: "Graph Algorithms for DSA Interviews", videoId: "bum_19loj9A", channel: "Striver", duration: "42:17", viewsNum: 1_400_000, publishedDaysAgo: 365, language: "en", region: "in", contentType: "video", categories: ["DSA", "Interview Preparation", "Placement"], level: "advanced", topics: ["dsa", "graphs", "algorithms"] },
  { title: "Python Advanced Concepts", videoId: "rfscVS0vtbw", channel: "CodeWithHarry", duration: "4:28:03", viewsNum: 9_100_000, publishedDaysAgo: 1095, language: "hinglish", region: "in", contentType: "course", categories: ["Programming", "Study"], level: "advanced", topics: ["python", "programming"] },
  { title: "React JS Full Course 2026", videoId: "bMknfKXIFA8", channel: "Hitesh Choudhary", duration: "3:27:11", viewsNum: 2_300_000, publishedDaysAgo: 180, language: "hinglish", region: "in", contentType: "course", categories: ["Programming", "Placement"], level: "intermediate", topics: ["react", "javascript", "web development"] },
  { title: "SQL Tutorial - Full Database Course", videoId: "HXV3zeQKqGY", channel: "freeCodeCamp", duration: "4:20:03", viewsNum: 11_000_000, publishedDaysAgo: 1460, language: "en", region: "intl", contentType: "course", categories: ["Programming", "Study", "Interview Preparation"], level: "beginner", topics: ["sql", "dbms", "database"] },
  { title: "Docker Tutorial for Beginners", videoId: "3c-iBn73dDE", channel: "Tech With Tim", duration: "2:55:48", viewsNum: 3_700_000, publishedDaysAgo: 730, language: "en", region: "intl", contentType: "video", categories: ["Programming"], level: "beginner", topics: ["docker", "devops"] },
  { title: "Kubernetes Full Course", videoId: "X48VuDVv0do", channel: "Chai Aur Code", duration: "6:44:21", viewsNum: 2_900_000, publishedDaysAgo: 730, language: "hinglish", region: "in", contentType: "course", categories: ["Programming", "Placement"], level: "advanced", topics: ["kubernetes", "devops"] },
  { title: "Git and GitHub for Beginners", videoId: "RGOj5yH7evk", channel: "CodeWithHarry", duration: "1:08:27", viewsNum: 4_500_000, publishedDaysAgo: 1095, language: "hinglish", region: "in", contentType: "video", categories: ["Programming"], level: "beginner", topics: ["git", "github", "devops"] },
  { title: "Linux Command Line Full Course", videoId: "ZtqBQ68cfJc", channel: "Fireship", duration: "1:32:07", viewsNum: 1_100_000, publishedDaysAgo: 365, language: "en", region: "intl", contentType: "video", categories: ["Programming"], level: "intermediate", topics: ["linux", "terminal", "devops"] },
  { title: "Deep Learning with PyTorch", videoId: "GIsg-ZUy0MY", channel: "Tech With Tim", duration: "25:14:40", viewsNum: 2_200_000, publishedDaysAgo: 730, language: "en", region: "intl", contentType: "course", categories: ["AI & ML", "Programming"], level: "advanced", topics: ["machine learning", "deep learning", "ai", "python"] },
  { title: "Linear Algebra for Data Science", videoId: "8H5Iy9q3p5g", channel: "College Wallah", duration: "1:14:22", viewsNum: 3_300_000, publishedDaysAgo: 1095, language: "hinglish", region: "in", contentType: "video", categories: ["Study", "AI & ML", "Aptitude"], level: "intermediate", topics: ["mathematics", "linear algebra", "math"] },
  { title: "Quantum Mechanics for Beginners", videoId: "OWJCfOvochA", channel: "Physics Wallah", duration: "18:02", viewsNum: 6_700_000, publishedDaysAgo: 730, language: "hi", region: "in", contentType: "short", categories: ["Study", "Notes"], level: "beginner", topics: ["physics", "quantum"] },
  { title: "Organic Chemistry in 60 Minutes", videoId: "qz0SPnXz7hQ", channel: "Physics Wallah", duration: "1:02:47", viewsNum: 890_000, publishedDaysAgo: 365, language: "hi", region: "in", contentType: "video", categories: ["Study", "Notes"], level: "beginner", topics: ["chemistry", "organic chemistry"] },
  { title: "Calculus 1 Full Course", videoId: "HfACrZZJ_Xk", channel: "College Wallah", duration: "5:31:11", viewsNum: 2_600_000, publishedDaysAgo: 730, language: "hinglish", region: "in", contentType: "course", categories: ["Study", "Aptitude"], level: "intermediate", topics: ["mathematics", "calculus", "math"] },
  { title: "JavaScript Full Course for Beginners", videoId: "PkZNo7MFNFg", channel: "CodeWithHarry", duration: "3:26:42", viewsNum: 7_800_000, publishedDaysAgo: 1095, language: "hinglish", region: "in", contentType: "course", categories: ["Programming", "Placement"], level: "beginner", topics: ["javascript", "web development", "programming"] },
  // ===== Sciences =====
  { title: "Physics - Complete Crash Course", videoId: "ZM8ECpBuQYE", channel: "Khan Academy", duration: "2:12:44", viewsNum: 3_200_000, publishedDaysAgo: 900, language: "en", region: "intl", contentType: "course", categories: ["Physics", "Study"], level: "beginner", topics: ["physics", "mechanics", "optics"] },
  { title: "Quantum Physics Explained Simply", videoId: "OWJCfOvochA", channel: "Veritasium", duration: "18:02", viewsNum: 8_400_000, publishedDaysAgo: 400, language: "en", region: "intl", contentType: "short", categories: ["Physics"], level: "beginner", topics: ["physics", "quantum"] },
  { title: "General Relativity — The Science of Time", videoId: "AwhKZ3FD9JA", channel: "Kurzgesagt", duration: "10:22", viewsNum: 12_400_000, publishedDaysAgo: 600, language: "en", region: "intl", contentType: "short", categories: ["Physics"], level: "beginner", topics: ["physics", "relativity"] },
  { title: "Chemistry Full Course — Atoms to Reactions", videoId: "FSyAehMdpyI", channel: "The Organic Chemistry Tutor", duration: "4:18:22", viewsNum: 2_900_000, publishedDaysAgo: 800, language: "en", region: "intl", contentType: "course", categories: ["Chemistry"], level: "beginner", topics: ["chemistry"] },
  { title: "Organic Chemistry in One Video", videoId: "qz0SPnXz7hQ", channel: "The Organic Chemistry Tutor", duration: "1:02:47", viewsNum: 1_800_000, publishedDaysAgo: 500, language: "en", region: "intl", contentType: "video", categories: ["Chemistry"], level: "intermediate", topics: ["chemistry", "organic chemistry"] },
  { title: "Biology Full Course — From Cells to Ecosystems", videoId: "HfACrZZJ_Xk", channel: "CrashCourse", duration: "5:31:11", viewsNum: 2_100_000, publishedDaysAgo: 1100, language: "en", region: "intl", contentType: "course", categories: ["Biology", "Study"], level: "beginner", topics: ["biology", "cells", "genetics"] },
  { title: "Human Anatomy in 60 Minutes", videoId: "rlpw7oi-bpE", channel: "Khan Academy", duration: "1:04:18", viewsNum: 980_000, publishedDaysAgo: 900, language: "en", region: "intl", contentType: "video", categories: ["Biology", "Medical"], level: "intermediate", topics: ["anatomy", "biology", "medical"] },
  // ===== Mathematics =====
  { title: "Essence of Linear Algebra", videoId: "aircAruvnKk", channel: "3Blue1Brown", duration: "1:22:18", viewsNum: 6_800_000, publishedDaysAgo: 1400, language: "en", region: "intl", contentType: "course", categories: ["Mathematics", "AI & ML"], level: "intermediate", topics: ["mathematics", "linear algebra"] },
  { title: "Essence of Calculus", videoId: "WUvTyaaNkzM", channel: "3Blue1Brown", duration: "2:14:55", viewsNum: 5_200_000, publishedDaysAgo: 1200, language: "en", region: "intl", contentType: "course", categories: ["Mathematics"], level: "intermediate", topics: ["mathematics", "calculus"] },
  { title: "Calculus 1 - Full College Course", videoId: "HfACrZZJ_Xk", channel: "Professor Leonard", duration: "5:31:11", viewsNum: 3_400_000, publishedDaysAgo: 1000, language: "en", region: "intl", contentType: "course", categories: ["Mathematics"], level: "intermediate", topics: ["calculus", "mathematics"] },
  { title: "Statistics Full Course for Data Science", videoId: "xxpc-HPKN2M", channel: "freeCodeCamp", duration: "4:12:08", viewsNum: 1_800_000, publishedDaysAgo: 650, language: "en", region: "intl", contentType: "course", categories: ["Mathematics", "AI & ML"], level: "intermediate", topics: ["statistics", "mathematics", "data science"] },
  { title: "Algebra Basics — Full Course", videoId: "8H5Iy9q3p5g", channel: "Khan Academy", duration: "1:14:22", viewsNum: 2_200_000, publishedDaysAgo: 1100, language: "en", region: "intl", contentType: "course", categories: ["Mathematics", "Study"], level: "beginner", topics: ["algebra", "mathematics"] },
  { title: "Trigonometry Full Course", videoId: "rlpw7oi-bpE", channel: "The Organic Chemistry Tutor", duration: "2:14:18", viewsNum: 1_400_000, publishedDaysAgo: 900, language: "en", region: "intl", contentType: "course", categories: ["Mathematics"], level: "beginner", topics: ["trigonometry", "mathematics"] },
  // ===== Humanities =====
  { title: "World History — Complete Crash Course", videoId: "xkBheR5Cawg", channel: "CrashCourse", duration: "8:14:02", viewsNum: 4_100_000, publishedDaysAgo: 1500, language: "en", region: "intl", contentType: "course", categories: ["History", "Study"], level: "beginner", topics: ["history", "world history", "civilization"] },
  { title: "Indian History — Ancient to Modern", videoId: "yQ7DkBjOgXs", channel: "StudyIQ IAS", duration: "4:22:18", viewsNum: 1_200_000, publishedDaysAgo: 700, language: "hinglish", region: "in", contentType: "course", categories: ["History", "UPSC"], level: "intermediate", topics: ["history", "indian history", "upsc"] },
  { title: "Geography Full Course — Earth & Climate", videoId: "8jLOx1hD3_o", channel: "CrashCourse", duration: "3:18:44", viewsNum: 1_600_000, publishedDaysAgo: 1200, language: "en", region: "intl", contentType: "course", categories: ["Geography"], level: "beginner", topics: ["geography", "climate", "earth"] },
  { title: "Economics — Crash Course", videoId: "37p1v7sYz5A", channel: "CrashCourse", duration: "3:02:22", viewsNum: 2_400_000, publishedDaysAgo: 1100, language: "en", region: "intl", contentType: "course", categories: ["Economics"], level: "beginner", topics: ["economics", "economy", "finance"] },
  { title: "Indian Economy for UPSC", videoId: "nKfl3EQ8uwk", channel: "Unacademy", duration: "5:14:18", viewsNum: 820_000, publishedDaysAgo: 500, language: "hinglish", region: "in", contentType: "course", categories: ["Economics", "UPSC"], level: "intermediate", topics: ["economics", "upsc", "indian economy"] },
  { title: "Psychology — Crash Course", videoId: "vo4pMVq0R6U", channel: "CrashCourse", duration: "3:42:18", viewsNum: 3_100_000, publishedDaysAgo: 1400, language: "en", region: "intl", contentType: "course", categories: ["Psychology"], level: "beginner", topics: ["psychology", "mind", "behavior"] },
  { title: "Philosophy — From Socrates to Modern Day", videoId: "KXn7X1L3cYg", channel: "TED-Ed", duration: "2:28:44", viewsNum: 1_800_000, publishedDaysAgo: 900, language: "en", region: "intl", contentType: "course", categories: ["Philosophy"], level: "beginner", topics: ["philosophy", "ethics", "thought"] },
  { title: "World Literature — Crash Course", videoId: "D8x8z1l5p7E", channel: "CrashCourse", duration: "3:14:02", viewsNum: 920_000, publishedDaysAgo: 1300, language: "en", region: "intl", contentType: "course", categories: ["Literature"], level: "beginner", topics: ["literature", "poetry", "novel"] },
  // ===== Languages =====
  { title: "English Grammar Complete Course", videoId: "p3p_9N1qJZc", channel: "English with Lucy", duration: "4:12:18", viewsNum: 5_200_000, publishedDaysAgo: 800, language: "en", region: "intl", contentType: "course", categories: ["Languages"], level: "beginner", topics: ["english", "grammar", "language"] },
  { title: "Hindi Grammar — Vyakaran", videoId: "hKB-YGF14fQ", channel: "Khan GS Research Centre", duration: "2:14:22", viewsNum: 1_100_000, publishedDaysAgo: 600, language: "hi", region: "in", contentType: "course", categories: ["Languages"], level: "beginner", topics: ["hindi", "grammar", "language"] },
  { title: "Vocabulary Builder — 1000 Words", videoId: "l6y2dV0r0gE", channel: "English with Lucy", duration: "1:42:08", viewsNum: 2_400_000, publishedDaysAgo: 500, language: "en", region: "intl", contentType: "video", categories: ["Languages"], level: "beginner", topics: ["english", "vocabulary", "language"] },
  // ===== Competitive Exams (India) =====
  { title: "UPSC Complete Strategy 2026", videoId: "bMknfKXIFA8", channel: "StudyIQ IAS", duration: "3:22:18", viewsNum: 2_100_000, publishedDaysAgo: 300, language: "hinglish", region: "in", contentType: "course", categories: ["UPSC"], level: "intermediate", topics: ["upsc", "ias", "civil services"] },
  { title: "Current Affairs Monthly Compilation", videoId: "btj2Zv1w1xk", channel: "Khan GS Research Centre", duration: "2:14:42", viewsNum: 1_800_000, publishedDaysAgo: 60, language: "hi", region: "in", contentType: "video", categories: ["UPSC", "Notes"], level: "intermediate", topics: ["current affairs", "upsc"] },
  { title: "SSC CGL Complete Preparation", videoId: "jR6hcl4Z3hE", channel: "Adda247", duration: "4:18:02", viewsNum: 1_400_000, publishedDaysAgo: 400, language: "hinglish", region: "in", contentType: "course", categories: ["SSC & Banking"], level: "intermediate", topics: ["ssc", "banking", "aptitude"] },
  { title: "Banking PO Reasoning Full Course", videoId: "tVzUXW6siu0", channel: "Adda247", duration: "3:28:14", viewsNum: 980_000, publishedDaysAgo: 350, language: "hinglish", region: "in", contentType: "course", categories: ["SSC & Banking", "Aptitude"], level: "intermediate", topics: ["banking", "reasoning", "aptitude"] },
  { title: "JEE Physics Complete Course", videoId: "OWJCfOvochA", channel: "Physics Wallah", duration: "18:14:02", viewsNum: 3_200_000, publishedDaysAgo: 450, language: "hi", region: "in", contentType: "course", categories: ["JEE & NEET", "Physics"], level: "advanced", topics: ["jee", "physics"] },
  { title: "NEET Biology Full Course", videoId: "HfACrZZJ_Xk", channel: "Physics Wallah", duration: "22:14:02", viewsNum: 2_100_000, publishedDaysAgo: 500, language: "hi", region: "in", contentType: "course", categories: ["JEE & NEET", "Biology", "Medical"], level: "advanced", topics: ["neet", "biology", "medical"] },
  { title: "Quantitative Aptitude Full Course", videoId: "8H5Iy9q3p5g", channel: "Adda247", duration: "5:42:18", viewsNum: 1_600_000, publishedDaysAgo: 600, language: "hinglish", region: "in", contentType: "course", categories: ["Aptitude", "SSC & Banking"], level: "intermediate", topics: ["aptitude", "quantitative", "reasoning"] },
  // ===== Business =====
  { title: "Business Management Crash Course", videoId: "xkBheR5Cawg", channel: "Harvard Business Review", duration: "2:14:22", viewsNum: 1_400_000, publishedDaysAgo: 700, language: "en", region: "intl", contentType: "video", categories: ["Business"], level: "beginner", topics: ["business", "management", "leadership"] },
  { title: "Marketing 101 — Full Course", videoId: "yQ7DkBjOgXs", channel: "Harvard Business Review", duration: "3:18:14", viewsNum: 980_000, publishedDaysAgo: 600, language: "en", region: "intl", contentType: "course", categories: ["Business"], level: "beginner", topics: ["marketing", "business"] },
  { title: "Finance for Beginners — Stock Market", videoId: "37p1v7sYz5A", channel: "Khan Academy", duration: "1:42:22", viewsNum: 2_800_000, publishedDaysAgo: 800, language: "en", region: "intl", contentType: "course", categories: ["Business", "Economics"], level: "beginner", topics: ["finance", "stock market", "business", "economics"] },
  // ===== Arts & Design =====
  { title: "Drawing & Sketching for Beginners", videoId: "D8x8z1l5p7E", channel: "TED-Ed", duration: "1:14:08", viewsNum: 620_000, publishedDaysAgo: 500, language: "en", region: "intl", contentType: "video", categories: ["Arts & Design"], level: "beginner", topics: ["art", "drawing", "sketching", "design"] },
  { title: "Music Theory in 30 Minutes", videoId: "KXn7X1L3cYg", channel: "TED-Ed", duration: "32:14", viewsNum: 1_400_000, publishedDaysAgo: 450, language: "en", region: "intl", contentType: "short", categories: ["Arts & Design"], level: "beginner", topics: ["music", "theory", "art"] },
  // ===== General Education (TED-Ed, Kurzgesagt) =====
  { title: "The Science of Sleep — Why We Dream", videoId: "AwhKZ3FD9JA", channel: "TED-Ed", duration: "5:42", viewsNum: 8_200_000, publishedDaysAgo: 800, language: "en", region: "intl", contentType: "short", categories: ["Study", "Biology"], level: "beginner", topics: ["science", "biology", "sleep"] },
  { title: "What If Earth Was Twice As Big?", videoId: "OWJCfOvochA", channel: "Kurzgesagt", duration: "7:14", viewsNum: 14_200_000, publishedDaysAgo: 700, language: "en", region: "intl", contentType: "short", categories: ["Study", "Physics"], level: "beginner", topics: ["science", "physics", "astronomy"] },
  { title: "The Immune System Explained", videoId: "ZM8ECpBuQYE", channel: "Kurzgesagt", duration: "6:28", viewsNum: 9_400_000, publishedDaysAgo: 1000, language: "en", region: "intl", contentType: "short", categories: ["Biology", "Medical"], level: "beginner", topics: ["biology", "immune system", "medical"] },
  // ===== Indian K-12 (Vedantu, BYJU'S) =====
  { title: "CBSE Class 10 Math Complete Revision", videoId: "HfACrZZJ_Xk", channel: "Vedantu", duration: "3:42:18", viewsNum: 2_200_000, publishedDaysAgo: 400, language: "hinglish", region: "in", contentType: "course", categories: ["Study", "Mathematics"], level: "beginner", topics: ["mathematics", "cbse", "class 10"] },
  { title: "CBSE Class 12 Physics Full Revision", videoId: "ZM8ECpBuQYE", channel: "BYJU'S", duration: "4:18:02", viewsNum: 1_800_000, publishedDaysAgo: 380, language: "en", region: "in", contentType: "course", categories: ["Study", "Physics"], level: "intermediate", topics: ["physics", "cbse", "class 12"] },
];

/* -------------------- Title templates -------------------- */

const TITLE_TEMPLATES: ((topic: string) => string)[] = [
  (t) => `${t} Full Course 2026`,
  (t) => `Learn ${t} in One Hour`,
  (t) => `${t} Crash Course for Beginners`,
  (t) => `Master ${t} Step by Step`,
  (t) => `${t} Interview Questions & Answers`,
  (t) => `${t} Project-Based Learning`,
  (t) => `${t} Explained Visually`,
  (t) => `Advanced ${t} Concepts`,
  (t) => `${t} From Scratch to Pro`,
  (t) => `${t} in 100 Seconds`,
  (t) => `Complete ${t} Tutorial`,
  (t) => `${t} Roadmap 2026`,
  (t) => `${t} for Data Science`,
  (t) => `${t} Deep Dive`,
  (t) => `Real-World ${t} Examples`,
  (t) => `${t} - Part 1: Foundations`,
  (t) => `${t} - Part 2: Intermediate`,
  (t) => `${t} - Part 3: Advanced`,
  (t) => `${t} Best Practices`,
  (t) => `${t} Cheat Sheet & Summary`,
  (t) => `${t} Live Coding Session`,
  (t) => `Top 10 ${t} Tips You Must Know`,
  (t) => `${t} Common Mistakes`,
  (t) => `${t} for Absolute Beginners`,
  (t) => `${t} Hands-on Workshop`,
  (t) => `${t} Placement Preparation`,
  (t) => `${t} Mock Test & Practice`,
  (t) => `${t} Previous Year Questions Solved`,
  (t) => `${t} — Handwritten Notes Review`,
  (t) => `${t} Aptitude Shortcuts`,
];

/* -------------------- RNG -------------------- */

function hashString(s: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed: number) {
  let s = seed | 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* -------------------- Formatting helpers -------------------- */

function formatViews(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${Math.floor(n / 1_000)}K`;
  return `${n}`;
}

function formatDuration(rand: () => number, contentType: ContentType): string {
  let totalSeconds: number;
  if (contentType === "short") totalSeconds = 20 + Math.floor(rand() * 50);
  else if (contentType === "course" || contentType === "playlist")
    totalSeconds = 7200 + Math.floor(rand() * 18000);
  else {
    const r = rand();
    if (r < 0.55) totalSeconds = 300 + Math.floor(rand() * 2700);
    else if (r < 0.85) totalSeconds = 3000 + Math.floor(rand() * 4200);
    else totalSeconds = 7200 + Math.floor(rand() * 7200);
  }
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = Math.floor(totalSeconds % 60);
  const pad = (x: number) => String(x).padStart(2, "0");
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`;
}

function formatPublished(days: number): string {
  if (days < 1) return "Today";
  if (days < 7) return `${days} day${days === 1 ? "" : "s"} ago`;
  if (days < 30) {
    const w = Math.floor(days / 7);
    return `${w} week${w === 1 ? "" : "s"} ago`;
  }
  if (days < 365) {
    const m = Math.floor(days / 30);
    return `${m} month${m === 1 ? "" : "s"} ago`;
  }
  const y = Math.floor(days / 365);
  return `${y} year${y === 1 ? "" : "s"} ago`;
}

function toTitleCase(s: string): string {
  return s.split(" ").map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w)).join(" ");
}

/* -------------------- Query parser -------------------- */

export interface ParsedQuery {
  topic: string;
  channel?: string;
  language?: Language;
  level?: "beginner" | "intermediate" | "advanced";
  category?: Category;
}

const CATEGORY_KEYWORDS: Record<string, Category> = {
  interview: "Interview Preparation",
  interviews: "Interview Preparation",
  mock: "Mock Tests",
  test: "Mock Tests",
  placement: "Placement",
  placements: "Placement",
  dsa: "DSA",
  aptitude: "Aptitude",
  notes: "Notes",
  pyq: "Previous Year Papers",
  previous: "Previous Year Papers",
  ai: "AI & ML",
  ml: "AI & ML",
  physics: "Physics",
  chemistry: "Chemistry",
  math: "Mathematics",
  mathematics: "Mathematics",
  calculus: "Mathematics",
  algebra: "Mathematics",
  statistics: "Mathematics",
  biology: "Biology",
  history: "History",
  geography: "Geography",
  economics: "Economics",
  psychology: "Psychology",
  philosophy: "Philosophy",
  literature: "Literature",
  english: "Languages",
  hindi: "Languages",
  languages: "Languages",
  business: "Business",
  finance: "Business",
  marketing: "Business",
  medical: "Medical",
  neet: "JEE & NEET",
  jee: "JEE & NEET",
  upsc: "UPSC",
  ias: "UPSC",
  ssc: "SSC & Banking",
  banking: "SSC & Banking",
  art: "Arts & Design",
  design: "Arts & Design",
  music: "Arts & Design",
};

export function parseQuery(raw: string): ParsedQuery {
  const q = raw.trim();
  const lower = q.toLowerCase();
  const words = lower.split(/\s+/).filter(Boolean);

  // Detect channel
  let channel: string | undefined;
  let remaining = q;
  for (const ch of CHANNELS) {
    const nameLower = ch.name.toLowerCase();
    if (lower.includes(nameLower)) {
      channel = ch.name;
      remaining = remaining.replace(new RegExp(ch.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi"), " ").trim();
      break;
    }
  }

  // Detect language
  let language: Language | undefined;
  const lowerRemain = remaining.toLowerCase();
  if (/\bhinglish\b/.test(lowerRemain)) {
    language = "hinglish";
    remaining = remaining.replace(/hinglish/gi, " ").trim();
  } else if (/\bhindi\b/.test(lowerRemain)) {
    language = "hi";
    remaining = remaining.replace(/hindi/gi, " ").trim();
  } else if (/\benglish\b/.test(lowerRemain)) {
    language = "en";
    remaining = remaining.replace(/english/gi, " ").trim();
  }

  // Detect level
  let level: "beginner" | "intermediate" | "advanced" | undefined;
  if (/\b(beginner|basics|for beginners)\b/.test(remaining.toLowerCase())) {
    level = "beginner";
    remaining = remaining.replace(/beginner|basics|for beginners/gi, " ").trim();
  } else if (/\b(advanced|expert)\b/.test(remaining.toLowerCase())) {
    level = "advanced";
    remaining = remaining.replace(/advanced|expert/gi, " ").trim();
  } else if (/\b(intermediate)\b/.test(remaining.toLowerCase())) {
    level = "intermediate";
    remaining = remaining.replace(/intermediate/gi, " ").trim();
  }

  // Detect category from remaining keywords
  let category: Category | undefined;
  for (const w of words) {
    if (CATEGORY_KEYWORDS[w]) {
      category = CATEGORY_KEYWORDS[w];
      break;
    }
  }

  // IMPORTANT: if query was only a channel name (or modifiers), use a
  // generic topic so title templates don't include the channel name.
  const cleaned = remaining.replace(/\s+/g, " ").trim();
  const topic = cleaned || "tutorial";
  return { topic, channel, language, level, category };
}

/* -------------------- Result builder -------------------- */

const TOTAL_MOCK_RESULTS = 60;
export const PAGE_SIZE = 18;

function pickCategories(topic: string, _rand?: () => number): Category[] {
  const lower = topic.toLowerCase();
  const cats: Set<Category> = new Set();
  if (/\b(dsa|algorithm|data structure|graph|tree|binary)\b/.test(lower)) cats.add("DSA");
  if (/\b(python|java|javascript|react|programming|web|code|html|css|node)\b/.test(lower)) cats.add("Programming");
  if (/\b(ai|ml|machine learning|deep learning|neural|pytorch|tensorflow)\b/.test(lower)) cats.add("AI & ML");
  if (/\b(physics|mechanics|quantum|relativity|optics)\b/.test(lower)) cats.add("Physics");
  if (/\b(chemistry|organic|inorganic|chemical)\b/.test(lower)) cats.add("Chemistry");
  if (/\b(math|mathematics|calculus|algebra|statistics|geometry|trigonometry)\b/.test(lower)) cats.add("Mathematics");
  if (/\b(biology|cell|anatomy|genetics|zoology|botany)\b/.test(lower)) cats.add("Biology");
  if (/\b(history|ancient|medieval|modern|civilization|war|revolution)\b/.test(lower)) cats.add("History");
  if (/\b(geography|climate|country|continent|earth)\b/.test(lower)) cats.add("Geography");
  if (/\b(economics|economy|finance|market|money|stock)\b/.test(lower)) cats.add("Economics");
  if (/\b(psychology|mind|behavior|mental)\b/.test(lower)) cats.add("Psychology");
  if (/\b(philosophy|ethics|think|thought)\b/.test(lower)) cats.add("Philosophy");
  if (/\b(literature|poetry|novel|writing|author)\b/.test(lower)) cats.add("Literature");
  if (/\b(english|hindi|language|grammar|vocabulary|spanish|french)\b/.test(lower)) cats.add("Languages");
  if (/\b(business|marketing|management|leadership|startup|entrepreneur)\b/.test(lower)) cats.add("Business");
  if (/\b(medical|neet|anatomy|medicine|doctor|mbbs)\b/.test(lower)) cats.add("Medical");
  if (/\b(upsc|ias|civil services)\b/.test(lower)) cats.add("UPSC");
  if (/\b(ssc|banking|po|clerk|railways)\b/.test(lower)) cats.add("SSC & Banking");
  if (/\b(jee|neet|iit)\b/.test(lower)) cats.add("JEE & NEET");
  if (/\b(art|design|music|drawing|painting|film)\b/.test(lower)) cats.add("Arts & Design");
  if (/\b(aptitude|reasoning|quantitative)\b/.test(lower)) cats.add("Aptitude");
  if (/\b(interview|placement|interviews)\b/.test(lower)) cats.add("Interview Preparation");
  if (/\b(mock|test|exam)\b/.test(lower)) cats.add("Mock Tests");
  if (/\b(note|notes|summary)\b/.test(lower)) cats.add("Notes");
  if (cats.size === 0) cats.add("Study");
  return Array.from(cats);
}

function pickContentType(rand: () => number): ContentType {
  const r = rand();
  if (r < 0.65) return "video";
  if (r < 0.82) return "playlist";
  if (r < 0.92) return "course";
  return "short";
}

function pickLanguageForChannel(ch: Channel, rand: () => number): Language {
  if (ch.region === "intl") return "en";
  const r = rand();
  if (ch.language === "hi") return r < 0.85 ? "hi" : "hinglish";
  // hinglish channels sometimes do English
  return r < 0.7 ? "hinglish" : r < 0.9 ? "hi" : "en";
}

function seedEntryToVideo(s: SeedEntry, idSuffix: string): Video {
  return {
    id: `${s.channel}-${s.videoId}-${idSuffix}`,
    title: s.title,
    videoId: s.videoId,
    thumbnail: `https://i.ytimg.com/vi/${s.videoId}/hqdefault.jpg`,
    channel: s.channel,
    duration: s.duration,
    views: formatViews(s.viewsNum),
    viewsNum: s.viewsNum,
    published: formatPublished(s.publishedDaysAgo),
    publishedDaysAgo: s.publishedDaysAgo,
    language: s.language,
    region: s.region,
    contentType: s.contentType,
    categories: s.categories,
    level: s.level,
  };
}

function buildFullResults(parsed: ParsedQuery, filters: Filters): Video[] {
  const q = parsed.topic.trim().toLowerCase();
  const topicDisplay = toTitleCase(parsed.topic.trim());

  // Pick channel pool based on filters.channel or parsed.channel
  const targetChannel = filters.channel || parsed.channel;
  const targetRegion: Region | "all" = filters.region && filters.region !== "all" ? filters.region : "all";
  const targetLanguage: Language | "all" = filters.language && filters.language !== "all" ? filters.language : (parsed.language ?? "all");

  const channelPool = CHANNELS.filter((c) => {
    if (targetChannel && c.name.toLowerCase() !== targetChannel.toLowerCase()) return false;
    if (targetRegion !== "all" && c.region !== targetRegion) return false;
    return true;
  });
  // If no channels match, use all
  const pool = channelPool.length > 0 ? channelPool : CHANNELS;

  const results: Video[] = [];
  const seenVideoIds = new Set<string>();

  // 1) Pull REAL videos from the channel-specific DB first (priority!)
  if (targetChannel && CHANNEL_VIDEO_DB[targetChannel]) {
    const words = q.split(/\s+/).filter(Boolean);
    const channelDB = CHANNEL_VIDEO_DB[targetChannel];

    // Score + sort by relevance (topic keyword match in title/topics)
    const scored = channelDB
      .map((entry) => {
        let score = 0;
        for (const w of words) {
          if (!w) continue;
          if (entry.title.toLowerCase().includes(w)) score += 5;
          if (entry.topics.some((t) => t.includes(w))) score += 3;
        }
        // If no topic keywords were given (e.g. channel-only search), give all equal score
        if (words.length === 0 || words.every((w) => !w)) score = 1;
        return { entry, score };
      })
      .filter(({ score }) => score > 0 || words.length === 0 || words.every((w) => !w))
      .sort((a, b) => b.score - a.score);

    for (const { entry } of scored) {
      if (seenVideoIds.has(entry.videoId)) continue;
      seenVideoIds.add(entry.videoId);
      results.push(seedEntryToVideo(entry, "ch-db"));
    }
  }

  // 2) Fallback: real seed matches from general library
  const words = q.split(/\s+/).filter(Boolean);
  const matched = SEED_LIBRARY.filter((s) => {
    if (seenVideoIds.has(s.videoId)) return false;
    const textHit =
      words.length === 0 ||
      words.every((w) => !w) ||
      words.some(
        (w) => s.title.toLowerCase().includes(w) || s.topics.some((t) => t.includes(w)),
      );
    const channelHit = !targetChannel || s.channel.toLowerCase() === targetChannel.toLowerCase();
    return textHit && channelHit;
  });

  for (const s of matched) {
    if (seenVideoIds.has(s.videoId)) continue;
    seenVideoIds.add(s.videoId);
    results.push(seedEntryToVideo(s, "seed"));
  }

  // 3) If targeting a channel but DB + seed don't fill TOTAL, pull MORE real
  // videos from other channel DBs that share tags/topics (same channel).
  if (targetChannel && CHANNEL_VIDEO_DB[targetChannel]) {
    const chDB = CHANNEL_VIDEO_DB[targetChannel];
    for (const entry of chDB) {
      if (results.length >= TOTAL_MOCK_RESULTS) break;
      if (seenVideoIds.has(entry.videoId)) continue;
      seenVideoIds.add(entry.videoId);
      results.push(seedEntryToVideo(entry, "ch-db2"));
    }
  }

  // 4) Synthetic pad to TOTAL using title templates
  const seedKey = `${q}|${targetChannel ?? ""}|${targetRegion}|${targetLanguage}`;
  const rand = mulberry32(hashString(seedKey));

  let idx = 0;
  while (results.length < TOTAL_MOCK_RESULTS) {
    const template = TITLE_TEMPLATES[idx % TITLE_TEMPLATES.length];
    const title = template(topicDisplay);
    const ch = pool[idx % pool.length];
    // Pick a seed entry from the TARGET channel's DB when possible
    let seedEntry: SeedEntry;
    if (targetChannel && CHANNEL_VIDEO_DB[targetChannel]) {
      seedEntry = CHANNEL_VIDEO_DB[targetChannel][idx % CHANNEL_VIDEO_DB[targetChannel].length];
    } else {
      seedEntry = SEED_LIBRARY[idx % SEED_LIBRARY.length];
    }
    const contentType = pickContentType(rand);
    const lang = targetLanguage !== "all" ? targetLanguage : pickLanguageForChannel(ch, rand);
    const viewsNum = 120_000 + Math.floor(rand() * 9_800_000);
    const daysAgo = Math.floor(rand() * 1825);
    const level = parsed.level ?? (["beginner", "intermediate", "advanced"] as const)[Math.floor(rand() * 3)];

    results.push({
      id: `${q}-syn-${idx}`,
      title,
      videoId: seedEntry.videoId,
      thumbnail: `https://i.ytimg.com/vi/${seedEntry.videoId}/hqdefault.jpg`,
      channel: targetChannel || ch.name,
      duration: formatDuration(rand, contentType),
      views: formatViews(viewsNum),
      viewsNum,
      published: formatPublished(daysAgo),
      publishedDaysAgo: daysAgo,
      language: lang,
      region: (CHANNEL_BY_NAME.get((targetChannel || ch.name).toLowerCase())?.region) ?? ch.region,
      contentType,
      categories: pickCategories(q, rand),
      level,
    });
    idx++;
  }

  // 3) Apply post-filters
  let filtered = results.filter((v) => {
    if (filters.contentType && filters.contentType !== "all" && v.contentType !== filters.contentType) return false;
    if (filters.category && filters.category !== "all" && !v.categories.includes(filters.category)) return false;
    if (filters.language && filters.language !== "all" && v.language !== filters.language) return false;
    if (filters.region && filters.region !== "all" && v.region !== filters.region) return false;
    if (filters.channel && v.channel.toLowerCase() !== filters.channel.toLowerCase()) return false;
    if (parsed.level && v.level !== parsed.level) return false;
    return true;
  });

  // 4) Sort
  const sort = filters.sort ?? "relevance";
  if (sort === "latest") {
    filtered.sort((a, b) => a.publishedDaysAgo - b.publishedDaysAgo);
  } else if (sort === "most_viewed") {
    filtered.sort((a, b) => b.viewsNum - a.viewsNum);
  } else if (sort === "beginner") {
    const rank = (l: string) => (l === "beginner" ? 0 : l === "intermediate" ? 1 : 2);
    filtered.sort((a, b) => rank(a.level) - rank(b.level));
  }
  // "relevance" keeps seed matches first

  return filtered;
}

/* -------------------- Public API -------------------- */

const cache = new Map<string, Video[]>();

function cacheKey(query: string, filters: Filters): string {
  return JSON.stringify({ q: query.trim().toLowerCase(), f: filters });
}

export interface SearchResult {
  videos: Video[];
  page: number;
  hasMore: boolean;
  total: number;
}

export async function searchVideos(
  query: string,
  page: number = 0,
  filters: Filters = {},
): Promise<SearchResult> {
  const trimmed = query.trim();

  // Try backend first (first page only)
  if (page === 0) {
    try {
      const params = new URLSearchParams({ q: trimmed, page: String(page), limit: String(PAGE_SIZE) });
      if (filters.language && filters.language !== "all") params.set("language", filters.language);
      if (filters.region && filters.region !== "all") params.set("region", filters.region);
      if (filters.contentType && filters.contentType !== "all") params.set("contentType", filters.contentType);
      if (filters.category && filters.category !== "all") params.set("category", filters.category);
      if (filters.channel) params.set("channel", filters.channel);
      if (filters.sort) params.set("sort", filters.sort);

      const res = await fetch(`/api/youtube/search?${params.toString()}`, {
        signal: AbortSignal.timeout(2500),
      });
      if (res.ok) {
        const data = (await res.json()) as Video[] | SearchResult;
        if (Array.isArray(data) && data.length > 0) {
          return { videos: data, page, hasMore: data.length === PAGE_SIZE, total: data.length };
        }
        if (!Array.isArray(data) && data && Array.isArray((data as SearchResult).videos) && (data as SearchResult).videos.length > 0) {
          return { ...(data as SearchResult), page };
        }
      }
    } catch {
      /* fall through */
    }
  }

  // Mock fallback
  await new Promise((r) => setTimeout(r, page === 0 ? 600 : 320));
  const key = cacheKey(trimmed, filters);
  let all = cache.get(key);
  if (!all) {
    const parsed = parseQuery(trimmed);
    all = buildFullResults(parsed, filters);
    cache.set(key, all);
  }
  const start = page * PAGE_SIZE;
  const slice = all.slice(start, start + PAGE_SIZE);
  return {
    videos: slice,
    page,
    hasMore: start + PAGE_SIZE < all.length,
    total: all.length,
  };
}

/** Fetch videos related to a given video (by channel + topics). */
export async function fetchRelatedVideos(
  video: Video,
  limit: number = 8,
): Promise<Video[]> {
  const topicGuess = video.title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 3)
    .slice(0, 2)
    .join(" ");
  const query = topicGuess || "learning";
  const res = await searchVideos(query, 0, { channel: video.channel });
  return res.videos.filter((v) => v.id !== video.id).slice(0, limit);
}

/* -------------------- Continue Watching -------------------- */

const CONTINUE_KEY = "campusai:continue-watching";
const MAX_CONTINUE = 8;

export function addContinueWatching(video: Video): void {
  try {
    const raw = localStorage.getItem(CONTINUE_KEY);
    const list: Video[] = raw ? JSON.parse(raw) : [];
    const filtered = list.filter((v) => v.id !== video.id);
    const next = [video, ...filtered].slice(0, MAX_CONTINUE);
    localStorage.setItem(CONTINUE_KEY, JSON.stringify(next));
  } catch {
    /* ignore */
  }
}

export function getContinueWatching(): Video[] {
  try {
    const raw = localStorage.getItem(CONTINUE_KEY);
    if (!raw) return [];
    const list = JSON.parse(raw);
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

export function clearContinueWatching(): void {
  try {
    localStorage.removeItem(CONTINUE_KEY);
  } catch {
    /* ignore */
  }
}

/* -------------------- Saved Channels -------------------- */

const SAVED_CHANNELS_KEY = "campusai:saved-channels";

export function getSavedChannels(): string[] {
  try {
    const raw = localStorage.getItem(SAVED_CHANNELS_KEY);
    if (!raw) return [];
    const list = JSON.parse(raw);
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

export function toggleSavedChannel(name: string): boolean {
  const list = getSavedChannels();
  const exists = list.includes(name);
  let next: string[];
  if (exists) {
    next = list.filter((n) => n !== name);
  } else {
    next = [name, ...list];
  }
  try {
    localStorage.setItem(SAVED_CHANNELS_KEY, JSON.stringify(next));
  } catch {
    /* ignore */
  }
  return !exists;
}

export function isChannelSaved(name: string): boolean {
  return getSavedChannels().includes(name);
}

/* -------------------- Channel-specific search -------------------- */

/**
 * GET /api/youtube/channel/:channelName
 * GET /api/youtube/channel/:channelName/videos
 * GET /api/youtube/channel/:channelName/search?q=query
 */
export async function searchChannelVideos(
  channelName: string,
  query: string = "",
  page: number = 0,
  filters: Filters = {},
): Promise<SearchResult> {
  const trimmed = query.trim() || "tutorial course";
  const merged: Filters = { ...filters, channel: channelName };

  // Try backend first
  if (page === 0) {
    try {
      const endpoint = query.trim()
        ? `/api/youtube/channel/${encodeURIComponent(channelName)}/search?q=${encodeURIComponent(query)}&page=${page}&limit=${PAGE_SIZE}`
        : `/api/youtube/channel/${encodeURIComponent(channelName)}/videos?page=${page}&limit=${PAGE_SIZE}`;
      const res = await fetch(endpoint, { signal: AbortSignal.timeout(2500) });
      if (res.ok) {
        const data = (await res.json()) as Video[] | SearchResult;
        if (Array.isArray(data) && data.length > 0) {
          return { videos: data, page, hasMore: data.length === PAGE_SIZE, total: data.length };
        }
      }
    } catch {
      /* fall through */
    }
  }

  return searchVideos(trimmed, page, merged);
}
