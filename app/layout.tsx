import type { Metadata } from "next";
import "./globals.css"
import ClientProvider from "@/ClientProvider";
import UserContext from "@/context/UserContext";
export const metadata: Metadata = {
  title: "Learning TypeScript",
  description: "This is my first TypeScript project in Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <ClientProvider>
          <UserContext>
               {children}
          </UserContext>
        </ClientProvider>
        </body>
    </html>
  );
}
