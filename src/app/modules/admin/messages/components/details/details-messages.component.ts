import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable, of, Subject } from 'rxjs';
import {Label} from '../../messages.types';
import {MsgsService} from '../../messages.service';
import { AuthService } from 'app/core/auth/auth.service';
import _lodash from 'lodash';
import {MsgTemplate, MsgToGroup} from '../../../../../API.service';
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
    msgtogroups$: Observable<any[]>;
    labels$: Observable<Label[]>;
    labelsByMsgId$: Observable<Label[]>;
    listOfLabels: any[];
    listOfLabelsById: any[];

    detailsChanged: Subject<MessageModel> = new Subject<MessageModel>();
    saveOrCreate: boolean;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        @Inject(MAT_DIALOG_DATA) private _data: { message: MessageModel; action: string },
        private _msgsService: MsgsService,
        private _matDialogRef: MatDialogRef<DetailsMessagesComponent>,
        private _auth: AuthService,
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
        this.msgtogroups$ = this._msgsService.msgtogroups$;
        this.labels$ = this._msgsService.labels$;
        this.labelsByMsgId$ = this._msgsService.labelsByMsgId$;
        this.labels$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((result) => {
                if (result) {
                    this.listOfLabels = result;
                }
            });
        // Current Message new/Edit
        this.currentMessage$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((result) => {
                if (result.id) {
                    of(this._msgsService.getLabelsByMsgId(result.id));
                }
            });
        // all Labels by Msg ID
        this.labelsByMsgId$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((result) => {
                if (result ) {
                    this.listOfLabelsById = result;
                }
            });

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
    createMessage(note: MsgTemplate): void
    {
        this._msgsService.createMessage(note)
            .then((resp: MsgTemplate) => {
                // Close the dialog
                this._matDialogRef.close();
            })
            .catch(err => console.log('Error MsgService - Create...', err));
    }

    /**
     * Is the given has been related to a specific group
     *
     * @param group
     */

    isLabelBeenUsed(group: any ): boolean
    {
        if (this.listOfLabelsById.length === 0) {
            return false;
        }
        const found = this.listOfLabelsById.find(item => item.groupID === group.id);
        return !_lodash.isEmpty(found);;
    }

    /**
     * Toggle the given label on the given note
     *
     * @param note
     * @param label
     */
    toggleLabelOnMessage(msgtemplate: any, group: any): void {
        console.log(msgtemplate,group );
        if ( this.isLabelBeenUsed( group) ) {
            const foundGroup = this.listOfLabelsById.find(item => item.groupID === group.id);
            console.log(foundGroup);
            this._msgsService.detachGroupFromMsg(foundGroup)
                .then((resUpdate) => {
                    console.log(resUpdate);
                })
                .catch(error => console.log(error));
        } else {
            this._msgsService.attachGroupFromMsg(msgtemplate, group)
                .then((resUpdate) => {
                    console.log(resUpdate);
                })
                .catch(error => console.log(error));
        }
    }

    toggleGroupOnNote(msg2grp: MsgToGroup): void {
        console.log('toggleGroupOnNote...', msg2grp);
        this._msgsService.delMsgToGroup(msg2grp)
            .then(() => this._matDialogRef.close())
            .catch(error => console.log(error));
    }

    /**
     * Toggle archived status on the given note
     *
     * @param note
     */
    toggleArchiveMessage(msg: any): void
    {
        this._msgsService.archiveMessage(msg.id)
            .then(() => this._matDialogRef.close())
            .catch(error => console.log(error));
    }
    /**
     * Update the note details
     *
     * @param note
     */
    updateMessage(msg: MsgTemplate): void
    {
        console.log(msg)
    }

    /**
     * Update the note details
     *
     * @param note
     */
    onUpdateMessageDetails(note: MsgTemplate): void
    {
        this.detailsChanged.next(note);
    }

    /**
     * Delete the given note
     *
     * @param note
     */
    deleteNote(note: MsgTemplate): void
    {
        /**
         * Delete MsgToGroup first
         */
        let filmsg2grp: MsgToGroup[];
        this.msgtogroups$.subscribe((resp) => {
            filmsg2grp = resp.filter(
                f => note.id === f.msgID
            );
        });
        if (filmsg2grp.length>0){
            for (const item of filmsg2grp){
                this.toggleGroupOnNote(item);
            }
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        of(this._msgsService.deleteNote(note));
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

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    getGroups(id: string): any {
        let flabt;
        this.msgtogroups$.subscribe((resp) => {
            flabt = resp.filter(
                f => id === f.msgID
            );
        });
        return flabt;
    }
}
