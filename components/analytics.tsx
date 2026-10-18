"use client";
import { useEffect, useState } from "react";
import { GoogleAnalytics } from "@next/third-parties/google";

export function Analytics({ nonce }: { nonce?: string }) {
  const [allowed, setAllowed] = useState(false);
  useEffect(() => {
    setAllowed(
      navigator.doNotTrack !== "1" &&
        navigator.doNotTrack !== "yes" &&
        !(navigator as Navigator & { globalPrivacyControl?: boolean })
          .globalPrivacyControl,
    );
  }, []);
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  if (!allowed || !gaId || process.env.NODE_ENV !== "production") return null;
  return <GoogleAnalytics gaId={gaId} nonce={nonce} />;
}
