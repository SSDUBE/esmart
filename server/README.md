# A Blank Node Project
A blank project for Node to quickly get started with.

Primarily for APIs

Just clone to your PC and thereafter remove the `.git` folder by running `rm -rf .git` in your terminal in the project root folder.
Then you can re-initialise with your own git by going `git init` or adding your remote via `git remote add origin [repo-link]`.

Includes:

- pre-configured build scripts
- pre-installed `dependencies`:
  - `express`
  - `dotenv`
  - `@babel/runtime`
  - `moment`
- pre-installed `devDependencies`:
  - `nodemon`
  - `babel`
  - `eslint`
  - `mocha`
  - `apidoc`
  - `node-fetch`
  - `morgan`

## Blank projects with pre-existing ORMs

There are other branches available to get you quickly setup depending on choice of ORM:

- Mongoose: `git checkout mongoose`
