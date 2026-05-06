export interface Card {
  id: string;
  code?: string;
  title: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high';
  assignee?: string;
  tags?: string[];
}

export interface Column {
  id: string;
  title: string;
  cards: Card[];
}