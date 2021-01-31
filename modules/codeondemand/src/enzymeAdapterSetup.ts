import {configure} from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';

export function enzymeSetup() {
    configure({adapter: new Adapter()});
}

