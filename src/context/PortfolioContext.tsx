import { createContext, useContext } from 'react';

// Types derived from portfolio.json schema

export interface Meta {
  title: string;
  description: string;
  keywords: string[];
  author: string;
  siteUrl: string;
  ogImage: string;
  twitterHandle: string;
  favicon: string;
  canonicalUrl: string;
}

export interface Identity {
  firstName: string;
  lastName: string;
  fullName: string;
  title: string;
  tagline: string;
  subtitle: string;
  email: string;
  phone: string;
  location: {
    city: string;
    state: string;
    country: string;
    timezone: string;
  };
  avatar: {
    url: string;
    initials: string;
    bgColor: string;
  };
  pronouns: string;
  status: string;
  statusEmoji: string;
}

export interface Bio {
  shortBio: string;
  longBio: string;
  narrative: {
    [key: string]: {
      title: string;
      description: string;
      duration: string;
      keyMoment: string;
    };
  };
  philosophy: string;
  currentFocus: string;
  futureAspiration: string;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  proficiency: number;
  yearsExperience: number;
  description: string;
  color: string;
  icon: string;
  tags: string[];
  usedInProjects: string[];
  relatedSkills: string[];
  proficiencyLevel: string;
  lastUsed?: string;
  hideFromPublic: boolean;
}

export interface Project {
  id: string;
  title: string;
  subtitle: string;
  shortDescription: string;
  longDescription: string;
  category: string;
  subcategories: string[];
  status: 'completed' | 'in-progress' | 'archived';
  featured: boolean;
  complexity: 'low' | 'medium' | 'high' | 'extreme';
  startDate: string;
  endDate: string | null;
  duration: string;
  role: string;
  teamSize: number;
  skillsUsed: string[];
  description: {
    challenge: string;
    solution: string;
    approach: string;
  };
  keyLearnings: string[];
  metrics: {
    [key: string]: number;
  };
  links: {
    github?: string;
    liveDemo?: string;
  };
  media: {
    thumbnail: string;
    images: string[];
  };
  techStack: {
    frontend: string[];
    backend: string[];
    deployment: string[];
  };
  hideFromPublic: boolean;
  archived: boolean;
}

export interface TimelineItem {
  id: string;
  date: string;
  phase: 'fundamentals' | 'intermediate' | 'advanced';
  title: string;
  description: string;
  type: 'learning' | 'achievement' | 'project';
  importance: 'normal' | 'high' | 'critical';
  icon: string;
  relatedSkills: string[];
  relatedProjects: string[];
  expandedStory: string;
  hideFromPublic: boolean;
}

export interface Education {
  id: string;
  tier: 'degree' | 'pu_college' | 'high_school';
  institution: string;
  degree?: string;
  field: string;
  location: string;
  startDate: string;
  endDate: string;
  grade: string;
  highlights: string[];
  courses?: string[];
  hideFromPublic: boolean;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  credentialUrl: string;
  credentialId?: string;
  icon: string;
  hideFromPublic: boolean;
}

export interface WorkExperience {
  id: string;
  title: string;
  company: string;
  location: string;
  period: string;
  type: 'full-time' | 'internship' | 'contract' | 'freelance';
  highlights: string[];
  skillsUsed: string[];
  relatedProjectId?: string;
  hideFromPublic: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  date: string;
  importance: 'normal' | 'medium' | 'high';
  icon: string;
  hideFromPublic: boolean;
}

export interface Extracurricular {
  id: string;
  title: string;
  organization: string;
  role: string;
  period: string;
  description: string;
  icon: string;
  hideFromPublic: boolean;
}

export interface ResumeConfig {
  driveUrl: string;
  fileName: string;
}

export interface ContactInfo {
  email: string;
  phone: string;
  linkedIn: string;
  github: string;
  twitter: string;
  codepen: string;
  website: string;
  formspreeUrl: string;
  timezone: string;
}

export interface SocialMedia {
  [key: string]: {
    url: string;
    username: string;
    displayName: string;
    icon: string;
    followers?: number;
    public: boolean;
  };
}

export interface ThemeConfig {
  colorScheme: 'light' | 'dark';
  colors: {
    [key: string]: string;
  };
  particles: {
    count: number;
    speed: number;
    size: number;
    opacity: number;
  };
  animations: {
    speed: string;
    enableGlitch: boolean;
    enableTrails: boolean;
    particlePhysics: boolean;
  };
}

export interface FeatureFlags {
  enableParticles: boolean;
  enableProjectHolograms: boolean;
  enableSound: boolean;
  enableDarkMode: boolean;
  enableAnimations: boolean;
  enableMetrics: boolean;
  maintenanceMode: boolean;
}

export interface SEOConfig {
  robots: string;
  language: string;
  viewport: string;
  themeColor: string;
  structuredData: Record<string, string>;
}

export interface PortfolioContextType {
  meta: Meta;
  identity: Identity;
  bio: Bio;
  skills: Skill[];
  projects: Project[];
  timeline: TimelineItem[];
  education: Education[];
  certifications: Certification[];
  workExperience: WorkExperience[];
  achievements: Achievement[];
  extracurricular: Extracurricular[];
  resume: ResumeConfig;
  cliQuotes: string[];
  contact: ContactInfo;
  social: SocialMedia;
  theme: ThemeConfig;
  featureFlags: FeatureFlags;
  seo: SEOConfig;
  
  // Interactive State & Methods
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  isSoundEnabled: boolean;
  toggleSound: () => void;
  selectedProjectId: string;
  setSelectedProjectId: (id: string) => void;
  
  // Custom Data Query Helpers
  getSkill: (id: string) => Skill | undefined;
  getProject: (id: string) => Project | undefined;
  getProjectsBySkill: (skillId: string) => Project[];
  getTimelineByPhase: (phase: 'fundamentals' | 'intermediate' | 'advanced') => TimelineItem[];
}

export const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};
