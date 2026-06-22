"use client";

import { useEffect } from "react";
import { initTracker, trackPageView } from "@/lib/tracker";

export default function TrackerInit() {
  useEffect(() => {
    initTracker();
    trackPageView();
  }, []);

  return null;
}
