import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component, EventEmitter,
    OnDestroy,
    OnInit,
    Output,
    ViewEncapsulation
} from '@angular/core';
import { Observable, Subject } from 'rxjs';
import {Label} from '../../messages.types';
import {MsgsService} from '../../messages.service';

@Component({
    selector       : 'groups-message',
    templateUrl    : './groups-messages.component.html',
    styleUrls    : ['./groups-messages.component.scss'],
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GroupsMessagesComponent implements OnInit, OnDestroy
{
    labels$: Observable<Label[]>;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    @Output() closeOrCancelEvent: EventEmitter<any> = new EventEmitter<any>();
    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _messagesService: MsgsService
    )
    {}

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        this.labels$ = this._messagesService.labels$;
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

    closePanel($event: any): void {
        this.closeOrCancelEvent.emit('grpDetails');
    }
    /**
     * Add Group
     *
     * @param title
     */
    addGroup(title: string): void {
        this._messagesService.addGroup(title)
            .then((result) => {
                console.log(result);
            }).catch(e => console.log(e));
    }

    /**
     * Delete Group
     *
     * @param id
     */
    deleteGroup(grp: any): void {
        this._messagesService.deleteGroup(grp)
            .then((result) => {
                console.log(result);
            }).catch(e => console.log(e));
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
