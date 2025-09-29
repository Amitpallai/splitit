import { Link } from "react-router-dom";
const Hero = () => {
  return (
    <div
      className="h-screen w-full flex flex-col items-center justify-center text-center 
                 bg-gradient-to-b from-purple-900 via-white to-white 
                 dark:via-black dark:to-black px-4 gap-5"
    >
      <h1
        className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl 
                   font-bold text-black dark:text-white"
      >
        Welcome to SPLIT<span className="text-purple-600">it</span>
      </h1>

      <Link
        to="/dashboard"
        className=" text-center px-4 py-2 text-sm font-medium rounded-full bg-purple-900 text-white dark:bg-white  dark:text-black hover:bg-gray-900 transition"
      >
        Get Started
      </Link>

    </div>
  );
};

export default Hero;
