import { User } from "./user";

export interface UserFormState {
  success: boolean;
  fieldErrors?: {
    email: string[];
    password: string[];
  };
  serverError?: string;
  data?: User;
}
