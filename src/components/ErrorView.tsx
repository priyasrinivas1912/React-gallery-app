import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { AppButton } from './AppButton';

interface ErrorViewProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  fullScreen?: boolean;
}

export const ErrorView: React.FC<ErrorViewProps> = ({
  title = 'Unable to Load Content',
  message = 'We encountered an issue fetching data. Please check your connection.',
  onRetry,
  fullScreen = false,
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-6 text-center select-none ${
        fullScreen ? 'min-h-[400px] flex-1' : 'py-10'
      }`}
    >
      <div className="w-12 h-12 rounded-2xl bg-rose-500/10 dark:bg-rose-500/20 flex items-center justify-center mb-3">
        <AlertCircle className="w-6 h-6 text-rose-600 dark:text-rose-400" />
      </div>

      <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">{title}</h3>
      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs mb-5">
        {message}
      </p>

      {onRetry && (
        <div className="w-auto min-w-[140px]">
          <AppButton
            title="Try Again"
            variant="outline"
            size="sm"
            icon={<RefreshCw className="w-3.5 h-3.5" />}
            onClick={onRetry}
            fullWidth={false}
          />
        </div>
      )}
    </div>
  );
};
