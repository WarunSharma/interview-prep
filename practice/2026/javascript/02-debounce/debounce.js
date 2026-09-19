// Debounce notes (quick recall):
// 1) Debounce = run function only after calls stop for `delay` ms.
// 2) Every new call clears old timer and starts a new one.
// 3) Result: only the LAST call executes (trailing behavior).
// 4) `args` = parameters passed to function.
// 5) `context` = `this` value; needed when original function uses `this`.
// 6) `fn.apply(context, args)` preserves both `this` and arguments.

var debounce = function(fn, delay) {
    let timerId;
    return function(...args) {
        if (timerId) clearTimeout(timerId);

        let context = this;
        timerId = setTimeout(() => {
            fn.apply(context, args);
        }, delay);
    };
};

// ---------- Test 1: Basic (only last call should run) ----------
function log(name) {
    console.log("[Test1]", "Hi " + name);
}
const debouncedFunction = debounce(log, 1000);
debouncedFunction("Warun Sharma");
debouncedFunction("Ankit Sharma"); // expected after 1s: [Test1] Hi Ankit Sharma

// ---------- Test 2: Multiple rapid calls ----------
const rapid = debounce((value) => {
    console.log("[Test2] Final value:", value);
}, 500);

rapid(1);
rapid(2);
rapid(3);
rapid(4); // expected after 500ms: [Test2] Final value: 4

// ---------- Test 3: Calls spaced beyond delay (both should run) ----------
const spaced = debounce((msg) => {
    console.log("[Test3]", msg);
}, 400);

spaced("first");
setTimeout(() => spaced("second"), 700); 
// expected:
// ~400ms -> [Test3] first
// ~1100ms -> [Test3] second

// ---------- Test 4: Preserve `this` context ----------
const counter = {
    value: 0,
    inc(step) {
        this.value += step;
        console.log("[Test4] counter value:", this.value);
    }
};

counter.debouncedInc = debounce(counter.inc, 300);
counter.debouncedInc(1);
counter.debouncedInc(5); // expected after 300ms: [Test4] counter value: 5

// ---------- Test 5: No args ----------
const ping = debounce(() => {
    console.log("[Test5] ping");
}, 200);

ping();
ping(); // expected once: [Test5] ping

// ---------- Test 6: Different delays ----------
const shortDelay = debounce((x) => {
    console.log("[Test6-short]", x);
}, 100);

const longDelay = debounce((x) => {
    console.log("[Test6-long]", x);
}, 800);

shortDelay("A1");
shortDelay("A2"); // expected quickly: A2
longDelay("B1");
longDelay("B2"); // expected later: B2