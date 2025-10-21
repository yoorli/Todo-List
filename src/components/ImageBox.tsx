'use client';
/**
 * 이미지 업로드 박스
 * - 파일 선택 → 로컬 미리보기(blob:) → 상위 onPick으로 전달
 * - 최종 저장된 https URL은 next/image로 최적화 렌더
 * - 용량/확장자 제한, 간단한 에러 메시지 제공
 */
import Image from 'next/image';
import { useRef, useState, useEffect } from 'react';

type Props = {
  previewUrl?: string;
  onPick?: (file: File, previewUrl: string) => void;
  onClear?: () => void;
};

const MAX_BYTES = 5 * 1024 * 1024;
const NAME_RE = /^[A-Za-z]+\.(jpg|jpeg|png|webp)$/i;
const ACCEPT = 'image/jpeg,image/png,image/webp';

export default function ImageBox({ previewUrl = '', onPick, onClear }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [localPreview, setLocalPreview] = useState<string>(previewUrl);
  const [err, setErr] = useState<string>('');

  // 외부에서 전달된 previewUrl 변경 반영
  useEffect(() => {
    setLocalPreview(previewUrl);
  }, [previewUrl]);

  // blob: URL 정리
  useEffect(
    () => () => {
      if (localPreview?.startsWith('blob:')) URL.revokeObjectURL(localPreview);
    },
    [localPreview]
  );

  const openPicker = () => inputRef.current?.click();

  // 파일 선택 처리
  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setErr('');
    const file = e.target.files?.[0];
    if (!file) return;

    if (!NAME_RE.test(file.name)) {
      setErr('영문 파일명 + jpg/jpeg/png/webp');
      e.target.value = '';
      return;
    }
    if (file.size > MAX_BYTES) {
      setErr('5MB 이하여야 합니다.');
      e.target.value = '';
      return;
    }

    if (localPreview?.startsWith('blob:')) URL.revokeObjectURL(localPreview);
    const blobUrl = URL.createObjectURL(file);
    setLocalPreview(blobUrl);
    onPick?.(file, blobUrl);
  };

  const buttonIcon = localPreview ? '/btnImgEdit.svg' : '/btnImgAdd.svg';
  const isBlob = localPreview?.startsWith('blob:');

  return (
    <div
      className="relative w-full h-[311px] border-2 border-slate-300 border-dashed rounded-2xl
                   bg-slate-50 bg-[url('/img.svg')] bg-center bg-no-repeat overflow-hidden
                    lg:max-w-[384px]"
    >
      {localPreview &&
        (isBlob ? (
          <img
            src={localPreview}
            alt="preview"
            className="object-cover w-full h-full"
          />
        ) : (
          <Image
            src={localPreview}
            alt="preview"
            fill
            className="object-cover"
            sizes="384px"
          />
        ))}

      {err && (
        <p className="absolute left-4 bottom-4 text-xs text-rose-500 bg-white/80 px-2 py-1 rounded">
          {err}
        </p>
      )}

      <button
        type="button"
        className="absolute bottom-4 right-4 cursor-pointer"
        onClick={openPicker}
        aria-label={localPreview ? '이미지 변경' : '이미지 추가'}
        title={localPreview ? '이미지 변경' : '이미지 추가'}
      >
        <Image src={buttonIcon} alt="pick" width={64} height={64} priority />
      </button>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        onChange={handleChange}
        className="hidden"
      />
    </div>
  );
}
