import { Injectable } from '@angular/core';
import _lodash from 'lodash';
import { BehaviorSubject } from 'rxjs';
import {APIService, HisSmsLog, ListHisSmsLogsQuery, ModelHisSmsLogFilterInput} from '../../../API.service';

export interface SmsData {
    name: string;
    value: number;
    fecha00: string;
    fecha24: string;
}

export interface DevSend {
    uniqueid: string;
    name: string;
    value: number;
}

@Injectable({
    providedIn: 'root',
})
export class EchartsService {
    data: SmsData[] = [];
    devData: DevSend[] = [];

    private _countRow: BehaviorSubject<number | 0> = new BehaviorSubject(0);

    constructor(private api: APIService) {}

    get countRow$() {
        return this._countRow.asObservable();
    }

    async todaySms(clientid: string): Promise<number> {
        const date = new Date();
        const mm = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(date);
        const dd = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(date);
        const hoy00 = date.getFullYear().toString() + '-' + mm + '-' + dd + 'T00:00:00';

        let filter: ModelHisSmsLogFilterInput;
        filter = {
            lastProcessDt: { gt: hoy00 },
            clientId: { eq: clientid },
        };
        let countRow = 0;
        let nextToken = null;
        await this.api
            .ListHisSmsLogs(filter, 300, nextToken)
            .then(async (result: ListHisSmsLogsQuery) => {
                nextToken = result.nextToken;
                countRow += result.items.length;
                while (!_lodash.isEmpty(nextToken)) {
                    await this.api
                        .ListHisSmsLogs(filter, 300, nextToken)
                        .then((result: ListHisSmsLogsQuery) => {
                            nextToken = result.nextToken;
                            countRow += result.items.length;
                        });
                }
                this._countRow.next(countRow);
            })
            .catch(err => console.log(err));
        return countRow;
    }

    async todayDevSms(clientid: string) {
        const date = new Date();
        const mm = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(date);
        const dd = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(date);
        const hoy00 = date.getFullYear().toString() + '-' + mm + '-' + dd + 'T00:00:00';
        let filter: ModelHisSmsLogFilterInput;
        filter = {
            lastProcessDt: { gt: hoy00 },
            clientId: { eq: clientid },
        };
        const devDataTmp = [];
        let nextToken = null;
        await this.api
            .ListHisSmsLogs(filter, 300, nextToken)
            .then(async (result: ListHisSmsLogsQuery) => {
                nextToken = result.nextToken;
                // Conteo por device
                result.items.forEach((item: HisSmsLog) => {
                    if (devDataTmp.length == 0){
                        const devs: DevSend = {
                            uniqueid: item.uniqueId,
                            name: 'Device 1',
                            value: 1
                        };
                        devDataTmp.push(devs);
                    } else {
                        let found = false;
                        for (const devf of devDataTmp){
                            if (devf.uniqueid === item.uniqueId){
                                found = true;
                                devf.value += 1;
                            }
                        }
                        if (!found){
                            const devs: DevSend = {
                                uniqueid: item.uniqueId,
                                name: 'Device ' + (devDataTmp.length+1),
                                value: 1
                            };
                            devDataTmp.push(devs);
                        }
                    }
                });
                while (!_lodash.isEmpty(nextToken)) {
                    await this.api
                        .ListHisSmsLogs(filter, 300, nextToken)
                        .then((result: ListHisSmsLogsQuery) => {
                            nextToken = result.nextToken;
                            // Conteo por device
                            result.items.forEach((item: HisSmsLog) => {
                                if (devDataTmp.length == 0){
                                    const devs: DevSend = {
                                        uniqueid: item.uniqueId,
                                        name: 'Device 1',
                                        value: 1
                                    };
                                    devDataTmp.push(devs);
                                } else {
                                    let found = false;
                                    for (const devf of devDataTmp){
                                        if (devf.uniqueid === item.uniqueId){
                                            found = true;
                                            devf.value += 1;
                                        }
                                    }
                                    if (!found){
                                        const devs: DevSend = {
                                            uniqueid: item.uniqueId,
                                            name: 'Device ' + (devDataTmp.length+1),
                                            value: 1
                                        };
                                        devDataTmp.push(devs);
                                    }
                                }
                            });
                        });
                }
                this.devData = devDataTmp;
            })
            .catch(err => console.log(err));
    }

    async biweeklySms(clientid: string) {
        const date = new Date();
        // fechas
        const datea = date;
        datea.setDate(datea.getDate() - 14);
        for (let i = 1; i < 15; i++) {
            const mma = new Intl.DateTimeFormat('en', {month: 'short',}).format(datea);
            const mms = new Intl.DateTimeFormat('en', {month: '2-digit',}).format(datea);
            const dda = new Intl.DateTimeFormat('en', {day: '2-digit',}).format(datea);
            const smsAux: SmsData = {
                name: mma + '-' + dda,
                fecha00: datea.getFullYear().toString()+'-'+mms+'-'+dda+'T00:00:00',
                fecha24: datea.getFullYear().toString()+'-'+mms+'-'+dda+'T23:59:59',
                value: 0,
            };
            this.data.push(smsAux);
            datea.setDate(datea.getDate() + 1);
        }
        // Fecha de filtros
        date.setDate(date.getDate() - 14);
        const mm = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(date);
        const dd = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(date);
        const day_14 = date.getFullYear().toString() + '-' + mm + '-' + dd + 'T00:00:00';
        const filter: ModelHisSmsLogFilterInput = {
            lastProcessDt: { gt: day_14 },
            clientId: { eq: clientid },
        };
        let nextToken = null;
        await this.api
            .ListHisSmsLogs(filter, 300, nextToken)
            .then(async (result: ListHisSmsLogsQuery) => {
                nextToken = result.nextToken;
                /**
                 * cargar datos en contrados
                 */
                result.items.forEach((item: HisSmsLog) => {
                    for (const dateit of this.data) {
                        // Conteo por fecha
                        if (item.createdAt >= dateit.fecha00 && item.createdAt <= dateit.fecha24) {
                            dateit.value += 1;
                        }
                    }
                });
                while (!_lodash.isEmpty(nextToken)) {
                    await this.api
                        .ListHisSmsLogs(filter, 300, nextToken)
                        .then((result: ListHisSmsLogsQuery) => {
                            nextToken = result.nextToken;
                            /**
                             * cargar datos en contrados
                             */
                            result.items.forEach((item: HisSmsLog) => {
                                for (const dateit of this.data) {
                                    // Conteo por fecha
                                    if (item.createdAt >= dateit.fecha00 && item.createdAt <= dateit.fecha24) {
                                        dateit.value += 1;
                                    }
                                }
                            });
                        });
                }
            })
            .catch(err => console.log(err));
    }

    get smsOverviewData(){
        return [{
            name: 'Sms Sent',
            series: this.data
          }];
    }

    get devDataSent(){
        return this.devData;
    }
}
