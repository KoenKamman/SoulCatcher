import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { IpcService } from '@core/services/ipc.service';

@Component({
  selector: 'app-titlebar',
  templateUrl: './titlebar.component.html',
  styleUrls: ['./titlebar.component.scss']
})
export class TitlebarComponent implements OnInit {
  public maximized: boolean;

  public constructor(private ipcService: IpcService, private cdr: ChangeDetectorRef) {
    this.maximized = false;
  }

  public ngOnInit() {
    this.ipcService.on('window-maximized', (event, state) => {
      this.maximized = state;
      this.cdr.detectChanges();
    });
  }

  public sendControlEvent(event: string): void {
    this.ipcService.send(event);
  }

}
