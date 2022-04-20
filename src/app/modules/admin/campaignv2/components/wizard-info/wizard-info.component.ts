import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-wizard-info',
    templateUrl: './wizard-info.component.html',
    styleUrls: ['./wizard-info.component.scss']
})
export class WizardInfoComponent implements OnInit {
    @Output() cancel = new EventEmitter<any>();
    @Input() dataInfo: any;

    formInfo: FormGroup;
    campaignTypeSelected: string;
    campaignTypes = ['EXPRESS', 'SCHEDULED'];
    targetValues = ['ALL', 'GROUP', 'SELECTION'];

    constructor(
      private _formBuilder: FormBuilder,
    ) {
        this.formInfo = this._formBuilder.group({
            name: ['', [Validators.required, Validators.minLength(2)]],
            type: ['', [Validators.required]],
            target: ['', [Validators.required]],
            groupId: [''],
        });
    }

    ngOnInit(): void {
        if(this.dataInfo) {
            this.formInfo.get('name').setValue(this.dataInfo.name);
            this.formInfo.get('type').setValue(this.dataInfo.cType);
            this.formInfo.get('target').setValue(this.dataInfo.target);
        }
    }

    get formGroup(): any {
        return this.formInfo.value;
    }

    get formData(): any {
        return this.formInfo.value;
    }

    typeChange(event: any): void {
        this.campaignTypeSelected = event.value;
        this.formInfo.get('target').setValue('');
    }

    close(): void {
        this.cancel.emit();
    }
}
