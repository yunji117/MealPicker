// src/pages/LunchPage.tsx
import React, { useState, useEffect } from "react";
import type { WheelOption } from "../components/types";
import RouletteWheel from "../components/RouletteWheel";
import ResultModal from "../components/ResultModal";
import { getRandomColorHex, getContrastColor } from "../utils/color";

export default function LunchPage() {
  /** 기본값 배열 (최초 로드 혹은 리셋 시 사용) */
  const defaultOptions = [
    "쌀국수",
    "짜장면",
    "덮밥",
    "라면",
    "김밥",
    "돈까스",
  ];

  /**state 정의 */
  const [items, setItems] = useState<WheelOption[]>([]);
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [winner, setWinner] = useState("");

  /** 초기값 세팅 (컴포넌트 마운트 시, localStorage 대신 기본값) */
  useEffect(() => {
    resetToDefault();
  }, []);

  /** 기본값(쌀국수, 짜장면 ...) + 랜덤 색상 할당 -> items state에 넣기 */
  function resetToDefault() {
    const arr: WheelOption[] = defaultOptions.map((opt) => {
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
  }

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
    const idx = parseInt(idxStr);
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

  /** 모달 닫기: 단순히 모달만 닫고, items 배열은 그대로 유지 */
  function closeModal() {
    setIsModalOpen(false);
  }

  return (
    <div className="flex flex-col items-center mt-8 space-y-6">
      {/* 룰렛 컴포넌트 */}
      <RouletteWheel
        data={items}
        mustStartSpinning={mustSpin}
        prizeNumber={prizeNumber}
        onStopSpinning={handleStopSpinning}
      />

      {/* 버튼 그룹 */}
      <div className="flex space-x-2">
        <button
          onClick={handleAdd}
          className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-500"
        >
          +
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

      <button
        onClick={handleSpin}
        className="px-6 py-2 bg-fuchsia-500 text-white rounded-lg hover:bg-fuchsia-600"
        disabled={mustSpin} // 이미 돌리고 있다면 중복 방지
      >
        돌리기
      </button>

      <button
        onClick={resetToDefault}
        className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
      >
        리셋
      </button>

      {/* 당첨 모달 */}
      <ResultModal isOpen={isModalOpen} onClose={closeModal} winner={winner} />
    </div>
  );
}
