/*
Previous loading component code (three bouncing dots animation):

export default function Loading() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="relative w-16 h-4">
        <div
          className="absolute top-0 left-0 w-3 h-3 bg-blue-500 rounded-full"
          style={{
            animation: "shift 1.5s infinite ease-in-out",
            animationDelay: "0s",
          }}
        ></div>
        <div
          className="absolute top-0 left-0 w-3 h-3 bg-blue-500 rounded-full"
          style={{
            animation: "shift 1.5s infinite ease-in-out",
            animationDelay: "0.5s",
          }}
        ></div>
        <div
          className="absolute top-0 left-0 w-3 h-3 bg-blue-500 rounded-full"
          style={{
            animation: "shift 1.5s infinite ease-in-out",
            animationDelay: "1s",
          }}
        ></div>
      </div>
    </div>
  );
}
*/

"use client";

import { useState, useEffect } from "react";

export default function Loading() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.random() * 10 + 5; // Random increment for realism
      });
    }, 200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-white text-lg font-semibold">
          Loading....{Math.min(Math.round(progress), 100)}%
        </p>
      </div>
    </div>
  );
}
