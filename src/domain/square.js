
function Square(props) {
    return (<button className='square' onClick={() => props.data.onClick()}>{props.data.value}</button>)
}

Square