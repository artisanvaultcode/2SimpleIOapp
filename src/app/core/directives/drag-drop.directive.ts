import { Directive, Output, EventEmitter, HostBinding, HostListener } from '@angular/core';

@Directive({
    selector: '[appDragDrop]'
})
export class DragDropDirective {
    @Output() _onFileDropped = new EventEmitter<any>();

    @HostBinding('style.background-color') private background = '#f5fcff';
    @HostBinding('style.opacity') private opacity = '1';


    // Dragover listener
    @HostListener('dragover', ['$event'])
    public onDragOver(evt): void {
        console.log('----- DRAGOVER -----');
        evt.preventDefault();
        evt.stopPropagation();
        this.background = '#9ecbec';
        this.opacity = '0.8';
    }
    // Dragleave listener
    @HostListener('dragleave', ['$event'])
    public onDragLeave(evt): void {
        console.log('----- DRATLEAVE -----');
        evt.preventDefault();
        evt.stopPropagation();
        this.background = '#f5fcff';
        this.opacity = '1';
    }
    // Drop listener
    @HostListener('drop', ['$event'])
    public ondrop(evt): void {
        console.log('----- DROP -----');
        evt.preventDefault();
        evt.stopPropagation();
        this.background = '#f5fcff';
        this.opacity = '1';
        const files = evt.dataTransfer.files;
        if (files.length > 0) {
            this._onFileDropped.emit(files);
        }

    }

}
