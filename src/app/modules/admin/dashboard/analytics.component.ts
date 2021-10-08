import {
    ChangeDetectionStrategy,
    Component,
    OnDestroy,
    OnInit,
    ViewEncapsulation,
} from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ApexOptions } from 'ng-apexcharts';
import { AnalyticsService } from './analytics.service';
import { WebsocketService } from 'app/core/services/ws.service';
import { MsgTemplate } from 'app/API.service';
import { MatDialog } from '@angular/material/dialog';
import { MsgTemplateDefaultComponent } from './components/msgtemplate-default/msg-template-default.component';
import { AuthService } from 'app/core/auth/auth.service';

@Component({
    selector: 'analytics',
    templateUrl: './analytics.component.html',
    styleUrls: ['./analytics.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnalyticsComponent implements OnInit, OnDestroy {
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    private clientid;
    msgdefault: string;
    chartBlasting: ApexOptions;
    chartConversions: ApexOptions;
    chartWhiteListed: ApexOptions;
    chartRecipients: ApexOptions;
    data: any;

    currentMsgTemplate: MsgTemplate;

    color = 'primary';
    mode = 'indeterminate';
    value = 50;
    displayProgressSpinner = false;

    /**
     * Constructor
     */
    constructor(
        private _analyticsService: AnalyticsService,
        private _wsService: WebsocketService,
        private _router: Router,
        private _matDialog: MatDialog,
        private _authService: AuthService,
        public dialog: MatDialog,
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Get the data
        this._analyticsService.data$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((data) => {
                // Store the data
                this.data = data;
                // Prepare the chart data
                this._prepareChartData();
            });

        // Attach SVG fill fixer to all ApexCharts
        window['Apex'] = {
            chart: {
                events: {
                    mounted: (chart: any, options?: any) => {
                        this._fixSvgFill(chart.el);
                    },
                    updated: (chart: any, options?: any) => {
                        this._fixSvgFill(chart.el);
                    },
                },
            },
        };
        // Determinar el usuario
        this._authService.checkClientId()
            .then(resp => {
                this.clientid = resp['sub'];
            });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Fix the SVG fill references. This fix must be applied to all ApexCharts
     * charts in order to fix 'black color on gradient fills on certain browsers'
     * issue caused by the '<base>' tag.
     *
     * Fix based on https://gist.github.com/Kamshak/c84cdc175209d1a30f711abd6a81d472
     *
     * @param element
     * @private
     */
    private _fixSvgFill(element: Element): void {
        // Current URL
        const currentURL = this._router.url;

        // 1. Find all elements with 'fill' attribute within the element
        // 2. Filter out the ones that doesn't have cross reference so we only left with the ones that use the 'url(#id)' syntax
        // 3. Insert the 'currentURL' at the front of the 'fill' attribute value
        Array.from(element.querySelectorAll('*[fill]'))
            .filter((el) => el.getAttribute('fill').indexOf('url(') !== -1)
            .forEach((el) => {
                const attrVal = el.getAttribute('fill');
                el.setAttribute(
                    'fill',
                    `url(${currentURL}${attrVal.slice(attrVal.indexOf('#'))}`
                );
            });
    }

    /**
     * Prepare the chart data from the data
     *
     * @private
     */
    private _prepareChartData(): void {
        this.chartBlasting = {
            chart: {
                animations: {
                    speed: 400,
                    animateGradually: {
                        enabled: false,
                    },
                },
                fontFamily: 'inherit',
                foreColor: 'inherit',
                width: '100%',
                height: '100%',
                type: 'area',
                toolbar: {
                    show: false,
                },
                zoom: {
                    enabled: false,
                },
            },
            colors: ['#818CF8'],
            dataLabels: {
                enabled: false,
            },
            fill: {
                colors: ['#312E81'],
            },
            grid: {
                show: true,
                borderColor: '#334155',
                padding: {
                    top: 10,
                    bottom: -40,
                    left: 0,
                    right: 0,
                },
                position: 'back',
                xaxis: {
                    lines: {
                        show: true,
                    },
                },
            },
            series: this.data.smss.series,
            stroke: {
                width: 2,
            },
            tooltip: {
                followCursor: true,
                theme: 'dark',
                x: {
                    format: 'MMM dd, yyyy',
                },
                y: {
                    formatter(value: number): string {
                        return `${value}`;
                    },
                },
            },
            xaxis: {
                axisBorder: {
                    show: false,
                },
                axisTicks: {
                    show: false,
                },
                crosshairs: {
                    stroke: {
                        color: '#475569',
                        dashArray: 0,
                        width: 2,
                    },
                },
                labels: {
                    offsetY: -20,
                    style: {
                        colors: '#CBD5E1',
                    },
                },
                tickAmount: 20,
                tooltip: {
                    enabled: false,
                },
                type: 'datetime',
            },
            yaxis: {
                axisTicks: {
                    show: false,
                },
                axisBorder: {
                    show: false,
                },
                min: (min) => min - 750,
                max: (max) => max + 250,
                tickAmount: 5,
                show: false,
            },
        };

        this.chartConversions = {
            chart: {
                animations: {
                    enabled: false,
                },
                fontFamily: 'inherit',
                foreColor: 'inherit',
                height: '100%',
                type: 'area',
                sparkline: {
                    enabled: true,
                },
            },
            colors: ['#38BDF8'],
            fill: {
                colors: ['#38BDF8'],
                opacity: 0.5,
            },
            series: this.data.conversions.series,
            stroke: {
                curve: 'smooth',
            },
            tooltip: {
                followCursor: true,
                theme: 'dark',
            },
            xaxis: {
                type: 'category',
                categories: this.data.conversions.labels,
            },
            yaxis: {
                labels: {
                    formatter: (val) => val.toString(),
                },
            },
        };

        this.chartWhiteListed = {
            chart: {
                animations: {
                    enabled: false,
                },
                fontFamily: 'inherit',
                foreColor: 'inherit',
                height: '100%',
                type: 'area',
                sparkline: {
                    enabled: true,
                },
            },
            colors: ['#34D399'],
            fill: {
                colors: ['#34D399'],
                opacity: 0.5,
            },
            series: this.data.impressions.series,
            stroke: {
                curve: 'smooth',
            },
            tooltip: {
                followCursor: true,
                theme: 'dark',
            },
            xaxis: {
                type: 'category',
                categories: this.data.impressions.labels,
            },
            yaxis: {
                labels: {
                    formatter: (val) => val.toString(),
                },
            },
        };

        this.chartRecipients = {
            chart: {
                animations: {
                    enabled: false,
                },
                fontFamily: 'inherit',
                foreColor: 'inherit',
                height: '100%',
                type: 'area',
                sparkline: {
                    enabled: true,
                },
            },
            colors: ['#FB7185'],
            fill: {
                colors: ['#FB7185'],
                opacity: 0.5,
            },
            series: this.data.visits.series,
            stroke: {
                curve: 'smooth',
            },
            tooltip: {
                followCursor: true,
                theme: 'dark',
            },
            xaxis: {
                type: 'category',
                categories: this.data.visits.labels,
            },
            yaxis: {
                labels: {
                    formatter: (val) => val.toString(),
                },
            },
        };
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Enable or disable Cron Message
     * @param sendbool 
     */
    launchMsg(sendbool) {
        console.log('click launch...');
        this._wsService.cronMsg(sendbool, this.clientid)
            .subscribe(resp => console.log(resp));
    }

    /**
     * Activate all Recipients for receive sms'
     */
    activateRecipients() {
        console.log('Activate Recipients...');
        // this.displayProgressSpinner=true;
        this._wsService.activateRecip('ACTIVE', this.clientid)
            .subscribe(resp => {
                this.displayProgressSpinner=false;
                console.log(resp, this.displayProgressSpinner);
            });
    }

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any {
        this.displayProgressSpinner=false;
        return item.id || index;
    }

    openDefaultMsgDialog(): void {
        const dialogRef = this._matDialog.open(MsgTemplateDefaultComponent);

        dialogRef.afterClosed()
            .subscribe((result) => {
                console.log('Compose dialog was closed!');
            });
    }
}
