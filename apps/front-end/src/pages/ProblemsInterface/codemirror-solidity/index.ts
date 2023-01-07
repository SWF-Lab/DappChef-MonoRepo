/**
 * Wrapper around the legacy CM5 Solidity language mode
 * See: https://github.com/alincode/codemirror-solidity
 */
import {
  LanguageSupport,
  StreamLanguage,
  StreamParser,
  StringStream
} from "@codemirror/language"

const keywords = {
  pragma: true,
  solidity: true,
  import: true,
  as: true,
  from: true,
  contract: true,
  constructor: true,
  is: true,
  function: true,
  modifier: true,
  // modifiers
  pure: true,
  view: true,
  payable: true,
  constant: true,
  anonymous: true,
  indexed: true,
  returns: true,
  return: true,
  event: true,
  struct: true,
  mapping: true,
  interface: true,
  using: true,
  library: true,
  storage: true,
  memory: true,
  calldata: true,
  public: true,
  private: true,
  external: true,
  internal: true,
  emit: true,
  assembly: true,
  abstract: true,
  after: true,
  catch: true,
  final: true,
  in: true,
  inline: true,
  let: true,
  match: true,
  null: true,
  of: true,
  relocatable: true,
  static: true,
  try: true,
  typeof: true,
  var: true
}

const keywordsSpecial = {
  pragma: true,
  returns: true,
  address: true,
  contract: true,
  function: true,
  struct: true
}

const keywordsEtherUnit = {
  wei: true,
  szabo: true,
  finney: true,
  ether: true
}
const keywordsTimeUnit = {
  seconds: true,
  minutes: true,
  hours: true,
  days: true,
  weeks: true
}
const keywordsBlockAndTransactionProperties = {
  block: ["coinbase", "difficulty", "gaslimit", "number", "timestamp"],
  msg: ["data", "sender", "sig", "value"],
  tx: ["gasprice", "origin"]
}
const keywordsMoreBlockAndTransactionProperties = {
  now: true,
  gasleft: true,
  blockhash: true
}
const keywordsErrorHandling = {
  assert: true,
  require: true,
  revert: true,
  throw: true
}
const keywordsMathematicalAndCryptographicFuctions = {
  addmod: true,
  mulmod: true,
  keccak256: true,
  sha256: true,
  ripemd160: true,
  ecrecover: true
}
const keywordsContractRelated = {
  this: true,
  selfdestruct: true,
  super: true
}
const keywordsTypeInformation = { type: true }
const keywordsContractList: Record<string, true> = {}

const keywordsControlStructures = {
  if: true,
  else: true,
  while: true,
  do: true,
  for: true,
  break: true,
  continue: true,
  switch: true,
  case: true,
  default: true
}

const keywordsValueTypes = {
  bool: true,
  byte: true,
  string: true,
  enum: true,
  address: true
}

const keywordsV0505NewReserve = {
  alias: true,
  apply: true,
  auto: true,
  copyof: true,
  define: true,
  immutable: true,
  implements: true,
  macro: true,
  mutable: true,
  override: true,
  partial: true,
  promise: true,
  reference: true,
  sealed: true,
  sizeof: true,
  supports: true,
  typedef: true,
  unchecked: true
}

const keywordsAbiEncodeDecodeFunctions = {
  abi: [
    "decode",
    "encodePacked",
    "encodeWithSelector",
    "encodeWithSignature",
    "encode"
  ]
}

const keywordsMembersOfAddressType = [
  "transfer",
  "send",
  "balance",
  "call",
  "delegatecall",
  "staticcall"
]

const natSpecTags = ["title", "author", "notice", "dev", "param", "return"]

const atoms = {
  delete: true,
  new: true,
  true: true,
  false: true
}

const isOperatorChar = /[+\-*&^%:=<>!|/~]/
const isNegativeChar = /[-]/

let curPunc

function tokenBase(stream: StringStream, state: State) {
  let ch = stream.next()

  if (ch === '"' || ch === "'" || ch === "`") {
    state.tokenize = tokenString(ch)

    return state.tokenize(stream, state)
  }

  if (isVersion(stream, state)) {
    return "version"
  }

  if (
    ch === "." &&
    keywordsMembersOfAddressType.some(function (item) {
      return stream.match(`${item}`)
    })
  ) {
    return "addressFunction"
  }

  if (typeof ch === "string" && isNumber(ch, stream)) {
    return "number"
  }

  if (typeof ch === "string" && /[[\]{}(),;:.]/.test(ch)) {
    return updateGarmmer(ch, state)
  }

  if (ch === "/") {
    if (stream.eat("*")) {
      state.tokenize = tokenComment

      return tokenComment(stream, state)
    }

    if (stream.match(/\/{2}/)) {
      ch = stream.next()
      while (ch) {
        if (ch === "@") {
          stream.backUp(1)
          state.grammar = "doc"
          break
        }

        ch = stream.next()
      }

      return "doc"
    }

    if (stream.eat("/")) {
      stream.skipToEnd()

      return "comment"
    }
  }

  if (typeof ch === "string" && isNegativeChar.test(ch)) {
    const peeked = stream.peek()
    if (typeof peeked === "string" && isNumber(peeked, stream)) {
      return "number"
    }

    return "operator"
  }

  if (typeof ch === "string" && isOperatorChar.test(ch)) {
    stream.eatWhile(isOperatorChar)

    return "operator"
  }

  stream.eatWhile(/[\w$_\xa1-\uffff]/)

  const cur = stream.current()

  if (state.grammar === "doc") {
    if (
      natSpecTags.some(function (item) {
        return cur === `@${item}`
      })
    ) {
      return "docReserve"
    }

    return "doc"
  }

  if (cur === "solidity" && state.lastToken === "pragma") {
    state.lastToken = state.lastToken + " " + cur
  }

  if (Object.prototype.propertyIsEnumerable.call(keywords, cur)) {
    if (cur === "case" || cur === "default") {
      curPunc = "case"
    }

    if (Object.prototype.propertyIsEnumerable.call(keywordsSpecial, cur)) {
      state.lastToken = cur
    }

    //if (cur === 'function' && state.para === 'parameterMode')
    return "keyword"
  }

  if (Object.prototype.propertyIsEnumerable.call(keywordsEtherUnit, cur)) {
    return "etherUnit"
  }

  if (
    Object.prototype.propertyIsEnumerable.call(keywordsContractRelated, cur)
  ) {
    return "contractRelated"
  }

  if (
    Object.prototype.propertyIsEnumerable.call(
      keywordsControlStructures,
      cur
    ) ||
    Object.prototype.propertyIsEnumerable.call(keywordsTypeInformation, cur) ||
    Object.prototype.propertyIsEnumerable.call(keywordsV0505NewReserve, cur)
  ) {
    return "keyword"
  }

  if (
    Object.prototype.propertyIsEnumerable.call(keywordsValueTypes, cur) ||
    Object.prototype.propertyIsEnumerable.call(keywordsTimeUnit, cur) ||
    isValidInteger(cur) ||
    isValidBytes(cur) ||
    isValidFixed(cur)
  ) {
    state.lastToken += "variable"

    return "keyword"
  }

  if (Object.prototype.propertyIsEnumerable.call(atoms, cur)) {
    return "atom"
  }

  if (Object.prototype.propertyIsEnumerable.call(keywordsErrorHandling, cur)) {
    return "errorHandling"
  }

  if (
    Object.prototype.propertyIsEnumerable.call(
      keywordsMathematicalAndCryptographicFuctions,
      cur
    )
  ) {
    return "mathematicalAndCryptographic"
  }

  if (
    Object.prototype.propertyIsEnumerable.call(
      keywordsMoreBlockAndTransactionProperties,
      cur
    ) ||
    (Object.prototype.propertyIsEnumerable.call(
      keywordsBlockAndTransactionProperties,
      cur
    ) &&
      (
        (keywordsBlockAndTransactionProperties as any)[cur] as Array<string>
      ).some(function (item) {
        return stream.match(`.${item}`)
      }))
  ) {
    return "variable-2"
  }

  if (
    cur === "abi" &&
    keywordsAbiEncodeDecodeFunctions[cur].some(function (item) {
      return stream.match(`.${item}`)
    })
  ) {
    return "abi"
  }

  const style = updateHexLiterals(cur, stream)
  if (style != null) {
    return style
  }

  if (
    (state.lastToken === "functionName(" || state.lastToken === "returns(") &&
    Object.prototype.propertyIsEnumerable.call(keywordsContractList, cur)
  ) {
    state.lastToken += "variable"

    return "variable"
  }

  if (state.lastToken === "function") {
    state.lastToken = "functionName"
    if (state.para == null) {
      state.grammar = "function"
      state.para = ""
    }

    //state.parasMode = isNaN(state.parasMode) ? 1 : state.functionLayerCount++;
    state.para += "functionName"

    return "functionName"
  }

  if (state.lastToken === "functionName(variable") {
    state.lastToken = "functionName("

    return "parameterValue"
  }

  if (state.lastToken === "returns(variable") {
    state.lastToken = "returns("

    return "parameterValue"
  }

  if (state.lastToken === "address" && cur === "payable") {
    state.lastToken = "address payable"
  }

  if (state.lastToken === "contract" || state.lastToken === "struct") {
    keywordsContractList[cur] = true
    state.lastToken = null
  }

  if (state.grammar === "function") {
    return "parameterValue"
  }

  return "variable"
}

function tokenString(quote: string) {
  return function (stream: StringStream, state: State) {
    let escaped = false

    let next

    let end = false
    next = stream.next()
    while (next != null) {
      if (next === quote && !escaped) {
        end = true
        break
      }

      escaped = !escaped && quote !== "`" && next === "\\"
      next = stream.next()
    }

    if (end || !(escaped || quote === "`")) {
      state.tokenize = tokenBase
    }

    return "string"
  }
}

function tokenComment(stream: StringStream, state: State) {
  let maybeEnd = false

  let ch = stream.next()
  while (ch) {
    if (ch === "/" && maybeEnd) {
      state.tokenize = tokenBase
      break
    }

    maybeEnd = ch === "*"
    ch = stream.next()
  }

  return "comment"
}

function isVersion(stream: StringStream, state: State) {
  if (state.lastToken === "pragma solidity") {
    state.lastToken = null

    return (
      !state.startOfLine &&
      (stream.match(/[\^{0}][0-9.]+/) ||
        stream.match(/[>=]+?[\s]*[0-9.]+[\s]*[<]?[\s]*[0-9.]+/))
    )
  }
}

function isNumber(ch: string, stream: StringStream) {
  if (/[\d.]/.test(ch)) {
    if (ch === ".") {
      stream.match(/^[0-9]+([eE][-+]?[0-9]+)?/)
    } else if (ch === "0") {
      if (!stream.match(/^[xX][0-9a-fA-F]+/)) {
        stream.match(/^0[0-7]+/)
      }
    } else {
      stream.match(/^[0-9]*\.?[0-9]*([eE][-+]?[0-9]+)?/)
    }

    return true
  }
}

function isValidInteger(token: string) {
  if (token.match(/^[u]?int/)) {
    if (token.indexOf("t") + 1 === token.length) {
      return true
    }

    const numberPart = Number(
      token.substr(token.indexOf("t") + 1, token.length)
    )

    return numberPart % 8 === 0 && numberPart <= 256
  }
}

function isValidBytes(token: string) {
  if (token.match(/^bytes/)) {
    if (token.indexOf("s") + 1 === token.length) {
      return true
    }

    const bytesPart = token.substr(token.indexOf("s") + 1, token.length)

    return Number(bytesPart) <= 32
  }
}

function isValidFixed(token: string) {
  if (token.match(/^[u]?fixed([0-9]+x[0-9]+)?/)) {
    if (token.indexOf("d") + 1 === token.length) {
      return true
    }

    const numberPart = token
      .substr(token.indexOf("d") + 1, token.length)
      .split("x")
      .map(Number)

    return (
      numberPart[0] % 8 === 0 && numberPart[0] <= 256 && numberPart[1] <= 80
    )
  }
}

function updateHexLiterals(token: string, stream: StringStream) {
  if (token.match(/^hex/) && stream.peek() === '"') {
    let maybeEnd = false

    let ch

    let hexValue = ""

    let stringAfterHex = ""
    ch = stream.next()
    while (ch) {
      stringAfterHex += ch
      if (ch === '"' && maybeEnd) {
        hexValue = stringAfterHex.substring(1, stringAfterHex.length - 1)
        if (hexValue.match(/^[0-9a-fA-F]+$/)) {
          return "number"
        }

        stream.backUp(stringAfterHex.length)

        break
      }

      maybeEnd = maybeEnd || ch === '"'
      ch = stream.next()
    }
  }
}

function updateGarmmer(ch: string, state: State) {
  if (ch === "," && state.para === "functionName(variable") {
    state.para = "functionName("
  }

  if (state.para != null && state.para.startsWith("functionName")) {
    if (ch === ")") {
      if (state.para.endsWith("(")) {
        state.para = state.para.substr(0, state.para.length - 1)
        if (state.para === "functionName") {
          state.grammar = ""
        }
      }
    } else if (ch === "(") {
      state.para += ch
    }
  }

  if (ch === "(" && state.lastToken === "functionName") {
    state.lastToken += ch
  } else if (ch === ")" && state.lastToken === "functionName(") {
    state.lastToken = null
  } else if (ch === "(" && state.lastToken === "returns") {
    state.lastToken += ch
  } else if (
    ch === ")" &&
    (state.lastToken === "returns(" || state.lastToken === "returns(variable")
  ) {
    state.lastToken = null
  }

  if (ch === "(" && state.lastToken === "address") {
    state.lastToken += ch
  }

  curPunc = ch

  return null
}

class Context {
  indented: number
  column: number
  type: string
  align: boolean | null
  prev: Context | null

  constructor(
    indented: number,
    column: number,
    type: string,
    align: boolean | null,
    prev: Context | null
  ) {
    this.indented = indented
    this.column = column
    this.type = type
    this.align = align
    this.prev = prev
  }
}

function pushContext(state: State, col: number, type: string) {
  state.context = new Context(state.indented, col, type, null, state.context)

  return state.context
}

function popContext(state: State) {
  if (!state.context.prev) {
    return
  }

  const t = state.context.type
  if (t === ")" || t === "]" || t === "}") {
    state.indented = state.context.indented
  }

  return (state.context = state.context.prev)
}

interface State {
  context: Context
  tokenize: null | ((stream: StringStream, state: State) => string | null)
  indented: number
  startOfLine: boolean
  grammar: string | null
  lastToken: string | null
  para: string | null
}

export const parser: StreamParser<State> = {
  startState(indentUnit) {
    return {
      tokenize: null,
      context: new Context(0 - indentUnit, 0, "top", false, null),
      indented: 0,
      startOfLine: true,
      grammar: null,
      lastToken: null,
      para: null
    }
  },

  token(stream, state) {
    const ctx = state.context
    if (stream.sol()) {
      if (ctx.align == null) {
        ctx.align = false
      }

      state.indented = stream.indentation()
      state.startOfLine = true
      if (ctx.type === "case") {
        ctx.type = "}"
      }

      if (state.grammar === "doc") {
        state.grammar = null
      }
    }

    if (stream.eatSpace()) {
      return null
    }

    curPunc = null
    const style = (state.tokenize || tokenBase)(stream, state)

    if (style === "comment") {
      return style
    }

    if (ctx.align == null) {
      ctx.align = true
    }

    if (curPunc === "{") {
      pushContext(state, stream.column(), "}")
    } else if (curPunc === "[") {
      pushContext(state, stream.column(), "]")
    } else if (curPunc === "(") {
      pushContext(state, stream.column(), ")")
    } else if (curPunc === "case") {
      ctx.type = "case"
    } else if (curPunc === "}" && ctx.type === "}") {
      popContext(state)
    } else if (curPunc === ctx.type) {
      popContext(state)
    }

    state.startOfLine = false

    return style
  },

  indent(state, textAfter, indentContext) {
    if (state.tokenize !== tokenBase && state.tokenize != null) {
      return null
    }

    const ctx = state.context

    const firstChar = textAfter && textAfter.charAt(0)
    if (ctx.type === "case" && /^(?:case|default)\b/.test(textAfter)) {
      state.context.type = "}"

      return ctx.indented
    }

    const closing = firstChar === ctx.type
    if (ctx.align) {
      return ctx.column + (closing ? 0 : 1)
    }

    return ctx.indented + (closing ? 0 : indentContext.unit)
  },

  // @ts-ignore not specified in new stream parser, but maybe does something
  electricChars: "{}):",
  closeBrackets: "()[]{}''\"\"``",
  fold: "brace",
  blockCommentStart: "/*",
  blockCommentEnd: "*/",
  lineComment: "//"
}

export const solidity = new LanguageSupport(StreamLanguage.define(parser))
