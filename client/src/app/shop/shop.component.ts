import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IBrand } from '../shared/models/brands';
import { IProduct } from '../shared/models/product';
import { IType } from '../shared/models/productType';
import { ShopParams } from '../shared/models/shopParams';
import { ShopService } from './shop.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit {
  @ViewChild('search', {static:true}) searchTerm : ElementRef;
  products: IProduct[];
  brands: IBrand[];
  types: IType[];
  shopParams = new ShopParams()
  totalCount: number;
  sortOptions = [
    {name: 'Alphabetical', value: 'name'},
    // value = API URL request parameter
    {name: 'Price: Low to High', value: 'priceAsc'},
    {name: 'Price: High to Low', value: 'priceDesc'}
  ];
  constructor(private shopService: ShopService) {}

  ngOnInit(): void {
   this.getProducts();
   this.getBrands();
   this.getTypes();
  }

  getProducts() {
    this.shopService.getProducts(this.shopParams).subscribe(response =>{
      this.products = response.data;
      this.shopParams.pageNumber = response.pageIndex;
      this.shopParams.pageSize = response.pageSize;
      this.totalCount = response.count;
    }, error =>{
      console.log(error);
    });
  }

  getBrands() {2
    this.shopService.getBrands().subscribe(response =>{
      // adds "All" to the beggining of the 'response' array
      this.brands = [{id: 0, name: 'All'}, ...response];
    }, error =>{
      console.log(error);
    });
  }

  getTypes() {
    this.shopService.getTypes().subscribe(response =>{
      this.types = [{id: 0, name: 'All'}, ...response]
    }, error =>{
      console.log(error);
    });
  }

  onBrandSelected(brandId: number) {
    this.shopParams.brandId= brandId;
    this.shopParams.pageNumber = 1;
    this.getProducts();
  }

  onTypeSelected(typeId: number) {
    this.shopParams.typeId= typeId;
    this.shopParams.pageNumber = 1;
    this.getProducts();
  }

  onSortSelected(sort: string) {
    this.shopParams.sort = sort;
    this.getProducts();
  }

  //event is passed to this method from the pagination component
  onPageChanged(event: any) {
    if (this.shopParams.pageNumber !== event){
      this.shopParams.pageNumber = event;
      //adds the product to the page after the page has been changed
      this.getProducts();
    }
  }
    

  onSearch(){
    this.shopParams.search = this.searchTerm.nativeElement.value;
    this.shopParams.pageNumber = 1;
    this.getProducts();
  }

  onReset() {
    this.searchTerm.nativeElement.value = '';
    this.shopParams = new ShopParams();
    this.getProducts();
  }
}
