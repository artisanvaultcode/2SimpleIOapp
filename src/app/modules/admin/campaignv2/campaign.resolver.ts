import { Injectable } from '@angular/core';
import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { CampaignService } from './campaign.service';

@Injectable({
  providedIn: 'root'
})
export class CampaignResolver implements Resolve<boolean> {

  constructor(
    private _campaignService: CampaignService,
  ) {}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
    return new Promise((resolve, reject) => {
      Promise.all([
        this._campaignService.getCampaigns()
      ]).then(() => {
        resolve(true);
      },
        reject
        );
    });
  }
}
