import { CampaingListComponent } from './components/list/campaing-list.component';
import { Route } from '@angular/router';
import { CampaignComponent } from './campaign.component';

export const campaignRoute: Route[] = [
    {
        path     : '',
        component: CampaignComponent,
        children: [
            {
              path: '',
              component: CampaingListComponent,
              /* resolve  : {
                tasks    : DevicesResolver,
              } */
            }
          ]
    }
];

