import { AlertTriangle, FileText, Building, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useDashboard } from '../context/DashboardContext';
import { mockApi } from '../lib/mockApi';
import { useToast } from '@/hooks/use-toast';

export const BorrowerDetail = () => {
  const { activeBorrower } = useDashboard();
  const { toast } = useToast();

  if (!activeBorrower) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-96">
          <div className="text-center">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">Select a Borrower</h3>
            <p className="text-muted-foreground">Choose a borrower from the pipeline to view details</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
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

  const handleAction = async (action: string, borrowerId: string) => {
    try {
      let response;
      switch (action) {
        case 'request-documents':
          response = await mockApi.requestDocuments(borrowerId);
          break;
        case 'send-valuer':
          response = await mockApi.sendToValuer(borrowerId);
          break;
        case 'approve':
          response = await mockApi.approveLoan(borrowerId);
          break;
        case 'escalate':
          response = await mockApi.escalateToCommittee(borrowerId);
          break;
        default:
          return;
      }
      
      toast({
        title: "Success",
        description: response.message,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Action failed. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-xl">{activeBorrower.name}</CardTitle>
              <div className="flex items-center gap-4 mt-2 text-muted-foreground">
                <span>{activeBorrower.email}</span>
                <span>{activeBorrower.phone}</span>
                <span className="font-medium">{formatAmount(activeBorrower.loan_amount)}</span>
              </div>
            </div>
            <Badge className={getStatusColor(activeBorrower.status)} variant="secondary">
              {activeBorrower.status}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* AI Explainability */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-warning" />
            AI Explainability
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="ai-flags">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-destructive" />
                  Risk Factors Detected ({activeBorrower.ai_flags.length})
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  {activeBorrower.ai_flags.map((flag, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-destructive/10 rounded-md">
                      <AlertTriangle className="h-4 w-4 text-destructive" />
                      <span className="text-sm">{flag}</span>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className="flex flex-wrap gap-2 mt-4">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleAction('request-documents', activeBorrower.id)}
            >
              <FileText className="h-4 w-4 mr-2" />
              Request Documents
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleAction('send-valuer', activeBorrower.id)}
            >
              <Building className="h-4 w-4 mr-2" />
              Send to Valuer
            </Button>
            <Button 
              variant="default" 
              size="sm"
              onClick={() => handleAction('approve', activeBorrower.id)}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Approve
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Loan Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Loan Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-muted-foreground">Employment</label>
              <p className="font-medium">{activeBorrower.employment}</p>
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Income</label>
              <p className="font-medium">{formatAmount(activeBorrower.income)}</p>
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Existing Loan</label>
              <p className="font-medium">{formatAmount(activeBorrower.existing_loan)}</p>
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Credit Score</label>
              <p className="font-medium">{activeBorrower.credit_score}</p>
            </div>
            <div className="md:col-span-2">
              <label className="text-sm text-muted-foreground">Source of Funds</label>
              <p className="font-medium">{activeBorrower.source_of_funds}</p>
            </div>
          </div>

          {activeBorrower.risk_signal && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Risk Signal:</strong> {activeBorrower.risk_signal}
              </AlertDescription>
            </Alert>
          )}

          <Button 
            className="w-full" 
            size="lg"
            onClick={() => handleAction('escalate', activeBorrower.id)}
          >
            <Clock className="h-4 w-4 mr-2" />
            Escalate to Credit Committee
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};