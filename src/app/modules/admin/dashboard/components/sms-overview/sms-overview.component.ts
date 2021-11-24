import {
    ChangeDetectorRef,
    Component,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    SimpleChanges,
} from '@angular/core';
import { DataService } from '../../data.service';
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
        private _data: DataService,
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
        const {clientId} = changes;
        if (clientId && clientId.currentValue){
            this.getDataYear();
        }
    }

    ngOnDestroy() {
        this.timerObserver.unsubscribe();
    }

    getDataYear() {
        this.activateProgressBar()
        this._data.dbSmsOverview(this.clientId, this.thisYear)
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe((response) => {
                    this.datosY = response['resultYear'];
                    this.datosM = response['resultMonth'];
                    this.activateProgressBar('off');
            });
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
