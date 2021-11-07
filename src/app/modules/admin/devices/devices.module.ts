import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';

import { devicesRoute } from './devices-routing.module';
import { DevicesComponent } from './devices.component';
import { ControlComponent } from './components/control/control.component';
import { DevicesListComponent } from './components/list/devices-list.component';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { DeviceRowComponent } from './components/device-row/device-row.component';
import { MetadatadialogComponent } from './components/metadatadialog/metadatadialog.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatMenuModule} from '@angular/material/menu';
import {SendMessageDialogComponent} from './components/send-message/send-message-dialog.component';
import {DeviceRegistrationDialogComponent} from './components/device-registration/device-registration-dialog..component';


@NgModule({
  declarations: [
    DevicesComponent,
    ControlComponent,
    ControlComponent,
    DevicesListComponent,
    DeviceRowComponent,
    MetadatadialogComponent,
    SendMessageDialogComponent,
    DeviceRegistrationDialogComponent
  ],
    imports: [
        RouterModule.forChild(devicesRoute),
        SharedModule,
        MatTableModule,
        MatSidenavModule,
        MatIconModule,
        MatButtonModule,
        MatSelectModule,
        MatFormFieldModule,
        MatInputModule,
        MatMenuModule,
    ]
})
export class DevicesModule { }
