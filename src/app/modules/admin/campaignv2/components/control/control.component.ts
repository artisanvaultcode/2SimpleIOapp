import { CampaignService } from './../../campaign.service';
import { Component, Input, OnInit, SimpleChanges, OnChanges, Output, EventEmitter } from '@angular/core';
import { Campaign, SubsStatus } from 'app/API.service';
import { FuseConfirmationService } from '../../../../../../@fuse/services/confirmation';
import { of } from 'rxjs';

@Component({
    selector: 'app-control',
    templateUrl: './control.component.html',
    styleUrls: ['./control.component.scss'],
})
export class ControlComponent implements OnInit, OnChanges {
    @Input() campaignEle: Campaign;
    @Input() campaignArr: Campaign[] = [];
    @Input() campaignStatusAll: string;
    @Input() campaignStatus: string;
    @Input() disabled: boolean;

    @Output() rerun = new EventEmitter<Campaign>();

    constructor(
        private _campaignService: CampaignService,
        private _fuseConfirmationService: FuseConfirmationService,
    ) {}

    ngOnInit(): void {}

    ngOnChanges(changes: SimpleChanges): void {}

    activateCampaign(campaignEle: Campaign, status: SubsStatus): void {
        this._campaignService.activateProgressBar('on');
        this._campaignService.campaignStatus(campaignEle, status)
            .then((resp) => {
                this._campaignService.activateProgressBar('off');
            })
            .catch((error) => {
                console.log(error);
                this._campaignService.activateProgressBar('off');
            });
    }

    statusAllCampaign(status: SubsStatus): void {
        if(this.campaignArr.length > 0) {
            this._campaignService.activateProgressBar('on');
            this._campaignService.allCampaignStatus(this.campaignArr, status)
                .subscribe(
                    (result)=> {
                        this._campaignService.activateProgressBar('off');
                    },
                    (error) => {
                        console.log(error);
                        this._campaignService.activateProgressBar('off');
                    }
                );
        }
    }

    deleteCampaign(campaignEle: Campaign): void {
        const confirmation = this._fuseConfirmationService.open({
            title  : 'Delete campaign',
            message: 'Are you sure you want to delete this campaign? This action cannot be undone!',
            actions: {
                confirm: {
                    label: 'Delete'
                }
            }
        });

        confirmation.afterClosed().subscribe((result) => {
            // If the confirm button pressed...
            if ( result === 'confirmed' ) {
                of(this._campaignService.deleteCampaign(campaignEle));
            }
        });
    }

    deleteMultipleCampaigns(): void {
        const confirmation = this._fuseConfirmationService.open({
            title  : 'Delete campaigns',
            message: 'Are you sure you want to delete these campaigns? This action cannot be undone!',
            actions: {
                confirm: {
                    label: 'Delete'
                }
            }
        });

        confirmation.afterClosed().subscribe((result) => {
            // If the confirm button pressed...
            if ( result === 'confirmed' ) {
                this._campaignService.deleteMultipleCampaigns(this.campaignArr);
            }
        });
    }

    openRerun(campaignEle: Campaign): void {
        this.rerun.emit(campaignEle);
    }
}
