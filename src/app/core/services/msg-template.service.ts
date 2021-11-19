import { Injectable } from '@angular/core';
import { Logger } from '@aws-amplify/core';
import { Hub } from 'aws-amplify';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from 'app/core/auth/auth.service';
import {
    APIService,
    CreateMsgTemplateInput,
    EntityStatus,
    ListMsgTemplatesQuery,
    ModelMsgTemplateFilterInput,
    MsgTemplate,
    TemplateUsage,
    UpdateMsgTemplateInput,
} from '../../API.service';

@Injectable({
    providedIn: 'root',
})
export class MsgTemplateService {
    private _message: BehaviorSubject<any | null> = new BehaviorSubject(null);
    private logger = new Logger('Message Template');
    private onMsgTemplateInfo: BehaviorSubject<any | null> =
        new BehaviorSubject(null);

    private msgTemplateDefault = {
        id: null,
        name: null,
        message: null,
        status: EntityStatus.ACTIVE,
        default: TemplateUsage.DEFAULT,
        clientId: null,
    };
    /**
     * Constructor
     */
    constructor(
            private api: APIService,
            private _auth: AuthService
    ) {}
    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------
    get onMsgTemplateInfo$(): Observable<any> {
        return this.onMsgTemplateInfo.asObservable();
    }

    /**
     * Getter for messages
     */
     get message$(): Observable<MsgTemplate> {
        return this._message.asObservable();
    }

    getById(id: string): any {
        return new Promise((resolve, reject) => {
            this.api
                .GetMsgTemplate(id)
                .then((msgT) => {
                    this.onMsgTemplateInfo.next(msgT);
                    resolve(msgT);
                })
                .catch((err) => {
                    this.catchError(err);
                    reject(err);
                });
        });
    }

    findDefaultTemplate(clientid: string): Promise<any> {
        return new Promise((resolve, reject) => {
            const payloadInput: ModelMsgTemplateFilterInput = {
                default: { eq: TemplateUsage.DEFAULT },
                clientId: { eq: clientid },
            };
            this.api
                .ListMsgTemplates(payloadInput)
                .then((result) => {
                    if (!result) {
                        this.onMsgTemplateInfo.next(this.msgTemplateDefault);
                        resolve(this.msgTemplateDefault);
                    } else {
                        this.onMsgTemplateInfo.next(result);
                        resolve(result);
                    }
                })
                .catch((error) => {
                    this.catchError(error);
                    resolve(null);
                });
        });
    }

    updateData( msgEntity: UpdateMsgTemplateInput, _default: TemplateUsage ): Promise<any> {
        return new Promise((resolve, reject) => {
            const payloadInput: UpdateMsgTemplateInput = {
                id: msgEntity.id,
                default: _default,
                name: msgEntity.name,
                message: msgEntity.message,
                _version: msgEntity._version,
            };
            this.api
                .UpdateMsgTemplate(payloadInput)
                .then((msgUpdated) => {
                    this.onMsgTemplateInfo.next(msgUpdated);
                    resolve(msgUpdated);
                })
                .catch((error) => {
                    this.catchError(error);
                    reject(error);
                });
        });
    }

    addDefault( defaultMsgIn: CreateMsgTemplateInput, clientid: string ): Promise<any> {
        return new Promise((resolve, reject) => {
            this.api
                .CreateMsgTemplate(defaultMsgIn)
                .then((result) => {
                    //update to NONE all message
                    this.findDefaultTemplate(clientid).then((resp) => {
                        resp['items'].forEach(
                            (item: UpdateMsgTemplateInput) => {
                                const idnew = result.id;
                                if (!(item.id === idnew)) {
                                    this.updateData(
                                        item,
                                        TemplateUsage.NONE
                                    ).then((reslt) =>
                                        console.log('Default saved')
                                    );
                                }
                            }
                        );
                    });
                    resolve(result);
                })
                .catch((error) => {
                    this.catchError(error);
                    resolve(error);
                });
        });
    }

    async getDefaultMsg(): Promise<any> {
        this.activateProgressBar();
        const { sub } = await this._auth.checkClientId();
        const filter: ModelMsgTemplateFilterInput = {
            clientId: { eq: sub },
            default: { eq: TemplateUsage.DEFAULT },
        };
        return new Promise((resolve, reject) => {
            this.api
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
            event: 'progressbarmsg',
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
