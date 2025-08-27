import { ChevronRight, Home } from "lucide-react";
import Link from "next/link";

interface BreadcrumbItem {
  label: string;
  href: string;
  current?: boolean;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex items-center space-x-2 text-sm text-gray-400">
        <li>
          <Link
            href="/"
            className="flex items-center hover:text-orange-500 transition-colors"
            aria-label="Go to homepage"
          >
            <Home className="w-4 h-4" />
          </Link>
        </li>

        {items.map((item, _index) => (
          <li key={item.href} className="flex items-center">
            <ChevronRight className="w-4 h-4 mx-2 text-gray-600" />
            {item.current ? (
              <span className="text-orange-500 font-medium" aria-current="page">
                {item.label}
              </span>
            ) : (
              <Link href={item.href} className="hover:text-orange-500 transition-colors">
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
