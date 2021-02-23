//Copyright (c)2020-2021 Philip Rice. <br />Permission is hereby granted, free of charge, to any person obtaining a copyof this software and associated documentation files (the Software), to dealin the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:  <br />The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED AS
import {Lens, Lenses} from "@focuson/lens";
import {LensState} from "@focuson/state";


export let toInventoryProductsL: Lens<AppData, ProductData[]> = Lenses.build<AppData>('app').focusOn('inventory').focusOn('products')
export let toCartsProductL: Lens<AppData, ProductData[]> = Lenses.build<AppData>('app').focusOn('cart').focusOn('products')


function findIndexMatching<T>(fn: (t: T) => Boolean, msg: string): (ts: T[]) => number {
    return ts => {
        let index = ts.findIndex(fn)
        if (index < 0) throw Error(msg)
        return index
    }
}

function addItemToList(list: ProductData[], productData: ProductData): ProductData[] {
    let index = list.findIndex(pd => pd.id == productData.id)
    if (index < 0) return [...list, {...productData, quantity: 1}]
    let newList = [...list]
    newList[index].quantity += 1
    return newList
}

function removeItemFromList(list: ProductData[], index: number): ProductData[] {
    let newList = [...list]
    newList[index].quantity -= 1
    if (newList[index].quantity > 0)
        return newList;
    newList.splice(index,1)
    return newList
}

export function removeFromContextAddToList<Main>(context: LensState<Main, ProductData[]>, toAddLens: Lens<Main, ProductData[]>, index: number) {
    let listThatWillHaveItemRemoved = context.json();
    let item = listThatWillHaveItemRemoved[index]
    let newToremoveList = removeItemFromList(listThatWillHaveItemRemoved, index)
    let newToAddList = addItemToList(toAddLens.get(context.main), item)
    context.useOtherLensAsWell(toAddLens).setTwoValues(newToremoveList, newToAddList)
}

export interface AppData {
    cart: CartData,
    inventory: InventoryData
}
export interface InventoryData {
    products: ProductData[]
}

export interface CartData {
    total: string,
    products: ProductData[],
}

export interface ProductData {
    id: number,
    price: number,
    title: string,
    quantity: number
}



