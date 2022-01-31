import { Route } from '@angular/router';
import { CampaignComponent } from './campaign.component';
import { CampaignResolver } from './campaign.resolver';
import { CampaingListComponent } from './components/list/campaing-list.component';

export const campaignRoute: Route[] = [
    {
        path     : '',
        component: CampaignComponent,
        children: [
            {
              path: '',
              component: CampaingListComponent,
              resolve  : {
                tasks    : CampaignResolver,
              }
            }
        ]
    }
];

