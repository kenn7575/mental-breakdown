import { UUID } from "crypto";

// User
export interface User {
  type: "node";
  id: UUID;
  email: string;
  password: string;
  joined_date: string;
  email_notifications: boolean;
  email_verified: boolean;
  color_theme: string;
  xp: number;
  firstname: string;
  lastname: string;
  username: string;
  last_active: string;
  bio: string;
  profile_picture: string;

  //additional properties
  friends?: string[];
}
