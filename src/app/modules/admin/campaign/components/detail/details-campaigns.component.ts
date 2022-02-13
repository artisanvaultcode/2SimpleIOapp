import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Campaign, CreateCampaignInput,
    CreateCampaignMutation, Group }
from 'app/API.service';
import { ListRecipientsComponent } from './../list-recipients/list-recipients.component';
import { MsgsService } from '../../../messages/messages.service';
import { Observable, Subject } from 'rxjs';
import { MsgTemplateService } from 'app/core/services/msg-template.service';
import { AuthService } from 'app/core/auth/auth.service';
import { CampaignService } from './../../campaign.service';
import { takeUntil } from 'rxjs/operators';
import { Location } from "@angular/common";

@Component({
    selector: 'app-details-campaigns',
    templateUrl: './details-campaigns.component.html',
    styleUrls: ['./details-campaigns.component.scss'],
})
export class DetailsCampaignsComponent implements OnInit, OnDestroy {

    @ViewChild(ListRecipientsComponent) _listRecipients: ListRecipientsComponent;

    labels$: Observable<Group[]>;

    targetSelected: string = "ALL";
    showAlert: boolean = false;
    composeForm: FormGroup;
    newCampaignInput: CreateCampaignInput;
    targetValues = ["ALL", "GROUP", "SELECTION"];
    showGroupId: boolean = false;
    isSelection: boolean = false;

    private _unsubscribeAll: Subject<any> = new Subject<any>();
    private clientId: string;

    constructor(
        private _formBuilder: FormBuilder,
        private _campaignService: CampaignService,
        private _msgsService: MsgsService,
        private _msgTemplateService: MsgTemplateService,
        private _auth: AuthService,
        private _location: Location,
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
            .then(resp => console.log("getLabels result", resp))
            .catch(error => console.log("Error", error));
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

    back() {
        // Back page
        //this._router.navigateByUrl("/campaign");
        this._location.back();
    }

    createCampaign() {
        const newCampaign: Campaign = this.composeForm.getRawValue();
        if (this.composeForm.invalid) {
            this.showAlert = true;
        } else {
            let campTartPromises: Promise<any>[] = []
            this._campaignService.createCampaign(newCampaign)
                .then((resp: CreateCampaignMutation) => {
                    if (this.targetSelected === 'SELECTION') {
                        // Create Items Selected
                        this._listRecipients.recipientTargets.forEach(element => {
                            campTartPromises.push(this._campaignService.createCampaignTarget(resp.id, element.id));
                        });
                        Promise.all(campTartPromises)
                            .then(() => {
                                // send campaign to backend
                                this._campaignService.sendCampaign(this.clientId, resp)
                                    .pipe(takeUntil(this._unsubscribeAll))
                                    .subscribe(response => {
                                        console.log("[createCampign] send Camaign to backend", response);
                                    });
                            })
                            .catch(error => console.log("Error", error));
                    } else {
                        // send campaign to backend
                        this._campaignService.sendCampaign(this.clientId, resp)
                            .pipe(takeUntil(this._unsubscribeAll))
                            .subscribe(response => {
                                console.log("[createCampign] send Camaign to backend", response);
                            });
                    }

                });
        }
    }

    showGroup(target) {
        this.targetSelected = target;
        if (target === 'GROUP') {
            this.showGroupId = true;
            this.isSelection = false;
            this.composeForm.controls['groupId'].setValidators(Validators.required);
        } else {
            this.showGroupId = false;
            this.composeForm.controls['groupId'].clearValidators();
            if (target === 'SELECTION') {
                this.isSelection = true;
            } else {
                this.isSelection = false;
            }
        }
        this.composeForm.controls['groupId'].updateValueAndValidity();
    }
}
