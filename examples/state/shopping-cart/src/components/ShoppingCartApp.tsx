//Copyright (c)2020-2021 Philip Rice. <br />Permission is hereby granted, free of charge, to any person obtaining a copyof this software and associated documentation files (the Software), to dealin the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:  <br />The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED AS
import React from 'react'
import {AppData, toCartsProductL, toInventoryProductsL} from "../domain";
import {Cart} from "./Cart";
import {Inventory} from "./Inventory";
import {LensProps} from "@focuson/state";

export function ShoppingCartApp({state}: LensProps<AppData,AppData>) {
    return (<div>
            <h2>Shopping Cart Example</h2>
            <hr/>
            <Cart state={state.focusOn('cart')} addToListLens={toInventoryProductsL}/>
            <hr/>
            <Inventory state={state.focusOn('inventory')} addToListLens={toCartsProductL}/>
        </div>
    )
}
