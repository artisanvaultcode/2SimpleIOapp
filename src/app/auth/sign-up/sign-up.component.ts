import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/core/auth/auth.service';
import {CognitoUser} from 'amazon-cognito-identity-js';

@Component({
    selector     : 'auth-sign-up',
    templateUrl  : './sign-up.component.html',
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class AuthSignUpComponent implements OnInit
{
    @ViewChild('signUpNgForm') signUpNgForm: NgForm;

    alert: { type: FuseAlertType; message: string } = {
        type   : 'success',
        message: ''
    };
    signUpForm: FormGroup;
    showAlert: boolean = false;
    /**
     * Constructor
     */
    constructor(
        private _authService: AuthService,
        private _formBuilder: FormBuilder,
        private _router: Router
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
        // Create the form
        this.signUpForm = this._formBuilder.group({
                firstName: ['', Validators.required],
                email     : ['', [Validators.required, Validators.email]],
                password  : ['', Validators.required],
                agreements: ['', Validators.requiredTrue],
                familyName: ['', Validators.required],
                givenName:  [''],
                username:  [''],
                name:  ['']
            }
        );
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Sign up
     */
    signUp(): void {
        if ( this.signUpForm.invalid ) {
            return;
        }
        this.signUpForm.disable();
        this.showAlert = false;
        this.signUpForm.value.username =  this.signUpForm.value.email;
        this.signUpForm.value.givenName = this.signUpForm.value.givenName.length > 0 ? this.signUpForm.value.givenName : '';
        this.signUpForm.value.name = `${this.signUpForm.value.firstName} ${this.signUpForm.value.givenName} ${this.signUpForm.value.familyName}`;
        this._authService.signUp(this.signUpForm.value)
            .then((user: CognitoUser|any) => {
                    this._router.navigateByUrl('auth/login');
                }).catch( (error: any) => {
                    // Re-enable the form
                    this.signUpForm.enable();
                    // Reset the form
                    // this.signUpNgForm.resetForm();
                    // Set the alert
                    this.alert = {
                        type   : 'error',
                        message: 'Something went wrong, please try again.'
                    };
                    // Show the alert
                    this.showAlert = true;
                }
            );
    }
}
