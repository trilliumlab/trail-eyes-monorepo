import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/totp-mfa')({
  component: () => <div>Hello /totp-mfa!</div>,
})
