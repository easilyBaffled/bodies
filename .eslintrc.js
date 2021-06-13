module.exports = {
    env: {
        browser: true,
        es2021:  true,
        mocha:   true
    },
    extends: "eslint:recommended",
    globals: {
        Cypress:    true,
        JSON:       true,
        before:     true,
        cy:         true,
        describe:   true,
        document:   true,
        expect:     true,
        global:     true,
        globalThis: true,
        it:         true,
        module:     true,
        navigator:  true,
        window:     true
    },
    ignorePatterns: [ "node_modules/", "pkg/" ],
    parserOptions:  {
        ecmaFeatures: {
            impliedStrict: true,
            jsx:           true
        },
        ecmaVersion: 11,
        sourceType:  "module"
    },
    plugins: [ "import", "sort-keys-fix" ],
    root:    true,
    rules:   {
        "accessor-pairs":        "off",
        "array-bracket-newline": [ 1, { multiline: true } ],
        "array-bracket-spacing": [ 1, "always" ],
        "arrow-spacing":         [
            1,
            {
                after:  true,
                before: true
            }
        ],
        "block-spacing": [ 1, "always" ],
        "brace-style":   "off",
        camelcase:       "off",
        "comma-dangle":  [ 1, "never" ],
        "comma-spacing": [
            1,
            {
                after:  true,
                before: false
            }
        ],
        "comma-style":                    [ 1, "last" ],
        "computed-property-spacing":      [ 1, "always" ],
        "constructor-super":              1,
        curly:                            [ 1, "multi-or-nest" ],
        "dot-location":                   [ 1, "property" ],
        "eol-last":                       1,
        eqeqeq:                           [ 0, "allow-null" ],
        "func-call-spacing":              [ 1, "never" ],
        "function-call-argument-newline": [ "error", "consistent" ],
        "generator-star-spacing":         [
            1,
            {
                after:  false,
                before: true
            }
        ],
        "guard-for-in":        1,
        "handle-callback-err": [ 1, "^(err|error)$" ],
        "import/order":        [ "error" ],
        indent:                [ 1, 4, { SwitchCase: 1 } ],
        "key-spacing":         [
            1,
            {
                align: "value",
                mode:  "minimum"
            }
        ],
        "keyword-spacing": [
            1,
            {
                after:  true,
                before: true
            }
        ],
        "max-depth":            [ "error", 5 ],
        "max-len":              [
            "error",
            {
                code:                   110,
                ignoreComments:         true,
                ignoreTemplateLiterals: true
            }
        ],
        "max-lines":              [ "error", { max: 100, "skipBlankLines": true, "skipComments": true } ],
        "max-lines-per-function": [ "error", { "max": 60, "skipBlankLines": true, "skipComments": true } ],
        "max-nested-callbacks":   [ "error", 3 ],
        "max-params":             [ "error", 5 ],
        "max-statements":         [ "error", 15 ],
        "multiline-ternary":      0,
        "new-cap":                [
            0,
            {
                capIsNew: false,
                newIsCap: true
            }
        ],
        "new-parens":               1,
        "no-alert":                 1,
        "no-array-constructor":     1,
        "no-caller":                1,
        "no-class-assign":          1,
        "no-cond-assign":           1,
        "no-const-assign":          1,
        "no-control-regex":         1,
        "no-debugger":              1,
        "no-delete-var":            1,
        "no-dupe-args":             1,
        "no-dupe-class-members":    1,
        "no-dupe-keys":             1,
        "no-duplicate-case":        1,
        "no-duplicate-imports":     1,
        "no-empty-character-class": 1,
        "no-empty-pattern":         1,
        "no-eval":                  1,
        "no-ex-assign":             1,
        "no-extend-native":         1,
        "no-extra-bind":            1,
        "no-extra-boolean-cast":    1,
        "no-extra-parens":          "off",
        "no-fallthrough":           1,
        "no-floating-decimal":      1,
        "no-func-assign":           1,
        "no-implied-eval":          1,
        "no-inner-declarations":    [ 1, "functions" ],
        "no-invalid-regexp":        1,
        "no-irregular-whitespace":  "off",
        "no-iterator":              1,
        "no-label-var":             1,
        "no-labels":                [
            1,
            {
                allowLoop:   false,
                allowSwitch: false
            }
        ],
        "no-lone-blocks":           1,
        "no-mixed-spaces-and-tabs": "off",
        "no-multi-spaces":          "off",
        "no-multi-str":             1,
        "no-multiple-empty-lines":  [
            1,
            {
                max: 4
            }
        ],
        "no-native-reassign":   1,
        "no-negated-in-lhs":    1,
        "no-new":               1,
        "no-new-func":          1,
        "no-new-object":        1,
        "no-new-require":       1,
        "no-new-symbol":        1,
        "no-new-wrappers":      1,
        "no-obj-calls":         1,
        "no-octal":             1,
        "no-octal-escape":      1,
        "no-path-concat":       1,
        "no-proto":             1,
        "no-redeclare":         1,
        "no-regex-spaces":      1,
        "no-restricted-syntax": [
            "error",
            "MemberExpression[object.name=/describe|it/][property.name='only']"
        ],
        "no-return-assign":             "off",
        "no-self-assign":               1,
        "no-self-compare":              1,
        "no-sequences":                 "off",
        "no-shadow-restricted-names":   1,
        "no-spaced-func":               1,
        "no-sparse-arrays":             1,
        "no-this-before-super":         1,
        "no-throw-literal":             1,
        "no-trailing-spaces":           "off",
        "no-undef":                     1,
        "no-undef-init":                1,
        "no-unexpected-multiline":      1,
        "no-unmodified-loop-condition": 1,
        "no-unneeded-ternary":          [
            1,
            {
                defaultAssignment: false
            }
        ],
        "no-unreachable":    1,
        "no-unsafe-finally": 1,
        "no-unused-vars":    [
            1,
            {
                args: "after-used",
                vars: "local"
            }
        ],
        "no-useless-call":               1,
        "no-useless-computed-key":       1,
        "no-useless-constructor":        1,
        "no-useless-escape":             1,
        "no-useless-return":             1,
        "no-whitespace-before-property": 1,
        "no-with":                       1,
        "object-curly-spacing":          [ 1, "always" ],
        "one-var":                       [
            1,
            {
                var: "always"
            }
        ],
        "operator-linebreak": [
            1,
            "after",
            {
                overrides: {
                    ":": "before",
                    "?": "before"
                }
            }
        ],
        "padded-blocks":                "off",
        "prefer-promise-reject-errors": 1,
        quotes:                         "off",
        "require-jsdoc":                [
            0,
            {
                require: {
                    ClassDeclaration:    true,
                    FunctionDeclaration: true,
                    MethodDefinition:    true
                }
            }
        ],
        semi:           [ 1, "always" ],
        "semi-spacing": [
            1,
            {
                after:  true,
                before: false
            }
        ],
        "sort-keys-fix/sort-keys-fix": [ "error" ],
        "space-before-blocks":         [ 1, "always" ],
        "space-before-function-paren": [
            1,
            {
                anonymous:  "never",
                asyncArrow: "always",
                named:      "never"
            }
        ],
        "space-in-parens": [
            1,
            "always",
            {
                exceptions: [ "{}", "[]" ]
            }
        ],
        "space-infix-ops": 1,
        "space-unary-ops": [
            1,
            {
                nonwords: false,
                words:    true
            }
        ],
        "spaced-comment": [
            1,
            "always",
            {
                exceptions: [ "*" ],
                markers:    [
                    "global",
                    "globals",
                    "eslint",
                    "eslint-disable",
                    "*package",
                    "!",
                    ","
                ]
            }
        ],
        "template-curly-spacing": [ 1, "never" ],
        "use-isnan":              1,
        "valid-typeof":           1,
        "wrap-iife":              [ 1, "any" ],
        "yield-star-spacing":     [ 1, "before" ],
        yoda:                     [ 1, "never" ]
    // "react/jsx-max-props-per-line": ["error", { maximum: 1, when: "always" }]
    }
};
