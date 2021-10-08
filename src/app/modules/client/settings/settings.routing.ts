import { Route } from '@angular/router';
import {AuthGuard} from '../../../core/auth/guards/auth.guard';
import {ProfileResolver} from './profile.resolver';
import {SettingsComponent} from './settings.component';

export const settingsRoute: Route[] = [
    {
        path        : '',
        component   : SettingsComponent,
        resolve  : {
            profile: ProfileResolver
        },
        canActivate: [AuthGuard]
    }
];
