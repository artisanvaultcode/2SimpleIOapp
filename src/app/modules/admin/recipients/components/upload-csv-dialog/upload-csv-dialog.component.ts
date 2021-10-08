import {Component, Inject, OnInit} from '@angular/core';
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef} from '@angular/material/bottom-sheet';

@Component({
  selector: 'upload-csv-dialog',
  templateUrl: './upload-csv-dialog.component.html'
})
export class UploadCsvDialogComponent implements OnInit {
    recList: any = [];

    constructor(
        private _bottomSheetRef: MatBottomSheetRef<UploadCsvDialogComponent>,
        @Inject(MAT_BOTTOM_SHEET_DATA) public data: any
    ) { }

    ngOnInit(): void {}

    _onSelect($event: any[]): void {
        if (Array.isArray($event)) {
            this.recList = $event;
        } else {
            this._onReset();
        }
    }

    _onReset(): void {
        this.recList = [];
    }

    _onCancel(): void {
        this._onReset();
        this._bottomSheetRef.dismiss(null);
    }

    import(): void {
        if (this.recList.length === 0) {
            this._onReset();
            return;
        }
        const target = this.data.fileTarget;
        this._bottomSheetRef.dismiss({
            items : this.recList
        } );
    }

}
