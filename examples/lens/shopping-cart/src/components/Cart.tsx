import PropTypes from 'prop-types'

import {CartData, productDataQuantityLens, CartProps} from "../domain";
import React from 'react';
import {ProductList} from "./ProductList";

export function Cart({context}: CartProps<CartData>) {
    let products = context.json().products
    let domain = context.domain;
    const nodes = products.length > 0 ?
        (<ProductList context={context.focusOn('products')}
                      quantityL={productDataQuantityLens}
                      onClick={domain.takeFromCartPutInInventory} button='Remove From Cart'/>) :
        (<em>Please add some products to cart.</em>)
    return (
        <div>
            <h3>Your Cart</h3>
            <div>{nodes}</div>
            <p>Total: &#36;{context.json().total}</p>
            <button onClick={domain.onCheckoutClicked} disabled={products.length == 0}> Checkout</button>
        </div>
    )
}

Cart.propTypes = {
    products: PropTypes.array,
    total: PropTypes.string,
    onCheckoutClicked: PropTypes.func
}
