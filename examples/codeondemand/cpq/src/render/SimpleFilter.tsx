import React from "react";
import { CpqProperties, CqpFilter } from "../CpqDomain";
import { Lens } from "@phil-rice/lens";


export function SimpleFilter<Main>({context}: CpqProperties<Main, CqpFilter>) {
    const onChange = (event: any) => context.focusOn('selected').setJson(event.target.value);
    let filterJson = context.json();
    let options = filterJson.legalValues.map(o => (<option key={o}>{o}</option>))
    return (<div className="simpleFilterContainer"><select className='simpleFilter'
        value={filterJson.selected ? filterJson.selected : ''}
        key={context.json().filterName}
        id={context.json().filterName}
        onChange={onChange}>{options}</select></div>);

}
