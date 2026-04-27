import { DRIVE_API, DRIVE_UPLOAD_API } from '../constants/config'

const FOLDER_MIME = 'application/vnd.google-apps.folder'
const JSON_MIME = 'application/json'

export class AuthExpiredError extends Error {
  constructor() {
    super('Google session expired. Please sign in again.')
    this.name = 'AuthExpiredError'
  }
}

async function driveRequest<T>(
  url: string,
  options: RequestInit,
  accessToken: string
): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      ...options.headers,
    },
  })
  if (res.status === 401 || res.status === 403) throw new AuthExpiredError()
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Drive API ${res.status}: ${body}`)
  }
  return res.json() as Promise<T>
}

export async function findOrCreateAppFolder(
  accessToken: string,
  folderName: string
): Promise<string> {
  const query = `name='${folderName}' and mimeType='${FOLDER_MIME}' and trashed=false`
  const data = await driveRequest<{ files: Array<{ id: string }> }>(
    `${DRIVE_API}/files?q=${encodeURIComponent(query)}&fields=files(id)`,
    { method: 'GET' },
    accessToken
  )

  if (data.files.length > 0) return data.files[0].id

  const folder = await driveRequest<{ id: string }>(
    `${DRIVE_API}/files`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: folderName, mimeType: FOLDER_MIME }),
    },
    accessToken
  )
  return folder.id
}

export async function findFile(
  folderId: string,
  fileName: string,
  accessToken: string
): Promise<{ id: string; modifiedTime: string } | null> {
  const query = `name='${fileName}' and '${folderId}' in parents and trashed=false`
  const data = await driveRequest<{ files: Array<{ id: string; modifiedTime: string }> }>(
    `${DRIVE_API}/files?q=${encodeURIComponent(query)}&fields=files(id,modifiedTime)`,
    { method: 'GET' },
    accessToken
  )
  return data.files[0] ?? null
}

export async function readFileContent<T>(fileId: string, accessToken: string): Promise<T> {
  const res = await fetch(`${DRIVE_API}/files/${fileId}?alt=media`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  if (!res.ok) throw new Error(`Read file failed: ${res.status}`)
  return res.json() as Promise<T>
}

export async function writeJsonFile(
  folderId: string,
  fileId: string | null,
  fileName: string,
  data: unknown,
  accessToken: string
): Promise<string> {
  const boundary = `boundary_${Date.now()}_${Math.random().toString(36).slice(2)}`
  const metadata = fileId
    ? JSON.stringify({ name: fileName })
    : JSON.stringify({ name: fileName, mimeType: JSON_MIME, parents: [folderId] })

  const body = [
    `--${boundary}`,
    'Content-Type: application/json; charset=UTF-8',
    '',
    metadata,
    `--${boundary}`,
    'Content-Type: application/json',
    '',
    JSON.stringify(data),
    `--${boundary}--`,
  ].join('\r\n')

  const url = fileId
    ? `${DRIVE_UPLOAD_API}/files/${fileId}?uploadType=multipart`
    : `${DRIVE_UPLOAD_API}/files?uploadType=multipart`

  const result = await driveRequest<{ id: string }>(
    url,
    {
      method: fileId ? 'PATCH' : 'POST',
      headers: { 'Content-Type': `multipart/related; boundary="${boundary}"` },
      body,
    },
    accessToken
  )
  return result.id
}
