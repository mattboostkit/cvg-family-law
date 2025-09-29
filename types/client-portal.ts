// Client Portal TypeScript Definitions

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  twoFactorEnabled: boolean;
  securityQuestions: SecurityQuestion[];
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface SecurityQuestion {
  id: string;
  question: string;
  answer: string; // Encrypted
}

export interface AuthSession {
  id: string;
  userId: string;
  token: string;
  expiresAt: Date;
  twoFactorVerified: boolean;
  ipAddress: string;
  userAgent: string;
  createdAt: Date;
}

export interface TwoFactorSetup {
  secret: string;
  qrCode: string;
  backupCodes: string[];
}

export interface LoginCredentials {
  email: string;
  password: string;
  twoFactorCode?: string;
  rememberMe?: boolean;
}

export interface Case {
  id: string;
  clientId: string;
  caseNumber: string;
  title: string;
  status: CaseStatus;
  priority: CasePriority;
  assignedLawyer: string;
  description: string;
  importantDates: ImportantDate[];
  documents: Document[];
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

export enum CaseStatus {
  ACTIVE = 'active',
  PENDING = 'pending',
  CLOSED = 'closed',
  ON_HOLD = 'on_hold'
}

export enum CasePriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

export interface ImportantDate {
  id: string;
  title: string;
  date: Date;
  type: DateType;
  description?: string;
  reminderSent?: boolean;
}

export enum DateType {
  COURT_HEARING = 'court_hearing',
  DEADLINE = 'deadline',
  MEETING = 'meeting',
  FILING_DATE = 'filing_date'
}

export interface Document {
  id: string;
  caseId: string;
  name: string;
  originalName: string;
  type: DocumentType;
  category: DocumentCategory;
  size: number;
  mimeType: string;
  uploadedBy: string;
  uploadedAt: Date;
  version: number;
  isLatestVersion: boolean;
  encryptionKey: string; // Encrypted
  checksum: string;
  status: DocumentStatus;
  sharedWith?: SharedDocument[];
  accessLog: DocumentAccess[];
}

export enum DocumentType {
  PDF = 'pdf',
  WORD = 'word',
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIO = 'audio',
  OTHER = 'other'
}

export enum DocumentCategory {
  COURT_DOCUMENTS = 'court_documents',
  EVIDENCE = 'evidence',
  CORRESPONDENCE = 'correspondence',
  MEDICAL_RECORDS = 'medical_records',
  FINANCIAL = 'financial',
  PERSONAL = 'personal',
  OTHER = 'other'
}

export enum DocumentStatus {
  UPLOADING = 'uploading',
  PROCESSING = 'processing',
  READY = 'ready',
  ERROR = 'error',
  DELETED = 'deleted'
}

export interface SharedDocument {
  id: string;
  documentId: string;
  sharedWith: string; // Email or user ID
  shareToken: string;
  expiresAt: Date;
  accessCount: number;
  maxAccessCount?: number;
  permissions: SharePermission[];
  createdBy: string;
  createdAt: Date;
}

export enum SharePermission {
  VIEW = 'view',
  DOWNLOAD = 'download'
}

export interface DocumentAccess {
  id: string;
  documentId: string;
  userId: string;
  action: AccessAction;
  ipAddress: string;
  userAgent: string;
  timestamp: Date;
}

export enum AccessAction {
  VIEW = 'view',
  DOWNLOAD = 'download',
  UPLOAD = 'upload',
  DELETE = 'delete',
  SHARE = 'share'
}

export interface Message {
  id: string;
  caseId: string;
  fromUser: string;
  toUser: string;
  subject: string;
  content: string;
  isRead: boolean;
  isEncrypted: boolean;
  sentAt: Date;
  readAt?: Date;
}

export interface DocumentUpload {
  file: File;
  category: DocumentCategory;
  description?: string;
  isPublic: boolean;
}

export interface DocumentFilter {
  category?: DocumentCategory;
  type?: DocumentType;
  status?: DocumentStatus;
  dateFrom?: Date;
  dateTo?: Date;
  search?: string;
}

export interface CaseFilter {
  status?: CaseStatus;
  priority?: CasePriority;
  assignedLawyer?: string;
  dateFrom?: Date;
  dateTo?: Date;
}

export interface AuditLog {
  id: string;
  userId: string;
  action: AuditAction;
  resource: string;
  resourceId: string;
  details: string;
  ipAddress: string;
  userAgent: string;
  timestamp: Date;
}

export enum AuditAction {
  LOGIN = 'login',
  LOGOUT = 'logout',
  PASSWORD_CHANGE = 'password_change',
  DOCUMENT_UPLOAD = 'document_upload',
  DOCUMENT_DOWNLOAD = 'document_download',
  DOCUMENT_DELETE = 'document_delete',
  DOCUMENT_SHARE = 'document_share',
  CASE_CREATE = 'case_create',
  CASE_UPDATE = 'case_update',
  MESSAGE_SEND = 'message_send',
  TWO_FACTOR_ENABLE = 'two_factor_enable',
  TWO_FACTOR_DISABLE = 'two_factor_disable'
}

export interface GDPRRequest {
  id: string;
  userId: string;
  type: GDPRRequestType;
  status: GDPRRequestStatus;
  requestedAt: Date;
  completedAt?: Date;
  details: string;
}

export enum GDPRRequestType {
  DATA_EXPORT = 'data_export',
  DATA_DELETION = 'data_deletion',
  CONSENT_WITHDRAWAL = 'consent_withdrawal'
}

export enum GDPRRequestStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  REJECTED = 'rejected'
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  pageSize: number;
  currentPage: number;
  totalPages: number;
}