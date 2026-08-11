export type WorkspaceFile = {
  path: string;
  content: string;
  updatedAt: string;
};

export interface StorageAdapter {
  initializeWorkspace(workspaceId: string): Promise<{ created: boolean }>;
  listFiles(workspaceId: string, prefix?: string): Promise<WorkspaceFile[]>;
  readFile(workspaceId: string, path: string): Promise<WorkspaceFile | null>;
  writeFile(workspaceId: string, path: string, content: string): Promise<WorkspaceFile>;
}

function normalizePath(path: string): string {
  const trimmed = path.trim().replace(/^\/+/, "");
  if (!trimmed || trimmed.includes("..") || trimmed.includes("\\")) {
    throw new Error("INVALID_PATH");
  }
  return trimmed;
}

export class InMemoryStorage implements StorageAdapter {
  private readonly workspaces = new Map<string, Map<string, WorkspaceFile>>();

  async initializeWorkspace(workspaceId: string): Promise<{ created: boolean }> {
    if (this.workspaces.has(workspaceId)) return { created: false };

    const files = new Map<string, WorkspaceFile>();
    const now = new Date().toISOString();
    files.set("00_EDUHARNESS_ENV.yaml", {
      path: "00_EDUHARNESS_ENV.yaml",
      content: [
        "schema_version: 1",
        'env_kind: "eduHarness-cloud"',
        "installation:",
        '  edition: "cloud"',
        "workspace:",
        '  provider: "eduharness-app"',
        `  workspace_id: "${workspaceId}"`,
        '  registry: "00_ADMIN/00_EDU_SKILL_REGISTRY.yaml"',
        '  brain_index: "00_ADMIN/01_BRAIN_INDEX.yaml"',
        '  skills: "00_ADMIN/SKILLS"',
        "",
      ].join("\n"),
      updatedAt: now,
    });
    this.workspaces.set(workspaceId, files);
    return { created: true };
  }

  async listFiles(workspaceId: string, prefix = ""): Promise<WorkspaceFile[]> {
    const workspace = this.workspaces.get(workspaceId);
    if (!workspace) throw new Error("WORKSPACE_NOT_FOUND");
    const normalizedPrefix = prefix.trim().replace(/^\/+/, "");
    return [...workspace.values()]
      .filter((file) => !normalizedPrefix || file.path.startsWith(normalizedPrefix))
      .sort((a, b) => a.path.localeCompare(b.path));
  }

  async readFile(workspaceId: string, path: string): Promise<WorkspaceFile | null> {
    const workspace = this.workspaces.get(workspaceId);
    if (!workspace) throw new Error("WORKSPACE_NOT_FOUND");
    return workspace.get(normalizePath(path)) ?? null;
  }

  async writeFile(workspaceId: string, path: string, content: string): Promise<WorkspaceFile> {
    const workspace = this.workspaces.get(workspaceId);
    if (!workspace) throw new Error("WORKSPACE_NOT_FOUND");
    const normalized = normalizePath(path);
    const file: WorkspaceFile = {
      path: normalized,
      content,
      updatedAt: new Date().toISOString(),
    };
    workspace.set(normalized, file);
    return file;
  }
}
