import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import {BehaviorSubject, Observable, of, Subject} from 'rxjs';
import { DevicesService } from '../../devices.service';
import {debounceTime, switchMap, takeUntil} from 'rxjs/operators';
import { APIService, Device } from '../../../../../API.service';
import { WebsocketService } from 'app/core/services/ws.service';
import { MatDialog } from '@angular/material/dialog';
import { MetadatadialogComponent } from '../metadatadialog/metadatadialog.component';
import {SendMessageDialogComponent} from '../send-message/send-message-dialog.component';
import {AuthService} from '../../../../../core/auth/auth.service';
import {ApiDevicesService} from '../../api-devices.service';
import {DeviceRegistrationDialogComponent} from '../device-registration/device-registration-dialog..component';

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

    testMessage: 'Test Message from 2Simple Text';
    searchQuery$: BehaviorSubject<string> = new BehaviorSubject(null);
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _deviceServices: DevicesService,
        private _apiDevicesService: ApiDevicesService,
        private api: APIService,
        private _auth: AuthService,
        private _ws: WebsocketService,
        private _matDialog: MatDialog
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

        // Filter
        this.searchQuery$
            .pipe(
                takeUntil(this._unsubscribeAll),
                debounceTime(150),
                switchMap(query =>
                    of(this._deviceServices.searchDevices(query))
                )
            ).subscribe();
    }

    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
    // eslint-disable-next-line @typescript-eslint/member-ordering
    filterByQuery(query: string): void
    {
        this.searchQuery$.next(query);
    }
    /**
     * Update data in UI
     *
     * @param newDevice
     */
    onUpdateRefreshDataset(newDevice: Device): void {
        this.devices$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((devs: Device[]) => {
            devs.forEach((dev: Device) => {
                if (dev.id === newDevice.id) {
                    for (const property in dev) {
                        dev[property] = newDevice[property];
                    }
                }
            });
        });
    }


    async sendSmsMessages(sendDevices: any[]): Promise<void> {
        const {sub} = await this._auth.checkClientId();
        const dialogRef = this._matDialog.open(SendMessageDialogComponent, {
            data: {
                sendDevices: sendDevices
            }
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this._apiDevicesService.sendMessages(sendDevices, result.phoneNumber, sub, this.testMessage)
                    .pipe(takeUntil(this._unsubscribeAll))
                    .subscribe((data) => {
                        console.log(data);
                    });
            }
            console.log('The dialog was closed', result);

        });
        return Promise.resolve();
    }
    /**
     * Send message to pusher server
     * Cheking Status sender devices
     *
     * @param event
     */
    async checkDeviceStatus(event: Event): Promise<void>  {
        const {sub} = await this._auth.checkClientId();
        this._apiDevicesService.deviceStatusCheck(sub)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((data) => {
                console.log(data);
            });
        return Promise.resolve();
    }

    /**
     * Check selected row
     *
     * @param allb
     * @param deviceEle
     * @param event
     */
    updateCheck(allb: boolean, deviceEle?: Device, event?: Event): void {
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
                    });
                });
            } else {
              this.devicesArray = [];
                this.devices$.subscribe((devs: Device[]) => {
                    devs.forEach((dev: Device) => {
                        const chkt = document.getElementsByName(dev.uniqueId);
                        chkt[0]['checked'] = false;
                    });
                });
            }
        } else {
            const checkedSt = event.target['checked'];
            if (checkedSt) {
                const index = this.devicesArray.indexOf(deviceEle);
                if (index < 0) {this.devicesArray.push(deviceEle);}
                console.log(this.devicesArray);
            } else {
                const index = this.devicesArray.indexOf(deviceEle);
                if (index > -1) {this.devicesArray.splice(index, 1);}
                console.log(this.devicesArray);
            }
        }
    }

    metadataUpdate(eledev: Device): void {
        const dialogRef = this._matDialog.open(MetadatadialogComponent, {
            data: { devselect: eledev}
        });
        dialogRef.afterClosed().subscribe((result) => {});
    }

    async registerDevice(): Promise<void> {
        const { sub } = await this._auth.checkClientId();
        const rNumber = `${this.S4()}-${this.S4()}`;
        const dialogRef = this._matDialog.open(DeviceRegistrationDialogComponent, {
            data: { randomNumber: rNumber.toUpperCase()}
        });
        dialogRef.afterClosed().subscribe((result) => {
            this._apiDevicesService.deviceRegistration(rNumber, sub)
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe((data) => {
                    console.log(data);
                });
        });
        return Promise.resolve();
    }

    private S4(): string {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }
}
