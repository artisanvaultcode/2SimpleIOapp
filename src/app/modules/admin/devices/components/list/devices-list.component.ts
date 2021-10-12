/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { DevicesService } from '../../devices.service';
import { takeUntil } from 'rxjs/operators';
import { APIService, Device } from '../../../../../API.service';
import { WebsocketService } from 'app/core/services/ws.service';
import { MatDialog } from '@angular/material/dialog';
import { MetadatadialogComponent } from '../metadatadialog/metadatadialog.component';

@Component({
    selector: 'app-devices-list',
    templateUrl: './devices-list.component.html',
    styleUrls: ['./devices-list.component.scss'],
})
export class DevicesListComponent implements OnInit, OnDestroy {
    devices$: Observable<any[]>;
    nextPage$: Observable<any[]>;

    devicesArray: Device[] = [];
    devicesCount: number = 0;
    devicesTableColumns: string[] = [
        'Sent',
        'uniqueId',
        'description',
        'phoneTxt',
        'status',
        'metadata',
        'controls',
    ];
    action: string = 'update';
    newItem: any;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _deviceServices: DevicesService,
        private api: APIService,
        private _ws: WebsocketService,
        private _matDialog: MatDialog,
    ) {}

    ngOnInit(): void {
        /**
         * Get Devices
         */
        this.devices$ = this._deviceServices.devices$;
        this.nextPage$ = this._deviceServices.nextPage$;
        this._deviceServices.devices$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((devices: any[]) => {
                // Update the counts
                this.devicesCount = devices.length;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
        /**
         * Subscribe Update Listener
         */
        this.api.OnUpdateDeviceListener.subscribe((msg) => {
            const data = msg.value.data;
            const newDevice: Device = data['onUpdateDevice'];
            console.log('Subscriber New', data);
            this.newItem = newDevice;
            this._changeDetectorRef.detectChanges();
            this.onUpdateRefreshDataset(newDevice);
        });
    }

    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    /**
     * Update data in UI
     * @param newDevice
     */
    onUpdateRefreshDataset(newDevice: Device) {
        console.log(this.devices$);
        this.devices$.subscribe((devs: Device[]) => {
            devs.forEach((dev: Device) => {
                if (dev.id === newDevice.id) {
                    for (const property in dev) {
                        dev[property] = newDevice[property];
                    }
                }
            });
        });
    }

    /**
     * Send message to pusher server
     * Cheking Status sender devices
     * @param event
     */
    checkDevices(event: Event) {
        console.log('Devices Verify Message Send');
        // this.channel.trigger('client-events', {message: 'Hello, check devices!'})
        this._ws.chkDevices().subscribe((resp) => {
            console.log(resp);
        });
    }

    /**
     * Check selected row
     *
     * @param allb
     * @param deviceEle
     * @param event
     */
    updateCheck(allb: boolean, deviceEle?: Device, event?: Event) {
        if (allb) {
            const checkedSt = event.target['checked'];
            console.log('checked', event.target['checked']);
            if (checkedSt) {
                this.devicesArray = [];
                this.devices$.subscribe((devs: Device[]) => {
                    devs.forEach((dev: Device) => {
                        this.devicesArray.push(dev);
                        const chkt = document.getElementsByName(dev.uniqueId);
                        chkt[0]['checked'] = true;
                    })
                });
            } else {
              this.devicesArray = [];
                this.devices$.subscribe((devs: Device[]) => {
                    devs.forEach((dev: Device) => {
                        const chkt = document.getElementsByName(dev.uniqueId);
                        chkt[0]['checked'] = false;
                    })
                });
            }
            console.log("array", this.devicesArray);
        } else {
            const checkedSt = event.target['checked'];
            if (checkedSt) {
                const index = this.devicesArray.indexOf(deviceEle);
                if (index < 0) this.devicesArray.push(deviceEle);
                console.log(this.devicesArray);
            } else {
                const index = this.devicesArray.indexOf(deviceEle);
                if (index > -1) this.devicesArray.splice(index, 1);
                console.log(this.devicesArray);
            }
        }
    }

    metadataUpdate(eledev: Device) {
        const dialogRef = this._matDialog.open(MetadatadialogComponent, {
            data: {
                devselect: eledev
            }
        });
        dialogRef.afterClosed().subscribe(result => {
          console.log('The dialog was closed', result);

        });
    }
}
