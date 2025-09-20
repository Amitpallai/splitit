"use client";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { DarkModeToggle } from "./DarkModeToggle";
import { Menu, X } from "lucide-react"; // icons

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full z-50">
      <nav className="max-w-5xl flex items-center justify-between mx-auto mt-5 px-6 py-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-sm">
        
        {/* Logo */}
        <Link to="/" className="text-2xl font-extrabold tracking-tight">
          <span className="text-white">SPLIT</span>
          <span className="text-purple-300">it</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-4">
          <Link
            to="/dashboard"
            className="px-4 py-2 text-sm font-medium rounded-full bg-black text-white hover:bg-gray-900 transition"
          >
            Get Started
          </Link>
          <DarkModeToggle />
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden flex flex-col items-center mt-3 px-6 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl mx-4 space-y-4">
          <Link
            to="/dashboard"
            className="w-full text-center px-4 py-2 text-sm font-medium rounded-full bg-black text-white hover:bg-gray-900 transition"
            onClick={() => setIsOpen(false)}
          >
            Get Started
          </Link>
          <DarkModeToggle />
        </div>
      )}
    </header>
  );
};

export default Navbar;
