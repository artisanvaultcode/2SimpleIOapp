import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ProfileService} from '../profile.service';

@Component({
    selector       : 'settings-security',
    templateUrl    : './security.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsSecurityComponent implements OnInit
{
    securityForm: FormGroup;

    /**
     * Constructor
     */
    constructor(
        private _formBuilder: FormBuilder,
        private _profileService: ProfileService
    )
    {
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
        return this.securityForm = this._formBuilder.group({
            currentPassword  : [''],
            newPassword      : ['']
        });
    }

    changePassword($event): void {
        const newAttr = this.securityForm.getRawValue();
        this._profileService.changePassword( newAttr.currentPassword, newAttr.newPassword)
            .then((results: any) => {
            }).catch((reason) => {
        });
    }
}
