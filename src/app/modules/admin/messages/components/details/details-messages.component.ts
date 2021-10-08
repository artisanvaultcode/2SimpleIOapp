import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { debounceTime, switchMap, takeUntil } from 'rxjs/operators';
import { Observable, of, Subject } from 'rxjs';
import {Label, Note} from '../../messages.types';
import {MsgsService} from '../../messages.service';
import { EntityStatus, Group, MsgTemplate, MsgToGroup, TemplateUsage } from 'app/API.service';
import { AuthService } from 'app/core/auth/auth.service';
import _lodash from 'lodash';

export type MsgtogrpNames = MsgToGroup & {
    namegroup?: string;
}

@Component({
    selector       : 'messages-details',
    templateUrl    : './details-messages.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DetailsMessagesComponent implements OnInit, OnDestroy
{
    note$: Observable<MsgTemplate>;
    msgtogroups$: Observable<MsgtogrpNames[]>;
    labels$: Observable<Label[]>;

    noteChanged: Subject<MsgTemplate> = new Subject<MsgTemplate>();
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    clientid: string;
    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        @Inject(MAT_DIALOG_DATA) private _data: { note: Note },
        private _notesService: MsgsService,
        private _matDialogRef: MatDialogRef<DetailsMessagesComponent>,
        private _auth: AuthService,
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        // Client Id
        this.getClientId();
        // Edit
        if ( this._data.note.id ) {
            this.note$ = this._notesService.note$;
            // Request the data from the server
            this._notesService.getMessageById(this._data.note.id).subscribe();
            console.log("note$", this.note$);
            // Get the note
            //this.note$ = this._notesService.note$;
        }
        // Add
        else
        {
            // Create an empty note
            const note: MsgTemplate = {
                id: null,
                name: '',
                message: '',
                status: EntityStatus.ACTIVE,
                default: TemplateUsage.NONE,
                _version: 0,
                __typename: 'MsgTemplate',
                _lastChangedAt: 0,
                createdAt: '',
                updatedAt: ''
            };

            this.note$ = of(note);
        }

        // Get the labels
        this.labels$ = this._notesService.labels$;
        // Get Msg to Groups
        this.msgtogroups$ = this._notesService.msgtogroups$;

        // Subscribe to note updates
        this.noteChanged
            .pipe(
                takeUntil(this._unsubscribeAll),
                debounceTime(500),
                switchMap(note => this._notesService.updateNote(note)))
            .subscribe(() => {

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
    }

    async getClientId(){
        const { sub } = await this._auth.checkClientId();
        this.clientid = sub;
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
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
    createNote(note: MsgTemplate): void
    {
        
        note.clientId = this.clientid;
        this._notesService.createNote(note)
            .then((resp: MsgTemplate) => {
                // Close the dialog
                this._matDialogRef.close();
                console.log("Creado...", resp)
            })
            .catch(err => console.log("Error MsgService - Create...", err));
        /* this._notesService.createNote(note).pipe(
            map(() => {
                // Get the note
                this.note$ = this._notesService.note$;
            })).subscribe(); */
    }

    /**
     * Is the given note has the given label
     *
     * @param note
     * @param label
     */
    isNoteHasLabel(msgtemplate: MsgTemplate, group: Group ): boolean
    {
        let foundmsg = true;
        this.msgtogroups$.subscribe(msgtos => {
            const msgst = msgtos.find(item => item.msgID === msgtemplate.id && item.groupID === group.id)
            foundmsg = !_lodash.isEmpty(msgst);
        })
        return foundmsg;
    }

    /**
     * Toggle the given label on the given note
     *
     * @param note
     * @param label
     */
    toggleLabelOnNote(msgtemplate: MsgTemplate, group: Group): void {
        // If the msgtemplate already has the group
        if ( this.isNoteHasLabel(msgtemplate, group) ) {
            /* msgtemplate.labels = msgtemplate.labels.filter(item => item.id !== group.id); */
            this._notesService.deleteMsgToGroup(group, msgtemplate)
                .then(() => this._matDialogRef.close())
                .catch(error => console.log(error));
        }
        // Otherwise
        else {
            //add msgtogroup
            this._notesService.insertMsgToGrp(msgtemplate, group)
                .then(() => this._matDialogRef.close())
                .catch(error => console.log(error));
        }
        // Update the note
        this.noteChanged.next(msgtemplate);
    }

    toggleGroupOnNote(msg2grp: MsgToGroup): void {
        console.log("toggleGroupOnNote...", msg2grp);
        this._notesService.delMsgToGroup(msg2grp)
            .then(() => this._matDialogRef.close())
            .catch(error => console.log(error));
    }

    /**
     * Toggle archived status on the given note
     *
     * @param note
     */
    toggleArchiveOnNote(note: MsgTemplate): void
    {
        if (note.status === EntityStatus.ACTIVE) {
            note.status = EntityStatus.INACTIVE;
        } else if (note.status === EntityStatus.INACTIVE) {
            note.status = EntityStatus.ACTIVE;
        }

        // Update the note
        this.noteChanged.next(note);

        // Close the dialog
        this._matDialogRef.close();
    }

    /**
     * Update the note details
     *
     * @param note
     */
    updateNoteDetails(note: MsgTemplate): void
    {
        this.noteChanged.next(note);
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
        this.msgtogroups$.subscribe(resp => {
            filmsg2grp = resp.filter(
                (f) => note.id === f.msgID
            )
        });
        if (filmsg2grp.length>0){
            for (let item of filmsg2grp){
                this.toggleGroupOnNote(item);
            }
        }
        this._notesService.deleteNote(note)
            .then
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

    /**
     * Read the given file for demonstration purposes
     *
     * @param file
     */
    private _readAsDataURL(file: File): Promise<any>
    {
        // Return a new promise
        return new Promise((resolve, reject) => {

            // Create a new reader
            const reader = new FileReader();

            // Resolve the promise on success
            reader.onload = () => {
                resolve(reader.result);
            };

            // Reject the promise on error
            reader.onerror = (e) => {
                reject(e);
            };

            // Read the file as the
            reader.readAsDataURL(file);
        });
    }

    getGroups(id: string) {
        let flabt;
        this.msgtogroups$.subscribe(resp => {
            flabt = resp.filter(
                (f) => id === f.msgID
            )
        })
        return flabt;
    }
}
