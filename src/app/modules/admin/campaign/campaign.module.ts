import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { campaignRoute } from './campaign.routing';
import { CampaignComponent } from './campaign.component';
import { CampaignListComponent } from './components/list/campaign-list.component';
import { DetailsCampaignsComponent } from './components/detail/details-campaigns.component';
import { SharedModule } from 'app/shared/shared.module';
import { ControlComponent } from './components/control/control.component';
import { ListRecipientsComponent } from './components/list-recipients/list-recipients.component';

import { FuseAlertModule } from '@fuse/components/alert';
import { FuseDrawerModule } from '@fuse/components/drawer';
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

@NgModule({
    declarations: [
        CampaignComponent,
        CampaignListComponent,
        DetailsCampaignsComponent,
        ControlComponent,
        ListRecipientsComponent
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
    ]
})
export class CampaignModule {}
