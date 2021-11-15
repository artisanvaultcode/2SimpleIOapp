import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from 'app/core/auth/auth.service';
import { AthenaService } from '../../athena.service';
import { curveBumpX } from 'd3-shape'
import { forkJoin } from 'rxjs';

@Component({
    selector: 'app-sms-overview',
    templateUrl: './sms-overview.component.html',
    styleUrls: ['./sms-overview.component.scss'],
})
export class SmsOverviewComponent implements OnInit {

    @Input() datefilter: string;
    // options
    legend: boolean = false;
    showLabels: boolean = true;
    animations: boolean = true;
    xAxis: boolean = true;
    yAxis: boolean = true;
    showYAxisLabel: boolean = true;
    showXAxisLabel: boolean = true;
    xAxisLabel: string = 'Day';
    yAxisLabel: string = 'Total sent daily';
    timeline: boolean = true;

    basisCurve = curveBumpX;
    gradient = true;

    colorScheme = 'cool';

    datosY = [];
    datosM = [];
    constructor(
        private auth: AuthService,
        private _athena: AthenaService,
    ) {}

    ngOnInit(): void {
        this.auth.checkClientId().then((resp) => {
            const {sub} = resp;
            let clientid = '';
            const yearstr = new Date().getFullYear();
            if (sub === 'e43c4031-be4d-4c77-8ad9-ca842f5b4dc9'){
                clientid = `'e43c4031-be4d-4c77-8ad9-ca842f5b4dc9' OR
                        clientId = '1f78d0af-6b51-4723-8652-6dda5008c107'`
            } else {
                clientid = "'" + sub + "'";
            }
            this.getDataYear(clientid, yearstr.toString());
            this.getDataMonth(clientid);
        });
    }

    getDataYear(clientid: string, yearstr: string){
        forkJoin({
            devices: this._athena.distinctDevices(clientid, yearstr),
            datesstr: this._athena.distinctDates(clientid, yearstr)
        }).subscribe(({devices, datesstr}) => {
            const devs = devices['result'];
            const datstr = datesstr['result'];
            this.datosY = this.objBase(devs, datstr);
            this._athena.yearmsgdevices(clientid, yearstr)
                .subscribe(res => {
                    res['result'].forEach(elem => {
                       let serie = this.datosY.find( x => x.name === elem[1] );
                       let datval = serie.series.find(x => x.name === elem[0]);
                       datval.value = elem[2]
                    });
                });
        });
    }

    getDataMonth(clientid: string){
        forkJoin({
            devices: this._athena.distinctDevicesMonth(clientid),
            datesstr: this._athena.distinctDatesMonth(clientid)
        }).subscribe(({devices, datesstr}) => {
            const devs = devices['result'];
            const datstr = datesstr['result'];
            this.datosM = this.objBase(devs, datstr);
                this._athena.monthmsgdevices(clientid)
                    .subscribe(res => {
                        res['result'].forEach(elem => {
                           let serie = this.datosM.find( x => x.name === elem[1] );
                           let datval = serie.series.find(x => x.name === elem[0]);
                           datval.value = elem[2]
                        });
                    });
        });
    }

    objBase(devs: any[], dats: any[]): any[]{
        let objbase = [];
        devs.forEach(elem => {
            let serie = [];
            dats.forEach(dt => {
                const ser = {
                    name: dt[0],
                    value: 0
                }
                serie.push(ser);
            });
            const ele = {
                name: elem[0],
                series: serie
            }
            objbase.push(ele);
        });
        return objbase
    }

    get multi (){
        if (this.datefilter === 'YEAR') {
            return this.datosY;
        } else {
            return this.datosM;
        }
    }

}
