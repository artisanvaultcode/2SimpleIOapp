import { 
    ChangeDetectorRef, 
    Component, Input, 
    OnChanges, OnInit, 
    SimpleChanges, 
    OnDestroy } 
from '@angular/core';
import { AthenaService } from '../../athena.service';
import * as shape from 'd3-shape';
import { takeUntil } from 'rxjs/operators';
import { Subject, Subscription, timer } from 'rxjs';

@Component({
    selector: 'app-cardnumber',
    templateUrl: './cardnumber.component.html',
    styleUrls: ['./cardnumber.component.scss'],
})
export class CardnumberComponent implements OnInit, OnChanges, OnDestroy {
    @Input() clientId: string;
    // options
    legend: boolean = false;
    showLabels: boolean = false;
    animations: boolean = false;
    showGridLines: boolean = false;
    xAxis: boolean = false;
    yAxis: boolean = false;
    showYAxisLabel: boolean = false;
    showXAxisLabel: boolean = false;
    timeline: boolean = true;
    gradient = true;

    basisCurve= shape.curveBasis;

    colorScheme = 'forest';

    datos = [];
    dato: any;
    unidad: string;

    private _unsubscribeAll: Subject<any> = new Subject<any>();
    private timerObserver: Subscription;

    constructor(
        private _athenaService: AthenaService,
        private _changeDetectorRef: ChangeDetectorRef,
    ) {}

    ngOnInit(): void {
        let timer$ = timer(2000, 5000);
        this.timerObserver = timer$.subscribe(() => this._changeDetectorRef.markForCheck());
    }

    ngOnChanges(changes: SimpleChanges): void {
        const {clientId} = changes;
        if (clientId && clientId.currentValue){
            this.getMonthCard();
        }
    }

    ngOnDestroy() {
        this.timerObserver.unsubscribe();
    }

    getMonthCard() {
        this._athenaService.dbMonthCard(this.clientId)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(response => {
                this.datos = this.convertObj(response['result']);
                this.lastDay(response['result']);
            });
    }

    convertObj(result: any[]): object[] {
        let datosTmp = []
        result.forEach(elem => {
            var dict = {};
            dict['name'] = elem[0]
            dict['value'] = elem[1]
            datosTmp.push(dict);
        });
        return datosTmp
    }

    lastDay(result: any[]){
        let st: any;
        if (result.length > 0){
            this.dato = result[result.length-1];
            st = this.dato[0];
            let nt = this.dato[1];
            if (nt > 1000){
                nt = (nt / 1000).toFixed(2);
                this.unidad = 'k'
            } else {
                this.unidad = ''
            }
            this.dato[1] = nt;
            let datestr = this.getMonth(st.substring(5, 7));
            datestr = datestr + ' ' + st.substring(8, 10) + ', ' + st.substring(0, 4);
            this.dato[0] = datestr
        } else {
            this.dato = ['', 0];
        }
    }

    get multi() {
        return [{
            name: 'Sms Sent',
            series: this.datos
          }];
    }

    private getMonth(month) {
        const months = {
            '01': 'Jan',
            '02': 'Feb',
            '03': 'Mar',
            '04': 'Apr',
            '05': 'May',
            '06': 'Jun',
            '07': 'Jul',
            '08': 'Aug',
            '09': 'Sep',
            '10': 'Oct',
            '11': 'Nov',
            '12': 'Dec'
        }
        return months[month]
    }
}

