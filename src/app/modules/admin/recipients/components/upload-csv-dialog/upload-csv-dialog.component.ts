import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';

@Component({
  selector: 'upload-csv-dialog',
  templateUrl: './upload-csv-dialog.component.html'
})
export class UploadCsvDialogComponent implements OnInit {

    @Output() cancel = new EventEmitter<any>();

    recList: any = [];
    filesName: any = [];

    constructor(
        @Inject(MAT_BOTTOM_SHEET_DATA) public data: any
    ) { }

    ngOnInit(): void {}

    _onSelect($event: any): void {
        if (Array.isArray($event.csvArray)) {
            this.recList = $event.csvArray;
            this.filesName = $event.filesName;
        } else {
            this._onReset();
        }
    }

    _onReset(): void {
        this.recList = [];
    }

    _onCancel(): void {
        this._onReset();
        this.cancel.emit('');
    }

}
