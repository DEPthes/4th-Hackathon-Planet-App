import { ImageSourcePropType } from "react-native";

// 티어 이미지 매핑 객체
export const TIER_IMAGES: Record<number, ImageSourcePropType> = {
  1: require("@/assets/images/tier/1.png"),
  2: require("@/assets/images/tier/2.png"),
  3: require("@/assets/images/tier/3.png"),
  4: require("@/assets/images/tier/4.png"),
  5: require("@/assets/images/tier/5.png"),
  // 필요한 만큼 추가
};

// 티어 별똥별 매핑 객체
export const TIER_STAR_IMAGES: Record<number, ImageSourcePropType> = {
  2: require("@/assets/images/tier/22.png"),
  3: require("@/assets/images/tier/33.png"),
  4: require("@/assets/images/tier/44.png"),
  5: require("@/assets/images/tier/55.png"),
  // 필요한 만큼 추가
};

// 티어 번호에 따른 이미지 반환 함수
export function getTierImage(tierNumber: number): ImageSourcePropType {
  return TIER_IMAGES[tierNumber] || TIER_IMAGES[1];
}

export function getTierStarImage(tierNumber: number): ImageSourcePropType {
  return TIER_STAR_IMAGES[tierNumber] || TIER_STAR_IMAGES[1];
}

// 티어 이름에서 번호 추출 함수 (필요한 경우)
export function getTierNumber(tier: string): number {
  switch (tier) {
    case "TinyStar":
      return 1;
    case "ShinyStar":
      return 2;
    case "WaveStar":
      return 3;
    case "PlanetStar":
      return 4;
    case "HappyGalaxy":
      return 5;
    default:
      return 1;
  }
}
