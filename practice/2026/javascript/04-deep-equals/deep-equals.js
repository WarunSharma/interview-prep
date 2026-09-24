var detectType = function(type) {
    if (type === null) return "null";

    if (typeof type === "object") {
        const proto = Object.getPrototypeOf(type);
        return proto && proto.constructor ? proto.constructor.name.toLowerCase() : "object";
    }

    return typeof type;
};

var deepEquals = function (a, b, store = new WeakMap()) {
  if (a === b) return true;

  const [typeA, typeB] = [detectType(a), detectType(b)];
  if (typeA !== typeB) return false;

  if (typeA !== "object" && typeA !== "array") return false;

  if (store.has(a)) {
    return store.get(a) === b;
  }
  store.set(a, b);

  const keysA = Object.keys(a);
  const keysB = Object.keys(b);

  if (keysA.length !== keysB.length) return false;

  for (const key of keysA) {
    if (!Object.prototype.hasOwnProperty.call(b, key)) return false;
    if (!deepEquals(a[key], b[key], store)) return false;
  }

  return true;
}

// --- Examples ---
// Uncomment to test your implementation:

console.log(deepEquals(1, 1))                          // Expected: true
console.log(deepEquals('hello', 'hello'))               // Expected: true
console.log(deepEquals(null, undefined))                // Expected: false
console.log(deepEquals([1, 2, 3], [1, 2, 3]))          // Expected: true
console.log(deepEquals({ a: 1, b: 2 }, { b: 2, a: 1 })) // Expected: true
console.log(deepEquals({ a: 1 }, { a: 2 }))            // Expected: false

const a = { value: 1 }; a.self = a
const b = { value: 1 }; b.self = b
console.log(deepEquals(a, b))                           // Expected: true (circular)

// Additional test cases
console.log(deepEquals(true, false))                    // Expected: false
console.log(deepEquals(undefined, undefined))           // Expected: true
console.log(deepEquals(NaN, NaN))                       // Expected: false (with current implementation)

console.log(deepEquals([1, 2], [2, 1]))                // Expected: false (order matters)
console.log(deepEquals([], []))                         // Expected: true

console.log(deepEquals({ a: 1, b: { c: 3 } }, { a: 1, b: { c: 3 } })) // Expected: true
console.log(deepEquals({ a: 1, b: { c: 3 } }, { a: 1, b: { c: 4 } })) // Expected: false
console.log(deepEquals({ a: 1 }, { a: 1, b: 2 }))      // Expected: false

const f1 = () => 1;
const f2 = () => 1;
console.log(deepEquals(f1, f1))                         // Expected: true (same reference)
console.log(deepEquals(f1, f2))                         // Expected: false (different references)

const c1 = { x: { y: 1 } };
c1.self = c1;
const c2 = { x: { y: 1 } };
c2.self = c2;
console.log(deepEquals(c1, c2))                         // Expected: true (nested circular)

// More edge cases
console.log(deepEquals([{ a: 1 }], [{ a: 1 }]))        // Expected: true
console.log(deepEquals([{ a: 1 }], [{ a: 2 }]))        // Expected: false

console.log(deepEquals({ a: undefined }, {}))          // Expected: false (missing vs undefined key)
console.log(deepEquals({ a: undefined }, { a: undefined })) // Expected: true

console.log(deepEquals(new Date("2024-01-01"), new Date("2024-01-01"))) // Expected: false (current implementation)
console.log(deepEquals(/abc/i, /abc/i))                // Expected: false (current implementation)

const sparse1 = [];
sparse1[1] = 10;
const sparse2 = [undefined, 10];
console.log(deepEquals(sparse1, sparse2))              // Expected: false (sparse vs explicit undefined)

const d1 = { value: 1 };
d1.self = d1;
const d2 = { value: 1 };
d2.self = { value: 1 };
console.log(deepEquals(d1, d2))                        // Expected: false (different circular structure)