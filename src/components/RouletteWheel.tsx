// src/components/RouletteWheel.tsx
import { Wheel } from "react-custom-roulette";
import type { WheelData } from "./types";

interface RouletteProps {
  data: WheelData[];
  mustStartSpinning: boolean;
  prizeNumber: number;
  onStopSpinning: () => void;
}

export default function RouletteWheel({
  data,
  mustStartSpinning,
  prizeNumber,
  onStopSpinning,
}: RouletteProps) {
  return (
    <div className="mx-auto" style={{ transition: "transform 0.7s cubic-bezier(0.4,0,0.2,1)" }}>
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
          perpendicularText={false}
          onStopSpinning={onStopSpinning}
        />
      </div>
    </div>
  );
}
