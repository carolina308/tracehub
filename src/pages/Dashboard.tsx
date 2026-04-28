import React, { useState } from 'react';

type Card = {
  id: string;
  title: string;
  description?: string;
  assignee?: string;
  priority?: 'low' | 'medium' | 'high';
  tags?: string[];
};

type Column = {
  id: string;
  title: string;
  cards: Card[];
};

const Dashboard: React.FC = () => {
  const [columns, setColumns] = useState<Column[]>([
    {
      id: 'todo',
      title: 'To Do',
      cards: [
        {
          id: '1',
          title: 'Define authentication schema for Tracehub Pro',
          description: 'Create detailed specifications for the authentication system including JWT, OAuth2, and session management.',
          assignee: 'Alex Chen',
          priority: 'high',
          tags: ['backend', 'security']
        },
        {
          id: '2',
          title: 'Setup CI/CD pipeline for frontend',
          description: 'Configure GitHub Actions for automated testing and deployment of the frontend application.',
          assignee: 'Maria Garcia',
          priority: 'medium',
          tags: ['devops', 'frontend']
        }
      ]
    },
    {
      id: 'in-progress',
      title: 'In Progress',
      cards: [
        {
          id: '3',
          title: 'Refactor bento-grid layout for mobile responsiveness',
          description: 'Update the dashboard layout to use CSS Grid and Flexbox for better mobile experience.',
          assignee: 'Sarah K.',
          priority: 'medium',
          tags: ['frontend', 'ui']
        },
        {
          id: '4',
          title: 'Implement real-time event tracking',
          description: 'Add WebSocket connections for live updates of project metrics and user activities.',
          assignee: 'James Wilson',
          priority: 'high',
          tags: ['backend', 'realtime']
        }
      ]
    },
    {
      id: 'done',
      title: 'Done',
      cards: [
        {
          id: '5',
          title: 'Integrate third-party analytics service',
          description: 'Connected Google Analytics and Mixpanel for user behavior tracking.',
          assignee: 'Lisa Chen',
          priority: 'low',
          tags: ['analytics', 'integration']
        },
        {
          id: '6',
          title: 'Fix login page responsiveness',
          description: 'Resolved issues with form alignment on mobile devices.',
          assignee: 'David Kim',
          priority: 'low',
          tags: ['bugfix', 'frontend']
        }
      ]
    }
  ]);

  const [newCardTitle, setNewCardTitle] = useState('');
  const [activeColumn, setActiveColumn] = useState<string>('todo');

  const handleAddCard = () => {
    if (newCardTitle.trim()) {
      const newCard: Card = {
        id: Date.now().toString(),
        title: newCardTitle,
      };
      setColumns(prev => 
        prev.map(column => 
          column.id === activeColumn 
            ? { ...column, cards: [...column.cards, newCard] } 
            : column
        )
      );
      setNewCardTitle('');
    }
  };

  const handleDragStart = (e: React.DragEvent, cardId: string) => {
    e.dataTransfer.setData('text/plain', cardId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    const cardId = e.dataTransfer.getData('text/plain');
    if (cardId) {
      // Find the card and move it to the new column
      setColumns(prev => {
        // Remove card from its current column
        const updatedColumns = prev.map(column => ({
          ...column,
          cards: column.cards.filter(card => card.id !== cardId)
        }));
        
        // Find the card being moved
        const movedCard = prev.find(column => 
          column.cards.some(card => card.id === cardId)
        )?.cards.find(card => card.id === cardId);
        
        if (!movedCard) return prev;
        
        // Add card to the target column
        return updatedColumns.map(column => 
          column.id === columnId 
            ? { ...column, cards: [...column.cards, movedCard] } 
            : column
        );
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <header className="mb-8 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <div className="flex space-x-4">
          <button 
            className="px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Filter
          </button>
          <button 
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Export
          </button>
          <button 
            className="ml-4 px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            New Column
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {columns.map(column => (
          <div 
            key={column.id} 
            className="border border-gray-200 rounded-lg bg-white p-4"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, column.id)}
          >
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-lg font-semibold text-gray-700">{column.title}</h2>
              <span className="text-xs text-gray-500">{column.cards.length}</span>
            </div>
            
            <div className="space-y-3">
              {column.cards.map(card => (
                <div 
                  key={card.id} 
                  className="border border-gray-200 rounded-lg p-3 bg-gray-50 cursor-grab"
                  draggable
                  onDragStart={(e) => handleDragStart(e, card.id)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-gray-800">{card.title}</h3>
                    <div className="flex space-x-2 text-xs">
                      {card.priority && (
                        <span 
                          className={`px-2 py-0.5 rounded text-xs font-medium 
                          ${card.priority === 'high' ? 'bg-red-100 text-red-800' 
                              : card.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' 
                              : 'bg-green-100 text-green-800'}`}
                        >
                          {card.priority}
                        </span>
                      )}
                      {card.assignee && (
                        <span className="flex items-center space-x-1 text-gray-600">
                          <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                          </svg>
                          {card.assignee}
                        </span>
                      )}
                    </div>
                  </div>
                  {card.description && (
                    <p className="text-sm text-gray-600 line-clamp-2">{card.description}</p>
                  )}
                  {card.tags && card.tags.length > 0 && (
                    <div className="flex flex-wrap mt-2 space-x-1">
                      {card.tags.map(tag => (
                        <span 
                          key={tag} 
                          className="px-2 py-0.5 bg-gray-200 text-gray-700 text-xs rounded"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              
              {/* Add card form */}
              <div className="mt-4 pt-3 border-t border-gray-200">
                <input
                  type="text"
                  value={newCardTitle}
                  onChange={(e) => setNewCardTitle(e.target.value)}
                  placeholder="Add a new card..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <div className="mt-2 flex justify-end">
                  <button 
                    onClick={handleAddCard}
                    disabled={!newCardTitle.trim()}
                    className="px-3 py-1 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700"
                  >
                    Add Card
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;