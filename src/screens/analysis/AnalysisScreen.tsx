// Analysis Screen - Shows Cohorts (can be expanded to tabs later)
import React from 'react';
import CohortsScreen from './CohortsScreen';

const AnalysisScreen: React.FC = () => {
  // For now, directly show CohortsScreen
  // In the future, this can be a tab navigator with Cohorts, Funnel, Segments tabs
  return <CohortsScreen />;
};

export default AnalysisScreen;
