import { db } from "@/db";
import {
  profile,
  doubts,
  notes,
  pyqs,
  companies,
  companyQuestions,
  forumPosts,
  leaderboard,
  resume,
} from "@/db/schema";
import { sql } from "drizzle-orm";

export async function seedIfEmpty() {
  const existing = await db.select({ count: sql<number>`count(*)` }).from(profile);
  const count = Number(existing[0]?.count ?? 0);
  if (count > 0) return false;

  await db.insert(profile).values({
    name: "Priya Sharma",
    university: "Mumbai University",
    course: "BSc Computer Science",
    semester: 4,
    streakDays: 12,
    premiumTier: "free",
  });

  await db.insert(doubts).values([
    {
      subject: "Data Structures",
      question: "What is the time complexity of quicksort in the worst case?",
      answer:
        "**Worst-case time complexity of Quicksort: O(n²)**\n\nThis happens when the pivot chosen is consistently the smallest or largest element — for example, on an already sorted array with a naive pivot rule.\n\n**Why it happens:**\n1. The partition step still takes O(n) work.\n2. But one side of the partition has n−1 elements and the other has 0.\n3. This creates n recursive levels → n × n = O(n²).\n\n**How to avoid:** Use *randomized quicksort* or *median-of-three* pivot selection — both yield expected O(n log n).",
      rating: 1,
    },
    {
      subject: "DBMS",
      question: "Explain ACID properties with a real-life example.",
      answer:
        "**ACID** = Atomicity, Consistency, Isolation, Durability.\n\nReal-life example: **Bank transfer of ₹1000 from Alice to Bob.**\n\n1. **Atomicity** — Either both updates happen (debit Alice, credit Bob) or none. If crash mid-way, rollback restores state.\n2. **Consistency** — Total money in system stays same before & after transfer.\n3. **Isolation** — If another transfer runs concurrently, it sees a clean state, not half-applied changes.\n4. **Durability** — Once committed, transfer survives power failure (written to disk).",
      rating: null,
    },
  ]);

  await db.insert(notes).values([
    {
      title: "Operating Systems — Complete Handwritten Notes",
      subject: "Operating Systems",
      semester: 4,
      university: "Mumbai University",
      author: "Aarav Mehta",
      description: "Covers process scheduling, memory management, deadlocks, file systems. All 5 units.",
      pageCount: 48,
      likes: 312,
      downloads: 1280,
      status: "approved",
    },
    {
      title: "DBMS Normalization Cheat Sheet",
      subject: "DBMS",
      semester: 4,
      university: "Mumbai University",
      author: "Sneha Kulkarni",
      description: "1NF, 2NF, 3NF, BCNF explained with examples. Perfect for exam revision.",
      pageCount: 12,
      likes: 540,
      downloads: 2100,
      status: "approved",
    },
    {
      title: "DSA — Trees & Graphs Problem Set",
      subject: "Data Structures",
      semester: 3,
      university: "Pune University",
      author: "Rahul Patil",
      description: "50+ solved problems with code in C++ and Python. Includes BFS, DFS, Dijkstra.",
      pageCount: 36,
      likes: 820,
      downloads: 3400,
      status: "approved",
    },
    {
      title: "Computer Networks — Unit 1-5 Summary",
      subject: "Computer Networks",
      semester: 5,
      university: "Mumbai University",
      author: "Isha Desai",
      description: "OSI model, TCP/IP, routing protocols, congestion control.",
      pageCount: 28,
      likes: 198,
      downloads: 760,
      status: "approved",
    },
    {
      title: "Discrete Math — Logic & Proofs",
      subject: "Mathematics",
      semester: 2,
      university: "Nagpur University",
      author: "Karan Joshi",
      description: "Propositional logic, predicate logic, induction, pigeonhole principle.",
      pageCount: 22,
      likes: 145,
      downloads: 520,
      status: "approved",
    },
    {
      title: "Java OOPs Concepts — Complete Guide",
      subject: "Programming",
      semester: 3,
      university: "Mumbai University",
      author: "Priya Sharma",
      description: "Inheritance, polymorphism, abstraction, encapsulation with 40+ code examples.",
      pageCount: 32,
      likes: 410,
      downloads: 1650,
      status: "approved",
    },
  ]);

  await db.insert(pyqs).values([
    { subject: "Data Structures", university: "Mumbai University", year: 2024, paperType: "Semester Exam", semester: 3, downloads: 842, bookmarked: true },
    { subject: "Data Structures", university: "Mumbai University", year: 2023, paperType: "Semester Exam", semester: 3, downloads: 1204 },
    { subject: "Data Structures", university: "Pune University", year: 2024, paperType: "Semester Exam", semester: 3, downloads: 620 },
    { subject: "DBMS", university: "Mumbai University", year: 2024, paperType: "Semester Exam", semester: 4, downloads: 580, bookmarked: true },
    { subject: "DBMS", university: "Mumbai University", year: 2023, paperType: "Semester Exam", semester: 4, downloads: 910 },
    { subject: "Operating Systems", university: "Mumbai University", year: 2024, paperType: "Semester Exam", semester: 4, downloads: 740 },
    { subject: "Operating Systems", university: "Pune University", year: 2023, paperType: "Semester Exam", semester: 4, downloads: 430 },
    { subject: "Computer Networks", university: "Mumbai University", year: 2024, paperType: "Semester Exam", semester: 5, downloads: 310 },
    { subject: "Software Engineering", university: "Mumbai University", year: 2023, paperType: "Internal", semester: 5, downloads: 205 },
    { subject: "Theory of Computation", university: "Nagpur University", year: 2024, paperType: "Semester Exam", semester: 4, downloads: 280 },
  ]);

  await db.insert(companies).values([
    { name: "TCS", category: "IT", logo: "🏢", practiceCount: 2340 },
    { name: "Infosys", category: "IT", logo: "💻", practiceCount: 1890 },
    { name: "Wipro", category: "IT", logo: "🖥️", practiceCount: 1420 },
    { name: "Cognizant", category: "IT", logo: "⚙️", practiceCount: 1105 },
    { name: "Accenture", category: "Consulting", logo: "📊", practiceCount: 980 },
    { name: "Deloitte", category: "Consulting", logo: "📈", practiceCount: 720 },
    { name: "Amazon", category: "IT", logo: "📦", practiceCount: 3100 },
    { name: "Google", category: "IT", logo: "🔍", practiceCount: 4200 },
  ]);

  const [tcs, infosys, amazon] = await db.select().from(companies).limit(3);
  await db.insert(companyQuestions).values([
    { companyId: tcs.id, question: "Explain the difference between process and thread.", category: "Technical", difficulty: "Easy", modelAnswer: "A process is an instance of a program in execution with its own memory space. A thread is a lightweight unit within a process, sharing memory with other threads of the same process. Context switching between threads is faster than between processes." },
    { companyId: tcs.id, question: "If a train 150m long passes a pole in 15 seconds, find its speed in km/hr.", category: "Aptitude", difficulty: "Easy", modelAnswer: "Speed = 150/15 = 10 m/s = 10 × (18/5) = 36 km/hr." },
    { companyId: tcs.id, question: "Write a function to reverse a linked list.", category: "Coding", difficulty: "Med", modelAnswer: "Use three pointers: prev, curr, next. Iterate through the list, reversing each node's next pointer. Time O(n), Space O(1)." },
    { companyId: tcs.id, question: "Tell me about a time you worked in a team under pressure.", category: "HR", difficulty: "Easy", modelAnswer: "Use STAR method: Situation, Task, Action, Result. Give a concrete example showing collaboration, clear role, and positive outcome." },
    { companyId: infosys.id, question: "What is normalization? Explain 3NF with example.", category: "Technical", difficulty: "Med", modelAnswer: "Normalization reduces redundancy. 3NF requires 2NF + no transitive dependencies. Example: Student(sid, name, dept, dept_head) violates 3NF because dept_head depends on dept, not sid. Decompose into Student(sid,name,dept) and Dept(dept,head)." },
    { companyId: infosys.id, question: "A sum of ₹5000 amounts to ₹5832 in 2 years at CI. Find rate.", category: "Aptitude", difficulty: "Med", modelAnswer: "A = P(1+r/100)^n → 5832 = 5000(1+r/100)^2 → (1+r/100)^2 = 1.1664 → 1+r/100 = 1.08 → r = 8%." },
    { companyId: amazon.id, question: "Design a URL shortener like bit.ly.", category: "Technical", difficulty: "Hard", modelAnswer: "Use base62 encoding of auto-increment ID or hash of URL. Store (shortCode → longURL) in DB with TTL. Use CDN caching, rate limiting, analytics pipeline. Scale with sharding by shortCode prefix." },
    { companyId: amazon.id, question: "Find the kth largest element in an unsorted array.", category: "Coding", difficulty: "Hard", modelAnswer: "Use QuickSelect (average O(n)) or Min-Heap of size k (O(n log k)). QuickSelect partitions around pivot and recurses into the half containing kth." },
  ]);

  await db.insert(forumPosts).values([
    { category: "Doubt", title: "How to solve recurrence T(n) = 2T(n/2) + n?", body: "I'm stuck on applying Master theorem here. Can someone walk me through step-by-step?", author: "Aarav Mehta", university: "Mumbai University", upvotes: 42, comments: 8, tags: "algorithms,recurrence" },
    { category: "Resource", title: "Free NPTEL course recommendations for DBMS", body: "Sharing the top 3 NPTEL courses I found helpful for DBMS sem 4 exams.", author: "Sneha Kulkarni", university: "Nagpur University", upvotes: 128, comments: 24, tags: "dbms,nptel,free" },
    { category: "Discussion", title: "Best strategy for TCS NQT preparation?", body: "Appearing next month. Should I focus more on aptitude or coding? Any recent interview experiences?", author: "Rahul Patil", university: "Pune University", upvotes: 87, comments: 31, tags: "tcs,placements" },
    { category: "Announcement", title: "CampusAI is live! Welcome everyone 🎉", body: "We're thrilled to launch CampusAI for Maharashtra students. Drop your feedback in this thread!", author: "CampusAI Team", university: "All Universities", upvotes: 512, comments: 64, tags: "announcement" },
    { category: "Doubt", title: "Difference between TCP and UDP in one line?", body: "Need a crisp answer for viva. Can someone help?", author: "Isha Desai", university: "Mumbai University", upvotes: 34, comments: 12, tags: "networks,viva" },
    { category: "Resource", title: "Complete LeetCode study plan for placements", body: "Curated 90-day plan covering arrays, DP, graphs, and system design.", author: "Karan Joshi", university: "Pune University", upvotes: 256, comments: 42, tags: "leetcode,placements" },
  ]);

  await db.insert(leaderboard).values([
    { rank: 1, name: "Sneha Kulkarni", university: "Nagpur University", points: 4820, badges: 12, avatar: "👑" },
    { rank: 2, name: "Rahul Patil", university: "Pune University", points: 4210, badges: 10, avatar: "🥈" },
    { rank: 3, name: "Aarav Mehta", university: "Mumbai University", points: 3890, badges: 9, avatar: "🥉" },
    { rank: 4, name: "Priya Sharma", university: "Mumbai University", points: 2940, badges: 7, avatar: "🎓" },
    { rank: 5, name: "Isha Desai", university: "Mumbai University", points: 2410, badges: 6, avatar: "⭐" },
    { rank: 6, name: "Karan Joshi", university: "Nagpur University", points: 2180, badges: 5, avatar: "🔥" },
    { rank: 7, name: "Aditya Rao", university: "Pune University", points: 1920, badges: 4, avatar: "🚀" },
    { rank: 8, name: "Meera Nair", university: "Mumbai University", points: 1740, badges: 4, avatar: "💫" },
    { rank: 9, name: "Vikram Singh", university: "Pune University", points: 1520, badges: 3, avatar: "🎯" },
    { rank: 10, name: "Ananya Iyer", university: "Nagpur University", points: 1340, badges: 3, avatar: "✨" },
  ]);

  await db.insert(resume).values({
    fullName: "Priya Sharma",
    headline: "Final-year CS student | Full-stack developer | AI enthusiast",
    email: "priya.sharma@mu.ac.in",
    phone: "+91 98765 43210",
    education: "BSc Computer Science, Mumbai University (2022–2025) — CGPA 8.7\nHSC Maharashtra Board (2022) — 89%",
    skills: "JavaScript, React, Next.js, Node.js, PostgreSQL, Python, TensorFlow, Git, Docker",
    projects: "CampusAI Notes Module — built note-sharing feature serving 500+ daily users\nSmart Attendance — face recognition-based attendance system using OpenCV",
    experience: "SDE Intern, TechStartup Inc (May–Jul 2024) — shipped 3 production features",
    aiScore: 0,
    aiFeedback: "",
  });

  return true;
}
