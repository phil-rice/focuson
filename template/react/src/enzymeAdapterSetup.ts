import {configure} from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';

export function setup() {
    configure({adapter: new Adapter()});
}

