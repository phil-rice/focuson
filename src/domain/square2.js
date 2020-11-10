
function Square2(props) {
    (<button className='square' onClick={() => props.onClick() }>{props.value + "x"}</button>)
}

Square