"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import "../scss/page-loader.scss";
import { useEffect, useState } from "react";
import { handleApiErrors } from "@/utils/api-utils/hanle-api-error";
import { ErrorAlert } from "./alerts/ErrorAlert";
import { getSiteLogo } from "@/features/common/setting/service";
import logo from "../../public/assests/logo/logo.jpeg";

const containerVariants: any = {
  initial: { opacity: 1 },
  animate: {
    opacity: 0,
    transition: {
      delay: 0.5,
      duration: 0.5,
      ease: "easeInOut",
    },
  },
};

const logoVariants: any = {
  initial: { scale: 0.8, opacity: 0, y: 50 }, // start small, invisible, pushed down
  animate: {
    scale: [0.8, 1], // smooth zoom
    opacity: [0, 1], // fade in
    y: [50, 0], // slide up
    transition: {
      duration: 1,
      ease: "easeOut",
    },
  },
};

const PageLoader = () => {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const resultSiteLogo: any = await getSiteLogo();
        setLogoUrl(resultSiteLogo.data?.payload?.metavalue || null);
      } catch (error) {
        const errorMessage = handleApiErrors(error);
        ErrorAlert(errorMessage);
      }
    })();
  }, []);

  return (
    <motion.div
      className="page-loader"
      variants={containerVariants}
      initial="initial"
      animate="animate"
    >
      <motion.div
        variants={logoVariants}
        initial="initial"
        animate="animate"
        className="loader-logo"
      >
        {logoUrl ? (
          <Image
            // src={logoUrl}
            src={logo}
            alt="Logo"
            priority
            width={280}
            height={120}
            style={{ objectFit: "contain" }}
          />
        ) : null}
      </motion.div>
    </motion.div>
  );
};

export default PageLoader;
