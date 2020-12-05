import {ShoppingCartContext, ShoppingCartProps, TwoListData} from "../domain";
import React from "react";

interface TwoListButtonprops{
    context: ShoppingCartContext<TwoListData>,
    normalText: string,
    emptyText: string,
    onClick: (t: TwoListData) => TwoListData

}

export function TwoListButton(props: TwoListButtonprops) {
    function onAddToCartClicked(event: any) { props.context.setJson(props.onClick(props.context.json())) }
    let quantity = props.context.json().item().quantity
    let buttonText = quantity > 0 ? props.normalText: props.normalText
    return (<button onClick={onAddToCartClicked} disabled={quantity == 0}> {buttonText}</button>)

}