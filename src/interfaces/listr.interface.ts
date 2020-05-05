import { Observable } from 'rxjs'
import { Readable } from 'stream'

import { stateConstants } from '@constants/state.constants'
import { Task } from '@lib/task'
import { MultiLineRenderer } from '@renderer/default.renderer'
import { SilentRenderer } from '@renderer/silent.renderer'
import { VerboseRenderer } from '@renderer/verbose.renderer'
import { Listr } from '@root/index'
import { PromptOptionsType, PromptTypes } from '@utils/prompt.interface'

export type ListrContext = any

export type ListrDefaultRendererValue = 'default'
export type ListrDefaultRenderer = typeof MultiLineRenderer
export type ListrFallbackRendererValue = 'verbose'
export type ListrFallbackRenderer = typeof VerboseRenderer

export declare class ListrClass
<Ctx = ListrContext, Renderer extends ListrRendererValue = ListrDefaultRendererValue, FallbackRenderer extends ListrRendererValue = ListrFallbackRendererValue> {
  tasks: Task<Ctx, ListrGetRendererClassFromValue<Renderer>>[]
  constructor(task?: readonly ListrTask<Ctx, ListrGetRendererClassFromValue<Renderer>>[], options?: ListrBaseClassOptions<Ctx, Renderer, FallbackRenderer>)
  public run(ctx?: Ctx): Promise<Ctx>
  public add(tasks: ListrTask<Ctx, ListrGetRendererClassFromValue<Renderer>> | readonly ListrTask<Ctx, ListrGetRendererClassFromValue<Renderer>>[]): void
}

export interface ListrTaskObject<Ctx, Renderer extends ListrRendererFactory> extends Observable<ListrEvent> {
  id: string
  title?: string
  output?: string
  task: (ctx: Ctx, task: ListrTaskWrapper<Ctx, Renderer>) => void | ListrTaskResult<Ctx>
  skip: boolean | string | ((ctx: Ctx) => boolean | string | Promise<boolean> | Promise<string>)
  subtasks: ListrTaskObject<Ctx, any>[]
  state: string
  check: (ctx: Ctx) => void
  run: (ctx: Ctx, wrapper: ListrTaskWrapper<Ctx, Renderer>) => Promise<void>
  options: ListrOptions
  rendererOptions: ListrGetRendererOptions<Renderer>
  rendererTaskOptions: ListrGetRendererTaskOptions<Renderer>
  spinner?: () => string
  hasSubtasks(): boolean
  isPending(): boolean
  isSkipped(): boolean
  isCompleted(): boolean
  isEnabled(): boolean
  isPrompt(): boolean
  hasFailed(): boolean
  hasTitle(): boolean
}

export interface ListrTask<Ctx, Renderer extends ListrRendererFactory> {
  title?: string
  task: (ctx: Ctx, task: ListrTaskWrapper<Ctx, Renderer>) => void | ListrTaskResult<Ctx>
  skip?: boolean | string | ((ctx: Ctx) => boolean | string | Promise<boolean> | Promise<string>)
  enabled?: boolean | ((ctx: Ctx) => boolean | Promise<boolean>)
  options?: ListrGetRendererTaskOptions<Renderer>
}

export interface ListrTaskWrapper<Ctx, Renderer extends ListrRendererFactory> {
  title: string
  output: string
  newListr(task: ListrTask<Ctx, Renderer> | ListrTask<Ctx, Renderer>[], options?: ListrSubClassOptions<Ctx, Renderer>): Listr<Ctx, any, any>
  report(error: Error): void
  skip(message: string): void
  run(ctx?: Ctx, task?: ListrTaskWrapper<Ctx, Renderer>): Promise<void>
  prompt<T = any, P extends PromptTypes = PromptTypes>(type: P, options: PromptOptionsType<P>): Promise<T>
}

export type ListrTaskResult<Ctx> = string | Promise<any> | ListrClass<Ctx, ListrRendererFactory, any> | Readable | Observable<any>

export type ListrBaseClassOptions
<Ctx = ListrContext, Renderer extends ListrRendererValue = ListrDefaultRendererValue, FallbackRenderer extends ListrRendererValue = ListrFallbackRendererValue> = ListrOptions<Ctx>
& ListrDefaultRendererOptions<Renderer>
& ListrDefaultNonTTYRendererOptions<FallbackRenderer>

export type ListrSubClassOptions
<Ctx = ListrContext, Renderer extends ListrRendererValue = ListrDefaultRendererValue> =
ListrOptions<Ctx>
& Omit<ListrDefaultRendererOptions<Renderer>, 'renderer'>

export interface ListrOptions<Ctx = ListrContext> {
  concurrent?: boolean | number
  exitOnError?: boolean
  ctx?: Ctx
}

export type CreateClass<T> = new(...args: any[]) => T

export type ListrGetRendererClassFromValue<T extends ListrRendererValue> = |
T extends 'default' ? typeof MultiLineRenderer :
  T extends 'verbose' ? typeof VerboseRenderer :
    T extends 'silent' ? typeof SilentRenderer :
      T extends ListrRendererFactory ? T :
        never

export type ListrGetRendererValueFromClass<T extends ListrRendererFactory> = |
T extends MultiLineRenderer ? 'default' :
  T extends VerboseRenderer ? 'verbose' :
    T extends SilentRenderer ? 'silent' :
      T extends ListrRendererFactory ? T :
        never

export type ListrGetRendererOptions<T extends ListrRendererValue> = |
T extends 'default' ? typeof MultiLineRenderer['rendererOptions'] :
  T extends 'verbose' ? typeof VerboseRenderer['rendererOptions'] :
    T extends 'silent' ? typeof SilentRenderer['rendererOptions'] :
      T extends ListrRendererFactory ? T['rendererOptions'] :
        never

export type ListrGetRendererTaskOptions<T extends ListrRendererValue> = |
T extends 'default' ? typeof MultiLineRenderer['rendererTaskOptions'] :
  T extends 'verbose' ? typeof VerboseRenderer['rendererTaskOptions'] :
    T extends 'silent' ? typeof SilentRenderer['rendererTaskOptions'] :
      T extends ListrRendererFactory ? T['rendererTaskOptions'] :
        never

export interface ListrDefaultRendererOptions<T extends ListrRendererValue> {
  renderer?: T
  rendererOptions?: ListrGetRendererOptions<T>
}

export interface ListrDefaultNonTTYRendererOptions<T extends ListrRendererValue> {
  nonTTYRenderer?: T
  nonTTYRendererOptions?: ListrGetRendererOptions<T>
}

export type ListrRendererOptions <Renderer extends ListrRendererValue, FallbackRenderer extends ListrRendererValue> =
ListrDefaultRendererOptions<Renderer> & ListrDefaultNonTTYRendererOptions<FallbackRenderer>

export declare class ListrRenderer {
  public static rendererOptions: Record<string, any>
  public static rendererTaskOptions: Record<string, any>
  public static nonTTY: boolean
  constructor(tasks: readonly ListrTaskObject<any, ListrRendererFactory>[], options: typeof ListrRenderer.rendererOptions)
  public render(): void
  public end(err?: Error): void
}

export interface ListrRendererFactory {
  rendererOptions: Record<string, any>
  rendererTaskOptions: Record<string, any>
  nonTTY: boolean
  new(tasks: readonly ListrTaskObject<any, ListrRendererFactory>[], options: typeof ListrRenderer.rendererOptions): ListrRenderer
}

export type ListrRendererValue = 'silent' | 'default' | 'verbose' | ListrRendererFactory

export interface ListrEvent {
  type: ListrEventTypes
  data?: string | boolean
}

export class ListrError extends Error {
  public errors?: ListrError[]
  constructor (message) {
    super(message)
    this.name = 'ListrError'
  }
}

export class PromptError extends Error {
  constructor (message) {
    super(message)
    this.name = 'PromptError'
  }
}

export type ListrEventTypes = 'TITLE' | 'STATE' | 'ENABLED' | 'SUBTASK' | 'DATA'

export type StateConstants = stateConstants
