import PropTypes from 'prop-types'

import {CartData, productDataQuantityLens, ShoppingCartProps} from "../domain";
import React from 'react';
import {ProductList} from "./ProductList";

export function Cart(props: ShoppingCartProps<CartData>) {
    let products = props.context.json().products
    let domain = props.context.domain;
    const nodes = products.length > 0 ?
        (<ProductList context={props.context.focusOn('products')}
                      quantityL={productDataQuantityLens}
                      onClick={domain.takeFromCartPutInInventory} button='Remove From Cart'/>) :
        (<em>Please add some products to cart.</em>)
    return (
        <div>
            <h3>Your Cart</h3>
            <div>{nodes}</div>
            <p>Total: &#36;{props.context.json().total}</p>
            <button onClick={domain.onCheckoutClicked} disabled={products.length == 0}> Checkout</button>
        </div>
    )
}

Cart.propTypes = {
    products: PropTypes.array,
    total: PropTypes.string,
    onCheckoutClicked: PropTypes.func
}
