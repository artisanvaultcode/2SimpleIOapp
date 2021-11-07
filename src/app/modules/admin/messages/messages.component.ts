import {ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation} from '@angular/core';

@Component({
    selector: 'app-messages',
    templateUrl: './messages.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MessagesComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {}

}
