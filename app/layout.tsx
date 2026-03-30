import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI HSA & FSA Optimization Advisor",
  description: "Maximize your triple-tax advantage with HSA investment strategy and FSA optimization",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col h-full">{children}</body>
    </html>
  );
}
