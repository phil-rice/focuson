import {RestContext} from "../reactrest/LoadAndCompileCache";
import React from "react";

function Square(props) {
    console.log("Square", props)
    let getter = props.getter


    return (<RestContext.Consumer>{context => {
        let json = getter(context.json)
        console.log("In square", json)
        return (<button className='square' onClick={() => json.onClick()}>{json.value}</button>)
    }}</RestContext.Consumer>)
}

