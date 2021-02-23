//Copyright (c)2020-2021 Philip Rice. <br />Permission is hereby granted, free of charge, to any person obtaining a copyof this software and associated documentation files (the Software), to dealin the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:  <br />The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED AS
import {CartData, InventoryData, ProductData} from "../domain";
import React from "react";
import {ProductList} from "./ProductList";
import {Lens} from "@focuson/lens";
import {LensState} from "@focuson/state";

interface InventoryProps<Main> {
    state: LensState<Main, InventoryData>,
    addToListLens: Lens<Main, ProductData[]>
}

export function Inventory<Main>({state, addToListLens}: InventoryProps<Main>) {
    return (<div>
        <h3>Inventory</h3>
        <ProductList state={state.focusOn('products')}
                           addToListLens={addToListLens}
                           button='Add to Cart'/>
    </div>)
}

