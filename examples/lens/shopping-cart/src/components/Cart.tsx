import PropTypes from 'prop-types'

import {CartData, productDataQuantityLens, ShoppingCartContext, ShoppingCartProps} from "../domain";
import React from 'react';
import {ItemsAndIndex} from "@phil-rice/lens/src/optics/ItemAndIndex";
import {OneProduct} from "./OneProduct";

export function contextForOneProduct(context: ShoppingCartContext<CartData>, i: number) {
    return ItemsAndIndex.makeContext(context.focusOn('products'), i);
}

export function Cart(props: ShoppingCartProps<CartData>) {
    let products = props.context.json().products
    let domain = props.context.domain
    const nodes = products.length > 0 ?
        products.map((p, i) =>
            (<OneProduct key={p.id}
                         context={contextForOneProduct(props.context, i)}
                         quantityL={productDataQuantityLens}
                         onClick={domain.takeFromCartPutInInventory}
                         button='Remote From Cart'/>)) :
        (<em>Please add some products to cart.</em>)
    return (
        <div>
            <h3>Your Cart</h3>
            <div>{nodes}</div>
            <p>Total: &#36;{props.context.json().total}</p>
            <button onClick={props.context.domain.onCheckoutClicked} disabled={products.length > 0}> Checkout</button>
        </div>
    )
}

Cart.propTypes = {
    products: PropTypes.array,
    total: PropTypes.string,
    onCheckoutClicked: PropTypes.func
}
