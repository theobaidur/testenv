#! /usr/bin/env node
import { Command } from "commander";
import dotenv from "dotenv";
import dotenvExpand from "dotenv-expand";
import {sync} from "find-up";
import fs from "fs";
import glob from "glob";
import chalk from "chalk";

const packageFile = sync("package.json", { cwd: __dirname });

if (!packageFile) { 
    console.error("package.json not found");
    process.exit(1);
}

const pkg = JSON.parse(fs.readFileSync(packageFile, "utf8"));
const program = new Command();

/**
 * This is the entry point for the CLI
 * Often we write .env files and find that they don't work. 
 * Probably because we have a typo or something.
 * The purpose of this cli is to provide a way to test .env files.
 * The simple cli syntax is:
 *  testenv # will look for .env in the current directory or parent directories and test it
 *  testenv <path> # will look for .env in the specified path and <path> can be a glob pattern too
 *  testenv <path> <key> # will look for <key> in the specified path and test it
 *  testenv -v # will print the version
 *  testenv -h # will print the help
 */

const name = pkg.name ? pkg.name.split("/").pop() : "testenv";

const getFileByPattern = async (pattern: string) => { 
    return new Promise<string[]>((resolve, reject) => { 
        glob(pattern, (err, files) => { 
            if (err) { 
                reject(err);
            } else { 
                resolve(files);
            }
        });
    });
}

const testEnv = async (path: string, key?: string) => {
    let paths: string[] = [];
    if (path) {
        paths = await getFileByPattern(path);
    } else { 
        const tmp = sync(".env", { cwd: __dirname });
        if (tmp) { 
            paths.push(tmp);
        }
    }
    if (!paths.length) {
        console.log(
            "No " + chalk.red(".env") + " file found"
        );
        process.exit(1);
    } else { 
        for (const path of paths) { 
            const fileContent = fs.readFileSync(path, "utf8");
            const env = dotenv.parse(fileContent);
            dotenvExpand.expand({ parsed: env });
            if (key) { 
                if (key in env) {
                    console.log(
                        chalk.green(`${path}:`)+ ` ${key}=${env[key]}`
                    );
                } else { 
                    console.log(
                        chalk.red(`${path}:`)+ ` ${key} not found`
                    );
                }
            } else {
                console.log(
                    JSON.stringify(env, null, 2)
                );
            }
        }
    }
}

program
    .name(name as string)
    .version(pkg.version, "-v, --version, -V", "output the current version")
    .description(pkg.description as string)
    .description("test .env file")
    .argument("[path]", "path to .env file or directory containing .env file, if not specified the current directory will be used")
    .argument("[key]", "key to test, if not specified all keys will be tested")
    .option("-h, --help", "usage information",
        () => { 
            program.help();
            process.exit(0);
        }
    )
    .action((path, key) => {
        testEnv(path, key);
    });

program.parse();