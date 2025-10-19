export type Status = 'todo' | 'done';

export interface ItemEntity {
  id: number;
  name: string;
  isCompleted: boolean;
  imageUrl?: string;    
  memo?: string;      
  tenantId?: string;      
}

