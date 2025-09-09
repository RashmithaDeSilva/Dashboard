import { DashboardProvider } from '../context/DashboardContext';
import { Header } from './Header';
import { BorrowerPipeline } from './BorrowerPipeline';
import { BorrowerDetail } from './BorrowerDetail';
import { BrokerOverview } from './BrokerOverview';

export const Dashboard = () => {
  return (
    <DashboardProvider>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Panel - Borrower Pipeline */}
            <div className="lg:col-span-4">
              <BorrowerPipeline />
            </div>
            
            {/* Middle Panel - Borrower Details */}
            <div className="lg:col-span-5">
              <BorrowerDetail />
            </div>
            
            {/* Right Panel - Broker Overview */}
            <div className="lg:col-span-3">
              <BrokerOverview />
            </div>
          </div>
        </main>
      </div>
    </DashboardProvider>
  );
};