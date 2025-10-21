import { NextResponse } from 'next/server';
import { put, del } from '@vercel/blob';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

const MAX_BYTES = 5 * 1024 * 1024;
const NAME_RE = /^[A-Za-z]+\.(jpg|jpeg|png|webp)$/i;
const ACCEPT = new Set(['image/jpeg', 'image/png', 'image/webp']);

export async function POST(req: Request) {
  const ct = req.headers.get('content-type') || '';
  if (!ct.toLowerCase().includes('multipart/form-data')) {
    return NextResponse.json(
      { error: 'unsupported content-type' },
      { status: 415 }
    );
  }

  const form = await req.formData();
  const file = form.get('file') as File | null;
  if (!file) return NextResponse.json({ error: 'no file' }, { status: 400 });

  if (!NAME_RE.test(file.name)) {
    return NextResponse.json({ error: 'invalid filename' }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: 'too large' }, { status: 400 });
  }

  const token = process.env.BLOB_READ_WRITE_TOKEN!;
  const key = `todo/${Date.now()}-${file.name}`;
  const { url } = await put(key, file, { access: 'public', token });

  return NextResponse.json({ url }, { status: 200 });
}

// 코드 미연결
export async function DELETE(req: Request) {
  const url = new URL(req.url).searchParams.get('url');
  if (!url) return NextResponse.json({ error: 'no url' }, { status: 400 });

  const token = process.env.BLOB_READ_WRITE_TOKEN!;
  await del(url, { token });
  return NextResponse.json({ ok: true }, { status: 200 });
}
