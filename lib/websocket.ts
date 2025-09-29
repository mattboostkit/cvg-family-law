import { ChatMessage, WebSocketMessage, TypingIndicator, ChatError, CrisisLevel } from '@/types/chat';
import { generateEncryptionKey, encryptData, decryptData, EncryptionKey } from './chat-encryption';

export interface WebSocketConfig {
  url: string;
  reconnectInterval: number;
  maxReconnectAttempts: number;
  heartbeatInterval: number;
  encryptionEnabled: boolean;
}

export interface WebSocketEvents {
  onMessage: (message: ChatMessage) => void;
  onTyping: (indicator: TypingIndicator) => void;
  onPresence: (userId: string, isOnline: boolean) => void;
  onError: (error: ChatError) => void;
  onConnect: () => void;
  onDisconnect: () => void;
  onCrisisEscalation: (level: CrisisLevel, reason: string) => void;
}

export class ChatWebSocketManager {
  private ws: WebSocket | null = null;
  private config: WebSocketConfig;
  private events: WebSocketEvents;
  private reconnectAttempts = 0;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private heartbeatTimer: NodeJS.Timeout | null = null;
  private isConnecting = false;
  private encryptionKey: EncryptionKey | null = null;
  private sessionId: string | null = null;

  constructor(config: WebSocketConfig, events: WebSocketEvents) {
    this.config = config;
    this.events = events;
    this.setupEncryption();
  }

  /**
   * Initialize encryption for the session
   */
  private setupEncryption(): void {
    if (this.config.encryptionEnabled) {
      this.encryptionKey = generateEncryptionKey();
    }
  }

  /**
   * Generate a unique session ID
   */
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Connect to the WebSocket server
   */
  async connect(userId?: string): Promise<void> {
    if (this.isConnecting || (this.ws?.readyState === WebSocket.OPEN)) {
      return;
    }

    this.isConnecting = true;
    this.sessionId = this.generateSessionId();

    try {
      const wsUrl = new URL(this.config.url);
      if (userId) wsUrl.searchParams.set('userId', userId);
      wsUrl.searchParams.set('sessionId', this.sessionId);

      this.ws = new WebSocket(wsUrl.toString());

      this.ws.onopen = this.handleOpen.bind(this);
      this.ws.onmessage = this.handleMessage.bind(this);
      this.ws.onclose = this.handleClose.bind(this);
      this.ws.onerror = this.handleError.bind(this);

    } catch (error) {
      this.isConnecting = false;
      this.events.onError({
        code: 'CONNECTION_ERROR',
        message: 'Failed to establish WebSocket connection',
        details: error,
        timestamp: new Date()
      });
    }
  }

  /**
   * Handle WebSocket connection open
   */
  private handleOpen(): void {
    this.isConnecting = false;
    this.reconnectAttempts = 0;
    this.startHeartbeat();

    this.events.onConnect();

    // Send initial handshake with encryption info
    this.sendHandshake();
  }

  /**
   * Handle incoming WebSocket messages
   */
  private handleMessage(event: MessageEvent): void {
    try {
      let data: WebSocketMessage = JSON.parse(event.data);

      // Decrypt message if encryption is enabled
      if (this.config.encryptionEnabled && this.encryptionKey) {
        const decryptedContent = decryptData({
          encrypted: Buffer.from(data.payload.encrypted, 'base64'),
          key: this.encryptionKey.key,
          iv: Buffer.from(data.payload.iv, 'base64'),
          salt: this.encryptionKey.salt,
          algorithm: data.payload.algorithm || 'aes-256-gcm'
        });
        data = JSON.parse(decryptedContent);
      }

      this.processMessage(data);
    } catch (error) {
      this.events.onError({
        code: 'MESSAGE_PARSE_ERROR',
        message: 'Failed to parse incoming message',
        details: error,
        timestamp: new Date()
      });
    }
  }

  /**
   * Process different types of WebSocket messages
   */
  private processMessage(data: WebSocketMessage): void {
    switch (data.type) {
      case 'message':
        this.events.onMessage(data.payload);
        break;
      case 'typing':
        this.events.onTyping(data.payload);
        break;
      case 'presence':
        this.events.onPresence(data.payload.userId, data.payload.isOnline);
        break;
      case 'error':
        this.events.onError(data.payload);
        break;
      case 'system':
        this.handleSystemMessage(data.payload);
        break;
    }
  }

  /**
   * Handle system messages (crisis escalation, etc.)
   */
  private handleSystemMessage(payload: any): void {
    switch (payload.action) {
      case 'crisis_escalation':
        this.events.onCrisisEscalation(payload.level, payload.reason);
        break;
      case 'specialist_assigned':
        // Handle specialist assignment
        break;
      case 'emergency_services':
        // Handle emergency services notification
        break;
    }
  }

  /**
   * Handle WebSocket connection close
   */
  private handleClose(event: CloseEvent): void {
    this.isConnecting = false;
    this.stopHeartbeat();

    this.events.onDisconnect();

    // Attempt to reconnect if not manually closed
    if (event.code !== 1000 && this.reconnectAttempts < this.config.maxReconnectAttempts) {
      this.scheduleReconnect();
    }
  }

  /**
   * Handle WebSocket errors
   */
  private handleError(error: Event): void {
    this.isConnecting = false;
    this.events.onError({
      code: 'WEBSOCKET_ERROR',
      message: 'WebSocket connection error occurred',
      details: error,
      timestamp: new Date()
    });
  }

  /**
   * Send initial handshake with encryption setup
   */
  private sendHandshake(): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;

    const handshake = {
      type: 'handshake',
      sessionId: this.sessionId,
      timestamp: new Date(),
      encryptionEnabled: this.config.encryptionEnabled,
      encryptionKey: this.config.encryptionEnabled && this.encryptionKey ?
        this.encryptionKey.key.toString('base64') : null
    };

    this.send(handshake);
  }

  /**
   * Start heartbeat to keep connection alive
   */
  private startHeartbeat(): void {
    this.heartbeatTimer = setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.send({ type: 'heartbeat', timestamp: new Date() });
      }
    }, this.config.heartbeatInterval);
  }

  /**
   * Stop heartbeat timer
   */
  private stopHeartbeat(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  /**
   * Schedule reconnection attempt
   */
  private scheduleReconnect(): void {
    this.reconnectAttempts++;
    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);

    this.reconnectTimer = setTimeout(() => {
      this.connect();
    }, delay);
  }

  /**
   * Send a message through the WebSocket
   */
  send(data: any): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      this.events.onError({
        code: 'SEND_ERROR',
        message: 'WebSocket is not connected',
        timestamp: new Date()
      });
      return;
    }

    try {
      let messageData = JSON.stringify({
        ...data,
        timestamp: new Date()
      });

      // Encrypt message if encryption is enabled
      if (this.config.encryptionEnabled && this.encryptionKey) {
        const encrypted = encryptData(messageData, this.encryptionKey);
        messageData = JSON.stringify({
          encrypted: encrypted.encrypted.toString('base64'),
          iv: encrypted.iv.toString('base64'),
          salt: encrypted.salt.toString('base64'),
          algorithm: encrypted.algorithm
        });
      }

      this.ws.send(messageData);
    } catch (error) {
      this.events.onError({
        code: 'SEND_ERROR',
        message: 'Failed to send message',
        details: error,
        timestamp: new Date()
      });
    }
  }

  /**
   * Send a chat message
   */
  sendMessage(chatId: string, content: string, messageType: 'text' | 'file' = 'text', metadata?: any): void {
    this.send({
      type: 'message',
      chatId,
      content,
      messageType,
      metadata
    });
  }

  /**
   * Send typing indicator
   */
  sendTyping(chatId: string, isTyping: boolean): void {
    this.send({
      type: 'typing',
      chatId,
      isTyping
    });
  }

  /**
   * Update user presence
   */
  updatePresence(isOnline: boolean): void {
    this.send({
      type: 'presence',
      isOnline
    });
  }

  /**
   * Disconnect from WebSocket
   */
  disconnect(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
    }
    this.stopHeartbeat();

    if (this.ws) {
      this.ws.close(1000, 'Manual disconnect');
      this.ws = null;
    }
  }

  /**
   * Get connection status
   */
  getConnectionStatus(): 'connected' | 'connecting' | 'disconnected' {
    if (this.isConnecting) return 'connecting';
    if (this.ws?.readyState === WebSocket.OPEN) return 'connected';
    return 'disconnected';
  }

  /**
   * Get current session ID
   */
  getSessionId(): string | null {
    return this.sessionId;
  }

  /**
   * Get encryption key (for client-side storage)
   */
  getEncryptionKey(): EncryptionKey | null {
    return this.encryptionKey;
  }
}