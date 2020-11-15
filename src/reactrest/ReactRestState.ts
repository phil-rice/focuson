import {ReactRest} from "./reactRest";

export interface ReactRestState{
    json?: any
    reactRest?: ReactRest
    setJson?: (url: string) => Promise<void>
}