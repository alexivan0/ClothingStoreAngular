import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Basket, IBasket, IBasketItem, IBasketTotals } from '../shared/models/basket';
import { IDeliveryMethod } from '../shared/models/deliveryMethod';
import { IProduct } from '../shared/models/product';

@Injectable({
  providedIn: 'root'
})
export class BasketService {
  baseUrl = environment.apiUrl;
  //initializes 'basketSourc' with an initial value, than can get received when subscribing
  private basketSource = new BehaviorSubject<IBasket>(null);
  // get the information from the private method and store it in 'basket$'
  basket$ = this.basketSource.asObservable();
  private basketTotalSource = new BehaviorSubject<IBasketTotals>(null);
  basketTotal$ = this.basketTotalSource.asObservable();
  shipping = 0;

  constructor(private  http: HttpClient) { }

  setShippingPrice(deliveryMethod: IDeliveryMethod) {
    this.shipping = deliveryMethod.price;
    this.calculateTotals();
  }

  getBasket(id : string) {
    //the response from the httpclient that contains the basket
    return this.http.get(this.baseUrl + 'basket?id=' + id)
    //set basketSource with the basket we get back from the api
      .pipe(
        map((basket: IBasket) =>{
          this.basketSource
          //set the BehaviorSubject next property/value to the 'basket' variable
          .next(basket);
          // nothing happens yet, until we subscribe to the observable we get back from the http client
          // will use the async pipe in the components that connects to this observable(basket$)
          this.calculateTotals();
        })
      );
  }

  setBasket(basket: IBasket) {
    // update the BehaviorSubject(basketSource) with the new value of the basket that we have
    return this.http.post(this.baseUrl + 'basket', basket).subscribe((response: IBasket) => {
      this.basketSource.next(response);
      this.calculateTotals()
    }, error => {console.log(error);
    });
  }

  //get the value of the basket without needing to subscribe to it
  getCurrentBasketValue() {
    return this.basketSource.value;
  }

  addItemToBasket(item: IProduct, quantity = 1) {
    const itemtoAdd: IBasketItem = this.mapProductItemToBasketItem(item, quantity);
    const basket = this.getCurrentBasketValue() ?? this.createBasket();
    basket.items = this.addOrUpdateItem(basket.items, itemtoAdd, quantity);
    this.setBasket(basket);
  }

  incrementItemQuantity(item: IBasketItem) {
    const basket = this.getCurrentBasketValue();
    const foundItemIndex = basket.items.findIndex(x => x.id === item.id);
    basket.items[foundItemIndex].quantity++;
    this.setBasket(basket);
  }

  decrementItemQuantity(item: IBasketItem) {
    const basket = this.getCurrentBasketValue();
    const foundItemIndex = basket.items.findIndex(x => x.id === item.id);
    if (basket.items[foundItemIndex].quantity > 1){
      basket.items[foundItemIndex].quantity--;
      this.setBasket(basket);
    }
    else {
      this.removeItemFromBasket(item);
    }
  }


  removeItemFromBasket(item: IBasketItem) {
    const basket = this.getCurrentBasketValue();
    if (basket.items.some(x => x.id === item.id)) {
      //return all the items except the one that matches the id
      basket.items = basket.items.filter(i => i.id !== item.id);
      if (basket.items.length > 0){
        this.setBasket(basket);
      }
      else {
        this.deleteBasket(basket);
      }
    }
  }

  deleteLocalBasket(id: string) {
    this.basketSource.next(null);
    this.basketTotalSource.next(null);
    localStorage.removeItem('basket_id');
  }

  deleteBasket(basket: IBasket) {
    //delete from the API
    return this.http.delete(this.baseUrl + 'basket?id=' + basket.id)
    //remove from browser local storage
    .subscribe(() =>{
      this.basketSource.next(null);
      this.basketSource.next(null);
      localStorage.removeItem('basket_id');
    }, error => {
      console.log(error);
    });
  }

  private calculateTotals() {
    const basket = this.getCurrentBasketValue();
    const shipping = this.shipping;
    const subtotal = basket.items.reduce((a, b) => (b.price * b.quantity) + a, 0);
    const total = subtotal + shipping;
    this.basketTotalSource.next({shipping, total, subtotal})
  }

  private addOrUpdateItem(items: IBasketItem[], itemtoAdd: IBasketItem, quantity: number): IBasketItem[] {
    const index = items.findIndex(i => i.id == itemtoAdd.id);
    //if item not found in the basket already
    if (index == -1) {
      itemtoAdd.quantity = quantity;
      items.push(itemtoAdd);
    }
    //if the item is already in the basket, update the quantity
    else {
      items[index].quantity += quantity;
    }
    return items;
  }

  private createBasket(): IBasket {
    const basket = new Basket();
    // persist the basket id in the local storage(on the browser)
    localStorage.setItem('basket_id', basket.id);
    return basket;
   }

  private mapProductItemToBasketItem(item: IProduct, quantity: number): IBasketItem {
    return {
      id: item.id,
      productName: item.name,
      price: item.price,
      pictureUrl: item.pictureUrl,
      quantity,
      brand: item.productBrand,
      type: item.productType
    };
  }
}
