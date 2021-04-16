export declare class Storage {
    private type;
    private enableStorage;
    constructor(type?: 'localStorage' | 'sessionStorage');
    set(key: string, value: any, expireDays?: number): boolean;
    get(key: string): string;
    remove(key: string): void;
}
