import { useState, useEffect } from 'react';
import type { Column, Card } from '../types/kanban';

const defaultColumns: Column[] = [
  { id: 'todo', title: 'Por hacer', cards: [] },
  { id: 'En progreso', title: 'En progreso', cards: [] },
  { id: 'Finalizado', title: 'Finalizado', cards: [] }
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

  const addCard = (columnId: string, title: string) => {
    if (!title.trim()) return;

    const newCard: Card = {
      id: Date.now().toString(),
      title,
      tags: []
    };

    setColumns(prev =>
      prev.map(col =>
        col.id === columnId
          ? { ...col, cards: [...col.cards, newCard] }
          : col
      )
    );
  };

  const moveCard = (cardId: string, targetColumn: string) => {
    let moved: Card | null = null;

    const updated = columns.map(col => {
      const filtered = col.cards.filter((card: Card) => {
        if (card.id === cardId) {
          moved = card;
          return false;
        }
        return true;
      });
      return { ...col, cards: filtered };
    });

    if (!moved) return;

    setColumns(
      updated.map(col =>
        col.id === targetColumn
          ? { ...col, cards: [...col.cards, moved!] }
          : col
      )
    );
  };

  return { columns, addCard, moveCard };
};