import { TaskItem } from "../types";
import { toDate } from "./date";

export const isEndBeforeStart = (startDate: string, endDate: string): boolean => toDate(endDate) < toDate(startDate);

export const normalizeDependencyIds = (
  taskId: string,
  projectId: string,
  dependencyIds: string[] | undefined,
  tasks: TaskItem[]
): string[] => {
  const allowed = new Set(tasks.filter((task) => task.projectId === projectId).map((task) => task.id));
  const next = Array.isArray(dependencyIds) ? dependencyIds : [];
  return [...new Set(next)].filter((id) => id !== taskId && allowed.has(id));
};

export const hasDependencyCycle = (tasks: TaskItem[], projectId: string): boolean => {
  const projectTasks = tasks.filter((task) => task.projectId === projectId);
  const adjacency = new Map<string, string[]>();
  const taskIdSet = new Set(projectTasks.map((task) => task.id));

  projectTasks.forEach((task) => {
    adjacency.set(task.id, (task.dependencyIds ?? []).filter((id) => taskIdSet.has(id)));
  });

  const visiting = new Set<string>();
  const visited = new Set<string>();

  const dfs = (id: string): boolean => {
    if (visiting.has(id)) return true;
    if (visited.has(id)) return false;
    visiting.add(id);
    const next = adjacency.get(id) ?? [];
    for (const depId of next) {
      if (dfs(depId)) return true;
    }
    visiting.delete(id);
    visited.add(id);
    return false;
  };

  for (const task of projectTasks) {
    if (dfs(task.id)) return true;
  }
  return false;
};
