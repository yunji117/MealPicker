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
  const [menuInput, setMenuInput] = useState("");

  /** '선택 삭제' 버튼 클릭 시 삭제 가능한 목록을 보일지 여부 */
  const [showDeleteList, setShowDeleteList] = useState(false);

  /** 
   * resetToDefault: 마운트 또는 리셋 버튼 클릭 시 기본 메뉴로 세팅
   */
  const resetToDefault = useCallback(() => {
    const defaultOptions = [
      "치킨",
      "피자",
      "샌드위치",
      "돈까스",
      "샐러드",
      "곱창",
      "제육볶음",
      "김치찌개",
      "부대찌개",
      "닭갈비",
      "마라탕",
      "뼈구이",
      "파전",
      "낙곱새",
      "족발",
      "보쌈",
      "국밥",
      "짜글이",
      "김치찜",
      "곱도리탕",
      "삼겹살",
      "두루치기",
      
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
    setShowDeleteList(false); // 리셋하면 아코디언 목록도 닫기
  }, []);

  useEffect(() => {
    resetToDefault();
  }, [resetToDefault]);

  /** 메뉴 추가 */
  function handleAdd() {
    const newMenu = menuInput.trim();
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
    setMenuInput("");
  }

  /** '선택 삭제' 버튼 토글(아코디언) */
  function handleRemoveByIndex() {
    setShowDeleteList((prev) => !prev);
  }

  /** 아코디언 목록 내 개별 항목 삭제 */
  function handleDeleteItem(idxToDelete: number) {
    setItems((prev) => prev.filter((_, i) => i !== idxToDelete));
  }

  /** '랜덤 삭제' 버튼: items 중 랜덤 하나 삭제 */
  function handleRandomRemove() {
    if (items.length === 0) return;
    const idx = Math.floor(Math.random() * items.length);
    setItems((prev) => prev.filter((_, i) => i !== idx));
    // items가 빈 배열이 되어도, 아래 <RouletteWheel>이 placeholder를 보여줍니다.
  }

  /** 돌리기 버튼 */
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

  /** 룰렛 멈출 때 호출 */
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
    <div className="flex flex-col items-center mt-8 space-y-6 px-4">
      {/*
        이제 항상 <RouletteWheel>를 렌더하고,
        빈 배열일 때는 placeholder 하나를 넘겨준다.
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

      {/* 메뉴 추가 입력 */}
      <form
        onSubmit={(event) => {
          event.preventDefault();
          handleAdd();
        }}
        className="flex w-full max-w-md space-x-2"
      >
        <input
          value={menuInput}
          onChange={(event) => setMenuInput(event.target.value)}
          placeholder="추가할 메뉴 입력"
          className="flex-1 rounded border border-gray-300 px-3 py-2 text-sm"
        />
        <button
          type="submit"
          className="px-3 py-2 bg-gray-600 text-white rounded hover:bg-gray-500"
        >
          추가
        </button>
      </form>

      {/* 버튼 그룹 */}
      <div className="flex space-x-2">
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

      {/* '선택 삭제' 버튼을 눌렀을 때 펼쳐지는 삭제 목록(아코디언) */}
      {showDeleteList && (
        <div className="w-full max-w-md bg-white shadow-md rounded-lg overflow-hidden transition-all duration-200">
          <h4 className="px-4 py-2 bg-gray-100 border-b">메뉴 삭제하기</h4>
          <ul className="divide-y">
            {items.length > 0 ? (
              items.map((item, idx) => (
                <li key={idx} className="flex items-center justify-between px-4 py-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-800">{item.option}</span>
                    <div
                      className="w-6 h-4 border border-gray-300 rounded"
                      style={{ backgroundColor: item.style?.backgroundColor }}
                    />
                  </div>
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
