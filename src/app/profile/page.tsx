"use client";
import React, { useEffect, useState } from "react";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { useRouter } from "next/navigation";
import api from "@/lib/apiClient";
import { getApiBaseUrl } from "@/lib/getApiBaseUrl";
import Image from "next/image";

export default function ProfilePage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function setUser() {
      try {
        const res = await api.get("/api/users/current-user");
        const data = res.data;
        setUsername(data.user.username);
      } catch (err) {
        console.error("Error fetching user:", err);
        // router.push("/login");
      } finally {
        setLoading(false);
      }
    }

    setUser();
  }, []);

  const logout = async () => {
    try {
      await api.get("/api/users/logout");
      router.push("/");
    } catch (error: any) {
      console.error(error.message);
    }
  };
  return (
    <div>
      <Navbar />
      <section className="text-gray-600 ml-20 sm:ml-64 my-10 body-font">
        <div className="container px-5 mx-auto">
          <div className="flex flex-col items-end">
            <button
              className="bg-red-500 sm:mt-4 hover:bg-red-600 text-white text-xs sm:font-bold py-3 px-2 sm:px-7 rounded"
              onClick={logout}
            >
              Logout
            </button>
          </div>
          <Image
            className="w-36 h-36 mx-auto mb-5 object-cover object-center rounded-full"
            alt="profile"
            src="/download.png"
            width={100}
            height={100}
          />
          <div className="mx-auto max-w-screen-xl px-4 md:px-8">
            <div className="mb-8 md:mb-12">
              <h2 className="mb-4 text-center text-2xl font-bold text-gray-800 md:mb-6 lg:text-3xl">
                {loading ? "Loading..." : username}
              </h2>
              <p className="mx-auto max-w-screen-md text-center text-gray-500 md:text-lg">
                <span className="text-red-500 font-bold">Passionate</span> about
                learning new languages and exploring new cultures.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 ml-72 md:grid-cols-3 lg:gap-8">
              <div className="flex flex-col items-center justify-center rounded-lg bg-gray-100 px-8 lg:p-8">
                <div className="text-xl font-bold text-red-500 sm:text-2xl md:text-3xl">
                  1
                  <Image
                    className="inline-flex h-8 w-8 pb-1"
                    src="https://cdn-icons-png.flaticon.com/128/4325/4325956.png"
                    alt="Streak"
                    height={100}
                    width={100}
                  />
                </div>
                <div className="text-sm font-semibold sm:text-base">
                  Streaks
                </div>
              </div>

              <div className="flex flex-col items-center justify-center rounded-lg bg-gray-100 p-4 md:p-8">
                <div className="text-xl font-bold text-red-500 sm:text-2xl md:text-2xl">
                  100 XP
                </div>
                <div className="text-sm font-semibold sm:text-base">Points</div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
