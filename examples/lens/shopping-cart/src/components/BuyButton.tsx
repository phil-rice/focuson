import {ShoppingCartContext, ShoppingCartProps, TwoListData} from "../domain";
import React from "react";

interface BuyButtonProps{
    context: ShoppingCartContext<TwoListData>,
    normalText: string,
    emptyText: string
}

export function BuyButton( props: BuyButtonProps) {
    function onAddToCartClicked(event: any) { props.context.setJson(props.context.domain.takeFromItemsAndAddToMain(props.context.json())) }
    let quantity = props.context.json().item().quantity
    let buttonText = quantity > 0 ? props.normalText: props.normalText
    return (<button onClick={onAddToCartClicked} disabled={quantity == 0}> {buttonText}</button>)

}