import { ListRecipientsQuery } from './../../../API.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
    APIService, CreateCampaignInput,
    ModelCampaignFilterInput,
    SubsStatus, UpdateCampaignInput,
    CreateCampaignMutation, Campaign, CampaignTarget,
    ModelCampaignTargetFilterInput,
    CreateCampaignTargetInput,
    CreateCampaignTargetMutation,
    ModelRecipientFilterInput, } from 'app/API.service';
import { AuthService } from 'app/core/auth/auth.service';
import { Hub, Logger } from 'aws-amplify';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import * as _ from 'lodash';
import { environment } from 'environments/environment';
import { catchError, retry } from 'rxjs/operators';
import { ModelStringInput } from '../../../API.service';

@Injectable({
    providedIn: 'root',
})
export class CampaignService {

    // Private
    private logger = new Logger(' [CampaignService] ');
    private _campaigns: BehaviorSubject<any[] | null> = new BehaviorSubject(null);
    private _pageChange: BehaviorSubject<any | null> = new BehaviorSubject(null);
    private _clientId: BehaviorSubject<any | null> = new BehaviorSubject(null);
    private _campaignsTarget: BehaviorSubject<any[] | null> = new BehaviorSubject(null);
    private _pageChangeTarget: BehaviorSubject<any | null> = new BehaviorSubject(null);
    private _recipients: BehaviorSubject<any[] | null> = new BehaviorSubject(null);

    private baseURL = environment.backendurl;
    private httpHeaders = new HttpHeaders({
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
    });

    pageSize: number;
    nextToken: string = null;
    nextTokenTarget: string = null;

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
    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------
    refresh(): void {
        of(this.getCampaigns());
    }

    refreshTarget(campId): void {
        of(this.getCampaignsTarget(campId));
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
                        this.catchError(err);
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
                        this.catchError(err);
                        reject(err);
                        this.activateProgressBar('off');
                    });

        });
    }


    async createCampaign(camp: Campaign) {
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

    async getCampaignByGroupId(gId: ModelStringInput, nextToken?: string, searchTxt?: string, filterRec?: string): Promise<any> {
        this.activateProgressBar();
        const { sub } = await this._auth.checkClientId();
        const recipFilter: ModelRecipientFilterInput = {
            clientId: sub,
            groupId: gId
        };
        this.nextToken = nextToken ? nextToken : null;
        return new Promise((resolve, reject) => {
            this.api.ListRecipients(recipFilter, this.pageSize, nextToken)
                .then((result: ListRecipientsQuery) => {
                    this.nextToken = !_.isEmpty(result['nextToken']) ? result['nextToken'] : null;
                    this._pageChange.next(this.nextToken);
                    const notDeleted = result.items.filter(item => item._deleted !== true);
                    this._recipients.next(notDeleted);
                    resolve(notDeleted.length);
                    this.activateProgressBar('off');
                })
                .catch(error => {
                    this.catchError(error);
                });
        })
    }

    activateProgressBar(active = 'on') {
        Hub.dispatch('processing', {
            event: 'progressbar',
            data: {
                activate: active,
            },
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
