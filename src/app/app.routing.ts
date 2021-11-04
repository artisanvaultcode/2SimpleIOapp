import { Route } from '@angular/router';
import { AuthGuard } from 'app/core/auth/guards/auth.guard';
import { NoAuthGuard } from 'app/core/auth/guards/noAuth.guard';
import { LayoutComponent } from 'app/layout/layout.component';
import { InitialDataResolver } from 'app/app.resolvers';

// @formatter:off
// tslint:disable:max-line-length
export const appRoutes: Route[] = [

    {path: '', pathMatch : 'full', redirectTo: 'auth'},
    {path: 'go', pathMatch : 'full', redirectTo: 'client'},
    {
        path: 'auth',
        canActivate: [NoAuthGuard],
        // canActivateChild: [NoAuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            {path: '', pathMatch : 'full', redirectTo: 'login'},
            {path: 'login', loadChildren: () => import('app/auth/sign-in/sign-in.module').then(m => m.AuthSignInModule)},
            {path: 'register', loadChildren: () => import('app/auth/sign-up/sign-up.module').then(m => m.AuthSignUpModule)},

        ]
    },
    {
        path: '',
        component  : LayoutComponent,
        data: {
            layout: 'empty'
        },
        children   : [
            {path: 'home', loadChildren: () => import('app/modules/landing/home/home.module').then(m => m.LandingHomeModule)},
        ]
    },
    // {path: 'forgot-password', loadChildren: () => import('app/modules/auth/forgot-password/forgot-password.module').then(m => m.AuthForgotPasswordModule)},
    // {path: 'reset-password', loadChildren: () => import('app/modules/auth/reset-password/reset-password.module').then(m => m.AuthResetPasswordModule)},

    // // Landing routes
    // {
    //     path: '',
    //     component  : LayoutComponent,
    //     data: {
    //         layout: 'empty'
    //     },
    //     children   : [
    //         {path: 'home', loadChildren: () => import('app/modules/landing/home/home.module').then(m => m.LandingHomeModule)},
    //     ]
    // },

    // Admin routes
    {
        path       : 'client',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component  : LayoutComponent,
        resolve    : {
            initialData: InitialDataResolver,
        },
        children   : [
            {path: '', pathMatch : 'full', redirectTo: 'dashboard'},
            {path: 'dashboard', loadChildren: () => import('app/modules/admin/dashboard/analytics.module').then(m => m.AnalyticsModule)},
            {path: 'recipients', loadChildren: () => import('app/modules/admin/recipients/recipients.module').then(m => m.RecipientsModule)},
            {path: 'devices', loadChildren: () => import('app/modules/admin/devices/devices.module').then(m => m.DevicesModule)},
            {path: 'messages', loadChildren: () => import('app/modules/admin/messages/messages.module').then(m => m.MessagesModule)},
            {path: 'enterprisebi', loadChildren: () => import('app/modules/admin/enterprisebi/enterprisebi.module').then(m => m.EnterprisebiModule)},
            {path: 'me', loadChildren: () => import('app/modules/client/settings/settings.module').then(m => m.SettingsModule)},
            {path: 'logout', loadChildren: () => import('app/auth/sign-out/sign-out.module').then(m => m.AuthSignOutModule)},
        ]
    }
];
