// ToDo API – 과제 스펙에 맞춘 엔드포인트 래퍼
import { ItemEntity } from '@/types/todo';
import axios from './axios';

// tenant 경로 헬퍼
const TENANT_ID = process.env.NEXT_PUBLIC_TODO_TENANT_ID ?? 'oknu';
const base = `/api/${TENANT_ID}/items`;

// 목록 조회

export async function listItems(): Promise<ItemEntity[]> {
  const { data } = await axios.get<ItemEntity[]>(`${base}`);
  return data;
}

// 단건 조회
export async function getItem(itemId: string): Promise<ItemEntity> {
  const { data } = await axios.get<ItemEntity>(`${base}/${itemId}`);
  return data;
}

// 생성
export async function createItemApi(payload: {
  name: string;
}): Promise<ItemEntity> {
  const { data } = await axios.post<ItemEntity>(base, payload);
  console.log(data);
  return data;
}

// 부분 수정
export async function updateItem(
  itemId: string,
  patch: Partial<Pick<ItemEntity, 'name' | 'isCompleted' | 'imageUrl' | 'memo'>>
): Promise<ItemEntity> {
  const { data } = await axios.patch<ItemEntity>(`${base}/${itemId}`, patch);
  return data;
}

// 삭제
export async function deleteItem(itemId: string): Promise<void> {
  await axios.delete(`${base}/${itemId}`);
}
