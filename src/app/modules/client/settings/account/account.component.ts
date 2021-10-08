import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {ProfileService} from '../profile.service';
import {Observable} from 'rxjs';

@Component({
    selector       : 'settings-account',
    templateUrl    : './account.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsAccountComponent implements OnInit
{
    currentUser$: Observable<any>;
    user: any;
    userName: any;
    accountForm: FormGroup;

    /**
     * Constructor
     */
    constructor(
        private _formBuilder: FormBuilder,
        private _profileService: ProfileService
    )
    {
        this.currentUser$ = this._profileService.profile$;
        this._profileService.profile$.subscribe((userIn) => {
            this.user = userIn;
        });
        this._profileService.userName$.subscribe((userName) => {
            this.userName = userName;
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
       this.createUserForm();
    }

    createUserForm(): FormGroup {
        return this.accountForm = this._formBuilder.group({
            name    : [this.user?.name],
            username: [this.userName],
            title   : [this.user?.title],
            company : [this.user?.company],
            about   : [this.user?.about],
            email   : [this.user?.email, Validators.email],
            phone   : [this.user?.phone]
        });
    }

    save($event): void {
        const newAttr = this.accountForm.getRawValue();
        this._profileService.updateUserAttributes( newAttr)
            .then((results: any) => {
            }).catch((reason) => {
        });
    }

    cancel($event): void {
        this._profileService.refresh();
        this.createUserForm();
    }
}
