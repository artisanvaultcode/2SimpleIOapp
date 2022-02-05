import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Campaign, CreateCampaignInput,
    CreateCampaignMutation, Group }
from 'app/API.service';
import { MsgsService } from '../../../messages/messages.service';
import { Observable, Subject } from 'rxjs';
import { MsgTemplateService } from 'app/core/services/msg-template.service';
import { AuthService } from 'app/core/auth/auth.service';
import { CampaignService } from './../../campaign.service';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-details-campaigns',
    templateUrl: './details-campaigns.component.html',
    styleUrls: ['./details-campaigns.component.scss'],
})
export class DetailsCampaignsComponent implements OnInit, OnDestroy {

    private clientId: string;

    showAlert: boolean = false;
    composeForm: FormGroup;
    newCampaignInput: CreateCampaignInput;
    targetValues = ["ALL", "GROUP", "SELECTION"];
    showGroupId = false;

    labels$: Observable<Group[]>;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private _formBuilder: FormBuilder,
        private _matDialogRef: MatDialogRef<DetailsCampaignsComponent>,
        private _campaignService: CampaignService,
        private _msgsService: MsgsService,
        private _msgTemplateService: MsgTemplateService,
        private _auth: AuthService,
    ) {}

    ngOnInit(): void {
        this._auth.checkClientId()
            .then(resp => {
                this.clientId = resp['sub'];
            })
            .catch(error => {
                console.log("Error _auth", error);
            });

        this.composeForm = this._formBuilder.group({
            name: ['', [Validators.required, Validators.minLength(4)]],
            target: ['', [Validators.required]],
            message: ['', [Validators.required, Validators.minLength(4)]],
            groupId: [''],
        });

        this._msgTemplateService.getDefaultMsg()
            .then(resp => {
                this.composeForm.controls['message'].setValue(resp.message);
            })
            .catch(error => {
                console.log("[MsgTemplateMessage] Error:", error);
            });
        this.labels$ = this._msgsService.labels$;
        this._msgsService.getLabels()
            .then(resp => {
                console.log("getLabels result", resp);
            })
    }

    /**
     * On destroy
     */
     ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    saveAndClose() {
        // Hide the alert
        this.showAlert = false;
        this.createCampaign();
    }

    close() {
        console.log("Discard to add campaign");
        this._matDialogRef.close();
    }

    createCampaign() {
        const newCampaign: Campaign = this.composeForm.getRawValue();
        if (this.composeForm.invalid) {
            console.log('Validation Form invalid...');
            this.showAlert = true;
        } else {
            console.log("form", newCampaign)
            this._campaignService.createCampaign(newCampaign)
                .then((resp: CreateCampaignMutation) => {
                    console.log("New Campaign add");
                    // send campaign to backend
                    this._campaignService.sendCampaign(this.clientId, resp)
                        .pipe(takeUntil(this._unsubscribeAll))
                        .subscribe(response => {
                            console.log("[createCampign] send Camaign to backend", response);
                        });
                });
            this._matDialogRef.close();
        }
    }

    showGroup(target) {
        console.log("Target", target);
        if (target === 'GROUP') {
            this.showGroupId = true;
            this.composeForm.controls['groupId'].setValidators(Validators.required);
        } else {
            this.showGroupId = false;
            this.composeForm.controls['groupId'].clearValidators();
        }
        this.composeForm.controls['groupId'].updateValueAndValidity();
    }
}
