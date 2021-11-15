import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RecipientsComponent } from './recipients.component';
import { UploadFileComponent } from './components/upload-file/upload-file.component';
import { DragDropDirective } from '../../../core/directives/drag-drop.directive';
import { RecipientListComponent } from './components/list/recipient-list.component';
import { FuseFindByKeyPipeModule } from '../../../../@fuse/pipes/find-by-key';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatRippleModule } from '@angular/material/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableModule } from '@angular/material/table';
import { SharedModule } from '../../../shared/shared.module';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { recipientsRoutes } from './recipients.routing';
import { ContactsDetailsComponent } from './components/details/details.component';
import { RecipcontrolComponent } from './components/recipcontrol/recipcontrol.component';
import { UploadCsvDialogComponent } from './components/upload-csv-dialog/upload-csv-dialog.component';
import { MatCardModule } from '@angular/material/card';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatSelectSearchModule } from '../../../core/select-search/mat-select-search.module';

@NgModule({
    declarations: [
        DragDropDirective,
        RecipientsComponent,
        RecipcontrolComponent,
        UploadCsvDialogComponent,
        UploadFileComponent,
        RecipientListComponent,
        ContactsDetailsComponent,
    ],
    imports: [
        RouterModule.forChild(recipientsRoutes),
        MatButtonModule,
        MatCheckboxModule,
        MatDatepickerModule,
        MatDividerModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatMenuModule,
        MatMomentDateModule,
        MatProgressBarModule,
        MatRadioModule,
        MatRippleModule,
        MatSelectModule,
        MatSidenavModule,
        MatTableModule,
        MatTooltipModule,
        MatCardModule,
        FuseFindByKeyPipeModule,
        MatBottomSheetModule,
        MatSelectSearchModule,
        SharedModule,
    ],
    exports: [DragDropDirective, UploadFileComponent],
    entryComponents: [UploadCsvDialogComponent],
})
export class RecipientsModule {}
