import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgApexchartsModule } from 'ng-apexcharts';
import { SharedModule } from 'app/shared/shared.module';
import {analyticsRoutes} from './analytics.routing';
import {AnalyticsComponent} from './analytics.component';
import { ProgressSpinnerModule } from 'app/core/spinner/progress-spinner.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MsgTemplateDefaultComponent } from './components/msgtemplate-default/msg-template-default.component';
import {QuillModule} from 'ngx-quill';
import { SmsOverviewComponent } from './components/sms-overview/sms-overview.component';
import { SmsdayGaugeComponent } from './components/smsday-gauge/smsday-gauge.component';
import { NgxEchartsModule } from 'ngx-echarts';
import * as echarts from 'echarts';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { DevdayAdvpieComponent } from './components/devday-advpie/devday-advpie.component';
import { FuseAlertModule } from '@fuse/components/alert';
import { CardnumberComponent } from './components/cardnumber/cardnumber.component';

@NgModule({
    declarations: [
        AnalyticsComponent,
        MsgTemplateDefaultComponent,
        SmsOverviewComponent,
        SmsdayGaugeComponent,
        DevdayAdvpieComponent,
        CardnumberComponent
    ],
    imports     : [
        RouterModule.forChild(analyticsRoutes),
        MatButtonModule,
        MatButtonToggleModule,
        MatDividerModule,
        MatIconModule,
        MatMenuModule,
        MatFormFieldModule,
        MatInputModule,
        MatDialogModule,
        MatProgressBarModule,
        MatSortModule,
        MatTableModule,
        MatTooltipModule,
        MatFormFieldModule,
        MatInputModule,
        MatDialogModule,
        NgApexchartsModule,
        SharedModule,
        ProgressSpinnerModule,
        QuillModule.forRoot(),
        NgxEchartsModule.forRoot({echarts,}),
        NgxChartsModule,
        FuseAlertModule,
    ]
})
export class AnalyticsModule
{
}
