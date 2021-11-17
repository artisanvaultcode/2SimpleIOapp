import {
    ChangeDetectionStrategy,
    Component,
    OnDestroy,
    OnInit,
    ViewEncapsulation,
} from '@angular/core';
import { Subject } from 'rxjs';
import { ApexOptions } from 'ng-apexcharts';
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
    dateFilter = 'YEAR'
    yearstr = '';
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
        private _wsService: WebsocketService,
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


        // Determinar el usuario
        this._authService.checkClientId()
            .then(resp => {
                this.clientid = resp['sub'];
            });

        this.thisYear();
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
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------
    thisYear(){
        const dt = new Date().getFullYear();
        this.yearstr = dt.toString();
    }

    toggleFilter(filter: string){
        this.dateFilter = filter;
    }

    /**
     * Enable or disable Cron Message
     * @param sendbool
     */
    launchMsg(sendbool) {
        this._wsService.cronMsg(sendbool, this.clientid)
            .subscribe(resp => console.log(resp));
    }

    /**
     * Activate all Recipients for receive sms'
     */
    activateRecipients() {
        // this.displayProgressSpinner=true;
        this._wsService.activateRecip('ACTIVE', this.clientid)
            .subscribe(resp => {
                this.displayProgressSpinner=false;
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
