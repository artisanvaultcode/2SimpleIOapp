import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'environments/environment';

@Injectable({
    providedIn: 'root',
})
export class AthinaService {

    baseURL = environment.backendurl;
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
}
