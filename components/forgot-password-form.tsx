"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, CheckCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "@/lib/store";

// Define validation schema with Zod
const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Please enter a valid email address" })
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

interface ForgotPasswordFormProps extends React.ComponentProps<"form"> {
  userType: "admin" | "merchant";
}

export function ForgotPasswordForm({
  className,
  userType,
  ...props
}: ForgotPasswordFormProps) {
  const { requestPasswordReset, isLoading, error, clearError } = useAuthStore();
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors },
    getValues
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: ""
    }
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    try {
      await requestPasswordReset(data.email, userType);
      setIsSubmitted(true);
    } catch (error) {
      // Error is handled by the store
    }
  };

  if (isSubmitted) {
    return (
      <div className={cn("flex flex-col gap-6", className)}>
        <div className="flex flex-col items-center justify-center text-center gap-2">
          <CheckCircle className="h-12 w-12 text-green-500 mb-2" />
          <h1 className="text-2xl font-bold">Check Your Email</h1>
          <p className="text-muted-foreground text-sm">
            We've sent a password reset link to:
          </p>
          <p className="font-medium">{getValues("email")}</p>
        </div>
        
        <div className="bg-muted/50 rounded-lg p-4 text-sm">
          <p>
            The link will expire in {userType === "admin" ? "60" : "24"} minutes. 
            If you don't see the email, check your spam folder.
          </p>
        </div>
        
        <div className="flex flex-col gap-4 mt-4">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              setIsSubmitted(false);
              clearError();
            }}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to reset form
          </Button>
          
          <Link
            href={userType === "admin" ? "/login/admin" : "/login/merchant"}
            className="text-center text-sm text-muted-foreground hover:underline"
          >
            Return to login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form 
      className={cn("flex flex-col gap-6", className)} 
      {...props}
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">
          Forgot Password
        </h1>
        <p className="text-muted-foreground text-sm text-balance">
          {userType === "admin" 
            ? "Enter your admin email address to receive a password reset link" 
            : "Enter your email address and we'll send you a link to reset your password"
          }
        </p>
      </div>
      
      {error && (
        <div className="bg-destructive/15 text-destructive p-3 rounded-md text-sm">
          {error}
        </div>
      )}
      
      <div className="grid gap-4">
        <div className="grid gap-3">
          <Label htmlFor="email">Email Address</Label>
          <Input 
            id="email" 
            type="email" 
            placeholder={userType === "admin" ? "admin@example.com" : "you@example.com"} 
            {...register("email")}
            aria-invalid={errors.email ? "true" : "false"}
          />
          {errors.email && (
            <p className="text-destructive text-sm">{errors.email.message}</p>
          )}
        </div>
        
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending Reset Link...
            </>
          ) : (
            "Send Reset Link"
          )}
        </Button>
        
        <div className="text-center">
          <Link
            href={userType === "admin" ? "/login/admin" : "/login/merchant"}
            className="text-sm text-muted-foreground hover:underline"
          >
            <ArrowLeft className="inline mr-1 h-3 w-3" />
            Back to login
          </Link>
        </div>
      </div>
    </form>
  );
}