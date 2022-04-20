import { Component, Inject, OnInit } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheet, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { FuseConfirmationService } from '../../../../../../@fuse/services/confirmation';

@Component({
    selector: 'wizard',
    templateUrl: './wizard.component.html',
    styleUrls: ['./wizard.component.scss']
})
export class WizardComponent implements OnInit {

    MAX_RECIPIENTS = 100;

    constructor(
        private _bottomSheet: MatBottomSheet,
        @Inject(MAT_BOTTOM_SHEET_DATA) public campaignData: any,
        private _bottomSheetRef: MatBottomSheetRef<WizardComponent>,
        private _fuseConfirmationService: FuseConfirmationService,
    ) {}

    ngOnInit(): void {}

    cancel(event): void {
        this._bottomSheetRef.dismiss();
    }

    save($event): void {
        if($event.recipients.length > this.MAX_RECIPIENTS) {
            // Open the confirmation dialog
            const confirmation = this._fuseConfirmationService.open({
                title: 'Save',
                message:
                    'You can only record 100 recipients, do you want to continue?!',
                actions: {
                    confirm: {
                        label: 'Save',
                    },
                },
            });

            // Subscribe to the confirmation dialog closed action
            confirmation.afterClosed().subscribe((result) => {
                // If the confirm button pressed...
                if (result === 'confirmed') {
                    this._bottomSheetRef.dismiss($event);
                }
            });
        } else {
            this._bottomSheetRef.dismiss($event);
        }
    }
}
