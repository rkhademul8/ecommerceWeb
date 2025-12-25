"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { getJWT, isTokenValid } from "@/features/auth/service";

const AuthCheck = () => {
  const router = useRouter();

  useEffect(() => {
    const token = getJWT();

    if (!token || !isTokenValid()) {
      router.push("/");
    }
  }, [router]);

  return null;
};

export default AuthCheck;
