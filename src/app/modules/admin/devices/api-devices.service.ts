import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Logger} from '@aws-amplify/core';
import {
    APIService,
} from '../../../API.service';
import {environment} from '../../../../environments/environment';
import {catchError, retry} from 'rxjs/operators';
import {Observable, throwError} from 'rxjs';
@Injectable({
    providedIn: 'root'
})
export class ApiDevicesService
{

    // Private
    private logger = new Logger('Devices List');
    private baseURL = environment.backendurl;
    private httpHeaders = new HttpHeaders({
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
    });
    /**
     * Constructor
     */
    constructor(
        private _httpClient: HttpClient,

    )
    {}

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for device
     */

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    sendMessages(deviceIds=[], phoneTo: string,  sub: string, txtMsg: string): Observable<any> {
        const payload = {
            topicName : 'sync-sms',
            event: 'SMS',
            phone: phoneTo,
            message: txtMsg,
            deviceIds: deviceIds,
            clientId: sub
        };
        const endPoint = `${this.baseURL}/sms/test`;
        const headers = this.httpHeaders;
        return this._httpClient
            .post<any>(endPoint, JSON.stringify(payload), { headers })
            .pipe(
                retry(1),
                catchError(this.catchError)
            );
    }

    sendAwakeTests(deviceIds=[],  sub: string): Observable<any> {
        const payload = {
            topicName : 'sync-sms',
            event: 'PING',
            deviceIds: deviceIds,
            clientId: sub
        };
        const endPoint = `${this.baseURL}/device/status`;
        const headers = this.httpHeaders;
        return this._httpClient
            .post<any>(endPoint, JSON.stringify(payload), { headers })
            .pipe(
                retry(1),
                catchError(this.catchError)
            );
    }
    // OK/Revisado
    deviceRegistration(tempKey: string, sub: string): Observable<any> {
        const payload = {
            topicName : 'sync-sms',
            event: tempKey,
            deviceIds: 'REGISTRATION',
            clientId: sub
        };
        const endPoint = `${this.baseURL}/device/add`;
        const headers = this.httpHeaders;
        return this._httpClient
            .post<any>(endPoint, JSON.stringify(payload), { headers })
            .pipe(
                retry(1),
                catchError(this.catchError)
            );
    }

    deviceStatus(deviceIds= [], eventCMD: string, sub: string): Observable<any> {
        const payload = {
            topicName : 'sync-sms',
            event: eventCMD,
            deviceIds: deviceIds,
            metaData: {},
            clientId: sub
        };
        const endPoint = `${this.baseURL}/device/status`;
        const headers = this.httpHeaders;
        return this._httpClient
            .post<any>(endPoint, JSON.stringify(payload), { headers })
            .pipe(
                retry(1),
                catchError(this.catchError)
            );
    }

    catchError(error): any {
        let errorMessage = '';
        if(error.error instanceof ErrorEvent) {
            // Get client-side error
            errorMessage = error.error.message;
        } else {
            // Get server-side error
            errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
        }
        console.log(errorMessage);
        this.logger.debug('OOPS!', error);
        return throwError(errorMessage);
    }
}
