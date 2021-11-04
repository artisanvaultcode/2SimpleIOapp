import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';

import { enterprisebiRoutes } from './enterprisebi.routing';
import { EnterprisebiComponent } from './enterprisebi.component';


@NgModule({
  declarations: [
    EnterprisebiComponent
  ],
  imports: [
    RouterModule.forChild(enterprisebiRoutes),
    SharedModule,
  ]
})
export class EnterprisebiModule { }
