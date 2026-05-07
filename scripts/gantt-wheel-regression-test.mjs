import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";
import ts from "typescript";

const __dirname = dirname(fileURLToPath(import.meta.url));
const sourcePath = resolve(__dirname, "../src/utils/ganttWheel.ts");
const source = readFileSync(sourcePath, "utf8");
const transpiled = ts.transpileModule(source, {
  fileName: sourcePath,
  compilerOptions: {
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2020
  }
}).outputText;

const module = { exports: {} };
vm.runInNewContext(
  transpiled,
  {
    module,
    exports: module.exports,
    require: (specifier) => {
      throw new Error(`Unexpected runtime import in gantt wheel helper: ${specifier}`);
    }
  },
  { filename: sourcePath }
);

const { shouldNormalizeGanttWheel } = module.exports;

assert.equal(
  shouldNormalizeGanttWheel({ deltaX: 3, deltaY: 30 }),
  true,
  "vertical touchpad scroll with horizontal noise should be normalized"
);
assert.equal(
  shouldNormalizeGanttWheel({ deltaX: 0, deltaY: 30 }),
  false,
  "mouse wheel-style vertical scrolling should be left untouched"
);
assert.equal(
  shouldNormalizeGanttWheel({ deltaX: 40, deltaY: 10 }),
  false,
  "intentional horizontal swipes should remain horizontal"
);
assert.equal(
  shouldNormalizeGanttWheel({ deltaX: 30, deltaY: 32 }),
  false,
  "near-diagonal touchpad gestures should not be rewritten"
);
assert.equal(
  shouldNormalizeGanttWheel({ deltaX: 3, deltaY: 30, shiftKey: true }),
  false,
  "shift wheel gestures should keep the library horizontal-scroll behavior"
);
assert.equal(
  shouldNormalizeGanttWheel({ deltaX: 3, deltaY: 30, ctrlKey: true }),
  false,
  "ctrl wheel gestures should not be rewritten"
);

console.log("gantt wheel regression tests passed");
