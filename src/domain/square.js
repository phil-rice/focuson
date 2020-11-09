import React from 'react';
const e = React.createElement;

function Square(props) {
    return e("button", {className: "square", onClick: () => props.data.onClick()}, props.data.value);
}
Square
