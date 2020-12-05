import PropTypes from 'prop-types'

import {CartData, ProductData, ShoppingCartProps} from "../domain";
import React from 'react';
import {LensContext} from "@phil-rice/lens";
import {ItemsAndIndex} from "@phil-rice/lens/src/optics/ItemAndIndex";

export function Cart(props: ShoppingCartProps<CartData>) {
    let products = props.context.json().products
    const nodes = products.length > 0 ?
        products.map((p, i) =>
            <ProductItem key={p.id} context={ItemsAndIndex.makeContext(props.context.focusOn('products'), i)}/>) :
        (<em>Please add some products to cart.</em>);
    return (
        <div>
            <h3>Your Cart</h3>
            <div>{nodes}</div>
            <p>Total: &#36;{props.context.json().total}</p>
            <button onClick={props.context.domain.onCheckoutClicked} disabled={products.length > 0}> Checkout</button>
        </div>
    )
}
function ProductItem(props: ShoppingCartProps<ItemsAndIndex<ProductData>>) {
    let domain = props.context.domain
    let p = props.context.json().item()
    function onClick() { LensContext.tuple(domain.toInventoryProductsL, props.context).transform(domain.takeFromCartPutInInventory)}
    return (<div style={{marginBottom: 20}}>{p.title} - &#36;{p.price}{p.quantity ? ` x ${p.quantity}` : null}
        <button onClick={onClick}>{'Remove From Cart'}</button>
    </div>)

}

Cart.propTypes = {
    products: PropTypes.array,
    total: PropTypes.string,
    onCheckoutClicked: PropTypes.func
}
