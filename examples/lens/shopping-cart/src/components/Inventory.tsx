import {InventoryData, inventoryItemQuantityLens, CartProps} from "../domain";
import React from "react";
import {ProductList} from "./ProductList";


export function Inventory({context}: CartProps<InventoryData>) {
    return (<div>
        <h3>Inventory</h3>
        <ProductList context={context.focusOn('products')}
                     quantityL={inventoryItemQuantityLens}
                     onClick={context.domain.takeFromInventoryPutInCart} button='Add to Cart'/>
    </div>)
}

