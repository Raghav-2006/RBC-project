import { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AppProvider } from './context/AppContext';
import TopBar from './components/layout/TopBar';
import IdleOverlay from './components/layout/IdleOverlay';
import AttractScreen from './screens/AttractScreen';
import MainMenu from './screens/MainMenu';
import TaskChooser, { type TaskId } from './screens/TaskChooser';
import ModeChooser from './screens/ModeChooser';
import VersionChooser, { type AppVersion } from './screens/VersionChooser';
import AppPreview from './screens/apppreview/AppPreview';
import LearnPracticeFlow from './screens/learnpractice/LearnPracticeFlow';

type Screen =
  | 'attract'
  | 'menu'
  | 'taskChooser'
  | 'modeChooser'
  | 'simulator'
  | 'versionChooser'
  | 'appPreview';

function AppContent() {
  const params = new URLSearchParams(window.location.search);
  const debugScreen = params.get('screen') as Screen | null;
  const debugVersion = params.get('version') as AppVersion | null;

  const [screen, setScreen] = useState<Screen>(debugScreen ?? 'attract');
  const [selectedTask, setSelectedTask] = useState<TaskId | null>(null);
  const [selectedMode, setSelectedMode] = useState<'guided' | 'demo'>('guided');
  const [selectedVersion, setSelectedVersion] = useState<AppVersion>(debugVersion ?? 'regular');

  const goMenu = useCallback(() => {
    setScreen('menu');
    setSelectedTask(null);
  }, []);

  const renderLearnPractice = () => {
    if (!selectedTask) return null;

    return (
      <LearnPracticeFlow
        taskId={selectedTask}
        mode={selectedMode}
        onComplete={() => { setSelectedTask(null); setScreen('taskChooser'); }}
        onBack={goMenu}
      />
    );
  };

  return (
    <div className="h-full flex flex-col">
      {screen !== 'attract' && (
        <TopBar onHome={goMenu} showControls />
      )}

      <div className="flex-1 min-h-0 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={screen + (selectedTask ?? '') + selectedVersion}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0"
          >
            {screen === 'attract' && (
              <AttractScreen onStart={() => setScreen('menu')} />
            )}
            {screen === 'menu' && (
              <MainMenu
                onLearnPractice={() => setScreen('taskChooser')}
                onExploreApp={() => setScreen('versionChooser')}
              />
            )}
            {screen === 'taskChooser' && (
              <TaskChooser
                onSelectTask={(taskId) => {
                  setSelectedTask(taskId);
                  setScreen('modeChooser');
                }}
              />
            )}
            {screen === 'modeChooser' && selectedTask && (
              <ModeChooser
                taskId={selectedTask}
                onWatch={() => { setSelectedMode('demo'); setScreen('simulator'); }}
                onTry={() => { setSelectedMode('guided'); setScreen('simulator'); }}
                onBack={() => setScreen('taskChooser')}
              />
            )}
            {screen === 'simulator' && renderLearnPractice()}
            {screen === 'versionChooser' && (
              <VersionChooser
                onSelectVersion={(v) => { setSelectedVersion(v); setScreen('appPreview'); }}
                onBack={goMenu}
              />
            )}
            {screen === 'appPreview' && (
              <AppPreview
                version={selectedVersion}
                onBack={() => setScreen('versionChooser')}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <IdleOverlay />
    </div>
  );
}

export default function App() {
  const [, setResetKey] = useState(0);

  return (
    <AppProvider onIdleReset={() => setResetKey(k => k + 1)}>
      <AppContent />
    </AppProvider>
  );
}
