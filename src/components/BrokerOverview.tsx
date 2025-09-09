import { useEffect, useState } from 'react';
import { Phone, Mail, MessageCircle, CheckCircle, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { BrokerInfo } from '../types';
import { mockApi } from '../lib/mockApi';

export const BrokerOverview = () => {
  const [brokerInfo, setBrokerInfo] = useState<BrokerInfo | null>(null);
  const [workflowSteps, setWorkflowSteps] = useState<string[]>([]);
  const [aiAssistantEnabled, setAiAssistantEnabled] = useState(true);

  useEffect(() => {
    const loadBrokerData = async () => {
      try {
        const [broker, workflow] = await Promise.all([
          mockApi.getBrokerInfo(),
          mockApi.getWorkflowSteps()
        ]);
        setBrokerInfo(broker);
        setWorkflowSteps(workflow);
      } catch (error) {
        console.error('Failed to load broker data:', error);
      }
    };
    loadBrokerData();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (!brokerInfo) {
    return <Card><CardContent className="p-6">Loading...</CardContent></Card>;
  }

  return (
    <div className="space-y-6">
      {/* Broker Info */}
      <Card>
        <CardHeader>
          <CardTitle>Broker Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold text-lg">{brokerInfo.name}</h3>
          </div>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-1 gap-4">
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-foreground">{brokerInfo.deals}</div>
              <div className="text-sm text-muted-foreground">Deals</div>
            </div>
            
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-success">{brokerInfo.approval_rate}</div>
              <div className="text-sm text-muted-foreground">Approval Rate</div>
            </div>
            
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-warning">{formatCurrency(brokerInfo.pending)}</div>
              <div className="text-sm text-muted-foreground">Pending</div>
            </div>
          </div>

          {/* Contact Buttons */}
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1">
              <Phone className="h-4 w-4 mr-2" />
              Call
            </Button>
            <Button variant="outline" size="sm" className="flex-1">
              <Mail className="h-4 w-4 mr-2" />
              Email
            </Button>
            <Button variant="outline" size="sm" className="flex-1">
              <MessageCircle className="h-4 w-4 mr-2" />
              Chat
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Onboarding Workflow */}
      <Card>
        <CardHeader>
          <CardTitle>Onboarding Workflow</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {workflowSteps.map((step, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-medium">
                  {index + 1}
                </div>
                <span className="text-sm text-foreground">{step}</span>
                {index < 3 && <CheckCircle className="h-4 w-4 text-success ml-auto" />}
                {index >= 3 && <Clock className="h-4 w-4 text-muted-foreground ml-auto" />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Assistant Toggle */}
      <Card>
        <CardHeader>
          <CardTitle>AI Assistant</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <Label htmlFor="ai-assistant" className="text-sm font-medium">
              E Ardsassist
            </Label>
            <Switch
              id="ai-assistant"
              checked={aiAssistantEnabled}
              onCheckedChange={setAiAssistantEnabled}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Enable AI-powered assistance for loan processing
          </p>
        </CardContent>
      </Card>
    </div>
  );
};