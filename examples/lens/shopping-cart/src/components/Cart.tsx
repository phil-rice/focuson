import PropTypes from 'prop-types'

import {CartData, ProductData, ShoppingCartProps} from "../domain";
import React from 'react';

export function Cart(props: ShoppingCartProps<CartData>) {
    let products = props.context.json().products
    const nodes = products.length > 0 ?
        <ProductList context={props.context.focusOn('products')}/> :
        (<em>Please add some products to cart.</em>);
    return (
        <div>
            <h3>Your Cart</h3>
            {nodes}
            <p>Total: &#36;{props.context.json().total}</p>
            <button onClick={props.context.domain.onCheckoutClicked} disabled={products.length > 0}> Checkout</button>
        </div>
    )
}

function ProductList(props: ShoppingCartProps<ProductData[]>) {
    return (<div>{props.context.json().map(p => (<div key={p.id}>{p.title} - &#36;{p.price}{p.quantity ? ` x ${p.quantity}` : null}</div>))}</div>)
}


Cart.propTypes = {
    products: PropTypes.array,
    total: PropTypes.string,
    onCheckoutClicked: PropTypes.func
}
