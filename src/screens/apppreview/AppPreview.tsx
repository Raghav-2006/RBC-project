import { useApp } from '../../context/AppContext';
import type { AppVersion } from '../VersionChooser';
import PhoneFrame from './PhoneFrame';
import AppDashboard from './AppDashboard';
import Button from '../../components/ui/Button';

interface AppPreviewProps {
  version: AppVersion;
  onBack: () => void;
}

export default function AppPreview({ version, onBack }: AppPreviewProps) {
  const { t } = useApp();

  const versionLabels: Record<AppVersion, string> = {
    student: t('student'),
    regular: t('regular'),
    senior: t('senior'),
  };

  return (
    <div className="h-full bg-rbc-bg flex flex-col">
      <div className="flex items-center justify-between px-6 py-4">
        <Button variant="ghost" onClick={onBack} size="sm">
          ← {t('back')}
        </Button>
        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
            version === 'senior' ? 'bg-amber-100 text-amber-700' :
            'bg-rbc-bright-lightest text-rbc-blue'
          }`}>
            {versionLabels[version]}
          </span>
        </div>
      </div>

      <div className="flex-1 min-h-0">
        <PhoneFrame>
          <AppDashboard version={version} />
        </PhoneFrame>
      </div>
    </div>
  );
}
