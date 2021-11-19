import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Inject,
    OnDestroy,
    OnInit,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { MatDrawer } from '@angular/material/sidenav';
import { fromEvent, Observable, of, Subject } from 'rxjs';
import { filter, switchMap, takeUntil } from 'rxjs/operators';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { RecipientsService } from '../../recipients.service';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { UploadCsvDialogComponent } from '../upload-csv-dialog/upload-csv-dialog.component';

@Component({
    selector: 'recipient-list',
    templateUrl: './recipient-list.component.html',
    styleUrls: ['./recipient-list.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecipientListComponent implements OnInit, OnDestroy {
    @ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer;

    recipients$: Observable<any[]>;
    recipient$: Observable<any>;
    nextPage$: Observable<any[]>;

    recipientsCount: number = 0;
    contactsTableColumns: string[] = ['name', 'email', 'phoneNumber', 'job'];
    drawerMode: 'side' | 'over';
    searchInputControl: FormControl = new FormControl();
    selectedContact: any;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef,
        private _recipientsService: RecipientsService,
        @Inject(DOCUMENT) private _document: any,
        private _router: Router,
        private _bottomSheet: MatBottomSheet,
        private _fuseMediaWatcherService: FuseMediaWatcherService
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Get the contacts
        this.recipients$ = this._recipientsService.recipients$;
        this.nextPage$ = this._recipientsService.nextPage$;
        this._recipientsService.recipients$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((contacts: any[]) => {
                // Update the counts
                this.recipientsCount = contacts.length;
                if (contacts.length > 0){
                    document.getElementById("nPage").hidden = false;
                } else {
                    document.getElementById("nPage").hidden = true;
                }
                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        this.recipient$ = this._recipientsService.recipient$
        // Get the contact
        this._recipientsService.recipient$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((recipient: any) => {
                // Update the selected contact
                this.selectedContact = recipient;
                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Subscribe to search input field value changes
        this.searchInputControl.valueChanges
            .pipe(
                takeUntil(this._unsubscribeAll),
                switchMap((query) =>
                    // Search
                    of(this._recipientsService.searchRecipients(query))
                )
            )
            .subscribe();

        // Subscribe to MatDrawer opened change
        this.matDrawer.openedChange.subscribe((opened) => {
            if (!opened) {
                // Remove the selected contact when drawer closed
                this.selectedContact = null;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            }
        });

        // Subscribe to media changes
        this._fuseMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({ matchingAliases }) => {
                // Set the drawerMode if the given breakpoint is active
                if (matchingAliases.includes('lg')) {
                    this.drawerMode = 'side';
                } else {
                    this.drawerMode = 'over';
                }

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Listen for shortcuts
        fromEvent(this._document, 'keydown')
            .pipe(
                takeUntil(this._unsubscribeAll),
                filter<KeyboardEvent>(
                    (event) =>
                        (event.ctrlKey === true || event.metaKey) && // Ctrl or Cmd
                        event.key === '/' // '/'
                )
            )
            .subscribe(() => {
                this.createContact();
            });
    }

    gotoNextPage(nextPage): void {
        this._recipientsService.goNextPage(null, nextPage);
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
     * On backdrop clicked
     */
    onBackdropClicked(): void {
        // Go back to the list
        this._router.navigate(['./'], { relativeTo: this._activatedRoute });

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    refresh($event): void {
        this._recipientsService.refresh();
    }

    uploadFile($event): void {
        const fileToUpload = this._bottomSheet.open(UploadCsvDialogComponent, {
            data: { fileTarget: 'QUEUE' },
        });
        fileToUpload.afterDismissed().subscribe((data) => {
            if (data) {
                this._recipientsService
                    .importRecipients(data?.items)
                    .then((results) => {
                        this._recipientsService.refresh();
                    });
            }
        });
    }

    /**
     * Create contact
     */
    createContact(): void {
        // Create the contact
        this._recipientsService.createContact().subscribe((newContact) => {
            // Go to the new contact
            this._router.navigate(['./', newContact.id], {
                relativeTo: this._activatedRoute,
            });

            // Mark for check
            this._changeDetectorRef.markForCheck();
        });
    }

    onPaginateChange(evet) {
        console.log('pagination', evet);
    }
    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }

    nextPageLeft() {
        console.log('next page left');
    }

    nextPageRight() {
        console.log('next page Right');
    }
}
