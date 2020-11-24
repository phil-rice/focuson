# Tic tac toe

This is an example of how to use the 'Lens' idea to manage state in react.

It is an approach that is optimised for the following:

* We are displaying a block of json and there is a sensible mapping between the json and the components
     * We call this 'focusing on the json'
* The component can edit the part of the json that it is focused on
     * When this happens react re-renders the component

# Things to note

## Each component is focused on a part of the json

Here we see an example component. Observe it is strongly typed. The `GameProps<NoughtOrCross` tell
us that this component is focused on a part of the `GameData` which is a nought or cross. In practice
it is the `next` which tells us whether the next square to be clicked will be a nought or a cross.

If we were using reduce we would need to write a function to 'go from the state to this value'. In this
library we use the 'lens' that is baked into the context, so we just call `props.context.json` to get 
the json this is about

```
function NextMove<Main>(props: GameProps<NoughtOrCross>) {
    return (<div>Next Move{props.context.json()}</div>)
}
```

## It is easy to edit the state that the component is focused on

Here we have added an onClick listener that resets the 'next move' to a X if the 
next move is clicked on. 

Note that because the component is 'focused on' the 'next state', all we need to do is call
'setJson'. This is responsible for all the 'what actually changes' and making sure that react
then updates all the relevant components

This is an immutable 'setJson'. What happens behind the scenes is the game is rerendered with the 
state and react does the heavy lifting of working out what has changed and what needs to be redrawn

```
function NextMove<Main>(props: GameProps<NoughtOrCross>) {
    function onClick() {props.context.setJson('X')}
    return (<div><a onClick={() => onClick()}> Next Move{props.context.json()}</a></div>)
}
```

When I read most 'redux' projects I find a lot of the actions are exactly this 'edit the data that the component is focused in on'

## It is easy (and type safe) to render sub components

```export function SimpleGame<Main>(props: GameProps<GameData>) {
    return (
        <div className='game'>
            <NextMove context={props.context.focusOn('next')}/>
            <Board context={props.context.focusOn('board')}/>
        </div>)
}
```

Here we can see that the game component renders a div and two child components. The child components are told which part of the json to focus on by means of the `focusOn` method. This
method is typesafe, and the IDE can give code insight





