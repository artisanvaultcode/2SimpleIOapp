import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable, of, throwError} from 'rxjs';
import {filter, map, switchMap, take, tap} from 'rxjs/operators';

import { Logger } from '@aws-amplify/core';
import { Hub } from 'aws-amplify';
import { AuthService } from '../../../core/auth/auth.service';
import {
    APIService,
    CreateRecipientInput,
    EntityStatus, ListRecipientsQuery,
    ModelRecipientFilterInput,
    SearchableRecipientFilterInput,
    SearchableRecipientSortableFields,
    SearchableRecipientSortInput,
    SearchableSortDirection,
    UpdateRecipientInput
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
    private _recipient: BehaviorSubject<any | null> = new BehaviorSubject(null);
    private _recipients: BehaviorSubject<any[] | null> = new BehaviorSubject(null);
    private _pageChange: BehaviorSubject<any | null> = new BehaviorSubject(null);
    private defaultGroupId = '10172232-cca8-4f4c-b3df-1e96ab3fa431';
    /**
     * Constructor
     */
    constructor(
        private api: APIService,
        private auth: AuthService,
        private _httpClient: HttpClient
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


    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------
    refresh(): void {
        this.nextToken =null;
        this._pageChange.next(this.nextToken);
        of(this.getRecipients());
    }

    goNextPage(filterTxt: string, nextPageToken: string): void {
        of(this.getRecipients(filterTxt,  nextPageToken));
    }
    /**
     * Get recipients
     */
    async getRecipients(searchTxt?: string, nextToken?: string): Promise<any> {
        this.activateProgressBar();
        const { sub } = await this.auth.checkClientId();
        const filterRec: ModelRecipientFilterInput =  {
            clientId: { eq: sub},
            status: { ne: EntityStatus.INACTIVE}
        };
        if (searchTxt !== undefined && searchTxt) {
            filterRec['phoneTxt'] = { contains: searchTxt};
        }
        this.nextToken = nextToken ? nextToken : null;
        return new Promise((resolve, reject) => {
           this.api.ListRecipients(filterRec, this.pageSize, this.nextToken)
                .then((result: ListRecipientsQuery) => {
                    this.nextToken = !_.isEmpty(result['nextToken']) ? result['nextToken'] : null;
                    this._pageChange.next(this.nextToken);
                    this._recipients.next(result.items);
                    resolve(result.items);
                    this.activateProgressBar('off');
                })
                .catch((err) => {
                    this.catchError(err);
                    reject(err);
                    this.activateProgressBar('off');
                });

        });
    }

    async searchRecipients(searchTxt: string): Promise<any> {

        if (searchTxt.length===0) {
            this.refresh();
            return Promise.resolve();
        }
        const { sub } = await this.auth.checkClientId();
        // eslint-disable-next-line @typescript-eslint/no-shadow
        const filter: SearchableRecipientFilterInput = {
            clientId: { eq: sub},
            phone: { wildcard: searchTxt },
            or :[
                { phoneTxt: {wildcard: searchTxt}}
            ]

        };
        const sortCriteria: SearchableRecipientSortInput= {
            field: SearchableRecipientSortableFields.phone,
            direction: SearchableSortDirection.asc
        };
        return new Promise((resolve, reject) => {
            this.api.SearchRecipients(filter, sortCriteria, 10)
                .then((result) => {
                    this.nextToken = null;
                    this._pageChange.next(this.nextToken);
                    this._recipients.next(null);
                    this._recipients.next(result.items);
                    resolve(result.items.length);
                })
                .catch((err) => {
                    this.catchError(err);
                    reject(err);
                });

        });
    }

    async recipientExists(searchTxt: string, clientId: string): Promise<any> {
        // eslint-disable-next-line @typescript-eslint/no-shadow
        let filter: ModelRecipientFilterInput;
        const { sub } = await this.auth.checkClientId();
        if (searchTxt !== undefined && searchTxt) {
            filter = {
                phone: { eq: searchTxt},
                clientId: { eq: sub},
                or: [
                    {
                        phoneTxt: {contains: searchTxt}
                    }
                ],
                and: [{ clientId: {eq: clientId} }]
            };
        }
        return new Promise((resolve, reject) => {
            this.api.ListRecipients(filter)
                .then((result: ListRecipientsQuery) => {
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


    async getRecipientsByGroupId(gId: any, nextToken?: string): Promise<any> {
        this.activateProgressBar();
        const { sub } = await this.auth.checkClientId();
        const recipFilter: ModelRecipientFilterInput = {
            clientId: { eq: sub },
            and :[
                { groupId: { eq: gId }}
            ]
        };
        this.nextToken = nextToken ? nextToken : null;
        return new Promise((resolve, reject) => {
            this.api.ListRecipients(recipFilter, this.pageSize, nextToken)
                .then((result: ListRecipientsQuery) => {
                    this.nextToken = !_.isEmpty(result['nextToken']) ? result['nextToken'] : null;
                    this._pageChange.next(this.nextToken);
                    const notDeleted = result.items.filter(item => item._deleted !== true);
                    this._recipients.next(notDeleted);
                    resolve(notDeleted.length);
                    this.activateProgressBar('off');
                })
                .catch((error) => {
                    this.activateProgressBar('off');
                    this.catchError(error);
                    reject(error);
                });
        });
    }

    importRecipients(data: any[], clientId: string): Promise<any> {
        const allAdditions = [];
        data.forEach( (item) =>{
            this.recipientExists(item, clientId)
                .then( (exists) => {
                    if (exists.length === 0) {
                        allAdditions.push(this.addRecipient(item, clientId));
                    } else {
                        allAdditions.push(this.updateRecipient(exists));
                    }
                });
        });
        return new Promise((resolve, reject) => {
            Promise.all([
                allAdditions
            ]).then((imports) => {
                    resolve(imports);
                },
                reject
            );
        });
    }

    addRecipient(item, clientId): Promise<any> {
        const dateAt = new Date().toISOString();
        return new Promise((resolve, reject) => {
            const payloadInput: CreateRecipientInput = {
                phone: item,
                phoneTxt: item,
                clientId: clientId,
                carrierStatus: null,
                lastProcessDt: dateAt,
                status: EntityStatus.ACTIVE,
                recipientGroupId: this.defaultGroupId,
                groupId: this.defaultGroupId
            };
            this.api.CreateRecipient(payloadInput)
                .then((result) => {
                    resolve(result);
                }).catch( (error) => {
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
    updateRecipient(recipient: any): Promise<any> {
        const dateAt = new Date().toISOString();
        return new Promise((resolve, reject) => {
            const payloadInput: UpdateRecipientInput = {
                id: recipient.id,
                phone: recipient.phone,
                phoneTxt: recipient.phone,
                carrierStatus: null,
                lastProcessDt: dateAt,
                _version: recipient._version,
                _deleted: null,
                status: EntityStatus.ACTIVE,
                recipientGroupId: this.defaultGroupId,
                groupId: this.defaultGroupId
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
                    resolve(newRec);
                }).catch( (error) => {
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
