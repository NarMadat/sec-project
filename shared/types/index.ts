export interface User {
  id: string;
  email: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export enum UserRole {
  ADMIN = 'ADMIN',
  DISPATCHER = 'DISPATCHER',
  GUARD = 'GUARD',
  HR_MANAGER = 'HR_MANAGER'
}

export interface Employee {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  position: string;
  status: EmployeeStatus;
  certifications: Certification[];
  createdAt: Date;
  updatedAt: Date;
}

export enum EmployeeStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED'
}

export interface Certification {
  id: string;
  name: string;
  issueDate: Date;
  expiryDate: Date;
  issuingAuthority: string;
}

export interface ProtectedObject {
  id: string;
  clientId: string;
  name: string;
  address: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  securityLevel: SecurityLevel;
  protocols: string[];
  emergencyContacts: EmergencyContact[];
  createdAt: Date;
  updatedAt: Date;
}

export enum SecurityLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export interface EmergencyContact {
  name: string;
  phone: string;
  role: string;
}

export interface Shift {
  id: string;
  employeeId: string;
  objectId: string;
  startTime: Date;
  endTime: Date;
  status: ShiftStatus;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum ShiftStatus {
  SCHEDULED = 'SCHEDULED',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
