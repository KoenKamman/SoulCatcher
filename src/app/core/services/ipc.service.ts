import { Injectable } from '@angular/core';
import { IpcRenderer, IpcRendererEvent } from 'electron';

@Injectable({
  providedIn: 'root'
})
export class IpcService {
  private ipcRenderer: IpcRenderer | undefined;

  public constructor() {
    if ((window as any).ipcRenderer) {
      this.ipcRenderer = (window as any).ipcRenderer;
    } else {
      console.warn('Electron IPC not found!');
    }
  }

  public on(channel: string, listener: (event: IpcRendererEvent, ...args: any) => void): void {
    if (!this.ipcRenderer) { return; }
    this.ipcRenderer.on(channel, listener);
  }

  public send(channel: string, ...args: any[]): void {
    if (!this.ipcRenderer) { return; }
    this.ipcRenderer.send(channel, ...args);
  }
}
