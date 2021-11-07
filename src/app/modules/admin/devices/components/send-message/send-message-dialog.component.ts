import { Component, Inject, OnInit } from '@angular/core';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { FormBuilder, FormGroup } from '@angular/forms';
import { Device } from 'app/API.service';
import { DevicesService } from '../../devices.service';

export interface DialogData {
    devselect: Device;
}
export interface metadataIF {
    totals: {
        totalSent: string;
        totalNotSent: string;
    };
    frequency: {
        readRecords: string;
        timeFrameMin: string;
    };
}

@Component({
    selector: 'ask-phone-dialog',
    templateUrl: './send-message-dialog.component.html'
})
export class SendMessageDialogComponent implements OnInit {
    metaForm: FormGroup;
    devices: any[];

    constructor(
        public dialogRef: MatDialogRef<SendMessageDialogComponent>,
        private _formBuilder: FormBuilder,
        @Inject(MAT_DIALOG_DATA) public data: DialogData
    ) {}

    ngOnInit(): void {
        this.metaForm = this._formBuilder.group({
            phoneNumber: ['+1']
        });
        console.log(this.data);
        this.devices = this.data['sendDevices'];
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    closeDialog(): void {
        this.dialogRef.close();
    }

    /**
     * Save and close
     */
    send(): void {
        const formData = this.metaForm.getRawValue();
        this.dialogRef.close(formData);
    }
}
