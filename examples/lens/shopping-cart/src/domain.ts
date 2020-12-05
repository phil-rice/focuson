import {Lens, LensContext, LensProps} from "@phil-rice/lens";


export class ItemsAndIndex<T> {
    static makeLens<T>(n: number): Lens<T[], ItemsAndIndex<T>> { return new Lens<T[], ItemsAndIndex<T>>(l => new ItemsAndIndex<T>(l, n), (l, i) => i.items)}
    static makeContext<Domain, Main, T>(context: LensContext<Domain, Main, T[]>, n: number): LensContext<Domain, Main, ItemsAndIndex<T>> {return context.withChildLens(this.makeLens(n))}
    items: T[]
    index: number
    item() {return this.items[this.index]}

    constructor(items: T[], index: number) {
        this.items = items;
        this.index = index;
    }
    removeItem(): ItemsAndIndex<T> {
        let result = [...this.items]
        result.splice(this.index, 1)
        return new ItemsAndIndex<T>(result, -1)
    }
    mapItem(fn: (t: T) => T) {
        let result = [...this.items]
        result[this.index] = fn(this.item())
        return new ItemsAndIndex(result, this.index)
    }
}


export class ShoppingCartDomain {
    onCheckoutClicked: () => void
    constructor(onCheckoutClicked: () => void) {this.onCheckoutClicked = onCheckoutClicked;}

    toInventoryProductsL: Lens<AppData, ProductData[]> = Lens.build<AppData>('app').then('inventory').then('products')
    toCartsProductL: Lens<AppData, ProductData[]> = Lens.build<AppData>('app').then('cart').then('products')
    takeFromItemsAndAddToMain(two: TwoListData): TwoListData {
        let items = two.items;
        let mainIndex = two.main.findIndex(m => m.title === items.item().title)
        let newMain: ProductData = mainIndex < 0 ? productDataQuantityLens.transform(q => 1)(items.item()) : productDataQuantityLens.transform(q => q + 1)(two.main[mainIndex])
        let newItemList = items.item().quantity < 2 ? items.removeItem() : items.mapItem(productDataQuantityLens.transform(q => q - 1))
        let newMainList: ProductData[] = upsertItem(two.main, mainIndex, newMain)
        return new TwoListData(newMainList, newItemList)
    }
}


export type ShoppingCartProps<T> = LensProps<ShoppingCartDomain, AppData, T>
export type ShoppingCartContext<T> = LensContext<ShoppingCartDomain, AppData, T>

export class TwoListData {
    main: ProductData[] // the list that will get the new item
    items: ItemsAndIndex<ProductData> //the list that contains the item which will be removed, and the index of the item to be removed
    item() {return this.items.item()}
    constructor(main: ProductData[], items: ItemsAndIndex<ProductData>) {
        this.main = main;
        this.items = items;
    }

    static makeLens(mainL: Lens<AppData, ProductData[]>, itemL: Lens<AppData, ItemsAndIndex<ProductData>>): Lens<AppData, TwoListData> {
        let getter = (a: AppData) => new TwoListData(mainL.get(a), itemL.get(a))
        let setter = (a: AppData, twoListData: TwoListData) => (mainL.set(itemL.set(a, twoListData.items), twoListData.main))
        return new Lens(getter, setter)
    }

}


let productDataQuantityLens: Lens<ProductData, number> = Lens.build<ProductData>('productData').then('quantity')
function productDataListQuantityLens(n: number): Lens<ProductData[], number> { return Lens.nth<ProductData>(n).andThen(productDataQuantityLens)}

function upsertItem<T>(list: T[], index: number, item: T) {
    if (index < 0) return [...list, item]
    else {
        let newList = [...list]
        newList[index] = item
        return newList
    }
}


export interface AppData {
    cart: CartData,
    inventory: InventoryData
}

export interface CartData {
    total: string,
    products: ProductData[],
}

export interface ProductData {
    id: number,
    price: number,
    quantity: number,
    title: string
}

export interface InventoryData {
    products: ProductData[]
}


