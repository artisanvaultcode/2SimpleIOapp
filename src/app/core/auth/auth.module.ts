import {ModuleWithProviders, NgModule} from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthService } from 'app/core/auth/auth.service';
import { AuthInterceptor } from 'app/core/auth/auth.interceptor';
import {APP_OPTIONS} from '../../app.options';

@NgModule({
    imports  : [
        HttpClientModule
    ],
    providers: [
        AuthService,
        {
            provide : HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi   : true
        }
    ]
})
export class AuthModule
{
    static forRoot(config?: any): ModuleWithProviders<AuthModule>
    {
        return {
            ngModule : AuthModule,
            providers: [
                {
                    provide : APP_OPTIONS,
                    useValue: config
                }
            ]
        };
    }
}
