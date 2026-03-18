"use client"

import PageTransitionY from "../MotionComponents/PageTransitionY"

export default function ClientProvidersWrapper({ children }: { children: React.ReactNode }) {
  return <PageTransitionY>{children}</PageTransitionY>
}
