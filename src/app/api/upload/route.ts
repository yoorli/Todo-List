// src/app/api/upload/route.ts

import { NextResponse } from 'next/server';
import { put, del } from '@vercel/blob';

export const runtime = 'edge'; // 엣지 런타임에서 동작(배포 환경 성능/콜드스타트 유리)
export const dynamic = 'force-dynamic'; // 응답 캐시 방지. 매 요청 처리

// 업로드 제한 및 검증 규칙
const MAX_BYTES = 5 * 1024 * 1024;
const NAME_RE = /^[A-Za-z]+\.(jpg|jpeg|png|webp)$/i;
const ACCEPT = new Set(['image/jpeg', 'image/png', 'image/webp']);

/**
 * POST /api/upload
 * - 폼데이터로 전달된 파일을 Vercel Blob에 업로드
 * - 성공 시 공개 URL을 반환
 */
export async function POST(req: Request) {
  // multipart/form-data 여부 확인
  const ct = req.headers.get('content-type') || '';
  if (!ct.toLowerCase().includes('multipart/form-data')) {
    return NextResponse.json(
      { error: 'unsupported content-type' },
      { status: 415 }
    );
  }

  // 파일 추출
  const form = await req.formData();
  const file = form.get('file') as File | null;
  if (!file) return NextResponse.json({ error: 'no file' }, { status: 400 });

  // 파일명/크기/MIME 검증
  if (!NAME_RE.test(file.name)) {
    return NextResponse.json({ error: 'invalid filename' }, { status: 400 });
  }
  if (!ACCEPT.has(file.type)) {
    return NextResponse.json({ error: 'unsupported type' }, { status: 415 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: 'too large' }, { status: 400 });
  }

  // Blob 업로드: public 접근으로 URL 반환
  const token = process.env.BLOB_READ_WRITE_TOKEN!; // Vercel 환경변수
  const key = `todo/${Date.now()}-${file.name}`; // 저장 키 규칙
  const { url } = await put(key, file, { access: 'public', token });

  return NextResponse.json({ url }, { status: 200 });
}

/**
 * DELETE /api/upload?url=...
 * - 주어진 Blob URL을 스토리지에서 삭제
 * - 클라이언트에서 imageUrl 정리 시 함께 호출
 */
export async function DELETE(req: Request) {
  const url = new URL(req.url).searchParams.get('url');
  if (!url) return NextResponse.json({ error: 'no url' }, { status: 400 });

  const token = process.env.BLOB_READ_WRITE_TOKEN!;
  await del(url, { token });
  return NextResponse.json({ ok: true }, { status: 200 });
}
