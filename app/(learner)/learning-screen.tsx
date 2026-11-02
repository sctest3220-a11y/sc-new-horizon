'use client';

import WatchLabs from '../watch-labs';
import {
  trendFeed,
} from '../learner-app';
import { useApp } from '../learner-app-context';

export default function LearningScreen() {
  const {
    appLanguage,
    authProfile,
    browserStateReady,
    localProfileId,
    setStep,
    showHomeSection,
    step,
  } = useApp();

  return (
    <>
      {browserStateReady && (
        <WatchLabs
          key={authProfile?.id ?? localProfileId}
          stories={trendFeed}
          language={appLanguage}
          ownerId={authProfile?.id ?? localProfileId}
          view={step === 'news' ? 'watch' : 'labs'}
          onViewChange={(view) => setStep(view === 'watch' ? 'news' : 'learningLabs')}
          onLegacyLabs={() => showHomeSection('labs')}
        />
      )}
    </>
  );
}
