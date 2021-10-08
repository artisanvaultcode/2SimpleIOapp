import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    Resolve,
    Router,
    RouterStateSnapshot,
} from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { DevicesService } from './devices.service';

@Injectable({
    providedIn: 'root',
})
export class DevicesResolver implements Resolve<any> {
    /**
     * Constructor
     */
    constructor(private _devicesService: DevicesService) {}

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
            Promise.all([this._devicesService.getDevices()]).then(() => {
                resolve(true);
            }, reject);
        });
    }
}

@Injectable({
    providedIn: 'root',
})
export class DevicesDeviceResolver implements Resolve<any> {
    /**
     * Constructor
     */
    constructor(
        private _devicesService: DevicesService,
        private _router: Router
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Resolver
     *
     * @param route
     * @param state
     */
    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<any> {
        return this._devicesService
            .getDeviceById(route.paramMap.get('id'))
            .pipe(
                // Error here means the requested contact is not available
                catchError((error) => {
                    // Log the error
                    console.error(error);

                    // Get the parent url
                    const parentUrl = state.url
                        .split('/')
                        .slice(0, -1)
                        .join('/');

                    // Navigate to there
                    this._router.navigateByUrl(parentUrl);

                    // Throw an error
                    return throwError(error);
                })
            );
    }
}
