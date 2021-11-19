import {
    ChangeDetectorRef,
    Component,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    SimpleChanges,
} from '@angular/core';
import { AthenaService } from '../../athena.service';
import { curveBumpX } from 'd3-shape';
import { timer, Subject, Subscription } from 'rxjs';
import { Hub } from 'aws-amplify';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-sms-overview',
    templateUrl: './sms-overview.component.html',
    styleUrls: ['./sms-overview.component.scss'],
})
export class SmsOverviewComponent implements OnInit, OnChanges, OnDestroy {
    @Input() datefilter: string;
    @Input() clientId: string;
    firstLoad = true;
    isLoading: boolean;
    // options
    legend: boolean = false;
    showLabels: boolean = true;
    animations: boolean = true;
    xAxis: boolean = true;
    yAxis: boolean = true;
    showYAxisLabel: boolean = true;
    showXAxisLabel: boolean = true;
    yAxisLabel: string = 'Total sent daily';
    timeline: boolean = true;

    basisCurve = curveBumpX;
    gradient = true;

    colorScheme = 'cool';

    datosY = [];
    datosM = [];

    private _unsubscribeAll: Subject<any> = new Subject<any>();
    private timerObserver: Subscription;

    constructor(
        private _athena: AthenaService,
        private _changeDetectorRef: ChangeDetectorRef
    ) {
        Hub.listen('processing', (data) => {
            if (data.payload.event === 'progressbar') {
                this.isLoading = data.payload.data.activate === 'on';
                this._changeDetectorRef.markForCheck();
            }
        });
    }

    ngOnInit(): void {
        let timer$ = timer(2000, 5000);
        this.timerObserver = timer$.subscribe(() => this._changeDetectorRef.markForCheck());
        this.activateProgressBar()
    }

    ngOnChanges(changes: SimpleChanges): void {
        const {clientId, datefilter} = changes;
        if (clientId && clientId.currentValue){
            this.getDataYear();
        }
        if (datefilter && datefilter.currentValue && this.clientId){
            if (this.firstLoad) {
                this.getDataMonth();
                this.firstLoad = false;
            }
        }
    }

    ngOnDestroy() {
        this.timerObserver.unsubscribe();
    }

    getDataYear() {
        this.activateProgressBar()
        this._athena.dbSmsOverview(this.clientId, this.thisYear)
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe((response) => {
                    const dateArray = this.distinctArray(response['result'], 0);
                    const devArray = this.distinctArray(response['result'], 1);
                    this.datosY = this.objSeries(devArray, response['result'], dateArray);
                    this.activateProgressBar('off');
            });
    }

    getDataMonth() {
        this.activateProgressBar()
        this._athena.dbSmsOverviewMonth(this.clientId)
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe((response) => {
                    const dateArray = this.distinctArray(response['result'], 0);
                    const devArray = this.distinctArray(response['result'], 1);
                    this.datosM = this.objSeries(devArray, response['result'], dateArray);
                    this.activateProgressBar('off');
            });
    }

    objSeries(devArray: any[], dataArray: any[], dateArray: any[]): any[] {
        let objSer = [];
        devArray.forEach((item) => {
            const ele = {
                name: item,
                series: [],
            };
            objSer.push(ele);
        });
        dateArray.forEach(date => {
            let devTmp = devArray;
            let dataTmp = dataArray.filter(x => x[0] === date);
            dataTmp.forEach(dt => {
                let objTmp = objSer.filter(x => x.name === dt[1]);
                const ser = {
                    name: date,
                    value: dt[2]
                };
                objTmp[0].series.push(ser);
                devTmp = devTmp.filter(x => x !== dt[1]);
            });
            const ser1 = {
                name: date,
                value: 0
            };
            devTmp.forEach(devt => {
                let objTmp = objSer.filter(x => x.name === devt);
                objTmp[0].series.push(ser1);
            });
        });
        return objSer;
    }

    distinctArray(array: any[], idx: number): any[]{
        const uniques = array.map(item => item[idx])
          .filter((value, index, self) => self.indexOf(value) === index);
        return uniques
    }

    objBase(devs: any[], dats: any[]): any[] {
        let objbase = [];
        devs.forEach((elem) => {
            let serie = [];
            dats.forEach((dt) => {
                const ser = {
                    name: dt[0],
                    value: 0,
                };
                serie.push(ser);
            });
            const ele = {
                name: elem[0],
                series: serie,
            };
            objbase.push(ele);
        });
        return objbase;
    }

    activateProgressBar(active = 'on') {
        Hub.dispatch('processing', {
            event: 'progressbar',
            data: {
                activate: active,
            },
        });
    }

    get thisYear(): string{
        const dt = new Date().getFullYear();
        return dt.toString();
    }

    get multi() {
        if (this.datefilter === 'YEAR') {
            return this.datosY;
        } else {
            return this.datosM;
        }
    }
}
