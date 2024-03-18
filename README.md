## Discord URL Media MySQL Replacer

This application is designed to automate the process of replacing invalid URLs media stored in a MySQL database with valid media URLs fetched from Discord messages.

- **Streamable**: [View](https://streamable.com/ehwgq5)
________________________________________________________________

### Usage:
1. **Prerequisites:**
   - Install [Node.js](https://nodejs.org/en/download/) on your operating system.
   - Open the `index.js` file in a text editor ([Visual Studio Code](https://code.visualstudio.com/Download) or [Notepad++](https://notepad-plus-plus.org/downloads/)).
   - Adjust the `Config`, `Database `, and `Tables` variables according to your Discord bot token, MySQL database configuration, and table/column names.

2. **Backup your database:**
   - It's optional but highly recommended to create a backup of your database before running the application.

3. **Installation:**
   - Run `install.bat` and wait for the libraries to be downloaded.

4. **Execution:**
   - Run `start.bat` and wait for the process to complete.
   - Upon completion, press `CTRL+C` in your terminal to stop the execution and close the window.

________________________________________________________________

### Notes:
- Sometimes, the application may fail to find and replace the URL in the database. If this occurs, repeat the process.
- It's advisable to run the application before starting your server.
- This application has not been tested extensively on databases with large datasets. Adjustments may be required for optimal performance.
