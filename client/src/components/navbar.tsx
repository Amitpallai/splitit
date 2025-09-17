"use client";
import React from "react";
import { Link } from "react-router-dom";
import { DarkModeToggle } from "./DarkModeToggle";

const Navbar: React.FC = () => {
    return (
        <header className="fixed top-0 left-0 w-full z-50">
            <nav
                className="mx-auto max-w-5xl flex items-center justify-between mt-5 px-6 py-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-sm"
            >
                <Link to="/" className="text-2xl font-extrabold tracking-tight">
                    <span className="text-white">SPLIT</span>
                    <span className="text-white">it</span>
                </Link>

                <div className="flex items-center space-x-4">
                    <Link to="/login" className="text-sm font-medium text-gray-200 hover:text-white transition">
                        Sign in
                    </Link>

                    <Link to="/dashboard" className="px-4 py-2 text-sm font-medium rounded-full bg-black text-white hover:bg-gray-900 transition">
                        Get Started
                    </Link>
                    <DarkModeToggle/>
                </div>
            </nav>
        </header>
    );
};

export default Navbar;
