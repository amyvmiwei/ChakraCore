//-------------------------------------------------------------------------------------------------------
// Copyright (C) Microsoft Corporation and contributors. All rights reserved.
// Licensed under the MIT license. See LICENSE.txt file in the project root for full license information.
//-------------------------------------------------------------------------------------------------------
this.WScript.LoadScriptFile("..\\UnitTestFramework\\SimdJsHelpers.js");
function asmModule(stdlib, imports) {
    "use asm";

    var ui16 = stdlib.SIMD.Uint8x16;
    var ui16check = ui16.check;
    var ui16shuffle = ui16.shuffle;
    var ui16add = ui16.add;
    var ui16mul = ui16.mul;

    var ui16g1 = ui16(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16);
    var ui16g2 = ui16(256, 255, 128, 127, 0, 0, 1000, 1000, 5, 15, 3, 399, 299, 21, 45, 22);
   
    var loopCOUNT = 3;

    function testShuffleGlobal() {
        var result = ui16(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
        var loopIndex = 0;

        while ((loopIndex | 0) < (loopCOUNT | 0)) {
            result = ui16shuffle(ui16g1, ui16g2, 0, 1, 4, 5, 8, 10, 11, 12, 4, 2, 1, 6, 2, 8, 14, 0);
            loopIndex = (loopIndex + 1) | 0;
        }
        return ui16check(result);
    }
    
    function testShuffleLocal() {
        var a = ui16(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16);
        var b = ui16(16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1);
        var result = ui16(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
        var loopIndex = 0;

        while ((loopIndex | 0) < (loopCOUNT | 0)) {
            result = ui16shuffle(a, b, 0, 1, 4, 5, 8, 10, 11, 12, 4, 2, 1, 6, 2, 8, 14, 0);
            loopIndex = (loopIndex + 1) | 0;
        }
        return ui16check(result);
    }
    
    function testShuffleFunc() {
        var a = ui16(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16);
        var result = ui16(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
        var loopIndex = 0;

        while ((loopIndex | 0) < (loopCOUNT | 0)) {
            result = ui16shuffle(ui16add(a,ui16g1), ui16mul(a,ui16g1), 0, 1, 4, 5, 8, 10, 11, 12, 4, 2, 1, 6, 2, 8, 14, 0);
            loopIndex = (loopIndex + 1) | 0;
        }
        return ui16check(result);
    }

    return { testShuffleGlobal:testShuffleGlobal , testShuffleLocal:testShuffleLocal, testShuffleFunc:testShuffleFunc };
}

var m = asmModule(this, { g1: SIMD.Uint8x16(100, -1073741824, -1028, -102, 3883, -38, -92929, 1442, 52, 127, -127, -129, 129, 0, 88, 100234)});

equalSimd([1, 2, 5, 6, 9, 11, 12, 13, 5, 3, 2, 7, 3, 9, 15, 1], m.testShuffleGlobal(), SIMD.Uint8x16, "");
equalSimd([1, 2, 5, 6, 9, 11, 12, 13, 5, 3, 2, 7, 3, 9, 15, 1], m.testShuffleLocal(), SIMD.Uint8x16, "");
equalSimd([2, 4, 10, 12, 18, 22, 24, 26, 10, 6, 4, 14, 6, 18, 30, 2], m.testShuffleFunc(), SIMD.Uint8x16, "");

print("PASS");



