import {Component, EventEmitter, Output} from '@angular/core';

@Component({
    selector: 'upload-file',
    templateUrl: './upload-file.component.html',
    styleUrls: ['./upload-file.component.scss']
})
export class UploadFileComponent  {
    @Output() _onSelect: EventEmitter<any> = new EventEmitter();
    @Output() _onReset: EventEmitter<any> = new EventEmitter();

    files: any = [];
    fileType = ['csv'];

    uploadFile(event): void {
        console.log(event)
        if(this.files.length === 0 && event.files && event.files[0]) {
            const maxSize = 20971520;
            if (event.files[0].size > maxSize) {
                return;
            }
            const element = event.files[0];
            const type = element.name.split('.').pop();
            const found = this.fileType.find(item => item === type);
            if(!found) {
                return;
            }
            const reader = new FileReader();
            reader.readAsText(event.files[0]);
            reader.onload = (e) => {
                const csvData = reader.result;
                const csvRecordsArray = (<string>csvData).split(/\r\n|\n/);
                this.files.push(element.name);
                this._onSelect.emit(csvRecordsArray);
            };
        }
    }

    deleteAttachment(index): void {
        this.files.splice(index, 1);
        this._onReset.emit();
    }
}
