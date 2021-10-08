import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable, of, throwError} from 'rxjs';
import {filter, map, switchMap, take, tap} from 'rxjs/operators';
import {
    APIService,
    CreateRecipientInput, EntityStatus,
    ListRecipientsQuery, ModelGroupFilterInput,
    ModelRecipientFilterInput, ModelStringInput,
    Recipient,
    SearchableRecipientFilterInput,
    SearchableRecipientSortableFields,
    SearchableRecipientSortInput,
    SearchableSortDirection, UpdateRecipientInput
} from '../../../API.service';
import * as _ from 'lodash';
import {Logger} from '@aws-amplify/core';
import {AuthService} from '../../../core/auth/auth.service';

@Injectable({
    providedIn: 'root'
})
export class GroupsRecipientsService
{

    private logger = new Logger('GroupList');
    private _group: BehaviorSubject<any | null> = new BehaviorSubject(null);
    private _groups: BehaviorSubject<any[] | null> = new BehaviorSubject(null);
    /**
     * Constructor
     */
    constructor(
        private api: APIService,
        private auth: AuthService,
        private _httpClient: HttpClient
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------
    /**
     * Getter for contact
     */
    get group$(): Observable<any>
    {
        return this._group.asObservable();
    }

    /**
     * Getter for contacts
     */
    get groups$(): Observable<any[]>
    {
        return this._groups.asObservable();
    }


    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------
    refresh(): void {
        of(this.getGroups());
    }

    /**
     * Get Groups
     */
    async getGroups(searchTxt?: string): Promise<any>
    {
        const { sub } = await this.auth.checkClientId();
        const filterTxt: ModelGroupFilterInput =  {
            clientId: { eq: sub},
        };
        if (searchTxt !== undefined && searchTxt) {
            filterTxt['name'] = { contains: searchTxt};
        }
        console.log(filterTxt)
        return new Promise((resolve, reject) => {
           this.api.ListGroups(filterTxt, 5)
                .then((result) => {
                    console.log(result)
                    const notDeleted = result.items.filter(item => item._deleted !== true);
                    console.log(notDeleted)
                    this._groups.next(notDeleted);
                    resolve(notDeleted.length);
                })
                .catch((err) => {
                    this.catchError(err);
                    reject(err);
                });
        });
    }

    private catchError(error): void {
        console.log(error);
        this.logger.debug('OOPS!', error);
    }
}
