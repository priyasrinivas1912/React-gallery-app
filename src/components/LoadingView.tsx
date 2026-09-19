import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingViewProps {
  message?: string;
  subtext?: string;
  fullScreen?: boolean;
}

export const LoadingView: React.FC<LoadingViewProps> = ({
  message = 'Loading Gallery...',
  subtext = 'Fetching photos from Picsum API',
  fullScreen = false,
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 text-center select-none ${
        fullScreen ? 'min-h-[400px] flex-1' : 'py-12'
      }`}
    >
      <div className="relative mb-4">
        <div className="w-12 h-12 rounded-2xl bg-blue-500/10 dark:bg-blue-500/20 flex items-center justify-center">
          <Loader2 className="w-6 h-6 text-blue-600 dark:text-blue-400 animate-spin" />
        </div>
      </div>
      <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{message}</p>
      {subtext && <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{subtext}</p>}
    </div>
  );
};
