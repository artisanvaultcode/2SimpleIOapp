import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';

import { Logger } from '@aws-amplify/core';
import { Hub } from 'aws-amplify';
import { AuthService } from '../../../core/auth/auth.service';
import {
    APIService,
    CreateRecipientInput,
    DeleteRecipientInput,
    DeleteRecipientMutation,
    EntityStatus,
    Group,
    ListGroupsQuery,
    ModelGroupFilterInput,
    SearchableRecipientFilterInput,
    SearchableRecipientSortableFields,
    SearchableRecipientSortInput,
    SearchableSortDirection,
    SearchRecipientsQuery,
    UpdateRecipientInput,
    UpdateRecipientMutation
} from 'app/API.service';

import * as _ from 'lodash';

@Injectable({
    providedIn: 'root'
})
export class RecipientsService
{
    pageSize: number;
    nextToken: string = null;

    // Private
    private logger = new Logger('RecipientsList');
    private _labels: BehaviorSubject<Group[] | null> = new BehaviorSubject(null);
    private _groups: BehaviorSubject<Group[] | null> = new BehaviorSubject(null);
    private _recipient: BehaviorSubject<any | null> = new BehaviorSubject(null);
    private _recipients: BehaviorSubject<any[] | null> = new BehaviorSubject(null);
    private _pageChange: BehaviorSubject<any | null> = new BehaviorSubject(null);
    // private defaultGroupId = '10172232-cca8-4f4c-b3df-1e96ab3fa431';
    /**
     * Constructor
     */
    constructor(
        private api: APIService,
        private auth: AuthService,
        private _httpClient: HttpClient,
    )
    {
        this.pageSize = 20;
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------
    get nextPage$(): Observable<any>
    {
        return this._pageChange.asObservable();
    }
    /**
     * Getter for contact
     */
    get recipient$(): Observable<any>
    {
        return this._recipient.asObservable();
    }

    /**
     * Getter for contacts
     */
    get recipients$(): Observable<any[]>
    {
        return this._recipients.asObservable();
    }

    get labels$(): Observable<any[]> {
        return this._labels.asObservable();
    }

    get groups$(): Observable<any[]> {
        return this._groups.asObservable();
    }


    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    // Get groups
    async getGroups(searchTxt?: string, nextToken?: string): Promise<any> {
        const { sub } = await this.auth.checkClientId();
        const filter: ModelGroupFilterInput = {
            clientId: { eq: sub },
            status: { eq: EntityStatus.ACTIVE }
        };
        return new Promise((resolve, reject) => {
            this.api
                .ListGroups(filter)
                .then((result: ListGroupsQuery) => {
                    const notDeleted = result.items.filter(
                        item => item._deleted !== true);
                    this._labels.next(notDeleted);
                    resolve(notDeleted.length);
                })
                .catch((error: any) => {
                    this.catchError(error);
                    reject(error.message);
                });
        });
    }

    async searchGroups(searchTxt?: string, nextToken?: string): Promise<any> {
        const { sub } = await this.auth.checkClientId();
        const filter: ModelGroupFilterInput = {
            clientId: { eq: sub },
            status: { eq: EntityStatus.ACTIVE },
            name: { contains: searchTxt }
        };
        return new Promise((resolve, reject) => {
            this.api
                .ListGroups(filter)
                .then((result: ListGroupsQuery) => {
                    const notDeleted = result.items.filter(
                        item => item._deleted !== true);
                    this._groups.next(notDeleted);
                    resolve(notDeleted.length);
                })
                .catch((error: any) => {
                    this.catchError(error);
                    reject(error.message);
                });
        });
    }


    /**
     * Get recipients
     */
    async getRecipients(searchTxt?: string, nextToken?: string, isSwitched?: boolean): Promise<any> {
        this.activateProgressBar();
        const { sub } = await this.auth.checkClientId();
        const filterRec: SearchableRecipientFilterInput =  {
            clientId: { eq: sub }
        };
        if (searchTxt && searchTxt.length > 0) {
            filterRec['phone'] = { wildcard: searchTxt };
            filterRec['phoneTxt'] = { wildcard: searchTxt };
        }
        const sortCriteria: SearchableRecipientSortInput = {
            field: SearchableRecipientSortableFields.lastProcessDt,
            direction: SearchableSortDirection.desc
        };
        this.nextToken = nextToken ? nextToken : null;
        return new Promise((resolve, reject) => {
           this.api.SearchRecipients(filterRec, sortCriteria, this.pageSize, this.nextToken)
                .then((result: SearchRecipientsQuery) => {
                    this.nextToken = !_.isEmpty(result['nextToken']) ? result['nextToken'] : null;
                    this._pageChange.next(this.nextToken);
                    if(this.nextToken) {
                        if(isSwitched) {
                            this._recipients.next(null);
                        }
                        this._recipients.next(result.items);
                        resolve(result.items);
                        this.activateProgressBar('off');
                    } else {
                        if (result.total === 0) {
                            this._recipients.next(result.items);
                        }
                        resolve(null);
                        this.activateProgressBar('off');
                    }
                })
                .catch((err) => {
                    this.activateProgressBar('off');
                    this.catchError(err);
                    reject(err);
                });

        });
    }

    async recipientExists(searchTxt: string, clientId: string): Promise<any> {
        let filter: SearchableRecipientFilterInput;
        const { sub } = await this.auth.checkClientId();
        if (searchTxt !== undefined && searchTxt) {
            filter = {
                phone: { eq: searchTxt },
                clientId: { eq: sub },
            };
        }
        return new Promise((resolve, reject) => {
            this.api.SearchRecipients(filter, null, this.pageSize)
                .then((result: SearchRecipientsQuery) => {
                    resolve(result.items);
                })
                .catch((err) => {
                    resolve([]);
                });
        });
    }

    /**
     * Get contact by id
     */
    getRecipientById(id: string): Observable<any>
    {
        return this._recipients.pipe(
            take(1),
            map((contacts) => {

                // Find the contact
                const contact = contacts.find(item => item.id === id) || null;

                // Update the contact
                this._recipient.next(contact);

                // Return the contact
                return contact;
            }),
            switchMap((contact) => {

                if ( !contact )
                {
                    return throwError('Could not found contact with id of ' + id + '!');
                }

                return of(contact);
            })
        );
    }

    async getRecipientsByGroupId(gId: any, nextToken?: string, isSwitched?: boolean, searchTxt?: string): Promise<any> {
        console.log('GETRECIPIENTS BY GROUPID------>');
        this.activateProgressBar();
        const { sub } = await this.auth.checkClientId();
        const recipFilter: SearchableRecipientFilterInput = {
            clientId: { eq: sub },
            groupId: { eq: gId }
        };
        if (searchTxt && searchTxt.length > 0) {
            recipFilter['phone'] = { wildcard: searchTxt };
            recipFilter['phoneTxt'] = { wildcard: searchTxt };
        }
        const sortCriteria: SearchableRecipientSortInput = {
            field: SearchableRecipientSortableFields.lastProcessDt,
            direction: SearchableSortDirection.desc
        };
        this.nextToken = nextToken ? nextToken : null;
        return new Promise((resolve, reject) => {
            this.api.SearchRecipients(recipFilter, sortCriteria, this.pageSize, this.nextToken)
                .then((result: SearchRecipientsQuery) => {
                    this.nextToken = !_.isEmpty(result['nextToken']) ? result['nextToken'] : null;
                    this._pageChange.next(this.nextToken);
                    if (this.nextToken) {
                        if (isSwitched) {
                            this._recipients.next(null);
                        }
                        this._recipients.next(result.items);
                        resolve(result.items.length);
                        this.activateProgressBar('off');
                    } else {
                        if (result.total === 0) {
                            this._recipients.next(result.items);
                        }
                        resolve(null);
                        this.activateProgressBar('off');
                    }
                })
                .catch((error) => {
                    this.activateProgressBar('off');
                    this.catchError(error);
                    reject(error);
                });
        });
    }

    async getRecipientsArchived(searchTxt: string, nextToken?: string, isSwitched?: boolean): Promise<any> {
        this.activateProgressBar();
        const { sub } = await this.auth.checkClientId();
        const filter: SearchableRecipientFilterInput = {
            clientId: { eq: sub },
            archive: { eq: true }
        };
        if (searchTxt && searchTxt.length > 0) {
            filter['phone'] = { wildcard: searchTxt };
            filter['phoneTxt'] = { wildcard: searchTxt };
        }
        const sortCriteria: SearchableRecipientSortInput = {
            field: SearchableRecipientSortableFields.lastProcessDt,
            direction: SearchableSortDirection.desc
        };
        this.nextToken = nextToken ? nextToken : null;
        return new Promise((resolve, reject) => {
            this.api.SearchRecipients(filter, sortCriteria, this.pageSize, this.nextToken)
                .then((result: SearchRecipientsQuery) => {
                    this.nextToken = !_.isEmpty(result['nextToken']) ? result['nextToken'] : null;
                    this._pageChange.next(this.nextToken);
                    if(this.nextToken) {
                        if (isSwitched) {
                            this._recipients.next(null);
                        }
                        this._recipients.next(result.items);
                        resolve(result.items.length);
                        this.activateProgressBar('off');
                    } else {
                        if(result.total === 0) {
                            this._recipients.next(result.items);
                        }
                        resolve(null);
                        this.activateProgressBar('off');
                    }
                })
                .catch((error) => {
                    this.activateProgressBar('off');
                    this.catchError(error);
                    reject(error);
                });
        });
    }

    async importRecipients(dataRecipients: any[], dataGroup: any[], clientId: string): Promise<any> {
        const allAdditions = [];
        dataRecipients.forEach( (item) => {
            this.recipientExists(item, clientId)
                .then( (exists) => {
                    if (exists.length === 0) {
                        allAdditions.push(this.addRecipient(item, dataGroup[0].id, clientId));
                    } else {
                        allAdditions.push(this.updateRecipient(exists[0], dataGroup[0].id));
                    }
                });
        });
        return new Promise((resolve, reject) => {
            Promise.all([
                allAdditions
            ]).then((imports) => {
                    this.activateProgressBar('off');
                    resolve(imports);
                },
                reject
            );
        });
    }

    addRecipient(item, groupId, clientId): Promise<any> {
        const dateAt = new Date().toISOString();
        this.activateProgressBar('on');
        return new Promise((resolve, reject) => {
            const payloadInput: CreateRecipientInput = {
                phone: item,
                phoneTxt: item,
                archive: false,
                clientId: clientId,
                carrierStatus: null,
                lastProcessDt: dateAt,
                status: EntityStatus.ACTIVE,
                recipientGroupId: groupId,
                groupId: groupId,
            };
            this.api.CreateRecipient(payloadInput)
                .then((result) => {
                    this.activateProgressBar('off');
                    resolve(result);
                }).catch( (error) => {
                    this.activateProgressBar('off');
                    this.catchError(error);
                    resolve(error);
                });
        });
    }

    /**
     * Update recipients
     *
     * @param recipient
     * @returns
     */
    updateRecipient(recipient: any, groupId): Promise<any> {
        const dateAt = new Date().toISOString();
        this.activateProgressBar('on');
        return new Promise((resolve, reject) => {
            const payloadInput: UpdateRecipientInput = {
                id: recipient.id,
                phone: recipient.phone,
                phoneTxt: recipient.phone,
                archive: false,
                carrierStatus: null,
                lastProcessDt: dateAt,
                _version: recipient._version,
                status: EntityStatus.ACTIVE,
                recipientGroupId: groupId,
                groupId: groupId
            };
            this.api.UpdateRecipient(payloadInput)
                .then((result) => {
                    this.activateProgressBar('off');
                    resolve(result);
                }).catch( (error) => {
                    this.activateProgressBar('off');
                    this.catchError(error);
                    reject(error);
            });
        });
    }

    async deleteContact(id: string): Promise<any> {
        this.activateProgressBar('on');
        return new Promise((resolve, reject) => {
            const payload: UpdateRecipientInput = {
                id: id,
                archive: true
            };
            this.api.UpdateRecipient(payload)
                .then((resp: UpdateRecipientMutation) => {
                    const newPayload: DeleteRecipientInput = {
                        id: resp.id,
                        _version: resp._version
                    };
                    return this.api.DeleteRecipient(newPayload);
                })
                .then((resp: DeleteRecipientMutation) => {
                    this.activateProgressBar('off');
                    resolve(true);
                })
                .catch((error: any) => {
                    this.activateProgressBar('off');
                    this.catchError(error);
                    reject(error.message);
                });
        });
    }

    /**
     * Update recipient status
     *
     * @param recipient
     * @returns
     */
    updateRecipientStatus(recipient: any, wbl: EntityStatus): Promise<any> {
        const dateAt = new Date().toISOString();
        return new Promise((resolve, reject) => {
            const payloadInput: UpdateRecipientInput = {
                id: recipient.id,
                lastProcessDt: dateAt,
                _version: recipient._version,
                status: wbl,
            };
            this.api.UpdateRecipient(payloadInput)
                .then((result) => {
                    resolve(result);
                }).catch( (error) => {
                    this.catchError(error);
                    reject(error);
            });
        });
    }


    /**
     * update recipients mutable options
     *
     * @param recipient
     * @returns
     */
    updateRecipientDetail(recipient: any): Promise<any> {
        const dateAt = new Date().toISOString();
        this.activateProgressBar('on');
        return new Promise((resolve, reject) => {
            this.api.GetRecipient(recipient.id)
                .then((oldRec) => {
                    const payloadInput: UpdateRecipientInput = {
                        id: oldRec.id,
                        phone: recipient.phone,
                        phoneTxt: recipient.phone.toString(),
                        recipientGroupId: recipient.recipientGroupId,
                        groupId: recipient.recipientGroupId,
                        lastProcessDt: dateAt,
                        _version: oldRec._version,
                        status: recipient.status || EntityStatus.ACTIVE
                    };
                    return this.api.UpdateRecipient(payloadInput);
                }).then((newRec) => {
                    this.activateProgressBar('off');
                    resolve(newRec);
                }).catch( (error) => {
                    this.activateProgressBar('off');
                    this.catchError(error);
                    reject(error);
            });
        });
    }

    activateProgressBar(active = 'on'): void {
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
