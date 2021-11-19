import { Component, Input, OnInit, SimpleChanges, OnChanges, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Hub } from 'aws-amplify';
import { Subject, Subscription, timer } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AthenaService } from './../../athena.service';

export interface DevSend {
    uniqueid: string;
    name: string;
    value: number;
}

@Component({
    selector: 'app-devday-advpie',
    templateUrl: './devday-advpie.component.html',
    styleUrls: ['./devday-advpie.component.scss'],
})
export class DevdayAdvpieComponent implements OnInit, OnChanges, OnDestroy {
    @Input() clientId: string;

    devData: DevSend[];

    // options
    gradient: boolean = true;
    showLegend: boolean = true;
    showLabels: boolean = true;
    isDoughnut: boolean = false;
    animations: boolean = true;

    colorScheme = 'cool';

    datos = [];

    private _unsubscribeAll: Subject<any> = new Subject<any>();
    private timerObserver: Subscription;

    constructor(
        private _athenaService: AthenaService,
        private _changeDetectorRef: ChangeDetectorRef
    ) {}

    ngOnInit(): void {
        let timer$ = timer(2000, 5000);
        this.timerObserver = timer$.subscribe(() => this._changeDetectorRef.markForCheck());
    }

    ngOnChanges(changes: SimpleChanges): void {
        const {clientId} = changes;
        if (clientId && clientId.currentValue){
            this.getSmsDevice();
        }
    }

    ngOnDestroy() {
        this.timerObserver.unsubscribe();
    }

    getSmsDevice() {
        this._athenaService.dbSmsDevice(this.clientId)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(response => {
                let datatmp = [];
                response['result'].forEach(ele => {
                    const element = {
                        name: ele[0],
                        value: ele[1]
                    }
                    datatmp.push(element);
                });
                this.datos = datatmp;
            });
        this._changeDetectorRef.detectChanges();
    }

    activateProgressBar(active = 'on') {
        Hub.dispatch('processing', {
            event: 'progressbar',
            data: {
                activate: active,
            },
        });
    }

    get single() {
        return this.datos;
    }
}
