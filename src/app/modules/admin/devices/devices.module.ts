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
import { MatMenuModule } from '@angular/material/menu';
import { SendMessageDialogComponent } from './components/send-message/send-message-dialog.component';
import { DeviceRegistrationDialogComponent } from './components/device-registration/device-registration-dialog..component';
import { FuseDrawerModule } from '../../../../@fuse/components/drawer';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgApexchartsModule } from 'ng-apexcharts';
import { MatCardModule } from '@angular/material/card';
import { MomentAgoEventPipe } from '../../../moment-ago-event.pipe';
@NgModule({
    declarations: [
        DevicesComponent,
        ControlComponent,
        DevicesListComponent,
        DeviceRowComponent,
        MetadatadialogComponent,
        SendMessageDialogComponent,
        DeviceRegistrationDialogComponent,
        MomentAgoEventPipe,
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
        FuseDrawerModule,
        MatDividerModule,
        MatProgressBarModule,
        MatProgressSpinnerModule,
        NgApexchartsModule,
        MatCardModule,
    ],
})
export class DevicesModule {}
