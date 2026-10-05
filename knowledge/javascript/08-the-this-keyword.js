"use strict";

/*
 * The `this` keyword
 *
 * `this` is determined by how a regular function is called, not where it was
 * defined. The same function body can therefore receive different values.
 *
 * For regular (non-arrow) functions, the first applicable rule wins:
 * 1. New binding: `new Fn()` creates and supplies a new object.
 * 2. Explicit binding: `call`, `apply`, or `bind` supplies an object.
 * 3. Implicit binding: `object.method()` supplies the object left of the dot.
 * 4. Default binding: a standalone `fn()` call supplies `undefined` in strict
 *    mode, or `globalThis` in a sloppy script.
 *
 * ES modules and class bodies are always strict. Treat strict-mode default
 * binding as the normal modern-JavaScript answer.
 */
function whoAmI() {
  return this;
}

console.log(whoAmI()); // undefined (default binding in strict mode)

const user = {
  name: "Ada",
  greet() {
    return `Hi, ${this.name}`;
  },
};

console.log(user.greet()); // "Hi, Ada" (implicit binding)

function introduce(greeting) {
  return `${greeting}, ${this.name}`;
}

const person = { name: "Grace" };
console.log(introduce.call(person, "Hello")); // "Hello, Grace" (explicit)
console.log(introduce.bind(person)("Yo")); // "Yo, Grace" (explicit)

function Animal(kind) {
  this.kind = kind;
}

console.log(new Animal("dog").kind); // "dog" (new binding)

/*
 * Binding priority is observable:
 * - Constructor calls override a function's bound receiver.
 * - `call` overrides the receiver that an `object.method()` call would supply.
 */
function NamedThing(name) {
  this.name = name;
}

const boundThing = NamedThing.bind({ name: "bound object" });
console.log(new boundThing("from new").name); // "from new"

function showLabel() {
  return this.label;
}

const first = { label: "A", showLabel };
const second = { label: "B" };
console.log(first.showLabel()); // "A" (implicit)
console.log(first.showLabel.call(second)); // "B" (explicit beats implicit)

/*
 * A method gets `this` from the object used at the call site. Extracting it
 * removes the receiver, leaving a standalone call.
 */
const counter = {
  count: 0,
  increment() {
    this.count += 1;
  },
};

const detachedIncrement = counter.increment;
try {
  detachedIncrement();
} catch (error) {
  console.log(error.name); // "TypeError"
}

const boundIncrement = counter.increment.bind(counter);
boundIncrement();
console.log(counter.count); // 1

/*
 * An arrow has no own `this`. It permanently captures `this` from its
 * definition's lexical scope, so `call`, `apply`, and `bind` cannot change it.
 *
 * The arrow wrapper below does not itself provide `this`; it preserves the
 * later `counter.increment()` expression, which is still an implicit call.
 */
setTimeout(() => counter.increment(), 0);

const calculator = {
  value: 42,
  getValue: () => this.value,
};
console.log(calculator.getValue()); // undefined; never `calculator.value`

/*
 * Use regular functions for methods that need the receiver. Use arrows for
 * callbacks that should retain surrounding `this`, or wrap a method call so
 * the receiver remains present.
 */
const api = {
  base: "https://example.test",
  url(path) {
    return this.base + path;
  },
};

const { url } = api;
try {
  url("/users");
} catch (error) {
  console.log(error.name); // "TypeError"
}

const safeUrl = api.url.bind(api);
console.log(safeUrl("/users")); // "https://example.test/users"

/*
 * These all lose implicit binding:
 * - `const fn = object.method; fn()`
 * - `setTimeout(object.method, delay)`
 * - `const { method } = object; method()`
 *
 * Fix them with `object.method.bind(object)`, or with a wrapper such as
 * `setTimeout(() => object.method(), delay)`.
 *
 * With `addEventListener`, a regular listener receives the element as `this`
 * (the same value as `event.currentTarget`). An arrow listener ignores that
 * value and captures surrounding `this` instead.
 */

/*
 * Array callbacks are also standalone calls. The regular callback below sees
 * undefined; the arrow captures `this` from `buildArrow`, which was invoked
 * as a method of `list`. Passing `this` as map's second argument is another
 * valid fix for a regular callback.
 */
const list = {
  items: [1, 2, 3],
  prefix: "item-",
  build() {
    return this.items.map(function buildItem(number) {
      return (this ? this.prefix : "NO-THIS") + number;
    });
  },
  buildArrow() {
    return this.items.map((number) => this.prefix + number);
  },
};

console.log(list.build()); // ["NO-THIS1", "NO-THIS2", "NO-THIS3"]
console.log(list.buildArrow()); // ["item-1", "item-2", "item-3"]

/*
 * `bind` is permanent. Calling `bind`, `call`, or `apply` on an already-bound
 * function cannot replace its receiver. A constructor call still wins, as
 * demonstrated by `boundThing` above.
 */
function tag() {
  return this.tag;
}

const firstBoundTag = tag.bind({ tag: "first" });
console.log(firstBoundTag.bind({ tag: "second" })()); // "first"

/*
 * Class methods are strict and are not auto-bound. Passing one as a callback
 * detaches it. Bind it in the constructor, or use an arrow class field when
 * a stable per-instance callback is appropriate.
 */
class Button {
  clicks = 0;

  handle() {
    this.clicks += 1;
    return this.clicks;
  }
}

const button = new Button();
const handler = button.handle;
try {
  handler();
} catch (error) {
  console.log(error.name); // "TypeError"
}

class BoundButton {
  clicks = 0;

  handle = () => {
    this.clicks += 1;
    return this.clicks;
  };
}

const stableHandler = new BoundButton().handle;
console.log(stableHandler(), stableHandler()); // 1 2

/*
 * For nested calls, only the object immediately left of the final dot is the
 * implicit receiver.
 */
const outer = {
  name: "outer",
  inner: {
    name: "inner",
    who() {
      return this.name;
    },
  },
};

console.log(outer.inner.who()); // "inner"

/*
 * Quick-check answers:
 *
 * 1. Extracting `user.greet` makes `g()` a strict standalone call:
 *    user.greet() -> "Hi, Ada"
 *    user.greet.bind(user)() -> "Hi, Ada"
 *    g() -> TypeError
 *
 * 2. An arrow ignores `.call`; constructor binding overrides the bound object:
 *    arrow.call({ tag: "inner" }), new bound("fresh").name -> "outer fresh"
 *
 * 3. Resolution order:
 *    new -> explicit (call/apply/bind) -> implicit (object.method) -> default
 *
 * Interview recap:
 * - Ask "how was this function called?" before reasoning about `this`.
 * - A detached regular method loses its implicit receiver.
 * - Arrow functions capture lexical `this`; they should not be object methods
 *   that need their object as `this`.
 * - Strict mode turns accidental standalone calls into useful errors instead
 *   of silently mutating `globalThis`.
 */
