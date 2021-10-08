import { Route } from '@angular/router';
import {AnalyticsResolver} from './analytics.resolvers';
import {AnalyticsComponent} from './analytics.component';
export const analyticsRoutes: Route[] = [
    {
        path     : '',
        component: AnalyticsComponent,
        resolve  : {
            data: AnalyticsResolver
        }
    }
];
