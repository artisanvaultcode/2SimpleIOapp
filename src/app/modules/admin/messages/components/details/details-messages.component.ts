import { ChangeDetectionStrategy, Component, Inject, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable, Subject } from 'rxjs';
import {MsgsService} from '../../messages.service';
import {MsgTemplate} from '../../../../../API.service';
import {MessageModel} from '../../models/MessageModel';
import {takeUntil} from 'rxjs/operators';

@Component({
    selector       : 'messages-details',
    templateUrl    : './details-messages.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DetailsMessagesComponent implements OnInit, OnDestroy
{
    msgTemplate: MessageModel;
    currentMessage$: Observable<any>;
    detailsChanged: Subject<MessageModel> = new Subject<MessageModel>();
    saveOrCreate: boolean;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        @Inject(MAT_DIALOG_DATA) private _data: { message: MessageModel; action: string },
        private _msgsService: MsgsService,
        private _matDialogRef: MatDialogRef<DetailsMessagesComponent>
    )
    {
        this.saveOrCreate = false;
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.currentMessage$ = this._msgsService.messageTemplate$;
        // Details changed in the form
        this.detailsChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((result) => {
                this.saveOrCreate = true;
            });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------
    /**
     * Create a new note
     *
     * @param note
     */
    createMessage(msg: MessageModel): void
    {
        this._msgsService.createMessage(msg)
            .then((resp: MsgTemplate) => {
                this._msgsService.refreshMessages();
                this._matDialogRef.close();
            })
            .catch(err => console.log('Error MsgService - Create...', err));
    }

    /**
     * Update the note details
     *
     * @param note
     */
    onUpdateMessageDetails(msg: MsgTemplate): void
    {
        this.detailsChanged.next(msg);
    }
    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any
    {
        return item.id || index;
    }
}
