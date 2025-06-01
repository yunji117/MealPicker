// src/utils/color.ts
/**
 * 브라우저에 표시할 수 있는 밝고 선명한 랜덤 색상을 반환하는 함수
 */

function getRandomColorHex(): string {
  // HSL 색상을 사용해 랜덤 색 생성 (채도 60%, 밝기 70% 고정)
  // HSL은 색상, 채도, 밝기로 구성되며, 여기서 색상은 0~360도 범위
  const hue = Math.floor(Math.random() * 360);
  return `hsl(${hue}deg 60% 70%)`;
}

/**
 * 배경색(16진수 혹은 hsl 문자열 등)을 받아서,
 * 상대적 밝기를 계산하여(0~255) 대비가 좋은 텍스트 색을 반환.
 */
function getContrastColor(bgColor: string): "#000000" | "#ffffff" {
  // 배경색이 hsl 문자열인 경우 막대기로 무시하고 검정 텍스트 반환
  // (실제 UX 관점에선 더 정밀한 계산 필요)
  if (bgColor.startsWith("hsl")) {
    // 밝기를 HSL에서 반환: “hsl(hue sat% light%)” 에서 light%만 추출
    const lightMatch = bgColor.match(/(\d+)%\)$/);
    if (lightMatch) {
      const lightness = parseInt(lightMatch[1], 10);
      return lightness > 50 ? "#000000" : "#ffffff";
    }
    return "#000000";
  }
  // 16진수 형태이면 RGB로 변환
  if (bgColor.startsWith("#")) {
    const hex = bgColor.slice(1);
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 125 ? "#000000" : "#ffffff";
  }
  // 기본값
  return "#000000";
}

export { getRandomColorHex, getContrastColor };
