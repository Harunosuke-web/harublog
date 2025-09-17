'use client';

export type ViewType = 'list' | 'grid' | 'tight';

interface ViewOption {
  key: ViewType;
  label: string;
  icon: React.ReactNode;
}

const VIEW_OPTIONS: Record<ViewType, ViewOption> = {
  tight: {
    key: 'tight',
    label: 'コンパクト表示',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M2 9h20v2H2V9zm0 4h20v2H2v-2zm8-8h4v2h-4V5zm0 12h4v2h-4v-2zM6 7.5L4.5 6 6 4.5 7.5 6 6 7.5zm0 9L4.5 15 6 13.5 7.5 15 6 16.5zm12-9L16.5 6 18 4.5 19.5 6 18 7.5zm0 9L16.5 15 18 13.5 19.5 15 18 16.5z"/>
      </svg>
    )
  },
  list: {
    key: 'list',
    label: 'リスト表示',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M3 6h18v2H3V6zm0 5h18v2H3v-2zm0 5h18v2H3v-2z"/>
      </svg>
    )
  },
  grid: {
    key: 'grid',
    label: 'ギャラリー表示',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M4 4h7v7H4V4zm9 0h7v7h-7V4zm-9 9h7v7H4v-7zm9 0h7v7h-7v-7z"/>
      </svg>
    )
  }
};

interface ViewToggleProps {
  currentView: ViewType;
  availableViews: ViewType[];
  onViewChange: (view: ViewType) => void;
}

export default function ViewToggle({ currentView, availableViews, onViewChange }: ViewToggleProps) {
  // availableViewsが未定義の場合のデフォルト値を設定
  const views = availableViews || ['list', 'tight'];

  return (
    <div className="flex items-center gap-1 rounded-md p-1">
      {views.map((viewType) => {
        const option = VIEW_OPTIONS[viewType];
        const isActive = currentView === viewType;

        return (
          <button
            key={viewType}
            onClick={() => onViewChange(viewType)}
            className={`p-2 rounded-lg transition-colors fast-tooltip ${
              isActive
                ? 'text-green-500 dark:text-green-400 bg-green-50 dark:bg-green-900/20'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
            data-tooltip={option.label}
          >
            {option.icon}
          </button>
        );
      })}
    </div>
  );
}