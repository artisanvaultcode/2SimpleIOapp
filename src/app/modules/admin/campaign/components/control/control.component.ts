import { CampaignService } from './../../campaign.service';
import { Component, Input, OnInit, SimpleChanges, OnChanges } from '@angular/core';
import { Campaign, SubsStatus } from 'app/API.service';

@Component({
    selector: 'app-control',
    templateUrl: './control.component.html',
    styleUrls: ['./control.component.scss'],
})
export class ControlComponent implements OnInit, OnChanges {
    @Input() campaignEle: Campaign;
    @Input() clientId: string;
    @Input() campaignStatus: string;

    constructor(
        private _campaignService: CampaignService,
    ) {}

    ngOnInit(): void {}

    ngOnChanges(changes: SimpleChanges) {
        if (changes.campaignEle && changes.campaignEle.currentValue) {
            this.campaignEle = changes.campaignEle.currentValue;
        }
        if (changes.clientId && changes.clientId.currentValue) {
            this.clientId = changes.clientId.currentValue;
        }
        if (changes.campaignStatus && changes.campaignStatus.currentValue) {
            this.campaignStatus = changes.campaignStatus.currentValue;
        }
    }

    activateCampaign(campaignEle: Campaign, status: SubsStatus) {
        console.log("[activateCampaign] Campaign", campaignEle, " Status ", status)
        this._campaignService.campaignStatus(campaignEle, status)
            .then(resp => console.log("Update campaign ", resp))
            .catch(error => console.log(error));
    }
}
