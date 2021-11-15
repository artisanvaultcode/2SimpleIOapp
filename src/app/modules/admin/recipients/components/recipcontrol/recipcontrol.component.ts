import { Component, Input, OnChanges,
    OnDestroy, OnInit, SimpleChanges }
    from '@angular/core';
import { EntityStatus, Recipient } from 'app/API.service';
import { Subject } from 'rxjs';
import { RecipientsService } from './../../recipients.service';

@Component({
  selector: 'app-recipcontrol',
  templateUrl: './recipcontrol.component.html',
  styleUrls: ['./recipcontrol.component.scss']
})
export class RecipcontrolComponent implements OnInit, OnChanges, OnDestroy {

    @Input() recipientEle: Recipient;

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private _recipService: RecipientsService
    ) { }

    ngOnInit(): void {}

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.recipientEle && changes.recipientEle.currentValue) {
          this.recipientEle = changes.recipientEle.currentValue;
        }
    }

    setWBList(recipient: any[], status: string): void {
        let wbl: EntityStatus;
        if (status === 'WL'){
            wbl = EntityStatus.WL;
        } else {
            wbl = EntityStatus.BL;
        }
        this._recipService.updateRecipientStatus(recipient, wbl)
            .then(resp => {
                this.recipientEle = resp;
            });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

}
