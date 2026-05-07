import type { PersistedState, WorkspaceRevisionItem, WorkspaceSnapshotData } from "../types";

export type HydrationSource = "local" | "remote";

const toTime = (value: string | undefined): number | undefined => {
  if (!value) return undefined;
  const time = new Date(value).getTime();
  return Number.isNaN(time) ? undefined : time;
};

export const checksumForSnapshotData = (data: WorkspaceSnapshotData): string => JSON.stringify(data);

export const buildPersistedState = (
  data: WorkspaceSnapshotData,
  revisions: WorkspaceRevisionItem[],
  updatedAt: string
): PersistedState => ({
  ...data,
  revisions,
  updatedAt
});

export const getPersistedStateUpdatedTime = (state: PersistedState | undefined): number | undefined => {
  if (!state) return undefined;
  const times = [
    toTime(state.updatedAt),
    ...(state.revisions ?? []).map((revision) => toTime(revision.createdAt))
  ].filter((time): time is number => typeof time === "number");

  if (times.length === 0) return undefined;
  return Math.max(...times);
};

export const chooseHydrationSource = (
  localState: PersistedState | undefined,
  remoteState: PersistedState | undefined
): HydrationSource => {
  if (!remoteState) return "local";
  if (!localState) return "remote";

  const localTime = getPersistedStateUpdatedTime(localState);
  const remoteTime = getPersistedStateUpdatedTime(remoteState);

  if (localTime === undefined && remoteTime === undefined) return "remote";
  if (localTime === undefined) return "remote";
  if (remoteTime === undefined) return "local";
  return remoteTime >= localTime ? "remote" : "local";
};

export const isPersistedSnapshotCurrent = (
  savedChecksum: string,
  latestChecksum: string,
  remoteEnabled: boolean,
  remoteSaved: boolean
): boolean => (!remoteEnabled || remoteSaved) && savedChecksum === latestChecksum;
