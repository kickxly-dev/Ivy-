"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Sign-up and sign-in are the same flow with magic links
export default function SignUpPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/sign-in");
  }, [router]);
  return null;
}
