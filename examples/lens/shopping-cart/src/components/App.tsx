import React from 'react'
import {AppData, ShoppingCartProps} from "../domain";
import {Cart} from "./Cart";
import {Inventory} from "./Inventory";

export function App(props: ShoppingCartProps<AppData>) {
    return (<div>
            <h2>Shopping Cart Example</h2>
            <hr/>
            <Cart context={props.context.focusOn('cart')}/>
            <hr/>
            <Inventory context={props.context.focusOn('inventory')}/>
        </div>
    )
}
