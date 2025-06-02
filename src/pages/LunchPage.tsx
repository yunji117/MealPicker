// src/pages/LunchPage.tsx

import { useState, useEffect, useCallback } from "react";
import type { WheelData } from "../components/types";
import RouletteWheel from "../components/RouletteWheel";
import ResultModal from "../components/ResultModal";
import { getRandomColorHex, getContrastColor } from "../utils/color";

/** 
 * 컴포넌트 바깥으로 defaultOptions를 꺼내면, 
 * resetToDefault의 useCallback 의존성(= defaultOptions)도 빈 배열로 처리할 수 있다.
 */
const defaultOptions = [
  "쌀국수",
  "짜장면",
  "덮밥",
  "라면",
  "김밥",
  "돈까스",
];

export default function LunchPage() {
  /** state 정의 */
  const [items, setItems] = useState<WheelData[]>([]);
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [winner, setWinner] = useState("");

  /** 선택 버튼 버튼 클릭 시 삭제 가능한 목록을 보일지 여부 */
  const [showDeleteList, setShowDeleteList] = useState(false);

  /** 
   *  resetToDefault 함수를 useCallback으로 감싸면, 
   *  컴포넌트가 렌더될 때마다 함수 레퍼런스가 바뀌지 않으므로 
   *  useEffect 의존성 배열에 넣어도 무한 루프가 발생하지 않는다.
   */
  const resetToDefault = useCallback(() => {
    const arr: WheelData[] = defaultOptions.map((opt) => {
      const bg = getRandomColorHex();
      return {
        option: opt,
        style: {
          backgroundColor: bg,
          color: getContrastColor(bg),
        },
      };
    });
    setItems(arr);
    setShowDeleteList(false); // 리셋하면 삭제 목록(아코디언)도 닫아줍니다.
  }, []); // defaultOptions가 바뀌지 않으므로 빈 배열

  /** 
   * 컴포넌트가 마운트될 때(처음 렌더될 때) 한 번만 resetToDefault 실행 
   * resetToDefault가 useCallback으로 묶여 있기 때문에, 의존성에 넣어도 변화가 일어나지 않는다. 
   */
  useEffect(() => {
    resetToDefault();
  }, [resetToDefault]);

  /** 메뉴 추가 버튼: 새 메뉴를 입력받아 items에 추가 */
  function handleAdd() {
    const newMenu = prompt("추가할 메뉴를 입력하세요")?.trim();
    if (!newMenu) return;

    // 이미 동일한 메뉴가 있으면 경고
    if (items.some((it) => it.option === newMenu)) {
      alert("이미 동일한 메뉴가 존재합니다.");
      return;
    }

    const bg = getRandomColorHex();
    setItems((prev) => [
      ...prev,
      { option: newMenu, style: { backgroundColor: bg, color: getContrastColor(bg) } },
    ]);
  }

  /** 선택 삭제 버튼: showDeleteList 를 토글해서 아래에 목록을 펼치거나 접도록 한다.*/
  function handleRemoveByIndex() {
    setShowDeleteList((prev) => !prev);
  }

  /** 목록에서 개별 항목 삭제하기 */
  function handleDeleteItem(idxToDelete: number) {
    setItems((prev) => prev.filter((_, i) => i !== idxToDelete));
  }

  /** 랜덤 삭제 버튼 -> items 중 랜덤 하나를 삭제 */
  function handleRandomRemove() {
    if (items.length === 0) return;
    const idx = Math.floor(Math.random() * items.length);
    setItems((prev) => prev.filter((_, i) => i !== idx));
    // items가 아예 빈 배열이 돼도, 아래 렌더링 부분에서 placeholder로 대체된다. 
  }

  /** 돌리기 버튼: 무작위 index를 세팅하고 mustSpin=true로 바꿈 */
  function handleSpin() {
    if (mustSpin) return; // 이미 돌리고 있다면 중복 실행 방지
    if (items.length === 0) {
      alert("먼저 메뉴를 추가하거나 기본값을 유지하세요.");
      return;
    }
    const randIdx = Math.floor(Math.random() * items.length);
    setPrizeNumber(randIdx);
    setMustSpin(true);
  }

  /** 룰렛이 멈출 때 호출 */
  function handleStopSpinning() {
    const selected = items[prizeNumber]?.option || "";
    setWinner(selected);
    setIsModalOpen(true);
    setMustSpin(false);
  }

  /** 모달 닫기: 모달만 닫고, items 배열은 그대로 유지 */
  function closeModal() {
    setIsModalOpen(false);
  }

  return (
    <div className="flex flex-col items-center mt-8 space-y-6 px-4">
      {/*
        이제 아래처럼 항상 <RouletteWheel>를 렌더하고,
        data prop에 items가 비어 있으면 placeholder 하나를 넘겨준다.
      */}
      <div onClick={handleSpin} className="cursor-pointer"> 
      <RouletteWheel
        data={
          items.length > 0
            ? items
            : [
                {
                  option: "메뉴를 추가하세요",
                  style: { backgroundColor: "#eeeeee", color: "#888888" },
                },
              ]
        }
        mustStartSpinning={mustSpin}
        prizeNumber={prizeNumber}
        onStopSpinning={handleStopSpinning}
      />
      </div>

      {/* 버튼 그룹 */}
      <div className="flex space-x-2">
        <button
          onClick={handleAdd}
          className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-500"
        >
          메뉴추가
        </button>
        <button
          onClick={handleRemoveByIndex}
          className="flex items-center px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-500"
        >
          선택 삭제
          <span
            className={`ml-1 inline-block transform transition-transform duration-150 ${
              showDeleteList ? "rotate-180" : ""
            }`}
          >
            ▼
          </span>
        </button>
        <button
          onClick={handleRandomRemove}
          className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-500"
        >
          랜덤 삭제
        </button>
      </div>

      {/* '선택 삭제' 버튼을 눌렀을 때 아래에 펼쳐지는 삭제 리스트(아코디언처럼) */}
      {showDeleteList && (
        <div className="w-full max-w-md bg-white shadow-md rounded-lg overflow-hidden transition-all duration-200">
          <h4 className="px-4 py-2 bg-gray-100 border-b">메뉴 삭제하기</h4>
          <ul className="divide-y">
            {items.length > 0 ? (
              items.map((item, idx) => (
                <li key={idx} className="flex items-center justify-between px-4 py-2">
                  <div className="flex items-center space-x-2">
                    {/* 메뉴 이름 */}
                    <span className="text-gray-800">{item.option}</span>
                    {/* 컬러 블록 */}
                    <div
                      className="w-6 h-4 border border-gray-300 rounded"
                      style={{ backgroundColor: item.style?.backgroundColor }}
                    />
                  </div>
                  {/* 삭제 버튼 */}
                  <button
                    onClick={() => handleDeleteItem(idx)}
                    className="px-2 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                  >
                    삭제
                  </button>
                </li>
              ))
            ) : (
              <li className="px-4 py-2 text-gray-500 text-center">
                등록된 메뉴가 없습니다.
              </li>
            )}
          </ul>
        </div>
      )}

      {/* 리셋, 돌리기 버튼 */}
      <div className="flex space-x-2">
        <button
          onClick={resetToDefault}
          className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
        >
          리셋
        </button>
        <button
          onClick={handleSpin}
          className="px-6 py-2 bg-fuchsia-500 text-white rounded-lg hover:bg-fuchsia-600"
          disabled={mustSpin} // 이미 돌리고 있다면 중복 방지
        >
          돌리기
        </button>
      </div>

      {/* 당첨 모달 */}
      <ResultModal isOpen={isModalOpen} onClose={closeModal} winner={winner} />
    </div>
  );
}
