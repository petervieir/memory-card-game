"use client";

import { Connect } from "@stacks/connect-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { Toaster } from "react-hot-toast";
import { useState, useEffect } from "react";
import { WalletProvider } from "@/contexts/WalletContext";

export function Providers({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            retry: 3,
          },
        },
      })
  );

  // Debug Connect provider loading
  useEffect(() => {
    console.log("🔌 Providers: Connect provider mounted");
    console.log(
      "🔌 Auth origin:",
      process.env.NEXT_PUBLIC_AUTH_ORIGIN || "http://localhost:3000"
    );

    // Check if window providers are available
    const checkProviders = () => {
      if (typeof window !== "undefined") {
        console.log("🔌 Window providers check:", {
          StacksProvider: !!(window as unknown as Record<string, unknown>)
            .StacksProvider,
          HiroWalletProvider: !!(window as unknown as Record<string, unknown>)
            .HiroWalletProvider,
          LeatherProvider: !!(window as unknown as Record<string, unknown>)
            .LeatherProvider,
        });
      }
    };

    // Check immediately and after a delay
    checkProviders();
    const timeout = setTimeout(checkProviders, 2000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <WalletProvider>
          <Connect
            authOptions={{
              appDetails: {
                name: "Stacks dApp Template (Next.js)",
                icon: `${process.env.NEXT_PUBLIC_AUTH_ORIGIN || "http://localhost:3000"}/icon.png`,
              },
            }}
          >
            {children}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: "hsl(var(--background))",
                  color: "hsl(var(--foreground))",
                  border: "1px solid hsl(var(--border))",
                },
              }}
            />
          </Connect>
        </WalletProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
