import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { campaignRoute } from './campaign.routing';
import { CampaignComponent } from './campaign.component';
import { CampaingListComponent } from './components/list/campaing-list.component';


@NgModule({
  declarations: [
    CampaignComponent,
    CampaingListComponent
  ],
  imports: [
    RouterModule.forChild(campaignRoute)
  ]
})
export class CampaignModule { }
