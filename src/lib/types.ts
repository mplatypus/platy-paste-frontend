import type { Document } from "./models/document"
import type { NewDocument } from "./models/new"

interface acceptedType {
    shiki: string // Used for displaying with shiki.
    fileExtensionRegex: RegExp // Used for auto detection.
    mime: string // Used for sending to the server.
}

// Mime types are collected from the following places: (last updated: 4/12/2025)
// https://www.digipres.org/formats/mime-types/
// https://github.com/patrickmccallum/mimetype-io/blob/master/src/mimeData.json
// Mime types with /x- are subject to changes, and may not stay.
// Mime types
// commented-out types, are commented out due to a missing mime type.
var acceptedTypes: Record<string, acceptedType> = {
    // display name: information
    ABAP: {
        shiki: "abap",
        fileExtensionRegex: RegExp("\\.(abap)$"),
        mime: "text/x-abap",
    },
    ActionScript: {
        shiki: "actionscript-3",
        fileExtensionRegex: RegExp("\\.(as)$"),
        mime: "text/x-actionscript",
    },
    Ada: {
        shiki: "ada",
        fileExtensionRegex: RegExp("\\.(ada|adb|ads)$"),
        mime: "text/x-ada",
    },
    /*"Angular HTML": { // TODO: Add implementation
        shiki: "Angular HTML",
        fileExtensionRegex: RegExp("\\.()$"),
        mime: "",
    },*/
    /*"Angular TS": { // TODO: Add implementation
        shiki: "angular-ts",
        fileExtensionRegex: RegExp("\\.()$"),
        mime: "",
    },*/
    /*"Apache Conf": { // TODO: Add implementation
        shiki: "apache",
        fileExtensionRegex: RegExp("\\.()$"),
        mime: "",
    },*/
    /*Apex: { // TODO: Add implementation
        shiki: "apex",
        fileExtensionRegex: RegExp("\\.()$"),
        mime: "",
    },*/
    APL: {
        shiki: "apl",
        fileExtensionRegex: RegExp("\\.(apl)$"),
        mime: "text/apl",
    },
    AppleScript: {
        shiki: "applescript",
        fileExtensionRegex: RegExp("\\.(applescript)$"),
        mime: "text/x-applescript",
    },
    /*Ara: { // TODO: Add implementation
        shiki: "ara",
        fileExtensionRegex: RegExp("\\.()$"),
        mime: "",
    },*/
    AsciiDoc: {
        shiki: "asciidoc",
        fileExtensionRegex: RegExp("\\.(adoc|asciidoc)$"),
        mime: "text/x-asciidoc",
    },
    Assembly: {
        shiki: "asm",
        fileExtensionRegex: RegExp("\\.(asm|s|S)$"),
        mime: "text/x-asm",
    },
    /*Astro: { // TODO: Add implementation
        shiki: "astro",
        fileExtensionRegex: RegExp("\\.()$"),
        mime: "",
    },*/
    /*AWK: { // TODO: Add implementation
        shiki: "awk",
        fileExtensionRegex: RegExp("\\.()$"),
        mime: "",
    },*/
    /*Ballerina: { // TODO: Add implementation
        shiki: "ballerina",
        fileExtensionRegex: RegExp("\\.()$"),
        mime: "",
    },*/
    "Batch File": {
        shiki: "bat",
        fileExtensionRegex: RegExp("\\.(bat|cmd)$"),
        mime: "application/x-msdownload",
    },
    /*Beancount: { // TODO: Add implementation
        shiki: "beancount",
        fileExtensionRegex: RegExp("\\.()$"),
        mime: "",
    },*/
    Berry: {
        shiki: "berry",
        fileExtensionRegex: RegExp("\\.(be)$"),
        mime: "text/x-berry",
    },
    BibTex: {
        shiki: "bibtex",
        fileExtensionRegex: RegExp("\\.(bib)$"),
        mime: "application/x-bibtex",
    },
    /*Bicep: { // TODO: Add implementation
        shiki: "bicep",
        fileExtensionRegex: RegExp("\\.()$"),
        mime: "",
    },*/
    /*Blade: { // TODO: Add implementation
        shiki: "blade",
        fileExtensionRegex: RegExp("\\.()$"),
        mime: "",
    },*/
    /*"1C (Enterprise)": { // TODO: Add implementation
        shiki: "bsl",
        fileExtensionRegex: RegExp("\\.()$"),
        mime: "",
    },*/
    C: {
        shiki: "c",
        fileExtensionRegex: RegExp("\\.(c|h)$"),
        mime: "text/x-c",
    },
    /*Cadence: { // TODO: Add implementation
        shiki: "cadence",
        fileExtensionRegex: RegExp("\\.()$"),
        mime: "",
    },*/
    /*Cairo: { // TODO: Add implementation
        shiki: "cairo",
        fileExtensionRegex: RegExp("\\.()$"),
        mime: "",
    },*/
    /*Clarity: { // TODO: Add implementation
        shiki: "clarity",
        fileExtensionRegex: RegExp("\\.()$"),
        mime: "",
    },*/
    Clojure: {
        shiki: "clojure",
        fileExtensionRegex: RegExp("\\.(clj|cljs|cljc)$"),
        mime: "text/x-clojure",
    },
    CMake: {
        shiki: "cmake",
        fileExtensionRegex: RegExp("\\.(cmake)$"), // There is a CMakeLists.txt that might need adding.
        mime: "text/x-cmake",
    },
    COBOL: {
        shiki: "cobol",
        fileExtensionRegex: RegExp("\\.(cob|cbl)$"),
        mime: "text/x-cobol",
    },
    /*CODEOWNERS: { // TODO: Add implementation
        shiki: "codeowners",
        fileExtensionRegex: RegExp("\\.()$"),
        mime: "",
    },*/
    /*CodeQL: {
        shiki: "codeql",
        fileExtensionRegex: RegExp("\\.()$"),
        mime: "",
    },*/
    CoffeeScript: {
        shiki: "coffee",
        fileExtensionRegex: RegExp("\\.(coffee)$"),
        mime: "application/vnd.coffeescript",
    },
    "Common Lisp": {
        shiki: "common-lisp",
        fileExtensionRegex: RegExp("\\.(lisp|lsp)$"),
        mime: "text/x-common-lisp",
    },
    Coq: {
        shiki: "coq",
        fileExtensionRegex: RegExp("\\.(v)$"),
        mime: "text/x-coq",
    },
    "C++": {
        shiki: "cpp",
        fileExtensionRegex: RegExp("\\.(cpp|hpp)$"),
        mime: "text/x-c",
    },
    Crystal: {
        shiki: "crystal",
        fileExtensionRegex: RegExp("\\.(cr)$"),
        mime: "text/x-crystal",
    },
    "C#": {
        shiki: "csharp",
        fileExtensionRegex: RegExp("\\.(cs)$"),
        mime: "text/x-csharp",
    },
    CSS: {
        shiki: "css",
        fileExtensionRegex: RegExp("\\.(css)$"),
        mime: "text/css",
    },
    CSV: {
        shiki: "csv",
        fileExtensionRegex: RegExp("\\.(csv)$"),
        mime: "text/csv",
    },
    CUE: {
        shiki: "cue",
        fileExtensionRegex: RegExp("\\.(cue)$"),
        mime: "application/x-cue",
    },
    /*Cypher: { // TODO: Add implementation
        shiki: "cypher",
        fileExtensionRegex: RegExp("\\.()$"),
        mime: "",
    },*/
    D: {
        shiki: "d",
        fileExtensionRegex: RegExp("\\.(d|di)$"),
        mime: "text/x-d",
    },
    Dart: {
        shiki: "dart",
        fileExtensionRegex: RegExp("\\.(dart)$"),
        mime: "application/dart",
    },
    /*DAX: { // TODO: Add implementation
        shiki: "dax",
        fileExtensionRegex: RegExp("\\.()$"),
        mime: "",
    },*/
    /*Desktop: { // TODO: Add implementation
        shiki: "desktop",
        fileExtensionRegex: RegExp("\\.()$"),
        mime: "",
    },*/
    Diff: {
        shiki: "diff",
        fileExtensionRegex: RegExp("\\.(diff|patch)$"),
        mime: "text/x-diff",
    },
    /*Dockerfile: { // TODO: Add implementation
        shiki: "docker",
        fileExtensionRegex: RegExp("\\.?(Dockerfile)$"),
        mime: "",
    },*/
    /*DotEnv: { // TODO: Add implementation
        shiki: "dotenv",
        fileExtensionRegex: RegExp("\\.env(\\.\\w+)?$"),
        mime: "",
    },*/
    /*"Dream Maker": { // TODO: Add implementation
        shiki: "dream-maker",
        fileExtensionRegex: RegExp("\\.()$"),
        mime: "",
    },*/
    /*Edge: { // TODO: Add implementation
        shiki: "edge",
        fileExtensionRegex: RegExp("\\.()$"),
        mime: "",
    },*/
    Elixir: {
        shiki: "elixir",
        fileExtensionRegex: RegExp("\\.(ex|exs)$"),
        mime: "text/x-elixir",
    },
    Elm: {
        shiki: "elm",
        fileExtensionRegex: RegExp("\\.(elm)$"),
        mime: "text/x-elm",
    },
    "Emacs Lisp": {
        shiki: "emacs-lisp",
        fileExtensionRegex: RegExp("\\.(el|elc)$"),
        mime: "application/x-elc",
    },
    /*ERB: { // TODO: Add implementation
        shiki: "erb",
        fileExtensionRegex: RegExp("\\.()$"),
        mime: "",
    },*/
    Erlang: {
        shiki: "erlang",
        fileExtensionRegex: RegExp("\\.(hrl|erl)$"),
        mime: "text/x-erlang",
    },
    /*Fennel: { // TODO: Add implementation
        shiki: "fennel",
        fileExtensionRegex: RegExp("\\.()$"),
        mime: "",
    },*/
    Fish: {
        shiki: "fish",
        fileExtensionRegex: RegExp("\\.(fish)$"),
        mime: "application/x-fish",
    },
    /*Fluent: { // TODO: Add implementation
        shiki: "fluent",
        fileExtensionRegex: RegExp("\\.()$"),
        mime: "",
    },*/
    /*"Fortran (Fixed Form)": { // TODO: Add implementation
        shiki: "fortran-fixed-form",
        fileExtensionRegex: RegExp("\\.()$"),
        mime: "text/x-fortran",
    },*/
    /*"Fortran (Free Form)": { // TODO: Add implementation
        shiki: "fortran-free-form",
        fileExtensionRegex: RegExp("\\.()$"),
        mime: "text/x-fortran",
    },*/
    "F#": {
        shiki: "fsharp",
        fileExtensionRegex: RegExp("\\.(fs|fsi|fsx)$"),
        mime: "text/x-fsharp",
    },
    /*GDResource: { // TODO: Add implementation
        shiki: "gdresource",
        fileExtensionRegex: RegExp("\\.()$"),
        mime: "",
    },*/
    GDScript: {
        shiki: "gdscript",
        fileExtensionRegex: RegExp("\\.(gd)$"),
        mime: "text/x-gdscript",
    },
    /*GDShader: { // TODO: Add implementation
        shiki: "gdshader",
        fileExtensionRegex: RegExp("\\.()$"),
        mime: "",
    },*/
    /*Genie: { // TODO: Add implementation
        shiki: "genie",
        fileExtensionRegex: RegExp("\\.()$"),
        mime: "",
    },*/
    Gherkin: {
        shiki: "gherkin",
        fileExtensionRegex: RegExp("\\.(feature)$"),
        mime: "text/x-gherkin",
    },
    /*"Git Commit Message": { // TODO: Add implementation
        shiki: "git-commit",
        fileExtensionRegex: RegExp("\\.()$"),
        mime: "",
    },*/
    /*"Git Rebase Message": { // TODO: Add implementation
        shiki: "git-rebase",
        fileExtensionRegex: RegExp("\\.()$"),
        mime: "",
    },*/
    /*Gleam: { // TODO: Add implementation
        shiki: "gleam",
        fileExtensionRegex: RegExp("\\.()$"),
        mime: "",
    },*/
    /*"Glimmer JS": { // TODO: Add implementation
        shiki: "glimmer-js",
        fileExtensionRegex: RegExp("\\.()$"),
        mime: "",
    },*/
    /*"Glimmer TS": { // TODO: Add implementation
        shiki: "",
        fileExtensionRegex: RegExp("\\.()$"),
        mime: "",
    },*/
    /*GLSL: { // TODO: Add implementation
        shiki: "glsl",
        fileExtensionRegex: RegExp("\\.()$"),
        mime: "",
    },*/
    /*Gnuplot: { // TODO: Add implementation
        shiki: "gnuplot",
        fileExtensionRegex: RegExp("\\.()$"),
        mime: "",
    },*/
    Go: {
        shiki: "go",
        fileExtensionRegex: RegExp("\\.(go)$"),
        mime: "text/x-go",
    },
    /*GraphQL: { // TODO: Add implementation
        shiki: "graphql",
        fileExtensionRegex: RegExp("\\.()$"),
        mime: "",
    },*/
    Groovy: {
        shiki: "groovy",
        fileExtensionRegex: RegExp("\\.(groovy)$"),
        mime: "text/x-groovy",
    },
    Hack: {
        shiki: "hack",
        fileExtensionRegex: RegExp("\\.(hack)$"),
        mime: "application/x-httpd-php",
    },
    /*"Ruby Haml": {
        shiki: "haml",
        fileExtensionRegex: RegExp("\\.()$"),
        mime: "",
    },*/
    /*Handlebars: { // TODO: Add implementation
        shiki: "handlebars",
        fileExtensionRegex: RegExp("\\.()$"),
        mime: "",
    },*/
    Haskell: {
        shiki: "haskell",
        fileExtensionRegex: RegExp("\\.(hs|lhs)$"),
        mime: "text/x-haskell",
    },
    Haxe: {
        shiki: "haxe",
        fileExtensionRegex: RegExp("\\.(hx)$"),
        mime: "text/x-haxe",
    },
    /*HashiCorp: { // TODO: Add implementation
        shiki: "hcl",
        fileExtensionRegex: RegExp("\\.()$"),
        mime: "",
    },*/
    /*Hjson: { // TODO: Add implementation
        shiki: "hjson",
        fileExtensionRegex: RegExp("\\.()$"),
        mime: "",
    },*/
    HLSL: {
        shiki: "hlsl",
        fileExtensionRegex: RegExp("\\.(hlsl)$"),
        mime: "text/x-hlsl",
    },
    HTML: {
        shiki: "html",
        fileExtensionRegex: RegExp("\\.(htm|html)$"),
        mime: "text/html",
    },
    /*"HTML (Derivative)": { // TODO: Add implementation
        shiki: "html-derivative",
        fileExtensionRegex: RegExp("\\.()$"),
        mime: "",
    },*/
    HTTP: {
        shiki: "http",
        fileExtensionRegex: RegExp("\\.(http)$"),
        mime: "application/http",
    },
    /*HXML: { // TODO: Add implementation
        shiki: "hxml",
        fileExtensionRegex: RegExp("\\.()$"),
        mime: "",
    },*/
    Hy: {
        shiki: "hy",
        fileExtensionRegex: RegExp("\\.(hy)$"),
        mime: "text/x-hy",
    },
    /*Imba: { // TODO: Add implementation
        shiki: "imba",
        fileExtensionRegex: RegExp("\\.()$"),
        mime: "",
    },*/
    INI: {
        shiki: "ini",
        fileExtensionRegex: RegExp("\\.(ini)$"),
        mime: "text/x-ini",
    },
    Java: {
        shiki: "java",
        fileExtensionRegex: RegExp("\\.(java)$"),
        mime: "text/x-java-source",
    },
    JavaScript: {
        shiki: "javascript",
        fileExtensionRegex: RegExp("\\.(js)$"),
        mime: "text/javascript",
    },
    Jinja: {
        shiki: "jinja",
        fileExtensionRegex: RegExp("\\.(jinja|jinja2)$"),
        mime: "text/x-django",
    },
    /*Jison: { // TODO: Add implementation
        shiki: "jison",
        fileExtensionRegex: RegExp("\\.()$"),
        mime: "",
    },*/
    JSON: {
        shiki: "json",
        fileExtensionRegex: RegExp("\\.(json)$"),
        mime: "application/json",
    },
    JSON5: {
        shiki: "json5",
        fileExtensionRegex: RegExp("\\.(json|json5)$"),
        mime: "application/json5",
    },
    "JSON with Comments": {
        shiki: "jsonc",
        fileExtensionRegex: RegExp("\\.(json|jsonc)$"),
        mime: "text/javascript",
    },
    "JSON Lines": {
        shiki: "jsonl",
        fileExtensionRegex: RegExp("\\.(jsonl)$"),
        mime: "application/jsonl",
    },
    /*Jsonnet: { // TODO: Add implementation
        shiki: "jsonnet",
        fileExtensionRegex: RegExp("\\.()$"),
        mime: "",
    },*/
    /*JSSM: { // TODO: Add implementation
        shiki: "jssm",
        fileExtensionRegex: RegExp("\\.()$"),
        mime: "",
    },*/
    JSX: {
        shiki: "jsx",
        fileExtensionRegex: RegExp("\\.(jsx)$"),
        mime: "text/jsx",
    },
    Julia: {
        shiki: "julia",
        fileExtensionRegex: RegExp("\\.(jl)$"),
        mime: "text/x-julia",
    },
    Kotlin: {
        shiki: "kotlin",
        fileExtensionRegex: RegExp("\\.(kt|kts)$"),
        mime: "text/x-kotlin",
    },
    /*Kusto: { // TODO: Add implementation
        shiki: "kusto",
        fileExtensionRegex: RegExp("\\.()$"),
        mime: "",
    },*/
    LaTeX: {
        shiki: "latex",
        fileExtensionRegex: RegExp("\\.(tex|sty|cls)$"),
        mime: "application/x-latex",
    },
    "Lean 4": {
        shiki: "lean",
        fileExtensionRegex: RegExp("\\.(lean)$"),
        mime: "text/x-lean4",
    },
    Less: {
        shiki: "less",
        fileExtensionRegex: RegExp("\\.(less)$"),
        mime: "text/x-less",
    },
    /*Liquid: { // TODO: Add implementation
        shiki: "liquid",
        fileExtensionRegex: RegExp("\\.()$"),
        mime: "",
    },*/
    /*"LLVM IR": { // TODO: Add implementation
        shiki: "llvm",
        fileExtensionRegex: RegExp("\\.()$"),
        mime: "",
    },*/
    Log: {
        shiki: "log",
        fileExtensionRegex: RegExp("\\.(log)$"),
        mime: "text/x-log",
    },
    /*Logo: { // TODO: Add implementation
        shiki: "logo",
        fileExtensionRegex: RegExp("\\.()$"),
        mime: "",
    },*/
    Lua: {
        shiki: "lua",
        fileExtensionRegex: RegExp("\\.(lua)$"),
        mime: "text/x-lua",
    },
    Luau: {
        shiki: "luau",
        fileExtensionRegex: RegExp("\\.(luau)$"),
        mime: "text/x-lua",
    },
    /*Makefile: { // TODO: Add implementation
        shiki: "makefile",
        fileExtensionRegex: RegExp("\\.?(Makefile)$"),
        mime: "",
    },*/
    Markdown: {
        shiki: "markdown",
        fileExtensionRegex: RegExp(
            "\\.(md|markdown|mdown|mkdn|mkd|mdtxt|mdtext)$",
        ),
        mime: "text/markdown",
    },
    /*Marko: { // TODO: Add implementation
        shiki: "marko",
        fileExtensionRegex: RegExp("\\.(marko)$"),
        mime: "",
    },*/
    MATLAB: {
        shiki: "matlab",
        fileExtensionRegex: RegExp("\\.(m|mat|mlx)$"),
        mime: "text/x-matlab",
    },
    /*MDC: { // TODO: Add implementation
        shiki: "mdc",
        fileExtensionRegex: RegExp("\\.()$"),
        mime: "",
    },*/
    MDX: {
        shiki: "mdx",
        fileExtensionRegex: RegExp("\\.(mdx)$"),
        mime: "text/x-gfm",
    },
    /*Mermaid: { // TODO: Add implementation
        shiki: "mermaid",
        fileExtensionRegex: RegExp("\\.()$"),
        mime: "",
    },*/
    /*"MIPS Assembly": { // TODO: Add implementation
        shiki: "mipsasm",
        fileExtensionRegex: RegExp("\\.()$"),
        mime: "",
    },*/
    Mojo: {
        shiki: "mojo",
        fileExtensionRegex: RegExp("\\.(mojo)$"),
        mime: "text/x-mojo",
    },
    /*Move: { // TODO: Add implementation
        shiki: "move",
        fileExtensionRegex: RegExp("\\.()$"),
        mime: "",
    },*/
    /*"Narrat Language": { // TODO: Add implementation
        shiki: "narrat",
        fileExtensionRegex: RegExp("\\.()$"),
        mime: "",
    },*/
    /*Nextflow: { // TODO: Add implementation
        shiki: "nextflow",
        fileExtensionRegex: RegExp("\\.()$"),
        mime: "",
    },*/
    Nginx: {
        shiki: "nginx",
        fileExtensionRegex: RegExp("\\.(nginx.conf)$"),
        mime: "text/x-nginx-conf",
    },
    Nim: {
        shiki: "nim",
        fileExtensionRegex: RegExp("\\.(nim)$"),
        mime: "text/x-nim",
    },
    /*Nix: { // TODO: Add implementation
        shiki: "nix",
        fileExtensionRegex: RegExp("\\.()$"),
        mime: "",
    },*/
    Nushell: {
        shiki: "nushell",
        fileExtensionRegex: RegExp("\\.(nu)$"),
        mime: "text/x-sh",
    },
    "Objective C": {
        shiki: "objective-c",
        fileExtensionRegex: RegExp("\\.(m|h)$"),
        mime: "text/x-objective-c",
    },
    "Objective C++": {
        shiki: "objective-cpp",
        fileExtensionRegex: RegExp("\\.(mm|h)$"),
        mime: "text/x-objective-c++",
    },
    OCaml: {
        shiki: "ocaml",
        fileExtensionRegex: RegExp("\\.(ml|mli)$"),
        mime: "text/x-ocaml",
    },
    Pascal: {
        shiki: "pascal",
        fileExtensionRegex: RegExp("\\.(pas|pp|p|inc|dpr)$"),
        mime: "text/x-pascal",
    },
    Perl: {
        shiki: "perl",
        fileExtensionRegex: RegExp("\\.(pl|pm)$"),
        mime: "text/x-perl",
    },
    PHP: {
        shiki: "php",
        fileExtensionRegex: RegExp("\\.(php|php3|php4|php5)$"),
        mime: "text/x-php",
    },
    /*"PL/SQL": { // TODO: Add implementation
        shiki: "plsql",
        fileExtensionRegex: RegExp("\\.()$"),
        mime: "",
    },*/
    "Gettext PO": {
        shiki: "po",
        fileExtensionRegex: RegExp("\\.(po|pot)$"),
        mime: "text/x-gettext",
    },
    /*Polar: { // TODO: Add implementation
        shiki: "polar",
        fileExtensionRegex: RegExp("\\.()$"),
        mime: "",
    },*/
    PostCSS: {
        shiki: "postcss",
        fileExtensionRegex: RegExp("\\.(pcss|postcss)$"),
        mime: "text/css",
    },
    /*PowerQuery: { // TODO: Add implementation
        shiki: "powerquery",
        fileExtensionRegex: RegExp("\\.()$"),
        mime: "",
    },*/
    PowerShell: {
        shiki: "powershell",
        fileExtensionRegex: RegExp("\\.(ps1|psm1|psd1)$"),
        mime: "application/x-powershell",
    },
    /*Prisma: { // TODO: Add implementation
        shiki: "prisma",
        fileExtensionRegex: RegExp("\\.()$"),
        mime: "",
    },*/
    Prolog: {
        shiki: "prolog",
        fileExtensionRegex: RegExp("\\.(pl|pro|P)$"),
        mime: "text/x-prolog",
    },
    "Protocol Buffer 3": {
        shiki: "proto",
        fileExtensionRegex: RegExp("\\.(proto)$"),
        mime: "text/x-protobuf",
    },
    Pug: {
        shiki: "pug",
        fileExtensionRegex: RegExp("\\.(pug|jade)$"),
        mime: "text/x-pug",
    },
    Puppet: {
        shiki: "puppet",
        fileExtensionRegex: RegExp("\\.(pp)$"),
        mime: "text/x-puppet",
    },
    PureScript: {
        shiki: "purescript",
        fileExtensionRegex: RegExp("\\.(purs)$"),
        mime: "text/x-haskell",
    },
    Python: {
        shiki: "python",
        fileExtensionRegex: RegExp("\\.(py|pyi)$"),
        mime: "text/x-python",
    },
    QML: {
        shiki: "qml",
        fileExtensionRegex: RegExp("\\.(qml)$"),
        mime: "application/x-qml",
    },
    /*"QML Directory": { // TODO: Add implementation
        shiki: "qmldir",
        fileExtensionRegex: RegExp("\\.()$"),
        mime: "",
    },*/
    /*"Qt Style Sheets": { // TODO: Add implementation
        shiki: "qss",
        fileExtensionRegex: RegExp("\\.()$"),
        mime: "",
    },*/
    R: {
        shiki: "r",
        fileExtensionRegex: RegExp("\\.(r|rds|RData)$"),
        mime: "text/x-rsrc",
    },
    Racket: {
        shiki: "racket",
        fileExtensionRegex: RegExp("\\.(rkt)$"),
        mime: "text/x-racket",
    },
    Raku: {
        shiki: "raku",
        fileExtensionRegex: RegExp("\\.(raku|rak|p6|pm)$"),
        mime: "text/x-perl",
    },
    /*"ASP.NET Razor": { // TODO: Add implementation
        shiki: "razor",
        fileExtensionRegex: RegExp("\\.()$"),
        mime: "",
    },*/
    /*"Windows Registry Script": { // TODO: Add implementation
        shiki: "reg",
        fileExtensionRegex: RegExp("\\.()$"),
        mime: "",
    },*/
    RegExp: {
        shiki: "regexp",
        fileExtensionRegex: RegExp("\\.(regex|regexp)$"),
        mime: "text/x-regex",
    },
    /*Rel: { // TODO: Add implementation
        shiki: "rel",
        fileExtensionRegex: RegExp("\\.()$"),
        mime: "",
    },*/
    /*"RISC-V": { // TODO: Add implementation
        shiki: "riscv",
        fileExtensionRegex: RegExp("\\.()$"),
        mime: "",
    },*/
    ReStructuredText: {
        shiki: "rst",
        fileExtensionRegex: RegExp("\\.(rst|rest)$"),
        mime: "text/x-rst",
    },
    Ruby: {
        shiki: "ruby",
        fileExtensionRegex: RegExp("\\.(rb)$"),
        mime: "text/x-ruby",
    },
    Rust: {
        shiki: "rust",
        fileExtensionRegex: RegExp("\\.(rs)$"),
        mime: "text/x-rust",
    },
    SAS: {
        shiki: "sas",
        fileExtensionRegex: RegExp("\\.(sas)$"),
        mime: "application/x-sas",
    },
    Sass: {
        shiki: "sass",
        fileExtensionRegex: RegExp("\\.(sass)$"),
        mime: "text/x-sass",
    },
    Scala: {
        shiki: "scala",
        fileExtensionRegex: RegExp("\\.(scala)$"),
        mime: "text/x-scala",
    },
    Scheme: {
        shiki: "scheme",
        fileExtensionRegex: RegExp("\\.(scm)$"),
        mime: "text/x-scheme",
    },
    SCSS: {
        shiki: "scss",
        fileExtensionRegex: RegExp("\\.(scss)$"),
        mime: "text/x-scss",
    },
    /*"1C (Query)": { // TODO: Add implementation
        shiki: "sdbl",
        fileExtensionRegex: RegExp("\\.()$"),
        mime: "",
    },*/
    /*ShaderLab: {
        shiki: "shaderlab",
        fileExtensionRegex: RegExp("\\.()$"),
        mime: "",
    },*/
    Shell: {
        shiki: "shellscript",
        fileExtensionRegex: RegExp("\\.(sh|bash)$"),
        mime: "application/x-sh",
    },
    /*"Shell Session": { // TODO: Add implementation
        shiki: "shellsession",
        fileExtensionRegex: RegExp("\\.()$"),
        mime: "",
    },*/
    Smalltalk: {
        shiki: "smalltalk",
        fileExtensionRegex: RegExp("\\.(st)$"),
        mime: "text/x-stsrc",
    },
    /*Solidity: {
        shiki: "solidity",
        fileExtensionRegex: RegExp("\\.()$"),
        mime: "",
    },*/
    "Closure Templates": {
        shiki: "soy",
        fileExtensionRegex: RegExp("\\.(soy)$"),
        mime: "text/x-soy",
    },
    SPARQL: {
        shiki: "sparql",
        fileExtensionRegex: RegExp("\\.(sparql|rq)$"),
        mime: "application/sparql-query",
    },
    /*"Splunk Query Language": { // TODO: Add implementation
        shiki: "splunk",
        fileExtensionRegex: RegExp("\\.()$"),
        mime: "",
    },*/
    SQL: {
        shiki: "sql",
        fileExtensionRegex: RegExp("\\.(sql)$"),
        mime: "text/x-sql",
    },
    /*"SSH Config": { // TODO: Add implementation
        shiki: "ssh-config",
        fileExtensionRegex: RegExp("\\.()$"),
        mime: "",
    },*/
    /*Stata: { // TODO: Add implementation
        shiki: "stata",
        fileExtensionRegex: RegExp("\\.()$"),
        mime: "",
    },*/
    /*Stylus: {
        shiki: "stylus",
        fileExtensionRegex: RegExp("\\.()$"),
        mime: "",
    },*/
    Svelte: {
        shiki: "svelte",
        fileExtensionRegex: RegExp("\\.(svelte)$"),
        mime: "text/x-svelte",
    },
    Swift: {
        shiki: "swift",
        fileExtensionRegex: RegExp("\\.(swift|playground)$"),
        mime: "text/x-swift",
    },
    SystemVerilog: {
        shiki: "system-verilog",
        fileExtensionRegex: RegExp("\\.(sv)$"),
        mime: "text/x-verilog",
    },
    /*"Systemd Units": { // TODO: Add implementation
        shiki: "systemd",
        fileExtensionRegex: RegExp("\\.()$"),
        mime: "",
    },*/
    /*TalonScript: { // TODO: Add implementation
        shiki: "talonscript",
        fileExtensionRegex: RegExp("\\.()$"),
        mime: "",
    },*/
    /*Tasl: { // TODO: Add implementation
        shiki: "tasl",
        fileExtensionRegex: RegExp("\\.()$"),
        mime: "",
    },*/
    /*Templ: { // TODO: Add implementation
        shiki: "templ",
        fileExtensionRegex: RegExp("\\.()$"),
        mime: "",
    },*/
    Terraform: {
        shiki: "terraform",
        fileExtensionRegex: RegExp("\\.(tf|tfvars)$"),
        mime: "application/x-terraform",
    },
    TeX: {
        shiki: "tex",
        fileExtensionRegex: RegExp("\\.(tex)$"),
        mime: "application/x-tex",
    },
    TOML: {
        shiki: "toml",
        fileExtensionRegex: RegExp("\\.(toml)$"),
        mime: "text/x-toml",
    },
    /*"TypeScript with Tags": { // TODO: Add implementation
        shiki: "ts-tags",
        fileExtensionRegex: RegExp("\\.()$"),
        mime: "",
    },*/
    TSV: {
        shiki: "tsv",
        fileExtensionRegex: RegExp("\\.(tsv)$"),
        mime: "text/tab-separated-values",
    },
    TSX: {
        shiki: "tsx",
        fileExtensionRegex: RegExp("\\.(tsx)$"),
        mime: "text/typescript-tsx",
    },
    Turtle: {
        shiki: "turtle",
        fileExtensionRegex: RegExp("\\.(ttl)$"),
        mime: "text/turtle",
    },
    Twig: {
        shiki: "twig",
        fileExtensionRegex: RegExp("\\.(twig)$"),
        mime: "text/x-twig",
    },
    TypeScript: {
        shiki: "typescript",
        fileExtensionRegex: RegExp("\\.(ts)$"),
        mime: "text/x-typescript",
    },
    TypeSpec: {
        shiki: "typespec",
        fileExtensionRegex: RegExp("\\.(tsp)$"),
        mime: "text/x-tsp",
    },
    Typst: {
        shiki: "typst",
        fileExtensionRegex: RegExp("\\.(typ)$"),
        mime: "text/x-typst",
    },
    /*V: {
        shiki: "v",
        fileExtensionRegex: RegExp("\\.()$"),
        mime: "",
    },*/
    Vala: {
        shiki: "vala",
        fileExtensionRegex: RegExp("\\.(vala)$"),
        mime: "text/x-vala",
    },
    "Visual Basic": {
        shiki: "vb",
        fileExtensionRegex: RegExp("\\.(vb|vbs)$"),
        mime: "text/x-vbasic",
    },
    Verilog: {
        shiki: "verilog",
        fileExtensionRegex: RegExp("\\.(v)$"),
        mime: "text/x-verilog",
    },
    VHDL: {
        shiki: "vhdl",
        fileExtensionRegex: RegExp("\\.(vhdl|vhd)$"),
        mime: "text/x-vhdl",
    },
    "Vim Script": {
        shiki: "viml",
        fileExtensionRegex: RegExp("\\.(vim)$"),
        mime: "text/x-vim",
    },
    /*Vue: { // TODO: Add implementation
        shiki: "vue",
        fileExtensionRegex: RegExp("\\.()$"),
        mime: "",
    },*/
    /*"Vue HTML": { // TODO: Add implementation
        shiki: "vue-html",
        fileExtensionRegex: RegExp("\\.()$"),
        mime: "",
    },*/
    /*Vyper: { // TODO: Add implementation
        shiki: "vyper",
        fileExtensionRegex: RegExp("\\.()$"),
        mime: "",
    },*/
    WebAssembly: {
        shiki: "wasm",
        fileExtensionRegex: RegExp("\\.(wasm|mat)$"),
        mime: "application/wasm",
    },
    /*Wenyan: { // TODO: Add implementation
        shiki: "wenyan",
        fileExtensionRegex: RegExp("\\.()$"),
        mime: "",
    },*/
    WGSL: {
        shiki: "wgsl",
        fileExtensionRegex: RegExp("\\.(wgsl)$"),
        mime: "text/wgsl",
    },
    /*Wikitext: { // TODO: Add implementation
        shiki: "wikitext",
        fileExtensionRegex: RegExp("\\.(wikitext)$"),
        mime: "",
    },*/
    "WebAssembly Interface Types": {
        shiki: "wit",
        fileExtensionRegex: RegExp("\\.(wit)$"),
        mime: "text/x-webidl",
    },
    /*Wolfram: { // TODO: Add implementation
        shiki: "wolfram",
        fileExtensionRegex: RegExp("\\.()$"),
        mime: "",
    },*/
    XML: {
        shiki: "xml",
        fileExtensionRegex: RegExp("\\.(xml|xsl|xslt|xsd|svg|rss)$"),
        mime: "application/xml",
    },
    XSL: {
        shiki: "xsl",
        fileExtensionRegex: RegExp("\\.(xsl)$"),
        mime: "application/xml",
    },
    YAML: {
        shiki: "yaml",
        fileExtensionRegex: RegExp("\\.(yaml|yml)$"),
        mime: "application/yaml",
    },
    /*ZenScript: { // TODO: Add implementation
        shiki: "zenscript",
        fileExtensionRegex: RegExp("\\.()$"),
        mime: "",
    },*/
    Zig: {
        shiki: "zig",
        fileExtensionRegex: RegExp("\\.(zig)$"),
        mime: "text/zig",
    },
    Text: {
        shiki: "txt",
        fileExtensionRegex: RegExp("\\.(txt|text)$"),
        mime: "text/plain",
    },
}

/**
 * Get type.
 *
 * Get the accepted type via its key.
 *
 * @param name The name of the type.
 * @returns The `acceptedType` object if found.
 */
export function getType(name: string): acceptedType | null {
    let acceptedType = acceptedTypes[name]

    if (acceptedType == undefined) {
        return null
    }

    return acceptedType
}

/**
 * Get all types.
 *
 * Get all the valid types for documents.
 *
 * @param ordered Whether to sort in alphabetical order or not.
 * @returns All the types.
 */
export function getAllTypes(ordered: boolean = true): string[] {
    if (ordered) {
        return Object.keys(acceptedTypes).sort()
    }
    return Object.keys(acceptedTypes)
}

/**
 * Extract from document.
 *
 * This first attempts to extract the type using the mime,
 * then attempts with just the name via `extractTypeFromName`.
 *
 * @param document The document to extract from.
 * @returns The `acceptedType` if found, otherwise null.
 */
export function extractTypeFromDocument(
    document: NewDocument | Document,
): acceptedType | null {
    // This should first, collect all items that match the type (mime)
    // Then, collect all the items that match the names ending (if it has a . extension), in the list of acceptedTypes found.
    // If more than one is found, then the first one is selected.
    // Finally, if nothing was found, collect all the matching accepted file types, and return them.

    // Checks both the mime, and file type are matching.
    for (const key in acceptedTypes) {
        let type = acceptedTypes[key]

        if (type.mime == document.type) {
            return type
        }
    }

    return extractTypeFromName(document.name)
}

/**
 * Extract from name.
 *
 * This is a less strict version of `extractFromDocument`,
 * where it only checks and validates the name.
 *
 * @param name The file name to extract from.
 * @returns The accepted type, if found.
 */
export function extractTypeFromName(name: string): acceptedType | null {
    for (const key in acceptedTypes) {
        let type = acceptedTypes[key]

        if (type.fileExtensionRegex.test(name)) {
            return type
        }
    }

    return null
}

/**
 * Extract name from document.
 *
 * This first attempts to extract the type using the mime,
 * then attempts with just the name via `extractNameFromName`.
 *
 * @param document The document to extract from.
 * @returns The type if found.
 */
export function extractNameFromDocument(
    document: NewDocument | Document,
): string | null {
    for (const key in acceptedTypes) {
        let type = acceptedTypes[key]

        if (type.mime == document.type) {
            if (type.fileExtensionRegex.test(document.name)) {
                return key
            }
        }
    }

    return extractNameFromName(document.name)
}

/**
 * Extract name from name
 * @param name The name to extract from.
 * @returns The name if found.
 */
export function extractNameFromName(name: string): string | null {
    for (const key in acceptedTypes) {
        let type = acceptedTypes[key]

        if (type.fileExtensionRegex.test(name)) {
            return key
        }
    }

    return null
}

/**
 * The default mime type to use, when no mime can be found.
 */
export const DEFAULT_MIME = "text/plain"

/**
 * The default shiki type to use, when no shiki can be found.
 */
export const DEFAULT_SHIKI = "text"

/**
 * The default type to use, when no type can be found.
 */
export const DEFAULT_TYPE = "Text"
