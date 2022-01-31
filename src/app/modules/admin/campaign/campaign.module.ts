import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { campaignRoute } from './campaign.routing';
import { CampaignComponent } from './campaign.component';
import { CampaignListComponent } from './components/list/campaign-list.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { SharedModule } from 'app/shared/shared.module';


@NgModule({
  declarations: [
    CampaignComponent,
    CampaignListComponent
  ],
  imports: [
    RouterModule.forChild(campaignRoute),
    SharedModule,
    MatSidenavModule,
  ]
})
export class CampaignModule { }
