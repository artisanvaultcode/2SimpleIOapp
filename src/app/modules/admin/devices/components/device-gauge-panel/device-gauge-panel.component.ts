import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    SimpleChanges, ViewChild,
    ViewEncapsulation
} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {AuthService} from 'app/core/auth/auth.service';
import {
    ApexNonAxisChartSeries,
    ApexPlotOptions,
    ApexChart,
    ApexFill,
    ChartComponent,
    ApexStroke
} from 'ng-apexcharts';
import {WebsocketService} from '../../../../../core/services/ws.service';
import {DevicesService} from "../../devices.service";
import {takeUntil} from "rxjs/operators";
import {ApiDevicesService} from "../../api-devices.service";

export type ChartOptions = {
    series: ApexNonAxisChartSeries;
    chart: ApexChart;
    labels: string[];
    plotOptions: ApexPlotOptions;
    fill: ApexFill;
    stroke: ApexStroke;
};

@Component({
    selector       : 'device-gauge-panel',
    templateUrl    : './device-gauge-panel.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeviceGaugePanelComponent implements OnInit, OnDestroy, OnChanges
{

    @Input()
    clientId: string;

    @Output()
    closeOrCancelEvent: EventEmitter<any> = new EventEmitter<any>();
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    // eslint-disable-next-line @typescript-eslint/member-ordering
    saveOrCreate: boolean;
    // eslint-disable-next-line @typescript-eslint/member-ordering
    chartOptions: Partial<ChartOptions>;
    @ViewChild('chart') chart: ChartComponent;

    // eslint-disable-next-line @typescript-eslint/member-ordering
    devicesId$: Observable<any[]>;
    // eslint-disable-next-line @typescript-eslint/member-ordering
    devicesId: any[];
    // eslint-disable-next-line @typescript-eslint/member-ordering
    currentDeviceId: string;
    // eslint-disable-next-line @typescript-eslint/member-ordering
    messages: any[] = [];
    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _auth: AuthService,
        private _deviceServices: DevicesService,
        private _apiDevicesService: ApiDevicesService,
        private _ws: WebsocketService
    )
    {
        this.saveOrCreate = false;
        this.chartOptions = {
            series: [0, 0],
            chart: {
                height: 300,
                type: 'radialBar',
                toolbar: {
                    show: false
                }
            },
            plotOptions: {
                radialBar: {
                    startAngle: -135,
                    endAngle: 225,
                    hollow: {
                        margin: 0,
                        size: '70%',
                        background: '#fff',
                        image: undefined,
                        position: 'front',
                        dropShadow: {
                            enabled: true,
                            top: 3,
                            left: 0,
                            blur: 4,
                            opacity: 0.24
                        }
                    },
                    track: {
                        background: '#fff',
                        strokeWidth: '67%',
                        margin: 0, // margin is in pixels
                        dropShadow: {
                            enabled: true,
                            top: -3,
                            left: 0,
                            blur: 4,
                            opacity: 0.35
                        }
                    },
                    dataLabels: {
                        show: true,
                        name: {
                            offsetY: -10,
                            show: true,
                            color: '#888',
                            fontSize: '17px'
                        },
                        value: {
                            formatter: function(val) {
                                return parseInt(val.toString(), 10).toString();
                            },
                            color: '#111',
                            fontSize: '36px',
                            show: true
                        }
                    }
                }
            },
            fill: {
                type: 'gradient',
                gradient: {
                    shade: 'dark',
                    type: 'horizontal',
                    shadeIntensity: 0.5,
                    gradientToColors: ['#ABE5A1'],
                    inverseColors: true,
                    opacityFrom: 1,
                    opacityTo: 1,
                    stops: [0, 100]
                }
            },
            stroke: {
                lineCap: 'butt'
            },
            labels: ['Sent', 'Not Sent' ]
        };
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.devicesId$ = this._deviceServices.deviceIds$;
        this._deviceServices.deviceIds$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((devices: any[]) =>{
                if (devices && devices.length>0) {
                    this.currentDeviceId = devices[0];
                    this.setConfiguration();
                    this.devicesId = devices;
                    this._apiDevicesService.sendAwakeTests(devices, this.clientId)
                        .pipe(takeUntil(this._unsubscribeAll))
                        .subscribe();
                }
        });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();

    }

    ngOnChanges(changes: SimpleChanges): void {
        const {clientId} = changes;
        // this._messagesService.activateProgressBar();
        if (clientId.currentValue) {
            const channel = `${this.clientId}-sync-ui`;
            console.log(channel);
            this._ws.subScribeToChannel([channel], (msg) => {
                console.log(msg);
                if (msg) {
                    this.setSeries( msg );

                    this.addOneToRecents(msg);
                }
            });
        } else {
            // this._messagesService.activateProgressBar('off');
        }
    }
    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------
    closePanel($event: any): void {
        this.closeOrCancelEvent.emit('device-gauge');
    }

    setDevice(deviceId: string): void {
        this.currentDeviceId = deviceId;
        this.setConfiguration();
        this._apiDevicesService.sendAwakeTests([deviceId], this.clientId)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe();
    }

    setSeries(data: any): void {
        const { metaData } = data;
        const { totals } = metaData;
        const foundIndex = this.devicesId.findIndex(item => item === this.currentDeviceId);
        if (foundIndex>-1) {
            this.chartOptions.series = [ totals.totalSent, totals.totalNotSent];
        }
        this._changeDetectorRef.detectChanges();
    }
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    setConfiguration() {
        this.chartOptions.labels = [ 'Sent' , 'NotSent'];
        this.chartOptions.series = [ 0, 0 ];
    }

    addOneToRecents(dataMsg: any): void {
        if (this.messages.length + 1 > 3) {
            this.messages.shift();
        }
        const {command, UniqueId, data, metaData } = dataMsg;
        if (UniqueId === this.currentDeviceId) {
            switch(command) {
                case 'PING':
                    this.messages.push({
                        title: command,
                        subtitle: metaData.createdAt,
                        content: data.answer
                    });
                    break;
                case 'SMS':
                    const { message, phone } = data;
                    this.messages.push({
                        title: phone,
                        subtitle: metaData.createdAt,
                        content: message
                    });
                    break;
                default:
                    break;
            }
            this._changeDetectorRef.detectChanges();
        }
    }
}
