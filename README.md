# Passport Login System

This repository contains the code for a login/registration system using Passport. This repository could be used as the foundation for developing a full login system to be used in a Web Development project.

To be implemented. Any section of code containing or interacting with the variable **users** should be altered so that the information is sent to or fetched from a database.

## Setup

Anyone attempting to run this repository should have NodeJS installed, as well as the following npm packages:

- bcrypt
- ejs
- express
- express-flash
- express-session
- method-override
- passport
- passport-local

Inside the repository, create a file with the name **.env**. This will be used to store the hash-key for password encryption.
Inside this file, type:
```
SESSION_SECRET="your key" 
```

## Run

To execute the code, navigate to the repository in terminal and type:
```
npm run devStart
```

To terminate server, press Ctrl/Cmd + C while inside the terminal.
