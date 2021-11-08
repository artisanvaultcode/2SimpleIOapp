import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core';
import { WebsocketService } from 'app/core/services/ws.service';
import { DevicesService } from '../../devices.service';
import {Device} from '../../../../../API.service';
import {ApiDevicesService} from '../../api-devices.service';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-control',
  templateUrl: './control.component.html',
  styleUrls: ['./control.component.scss']
})
export class ControlComponent implements OnInit, OnChanges, OnDestroy {

    @Input() deviceEle: Device;
    @Input() devicesAry: Device[];
    @Input() clientId: string;
    @Input() isAll: boolean = false;

    @Output() doSendMessage: EventEmitter<any> = new EventEmitter<any>();
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private _ws: WebsocketService,
        private _devServices: DevicesService,
        private _apiDevicesService: ApiDevicesService
    ) { }

    ngOnInit(): void {}

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.deviceEle && changes.deviceEle.currentValue) {
          this.deviceEle = changes.deviceEle.currentValue;
        }
        if (changes.devicesAry && changes.devicesAry.currentValue) {
          this.devicesAry = changes.devicesAry.currentValue;
        }
        if (changes.isAll && changes.isAll.currentValue) {
          this.isAll = changes.isAll.currentValue;
        }
        if (changes.clientId && changes.clientId.currentValue) {
            this.clientId = changes.clientId.currentValue;
        }
    }

    activateDevice(devices: any[], status: string): void {
        const ids = [];
        devices.forEach((item) => {
            ids.push(item.uniqueId);
        });

        if(this.isAll && this.clientId) {
            this._apiDevicesService.deviceStatus(ids, status, this.clientId)
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe((response) => {
                    console.log(response);
                });
        }
        if(!this.isAll && this.clientId) {
            this._apiDevicesService.deviceStatus(ids[0], status, this.clientId)
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe((response) => {
                    console.log(response);
                });
        }
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    testSendMessage(devices: any[]): void {
        const ids = [];
        devices.forEach((item) => {
            ids.push(item.uniqueId);
        });
        this.doSendMessage.next(ids);
    }
}
