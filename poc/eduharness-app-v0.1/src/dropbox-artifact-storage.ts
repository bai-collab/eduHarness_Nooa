import type { ArtifactBytes, ArtifactStorageAdapter } from "./artifact-transfer.js";
import { normalizePath } from "./storage.js";

type FetchLike = typeof fetch;

type DropboxMetadata = {
  id?: string;
  rev?: string;
  path_display?: string;
  path_lower?: string;
  size?: number;
};

function normalizeRoot(rootPath: string): string {
  const trimmed = rootPath.trim();
  if (!trimmed.startsWith("/")) throw new Error("INVALID_DROPBOX_ROOT");
  return trimmed.replace(/\/+$/, "");
}

function validateWorkspaceId(workspaceId: string): string {
  if (!/^[a-zA-Z0-9_-]{3,80}$/.test(workspaceId)) {
    throw new Error("INVALID_WORKSPACE_ID");
  }
  return workspaceId;
}

function parseDropboxMetadata(response: Response): DropboxMetadata {
  const encoded = response.headers.get("dropbox-api-result");
  if (!encoded) return {};
  try {
    return JSON.parse(encoded) as DropboxMetadata;
  } catch {
    throw new Error("SAVE_UNVERIFIED: invalid Dropbox metadata header");
  }
}

export class DropboxArtifactStorage implements ArtifactStorageAdapter {
  constructor(
    private readonly accessToken: string,
    private readonly rootPath: string,
    private readonly fetchImpl: FetchLike = fetch,
  ) {
    if (!accessToken.trim()) throw new Error("DROPBOX_ACCESS_TOKEN_REQUIRED");
    this.rootPath = normalizeRoot(rootPath);
  }

  private absolutePath(workspaceId: string, path: string): string {
    const workspace = validateWorkspaceId(workspaceId);
    const relative = normalizePath(path);
    return `${this.rootPath}/${workspace}/${relative}`;
  }

  async writeBytes(workspaceId: string, path: string, bytes: Uint8Array): Promise<ArtifactBytes> {
    const destination = this.absolutePath(workspaceId, path);
    const response = await this.fetchImpl("https://content.dropboxapi.com/2/files/upload", {
      method: "POST",
      headers: {
        authorization: `Bearer ${this.accessToken}`,
        "content-type": "application/octet-stream",
        "dropbox-api-arg": JSON.stringify({
          path: destination,
          mode: "overwrite",
          autorename: false,
          mute: true,
          strict_conflict: false,
        }),
      },
      body: Buffer.from(bytes),
    });

    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      throw new Error(`SAVE_FAILED: Dropbox upload ${response.status}${detail ? ` ${detail}` : ""}`);
    }

    const metadata = (await response.json()) as DropboxMetadata;
    return {
      path: metadata.path_display ?? destination,
      bytes: new Uint8Array(bytes),
      providerIdentity: metadata.id,
      revision: metadata.rev,
    };
  }

  async readBytes(workspaceId: string, path: string): Promise<ArtifactBytes | null> {
    const destination = this.absolutePath(workspaceId, path);
    const response = await this.fetchImpl("https://content.dropboxapi.com/2/files/download", {
      method: "POST",
      headers: {
        authorization: `Bearer ${this.accessToken}`,
        "dropbox-api-arg": JSON.stringify({ path: destination }),
      },
    });

    if (response.status === 409) return null;
    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      throw new Error(`SAVE_UNVERIFIED: Dropbox download ${response.status}${detail ? ` ${detail}` : ""}`);
    }

    const metadata = parseDropboxMetadata(response);
    const bytes = new Uint8Array(await response.arrayBuffer());
    if (typeof metadata.size === "number" && metadata.size !== bytes.byteLength) {
      throw new Error("SAVE_UNVERIFIED: Dropbox metadata size mismatch");
    }

    return {
      path: metadata.path_display ?? destination,
      bytes,
      providerIdentity: metadata.id,
      revision: metadata.rev,
    };
  }
}
