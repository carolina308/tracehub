import { useState, useEffect, useCallback, useRef } from 'react';
import type { Board, Requirement, ID, Priority } from '../types/api';
import { api } from '../services/api';
import { kanbanSocket } from '../services/socket';

export interface KanbanState {
  board: Board | null;
  loading: boolean;
  error: string | null;
}

interface UseKanbanReturn {
  board: Board | null;
  columns: { id: ID; name: string; requirements: Requirement[] }[];
  loading: boolean;
  error: string | null;
  createRequirement: (columnId: ID, title: string, description?: string, priority?: Priority) => Promise<Requirement | undefined>;
  updateRequirement: (requirementId: ID, updates: { title?: string; description?: string; priority?: Priority; dueDate?: string | null }) => Promise<void>;
  moveRequirement: (requirementId: ID, targetColumnId: ID, position: number) => Promise<void>;
  deleteRequirement: (requirementId: ID) => Promise<void>;
  assignRequirement: (requirementId: ID, assigneeId: ID | null) => Promise<void>;
  refetch: () => Promise<void>;
}

export const useKanban = (boardId?: ID): UseKanbanReturn => {
  const [board, setBoard] = useState<Board | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const boardIdRef = useRef<ID | undefined>(boardId);
  boardIdRef.current = boardId;

  // Fetch board on mount when boardId changes
  useEffect(() => {
    if (!boardId) return;

    const fetchBoard = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await api.getBoard(boardId);
        setBoard(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load board');
      } finally {
        setLoading(false);
      }
    };

    fetchBoard();
  }, [boardId]);

  // Socket connection and board room subscriptions
  useEffect(() => {
    if (!boardId) return;

    const token = localStorage.getItem('token');
    if (!token) return;

    kanbanSocket.connect(token);
    kanbanSocket.joinBoard(boardId);

    const handleCreated = (req: Requirement, columnId: ID) => {
      setBoard(prev => {
        if (!prev) return prev;
        // Avoid duplicates: check if requirement already exists
        const col = prev.columns.find(c => c.id === columnId);
        if (col?.requirements.some(r => r.id === req.id)) return prev;
        return {
          ...prev,
          columns: prev.columns.map(col =>
            col.id === columnId
              ? { ...col, requirements: [...col.requirements, req] }
              : col
          ),
        };
      });
    };

    const handleUpdated = (req: Requirement) => {
      setBoard(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          columns: prev.columns.map(col => ({
            ...col,
            requirements: col.requirements.map(r =>
              r.id === req.id ? req : r
            ),
          })),
        };
      });
    };

    const handleMoved = (requirementId: ID, _fromColumnId: ID, toColumnId: ID, _position: number) => {
      setBoard(prev => {
        if (!prev) return prev;
        
        // Find the requirement being moved
        let movedReq: Requirement | undefined;
        const columnsWithout = prev.columns.map(col => {
          const filtered = col.requirements.filter(r => {
            if (r.id === requirementId) {
              movedReq = r;
              return false;
            }
            return true;
          });
          return { ...col, requirements: filtered };
        });

        if (!movedReq) return prev;

        // Add to target column (avoid duplicates)
        const targetCol = columnsWithout.find(c => c.id === toColumnId);
        if (targetCol?.requirements.some(r => r.id === requirementId)) return prev;

        return {
          ...prev,
          columns: columnsWithout.map(col =>
            col.id === toColumnId
              ? { ...col, requirements: [...col.requirements, movedReq!] }
              : col
          ),
        };
      });
    };

    const handleDeleted = (requirementId: ID) => {
      setBoard(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          columns: prev.columns.map(col => ({
            ...col,
            requirements: col.requirements.filter(r => r.id !== requirementId),
          })),
        };
      });
    };

    kanbanSocket.on({
      'requirement:created': handleCreated,
      'requirement:updated': handleUpdated,
      'requirement:moved': handleMoved,
      'requirement:deleted': handleDeleted,
    });

    return () => {
      kanbanSocket.off('requirement:created');
      kanbanSocket.off('requirement:updated');
      kanbanSocket.off('requirement:moved');
      kanbanSocket.off('requirement:deleted');
      kanbanSocket.leaveBoard(boardId);
    };
  }, [boardId]);

  const refetch = useCallback(async () => {
    if (!boardIdRef.current) return;
    try {
      const data = await api.getBoard(boardIdRef.current);
      setBoard(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reload board');
    }
  }, []);

  const createRequirement = useCallback(async (
    columnId: ID,
    title: string,
    description?: string,
    priority?: Priority
  ): Promise<Requirement | undefined> => {
    try {
      const req = await api.createRequirement(columnId, { title, description, priority });
      // Add optimistically to local state
      setBoard(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          columns: prev.columns.map(col =>
            col.id === columnId
              ? { ...col, requirements: [...col.requirements, req] }
              : col
          ),
        };
      });
      return req;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create requirement');
    }
  }, []);

  const updateRequirement = useCallback(async (
    requirementId: ID,
    updates: { title?: string; description?: string; priority?: Priority; dueDate?: string | null }
  ) => {
    try {
      const updated = await api.updateRequirement(requirementId, updates);
      // Update optimistically in local state
      setBoard(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          columns: prev.columns.map(col => ({
            ...col,
            requirements: col.requirements.map(r =>
              r.id === requirementId ? { ...r, ...updated } : r
            ),
          })),
        };
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update requirement');
    }
  }, []);

  const moveRequirement = useCallback(async (
    requirementId: ID,
    targetColumnId: ID,
    position: number
  ) => {
    // Optimistic update: move in local state immediately
    setBoard(prev => {
      if (!prev) return prev;
      
      let movedReq: Requirement | undefined;
      const columnsWithout = prev.columns.map(col => {
        const filtered = col.requirements.filter(r => {
          if (r.id === requirementId) {
            movedReq = r;
            return false;
          }
          return true;
        });
        return { ...col, requirements: filtered };
      });

      if (!movedReq) return prev;

      return {
        ...prev,
        columns: columnsWithout.map(col =>
          col.id === targetColumnId
            ? { ...col, requirements: [...col.requirements, movedReq!] }
            : col
        ),
      };
    });

    // Then call API in background (no refetch, socket event handles sync)
    try {
      await api.moveRequirement(requirementId, targetColumnId, position);
    } catch (err) {
      // Revert on failure
      setError(err instanceof Error ? err.message : 'Failed to move requirement');
      refetch();
    }
  }, [refetch]);

  const deleteRequirement = useCallback(async (requirementId: ID) => {
    // Optimistic update
    setBoard(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        columns: prev.columns.map(col => ({
          ...col,
          requirements: col.requirements.filter(r => r.id !== requirementId),
        })),
      };
    });

    try {
      await api.deleteRequirement(requirementId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete requirement');
      refetch(); // Revert on failure
    }
  }, [refetch]);

  const assignRequirement = useCallback(async (requirementId: ID, assigneeId: ID | null) => {
    try {
      const updated = await api.assignRequirement(requirementId, assigneeId);
      setBoard(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          columns: prev.columns.map(col => ({
            ...col,
            requirements: col.requirements.map(r =>
              r.id === requirementId ? { ...r, assignee: updated.assignee } : r
            ),
          })),
        };
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to assign requirement');
    }
  }, []);

  const columns = board?.columns ?? [];

  return {
    board,
    columns,
    loading,
    error,
    createRequirement,
    updateRequirement,
    moveRequirement,
    deleteRequirement,
    assignRequirement,
    refetch,
  };
};