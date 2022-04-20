import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
    selector: 'wizard-confirm',
    templateUrl: './wizard-confirm.component.html',
    styleUrls: ['./wizard-confirm.component.scss']
})
export class WizardConfirmComponent implements OnInit {

    @Output() cancel = new EventEmitter<any>();
    @Output() saveData = new EventEmitter<any>();

    @Input() files: any[];
    @Input() groups: any[];
    @Input() recipients: any[];

    constructor() { }

    ngOnInit(): void {}

    save(): void {
        this.saveData.emit({recipients: this.recipients, group: this.groups});
    }

    close(): any {
        this.cancel.emit();
    }
}
