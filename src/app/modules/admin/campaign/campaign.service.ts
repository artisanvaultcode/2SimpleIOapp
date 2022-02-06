import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
    APIService, CreateCampaignInput,
    ModelCampaignFilterInput,
    SubsStatus, UpdateCampaignInput,
    CreateCampaignMutation, Campaign, } from 'app/API.service';
import { AuthService } from 'app/core/auth/auth.service';
import { Logger } from 'aws-amplify';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import * as _ from 'lodash';
import { environment } from 'environments/environment';
import { catchError, retry } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class CampaignService {

    // Private
    private logger = new Logger(' [CampaignService] ');
    private _campaigns: BehaviorSubject<any[] | null> = new BehaviorSubject(null);
    private _pageChange: BehaviorSubject<any | null> = new BehaviorSubject(null);
    private _clientId: BehaviorSubject<any | null> = new BehaviorSubject(null);
    private baseURL = environment.backendurl;
    private httpHeaders = new HttpHeaders({
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
    });

    pageSize: number;
    nextToken: string = null;

    constructor(
        private api: APIService,
        private _auth: AuthService,
        private _http: HttpClient
    ) {
        this.pageSize = 10;
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for campaigns
     */
    get campaigns$(): Observable<any[]>
    {
        return this._campaigns.asObservable();
    }
    get nextPage$(): Observable<any>
    {
        return this._pageChange.asObservable();
    }
    get clientId$(): Observable<any>
    {
        return this._clientId.asObservable();
    }


    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------
    refresh(): void {
        of(this.getCampaigns());
    }

    async getCampaigns(searchTxt?: string, nextToken?: string) {
        const {sub} = await this._auth.checkClientId();
        this._clientId.next(sub);
        let filter: ModelCampaignFilterInput = {
            clientId: { eq: sub }
        };
        if (searchTxt !== undefined && searchTxt) {
            filter = {
                clientId: { eq: sub},
                or: [{ name: {contains: searchTxt} , message: { contains: searchTxt}}]
            };
        }
        this.nextToken = nextToken ? nextToken : null;
        return new Promise((resolve, reject) => {
           this.api.ListCampaigns(filter, this.pageSize, this.nextToken)
                .then((result) => {
                    this.nextToken = !_.isEmpty(result['nextToken']) ? result['nextToken'] : null;
                    this._pageChange.next(this.nextToken);
                    const notDeleted = result.items.filter(item => item._deleted !== true);
                    this._campaigns.next(notDeleted);
                    resolve(notDeleted.length);
                })
                .catch((err) => {
                        this.catchError(err);
                        reject(err);
                    });

        });
    }

    async createCampaign(camp: Campaign) {
        console.log("Add new Campaign");
        const dateAt = new Date().toISOString();
        const { sub } = await this._auth.checkClientId();
        return new Promise((resolve, reject) => {
            const _payload: CreateCampaignInput = {
                id: null,
                clientId: sub,
                name: camp.name,
                target: camp.target,
                groupId: camp.groupId,
                message: camp.message,
                lastProcessDt: dateAt,
                metadata: camp.metadata,
                status: SubsStatus.ACTIVE
            };
            this.api
                .CreateCampaign(_payload)
                .then((resp: CreateCampaignMutation) => resolve(resp))
                .catch((error: any) => {
                    this.catchError(error);
                    reject(error.message);
                });
        });
    }

    sendCampaign(clientId: string, campaign: CreateCampaignMutation): Observable<any> {
        const endPoint = `${this.baseURL}/campaign/send`;
        const headers = this.httpHeaders;
        const payload = {
            id: campaign.id,
            clientId: clientId,
            name: campaign.name,
            target: campaign.target,
            groupId: campaign.groupId,
        };
        return this._http
            .post<any>(endPoint, JSON.stringify(payload), { headers })
            .pipe(
                retry(1),
                catchError(this.catchErrorHttp)
            );
    }

    campaignStatus(campaign: Campaign, campaignStatus: SubsStatus): Promise<any> {
        const dateAt = new Date().toISOString();
        return new Promise((resolve, reject) => {
            const payload: UpdateCampaignInput = {
                id: campaign.id,
                lastProcessDt: dateAt,
                status: campaignStatus,
                _version: campaign._version,
            };
            this.api.UpdateCampaign(payload)
                .then(result => resolve(result))
                .catch(error => {
                    this.catchError(error);
                    reject(error);
                });
        });
    }

    private catchError(error): void {
        console.log(error);
        this.logger.debug('OOPS!', error);
    }

    private catchErrorHttp(error): any {
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
