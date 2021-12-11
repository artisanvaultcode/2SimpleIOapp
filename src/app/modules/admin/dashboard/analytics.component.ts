import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
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
import { Auth, Hub } from 'aws-amplify';
import { FuseAlertService } from '@fuse/components/alert';

@Component({
    selector: 'analytics',
    templateUrl: './analytics.component.html',
    styleUrls: ['./analytics.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnalyticsComponent implements OnInit, OnDestroy {
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    clientId;
    jwtToken;
    isLoading: boolean = false;
    showAlert: boolean = false;
    alertMsg: string = '';
    msgdefault: string;
    dateFilter = 'YEAR'
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
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseAlertService: FuseAlertService
    ) {
        Hub.listen('processing', (data) => {
            if (data.payload.event === 'progressbar') {
                this.isLoading = data.payload.data.activate === 'on';
                this._changeDetectorRef.markForCheck();
            }
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Determinar el usuario
        this._authService.checkClientId()
            .then(resp => {
                this.clientId = resp['sub'];
            });
        Auth.currentSession().then(resp => {
            console.log("auth.session", resp);
            this.jwtToken = resp.getAccessToken().getJwtToken();
        })
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

    toggleFilter(filter: string){
        this.dateFilter = filter;
    }

    /**
     * Enable or disable Cron Message
     * @param sendbool
     */
    launchMsg(sendbool) {
        this.activateProgressBar('on');
        this._wsService.cronMsg(sendbool, this.clientId)
        .subscribe(resp => {
            this.activateProgressBar('off');
            this.showAlert = true;
            /* this.disAlert = false; */
            if (sendbool){
                this.alertMsg = "Send Message Service ACTIVATED successfully";
            } else {
                this.alertMsg = "Send Message Service DEACTIVATED successfully";
            }
            this._fuseAlertService.show('alertBox');
        });
    }

    /**
     * Activate all Recipients for receive sms'
     */
    activateRecipients() {
        this.activateProgressBar('on');
        this._wsService.activateRecip('ACTIVE', this.clientId)
            .subscribe(resp => {
                this.activateProgressBar('off');
                this.showAlert = true;
                this.alertMsg = "Recipients activated successfully, total: " + resp['body']['items'];
                this._fuseAlertService.show('alertBox');
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

    activateProgressBar(active = 'on') {
        Hub.dispatch('processing', {
            event: 'progressbar',
            data: {
                activate: active,
            },
        });
    }

    get yearStr(): string{
        const dt = new Date().getFullYear();
        return dt.toString();
    }
}
