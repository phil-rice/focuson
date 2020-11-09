
function Square2(props) {
    (<button className='square' onClick={() => props.data.onClick() }>{props.data.value + "x"}</button>)
}

Square