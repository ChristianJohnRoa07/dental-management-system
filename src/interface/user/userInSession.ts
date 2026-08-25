export interface UserSession {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  role: string;
  isVerified: boolean;
  accessToken: string;
}