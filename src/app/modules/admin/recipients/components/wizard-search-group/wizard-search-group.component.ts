import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap, takeUntil } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { Group } from '../../../../../API.service';
import { RecipientsService } from '../../recipients.service';

@Component({
    selector: 'app-wizard-search-group',
    templateUrl: './wizard-search-group.component.html',
    styleUrls: ['./wizard-search-group.component.scss']
})
export class WizardSearchGroupComponent implements OnInit, OnDestroy{

    @Output() cancel = new EventEmitter<any>();

    labels$: Observable<any[]>;
    groupTargets: Group[] = [];
    isLoading = false;
    groupTarget: any = '';
    formTarget = new FormControl();
    selectedTarget: any = '';

    private _unsubscribeAll = new Subject<void>();

    constructor(
        private _recipientsService: RecipientsService
    ) {
    }

    ngOnDestroy(): void {
    }

    ngOnInit(): void {
        this.labels$ = this._recipientsService.groups$;

        this.formTarget.valueChanges
            .pipe(
                takeUntil(this._unsubscribeAll),
                distinctUntilChanged(),
                debounceTime(500),
                switchMap((value: any) => {
                    return this._recipientsService.searchGroups(value)
                        .finally(() => {
                            this.isLoading = false;
                        });
                })
            )
            .subscribe();
    }

    onGroupSelected(): void {
        this.groupTarget = this.formTarget.value;
        const target = this.groupTargets.find(item => this.groupTarget.id === item.id);
        if(!target && this.groupTargets.length === 0) {
            this.groupTargets.unshift(this.groupTarget);
        }
    }

    groupDisplayWith(value: any): any {
        return value?.name;
    }

    clearSelection(): void {
        this.selectedTarget = '';
        this.formTarget.reset();
    }

    removeGroup(group): void {
        this.groupTargets = this.groupTargets.filter(item => item.name !== group);
    }

    close(): any {
        this.cancel.emit();
    }
}
