import type { Metadata } from "next";
import "@/styles/globals.css";
import InactivityTracker from "@/components/inactive-tracker";
import { ToastContainer } from "@/components/toast/toast-container"
export const metadata: Metadata = {
  title: "Renstra Stikom PGRI Banyuwangi", 
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <InactivityTracker />
        {children}
        <ToastContainer />
      </body>
    </html>
  );
}
