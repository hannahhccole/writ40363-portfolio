# Tools Used:** Which AI assistants did you use? (Claude, ChatGPT, Copilot, etc.)
- I used ChatGPT initially to get ideas based on my interests for what kind of web application to make. Then, once I started coding, I used Copilot in VS Code to help with the actual coding of the site.

# Learning Moments:** 3-5 key things AI taught you
1. AI is a useful tool but still needs to be checked, just as you would check your own work
2. It is more useful to ask AI for suggestions instead of to just make the edits for you. This gives the coder more control over what is happening.
3. Using AI allowed me to complete this project quicker than other projects, which shows that it can be very useful in web design. 

# Challenges:** What didn't work? When did AI mislead you?
- I found that the most common issue with AI was with the CSS. Sometimes the layout on certain pop-ups wasn't correct and I had to go back to Copilot, tell it it made a mistake, and ask how I could fix it. Usually, it was a pretty easy fix. 

# Process Evolution:** How did your prompting improve over the project?
- Once I started including which file the AI should give suggestions for and just making my prompts more specific overall, I found the AI gave better results. If I gave it a more general prompt, it sometimes wouldn't give the best results. 

# Sample Conversations
1. Debugging Session
    # Prompt: 
        I think the CSS needs to be fixed. I can't scroll once I open "add items" and a save button is not appearing on my screen. don't change anything but tell me how to fix this
    # AI Response: 
       Let me examine your CSS to identify the issues with the modal scrolling and the save button visibility.

        Read styles.css, lines 1 to 200

        Read styles.css, lines 200 to 450

        Read styles.css, lines 450 to 614

        I found two CSS issues causing your problems:

        Issue 1: Modal Can't Scroll ❌
        Problem: The .modal-content (line 447-452) has no max-height or overflow property, so when the form is taller than the screen, you can't scroll to see the bottom.

        Fix: Add these properties to .modal-content:
        .modal-content {
            background: white;
            width: 90%;
            max-width: 500px;
            max-height: 90vh;        /* ADD THIS */
            overflow-y: auto;        /* ADD THIS */
            border: 3px solid var(--burgundy);
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
        }
2. "Teach me a concept" Conversation
    # Prompt:  
        explain what the modals do in app.js
    # AI Response:  
        Looking at your app.js file, here's what the modals do:

        Two Modals in Your App
        1. Folder Modal (folder-modal)
        Creates and edits folders for organizing your repertoire.

        What it does:

        Opens when you click "+ Folder" button or edit a folder (lines 135-158)
        Collects folder name and color choice from the user
        Saves the folder to localStorage when you submit (lines 160-186)
        Closes when you click Cancel, X, or click outside the modal (lines 220-224)
        Key functions:

        openAddFolderModal() - Opens empty form for new folder
        openEditFolderModal(folderId) - Opens form pre-filled with existing folder data
        saveFolder(e) - Either creates new folder OR updates existing one
        closeFolderModal() - Hides modal and resets form
        2. Item Modal (item-modal)
        Creates and edits individual items (songs or monologues).

        What it does:

        Opens when you click "+ Add Item" or edit an item (lines 310-347)
        Collects title, type (song/monologue), artist, show, folder, and notes
        Dynamically populates the folder dropdown with your existing folders (lines 408-417)
        Saves the item to localStorage when you submit (lines 349-406)
        Closes when you click Cancel, X, or click outside (lines 220-224)
        Key functions:

        openAddItemModal() - Opens empty form, pre-selects current folder
        openEditItemModal(itemId) - Opens form pre-filled with existing item data
        saveItem(e) - Either creates new item OR updates existing one
        closeItemModal() - Hides modal and resets form
        How Modals Work Together
        Both modals use the same pattern:

        State tracking - Variables track if you're editing (editingFolderId, editingItemId) or adding new
        Form submission - The saveFolder() and saveItem() functions check if editing or creating
        localStorage sync - After saving, data persists in browser using saveFolders() and saveItems()
        UI updates - After closing, the display refreshes with renderFolders() and renderItems()
        The modals are what make your app interactive - they're the popup windows that let you input and edit your repertoire data!

3. Code Refactoring
    # Prompt:
        don't make any changes, but tell me how I can better organize my code in each of these files: index.html, styles.css, app.js
    # AI Response:
        
        Let me examine your files to provide specific organization recommendations.

        Read index.html

        Read styles.css, lines 1 to 100

        Read app.js, lines 1 to 100

        Based on examining your three files, here's how you can better organize each one:

        index.html - Organization Improvements
        ✅ What's Already Good:
        Clear HTML comments separating sections
        Semantic HTML (<header>, <main>, <aside>, <section>)
        Modals placed at the end before closing body tag
        💡 How to Improve:
        Add ARIA labels for accessibility

        Add aria-label to buttons: <button aria-label="Add new folder">
        Add role="dialog" and aria-modal="true" to modals
        Group related form fields with <fieldset>

        Wrap the color picker in <fieldset><legend>Color</legend>...</fieldset>
        Makes forms more semantic and accessible
        Move inline styles to CSS

        The color picker labels have style="background-color: #3b82f6" - move these to CSS classes
        Add skip link for accessibility

        At top of body: <a href="#main-content" class="skip-link">Skip to main content</a>
        Consider extracting modals to separate section

        Add a comment like <!-- MODALS --> to make them easier to find


        styles.css - Organization Improvements
        ✅ What's Already Good:
        Excellent section comments with clear dividers
        CSS variables at the top
        Logical ordering (base → layout → components → utilities)
        💡 How to Improve:
        Group related states together

        Put all :hover, :focus, :active states directly after their base styles
        Example: .btn followed immediately by .btn:hover
        Organize modal styles better

        Currently modal styles are scattered (lines 400-500+)
        Group ALL modal-related CSS: .modal, .modal-content, .modal-header, .modal-actions
        Create more consistent naming

        You have .btn-primary, .btn-secondary, but also .icon-btn
        Consider: .btn--primary, .btn--secondary, .btn--icon (BEM methodology)
        Add CSS sections for reusable components
            /* ============================================
            COMPONENTS - Buttons
            ============================================ */

            /* ============================================
            COMPONENTS - Forms
            ============================================ */

        Move media queries to the bottom OR next to their components

        Currently you have one media query in middle - either group all at end, or place each with its component


        app.js - Organization Improvements
        ✅ What's Already Good:
        Clear section dividers with comments
        Logical grouping: State → DOM → Init → Functions → Event Listeners
        Consistent function naming conventions
        💡 How to Improve:
        Extract hardcoded values to constants
            // At top after state management:
            const DEFAULT_FOLDER_NAME = 'My Repertoire';
            const DEFAULT_FOLDER_COLOR = '#3b82f6';
            const STORAGE_KEYS = {
                folders: 'folders',
                items: 'items'
            };
        Group related functions into objects/modules
            // Instead of separate functions, create namespaces:
            const FolderManager = {
                render() { ... },
                add() { ... },
                edit() { ... },
                delete() { ... }
            };

            const ItemManager = {
                render() { ... },
                add() { ... },
                edit() { ... },
                delete() { ... }
            };
        Separate concerns into different files

            storage.js - All localStorage operations
            folders.js - Folder-related functions
            items.js - Item-related functions
            ui.js - Modal and rendering functions
            app.js - Initialize and coordinate everything

        Add JSDoc comments for functions
            /**
            * Renders all folders in the sidebar
            * Updates the folder list with item counts and active states
            */
            function renderFolders() {

        Extract HTML template strings to template functions
            function createFolderElement(folder, isActive, itemCount) {
                return `
                    <div class="folder-item ${isActive ? 'active' : ''}">
                        ...
                    </div>
                `;
            }
        Add error handling

            Wrap localStorage operations in try/catch
            Handle cases where data is corrupted
            
        Use event delegation for dynamically created buttons

        Instead of adding listeners to each button after render, add one listener to parent container