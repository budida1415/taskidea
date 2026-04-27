# TaskIdea - Google Drive API Integration Guide

Complete guide for integrating Google Drive API with TaskIdea application.

## Overview

TaskIdea uses Google Drive as a database and file storage system. All tasks and ideas are stored as JSON files in the user's Google Drive. The application communicates with Google Drive via the Google Drive REST API v3.

### Why Google Drive?
- ✅ No backend server needed
- ✅ Data ownership stays with user
- ✅ Free storage (up to 15GB)
- ✅ Built-in sync and versioning
- ✅ Secure with Google's infrastructure
- ✅ Easy OAuth integration

## Authentication Flow

### Google OAuth 2.0

#### 1. Set Up Google Cloud Project

**Steps:**
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project (name it "TaskIdea")
3. Enable Google Drive API:
   - Navigate to "APIs & Services" → "Library"
   - Search for "Google Drive API"
   - Click "Enable"

#### 2. Create OAuth 2.0 Credentials

**Steps:**
1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth client ID"
3. Application type: Select based on platform
   - **Mobile**: "iOS" or "Android"
   - **Web**: "Web application"
   - **Desktop**: "Desktop application"
4. Configure redirect URIs:
   - Web: `http://localhost:3000/auth/callback`
   - Mobile: `com.taskidea://oauth/redirect`
   - Desktop: `http://localhost:3000/auth/callback`
5. Copy Client ID and Client Secret

#### 3. Configure Environment Variables

Create `.env` file in project root:
```env
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
GOOGLE_REDIRECT_URI=http://localhost:3000/auth/callback
API_BASE_URL=https://www.googleapis.com/drive/v3
```

### OAuth 2.0 Scopes

TaskIdea requests the following OAuth scopes:

```
https://www.googleapis.com/auth/drive.file
```

This scope allows TaskIdea to:
- Create, read, update, delete files created by the app
- Access shared files
- Not access all files on Google Drive

**Other recommended scopes:**
```
https://www.googleapis.com/auth/userinfo.profile
https://www.googleapis.com/auth/userinfo.email
```

For getting user information (name, email, profile picture).

## API Endpoints & Operations

### Base URL
```
https://www.googleapis.com/drive/v3
```

### Authentication Header
All requests must include:
```
Authorization: Bearer {access_token}
Content-Type: application/json
```

## File Management Operations

### 1. Create Folder (TaskIdea Root)

**Operation**: Create `TaskIdea` folder in Google Drive (run on first auth)

**Endpoint**: `POST /files`

**Request Body:**
```json
{
  "name": "TaskIdea",
  "mimeType": "application/vnd.google-apps.folder",
  "parents": ["root"]
}
```

**Response:**
```json
{
  "kind": "drive#file",
  "id": "folder_id",
  "name": "TaskIdea",
  "mimeType": "application/vnd.google-apps.folder"
}
```

**Implementation:**
```typescript
async function createTaskIdeasFolder(auth) {
  const response = await gapi.client.drive.files.create({
    resource: {
      name: 'TaskIdea',
      mimeType: 'application/vnd.google-apps.folder',
      parents: ['root']
    }
  });
  return response.result.id;
}
```

### 2. Create File (Upload JSON)

**Operation**: Upload tasks or ideas JSON file

**Endpoint**: `POST /files?uploadType=media`

**Request Headers:**
```
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "tasks_current.json",
  "parents": ["tasks_folder_id"],
  "mimeType": "application/json"
}
```

**File Content** (multipart):
```json
{
  "id": "task_uuid",
  "title": "Buy groceries",
  "description": "Milk, eggs, bread",
  "dueDate": "2024-05-01",
  "priority": "high",
  "status": "pending"
}
```

**Implementation:**
```typescript
async function uploadFile(fileName, folderParentId, fileContent) {
  const file = new Blob([JSON.stringify(fileContent)], { 
    type: 'application/json' 
  });
  
  const metadata = {
    name: fileName,
    parents: [folderParentId],
    mimeType: 'application/json'
  };
  
  const form = new FormData();
  form.append('metadata', new Blob([JSON.stringify(metadata)], 
    { type: 'application/json' }));
  form.append('file', file);
  
  const response = await fetch(
    'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart',
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      },
      body: form
    }
  );
  
  return await response.json();
}
```

### 3. Update File (Overwrite)

**Operation**: Update existing JSON file with new data

**Endpoint**: `PATCH /files/{fileId}?uploadType=media`

**Request:**
```
PATCH /drive/v3/files/file_id?uploadType=media
Authorization: Bearer {access_token}
Content-Type: application/json

[updated JSON content]
```

**Implementation:**
```typescript
async function updateFile(fileId, fileContent) {
  const file = new Blob([JSON.stringify(fileContent)], { 
    type: 'application/json' 
  });
  
  const response = await fetch(
    `https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=media`,
    {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: file
    }
  );
  
  return await response.json();
}
```

### 4. Get File (Download)

**Operation**: Retrieve JSON file content from Google Drive

**Endpoint**: `GET /files/{fileId}?alt=media`

**Request:**
```
GET /drive/v3/files/file_id?alt=media
Authorization: Bearer {access_token}
```

**Response**: File content (JSON)

**Implementation:**
```typescript
async function getFile(fileId) {
  const response = await fetch(
    `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
    {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    }
  );
  
  const content = await response.json();
  return content;
}
```

### 5. List Files (Query)

**Operation**: Query files by name or folder

**Endpoint**: `GET /files?q=...&pageSize=...`

**Query Parameters:**
```
q=name='tasks_current.json' and parents='folder_id'
pageSize=10
spaces=drive
```

**Request:**
```
GET /drive/v3/files?q=name='tasks_current.json' and parents='parent_id'
Authorization: Bearer {access_token}
```

**Response:**
```json
{
  "kind": "drive#fileList",
  "files": [
    {
      "kind": "drive#file",
      "id": "file_id",
      "name": "tasks_current.json",
      "mimeType": "application/json",
      "modifiedTime": "2024-05-01T10:00:00Z"
    }
  ]
}
```

**Implementation:**
```typescript
async function listFiles(query, folderParentId, pageSize = 10) {
  const queryString = `${query} and parents='${folderParentId}'`;
  
  const response = await fetch(
    `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(queryString)}&pageSize=${pageSize}&spaces=drive`,
    {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    }
  );
  
  const data = await response.json();
  return data.files;
}
```

### 6. Delete File

**Operation**: Delete a file from Google Drive

**Endpoint**: `DELETE /files/{fileId}`

**Request:**
```
DELETE /drive/v3/files/file_id
Authorization: Bearer {access_token}
```

**Response**: 204 No Content (on success)

**Implementation:**
```typescript
async function deleteFile(fileId) {
  const response = await fetch(
    `https://www.googleapis.com/drive/v3/files/${fileId}`,
    {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    }
  );
  
  return response.status === 204;
}
```

## Google Drive File Structure

### Recommended Folder Structure
```
My Drive/
└── TaskIdea/
    ├── tasks/
    │   ├── tasks_current.json      (all active tasks)
    │   ├── tasks_archive.json      (completed/archived)
    │   └── tasks_metadata.json     (sync timestamps)
    ├── ideas/
    │   ├── ideas_current.json      (all active ideas)
    │   ├── ideas_archive.json      (archived ideas)
    │   └── ideas_metadata.json     (sync timestamps)
    └── settings.json               (user preferences)
```

### File Query Examples

**Find tasks folder:**
```
name='tasks' and parents='TaskIdea_folder_id' and mimeType='application/vnd.google-apps.folder'
```

**Find tasks_current.json:**
```
name='tasks_current.json' and parents='tasks_folder_id' and mimeType='application/json'
```

**Find all JSON files:**
```
parents='TaskIdea_folder_id' and mimeType='application/json'
```

## Data Schemas

### Task File Content
```json
[
  {
    "id": "uuid",
    "title": "Buy groceries",
    "description": "Milk, eggs, bread",
    "dueDate": "2024-05-01",
    "priority": "high",
    "status": "pending",
    "category": "Shopping",
    "tags": ["urgent", "personal"],
    "createdAt": "2024-04-25T10:00:00Z",
    "updatedAt": "2024-04-25T10:00:00Z",
    "completedAt": null,
    "recurring": {
      "enabled": false,
      "frequency": null
    }
  }
]
```

### Idea File Content
```json
[
  {
    "id": "uuid",
    "title": "Mobile app optimization",
    "description": "Ideas for improving app performance",
    "topic": "Development",
    "tags": ["performance", "mobile"],
    "starred": true,
    "archived": false,
    "createdAt": "2024-04-25T10:00:00Z",
    "updatedAt": "2024-04-25T10:00:00Z"
  }
]
```

### Metadata File Content
```json
{
  "lastSyncTime": "2024-04-25T15:30:00Z",
  "version": "1.0.0",
  "appVersion": "1.0.0"
}
```

## Error Handling

### Common Error Codes

| Code | Status | Meaning | Solution |
|------|--------|---------|----------|
| 400 | Bad Request | Invalid query or request body | Check syntax, parameters |
| 401 | Unauthorized | Invalid or expired token | Refresh token, re-authenticate |
| 403 | Forbidden | Insufficient permissions | Request new permissions |
| 404 | Not Found | File/folder doesn't exist | Create file/folder first |
| 429 | Too Many Requests | Rate limit exceeded | Implement exponential backoff |
| 500 | Server Error | Google Drive API error | Retry after delay |

### Error Response Example
```json
{
  "error": {
    "code": 401,
    "message": "Invalid Credentials",
    "errors": [
      {
        "domain": "global",
        "reason": "authError",
        "message": "Invalid Credentials"
      }
    ]
  }
}
```

### Implementation Pattern
```typescript
async function makeApiCall(method, endpoint, data = null) {
  try {
    const response = await fetch(endpoint, {
      method,
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: data ? JSON.stringify(data) : null
    });
    
    if (!response.ok) {
      const error = await response.json();
      
      // Handle specific errors
      if (response.status === 401) {
        // Token expired, refresh
        await refreshToken();
        return makeApiCall(method, endpoint, data); // Retry
      } else if (response.status === 429) {
        // Rate limited, exponential backoff
        await sleep(2000);
        return makeApiCall(method, endpoint, data);
      } else {
        throw new Error(error.error.message);
      }
    }
    
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}
```

## Rate Limiting

### Quotas
- **Queries per second**: 30 qps (per user)
- **Daily quota**: 1,000,000,000 units per day
- **API method quotas**: 1 unit per query, 1 unit per 1KB download

### Exponential Backoff Implementation
```typescript
async function retryWithBackoff(fn, maxRetries = 5) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (error.status === 429 && i < maxRetries - 1) {
        const delay = Math.pow(2, i) * 1000; // 1s, 2s, 4s, 8s, 16s
        await sleep(delay);
      } else {
        throw error;
      }
    }
  }
}
```

## Sync Strategy

### Conflict Resolution (Last-Write-Wins)

When conflicts occur during sync:
```typescript
function resolveConflict(local, remote) {
  // Use updatedAt timestamp to determine which is newer
  if (new Date(local.updatedAt) > new Date(remote.updatedAt)) {
    return local;
  } else {
    return remote;
  }
}
```

### Sync Algorithm
```
1. Fetch sync metadata (lastSyncTime)
2. If first sync, download all files
3. Check for local changes since lastSyncTime
4. Download remote files
5. Merge local and remote (conflict resolution)
6. Upload local changes
7. Update sync metadata
```

## Testing API Calls

### Using Google Drive Web Interface
1. Go to [Google Drive](https://drive.google.com)
2. Create a test folder
3. Manually create/edit JSON files to test

### Using API Explorer
1. Go to [Google Drive API Explorer](https://developers.google.com/drive/api/v3/reference)
2. Click on an API method
3. Click "Execute" to test

### Using cURL (Command Line)
```bash
# List files
curl -H "Authorization: Bearer $ACCESS_TOKEN" \
  "https://www.googleapis.com/drive/v3/files?q=name='tasks_current.json'"

# Create file
curl -X POST \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"tasks_current.json","mimeType":"application/json"}' \
  "https://www.googleapis.com/drive/v3/files"
```

## Security Best Practices

### Protect API Keys
- ✅ Store in `.env` file (never in code)
- ✅ Never commit `.env` to git
- ✅ Use environment variables in production
- ❌ Don't log tokens or credentials
- ❌ Don't expose Client Secret in frontend code

### Token Management
- ✅ Store access tokens securely (Keychain/Keystore)
- ✅ Refresh tokens before expiration
- ✅ Implement token rotation
- ✅ Clear tokens on logout
- ❌ Never store in localStorage (web)
- ❌ Never hardcode tokens

### API Call Security
- ✅ Always use HTTPS
- ✅ Validate user input before API calls
- ✅ Limit file access with scopes
- ✅ Implement rate limiting
- ✅ Log API errors (without sensitive data)

## Troubleshooting

### Issue: "Invalid Credentials"
- Check if access token is valid
- Verify CLIENT_ID and CLIENT_SECRET
- Ensure token hasn't expired
- Try refreshing the token

### Issue: "Permission Denied"
- Check OAuth scopes in Google Cloud
- Verify user has granted permissions
- Check file permissions in Google Drive
- Ensure files aren't shared-only

### Issue: "File Not Found"
- Verify file ID is correct
- Check if parent folder ID is correct
- Ensure file wasn't deleted
- Check query syntax

### Issue: "Rate Limit Exceeded"
- Implement exponential backoff
- Batch operations when possible
- Increase time between API calls
- Request quota increase if needed

## Resources

- [Google Drive API Docs](https://developers.google.com/drive/api)
- [OAuth 2.0 Flow](https://developers.google.com/identity/protocols/oauth2)
- [API Explorer](https://developers.google.com/drive/api/v3/reference)
- [Error Codes](https://developers.google.com/drive/api/guides/handle-errors)

---

For implementation examples, see `src/services/googleDriveService.ts`
