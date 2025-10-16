export type Status = 'todo' | 'done';

export interface ItemEntity {
  id: string;
  title: string;
  status: Status;
  order: number;           // 동일 status 내 표시 순서
  createdAt: string;       // ISO
  updatedAt: string;       // ISO
}

export interface UiLists {
  todo: ItemEntity[];
  done: ItemEntity[];
  total: number;
}
