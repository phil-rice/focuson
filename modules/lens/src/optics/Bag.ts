//Copyright (c)2020-2021 Philip Rice. <br />Permission is hereby granted, free of charge, to any person obtaining a copyof this software and associated documentation files (the Software), to dealin the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:  <br />The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED AS
/** Tthe items are modeling a bag (a set with a count of how many things in that set item)
 * find is how we find the bag item: looking for an item that matches
 * If we find an item that matches we add the quantities to the original
 * If we don't we append the item
 */
import {Lens, Lenses} from "./Lens";
import {Tuple2} from "../utils";
import {ItemsAndIndex} from "./ItemAndIndex";


/** A bag is like set with a count for each item in the set.
 *  BagType is the list of 'items in the bag
 *  AddingType is a different (but similar) type
 *  Both AddingType and BagType have the idea of quantity, and we can find a BagType from an AddingType
 *
 *  Example: BagType is a ShoppingCartItem, AddingType is the type we want to add to the Shopping Cart.
 *     Note that if you are always adding one item you can use Lens.constant(1) for the quantityL2
 *
 * @param quantityL1
 * @param quantityL2
 * @param match
 * @param copyItemToMain
 */
export function addItemToBag<BagType, AddingType>(quantityL1: Lens<BagType, number>, quantityL2: Lens<AddingType, number>, match: (t1: BagType, t2: AddingType) => boolean, copyItemToMain: (t2: AddingType) => BagType): (list: BagType[], item: AddingType) => BagType[] {
    return (list, item) => {
        let index = list.findIndex(t => match(t, item))
        let itemQuantity = quantityL2.get(item);
        return index < 0 ? [...list, copyItemToMain(item)] : Lenses.nth <BagType>(index).chainWith(quantityL1).transform(q => q + itemQuantity)(list)
    }
}

/** This is where we take from the 'addingtype' and put in the 'bagtypes
 *
 * This takes an item from a bag and  places it in another bag.
 * The bags have different types, but we know how to transfrom from the item being removed into one being added
 * Both types have the idea of quantity... this method currently just moves one
 *
 * @param mainQuantityL
 * @param itemQuantityL
 * @param match
 * @param copyItemToMain
 */
export function takeFromItemsAndAddToMain<BagType, AddingType>(
    mainQuantityL: Lens<BagType, number>,
    itemQuantityL: Lens<AddingType, number>,
    match: (m: BagType, i: AddingType) => boolean,
    copyItemToMain: (m: AddingType) => BagType): (tuple: Tuple2<BagType[], ItemsAndIndex<AddingType>>) => Tuple2<BagType[], ItemsAndIndex<AddingType>> {
    let addItemToMainList = addItemToBag<BagType, AddingType>(mainQuantityL, itemQuantityL, match, copyItemToMain)
    return tuple => {
        let itemWithQuantitySetToOne = itemQuantityL.set(tuple.two.item(), 1);
        return ({one: addItemToMainList(tuple.one, itemWithQuantitySetToOne), two: tuple.two.decrementQuantityRemoveIfZero(itemQuantityL)});
    }
}

