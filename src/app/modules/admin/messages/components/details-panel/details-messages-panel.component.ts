import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    SimpleChanges,
    TemplateRef,
    ViewChild,
    ViewContainerRef,
    ViewEncapsulation
} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {MsgsService} from '../../messages.service';
import {AuthService} from 'app/core/auth/auth.service';
import {MessageModel} from '../../models/MessageModel';
import {takeUntil} from 'rxjs/operators';
import _lodash from 'lodash';
import {TemplatePortal} from '@angular/cdk/portal';
import {Overlay, OverlayRef} from '@angular/cdk/overlay';
import {EntityStatus} from '../../../../../API.service';
import {FuseConfirmationService} from '../../../../../../@fuse/services/confirmation';

@Component({
    selector       : 'messages-details-panel',
    templateUrl    : './details-messages-panel.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DetailsMessagesPanelComponent implements OnInit, OnDestroy, OnChanges
{
    @Input() currentMsg: any;
    @Output() closeOrCancelEvent: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild('labelsPanelOrigin') private _labelPanelOrigin: ElementRef;
    @ViewChild('labelsPanel') private _labelsPanel: TemplateRef<any>;

    currentMessage$: Observable<any>;
    labels$: Observable<any[]>;
    listOfLabelsById: any[];
    listOfLabelsUsed: any[];
    labelsByMsgId$: Observable<any[]>;
    labelsEditMode: boolean = false;
    labels: any[];
    filteredLabels: any[];
    detailsChanged: Subject<MessageModel> = new Subject<MessageModel>();
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    private _labelsPanelOverlayRef: OverlayRef;
    // eslint-disable-next-line @typescript-eslint/member-ordering
    saveOrCreate: boolean;
    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _messagesService: MsgsService,
        private _auth: AuthService,
        private _overlay: Overlay,
        private _viewContainerRef: ViewContainerRef,
        private _fuseConfirmationService: FuseConfirmationService,
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
        this.labels$ = this._messagesService.labels$;
        this.currentMessage$ = this._messagesService.messageTemplate$;
        this.labelsByMsgId$ = this._messagesService.labelsByMsgId$;
        this.labelsByMsgId$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((result) => {
                if (result) {
                    this.listOfLabelsUsed = [];
                    this.listOfLabelsById= result;
                    result.forEach((item) => {
                        this.listOfLabelsUsed.push(item.groupID);
                    });
                    this._changeDetectorRef.markForCheck();
                }
            });
        this.labels$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((result) => {
                if (result) {
                    this.labels = result;
                    this.filteredLabels = result;
                    this._changeDetectorRef.markForCheck();
                }
            });

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
        // Dispose the overlay
        if ( this._labelsPanelOverlayRef )
        {
            this._labelsPanelOverlayRef.dispose();
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        const {currentMsg} = changes;
        this._messagesService.activateProgressBar();
        if (currentMsg.currentValue && currentMsg.currentValue.id) {
            this._messagesService.getMessageById(currentMsg.currentValue.id)
                .then((result) => {
                    if (result) {
                        this._messagesService.activateProgressBar('off');
                    }
                });
        } else {
            this._messagesService.setNewMessage(currentMsg.currentValue);
            this._messagesService.activateProgressBar('off');
        }
    }

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    updateMessageToDefault(msg: MessageModel) {
        this._messagesService.activateProgressBar();
        if (msg.id) {
            this._messagesService.updateMessageToDefault(msg.id)
                .then((result) => {
                    this.closePanel('msgDetails');
                    this._messagesService.activateProgressBar('off');
                });
        } else {
            this._messagesService.activateProgressBar('off');
        }

    }
    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------
    /**
     * Filter tags
     *
     * @param event
     */
    filterTags(event): void
    {
        // Get the value
        const value = event.target.value.toLowerCase();

        // Filter the tags
        this.filteredLabels = this.labels.filter(item => item.name.toLowerCase().includes(value));
    }
    /**
     * Filter tags input key down event
     *
     * @param event
     */
    filterTagsInputKeyDown(event): void
    {
        // Return if the pressed key is not 'Enter'
        if ( event.key !== 'Enter' )
        {
            return;
        }

        if ( this.filteredLabels.length === 0 )
        {
            // Clear the input
            event.target.value = '';
            // Return
            return;
        }

        // If there is a tag...
        const item = this.filteredLabels[0];
        const isLabelApplied = this.listOfLabelsById.find(id => id === item.id);
        // If the found tag is already applied to the task...
        if ( isLabelApplied )
        {
            // Remove the tag from the task
            // this.deleteTagFromTask(tag);
        }
        else
        {
            // Otherwise add the tag to the task
            // this.addTagToTask(tag);
        }
    }
    /**
     * Update the note details
     *
     * @param msg
     */

    onUpdateMessageDetails(msg: MessageModel): void {
        this.detailsChanged.next(msg);
    }
    /**
     * Update message details
     *
     * @param msg
     */

    updateMessage(msg: MessageModel): void {
        this._messagesService.activateProgressBar();
        if (msg.id) {
            this._messagesService.updateMessage(msg)
                .then((result) => {
                    if (result) {
                        this._messagesService.activateProgressBar('off');
                    }
                });
        } else {
            this._messagesService.activateProgressBar('off');
        }
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
        return !_lodash.isEmpty(found);
    }
    /**
     * Toggle the given label on the given note
     *
     * @param note
     * @param label
     */
    toggleLabelOnMessage(msgtemplate: any, group: any): void {
        this._messagesService.activateProgressBar();
        if ( this.isLabelBeenUsed( group) ) {
            const foundGroup = this.listOfLabelsById.find(item => item.groupID === group.id);
            this._messagesService.detachGroupFromMsg(foundGroup)
                .then((resUpdate) => {
                    this._messagesService.activateProgressBar('off');
                })
                .catch((error) => {
                    console.log(error);
                    this._messagesService.activateProgressBar('off');
                });
        } else {
            this._messagesService.attachGroupFromMsg(msgtemplate, group)
                .then((resUpdate) => {
                    this._messagesService.activateProgressBar('off');
                })
                .catch((error) => {
                    console.log(error);
                    this._messagesService.activateProgressBar('off');
                });
        }
    }

    /**
     * Toggle archived status on the given note
     *
     * @param note
     */
    toggleArchiveMessage(msg: any): void {
        this._messagesService.activateProgressBar();
        this._messagesService.archiveMessage(msg.id, EntityStatus.INACTIVE)
            .then((resUpdate) => {
                this._messagesService.activateProgressBar('off');
                this.closePanel('msgDetails');
            })
            .catch((error) => {
                console.log(error);
                this._messagesService.activateProgressBar('off');
            });
    }
    /**
     * Toggle archived status on the given note
     *
     * @param note
     */
    toggleUnArchiveMessage(msg: any): void
    {
        this._messagesService.activateProgressBar();
        this._messagesService.archiveMessage(msg.id, EntityStatus.ACTIVE)
            .then((resUpdate) => {
                this._messagesService.activateProgressBar('off');
                this.closePanel('msgDetails');
            })
            .catch((error) => {
                console.log(error);
                this._messagesService.activateProgressBar('off');
            });
    }

    deleteMessage(msg: MessageModel): void
    {
        const confirmation = this._fuseConfirmationService.open({
            title  : 'Delete Message',
            message: 'Are you sure you want to delete this Message? This action cannot be undone!',
            actions: {
                confirm: {
                    label: 'Delete'
                }
            }
        });
        confirmation.afterClosed().subscribe((result) => {

            // If the confirm button pressed...
            if (result === 'confirmed') {
                this._messagesService.deleteMessage(msg)
                    .then((resUpdate) => {
                        this.closePanel('msgDetails');
                    })
                    .catch((error) => {
                        console.log(error);
                    });
                this._changeDetectorRef.markForCheck();
            }
        });

    }

    /**
     * Toggle archived status on the given note
     *
     * @param note
     */
    // toggleArchiveMessage(msg: any): void
    // {
    //     this._msgsService.archiveMessage(msg.id)
    //         .then(() => this._matDialogRef.close())
    //         .catch(error => console.log(error));
    // }
    //

    closePanel($event: any): void {
        this.closeOrCancelEvent.emit('msgDetails');
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


    /**
     * Open tags panel
     */
    openLabelsPanel(): void {
        // Create the overlay
        this._labelsPanelOverlayRef = this._overlay.create({
            backdropClass   : '',
            hasBackdrop     : true,
            scrollStrategy  : this._overlay.scrollStrategies.block(),
            positionStrategy: this._overlay.position()
                .flexibleConnectedTo(this._labelPanelOrigin.nativeElement)
                .withFlexibleDimensions(true)
                .withViewportMargin(64)
                .withLockedPosition(true)
                .withPositions([
                    {
                        originX : 'start',
                        originY : 'bottom',
                        overlayX: 'start',
                        overlayY: 'top'
                    }
                ])
        });

        // Subscribe to the attachments observable
        this._labelsPanelOverlayRef.attachments().subscribe(() => {

            // Focus to the search input once the overlay has been attached
            this._labelsPanelOverlayRef.overlayElement.querySelector('input').focus();
        });

        // Create a portal from the template
        const templatePortal = new TemplatePortal(this._labelsPanel, this._viewContainerRef);

        // Attach the portal to the overlay
        this._labelsPanelOverlayRef.attach(templatePortal);

        // Subscribe to the backdrop click
        this._labelsPanelOverlayRef.backdropClick().subscribe(() => {

            // If overlay exists and attached...
            if ( this._labelsPanelOverlayRef && this._labelsPanelOverlayRef.hasAttached() ) {
                // Detach it
                this._labelsPanelOverlayRef.detach();

                // Reset the tag filter
                this.filteredLabels = this.labels;

                // Toggle the edit mode off
                this.labelsEditMode = false;
            }

            // If template portal exists and attached...
            if ( templatePortal && templatePortal.isAttached )
            {
                // Detach it
                templatePortal.detach();
            }
        });
    }
}
