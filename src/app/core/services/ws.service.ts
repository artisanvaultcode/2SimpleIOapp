import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import Pusher from 'pusher-js';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserService } from '../user/user.service';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  pusher: any;
  channel: any;
  baseURL = environment.backendurl;
  httpOptions = {
    headers: new HttpHeaders({
        'Access-Control-Allow-Origin': '*'
    })
  }
  constructor(
    private _http: HttpClient,
    private _userService: UserService,
    private _authService: AuthService
  ) {
    this.pusher = new Pusher(environment.pusher.key, {
      cluster: 'mt1'
    });
    this.channel = this.pusher.subscribe('sync-sms');
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  subScribeToChannel(events: String[], cb: Function) {
    const channel = this.pusher.subscribe('sync-sms');
    events.forEach( event => {
      channel.bind(event, function(data) {
        const { message } = data;
        cb(message);
      });
    });
  }

  sendCommandToDeviceChannel(command?: string) {
    const payload = {
        event: (command ? command : 'deviceInfo')
    }
    const sendMsg = this.channel.trigger("client-events", {
        message: payload
      })
    console.log(sendMsg)
  }

  /**
   * Set status ACTIVE in all recipients
   * @returns
   */
  activateRecip(statdata, clientid){
    var formData = new FormData();
    formData.append('status', statdata);
    formData.append('clientId', clientid);
    return this._http.post(this.baseURL+'/setstatus', formData, this.httpOptions);
  }

  cronMsg(sendbool, clientid){
    var formData = new FormData();
    formData.append('clientId', clientid);
    if (sendbool) formData.append('enable', 'yes');
    else formData.append('enable', 'no');
    return this._http.post(this.baseURL+'/cronmsg', formData, this.httpOptions);
  }

}
