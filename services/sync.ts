import { findOrCreateAppFolder, findFile, readFileContent, writeJsonFile } from './driveApi'
import { DRIVE_FOLDER_NAME } from '../constants/config'
import { Task, Idea } from '../types'

interface DriveFileData<T> {
  version: number
  items: T[]
}

export async function initDriveFolder(accessToken: string): Promise<string> {
  return findOrCreateAppFolder(accessToken, DRIVE_FOLDER_NAME)
}

export async function loadDriveFile<T>(
  folderId: string,
  fileName: string,
  accessToken: string
): Promise<{ fileId: string | null; items: T[] }> {
  const file = await findFile(folderId, fileName, accessToken)
  if (!file) return { fileId: null, items: [] }

  const data = await readFileContent<DriveFileData<T>>(file.id, accessToken)
  return { fileId: file.id, items: data.items ?? [] }
}

export async function saveDriveFile<T>(
  folderId: string,
  fileId: string | null,
  fileName: string,
  items: T[],
  accessToken: string
): Promise<string> {
  return writeJsonFile(folderId, fileId, fileName, { version: 1, items }, accessToken)
}
