export type CrisisLevel = 'low' | 'medium' | 'high' | 'critical';

export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read';

export type ChatParticipantType = 'user' | 'specialist' | 'system';

export interface ChatParticipant {
  id: string;
  name: string;
  type: ChatParticipantType;
  avatar?: string;
  isOnline: boolean;
  isTyping?: boolean;
}

export interface ChatMessage {
  id: string;
  chatId: string;
  senderId: string;
  sender: ChatParticipant;
  content: string;
  timestamp: Date;
  status: MessageStatus;
  messageType: 'text' | 'file' | 'system' | 'emergency';
  crisisLevel?: CrisisLevel;
  isEncrypted: boolean;
  replyToId?: string;
  metadata?: {
    fileName?: string;
    fileSize?: number;
    fileType?: string;
    mimeType?: string;
    encryptionKey?: string;
  };
}

export interface ChatSession {
  id: string;
  userId?: string; // Optional for anonymous users
  participants: ChatParticipant[];
  messages: ChatMessage[];
  status: 'active' | 'transferred' | 'closed' | 'emergency';
  crisisLevel: CrisisLevel;
  priority: number;
  createdAt: Date;
  updatedAt: Date;
  isAnonymous: boolean;
  language: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
}

export interface Specialist {
  id: string;
  name: string;
  email: string;
  specialities: string[];
  isAvailable: boolean;
  isOnline: boolean;
  currentChats: number;
  maxConcurrentChats: number;
  languages: string[];
  certifications: string[];
  responseTime: number; // Average response time in seconds
}

export interface CrisisKeyword {
  keyword: string;
  level: CrisisLevel;
  action: 'flag' | 'escalate' | 'emergency';
  confidence: number;
}

export interface EmergencyEscalation {
  id: string;
  chatId: string;
  triggeredBy: 'keyword' | 'manual' | 'assessment';
  crisisLevel: CrisisLevel;
  reason: string;
  emergencyServices: {
    police: boolean;
    ambulance: boolean;
    crisisTeam: boolean;
  };
  contactDetails: {
    name?: string;
    phone?: string;
    location?: string;
  };
  timestamp: Date;
  status: 'pending' | 'contacted' | 'resolved' | 'cancelled';
}

export interface ChatSettings {
  allowAnonymous: boolean;
  maxFileSize: number;
  allowedFileTypes: string[];
  messageRetentionDays: number;
  encryptionEnabled: boolean;
  autoDeleteAfterDays: number;
  emergencyKeywords: CrisisKeyword[];
  escalationThreshold: CrisisLevel;
}

export interface TypingIndicator {
  chatId: string;
  userId: string;
  userName: string;
  timestamp: Date;
}

export interface WebSocketMessage {
  type: 'message' | 'typing' | 'presence' | 'error' | 'system';
  payload: any;
  timestamp: Date;
  chatId: string;
}

export interface ChatError {
  code: string;
  message: string;
  details?: any;
  timestamp: Date;
}