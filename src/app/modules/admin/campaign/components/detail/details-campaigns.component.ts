import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MsgTemplateService } from 'app/core/services/msg-template.service';

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
    dt: any;
    typeSelected = 1;
    // Shipping Schedule ============================ VER
    sendTypes = [
        {"type": 0, "value": "Right now"},
        {"type": 1, "value": "One hour later"},
        {"type": 2, "value": "Two hours later"},
        {"type": 3, "value": "Scheduled"}]

    constructor(
        private _msgTemplateService: MsgTemplateService,
    ) {}

    ngOnInit(): void {

        this._msgTemplateService.getDefaultMsg()
            .then(resp => {
                document.getElementById('default-message').textContent = resp['message'];
                this.msgDefault = resp.message;
            })
            .catch(error => {
                console.log("[MsgTemplateMessage] Error:", error);
            });
        // Set Hour
        this.dt = new Date();
        this.dt.setHours( this.dt.getHours() + 1);
        console.log("An hour late:", this.dt);

    }

    closePanel(event: any): void {
        this.closeOrCancelEvent.emit('campDetails');
    }

    messageChange(msg) {
        console.log("change default message: ", msg);
        this.msgDefault = msg;
        console.log("msgDefault", this.msgDefault);
    }

    sendTypeChange(typeS: string) {
        console.log("Send Type", typeS);
        console.log("typeSelected", this.typeSelected);
    }
}
