globalThis.process ??= {};
globalThis.process.env ??= {};
import { n as notImplemented, a as notImplementedClass, b as notImplementedAsync } from "./worker-entry_D6lIot5H.mjs";
const access$1 = /* @__PURE__ */ notImplemented("fs.access");
const copyFile$1 = /* @__PURE__ */ notImplemented("fs.copyFile");
const cp$1 = /* @__PURE__ */ notImplemented("fs.cp");
const open$1 = /* @__PURE__ */ notImplemented("fs.open");
const opendir$1 = /* @__PURE__ */ notImplemented("fs.opendir");
const rename$1 = /* @__PURE__ */ notImplemented("fs.rename");
const truncate$1 = /* @__PURE__ */ notImplemented("fs.truncate");
const rm$1 = /* @__PURE__ */ notImplemented("fs.rm");
const rmdir$1 = /* @__PURE__ */ notImplemented("fs.rmdir");
const mkdir$1 = /* @__PURE__ */ notImplemented("fs.mkdir");
const readdir$1 = /* @__PURE__ */ notImplemented("fs.readdir");
const readlink$1 = /* @__PURE__ */ notImplemented("fs.readlink");
const symlink$1 = /* @__PURE__ */ notImplemented("fs.symlink");
const lstat$1 = /* @__PURE__ */ notImplemented("fs.lstat");
const stat$1 = /* @__PURE__ */ notImplemented("fs.stat");
const link$1 = /* @__PURE__ */ notImplemented("fs.link");
const unlink$1 = /* @__PURE__ */ notImplemented("fs.unlink");
const chmod$1 = /* @__PURE__ */ notImplemented("fs.chmod");
const lchmod$1 = /* @__PURE__ */ notImplemented("fs.lchmod");
const lchown$1 = /* @__PURE__ */ notImplemented("fs.lchown");
const chown$1 = /* @__PURE__ */ notImplemented("fs.chown");
const utimes$1 = /* @__PURE__ */ notImplemented("fs.utimes");
const lutimes$1 = /* @__PURE__ */ notImplemented("fs.lutimes");
const realpath$1 = /* @__PURE__ */ notImplemented("fs.realpath");
const mkdtemp$1 = /* @__PURE__ */ notImplemented("fs.mkdtemp");
const writeFile$1 = /* @__PURE__ */ notImplemented("fs.writeFile");
const appendFile$1 = /* @__PURE__ */ notImplemented("fs.appendFile");
const readFile$1 = /* @__PURE__ */ notImplemented("fs.readFile");
const watch$1 = /* @__PURE__ */ notImplemented("fs.watch");
const statfs$1 = /* @__PURE__ */ notImplemented("fs.statfs");
const glob$1 = /* @__PURE__ */ notImplemented("fs.glob");
const Dir = /* @__PURE__ */ notImplementedClass("fs.Dir");
const Dirent = /* @__PURE__ */ notImplementedClass("fs.Dirent");
const Stats = /* @__PURE__ */ notImplementedClass("fs.Stats");
const ReadStream = /* @__PURE__ */ notImplementedClass("fs.ReadStream");
const WriteStream = /* @__PURE__ */ notImplementedClass("fs.WriteStream");
const FileReadStream = ReadStream;
const FileWriteStream = WriteStream;
function callbackify(fn) {
  const fnc = function(...args) {
    const cb = args.pop();
    fn().catch((error) => cb(error)).then((val) => cb(void 0, val));
  };
  fnc.__promisify__ = fn;
  fnc.native = fnc;
  return fnc;
}
const access = callbackify(access$1);
const appendFile = callbackify(appendFile$1);
const chown = callbackify(chown$1);
const chmod = callbackify(chmod$1);
const copyFile = callbackify(copyFile$1);
const cp = callbackify(cp$1);
const lchown = callbackify(lchown$1);
const lchmod = callbackify(lchmod$1);
const link = callbackify(link$1);
const lstat = callbackify(lstat$1);
const lutimes = callbackify(lutimes$1);
const mkdir = callbackify(mkdir$1);
const mkdtemp = callbackify(mkdtemp$1);
const realpath = callbackify(realpath$1);
const open = callbackify(open$1);
const opendir = callbackify(opendir$1);
const readdir = callbackify(readdir$1);
const readFile = callbackify(readFile$1);
const readlink = callbackify(readlink$1);
const rename = callbackify(rename$1);
const rm = callbackify(rm$1);
const rmdir = callbackify(rmdir$1);
const stat = callbackify(stat$1);
const symlink = callbackify(symlink$1);
const truncate = callbackify(truncate$1);
const unlink = callbackify(unlink$1);
const utimes = callbackify(utimes$1);
const writeFile = callbackify(writeFile$1);
const statfs = callbackify(statfs$1);
const close = /* @__PURE__ */ notImplementedAsync("fs.close");
const createReadStream = /* @__PURE__ */ notImplementedAsync("fs.createReadStream");
const createWriteStream = /* @__PURE__ */ notImplementedAsync("fs.createWriteStream");
const exists = /* @__PURE__ */ notImplementedAsync("fs.exists");
const fchown = /* @__PURE__ */ notImplementedAsync("fs.fchown");
const fchmod = /* @__PURE__ */ notImplementedAsync("fs.fchmod");
const fdatasync = /* @__PURE__ */ notImplementedAsync("fs.fdatasync");
const fstat = /* @__PURE__ */ notImplementedAsync("fs.fstat");
const fsync = /* @__PURE__ */ notImplementedAsync("fs.fsync");
const ftruncate = /* @__PURE__ */ notImplementedAsync("fs.ftruncate");
const futimes = /* @__PURE__ */ notImplementedAsync("fs.futimes");
const lstatSync = /* @__PURE__ */ notImplementedAsync("fs.lstatSync");
const read = /* @__PURE__ */ notImplementedAsync("fs.read");
const readv = /* @__PURE__ */ notImplementedAsync("fs.readv");
const realpathSync = /* @__PURE__ */ notImplementedAsync("fs.realpathSync");
const statSync = /* @__PURE__ */ notImplementedAsync("fs.statSync");
const unwatchFile = /* @__PURE__ */ notImplementedAsync("fs.unwatchFile");
const watch = /* @__PURE__ */ notImplementedAsync("fs.watch");
const watchFile = /* @__PURE__ */ notImplementedAsync("fs.watchFile");
const write = /* @__PURE__ */ notImplementedAsync("fs.write");
const writev = /* @__PURE__ */ notImplementedAsync("fs.writev");
const _toUnixTimestamp = /* @__PURE__ */ notImplementedAsync("fs._toUnixTimestamp");
const openAsBlob = /* @__PURE__ */ notImplementedAsync("fs.openAsBlob");
const glob = /* @__PURE__ */ notImplementedAsync("fs.glob");
const appendFileSync = /* @__PURE__ */ notImplemented("fs.appendFileSync");
const accessSync = /* @__PURE__ */ notImplemented("fs.accessSync");
const chownSync = /* @__PURE__ */ notImplemented("fs.chownSync");
const chmodSync = /* @__PURE__ */ notImplemented("fs.chmodSync");
const closeSync = /* @__PURE__ */ notImplemented("fs.closeSync");
const copyFileSync = /* @__PURE__ */ notImplemented("fs.copyFileSync");
const cpSync = /* @__PURE__ */ notImplemented("fs.cpSync");
const existsSync = () => false;
const fchownSync = /* @__PURE__ */ notImplemented("fs.fchownSync");
const fchmodSync = /* @__PURE__ */ notImplemented("fs.fchmodSync");
const fdatasyncSync = /* @__PURE__ */ notImplemented("fs.fdatasyncSync");
const fstatSync = /* @__PURE__ */ notImplemented("fs.fstatSync");
const fsyncSync = /* @__PURE__ */ notImplemented("fs.fsyncSync");
const ftruncateSync = /* @__PURE__ */ notImplemented("fs.ftruncateSync");
const futimesSync = /* @__PURE__ */ notImplemented("fs.futimesSync");
const lchownSync = /* @__PURE__ */ notImplemented("fs.lchownSync");
const lchmodSync = /* @__PURE__ */ notImplemented("fs.lchmodSync");
const linkSync = /* @__PURE__ */ notImplemented("fs.linkSync");
const lutimesSync = /* @__PURE__ */ notImplemented("fs.lutimesSync");
const mkdirSync = /* @__PURE__ */ notImplemented("fs.mkdirSync");
const mkdtempSync = /* @__PURE__ */ notImplemented("fs.mkdtempSync");
const openSync = /* @__PURE__ */ notImplemented("fs.openSync");
const opendirSync = /* @__PURE__ */ notImplemented("fs.opendirSync");
const readdirSync = /* @__PURE__ */ notImplemented("fs.readdirSync");
const readSync = /* @__PURE__ */ notImplemented("fs.readSync");
const readvSync = /* @__PURE__ */ notImplemented("fs.readvSync");
const readFileSync = /* @__PURE__ */ notImplemented("fs.readFileSync");
const readlinkSync = /* @__PURE__ */ notImplemented("fs.readlinkSync");
const renameSync = /* @__PURE__ */ notImplemented("fs.renameSync");
const rmSync = /* @__PURE__ */ notImplemented("fs.rmSync");
const rmdirSync = /* @__PURE__ */ notImplemented("fs.rmdirSync");
const symlinkSync = /* @__PURE__ */ notImplemented("fs.symlinkSync");
const truncateSync = /* @__PURE__ */ notImplemented("fs.truncateSync");
const unlinkSync = /* @__PURE__ */ notImplemented("fs.unlinkSync");
const utimesSync = /* @__PURE__ */ notImplemented("fs.utimesSync");
const writeFileSync = /* @__PURE__ */ notImplemented("fs.writeFileSync");
const writeSync = /* @__PURE__ */ notImplemented("fs.writeSync");
const writevSync = /* @__PURE__ */ notImplemented("fs.writevSync");
const statfsSync = /* @__PURE__ */ notImplemented("fs.statfsSync");
const globSync = /* @__PURE__ */ notImplemented("fs.globSync");
const UV_UDP_REUSEADDR = 4;
const dlopen = {
  RTLD_LAZY: 1,
  RTLD_NOW: 2,
  RTLD_GLOBAL: 256,
  RTLD_LOCAL: 0,
  RTLD_DEEPBIND: 8
};
const errno = {
  E2BIG: 7,
  EACCES: 13,
  EADDRINUSE: 98,
  EADDRNOTAVAIL: 99,
  EAFNOSUPPORT: 97,
  EAGAIN: 11,
  EALREADY: 114,
  EBADF: 9,
  EBADMSG: 74,
  EBUSY: 16,
  ECANCELED: 125,
  ECHILD: 10,
  ECONNABORTED: 103,
  ECONNREFUSED: 111,
  ECONNRESET: 104,
  EDEADLK: 35,
  EDESTADDRREQ: 89,
  EDOM: 33,
  EDQUOT: 122,
  EEXIST: 17,
  EFAULT: 14,
  EFBIG: 27,
  EHOSTUNREACH: 113,
  EIDRM: 43,
  EILSEQ: 84,
  EINPROGRESS: 115,
  EINTR: 4,
  EINVAL: 22,
  EIO: 5,
  EISCONN: 106,
  EISDIR: 21,
  ELOOP: 40,
  EMFILE: 24,
  EMLINK: 31,
  EMSGSIZE: 90,
  EMULTIHOP: 72,
  ENAMETOOLONG: 36,
  ENETDOWN: 100,
  ENETRESET: 102,
  ENETUNREACH: 101,
  ENFILE: 23,
  ENOBUFS: 105,
  ENODATA: 61,
  ENODEV: 19,
  ENOENT: 2,
  ENOEXEC: 8,
  ENOLCK: 37,
  ENOLINK: 67,
  ENOMEM: 12,
  ENOMSG: 42,
  ENOPROTOOPT: 92,
  ENOSPC: 28,
  ENOSR: 63,
  ENOSTR: 60,
  ENOSYS: 38,
  ENOTCONN: 107,
  ENOTDIR: 20,
  ENOTEMPTY: 39,
  ENOTSOCK: 88,
  ENOTSUP: 95,
  ENOTTY: 25,
  ENXIO: 6,
  EOPNOTSUPP: 95,
  EOVERFLOW: 75,
  EPERM: 1,
  EPIPE: 32,
  EPROTO: 71,
  EPROTONOSUPPORT: 93,
  EPROTOTYPE: 91,
  ERANGE: 34,
  EROFS: 30,
  ESPIPE: 29,
  ESRCH: 3,
  ESTALE: 116,
  ETIME: 62,
  ETIMEDOUT: 110,
  ETXTBSY: 26,
  EWOULDBLOCK: 11,
  EXDEV: 18
};
const signals = {
  SIGHUP: 1,
  SIGINT: 2,
  SIGQUIT: 3,
  SIGILL: 4,
  SIGTRAP: 5,
  SIGABRT: 6,
  SIGIOT: 6,
  SIGBUS: 7,
  SIGFPE: 8,
  SIGKILL: 9,
  SIGUSR1: 10,
  SIGSEGV: 11,
  SIGUSR2: 12,
  SIGPIPE: 13,
  SIGALRM: 14,
  SIGTERM: 15,
  SIGCHLD: 17,
  SIGSTKFLT: 16,
  SIGCONT: 18,
  SIGSTOP: 19,
  SIGTSTP: 20,
  SIGTTIN: 21,
  SIGTTOU: 22,
  SIGURG: 23,
  SIGXCPU: 24,
  SIGXFSZ: 25,
  SIGVTALRM: 26,
  SIGPROF: 27,
  SIGWINCH: 28,
  SIGIO: 29,
  SIGPOLL: 29,
  SIGPWR: 30,
  SIGSYS: 31
};
const priority = {
  PRIORITY_LOW: 19,
  PRIORITY_BELOW_NORMAL: 10,
  PRIORITY_NORMAL: 0,
  PRIORITY_ABOVE_NORMAL: -7,
  PRIORITY_HIGH: -14,
  PRIORITY_HIGHEST: -20
};
const constants = {
  UV_UDP_REUSEADDR,
  dlopen,
  errno,
  signals,
  priority
};
const NUM_CPUS = 8;
const availableParallelism = () => NUM_CPUS;
const arch = () => "";
const machine = () => "";
const endianness = () => "LE";
const cpus = () => {
  const info = {
    model: "",
    speed: 0,
    times: {
      user: 0,
      nice: 0,
      sys: 0,
      idle: 0,
      irq: 0
    }
  };
  return Array.from({ length: NUM_CPUS }, () => info);
};
const getPriority = () => 0;
const setPriority = /* @__PURE__ */ notImplemented("os.setPriority");
const homedir = () => "/";
const tmpdir = () => "/tmp";
const devNull = "/dev/null";
const freemem = () => 0;
const totalmem = () => 0;
const loadavg = () => [
  0,
  0,
  0
];
const uptime = () => 0;
const hostname = () => "";
const networkInterfaces = () => {
  return { lo0: [
    {
      address: "127.0.0.1",
      netmask: "255.0.0.0",
      family: "IPv4",
      mac: "00:00:00:00:00:00",
      internal: true,
      cidr: "127.0.0.1/8"
    },
    {
      address: "::1",
      netmask: "ffff:ffff:ffff:ffff:ffff:ffff:ffff:ffff",
      family: "IPv6",
      mac: "00:00:00:00:00:00",
      internal: true,
      cidr: "::1/128",
      scopeid: 0
    },
    {
      address: "fe80::1",
      netmask: "ffff:ffff:ffff:ffff::",
      family: "IPv6",
      mac: "00:00:00:00:00:00",
      internal: true,
      cidr: "fe80::1/64",
      scopeid: 1
    }
  ] };
};
const platform = () => "linux";
const type = () => "Linux";
const release = () => "";
const version = () => "";
const userInfo = (opts) => {
  const encode = (str) => {
    if (opts?.encoding) {
      const buff = Buffer.from(str);
      return opts.encoding === "buffer" ? buff : buff.toString(opts.encoding);
    }
    return str;
  };
  return {
    gid: 1e3,
    uid: 1e3,
    homedir: encode("/"),
    shell: encode("/bin/sh"),
    username: encode("root")
  };
};
const EOL = "\n";
const os = {
  arch,
  availableParallelism,
  constants,
  cpus,
  EOL,
  endianness,
  devNull,
  freemem,
  getPriority,
  homedir,
  hostname,
  loadavg,
  machine,
  networkInterfaces,
  platform,
  release,
  setPriority,
  tmpdir,
  totalmem,
  type,
  uptime,
  userInfo,
  version
};
export {
  statSync as $,
  copyFile$1 as A,
  chown$1 as B,
  chmod$1 as C,
  appendFile$1 as D,
  access$1 as E,
  readFileSync as F,
  homedir as G,
  mkdirSync as H,
  writevSync as I,
  writev as J,
  writeSync as K,
  writeFileSync as L,
  writeFile as M,
  write as N,
  watchFile as O,
  watch as P,
  utimesSync as Q,
  utimes as R,
  unwatchFile as S,
  unlinkSync as T,
  unlink as U,
  truncateSync as V,
  truncate as W,
  symlinkSync as X,
  symlink as Y,
  statfsSync as Z,
  statfs as _,
  watch$1 as a,
  chown as a$,
  stat as a0,
  rmdirSync as a1,
  rmdir as a2,
  rmSync as a3,
  rm as a4,
  renameSync as a5,
  rename as a6,
  realpathSync as a7,
  realpath as a8,
  readvSync as a9,
  lchmod as aA,
  glob as aB,
  futimesSync as aC,
  futimes as aD,
  ftruncateSync as aE,
  ftruncate as aF,
  fsyncSync as aG,
  fsync as aH,
  fstatSync as aI,
  fstat as aJ,
  fdatasyncSync as aK,
  fdatasync as aL,
  fchownSync as aM,
  fchown as aN,
  fchmodSync as aO,
  fchmod as aP,
  existsSync as aQ,
  exists as aR,
  createWriteStream as aS,
  createReadStream as aT,
  cpSync as aU,
  cp as aV,
  copyFileSync as aW,
  copyFile as aX,
  closeSync as aY,
  close as aZ,
  chownSync as a_,
  readv as aa,
  readlinkSync as ab,
  readlink as ac,
  readdirSync as ad,
  readdir as ae,
  readSync as af,
  readFile as ag,
  read as ah,
  opendirSync as ai,
  opendir as aj,
  openSync as ak,
  openAsBlob as al,
  open as am,
  mkdtempSync as an,
  mkdtemp as ao,
  mkdir as ap,
  lutimesSync as aq,
  lutimes as ar,
  lstatSync as as,
  lstat as at,
  linkSync as au,
  link as av,
  lchownSync as aw,
  lchown as ax,
  lchmodSync as ay,
  globSync as az,
  unlink$1 as b,
  chmodSync as b0,
  chmod as b1,
  appendFileSync as b2,
  appendFile as b3,
  accessSync as b4,
  access as b5,
  _toUnixTimestamp as b6,
  WriteStream as b7,
  Stats as b8,
  ReadStream as b9,
  FileWriteStream as ba,
  FileReadStream as bb,
  Dirent as bc,
  Dir as bd,
  tmpdir as be,
  os as bf,
  platform as bg,
  release as bh,
  statfs$1 as c,
  stat$1 as d,
  rm$1 as e,
  rename$1 as f,
  realpath$1 as g,
  readlink$1 as h,
  readdir$1 as i,
  readFile$1 as j,
  open$1 as k,
  mkdir$1 as l,
  mkdtemp$1 as m,
  lutimes$1 as n,
  opendir$1 as o,
  lstat$1 as p,
  link$1 as q,
  rmdir$1 as r,
  symlink$1 as s,
  truncate$1 as t,
  utimes$1 as u,
  lchown$1 as v,
  writeFile$1 as w,
  lchmod$1 as x,
  glob$1 as y,
  cp$1 as z
};
