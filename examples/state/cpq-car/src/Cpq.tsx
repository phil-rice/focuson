//Copyright (c)2020-2021 Philip Rice. <br />Permission is hereby granted, free of charge, to any person obtaining a copyof this software and associated documentation files (the Software), to dealin the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:  <br />The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED AS
import {LensProps} from "@focuson/state";


export interface CpqData {
    make: MakeSelection,
    model: ModelSelection,
    upholstery: UpholsterySelection,
    externalPaint: PaintSelection,
    leasePeriod: LeasePeriod
}
type MakeSelection = SimpleFilterData
type ModelSelection = SimpleFilterData
type UpholsterySelection = SimpleFilterData
type PaintSelection = SimpleFilterData
type LeasePeriod = SimpleFilterData

export interface SimpleFilterData {
    filterName: string,
    selected?: string,
    options: string []
}


type CpqProps<T> = LensProps< CpqData, T>

export function Cpq({state}: CpqProps<CpqData>) {
    return (
        <div className='cpq'>
            <div className='two'>
                <SimpleFilter state={state.focusOn('make')}/>
                <SimpleFilter state={state.focusOn('model')}/>
                <SimpleFilter state={state.focusOn('upholstery')}/>
                <SimpleFilter state={state.focusOn('externalPaint')}/>
                <SimpleFilter state={state.focusOn('leasePeriod')}/>
            </div>
        </div>
    )
}

function SimpleFilter({state}: CpqProps<SimpleFilterData>) {
    let filterJson = state.json();
    // console.log("SimpleFilter", filterJson, filterJson.filterName)
    const onChange = (event: any) => {state.focusOn('selected').setJson(event.target.value) };
    let options = state.json().options.map(o => (<option key={o}>{o}</option>))
    if (filterJson === undefined)
        return null;
    else
        return (<select className='simpleFilter'
                        value={filterJson.selected ? filterJson.selected : ''}
                        key={state.json().filterName}
                        id={state.json().filterName}
                        onChange={onChange}>{options}</select>)
}

