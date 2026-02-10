
export enum AlertSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export type UserRole = 'admin' | 'editor';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  url: string;
  category: string;
  domain: string;
  impactScore: number;
  timeAgo: string;
}

export interface NewsTrends {
  politics: number;
  economy: number;
  security: number;
  health: number;
  education: number;
  totalVolume: number;
}

export interface HeadlineAnalysis {
  text: string;
  engagementScore: number;
  ethicsScore: number;
  clarityScore: number;
  critique: string;
  improvement: string;
}

export interface JournalisticAlert {
  id: string;
  timestamp: string;
  title: string;
  description: string;
  severity: AlertSeverity;
  source: string;
  sourceUrl: string;
  involvedParties: string[];
  relevanceReason: string;
  investigativeAngle: string;
  confidenceScore: number;
}

export interface EditorialPitch {
  id: string;
  title: string;
  context: string;
  keyQuestions: string[];
  recommendedSources: string[];
  suggestedFormats: string[];
  impactLevel: 'local' | 'regional' | 'national';
  urgency: 'low' | 'medium' | 'high';
  tags: string[];
}

export interface EditorialProfile {
  region: 'vale' | 'bragantina' | 'litoral' | 'all';
  vehicleType: 'digital' | 'impresso' | 'radio' | 'tv';
  editorialLine: 'informativo' | 'investigativo' | 'comunitario' | 'geral';
  priorityThemes: string[];
  targetAudience: string;
}

export interface EditorialCorrection {
  originalText: string;
  correctedText: string;
  errorsFound: string[];
  styleSuggestions: string[];
  journalisticToneScore: number;
}

export type ViewType = 'dashboard' | 'pitches' | 'correction' | 'profile' | 'admin-users' | 'headline-predictor' | 'headline-generator';
