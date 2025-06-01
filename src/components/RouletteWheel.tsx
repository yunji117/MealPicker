// src/components/RouletteWheel.tsx
import React from "react";
import { Wheel } from "react-custom-roulette";
// import type { WheelOption } from "./types";
import type { WheelData } from "react-custom-roulette/dist/components/Wheel/types";

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
    <div className="mx-auto">
      <Wheel
        mustStartSpinning={mustStartSpinning}
        prizeNumber={prizeNumber}
        data={data}
        outerBorderColor="#000"
        outerBorderWidth={2}
        innerBorderColor="#000"
        innerBorderWidth={2}
        radiusLineColor="#ffffff"
        radiusLineWidth={1}
        textColors={["#000000", "#ffffff"]} 
        fontSize={14}
        perpendicularText={true}
        onStopSpinning={onStopSpinning}
      />
    </div>
  );
}
