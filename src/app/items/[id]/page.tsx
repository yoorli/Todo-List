'use client';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';

import { deleteItem, getItem, updateItem } from '@/app/api/api';
import AutoTextarea from '@/components/AutoTextarea';
import CheckListDetail from '@/components/CheckListDetail';
import ImageBox from '@/components/ImageBox';
import type { ItemEntity } from '@/types/todo';
import Image from 'next/image';

type ItemDetail = {
  id: string;
  name: string;
  isCompleted: boolean;
  memo?: string;
  imageUrl?: string;
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

  const isDirty = useMemo(() => {
    if (!serverItem) return false;
    return (
      serverItem.name !== itemTitle ||
      serverItem.isCompleted !== isCompleted ||
      (serverItem.memo ?? '') !== memoText ||
      !!selectedFile
    );
  }, [serverItem, itemTitle, isCompleted, memoText, selectedFile]);

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

  // 이미지 제거 추후 추가 예정
  // const deleteFromServer = async (url: string) => {
  //   await fetch(`/api/upload?url=${encodeURIComponent(url)}`, {
  //     method: 'DELETE',
  //   });
  // };

  const handleDelete = async () => {
    try {
      if (!id) return;
      await deleteItem(String(id));
      window.location.href = '/';
    } catch (e) {
      console.error('delete failed', e);
    }
  };

  const editBtnSrc = isDirty ? ' bg-lime-300' : ' bg-slate-200';

  return (
    <main className="mx-auto w-full h-full min-w-[343px] flex justify-center">
      <div className="w-full h-[100dvh] bg-white flex flex-col items-center gap-4 pt-4 pb-8 px-4 lg:w-[1200px] lg:px-[102px]">
        <CheckListDetail
          itemTitle={itemTitle}
          isCompleted={isCompleted}
          onToggle={setIsCompleted}
          onTitleChange={setItemTitle}
        />

        <div className="flex flex-col gap-[15px] w-full lg:flex-row ">
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

          <div className="relative w-full h-[311px] py-3 rounded-2xl bg-[url('/memo.svg')] bg-size[100%_100%] bg-center flex flex-col items-center">
            <div className="absolute top-6 text-amber-800 font-extrabold h-[18px] text-center">
              Memo
            </div>
            <div className="w-full h-full mt-[58px] px-4 grid place-items-center overflow-hidden">
              <AutoTextarea
                placeholder={'메모를 작성해 보세요!\n사진도 첨부할 수 있어요!'}
                rows={3}
                className="max-h-full text-slate-800"
                value={memoText}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setMemoText(e.target.value)
                }
              />
            </div>
          </div>
        </div>

        <div className="mt-2 flex justify-center gap-[7px] w-[344px] h-[56px] lg:w-full lg:justify-end">
          <button
            type="button"
            aria-label="수정 완료"
            onClick={handleEdit}
            disabled={!isDirty}
            aria-disabled={!isDirty}
            className={`w-[168px] h-[full] cursor-pointer border-2 border-slate-900 border-b-[6px] rounded-full 
                    text-slate-900 font-bold flex items-center justify-center
                    disabled:cursor-not-allowed ${editBtnSrc}`}
          >
            <Image
              src="/ic_check.svg"
              alt="edit"
              width={24}
              height={24}
              className="inline-block mr-2"
            />
            <>수정 완료</>
          </button>
          <button
            className="w-[168px] h-full cursor-pointer border-2 border-slate-900 border-b-[6px] bg-rose-500 rounded-full
                    text-white font-bold flex items-center justify-center"
            onClick={handleDelete}
            aria-label="삭제"
          >
            <Image
              src="/ic_X.svg"
              alt="edit"
              width={24}
              height={24}
              className="inline-block mr-2"
            />
            <>삭제하기</>
          </button>
        </div>
      </div>
    </main>
  );
}
