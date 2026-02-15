import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <h1 className="text-6xl font-bold text-[rgb(var(--muted-foreground))] mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
      <p className="text-[rgb(var(--muted-foreground))] mb-8">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        href="/"
        className="px-6 py-3 rounded-lg bg-[rgb(var(--primary))] text-white font-medium
                   hover:opacity-90 transition-opacity"
      >
        Go Home
      </Link>
    </div>
  );
}
