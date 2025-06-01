// src/components/types.ts

/**
 * 돌림판(룰렛)의 각 슬롯(item)을 정의하는 타입
 * - option: 칸에 표시될 메뉴 이름(문자열)
 * - style?: React.CSSProperties  ->  슬롯 배경색, 텍스트색 등을 지정하기
 */
export interface WheelOption {
  option: string;
  style?: React.CSSProperties;
}
