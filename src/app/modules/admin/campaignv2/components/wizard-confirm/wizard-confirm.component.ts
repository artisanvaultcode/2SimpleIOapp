import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
    selector: 'app-wizard-confirm',
    templateUrl: './wizard-confirm.component.html',
    styleUrls: ['./wizard-confirm.component.scss']
})
export class WizardConfirmComponent implements OnInit {

    @Output() cancel = new EventEmitter<any>();

    @Input() formInfo: any;         // step1
    @Input() formMessage: any;      // step2
    @Input() formSchedule: any;     // step3

    @Output() saveData = new EventEmitter<any>();

    onceSchedule = true;
    scheduleType = 'GROUP';

    constructor() { }

    ngOnInit(): void {}

    save(): void {
        this.saveData.emit();
    }

    close(): any {
        this.cancel.emit();
    }
}
