import { NgModule } from '@angular/core';
import { MatSelectSearchComponent } from './mat-select-search.component';
import { CommonModule } from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatTooltipModule} from '@angular/material/tooltip';
import {ReactiveFormsModule} from '@angular/forms';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatSelectSearchClearDirective} from './mat-select-search.directive';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatCheckboxModule,
        MatProgressSpinnerModule,
        MatTooltipModule
    ],
    declarations: [
        MatSelectSearchComponent,
        MatSelectSearchClearDirective
    ],
    exports: [
        MatSelectSearchComponent,
        MatSelectSearchClearDirective
    ]
})
export class MatSelectSearchModule { }
