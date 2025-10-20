// **파일 이동 + 파일명 정정(uploasd → upload/route.ts)**
import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export const runtime = 'nodejs';

const MAX_BYTES = 5 * 1024 * 1024;
const NAME_RE = /^[A-Za-z]+\.(jpg|jpeg|png|webp)$/i;

export async function POST(req: Request) {
  // 선택: multipart 체크(없어도 formData()는 동작)
  const ct = req.headers.get('content-type') || '';
  if (!ct.toLowerCase().includes('multipart/form-data')) {
    return NextResponse.json({ error: 'unsupported content-type' }, { status: 415 });
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

  const bytes = Buffer.from(await file.arrayBuffer());
  const ext = path.extname(file.name).toLowerCase();
  const basename = path.basename(file.name, ext);
  const safeName = `${basename}-${Date.now()}${ext}`;

  const dir = path.join(process.cwd(), 'public', 'uploads');
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, safeName), bytes);

  return NextResponse.json({ url: `/uploads/${safeName}` });
}
