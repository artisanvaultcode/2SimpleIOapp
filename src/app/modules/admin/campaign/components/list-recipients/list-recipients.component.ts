import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Hub } from 'aws-amplify';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { RecipientsService } from './../../../recipients/recipients.service';

@Component({
    selector: 'app-list-recipients',
    templateUrl: './list-recipients.component.html',
    styleUrls: ['./list-recipients.component.scss'],
})
export class ListRecipientsComponent implements OnInit {

    recipients$: Observable<any[]>;
    nextPage$: Observable<any[]>;
    searchInputControl: FormControl = new FormControl();

    isLoading: boolean;
    recipientsCount: number = 0;

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private _recipientsService: RecipientsService,
        private _changeDetectorRef: ChangeDetectorRef,
    ) {
        /* setTimeout(() => {
            console.log('markForCheck!');
            this._changeDetectorRef.markForCheck();
        },2000) */

        Hub.listen('processing', (data) => {
            if (data.payload.event === 'progressbar') {
                this.isLoading = data.payload.data.activate === 'on';
                this._changeDetectorRef.markForCheck();
            }
        });
    }

    ngOnInit(): void {
        console.log("[NgOnInit]");
        this.recipients$ = this._recipientsService.recipients$;
        this._recipientsService.pageSize = 6;
        this._recipientsService.getRecipients()
            .then(resp => {
                console.log("Recipients count", resp);
            })
            .catch(error => {
                console.log("Error", error);
            })
        /* this._recipientsService.recipients$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((recipients: any[]) => {
                console.log("[NgOnInit - ListRecipients]", recipients)
                // Mark for check
                this._changeDetectorRef.markForCheck();
            }); */

        this.nextPage$ = this._recipientsService.nextPage$;
    }

    gotoNextPage(nextPage): void {
        this._recipientsService.goNextPage(null, nextPage);
    }

    /* activateProgressBar(active = 'on') {
        Hub.dispatch('processing', {
            event: 'progressbar',
            data: {
                activate: active,
            },
        });
    } */
}
