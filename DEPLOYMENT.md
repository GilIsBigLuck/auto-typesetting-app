# 배포 가이드

## 현재 빌드 상태

코드 서명 단계에서 오류가 발생했지만, 앱 자체는 성공적으로 빌드되었습니다.

## 배포 파일 위치

### 1. Portable 버전 (권장)
- **위치**: `release\win-unpacked\Grid Layout App.exe`
- **ZIP 파일**: `release\Grid-Layout-App-Portable.zip`
- **사용법**: 
  - ZIP 파일을 다운로드 받아 압축 해제
  - `Grid Layout App.exe` 실행
  - 설치 불필요, 바로 실행 가능

### 2. 전체 폴더 배포
- **위치**: `release\win-unpacked` 폴더 전체
- **사용법**: 폴더 전체를 배포하고 `Grid Layout App.exe` 실행

## 배포 방법

### 옵션 1: ZIP 파일 배포 (가장 간단)
1. `release\Grid-Layout-App-Portable.zip` 파일을 공유
2. 사용자가 다운로드 후 압축 해제
3. `Grid Layout App.exe` 실행

### 옵션 2: 설치 파일 생성 (추가 작업 필요)
NSIS 설치 파일을 만들려면:
1. 관리자 권한으로 PowerShell 실행
2. `npm run build:win` 실행
3. 또는 코드 서명 인증서 설정

## 현재 문제

코드 서명 도구 다운로드 중 심볼릭 링크 생성 오류가 발생하지만, 이는 앱 실행에 영향을 주지 않습니다.

## 해결 방법

### 임시 해결책 (현재 사용 중)
- Portable 버전으로 배포 (ZIP 파일)
- 코드 서명 없이 배포

### 완전한 해결책
1. 관리자 권한으로 빌드
2. 또는 코드 서명 인증서 구매 및 설정
3. 또는 electron-builder 버전 업데이트

## 사용자 안내

배포 시 사용자에게 다음을 안내하세요:

1. **Windows Defender 경고**: 코드 서명이 없어 "알 수 없는 게시자" 경고가 나타날 수 있습니다.
   - 해결: "추가 정보" → "실행" 클릭

2. **실행 방법**: 
   - ZIP 파일 다운로드
   - 압축 해제
   - `Grid Layout App.exe` 더블클릭

3. **시스템 요구사항**:
   - Windows 10 이상
   - 약 200MB 디스크 공간

