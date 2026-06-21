"use client";

import { useEffect } from "react";

export function Bootstrap() {
  useEffect(() => {
    // Trigger seed on first load (idempotent)
    fetch("/api/seed", { method: "POST" }).catch(() => {});
  }, []);
  return null;
}
