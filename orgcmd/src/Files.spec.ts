import { Files } from './Files';
import { JsonTransformer, JsonSourceDirAndTargetDir } from './JsonTransformer';
import path from "path";
import { StringReplaceData } from './Strings';

const fs = require('fs');
const files = new Files();
const jsonTransformer = new JsonTransformer(files);
const mock = require('mock-fs');

describe('File operations', () => {

    beforeAll(() => {
        mock({
            'path/to/fake/dir': {
                'source-dir': {
                    'some-test.txt': 'test file content',
                },
                'datasource-dir': {
                    'some-file.txt': 'json file content here',
                    'test.txt': 'test json file content',
                },
                'destination-dir': {
                    'some-file.txt': 'file content here',
                    'test.txt': 'file content',
                },
                'some-other-dir': {/** empty directory */ },
            },
        })
    });

    it('should read the files within a directory', () => {
        jest.spyOn(fs.promises, 'readdir');
        const jsonSourceDirAndTargetDir: JsonSourceDirAndTargetDir = { jsonSourceDir: 'path/to/fake/dir/datasource-dir', targetDir: 'path/to/fake/dir/destination-dir' };
        const stringReplaceData: StringReplaceData[] = [
            { fromMatcher: new RegExp(`testcontent`, 'gi'), to: `newcontent` }
        ]
        return files.forEachFile('path/to/fake/dir/datasource-dir')(jsonTransformer.processOneJsonFile(jsonSourceDirAndTargetDir, stringReplaceData)).then((filesList: string[]) => {
            expect(fs.promises.readdir).toHaveBeenCalled();
        });
    });

    it('should throw an eror when fail to read the files within a directory', () => {
        return expect(files.forEachFile('path/to/fake/dir1')).rejects.toMatchObject({
            message: expect.stringMatching(/ENOENT/)
        });
    });

    it('should validate the directory exists', async () => {
        return expect(files.validateDirectoryExists('test directory', 'path/to/fake/dir')).resolves.not.toThrow();
    });

    it('should throw an error if the directory does\'nt exist', async () => {
        return expect(files.validateDirectoryExists('test directory', 'path/to/fake/dir1')).rejects.toThrow(
            'Error: test directory: path/to/fake/dir1 not found.'
        )
    });

    it('should create a new directory if one doesnot already exist', () => {
        return expect(files.createDirectoryForFile(path.parse('path/to/fake/dir/some-other-directory'))).resolves.not.toThrow();
    });

    afterAll(() => {
        mock.restore();
    });

})
