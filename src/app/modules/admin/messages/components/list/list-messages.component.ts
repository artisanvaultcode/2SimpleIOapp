import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
    ViewEncapsulation
} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {BehaviorSubject, Observable, of, Subject} from 'rxjs';
import {debounceTime, switchMap, takeUntil} from 'rxjs/operators';
import {FuseMediaWatcherService} from '@fuse/services/media-watcher';
import {DetailsMessagesComponent} from '../details/details-messages.component';
import {MsgsService} from '../../messages.service';
import {AuthService} from 'app/core/auth/auth.service';
import {EntityStatus, Group, MsgTemplate, MsgToGroup} from '../../../../../API.service';
import {MessageModel} from '../../models/MessageModel';
import {Hub} from 'aws-amplify';
import {FuseDrawerService} from '../../../../../../@fuse/components/drawer';

@Component({
    selector       : 'messages-list',
    templateUrl    : './list-messages.component.html',
    styleUrls      : ['list-messages.component.scss'],
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListMessagesComponent implements OnInit, OnDestroy, AfterViewInit
{
    isLoading: boolean;
    labels$: Observable<Group[]>;
    messages$: Observable<MsgTemplate[]>;
    msgtogroups$: Observable<MsgToGroup[]>;

    drawerMode: 'over' | 'side' = 'side';
    drawerOpened: boolean = true;
    filter$: BehaviorSubject<string> = new BehaviorSubject('messages');
    searchQuery$: BehaviorSubject<string> = new BehaviorSubject(null);
    masonryColumns: number = 4;
    selectedMessage: MessageModel;

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
        private _auth: AuthService
    ) {
        Hub.listen('processing', (data) => {
            if (data.payload.event === 'progressbar') {
                this.isLoading = data.payload.data.activate === 'on';
                this._changeDetectorRef.markForCheck();
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

        // Get labels
        this.labels$ = this._messagesService.labels$;
        // Get Msg to Groups
        this.msgtogroups$ = this._messagesService.msgtogroups$;

        this.messages$ = this._messagesService.messages$;

        // Filter
        this.searchQuery$
            .pipe(
                takeUntil(this._unsubscribeAll),
                debounceTime(150),
                switchMap(query =>
                    of(this._messagesService.searchMessages(query))
                )
            ).subscribe();

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
                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
    }

    ngAfterViewInit(): void {
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
     * Toggle the completed status
     * of the given task
     *
     * @param task
     */

    // eslint-disable-next-line @typescript-eslint/member-ordering
    refreshMessages(): void  {
        this.filter$.next('messages');
        this._messagesService.refreshMessages();
    }

    // eslint-disable-next-line @typescript-eslint/member-ordering
    toggleDefault(msg: MessageModel): void
    {
        // Toggle the completed status
        // task.completed = !task.completed;
        //
        // this._tasksService.updateTask(task.id, task).subscribe();
        //
        // this._changeDetectorRef.markForCheck();
    }
    /**
     * Add a new Message
     */
    // eslint-disable-next-line @typescript-eslint/member-ordering
    addNewMessage(): void {
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
    // eslint-disable-next-line @typescript-eslint/member-ordering
    openEditLabelsDialog(): void {
        this.toggleDrawerOpen('grpDetails');
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
    // eslint-disable-next-line @typescript-eslint/member-ordering
    filterByArchived(): void {
        this.filter$.next('archived');
        of(this._messagesService.getMessages(EntityStatus.INACTIVE));
    }

    /**
     * Filter by label
     *
     * @param labelId
     */
    // eslint-disable-next-line @typescript-eslint/member-ordering
    filterByLabel(labelId: string): void {
        this.filter$.next(labelId);
        of(this._messagesService.getMessagesByGroupId(EntityStatus.ACTIVE, labelId));
    }

    /**
     * Filter by query
     *
     * @param query
     */
    // eslint-disable-next-line @typescript-eslint/member-ordering
    filterByQuery(query: string): void
    {
        this.searchQuery$.next(query);
    }

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    // eslint-disable-next-line @typescript-eslint/member-ordering
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
