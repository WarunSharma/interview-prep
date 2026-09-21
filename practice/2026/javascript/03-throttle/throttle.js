/* Throttle has a static cooldown period where the function cannot be executed,
 * while debounce delays the function every time it's executed
 */

var throttle = function (fn, delay, label = "throttle") {
  let lastTime = 0;

  return function (...args) {
    const now = Date.now();
    const elapsed = now - lastTime;

    console.log(
      `[${label}] called at ${now} | elapsed=${elapsed}ms | delay=${delay}ms | args=`,
      args
    );

    if (elapsed > delay) {
      lastTime = now;
      console.log(`[${label}] ✅ executing`);
      fn.apply(this, args);
    } else {
      console.log(`[${label}] ⏭️ skipped (still in cooldown)`);
    }
  };
};

// Scenario 1: Immediate call, blocked call, then allowed call
console.log("\n--- Scenario 1: basic throttle behavior ---");
const scenario1 = throttle(
  (msg) => console.log(`[S1 handler] ${msg}`),
  3000,
  "S1"
);

scenario1("first call (should run immediately)");
setTimeout(() => scenario1("second call at +1s (should be skipped)"), 1000);
setTimeout(() => scenario1("third call at +3.1s (should run)"), 3100);

// Scenario 2: Rapid interval spam
console.log("\n--- Scenario 2: rapid interval calls ---");
const scenario2 = throttle(
  () => console.log("[S2 handler] executed"),
  2000,
  "S2"
);

let tick = 0;
const intervalId = setInterval(() => {
  tick += 1;
  console.log(`[S2] interval tick #${tick}`);
  scenario2();
}, 500);

setTimeout(() => {
  clearInterval(intervalId);
  console.log("[S2] interval stopped");
}, 5500);

// Scenario 3: Context + args
console.log("\n--- Scenario 3: context and argument forwarding ---");
const obj = {
  name: "ThrottleObject",
  run: throttle(
    function (action, step) {
      console.log(`[S3 handler] this.name=${this.name}, action=${action}, step=${step}`);
    },
    1500,
    "S3"
  ),
};

obj.run("start", 1);
setTimeout(() => obj.run("mid", 2), 400);
setTimeout(() => obj.run("end", 3), 1700);