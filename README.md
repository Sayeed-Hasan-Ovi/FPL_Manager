# FPL_Manager

This is FPL Manager, where you compete with the other managers on the server based on how well you
can predict the performances of your favorite players in th Barclays Premier League.

The contributors to this project are:
- Sayeed Hasan Ovi (1805065) : [GitHub](https://github.com/Sayeed-Hasan-Ovi)
- Kazi Ababil Azam (1805077) : [GitHub](https://github.com/ababiltalha)

## Getting Started

### Prerequisites

Make sure you have node and oracle installed in your device.

**`Node.js`**: Install Node.js from [here](https://nodejs.org/en/download/)

**`Oracle`**: Install Oracle from [here](http://www.oracle.com/index.html) and register for an account of your own


### Getting the repository

1. Clone the repo or download zip.

### Setting up Node

1. Go to the repository directory and open terminal.

2. Install packages

    ```sh
    npm install
    ```
   This will install all the required packages for this project.

#### Setting up Oracle

1. Open SQL Plus

2. Enter credentials

   ```sh
   username: sys as sysdba
   password: password
   ```

3.  Create a new user sa

    ```sh
    create user c##fpl_manager identified by fpl;
    grant all privileges to c##fpl_manager;
    ```

#### Setting up the Database

1. Connect to oracle as c##fpl_manager in SQL Plus

2. Copy and paste from sql_dump/schemas.sql and run.

3. Copy and paste from sql_dump/PLSQL.sql and run.

4. Copy and paste from sql_dump/insert.sql and run.

5. If no errors are shown we are good to go!

#### One last step

1. Now that everything is set, open terminal in the base directory of the repo.

- Run the server

    ```sh
    npm run dev 
    ```