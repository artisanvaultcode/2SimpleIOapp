import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { APIService, Campaign, Group } from 'app/API.service';
import { Observable, of, Subject } from 'rxjs';
import { debounceTime, switchMap, takeUntil } from 'rxjs/operators';

import { CampaignService } from '../../campaign.service';
import { MsgsService } from '../../../messages/messages.service';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { Hub } from 'aws-amplify';
import { FormControl } from '@angular/forms';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { WizardComponent } from '../wizard/wizard.component';

@Component({
    selector: 'app-campaign-list',
    templateUrl: './campaign-list.component.html',
    styleUrls: ['./campaign-list.component.scss'],
})
export class CampaignListComponent implements OnInit, OnDestroy {

    clientId$: Observable<any[]>;
    nextPage$: Observable<any[]>;
    labels$: Observable<Group[]>;
    campaigns = new MatTableDataSource<Campaign>();
    isLoading: boolean = false;
    startDate: any;
    endDate: any;
    selection = new SelectionModel<Campaign>(true, []);

    groupDict = {};
    campaignsArray: Campaign[] = [];
    campaignsCount: number = 0;
    clientId: string;
    searchInputControl: FormControl = new FormControl();
    campaignTableColumns: string[] = [
        'select',
        'id',
        'title',
        'target',
        'message',
        'status',
        'execution',
        'controls',
    ];

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private _campaignService: CampaignService,
        private _changeDetectorRef: ChangeDetectorRef,
        private api: APIService,
        private _msgsService: MsgsService,
        private _bottomSheet: MatBottomSheet,
    ) {}

    ngOnInit(): void {
         this.nextPage$ = this._campaignService.nextPage$;
         this.clientId$ = this._campaignService.clientId$;
         this.labels$ = this._msgsService.labels$;

        this._campaignService.campaigns$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((campaigns: any[]) => {
                if (campaigns === null || campaigns.length===0) {
                    this.campaigns.data = [];
                }
                if(campaigns && campaigns.length > 0) {
                    campaigns.forEach(item => this.campaigns.data.push(item));
                    this.campaigns._updateChangeSubscription();
                }
                this.selection.clear();
                // this.campaigns._updateChangeSubscription();
                // Update the counts
                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        /*this.api.OnUpdateCampaignListener.subscribe((msg) => {
            const data = msg.value.data;
            const newCampaign: Campaign = data['onUpdateCampaign'];
            this.newItem = newCampaign;
            this.onUpdateRefreshDataset(newCampaign);
            this._changeDetectorRef.markForCheck();
        });*/

        Hub.listen('processing', (data) => {
            if (data.payload.event === 'progressbar') {
                this.isLoading = data.payload.data.activate === 'on';
                // this._changeDetectorRef.markForCheck();
            }
        });

        // this._msgsService.getLabels()
        //     .then(resp => console.log('Nro. de  grupos', resp))
        //     .catch(error => console.log('Error: ', error));

        // this.groupToDict();

        // Subscribe to search input field value changes
        this.searchInputControl.valueChanges
            .pipe(
                takeUntil(this._unsubscribeAll),
                debounceTime(500),
                switchMap((query: string) => of(this._campaignService.searchCampaigns(query)))
            )
            .subscribe();
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    /**
     * Update data in UI
     *
     * @param newCampaign
     */
    /*onUpdateRefreshDataset(newCampaign: Campaign): void {
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
    }*/

    gotoNextPage(nextPage): void {
        this._campaignService.goNextPage(null, nextPage);
    }

    /*groupToDict() {
        this.labels$.subscribe((grps: Group[]) => {
            if (grps !== null) {
                grps.forEach((grp: Group) => {
                    this.groupDict[grp.id] = grp.name;
                });
            }
        });
    }*/

    /** Whether the number of selected elements matches the total number of rows. */
    isAllSelected(): boolean {
        const numSelected = this.selection.selected.length;
        const numRowsMinusExcluded = this.campaigns.data
            .filter(row => !(row._deleted || row.archive))
            .length;
        return numSelected === numRowsMinusExcluded;
    }

    /** Selects all rows if they are not all selected; otherwise clear selection. */
    masterToggle(): any {
        if (this.isAllSelected()) {
            this.selection.clear();
            return;
        }
        this.campaigns.data.forEach((row) => {
            if (!(row._deleted || row.archive)) {
                this.selection.select(row);
            }
        });
    }

    /** The label for the checkbox on the passed row */
    checkboxLabel(row?: Campaign): string {
        if (!row) {
            return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
        }
        return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id}`;
    }

    openStepper(): void {
        const bottomSheetRef = this._bottomSheet.open(WizardComponent, {
            panelClass: 'full-width',
        });
        bottomSheetRef.afterDismissed().subscribe((data) => {});
    }

    copyStepper(campaign: Campaign): void {
        const bottomSheetRef = this._bottomSheet.open(WizardComponent, {
            panelClass: 'full-width',
            data: campaign
        });
        bottomSheetRef.afterDismissed().subscribe((data) => {});
    }

}
