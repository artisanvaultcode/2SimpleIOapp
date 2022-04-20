
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {RecipientsService} from './recipients.service';

@Injectable({
    providedIn: 'root'
})
export class RecipientsResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _recipientsService: RecipientsService)
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Resolver
     *
     * @param route
     * @param state
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any
    {
        return new Promise((resolve, reject) => {
            Promise.all([
                this._recipientsService.getRecipients(),
                this._recipientsService.getGroups(),
            ]).then(
                () => {
                    resolve(true);
                },
                reject
            );
        });
    }
}

@Injectable({
    providedIn: 'root'
})
export class RecipientsRecipientResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(
        private _recipientsService: RecipientsService,
        private _router: Router
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Resolver
     *
     * @param route
     * @param state
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any>
    {
        return this._recipientsService.getRecipientById(route.paramMap.get('id'))
           .pipe(
               // Error here means the requested contact is not available
               catchError((error) => {

                   // Get the parent url
                   const parentUrl = state.url.split('/').slice(0, -1).join('/');

                   // Navigate to there
                   this._router.navigateByUrl(parentUrl);

                   // Throw an error
                   return throwError(error);
               })
           );
    }
}

