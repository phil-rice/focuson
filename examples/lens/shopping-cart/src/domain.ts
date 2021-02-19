//Copyright (c)2020-2021 Philip Rice. <br />Permission is hereby granted, free of charge, to any person obtaining a copyof this software and associated documentation files (the Software), to dealin the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:  <br />The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED AS
import {Lens, LensContext, LensProps, takeFromItemsAndAddToMain} from "@phil-rice/lens";
import {ItemsAndIndex} from "@phil-rice/lens";


export let toInventoryProductsL: Lens<AppData, InventoryItemData[]> = Lens.build<AppData>('app').focusOn('inventory').focusOn('products')
export let toCartsProductL: Lens<AppData, ProductData[]> = Lens.build<AppData>('app').focusOn('cart').focusOn('products')
export let inventoryItemQuantityLens: Lens<InventoryItemData, number> = Lens.build<InventoryItemData>('inventoryData').focusOn('inventory')
export let productDataQuantityLens: Lens<ProductData, number> = Lens.build<ProductData>('productData').focusOn('quantity')

export class ShoppingCartDomain {
    onCheckoutClicked: () => void
    constructor(onCheckoutClicked: () => void) {this.onCheckoutClicked = onCheckoutClicked;}


    takeFromCartPutInInventory(c: ShoppingCartContext<ItemsAndIndex<ProductData>>) {
        return c.asTuple2(toInventoryProductsL).transform(takeFromItemsAndAddToMain<InventoryItemData, ProductData>(
            inventoryItemQuantityLens, productDataQuantityLens,
            (m, t) => m.title == t.title,
            pd => ({...pd, inventory: 1})))
    }

    takeFromInventoryPutInCart(c: ShoppingCartContext<ItemsAndIndex<InventoryItemData>>) {
        return c.asTuple2(toCartsProductL).transform(takeFromItemsAndAddToMain<ProductData, InventoryItemData>(
            productDataQuantityLens, inventoryItemQuantityLens,
            (m, t) => m.title == t.title,
            pd => ({...pd, quantity: 1})))
    }
}


export type CartProps<T> = LensProps<ShoppingCartDomain, AppData, T>
export type ShoppingCartContext<T> = LensContext<ShoppingCartDomain, AppData, T>


export interface AppData {
    cart: CartData,
    inventory: InventoryData
}
export interface InventoryData {
    products: InventoryItemData[]
}

export interface CartData {
    total: string,
    products: ProductData[],
}
export interface BasicProductData {
    id: number,
    price: number,
    title: string
}

export interface ProductData extends BasicProductData {
    quantity: number
}

export interface InventoryItemData extends BasicProductData {
    inventory: number
}


