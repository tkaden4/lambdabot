import { TaskEither } from "fp-ts/lib/TaskEither";

export interface RunError {
  message: string;
}

export interface RunResult {
  message: string;
}

export interface CodeSnippet {
  code: string;
  language: string;
}

export interface CodeRunner {
  languages: Array<string>;
  run(snippet: CodeSnippet): TaskEither<RunError, RunResult>;
}
