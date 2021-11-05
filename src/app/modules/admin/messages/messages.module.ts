import { NgModule } from '@angular/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {RouterModule} from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatRippleModule} from '@angular/material/core';
import {MatMenuModule} from '@angular/material/menu';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {SharedModule} from '../../../shared/shared.module';
import {MatDialogModule} from '@angular/material/dialog';
import {FuseMasonryModule} from '../../../../@fuse/components/masonry';
import {MatButtonModule} from '@angular/material/button';
import {FuseAutogrowModule} from '../../../../@fuse/directives/autogrow';
import {msgsRoutes} from './messages.routing';
import {DetailsMessagesComponent} from './components/details/details-messages.component';
import {MessagesComponent} from './messages.component';
import {ListMessagesComponent} from './components/list/list-messages.component';
import {GroupsMessagesComponent} from './components/groups/groups-messages.component';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {LabelsMessagesComponent} from './components/labels/labels-messages.component';
import {DetailsMessagesPanelComponent} from './components/details-panel/details-messages-panel.component';
import {FuseDrawerModule} from '../../../../@fuse/components/drawer';
import {MatDividerModule} from '@angular/material/divider';
import {FuseFindByKeyPipeModule} from '../../../../@fuse/pipes/find-by-key';
import {DragDropModule} from "@angular/cdk/drag-drop";
import {MatSortModule} from "@angular/material/sort";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";

@NgModule({
  declarations: [
      MessagesComponent,
      DetailsMessagesComponent,
      ListMessagesComponent,
      GroupsMessagesComponent,
      LabelsMessagesComponent,
      DetailsMessagesPanelComponent
  ],
    imports: [
        RouterModule.forChild(msgsRoutes),
        MatButtonModule,
        MatCheckboxModule,
        MatDialogModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatMenuModule,
        MatRippleModule,
        MatSidenavModule,
        FuseAutogrowModule,
        FuseMasonryModule,
        SharedModule,
        MatProgressBarModule,
        FuseDrawerModule,
        MatDividerModule,
        FuseFindByKeyPipeModule,
        DragDropModule,
        MatSortModule,
        MatProgressSpinnerModule,
    ]
})
export class MessagesModule { }
