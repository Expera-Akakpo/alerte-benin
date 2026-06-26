export type UserRole = 'admin' | 'user';

export interface User {
  id: string;
  email: string;
  fullname: string;
  role: UserRole;
  avatar?: string;
  savedOpportunities?: string[];
  createdAt: string;
}

export type MediaCategory = 'article' | 'podcast' | 'video' | 'interview';

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  author: string;
  status: 'published' | 'draft' | 'scheduled';
  mediaType: MediaCategory;
  mediaUrl?: string; // Audio or Video URL
  views: number;
  createdAt: string;
  publishedAt?: string;
}

export interface Opportunity {
  id: string;
  title: string;
  description: string;
  category: string;
  deadline: string;
  country: string;
  image: string;
  studyLevel: string;
  company?: string;
  savedBy: string[]; // List of user IDs
  views: number;
  createdAt: string;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  createdAt: string;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  createdAt: string;
}

export interface Comment {
  id: string;
  articleId: string;
  userId: string;
  userFullName: string;
  userAvatar?: string;
  comment: string;
  createdAt: string;
}

export interface AdminStats {
  articleCount: number;
  opportunityCount: number;
  newsletterCount: number;
  contactCount: number;
  totalViews: number;
  articlesByViews: { title: string; views: number; slug: string }[];
  categoryDistribution: { name: string; value: number }[];
}
