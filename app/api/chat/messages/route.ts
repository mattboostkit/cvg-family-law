import { NextRequest, NextResponse } from 'next/server';
import { ChatMessage, ChatSession, CrisisLevel, MessageStatus } from '@/types/chat';
import { encryptData, decryptData, generateEncryptionKey } from '@/lib/chat-encryption';

// In-memory storage for demo - replace with proper database
const chatSessions = new Map<string, ChatSession>();
const messages = new Map<string, ChatMessage>();

// Crisis keywords that trigger escalation
const CRISIS_KEYWORDS = [
  { keyword: 'suicide', level: 'critical' as CrisisLevel, confidence: 0.9 },
  { keyword: 'kill myself', level: 'critical' as CrisisLevel, confidence: 0.95 },
  { keyword: 'end it all', level: 'critical' as CrisisLevel, confidence: 0.9 },
  { keyword: 'hurt myself', level: 'high' as CrisisLevel, confidence: 0.85 },
  { keyword: 'domestic violence', level: 'high' as CrisisLevel, confidence: 0.9 },
  { keyword: 'abuse', level: 'high' as CrisisLevel, confidence: 0.8 },
  { keyword: 'scared', level: 'medium' as CrisisLevel, confidence: 0.7 },
  { keyword: 'help', level: 'medium' as CrisisLevel, confidence: 0.6 },
];

/**
 * Analyze message content for crisis keywords
 */
function analyzeCrisisLevel(content: string): CrisisLevel {
  const lowercaseContent = content.toLowerCase();
  let maxLevel: CrisisLevel = 'low';
  let highestConfidence = 0;

  for (const crisisKeyword of CRISIS_KEYWORDS) {
    if (lowercaseContent.includes(crisisKeyword.keyword)) {
      if (crisisKeyword.confidence > highestConfidence) {
        maxLevel = crisisKeyword.level;
        highestConfidence = crisisKeyword.confidence;
      }
    }
  }

  return maxLevel;
}

/**
 * Create a new chat session
 */
function createChatSession(userId?: string, isAnonymous: boolean = true): ChatSession {
  const sessionId = `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const session: ChatSession = {
    id: sessionId,
    userId,
    participants: [],
    messages: [],
    status: 'active',
    crisisLevel: 'low',
    priority: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    isAnonymous,
    language: 'en'
  };

  chatSessions.set(sessionId, session);
  return session;
}

/**
 * Add a message to a chat session
 */
function addMessageToSession(
  sessionId: string,
  message: Omit<ChatMessage, 'id' | 'chatId' | 'timestamp'>
): ChatMessage {
  const session = chatSessions.get(sessionId);
  if (!session) {
    throw new Error('Chat session not found');
  }

  const chatMessage: ChatMessage = {
    ...message,
    id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    chatId: sessionId,
    timestamp: new Date()
  };

  // Add to session messages
  session.messages.push(chatMessage);
  session.updatedAt = new Date();

  // Update session crisis level based on message
  const messageCrisisLevel = analyzeCrisisLevel(message.content);
  if (messageCrisisLevel !== 'low') {
    session.crisisLevel = messageCrisisLevel;
    session.priority = messageCrisisLevel === 'critical' ? 10 :
                     messageCrisisLevel === 'high' ? 7 : 4;
  }

  messages.set(chatMessage.id, chatMessage);
  return chatMessage;
}

/**
 * GET /api/chat/messages - Retrieve chat messages
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');
    const messageId = searchParams.get('messageId');
    const userId = searchParams.get('userId');

    if (messageId) {
      // Retrieve specific message
      const message = messages.get(messageId);
      if (!message) {
        return NextResponse.json(
          { error: 'Message not found' },
          { status: 404 }
        );
      }

      // Verify user has access to message
      if (userId && message.senderId !== userId) {
        // Check if user is participant in the chat session
        const session = chatSessions.get(message.chatId);
        if (!session || session.userId !== userId) {
          return NextResponse.json(
            { error: 'Unauthorized access to message' },
            { status: 403 }
          );
        }
      }

      return NextResponse.json({ message });
    }

    if (sessionId) {
      // Retrieve all messages for a session
      const session = chatSessions.get(sessionId);
      if (!session) {
        return NextResponse.json(
          { error: 'Chat session not found' },
          { status: 404 }
        );
      }

      // Verify user has access to session
      if (userId && session.userId !== userId) {
        return NextResponse.json(
          { error: 'Unauthorized access to session' },
          { status: 403 }
        );
      }

      return NextResponse.json({
        session: {
          id: session.id,
          crisisLevel: session.crisisLevel,
          priority: session.priority,
          createdAt: session.createdAt,
          updatedAt: session.updatedAt
        },
        messages: session.messages
      });
    }

    return NextResponse.json(
      { error: 'sessionId or messageId parameter required' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Error retrieving messages:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/chat/messages - Create a new chat message
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      content,
      sessionId,
      userId,
      senderName,
      messageType = 'text',
      isAnonymous = true,
      replyToId,
      metadata
    } = body;

    // Validate required fields
    if (!content || !senderName) {
      return NextResponse.json(
        { error: 'Content and senderName are required' },
        { status: 400 }
      );
    }

    let session: ChatSession;

    if (sessionId) {
      // Use existing session
      const existingSession = chatSessions.get(sessionId);
      if (!existingSession) {
        return NextResponse.json(
          { error: 'Chat session not found' },
          { status: 404 }
        );
      }
      session = existingSession;
    } else {
      // Create new session
      session = createChatSession(userId, isAnonymous);
    }

    // Create message
    const crisisLevel = analyzeCrisisLevel(content);
    const message = addMessageToSession(session.id, {
      senderId: userId || `anon_${Date.now()}`,
      sender: {
        id: userId || `anon_${Date.now()}`,
        name: senderName,
        type: 'user',
        isOnline: true
      },
      content,
      status: 'sent',
      messageType,
      crisisLevel,
      isEncrypted: false, // Messages are encrypted in transit via WebSocket
      replyToId,
      metadata
    });

    // Check for crisis escalation
    if (crisisLevel === 'critical' || crisisLevel === 'high') {
      // Trigger emergency escalation
      await triggerCrisisEscalation(session.id, crisisLevel, content);
    }

    return NextResponse.json({
      message,
      session: {
        id: session.id,
        crisisLevel: session.crisisLevel,
        priority: session.priority
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating message:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/chat/messages - Update message status
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { messageId, status, userId } = body;

    if (!messageId || !status) {
      return NextResponse.json(
        { error: 'messageId and status are required' },
        { status: 400 }
      );
    }

    const message = messages.get(messageId);
    if (!message) {
      return NextResponse.json(
        { error: 'Message not found' },
        { status: 404 }
      );
    }

    // Verify user has permission to update message
    if (userId && message.senderId !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized to update this message' },
        { status: 403 }
      );
    }

    // Update message status
    message.status = status as MessageStatus;
    messages.set(messageId, message);

    return NextResponse.json({ message });

  } catch (error) {
    console.error('Error updating message:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/chat/messages - Delete a message
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const messageId = searchParams.get('messageId');
    const userId = searchParams.get('userId');

    if (!messageId) {
      return NextResponse.json(
        { error: 'messageId parameter required' },
        { status: 400 }
      );
    }

    const message = messages.get(messageId);
    if (!message) {
      return NextResponse.json(
        { error: 'Message not found' },
        { status: 404 }
      );
    }

    // Verify user has permission to delete message
    if (userId && message.senderId !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized to delete this message' },
        { status: 403 }
      );
    }

    // Remove message from session
    const session = chatSessions.get(message.chatId);
    if (session) {
      session.messages = session.messages.filter(msg => msg.id !== messageId);
      session.updatedAt = new Date();
    }

    // Delete message
    messages.delete(messageId);

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error deleting message:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Trigger crisis escalation for high-risk messages
 */
async function triggerCrisisEscalation(sessionId: string, level: CrisisLevel, content: string): Promise<void> {
  const session = chatSessions.get(sessionId);
  if (!session) return;

  // Update session status
  session.status = level === 'critical' ? 'emergency' : 'active';

  // Here you would integrate with emergency services
  // For now, we'll just log the escalation
  console.log(`CRISIS ESCALATION: Session ${sessionId} - Level: ${level}`, {
    content: content.substring(0, 100) + '...',
    timestamp: new Date(),
    userId: session.userId
  });

  // In a real implementation, you would:
  // 1. Notify crisis intervention specialists
  // 2. Prepare emergency contact information
  // 3. Connect to emergency services if needed
  // 4. Create case file for legal team
}