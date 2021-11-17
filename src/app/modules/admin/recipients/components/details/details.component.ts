import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
    TemplateRef,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {FormArray, FormBuilder, FormControl, FormGroup} from '@angular/forms';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import {ReplaySubject, Subject} from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { RecipientListComponent } from '../list/recipient-list.component';
import { RecipientsService } from '../../recipients.service';
import {EntityStatus} from '../../../../../API.service';
import {FuseUtils} from '../../../../../../@fuse/utils';
import {GroupsRecipientsService} from '../../groups-recipients.service';

interface IStatus {
    value: string;
    name: string;
}

@Component({
    selector: 'contact-details',
    templateUrl: './details.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactsDetailsComponent implements OnInit, OnDestroy, AfterViewInit  {
    @ViewChild('detailPanel') private _detailPanel: TemplateRef<any>;

    statusOptions: IStatus[] = [];
    groupsOptions: any[] = [];

    editMode: boolean = false;
    tagsEditMode: boolean = false;
    contact: any;
    contactForm: FormGroup;
    contacts: any[];

    statusFilterCtrl: FormControl = new FormControl();
    filteredStatus: ReplaySubject<IStatus[]> = new ReplaySubject<IStatus[]>(1);

    groupsFilterCtrl: FormControl = new FormControl();
    filteredGroups: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

    private _overlayRef: OverlayRef;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef,
        private _recipientListComponent: RecipientListComponent,
        private _recipientService: RecipientsService,
        private _groupsService: GroupsRecipientsService,
        private _formBuilder: FormBuilder,
        private _fuseConfirmationService: FuseConfirmationService,
        private _router: Router,
        private _overlay: Overlay
    ) {
        this._groupsService.getGroups();
        this.statusOptions = FuseUtils.convertEnumToArray(EntityStatus);
        this.filteredStatus.next(this.statusOptions.slice());
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {

        this._groupsService.groups$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((groups: any[]) => {
                this.groupsOptions = groups;
                this.filteredGroups.next(this.groupsOptions);
                this._changeDetectorRef.markForCheck();
            });

        this.statusFilterCtrl.valueChanges
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this._filterStatus();
            });

        // Open the drawer
        this._recipientListComponent.matDrawer.open();

        // Create the contact form
        this.contactForm = this._formBuilder.group({
            id: [''],
            phone: [''],
            recipientGroupId: [''],
            status: [''],
        });

        // Get the contacts
        this._recipientService.recipients$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((contacts: any[]) => {
                this.contacts = contacts;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Get the contact
        this._recipientService.recipient$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((contact: any) => {
                // Open the drawer in case it is closed
                this._recipientListComponent.matDrawer.open();

                // Get the contact
                this.contact = contact;
                if ('Group' in contact){
                    if (contact.Group !== 'null' || contact.Group !== 'undefined'){
                        // Patch values to the form
                        this.contactForm = this._formBuilder.group({
                            id: [contact.id],
                            phone: [contact.phoneTxt],
                            recipientGroupId: [''],
                            status: [contact.status],
                        });
                    }
                } else {
                    // Patch values to the form
                    this.contactForm = this._formBuilder.group({
                        id: [contact.id],
                        phone: [contact.phoneTxt],
                        recipientGroupId: [contact.Group.id],
                        status: [contact.status],
                    });
                }
                // this.contactForm.patchValue(contact);
                // Toggle the edit mode off
                this.toggleEditMode(false);
                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
    }

    ngAfterViewInit(): void {
        this.groupsFilterCtrl.valueChanges
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this._filterGroups();
            });
    }

    private _filterStatus(): void {
        if (!this.statusOptions) {
            return;
        }
        // get the search keyword
        let search = this.statusFilterCtrl.value;
        if (!search) {
            this.filteredStatus.next(this.statusOptions.slice());
            return;
        } else {
            search = search.toLowerCase();
        }
        // filter the banks
        this.filteredStatus.next(
            this.statusOptions.filter(lang => lang.name.toLowerCase().indexOf(search) > -1)
        );
    }

    private _filterGroups(): void {
        if (!this.groupsOptions) {
            return;
        }
        // get the search keyword
        let search = this.groupsFilterCtrl.value;
        if (!search) {
            this.filteredGroups.next(this.groupsOptions.slice());
            return;
        } else {
            search = search.toLowerCase();
        }
        // filter the banks
        this.filteredGroups.next(
            this.groupsOptions.filter(lang => lang.name.toLowerCase().indexOf(search) > -1)
        );
    }

    // eslint-disable-next-line @typescript-eslint/member-ordering
    ngOnViewInit() {
        /* if (!this._detailPanel){
            // Create the overlay if it doesn't exist
            if ( !this._overlayRef ){
                    this._createOverlay();
            }

            // Attach the portal to the overlay
            this._overlayRef.attach(new TemplatePortal(this._detailPanel, this._viewContainerRef));
        } */
    }
    /**
     * On destroy
     */
    // eslint-disable-next-line @typescript-eslint/member-ordering
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();

        // Dispose the overlays if they are still on the DOM
        if (this._overlayRef) {
            this._overlayRef.dispose();
        }
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Close the drawer
     */
    // eslint-disable-next-line @typescript-eslint/member-ordering
    closeDrawer(): Promise<MatDrawerToggleResult> {
        return this._recipientListComponent.matDrawer.close();
    }

    /**
     * Toggle edit mode
     *
     * @param editMode
     */
    // eslint-disable-next-line @typescript-eslint/member-ordering
    toggleEditMode(editMode: boolean | null = null): void {
        if (editMode === null) {
            this.editMode = !this.editMode;
        } else {
            this.editMode = editMode;
        }

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Update the contact
     */
    // eslint-disable-next-line @typescript-eslint/member-ordering
    updateContact(): void {
        // Get the contact object
        const contact = this.contactForm.getRawValue();
        this._recipientService.updateRecipientDetail(contact)
            .then((resp) => {
                console.log('Recipient updated');
                // Toggle the edit mode off
                this.toggleEditMode(false);
        });
    }

    /**
     * Delete the contact
     */
    // eslint-disable-next-line @typescript-eslint/member-ordering
    deleteContact(): void {
        // Open the confirmation dialog
        const confirmation = this._fuseConfirmationService.open({
            title: 'Delete contact',
            message:
                'Are you sure you want to delete this contact? This action cannot be undone!',
            actions: {
                confirm: {
                    label: 'Delete',
                },
            },
        });

        // Subscribe to the confirmation dialog closed action
        confirmation.afterClosed().subscribe((result) => {
            // If the confirm button pressed...
            if (result === 'confirmed') {
                // Get the current contact's id
                const id = this.contact.id;

                // Get the next/previous contact's id
                const currentContactIndex = this.contacts.findIndex(
                    item => item.id === id
                );
                const nextContactIndex =
                    currentContactIndex +
                    (currentContactIndex === this.contacts.length - 1 ? -1 : 1);
                const nextContactId =
                    this.contacts.length === 1 && this.contacts[0].id === id
                        ? null
                        : this.contacts[nextContactIndex].id;

                // Delete the contact
                this._recipientService
                    .deleteContact(id)
                    .subscribe((isDeleted) => {
                        // Return if the contact wasn't deleted...
                        if (!isDeleted) {
                            return;
                        }

                        // Navigate to the next contact if available
                        if (nextContactId) {
                            this._router.navigate(['../', nextContactId], {
                                relativeTo: this._activatedRoute,
                            });
                        }
                        // Otherwise, navigate to the parent
                        else {
                            this._router.navigate(['../'], {
                                relativeTo: this._activatedRoute,
                            });
                        }

                        // Toggle the edit mode off
                        this.toggleEditMode(false);
                    });

                // Mark for check
                this._changeDetectorRef.markForCheck();
            }
        });
    }

    /**
     * Open the messages panel
     */
    openPanel(): void {
        // Return if the messages panel or its origin is not defined
        if (!this._detailPanel) {
            return;
        }

        /*         // Create the overlay if it doesn't exist
        if ( !this._overlayRef )
        {
            this._createOverlay();
        }

        // Attach the portal to the overlay
        this._overlayRef.attach(new TemplatePortal(this._messagesPanel, this._viewContainerRef));
     */
    }

    // eslint-disable-next-line @typescript-eslint/member-ordering
    closePanel(): void {
        this._overlayRef.detach();
    }

    _createOverlay(): void {
        this._overlayRef = this._overlay.create({
            hasBackdrop: true,
            backdropClass: 'cdk-overlay-transparent-backdrop',
            scrollStrategy: this._overlay.scrollStrategies.noop(),

            /* positionStrategy: this._overlay.position()
                .flexibleConnectedTo(origin)
                .withLockedPosition(true)
                .withPush(true)
                .withPositions([
                    {
                        originX : 'start',
                        originY : 'bottom',
                        overlayX: 'start',
                        overlayY: 'top'
                    },
                    {
                        originX : 'start',
                        originY : 'top',
                        overlayX: 'start',
                        overlayY: 'bottom'
                    },
                    {
                        originX : 'end',
                        originY : 'bottom',
                        overlayX: 'end',
                        overlayY: 'top'
                    },
                    {
                        originX : 'end',
                        originY : 'top',
                        overlayX: 'end',
                        overlayY: 'bottom'
                    }
                ]) */
        });
    }

    trackByFn(index: number, item: any): any {
        return item.id || index;
    }
}
