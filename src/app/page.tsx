"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { COOKIE_KEYS } from "@/constants/local-storage-keys";
import { getCookie, deleteCookie } from "cookies-next/client";

export default function HomePage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = getCookie(COOKIE_KEYS.TOKEN);
    const name = getCookie(COOKIE_KEYS.NAME);
    const role = getCookie(COOKIE_KEYS.ROLE);

    if (!token) {
      router.push("/login");
    } else {
      setIsAuthenticated(true);
      setUser({
        name: name as string,
        role: role as string,
      });
    }
  }, [router]);

  const handleLogout = () => {
    deleteCookie(COOKIE_KEYS.TOKEN, { path: "/" });
    deleteCookie(COOKIE_KEYS.EMAIL, { path: "/" });
    deleteCookie(COOKIE_KEYS.NAME, { path: "/" });
    deleteCookie(COOKIE_KEYS.ROLE, { path: "/" });
    router.push("/login");
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <header className="border-b p-4 bg-white shadow-sm">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Dashboard</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm bg-red-500 text-white hover:bg-red-600 rounded-md"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-6">
          <h2 className="text-3xl font-semibold">
            Welcome, {user?.name || "User"}!
          </h2>
          <p className="text-lg text-gray-600">
            <span className="font-medium">{user?.role || "N/A"}</span>
          </p>
        </div>
      </main>
    </div>
  );
}