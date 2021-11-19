import { ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MsgTemplateService } from 'app/core/services/msg-template.service';
import { CreateMsgTemplateInput, MsgTemplate, TemplateUsage } from '../../../../../API.service';
import { Hub } from 'aws-amplify';

@Component({
    selector: 'msg-default',
    templateUrl: './msg-template-default.component.html',
    encapsulation: ViewEncapsulation.None,
})
export class MsgTemplateDefaultComponent implements OnInit {

    id: string;
    version: number;
    isLoadingMsg: boolean;
    msgDefault: CreateMsgTemplateInput;
    composeForm: FormGroup;
    showAlert: boolean = false;
    clientid: string;

    /**
     * Constructor
     */
    constructor(
        public matDialogRef: MatDialogRef<MsgTemplateDefaultComponent>,
        private _formBuilder: FormBuilder,
        private _msgTemplateService: MsgTemplateService,
        private _changeDetectorRef: ChangeDetectorRef,
    ) {
        Hub.listen('processing', (data) => {
            if (data.payload.event === 'progressbarmsg') {
                this.isLoadingMsg = data.payload.data.activate === 'on';
                this._changeDetectorRef.markForCheck();
            }
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {

        this.composeForm = this._formBuilder.group({
            name: ['', [Validators.required, Validators.minLength(4)]],
            message: ['', [Validators.required, Validators.minLength(4)]],
        });
        this._msgTemplateService.activateProgressBar();
        this._msgTemplateService.getDefaultMsg()
                .then(respt => {
                    this.id = respt.id;
                    this.version = respt._version;
                    this.composeForm = this._formBuilder.group({
                        name: [respt.name, [Validators.required, Validators.minLength(4)]],
                        message: [respt.message, [Validators.required, Validators.minLength(4)]],
                    });
                    this._msgTemplateService.activateProgressBar('off');
                })
                .catch(err => {
                    console.log("[getDefaultMsg:]",err);
                    this._msgTemplateService.activateProgressBar('off');
                });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------
    /**
     * Save and close
     */
    saveAndClose(addupdate: string): void {
        // Hide the alert
        this.showAlert = false;
        if (addupdate === 'save'){
            this.updateDefaultMsg();
        }
    }

    updateDefaultMsg(){
        let updateMsgTemplate: MsgTemplate = this.composeForm.getRawValue();
        if (this.composeForm.invalid) {
            this.showAlert = true;
        } else {
            updateMsgTemplate.id = this.id;
            updateMsgTemplate._version = this.version;
            updateMsgTemplate.default = TemplateUsage.DEFAULT;
            // Create default message
            this._msgTemplateService.updateData(updateMsgTemplate, TemplateUsage.DEFAULT)
            this.matDialogRef.close();
        }
    }

    createDefaultMsg(sub: string){
        const newMgsTemplate: MsgTemplate = this.composeForm.getRawValue();
        if (this.composeForm.invalid) {
            console.log('Validation Form invalid...');
            this.showAlert = true;
        } else {
            this.msgDefault.clientId = sub;
            this.msgDefault.name = newMgsTemplate.name;
            this.msgDefault.message = newMgsTemplate.message;
            // Create default message
            this._msgTemplateService
                .addDefault(this.msgDefault, sub)
                .then((resp) => console.log('message saved...'));
            this.matDialogRef.close();
        }
    }
}
