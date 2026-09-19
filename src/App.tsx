/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { MobileFrame } from './components/MobileFrame';
import { RootNavigator } from './navigation/RootNavigator';
import { SubmissionInspectorModal } from './components/SubmissionInspectorModal';
import { useProfileStore } from './store/profileStore';

export default function App() {
  const { initializePreferences } = useProfileStore();

  useEffect(() => {
    initializePreferences();
  }, [initializePreferences]);

  return (
    <div className="w-full min-h-screen bg-slate-950 font-sans text-slate-100 antialiased selection:bg-blue-600 selection:text-white">
      <MobileFrame>
        <RootNavigator />
      </MobileFrame>
      <SubmissionInspectorModal />
    </div>
  );
}
