import { PipelineData, BorrowerDetail, BrokerInfo } from '../types';

// Mock data based on the API responses provided
const mockPipelineData: PipelineData = {
  new: [
    {
      id: "1",
      name: "Sarah Dunn",
      loan_type: "Home Loan",
      amount: 300000,
      status: "Renew"
    },
    {
      id: "3",
      name: "Lisa Carter",
      loan_type: "Home Loan",
      amount: 450000,
      status: "New"
    }
  ],
  in_review: [
    {
      id: "2",
      name: "Alan Matthews",
      loan_type: "Personal Loan",
      amount: 20000,
      status: "In Review"
    }
  ],
  approved: []
};

const mockBorrowerDetails: Record<string, BorrowerDetail> = {
  "1": {
    id: "1",
    name: "Sarah Dunn",
    email: "sarah.dunn@example.com",
    phone: "(355)123-4557",
    loan_amount: 300000,
    status: "In Review",
    loan_type: "Home Loan",
    amount: 300000,
    employment: "At Tech Company",
    income: 120000,
    existing_loan: 240000,
    credit_score: 720,
    source_of_funds: "Declared",
    risk_signal: "Missing Source of Funds declaration",
    ai_flags: [
      "Income Inconsistent with Bank statements",
      "High Debt-to-Income Ratio detected"
    ]
  },
  "2": {
    id: "2",
    name: "Alan Matthews",
    email: "alan.matthews@example.com",
    phone: "(555)987-6543",
    loan_amount: 20000,
    status: "In Review",
    loan_type: "Personal Loan",
    amount: 20000,
    employment: "Self-Employed",
    income: 85000,
    existing_loan: 15000,
    credit_score: 680,
    source_of_funds: "Business Revenue",
    risk_signal: "Self-employment income verification required",
    ai_flags: [
      "Irregular income pattern detected"
    ]
  },
  "3": {
    id: "3",
    name: "Lisa Carter",
    email: "lisa.carter@example.com",
    phone: "(555)456-7890",
    loan_amount: 450000,
    status: "New",
    loan_type: "Home Loan",
    amount: 450000,
    employment: "Corporate Executive",
    income: 180000,
    existing_loan: 0,
    credit_score: 780,
    source_of_funds: "Salary & Savings",
    risk_signal: "",
    ai_flags: []
  }
};

const mockBrokerInfo: BrokerInfo = {
  name: "Robert Turner",
  deals: 16,
  approval_rate: "75%",
  pending: 7660
};

const mockWorkflowSteps = [
  "Deal Intake",
  "IDV & Credit Check", 
  "Document Upload",
  "AI Validation",
  "Credit Committee",
  "Approval & Docs",
  "Funder Syndication"
];

export const mockApi = {
  getBorrowerPipeline: (): Promise<PipelineData> => {
    return Promise.resolve(mockPipelineData);
  },
  
  getBorrowerDetail: (id: string): Promise<BorrowerDetail> => {
    const borrower = mockBorrowerDetails[id];
    if (!borrower) {
      return Promise.reject(new Error('Borrower not found'));
    }
    return Promise.resolve(borrower);
  },
  
  getBrokerInfo: (): Promise<BrokerInfo> => {
    return Promise.resolve(mockBrokerInfo);
  },
  
  getWorkflowSteps: (): Promise<string[]> => {
    return Promise.resolve(mockWorkflowSteps);
  },
  
  requestDocuments: (id: string): Promise<{ success: boolean; message: string }> => {
    return Promise.resolve({ success: true, message: "Documents requested." });
  },
  
  sendToValuer: (id: string): Promise<{ success: boolean; message: string }> => {
    return Promise.resolve({ success: true, message: "Valuer notified." });
  },
  
  approveLoan: (id: string): Promise<{ success: boolean; message: string }> => {
    return Promise.resolve({ success: true, message: "Loan approved." });
  },
  
  escalateToCommittee: (id: string): Promise<{ success: boolean; message: string }> => {
    return Promise.resolve({ success: true, message: "Escalated to Credit Committee." });
  }
};