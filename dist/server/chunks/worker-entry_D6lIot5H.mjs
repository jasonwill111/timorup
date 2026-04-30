globalThis.process ??= {};
globalThis.process.env ??= {};
import { EventEmitter } from "node:events";
import { Writable } from "node:stream";
import "cloudflare:workers";
import { T as removeTrailingForwardSlash, V as ROUTE_TYPE_HEADER, W as REROUTE_DIRECTIVE_HEADER, X as shouldAppendForwardSlash, Y as appendForwardSlash, A as AstroError, $ as i18nNoLocaleFoundInPath, a0 as ResponseSentError, a1 as s, a2 as pipelineSymbol, a3 as ActionNotFoundError, a4 as REDIRECT_STATUS_CODES, a5 as ActionsReturnedInvalidDataError, a6 as EndpointDidNotReturnAResponse, a7 as REROUTABLE_STATUS_CODES, a8 as isPropagatingHint, a9 as getPropagationHint$1, aa as MissingMediaQueryDirective, ab as NoMatchingImport, ac as escapeHTML, ad as bufferPropagatedHead, ae as isHeadAndContent, af as isRenderTemplateResult, ag as OnlyResponseCanBeReturned, ah as isPromise, ai as promiseWithResolvers, aj as encoder, ak as chunkToByteArray, al as chunkToString, am as chunkToByteArrayOrString, an as toAttributeString, ao as markHTMLString, ap as renderSlotToString, m as maybeRenderHead, aq as containsServerDirective, F as Fragment, r as renderSlot, ar as clsx, as as renderSlots, at as ServerIslandComponent, au as createAstroComponentInstance, av as Renderer, aw as NoMatchingRenderer, ax as formatList, ay as NoClientOnlyHint, az as internalSpreadAttributes, aA as voidElementNames, b as renderTemplate, y as createRenderInstruction, aB as renderElement$1, aC as SlotString, aD as mergeSlotInstructions, aE as HTMLString, aF as isHTMLString, aG as isRenderInstruction, aH as isAstroComponentInstance, aI as isRenderInstance, aJ as renderCspContent, aK as isNode, aL as isDeno, a as addAttribute, aM as MiddlewareNoDataOrNextCalled, aN as MiddlewareNotAResponse, aO as CacheNotEnabled, k as defineMiddleware, aP as NOOP_MIDDLEWARE_HEADER, aQ as decryptString, aR as createSlotValueFromString, aS as DEFAULT_404_COMPONENT, aT as DEFAULT_404_ROUTE, aU as default404Instance, aV as decodeKey, aW as RouteCache, l as sequence, aX as ReservedSlotName, aY as getRouteGenerator, aZ as isRoute404, a_ as isRoute500, a$ as removeLeadingForwardSlash, b0 as SessionStorageInitError, b1 as SessionStorageSaveError, b2 as getParams, b3 as collapseDuplicateSlashes, b4 as setOriginPathname, b5 as getProps, b6 as ForbiddenRewrite, b7 as copyRequest, b8 as ASTRO_GENERATOR, b9 as getOriginPathname, ba as LocalsReassigned, bb as generateCspDigest, bc as PrerenderClientAddressNotAvailable, bd as ClientAddressNotAvailable, be as StaticClientAddressNotAvailable, bf as REWRITE_DIRECTIVE_HEADER_KEY, bg as REWRITE_DIRECTIVE_HEADER_VALUE, bh as AstroResponseHeadersReassigned, bi as responseSentSymbol$1, bj as prependForwardSlash, bk as collapseDuplicateLeadingSlashes, D as joinPaths, bl as isInternalPath, bm as collapseDuplicateTrailingSlashes, bn as hasFileExtension, bo as LocalsNotAnObject, bp as routeHasHtmlExtension, bq as clientAddressSymbol, br as fileExtension, bs as slash, bt as routeIsRedirect, bu as routeIsFallback, bv as getFallbackRoute, bw as findRouteToRewrite } from "./sequence_RDixOVvO.mjs";
const hrtime$1 = /* @__PURE__ */ Object.assign(function hrtime(startTime) {
  const now = Date.now();
  const seconds = Math.trunc(now / 1e3);
  const nanos = now % 1e3 * 1e6;
  if (startTime) {
    let diffSeconds = seconds - startTime[0];
    let diffNanos = nanos - startTime[0];
    if (diffNanos < 0) {
      diffSeconds = diffSeconds - 1;
      diffNanos = 1e9 + diffNanos;
    }
    return [diffSeconds, diffNanos];
  }
  return [seconds, nanos];
}, { bigint: function bigint() {
  return BigInt(Date.now() * 1e6);
} });
class ReadStream {
  fd;
  isRaw = false;
  isTTY = false;
  constructor(fd) {
    this.fd = fd;
  }
  setRawMode(mode) {
    this.isRaw = mode;
    return this;
  }
}
class WriteStream {
  fd;
  columns = 80;
  rows = 24;
  isTTY = false;
  constructor(fd) {
    this.fd = fd;
  }
  clearLine(dir, callback) {
    callback && callback();
    return false;
  }
  clearScreenDown(callback) {
    callback && callback();
    return false;
  }
  cursorTo(x, y, callback) {
    callback && typeof callback === "function" && callback();
    return false;
  }
  moveCursor(dx, dy, callback) {
    callback && callback();
    return false;
  }
  getColorDepth(env2) {
    return 1;
  }
  hasColors(count, env2) {
    return false;
  }
  getWindowSize() {
    return [this.columns, this.rows];
  }
  write(str, encoding, cb) {
    if (str instanceof Uint8Array) {
      str = new TextDecoder().decode(str);
    }
    try {
      console.log(str);
    } catch {
    }
    cb && typeof cb === "function" && cb();
    return false;
  }
}
// @__NO_SIDE_EFFECTS__
function createNotImplementedError(name) {
  return new Error(`[unenv] ${name} is not implemented yet!`);
}
// @__NO_SIDE_EFFECTS__
function notImplemented(name) {
  const fn = () => {
    throw /* @__PURE__ */ createNotImplementedError(name);
  };
  return Object.assign(fn, { __unenv__: true });
}
// @__NO_SIDE_EFFECTS__
function notImplementedAsync(name) {
  const fn = /* @__PURE__ */ notImplemented(name);
  fn.__promisify__ = () => /* @__PURE__ */ notImplemented(name + ".__promisify__");
  fn.native = fn;
  return fn;
}
// @__NO_SIDE_EFFECTS__
function notImplementedClass(name) {
  return class {
    __unenv__ = true;
    constructor() {
      throw new Error(`[unenv] ${name} is not implemented yet!`);
    }
  };
}
const NODE_VERSION = "22.14.0";
class Process extends EventEmitter {
  env;
  hrtime;
  nextTick;
  constructor(impl) {
    super();
    this.env = impl.env;
    this.hrtime = impl.hrtime;
    this.nextTick = impl.nextTick;
    for (const prop of [...Object.getOwnPropertyNames(Process.prototype), ...Object.getOwnPropertyNames(EventEmitter.prototype)]) {
      const value = this[prop];
      if (typeof value === "function") {
        this[prop] = value.bind(this);
      }
    }
  }
  // --- event emitter ---
  emitWarning(warning, type, code) {
    console.warn(`${code ? `[${code}] ` : ""}${type ? `${type}: ` : ""}${warning}`);
  }
  emit(...args) {
    return super.emit(...args);
  }
  listeners(eventName) {
    return super.listeners(eventName);
  }
  // --- stdio (lazy initializers) ---
  #stdin;
  #stdout;
  #stderr;
  get stdin() {
    return this.#stdin ??= new ReadStream(0);
  }
  get stdout() {
    return this.#stdout ??= new WriteStream(1);
  }
  get stderr() {
    return this.#stderr ??= new WriteStream(2);
  }
  // --- cwd ---
  #cwd = "/";
  chdir(cwd2) {
    this.#cwd = cwd2;
  }
  cwd() {
    return this.#cwd;
  }
  // --- dummy props and getters ---
  arch = "";
  platform = "";
  argv = [];
  argv0 = "";
  execArgv = [];
  execPath = "";
  title = "";
  pid = 200;
  ppid = 100;
  get version() {
    return `v${NODE_VERSION}`;
  }
  get versions() {
    return { node: NODE_VERSION };
  }
  get allowedNodeEnvironmentFlags() {
    return /* @__PURE__ */ new Set();
  }
  get sourceMapsEnabled() {
    return false;
  }
  get debugPort() {
    return 0;
  }
  get throwDeprecation() {
    return false;
  }
  get traceDeprecation() {
    return false;
  }
  get features() {
    return {};
  }
  get release() {
    return {};
  }
  get connected() {
    return false;
  }
  get config() {
    return {};
  }
  get moduleLoadList() {
    return [];
  }
  constrainedMemory() {
    return 0;
  }
  availableMemory() {
    return 0;
  }
  uptime() {
    return 0;
  }
  resourceUsage() {
    return {};
  }
  // --- noop methods ---
  ref() {
  }
  unref() {
  }
  // --- unimplemented methods ---
  umask() {
    throw /* @__PURE__ */ createNotImplementedError("process.umask");
  }
  getBuiltinModule() {
    return void 0;
  }
  getActiveResourcesInfo() {
    throw /* @__PURE__ */ createNotImplementedError("process.getActiveResourcesInfo");
  }
  exit() {
    throw /* @__PURE__ */ createNotImplementedError("process.exit");
  }
  reallyExit() {
    throw /* @__PURE__ */ createNotImplementedError("process.reallyExit");
  }
  kill() {
    throw /* @__PURE__ */ createNotImplementedError("process.kill");
  }
  abort() {
    throw /* @__PURE__ */ createNotImplementedError("process.abort");
  }
  dlopen() {
    throw /* @__PURE__ */ createNotImplementedError("process.dlopen");
  }
  setSourceMapsEnabled() {
    throw /* @__PURE__ */ createNotImplementedError("process.setSourceMapsEnabled");
  }
  loadEnvFile() {
    throw /* @__PURE__ */ createNotImplementedError("process.loadEnvFile");
  }
  disconnect() {
    throw /* @__PURE__ */ createNotImplementedError("process.disconnect");
  }
  cpuUsage() {
    throw /* @__PURE__ */ createNotImplementedError("process.cpuUsage");
  }
  setUncaughtExceptionCaptureCallback() {
    throw /* @__PURE__ */ createNotImplementedError("process.setUncaughtExceptionCaptureCallback");
  }
  hasUncaughtExceptionCaptureCallback() {
    throw /* @__PURE__ */ createNotImplementedError("process.hasUncaughtExceptionCaptureCallback");
  }
  initgroups() {
    throw /* @__PURE__ */ createNotImplementedError("process.initgroups");
  }
  openStdin() {
    throw /* @__PURE__ */ createNotImplementedError("process.openStdin");
  }
  assert() {
    throw /* @__PURE__ */ createNotImplementedError("process.assert");
  }
  binding() {
    throw /* @__PURE__ */ createNotImplementedError("process.binding");
  }
  // --- attached interfaces ---
  permission = { has: /* @__PURE__ */ notImplemented("process.permission.has") };
  report = {
    directory: "",
    filename: "",
    signal: "SIGUSR2",
    compact: false,
    reportOnFatalError: false,
    reportOnSignal: false,
    reportOnUncaughtException: false,
    getReport: /* @__PURE__ */ notImplemented("process.report.getReport"),
    writeReport: /* @__PURE__ */ notImplemented("process.report.writeReport")
  };
  finalization = {
    register: /* @__PURE__ */ notImplemented("process.finalization.register"),
    unregister: /* @__PURE__ */ notImplemented("process.finalization.unregister"),
    registerBeforeExit: /* @__PURE__ */ notImplemented("process.finalization.registerBeforeExit")
  };
  memoryUsage = Object.assign(() => ({
    arrayBuffers: 0,
    rss: 0,
    external: 0,
    heapTotal: 0,
    heapUsed: 0
  }), { rss: () => 0 });
  // --- undefined props ---
  mainModule = void 0;
  domain = void 0;
  // optional
  send = void 0;
  exitCode = void 0;
  channel = void 0;
  getegid = void 0;
  geteuid = void 0;
  getgid = void 0;
  getgroups = void 0;
  getuid = void 0;
  setegid = void 0;
  seteuid = void 0;
  setgid = void 0;
  setgroups = void 0;
  setuid = void 0;
  // internals
  _events = void 0;
  _eventsCount = void 0;
  _exiting = void 0;
  _maxListeners = void 0;
  _debugEnd = void 0;
  _debugProcess = void 0;
  _fatalException = void 0;
  _getActiveHandles = void 0;
  _getActiveRequests = void 0;
  _kill = void 0;
  _preload_modules = void 0;
  _rawDebug = void 0;
  _startProfilerIdleNotifier = void 0;
  _stopProfilerIdleNotifier = void 0;
  _tickCallback = void 0;
  _disconnect = void 0;
  _handleQueue = void 0;
  _pendingMessage = void 0;
  _channel = void 0;
  _send = void 0;
  _linkedBinding = void 0;
}
const globalProcess = globalThis["process"];
const getBuiltinModule = globalProcess.getBuiltinModule;
const workerdProcess = getBuiltinModule("node:process");
const unenvProcess = new Process({
  env: globalProcess.env,
  hrtime: hrtime$1,
  // `nextTick` is available from workerd process v1
  nextTick: workerdProcess.nextTick
});
const { exit, features, platform } = workerdProcess;
const {
  _channel,
  _debugEnd,
  _debugProcess,
  _disconnect,
  _events,
  _eventsCount,
  _exiting,
  _fatalException,
  _getActiveHandles,
  _getActiveRequests,
  _handleQueue,
  _kill,
  _linkedBinding,
  _maxListeners,
  _pendingMessage,
  _preload_modules,
  _rawDebug,
  _send,
  _startProfilerIdleNotifier,
  _stopProfilerIdleNotifier,
  _tickCallback,
  abort,
  addListener,
  allowedNodeEnvironmentFlags,
  arch,
  argv,
  argv0,
  assert,
  availableMemory,
  binding,
  channel,
  chdir,
  config,
  connected,
  constrainedMemory,
  cpuUsage,
  cwd,
  debugPort,
  disconnect,
  dlopen,
  domain,
  emit,
  emitWarning,
  env,
  eventNames,
  execArgv,
  execPath,
  exitCode,
  finalization,
  getActiveResourcesInfo,
  getegid,
  geteuid,
  getgid,
  getgroups,
  getMaxListeners,
  getuid,
  hasUncaughtExceptionCaptureCallback,
  hrtime: hrtime2,
  initgroups,
  kill,
  listenerCount,
  listeners,
  loadEnvFile,
  mainModule,
  memoryUsage,
  moduleLoadList,
  nextTick,
  off,
  on,
  once,
  openStdin,
  permission,
  pid,
  ppid,
  prependListener,
  prependOnceListener,
  rawListeners,
  reallyExit,
  ref,
  release,
  removeAllListeners,
  removeListener,
  report,
  resourceUsage,
  send,
  setegid,
  seteuid,
  setgid,
  setgroups,
  setMaxListeners,
  setSourceMapsEnabled,
  setuid,
  setUncaughtExceptionCaptureCallback,
  sourceMapsEnabled,
  stderr,
  stdin,
  stdout,
  throwDeprecation,
  title,
  traceDeprecation,
  umask,
  unref,
  uptime,
  version,
  versions
} = unenvProcess;
const _process = {
  abort,
  addListener,
  allowedNodeEnvironmentFlags,
  hasUncaughtExceptionCaptureCallback,
  setUncaughtExceptionCaptureCallback,
  loadEnvFile,
  sourceMapsEnabled,
  arch,
  argv,
  argv0,
  chdir,
  config,
  connected,
  constrainedMemory,
  availableMemory,
  cpuUsage,
  cwd,
  debugPort,
  dlopen,
  disconnect,
  emit,
  emitWarning,
  env,
  eventNames,
  execArgv,
  execPath,
  exit,
  finalization,
  features,
  getBuiltinModule,
  getActiveResourcesInfo,
  getMaxListeners,
  hrtime: hrtime2,
  kill,
  listeners,
  listenerCount,
  memoryUsage,
  nextTick,
  on,
  off,
  once,
  pid,
  platform,
  ppid,
  prependListener,
  prependOnceListener,
  rawListeners,
  release,
  removeAllListeners,
  removeListener,
  report,
  resourceUsage,
  setMaxListeners,
  setSourceMapsEnabled,
  stderr,
  stdin,
  stdout,
  title,
  throwDeprecation,
  traceDeprecation,
  umask,
  uptime,
  version,
  versions,
  // @ts-expect-error old API
  domain,
  initgroups,
  moduleLoadList,
  reallyExit,
  openStdin,
  assert,
  binding,
  send,
  exitCode,
  channel,
  getegid,
  geteuid,
  getgid,
  getgroups,
  getuid,
  setegid,
  seteuid,
  setgid,
  setgroups,
  setuid,
  permission,
  mainModule,
  _events,
  _eventsCount,
  _exiting,
  _maxListeners,
  _debugEnd,
  _debugProcess,
  _fatalException,
  _getActiveHandles,
  _getActiveRequests,
  _kill,
  _preload_modules,
  _rawDebug,
  _startProfilerIdleNotifier,
  _stopProfilerIdleNotifier,
  _tickCallback,
  _disconnect,
  _handleQueue,
  _pendingMessage,
  _channel,
  _send,
  _linkedBinding
};
globalThis.process = _process;
const noop = Object.assign(() => {
}, { __unenv__: true });
const _console = globalThis.console;
const _ignoreErrors = true;
const _stderr = new Writable();
const _stdout = new Writable();
const Console = _console?.Console ?? /* @__PURE__ */ notImplementedClass("console.Console");
const _times = /* @__PURE__ */ new Map();
const _stdoutErrorHandler = noop;
const _stderrErrorHandler = noop;
const workerdConsole = globalThis["console"];
Object.assign(workerdConsole, {
  Console,
  _ignoreErrors,
  _stderr,
  _stderrErrorHandler,
  _stdout,
  _stdoutErrorHandler,
  _times
});
globalThis.console = workerdConsole;
const _timeOrigin = globalThis.performance?.timeOrigin ?? Date.now();
const _performanceNow = globalThis.performance?.now ? globalThis.performance.now.bind(globalThis.performance) : () => Date.now() - _timeOrigin;
const nodeTiming = {
  name: "node",
  entryType: "node",
  startTime: 0,
  duration: 0,
  nodeStart: 0,
  v8Start: 0,
  bootstrapComplete: 0,
  environment: 0,
  loopStart: 0,
  loopExit: 0,
  idleTime: 0,
  uvMetricsInfo: {
    loopCount: 0,
    events: 0,
    eventsWaiting: 0
  },
  detail: void 0,
  toJSON() {
    return this;
  }
};
class PerformanceEntry {
  __unenv__ = true;
  detail;
  entryType = "event";
  name;
  startTime;
  constructor(name, options) {
    this.name = name;
    this.startTime = options?.startTime || _performanceNow();
    this.detail = options?.detail;
  }
  get duration() {
    return _performanceNow() - this.startTime;
  }
  toJSON() {
    return {
      name: this.name,
      entryType: this.entryType,
      startTime: this.startTime,
      duration: this.duration,
      detail: this.detail
    };
  }
}
const PerformanceMark = class PerformanceMark2 extends PerformanceEntry {
  entryType = "mark";
  constructor() {
    super(...arguments);
  }
  get duration() {
    return 0;
  }
};
class PerformanceMeasure extends PerformanceEntry {
  entryType = "measure";
}
class PerformanceResourceTiming extends PerformanceEntry {
  entryType = "resource";
  serverTiming = [];
  connectEnd = 0;
  connectStart = 0;
  decodedBodySize = 0;
  domainLookupEnd = 0;
  domainLookupStart = 0;
  encodedBodySize = 0;
  fetchStart = 0;
  initiatorType = "";
  name = "";
  nextHopProtocol = "";
  redirectEnd = 0;
  redirectStart = 0;
  requestStart = 0;
  responseEnd = 0;
  responseStart = 0;
  secureConnectionStart = 0;
  startTime = 0;
  transferSize = 0;
  workerStart = 0;
  responseStatus = 0;
}
class PerformanceObserverEntryList {
  __unenv__ = true;
  getEntries() {
    return [];
  }
  getEntriesByName(_name, _type) {
    return [];
  }
  getEntriesByType(type) {
    return [];
  }
}
class Performance {
  __unenv__ = true;
  timeOrigin = _timeOrigin;
  eventCounts = /* @__PURE__ */ new Map();
  _entries = [];
  _resourceTimingBufferSize = 0;
  navigation = void 0;
  timing = void 0;
  timerify(_fn, _options) {
    throw /* @__PURE__ */ createNotImplementedError("Performance.timerify");
  }
  get nodeTiming() {
    return nodeTiming;
  }
  eventLoopUtilization() {
    return {};
  }
  markResourceTiming() {
    return new PerformanceResourceTiming("");
  }
  onresourcetimingbufferfull = null;
  now() {
    if (this.timeOrigin === _timeOrigin) {
      return _performanceNow();
    }
    return Date.now() - this.timeOrigin;
  }
  clearMarks(markName) {
    this._entries = markName ? this._entries.filter((e) => e.name !== markName) : this._entries.filter((e) => e.entryType !== "mark");
  }
  clearMeasures(measureName) {
    this._entries = measureName ? this._entries.filter((e) => e.name !== measureName) : this._entries.filter((e) => e.entryType !== "measure");
  }
  clearResourceTimings() {
    this._entries = this._entries.filter((e) => e.entryType !== "resource" || e.entryType !== "navigation");
  }
  getEntries() {
    return this._entries;
  }
  getEntriesByName(name, type) {
    return this._entries.filter((e) => e.name === name && (!type || e.entryType === type));
  }
  getEntriesByType(type) {
    return this._entries.filter((e) => e.entryType === type);
  }
  mark(name, options) {
    const entry = new PerformanceMark(name, options);
    this._entries.push(entry);
    return entry;
  }
  measure(measureName, startOrMeasureOptions, endMark) {
    let start;
    let end;
    if (typeof startOrMeasureOptions === "string") {
      start = this.getEntriesByName(startOrMeasureOptions, "mark")[0]?.startTime;
      end = this.getEntriesByName(endMark, "mark")[0]?.startTime;
    } else {
      start = Number.parseFloat(startOrMeasureOptions?.start) || this.now();
      end = Number.parseFloat(startOrMeasureOptions?.end) || this.now();
    }
    const entry = new PerformanceMeasure(measureName, {
      startTime: start,
      detail: {
        start,
        end
      }
    });
    this._entries.push(entry);
    return entry;
  }
  setResourceTimingBufferSize(maxSize) {
    this._resourceTimingBufferSize = maxSize;
  }
  addEventListener(type, listener, options) {
    throw /* @__PURE__ */ createNotImplementedError("Performance.addEventListener");
  }
  removeEventListener(type, listener, options) {
    throw /* @__PURE__ */ createNotImplementedError("Performance.removeEventListener");
  }
  dispatchEvent(event) {
    throw /* @__PURE__ */ createNotImplementedError("Performance.dispatchEvent");
  }
  toJSON() {
    return this;
  }
}
class PerformanceObserver {
  __unenv__ = true;
  static supportedEntryTypes = [];
  _callback = null;
  constructor(callback) {
    this._callback = callback;
  }
  takeRecords() {
    return [];
  }
  disconnect() {
    throw /* @__PURE__ */ createNotImplementedError("PerformanceObserver.disconnect");
  }
  observe(options) {
    throw /* @__PURE__ */ createNotImplementedError("PerformanceObserver.observe");
  }
  bind(fn) {
    return fn;
  }
  runInAsyncScope(fn, thisArg, ...args) {
    return fn.call(thisArg, ...args);
  }
  asyncId() {
    return 0;
  }
  triggerAsyncId() {
    return 0;
  }
  emitDestroy() {
    return this;
  }
}
const performance$1 = globalThis.performance && "addEventListener" in globalThis.performance ? globalThis.performance : new Performance();
if (!("__unenv__" in performance$1)) {
  const proto = Performance.prototype;
  for (const key of Object.getOwnPropertyNames(proto)) {
    if (key !== "constructor" && !(key in performance$1)) {
      const desc = Object.getOwnPropertyDescriptor(proto, key);
      if (desc) {
        Object.defineProperty(performance$1, key, desc);
      }
    }
  }
}
globalThis.performance = performance$1;
globalThis.Performance = Performance;
globalThis.PerformanceEntry = PerformanceEntry;
globalThis.PerformanceMark = PerformanceMark;
globalThis.PerformanceMeasure = PerformanceMeasure;
globalThis.PerformanceObserver = PerformanceObserver;
globalThis.PerformanceObserverEntryList = PerformanceObserverEntryList;
globalThis.PerformanceResourceTiming = PerformanceResourceTiming;
const sessionKVBindingName = "SESSION";
function matchPattern(url, remotePattern) {
  return matchProtocol(url, remotePattern.protocol) && matchHostname(url, remotePattern.hostname, true) && matchPort(url, remotePattern.port) && matchPathname(url, remotePattern.pathname, true);
}
function matchPort(url, port) {
  return !port || port === url.port;
}
function matchProtocol(url, protocol) {
  return !protocol || protocol === url.protocol.slice(0, -1);
}
function matchHostname(url, hostname, allowWildcard = false) {
  if (!hostname) {
    return true;
  } else if (!allowWildcard || !hostname.startsWith("*")) {
    return hostname === url.hostname;
  } else if (hostname.startsWith("**.")) {
    const slicedHostname = hostname.slice(2);
    return slicedHostname !== url.hostname && url.hostname.endsWith(slicedHostname);
  } else if (hostname.startsWith("*.")) {
    const slicedHostname = hostname.slice(1);
    if (!url.hostname.endsWith(slicedHostname)) {
      return false;
    }
    const subdomainWithDot = url.hostname.slice(0, -(slicedHostname.length - 1));
    return subdomainWithDot.endsWith(".") && !subdomainWithDot.slice(0, -1).includes(".");
  }
  return false;
}
function matchPathname(url, pathname, allowWildcard = false) {
  if (!pathname) {
    return true;
  } else if (!allowWildcard || !pathname.endsWith("*")) {
    return pathname === url.pathname;
  } else if (pathname.endsWith("/**")) {
    const slicedPathname = pathname.slice(0, -2);
    return slicedPathname !== url.pathname && url.pathname.startsWith(slicedPathname);
  } else if (pathname.endsWith("/*")) {
    const slicedPathname = pathname.slice(0, -1);
    if (!url.pathname.startsWith(slicedPathname)) {
      return false;
    }
    const additionalPathChunks = url.pathname.slice(slicedPathname.length).split("/").filter(Boolean);
    return additionalPathChunks.length === 1;
  }
  return false;
}
function isRemoteAllowed(src, {
  domains,
  remotePatterns
}) {
  if (!URL.canParse(src)) {
    return false;
  }
  const url = new URL(src);
  if (!["http:", "https:", "data:"].includes(url.protocol)) {
    return false;
  }
  return domains.some((domain2) => matchHostname(url, domain2)) || remotePatterns.some((remotePattern) => matchPattern(url, remotePattern));
}
function computeFallbackRoute(options) {
  const {
    pathname,
    responseStatus,
    fallback,
    fallbackType,
    locales,
    defaultLocale,
    strategy,
    base
  } = options;
  if (responseStatus !== 404) {
    return { type: "none" };
  }
  if (!fallback || Object.keys(fallback).length === 0) {
    return { type: "none" };
  }
  const segments = pathname.split("/");
  const urlLocale = segments.find((segment) => {
    for (const locale of locales) {
      if (typeof locale === "string") {
        if (locale === segment) {
          return true;
        }
      } else if (locale.path === segment) {
        return true;
      }
    }
    return false;
  });
  if (!urlLocale) {
    return { type: "none" };
  }
  const fallbackKeys = Object.keys(fallback);
  if (!fallbackKeys.includes(urlLocale)) {
    return { type: "none" };
  }
  const fallbackLocale = fallback[urlLocale];
  const pathFallbackLocale = getPathByLocale(fallbackLocale, locales);
  let newPathname;
  if (pathFallbackLocale === defaultLocale && strategy === "pathname-prefix-other-locales") {
    if (pathname.includes(`${base}`)) {
      newPathname = pathname.replace(`/${urlLocale}`, ``);
    } else {
      newPathname = pathname.replace(`/${urlLocale}`, `/`);
    }
  } else {
    newPathname = pathname.replace(`/${urlLocale}`, `/${pathFallbackLocale}`);
  }
  return {
    type: fallbackType,
    pathname: newPathname
  };
}
class I18nRouter {
  #strategy;
  #defaultLocale;
  #locales;
  #base;
  #domains;
  constructor(options) {
    this.#strategy = options.strategy;
    this.#defaultLocale = options.defaultLocale;
    this.#locales = options.locales;
    this.#base = options.base === "/" ? "/" : removeTrailingForwardSlash(options.base || "");
    this.#domains = options.domains;
  }
  /**
   * Evaluate routing strategy for a pathname.
   * Returns decision object (not HTTP Response).
   */
  match(pathname, context) {
    if (this.shouldSkipProcessing(pathname, context)) {
      return { type: "continue" };
    }
    switch (this.#strategy) {
      case "manual":
        return { type: "continue" };
      case "pathname-prefix-always":
        return this.matchPrefixAlways(pathname, context);
      case "domains-prefix-always":
        if (this.localeHasntDomain(context.currentLocale, context.currentDomain)) {
          return { type: "continue" };
        }
        return this.matchPrefixAlways(pathname, context);
      case "pathname-prefix-other-locales":
        return this.matchPrefixOtherLocales(pathname, context);
      case "domains-prefix-other-locales":
        if (this.localeHasntDomain(context.currentLocale, context.currentDomain)) {
          return { type: "continue" };
        }
        return this.matchPrefixOtherLocales(pathname, context);
      case "pathname-prefix-always-no-redirect":
        return this.matchPrefixAlwaysNoRedirect(pathname, context);
      case "domains-prefix-always-no-redirect":
        if (this.localeHasntDomain(context.currentLocale, context.currentDomain)) {
          return { type: "continue" };
        }
        return this.matchPrefixAlwaysNoRedirect(pathname, context);
      default:
        return { type: "continue" };
    }
  }
  /**
   * Check if i18n processing should be skipped for this request
   */
  shouldSkipProcessing(pathname, context) {
    if (pathname.includes("/404") || pathname.includes("/500")) {
      return true;
    }
    if (pathname.includes("/_server-islands/")) {
      return true;
    }
    if (context.isReroute) {
      return true;
    }
    if (context.routeType && context.routeType !== "page" && context.routeType !== "fallback") {
      return true;
    }
    return false;
  }
  /**
   * Strategy: pathname-prefix-always
   * All locales must have a prefix, including the default locale.
   */
  matchPrefixAlways(pathname, _context) {
    const isRoot = pathname === this.#base + "/" || pathname === this.#base;
    if (isRoot) {
      const basePrefix = this.#base === "/" ? "" : this.#base;
      return {
        type: "redirect",
        location: `${basePrefix}/${this.#defaultLocale}`
      };
    }
    if (!pathHasLocale(pathname, this.#locales)) {
      return { type: "notFound" };
    }
    return { type: "continue" };
  }
  /**
   * Strategy: pathname-prefix-other-locales
   * Default locale has no prefix, other locales must have a prefix.
   */
  matchPrefixOtherLocales(pathname, _context) {
    let pathnameContainsDefaultLocale = false;
    for (const segment of pathname.split("/")) {
      if (normalizeTheLocale(segment) === normalizeTheLocale(this.#defaultLocale)) {
        pathnameContainsDefaultLocale = true;
        break;
      }
    }
    if (pathnameContainsDefaultLocale) {
      const newLocation = pathname.replace(`/${this.#defaultLocale}`, "");
      return {
        type: "notFound",
        location: newLocation
      };
    }
    return { type: "continue" };
  }
  /**
   * Strategy: pathname-prefix-always-no-redirect
   * Like prefix-always but allows root to serve instead of redirecting
   */
  matchPrefixAlwaysNoRedirect(pathname, _context) {
    const isRoot = pathname === this.#base + "/" || pathname === this.#base;
    if (isRoot) {
      return { type: "continue" };
    }
    if (!pathHasLocale(pathname, this.#locales)) {
      return { type: "notFound" };
    }
    return { type: "continue" };
  }
  /**
   * Check if the current locale doesn't belong to the configured domain.
   * Used for domain-based routing strategies.
   */
  localeHasntDomain(currentLocale, currentDomain) {
    if (!this.#domains || !currentDomain) {
      return false;
    }
    if (!currentLocale) {
      return false;
    }
    const localesForDomain = this.#domains[currentDomain];
    if (!localesForDomain) {
      return true;
    }
    return !localesForDomain.includes(currentLocale);
  }
}
function createI18nMiddleware(i18n, base, trailingSlash, format) {
  if (!i18n) return (_, next) => next();
  const i18nRouter = new I18nRouter({
    strategy: i18n.strategy,
    defaultLocale: i18n.defaultLocale,
    locales: i18n.locales,
    base,
    domains: i18n.domainLookupTable ? Object.keys(i18n.domainLookupTable).reduce(
      (acc, domain2) => {
        const locale = i18n.domainLookupTable[domain2];
        if (!acc[domain2]) {
          acc[domain2] = [];
        }
        acc[domain2].push(locale);
        return acc;
      },
      {}
    ) : void 0
  });
  return async (context, next) => {
    const response = await next();
    const typeHeader = response.headers.get(ROUTE_TYPE_HEADER);
    const isReroute = response.headers.get(REROUTE_DIRECTIVE_HEADER);
    if (isReroute === "no" && typeof i18n.fallback === "undefined") {
      return response;
    }
    if (typeHeader !== "page" && typeHeader !== "fallback") {
      return response;
    }
    const routerContext = {
      currentLocale: context.currentLocale,
      currentDomain: context.url.hostname,
      routeType: typeHeader,
      isReroute: isReroute === "yes"
    };
    const routeDecision = i18nRouter.match(context.url.pathname, routerContext);
    switch (routeDecision.type) {
      case "redirect": {
        let location = routeDecision.location;
        if (shouldAppendForwardSlash(trailingSlash, format)) {
          location = appendForwardSlash(location);
        }
        return context.redirect(location, routeDecision.status);
      }
      case "notFound": {
        if (context.isPrerendered) {
          const prerenderedRes = new Response(response.body, {
            status: 404,
            headers: response.headers
          });
          prerenderedRes.headers.set(REROUTE_DIRECTIVE_HEADER, "no");
          if (routeDecision.location) {
            prerenderedRes.headers.set("Location", routeDecision.location);
          }
          return prerenderedRes;
        }
        const headers = new Headers();
        if (routeDecision.location) {
          headers.set("Location", routeDecision.location);
        }
        return new Response(null, { status: 404, headers });
      }
    }
    if (i18n.fallback && i18n.fallbackType) {
      const fallbackDecision = computeFallbackRoute({
        pathname: context.url.pathname,
        responseStatus: response.status,
        currentLocale: context.currentLocale,
        fallback: i18n.fallback,
        fallbackType: i18n.fallbackType,
        locales: i18n.locales,
        defaultLocale: i18n.defaultLocale,
        strategy: i18n.strategy,
        base
      });
      switch (fallbackDecision.type) {
        case "redirect":
          return context.redirect(fallbackDecision.pathname + context.url.search);
        case "rewrite":
          return await context.rewrite(fallbackDecision.pathname + context.url.search);
      }
    }
    return response;
  };
}
function pathHasLocale(path, locales) {
  const segments = path.split("/").map(normalizeThePath);
  for (const segment of segments) {
    for (const locale of locales) {
      if (typeof locale === "string") {
        if (normalizeTheLocale(segment) === normalizeTheLocale(locale)) {
          return true;
        }
      } else if (segment === locale.path) {
        return true;
      }
    }
  }
  return false;
}
function getPathByLocale(locale, locales) {
  for (const loopLocale of locales) {
    if (typeof loopLocale === "string") {
      if (loopLocale === locale) {
        return loopLocale;
      }
    } else {
      for (const code of loopLocale.codes) {
        if (code === locale) {
          return loopLocale.path;
        }
      }
    }
  }
  throw new AstroError(i18nNoLocaleFoundInPath);
}
function normalizeTheLocale(locale) {
  return locale.replaceAll("_", "-").toLowerCase();
}
function normalizeThePath(path) {
  return path.endsWith(".html") ? path.slice(0, -5) : path;
}
function getAllCodes(locales) {
  const result = [];
  for (const loopLocale of locales) {
    if (typeof loopLocale === "string") {
      result.push(loopLocale);
    } else {
      result.push(...loopLocale.codes);
    }
  }
  return result;
}
var dist = {};
var hasRequiredDist;
function requireDist() {
  if (hasRequiredDist) return dist;
  hasRequiredDist = 1;
  Object.defineProperty(dist, "__esModule", { value: true });
  dist.parseCookie = parseCookie;
  dist.parse = parseCookie;
  dist.stringifyCookie = stringifyCookie;
  dist.stringifySetCookie = stringifySetCookie;
  dist.serialize = stringifySetCookie;
  dist.parseSetCookie = parseSetCookie;
  dist.stringifySetCookie = stringifySetCookie;
  dist.serialize = stringifySetCookie;
  const cookieNameRegExp = /^[\u0021-\u003A\u003C\u003E-\u007E]+$/;
  const cookieValueRegExp = /^[\u0021-\u003A\u003C-\u007E]*$/;
  const domainValueRegExp = /^([.]?[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)([.][a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)*$/i;
  const pathValueRegExp = /^[\u0020-\u003A\u003D-\u007E]*$/;
  const maxAgeRegExp = /^-?\d+$/;
  const __toString = Object.prototype.toString;
  const NullObject = /* @__PURE__ */ (() => {
    const C = function() {
    };
    C.prototype = /* @__PURE__ */ Object.create(null);
    return C;
  })();
  function parseCookie(str, options) {
    const obj = new NullObject();
    const len = str.length;
    if (len < 2)
      return obj;
    const dec = options?.decode || decode;
    let index = 0;
    do {
      const eqIdx = eqIndex(str, index, len);
      if (eqIdx === -1)
        break;
      const endIdx = endIndex(str, index, len);
      if (eqIdx > endIdx) {
        index = str.lastIndexOf(";", eqIdx - 1) + 1;
        continue;
      }
      const key = valueSlice(str, index, eqIdx);
      if (obj[key] === void 0) {
        obj[key] = dec(valueSlice(str, eqIdx + 1, endIdx));
      }
      index = endIdx + 1;
    } while (index < len);
    return obj;
  }
  function stringifyCookie(cookie, options) {
    const enc = options?.encode || encodeURIComponent;
    const cookieStrings = [];
    for (const name of Object.keys(cookie)) {
      const val = cookie[name];
      if (val === void 0)
        continue;
      if (!cookieNameRegExp.test(name)) {
        throw new TypeError(`cookie name is invalid: ${name}`);
      }
      const value = enc(val);
      if (!cookieValueRegExp.test(value)) {
        throw new TypeError(`cookie val is invalid: ${val}`);
      }
      cookieStrings.push(`${name}=${value}`);
    }
    return cookieStrings.join("; ");
  }
  function stringifySetCookie(_name, _val, _opts) {
    const cookie = typeof _name === "object" ? _name : { ..._opts, name: _name, value: String(_val) };
    const options = typeof _val === "object" ? _val : _opts;
    const enc = options?.encode || encodeURIComponent;
    if (!cookieNameRegExp.test(cookie.name)) {
      throw new TypeError(`argument name is invalid: ${cookie.name}`);
    }
    const value = cookie.value ? enc(cookie.value) : "";
    if (!cookieValueRegExp.test(value)) {
      throw new TypeError(`argument val is invalid: ${cookie.value}`);
    }
    let str = cookie.name + "=" + value;
    if (cookie.maxAge !== void 0) {
      if (!Number.isInteger(cookie.maxAge)) {
        throw new TypeError(`option maxAge is invalid: ${cookie.maxAge}`);
      }
      str += "; Max-Age=" + cookie.maxAge;
    }
    if (cookie.domain) {
      if (!domainValueRegExp.test(cookie.domain)) {
        throw new TypeError(`option domain is invalid: ${cookie.domain}`);
      }
      str += "; Domain=" + cookie.domain;
    }
    if (cookie.path) {
      if (!pathValueRegExp.test(cookie.path)) {
        throw new TypeError(`option path is invalid: ${cookie.path}`);
      }
      str += "; Path=" + cookie.path;
    }
    if (cookie.expires) {
      if (!isDate(cookie.expires) || !Number.isFinite(cookie.expires.valueOf())) {
        throw new TypeError(`option expires is invalid: ${cookie.expires}`);
      }
      str += "; Expires=" + cookie.expires.toUTCString();
    }
    if (cookie.httpOnly) {
      str += "; HttpOnly";
    }
    if (cookie.secure) {
      str += "; Secure";
    }
    if (cookie.partitioned) {
      str += "; Partitioned";
    }
    if (cookie.priority) {
      const priority = typeof cookie.priority === "string" ? cookie.priority.toLowerCase() : void 0;
      switch (priority) {
        case "low":
          str += "; Priority=Low";
          break;
        case "medium":
          str += "; Priority=Medium";
          break;
        case "high":
          str += "; Priority=High";
          break;
        default:
          throw new TypeError(`option priority is invalid: ${cookie.priority}`);
      }
    }
    if (cookie.sameSite) {
      const sameSite = typeof cookie.sameSite === "string" ? cookie.sameSite.toLowerCase() : cookie.sameSite;
      switch (sameSite) {
        case true:
        case "strict":
          str += "; SameSite=Strict";
          break;
        case "lax":
          str += "; SameSite=Lax";
          break;
        case "none":
          str += "; SameSite=None";
          break;
        default:
          throw new TypeError(`option sameSite is invalid: ${cookie.sameSite}`);
      }
    }
    return str;
  }
  function parseSetCookie(str, options) {
    const dec = options?.decode || decode;
    const len = str.length;
    const endIdx = endIndex(str, 0, len);
    const eqIdx = eqIndex(str, 0, endIdx);
    const setCookie = eqIdx === -1 ? { name: "", value: dec(valueSlice(str, 0, endIdx)) } : {
      name: valueSlice(str, 0, eqIdx),
      value: dec(valueSlice(str, eqIdx + 1, endIdx))
    };
    let index = endIdx + 1;
    while (index < len) {
      const endIdx2 = endIndex(str, index, len);
      const eqIdx2 = eqIndex(str, index, endIdx2);
      const attr = eqIdx2 === -1 ? valueSlice(str, index, endIdx2) : valueSlice(str, index, eqIdx2);
      const val = eqIdx2 === -1 ? void 0 : valueSlice(str, eqIdx2 + 1, endIdx2);
      switch (attr.toLowerCase()) {
        case "httponly":
          setCookie.httpOnly = true;
          break;
        case "secure":
          setCookie.secure = true;
          break;
        case "partitioned":
          setCookie.partitioned = true;
          break;
        case "domain":
          setCookie.domain = val;
          break;
        case "path":
          setCookie.path = val;
          break;
        case "max-age":
          if (val && maxAgeRegExp.test(val))
            setCookie.maxAge = Number(val);
          break;
        case "expires":
          if (!val)
            break;
          const date = new Date(val);
          if (Number.isFinite(date.valueOf()))
            setCookie.expires = date;
          break;
        case "priority":
          if (!val)
            break;
          const priority = val.toLowerCase();
          if (priority === "low" || priority === "medium" || priority === "high") {
            setCookie.priority = priority;
          }
          break;
        case "samesite":
          if (!val)
            break;
          const sameSite = val.toLowerCase();
          if (sameSite === "lax" || sameSite === "strict" || sameSite === "none") {
            setCookie.sameSite = sameSite;
          }
          break;
      }
      index = endIdx2 + 1;
    }
    return setCookie;
  }
  function endIndex(str, min, len) {
    const index = str.indexOf(";", min);
    return index === -1 ? len : index;
  }
  function eqIndex(str, min, max) {
    const index = str.indexOf("=", min);
    return index < max ? index : -1;
  }
  function valueSlice(str, min, max) {
    let start = min;
    let end = max;
    do {
      const code = str.charCodeAt(start);
      if (code !== 32 && code !== 9)
        break;
    } while (++start < end);
    while (end > start) {
      const code = str.charCodeAt(end - 1);
      if (code !== 32 && code !== 9)
        break;
      end--;
    }
    return str.slice(start, end);
  }
  function decode(str) {
    if (str.indexOf("%") === -1)
      return str;
    try {
      return decodeURIComponent(str);
    } catch (e) {
      return str;
    }
  }
  function isDate(val) {
    return __toString.call(val) === "[object Date]";
  }
  return dist;
}
var distExports = /* @__PURE__ */ requireDist();
const DELETED_EXPIRATION = /* @__PURE__ */ new Date(0);
const DELETED_VALUE = "deleted";
const responseSentSymbol = /* @__PURE__ */ Symbol.for("astro.responseSent");
const identity = (value) => value;
class AstroCookie {
  value;
  constructor(value) {
    this.value = value;
  }
  json() {
    if (this.value === void 0) {
      throw new Error(`Cannot convert undefined to an object.`);
    }
    return JSON.parse(this.value);
  }
  number() {
    return Number(this.value);
  }
  boolean() {
    if (this.value === "false") return false;
    if (this.value === "0") return false;
    return Boolean(this.value);
  }
}
class AstroCookies {
  #request;
  #requestValues;
  #outgoing;
  #consumed;
  constructor(request) {
    this.#request = request;
    this.#requestValues = null;
    this.#outgoing = null;
    this.#consumed = false;
  }
  /**
   * Astro.cookies.delete(key) is used to delete a cookie. Using this method will result
   * in a Set-Cookie header added to the response.
   * @param key The cookie to delete
   * @param options Options related to this deletion, such as the path of the cookie.
   */
  delete(key, options) {
    const {
      // @ts-expect-error
      maxAge: _ignoredMaxAge,
      // @ts-expect-error
      expires: _ignoredExpires,
      ...sanitizedOptions
    } = options || {};
    const serializeOptions = {
      expires: DELETED_EXPIRATION,
      ...sanitizedOptions
    };
    this.#ensureOutgoingMap().set(key, [
      DELETED_VALUE,
      distExports.serialize(key, DELETED_VALUE, serializeOptions),
      false
    ]);
  }
  /**
   * Astro.cookies.get(key) is used to get a cookie value. The cookie value is read from the
   * request. If you have set a cookie via Astro.cookies.set(key, value), the value will be taken
   * from that set call, overriding any values already part of the request.
   * @param key The cookie to get.
   * @returns An object containing the cookie value as well as convenience methods for converting its value.
   */
  get(key, options = void 0) {
    if (this.#outgoing?.has(key)) {
      let [serializedValue, , isSetValue] = this.#outgoing.get(key);
      if (isSetValue) {
        return new AstroCookie(serializedValue);
      } else {
        return void 0;
      }
    }
    const decode = options?.decode ?? decodeURIComponent;
    const values = this.#ensureParsed();
    if (key in values) {
      const value = values[key];
      if (value) {
        let decodedValue;
        try {
          decodedValue = decode(value);
        } catch (_error) {
          decodedValue = value;
        }
        return new AstroCookie(decodedValue);
      }
    }
  }
  /**
   * Astro.cookies.has(key) returns a boolean indicating whether this cookie is either
   * part of the initial request or set via Astro.cookies.set(key)
   * @param key The cookie to check for.
   * @param _options This parameter is no longer used.
   * @returns
   */
  has(key, _options) {
    if (this.#outgoing?.has(key)) {
      let [, , isSetValue] = this.#outgoing.get(key);
      return isSetValue;
    }
    const values = this.#ensureParsed();
    return values[key] !== void 0;
  }
  /**
   * Astro.cookies.set(key, value) is used to set a cookie's value. If provided
   * an object it will be stringified via JSON.stringify(value). Additionally you
   * can provide options customizing how this cookie will be set, such as setting httpOnly
   * in order to prevent the cookie from being read in client-side JavaScript.
   * @param key The name of the cookie to set.
   * @param value A value, either a string or other primitive or an object.
   * @param options Options for the cookie, such as the path and security settings.
   */
  set(key, value, options) {
    if (this.#consumed) {
      const warning = new Error(
        "Astro.cookies.set() was called after the cookies had already been sent to the browser.\nThis may have happened if this method was called in an imported component.\nPlease make sure that Astro.cookies.set() is only called in the frontmatter of the main page."
      );
      warning.name = "Warning";
      console.warn(warning);
    }
    let serializedValue;
    if (typeof value === "string") {
      serializedValue = value;
    } else {
      let toStringValue = value.toString();
      if (toStringValue === Object.prototype.toString.call(value)) {
        serializedValue = JSON.stringify(value);
      } else {
        serializedValue = toStringValue;
      }
    }
    const serializeOptions = {};
    if (options) {
      Object.assign(serializeOptions, options);
    }
    this.#ensureOutgoingMap().set(key, [
      serializedValue,
      distExports.serialize(key, serializedValue, serializeOptions),
      true
    ]);
    if (this.#request[responseSentSymbol]) {
      throw new AstroError({
        ...ResponseSentError
      });
    }
  }
  /**
   * Merges a new AstroCookies instance into the current instance. Any new cookies
   * will be added to the current instance, overwriting any existing cookies with the same name.
   */
  merge(cookies) {
    const outgoing = cookies.#outgoing;
    if (outgoing) {
      for (const [key, value] of outgoing) {
        this.#ensureOutgoingMap().set(key, value);
      }
    }
  }
  /**
   * Astro.cookies.header() returns an iterator for the cookies that have previously
   * been set by either Astro.cookies.set() or Astro.cookies.delete().
   * This method is primarily used by adapters to set the header on outgoing responses.
   * @returns
   */
  *headers() {
    if (this.#outgoing == null) return;
    for (const [, value] of this.#outgoing) {
      yield value[1];
    }
  }
  /**
   * Behaves the same as AstroCookies.prototype.headers(),
   * but allows a warning when cookies are set after the instance is consumed.
   */
  static consume(cookies) {
    cookies.#consumed = true;
    return cookies.headers();
  }
  #ensureParsed() {
    if (!this.#requestValues) {
      this.#parse();
    }
    if (!this.#requestValues) {
      this.#requestValues = /* @__PURE__ */ Object.create(null);
    }
    return this.#requestValues;
  }
  #ensureOutgoingMap() {
    if (!this.#outgoing) {
      this.#outgoing = /* @__PURE__ */ new Map();
    }
    return this.#outgoing;
  }
  #parse() {
    const raw = this.#request.headers.get("cookie");
    if (!raw) {
      return;
    }
    this.#requestValues = distExports.parse(raw, { decode: identity });
  }
}
const astroCookiesSymbol = /* @__PURE__ */ Symbol.for("astro.cookies");
function attachCookiesToResponse(response, cookies) {
  Reflect.set(response, astroCookiesSymbol, cookies);
}
function getCookiesFromResponse(response) {
  let cookies = Reflect.get(response, astroCookiesSymbol);
  if (cookies != null) {
    return cookies;
  } else {
    return void 0;
  }
}
function* getSetCookiesFromResponse(response) {
  const cookies = getCookiesFromResponse(response);
  if (!cookies) {
    return [];
  }
  for (const headerValue of AstroCookies.consume(cookies)) {
    yield headerValue;
  }
  return [];
}
const dateTimeFormat = new Intl.DateTimeFormat([], {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false
});
const levels = {
  debug: 20,
  info: 30,
  warn: 40,
  error: 50,
  silent: 90
};
function log(opts, level, label, message, newLine = true) {
  const logLevel = opts.level;
  const dest = opts.destination;
  const event = {
    label,
    level,
    message,
    newLine,
    _format: opts._format
  };
  if (!isLogLevelEnabled(logLevel, level)) {
    return;
  }
  dest.write(event);
}
function isLogLevelEnabled(configuredLogLevel, level) {
  return levels[configuredLogLevel] <= levels[level];
}
function info(opts, label, message, newLine = true) {
  return log(opts, "info", label, message, newLine);
}
function warn(opts, label, message, newLine = true) {
  return log(opts, "warn", label, message, newLine);
}
function error(opts, label, message, newLine = true) {
  return log(opts, "error", label, message, newLine);
}
function debug(...args) {
  if ("_astroGlobalDebug" in globalThis) {
    globalThis._astroGlobalDebug(...args);
  }
}
function getEventPrefix({ level, label }) {
  const timestamp = `${dateTimeFormat.format(/* @__PURE__ */ new Date())}`;
  const prefix = [];
  if (level === "error" || level === "warn") {
    prefix.push(s.bold(timestamp));
    prefix.push(`[${level.toUpperCase()}]`);
  } else {
    prefix.push(timestamp);
  }
  if (label) {
    prefix.push(`[${label}]`);
  }
  if (level === "error") {
    return s.red(prefix.join(" "));
  }
  if (level === "warn") {
    return s.yellow(prefix.join(" "));
  }
  if (prefix.length === 1) {
    return s.dim(prefix[0]);
  }
  return s.dim(prefix[0]) + " " + s.blue(prefix.splice(1).join(" "));
}
class AstroLogger {
  options;
  constructor(options) {
    if (!options._format) {
      options._format = "default";
    }
    this.options = options;
  }
  info(label, message, newLine = true) {
    info(this.options, label, message, newLine);
  }
  warn(label, message, newLine = true) {
    warn(this.options, label, message, newLine);
  }
  error(label, message, newLine = true) {
    error(this.options, label, message, newLine);
  }
  debug(label, ...messages) {
    debug(label, ...messages);
  }
  level() {
    return this.options.level;
  }
  forkIntegrationLogger(label) {
    return new AstroIntegrationLogger(this.options, label);
  }
}
class AstroIntegrationLogger {
  options;
  label;
  constructor(logging, label) {
    this.options = logging;
    this.label = label;
  }
  /**
   * Creates a new logger instance with a new label, but the same log options.
   */
  fork(label) {
    return new AstroIntegrationLogger(this.options, label);
  }
  info(message) {
    info(this.options, this.label, message);
  }
  warn(message) {
    warn(this.options, this.label, message);
  }
  error(message) {
    error(this.options, this.label, message);
  }
  debug(message) {
    debug(this.label, message);
  }
}
const consoleLogDestination = {
  write(event) {
    let dest = console.error;
    if (levels[event.level] < levels["error"]) {
      dest = console.info;
    }
    if (event.label === "SKIP_FORMAT") {
      dest(event.message);
    } else {
      dest(getEventPrefix(event) + " " + event.message);
    }
    return true;
  }
};
class DevalueError extends Error {
  /**
   * @param {string} message
   * @param {string[]} keys
   * @param {any} [value] - The value that failed to be serialized
   * @param {any} [root] - The root value being serialized
   */
  constructor(message, keys, value, root) {
    super(message);
    this.name = "DevalueError";
    this.path = keys.join("");
    this.value = value;
    this.root = root;
  }
}
function is_primitive(thing) {
  return thing === null || typeof thing !== "object" && typeof thing !== "function";
}
const object_proto_names = /* @__PURE__ */ Object.getOwnPropertyNames(Object.prototype).sort().join("\0");
function is_plain_object(thing) {
  const proto = Object.getPrototypeOf(thing);
  return proto === Object.prototype || proto === null || Object.getPrototypeOf(proto) === null || Object.getOwnPropertyNames(proto).sort().join("\0") === object_proto_names;
}
function get_type(thing) {
  return Object.prototype.toString.call(thing).slice(8, -1);
}
function get_escaped_char(char) {
  switch (char) {
    case '"':
      return '\\"';
    case "<":
      return "\\u003C";
    case "\\":
      return "\\\\";
    case "\n":
      return "\\n";
    case "\r":
      return "\\r";
    case "	":
      return "\\t";
    case "\b":
      return "\\b";
    case "\f":
      return "\\f";
    case "\u2028":
      return "\\u2028";
    case "\u2029":
      return "\\u2029";
    default:
      return char < " " ? `\\u${char.charCodeAt(0).toString(16).padStart(4, "0")}` : "";
  }
}
function stringify_string(str) {
  let result = "";
  let last_pos = 0;
  const len = str.length;
  for (let i = 0; i < len; i += 1) {
    const char = str[i];
    const replacement = get_escaped_char(char);
    if (replacement) {
      result += str.slice(last_pos, i) + replacement;
      last_pos = i + 1;
    }
  }
  return `"${last_pos === 0 ? str : result + str.slice(last_pos)}"`;
}
function enumerable_symbols(object) {
  return Object.getOwnPropertySymbols(object).filter(
    (symbol) => Object.getOwnPropertyDescriptor(object, symbol).enumerable
  );
}
const is_identifier = /^[a-zA-Z_$][a-zA-Z_$0-9]*$/;
function stringify_key(key) {
  return is_identifier.test(key) ? "." + key : "[" + JSON.stringify(key) + "]";
}
function is_valid_array_index(s2) {
  if (s2.length === 0) return false;
  if (s2.length > 1 && s2.charCodeAt(0) === 48) return false;
  for (let i = 0; i < s2.length; i++) {
    const c = s2.charCodeAt(i);
    if (c < 48 || c > 57) return false;
  }
  const n = +s2;
  if (n >= 2 ** 32 - 1) return false;
  if (n < 0) return false;
  return true;
}
function valid_array_indices(array) {
  const keys = Object.keys(array);
  for (var i = keys.length - 1; i >= 0; i--) {
    if (is_valid_array_index(keys[i])) {
      break;
    }
  }
  keys.length = i + 1;
  return keys;
}
function encode_native(array_buffer) {
  return new Uint8Array(array_buffer).toBase64();
}
function decode_native(base64) {
  return Uint8Array.fromBase64(base64).buffer;
}
function encode_buffer(array_buffer) {
  return Buffer.from(array_buffer).toString("base64");
}
function decode_buffer(base64) {
  return Uint8Array.from(Buffer.from(base64, "base64")).buffer;
}
function encode_legacy(array_buffer) {
  const array = new Uint8Array(array_buffer);
  let binary2 = "";
  const chunk_size = 32768;
  for (let i = 0; i < array.length; i += chunk_size) {
    const chunk = array.subarray(i, i + chunk_size);
    binary2 += String.fromCharCode.apply(null, chunk);
  }
  return btoa(binary2);
}
function decode_legacy(base64) {
  const binary_string = atob(base64);
  const len = binary_string.length;
  const array = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    array[i] = binary_string.charCodeAt(i);
  }
  return array.buffer;
}
const native = typeof Uint8Array.fromBase64 === "function";
const buffer = typeof process === "object" && process.versions?.node !== void 0;
const encode64 = native ? encode_native : buffer ? encode_buffer : encode_legacy;
const decode64 = native ? decode_native : buffer ? decode_buffer : decode_legacy;
const UNDEFINED = -1;
const HOLE = -2;
const NAN = -3;
const POSITIVE_INFINITY = -4;
const NEGATIVE_INFINITY = -5;
const NEGATIVE_ZERO = -6;
const SPARSE = -7;
function parse(serialized, revivers) {
  return unflatten$1(JSON.parse(serialized), revivers);
}
function unflatten$1(parsed, revivers) {
  if (typeof parsed === "number") return hydrate(parsed, true);
  if (!Array.isArray(parsed) || parsed.length === 0) {
    throw new Error("Invalid input");
  }
  const values = (
    /** @type {any[]} */
    parsed
  );
  const hydrated = Array(values.length);
  let hydrating = null;
  function hydrate(index, standalone = false) {
    if (index === UNDEFINED) return void 0;
    if (index === NAN) return NaN;
    if (index === POSITIVE_INFINITY) return Infinity;
    if (index === NEGATIVE_INFINITY) return -Infinity;
    if (index === NEGATIVE_ZERO) return -0;
    if (standalone || typeof index !== "number") {
      throw new Error(`Invalid input`);
    }
    if (index in hydrated) return hydrated[index];
    const value = values[index];
    if (!value || typeof value !== "object") {
      hydrated[index] = value;
    } else if (Array.isArray(value)) {
      if (typeof value[0] === "string") {
        const type = value[0];
        const reviver = revivers && Object.hasOwn(revivers, type) ? revivers[type] : void 0;
        if (reviver) {
          let i = value[1];
          if (typeof i !== "number") {
            i = values.push(value[1]) - 1;
          }
          hydrating ??= /* @__PURE__ */ new Set();
          if (hydrating.has(i)) {
            throw new Error("Invalid circular reference");
          }
          hydrating.add(i);
          hydrated[index] = reviver(hydrate(i));
          hydrating.delete(i);
          return hydrated[index];
        }
        switch (type) {
          case "Date":
            hydrated[index] = new Date(value[1]);
            break;
          case "Set":
            const set = /* @__PURE__ */ new Set();
            hydrated[index] = set;
            for (let i = 1; i < value.length; i += 1) {
              set.add(hydrate(value[i]));
            }
            break;
          case "Map":
            const map = /* @__PURE__ */ new Map();
            hydrated[index] = map;
            for (let i = 1; i < value.length; i += 2) {
              map.set(hydrate(value[i]), hydrate(value[i + 1]));
            }
            break;
          case "RegExp":
            hydrated[index] = new RegExp(value[1], value[2]);
            break;
          case "Object": {
            const wrapped_index = value[1];
            if (typeof values[wrapped_index] === "object" && values[wrapped_index][0] !== "BigInt") {
              throw new Error("Invalid input");
            }
            hydrated[index] = Object(hydrate(wrapped_index));
            break;
          }
          case "BigInt":
            hydrated[index] = BigInt(value[1]);
            break;
          case "null":
            const obj = /* @__PURE__ */ Object.create(null);
            hydrated[index] = obj;
            for (let i = 1; i < value.length; i += 2) {
              if (value[i] === "__proto__") {
                throw new Error("Cannot parse an object with a `__proto__` property");
              }
              obj[value[i]] = hydrate(value[i + 1]);
            }
            break;
          case "Int8Array":
          case "Uint8Array":
          case "Uint8ClampedArray":
          case "Int16Array":
          case "Uint16Array":
          case "Float16Array":
          case "Int32Array":
          case "Uint32Array":
          case "Float32Array":
          case "Float64Array":
          case "BigInt64Array":
          case "BigUint64Array":
          case "DataView": {
            if (values[value[1]][0] !== "ArrayBuffer") {
              throw new Error("Invalid data");
            }
            const TypedArrayConstructor = globalThis[type];
            const buffer2 = hydrate(value[1]);
            hydrated[index] = value[2] !== void 0 ? new TypedArrayConstructor(buffer2, value[2], value[3]) : new TypedArrayConstructor(buffer2);
            break;
          }
          case "ArrayBuffer": {
            const base64 = value[1];
            if (typeof base64 !== "string") {
              throw new Error("Invalid ArrayBuffer encoding");
            }
            const arraybuffer = decode64(base64);
            hydrated[index] = arraybuffer;
            break;
          }
          case "Temporal.Duration":
          case "Temporal.Instant":
          case "Temporal.PlainDate":
          case "Temporal.PlainTime":
          case "Temporal.PlainDateTime":
          case "Temporal.PlainMonthDay":
          case "Temporal.PlainYearMonth":
          case "Temporal.ZonedDateTime": {
            const temporalName = type.slice(9);
            hydrated[index] = Temporal[temporalName].from(value[1]);
            break;
          }
          case "URL": {
            const url = new URL(value[1]);
            hydrated[index] = url;
            break;
          }
          case "URLSearchParams": {
            const url = new URLSearchParams(value[1]);
            hydrated[index] = url;
            break;
          }
          default:
            throw new Error(`Unknown type ${type}`);
        }
      } else if (value[0] === SPARSE) {
        const len = value[1];
        if (!Number.isInteger(len) || len < 0) {
          throw new Error("Invalid input");
        }
        const array = new Array(len);
        hydrated[index] = array;
        for (let i = 2; i < value.length; i += 2) {
          const idx = value[i];
          if (!Number.isInteger(idx) || idx < 0 || idx >= len) {
            throw new Error("Invalid input");
          }
          array[idx] = hydrate(value[i + 1]);
        }
      } else {
        const array = new Array(value.length);
        hydrated[index] = array;
        for (let i = 0; i < value.length; i += 1) {
          const n = value[i];
          if (n === HOLE) continue;
          array[i] = hydrate(n);
        }
      }
    } else {
      const object = {};
      hydrated[index] = object;
      for (const key of Object.keys(value)) {
        if (key === "__proto__") {
          throw new Error("Cannot parse an object with a `__proto__` property");
        }
        const n = value[key];
        object[key] = hydrate(n);
      }
    }
    return hydrated[index];
  }
  return hydrate(0);
}
function stringify$2(value, reducers) {
  const stringified = [];
  const indexes = /* @__PURE__ */ new Map();
  const custom = [];
  if (reducers) {
    for (const key of Object.getOwnPropertyNames(reducers)) {
      custom.push({ key, fn: reducers[key] });
    }
  }
  const keys = [];
  let p = 0;
  function flatten(thing) {
    if (thing === void 0) return UNDEFINED;
    if (Number.isNaN(thing)) return NAN;
    if (thing === Infinity) return POSITIVE_INFINITY;
    if (thing === -Infinity) return NEGATIVE_INFINITY;
    if (thing === 0 && 1 / thing < 0) return NEGATIVE_ZERO;
    if (indexes.has(thing)) return (
      /** @type {number} */
      indexes.get(thing)
    );
    const index2 = p++;
    indexes.set(thing, index2);
    for (const { key, fn } of custom) {
      const value2 = fn(thing);
      if (value2) {
        stringified[index2] = `["${key}",${flatten(value2)}]`;
        return index2;
      }
    }
    if (typeof thing === "function") {
      throw new DevalueError(`Cannot stringify a function`, keys, thing, value);
    } else if (typeof thing === "symbol") {
      throw new DevalueError(`Cannot stringify a Symbol primitive`, keys, thing, value);
    }
    let str = "";
    if (is_primitive(thing)) {
      str = stringify_primitive(thing);
    } else {
      const type = get_type(thing);
      switch (type) {
        case "Number":
        case "String":
        case "Boolean":
        case "BigInt":
          str = `["Object",${flatten(thing.valueOf())}]`;
          break;
        case "Date":
          const valid = !isNaN(thing.getDate());
          str = `["Date","${valid ? thing.toISOString() : ""}"]`;
          break;
        case "URL":
          str = `["URL",${stringify_string(thing.toString())}]`;
          break;
        case "URLSearchParams":
          str = `["URLSearchParams",${stringify_string(thing.toString())}]`;
          break;
        case "RegExp":
          const { source, flags } = thing;
          str = flags ? `["RegExp",${stringify_string(source)},"${flags}"]` : `["RegExp",${stringify_string(source)}]`;
          break;
        case "Array": {
          let mostly_dense = false;
          str = "[";
          for (let i = 0; i < thing.length; i += 1) {
            if (i > 0) str += ",";
            if (Object.hasOwn(thing, i)) {
              keys.push(`[${i}]`);
              str += flatten(thing[i]);
              keys.pop();
            } else if (mostly_dense) {
              str += HOLE;
            } else {
              const populated_keys = valid_array_indices(
                /** @type {any[]} */
                thing
              );
              const population = populated_keys.length;
              const d = String(thing.length).length;
              const hole_cost = (thing.length - population) * 3;
              const sparse_cost = 4 + d + population * (d + 1);
              if (hole_cost > sparse_cost) {
                str = "[" + SPARSE + "," + thing.length;
                for (let j = 0; j < populated_keys.length; j++) {
                  const key = populated_keys[j];
                  keys.push(`[${key}]`);
                  str += "," + key + "," + flatten(thing[key]);
                  keys.pop();
                }
                break;
              } else {
                mostly_dense = true;
                str += HOLE;
              }
            }
          }
          str += "]";
          break;
        }
        case "Set":
          str = '["Set"';
          for (const value2 of thing) {
            str += `,${flatten(value2)}`;
          }
          str += "]";
          break;
        case "Map":
          str = '["Map"';
          for (const [key, value2] of thing) {
            keys.push(`.get(${is_primitive(key) ? stringify_primitive(key) : "..."})`);
            str += `,${flatten(key)},${flatten(value2)}`;
            keys.pop();
          }
          str += "]";
          break;
        case "Int8Array":
        case "Uint8Array":
        case "Uint8ClampedArray":
        case "Int16Array":
        case "Uint16Array":
        case "Float16Array":
        case "Int32Array":
        case "Uint32Array":
        case "Float32Array":
        case "Float64Array":
        case "BigInt64Array":
        case "BigUint64Array":
        case "DataView": {
          const typedArray = thing;
          str = '["' + type + '",' + flatten(typedArray.buffer);
          if (typedArray.byteLength !== typedArray.buffer.byteLength) {
            str += `,${typedArray.byteOffset},${typedArray.length}`;
          }
          str += "]";
          break;
        }
        case "ArrayBuffer": {
          const arraybuffer = thing;
          const base64 = encode64(arraybuffer);
          str = `["ArrayBuffer","${base64}"]`;
          break;
        }
        case "Temporal.Duration":
        case "Temporal.Instant":
        case "Temporal.PlainDate":
        case "Temporal.PlainTime":
        case "Temporal.PlainDateTime":
        case "Temporal.PlainMonthDay":
        case "Temporal.PlainYearMonth":
        case "Temporal.ZonedDateTime":
          str = `["${type}",${stringify_string(thing.toString())}]`;
          break;
        default:
          if (!is_plain_object(thing)) {
            throw new DevalueError(`Cannot stringify arbitrary non-POJOs`, keys, thing, value);
          }
          if (enumerable_symbols(thing).length > 0) {
            throw new DevalueError(`Cannot stringify POJOs with symbolic keys`, keys, thing, value);
          }
          if (Object.getPrototypeOf(thing) === null) {
            str = '["null"';
            for (const key of Object.keys(thing)) {
              if (key === "__proto__") {
                throw new DevalueError(
                  `Cannot stringify objects with __proto__ keys`,
                  keys,
                  thing,
                  value
                );
              }
              keys.push(stringify_key(key));
              str += `,${stringify_string(key)},${flatten(thing[key])}`;
              keys.pop();
            }
            str += "]";
          } else {
            str = "{";
            let started = false;
            for (const key of Object.keys(thing)) {
              if (key === "__proto__") {
                throw new DevalueError(
                  `Cannot stringify objects with __proto__ keys`,
                  keys,
                  thing,
                  value
                );
              }
              if (started) str += ",";
              started = true;
              keys.push(stringify_key(key));
              str += `${stringify_string(key)}:${flatten(thing[key])}`;
              keys.pop();
            }
            str += "}";
          }
      }
    }
    stringified[index2] = str;
    return index2;
  }
  const index = flatten(value);
  if (index < 0) return `${index}`;
  return `[${stringified.join(",")}]`;
}
function stringify_primitive(thing) {
  const type = typeof thing;
  if (type === "string") return stringify_string(thing);
  if (thing === void 0) return UNDEFINED.toString();
  if (thing === 0 && 1 / thing < 0) return NEGATIVE_ZERO.toString();
  if (type === "bigint") return `["BigInt","${thing}"]`;
  return String(thing);
}
const ACTION_QUERY_PARAMS = {
  actionName: "_action"
};
const ACTION_RPC_ROUTE_PATTERN = "/_actions/[...path]";
const __vite_import_meta_env__$1 = { "ASSETS_PREFIX": void 0, "BASE_URL": "/", "DEV": true, "MODE": "production", "PROD": false, "SITE": "https://timorlist.com", "SSR": true };
const codeToStatusMap = {
  // Implemented from IANA HTTP Status Code Registry
  // https://www.iana.org/assignments/http-status-codes/http-status-codes.xhtml
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  PAYMENT_REQUIRED: 402,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  NOT_ACCEPTABLE: 406,
  PROXY_AUTHENTICATION_REQUIRED: 407,
  REQUEST_TIMEOUT: 408,
  CONFLICT: 409,
  GONE: 410,
  LENGTH_REQUIRED: 411,
  PRECONDITION_FAILED: 412,
  CONTENT_TOO_LARGE: 413,
  URI_TOO_LONG: 414,
  UNSUPPORTED_MEDIA_TYPE: 415,
  RANGE_NOT_SATISFIABLE: 416,
  EXPECTATION_FAILED: 417,
  MISDIRECTED_REQUEST: 421,
  UNPROCESSABLE_CONTENT: 422,
  LOCKED: 423,
  FAILED_DEPENDENCY: 424,
  TOO_EARLY: 425,
  UPGRADE_REQUIRED: 426,
  PRECONDITION_REQUIRED: 428,
  TOO_MANY_REQUESTS: 429,
  REQUEST_HEADER_FIELDS_TOO_LARGE: 431,
  UNAVAILABLE_FOR_LEGAL_REASONS: 451,
  INTERNAL_SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
  HTTP_VERSION_NOT_SUPPORTED: 505,
  VARIANT_ALSO_NEGOTIATES: 506,
  INSUFFICIENT_STORAGE: 507,
  LOOP_DETECTED: 508,
  NETWORK_AUTHENTICATION_REQUIRED: 511
};
const statusToCodeMap = Object.fromEntries(
  Object.entries(codeToStatusMap).map(([key, value]) => [value, key])
);
class ActionError extends Error {
  type = "AstroActionError";
  code = "INTERNAL_SERVER_ERROR";
  status = 500;
  constructor(params) {
    super(params.message);
    this.code = params.code;
    this.status = ActionError.codeToStatus(params.code);
    if (params.stack) {
      this.stack = params.stack;
    }
  }
  static codeToStatus(code) {
    return codeToStatusMap[code];
  }
  static statusToCode(status) {
    return statusToCodeMap[status] ?? "INTERNAL_SERVER_ERROR";
  }
  static fromJson(body) {
    if (isInputError(body)) {
      return new ActionInputError(body.issues);
    }
    if (isActionError(body)) {
      return new ActionError(body);
    }
    return new ActionError({
      code: "INTERNAL_SERVER_ERROR"
    });
  }
}
function isActionError(error2) {
  return typeof error2 === "object" && error2 != null && "type" in error2 && error2.type === "AstroActionError";
}
function isInputError(error2) {
  return typeof error2 === "object" && error2 != null && "type" in error2 && error2.type === "AstroActionInputError" && "issues" in error2 && Array.isArray(error2.issues);
}
class ActionInputError extends ActionError {
  type = "AstroActionInputError";
  // We don't expose all ZodError properties.
  // Not all properties will serialize from server to client,
  // and we don't want to import the full ZodError object into the client.
  issues;
  fields;
  constructor(issues) {
    super({
      message: `Failed to validate: ${JSON.stringify(issues, null, 2)}`,
      code: "BAD_REQUEST"
    });
    this.issues = issues;
    this.fields = {};
    for (const issue of issues) {
      if (issue.path.length > 0) {
        const key = issue.path[0].toString();
        this.fields[key] ??= [];
        this.fields[key]?.push(issue.message);
      }
    }
  }
}
function deserializeActionResult(res) {
  if (res.type === "error") {
    let json;
    try {
      json = JSON.parse(res.body);
    } catch {
      return {
        data: void 0,
        error: new ActionError({
          message: res.body,
          code: "INTERNAL_SERVER_ERROR"
        })
      };
    }
    if (Object.assign(__vite_import_meta_env__$1, { _: "/home/jasonwill/.nvm/versions/node/v24.14.1/bin/pnpm" })?.PROD) {
      return { error: ActionError.fromJson(json), data: void 0 };
    } else {
      const error2 = ActionError.fromJson(json);
      error2.stack = actionResultErrorStack.get();
      return {
        error: error2,
        data: void 0
      };
    }
  }
  if (res.type === "empty") {
    return { data: void 0, error: void 0 };
  }
  return {
    data: parse(res.body, {
      URL: (href) => new URL(href)
    }),
    error: void 0
  };
}
const actionResultErrorStack = /* @__PURE__ */ (function actionResultErrorStackFn() {
  let errorStack;
  return {
    set(stack) {
      errorStack = stack;
    },
    get() {
      return errorStack;
    }
  };
})();
function getActionQueryString(name) {
  const searchParams = new URLSearchParams({ [ACTION_QUERY_PARAMS.actionName]: name });
  return `?${searchParams.toString()}`;
}
async function readBodyWithLimit(request, limit) {
  const contentLengthHeader = request.headers.get("content-length");
  if (contentLengthHeader) {
    const contentLength = Number.parseInt(contentLengthHeader, 10);
    if (Number.isFinite(contentLength) && contentLength > limit) {
      throw new BodySizeLimitError(limit);
    }
  }
  if (!request.body) return new Uint8Array();
  const reader = request.body.getReader();
  const chunks = [];
  let received = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (value) {
      received += value.byteLength;
      if (received > limit) {
        throw new BodySizeLimitError(limit);
      }
      chunks.push(value);
    }
  }
  const buffer2 = new Uint8Array(received);
  let offset = 0;
  for (const chunk of chunks) {
    buffer2.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return buffer2;
}
class BodySizeLimitError extends Error {
  limit;
  constructor(limit) {
    super(`Request body exceeds the configured limit of ${limit} bytes`);
    this.name = "BodySizeLimitError";
    this.limit = limit;
  }
}
const __vite_import_meta_env__ = { "ASSETS_PREFIX": void 0, "BASE_URL": "/", "DEV": true, "MODE": "production", "PROD": false, "SITE": "https://timorlist.com", "SSR": true };
function getActionContext(context) {
  const callerInfo = getCallerInfo(context);
  const actionResultAlreadySet = Boolean(context.locals._actionPayload);
  let action = void 0;
  if (callerInfo && context.request.method === "POST" && !actionResultAlreadySet) {
    action = {
      calledFrom: callerInfo.from,
      name: callerInfo.name,
      handler: async () => {
        const pipeline = Reflect.get(context, pipelineSymbol);
        const callerInfoName = shouldAppendForwardSlash(
          pipeline.manifest.trailingSlash,
          pipeline.manifest.buildFormat
        ) ? removeTrailingForwardSlash(callerInfo.name) : callerInfo.name;
        let baseAction;
        try {
          baseAction = await pipeline.getAction(callerInfoName);
        } catch (error2) {
          if (error2 instanceof Error && "name" in error2 && typeof error2.name === "string" && error2.name === ActionNotFoundError.name) {
            return { data: void 0, error: new ActionError({ code: "NOT_FOUND" }) };
          }
          throw error2;
        }
        const bodySizeLimit = pipeline.manifest.actionBodySizeLimit;
        let input;
        try {
          input = await parseRequestBody(context.request, bodySizeLimit);
        } catch (e) {
          if (e instanceof ActionError) {
            return { data: void 0, error: e };
          }
          if (e instanceof TypeError) {
            return { data: void 0, error: new ActionError({ code: "UNSUPPORTED_MEDIA_TYPE" }) };
          }
          throw e;
        }
        const omitKeys = ["props", "getActionResult", "callAction", "redirect"];
        const actionAPIContext = Object.create(
          Object.getPrototypeOf(context),
          Object.fromEntries(
            Object.entries(Object.getOwnPropertyDescriptors(context)).filter(
              ([key]) => !omitKeys.includes(key)
            )
          )
        );
        Reflect.set(actionAPIContext, ACTION_API_CONTEXT_SYMBOL, true);
        const handler = baseAction.bind(actionAPIContext);
        return handler(input);
      }
    };
  }
  function setActionResult(actionName, actionResult) {
    context.locals._actionPayload = {
      actionResult,
      actionName
    };
  }
  return {
    action,
    setActionResult,
    serializeActionResult,
    deserializeActionResult
  };
}
function getCallerInfo(ctx) {
  if (ctx.routePattern === ACTION_RPC_ROUTE_PATTERN) {
    return { from: "rpc", name: ctx.url.pathname.replace(/^.*\/_actions\//, "") };
  }
  const queryParam = ctx.url.searchParams.get(ACTION_QUERY_PARAMS.actionName);
  if (queryParam) {
    return { from: "form", name: queryParam };
  }
  return void 0;
}
async function parseRequestBody(request, bodySizeLimit) {
  const contentType = request.headers.get("content-type");
  const contentLengthHeader = request.headers.get("content-length");
  const contentLength = contentLengthHeader ? Number.parseInt(contentLengthHeader, 10) : void 0;
  const hasContentLength = typeof contentLength === "number" && Number.isFinite(contentLength);
  if (!contentType) return void 0;
  if (hasContentLength && contentLength > bodySizeLimit) {
    throw new ActionError({
      code: "CONTENT_TOO_LARGE",
      message: `Request body exceeds ${bodySizeLimit} bytes`
    });
  }
  try {
    if (hasContentType(contentType, formContentTypes)) {
      if (!hasContentLength) {
        const body = await readBodyWithLimit(request.clone(), bodySizeLimit);
        const formRequest = new Request(request.url, {
          method: request.method,
          headers: request.headers,
          body: toArrayBuffer(body)
        });
        return await formRequest.formData();
      }
      return await request.clone().formData();
    }
    if (hasContentType(contentType, ["application/json"])) {
      if (contentLength === 0) return void 0;
      if (!hasContentLength) {
        const body = await readBodyWithLimit(request.clone(), bodySizeLimit);
        if (body.byteLength === 0) return void 0;
        return JSON.parse(new TextDecoder().decode(body));
      }
      return await request.clone().json();
    }
  } catch (e) {
    if (e instanceof BodySizeLimitError) {
      throw new ActionError({
        code: "CONTENT_TOO_LARGE",
        message: `Request body exceeds ${bodySizeLimit} bytes`
      });
    }
    throw e;
  }
  throw new TypeError("Unsupported content type");
}
const ACTION_API_CONTEXT_SYMBOL = /* @__PURE__ */ Symbol.for("astro.actionAPIContext");
const formContentTypes = ["application/x-www-form-urlencoded", "multipart/form-data"];
function hasContentType(contentType, expected) {
  const type = contentType.split(";")[0].toLowerCase();
  return expected.some((t) => type === t);
}
function serializeActionResult(res) {
  if (res.error) {
    if (Object.assign(__vite_import_meta_env__, { _: "/home/jasonwill/.nvm/versions/node/v24.14.1/bin/pnpm" })?.DEV) {
      actionResultErrorStack.set(res.error.stack);
    }
    let body2;
    if (res.error instanceof ActionInputError) {
      body2 = {
        type: res.error.type,
        issues: res.error.issues,
        fields: res.error.fields
      };
    } else {
      body2 = {
        ...res.error,
        message: res.error.message
      };
    }
    return {
      type: "error",
      status: res.error.status,
      contentType: "application/json",
      body: JSON.stringify(body2)
    };
  }
  if (res.data === void 0) {
    return {
      type: "empty",
      status: 204
    };
  }
  let body;
  try {
    body = stringify$2(res.data, {
      // Add support for URL objects
      URL: (value) => value instanceof URL && value.href
    });
  } catch (e) {
    let hint = ActionsReturnedInvalidDataError.hint;
    if (res.data instanceof Response) {
      hint = REDIRECT_STATUS_CODES.includes(res.data.status) ? "If you need to redirect when the action succeeds, trigger a redirect where the action is called. See the Actions guide for server and client redirect examples: https://docs.astro.build/en/guides/actions." : "If you need to return a Response object, try using a server endpoint instead. See https://docs.astro.build/en/guides/endpoints/#server-endpoints-api-routes";
    }
    throw new AstroError({
      ...ActionsReturnedInvalidDataError,
      message: ActionsReturnedInvalidDataError.message(String(e)),
      hint
    });
  }
  return {
    type: "data",
    status: 200,
    contentType: "application/json+devalue",
    body
  };
}
function toArrayBuffer(buffer2) {
  const copy = new Uint8Array(buffer2.byteLength);
  copy.set(buffer2);
  return copy.buffer;
}
var ImportType;
!(function(A) {
  A[A.Static = 1] = "Static", A[A.Dynamic = 2] = "Dynamic", A[A.ImportMeta = 3] = "ImportMeta", A[A.StaticSourcePhase = 4] = "StaticSourcePhase", A[A.DynamicSourcePhase = 5] = "DynamicSourcePhase", A[A.StaticDeferPhase = 6] = "StaticDeferPhase", A[A.DynamicDeferPhase = 7] = "DynamicDeferPhase";
})(ImportType || (ImportType = {}));
1 === new Uint8Array(new Uint16Array([1]).buffer)[0];
const E = () => {
  return A = "AGFzbQEAAAABKwhgAX8Bf2AEf39/fwBgAAF/YAAAYAF/AGADf39/AX9gAn9/AX9gA39/fwADODcAAQECAgICAgICAgICAgICAgICAgICAgICAwIAAwMDBAAEAAAABQAAAAAAAwMDAAAGAAcABgIFBAUBcAEBAQUDAQABBg8CfwFBsPIAC38AQbDyAAsHnQEbBm1lbW9yeQIAAnNhAAABZQADAmlzAAQCaWUABQJzcwAGAnNlAAcCaXQACAJhaQAJAmlkAAoCaXAACwJlcwAMAmVlAA0DZWxzAA4DZWxlAA8CcmkAEAJyZQARAWYAEgJtcwATAnJhABQDYWtzABUDYWtlABYDYXZzABcDYXZlABgDcnNhABkFcGFyc2UAGgtfX2hlYXBfYmFzZQMBCrxJN2gBAX9BACAANgL0CUEAKALQCSIBIABBAXRqIgBBADsBAEEAIABBAmoiADYC+AlBACAANgL8CUEAQQA2AtQJQQBBADYC5AlBAEEANgLcCUEAQQA2AtgJQQBBADYC7AlBAEEANgLgCSABC9MBAQN/QQAoAuQJIQRBAEEAKAL8CSIFNgLkCUEAIAQ2AugJQQAgBUEoajYC/AkgBEEkakHUCSAEGyAFNgIAQQAoAsgJIQRBACgCxAkhBiAFIAE2AgAgBSAANgIIIAUgAiACQQJqQQAgBiADRiIAGyAEIANGIgQbNgIMIAUgAzYCFCAFQQA2AhAgBSACNgIEIAVCADcCICAFQQNBAUECIAAbIAQbNgIcIAVBACgCxAkgA0YiAjoAGAJAAkAgAg0AQQAoAsgJIANHDQELQQBBAToAgAoLC14BAX9BACgC7AkiBEEQakHYCSAEG0EAKAL8CSIENgIAQQAgBDYC7AlBACAEQRRqNgL8CUEAQQE6AIAKIARBADYCECAEIAM2AgwgBCACNgIIIAQgATYCBCAEIAA2AgALCABBACgChAoLFQBBACgC3AkoAgBBACgC0AlrQQF1Cx4BAX9BACgC3AkoAgQiAEEAKALQCWtBAXVBfyAAGwsVAEEAKALcCSgCCEEAKALQCWtBAXULHgEBf0EAKALcCSgCDCIAQQAoAtAJa0EBdUF/IAAbCwsAQQAoAtwJKAIcCx4BAX9BACgC3AkoAhAiAEEAKALQCWtBAXVBfyAAGws7AQF/AkBBACgC3AkoAhQiAEEAKALECUcNAEF/DwsCQCAAQQAoAsgJRw0AQX4PCyAAQQAoAtAJa0EBdQsLAEEAKALcCS0AGAsVAEEAKALgCSgCAEEAKALQCWtBAXULFQBBACgC4AkoAgRBACgC0AlrQQF1Cx4BAX9BACgC4AkoAggiAEEAKALQCWtBAXVBfyAAGwseAQF/QQAoAuAJKAIMIgBBACgC0AlrQQF1QX8gABsLJQEBf0EAQQAoAtwJIgBBJGpB1AkgABsoAgAiADYC3AkgAEEARwslAQF/QQBBACgC4AkiAEEQakHYCSAAGygCACIANgLgCSAAQQBHCwgAQQAtAIgKCwgAQQAtAIAKCysBAX9BAEEAKAKMCiIAQRBqQQAoAtwJQSBqIAAbKAIAIgA2AowKIABBAEcLFQBBACgCjAooAgBBACgC0AlrQQF1CxUAQQAoAowKKAIEQQAoAtAJa0EBdQsVAEEAKAKMCigCCEEAKALQCWtBAXULFQBBACgCjAooAgxBACgC0AlrQQF1CwoAQQBBADYCjAoLuw8BBX8jAEGA0ABrIgAkAEEAQQE6AIgKQQBBACgCzAk2ApQKQQBBACgC0AlBfmoiATYCqApBACABQQAoAvQJQQF0aiICNgKsCkEAQQA6AIAKQQBBADsBkApBAEEAOwGSCkEAQQA6AJgKQQBBADYChApBAEEAOgDwCUEAIABBgBBqNgKcCkEAIAA2AqAKQQBBADoApAoCQAJAAkACQANAQQAgAUECaiIDNgKoCiABIAJPDQECQCADLwEAIgJBd2pBBUkNAAJAAkACQAJAAkAgAkGbf2oOBQEICAgCAAsgAkEgRg0EIAJBL0YNAyACQTtGDQIMBwtBAC8BkgoNASADEBtFDQEgAUEEakGCCEEKEDYNARAcQQAtAIgKDQFBAEEAKAKoCiIBNgKUCgwHCyADEBtFDQAgAUEEakGMCEEKEDYNABAdC0EAQQAoAqgKNgKUCgwBCwJAIAEvAQQiA0EqRg0AIANBL0cNBBAeDAELQQEQHwtBACgCrAohAkEAKAKoCiEBDAALC0EAIQIgAyEBQQAtAPAJDQIMAQtBACABNgKoCkEAQQA6AIgKCwNAQQAgAUECaiIDNgKoCgJAAkACQAJAAkACQAJAIAFBACgCrApPDQACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQCADLwEAIgJBYGoOEBMSCRISEhIIAQUSEgQSEgoACwJAAkACQAJAIAJBpX9qDg8FFQYVFQ4VFQMVARUVFQIACyACQXdqQQVJDRUgAkGFf2oOAwgUCRQLQQAvAZIKDRMgAxAbRQ0TIAFBBGpBgghBChA2DRMQHAwTCyADEBtFDRIgAUEEakGMCEEKEDYNEhAdDBILIAMQG0UNESABKQAEQuyAhIOwjsA5Ug0RIAEvAQwiA0F3aiIBQRdLDQ9BASABdEGfgIAEcUUNDwwQC0EAQQAvAZIKIgFBAWo7AZIKQQAoApwKIAFBA3RqIgFBATYCACABQQAoApQKNgIEDBALQQBBAC8BkgoiAUEBajsBkgpBACgCnAogAUEDdGoiAUEINgIAIAFBACgClAo2AgQMDwtBAC8BkgoiAUUNC0EAIAFBf2o7AZIKDA4LQQAvAZAKIgNFDQ1BAC8BkgoiAkUNDSACQQN0QQAoApwKakF4aigCAEEFRw0NIANBAnRBACgCoApqQXxqKAIAIgMoAgQNDUEAIAFBBGo2AqgKIANBACgClApBAmo2AgRBARAgGiADQQAoAqgKIgE2AhBBACABQX5qNgKoCgwNC0EALwGSCiIDRQ0JQQAgA0F/aiIDOwGSCkEALwGQCiICRQ0MQQAoApwKIANB//8DcUEDdGooAgBBBUcNDAJAIAJBAnRBACgCoApqQXxqKAIAIgMoAgQNACADQQAoApQKQQJqNgIEC0EAIAJBf2o7AZAKIAMgAUEEajYCDAwMCwJAQQAoApQKIgEvAQBBKUcNAEEAKALkCSIDRQ0AIAMoAgQgAUcNAEEAQQAoAugJIgM2AuQJAkAgA0UNACADQQA2AiQMAQtBAEEANgLUCQtBAEEALwGSCiIDQQFqOwGSCkEAKAKcCiADQQN0aiIDQQZBAkEALQCkChs2AgAgAyABNgIEQQBBADoApAoMCwtBAC8BkgoiAUUNB0EAIAFBf2oiATsBkgpBACgCnAogAUH//wNxQQN0aigCAEEERg0EDAoLQScQIQwJC0EiECEMCAsCQAJAIAEvAQQiAUEqRg0AIAFBL0cNARAeDAoLQQEQHwwJCwJAAkACQAJAQQAoApQKIgEvAQAiAxAiRQ0AAkACQCADQVVqDgQACQEDCQsgAUF+ai8BAEErRg0DDAgLIAFBfmovAQBBLUYNAgwHCyADQSlHDQFBACgCnApBAC8BkgoiAkEDdGooAgQQI0UNAgwGCyABQX5qLwEAQVBqQf//A3FBCk8NBQtBAC8BkgohAgsCQAJAIAJB//8DcSICRQ0AIANB5gBHDQBBACgCnAogAkF/akEDdGoiBCgCAEEBRw0AIAFBfmovAQBB7wBHDQEgAUF8ahAkRQ0BIAQoAgRBlghBAxAlRQ0BDAULIANB/QBHDQBBACgCnAogAkEDdGoiAigCBBAmDQQgAigCAEEGRg0ECyABECcNAyADRQ0DIANBL0ZBAC0AmApBAEdxDQMCQEEAKALsCSICRQ0AIAEgAigCAEkNACABIAIoAgRNDQQLIAFBfmohAUEAKALQCSECAkADQCABQQJqIgQgAk0NAUEAIAE2ApQKIAEvAQAhAyABQX5qIgQhASADEChFDQALIARBAmohBAsCQCADQf//A3EQKUUNACAEQX5qIQECQANAIAFBAmoiAyACTQ0BQQAgATYClAogAS8BACEDIAFBfmoiBCEBIAMQKQ0ACyAEQQJqIQMLIAMQKg0EC0EAQQE6AJgKDAcLQQAoApwKQQAvAZIKIgFBA3QiA2pBACgClAo2AgRBACABQQFqOwGSCkEAKAKcCiADakEDNgIACxArDAULQQAtAPAJQQAvAZAKQQAvAZIKcnJFIQIMBwsQLEEAQQA6AJgKDAMLEC1BACECDAULIANBoAFHDQELQQBBAToApAoLQQBBACgCqAo2ApQKC0EAKAKoCiEBDAALCyAAQYDQAGokACACCxoAAkBBACgC0AkgAEcNAEEBDwsgAEF+ahAuC/4KAQZ/QQBBACgCqAoiAEEMaiIBNgKoCkEAKALsCSECQQEQICEDAkACQAJAAkACQAJAAkACQAJAQQAoAqgKIgQgAUcNACADEC9FDQELAkACQAJAAkACQAJAAkAgA0EqRg0AIANB+wBHDQFBACAEQQJqNgKoCkEBECAhA0EAKAKoCiEEA0ACQAJAIANB//8DcSIDQSJGDQAgA0EnRg0AIAMQMxpBACgCqAohAwwBCyADECFBAEEAKAKoCkECaiIDNgKoCgtBARAgGgJAIAQgAxA0IgNBLEcNAEEAQQAoAqgKQQJqNgKoCkEBECAhAwsgA0H9AEYNA0EAKAKoCiIFIARGDQ8gBSEEIAVBACgCrApNDQAMDwsLQQAgBEECajYCqApBARAgGkEAKAKoCiIDIAMQNBoMAgtBAEEAOgCICgJAAkACQAJAAkACQCADQZ9/ag4MAgsEAQsDCwsLCwsFAAsgA0H2AEYNBAwKC0EAIARBDmoiAzYCqAoCQAJAAkBBARAgQZ9/ag4GABICEhIBEgtBACgCqAoiBSkAAkLzgOSD4I3AMVINESAFLwEKEClFDRFBACAFQQpqNgKoCkEAECAaC0EAKAKoCiIFQQJqQbIIQQ4QNg0QIAUvARAiAkF3aiIBQRdLDQ1BASABdEGfgIAEcUUNDQwOC0EAKAKoCiIFKQACQuyAhIOwjsA5Ug0PIAUvAQoiAkF3aiIBQRdNDQYMCgtBACAEQQpqNgKoCkEAECAaQQAoAqgKIQQLQQAgBEEQajYCqAoCQEEBECAiBEEqRw0AQQBBACgCqApBAmo2AqgKQQEQICEEC0EAKAKoCiEDIAQQMxogA0EAKAKoCiIEIAMgBBACQQBBACgCqApBfmo2AqgKDwsCQCAEKQACQuyAhIOwjsA5Ug0AIAQvAQoQKEUNAEEAIARBCmo2AqgKQQEQICEEQQAoAqgKIQMgBBAzGiADQQAoAqgKIgQgAyAEEAJBAEEAKAKoCkF+ajYCqAoPC0EAIARBBGoiBDYCqAoLQQAgBEEGajYCqApBAEEAOgCICkEBECAhBEEAKAKoCiEDIAQQMyEEQQAoAqgKIQIgBEHf/wNxIgFB2wBHDQNBACACQQJqNgKoCkEBECAhBUEAKAKoCiEDQQAhBAwEC0EAQQE6AIAKQQBBACgCqApBAmo2AqgKC0EBECAhBEEAKAKoCiEDAkAgBEHmAEcNACADQQJqQawIQQYQNg0AQQAgA0EIajYCqAogAEEBECBBABAyIAJBEGpB2AkgAhshAwNAIAMoAgAiA0UNBSADQgA3AgggA0EQaiEDDAALC0EAIANBfmo2AqgKDAMLQQEgAXRBn4CABHFFDQMMBAtBASEECwNAAkACQCAEDgIAAQELIAVB//8DcRAzGkEBIQQMAQsCQAJAQQAoAqgKIgQgA0YNACADIAQgAyAEEAJBARAgIQQCQCABQdsARw0AIARBIHJB/QBGDQQLQQAoAqgKIQMCQCAEQSxHDQBBACADQQJqNgKoCkEBECAhBUEAKAKoCiEDIAVBIHJB+wBHDQILQQAgA0F+ajYCqAoLIAFB2wBHDQJBACACQX5qNgKoCg8LQQAhBAwACwsPCyACQaABRg0AIAJB+wBHDQQLQQAgBUEKajYCqApBARAgIgVB+wBGDQMMAgsCQCACQVhqDgMBAwEACyACQaABRw0CC0EAIAVBEGo2AqgKAkBBARAgIgVBKkcNAEEAQQAoAqgKQQJqNgKoCkEBECAhBQsgBUEoRg0BC0EAKAKoCiEBIAUQMxpBACgCqAoiBSABTQ0AIAQgAyABIAUQAkEAQQAoAqgKQX5qNgKoCg8LIAQgA0EAQQAQAkEAIARBDGo2AqgKDwsQLQuFDAEKf0EAQQAoAqgKIgBBDGoiATYCqApBARAgIQJBACgCqAohAwJAAkACQAJAAkACQAJAAkAgAkEuRw0AQQAgA0ECajYCqAoCQEEBECAiAkHkAEYNAAJAIAJB8wBGDQAgAkHtAEcNB0EAKAKoCiICQQJqQZwIQQYQNg0HAkBBACgClAoiAxAxDQAgAy8BAEEuRg0ICyAAIAAgAkEIakEAKALICRABDwtBACgCqAoiAkECakGiCEEKEDYNBgJAQQAoApQKIgMQMQ0AIAMvAQBBLkYNBwtBACEEQQAgAkEMajYCqApBASEFQQUhBkEBECAhAkEAIQdBASEIDAILQQAoAqgKIgIpAAJC5YCYg9CMgDlSDQUCQEEAKAKUCiIDEDENACADLwEAQS5GDQYLQQAhBEEAIAJBCmo2AqgKQQIhCEEHIQZBASEHQQEQICECQQEhBQwBCwJAAkACQAJAIAJB8wBHDQAgAyABTQ0AIANBAmpBoghBChA2DQACQCADLwEMIgRBd2oiB0EXSw0AQQEgB3RBn4CABHENAgsgBEGgAUYNAQtBACEHQQchBkEBIQQgAkHkAEYNAQwCC0EAIQRBACADQQxqIgI2AqgKQQEhBUEBECAhCQJAQQAoAqgKIgYgAkYNAEHmACECAkAgCUHmAEYNAEEFIQZBACEHQQEhCCAJIQIMBAtBACEHQQEhCCAGQQJqQawIQQYQNg0EIAYvAQgQKEUNBAtBACEHQQAgAzYCqApBByEGQQEhBEEAIQVBACEIIAkhAgwCCyADIABBCmpNDQBBACEIQeQAIQICQCADKQACQuWAmIPQjIA5Ug0AAkACQCADLwEKIgRBd2oiB0EXSw0AQQEgB3RBn4CABHENAQtBACEIIARBoAFHDQELQQAhBUEAIANBCmo2AqgKQSohAkEBIQdBAiEIQQEQICIJQSpGDQRBACADNgKoCkEBIQRBACEHQQAhCCAJIQIMAgsgAyEGQQAhBwwCC0EAIQVBACEICwJAIAJBKEcNAEEAKAKcCkEALwGSCiICQQN0aiIDQQAoAqgKNgIEQQAgAkEBajsBkgogA0EFNgIAQQAoApQKLwEAQS5GDQRBAEEAKAKoCiIDQQJqNgKoCkEBECAhAiAAQQAoAqgKQQAgAxABAkACQCAFDQBBACgC5AkhAQwBC0EAKALkCSIBIAY2AhwLQQBBAC8BkAoiA0EBajsBkApBACgCoAogA0ECdGogATYCAAJAIAJBIkYNACACQSdGDQBBAEEAKAKoCkF+ajYCqAoPCyACECFBAEEAKAKoCkECaiICNgKoCgJAAkACQEEBECBBV2oOBAECAgACC0EAQQAoAqgKQQJqNgKoCkEBECAaQQAoAuQJIgMgAjYCBCADQQE6ABggA0EAKAKoCiICNgIQQQAgAkF+ajYCqAoPC0EAKALkCSIDIAI2AgQgA0EBOgAYQQBBAC8BkgpBf2o7AZIKIANBACgCqApBAmo2AgxBAEEALwGQCkF/ajsBkAoPC0EAQQAoAqgKQX5qNgKoCg8LAkAgBEEBcyACQfsAR3INAEEAKAKoCiECQQAvAZIKDQUDQAJAAkACQCACQQAoAqwKTw0AQQEQICICQSJGDQEgAkEnRg0BIAJB/QBHDQJBAEEAKAKoCkECajYCqAoLQQEQICEDQQAoAqgKIQICQCADQeYARw0AIAJBAmpBrAhBBhA2DQcLQQAgAkEIajYCqAoCQEEBECAiAkEiRg0AIAJBJ0cNBwsgACACQQAQMg8LIAIQIQtBAEEAKAKoCkECaiICNgKoCgwACwsCQAJAIAJBWWoOBAMBAQMACyACQSJGDQILQQAoAqgKIQYLIAYgAUcNAEEAIABBCmo2AqgKDwsgAkEqRyAHcQ0DQQAvAZIKQf//A3ENA0EAKAKoCiECQQAoAqwKIQEDQCACIAFPDQECQAJAIAIvAQAiA0EnRg0AIANBIkcNAQsgACADIAgQMg8LQQAgAkECaiICNgKoCgwACwsQLQsPC0EAIAJBfmo2AqgKDwtBAEEAKAKoCkF+ajYCqAoLRwEDf0EAKAKoCkECaiEAQQAoAqwKIQECQANAIAAiAkF+aiABTw0BIAJBAmohACACLwEAQXZqDgQBAAABAAsLQQAgAjYCqAoLmAEBA39BAEEAKAKoCiIBQQJqNgKoCiABQQZqIQFBACgCrAohAgNAAkACQAJAIAFBfGogAk8NACABQX5qLwEAIQMCQAJAIAANACADQSpGDQEgA0F2ag4EAgQEAgQLIANBKkcNAwsgAS8BAEEvRw0CQQAgAUF+ajYCqAoMAQsgAUF+aiEBC0EAIAE2AqgKDwsgAUECaiEBDAALC5wBAQN/QQAoAqgKIQECQANAAkACQCABLwEAIgJBL0cNAAJAIAEvAQIiAUEqRg0AIAFBL0cNBBAeDAILIAAQHwwBCwJAAkAgAEUNACACQXdqIgFBF0sNAUEBIAF0QZ+AgARxRQ0BDAILIAIQKUUNAwwBCyACQaABRw0CC0EAQQAoAqgKIgNBAmoiATYCqAogA0EAKAKsCkkNAAsLIAILiAEBBH9BACgCqAohAUEAKAKsCiECAkACQANAIAEiA0ECaiEBIAMgAk8NASABLwEAIgQgAEYNAgJAIARB3ABGDQAgBEF2ag4EAgEBAgELIANBBGohASADLwEEQQ1HDQAgA0EGaiABIAMvAQZBCkYbIQEMAAsLQQAgATYCqAoQLQ8LQQAgATYCqAoLbAEBfwJAAkAgAEFfaiIBQQVLDQBBASABdEExcQ0BCyAAQUZqQf//A3FBBkkNACAAQSlHIABBWGpB//8DcUEHSXENAAJAIABBpX9qDgQBAAABAAsgAEH9AEcgAEGFf2pB//8DcUEESXEPC0EBCy4BAX9BASEBAkAgAEGcCUEFECUNACAAQZYIQQMQJQ0AIABBpglBAhAlIQELIAELygEBAn8CQAJAIAAvAQAiAUF3akEFSQ0AIAFBIEYNACABQSlGDQAgAUHdAEYNACABQaABRg0AQQAhAiABQf0ARw0BC0EAKALQCSECAkACQANAIAAvAQAhASAAIAJNDQECQCABQXdqQQVJDQAgAUEgRg0AIAFBoAFGDQACQCABQSlGDQAgAUHdAEYNACABQf0ARw0EC0EBDwsgAEF+aiEADAALC0EBIQIgAUEpRg0BIAFB3QBGDQEgAUH9AEYNAQsgARAvQQFzIQILIAILRgEDf0EAIQMCQCAAIAJBAXQiAmsiBEECaiIAQQAoAtAJIgVJDQAgACABIAIQNg0AAkAgACAFRw0AQQEPCyAEEC4hAwsgAwuDAQECf0EBIQECQAJAAkACQAJAAkAgAC8BACICQUVqDgQFBAQBAAsCQCACQZt/ag4EAwQEAgALIAJBKUYNBCACQfkARw0DIABBfmpBsglBBhAlDwsgAEF+ai8BAEE9Rg8LIABBfmpBqglBBBAlDwsgAEF+akG+CUEDECUPC0EAIQELIAELtAMBAn9BACEBAkACQAJAAkACQAJAAkACQAJAAkAgAC8BAEGcf2oOFAABAgkJCQkDCQkEBQkJBgkHCQkICQsCQAJAIABBfmovAQBBl39qDgQACgoBCgsgAEF8akHACEECECUPCyAAQXxqQcQIQQMQJQ8LAkACQAJAIABBfmovAQBBjX9qDgMAAQIKCwJAIABBfGovAQAiAkHhAEYNACACQewARw0KIABBempB5QAQMA8LIABBempB4wAQMA8LIABBfGpByghBBBAlDwsgAEF8akHSCEEGECUPCyAAQX5qLwEAQe8ARw0GIABBfGovAQBB5QBHDQYCQCAAQXpqLwEAIgJB8ABGDQAgAkHjAEcNByAAQXhqQd4IQQYQJQ8LIABBeGpB6ghBAhAlDwsgAEF+akHuCEEEECUPC0EBIQEgAEF+aiIAQekAEDANBCAAQfYIQQUQJQ8LIABBfmpB5AAQMA8LIABBfmpBgAlBBxAlDwsgAEF+akGOCUEEECUPCwJAIABBfmovAQAiAkHvAEYNACACQeUARw0BIABBfGpB7gAQMA8LIABBfGpBlglBAxAlIQELIAELNAEBf0EBIQECQCAAQXdqQf//A3FBBUkNACAAQYABckGgAUYNACAAQS5HIAAQL3EhAQsgAQswAQF/AkACQCAAQXdqIgFBF0sNAEEBIAF0QY2AgARxDQELIABBoAFGDQBBAA8LQQELTgECf0EAIQECQAJAIAAvAQAiAkHlAEYNACACQesARw0BIABBfmpB7ghBBBAlDwsgAEF+ai8BAEH1AEcNACAAQXxqQdIIQQYQJSEBCyABC94BAQR/QQAoAqgKIQBBACgCrAohAQJAAkACQANAIAAiAkECaiEAIAIgAU8NAQJAAkACQCAALwEAIgNBpH9qDgUCAwMDAQALIANBJEcNAiACLwEEQfsARw0CQQAgAkEEaiIANgKoCkEAQQAvAZIKIgJBAWo7AZIKQQAoApwKIAJBA3RqIgJBBDYCACACIAA2AgQPC0EAIAA2AqgKQQBBAC8BkgpBf2oiADsBkgpBACgCnAogAEH//wNxQQN0aigCAEEDRw0DDAQLIAJBBGohAAwACwtBACAANgKoCgsQLQsLcAECfwJAAkADQEEAQQAoAqgKIgBBAmoiATYCqAogAEEAKAKsCk8NAQJAAkACQCABLwEAIgFBpX9qDgIBAgALAkAgAUF2ag4EBAMDBAALIAFBL0cNAgwECxA1GgwBC0EAIABBBGo2AqgKDAALCxAtCws1AQF/QQBBAToA8AlBACgCqAohAEEAQQAoAqwKQQJqNgKoCkEAIABBACgC0AlrQQF1NgKECgtDAQJ/QQEhAQJAIAAvAQAiAkF3akH//wNxQQVJDQAgAkGAAXJBoAFGDQBBACEBIAIQL0UNACACQS5HIAAQMXIPCyABC2gBAn9BASEBAkACQCAAQV9qIgJBBUsNAEEBIAJ0QTFxDQELIABB+P8DcUEoRg0AIABBRmpB//8DcUEGSQ0AAkAgAEGlf2oiAkEDSw0AIAJBAUcNAQsgAEGFf2pB//8DcUEESSEBCyABCz0BAn9BACECAkBBACgC0AkiAyAASw0AIAAvAQAgAUcNAAJAIAMgAEcNAEEBDwsgAEF+ai8BABAoIQILIAILMQEBf0EAIQECQCAALwEAQS5HDQAgAEF+ai8BAEEuRw0AIABBfGovAQBBLkYhAQsgAQvbBAEFfwJAIAFBIkYNACABQSdGDQAQLQ8LQQAoAqgKIQMgARAhIAAgA0ECakEAKAKoCkEAKALECRABAkAgAkEBSA0AQQAoAuQJQQRBBiACQQFGGzYCHAtBAEEAKAKoCkECajYCqApBABAgIQJBACgCqAohAQJAAkAgAkH3AEcNACABLwECQekARw0AIAEvAQRB9ABHDQAgAS8BBkHoAEYNAQtBACABQX5qNgKoCg8LQQAgAUEIajYCqAoCQEEBECBB+wBGDQBBACABNgKoCg8LQQAoAqgKIgQhA0EAIQADQEEAIANBAmo2AqgKAkACQAJAAkBBARAgIgJBJ0cNAEEAKAKoCiEFQScQIUEAKAKoCkECaiEDDAELQQAoAqgKIQUgAkEiRw0BQSIQIUEAKAKoCkECaiEDC0EAIAM2AqgKQQEQICECDAELIAIQMyECQQAoAqgKIQMLAkAgAkE6Rg0AQQAgATYCqAoPC0EAQQAoAqgKQQJqNgKoCgJAQQEQICICQSJGDQAgAkEnRg0AQQAgATYCqAoPC0EAKAKoCiEGIAIQIUEAQQAoAvwJIgJBFGo2AvwJQQAoAqgKIQcgAiAFNgIAIAJBADYCECACIAY2AgggAiADNgIEIAIgB0ECajYCDEEAQQAoAqgKQQJqNgKoCiAAQRBqQQAoAuQJQSBqIAAbIAI2AgACQAJAQQEQICIAQSxGDQAgAEH9AEYNAUEAIAE2AqgKDwtBAEEAKAKoCkECaiIDNgKoCiACIQAMAQsLQQAoAuQJIgEgBDYCECABQQAoAqgKQQJqNgIMC20BAn8CQAJAA0ACQCAAQf//A3EiAUF3aiICQRdLDQBBASACdEGfgIAEcQ0CCyABQaABRg0BIAAhAiABEC8NAkEAIQJBAEEAKAKoCiIAQQJqNgKoCiAALwECIgANAAwCCwsgACECCyACQf//A3ELqwEBBH8CQAJAQQAoAqgKIgIvAQAiA0HhAEYNACABIQQgACEFDAELQQAgAkEEajYCqApBARAgIQJBACgCqAohBQJAAkAgAkEiRg0AIAJBJ0YNACACEDMaQQAoAqgKIQQMAQsgAhAhQQBBACgCqApBAmoiBDYCqAoLQQEQICEDQQAoAqgKIQILAkAgAiAFRg0AIAUgBEEAIAAgACABRiICG0EAIAEgAhsQAgsgAwtyAQR/QQAoAqgKIQBBACgCrAohAQJAAkADQCAAQQJqIQIgACABTw0BAkACQCACLwEAIgNBpH9qDgIBBAALIAIhACADQXZqDgQCAQECAQsgAEEEaiEADAALC0EAIAI2AqgKEC1BAA8LQQAgAjYCqApB3QALSQEDf0EAIQMCQCACRQ0AAkADQCAALQAAIgQgAS0AACIFRw0BIAFBAWohASAAQQFqIQAgAkF/aiICDQAMAgsLIAQgBWshAwsgAwsL4gECAEGACAvEAQAAeABwAG8AcgB0AG0AcABvAHIAdABmAG8AcgBlAHQAYQBvAHUAcgBjAGUAcgBvAG0AdQBuAGMAdABpAG8AbgB2AG8AeQBpAGUAZABlAGwAZQBjAG8AbgB0AGkAbgBpAG4AcwB0AGEAbgB0AHkAYgByAGUAYQByAGUAdAB1AHIAZABlAGIAdQBnAGcAZQBhAHcAYQBpAHQAaAByAHcAaABpAGwAZQBpAGYAYwBhAHQAYwBmAGkAbgBhAGwAbABlAGwAcwAAQcQJCxABAAAAAgAAAAAEAAAwOQAA", "undefined" != typeof Buffer ? Buffer.from(A, "base64") : Uint8Array.from(atob(A), ((A2) => A2.charCodeAt(0)));
  var A;
};
WebAssembly.compile(E()).then(WebAssembly.instantiate).then((({ exports: A }) => {
}));
function hasActionPayload(locals) {
  return "_actionPayload" in locals;
}
function createGetActionResult(locals) {
  return (actionFn) => {
    if (!hasActionPayload(locals) || actionFn.toString() !== getActionQueryString(locals._actionPayload.actionName)) {
      return void 0;
    }
    return deserializeActionResult(locals._actionPayload.actionResult);
  };
}
function createCallAction(context) {
  return (baseAction, input) => {
    Reflect.set(context, ACTION_API_CONTEXT_SYMBOL, true);
    const action = baseAction.bind(context);
    return action(input);
  };
}
function parseLocale(header) {
  if (header === "*") {
    return [{ locale: header, qualityValue: void 0 }];
  }
  const result = [];
  const localeValues = header.split(",").map((str) => str.trim());
  for (const localeValue of localeValues) {
    const split = localeValue.split(";").map((str) => str.trim());
    const localeName = split[0];
    const qualityValue = split[1];
    if (!split) {
      continue;
    }
    if (qualityValue && qualityValue.startsWith("q=")) {
      const qualityValueAsFloat = Number.parseFloat(qualityValue.slice("q=".length));
      if (Number.isNaN(qualityValueAsFloat) || qualityValueAsFloat > 1) {
        result.push({
          locale: localeName,
          qualityValue: void 0
        });
      } else {
        result.push({
          locale: localeName,
          qualityValue: qualityValueAsFloat
        });
      }
    } else {
      result.push({
        locale: localeName,
        qualityValue: void 0
      });
    }
  }
  return result;
}
function sortAndFilterLocales(browserLocaleList, locales) {
  const normalizedLocales = getAllCodes(locales).map(normalizeTheLocale);
  return browserLocaleList.filter((browserLocale) => {
    if (browserLocale.locale !== "*") {
      return normalizedLocales.includes(normalizeTheLocale(browserLocale.locale));
    }
    return true;
  }).sort((a, b) => {
    if (a.qualityValue && b.qualityValue) {
      return Math.sign(b.qualityValue - a.qualityValue);
    }
    return 0;
  });
}
function computePreferredLocale(request, locales) {
  const acceptHeader = request.headers.get("Accept-Language");
  let result = void 0;
  if (acceptHeader) {
    const browserLocaleList = sortAndFilterLocales(parseLocale(acceptHeader), locales);
    const firstResult = browserLocaleList.at(0);
    if (firstResult && firstResult.locale !== "*") {
      for (const currentLocale of locales) {
        if (typeof currentLocale === "string") {
          if (normalizeTheLocale(currentLocale) === normalizeTheLocale(firstResult.locale)) {
            result = currentLocale;
            break;
          }
        } else {
          for (const currentCode of currentLocale.codes) {
            if (normalizeTheLocale(currentCode) === normalizeTheLocale(firstResult.locale)) {
              result = currentCode;
              break;
            }
          }
        }
      }
    }
  }
  return result;
}
function computePreferredLocaleList(request, locales) {
  const acceptHeader = request.headers.get("Accept-Language");
  let result = [];
  if (acceptHeader) {
    const browserLocaleList = sortAndFilterLocales(parseLocale(acceptHeader), locales);
    if (browserLocaleList.length === 1 && browserLocaleList.at(0).locale === "*") {
      return getAllCodes(locales);
    } else if (browserLocaleList.length > 0) {
      for (const browserLocale of browserLocaleList) {
        for (const loopLocale of locales) {
          if (typeof loopLocale === "string") {
            if (normalizeTheLocale(loopLocale) === normalizeTheLocale(browserLocale.locale)) {
              result.push(loopLocale);
            }
          } else {
            for (const code of loopLocale.codes) {
              if (code === browserLocale.locale) {
                result.push(code);
              }
            }
          }
        }
      }
    }
  }
  return result;
}
function computeCurrentLocale(pathname, locales, defaultLocale) {
  for (const segment of pathname.split("/").map(normalizeThePath)) {
    for (const locale of locales) {
      if (typeof locale === "string") {
        if (!segment.includes(locale)) continue;
        if (normalizeTheLocale(locale) === normalizeTheLocale(segment)) {
          return locale;
        }
      } else {
        if (locale.path === segment) {
          return locale.codes.at(0);
        } else {
          for (const code of locale.codes) {
            if (normalizeTheLocale(code) === normalizeTheLocale(segment)) {
              return code;
            }
          }
        }
      }
    }
  }
  for (const locale of locales) {
    if (typeof locale === "string") {
      if (locale === defaultLocale) {
        return locale;
      }
    } else {
      if (locale.path === defaultLocale) {
        return locale.codes.at(0);
      }
    }
  }
}
function computeCurrentLocaleFromParams(params, locales) {
  const byNormalizedCode = /* @__PURE__ */ new Map();
  const byPath = /* @__PURE__ */ new Map();
  for (const locale of locales) {
    if (typeof locale === "string") {
      byNormalizedCode.set(normalizeTheLocale(locale), locale);
    } else {
      byPath.set(locale.path, locale.codes[0]);
      for (const code of locale.codes) {
        byNormalizedCode.set(normalizeTheLocale(code), code);
      }
    }
  }
  for (const value of Object.values(params)) {
    if (!value) continue;
    const pathMatch = byPath.get(value);
    if (pathMatch) return pathMatch;
    const codeMatch = byNormalizedCode.get(normalizeTheLocale(value));
    if (codeMatch) return codeMatch;
  }
}
async function renderEndpoint(mod, context, isPrerendered, logger) {
  const { request, url } = context;
  const method = request.method.toUpperCase();
  let handler = mod[method] ?? mod["ALL"];
  if (!handler && method === "HEAD" && mod["GET"]) {
    handler = mod["GET"];
  }
  if (isPrerendered && !["GET", "HEAD"].includes(method)) {
    logger.warn(
      "router",
      `${url.pathname} ${s.bold(
        method
      )} requests are not available in static endpoints. Mark this page as server-rendered (\`export const prerender = false;\`) or update your config to \`output: 'server'\` to make all your pages server-rendered by default.`
    );
  }
  if (handler === void 0) {
    logger.warn(
      "router",
      `No API Route handler exists for the method "${method}" for the route "${url.pathname}".
Found handlers: ${Object.keys(mod).map((exp) => JSON.stringify(exp)).join(", ")}
` + ("all" in mod ? `One of the exported handlers is "all" (lowercase), did you mean to export 'ALL'?
` : "")
    );
    return new Response(null, { status: 404 });
  }
  if (typeof handler !== "function") {
    logger.error(
      "router",
      `The route "${url.pathname}" exports a value for the method "${method}", but it is of the type ${typeof handler} instead of a function.`
    );
    return new Response(null, { status: 500 });
  }
  let response = await handler.call(mod, context);
  if (!response || response instanceof Response === false) {
    throw new AstroError(EndpointDidNotReturnAResponse);
  }
  if (REROUTABLE_STATUS_CODES.includes(response.status)) {
    try {
      response.headers.set(REROUTE_DIRECTIVE_HEADER, "no");
    } catch (err) {
      if (err.message?.includes("immutable")) {
        response = new Response(response.body, response);
        response.headers.set(REROUTE_DIRECTIVE_HEADER, "no");
      } else {
        throw err;
      }
    }
  }
  if (method === "HEAD") {
    return new Response(null, response);
  }
  return response;
}
const AstroJSX = "astro:jsx";
function isVNode(vnode) {
  return vnode && typeof vnode === "object" && vnode[AstroJSX];
}
function isAstroComponentFactory(obj) {
  return obj == null ? false : obj.isAstroComponentFactory === true;
}
function isAPropagatingComponent(result, factory) {
  return isPropagatingHint(getPropagationHint(result, factory));
}
function getPropagationHint(result, factory) {
  return getPropagationHint$1(result, factory);
}
const PROP_TYPE = {
  Value: 0,
  JSON: 1,
  // Actually means Array
  RegExp: 2,
  Date: 3,
  Map: 4,
  Set: 5,
  BigInt: 6,
  URL: 7,
  Uint8Array: 8,
  Uint16Array: 9,
  Uint32Array: 10,
  Infinity: 11
};
function serializeArray(value, metadata = {}, parents = /* @__PURE__ */ new WeakSet()) {
  if (parents.has(value)) {
    throw new Error(`Cyclic reference detected while serializing props for <${metadata.displayName} client:${metadata.hydrate}>!

Cyclic references cannot be safely serialized for client-side usage. Please remove the cyclic reference.`);
  }
  parents.add(value);
  const serialized = value.map((v) => {
    return convertToSerializedForm(v, metadata, parents);
  });
  parents.delete(value);
  return serialized;
}
function serializeObject(value, metadata = {}, parents = /* @__PURE__ */ new WeakSet()) {
  if (parents.has(value)) {
    throw new Error(`Cyclic reference detected while serializing props for <${metadata.displayName} client:${metadata.hydrate}>!

Cyclic references cannot be safely serialized for client-side usage. Please remove the cyclic reference.`);
  }
  parents.add(value);
  const serialized = Object.fromEntries(
    Object.entries(value).map(([k, v]) => {
      return [k, convertToSerializedForm(v, metadata, parents)];
    })
  );
  parents.delete(value);
  return serialized;
}
function convertToSerializedForm(value, metadata = {}, parents = /* @__PURE__ */ new WeakSet()) {
  const tag = Object.prototype.toString.call(value);
  switch (tag) {
    case "[object Date]": {
      return [PROP_TYPE.Date, value.toISOString()];
    }
    case "[object RegExp]": {
      return [PROP_TYPE.RegExp, value.source];
    }
    case "[object Map]": {
      return [PROP_TYPE.Map, serializeArray(Array.from(value), metadata, parents)];
    }
    case "[object Set]": {
      return [PROP_TYPE.Set, serializeArray(Array.from(value), metadata, parents)];
    }
    case "[object BigInt]": {
      return [PROP_TYPE.BigInt, value.toString()];
    }
    case "[object URL]": {
      return [PROP_TYPE.URL, value.toString()];
    }
    case "[object Array]": {
      return [PROP_TYPE.JSON, serializeArray(value, metadata, parents)];
    }
    case "[object Uint8Array]": {
      return [PROP_TYPE.Uint8Array, Array.from(value)];
    }
    case "[object Uint16Array]": {
      return [PROP_TYPE.Uint16Array, Array.from(value)];
    }
    case "[object Uint32Array]": {
      return [PROP_TYPE.Uint32Array, Array.from(value)];
    }
    default: {
      if (value !== null && typeof value === "object") {
        return [PROP_TYPE.Value, serializeObject(value, metadata, parents)];
      }
      if (value === Number.POSITIVE_INFINITY) {
        return [PROP_TYPE.Infinity, 1];
      }
      if (value === Number.NEGATIVE_INFINITY) {
        return [PROP_TYPE.Infinity, -1];
      }
      if (value === void 0) {
        return [PROP_TYPE.Value];
      }
      return [PROP_TYPE.Value, value];
    }
  }
}
function serializeProps(props, metadata) {
  const serialized = JSON.stringify(serializeObject(props, metadata));
  return serialized;
}
const transitionDirectivesToCopyOnIsland = Object.freeze([
  "data-astro-transition-scope",
  "data-astro-transition-persist",
  "data-astro-transition-persist-props"
]);
function extractDirectives(inputProps, clientDirectives) {
  let extracted = {
    isPage: false,
    hydration: null,
    props: {},
    propsWithoutTransitionAttributes: {}
  };
  for (const [key, value] of Object.entries(inputProps)) {
    if (key.startsWith("server:")) {
      if (key === "server:root") {
        extracted.isPage = true;
      }
    }
    if (key.startsWith("client:")) {
      if (!extracted.hydration) {
        extracted.hydration = {
          directive: "",
          value: "",
          componentUrl: "",
          componentExport: { value: "" }
        };
      }
      switch (key) {
        case "client:component-path": {
          extracted.hydration.componentUrl = value;
          break;
        }
        case "client:component-export": {
          extracted.hydration.componentExport.value = value;
          break;
        }
        // This is a special prop added to prove that the client hydration method
        // was added statically.
        case "client:component-hydration": {
          break;
        }
        case "client:display-name": {
          break;
        }
        default: {
          extracted.hydration.directive = key.split(":")[1];
          extracted.hydration.value = value;
          if (!clientDirectives.has(extracted.hydration.directive)) {
            const hydrationMethods = Array.from(clientDirectives.keys()).map((d) => `client:${d}`).join(", ");
            throw new Error(
              `Error: invalid hydration directive "${key}". Supported hydration methods: ${hydrationMethods}`
            );
          }
          if (extracted.hydration.directive === "media" && typeof extracted.hydration.value !== "string") {
            throw new AstroError(MissingMediaQueryDirective);
          }
          break;
        }
      }
    } else {
      extracted.props[key] = value;
      if (!transitionDirectivesToCopyOnIsland.includes(key)) {
        extracted.propsWithoutTransitionAttributes[key] = value;
      }
    }
  }
  for (const sym of Object.getOwnPropertySymbols(inputProps)) {
    extracted.props[sym] = inputProps[sym];
    extracted.propsWithoutTransitionAttributes[sym] = inputProps[sym];
  }
  return extracted;
}
async function generateHydrateScript(scriptOptions, metadata) {
  const { renderer, result, astroId, props, attrs } = scriptOptions;
  const { hydrate, componentUrl, componentExport } = metadata;
  if (!componentExport.value) {
    throw new AstroError({
      ...NoMatchingImport,
      message: NoMatchingImport.message(metadata.displayName)
    });
  }
  const island = {
    children: "",
    props: {
      // This is for HMR, probably can avoid it in prod
      uid: astroId
    }
  };
  if (attrs) {
    for (const [key, value] of Object.entries(attrs)) {
      island.props[key] = escapeHTML(value);
    }
  }
  island.props["component-url"] = await result.resolve(decodeURI(componentUrl));
  if (renderer.clientEntrypoint) {
    island.props["component-export"] = componentExport.value;
    island.props["renderer-url"] = await result.resolve(
      decodeURI(renderer.clientEntrypoint.toString())
    );
    island.props["props"] = escapeHTML(serializeProps(props, metadata));
  }
  island.props["ssr"] = "";
  island.props["client"] = hydrate;
  let beforeHydrationUrl = await result.resolve("astro:scripts/before-hydration.js");
  if (beforeHydrationUrl.length) {
    island.props["before-hydration-url"] = beforeHydrationUrl;
  }
  island.props["opts"] = escapeHTML(
    JSON.stringify({
      name: metadata.displayName,
      value: metadata.hydrateArgs || ""
    })
  );
  transitionDirectivesToCopyOnIsland.forEach((name) => {
    if (typeof props[name] !== "undefined") {
      island.props[name] = props[name];
    }
  });
  return island;
}
const dictionary = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXY";
const binary = dictionary.length;
function bitwise(str) {
  let hash = 0;
  if (str.length === 0) return hash;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    hash = (hash << 5) - hash + ch;
    hash = hash & hash;
  }
  return hash;
}
function shorthash(text) {
  let num;
  let result = "";
  let integer = bitwise(text);
  const sign = integer < 0 ? "Z" : "";
  integer = Math.abs(integer);
  while (integer >= binary) {
    num = integer % binary;
    integer = Math.floor(integer / binary);
    result = dictionary[num] + result;
  }
  if (integer > 0) {
    result = dictionary[integer] + result;
  }
  return sign + result;
}
const DOCTYPE_EXP = /<!doctype html/i;
async function renderToString(result, componentFactory, props, children, isPage = false, route) {
  const templateResult = await callComponentAsTemplateResultOrResponse(
    result,
    componentFactory,
    props,
    children,
    route
  );
  if (templateResult instanceof Response) return templateResult;
  let str = "";
  let renderedFirstPageChunk = false;
  if (isPage) {
    await bufferHeadContent(result);
  }
  const destination = {
    write(chunk) {
      if (isPage && !renderedFirstPageChunk) {
        renderedFirstPageChunk = true;
        if (!result.partial && !DOCTYPE_EXP.test(String(chunk))) {
          const doctype = result.compressHTML ? "<!DOCTYPE html>" : "<!DOCTYPE html>\n";
          str += doctype;
        }
      }
      if (chunk instanceof Response) return;
      str += chunkToString(result, chunk);
    }
  };
  await templateResult.render(destination);
  return str;
}
async function renderToReadableStream(result, componentFactory, props, children, isPage = false, route) {
  const templateResult = await callComponentAsTemplateResultOrResponse(
    result,
    componentFactory,
    props,
    children,
    route
  );
  if (templateResult instanceof Response) return templateResult;
  let renderedFirstPageChunk = false;
  if (isPage) {
    await bufferHeadContent(result);
  }
  return new ReadableStream({
    start(controller) {
      const destination = {
        write(chunk) {
          if (isPage && !renderedFirstPageChunk) {
            renderedFirstPageChunk = true;
            if (!result.partial && !DOCTYPE_EXP.test(String(chunk))) {
              const doctype = result.compressHTML ? "<!DOCTYPE html>" : "<!DOCTYPE html>\n";
              controller.enqueue(encoder.encode(doctype));
            }
          }
          if (chunk instanceof Response) {
            throw new AstroError({
              ...ResponseSentError
            });
          }
          const bytes = chunkToByteArray(result, chunk);
          controller.enqueue(bytes);
        }
      };
      (async () => {
        try {
          await templateResult.render(destination);
          controller.close();
        } catch (e) {
          if (AstroError.is(e) && !e.loc) {
            e.setLocation({
              file: route?.component
            });
          }
          setTimeout(() => controller.error(e), 0);
        }
      })();
    },
    cancel() {
      result.cancelled = true;
    }
  });
}
async function callComponentAsTemplateResultOrResponse(result, componentFactory, props, children, route) {
  const factoryResult = await componentFactory(result, props, children);
  if (factoryResult instanceof Response) {
    return factoryResult;
  } else if (isHeadAndContent(factoryResult)) {
    if (!isRenderTemplateResult(factoryResult.content)) {
      throw new AstroError({
        ...OnlyResponseCanBeReturned,
        message: OnlyResponseCanBeReturned.message(
          route?.route,
          typeof factoryResult
        ),
        location: {
          file: route?.component
        }
      });
    }
    return factoryResult.content;
  } else if (!isRenderTemplateResult(factoryResult)) {
    throw new AstroError({
      ...OnlyResponseCanBeReturned,
      message: OnlyResponseCanBeReturned.message(route?.route, typeof factoryResult),
      location: {
        file: route?.component
      }
    });
  }
  return factoryResult;
}
async function bufferHeadContent(result) {
  await bufferPropagatedHead(result);
}
async function renderToAsyncIterable(result, componentFactory, props, children, isPage = false, route) {
  const templateResult = await callComponentAsTemplateResultOrResponse(
    result,
    componentFactory,
    props,
    children,
    route
  );
  if (templateResult instanceof Response) return templateResult;
  let renderedFirstPageChunk = false;
  if (isPage) {
    await bufferHeadContent(result);
  }
  let error2 = null;
  let next = null;
  const buffer2 = [];
  let renderingComplete = false;
  const iterator = {
    async next() {
      if (result.cancelled) return { done: true, value: void 0 };
      if (next !== null) {
        await next.promise;
      } else if (!renderingComplete && !buffer2.length) {
        next = promiseWithResolvers();
        await next.promise;
      }
      if (!renderingComplete) {
        next = promiseWithResolvers();
      }
      if (error2) {
        throw error2;
      }
      let length = 0;
      let stringToEncode = "";
      for (let i = 0, len = buffer2.length; i < len; i++) {
        const bufferEntry = buffer2[i];
        if (typeof bufferEntry === "string") {
          const nextIsString = i + 1 < len && typeof buffer2[i + 1] === "string";
          stringToEncode += bufferEntry;
          if (!nextIsString) {
            const encoded = encoder.encode(stringToEncode);
            length += encoded.length;
            stringToEncode = "";
            buffer2[i] = encoded;
          } else {
            buffer2[i] = "";
          }
        } else {
          length += bufferEntry.length;
        }
      }
      let mergedArray = new Uint8Array(length);
      let offset = 0;
      for (let i = 0, len = buffer2.length; i < len; i++) {
        const item = buffer2[i];
        if (item === "") {
          continue;
        }
        mergedArray.set(item, offset);
        offset += item.length;
      }
      buffer2.length = 0;
      const returnValue = {
        // The iterator is done when rendering has finished
        // and there are no more chunks to return.
        done: length === 0 && renderingComplete,
        value: mergedArray
      };
      return returnValue;
    },
    async return() {
      result.cancelled = true;
      return { done: true, value: void 0 };
    }
  };
  const destination = {
    write(chunk) {
      if (isPage && !renderedFirstPageChunk) {
        renderedFirstPageChunk = true;
        if (!result.partial && !DOCTYPE_EXP.test(String(chunk))) {
          const doctype = result.compressHTML ? "<!DOCTYPE html>" : "<!DOCTYPE html>\n";
          buffer2.push(encoder.encode(doctype));
        }
      }
      if (chunk instanceof Response) {
        throw new AstroError(ResponseSentError);
      }
      const bytes = chunkToByteArrayOrString(result, chunk);
      if (bytes.length > 0) {
        buffer2.push(bytes);
        next?.resolve();
      } else if (buffer2.length > 0) {
        next?.resolve();
      }
    }
  };
  const renderResult = toPromise(() => templateResult.render(destination));
  renderResult.catch((err) => {
    error2 = err;
  }).finally(() => {
    renderingComplete = true;
    next?.resolve();
  });
  return {
    [Symbol.asyncIterator]() {
      return iterator;
    }
  };
}
function toPromise(fn) {
  try {
    const result = fn();
    return isPromise(result) ? result : Promise.resolve(result);
  } catch (err) {
    return Promise.reject(err);
  }
}
function componentIsHTMLElement(Component) {
  return typeof HTMLElement !== "undefined" && HTMLElement.isPrototypeOf(Component);
}
async function renderHTMLElement$1(result, constructor, props, slots) {
  const name = getHTMLElementName(constructor);
  let attrHTML = "";
  for (const attr in props) {
    attrHTML += ` ${attr}="${toAttributeString(await props[attr])}"`;
  }
  return markHTMLString(
    `<${name}${attrHTML}>${await renderSlotToString(result, slots?.default)}</${name}>`
  );
}
function getHTMLElementName(constructor) {
  const definedName = customElements.getName(constructor);
  if (definedName) return definedName;
  const assignedName = constructor.name.replace(/^HTML|Element$/g, "").replace(/[A-Z]/g, "-$&").toLowerCase().replace(/^-/, "html-");
  return assignedName;
}
const needsHeadRenderingSymbol = /* @__PURE__ */ Symbol.for("astro.needsHeadRendering");
const rendererAliases = /* @__PURE__ */ new Map([["solid", "solid-js"]]);
const clientOnlyValues = /* @__PURE__ */ new Set(["solid-js", "react", "preact", "vue", "svelte"]);
function guessRenderers(componentUrl) {
  const extname = componentUrl?.split(".").pop();
  switch (extname) {
    case "svelte":
      return ["@astrojs/svelte"];
    case "vue":
      return ["@astrojs/vue"];
    case "jsx":
    case "tsx":
      return ["@astrojs/react", "@astrojs/preact", "@astrojs/solid-js", "@astrojs/vue (jsx)"];
    case void 0:
    default:
      return [
        "@astrojs/react",
        "@astrojs/preact",
        "@astrojs/solid-js",
        "@astrojs/vue",
        "@astrojs/svelte"
      ];
  }
}
function isFragmentComponent(Component) {
  return Component === Fragment;
}
function isHTMLComponent(Component) {
  return Component && Component["astro:html"] === true;
}
const ASTRO_SLOT_EXP = /<\/?astro-slot\b[^>]*>/g;
const ASTRO_STATIC_SLOT_EXP = /<\/?astro-static-slot\b[^>]*>/g;
function removeStaticAstroSlot(html, supportsAstroStaticSlot = true) {
  const exp = supportsAstroStaticSlot ? ASTRO_STATIC_SLOT_EXP : ASTRO_SLOT_EXP;
  return html.replace(exp, "");
}
async function renderFrameworkComponent(result, displayName, Component, _props, slots = {}) {
  if (!Component && "client:only" in _props === false) {
    throw new Error(
      `Unable to render ${displayName} because it is ${Component}!
Did you forget to import the component or is it possible there is a typo?`
    );
  }
  const { renderers: renderers2, clientDirectives } = result;
  const metadata = {
    astroStaticSlot: true,
    displayName
  };
  const { hydration, isPage, props, propsWithoutTransitionAttributes } = extractDirectives(
    _props,
    clientDirectives
  );
  let html = "";
  let attrs = void 0;
  if (hydration) {
    metadata.hydrate = hydration.directive;
    metadata.hydrateArgs = hydration.value;
    metadata.componentExport = hydration.componentExport;
    metadata.componentUrl = hydration.componentUrl;
  }
  const probableRendererNames = guessRenderers(metadata.componentUrl);
  const validRenderers = renderers2.filter((r) => r.name !== "astro:jsx");
  const { children, slotInstructions } = await renderSlots(result, slots);
  let renderer;
  if (metadata.hydrate !== "only") {
    let isTagged = false;
    try {
      isTagged = Component && Component[Renderer];
    } catch {
    }
    if (isTagged) {
      const rendererName = Component[Renderer];
      renderer = renderers2.find(({ name }) => name === rendererName);
    }
    if (!renderer) {
      let error2;
      for (const r of renderers2) {
        try {
          if (await r.ssr.check.call({ result }, Component, props, children, metadata)) {
            renderer = r;
            break;
          }
        } catch (e) {
          error2 ??= e;
        }
      }
      if (!renderer && error2) {
        throw error2;
      }
    }
    if (!renderer && typeof HTMLElement === "function" && componentIsHTMLElement(Component)) {
      const output = await renderHTMLElement$1(
        result,
        Component,
        _props,
        slots
      );
      return {
        render(destination) {
          destination.write(output);
        }
      };
    }
  } else {
    if (metadata.hydrateArgs) {
      const rendererName = rendererAliases.has(metadata.hydrateArgs) ? rendererAliases.get(metadata.hydrateArgs) : metadata.hydrateArgs;
      if (clientOnlyValues.has(rendererName)) {
        renderer = renderers2.find(
          ({ name }) => name === `@astrojs/${rendererName}` || name === rendererName
        );
      }
    }
    if (!renderer && validRenderers.length === 1) {
      renderer = validRenderers[0];
    }
    if (!renderer) {
      const extname = metadata.componentUrl?.split(".").pop();
      renderer = renderers2.find(({ name }) => name === `@astrojs/${extname}` || name === extname);
    }
    if (!renderer && metadata.hydrateArgs) {
      const rendererName = metadata.hydrateArgs;
      if (typeof rendererName === "string") {
        renderer = renderers2.find(({ name }) => name === rendererName);
      }
    }
  }
  let componentServerRenderEndTime;
  if (!renderer) {
    if (metadata.hydrate === "only") {
      const rendererName = rendererAliases.has(metadata.hydrateArgs) ? rendererAliases.get(metadata.hydrateArgs) : metadata.hydrateArgs;
      if (clientOnlyValues.has(rendererName)) {
        const plural = validRenderers.length > 1;
        throw new AstroError({
          ...NoMatchingRenderer,
          message: NoMatchingRenderer.message(
            metadata.displayName,
            metadata?.componentUrl?.split(".").pop(),
            plural,
            validRenderers.length
          ),
          hint: NoMatchingRenderer.hint(
            formatList(probableRendererNames.map((r) => "`" + r + "`"))
          )
        });
      } else {
        throw new AstroError({
          ...NoClientOnlyHint,
          message: NoClientOnlyHint.message(metadata.displayName),
          hint: NoClientOnlyHint.hint(
            probableRendererNames.map((r) => r.replace("@astrojs/", "")).join("|")
          )
        });
      }
    } else if (typeof Component !== "string") {
      const matchingRenderers = validRenderers.filter(
        (r) => probableRendererNames.includes(r.name)
      );
      const plural = validRenderers.length > 1;
      if (matchingRenderers.length === 0) {
        throw new AstroError({
          ...NoMatchingRenderer,
          message: NoMatchingRenderer.message(
            metadata.displayName,
            metadata?.componentUrl?.split(".").pop(),
            plural,
            validRenderers.length
          ),
          hint: NoMatchingRenderer.hint(
            formatList(probableRendererNames.map((r) => "`" + r + "`"))
          )
        });
      } else if (matchingRenderers.length === 1) {
        renderer = matchingRenderers[0];
        ({ html, attrs } = await renderer.ssr.renderToStaticMarkup.call(
          { result },
          Component,
          propsWithoutTransitionAttributes,
          children,
          metadata
        ));
      } else {
        throw new Error(`Unable to render ${metadata.displayName}!

This component likely uses ${formatList(probableRendererNames)},
but Astro encountered an error during server-side rendering.

Please ensure that ${metadata.displayName}:
1. Does not unconditionally access browser-specific globals like \`window\` or \`document\`.
   If this is unavoidable, use the \`client:only\` hydration directive.
2. Does not conditionally return \`null\` or \`undefined\` when rendered on the server.
3. If using multiple JSX frameworks at the same time (e.g. React + Preact), pass the correct \`include\`/\`exclude\` options to integrations.

If you're still stuck, please open an issue on GitHub or join us at https://astro.build/chat.`);
      }
    }
  } else {
    if (metadata.hydrate === "only") {
      html = await renderSlotToString(result, slots?.fallback);
    } else {
      const componentRenderStartTime = performance.now();
      ({ html, attrs } = await renderer.ssr.renderToStaticMarkup.call(
        { result },
        Component,
        propsWithoutTransitionAttributes,
        children,
        metadata
      ));
      componentServerRenderEndTime = performance.now() - componentRenderStartTime;
    }
  }
  if (!html && typeof Component === "string") {
    const Tag = sanitizeElementName(Component);
    const childSlots = Object.values(children).join("");
    const renderTemplateResult = renderTemplate`<${Tag}${internalSpreadAttributes(
      props,
      true,
      Tag
    )}${markHTMLString(
      childSlots === "" && voidElementNames.test(Tag) ? `/>` : `>${childSlots}</${Tag}>`
    )}`;
    html = "";
    const destination = {
      write(chunk) {
        if (chunk instanceof Response) return;
        html += chunkToString(result, chunk);
      }
    };
    await renderTemplateResult.render(destination);
  }
  if (!hydration) {
    return {
      render(destination) {
        if (slotInstructions) {
          for (const instruction of slotInstructions) {
            destination.write(instruction);
          }
        }
        if (isPage || renderer?.name === "astro:jsx") {
          destination.write(html);
        } else if (html && html.length > 0) {
          destination.write(
            markHTMLString(removeStaticAstroSlot(html, renderer?.ssr?.supportsAstroStaticSlot))
          );
        }
      }
    };
  }
  const astroId = shorthash(
    `<!--${metadata.componentExport.value}:${metadata.componentUrl}-->
${html}
${serializeProps(
      props,
      metadata
    )}`
  );
  const island = await generateHydrateScript(
    { renderer, result, astroId, props, attrs },
    metadata
  );
  if (componentServerRenderEndTime && true)
    island.props["server-render-time"] = componentServerRenderEndTime;
  let unrenderedSlots = [];
  if (html) {
    if (Object.keys(children).length > 0) {
      for (const key of Object.keys(children)) {
        let tagName = renderer?.ssr?.supportsAstroStaticSlot ? !!metadata.hydrate ? "astro-slot" : "astro-static-slot" : "astro-slot";
        let expectedHTML = key === "default" ? `<${tagName}>` : `<${tagName} name="${key}">`;
        if (!html.includes(expectedHTML)) {
          unrenderedSlots.push(key);
        }
      }
    }
  } else {
    unrenderedSlots = Object.keys(children);
  }
  const template = unrenderedSlots.length > 0 ? unrenderedSlots.map(
    (key) => `<template data-astro-template${key !== "default" ? `="${key}"` : ""}>${children[key]}</template>`
  ).join("") : "";
  island.children = `${html ?? ""}${template}`;
  if (island.children) {
    island.props["await-children"] = "";
    island.children += `<!--astro:end-->`;
  }
  return {
    render(destination) {
      if (slotInstructions) {
        for (const instruction of slotInstructions) {
          destination.write(instruction);
        }
      }
      destination.write(createRenderInstruction({ type: "directive", hydration }));
      if (hydration.directive !== "only" && renderer?.ssr.renderHydrationScript) {
        destination.write(
          createRenderInstruction({
            type: "renderer-hydration-script",
            rendererName: renderer.name,
            render: renderer.ssr.renderHydrationScript
          })
        );
      }
      const renderedElement = renderElement$1("astro-island", island, false);
      destination.write(markHTMLString(renderedElement));
    }
  };
}
function sanitizeElementName(tag) {
  const unsafe = /[&<>'"\s]+/;
  if (!unsafe.test(tag)) return tag;
  return tag.trim().split(unsafe)[0].trim();
}
function renderFragmentComponent(result, slots = {}) {
  const slot = slots?.default;
  return {
    render(destination) {
      if (slot == null) return;
      return renderSlot(result, slot).render(destination);
    }
  };
}
async function renderHTMLComponent(result, Component, _props, slots = {}) {
  const { slotInstructions, children } = await renderSlots(result, slots);
  const html = Component({ slots: children });
  const hydrationHtml = slotInstructions ? slotInstructions.map((instr) => chunkToString(result, instr)).join("") : "";
  return {
    render(destination) {
      destination.write(markHTMLString(hydrationHtml + html));
    }
  };
}
function renderAstroComponent(result, displayName, Component, props, slots = {}) {
  if (containsServerDirective(props)) {
    const serverIslandComponent = new ServerIslandComponent(result, props, slots, displayName);
    result._metadata.propagators.add(serverIslandComponent);
    return serverIslandComponent;
  }
  const instance = createAstroComponentInstance(result, displayName, Component, props, slots);
  return {
    render(destination) {
      return instance.render(destination);
    }
  };
}
function renderComponent(result, displayName, Component, props, slots = {}) {
  if (isPromise(Component)) {
    return Component.catch(handleCancellation).then((x) => {
      return renderComponent(result, displayName, x, props, slots);
    });
  }
  if (isFragmentComponent(Component)) {
    return renderFragmentComponent(result, slots);
  }
  props = normalizeProps(props);
  if (isHTMLComponent(Component)) {
    return renderHTMLComponent(result, Component, props, slots).catch(handleCancellation);
  }
  if (isAstroComponentFactory(Component)) {
    return renderAstroComponent(result, displayName, Component, props, slots);
  }
  return renderFrameworkComponent(result, displayName, Component, props, slots).catch(
    handleCancellation
  );
  function handleCancellation(e) {
    if (result.cancelled)
      return {
        render() {
        }
      };
    throw e;
  }
}
function normalizeProps(props) {
  if (props["class:list"] !== void 0) {
    const value = props["class:list"];
    delete props["class:list"];
    props["class"] = clsx(props["class"], value);
    if (props["class"] === "") {
      delete props["class"];
    }
  }
  return props;
}
async function renderComponentToString(result, displayName, Component, props, slots = {}, isPage = false, route) {
  let str = "";
  let renderedFirstPageChunk = false;
  let head = "";
  if (isPage && !result.partial && nonAstroPageNeedsHeadInjection(Component)) {
    head += chunkToString(result, maybeRenderHead());
  }
  try {
    const destination = {
      write(chunk) {
        if (isPage && !result.partial && !renderedFirstPageChunk) {
          renderedFirstPageChunk = true;
          if (!/<!doctype html/i.test(String(chunk))) {
            const doctype = result.compressHTML ? "<!DOCTYPE html>" : "<!DOCTYPE html>\n";
            str += doctype + head;
          }
        }
        if (chunk instanceof Response) return;
        str += chunkToString(result, chunk);
      }
    };
    const renderInstance = await renderComponent(result, displayName, Component, props, slots);
    if (containsServerDirective(props)) {
      await bufferHeadContent(result);
    }
    await renderInstance.render(destination);
  } catch (e) {
    if (AstroError.is(e) && !e.loc) {
      e.setLocation({
        file: route?.component
      });
    }
    throw e;
  }
  return str;
}
function nonAstroPageNeedsHeadInjection(pageComponent) {
  return !!pageComponent?.[needsHeadRenderingSymbol];
}
const ClientOnlyPlaceholder$1 = "astro-client-only";
const hasTriedRenderComponentSymbol = /* @__PURE__ */ Symbol("hasTriedRenderComponent");
async function renderJSX(result, vnode) {
  switch (true) {
    case vnode instanceof HTMLString:
      if (vnode.toString().trim() === "") {
        return "";
      }
      return vnode;
    case typeof vnode === "string":
      return markHTMLString(escapeHTML(vnode));
    case typeof vnode === "function":
      return vnode;
    case (!vnode && vnode !== 0):
      return "";
    case Array.isArray(vnode): {
      const renderedItems = await Promise.all(vnode.map((v) => renderJSX(result, v)));
      let instructions = null;
      let content = "";
      for (const item of renderedItems) {
        if (item instanceof SlotString) {
          content += item;
          instructions = mergeSlotInstructions(instructions, item);
        } else {
          content += item;
        }
      }
      if (instructions) {
        return markHTMLString(new SlotString(content, instructions));
      }
      return markHTMLString(content);
    }
  }
  return renderJSXVNode(result, vnode);
}
async function renderJSXVNode(result, vnode) {
  if (isVNode(vnode)) {
    switch (true) {
      case !vnode.type: {
        throw new Error(`Unable to render ${result.pathname} because it contains an undefined Component!
Did you forget to import the component or is it possible there is a typo?`);
      }
      case vnode.type === /* @__PURE__ */ Symbol.for("astro:fragment"):
        return renderJSX(result, vnode.props.children);
      case isAstroComponentFactory(vnode.type): {
        let props = {};
        let slots = {};
        for (const [key, value] of Object.entries(vnode.props ?? {})) {
          if (key === "children" || value && typeof value === "object" && value["$$slot"]) {
            slots[key === "children" ? "default" : key] = () => renderJSX(result, value);
          } else {
            props[key] = value;
          }
        }
        const str = await renderComponentToString(
          result,
          vnode.type.name,
          vnode.type,
          props,
          slots
        );
        const html = markHTMLString(str);
        return html;
      }
      case (!vnode.type && vnode.type !== 0):
        return "";
      case (typeof vnode.type === "string" && vnode.type !== ClientOnlyPlaceholder$1):
        return markHTMLString(await renderElement(result, vnode.type, vnode.props ?? {}));
    }
    if (vnode.type) {
      let extractSlots2 = function(child) {
        if (Array.isArray(child)) {
          return child.map((c) => extractSlots2(c));
        }
        if (!isVNode(child)) {
          _slots.default.push(child);
          return;
        }
        if ("slot" in child.props) {
          _slots[child.props.slot] = [..._slots[child.props.slot] ?? [], child];
          delete child.props.slot;
          return;
        }
        _slots.default.push(child);
      };
      if (typeof vnode.type === "function" && vnode.props["server:root"]) {
        const output2 = await vnode.type(vnode.props ?? {});
        return await renderJSX(result, output2);
      }
      if (typeof vnode.type === "function") {
        if (vnode.props[hasTriedRenderComponentSymbol]) {
          delete vnode.props[hasTriedRenderComponentSymbol];
          const output2 = await vnode.type(vnode.props ?? {});
          if (output2?.[AstroJSX] || !output2) {
            return await renderJSXVNode(result, output2);
          } else {
            return;
          }
        } else {
          vnode.props[hasTriedRenderComponentSymbol] = true;
        }
      }
      const { children = null, ...props } = vnode.props ?? {};
      const _slots = {
        default: []
      };
      extractSlots2(children);
      for (const [key, value] of Object.entries(props)) {
        if (value?.["$$slot"]) {
          _slots[key] = value;
          delete props[key];
        }
      }
      const slotPromises = [];
      const slots = {};
      for (const [key, value] of Object.entries(_slots)) {
        slotPromises.push(
          renderJSX(result, value).then((output2) => {
            if (output2.toString().trim().length === 0) return;
            slots[key] = () => output2;
          })
        );
      }
      await Promise.all(slotPromises);
      let output;
      if (vnode.type === ClientOnlyPlaceholder$1 && vnode.props["client:only"]) {
        output = await renderComponentToString(
          result,
          vnode.props["client:display-name"] ?? "",
          null,
          props,
          slots
        );
      } else {
        output = await renderComponentToString(
          result,
          typeof vnode.type === "function" ? vnode.type.name : vnode.type,
          vnode.type,
          props,
          slots
        );
      }
      return markHTMLString(output);
    }
  }
  return markHTMLString(`${vnode}`);
}
async function renderElement(result, tag, { children, ...props }) {
  return markHTMLString(
    `<${tag}${spreadAttributes(props)}${markHTMLString(
      (children == null || children === "") && voidElementNames.test(tag) ? `/>` : `>${children == null ? "" : await renderJSX(result, prerenderElementChildren$1(tag, children))}</${tag}>`
    )}`
  );
}
function prerenderElementChildren$1(tag, children) {
  if (typeof children === "string" && (tag === "style" || tag === "script")) {
    return markHTMLString(children);
  } else {
    return children;
  }
}
const ClientOnlyPlaceholder = "astro-client-only";
function renderJSXToQueue(vnode, result, queue, pool, stack, parent, metadata) {
  if (vnode instanceof HTMLString) {
    const html = vnode.toString();
    if (html.trim() === "") return;
    const node = pool.acquire("html-string", html);
    node.html = html;
    queue.nodes.push(node);
    return;
  }
  if (typeof vnode === "string") {
    const node = pool.acquire("text", vnode);
    node.content = vnode;
    queue.nodes.push(node);
    return;
  }
  if (typeof vnode === "number" || typeof vnode === "boolean") {
    const str = String(vnode);
    const node = pool.acquire("text", str);
    node.content = str;
    queue.nodes.push(node);
    return;
  }
  if (vnode == null || vnode === false) {
    return;
  }
  if (Array.isArray(vnode)) {
    for (let i = vnode.length - 1; i >= 0; i = i - 1) {
      stack.push({ node: vnode[i], parent, metadata });
    }
    return;
  }
  if (!isVNode(vnode)) {
    const str = String(vnode);
    const node = pool.acquire("text", str);
    node.content = str;
    queue.nodes.push(node);
    return;
  }
  handleVNode(vnode, result, queue, pool, stack, parent, metadata);
}
function handleVNode(vnode, result, queue, pool, stack, parent, metadata) {
  if (!vnode.type) {
    throw new Error(
      `Unable to render ${result.pathname} because it contains an undefined Component!
Did you forget to import the component or is it possible there is a typo?`
    );
  }
  if (vnode.type === /* @__PURE__ */ Symbol.for("astro:fragment")) {
    stack.push({ node: vnode.props?.children, parent, metadata });
    return;
  }
  if (isAstroComponentFactory(vnode.type)) {
    const factory = vnode.type;
    let props = {};
    let slots = {};
    for (const [key, value] of Object.entries(vnode.props ?? {})) {
      if (key === "children" || value && typeof value === "object" && value["$$slot"]) {
        slots[key === "children" ? "default" : key] = () => renderJSX(result, value);
      } else {
        props[key] = value;
      }
    }
    const displayName = metadata?.displayName || factory.name || "Anonymous";
    const instance = createAstroComponentInstance(result, displayName, factory, props, slots);
    const queueNode = pool.acquire("component");
    queueNode.instance = instance;
    queue.nodes.push(queueNode);
    return;
  }
  if (typeof vnode.type === "string" && vnode.type !== ClientOnlyPlaceholder) {
    renderHTMLElement(vnode, result, queue, pool, stack, parent, metadata);
    return;
  }
  if (typeof vnode.type === "function") {
    if (vnode.props?.["server:root"]) {
      const output3 = vnode.type(vnode.props ?? {});
      stack.push({ node: output3, parent, metadata });
      return;
    }
    const output2 = vnode.type(vnode.props ?? {});
    stack.push({ node: output2, parent, metadata });
    return;
  }
  const output = renderJSX(result, vnode);
  stack.push({ node: output, parent, metadata });
}
function renderHTMLElement(vnode, _result, queue, pool, stack, parent, metadata) {
  const tag = vnode.type;
  const { children, ...props } = vnode.props ?? {};
  const attrs = spreadAttributes(props);
  const isVoidElement = (children == null || children === "") && voidElementNames.test(tag);
  if (isVoidElement) {
    const html = `<${tag}${attrs}/>`;
    const node = pool.acquire("html-string", html);
    node.html = html;
    queue.nodes.push(node);
    return;
  }
  const openTag = `<${tag}${attrs}>`;
  const openTagHtml = queue.htmlStringCache ? queue.htmlStringCache.getOrCreate(openTag) : markHTMLString(openTag);
  stack.push({ node: openTagHtml, parent, metadata });
  if (children != null && children !== "") {
    const processedChildren = prerenderElementChildren(tag, children, queue.htmlStringCache);
    stack.push({ node: processedChildren, parent, metadata });
  }
  const closeTag = `</${tag}>`;
  const closeTagHtml = queue.htmlStringCache ? queue.htmlStringCache.getOrCreate(closeTag) : markHTMLString(closeTag);
  stack.push({ node: closeTagHtml, parent, metadata });
}
function prerenderElementChildren(tag, children, htmlStringCache) {
  if (typeof children === "string" && (tag === "style" || tag === "script")) {
    return htmlStringCache ? htmlStringCache.getOrCreate(children) : markHTMLString(children);
  }
  return children;
}
async function buildRenderQueue(root, result, pool) {
  const queue = {
    nodes: [],
    result,
    pool,
    htmlStringCache: result._experimentalQueuedRendering?.htmlStringCache
  };
  const stack = [{ node: root, parent: null }];
  while (stack.length > 0) {
    const item = stack.pop();
    if (!item) {
      continue;
    }
    let { node, parent } = item;
    if (isPromise(node)) {
      try {
        const resolved = await node;
        stack.push({ node: resolved, parent, metadata: item.metadata });
      } catch (error2) {
        throw error2;
      }
      continue;
    }
    if (node == null || node === false) {
      continue;
    }
    if (typeof node === "string") {
      const queueNode = pool.acquire("text", node);
      queueNode.content = node;
      queue.nodes.push(queueNode);
      continue;
    }
    if (typeof node === "number" || typeof node === "boolean") {
      const str = String(node);
      const queueNode = pool.acquire("text", str);
      queueNode.content = str;
      queue.nodes.push(queueNode);
      continue;
    }
    if (isHTMLString(node)) {
      const html = node.toString();
      const queueNode = pool.acquire("html-string", html);
      queueNode.html = html;
      queue.nodes.push(queueNode);
      continue;
    }
    if (node instanceof SlotString) {
      const html = node.toString();
      const queueNode = pool.acquire("html-string", html);
      queueNode.html = html;
      queue.nodes.push(queueNode);
      continue;
    }
    if (isVNode(node)) {
      renderJSXToQueue(node, result, queue, pool, stack, parent, item.metadata);
      continue;
    }
    if (Array.isArray(node)) {
      for (const n of node) {
        stack.push({ node: n, parent, metadata: item.metadata });
      }
      continue;
    }
    if (isRenderInstruction(node)) {
      const queueNode = pool.acquire("instruction");
      queueNode.instruction = node;
      queue.nodes.push(queueNode);
      continue;
    }
    if (isRenderTemplateResult(node)) {
      const htmlParts = node["htmlParts"];
      const expressions = node["expressions"];
      if (htmlParts[0]) {
        const htmlString = queue.htmlStringCache ? queue.htmlStringCache.getOrCreate(htmlParts[0]) : markHTMLString(htmlParts[0]);
        stack.push({
          node: htmlString,
          parent,
          metadata: item.metadata
        });
      }
      for (let i = 0; i < expressions.length; i = i + 1) {
        stack.push({ node: expressions[i], parent, metadata: item.metadata });
        if (htmlParts[i + 1]) {
          const htmlString = queue.htmlStringCache ? queue.htmlStringCache.getOrCreate(htmlParts[i + 1]) : markHTMLString(htmlParts[i + 1]);
          stack.push({
            node: htmlString,
            parent,
            metadata: item.metadata
          });
        }
      }
      continue;
    }
    if (isAstroComponentInstance(node)) {
      const queueNode = pool.acquire("component");
      queueNode.instance = node;
      queue.nodes.push(queueNode);
      continue;
    }
    if (isAstroComponentFactory(node)) {
      const factory = node;
      const props = item.metadata?.props || {};
      const slots = item.metadata?.slots || {};
      const displayName = item.metadata?.displayName || factory.name || "Anonymous";
      const instance = createAstroComponentInstance(result, displayName, factory, props, slots);
      const queueNode = pool.acquire("component");
      queueNode.instance = instance;
      if (isAPropagatingComponent(result, factory)) {
        try {
          const returnValue = await instance.init(result);
          if (isHeadAndContent(returnValue) && returnValue.head) {
            result._metadata.extraHead.push(returnValue.head);
          }
        } catch (error2) {
          throw error2;
        }
      }
      queue.nodes.push(queueNode);
      continue;
    }
    if (isRenderInstance(node)) {
      const queueNode = pool.acquire("component");
      queueNode.instance = node;
      queue.nodes.push(queueNode);
      continue;
    }
    if (typeof node === "object" && Symbol.iterator in node) {
      const items = Array.from(node);
      for (const iterItem of items) {
        stack.push({ node: iterItem, parent, metadata: item.metadata });
      }
      continue;
    }
    if (typeof node === "object" && Symbol.asyncIterator in node) {
      try {
        const items = [];
        for await (const asyncItem of node) {
          items.push(asyncItem);
        }
        for (const iterItem of items) {
          stack.push({ node: iterItem, parent, metadata: item.metadata });
        }
      } catch (error2) {
        throw error2;
      }
      continue;
    }
    if (node instanceof Response) {
      const queueNode = pool.acquire("html-string", "");
      queueNode.html = "";
      queue.nodes.push(queueNode);
      continue;
    }
    if (isHTMLString(node)) {
      const html = String(node);
      const queueNode = pool.acquire("html-string", html);
      queueNode.html = html;
      queue.nodes.push(queueNode);
    } else {
      const str = String(node);
      const queueNode = pool.acquire("text", str);
      queueNode.content = str;
      queue.nodes.push(queueNode);
    }
  }
  queue.nodes.reverse();
  return queue;
}
async function renderQueue(queue, destination) {
  const result = queue.result;
  const pool = queue.pool;
  const cache = queue.htmlStringCache;
  let batchBuffer = "";
  let i = 0;
  while (i < queue.nodes.length) {
    const node = queue.nodes[i];
    try {
      if (canBatch(node)) {
        const batchStart = i;
        while (i < queue.nodes.length && canBatch(queue.nodes[i])) {
          batchBuffer += renderNodeToString(queue.nodes[i]);
          i = i + 1;
        }
        if (batchBuffer) {
          const htmlString = cache ? cache.getOrCreate(batchBuffer) : markHTMLString(batchBuffer);
          destination.write(htmlString);
          batchBuffer = "";
        }
        if (pool) {
          for (let j = batchStart; j < i; j++) {
            pool.release(queue.nodes[j]);
          }
        }
      } else {
        await renderNode(node, destination, result);
        if (pool) {
          pool.release(node);
        }
        i = i + 1;
      }
    } catch (error2) {
      throw error2;
    }
  }
  if (batchBuffer) {
    const htmlString = cache ? cache.getOrCreate(batchBuffer) : markHTMLString(batchBuffer);
    destination.write(htmlString);
  }
}
function canBatch(node) {
  return node.type === "text" || node.type === "html-string";
}
function renderNodeToString(node) {
  switch (node.type) {
    case "text":
      return node.content ? escapeHTML(node.content) : "";
    case "html-string":
      return node.html || "";
    case "component":
    case "instruction": {
      return "";
    }
  }
}
async function renderNode(node, destination, result) {
  const cache = result._experimentalQueuedRendering?.htmlStringCache;
  switch (node.type) {
    case "text": {
      if (node.content) {
        const escaped = escapeHTML(node.content);
        const htmlString = cache ? cache.getOrCreate(escaped) : markHTMLString(escaped);
        destination.write(htmlString);
      }
      break;
    }
    case "html-string": {
      if (node.html) {
        const htmlString = cache ? cache.getOrCreate(node.html) : markHTMLString(node.html);
        destination.write(htmlString);
      }
      break;
    }
    case "instruction": {
      if (node.instruction) {
        destination.write(node.instruction);
      }
      break;
    }
    case "component": {
      if (node.instance) {
        let componentHtml = "";
        const componentDestination = {
          write(chunk) {
            if (chunk instanceof Response) return;
            componentHtml += chunkToString(result, chunk);
          }
        };
        await node.instance.render(componentDestination);
        if (componentHtml) {
          destination.write(componentHtml);
        }
      }
      break;
    }
  }
}
async function renderPage(result, componentFactory, props, children, streaming, route) {
  if (!isAstroComponentFactory(componentFactory)) {
    result._metadata.headInTree = result.componentMetadata.get(componentFactory.moduleId)?.containsHead ?? false;
    const pageProps = { ...props ?? {}, "server:root": true };
    let str;
    if (result._experimentalQueuedRendering && result._experimentalQueuedRendering.enabled) {
      let vnode = await componentFactory(pageProps);
      if (componentFactory["astro:html"] && typeof vnode === "string") {
        vnode = markHTMLString(vnode);
      }
      const queue = await buildRenderQueue(
        vnode,
        result,
        result._experimentalQueuedRendering.pool
      );
      let html = "";
      let renderedFirst = false;
      const destination = {
        write(chunk) {
          if (chunk instanceof Response) return;
          if (!renderedFirst && !result.partial) {
            renderedFirst = true;
            const chunkStr = String(chunk);
            if (!/<!doctype html/i.test(chunkStr)) {
              const doctype = result.compressHTML ? "<!DOCTYPE html>" : "<!DOCTYPE html>\n";
              html += doctype;
            }
          }
          html += chunkToString(result, chunk);
        }
      };
      await renderQueue(queue, destination);
      str = html;
    } else {
      str = await renderComponentToString(
        result,
        componentFactory.name,
        componentFactory,
        pageProps,
        {},
        true,
        route
      );
    }
    const bytes = encoder.encode(str);
    const headers2 = new Headers([
      ["Content-Type", "text/html"],
      ["Content-Length", bytes.byteLength.toString()]
    ]);
    if (result.shouldInjectCspMetaTags && (result.cspDestination === "header" || result.cspDestination === "adapter")) {
      headers2.set("content-security-policy", renderCspContent(result));
    }
    return new Response(bytes, {
      headers: headers2,
      status: result.response.status
    });
  }
  result._metadata.headInTree = result.componentMetadata.get(componentFactory.moduleId)?.containsHead ?? false;
  let body;
  if (streaming) {
    if (isNode && !isDeno) {
      const nodeBody = await renderToAsyncIterable(
        result,
        componentFactory,
        props,
        children,
        true,
        route
      );
      body = nodeBody;
    } else {
      body = await renderToReadableStream(result, componentFactory, props, children, true, route);
    }
  } else {
    body = await renderToString(result, componentFactory, props, children, true, route);
  }
  if (body instanceof Response) return body;
  const init = result.response;
  const headers = new Headers(init.headers);
  if (result.shouldInjectCspMetaTags && result.cspDestination === "header" || result.cspDestination === "adapter") {
    headers.set("content-security-policy", renderCspContent(result));
  }
  if (!streaming && typeof body === "string") {
    body = encoder.encode(body);
    headers.set("Content-Length", body.byteLength.toString());
  }
  let status = init.status;
  let statusText = init.statusText;
  if (route?.route === "/404") {
    status = 404;
    if (statusText === "OK") {
      statusText = "Not Found";
    }
  } else if (route?.route === "/500") {
    status = 500;
    if (statusText === "OK") {
      statusText = "Internal Server Error";
    }
  }
  if (status) {
    return new Response(body, { ...init, headers, status, statusText });
  } else {
    return new Response(body, { ...init, headers });
  }
}
function spreadAttributes(values = {}, _name, { class: scopedClassName } = {}) {
  let output = "";
  if (scopedClassName) {
    if (typeof values.class !== "undefined") {
      values.class += ` ${scopedClassName}`;
    } else if (typeof values["class:list"] !== "undefined") {
      values["class:list"] = [values["class:list"], scopedClassName];
    } else {
      values.class = scopedClassName;
    }
  }
  for (const [key, value] of Object.entries(values)) {
    output += addAttribute(value, key, true, _name);
  }
  return markHTMLString(output);
}
function deduplicateDirectiveValues(existingDirective, newDirective) {
  const [directiveName, ...existingValues] = existingDirective.split(/\s+/).filter(Boolean);
  const [newDirectiveName, ...newValues] = newDirective.split(/\s+/).filter(Boolean);
  if (directiveName !== newDirectiveName) {
    return void 0;
  }
  const finalDirectives = Array.from(/* @__PURE__ */ new Set([...existingValues, ...newValues]));
  return `${directiveName} ${finalDirectives.join(" ")}`;
}
function pushDirective(directives, newDirective) {
  let deduplicated = false;
  if (directives.length === 0) {
    return [newDirective];
  }
  const finalDirectives = [];
  for (const directive of directives) {
    if (deduplicated) {
      finalDirectives.push(directive);
      continue;
    }
    const result = deduplicateDirectiveValues(directive, newDirective);
    if (result) {
      finalDirectives.push(result);
      deduplicated = true;
    } else {
      finalDirectives.push(directive);
      finalDirectives.push(newDirective);
    }
  }
  return finalDirectives;
}
async function callMiddleware(onRequest, apiContext, responseFunction) {
  let nextCalled = false;
  let responseFunctionPromise = void 0;
  const next = async (payload) => {
    nextCalled = true;
    responseFunctionPromise = responseFunction(apiContext, payload);
    return responseFunctionPromise;
  };
  const middlewarePromise = onRequest(apiContext, next);
  return await Promise.resolve(middlewarePromise).then(async (value) => {
    if (nextCalled) {
      if (typeof value !== "undefined") {
        if (value instanceof Response === false) {
          throw new AstroError(MiddlewareNotAResponse);
        }
        return value;
      } else {
        if (responseFunctionPromise) {
          return responseFunctionPromise;
        } else {
          throw new AstroError(MiddlewareNotAResponse);
        }
      }
    } else if (typeof value === "undefined") {
      throw new AstroError(MiddlewareNoDataOrNextCalled);
    } else if (value instanceof Response === false) {
      throw new AstroError(MiddlewareNotAResponse);
    } else {
      return value;
    }
  });
}
const EMPTY_OPTIONS = Object.freeze({ tags: [] });
class NoopAstroCache {
  enabled = false;
  set() {
  }
  get tags() {
    return [];
  }
  get options() {
    return EMPTY_OPTIONS;
  }
  async invalidate() {
  }
}
let hasWarned = false;
class DisabledAstroCache {
  enabled = false;
  #logger;
  constructor(logger) {
    this.#logger = logger;
  }
  #warn() {
    if (!hasWarned) {
      hasWarned = true;
      this.#logger?.warn(
        "cache",
        "`cache.set()` was called but caching is not enabled. Configure a cache provider in your Astro config under `experimental.cache` to enable caching."
      );
    }
  }
  set() {
    this.#warn();
  }
  get tags() {
    return [];
  }
  get options() {
    return EMPTY_OPTIONS;
  }
  async invalidate() {
    throw new AstroError(CacheNotEnabled);
  }
}
const NOOP_ACTIONS_MOD = {
  server: {}
};
const FORM_CONTENT_TYPES = [
  "application/x-www-form-urlencoded",
  "multipart/form-data",
  "text/plain"
];
const SAFE_METHODS = ["GET", "HEAD", "OPTIONS"];
function createOriginCheckMiddleware() {
  return defineMiddleware((context, next) => {
    const { request, url, isPrerendered } = context;
    if (isPrerendered) {
      return next();
    }
    if (SAFE_METHODS.includes(request.method)) {
      return next();
    }
    const isSameOrigin = request.headers.get("origin") === url.origin;
    const hasContentType2 = request.headers.has("content-type");
    if (hasContentType2) {
      const formLikeHeader = hasFormLikeHeader(request.headers.get("content-type"));
      if (formLikeHeader && !isSameOrigin) {
        return new Response(`Cross-site ${request.method} form submissions are forbidden`, {
          status: 403
        });
      }
    } else {
      if (!isSameOrigin) {
        return new Response(`Cross-site ${request.method} form submissions are forbidden`, {
          status: 403
        });
      }
    }
    return next();
  });
}
function hasFormLikeHeader(contentType) {
  if (contentType) {
    for (const FORM_CONTENT_TYPE of FORM_CONTENT_TYPES) {
      if (contentType.toLowerCase().includes(FORM_CONTENT_TYPE)) {
        return true;
      }
    }
  }
  return false;
}
const NOOP_MIDDLEWARE_FN = async (_ctx, next) => {
  const response = await next();
  response.headers.set(NOOP_MIDDLEWARE_HEADER, "true");
  return response;
};
const RedirectComponentInstance = {
  default() {
    return new Response(null, {
      status: 301
    });
  }
};
const RedirectSinglePageBuiltModule = {
  page: () => Promise.resolve(RedirectComponentInstance),
  onRequest: (_, next) => next()
};
function getPattern(segments, base, addTrailingSlash) {
  const pathname = segments.map((segment) => {
    if (segment.length === 1 && segment[0].spread) {
      return "(?:\\/(.*?))?";
    } else {
      return "\\/" + segment.map((part) => {
        if (part.spread) {
          return "(.*?)";
        } else if (part.dynamic) {
          return "([^/]+?)";
        } else {
          return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        }
      }).join("");
    }
  }).join("");
  const trailing = addTrailingSlash && segments.length ? getTrailingSlashPattern(addTrailingSlash) : "$";
  let initial = "\\/";
  if (addTrailingSlash === "never" && base !== "/") {
    initial = "";
  }
  return new RegExp(`^${pathname || initial}${trailing}`);
}
function getTrailingSlashPattern(addTrailingSlash) {
  if (addTrailingSlash === "always") {
    return "\\/$";
  }
  if (addTrailingSlash === "never") {
    return "$";
  }
  return "\\/?$";
}
const SERVER_ISLAND_ROUTE = "/_server-islands/[name]";
const SERVER_ISLAND_COMPONENT = "_server-islands.astro";
function badRequest(reason) {
  return new Response(null, {
    status: 400,
    statusText: "Bad request: " + reason
  });
}
const DEFAULT_BODY_SIZE_LIMIT = 1024 * 1024;
async function getRequestData(request, bodySizeLimit = DEFAULT_BODY_SIZE_LIMIT) {
  switch (request.method) {
    case "GET": {
      const url = new URL(request.url);
      const params = url.searchParams;
      if (!params.has("s") || !params.has("e") || !params.has("p")) {
        return badRequest("Missing required query parameters.");
      }
      const encryptedSlots = params.get("s");
      return {
        encryptedComponentExport: params.get("e"),
        encryptedProps: params.get("p"),
        encryptedSlots
      };
    }
    case "POST": {
      try {
        const body = await readBodyWithLimit(request, bodySizeLimit);
        const raw = new TextDecoder().decode(body);
        const data = JSON.parse(raw);
        if (Object.hasOwn(data, "slots") && typeof data.slots === "object") {
          return badRequest("Plaintext slots are not allowed. Slots must be encrypted.");
        }
        if (Object.hasOwn(data, "componentExport") && typeof data.componentExport === "string") {
          return badRequest(
            "Plaintext componentExport is not allowed. componentExport must be encrypted."
          );
        }
        return data;
      } catch (e) {
        if (e instanceof BodySizeLimitError) {
          return new Response(null, {
            status: 413,
            statusText: e.message
          });
        }
        if (e instanceof SyntaxError) {
          return badRequest("Request format is invalid.");
        }
        throw e;
      }
    }
    default: {
      return new Response(null, { status: 405 });
    }
  }
}
function createEndpoint(manifest2) {
  const page = async (result) => {
    const params = result.params;
    if (!params.name) {
      return new Response(null, {
        status: 400,
        statusText: "Bad request"
      });
    }
    const componentId = params.name;
    const data = await getRequestData(result.request, manifest2.serverIslandBodySizeLimit);
    if (data instanceof Response) {
      return data;
    }
    const serverIslandMappings = await manifest2.serverIslandMappings?.();
    const serverIslandMap = await serverIslandMappings?.serverIslandMap;
    let imp = serverIslandMap?.get(componentId);
    if (!imp) {
      return new Response(null, {
        status: 404,
        statusText: "Not found"
      });
    }
    const key = await manifest2.key;
    let componentExport;
    try {
      componentExport = await decryptString(
        key,
        data.encryptedComponentExport,
        `export:${componentId}`
      );
    } catch (_e) {
      return badRequest("Encrypted componentExport value is invalid.");
    }
    const encryptedProps = data.encryptedProps;
    let props = {};
    if (encryptedProps !== "") {
      try {
        const propString = await decryptString(key, encryptedProps, `props:${componentId}`);
        props = JSON.parse(propString);
      } catch (_e) {
        return badRequest("Encrypted props value is invalid.");
      }
    }
    let decryptedSlots = {};
    const encryptedSlots = data.encryptedSlots;
    if (encryptedSlots !== "") {
      try {
        const slotsString = await decryptString(key, encryptedSlots, `slots:${componentId}`);
        decryptedSlots = JSON.parse(slotsString);
      } catch (_e) {
        return badRequest("Encrypted slots value is invalid.");
      }
    }
    const componentModule = await imp();
    let Component = componentModule[componentExport];
    const slots = {};
    for (const prop in decryptedSlots) {
      slots[prop] = createSlotValueFromString(decryptedSlots[prop]);
    }
    result.response.headers.set("X-Robots-Tag", "noindex");
    if (isAstroComponentFactory(Component)) {
      const ServerIsland = Component;
      Component = function(...args) {
        return ServerIsland.apply(this, args);
      };
      Object.assign(Component, ServerIsland);
      Component.propagation = "self";
    }
    return renderTemplate`${renderComponent(result, "Component", Component, props, slots)}`;
  };
  page.isAstroComponentFactory = true;
  const instance = {
    default: page,
    partial: true
  };
  return instance;
}
function createDefaultRoutes(manifest2) {
  const root = new URL(manifest2.rootDir);
  return [
    {
      instance: default404Instance,
      matchesComponent: (filePath) => filePath.href === new URL(DEFAULT_404_COMPONENT, root).href,
      route: DEFAULT_404_ROUTE.route,
      component: DEFAULT_404_COMPONENT
    },
    {
      instance: createEndpoint(manifest2),
      matchesComponent: (filePath) => filePath.href === new URL(SERVER_ISLAND_COMPONENT, root).href,
      route: SERVER_ISLAND_ROUTE,
      component: SERVER_ISLAND_COMPONENT
    }
  ];
}
function deserializeManifest(serializedManifest, routesList) {
  const routes = [];
  if (serializedManifest.routes) {
    for (const serializedRoute of serializedManifest.routes) {
      routes.push({
        ...serializedRoute,
        routeData: deserializeRouteData(serializedRoute.routeData)
      });
      const route = serializedRoute;
      route.routeData = deserializeRouteData(serializedRoute.routeData);
    }
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const inlinedScripts = new Map(serializedManifest.inlinedScripts);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  const key = decodeKey(serializedManifest.key);
  return {
    // in case user middleware exists, this no-op middleware will be reassigned (see plugin-ssr.ts)
    middleware() {
      return { onRequest: NOOP_MIDDLEWARE_FN };
    },
    ...serializedManifest,
    rootDir: new URL(serializedManifest.rootDir),
    srcDir: new URL(serializedManifest.srcDir),
    publicDir: new URL(serializedManifest.publicDir),
    outDir: new URL(serializedManifest.outDir),
    cacheDir: new URL(serializedManifest.cacheDir),
    buildClientDir: new URL(serializedManifest.buildClientDir),
    buildServerDir: new URL(serializedManifest.buildServerDir),
    assets,
    componentMetadata,
    inlinedScripts,
    clientDirectives,
    routes,
    key
  };
}
function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    // nosemgrep: javascript.lang.security.audit.detect-non-literal-regexp.detect-non-literal-regexp
    // This pattern is serialized from Astro's own route manifest.
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    }),
    isIndex: rawRouteData.isIndex,
    origin: rawRouteData.origin,
    distURL: rawRouteData.distURL
  };
}
function deserializeRouteInfo(rawRouteInfo) {
  return {
    styles: rawRouteInfo.styles,
    file: rawRouteInfo.file,
    links: rawRouteInfo.links,
    scripts: rawRouteInfo.scripts,
    routeData: deserializeRouteData(rawRouteInfo.routeData)
  };
}
class NodePool {
  textPool = [];
  htmlStringPool = [];
  componentPool = [];
  instructionPool = [];
  maxSize;
  enableStats;
  stats = {
    acquireFromPool: 0,
    acquireNew: 0,
    released: 0,
    releasedDropped: 0
  };
  /**
   * Creates a new object pool for queue nodes.
   *
   * @param maxSize - Maximum number of nodes to keep in the pool (default: 1000).
   *   The cap is shared across all typed sub-pools.
   * @param enableStats - Enable statistics tracking (default: false for performance)
   */
  constructor(maxSize = 1e3, enableStats = false) {
    this.maxSize = maxSize;
    this.enableStats = enableStats;
  }
  /**
   * Acquires a queue node from the pool or creates a new one if the pool is empty.
   * Pops from the type-specific sub-pool to reuse an existing object when available.
   *
   * @param type - The type of queue node to acquire
   * @param content - Optional content to set on the node (for text or html-string types)
   * @returns A queue node ready to be populated with data
   */
  acquire(type, content) {
    const pooledNode = this.popFromTypedPool(type);
    if (pooledNode) {
      if (this.enableStats) {
        this.stats.acquireFromPool = this.stats.acquireFromPool + 1;
      }
      this.resetNodeContent(pooledNode, type, content);
      return pooledNode;
    }
    if (this.enableStats) {
      this.stats.acquireNew = this.stats.acquireNew + 1;
    }
    return this.createNode(type, content);
  }
  /**
   * Creates a new node of the specified type with the given content.
   * Helper method to reduce branching in acquire().
   */
  createNode(type, content = "") {
    switch (type) {
      case "text":
        return { type: "text", content };
      case "html-string":
        return { type: "html-string", html: content };
      case "component":
        return { type: "component", instance: void 0 };
      case "instruction":
        return { type: "instruction", instruction: void 0 };
    }
  }
  /**
   * Pops a node from the type-specific sub-pool.
   * Returns undefined if the sub-pool for the requested type is empty.
   */
  popFromTypedPool(type) {
    switch (type) {
      case "text":
        return this.textPool.pop();
      case "html-string":
        return this.htmlStringPool.pop();
      case "component":
        return this.componentPool.pop();
      case "instruction":
        return this.instructionPool.pop();
    }
  }
  /**
   * Resets the content/value field on a reused pooled node.
   * The type discriminant is already correct since we pop from the matching sub-pool.
   */
  resetNodeContent(node, type, content) {
    switch (type) {
      case "text":
        node.content = content ?? "";
        break;
      case "html-string":
        node.html = content ?? "";
        break;
      case "component":
        node.instance = void 0;
        break;
      case "instruction":
        node.instruction = void 0;
        break;
    }
  }
  /**
   * Returns the total number of nodes across all typed sub-pools.
   */
  totalPoolSize() {
    return this.textPool.length + this.htmlStringPool.length + this.componentPool.length + this.instructionPool.length;
  }
  /**
   * Releases a queue node back to the pool for reuse.
   * If the pool is at max capacity, the node is discarded (will be GC'd).
   *
   * @param node - The node to release back to the pool
   */
  release(node) {
    if (this.totalPoolSize() >= this.maxSize) {
      if (this.enableStats) {
        this.stats.releasedDropped = this.stats.releasedDropped + 1;
      }
      return;
    }
    switch (node.type) {
      case "text":
        node.content = "";
        this.textPool.push(node);
        break;
      case "html-string":
        node.html = "";
        this.htmlStringPool.push(node);
        break;
      case "component":
        node.instance = void 0;
        this.componentPool.push(node);
        break;
      case "instruction":
        node.instruction = void 0;
        this.instructionPool.push(node);
        break;
    }
    if (this.enableStats) {
      this.stats.released = this.stats.released + 1;
    }
  }
  /**
   * Releases all nodes in an array back to the pool.
   * This is a convenience method for releasing multiple nodes at once.
   *
   * @param nodes - Array of nodes to release
   */
  releaseAll(nodes) {
    for (const node of nodes) {
      this.release(node);
    }
  }
  /**
   * Clears all typed sub-pools, discarding all cached nodes.
   * This can be useful if you want to free memory after a large render.
   */
  clear() {
    this.textPool.length = 0;
    this.htmlStringPool.length = 0;
    this.componentPool.length = 0;
    this.instructionPool.length = 0;
  }
  /**
   * Gets the current total number of nodes across all typed sub-pools.
   * Useful for monitoring pool usage and tuning maxSize.
   *
   * @returns Number of nodes currently available in the pool
   */
  size() {
    return this.totalPoolSize();
  }
  /**
   * Gets pool statistics for debugging.
   *
   * @returns Pool usage statistics including computed metrics
   */
  getStats() {
    return {
      ...this.stats,
      poolSize: this.totalPoolSize(),
      maxSize: this.maxSize,
      hitRate: this.stats.acquireFromPool + this.stats.acquireNew > 0 ? this.stats.acquireFromPool / (this.stats.acquireFromPool + this.stats.acquireNew) * 100 : 0
    };
  }
  /**
   * Resets pool statistics.
   */
  resetStats() {
    this.stats = {
      acquireFromPool: 0,
      acquireNew: 0,
      released: 0,
      releasedDropped: 0
    };
  }
}
class HTMLStringCache {
  cache = /* @__PURE__ */ new Map();
  maxSize;
  constructor(maxSize = 1e3) {
    this.maxSize = maxSize;
    this.warm(COMMON_HTML_PATTERNS);
  }
  /**
   * Get or create an HTMLString for the given content.
   * If cached, the existing object is returned and moved to end (most recently used).
   * If not cached, a new HTMLString is created, cached, and returned.
   *
   * @param content - The HTML string content
   * @returns HTMLString object (cached or newly created)
   */
  getOrCreate(content) {
    const cached = this.cache.get(content);
    if (cached) {
      this.cache.delete(content);
      this.cache.set(content, cached);
      return cached;
    }
    const htmlString = new HTMLString(content);
    this.cache.set(content, htmlString);
    if (this.cache.size > this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey !== void 0) {
        this.cache.delete(firstKey);
      }
    }
    return htmlString;
  }
  /**
   * Get current cache size
   */
  size() {
    return this.cache.size;
  }
  /**
   * Pre-warms the cache with common HTML patterns.
   * This ensures first-render cache hits for frequently used tags.
   *
   * @param patterns - Array of HTML strings to pre-cache
   */
  warm(patterns) {
    for (const pattern of patterns) {
      if (!this.cache.has(pattern)) {
        this.cache.set(pattern, new HTMLString(pattern));
      }
    }
  }
  /**
   * Clear the entire cache
   */
  clear() {
    this.cache.clear();
  }
}
const COMMON_HTML_PATTERNS = [
  // Structural elements
  "<div>",
  "</div>",
  "<span>",
  "</span>",
  "<p>",
  "</p>",
  "<section>",
  "</section>",
  "<article>",
  "</article>",
  "<header>",
  "</header>",
  "<footer>",
  "</footer>",
  "<nav>",
  "</nav>",
  "<main>",
  "</main>",
  "<aside>",
  "</aside>",
  // List elements
  "<ul>",
  "</ul>",
  "<ol>",
  "</ol>",
  "<li>",
  "</li>",
  // Void/self-closing elements
  "<br>",
  "<hr>",
  "<br/>",
  "<hr/>",
  // Heading elements
  "<h1>",
  "</h1>",
  "<h2>",
  "</h2>",
  "<h3>",
  "</h3>",
  "<h4>",
  "</h4>",
  // Inline elements
  "<a>",
  "</a>",
  "<strong>",
  "</strong>",
  "<em>",
  "</em>",
  "<code>",
  "</code>",
  // Common whitespace
  " ",
  "\n"
];
const FORBIDDEN_PATH_KEYS = /* @__PURE__ */ new Set(["__proto__", "constructor", "prototype"]);
class Pipeline {
  internalMiddleware;
  resolvedMiddleware = void 0;
  resolvedActions = void 0;
  resolvedSessionDriver = void 0;
  resolvedCacheProvider = void 0;
  compiledCacheRoutes = void 0;
  nodePool;
  htmlStringCache;
  logger;
  manifest;
  /**
   * "development" or "production" only
   */
  runtimeMode;
  renderers;
  resolve;
  streaming;
  /**
   * Used to provide better error messages for `Astro.clientAddress`
   */
  adapterName;
  clientDirectives;
  inlinedScripts;
  compressHTML;
  i18n;
  middleware;
  routeCache;
  /**
   * Used for `Astro.site`.
   */
  site;
  /**
   * Array of built-in, internal, routes.
   * Used to find the route module
   */
  defaultRoutes;
  actions;
  sessionDriver;
  cacheProvider;
  cacheConfig;
  serverIslands;
  constructor(logger, manifest2, runtimeMode, renderers2, resolve, streaming, adapterName = manifest2.adapterName, clientDirectives = manifest2.clientDirectives, inlinedScripts = manifest2.inlinedScripts, compressHTML = manifest2.compressHTML, i18n = manifest2.i18n, middleware = manifest2.middleware, routeCache = new RouteCache(logger, runtimeMode), site = manifest2.site ? new URL(manifest2.site) : void 0, defaultRoutes = createDefaultRoutes(manifest2), actions = manifest2.actions, sessionDriver = manifest2.sessionDriver, cacheProvider = manifest2.cacheProvider, cacheConfig = manifest2.cacheConfig, serverIslands = manifest2.serverIslandMappings) {
    this.logger = logger;
    this.manifest = manifest2;
    this.runtimeMode = runtimeMode;
    this.renderers = renderers2;
    this.resolve = resolve;
    this.streaming = streaming;
    this.adapterName = adapterName;
    this.clientDirectives = clientDirectives;
    this.inlinedScripts = inlinedScripts;
    this.compressHTML = compressHTML;
    this.i18n = i18n;
    this.middleware = middleware;
    this.routeCache = routeCache;
    this.site = site;
    this.defaultRoutes = defaultRoutes;
    this.actions = actions;
    this.sessionDriver = sessionDriver;
    this.cacheProvider = cacheProvider;
    this.cacheConfig = cacheConfig;
    this.serverIslands = serverIslands;
    this.internalMiddleware = [];
    if (i18n?.strategy !== "manual") {
      this.internalMiddleware.push(
        createI18nMiddleware(i18n, manifest2.base, manifest2.trailingSlash, manifest2.buildFormat)
      );
    }
    if (manifest2.experimentalQueuedRendering.enabled) {
      this.nodePool = this.createNodePool(
        manifest2.experimentalQueuedRendering.poolSize ?? 1e3,
        false
      );
      if (manifest2.experimentalQueuedRendering.contentCache) {
        this.htmlStringCache = this.createStringCache();
      }
    }
  }
  /**
   * Resolves the middleware from the manifest, and returns the `onRequest` function. If `onRequest` isn't there,
   * it returns a no-op function
   */
  async getMiddleware() {
    if (this.resolvedMiddleware) {
      return this.resolvedMiddleware;
    }
    if (this.middleware) {
      const middlewareInstance = await this.middleware();
      const onRequest = middlewareInstance.onRequest ?? NOOP_MIDDLEWARE_FN;
      const internalMiddlewares = [onRequest];
      if (this.manifest.checkOrigin) {
        internalMiddlewares.unshift(createOriginCheckMiddleware());
      }
      this.resolvedMiddleware = sequence(...internalMiddlewares);
      return this.resolvedMiddleware;
    } else {
      this.resolvedMiddleware = NOOP_MIDDLEWARE_FN;
      return this.resolvedMiddleware;
    }
  }
  /**
   * Clears the cached middleware so it is re-resolved on the next request.
   * Called via HMR when middleware files change during development.
   */
  clearMiddleware() {
    this.resolvedMiddleware = void 0;
  }
  async getActions() {
    if (this.resolvedActions) {
      return this.resolvedActions;
    } else if (this.actions) {
      return this.actions();
    }
    return NOOP_ACTIONS_MOD;
  }
  async getSessionDriver() {
    if (this.resolvedSessionDriver !== void 0) {
      return this.resolvedSessionDriver;
    }
    if (this.sessionDriver) {
      const driverModule = await this.sessionDriver();
      this.resolvedSessionDriver = driverModule?.default || null;
      return this.resolvedSessionDriver;
    }
    this.resolvedSessionDriver = null;
    return null;
  }
  async getCacheProvider() {
    if (this.resolvedCacheProvider !== void 0) {
      return this.resolvedCacheProvider;
    }
    if (this.cacheProvider) {
      const mod = await this.cacheProvider();
      const factory = mod?.default || null;
      this.resolvedCacheProvider = factory ? factory(this.cacheConfig?.options) : null;
      return this.resolvedCacheProvider;
    }
    this.resolvedCacheProvider = null;
    return null;
  }
  async getServerIslands() {
    if (this.serverIslands) {
      return this.serverIslands();
    }
    return {
      serverIslandMap: /* @__PURE__ */ new Map(),
      serverIslandNameMap: /* @__PURE__ */ new Map()
    };
  }
  async getAction(path) {
    const pathKeys = path.split(".").map((key) => decodeURIComponent(key));
    let { server } = await this.getActions();
    if (!server || !(typeof server === "object")) {
      throw new TypeError(
        `Expected \`server\` export in actions file to be an object. Received ${typeof server}.`
      );
    }
    for (const key of pathKeys) {
      if (FORBIDDEN_PATH_KEYS.has(key)) {
        throw new AstroError({
          ...ActionNotFoundError,
          message: ActionNotFoundError.message(pathKeys.join("."))
        });
      }
      if (!Object.hasOwn(server, key)) {
        throw new AstroError({
          ...ActionNotFoundError,
          message: ActionNotFoundError.message(pathKeys.join("."))
        });
      }
      server = server[key];
    }
    if (typeof server !== "function") {
      throw new TypeError(
        `Expected handler for action ${pathKeys.join(".")} to be a function. Received ${typeof server}.`
      );
    }
    return server;
  }
  async getModuleForRoute(route) {
    for (const defaultRoute of this.defaultRoutes) {
      if (route.component === defaultRoute.component) {
        return {
          page: () => Promise.resolve(defaultRoute.instance)
        };
      }
    }
    if (route.type === "redirect") {
      return RedirectSinglePageBuiltModule;
    } else {
      if (this.manifest.pageMap) {
        const importComponentInstance = this.manifest.pageMap.get(route.component);
        if (!importComponentInstance) {
          throw new Error(
            `Unexpectedly unable to find a component instance for route ${route.route}`
          );
        }
        return await importComponentInstance();
      } else if (this.manifest.pageModule) {
        return this.manifest.pageModule;
      }
      throw new Error(
        "Astro couldn't find the correct page to render, probably because it wasn't correctly mapped for SSR usage. This is an internal error, please file an issue."
      );
    }
  }
  createNodePool(poolSize, stats) {
    return new NodePool(poolSize, stats);
  }
  createStringCache() {
    return new HTMLStringCache(1e3);
  }
}
function getFunctionExpression(slot) {
  if (!slot) return;
  const expressions = slot?.expressions?.filter((e) => isRenderInstruction(e) === false);
  if (expressions?.length !== 1) return;
  return expressions[0];
}
class Slots {
  #result;
  #slots;
  #logger;
  constructor(result, slots, logger) {
    this.#result = result;
    this.#slots = slots;
    this.#logger = logger;
    if (slots) {
      for (const key of Object.keys(slots)) {
        if (this[key] !== void 0) {
          throw new AstroError({
            ...ReservedSlotName,
            message: ReservedSlotName.message(key)
          });
        }
        Object.defineProperty(this, key, {
          get() {
            return true;
          },
          enumerable: true
        });
      }
    }
  }
  has(name) {
    if (!this.#slots) return false;
    return Boolean(this.#slots[name]);
  }
  async render(name, args = []) {
    if (!this.#slots || !this.has(name)) return;
    const result = this.#result;
    if (!Array.isArray(args)) {
      this.#logger.warn(
        null,
        `Expected second parameter to be an array, received a ${typeof args}. If you're trying to pass an array as a single argument and getting unexpected results, make sure you're passing your array as an item of an array. Ex: Astro.slots.render('default', [["Hello", "World"]])`
      );
    } else if (args.length > 0) {
      const slotValue = this.#slots[name];
      const component = typeof slotValue === "function" ? await slotValue(result) : await slotValue;
      const expression = getFunctionExpression(component);
      if (expression) {
        const slot = async () => typeof expression === "function" ? expression(...args) : expression;
        return await renderSlotToString(result, slot).then((res) => {
          return res;
        });
      }
      if (typeof component === "function") {
        return await renderJSX(result, component(...args)).then(
          (res) => res != null ? String(res) : res
        );
      }
    }
    const content = await renderSlotToString(result, this.#slots[name]);
    const outHTML = chunkToString(result, content);
    return outHTML;
  }
}
function isExternalURL(url) {
  return url.startsWith("http://") || url.startsWith("https://") || url.startsWith("//");
}
function redirectIsExternal(redirect) {
  if (typeof redirect === "string") {
    return isExternalURL(redirect);
  } else {
    return isExternalURL(redirect.destination);
  }
}
function computeRedirectStatus(method, redirect, redirectRoute) {
  return redirectRoute && typeof redirect === "object" ? redirect.status : method === "GET" ? 301 : 308;
}
function resolveRedirectTarget(params, redirect, redirectRoute, trailingSlash) {
  if (typeof redirectRoute !== "undefined") {
    const generate = getRouteGenerator(redirectRoute.segments, trailingSlash);
    return generate(params);
  } else if (typeof redirect === "string") {
    if (redirectIsExternal(redirect)) {
      return redirect;
    } else {
      let target = redirect;
      for (const param of Object.keys(params)) {
        const paramValue = params[param];
        target = target.replace(`[${param}]`, paramValue).replace(`[...${param}]`, paramValue);
      }
      return target;
    }
  } else if (typeof redirect === "undefined") {
    return "/";
  }
  return redirect.destination;
}
async function renderRedirect(renderContext) {
  const {
    request: { method },
    routeData
  } = renderContext;
  const { redirect, redirectRoute } = routeData;
  const status = computeRedirectStatus(method, redirect, redirectRoute);
  const headers = {
    location: encodeURI(
      resolveRedirectTarget(
        renderContext.params,
        redirect,
        redirectRoute,
        renderContext.pipeline.manifest.trailingSlash
      )
    )
  };
  if (redirect && redirectIsExternal(redirect)) {
    if (typeof redirect === "string") {
      return Response.redirect(redirect, status);
    } else {
      return Response.redirect(redirect.destination, status);
    }
  }
  return new Response(null, { status, headers });
}
function matchRoute(pathname, manifest2) {
  if (isRoute404(pathname)) {
    const errorRoute = manifest2.routes.find((route) => isRoute404(route.route));
    if (errorRoute) return errorRoute;
  }
  if (isRoute500(pathname)) {
    const errorRoute = manifest2.routes.find((route) => isRoute500(route.route));
    if (errorRoute) return errorRoute;
  }
  return manifest2.routes.find((route) => {
    return route.pattern.test(pathname) || route.fallbackRoutes.some((fallbackRoute) => fallbackRoute.pattern.test(pathname));
  });
}
function isRoute404or500(route) {
  return isRoute404(route.route) || isRoute500(route.route);
}
function isRouteServerIsland(route) {
  return route.component === SERVER_ISLAND_COMPONENT;
}
function isRouteExternalRedirect(route) {
  return !!(route.type === "redirect" && route.redirect && redirectIsExternal(route.redirect));
}
function defaultSetHeaders(options) {
  const headers = new Headers();
  const directives = [];
  if (options.maxAge !== void 0) {
    directives.push(`max-age=${options.maxAge}`);
  }
  if (options.swr !== void 0) {
    directives.push(`stale-while-revalidate=${options.swr}`);
  }
  if (directives.length > 0) {
    headers.set("CDN-Cache-Control", directives.join(", "));
  }
  if (options.tags && options.tags.length > 0) {
    headers.set("Cache-Tag", options.tags.join(", "));
  }
  if (options.lastModified) {
    headers.set("Last-Modified", options.lastModified.toUTCString());
  }
  if (options.etag) {
    headers.set("ETag", options.etag);
  }
  return headers;
}
function isLiveDataEntry(value) {
  return value != null && typeof value === "object" && "id" in value && "data" in value && "cacheHint" in value;
}
const APPLY_HEADERS = /* @__PURE__ */ Symbol.for("astro:cache:apply");
const IS_ACTIVE = /* @__PURE__ */ Symbol.for("astro:cache:active");
class AstroCache {
  #options = {};
  #tags = /* @__PURE__ */ new Set();
  #disabled = false;
  #provider;
  enabled = true;
  constructor(provider) {
    this.#provider = provider;
  }
  set(input) {
    if (input === false) {
      this.#disabled = true;
      this.#tags.clear();
      this.#options = {};
      return;
    }
    this.#disabled = false;
    let options;
    if (isLiveDataEntry(input)) {
      if (!input.cacheHint) return;
      options = input.cacheHint;
    } else {
      options = input;
    }
    if ("maxAge" in options && options.maxAge !== void 0) this.#options.maxAge = options.maxAge;
    if ("swr" in options && options.swr !== void 0)
      this.#options.swr = options.swr;
    if ("etag" in options && options.etag !== void 0)
      this.#options.etag = options.etag;
    if (options.lastModified !== void 0) {
      if (!this.#options.lastModified || options.lastModified > this.#options.lastModified) {
        this.#options.lastModified = options.lastModified;
      }
    }
    if (options.tags) {
      for (const tag of options.tags) this.#tags.add(tag);
    }
  }
  get tags() {
    return [...this.#tags];
  }
  /**
   * Get the current cache options (read-only snapshot).
   * Includes all accumulated options: maxAge, swr, tags, etag, lastModified.
   */
  get options() {
    return {
      ...this.#options,
      tags: this.tags
    };
  }
  async invalidate(input) {
    if (!this.#provider) {
      throw new AstroError(CacheNotEnabled);
    }
    let options;
    if (isLiveDataEntry(input)) {
      options = { tags: input.cacheHint?.tags ?? [] };
    } else {
      options = input;
    }
    return this.#provider.invalidate(options);
  }
  /** @internal */
  [APPLY_HEADERS](response) {
    if (this.#disabled) return;
    const finalOptions = { ...this.#options, tags: this.tags };
    if (finalOptions.maxAge === void 0 && !finalOptions.tags?.length) return;
    const headers = this.#provider?.setHeaders?.(finalOptions) ?? defaultSetHeaders(finalOptions);
    for (const [key, value] of headers) {
      response.headers.set(key, value);
    }
  }
  /** @internal */
  get [IS_ACTIVE]() {
    return !this.#disabled && (this.#options.maxAge !== void 0 || this.#tags.size > 0);
  }
}
function applyCacheHeaders(cache, response) {
  if (APPLY_HEADERS in cache) {
    cache[APPLY_HEADERS](response);
  }
}
const ROUTE_DYNAMIC_SPLIT = /\[(.+?\(.+?\)|.+?)\]/;
const ROUTE_SPREAD = /^\.{3}.+$/;
function getParts(part, file) {
  const result = [];
  part.split(ROUTE_DYNAMIC_SPLIT).map((str, i) => {
    if (!str) return;
    const dynamic = i % 2 === 1;
    const [, content] = dynamic ? /([^(]+)$/.exec(str) || [null, null] : [null, str];
    if (!content || dynamic && !/^(?:\.\.\.)?[\w$]+$/.test(content)) {
      throw new Error(`Invalid route ${file} — parameter name must match /^[a-zA-Z0-9_$]+$/`);
    }
    result.push({
      content,
      dynamic,
      spread: dynamic && ROUTE_SPREAD.test(content)
    });
  });
  return result;
}
function routeComparator(a, b) {
  const commonLength = Math.min(a.segments.length, b.segments.length);
  for (let index = 0; index < commonLength; index++) {
    const aSegment = a.segments[index];
    const bSegment = b.segments[index];
    const aIsStatic = aSegment.every((part) => !part.dynamic && !part.spread);
    const bIsStatic = bSegment.every((part) => !part.dynamic && !part.spread);
    if (aIsStatic && bIsStatic) {
      const aContent = aSegment.map((part) => part.content).join("");
      const bContent = bSegment.map((part) => part.content).join("");
      if (aContent !== bContent) {
        return aContent.localeCompare(bContent);
      }
    }
    if (aIsStatic !== bIsStatic) {
      return aIsStatic ? -1 : 1;
    }
    const aAllDynamic = aSegment.every((part) => part.dynamic);
    const bAllDynamic = bSegment.every((part) => part.dynamic);
    if (aAllDynamic !== bAllDynamic) {
      return aAllDynamic ? 1 : -1;
    }
    const aHasSpread = aSegment.some((part) => part.spread);
    const bHasSpread = bSegment.some((part) => part.spread);
    if (aHasSpread !== bHasSpread) {
      return aHasSpread ? 1 : -1;
    }
  }
  const aLength = a.segments.length;
  const bLength = b.segments.length;
  if (aLength !== bLength) {
    const aEndsInRest = a.segments.at(-1)?.some((part) => part.spread);
    const bEndsInRest = b.segments.at(-1)?.some((part) => part.spread);
    if (aEndsInRest !== bEndsInRest && Math.abs(aLength - bLength) === 1) {
      if (aLength > bLength && aEndsInRest) {
        return 1;
      }
      if (bLength > aLength && bEndsInRest) {
        return -1;
      }
    }
    return aLength > bLength ? -1 : 1;
  }
  if (a.type === "endpoint" !== (b.type === "endpoint")) {
    return a.type === "endpoint" ? -1 : 1;
  }
  return a.route.localeCompare(b.route);
}
function compileCacheRoutes(routes, base, trailingSlash) {
  const compiled = Object.entries(routes).map(([path, options]) => {
    const segments = removeLeadingForwardSlash(path).split("/").filter(Boolean).map((s2) => getParts(s2, path));
    const pattern = getPattern(segments, base, trailingSlash);
    return { pattern, options, segments, route: path };
  });
  compiled.sort(
    (a, b) => routeComparator(
      { segments: a.segments, route: a.route, type: "page" },
      { segments: b.segments, route: b.route, type: "page" }
    )
  );
  return compiled;
}
function matchCacheRoute(pathname, compiledRoutes) {
  for (const route of compiledRoutes) {
    if (route.pattern.test(pathname)) return route.options;
  }
  return null;
}
const suspectProtoRx = /"(?:_|\\u0{2}5[Ff]){2}(?:p|\\u0{2}70)(?:r|\\u0{2}72)(?:o|\\u0{2}6[Ff])(?:t|\\u0{2}74)(?:o|\\u0{2}6[Ff])(?:_|\\u0{2}5[Ff]){2}"\s*:/;
const suspectConstructorRx = /"(?:c|\\u0063)(?:o|\\u006[Ff])(?:n|\\u006[Ee])(?:s|\\u0073)(?:t|\\u0074)(?:r|\\u0072)(?:u|\\u0075)(?:c|\\u0063)(?:t|\\u0074)(?:o|\\u006[Ff])(?:r|\\u0072)"\s*:/;
const JsonSigRx = /^\s*["[{]|^\s*-?\d{1,16}(\.\d{1,17})?([Ee][+-]?\d+)?\s*$/;
function jsonParseTransform(key, value) {
  if (key === "__proto__" || key === "constructor" && value && typeof value === "object" && "prototype" in value) {
    warnKeyDropped(key);
    return;
  }
  return value;
}
function warnKeyDropped(key) {
  console.warn(`[destr] Dropping "${key}" key to prevent prototype pollution.`);
}
function destr(value, options = {}) {
  if (typeof value !== "string") {
    return value;
  }
  if (value[0] === '"' && value[value.length - 1] === '"' && value.indexOf("\\") === -1) {
    return value.slice(1, -1);
  }
  const _value = value.trim();
  if (_value.length <= 9) {
    switch (_value.toLowerCase()) {
      case "true": {
        return true;
      }
      case "false": {
        return false;
      }
      case "undefined": {
        return void 0;
      }
      case "null": {
        return null;
      }
      case "nan": {
        return Number.NaN;
      }
      case "infinity": {
        return Number.POSITIVE_INFINITY;
      }
      case "-infinity": {
        return Number.NEGATIVE_INFINITY;
      }
    }
  }
  if (!JsonSigRx.test(value)) {
    if (options.strict) {
      throw new SyntaxError("[destr] Invalid JSON");
    }
    return value;
  }
  try {
    if (suspectProtoRx.test(value) || suspectConstructorRx.test(value)) {
      if (options.strict) {
        throw new Error("[destr] Possible prototype pollution");
      }
      return JSON.parse(value, jsonParseTransform);
    }
    return JSON.parse(value);
  } catch (error2) {
    if (options.strict) {
      throw error2;
    }
    return value;
  }
}
function wrapToPromise(value) {
  if (!value || typeof value.then !== "function") {
    return Promise.resolve(value);
  }
  return value;
}
function asyncCall(function_, ...arguments_) {
  try {
    return wrapToPromise(function_(...arguments_));
  } catch (error2) {
    return Promise.reject(error2);
  }
}
function isPrimitive(value) {
  const type = typeof value;
  return value === null || type !== "object" && type !== "function";
}
function isPureObject(value) {
  const proto = Object.getPrototypeOf(value);
  return !proto || proto.isPrototypeOf(Object);
}
function stringify$1(value) {
  if (isPrimitive(value)) {
    return String(value);
  }
  if (isPureObject(value) || Array.isArray(value)) {
    return JSON.stringify(value);
  }
  if (typeof value.toJSON === "function") {
    return stringify$1(value.toJSON());
  }
  throw new Error("[unstorage] Cannot stringify value!");
}
const BASE64_PREFIX = "base64:";
function serializeRaw(value) {
  if (typeof value === "string") {
    return value;
  }
  return BASE64_PREFIX + base64Encode(value);
}
function deserializeRaw(value) {
  if (typeof value !== "string") {
    return value;
  }
  if (!value.startsWith(BASE64_PREFIX)) {
    return value;
  }
  return base64Decode(value.slice(BASE64_PREFIX.length));
}
function base64Decode(input) {
  if (globalThis.Buffer) {
    return Buffer.from(input, "base64");
  }
  return Uint8Array.from(
    globalThis.atob(input),
    (c) => c.codePointAt(0)
  );
}
function base64Encode(input) {
  if (globalThis.Buffer) {
    return Buffer.from(input).toString("base64");
  }
  return globalThis.btoa(String.fromCodePoint(...input));
}
function normalizeKey(key) {
  if (!key) {
    return "";
  }
  return key.split("?")[0]?.replace(/[/\\]/g, ":").replace(/:+/g, ":").replace(/^:|:$/g, "") || "";
}
function joinKeys(...keys) {
  return normalizeKey(keys.join(":"));
}
function normalizeBaseKey(base) {
  base = normalizeKey(base);
  return base ? base + ":" : "";
}
function filterKeyByDepth(key, depth) {
  if (depth === void 0) {
    return true;
  }
  let substrCount = 0;
  let index = key.indexOf(":");
  while (index > -1) {
    substrCount++;
    index = key.indexOf(":", index + 1);
  }
  return substrCount <= depth;
}
function filterKeyByBase(key, base) {
  if (base) {
    return key.startsWith(base) && key[key.length - 1] !== "$";
  }
  return key[key.length - 1] !== "$";
}
function defineDriver(factory) {
  return factory;
}
const DRIVER_NAME = "memory";
const memory = defineDriver(() => {
  const data = /* @__PURE__ */ new Map();
  return {
    name: DRIVER_NAME,
    getInstance: () => data,
    hasItem(key) {
      return data.has(key);
    },
    getItem(key) {
      return data.get(key) ?? null;
    },
    getItemRaw(key) {
      return data.get(key) ?? null;
    },
    setItem(key, value) {
      data.set(key, value);
    },
    setItemRaw(key, value) {
      data.set(key, value);
    },
    removeItem(key) {
      data.delete(key);
    },
    getKeys() {
      return [...data.keys()];
    },
    clear() {
      data.clear();
    },
    dispose() {
      data.clear();
    }
  };
});
function createStorage(options = {}) {
  const context = {
    mounts: { "": options.driver || memory() },
    mountpoints: [""],
    watching: false,
    watchListeners: [],
    unwatch: {}
  };
  const getMount = (key) => {
    for (const base of context.mountpoints) {
      if (key.startsWith(base)) {
        return {
          base,
          relativeKey: key.slice(base.length),
          driver: context.mounts[base]
        };
      }
    }
    return {
      base: "",
      relativeKey: key,
      driver: context.mounts[""]
    };
  };
  const getMounts = (base, includeParent) => {
    return context.mountpoints.filter(
      (mountpoint) => mountpoint.startsWith(base) || includeParent && base.startsWith(mountpoint)
    ).map((mountpoint) => ({
      relativeBase: base.length > mountpoint.length ? base.slice(mountpoint.length) : void 0,
      mountpoint,
      driver: context.mounts[mountpoint]
    }));
  };
  const onChange = (event, key) => {
    if (!context.watching) {
      return;
    }
    key = normalizeKey(key);
    for (const listener of context.watchListeners) {
      listener(event, key);
    }
  };
  const startWatch = async () => {
    if (context.watching) {
      return;
    }
    context.watching = true;
    for (const mountpoint in context.mounts) {
      context.unwatch[mountpoint] = await watch(
        context.mounts[mountpoint],
        onChange,
        mountpoint
      );
    }
  };
  const stopWatch = async () => {
    if (!context.watching) {
      return;
    }
    for (const mountpoint in context.unwatch) {
      await context.unwatch[mountpoint]();
    }
    context.unwatch = {};
    context.watching = false;
  };
  const runBatch = (items, commonOptions, cb) => {
    const batches = /* @__PURE__ */ new Map();
    const getBatch = (mount) => {
      let batch = batches.get(mount.base);
      if (!batch) {
        batch = {
          driver: mount.driver,
          base: mount.base,
          items: []
        };
        batches.set(mount.base, batch);
      }
      return batch;
    };
    for (const item of items) {
      const isStringItem = typeof item === "string";
      const key = normalizeKey(isStringItem ? item : item.key);
      const value = isStringItem ? void 0 : item.value;
      const options2 = isStringItem || !item.options ? commonOptions : { ...commonOptions, ...item.options };
      const mount = getMount(key);
      getBatch(mount).items.push({
        key,
        value,
        relativeKey: mount.relativeKey,
        options: options2
      });
    }
    return Promise.all([...batches.values()].map((batch) => cb(batch))).then(
      (r) => r.flat()
    );
  };
  const storage = {
    // Item
    hasItem(key, opts = {}) {
      key = normalizeKey(key);
      const { relativeKey, driver } = getMount(key);
      return asyncCall(driver.hasItem, relativeKey, opts);
    },
    getItem(key, opts = {}) {
      key = normalizeKey(key);
      const { relativeKey, driver } = getMount(key);
      return asyncCall(driver.getItem, relativeKey, opts).then(
        (value) => destr(value)
      );
    },
    getItems(items, commonOptions = {}) {
      return runBatch(items, commonOptions, (batch) => {
        if (batch.driver.getItems) {
          return asyncCall(
            batch.driver.getItems,
            batch.items.map((item) => ({
              key: item.relativeKey,
              options: item.options
            })),
            commonOptions
          ).then(
            (r) => r.map((item) => ({
              key: joinKeys(batch.base, item.key),
              value: destr(item.value)
            }))
          );
        }
        return Promise.all(
          batch.items.map((item) => {
            return asyncCall(
              batch.driver.getItem,
              item.relativeKey,
              item.options
            ).then((value) => ({
              key: item.key,
              value: destr(value)
            }));
          })
        );
      });
    },
    getItemRaw(key, opts = {}) {
      key = normalizeKey(key);
      const { relativeKey, driver } = getMount(key);
      if (driver.getItemRaw) {
        return asyncCall(driver.getItemRaw, relativeKey, opts);
      }
      return asyncCall(driver.getItem, relativeKey, opts).then(
        (value) => deserializeRaw(value)
      );
    },
    async setItem(key, value, opts = {}) {
      if (value === void 0) {
        return storage.removeItem(key);
      }
      key = normalizeKey(key);
      const { relativeKey, driver } = getMount(key);
      if (!driver.setItem) {
        return;
      }
      await asyncCall(driver.setItem, relativeKey, stringify$1(value), opts);
      if (!driver.watch) {
        onChange("update", key);
      }
    },
    async setItems(items, commonOptions) {
      await runBatch(items, commonOptions, async (batch) => {
        if (batch.driver.setItems) {
          return asyncCall(
            batch.driver.setItems,
            batch.items.map((item) => ({
              key: item.relativeKey,
              value: stringify$1(item.value),
              options: item.options
            })),
            commonOptions
          );
        }
        if (!batch.driver.setItem) {
          return;
        }
        await Promise.all(
          batch.items.map((item) => {
            return asyncCall(
              batch.driver.setItem,
              item.relativeKey,
              stringify$1(item.value),
              item.options
            );
          })
        );
      });
    },
    async setItemRaw(key, value, opts = {}) {
      if (value === void 0) {
        return storage.removeItem(key, opts);
      }
      key = normalizeKey(key);
      const { relativeKey, driver } = getMount(key);
      if (driver.setItemRaw) {
        await asyncCall(driver.setItemRaw, relativeKey, value, opts);
      } else if (driver.setItem) {
        await asyncCall(driver.setItem, relativeKey, serializeRaw(value), opts);
      } else {
        return;
      }
      if (!driver.watch) {
        onChange("update", key);
      }
    },
    async removeItem(key, opts = {}) {
      if (typeof opts === "boolean") {
        opts = { removeMeta: opts };
      }
      key = normalizeKey(key);
      const { relativeKey, driver } = getMount(key);
      if (!driver.removeItem) {
        return;
      }
      await asyncCall(driver.removeItem, relativeKey, opts);
      if (opts.removeMeta || opts.removeMata) {
        await asyncCall(driver.removeItem, relativeKey + "$", opts);
      }
      if (!driver.watch) {
        onChange("remove", key);
      }
    },
    // Meta
    async getMeta(key, opts = {}) {
      if (typeof opts === "boolean") {
        opts = { nativeOnly: opts };
      }
      key = normalizeKey(key);
      const { relativeKey, driver } = getMount(key);
      const meta = /* @__PURE__ */ Object.create(null);
      if (driver.getMeta) {
        Object.assign(meta, await asyncCall(driver.getMeta, relativeKey, opts));
      }
      if (!opts.nativeOnly) {
        const value = await asyncCall(
          driver.getItem,
          relativeKey + "$",
          opts
        ).then((value_) => destr(value_));
        if (value && typeof value === "object") {
          if (typeof value.atime === "string") {
            value.atime = new Date(value.atime);
          }
          if (typeof value.mtime === "string") {
            value.mtime = new Date(value.mtime);
          }
          Object.assign(meta, value);
        }
      }
      return meta;
    },
    setMeta(key, value, opts = {}) {
      return this.setItem(key + "$", value, opts);
    },
    removeMeta(key, opts = {}) {
      return this.removeItem(key + "$", opts);
    },
    // Keys
    async getKeys(base, opts = {}) {
      base = normalizeBaseKey(base);
      const mounts = getMounts(base, true);
      let maskedMounts = [];
      const allKeys = [];
      let allMountsSupportMaxDepth = true;
      for (const mount of mounts) {
        if (!mount.driver.flags?.maxDepth) {
          allMountsSupportMaxDepth = false;
        }
        const rawKeys = await asyncCall(
          mount.driver.getKeys,
          mount.relativeBase,
          opts
        );
        for (const key of rawKeys) {
          const fullKey = mount.mountpoint + normalizeKey(key);
          if (!maskedMounts.some((p) => fullKey.startsWith(p))) {
            allKeys.push(fullKey);
          }
        }
        maskedMounts = [
          mount.mountpoint,
          ...maskedMounts.filter((p) => !p.startsWith(mount.mountpoint))
        ];
      }
      const shouldFilterByDepth = opts.maxDepth !== void 0 && !allMountsSupportMaxDepth;
      return allKeys.filter(
        (key) => (!shouldFilterByDepth || filterKeyByDepth(key, opts.maxDepth)) && filterKeyByBase(key, base)
      );
    },
    // Utils
    async clear(base, opts = {}) {
      base = normalizeBaseKey(base);
      await Promise.all(
        getMounts(base, false).map(async (m) => {
          if (m.driver.clear) {
            return asyncCall(m.driver.clear, m.relativeBase, opts);
          }
          if (m.driver.removeItem) {
            const keys = await m.driver.getKeys(m.relativeBase || "", opts);
            return Promise.all(
              keys.map((key) => m.driver.removeItem(key, opts))
            );
          }
        })
      );
    },
    async dispose() {
      await Promise.all(
        Object.values(context.mounts).map((driver) => dispose(driver))
      );
    },
    async watch(callback) {
      await startWatch();
      context.watchListeners.push(callback);
      return async () => {
        context.watchListeners = context.watchListeners.filter(
          (listener) => listener !== callback
        );
        if (context.watchListeners.length === 0) {
          await stopWatch();
        }
      };
    },
    async unwatch() {
      context.watchListeners = [];
      await stopWatch();
    },
    // Mount
    mount(base, driver) {
      base = normalizeBaseKey(base);
      if (base && context.mounts[base]) {
        throw new Error(`already mounted at ${base}`);
      }
      if (base) {
        context.mountpoints.push(base);
        context.mountpoints.sort((a, b) => b.length - a.length);
      }
      context.mounts[base] = driver;
      if (context.watching) {
        Promise.resolve(watch(driver, onChange, base)).then((unwatcher) => {
          context.unwatch[base] = unwatcher;
        }).catch(console.error);
      }
      return storage;
    },
    async unmount(base, _dispose = true) {
      base = normalizeBaseKey(base);
      if (!base || !context.mounts[base]) {
        return;
      }
      if (context.watching && base in context.unwatch) {
        context.unwatch[base]?.();
        delete context.unwatch[base];
      }
      if (_dispose) {
        await dispose(context.mounts[base]);
      }
      context.mountpoints = context.mountpoints.filter((key) => key !== base);
      delete context.mounts[base];
    },
    getMount(key = "") {
      key = normalizeKey(key) + ":";
      const m = getMount(key);
      return {
        driver: m.driver,
        base: m.base
      };
    },
    getMounts(base = "", opts = {}) {
      base = normalizeKey(base);
      const mounts = getMounts(base, opts.parents);
      return mounts.map((m) => ({
        driver: m.driver,
        base: m.mountpoint
      }));
    },
    // Aliases
    keys: (base, opts = {}) => storage.getKeys(base, opts),
    get: (key, opts = {}) => storage.getItem(key, opts),
    set: (key, value, opts = {}) => storage.setItem(key, value, opts),
    has: (key, opts = {}) => storage.hasItem(key, opts),
    del: (key, opts = {}) => storage.removeItem(key, opts),
    remove: (key, opts = {}) => storage.removeItem(key, opts)
  };
  return storage;
}
function watch(driver, onChange, base) {
  return driver.watch ? driver.watch((event, key) => onChange(event, base + key)) : () => {
  };
}
async function dispose(driver) {
  if (typeof driver.dispose === "function") {
    await asyncCall(driver.dispose);
  }
}
const PERSIST_SYMBOL = /* @__PURE__ */ Symbol();
const DEFAULT_COOKIE_NAME = "astro-session";
const VALID_COOKIE_REGEX = /^[\w-]+$/;
const unflatten = (parsed, _) => {
  return unflatten$1(parsed, {
    URL: (href) => new URL(href)
  });
};
const stringify = (data, _) => {
  return stringify$2(data, {
    // Support URL objects
    URL: (val) => val instanceof URL && val.href
  });
};
class AstroSession {
  // The cookies object.
  #cookies;
  // The session configuration.
  #config;
  // The cookie config
  #cookieConfig;
  // The cookie name
  #cookieName;
  // The unstorage object for the session driver.
  #storage;
  #data;
  // The session ID. A v4 UUID.
  #sessionID;
  // Sessions to destroy. Needed because we won't have the old session ID after it's destroyed locally.
  #toDestroy = /* @__PURE__ */ new Set();
  // Session keys to delete. Used for partial data sets to avoid overwriting the deleted value.
  #toDelete = /* @__PURE__ */ new Set();
  // Whether the session is dirty and needs to be saved.
  #dirty = false;
  // Whether the session cookie has been set.
  #cookieSet = false;
  // Whether the session ID was sourced from a client cookie rather than freshly generated.
  #sessionIDFromCookie = false;
  // The local data is "partial" if it has not been loaded from storage yet and only
  // contains values that have been set or deleted in-memory locally.
  // We do this to avoid the need to block on loading data when it is only being set.
  // When we load the data from storage, we need to merge it with the local partial data,
  // preserving in-memory changes and deletions.
  #partial = true;
  // The driver factory function provided by the pipeline
  #driverFactory;
  static #sharedStorage = /* @__PURE__ */ new Map();
  constructor({
    cookies,
    config: config2,
    runtimeMode,
    driverFactory,
    mockStorage
  }) {
    if (!config2) {
      throw new AstroError({
        ...SessionStorageInitError,
        message: SessionStorageInitError.message(
          "No driver was defined in the session configuration and the adapter did not provide a default driver."
        )
      });
    }
    this.#cookies = cookies;
    this.#driverFactory = driverFactory;
    const { cookie: cookieConfig = DEFAULT_COOKIE_NAME, ...configRest } = config2;
    let cookieConfigObject;
    if (typeof cookieConfig === "object") {
      const { name = DEFAULT_COOKIE_NAME, ...rest } = cookieConfig;
      this.#cookieName = name;
      cookieConfigObject = rest;
    } else {
      this.#cookieName = cookieConfig || DEFAULT_COOKIE_NAME;
    }
    this.#cookieConfig = {
      sameSite: "lax",
      secure: runtimeMode === "production",
      path: "/",
      ...cookieConfigObject,
      httpOnly: true
    };
    this.#config = configRest;
    if (mockStorage) {
      this.#storage = mockStorage;
    }
  }
  /**
   * Gets a session value. Returns `undefined` if the session or value does not exist.
   */
  async get(key) {
    return (await this.#ensureData()).get(key)?.data;
  }
  /**
   * Checks if a session value exists.
   */
  async has(key) {
    return (await this.#ensureData()).has(key);
  }
  /**
   * Gets all session values.
   */
  async keys() {
    return (await this.#ensureData()).keys();
  }
  /**
   * Gets all session values.
   */
  async values() {
    return [...(await this.#ensureData()).values()].map((entry) => entry.data);
  }
  /**
   * Gets all session entries.
   */
  async entries() {
    return [...(await this.#ensureData()).entries()].map(([key, entry]) => [key, entry.data]);
  }
  /**
   * Deletes a session value.
   */
  delete(key) {
    this.#data?.delete(key);
    if (this.#partial) {
      this.#toDelete.add(key);
    }
    this.#dirty = true;
  }
  /**
   * Sets a session value. The session is created if it does not exist.
   */
  set(key, value, { ttl } = {}) {
    if (!key) {
      throw new AstroError({
        ...SessionStorageSaveError,
        message: "The session key was not provided."
      });
    }
    let cloned;
    try {
      cloned = unflatten(JSON.parse(stringify(value)));
    } catch (err) {
      throw new AstroError(
        {
          ...SessionStorageSaveError,
          message: `The session data for ${key} could not be serialized.`,
          hint: "See the devalue library for all supported types: https://github.com/rich-harris/devalue"
        },
        { cause: err }
      );
    }
    if (!this.#cookieSet) {
      this.#setCookie();
      this.#cookieSet = true;
    }
    this.#data ??= /* @__PURE__ */ new Map();
    const lifetime = ttl ?? this.#config.ttl;
    const expires = typeof lifetime === "number" ? Date.now() + lifetime * 1e3 : lifetime;
    this.#data.set(key, {
      data: cloned,
      expires
    });
    this.#dirty = true;
  }
  /**
   * Destroys the session, clearing the cookie and storage if it exists.
   */
  destroy() {
    const sessionId = this.#sessionID ?? this.#cookies.get(this.#cookieName)?.value;
    if (sessionId) {
      this.#toDestroy.add(sessionId);
    }
    this.#cookies.delete(this.#cookieName, this.#cookieConfig);
    this.#sessionID = void 0;
    this.#data = void 0;
    this.#dirty = true;
  }
  /**
   * Regenerates the session, creating a new session ID. The existing session data is preserved.
   */
  async regenerate() {
    let data = /* @__PURE__ */ new Map();
    try {
      data = await this.#ensureData();
    } catch (err) {
      console.error("Failed to load session data during regeneration:", err);
    }
    const oldSessionId = this.#sessionID;
    this.#sessionID = crypto.randomUUID();
    this.#sessionIDFromCookie = false;
    this.#data = data;
    this.#dirty = true;
    await this.#setCookie();
    if (oldSessionId && this.#storage) {
      this.#storage.removeItem(oldSessionId).catch((err) => {
        console.error("Failed to remove old session data:", err);
      });
    }
  }
  // Persists the session data to storage.
  // This is called automatically at the end of the request.
  // Uses a symbol to prevent users from calling it directly.
  async [PERSIST_SYMBOL]() {
    if (!this.#dirty && !this.#toDestroy.size) {
      return;
    }
    const storage = await this.#ensureStorage();
    if (this.#dirty && this.#data) {
      const data = await this.#ensureData();
      this.#toDelete.forEach((key2) => data.delete(key2));
      const key = this.#ensureSessionID();
      let serialized;
      try {
        serialized = stringify(data);
      } catch (err) {
        throw new AstroError(
          {
            ...SessionStorageSaveError,
            message: SessionStorageSaveError.message(
              "The session data could not be serialized.",
              this.#config.driver
            )
          },
          { cause: err }
        );
      }
      await storage.setItem(key, serialized);
      this.#dirty = false;
    }
    if (this.#toDestroy.size > 0) {
      const cleanupPromises = [...this.#toDestroy].map(
        (sessionId) => storage.removeItem(sessionId).catch((err) => {
          console.error("Failed to clean up session %s:", sessionId, err);
        })
      );
      await Promise.all(cleanupPromises);
      this.#toDestroy.clear();
    }
  }
  get sessionID() {
    return this.#sessionID;
  }
  /**
   * Loads a session from storage with the given ID, and replaces the current session.
   * Any changes made to the current session will be lost.
   * This is not normally needed, as the session is automatically loaded using the cookie.
   * However it can be used to restore a session where the ID has been recorded somewhere
   * else (e.g. in a database).
   */
  async load(sessionID) {
    this.#sessionID = sessionID;
    this.#data = void 0;
    await this.#setCookie();
    await this.#ensureData();
  }
  /**
   * Sets the session cookie.
   */
  async #setCookie() {
    if (!VALID_COOKIE_REGEX.test(this.#cookieName)) {
      throw new AstroError({
        ...SessionStorageSaveError,
        message: "Invalid cookie name. Cookie names can only contain letters, numbers, and dashes."
      });
    }
    const value = this.#ensureSessionID();
    this.#cookies.set(this.#cookieName, value, this.#cookieConfig);
  }
  /**
   * Attempts to load the session data from storage, or creates a new data object if none exists.
   * If there is existing partial data, it will be merged into the new data object.
   */
  async #ensureData() {
    const storage = await this.#ensureStorage();
    if (this.#data && !this.#partial) {
      return this.#data;
    }
    this.#data ??= /* @__PURE__ */ new Map();
    const raw = await storage.get(this.#ensureSessionID());
    if (!raw) {
      if (this.#sessionIDFromCookie) {
        this.#sessionID = crypto.randomUUID();
        this.#sessionIDFromCookie = false;
        if (this.#cookieSet) {
          await this.#setCookie();
        }
      }
      return this.#data;
    }
    try {
      const storedMap = unflatten(raw);
      if (!(storedMap instanceof Map)) {
        await this.destroy();
        throw new AstroError({
          ...SessionStorageInitError,
          message: SessionStorageInitError.message(
            "The session data was an invalid type.",
            this.#config.driver
          )
        });
      }
      const now = Date.now();
      for (const [key, value] of storedMap) {
        const expired = typeof value.expires === "number" && value.expires < now;
        if (!this.#data.has(key) && !this.#toDelete.has(key) && !expired) {
          this.#data.set(key, value);
        }
      }
      this.#partial = false;
      return this.#data;
    } catch (err) {
      await this.destroy();
      if (err instanceof AstroError) {
        throw err;
      }
      throw new AstroError(
        {
          ...SessionStorageInitError,
          message: SessionStorageInitError.message(
            "The session data could not be parsed.",
            this.#config.driver
          )
        },
        { cause: err }
      );
    }
  }
  /**
   * Returns the session ID, generating a new one if it does not exist.
   */
  #ensureSessionID() {
    if (!this.#sessionID) {
      const cookieValue = this.#cookies.get(this.#cookieName)?.value;
      if (cookieValue) {
        this.#sessionID = cookieValue;
        this.#sessionIDFromCookie = true;
      } else {
        this.#sessionID = crypto.randomUUID();
      }
    }
    return this.#sessionID;
  }
  /**
   * Ensures the storage is initialized.
   * This is called automatically when a storage operation is needed.
   */
  async #ensureStorage() {
    if (this.#storage) {
      return this.#storage;
    }
    if (AstroSession.#sharedStorage.has(this.#config.driver)) {
      this.#storage = AstroSession.#sharedStorage.get(this.#config.driver);
      return this.#storage;
    }
    if (!this.#driverFactory) {
      throw new AstroError({
        ...SessionStorageInitError,
        message: SessionStorageInitError.message(
          "Astro could not load the driver correctly. Does it exist?",
          this.#config.driver
        )
      });
    }
    const driver = this.#driverFactory;
    try {
      this.#storage = createStorage({
        driver: {
          ...driver(this.#config.options),
          // Unused methods
          hasItem() {
            return false;
          },
          getKeys() {
            return [];
          }
        }
      });
      AstroSession.#sharedStorage.set(this.#config.driver, this.#storage);
      return this.#storage;
    } catch (err) {
      throw new AstroError(
        {
          ...SessionStorageInitError,
          message: SessionStorageInitError.message("Unknown error", this.#config.driver)
        },
        { cause: err }
      );
    }
  }
}
function validateAndDecodePathname(pathname) {
  let decoded;
  try {
    decoded = decodeURI(pathname);
  } catch (_e) {
    throw new Error("Invalid URL encoding");
  }
  const hasDecoding = decoded !== pathname;
  const decodedStillHasEncoding = /%[0-9a-fA-F]{2}/.test(decoded);
  if (hasDecoding && decodedStillHasEncoding) {
    throw new Error("Multi-level URL encoding is not allowed");
  }
  return decoded;
}
class RenderContext {
  pipeline;
  locals;
  middleware;
  actions;
  serverIslands;
  // It must be a DECODED pathname
  pathname;
  request;
  routeData;
  status;
  clientAddress;
  cookies;
  params;
  url;
  props;
  partial;
  shouldInjectCspMetaTags;
  session;
  cache;
  skipMiddleware;
  constructor(pipeline, locals, middleware, actions, serverIslands, pathname, request, routeData, status, clientAddress, cookies = new AstroCookies(request), params = getParams(routeData, pathname), url = RenderContext.#createNormalizedUrl(request.url), props = {}, partial = void 0, shouldInjectCspMetaTags = pipeline.manifest.shouldInjectCspMetaTags, session = void 0, cache, skipMiddleware = false) {
    this.pipeline = pipeline;
    this.locals = locals;
    this.middleware = middleware;
    this.actions = actions;
    this.serverIslands = serverIslands;
    this.pathname = pathname;
    this.request = request;
    this.routeData = routeData;
    this.status = status;
    this.clientAddress = clientAddress;
    this.cookies = cookies;
    this.params = params;
    this.url = url;
    this.props = props;
    this.partial = partial;
    this.shouldInjectCspMetaTags = shouldInjectCspMetaTags;
    this.session = session;
    this.cache = cache;
    this.skipMiddleware = skipMiddleware;
  }
  static #createNormalizedUrl(requestUrl) {
    const url = new URL(requestUrl);
    try {
      url.pathname = validateAndDecodePathname(url.pathname);
    } catch {
      try {
        url.pathname = decodeURI(url.pathname);
      } catch {
      }
    }
    url.pathname = collapseDuplicateSlashes(url.pathname);
    return url;
  }
  /**
   * A flag that tells the render content if the rewriting was triggered
   */
  isRewriting = false;
  /**
   * A safety net in case of loops
   */
  counter = 0;
  result = void 0;
  static async create({
    locals = {},
    pathname,
    pipeline,
    request,
    routeData,
    clientAddress,
    status = 200,
    props,
    partial = void 0,
    shouldInjectCspMetaTags,
    skipMiddleware = false
  }) {
    const pipelineMiddleware = await pipeline.getMiddleware();
    const pipelineActions = await pipeline.getActions();
    const pipelineSessionDriver = await pipeline.getSessionDriver();
    const serverIslands = await pipeline.getServerIslands();
    setOriginPathname(
      request,
      pathname,
      pipeline.manifest.trailingSlash,
      pipeline.manifest.buildFormat
    );
    const cookies = new AstroCookies(request);
    const session = pipeline.manifest.sessionConfig && pipelineSessionDriver ? new AstroSession({
      cookies,
      config: pipeline.manifest.sessionConfig,
      runtimeMode: pipeline.runtimeMode,
      driverFactory: pipelineSessionDriver,
      mockStorage: null
    }) : void 0;
    let cache;
    if (!pipeline.cacheConfig) {
      cache = new DisabledAstroCache(pipeline.logger);
    } else if (pipeline.runtimeMode === "development") {
      cache = new NoopAstroCache();
    } else {
      const cacheProvider = await pipeline.getCacheProvider();
      cache = new AstroCache(cacheProvider);
      if (pipeline.cacheConfig?.routes) {
        if (!pipeline.compiledCacheRoutes) {
          pipeline.compiledCacheRoutes = compileCacheRoutes(
            pipeline.cacheConfig.routes,
            pipeline.manifest.base,
            pipeline.manifest.trailingSlash
          );
        }
        const matched = matchCacheRoute(pathname, pipeline.compiledCacheRoutes);
        if (matched) {
          cache.set(matched);
        }
      }
    }
    return new RenderContext(
      pipeline,
      locals,
      sequence(...pipeline.internalMiddleware, pipelineMiddleware),
      pipelineActions,
      serverIslands,
      pathname,
      request,
      routeData,
      status,
      clientAddress,
      cookies,
      void 0,
      void 0,
      props,
      partial,
      shouldInjectCspMetaTags ?? pipeline.manifest.shouldInjectCspMetaTags,
      session,
      cache,
      skipMiddleware
    );
  }
  /**
   * The main function of the RenderContext.
   *
   * Use this function to render any route known to Astro.
   * It attempts to render a route. A route can be a:
   *
   * - page
   * - redirect
   * - endpoint
   * - fallback
   */
  async render(componentInstance, slots = {}) {
    const { middleware, pipeline } = this;
    const { logger, streaming, manifest: manifest2 } = pipeline;
    const props = Object.keys(this.props).length > 0 ? this.props : await getProps({
      mod: componentInstance,
      routeData: this.routeData,
      routeCache: this.pipeline.routeCache,
      pathname: this.pathname,
      logger,
      serverLike: manifest2.serverLike,
      base: manifest2.base,
      trailingSlash: manifest2.trailingSlash
    });
    const actionApiContext = this.createActionAPIContext();
    const apiContext = this.createAPIContext(props, actionApiContext);
    this.counter++;
    if (this.counter === 4) {
      return new Response("Loop Detected", {
        // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/508
        status: 508,
        statusText: "Astro detected a loop where you tried to call the rewriting logic more than four times."
      });
    }
    const lastNext = async (ctx, payload) => {
      if (payload) {
        const oldPathname = this.pathname;
        pipeline.logger.debug("router", "Called rewriting to:", payload);
        const {
          routeData,
          componentInstance: newComponent,
          pathname,
          newUrl
        } = await pipeline.tryRewrite(payload, this.request);
        if (this.pipeline.manifest.serverLike === true && this.routeData.prerender === false && routeData.prerender === true) {
          throw new AstroError({
            ...ForbiddenRewrite,
            message: ForbiddenRewrite.message(this.pathname, pathname, routeData.component),
            hint: ForbiddenRewrite.hint(routeData.component)
          });
        }
        this.routeData = routeData;
        componentInstance = newComponent;
        if (payload instanceof Request) {
          this.request = payload;
        } else {
          this.request = copyRequest(
            newUrl,
            this.request,
            // need to send the flag of the previous routeData
            routeData.prerender,
            this.pipeline.logger,
            this.routeData.route
          );
        }
        this.isRewriting = true;
        this.url = RenderContext.#createNormalizedUrl(this.request.url);
        this.params = getParams(routeData, pathname);
        this.pathname = pathname;
        this.status = 200;
        setOriginPathname(
          this.request,
          oldPathname,
          this.pipeline.manifest.trailingSlash,
          this.pipeline.manifest.buildFormat
        );
      }
      let response2;
      if (!ctx.isPrerendered && !this.skipMiddleware) {
        const { action, setActionResult, serializeActionResult: serializeActionResult2 } = getActionContext(ctx);
        if (action?.calledFrom === "form") {
          const actionResult = await action.handler();
          setActionResult(action.name, serializeActionResult2(actionResult));
        }
      }
      switch (this.routeData.type) {
        case "endpoint": {
          response2 = await renderEndpoint(
            componentInstance,
            ctx,
            this.routeData.prerender,
            logger
          );
          break;
        }
        case "redirect":
          return renderRedirect(this);
        case "page": {
          this.result = await this.createResult(componentInstance, actionApiContext);
          try {
            response2 = await renderPage(
              this.result,
              componentInstance?.default,
              props,
              slots,
              streaming,
              this.routeData
            );
          } catch (e) {
            this.result.cancelled = true;
            throw e;
          }
          response2.headers.set(ROUTE_TYPE_HEADER, "page");
          if (this.routeData.route === "/404" || this.routeData.route === "/500") {
            response2.headers.set(REROUTE_DIRECTIVE_HEADER, "no");
          }
          if (this.isRewriting) {
            response2.headers.set(REWRITE_DIRECTIVE_HEADER_KEY, REWRITE_DIRECTIVE_HEADER_VALUE);
          }
          break;
        }
        case "fallback": {
          return new Response(null, { status: 500, headers: { [ROUTE_TYPE_HEADER]: "fallback" } });
        }
      }
      const responseCookies = getCookiesFromResponse(response2);
      if (responseCookies) {
        this.cookies.merge(responseCookies);
      }
      return response2;
    };
    if (isRouteExternalRedirect(this.routeData)) {
      return renderRedirect(this);
    }
    const response = this.skipMiddleware ? await lastNext(apiContext) : await callMiddleware(middleware, apiContext, lastNext);
    if (response.headers.get(ROUTE_TYPE_HEADER)) {
      response.headers.delete(ROUTE_TYPE_HEADER);
    }
    attachCookiesToResponse(response, this.cookies);
    return response;
  }
  createAPIContext(props, context) {
    const redirect = (path, status = 302) => new Response(null, { status, headers: { Location: path } });
    const rewrite = async (reroutePayload) => {
      return await this.#executeRewrite(reroutePayload);
    };
    Reflect.set(context, pipelineSymbol, this.pipeline);
    return Object.assign(context, {
      props,
      redirect,
      rewrite,
      getActionResult: createGetActionResult(context.locals),
      callAction: createCallAction(context)
    });
  }
  async #executeRewrite(reroutePayload) {
    this.pipeline.logger.debug("router", "Calling rewrite: ", reroutePayload);
    const oldPathname = this.pathname;
    const { routeData, componentInstance, newUrl, pathname } = await this.pipeline.tryRewrite(
      reroutePayload,
      this.request
    );
    const isI18nFallback = routeData.fallbackRoutes && routeData.fallbackRoutes.length > 0;
    if (this.pipeline.manifest.serverLike && !this.routeData.prerender && routeData.prerender && !isI18nFallback) {
      throw new AstroError({
        ...ForbiddenRewrite,
        message: ForbiddenRewrite.message(this.pathname, pathname, routeData.component),
        hint: ForbiddenRewrite.hint(routeData.component)
      });
    }
    this.routeData = routeData;
    if (reroutePayload instanceof Request) {
      this.request = reroutePayload;
    } else {
      this.request = copyRequest(
        newUrl,
        this.request,
        // need to send the flag of the previous routeData
        routeData.prerender,
        this.pipeline.logger,
        this.routeData.route
      );
    }
    this.url = RenderContext.#createNormalizedUrl(this.request.url);
    const newCookies = new AstroCookies(this.request);
    if (this.cookies) {
      newCookies.merge(this.cookies);
    }
    this.cookies = newCookies;
    this.params = getParams(routeData, pathname);
    this.pathname = pathname;
    this.isRewriting = true;
    this.status = 200;
    setOriginPathname(
      this.request,
      oldPathname,
      this.pipeline.manifest.trailingSlash,
      this.pipeline.manifest.buildFormat
    );
    return await this.render(componentInstance);
  }
  createActionAPIContext() {
    const renderContext = this;
    const { params, pipeline, url } = this;
    return {
      // Don't allow reassignment of cookies because it doesn't work
      get cookies() {
        return renderContext.cookies;
      },
      routePattern: this.routeData.route,
      isPrerendered: this.routeData.prerender,
      get clientAddress() {
        return renderContext.getClientAddress();
      },
      get currentLocale() {
        return renderContext.computeCurrentLocale();
      },
      generator: ASTRO_GENERATOR,
      get locals() {
        return renderContext.locals;
      },
      set locals(_) {
        throw new AstroError(LocalsReassigned);
      },
      params,
      get preferredLocale() {
        return renderContext.computePreferredLocale();
      },
      get preferredLocaleList() {
        return renderContext.computePreferredLocaleList();
      },
      request: this.request,
      site: pipeline.site,
      url,
      get originPathname() {
        return getOriginPathname(renderContext.request);
      },
      get session() {
        if (this.isPrerendered) {
          pipeline.logger.warn(
            "session",
            `context.session was used when rendering the route ${s.green(this.routePattern)}, but it is not available on prerendered routes. If you need access to sessions, make sure that the route is server-rendered using \`export const prerender = false;\` or by setting \`output\` to \`"server"\` in your Astro config to make all your routes server-rendered by default. For more information, see https://docs.astro.build/en/guides/sessions/`
          );
          return void 0;
        }
        if (!renderContext.session) {
          pipeline.logger.warn(
            "session",
            `context.session was used when rendering the route ${s.green(this.routePattern)}, but no storage configuration was provided. Either configure the storage manually or use an adapter that provides session storage. For more information, see https://docs.astro.build/en/guides/sessions/`
          );
          return void 0;
        }
        return renderContext.session;
      },
      get cache() {
        return renderContext.cache;
      },
      get csp() {
        if (!pipeline.manifest.csp) {
          if (pipeline.runtimeMode === "production") {
            pipeline.logger.warn(
              "csp",
              `context.csp was used when rendering the route ${s.green(this.routePattern)}, but CSP was not configured. For more information, see https://docs.astro.build/en/reference/experimental-flags/csp/`
            );
          }
          return void 0;
        }
        return {
          insertDirective(payload) {
            if (renderContext?.result?.directives) {
              renderContext.result.directives = pushDirective(
                renderContext.result.directives,
                payload
              );
            } else {
              renderContext?.result?.directives.push(payload);
            }
          },
          insertScriptResource(resource) {
            renderContext.result?.scriptResources.push(resource);
          },
          insertStyleResource(resource) {
            renderContext.result?.styleResources.push(resource);
          },
          insertStyleHash(hash) {
            renderContext.result?.styleHashes.push(hash);
          },
          insertScriptHash(hash) {
            renderContext.result?.scriptHashes.push(hash);
          }
        };
      }
    };
  }
  async createResult(mod, ctx) {
    const { cookies, pathname, pipeline, routeData, status } = this;
    const { clientDirectives, inlinedScripts, compressHTML, manifest: manifest2, renderers: renderers2, resolve } = pipeline;
    const { links, scripts, styles } = await pipeline.headElements(routeData);
    const extraStyleHashes = [];
    const extraScriptHashes = [];
    const shouldInjectCspMetaTags = this.shouldInjectCspMetaTags;
    const cspAlgorithm = manifest2.csp?.algorithm ?? "SHA-256";
    if (shouldInjectCspMetaTags) {
      for (const style of styles) {
        extraStyleHashes.push(await generateCspDigest(style.children, cspAlgorithm));
      }
      for (const script of scripts) {
        extraScriptHashes.push(await generateCspDigest(script.children, cspAlgorithm));
      }
    }
    const componentMetadata = await pipeline.componentMetadata(routeData) ?? manifest2.componentMetadata;
    const headers = new Headers({ "Content-Type": "text/html" });
    const partial = typeof this.partial === "boolean" ? this.partial : Boolean(mod.partial);
    const actionResult = hasActionPayload(this.locals) ? deserializeActionResult(this.locals._actionPayload.actionResult) : void 0;
    const response = {
      status: actionResult?.error ? actionResult?.error.status : status,
      statusText: actionResult?.error ? actionResult?.error.type : "OK",
      get headers() {
        return headers;
      },
      // Disallow `Astro.response.headers = new Headers`
      set headers(_) {
        throw new AstroError(AstroResponseHeadersReassigned);
      }
    };
    const result = {
      base: manifest2.base,
      userAssetsBase: manifest2.userAssetsBase,
      cancelled: false,
      clientDirectives,
      inlinedScripts,
      componentMetadata,
      compressHTML,
      cookies,
      /** This function returns the `Astro` faux-global */
      createAstro: (props, slots) => this.createAstro(result, props, slots, ctx),
      links,
      params: this.params,
      partial,
      pathname,
      renderers: renderers2,
      resolve,
      response,
      request: this.request,
      scripts,
      styles,
      actionResult,
      serverIslandNameMap: this.serverIslands.serverIslandNameMap ?? /* @__PURE__ */ new Map(),
      key: manifest2.key,
      trailingSlash: manifest2.trailingSlash,
      _experimentalQueuedRendering: {
        pool: pipeline.nodePool,
        htmlStringCache: pipeline.htmlStringCache,
        enabled: manifest2.experimentalQueuedRendering?.enabled,
        poolSize: manifest2.experimentalQueuedRendering?.poolSize,
        contentCache: manifest2.experimentalQueuedRendering?.contentCache
      },
      _metadata: {
        hasHydrationScript: false,
        rendererSpecificHydrationScripts: /* @__PURE__ */ new Set(),
        hasRenderedHead: false,
        renderedScripts: /* @__PURE__ */ new Set(),
        hasDirectives: /* @__PURE__ */ new Set(),
        hasRenderedServerIslandRuntime: false,
        headInTree: false,
        extraHead: [],
        extraStyleHashes,
        extraScriptHashes,
        propagators: /* @__PURE__ */ new Set()
      },
      cspDestination: manifest2.csp?.cspDestination ?? (routeData.prerender ? "meta" : "header"),
      shouldInjectCspMetaTags,
      cspAlgorithm,
      // The following arrays must be cloned; otherwise, they become mutable across routes.
      scriptHashes: manifest2.csp?.scriptHashes ? [...manifest2.csp.scriptHashes] : [],
      scriptResources: manifest2.csp?.scriptResources ? [...manifest2.csp.scriptResources] : [],
      styleHashes: manifest2.csp?.styleHashes ? [...manifest2.csp.styleHashes] : [],
      styleResources: manifest2.csp?.styleResources ? [...manifest2.csp.styleResources] : [],
      directives: manifest2.csp?.directives ? [...manifest2.csp.directives] : [],
      isStrictDynamic: manifest2.csp?.isStrictDynamic ?? false,
      internalFetchHeaders: manifest2.internalFetchHeaders
    };
    return result;
  }
  #astroPagePartial;
  /**
   * The Astro global is sourced in 3 different phases:
   * - **Static**: `.generator` and `.glob` is printed by the compiler, instantiated once per process per astro file
   * - **Page-level**: `.request`, `.cookies`, `.locals` etc. These remain the same for the duration of the request.
   * - **Component-level**: `.props`, `.slots`, and `.self` are unique to each _use_ of each component.
   *
   * The page level partial is used as the prototype of the user-visible `Astro` global object, which is instantiated once per use of a component.
   */
  createAstro(result, props, slotValues, apiContext) {
    let astroPagePartial;
    if (this.isRewriting) {
      astroPagePartial = this.#astroPagePartial = this.createAstroPagePartial(result, apiContext);
    } else {
      astroPagePartial = this.#astroPagePartial ??= this.createAstroPagePartial(result, apiContext);
    }
    const astroComponentPartial = { props, self: null };
    const Astro = Object.assign(
      Object.create(astroPagePartial),
      astroComponentPartial
    );
    let _slots;
    Object.defineProperty(Astro, "slots", {
      get: () => {
        if (!_slots) {
          _slots = new Slots(
            result,
            slotValues,
            this.pipeline.logger
          );
        }
        return _slots;
      }
    });
    return Astro;
  }
  createAstroPagePartial(result, apiContext) {
    const renderContext = this;
    const { cookies, locals, params, pipeline, url } = this;
    const { response } = result;
    const redirect = (path, status = 302) => {
      if (this.request[responseSentSymbol$1]) {
        throw new AstroError({
          ...ResponseSentError
        });
      }
      return new Response(null, { status, headers: { Location: path } });
    };
    const rewrite = async (reroutePayload) => {
      return await this.#executeRewrite(reroutePayload);
    };
    const callAction = createCallAction(apiContext);
    return {
      generator: ASTRO_GENERATOR,
      routePattern: this.routeData.route,
      isPrerendered: this.routeData.prerender,
      cookies,
      get session() {
        if (this.isPrerendered) {
          pipeline.logger.warn(
            "session",
            `Astro.session was used when rendering the route ${s.green(this.routePattern)}, but it is not available on prerendered pages. If you need access to sessions, make sure that the page is server-rendered using \`export const prerender = false;\` or by setting \`output\` to \`"server"\` in your Astro config to make all your pages server-rendered by default. For more information, see https://docs.astro.build/en/guides/sessions/`
          );
          return void 0;
        }
        if (!renderContext.session) {
          pipeline.logger.warn(
            "session",
            `Astro.session was used when rendering the route ${s.green(this.routePattern)}, but no storage configuration was provided. Either configure the storage manually or use an adapter that provides session storage. For more information, see https://docs.astro.build/en/guides/sessions/`
          );
          return void 0;
        }
        return renderContext.session;
      },
      get cache() {
        return renderContext.cache;
      },
      get clientAddress() {
        return renderContext.getClientAddress();
      },
      get currentLocale() {
        return renderContext.computeCurrentLocale();
      },
      params,
      get preferredLocale() {
        return renderContext.computePreferredLocale();
      },
      get preferredLocaleList() {
        return renderContext.computePreferredLocaleList();
      },
      locals,
      redirect,
      rewrite,
      request: this.request,
      response,
      site: pipeline.site,
      getActionResult: createGetActionResult(locals),
      get callAction() {
        return callAction;
      },
      url,
      get originPathname() {
        return getOriginPathname(renderContext.request);
      },
      get csp() {
        if (!pipeline.manifest.csp) {
          if (pipeline.runtimeMode === "production") {
            pipeline.logger.warn(
              "csp",
              `Astro.csp was used when rendering the route ${s.green(this.routePattern)}, but CSP was not configured. For more information, see https://docs.astro.build/en/reference/experimental-flags/csp/`
            );
          }
          return void 0;
        }
        return {
          insertDirective(payload) {
            if (renderContext?.result?.directives) {
              renderContext.result.directives = pushDirective(
                renderContext.result.directives,
                payload
              );
            } else {
              renderContext?.result?.directives.push(payload);
            }
          },
          insertScriptResource(resource) {
            renderContext.result?.scriptResources.push(resource);
          },
          insertStyleResource(resource) {
            renderContext.result?.styleResources.push(resource);
          },
          insertStyleHash(hash) {
            renderContext.result?.styleHashes.push(hash);
          },
          insertScriptHash(hash) {
            renderContext.result?.scriptHashes.push(hash);
          }
        };
      }
    };
  }
  getClientAddress() {
    const { pipeline, routeData, clientAddress } = this;
    if (routeData.prerender) {
      throw new AstroError({
        ...PrerenderClientAddressNotAvailable,
        message: PrerenderClientAddressNotAvailable.message(routeData.component)
      });
    }
    if (clientAddress) {
      return clientAddress;
    }
    if (pipeline.adapterName) {
      throw new AstroError({
        ...ClientAddressNotAvailable,
        message: ClientAddressNotAvailable.message(pipeline.adapterName)
      });
    }
    throw new AstroError(StaticClientAddressNotAvailable);
  }
  /**
   * API Context may be created multiple times per request, i18n data needs to be computed only once.
   * So, it is computed and saved here on creation of the first APIContext and reused for later ones.
   */
  #currentLocale;
  computeCurrentLocale() {
    const {
      url,
      pipeline: { i18n },
      routeData
    } = this;
    if (!i18n) return;
    const { defaultLocale, locales, strategy } = i18n;
    const fallbackTo = strategy === "pathname-prefix-other-locales" || strategy === "domains-prefix-other-locales" ? defaultLocale : void 0;
    if (this.#currentLocale) {
      return this.#currentLocale;
    }
    let computedLocale;
    if (isRouteServerIsland(routeData)) {
      let referer = this.request.headers.get("referer");
      if (referer) {
        if (URL.canParse(referer)) {
          referer = new URL(referer).pathname;
        }
        computedLocale = computeCurrentLocale(referer, locales, defaultLocale);
      }
    } else {
      let pathname = routeData.pathname;
      if (!routeData.pattern.test(url.pathname)) {
        for (const fallbackRoute of routeData.fallbackRoutes) {
          if (fallbackRoute.pattern.test(url.pathname)) {
            pathname = fallbackRoute.pathname;
            break;
          }
        }
      }
      pathname = pathname && !isRoute404or500(routeData) ? pathname : url.pathname;
      computedLocale = computeCurrentLocale(pathname, locales, defaultLocale);
      if (routeData.params.length > 0) {
        const localeFromParams = computeCurrentLocaleFromParams(this.params, locales);
        if (localeFromParams) {
          computedLocale = localeFromParams;
        }
      }
    }
    this.#currentLocale = computedLocale ?? fallbackTo;
    return this.#currentLocale;
  }
  #preferredLocale;
  computePreferredLocale() {
    const {
      pipeline: { i18n },
      request
    } = this;
    if (!i18n) return;
    return this.#preferredLocale ??= computePreferredLocale(request, i18n.locales);
  }
  #preferredLocaleList;
  computePreferredLocaleList() {
    const {
      pipeline: { i18n },
      request
    } = this;
    if (!i18n) return;
    return this.#preferredLocaleList ??= computePreferredLocaleList(request, i18n.locales);
  }
}
function redirectTemplate({
  status,
  absoluteLocation,
  relativeLocation,
  from
}) {
  const delay = status === 302 ? 2 : 0;
  return `<!doctype html>
<title>Redirecting to: ${relativeLocation}</title>
<meta http-equiv="refresh" content="${delay};url=${relativeLocation}">
<meta name="robots" content="noindex">
<link rel="canonical" href="${absoluteLocation}">
<body>
	<a href="${relativeLocation}">Redirecting ${from ? `from <code>${from}</code> ` : ""}to <code>${relativeLocation}</code></a>
</body>`;
}
function ensure404Route(manifest2) {
  if (!manifest2.routes.some((route) => route.route === "/404")) {
    manifest2.routes.push(DEFAULT_404_ROUTE);
  }
  return manifest2;
}
class Router {
  #routes;
  #base;
  #baseWithoutTrailingSlash;
  #buildFormat;
  #trailingSlash;
  constructor(routes, options) {
    this.#routes = [...routes].sort(routeComparator);
    this.#base = normalizeBase(options.base);
    this.#baseWithoutTrailingSlash = removeTrailingForwardSlash(this.#base);
    this.#buildFormat = options.buildFormat;
    this.#trailingSlash = options.trailingSlash;
  }
  /**
   * Match an input pathname against the route list.
   * If allowWithoutBase is true, a non-base-prefixed path is still considered.
   */
  match(inputPathname, { allowWithoutBase = false } = {}) {
    const normalized = getRedirectForPathname(inputPathname);
    if (normalized.redirect) {
      return { type: "redirect", location: normalized.redirect, status: 301 };
    }
    if (this.#base !== "/") {
      const baseWithSlash = `${this.#baseWithoutTrailingSlash}/`;
      if (this.#trailingSlash === "always" && (normalized.pathname === this.#baseWithoutTrailingSlash || normalized.pathname === this.#base)) {
        return { type: "redirect", location: baseWithSlash, status: 301 };
      }
      if (this.#trailingSlash === "never" && normalized.pathname === baseWithSlash) {
        return { type: "redirect", location: this.#baseWithoutTrailingSlash, status: 301 };
      }
    }
    const baseResult = stripBase(
      normalized.pathname,
      this.#base,
      this.#baseWithoutTrailingSlash,
      this.#trailingSlash
    );
    if (!baseResult) {
      if (!allowWithoutBase) {
        return { type: "none", reason: "outside-base" };
      }
    }
    let pathname = baseResult ?? normalized.pathname;
    if (this.#buildFormat === "file") {
      pathname = normalizeFileFormatPathname(pathname);
    }
    const route = this.#routes.find((candidate) => {
      if (candidate.pattern.test(pathname)) return true;
      return candidate.fallbackRoutes.some((fallbackRoute) => fallbackRoute.pattern.test(pathname));
    });
    if (!route) {
      return { type: "none", reason: "no-match" };
    }
    const params = getParams(route, pathname);
    return { type: "match", route, params, pathname };
  }
}
function normalizeBase(base) {
  if (!base) return "/";
  if (base === "/") return base;
  return prependForwardSlash(base);
}
function getRedirectForPathname(pathname) {
  let value = prependForwardSlash(pathname);
  if (value.startsWith("//")) {
    const collapsed = `/${value.replace(/^\/+/, "")}`;
    return { pathname: value, redirect: collapsed };
  }
  return { pathname: value };
}
function stripBase(pathname, base, baseWithoutTrailingSlash, trailingSlash) {
  if (base === "/") return pathname;
  const baseWithSlash = `${baseWithoutTrailingSlash}/`;
  if (pathname === baseWithoutTrailingSlash || pathname === base) {
    return trailingSlash === "always" ? null : "/";
  }
  if (pathname === baseWithSlash) {
    return trailingSlash === "never" ? null : "/";
  }
  if (pathname.startsWith(baseWithSlash)) {
    return pathname.slice(baseWithoutTrailingSlash.length);
  }
  return null;
}
function normalizeFileFormatPathname(pathname) {
  if (pathname.endsWith("/index.html")) {
    const trimmed = pathname.slice(0, -"/index.html".length);
    return trimmed === "" ? "/" : trimmed;
  }
  if (pathname.endsWith(".html")) {
    const trimmed = pathname.slice(0, -".html".length);
    return trimmed === "" ? "/" : trimmed;
  }
  return pathname;
}
class BaseApp {
  manifest;
  manifestData;
  pipeline;
  adapterLogger;
  baseWithoutTrailingSlash;
  logger;
  #router;
  constructor(manifest2, streaming = true, ...args) {
    this.manifest = manifest2;
    this.manifestData = { routes: manifest2.routes.map((route) => route.routeData) };
    this.baseWithoutTrailingSlash = removeTrailingForwardSlash(manifest2.base);
    this.pipeline = this.createPipeline(streaming, manifest2, ...args);
    this.logger = new AstroLogger({
      destination: consoleLogDestination,
      level: manifest2.logLevel
    });
    this.adapterLogger = new AstroIntegrationLogger(this.logger.options, manifest2.adapterName);
    ensure404Route(this.manifestData);
    this.#router = this.createRouter(this.manifestData);
  }
  async createRenderContext(payload) {
    return RenderContext.create(payload);
  }
  getAdapterLogger() {
    return this.adapterLogger;
  }
  getAllowedDomains() {
    return this.manifest.allowedDomains;
  }
  matchesAllowedDomains(forwardedHost, protocol) {
    return BaseApp.validateForwardedHost(forwardedHost, this.manifest.allowedDomains, protocol);
  }
  static validateForwardedHost(forwardedHost, allowedDomains, protocol) {
    if (!allowedDomains || allowedDomains.length === 0) {
      return false;
    }
    try {
      const testUrl = new URL(`${protocol || "https"}://${forwardedHost}`);
      return allowedDomains.some((pattern) => {
        return matchPattern(testUrl, pattern);
      });
    } catch {
      return false;
    }
  }
  set setManifestData(newManifestData) {
    this.manifestData = newManifestData;
    this.#router = this.createRouter(this.manifestData);
  }
  removeBase(pathname) {
    pathname = collapseDuplicateLeadingSlashes(pathname);
    if (pathname.startsWith(this.manifest.base)) {
      return pathname.slice(this.baseWithoutTrailingSlash.length + 1);
    }
    return pathname;
  }
  /**
   * It removes the base from the request URL, prepends it with a forward slash and attempts to decoded it.
   *
   * If the decoding fails, it logs the error and return the pathname as is.
   * @param request
   */
  getPathnameFromRequest(request) {
    const url = new URL(request.url);
    const pathname = prependForwardSlash(this.removeBase(url.pathname));
    try {
      return decodeURI(pathname);
    } catch (e) {
      this.getAdapterLogger().error(e.toString());
      return pathname;
    }
  }
  /**
   * Given a `Request`, it returns the `RouteData` that matches its `pathname`. By default, prerendered
   * routes aren't returned, even if they are matched.
   *
   * When `allowPrerenderedRoutes` is `true`, the function returns matched prerendered routes too.
   * @param request
   * @param allowPrerenderedRoutes
   */
  match(request, allowPrerenderedRoutes = false) {
    const url = new URL(request.url);
    if (this.manifest.assets.has(url.pathname)) return void 0;
    let pathname = this.computePathnameFromDomain(request);
    if (!pathname) {
      pathname = prependForwardSlash(this.removeBase(url.pathname));
    }
    const match = this.#router.match(decodeURI(pathname), { allowWithoutBase: true });
    if (match.type !== "match") return void 0;
    const routeData = match.route;
    if (allowPrerenderedRoutes) {
      return routeData;
    } else if (routeData.prerender) {
      return void 0;
    }
    return routeData;
  }
  createRouter(manifestData) {
    return new Router(manifestData.routes, {
      base: this.manifest.base,
      trailingSlash: this.manifest.trailingSlash,
      buildFormat: this.manifest.buildFormat
    });
  }
  /**
   * A matching route function to use in the development server.
   * Contrary to the `.match` function, this function resolves props and params, returning the correct
   * route based on the priority, segments. It also returns the correct, resolved pathname.
   * @param pathname
   */
  devMatch(pathname) {
    return void 0;
  }
  computePathnameFromDomain(request) {
    let pathname = void 0;
    const url = new URL(request.url);
    if (this.manifest.i18n && (this.manifest.i18n.strategy === "domains-prefix-always" || this.manifest.i18n.strategy === "domains-prefix-other-locales" || this.manifest.i18n.strategy === "domains-prefix-always-no-redirect")) {
      let host = request.headers.get("X-Forwarded-Host");
      let protocol = request.headers.get("X-Forwarded-Proto");
      if (protocol) {
        protocol = protocol + ":";
      } else {
        protocol = url.protocol;
      }
      if (!host) {
        host = request.headers.get("Host");
      }
      if (host && protocol) {
        host = host.split(":")[0];
        try {
          let locale;
          const hostAsUrl = new URL(`${protocol}//${host}`);
          for (const [domainKey, localeValue] of Object.entries(
            this.manifest.i18n.domainLookupTable
          )) {
            const domainKeyAsUrl = new URL(domainKey);
            if (hostAsUrl.host === domainKeyAsUrl.host && hostAsUrl.protocol === domainKeyAsUrl.protocol) {
              locale = localeValue;
              break;
            }
          }
          if (locale) {
            pathname = prependForwardSlash(
              joinPaths(normalizeTheLocale(locale), this.removeBase(url.pathname))
            );
            if (this.manifest.trailingSlash === "always") {
              pathname = appendForwardSlash(pathname);
            } else if (this.manifest.trailingSlash === "never") {
              pathname = removeTrailingForwardSlash(pathname);
            } else if (url.pathname.endsWith("/")) {
              pathname = appendForwardSlash(pathname);
            }
          }
        } catch (e) {
          this.logger.error(
            "router",
            `Astro tried to parse ${protocol}//${host} as an URL, but it threw a parsing error. Check the X-Forwarded-Host and X-Forwarded-Proto headers.`
          );
          this.logger.error("router", `Error: ${e}`);
        }
      }
    }
    return pathname;
  }
  redirectTrailingSlash(pathname) {
    const { trailingSlash } = this.manifest;
    if (pathname === "/" || isInternalPath(pathname)) {
      return pathname;
    }
    const path = collapseDuplicateTrailingSlashes(pathname, trailingSlash !== "never");
    if (path !== pathname) {
      return path;
    }
    if (trailingSlash === "ignore") {
      return pathname;
    }
    if (trailingSlash === "always" && !hasFileExtension(pathname)) {
      return appendForwardSlash(pathname);
    }
    if (trailingSlash === "never") {
      return removeTrailingForwardSlash(pathname);
    }
    return pathname;
  }
  async render(request, {
    addCookieHeader = false,
    clientAddress = Reflect.get(request, clientAddressSymbol),
    locals,
    prerenderedErrorPageFetch = fetch,
    routeData
  } = {}) {
    const timeStart = performance.now();
    const url = new URL(request.url);
    const redirect = this.redirectTrailingSlash(url.pathname);
    if (redirect !== url.pathname) {
      const status = request.method === "GET" ? 301 : 308;
      const response2 = new Response(
        redirectTemplate({
          status,
          relativeLocation: url.pathname,
          absoluteLocation: redirect,
          from: request.url
        }),
        {
          status,
          headers: {
            location: redirect + url.search
          }
        }
      );
      this.#prepareResponse(response2, { addCookieHeader });
      return response2;
    }
    if (routeData) {
      this.logger.debug(
        "router",
        "The adapter " + this.manifest.adapterName + " provided a custom RouteData for ",
        request.url
      );
      this.logger.debug("router", "RouteData");
      this.logger.debug("router", routeData);
    }
    const resolvedRenderOptions = {
      addCookieHeader,
      clientAddress,
      prerenderedErrorPageFetch,
      locals,
      routeData
    };
    if (locals) {
      if (typeof locals !== "object") {
        const error2 = new AstroError(LocalsNotAnObject);
        this.logger.error(null, error2.stack);
        return this.renderError(request, {
          ...resolvedRenderOptions,
          // If locals are invalid, we don't want to include them when
          // rendering the error page
          locals: void 0,
          status: 500,
          error: error2
        });
      }
    }
    if (!routeData) {
      if (this.isDev()) {
        const result = await this.devMatch(this.getPathnameFromRequest(request));
        if (result) {
          routeData = result.routeData;
        }
      } else {
        routeData = this.match(request);
      }
      this.logger.debug("router", "Astro matched the following route for " + request.url);
      this.logger.debug("router", "RouteData:\n" + routeData);
    }
    if (!routeData) {
      routeData = this.manifestData.routes.find(
        (route) => route.component === "404.astro" || route.component === DEFAULT_404_COMPONENT
      );
    }
    if (!routeData) {
      this.logger.debug("router", "Astro hasn't found routes that match " + request.url);
      this.logger.debug("router", "Here's the available routes:\n", this.manifestData);
      return this.renderError(request, {
        ...resolvedRenderOptions,
        status: 404
      });
    }
    let pathname = this.getPathnameFromRequest(request);
    if (this.isDev() && !routeHasHtmlExtension(routeData)) {
      pathname = pathname.replace(/\/index\.html$/, "/").replace(/\.html$/, "");
    }
    const defaultStatus = this.getDefaultStatusCode(routeData, pathname);
    let response;
    let session;
    let cache;
    try {
      const componentInstance = await this.pipeline.getComponentByRoute(routeData);
      const renderContext = await this.createRenderContext({
        pipeline: this.pipeline,
        locals,
        pathname,
        request,
        routeData,
        status: defaultStatus,
        clientAddress
      });
      session = renderContext.session;
      cache = renderContext.cache;
      if (this.pipeline.cacheProvider) {
        const cacheProvider = await this.pipeline.getCacheProvider();
        if (cacheProvider?.onRequest) {
          response = await cacheProvider.onRequest(
            {
              request,
              url: new URL(request.url)
            },
            async () => {
              const res = await renderContext.render(componentInstance);
              applyCacheHeaders(cache, res);
              return res;
            }
          );
          response.headers.delete("CDN-Cache-Control");
          response.headers.delete("Cache-Tag");
        } else {
          response = await renderContext.render(componentInstance);
          applyCacheHeaders(cache, response);
        }
      } else {
        response = await renderContext.render(componentInstance);
      }
      const isRewrite = response.headers.has(REWRITE_DIRECTIVE_HEADER_KEY);
      this.logThisRequest({
        pathname,
        method: request.method,
        statusCode: response.status,
        isRewrite,
        timeStart
      });
    } catch (err) {
      this.logger.error(null, err.stack || err.message || String(err));
      return this.renderError(request, {
        ...resolvedRenderOptions,
        status: 500,
        error: err
      });
    } finally {
      await session?.[PERSIST_SYMBOL]();
    }
    if (REROUTABLE_STATUS_CODES.includes(response.status) && // If the body isn't null, that means the user sets the 404 status
    // but uses the current route to handle the 404
    response.body === null && response.headers.get(REROUTE_DIRECTIVE_HEADER) !== "no") {
      return this.renderError(request, {
        ...resolvedRenderOptions,
        response,
        status: response.status,
        // We don't have an error to report here. Passing null means we pass nothing intentionally
        // while undefined means there's no error
        error: response.status === 500 ? null : void 0
      });
    }
    this.#prepareResponse(response, { addCookieHeader });
    return response;
  }
  #prepareResponse(response, { addCookieHeader }) {
    for (const headerName of [
      REROUTE_DIRECTIVE_HEADER,
      REWRITE_DIRECTIVE_HEADER_KEY,
      NOOP_MIDDLEWARE_HEADER,
      ROUTE_TYPE_HEADER
    ]) {
      if (response.headers.has(headerName)) {
        response.headers.delete(headerName);
      }
    }
    if (addCookieHeader) {
      for (const setCookieHeaderValue of getSetCookiesFromResponse(response)) {
        response.headers.append("set-cookie", setCookieHeaderValue);
      }
    }
    Reflect.set(response, responseSentSymbol$1, true);
  }
  setCookieHeaders(response) {
    return getSetCookiesFromResponse(response);
  }
  /**
   * Reads all the cookies written by `Astro.cookie.set()` onto the passed response.
   * For example,
   * ```ts
   * for (const cookie_ of App.getSetCookieFromResponse(response)) {
   *     const cookie: string = cookie_
   * }
   * ```
   * @param response The response to read cookies from.
   * @returns An iterator that yields key-value pairs as equal-sign-separated strings.
   */
  static getSetCookieFromResponse = getSetCookiesFromResponse;
  /**
   * If it is a known error code, try sending the according page (e.g. 404.astro / 500.astro).
   * This also handles pre-rendered /404 or /500 routes
   */
  async renderError(request, {
    status,
    response: originalResponse,
    skipMiddleware = false,
    error: error2,
    ...resolvedRenderOptions
  }) {
    const errorRoutePath = `/${status}${this.manifest.trailingSlash === "always" ? "/" : ""}`;
    const errorRouteData = matchRoute(errorRoutePath, this.manifestData);
    const url = new URL(request.url);
    if (errorRouteData) {
      if (errorRouteData.prerender) {
        const maybeDotHtml = errorRouteData.route.endsWith(`/${status}`) ? ".html" : "";
        const statusURL = new URL(`${this.baseWithoutTrailingSlash}/${status}${maybeDotHtml}`, url);
        if (statusURL.toString() !== request.url && resolvedRenderOptions.prerenderedErrorPageFetch) {
          const response2 = await resolvedRenderOptions.prerenderedErrorPageFetch(
            statusURL.toString()
          );
          const override = { status, removeContentEncodingHeaders: true };
          const newResponse = this.mergeResponses(response2, originalResponse, override);
          this.#prepareResponse(newResponse, resolvedRenderOptions);
          return newResponse;
        }
      }
      const mod = await this.pipeline.getComponentByRoute(errorRouteData);
      let session;
      try {
        const renderContext = await this.createRenderContext({
          locals: resolvedRenderOptions.locals,
          pipeline: this.pipeline,
          skipMiddleware,
          pathname: this.getPathnameFromRequest(request),
          request,
          routeData: errorRouteData,
          status,
          props: { error: error2 },
          clientAddress: resolvedRenderOptions.clientAddress
        });
        session = renderContext.session;
        const response2 = await renderContext.render(mod);
        const newResponse = this.mergeResponses(response2, originalResponse);
        this.#prepareResponse(newResponse, resolvedRenderOptions);
        return newResponse;
      } catch {
        if (skipMiddleware === false) {
          return this.renderError(request, {
            ...resolvedRenderOptions,
            status,
            response: originalResponse,
            skipMiddleware: true
          });
        }
      } finally {
        await session?.[PERSIST_SYMBOL]();
      }
    }
    const response = this.mergeResponses(new Response(null, { status }), originalResponse);
    this.#prepareResponse(response, resolvedRenderOptions);
    return response;
  }
  mergeResponses(newResponse, originalResponse, override) {
    let newResponseHeaders = newResponse.headers;
    if (override?.removeContentEncodingHeaders) {
      newResponseHeaders = new Headers(newResponseHeaders);
      newResponseHeaders.delete("Content-Encoding");
      newResponseHeaders.delete("Content-Length");
    }
    if (!originalResponse) {
      if (override !== void 0) {
        return new Response(newResponse.body, {
          status: override.status,
          statusText: newResponse.statusText,
          headers: newResponseHeaders
        });
      }
      return newResponse;
    }
    const status = override?.status ? override.status : originalResponse.status === 200 ? newResponse.status : originalResponse.status;
    try {
      originalResponse.headers.delete("Content-type");
      originalResponse.headers.delete("Content-Length");
      originalResponse.headers.delete("Transfer-Encoding");
    } catch {
    }
    const newHeaders = new Headers();
    const seen = /* @__PURE__ */ new Set();
    for (const [name, value] of originalResponse.headers) {
      newHeaders.append(name, value);
      seen.add(name.toLowerCase());
    }
    for (const [name, value] of newResponseHeaders) {
      if (!seen.has(name.toLowerCase())) {
        newHeaders.append(name, value);
      }
    }
    const mergedResponse = new Response(newResponse.body, {
      status,
      statusText: status === 200 ? newResponse.statusText : originalResponse.statusText,
      // If you're looking at here for possible bugs, it means that it's not a bug.
      // With the middleware, users can meddle with headers, and we should pass to the 404/500.
      // If users see something weird, it's because they are setting some headers they should not.
      //
      // Although, we don't want it to replace the content-type, because the error page must return `text/html`
      headers: newHeaders
    });
    const originalCookies = getCookiesFromResponse(originalResponse);
    const newCookies = getCookiesFromResponse(newResponse);
    if (originalCookies) {
      if (newCookies) {
        for (const cookieValue of AstroCookies.consume(newCookies)) {
          originalResponse.headers.append("set-cookie", cookieValue);
        }
      }
      attachCookiesToResponse(mergedResponse, originalCookies);
    } else if (newCookies) {
      attachCookiesToResponse(mergedResponse, newCookies);
    }
    return mergedResponse;
  }
  getDefaultStatusCode(routeData, pathname) {
    if (!routeData.pattern.test(pathname)) {
      for (const fallbackRoute of routeData.fallbackRoutes) {
        if (fallbackRoute.pattern.test(pathname)) {
          return 302;
        }
      }
    }
    const route = removeTrailingForwardSlash(routeData.route);
    if (route.endsWith("/404")) return 404;
    if (route.endsWith("/500")) return 500;
    return 200;
  }
  getManifest() {
    return this.pipeline.manifest;
  }
  logThisRequest({
    pathname,
    method,
    statusCode,
    isRewrite,
    timeStart
  }) {
    const timeEnd = performance.now();
    this.logRequest({
      pathname,
      method,
      statusCode,
      isRewrite,
      reqTime: timeEnd - timeStart
    });
  }
}
function getAssetsPrefix(fileExtension2, assetsPrefix) {
  let prefix = "";
  if (!assetsPrefix) {
    prefix = "";
  } else if (typeof assetsPrefix === "string") {
    prefix = assetsPrefix;
  } else {
    const dotLessFileExtension = fileExtension2.slice(1);
    prefix = assetsPrefix[dotLessFileExtension] || assetsPrefix.fallback;
  }
  return prefix;
}
const URL_PARSE_BASE = "https://astro.build";
function splitAssetPath(path) {
  const parsed = new URL(path, URL_PARSE_BASE);
  const isAbsolute = URL.canParse(path);
  const pathname = !isAbsolute && !path.startsWith("/") ? parsed.pathname.slice(1) : parsed.pathname;
  return {
    pathname,
    suffix: `${parsed.search}${parsed.hash}`
  };
}
function createAssetLink(href, base, assetsPrefix, queryParams) {
  const { pathname, suffix } = splitAssetPath(href);
  let url = "";
  if (assetsPrefix) {
    const pf = getAssetsPrefix(fileExtension(pathname), assetsPrefix);
    url = joinPaths(pf, slash(pathname)) + suffix;
  } else if (base) {
    url = prependForwardSlash(joinPaths(base, slash(pathname))) + suffix;
  } else {
    url = href;
  }
  return url;
}
function createStylesheetElement(stylesheet, base, assetsPrefix, queryParams) {
  if (stylesheet.type === "inline") {
    return {
      props: {},
      children: stylesheet.content
    };
  } else {
    return {
      props: {
        rel: "stylesheet",
        href: createAssetLink(stylesheet.src, base, assetsPrefix)
      },
      children: ""
    };
  }
}
function createStylesheetElementSet(stylesheets, base, assetsPrefix, queryParams) {
  return new Set(
    stylesheets.map((s2) => createStylesheetElement(s2, base, assetsPrefix))
  );
}
function createModuleScriptElement(script, base, assetsPrefix, queryParams) {
  if (script.type === "external") {
    return createModuleScriptElementWithSrc(script.value, base, assetsPrefix);
  } else {
    return {
      props: {
        type: "module"
      },
      children: script.value
    };
  }
}
function createModuleScriptElementWithSrc(src, base, assetsPrefix, queryParams) {
  return {
    props: {
      type: "module",
      src: createAssetLink(src, base, assetsPrefix)
    },
    children: ""
  };
}
function createConsoleLogger(level) {
  return new AstroLogger({
    destination: consoleLogDestination,
    level: level ?? "info"
  });
}
class AppPipeline extends Pipeline {
  getName() {
    return "AppPipeline";
  }
  static create({ manifest: manifest2, streaming }) {
    const resolve = async function resolve2(specifier) {
      if (!(specifier in manifest2.entryModules)) {
        throw new Error(`Unable to resolve [${specifier}]`);
      }
      const bundlePath = manifest2.entryModules[specifier];
      if (bundlePath.startsWith("data:") || bundlePath.length === 0) {
        return bundlePath;
      } else {
        return createAssetLink(bundlePath, manifest2.base, manifest2.assetsPrefix);
      }
    };
    const logger = createConsoleLogger(manifest2.logLevel);
    const pipeline = new AppPipeline(
      logger,
      manifest2,
      "production",
      manifest2.renderers,
      resolve,
      streaming,
      void 0,
      void 0,
      void 0,
      void 0,
      void 0,
      void 0,
      void 0,
      void 0
    );
    return pipeline;
  }
  async headElements(routeData) {
    const { assetsPrefix, base } = this.manifest;
    const routeInfo = this.manifest.routes.find(
      (route) => route.routeData.route === routeData.route
    );
    const links = /* @__PURE__ */ new Set();
    const scripts = /* @__PURE__ */ new Set();
    const styles = createStylesheetElementSet(routeInfo?.styles ?? [], base, assetsPrefix);
    for (const script of routeInfo?.scripts ?? []) {
      if ("stage" in script) {
        if (script.stage === "head-inline") {
          scripts.add({
            props: {},
            children: script.children
          });
        }
      } else {
        scripts.add(createModuleScriptElement(script, base, assetsPrefix));
      }
    }
    return { links, styles, scripts };
  }
  componentMetadata() {
  }
  async getComponentByRoute(routeData) {
    const module = await this.getModuleForRoute(routeData);
    return module.page();
  }
  async getModuleForRoute(route) {
    for (const defaultRoute of this.defaultRoutes) {
      if (route.component === defaultRoute.component) {
        return {
          page: () => Promise.resolve(defaultRoute.instance)
        };
      }
    }
    let routeToProcess = route;
    if (routeIsRedirect(route)) {
      if (route.redirectRoute) {
        routeToProcess = route.redirectRoute;
      } else {
        return RedirectSinglePageBuiltModule;
      }
    } else if (routeIsFallback(route)) {
      routeToProcess = getFallbackRoute(route, this.manifest.routes);
    }
    if (this.manifest.pageMap) {
      const importComponentInstance = this.manifest.pageMap.get(routeToProcess.component);
      if (!importComponentInstance) {
        throw new Error(
          `Unexpectedly unable to find a component instance for route ${route.route}`
        );
      }
      return await importComponentInstance();
    } else if (this.manifest.pageModule) {
      return this.manifest.pageModule;
    }
    throw new Error(
      "Astro couldn't find the correct page to render, probably because it wasn't correctly mapped for SSR usage. This is an internal error, please file an issue."
    );
  }
  async tryRewrite(payload, request) {
    const { newUrl, pathname, routeData } = findRouteToRewrite({
      payload,
      request,
      routes: this.manifest?.routes.map((r) => r.routeData),
      trailingSlash: this.manifest.trailingSlash,
      buildFormat: this.manifest.buildFormat,
      base: this.manifest.base,
      outDir: this.manifest?.serverLike ? this.manifest.buildClientDir : this.manifest.outDir
    });
    const componentInstance = await this.getComponentByRoute(routeData);
    return { newUrl, pathname, componentInstance, routeData };
  }
}
class App extends BaseApp {
  createPipeline(streaming) {
    return AppPipeline.create({
      manifest: this.manifest,
      streaming
    });
  }
  isDev() {
    return false;
  }
  // Should we log something for our users?
  logRequest(_options) {
  }
}
const renderers = [];
const serializedData = [{ "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "type": "page", "component": "_server-islands.astro", "params": ["name"], "segments": [[{ "content": "_server-islands", "dynamic": false, "spread": false }], [{ "content": "name", "dynamic": true, "spread": false }]], "pattern": "^\\/_server-islands\\/([^/]+?)\\/?$", "prerender": false, "isIndex": false, "fallbackRoutes": [], "route": "/_server-islands/[name]", "origin": "internal", "distURL": [], "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/_image", "component": "node_modules/.pnpm/@astrojs+cloudflare@13.2.2_@types+node@25.6.0_astro@6.1.10_@types+node@25.6.0_jiti@2.6.1_ligh_clyr42orzduuomti5kmxdgziha/node_modules/@astrojs/cloudflare/dist/entrypoints/image-transform-endpoint.js", "params": [], "pathname": "/_image", "pattern": "^\\/_image\\/?$", "segments": [[{ "content": "_image", "dynamic": false, "spread": false }]], "type": "endpoint", "prerender": false, "fallbackRoutes": [], "distURL": [], "isIndex": false, "origin": "internal", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/account", "isIndex": false, "type": "page", "pattern": "^\\/account\\/?$", "segments": [[{ "content": "account", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/account.astro", "pathname": "/account", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/admin/ai-tools", "isIndex": false, "type": "page", "pattern": "^\\/admin\\/ai-tools\\/?$", "segments": [[{ "content": "admin", "dynamic": false, "spread": false }], [{ "content": "ai-tools", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/admin/ai-tools.astro", "pathname": "/admin/ai-tools", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/admin/blogs", "isIndex": false, "type": "page", "pattern": "^\\/admin\\/blogs\\/?$", "segments": [[{ "content": "admin", "dynamic": false, "spread": false }], [{ "content": "blogs", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/admin/blogs.astro", "pathname": "/admin/blogs", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/admin/businesses", "isIndex": false, "type": "page", "pattern": "^\\/admin\\/businesses\\/?$", "segments": [[{ "content": "admin", "dynamic": false, "spread": false }], [{ "content": "businesses", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/admin/businesses.astro", "pathname": "/admin/businesses", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/admin/categories", "isIndex": false, "type": "page", "pattern": "^\\/admin\\/categories\\/?$", "segments": [[{ "content": "admin", "dynamic": false, "spread": false }], [{ "content": "categories", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/admin/categories.astro", "pathname": "/admin/categories", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/admin/heroes", "isIndex": false, "type": "page", "pattern": "^\\/admin\\/heroes\\/?$", "segments": [[{ "content": "admin", "dynamic": false, "spread": false }], [{ "content": "heroes", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/admin/heroes.astro", "pathname": "/admin/heroes", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/admin/listing/new", "isIndex": true, "type": "page", "pattern": "^\\/admin\\/listing\\/new\\/?$", "segments": [[{ "content": "admin", "dynamic": false, "spread": false }], [{ "content": "listing", "dynamic": false, "spread": false }], [{ "content": "new", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/admin/listing/new/index.astro", "pathname": "/admin/listing/new", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/admin/listing/[id]/edit", "isIndex": true, "type": "page", "pattern": "^\\/admin\\/listing\\/([^/]+?)\\/edit\\/?$", "segments": [[{ "content": "admin", "dynamic": false, "spread": false }], [{ "content": "listing", "dynamic": false, "spread": false }], [{ "content": "id", "dynamic": true, "spread": false }], [{ "content": "edit", "dynamic": false, "spread": false }]], "params": ["id"], "component": "src/pages/admin/listing/[id]/edit/index.astro", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/admin/listing", "isIndex": true, "type": "page", "pattern": "^\\/admin\\/listing\\/?$", "segments": [[{ "content": "admin", "dynamic": false, "spread": false }], [{ "content": "listing", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/admin/listing/index.astro", "pathname": "/admin/listing", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/admin/login", "isIndex": false, "type": "page", "pattern": "^\\/admin\\/login\\/?$", "segments": [[{ "content": "admin", "dynamic": false, "spread": false }], [{ "content": "login", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/admin/login.astro", "pathname": "/admin/login", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/admin/reviews", "isIndex": false, "type": "page", "pattern": "^\\/admin\\/reviews\\/?$", "segments": [[{ "content": "admin", "dynamic": false, "spread": false }], [{ "content": "reviews", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/admin/reviews.astro", "pathname": "/admin/reviews", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/admin/settings", "isIndex": false, "type": "page", "pattern": "^\\/admin\\/settings\\/?$", "segments": [[{ "content": "admin", "dynamic": false, "spread": false }], [{ "content": "settings", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/admin/settings.astro", "pathname": "/admin/settings", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/admin/skus", "isIndex": false, "type": "page", "pattern": "^\\/admin\\/skus\\/?$", "segments": [[{ "content": "admin", "dynamic": false, "spread": false }], [{ "content": "skus", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/admin/skus.astro", "pathname": "/admin/skus", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/admin/subscriptions", "isIndex": false, "type": "page", "pattern": "^\\/admin\\/subscriptions\\/?$", "segments": [[{ "content": "admin", "dynamic": false, "spread": false }], [{ "content": "subscriptions", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/admin/subscriptions.astro", "pathname": "/admin/subscriptions", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/admin/users", "isIndex": false, "type": "page", "pattern": "^\\/admin\\/users\\/?$", "segments": [[{ "content": "admin", "dynamic": false, "spread": false }], [{ "content": "users", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/admin/users.astro", "pathname": "/admin/users", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/admin", "isIndex": true, "type": "page", "pattern": "^\\/admin\\/?$", "segments": [[{ "content": "admin", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/admin/index.astro", "pathname": "/admin", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/api/account/businesses/[uid]", "isIndex": false, "type": "endpoint", "pattern": "^\\/api\\/account\\/businesses\\/([^/]+?)\\/?$", "segments": [[{ "content": "api", "dynamic": false, "spread": false }], [{ "content": "account", "dynamic": false, "spread": false }], [{ "content": "businesses", "dynamic": false, "spread": false }], [{ "content": "uid", "dynamic": true, "spread": false }]], "params": ["uid"], "component": "src/pages/api/account/businesses/[uid].ts", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/api/account/profile/[uid]", "isIndex": false, "type": "endpoint", "pattern": "^\\/api\\/account\\/profile\\/([^/]+?)\\/?$", "segments": [[{ "content": "api", "dynamic": false, "spread": false }], [{ "content": "account", "dynamic": false, "spread": false }], [{ "content": "profile", "dynamic": false, "spread": false }], [{ "content": "uid", "dynamic": true, "spread": false }]], "params": ["uid"], "component": "src/pages/api/account/profile/[uid].ts", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/api/account/subscription/[uid]", "isIndex": false, "type": "endpoint", "pattern": "^\\/api\\/account\\/subscription\\/([^/]+?)\\/?$", "segments": [[{ "content": "api", "dynamic": false, "spread": false }], [{ "content": "account", "dynamic": false, "spread": false }], [{ "content": "subscription", "dynamic": false, "spread": false }], [{ "content": "uid", "dynamic": true, "spread": false }]], "params": ["uid"], "component": "src/pages/api/account/subscription/[uid].ts", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/api/account", "isIndex": true, "type": "endpoint", "pattern": "^\\/api\\/account\\/?$", "segments": [[{ "content": "api", "dynamic": false, "spread": false }], [{ "content": "account", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/api/account/index.ts", "pathname": "/api/account", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/api/admin/ai-generate", "isIndex": false, "type": "endpoint", "pattern": "^\\/api\\/admin\\/ai-generate\\/?$", "segments": [[{ "content": "api", "dynamic": false, "spread": false }], [{ "content": "admin", "dynamic": false, "spread": false }], [{ "content": "ai-generate", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/api/admin/ai-generate.ts", "pathname": "/api/admin/ai-generate", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/api/admin/auth/login", "isIndex": false, "type": "endpoint", "pattern": "^\\/api\\/admin\\/auth\\/login\\/?$", "segments": [[{ "content": "api", "dynamic": false, "spread": false }], [{ "content": "admin", "dynamic": false, "spread": false }], [{ "content": "auth", "dynamic": false, "spread": false }], [{ "content": "login", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/api/admin/auth/login.ts", "pathname": "/api/admin/auth/login", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/api/admin/blogs", "isIndex": true, "type": "endpoint", "pattern": "^\\/api\\/admin\\/blogs\\/?$", "segments": [[{ "content": "api", "dynamic": false, "spread": false }], [{ "content": "admin", "dynamic": false, "spread": false }], [{ "content": "blogs", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/api/admin/blogs/index.ts", "pathname": "/api/admin/blogs", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/api/admin/businesses", "isIndex": true, "type": "endpoint", "pattern": "^\\/api\\/admin\\/businesses\\/?$", "segments": [[{ "content": "api", "dynamic": false, "spread": false }], [{ "content": "admin", "dynamic": false, "spread": false }], [{ "content": "businesses", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/api/admin/businesses/index.ts", "pathname": "/api/admin/businesses", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/api/admin/categories", "isIndex": true, "type": "endpoint", "pattern": "^\\/api\\/admin\\/categories\\/?$", "segments": [[{ "content": "api", "dynamic": false, "spread": false }], [{ "content": "admin", "dynamic": false, "spread": false }], [{ "content": "categories", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/api/admin/categories/index.ts", "pathname": "/api/admin/categories", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/api/admin/listing/[id]", "isIndex": false, "type": "endpoint", "pattern": "^\\/api\\/admin\\/listing\\/([^/]+?)\\/?$", "segments": [[{ "content": "api", "dynamic": false, "spread": false }], [{ "content": "admin", "dynamic": false, "spread": false }], [{ "content": "listing", "dynamic": false, "spread": false }], [{ "content": "id", "dynamic": true, "spread": false }]], "params": ["id"], "component": "src/pages/api/admin/listing/[id].ts", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/api/admin/listing", "isIndex": true, "type": "endpoint", "pattern": "^\\/api\\/admin\\/listing\\/?$", "segments": [[{ "content": "api", "dynamic": false, "spread": false }], [{ "content": "admin", "dynamic": false, "spread": false }], [{ "content": "listing", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/api/admin/listing/index.ts", "pathname": "/api/admin/listing", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/api/admin/orders/[id]/status", "isIndex": false, "type": "endpoint", "pattern": "^\\/api\\/admin\\/orders\\/([^/]+?)\\/status\\/?$", "segments": [[{ "content": "api", "dynamic": false, "spread": false }], [{ "content": "admin", "dynamic": false, "spread": false }], [{ "content": "orders", "dynamic": false, "spread": false }], [{ "content": "id", "dynamic": true, "spread": false }], [{ "content": "status", "dynamic": false, "spread": false }]], "params": ["id"], "component": "src/pages/api/admin/orders/[id]/status.ts", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/api/admin/orders/[id]", "isIndex": false, "type": "endpoint", "pattern": "^\\/api\\/admin\\/orders\\/([^/]+?)\\/?$", "segments": [[{ "content": "api", "dynamic": false, "spread": false }], [{ "content": "admin", "dynamic": false, "spread": false }], [{ "content": "orders", "dynamic": false, "spread": false }], [{ "content": "id", "dynamic": true, "spread": false }]], "params": ["id"], "component": "src/pages/api/admin/orders/[id].ts", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/api/admin/orders", "isIndex": true, "type": "endpoint", "pattern": "^\\/api\\/admin\\/orders\\/?$", "segments": [[{ "content": "api", "dynamic": false, "spread": false }], [{ "content": "admin", "dynamic": false, "spread": false }], [{ "content": "orders", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/api/admin/orders/index.ts", "pathname": "/api/admin/orders", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/api/admin/reviews/[id]", "isIndex": false, "type": "endpoint", "pattern": "^\\/api\\/admin\\/reviews\\/([^/]+?)\\/?$", "segments": [[{ "content": "api", "dynamic": false, "spread": false }], [{ "content": "admin", "dynamic": false, "spread": false }], [{ "content": "reviews", "dynamic": false, "spread": false }], [{ "content": "id", "dynamic": true, "spread": false }]], "params": ["id"], "component": "src/pages/api/admin/reviews/[id].ts", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/api/admin/reviews", "isIndex": true, "type": "endpoint", "pattern": "^\\/api\\/admin\\/reviews\\/?$", "segments": [[{ "content": "api", "dynamic": false, "spread": false }], [{ "content": "admin", "dynamic": false, "spread": false }], [{ "content": "reviews", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/api/admin/reviews/index.ts", "pathname": "/api/admin/reviews", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/api/admin/settings/save", "isIndex": false, "type": "endpoint", "pattern": "^\\/api\\/admin\\/settings\\/save\\/?$", "segments": [[{ "content": "api", "dynamic": false, "spread": false }], [{ "content": "admin", "dynamic": false, "spread": false }], [{ "content": "settings", "dynamic": false, "spread": false }], [{ "content": "save", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/api/admin/settings/save.ts", "pathname": "/api/admin/settings/save", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/api/admin/settings", "isIndex": true, "type": "endpoint", "pattern": "^\\/api\\/admin\\/settings\\/?$", "segments": [[{ "content": "api", "dynamic": false, "spread": false }], [{ "content": "admin", "dynamic": false, "spread": false }], [{ "content": "settings", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/api/admin/settings/index.ts", "pathname": "/api/admin/settings", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/api/admin/skus", "isIndex": true, "type": "endpoint", "pattern": "^\\/api\\/admin\\/skus\\/?$", "segments": [[{ "content": "api", "dynamic": false, "spread": false }], [{ "content": "admin", "dynamic": false, "spread": false }], [{ "content": "skus", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/api/admin/skus/index.ts", "pathname": "/api/admin/skus", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/api/admin/stats", "isIndex": false, "type": "endpoint", "pattern": "^\\/api\\/admin\\/stats\\/?$", "segments": [[{ "content": "api", "dynamic": false, "spread": false }], [{ "content": "admin", "dynamic": false, "spread": false }], [{ "content": "stats", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/api/admin/stats.ts", "pathname": "/api/admin/stats", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/api/admin/users", "isIndex": true, "type": "endpoint", "pattern": "^\\/api\\/admin\\/users\\/?$", "segments": [[{ "content": "api", "dynamic": false, "spread": false }], [{ "content": "admin", "dynamic": false, "spread": false }], [{ "content": "users", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/api/admin/users/index.ts", "pathname": "/api/admin/users", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/api/ai-test", "isIndex": false, "type": "endpoint", "pattern": "^\\/api\\/ai-test\\/?$", "segments": [[{ "content": "api", "dynamic": false, "spread": false }], [{ "content": "ai-test", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/api/ai-test.ts", "pathname": "/api/ai-test", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/api/auth/forgot-password", "isIndex": false, "type": "endpoint", "pattern": "^\\/api\\/auth\\/forgot-password\\/?$", "segments": [[{ "content": "api", "dynamic": false, "spread": false }], [{ "content": "auth", "dynamic": false, "spread": false }], [{ "content": "forgot-password", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/api/auth/forgot-password.ts", "pathname": "/api/auth/forgot-password", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/api/auth/index.test", "isIndex": false, "type": "endpoint", "pattern": "^\\/api\\/auth\\/index\\.test$", "segments": [[{ "content": "api", "dynamic": false, "spread": false }], [{ "content": "auth", "dynamic": false, "spread": false }], [{ "content": "index.test", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/api/auth/index.test.ts", "pathname": "/api/auth/index.test", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/api/auth/reset-password", "isIndex": false, "type": "endpoint", "pattern": "^\\/api\\/auth\\/reset-password\\/?$", "segments": [[{ "content": "api", "dynamic": false, "spread": false }], [{ "content": "auth", "dynamic": false, "spread": false }], [{ "content": "reset-password", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/api/auth/reset-password.ts", "pathname": "/api/auth/reset-password", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/api/auth/session", "isIndex": false, "type": "endpoint", "pattern": "^\\/api\\/auth\\/session\\/?$", "segments": [[{ "content": "api", "dynamic": false, "spread": false }], [{ "content": "auth", "dynamic": false, "spread": false }], [{ "content": "session", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/api/auth/session.ts", "pathname": "/api/auth/session", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/api/auth/sign-in", "isIndex": false, "type": "endpoint", "pattern": "^\\/api\\/auth\\/sign-in\\/?$", "segments": [[{ "content": "api", "dynamic": false, "spread": false }], [{ "content": "auth", "dynamic": false, "spread": false }], [{ "content": "sign-in", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/api/auth/sign-in.ts", "pathname": "/api/auth/sign-in", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/api/auth/sign-out", "isIndex": false, "type": "endpoint", "pattern": "^\\/api\\/auth\\/sign-out\\/?$", "segments": [[{ "content": "api", "dynamic": false, "spread": false }], [{ "content": "auth", "dynamic": false, "spread": false }], [{ "content": "sign-out", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/api/auth/sign-out.ts", "pathname": "/api/auth/sign-out", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/api/auth/sign-up", "isIndex": false, "type": "endpoint", "pattern": "^\\/api\\/auth\\/sign-up\\/?$", "segments": [[{ "content": "api", "dynamic": false, "spread": false }], [{ "content": "auth", "dynamic": false, "spread": false }], [{ "content": "sign-up", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/api/auth/sign-up.ts", "pathname": "/api/auth/sign-up", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/api/auth/verify-email", "isIndex": false, "type": "endpoint", "pattern": "^\\/api\\/auth\\/verify-email\\/?$", "segments": [[{ "content": "api", "dynamic": false, "spread": false }], [{ "content": "auth", "dynamic": false, "spread": false }], [{ "content": "verify-email", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/api/auth/verify-email.ts", "pathname": "/api/auth/verify-email", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/api/banners/active", "isIndex": false, "type": "endpoint", "pattern": "^\\/api\\/banners\\/active\\/?$", "segments": [[{ "content": "api", "dynamic": false, "spread": false }], [{ "content": "banners", "dynamic": false, "spread": false }], [{ "content": "active", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/api/banners/active.ts", "pathname": "/api/banners/active", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/api/banners/[id]", "isIndex": false, "type": "endpoint", "pattern": "^\\/api\\/banners\\/([^/]+?)\\/?$", "segments": [[{ "content": "api", "dynamic": false, "spread": false }], [{ "content": "banners", "dynamic": false, "spread": false }], [{ "content": "id", "dynamic": true, "spread": false }]], "params": ["id"], "component": "src/pages/api/banners/[id].ts", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/api/banners", "isIndex": true, "type": "endpoint", "pattern": "^\\/api\\/banners\\/?$", "segments": [[{ "content": "api", "dynamic": false, "spread": false }], [{ "content": "banners", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/api/banners/index.ts", "pathname": "/api/banners", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/api/businesses/create", "isIndex": false, "type": "endpoint", "pattern": "^\\/api\\/businesses\\/create\\/?$", "segments": [[{ "content": "api", "dynamic": false, "spread": false }], [{ "content": "businesses", "dynamic": false, "spread": false }], [{ "content": "create", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/api/businesses/create.ts", "pathname": "/api/businesses/create", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/api/businesses/featured", "isIndex": false, "type": "endpoint", "pattern": "^\\/api\\/businesses\\/featured\\/?$", "segments": [[{ "content": "api", "dynamic": false, "spread": false }], [{ "content": "businesses", "dynamic": false, "spread": false }], [{ "content": "featured", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/api/businesses/featured.ts", "pathname": "/api/businesses/featured", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/api/businesses/index.test", "isIndex": false, "type": "endpoint", "pattern": "^\\/api\\/businesses\\/index\\.test$", "segments": [[{ "content": "api", "dynamic": false, "spread": false }], [{ "content": "businesses", "dynamic": false, "spread": false }], [{ "content": "index.test", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/api/businesses/index.test.ts", "pathname": "/api/businesses/index.test", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/api/businesses/[slug]/like", "isIndex": false, "type": "endpoint", "pattern": "^\\/api\\/businesses\\/([^/]+?)\\/like\\/?$", "segments": [[{ "content": "api", "dynamic": false, "spread": false }], [{ "content": "businesses", "dynamic": false, "spread": false }], [{ "content": "slug", "dynamic": true, "spread": false }], [{ "content": "like", "dynamic": false, "spread": false }]], "params": ["slug"], "component": "src/pages/api/businesses/[slug]/like.ts", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/api/businesses/[slug]", "isIndex": false, "type": "endpoint", "pattern": "^\\/api\\/businesses\\/([^/]+?)\\/?$", "segments": [[{ "content": "api", "dynamic": false, "spread": false }], [{ "content": "businesses", "dynamic": false, "spread": false }], [{ "content": "slug", "dynamic": true, "spread": false }]], "params": ["slug"], "component": "src/pages/api/businesses/[slug].ts", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/api/businesses", "isIndex": true, "type": "endpoint", "pattern": "^\\/api\\/businesses\\/?$", "segments": [[{ "content": "api", "dynamic": false, "spread": false }], [{ "content": "businesses", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/api/businesses/index.ts", "pathname": "/api/businesses", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/api/categories/[slug]/listings", "isIndex": false, "type": "endpoint", "pattern": "^\\/api\\/categories\\/([^/]+?)\\/listings\\/?$", "segments": [[{ "content": "api", "dynamic": false, "spread": false }], [{ "content": "categories", "dynamic": false, "spread": false }], [{ "content": "slug", "dynamic": true, "spread": false }], [{ "content": "listings", "dynamic": false, "spread": false }]], "params": ["slug"], "component": "src/pages/api/categories/[slug]/listings.ts", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/api/categories", "isIndex": true, "type": "endpoint", "pattern": "^\\/api\\/categories\\/?$", "segments": [[{ "content": "api", "dynamic": false, "spread": false }], [{ "content": "categories", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/api/categories/index.ts", "pathname": "/api/categories", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/api/media/upload", "isIndex": false, "type": "endpoint", "pattern": "^\\/api\\/media\\/upload\\/?$", "segments": [[{ "content": "api", "dynamic": false, "spread": false }], [{ "content": "media", "dynamic": false, "spread": false }], [{ "content": "upload", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/api/media/upload.ts", "pathname": "/api/media/upload", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/api/media/[id]", "isIndex": false, "type": "endpoint", "pattern": "^\\/api\\/media\\/([^/]+?)\\/?$", "segments": [[{ "content": "api", "dynamic": false, "spread": false }], [{ "content": "media", "dynamic": false, "spread": false }], [{ "content": "id", "dynamic": true, "spread": false }]], "params": ["id"], "component": "src/pages/api/media/[id].ts", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/api/media", "isIndex": true, "type": "endpoint", "pattern": "^\\/api\\/media\\/?$", "segments": [[{ "content": "api", "dynamic": false, "spread": false }], [{ "content": "media", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/api/media/index.ts", "pathname": "/api/media", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/api/orders", "isIndex": true, "type": "endpoint", "pattern": "^\\/api\\/orders\\/?$", "segments": [[{ "content": "api", "dynamic": false, "spread": false }], [{ "content": "orders", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/api/orders/index.ts", "pathname": "/api/orders", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/api/products/[businesspageid]/sku-usage", "isIndex": false, "type": "endpoint", "pattern": "^\\/api\\/products\\/([^/]+?)\\/sku-usage\\/?$", "segments": [[{ "content": "api", "dynamic": false, "spread": false }], [{ "content": "products", "dynamic": false, "spread": false }], [{ "content": "businessPageId", "dynamic": true, "spread": false }], [{ "content": "sku-usage", "dynamic": false, "spread": false }]], "params": ["businessPageId"], "component": "src/pages/api/products/[businessPageId]/sku-usage.ts", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/api/products/[id]", "isIndex": false, "type": "endpoint", "pattern": "^\\/api\\/products\\/([^/]+?)\\/?$", "segments": [[{ "content": "api", "dynamic": false, "spread": false }], [{ "content": "products", "dynamic": false, "spread": false }], [{ "content": "id", "dynamic": true, "spread": false }]], "params": ["id"], "component": "src/pages/api/products/[id].ts", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/api/products", "isIndex": true, "type": "endpoint", "pattern": "^\\/api\\/products\\/?$", "segments": [[{ "content": "api", "dynamic": false, "spread": false }], [{ "content": "products", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/api/products/index.ts", "pathname": "/api/products", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/api/reviews/[id]/reply", "isIndex": false, "type": "endpoint", "pattern": "^\\/api\\/reviews\\/([^/]+?)\\/reply\\/?$", "segments": [[{ "content": "api", "dynamic": false, "spread": false }], [{ "content": "reviews", "dynamic": false, "spread": false }], [{ "content": "id", "dynamic": true, "spread": false }], [{ "content": "reply", "dynamic": false, "spread": false }]], "params": ["id"], "component": "src/pages/api/reviews/[id]/reply.ts", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/api/reviews/[id]/reply.test", "isIndex": false, "type": "endpoint", "pattern": "^\\/api\\/reviews\\/([^/]+?)\\/reply\\.test\\/?$", "segments": [[{ "content": "api", "dynamic": false, "spread": false }], [{ "content": "reviews", "dynamic": false, "spread": false }], [{ "content": "id", "dynamic": true, "spread": false }], [{ "content": "reply.test", "dynamic": false, "spread": false }]], "params": ["id"], "component": "src/pages/api/reviews/[id]/reply.test.ts", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/api/reviews", "isIndex": true, "type": "endpoint", "pattern": "^\\/api\\/reviews\\/?$", "segments": [[{ "content": "api", "dynamic": false, "spread": false }], [{ "content": "reviews", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/api/reviews/index.ts", "pathname": "/api/reviews", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/api/settings/public/index.test", "isIndex": false, "type": "endpoint", "pattern": "^\\/api\\/settings\\/public\\/index\\.test$", "segments": [[{ "content": "api", "dynamic": false, "spread": false }], [{ "content": "settings", "dynamic": false, "spread": false }], [{ "content": "public", "dynamic": false, "spread": false }], [{ "content": "index.test", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/api/settings/public/index.test.ts", "pathname": "/api/settings/public/index.test", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/api/settings/public", "isIndex": true, "type": "endpoint", "pattern": "^\\/api\\/settings\\/public\\/?$", "segments": [[{ "content": "api", "dynamic": false, "spread": false }], [{ "content": "settings", "dynamic": false, "spread": false }], [{ "content": "public", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/api/settings/public/index.ts", "pathname": "/api/settings/public", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/business/create", "isIndex": false, "type": "page", "pattern": "^\\/business\\/create\\/?$", "segments": [[{ "content": "business", "dynamic": false, "spread": false }], [{ "content": "create", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/business/create.astro", "pathname": "/business/create", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/business/[slug]/edit", "isIndex": true, "type": "page", "pattern": "^\\/business\\/([^/]+?)\\/edit\\/?$", "segments": [[{ "content": "business", "dynamic": false, "spread": false }], [{ "content": "slug", "dynamic": true, "spread": false }], [{ "content": "edit", "dynamic": false, "spread": false }]], "params": ["slug"], "component": "src/pages/business/[slug]/edit/index.astro", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/business/[slug]/product/new", "isIndex": true, "type": "page", "pattern": "^\\/business\\/([^/]+?)\\/product\\/new\\/?$", "segments": [[{ "content": "business", "dynamic": false, "spread": false }], [{ "content": "slug", "dynamic": true, "spread": false }], [{ "content": "product", "dynamic": false, "spread": false }], [{ "content": "new", "dynamic": false, "spread": false }]], "params": ["slug"], "component": "src/pages/business/[slug]/product/new/index.astro", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/business/[slug]/product/[id]/edit", "isIndex": true, "type": "page", "pattern": "^\\/business\\/([^/]+?)\\/product\\/([^/]+?)\\/edit\\/?$", "segments": [[{ "content": "business", "dynamic": false, "spread": false }], [{ "content": "slug", "dynamic": true, "spread": false }], [{ "content": "product", "dynamic": false, "spread": false }], [{ "content": "id", "dynamic": true, "spread": false }], [{ "content": "edit", "dynamic": false, "spread": false }]], "params": ["slug", "id"], "component": "src/pages/business/[slug]/product/[id]/edit/index.astro", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/business/[slug]/product/[id]", "isIndex": true, "type": "page", "pattern": "^\\/business\\/([^/]+?)\\/product\\/([^/]+?)\\/?$", "segments": [[{ "content": "business", "dynamic": false, "spread": false }], [{ "content": "slug", "dynamic": true, "spread": false }], [{ "content": "product", "dynamic": false, "spread": false }], [{ "content": "id", "dynamic": true, "spread": false }]], "params": ["slug", "id"], "component": "src/pages/business/[slug]/product/[id]/index.astro", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/business/[slug]/products", "isIndex": false, "type": "page", "pattern": "^\\/business\\/([^/]+?)\\/products\\/?$", "segments": [[{ "content": "business", "dynamic": false, "spread": false }], [{ "content": "slug", "dynamic": true, "spread": false }], [{ "content": "products", "dynamic": false, "spread": false }]], "params": ["slug"], "component": "src/pages/business/[slug]/products.astro", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/business/[slug]", "isIndex": false, "type": "page", "pattern": "^\\/business\\/([^/]+?)\\/?$", "segments": [[{ "content": "business", "dynamic": false, "spread": false }], [{ "content": "slug", "dynamic": true, "spread": false }]], "params": ["slug"], "component": "src/pages/business/[slug].astro", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/businesses", "isIndex": true, "type": "page", "pattern": "^\\/businesses\\/?$", "segments": [[{ "content": "businesses", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/businesses/index.astro", "pathname": "/businesses", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/categories", "isIndex": true, "type": "page", "pattern": "^\\/categories\\/?$", "segments": [[{ "content": "categories", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/categories/index.astro", "pathname": "/categories", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/dashboard", "isIndex": false, "type": "page", "pattern": "^\\/dashboard\\/?$", "segments": [[{ "content": "dashboard", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/dashboard.astro", "pathname": "/dashboard", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/edit-business-page/[id]", "isIndex": false, "type": "page", "pattern": "^\\/edit-business-page\\/([^/]+?)\\/?$", "segments": [[{ "content": "edit-business-page", "dynamic": false, "spread": false }], [{ "content": "id", "dynamic": true, "spread": false }]], "params": ["id"], "component": "src/pages/edit-business-page/[id].astro", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/forgot-password", "isIndex": false, "type": "page", "pattern": "^\\/forgot-password\\/?$", "segments": [[{ "content": "forgot-password", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/forgot-password.astro", "pathname": "/forgot-password", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/listing/create", "isIndex": false, "type": "page", "pattern": "^\\/listing\\/create\\/?$", "segments": [[{ "content": "listing", "dynamic": false, "spread": false }], [{ "content": "create", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/listing/create.astro", "pathname": "/listing/create", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/listing", "isIndex": true, "type": "page", "pattern": "^\\/listing\\/?$", "segments": [[{ "content": "listing", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/listing/index.astro", "pathname": "/listing", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/login", "isIndex": false, "type": "page", "pattern": "^\\/login\\/?$", "segments": [[{ "content": "login", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/login.astro", "pathname": "/login", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/organization/[slug]", "isIndex": false, "type": "page", "pattern": "^\\/organization\\/([^/]+?)\\/?$", "segments": [[{ "content": "organization", "dynamic": false, "spread": false }], [{ "content": "slug", "dynamic": true, "spread": false }]], "params": ["slug"], "component": "src/pages/organization/[slug].astro", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/organization", "isIndex": true, "type": "page", "pattern": "^\\/organization\\/?$", "segments": [[{ "content": "organization", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/organization/index.astro", "pathname": "/organization", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/products-services", "isIndex": true, "type": "page", "pattern": "^\\/products-services\\/?$", "segments": [[{ "content": "products-services", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/products-services/index.astro", "pathname": "/products-services", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/register", "isIndex": false, "type": "page", "pattern": "^\\/register\\/?$", "segments": [[{ "content": "register", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/register.astro", "pathname": "/register", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/reset-password", "isIndex": false, "type": "page", "pattern": "^\\/reset-password\\/?$", "segments": [[{ "content": "reset-password", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/reset-password.astro", "pathname": "/reset-password", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/search", "isIndex": false, "type": "page", "pattern": "^\\/search\\/?$", "segments": [[{ "content": "search", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/search.astro", "pathname": "/search", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/subscribe", "isIndex": false, "type": "page", "pattern": "^\\/subscribe\\/?$", "segments": [[{ "content": "subscribe", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/subscribe.astro", "pathname": "/subscribe", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/verify", "isIndex": false, "type": "page", "pattern": "^\\/verify\\/?$", "segments": [[{ "content": "verify", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/verify.astro", "pathname": "/verify", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/", "isIndex": true, "type": "page", "pattern": "^\\/$", "segments": [], "params": [], "component": "src/pages/index.astro", "pathname": "/", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }];
serializedData.map(deserializeRouteInfo);
const _page0 = () => import("./image-transform-endpoint_D4iZstOF.mjs").then((n) => n.i);
const _page1 = () => import("./account_CKsnI65M.mjs");
const _page2 = () => import("./ai-tools_DAJcTqbK.mjs");
const _page3 = () => import("./blogs_BHVJjNDq.mjs");
const _page4 = () => import("./businesses_Dj08GVUm.mjs");
const _page5 = () => import("./categories_CSort1ni.mjs");
const _page6 = () => import("./heroes_BDdWMyQg.mjs");
const _page7 = () => import("./index_Cdik8q7f.mjs");
const _page8 = () => import("./index_BMCW5LTo.mjs");
const _page9 = () => import("./index_CarnYCiS.mjs");
const _page10 = () => import("./login_JVuFjXOI.mjs");
const _page11 = () => import("./reviews_Ca_Jk41i.mjs");
const _page12 = () => import("./settings_Dor0RXFC.mjs");
const _page13 = () => import("./skus_CZfVHB6o.mjs");
const _page14 = () => import("./subscriptions_D_kDCx9g.mjs");
const _page15 = () => import("./users_DnNZxIbG.mjs");
const _page16 = () => import("./index_CBOeOKPj.mjs");
const _page17 = () => import("./_uid__B8pD6GLu.mjs");
const _page18 = () => import("./_uid__BGBSaBaJ.mjs");
const _page19 = () => import("./_uid__DAWlCmbM.mjs");
const _page20 = () => import("./index_B0dzHYgg.mjs");
const _page21 = () => import("./ai-generate_CN3Ncyxv.mjs");
const _page22 = () => import("./login_D72be8uw.mjs");
const _page23 = () => import("./index_BZkt4r6a.mjs");
const _page24 = () => import("./index_BNpocdLH.mjs");
const _page25 = () => import("./index_CAGSfl1d.mjs");
const _page26 = () => import("./_id__CNKJDWbY.mjs");
const _page27 = () => import("./index_DyIUDBlH.mjs");
const _page28 = () => import("./status_-ZKD17HL.mjs");
const _page29 = () => import("./_id__qyFTyDey.mjs");
const _page30 = () => import("./index_D9eUo-g1.mjs");
const _page31 = () => import("./_id__NylUg-Xi.mjs");
const _page32 = () => import("./index_CtI5K0mJ.mjs");
const _page33 = () => import("./save_DvDHaSvh.mjs");
const _page34 = () => import("./index_CVgbfyg9.mjs");
const _page35 = () => import("./index_CMaX3LAw.mjs");
const _page36 = () => import("./stats_CIF3FcRV.mjs");
const _page37 = () => import("./index_B4w2rGXJ.mjs");
const _page38 = () => import("./ai-test_CYgh1yDl.mjs");
const _page39 = () => import("./forgot-password_9caUItSH.mjs");
const _page40 = () => import("./index_CoKHAM49.mjs");
const _page41 = () => import("./reset-password_b3BAnoLn.mjs");
const _page42 = () => import("./session_D3gHEIlC.mjs");
const _page43 = () => import("./sign-in_BjqIfEov.mjs");
const _page44 = () => import("./sign-out_-hWTGCbH.mjs");
const _page45 = () => import("./sign-up_CzjROFqP.mjs");
const _page46 = () => import("./verify-email_2To8UIpk.mjs");
const _page47 = () => import("./active_C4hECbkR.mjs");
const _page48 = () => import("./_id__DyJ4xljk.mjs");
const _page49 = () => import("./index_C23YwK2d.mjs");
const _page50 = () => import("./create_I9dowDv-.mjs");
const _page51 = () => import("./featured_BJWFLKCm.mjs");
const _page52 = () => import("./index_BrlglwEE.mjs");
const _page53 = () => import("./like_BzgJGPlo.mjs");
const _page54 = () => import("./_slug__B0L9uhW3.mjs");
const _page55 = () => import("./index_BmtmBDHE.mjs");
const _page56 = () => import("./listings_DAZQOPRL.mjs");
const _page57 = () => import("./index_Bwnb4WzZ.mjs");
const _page58 = () => import("./upload_BM5kvm99.mjs");
const _page59 = () => import("./_id__B8Ewen9p.mjs");
const _page60 = () => import("./index_h0juu2Jz.mjs");
const _page61 = () => import("./index_BUUiwP_V.mjs");
const _page62 = () => import("./sku-usage_DisJo5-V.mjs");
const _page63 = () => import("./_id__D4P0vC2a.mjs");
const _page64 = () => import("./index_2vxPuEIe.mjs");
const _page65 = () => import("./reply_tmKiLu_J.mjs");
const _page66 = () => import("./reply_DvZhSPYT.mjs");
const _page67 = () => import("./index_Ci-IF-V5.mjs");
const _page68 = () => import("./index_B7-r_Uml.mjs");
const _page69 = () => import("./index_4ya3V8w3.mjs");
const _page70 = () => import("./create_UPCAjeHL.mjs");
const _page71 = () => import("./index_Qw2K5KK5.mjs");
const _page72 = () => import("./index_DJ9hD_rx.mjs");
const _page73 = () => import("./index_Ur_P3ikw.mjs");
const _page74 = () => import("./index_I8FcJytm.mjs");
const _page75 = () => import("./products_Wg-qYBTs.mjs");
const _page76 = () => import("./_slug__COy_Z2H_.mjs");
const _page77 = () => import("./index_DxaJLkIr.mjs");
const _page78 = () => import("./index_C9v8gDlt.mjs");
const _page79 = () => import("./dashboard_5WvsbczL.mjs");
const _page80 = () => import("./_id__BikjuDOM.mjs");
const _page81 = () => import("./forgot-password_DJxY11CR.mjs");
const _page82 = () => import("./create_D3KdwYAO.mjs");
const _page83 = () => import("./index_DkhEwhyV.mjs");
const _page84 = () => import("./login_Dy6SDNdz.mjs");
const _page85 = () => import("./_slug__DkZ72EZ3.mjs");
const _page86 = () => import("./index_D9CUGZsm.mjs");
const _page87 = () => import("./index_3GiJNKHs.mjs");
const _page88 = () => import("./register_BlBIx6dd.mjs");
const _page89 = () => import("./reset-password_CdfiGdcG.mjs");
const _page90 = () => import("./search_Ds91Pp7b.mjs");
const _page91 = () => import("./subscribe_CBSczneP.mjs");
const _page92 = () => import("./verify_BPiYX8n5.mjs");
const _page93 = () => import("./index_tPZ1zscS.mjs");
const pageMap = /* @__PURE__ */ new Map([
  ["node_modules/.pnpm/@astrojs+cloudflare@13.2.2_@types+node@25.6.0_astro@6.1.10_@types+node@25.6.0_jiti@2.6.1_ligh_clyr42orzduuomti5kmxdgziha/node_modules/@astrojs/cloudflare/dist/entrypoints/image-transform-endpoint.js", _page0],
  ["src/pages/account.astro", _page1],
  ["src/pages/admin/ai-tools.astro", _page2],
  ["src/pages/admin/blogs.astro", _page3],
  ["src/pages/admin/businesses.astro", _page4],
  ["src/pages/admin/categories.astro", _page5],
  ["src/pages/admin/heroes.astro", _page6],
  ["src/pages/admin/listing/new/index.astro", _page7],
  ["src/pages/admin/listing/[id]/edit/index.astro", _page8],
  ["src/pages/admin/listing/index.astro", _page9],
  ["src/pages/admin/login.astro", _page10],
  ["src/pages/admin/reviews.astro", _page11],
  ["src/pages/admin/settings.astro", _page12],
  ["src/pages/admin/skus.astro", _page13],
  ["src/pages/admin/subscriptions.astro", _page14],
  ["src/pages/admin/users.astro", _page15],
  ["src/pages/admin/index.astro", _page16],
  ["src/pages/api/account/businesses/[uid].ts", _page17],
  ["src/pages/api/account/profile/[uid].ts", _page18],
  ["src/pages/api/account/subscription/[uid].ts", _page19],
  ["src/pages/api/account/index.ts", _page20],
  ["src/pages/api/admin/ai-generate.ts", _page21],
  ["src/pages/api/admin/auth/login.ts", _page22],
  ["src/pages/api/admin/blogs/index.ts", _page23],
  ["src/pages/api/admin/businesses/index.ts", _page24],
  ["src/pages/api/admin/categories/index.ts", _page25],
  ["src/pages/api/admin/listing/[id].ts", _page26],
  ["src/pages/api/admin/listing/index.ts", _page27],
  ["src/pages/api/admin/orders/[id]/status.ts", _page28],
  ["src/pages/api/admin/orders/[id].ts", _page29],
  ["src/pages/api/admin/orders/index.ts", _page30],
  ["src/pages/api/admin/reviews/[id].ts", _page31],
  ["src/pages/api/admin/reviews/index.ts", _page32],
  ["src/pages/api/admin/settings/save.ts", _page33],
  ["src/pages/api/admin/settings/index.ts", _page34],
  ["src/pages/api/admin/skus/index.ts", _page35],
  ["src/pages/api/admin/stats.ts", _page36],
  ["src/pages/api/admin/users/index.ts", _page37],
  ["src/pages/api/ai-test.ts", _page38],
  ["src/pages/api/auth/forgot-password.ts", _page39],
  ["src/pages/api/auth/index.test.ts", _page40],
  ["src/pages/api/auth/reset-password.ts", _page41],
  ["src/pages/api/auth/session.ts", _page42],
  ["src/pages/api/auth/sign-in.ts", _page43],
  ["src/pages/api/auth/sign-out.ts", _page44],
  ["src/pages/api/auth/sign-up.ts", _page45],
  ["src/pages/api/auth/verify-email.ts", _page46],
  ["src/pages/api/banners/active.ts", _page47],
  ["src/pages/api/banners/[id].ts", _page48],
  ["src/pages/api/banners/index.ts", _page49],
  ["src/pages/api/businesses/create.ts", _page50],
  ["src/pages/api/businesses/featured.ts", _page51],
  ["src/pages/api/businesses/index.test.ts", _page52],
  ["src/pages/api/businesses/[slug]/like.ts", _page53],
  ["src/pages/api/businesses/[slug].ts", _page54],
  ["src/pages/api/businesses/index.ts", _page55],
  ["src/pages/api/categories/[slug]/listings.ts", _page56],
  ["src/pages/api/categories/index.ts", _page57],
  ["src/pages/api/media/upload.ts", _page58],
  ["src/pages/api/media/[id].ts", _page59],
  ["src/pages/api/media/index.ts", _page60],
  ["src/pages/api/orders/index.ts", _page61],
  ["src/pages/api/products/[businessPageId]/sku-usage.ts", _page62],
  ["src/pages/api/products/[id].ts", _page63],
  ["src/pages/api/products/index.ts", _page64],
  ["src/pages/api/reviews/[id]/reply.ts", _page65],
  ["src/pages/api/reviews/[id]/reply.test.ts", _page66],
  ["src/pages/api/reviews/index.ts", _page67],
  ["src/pages/api/settings/public/index.test.ts", _page68],
  ["src/pages/api/settings/public/index.ts", _page69],
  ["src/pages/business/create.astro", _page70],
  ["src/pages/business/[slug]/edit/index.astro", _page71],
  ["src/pages/business/[slug]/product/new/index.astro", _page72],
  ["src/pages/business/[slug]/product/[id]/edit/index.astro", _page73],
  ["src/pages/business/[slug]/product/[id]/index.astro", _page74],
  ["src/pages/business/[slug]/products.astro", _page75],
  ["src/pages/business/[slug].astro", _page76],
  ["src/pages/businesses/index.astro", _page77],
  ["src/pages/categories/index.astro", _page78],
  ["src/pages/dashboard.astro", _page79],
  ["src/pages/edit-business-page/[id].astro", _page80],
  ["src/pages/forgot-password.astro", _page81],
  ["src/pages/listing/create.astro", _page82],
  ["src/pages/listing/index.astro", _page83],
  ["src/pages/login.astro", _page84],
  ["src/pages/organization/[slug].astro", _page85],
  ["src/pages/organization/index.astro", _page86],
  ["src/pages/products-services/index.astro", _page87],
  ["src/pages/register.astro", _page88],
  ["src/pages/reset-password.astro", _page89],
  ["src/pages/search.astro", _page90],
  ["src/pages/subscribe.astro", _page91],
  ["src/pages/verify.astro", _page92],
  ["src/pages/index.astro", _page93]
]);
const _manifest = deserializeManifest({"rootDir":"file:///home/jasonwill/dev-projects/timorlist/","cacheDir":"file:///home/jasonwill/dev-projects/timorlist/node_modules/.astro/","outDir":"file:///home/jasonwill/dev-projects/timorlist/dist/","srcDir":"file:///home/jasonwill/dev-projects/timorlist/src/","publicDir":"file:///home/jasonwill/dev-projects/timorlist/public/","buildClientDir":"file:///home/jasonwill/dev-projects/timorlist/dist/client/","buildServerDir":"file:///home/jasonwill/dev-projects/timorlist/dist/server/","adapterName":"@astrojs/cloudflare","assetsDir":"_astro","routes":[{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"page","component":"_server-islands.astro","params":["name"],"segments":[[{"content":"_server-islands","dynamic":false,"spread":false}],[{"content":"name","dynamic":true,"spread":false}]],"pattern":"^\\/_server-islands\\/([^/]+?)\\/?$","prerender":false,"isIndex":false,"fallbackRoutes":[],"route":"/_server-islands/[name]","origin":"internal","distURL":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.DZVFD4-x.js"}],"styles":[],"routeData":{"route":"/_image","component":"node_modules/.pnpm/@astrojs+cloudflare@13.2.2_@types+node@25.6.0_astro@6.1.10_@types+node@25.6.0_jiti@2.6.1_ligh_clyr42orzduuomti5kmxdgziha/node_modules/@astrojs/cloudflare/dist/entrypoints/image-transform-endpoint.js","params":[],"pathname":"/_image","pattern":"^\\/_image\\/?$","segments":[[{"content":"_image","dynamic":false,"spread":false}]],"type":"endpoint","prerender":false,"fallbackRoutes":[],"distURL":[],"isIndex":false,"origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.DZVFD4-x.js"}],"styles":[{"type":"external","src":"_astro/Layout.CVYn8NoA.css"}],"routeData":{"route":"/404","isIndex":false,"type":"page","pattern":"^\\/404\\/?$","segments":[[{"content":"404","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/404.astro","pathname":"/404","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.DZVFD4-x.js"}],"styles":[{"type":"external","src":"_astro/globals.CVYn8NoA.css"}],"routeData":{"route":"/account","isIndex":false,"type":"page","pattern":"^\\/account\\/?$","segments":[[{"content":"account","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/account.astro","pathname":"/account","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.DZVFD4-x.js"}],"styles":[{"type":"external","src":"_astro/globals.CVYn8NoA.css"},{"type":"inline","content":".toast-item[data-astro-cid-znpjk5pm]{animation:.3s ease-out slideIn}@keyframes slideIn{0%{transform:translate(100%);opacity:0}to{transform:translate(0);opacity:1}}.nav-item[data-astro-cid-w6su3bgr]{min-height:calc(var(--spacing,.25rem) * 11);align-items:center;gap:calc(var(--spacing,.25rem) * 3);border-radius:var(--radius-lg,.5rem);padding-inline:calc(var(--spacing,.25rem) * 3);padding-block:calc(var(--spacing,.25rem) * 3);font-size:var(--text-sm,.875rem);line-height:var(--tw-leading,var(--text-sm--line-height,calc(1.25 / .875)));color:var(--color-muted-foreground,#71717a);transition-property:color,background-color,border-color,outline-color,text-decoration-color,fill,stroke,--tw-gradient-from,--tw-gradient-via,--tw-gradient-to;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function,cubic-bezier(.4, 0, .2, 1)));transition-duration:var(--tw-duration,var(--default-transition-duration,.15s));display:flex}.nav-item[data-astro-cid-w6su3bgr]:hover{background-color:var(--color-muted,#f5f5f4);color:var(--color-foreground,#1a1a1a)}.nav-item[data-astro-cid-w6su3bgr].active{background-color:var(--color-primary,#ffd150);color:var(--color-primary-foreground,#1a1a1a)}.nav-item[data-astro-cid-w6su3bgr].active:hover{opacity:.9}\n"}],"routeData":{"route":"/admin/ai-tools","isIndex":false,"type":"page","pattern":"^\\/admin\\/ai-tools\\/?$","segments":[[{"content":"admin","dynamic":false,"spread":false}],[{"content":"ai-tools","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/admin/ai-tools.astro","pathname":"/admin/ai-tools","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.DZVFD4-x.js"}],"styles":[{"type":"external","src":"_astro/globals.CVYn8NoA.css"},{"type":"inline","content":".ProseMirror{outline:none;min-height:150px}.ProseMirror p.is-editor-empty:first-child:before{content:attr(data-placeholder);color:#9ca3af;float:left;height:0;pointer-events:none}.ProseMirror h2{font-size:1.5rem;font-weight:700;margin-top:1rem;margin-bottom:.5rem}.ProseMirror h3{font-size:1.25rem;font-weight:600;margin-top:.75rem;margin-bottom:.5rem}.ProseMirror ul,.ProseMirror ol{padding-left:1.5rem;margin:.5rem 0}.ProseMirror a{color:var(--color-primary);text-decoration:underline}\n.toast-item[data-astro-cid-znpjk5pm]{animation:.3s ease-out slideIn}@keyframes slideIn{0%{transform:translate(100%);opacity:0}to{transform:translate(0);opacity:1}}.nav-item[data-astro-cid-w6su3bgr]{min-height:calc(var(--spacing,.25rem) * 11);align-items:center;gap:calc(var(--spacing,.25rem) * 3);border-radius:var(--radius-lg,.5rem);padding-inline:calc(var(--spacing,.25rem) * 3);padding-block:calc(var(--spacing,.25rem) * 3);font-size:var(--text-sm,.875rem);line-height:var(--tw-leading,var(--text-sm--line-height,calc(1.25 / .875)));color:var(--color-muted-foreground,#71717a);transition-property:color,background-color,border-color,outline-color,text-decoration-color,fill,stroke,--tw-gradient-from,--tw-gradient-via,--tw-gradient-to;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function,cubic-bezier(.4, 0, .2, 1)));transition-duration:var(--tw-duration,var(--default-transition-duration,.15s));display:flex}.nav-item[data-astro-cid-w6su3bgr]:hover{background-color:var(--color-muted,#f5f5f4);color:var(--color-foreground,#1a1a1a)}.nav-item[data-astro-cid-w6su3bgr].active{background-color:var(--color-primary,#ffd150);color:var(--color-primary-foreground,#1a1a1a)}.nav-item[data-astro-cid-w6su3bgr].active:hover{opacity:.9}\n"}],"routeData":{"route":"/admin/blogs","isIndex":false,"type":"page","pattern":"^\\/admin\\/blogs\\/?$","segments":[[{"content":"admin","dynamic":false,"spread":false}],[{"content":"blogs","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/admin/blogs.astro","pathname":"/admin/blogs","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.DZVFD4-x.js"}],"styles":[{"type":"external","src":"_astro/globals.CVYn8NoA.css"},{"type":"inline","content":".toast-item[data-astro-cid-znpjk5pm]{animation:.3s ease-out slideIn}@keyframes slideIn{0%{transform:translate(100%);opacity:0}to{transform:translate(0);opacity:1}}.nav-item[data-astro-cid-w6su3bgr]{min-height:calc(var(--spacing,.25rem) * 11);align-items:center;gap:calc(var(--spacing,.25rem) * 3);border-radius:var(--radius-lg,.5rem);padding-inline:calc(var(--spacing,.25rem) * 3);padding-block:calc(var(--spacing,.25rem) * 3);font-size:var(--text-sm,.875rem);line-height:var(--tw-leading,var(--text-sm--line-height,calc(1.25 / .875)));color:var(--color-muted-foreground,#71717a);transition-property:color,background-color,border-color,outline-color,text-decoration-color,fill,stroke,--tw-gradient-from,--tw-gradient-via,--tw-gradient-to;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function,cubic-bezier(.4, 0, .2, 1)));transition-duration:var(--tw-duration,var(--default-transition-duration,.15s));display:flex}.nav-item[data-astro-cid-w6su3bgr]:hover{background-color:var(--color-muted,#f5f5f4);color:var(--color-foreground,#1a1a1a)}.nav-item[data-astro-cid-w6su3bgr].active{background-color:var(--color-primary,#ffd150);color:var(--color-primary-foreground,#1a1a1a)}.nav-item[data-astro-cid-w6su3bgr].active:hover{opacity:.9}\n"}],"routeData":{"route":"/admin/businesses","isIndex":false,"type":"page","pattern":"^\\/admin\\/businesses\\/?$","segments":[[{"content":"admin","dynamic":false,"spread":false}],[{"content":"businesses","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/admin/businesses.astro","pathname":"/admin/businesses","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.DZVFD4-x.js"}],"styles":[{"type":"external","src":"_astro/globals.CVYn8NoA.css"},{"type":"inline","content":".toast-item[data-astro-cid-znpjk5pm]{animation:.3s ease-out slideIn}@keyframes slideIn{0%{transform:translate(100%);opacity:0}to{transform:translate(0);opacity:1}}.nav-item[data-astro-cid-w6su3bgr]{min-height:calc(var(--spacing,.25rem) * 11);align-items:center;gap:calc(var(--spacing,.25rem) * 3);border-radius:var(--radius-lg,.5rem);padding-inline:calc(var(--spacing,.25rem) * 3);padding-block:calc(var(--spacing,.25rem) * 3);font-size:var(--text-sm,.875rem);line-height:var(--tw-leading,var(--text-sm--line-height,calc(1.25 / .875)));color:var(--color-muted-foreground,#71717a);transition-property:color,background-color,border-color,outline-color,text-decoration-color,fill,stroke,--tw-gradient-from,--tw-gradient-via,--tw-gradient-to;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function,cubic-bezier(.4, 0, .2, 1)));transition-duration:var(--tw-duration,var(--default-transition-duration,.15s));display:flex}.nav-item[data-astro-cid-w6su3bgr]:hover{background-color:var(--color-muted,#f5f5f4);color:var(--color-foreground,#1a1a1a)}.nav-item[data-astro-cid-w6su3bgr].active{background-color:var(--color-primary,#ffd150);color:var(--color-primary-foreground,#1a1a1a)}.nav-item[data-astro-cid-w6su3bgr].active:hover{opacity:.9}\n"}],"routeData":{"route":"/admin/categories","isIndex":false,"type":"page","pattern":"^\\/admin\\/categories\\/?$","segments":[[{"content":"admin","dynamic":false,"spread":false}],[{"content":"categories","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/admin/categories.astro","pathname":"/admin/categories","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.DZVFD4-x.js"}],"styles":[{"type":"external","src":"_astro/globals.CVYn8NoA.css"},{"type":"inline","content":".toast-item[data-astro-cid-znpjk5pm]{animation:.3s ease-out slideIn}@keyframes slideIn{0%{transform:translate(100%);opacity:0}to{transform:translate(0);opacity:1}}.nav-item[data-astro-cid-w6su3bgr]{min-height:calc(var(--spacing,.25rem) * 11);align-items:center;gap:calc(var(--spacing,.25rem) * 3);border-radius:var(--radius-lg,.5rem);padding-inline:calc(var(--spacing,.25rem) * 3);padding-block:calc(var(--spacing,.25rem) * 3);font-size:var(--text-sm,.875rem);line-height:var(--tw-leading,var(--text-sm--line-height,calc(1.25 / .875)));color:var(--color-muted-foreground,#71717a);transition-property:color,background-color,border-color,outline-color,text-decoration-color,fill,stroke,--tw-gradient-from,--tw-gradient-via,--tw-gradient-to;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function,cubic-bezier(.4, 0, .2, 1)));transition-duration:var(--tw-duration,var(--default-transition-duration,.15s));display:flex}.nav-item[data-astro-cid-w6su3bgr]:hover{background-color:var(--color-muted,#f5f5f4);color:var(--color-foreground,#1a1a1a)}.nav-item[data-astro-cid-w6su3bgr].active{background-color:var(--color-primary,#ffd150);color:var(--color-primary-foreground,#1a1a1a)}.nav-item[data-astro-cid-w6su3bgr].active:hover{opacity:.9}\n"}],"routeData":{"route":"/admin/heroes","isIndex":false,"type":"page","pattern":"^\\/admin\\/heroes\\/?$","segments":[[{"content":"admin","dynamic":false,"spread":false}],[{"content":"heroes","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/admin/heroes.astro","pathname":"/admin/heroes","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.DZVFD4-x.js"}],"styles":[{"type":"external","src":"_astro/globals.CVYn8NoA.css"}],"routeData":{"route":"/admin/listing/new","isIndex":true,"type":"page","pattern":"^\\/admin\\/listing\\/new\\/?$","segments":[[{"content":"admin","dynamic":false,"spread":false}],[{"content":"listing","dynamic":false,"spread":false}],[{"content":"new","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/admin/listing/new/index.astro","pathname":"/admin/listing/new","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.DZVFD4-x.js"}],"styles":[{"type":"external","src":"_astro/globals.CVYn8NoA.css"}],"routeData":{"route":"/admin/listing/[id]/edit","isIndex":true,"type":"page","pattern":"^\\/admin\\/listing\\/([^/]+?)\\/edit\\/?$","segments":[[{"content":"admin","dynamic":false,"spread":false}],[{"content":"listing","dynamic":false,"spread":false}],[{"content":"id","dynamic":true,"spread":false}],[{"content":"edit","dynamic":false,"spread":false}]],"params":["id"],"component":"src/pages/admin/listing/[id]/edit/index.astro","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.DZVFD4-x.js"}],"styles":[{"type":"external","src":"_astro/globals.CVYn8NoA.css"},{"type":"inline","content":".toast-item[data-astro-cid-znpjk5pm]{animation:.3s ease-out slideIn}@keyframes slideIn{0%{transform:translate(100%);opacity:0}to{transform:translate(0);opacity:1}}.nav-item[data-astro-cid-w6su3bgr]{min-height:calc(var(--spacing,.25rem) * 11);align-items:center;gap:calc(var(--spacing,.25rem) * 3);border-radius:var(--radius-lg,.5rem);padding-inline:calc(var(--spacing,.25rem) * 3);padding-block:calc(var(--spacing,.25rem) * 3);font-size:var(--text-sm,.875rem);line-height:var(--tw-leading,var(--text-sm--line-height,calc(1.25 / .875)));color:var(--color-muted-foreground,#71717a);transition-property:color,background-color,border-color,outline-color,text-decoration-color,fill,stroke,--tw-gradient-from,--tw-gradient-via,--tw-gradient-to;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function,cubic-bezier(.4, 0, .2, 1)));transition-duration:var(--tw-duration,var(--default-transition-duration,.15s));display:flex}.nav-item[data-astro-cid-w6su3bgr]:hover{background-color:var(--color-muted,#f5f5f4);color:var(--color-foreground,#1a1a1a)}.nav-item[data-astro-cid-w6su3bgr].active{background-color:var(--color-primary,#ffd150);color:var(--color-primary-foreground,#1a1a1a)}.nav-item[data-astro-cid-w6su3bgr].active:hover{opacity:.9}\n"}],"routeData":{"route":"/admin/listing","isIndex":true,"type":"page","pattern":"^\\/admin\\/listing\\/?$","segments":[[{"content":"admin","dynamic":false,"spread":false}],[{"content":"listing","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/admin/listing/index.astro","pathname":"/admin/listing","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.DZVFD4-x.js"}],"styles":[{"type":"external","src":"_astro/globals.CVYn8NoA.css"}],"routeData":{"route":"/admin/login","isIndex":false,"type":"page","pattern":"^\\/admin\\/login\\/?$","segments":[[{"content":"admin","dynamic":false,"spread":false}],[{"content":"login","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/admin/login.astro","pathname":"/admin/login","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.DZVFD4-x.js"}],"styles":[{"type":"external","src":"_astro/globals.CVYn8NoA.css"},{"type":"inline","content":".toast-item[data-astro-cid-znpjk5pm]{animation:.3s ease-out slideIn}@keyframes slideIn{0%{transform:translate(100%);opacity:0}to{transform:translate(0);opacity:1}}.nav-item[data-astro-cid-w6su3bgr]{min-height:calc(var(--spacing,.25rem) * 11);align-items:center;gap:calc(var(--spacing,.25rem) * 3);border-radius:var(--radius-lg,.5rem);padding-inline:calc(var(--spacing,.25rem) * 3);padding-block:calc(var(--spacing,.25rem) * 3);font-size:var(--text-sm,.875rem);line-height:var(--tw-leading,var(--text-sm--line-height,calc(1.25 / .875)));color:var(--color-muted-foreground,#71717a);transition-property:color,background-color,border-color,outline-color,text-decoration-color,fill,stroke,--tw-gradient-from,--tw-gradient-via,--tw-gradient-to;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function,cubic-bezier(.4, 0, .2, 1)));transition-duration:var(--tw-duration,var(--default-transition-duration,.15s));display:flex}.nav-item[data-astro-cid-w6su3bgr]:hover{background-color:var(--color-muted,#f5f5f4);color:var(--color-foreground,#1a1a1a)}.nav-item[data-astro-cid-w6su3bgr].active{background-color:var(--color-primary,#ffd150);color:var(--color-primary-foreground,#1a1a1a)}.nav-item[data-astro-cid-w6su3bgr].active:hover{opacity:.9}\n"}],"routeData":{"route":"/admin/reviews","isIndex":false,"type":"page","pattern":"^\\/admin\\/reviews\\/?$","segments":[[{"content":"admin","dynamic":false,"spread":false}],[{"content":"reviews","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/admin/reviews.astro","pathname":"/admin/reviews","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.DZVFD4-x.js"}],"styles":[{"type":"external","src":"_astro/globals.CVYn8NoA.css"},{"type":"inline","content":".toast-item[data-astro-cid-znpjk5pm]{animation:.3s ease-out slideIn}@keyframes slideIn{0%{transform:translate(100%);opacity:0}to{transform:translate(0);opacity:1}}.nav-item[data-astro-cid-w6su3bgr]{min-height:calc(var(--spacing,.25rem) * 11);align-items:center;gap:calc(var(--spacing,.25rem) * 3);border-radius:var(--radius-lg,.5rem);padding-inline:calc(var(--spacing,.25rem) * 3);padding-block:calc(var(--spacing,.25rem) * 3);font-size:var(--text-sm,.875rem);line-height:var(--tw-leading,var(--text-sm--line-height,calc(1.25 / .875)));color:var(--color-muted-foreground,#71717a);transition-property:color,background-color,border-color,outline-color,text-decoration-color,fill,stroke,--tw-gradient-from,--tw-gradient-via,--tw-gradient-to;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function,cubic-bezier(.4, 0, .2, 1)));transition-duration:var(--tw-duration,var(--default-transition-duration,.15s));display:flex}.nav-item[data-astro-cid-w6su3bgr]:hover{background-color:var(--color-muted,#f5f5f4);color:var(--color-foreground,#1a1a1a)}.nav-item[data-astro-cid-w6su3bgr].active{background-color:var(--color-primary,#ffd150);color:var(--color-primary-foreground,#1a1a1a)}.nav-item[data-astro-cid-w6su3bgr].active:hover{opacity:.9}\n"}],"routeData":{"route":"/admin/settings","isIndex":false,"type":"page","pattern":"^\\/admin\\/settings\\/?$","segments":[[{"content":"admin","dynamic":false,"spread":false}],[{"content":"settings","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/admin/settings.astro","pathname":"/admin/settings","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.DZVFD4-x.js"}],"styles":[{"type":"external","src":"_astro/globals.CVYn8NoA.css"},{"type":"inline","content":".toast-item[data-astro-cid-znpjk5pm]{animation:.3s ease-out slideIn}@keyframes slideIn{0%{transform:translate(100%);opacity:0}to{transform:translate(0);opacity:1}}.nav-item[data-astro-cid-w6su3bgr]{min-height:calc(var(--spacing,.25rem) * 11);align-items:center;gap:calc(var(--spacing,.25rem) * 3);border-radius:var(--radius-lg,.5rem);padding-inline:calc(var(--spacing,.25rem) * 3);padding-block:calc(var(--spacing,.25rem) * 3);font-size:var(--text-sm,.875rem);line-height:var(--tw-leading,var(--text-sm--line-height,calc(1.25 / .875)));color:var(--color-muted-foreground,#71717a);transition-property:color,background-color,border-color,outline-color,text-decoration-color,fill,stroke,--tw-gradient-from,--tw-gradient-via,--tw-gradient-to;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function,cubic-bezier(.4, 0, .2, 1)));transition-duration:var(--tw-duration,var(--default-transition-duration,.15s));display:flex}.nav-item[data-astro-cid-w6su3bgr]:hover{background-color:var(--color-muted,#f5f5f4);color:var(--color-foreground,#1a1a1a)}.nav-item[data-astro-cid-w6su3bgr].active{background-color:var(--color-primary,#ffd150);color:var(--color-primary-foreground,#1a1a1a)}.nav-item[data-astro-cid-w6su3bgr].active:hover{opacity:.9}\n.prose-editor[data-astro-cid-qlvzk37x]{min-height:150px;padding:.75rem}.prose-editor[data-astro-cid-qlvzk37x] .ProseMirror{min-height:120px;outline:none}.prose-editor[data-astro-cid-qlvzk37x] .ProseMirror p.is-editor-empty:first-child:before{content:attr(data-placeholder);color:#9ca3af;pointer-events:none;float:left;height:0}.prose-editor[data-astro-cid-qlvzk37x] .ProseMirror p{margin:.5em 0}.prose-editor[data-astro-cid-qlvzk37x] .ProseMirror h1{font-size:1.5rem;font-weight:700;margin:1em 0 .5em}.prose-editor[data-astro-cid-qlvzk37x] .ProseMirror h2{font-size:1.25rem;font-weight:700;margin:.75em 0 .5em}.prose-editor[data-astro-cid-qlvzk37x] .ProseMirror ul,.prose-editor[data-astro-cid-qlvzk37x] .ProseMirror ol{padding-left:1.5em;margin:.5em 0}.prose-editor[data-astro-cid-qlvzk37x] .ProseMirror blockquote{border-left:3px solid #d1d5db;padding-left:1em;margin:.5em 0;color:#6b7280}.toolbar-btn[data-astro-cid-qlvzk37x]{padding:.375rem .5rem;border-radius:.25rem;font-size:.75rem;font-weight:500;transition:all .15s}.toolbar-btn[data-astro-cid-qlvzk37x]:hover{background:#e5e7eb}.toolbar-btn[data-astro-cid-qlvzk37x].active{background:#fef3c7;color:#92400e}.dark .toolbar-btn[data-astro-cid-qlvzk37x]:hover{background:#374151}.dark .toolbar-btn[data-astro-cid-qlvzk37x].active{background:#78350f;color:#fef3c7}\n"}],"routeData":{"route":"/admin/skus","isIndex":false,"type":"page","pattern":"^\\/admin\\/skus\\/?$","segments":[[{"content":"admin","dynamic":false,"spread":false}],[{"content":"skus","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/admin/skus.astro","pathname":"/admin/skus","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.DZVFD4-x.js"}],"styles":[{"type":"external","src":"_astro/globals.CVYn8NoA.css"},{"type":"inline","content":".toast-item[data-astro-cid-znpjk5pm]{animation:.3s ease-out slideIn}@keyframes slideIn{0%{transform:translate(100%);opacity:0}to{transform:translate(0);opacity:1}}.nav-item[data-astro-cid-w6su3bgr]{min-height:calc(var(--spacing,.25rem) * 11);align-items:center;gap:calc(var(--spacing,.25rem) * 3);border-radius:var(--radius-lg,.5rem);padding-inline:calc(var(--spacing,.25rem) * 3);padding-block:calc(var(--spacing,.25rem) * 3);font-size:var(--text-sm,.875rem);line-height:var(--tw-leading,var(--text-sm--line-height,calc(1.25 / .875)));color:var(--color-muted-foreground,#71717a);transition-property:color,background-color,border-color,outline-color,text-decoration-color,fill,stroke,--tw-gradient-from,--tw-gradient-via,--tw-gradient-to;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function,cubic-bezier(.4, 0, .2, 1)));transition-duration:var(--tw-duration,var(--default-transition-duration,.15s));display:flex}.nav-item[data-astro-cid-w6su3bgr]:hover{background-color:var(--color-muted,#f5f5f4);color:var(--color-foreground,#1a1a1a)}.nav-item[data-astro-cid-w6su3bgr].active{background-color:var(--color-primary,#ffd150);color:var(--color-primary-foreground,#1a1a1a)}.nav-item[data-astro-cid-w6su3bgr].active:hover{opacity:.9}\n"}],"routeData":{"route":"/admin/subscriptions","isIndex":false,"type":"page","pattern":"^\\/admin\\/subscriptions\\/?$","segments":[[{"content":"admin","dynamic":false,"spread":false}],[{"content":"subscriptions","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/admin/subscriptions.astro","pathname":"/admin/subscriptions","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.DZVFD4-x.js"}],"styles":[{"type":"external","src":"_astro/globals.CVYn8NoA.css"},{"type":"inline","content":".toast-item[data-astro-cid-znpjk5pm]{animation:.3s ease-out slideIn}@keyframes slideIn{0%{transform:translate(100%);opacity:0}to{transform:translate(0);opacity:1}}.nav-item[data-astro-cid-w6su3bgr]{min-height:calc(var(--spacing,.25rem) * 11);align-items:center;gap:calc(var(--spacing,.25rem) * 3);border-radius:var(--radius-lg,.5rem);padding-inline:calc(var(--spacing,.25rem) * 3);padding-block:calc(var(--spacing,.25rem) * 3);font-size:var(--text-sm,.875rem);line-height:var(--tw-leading,var(--text-sm--line-height,calc(1.25 / .875)));color:var(--color-muted-foreground,#71717a);transition-property:color,background-color,border-color,outline-color,text-decoration-color,fill,stroke,--tw-gradient-from,--tw-gradient-via,--tw-gradient-to;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function,cubic-bezier(.4, 0, .2, 1)));transition-duration:var(--tw-duration,var(--default-transition-duration,.15s));display:flex}.nav-item[data-astro-cid-w6su3bgr]:hover{background-color:var(--color-muted,#f5f5f4);color:var(--color-foreground,#1a1a1a)}.nav-item[data-astro-cid-w6su3bgr].active{background-color:var(--color-primary,#ffd150);color:var(--color-primary-foreground,#1a1a1a)}.nav-item[data-astro-cid-w6su3bgr].active:hover{opacity:.9}\n"}],"routeData":{"route":"/admin/users","isIndex":false,"type":"page","pattern":"^\\/admin\\/users\\/?$","segments":[[{"content":"admin","dynamic":false,"spread":false}],[{"content":"users","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/admin/users.astro","pathname":"/admin/users","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.DZVFD4-x.js"}],"styles":[{"type":"external","src":"_astro/globals.CVYn8NoA.css"},{"type":"inline","content":".toast-item[data-astro-cid-znpjk5pm]{animation:.3s ease-out slideIn}@keyframes slideIn{0%{transform:translate(100%);opacity:0}to{transform:translate(0);opacity:1}}.nav-item[data-astro-cid-w6su3bgr]{min-height:calc(var(--spacing,.25rem) * 11);align-items:center;gap:calc(var(--spacing,.25rem) * 3);border-radius:var(--radius-lg,.5rem);padding-inline:calc(var(--spacing,.25rem) * 3);padding-block:calc(var(--spacing,.25rem) * 3);font-size:var(--text-sm,.875rem);line-height:var(--tw-leading,var(--text-sm--line-height,calc(1.25 / .875)));color:var(--color-muted-foreground,#71717a);transition-property:color,background-color,border-color,outline-color,text-decoration-color,fill,stroke,--tw-gradient-from,--tw-gradient-via,--tw-gradient-to;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function,cubic-bezier(.4, 0, .2, 1)));transition-duration:var(--tw-duration,var(--default-transition-duration,.15s));display:flex}.nav-item[data-astro-cid-w6su3bgr]:hover{background-color:var(--color-muted,#f5f5f4);color:var(--color-foreground,#1a1a1a)}.nav-item[data-astro-cid-w6su3bgr].active{background-color:var(--color-primary,#ffd150);color:var(--color-primary-foreground,#1a1a1a)}.nav-item[data-astro-cid-w6su3bgr].active:hover{opacity:.9}\n"}],"routeData":{"route":"/admin","isIndex":true,"type":"page","pattern":"^\\/admin\\/?$","segments":[[{"content":"admin","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/admin/index.astro","pathname":"/admin","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.DZVFD4-x.js"}],"styles":[],"routeData":{"route":"/api/account/businesses/[uid]","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/account\\/businesses\\/([^/]+?)\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"account","dynamic":false,"spread":false}],[{"content":"businesses","dynamic":false,"spread":false}],[{"content":"uid","dynamic":true,"spread":false}]],"params":["uid"],"component":"src/pages/api/account/businesses/[uid].ts","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.DZVFD4-x.js"}],"styles":[],"routeData":{"route":"/api/account/profile/[uid]","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/account\\/profile\\/([^/]+?)\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"account","dynamic":false,"spread":false}],[{"content":"profile","dynamic":false,"spread":false}],[{"content":"uid","dynamic":true,"spread":false}]],"params":["uid"],"component":"src/pages/api/account/profile/[uid].ts","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.DZVFD4-x.js"}],"styles":[],"routeData":{"route":"/api/account/subscription/[uid]","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/account\\/subscription\\/([^/]+?)\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"account","dynamic":false,"spread":false}],[{"content":"subscription","dynamic":false,"spread":false}],[{"content":"uid","dynamic":true,"spread":false}]],"params":["uid"],"component":"src/pages/api/account/subscription/[uid].ts","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.DZVFD4-x.js"}],"styles":[],"routeData":{"route":"/api/account","isIndex":true,"type":"endpoint","pattern":"^\\/api\\/account\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"account","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/account/index.ts","pathname":"/api/account","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.DZVFD4-x.js"}],"styles":[],"routeData":{"route":"/api/admin/ai-generate","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/admin\\/ai-generate\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"admin","dynamic":false,"spread":false}],[{"content":"ai-generate","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/admin/ai-generate.ts","pathname":"/api/admin/ai-generate","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.DZVFD4-x.js"}],"styles":[],"routeData":{"route":"/api/admin/auth/login","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/admin\\/auth\\/login\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"admin","dynamic":false,"spread":false}],[{"content":"auth","dynamic":false,"spread":false}],[{"content":"login","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/admin/auth/login.ts","pathname":"/api/admin/auth/login","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.DZVFD4-x.js"}],"styles":[],"routeData":{"route":"/api/admin/blogs","isIndex":true,"type":"endpoint","pattern":"^\\/api\\/admin\\/blogs\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"admin","dynamic":false,"spread":false}],[{"content":"blogs","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/admin/blogs/index.ts","pathname":"/api/admin/blogs","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.DZVFD4-x.js"}],"styles":[],"routeData":{"route":"/api/admin/businesses","isIndex":true,"type":"endpoint","pattern":"^\\/api\\/admin\\/businesses\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"admin","dynamic":false,"spread":false}],[{"content":"businesses","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/admin/businesses/index.ts","pathname":"/api/admin/businesses","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.DZVFD4-x.js"}],"styles":[],"routeData":{"route":"/api/admin/categories","isIndex":true,"type":"endpoint","pattern":"^\\/api\\/admin\\/categories\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"admin","dynamic":false,"spread":false}],[{"content":"categories","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/admin/categories/index.ts","pathname":"/api/admin/categories","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.DZVFD4-x.js"}],"styles":[],"routeData":{"route":"/api/admin/listing/[id]","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/admin\\/listing\\/([^/]+?)\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"admin","dynamic":false,"spread":false}],[{"content":"listing","dynamic":false,"spread":false}],[{"content":"id","dynamic":true,"spread":false}]],"params":["id"],"component":"src/pages/api/admin/listing/[id].ts","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.DZVFD4-x.js"}],"styles":[],"routeData":{"route":"/api/admin/listing","isIndex":true,"type":"endpoint","pattern":"^\\/api\\/admin\\/listing\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"admin","dynamic":false,"spread":false}],[{"content":"listing","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/admin/listing/index.ts","pathname":"/api/admin/listing","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.DZVFD4-x.js"}],"styles":[],"routeData":{"route":"/api/admin/orders/[id]/status","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/admin\\/orders\\/([^/]+?)\\/status\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"admin","dynamic":false,"spread":false}],[{"content":"orders","dynamic":false,"spread":false}],[{"content":"id","dynamic":true,"spread":false}],[{"content":"status","dynamic":false,"spread":false}]],"params":["id"],"component":"src/pages/api/admin/orders/[id]/status.ts","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.DZVFD4-x.js"}],"styles":[],"routeData":{"route":"/api/admin/orders/[id]","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/admin\\/orders\\/([^/]+?)\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"admin","dynamic":false,"spread":false}],[{"content":"orders","dynamic":false,"spread":false}],[{"content":"id","dynamic":true,"spread":false}]],"params":["id"],"component":"src/pages/api/admin/orders/[id].ts","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.DZVFD4-x.js"}],"styles":[],"routeData":{"route":"/api/admin/orders","isIndex":true,"type":"endpoint","pattern":"^\\/api\\/admin\\/orders\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"admin","dynamic":false,"spread":false}],[{"content":"orders","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/admin/orders/index.ts","pathname":"/api/admin/orders","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.DZVFD4-x.js"}],"styles":[],"routeData":{"route":"/api/admin/reviews/[id]","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/admin\\/reviews\\/([^/]+?)\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"admin","dynamic":false,"spread":false}],[{"content":"reviews","dynamic":false,"spread":false}],[{"content":"id","dynamic":true,"spread":false}]],"params":["id"],"component":"src/pages/api/admin/reviews/[id].ts","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.DZVFD4-x.js"}],"styles":[],"routeData":{"route":"/api/admin/reviews","isIndex":true,"type":"endpoint","pattern":"^\\/api\\/admin\\/reviews\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"admin","dynamic":false,"spread":false}],[{"content":"reviews","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/admin/reviews/index.ts","pathname":"/api/admin/reviews","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.DZVFD4-x.js"}],"styles":[],"routeData":{"route":"/api/admin/settings/save","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/admin\\/settings\\/save\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"admin","dynamic":false,"spread":false}],[{"content":"settings","dynamic":false,"spread":false}],[{"content":"save","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/admin/settings/save.ts","pathname":"/api/admin/settings/save","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.DZVFD4-x.js"}],"styles":[],"routeData":{"route":"/api/admin/settings","isIndex":true,"type":"endpoint","pattern":"^\\/api\\/admin\\/settings\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"admin","dynamic":false,"spread":false}],[{"content":"settings","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/admin/settings/index.ts","pathname":"/api/admin/settings","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.DZVFD4-x.js"}],"styles":[],"routeData":{"route":"/api/admin/skus","isIndex":true,"type":"endpoint","pattern":"^\\/api\\/admin\\/skus\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"admin","dynamic":false,"spread":false}],[{"content":"skus","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/admin/skus/index.ts","pathname":"/api/admin/skus","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.DZVFD4-x.js"}],"styles":[],"routeData":{"route":"/api/admin/stats","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/admin\\/stats\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"admin","dynamic":false,"spread":false}],[{"content":"stats","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/admin/stats.ts","pathname":"/api/admin/stats","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.DZVFD4-x.js"}],"styles":[],"routeData":{"route":"/api/admin/users","isIndex":true,"type":"endpoint","pattern":"^\\/api\\/admin\\/users\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"admin","dynamic":false,"spread":false}],[{"content":"users","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/admin/users/index.ts","pathname":"/api/admin/users","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.DZVFD4-x.js"}],"styles":[],"routeData":{"route":"/api/ai-test","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/ai-test\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"ai-test","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/ai-test.ts","pathname":"/api/ai-test","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.DZVFD4-x.js"}],"styles":[],"routeData":{"route":"/api/auth/forgot-password","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/auth\\/forgot-password\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"auth","dynamic":false,"spread":false}],[{"content":"forgot-password","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/auth/forgot-password.ts","pathname":"/api/auth/forgot-password","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.DZVFD4-x.js"}],"styles":[],"routeData":{"route":"/api/auth/index.test","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/auth\\/index\\.test$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"auth","dynamic":false,"spread":false}],[{"content":"index.test","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/auth/index.test.ts","pathname":"/api/auth/index.test","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.DZVFD4-x.js"}],"styles":[],"routeData":{"route":"/api/auth/reset-password","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/auth\\/reset-password\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"auth","dynamic":false,"spread":false}],[{"content":"reset-password","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/auth/reset-password.ts","pathname":"/api/auth/reset-password","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.DZVFD4-x.js"}],"styles":[],"routeData":{"route":"/api/auth/session","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/auth\\/session\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"auth","dynamic":false,"spread":false}],[{"content":"session","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/auth/session.ts","pathname":"/api/auth/session","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.DZVFD4-x.js"}],"styles":[],"routeData":{"route":"/api/auth/sign-in","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/auth\\/sign-in\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"auth","dynamic":false,"spread":false}],[{"content":"sign-in","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/auth/sign-in.ts","pathname":"/api/auth/sign-in","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.DZVFD4-x.js"}],"styles":[],"routeData":{"route":"/api/auth/sign-out","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/auth\\/sign-out\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"auth","dynamic":false,"spread":false}],[{"content":"sign-out","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/auth/sign-out.ts","pathname":"/api/auth/sign-out","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.DZVFD4-x.js"}],"styles":[],"routeData":{"route":"/api/auth/sign-up","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/auth\\/sign-up\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"auth","dynamic":false,"spread":false}],[{"content":"sign-up","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/auth/sign-up.ts","pathname":"/api/auth/sign-up","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.DZVFD4-x.js"}],"styles":[],"routeData":{"route":"/api/auth/verify-email","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/auth\\/verify-email\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"auth","dynamic":false,"spread":false}],[{"content":"verify-email","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/auth/verify-email.ts","pathname":"/api/auth/verify-email","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.DZVFD4-x.js"}],"styles":[],"routeData":{"route":"/api/banners/active","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/banners\\/active\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"banners","dynamic":false,"spread":false}],[{"content":"active","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/banners/active.ts","pathname":"/api/banners/active","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.DZVFD4-x.js"}],"styles":[],"routeData":{"route":"/api/banners/[id]","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/banners\\/([^/]+?)\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"banners","dynamic":false,"spread":false}],[{"content":"id","dynamic":true,"spread":false}]],"params":["id"],"component":"src/pages/api/banners/[id].ts","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.DZVFD4-x.js"}],"styles":[],"routeData":{"route":"/api/banners","isIndex":true,"type":"endpoint","pattern":"^\\/api\\/banners\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"banners","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/banners/index.ts","pathname":"/api/banners","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.DZVFD4-x.js"}],"styles":[],"routeData":{"route":"/api/businesses/create","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/businesses\\/create\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"businesses","dynamic":false,"spread":false}],[{"content":"create","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/businesses/create.ts","pathname":"/api/businesses/create","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.DZVFD4-x.js"}],"styles":[],"routeData":{"route":"/api/businesses/featured","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/businesses\\/featured\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"businesses","dynamic":false,"spread":false}],[{"content":"featured","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/businesses/featured.ts","pathname":"/api/businesses/featured","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.DZVFD4-x.js"}],"styles":[],"routeData":{"route":"/api/businesses/index.test","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/businesses\\/index\\.test$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"businesses","dynamic":false,"spread":false}],[{"content":"index.test","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/businesses/index.test.ts","pathname":"/api/businesses/index.test","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.DZVFD4-x.js"}],"styles":[],"routeData":{"route":"/api/businesses/[slug]/like","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/businesses\\/([^/]+?)\\/like\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"businesses","dynamic":false,"spread":false}],[{"content":"slug","dynamic":true,"spread":false}],[{"content":"like","dynamic":false,"spread":false}]],"params":["slug"],"component":"src/pages/api/businesses/[slug]/like.ts","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.DZVFD4-x.js"}],"styles":[],"routeData":{"route":"/api/businesses/[slug]","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/businesses\\/([^/]+?)\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"businesses","dynamic":false,"spread":false}],[{"content":"slug","dynamic":true,"spread":false}]],"params":["slug"],"component":"src/pages/api/businesses/[slug].ts","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.DZVFD4-x.js"}],"styles":[],"routeData":{"route":"/api/businesses","isIndex":true,"type":"endpoint","pattern":"^\\/api\\/businesses\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"businesses","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/businesses/index.ts","pathname":"/api/businesses","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.DZVFD4-x.js"}],"styles":[],"routeData":{"route":"/api/categories/[slug]/listings","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/categories\\/([^/]+?)\\/listings\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"categories","dynamic":false,"spread":false}],[{"content":"slug","dynamic":true,"spread":false}],[{"content":"listings","dynamic":false,"spread":false}]],"params":["slug"],"component":"src/pages/api/categories/[slug]/listings.ts","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.DZVFD4-x.js"}],"styles":[],"routeData":{"route":"/api/categories","isIndex":true,"type":"endpoint","pattern":"^\\/api\\/categories\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"categories","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/categories/index.ts","pathname":"/api/categories","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.DZVFD4-x.js"}],"styles":[],"routeData":{"route":"/api/media/upload","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/media\\/upload\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"media","dynamic":false,"spread":false}],[{"content":"upload","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/media/upload.ts","pathname":"/api/media/upload","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.DZVFD4-x.js"}],"styles":[],"routeData":{"route":"/api/media/[id]","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/media\\/([^/]+?)\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"media","dynamic":false,"spread":false}],[{"content":"id","dynamic":true,"spread":false}]],"params":["id"],"component":"src/pages/api/media/[id].ts","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.DZVFD4-x.js"}],"styles":[],"routeData":{"route":"/api/media","isIndex":true,"type":"endpoint","pattern":"^\\/api\\/media\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"media","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/media/index.ts","pathname":"/api/media","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.DZVFD4-x.js"}],"styles":[],"routeData":{"route":"/api/orders","isIndex":true,"type":"endpoint","pattern":"^\\/api\\/orders\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"orders","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/orders/index.ts","pathname":"/api/orders","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.DZVFD4-x.js"}],"styles":[],"routeData":{"route":"/api/products/[businesspageid]/sku-usage","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/products\\/([^/]+?)\\/sku-usage\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"products","dynamic":false,"spread":false}],[{"content":"businessPageId","dynamic":true,"spread":false}],[{"content":"sku-usage","dynamic":false,"spread":false}]],"params":["businessPageId"],"component":"src/pages/api/products/[businessPageId]/sku-usage.ts","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.DZVFD4-x.js"}],"styles":[],"routeData":{"route":"/api/products/[id]","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/products\\/([^/]+?)\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"products","dynamic":false,"spread":false}],[{"content":"id","dynamic":true,"spread":false}]],"params":["id"],"component":"src/pages/api/products/[id].ts","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.DZVFD4-x.js"}],"styles":[],"routeData":{"route":"/api/products","isIndex":true,"type":"endpoint","pattern":"^\\/api\\/products\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"products","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/products/index.ts","pathname":"/api/products","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.DZVFD4-x.js"}],"styles":[],"routeData":{"route":"/api/reviews/[id]/reply","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/reviews\\/([^/]+?)\\/reply\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"reviews","dynamic":false,"spread":false}],[{"content":"id","dynamic":true,"spread":false}],[{"content":"reply","dynamic":false,"spread":false}]],"params":["id"],"component":"src/pages/api/reviews/[id]/reply.ts","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.DZVFD4-x.js"}],"styles":[],"routeData":{"route":"/api/reviews/[id]/reply.test","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/reviews\\/([^/]+?)\\/reply\\.test\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"reviews","dynamic":false,"spread":false}],[{"content":"id","dynamic":true,"spread":false}],[{"content":"reply.test","dynamic":false,"spread":false}]],"params":["id"],"component":"src/pages/api/reviews/[id]/reply.test.ts","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.DZVFD4-x.js"}],"styles":[],"routeData":{"route":"/api/reviews","isIndex":true,"type":"endpoint","pattern":"^\\/api\\/reviews\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"reviews","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/reviews/index.ts","pathname":"/api/reviews","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.DZVFD4-x.js"}],"styles":[],"routeData":{"route":"/api/settings/public/index.test","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/settings\\/public\\/index\\.test$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"settings","dynamic":false,"spread":false}],[{"content":"public","dynamic":false,"spread":false}],[{"content":"index.test","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/settings/public/index.test.ts","pathname":"/api/settings/public/index.test","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.DZVFD4-x.js"}],"styles":[],"routeData":{"route":"/api/settings/public","isIndex":true,"type":"endpoint","pattern":"^\\/api\\/settings\\/public\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"settings","dynamic":false,"spread":false}],[{"content":"public","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/settings/public/index.ts","pathname":"/api/settings/public","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.DZVFD4-x.js"}],"styles":[],"routeData":{"route":"/business/create","isIndex":false,"type":"page","pattern":"^\\/business\\/create\\/?$","segments":[[{"content":"business","dynamic":false,"spread":false}],[{"content":"create","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/business/create.astro","pathname":"/business/create","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.DZVFD4-x.js"}],"styles":[{"type":"external","src":"_astro/globals.CVYn8NoA.css"},{"type":"inline","content":".ProseMirror{outline:none;min-height:150px}.ProseMirror p.is-editor-empty:first-child:before{content:attr(data-placeholder);color:#9ca3af;float:left;height:0;pointer-events:none}.ProseMirror h2{font-size:1.5rem;font-weight:700;margin-top:1rem;margin-bottom:.5rem}.ProseMirror h3{font-size:1.25rem;font-weight:600;margin-top:.75rem;margin-bottom:.5rem}.ProseMirror ul,.ProseMirror ol{padding-left:1.5rem;margin:.5rem 0}.ProseMirror a{color:var(--color-primary);text-decoration:underline}\n"}],"routeData":{"route":"/business/[slug]/edit","isIndex":true,"type":"page","pattern":"^\\/business\\/([^/]+?)\\/edit\\/?$","segments":[[{"content":"business","dynamic":false,"spread":false}],[{"content":"slug","dynamic":true,"spread":false}],[{"content":"edit","dynamic":false,"spread":false}]],"params":["slug"],"component":"src/pages/business/[slug]/edit/index.astro","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.DZVFD4-x.js"}],"styles":[{"type":"external","src":"_astro/globals.CVYn8NoA.css"}],"routeData":{"route":"/business/[slug]/product/new","isIndex":true,"type":"page","pattern":"^\\/business\\/([^/]+?)\\/product\\/new\\/?$","segments":[[{"content":"business","dynamic":false,"spread":false}],[{"content":"slug","dynamic":true,"spread":false}],[{"content":"product","dynamic":false,"spread":false}],[{"content":"new","dynamic":false,"spread":false}]],"params":["slug"],"component":"src/pages/business/[slug]/product/new/index.astro","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.DZVFD4-x.js"}],"styles":[{"type":"external","src":"_astro/globals.CVYn8NoA.css"}],"routeData":{"route":"/business/[slug]/product/[id]/edit","isIndex":true,"type":"page","pattern":"^\\/business\\/([^/]+?)\\/product\\/([^/]+?)\\/edit\\/?$","segments":[[{"content":"business","dynamic":false,"spread":false}],[{"content":"slug","dynamic":true,"spread":false}],[{"content":"product","dynamic":false,"spread":false}],[{"content":"id","dynamic":true,"spread":false}],[{"content":"edit","dynamic":false,"spread":false}]],"params":["slug","id"],"component":"src/pages/business/[slug]/product/[id]/edit/index.astro","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.DZVFD4-x.js"}],"styles":[{"type":"external","src":"_astro/globals.CVYn8NoA.css"}],"routeData":{"route":"/business/[slug]/product/[id]","isIndex":true,"type":"page","pattern":"^\\/business\\/([^/]+?)\\/product\\/([^/]+?)\\/?$","segments":[[{"content":"business","dynamic":false,"spread":false}],[{"content":"slug","dynamic":true,"spread":false}],[{"content":"product","dynamic":false,"spread":false}],[{"content":"id","dynamic":true,"spread":false}]],"params":["slug","id"],"component":"src/pages/business/[slug]/product/[id]/index.astro","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.DZVFD4-x.js"}],"styles":[{"type":"external","src":"_astro/globals.CVYn8NoA.css"}],"routeData":{"route":"/business/[slug]/products","isIndex":false,"type":"page","pattern":"^\\/business\\/([^/]+?)\\/products\\/?$","segments":[[{"content":"business","dynamic":false,"spread":false}],[{"content":"slug","dynamic":true,"spread":false}],[{"content":"products","dynamic":false,"spread":false}]],"params":["slug"],"component":"src/pages/business/[slug]/products.astro","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.DZVFD4-x.js"}],"styles":[{"type":"external","src":"_astro/globals.CVYn8NoA.css"}],"routeData":{"route":"/business/[slug]","isIndex":false,"type":"page","pattern":"^\\/business\\/([^/]+?)\\/?$","segments":[[{"content":"business","dynamic":false,"spread":false}],[{"content":"slug","dynamic":true,"spread":false}]],"params":["slug"],"component":"src/pages/business/[slug].astro","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.DZVFD4-x.js"}],"styles":[{"type":"external","src":"_astro/globals.CVYn8NoA.css"}],"routeData":{"route":"/businesses","isIndex":true,"type":"page","pattern":"^\\/businesses\\/?$","segments":[[{"content":"businesses","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/businesses/index.astro","pathname":"/businesses","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.DZVFD4-x.js"}],"styles":[{"type":"external","src":"_astro/globals.CVYn8NoA.css"}],"routeData":{"route":"/categories","isIndex":true,"type":"page","pattern":"^\\/categories\\/?$","segments":[[{"content":"categories","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/categories/index.astro","pathname":"/categories","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.DZVFD4-x.js"}],"styles":[{"type":"external","src":"_astro/globals.CVYn8NoA.css"}],"routeData":{"route":"/dashboard","isIndex":false,"type":"page","pattern":"^\\/dashboard\\/?$","segments":[[{"content":"dashboard","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/dashboard.astro","pathname":"/dashboard","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.DZVFD4-x.js"}],"styles":[{"type":"external","src":"_astro/globals.CVYn8NoA.css"}],"routeData":{"route":"/edit-business-page/[id]","isIndex":false,"type":"page","pattern":"^\\/edit-business-page\\/([^/]+?)\\/?$","segments":[[{"content":"edit-business-page","dynamic":false,"spread":false}],[{"content":"id","dynamic":true,"spread":false}]],"params":["id"],"component":"src/pages/edit-business-page/[id].astro","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.DZVFD4-x.js"}],"styles":[{"type":"external","src":"_astro/Layout.CVYn8NoA.css"}],"routeData":{"route":"/faq","isIndex":false,"type":"page","pattern":"^\\/faq\\/?$","segments":[[{"content":"faq","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/faq.astro","pathname":"/faq","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.DZVFD4-x.js"}],"styles":[{"type":"external","src":"_astro/globals.CVYn8NoA.css"}],"routeData":{"route":"/forgot-password","isIndex":false,"type":"page","pattern":"^\\/forgot-password\\/?$","segments":[[{"content":"forgot-password","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/forgot-password.astro","pathname":"/forgot-password","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.DZVFD4-x.js"}],"styles":[{"type":"external","src":"_astro/globals.CVYn8NoA.css"}],"routeData":{"route":"/listing/create","isIndex":false,"type":"page","pattern":"^\\/listing\\/create\\/?$","segments":[[{"content":"listing","dynamic":false,"spread":false}],[{"content":"create","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/listing/create.astro","pathname":"/listing/create","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.DZVFD4-x.js"}],"styles":[{"type":"external","src":"_astro/globals.CVYn8NoA.css"}],"routeData":{"route":"/listing","isIndex":true,"type":"page","pattern":"^\\/listing\\/?$","segments":[[{"content":"listing","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/listing/index.astro","pathname":"/listing","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.DZVFD4-x.js"}],"styles":[{"type":"external","src":"_astro/globals.CVYn8NoA.css"}],"routeData":{"route":"/login","isIndex":false,"type":"page","pattern":"^\\/login\\/?$","segments":[[{"content":"login","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/login.astro","pathname":"/login","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.DZVFD4-x.js"}],"styles":[{"type":"external","src":"_astro/globals.CVYn8NoA.css"}],"routeData":{"route":"/organization/[slug]","isIndex":false,"type":"page","pattern":"^\\/organization\\/([^/]+?)\\/?$","segments":[[{"content":"organization","dynamic":false,"spread":false}],[{"content":"slug","dynamic":true,"spread":false}]],"params":["slug"],"component":"src/pages/organization/[slug].astro","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.DZVFD4-x.js"}],"styles":[{"type":"external","src":"_astro/globals.CVYn8NoA.css"}],"routeData":{"route":"/organization","isIndex":true,"type":"page","pattern":"^\\/organization\\/?$","segments":[[{"content":"organization","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/organization/index.astro","pathname":"/organization","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.DZVFD4-x.js"}],"styles":[{"type":"external","src":"_astro/Layout.CVYn8NoA.css"}],"routeData":{"route":"/pricing","isIndex":false,"type":"page","pattern":"^\\/pricing\\/?$","segments":[[{"content":"pricing","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/pricing.astro","pathname":"/pricing","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.DZVFD4-x.js"}],"styles":[{"type":"external","src":"_astro/Layout.CVYn8NoA.css"}],"routeData":{"route":"/privacy","isIndex":false,"type":"page","pattern":"^\\/privacy\\/?$","segments":[[{"content":"privacy","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/privacy.astro","pathname":"/privacy","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.DZVFD4-x.js"}],"styles":[{"type":"external","src":"_astro/globals.CVYn8NoA.css"}],"routeData":{"route":"/products-services","isIndex":true,"type":"page","pattern":"^\\/products-services\\/?$","segments":[[{"content":"products-services","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/products-services/index.astro","pathname":"/products-services","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.DZVFD4-x.js"}],"styles":[{"type":"external","src":"_astro/globals.CVYn8NoA.css"}],"routeData":{"route":"/register","isIndex":false,"type":"page","pattern":"^\\/register\\/?$","segments":[[{"content":"register","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/register.astro","pathname":"/register","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.DZVFD4-x.js"}],"styles":[{"type":"external","src":"_astro/globals.CVYn8NoA.css"}],"routeData":{"route":"/reset-password","isIndex":false,"type":"page","pattern":"^\\/reset-password\\/?$","segments":[[{"content":"reset-password","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/reset-password.astro","pathname":"/reset-password","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.DZVFD4-x.js"}],"styles":[{"type":"external","src":"_astro/globals.CVYn8NoA.css"}],"routeData":{"route":"/search","isIndex":false,"type":"page","pattern":"^\\/search\\/?$","segments":[[{"content":"search","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/search.astro","pathname":"/search","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.DZVFD4-x.js"}],"styles":[{"type":"external","src":"_astro/globals.CVYn8NoA.css"}],"routeData":{"route":"/subscribe","isIndex":false,"type":"page","pattern":"^\\/subscribe\\/?$","segments":[[{"content":"subscribe","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/subscribe.astro","pathname":"/subscribe","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.DZVFD4-x.js"}],"styles":[{"type":"external","src":"_astro/Layout.CVYn8NoA.css"}],"routeData":{"route":"/terms","isIndex":false,"type":"page","pattern":"^\\/terms\\/?$","segments":[[{"content":"terms","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/terms.astro","pathname":"/terms","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.DZVFD4-x.js"}],"styles":[{"type":"external","src":"_astro/globals.CVYn8NoA.css"}],"routeData":{"route":"/verify","isIndex":false,"type":"page","pattern":"^\\/verify\\/?$","segments":[[{"content":"verify","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/verify.astro","pathname":"/verify","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.DZVFD4-x.js"}],"styles":[{"type":"external","src":"_astro/globals.CVYn8NoA.css"}],"routeData":{"route":"/","isIndex":true,"type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}}],"serverLike":true,"middlewareMode":"classic","site":"https://timorlist.com","base":"/","trailingSlash":"ignore","compressHTML":true,"experimentalQueuedRendering":{"enabled":false,"poolSize":0,"contentCache":false},"componentMetadata":[["/home/jasonwill/dev-projects/timorlist/src/pages/404.astro",{"propagation":"none","containsHead":true}],["/home/jasonwill/dev-projects/timorlist/src/pages/faq.astro",{"propagation":"none","containsHead":true}],["/home/jasonwill/dev-projects/timorlist/src/pages/pricing.astro",{"propagation":"none","containsHead":true}],["/home/jasonwill/dev-projects/timorlist/src/pages/privacy.astro",{"propagation":"none","containsHead":true}],["/home/jasonwill/dev-projects/timorlist/src/pages/terms.astro",{"propagation":"none","containsHead":true}],["/home/jasonwill/dev-projects/timorlist/src/pages/admin/login.astro",{"propagation":"none","containsHead":true}],["/home/jasonwill/dev-projects/timorlist/src/pages/admin/ai-tools.astro",{"propagation":"none","containsHead":true}],["/home/jasonwill/dev-projects/timorlist/src/pages/admin/blogs.astro",{"propagation":"none","containsHead":true}],["/home/jasonwill/dev-projects/timorlist/src/pages/admin/businesses.astro",{"propagation":"none","containsHead":true}],["/home/jasonwill/dev-projects/timorlist/src/pages/admin/categories.astro",{"propagation":"none","containsHead":true}],["/home/jasonwill/dev-projects/timorlist/src/pages/admin/heroes.astro",{"propagation":"none","containsHead":true}],["/home/jasonwill/dev-projects/timorlist/src/pages/admin/index.astro",{"propagation":"none","containsHead":true}],["/home/jasonwill/dev-projects/timorlist/src/pages/admin/listing/index.astro",{"propagation":"none","containsHead":true}],["/home/jasonwill/dev-projects/timorlist/src/pages/admin/reviews.astro",{"propagation":"none","containsHead":true}],["/home/jasonwill/dev-projects/timorlist/src/pages/admin/settings.astro",{"propagation":"none","containsHead":true}],["/home/jasonwill/dev-projects/timorlist/src/pages/admin/skus.astro",{"propagation":"none","containsHead":true}],["/home/jasonwill/dev-projects/timorlist/src/pages/admin/subscriptions.astro",{"propagation":"none","containsHead":true}],["/home/jasonwill/dev-projects/timorlist/src/pages/admin/users.astro",{"propagation":"none","containsHead":true}],["/home/jasonwill/dev-projects/timorlist/src/pages/account.astro",{"propagation":"none","containsHead":true}],["/home/jasonwill/dev-projects/timorlist/src/pages/admin/listing/[id]/edit/index.astro",{"propagation":"none","containsHead":true}],["/home/jasonwill/dev-projects/timorlist/src/pages/admin/listing/new/index.astro",{"propagation":"none","containsHead":true}],["/home/jasonwill/dev-projects/timorlist/src/pages/business/[slug].astro",{"propagation":"none","containsHead":true}],["/home/jasonwill/dev-projects/timorlist/src/pages/business/[slug]/edit/index.astro",{"propagation":"none","containsHead":true}],["/home/jasonwill/dev-projects/timorlist/src/pages/business/[slug]/product/[id]/edit/index.astro",{"propagation":"none","containsHead":true}],["/home/jasonwill/dev-projects/timorlist/src/pages/business/[slug]/product/[id]/index.astro",{"propagation":"none","containsHead":true}],["/home/jasonwill/dev-projects/timorlist/src/pages/business/[slug]/product/new/index.astro",{"propagation":"none","containsHead":true}],["/home/jasonwill/dev-projects/timorlist/src/pages/business/[slug]/products.astro",{"propagation":"none","containsHead":true}],["/home/jasonwill/dev-projects/timorlist/src/pages/businesses/index.astro",{"propagation":"none","containsHead":true}],["/home/jasonwill/dev-projects/timorlist/src/pages/categories/index.astro",{"propagation":"none","containsHead":true}],["/home/jasonwill/dev-projects/timorlist/src/pages/dashboard.astro",{"propagation":"none","containsHead":true}],["/home/jasonwill/dev-projects/timorlist/src/pages/edit-business-page/[id].astro",{"propagation":"none","containsHead":true}],["/home/jasonwill/dev-projects/timorlist/src/pages/forgot-password.astro",{"propagation":"none","containsHead":true}],["/home/jasonwill/dev-projects/timorlist/src/pages/index.astro",{"propagation":"none","containsHead":true}],["/home/jasonwill/dev-projects/timorlist/src/pages/listing/create.astro",{"propagation":"none","containsHead":true}],["/home/jasonwill/dev-projects/timorlist/src/pages/listing/index.astro",{"propagation":"none","containsHead":true}],["/home/jasonwill/dev-projects/timorlist/src/pages/login.astro",{"propagation":"none","containsHead":true}],["/home/jasonwill/dev-projects/timorlist/src/pages/organization/[slug].astro",{"propagation":"none","containsHead":true}],["/home/jasonwill/dev-projects/timorlist/src/pages/organization/index.astro",{"propagation":"none","containsHead":true}],["/home/jasonwill/dev-projects/timorlist/src/pages/products-services/index.astro",{"propagation":"none","containsHead":true}],["/home/jasonwill/dev-projects/timorlist/src/pages/register.astro",{"propagation":"none","containsHead":true}],["/home/jasonwill/dev-projects/timorlist/src/pages/reset-password.astro",{"propagation":"none","containsHead":true}],["/home/jasonwill/dev-projects/timorlist/src/pages/search.astro",{"propagation":"none","containsHead":true}],["/home/jasonwill/dev-projects/timorlist/src/pages/subscribe.astro",{"propagation":"none","containsHead":true}],["/home/jasonwill/dev-projects/timorlist/src/pages/verify.astro",{"propagation":"none","containsHead":true}]],"renderers":[],"clientDirectives":[["idle","(()=>{var l=(n,t)=>{let i=async()=>{await(await n())()},e=typeof t.value==\"object\"?t.value:void 0,s={timeout:e==null?void 0:e.timeout};\"requestIdleCallback\"in window?window.requestIdleCallback(i,s):setTimeout(i,s.timeout||200)};(self.Astro||(self.Astro={})).idle=l;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var n=(a,t)=>{let i=async()=>{await(await a())()};if(t.value){let e=matchMedia(t.value);e.matches?i():e.addEventListener(\"change\",i,{once:!0})}};(self.Astro||(self.Astro={})).media=n;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var a=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let l of e)if(l.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=a;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000virtual:astro:actions/noop-entrypoint":"chunks/noop-entrypoint_DsBX4kaI.mjs","\u0000virtual:astro:middleware":"virtual_astro_middleware.mjs","\u0000virtual:astro:session-driver":"chunks/_virtual_astro_session-driver_Csu6PJY6.mjs","\u0000virtual:astro:server-island-manifest":"chunks/_virtual_astro_server-island-manifest_CFl7y3Qj.mjs","\u0000virtual:astro:page:src/pages/404@_@astro":"chunks/404_BYsy9mHq.mjs","\u0000virtual:astro:page:src/pages/faq@_@astro":"chunks/faq_Bg3MV2Uk.mjs","\u0000virtual:astro:page:src/pages/pricing@_@astro":"chunks/pricing_BHPnZUNK.mjs","\u0000virtual:astro:page:src/pages/privacy@_@astro":"chunks/privacy_DyByXMNr.mjs","\u0000virtual:astro:page:src/pages/terms@_@astro":"chunks/terms_DZMajW_P.mjs","virtual:cloudflare/worker-entry":"entry.mjs","/home/jasonwill/dev-projects/timorlist/node_modules/.pnpm/@mastra+core@1.29.1_@standard-community+standard-json@0.3.5_@standard-schema+spec@1.1.0_@type_i6arlswilrcvjqttmicjuyfvqy/node_modules/@mastra/core/dist/models-dev-7DMCC3CV.js":"chunks/models-dev-7DMCC3CV_D-Fy_AzE.mjs","/home/jasonwill/dev-projects/timorlist/node_modules/.pnpm/@mastra+core@1.29.1_@standard-community+standard-json@0.3.5_@standard-schema+spec@1.1.0_@type_i6arlswilrcvjqttmicjuyfvqy/node_modules/@mastra/core/dist/netlify-3MEE7WN2.js":"chunks/netlify-3MEE7WN2_ZeY5-GqY.mjs","/home/jasonwill/dev-projects/timorlist/node_modules/.pnpm/@mastra+core@1.29.1_@standard-community+standard-json@0.3.5_@standard-schema+spec@1.1.0_@type_i6arlswilrcvjqttmicjuyfvqy/node_modules/@mastra/core/dist/mastra-6C2DXY54.js":"chunks/mastra-6C2DXY54_B3cDTFMO.mjs","/home/jasonwill/dev-projects/timorlist/node_modules/.pnpm/@aws-sdk+credential-provider-env@3.972.33/node_modules/@aws-sdk/credential-provider-env/dist-es/index.js":"chunks/index_C1mnLswQ.mjs","/home/jasonwill/dev-projects/timorlist/src/lib/db.ts":"chunks/db_DBymDTwI.mjs","\u0000virtual:astro:page:src/pages/api/auth/session@_@ts":"chunks/session_D3gHEIlC.mjs","\u0000virtual:astro:page:src/pages/api/auth/sign-in@_@ts":"chunks/sign-in_BjqIfEov.mjs","\u0000virtual:astro:page:src/pages/api/auth/sign-out@_@ts":"chunks/sign-out_-hWTGCbH.mjs","\u0000virtual:astro:page:src/pages/api/auth/sign-up@_@ts":"chunks/sign-up_CzjROFqP.mjs","\u0000virtual:astro:page:src/pages/api/businesses/create@_@ts":"chunks/create_I9dowDv-.mjs","\u0000virtual:astro:page:src/pages/api/reviews/[id]/reply@_@ts":"chunks/reply_tmKiLu_J.mjs","\u0000virtual:astro:page:src/pages/api/settings/public/index@_@ts":"chunks/index_4ya3V8w3.mjs","/home/jasonwill/dev-projects/timorlist/node_modules/.pnpm/@astrojs+cloudflare@13.2.2_@types+node@25.6.0_astro@6.1.10_@types+node@25.6.0_jiti@2.6.1_ligh_clyr42orzduuomti5kmxdgziha/node_modules/@astrojs/cloudflare/dist/entrypoints/image-service-workerd.js":"chunks/image-service-workerd_DT3cKJB-.mjs","/home/jasonwill/dev-projects/timorlist/node_modules/.pnpm/drizzle-orm@0.45.2_@libsql+client@0.17.3_gel@2.2.0_kysely@0.28.16/node_modules/drizzle-orm/index.js":"chunks/index_BxPtajE1.mjs","/home/jasonwill/dev-projects/timorlist/node_modules/.pnpm/@better-auth+kysely-adapter@1.6.9_@better-auth+core@1.6.9_@better-auth+utils@0.4.0_@better-fe_cp2d3fwiayribp6iypw3g236de/node_modules/@better-auth/kysely-adapter/dist/bun-sqlite-dialect-na--YwnN.mjs":"chunks/bun-sqlite-dialect-na--YwnN_B88GRh2l.mjs","/home/jasonwill/dev-projects/timorlist/node_modules/.pnpm/@better-auth+kysely-adapter@1.6.9_@better-auth+core@1.6.9_@better-auth+utils@0.4.0_@better-fe_cp2d3fwiayribp6iypw3g236de/node_modules/@better-auth/kysely-adapter/dist/node-sqlite-dialect.mjs":"chunks/node-sqlite-dialect_GigwI8Qs.mjs","/home/jasonwill/dev-projects/timorlist/node_modules/.pnpm/@better-auth+kysely-adapter@1.6.9_@better-auth+core@1.6.9_@better-auth+utils@0.4.0_@better-fe_cp2d3fwiayribp6iypw3g236de/node_modules/@better-auth/kysely-adapter/dist/d1-sqlite-dialect-C2B7YsIT.mjs":"chunks/d1-sqlite-dialect-C2B7YsIT_CuaqdP4z.mjs","/home/jasonwill/dev-projects/timorlist/node_modules/.pnpm/@better-auth+memory-adapter@1.6.9_@better-auth+core@1.6.9_@better-auth+utils@0.4.0_@better-fe_upx3lxpj43nocxrcosx2fm2voy/node_modules/@better-auth/memory-adapter/dist/index.mjs":"chunks/index_TUxr8hq3.mjs","__vite-optional-peer-dep:@opentelemetry/api:@better-auth/core:false":"chunks/core_false_Dz-fc1mV.mjs","/home/jasonwill/dev-projects/timorlist/node_modules/.pnpm/js-tiktoken@1.0.21/node_modules/js-tiktoken/dist/ranks/o200k_base.js":"chunks/o200k_base_B7vZHzwp.mjs","/home/jasonwill/dev-projects/timorlist/node_modules/.pnpm/p-map@7.0.4/node_modules/p-map/index.js":"chunks/index_C0U3gxA3.mjs","/home/jasonwill/dev-projects/timorlist/node_modules/.pnpm/@mastra+core@1.29.1_@standard-community+standard-json@0.3.5_@standard-schema+spec@1.1.0_@type_i6arlswilrcvjqttmicjuyfvqy/node_modules/@mastra/core/dist/registry-generator-QMLHG25G.js":"chunks/registry-generator-QMLHG25G_G5izhrH1.mjs","/home/jasonwill/dev-projects/timorlist/node_modules/.pnpm/unenv@2.0.0-rc.24/node_modules/unenv/dist/runtime/node/http.mjs":"chunks/http_CbaUX0Jj.mjs","/home/jasonwill/dev-projects/timorlist/node_modules/.pnpm/@smithy+core@3.23.17/node_modules/@smithy/core/dist-es/submodules/event-streams/index.js":"chunks/index_C_1Br7TQ.mjs","\u0000virtual:astro:page:src/pages/account@_@astro":"chunks/account_CKsnI65M.mjs","\u0000virtual:astro:page:src/pages/admin/ai-tools@_@astro":"chunks/ai-tools_DAJcTqbK.mjs","\u0000virtual:astro:page:src/pages/admin/businesses@_@astro":"chunks/businesses_Dj08GVUm.mjs","\u0000virtual:astro:page:src/pages/admin/categories@_@astro":"chunks/categories_CSort1ni.mjs","\u0000virtual:astro:page:src/pages/admin/heroes@_@astro":"chunks/heroes_BDdWMyQg.mjs","\u0000virtual:astro:page:src/pages/admin/listing/new/index@_@astro":"chunks/index_Cdik8q7f.mjs","\u0000virtual:astro:page:src/pages/admin/listing/[id]/edit/index@_@astro":"chunks/index_BMCW5LTo.mjs","\u0000virtual:astro:page:src/pages/admin/listing/index@_@astro":"chunks/index_CarnYCiS.mjs","\u0000virtual:astro:page:src/pages/admin/login@_@astro":"chunks/login_JVuFjXOI.mjs","\u0000virtual:astro:page:src/pages/admin/reviews@_@astro":"chunks/reviews_Ca_Jk41i.mjs","\u0000virtual:astro:page:src/pages/admin/settings@_@astro":"chunks/settings_Dor0RXFC.mjs","\u0000virtual:astro:page:src/pages/admin/subscriptions@_@astro":"chunks/subscriptions_D_kDCx9g.mjs","\u0000virtual:astro:page:src/pages/admin/users@_@astro":"chunks/users_DnNZxIbG.mjs","\u0000virtual:astro:page:src/pages/admin/index@_@astro":"chunks/index_CBOeOKPj.mjs","\u0000virtual:astro:page:src/pages/api/account/businesses/[uid]@_@ts":"chunks/_uid__B8pD6GLu.mjs","\u0000virtual:astro:page:src/pages/api/account/profile/[uid]@_@ts":"chunks/_uid__BGBSaBaJ.mjs","\u0000virtual:astro:page:src/pages/api/account/subscription/[uid]@_@ts":"chunks/_uid__DAWlCmbM.mjs","\u0000virtual:astro:page:src/pages/api/account/index@_@ts":"chunks/index_B0dzHYgg.mjs","\u0000virtual:astro:page:src/pages/api/admin/ai-generate@_@ts":"chunks/ai-generate_CN3Ncyxv.mjs","\u0000virtual:astro:page:src/pages/api/admin/auth/login@_@ts":"chunks/login_D72be8uw.mjs","\u0000virtual:astro:page:src/pages/api/admin/blogs/index@_@ts":"chunks/index_BZkt4r6a.mjs","\u0000virtual:astro:page:src/pages/api/admin/businesses/index@_@ts":"chunks/index_BNpocdLH.mjs","\u0000virtual:astro:page:src/pages/api/admin/categories/index@_@ts":"chunks/index_CAGSfl1d.mjs","\u0000virtual:astro:page:src/pages/api/admin/listing/[id]@_@ts":"chunks/_id__CNKJDWbY.mjs","\u0000virtual:astro:page:src/pages/api/admin/orders/[id]/status@_@ts":"chunks/status_-ZKD17HL.mjs","\u0000virtual:astro:page:src/pages/api/admin/orders/[id]@_@ts":"chunks/_id__qyFTyDey.mjs","\u0000virtual:astro:page:src/pages/api/admin/orders/index@_@ts":"chunks/index_D9eUo-g1.mjs","\u0000virtual:astro:page:src/pages/api/admin/reviews/[id]@_@ts":"chunks/_id__NylUg-Xi.mjs","\u0000virtual:astro:page:src/pages/api/admin/reviews/index@_@ts":"chunks/index_CtI5K0mJ.mjs","\u0000virtual:astro:page:src/pages/api/admin/settings/save@_@ts":"chunks/save_DvDHaSvh.mjs","\u0000virtual:astro:page:src/pages/api/admin/settings/index@_@ts":"chunks/index_CVgbfyg9.mjs","\u0000virtual:astro:page:src/pages/api/admin/skus/index@_@ts":"chunks/index_CMaX3LAw.mjs","\u0000virtual:astro:page:src/pages/api/admin/stats@_@ts":"chunks/stats_CIF3FcRV.mjs","\u0000virtual:astro:page:src/pages/api/admin/users/index@_@ts":"chunks/index_B4w2rGXJ.mjs","\u0000virtual:astro:page:src/pages/api/ai-test@_@ts":"chunks/ai-test_CYgh1yDl.mjs","\u0000virtual:astro:page:src/pages/api/auth/forgot-password@_@ts":"chunks/forgot-password_9caUItSH.mjs","\u0000virtual:astro:page:src/pages/api/auth/index.test@_@ts":"chunks/index_CoKHAM49.mjs","\u0000virtual:astro:page:src/pages/api/auth/reset-password@_@ts":"chunks/reset-password_b3BAnoLn.mjs","\u0000virtual:astro:page:src/pages/api/auth/verify-email@_@ts":"chunks/verify-email_2To8UIpk.mjs","\u0000virtual:astro:page:src/pages/api/banners/active@_@ts":"chunks/active_C4hECbkR.mjs","\u0000virtual:astro:page:src/pages/api/banners/[id]@_@ts":"chunks/_id__DyJ4xljk.mjs","\u0000virtual:astro:page:src/pages/api/banners/index@_@ts":"chunks/index_C23YwK2d.mjs","\u0000virtual:astro:page:src/pages/api/businesses/featured@_@ts":"chunks/featured_BJWFLKCm.mjs","\u0000virtual:astro:page:src/pages/api/businesses/index.test@_@ts":"chunks/index_BrlglwEE.mjs","\u0000virtual:astro:page:src/pages/api/businesses/[slug]/like@_@ts":"chunks/like_BzgJGPlo.mjs","\u0000virtual:astro:page:src/pages/api/businesses/[slug]@_@ts":"chunks/_slug__B0L9uhW3.mjs","\u0000virtual:astro:page:src/pages/api/businesses/index@_@ts":"chunks/index_BmtmBDHE.mjs","\u0000virtual:astro:page:src/pages/api/categories/[slug]/listings@_@ts":"chunks/listings_DAZQOPRL.mjs","\u0000virtual:astro:page:src/pages/api/categories/index@_@ts":"chunks/index_Bwnb4WzZ.mjs","\u0000virtual:astro:page:src/pages/api/media/upload@_@ts":"chunks/upload_BM5kvm99.mjs","\u0000virtual:astro:page:src/pages/api/media/[id]@_@ts":"chunks/_id__B8Ewen9p.mjs","\u0000virtual:astro:page:src/pages/api/media/index@_@ts":"chunks/index_h0juu2Jz.mjs","\u0000virtual:astro:page:src/pages/api/orders/index@_@ts":"chunks/index_BUUiwP_V.mjs","\u0000virtual:astro:page:src/pages/api/products/[businessPageId]/sku-usage@_@ts":"chunks/sku-usage_DisJo5-V.mjs","\u0000virtual:astro:page:src/pages/api/products/[id]@_@ts":"chunks/_id__D4P0vC2a.mjs","\u0000virtual:astro:page:src/pages/api/products/index@_@ts":"chunks/index_2vxPuEIe.mjs","\u0000virtual:astro:page:src/pages/api/reviews/[id]/reply.test@_@ts":"chunks/reply_DvZhSPYT.mjs","\u0000virtual:astro:page:src/pages/api/reviews/index@_@ts":"chunks/index_Ci-IF-V5.mjs","\u0000virtual:astro:page:src/pages/api/settings/public/index.test@_@ts":"chunks/index_B7-r_Uml.mjs","\u0000virtual:astro:page:src/pages/business/create@_@astro":"chunks/create_UPCAjeHL.mjs","\u0000virtual:astro:page:src/pages/business/[slug]/product/new/index@_@astro":"chunks/index_DJ9hD_rx.mjs","\u0000virtual:astro:page:src/pages/business/[slug]/product/[id]/edit/index@_@astro":"chunks/index_Ur_P3ikw.mjs","\u0000virtual:astro:page:src/pages/business/[slug]/products@_@astro":"chunks/products_Wg-qYBTs.mjs","\u0000virtual:astro:page:src/pages/businesses/index@_@astro":"chunks/index_DxaJLkIr.mjs","\u0000virtual:astro:page:src/pages/categories/index@_@astro":"chunks/index_C9v8gDlt.mjs","\u0000virtual:astro:page:src/pages/dashboard@_@astro":"chunks/dashboard_5WvsbczL.mjs","\u0000virtual:astro:page:src/pages/edit-business-page/[id]@_@astro":"chunks/_id__BikjuDOM.mjs","\u0000virtual:astro:page:src/pages/forgot-password@_@astro":"chunks/forgot-password_DJxY11CR.mjs","\u0000virtual:astro:page:src/pages/listing/create@_@astro":"chunks/create_D3KdwYAO.mjs","\u0000virtual:astro:page:src/pages/listing/index@_@astro":"chunks/index_DkhEwhyV.mjs","\u0000virtual:astro:page:src/pages/login@_@astro":"chunks/login_Dy6SDNdz.mjs","\u0000virtual:astro:page:src/pages/organization/[slug]@_@astro":"chunks/_slug__DkZ72EZ3.mjs","\u0000virtual:astro:page:src/pages/organization/index@_@astro":"chunks/index_D9CUGZsm.mjs","\u0000virtual:astro:page:src/pages/products-services/index@_@astro":"chunks/index_3GiJNKHs.mjs","\u0000virtual:astro:page:src/pages/register@_@astro":"chunks/register_BlBIx6dd.mjs","\u0000virtual:astro:page:src/pages/reset-password@_@astro":"chunks/reset-password_CdfiGdcG.mjs","\u0000virtual:astro:page:src/pages/search@_@astro":"chunks/search_Ds91Pp7b.mjs","\u0000virtual:astro:page:src/pages/subscribe@_@astro":"chunks/subscribe_CBSczneP.mjs","\u0000virtual:astro:page:src/pages/verify@_@astro":"chunks/verify_BPiYX8n5.mjs","/home/jasonwill/dev-projects/timorlist/node_modules/.pnpm/p-retry@7.1.1/node_modules/p-retry/index.js":"chunks/index_Cf4VGmJ_.mjs","/home/jasonwill/dev-projects/timorlist/node_modules/.pnpm/magic-string@0.30.21/node_modules/magic-string/dist/magic-string.es.mjs":"chunks/magic-string.es_DRs_0OiS.mjs","/home/jasonwill/dev-projects/timorlist/node_modules/.pnpm/@aws-sdk+credential-provider-web-identity@3.972.37/node_modules/@aws-sdk/credential-provider-web-identity/dist-es/index.js":"chunks/index_bOUhIfq7.mjs","\u0000virtual:astro:page:src/pages/admin/blogs@_@astro":"chunks/blogs_BHVJjNDq.mjs","\u0000virtual:astro:page:src/pages/admin/skus@_@astro":"chunks/skus_CZfVHB6o.mjs","\u0000virtual:astro:page:src/pages/business/[slug]/edit/index@_@astro":"chunks/index_Qw2K5KK5.mjs","\u0000virtual:astro:page:src/pages/api/admin/listing/index@_@ts":"chunks/index_DyIUDBlH.mjs","\u0000virtual:astro:page:src/pages/index@_@astro":"chunks/index_tPZ1zscS.mjs","/home/jasonwill/dev-projects/timorlist/node_modules/.pnpm/js-tiktoken@1.0.21/node_modules/js-tiktoken/dist/lite.js":"chunks/lite_CGX4RqX2.mjs","/home/jasonwill/dev-projects/timorlist/node_modules/.pnpm/@aws-sdk+credential-provider-process@3.972.33/node_modules/@aws-sdk/credential-provider-process/dist-es/index.js":"chunks/index_CiCBp0bN.mjs","/home/jasonwill/dev-projects/timorlist/node_modules/.pnpm/@aws-sdk+credential-provider-http@3.972.35/node_modules/@aws-sdk/credential-provider-http/dist-es/index.js":"chunks/index_DSNXw3BO.mjs","/home/jasonwill/dev-projects/timorlist/node_modules/.pnpm/@sindresorhus+slugify@2.2.1/node_modules/@sindresorhus/slugify/index.js":"chunks/index_oVr1ny7P.mjs","\u0000virtual:astro:page:src/pages/business/[slug]/product/[id]/index@_@astro":"chunks/index_I8FcJytm.mjs","\u0000virtual:astro:page:src/pages/business/[slug]@_@astro":"chunks/_slug__COy_Z2H_.mjs","/home/jasonwill/dev-projects/timorlist/node_modules/.pnpm/@aws-sdk+credential-provider-ini@3.972.37/node_modules/@aws-sdk/credential-provider-ini/dist-es/index.js":"chunks/index_Bl9QKEpX.mjs","/home/jasonwill/dev-projects/timorlist/node_modules/.pnpm/@aws-sdk+credential-provider-sso@3.972.37/node_modules/@aws-sdk/credential-provider-sso/dist-es/loadSso.js":"chunks/loadSso_Cm99S80n.mjs","/home/jasonwill/dev-projects/timorlist/node_modules/.pnpm/@aws-sdk+nested-clients@3.997.5/node_modules/@aws-sdk/nested-clients/dist-es/submodules/sso-oidc/index.js":"chunks/index_z6VsZmad.mjs","/home/jasonwill/dev-projects/timorlist/node_modules/.pnpm/@aws-sdk+nested-clients@3.997.5/node_modules/@aws-sdk/nested-clients/dist-es/submodules/signin/index.js":"chunks/index_DzDNUD9C.mjs","/home/jasonwill/dev-projects/timorlist/node_modules/.pnpm/@smithy+credential-provider-imds@4.2.14/node_modules/@smithy/credential-provider-imds/dist-es/index.js":"chunks/index_DhQh9N_G.mjs","/home/jasonwill/dev-projects/timorlist/node_modules/.pnpm/@aws-sdk+credential-provider-sso@3.972.37/node_modules/@aws-sdk/credential-provider-sso/dist-es/index.js":"chunks/index_DaSKLUUJ.mjs","/home/jasonwill/dev-projects/timorlist/node_modules/.pnpm/@aws-sdk+nested-clients@3.997.5/node_modules/@aws-sdk/nested-clients/dist-es/submodules/sts/index.js":"chunks/index_Buzrhats.mjs","/home/jasonwill/dev-projects/timorlist/src/components/Header.astro?astro&type=script&index=0&lang.ts":"_astro/Header.astro_astro_type_script_index_0_lang.DjV_iy3x.js","/home/jasonwill/dev-projects/timorlist/src/components/ui/ToastContainer.astro?astro&type=script&index=0&lang.ts":"_astro/ToastContainer.astro_astro_type_script_index_0_lang.Dd9-u-5H.js","/home/jasonwill/dev-projects/timorlist/src/layouts/AdminLayout.astro?astro&type=script&index=0&lang.ts":"_astro/AdminLayout.astro_astro_type_script_index_0_lang.D884DpD3.js","/home/jasonwill/dev-projects/timorlist/src/pages/account.astro?astro&type=script&index=0&lang.ts":"_astro/account.astro_astro_type_script_index_0_lang.BxB1YfE8.js","/home/jasonwill/dev-projects/timorlist/src/pages/admin/ai-tools.astro?astro&type=script&index=0&lang.ts":"_astro/ai-tools.astro_astro_type_script_index_0_lang.BX50TJzx.js","/home/jasonwill/dev-projects/timorlist/src/pages/admin/blogs.astro?astro&type=script&index=0&lang.ts":"_astro/blogs.astro_astro_type_script_index_0_lang.Erzg2Ifi.js","/home/jasonwill/dev-projects/timorlist/src/pages/admin/businesses.astro?astro&type=script&index=0&lang.ts":"_astro/businesses.astro_astro_type_script_index_0_lang.CILSZMUH.js","/home/jasonwill/dev-projects/timorlist/src/pages/admin/categories.astro?astro&type=script&index=0&lang.ts":"_astro/categories.astro_astro_type_script_index_0_lang.BoXc79W3.js","/home/jasonwill/dev-projects/timorlist/src/pages/admin/heroes.astro?astro&type=script&index=0&lang.ts":"_astro/heroes.astro_astro_type_script_index_0_lang.DTI9loN-.js","/home/jasonwill/dev-projects/timorlist/src/pages/admin/index.astro?astro&type=script&index=0&lang.ts":"_astro/index.astro_astro_type_script_index_0_lang.D3TBJPAW.js","/home/jasonwill/dev-projects/timorlist/src/pages/admin/index.astro?astro&type=script&index=1&lang.ts":"_astro/index.astro_astro_type_script_index_1_lang.B2teq4tc.js","/home/jasonwill/dev-projects/timorlist/src/pages/admin/listing/[id]/edit/index.astro?astro&type=script&index=0&lang.ts":"_astro/index.astro_astro_type_script_index_0_lang.DAPoGg24.js","/home/jasonwill/dev-projects/timorlist/src/pages/admin/listing/index.astro?astro&type=script&index=0&lang.ts":"_astro/index.astro_astro_type_script_index_0_lang.-QUfLitK.js","/home/jasonwill/dev-projects/timorlist/src/pages/admin/listing/new/index.astro?astro&type=script&index=0&lang.ts":"_astro/index.astro_astro_type_script_index_0_lang.GAJwox4b.js","/home/jasonwill/dev-projects/timorlist/src/pages/admin/login.astro?astro&type=script&index=0&lang.ts":"_astro/login.astro_astro_type_script_index_0_lang.D4D9MnUF.js","/home/jasonwill/dev-projects/timorlist/src/pages/admin/reviews.astro?astro&type=script&index=0&lang.ts":"_astro/reviews.astro_astro_type_script_index_0_lang.CU9eqfI3.js","/home/jasonwill/dev-projects/timorlist/src/pages/admin/settings.astro?astro&type=script&index=0&lang.ts":"_astro/settings.astro_astro_type_script_index_0_lang.DPki-iFJ.js","/home/jasonwill/dev-projects/timorlist/src/pages/admin/skus.astro?astro&type=script&index=0&lang.ts":"_astro/skus.astro_astro_type_script_index_0_lang.Cz3-BUb_.js","/home/jasonwill/dev-projects/timorlist/src/pages/admin/subscriptions.astro?astro&type=script&index=0&lang.ts":"_astro/subscriptions.astro_astro_type_script_index_0_lang.B5fJFrrf.js","/home/jasonwill/dev-projects/timorlist/src/pages/admin/users.astro?astro&type=script&index=0&lang.ts":"_astro/users.astro_astro_type_script_index_0_lang.fcTGFMaK.js","/home/jasonwill/dev-projects/timorlist/src/pages/business/[slug].astro?astro&type=script&index=0&lang.ts":"_astro/_slug_.astro_astro_type_script_index_0_lang.oqZmommy.js","/home/jasonwill/dev-projects/timorlist/src/pages/business/[slug]/edit/index.astro?astro&type=script&index=0&lang.ts":"_astro/index.astro_astro_type_script_index_0_lang.IPyTWWZY.js","/home/jasonwill/dev-projects/timorlist/src/pages/business/[slug]/product/[id]/edit/index.astro?astro&type=script&index=0&lang.ts":"_astro/index.astro_astro_type_script_index_0_lang.DMLMJVNp.js","/home/jasonwill/dev-projects/timorlist/src/pages/business/[slug]/product/[id]/index.astro?astro&type=script&index=0&lang.ts":"_astro/index.astro_astro_type_script_index_0_lang.UbWiWfcL.js","/home/jasonwill/dev-projects/timorlist/src/pages/business/[slug]/product/new/index.astro?astro&type=script&index=0&lang.ts":"_astro/index.astro_astro_type_script_index_0_lang.CvFuQcJt.js","/home/jasonwill/dev-projects/timorlist/src/pages/business/[slug]/products.astro?astro&type=script&index=0&lang.ts":"_astro/products.astro_astro_type_script_index_0_lang.CyXlLh6v.js","/home/jasonwill/dev-projects/timorlist/src/pages/businesses/index.astro?astro&type=script&index=0&lang.ts":"_astro/index.astro_astro_type_script_index_0_lang.BHPAvCoO.js","/home/jasonwill/dev-projects/timorlist/src/pages/edit-business-page/[id].astro?astro&type=script&index=0&lang.ts":"_astro/_id_.astro_astro_type_script_index_0_lang.DeLcYFFh.js","/home/jasonwill/dev-projects/timorlist/src/pages/edit-business-page/[id].astro?astro&type=script&index=1&lang.ts":"_astro/_id_.astro_astro_type_script_index_1_lang.VOrDgTHg.js","/home/jasonwill/dev-projects/timorlist/src/pages/forgot-password.astro?astro&type=script&index=0&lang.ts":"_astro/forgot-password.astro_astro_type_script_index_0_lang.lJRdaNCA.js","/home/jasonwill/dev-projects/timorlist/src/pages/listing/create.astro?astro&type=script&index=0&lang.ts":"_astro/create.astro_astro_type_script_index_0_lang.3NK8tFSP.js","/home/jasonwill/dev-projects/timorlist/src/pages/listing/index.astro?astro&type=script&index=0&lang.ts":"_astro/index.astro_astro_type_script_index_0_lang.BbNLKKhi.js","/home/jasonwill/dev-projects/timorlist/src/pages/login.astro?astro&type=script&index=0&lang.ts":"_astro/login.astro_astro_type_script_index_0_lang.JmwO9Hg-.js","/home/jasonwill/dev-projects/timorlist/src/pages/organization/[slug].astro?astro&type=script&index=0&lang.ts":"_astro/_slug_.astro_astro_type_script_index_0_lang.CCKnN8ol.js","/home/jasonwill/dev-projects/timorlist/src/pages/organization/index.astro?astro&type=script&index=0&lang.ts":"_astro/index.astro_astro_type_script_index_0_lang.iz2I3aoo.js","/home/jasonwill/dev-projects/timorlist/src/pages/pricing.astro?astro&type=script&index=0&lang.ts":"_astro/pricing.astro_astro_type_script_index_0_lang.BifnCtj0.js","/home/jasonwill/dev-projects/timorlist/src/pages/products-services/index.astro?astro&type=script&index=0&lang.ts":"_astro/index.astro_astro_type_script_index_0_lang.B601Rrhj.js","/home/jasonwill/dev-projects/timorlist/src/pages/register.astro?astro&type=script&index=0&lang.ts":"_astro/register.astro_astro_type_script_index_0_lang.CWfTHYh0.js","/home/jasonwill/dev-projects/timorlist/src/pages/reset-password.astro?astro&type=script&index=0&lang.ts":"_astro/reset-password.astro_astro_type_script_index_0_lang.CupnuwE1.js","/home/jasonwill/dev-projects/timorlist/src/pages/search.astro?astro&type=script&index=0&lang.ts":"_astro/search.astro_astro_type_script_index_0_lang.DZ8rHqwN.js","/home/jasonwill/dev-projects/timorlist/src/pages/verify.astro?astro&type=script&index=0&lang.ts":"_astro/verify.astro_astro_type_script_index_0_lang.B7h4ZaxF.js","astro:scripts/page.js":"_astro/page.DZVFD4-x.js","astro:scripts/before-hydration.js":""},"inlinedScripts":[["/home/jasonwill/dev-projects/timorlist/src/components/Header.astro?astro&type=script&index=0&lang.ts","globalThis.process??={};globalThis.process.env??={};const o=document.getElementById(\"mobile-menu-btn\"),t=document.getElementById(\"mobile-menu\");o?.addEventListener(\"click\",()=>{t?.classList.toggle(\"hidden\")});document.getElementById(\"mobile-logout\")?.addEventListener(\"click\",async()=>{try{await fetch(\"/api/auth/sign-out\",{method:\"POST\",credentials:\"include\"})}catch(e){console.error(\"Logout error:\",e)}finally{sessionStorage.removeItem(\"userId\"),localStorage.removeItem(\"userId\"),window.location.href=\"/\"}});"],["/home/jasonwill/dev-projects/timorlist/src/pages/account.astro?astro&type=script&index=0&lang.ts","globalThis.process??={};globalThis.process.env??={};document.querySelectorAll(\".reply-btn\").forEach(e=>{e.addEventListener(\"click\",()=>{const t=e.getAttribute(\"data-review-id\");document.getElementById(\"reply-review-id\").value=t,document.getElementById(\"reply-action\").value=\"create\",document.getElementById(\"reply-modal-title\").textContent=\"Reply to Review\",document.getElementById(\"reply-text\").value=\"\",document.getElementById(\"reply-modal\").classList.remove(\"hidden\"),document.getElementById(\"reply-modal\").classList.add(\"flex\")})});document.querySelectorAll(\".edit-reply-btn\").forEach(e=>{e.addEventListener(\"click\",()=>{const t=e.getAttribute(\"data-review-id\"),l=e.getAttribute(\"data-reply\");document.getElementById(\"reply-review-id\").value=t,document.getElementById(\"reply-action\").value=\"edit\",document.getElementById(\"reply-modal-title\").textContent=\"Edit Reply\",document.getElementById(\"reply-text\").value=l||\"\",document.getElementById(\"reply-modal\").classList.remove(\"hidden\"),document.getElementById(\"reply-modal\").classList.add(\"flex\")})});document.querySelectorAll(\".delete-reply-btn\").forEach(e=>{e.addEventListener(\"click\",async()=>{if(!confirm(\"Are you sure you want to delete this reply?\"))return;const t=e.getAttribute(\"data-review-id\");(await fetch(`/api/reviews/${t}/reply`,{method:\"DELETE\"})).ok?window.location.reload():alert(\"Failed to delete reply\")})});document.getElementById(\"reply-modal-cancel\")?.addEventListener(\"click\",()=>{document.getElementById(\"reply-modal\").classList.add(\"hidden\"),document.getElementById(\"reply-modal\").classList.remove(\"flex\")});document.getElementById(\"reply-modal-submit\")?.addEventListener(\"click\",async()=>{const e=document.getElementById(\"reply-review-id\").value,t=document.getElementById(\"reply-action\").value,l=document.getElementById(\"reply-text\").value;if(!l.trim()){alert(\"Please enter a reply\");return}const n=t===\"create\"?\"POST\":\"PUT\",d=await fetch(`/api/reviews/${e}/reply`,{method:n,headers:{\"Content-Type\":\"application/json\"},body:JSON.stringify({comment:l})});if(d.ok)window.location.reload();else{const r=await d.json();alert(r.error?.message||\"Failed to submit reply\")}});"],["/home/jasonwill/dev-projects/timorlist/src/pages/admin/index.astro?astro&type=script&index=0&lang.ts","globalThis.process??={};globalThis.process.env??={};async function o(){try{const i=await(await fetch(\"/api/auth/session\")).json();(!i.user||i.user.role!==\"admin\")&&(window.location.href=\"/login?redirect=/admin\")}catch{window.location.href=\"/login?redirect=/admin\"}}o();"],["/home/jasonwill/dev-projects/timorlist/src/pages/admin/index.astro?astro&type=script&index=1&lang.ts","globalThis.process??={};globalThis.process.env??={};async function a(){try{const t=await(await fetch(\"/api/admin/stats\")).json();t.success&&(document.getElementById(\"stat-users\").textContent=String(t.data.totalUsers),document.getElementById(\"stat-businesses\").textContent=String(t.data.totalBusinesses),document.getElementById(\"stat-orders\").textContent=String(t.data.totalOrders),document.getElementById(\"stat-revenue\").textContent=\"$\"+String(t.data.totalRevenue||0))}catch(e){console.error(\"Error loading stats:\",e)}}async function r(){try{const t=await(await fetch(\"/api/admin/orders\")).json(),n=document.getElementById(\"orders-list\");if(!n)return;if(!t.success||t.data.length===0){n.innerHTML='<p class=\"text-center text-muted-foreground py-8 text-sm\">No orders yet</p>';return}n.innerHTML=t.data.slice(0,5).map(s=>`\n        <div class=\"flex items-center justify-between p-2 md:p-3 border rounded text-sm\">\n          <div class=\"min-w-0 flex-1\">\n            <p class=\"font-medium truncate\">#${s.id.slice(0,8)}</p>\n            <p class=\"text-xs text-muted-foreground truncate\">${s.planType||\"Subscription\"} - $${s.amount}</p>\n          </div>\n          <div class=\"flex items-center gap-2 ml-2\">\n            <span class=\"px-2 py-0.5 text-xs rounded-full ${s.status===\"paid\"?\"bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200\":\"bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200\"}\">${s.status}</span>\n          </div>\n        </div>\n      `).join(\"\")}catch(e){console.error(\"Error loading orders:\",e)}}a();r();"],["/home/jasonwill/dev-projects/timorlist/src/pages/admin/listing/[id]/edit/index.astro?astro&type=script&index=0&lang.ts","globalThis.process??={};globalThis.process.env??={};const a=document.getElementById(\"listing-form\");a?.addEventListener(\"submit\",async n=>{n.preventDefault();const t=new FormData(a),s={title:t.get(\"title\"),categoryId:t.get(\"categoryId\"),industry:t.get(\"industry\")||null,contactName:t.get(\"contactName\")||null,countryCode:t.get(\"countryCode\")||\"+670\",contactNumber:t.get(\"contactNumber\")||null,email:t.get(\"email\")||null,registrationUrl:t.get(\"registrationUrl\")||null,address:t.get(\"address\")||null,aboutUs:t.get(\"aboutUs\")||null,tags:t.get(\"tags\")?t.get(\"tags\")?.toString().split(\",\").map(e=>e.trim()):null,yearOfEstablishment:t.get(\"yearOfEstablishment\")?parseInt(t.get(\"yearOfEstablishment\")):null,status:t.get(\"status\")};try{const e=await fetch(window.location.pathname.replace(\"/edit\",\"\"),{method:\"PUT\",headers:{\"Content-Type\":\"application/json\"},body:JSON.stringify(s)});if(e.ok)alert(\"Listing updated successfully!\"),window.location.reload();else{const l=await e.json();alert(\"Failed to update listing: \"+(l.message||\"Unknown error\"))}}catch{alert(\"Failed to update listing\")}});"],["/home/jasonwill/dev-projects/timorlist/src/pages/admin/listing/index.astro?astro&type=script&index=0&lang.ts","globalThis.process??={};globalThis.process.env??={};let r=[];const g=document.getElementById(\"filter-type\"),u=document.getElementById(\"filter-status\"),p=document.getElementById(\"search\"),d=document.getElementById(\"listings-body\"),i=document.getElementById(\"no-results\"),l={business:\"bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400\",government:\"bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400\",nonprofit:\"bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400\"},c={draft:\"bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300\",live:\"bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400\",paid:\"bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400\",expired:\"bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400\"},x={business:\"Business\",government:\"Government\",nonprofit:\"Non-Profit\"};async function o(){const n=g?.value||\"\",e=u?.value||\"\",t=new URLSearchParams;n&&t.set(\"entityType\",n),e&&t.set(\"status\",e);try{const s=await(await fetch(`/api/admin/listing?${t}`)).json();s.success&&(r=s.data,m(),y())}catch(a){console.error(\"Failed to load listings:\",a),d.innerHTML='<tr><td colspan=\"5\" class=\"text-center py-8 text-red-500\">Failed to load listings</td></tr>'}}function m(){const n=r.length,e=r.filter(s=>s.entityType===\"business\").length,t=r.filter(s=>s.entityType===\"government\").length,a=r.filter(s=>s.entityType===\"nonprofit\").length;document.getElementById(\"stat-total\").textContent=String(n),document.getElementById(\"stat-businesses\").textContent=String(e),document.getElementById(\"stat-government\").textContent=String(t),document.getElementById(\"stat-nonprofit\").textContent=String(a)}function y(){const n=p?.value.toLowerCase()||\"\",e=r.filter(t=>!n||t.title.toLowerCase().includes(n));if(e.length===0){d.innerHTML=\"\",i.classList.remove(\"hidden\");return}i.classList.add(\"hidden\"),d.innerHTML=e.map(t=>`\n      <tr class=\"hover:bg-muted/30\">\n        <td class=\"px-4 py-3\">\n          <div class=\"font-medium\">${b(t.title)}</div>\n          <div class=\"text-xs text-muted-foreground\">\n            ${t.publishDate?`Published ${new Date(t.publishDate).toLocaleDateString()}`:\"Not published\"}\n          </div>\n        </td>\n        <td class=\"px-4 py-3\">\n          <span class=\"px-2 py-0.5 text-xs rounded-full ${l[t.entityType]||l.business}\">\n            ${x[t.entityType]||t.entityType}\n          </span>\n        </td>\n        <td class=\"px-4 py-3\">\n          <span class=\"px-2 py-0.5 text-xs rounded-full ${c[t.status]||c.draft}\">\n            ${t.status||\"draft\"}\n          </span>\n        </td>\n        <td class=\"px-4 py-3\">\n          ${t.ratingAverage&&t.ratingAverage>0?`<span class=\"text-sm\">${t.ratingAverage.toFixed(1)} ★</span>`:\"-\"}\n        </td>\n        <td class=\"px-4 py-3 text-right\">\n          <div class=\"flex items-center justify-end gap-2\">\n            <a href=\"/admin/listing/${t.id}/edit\" class=\"text-sm text-primary hover:underline\">\n              Edit\n            </a>\n            <a href=\"/business/${t.slug}\" target=\"_blank\" class=\"text-sm text-muted-foreground hover:text-foreground\">\n              View →\n            </a>\n          </div>\n        </td>\n      </tr>\n    `).join(\"\")}function b(n){const e=document.createElement(\"div\");return e.textContent=n,e.innerHTML}g?.addEventListener(\"change\",o);u?.addEventListener(\"change\",o);p?.addEventListener(\"input\",y);o();"],["/home/jasonwill/dev-projects/timorlist/src/pages/admin/listing/new/index.astro?astro&type=script&index=0&lang.ts","globalThis.process??={};globalThis.process.env??={};const i=document.getElementById(\"listing-form\"),l=document.getElementById(\"industry-field\"),r=document.querySelectorAll(\".type-option input\");r.forEach(n=>{n.addEventListener(\"change\",()=>{n.value===\"business\"?l?.classList.remove(\"hidden\"):l?.classList.add(\"hidden\")})});i?.addEventListener(\"submit\",async n=>{n.preventDefault();const t=new FormData(i),a={entityType:t.get(\"entityType\"),title:t.get(\"title\"),categoryId:t.get(\"categoryId\"),industry:t.get(\"industry\")||null,contactName:t.get(\"contactName\")||null,countryCode:t.get(\"countryCode\")||\"+670\",contactNumber:t.get(\"contactNumber\")||null,email:t.get(\"email\")||null,registrationUrl:t.get(\"registrationUrl\")||null,address:t.get(\"address\")||null,aboutUs:t.get(\"aboutUs\")||null,tags:t.get(\"tags\")?t.get(\"tags\")?.toString().split(\",\").map(e=>e.trim()):null,yearOfEstablishment:t.get(\"yearOfEstablishment\")?parseInt(t.get(\"yearOfEstablishment\")):null,status:\"draft\"};if(!a.entityType){alert(\"Please select a listing type\");return}if(!a.title){alert(\"Please enter a title\");return}if(!a.categoryId){alert(\"Please select a category\");return}try{const e=await fetch(\"/api/admin/listing\",{method:\"POST\",headers:{\"Content-Type\":\"application/json\"},body:JSON.stringify(a)});if(e.ok){const s=await e.json();window.location.href=`/admin/listing/${s.id}/edit`}else{const s=await e.json();alert(\"Failed to create listing: \"+(s.message||\"Unknown error\"))}}catch{alert(\"Failed to create listing\")}});"],["/home/jasonwill/dev-projects/timorlist/src/pages/admin/login.astro?astro&type=script&index=0&lang.ts","globalThis.process??={};globalThis.process.env??={};const o=document.getElementById(\"login-form\"),t=document.getElementById(\"error-message\");o?.addEventListener(\"submit\",async a=>{a.preventDefault();const s=new FormData(o),n=s.get(\"email\"),r=s.get(\"password\");try{const e=await(await fetch(\"/api/admin/auth/login\",{method:\"POST\",headers:{\"Content-Type\":\"application/json\"},body:JSON.stringify({email:n,password:r})})).json();e.success?(localStorage.setItem(\"adminSession\",JSON.stringify(e.session)),localStorage.setItem(\"adminUser\",JSON.stringify(e.user)),document.cookie=`auth_token=${e.session.id}; path=/; max-age=${10080*60}`,document.cookie=`user_id=${e.user.id}; path=/; max-age=${10080*60}`,window.location.href=\"/admin\"):(t.textContent=e.error?.message||\"Invalid credentials\",t.classList.remove(\"hidden\"))}catch{t.textContent=\"An error occurred. Please try again.\",t.classList.remove(\"hidden\")}});"],["/home/jasonwill/dev-projects/timorlist/src/pages/business/[slug].astro?astro&type=script&index=0&lang.ts","globalThis.process??={};globalThis.process.env??={};const n=document.getElementById(\"lightbox-modal\"),s=document.getElementById(\"lightbox-content\"),r=document.getElementById(\"lightbox-counter\"),a=document.querySelectorAll(\"[data-gallery-idx]\");let t=0;function m(e){t=e,o(t),n?.classList.remove(\"hidden\"),n?.classList.add(\"flex\"),document.body.style.overflow=\"hidden\"}function c(){n?.classList.add(\"hidden\"),n?.classList.remove(\"flex\"),document.body.style.overflow=\"\"}function o(e){if(!s||!r)return;const i=document.querySelectorAll(\"[data-gallery-idx] img\"),l=i.length;if(l===0)return;t=(e+l)%l;const d=i[t];s.innerHTML=`<img src=\"${d.src}\" alt=\"${d.alt}\" class=\"max-w-full max-h-[85vh] object-contain rounded-lg\" />`,r.textContent=`${t+1} / ${l}`}a.forEach((e,i)=>{e.addEventListener(\"click\",()=>m(i))});document.getElementById(\"lightbox-close\")?.addEventListener(\"click\",c);document.getElementById(\"lightbox-prev\")?.addEventListener(\"click\",()=>o(t-1));document.getElementById(\"lightbox-next\")?.addEventListener(\"click\",()=>o(t+1));n?.addEventListener(\"click\",e=>{e.target===n&&c()});document.addEventListener(\"keydown\",e=>{n?.classList.contains(\"flex\")&&(e.key===\"Escape\"&&c(),e.key===\"ArrowLeft\"&&o(t-1),e.key===\"ArrowRight\"&&o(t+1))});document.getElementById(\"share-btn\")?.addEventListener(\"click\",()=>{navigator.share?navigator.share({title:document.title,text:\"Check out this business on TimorLIST\",url:window.location.href}):(navigator.clipboard.writeText(window.location.href),alert(\"Link copied!\"))});document.getElementById(\"save-btn\")?.addEventListener(\"click\",()=>{alert(\"Save feature coming soon!\")});document.getElementById(\"like-btn\")?.addEventListener(\"click\",()=>{alert(\"Like feature coming soon!\")});"],["/home/jasonwill/dev-projects/timorlist/src/pages/business/[slug]/product/[id]/index.astro?astro&type=script&index=0&lang.ts","globalThis.process??={};globalThis.process.env??={};const i=document.querySelectorAll(\".thumbnail-btn\"),c=document.getElementById(\"current-image\"),n=document.querySelectorAll(\".image-dot\"),a=document.querySelector(\".overflow-x-auto\");i.forEach((r,o)=>{r.addEventListener(\"click\",()=>{const l=r.querySelector(\"img\");c&&l&&(c.src=l.src),i.forEach((e,t)=>{e.classList.toggle(\"border-primary\",t===o),e.classList.toggle(\"border-transparent\",t!==o)}),n.forEach((e,t)=>{e.classList.toggle(\"bg-amber-500\",t===o),e.classList.toggle(\"bg-gray-300\",t!==o)})})});document.getElementById(\"scroll-left\")?.addEventListener(\"click\",()=>{a?.scrollBy({left:-160,behavior:\"smooth\"})});document.getElementById(\"scroll-right\")?.addEventListener(\"click\",()=>{a?.scrollBy({left:160,behavior:\"smooth\"})});document.getElementById(\"share-btn\")?.addEventListener(\"click\",()=>{navigator.share?navigator.share({title:document.title,text:\"Check out this product on TimorLIST\",url:window.location.href}):(navigator.clipboard.writeText(window.location.href),alert(\"Link copied to clipboard!\"))});document.getElementById(\"mobile-share-btn\")?.addEventListener(\"click\",()=>{navigator.share?navigator.share({title:document.title,text:\"Check out this product on TimorLIST\",url:window.location.href}):(navigator.clipboard.writeText(window.location.href),alert(\"Link copied to clipboard!\"))});"],["/home/jasonwill/dev-projects/timorlist/src/pages/businesses/index.astro?astro&type=script&index=0&lang.ts","globalThis.process??={};globalThis.process.env??={};const y=document.getElementById(\"search\"),m=document.getElementById(\"category-filter\"),h=document.getElementById(\"sort-filter\"),p=document.getElementById(\"businesses-grid\"),u=document.getElementById(\"result-count\"),g=()=>p?.querySelectorAll(\"[data-business]\")||[],s=()=>{const o=y?.value.toLowerCase()||\"\",r=m?.value||\"\",C=h?.value||\"recent\",f=g();let c=0;f.forEach(t=>{const e=t.dataset.title?.toLowerCase()||\"\",a=t.dataset.category?.toLowerCase()||\"\",n=t.dataset.tags?.toLowerCase()||\"\";(e.includes(o)||n.includes(o))&&(!r||a===r)?(t.style.display=\"\",c++):t.style.display=\"none\"});const l=Array.from(g()).filter(t=>t.style.display!==\"none\");l.sort((t,e)=>{const a=t.dataset.title||\"\",n=e.dataset.title||\"\",i=parseInt(t.dataset.likes)||0,d=parseInt(e.dataset.likes)||0,B=parseFloat(t.dataset.rating)||0,E=parseFloat(e.dataset.rating)||0;switch(C){case\"popular\":return d-i;case\"rating\":return E-B;case\"name\":return a.localeCompare(n);default:return 0}}),l.forEach(t=>p?.appendChild(t)),u&&(u.textContent=String(c))};y?.addEventListener(\"input\",s);m?.addEventListener(\"change\",s);h?.addEventListener(\"change\",s);s();"],["/home/jasonwill/dev-projects/timorlist/src/pages/edit-business-page/[id].astro?astro&type=script&index=0&lang.ts","globalThis.process??={};globalThis.process.env??={};async function n(){try{(await(await fetch(\"/api/auth/session\")).json()).user||(window.location.href=\"/login?redirect=\"+encodeURIComponent(window.location.pathname))}catch{window.location.href=\"/login?redirect=\"+encodeURIComponent(window.location.pathname)}}n();"],["/home/jasonwill/dev-projects/timorlist/src/pages/forgot-password.astro?astro&type=script&index=0&lang.ts","globalThis.process??={};globalThis.process.env??={};const r=document.getElementById(\"forgot-password-form\"),e=document.getElementById(\"message\");r?.addEventListener(\"submit\",async o=>{o.preventDefault();const n=new FormData(r).get(\"email\"),t=r.querySelector('button[type=\"submit\"]');t.disabled=!0,t.textContent=\"Sending...\";try{const s=await(await fetch(\"/api/auth/forgot-password\",{method:\"POST\",headers:{\"Content-Type\":\"application/json\"},body:JSON.stringify({email:n})})).json();e&&(e.classList.remove(\"hidden\"),s.success?(e.className=\"mt-4 p-3 rounded-md bg-green-50 text-green-700 border border-green-200\",e.textContent=\"Check your email for reset instructions. The link will expire in 1 hour.\",r.reset()):(e.className=\"mt-4 p-3 rounded-md bg-red-50 text-red-700 border border-red-200\",e.textContent=s.error?.message||\"Failed to send reset email\"))}catch{e&&(e.classList.remove(\"hidden\"),e.className=\"mt-4 p-3 rounded-md bg-red-50 text-red-700 border border-red-200\",e.textContent=\"An error occurred. Please try again.\")}finally{t.disabled=!1,t.textContent=\"Send Reset Link\"}});"],["/home/jasonwill/dev-projects/timorlist/src/pages/listing/create.astro?astro&type=script&index=0&lang.ts","globalThis.process??={};globalThis.process.env??={};const a=document.getElementById(\"listing-form\"),t=document.getElementById(\"slug\"),c=document.getElementById(\"title\"),d=document.getElementById(\"save-draft-btn\"),u=document.getElementById(\"publish-btn\"),g=document.getElementById(\"subscribe-btn\"),i=document.getElementById(\"entityType\");document.getElementById(\"slug-help\");c?.addEventListener(\"input\",()=>{t&&!t.dataset.manual&&(t.value=c.value.toLowerCase().replace(/\\s+/g,\"-\").replace(/[^a-z0-9-]/g,\"\").replace(/-+/g,\"-\").replace(/^-|-$/g,\"\"))});t?.addEventListener(\"input\",()=>{t&&(t.dataset.manual=\"true\")});async function l(o){if(!a||!i)return;const e=new FormData(a),r={entityType:i.value,title:e.get(\"title\"),slug:e.get(\"slug\"),contactName:e.get(\"contactName\"),contactNumber:e.get(\"contactNumber\"),email:e.get(\"email\"),address:e.get(\"address\"),publishNow:o};try{const n=await(await fetch(\"/api/businesses/create\",{method:\"POST\",headers:{\"Content-Type\":\"application/json\"},body:JSON.stringify(r)})).json();n.success&&n.data?.slug?window.location.href=`/business/${n.data.slug}`:alert(n.error?.message||\"Failed to create listing\")}catch(s){console.error(\"Submit error:\",s),alert(\"Failed to create listing\")}}d?.addEventListener(\"click\",()=>l(!1));u?.addEventListener(\"click\",()=>l(!0));g?.addEventListener(\"click\",()=>{window.location.href=\"/pricing\"});"],["/home/jasonwill/dev-projects/timorlist/src/pages/listing/index.astro?astro&type=script&index=0&lang.ts","globalThis.process??={};globalThis.process.env??={};const n=document.getElementById(\"search\"),r=document.getElementById(\"industry-filter\"),s=document.getElementById(\"category-filter\"),a=document.getElementById(\"sort-filter\"),t=()=>{const e=new URLSearchParams(window.location.search);return e.set(\"page\",\"1\"),n?.value?e.set(\"search\",n.value):e.delete(\"search\"),r?.value?e.set(\"industry\",r.value):e.delete(\"industry\"),s?.value?e.set(\"category\",s.value):e.delete(\"category\"),a?.value&&e.set(\"sort\",a.value),`/listing?${e.toString()}`};n?.addEventListener(\"change\",()=>window.location.href=t());r?.addEventListener(\"change\",()=>window.location.href=t());s?.addEventListener(\"change\",()=>window.location.href=t());a?.addEventListener(\"change\",()=>window.location.href=t());"],["/home/jasonwill/dev-projects/timorlist/src/pages/login.astro?astro&type=script&index=0&lang.ts","globalThis.process??={};globalThis.process.env??={};function d(){const e=new URLSearchParams(window.location.search).get(\"redirect\");if(e)try{const t=new URL(e);t.origin===window.location.origin&&sessionStorage.setItem(\"auth_redirect\",t.pathname+t.search)}catch{}const r=window.location.pathname;window.history.replaceState({},\"\",r)}d();const n=document.getElementById(\"login-form\");n?.addEventListener(\"submit\",async a=>{a.preventDefault();const e=new FormData(n),r=e.get(\"email\"),t=e.get(\"password\"),s=e.get(\"rememberMe\")===\"on\";try{const o=await(await fetch(\"/api/auth/sign-in\",{method:\"POST\",headers:{\"Content-Type\":\"application/json\"},body:JSON.stringify({email:r,password:t,rememberMe:s})})).json();if(o.success){const c=sessionStorage.getItem(\"auth_redirect\");sessionStorage.removeItem(\"auth_redirect\"),window.location.href=c||\"/account\"}else alert(o.error?.message||\"Login failed\")}catch{alert(\"An error occurred. Please try again.\")}});"],["/home/jasonwill/dev-projects/timorlist/src/pages/organization/[slug].astro?astro&type=script&index=0&lang.ts","globalThis.process??={};globalThis.process.env??={};document.getElementById(\"share-btn\")?.addEventListener(\"click\",()=>{navigator.share?navigator.share({title:document.title,text:\"Check out this organization on TimorLIST\",url:window.location.href}):(navigator.clipboard.writeText(window.location.href),alert(\"Link copied to clipboard!\"))});"],["/home/jasonwill/dev-projects/timorlist/src/pages/organization/index.astro?astro&type=script&index=0&lang.ts","globalThis.process??={};globalThis.process.env??={};const c=document.getElementById(\"type-filter\"),a=document.getElementById(\"search-input\"),l=document.getElementById(\"result-count\");function e(){const n=c?.value||\"\",s=a?.value.toLowerCase()||\"\",i=document.querySelectorAll(\"[data-card]\");let o=0;i.forEach(t=>{const r=t.dataset.title||\"\",u=!n||t.dataset.orgType===n,d=!s||r.includes(s);u&&d?(t.style.display=\"\",o++):t.style.display=\"none\"}),l&&(l.textContent=String(o))}c?.addEventListener(\"change\",e);a?.addEventListener(\"input\",()=>setTimeout(e,300));e();"],["/home/jasonwill/dev-projects/timorlist/src/pages/pricing.astro?astro&type=script&index=0&lang.ts","globalThis.process??={};globalThis.process.env??={};const e=document.getElementById(\"monthly-btn\"),t=document.getElementById(\"yearly-btn\"),n=document.getElementById(\"basic-price\"),o=document.getElementById(\"basic-period\"),l=document.getElementById(\"basic-yearly\"),s=document.getElementById(\"pro-price\"),d=document.getElementById(\"pro-period\"),m=document.getElementById(\"pro-yearly\"),c=document.getElementById(\"max-price\"),r=document.getElementById(\"max-period\"),y=document.getElementById(\"max-yearly\"),b=document.querySelectorAll(\".subscribe-link\");document.querySelectorAll(\".yearly-link\");function u(f){const g=f?\"-yearly\":\"\";b.forEach(a=>{const i=a.dataset.plan;i&&(a.href=`/subscribe?plan=${i}${g}`)})}function p(){e?.classList.add(\"bg-background\",\"shadow-sm\"),e?.classList.remove(\"text-muted-foreground\"),t?.classList.remove(\"bg-background\",\"shadow-sm\"),t?.classList.add(\"text-muted-foreground\"),n&&(n.textContent=\"$29\"),o&&(o.textContent=\"per month\"),l?.classList.add(\"hidden\"),s&&(s.textContent=\"$59\"),d&&(d.textContent=\"per month\"),m?.classList.add(\"hidden\"),c&&(c.textContent=\"$89\"),r&&(r.textContent=\"per month\"),y?.classList.add(\"hidden\"),u(!1)}function x(){t?.classList.add(\"bg-background\",\"shadow-sm\"),t?.classList.remove(\"text-muted-foreground\"),e?.classList.remove(\"bg-background\",\"shadow-sm\"),e?.classList.add(\"text-muted-foreground\"),n&&(n.textContent=\"$290\"),o&&(o.textContent=\"per year\"),l?.classList.remove(\"hidden\"),s&&(s.textContent=\"$590\"),d&&(d.textContent=\"per year\"),m?.classList.remove(\"hidden\"),c&&(c.textContent=\"$890\"),r&&(r.textContent=\"per year\"),y?.classList.remove(\"hidden\"),u(!0)}e?.addEventListener(\"click\",p);t?.addEventListener(\"click\",x);"],["/home/jasonwill/dev-projects/timorlist/src/pages/products-services/index.astro?astro&type=script&index=0&lang.ts","globalThis.process??={};globalThis.process.env??={};const t=document.getElementById(\"search\"),n=document.getElementById(\"business-filter\"),s=document.getElementById(\"sort-filter\"),e=()=>`/products-services?${new URLSearchParams({page:\"1\",search:t?.value||\"\",business:n?.value||\"\",sort:s?.value||\"recent\"}).toString()}`;t?.addEventListener(\"change\",()=>window.location.href=e());n?.addEventListener(\"change\",()=>window.location.href=e());s?.addEventListener(\"change\",()=>window.location.href=e());"],["/home/jasonwill/dev-projects/timorlist/src/pages/register.astro?astro&type=script&index=0&lang.ts","globalThis.process??={};globalThis.process.env??={};const a=document.getElementById(\"register-form\");a?.addEventListener(\"submit\",async o=>{o.preventDefault();const e=new FormData(a),r=e.get(\"name\"),n=e.get(\"email\"),c=e.get(\"phone\"),t=e.get(\"password\"),i=e.get(\"confirmPassword\");if(t.length<8){alert(\"Password must be at least 8 characters\");return}if(t!==i){alert(\"Passwords do not match\");return}try{const s=await(await fetch(\"/api/auth/sign-up\",{method:\"POST\",headers:{\"Content-Type\":\"application/json\"},body:JSON.stringify({email:n,password:t,name:r,phone:c||void 0})})).json();s.success?window.location.href=\"/account\":alert(s.error?.message||\"Registration failed\")}catch{alert(\"An error occurred. Please try again.\")}});"],["/home/jasonwill/dev-projects/timorlist/src/pages/reset-password.astro?astro&type=script&index=0&lang.ts","globalThis.process??={};globalThis.process.env??={};const u=new URLSearchParams(window.location.search),a=u.get(\"token\"),i=document.getElementById(\"token\"),s=document.getElementById(\"reset-password-form\"),e=document.getElementById(\"message\");if(a)i&&(i.value=a);else{e&&(e.classList.remove(\"hidden\"),e.className=\"mt-4 p-3 rounded-md bg-red-50 text-red-700 border border-red-200\",e.textContent=\"Invalid or missing reset token. Please request a new password reset.\");const r=s?.querySelector('button[type=\"submit\"]');r&&(r.disabled=!0)}s?.addEventListener(\"submit\",async r=>{r.preventDefault();const o=new FormData(s),n=o.get(\"password\"),c=o.get(\"confirmPassword\"),m=o.get(\"token\");if(n!==c){e&&(e.classList.remove(\"hidden\"),e.className=\"mt-4 p-3 rounded-md bg-red-50 text-red-700 border border-red-200\",e.textContent=\"Passwords do not match\");return}if(n.length<8){e&&(e.classList.remove(\"hidden\"),e.className=\"mt-4 p-3 rounded-md bg-red-50 text-red-700 border border-red-200\",e.textContent=\"Password must be at least 8 characters\");return}const t=s.querySelector('button[type=\"submit\"]');t.disabled=!0,t.textContent=\"Resetting...\";try{const d=await(await fetch(\"/api/auth/reset-password\",{method:\"POST\",headers:{\"Content-Type\":\"application/json\"},body:JSON.stringify({token:m,password:n})})).json();e&&(e.classList.remove(\"hidden\"),d.success?(e.className=\"mt-4 p-3 rounded-md bg-green-50 text-green-700 border border-green-200\",e.textContent=\"Password reset successful! Redirecting to login...\",s.reset(),setTimeout(()=>{window.location.href=\"/login?reset=success\"},2e3)):(e.className=\"mt-4 p-3 rounded-md bg-red-50 text-red-700 border border-red-200\",e.textContent=d.error?.message||\"Failed to reset password\",t.disabled=!1,t.textContent=\"Reset Password\"))}catch{e&&(e.classList.remove(\"hidden\"),e.className=\"mt-4 p-3 rounded-md bg-red-50 text-red-700 border border-red-200\",e.textContent=\"An error occurred. Please try again.\"),t.disabled=!1,t.textContent=\"Reset Password\"}});"],["/home/jasonwill/dev-projects/timorlist/src/pages/search.astro?astro&type=script&index=0&lang.ts","globalThis.process??={};globalThis.process.env??={};function o(r){if(!r)return\"\";const t=document.createElement(\"div\");return t.textContent=r,t.innerHTML}const d=document.getElementById(\"search-form\"),c=document.getElementById(\"search-input\"),s=document.getElementById(\"search-results\"),i=new URLSearchParams(window.location.search),a=i.get(\"q\");a&&(c.value=a,m(a));d?.addEventListener(\"submit\",r=>{r.preventDefault();const t=c.value.trim();t&&(window.location.href=`/search?q=${encodeURIComponent(t)}`)});async function m(r){if(s){s.innerHTML='<p class=\"text-center py-8\">Searching...</p>';try{const n=await(await fetch(`/api/businesses?search=${encodeURIComponent(r)}`)).json();if(n.success&&n.data&&n.data.length>0){const l=`\n          <div class=\"grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6\">\n            ${n.data.map(e=>`\n              <a href=\"/business/${o(e.slug)}\" class=\"block group\">\n                <Card class=\"overflow-hidden transition-shadow hover:shadow-lg\">\n                  <div class=\"aspect-[3/2] bg-muted relative\">\n                    ${e.bannerImageId?`<img src=\"/api/media/${e.bannerImageId}\" alt=\"${o(e.title)}\" class=\"w-full h-full object-cover\" />`:`<div class=\"w-full h-full flex items-center justify-center text-4xl font-bold text-muted-foreground\">${o(e.title?.charAt(0)||\"B\")}</div>`}\n                  </div>\n                  <CardContent class=\"p-4\">\n                    <h3 class=\"font-semibold group-hover:text-primary transition-colors\">${o(e.title)}</h3>\n                    ${e.categoryId?`<p class=\"text-sm text-muted-foreground\">${o(e.categoryId)}</p>`:\"\"}\n                    ${e.address?`<p class=\"text-sm text-muted-foreground mt-1\">${o(e.address)}</p>`:\"\"}\n                  </CardContent>\n                </Card>\n              </a>\n            `).join(\"\")}\n          </div>\n          <p class=\"text-center text-muted-foreground mt-4\">Found ${n.data.length} result(s)</p>\n        `;s.innerHTML=l}else s.innerHTML=`\n          <div class=\"text-center py-8\">\n            <p class=\"text-lg text-muted-foreground\">No businesses found for \"${o(r)}\"</p>\n            <p class=\"text-sm text-muted-foreground mt-2\">Try different keywords or browse our directory</p>\n            <a href=\"/businesses\" class=\"inline-block mt-4\">\n              <Button variant=\"outline\">Browse All Businesses</Button>\n            </a>\n          </div>\n        `}catch(t){console.error(\"Search error:\",t),s.innerHTML='<p class=\"text-center py-8 text-red-500\">Error performing search. Please try again.</p>'}}}"]],"assets":["/_headers","/_redirects","/_routes.json","/robots.txt","/_astro/AdminLayout.astro_astro_type_script_index_0_lang.D884DpD3.js","/_astro/ToastContainer.astro_astro_type_script_index_0_lang.Dd9-u-5H.js","/_astro/_id_.astro_astro_type_script_index_1_lang.VOrDgTHg.js","/_astro/ai-tools.astro_astro_type_script_index_0_lang.BX50TJzx.js","/_astro/blogs.astro_astro_type_script_index_0_lang.Erzg2Ifi.js","/_astro/businesses.astro_astro_type_script_index_0_lang.CILSZMUH.js","/_astro/categories.astro_astro_type_script_index_0_lang.BoXc79W3.js","/_astro/heroes.astro_astro_type_script_index_0_lang.DTI9loN-.js","/_astro/index.astro_astro_type_script_index_0_lang.CvFuQcJt.js","/_astro/index.astro_astro_type_script_index_0_lang.DMLMJVNp.js","/_astro/index.astro_astro_type_script_index_0_lang.IPyTWWZY.js","/_astro/page.DZVFD4-x.js","/_astro/preload-helper.C6pNqXq6.js","/_astro/products.astro_astro_type_script_index_0_lang.CyXlLh6v.js","/_astro/reviews.astro_astro_type_script_index_0_lang.CU9eqfI3.js","/_astro/settings.astro_astro_type_script_index_0_lang.DPki-iFJ.js","/_astro/skus.astro_astro_type_script_index_0_lang.Cz3-BUb_.js","/_astro/subscriptions.astro_astro_type_script_index_0_lang.B5fJFrrf.js","/_astro/toast.BG7MQHyG.js","/_astro/users.astro_astro_type_script_index_0_lang.fcTGFMaK.js","/_astro/verify.astro_astro_type_script_index_0_lang.B7h4ZaxF.js","/fonts/Inter-Bold.woff2","/fonts/Inter-Regular.woff2","/fonts/Oswald-Bold.woff2","/fonts/Oswald-Regular.woff2","/ui-screenshots/ScreenShot_2026-02-26_124626_796.png","/ui-screenshots/ScreenShot_2026-02-26_124700_493.png","/ui-screenshots/ScreenShot_2026-02-26_124742_210.png","/ui-screenshots/ScreenShot_2026-02-26_124756_120.png","/ui-screenshots/ScreenShot_2026-02-26_124837_821.png","/ui-screenshots/ScreenShot_2026-02-26_124902_704.png","/ui-screenshots/ScreenShot_2026-02-26_124920_227.png","/ui-screenshots/ScreenShot_2026-02-26_124948_776.png","/ui-screenshots/ScreenShot_2026-02-26_125015_451.png","/ui-screenshots/ScreenShot_2026-02-26_125037_216.png","/ui-screenshots/ScreenShot_2026-02-26_125058_335.png","/ui-screenshots/ScreenShot_2026-02-26_125121_521.png","/ui-screenshots/ScreenShot_2026-02-26_125159_464.png","/ui-screenshots/ScreenShot_2026-02-26_125216_060.png","/ui-screenshots/ScreenShot_2026-02-26_125230_710.png","/ui-screenshots/ScreenShot_2026-02-26_125248_869.png","/ui-screenshots/ScreenShot_2026-02-26_125322_916.png","/ui-screenshots/ScreenShot_2026-02-26_125344_636.png","/ui-screenshots/ScreenShot_2026-02-26_125402_640.png","/ui-screenshots/detail-page.png","/ui-screenshots/detail-page2.png","/ui-screenshots/ref1.png","/_astro/Layout.CVYn8NoA.css","/_astro/globals.CVYn8NoA.css","/_astro/page.DZVFD4-x.js","/404.html","/faq/index.html","/pricing/index.html","/privacy/index.html","/terms/index.html"],"buildFormat":"directory","checkOrigin":true,"actionBodySizeLimit":1048576,"serverIslandBodySizeLimit":1048576,"allowedDomains":[],"key":"istOTTAhsOBmRaETkTUpcttbST9ZW3Uqn65UeWq+3+E=","sessionConfig":{"driver":"unstorage/drivers/cloudflare-kv-binding","options":{"binding":"SESSION"}},"image":{},"devToolbar":{"enabled":false,"debugInfoOutput":""},"logLevel":"info","shouldInjectCspMetaTags":false});
const manifestRoutes = _manifest.routes;
const manifest = Object.assign(_manifest, {
  renderers,
  actions: () => import("./noop-entrypoint_DsBX4kaI.mjs"),
  middleware: () => import("../virtual_astro_middleware.mjs"),
  sessionDriver: () => import("./_virtual_astro_session-driver_Csu6PJY6.mjs"),
  serverIslandMappings: () => import("./_virtual_astro_server-island-manifest_CFl7y3Qj.mjs"),
  routes: manifestRoutes,
  pageMap
});
const createApp$1 = ({ streaming } = {}) => {
  return new App(manifest, streaming);
};
const createApp = createApp$1;
function getFirstForwardedValue(multiValueHeader) {
  return multiValueHeader?.toString()?.split(",").map((e) => e.trim())?.[0];
}
const IP_RE = /^[0-9a-fA-F.:]{1,45}$/;
function isValidIpAddress(value) {
  return IP_RE.test(value);
}
function getValidatedIpFromHeader(headerValue) {
  const raw = getFirstForwardedValue(headerValue);
  if (raw && isValidIpAddress(raw)) {
    return raw;
  }
  return void 0;
}
const app = createApp();
async function handle(request, env2, context) {
  const { pathname: requestPathname } = new URL(request.url);
  if (env2[sessionKVBindingName]) {
    const sessionConfigOptions = app.manifest.sessionConfig?.options ?? {};
    Object.assign(sessionConfigOptions, {
      binding: env2[sessionKVBindingName]
    });
  }
  if (app.manifest.assets.has(requestPathname)) {
    return env2.ASSETS.fetch(request.url.replace(/\.html$/, ""));
  }
  let routeData = void 0;
  if (app.isDev()) {
    const result = await app.devMatch(app.getPathnameFromRequest(request));
    if (result) {
      routeData = result.routeData;
    }
  } else {
    routeData = app.match(request);
  }
  if (!routeData) {
    const asset = await env2.ASSETS.fetch(
      request.url.replace(/index.html$/, "").replace(/\.html$/, "")
    );
    if (asset.status !== 404) {
      return asset;
    }
  }
  const locals = {
    cfContext: context
  };
  Object.defineProperty(locals, "runtime", {
    enumerable: false,
    value: {
      get env() {
        throw new Error(
          `Astro.locals.runtime.env has been removed in Astro v6. Use 'import { env } from "cloudflare:workers"' instead.`
        );
      },
      get cf() {
        throw new Error(
          `Astro.locals.runtime.cf has been removed in Astro v6. Use 'Astro.request.cf' instead.`
        );
      },
      get caches() {
        throw new Error(
          `Astro.locals.runtime.caches has been removed in Astro v6. Use the global 'caches' object instead.`
        );
      },
      get ctx() {
        throw new Error(
          `Astro.locals.runtime.ctx has been removed in Astro v6. Use 'Astro.locals.cfContext' instead.`
        );
      }
    }
  });
  const response = await app.render(request, {
    routeData,
    locals,
    prerenderedErrorPageFetch: async (url) => {
      return env2.ASSETS.fetch(url.replace(/\.html$/, ""));
    },
    clientAddress: getValidatedIpFromHeader(request.headers.get("cf-connecting-ip"))
  });
  if (app.setCookieHeaders) {
    for (const setCookieHeader of app.setCookieHeaders(response)) {
      response.headers.append("Set-Cookie", setCookieHeader);
    }
  }
  return response;
}
var server_default = {
  fetch: handle
};
const workerEntry = server_default ?? {};
export {
  notImplementedClass as a,
  notImplementedAsync as b,
  env as e,
  isRemoteAllowed as i,
  notImplemented as n,
  renderComponent as r,
  spreadAttributes as s,
  versions as v,
  workerEntry as w
};
