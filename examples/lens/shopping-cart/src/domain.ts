import {Lens, LensContext, LensProps, takeFromItemsAndAddToMain} from "@phil-rice/lens";


let inventoryItemQuantityLens: Lens<InventoryItemData, number> = Lens.build<InventoryItemData>('inventoryData').then('inventory')
let productDataQuantityLens: Lens<ProductData, number> = Lens.build<ProductData>('productData').then('quantity')

export class ShoppingCartDomain {
    onCheckoutClicked: () => void
    constructor(onCheckoutClicked: () => void) {this.onCheckoutClicked = onCheckoutClicked;}

    toInventoryProductsL: Lens<AppData, InventoryItemData[]> = Lens.build<AppData>('app').then('inventory').then('products')
    toCartsProductL: Lens<AppData, ProductData[]> = Lens.build<AppData>('app').then('cart').then('products')

    takeFromCartPutInInventory = takeFromItemsAndAddToMain<InventoryItemData, ProductData>(inventoryItemQuantityLens, productDataQuantityLens,
        (m, t) => m.title == t.title,
        pd => ({...pd, inventory: 1}))
    takeFromInventoryPutInCart = takeFromItemsAndAddToMain<ProductData, InventoryItemData>(productDataQuantityLens, inventoryItemQuantityLens,
        (m, t) => m.title == t.title,
        pd => ({...pd, quantity: 1}))
}


export type ShoppingCartProps<T> = LensProps<ShoppingCartDomain, AppData, T>
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

