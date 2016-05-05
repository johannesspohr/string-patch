import smartMerge, {createPatch, applyPatch, applyPatchOnPatch} from '../src';
var should = require('should');

describe("createPatch", () => {

    it("should recognize inserts", () => {

        createPatch("ac", "abcd").should.be.eql([
            {operation: 'ins', position: 1, char: 'b'},
            {operation: 'ins', position: 3, char: 'd'}
        ]);

        createPatch("", "abcd").should.be.eql([
            {operation: 'ins', position: 0, char: 'a'},
            {operation: 'ins', position: 1, char: 'b'},
            {operation: 'ins', position: 2, char: 'c'},
            {operation: 'ins', position: 3, char: 'd'},
        ]);


    });

    it("should recognize removes", () => {
        createPatch("abcd", "abd").should.be.eql([
            {operation: 'rm', position: 2},
        ]);

        createPatch("abcd", "ab").should.be.eql([
            {operation: 'rm', position: 2},
            {operation: 'rm', position: 2},
        ]);

        createPatch("abcd", "").should.be.eql([
            {operation: 'rm', position: 0},
            {operation: 'rm', position: 0},
            {operation: 'rm', position: 0},
            {operation: 'rm', position: 0},
        ]);

        createPatch("abcdefgh", "abcdfh").should.be.eql([
            {operation: 'rm', position: 4},
            {operation: 'rm', position: 5}
        ]);

    });

    it("should recognize replaces", () => {
        createPatch("abcd", "abce").should.be.eql([
            {operation: 'rep', position: 3, char: 'e'},
        ]);

        createPatch("abcd", "bbcd").should.be.eql([
            {operation: 'rep', position: 0, char: 'b'},
        ]);
    });

    it("should all work tigether", () => {
        createPatch("abcdegx", "acdefgy").should.be.eql([
            {operation: 'rm', position: 1},
            {operation: 'ins', position: 4, char: 'f'},
            {operation: 'rep', position: 6, char: 'y'},
        ]);
    });

});

function randomString(len, charSet) {
    charSet = charSet || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var randomString = '';
    for (var i = 0; i < len; i++) {
        var randomPoz = Math.floor(Math.random() * charSet.length);
        randomString += charSet.substring(randomPoz,randomPoz+1);
    }
    return randomString;
}

describe("applyPatch", () => {
    it("should insert correctly", () => {
        applyPatch("ac", [{operation: "ins", position: 1, char: 'b'}]).should.be.eql("abc");
        applyPatch("c", [{operation: "ins", position: 0, char: 'a'}]).should.be.eql("ac");
        applyPatch("c", [{operation: "ins", position: 1, char: 'a'}]).should.be.eql("ca");
    });

    it("should remove correctly", () => {
        applyPatch("abc", [{operation: "rm", position: 1}]).should.be.eql("ac");
        applyPatch("abbc", [{operation: "rm", position: 1}, {operation: "rm", position: 1}]).should.be.eql("ac");
        applyPatch("abc", [{operation: "rm", position: 0}, {operation: "rm", position: 1}]).should.be.eql("b");
    });

    it("should replace correctly", () => {
        applyPatch("abc", [{operation: "rep", position: 1, char: 'f'}]).should.be.eql("afc");
    });
});

describe("apply created patch", () => {
    it("should work for 50 generated strings", function() {
        for (var i = 0; i < 50; i++) {
            var before = randomString(Math.floor(Math.random() * 100));
            var after = randomString(Math.floor(Math.random() * 100));
            var patch = createPatch(before, after);
            applyPatch(before, patch).should.be.eql(after);
        }
    });
});

describe("apply patch on patch", () => {
    it("should move patch operations", function() {
        applyPatchOnPatch([{operation: "ins", position: 1, char: 'a'}], [{operation: "rm", position: 0}]).should.be.eql([{operation: "ins", char: "a", position: 0}]);
        
        applyPatchOnPatch([{operation: "ins", position: 1, char: 'a'}], [{operation: "ins", position: 0, char: "a"}]).should.be.eql([{operation: "ins", char: "a", position: 2}]);
        applyPatchOnPatch([{operation: "ins", position: 1, char: 'a'}], [{operation: "rm", position: 1}]).should.be.eql([{operation: "ins", char: "a", position: 1}]);
        applyPatchOnPatch([{operation: "ins", position: 2, char: 'a'}], [{operation: "rm", position: 1}]).should.be.eql([{operation: "ins", char: "a", position: 1}]);
    });
});

describe("full stack test", () => {
    it("should merge hello world and darkness", function() {
        smartMerge("Hello, World", "Hello World", "Hello, Darkness").should.be.eql("Hello Darkness");
        smartMerge("So that's a text and i will change something here and here.", "So that's a text and i will change something there and here.", "So that's a text and i will change something here and somewhere else.").should.be.eql("So that's a text and i will change something there and somewhere else.");
        smartMerge('ABC', 'AC', 'DEF').should.be.eql("DF");
    });
});
