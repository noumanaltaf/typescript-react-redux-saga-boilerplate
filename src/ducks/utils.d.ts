import { Action } from 'redux';

export declare type Lifecycle = ('success' | 'failure' | 'request' | 'none');

type FunctionPropertyNames<T extends object> = { [K in keyof T]: T[K] extends (...args: any[]) => any ? K : never }[keyof T];
type FunctionProperties<T extends object> = Pick<T, FunctionPropertyNames<T>>;

export declare interface IAsyncAction<D extends object = any, T = any> {
  action(...args: any[]): T;
  callback?(data: D, payload: T): D;
  successCallback?(data: D, payload: any): D
  failureCallback?(data: D, payload: any): D
}

type AsyncActionPropertyNames<D extends object, T extends object> = { [K in keyof T]: T[K] extends IAsyncAction<D> ? K : never }[keyof T];
type AsyncActionProperties<D extends object, T extends object> = Pick<T, AsyncActionPropertyNames<D, T>>;

export declare interface ISyncAction<D extends object = any, T = any> {
  action(...args: any[]): T;
  callback?(data: D, payload: T): D
}

type SyncActionPropertyNames<D extends object, T extends object> = { [K in keyof T]: T[K] extends ISyncAction<D> ? K : never }[keyof T];
type SyncActionProperties<D extends object, T extends object> = Pick<T, SyncActionPropertyNames<D, T>>;

export interface IDataAction extends Action {
  data: any;
  name: string;
  lifecycle: Lifecycle;
}

export declare type DataAction<T = any> = {
  data: T;
  type: string;
  name: string;
  lifecycle: Lifecycle;
}

export declare type SuccessAction<T = any> = {
  payload: T;
  type: string;
  name: string;
  lifecycle: Lifecycle;
}

export declare type FailureAction<T = any> = {
  error: T;
  type: string;
  name: string;
  lifecycle: Lifecycle;
}

export declare interface ISaga<D = any, S = any, F = any> {
  success(payload: S): SuccessAction<S>;
  failure(payload: F): FailureAction<F>;
  successCallback?: (data: D, payload: S) => D;
  failureCallback?: (data: D, payload: F) => D;
}

export declare type SagaActions<D extends object, T extends object> = {
  [P in keyof T]:
  T[P] extends IAsyncAction<D> ?
  T[P]['successCallback'] extends (...args: any[]) => any ?
  T[P]['failureCallback'] extends (...args: any[]) => any ?
  ISaga<D, Parameters<T[P]['successCallback']>[1], Parameters<T[P]['failureCallback']>[1]> :
  ISaga<D, Parameters<T[P]['successCallback']>[1], string> :
  ISaga<D, any, string> :
  ISaga<D, any, string>;
};

export declare type DataActionFunction<T extends (...args: any[]) => any> = (...args: Parameters<T>) => DataAction<ReturnType<T>>

export declare type DataActions<T extends object> = {
  [P in keyof T]:
  T[P] extends IAsyncAction<any> ? DataActionFunction<(T[P]['action'])> :
  T[P] extends (...args: any[]) => any ? DataActionFunction<T[P]> :
  never;
};

export declare type SagaTypes<T extends object> = {
  [P in keyof T]: { success: string; failure: string };
};

export declare type DataTypes<T extends object> = {
  [P in keyof T]: string;
};

export declare interface IFunctions {
  [key: string]: (...args: any[]) => any;
}

export declare type SyncActions<D extends object, T extends object> = {
  [P in keyof T]: T[P] extends ISyncAction<D> ? ISyncAction<D, ReturnType<T[P]['action']>> : never;
}

export declare type AsyncActions<D extends object, T extends object> = {
  [P in keyof T]: T[P] extends IAsyncAction<D> ? IAsyncAction<D, ReturnType<T[P]['action']>> : never;
}

export declare type ActionOptions<A extends object, S extends object> = {
  asyncs?: A;
} & S;

export declare type CombinedActions<A extends object, S extends object> = DataActions<A> & DataActions<S>;

export declare type CombinedTypes<A extends object, S extends object> = DataTypes<A> & DataTypes<S>;

export declare type ExtendedTypes<A extends object, S extends object> = CombinedTypes<A, S> & { saga: SagaTypes<A>; };

export declare type ExtendedActions<D extends object, A extends object, S extends object> = CombinedActions<A, S> & { saga: SagaActions<D, A>; };

export declare interface ICreatedActions<A extends object, S extends object> {
  types: ExtendedTypes<FunctionProperties<A>, FunctionProperties<S>>;
  actions: ExtendedActions<any, FunctionProperties<A>, FunctionProperties<S>>;
}

export declare interface ICreatedTypesAndActions<D extends object, A extends object, S extends object> {
  initialState: IExtendedState<D>;
  types: ExtendedTypes<AsyncActionProperties<D, A>, SyncActionProperties<D, S>>;
  actions: ExtendedActions<D, AsyncActionProperties<D, A>, SyncActionProperties<D, S>>;
  reducer(state: IExtendedState<D>, action: IDataAction): IExtendedState<D>;
}

export declare interface IExtendedState<D> {
  fetched: boolean;
  loading: boolean;
  detailLoading: boolean;
  error?: string;
  data: D;
  notifications: any;
}

export declare interface IExtendedAction {
  name: string;
  type: string;
  error?: string;
  data?: any;
  payload?: any;
}

export declare type AsyncRequest<S> =
  S & {
    error?: string;
    notifications?: any;
    fetched?: boolean;
    loading?: boolean;
    data?: any;
  } & {
    [key: string]: boolean;
  };

export declare interface IStateSelectors<T> {
  [key: string]: (data: T, ...args: any[]) => any;
}

export declare type AsyncSelectors<D, S, T extends IStateSelectors<D>> = {
  [P in keyof T]: (state: S) => ReturnType<T[P]>;
};


export declare type SyncSelectors<D, S, T extends IStateSelectors<D>> = {
  [P in keyof T]: (state: S) => ReturnType<T[P]>;
};

export declare type ExtendedSelectors<D, S, T extends IStateSelectors<D>> = AsyncSelectors<D, S, T> & {
  isFetched(state: S): boolean;
  isLoading(state: S): boolean;
  error(state: S): string;
};

export declare function createActions<A extends object, S extends object>(options: ActionOptions<A, S>, namespace: string): ICreatedActions<A, S>;

export declare function initializeReducer<D extends object, A extends AsyncActions<D, A>, S extends SyncActions<D, S>>(options: { namespace: string, initialData: D, syncActions?: S, asyncActions?: A }): ICreatedTypesAndActions<D, A, S>;

export declare function asyncInitialState<D>(initialData: D): IExtendedState<D>;

export declare function asyncOnRequest<D extends object, S extends IExtendedState<D>>(state: S, action: Action): AsyncRequest<S>;

export declare function asyncOnSuccess<D, P = any>(state: IExtendedState<D>, action: Action, map?: (state: D, action: SuccessAction<P>) => D, notification?: any): AsyncRequest<IExtendedState<D>>;

export declare function asyncOnError<D, S extends IExtendedState<D>>(state: S, action: Action): AsyncRequest<S>;

export declare function asyncSelectors<D, S, T extends IStateSelectors<D>>(getState: (state: S) => IExtendedState<D>, dataSelectors: T): ExtendedSelectors<D, S, T>;

export declare function syncSelectors<D, S, T extends IStateSelectors<D>>(getState: (state: S) => D, dataSelectors: T): SyncSelectors<D, S, T>;
