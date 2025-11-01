import React, { useCallback, useEffect, useState } from "react";
import { MagnifyingGlassIcon, XMarkIcon, TrashIcon } from "@heroicons/react/24/outline";

type PlaceCreateModalProps = {
  onClose: () => void;
};

declare global {
  interface Window {
    daum?: any;
  }
}

const PlaceCreateModal: React.FC<PlaceCreateModalProps> = ({ onClose }) => {
  const [searchValue, setSearchValue] = useState("");
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);

  // Daum 주소 검색 스크립트 로드
  useEffect(() => {
    if (window.daum && window.daum.Postcode) {
      setIsScriptLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
    script.async = true;
    script.onload = () => setIsScriptLoaded(true);
    document.body.appendChild(script);
  }, []);

  // 주소 팝업 열기
  const handleOpenPostcode = useCallback(() => {
    if (!isScriptLoaded || !window.daum || !window.daum.Postcode) {
      alert("주소 검색 스크립트가 아직 로드 중입니다. 잠시 후 다시 시도해주세요.");
      return;
    }

    new window.daum.Postcode({
      oncomplete: (data: any) => {
        setSearchValue(data.address);
      },
    }).open();
  }, [isScriptLoaded]);

  // 이미지 추가
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    setUploadedImages((prev) => [...prev, ...files]);
  };

  // 이미지 삭제
  const handleRemoveImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40">
      <div className="relative bg-white w-[460px] rounded-2xl shadow-lg border border-gray-100 max-h-[90vh] flex flex-col overflow-hidden">
        {/* 닫기 버튼 */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/80 hover:bg-gray-100 text-gray-500 hover:text-gray-700 shadow-sm"
        >
          <XMarkIcon className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="px-6 pt-6 pb-3 text-center flex-shrink-0">
          <h2 className="text-xl font-semibold text-gray-900">새 장소 추가</h2>
          <p className="text-sm text-gray-500 mt-1">당신이 아는 곳들을 공유해보세요</p>
        </div>

        {/* Content */}
        <div className="px-6 pb-4 space-y-5 overflow-y-auto flex-1">
          {/* 장소 검색 */}
          <div>
            <label className="flex items-center gap-1 text-sm font-semibold text-gray-900">
              <span className="text-red-500">*</span>
              <span>장소 검색</span>
            </label>
            <div className="mt-2 relative">
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onClick={handleOpenPostcode}
                placeholder="ex) 장소 이름 또는 주소"
                className="w-full border border-gray-300 rounded-lg py-2.5 pl-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={handleOpenPostcode}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                <MagnifyingGlassIcon className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* 장소 설명 */}
          <div>
            <label className="text-sm font-semibold text-gray-900">장소 설명</label>
            <textarea
              rows={3}
              maxLength={50}
              placeholder="ex) 분위기 좋은 카페, 조용한 공원"
              className="mt-2 w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="text-right text-xs text-gray-400 mt-1">0/50</div>
          </div>

          {/* 장소 관련 태그 */}
          <div>
            <label className="text-sm font-semibold text-gray-900">장소 관련 태그</label>
            <input
              type="text"
              placeholder="ex) #카페, #공부, #힐링"
              className="mt-2 w-full border border-gray-300 rounded-lg py-2.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <hr className="border-gray-200" />

          {/* 이미지 업로드 */}
          <div>
            <p className="text-sm font-semibold text-gray-900 mb-2">장소 이미지</p>
            <div className="flex gap-3">
              {/* 업로드 버튼 */}
              <label className="w-[88px] h-[88px] border border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-xs text-gray-500 cursor-pointer hover:border-blue-400 hover:text-blue-500 transition">
                <span className="text-2xl leading-none mb-1">＋</span>
                이미지 추가
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>

              {/* 업로드된 이미지 목록 */}
              <div className="flex-1 h-[200px] overflow-y-scroll space-y-2 pr-1 border border-gray-100 rounded-md p-2 bg-gray-50">
                {uploadedImages.length === 0 ? (
                  <p className="text-xs text-gray-400 text-center mt-8">
                    업로드된 이미지가 없습니다.
                  </p>
                ) : (
                  uploadedImages.map((file, idx) => (
                    <div
                      key={idx}
                      className="border border-gray-200 rounded-md px-3 py-2 flex items-center gap-3 bg-white"
                    >
                      <img
                        src={URL.createObjectURL(file)}
                        alt="preview"
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-800 truncate">{file.name}</p>
                        <p className="text-[10px] text-gray-400">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <button
                        onClick={() => handleRemoveImage(idx)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 버튼 영역 (하단 고정) */}
        <div className="flex gap-3 p-4 border-t border-gray-100 bg-white flex-shrink-0">
          <button className="flex-1 bg-[#0C8CE9] text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-700 transition">
            생성
          </button>
          <button
            onClick={onClose}
            className="flex-1 border border-gray-400 text-gray-800 py-2.5 rounded-lg text-sm font-semibold bg-white hover:bg-gray-50 transition"
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlaceCreateModal;
