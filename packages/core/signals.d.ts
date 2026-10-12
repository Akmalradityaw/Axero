export type Accessor<T> = () => T;
export type Setter<T> = (value: T | ((prev: T) => T)) => void;

export declare function createSignal<T>(initial: T): [Accessor<T>, Setter<T>];
export declare function createEffect(fn: () => void): void;
