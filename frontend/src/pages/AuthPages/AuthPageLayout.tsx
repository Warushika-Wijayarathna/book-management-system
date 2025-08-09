import React from "react";
import GridShape from "../../components/common/GridShape";
import { Link } from "react-router";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen bg-white dark:bg-gray-900">
      <div className="relative flex flex-col lg:flex-row min-h-screen">
        {/* Auth Form Section */}
        <div className="flex flex-col flex-1 p-4 sm:p-6 lg:w-1/2">
          {/* Mobile Logo - Only shown on mobile */}
          <div className="flex justify-center mb-6 lg:hidden">
            <Link to="/" className="block">
              <img
                width={180}
                height={38}
                src="/images/logo/auth-logo.png"
                alt="Logo"
                className="max-w-[180px] h-auto"
              />
            </Link>
          </div>

          {/* Form Content */}
          <div className="flex-1 flex items-center justify-center max-w-md mx-auto w-full">
            {children}
          </div>

          {/* Mobile Footer Text */}
          <div className="mt-8 text-center lg:hidden">
            <p className="text-xs text-gray-500 dark:text-gray-400 px-4">
              Connecting Readers, Sharing Stories: Your Book Club Community
            </p>
          </div>
        </div>

        {/* Branding Section - Hidden on mobile */}
        <div className="hidden lg:flex items-center w-1/2 bg-blue-200 dark:bg-white/5">
          <div className="relative flex items-center justify-center z-1 w-full">
            <GridShape />
            <div className="flex flex-col items-center max-w-xs text-center">
              <Link to="/" className="block mb-4">
                <img
                  width={231}
                  height={48}
                  src="/images/logo/auth-logo.png"
                  alt="Logo"
                />
              </Link>
              <p className="text-center text-gray-700 dark:text-gray-300">
                Connecting Readers, Sharing Stories: Your Book Club Community
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
