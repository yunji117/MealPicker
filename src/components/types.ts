// src/components/types.ts
import type { CSSProperties } from "react";

export interface WheelData {
  /** 슬롯(칸)에 표시될 텍스트 */
  option: string;
  /** (선택) 슬롯 배경/글자 색상을 지정할 때 쓰는 CSS 스타일 */
  style?: CSSProperties;
}
