import { contextBridge } from 'electron';

// 보안을 위한 contextBridge 사용
contextBridge.exposeInMainWorld('electronAPI', {
  // 필요시 API 추가
});

