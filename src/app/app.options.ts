import { InjectionToken } from '@angular/core';

export interface AppOptions {
    pageSize?: any;
    notiType?: any;
}

export const defaultAppOptions: any = {
    pageSize: 10,
    notiType: 'NONE'
};

export const APPS_MANAGER_OPTIONS = new InjectionToken<AppOptions>('App Manager Options');
export const APP_OPTIONS = new InjectionToken<AppOptions>('App Options');
