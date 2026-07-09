export const siteConfig = {
  name: "Guido Pastorino",
  initials: "GP",
  title: "Full Stack Developer",
  location: "Argentina",
  phone: "+54 3402 552647",
  phoneHref: "tel:+543402552647",
  github: "https://github.com/guidopastorino",
  linkedin: "https://www.linkedin.com/in/guidopastorino",
  resumeUrl: "/resume.pdf",
  bio: "Full Stack Developer specialized in the Next.js, TypeScript, PostgreSQL, Tailwind CSS, and shadcn/ui ecosystem. I build fast, maintainable products, optimize performance, and ensure reliable releases through testing and CI/CD.",
};

export const navLinks = [
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "Contact", href: "#contact" },
] as const;

export const githubStats = [
  { label: "Total Commits", value: "1,248", change: "+12% this month" },
  { label: "Contributions", value: "287", change: "+8% this month" },
  { label: "Repositories", value: "28", change: "Public Repos" },
  { label: "Followers", value: "156", change: "+5% this month" },
] as const;

export const activityMonths = [
  { month: "Dec", value: 45 },
  { month: "Jan", value: 62 },
  { month: "Feb", value: 38 },
  { month: "Mar", value: 78 },
  { month: "Apr", value: 55 },
  { month: "May", value: 90 },
] as const;

export const experience = {
  company: "Orexe",
  role: "Full Stack Developer",
  location: "Lima, Perú (Remote)",
  type: "Full-time",
  period: "Sep 2025 – Present",
  highlights: [
    "Develop and maintain web applications using Next.js, TypeScript, Tailwind CSS, Angular, and shadcn/ui, building reusable and scalable UI components.",
    "Led the development of Atlas, a multi-tenant B2B operations portal that delivers DevOps/SecOps/Observability capacity as a subscription service with atomic tasks, role-based workflows, and operational visibility.",
    "Built Atlas with React + Vite, React Query, TypeScript, Tailwind CSS, Hono, PostgreSQL, Drizzle ORM, and Better Auth (email/password, username, and OAuth).",
  ],
  stack: [
    "Next.js",
    "React",
    "TypeScript",
    "Hono",
    "PostgreSQL",
    "Drizzle",
    "Better Auth",
  ],
};

export const skillGroups = [
  {
    title: "Languages",
    items: ["TypeScript", "JavaScript", "Python", "HTML", "CSS"],
  },
  {
    title: "AI Tools",
    items: ["Cursor", "Claude Code", "ChatGPT"],
  },
  {
    title: "Technologies",
    items: [
      "Next.js",
      "React",
      "Node.js",
      "PostgreSQL",
      "Docker",
      "AWS",
      "Tailwind CSS",
      "shadcn/ui",
    ],
  },
] as const;

export const projects = [
  {
    title: "Atlas",
    description:
      "Multi-tenant B2B operations portal for DevOps/SecOps/Observability capacity as a subscription service, with atomic tasks and role-based workflows.",
    stack: ["React", "Vite", "Hono", "PostgreSQL", "Drizzle", "Better Auth"],
    href: "https://github.com/guidopastorino",
    stars: 12,
    forks: 3,
  },
  {
    title: "Music Data Explorer",
    description:
      "Next.js SSR app that uses the Spotify API to analyze artists and songs, with Recharts visualizations and AI-generated fun facts via Gemini.",
    stack: ["Next.js", "TypeScript", "Spotify API", "Recharts", "AI SDK"],
    href: "https://github.com/guidopastorino",
    stars: 24,
    forks: 5,
  },
  {
    title: "University Projects",
    description:
      "Problem-solving development with efficient solutions in C and Python, focused on algorithm optimization for academic and practical challenges.",
    stack: ["C", "Python", "Algorithms"],
    href: "https://github.com/guidopastorino",
    stars: 8,
    forks: 2,
  },
] as const;
