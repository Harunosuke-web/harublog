interface PageLayoutProps {
  children: React.ReactNode;
  maxWidth?: 'narrow' | 'medium' | 'wide';
}

export default function PageLayout({ children, maxWidth = 'medium' }: PageLayoutProps) {
  const getMaxWidth = () => {
    switch (maxWidth) {
      case 'narrow':
        return 'max-w-2xl';
      case 'medium':
        return 'max-w-4xl';
      case 'wide':
        return 'max-w-6xl';
      default:
        return 'max-w-4xl';
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-6 lg:px-8 py-24 sm:py-32">
      <main>
        <div className={`mx-auto ${getMaxWidth()}`}>
          {children}
        </div>
      </main>
    </div>
  );
}