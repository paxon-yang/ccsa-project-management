import { createClient } from "@supabase/supabase-js";
import fs from "node:fs/promises";
import path from "node:path";

const argMap = new Map();
for (let i = 2; i < process.argv.length; i += 1) {
  const key = process.argv[i];
  const value = process.argv[i + 1];
  if (!key.startsWith("--")) continue;
  argMap.set(key.slice(2), value && !value.startsWith("--") ? value : "true");
}

const workspaceId = argMap.get("workspace") || process.env.WORKSPACE_ID || "tmm-main";
const outDir = path.resolve(argMap.get("outdir") || "exports");
const url = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceRoleKey) {
  console.error("Missing env: SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(url, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false }
});

const { data, error } = await supabase
  .from("workspaces")
  .select("id,payload,updated_at")
  .eq("id", workspaceId)
  .maybeSingle();

if (error) {
  console.error("Export failed:", error.message);
  process.exit(1);
}
if (!data) {
  console.error(`Workspace not found: ${workspaceId}`);
  process.exit(1);
}

const payload = data.payload ?? {};
const now = new Date();
const stamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}-${String(
  now.getHours()
).padStart(2, "0")}${String(now.getMinutes()).padStart(2, "0")}${String(now.getSeconds()).padStart(2, "0")}`;
const root = path.join(outDir, `${workspaceId}-${stamp}`);
await fs.mkdir(root, { recursive: true });

const writeJson = async (name, value) => {
  await fs.writeFile(path.join(root, name), JSON.stringify(value, null, 2), "utf8");
};

const escapeCsv = (value) => {
  const text = value == null ? "" : String(value);
  if (/[",\n]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
};

const toCsv = (rows, headers) => {
  const top = headers.join(",");
  const body = rows
    .map((row) => headers.map((header) => escapeCsv(row[header])).join(","))
    .join("\n");
  return `${top}\n${body}`;
};

await writeJson("workspace.json", data);
await writeJson("payload.json", payload);
await writeJson("projects.json", payload.projects ?? []);
await writeJson("tasks.json", payload.tasks ?? []);
await writeJson("auditLogs.json", payload.auditLogs ?? []);
await writeJson("projectPermissions.json", payload.projectPermissions ?? []);
await writeJson("revisions.json", payload.revisions ?? []);

const tasks = Array.isArray(payload.tasks) ? payload.tasks : [];
if (tasks.length > 0) {
  const taskHeaders = [
    "id",
    "projectId",
    "parentId",
    "category",
    "name",
    "owner",
    "status",
    "startDate",
    "endDate",
    "duration",
    "progress",
    "isMilestone",
    "order"
  ];
  await fs.writeFile(path.join(root, "tasks.csv"), toCsv(tasks, taskHeaders), "utf8");
}

const logs = Array.isArray(payload.auditLogs) ? payload.auditLogs : [];
if (logs.length > 0) {
  const logHeaders = ["id", "projectId", "taskId", "taskName", "field", "before", "after", "changedBy", "changedAt"];
  await fs.writeFile(path.join(root, "auditLogs.csv"), toCsv(logs, logHeaders), "utf8");
}

console.log(`Export done: ${root}`);
