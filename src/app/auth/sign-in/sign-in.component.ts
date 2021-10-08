import {ChangeDetectorRef, Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/core/auth/auth.service';
import {CognitoUser} from 'amazon-cognito-identity-js';

@Component({
    selector     : 'auth-sign-in',
    templateUrl  : './sign-in.component.html',
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class AuthSignInComponent implements OnInit
{
    @ViewChild('signInNgForm') signInNgForm: NgForm;

    alert: { type: FuseAlertType; message: string } = {
        type   : 'success',
        message: ''
    };
    signInForm: FormGroup;
    confirmUpForm: FormGroup;
    showAlert: boolean = false;
    confirmEnabled: boolean = false;
    currentUser: CognitoUser|any;

    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _authService: AuthService,
        private _formBuilder: FormBuilder,
        private cd: ChangeDetectorRef,
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
        this.signInForm = this._formBuilder.group({
            email     : ['', [Validators.required, Validators.email]],
            password  : ['', Validators.required],
            rememberMe: ['']
        });
        this.confirmUpForm = this._formBuilder.group({
                cnumber    : ['', Validators.required],
                cEmail     : ['', [Validators.required]]
            }
        );
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Sign in
     */
    signIn(): void
    {
        // Return if the form is invalid
        if ( this.signInForm.invalid )
        {
            return;
        }

        // Disable the form
        this.signInForm.disable();

        // Hide the alert
        this.showAlert = false;
        this.signInForm.value.username =  this.signInForm.value.email.split('@')[0];
        // Sign in
        this._authService.signIn(this.signInForm.value)
            .then( (user: CognitoUser|any) => {
                this._router.navigate(['client/recipients']);
            }).catch((error) => {
                switch (error.code) {
                    case 'UserNotConfirmedException':
                        this.createConfForm(this.signInForm.value.email);
                        this.confirmEnabled = true;
                        break;
                    case 'UserNotFoundException':
                        this.signInForm.enable();
                        // this.signInNgForm.resetForm();
                        this.alert = {
                            type   : 'error',
                            message: 'Wrong email or password'
                        };
                        this.showAlert = true;
                        this.confirmEnabled = false;
                        break;
                    default:
                        this.signInForm.enable();
                        // this.signInNgForm.resetForm();
                        this.alert = {
                            type   : 'error',
                            message: 'Wrong email or password'
                        };
                        this.showAlert = true;
                        this.confirmEnabled = false;
                        break;
                }
        });
    }

    createConfForm(email: string): void {
        this.confirmUpForm.get('cEmail').setValue(email, { onlySelf: true });
        this.cd.detectChanges();
        this.confirmEnabled = true;
    }

    confirmUp(): void {
        if ( this.confirmUpForm.invalid )
        {
            return;
        }
        if (!this.confirmUpForm.value.cnumber && this.confirmUpForm.value.cnumber.length < 6) {
            this.alert = {
                type   : 'error',
                message: 'Confirmation Number is invalid'
            };
            return;
        }
        this._authService.confirmChallenge(this.signInForm.value, this.confirmUpForm.value.cnumber)
            .then((data: any)  => {
                console.log(data);
                this._router.navigate(['client/recipients']);
            }).catch((error: any) => {
                let message = '';
                if (error.code === 'CodeMismatchException') {
                    message = 'Confirmation code Mismatch!';
                } else if (error.code === 'NotAuthorizedException') {
                    message = 'User is not authorized or does not exist!!';
                } else {
                    message = error.message;
                }
                this.alert = {
                    type   : 'error',
                    message: message
                };
                this.showAlert = true;
            });
    }
}
