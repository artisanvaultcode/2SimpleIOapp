import { Injectable } from '@angular/core';
import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { MsgsService } from './messages.service';

@Injectable({
  providedIn: 'root'
})
export class MessagesResolver implements Resolve<boolean> {

  constructor(
    private _msgService: MsgsService,
  ) {}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
    return new Promise((resolve, reject) => {
      Promise.all([
        this._msgService.getMessages(),
        this._msgService.getLabels(),
      ]).then(() => {
        resolve(true);
      },
        reject
        );
    });
  }
}
