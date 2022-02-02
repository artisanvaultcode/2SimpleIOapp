import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
    APIService, CreateCampaignInput,
    ModelCampaignFilterInput,
    Campaign, SubsStatus } from 'app/API.service';
import { AuthService } from 'app/core/auth/auth.service';
import { Logger } from 'aws-amplify';
import { BehaviorSubject, Observable, of } from 'rxjs';
import * as _ from 'lodash';
import { CreateCampaignMutation } from '../../../API.service';

@Injectable({
    providedIn: 'root',
})
export class CampaignService {

    // Private
    private logger = new Logger(' [CampaignService] ');
    private _campaigns: BehaviorSubject<any[] | null> = new BehaviorSubject(null);
    private _pageChange: BehaviorSubject<any | null> = new BehaviorSubject(null);
    private _clientId: BehaviorSubject<any | null> = new BehaviorSubject(null);

    pageSize: number;
    nextToken: string = null;

    constructor(
        private api: APIService,
        private _auth: AuthService,
        private _httpClient: HttpClient
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

    private catchError(error): void {
        console.log(error);
        this.logger.debug('OOPS!', error);
    }
}
