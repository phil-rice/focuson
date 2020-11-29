
export interface NavProps<Data> {
    "jsonFiles": string[],
    fetch: (url: string) => Promise<Data>
    setData: (data: Data) => void
}

export function Nav<Data>(props: NavProps<Data>) {
    const onClick = (url: string) => () => props.fetch(url).then(data => props.setData(data))
    let group = props.jsonFiles.map(url =>
        (<li className='navitem' key={url} onClick={onClick(url)}>{url}</li>))
    return (<ul className='nav'>{group}</ul>)
}
