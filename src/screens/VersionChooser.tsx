import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

export type AppVersion = 'student' | 'regular' | 'senior';

interface VersionChooserProps {
  onSelectVersion: (version: AppVersion) => void;
  onBack: () => void;
}

export default function VersionChooser({ onSelectVersion, onBack }: VersionChooserProps) {
  const { t } = useApp();

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } },
  };

  const versions = [
    {
      id: 'student' as AppVersion,
      emoji: '🎓',
      color: 'from-blue-400 to-rbc-bright',
    },
    {
      id: 'regular' as AppVersion,
      emoji: '📱',
      color: 'from-rbc-blue to-rbc-bright',
    },
    {
      id: 'senior' as AppVersion,
      emoji: '👓',
      color: 'from-rbc-blue to-blue-800',
    },
  ];

  return (
    <div className="h-full bg-rbc-bg flex items-center justify-center p-8">
      <motion.div
        className="max-w-5xl w-full"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={item} className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-rbc-dark mb-2">
            {t('exploreApp')}
          </h1>
          <p className="text-rbc-secondary text-lg">{t('chooseAnOption')}</p>
        </motion.div>

        <div className="grid sm:grid-cols-3 gap-8 mb-8">
          {versions.map((v) => (
            <motion.div key={v.id} variants={item}>
              <Card
                onClick={() => onSelectVersion(v.id)}
                hoverable
                padding="lg"
                className="h-full border-2 border-transparent hover:border-rbc-bright transition-colors"
              >
                <div className="flex flex-col items-center text-center">
                  <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${v.color} flex items-center justify-center mb-5 text-4xl`}>
                    {v.emoji}
                  </div>
                  <h3 className="text-2xl font-semibold text-rbc-dark mb-2">
                    {t(v.id)}
                  </h3>
                  <p className="text-rbc-secondary text-sm">
                    {t(`${v.id}Desc` as any)}
                  </p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div variants={item} className="text-center">
          <Button variant="ghost" onClick={onBack} size="lg">
            ← {t('back')}
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
