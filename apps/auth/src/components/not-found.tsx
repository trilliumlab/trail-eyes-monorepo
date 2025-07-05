import { Button } from '@repo/ui/components/button';
import { Link, type LinkOptions } from '@tanstack/react-router';
import { FileQuestion } from 'lucide-react';

export default function NotFound({ homepage }: { homepage: LinkOptions['to'] }) {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
      <div className="container px-4 md:px-6 py-8 flex flex-col items-center space-y-4 text-center">
        <FileQuestion className="w-24 h-24 text-muted-foreground animate-pulse" />
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-4">
          <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl">404</h1>
          <div className="hidden sm:block w-px h-12 bg-border" aria-hidden="true" />
          <h2 className="text-xl font-semibold tracking-tight sm:text-2xl md:text-3xl">
            Page Not Found
          </h2>
        </div>
        <p className="mx-auto max-w-[700px] text-muted-foreground md:text-lg">
          We're sorry, the page you requested could not be found. Please check the URL or try
          navigating back to the homepage.
        </p>
        <Button asChild className="mt-4">
          <Link to={homepage}>Return to Homepage</Link>
        </Button>
      </div>
    </main>
  );
}
