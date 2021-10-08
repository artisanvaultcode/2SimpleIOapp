import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Input,
    OnChanges,
    OnInit,
    SimpleChanges
} from '@angular/core';

@Component({
  selector: 'app-device-row',
  templateUrl: './device-row.component.html',
  styleUrls: ['./device-row.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeviceRowComponent implements OnInit, OnChanges {

    @Input()
    item: any;
    @Input()
    action: string;
    @Input()
    newItem: any;

    constructor( private cd: ChangeDetectorRef) { }

  ngOnInit(): void {
        this.cd.detectChanges();
        console.log(this.item);
    }

    ngOnChanges(changes: SimpleChanges): void {
        console.log(changes)
        if (changes['newItem']) {
            const newItem = changes['newItem'].currentValue;
            console.log(newItem);
            if(newItem && newItem.id === this.item.id) {
                this.item = newItem;
                this.cd.detectChanges();
            }
        }


    }

}
