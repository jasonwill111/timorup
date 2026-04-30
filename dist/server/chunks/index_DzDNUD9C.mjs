globalThis.process ??= {};
globalThis.process.env ??= {};
import { K as resolveAwsSdkSigV4Config, M as normalizeProvider, O as getSmithyContext, Q as BinaryDecisionDiagram, R as EndpointCache, T as decideEndpoint, V as awsEndpointFunctions, W as customEndpointFunctions, X as ServiceException, Y as TypeRegistry, t as toUtf8, h as fromUtf8, Z as parseUrl, _ as NoOpLogger, $ as AwsSdkSigV4Signer, x as toBase64, q as fromBase64, a0 as emitWarningIfUnsupportedVersion, a1 as resolveDefaultsModeConfig, a2 as emitWarningIfUnsupportedVersion$1, a3 as streamCollector, a4 as calculateBodyLength, a5 as loadConfig, a6 as NODE_APP_ID_CONFIG_OPTIONS, a7 as NODE_USE_FIPS_ENDPOINT_CONFIG_OPTIONS, a8 as NODE_USE_DUALSTACK_ENDPOINT_CONFIG_OPTIONS, a9 as Hash, aa as NODE_RETRY_MODE_CONFIG_OPTIONS, ab as DEFAULT_RETRY_MODE, N as NodeHttpHandler, ac as NODE_REGION_CONFIG_FILE_OPTIONS, ad as NODE_REGION_CONFIG_OPTIONS, ae as NODE_MAX_ATTEMPT_CONFIG_OPTIONS, af as createDefaultUserAgentProvider, ag as NODE_AUTH_SCHEME_PREFERENCE_OPTIONS, ah as loadConfigsForDefaultMode, ai as getAwsRegionExtensionConfiguration, aj as getDefaultExtensionConfiguration, ak as getHttpHandlerExtensionConfiguration, al as resolveAwsRegionExtensionConfiguration, am as resolveDefaultRuntimeConfig, an as resolveHttpHandlerRuntimeConfig, ao as Client, ap as resolveUserAgentConfig, aq as resolveRetryConfig, ar as resolveRegionConfig, as as resolveEndpointConfig, at as getSchemaSerdePlugin, au as getUserAgentPlugin, av as getRetryPlugin, aw as getContentLengthPlugin, ax as getHostHeaderPlugin, ay as getLoggerPlugin, az as getRecursionDetectionPlugin, aA as getHttpAuthSchemeEndpointRuleSetPlugin, aB as DefaultIdentityProviderConfig, aC as getHttpSigningPlugin, aD as resolveHostHeaderConfig, aE as Command, aF as getEndpointPlugin } from "./media_rgSTBrWs.mjs";
import { N as NoAuthSigner, p as packageInfo } from "./package_CoGDiR7L.mjs";
import { A as AwsRestJsonProtocol } from "./AwsRestJsonProtocol_DW-Eq1Cr.mjs";
const defaultSigninHttpAuthSchemeParametersProvider = async (config, context, input) => {
  return {
    operation: getSmithyContext(context).operation,
    region: await normalizeProvider(config.region)() || (() => {
      throw new Error("expected `region` to be configured for `aws.auth#sigv4`");
    })()
  };
};
function createAwsAuthSigv4HttpAuthOption(authParameters) {
  return {
    schemeId: "aws.auth#sigv4",
    signingProperties: {
      name: "signin",
      region: authParameters.region
    },
    propertiesExtractor: (config, context) => ({
      signingProperties: {
        config,
        context
      }
    })
  };
}
function createSmithyApiNoAuthHttpAuthOption(authParameters) {
  return {
    schemeId: "smithy.api#noAuth"
  };
}
const defaultSigninHttpAuthSchemeProvider = (authParameters) => {
  const options = [];
  switch (authParameters.operation) {
    case "CreateOAuth2Token": {
      options.push(createSmithyApiNoAuthHttpAuthOption());
      break;
    }
    default: {
      options.push(createAwsAuthSigv4HttpAuthOption(authParameters));
    }
  }
  return options;
};
const resolveHttpAuthSchemeConfig = (config) => {
  const config_0 = resolveAwsSdkSigV4Config(config);
  return Object.assign(config_0, {
    authSchemePreference: normalizeProvider(config.authSchemePreference ?? [])
  });
};
const resolveClientEndpointParameters = (options) => {
  return Object.assign(options, {
    useDualstackEndpoint: options.useDualstackEndpoint ?? false,
    useFipsEndpoint: options.useFipsEndpoint ?? false,
    defaultSigningName: "signin"
  });
};
const commonParams = {
  UseFIPS: { type: "builtInParams", name: "useFipsEndpoint" },
  Endpoint: { type: "builtInParams", name: "endpoint" },
  Region: { type: "builtInParams", name: "region" },
  UseDualStack: { type: "builtInParams", name: "useDualstackEndpoint" }
};
const m = "ref";
const a = -1, b = true, c = "isSet", d = "PartitionResult", e = "booleanEquals", f = "getAttr", g = "stringEquals", h = { [m]: "Endpoint" }, i = { [m]: d }, j = { fn: f, argv: [i, "name"] }, k = {}, l = [{ [m]: "Region" }];
const _data = {
  conditions: [
    [c, [h]],
    [c, l],
    ["aws.partition", l, d],
    [e, [{ [m]: "UseFIPS" }, b]],
    [e, [{ [m]: "UseDualStack" }, b]],
    [e, [{ fn: f, argv: [i, "supportsDualStack"] }, b]],
    [e, [{ fn: f, argv: [i, "supportsFIPS"] }, b]],
    [g, [j, "aws"]],
    [g, [j, "aws-cn"]],
    [g, [j, "aws-us-gov"]]
  ],
  results: [
    [a],
    [a, "Invalid Configuration: FIPS and custom endpoint are not supported"],
    [a, "Invalid Configuration: Dualstack and custom endpoint are not supported"],
    [h, k],
    ["https://{Region}.signin.aws.amazon.com", k],
    ["https://{Region}.signin.amazonaws.cn", k],
    ["https://{Region}.signin.amazonaws-us-gov.com", k],
    ["https://signin-fips.{Region}.{PartitionResult#dualStackDnsSuffix}", k],
    [a, "FIPS and DualStack are enabled, but this partition does not support one or both"],
    ["https://signin-fips.{Region}.{PartitionResult#dnsSuffix}", k],
    [a, "FIPS is enabled but this partition does not support FIPS"],
    ["https://signin.{Region}.{PartitionResult#dualStackDnsSuffix}", k],
    [a, "DualStack is enabled but this partition does not support DualStack"],
    ["https://signin.{Region}.{PartitionResult#dnsSuffix}", k],
    [a, "Invalid Configuration: Missing Region"]
  ]
};
const root = 2;
const r = 1e8;
const nodes = new Int32Array([
  -1,
  1,
  -1,
  0,
  15,
  3,
  1,
  4,
  r + 14,
  2,
  5,
  r + 14,
  3,
  11,
  6,
  4,
  10,
  7,
  7,
  r + 4,
  8,
  8,
  r + 5,
  9,
  9,
  r + 6,
  r + 13,
  5,
  r + 11,
  r + 12,
  4,
  13,
  12,
  6,
  r + 9,
  r + 10,
  5,
  14,
  r + 8,
  6,
  r + 7,
  r + 8,
  3,
  r + 1,
  16,
  4,
  r + 2,
  r + 3
]);
const bdd = BinaryDecisionDiagram.from(nodes, root, _data.conditions, _data.results);
const cache = new EndpointCache({
  size: 50,
  params: ["Endpoint", "Region", "UseDualStack", "UseFIPS"]
});
const defaultEndpointResolver = (endpointParams, context = {}) => {
  return cache.get(endpointParams, () => decideEndpoint(bdd, {
    endpointParams,
    logger: context.logger
  }));
};
customEndpointFunctions.aws = awsEndpointFunctions;
class SigninServiceException extends ServiceException {
  constructor(options) {
    super(options);
    Object.setPrototypeOf(this, SigninServiceException.prototype);
  }
}
class AccessDeniedException extends SigninServiceException {
  name = "AccessDeniedException";
  $fault = "client";
  error;
  constructor(opts) {
    super({
      name: "AccessDeniedException",
      $fault: "client",
      ...opts
    });
    Object.setPrototypeOf(this, AccessDeniedException.prototype);
    this.error = opts.error;
  }
}
class InternalServerException extends SigninServiceException {
  name = "InternalServerException";
  $fault = "server";
  error;
  constructor(opts) {
    super({
      name: "InternalServerException",
      $fault: "server",
      ...opts
    });
    Object.setPrototypeOf(this, InternalServerException.prototype);
    this.error = opts.error;
  }
}
class TooManyRequestsError extends SigninServiceException {
  name = "TooManyRequestsError";
  $fault = "client";
  error;
  constructor(opts) {
    super({
      name: "TooManyRequestsError",
      $fault: "client",
      ...opts
    });
    Object.setPrototypeOf(this, TooManyRequestsError.prototype);
    this.error = opts.error;
  }
}
class ValidationException extends SigninServiceException {
  name = "ValidationException";
  $fault = "client";
  error;
  constructor(opts) {
    super({
      name: "ValidationException",
      $fault: "client",
      ...opts
    });
    Object.setPrototypeOf(this, ValidationException.prototype);
    this.error = opts.error;
  }
}
const _ADE = "AccessDeniedException";
const _AT = "AccessToken";
const _COAT = "CreateOAuth2Token";
const _COATR = "CreateOAuth2TokenRequest";
const _COATRB = "CreateOAuth2TokenRequestBody";
const _COATRBr = "CreateOAuth2TokenResponseBody";
const _COATRr = "CreateOAuth2TokenResponse";
const _ISE = "InternalServerException";
const _RT = "RefreshToken";
const _TMRE = "TooManyRequestsError";
const _VE = "ValidationException";
const _aKI = "accessKeyId";
const _aT = "accessToken";
const _c = "client";
const _cI = "clientId";
const _cV = "codeVerifier";
const _co = "code";
const _e = "error";
const _eI = "expiresIn";
const _gT = "grantType";
const _h = "http";
const _hE = "httpError";
const _iT = "idToken";
const _jN = "jsonName";
const _m = "message";
const _rT = "refreshToken";
const _rU = "redirectUri";
const _s = "smithy.ts.sdk.synthetic.com.amazonaws.signin";
const _sAK = "secretAccessKey";
const _sT = "sessionToken";
const _se = "server";
const _tI = "tokenInput";
const _tO = "tokenOutput";
const _tT = "tokenType";
const n0 = "com.amazonaws.signin";
const _s_registry = TypeRegistry.for(_s);
var SigninServiceException$ = [-3, _s, "SigninServiceException", 0, [], []];
_s_registry.registerError(SigninServiceException$, SigninServiceException);
const n0_registry = TypeRegistry.for(n0);
var AccessDeniedException$ = [-3, n0, _ADE, { [_e]: _c }, [_e, _m], [0, 0], 2];
n0_registry.registerError(AccessDeniedException$, AccessDeniedException);
var InternalServerException$ = [-3, n0, _ISE, { [_e]: _se, [_hE]: 500 }, [_e, _m], [0, 0], 2];
n0_registry.registerError(InternalServerException$, InternalServerException);
var TooManyRequestsError$ = [-3, n0, _TMRE, { [_e]: _c, [_hE]: 429 }, [_e, _m], [0, 0], 2];
n0_registry.registerError(TooManyRequestsError$, TooManyRequestsError);
var ValidationException$ = [-3, n0, _VE, { [_e]: _c, [_hE]: 400 }, [_e, _m], [0, 0], 2];
n0_registry.registerError(ValidationException$, ValidationException);
const errorTypeRegistries = [_s_registry, n0_registry];
var RefreshToken = [0, n0, _RT, 8, 0];
var AccessToken$ = [
  3,
  n0,
  _AT,
  8,
  [_aKI, _sAK, _sT],
  [
    [0, { [_jN]: _aKI }],
    [0, { [_jN]: _sAK }],
    [0, { [_jN]: _sT }]
  ],
  3
];
var CreateOAuth2TokenRequest$ = [
  3,
  n0,
  _COATR,
  0,
  [_tI],
  [[() => CreateOAuth2TokenRequestBody$, 16]],
  1
];
var CreateOAuth2TokenRequestBody$ = [
  3,
  n0,
  _COATRB,
  0,
  [_cI, _gT, _co, _rU, _cV, _rT],
  [
    [0, { [_jN]: _cI }],
    [0, { [_jN]: _gT }],
    0,
    [0, { [_jN]: _rU }],
    [0, { [_jN]: _cV }],
    [() => RefreshToken, { [_jN]: _rT }]
  ],
  2
];
var CreateOAuth2TokenResponse$ = [
  3,
  n0,
  _COATRr,
  0,
  [_tO],
  [[() => CreateOAuth2TokenResponseBody$, 16]],
  1
];
var CreateOAuth2TokenResponseBody$ = [
  3,
  n0,
  _COATRBr,
  0,
  [_aT, _tT, _eI, _rT, _iT],
  [
    [() => AccessToken$, { [_jN]: _aT }],
    [0, { [_jN]: _tT }],
    [1, { [_jN]: _eI }],
    [() => RefreshToken, { [_jN]: _rT }],
    [0, { [_jN]: _iT }]
  ],
  4
];
var CreateOAuth2Token$ = [
  9,
  n0,
  _COAT,
  { [_h]: ["POST", "/v1/token", 200] },
  () => CreateOAuth2TokenRequest$,
  () => CreateOAuth2TokenResponse$
];
const getRuntimeConfig$1 = (config) => {
  return {
    apiVersion: "2023-01-01",
    base64Decoder: config?.base64Decoder ?? fromBase64,
    base64Encoder: config?.base64Encoder ?? toBase64,
    disableHostPrefix: config?.disableHostPrefix ?? false,
    endpointProvider: config?.endpointProvider ?? defaultEndpointResolver,
    extensions: config?.extensions ?? [],
    httpAuthSchemeProvider: config?.httpAuthSchemeProvider ?? defaultSigninHttpAuthSchemeProvider,
    httpAuthSchemes: config?.httpAuthSchemes ?? [
      {
        schemeId: "aws.auth#sigv4",
        identityProvider: (ipc) => ipc.getIdentityProvider("aws.auth#sigv4"),
        signer: new AwsSdkSigV4Signer()
      },
      {
        schemeId: "smithy.api#noAuth",
        identityProvider: (ipc) => ipc.getIdentityProvider("smithy.api#noAuth") || (async () => ({})),
        signer: new NoAuthSigner()
      }
    ],
    logger: config?.logger ?? new NoOpLogger(),
    protocol: config?.protocol ?? AwsRestJsonProtocol,
    protocolSettings: config?.protocolSettings ?? {
      defaultNamespace: "com.amazonaws.signin",
      errorTypeRegistries,
      version: "2023-01-01",
      serviceTarget: "Signin"
    },
    serviceId: config?.serviceId ?? "Signin",
    urlParser: config?.urlParser ?? parseUrl,
    utf8Decoder: config?.utf8Decoder ?? fromUtf8,
    utf8Encoder: config?.utf8Encoder ?? toUtf8
  };
};
const getRuntimeConfig = (config) => {
  emitWarningIfUnsupportedVersion(process.version);
  const defaultsMode = resolveDefaultsModeConfig(config);
  const defaultConfigProvider = () => defaultsMode().then(loadConfigsForDefaultMode);
  const clientSharedValues = getRuntimeConfig$1(config);
  emitWarningIfUnsupportedVersion$1(process.version);
  const loaderConfig = {
    profile: config?.profile,
    logger: clientSharedValues.logger
  };
  return {
    ...clientSharedValues,
    ...config,
    runtime: "node",
    defaultsMode,
    authSchemePreference: config?.authSchemePreference ?? loadConfig(NODE_AUTH_SCHEME_PREFERENCE_OPTIONS, loaderConfig),
    bodyLengthChecker: config?.bodyLengthChecker ?? calculateBodyLength,
    defaultUserAgentProvider: config?.defaultUserAgentProvider ?? createDefaultUserAgentProvider({ serviceId: clientSharedValues.serviceId, clientVersion: packageInfo.version }),
    maxAttempts: config?.maxAttempts ?? loadConfig(NODE_MAX_ATTEMPT_CONFIG_OPTIONS, config),
    region: config?.region ?? loadConfig(NODE_REGION_CONFIG_OPTIONS, { ...NODE_REGION_CONFIG_FILE_OPTIONS, ...loaderConfig }),
    requestHandler: NodeHttpHandler.create(config?.requestHandler ?? defaultConfigProvider),
    retryMode: config?.retryMode ?? loadConfig({
      ...NODE_RETRY_MODE_CONFIG_OPTIONS,
      default: async () => (await defaultConfigProvider()).retryMode || DEFAULT_RETRY_MODE
    }, config),
    sha256: config?.sha256 ?? Hash.bind(null, "sha256"),
    streamCollector: config?.streamCollector ?? streamCollector,
    useDualstackEndpoint: config?.useDualstackEndpoint ?? loadConfig(NODE_USE_DUALSTACK_ENDPOINT_CONFIG_OPTIONS, loaderConfig),
    useFipsEndpoint: config?.useFipsEndpoint ?? loadConfig(NODE_USE_FIPS_ENDPOINT_CONFIG_OPTIONS, loaderConfig),
    userAgentAppId: config?.userAgentAppId ?? loadConfig(NODE_APP_ID_CONFIG_OPTIONS, loaderConfig)
  };
};
const getHttpAuthExtensionConfiguration = (runtimeConfig) => {
  const _httpAuthSchemes = runtimeConfig.httpAuthSchemes;
  let _httpAuthSchemeProvider = runtimeConfig.httpAuthSchemeProvider;
  let _credentials = runtimeConfig.credentials;
  return {
    setHttpAuthScheme(httpAuthScheme) {
      const index = _httpAuthSchemes.findIndex((scheme) => scheme.schemeId === httpAuthScheme.schemeId);
      if (index === -1) {
        _httpAuthSchemes.push(httpAuthScheme);
      } else {
        _httpAuthSchemes.splice(index, 1, httpAuthScheme);
      }
    },
    httpAuthSchemes() {
      return _httpAuthSchemes;
    },
    setHttpAuthSchemeProvider(httpAuthSchemeProvider) {
      _httpAuthSchemeProvider = httpAuthSchemeProvider;
    },
    httpAuthSchemeProvider() {
      return _httpAuthSchemeProvider;
    },
    setCredentials(credentials) {
      _credentials = credentials;
    },
    credentials() {
      return _credentials;
    }
  };
};
const resolveHttpAuthRuntimeConfig = (config) => {
  return {
    httpAuthSchemes: config.httpAuthSchemes(),
    httpAuthSchemeProvider: config.httpAuthSchemeProvider(),
    credentials: config.credentials()
  };
};
const resolveRuntimeExtensions = (runtimeConfig, extensions) => {
  const extensionConfiguration = Object.assign(getAwsRegionExtensionConfiguration(runtimeConfig), getDefaultExtensionConfiguration(runtimeConfig), getHttpHandlerExtensionConfiguration(runtimeConfig), getHttpAuthExtensionConfiguration(runtimeConfig));
  extensions.forEach((extension) => extension.configure(extensionConfiguration));
  return Object.assign(runtimeConfig, resolveAwsRegionExtensionConfiguration(extensionConfiguration), resolveDefaultRuntimeConfig(extensionConfiguration), resolveHttpHandlerRuntimeConfig(extensionConfiguration), resolveHttpAuthRuntimeConfig(extensionConfiguration));
};
class SigninClient extends Client {
  config;
  constructor(...[configuration]) {
    const _config_0 = getRuntimeConfig(configuration || {});
    super(_config_0);
    this.initConfig = _config_0;
    const _config_1 = resolveClientEndpointParameters(_config_0);
    const _config_2 = resolveUserAgentConfig(_config_1);
    const _config_3 = resolveRetryConfig(_config_2);
    const _config_4 = resolveRegionConfig(_config_3);
    const _config_5 = resolveHostHeaderConfig(_config_4);
    const _config_6 = resolveEndpointConfig(_config_5);
    const _config_7 = resolveHttpAuthSchemeConfig(_config_6);
    const _config_8 = resolveRuntimeExtensions(_config_7, configuration?.extensions || []);
    this.config = _config_8;
    this.middlewareStack.use(getSchemaSerdePlugin(this.config));
    this.middlewareStack.use(getUserAgentPlugin(this.config));
    this.middlewareStack.use(getRetryPlugin(this.config));
    this.middlewareStack.use(getContentLengthPlugin(this.config));
    this.middlewareStack.use(getHostHeaderPlugin(this.config));
    this.middlewareStack.use(getLoggerPlugin(this.config));
    this.middlewareStack.use(getRecursionDetectionPlugin(this.config));
    this.middlewareStack.use(getHttpAuthSchemeEndpointRuleSetPlugin(this.config, {
      httpAuthSchemeParametersProvider: defaultSigninHttpAuthSchemeParametersProvider,
      identityProviderConfigProvider: async (config) => new DefaultIdentityProviderConfig({
        "aws.auth#sigv4": config.credentials
      })
    }));
    this.middlewareStack.use(getHttpSigningPlugin(this.config));
  }
  destroy() {
    super.destroy();
  }
}
class CreateOAuth2TokenCommand extends Command.classBuilder().ep(commonParams).m(function(Command2, cs, config, o) {
  return [getEndpointPlugin(config, Command2.getEndpointParameterInstructions())];
}).s("Signin", "CreateOAuth2Token", {}).n("SigninClient", "CreateOAuth2TokenCommand").sc(CreateOAuth2Token$).build() {
}
export {
  Command as $Command,
  AccessDeniedException,
  AccessDeniedException$,
  AccessToken$,
  CreateOAuth2Token$,
  CreateOAuth2TokenCommand,
  CreateOAuth2TokenRequest$,
  CreateOAuth2TokenRequestBody$,
  CreateOAuth2TokenResponse$,
  CreateOAuth2TokenResponseBody$,
  InternalServerException,
  InternalServerException$,
  SigninClient,
  SigninServiceException,
  SigninServiceException$,
  TooManyRequestsError,
  TooManyRequestsError$,
  ValidationException,
  ValidationException$,
  Client as __Client,
  errorTypeRegistries
};
