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

@NgModule({
  declarations: [
      MessagesComponent,
      DetailsMessagesComponent,
      ListMessagesComponent,
      GroupsMessagesComponent  ],
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
      SharedModule
  ]
})
export class MessagesModule { }
