import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import Card from '../components/ui/Card';

interface MainMenuProps {
  onLearnPractice: () => void;
  onExploreApp: () => void;
}

export default function MainMenu({ onLearnPractice, onExploreApp }: MainMenuProps) {
  const { t } = useApp();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const item = {
    hidden: { y: 30, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } },
  };

  return (
    <div className="h-full bg-rbc-bg flex items-center justify-center p-8">
      <motion.div
        className="max-w-4xl w-full"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={item} className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-rbc-dark mb-3">
            {t('chooseAnOption')}
          </h1>
          <p className="text-rbc-secondary text-lg">
            {t('attractSubheadline')}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          <motion.div variants={item}>
            <Card
              onClick={onLearnPractice}
              hoverable
              padding="lg"
              className="h-full border-2 border-transparent hover:border-rbc-bright transition-colors"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-2xl bg-rbc-bright-lightest flex items-center justify-center mb-6">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#005DAA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-semibold text-rbc-dark mb-2">
                  {t('learnAndPractice')}
                </h2>
                <p className="text-rbc-secondary text-base">
                  {t('learnAndPracticeDesc')}
                </p>
              </div>
            </Card>
          </motion.div>

          <motion.div variants={item}>
            <Card
              onClick={onExploreApp}
              hoverable
              padding="lg"
              className="h-full border-2 border-transparent hover:border-rbc-bright transition-colors"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-2xl bg-rbc-bright-lightest flex items-center justify-center mb-6">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#005DAA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                    <line x1="12" y1="18" x2="12" y2="18" />
                  </svg>
                </div>
                <h2 className="text-2xl font-semibold text-rbc-dark mb-2">
                  {t('exploreApp')}
                </h2>
                <p className="text-rbc-secondary text-base">
                  {t('exploreAppDesc')}
                </p>
              </div>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
