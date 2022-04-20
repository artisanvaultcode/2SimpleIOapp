import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap, takeUntil } from 'rxjs/operators';
import { CampaignService } from '../../campaign.service';
import { Observable, Subject } from 'rxjs';
import { Group, Recipient } from '../../../../../API.service';

@Component({
    selector: 'app-wizard-search',
    templateUrl: './wizard-search.component.html',
    styleUrls: ['./wizard-search.component.scss']
})
export class WizardSearchComponent implements OnInit, OnDestroy{

    @Output() cancel = new EventEmitter<any>();
    @Output() stepperIndex = new EventEmitter<any>();

    @Input() formInfo: any;
    @Input() dataTargets: any[];

    recipients$: Observable<any[]>;
    labels$: Observable<any[]>;
    recipientTargets: Recipient[] = [];
    groupTargets: Group[] = [];

    formTarget = new FormControl();
    isLoading = false;
    errorMsg!: string;
    selectedTarget: any = '';
    groupTarget: any = '';

    private _unsubscribeAll = new Subject<void>();

    constructor(
        private http: HttpClient,
        private _campaignService: CampaignService
    ) {
    }

    onRecipSelected(): void {
        this.selectedTarget = this.formTarget.value;
        const target = this.recipientTargets.find(item => this.selectedTarget.id === item.id);
        if(!target && this.recipientTargets.length < 20) {
            this.recipientTargets.unshift(this.selectedTarget);
        }
    }

    onGroupSelected(): void {
        this.groupTarget = this.formTarget.value;
        const target = this.groupTargets.find(item => this.groupTarget.id === item.id);
        if(!target && this.groupTargets.length < 20) {
            this.groupTargets.unshift(this.groupTarget);
        }
    }

    displayWith(value: any): any {
        return value?.phone;
    }

    groupDisplayWith(value: any): any {
        return value?.name;
    }

    clearSelection(): void {
        this.selectedTarget = '';
        this.formTarget.reset();
    }

    ngOnInit(): void {
        this.recipients$ = this._campaignService.recipients$;
        this.labels$ = this._campaignService.labels$;

        this._campaignService.campaignTargets$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((targets: any[]) => {
                if(targets && targets.length > 0) {
                    if (this.formInfo.target === 'GROUP') {
                        this.groupTargets = targets.map(item => item.group);
                    } else if (this.formInfo.target === 'SELECTION') {
                        this.recipientTargets = targets.map(item => item.recipient);
                    }
                    setTimeout(() => {
                        this.stepperIndex.emit(3);
                    }, 200);
                } else {
                    if(this.formInfo.target === 'ALL') {
                        setTimeout(() => {
                            this.stepperIndex.emit(3);
                        }, 200);
                    }
                }
            });

        this.formTarget.valueChanges
            .pipe(
                takeUntil(this._unsubscribeAll),
                distinctUntilChanged(),
                debounceTime(500),
                switchMap((value: any) => {
                    if(this.formInfo.target === 'SELECTION') {
                        return this._campaignService.searchRecipients(value)
                            .finally(() => {
                                this.isLoading = false;
                            });
                    } else if(this.formInfo.target === 'GROUP') {
                        return this._campaignService.searchGroups(value).finally(() => {
                            this.isLoading = false;
                        });
                    }
                })
            )
            .subscribe();
    }

    removeRecipient(recip): void {
        this.recipientTargets = this.recipientTargets.filter(recipt => recipt.phone !== recip);
    }

    removeGroup(group): void {
        this.groupTargets = this.groupTargets.filter(item => item.name !== group);
    }

    close(): any {
        this.cancel.emit();
    }

    ngOnDestroy(): void {
        this._campaignService.clearCampaignTargets();
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
}
