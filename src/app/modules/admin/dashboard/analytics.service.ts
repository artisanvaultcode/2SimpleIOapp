import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { APIService, ListMsgTemplatesQuery, ModelMsgTemplateFilterInput, MsgTemplate, TemplateUsage } from './../../../API.service';
import { AuthService } from 'app/core/auth/auth.service';
import { Hub, Logger } from 'aws-amplify';

@Injectable({
    providedIn: 'root'
})
export class AnalyticsService {

    private _message: BehaviorSubject<any | null> = new BehaviorSubject(null);

    private logger = new Logger('Analytics Services');
    /**
     * Constructor
     */
    constructor(
            private _api : APIService,
            private _auth: AuthService,
        )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------
    /**
     * Getter for messages
     */
     get message$(): Observable<MsgTemplate> {
        return this._message.asObservable();
    }


    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    async getDefaultMsg(): Promise<any> {
        this.activateProgressBar();
        const { sub } = await this._auth.checkClientId();
        const filter: ModelMsgTemplateFilterInput = {
            clientId: { eq: sub },
            default: { eq: TemplateUsage.DEFAULT },
        };
        return new Promise((resolve, reject) => {
            this._api
                .ListMsgTemplates(filter)
                .then((resp: ListMsgTemplatesQuery) => {
                    const notDeleted = resp.items.filter(
                        (item) => item._deleted !== true
                    );
                    this._message.next(notDeleted[0]);
                    resolve(notDeleted[0]);
                    this.activateProgressBar('off');
                })
                .catch((error: any) => {
                    this.catchError(error);
                    reject(error.message);
                    this.activateProgressBar('off');
                });
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

    private catchError(error): void {
        console.log(error);
        this.logger.debug('OOPS!', error);
    }
}
