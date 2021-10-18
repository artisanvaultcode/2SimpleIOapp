/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable, ReplaySubject} from 'rxjs';
import {Logger} from 'aws-amplify';
import { UserService } from 'app/core/user/user.service';
import Auth from '@aws-amplify/auth';
import {CognitoUser} from 'amazon-cognito-identity-js';
import {User} from '../user/user.types';
import {NavigationService} from '../navigation/navigation.service';
import {FuseNavigationService,
    FuseVerticalNavigationComponent}
from '../../../@fuse/components/navigation';

@Injectable()
export class AuthService
{
    private _authenticated: boolean = false;
    private _user: ReplaySubject<User> = new ReplaySubject<User>(1);
    private logger = new Logger('AuthService');
    /**
     * Constructor
     */
    constructor(
        private _httpClient: HttpClient,
        private _userService: UserService,
        private _navigationService: NavigationService,
        private _fuseNavigationService: FuseNavigationService

    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Setter & getter for access token
     */
    set accessToken(token: string)
    {
        localStorage.setItem('accessToken', token);
    }

    get accessToken(): string
    {
        return localStorage.getItem('accessToken') ?? '';
    }

    get user$(): Observable<User>
    {
        return this._user.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Forgot password
     *
     * @param email
     */
    forgotPassword(email: string): Observable<any>
    {
        return this._httpClient.post('api/auth/forgot-password', email);
    }

    /**
     * Reset password
     *
     * @param password
     */
    resetPassword(password: string): Observable<any>
    {
        return this._httpClient.post('api/auth/reset-password', password);
    }


    confirmChallenge(user: { name: string; username: string; email: string }, code: any): Promise<any> {
        return Auth.confirmSignUp(user.username, code);
    }
    /**
     * Sign in
     *
     * @param credentials
     */
    signIn(credentials): Promise<CognitoUser|any> {
        if (this._authenticated) {
            return;
        }
        const {password, username } =  credentials;
        const cognitoCreds = { username: username, password: password};
        return new Promise((resolve, reject) => {
            Auth.signIn(cognitoCreds)
                .then((user: CognitoUser | any) => {
                    this._authenticated = true;
                    const { attributes } = user;
                    this._userService.user = attributes;
                    this._user.next(attributes);
                    resolve(user);
                }).catch((error: any) => {
                    this.catchError(error, 'login');
                    reject(error);
                });
        });
    }

    /**
     * Sign out
     */
    signOut(): Promise<any> {
        return Auth.signOut()
            .then(() => {
                // localStorage.removeItem('accessToken');
                const navigation = this._fuseNavigationService.getComponent<FuseVerticalNavigationComponent>('mainNavigation');
                if ( navigation ) {
                    navigation.close();
                }
                this._navigationService.navSettings = {};
                this._user.next(null);
                this._userService.user = null;
                this._authenticated = false;
            });
    }

    /**
     * Sign up
     *
     * @param user
     */
    signUp(user: {
         name: string;
         username: string;
         email: string;
         password: string;
         familyName: string;
         firstName: string;
         givenName: string; }): Promise<CognitoUser|any> {
        return new Promise((resolve, reject) => {
            const newUser = {
                username: user.username.toLowerCase(),
                password : user.password,
                attributes: {
                    email: user.email,
                    name :  `${user.name}`,
                    family_name: user.familyName,
                    given_name: user.givenName,
                }};
           Auth.signUp(newUser)
            .then((userIn: CognitoUser | any) => {
                this._authenticated = false;
                const { attributes } = userIn;
                this._userService.user = attributes;
                this._user.next(attributes);
                resolve(user);
            }).catch((error: any) => {
                this.catchError(error, 'login');
                reject(error);
            });
        });
    }

    /**
     * Unlock session
     *
     * @param credentials
     */
    unlockSession(credentials: { email: string; password: string }): Observable<any>
    {
        return this._httpClient.post('api/auth/unlock-session', credentials);
    }

    /**
     * Check the authentication status
     */
    check(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            if (this._authenticated) {
                resolve(true);
            }
            Auth.currentAuthenticatedUser()
                .then((currentUser: CognitoUser|any) => {
                    this._authenticated = true;
                    const { attributes } = currentUser;
                    this._userService.user = attributes;
                    this._user.next(attributes);
                    return resolve(true);
            }).catch( (error: any) => {
                this.catchError(error, 'login');
                return resolve(false);
            });
        });
    }

    checkClientId(): Promise<any> {
        return new Promise((resolve, reject) => {
            Auth.currentAuthenticatedUser({
                bypassCache: true
            }).then((currentUser: CognitoUser|any) => {
                    const { attributes } = currentUser;
                    console.log('çlient attributes', attributes);
                    return resolve(attributes);
            }).catch( (error: any) => {
                this.catchError(error, 'login');
                return resolve(error);
            });
        });
    }

    private catchError(error, key): void {
        console.log(error);
        this.logger.debug(key , error);
    }
}
