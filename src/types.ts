export interface AppFeature {
  id: string;
  title: string;
  description?: string;
}

export interface AppScreenshot {
  id: string;
  url: string;
  name?: string;
  caption?: string;
}

export interface Application {
  id: string;
  name: string;
  slug: string;
  category: string;
  version: string;
  packageName: string;
  minAndroid: string;
  targetAndroid: string;
  sha256Checksum: string;
  shortDescription: string;
  fullDescription: string;
  features: AppFeature[];
  iconUrl: string;
  apkUrl: string;
  apkSizeFormatted: string;
  apkFileName: string;
  webAppUrl?: string;
  screenshots: AppScreenshot[];
  published: boolean;
  downloads: number;
  likes: number;
  ratingAverage: number;
  ratingCount: number;
  changelog?: string;
  createdAt: number;
  updatedAt: number;
}

export type AppSortOption = 'latest' | 'downloads' | 'rating' | 'likes';
export type ViewState = 'home' | 'apps' | 'app-detail' | 'about' | 'admin';

export interface AdminUser {
  email: string;
  name: string;
  signedInAt: number;
}
