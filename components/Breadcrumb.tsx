import Link from 'next/link';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="mb-8">
      <ol className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
        {items.map((item, index) => (
          <li key={index}>
            {index > 0 && <span className="mr-2">/</span>}
            {item.href ? (
              <Link
                href={item.href}
                className="hover:text-gray-700 dark:hover:text-gray-300 cursor-pointer"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-gray-700 dark:text-gray-300">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}