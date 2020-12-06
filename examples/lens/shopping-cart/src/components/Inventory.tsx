import {InventoryData, inventoryItemQuantityLens, ShoppingCartContext, ShoppingCartProps} from "../domain";
import React from "react";
import {ItemsAndIndex} from "@phil-rice/lens/src/optics/ItemAndIndex";
import {OneProduct} from "./OneProduct";

export function contextForOneProduct(context: ShoppingCartContext<InventoryData>, i: number) {
    let result = ItemsAndIndex.makeContext(context.focusOn('products'), i);
    console.log('contextForOneProduct', result)
    return result;
}
export function Inventory(props: ShoppingCartProps<InventoryData>) {
    let inventory = props.context.json()
    let domain = props.context.domain
    return (<div>
        <h3>Inventory</h3>
        <div>{inventory.products.map((p, i) => {
            return (<OneProduct
                key={p.id}
                context={contextForOneProduct(props.context, i)}
                quantityL={inventoryItemQuantityLens}
                onClick={domain.takeFromInventoryPutInCart} button='Add to Cart'/>)
        })}</div>
    </div>)
}

