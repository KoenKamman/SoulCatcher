import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FlexLayoutModule } from '@angular/flex-layout';

import * as fromComponents from './components';

@NgModule({
  declarations: [...fromComponents.components],
  imports: [CommonModule, FlexLayoutModule],
  exports: [...fromComponents.components, FlexLayoutModule]
})
export class CoreModule { }
