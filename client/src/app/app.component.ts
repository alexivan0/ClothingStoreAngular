import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { IPagination } from './models/pagination';
import { IProduct } from './models/product';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Shopping Store';
  products: IProduct[];

  // inject the http client in the parent class("AppComponent") so it can be used by all the child classes
  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    //this = acces something available in this class.
    this.http.get('https://localhost:5001/api/products?pageSize=50').subscribe(
      (response: IPagination) => {
        this.products = response.data;
      }, error => {
        console.log(error);
      });
  }
}