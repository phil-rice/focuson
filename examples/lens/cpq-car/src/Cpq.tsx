import { LensContext, LensProps } from "@phil-rice/lens";


export interface CpqData {
    category: CategorySelection,
    make: MakeSelection,
    model: ModelSelection,
    upholstery: UpholsterySelection,
    externalPaint: PaintSelection,
    leasePeriod: LeasePeriod,
    result: SearchResultType
}
// type MakeSelection = SimpleFilterData
type CategorySelection = ImageFilterData
type MakeSelection = SimpleFilterData
type ModelSelection = SimpleFilterData
type UpholsterySelection = SimpleFilterData
type PaintSelection = SimpleFilterData
type LeasePeriod = SimpleFilterData
type SearchResultType = SearchResultData

export interface RootFilterData<T> {
    filterName: string,
    selected?: string,
    options: T[]

}
export interface SimpleFilterData extends RootFilterData<string> {
}
export interface ImageFilterData extends RootFilterData<ImageFilterOption> {
}

export interface ImageFilterOption {
    name: string,
    img: string
}

export interface VehicleData {
    propositions: number,
    name: string,
    img: string,
    fuel: string,
    transmissionType: string,
    fuelConsumption: string,
    bodyType: string,
    co2Emission: string,
    enginePower: string,
    price: string,
    currency: string,
    term: string
}

export interface SearchResultData {
    count: number,
    vehicles: VehicleData[]
}

// export interface SimpleFilterData {
//     filterName: string,
//     selected?: string,
//     options: string[]
// }

export class CpqDomain { }
type CpqProps<T> = LensProps<CpqDomain, CpqData, T>

export function Cpq({ context }: CpqProps<CpqData>) {
    console.log('context', context.main);
    return (
        <div className='cpq'>
            <div className='two'>
                {/* <SimpleFilter context={context.focusOn('make')} /> */}
                <QuickFilter context={context.focusOn('category')} />
                <div>
                    <SimpleFilter context={context.focusOn('make')} />
                    {/* <SimpleFilter context={context.focusOn('make')} /> */}
                    <SimpleFilter context={context.focusOn('model')} />
                    <SimpleFilter context={context.focusOn('upholstery')} />
                    <SimpleFilter context={context.focusOn('externalPaint')} />
                    <SimpleFilter context={context.focusOn('leasePeriod')} />
                </div>
            </div>
            <div className="result">
                <SearchResult context={context.focusOn('result')} />
            </div>
        </div>
    )
}

function displayIfPresent<T, Result>(context: LensContext<CpqDomain, CpqData, T>, fn: () => Result): Result | null {
    return context.json() ? fn() : null;
}

function RootFilter<T>({ context }: CpqProps<RootFilterData<T>>, findDisplayTextFn: (option: T) => string) {
    let filterJson = context.json();
    const onChange = (event: any) => { context.focusOn('selected').setJson(event.target.value) };
    let options = context.json().options.map(option2(findDisplayTextFn))
    return displayIfPresent(context, () =>
        <select className='simpleFilter'
            value={filterJson.selected ? filterJson.selected : ''}
            key={context.json().filterName}
            id={context.json().filterName}
            onChange={onChange}>
            <option>{context.json().filterName}</option>
            {options}
        </select>)
}

function option2<T>(findDisplayTextFn: (option: T) => string) {
    return (option: T) => (<option key={findDisplayTextFn(option)}>
        {findDisplayTextFn(option)}
    </option>);
}


function option<T>(findDisplayTextFn: (option: T) => string, option: T) {
    return (<option key={findDisplayTextFn(option)}>
        {findDisplayTextFn(option)}
    </option>);
}

// function ImagedDropDownFilter({ context }: CpqProps<ImageFilterData>) {
//     return RootFilter<ImageFilterOption>({ context },
//         o => {
//             return o;
//         })
// }
function SimpleFilter({ context }: CpqProps<SimpleFilterData>) {
    return RootFilter<string>({ context }, s => s)
}

function ImageFilter({ context }: CpqProps<ImageFilterData>) {
    let filterJson = context.json();

    const onChange = (event: any) => {
        console.log('test click', event.target.value);
        context.focusOn('selected').setJson(event.target.value)
    };
    console.log('json', context.json());
    let images = context.json().options.map(o => (<img src={o.img} key={o.name} onClick={onChange} />))

    return displayIfPresent(context, () =>
        <div className='imageFilter'
            key={context.json().filterName}
            id={context.json().filterName}>{images}</div>)
}

function QuickFilter({ context }: CpqProps<ImageFilterData>) {
    console.log(context.json().options);
    let options = context.json().options
        .map(o => (<div className="LinkWrapper-sc-pknfr2 jrBJkR">
            <a data-e2e-id={o.name}
                data-key={o.name}
                className="Link-sc-1r3n2zr fGsDCa" target="" rel="follow"
                href="#">
                <div className="sc-jSgupP LinkGrid-sc-alrobz cLYoMh bzycIR" data-e2e-grid="">
                    <div className="sc-eCssSg ImageGridItem-sc-8zjm1w gZpLoH gveRBE" data-e2e-grid-item="">
                        <img src={o.img} alt="" className="QuickFilterImage-sc-xqp548 bbSFQP img-fluid" />
                    </div>
                    <div className="sc-eCssSg LabelGridItem-sc-13zqrcu eZyFyz hSjabX" data-e2e-grid-item="">{o.name}</div>
                </div>
            </a>
        </div>));

    return displayIfPresent(context, () =>
        <div data-component="QuickFilters" className="LinkContainer-sc-1rg2eld hVkHVd">{options}</div>);
}

function SearchResult({ context }: CpqProps<SearchResultData>) {
    console.log('result', context.json().vehicles);
    let vehicles = context.json().vehicles
        .map(v => (<div className="car-list-item car-list-item-1  car-list-item-odd car-list-item-first processed car-list-item-details-open details-open" data-item="1" data-group="1">
            <div className="car-list-item-top">
                <div className="car-list-item-image">
                    <img src={v.img} className="img-fluid" width="420" height="280" alt="" title={v.name} />
                </div>
                <div className="car-list-item-price">
                    <div className="car-list-item-price-label">Starting from</div>
                    <div className="car-list-item-price-value">
                        <span className="currency">
                            <span className="value">{v.price}</span>
                            <span className="unitcode"> {v.currency}</span>
                        </span>
                    </div>
                </div>
            </div>
            <div className="car-list-item-bottom">
                <div className="car-list-item-name">
                    <h3>{v.name.toLocaleUpperCase()}</h3>
                </div>
                <div className="car-list-item-detail-vehicles">
                    <div className="car-list-item-detail-vehicles-more">{v.propositions}</div>
                    <div className="car-list-item-detail-vehicles-less">
                        Less        </div>
                </div>
            </div>
        </div>));

    return displayIfPresent(context, () =>
        <div className="car-list car-list-teasers car-list-3-wide car-list-overview">
            {vehicles}
        </div>);
}

// function CheckBoxFilter({ context }: CpqProps<SimpleFilterData>) {
//     let options = context.json().options
//         .map(o => (<div className="Pulse-sc-1eihdq2 hPruFc">
//             <div data-e2e-id="AUDI" className="CheckboxWrapper-sc-1wl4lca lkJQsl">
//                 <div data-e2e-checkbox="" className="sc-kstrdz btjemE">
//                     <label className="sc-hBEYos cRkLjr">
//                         <input id="make-AUDI" name="make" type="checkbox" data-e2e-checkbox-input="" value="AUDI" />
//                         <div>
//                         </div>
//                         <span>
//                             <a href="https://www.leaseplan.com/en-be/business/showroom/audi/" title="make" className="HiddenLinkForSEO-sc-ap31if cDRTtl">AUDI</a>
//                             <span className="sc-gsTCUz bKzEGB">Audi</span>
//                             <span className="sc-gsTCUz gyeelT">(299)</span>
//                         </span>
//                     </label>
//                 </div>
//             </div>
//         </div>));

//     return displayIfPresent(context, () =>
//         <div className="ClickBoundary-sc-4mcoyq efNMOi">
//             <div className="sc-hKgILt RoundedPaper-sc-1a43p54 ButtonWrapper-sc-3tbx2n chrFRZ bZTdUO eMxuRR">
//                 <div className="sc-dlfnbm gipNwn">
//                     <button className="Button-sc-1jmi51b hUivny">
//                         <div className="sc-bdfBwQ rBbCe">
//                             <div className="sc-jSgupP Grid-sc-1u50mh9 fgIxQX kwGitQ">
//                                 <div className="sc-eCssSg MobileGrowGridItem-sc-1ik14oq eNBsor iUpVCR">
//                                     <h3 className="sc-ezrdKe TriggerHeading-sc-stv69z lkNfMx kDUSOx">Make</h3>
//                                 </div>
//                                 <div className="sc-eCssSg eNBsor">
//                                     <div className="ChevronSpacing-sc-pybr4y jnSJyT">
//                                         {/* <img/> */}
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </button>
//                 </div>
//             </div>
//             <div className="sc-hKgILt RoundedPaper-sc-1a43p54 OnPageFilterPaper-sc-uw3g20 chrFRZ bZTdUO fa-Dlwl">
//                 <div className="sc-dlfnbm gipNwn">
//                     <div className="sc-bdfBwQ kbAIXj">
//                         <div className="SearchBarWrapper-sc-7a3ao2 dgXFcE">
//                             <div>
//                                 <div className="sc-pFZIQ gbgfMs">
//                                     <div className="sc-hHftDr kCQmsc">
//                                         {/* <img/>> */}
//                                     </div>
//                                     <div className="sc-dmlrTW hOpDBC">
//                                         <input className="sc-dIUggk jyuJgK" />
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                     <div className="sc-bdfBwQ bUgaxv">
//                         <div>
//                             <div className="sc-bdfBwQ ScrollableContainer-sc-125h221 tCLzP krqGeC">
//                                 <div>
//                                     <div className="Badge-sc-18o5ns2 fdWEvw">
//                                         <span className="translation-label">Popular makes</span>
//                                     </div>
//                                     <div className="sc-bdfBwQ bwZCvE">
//                                         <div data-e2e-checkbox-list="" title="Make &amp; Model" data-component="CheckboxTree" className="sc-gWHgXt kQxpNs StyledCheckboxList-sc-10w9p7z jpCSwB">
//                                             {options}
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>);
// }

// function SimpleFilter({context}: CpqProps<SimpleFilterData>) {
//     let filterJson = context.json();
//     // console.log("SimpleFilter", filterJson, filterJson.filterName)
//     const onChange = (event: any) => { context.focusOn('selected').setJson(event.target.value) };
//     let options = context.json().options.map(o => (<option key={o}>{o}</option>))
//     if (filterJson === undefined)
//         return null;
//     else
//         return (<select className='simpleFilter'
//             value={filterJson.selected ? filterJson.selected : ''}
//             key={context.json().filterName}
//             id={context.json().filterName}
//             onChange={onChange}>{options}</select>)
// }