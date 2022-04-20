import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { campaignRoute } from './campaign.routing';

import { CampaignComponent } from './campaign.component';
import { CampaignListComponent } from './components/list/campaign-list.component';
import { SharedModule } from 'app/shared/shared.module';
import { ControlComponent } from './components/control/control.component';
import { WizardComponent } from './components/wizard/wizard.component';
import { WizardInfoComponent } from './components/wizard-info/wizard-info.component';
import { WizardSearchComponent } from './components/wizard-search/wizard-search.component';
import { WizardMessageComponent } from './components/wizard-message/wizard-message.component';
import { WizardScheduleComponent } from './components/wizard-schedule/wizard-schedule.component';
import { WizardConfirmComponent } from './components/wizard-confirm/wizard-confirm.component';

import { FuseAlertModule } from '@fuse/components/alert';
import { FuseDrawerModule } from '@fuse/components/drawer';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatRadioModule } from '@angular/material/radio';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule } from '@angular/material/core';
import { MatStepperModule } from '@angular/material/stepper';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatListModule } from '@angular/material/list';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
    declarations: [
        CampaignComponent,
        CampaignListComponent,
        ControlComponent,
        WizardComponent,
        WizardInfoComponent,
        WizardSearchComponent,
        WizardMessageComponent,
        WizardScheduleComponent,
        WizardConfirmComponent,
    ],
    imports: [
        RouterModule.forChild(campaignRoute),
        SharedModule,
        FuseAlertModule,
        FuseDrawerModule,
        MatSidenavModule,
        MatIconModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatDialogModule,
        MatTableModule,
        MatMenuModule,
        MatProgressBarModule,
        MatSlideToggleModule,
        MatRadioModule,
        MatCardModule,
        MatChipsModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatStepperModule,
        MatCheckboxModule,
        MatBottomSheetModule,
        MatListModule,
        MatAutocompleteModule,
        MatTooltipModule
    ]
})
export class Campaignv2Module {}
