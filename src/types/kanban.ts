export interface Card {
  id: string;
  code?: string;
  title: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high';
  assignee?: string;
  tags?: string[];
  status?: string;
  points?: number;
  createdAt?: Date;
  acceptance?: string;
  history?: HistoryEntry[];
}

export interface HistoryEntry {
  id: string;
  previousStatus: string;
  newStatus: string;
  comment: string;
  evidence?: string;
  timestamp: Date;
  user: string;
}

export interface Column {
  id: string;
  title: string;
  cards: Card[];
}