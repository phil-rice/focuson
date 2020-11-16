import {ReactRest} from "./reactRest";

export interface ReactRestState{
    json?: any
    reactRest?: ReactRest<React.ReactElement>
    setJson?: (url: string) => Promise<void>
}