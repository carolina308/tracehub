// === HTTP API Client for TraceHub ===

import type {
  Board,
  Requirement,
  Column,
  ApiResponse,
  CreateRequirementInput,
  UpdateRequirementInput,
  MoveRequirementInput,
  AssignRequirementInput,
  ID,
  BoardMember,
  User,
} from '../types/api';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`API Error ${response.status}: ${error || response.statusText}`);
  }
  const json: ApiResponse<T> = await response.json();
  if (!json.success) {
    throw new Error(json.error || 'API request failed');
  }
  return json.data;
}

export const api = {
  // === Boards ===

  /** Get all boards for the current user */
  async getBoards(): Promise<Board[]> {
    const res = await fetch(`${API_BASE}/api/boards`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<Board[]>(res);
  },

  /** Get a single board with all columns and requirements */
  async getBoard(id: ID): Promise<Board> {
    const res = await fetch(`${API_BASE}/api/boards/${id}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<Board>(res);
  },

  /** Create a new board */
  async createBoard(name: string, description?: string): Promise<Board> {
    const res = await fetch(`${API_BASE}/api/boards`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ name, description }),
    });
    return handleResponse<Board>(res);
  },

  // === Columns ===

  /** Create a new column in a board */
  async createColumn(boardId: ID, name: string): Promise<Column> {
    const res = await fetch(`${API_BASE}/api/boards/${boardId}/columns`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ name }),
    });
    return handleResponse<Column>(res);
  },

  // === Requirements ===

  /** Create a new requirement in a column */
  async createRequirement(
    columnId: ID,
    input: CreateRequirementInput
  ): Promise<Requirement> {
    const res = await fetch(`${API_BASE}/api/columns/${columnId}/requirements`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(input),
    });
    return handleResponse<Requirement>(res);
  },

  /** Get a single requirement */
  async getRequirement(id: ID): Promise<Requirement> {
    const res = await fetch(`${API_BASE}/api/requirements/${id}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<Requirement>(res);
  },

  /** Update requirement fields */
  async updateRequirement(
    id: ID,
    input: UpdateRequirementInput
  ): Promise<Requirement> {
    const res = await fetch(`${API_BASE}/api/requirements/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(input),
    });
    return handleResponse<Requirement>(res);
  },

  /** Move a requirement to a different column */
  async moveRequirement(
    id: ID,
    columnId: ID,
    position: number
  ): Promise<Requirement> {
    const res = await fetch(`${API_BASE}/api/requirements/${id}/move`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ columnId, position }),
    });
    return handleResponse<Requirement>(res);
  },

  /** Delete a requirement */
  async deleteRequirement(id: ID): Promise<void> {
    const res = await fetch(`${API_BASE}/api/requirements/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!res.ok) {
      const error = await res.text();
      throw new Error(`API Error ${res.status}: ${error}`);
    }
  },

  /** Assign a requirement to a team member */
  async assignRequirement(
    id: ID,
    assigneeId: ID | null
  ): Promise<Requirement> {
    const res = await fetch(`${API_BASE}/api/requirements/${id}/assign`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ assigneeId }),
    });
    return handleResponse<Requirement>(res);
  },

  // === Members ===

  /** List board members */
  async listMembers(boardId: ID): Promise<BoardMember[]> {
    const res = await fetch(`${API_BASE}/api/boards/${boardId}/members`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<BoardMember[]>(res);
  },

  /** Add a member by email */
  async addMember(boardId: ID, email: string, role: string): Promise<BoardMember> {
    const res = await fetch(`${API_BASE}/api/boards/${boardId}/members`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ email, role }),
    });
    return handleResponse<BoardMember>(res);
  },

  /** Update member role */
  async updateMemberRole(boardId: ID, userId: ID, role: string): Promise<BoardMember> {
    const res = await fetch(`${API_BASE}/api/boards/${boardId}/members/${userId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ role }),
    });
    return handleResponse<BoardMember>(res);
  },

  /** Remove a member */
  async removeMember(boardId: ID, userId: ID): Promise<void> {
    const res = await fetch(`${API_BASE}/api/boards/${boardId}/members/${userId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!res.ok) {
      const error = await res.text();
      throw new Error(`API Error ${res.status}: ${error}`);
    }
  },

  // === Evidence ===

  /** Upload evidence file for a requirement */
  async uploadEvidence(requirementId: ID, file: File): Promise<{ id: ID; fileName: string; originalName: string }> {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${API_BASE}/api/evidence/${requirementId}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      body: formData,
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Upload failed');
    return json.data;
  },

  /** List evidence for a requirement */
  async listEvidence(requirementId: ID): Promise<{ id: ID; fileName: string; originalName: string; mimeType: string; fileSize: number; createdAt: string }[]> {
    const res = await fetch(`${API_BASE}/api/evidence/${requirementId}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  /** Get download URL for an evidence file */
  getEvidenceDownloadUrl(evidenceId: ID): string {
    return `${API_BASE}/api/evidence/file/${evidenceId}`;
  },

  /** Delete evidence */
  async deleteEvidence(evidenceId: ID): Promise<void> {
    const res = await fetch(`${API_BASE}/api/evidence/${evidenceId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!res.ok) {
      const error = await res.text();
      throw new Error(`API Error ${res.status}: ${error}`);
    }
  },

  // === Auth ===

  /** Register a new user with all fields */
  async register(data: {
    email: string;
    password: string;
    dni?: string;
    phone?: string;
    address?: string;
    role?: string;
    firstName: string;
    middleName?: string;
    lastName: string;
    secondLastName?: string;
  }): Promise<{ user: User; token: string }> {
    const res = await fetch(`${API_BASE}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  /** Login with email and password */
  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return handleResponse(res);
  },

  /** Change password */
  async changePassword(currentPassword: string, newPassword: string): Promise<{ message: string }> {
    const res = await fetch(`${API_BASE}/api/auth/password`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    return handleResponse(res);
  },
};