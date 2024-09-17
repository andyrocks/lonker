"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultLonkerOptions = void 0;
const date_fns_1 = require("date-fns");
const util_1 = require("util");
exports.DefaultLonkerOptions = {
    groupIndent: 2,
    jsonIndent: 2,
    verbose: false,
    labelStart: "[",
    labelEnd: "]",
    labelStartEndBold: true,
    labelSeparator: "",
    labelTerminator: " ",
    labelStartColor: "white",
    labelEndColor: "white",
    logColor: "white",
    logBold: false,
    infoColor: "brightcyan",
    infoBold: false,
    warnColor: "yellow",
    warnBold: false,
    errorColor: "brightred",
    errorBold: true,
    defaultLabelColor: "white",
    labelSeparatorColor: "white",
    labelSeparatorBold: false,
    labelTerminatorColor: "white",
    labelTerminatorBold: false,
};
const ESCAPE = "\x1b";
const INTENSITY_BOLD = ESCAPE + "[1m";
const INTENSITY_DEFAULT = ESCAPE + "[22m";
const foregroundColors = new Map([
    ["default", ESCAPE + "[39m"],
    ["black", ESCAPE + "[30m"],
    ["red", ESCAPE + "[31m"],
    ["green", ESCAPE + "[32m"],
    ["yellow", ESCAPE + "[33m"],
    ["blue", ESCAPE + "[34m"],
    ["magenta", ESCAPE + "[35m"],
    ["cyan", ESCAPE + "[36m"],
    ["white", ESCAPE + "[37m"],
    ["brightblack", ESCAPE + "[90m"],
    ["brightred", ESCAPE + "[91m"],
    ["brightgreen", ESCAPE + "[92m"],
    ["brightyellow", ESCAPE + "[93m"],
    ["brightblue", ESCAPE + "[94m"],
    ["brightmagenta", ESCAPE + "[95m"],
    ["brightcyan", ESCAPE + "[96m"],
    ["brightwhite", ESCAPE + "[97m"],
]);
class Lonker {
    labels = [];
    indent = 0;
    opts = { ...exports.DefaultLonkerOptions };
    constructor(opts) {
        if (opts)
            this.opts = { ...exports.DefaultLonkerOptions, ...opts };
        if (process.argv.includes("--verbose"))
            this.opts.verbose = true;
    }
    options = (options) => {
        if (options) {
            return this.opts = { ...this.opts, ...options };
        }
        else {
            return this.opts;
        }
    };
    log = (x, color, bold) => this._log(console.log, color ?? this.opts.logColor, bold ?? this.opts.logBold, x);
    info = (x, color, bold) => this._log(console.info, color ?? this.opts.infoColor, bold ?? this.opts.infoBold, x);
    warn = (x, color, bold) => this._log(console.warn, color ?? this.opts.warnColor, bold ?? this.opts.warnBold, x);
    error = (x, color, bold) => this._log(console.error, color ?? this.opts.errorColor, bold ?? this.opts.errorBold, x);
    verbose = (x, color, bold) => this.opts.verbose ? this.log(x, color, bold) : undefined;
    infoVerbose = (x, color, bold) => this.opts.verbose ? this.info(x, color, bold) : undefined;
    warnVerbose = (x, color, bold) => this.opts.verbose ? this.warn(x, color, bold) : undefined;
    errorVerbose = (x, color, bold) => this.opts.verbose ? this.error(x, color, bold) : undefined;
    labelEnd = () => this.labels.length > 0 ? this.labels.pop() : undefined;
    groupEnd = () => this.indent = Math.max(0, this.indent - this.opts.groupIndent);
    group = (str) => {
        if (str)
            this.log(str);
        this.indent = this.indent + this.opts.groupIndent;
    };
    label = (label, color, bold, type) => {
        this.labels.push({
            label,
            color: color ?? this.opts.defaultLabelColor,
            type: type ?? "string",
            bold: bold ?? false,
            start: new Date().getTime()
        });
    };
    _log = (fn, color, bold, x) => {
        if (x) {
            const output = (typeof x !== "object" ? x.toString() : (0, util_1.inspect)(x, { colors: true, }));
            const result = output.split("\n").map(j => this.formatLabels() + "".padStart(this.indent, " ") + this.format(j, color, bold)).join("\n");
            fn(result);
        }
        else {
            fn(x);
        }
    };
    formatLabels = () => this.labels.length > 0 ?
        this.labels.map((x, i) => this.formatLabel(x))
            .join(this.format(this.opts.labelSeparator, this.opts.labelSeparatorColor, this.opts.labelSeparatorBold))
            + this.format(this.opts.labelTerminator, this.opts.labelTerminatorColor, this.opts.labelTerminatorBold)
        : "";
    formatLabel = (label) => {
        let contents = label.label;
        if (label.type === "datetime") {
            contents = (0, date_fns_1.format)(new Date(), label.label.length === 0 ? "MMM dd HH:mm:ss" : (0, date_fns_1.format)(new Date(), label.label));
        }
        else if (label.type === "timer") {
            contents = (0, util_1.format)(label.label.length === 0 ? "%d" : label.label, (new Date().getTime() - label.start));
        }
        else if (label.type === "time") {
            contents = (0, date_fns_1.format)(new Date(), label.label.length === 0 ? "HH:mm:ss.SSS" : (0, date_fns_1.format)(new Date(), label.label));
        }
        return (this.format(this.opts.labelStart, this.opts.labelStartColor, this.opts.labelStartEndBold) +
            this.format(contents, label.color, label.bold ?? false) +
            this.format(this.opts.labelEnd, this.opts.labelEndColor, this.opts.labelStartEndBold));
    };
    colorText = (str, color) => `${foregroundColors.get(color)}${str}${this.defaultForeground()}`;
    format = (str, color, makeBold) => makeBold ? INTENSITY_BOLD + this.colorText(str, color) + INTENSITY_DEFAULT : this.colorText(str, color);
    defaultForeground = () => foregroundColors.get("default");
}
const lonker = new Lonker();
exports.default = lonker;
const exampleObject = [
    {
        stringProperty: "value",
        numericProperty: 3.14,
        stringArrayProperty: ["andy", "rocks"],
        numericArrayProperty: [1, 2],
    }
];
async function examples() {
    lonker.options({
        labelStartEndBold: true
    });
    lonker.log("Simple lonker.log()");
    lonker.info("Simple lonker.info() (cyan default color)");
    lonker.warn("Simple lonker.warn()");
    lonker.error("Simple lonker.error()");
    lonker.group("A group!");
    lonker.log("log() inside group");
    lonker.groupEnd();
    lonker.label("A simple label");
    lonker.log("log() inside label");
    lonker.labelEnd();
    lonker.label("", "brightgreen", false, "datetime");
    lonker.log("datetime label (default format)");
    lonker.labelEnd();
    lonker.label("", "brightyellow", false, "time");
    lonker.log("time label (default format)");
    lonker.labelEnd();
    lonker.label("dd/MM/yyyy HH:mm:ss:SSS", "brightblue", false, "datetime");
    lonker.log("datetime label (custom format)");
    lonker.labelEnd();
    lonker.label("%d msec", "brightmagenta", false, "timer");
    lonker.log("timer label");
    await sleep(50);
    lonker.log("timer label after 50ms setTimeout()");
    lonker.log(".. and then right afterwards");
    lonker.labelEnd();
    lonker.label("Coloured label", "yellow");
    lonker.log("log() inside label");
    lonker.labelEnd();
    lonker.label("Coloured bold label", "brightred", true);
    lonker.log("log() inside label");
    lonker.labelEnd();
    lonker.label("Label 1", "white", true);
    lonker.label("Label 2", "cyan", false);
    lonker.log("log() inside label");
    lonker.labelEnd();
    lonker.labelEnd();
    lonker.label("Stringified Object", "white", false);
    lonker.log(exampleObject);
    lonker.labelEnd();
    lonker.options({
        labelSeparator: "_|_",
        labelSeparatorColor: "brightblue",
        labelSeparatorBold: true,
        labelStart: "<",
        labelEnd: ">",
        labelTerminator: "#: ",
        labelTerminatorColor: "brightmagenta",
        labelTerminatorBold: true,
        labelStartColor: "brightyellow",
        labelEndColor: "brightgreen"
    });
    lonker.label("Label1", "white", true);
    lonker.label("Label2", "cyan", false);
    lonker.log("Customisable label start, end, separator and terminator");
    lonker.labelEnd();
    lonker.labelEnd();
    lonker.options(exports.DefaultLonkerOptions);
    lonker.label("numeric array", "black", false);
    lonker.log([1, 2, 3]);
    lonker.labelEnd();
    lonker.label("string array", "black", false);
    lonker.log(["andy", "rocks"]);
    lonker.labelEnd();
}
async function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
