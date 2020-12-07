import { Files } from './Files';
import path, { parse, ParsedPath } from "path";
const fs = require('fs');

describe('File operations suite', () => {
    jest.mock('fs');
    const files = new Files();

    it('should read all the files within the directory and return an array of Promises', () => {
        jest.spyOn(fs.promises, 'readdir');
        files.forEachFile('src/test')((file: string) => Promise.resolve(1));
        expect(fs.promises.readdir).toHaveBeenCalled();
    })

    it('should read all the files within the directory and return an array of Promises', () => {
        jest.spyOn(fs.promises, 'readdir');
        files.forEachFile('src/test')((file: string) => Promise.resolve(1));
        expect(fs.promises.readdir).toHaveBeenCalled();
    })

    it('should create a new directory if one doesn\'t already exist', () => {
        jest.spyOn(fs.promises, 'mkdir');
        files.createDirectoryForFile(path.parse('src/test'));
        expect(fs.promises.mkdir).toHaveBeenCalled();
    });

})
