export interface LonkerOptions {
    groupIndent: number;
    jsonIndent: number;
    verbose: boolean;
    labelStart: string;
    labelStartColor: ConsoleColor;
    labelEnd: string;
    labelEndColor: ConsoleColor;
    labelStartEndBold: boolean;
    labelSeparator: string;
    labelSeparatorColor: ConsoleColor;
    labelSeparatorBold: boolean;
    labelTerminator: string;
    labelTerminatorColor: ConsoleColor;
    labelTerminatorBold: boolean;
    infoColor: ConsoleColor;
    infoBold: boolean;
    errorColor: ConsoleColor;
    errorBold: boolean;
    warnColor: ConsoleColor;
    warnBold: boolean;
    logBold: boolean;
    logColor: ConsoleColor;
    defaultLabelColor: ConsoleColor;
}
export declare const DefaultLonkerOptions: LonkerOptions;
export type LabelType = "string" | "datetime" | "time" | "timer";
export type ConsoleColor = "default" | "black" | "white" | "red" | "green" | "yellow" | "blue" | "magenta" | "cyan" | "brightblack" | "brightwhite" | "brightred" | "brightgreen" | "brightyellow" | "brightblue" | "brightmagenta" | "brightcyan";
interface Label {
    label: string;
    color: ConsoleColor;
    bold: boolean;
    type: LabelType;
    start: number;
}
declare class Lonker {
    private labels;
    private indent;
    private opts;
    constructor(opts?: LonkerOptions);
    options: (options?: any) => any;
    log: (x?: any, color?: ConsoleColor, bold?: boolean) => void;
    info: (x?: any, color?: ConsoleColor, bold?: boolean) => void;
    warn: (x?: any, color?: ConsoleColor, bold?: boolean) => void;
    error: (x?: any, color?: ConsoleColor, bold?: boolean) => void;
    verbose: (x: any, color?: ConsoleColor, bold?: boolean) => void;
    infoVerbose: (x: any, color?: ConsoleColor, bold?: boolean) => void;
    warnVerbose: (x: any, color?: ConsoleColor, bold?: boolean) => void;
    errorVerbose: (x: any, color?: ConsoleColor, bold?: boolean) => void;
    labelEnd: () => Label | undefined;
    groupEnd: () => number;
    group: (str?: string) => void;
    label: (label: string, color?: ConsoleColor, bold?: boolean, type?: LabelType) => void;
    private _log;
    private formatLabels;
    private formatLabel;
    private colorText;
    private format;
    private defaultForeground;
}
declare const lonker: Lonker;
export default lonker;
