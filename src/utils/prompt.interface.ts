import Enquirer from 'enquirer'
import { WriteStream } from 'fs'
import { Writable } from 'stream'

import { PromptError } from '@interfaces/listr.interface'

export type PromptOptions<T extends boolean = false> = Unionize<
{
  [K in PromptTypes]-?: T extends true ? { type: K } & PromptOptionsType<K> & { name: string | (() => string) } : { type: K } & PromptOptionsType<K>
}
>

export type Unionize<T extends object> = {
  [P in keyof T]: T[P]
}[keyof T]

interface BasePromptOptions {
  message: string | (() => string) | (() => Promise<string>)
  initial?: boolean | number | string | (() => string) | (() => Promise<string>)
  required?: boolean
  stdin?: NodeJS.ReadStream
  stdout?: NodeJS.WriteStream
  header?: string
  footer?: string
  skip?(value: any): boolean | Promise<boolean>
  format?(value: any): any | Promise<any>
  result?(value: any): any | Promise<any>
  validate?(value: any, state: any): boolean | Promise<boolean> | string | Promise<string> | Promise<string | boolean>
  onSubmit?(name: any, value: any, prompt: Enquirer.Prompt): boolean | Promise<boolean>
  onCancel?(name: any, value: any, prompt: Enquirer.Prompt): boolean | Promise<boolean>
}

interface BasePromptOptionsWithName extends BasePromptOptions {
  name: string | (() => string)
}

interface ArrayPromptOptions extends BasePromptOptions {
  choices: string[] | BasePromptOptionsWithName[]
  maxChoices?: number
  muliple?: boolean
  initial?: number
  delay?: number
  separator?: boolean
  sort?: boolean
  linebreak?: boolean
  edgeLength?: number
  align?: 'left' | 'right'
  scroll?: boolean
}

interface BooleanPromptOptions extends BasePromptOptions {
  initial?: boolean | (() => string) | (() => Promise<string>)
}

interface StringPromptOptions extends BasePromptOptions {
  initial?: string
  multiline?: boolean
}

interface ScalePromptOptions extends ArrayPromptOptions {
  scale: StringPromptOptions[]
  margin?: [number, number, number, number]
}

interface NumberPromptOptions extends BasePromptOptions {
  min?: number
  max?: number
  delay?: number
  float?: boolean
  round?: boolean
  major?: number
  minor?: number
  initial?: number
}

interface SnippetPromptOptions extends BasePromptOptions {
  newline?: string
  fields: Partial<BasePromptOptionsWithName>[]
  template: string
}

interface SortPromptOptions extends BasePromptOptions {
  hint?: string
  drag?: boolean
  numbered?: boolean
}

interface SurveyPromptOptions extends ArrayPromptOptions {
  scale: BasePromptOptionsWithName[]
  margin: [number, number, number, number]
}

interface QuizPromptOptions extends ArrayPromptOptions {
  correctChoice: number
}

interface TogglePromptOptions extends BasePromptOptions {
  enabled?: string
  disabled?: string
}

export type PromptTypes =
  | 'AutoComplete'
  | 'BasicAuth'
  | 'Confirm'
  | 'Editable'
  | 'Form'
  | 'Input'
  | 'Invisible'
  | 'List'
  | 'MultiSelect'
  | 'Numeral'
  | 'Password'
  | 'Quiz'
  | 'Scale'
  | 'Select'
  | 'Snippet'
  | 'Sort'
  | 'Survey'
  | 'Text'
  | 'Toggle'

export type PromptOptionsType<T> = T extends 'AutoComplete'
  ? ArrayPromptOptions
  : T extends 'BasicAuth'
    ? StringPromptOptions
    : T extends 'Confirm'
      ? BooleanPromptOptions
      : T extends 'Editable'
        ? ArrayPromptOptions
        : T extends 'Form'
          ? ArrayPromptOptions
          : T extends 'Input'
            ? StringPromptOptions
            : T extends 'Invisible'
              ? StringPromptOptions
              : T extends 'List'
                ? ArrayPromptOptions
                : T extends 'MultiSelect'
                  ? ArrayPromptOptions
                  : T extends 'Numeral'
                    ? NumberPromptOptions
                    : T extends 'Password'
                      ? StringPromptOptions
                      : T extends 'Quiz'
                        ? QuizPromptOptions
                        : T extends 'Scale'
                          ? ScalePromptOptions
                          : T extends 'Select'
                            ? ArrayPromptOptions
                            : T extends 'Snippet'
                              ? SnippetPromptOptions
                              : T extends 'Sort'
                                ? SortPromptOptions
                                : T extends 'Survey'
                                  ? SurveyPromptOptions
                                  : T extends 'Text'
                                    ? StringPromptOptions
                                    : T extends 'Toggle'
                                      ? TogglePromptOptions
                                      : T extends Enquirer.Prompt
                                        ? any
                                        : any

export interface PromptSettings {
  error?: boolean
  cancelCallback?: (settings?: PromptSettings) => string | Error | PromptError | void
  stdout?: WriteStream | Writable
}
