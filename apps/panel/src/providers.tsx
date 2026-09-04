import { AuthQueryProvider } from "@daveyplate/better-auth-tanstack"
import { AuthUIProviderTanstack } from "@daveyplate/better-auth-ui/tanstack"
import { Link } from "@tanstack/react-router";
import { useRouter } from "@tanstack/react-router"
import type { ReactNode } from "react"
import { Toaster } from "@repo/ui/components/sonner";
import { authClient } from "./backend";
import { ThemeProvider } from "@repo/ui/components/theme";

export function Providers({ children }: { children: ReactNode }) {
    const router = useRouter()

    return (
            <AuthQueryProvider>
                <ThemeProvider>
                    <AuthUIProviderTanstack
                        authClient={authClient}
                        navigate={(href) => router.navigate({ href })}
                        replace={(href) => router.navigate({ href, replace: true })}
                        Link={({ href, ...props }) => <Link to={href} {...props} />}
                        signUpFields={["name", "tier"]}
                        additionalFields={{
                            tier: {
                                label: "Account Tier",
                                placeholder: "2 or 3",
                                required: true,
                                type: "string",
                                validate: async (value) => value === "2" || value === "3",
                            },
                        }}
                    >
                        {children}

                        <Toaster />
                    </AuthUIProviderTanstack>
                </ThemeProvider>
            </AuthQueryProvider>
    )
}
