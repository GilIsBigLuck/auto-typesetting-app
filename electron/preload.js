import { contextBridge, ipcRenderer } from 'electron';

// 보안을 위한 contextBridge 사용
contextBridge.exposeInMainWorld('electron', {
  printToPDF: async (options) => {
    return await ipcRenderer.invoke('print-to-pdf', options);
  },
  print: () => {
    ipcRenderer.send('print');
  },
});

