import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-wizard-schedule',
    templateUrl: './wizard-schedule.component.html',
    styleUrls: ['./wizard-schedule.component.scss']
})
export class WizardScheduleComponent implements OnInit, OnChanges {

    @Output() cancel = new EventEmitter<any>();
    @Input() campaignTypeSelected: string;

    formSchedule: FormGroup;
    scheduleType: string;
    onceSchedule: boolean = true;
    todayDate: Date = new Date();
    minDateScheduled: Date = new Date();

    constructor(
        private _formBuilder: FormBuilder
    ) {
        this.minDateScheduled.setDate(this.todayDate.getDate() + 1);
        this.formSchedule = this._formBuilder.group({
            scheduleType: [''],
            date: [this.minDateScheduled, Validators.required],
            repeatCounter: [2],
            hours: [6, Validators.required],
            minutes: [10, Validators.required],
            onceSend: ['opt1']
        });
    }

    ngOnInit(): void {

    }

    ngOnChanges(changes: SimpleChanges): void {
        if (this.campaignTypeSelected) {
            if (this.campaignTypeSelected === 'EXPRESS') {
                this.formSchedule.get('date').disable();
                this.formSchedule.get('date').setValue(this.todayDate);
            } else if (this.campaignTypeSelected === 'SCHEDULED'){
                this.formSchedule.get('date').setValue(this.minDateScheduled);
                this.formSchedule.get('date').enable();
            }
        }
    }

    close(): any {
        this.cancel.emit();
    }
}
