export type Priority = 'low' | 'medium' | 'high';


export interface Card {
  id: string;
  title: string;
  description?: string;
  assignee?: string;
  priority?: Priority;
  tags?: string[];
}

export interface Column {
  id: string;
  title: string;
  cards: Card[];
}
