import { Injectable } from '@angular/core';

import { Observable } from "rxjs/Rx";
import { Config } from "../config";
import {
    getBoolean,
    setBoolean,
    getNumber,
    setNumber,
    getString,
    setString,
    hasKey,
    remove,
    clear
} from "application-settings";


@Injectable()
export class StatusService {

    offlineMode :boolean; 
    currentUser :string;    //noch string, TODO: user Interface anlegen

  constructor() {}

  setOfflineMode(isOffline :boolean){
      setBoolean("offlineMode", isOffline);
      this.offlineMode = isOffline;
  }
  getOfflineMode(){
      return getBoolean("offlineMode");
  }

  loggedIn(){
      setBoolean("wasLoggedIn", true)
  }

  getWasLoggedIn(){
      if(getBoolean("wasLoggedIn")) {
          return true;
      }else{
          return false;
      }
  }

}
