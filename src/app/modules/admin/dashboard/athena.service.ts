import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'environments/environment';
import { catchError, retry } from 'rxjs/operators';
import { Logger } from 'aws-amplify';
import { Observable, throwError } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class AthenaService {

    private logger = new Logger('Devices List');
    baseURL = environment.backendurl;
    private httpHeaders = new HttpHeaders({
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
    });
    httpOptions = {
        headers: new HttpHeaders({
            'Access-Control-Allow-Origin': '*'
        })
      }

    constructor(
        private _http: HttpClient,
    ) {}

    dbSmsOverview(clientId, yearStr): Observable<any> {

        const endPoint = `${this.baseURL}/db/sqsmso`;
        const headers = this.httpHeaders;
        const payload = {
            clientId: clientId,
            yearStr: yearStr
        }
        return this._http
            .post<any>(endPoint, JSON.stringify(payload), { headers })
            .pipe(
                retry(1),
                catchError(this.catchError)
            );
    }

    dbSmsDevice(clientId): Observable<any> {

        const endPoint = `${this.baseURL}/db/sqsmsdev`;
        const headers = this.httpHeaders;
        const payload = {
            clientId: clientId
        }
        return this._http
            .post<any>(endPoint, JSON.stringify(payload), { headers })
            .pipe(
                retry(1),
                catchError(this.catchError)
            );
    }


    dbMonthCard(clientId): Observable<any> {

        const endPoint = `${this.baseURL}/db/sqmotcard`;
        const headers = this.httpHeaders;
        const payload = {
            clientId: clientId
        }
        return this._http
            .post<any>(endPoint, JSON.stringify(payload), { headers })
            .pipe(
                retry(1),
                catchError(this.catchError)
            );
    }

    dbSmsOverviewMonth(clientId): Observable<any> {

        const endPoint = `${this.baseURL}/db/sqmot`;
        const headers = this.httpHeaders;
        const payload = {
            clientId: clientId
        }
        return this._http
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
        this.logger.debug('Errors!', error);
        return throwError(errorMessage);
    }
}
