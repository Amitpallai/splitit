"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { toast, Toaster } from "sonner"; // ✅ Sonner

const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await login(email, password);
      toast.success("Login successful! 🎉");
      navigate("/dashboard");
    } catch (err: any) {
      toast.error(err.message || "Login failed ❌");
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-black text-white px-4">
      {/* Sonner Toaster */}
      <Toaster position="top-right" richColors />

      {/* Background planets */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-10 right-20 w-96 h-96 bg-purple-700 rounded-full blur-3xl opacity-40 animate-pulse" />
        <div className="absolute bottom-20 left-10 w-80 h-80 bg-purple-500 rounded-full blur-2xl opacity-30 animate-pulse delay-200" />
      </div>

      {/* Card */}
      <div className="w-full max-w-md rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 p-8 shadow-lg">
        <h2 className="text-3xl md:text-2xl font-bold mb-2 text-center">Sign In To SPLIT<span className="text-purple-500">it</span></h2>
        <p className="text-gray-400 text-sm mb-6 text-center">
          Keep it all together and you’ll be fine
        </p>

        <form className="space-y-4" onSubmit={handleSubmit} noValidate>
          {/* Email */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
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
                autoComplete="current-password"
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
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium"
          >
            Sign In
          </Button>
        </form>

        {/* Signup Redirect */}
        <p className="text-sm text-center text-gray-400 mt-6">
          New to SPLITit?{" "}
          <Link to="/signup" className="text-purple-400 hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
