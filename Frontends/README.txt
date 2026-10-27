DriveSpace Frontend — HTML/CSS/JavaScript

Files:
- index.html
- style.css
- script.js

Run steps:
1. Start MySQL, Discovery Service, Storage Service, Drive Service, Sharing Service, and API Gateway.
2. Confirm Gateway is available at http://localhost:8080.
3. Open this folder in VS Code and use Live Server on index.html.
4. Upload uses POST /api/files with multipart field "file".
5. List: GET /api/files; download: GET /api/files/{id}/download; delete: DELETE /api/files/{id}.
6. Share: POST /api/shares with JSON { "fileId": "...", "sharedWithEmail": "...", "permission": "VIEW" }.

If the browser reports a CORS error, configure Gateway CORS for your Live Server origin, often http://127.0.0.1:5500 or http://localhost:5500. The current backend does not persist starred status and does not enforce share permissions. The trash label is a UI view only; Delete removes the file from the backend.
If your gateway uses another port, update API_BASE in script.js.
