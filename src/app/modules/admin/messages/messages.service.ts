/* eslint-disable arrow-body-style */
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {tap} from 'rxjs/operators';
import {cloneDeep} from 'lodash-es';
import {Label} from './messages.types';

import {AuthService} from 'app/core/auth/auth.service';
import {
    APIService,
    Carriers,
    CreateGroupInput,
    CreateMsgTemplateInput,
    CreateMsgTemplateMutation,
    CreateMsgToGroupInput,
    DeleteGroupInput,
    DeleteMsgTemplateInput,
    DeleteMsgToGroupInput,
    EntityStatus,
    Group,
    ListGroupsQuery,
    ListMsgTemplatesQuery,
    ListMsgToGroupsQuery,
    ModelMsgTemplateFilterInput,
    ModelMsgToGroupFilterInput,
    MsgTemplate,
    MsgToGroup,
    UpdateMsgTemplateInput,
    UpdateMsgTemplateMutation,
    UpdateMsgToGroupInput
} from '../../../API.service';
import {Hub, Logger} from 'aws-amplify';
import {MessageModel} from './models/MessageModel';

export type MsgtogrpNames = MsgToGroup & {
    namegroup?: string;
};

@Injectable({
    providedIn: 'root',
})
export class MsgsService {
    // Private
    private logger = new Logger('Messages Services');
    private _labels: BehaviorSubject<Group[] | null> = new BehaviorSubject(null);
    private _labelsById: BehaviorSubject<any[]> = new BehaviorSubject([]);
    private _messageTemplate: BehaviorSubject<any | null> = new BehaviorSubject(null);
    private _note: BehaviorSubject<any | null> = new BehaviorSubject(null);
    private _messages: BehaviorSubject<any[] | null> = new BehaviorSubject(null);
    private _msgtogroups: BehaviorSubject<any[] | null> = new BehaviorSubject(null);
    private _clientId: BehaviorSubject<any | null> = new BehaviorSubject(null);
    private clientid: string;

    private _errorMessages: BehaviorSubject<any | null> = new BehaviorSubject(null);
    /**
     * Constructor
     */
    constructor(
        private _httpClient: HttpClient,
        private api: APIService,
        private _auth: AuthService,
    ) {
        of(this.getClientId());
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------
    /**
     * Getter for message
     */
    get messageTemplate$(): Observable<any> {
        return this._messageTemplate.asObservable();
    }
    /**
     * Getter for message
     */
    get labelsByMsgId$(): Observable<any[]> {
        return this._labelsById.asObservable();
    }
    /**
     * Getter for labels
     */
    get labels$(): Observable<any[]> {
        return this._labels.asObservable();
    }
    /*
    * Client ID
    */
    get clientId$(): Observable<any[]> {
        return this._clientId.asObservable();
    }

    /**
     * Getter for notes
     */
    get messages$(): Observable<MsgTemplate[]> {
        return this._messages.asObservable();
    }

    /**
     * Getter for note
     */
    get note$(): Observable<MsgTemplate> {
        return this._note.asObservable();
    }

    /**
     * Getter for msgtogroup
     */
    get msgtogroups$(): Observable<any[]> {
        return this._msgtogroups.asObservable();
    }
    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------



    refreshMessages() {
        of(this.getMessages());
    }

    createNewMessage(): any {
        const msgTemplate = new MessageModel();
        this._messageTemplate.next(msgTemplate);
        return msgTemplate;
    }
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    async getClientId() {
        const { sub } = await this._auth.checkClientId();
        this.clientid = sub;
        this._clientId.next(sub);
        return Promise.resolve(sub);
    }


    /**
     * Add label
     *
     * @param title
     */
    async addLabel(title: string): Promise<any> {
        const {sub} = await this._auth.checkClientId();
        const _group: CreateGroupInput = {
            name: title,
            carrier: Carriers.PHONE,
            status: EntityStatus.ACTIVE,
            clientId: sub
        };
        return this.api.CreateGroup(_group)
            .then((resp) => {
                this.getLabels();
                return resp;
            })
            .catch(error => console.log(error));
    }

    /**
     * Update label
     *
     * @param label
     */
    updateLabel(label: Label): Observable<Label[]> {
        return this._httpClient
            .patch<Label[]>('api/apps/msgs/labels', { label })
            .pipe(
                tap((labels) => {
                    /* // Update the notes
                    this.getNotes().subscribe();

                    // Update the labels
                    this._labels.next(labels); */
                })
            );
    }

    /**
     * Delete a label
     *
     * @param id
     */
    deleteLabel(grp: Group): Promise<any> {
        const delGI: DeleteGroupInput = {
            id: grp.id,
            _version: grp._version
        };
        return this.api.DeleteGroup(delGI)
            .then((resp) => {
                this.getLabels();
                return resp;
            })
            .catch(err => console.log(err));
    }
    /**
     * Method to Attach Group From Message
     *
     * @param grp
     * @param msg
     * @returns
     */
    async attachGroupFromMsg(msgtemplate: any, group: any): Promise<any> {
        const {sub} = await this._auth.checkClientId();
        const payload: CreateMsgToGroupInput = {
            msgID: msgtemplate.id,
            groupID: group.id,
            clientId: sub,
            status: EntityStatus.ACTIVE,
        };
        const filter: ModelMsgToGroupFilterInput = {
            groupID: {eq: group.id},
            clientId: {eq: sub },
            status: {eq: EntityStatus.ACTIVE }
        };
        return new Promise((resolve, reject) => {
            this.api.ListMsgToGroups(filter)
                .then((iFound) => {
                    if (iFound && iFound.items.length>0) {
                        return null;
                    } else {
                        return this.api.CreateMsgToGroup(payload);
                    }
                }).then((newGroup) => {
                    return this.getLabelsByMsgId(msgtemplate.id);
                }).then((labels: any[]) => {
                    resolve(labels);
                }).catch((error: any) => {
                    this.catchError(error);
                    reject(error.message);
                });
        });
    }
    /**
     * Method to Detach Group From Message
     *
     * @param grp
     * @param msg
     * @returns
     */
    detachGroupFromMsg(foundGroup: any): Promise<any> {
        const payload: UpdateMsgToGroupInput = {
            id: foundGroup.id,
            status: EntityStatus.INACTIVE,
            _version: foundGroup._version
        };
        return new Promise((resolve, reject) => {
            this.api.UpdateMsgToGroup(payload)
                .then((updatedGroup) => {
                    return this.getLabelsByMsgId(updatedGroup.msgID);
                }).then((labels: any[]) => {
                    resolve(labels);
                }).catch((error: any) => {
                    this.catchError(error);
                    reject(error.message);
                });
        });
    }
    /**
     * Method to Detach Group From Message By Id
     *
     * @param grp
     * @param msg
     * @returns
     */
    detachGroupFromMsgById(foundGroupId: any): Promise<any> {
        const payload: UpdateMsgToGroupInput = {
            id: foundGroupId.groupMsgId,
            status: EntityStatus.INACTIVE,
            _version: foundGroupId._versionGroupMsg
        };
        console.log(payload)
        return new Promise((resolve, reject) => {
            this.api.UpdateMsgToGroup(payload)
                .then((updatedGroup) => {
                    return this.getLabelsByMsgId(updatedGroup.msgID);
                }).then((labels: any[]) => {
                resolve(labels);
            }).catch((error: any) => {
                this.catchError(error);
                reject(error.message);
            });
        });
    }
    /**
     * Method to delete MrgToGrp with group and mgstemplate
     *
     * @param grp
     * @param msg
     * @returns
     */
    deleteMsgToGroup(grp: Group, msg: MsgTemplate): Promise<any> {
        let delmsg2grp: DeleteMsgToGroupInput;
        this._msgtogroups.subscribe((msg2grp: MsgtogrpNames[]) => {
            const filterm2g = msg2grp.filter(m2g => m2g.groupID === grp.id && m2g.msgID === msg.id);
            delmsg2grp = {
                id: filterm2g[0].id,
                _version: filterm2g[0]._version
            };
        });
        return this.api.DeleteMsgToGroup(delmsg2grp)
            .then((resp) => {
                this.getMsgtogroup();
                this.getMessages();
                return resp;
            })
            .catch(err => console.log(err));
    }

    /**
     * Method to delete MsgToGrp with MsgToGrp row
     *
     * @param msg2grp
     * @returns
     */
    delMsgToGroup(msg2grp: MsgToGroup): Promise<any> {
        const delmsg2grp: DeleteMsgToGroupInput = {
            id: msg2grp.id,
            _version: msg2grp._version
        };
        return this.api.DeleteMsgToGroup(delmsg2grp)
            .then((resp) => {
                this.getMsgtogroup();
                this.getMessages();
                return resp;
            })
            .catch(err => console.log(err));
    }

    async getMsgtogroup(): Promise<any> {
        const {sub} = await this._auth.checkClientId();
        const filter: ModelMsgToGroupFilterInput = {
            clientId: { eq: sub },
        };
        return new Promise((resolve, reject) => {
            this.api.ListMsgToGroups(filter)
                .then((resp: ListMsgToGroupsQuery) => {
                    const notDeleted = resp.items.filter(
                        item => item._deleted !== true
                    );
                    this._msgtogroups.next(notDeleted);
                    resolve(notDeleted.length);
                })
                .catch(error => reject(error));
        });
    }

    /**
     * Get All Messages
     */
    async getMessages(status: EntityStatus = EntityStatus.ACTIVE): Promise<any> {
        const {sub} = await this._auth.checkClientId();
        const filter: ModelMsgTemplateFilterInput = {
            clientId: { eq: sub },
            status: {eq: status}
        };
        this.activateProgressBar();
        return new Promise((resolve, reject) => {
            this.api
                .ListMsgTemplates(filter)
                .then((resp: ListMsgTemplatesQuery) => {
                    const notDeleted = resp.items.filter(
                        item => item._deleted !== true
                    );
                    this._messages.next(notDeleted);
                    this.activateProgressBar('off');
                    resolve(notDeleted.length);
                })
                .catch((error: any) => {
                    this.catchError(error);
                    reject(error.message);
                    this.activateProgressBar('off');
                });
        });
    }

    /**ListMsgToGroups
     * Get labels/Groups
     */
    async getLabels(): Promise<any> {
        const {sub} = await this._auth.checkClientId();
        const filter: ModelMsgTemplateFilterInput = {
            clientId: { eq: sub },
            status: {eq : EntityStatus.ACTIVE}
        };
        return new Promise((resolve, reject) => {
            this.api.ListGroups(filter)
                .then((result: ListGroupsQuery) => {
                    const notDeleted = result.items.filter(
                        item => item._deleted !== true
                    );
                    this._labels.next(notDeleted);
                    resolve(notDeleted.length);
                })
                .catch((error: any) => {
                    this.catchError(error);
                    reject(error.message);
                });
        });
    }

    /**
     * Get All Labels used by the Message
     */
    async getLabelsByMsgId(id: string): Promise<any> {
        const {sub} = await this._auth.checkClientId();
        const filter: ModelMsgToGroupFilterInput = {
            clientId: { eq: sub },
            msgID:  {eq: id},
            status: {eq : EntityStatus.ACTIVE}
        };
        return new Promise((resolve, reject) => {
            this.api.ListMsgToGroups(filter)
                .then((result) => {
                    const notDeleted = result.items.filter(
                        item => item._deleted !== true
                    );
                    this._labelsById.next(notDeleted);
                    resolve(notDeleted);
                })
                .catch((error: any) => {
                    this.catchError(error);
                    reject(error.message);
                });
        });
    }

    /**
     * Get All Labels used by the Message
     */
    async getLabelsByMsgIdAsync(id: string): Promise<any> {
        const {sub} = await this._auth.checkClientId();
        const filter: ModelMsgToGroupFilterInput = {
            clientId: { eq: sub },
            msgID:  {eq: id},
            status: {eq : EntityStatus.ACTIVE}
        };
        return new Promise((resolve, reject) => {
            this.api.ListMsgToGroups(filter)
                .then((result) => {
                    const notDeleted = result.items.filter(
                        item => item._deleted !== true
                    );
                    resolve(notDeleted);
                })
                .catch((error: any) => {
                    this.catchError(error);
                    reject(error.message);
                });
        });
    }

    /**
     * Get message by id
     */
    getMessageById(id: string): Promise<any> {
        let currentMessage;
        return new Promise((resolve, reject) => {
            this.api.GetMsgTemplate(id)
                .then((msgIn ) => {
                    currentMessage = msgIn;
                    return this.getLabelsByMsgId(msgIn.id);
                }).then((result) => {
                    currentMessage['labelsUsed'] =  result;
                    this._messageTemplate.next(currentMessage);
                    resolve(currentMessage);
            }).catch((error: any) => {
                this.catchError(error);
                reject(error.message);
            });
        });
    }

    /**
     * Set New Message
     */
    setNewMessage(newMsg: MessageModel): void {
        this._messageTemplate.next(MessageModel);
        this._labelsById.next([]);
    }

    /**
     * Create note
     *
     * @param note
     */
    async createMessage(msg: MsgTemplate): Promise<CreateMsgTemplateMutation> {
        const {sub} = await this._auth.checkClientId();
        return new Promise((resolve, reject) => {
            const _payload: CreateMsgTemplateInput = {
                id: null,
                name: msg.name,
                message: msg.message,
                status: msg.status,
                default: msg.default,
                clientId: sub,
                _version: msg._version,
            };
            this.api.CreateMsgTemplate(_payload)
                .then((resp: CreateMsgTemplateMutation) => resolve(resp))
                .catch((error: any) => {
                    this.catchError(error);
                    reject(error.message);
                });
        });
    }

    /**
     * Update the note
     *
     * @param note
     */
    updateNote(note: MsgTemplate): Promise<UpdateMsgTemplateMutation> {
        // Clone the note to prevent accidental reference based updates
        const updatedNote = cloneDeep(note) as any;

        const dateAt = new Date().toISOString();
        return new Promise((resolve, reject) => {
            const msginput: UpdateMsgTemplateInput = {
                id: note.id,
                name: note.name,
                message: note.message,
                status: note.status,
                default: note.default,
                _version: note._version,
            };
            this.api.UpdateMsgTemplate(msginput)
                .then((resp) => {
                    console.log(resp);
                    resolve(resp);
                })
                .catch(error => console.log(error));
        });
    }
    /**
     * Archive The Message
     *
     * @param note
     */
    archiveMessage(msgId: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this.api.GetMsgTemplate(msgId)
                .then((updateMsg) => {
                    const payload: UpdateMsgTemplateInput = {
                        id: updateMsg.id,
                        _version: updateMsg._version,
                        status: EntityStatus.INACTIVE
                    };
                    return this.api.UpdateMsgTemplate(payload);
                }).then((result) => {
                    return this.getMessages();
                }).finally(() => {
                    resolve(true);
                }).catch((error: any) => {
                    this.catchError(error);
                    reject(error.message);
                });
        });
    }
    /**
     * Delete the note
     *
     * @param note
     */
    deleteNote(note: MsgTemplate): Promise<any> {
        const delmsgtempinput: DeleteMsgTemplateInput = {
            id: note.id,
            _version: note._version
        };
        return this.api.DeleteMsgTemplate(delmsgtempinput)
            .then((resp) => {
                this.getMessages();
                return resp;
            })
            .catch(err => console.log(err));
    }

    private catchError(error): void {
        console.log(error);
        this.logger.debug('OOPS!', error);
    }

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    private activateProgressBar(active = 'on') {
        Hub.dispatch(
            'processing',
            {
                event: 'progressbar',
                data: {
                    activate: 'on'
                }
            });
    }
}
