# Architecture
## UI
### Design
- 390 * 844

    ![](../images/ui_design.png)

### Home page
- `>` -> Chevron_right
- Disable Create button when the dictionary is creating, and enable it after creating or encountering errors
- There is a maximum length for the dictionary name displayed on the Home page (TO DO)

- Search is case-insensitive (TO DO)
- Leave some extra space at the bottom of the list, even when the user scrolls all the way to the bottom, the last entry can still scroll above the button (TO DO)

### Home page -- Entry cards
- Browse all the entries with pagination (TO DO)
- Making the entire card clickable so that clicking anywhere on the card opens Entry Details, rather than making only the term clickable (TO DO)
- Entry cards order is based on last edited time for version 1 (TO DO)
- Use middle dot `&middot` (TO DO)

### Manage dictionary
- The modal dialog should have a backdrop (TO DO)

- Disconnect/ open/ create modal dialog (TO DO)

- Display the full dictionary name on the Manage Dictionary page (TO DO)
    - Place the pencil icon at the far right of the last line of the dictionary name (TO DO)

### Create Entry
- Add existing entries (TO DO)
    - Search is case-insensitive and only search for exactly same entry

- The error is shown under each input (TO DO)

### Entry details
- Use middle dot `&middot` (TO DO)

- The error is shown under each input (TO DO)

### Edit Entry
- Add a light top border to the delete section (`border-top`) (TO DO)

- Delete modal dialog (TO DO)

## Features
### Dictionary state
- We use the singleton `DictionaryService` to store `dictionaryState` signal, therefore we only retore `dictionaryState` when we reload the application

- Use signals for variables which are related to UI change

    ```ts
    dictionaryState = signal<DictionaryState | null>(null);
    ```

### Load the home page
- Retore `dictionaryState` when we reload the application
    - If `localStorage` contains `dbId` and `dbName`, set `dictionaryState` when `AppComponent` is initiated

- If `dictionaryState` is not `null`, ask the backend whether the corresponding working database based on `dbId` still exists (TO DO)
    - If the database doesn't exist (status = 404), clear the stale `dbId` and `dbName` from `localStorage` and reset the `dictionaryState`

- Based on current `dictionaryState`, load the corresponding page

### Disconnect Dictionary
- Remove `localStorage`
- Set `dictionaryState` as `null`
- Do not manipulate the corresponding backend database and wait for TTL module to clean it up

### Connection string
- The connection string depends on `DbId`

- Extract `dbId` from Http header when handling requests related to entries (TO DO)

### Error handling -- Backend
- Unexpected exception: Use a global exception handler to log and use `/api/error` to send `ProblemDetails` response
- Exception exception: use `Result` pattern

### Error handling -- Frontend 
- Handle cases where the backend server is unavailable
- Handle expected failures
- Handle unexpected server errors

- Use shared `extractErrorMessages` function to handle connection error and validation errors
    - `extractErrors(err: HttpErrorResponse): string[] | null`

    - If `status` is 0, connection error, return `["Unable to connect to the server, please try again later"]`

    - Validation error

    - Return `null`

### E2E testing
- Create Dictionary > Add Entry > Edit Entry > Download Dictionary
- Open Dictionary > Entries restored

- Playwright?

### Miscellaneous
- Directly save dictionary name in SQLite database

    ```
    The connected dictionary: dictionary name
    ```

- How do we know there are changes before the database is downloaded (TO DO)

    ```ts
    localStorage.setItem('hasUndownloadedChanges', 'true');
    ```

## Create a new dictionary
### Workflow
- Create a dictionary and download it to local

    Frontend | Backend
    -|-
    Create a dictionary request |
    ||Generate `dbId` 
    ||Create SQLite database
    ||Send `dbId` and `dbName` to Frontend
    Save `dbId` and `dbName` in the browser local storage and `dictionaryState`|

### Error handling -- Backend
- Unexpected exception: `PersonalDictionary` folder doesn't exist
    - Return 500 response

### Error handling -- Frontend
- Status = 0, server unavailable > "Unable to connect to the server. Please try again."
- Status = 500, server error > "Unable to create the dictionary. Please try again."
- Other statuses > "An unexpected error occurred. Please connect the administer."

### Tests -- Backend
- A small number of integration tests often provide more value for this kind of application than a large number of heavily mocked unit tests
    - They catch problems involving SQLite, EF Core migrations, routing, dependency injection, middleware, and the actual HTTP pipeline—things that isolated unit tests often cannot detect

- `CreateAsync_ShouldCreateDictionaryWithDefaultName`
    - Unit test
    - `DictionaryService`

- `CreateAsync_ShouldCreateValidDictionaryDatabase`
    - `DictionaryDbManager` class
    - Integration test
    - SQLite database is created
    - Category and Metadata table are created and their data are correct

- `Create_ShouldReturnCreatedDictionary`
    - API integration
    - WebApplicationFactory?
    - `POST /api/dictionaries/create` returns 200 OK
    - The response body can be deserialized into DictionaryDto
    - `dbId` is a valid non-empty Guid
    - `dbName` is "Untitled Dictionary"
    - The database file corresponding to the returned `dbId` exists

- `Create_Returns500ProblemDetails_WhenUnexpectedExceptionOccurs`
    - API integration
    - Create database failure > 500 ProblemDetails

### Tests -- Backend -- Case A
- Someone changes:

    ```cs
    private const string DefaultName = "Untitled Dictionary";
    ```

- to:

    ```cs
    "Dictionary"
    ```

- Your test: `CreateAsync_ShouldCreateDictionaryWithDefaultName` will fail

- This test has value because it verifies an actual business requirement: a newly created dictionary should have the expected default name

### Tests -- Backend -- Case B
- Someone removes:

    ```cs
    await dictionaryDbContext.Database.MigrateAsync();
    ```

- Your real SQLite integration test will fail

- This test has value because it verifies that creating a dictionary actually creates a usable database with the required schema
    - A mocked unit test could easily miss this problem

### Tests -- Backend -- Case C
- Someone removes:

    ```cs
    dictionaryDbContext.Metadata.Add(...);
    ```

- The integration test will fail

- This test has value because the application expects a newly created dictionary to contain its initial metadata
    - The test verifies the observable result in the database rather than merely checking whether `Add()` was called

### Tests -- Backend -- Case D
- Someone changes the controller route from:

    ```cs
    [HttpPost("create")]
    ```

- to:

    ```cs
    [HttpGet("create")]
    ```

- A controller unit test may not notice this, because it usually calls the controller method directly
    - But an API integration test that sends: `POST /api/dictionaries/create` will fail

- This test has value because it verifies the real HTTP contract between your Angular frontend and ASP.NET Core backend, including routing and the HTTP method

### Tests -- Backend -- Case E
- Someone changes the `DictionaryService` constructor or its dependency configuration in a way that breaks dependency injection

- For example:

    ```cs
    public DictionaryService(...)
    ```
    - can no longer be constructed by ASP.NET Core DI

- A unit test that manually creates the controller or service may not notice the problem
    - An API integration test will fail when ASP.NET Core tries to build or resolve the real application dependencies

-  This test has value because it verifies that the application is actually wired together correctly

### Tests -- Frontend
- Test `ExtractErrorMessages()`
    - Failure - 500 → create-specific error
    - Failure - 500 > ProblemDetails/detail → 显示服务器信息

- Test `DictionaryService` HTTP request

    ```ts
    it ('should POST to /api/dictionaries/create')
    ```
    - Use `HttpTestingController`

    - Assertion

        ```
        method === POST
        URL ===
        ```

    - Get result

        ```
        {
            dbId: '...',
            name: 'Untitled Dictionary'
        }

    - Confirm `dictionaryState` is updated

### Tests -- Frontend -- `CreateDictionaryComponent` test
- `it('should call DictionaryService.create when the button is clicked')`
    - Click Create > DictionaryService.create()

- `it('should show creating state while creating a dictionary')`
    - Button disabled / `Creating...` displayed

- `it('should emit created when creation succeeds')`
    - Success - emit created()

- `it('should display an error and reset creating state when creation fails')`
    - For the component test, you only need to choose one representative error case, for example:
    
    ```ts
    dictionaryService.create.and.returnValue(
        throwError(() => new HttpErrorResponse({
            status: 500
        }))
    );
    ```
    - Then verify that the UI displays:

    ```
    Unable to create the dictionary. Please try again.
    ```

    - There is no need to repeat every `ExtractErrorMessages()` error case in the component tests, because those cases are already covered by the dedicated `ExtractErrorMessages()` tests
    - Failure - isCreating === false

- `it('should not emit created when creation fails')`
    - Failure - don’t emit created()

## Open a dictionary  (TO DO)
### Workflow
- Open a dictionary

    Frontend | Backend
    -|-
    Send SQLite database to Backend|
    ||Generate `DbId` 
    ||Send `dbId` and `dbName` to Frontend
    Save `dbId` and `dbName` in the browser local storage and `dictionaryState`|

### SQLite database operations
- Users upload a SQLite database to backend
- Copy it as a working copy and move to the working directory
- Apply migration at runtime to working copy

### Backend error handling
- Expected failure: Dictionary doesn't exist
- Unexpected exception: the file is not a valid SQLite database
- Unexpected exception: Metadata is missing 

### Frontend error handling
- Status = 0, server unavailable > "Unable to connect to the server, please try again."
- Status = 500, server error > "Unable to open the dictionary. Please try again."
- Other statuses > "An unexpected error occurred. Please connect the administer."

## Download a dictionary (TO DO)
### Workflow
- Download a dictionary to local

    Frontend | Backend
    -|-
    Download a dictionary request |
    ||Send db with `DbId` to Frontend
    Allow user to save the database|

## TTL (time to live) cleanup (TO DO)
### TTL
- Get the database last accessed time, cleanup the database that is idle for 24 hours

### Cold start
- App cold start -> CleanupExpiredDatabases() -> start API -> BackgroundService cleans up temporary dictionary periodically

## Progress
### Phases
- Phase 1: Implement the dictionary lifecycle with the real frontend and backend

- Phase 2: Build the Entry UI using dummy data

- Phase 3: Implement the Entry API with EF Core

- Phase 4: Replace the dummy `EntryService` with HTTP calls

## Infrastructure
### `DictionaryDbManager`
- Create SQLite database
    - Backend
    - Frontend
    - Logging

- Open SQLite database
    - Backend (TO DO)
    - Frontend (TO DO)

- Download SQLite database
    - Backend (TO DO)
    - Frontend (TO DO)

- Disconnect SQLite database
    - Frontend

### `EntryRepository`
- Read entries based on `DbId`
- Insert entries based on `DbId`
- Edit entries based on `DbId`
- Delete entries based on `DbId`

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

## Production
### Deployment
- Remove disconnect dictionary button?
- Version specification
- Production log level

## Verson 2
### Add category
- Add CRUD category operations

### Sort Entry Card

### Log
- Log event id?

## To do
### To do
- 加测试

- 后端优先测这些：
    - Open dictionary 对合法 / 非法 SQLite 文件的处理
    - Entry CRUD
    - expected error 是否返回正确 status / ProblemDetails
    - 重要的数据持久化行为

- Load the home page logic