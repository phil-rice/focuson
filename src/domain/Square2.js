
function Square(props) {
    (<button className='square' onClick={() => props.onClick() }>{props.value + "x"}</button>)
}

