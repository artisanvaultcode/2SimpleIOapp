import { Route } from '@angular/router';
import { DevicesComponent } from './devices.component';
import { DevicesResolver } from './devices.resolvers';
import { DevicesListComponent } from './components/list/devices-list.component';

export const devicesRoute: Route[] = [
  {
    path        : '',
    component   : DevicesComponent,
    children: [
      {
        path: '',
        component: DevicesListComponent,
        resolve  : {
          tasks    : DevicesResolver,
        }
      }
    ]
  }
];
