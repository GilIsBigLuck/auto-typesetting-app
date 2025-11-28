# Grid Layout App

Electron 앱으로 제작된 인쇄물 레이아웃 관리 애플리케이션입니다.

## 개발 환경 실행

```bash
# 의존성 설치
npm install

# 개발 모드 실행
npm run electron:dev
```

## 앱 빌드 및 배포

### Windows용 빌드
```bash
npm run build:win
```
빌드된 파일은 `release` 폴더에 생성됩니다:
- `Grid Layout App Setup x.x.x.exe` - 설치 파일
- `Grid Layout App x.x.x.exe` - 포터블 버전

### macOS용 빌드
```bash
npm run build:mac
```
빌드된 파일은 `release` 폴더에 생성됩니다:
- `Grid Layout App-x.x.x.dmg` - DMG 파일

### Linux용 빌드
```bash
npm run build:linux
```
빌드된 파일은 `release` 폴더에 생성됩니다:
- `Grid Layout App-x.x.x.AppImage` - AppImage 파일
- `Grid Layout App_x.x.x_amd64.deb` - Debian 패키지

### 모든 플랫폼 빌드
```bash
npm run build
```

## 빌드 옵션

- **NSIS 설치 파일**: Windows용 설치 프로그램 (기본값)
- **Portable**: 설치 없이 실행 가능한 포터블 버전
- **DMG**: macOS용 디스크 이미지
- **AppImage**: Linux용 실행 파일
- **DEB**: Debian/Ubuntu용 패키지

## 주의사항

1. 빌드 전에 `vite build`가 먼저 실행되어 `dist` 폴더에 프로덕션 빌드가 생성됩니다.
2. 아이콘 파일이 없으면 기본 Electron 아이콘이 사용됩니다.
3. 코드 서명을 하려면 `package.json`의 `build` 섹션에 인증서 정보를 추가해야 합니다.

## 기술 스택

- **Electron**: 데스크톱 앱 프레임워크
- **React**: UI 라이브러리
- **Vite**: 빌드 도구
- **react-grid-layout**: 그리드 레이아웃 관리
