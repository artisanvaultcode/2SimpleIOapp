import {Inject, Injectable} from '@angular/core';
import {BehaviorSubject, Observable, of} from 'rxjs';
import Auth from '@aws-amplify/auth';
import {CognitoUser} from 'amazon-cognito-identity-js';
import {HttpClient} from '@angular/common/http';
import { Logger } from 'aws-amplify';
import {APIService} from '../../../API.service';

@Injectable({
    providedIn: 'root'
})
export class ProfileService {
    userPreferences: CognitoUser|any;
    userPoolId: any;
    private logger = new Logger('ProfileService');
    private preferencesOnChanged: BehaviorSubject<any> = new BehaviorSubject(null);
    private userNameOnChanged: BehaviorSubject<any> = new BehaviorSubject(null);
    /**
     * Constructor
     *
     * @param options
     * @param _fuseProgressBarService
     * @param httpClient
     * @param api
     * @param customApi
     */
    constructor(
        private httpClient: HttpClient,
        private api: APIService
    ) {
        // Set the defaults
    }

    get profile$(): Observable<any>
    {
        return this.preferencesOnChanged.asObservable();
    }

    get userName$(): Observable<any>
    {
        return this.userNameOnChanged.asObservable();
    }

    getCurrentUserNameOrId(): string {
        return this.userPreferences['username'] || this.userPreferences.attributes['sub'] ;
    }

    refresh(): void {
        of(this.getCurrentUser());
    }
    /**
     * Get photos & videos
     */
    getCurrentUser(): Promise<CognitoUser|any> {
        return new Promise((resolve, reject) => {
            Auth.currentAuthenticatedUser({
                bypassCache: true
            }).then((user: CognitoUser|any) => {
                this.userPreferences = user;
                const {attributes, username } = this.userPreferences;
                const attrObj = this.attrToObj(attributes, username);
                this.preferencesOnChanged.next(attrObj);
                this.userNameOnChanged.next(username);
                resolve(attributes);
            }).catch((error: any) => {
                this.catchError(error);
                reject(error.message);
            });
        });
    }

    changePassword(oldPassword: string, newPassword: string ): Promise<any> {
        return new Promise((resolve, reject) => {
            Auth.currentAuthenticatedUser({bypassCache: true})
                .then((user: CognitoUser|any) => Auth.changePassword(user, oldPassword, newPassword)).then((user: any) => {
                    console.log(user);
                    console.log('change -->');
                    this.userPreferences = user;
                    const {attributes, username } = this.userPreferences;
                    const attrObj = this.attrToObj(attributes, username);
                    this.preferencesOnChanged.next(attrObj);
                    this.userNameOnChanged.next(username);
                    resolve(attrObj);
                }).catch((error: any) => {
                  this.catchError(error);
                  reject(error.message);
            });
        });
    }

    updateUserAttributes(attrToChange: any ): Promise<any> {
        const newAttributes = this.objToAttr(attrToChange);
        return new Promise((resolve, reject) => {
            Auth.currentAuthenticatedUser({bypassCache: true})
                .then((user: CognitoUser|any) => {
                    return  Auth.updateUserAttributes(user, newAttributes);
                }).then((results: any) => Auth.currentAuthenticatedUser({
                        bypassCache: true
                    })).then((user: CognitoUser|any) => {
                    this.userPreferences = user;
                    const {attributes, username } = this.userPreferences;
                    const attrObj = this.attrToObj(attributes, username);
                    this.preferencesOnChanged.next(attrObj);
                    this.userNameOnChanged.next(username);
                    resolve(attrObj);
                }).catch((error: any) => {
                    this.catchError(error);
                    reject(error.message);
            });
        });
    }

    private attrToObj(attributes: any, username: any): any {
        return  {
            username: username,
            email: attributes?.email,
            name: attributes?.name,
            sub: attributes?.sub,
            phone: attributes['phone_number'] || '+19999999999',
            about: attributes['custom:about'] || 'About Your Company..',
            title: attributes['custom:title'] || 'Your Title..',
            company: attributes['custom:company'] || 'Your company name..'
        };
    }

    private objToAttr(obj: any): any {
        const attributes = {};
        attributes['name'] = obj.name;
        attributes['phone_number'] = obj.phone;
        attributes['custom:about'] = obj.about;
        attributes['custom:title'] = obj.title;
        attributes['custom:company'] = obj.company;
        return attributes;
    }

    private catchError(error): void {
      console.log(error);
      this.logger.debug('OOPS!', error);
    }

}
