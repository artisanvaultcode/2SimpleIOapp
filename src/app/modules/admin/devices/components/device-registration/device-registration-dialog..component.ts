import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
    selector: 'add-phone-dialog',
    templateUrl: './device-registration-dialog.component.html'
})
export class DeviceRegistrationDialogComponent implements OnInit {
    metaForm: FormGroup;

    constructor(
        public dialogRef: MatDialogRef<DeviceRegistrationDialogComponent>,
        private _formBuilder: FormBuilder,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {}

    ngOnInit(): void {
        this.metaForm = this._formBuilder.group({
            regNumber: [this.data.randomNumber]
        });
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
