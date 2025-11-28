// 판 크기 설정 (mm 단위)
export const PLATE_WIDTH_MM = 315;
export const PLATE_HEIGHT_MM = 230;

// mm를 px로 변환: mm * 3.779527559 (96dpi 기준)
const mmToPx = (mm) => mm * 3.779527559;

// 그리드 설정
export const GRID_COLS = Math.round(mmToPx(PLATE_WIDTH_MM));
export const GRID_ROW_HEIGHT = 1;

// 픽셀 크기를 그리드 단위로 변환하는 헬퍼 함수
export const pxToGridW = (px) => px;
export const pxToGridH = (px) => px / GRID_ROW_HEIGHT;

// 인쇄물 크기 정의
export const PRINT_SIZES = {
  small: {
    id: 'small',
    name: '명함',
    size: '90mm x 50mm',
    width: 90,
    height: 50,
    widthPx: Math.round(mmToPx(90)),
    heightPx: Math.round(mmToPx(50)),
    w: pxToGridW(Math.round(mmToPx(90))),
    h: pxToGridH(Math.round(mmToPx(50))),
    minW: pxToGridW(Math.round(mmToPx(90))),
    minH: pxToGridH(Math.round(mmToPx(50))),
  },
  medium: {
    id: 'medium',
    name: '상품권',
    size: '148mm x 68mm',
    width: 148,
    height: 68,
    widthPx: Math.round(mmToPx(148)),
    heightPx: Math.round(mmToPx(68)),
    w: pxToGridW(Math.round(mmToPx(148))),
    h: pxToGridH(Math.round(mmToPx(68))),
    minW: pxToGridW(Math.round(mmToPx(148))),
    minH: pxToGridH(Math.round(mmToPx(68))),
  },
  large: {
    id: 'large',
    name: 'A6',
    size: '105mm x 148mm',
    width: 105,
    height: 148,
    widthPx: Math.round(mmToPx(105)),
    heightPx: Math.round(mmToPx(148)),
    w: pxToGridW(Math.round(mmToPx(105))),
    h: pxToGridH(Math.round(mmToPx(148))),
    minW: pxToGridW(Math.round(mmToPx(105))),
    minH: pxToGridH(Math.round(mmToPx(148))),
  },
};

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
export const getSpacingPx = (mm) => Math.round(mmToPx(mm));

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

// BOX_SIZES는 하위 호환성을 위해 유지
export const BOX_SIZES = {
  small: {
    w: PRINT_SIZES.small.w,
    h: PRINT_SIZES.small.h,
    minW: PRINT_SIZES.small.minW,
    minH: PRINT_SIZES.small.minH,
    name: `${PRINT_SIZES.small.name} (${PRINT_SIZES.small.size})`,
  },
  medium: {
    w: PRINT_SIZES.medium.w,
    h: PRINT_SIZES.medium.h,
    minW: PRINT_SIZES.medium.minW,
    minH: PRINT_SIZES.medium.minH,
    name: `${PRINT_SIZES.medium.name} (${PRINT_SIZES.medium.size})`,
  },
  large: {
    w: PRINT_SIZES.large.w,
    h: PRINT_SIZES.large.h,
    minW: PRINT_SIZES.large.minW,
    minH: PRINT_SIZES.large.minH,
    name: `${PRINT_SIZES.large.name} (${PRINT_SIZES.large.size})`,
  },
};

// 그룹 크기 정의 (mm 단위)
export const FRAME_SIZES = {
  small: {
    id: 'small',
    name: '소형 그룹',
    size: '200mm x 150mm',
    width: 200,
    height: 150,
    widthPx: Math.round(mmToPx(200)),
    heightPx: Math.round(mmToPx(150)),
    w: pxToGridW(Math.round(mmToPx(200))),
    h: pxToGridH(Math.round(mmToPx(150))),
  },
  medium: {
    id: 'medium',
    name: '중형 그룹',
    size: '250mm x 180mm',
    width: 250,
    height: 180,
    widthPx: Math.round(mmToPx(250)),
    heightPx: Math.round(mmToPx(180)),
    w: pxToGridW(Math.round(mmToPx(250))),
    h: pxToGridH(Math.round(mmToPx(180))),
  },
  large: {
    id: 'large',
    name: '대형 그룹',
    size: '300mm x 220mm',
    width: 300,
    height: 220,
    widthPx: Math.round(mmToPx(300)),
    heightPx: Math.round(mmToPx(220)),
    w: pxToGridW(Math.round(mmToPx(300))),
    h: pxToGridH(Math.round(mmToPx(220))),
  },
};

