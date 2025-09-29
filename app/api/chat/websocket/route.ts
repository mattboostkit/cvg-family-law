import { NextRequest } from 'next/server';
import { WebSocketServer, WebSocket } from 'ws';
import { IncomingMessage } from 'http';
import { ChatMessage, ChatSession, CrisisLevel, Specialist } from '@/types/chat';

// WebSocket message interfaces
interface WebSocketMessage {
  type: string;
  [key: string]: unknown;
}

interface HandshakeMessage {
  type: 'handshake';
  sessionId: string;
}

interface ChatMessageMessage {
  type: 'message';
  sessionId: string;
  content: string;
  messageType?: 'text' | 'file' | 'system' | 'emergency';
  metadata?: Record<string, unknown>;
  senderName?: string;
}

interface TypingMessage {
  type: 'typing';
  sessionId: string;
  isTyping: boolean;
}

interface JoinSessionMessage {
  type: 'join_session';
  sessionId: string;
  userType?: 'user' | 'specialist' | 'system';
  userName?: string;
}

interface CrisisEscalationMessage {
  type: 'crisis_escalation';
  sessionId: string;
  crisisLevel: CrisisLevel;
  reason: string;
  content?: string;
}

interface HeartbeatMessage {
  type: 'heartbeat';
}

interface ErrorMessage {
  type: 'error';
  error: string;
}

// Union type for all possible WebSocket messages
type WebSocketMessageType =
  | HandshakeMessage
  | ChatMessageMessage
  | TypingMessage
  | JoinSessionMessage
  | CrisisEscalationMessage
  | HeartbeatMessage
  | ErrorMessage;

interface SystemMessage {
  type: 'system';
  action: string;
  payload?: unknown;
  timestamp?: Date;
  [key: string]: unknown;
}

interface ErrorMessage {
  type: 'error';
  error: string;
}

interface HeartbeatMessage extends WebSocketMessage {
  type: 'heartbeat';
}

interface HeartbeatAckMessage {
  type: 'heartbeat_ack';
  timestamp: Date;
}

// In-memory storage - replace with proper database
const chatSessions = new Map<string, ChatSession>();
const connectedClients = new Map<string, WebSocket>();
const specialists = new Map<string, Specialist>();
const typingUsers = new Map<string, Set<string>>();

// Crisis intervention specialists (demo data)
const DEMO_SPECIALISTS: Specialist[] = [
  {
    id: 'specialist_1',
    name: 'Dr. Sarah Mitchell',
    email: 'sarah.mitchell@crisis-support.org',
    specialities: ['domestic_abuse', 'trauma', 'crisis_intervention'],
    isAvailable: true,
    isOnline: true,
    currentChats: 2,
    maxConcurrentChats: 5,
    languages: ['en', 'es'],
    certifications: ['Licensed Clinical Social Worker', 'Trauma-Informed Care'],
    responseTime: 45
  },
  {
    id: 'specialist_2',
    name: 'Michael Thompson',
    email: 'michael.thompson@crisis-support.org',
    specialities: ['domestic_abuse', 'legal_advocacy', 'safety_planning'],
    isAvailable: true,
    isOnline: true,
    currentChats: 1,
    maxConcurrentChats: 4,
    languages: ['en'],
    certifications: ['Certified Crisis Counselor', 'Legal Advocate'],
    responseTime: 30
  }
];

/**
 * Initialize specialists
 */
function initializeSpecialists(): void {
  DEMO_SPECIALISTS.forEach(specialist => {
    specialists.set(specialist.id, specialist);
  });
}

/**
 * Find available specialist for chat session
 */
function findAvailableSpecialist(crisisLevel: CrisisLevel): Specialist | null {
  let bestMatch: Specialist | null = null;
  let bestScore = -1;

  for (const specialist of specialists.values()) {
    if (!specialist.isAvailable || !specialist.isOnline) continue;
    if (specialist.currentChats >= specialist.maxConcurrentChats) continue;

    // Score specialist based on availability and expertise
    let score = 10;

    // Prioritize specialists with domestic abuse speciality for high/critical cases
    if ((crisisLevel === 'high' || crisisLevel === 'critical') &&
        specialist.specialities.includes('domestic_abuse')) {
      score += 5;
    }

    // Prefer specialists with faster response times
    score += Math.max(0, 60 - specialist.responseTime);

    // Prefer specialists with fewer current chats
    score += (specialist.maxConcurrentChats - specialist.currentChats) * 2;

    if (score > bestScore) {
      bestScore = score;
      bestMatch = specialist;
    }
  }

  return bestMatch;
}

/**
 * Assign specialist to chat session
 */
function assignSpecialistToSession(sessionId: string, crisisLevel: CrisisLevel): Specialist | null {
  const specialist = findAvailableSpecialist(crisisLevel);
  if (!specialist) return null;

  const session = chatSessions.get(sessionId);
  if (!session) return null;

  // Add specialist to session participants
  session.participants.push({
    id: specialist.id,
    name: specialist.name,
    type: 'specialist',
    isOnline: true
  });

  // Update specialist availability
  specialist.currentChats++;
  if (specialist.currentChats >= specialist.maxConcurrentChats) {
    specialist.isAvailable = false;
  }

  specialists.set(specialist.id, specialist);
  chatSessions.set(sessionId, session);

  return specialist;
}

/**
 * Handle WebSocket upgrade
 */
export async function GET(request: NextRequest) {
  // Check if this is a WebSocket upgrade request
  const upgradeHeader = request.headers.get('upgrade');
  if (upgradeHeader !== 'websocket') {
    return new Response('Expected websocket', { status: 400 });
  }

  try {
    // Initialize specialists if not already done
    if (specialists.size === 0) {
      initializeSpecialists();
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const sessionId = searchParams.get('sessionId');

    // Create WebSocket server instance for this connection
    const wsServer = new WebSocketServer({
      noServer: true,
      perMessageDeflate: false
    });

    // Handle the upgrade
    const response = await new Promise<Response>((resolve) => {
      // This would normally be handled by the HTTP server
      // For Next.js, we'll return a response that indicates WebSocket support
      resolve(new Response('WebSocket endpoint - use ws:// protocol', {
        status: 200,
        headers: {
          'Content-Type': 'text/plain'
        }
      }));
    });

    return response;

  } catch (error) {
    console.error('WebSocket upgrade error:', error);
    return new Response('WebSocket upgrade failed', { status: 500 });
  }
}

/**
 * Handle WebSocket connection (server-side)
 */
function handleWebSocketConnection(ws: WebSocket, request: IncomingMessage) {
  const url = new URL(request.url || '', 'http://localhost');
  const userId = url.searchParams.get('userId');
  const sessionId = url.searchParams.get('sessionId');
  const userType = url.searchParams.get('userType') || 'user';

  // Generate client ID
  const clientId = `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  connectedClients.set(clientId, ws);

  console.log(`Client ${clientId} connected as ${userType}`);

  // Handle incoming messages
  ws.on('message', async (data: Buffer) => {
    try {
      const message = JSON.parse(data.toString());
      await handleWebSocketMessage(ws, clientId, message);
    } catch (error) {
      console.error('Error parsing WebSocket message:', error);
      ws.send(JSON.stringify({
        type: 'error',
        error: 'Invalid message format'
      }));
    }
  });

  // Handle connection close
  ws.on('close', () => {
    console.log(`Client ${clientId} disconnected`);
    connectedClients.delete(clientId);

    // Update specialist availability if this was a specialist
    if (userType === 'specialist') {
      for (const specialist of specialists.values()) {
        if (specialist.id === userId) {
          specialist.isOnline = false;
          specialists.set(specialist.id, specialist);
          break;
        }
      }
    }
  });

  // Send welcome message
  ws.send(JSON.stringify({
    type: 'system',
    action: 'connected',
    clientId,
    timestamp: new Date()
  }));

  // If this is a specialist connecting, update their status
  if (userType === 'specialist' && userId) {
    const specialist = specialists.get(userId);
    if (specialist) {
      specialist.isOnline = true;
      specialists.set(userId, specialist);

      // Notify all connected clients about specialist availability
      broadcastToAll({
        type: 'system',
        action: 'specialist_online',
        specialist: {
          id: specialist.id,
          name: specialist.name,
          isAvailable: specialist.isAvailable
        }
      });
    }
  }
}

/**
 * Handle incoming WebSocket messages
 */
async function handleWebSocketMessage(ws: WebSocket, clientId: string, message: WebSocketMessageType) {
  switch (message.type) {
    case 'handshake':
      await handleHandshake(ws, clientId, message as HandshakeMessage);
      break;

    case 'message':
      await handleChatMessage(ws, clientId, message as ChatMessageMessage);
      break;

    case 'typing':
      handleTypingIndicator(ws, clientId, message as TypingMessage);
      break;

    case 'join_session':
      await handleJoinSession(ws, clientId, message as JoinSessionMessage);
      break;

    case 'crisis_escalation':
      await handleCrisisEscalation(ws, clientId, message as CrisisEscalationMessage);
      break;

    case 'heartbeat':
      // Respond to heartbeat
      ws.send(JSON.stringify({
        type: 'heartbeat_ack',
        timestamp: new Date()
      }));
      break;

    default:
      ws.send(JSON.stringify({
        type: 'error',
        error: 'Unknown message type'
      }));
  }
}

/**
 * Handle client handshake
 */
async function handleHandshake(ws: WebSocket, clientId: string, message: HandshakeMessage) {
  const sessionId = message.sessionId;

  ws.send(JSON.stringify({
    type: 'handshake_ack',
    sessionId,
    timestamp: new Date()
  }));

  // If no session exists, create one
  if (sessionId && !chatSessions.has(sessionId)) {
    const session: ChatSession = {
      id: sessionId,
      participants: [],
      messages: [],
      status: 'active',
      crisisLevel: 'low',
      priority: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      isAnonymous: true,
      language: 'en'
    };
    chatSessions.set(sessionId, session);
  }
}

/**
 * Handle chat messages
 */
async function handleChatMessage(ws: WebSocket, clientId: string, message: ChatMessageMessage) {
  const { sessionId, content, messageType = 'text', metadata } = message;

  let session = chatSessions.get(sessionId);
  if (!session) {
    // Create new session
    session = {
      id: sessionId,
      participants: [],
      messages: [],
      status: 'active',
      crisisLevel: 'low',
      priority: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      isAnonymous: true,
      language: 'en'
    };
    chatSessions.set(sessionId, session);
  }

  // Analyze crisis level
  const crisisLevel = analyzeMessageForCrisis(content);

  // Create message
  const chatMessage: ChatMessage = {
    id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    chatId: sessionId,
    senderId: clientId,
    sender: {
      id: clientId,
      name: message.senderName || 'Anonymous User',
      type: 'user',
      isOnline: true
    },
    content,
    timestamp: new Date(),
    status: 'delivered',
    messageType,
    crisisLevel,
    isEncrypted: false,
    metadata
  };

  // Add message to session
  session.messages.push(chatMessage);
  session.updatedAt = new Date();

  // Update session crisis level
  if (crisisLevel !== 'low' && crisisLevel !== session.crisisLevel) {
    session.crisisLevel = crisisLevel;
    session.priority = crisisLevel === 'critical' ? 10 :
                     crisisLevel === 'high' ? 7 : 4;
  }

  chatSessions.set(sessionId, session);

  // Broadcast message to all clients in session
  broadcastToSession(sessionId, {
    type: 'message',
    payload: chatMessage,
    timestamp: new Date()
  });

  // Handle crisis escalation
  if (crisisLevel === 'critical' || crisisLevel === 'high') {
    await handleCrisisEscalation(ws, clientId, {
      type: 'crisis_escalation',
      sessionId,
      crisisLevel,
      reason: 'Message content analysis',
      content
    });
  }
}

/**
 * Handle typing indicators
 */
function handleTypingIndicator(ws: WebSocket, clientId: string, message: TypingMessage) {
  const { sessionId, isTyping } = message;

  if (isTyping) {
    if (!typingUsers.has(sessionId)) {
      typingUsers.set(sessionId, new Set());
    }
    typingUsers.get(sessionId)!.add(clientId);
  } else {
    typingUsers.get(sessionId)?.delete(clientId);
  }

  // Broadcast typing indicator to other users in session
  broadcastToSession(sessionId, {
    type: 'typing',
    payload: {
      userId: clientId,
      isTyping,
      timestamp: new Date()
    },
    timestamp: new Date()
  }, clientId); // Exclude sender
}

/**
 * Handle user joining a session
 */
async function handleJoinSession(ws: WebSocket, clientId: string, message: JoinSessionMessage) {
  const { sessionId, userType = 'user' } = message;

  const session = chatSessions.get(sessionId);
  if (!session) {
    ws.send(JSON.stringify({
      type: 'error',
      error: 'Session not found'
    }));
    return;
  }

  // Add user to session participants
  session.participants.push({
    id: clientId,
    name: message.userName || 'Anonymous',
    type: userType,
    isOnline: true
  });

  // If this is a specialist joining, assign them to the session
  if (userType === 'specialist') {
    const specialist = specialists.get(clientId);
    if (specialist) {
      specialist.currentChats++;
      specialists.set(clientId, specialist);
    }
  }

  chatSessions.set(sessionId, session);

  // Send session history to the new participant
  ws.send(JSON.stringify({
    type: 'session_history',
    payload: {
      session: {
        id: session.id,
        crisisLevel: session.crisisLevel,
        priority: session.priority,
        createdAt: session.createdAt
      },
      messages: session.messages
    },
    timestamp: new Date()
  }));

  // Notify others that user joined
  broadcastToSession(sessionId, {
    type: 'system',
    action: 'user_joined',
    user: {
      id: clientId,
      name: message.userName || 'Anonymous',
      type: userType
    }
  }, clientId);
}

/**
 * Handle crisis escalation
 */
async function handleCrisisEscalation(ws: WebSocket, clientId: string, message: CrisisEscalationMessage) {
  const { sessionId, crisisLevel, reason, content } = message;

  const session = chatSessions.get(sessionId);
  if (!session) return;

  // Update session status
  session.status = crisisLevel === 'critical' ? 'emergency' : 'active';
  session.crisisLevel = crisisLevel;
  session.priority = crisisLevel === 'critical' ? 10 :
                   crisisLevel === 'high' ? 7 : 4;

  chatSessions.set(sessionId, session);

  // Try to assign a specialist
  const specialist = assignSpecialistToSession(sessionId, crisisLevel);

  // Broadcast escalation to all clients
  broadcastToAll({
    type: 'system',
    action: 'crisis_escalation',
    payload: {
      sessionId,
      crisisLevel,
      reason,
      specialist: specialist ? {
        id: specialist.id,
        name: specialist.name,
        isAvailable: specialist.isAvailable
      } : null,
      timestamp: new Date()
    }
  });

  // If critical level, trigger emergency services notification
  if (crisisLevel === 'critical') {
    // Here you would integrate with emergency services
    console.log('CRITICAL ESCALATION - Emergency services notification triggered', {
      sessionId,
      content: content?.substring(0, 100),
      timestamp: new Date()
    });
  }
}

/**
 * Analyze message content for crisis indicators
 */
function analyzeMessageForCrisis(content: string): CrisisLevel {
  const lowercaseContent = content.toLowerCase();

  // Critical indicators
  if (lowercaseContent.includes('suicide') ||
      lowercaseContent.includes('kill myself') ||
      lowercaseContent.includes('end it all')) {
    return 'critical';
  }

  // High risk indicators
  if (lowercaseContent.includes('hurt myself') ||
      lowercaseContent.includes('domestic violence') ||
      lowercaseContent.includes('abuse') ||
      lowercaseContent.includes('rape') ||
      lowercaseContent.includes('assault')) {
    return 'high';
  }

  // Medium risk indicators
  if (lowercaseContent.includes('scared') ||
      lowercaseContent.includes('threatened') ||
      lowercaseContent.includes('danger')) {
    return 'medium';
  }

  return 'low';
}

/**
 * Broadcast message to all connected clients
 */
function broadcastToAll(message: SystemMessage | ErrorMessage) {
  const messageStr = JSON.stringify(message);
  for (const client of connectedClients.values()) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(messageStr);
    }
  }
}

/**
 * Broadcast message to clients in a specific session
 */
function broadcastToSession(sessionId: string, message: SystemMessage | ErrorMessage | ChatMessage | { type: string; payload: unknown; timestamp: Date }, excludeClientId?: string) {
  const messageStr = JSON.stringify(message);

  for (const [clientId, client] of connectedClients.entries()) {
    if (clientId === excludeClientId) continue;
    if (client.readyState === WebSocket.OPEN) {
      client.send(messageStr);
    }
  }
}