import { Route } from '@angular/router';
import { CampaignComponent } from './campaign.component';
import { CampaignResolver } from './campaign.resolver';
import { CampaignListComponent } from './components/list/campaign-list.component';
import { ListRecipientsComponent } from './components/list-recipients/list-recipients.component';

export const campaignRoute: Route[] = [
    {
        path     : '',
        component: CampaignComponent,
        children: [
            {
                path: '',
                component: CampaignListComponent,
                resolve  : {
                  tasks    : CampaignResolver,
                }
            },
            {
                path: 'addcampaign',
                component: ListRecipientsComponent
            }
        ]
    }
];

