import { cn } from "@repo/ui/lib/utils"
import { AuthCard } from "@daveyplate/better-auth-ui"
import { createFileRoute } from "@tanstack/react-router"
import { NavBar } from "~/components/nav/nav-bar"

export const Route = createFileRoute("/auth/$pathname")({
    component: RouteComponent
})

function RouteComponent() {
    const { pathname } = Route.useParams()


    return (
      <>
          <NavBar/>
      <main className="flex grow flex-col items-center justify-center gap-4 p-4">
          <AuthCard pathname={pathname} />
      </main>
      </>
    )
}
