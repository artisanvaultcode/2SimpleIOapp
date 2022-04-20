import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MsgTemplateService } from '../../../../../core/services/msg-template.service';

@Component({
    selector: 'app-wizard-message',
    templateUrl: './wizard-message.component.html',
    styleUrls: ['./wizard-message.component.scss']
})
export class WizardMessageComponent implements OnInit {

    @Output() cancel = new EventEmitter<any>();
    @Input() dataMessage: string;
    formMessage: FormGroup;

    constructor(
        private _formBuilder: FormBuilder,
        private _msgTemplateService: MsgTemplateService,
    ) {
        this.formMessage = this._formBuilder.group({
            message: ['', [Validators.required, Validators.minLength(1)]],
        });
    }

    ngOnInit(): void {
        if(this.dataMessage) {
            this.formMessage.get('message').setValue(this.dataMessage);
            this.formMessage.updateValueAndValidity();
        } else {
            this._msgTemplateService.activateProgressBar();
            this._msgTemplateService.getDefaultMsg()
                .then((res: any) => {
                    this.formMessage.get('message').setValue(res.message);
                    this._msgTemplateService.activateProgressBar('off');
                })
                .catch((err) => {
                    console.log('[getDefaultMsg:]', err);
                    this._msgTemplateService.activateProgressBar('off');
                });
        }
    }

    get formData(): any {
        return this.formMessage.value;
    }

    close(): void {
        this.cancel.emit();
    }
}
