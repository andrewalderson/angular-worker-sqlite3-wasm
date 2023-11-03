# Angular Worker Sqlite3 Wasm

A reference project for adding Sqlite Wasm to an Angular project.

This project uses Angular v17 and EBuild because there is a bug in Webpack or the Angular Cli that causes the use of Origin Private File System yo fail. [Link](https://github.com/webpack/webpack/issues/17779#issue-1974941617)

This particular project explores using Sqlite with Origin Private File System for persistant storage.