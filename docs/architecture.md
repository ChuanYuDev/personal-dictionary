# Architecture
## UI
### Design
- 390 * 844

    ![](../images/ui_design.png)

### Home page
- `>` -> Chevron_right

- Browse all the entries with pagination
- Making the entire card clickable so that clicking anywhere on the card opens Entry Details, rather than making only the term clickable

- Leave some extra space at the bottom of the list, even when the user scrolls all the way to the bottom, the last entry can still scroll above the button
- Use middle dot `&middot`

- Search is case-insensitive
- Entry card list uses alphebet order for version 1

### Manage dictionary
- The modal dialog should have a backdrop

- Disconnect/ open/ create modal dialog

### Create Entry
- Add existing entries
    - Search is case-insensitive and only search for exactly same entry

- The error is shown under each input

### Entry details
- Use middle dot `&middot`

- The error is shown under each input

### Edit Entry
- Add a light top border to the delete section (`border-top`)

- Delete modal dialog

## Workflow
### Load the home page
- Check if `localStorage` contains `dbId`

- If there is no `dbId`, load Page 1

- If there is a `dbId`, ask the backend whether the corresponding working database still exists

- If the database doesn't exist, clear the stale `dbId` from `localStorage` and load Page 1

- If the database exists, restore current dictionary state and load Page 2

### Dictionary state
- We use the singleton `DictionaryService` to store `dictionaryState` signal, therefore we only retore `dictionaryState` when we reload the application

### Create a new dictionary
- Create a dictionary and download it to local

    Frontend | Backend
    -|-
    Create a dictionary request |
    ||Generate `dbId` 
    ||Create SQLite database
    ||Send `dbId` to Frontend
    Save `dbId` in the browser local storage or local variable|

### Open a dictionary 
- Open a dictionary

    Frontend | Backend
    -|-
    Send SQLite database to Backend|
    ||Generate `DbId` 
    ||Send `DbId` to Frontend
    Save `dbId` in the browser local storage or local variable|

### Database workflow
- Users upload a SQLite database to backend
- Copy it as a working copy
- Apply migration at runtime to working copy

### Download a dictionary
- Download a dictionary to local

    Frontend | Backend
    -|-
    Download a dictionary request |
    ||Send db with `DbId` to Frontend
    Allow user to save the database|

## SQLite
### Category
- Schema
    - Id
    - Name

- Insert "Word", "Phrase" directly

### Entry
- Schema
    - Id
    - Term
    - Pronunciation
    - PartOfSpeech
    - Meaning
    - Notes
    - IsFavorite
    - CategoryId
    - CreatedAt

- The relationship between `Category` and `Entry` is one-to-many, therefore `Category` is the principal entity, `Entry` is the dependent entity

### Metadata
- Schema
    - Id
    - Name
    - CreatedAt

## TTL (time to live) cleanup
### TTL
- Get the database last accessed time, cleanup the database that is idle for 24 hours

### Cold start
- App cold start -> CleanupExpiredDatabases() -> start API -> BackgroundService cleans up temporary dictionary periodically

# To do
## Version 1
### Phase
- Phase 1: Implement the dictionary lifecycle with the real frontend and backend

- Phase 2: Build the Entry UI using dummy data

- Phase 3: Implement the Entry API with EF Core

- Phase 4: Replace the dummy `EntryService` with HTTP calls

### Backend error handling
- Create dictionary
    - Unexpected exception: `PersonalDictionary` folder doesn't exist

- Open dictionary
    - Expected failure: Dictionary doesn't exist
    - Unexpected exception: the file is not a valid SQLite database
    - Unexpected exception: Metadata is missing 

- Exception exception: use `Result` pattern
- Unexpected exception: Use a global exception handler (Done)

### Frontend Error handling
- Handle errors
    - Handle expected failures
    - Handle unexpected server errors
    - Handle cases where the backend server is unavailable

- Create dictionary

    - request starts → disable Create button

    - 200 → save returned `dbId` → go to connected state

    - 500 → show create failed message → enable Create button again

    - server unavailable → show connection error → enable Create button again

- Open Dictionary：
    - 404 → Dictionary no longer exists → remove stale `dbId` → return to Page 1 → optionally show a message

    - 500 → Something went wrong while opening the dictionary → DON'T remove dbId

    - Server unavailable → Unable to connect to the server → DON'T remove dbId

### Miscellaneous
- The connection string depends on `DbId`
- TTL cleanup

- Directly save dictionary name in SQLite database (Done)

    ```
    The connected dictionary: dictionary name
    ```

- How do we know there are changes before the database is downloaded

    ```ts
    localStorage.setItem('hasUndownloadedChanges', 'true');
    ```

- Use signals for the variable which is related to UI change

    ```ts
    dictionaryState = signal<DictionaryState | null>(null);
    isCreating = signal(false);
    ```

### `DictionaryDbManager`
- Create SQLite database
    - Backend (Done)
    - Frontend
    - Logging (Done)

- Open SQLite database
    - Backend
    - Frontend

- Download SQLite database
    - Backend
    - Frontend

- Disconnect SQLite database
    - Frontend

### `EntryRepository`
- Read entries based on `DbId`
- Insert entries based on `DbId`
- Edit entries based on `DbId`
- Delete entries based on `DbId`

## Verson 2
### Add category
- Add CRUD category operations

### Sort Entry Card

### Log
- Production log level
- Log event id?
