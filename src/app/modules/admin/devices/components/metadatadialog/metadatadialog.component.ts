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
    selector: 'app-metadatadialog',
    templateUrl: './metadatadialog.component.html',
    styleUrls: ['./metadatadialog.component.scss'],
})
export class MetadatadialogComponent implements OnInit {
    metaForm: FormGroup;
    metadata: metadataIF;

    constructor(
        public dialogRef: MatDialogRef<MetadatadialogComponent>,
        private _formBuilder: FormBuilder,
        private _devService: DevicesService,
        @Inject(MAT_DIALOG_DATA) public data: DialogData
    ) {}

    ngOnInit(): void {
        this.metaForm = this._formBuilder.group({
            readRecords: [''],
            timeFrameMin: [''],
        });
        this.metadata = JSON.parse(this.data.devselect.metadata);
        this.metaForm.patchValue(this.metadata.frequency);
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    onNoClick(): void {
        this.dialogRef.close();
    }

    /**
     * Save and close
     */
    saveAndClose(): void {
        const freqrawdata = this.metaForm.getRawValue();
        this.metadata.frequency = freqrawdata;
        console.log('Nuevos valores freq', freqrawdata, this.metadata);
        // Save data
        this._devService.updateMetadataDevice(this.data.devselect, JSON.stringify(this.metadata))
        // Update data on UI
        this.data.devselect.metadata = JSON.stringify(this.metadata);
        // Close the dialog
        this.dialogRef.close();
    }
}
