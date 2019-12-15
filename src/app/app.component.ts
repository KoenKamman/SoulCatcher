import { Component } from '@angular/core';
// import { ElectronService } from 'ngx-electron';
// import { IpcRendererEvent } from 'electron';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'soulcatcher';

  // public constructor(private electronService: ElectronService) {
  //   this.electronService.ipcRenderer.on('pong', (event: IpcRendererEvent) => {
  //     console.log('pong');
  //   });
  //   this.electronService.ipcRenderer.send('ping');
  // }

  public constructor() {
    (window as any).ipcRenderer.on('pong', (event) => {
      console.log('pong');
    });
    (window as any).ipcRenderer.send('ping');
  }
}
