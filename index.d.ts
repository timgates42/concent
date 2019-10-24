import { Component, ReactNode } from 'react';
import { toASCII } from 'punycode';

export type TAnyObj = { [key: string]: any };
export type TStar = '*';

type AnyFn = (...args: any[]) => any;
type OnCallBack<EventCbArgs extends any[]> = (...args: EventCbArgs) => void;
type RefComputedFn<FnCtx extends IFnCtxBase, FnReturnType> = (
  oldVal: string,
  newVal: any,
  fnCtx: FnCtx,//user decide it is FnCtx or FnCtxConnect
) => FnReturnType;
type RefComputedFnDesc<FnCtx extends IFnCtxBase, FnReturnType> = {
  fn: RefComputedFn<FnCtx, FnReturnType>;
  compare?: boolean;
  depKeys?: string[];
};

type ComputedFn = (
  oldVal: any,
  newVal: any,
  fnCtx: IFnCtxBase,//user decide it is FnCtx or FnCtxConnect
) => any;
type ComputedFnDesc = {
  fn: ComputedFn;
  compare?: boolean;
  depKeys?: string[];
};

interface DefaultBase {
  $$global: any,
  $$default: any,
  $$cc?: any,
  [customizedKey: string]: any;
}
export interface DefaultState extends DefaultBase {
}
interface DefaultCu extends DefaultBase {
}


/**
 * 
 * @param eventName 
 * @param cb 
 * suggest use conditional type to maitain EventCbArgsType
 * 
    // or type EventCbArgsType<EventName>
    type ET<EventName> = 
      EventName extends 'foo' ? [string, number] :
      EventName extends 'bar' ? [string, boolean] :
      [];
 */
declare function refCtxOn<EventCbArgs extends any[]>(eventName: string, cb: OnCallBack<EventCbArgs>): void;
declare function refCtxOn<EventCbArgs extends any[]>(eventDesc: [string, string?], cb: OnCallBack<EventCbArgs>): void;
declare function refCtxOn<EventCbArgs extends any[]>(eventDesc: { name: string, identity?: string }, cb: OnCallBack<EventCbArgs>): void;

declare function refCtxEmit<EventCbArgs extends any[]>(eventName: string, ...args: EventCbArgs): void;
declare function refCtxEmit<EventCbArgs extends any[]>(eventDesc: [string, string?], ...args: EventCbArgs): void;
declare function refCtxEmit<EventCbArgs extends any[]>(eventDesc: { name: string, identity?: string }, ...args: EventCbArgs): void;

declare function refCtxOff(eventName: string): void;
declare function refCtxOff(eventDesc: [string, string?]): void;
declare function refCtxOff(eventDesc: { name: string, identity?: string }): void;

/**
 * 
 * @param type 
 * @param payload 
 * @param renderKey 
 * @param delay 
 *  user should mannually make sure fnName an fn is mapped correctly, if you don not want to do so, you can write code like below
 * 
 *  function aaa(){}; function bbb(){};
    type ReducerFnType<FnName> =
      FnName extends 'aaa' ? typeof aaa :
      FnName extends 'bbb' ? typeof bbb :
      null;

    type PayloadType<FnName extends string> = (Parameters<ReducerFnType<FnName>>)[0];
    type ReducerFnResultType<FnName extends string> = ReturnType<ReducerFnType<FnName>>;
 */
declare function refCtxDispatch<Fn extends AnyFn>(type: string, payload: (Parameters<Fn>)[0] | never, renderKey?: string, delay?: string): Promise<ReturnType<Fn>>;
declare function refCtxDispatch<TypeAsFn extends AnyFn>(type: TypeAsFn, payload: (Parameters<TypeAsFn>)[0] | never, renderKey?: string, delay?: string): Promise<ReturnType<TypeAsFn>>;
declare function refCtxDispatch<TypeAsFn extends AnyFn>(type: { module: string, fn: TypeAsFn }, payload: (Parameters<TypeAsFn>)[0] | never, renderKey?: string, delay?: string): Promise<ReturnType<TypeAsFn>>;

declare function refCtxLazyDispatch<Fn extends AnyFn>(type: string, payload?: (Parameters<Fn>)[0], renderKey?: string, delay?: string): Promise<ReturnType<Fn>>;
declare function refCtxLazyDispatch<TypeAsFn extends AnyFn>(type: TypeAsFn, payload?: (Parameters<TypeAsFn>)[0], renderKey?: string, delay?: string): Promise<ReturnType<TypeAsFn>>;
declare function refCtxLazyDispatch<TypeAsFn extends AnyFn>(type: { module: string, fn: TypeAsFn }, payload?: (Parameters<TypeAsFn>)[0], renderKey?: string, delay?: string): Promise<ReturnType<TypeAsFn>>;


declare function refCtxComputed<IFnCtx extends IFnCtxBase, FnReturnType>(retKey: string, computedFn: RefComputedFn<IFnCtx, FnReturnType>): void;

//////////////////////////////////////////
// exposed interface
//////////////////////////////////////////

/**
 * use this interface to match ctx type that component only defined belong module
 * 
 * concent will build ctx for every instance
 * for class get get like this: this.ctx
 * for function get get like this: const ctx = useConcent('foo');
 */
export interface IRefCtx<RootState extends DefaultState, ModuleState, RefState, Rccu extends TAnyObj> {
  state: RefState;
  moduleState: ModuleState;
  globalState: RootState['$$global'];
  connectedState: {};
  refComputed: {};
  refConnectedComputed: Rccu;
  moduleComputed: {};
  globalComputed: object;
  connectedComputed: {};
  on: typeof refCtxOn;
  emit: typeof refCtxEmit;
  off: typeof refCtxOff;
  dispatch: typeof refCtxDispatch;
  lazyDispatch: typeof refCtxLazyDispatch;
  computed: typeof refCtxComputed;
}
/**
 * match ctx type: use belonged module computed
 */
export interface IRefCtxMcu
  <RootState extends DefaultState, ModuleState, RefState, ModuleCu, Rccu extends TAnyObj>
  extends IRefCtx<RootState, ModuleState, RefState, Rccu> {
  moduleComputed: ModuleCu;
}
/**
 * match ctx type: use belonged module computed, connect other modules
 */
export interface IRefCtxMcuCon
  <RootState extends DefaultState, ModuleState, RefState, ModuleCu, ConnectedModules extends keyof RootState, RootCu extends RootState, Rccu extends TAnyObj>
  extends IRefCtx<RootState, ModuleState, RefState, Rccu> {
  moduleComputed: ModuleCu;
  connectedState: Pick<RootState, ConnectedModules>;
  connectedComputed: Pick<RootCu, ConnectedModules>;  
}
/**
 * match ctx type: use belonged module computed, define ref computed in setup
 */
export interface IRefCtxMcuRcu
  <RootState extends DefaultState, ModuleState, RefState, ModuleCu, RefCu, Rccu extends TAnyObj>
  extends IRefCtx<RootState, ModuleState, RefState, Rccu> {
  moduleComputed: ModuleCu;
}

// export function dodo<TA, TB, keyof TA extends keyof TB>(a: TA, b: TB): void; 


type MyPick<RootState extends DefaultState, ConnectedModules extends keyof DefaultState> = Pick<RootState, ConnectedModules>;

type Super<T> = T extends infer U ? U : object;

/**
 * match ctx type: use belonged module computed, connect other modules, define ref computed in setup
 */
export interface IRefCtxMcuConRcu
  <RootState extends DefaultBase, ModuleState, RefState, ModuleCu, RootCu extends DefaultState, ConnectedModules extends keyof DefaultBase, RefCu, Rccu extends TAnyObj>
  extends IRefCtx<RootState, ModuleState, RefState, Rccu> {
  moduleComputed: ModuleCu;
  connectedState: MyPick<RootState, ConnectedModules>;
  connectedComputed: MyPick<RootCu, ConnectedModules>;
  refComputed: RefCu;
}
/**
 * match ctx type: connect other modules
 */
export interface IRefCtxCon
  <RootState extends DefaultState, ModuleState, RefState, ConnectedModules extends keyof RootState, RootCu extends RootState, Rccu extends TAnyObj>
  extends IRefCtx<RootState, ModuleState, RefState, Rccu> {
  // overwrite connectedState , connectedComputed
  connectedState: Pick<RootState, ConnectedModules>;
  connectedComputed: Pick<RootCu, ConnectedModules>;
}
/**
 * match ctx type: connect other modules, define ref computed in setup
 */
export interface IRefCtxConRcu
  <RootState extends DefaultState, ModuleState, RefState, ConnectedModules extends keyof RootState, RootCu extends RootState, RefCu, Rccu extends TAnyObj>
  extends IRefCtx<RootState, ModuleState, RefState, Rccu> {
  connectedState: Pick<RootState, ConnectedModules>;
  connectedComputed: Pick<RootCu, ConnectedModules>;
  refComputed: RefCu;
}
/**
 * match ctx type: define ref computed in setup
 */
export interface IRefCtxRcu
  <RootState extends DefaultState, ModuleState, RefState, RefCu, Rccu extends TAnyObj>
  extends IRefCtx<RootState, ModuleState, RefState, Rccu> {
  refComputed: RefCu;
}

export interface IFnCtxBase {
}
export interface IFnCtx<RootState extends DefaultState, ModuleState, RefState, RefCtx extends IRefCtx<RootState, ModuleState, RefState, TAnyObj>> extends IFnCtxBase{
  retKey: string;
  setted: string[];
  changed: string[];
  stateModule: string;
  refModule: string;
  oldState: object;
  committedState: object;
  refCtx: RefCtx;
}

declare class ConcentComponent extends Component {
}

interface RegisterOptions<RootState, ModuleState, RefState> {
  module?: string;// default '$$default'
  watchedKeys?: (keyof ModuleState)[];
  storedKeys?: (Exclude<keyof RefState, keyof ModuleState>)[];
  connect?: (keyof RootState | '$$global' | '$$default')[] |
  // currently I do not know how to pass ${moduleName} to evaluate target type
  // something like (keyof RootState[moduleName] )[] but it is wrong writing
  { [moduleName in (keyof RootState | '$$global' | '$$default')]?: TStar | string[] };
  tag?: string;
  persistStoredKeys?: Boolean;
  lite?: 1 | 2 | 3 | 4;
  reducerModule?: string;// defuault equal ${module}
  isPropsProxy?: Boolean;// default false
  isSingle?: Boolean; //default false
  renderKeyClasses?: string[];
  compareProps?: Boolean;//default true
}

type ReducerFn = <ModuleState> (
  payload: any,
  moduleState: ModuleState,
) => Promise<Pick<ModuleState, keyof ModuleState>>;

type WatchFn = <RootState, ModuleState>(
  oldVal: any,
  newVal: any,
  fnCtx: IFnCtxBase,//user decide it is FnCtx or FnCtxConnect
) => void;
type WatchFnDesc = {
  fn: WatchFn,
  compare?: boolean,
  immediate?: boolean,
  depKeys?: string[],
}

type TypeDesc = {
  module?: string;
  reducerModule?: string;
  type: string;
  cb?: Function;
};

type ModuleConfig = {
  state: Object;
  reducer?: {
    [fnName: string]: ReducerFn;
  };
  computed?: {
    [retKey: string]: ComputedFn | ComputedFnDesc;
  };
  watch?: {
    [retKey: string]: WatchFn | WatchFnDesc;
  };
  init?: <ModuleState>() => Partial<ModuleState>
}

interface StoreConfig {
  [moduleName: string]: ModuleConfig;
}

type StateInfo = {
  committedState: object, sharedState: object, module: string,
  type: string, ccUniqueKey: string, renderKey: string,
};
type PluginOn = (sig: string | string[], callback: (data: { sig: string, payload: any }) => void) => void;
interface Plugin {
  install: (on: PluginOn) => { name: string };
}
interface RunOptions {
  middlewares: ((stateInfo: StateInfo, next: Function) => void)[];
  plugins: Plugin[];
}

export interface IActionCtx {
  dispatch: typeof refCtxDispatch;
  lazyDispatch: typeof refCtxLazyDispatch;
  setState: (obj: TAnyObj) => Promise<TAnyObj>;
}


//////////////////////////////////////////
// exposed top api
//////////////////////////////////////////

/**
 * 
 * @param clearAll default false
 * @param warningErrForClearAll 
 */
export function clearContextIfHot(clearAll: boolean, warningErrForClearAll?: string): void;

export function run(storeConfig?: StoreConfig | undefined, runOptions?: RunOptions | undefined): void;

export function register<RootState, ModuleState, RefState>(
  registerOptions: String | RegisterOptions<RootState, ModuleState, RefState>,
  ccClassKey?: string,
): (ReactCompType: typeof Component) => typeof ConcentComponent;

//use decide it is RefCtx or RefCtxConnect
export function registerDumb<RootState, ModuleState, RefState, RefCtxBase>(
  registerOptions: String | RegisterOptions<RootState, ModuleState, RefState>,
  ccClassKey?: string,
): (renderFn: (props: RefCtxBase | any) => ReactNode) => typeof Component;

//use decide it is RefCtx or RefCtxConnect
export function useConcent<RootState, ModuleState, RefState, RefCtxBase>(
  registerOptions: String | RegisterOptions<RootState, ModuleState, RefState>,
  ccClassKey?: string,
): RefCtxBase;

export function configure(moduleName: string, moduleConfig: ModuleConfig): void;

export function cloneModule(newModule: string, existingModule: string, overwriteModuleConfig?: ModuleConfig): void;

export function setState<RootState, moduleState>(moduleName: keyof RootState, state: Partial<moduleState>, renderKey?: string, delay?: number): void;

export function setGlobalState<GlobalState>(state: Partial<GlobalState>): void;

export function getState<RootState>(moduleName?: keyof RootState): object;

export function getGlobalState<GlobalState>(): Partial<GlobalState>;

export function getConnectedState<RootState>(ccClassKey: string): Partial<RootState>;

export function getComputed<T>(moduleName?: string): T;

export function getGlobalComputed<T>(): T;

export function set(keyPath: string, value: any, renderKey?: string, delay?: number): void;

export function dispatch<T>(type: string | TypeDesc, payload?: any, renderKey?: string, delay?: number): Promise<T>;

export function lazyDispatch<T>(type: string | TypeDesc, payload?: any, renderKey?: string, delay?: number): Promise<T>;

/**
 * user specify detail type when use
 * 
 * import {reducer} from 'concent';
 * import { RootReducer } from 'types';
 * 
 * const typedReducer = reducer as RootReducer;
 */
export declare const reducer: any;
export declare const lazyReducer: any;

declare type DefaultExport = {
  clearContextIfHot: typeof clearContextIfHot,
  run: typeof run,
  register: typeof register,
  registerDumb: typeof registerDumb,
  useConcent: typeof useConcent,
  configure: typeof configure,
  cloneModule: typeof cloneModule,
  setState: typeof setState,
  setGlobalState: typeof setGlobalState,
  getState: typeof getState,
  getGlobalState: typeof getGlobalState,
  getConnectedState: typeof getConnectedState,
  getComputed: typeof getComputed,
  getGlobalComputed: typeof getGlobalComputed,
  set: typeof set,
  dispatch: typeof dispatch,
  lazyDispatch: typeof lazyDispatch,
  reducer: typeof reducer,
  lazyReducer: typeof lazyReducer,
}

declare let defaultExport: DefaultExport;
export default defaultExport;

export as namespace cc;