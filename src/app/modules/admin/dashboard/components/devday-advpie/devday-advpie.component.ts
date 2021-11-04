import { Component, OnInit } from '@angular/core';
import { APIService } from 'app/API.service';
import { AuthService } from 'app/core/auth/auth.service';
import { EchartsService } from '../../echarts.service';

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
    clientid: string;

    // options
    gradient: boolean = true;
    showLegend: boolean = true;
    showLabels: boolean = true;
    isDoughnut: boolean = false;

    colorScheme = 'natural';

    single2 = [
      {
        "name": "Germany",
        "value": 40632,
        "extra": {
          "code": "de"
        }
      },
    ]

    constructor(
        private echartService: EchartsService,
        private auth: AuthService,
        private api: APIService,
    ) {}

    ngOnInit(): void {
        this.auth.checkClientId().then((resp) => {
            this.clientid = resp['sub'];
            this.echartService.todayDevSms(this.clientid).then((resp) => {
                console.log(resp, 'todaySms');
            });
        });

        this.api.OnCreateHisSmsLogListener.subscribe((resp) => {
            this.echartService.todayDevSms(this.clientid).then((resp) => {
                console.log('OnCreateListener...', resp);
            });
        });
    }

    get single() {
        return this.echartService.devDataSent;
    }
}
