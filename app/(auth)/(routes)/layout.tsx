"use client";

import { useEffect, useState } from "react";
import { Copy } from "lucide-react";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  const [childrenLoaded, setChildrenLoaded] = useState(false);

  const emailAddress = "guest@guest.com";
  const password = "guest";

  useEffect(() => {
    const loadChildren = async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
      setChildrenLoaded(true);
    };

    loadChildren();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      {children}
      {childrenLoaded && (
        <div className="mt-4 text-base text-foreground border-t-4 p-4 border-indigo-400">
          <div className="text-lg mb-1">Or use a guest account 🙂</div>
          <div className="text-base">
            <div className="font-semibold inline">Email: </div>
            <code
              className="cursor-pointer font-medium bg-primary/10 text-primary hover:text-secondary hover:bg-indigo-500 rounded p-1 transition"
              onClick={() => navigator.clipboard.writeText(emailAddress)}
            >
              {emailAddress}
              <Copy className="ml-1 h-4 w-4 inline" />
            </code>
          </div>
          <div className="text-base mt-1">
            <div className="font-semibold inline">Password: </div>
            <code
              className="cursor-pointer font-medium bg-primary/10 text-primary hover:text-secondary hover:bg-indigo-500 rounded p-1 transition"
              onClick={() => navigator.clipboard.writeText(password)}
            >
              {password}
              <Copy className="ml-1 h-4 w-4 inline" />
            </code>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthLayout;
