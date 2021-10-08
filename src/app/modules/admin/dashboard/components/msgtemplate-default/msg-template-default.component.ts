import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { CreateMsgTemplateInput, EntityStatus, MsgTemplate, TemplateUsage } from 'app/API.service';
import { AuthService } from 'app/core/auth/auth.service';
import { MsgTemplateService } from 'app/core/services/msg-template.service';

@Component({
    selector: 'msg-default',
    templateUrl: './msg-template-default.component.html',
    encapsulation: ViewEncapsulation.None,
})
export class MsgTemplateDefaultComponent implements OnInit {
    msgDefault: CreateMsgTemplateInput;
    composeForm: FormGroup;
    quillModules: any = {
        toolbar: [['clean']],
    };
    showAlert: boolean = false;
    clientid: string;

    /**
     * Constructor
     */
    constructor(
        public matDialogRef: MatDialogRef<MsgTemplateDefaultComponent>,
        private _formBuilder: FormBuilder,
        private _authService: AuthService,
        private _msgTemplateService: MsgTemplateService,
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.composeForm = this._formBuilder.group({
            name: ['', Validators.required],
            message: ['', Validators.required],
        });
        this.getClientID();
        this.setMsgDefault();
        this.composeForm.patchValue(this.msgDefault);
        
    }
    
    setMsgDefault(){
        this.msgDefault = {
            name: '',
            message: ''
        }
        this.msgDefault.status = EntityStatus.ACTIVE;
        this.msgDefault.default = TemplateUsage.DEFAULT;
    }
    
    getClientID(){
        this._authService.checkClientId()
            .then(resp => {
                this.clientid = resp['sub'];
            });
    }
    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------
    /**
     * Save and close
     */
    saveAndClose(): void {
        // Hide the alert
        this.showAlert = false;
        // Close the dialog
        const newMgsTemplate: MsgTemplate = this.composeForm.getRawValue();
        if (this.composeForm.invalid){
            console.log("Validation Form invalid...");
            this.showAlert = true;
        } else {
            this.msgDefault.clientId = this.clientid;
            this.msgDefault.name = newMgsTemplate.name;
            var msgTemp = newMgsTemplate.message;
            msgTemp = msgTemp.replace("<p>", "");
            msgTemp = msgTemp.replace("</p>", "");
            this.msgDefault.message = msgTemp;
            // Create default message
            this._msgTemplateService.addDefault(this.msgDefault, this.clientid)
                .then(resp => console.log("message saved..."));
            this.matDialogRef.close();
        }
    }
}
