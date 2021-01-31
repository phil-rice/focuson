//Copyright (c)2020-2021 Philip Rice. <br />Permission is hereby granted, free of charge, to any person obtaining a copyof this software and associated documentation files (the Software), to dealin the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:  <br />The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED AS
import { Files } from './Files';
import { JsonTransformer, JsonSourceDirAndTargetDir } from './JsonTransformer';
import { SourceAndTargetDir } from './TsxTransformer';
import path, { ParsedPath } from "path";
import { StringReplaceData } from './Strings';

const fs = require('fs');
const testData = require('./TestData');
const files = new Files();
const jsonTransformer = new JsonTransformer(files);
const mock = require('mock-fs');

const toFileName = (sourceAndTargetDir: SourceAndTargetDir) => (parsedPath: ParsedPath, sha: string): ParsedPath =>
    path.parse(path.join(sourceAndTargetDir.targetDir, parsedPath.base));

const transformCode = (contents: string, file: string): Promise<string> => {
    return Promise.resolve("transformed content");
}

describe('File operations', () => {

    beforeAll(() => {
        mock({
            'path/to/fake/dir': {
                'test-dir': {
                    'test.txt': 'some test content'
                },
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

    it('should not do anything if the file already exists', () => {
        return expect(files.saveFileIfDoesntExist(path.parse('path/to/fake/dir/test-dir/test.txt'), testData.testContent, testData.testShaCode)).resolves.not.toBe('test');
    });

    it('should create and save the file if it doesnot exist', () => {
        return files.saveFileIfDoesntExist(path.parse('path/to/fake/dir/test-dir/test.txt'), testData.testContent, testData.testShaCode)
            .catch(e => {
                expect(e.message).toMatch('ENOENT');
                expect(fs.promises.writeFile).toHaveBeenCalled();
            }
            );
    });

    it('should copy, transform and save file for Content Addressable Data', () => {
        const sourceAndTargetDir: SourceAndTargetDir = { sourceDir: 'path/to/fake/dir/source-dir', targetDir: 'path/to/fake/dir/destination-dir' };
        const parsedPath = path.parse('path/to/fake/dir/source-dir/some-test.txt');

        return expect(files.copyTransformAndSaveFileForContentAddressableData(parsedPath, transformCode, toFileName(sourceAndTargetDir))).resolves.not.toThrow();
    })

    afterAll(() => {
        mock.restore();
    })

})
