import type { ReactNode } from 'react';

interface Tab {
  id: string;
  label: string;
  icon?: ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (id: string) => void;
  noBorder?: boolean;
}

export function Tabs({ tabs, activeTab, onChange, noBorder = false }: TabsProps) {
  return (
    <div className={`flex gap-1 ${!noBorder ? 'border-b border-border mb-6' : ''}`}>
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={
              isActive
                ? 'flex items-center gap-1.5 px-4 py-2.5 text-[13px] font-semibold text-primary border-b-2 border-accent -mb-px bg-transparent transition-colors cursor-pointer'
                : 'flex items-center gap-1.5 px-4 py-2.5 text-[13px] text-secondary border-b-2 border-transparent -mb-px bg-transparent hover:text-primary transition-colors cursor-pointer'
            }
          >
            {tab.icon}
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
