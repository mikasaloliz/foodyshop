import { Component,ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams,Nav } from 'ionic-angular';
import { AngularFireAuth} from'angularfire2/auth';
import { from } from 'rxjs/observable/from';
import { HomePage } from '../home/home';
import { Http, Headers, RequestOptions } from "@angular/http";
import { FCM } from '@ionic-native/fcm';

import { AngularFireDatabase} from 'angularfire2/database';
import * as firebase from 'firebase';
import { LoadingController } from 'ionic-angular';
import { Order2Page } from '../order2/order2';

/**
 * Generated class for the RealhomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-realhome1',
  templateUrl: 'realhome1.html',
})
export class Realhome1Page { 
  @ViewChild(Nav) nav:Nav; 
  test:any;
  test1:any;
  a=1;
  b=1;
  items:any;
  username:any;
  khach:any;
  diachi:any;
  constructor(public fbd:AngularFireDatabase,private fcm1: FCM,private auth:AngularFireAuth,public navCtrl: NavController, public navParams: NavParams,private http: Http,public loading: LoadingController) {
  }
logout(){
  this.auth.auth.signOut();
}
  ionViewDidLoad() {
    this.username=this.navParams.get('username');
    this.auth.auth.onAuthStateChanged(user=> {
      
      if (!user) {
  
        this.navCtrl.push(HomePage);
      } else {
        

      console.log(user);
      }
   

   });
    this.auth.authState.subscribe(data=>{
      this.test=data.uid;
     // this.test1=this.fcm1.getToken();
     this.fcm1.getToken().then(token=>{this.test1=token
    
      firebase.database().ref('/path').child(this.test).child('token').set(this.test1);
    })
    });
  
   this.fcm1.onNotification().subscribe(data => {
      alert("co ngoui dat hang");
      console.log(data);
    });
   // this.fbd.list("/test").update("test");
    //firebase.database().ref('/path').child(this.test).child('token').set(this.fcm1.getToken().then(token=>{this.test1=token}));
   // firebase.database().ref('/path').child(this.test).set('test');
   
  }
  openoder2(item)
  {

    this.username = this.navParams.get('username');
    let data={
      username:this.username,
      khach:item.khach,
      diachi:item.diachi,
      res_id:item.res_id,
      status:item.status,
      id:item.id,
      customer_id:item.customer_id
    };
    this.navCtrl.push(Order2Page,data);
  }
  ionViewDidEnter(){
    this.username = this.navParams.get('username');
    var headers = new Headers();
    headers.append("Accept", 'application/json');
    headers.append('Content-Type', 'application/json');
    let options = new RequestOptions({
      headers: headers
    });

    let data = {
      username: this.username
    };

    let loader = this.loading.create({
      content: 'Processing please wait...',
    });

    loader.present().then(() => {
      this.http.post('http://hoctiengviet.net/food_order/ionicphp/fetch_order3.php', data, options)
        .map(res => res.json())
        .subscribe(res => {

          loader.dismiss()
          this.items = res.server_response;

          console.log(this.items);
        });
    });
  }
  ngOnInit() {
    
  }


}
