import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable, of, throwError} from 'rxjs';
import {map, switchMap, take} from 'rxjs/operators';
import * as _ from 'lodash';
import {Logger} from '@aws-amplify/core';
import {
    APIService,
    Device, EntityStatus,
    ModelDeviceFilterInput,
    SearchableDeviceFilterInput, SearchableDeviceSortableFields, SearchableDeviceSortInput,
    SearchableSortDirection, UpdateDeviceInput
} from '../../../API.service';
import {AuthService} from '../../../core/auth/auth.service';

@Injectable({
    providedIn: 'root'
})
export class DevicesService
{

    // Private
    pageSize: number;
    nextToken: string = null;
    private logger = new Logger('Devices List');
    private _device: BehaviorSubject<any | null> = new BehaviorSubject(null);
    private _clientId: BehaviorSubject<any | null> = new BehaviorSubject(null);
    private _devices: BehaviorSubject<any[] | null> = new BehaviorSubject(null);
    private _deviceIds: BehaviorSubject<any[] | null> = new BehaviorSubject(null);
    private _pageChange: BehaviorSubject<any | null> = new BehaviorSubject(null);
    /**
     * Constructor
     */
    constructor(
        private api: APIService,
        private _auth: AuthService,
        private _httpClient: HttpClient
    )
    {
        this.pageSize = 10;
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for device
     */

    get deviceIds$(): Observable<any>
    {
        return this._deviceIds.asObservable();
    }

    get clientId$(): Observable<any>
    {
        return this._clientId.asObservable();
    }

    get nextPage$(): Observable<any>
    {
        return this._pageChange.asObservable();
    }

    get device$(): Observable<any>
    {
        return this._device.asObservable();
    }

    /**
     * Getter for devices
     */
    get devices$(): Observable<any[]>
    {
        return this._devices.asObservable();
    }

    set setDevices(devices: any[]) {
        this._deviceIds.next(devices);
    }
    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------
    refresh(): void {
        of(this.getDevices());
    }
    /**
     * Get devices
     */
    async getDevices(searchTxt?: string, nextToken?: string): Promise<any>
    {
        const {sub} = await this._auth.checkClientId();
        this._clientId.next(sub);
        // eslint-disable-next-line @typescript-eslint/no-shadow
        let filter: ModelDeviceFilterInput = {
            clientId: { eq: sub }
        };
        if (searchTxt !== undefined && searchTxt) {
            filter = {
                clientId: { eq: sub},
                or: [{ description: {contains: searchTxt} , uniqueId: { contains: searchTxt}}]
            };
        }
        this.nextToken = nextToken ? nextToken : null;
        return new Promise((resolve, reject) => {
           this.api.ListDevices(filter, this.pageSize, this.nextToken)
                .then((result) => {
                    this.nextToken = !_.isEmpty(result['nextToken']) ? result['nextToken'] : null;
                    this._pageChange.next(this.nextToken);
                    const notDeleted = result.items.filter(item => item._deleted !== true);
                    this._devices.next(notDeleted);
                    resolve(notDeleted.length);
                })
                .catch((err) => {
                        this.catchError(err);
                        reject(err);
                    });

        });
    }

    async searchDevices(searchTxt: string): Promise<any> {
        const {sub} = await this._auth.checkClientId();
        let filter: SearchableDeviceFilterInput = {
            clientId: { eq: sub},
        };
        if (searchTxt && searchTxt.length>0) {
            filter = {
                uniqueId: { eq: searchTxt},
                clientId: { eq: sub},
                or: [
                    { phoneTxt: {wildcard: '*'+searchTxt +'*'}}
                ]
            };
        }
        const sortCriteria: SearchableDeviceSortInput = {
            field: SearchableDeviceSortableFields.uniqueId,
            direction: SearchableSortDirection.asc
        };
        return new Promise((resolve, reject) => {
            this.api.SearchDevices(filter, sortCriteria)
                .then((result) => {
                    console.log(result.items);
                    this._devices.next(result.items);
                    resolve(result.items.length);
                })
                .catch((err) => {
                    this.catchError(err);
                    reject(err);
                });

        });
    }

    deviceExists(searchTxt?: string): Promise<any> {
        // eslint-disable-next-line @typescript-eslint/no-shadow
        let filter: ModelDeviceFilterInput;
        if (searchTxt !== undefined && searchTxt) {
            filter = {
                uniqueId: { eq: searchTxt},
                or: [
                    {
                        phoneTxt: {contains: searchTxt}
                    }
                ]
            };
        }
        return new Promise((resolve, reject) => {
            this.api.ListDevices(filter)
                .then((result) => {
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
    getDeviceById(id: string): Observable<any> {
        return this._devices.pipe(
            take(1),
            map((device) => {

                // Find the contact
                const deviceEntity = device.find(item => item.id === id) || null;

                // Update the contact
                this._device.next(deviceEntity);

                // Return the contact
                return deviceEntity;
            }),
            switchMap((device) => {

                if ( !device )
                {
                    return throwError('Could not found device with id of ' + id + '!');
                }

                return of(device);
            })
        );
    }

    /**
     * Status update - Devices
     *
     * @param device
     * @param toStatus
     * @returns
     */
    updateDevice(device: any, toStatus: EntityStatus): Promise<any> {
        const dateAt = new Date().toISOString();
        return new Promise((resolve, reject) => {
            const payloadInput: UpdateDeviceInput = {
                id: device.id,
                lastProcessDt: dateAt,
                _version: device._version,
                status: toStatus
            };
            this.api.UpdateDevice(payloadInput)
                .then((result) => {
                    resolve(result);
                }).catch( (error) => {
                    this.catchError(error);
                    resolve(error);
            });
        });
    }

    updateMetadataDevice(device: Device, metadata: string): Promise<any> {
        const dateAt = new Date().toISOString();
        return new Promise((resolve, reject) => {
            const payloadInput: UpdateDeviceInput = {
                id: device.id,
                lastProcessDt: dateAt,
                _version: device._version,
                metadata: metadata,
            };
            this.api.UpdateDevice(payloadInput)
                .then((result) => {
                    resolve(result);
                }).catch( (error) => {
                    this.catchError(error);
                    resolve(error);
            });
        });
    }

    /**
     * Delete the contact
     *
     * @param id
     */
    deleteContact(id: string): Observable<boolean>
    {
        return this.device$.pipe(
            take(1),
            switchMap(contacts => this._httpClient.delete('api/apps/contacts/contact', {params: {id}}).pipe(
                map((isDeleted: boolean) => {

                    // Find the index of the deleted contact
                    const index = contacts.findIndex(item => item.id === id);

                    // Delete the contact
                    contacts.splice(index, 1);

                    // Update the contacts
                    this._devices.next(contacts);

                    // Return the deleted status
                    return isDeleted;
                })
            ))
        );
    }

    private catchError(error): void {
        console.log(error);
        this.logger.debug('OOPS!', error);
    }
}
