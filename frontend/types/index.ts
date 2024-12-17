export * from './accounts'
export * from './shop'
export * from './cart'

export type StringNull = string | null | undefined

export declare type LanguageOptions = {
    location: MaybeRef<string | null>;
    language: MaybeRef<string>;
};
