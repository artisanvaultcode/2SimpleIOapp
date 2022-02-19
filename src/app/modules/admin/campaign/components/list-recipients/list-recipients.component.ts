import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Hub } from 'aws-amplify';
import { Observable, of, Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';

import { CampaignService } from './../../campaign.service';
import { RecipientsService } from './../../../recipients/recipients.service';
import { Group, Recipient } from 'app/API.service';
import { Location } from "@angular/common";
import { MsgsService } from './../../../messages/messages.service';
import { FuseDrawerService } from '@fuse/components/drawer';
import { MatChip, MatChipList } from '@angular/material/chips';


@Component({
    selector: 'app-list-recipients',
    templateUrl: './list-recipients.component.html',
    styleUrls: ['./list-recipients.component.scss'],
})
export class ListRecipientsComponent implements OnInit {

    @Input() campId: string;
    @ViewChild(MatChipList) chipList: MatChipList;

    recipients$: Observable<any[]>;
    nextPageRecips$: Observable<any[]>;
    campaignTargets$: Observable<any[]>;
    recipientTargets: Recipient[] = [];
    searchInputControl: FormControl = new FormControl();
    composeForm: FormGroup;
    filterGroup: FormControl;
    filterGroup$: Observable<string>;
    labels$: Observable<Group[]>;

    showAlert: boolean = false;
    showGroupId: boolean = false;
    showGroupFilter: boolean = false;
    isSelection: boolean = false;
    isAll: boolean = false;
    isAllandGroup: boolean = false;
    isLoading: boolean;
    recipientsCount: number = 0;
    groupId: string = "";
    cardMsg: string = "";
    targetSelected: string = "ALL";
    targetValues = ["ALL", "GROUP", "SELECTION"];

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private _recipientsService: RecipientsService,
        private _changeDetectorRef: ChangeDetectorRef,
        private _campaignService: CampaignService,
        private _formBuilder: FormBuilder,
        private _location: Location,
        private _msgsService: MsgsService,
        private _fuseDrawerService: FuseDrawerService,
    ) {
        Hub.listen('processing', (data) => {
            if (data.payload.event === 'progressbar') {
                this.isLoading = data.payload.data.activate === 'on';
                this._changeDetectorRef.markForCheck();
            }
        });
    }

    ngOnInit(): void {
        this.recipients$ = this._campaignService.recipients$;
        this._campaignService.searchRecipients()
            .then(resp => this.recipientsCount = resp)
            .catch(error => console.log("Error", error));
        this.nextPageRecips$ = this._campaignService.nextPageRecips$;

        this.campaignTargets$ = this._campaignService.campaignTargets$;
        this._campaignService.getCampaignsTarget(this.campId)
            .then(resp => resp)
            .catch(error => console.log("Error: ", error));

        this.searchInputControl.valueChanges
            .pipe(
                takeUntil(this._unsubscribeAll),
                switchMap((query) =>
                    // Search
                    of(this._recipientsService.searchRecipients(query))
                )
            )
            .subscribe();

        this.composeForm = this._formBuilder.group({
            name: ['', [Validators.required, Validators.minLength(4)]],
            target: ['', [Validators.required]],
            message: ['', [Validators.required, Validators.minLength(4)]],
            groupId: [''],
        });

        this.labels$ = this._msgsService.labels$;
        this._msgsService.getLabels()
            .then(resp => resp)
            .catch(error => console.log("Error", error));
    }

    gotoNextPageRecip(nextPage): void {
        this._campaignService.goNextPageRecips(null, nextPage);
        /* if ( this.isSelection && this.groupId === "" ) {
        } else if ( this.isSelection && this.groupId !== "" )
            this._recipientsService.getRecipientsByGroupId(this.groupId, nextPage); */
    }

    addCampaigTarget(recip: Recipient) {
        this.recipientTargets.push(recip);
    }

    removeRecipient(recip) {
        let recipFiltered = this.recipientTargets.filter(recipt => recipt.phone !== recip);
        this.recipientTargets = recipFiltered;
    }

    back() {
        // Back page
        //this._router.navigateByUrl("/campaign");
        this._location.back();
    }

    showGroup(target) {
        this.targetSelected = target;
        if (target === 'GROUP') {
            this.showGroupId = true;
            this.isSelection = false;
            this.isAll = false;
            this.showGroupFilter = false;
            this.isAllandGroup = false;
            this.composeForm.controls['groupId'].setValidators(Validators.required);
        } else {
            this.showGroupId = false;
            this.composeForm.controls['groupId'].clearValidators();
            if (target === 'SELECTION') {
                this.isSelection = true;
                this.isAll = false;
                this.showGroupFilter = true;
                this.isAllandGroup = false;
            } else {
                this.isSelection = false;
                this.showGroupFilter = false;
                if (target === 'ALL') {
                    this.isAll = true;
                    this.isAllandGroup = true;
                    this.cardMsg = "Messages will be sent to All recipients";
                }
            }
        }
        this.composeForm.controls['groupId'].updateValueAndValidity();
    }

    groupChange(event) {
        this.isAllandGroup = true;
        this.cardMsg = `Messages will be sent to all recipients in the \"${event.value.name}\" group`;
    }

    onClickFilter(ref: MatChip) {
        this.chipList.chips.forEach((item: MatChip) => {
            if (item === ref) {
                ref.selected = true;
                this.groupId = ref.value.id;
                this._recipientsService.getRecipientsByGroupId(ref.value.id)
                    .then(resp => this.recipientsCount = resp)
                    .catch(error => console.log("Error", error));
                this.nextPageRecips$ = this._recipientsService.nextPage$;
            }
            else item.selected = false;
        });
    }

    detailCampaign() {
        const drawer = this._fuseDrawerService.getComponent('campDetails');
        drawer.open();
        this._changeDetectorRef.detectChanges();
    }

    toggleDrawerClose(drawerName): void {
        const drawer = this._fuseDrawerService.getComponent(drawerName);
        drawer.close();
    }
}
