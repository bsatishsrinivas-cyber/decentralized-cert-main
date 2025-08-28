import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { WalletProvider } from "@/lib/wallet-context"
import "./globals.css"

export const metadata: Metadata = {
  title: "CertifyChain - Decentralized Certificate Verification",
  description: "Verify digital certificates on the Stacks blockchain with instant authenticity validation",
  generator: "v0.app",
  keywords: "blockchain, certificate verification, Stacks, decentralized, digital certificates, crypto",
  authors: [{ name: "CertifyChain Team" }],
  openGraph: {
    title: "CertifyChain - Decentralized Certificate Verification",
    description: "Verify digital certificates on the Stacks blockchain with instant authenticity validation",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <WalletProvider>
          {children}
        </WalletProvider>
      </body>
    </html>
  )
}
