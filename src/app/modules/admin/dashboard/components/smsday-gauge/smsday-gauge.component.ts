import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { EChartsOption } from 'echarts';
import { EchartsService } from '../../echarts.service';
import { AuthService } from 'app/core/auth/auth.service';
import { APIService } from 'app/API.service';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-smsday-gauge',
    templateUrl: './smsday-gauge.component.html',
    styleUrls: ['./smsday-gauge.component.scss'],
})
export class SmsdayGaugeComponent implements OnInit, OnDestroy {
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    _chartOption: EChartsOption;
    isDarkMode: boolean = false;
    _theme: string;
    countRow$: Observable<number>;
    rowCount: number = 0;
    clientid: string;

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _echartService: EchartsService,
        private api: APIService,
        private auth: AuthService
    ) {}

    ngOnInit(): void {
        this.countRow$ = this._echartService.countRow$;
        this.countRow$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((resp) => {
                // Update the counts
                this.rowCount = resp;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        this.auth.checkClientId().then((resp) => {
            this.clientid = resp['sub'];
            this._echartService.todaySms(this.clientid).then((rowco: number) => {
                this.setSeries(rowco);
            });
        });

        this.api.OnCreateHisSmsLogListener.subscribe((resp) => {
            this._echartService.todaySms(this.clientid).then((rowc) => {
                console.log('OnCreateListener...', rowc);
                this.setSeries(rowc);
            });
        });

    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    private setSeries(counts: number) {
        this._chartOption = {
            series: [
                {
                    type: 'gauge',
                    min: 0,
                    max: 3200,
                    splitNumber: 8,
                    radius: '70%',
                    axisLine: {
                        lineStyle: {
                            color: [[1, '#f00']],
                            width: 3,
                        },
                    },
                    splitLine: {
                        distance: -14,
                        length: 14,
                        lineStyle: {
                            color: '#f00',
                        },
                    },
                    axisTick: {
                        distance: -10,
                        length: 8,
                        lineStyle: {
                            color: '#f00',
                        },
                    },
                    axisLabel: {
                        distance: -36,
                        color: '#f00',
                        fontSize: 14,
                    },
                    anchor: {
                        show: true,
                        size: 20,
                        itemStyle: {
                            borderColor: '#000',
                            borderWidth: 2,
                        },
                    },
                    pointer: {
                        offsetCenter: [0, '10%'],
                        icon: 'path://M2090.36389,615.30999 L2090.36389,615.30999 C2091.48372,615.30999 2092.40383,616.194028 2092.44859,617.312956 L2096.90698,728.755929 C2097.05155,732.369577 2094.2393,735.416212 2090.62566,735.56078 C2090.53845,735.564269 2090.45117,735.566014 2090.36389,735.566014 L2090.36389,735.566014 C2086.74736,735.566014 2083.81557,732.63423 2083.81557,729.017692 C2083.81557,728.930412 2083.81732,728.84314 2083.82081,728.755929 L2088.2792,617.312956 C2088.32396,616.194028 2089.24407,615.30999 2090.36389,615.30999 Z',
                        length: '115%',
                        itemStyle: {
                            color: '#000',
                        },
                    },
                    detail: {
                        valueAnimation: true,
                        precision: 1,
                    },
                    title: {
                        offsetCenter: [0, '-50%'],
                        fontSize: 16,
                    },
                    data: [
                        {
                            value: counts,
                            name: '%',
                        },
                    ],
                },
                {
                    type: 'gauge',
                    min: 0,
                    max: 100,
                    splitNumber: 10,
                    radius: '64%',
                    axisLine: {
                        lineStyle: {
                            color: [[1, '#000']],
                            width: 3,
                        },
                    },
                    splitLine: {
                        distance: -3,
                        length: 10,
                        lineStyle: {
                            color: '#000',
                        },
                    },
                    axisTick: {
                        distance: 0,
                        length: 10,
                        lineStyle: {
                            color: '#000',
                        },
                    },
                    axisLabel: {
                        distance: 8,
                        fontSize: 10,
                        color: '#000',
                    },
                    pointer: {
                        show: false,
                    },
                    title: {
                        show: false,
                    },
                    anchor: {
                        show: true,
                        size: 10,
                        itemStyle: {
                            color: '#000',
                        },
                    },
                },
            ],
        };
    }
}
