import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheet, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatStepper } from '@angular/material/stepper';
import { of } from 'rxjs';
import {
    CampaignStatus,
    CampaignTargetOptions,
    CampaignTargetStatus,
    CampaignTypeOptions,
    CreateCampaignInput,
    CreateCampaignMutation,
    CreateCampaignTargetInput
} from '../../../../../API.service';
import { AuthService } from '../../../../../core/auth/auth.service';
import { CampaignService } from '../../campaign.service';

@Component({
    selector     : 'wizard',
    templateUrl  : './wizard.component.html',
    styleUrls: ['./wizard.component.scss']
})
export class WizardComponent implements OnInit {

    @ViewChild('horizontalStepper') stepper: MatStepper;

    scheduleType: string;
    campaignTypeSelected: string;
    onceSchedule: boolean = true;
    isRerun = false;

    dataInfo: any;
    dataMessage: string;
    dataTargets: any[];

    constructor(
        private _bottomSheet: MatBottomSheet,
        private _auth: AuthService,
        private _campaignService: CampaignService,
        @Inject(MAT_BOTTOM_SHEET_DATA) public campaignData: any,
        private _bottomSheetRef: MatBottomSheetRef<WizardComponent>
    ) {}

    ngOnInit(): void {
        if (this.campaignData) {
            this.isRerun = true;
            // set information and message
            this.setData(this.campaignData);
            // set targets
            of(this._campaignService.getCampaignsTarget(this.campaignData.id));
        } else {
            this.isRerun = false;
        }
    }

    setData(campaign: any): void {
        this.dataInfo = {
            cType: campaign.cType,
            name: campaign.name,
            target: campaign.target
        };
        this.dataMessage = campaign.message;
    }

    goStepperIndex(index: number): void {
        this.stepper.selectedIndex = index;
    }

    async saveCampaign(formInfo, formMessage, formSchedule, selectedTarget, groupTarget): Promise<any> {
        const {sub} = await this._auth.checkClientId();       // get clientId
        const temp: CreateCampaignInput = {
            id: null,
            clientId: sub,
            name: formInfo.name,
            target: formInfo.target,
            message: formMessage.message,
            cType: (formInfo.type === 'EXPRESS') ? CampaignTypeOptions.EXPRESS :
                CampaignTypeOptions.SCHEDULED,
            dateStart: formSchedule.date,
            timeStart: formSchedule.hours + ':' + formSchedule.minutes,
            epocStart: '' + (new Date(formSchedule.date.getFullYear()+
                '-'+(formSchedule.date.getMonth()+1)+
                '-'+formSchedule.date.getDate()+
                ' '+formSchedule.hours+':'+formSchedule.minutes).getTime()/1000),
            cStatus: CampaignStatus.DEFINED
        };
        this._campaignService.createCampaign(temp)
            .then((creCampMut: CreateCampaignMutation) => {
                const tempSchedule = {
                    campId: creCampMut.id,
                    sendType: 3,    // right now=0, one hour later=1, two hours later=2, scheduled=3
                                    // now we will use only scheduled
                    dateSchedule: formSchedule.date,
                    onceSend: (formSchedule.onceSend==='opt1')?0:1,
                    repeat: formSchedule.repeatCounter,
                    hourIni: formSchedule.hours,
                    minsIni: formSchedule.minutes
                };
                this._campaignService.scheduledCampaign(tempSchedule).subscribe(
                    (result: any) => {
                        console.log(result);
                        if(formInfo.target !== 'ALL') {
                            let targets = [];
                            if(formInfo.target === 'GROUP'){
                                groupTarget.forEach((item) => {
                                    const val: CreateCampaignTargetInput = {
                                        id: null,
                                        campaignId: creCampMut.id,
                                        groupId: item.id,
                                        lastProcessDt: new Date().toISOString(),
                                        status: CampaignTargetStatus.ACTIVE,
                                        type: CampaignTargetOptions.GROUP,
                                        campaignTargetGroupId: item.id
                                    };
                                    targets.push(this._campaignService.createCampaignTarget(val));
                                });
                            } else {
                                selectedTarget.forEach((item) => {
                                    const val: CreateCampaignTargetInput = {
                                        id: null,
                                        campaignId: creCampMut.id,
                                        recipientId: item.id,
                                        lastProcessDt: new Date().toISOString(),
                                        status: CampaignTargetStatus.ACTIVE,
                                        type: CampaignTargetOptions.SELECTION,
                                        campaignTargetRecipientId: item.id
                                    };
                                    targets.push(this._campaignService.createCampaignTarget(val));
                                });
                            }
                            Promise.all(targets)
                                .then((values) => {
                                    this._campaignService.searchCampaigns('');
                                    this._bottomSheetRef.dismiss();
                                });
                        } else {
                            this._campaignService.searchCampaigns('');
                            this._bottomSheetRef.dismiss();
                        }
                    }
                );
            })
            .catch(error => console.log(error));
    }

    cancel($event): void {
        this._bottomSheetRef.dismiss();
    }
}

