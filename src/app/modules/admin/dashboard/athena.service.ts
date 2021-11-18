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

    athenamonthmsg(sub: String) {

        let formData = new FormData();
        let query = `
                SELECT SUBSTR(ssp.createdat, 1, 10) AS datestr, count(ssp.createdat) AS messages
                FROM "simple2db"."simple2_parquet" AS ssp
                WHERE DATE(SUBSTR(ssp.createdat, 1, 10)) >= DATE_ADD('MONTH', -1, CURRENT_DATE)
                            AND clientid = '${sub}'
                GROUP BY SUBSTR(ssp.createdat, 1, 10)
                ORDER BY SUBSTR(ssp.createdat, 1, 10);
            `;
        formData.append('query', query);
        return this._http.post(this.baseURL+'/athenaquery', formData, this.httpOptions);

    }

    yearmsgdevices(sub: string, yearstr: string) {
        let formData = new FormData();
        let query = `
            SELECT SUBSTR(ssp.createdat, 1, 10) AS datestr, ssp.uniqueid AS devices,
                    count(uniqueid) AS messages
            FROM "simple2db"."simple2_parquet" AS ssp
            WHERE ssp.partition_0 = '${yearstr}' AND (ssp.clientid = ${sub})
            GROUP BY SUBSTR(ssp.createdat, 1, 10), uniqueid
            ORDER BY SUBSTR(ssp.createdat, 1, 10);
            `;
        formData.append('query', query);
        return this._http.post(this.baseURL+'/athenaquery', formData, this.httpOptions);
    }

    monthmsgdevices(sub: string) {
        let formData = new FormData();
        let query = `
            SELECT SUBSTR(ssp.createdat, 1, 10) AS datestr, ssp.uniqueid AS devices,
                    count(uniqueid) AS messages
            FROM "simple2db"."simple2_parquet" AS ssp
            WHERE DATE(SUBSTR(ssp.createdat, 1, 10)) >= DATE_ADD('MONTH', -1, CURRENT_DATE)
                    AND (ssp.clientid = ${sub})
            GROUP BY SUBSTR(ssp.createdat, 1, 10), uniqueid
            ORDER BY SUBSTR(ssp.createdat, 1, 10);
            `;
        formData.append('query', query);
        return this._http.post(this.baseURL+'/athenaquery', formData, this.httpOptions);
    }

    distinctDevicesMonth(sub: string){
        let formData = new FormData();
        let query = `
                SELECT DISTINCT ssp.uniqueid
                FROM "simple2db"."simple2_parquet" AS ssp
                WHERE DATE(SUBSTR(ssp.createdat, 1, 10)) >= DATE_ADD('MONTH', -1, CURRENT_DATE)
                    AND (ssp.clientid = ${sub});
                `;
        formData.append('query', query);
        return this._http.post(this.baseURL+'/athenaquery', formData, this.httpOptions);
    }

    distinctDevices(sub: string, yearstr: string){
        let formData = new FormData();
        let query = `
                SELECT DISTINCT ssp.uniqueid
                FROM "simple2db"."simple2_parquet" AS ssp
                WHERE ssp.partition_0 = '${yearstr}' AND (ssp.clientid = ${sub});
                `;
        formData.append('query', query);
        return this._http.post(this.baseURL+'/athenaquery', formData, this.httpOptions);
    }

    distinctDatesMonth(sub: string){
        let formData = new FormData();
        let query = `
                SELECT DISTINCT SUBSTR(ssp.createdat, 1, 10)
                FROM "simple2db"."simple2_parquet" AS ssp
                WHERE DATE(SUBSTR(ssp.createdat, 1, 10)) >= DATE_ADD('MONTH', -1, CURRENT_DATE)
                    AND (ssp.clientid = ${sub})
                ORDER BY SUBSTR(ssp.createdat, 1, 10);
                `;
        formData.append('query', query);
        return this._http.post(this.baseURL+'/athenaquery', formData, this.httpOptions);
    }

    distinctDates(sub: string, yearstr: string){
        let formData = new FormData();
        let query = `
                SELECT DISTINCT SUBSTR(ssp.createdat, 1, 10)
                FROM "simple2db"."simple2_parquet" AS ssp
                WHERE ssp.partition_0 = '${yearstr}' AND (ssp.clientid = ${sub})
                ORDER BY SUBSTR(ssp.createdat, 1, 10);
                `;
        formData.append('query', query);
        return this._http.post(this.baseURL+'/athenaquery', formData, this.httpOptions);
    }

    distinctDevicesDate(sub: string, datestr: string){
        let formData = new FormData();
        let query = `
                SELECT DISTINCT ssp.uniqueid
                FROM "simple2db"."simple2_parquet" AS ssp
                WHERE SUBSTR(ssp.createdat, 1, 10) = '${datestr}' AND (ssp.clientid = ${sub});
                `;
        formData.append('query', query);
        return this._http.post(this.baseURL+'/athenaquery', formData, this.httpOptions);
    }

    dateMsgDevices(sub: string, datestr: string) {
        let formData = new FormData();
        let query = `
            SELECT ssp.uniqueid AS devices, count(uniqueid) AS messages
            FROM "simple2db"."simple2_parquet" AS ssp
            WHERE SUBSTR(ssp.createdat, 1, 10) = '${datestr}' AND (ssp.clientid = ${sub})
            GROUP BY uniqueid
            `;
        formData.append('query', query);
        return this._http.post(this.baseURL+'/athenaquery', formData, this.httpOptions);
    }


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
