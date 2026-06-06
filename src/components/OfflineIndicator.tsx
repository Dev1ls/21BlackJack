import { useEffect, useState } from 'react';
import { useLocale } from '../i18n';

export function OfflineIndicator() {
  const { t } = useLocale();
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-amber-900 px-4 py-2 text-center text-sm font-semibold text-amber-200">
      {t.offline.message}
    </div>
  );
}
