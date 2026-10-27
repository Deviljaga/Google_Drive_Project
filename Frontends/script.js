
const API_BASE = "http://localhost:8080";
const FILES_API = `${API_BASE}/api/files`;
const SHARES_API = `${API_BASE}/api/shares`;

const fileInput = document.getElementById("fileInput");
const fileList = document.getElementById("fileList");
const tableCard = document.getElementById("tableCard");
const emptyState = document.getElementById("emptyState");
const searchInput = document.getElementById("searchInput");
const toast = document.getElementById("toast");
const shareModal = document.getElementById("shareModal");
const detailsModal = document.getElementById("detailsModal");

let files = [];
let starredIds = new Set();
let sharedIds = new Set();
let currentView = "drive";
let currentShareFile = null;
let toastTimer;

const yearElement = document.getElementById("year");
if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
}

// Show toast message
function showToast(message, duration = 3200) {
    if (!toast) {
        console.log(message);
        return;
    }

    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, duration);
}

// Escape HTML to prevent unsafe HTML injection
function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[char]);
}

// Format file size
function formatBytes(bytes) {
    let size = Number(bytes || 0);

    if (size < 1024) {
        return `${size} B`;
    }

    const units = ["KB", "MB", "GB", "TB"];
    let index = -1;

    do {
        size /= 1024;
        index++;
    } while (size >= 1024 && index < units.length - 1);

    return `${size.toFixed(size >= 10 ? 0 : 1)} ${units[index]}`;
}

// Format upload date
function formatDate(value) {
    if (!value) {
        return "Just now";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "Just now";
    }

    if (date.toDateString() === new Date().toDateString()) {
        return `Today, ${date.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
        })}`;
    }

    return date.toLocaleDateString([], {
        day: "numeric",
        month: "short",
        year: "numeric"
    });
}

// Determine file type
function typeInfo(name = "", mime = "") {
    const extension = name.includes(".")
        ? name.split(".").pop().toLowerCase()
        : "";

    if (extension === "pdf" || mime.includes("pdf")) {
        return ["PDF", "type-pdf"];
    }

    if (
        ["png", "jpg", "jpeg", "gif", "webp", "svg", "bmp"].includes(extension) ||
        mime.startsWith("image/")
    ) {
        return ["IMG", "type-image"];
    }

    if (
        ["doc", "docx", "txt", "rtf", "odt"].includes(extension) ||
        mime.includes("word") ||
        mime.startsWith("text/")
    ) {
        return ["DOC", "type-doc"];
    }

    if (
        ["xls", "xlsx", "csv"].includes(extension) ||
        mime.includes("sheet") ||
        mime.includes("csv")
    ) {
        return ["XLS", "type-sheet"];
    }

    if (["zip", "rar", "7z", "tar", "gz"].includes(extension)) {
        return ["ZIP", "type-zip"];
    }

    return [
        extension ? extension.slice(0, 4).toUpperCase() : "FILE",
        "type-file"
    ];
}

// Common API request function
async function request(url, options = {}) {
    let response;

    try {
        response = await fetch(url, options);
    } catch (error) {
        throw new Error(
            "Backend connect nahi ho raha. API Gateway localhost:8080 par running hai? CORS bhi check karein."
        );
    }

    if (!response.ok) {
        let message = `${response.status} ${response.statusText}`;

        try {
            const body = await response.json();
            message = body.error || body.message || message;
        } catch (error) {
            // Response JSON nahi hai
        }

        throw new Error(message);
    }

    return response;
}

// Load files from backend
async function loadFiles() {
    if (!fileList || !emptyState) {
        console.error("HTML mein fileList ya emptyState element missing hai.");
        return;
    }

    fileList.innerHTML = `
        <div class="loading-state">
            <div class="spinner"></div>
            Loading your files…
        </div>
    `;

    emptyState.classList.add("hidden");
    fileList.classList.remove("hidden");

    try {
        const response = await request(FILES_API);
        const data = await response.json();

        files = Array.isArray(data) ? data : [];

        renderFiles();
        updateStats();
    } catch (error) {
        fileList.innerHTML = "";
        fileList.classList.add("hidden");
        emptyState.classList.remove("hidden");

        const title = emptyState.querySelector("h3");
        const description = emptyState.querySelector("p");

        if (title) {
            title.textContent = "Could not load files";
        }

        if (description) {
            description.textContent = error.message;
        }

        const totalFiles = document.getElementById("totalFiles");
        const totalStorage = document.getElementById("totalStorage");

        if (totalFiles) totalFiles.textContent = "—";
        if (totalStorage) totalStorage.textContent = "—";

        showToast(error.message, 6000);
    }
}

// Update dashboard statistics
function updateStats() {
    const totalSize = files.reduce(
        (sum, file) => sum + Number(file.size || 0),
        0
    );

    const totalFiles = document.getElementById("totalFiles");
    const totalStorage = document.getElementById("totalStorage");
    const storageFoot = document.getElementById("storageFoot");
    const lastActivity = document.getElementById("lastActivity");
    const storagePercent = document.getElementById("storagePercent");
    const storageBar = document.getElementById("storageBar");
    const storageCaption = document.getElementById("storageCaption");
    const trashCount = document.getElementById("trashCount");

    if (totalFiles) totalFiles.textContent = files.length;

    if (totalStorage) {
        totalStorage.textContent = formatBytes(totalSize);
    }

    if (storageFoot) {
        storageFoot.textContent =
            `${files.length} file${files.length === 1 ? "" : "s"} in your drive`;
    }

    if (lastActivity) {
        lastActivity.textContent = files.length
            ? formatDate(files[0].uploadedAt).split(",")[0]
            : "No activity";
    }

    const percent = Math.min(
        100,
        Math.round((totalSize / (15 * 1024 ** 3)) * 100)
    );

    if (storagePercent) {
        storagePercent.textContent = `${percent}%`;
    }

    if (storageBar) {
        storageBar.style.width = `${percent}%`;
    }

    if (storageCaption) {
        storageCaption.textContent =
            `${formatBytes(totalSize)} used of demo 15 GB indicator`;
    }

    if (trashCount) {
        trashCount.textContent = "0";
    }
}

// Filter and sort files
function getVisibleFiles() {
    const query = searchInput
        ? searchInput.value.trim().toLowerCase()
        : "";

    let result = files.filter(file => {
        const name = String(file.originalName || "").toLowerCase();

        if (!name.includes(query)) {
            return false;
        }

        if (currentView === "starred") {
            return starredIds.has(file.id);
        }

        if (currentView === "shared") {
            return sharedIds.has(file.id);
        }

        return true;
    });

    const sortSelect = document.getElementById("sortSelect");
    const sort = sortSelect ? sortSelect.value : "newest";

    if (sort === "newest") {
        result.sort(
            (a, b) =>
                new Date(b.uploadedAt || 0) -
                new Date(a.uploadedAt || 0)
        );
    }

    if (sort === "oldest") {
        result.sort(
            (a, b) =>
                new Date(a.uploadedAt || 0) -
                new Date(b.uploadedAt || 0)
        );
    }

    if (sort === "name") {
        result.sort(
            (a, b) =>
                String(a.originalName || "").localeCompare(
                    String(b.originalName || "")
                )
        );
    }

    if (sort === "size") {
        result.sort(
            (a, b) => Number(b.size || 0) - Number(a.size || 0)
        );
    }

    if (currentView === "recent") {
        result = result.slice(0, 10);
    }

    return result;
}

// Render files on the page
function renderFiles() {
    if (!fileList || !emptyState) {
        console.error("HTML mein fileList ya emptyState element missing hai.");
        return;
    }

    const visibleFiles = getVisibleFiles();

    const headings = {
        drive: "Your files",
        shared: "Shared files",
        recent: "Recent files",
        starred: "Starred files",
        trash: "Trash"
    };

    const heading = headings[currentView] || "Your files";
    const filesHeading = document.getElementById("filesHeading");

    if (!filesHeading) {
        console.error("HTML mein #filesHeading element nahi mila.");
        return;
    }

    // FIX: visibleCount ID har render ke baad preserve hoti hai
    filesHeading.innerHTML =
        `${escapeHtml(heading)} <span id="visibleCount">${visibleFiles.length}</span>`;

    fileList.innerHTML = "";

    emptyState.classList.toggle("hidden", visibleFiles.length > 0);
    fileList.classList.toggle("hidden", visibleFiles.length === 0);

    if (visibleFiles.length === 0) {
        const emptyTitle = emptyState.querySelector("h3");
        const emptyDescription = emptyState.querySelector("p");

        if (emptyTitle) {
            if (currentView === "starred") {
                emptyTitle.textContent = "Nothing starred yet";
            } else if (currentView === "shared") {
                emptyTitle.textContent = "No shared files yet";
            } else if (currentView === "trash") {
                emptyTitle.textContent = "Trash is empty";
            } else {
                emptyTitle.textContent = "No files here yet";
            }
        }

        if (emptyDescription) {
            if (currentView === "shared") {
                emptyDescription.textContent =
                    "Use a file menu to create a share record.";
            } else if (currentView === "starred") {
                emptyDescription.textContent =
                    "Star a file from its action menu.";
            } else {
                emptyDescription.textContent =
                    "Upload your first file and it will show up here.";
            }
        }

        return;
    }

    visibleFiles.forEach(file => {
        const [label, cssClass] = typeInfo(
            file.originalName,
            file.contentType || ""
        );

        const row = document.createElement("div");
        row.className = "file-row";

        row.innerHTML = `
            <div class="file-name-cell">
                <div class="file-type-icon ${cssClass}">
                    ${escapeHtml(label)}
                </div>

                <div class="file-name-text">
                    <strong title="${escapeHtml(file.originalName)}">
                        ${escapeHtml(file.originalName || "Untitled")}
                    </strong>

                    <small>
                        ${escapeHtml(file.contentType || "Unknown type")}
                    </small>
                </div>
            </div>

            <div class="owner-cell">
                <span class="owner">
                    <span class="owner-avatar">J</span>
                    Me
                </span>
            </div>

            <div class="date-cell">
                ${escapeHtml(formatDate(file.uploadedAt))}
            </div>

            <div class="size-cell">
                ${escapeHtml(formatBytes(file.size))}
            </div>

            <div class="row-menu-wrap">
                <button class="row-menu" aria-label="File actions">⋯</button>

                <div class="row-dropdown hidden">
                    <button data-action="download">Download</button>
                    <button data-action="details">File details</button>
                    <button data-action="share">Share</button>

                    <button data-action="star">
                        ${starredIds.has(file.id) ? "Unstar" : "Star"}
                    </button>

                    <button class="danger" data-action="delete">
                        Delete file
                    </button>
                </div>
            </div>
        `;

        const menu = row.querySelector(".row-dropdown");

        row.querySelector(".row-menu").addEventListener("click", () => {
            document.querySelectorAll(".row-dropdown").forEach(item => {
                if (item !== menu) {
                    item.classList.add("hidden");
                }
            });

            menu.classList.toggle("hidden");
        });

        row.querySelectorAll("[data-action]").forEach(button => {
            button.addEventListener("click", () => {
                menu.classList.add("hidden");
                handleAction(button.dataset.action, file);
            });
        });

        row.querySelector(".file-name-cell").addEventListener(
            "dblclick",
            () => downloadFile(file)
        );

        fileList.appendChild(row);
    });
}

// Upload files one by one
async function uploadFiles(fileCollection) {
    const selectedFiles = Array.from(fileCollection || []);

    if (!selectedFiles.length) {
        return;
    }

    let succeeded = 0;

    for (let index = 0; index < selectedFiles.length; index++) {
        const file = selectedFiles[index];
        const formData = new FormData();

        // Backend endpoint expects multipart field named "file"
        formData.append("file", file);

        try {
            showToast(
                `Uploading ${file.name} (${index + 1}/${selectedFiles.length})…`,
                10000
            );

            await request(FILES_API, {
                method: "POST",
                body: formData
            });

            succeeded++;
        } catch (error) {
            showToast(
                `Upload failed: ${file.name} — ${error.message}`,
                6000
            );
        }
    }

    if (fileInput) {
        fileInput.value = "";
    }

    await loadFiles();

    if (succeeded > 0) {
        showToast(`${succeeded} file(s) uploaded successfully.`);
    }
}

// Download original file
async function downloadFile(file) {
    try {
        const response = await request(
            `${FILES_API}/${encodeURIComponent(file.id)}/download`
        );

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement("a");

        anchor.href = url;
        anchor.download = file.originalName || "download";

        document.body.appendChild(anchor);
        anchor.click();
        anchor.remove();

        setTimeout(() => URL.revokeObjectURL(url), 1500);

        showToast(`Downloading ${file.originalName}`);
    } catch (error) {
        showToast(`Download failed: ${error.message}`, 5000);
    }
}

// Delete file from backend
async function deleteFile(file) {
    const confirmed = confirm(
        `Permanently delete "${file.originalName}" from backend?`
    );

    if (!confirmed) {
        return;
    }

    try {
        await request(
            `${FILES_API}/${encodeURIComponent(file.id)}`,
            { method: "DELETE" }
        );

        files = files.filter(item => item.id !== file.id);
        starredIds.delete(file.id);
        sharedIds.delete(file.id);

        renderFiles();
        updateStats();

        showToast("File deleted.");
    } catch (error) {
        showToast(`Delete failed: ${error.message}`, 5000);
    }
}

// Show file details
function showDetails(file) {
    const detailsContent = document.getElementById("detailsContent");

    if (!detailsContent || !detailsModal) {
        showToast("Details modal HTML element nahi mila.");
        return;
    }

    const rows = [
        ["Name", file.originalName],
        ["File ID", file.id],
        ["Type", file.contentType || "Unknown"],
        ["Size", formatBytes(file.size)],
        ["Uploaded", formatDate(file.uploadedAt)]
    ];

    detailsContent.innerHTML = rows.map(([key, value]) => `
        <div class="detail-line">
            <span>${escapeHtml(key)}</span>
            <span>${escapeHtml(value)}</span>
        </div>
    `).join("");

    detailsModal.showModal();
}

// Open share modal
function openShare(file) {
    currentShareFile = file;

    document.getElementById("shareFileName").textContent =
        `Create a share record for “${file.originalName}”.`;

    document.getElementById("shareEmail").value = "";
    document.getElementById("sharePermission").value = "VIEW";

    shareModal.showModal();
}

// Create share record
async function createShare(event) {
    event.preventDefault();

    if (!currentShareFile) {
        return;
    }

    const email = document.getElementById("shareEmail").value.trim();
    const permission = document.getElementById("sharePermission").value;

    try {
        const response = await request(SHARES_API, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                fileId: currentShareFile.id,
                sharedWithEmail: email,
                permission: permission
            })
        });

        await response.json();

        sharedIds.add(currentShareFile.id);
        shareModal.close();

        renderFiles();

        showToast(`Share record created for ${email}.`);
    } catch (error) {
        showToast(`Share failed: ${error.message}`, 5000);
    }
}

// Handle file actions
function handleAction(action, file) {
    if (action === "download") {
        downloadFile(file);
    }

    if (action === "details") {
        showDetails(file);
    }

    if (action === "share") {
        openShare(file);
    }

    if (action === "delete") {
        deleteFile(file);
    }

    if (action === "star") {
        if (starredIds.has(file.id)) {
            starredIds.delete(file.id);
        } else {
            starredIds.add(file.id);
        }

        renderFiles();

        showToast(
            starredIds.has(file.id)
                ? "Starred for this browser session."
                : "Removed from starred."
        );
    }
}

// Drag-and-drop upload
const dropZone = document.getElementById("dropZone");

if (dropZone) {
    ["dragenter", "dragover"].forEach(eventName => {
        dropZone.addEventListener(eventName, event => {
            event.preventDefault();
            event.currentTarget.classList.add("dragging");
        });
    });

    ["dragleave", "drop"].forEach(eventName => {
        dropZone.addEventListener(eventName, event => {
            event.preventDefault();
            event.currentTarget.classList.remove("dragging");
        });
    });

    dropZone.addEventListener("drop", event => {
        uploadFiles(event.dataTransfer.files);
    });
}

// Upload buttons
[
    "newButton",
    "uploadTopButton",
    "browseButton",
    "emptyUploadButton"
].forEach(id => {
    const button = document.getElementById(id);

    if (button && fileInput) {
        button.addEventListener("click", () => fileInput.click());
    }
});

if (fileInput) {
    fileInput.addEventListener("change", event => {
        uploadFiles(event.target.files);
    });
}

// Search, sorting and refresh
if (searchInput) {
    searchInput.addEventListener("input", renderFiles);
}

const sortSelect = document.getElementById("sortSelect");

if (sortSelect) {
    sortSelect.addEventListener("change", renderFiles);
}

const refreshButton = document.getElementById("refreshButton");

if (refreshButton) {
    refreshButton.addEventListener("click", loadFiles);
}

const storageInfo = document.getElementById("storageInfo");

if (storageInfo) {
    storageInfo.addEventListener("click", () => {
        showToast(
            "Storage bar is a visual 15 GB estimate; quota enforcement is not implemented."
        );
    });
}

// List view
const listViewButton = document.getElementById("listViewButton");
const gridViewButton = document.getElementById("gridViewButton");

if (listViewButton) {
    listViewButton.addEventListener("click", () => {
        tableCard.classList.remove("grid-mode");
        listViewButton.classList.add("active");

        if (gridViewButton) {
            gridViewButton.classList.remove("active");
        }
    });
}

// Grid view
if (gridViewButton) {
    gridViewButton.addEventListener("click", () => {
        tableCard.classList.add("grid-mode");
        gridViewButton.classList.add("active");

        if (listViewButton) {
            listViewButton.classList.remove("active");
        }
    });
}

// Sidebar navigation
const viewInfo = {
    drive: [
        "My Drive",
        "Everything you need, right where you need it."
    ],
    shared: [
        "Shared with me",
        "Files with share records created in this browser session."
    ],
    recent: [
        "Recent",
        "Your latest files, ready when you are."
    ],
    starred: [
        "Starred",
        "Keep your favorites close at hand."
    ],
    trash: [
        "Trash",
        "Deleted items are removed from the backend immediately."
    ]
};

document.querySelectorAll(".nav-item").forEach(button => {
    button.addEventListener("click", () => {
        document.querySelectorAll(".nav-item").forEach(item => {
            item.classList.remove("active");
        });

        button.classList.add("active");

        currentView = button.dataset.view;

        const info = viewInfo[currentView] || viewInfo.drive;
        const pageTitle = document.getElementById("pageTitle");
        const pageSubtitle = document.getElementById("pageSubtitle");
        const sidebar = document.getElementById("sidebar");

        if (pageTitle) {
            pageTitle.innerHTML =
                `${escapeHtml(info[0])}<span class="title-dot">.</span>`;
        }

        if (pageSubtitle) {
            pageSubtitle.textContent = info[1];
        }

        if (sidebar) {
            sidebar.classList.remove("open");
        }

        renderFiles();
    });
});

// Mobile menu
const mobileMenu = document.getElementById("mobileMenu");

if (mobileMenu) {
    mobileMenu.addEventListener("click", () => {
        document.getElementById("sidebar").classList.toggle("open");
    });
}

// Share form and modal buttons
const shareForm = document.getElementById("shareForm");

if (shareForm) {
    shareForm.addEventListener("submit", createShare);
}

const closeShareModal = document.getElementById("closeShareModal");
const cancelShare = document.getElementById("cancelShare");
const closeDetailsModal = document.getElementById("closeDetailsModal");
const closeDetailsButton = document.getElementById("closeDetailsButton");

if (closeShareModal) {
    closeShareModal.addEventListener("click", () => shareModal.close());
}

if (cancelShare) {
    cancelShare.addEventListener("click", () => shareModal.close());
}

if (closeDetailsModal) {
    closeDetailsModal.addEventListener("click", () => detailsModal.close());
}

if (closeDetailsButton) {
    closeDetailsButton.addEventListener("click", () => detailsModal.close());
}

// Close file menus when clicking outside
document.addEventListener("click", event => {
    if (!event.target.closest(".row-menu-wrap")) {
        document.querySelectorAll(".row-dropdown").forEach(menu => {
            menu.classList.add("hidden");
        });
    }
});

// Ctrl + K focuses search
document.addEventListener("keydown", event => {
    if (
        (event.metaKey || event.ctrlKey) &&
        event.key.toLowerCase() === "k"
    ) {
        event.preventDefault();

        if (searchInput) {
            searchInput.focus();
        }
    }
});

// Start application
loadFiles();
