export type UserRole = 'farmer' | 'consumer' | 'manufacturer' | 'undefined';

export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  image?: string;
  // Custom properties
  role?: UserRole;
}