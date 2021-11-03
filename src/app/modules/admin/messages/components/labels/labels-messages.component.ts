import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Input, OnChanges,
    OnInit, Output, SimpleChanges,
    ViewEncapsulation
} from '@angular/core';
import {MsgsService} from '../../messages.service';

@Component({
    selector       : 'labels-4message',
    templateUrl    : './labels-messages.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LabelsMessagesComponent implements OnInit, OnChanges
{
    @Input() messageId: string;
    @Input() allLabels: any[];
    @Input() showRemove: boolean;
    @Output() toggleMessage: any;

    labels: any[];
    enableDelete: boolean;
    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _msgsService: MsgsService
    )
    {
        this.enableDelete = true;
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {}

    ngOnChanges(changes: SimpleChanges): void {
        const { messageId , allLabels , showRemove} = changes;
        if (messageId && messageId.currentValue) {
            this.allLabels = allLabels.currentValue;
            this._msgsService.getLabelsByMsgIdAsync(messageId.currentValue)
                .then((labelsResult) => {
                    this.labels = [];
                    labelsResult.forEach((lbl) => {
                        const found = allLabels.currentValue.find( item => item.id === lbl.groupID);
                        if (found) {
                            found['groupMsgId'] = lbl.id;
                            found['_versionGroupMsg'] = lbl._version;
                            this.labels.push(found);
                        }
                    });
                    this._changeDetectorRef.markForCheck();
                });
        }
        if (showRemove && showRemove.currentValue) {
            this.enableDelete = showRemove.currentValue;
            this._changeDetectorRef.markForCheck();
        }
    }
    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------
    toggleMessageGroup(group: any): void {
        this._msgsService.detachGroupFromMsgById(group)
            .then((resUpdate) => {
                return this._msgsService.getLabelsByMsgIdAsync(group.groupMsgId);
            }).then((labelsResult) => {
                this.labels = [];
                labelsResult.forEach((lbl) => {
                    const found = this.allLabels.find( item => item.id === lbl.groupID);
                    if (found) {
                        found['groupMsgId'] = lbl.id;
                        found['_versionGroupMsg'] = lbl._version;
                        this.labels.push(found);
                    }
                });
                this._changeDetectorRef.detectChanges();
            })
            .catch(error => console.log(error));
    }

    trackByFn(index: number, item: any): any
    {
        return item.id || index;
    }

}
