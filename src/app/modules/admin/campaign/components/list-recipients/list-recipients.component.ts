import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Hub } from 'aws-amplify';
import { Observable, of, Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';

import { CampaignService } from './../../campaign.service';
import { RecipientsService } from './../../../recipients/recipients.service';
import { Recipient } from 'app/API.service';

@Component({
    selector: 'app-list-recipients',
    templateUrl: './list-recipients.component.html',
    styleUrls: ['./list-recipients.component.scss'],
})
export class ListRecipientsComponent implements OnInit {

    @Input() campId: string;

    recipients$: Observable<any[]>;
    nextPage$: Observable<any[]>;
    searchInputControl: FormControl = new FormControl();
    campaignTargets$: Observable<any[]>;

    isLoading: boolean;
    recipientsCount: number = 0;
    recipientTargets: Recipient[] = [];

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private _recipientsService: RecipientsService,
        private _changeDetectorRef: ChangeDetectorRef,
        private _campaignService: CampaignService,
    ) {
        Hub.listen('processing', (data) => {
            if (data.payload.event === 'progressbar') {
                this.isLoading = data.payload.data.activate === 'on';
                this._changeDetectorRef.markForCheck();
            }
        });
    }

    ngOnInit(): void {
        this.recipients$ = this._recipientsService.recipients$;
        this._recipientsService.pageSize = 6;
        this._recipientsService.getRecipients()
            .then(resp => console.log("Recipients count", resp))
            .catch(error => console.log("Error", error));
        this.nextPage$ = this._recipientsService.nextPage$;

        this.campaignTargets$ = this._campaignService.campaignTargets$;
        this._campaignService.getCampaignsTarget(this.campId)
            .then(resp => console.log("CampaignTarget count", resp))
            .catch(error => console.log("Error: ", error));

        this.searchInputControl.valueChanges
            .pipe(
                takeUntil(this._unsubscribeAll),
                switchMap((query) =>
                    // Search
                    of(this._recipientsService.searchRecipients(query))
                )
            )
            .subscribe();
    }

    gotoNextPage(nextPage): void {
        this._recipientsService.goNextPage(null, nextPage);
    }

    addCampaigTarget(recip: Recipient) {
        this.recipientTargets.push(recip);
    }

    removeRecipient(recip) {
        let recipFiltered = this.recipientTargets.filter(recipt => recipt.phone !== recip);
        this.recipientTargets = recipFiltered;
    }
}
