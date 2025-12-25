"use client";

import { useEffect } from "react";

export default function DisableInspect() {
  useEffect(() => {
    document.addEventListener("contextmenu", (e) => e.preventDefault());

    const disableKeys = (e: any) => {
      if (
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && ["I", "C", "J"].includes(e.key)) ||
        (e.ctrlKey && e.key === "U") ||
        (e.ctrlKey && e.key === "S") ||
        (e.metaKey && e.key === "S") ||
        e.key === "PrintScreen"
      ) {
        e.preventDefault();
      }
    };

    document.addEventListener("keydown", disableKeys);
    document.addEventListener("selectstart", (e) => e.preventDefault());
    document.addEventListener("dragstart", (e) => e.preventDefault());

    return () => {
      document.removeEventListener("contextmenu", () => {});
      document.removeEventListener("keydown", disableKeys);
    };
  }, []);

  return null;
}
