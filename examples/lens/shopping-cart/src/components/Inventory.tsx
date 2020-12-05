import {InventoryData, ItemsAndIndex, ProductData, ShoppingCartContext, ShoppingCartProps, TwoListData} from "../domain";
import React from "react";
import {BuyButton} from "./BuyButton";

export function Inventory(props: ShoppingCartProps<InventoryData>) {
    let d = props.context.json()
    return (
        <div>
            <h3>Inventory</h3>
            <div>{d.products.map((p, i) =>
                <InventoryItem key={p.id} context={props.context.focusOn('products').withChildLens(ItemsAndIndex.makeLens(i))}/>)}
            </div>
        </div>
    )
}

function InventoryItem(props: ShoppingCartProps<ItemsAndIndex<ProductData>>) {
    let context = props.context;
    let itemsAndIndex = context.json()
    let p = itemsAndIndex.items[itemsAndIndex.index]
    let domain = context.domain
    let newContext: ShoppingCartContext<TwoListData> = context.withLens(TwoListData.makeLens(domain.toCartsProductL, context.lens));
    return (<div style={{marginBottom: 20}}>{p.title} - &#36;{p.price}{p.quantity ? ` x ${p.quantity}` : null}
        <BuyButton context={newContext} normalText='Add to cart' emptyText='Sold Out'/>
    </div>)
}

