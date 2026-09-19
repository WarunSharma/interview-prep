// Notes (quick recall):
// 1) typeof is best for primitives (number, string, boolean, undefined, function, symbol, bigint).
// 2) typeof null === "object" (historical JS quirk) => handle null first.
// 3) For objects, use Object.getPrototypeOf(value).constructor.name for specific type:
//    {} -> Object, [] -> Array, new Date() -> Date, new Map() -> Map, etc.
// 4) Safety guard (proto && proto.constructor) avoids crashes on edge cases like Object.create(null).
// 5) Lowercase constructor names to match the problem's return contract.

var detectType = function(type) {
    if (type === null) return "null";

    if (typeof type === "object") {
        const proto = Object.getPrototypeOf(type);
        return proto && proto.constructor ? proto.constructor.name.toLowerCase() : "object";
    }

    return typeof type;
};

console.log("---- Basic ----");
console.log(detectType(1));                       // number
console.log(detectType("1"));                     // string
console.log(detectType(true));                    // boolean
console.log(detectType(null));                    // null
console.log(detectType(undefined));               // undefined
console.log(detectType({}));                      // object
console.log(detectType([]));                      // array
console.log(detectType(function() {}));           // function
console.log(detectType(new Date()));              // date

console.log("---- More primitives ----");
console.log(detectType(NaN));                     // number
console.log(detectType(Infinity));                // number
console.log(detectType(10n));                     // bigint
console.log(detectType(Symbol("id")));            // symbol
console.log(detectType(false));                   // boolean
console.log(detectType(""));                      // string

console.log("---- Built-in objects ----");
console.log(detectType(new Map()));               // map
console.log(detectType(new Set()));               // set
console.log(detectType(new WeakMap()));           // weakmap
console.log(detectType(new WeakSet()));           // weakset
console.log(detectType(/abc/));                   // regexp
console.log(detectType(new Error("x")));          // error
console.log(detectType(new Number(5)));           // number
console.log(detectType(new String("hi")));        // string
console.log(detectType(new Boolean(true)));       // boolean
console.log(detectType(Promise.resolve(1)));      // promise

console.log("---- Array/Object variants ----");
console.log(detectType([1, 2, 3]));               // array
console.log(detectType(Object.create({})));       // object (from prototype's constructor)
console.log(detectType(Object.create(null)));     // object (no prototype)

console.log("---- Functions ----");
console.log(detectType(() => {}));                // function
console.log(detectType(async function() {}));     // function
console.log(detectType(function* () {}));         // function

console.log("---- Typed arrays / buffers ----");
console.log(detectType(new Int8Array(2)));        // int8array
console.log(detectType(new Uint8Array(2)));       // uint8array
console.log(detectType(new ArrayBuffer(8)));      // arraybuffer
console.log(detectType(new DataView(new ArrayBuffer(8)))); // dataview

console.log("---- Custom class ----");
class User {}
console.log(detectType(new User()));              // user