//Copyright (c)2020-2021 Philip Rice. <br />Permission is hereby granted, free of charge, to any person obtaining a copyof this software and associated documentation files (the Software), to dealin the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:  <br />The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED AS
import { Strings } from './Strings';
import { SHA256 } from 'crypto-js';

const testData = require('./TestData');

describe('String operations test suite', () => {

    it('should return the sha and content. In this case, sha and content will match', () => {
        const content = 'test string';
        const sha = SHA256(content).toString();
        const contentAndSha = Strings.findSha(testData.testString);
        expect(contentAndSha.content).toEqual(content);
        expect(contentAndSha.sha).toEqual(sha);
    });

    it('should return different sha when content is changed. In that case, sha & content won\'t match', () => {
        const content = 'test';
        const sha = SHA256(content).toString();
        const contentAndSha = Strings.findSha(testData.testString);
        expect(contentAndSha.content).not.toEqual(content);
        expect(contentAndSha.sha).not.toEqual(sha);
    });

    it('checks if string replaced correctly using multiple matchers', () => {
        expect(Strings.replaceMultipleStrings(testData.stringReplaceData)(testData.jsonTestData)).toEqual(testData.jsonDataAfterReplacement);
    })
})