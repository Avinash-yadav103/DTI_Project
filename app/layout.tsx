import "./globals.css";
import { UserProvider } from "@/context/UserContext";

export const metadata = {
  title: "Hackaccino 3.0",
  description: "A Next.js application",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <UserProvider>
          {children}
        </UserProvider>
      </body>
    </html>
  );
}