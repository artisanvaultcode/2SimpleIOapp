import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { debounceTime, filter, switchMap, takeUntil } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import {Label} from '../../messages.types';
import {MsgsService} from "../../messages.service";
import { Group } from 'app/API.service';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
    selector       : 'groups-message',
    templateUrl    : './groups-messages.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GroupsMessagesComponent implements OnInit, OnDestroy
{
    labels$: Observable<Label[]>;

    labelChanged: Subject<Group> = new Subject<Group>();
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        public matDialogRef: MatDialogRef<GroupsMessagesComponent>,
        private _changeDetectorRef: ChangeDetectorRef,
        private _messagesService: MsgsService
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
        // Get the labels
        this.labels$ = this._messagesService.labels$;
        // Subscribe to label updates
        this.labelChanged
            .pipe(
                takeUntil(this._unsubscribeAll),
                debounceTime(500),
                filter(label => label.name.trim() !== ''),
                switchMap(label => this._messagesService.updateLabel(label)))
            .subscribe(() => {

                // Mark for check
                this._changeDetectorRef.markForCheck();
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

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Add label
     *
     * @param title
     */
    addLabel(title: string): void
    {
        this._messagesService.addLabel(title)
            .then((resp) => {
                this.matDialogRef.close();
            })
            .catch(err => console.log(err));
    }

    /**
     * Update label
     */
    updateLabel(label: Group): void
    {
        this.labelChanged.next(label);
    }

    /**
     * Delete label
     *
     * @param id
     */
    deleteLabel(grp: Group): void {
        console.log("borrar", grp);
        this._messagesService.deleteLabel(grp)
            .then(() => {
                this.matDialogRef.close();

            });
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
