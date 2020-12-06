import {InventoryData, inventoryItemQuantityLens, ShoppingCartProps} from "../domain";
import React from "react";
import {ProductList} from "./ProductList";


export function Inventory(props: ShoppingCartProps<InventoryData>) {
    return (<div>
        <h3>Inventory</h3>
        <ProductList context={props.context.focusOn('products')}
                     quantityL={inventoryItemQuantityLens}
                     onClick={props.context.domain.takeFromInventoryPutInCart} button='Add to Cart'/>
    </div>)
}

