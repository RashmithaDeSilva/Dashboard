import { createContext, useContext, useState, ReactNode } from 'react';
import { BorrowerDetail, PipelineTab } from '../types';

interface DashboardContextType {
  activeBorrower: BorrowerDetail | null;
  setActiveBorrower: (borrower: BorrowerDetail | null) => void;
  activeTab: PipelineTab;
  setActiveTab: (tab: PipelineTab) => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};

interface DashboardProviderProps {
  children: ReactNode;
}

export const DashboardProvider = ({ children }: DashboardProviderProps) => {
  const [activeBorrower, setActiveBorrower] = useState<BorrowerDetail | null>(null);
  const [activeTab, setActiveTab] = useState<PipelineTab>('new');

  return (
    <DashboardContext.Provider value={{
      activeBorrower,
      setActiveBorrower,
      activeTab,
      setActiveTab,
    }}>
      {children}
    </DashboardContext.Provider>
  );
};