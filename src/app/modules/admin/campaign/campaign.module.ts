import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { campaignRoute } from './campaign.routing';
import { CampaignComponent } from './campaign.component';
import { CampaignListComponent } from './components/list/campaign-list.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { SharedModule } from 'app/shared/shared.module';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DetailsCampaignsComponent } from './components/detail/details-campaigns.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { FuseAlertModule } from '@fuse/components/alert';
import { MatTableModule } from '@angular/material/table';
import { ControlComponent } from './components/control/control.component';
import { MatMenuModule } from '@angular/material/menu';
import { ListRecipientsComponent } from './components/list-recipients/list-recipients.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatRadioModule } from '@angular/material/radio';

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
    ]
})
export class CampaignModule {}
