import React from 'react';
const e = React.createElement;

function Square(props) {
    // return (<button className='square' onClick={ props.data.onClick()}>{}</button>)
    return e("button", {className: "square", onClick: () => props.data.onClick()}, props.data.value);
}
Square
