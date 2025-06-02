// src/pages/DinnerPage.tsx
import { useState, useEffect, useCallback } from "react";
import type { WheelData } from "../components/types";
import RouletteWheel from "../components/RouletteWheel";
import ResultModal from "../components/ResultModal";
import { getRandomColorHex, getContrastColor } from "../utils/color";

export default function DinnerPage() {

  const [items, setItems] = useState<WheelData[]>([]);
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [winner, setWinner] = useState("");

  const resetToDefault = useCallback(() => {
          const defaultOptions = [
          "파전",
          "김치찌개",
          "샤브샤브",
          "곱창",
          "족발",
          "치킨",
          "피자",
          "닭발",
          "낙곱새",
          "육회",
          "회",
        ];
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

  function handleAdd() {
    const newMenu = prompt("추가할 메뉴를 입력하세요")?.trim();
    if (!newMenu) return;
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

  function handleRandomRemove() {
    if (items.length === 0) return;
    const idx = Math.floor(Math.random() * items.length);
    setItems((prev) => prev.filter((_, i) => i !== idx));
  }

  function handleSpin() {
    if (items.length === 0) {
      alert("먼저 메뉴를 추가하거나 기본값을 유지하세요.");
      return;
    }
    const randIdx = Math.floor(Math.random() * items.length);
    setPrizeNumber(randIdx);
    setMustSpin(true);
  }

  function handleStopSpinning() {
    const selected = items[prizeNumber]?.option || "";
    setWinner(selected);
    setIsModalOpen(true);
    setMustSpin(false);
  }

  function closeModal() {
    setIsModalOpen(false);
  }

  return (
    <div className="flex flex-col items-center mt-8 space-y-6">
      {items.length > 0 && items.every(item => item.option) && (
        <RouletteWheel
          data={items}
          mustStartSpinning={mustSpin}
          prizeNumber={prizeNumber}
          onStopSpinning={handleStopSpinning}
        />
      )}

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

      <button
        onClick={handleSpin}
        className="px-6 py-2 bg-fuchsia-500 text-white rounded-lg hover:bg-fuchsia-600"
        disabled={mustSpin}
      >
        돌리기
      </button>

      <button
        onClick={resetToDefault}
        className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
      >
        리셋
      </button>

      <ResultModal isOpen={isModalOpen} onClose={closeModal} winner={winner} />
    </div>
  );
}
