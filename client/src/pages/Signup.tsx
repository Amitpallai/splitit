"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../context/AuthContext"; // Adjust path if needed
import { useNavigate, Link } from "react-router-dom";
import { toast, Toaster } from "sonner";

const RegisterPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const name = `${firstName} ${lastName}`.trim();
    if (!name) {
      toast.error("Please enter your name");
      return;
    }

    try {
      await signup(name, email, password);
      toast.success("Account created successfully! 🎉");
      navigate("/dashboard");
    } catch (err: any) {
      if (err.message.includes("409")) {
        toast.error("This email is already registered. Please log in.");
      } else {
        toast.error(err.message || "Signup failed ❌");
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-black text-white">
      <Toaster position="top-right" richColors />

      {/* Left Panel */}
      <div className="hidden md:flex w-1/2 flex-col items-center justify-center p-10 bg-gradient-to-b from-purple-600 to-black">
        <div className="max-w-md text-center space-y-6">
          <h1 className="text-3xl font-extrabold">SPLIT<span className="text-purple-500">it</span></h1>
          <h2 className="text-4xl font-extrabold">Get Started with Us</h2>
          <p className="text-gray-300">
            Complete these easy steps to register your account.
          </p>

          {/* Steps */}
          <div className="space-y-3 mt-6 text-left">
            <div className="flex items-center space-x-3 bg-white text-black rounded-xl px-4 py-2">
              <span className="font-bold">1</span>
              <span>Sign up your account</span>
            </div>
            <div className="flex items-center space-x-3 bg-gray-800 rounded-xl px-4 py-2">
              <span className="font-bold text-gray-400">2</span>
              <span className="text-gray-400">Set up your workspace</span>
            </div>
            <div className="flex items-center space-x-3 bg-gray-800 rounded-xl px-4 py-2">
              <span className="font-bold text-gray-400">3</span>
              <span className="text-gray-400">Set up your profile</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full md:w-1/2 flex flex-col justify-center px-6 sm:px-10 md:px-16 py-10">
        <div className="max-w-md w-full mx-auto space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold text-center md:text-left">
            Create Your Account
          </h2>
          <p className="text-gray-400 text-sm text-center md:text-left">
            Enter your personal details to get started.
          </p>

          {/* Form */}
          <form className="space-y-4" onSubmit={handleSubmit} noValidate>
            {/* Name Fields */}
            <div className="flex flex-row sm:space-x-4 space-y-2 sm:space-y-0 gap-2">
              <div className="w-full sm:w-1/2 flex flex-col gap-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  type="text"
                  placeholder="John"
                  className="border-gray-700 text-white"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div className="w-full sm:w-1/2 flex flex-col gap-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Doe"
                  className="border-gray-700 text-white"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="john.doe@example.com"
                className="border-gray-700 text-white"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="border-gray-700 text-white pr-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-white"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Must be at least 8 characters.
              </p>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium"
            >
              Sign Up
            </Button>
          </form>

          {/* Login Redirect */}
          <p className="text-sm text-gray-400 text-center">
            Already have an account?{" "}
            <Link to="/login" className="text-purple-400 hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
