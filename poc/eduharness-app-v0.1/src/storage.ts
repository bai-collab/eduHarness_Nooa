export type WorkspaceFile = {
  path: string;
  content: string;
  updatedAt: string;
};

export type WorkspaceBytes = {
  path: string;
  bytes: Uint8Array;
  updatedAt: string;
};

export interface StorageAdapter {
  initializeWorkspace(workspaceId: string): Promise<{ created: boolean }>;
  listFiles(workspaceId: string, prefix?: string): Promise<WorkspaceFile[]>;
  readFile(workspaceId: string, path: string): Promise<WorkspaceFile | null>;
  writeFile(workspaceId: string, path: string, content: string): Promise<WorkspaceFile>;
  readBytes(workspaceId: string, path: string): Promise<WorkspaceBytes | null>;
  writeBytes(workspaceId: string, path: string, bytes: Uint8Array): Promise<WorkspaceBytes>;
}

type StoredFile = {
  path: string;
  bytes: Uint8Array;
  updatedAt: string;
};

export function normalizePath(path: string): string {
  const trimmed = path.trim().replace(/^\/+/, "");
  if (!trimmed || trimmed.includes("..") || trimmed.includes("\\")) {
    throw new Error("INVALID_PATH");
  }
  return trimmed;
}

function asWorkspaceFile(file: StoredFile): WorkspaceFile {
  return {
    path: file.path,
    content: Buffer.from(file.bytes).toString("utf8"),
    updatedAt: file.updatedAt,
  };
}

function asWorkspaceBytes(file: StoredFile): WorkspaceBytes {
  return {
    path: file.path,
    bytes: new Uint8Array(file.bytes),
    updatedAt: file.updatedAt,
  };
}

export class InMemoryStorage implements StorageAdapter {
  private readonly workspaces = new Map<string, Map<string, StoredFile>>();

  async initializeWorkspace(workspaceId: string): Promise<{ created: boolean }> {
    if (this.workspaces.has(workspaceId)) return { created: false };

    const files = new Map<string, StoredFile>();
    const now = new Date().toISOString();
    const env = [
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
    ].join("\n");
    files.set("00_EDUHARNESS_ENV.yaml", {
      path: "00_EDUHARNESS_ENV.yaml",
      bytes: Buffer.from(env, "utf8"),
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
      .sort((a, b) => a.path.localeCompare(b.path))
      .map(asWorkspaceFile);
  }

  async readFile(workspaceId: string, path: string): Promise<WorkspaceFile | null> {
    const file = await this.readBytes(workspaceId, path);
    if (!file) return null;
    return {
      path: file.path,
      content: Buffer.from(file.bytes).toString("utf8"),
      updatedAt: file.updatedAt,
    };
  }

  async writeFile(workspaceId: string, path: string, content: string): Promise<WorkspaceFile> {
    const file = await this.writeBytes(workspaceId, path, Buffer.from(content, "utf8"));
    return {
      path: file.path,
      content,
      updatedAt: file.updatedAt,
    };
  }

  async readBytes(workspaceId: string, path: string): Promise<WorkspaceBytes | null> {
    const workspace = this.workspaces.get(workspaceId);
    if (!workspace) throw new Error("WORKSPACE_NOT_FOUND");
    const file = workspace.get(normalizePath(path));
    return file ? asWorkspaceBytes(file) : null;
  }

  async writeBytes(workspaceId: string, path: string, bytes: Uint8Array): Promise<WorkspaceBytes> {
    const workspace = this.workspaces.get(workspaceId);
    if (!workspace) throw new Error("WORKSPACE_NOT_FOUND");
    const normalized = normalizePath(path);
    const file: StoredFile = {
      path: normalized,
      bytes: new Uint8Array(bytes),
      updatedAt: new Date().toISOString(),
    };
    workspace.set(normalized, file);
    return asWorkspaceBytes(file);
  }
}
