// ============================================
// REPERTOIRE ORGANIZER - JAVASCRIPT
// Manages folders and items using localStorage
// ============================================

// ============================================
// CONSTANTS
// ============================================
const CONFIG = {
    DEFAULT_FOLDER_NAME: 'My Repertoire',
    DEFAULT_FOLDER_COLOR: '#3b82f6',
    STORAGE_KEYS: {
        folders: 'folders',
        items: 'items'
    },
    ITEM_TYPES: {
        song: 'songs',
        monologue: 'monologues'
    },
    FILTERS: {
        all: 'all',
        songs: 'songs',
        monologues: 'monologues'
    }
};

// ============================================
// STATE MANAGEMENT
// ============================================
let folders = JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEYS.folders)) || [];
let items = JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEYS.items)) || [];
let currentFolderId = null;
let currentFilter = CONFIG.FILTERS.all;
let editingFolderId = null;
let editingItemId = null;

// ============================================
// DOM ELEMENTS
// ============================================
const folderList = document.getElementById('folder-list');
const itemsContainer = document.getElementById('items-container');
const emptyState = document.getElementById('empty-state');
const currentFolderName = document.getElementById('current-folder-name');
const currentCategory = document.getElementById('current-category');

// Modals
const folderModal = document.getElementById('folder-modal');
const itemModal = document.getElementById('item-modal');

// Folder Modal Elements
const addFolderBtn = document.getElementById('add-folder-btn');
const closeFolderModalBtn = document.getElementById('close-folder-modal');
const cancelFolderBtn = document.getElementById('cancel-folder-btn');
const folderForm = document.getElementById('folder-form');
const folderModalTitle = document.getElementById('folder-modal-title');
const folderNameInput = document.getElementById('folder-name');

// Item Modal Elements
const addItemBtn = document.getElementById('add-item-btn');
const closeItemModalBtn = document.getElementById('close-item-modal');
const cancelItemBtn = document.getElementById('cancel-item-btn');
const itemForm = document.getElementById('item-form');
const itemModalTitle = document.getElementById('item-modal-title');
const itemTitleInput = document.getElementById('item-title');
const itemTypeSelect = document.getElementById('item-type');
const itemArtistInput = document.getElementById('item-artist');
const itemShowInput = document.getElementById('item-show');
const itemFolderSelect = document.getElementById('item-folder');
const itemNotesInput = document.getElementById('item-notes');

// Filter Buttons
const filterButtons = document.querySelectorAll('.filter-btn');

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // Create default folder if none exist
    if (folders.length === 0) {
        folders.push({
            id: generateId(),
            name: CONFIG.DEFAULT_FOLDER_NAME,
            color: CONFIG.DEFAULT_FOLDER_COLOR,
            createdAt: new Date().toISOString()
        });
        saveFolders();
    }

    renderFolders();
    renderItems();
    
    // Set first folder as active
    if (folders.length > 0 && !currentFolderId) {
        currentFolderId = folders[0].id;
        renderFolders();
        renderItems();
    }
});

// ============================================
// FOLDER FUNCTIONS
// ============================================

/**
 * Renders all folders in the sidebar with item counts and active states
 * Updates the DOM with folder list including edit/delete buttons
 */
function renderFolders() {
    folderList.innerHTML = '';
    
    folders.forEach(folder => {
        const itemCount = items.filter(item => item.folderId === folder.id).length;
        const isActive = currentFolderId === folder.id;
        
        const folderElement = document.createElement('div');
        folderElement.className = `folder-item ${isActive ? 'active' : ''}`;
        folderElement.style.borderLeftColor = folder.color;
        
        folderElement.innerHTML = `
            <div class="folder-item-content">
                <span class="folder-icon">📁</span>
                <span class="folder-name">${folder.name}</span>
                <span class="folder-count">(${itemCount})</span>
            </div>
            <div class="folder-actions">
                <button class="icon-btn edit-folder-btn" data-id="${folder.id}" title="Edit folder">✏️</button>
                <button class="icon-btn delete-folder-btn" data-id="${folder.id}" title="Delete folder">🗑️</button>
            </div>
        `;
        
        // Click folder to view its items
        folderElement.addEventListener('click', (e) => {
            if (!e.target.classList.contains('icon-btn')) {
                currentFolderId = folder.id;
                renderFolders();
                renderItems();
            }
        });
        
        folderList.appendChild(folderElement);
    });
    
    // Add event listeners to edit/delete buttons
    document.querySelectorAll('.edit-folder-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            openEditFolderModal(btn.dataset.id);
        });
    });
    
    document.querySelectorAll('.delete-folder-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            deleteFolder(btn.dataset.id);
        });
    });
}

/**
 * Opens the edit folder modal with pre-filled data
 * @param {string} folderId - The ID of the folder to edit
 */
function openEditFolderModal(folderId) {
    editingFolderId = folderId;
    const folder = folders.find(f => f.id === folderId);
    
    if (folder) {
        folderModalTitle.textContent = 'Edit Folder';
        folderNameInput.value = folder.name;
        
        // Select the correct color
        const colorInput = document.querySelector(`input[name="folder-color"][value="${folder.color}"]`);
        if (colorInput) {
            colorInput.checked = true;
        }
        
        folderModal.classList.add('active');
    }
}

function saveFolder(e) {
    e.preventDefault();
    
    const name = folderNameInput.value.trim();
    const color = document.querySelector('input[name="folder-color"]:checked').value;
    
    if (!name) return;
    
    if (editingFolderId) {
        // Update existing folder
        const folder = folders.find(f => f.id === editingFolderId);
        if (folder) {
            folder.name = name;
            folder.color = color;
        }
    } else {
        // Create new folder
        folders.push({
            id: generateId(),
            name,
            color,
            createdAt: new Date().toISOString()
        });
    }
    
    saveFolders();
    renderFolders();
    closeFolderModal();
}

function deleteFolder(folderId) {
    const folder = folders.find(f => f.id === folderId);
    const itemCount = items.filter(item => item.folderId === folderId).length;
    
    if (itemCount > 0) {
        if (!confirm(`"${folder.name}" contains ${itemCount} item(s). Delete anyway?`)) {
            return;
        }
        // Delete all items in folder
        items = items.filter(item => item.folderId !== folderId);
        saveItems();
    }
    
    folders = folders.filter(f => f.id !== folderId);
    saveFolders();
    
    // If deleted folder was active, switch to first folder
    if (currentFolderId === folderId && folders.length > 0) {
        currentFolderId = folders[0].id;
    }
    
    renderFolders();
    renderItems();
}

function closeFolderModal() {
    folderModal.classList.remove('active');
    folderForm.reset();
    editingFolderId = null;
}

// ============================================
// ITEM FUNCTIONS
// ============================================

function renderItems() {
    // Update folder name display
    const currentFolder = folders.find(f => f.id === currentFolderId);
    if (currentFolder) {
        currentFolderName.textContent = currentFolder.name;
    } else {
        currentFolderName.textContent = 'All Items';
    }
    
    // Update category badge
    if (currentFilter === 'all') {
        currentCategory.textContent = '';
    } else {
        currentCategory.textContent = currentFilter;
    }
    
    // Filter items
    let filteredItems = items.filter(item => item.folderId === currentFolderId);
    
    if (currentFilter !== 'all') {
        filteredItems = filteredItems.filter(item => item.type === currentFilter);
    }
    
    // Show/hide empty state
    if (filteredItems.length === 0) {
        emptyState.classList.remove('hidden');
        itemsContainer.innerHTML = '';
        return;
    }
    
    emptyState.classList.add('hidden');
    itemsContainer.innerHTML = '';
    
    filteredItems.forEach(item => {
        const itemCard = document.createElement('div');
        itemCard.className = `item-card ${item.type === 'songs' ? 'song' : 'monologue'}`;
        
        itemCard.innerHTML = `
            <div class="item-header">
                <div>
                    <div class="item-title">${item.title}</div>
                </div>
                <span class="item-type ${item.type === 'songs' ? 'song' : 'monologue'}">
                    ${item.type === 'songs' ? 'Song' : 'Monologue'}
                </span>
            </div>
            <div class="item-details">
                ${item.artist ? `<div class="item-artist">🎤 ${item.artist}</div>` : ''}
                ${item.show ? `<div class="item-show">🎭 ${item.show}</div>` : ''}
            </div>
            ${item.notes ? `<div class="item-notes">${item.notes}</div>` : ''}
            <div class="item-actions">
                <button class="btn btn-small btn-secondary edit-item-btn" data-id="${item.id}">Edit</button>
                <button class="btn btn-small btn-danger delete-item-btn" data-id="${item.id}">Delete</button>
            </div>
        `;
        
        itemsContainer.appendChild(itemCard);
    });
    
    // Add event listeners
    document.querySelectorAll('.edit-item-btn').forEach(btn => {
        btn.addEventListener('click', () => openEditItemModal(btn.dataset.id));
    });
    
    document.querySelectorAll('.delete-item-btn').forEach(btn => {
        btn.addEventListener('click', () => deleteItem(btn.dataset.id));
    });
}

function openAddItemModal() {
    editingItemId = null;
    itemModalTitle.textContent = 'Add Item';
    itemForm.reset();
    
    // Populate folder dropdown
    populateFolderSelect();
    
    // Set current folder as default
    if (currentFolderId) {
        itemFolderSelect.value = currentFolderId;
    }
    
    itemModal.classList.add('active');
}

function openEditItemModal(itemId) {
    editingItemId = itemId;
    const item = items.find(i => i.id === itemId);
    
    if (item) {
        itemModalTitle.textContent = 'Edit Item';
        itemTitleInput.value = item.title;
        itemTypeSelect.value = item.type;
        itemArtistInput.value = item.artist || '';
        itemShowInput.value = item.show || '';
        itemNotesInput.value = item.notes || '';
        
        populateFolderSelect();
        itemFolderSelect.value = item.folderId;
        
        itemModal.classList.add('active');
    }
}

/**
 * Saves a new or existing item to localStorage
 * @param {Event} e - Form submission event
 */
function saveItem(e) {
    e.preventDefault();
    
    const title = itemTitleInput.value.trim();
    const type = itemTypeSelect.value;
    const artist = itemArtistInput.value.trim();
    const show = itemShowInput.value.trim();
    const folderId = itemFolderSelect.value;
    const notes = itemNotesInput.value.trim();
    
    if (!title || !folderId) return;
    
    if (editingItemId) {
        // Update existing item
        const item = items.find(i => i.id === editingItemId);
        if (item) {
            item.title = title;
            item.type = type;
            item.artist = artist;
            item.show = show;
            item.folderId = folderId;
            item.notes = notes;
        }
    } else {
        // Create new item
        items.push({
            id: generateId(),
            title,
            type,
            artist,
            show,
            folderId,
            notes,
            createdAt: new Date().toISOString()
        });
    }
    
    saveItems();
    renderItems();
    renderFolders(); // Update folder counts
    closeItemModal();
}

function deleteItem(itemId) {
    const item = items.find(i => i.id === itemId);
    
    if (confirm(`Delete "${item.title}"?`)) {
        items = items.filter(i => i.id !== itemId);
        saveItems();
        renderItems();
        renderFolders(); // Update folder counts
    }
}

function closeItemModal() {
    itemModal.classList.remove('active');
    itemForm.reset();
    editingItemId = null;
}

function populateFolderSelect() {
    itemFolderSelect.innerHTML = '<option value="">Select a folder</option>';
    
    folders.forEach(folder => {
        const option = document.createElement('option');
        option.value = folder.id;
        option.textContent = folder.name;
        itemFolderSelect.appendChild(option);
    });
}

// ============================================
// FILTER FUNCTIONS
// ============================================

function setFilter(filter) {
    currentFilter = filter;
    
    filterButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.category === filter) {
            btn.classList.add('active');
        }
    });
    
    renderItems();
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function saveFolders() {
    try {
        localStorage.setItem('folders', JSON.stringify(folders));
    } catch (error) {
        console.error('Failed to save folders:', error);
        alert('Unable to save data. Your storage may be full.');
    }
}

function loadData() {
    try {
        const foldersData = localStorage.getItem('folders');
        const itemsData = localStorage.getItem('items');
        
        folders = foldersData ? JSON.parse(foldersData) : [];
        items = itemsData ? JSON.parse(itemsData) : [];
    } catch (error) {
        console.error('Failed to load data:', error);
        folders = [];
        items = [];
    }
}

// ============================================
// EVENT LISTENERS
// ============================================

// Folder Modal
addFolderBtn.addEventListener('click', openAddFolderModal);
closeFolderModalBtn.addEventListener('click', closeFolderModal);
cancelFolderBtn.addEventListener('click', closeFolderModal);
folderForm.addEventListener('submit', saveFolder);

// Item Modal
addItemBtn.addEventListener('click', openAddItemModal);
closeItemModalBtn.addEventListener('click', closeItemModal);
cancelItemBtn.addEventListener('click', closeItemModal);
itemForm.addEventListener('submit', saveItem);

// Filter Buttons
filterButtons.forEach(btn => {
    btn.addEventListener('click', () => setFilter(btn.dataset.category));
});

// Close modals when clicking outside
folderModal.addEventListener('click', (e) => {
    if (e.target === folderModal) {
        closeFolderModal();
    }
});

itemModal.addEventListener('click', (e) => {
    if (e.target === itemModal) {
        closeItemModal();
    }
});
