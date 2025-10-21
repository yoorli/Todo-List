// ToDo API – 과제 스펙에 맞춘 엔드포인트 래퍼
// 역할: 동일 출처(/api) 경로로 외부 ToDo API를 프록시 호출한다.
// 주의: axios 인스턴스의 baseURL이 '/api'인 경우, 아래 base에 '/api'를 다시 붙이면 중복된다.
//       (예: '/api' + '/api/oknu/items') 현재 코드는 base에 '/api'를 포함한다는 가정 하에 작성됨.

import { ItemEntity } from '@/types/todo';
import axios from './axios';

// tenant 경로 헬퍼
const TENANT_ID = process.env.NEXT_PUBLIC_TODO_TENANT_ID ?? 'oknu';

// 이 모듈에서 사용하는 공통 베이스 경로
// 예: /api/oknu/items
const base = `/api/${TENANT_ID}/items`;

/** 목록 조회: GET /api/:tenant/items */
export async function listItems(): Promise<ItemEntity[]> {
  const { data } = await axios.get<ItemEntity[]>(`${base}`);
  return data;
}

/** 단건 조회: GET /api/:tenant/items/:id */
export async function getItem(itemId: string): Promise<ItemEntity> {
  const { data } = await axios.get<ItemEntity>(`${base}/${itemId}`);
  return data;
}

/** 생성: POST /api/:tenant/items  body: { name } */
export async function createItemApi(payload: {
  name: string;
}): Promise<ItemEntity> {
  const { data } = await axios.post<ItemEntity>(base, payload);
  console.log(data);
  return data;
}

/** 부분 수정: PATCH /api/:tenant/items/:id
 *  허용 필드: name | isCompleted | imageUrl | memo
 */
export async function updateItem(
  itemId: string,
  patch: Partial<Pick<ItemEntity, 'name' | 'isCompleted' | 'imageUrl' | 'memo'>>
): Promise<ItemEntity> {
  const { data } = await axios.patch<ItemEntity>(`${base}/${itemId}`, patch);
  return data;
}

/** 삭제: DELETE /api/:tenant/items/:id */
export async function deleteItem(itemId: string): Promise<void> {
  await axios.delete(`${base}/${itemId}`);
}
