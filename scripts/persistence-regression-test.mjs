import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";
import ts from "typescript";

const __dirname = dirname(fileURLToPath(import.meta.url));
const sourcePath = resolve(__dirname, "../src/utils/persistence.ts");
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
      throw new Error(`Unexpected runtime import in persistence helper: ${specifier}`);
    }
  },
  { filename: sourcePath }
);

const {
  buildPersistedState,
  checksumForSnapshotData,
  chooseHydrationSource,
  getPersistedStateUpdatedTime,
  isPersistedSnapshotCurrent
} = module.exports;

const snapshot = (name) => ({
  projects: [{ id: "project-1", name }],
  tasks: [],
  activeProjectId: "project-1",
  projectPermissions: [],
  auditLogs: []
});

const revision = (createdAt, data = snapshot("Revision")) => ({
  id: `revision-${createdAt}`,
  projectId: "project-1",
  createdAt,
  createdBy: "test",
  trigger: "auto",
  checksum: checksumForSnapshotData(data),
  data
});

const localNewer = buildPersistedState(snapshot("Local"), [], "2026-05-07T08:00:00.000Z");
const remoteOlder = buildPersistedState(snapshot("Remote"), [], "2026-05-07T07:59:00.000Z");
assert.equal(chooseHydrationSource(localNewer, remoteOlder), "local", "newer local backup must win over stale cloud data");

const localOlder = buildPersistedState(snapshot("Local"), [], "2026-05-07T07:00:00.000Z");
const remoteNewer = buildPersistedState(snapshot("Remote"), [], "2026-05-07T08:00:00.000Z");
assert.equal(chooseHydrationSource(localOlder, remoteNewer), "remote", "newer cloud data should hydrate the app");

const localWithRevision = {
  ...snapshot("Local revision"),
  revisions: [revision("2026-05-07T08:00:00.000Z")]
};
const remoteWithoutMetadata = {
  ...snapshot("Old remote"),
  revisions: []
};
assert.equal(chooseHydrationSource(localWithRevision, remoteWithoutMetadata), "local", "revision timestamps protect older saved data");

assert.equal(chooseHydrationSource(snapshot("Fresh browser"), snapshot("Cloud first load")), "remote", "cloud should win when neither side has recency metadata");

assert.equal(
  getPersistedStateUpdatedTime({
    ...snapshot("Revision fallback"),
    revisions: [revision("2026-05-07T06:00:00.000Z"), revision("2026-05-07T09:00:00.000Z")]
  }),
  Date.parse("2026-05-07T09:00:00.000Z"),
  "latest revision timestamp should be used when updatedAt is missing"
);

const savedChecksum = checksumForSnapshotData(snapshot("Saved A"));
const latestChecksum = checksumForSnapshotData(snapshot("Edited B"));
assert.equal(
  isPersistedSnapshotCurrent(savedChecksum, latestChecksum, false, true),
  false,
  "an old in-flight save must not mark a newer edit as clean"
);
assert.equal(
  isPersistedSnapshotCurrent(latestChecksum, latestChecksum, true, false),
  false,
  "cloud failures should keep the save button dirty while local backup remains available"
);
assert.equal(
  isPersistedSnapshotCurrent(latestChecksum, latestChecksum, true, true),
  true,
  "matching latest checksum plus cloud success is clean"
);

console.log("persistence regression tests passed");
