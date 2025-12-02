// 단위 변환 유틸리티 import
import {
  mmToPxRounded,
  pxToGridW,
  pxToGridH,
  convertSizeToPx,
  convertSizeToGrid,
  GRID_ROW_HEIGHT,
} from '../utils/unitConverter';

// 판 크기 설정 (mm 단위)
export const PLATE_WIDTH_MM = 315;
export const PLATE_HEIGHT_MM = 230;

// 그리드 설정
export const GRID_COLS = mmToPxRounded(PLATE_WIDTH_MM);
export { GRID_ROW_HEIGHT };

// 컨텐츠 크기 정의
// 표시값: 이름에 표시될 크기
// 실제 크기: 실제로 적용될 크기
const printSizesBase = {
  businessCard1: {
    id: 'businessCard1',
    name: '명함.쿠폰',
    displaySize: '90mm x 50mm', // 표시값
    displayWidth: 90,
    displayHeight: 50,
    width: 92, // 실제 적용 크기
    height: 52,
  },
  businessCard2: {
    id: 'businessCard2',
    name: '명함.쿠폰',
    displaySize: '86mm x 52mm',
    displayWidth: 86,
    displayHeight: 52,
    width: 88,
    height: 54,
  },
  giftCard: {
    id: 'giftCard',
    name: '상품권.티켓',
    displaySize: '148mm x 68mm',
    displayWidth: 148,
    displayHeight: 68,
    width: 150,
    height: 70,
  },
  leaflet1: {
    id: 'leaflet1',
    name: '리플렛.전단.포스터',
    displaySize: '210mm x 297mm',
    displayWidth: 210,
    displayHeight: 297,
    width: 212,
    height: 299,
  },
  leaflet2: {
    id: 'leaflet2',
    name: '리플렛.전단.포스터',
    displaySize: '420mm x 297mm',
    displayWidth: 420,
    displayHeight: 297,
    width: 422,
    height: 299,
  },
  sticker: {
    id: 'sticker',
    name: '스티커',
    displaySize: '50mm x 50mm',
    displayWidth: 50,
    displayHeight: 50,
    width: 52,
    height: 52,
  },
};

// 단위 변환을 적용하여 최종 PRINT_SIZES 생성
export const PRINT_SIZES = Object.keys(printSizesBase).reduce((acc, key) => {
  const base = printSizesBase[key];
  // 표시값은 이름에만 사용
  // 실제 크기는 width, height를 사용
  const actualSize = { width: base.width, height: base.height };
  const pxSize = convertSizeToPx(actualSize);
  const gridSize = convertSizeToGrid(actualSize);
  
  acc[key] = {
    ...base,
    size: base.displaySize, // 표시값을 size로 유지 (하위 호환성)
    ...pxSize,
    ...gridSize,
    minW: gridSize.w,
    minH: gridSize.h,
  };
  return acc;
}, {});

// 가로 스페이싱 설정 (mm 단위)
export const HORIZONTAL_SPACING = {
  default: 10,        // 기본값: 0mm
  small: 2,         // 작은 간격: 2mm
  medium: 5,        // 중간 간격: 5mm
  large: 10,        // 큰 간격: 10mm
};

// 세로 스페이싱 설정 (mm 단위)
export const VERTICAL_SPACING = {
  default: 10,       // 기본값: 0mm
  small: 2,         // 작은 간격: 2mm
  medium: 5,        // 중간 간격: 5mm
  large: 10,        // 큰 간격: 10mm
};

// 스페이싱을 픽셀로 변환
export const getSpacingPx = (mm) => mmToPxRounded(mm);

// 가로 스페이싱 픽셀 값
export const HORIZONTAL_SPACING_PX = {
  default: getSpacingPx(HORIZONTAL_SPACING.default),
  small: getSpacingPx(HORIZONTAL_SPACING.small),
  medium: getSpacingPx(HORIZONTAL_SPACING.medium),
  large: getSpacingPx(HORIZONTAL_SPACING.large),
};

// 세로 스페이싱 픽셀 값
export const VERTICAL_SPACING_PX = {
  default: getSpacingPx(VERTICAL_SPACING.default),
  small: getSpacingPx(VERTICAL_SPACING.small),
  medium: getSpacingPx(VERTICAL_SPACING.medium),
  large: getSpacingPx(VERTICAL_SPACING.large),
};

// BOX_SIZES는 하위 호환성을 위해 유지 (App_old.jsx에서 사용)
// 새로운 컨텐츠 타입에 맞게 업데이트
export const BOX_SIZES = {
  businessCard1: {
    w: PRINT_SIZES.businessCard1.w,
    h: PRINT_SIZES.businessCard1.h,
    minW: PRINT_SIZES.businessCard1.minW,
    minH: PRINT_SIZES.businessCard1.minH,
    name: `${PRINT_SIZES.businessCard1.name} (${PRINT_SIZES.businessCard1.displaySize || PRINT_SIZES.businessCard1.size})`,
  },
  businessCard2: {
    w: PRINT_SIZES.businessCard2.w,
    h: PRINT_SIZES.businessCard2.h,
    minW: PRINT_SIZES.businessCard2.minW,
    minH: PRINT_SIZES.businessCard2.minH,
    name: `${PRINT_SIZES.businessCard2.name} (${PRINT_SIZES.businessCard2.displaySize || PRINT_SIZES.businessCard2.size})`,
  },
  giftCard: {
    w: PRINT_SIZES.giftCard.w,
    h: PRINT_SIZES.giftCard.h,
    minW: PRINT_SIZES.giftCard.minW,
    minH: PRINT_SIZES.giftCard.minH,
    name: `${PRINT_SIZES.giftCard.name} (${PRINT_SIZES.giftCard.displaySize || PRINT_SIZES.giftCard.size})`,
  },
  leaflet1: {
    w: PRINT_SIZES.leaflet1.w,
    h: PRINT_SIZES.leaflet1.h,
    minW: PRINT_SIZES.leaflet1.minW,
    minH: PRINT_SIZES.leaflet1.minH,
    name: `${PRINT_SIZES.leaflet1.name} (${PRINT_SIZES.leaflet1.displaySize || PRINT_SIZES.leaflet1.size})`,
  },
  leaflet2: {
    w: PRINT_SIZES.leaflet2.w,
    h: PRINT_SIZES.leaflet2.h,
    minW: PRINT_SIZES.leaflet2.minW,
    minH: PRINT_SIZES.leaflet2.minH,
    name: `${PRINT_SIZES.leaflet2.name} (${PRINT_SIZES.leaflet2.displaySize || PRINT_SIZES.leaflet2.size})`,
  },
  sticker: {
    w: PRINT_SIZES.sticker.w,
    h: PRINT_SIZES.sticker.h,
    minW: PRINT_SIZES.sticker.minW,
    minH: PRINT_SIZES.sticker.minH,
    name: `${PRINT_SIZES.sticker.name} (${PRINT_SIZES.sticker.displaySize || PRINT_SIZES.sticker.size})`,
  },
  // 하위 호환성을 위한 별칭 (기존 코드 지원)
  small: {
    w: PRINT_SIZES.businessCard1.w,
    h: PRINT_SIZES.businessCard1.h,
    minW: PRINT_SIZES.businessCard1.minW,
    minH: PRINT_SIZES.businessCard1.minH,
    name: `${PRINT_SIZES.businessCard1.name} (${PRINT_SIZES.businessCard1.displaySize || PRINT_SIZES.businessCard1.size})`,
  },
  medium: {
    w: PRINT_SIZES.giftCard.w,
    h: PRINT_SIZES.giftCard.h,
    minW: PRINT_SIZES.giftCard.minW,
    minH: PRINT_SIZES.giftCard.minH,
    name: `${PRINT_SIZES.giftCard.name} (${PRINT_SIZES.giftCard.displaySize || PRINT_SIZES.giftCard.size})`,
  },
  large: {
    w: PRINT_SIZES.leaflet1.w,
    h: PRINT_SIZES.leaflet1.h,
    minW: PRINT_SIZES.leaflet1.minW,
    minH: PRINT_SIZES.leaflet1.minH,
    name: `${PRINT_SIZES.leaflet1.name} (${PRINT_SIZES.leaflet1.displaySize || PRINT_SIZES.leaflet1.size})`,
  },
};

// 판형 크기 정의 (mm 단위)
const frameSizesBase = {
  size2: {
    id: 'size2',
    name: '2절',
    size: '788mm x 545mm',
    width: 788,
    height: 545,
  },
  korean2: {
    id: 'korean2',
    name: '국2절',
    size: '636mm x 469mm',
    width: 636,
    height: 469,
  },
  korean4: {
    id: 'korean4',
    name: '국4절',
    size: '468mm x 318mm',
    width: 468,
    height: 318,
  },
  korean8: {
    id: 'korean8',
    name: '국8절',
    size: '315mm x 230mm',
    width: 315,
    height: 230,
  },
};

// 단위 변환을 적용하여 최종 FRAME_SIZES 생성
export const FRAME_SIZES = Object.keys(frameSizesBase).reduce((acc, key) => {
  const base = frameSizesBase[key];
  const pxSize = convertSizeToPx(base);
  const gridSize = convertSizeToGrid(base);
  
  acc[key] = {
    ...base,
    ...pxSize,
    ...gridSize,
  };
  return acc;
}, {});

