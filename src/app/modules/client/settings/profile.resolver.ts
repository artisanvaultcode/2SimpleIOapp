import { Injectable } from '@angular/core';
import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import {ProfileService} from './profile.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileResolver implements Resolve<any> {
    /**
     * Constructor
     */
    constructor(private _devicesService: ProfileService) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Resolver
     *
     * @param route
     * @param state
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
        return new Promise((resolve, reject) => {
            Promise.all([this._devicesService.getCurrentUser()]).then(() => {
                resolve(true);
            }, reject);
        });
    }
}
