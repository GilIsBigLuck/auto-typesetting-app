/**
 * 단위 변환 유틸리티
 * 
 * 이 파일은 mm, px, grid 단위 간의 변환을 전역적으로 관리합니다.
 */

// DPI 설정 (사용하지 않음 - 1px = 1mm로 설정)
const DPI = 96;
// mm를 px로 변환하는 상수: 1px = 1mm로 설정
// 실제 물리적 크기와 화면 표시 크기를 1:1로 매핑
const MM_TO_PX_RATIO = 1;

// 그리드 설정
export const GRID_ROW_HEIGHT = 1;

/**
 * mm를 px로 변환
 * @param {number} mm - 밀리미터 값
 * @returns {number} 픽셀 값
 */
export const mmToPx = (mm) => mm * MM_TO_PX_RATIO;

/**
 * px를 mm로 변환
 * @param {number} px - 픽셀 값
 * @returns {number} 밀리미터 값
 */
export const pxToMm = (px) => px / MM_TO_PX_RATIO;

/**
 * px를 반올림하여 정수 픽셀로 변환
 * @param {number} mm - 밀리미터 값
 * @returns {number} 반올림된 픽셀 값 (1px = 1mm이므로 mm 값 그대로 반환)
 */
export const mmToPxRounded = (mm) => Math.round(mm);

/**
 * 픽셀을 그리드 가로 단위로 변환
 * @param {number} px - 픽셀 값
 * @returns {number} 그리드 가로 값
 */
export const pxToGridW = (px) => px;

/**
 * 픽셀을 그리드 세로 단위로 변환
 * @param {number} px - 픽셀 값
 * @returns {number} 그리드 세로 값
 */
export const pxToGridH = (px) => px / GRID_ROW_HEIGHT;

/**
 * mm를 그리드 가로 단위로 변환
 * @param {number} mm - 밀리미터 값
 * @returns {number} 그리드 가로 값
 */
export const mmToGridW = (mm) => pxToGridW(mmToPxRounded(mm));

/**
 * mm를 그리드 세로 단위로 변환
 * @param {number} mm - 밀리미터 값
 * @returns {number} 그리드 세로 값
 */
export const mmToGridH = (mm) => pxToGridH(mmToPxRounded(mm));

/**
 * mm 크기 객체를 px 크기 객체로 변환
 * @param {Object} size - { width: number, height: number } (mm 단위)
 * @returns {Object} { widthPx: number, heightPx: number }
 */
export const convertSizeToPx = (size) => ({
  widthPx: mmToPxRounded(size.width),
  heightPx: mmToPxRounded(size.height),
});

/**
 * mm 크기 객체를 grid 크기 객체로 변환
 * @param {Object} size - { width: number, height: number } (mm 단위)
 * @returns {Object} { w: number, h: number }
 */
export const convertSizeToGrid = (size) => ({
  w: mmToGridW(size.width),
  h: mmToGridH(size.height),
});

/**
 * DPI 값을 가져옵니다
 * @returns {number} 현재 DPI 값
 */
export const getDPI = () => DPI;

/**
 * MM_TO_PX_RATIO 값을 가져옵니다
 * @returns {number} mm to px 변환 비율
 */
export const getMmToPxRatio = () => MM_TO_PX_RATIO;

