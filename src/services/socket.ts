// === Socket.io Client for Real-time Kanban Updates ===

import { io, Socket } from 'socket.io-client';
import type { Requirement, ID } from '../types/api';

// Backend sends: { boardId, columnId, requirement }
type RequirementCreatedEvent = { boardId: ID; columnId: ID; requirement: Requirement };

// Backend sends: { boardId, requirementId, data: Requirement }
type RequirementUpdatedEvent = { boardId: ID; requirementId: ID; data: Requirement };

// Backend sends: { boardId, requirementId, fromColumnId, toColumnId, position }
type RequirementMovedEvent = { 
  boardId: ID; 
  requirementId: ID; 
  fromColumnId: ID; 
  toColumnId: ID; 
  position: number 
};

// Backend sends: { boardId, requirementId }
type RequirementDeletedEvent = { boardId: ID; requirementId: ID };

export type RequirementCreatedHandler = (requirement: Requirement, columnId: ID) => void;
export type RequirementUpdatedHandler = (requirement: Requirement) => void;
export type RequirementMovedHandler = (requirementId: ID, fromColumnId: ID, toColumnId: ID, position: number) => void;
export type RequirementDeletedHandler = (requirementId: ID) => void;

interface KanbanEventHandlers {
  'requirement:created'?: RequirementCreatedHandler;
  'requirement:updated'?: RequirementUpdatedHandler;
  'requirement:moved'?: RequirementMovedHandler;
  'requirement:deleted'?: RequirementDeletedHandler;
}

class KanbanSocket {
  private socket: Socket | null = null;

  /** Connect to socket server with JWT token */
  connect(token: string): void {
    if (this.socket?.connected) return;

    const socketUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

    this.socket = io(socketUrl, {
      auth: { token },
      transports: ['websocket', 'polling'],
    });

    this.socket.on('connect', () => {
      console.log('[KanbanSocket] Connected:', this.socket?.id);
    });

    this.socket.on('connect_error', (err) => {
      console.error('[KanbanSocket] Connection error:', err.message);
    });
  }

  /** Disconnect from socket server */
  disconnect(): void {
    if (!this.socket) return;
    this.socket.disconnect();
    this.socket = null;
  }

  /** Join a board room for real-time updates - backend expects number */
  joinBoard(boardId: ID): void {
    if (!this.socket?.connected) {
      console.warn('[KanbanSocket] Not connected. Call connect() first.');
      return;
    }
    this.socket.emit('board:join', boardId);
  }

  /** Leave a board room */
  leaveBoard(boardId: ID): void {
    if (!this.socket?.connected) return;
    this.socket.emit('board:leave', boardId);
  }

  /** Subscribe to board events */
  on(events: KanbanEventHandlers): void {
    if (!this.socket) return;

    if (events['requirement:created']) {
      this.socket.on('requirement:created', (data: RequirementCreatedEvent) => {
        events['requirement:created']!(data.requirement, data.columnId);
      });
    }
    if (events['requirement:updated']) {
      this.socket.on('requirement:updated', (data: RequirementUpdatedEvent) => {
        events['requirement:updated']!(data.data);
      });
    }
    if (events['requirement:moved']) {
      this.socket.on('requirement:moved', (data: RequirementMovedEvent) => {
        events['requirement:moved']!(data.requirementId, data.fromColumnId, data.toColumnId, data.position);
      });
    }
    if (events['requirement:deleted']) {
      this.socket.on('requirement:deleted', (data: RequirementDeletedEvent) => {
        events['requirement:deleted']!(data.requirementId);
      });
    }
  }

  /** Unsubscribe from board events */
  off(event: keyof KanbanEventHandlers): void {
    if (!this.socket) return;
    this.socket.off(event);
  }

  get connected(): boolean {
    return this.socket?.connected ?? false;
  }
}

export const kanbanSocket = new KanbanSocket();
export default KanbanSocket;