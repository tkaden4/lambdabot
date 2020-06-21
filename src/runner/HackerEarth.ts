import { TaskEither, taskEither, tryCatch } from "fp-ts/lib/TaskEither";
import { CodeRunner, CodeSnippet, RunError, RunResult } from "./CodeRunner";
import HackerEarth = require("hackerearth-node");

export interface HackerEarthConfig {
  clientID: string;
  clientSecret: string;
}

export const apiURL = {
  v3: "https://api.hackerearth.com/v3/code/run/",
};

export class HackerEarthCodeRunner implements CodeRunner {
  config: HackerEarthConfig;
  connection: any;

  languages = [
    "C",
    "CPP",
    "CPP14",
    "CPP11",
    "CLOJURE",
    "CCSHARP",
    "GO",
    "HASKELL",
    "JAVA",
    "JAVA8",
    "JAVASCRIPT",
    "JAVASCRIPT_NODE",
    "OBJECTIVEC",
    "PASCAL",
    "PERL",
    "PHP",
    "PYTHON",
    "PYTHON3",
    "R",
    "RUBY",
    "RUST",
    "SCALA",
    "SWIFT",
    "SWIFT_4_1",
  ];

  constructor(config: HackerEarthConfig) {
    this.config = config;
    this.connection = new HackerEarth(config.clientSecret, "");
  }

  run(snippet: CodeSnippet): TaskEither<RunError, RunResult> {
    return tryCatch(
      async () => {
        const object = JSON.parse(await this.connection.run({ source: snippet.code, language: snippet.language }));
        console.log(object);
        if (object.run_status.output === undefined) {
          throw new Error(object.compile_status);
        }
        if (object.run_status.status === "RE") {
          throw new Error(object.run_status.stderr);
        }
        return {
          message: object.run_status.output,
        };
      },
      (e: any) => ({ message: e.message })
    );
  }
}
