import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
    APIService, CreateCampaignInput,
    ModelCampaignFilterInput,
    SubsStatus, UpdateCampaignInput,
    CreateCampaignMutation, Campaign,
    ModelCampaignTargetFilterInput,
    CreateCampaignTargetInput,
    CreateCampaignTargetMutation,
    SearchableRecipientFilterInput,
    SearchableRecipientSortableFields,
    SearchableSortDirection,
    SearchableRecipientSortInput,
    SearchRecipientsQuery, } from 'app/API.service';
import { AuthService } from 'app/core/auth/auth.service';
import { Hub, Logger } from 'aws-amplify';
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
    private _pageChangeTarget: BehaviorSubject<any | null> = new BehaviorSubject(null);
    private _pageChangeRecips: BehaviorSubject<any | null> = new BehaviorSubject(null);
    private _clientId: BehaviorSubject<any | null> = new BehaviorSubject(null);
    private _campaignsTarget: BehaviorSubject<any[] | null> = new BehaviorSubject(null);
    private _recipients: BehaviorSubject<any[] | null> = new BehaviorSubject(null);

    private baseURL = environment.backendurl;
    private httpHeaders = new HttpHeaders({
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
    });

    pageSize: number;
    pageSizeRecips: number;
    nextToken: string = null;
    nextTokenTarget: string = null;
    nextTokenRecips: string = null;

    constructor(
        private api: APIService,
        private _auth: AuthService,
        private _http: HttpClient
    ) {
        this.pageSize = 10;
        this.pageSizeRecips = 10;
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

    /**
     * Getter for CampaignTarget
     */
     get campaignTargets$(): Observable<any[]>
     {
         return this._campaignsTarget.asObservable();
     }
     get nextPageTarget$(): Observable<any>
     {
         return this._pageChangeTarget.asObservable();
     }


     /**
     * Getter for recipients
     */
    get recipients$(): Observable<any>
    {
        return this._recipients.asObservable();
    }
    get nextPageRecips$(): Observable<any>
    {
        return this._pageChangeRecips.asObservable();
    }
    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------
    refresh(): void {
        of(this.getCampaigns());
    }

    refreshTarget(campId): void {
        of(this.getCampaignsTarget(campId));
    }
    // ======================================== VER =====================================
    refreshRecips(): void {
        this.nextTokenRecips = null;
        this._pageChangeRecips.next(this.nextTokenRecips);
        // of(this.getCampaignsTarget(campId)); ====================================== VER
    }

    goNextPageRecips(searchTxt: string, nextPageToken: string) {
        of(this.searchRecipients(searchTxt, nextPageToken))
    }

    async searchRecipients(searchTxt?: string, nextToken?: string): Promise<any> {
        this.activateProgressBar();
        const { sub } = await this._auth.checkClientId();
        const searchRecips: SearchableRecipientFilterInput =  {
            clientId: { eq: sub},
        };
        if (searchTxt !== undefined && searchTxt) {
            searchRecips['and'] = [{groupId: {eq: searchTxt}}];
        }
        console.log("[searchRecipients] searchCriteria", searchRecips);
        this.nextTokenRecips = nextToken ? nextToken : null;
        const sortCriteria: SearchableRecipientSortInput= {
            field: SearchableRecipientSortableFields.groupId,
            direction: SearchableSortDirection.asc
        };
        return new Promise((resolve, reject) => {
            this.api.SearchRecipients(searchRecips, sortCriteria, this.pageSizeRecips, this.nextTokenRecips)
                .then((result: SearchRecipientsQuery) => {
                    console.log("[serachREcipients] result", result, "\n\n\n\n");
                    this.nextTokenRecips = !_.isEmpty(result['nextToken']) ? result['nextToken'] : null;
                    console.log("[searchRecipients] nextTokenREcips", this.nextTokenRecips);
                    this._pageChangeRecips.next(this.nextTokenRecips);
                    console.log("[searchRecipients] _pageChangeREcips", this._pageChangeRecips);
                    const notDeleted = result.items.filter(item => item._deleted !== true);
                    this._recipients.next(notDeleted);
                    resolve(notDeleted.length);
                    this.activateProgressBar('off');
                })
                .catch((err) => {
                    this.catchErrorLocal(err);
                    reject(err);
                    this.activateProgressBar('off');
                });
        });
    }


    async getCampaigns(searchTxt?: string, nextToken?: string) {
        this.activateProgressBar();
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
                    this.activateProgressBar('off');
                })
                .catch((err) => {
                    this.catchErrorLocal(err);
                    reject(err);
                    this.activateProgressBar('off');
                });

        });
    }


    async getCampaignsTarget(campId: string, searchTxt?: string, nextToken?: string) {
        this.activateProgressBar();
        let filter: ModelCampaignTargetFilterInput;
        if (searchTxt !== undefined && searchTxt) {
            filter = {
                campaignId: { eq: campId}
            };
        }
        this.nextTokenTarget = nextToken ? nextToken : null;
        return new Promise((resolve, reject) => {
           this.api.ListCampaignTargets(filter, this.pageSize, this.nextTokenTarget)
                .then((result) => {
                    this.nextTokenTarget = !_.isEmpty(result['nextToken']) ? result['nextToken'] : null;
                    this._pageChangeTarget.next(this.nextTokenTarget);
                    const notDeleted = result.items.filter(item => item._deleted !== true);
                    this._campaignsTarget.next(notDeleted);
                    resolve(notDeleted.length);
                    this.activateProgressBar('off');
                })
                .catch((err) => {
                    this.catchErrorLocal(err);
                    reject(err);
                    this.activateProgressBar('off');
                });

        });
    }


    async createCampaign(_payload: CreateCampaignInput) {
        this.activateProgressBar();
        const dateAt = new Date().toISOString();
        const { sub } = await this._auth.checkClientId();
        return new Promise((resolve, reject) => {
            _payload['lastProcessDt'] = dateAt;
            _payload['status'] = SubsStatus.ACTIVE;
            _payload['metadata'] = '';
            this.api
                .CreateCampaign(_payload)
                .then((resp: CreateCampaignMutation) => {
                    resolve(resp)
                    this.activateProgressBar('off');
                })
                .catch((error: any) => {
                    this.catchErrorLocal(error);
                    reject(error.message);
                    this.activateProgressBar('off');
                });
        });
    }


    async createCampaignTarget(campId: string, recipId: string) {
        const dateAt = new Date().toISOString();
        return new Promise((resolve, reject) => {
            const _payload: CreateCampaignTargetInput = {
                id: null,
                campaignId: campId,
                recipientId: recipId,
                lastProcessDt: dateAt,
                status: SubsStatus.ACTIVE,
                campaignTargetRecipientId: recipId
            };
            this.api
                .CreateCampaignTarget(_payload)
                .then((resp: CreateCampaignTargetMutation) => {
                    resolve(resp);
                })
                .catch((error: any) => {
                    this.catchErrorLocal(error);
                    reject(error.message);
                });
        });
    }


    sendCampaign(campaign: CreateCampaignMutation): Observable<any> {
        const endPoint = `${this.baseURL}/campaign/send`;
        const headers = this.httpHeaders;
        const payload = {
            id: campaign.id,
            clientId: campaign.clientId,
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

    scheduledCampaign(clientId: string, campaign: CreateCampaignMutation,
        hours: number, dateMin: any, dateMax: any, hour: number,
        minutes: number, hourSchedRange: string): Observable<any> {
        const endPoint = `${this.baseURL}/campaign/scheduled`;
        const headers = this.httpHeaders;
        const payload = {
            id: campaign.id,
            clientId: clientId,
            name: campaign.name,
            target: campaign.target,
            groupId: campaign.groupId,
            hoursched: hourSchedRange
        };
        if (hourSchedRange === 'hours') {
            payload['hours'] = hours;
        }
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
                    this.catchErrorLocal(error);
                    reject(error);
                });
        });
    }

    activateProgressBar(active = 'on') {
        Hub.dispatch('processing', {
            event: 'progressbar',
            data: {
                activate: active,
            },
        });
    }

    private catchErrorLocal(error): void {
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
