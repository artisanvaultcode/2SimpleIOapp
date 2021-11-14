import { Component, OnInit } from '@angular/core';
import { AuthService } from 'app/core/auth/auth.service';
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
export class DevdayAdvpieComponent implements OnInit {
    devData: DevSend[];

    // options
    gradient: boolean = true;
    showLegend: boolean = true;
    showLabels: boolean = true;
    isDoughnut: boolean = false;
    animations: boolean = true;

    colorScheme = 'cool';

    datos = [];

    constructor(
        private auth: AuthService,
        private _athena: AthenaService
    ) {}

    ngOnInit(): void {
        this.auth.checkClientId().then((resp) => {
            const {sub} = resp;
            this._athena.distinctDatesMonth("'"+sub+"'")
                .subscribe(resp => {
                    // console.log("[DevAdv-pie] Dates Month Result  \n",resp['result']);
                    this._athena.dateMsgDevices("'"+sub+"'",
                                resp['result'][resp['result'].length-1][0])
                        .subscribe(res => {
                            let datatmp = [];
                            res['result'].forEach(ele => {
                                const element = {
                                    name: ele[0],
                                    value: ele[1]
                                }
                                datatmp.push(element);
                            });
                            this.datos = datatmp;
                            console.log("[DevAdv-pie] DEVICES Last date  \n",this.datos);
                        })
                });

        });
    }

    get single() {
        return this.datos;
    }
}
