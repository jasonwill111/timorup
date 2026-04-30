globalThis.process ??= {};
globalThis.process.env ??= {};
import { w as writeFile, a as watch, u as utimes, b as unlink, t as truncate, s as symlink, c as statfs, d as stat, r as rmdir, e as rm, f as rename, g as realpath, h as readlink, i as readdir, j as readFile, o as opendir, k as open, m as mkdtemp, l as mkdir, n as lutimes, p as lstat, q as link, v as lchown, x as lchmod, y as glob, z as cp, A as copyFile, B as chown, C as chmod, D as appendFile, E as access } from "./os_DXFRywg5.mjs";
const UV_FS_SYMLINK_DIR = 1;
const UV_FS_SYMLINK_JUNCTION = 2;
const O_RDONLY = 0;
const O_WRONLY = 1;
const O_RDWR = 2;
const UV_DIRENT_UNKNOWN = 0;
const UV_DIRENT_FILE = 1;
const UV_DIRENT_DIR = 2;
const UV_DIRENT_LINK = 3;
const UV_DIRENT_FIFO = 4;
const UV_DIRENT_SOCKET = 5;
const UV_DIRENT_CHAR = 6;
const UV_DIRENT_BLOCK = 7;
const EXTENSIONLESS_FORMAT_JAVASCRIPT = 0;
const EXTENSIONLESS_FORMAT_WASM = 1;
const S_IFMT = 61440;
const S_IFREG = 32768;
const S_IFDIR = 16384;
const S_IFCHR = 8192;
const S_IFBLK = 24576;
const S_IFIFO = 4096;
const S_IFLNK = 40960;
const S_IFSOCK = 49152;
const O_CREAT = 64;
const O_EXCL = 128;
const UV_FS_O_FILEMAP = 0;
const O_NOCTTY = 256;
const O_TRUNC = 512;
const O_APPEND = 1024;
const O_DIRECTORY = 65536;
const O_NOATIME = 262144;
const O_NOFOLLOW = 131072;
const O_SYNC = 1052672;
const O_DSYNC = 4096;
const O_DIRECT = 16384;
const O_NONBLOCK = 2048;
const S_IRWXU = 448;
const S_IRUSR = 256;
const S_IWUSR = 128;
const S_IXUSR = 64;
const S_IRWXG = 56;
const S_IRGRP = 32;
const S_IWGRP = 16;
const S_IXGRP = 8;
const S_IRWXO = 7;
const S_IROTH = 4;
const S_IWOTH = 2;
const S_IXOTH = 1;
const F_OK = 0;
const R_OK = 4;
const W_OK = 2;
const X_OK = 1;
const UV_FS_COPYFILE_EXCL = 1;
const COPYFILE_EXCL = 1;
const UV_FS_COPYFILE_FICLONE = 2;
const COPYFILE_FICLONE = 2;
const UV_FS_COPYFILE_FICLONE_FORCE = 4;
const COPYFILE_FICLONE_FORCE = 4;
const constants = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  COPYFILE_EXCL,
  COPYFILE_FICLONE,
  COPYFILE_FICLONE_FORCE,
  EXTENSIONLESS_FORMAT_JAVASCRIPT,
  EXTENSIONLESS_FORMAT_WASM,
  F_OK,
  O_APPEND,
  O_CREAT,
  O_DIRECT,
  O_DIRECTORY,
  O_DSYNC,
  O_EXCL,
  O_NOATIME,
  O_NOCTTY,
  O_NOFOLLOW,
  O_NONBLOCK,
  O_RDONLY,
  O_RDWR,
  O_SYNC,
  O_TRUNC,
  O_WRONLY,
  R_OK,
  S_IFBLK,
  S_IFCHR,
  S_IFDIR,
  S_IFIFO,
  S_IFLNK,
  S_IFMT,
  S_IFREG,
  S_IFSOCK,
  S_IRGRP,
  S_IROTH,
  S_IRUSR,
  S_IRWXG,
  S_IRWXO,
  S_IRWXU,
  S_IWGRP,
  S_IWOTH,
  S_IWUSR,
  S_IXGRP,
  S_IXOTH,
  S_IXUSR,
  UV_DIRENT_BLOCK,
  UV_DIRENT_CHAR,
  UV_DIRENT_DIR,
  UV_DIRENT_FIFO,
  UV_DIRENT_FILE,
  UV_DIRENT_LINK,
  UV_DIRENT_SOCKET,
  UV_DIRENT_UNKNOWN,
  UV_FS_COPYFILE_EXCL,
  UV_FS_COPYFILE_FICLONE,
  UV_FS_COPYFILE_FICLONE_FORCE,
  UV_FS_O_FILEMAP,
  UV_FS_SYMLINK_DIR,
  UV_FS_SYMLINK_JUNCTION,
  W_OK,
  X_OK
}, Symbol.toStringTag, { value: "Module" }));
const fs = {
  constants,
  access,
  appendFile,
  chmod,
  chown,
  copyFile,
  cp,
  glob,
  lchmod,
  lchown,
  link,
  lstat,
  lutimes,
  mkdir,
  mkdtemp,
  open,
  opendir,
  readFile,
  readdir,
  readlink,
  realpath,
  rename,
  rm,
  rmdir,
  stat,
  statfs,
  symlink,
  truncate,
  unlink,
  utimes,
  watch,
  writeFile
};
export {
  F_OK as F,
  R_OK as R,
  W_OK as W,
  X_OK as X,
  constants as c,
  fs as f
};
