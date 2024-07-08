"use client";
import { Button } from "@/components/ui/button";
import { loginUser } from "../../actions/loginUser";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useEffect } from "react";
import { useFormState } from "react-dom";
import { UserFormState, User } from "@/lib/types";

const initialState: UserFormState = {
  success: false,
};

export default function Login() {
  const [state, formAction] = useFormState(loginUser, initialState);

  useEffect(() => {
    console.log("🚀 ~ Login ~ state:", state);
  }, [state]);

  return (
    <form action={formAction}>
      <Card className="w-full max-w-sm border-primary/60 ">
        <CardHeader>
          <CardTitle className="text-2xl">Login to your account</CardTitle>
          <CardDescription>
            Enter your email and password below to sign in to your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <p>
            {state.serverError && (
              <span className="text-red-500 font-medium text-sm">
                {state.serverError}
              </span>
            )}
          </p>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              name="email"
              placeholder="m@example.com"
              required
            />
            <p>
              {state.fieldErrors?.email && (
                <span className="text-red-500 font-medium text-sm">
                  {state.fieldErrors.email}
                </span>
              )}
            </p>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" required />
            <p>
              {state.fieldErrors?.password && (
                <span className="text-red-500 font-medium text-sm">
                  {state.fieldErrors.password}
                </span>
              )}
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full ">
            Sign up
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
