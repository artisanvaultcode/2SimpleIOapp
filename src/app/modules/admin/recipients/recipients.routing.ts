import { Route } from '@angular/router';
import {RecipientsComponent} from './recipients.component';
import {RecipientListComponent} from './components/list/recipient-list.component';
import {RecipientsRecipientResolver, RecipientsResolver} from './recipients.resolvers';
import {ContactsDetailsComponent} from './components/details/details.component';

export const recipientsRoutes: Route[] = [
    {
        path     : '',
        component: RecipientsComponent,
        children : [
            {
                path     : '',
                component: RecipientListComponent,
                resolve  : {
                    recipients    : RecipientsResolver,
                },
                children : [
                    {
                        path         : ':id',
                        component    : ContactsDetailsComponent,
                        resolve      : {
                            task     : RecipientsRecipientResolver,
                        }
                    }
                ]
            }
        ]
    }
];
