import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray, NgForm } from '@angular/forms'
import { ToastConfig, Toaster, ToastType } from "ngx-toast-notifications";
import { MemberManagementServiceService } from '../../services/member-management-service.service';
import { Md5 } from 'ts-md5';
import { Observable } from 'rxjs';

@Component({
  selector: 'central-new-member',
  templateUrl: './new-member.component.html',
  styleUrls: ['./new-member.component.scss']
})
export class NewMemberComponent implements OnInit {
  permissions: Observable<any[]>;

  profileForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: [''],
    email : [''],
    password : [''], 
    dob : [''],
    phone : [''],
    address: this.fb.group({
      street: [''],
      city: [''],
      state: [''],
      zip: ['']
    }),
  });

  get aliases() {
    return this.profileForm.get('aliases') as FormArray;
  }

  constructor(
    private fb: FormBuilder,
    private toaster: Toaster,
    private router: Router,
    private memberManageService: MemberManagementServiceService,
  ) { }


  updateProfile() {
    this.profileForm.patchValue({
      firstName: 'Nancy',
      address: {
        street: '123 Drew Street'
      }
    });
  }

  addAlias() {
    this.aliases.push(this.fb.control(''));
  }

  removeAlias(rowIndex:number){
    this.aliases.removeAt(rowIndex);
  }  

  onSubmit() {
    // TODO: Use EventEmitter with form value
    let formValue = this.profileForm.value
    console.log(formValue);
    let userInfo = {
      "first_name" : formValue['firstName'],
      "last_name" : formValue['lastName'],
      "password" : Md5.hashStr(formValue['password']),
      "email" : formValue['email'],
      "dob" : formValue['dob'],      
      "phone" : formValue['phone']	      
    }
    this.memberManageService.createUser(userInfo).subscribe(
      (result) =>{
        console.log(result);
        this.showToast(result['msg'])
        this.router.navigate(['/member-management']);
        
      })
  }

  showToast(message) {
    const type = 'success';
    this.toaster.open({
      position: 'top-center',
      text: message,
      caption: type + ' notification',
      type: type,
    });
  }  

  ngOnInit(){
    this.memberManageService.getPermissions().subscribe((permissions) => {
      this.permissions = permissions;
      console.log(this.permissions);
      
    })
  }

}
