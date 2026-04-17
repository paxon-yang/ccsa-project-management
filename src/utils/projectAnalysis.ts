import { TaskItem } from "../types";
import { toDate } from "./date";

export interface CriticalPathResult {
  taskIds: string[];
  totalDurationDays: number;
  cycleDetected: boolean;
}

const taskDuration = (task: TaskItem): number => {
  const raw = Number(task.duration);
  if (Number.isFinite(raw) && raw > 0) return Math.round(raw);
  const oneDay = 24 * 60 * 60 * 1000;
  const span = Math.round((toDate(task.endDate).getTime() - toDate(task.startDate).getTime()) / oneDay) + 1;
  return Math.max(1, span);
};

export const isDelayedOrOverdue = (task: TaskItem, todayISO: string): boolean => {
  if (task.status === "completed") return false;
  if (task.status === "delayed") return true;
  return toDate(task.endDate) < toDate(todayISO);
};

export const computeCriticalPath = (tasks: TaskItem[], projectId: string): CriticalPathResult => {
  const projectTasks = tasks.filter((task) => task.projectId === projectId && !task.isCategoryPlaceholder);
  if (projectTasks.length === 0) {
    return { taskIds: [], totalDurationDays: 0, cycleDetected: false };
  }

  const byId = new Map(projectTasks.map((task) => [task.id, task]));
  const dependencies = new Map<string, string[]>();
  const dependents = new Map<string, string[]>();
  const indegree = new Map<string, number>();

  projectTasks.forEach((task) => {
    const validDeps = (task.dependencyIds ?? []).filter((depId) => depId !== task.id && byId.has(depId));
    dependencies.set(task.id, validDeps);
    indegree.set(task.id, validDeps.length);
    if (!dependents.has(task.id)) dependents.set(task.id, []);
  });

  dependencies.forEach((deps, taskId) => {
    deps.forEach((depId) => {
      const list = dependents.get(depId) ?? [];
      list.push(taskId);
      dependents.set(depId, list);
    });
  });

  const queue: string[] = projectTasks
    .filter((task) => (indegree.get(task.id) ?? 0) === 0)
    .sort((a, b) => a.order - b.order)
    .map((task) => task.id);

  const topo: string[] = [];
  const bestDistance = new Map<string, number>();
  const previous = new Map<string, string | undefined>();

  queue.forEach((id) => {
    const task = byId.get(id);
    if (!task) return;
    bestDistance.set(id, taskDuration(task));
    previous.set(id, undefined);
  });

  while (queue.length > 0) {
    const currentId = queue.shift();
    if (!currentId) break;
    topo.push(currentId);

    const currentDist = bestDistance.get(currentId) ?? 0;
    const children = dependents.get(currentId) ?? [];
    children.forEach((childId) => {
      const childTask = byId.get(childId);
      if (!childTask) return;
      const candidate = currentDist + taskDuration(childTask);
      if (candidate > (bestDistance.get(childId) ?? 0)) {
        bestDistance.set(childId, candidate);
        previous.set(childId, currentId);
      }

      const nextIn = (indegree.get(childId) ?? 0) - 1;
      indegree.set(childId, nextIn);
      if (nextIn === 0) {
        if (!bestDistance.has(childId)) {
          bestDistance.set(childId, taskDuration(childTask));
          previous.set(childId, undefined);
        }
        queue.push(childId);
      }
    });
  }

  if (topo.length < projectTasks.length) {
    return { taskIds: [], totalDurationDays: 0, cycleDetected: true };
  }

  let endTaskId = topo[0];
  let maxDistance = bestDistance.get(endTaskId) ?? 0;
  topo.forEach((taskId) => {
    const dist = bestDistance.get(taskId) ?? 0;
    if (dist > maxDistance) {
      maxDistance = dist;
      endTaskId = taskId;
    }
  });

  if (!endTaskId) return { taskIds: [], totalDurationDays: 0, cycleDetected: false };

  const path: string[] = [];
  let cursor: string | undefined = endTaskId;
  while (cursor) {
    path.push(cursor);
    cursor = previous.get(cursor);
  }
  path.reverse();

  return {
    taskIds: path,
    totalDurationDays: maxDistance,
    cycleDetected: false
  };
};
