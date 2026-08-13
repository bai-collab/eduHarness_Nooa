import { createHash } from "node:crypto";
import type { StorageAdapter } from "./storage.js";

export type CanonicalArtifact = {
  repository: string;
  path: string;
  ref: string;
  sourceIdentity: string;
  bytes: Uint8Array;
  byteLength: number;
  sha256: string;
};

export type TransferEvidence = {
  destinationPath: string;
  sourceIdentity: string;
  sourceSha256: string;
  destinationSha256: string;
  byteLength: number;
  verified: true;
};

type FetchLike = typeof fetch;

export function sha256(bytes: Uint8Array): string {
  return createHash("sha256").update(bytes).digest("hex");
}

function encodeGitHubPath(path: string): string {
  return path
    .split("/")
    .filter(Boolean)
    .map((segment) => encodeURIComponent(segment))
    .join("/");
}

export async function fetchGitHubArtifact(
  input: { repository: string; path: string; ref?: string; token?: string },
  fetchImpl: FetchLike = fetch,
): Promise<CanonicalArtifact> {
  const ref = input.ref ?? "main";
  const url = `https://api.github.com/repos/${input.repository}/contents/${encodeGitHubPath(input.path)}?ref=${encodeURIComponent(ref)}`;
  const headers: Record<string, string> = {
    accept: "application/vnd.github+json",
    "x-github-api-version": "2022-11-28",
    "user-agent": "eduharness-artifact-transfer-poc",
  };
  if (input.token) headers.authorization = `Bearer ${input.token}`;

  const response = await fetchImpl(url, { headers });
  if (!response.ok) {
    throw new Error(`SOURCE_UNAVAILABLE: GitHub returned ${response.status}`);
  }

  const body = (await response.json()) as {
    type?: string;
    sha?: string;
    encoding?: string;
    content?: string;
  };
  if (body.type !== "file" || !body.sha || body.encoding !== "base64" || typeof body.content !== "string") {
    throw new Error("SOURCE_UNAVAILABLE: GitHub file bytes unavailable");
  }

  const bytes = Buffer.from(body.content.replace(/\s/g, ""), "base64");
  return {
    repository: input.repository,
    path: input.path,
    ref,
    sourceIdentity: `github:blob:${body.sha}`,
    bytes,
    byteLength: bytes.byteLength,
    sha256: sha256(bytes),
  };
}

export async function transferCanonicalArtifact(
  storage: StorageAdapter,
  input: {
    workspaceId: string;
    destinationPath: string;
    artifact: CanonicalArtifact;
  },
): Promise<TransferEvidence> {
  await storage.writeBytes(input.workspaceId, input.destinationPath, input.artifact.bytes);
  const readBack = await storage.readBytes(input.workspaceId, input.destinationPath);
  if (!readBack) {
    throw new Error("SAVE_UNVERIFIED: destination read-back missing");
  }

  const destinationSha256 = sha256(readBack.bytes);
  if (
    readBack.bytes.byteLength !== input.artifact.byteLength ||
    destinationSha256 !== input.artifact.sha256
  ) {
    throw new Error("SAVE_UNVERIFIED: canonical equivalence mismatch");
  }

  return {
    destinationPath: readBack.path,
    sourceIdentity: input.artifact.sourceIdentity,
    sourceSha256: input.artifact.sha256,
    destinationSha256,
    byteLength: readBack.bytes.byteLength,
    verified: true,
  };
}
