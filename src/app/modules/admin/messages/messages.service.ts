import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { cloneDeep } from 'lodash-es';
import { Label, Note } from './messages.types';
import _lodash from 'lodash';
import {
    APIService,
    Carriers,
    CreateGroupInput,
    CreateMsgTemplateInput,
    CreateMsgTemplateMutation,
    CreateMsgToGroupInput,
    CreateMsgToGroupMutation,
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
} from 'app/API.service';
import { AuthService } from 'app/core/auth/auth.service';

export type MsgtogrpNames = MsgToGroup & {
    namegroup?: string;
}

@Injectable({
    providedIn: 'root',
})
export class MsgsService {
    // Private
    private _labels: BehaviorSubject<Group[] | null> = new BehaviorSubject(null);
    private _note: BehaviorSubject<MsgTemplate | null> = new BehaviorSubject(null);
    private _messages: BehaviorSubject<MsgTemplate[] | null> = new BehaviorSubject(null);
    private _msgtogroups: BehaviorSubject<MsgtogrpNames[] | null> = new BehaviorSubject(null);
    private clientid: string;

    /**
     * Constructor
     */
    constructor(
        private _httpClient: HttpClient,
        private api: APIService,
        private _auth: AuthService,
    ) {
        this.getClientId();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for labels
     */
    get labels$(): Observable<Group[]> {
        return this._labels.asObservable();
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
    get msgtogroups$(): Observable<MsgtogrpNames[]> {
        return this._msgtogroups.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    async getClientId(){
        const { sub } = await this._auth.checkClientId();
        this.clientid = sub;
    }
    /**
     * Get labels
     */
    async getLabels(): Promise<any> {
        const {sub} = await this._auth.checkClientId();
        const filter: ModelMsgTemplateFilterInput = {
            clientId: { eq: sub },
        };
        return new Promise((resolve, reject) => {
                this.api.ListGroups(filter)
                    .then((value: ListGroupsQuery) => {
                        const notDeleted = value.items.filter(
                            (item) => item._deleted !== true
                        );
                        this._labels.next(notDeleted);
                        resolve(notDeleted.length);
                    })
                    .catch(error => reject(error));
        })
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
            .then(resp => {
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
        }
        return this.api.DeleteGroup(delGI)
            .then(resp => {
                this.getLabels();
                return resp;
            })
            .catch(err => console.log(err));
    }

    /**
     * Method to delete MrgToGrp with group and mgstemplate
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
            }
        });
        return this.api.DeleteMsgToGroup(delmsg2grp)
            .then(resp => {
                this.getMsgtogroup();
                this.getMessages();
                return resp;
            })
            .catch(err => console.log(err));
    }

    /**
     * Method to delete MsgToGrp with MsgToGrp row
     * @param msg2grp 
     * @returns 
     */
    delMsgToGroup(msg2grp: MsgToGroup): Promise<any> {
        let delmsg2grp: DeleteMsgToGroupInput = {
            id: msg2grp.id,
            _version: msg2grp._version
        }
        return this.api.DeleteMsgToGroup(delmsg2grp)
            .then(resp => {
                this.getMsgtogroup();
                this.getMessages();
                return resp;
            })
            .catch(err => console.log(err));
    }

    async insertMsgToGrp(msg: MsgTemplate, grp: Group): Promise<CreateMsgToGroupMutation> {
        console.log("toggle  group", msg, grp);
        const {sub} = await this._auth.checkClientId();
        const msg2grpinput: CreateMsgToGroupInput = {
            msgID: msg.id,
            groupID: grp.id,
            clientId: sub,
            status: EntityStatus.ACTIVE,
        }
        return this.api.CreateMsgToGroup(msg2grpinput)
            .then((resp: CreateMsgToGroupMutation) => {
                this.getMsgtogroup();
                this.getMessages();
                return resp;
            })
            .catch(err => {return err});
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
                        (item) => item._deleted !== true
                    )
                    notDeleted.forEach((mtg: MsgtogrpNames) => {
                        this.labels$.subscribe(flab => {
                            if (!_lodash.isEmpty(flab)){
                                const flabt = flab.filter(
                                    (f) => f.id === mtg.groupID
                                )
                                mtg.namegroup = flabt[0]['name'];
                            }
                        });
                    });
                    this._msgtogroups.next(notDeleted);
                    resolve(notDeleted.length);
                })
                .catch(error => reject(error));
        });
    }

    async getMessages(): Promise<any> {
        const {sub} = await this._auth.checkClientId();
        const filter: ModelMsgTemplateFilterInput = {
            clientId: { eq: sub },
        };
        return new Promise((resolve, reject) => {
            this.api
                .ListMsgTemplates(filter)
                .then((resp: ListMsgTemplatesQuery) => {
                    const notDeleted = resp.items.filter(
                        (item) => item._deleted !== true
                    );
                    this._messages.next(notDeleted);
                    resolve(notDeleted.length);
                })
                .catch((err) => reject(err));
        });
    }

    /**
     * Get note by id
     */
    getMessageById(id: string): Observable<MsgTemplate> {
        return this._messages.pipe(
            take(1),
            map((notes) => {
                // Find within the folders and files
                const note = notes.find((value) => value.id === id) || null;

                // Update the note
                this._note.next(note);

                // Return the note
                return note;
            }),
            switchMap((note) => {
                if (!note) {
                    return throwError(
                        'Could not found the note with id of ' + id + '!'
                    );
                }

                return of(note);
            })
        );
    }

    /**
     * Add task to the given note
     *
     * @param note
     * @param task
     */
    addTask(note: Note, task: string): Observable<Note> {
        return this._httpClient
            .post<Note>('api/apps/msgs/tasks', {
                note,
                task,
            })
            .pipe(
                /* switchMap(() =>
                    this.getNotes().pipe(
                        switchMap(() => this.getNoteById(note.id))
                    )
                ) */
            );
    }

    /**
     * Create note
     *
     * @param note
     */
    createNote(note: MsgTemplate): Promise<CreateMsgTemplateMutation> {
        const _note: CreateMsgTemplateInput = {
            id: null,
            name: note.name,
            message: note.message,
            status: note.status,
            default: note.default,
            clientId: note.clientId,
            _version: note._version,
        };
        return this.api
            .CreateMsgTemplate(_note)
            .then((resp: CreateMsgTemplateMutation) => {
                this.getMessages();
                return resp;
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

        // Before sending the note to the server, handle the labels
        /* if (updatedNote.labels.length) {
            updatedNote.labels = updatedNote.labels.map((label) => label.id);
        }

        return this._httpClient
            .patch<Note>('api/apps/msgs', { updatedNote })
            .pipe(
                tap((response) => {
                    // Update the notes
                    this.getNotes().subscribe();
                })
            ); */
        const dateAt = new Date().toISOString();
        return new Promise((resolve, reject) => {
            const msginput: UpdateMsgTemplateInput = {
                id: note.id,
                name: note.name,
                message: note.message,
                status: note.status,
                default: note.default,
                _version: note._version,
            }
            this.api.UpdateMsgTemplate(msginput)
                .then(resp => {
                    console.log(resp)
                    resolve(resp);
                })
                .catch(error => console.log(error));
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
        }
        return this.api.DeleteMsgTemplate(delmsgtempinput)
            .then(resp => {
                this.getMsgtogroup();
                this.getMessages();
                return resp;
            })
            .catch(err => console.log(err));
    }
}
