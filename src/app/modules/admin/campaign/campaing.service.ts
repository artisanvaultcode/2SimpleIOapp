import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { APIService } from 'app/API.service';
import { AuthService } from 'app/core/auth/auth.service';
import { Logger } from 'aws-amplify';
import { BehaviorSubject, Observable } from 'rxjs';


@Injectable({
    providedIn: 'root',
})
export class CampaingService {

    // Private
    private logger = new Logger(' [CampaignService] ');
    private _campaigns: BehaviorSubject<any[] | null> = new BehaviorSubject(null);

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


    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------
    refresh(): void {
        //of(this.getCampaigns());
    }

    async getCampaigns(searchTxt?: string, nextToken?: string) {
        const {sub} = await this._auth.checkClientId();
        /* let filter: ModelCampaignFilterInput = {
            clientId: { eq: sub }
        }; */
    }
}
