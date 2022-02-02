import { CampaignService } from './../../campaign.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Campaign, CreateCampaignInput, Group } from 'app/API.service';
import { MsgsService } from '../../../messages/messages.service';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-details-campaigns',
    templateUrl: './details-campaigns.component.html',
    styleUrls: ['./details-campaigns.component.scss'],
})
export class DetailsCampaignsComponent implements OnInit {

    showAlert: boolean = false;
    composeForm: FormGroup;
    newCampaignInput: CreateCampaignInput;
    targetValues = ["ALL", "GROUP", "SELECTION"];
    showGroupId = false;

    labels$: Observable<Group[]>;

    constructor(
        private _formBuilder: FormBuilder,
        private _matDialogRef: MatDialogRef<DetailsCampaignsComponent>,
        private _campaignService: CampaignService,
        private _msgsService: MsgsService,
    ) {}

    ngOnInit(): void {
        this.composeForm = this._formBuilder.group({
            name: ['', [Validators.required, Validators.minLength(4)]],
            target: ['', [Validators.required]],
            message: ['', [Validators.required, Validators.minLength(4)]],
            groupId: [''],
        });

        this.labels$ = this._msgsService.labels$;
        this._msgsService.getLabels()
            .then(resp => {
                console.log("getLabels result", resp);
            })
        console.log("Groups", this.labels$);
    }

    saveAndClose() {
        console.log('Save and close matdialog');
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
            /* this._campaignService.createCampaign(newCampaign)
                .then(resp => console.log("New Campaign add")); */
            this._matDialogRef.close();
        }
    }

    showGroup(target) {
        console.log("Target", target);
        if (target === 'GROUP') {
            this.showGroupId = true;
        } else {
            this.showGroupId = false;
        }
    }
}
