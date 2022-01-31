import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { campaignRoute } from './campaign.routing';
import { CampaignComponent } from './campaign.component';
import { CampaingListComponent } from './components/list/campaing-list.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { SharedModule } from 'app/shared/shared.module';


@NgModule({
  declarations: [
    CampaignComponent,
    CampaingListComponent
  ],
  imports: [
    RouterModule.forChild(campaignRoute),
    SharedModule,
    MatSidenavModule,
  ]
})
export class CampaignModule { }
