export type VisitorCategory = 'Employee' | 'Business' | 'External' | 'Compliance' | 'Logistics' | 'Group';

export type EmployeeVisitorType = 'Family';
export type BusinessVisitorType = 'Client(India)' | 'Client(Global)';
export type ExternalVisitorType = 'Vendor / Supplier' | 'Third-Party Staff';
export type ComplianceVisitorType = 'Police' | 'Auditor' | 'Lawyer';
export type LogisticsVisitorType = 'Delivery / Courier';
export type GroupVisitorType = 'Sports';

export interface Visitor {
  name: string;
  age?: string;
  gender?: string;
  contact?: string;
  relationship?: string;
}

export interface VisitorFormData {
  category: VisitorCategory;
  visitorType: string;
  visitors: Visitor[];
  companyName?: string;
  companyAddress?: string;
  country?: string;
  purposeOfVisit: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  teamCaptain?: string;
  sportsType?: string;
  deliverables?: string;
  deliveryDate?: string;
  document?: File | null;
}
