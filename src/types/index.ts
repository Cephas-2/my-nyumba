export type UserRole = 'landlord' | 'tenant' | 'property_manager' | 'service_provider' | 'admin';
export type AccountStatus = 'active' | 'suspended';

export interface User {
  id: string;
  role: UserRole;
  fullName: string;
  email: string;
  phone: string;
  status: AccountStatus;
  createdAt: string;
}
export interface Landlord extends User {
  role: 'landlord';
  businessName?: string;
}
export interface EmergencyContact {
  name: string;
  phone: string;
  relationship: string;
}
export interface Tenant extends User {
  role: 'tenant';
  emergencyContact?: EmergencyContact;
}

export type PropertyType = 'apartment' | 'maisonette' | 'townhouse' | 'bungalow' | 'commercial' | 'hostel';
export interface PropertyLocation {
  area: string;
  city: string;
  country: string;
}
export interface Property {
  id: string;
  landlordId: string;
  managerId?: string; // future: property manager with scoped permissions
  name: string;
  type: PropertyType;
  location: PropertyLocation;
  description: string;
  imageUrl?: string;
  rentDueDay: number;
  archived: boolean;
  createdAt: string;
}

export type UnitStatus = 'occupied' | 'vacant' | 'maintenance';
export interface Unit {
  id: string;
  propertyId: string;
  unitNumber: string;
  bedrooms: number;
  status: UnitStatus;
  monthlyRent: number;
  deposit: number;
  tenantId?: string;
}

export type LeaseStatus = 'active' | 'expiring' | 'expired' | 'terminated';
export interface Lease {
  id: string;
  propertyId: string;
  unitId: string;
  tenantId: string;
  startDate: string;
  endDate: string;
  monthlyRent: number;
  deposit: number;
  status: LeaseStatus;
}

export type PaymentStatus = 'paid' | 'partial' | 'pending' | 'overdue';
export type PaymentMethod = 'mpesa' | 'bank' | 'cash' | 'other';
export interface Payment {
  id: string;
  propertyId: string;
  unitId: string;
  tenantId: string;
  period: string; // YYYY-MM
  expectedAmount: number;
  amount: number;
  dueDate: string;
  paidDate?: string;
  method?: PaymentMethod;
  reference?: string;
  status: PaymentStatus;
  notes?: string;
}

export type MaintenancePriority = 'low' | 'medium' | 'high' | 'urgent';
export type MaintenanceStatus = 'new' | 'assigned' | 'in_progress' | 'completed';
export type MaintenanceCategory =
  | 'plumbing' | 'electricity' | 'water' | 'internet' | 'security' | 'appliance' | 'other';
export interface MaintenanceRequest {
  id: string;
  propertyId: string;
  unitId: string;
  tenantId: string;
  title: string;
  description: string;
  category: MaintenanceCategory;
  priority: MaintenancePriority;
  status: MaintenanceStatus;
  createdAt: string;
  assignedProvider?: string;
  cost?: number;
}

export type NotificationType = 'payment' | 'maintenance' | 'notice' | 'tenant' | 'unit';
export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
}

export interface Conversation {
  id: string;
  participantIds: [string, string];
  propertyId?: string;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
}
export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  body: string;
  sentAt: string;
  read: boolean;
  attachmentName?: string;
}

export type DocumentCategory = 'lease' | 'receipt' | 'notice' | 'property' | 'maintenance';
export interface Document {
  id: string;
  ownerId: string;
  propertyId?: string;
  tenantId?: string;
  category: DocumentCategory;
  name: string;
  sizeKb: number;
  uploadedAt: string;
}

export interface ActivityEvent {
  id: string;
  landlordId: string;
  propertyId?: string;
  type: NotificationType;
  title: string;
  description: string;
  createdAt: string;
}

export type NoticeCategory = 'general' | 'rent_reminder' | 'maintenance' | 'emergency';
export interface Notice {
  id: string;
  landlordId: string;
  propertyId: string;
  category: NoticeCategory;
  title: string;
  body: string;
  createdAt: string;
}
export interface Dispute {
  id: string;
  requestId: string;
  raisedBy: string;
  reason: string;
  status: 'open' | 'resolved';
  createdAt: string;
}
export interface PropertyFlag {
  id: string;
  propertyId: string;
  reason: string;
  note?: string;
  reportedBy: string;
  createdAt: string;
}
export interface TimelineEntry {
  id: string;
  title: string;
  description?: string;
  at?: string;
  done: boolean;
}
