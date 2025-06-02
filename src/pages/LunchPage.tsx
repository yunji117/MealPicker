// src/pages/LunchPage.tsx

import { useState, useEffect, useCallback } from "react";
import type { WheelData } from "../components/types";
import RouletteWheel from "../components/RouletteWheel";
import ResultModal from "../components/ResultModal";
import { getRandomColorHex, getContrastColor } from "../utils/color";

/** 
 * 컴포넌트 바깥으로 defaultOptions를 꺼내면, 
 * resetToDefault의 useCallback 의존성(= defaultOptions)도 빈 배열로 처리할 수 있습니다.
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
  }, []); // defaultOptions가 바뀌지 않으므로 빈 배열

  /** 
   * 컴포넌트가 마운트될 때(처음 렌더될 때) 한 번만 resetToDefault 실행 
   * resetToDefault가 useCallback으로 묶여 있기 때문에, 의존성에 넣어도 변화가 일어나지 않는다. 
   */
  useEffect(() => {
    resetToDefault();
  }, [resetToDefault]);

  /** + 버튼: 새 메뉴를 입력받아 items에 추가 */
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

  /** 선택 - 버튼: 삭제할 인덱스를 입력받아서 items에서 제거 */
  function handleRemoveByIndex() {
    if (items.length === 0) return;
    const idxStr = prompt(`삭제할 인덱스를 입력하세요 (0~${items.length - 1})`);
    if (idxStr === null) return;

    const idx = parseInt(idxStr, 10);
    if (isNaN(idx) || idx < 0 || idx >= items.length) {
      alert("유효하지 않은 인덱스입니다.");
      return;
    }
    setItems((prev) => prev.filter((_, i) => i !== idx));
  }

  /** 랜덤 - 버튼: items 중 랜덤 하나를 삭제 */
  function handleRandomRemove() {
    if (items.length === 0) return;
    const idx = Math.floor(Math.random() * items.length);
    setItems((prev) => prev.filter((_, i) => i !== idx));
  }

  /** 돌리기 버튼: 무작위 index를 세팅하고 mustSpin=true로 바꿈 */
  function handleSpin() {
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
    <div className="flex flex-col items-center mt-8 space-y-6">
      
      {/* 룰렛 컴포넌트 */}
      {items.length > 0 && items.every(item => item.option) && (
        <RouletteWheel
          data={items}
          mustStartSpinning={mustSpin}
          prizeNumber={prizeNumber}
          onStopSpinning={handleStopSpinning}
        />
      )}

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
          className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-500"
        >
          선택 -
        </button>
        <button
          onClick={handleRandomRemove}
          className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-500"
        >
          랜덤 -
        </button>
      </div>

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
