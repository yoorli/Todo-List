import { ItemEntity, UiLists } from '@/types/todo';

/** API 엔티티 형태의 목업 데이터 */
export const MOCK_ITEMS: ItemEntity[] = [
  // TO DO
  {
    id: 'it_001',
    title: '비타민 챙겨 먹기',
    status: 'todo',
    order: 1,
    createdAt: '2025-10-17T02:00:00.000Z',
    updatedAt: '2025-10-17T02:00:00.000Z',
  },
  {
    id: 'it_002',
    title: '맥주 마시기',
    status: 'todo',
    order: 2,
    createdAt: '2025-10-17T02:05:00.000Z',
    updatedAt: '2025-10-17T02:05:00.000Z',
  },
  {
    id: 'it_003',
    title: '운동하기',
    status: 'todo',
    order: 3,
    createdAt: '2025-10-17T02:10:00.000Z',
    updatedAt: '2025-10-17T02:10:00.000Z',
  },

  // DONE
  {
    id: 'it_101',
    title: '은행 다녀오기',
    status: 'done',
    order: 1,
    createdAt: '2025-10-17T01:00:00.000Z',
    updatedAt: '2025-10-17T02:20:00.000Z',
  },
  {
    id: 'it_102',
    title: '비타민 챙겨 먹기',
    status: 'done',
    order: 2,
    createdAt: '2025-10-17T00:30:00.000Z',
    updatedAt: '2025-10-17T02:25:00.000Z',
  },
];

/** UI에서 바로 쓰기 위한 가공 함수 */
export function toUiLists(items: ItemEntity[]): UiLists {
  const todo = items
    .filter(i => i.status === 'todo')
    .sort((a, b) => a.order - b.order);
  const done = items
    .filter(i => i.status === 'done')
    .sort((a, b) => a.order - b.order);
  return { todo, done, total: items.length };
}

export const MOCK_UI = toUiLists(MOCK_ITEMS);
