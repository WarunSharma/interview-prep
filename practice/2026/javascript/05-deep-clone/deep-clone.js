
var detectType = function(type) {
    if (type === null) return "null";

    if (typeof type === "object") {
        const proto = Object.getPrototypeOf(type);
        return proto && proto.constructor ? proto.constructor.name.toLowerCase() : "object";
    }

    return typeof type;
}

var deepClone = function(obj, cache = new Map()) {
    const type = detectType(obj);

    if (type !== "object" && type !== "array")
        return obj;

    if (cache.has(obj)) {
        return cache.get(obj);
    }

    const clone = type === "array" ? [] : {};
    cache.set(obj, clone);

    for (const key in obj) {
        clone[key] = deepClone(obj[key], cache);
    }

    return clone;
}

// --- Examples ---
// Uncomment to test your implementation:

console.log(deepClone(1))                          // Expected: 1
console.log(deepClone('hello'))                    // Expected: 'hello'
console.log(deepClone(null))                       // Expected: null
console.log(deepClone([1, 2, 3]))                  // Expected: [1, 2, 3]
console.log(deepClone({ a: 1, b: 2 }))             // Expected: { a: 1, b: 2 }

const a = { value: 1 }; a.self = a;
const clonedA = deepClone(a);
console.log(clonedA.value)                         // Expected: 1
console.log(clonedA.self === clonedA)              // Expected: true (circular reference preserved)

// Additional test cases
console.log(deepClone(true))                       // Expected: true
console.log(deepClone(undefined))                  // Expected: undefined
console.log(deepClone(NaN))                          // Expected: NaN
console.log(deepClone([1, 2]))                     // Expected: [1, 2]
console.log(deepClone([]))                         // Expected: []
console.log(deepClone({ a: 1, b: { c: 3 } }))      // Expected: { a: 1, b: { c: 3 } }

// More edge cases
const original = { nested: { x: 1 } };
const cloned = deepClone(original);
cloned.nested.x = 999;
console.log(original.nested.x)                      // Expected: 1 (deep copy, no mutation leak)

const shared = { value: 42 };
const objWithShared = { left: shared, right: shared };
const clonedShared = deepClone(objWithShared);
console.log(clonedShared.left === clonedShared.right) // Expected: true (shared reference preserved)
console.log(clonedShared.left === shared)            // Expected: false (new cloned object)

const arrCircular = [1, 2];
arrCircular.push(arrCircular);
const arrCircularClone = deepClone(arrCircular);
console.log(arrCircularClone[2] === arrCircularClone) // Expected: true (array circular reference preserved)

const sparseArr = [];
sparseArr[2] = "x";
const sparseClone = deepClone(sparseArr);
console.log(0 in sparseClone, 2 in sparseClone)      // Expected: false true (sparse shape preserved)

const fn = () => 123;
console.log(deepClone(fn) === fn)                    // Expected: true (functions returned as-is)

const date = new Date("2024-01-01T00:00:00Z");
const dateClone = deepClone(date);
console.log(dateClone instanceof Date, dateClone.getTime && dateClone.getTime())
// Expected with current implementation: false undefined (Date not specially handled)

const regex = /abc/gi;
const regexClone = deepClone(regex);
console.log(regexClone instanceof RegExp, regexClone.source)
// Expected with current implementation: false undefined (RegExp not specially handled)