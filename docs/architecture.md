# Architecture

## Workflow
### Create a dictionary
- Create a dictionary and download it to local

    Frontend | Backend
    -|-
    Create a dictionary request |
    ||Create SQLite database
    ||Generate `DbId` 
    ||Send `DbId` and db to Frontend
    Save `DbId` in browser local storage|

### Open a dictionary 
- Open a dictionary

    Frontend | Backend
    -|-
    Open a SQLite database |
    Send it to Backend|
    ||Generate `DbId` 
    ||Send `DbId` to Frontend
    Save `DbId` in browser local storage|

### Download a dictionary
- Download a dictionary to local

    Frontend | Backend
    -|-
    Download a dictionary request |
    ||Send db with `DbId` to Frontend
    Allow user to save the database|

## TTL (time to live) cleanup
### TTL
- Get the database last accessed time, cleanup the database that is idle for 24 hours

### Cold start
- App cold start -> CleanupExpiredDatabases() -> start API -> BackgroundService cleans up temporary dictionary periodically

## UI
### Landing page
- If there is a connected dictionary:
    - `DbId` in Frontend
    - Temporary db in Backend

    ```
    The connected dictionary: dictionary name
    Download
    ```

- If there isn't a connected dictionary:
    - Only show "Connection"

- Browse all the entries with pagination
    - With edit

### Connection 
- Create and open

    ```
    Create a new dictionary
    Open an existing dictionary
    ```

### Search
- Based on word, like, category

### Edit page
- Edit
- Remove with confirmation

### Create
- Create an entry

### Category
- Create 

## SQLite
### Category schema
- Name

- Insert "Word", "Phrase" directly

### Word schema
- Word
- Pronounciation
- Meaning
- Notes
- Like
- Category
- LastAccessedAt