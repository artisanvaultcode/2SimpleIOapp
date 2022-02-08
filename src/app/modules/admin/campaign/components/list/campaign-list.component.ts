import { DetailsCampaignsComponent } from './../detail/details-campaigns.component';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { APIService, Campaign, Group } from 'app/API.service';
import { Observable, of, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { CampaignService } from '../../campaign.service';
import { MsgsService } from '../../../messages/messages.service';

@Component({
    selector: 'app-campaign-list',
    templateUrl: './campaign-list.component.html',
    styleUrls: ['./campaign-list.component.scss'],
})
export class CampaignListComponent implements OnInit, OnDestroy {

    clientId$: Observable<any[]>;
    campaigns$: Observable<any[]>;
    nextPage$: Observable<any[]>;
    labels$: Observable<Group[]>;

    groupDict = {};
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
        private _matDialog: MatDialog,
        private _msgsService: MsgsService,
    ) {}

    ngOnInit() {
        /**
         * Get Campaigns
         */
         this.campaigns$ = this._campaignService.campaigns$;
         this.nextPage$ = this._campaignService.nextPage$;
         this.clientId$ = this._campaignService.clientId$;
         this.labels$ = this._msgsService.labels$;
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
            this.newItem = newCampaign;
            this.onUpdateRefreshDataset(newCampaign);
            this._changeDetectorRef.markForCheck();
        });

        this._msgsService.getLabels()
            .then(resp => console.log("Nro. de  grupos", resp))
            .catch(error => console.log("Error: ", error));

        this.groupToDict();
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    /**
     * Refresh
     *
     * @param event
     */
     refresh(): void {
        of(this._campaignService.refresh());
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
                        this.refresh();
                    }
                });
            });
    }

    addNewCampaign() {
        const dialogRef = this._matDialog.open(DetailsCampaignsComponent);
        dialogRef.afterClosed()
            .subscribe(result => {
                this.refresh();
            })
    }

    groupToDict() {
        this.labels$.subscribe((grps: Group[]) => {
            if (grps !== null) {
                grps.forEach((grp: Group) => {
                    this.groupDict[grp.id] = grp.name;
                });
            }
        });
    }
}
