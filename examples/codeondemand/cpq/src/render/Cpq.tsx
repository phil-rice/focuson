//Copyright (c)2020-2021 Philip Rice. <br />Permission is hereby granted, free of charge, to any person obtaining a copyof this software and associated documentation files (the Software), to dealin the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:  <br />The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED AS
import {CpqData} from "../CpqDomain";
import {ComponentFromServer} from "@focuson/codeondemand";
import {Lenses} from "@focuson/lens";
import {LensProps} from "@focuson/state";
import {focusOnNth} from "../../../../../modules/state";

export function Cpq<Main>({state}: LensProps<Main, CpqData>) {
    const filters = state.json().filters.map((f, i) =>
        (<ComponentFromServer key={i} state={focusOnNth(state.focusOn('filters'), i)}/>))
    let price: string = state.json().price.toString()
    return (<div className='cpq'>
        <div key='summary' className='summary'>Price: {price}</div>
        <div key='filters' className='filters'>{filters}</div>
    </div>)
}

