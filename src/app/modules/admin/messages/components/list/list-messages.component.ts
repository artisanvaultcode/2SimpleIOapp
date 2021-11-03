import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import {distinctUntilChanged, filter, map, takeUntil} from 'rxjs/operators';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import {GroupsMessagesComponent} from '../groups/groups-messages.component';
import {DetailsMessagesComponent} from '../details/details-messages.component';
import {MsgsService} from '../../messages.service';
import { AuthService } from 'app/core/auth/auth.service';
import {EntityStatus, Group, MsgTemplate, MsgToGroup} from '../../../../../API.service';
import {MessageModel} from '../../models/MessageModel';
import {Hub} from 'aws-amplify';
import {FuseDrawerService} from '../../../../../../@fuse/components/drawer';
import {MatDrawer} from '@angular/material/sidenav';

@Component({
    selector       : 'messages-list',
    templateUrl    : './list-messages.component.html',
    styleUrls: ['list-messages.component.scss'],
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListMessagesComponent implements OnInit, OnDestroy, AfterViewInit
{
    pbOn: boolean;
    labels$: Observable<Group[]>;
    messages$: Observable<MsgTemplate[]>;
    msgtogroups$: Observable<MsgToGroup[]>;

    drawerMode: 'over' | 'side' = 'side';
    drawerOpened: boolean = true;
    filter$: BehaviorSubject<string> = new BehaviorSubject('messages');
    searchQuery$: BehaviorSubject<string> = new BehaviorSubject(null);
    masonryColumns: number = 4;

    clientid: string;
    currentMsg: MessageModel;

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _fuseDrawerService: FuseDrawerService,
        private _matDialog: MatDialog,
        private _messagesService: MsgsService,
        private _auth: AuthService,
    ) {
        Hub.listen('processing', (data) => {
            if (data.payload.event === 'progressbar') {
                this.pbOn = data.payload.data.activate === 'on';
                console.log(this.pbOn);
                this._changeDetectorRef.detectChanges();
            }
        });

    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get the filter status
     */
    get filterStatus(): string
    {
        return this.filter$.value;
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {

        this.getClientId();

        // Get labels
        this.labels$ = this._messagesService.labels$;
        // Get Msg to Groups
        this.msgtogroups$ = this._messagesService.msgtogroups$;
        // Get notes
        this.messages$ = combineLatest([this._messagesService.messages$, this.filter$, this.searchQuery$]).pipe(
            distinctUntilChanged(),
            map(([lMsgs, filter, searchQuery]) => {

                if ( !lMsgs || !lMsgs.length )
                {
                    return [];
                }

                // Store the filtered notes
                let filteredNotes = lMsgs;

                // Filter by query
                /* if ( searchQuery )
                {
                    searchQuery = searchQuery.trim().toLowerCase();
                    filteredNotes = filteredNotes.filter(note => note.title.toLowerCase().includes(searchQuery) || note.content.toLowerCase().includes(searchQuery));
                } */

                // Show all
                if ( filter === 'notes' )
                {
                    // Do nothing
                }
                // Show archive
                const isArchive = filter === 'archived';
                if (isArchive) {
                    /* filteredNotes = filteredNotes.filter(note => note.archived === isArchive); */
                    filteredNotes = filteredNotes.filter(note => note.status === EntityStatus.INACTIVE);
                }

                // Filter by label
                if ( filter.startsWith('label:') ) {
                    const labelId = filter.split(':')[1];
                    this.msgtogroups$.subscribe((msgtodata) => {
                        const msgtofiltered = msgtodata.filter(item => item.groupID === labelId);
                        if (msgtofiltered.length > 0) {
                            let filteredNotesTmp: MsgTemplate[] = [];
                            for (const msg2g of msgtofiltered){
                                const filteredNotesTmp2 = (filteredNotes.filter(note => note.id === msg2g.msgID));
                                filteredNotesTmp = filteredNotesTmp.concat(filteredNotesTmp2);
                            }
                            filteredNotes = filteredNotesTmp;
                        } else {
                            filteredNotes = [];
                        }
                    });
                }

                return filteredNotes;
            })
        );

        // Subscribe to media changes
        this._fuseMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({matchingAliases}) => {

                // Set the drawerMode and drawerOpened if the given breakpoint is active
                if ( matchingAliases.includes('lg') )
                {
                    this.drawerMode = 'side';
                    this.drawerOpened = true;
                }
                else
                {
                    this.drawerMode = 'over';
                    this.drawerOpened = false;
                }

                // Set the masonry columns
                //
                // This if block structured in a way so that only the
                // biggest matching alias will be used to set the column
                // count.
                if ( matchingAliases.includes('xl') )
                {
                    this.masonryColumns = 5;
                }
                else if ( matchingAliases.includes('lg') )
                {
                    this.masonryColumns = 4;
                }
                else if ( matchingAliases.includes('md') )
                {
                    this.masonryColumns = 3;
                }
                else if ( matchingAliases.includes('sm') )
                {
                    this.masonryColumns = 2;
                }
                else
                {
                    this.masonryColumns = 1;
                }

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
    }

    ngAfterViewInit(): void
    {
        this._fuseDrawerService.getComponent('msgDetails').openedChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((isOpen) => {
                if (!isOpen) {
                    this.currentMsg = new MessageModel();
                    this._changeDetectorRef.detectChanges();
                }
            });
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

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    private async getClientId(){
        const { sub } = await this._auth.checkClientId();
        this.clientid = sub;
    };

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Add a new note
     */
    // eslint-disable-next-line @typescript-eslint/member-ordering
    addNewMessage($event): void {
        const newMsg = this._messagesService.createNewMessage();
        this._matDialog.open(DetailsMessagesComponent, {
            autoFocus: false,
            data : {
                message: newMsg,
                action: 'new'
            }
        });
    }

    /**
     * Open the edit labels dialog
     */
    openEditLabelsDialog(): void
    {
        this._matDialog.open(GroupsMessagesComponent, {autoFocus: false});
    }

    /**
     * Open the note dialog
     */
    // eslint-disable-next-line @typescript-eslint/member-ordering
    openMessageDialog(current: MessageModel): void {
        this.toggleDrawerOpen('msgDetails');
        this.currentMsg = current;
        this._changeDetectorRef.detectChanges();
    }

    /**
     * Filter by archived
     */
    filterByArchived(): void
    {
        this.filter$.next('archived');
    }

    /**
     * Filter by label
     *
     * @param labelId
     */
    filterByLabel(labelId: string): void
    {
        const filterValue = `label:${labelId}`;
        this.filter$.next(filterValue);
    }

    /**
     * Filter by query
     *
     * @param query
     */
    filterByQuery(query: string): void
    {
        this.searchQuery$.next(query);
    }

    /**
     * Reset filter
     */
    resetFilter(): void
    {
        this.filter$.next('notes');
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

    // eslint-disable-next-line @typescript-eslint/member-ordering
    toggleDrawerOpen(drawerName): void {
        const drawer = this._fuseDrawerService.getComponent(drawerName);
        drawer.open();
    }

    // eslint-disable-next-line @typescript-eslint/member-ordering
    toggleDrawerClose(drawerName): void {
        const drawer = this._fuseDrawerService.getComponent(drawerName);
        drawer.close();
    }
}
