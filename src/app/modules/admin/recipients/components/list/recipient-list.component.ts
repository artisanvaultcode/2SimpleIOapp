import { AuthService } from 'app/core/auth/auth.service';
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
import { BehaviorSubject, fromEvent, Observable, of, Subject } from 'rxjs';
import { debounceTime, filter, switchMap, takeUntil } from 'rxjs/operators';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { RecipientsService } from '../../recipients.service';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { WizardComponent } from '../wizard/wizard.component';
import { Hub } from 'aws-amplify';
import { Group } from '../../../../../API.service';
import { GroupsRecipientsService } from '../../groups-recipients.service';

@Component({
    selector: 'recipient-list',
    templateUrl: './recipient-list.component.html',
    styleUrls: ['./recipient-list.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecipientListComponent implements OnInit, OnDestroy {
    @ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer;

    // recipients$: Observable<any[]>;
    recipient$: Observable<any>;
    labels$: Observable<Group[]>;
    nextPage$: Observable<any[]>;

    contactLists: any[] = [];

    recipientsCount: number = 0;
    filter$: BehaviorSubject<string> = new BehaviorSubject('recipients');
    query: string;
    isLoading: boolean = false;
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
        private _groupsService: GroupsRecipientsService,
        @Inject(DOCUMENT) private _document: any,
        private _router: Router,
        private _bottomSheet: MatBottomSheet,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _auth: AuthService,
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.nextPage$ = this._recipientsService.nextPage$;
        this.labels$ = this._recipientsService.labels$;

        this._recipientsService.recipients$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((contacts: any[]) => {
                if (contacts === null || contacts.length===0) {
                    this.contactLists = [];
                }
                if (contacts && contacts.length > 0) {
                    contacts.forEach(item => this.contactLists.push(item));
                }
                this.recipientsCount = this.contactLists.length;
                // Mark for check
                this._changeDetectorRef.detectChanges();
            });

        this.recipient$ = this._recipientsService.recipient$;
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
                debounceTime(500),
                switchMap((query) => {
                    this.query = query;
                    if(this.filterStatus === 'recipients') {
                        return of(this._recipientsService.getRecipients(query, null, true));
                    } else if(this.filterStatus === 'archived') {
                        return of(this._recipientsService.getRecipientsArchived(query, null, true));
                    } else {
                        // by group id
                        return of(this._recipientsService.getRecipientsByGroupId(
                                        this.filterStatus,
                                        null,
                                        true,
                                        query));
                    }
                })
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
                    event =>
                        (event.ctrlKey === true || event.metaKey) && // Ctrl or Cmd
                        event.key === '/' // '/'
                )
            )
            .subscribe(() => {
                this.createContact();
            });

        Hub.listen('processing', (data) => {
            if (data.payload.event === 'progressbar') {
                this.isLoading = data.payload.data.activate === 'on';
                this._changeDetectorRef.markForCheck();
            }
        });
    }

    /**
     * Get the filter status
     */
    get filterStatus(): string
    {
        return this.filter$.value;
    }

    /**
     * Filter by archived
     */
    filterByArchived(): void {
        this.filter$.next('archived');
        if(this.searchInputControl.value) {
            of(this._recipientsService.getRecipientsArchived(this.searchInputControl.value, null, true));
        } else {
            of(this._recipientsService.getRecipientsArchived(null, null, true));
        }
    }

    /**
     * Filter by recipients
     */
    filterByRecipients(): void  {
        this.filter$.next('recipients');
        if(this.searchInputControl.value) {
            of(this._recipientsService.getRecipients(this.searchInputControl.value, null, true));
        } else {
            of(this._recipientsService.getRecipients(null, null, true));
        }
    }

    /**
     * Filter by label
     *
     * @param labelId
     */
    filterByLabel(labelId: string): void {
        this.filter$.next(labelId);
        if(this.searchInputControl.value) {
            of(this._recipientsService.getRecipientsByGroupId(labelId,
                null,
                true,
                this.searchInputControl.value));
        } else {
            of(this._recipientsService.getRecipientsByGroupId(labelId, null, true));
        }
    }

    gotoNextPage(nextPage): void {
        if(this.filterStatus === 'recipients') {
            of(this._recipientsService.getRecipients(this.searchInputControl.value, nextPage, false));
        } else if(this.filterStatus === 'archived') {
            of(this._recipientsService.getRecipientsArchived(this.searchInputControl.value, nextPage, false));
        } else {
            // by group id nexpage
            of(this._recipientsService.getRecipientsByGroupId(this.filterStatus,
                    nextPage,
                    false,
                    this.searchInputControl.value));
        }
    }

    refreshByFilter(event?: any): void {
        if(this.filterStatus === 'recipients') {
            this.filterByRecipients();
        } else if(this.filterStatus === 'archived') {
            this.filterByArchived();
        } else {
            this.filterByLabel(this.filterStatus);
        }
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

    async uploadFile($event): Promise<any> {
        const fileToUpload = this._bottomSheet.open(WizardComponent, {
            panelClass: 'full-width',
            data: { fileTarget: 'QUEUE' },
        });
        const {sub} = await this._auth.checkClientId();
        fileToUpload.afterDismissed().subscribe((data) => {
            if (data) {
                this._recipientsService
                    .importRecipients(data?.recipients, data?.group, sub)
                    .then((results) => {
                        this.refreshByFilter();
                    });
            }
        });
    }

    /**
     * Create contact
     */
    createContact(): void {
        // Create the contact
        // this._recipientsService.createContact().subscribe((newContact) => {
        //     // Go to the new contact
        //     this._router.navigate(['./', newContact.id], {
        //         relativeTo: this._activatedRoute,
        //     });
        //
        //     // Mark for check
        //     this._changeDetectorRef.markForCheck();
        // });
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

}
