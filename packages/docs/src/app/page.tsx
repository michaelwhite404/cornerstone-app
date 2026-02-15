export default function HomePage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-4">Cornerstone API Documentation</h1>
        <p className="text-lg text-[rgb(var(--muted-foreground))]">
          Welcome to the Cornerstone School Management Platform API documentation. This guide will
          help you integrate with our REST API.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <QuickStartCard
          title="Authentication"
          description="Learn how to authenticate your API requests using JWT tokens."
          href="/concepts/authentication"
        />
        <QuickStartCard
          title="Pagination"
          description="Understand how to paginate through large result sets."
          href="/concepts/pagination"
        />
        <QuickStartCard
          title="Filtering"
          description="Filter and sort API responses to get exactly what you need."
          href="/concepts/filtering"
        />
        <QuickStartCard
          title="Error Handling"
          description="Handle errors gracefully with our standardized error responses."
          href="/concepts/errors"
        />
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Base URL</h2>
        <div className="bg-[rgb(var(--muted))] rounded-lg p-4 font-mono text-sm">
          https://api.cornerstone-schools.org/v2
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Quick Example</h2>
        <pre className="bg-slate-900 text-slate-100 rounded-lg p-4 overflow-x-auto text-sm">
          <code>{`curl -X GET "https://api.cornerstone-schools.org/v2/students" \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  -H "Content-Type: application/json"`}</code>
        </pre>
      </div>
    </div>
  );
}

function QuickStartCard({
  title,
  description,
  href,
}: {
  title: string;
  description: string;
  href: string;
}) {
  return (
    <a
      href={href}
      className="block p-6 rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))]
                 hover:border-[rgb(var(--primary))] hover:shadow-md transition-all"
    >
      <h3 className="font-semibold mb-2">{title}</h3>
      <p className="text-sm text-[rgb(var(--muted-foreground))]">{description}</p>
    </a>
  );
}
