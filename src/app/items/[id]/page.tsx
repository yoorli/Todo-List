'use client';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';

import { deleteItem, getItem, updateItem } from '@/libs/api';
import AutoTextarea from '@/components/AutoTextarea';
import CheckListDetail from '@/components/CheckListDetail';
import ImageBox from '@/components/ImageBox';
import type { ItemEntity } from '@/types/todo';

type ItemDetail = {
  id: string;
  name: string;
  isCompleted: boolean;
  memo?: string;
  imageUrl?: string;
};

type Props = {
  previewUrl?: string;
  onPick?: (file: File, previewUrl: string) => void;
  onClear?: () => void;
};

export default function Page() {
  const { id } = useParams<{ id?: string }>();

  const [serverItem, setServerItem] = useState<ItemDetail | null>(null);

  const [isCompleted, setIsCompleted] = useState(false);
  const [itemTitle, setItemTitle] = useState('');
  const [memoText, setMemoText] = useState('');
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>(''); // 미리보기 전용(Blob URL 또는 원본)
  const [selectedFile, setSelectedFile] = useState<File | null>(null); // **저장 시 업로드**

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const data = (await getItem(id)) as unknown as ItemDetail;
        setServerItem(data);
        setItemTitle(data.name);
        setIsCompleted(data.isCompleted);
        setMemoText(data.memo ?? '');
        setImagePreviewUrl(data.imageUrl ?? '');
      } catch (e) {
        console.error(e);
      }
    })();
  }, [id]);

  useEffect(() => {
    console.log('isCompleted changed:', isCompleted);
  }, [isCompleted]);

  const isDirty = useMemo(() => {
    if (!serverItem) return false;
    return (
      serverItem.name !== itemTitle ||
      serverItem.isCompleted !== isCompleted ||
      (serverItem.memo ?? '') !== memoText ||
      !!selectedFile 
    );
  }, [serverItem, itemTitle, isCompleted, memoText, selectedFile]);

  const editBtnSrc = isDirty ? '/btnEdit.svg' : '/btnEditWhite.svg';

  const uploadToServer = async (file: File) => {
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch('/api/upload', { method: 'POST', body: fd });
    if (!res.ok) throw new Error('upload failed');
    const { url } = await res.json();
    return url as string;
  };

  type Patch = Partial<
    Pick<ItemEntity, 'name' | 'isCompleted' | 'imageUrl' | 'memo'>
  >;

  const handleEdit = async () => {
    if (!id) return;
    try {
      // 1) 이미지 파일이 있으면 업로드
      let finalImageUrl = serverItem?.imageUrl ?? '';
      if (selectedFile) {
        finalImageUrl = await uploadToServer(selectedFile);
      }

      const patch: Patch = {
        isCompleted,
        name: itemTitle,
        memo: memoText,
        imageUrl: finalImageUrl,
      };

      // 2) 서버 패치(백엔드 스키마에 맞춰 선택적으로 필드 포함)
      await updateItem(String(id), patch);

      // 3) 서버 원본 동기화 및 더티 플래그 리셋
      setServerItem((prev) =>
        prev
          ? {
              ...prev,
              name: itemTitle,
              isCompleted,
              memo: memoText,
              imageUrl: finalImageUrl,
            }
          : null
      );
      if (selectedFile) setSelectedFile(null);
      window.location.href = '/';
    } catch (e) {
      console.error('update failed', e);
    }
  };

  const handleDelete = async () => {
    try {
      if (!id) return;
      await deleteItem(String(id));
      window.location.href = '/';
    } catch (e) {
      console.error('delete failed', e);
    }
  };

  return (
    <main className="w-full flex justify-center overflow-hidden">
      <div className="max-w-[1200px] w-full h-[calc(100dvh-60px)] bg-white flex flex-col items-center gap-6 pt-6">
        <CheckListDetail
          itemTitle={itemTitle}
          isCompleted={isCompleted}
          onToggle={setIsCompleted}
          onTitleChange={setItemTitle}
        />

        <div className="flex items-center justify-between gap-6 w-full max-w-[996px]">
          <ImageBox
            previewUrl={imagePreviewUrl}
            onPick={(file, preview) => {
              setSelectedFile(file);
              setImagePreviewUrl(preview);
            }}
            onClear={() => {
              setSelectedFile(null);
              setImagePreviewUrl('');
            }}
          />

          <div className="relative w-full max-w-[588px] h-[311px] py-3 rounded-2xl bg-[url('/memo.svg')] flex flex-col items-center justify-center">
            <p className="absolute top-[18px] text-amber-800 font-extrabold">
              Memo
            </p>
            <div className="w-full h-full mt-[58px] px-6 grid place-items-center overflow-hidden">
              <AutoTextarea
                placeholder={'메모를 작성해 보세요!\n사진도 첨부할 수 있어요!'}
                rows={3}
                className="max-h-full w-full"
                value={memoText}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setMemoText(e.target.value)
                }
              />
            </div>
          </div>
        </div>

        <div className="flex gap-4 justify-end w-full max-w-[996px]">
          <button
  type="button"
  aria-label="수정 완료"
  onClick={handleEdit}
  disabled={!isDirty}
  aria-disabled={!isDirty}
  className="w-[168px] h-[56px] cursor-pointer disabled:opacity-50"
  style={{ backgroundImage: `url(${editBtnSrc})`, backgroundSize: 'cover' }}
/>
          <button
            className="w-[168px] h-[56px] bg-[url('/btnDelete.svg')] cursor-pointer"
            onClick={handleDelete}
          />
        </div>
      </div>
    </main>
  );
}
