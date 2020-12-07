import { StringReplaceData, Strings } from './Strings';
const shajs = require('sha.js');
const testData = require('./TestData');


describe('String operations test suite', () => {

    it('should return the sha and content. In this case, sha and content will match', () => {
        const content = 'test string';
        const sha = new shajs('sha256').update(content).digest('hex');
        const contentAndSha = Strings.findSha(testData.testString);
        expect(contentAndSha.content).toEqual(content);
        expect(contentAndSha.sha).toEqual(sha);
    });

    it('should return different sha when content is changed. In that case, sha & content won\'t match', () => {
        const content = 'test';
        const sha = new shajs('sha256').update(content).digest('hex');
        const contentAndSha = Strings.findSha(testData.testString);
        expect(contentAndSha.content).not.toEqual(content);
        expect(contentAndSha.sha).not.toEqual(sha);
    });

    it('checks if string replaced correctly using multiple matchers', () => {
        expect(Strings.replaceMultipleStrings(testData.stringReplaceData)(testData.jsonTestData)).toEqual(testData.jsonDataAfterReplacement);
    })
})