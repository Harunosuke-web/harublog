'use client';

interface DecorativeHeadingProps {
  children: React.ReactNode;
  className?: string;
}

export default function DecorativeHeading({
  children,
  className = "text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl"
}: DecorativeHeadingProps) {
  return (
    <div className="relative pb-3">
      <h2 className={className}>
        {children}
      </h2>
      {/* Decorative elements */}
      <div className="absolute -top-2 -left-2 w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full opacity-60"></div>
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
    </div>
  );
}