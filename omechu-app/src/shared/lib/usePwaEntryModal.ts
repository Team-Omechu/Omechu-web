"use client";

import { useEffect, useState } from "react";

const SEEN_KEY = "pwa:onboardingModalSeen";
const CONSENT_KEY = "pwa:marketingConsent";

type Consent = "unset" | "granted" | "denied";

export function usePwaEntryModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // 최초 1회만
    const seen = window.localStorage.getItem(SEEN_KEY);
    if (seen !== "1") setOpen(true);
  }, []);

  const closeAs = (consent: Consent) => {
    window.localStorage.setItem(SEEN_KEY, "1");
    window.localStorage.setItem(CONSENT_KEY, consent);
    setOpen(false);
  };

  const skip = () => closeAs("denied");
  const agree = () => closeAs("granted");

  return { open, setOpen, skip, agree };
}
