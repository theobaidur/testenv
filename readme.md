# testenv

A simple utility to test your .env files.

## Description

This utility simplifies the task of testing your .env files. With its use of the [dotenv](https://www.npmjs.com/package/dotenv) and [dotenv-expand](https://github.com/motdotla/dotenv-expand) packages, it helps detect and resolve issues such as typos, syntax errors, commented-out lines, or forgotten variables that can arise in your environment variables.

Although, it doesn't tell if there's a problem with the file, it only tells you what variables can be read by the [dotenv](https://www.npmjs.com/package/dotenv) package.

## Installation

```bash
# using npm
npm install -g testenv

# using yarn
yarn global add testenv

```

## Usage

```bash
testenv [path] [key] # path and key are optional

# If path is not provided, it will look for .env file in the current directory and its parent directories recursively. path supports glob patterns.

# If key is not provided, it will print all the variables in the .env file in json format.

testenv -h or --help # to see the help
testenv -v or --version # to see the version

```