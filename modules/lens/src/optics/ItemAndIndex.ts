//Copyright (c)2020-2021 Philip Rice. <br />Permission is hereby granted, free of charge, to any person obtaining a copyof this software and associated documentation files (the Software), to dealin the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:  <br />The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED AS
import {Lens} from "./Lens";
import {LensContext} from "./LensContext";


export class ItemsAndIndex<T> {
    static makeLens<T>(n: number): Lens<T[], ItemsAndIndex<T>> { return new Lens<T[], ItemsAndIndex<T>>(l => new ItemsAndIndex<T>(l, n), (l, i) => i.items)}
    static makeContext<Domain, Main, T>(context: LensContext<Main, T[]>, n: number): LensContext<Main, ItemsAndIndex<T>> {return context.chainLens(this.makeLens(n))}
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
    decrementQuantityRemoveIfZero(quantityL: Lens<T, number>) {
        let item = this.item()
        let quantity = quantityL.get(item)
        return quantity < 2 ? this.removeItem() : this.mapItem(quantityL.transform(q => q - 1))

    }
    mapItem(fn: (t: T) => T) {
        let result = [...this.items]
        result[this.index] = fn(this.item())
        return new ItemsAndIndex(result, this.index)
    }
}
