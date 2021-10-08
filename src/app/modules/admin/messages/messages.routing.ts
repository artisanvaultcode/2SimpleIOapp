import { Route } from '@angular/router';
import {MessagesComponent} from './messages.component';
import {ListMessagesComponent} from './components/list/list-messages.component';
import { MessagesResolver } from './messages.resolver';

export const msgsRoutes: Route[] = [
    {
        path     : '',
        component: MessagesComponent,
        children : [
            {
                path     : '',
                component: ListMessagesComponent,
                resolve: {
                    tasks: MessagesResolver,
                }
            }
        ]
    }
];
