import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgressSpinnerComponent } from './progress-spinner.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { OverlayModule } from '@angular/cdk/overlay';
import { OverlayService } from './overlay.service';

@NgModule({
    declarations: [ProgressSpinnerComponent],
    imports: [
      CommonModule,
      MatProgressSpinnerModule,
      OverlayModule
    ],
    exports: [
      ProgressSpinnerComponent
    ],
    providers: [
      OverlayService
    ]
})
export class ProgressSpinnerModule {}
