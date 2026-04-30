globalThis.process ??= {};
globalThis.process.env ??= {};
import { t as tokenIntercept } from "./getSSOTokenFromFile_5mw9Djnx.mjs";
import { g as fileIntercept } from "./media_rgSTBrWs.mjs";
const externalDataInterceptor = {
  getFileRecord() {
    return fileIntercept;
  },
  interceptFile(path, contents) {
    fileIntercept[path] = Promise.resolve(contents);
  },
  getTokenRecord() {
    return tokenIntercept;
  },
  interceptToken(id, contents) {
    tokenIntercept[id] = contents;
  }
};
export {
  externalDataInterceptor as e
};
