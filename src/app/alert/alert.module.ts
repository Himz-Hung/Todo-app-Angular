import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotifyComponent } from './notify/notify.component';

@NgModule({
  declarations: [NotifyComponent],
  imports: [CommonModule],
  exports: [NotifyComponent],
})
export class AlertModule {}
