import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
    APIService,
    Campaign,
    CampaignStatus,
    CreateCampaignInput,
    CreateCampaignMutation,
    CreateCampaignTargetInput,
    CreateCampaignTargetMutation,
    EntityStatus,
    Group,
    ListGroupsQuery,
    ListRecipientsQuery,
    ModelCampaignFilterInput,
    ModelCampaignTargetFilterInput,
    ModelGroupFilterInput,
    ModelRecipientFilterInput,
    ModelSortDirection,
    SearchableRecipientFilterInput,
    SearchableRecipientSortableFields,
    SearchableRecipientSortInput,
    SearchableSortDirection,
    SearchRecipientsQuery,
    SubsStatus,
    UpdateCampaignInput, UpdateCampaignMutation,
} from 'app/API.service';
import { AuthService } from 'app/core/auth/auth.service';
import { Hub, Logger } from 'aws-amplify';
import { BehaviorSubject, forkJoin, Observable, of, throwError } from 'rxjs';
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
    private _labels: BehaviorSubject<Group[] | null> = new BehaviorSubject(null);
    private _campaign: BehaviorSubject<any[] | null> = new BehaviorSubject(null);
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
    get campaign$(): Observable<any[]>
    {
        return this._campaign.asObservable();
    }
    get nextPage$(): Observable<any>
    {
        return this._pageChange.asObservable();
    }
    get clientId$(): Observable<any>
    {
        return this._clientId.asObservable();
    }
    get labels$(): Observable<any[]> {
        return this._labels.asObservable();
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
        this.nextToken = null;
        this._pageChange.next(this.nextToken);
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
        of(this.getRecipients(searchTxt, nextPageToken));
    }

    goNextPage(searchTxt: string, nextPageToken: string) {
        of(this.getCampaigns(searchTxt, nextPageToken));
    }

    async searchRecipients(searchTxt?: string, nextToken?: string, arrGroups?: any[]): Promise<any> {
        this.activateProgressBar();
        const { sub } = await this._auth.checkClientId();
        const arrGroupIds = [];
        let filter: SearchableRecipientFilterInput =  {
            clientId: { eq: sub},
            phone: { wildcard: searchTxt},
            phoneTxt: {wildcard: searchTxt}
        };
        if(arrGroups) {
            arrGroups.forEach((item) => {
                arrGroupIds.push({groupId: {eq: item.id}});
            });
            filter = {
                ...filter,
                or: arrGroupIds
            };
        }
        const sortCriteria: SearchableRecipientSortInput= {
            field: SearchableRecipientSortableFields.phone,
            direction: SearchableSortDirection.asc
        };
        return new Promise((resolve, reject) => {
            this.api.SearchRecipients(filter, sortCriteria, this.pageSizeRecips)
                .then((result: SearchRecipientsQuery) => {
                    this.nextTokenRecips = !_.isEmpty(result['nextToken']) ? result['nextToken'] : null;
                    this._pageChangeRecips.next(this.nextTokenRecips);
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


    async getRecipients(filterTxt?: string, nextToken?: string): Promise<any> {
        this.activateProgressBar();
        const { sub } = await this._auth.checkClientId();
        const filterRecips: ModelRecipientFilterInput =  {
            clientId: { eq: sub},
        };
        if (filterTxt !== undefined && filterTxt) {
            filterRecips['and'] = [{groupId: {eq: filterTxt}}];
        }
        this.nextTokenRecips = nextToken ? nextToken : null;
        return new Promise((resolve, reject) => {
            this.api.ListRecipients(filterRecips, this.pageSizeRecips, this.nextTokenRecips)
                .then((result: ListRecipientsQuery) => {
                    this.nextTokenRecips = !_.isEmpty(result['nextToken']) ? result['nextToken'] : null;
                    this._pageChangeRecips.next(this.nextTokenRecips);
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


    async getCampaigns(searchTxt?: string, nextToken?: string): Promise<any> {
        this.activateProgressBar('on');
        const {sub} = await this._auth.checkClientId();
        let filter: ModelCampaignFilterInput = {
            clientId: { eq: sub }
        };
        if (searchTxt !== undefined && searchTxt) {
            filter = {
                clientId: {eq: sub},
                or:[
                    {name: {contains: searchTxt}},
                    {message: {contains: searchTxt}}
                ]
            };
        }
        this.nextToken = nextToken ? nextToken : null;
        return new Promise((resolve, reject) => {
           this.api.AllCampaignsByClientId(sub, null, ModelSortDirection.DESC, null, this.pageSize, this.nextToken)
           // this.api.ListCampaigns(filter, this.pageSize, this.nextToken)
                .then((result) => {
                    this.nextToken = !_.isEmpty(result['nextToken']) ? result['nextToken'] : null;
                    this._pageChange.next(this.nextToken);
                    if(!nextToken) {this._campaigns.next(null);}
                    this._campaigns.next(result.items);
                    this.activateProgressBar('off');
                    resolve(result.items.length);
                })
                .catch((err) => {
                    this.catchErrorLocal(err);
                    this.activateProgressBar('off');
                    reject(err);
                });
        });
    }

    async searchCampaigns(searchTxt?: string, nextToken?: string): Promise<any> {
        this.activateProgressBar();
        const { sub } = await this._auth.checkClientId();
        if (searchTxt.length===0) {
            return this.refresh();
        }
        const filter: ModelCampaignFilterInput = {
            name: { contains: searchTxt}
        };
        const sortDirection = ModelSortDirection.DESC;
        return new Promise((resolve, reject) => {
            this.api.AllCampaignsByClientId(sub, null, sortDirection, filter, 10, null)
                .then((result) => {
                    this.nextToken = null;
                    this._pageChange.next(this.nextToken);
                    this._campaigns.next(null);
                    this._campaigns.next(result.items);
                    this.activateProgressBar('off');
                })
                .catch((err) => {
                    this.activateProgressBar('off');
                    this.catchErrorHttp(err);
                    reject(err);
                });
        });
    }


    async getCampaignById(id: string): Promise<any>  {
        this.activateProgressBar('on');
        const {sub} = await this._auth.checkClientId();
        this._clientId.next(sub);
        const filter: ModelCampaignFilterInput = {
            id: { eq: id }
        };
        return new Promise((resolve, reject) => {
            this.api.ListCampaigns(filter, null, null)
                .then((result) => {
                    this._campaign.next(result.items);
                    this.activateProgressBar('off');
                    resolve(result.items.length);
                })
                .catch((err) => {
                    this.catchErrorLocal(err);
                    this.activateProgressBar('off');
                    reject(err);
                });
        });
    }


    async getCampaignsTarget(campId: string, searchTxt?: string, nextToken?: string): Promise<any> {
        this.activateProgressBar();
        const filter: ModelCampaignTargetFilterInput = {
            campaignId: {eq: campId}
        };
        // this.nextTokenTarget = nextToken ? nextToken : null;
        return new Promise((resolve, reject) => {
           this.api.ListCampaignTargets(filter, null, null)
                .then((result) => {
                    // this.nextTokenTarget = !_.isEmpty(result['nextToken']) ? result['nextToken'] : null;
                    // this._pageChangeTarget.next(this.nextTokenTarget);
                    const notDeleted = result.items.filter(item => item._deleted !== true);
                    this._campaignsTarget.next(null);
                    this._campaignsTarget.next(notDeleted);
                    resolve(notDeleted.length);
                    // resolve(notDeleted);
                    this.activateProgressBar('off');
                })
                .catch((err) => {
                    this.catchErrorLocal(err);
                    reject(err);
                    this.activateProgressBar('off');
                });

        });
    }


    async createCampaign(_payload: CreateCampaignInput): Promise<CreateCampaignMutation> {
        this.activateProgressBar();
        const dateAt = new Date().toISOString();
        return new Promise((resolve, reject) => {
            _payload['lastProcessDt'] = dateAt;
            _payload['status'] = SubsStatus.ACTIVE;
            _payload['metadata'] = '';
            this.api
                .CreateCampaign(_payload)
                .then((resp: CreateCampaignMutation) => {
                    resolve(resp);
                    this.activateProgressBar('off');
                })
                .catch((error: any) => {
                    this.catchErrorLocal(error);
                    reject(error.message);
                    this.activateProgressBar('off');
                });
        });
    }


    async createCampaignTarget(_payload: CreateCampaignTargetInput): Promise<CreateCampaignTargetMutation> {
        return new Promise((resolve, reject) => {
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

    scheduledCampaign(payload: any): Observable<any> {
        const endPoint = `${this.baseURL}/campaign/scheduled`;
        const headers = this.httpHeaders;
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
                cStatus: CampaignStatus.PAUSE,
                _version: campaign._version,
            };
            this.api.UpdateCampaign(payload)
                .then((result: any) => {
                    this.getCampaigns();
                }).then((result: any) => {
                    resolve(result);
                })
                .catch((error) => {
                    this.catchErrorLocal(error);
                    reject(error);
                });
        });
    }

    allCampaignStatus(campaigns: Campaign[], status: SubsStatus): Observable<any> {
        const allCampaigns = [];
        campaigns.forEach((item) => {
            allCampaigns.push(this.campaignStatus(item, status));
        });
        return forkJoin(allCampaigns);
    }

    deleteMultipleCampaigns(campaigns: Campaign[]): Observable<any> {
        const campaignsArr = [];
        campaigns.forEach((item) => {
            campaignsArr.push(this.deleteCampaign(item));
        });
        return forkJoin(campaignsArr);
    }

    clearCampaignTargets(): void {
        this._campaignsTarget.next(null);
    }

    // Get groups
    async searchGroups(searchTxt?: string, nextToken?: string): Promise<any> {
        const { sub } = await this._auth.checkClientId();
        const filter: ModelGroupFilterInput = {
            clientId: { eq: sub },
            name: { contains: searchTxt },
            status: { eq: EntityStatus.ACTIVE }
        };
        return new Promise((resolve, reject) => {
            this.api
                .ListGroups(filter)
                .then((result: ListGroupsQuery) => {
                    const notDeleted = result.items.filter(
                        item => item._deleted !== true);
                    this._labels.next(notDeleted);
                    resolve(notDeleted.length);
                })
                .catch((error: any) => {
                    this.catchErrorHttp(error);
                    reject(error.message);
                });
        });
    }

    async deleteCampaign(campaign: Campaign): Promise<any> {
        this.activateProgressBar('on');
        return new Promise((resolve, reject) => {
            const payload: UpdateCampaignInput = {
                id: campaign.id,
                archive: true
            };
            this.api.UpdateCampaign(payload)
                .then((resp: UpdateCampaignMutation) => {
                    this.getCampaigns();
                    resolve(resp);
                    this.activateProgressBar('off');
                })
                .catch((error: any) => {
                    this.catchErrorLocal(error);
                    reject(error.message);
                    this.activateProgressBar('off');
                });
        });
    }

    activateProgressBar(active = 'on'): void {
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
