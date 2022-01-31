import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { APIService, Campaign } from 'app/API.service';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { CampaignService } from '../../campaign.service';

@Component({
    selector: 'app-campaign-list',
    templateUrl: './campaign-list.component.html',
    styleUrls: ['./campaign-list.component.scss'],
})
export class CampaignListComponent implements OnInit, OnDestroy {

    clientId$: Observable<any[]>;
    campaigns$: Observable<any[]>;
    nextPage$: Observable<any[]>;

    campaignsCount: number = 0;
    clientId: string;
    newItem: any;
    campaignTableColumns: string[] = [
        'name',
        'target',
        'groupId',
        'message',
        'status',
        'controls',
    ];

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private _campaignService: CampaignService,
        private _changeDetectorRef: ChangeDetectorRef,
        private api: APIService,
    ) {}

    async ngOnInit(): Promise<void> {
        /**
         * Get Campaigns
         */
         this.campaigns$ = this._campaignService.campaigns$;
         this.nextPage$ = this._campaignService.nextPage$;
         this.clientId$ = this._campaignService.clientId$;
         this._campaignService.clientId$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((clientIdin) => {
                this.clientId = clientIdin;
                this._changeDetectorRef.markForCheck();
            });

        /**
         * get campaigns
         */
        this._campaignService.campaigns$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((campaigns: any[]) => {
                // Update the counts
                this.campaignsCount = campaigns.length;
                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        /**
         *
         */
        this.api.OnUpdateCampaignListener.subscribe((msg) => {
            const data = msg.value.data;
            const newCampaign: Campaign = data['onUpdateCampaign'];
            console.log('Subscriber New', data);
            this.newItem = newCampaign;
            this._changeDetectorRef.detectChanges();
            this.onUpdateRefreshDataset(newCampaign);
        });
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    /**
     * Update data in UI
     * @param newCampaign
     */
    onUpdateRefreshDataset(newCampaign: Campaign): void {
        this.campaigns$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((camps: Campaign[]) => {
                camps.forEach((camp: Campaign) => {
                    if (camp.id === newCampaign.id) {
                        for (const property in camp) {
                            camp[property] = newCampaign[property];
                        }
                    }
                });
            });
    }
}
