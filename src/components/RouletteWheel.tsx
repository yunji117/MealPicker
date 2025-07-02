// src/components/RouletteWheel.tsx
import type { WheelData } from "./types";

interface RouletteProps {
  data: WheelData[];
  mustStartSpinning: boolean;
  prizeNumber: number;
  onStopSpinning: () => void;
}

// react-custom-roulette 사용한 부분
import { Wheel } from "react-custom-roulette";

export default function RouletteWheel({
  data,
  mustStartSpinning,
  prizeNumber,
  onStopSpinning,
}: RouletteProps) {
  return (
    <div className="mx-auto transition-transform duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]">
      <div className="rotate-[180deg]">
        <Wheel
          mustStartSpinning={mustStartSpinning}
          prizeNumber={prizeNumber}
          data={data as unknown as object[]}
          outerBorderColor="#000"
          outerBorderWidth={2}
          innerBorderColor="#000"
          innerBorderWidth={1}
          radiusLineColor="#ffffff"
          radiusLineWidth={1}
          textColors={["#000000", "#ffffff"]}
          fontSize={14}
          // 텍스트 세로 정렬
          perpendicularText={false}
          onStopSpinning={onStopSpinning}
        />
      </div>
    </div>
  );
}
