import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IProduct } from 'src/app/shared/models/product';
import { BreadcrumbService } from 'xng-breadcrumb';
import { ShopService } from '../shop.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {
  productt: IProduct;

                                                                        //gets acces to the route parameter/ get the route that we are activating
  constructor(private shopService: ShopService, private activatedRoute : ActivatedRoute,
    private bcService: BreadcrumbService) {
      this.bcService.set('@productDetails', ' ');
     }

  ngOnInit(): void {
    this.loadProduct();
  }

  loadProduct() {
                                //gets the id from the activated route(URL) id 
    this.shopService.getProduct(+this.activatedRoute.snapshot.paramMap.get('id')).subscribe(product => {
   //this.productt    //product, from the API
      this.productt = product;
      this.bcService.set('@productDetails', product.name)
    }, error =>{
      console.log(error);
    });
  }

}
