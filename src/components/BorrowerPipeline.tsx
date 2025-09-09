import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { PipelineData, Borrower, PipelineTab } from '../types';
import { mockApi } from '../lib/mockApi';
import { useDashboard } from '../context/DashboardContext';
import { cn } from '@/lib/utils';

export const BorrowerPipeline = () => {
  const [pipelineData, setPipelineData] = useState<PipelineData | null>(null);
  const { activeTab, setActiveTab, activeBorrower, setActiveBorrower } = useDashboard();

  useEffect(() => {
    const loadPipelineData = async () => {
      try {
        const data = await mockApi.getBorrowerPipeline();
        setPipelineData(data);
      } catch (error) {
        console.error('Failed to load pipeline data:', error);
      }
    };
    loadPipelineData();
  }, []);

  const handleBorrowerClick = async (borrower: Borrower) => {
    try {
      const detail = await mockApi.getBorrowerDetail(borrower.id);
      setActiveBorrower(detail);
    } catch (error) {
      console.error('Failed to load borrower detail:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'New': return 'bg-blue-100 text-blue-800';
      case 'In Review': return 'bg-warning/20 text-warning-foreground';
      case 'Approved': return 'bg-success/20 text-success-foreground';
      case 'Renew': return 'bg-purple-100 text-purple-800';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const BorrowerCard = ({ borrower }: { borrower: Borrower }) => (
    <div 
      className={cn(
        "p-4 border rounded-lg cursor-pointer transition-colors hover:bg-accent/50",
        activeBorrower?.id === borrower.id && "bg-accent border-primary"
      )}
      onClick={() => handleBorrowerClick(borrower)}
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-medium text-foreground">{borrower.name}</h3>
        <div className="text-right">
          <div className="font-semibold text-foreground">{formatAmount(borrower.amount)}</div>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{borrower.loan_type}</span>
        <Badge className={getStatusColor(borrower.status)} variant="secondary">
          {borrower.status}
        </Badge>
      </div>
    </div>
  );

  if (!pipelineData) {
    return <Card><CardContent className="p-6">Loading...</CardContent></Card>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Borrower Pipeline</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as PipelineTab)}>
          <div className="px-6 pb-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="new">New ({pipelineData.new.length})</TabsTrigger>
              <TabsTrigger value="in_review">In Review ({pipelineData.in_review.length})</TabsTrigger>
              <TabsTrigger value="approved">Approved ({pipelineData.approved.length})</TabsTrigger>
            </TabsList>
          </div>
          
          <div className="px-6">
            <TabsContent value="new" className="mt-0 space-y-3">
              {pipelineData.new.map(borrower => (
                <BorrowerCard key={borrower.id} borrower={borrower} />
              ))}
            </TabsContent>
            
            <TabsContent value="in_review" className="mt-0 space-y-3">
              {pipelineData.in_review.map(borrower => (
                <BorrowerCard key={borrower.id} borrower={borrower} />
              ))}
            </TabsContent>
            
            <TabsContent value="approved" className="mt-0 space-y-3">
              {pipelineData.approved.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No approved loans yet
                </div>
              ) : (
                pipelineData.approved.map(borrower => (
                  <BorrowerCard key={borrower.id} borrower={borrower} />
                ))
              )}
            </TabsContent>
          </div>
          
          <div className="px-6 py-4 border-t">
            <RadioGroup defaultValue="active" className="space-y-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="active" id="active" />
                <Label htmlFor="active" className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  F-SANATISED ACTIVE
                </Label>
              </div>
            </RadioGroup>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
};