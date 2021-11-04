import { Component, OnInit } from '@angular/core';
import { AthinaService } from '../../athina.service';
import { AuthService } from 'app/core/auth/auth.service';
import * as shape from 'd3-shape';

@Component({
    selector: 'app-cardnumber',
    templateUrl: './cardnumber.component.html',
    styleUrls: ['./cardnumber.component.scss'],
})
export class CardnumberComponent implements OnInit {
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

    constructor(
        private athinaService: AthinaService,
        private _auth: AuthService
    ) {}

    ngOnInit(): void {
        this._auth.checkClientId()
            .then(resp => {
                const {sub} = resp;
                this.athinaService.athenamonthmsg(sub)
                    .subscribe((res) => {
                        this.convertJson(res['result']);
                        this.lastday(res['result']);
                    });
            });
    }

    convertJson(result: any[]) {
        this.datos = []
        result.forEach(elem => {
            var dict = {};
            dict['name'] = elem[0]
            dict['value'] = elem[1]
            this.datos.push(dict);
        });
    }

    lastday(result: any[]){
        let st = new Date().toISOString();
        if (result.length > 0){
            this.dato = result[result.length-1];
            st = this.dato[0];
            let nt = this.dato[1];
            nt = (nt / 1000).toFixed(2);
            this.dato[1] = nt;
        } else {
            this.dato = ['', 0];
        }
        let datestr = this.getMonth(st.substring(5, 7));
        datestr = datestr + ' ' + st.substring(8, 10) + ', ' + st.substring(0, 4);
        this.dato[0] = datestr
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

