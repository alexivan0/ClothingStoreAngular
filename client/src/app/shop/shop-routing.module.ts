import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ShopComponent } from './shop.component';
import { ProductDetailsComponent } from './product-details/product-details.component';

const routes: Routes = [
  {path: '', component: ShopComponent},
  {path:':id', component: ProductDetailsComponent},
];

@NgModule({
  declarations: [],
  imports: [
                //route only available in this module(shop module) but not in the app module(forRoot) = lazy loading
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class ShopRoutingModule { }
