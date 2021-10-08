import { Component, Input, OnInit } from '@angular/core';
import { WebsocketService } from 'app/core/services/ws.service';
import { DevicesService } from '../../devices.service';
import {Device, EntityStatus} from '../../../../../API.service';

@Component({
  selector: 'app-control',
  templateUrl: './control.component.html',
  styleUrls: ['./control.component.scss']
})
export class ControlComponent implements OnInit {

  @Input() deviceEle: Device;
  @Input() devicesAry: Device[];
  @Input() isAll: boolean = false;
  active: boolean;
  inactive: boolean;
  sendb: boolean;

  constructor(
    private _ws: WebsocketService,
    private _devServices: DevicesService,
  ) { }

  ngOnInit(): void {
    this.setStatusVar();
    if (this.isAll) {console.log('all controls');}
  }

  setStatusVar() {
    if (this.isAll) {
      console.log('ngOnInit undefined');
      this.active = false;
      this.inactive = false;
      this.sendb = false;
    } else {
      this.active = (this.deviceEle.status == 'ACTIVE');
      this.inactive = (this.deviceEle.status == 'INACTIVE');
      this.sendb = !(this.deviceEle.status == 'ACTIVE');
    }
  }

  letActive(): void{
    if (this.isAll) {
      console.log('Activate deviceArray...', this.devicesAry);
      if (this.devicesAry.length > 0) {
        this.devicesAry.forEach((ele) => {
          this._devServices.updateDevice(ele, EntityStatus.ACTIVE);
        });
      }
    } else {
      this._devServices.updateDevice(this.deviceEle, EntityStatus.ACTIVE);
      this.deviceEle.status = EntityStatus.ACTIVE;
      console.log('Activate...');
      this.setStatusVar();
    };
  }

  letInactive(): void{
    if (this.isAll) {
      console.log('Deactivate deviceArray...', this.devicesAry);
      if (this.devicesAry.length > 0) {
        this.devicesAry.forEach((ele) => {
          this._devServices.updateDevice(ele, EntityStatus.INACTIVE);
        });
      }
    } else {
      this._devServices.updateDevice(this.deviceEle, EntityStatus.INACTIVE);
      console.log('Deactivate...');
      this.deviceEle.status = EntityStatus.INACTIVE;
      this.setStatusVar();
    };
  }

  sendMessage(ids: string[]): void{
    console.log('numero', ids.length);
    if (ids.length > 0){
      ids.forEach((phoid) => {
        console.log('Send to:', phoid, '@Input', this.deviceEle.uniqueId);
        this._ws.sendMsg('720b7167-494a-4a9f-942c-d7b0269703b8',
            phoid, '477c9932-6096-4b51-bb60-e309e99c8201')
            .subscribe((resp) => {
              console.log('Send Message Response:', resp);
            });
      });
    }

  }
}
