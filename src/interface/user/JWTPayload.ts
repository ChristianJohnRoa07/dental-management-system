import { JWTPayload } from "jose";

export interface CustomJwtPayload extends JWTPayload {
  id: string;
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  role: string;
}