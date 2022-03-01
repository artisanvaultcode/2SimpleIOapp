import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-details-campaigns',
    templateUrl: './details-campaigns.component.html',
    styleUrls: ['./details-campaigns.component.scss'],
})
export class DetailsCampaignsComponent implements OnInit {

    // =========================== REVISAR
    /// @ViewChild(ListRecipientsComponent) _listRecipients: ListRecipientsComponent;
    @Output() closeOrCancelEvent: EventEmitter<any> = new EventEmitter<any>();

    msgDefault: string ="";
    daySelect: Date;
    typeSelected = 0;
    repeat = 2;
    hourIni = 8;
    minsIni = 30;
    onceSchedule: boolean = true;
    minDate: Date = new Date();
    isScheduler: boolean = false;
    // Shipping Schedule ============================ VER
    sendTypes = [
        {"type": 0, "value": "Right now"},
        {"type": 1, "value": "One hour later"},
        {"type": 2, "value": "Two hours later"},
        {"type": 3, "value": "Scheduled"}]

    constructor() {}

    ngOnInit(): void {
        // Set Day default
        this.daySelect = new Date();
        this.daySelect.setDate(this.daySelect.getDate() + 1);
    }

    closePanel(event: any): void {
        this.closeOrCancelEvent.emit('campDetails');
    }

    messageChange(msg) {
        this.msgDefault = msg;
    }

    sendTypeChange(event) {
        console.log("[Send Type] event", event);
        console.log("typeSelected", this.typeSelected);
        if (this.sendTypes[this.typeSelected]['value'] === 'Scheduled') {
            console.log("SELECTED SCHEDULED");
            this.isScheduler = true;
        } else {
            this.isScheduler = false;
        }
    }

    onClickDate(element) {
        console.log("[onClickDate] event", element, "\n\nId", element.id);
        if (element.id === 'op1') {
            this.onceSchedule = true;
        } else {
            this.onceSchedule = false;
        }
    }

    onDateChange(value) {
        console.log("[OnDateChange] SINGLE value", value);
    }

}
