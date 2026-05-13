// === Kanban Integration Types ===

// Backend uses Prisma Int for IDs, not strings
export type ID = number;

export const Priority = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  URGENT: 'URGENT',
} as const;

export type Priority = (typeof Priority)[keyof typeof Priority];

// Backend returns nested User object with split name fields
export interface User {
  id: ID;
  email: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  secondLastName?: string;
  role?: string;
  dni?: string;
  phone?: string;
  address?: string;
}

// Backend returns nested BoardMember with role
export interface BoardMember {
  id: ID;
  userId: ID;
  role: 'OWNER' | 'MEMBER' | 'VIEWER';
  user: User;
  joinedAt: string;
}

export interface Evidence {
  id: ID;
  fileName: string;
  originalName: string;
  mimeType: string;
  fileSize: number;
  createdAt: string;
}

// Backend requirement response includes nested assignee and column
export interface Requirement {
  id: ID;
  title: string;
  description?: string;
  priority: Priority;
  position: number;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  assignee: User | null;
  evidence: Evidence[];
  column: {
    id: ID;
    name: string;
    boardId: ID;
  };
}

export interface Column {
  id: ID;
  name: string;
  position: number;
  boardId: ID;
  requirements: Requirement[];
}

export interface Board {
  id: ID;
  name: string;
  description?: string;
  owner: User;
  columns: Column[];
  members: BoardMember[];
}

// === API Response Wrapper ===

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
  message?: string;
}

// === Board Operations ===

export interface CreateRequirementInput {
  title: string;
  description?: string;
  priority?: Priority;
  dueDate?: string;
}

export interface UpdateRequirementInput {
  title?: string;
  description?: string;
  priority?: Priority;
  dueDate?: string | null;
}

export interface MoveRequirementInput {
  columnId: ID;
  position: number;
}

export interface AssignRequirementInput {
  assigneeId: ID | null;
}