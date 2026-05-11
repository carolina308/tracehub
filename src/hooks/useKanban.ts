import { useState, useEffect } from 'react';
import type { Column, Card, HistoryEntry } from '../types/kanban';

const defaultColumns: Column[] = [
  { id: 'todo', title: 'Por hacer', cards: [] },
  { id: 'inProgress', title: 'En progreso', cards: [] },
  { id: 'finalizado', title: 'Finalizado', cards: [] }
];

export const useKanban = () => {
  const [columns, setColumns] = useState<Column[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('kanban');
    if (saved) setColumns(JSON.parse(saved));
    else setColumns(defaultColumns);
  }, []);

  useEffect(() => {
    localStorage.setItem('kanban', JSON.stringify(columns));
  }, [columns]);

  const addCard = (columnId: string, title: string, requirementData?: any) => {
    if (!title.trim()) return;

    const newCard: Card = {
      id: Date.now().toString(),
      title,
      code: requirementData?.code || `TH-${Math.floor(Math.random() * 900 + 100)}`,
      description: requirementData?.description || '',
      priority: requirementData?.priority as 'low' | 'medium' | 'high' || 'medium',
      assignee: requirementData?.assignee || 'Unassigned',
      tags: requirementData?.tags || ['new'],
      status: requirementData?.status || columnId,
      points: requirementData?.points || 0,
      createdAt: requirementData?.createdAt || new Date(),
      acceptance: requirementData?.acceptance || '',
      history: []
    };

    setColumns(prev =>
      prev.map(col =>
        col.id === columnId
          ? { ...col, cards: [...col.cards, newCard] }
          : col
      )
    );
  };

  const moveCard = (cardId: string, targetColumnId: string, comment: string = '', evidence: string = '', userId: string = 'system') => {
    setColumns(prevColumns => {
      let movedCard: Card | null = null;
      let previousStatus: string = '';

      const columnsWithoutCard = prevColumns.map(col => {
        const filtered = col.cards.filter((card: Card) => {
          if (card.id === cardId) {
            movedCard = card;
            previousStatus = card.status || 'unknown';
            return false;
          }
          return true;
        });
        return { ...col, cards: filtered };
      });

      if (!movedCard) return prevColumns;

      const targetColumnExists = columnsWithoutCard.some(col => col.id === targetColumnId);
      if (!targetColumnExists) return prevColumns;

      const historyEntry: HistoryEntry = {
        id: `${cardId}-${Date.now()}`,
        previousStatus,
        newStatus: targetColumnId,
        comment,
        evidence: evidence || undefined,
        timestamp: new Date(),
        user: userId
      };
      
      if (!movedCard) return prevColumns;

      // TypeScript necesita esta verificación explícita para el tipo
      const cardToMove = movedCard as Card;
      const updatedCard: Card = {
        ...cardToMove,
        status: targetColumnId,
        history: [
          ...(cardToMove.history || []),
          historyEntry
        ],
      };
 
      return columnsWithoutCard.map(col =>
        col.id === targetColumnId
          ? { ...col, cards: [...col.cards, updatedCard] }
          : col
      );
    });
  };

  return { columns, addCard, moveCard };
};
         