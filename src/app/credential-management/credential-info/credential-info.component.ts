import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { CredentialManagementService } from '../../services/credential-management.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'central-credential-info',
  templateUrl: './credential-info.component.html',
  styleUrls: ['./credential-info.component.scss']
})
export class CredentialInfoComponent implements OnInit {

  
  currentCredential = {
    "name" : 'Loading',
    "abbr" : 'Loading',
    "major_cred" : 'Loading',
    "parent_cred" : 'Loading',
    "created_by" : 'Loading',
    "created" : 'Loading',
    "id" : '0',
    "createdByUserName" : {
      "first_name" : 'Loading',
      "last_name" : 'Lading'
    }
  };

  current_user_id: any;
  currentChecklistItem = 'SOME ITEM'
  
  currentCheckListItems:Observable<any[]>;
  

  constructor(
    private credentialManagementService: CredentialManagementService,
    private route: ActivatedRoute,
    private cookieService: CookieService,
  ) { }

  onKey(event: any) { // without type info
    console.log(event);
    this.currentChecklistItem = event;
  }

  createCheckListItem(){
    let itemInfo = {
      'credential_id' : this.currentCredential.id,
      'text' : this.currentChecklistItem,
      'created_by' : Number(this.current_user_id),
    }
    console.log(itemInfo);
    
    this.credentialManagementService.createChecklistItem(itemInfo).subscribe((result)=>{
      console.log(result);
      window.location.reload();
    })
  }

  udpateCheckListItem(checklist_item_id, status){
    let itemInfo = {
      'credential_id' : this.currentCredential.id,
      'active' : status,
      'checklist_item_id' : checklist_item_id, 
    }
    console.log(itemInfo);
    
    this.credentialManagementService.updateChecklistItem(itemInfo).subscribe((result)=>{
      console.log(result);
      window.location.reload();
    })
  }  

  ngOnInit() {

    let credentialId = this.route.snapshot.queryParamMap.get('credentialId');
    this.current_user_id = this.cookieService.get('user_id')

    this.credentialManagementService.getCredential(credentialId).subscribe((credential) =>{
      this.currentCredential = credential;
      this.currentCheckListItems = credential.checklist_items;
      console.log(this.currentCredential);
    });    
  }

}
