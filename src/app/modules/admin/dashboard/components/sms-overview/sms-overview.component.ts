import { Component, OnInit } from '@angular/core';
import { AuthService } from 'app/core/auth/auth.service';
import { EchartsService } from '../../echarts.service';
import * as shape from 'd3-shape';

export interface SmsData {
  name: string;
  value: number;
  fecha00: string;
  fecha24: string;
}

export interface Serie {
  name: string;
  value: number;
}

@Component({
    selector: 'app-sms-overview',
    templateUrl: './sms-overview.component.html',
    styleUrls: ['./sms-overview.component.scss'],
})
export class SmsOverviewComponent implements OnInit {
    view: any[] = [1600, 300];

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

    basisCurve= shape.curveBasis;
    gradient = false;

    colorScheme = 'cool';

    clientid: string;
    data: SmsData[];
    series: Serie[] = [];
    constructor(
        private echartService: EchartsService,
        private auth: AuthService
    ) {}

    ngOnInit(): void {
        this.auth.checkClientId().then((resp) => {
            this.clientid = resp['sub'];
            this.echartService.biweeklySms(this.clientid).then((resp) => {

            });
        });
    }

    get multi (){
    return this.echartService.smsOverviewData;
    }
}
