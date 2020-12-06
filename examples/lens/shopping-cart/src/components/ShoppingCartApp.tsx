import React from 'react'
import {AppData, CartProps} from "../domain";
import {Cart} from "./Cart";
import {Inventory} from "./Inventory";

export function ShoppingCartApp({context}: CartProps<AppData>) {
    return (<div>
            <h2>Shopping Cart Example</h2>
            <hr/>
            <Cart context={context.focusOn('cart')}/>
            <hr/>
            <Inventory context={context.focusOn('inventory')}/>
        </div>
    )
}
