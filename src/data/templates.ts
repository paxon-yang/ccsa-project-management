import { TaskItem } from "../types";

export interface ProjectTemplateTask {
  key: string;
  category: string;
  name: string;
  offsetDays: number;
  durationDays: number;
  owner: string;
  priority: TaskItem["priority"];
  status: TaskItem["status"];
  isMilestone?: boolean;
  dependencyKeys?: string[];
}

export interface ProjectTemplate {
  id: string;
  title: string;
  description: string;
  tasks: ProjectTemplateTask[];
}

export const PROJECT_TEMPLATES: ProjectTemplate[] = [
  {
    id: "mine-standard",
    title: "矿山施工标准包 / Mining Standard Pack",
    description: "适合当前矿山工程场景：准备、施工、调试、验收。",
    tasks: [
      {
        key: "kickoff",
        category: "0. 项目启动 / Kickoff",
        name: "项目启动会 / Project Kickoff",
        offsetDays: 0,
        durationDays: 1,
        owner: "项目办",
        priority: "high",
        status: "not_started",
        isMilestone: true
      },
      {
        key: "design",
        category: "1. 设计与审批 / Design",
        name: "设计方案确认 / Design Signoff",
        offsetDays: 1,
        durationDays: 7,
        owner: "设计组",
        priority: "high",
        status: "not_started",
        dependencyKeys: ["kickoff"]
      },
      {
        key: "procurement",
        category: "2. 采购与到货 / Procurement",
        name: "关键设备采购 / Core Procurement",
        offsetDays: 5,
        durationDays: 20,
        owner: "采购组",
        priority: "high",
        status: "not_started",
        dependencyKeys: ["design"]
      },
      {
        key: "construction",
        category: "3. 施工 / Construction",
        name: "现场施工推进 / Site Construction",
        offsetDays: 12,
        durationDays: 30,
        owner: "施工组",
        priority: "high",
        status: "not_started",
        dependencyKeys: ["design"]
      },
      {
        key: "commission",
        category: "4. 调试 / Commissioning",
        name: "系统联调 / System Commissioning",
        offsetDays: 42,
        durationDays: 10,
        owner: "调试组",
        priority: "medium",
        status: "not_started",
        dependencyKeys: ["procurement", "construction"]
      },
      {
        key: "acceptance",
        category: "5. 验收 / Acceptance",
        name: "项目验收里程碑 / Acceptance Milestone",
        offsetDays: 53,
        durationDays: 1,
        owner: "项目办",
        priority: "high",
        status: "not_started",
        isMilestone: true,
        dependencyKeys: ["commission"]
      }
    ]
  },
  {
    id: "infra-light",
    title: "通用基建轻量包 / Infra Lite Pack",
    description: "适合短周期内部工程：需求、实施、验收。",
    tasks: [
      {
        key: "req",
        category: "1. 需求 / Requirement",
        name: "需求冻结 / Requirement Freeze",
        offsetDays: 0,
        durationDays: 3,
        owner: "项目办",
        priority: "high",
        status: "not_started"
      },
      {
        key: "exec",
        category: "2. 实施 / Execution",
        name: "实施与测试 / Execution & Test",
        offsetDays: 3,
        durationDays: 14,
        owner: "执行组",
        priority: "medium",
        status: "not_started",
        dependencyKeys: ["req"]
      },
      {
        key: "go-live",
        category: "3. 上线 / Go Live",
        name: "上线里程碑 / Go-Live Milestone",
        offsetDays: 17,
        durationDays: 1,
        owner: "项目办",
        priority: "high",
        status: "not_started",
        isMilestone: true,
        dependencyKeys: ["exec"]
      }
    ]
  }
];
