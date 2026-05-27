import React from 'react';
import IncidentSummaryCard from '@/components/ui/horizontal-bar-chart';

export function IncidentSummaryCardDemoPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-neutral-900 p-4 transition-colors duration-300">
      <IncidentSummaryCard />
    </div>
  );
}

export default IncidentSummaryCardDemoPage;
