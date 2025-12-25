"use client";

import { ErrorAlert } from "@/components/alerts/ErrorAlert";
import { agentLoginWithToken } from "@/features/agent/apis/service";
import { handleApiErrors } from "@/utils/api-utils/hanle-api-error";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";

const SecureLogin = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const loginWithToken = async () => {
      const token = searchParams.get("token");
      
      if (!token) {
        ErrorAlert("Invalid Token");
        router.push("/");
        return;
      }

      try {
        const result = await agentLoginWithToken({ token });      
                
        if (result.status === 201) {
          router.push("/dashboard");
        }
      } catch (error) {
        const errorMessage = handleApiErrors(error);
        ErrorAlert(errorMessage);
        router.push("/");
      }
    };

    loginWithToken();
  }, [searchParams, router]);

  return <div>Authenticating...</div>;
};

export default SecureLogin;
