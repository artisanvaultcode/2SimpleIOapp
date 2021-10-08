import {ChangeDetectionStrategy, Component, ViewEncapsulation} from '@angular/core';

@Component({
    selector     : 'recipients',
    templateUrl  : './recipients.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecipientsComponent
{
    /**
     * Constructor
     */
    constructor()
    {
    }
}
