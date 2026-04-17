import { Language, TaskItem } from "../types";
import { toDate, toISODate } from "./date";

export interface NotificationTaskRow {
  id: string;
  name: string;
  owner: string;
  startDate: string;
  endDate: string;
  status: TaskItem["status"];
}

export interface ProjectNotificationSummary {
  today: string;
  delayed: NotificationTaskRow[];
  upcoming: NotificationTaskRow[];
}

const stripHtml = (value: string): string => value.replace(/[&<>"]/g, (char) => {
  if (char === "&") return "&amp;";
  if (char === "<") return "&lt;";
  if (char === ">") return "&gt;";
  return "&quot;";
});

export const buildProjectNotificationSummary = (
  tasks: TaskItem[],
  projectId: string,
  upcomingWindowDays = 7
): ProjectNotificationSummary => {
  const todayDate = new Date();
  const today = toISODate(todayDate);
  const upcomingEnd = new Date(todayDate);
  upcomingEnd.setDate(upcomingEnd.getDate() + upcomingWindowDays);

  const inProject = tasks.filter((task) => task.projectId === projectId && !task.isCategoryPlaceholder);
  const mapped = inProject.map((task) => ({
    id: task.id,
    name: task.name,
    owner: task.owner || "",
    startDate: task.startDate,
    endDate: task.endDate,
    status: task.status
  }));

  const delayed = mapped
    .filter((task) => {
      if (task.status === "completed") return false;
      const overdue = toDate(task.endDate) < toDate(today);
      return task.status === "delayed" || overdue;
    })
    .sort((a, b) => a.endDate.localeCompare(b.endDate))
    .slice(0, 50);

  const upcoming = mapped
    .filter((task) => {
      if (task.status === "completed") return false;
      const start = toDate(task.startDate);
      return start >= toDate(today) && start <= upcomingEnd;
    })
    .sort((a, b) => a.startDate.localeCompare(b.startDate))
    .slice(0, 50);

  return {
    today,
    delayed,
    upcoming
  };
};

const statusLabel = (language: Language, status: TaskItem["status"]): string => {
  if (language === "zh") {
    if (status === "in_progress") return "进行中";
    if (status === "completed") return "已完成";
    if (status === "delayed") return "延期";
    return "未开始";
  }
  if (status === "in_progress") return "In Progress";
  if (status === "completed") return "Completed";
  if (status === "delayed") return "Delayed";
  return "Not Started";
};

export const buildSummaryEmailContent = (
  language: Language,
  projectName: string,
  summary: ProjectNotificationSummary
): { subject: string; text: string; html: string } => {
  const subject =
    language === "zh"
      ? `【${projectName}】任务提醒：延期 ${summary.delayed.length} / 即将开始 ${summary.upcoming.length}`
      : `[${projectName}] Task Alerts: ${summary.delayed.length} delayed / ${summary.upcoming.length} upcoming`;

  const delayedTitle = language === "zh" ? "延期/逾期任务" : "Delayed / Overdue";
  const upcomingTitle = language === "zh" ? "即将开始（7天）" : "Upcoming (7 days)";
  const unassigned = language === "zh" ? "未分配" : "Unassigned";
  const statusText = language === "zh" ? "状态" : "Status";
  const ownerText = language === "zh" ? "负责人" : "Owner";
  const startText = language === "zh" ? "开始" : "Start";
  const endText = language === "zh" ? "结束" : "End";

  const delayedLines = summary.delayed.length
    ? summary.delayed.map(
        (item, index) =>
          `${index + 1}. ${item.name} | ${ownerText}: ${item.owner || unassigned} | ${endText}: ${item.endDate} | ${statusText}: ${statusLabel(
            language,
            item.status
          )}`
      )
    : [language === "zh" ? "无" : "None"];

  const upcomingLines = summary.upcoming.length
    ? summary.upcoming.map(
        (item, index) =>
          `${index + 1}. ${item.name} | ${ownerText}: ${item.owner || unassigned} | ${startText}: ${item.startDate} | ${statusText}: ${statusLabel(
            language,
            item.status
          )}`
      )
    : [language === "zh" ? "无" : "None"];

  const text = [
    subject,
    "",
    `${language === "zh" ? "统计日期" : "Date"}: ${summary.today}`,
    "",
    `${delayedTitle}:`,
    ...delayedLines,
    "",
    `${upcomingTitle}:`,
    ...upcomingLines
  ].join("\n");

  const delayedHtmlRows = summary.delayed.length
    ? summary.delayed
        .map(
          (item) =>
            `<tr><td>${stripHtml(item.name)}</td><td>${stripHtml(item.owner || unassigned)}</td><td>${stripHtml(
              item.endDate
            )}</td><td>${stripHtml(statusLabel(language, item.status))}</td></tr>`
        )
        .join("")
    : `<tr><td colspan="4">${language === "zh" ? "无" : "None"}</td></tr>`;

  const upcomingHtmlRows = summary.upcoming.length
    ? summary.upcoming
        .map(
          (item) =>
            `<tr><td>${stripHtml(item.name)}</td><td>${stripHtml(item.owner || unassigned)}</td><td>${stripHtml(
              item.startDate
            )}</td><td>${stripHtml(statusLabel(language, item.status))}</td></tr>`
        )
        .join("")
    : `<tr><td colspan="4">${language === "zh" ? "无" : "None"}</td></tr>`;

  const html = `
    <div style="font-family: Arial, sans-serif; color: #1f2937;">
      <h2 style="margin: 0 0 8px;">${stripHtml(projectName)}</h2>
      <p style="margin: 0 0 16px;">${stripHtml(subject)}</p>
      <p style="margin: 0 0 12px;">${language === "zh" ? "统计日期" : "Date"}: ${stripHtml(summary.today)}</p>
      <h3 style="margin: 12px 0 8px;">${stripHtml(delayedTitle)}</h3>
      <table cellpadding="6" cellspacing="0" border="1" style="border-collapse: collapse; width: 100%; max-width: 860px;">
        <thead style="background: #f3f4f6;">
          <tr>
            <th align="left">${language === "zh" ? "任务" : "Task"}</th>
            <th align="left">${stripHtml(ownerText)}</th>
            <th align="left">${stripHtml(endText)}</th>
            <th align="left">${stripHtml(statusText)}</th>
          </tr>
        </thead>
        <tbody>${delayedHtmlRows}</tbody>
      </table>
      <h3 style="margin: 16px 0 8px;">${stripHtml(upcomingTitle)}</h3>
      <table cellpadding="6" cellspacing="0" border="1" style="border-collapse: collapse; width: 100%; max-width: 860px;">
        <thead style="background: #f3f4f6;">
          <tr>
            <th align="left">${language === "zh" ? "任务" : "Task"}</th>
            <th align="left">${stripHtml(ownerText)}</th>
            <th align="left">${stripHtml(startText)}</th>
            <th align="left">${stripHtml(statusText)}</th>
          </tr>
        </thead>
        <tbody>${upcomingHtmlRows}</tbody>
      </table>
    </div>
  `.trim();

  return { subject, text, html };
};

export const buildTestEmailContent = (
  language: Language,
  projectName: string
): { subject: string; text: string; html: string } => {
  const now = new Date().toISOString();
  const subject = language === "zh" ? `【${projectName}】邮件通道测试` : `[${projectName}] Email channel test`;
  const text =
    language === "zh"
      ? `这是一封测试邮件。\n项目：${projectName}\n发送时间(UTC)：${now}\n如果你收到此邮件，说明通知功能可用。`
      : `This is a test email.\nProject: ${projectName}\nSent at (UTC): ${now}\nIf you receive this, notifications are working.`;
  const html = `
    <div style="font-family: Arial, sans-serif; color: #1f2937;">
      <h2>${stripHtml(subject)}</h2>
      <p>${language === "zh" ? "这是一封测试邮件。" : "This is a test email."}</p>
      <p>${language === "zh" ? "项目" : "Project"}: <strong>${stripHtml(projectName)}</strong></p>
      <p>${language === "zh" ? "发送时间(UTC)" : "Sent at (UTC)"}: ${stripHtml(now)}</p>
    </div>
  `.trim();

  return { subject, text, html };
};
