var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __esm = (fn2, res) => function __init() {
  return fn2 && (res = (0, fn2[__getOwnPropNames(fn2)[0]])(fn2 = 0)), res;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to2, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to2, key) && key !== except)
        __defProp(to2, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to2;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// ../.wrangler/tmp/bundle-80xBYF/checked-fetch.js
function checkURL(request, init2) {
  const url = request instanceof URL ? request : new URL(
    (typeof request === "string" ? new Request(request, init2) : request).url
  );
  if (url.port && url.port !== "443" && url.protocol === "https:") {
    if (!urls.has(url.toString())) {
      urls.add(url.toString());
      console.warn(
        `WARNING: known issue with \`fetch()\` requests to custom HTTPS ports in published Workers:
 - ${url.toString()} - the custom port will be ignored when the Worker is published using the \`wrangler deploy\` command.
`
      );
    }
  }
}
var urls;
var init_checked_fetch = __esm({
  "../.wrangler/tmp/bundle-80xBYF/checked-fetch.js"() {
    urls = /* @__PURE__ */ new Set();
    __name(checkURL, "checkURL");
    globalThis.fetch = new Proxy(globalThis.fetch, {
      apply(target, thisArg, argArray) {
        const [request, init2] = argArray;
        checkURL(request, init2);
        return Reflect.apply(target, thisArg, argArray);
      }
    });
  }
});

// ../node_modules/react/cjs/react.development.js
var require_react_development = __commonJS({
  "../node_modules/react/cjs/react.development.js"(exports2, module) {
    "use strict";
    init_functionsRoutes_0_7918156147864959();
    init_checked_fetch();
    if (true) {
      (function() {
        "use strict";
        if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ !== "undefined" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart === "function") {
          __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(new Error());
        }
        var ReactVersion = "18.3.1";
        var REACT_ELEMENT_TYPE = Symbol.for("react.element");
        var REACT_PORTAL_TYPE = Symbol.for("react.portal");
        var REACT_FRAGMENT_TYPE = Symbol.for("react.fragment");
        var REACT_STRICT_MODE_TYPE = Symbol.for("react.strict_mode");
        var REACT_PROFILER_TYPE = Symbol.for("react.profiler");
        var REACT_PROVIDER_TYPE = Symbol.for("react.provider");
        var REACT_CONTEXT_TYPE = Symbol.for("react.context");
        var REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref");
        var REACT_SUSPENSE_TYPE = Symbol.for("react.suspense");
        var REACT_SUSPENSE_LIST_TYPE = Symbol.for("react.suspense_list");
        var REACT_MEMO_TYPE = Symbol.for("react.memo");
        var REACT_LAZY_TYPE = Symbol.for("react.lazy");
        var REACT_OFFSCREEN_TYPE = Symbol.for("react.offscreen");
        var MAYBE_ITERATOR_SYMBOL = Symbol.iterator;
        var FAUX_ITERATOR_SYMBOL = "@@iterator";
        function getIteratorFn(maybeIterable) {
          if (maybeIterable === null || typeof maybeIterable !== "object") {
            return null;
          }
          var maybeIterator = MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL];
          if (typeof maybeIterator === "function") {
            return maybeIterator;
          }
          return null;
        }
        __name(getIteratorFn, "getIteratorFn");
        var ReactCurrentDispatcher = {
          /**
           * @internal
           * @type {ReactComponent}
           */
          current: null
        };
        var ReactCurrentBatchConfig = {
          transition: null
        };
        var ReactCurrentActQueue = {
          current: null,
          // Used to reproduce behavior of `batchedUpdates` in legacy mode.
          isBatchingLegacy: false,
          didScheduleLegacyUpdate: false
        };
        var ReactCurrentOwner = {
          /**
           * @internal
           * @type {ReactComponent}
           */
          current: null
        };
        var ReactDebugCurrentFrame = {};
        var currentExtraStackFrame = null;
        function setExtraStackFrame(stack) {
          {
            currentExtraStackFrame = stack;
          }
        }
        __name(setExtraStackFrame, "setExtraStackFrame");
        {
          ReactDebugCurrentFrame.setExtraStackFrame = function(stack) {
            {
              currentExtraStackFrame = stack;
            }
          };
          ReactDebugCurrentFrame.getCurrentStack = null;
          ReactDebugCurrentFrame.getStackAddendum = function() {
            var stack = "";
            if (currentExtraStackFrame) {
              stack += currentExtraStackFrame;
            }
            var impl = ReactDebugCurrentFrame.getCurrentStack;
            if (impl) {
              stack += impl() || "";
            }
            return stack;
          };
        }
        var enableScopeAPI = false;
        var enableCacheElement = false;
        var enableTransitionTracing = false;
        var enableLegacyHidden = false;
        var enableDebugTracing = false;
        var ReactSharedInternals = {
          ReactCurrentDispatcher,
          ReactCurrentBatchConfig,
          ReactCurrentOwner
        };
        {
          ReactSharedInternals.ReactDebugCurrentFrame = ReactDebugCurrentFrame;
          ReactSharedInternals.ReactCurrentActQueue = ReactCurrentActQueue;
        }
        function warn(format) {
          {
            {
              for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                args[_key - 1] = arguments[_key];
              }
              printWarning("warn", format, args);
            }
          }
        }
        __name(warn, "warn");
        function error(format) {
          {
            {
              for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
                args[_key2 - 1] = arguments[_key2];
              }
              printWarning("error", format, args);
            }
          }
        }
        __name(error, "error");
        function printWarning(level, format, args) {
          {
            var ReactDebugCurrentFrame2 = ReactSharedInternals.ReactDebugCurrentFrame;
            var stack = ReactDebugCurrentFrame2.getStackAddendum();
            if (stack !== "") {
              format += "%s";
              args = args.concat([stack]);
            }
            var argsWithFormat = args.map(function(item) {
              return String(item);
            });
            argsWithFormat.unshift("Warning: " + format);
            Function.prototype.apply.call(console[level], console, argsWithFormat);
          }
        }
        __name(printWarning, "printWarning");
        var didWarnStateUpdateForUnmountedComponent = {};
        function warnNoop(publicInstance, callerName) {
          {
            var _constructor = publicInstance.constructor;
            var componentName = _constructor && (_constructor.displayName || _constructor.name) || "ReactClass";
            var warningKey = componentName + "." + callerName;
            if (didWarnStateUpdateForUnmountedComponent[warningKey]) {
              return;
            }
            error("Can't call %s on a component that is not yet mounted. This is a no-op, but it might indicate a bug in your application. Instead, assign to `this.state` directly or define a `state = {};` class property with the desired state in the %s component.", callerName, componentName);
            didWarnStateUpdateForUnmountedComponent[warningKey] = true;
          }
        }
        __name(warnNoop, "warnNoop");
        var ReactNoopUpdateQueue = {
          /**
           * Checks whether or not this composite component is mounted.
           * @param {ReactClass} publicInstance The instance we want to test.
           * @return {boolean} True if mounted, false otherwise.
           * @protected
           * @final
           */
          isMounted: /* @__PURE__ */ __name(function(publicInstance) {
            return false;
          }, "isMounted"),
          /**
           * Forces an update. This should only be invoked when it is known with
           * certainty that we are **not** in a DOM transaction.
           *
           * You may want to call this when you know that some deeper aspect of the
           * component's state has changed but `setState` was not called.
           *
           * This will not invoke `shouldComponentUpdate`, but it will invoke
           * `componentWillUpdate` and `componentDidUpdate`.
           *
           * @param {ReactClass} publicInstance The instance that should rerender.
           * @param {?function} callback Called after component is updated.
           * @param {?string} callerName name of the calling function in the public API.
           * @internal
           */
          enqueueForceUpdate: /* @__PURE__ */ __name(function(publicInstance, callback, callerName) {
            warnNoop(publicInstance, "forceUpdate");
          }, "enqueueForceUpdate"),
          /**
           * Replaces all of the state. Always use this or `setState` to mutate state.
           * You should treat `this.state` as immutable.
           *
           * There is no guarantee that `this.state` will be immediately updated, so
           * accessing `this.state` after calling this method may return the old value.
           *
           * @param {ReactClass} publicInstance The instance that should rerender.
           * @param {object} completeState Next state.
           * @param {?function} callback Called after component is updated.
           * @param {?string} callerName name of the calling function in the public API.
           * @internal
           */
          enqueueReplaceState: /* @__PURE__ */ __name(function(publicInstance, completeState, callback, callerName) {
            warnNoop(publicInstance, "replaceState");
          }, "enqueueReplaceState"),
          /**
           * Sets a subset of the state. This only exists because _pendingState is
           * internal. This provides a merging strategy that is not available to deep
           * properties which is confusing. TODO: Expose pendingState or don't use it
           * during the merge.
           *
           * @param {ReactClass} publicInstance The instance that should rerender.
           * @param {object} partialState Next partial state to be merged with state.
           * @param {?function} callback Called after component is updated.
           * @param {?string} Name of the calling function in the public API.
           * @internal
           */
          enqueueSetState: /* @__PURE__ */ __name(function(publicInstance, partialState, callback, callerName) {
            warnNoop(publicInstance, "setState");
          }, "enqueueSetState")
        };
        var assign = Object.assign;
        var emptyObject = {};
        {
          Object.freeze(emptyObject);
        }
        function Component(props, context, updater) {
          this.props = props;
          this.context = context;
          this.refs = emptyObject;
          this.updater = updater || ReactNoopUpdateQueue;
        }
        __name(Component, "Component");
        Component.prototype.isReactComponent = {};
        Component.prototype.setState = function(partialState, callback) {
          if (typeof partialState !== "object" && typeof partialState !== "function" && partialState != null) {
            throw new Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
          }
          this.updater.enqueueSetState(this, partialState, callback, "setState");
        };
        Component.prototype.forceUpdate = function(callback) {
          this.updater.enqueueForceUpdate(this, callback, "forceUpdate");
        };
        {
          var deprecatedAPIs = {
            isMounted: ["isMounted", "Instead, make sure to clean up subscriptions and pending requests in componentWillUnmount to prevent memory leaks."],
            replaceState: ["replaceState", "Refactor your code to use setState instead (see https://github.com/facebook/react/issues/3236)."]
          };
          var defineDeprecationWarning = /* @__PURE__ */ __name(function(methodName, info) {
            Object.defineProperty(Component.prototype, methodName, {
              get: /* @__PURE__ */ __name(function() {
                warn("%s(...) is deprecated in plain JavaScript React classes. %s", info[0], info[1]);
                return void 0;
              }, "get")
            });
          }, "defineDeprecationWarning");
          for (var fnName in deprecatedAPIs) {
            if (deprecatedAPIs.hasOwnProperty(fnName)) {
              defineDeprecationWarning(fnName, deprecatedAPIs[fnName]);
            }
          }
        }
        function ComponentDummy() {
        }
        __name(ComponentDummy, "ComponentDummy");
        ComponentDummy.prototype = Component.prototype;
        function PureComponent(props, context, updater) {
          this.props = props;
          this.context = context;
          this.refs = emptyObject;
          this.updater = updater || ReactNoopUpdateQueue;
        }
        __name(PureComponent, "PureComponent");
        var pureComponentPrototype = PureComponent.prototype = new ComponentDummy();
        pureComponentPrototype.constructor = PureComponent;
        assign(pureComponentPrototype, Component.prototype);
        pureComponentPrototype.isPureReactComponent = true;
        function createRef() {
          var refObject = {
            current: null
          };
          {
            Object.seal(refObject);
          }
          return refObject;
        }
        __name(createRef, "createRef");
        var isArrayImpl = Array.isArray;
        function isArray(a) {
          return isArrayImpl(a);
        }
        __name(isArray, "isArray");
        function typeName(value) {
          {
            var hasToStringTag = typeof Symbol === "function" && Symbol.toStringTag;
            var type = hasToStringTag && value[Symbol.toStringTag] || value.constructor.name || "Object";
            return type;
          }
        }
        __name(typeName, "typeName");
        function willCoercionThrow(value) {
          {
            try {
              testStringCoercion(value);
              return false;
            } catch (e) {
              return true;
            }
          }
        }
        __name(willCoercionThrow, "willCoercionThrow");
        function testStringCoercion(value) {
          return "" + value;
        }
        __name(testStringCoercion, "testStringCoercion");
        function checkKeyStringCoercion(value) {
          {
            if (willCoercionThrow(value)) {
              error("The provided key is an unsupported type %s. This value must be coerced to a string before before using it here.", typeName(value));
              return testStringCoercion(value);
            }
          }
        }
        __name(checkKeyStringCoercion, "checkKeyStringCoercion");
        function getWrappedName(outerType, innerType, wrapperName) {
          var displayName = outerType.displayName;
          if (displayName) {
            return displayName;
          }
          var functionName = innerType.displayName || innerType.name || "";
          return functionName !== "" ? wrapperName + "(" + functionName + ")" : wrapperName;
        }
        __name(getWrappedName, "getWrappedName");
        function getContextName(type) {
          return type.displayName || "Context";
        }
        __name(getContextName, "getContextName");
        function getComponentNameFromType(type) {
          if (type == null) {
            return null;
          }
          {
            if (typeof type.tag === "number") {
              error("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue.");
            }
          }
          if (typeof type === "function") {
            return type.displayName || type.name || null;
          }
          if (typeof type === "string") {
            return type;
          }
          switch (type) {
            case REACT_FRAGMENT_TYPE:
              return "Fragment";
            case REACT_PORTAL_TYPE:
              return "Portal";
            case REACT_PROFILER_TYPE:
              return "Profiler";
            case REACT_STRICT_MODE_TYPE:
              return "StrictMode";
            case REACT_SUSPENSE_TYPE:
              return "Suspense";
            case REACT_SUSPENSE_LIST_TYPE:
              return "SuspenseList";
          }
          if (typeof type === "object") {
            switch (type.$$typeof) {
              case REACT_CONTEXT_TYPE:
                var context = type;
                return getContextName(context) + ".Consumer";
              case REACT_PROVIDER_TYPE:
                var provider = type;
                return getContextName(provider._context) + ".Provider";
              case REACT_FORWARD_REF_TYPE:
                return getWrappedName(type, type.render, "ForwardRef");
              case REACT_MEMO_TYPE:
                var outerName = type.displayName || null;
                if (outerName !== null) {
                  return outerName;
                }
                return getComponentNameFromType(type.type) || "Memo";
              case REACT_LAZY_TYPE: {
                var lazyComponent = type;
                var payload = lazyComponent._payload;
                var init2 = lazyComponent._init;
                try {
                  return getComponentNameFromType(init2(payload));
                } catch (x2) {
                  return null;
                }
              }
            }
          }
          return null;
        }
        __name(getComponentNameFromType, "getComponentNameFromType");
        var hasOwnProperty = Object.prototype.hasOwnProperty;
        var RESERVED_PROPS = {
          key: true,
          ref: true,
          __self: true,
          __source: true
        };
        var specialPropKeyWarningShown, specialPropRefWarningShown, didWarnAboutStringRefs;
        {
          didWarnAboutStringRefs = {};
        }
        function hasValidRef(config) {
          {
            if (hasOwnProperty.call(config, "ref")) {
              var getter = Object.getOwnPropertyDescriptor(config, "ref").get;
              if (getter && getter.isReactWarning) {
                return false;
              }
            }
          }
          return config.ref !== void 0;
        }
        __name(hasValidRef, "hasValidRef");
        function hasValidKey(config) {
          {
            if (hasOwnProperty.call(config, "key")) {
              var getter = Object.getOwnPropertyDescriptor(config, "key").get;
              if (getter && getter.isReactWarning) {
                return false;
              }
            }
          }
          return config.key !== void 0;
        }
        __name(hasValidKey, "hasValidKey");
        function defineKeyPropWarningGetter(props, displayName) {
          var warnAboutAccessingKey = /* @__PURE__ */ __name(function() {
            {
              if (!specialPropKeyWarningShown) {
                specialPropKeyWarningShown = true;
                error("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", displayName);
              }
            }
          }, "warnAboutAccessingKey");
          warnAboutAccessingKey.isReactWarning = true;
          Object.defineProperty(props, "key", {
            get: warnAboutAccessingKey,
            configurable: true
          });
        }
        __name(defineKeyPropWarningGetter, "defineKeyPropWarningGetter");
        function defineRefPropWarningGetter(props, displayName) {
          var warnAboutAccessingRef = /* @__PURE__ */ __name(function() {
            {
              if (!specialPropRefWarningShown) {
                specialPropRefWarningShown = true;
                error("%s: `ref` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", displayName);
              }
            }
          }, "warnAboutAccessingRef");
          warnAboutAccessingRef.isReactWarning = true;
          Object.defineProperty(props, "ref", {
            get: warnAboutAccessingRef,
            configurable: true
          });
        }
        __name(defineRefPropWarningGetter, "defineRefPropWarningGetter");
        function warnIfStringRefCannotBeAutoConverted(config) {
          {
            if (typeof config.ref === "string" && ReactCurrentOwner.current && config.__self && ReactCurrentOwner.current.stateNode !== config.__self) {
              var componentName = getComponentNameFromType(ReactCurrentOwner.current.type);
              if (!didWarnAboutStringRefs[componentName]) {
                error('Component "%s" contains the string ref "%s". Support for string refs will be removed in a future major release. This case cannot be automatically converted to an arrow function. We ask you to manually fix this case by using useRef() or createRef() instead. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-string-ref', componentName, config.ref);
                didWarnAboutStringRefs[componentName] = true;
              }
            }
          }
        }
        __name(warnIfStringRefCannotBeAutoConverted, "warnIfStringRefCannotBeAutoConverted");
        var ReactElement = /* @__PURE__ */ __name(function(type, key, ref, self2, source, owner, props) {
          var element = {
            // This tag allows us to uniquely identify this as a React Element
            $$typeof: REACT_ELEMENT_TYPE,
            // Built-in properties that belong on the element
            type,
            key,
            ref,
            props,
            // Record the component responsible for creating this element.
            _owner: owner
          };
          {
            element._store = {};
            Object.defineProperty(element._store, "validated", {
              configurable: false,
              enumerable: false,
              writable: true,
              value: false
            });
            Object.defineProperty(element, "_self", {
              configurable: false,
              enumerable: false,
              writable: false,
              value: self2
            });
            Object.defineProperty(element, "_source", {
              configurable: false,
              enumerable: false,
              writable: false,
              value: source
            });
            if (Object.freeze) {
              Object.freeze(element.props);
              Object.freeze(element);
            }
          }
          return element;
        }, "ReactElement");
        function createElement2(type, config, children) {
          var propName;
          var props = {};
          var key = null;
          var ref = null;
          var self2 = null;
          var source = null;
          if (config != null) {
            if (hasValidRef(config)) {
              ref = config.ref;
              {
                warnIfStringRefCannotBeAutoConverted(config);
              }
            }
            if (hasValidKey(config)) {
              {
                checkKeyStringCoercion(config.key);
              }
              key = "" + config.key;
            }
            self2 = config.__self === void 0 ? null : config.__self;
            source = config.__source === void 0 ? null : config.__source;
            for (propName in config) {
              if (hasOwnProperty.call(config, propName) && !RESERVED_PROPS.hasOwnProperty(propName)) {
                props[propName] = config[propName];
              }
            }
          }
          var childrenLength = arguments.length - 2;
          if (childrenLength === 1) {
            props.children = children;
          } else if (childrenLength > 1) {
            var childArray = Array(childrenLength);
            for (var i2 = 0; i2 < childrenLength; i2++) {
              childArray[i2] = arguments[i2 + 2];
            }
            {
              if (Object.freeze) {
                Object.freeze(childArray);
              }
            }
            props.children = childArray;
          }
          if (type && type.defaultProps) {
            var defaultProps = type.defaultProps;
            for (propName in defaultProps) {
              if (props[propName] === void 0) {
                props[propName] = defaultProps[propName];
              }
            }
          }
          {
            if (key || ref) {
              var displayName = typeof type === "function" ? type.displayName || type.name || "Unknown" : type;
              if (key) {
                defineKeyPropWarningGetter(props, displayName);
              }
              if (ref) {
                defineRefPropWarningGetter(props, displayName);
              }
            }
          }
          return ReactElement(type, key, ref, self2, source, ReactCurrentOwner.current, props);
        }
        __name(createElement2, "createElement");
        function cloneAndReplaceKey(oldElement, newKey) {
          var newElement = ReactElement(oldElement.type, newKey, oldElement.ref, oldElement._self, oldElement._source, oldElement._owner, oldElement.props);
          return newElement;
        }
        __name(cloneAndReplaceKey, "cloneAndReplaceKey");
        function cloneElement(element, config, children) {
          if (element === null || element === void 0) {
            throw new Error("React.cloneElement(...): The argument must be a React element, but you passed " + element + ".");
          }
          var propName;
          var props = assign({}, element.props);
          var key = element.key;
          var ref = element.ref;
          var self2 = element._self;
          var source = element._source;
          var owner = element._owner;
          if (config != null) {
            if (hasValidRef(config)) {
              ref = config.ref;
              owner = ReactCurrentOwner.current;
            }
            if (hasValidKey(config)) {
              {
                checkKeyStringCoercion(config.key);
              }
              key = "" + config.key;
            }
            var defaultProps;
            if (element.type && element.type.defaultProps) {
              defaultProps = element.type.defaultProps;
            }
            for (propName in config) {
              if (hasOwnProperty.call(config, propName) && !RESERVED_PROPS.hasOwnProperty(propName)) {
                if (config[propName] === void 0 && defaultProps !== void 0) {
                  props[propName] = defaultProps[propName];
                } else {
                  props[propName] = config[propName];
                }
              }
            }
          }
          var childrenLength = arguments.length - 2;
          if (childrenLength === 1) {
            props.children = children;
          } else if (childrenLength > 1) {
            var childArray = Array(childrenLength);
            for (var i2 = 0; i2 < childrenLength; i2++) {
              childArray[i2] = arguments[i2 + 2];
            }
            props.children = childArray;
          }
          return ReactElement(element.type, key, ref, self2, source, owner, props);
        }
        __name(cloneElement, "cloneElement");
        function isValidElement(object) {
          return typeof object === "object" && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
        }
        __name(isValidElement, "isValidElement");
        var SEPARATOR = ".";
        var SUBSEPARATOR = ":";
        function escape(key) {
          var escapeRegex2 = /[=:]/g;
          var escaperLookup = {
            "=": "=0",
            ":": "=2"
          };
          var escapedString = key.replace(escapeRegex2, function(match2) {
            return escaperLookup[match2];
          });
          return "$" + escapedString;
        }
        __name(escape, "escape");
        var didWarnAboutMaps = false;
        var userProvidedKeyEscapeRegex = /\/+/g;
        function escapeUserProvidedKey(text) {
          return text.replace(userProvidedKeyEscapeRegex, "$&/");
        }
        __name(escapeUserProvidedKey, "escapeUserProvidedKey");
        function getElementKey(element, index) {
          if (typeof element === "object" && element !== null && element.key != null) {
            {
              checkKeyStringCoercion(element.key);
            }
            return escape("" + element.key);
          }
          return index.toString(36);
        }
        __name(getElementKey, "getElementKey");
        function mapIntoArray(children, array, escapedPrefix, nameSoFar, callback) {
          var type = typeof children;
          if (type === "undefined" || type === "boolean") {
            children = null;
          }
          var invokeCallback = false;
          if (children === null) {
            invokeCallback = true;
          } else {
            switch (type) {
              case "string":
              case "number":
                invokeCallback = true;
                break;
              case "object":
                switch (children.$$typeof) {
                  case REACT_ELEMENT_TYPE:
                  case REACT_PORTAL_TYPE:
                    invokeCallback = true;
                }
            }
          }
          if (invokeCallback) {
            var _child = children;
            var mappedChild = callback(_child);
            var childKey = nameSoFar === "" ? SEPARATOR + getElementKey(_child, 0) : nameSoFar;
            if (isArray(mappedChild)) {
              var escapedChildKey = "";
              if (childKey != null) {
                escapedChildKey = escapeUserProvidedKey(childKey) + "/";
              }
              mapIntoArray(mappedChild, array, escapedChildKey, "", function(c2) {
                return c2;
              });
            } else if (mappedChild != null) {
              if (isValidElement(mappedChild)) {
                {
                  if (mappedChild.key && (!_child || _child.key !== mappedChild.key)) {
                    checkKeyStringCoercion(mappedChild.key);
                  }
                }
                mappedChild = cloneAndReplaceKey(
                  mappedChild,
                  // Keep both the (mapped) and old keys if they differ, just as
                  // traverseAllChildren used to do for objects as children
                  escapedPrefix + // $FlowFixMe Flow incorrectly thinks React.Portal doesn't have a key
                  (mappedChild.key && (!_child || _child.key !== mappedChild.key) ? (
                    // $FlowFixMe Flow incorrectly thinks existing element's key can be a number
                    // eslint-disable-next-line react-internal/safe-string-coercion
                    escapeUserProvidedKey("" + mappedChild.key) + "/"
                  ) : "") + childKey
                );
              }
              array.push(mappedChild);
            }
            return 1;
          }
          var child;
          var nextName;
          var subtreeCount = 0;
          var nextNamePrefix = nameSoFar === "" ? SEPARATOR : nameSoFar + SUBSEPARATOR;
          if (isArray(children)) {
            for (var i2 = 0; i2 < children.length; i2++) {
              child = children[i2];
              nextName = nextNamePrefix + getElementKey(child, i2);
              subtreeCount += mapIntoArray(child, array, escapedPrefix, nextName, callback);
            }
          } else {
            var iteratorFn = getIteratorFn(children);
            if (typeof iteratorFn === "function") {
              var iterableChildren = children;
              {
                if (iteratorFn === iterableChildren.entries) {
                  if (!didWarnAboutMaps) {
                    warn("Using Maps as children is not supported. Use an array of keyed ReactElements instead.");
                  }
                  didWarnAboutMaps = true;
                }
              }
              var iterator = iteratorFn.call(iterableChildren);
              var step;
              var ii = 0;
              while (!(step = iterator.next()).done) {
                child = step.value;
                nextName = nextNamePrefix + getElementKey(child, ii++);
                subtreeCount += mapIntoArray(child, array, escapedPrefix, nextName, callback);
              }
            } else if (type === "object") {
              var childrenString = String(children);
              throw new Error("Objects are not valid as a React child (found: " + (childrenString === "[object Object]" ? "object with keys {" + Object.keys(children).join(", ") + "}" : childrenString) + "). If you meant to render a collection of children, use an array instead.");
            }
          }
          return subtreeCount;
        }
        __name(mapIntoArray, "mapIntoArray");
        function mapChildren(children, func, context) {
          if (children == null) {
            return children;
          }
          var result = [];
          var count = 0;
          mapIntoArray(children, result, "", "", function(child) {
            return func.call(context, child, count++);
          });
          return result;
        }
        __name(mapChildren, "mapChildren");
        function countChildren(children) {
          var n = 0;
          mapChildren(children, function() {
            n++;
          });
          return n;
        }
        __name(countChildren, "countChildren");
        function forEachChildren(children, forEachFunc, forEachContext) {
          mapChildren(children, function() {
            forEachFunc.apply(this, arguments);
          }, forEachContext);
        }
        __name(forEachChildren, "forEachChildren");
        function toArray(children) {
          return mapChildren(children, function(child) {
            return child;
          }) || [];
        }
        __name(toArray, "toArray");
        function onlyChild(children) {
          if (!isValidElement(children)) {
            throw new Error("React.Children.only expected to receive a single React element child.");
          }
          return children;
        }
        __name(onlyChild, "onlyChild");
        function createContext(defaultValue) {
          var context = {
            $$typeof: REACT_CONTEXT_TYPE,
            // As a workaround to support multiple concurrent renderers, we categorize
            // some renderers as primary and others as secondary. We only expect
            // there to be two concurrent renderers at most: React Native (primary) and
            // Fabric (secondary); React DOM (primary) and React ART (secondary).
            // Secondary renderers store their context values on separate fields.
            _currentValue: defaultValue,
            _currentValue2: defaultValue,
            // Used to track how many concurrent renderers this context currently
            // supports within in a single renderer. Such as parallel server rendering.
            _threadCount: 0,
            // These are circular
            Provider: null,
            Consumer: null,
            // Add these to use same hidden class in VM as ServerContext
            _defaultValue: null,
            _globalName: null
          };
          context.Provider = {
            $$typeof: REACT_PROVIDER_TYPE,
            _context: context
          };
          var hasWarnedAboutUsingNestedContextConsumers = false;
          var hasWarnedAboutUsingConsumerProvider = false;
          var hasWarnedAboutDisplayNameOnConsumer = false;
          {
            var Consumer = {
              $$typeof: REACT_CONTEXT_TYPE,
              _context: context
            };
            Object.defineProperties(Consumer, {
              Provider: {
                get: /* @__PURE__ */ __name(function() {
                  if (!hasWarnedAboutUsingConsumerProvider) {
                    hasWarnedAboutUsingConsumerProvider = true;
                    error("Rendering <Context.Consumer.Provider> is not supported and will be removed in a future major release. Did you mean to render <Context.Provider> instead?");
                  }
                  return context.Provider;
                }, "get"),
                set: /* @__PURE__ */ __name(function(_Provider) {
                  context.Provider = _Provider;
                }, "set")
              },
              _currentValue: {
                get: /* @__PURE__ */ __name(function() {
                  return context._currentValue;
                }, "get"),
                set: /* @__PURE__ */ __name(function(_currentValue) {
                  context._currentValue = _currentValue;
                }, "set")
              },
              _currentValue2: {
                get: /* @__PURE__ */ __name(function() {
                  return context._currentValue2;
                }, "get"),
                set: /* @__PURE__ */ __name(function(_currentValue2) {
                  context._currentValue2 = _currentValue2;
                }, "set")
              },
              _threadCount: {
                get: /* @__PURE__ */ __name(function() {
                  return context._threadCount;
                }, "get"),
                set: /* @__PURE__ */ __name(function(_threadCount) {
                  context._threadCount = _threadCount;
                }, "set")
              },
              Consumer: {
                get: /* @__PURE__ */ __name(function() {
                  if (!hasWarnedAboutUsingNestedContextConsumers) {
                    hasWarnedAboutUsingNestedContextConsumers = true;
                    error("Rendering <Context.Consumer.Consumer> is not supported and will be removed in a future major release. Did you mean to render <Context.Consumer> instead?");
                  }
                  return context.Consumer;
                }, "get")
              },
              displayName: {
                get: /* @__PURE__ */ __name(function() {
                  return context.displayName;
                }, "get"),
                set: /* @__PURE__ */ __name(function(displayName) {
                  if (!hasWarnedAboutDisplayNameOnConsumer) {
                    warn("Setting `displayName` on Context.Consumer has no effect. You should set it directly on the context with Context.displayName = '%s'.", displayName);
                    hasWarnedAboutDisplayNameOnConsumer = true;
                  }
                }, "set")
              }
            });
            context.Consumer = Consumer;
          }
          {
            context._currentRenderer = null;
            context._currentRenderer2 = null;
          }
          return context;
        }
        __name(createContext, "createContext");
        var Uninitialized = -1;
        var Pending = 0;
        var Resolved = 1;
        var Rejected = 2;
        function lazyInitializer(payload) {
          if (payload._status === Uninitialized) {
            var ctor = payload._result;
            var thenable = ctor();
            thenable.then(function(moduleObject2) {
              if (payload._status === Pending || payload._status === Uninitialized) {
                var resolved = payload;
                resolved._status = Resolved;
                resolved._result = moduleObject2;
              }
            }, function(error2) {
              if (payload._status === Pending || payload._status === Uninitialized) {
                var rejected = payload;
                rejected._status = Rejected;
                rejected._result = error2;
              }
            });
            if (payload._status === Uninitialized) {
              var pending = payload;
              pending._status = Pending;
              pending._result = thenable;
            }
          }
          if (payload._status === Resolved) {
            var moduleObject = payload._result;
            {
              if (moduleObject === void 0) {
                error("lazy: Expected the result of a dynamic import() call. Instead received: %s\n\nYour code should look like: \n  const MyComponent = lazy(() => import('./MyComponent'))\n\nDid you accidentally put curly braces around the import?", moduleObject);
              }
            }
            {
              if (!("default" in moduleObject)) {
                error("lazy: Expected the result of a dynamic import() call. Instead received: %s\n\nYour code should look like: \n  const MyComponent = lazy(() => import('./MyComponent'))", moduleObject);
              }
            }
            return moduleObject.default;
          } else {
            throw payload._result;
          }
        }
        __name(lazyInitializer, "lazyInitializer");
        function lazy(ctor) {
          var payload = {
            // We use these fields to store the result.
            _status: Uninitialized,
            _result: ctor
          };
          var lazyType = {
            $$typeof: REACT_LAZY_TYPE,
            _payload: payload,
            _init: lazyInitializer
          };
          {
            var defaultProps;
            var propTypes;
            Object.defineProperties(lazyType, {
              defaultProps: {
                configurable: true,
                get: /* @__PURE__ */ __name(function() {
                  return defaultProps;
                }, "get"),
                set: /* @__PURE__ */ __name(function(newDefaultProps) {
                  error("React.lazy(...): It is not supported to assign `defaultProps` to a lazy component import. Either specify them where the component is defined, or create a wrapping component around it.");
                  defaultProps = newDefaultProps;
                  Object.defineProperty(lazyType, "defaultProps", {
                    enumerable: true
                  });
                }, "set")
              },
              propTypes: {
                configurable: true,
                get: /* @__PURE__ */ __name(function() {
                  return propTypes;
                }, "get"),
                set: /* @__PURE__ */ __name(function(newPropTypes) {
                  error("React.lazy(...): It is not supported to assign `propTypes` to a lazy component import. Either specify them where the component is defined, or create a wrapping component around it.");
                  propTypes = newPropTypes;
                  Object.defineProperty(lazyType, "propTypes", {
                    enumerable: true
                  });
                }, "set")
              }
            });
          }
          return lazyType;
        }
        __name(lazy, "lazy");
        function forwardRef(render2) {
          {
            if (render2 != null && render2.$$typeof === REACT_MEMO_TYPE) {
              error("forwardRef requires a render function but received a `memo` component. Instead of forwardRef(memo(...)), use memo(forwardRef(...)).");
            } else if (typeof render2 !== "function") {
              error("forwardRef requires a render function but was given %s.", render2 === null ? "null" : typeof render2);
            } else {
              if (render2.length !== 0 && render2.length !== 2) {
                error("forwardRef render functions accept exactly two parameters: props and ref. %s", render2.length === 1 ? "Did you forget to use the ref parameter?" : "Any additional parameter will be undefined.");
              }
            }
            if (render2 != null) {
              if (render2.defaultProps != null || render2.propTypes != null) {
                error("forwardRef render functions do not support propTypes or defaultProps. Did you accidentally pass a React component?");
              }
            }
          }
          var elementType = {
            $$typeof: REACT_FORWARD_REF_TYPE,
            render: render2
          };
          {
            var ownName;
            Object.defineProperty(elementType, "displayName", {
              enumerable: false,
              configurable: true,
              get: /* @__PURE__ */ __name(function() {
                return ownName;
              }, "get"),
              set: /* @__PURE__ */ __name(function(name) {
                ownName = name;
                if (!render2.name && !render2.displayName) {
                  render2.displayName = name;
                }
              }, "set")
            });
          }
          return elementType;
        }
        __name(forwardRef, "forwardRef");
        var REACT_MODULE_REFERENCE;
        {
          REACT_MODULE_REFERENCE = Symbol.for("react.module.reference");
        }
        function isValidElementType(type) {
          if (typeof type === "string" || typeof type === "function") {
            return true;
          }
          if (type === REACT_FRAGMENT_TYPE || type === REACT_PROFILER_TYPE || enableDebugTracing || type === REACT_STRICT_MODE_TYPE || type === REACT_SUSPENSE_TYPE || type === REACT_SUSPENSE_LIST_TYPE || enableLegacyHidden || type === REACT_OFFSCREEN_TYPE || enableScopeAPI || enableCacheElement || enableTransitionTracing) {
            return true;
          }
          if (typeof type === "object" && type !== null) {
            if (type.$$typeof === REACT_LAZY_TYPE || type.$$typeof === REACT_MEMO_TYPE || type.$$typeof === REACT_PROVIDER_TYPE || type.$$typeof === REACT_CONTEXT_TYPE || type.$$typeof === REACT_FORWARD_REF_TYPE || // This needs to include all possible module reference object
            // types supported by any Flight configuration anywhere since
            // we don't know which Flight build this will end up being used
            // with.
            type.$$typeof === REACT_MODULE_REFERENCE || type.getModuleId !== void 0) {
              return true;
            }
          }
          return false;
        }
        __name(isValidElementType, "isValidElementType");
        function memo(type, compare) {
          {
            if (!isValidElementType(type)) {
              error("memo: The first argument must be a component. Instead received: %s", type === null ? "null" : typeof type);
            }
          }
          var elementType = {
            $$typeof: REACT_MEMO_TYPE,
            type,
            compare: compare === void 0 ? null : compare
          };
          {
            var ownName;
            Object.defineProperty(elementType, "displayName", {
              enumerable: false,
              configurable: true,
              get: /* @__PURE__ */ __name(function() {
                return ownName;
              }, "get"),
              set: /* @__PURE__ */ __name(function(name) {
                ownName = name;
                if (!type.name && !type.displayName) {
                  type.displayName = name;
                }
              }, "set")
            });
          }
          return elementType;
        }
        __name(memo, "memo");
        function resolveDispatcher() {
          var dispatcher = ReactCurrentDispatcher.current;
          {
            if (dispatcher === null) {
              error("Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:\n1. You might have mismatching versions of React and the renderer (such as React DOM)\n2. You might be breaking the Rules of Hooks\n3. You might have more than one copy of React in the same app\nSee https://reactjs.org/link/invalid-hook-call for tips about how to debug and fix this problem.");
            }
          }
          return dispatcher;
        }
        __name(resolveDispatcher, "resolveDispatcher");
        function useContext(Context) {
          var dispatcher = resolveDispatcher();
          {
            if (Context._context !== void 0) {
              var realContext = Context._context;
              if (realContext.Consumer === Context) {
                error("Calling useContext(Context.Consumer) is not supported, may cause bugs, and will be removed in a future major release. Did you mean to call useContext(Context) instead?");
              } else if (realContext.Provider === Context) {
                error("Calling useContext(Context.Provider) is not supported. Did you mean to call useContext(Context) instead?");
              }
            }
          }
          return dispatcher.useContext(Context);
        }
        __name(useContext, "useContext");
        function useState(initialState) {
          var dispatcher = resolveDispatcher();
          return dispatcher.useState(initialState);
        }
        __name(useState, "useState");
        function useReducer(reducer, initialArg, init2) {
          var dispatcher = resolveDispatcher();
          return dispatcher.useReducer(reducer, initialArg, init2);
        }
        __name(useReducer, "useReducer");
        function useRef(initialValue) {
          var dispatcher = resolveDispatcher();
          return dispatcher.useRef(initialValue);
        }
        __name(useRef, "useRef");
        function useEffect(create, deps) {
          var dispatcher = resolveDispatcher();
          return dispatcher.useEffect(create, deps);
        }
        __name(useEffect, "useEffect");
        function useInsertionEffect(create, deps) {
          var dispatcher = resolveDispatcher();
          return dispatcher.useInsertionEffect(create, deps);
        }
        __name(useInsertionEffect, "useInsertionEffect");
        function useLayoutEffect(create, deps) {
          var dispatcher = resolveDispatcher();
          return dispatcher.useLayoutEffect(create, deps);
        }
        __name(useLayoutEffect, "useLayoutEffect");
        function useCallback(callback, deps) {
          var dispatcher = resolveDispatcher();
          return dispatcher.useCallback(callback, deps);
        }
        __name(useCallback, "useCallback");
        function useMemo(create, deps) {
          var dispatcher = resolveDispatcher();
          return dispatcher.useMemo(create, deps);
        }
        __name(useMemo, "useMemo");
        function useImperativeHandle(ref, create, deps) {
          var dispatcher = resolveDispatcher();
          return dispatcher.useImperativeHandle(ref, create, deps);
        }
        __name(useImperativeHandle, "useImperativeHandle");
        function useDebugValue(value, formatterFn) {
          {
            var dispatcher = resolveDispatcher();
            return dispatcher.useDebugValue(value, formatterFn);
          }
        }
        __name(useDebugValue, "useDebugValue");
        function useTransition() {
          var dispatcher = resolveDispatcher();
          return dispatcher.useTransition();
        }
        __name(useTransition, "useTransition");
        function useDeferredValue(value) {
          var dispatcher = resolveDispatcher();
          return dispatcher.useDeferredValue(value);
        }
        __name(useDeferredValue, "useDeferredValue");
        function useId() {
          var dispatcher = resolveDispatcher();
          return dispatcher.useId();
        }
        __name(useId, "useId");
        function useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot) {
          var dispatcher = resolveDispatcher();
          return dispatcher.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
        }
        __name(useSyncExternalStore, "useSyncExternalStore");
        var disabledDepth = 0;
        var prevLog;
        var prevInfo;
        var prevWarn;
        var prevError;
        var prevGroup;
        var prevGroupCollapsed;
        var prevGroupEnd;
        function disabledLog() {
        }
        __name(disabledLog, "disabledLog");
        disabledLog.__reactDisabledLog = true;
        function disableLogs() {
          {
            if (disabledDepth === 0) {
              prevLog = console.log;
              prevInfo = console.info;
              prevWarn = console.warn;
              prevError = console.error;
              prevGroup = console.group;
              prevGroupCollapsed = console.groupCollapsed;
              prevGroupEnd = console.groupEnd;
              var props = {
                configurable: true,
                enumerable: true,
                value: disabledLog,
                writable: true
              };
              Object.defineProperties(console, {
                info: props,
                log: props,
                warn: props,
                error: props,
                group: props,
                groupCollapsed: props,
                groupEnd: props
              });
            }
            disabledDepth++;
          }
        }
        __name(disableLogs, "disableLogs");
        function reenableLogs() {
          {
            disabledDepth--;
            if (disabledDepth === 0) {
              var props = {
                configurable: true,
                enumerable: true,
                writable: true
              };
              Object.defineProperties(console, {
                log: assign({}, props, {
                  value: prevLog
                }),
                info: assign({}, props, {
                  value: prevInfo
                }),
                warn: assign({}, props, {
                  value: prevWarn
                }),
                error: assign({}, props, {
                  value: prevError
                }),
                group: assign({}, props, {
                  value: prevGroup
                }),
                groupCollapsed: assign({}, props, {
                  value: prevGroupCollapsed
                }),
                groupEnd: assign({}, props, {
                  value: prevGroupEnd
                })
              });
            }
            if (disabledDepth < 0) {
              error("disabledDepth fell below zero. This is a bug in React. Please file an issue.");
            }
          }
        }
        __name(reenableLogs, "reenableLogs");
        var ReactCurrentDispatcher$1 = ReactSharedInternals.ReactCurrentDispatcher;
        var prefix;
        function describeBuiltInComponentFrame(name, source, ownerFn) {
          {
            if (prefix === void 0) {
              try {
                throw Error();
              } catch (x2) {
                var match2 = x2.stack.trim().match(/\n( *(at )?)/);
                prefix = match2 && match2[1] || "";
              }
            }
            return "\n" + prefix + name;
          }
        }
        __name(describeBuiltInComponentFrame, "describeBuiltInComponentFrame");
        var reentry = false;
        var componentFrameCache;
        {
          var PossiblyWeakMap = typeof WeakMap === "function" ? WeakMap : Map;
          componentFrameCache = new PossiblyWeakMap();
        }
        function describeNativeComponentFrame(fn2, construct) {
          if (!fn2 || reentry) {
            return "";
          }
          {
            var frame = componentFrameCache.get(fn2);
            if (frame !== void 0) {
              return frame;
            }
          }
          var control;
          reentry = true;
          var previousPrepareStackTrace = Error.prepareStackTrace;
          Error.prepareStackTrace = void 0;
          var previousDispatcher;
          {
            previousDispatcher = ReactCurrentDispatcher$1.current;
            ReactCurrentDispatcher$1.current = null;
            disableLogs();
          }
          try {
            if (construct) {
              var Fake = /* @__PURE__ */ __name(function() {
                throw Error();
              }, "Fake");
              Object.defineProperty(Fake.prototype, "props", {
                set: /* @__PURE__ */ __name(function() {
                  throw Error();
                }, "set")
              });
              if (typeof Reflect === "object" && Reflect.construct) {
                try {
                  Reflect.construct(Fake, []);
                } catch (x2) {
                  control = x2;
                }
                Reflect.construct(fn2, [], Fake);
              } else {
                try {
                  Fake.call();
                } catch (x2) {
                  control = x2;
                }
                fn2.call(Fake.prototype);
              }
            } else {
              try {
                throw Error();
              } catch (x2) {
                control = x2;
              }
              fn2();
            }
          } catch (sample) {
            if (sample && control && typeof sample.stack === "string") {
              var sampleLines = sample.stack.split("\n");
              var controlLines = control.stack.split("\n");
              var s = sampleLines.length - 1;
              var c2 = controlLines.length - 1;
              while (s >= 1 && c2 >= 0 && sampleLines[s] !== controlLines[c2]) {
                c2--;
              }
              for (; s >= 1 && c2 >= 0; s--, c2--) {
                if (sampleLines[s] !== controlLines[c2]) {
                  if (s !== 1 || c2 !== 1) {
                    do {
                      s--;
                      c2--;
                      if (c2 < 0 || sampleLines[s] !== controlLines[c2]) {
                        var _frame = "\n" + sampleLines[s].replace(" at new ", " at ");
                        if (fn2.displayName && _frame.includes("<anonymous>")) {
                          _frame = _frame.replace("<anonymous>", fn2.displayName);
                        }
                        {
                          if (typeof fn2 === "function") {
                            componentFrameCache.set(fn2, _frame);
                          }
                        }
                        return _frame;
                      }
                    } while (s >= 1 && c2 >= 0);
                  }
                  break;
                }
              }
            }
          } finally {
            reentry = false;
            {
              ReactCurrentDispatcher$1.current = previousDispatcher;
              reenableLogs();
            }
            Error.prepareStackTrace = previousPrepareStackTrace;
          }
          var name = fn2 ? fn2.displayName || fn2.name : "";
          var syntheticFrame = name ? describeBuiltInComponentFrame(name) : "";
          {
            if (typeof fn2 === "function") {
              componentFrameCache.set(fn2, syntheticFrame);
            }
          }
          return syntheticFrame;
        }
        __name(describeNativeComponentFrame, "describeNativeComponentFrame");
        function describeFunctionComponentFrame(fn2, source, ownerFn) {
          {
            return describeNativeComponentFrame(fn2, false);
          }
        }
        __name(describeFunctionComponentFrame, "describeFunctionComponentFrame");
        function shouldConstruct(Component2) {
          var prototype = Component2.prototype;
          return !!(prototype && prototype.isReactComponent);
        }
        __name(shouldConstruct, "shouldConstruct");
        function describeUnknownElementTypeFrameInDEV(type, source, ownerFn) {
          if (type == null) {
            return "";
          }
          if (typeof type === "function") {
            {
              return describeNativeComponentFrame(type, shouldConstruct(type));
            }
          }
          if (typeof type === "string") {
            return describeBuiltInComponentFrame(type);
          }
          switch (type) {
            case REACT_SUSPENSE_TYPE:
              return describeBuiltInComponentFrame("Suspense");
            case REACT_SUSPENSE_LIST_TYPE:
              return describeBuiltInComponentFrame("SuspenseList");
          }
          if (typeof type === "object") {
            switch (type.$$typeof) {
              case REACT_FORWARD_REF_TYPE:
                return describeFunctionComponentFrame(type.render);
              case REACT_MEMO_TYPE:
                return describeUnknownElementTypeFrameInDEV(type.type, source, ownerFn);
              case REACT_LAZY_TYPE: {
                var lazyComponent = type;
                var payload = lazyComponent._payload;
                var init2 = lazyComponent._init;
                try {
                  return describeUnknownElementTypeFrameInDEV(init2(payload), source, ownerFn);
                } catch (x2) {
                }
              }
            }
          }
          return "";
        }
        __name(describeUnknownElementTypeFrameInDEV, "describeUnknownElementTypeFrameInDEV");
        var loggedTypeFailures = {};
        var ReactDebugCurrentFrame$1 = ReactSharedInternals.ReactDebugCurrentFrame;
        function setCurrentlyValidatingElement(element) {
          {
            if (element) {
              var owner = element._owner;
              var stack = describeUnknownElementTypeFrameInDEV(element.type, element._source, owner ? owner.type : null);
              ReactDebugCurrentFrame$1.setExtraStackFrame(stack);
            } else {
              ReactDebugCurrentFrame$1.setExtraStackFrame(null);
            }
          }
        }
        __name(setCurrentlyValidatingElement, "setCurrentlyValidatingElement");
        function checkPropTypes(typeSpecs, values, location, componentName, element) {
          {
            var has = Function.call.bind(hasOwnProperty);
            for (var typeSpecName in typeSpecs) {
              if (has(typeSpecs, typeSpecName)) {
                var error$1 = void 0;
                try {
                  if (typeof typeSpecs[typeSpecName] !== "function") {
                    var err2 = Error((componentName || "React class") + ": " + location + " type `" + typeSpecName + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof typeSpecs[typeSpecName] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.");
                    err2.name = "Invariant Violation";
                    throw err2;
                  }
                  error$1 = typeSpecs[typeSpecName](values, typeSpecName, componentName, location, null, "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED");
                } catch (ex) {
                  error$1 = ex;
                }
                if (error$1 && !(error$1 instanceof Error)) {
                  setCurrentlyValidatingElement(element);
                  error("%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).", componentName || "React class", location, typeSpecName, typeof error$1);
                  setCurrentlyValidatingElement(null);
                }
                if (error$1 instanceof Error && !(error$1.message in loggedTypeFailures)) {
                  loggedTypeFailures[error$1.message] = true;
                  setCurrentlyValidatingElement(element);
                  error("Failed %s type: %s", location, error$1.message);
                  setCurrentlyValidatingElement(null);
                }
              }
            }
          }
        }
        __name(checkPropTypes, "checkPropTypes");
        function setCurrentlyValidatingElement$1(element) {
          {
            if (element) {
              var owner = element._owner;
              var stack = describeUnknownElementTypeFrameInDEV(element.type, element._source, owner ? owner.type : null);
              setExtraStackFrame(stack);
            } else {
              setExtraStackFrame(null);
            }
          }
        }
        __name(setCurrentlyValidatingElement$1, "setCurrentlyValidatingElement$1");
        var propTypesMisspellWarningShown;
        {
          propTypesMisspellWarningShown = false;
        }
        function getDeclarationErrorAddendum() {
          if (ReactCurrentOwner.current) {
            var name = getComponentNameFromType(ReactCurrentOwner.current.type);
            if (name) {
              return "\n\nCheck the render method of `" + name + "`.";
            }
          }
          return "";
        }
        __name(getDeclarationErrorAddendum, "getDeclarationErrorAddendum");
        function getSourceInfoErrorAddendum(source) {
          if (source !== void 0) {
            var fileName = source.fileName.replace(/^.*[\\\/]/, "");
            var lineNumber = source.lineNumber;
            return "\n\nCheck your code at " + fileName + ":" + lineNumber + ".";
          }
          return "";
        }
        __name(getSourceInfoErrorAddendum, "getSourceInfoErrorAddendum");
        function getSourceInfoErrorAddendumForProps(elementProps) {
          if (elementProps !== null && elementProps !== void 0) {
            return getSourceInfoErrorAddendum(elementProps.__source);
          }
          return "";
        }
        __name(getSourceInfoErrorAddendumForProps, "getSourceInfoErrorAddendumForProps");
        var ownerHasKeyUseWarning = {};
        function getCurrentComponentErrorInfo(parentType) {
          var info = getDeclarationErrorAddendum();
          if (!info) {
            var parentName = typeof parentType === "string" ? parentType : parentType.displayName || parentType.name;
            if (parentName) {
              info = "\n\nCheck the top-level render call using <" + parentName + ">.";
            }
          }
          return info;
        }
        __name(getCurrentComponentErrorInfo, "getCurrentComponentErrorInfo");
        function validateExplicitKey(element, parentType) {
          if (!element._store || element._store.validated || element.key != null) {
            return;
          }
          element._store.validated = true;
          var currentComponentErrorInfo = getCurrentComponentErrorInfo(parentType);
          if (ownerHasKeyUseWarning[currentComponentErrorInfo]) {
            return;
          }
          ownerHasKeyUseWarning[currentComponentErrorInfo] = true;
          var childOwner = "";
          if (element && element._owner && element._owner !== ReactCurrentOwner.current) {
            childOwner = " It was passed a child from " + getComponentNameFromType(element._owner.type) + ".";
          }
          {
            setCurrentlyValidatingElement$1(element);
            error('Each child in a list should have a unique "key" prop.%s%s See https://reactjs.org/link/warning-keys for more information.', currentComponentErrorInfo, childOwner);
            setCurrentlyValidatingElement$1(null);
          }
        }
        __name(validateExplicitKey, "validateExplicitKey");
        function validateChildKeys(node, parentType) {
          if (typeof node !== "object") {
            return;
          }
          if (isArray(node)) {
            for (var i2 = 0; i2 < node.length; i2++) {
              var child = node[i2];
              if (isValidElement(child)) {
                validateExplicitKey(child, parentType);
              }
            }
          } else if (isValidElement(node)) {
            if (node._store) {
              node._store.validated = true;
            }
          } else if (node) {
            var iteratorFn = getIteratorFn(node);
            if (typeof iteratorFn === "function") {
              if (iteratorFn !== node.entries) {
                var iterator = iteratorFn.call(node);
                var step;
                while (!(step = iterator.next()).done) {
                  if (isValidElement(step.value)) {
                    validateExplicitKey(step.value, parentType);
                  }
                }
              }
            }
          }
        }
        __name(validateChildKeys, "validateChildKeys");
        function validatePropTypes(element) {
          {
            var type = element.type;
            if (type === null || type === void 0 || typeof type === "string") {
              return;
            }
            var propTypes;
            if (typeof type === "function") {
              propTypes = type.propTypes;
            } else if (typeof type === "object" && (type.$$typeof === REACT_FORWARD_REF_TYPE || // Note: Memo only checks outer props here.
            // Inner props are checked in the reconciler.
            type.$$typeof === REACT_MEMO_TYPE)) {
              propTypes = type.propTypes;
            } else {
              return;
            }
            if (propTypes) {
              var name = getComponentNameFromType(type);
              checkPropTypes(propTypes, element.props, "prop", name, element);
            } else if (type.PropTypes !== void 0 && !propTypesMisspellWarningShown) {
              propTypesMisspellWarningShown = true;
              var _name = getComponentNameFromType(type);
              error("Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?", _name || "Unknown");
            }
            if (typeof type.getDefaultProps === "function" && !type.getDefaultProps.isReactClassApproved) {
              error("getDefaultProps is only used on classic React.createClass definitions. Use a static property named `defaultProps` instead.");
            }
          }
        }
        __name(validatePropTypes, "validatePropTypes");
        function validateFragmentProps(fragment) {
          {
            var keys = Object.keys(fragment.props);
            for (var i2 = 0; i2 < keys.length; i2++) {
              var key = keys[i2];
              if (key !== "children" && key !== "key") {
                setCurrentlyValidatingElement$1(fragment);
                error("Invalid prop `%s` supplied to `React.Fragment`. React.Fragment can only have `key` and `children` props.", key);
                setCurrentlyValidatingElement$1(null);
                break;
              }
            }
            if (fragment.ref !== null) {
              setCurrentlyValidatingElement$1(fragment);
              error("Invalid attribute `ref` supplied to `React.Fragment`.");
              setCurrentlyValidatingElement$1(null);
            }
          }
        }
        __name(validateFragmentProps, "validateFragmentProps");
        function createElementWithValidation(type, props, children) {
          var validType = isValidElementType(type);
          if (!validType) {
            var info = "";
            if (type === void 0 || typeof type === "object" && type !== null && Object.keys(type).length === 0) {
              info += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.";
            }
            var sourceInfo = getSourceInfoErrorAddendumForProps(props);
            if (sourceInfo) {
              info += sourceInfo;
            } else {
              info += getDeclarationErrorAddendum();
            }
            var typeString;
            if (type === null) {
              typeString = "null";
            } else if (isArray(type)) {
              typeString = "array";
            } else if (type !== void 0 && type.$$typeof === REACT_ELEMENT_TYPE) {
              typeString = "<" + (getComponentNameFromType(type.type) || "Unknown") + " />";
              info = " Did you accidentally export a JSX literal instead of a component?";
            } else {
              typeString = typeof type;
            }
            {
              error("React.createElement: type is invalid -- expected a string (for built-in components) or a class/function (for composite components) but got: %s.%s", typeString, info);
            }
          }
          var element = createElement2.apply(this, arguments);
          if (element == null) {
            return element;
          }
          if (validType) {
            for (var i2 = 2; i2 < arguments.length; i2++) {
              validateChildKeys(arguments[i2], type);
            }
          }
          if (type === REACT_FRAGMENT_TYPE) {
            validateFragmentProps(element);
          } else {
            validatePropTypes(element);
          }
          return element;
        }
        __name(createElementWithValidation, "createElementWithValidation");
        var didWarnAboutDeprecatedCreateFactory = false;
        function createFactoryWithValidation(type) {
          var validatedFactory = createElementWithValidation.bind(null, type);
          validatedFactory.type = type;
          {
            if (!didWarnAboutDeprecatedCreateFactory) {
              didWarnAboutDeprecatedCreateFactory = true;
              warn("React.createFactory() is deprecated and will be removed in a future major release. Consider using JSX or use React.createElement() directly instead.");
            }
            Object.defineProperty(validatedFactory, "type", {
              enumerable: false,
              get: /* @__PURE__ */ __name(function() {
                warn("Factory.type is deprecated. Access the class directly before passing it to createFactory.");
                Object.defineProperty(this, "type", {
                  value: type
                });
                return type;
              }, "get")
            });
          }
          return validatedFactory;
        }
        __name(createFactoryWithValidation, "createFactoryWithValidation");
        function cloneElementWithValidation(element, props, children) {
          var newElement = cloneElement.apply(this, arguments);
          for (var i2 = 2; i2 < arguments.length; i2++) {
            validateChildKeys(arguments[i2], newElement.type);
          }
          validatePropTypes(newElement);
          return newElement;
        }
        __name(cloneElementWithValidation, "cloneElementWithValidation");
        function startTransition(scope, options) {
          var prevTransition = ReactCurrentBatchConfig.transition;
          ReactCurrentBatchConfig.transition = {};
          var currentTransition = ReactCurrentBatchConfig.transition;
          {
            ReactCurrentBatchConfig.transition._updatedFibers = /* @__PURE__ */ new Set();
          }
          try {
            scope();
          } finally {
            ReactCurrentBatchConfig.transition = prevTransition;
            {
              if (prevTransition === null && currentTransition._updatedFibers) {
                var updatedFibersCount = currentTransition._updatedFibers.size;
                if (updatedFibersCount > 10) {
                  warn("Detected a large number of updates inside startTransition. If this is due to a subscription please re-write it to use React provided hooks. Otherwise concurrent mode guarantees are off the table.");
                }
                currentTransition._updatedFibers.clear();
              }
            }
          }
        }
        __name(startTransition, "startTransition");
        var didWarnAboutMessageChannel = false;
        var enqueueTaskImpl = null;
        function enqueueTask(task) {
          if (enqueueTaskImpl === null) {
            try {
              var requireString = ("require" + Math.random()).slice(0, 7);
              var nodeRequire = module && module[requireString];
              enqueueTaskImpl = nodeRequire.call(module, "timers").setImmediate;
            } catch (_err) {
              enqueueTaskImpl = /* @__PURE__ */ __name(function(callback) {
                {
                  if (didWarnAboutMessageChannel === false) {
                    didWarnAboutMessageChannel = true;
                    if (typeof MessageChannel === "undefined") {
                      error("This browser does not have a MessageChannel implementation, so enqueuing tasks via await act(async () => ...) will fail. Please file an issue at https://github.com/facebook/react/issues if you encounter this warning.");
                    }
                  }
                }
                var channel = new MessageChannel();
                channel.port1.onmessage = callback;
                channel.port2.postMessage(void 0);
              }, "enqueueTaskImpl");
            }
          }
          return enqueueTaskImpl(task);
        }
        __name(enqueueTask, "enqueueTask");
        var actScopeDepth = 0;
        var didWarnNoAwaitAct = false;
        function act(callback) {
          {
            var prevActScopeDepth = actScopeDepth;
            actScopeDepth++;
            if (ReactCurrentActQueue.current === null) {
              ReactCurrentActQueue.current = [];
            }
            var prevIsBatchingLegacy = ReactCurrentActQueue.isBatchingLegacy;
            var result;
            try {
              ReactCurrentActQueue.isBatchingLegacy = true;
              result = callback();
              if (!prevIsBatchingLegacy && ReactCurrentActQueue.didScheduleLegacyUpdate) {
                var queue = ReactCurrentActQueue.current;
                if (queue !== null) {
                  ReactCurrentActQueue.didScheduleLegacyUpdate = false;
                  flushActQueue(queue);
                }
              }
            } catch (error2) {
              popActScope(prevActScopeDepth);
              throw error2;
            } finally {
              ReactCurrentActQueue.isBatchingLegacy = prevIsBatchingLegacy;
            }
            if (result !== null && typeof result === "object" && typeof result.then === "function") {
              var thenableResult = result;
              var wasAwaited = false;
              var thenable = {
                then: /* @__PURE__ */ __name(function(resolve, reject) {
                  wasAwaited = true;
                  thenableResult.then(function(returnValue2) {
                    popActScope(prevActScopeDepth);
                    if (actScopeDepth === 0) {
                      recursivelyFlushAsyncActWork(returnValue2, resolve, reject);
                    } else {
                      resolve(returnValue2);
                    }
                  }, function(error2) {
                    popActScope(prevActScopeDepth);
                    reject(error2);
                  });
                }, "then")
              };
              {
                if (!didWarnNoAwaitAct && typeof Promise !== "undefined") {
                  Promise.resolve().then(function() {
                  }).then(function() {
                    if (!wasAwaited) {
                      didWarnNoAwaitAct = true;
                      error("You called act(async () => ...) without await. This could lead to unexpected testing behaviour, interleaving multiple act calls and mixing their scopes. You should - await act(async () => ...);");
                    }
                  });
                }
              }
              return thenable;
            } else {
              var returnValue = result;
              popActScope(prevActScopeDepth);
              if (actScopeDepth === 0) {
                var _queue = ReactCurrentActQueue.current;
                if (_queue !== null) {
                  flushActQueue(_queue);
                  ReactCurrentActQueue.current = null;
                }
                var _thenable = {
                  then: /* @__PURE__ */ __name(function(resolve, reject) {
                    if (ReactCurrentActQueue.current === null) {
                      ReactCurrentActQueue.current = [];
                      recursivelyFlushAsyncActWork(returnValue, resolve, reject);
                    } else {
                      resolve(returnValue);
                    }
                  }, "then")
                };
                return _thenable;
              } else {
                var _thenable2 = {
                  then: /* @__PURE__ */ __name(function(resolve, reject) {
                    resolve(returnValue);
                  }, "then")
                };
                return _thenable2;
              }
            }
          }
        }
        __name(act, "act");
        function popActScope(prevActScopeDepth) {
          {
            if (prevActScopeDepth !== actScopeDepth - 1) {
              error("You seem to have overlapping act() calls, this is not supported. Be sure to await previous act() calls before making a new one. ");
            }
            actScopeDepth = prevActScopeDepth;
          }
        }
        __name(popActScope, "popActScope");
        function recursivelyFlushAsyncActWork(returnValue, resolve, reject) {
          {
            var queue = ReactCurrentActQueue.current;
            if (queue !== null) {
              try {
                flushActQueue(queue);
                enqueueTask(function() {
                  if (queue.length === 0) {
                    ReactCurrentActQueue.current = null;
                    resolve(returnValue);
                  } else {
                    recursivelyFlushAsyncActWork(returnValue, resolve, reject);
                  }
                });
              } catch (error2) {
                reject(error2);
              }
            } else {
              resolve(returnValue);
            }
          }
        }
        __name(recursivelyFlushAsyncActWork, "recursivelyFlushAsyncActWork");
        var isFlushing = false;
        function flushActQueue(queue) {
          {
            if (!isFlushing) {
              isFlushing = true;
              var i2 = 0;
              try {
                for (; i2 < queue.length; i2++) {
                  var callback = queue[i2];
                  do {
                    callback = callback(true);
                  } while (callback !== null);
                }
                queue.length = 0;
              } catch (error2) {
                queue = queue.slice(i2 + 1);
                throw error2;
              } finally {
                isFlushing = false;
              }
            }
          }
        }
        __name(flushActQueue, "flushActQueue");
        var createElement$1 = createElementWithValidation;
        var cloneElement$1 = cloneElementWithValidation;
        var createFactory = createFactoryWithValidation;
        var Children = {
          map: mapChildren,
          forEach: forEachChildren,
          count: countChildren,
          toArray,
          only: onlyChild
        };
        exports2.Children = Children;
        exports2.Component = Component;
        exports2.Fragment = REACT_FRAGMENT_TYPE;
        exports2.Profiler = REACT_PROFILER_TYPE;
        exports2.PureComponent = PureComponent;
        exports2.StrictMode = REACT_STRICT_MODE_TYPE;
        exports2.Suspense = REACT_SUSPENSE_TYPE;
        exports2.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = ReactSharedInternals;
        exports2.act = act;
        exports2.cloneElement = cloneElement$1;
        exports2.createContext = createContext;
        exports2.createElement = createElement$1;
        exports2.createFactory = createFactory;
        exports2.createRef = createRef;
        exports2.forwardRef = forwardRef;
        exports2.isValidElement = isValidElement;
        exports2.lazy = lazy;
        exports2.memo = memo;
        exports2.startTransition = startTransition;
        exports2.unstable_act = act;
        exports2.useCallback = useCallback;
        exports2.useContext = useContext;
        exports2.useDebugValue = useDebugValue;
        exports2.useDeferredValue = useDeferredValue;
        exports2.useEffect = useEffect;
        exports2.useId = useId;
        exports2.useImperativeHandle = useImperativeHandle;
        exports2.useInsertionEffect = useInsertionEffect;
        exports2.useLayoutEffect = useLayoutEffect;
        exports2.useMemo = useMemo;
        exports2.useReducer = useReducer;
        exports2.useRef = useRef;
        exports2.useState = useState;
        exports2.useSyncExternalStore = useSyncExternalStore;
        exports2.useTransition = useTransition;
        exports2.version = ReactVersion;
        if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ !== "undefined" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop === "function") {
          __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(new Error());
        }
      })();
    }
  }
});

// ../node_modules/react/index.js
var require_react = __commonJS({
  "../node_modules/react/index.js"(exports2, module) {
    "use strict";
    init_functionsRoutes_0_7918156147864959();
    init_checked_fetch();
    if (false) {
      module.exports = null;
    } else {
      module.exports = require_react_development();
    }
  }
});

// ../node_modules/@cloudflare/pages-plugin-vercel-og/dist/src/api/index.js
import resvg_wasm from "./a7e702bc5ba9227243abda7977c8096f59478d3f-resvg.wasm";
import yoga_wasm from "./ea9ee43a5ee9b2e1cd270fa43980822c06dc5bf2-yoga.wasm";
import fallbackFont from "./317f3d4af3af6e6c41b4fa8656e08dc5f512ed20-noto-sans-v27-latin-regular.ttf.bin";
function getIconCode(char) {
  return toCodePoint(char.indexOf(U200D) < 0 ? char.replace(UFE0Fg, "") : char);
}
function toCodePoint(unicodeSurrogates) {
  var r = [], c2 = 0, p = 0, i2 = 0;
  while (i2 < unicodeSurrogates.length) {
    c2 = unicodeSurrogates.charCodeAt(i2++);
    if (p) {
      r.push((65536 + (p - 55296 << 10) + (c2 - 56320)).toString(16));
      p = 0;
    } else if (55296 <= c2 && c2 <= 56319) {
      p = c2;
    } else {
      r.push(c2.toString(16));
    }
  }
  return r.join("-");
}
function loadEmoji(code, type) {
  if (!type || !apis[type]) {
    type = "twemoji";
  }
  const api = apis[type];
  if (typeof api === "function") {
    return fetch(api(code));
  }
  return fetch(`${api}${code.toUpperCase()}.svg`);
}
async function loadGoogleFont(font, text) {
  if (!font || !text)
    return;
  const API = `https://fonts.googleapis.com/css2?family=${font}&text=${encodeURIComponent(text)}`;
  const css = await (await fetch(API, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_8; de-at) AppleWebKit/533.21.1 (KHTML, like Gecko) Version/5.0.5 Safari/533.21.1"
    }
  })).text();
  const resource = css.match(/src: url\((.+)\) format\('(opentype|truetype)'\)/);
  if (!resource)
    throw new Error("Failed to load font");
  return fetch(resource[1]).then((res) => res.arrayBuffer());
}
async function render(satori, resvg, opts, defaultFonts, element) {
  const options = Object.assign({
    width: 1200,
    height: 630,
    debug: false
  }, opts);
  const svg = await satori(element, {
    width: options.width,
    height: options.height,
    debug: options.debug,
    fonts: options.fonts || defaultFonts,
    loadAdditionalAsset: loadDynamicAsset({
      emoji: options.emoji
    })
  });
  const resvgJS = new resvg.Resvg(svg, {
    fitTo: {
      mode: "width",
      value: options.width
    }
  });
  return resvgJS.render().asPng();
}
function inflateSync(data, out) {
  return inflt(data, out);
}
function Path() {
  this.commands = [];
  this.fill = "black";
  this.stroke = null;
  this.strokeWidth = 1;
}
function DefaultEncoding(font) {
  this.font = font;
}
function CmapEncoding(cmap2) {
  this.cmap = cmap2;
}
function CffEncoding(encoding, charset) {
  this.encoding = encoding;
  this.charset = charset;
}
function addGlyphNamesAll(font) {
  var glyph;
  var glyphIndexMap = font.tables.cmap.glyphIndexMap;
  var charCodes = Object.keys(glyphIndexMap);
  for (var i2 = 0; i2 < charCodes.length; i2 += 1) {
    var c2 = charCodes[i2];
    var glyphIndex = glyphIndexMap[c2];
    glyph = font.glyphs.get(glyphIndex);
    glyph.addUnicode(parseInt(c2));
  }
}
function addGlyphNamesToUnicodeMap(font) {
  font._IndexToUnicodeMap = {};
  var glyphIndexMap = font.tables.cmap.glyphIndexMap;
  var charCodes = Object.keys(glyphIndexMap);
  for (var i2 = 0; i2 < charCodes.length; i2 += 1) {
    var c2 = charCodes[i2];
    var glyphIndex = glyphIndexMap[c2];
    if (font._IndexToUnicodeMap[glyphIndex] === void 0) {
      font._IndexToUnicodeMap[glyphIndex] = {
        unicodes: [parseInt(c2)]
      };
    } else {
      font._IndexToUnicodeMap[glyphIndex].unicodes.push(parseInt(c2));
    }
  }
}
function addGlyphNames(font, opt) {
  if (opt.lowMemory) {
    addGlyphNamesToUnicodeMap(font);
  } else {
    addGlyphNamesAll(font);
  }
}
function fail(message) {
  throw new Error(message);
}
function argument(predicate, message) {
  if (!predicate) {
    fail(message);
  }
}
function getPathDefinition(glyph, path) {
  var _path = path || new Path();
  return {
    configurable: true,
    get: /* @__PURE__ */ __name(function() {
      if (typeof _path === "function") {
        _path = _path();
      }
      return _path;
    }, "get"),
    set: /* @__PURE__ */ __name(function(p) {
      _path = p;
    }, "set")
  };
}
function Glyph(options) {
  this.bindConstructorValues(options);
}
function defineDependentProperty(glyph, externalName, internalName) {
  Object.defineProperty(glyph, externalName, {
    get: /* @__PURE__ */ __name(function() {
      glyph.path;
      return glyph[internalName];
    }, "get"),
    set: /* @__PURE__ */ __name(function(newValue) {
      glyph[internalName] = newValue;
    }, "set"),
    enumerable: true,
    configurable: true
  });
}
function GlyphSet(font, glyphs) {
  this.font = font;
  this.glyphs = {};
  if (Array.isArray(glyphs)) {
    for (var i2 = 0; i2 < glyphs.length; i2++) {
      var glyph = glyphs[i2];
      glyph.path.unitsPerEm = font.unitsPerEm;
      this.glyphs[i2] = glyph;
    }
  }
  this.length = glyphs && glyphs.length || 0;
}
function glyphLoader(font, index) {
  return new Glyph({ index, font });
}
function ttfGlyphLoader(font, index, parseGlyph2, data, position, buildPath2) {
  return function() {
    var glyph = new Glyph({ index, font });
    glyph.path = function() {
      parseGlyph2(glyph, data, position);
      var path = buildPath2(font.glyphs, glyph);
      path.unitsPerEm = font.unitsPerEm;
      return path;
    };
    defineDependentProperty(glyph, "xMin", "_xMin");
    defineDependentProperty(glyph, "xMax", "_xMax");
    defineDependentProperty(glyph, "yMin", "_yMin");
    defineDependentProperty(glyph, "yMax", "_yMax");
    return glyph;
  };
}
function cffGlyphLoader(font, index, parseCFFCharstring2, charstring) {
  return function() {
    var glyph = new Glyph({ index, font });
    glyph.path = function() {
      var path = parseCFFCharstring2(font, glyph, charstring);
      path.unitsPerEm = font.unitsPerEm;
      return path;
    };
    return glyph;
  };
}
function searchTag(arr, tag) {
  var imin = 0;
  var imax = arr.length - 1;
  while (imin <= imax) {
    var imid = imin + imax >>> 1;
    var val = arr[imid].tag;
    if (val === tag) {
      return imid;
    } else if (val < tag) {
      imin = imid + 1;
    } else {
      imax = imid - 1;
    }
  }
  return -imin - 1;
}
function binSearch(arr, value) {
  var imin = 0;
  var imax = arr.length - 1;
  while (imin <= imax) {
    var imid = imin + imax >>> 1;
    var val = arr[imid];
    if (val === value) {
      return imid;
    } else if (val < value) {
      imin = imid + 1;
    } else {
      imax = imid - 1;
    }
  }
  return -imin - 1;
}
function searchRange(ranges, value) {
  var range;
  var imin = 0;
  var imax = ranges.length - 1;
  while (imin <= imax) {
    var imid = imin + imax >>> 1;
    range = ranges[imid];
    var start = range.start;
    if (start === value) {
      return range;
    } else if (start < value) {
      imin = imid + 1;
    } else {
      imax = imid - 1;
    }
  }
  if (imin > 0) {
    range = ranges[imin - 1];
    if (value > range.end) {
      return 0;
    }
    return range;
  }
}
function Layout(font, tableName) {
  this.font = font;
  this.tableName = tableName;
}
function Position(font) {
  Layout.call(this, font, "gpos");
}
function Substitution(font) {
  Layout.call(this, font, "gsub");
}
function arraysEqual(ar1, ar2) {
  var n = ar1.length;
  if (n !== ar2.length) {
    return false;
  }
  for (var i2 = 0; i2 < n; i2++) {
    if (ar1[i2] !== ar2[i2]) {
      return false;
    }
  }
  return true;
}
function getSubstFormat(lookupTable, format, defaultSubtable) {
  var subtables = lookupTable.subtables;
  for (var i2 = 0; i2 < subtables.length; i2++) {
    var subtable = subtables[i2];
    if (subtable.substFormat === format) {
      return subtable;
    }
  }
  if (defaultSubtable) {
    subtables.push(defaultSubtable);
    return defaultSubtable;
  }
  return void 0;
}
function checkArgument(expression, message) {
  if (!expression) {
    throw message;
  }
}
function getByte(dataView, offset) {
  return dataView.getUint8(offset);
}
function getUShort(dataView, offset) {
  return dataView.getUint16(offset, false);
}
function getShort(dataView, offset) {
  return dataView.getInt16(offset, false);
}
function getULong(dataView, offset) {
  return dataView.getUint32(offset, false);
}
function getFixed(dataView, offset) {
  var decimal = dataView.getInt16(offset, false);
  var fraction = dataView.getUint16(offset + 2, false);
  return decimal + fraction / 65535;
}
function getTag(dataView, offset) {
  var tag = "";
  for (var i2 = offset; i2 < offset + 4; i2 += 1) {
    tag += String.fromCharCode(dataView.getInt8(i2));
  }
  return tag;
}
function getOffset(dataView, offset, offSize) {
  var v = 0;
  for (var i2 = 0; i2 < offSize; i2 += 1) {
    v <<= 8;
    v += dataView.getUint8(offset + i2);
  }
  return v;
}
function getBytes(dataView, startOffset, endOffset) {
  var bytes = [];
  for (var i2 = startOffset; i2 < endOffset; i2 += 1) {
    bytes.push(dataView.getUint8(i2));
  }
  return bytes;
}
function bytesToString(bytes) {
  var s = "";
  for (var i2 = 0; i2 < bytes.length; i2 += 1) {
    s += String.fromCharCode(bytes[i2]);
  }
  return s;
}
function Parser(data, offset) {
  this.data = data;
  this.offset = offset;
  this.relativeOffset = 0;
}
function parseGlyphCoordinate(p, flag, previousValue, shortVectorBitMask, sameBitMask) {
  var v;
  if ((flag & shortVectorBitMask) > 0) {
    v = p.parseByte();
    if ((flag & sameBitMask) === 0) {
      v = -v;
    }
    v = previousValue + v;
  } else {
    if ((flag & sameBitMask) > 0) {
      v = previousValue;
    } else {
      v = previousValue + p.parseShort();
    }
  }
  return v;
}
function parseGlyph(glyph, data, start) {
  var p = new parse.Parser(data, start);
  glyph.numberOfContours = p.parseShort();
  glyph._xMin = p.parseShort();
  glyph._yMin = p.parseShort();
  glyph._xMax = p.parseShort();
  glyph._yMax = p.parseShort();
  var flags2;
  var flag;
  if (glyph.numberOfContours > 0) {
    var endPointIndices = glyph.endPointIndices = [];
    for (var i2 = 0; i2 < glyph.numberOfContours; i2 += 1) {
      endPointIndices.push(p.parseUShort());
    }
    glyph.instructionLength = p.parseUShort();
    glyph.instructions = [];
    for (var i$1 = 0; i$1 < glyph.instructionLength; i$1 += 1) {
      glyph.instructions.push(p.parseByte());
    }
    var numberOfCoordinates = endPointIndices[endPointIndices.length - 1] + 1;
    flags2 = [];
    for (var i$2 = 0; i$2 < numberOfCoordinates; i$2 += 1) {
      flag = p.parseByte();
      flags2.push(flag);
      if ((flag & 8) > 0) {
        var repeatCount = p.parseByte();
        for (var j2 = 0; j2 < repeatCount; j2 += 1) {
          flags2.push(flag);
          i$2 += 1;
        }
      }
    }
    check.argument(flags2.length === numberOfCoordinates, "Bad flags.");
    if (endPointIndices.length > 0) {
      var points = [];
      var point;
      if (numberOfCoordinates > 0) {
        for (var i$3 = 0; i$3 < numberOfCoordinates; i$3 += 1) {
          flag = flags2[i$3];
          point = {};
          point.onCurve = !!(flag & 1);
          point.lastPointOfContour = endPointIndices.indexOf(i$3) >= 0;
          points.push(point);
        }
        var px = 0;
        for (var i$4 = 0; i$4 < numberOfCoordinates; i$4 += 1) {
          flag = flags2[i$4];
          point = points[i$4];
          point.x = parseGlyphCoordinate(p, flag, px, 2, 16);
          px = point.x;
        }
        var py = 0;
        for (var i$5 = 0; i$5 < numberOfCoordinates; i$5 += 1) {
          flag = flags2[i$5];
          point = points[i$5];
          point.y = parseGlyphCoordinate(p, flag, py, 4, 32);
          py = point.y;
        }
      }
      glyph.points = points;
    } else {
      glyph.points = [];
    }
  } else if (glyph.numberOfContours === 0) {
    glyph.points = [];
  } else {
    glyph.isComposite = true;
    glyph.points = [];
    glyph.components = [];
    var moreComponents = true;
    while (moreComponents) {
      flags2 = p.parseUShort();
      var component = {
        glyphIndex: p.parseUShort(),
        xScale: 1,
        scale01: 0,
        scale10: 0,
        yScale: 1,
        dx: 0,
        dy: 0
      };
      if ((flags2 & 1) > 0) {
        if ((flags2 & 2) > 0) {
          component.dx = p.parseShort();
          component.dy = p.parseShort();
        } else {
          component.matchedPoints = [p.parseUShort(), p.parseUShort()];
        }
      } else {
        if ((flags2 & 2) > 0) {
          component.dx = p.parseChar();
          component.dy = p.parseChar();
        } else {
          component.matchedPoints = [p.parseByte(), p.parseByte()];
        }
      }
      if ((flags2 & 8) > 0) {
        component.xScale = component.yScale = p.parseF2Dot14();
      } else if ((flags2 & 64) > 0) {
        component.xScale = p.parseF2Dot14();
        component.yScale = p.parseF2Dot14();
      } else if ((flags2 & 128) > 0) {
        component.xScale = p.parseF2Dot14();
        component.scale01 = p.parseF2Dot14();
        component.scale10 = p.parseF2Dot14();
        component.yScale = p.parseF2Dot14();
      }
      glyph.components.push(component);
      moreComponents = !!(flags2 & 32);
    }
    if (flags2 & 256) {
      glyph.instructionLength = p.parseUShort();
      glyph.instructions = [];
      for (var i$6 = 0; i$6 < glyph.instructionLength; i$6 += 1) {
        glyph.instructions.push(p.parseByte());
      }
    }
  }
}
function transformPoints(points, transform) {
  var newPoints = [];
  for (var i2 = 0; i2 < points.length; i2 += 1) {
    var pt = points[i2];
    var newPt = {
      x: transform.xScale * pt.x + transform.scale01 * pt.y + transform.dx,
      y: transform.scale10 * pt.x + transform.yScale * pt.y + transform.dy,
      onCurve: pt.onCurve,
      lastPointOfContour: pt.lastPointOfContour
    };
    newPoints.push(newPt);
  }
  return newPoints;
}
function getContours(points) {
  var contours = [];
  var currentContour = [];
  for (var i2 = 0; i2 < points.length; i2 += 1) {
    var pt = points[i2];
    currentContour.push(pt);
    if (pt.lastPointOfContour) {
      contours.push(currentContour);
      currentContour = [];
    }
  }
  check.argument(currentContour.length === 0, "There are still points left in the current contour.");
  return contours;
}
function getPath(points) {
  var p = new Path();
  if (!points) {
    return p;
  }
  var contours = getContours(points);
  for (var contourIndex = 0; contourIndex < contours.length; ++contourIndex) {
    var contour = contours[contourIndex];
    var prev = null;
    var curr = contour[contour.length - 1];
    var next = contour[0];
    if (curr.onCurve) {
      p.moveTo(curr.x, curr.y);
    } else {
      if (next.onCurve) {
        p.moveTo(next.x, next.y);
      } else {
        var start = { x: (curr.x + next.x) * 0.5, y: (curr.y + next.y) * 0.5 };
        p.moveTo(start.x, start.y);
      }
    }
    for (var i2 = 0; i2 < contour.length; ++i2) {
      prev = curr;
      curr = next;
      next = contour[(i2 + 1) % contour.length];
      if (curr.onCurve) {
        p.lineTo(curr.x, curr.y);
      } else {
        var prev2 = prev;
        var next2 = next;
        if (!prev.onCurve) {
          prev2 = { x: (curr.x + prev.x) * 0.5, y: (curr.y + prev.y) * 0.5 };
        }
        if (!next.onCurve) {
          next2 = { x: (curr.x + next.x) * 0.5, y: (curr.y + next.y) * 0.5 };
        }
        p.quadraticCurveTo(curr.x, curr.y, next2.x, next2.y);
      }
    }
    p.closePath();
  }
  return p;
}
function buildPath(glyphs, glyph) {
  if (glyph.isComposite) {
    for (var j2 = 0; j2 < glyph.components.length; j2 += 1) {
      var component = glyph.components[j2];
      var componentGlyph = glyphs.get(component.glyphIndex);
      componentGlyph.getPath();
      if (componentGlyph.points) {
        var transformedPoints = void 0;
        if (component.matchedPoints === void 0) {
          transformedPoints = transformPoints(componentGlyph.points, component);
        } else {
          if (component.matchedPoints[0] > glyph.points.length - 1 || component.matchedPoints[1] > componentGlyph.points.length - 1) {
            throw Error("Matched points out of range in " + glyph.name);
          }
          var firstPt = glyph.points[component.matchedPoints[0]];
          var secondPt = componentGlyph.points[component.matchedPoints[1]];
          var transform = {
            xScale: component.xScale,
            scale01: component.scale01,
            scale10: component.scale10,
            yScale: component.yScale,
            dx: 0,
            dy: 0
          };
          secondPt = transformPoints([secondPt], transform)[0];
          transform.dx = firstPt.x - secondPt.x;
          transform.dy = firstPt.y - secondPt.y;
          transformedPoints = transformPoints(componentGlyph.points, transform);
        }
        glyph.points = glyph.points.concat(transformedPoints);
      }
    }
  }
  return getPath(glyph.points);
}
function parseGlyfTableAll(data, start, loca2, font) {
  var glyphs = new glyphset.GlyphSet(font);
  for (var i2 = 0; i2 < loca2.length - 1; i2 += 1) {
    var offset = loca2[i2];
    var nextOffset = loca2[i2 + 1];
    if (offset !== nextOffset) {
      glyphs.push(i2, glyphset.ttfGlyphLoader(font, i2, parseGlyph, data, start + offset, buildPath));
    } else {
      glyphs.push(i2, glyphset.glyphLoader(font, i2));
    }
  }
  return glyphs;
}
function parseGlyfTableOnLowMemory(data, start, loca2, font) {
  var glyphs = new glyphset.GlyphSet(font);
  font._push = function(i2) {
    var offset = loca2[i2];
    var nextOffset = loca2[i2 + 1];
    if (offset !== nextOffset) {
      glyphs.push(i2, glyphset.ttfGlyphLoader(font, i2, parseGlyph, data, start + offset, buildPath));
    } else {
      glyphs.push(i2, glyphset.glyphLoader(font, i2));
    }
  };
  return glyphs;
}
function parseGlyfTable(data, start, loca2, font, opt) {
  if (opt.lowMemory) {
    return parseGlyfTableOnLowMemory(data, start, loca2, font);
  } else {
    return parseGlyfTableAll(data, start, loca2, font);
  }
}
function Hinting(font) {
  this.font = font;
  this.getCommands = function(hPoints) {
    return glyf.getPath(hPoints).commands;
  };
  this._fpgmState = this._prepState = void 0;
  this._errorState = 0;
}
function roundOff(v) {
  return v;
}
function roundToGrid(v) {
  return Math.sign(v) * Math.round(Math.abs(v));
}
function roundToDoubleGrid(v) {
  return Math.sign(v) * Math.round(Math.abs(v * 2)) / 2;
}
function roundToHalfGrid(v) {
  return Math.sign(v) * (Math.round(Math.abs(v) + 0.5) - 0.5);
}
function roundUpToGrid(v) {
  return Math.sign(v) * Math.ceil(Math.abs(v));
}
function roundDownToGrid(v) {
  return Math.sign(v) * Math.floor(Math.abs(v));
}
function UnitVector(x2, y) {
  this.x = x2;
  this.y = y;
  this.axis = void 0;
  this.slope = y / x2;
  this.normalSlope = -x2 / y;
  Object.freeze(this);
}
function getUnitVector(x2, y) {
  var d = Math.sqrt(x2 * x2 + y * y);
  x2 /= d;
  y /= d;
  if (x2 === 1 && y === 0) {
    return xUnitVector;
  } else if (x2 === 0 && y === 1) {
    return yUnitVector;
  } else {
    return new UnitVector(x2, y);
  }
}
function HPoint(x2, y, lastPointOfContour, onCurve) {
  this.x = this.xo = Math.round(x2 * 64) / 64;
  this.y = this.yo = Math.round(y * 64) / 64;
  this.lastPointOfContour = lastPointOfContour;
  this.onCurve = onCurve;
  this.prevPointOnContour = void 0;
  this.nextPointOnContour = void 0;
  this.xTouched = false;
  this.yTouched = false;
  Object.preventExtensions(this);
}
function State(env, prog) {
  this.env = env;
  this.stack = [];
  this.prog = prog;
  switch (env) {
    case "glyf":
      this.zp0 = this.zp1 = this.zp2 = 1;
      this.rp0 = this.rp1 = this.rp2 = 0;
    case "prep":
      this.fv = this.pv = this.dpv = xUnitVector;
      this.round = roundToGrid;
  }
}
function initTZone(state) {
  var tZone = state.tZone = new Array(state.gZone.length);
  for (var i2 = 0; i2 < tZone.length; i2++) {
    tZone[i2] = new HPoint(0, 0);
  }
}
function skip(state, handleElse) {
  var prog = state.prog;
  var ip = state.ip;
  var nesting = 1;
  var ins;
  do {
    ins = prog[++ip];
    if (ins === 88) {
      nesting++;
    } else if (ins === 89) {
      nesting--;
    } else if (ins === 64) {
      ip += prog[ip + 1] + 1;
    } else if (ins === 65) {
      ip += 2 * prog[ip + 1] + 1;
    } else if (ins >= 176 && ins <= 183) {
      ip += ins - 176 + 1;
    } else if (ins >= 184 && ins <= 191) {
      ip += (ins - 184 + 1) * 2;
    } else if (handleElse && nesting === 1 && ins === 27) {
      break;
    }
  } while (nesting > 0);
  state.ip = ip;
}
function SVTCA(v, state) {
  if (exports.DEBUG) {
    console.log(state.step, "SVTCA[" + v.axis + "]");
  }
  state.fv = state.pv = state.dpv = v;
}
function SPVTCA(v, state) {
  if (exports.DEBUG) {
    console.log(state.step, "SPVTCA[" + v.axis + "]");
  }
  state.pv = state.dpv = v;
}
function SFVTCA(v, state) {
  if (exports.DEBUG) {
    console.log(state.step, "SFVTCA[" + v.axis + "]");
  }
  state.fv = v;
}
function SPVTL(a, state) {
  var stack = state.stack;
  var p2i = stack.pop();
  var p1i = stack.pop();
  var p2 = state.z2[p2i];
  var p1 = state.z1[p1i];
  if (exports.DEBUG) {
    console.log("SPVTL[" + a + "]", p2i, p1i);
  }
  var dx;
  var dy;
  if (!a) {
    dx = p1.x - p2.x;
    dy = p1.y - p2.y;
  } else {
    dx = p2.y - p1.y;
    dy = p1.x - p2.x;
  }
  state.pv = state.dpv = getUnitVector(dx, dy);
}
function SFVTL(a, state) {
  var stack = state.stack;
  var p2i = stack.pop();
  var p1i = stack.pop();
  var p2 = state.z2[p2i];
  var p1 = state.z1[p1i];
  if (exports.DEBUG) {
    console.log("SFVTL[" + a + "]", p2i, p1i);
  }
  var dx;
  var dy;
  if (!a) {
    dx = p1.x - p2.x;
    dy = p1.y - p2.y;
  } else {
    dx = p2.y - p1.y;
    dy = p1.x - p2.x;
  }
  state.fv = getUnitVector(dx, dy);
}
function SPVFS(state) {
  var stack = state.stack;
  var y = stack.pop();
  var x2 = stack.pop();
  if (exports.DEBUG) {
    console.log(state.step, "SPVFS[]", y, x2);
  }
  state.pv = state.dpv = getUnitVector(x2, y);
}
function SFVFS(state) {
  var stack = state.stack;
  var y = stack.pop();
  var x2 = stack.pop();
  if (exports.DEBUG) {
    console.log(state.step, "SPVFS[]", y, x2);
  }
  state.fv = getUnitVector(x2, y);
}
function GPV(state) {
  var stack = state.stack;
  var pv = state.pv;
  if (exports.DEBUG) {
    console.log(state.step, "GPV[]");
  }
  stack.push(pv.x * 16384);
  stack.push(pv.y * 16384);
}
function GFV(state) {
  var stack = state.stack;
  var fv = state.fv;
  if (exports.DEBUG) {
    console.log(state.step, "GFV[]");
  }
  stack.push(fv.x * 16384);
  stack.push(fv.y * 16384);
}
function SFVTPV(state) {
  state.fv = state.pv;
  if (exports.DEBUG) {
    console.log(state.step, "SFVTPV[]");
  }
}
function ISECT(state) {
  var stack = state.stack;
  var pa0i = stack.pop();
  var pa1i = stack.pop();
  var pb0i = stack.pop();
  var pb1i = stack.pop();
  var pi = stack.pop();
  var z02 = state.z0;
  var z1 = state.z1;
  var pa0 = z02[pa0i];
  var pa1 = z02[pa1i];
  var pb0 = z1[pb0i];
  var pb1 = z1[pb1i];
  var p = state.z2[pi];
  if (exports.DEBUG) {
    console.log("ISECT[], ", pa0i, pa1i, pb0i, pb1i, pi);
  }
  var x1 = pa0.x;
  var y1 = pa0.y;
  var x2 = pa1.x;
  var y2 = pa1.y;
  var x3 = pb0.x;
  var y3 = pb0.y;
  var x4 = pb1.x;
  var y4 = pb1.y;
  var div = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
  var f1 = x1 * y2 - y1 * x2;
  var f2 = x3 * y4 - y3 * x4;
  p.x = (f1 * (x3 - x4) - f2 * (x1 - x2)) / div;
  p.y = (f1 * (y3 - y4) - f2 * (y1 - y2)) / div;
}
function SRP0(state) {
  state.rp0 = state.stack.pop();
  if (exports.DEBUG) {
    console.log(state.step, "SRP0[]", state.rp0);
  }
}
function SRP1(state) {
  state.rp1 = state.stack.pop();
  if (exports.DEBUG) {
    console.log(state.step, "SRP1[]", state.rp1);
  }
}
function SRP2(state) {
  state.rp2 = state.stack.pop();
  if (exports.DEBUG) {
    console.log(state.step, "SRP2[]", state.rp2);
  }
}
function SZP0(state) {
  var n = state.stack.pop();
  if (exports.DEBUG) {
    console.log(state.step, "SZP0[]", n);
  }
  state.zp0 = n;
  switch (n) {
    case 0:
      if (!state.tZone) {
        initTZone(state);
      }
      state.z0 = state.tZone;
      break;
    case 1:
      state.z0 = state.gZone;
      break;
    default:
      throw new Error("Invalid zone pointer");
  }
}
function SZP1(state) {
  var n = state.stack.pop();
  if (exports.DEBUG) {
    console.log(state.step, "SZP1[]", n);
  }
  state.zp1 = n;
  switch (n) {
    case 0:
      if (!state.tZone) {
        initTZone(state);
      }
      state.z1 = state.tZone;
      break;
    case 1:
      state.z1 = state.gZone;
      break;
    default:
      throw new Error("Invalid zone pointer");
  }
}
function SZP2(state) {
  var n = state.stack.pop();
  if (exports.DEBUG) {
    console.log(state.step, "SZP2[]", n);
  }
  state.zp2 = n;
  switch (n) {
    case 0:
      if (!state.tZone) {
        initTZone(state);
      }
      state.z2 = state.tZone;
      break;
    case 1:
      state.z2 = state.gZone;
      break;
    default:
      throw new Error("Invalid zone pointer");
  }
}
function SZPS(state) {
  var n = state.stack.pop();
  if (exports.DEBUG) {
    console.log(state.step, "SZPS[]", n);
  }
  state.zp0 = state.zp1 = state.zp2 = n;
  switch (n) {
    case 0:
      if (!state.tZone) {
        initTZone(state);
      }
      state.z0 = state.z1 = state.z2 = state.tZone;
      break;
    case 1:
      state.z0 = state.z1 = state.z2 = state.gZone;
      break;
    default:
      throw new Error("Invalid zone pointer");
  }
}
function SLOOP(state) {
  state.loop = state.stack.pop();
  if (exports.DEBUG) {
    console.log(state.step, "SLOOP[]", state.loop);
  }
}
function RTG(state) {
  if (exports.DEBUG) {
    console.log(state.step, "RTG[]");
  }
  state.round = roundToGrid;
}
function RTHG(state) {
  if (exports.DEBUG) {
    console.log(state.step, "RTHG[]");
  }
  state.round = roundToHalfGrid;
}
function SMD(state) {
  var d = state.stack.pop();
  if (exports.DEBUG) {
    console.log(state.step, "SMD[]", d);
  }
  state.minDis = d / 64;
}
function ELSE(state) {
  if (exports.DEBUG) {
    console.log(state.step, "ELSE[]");
  }
  skip(state, false);
}
function JMPR(state) {
  var o = state.stack.pop();
  if (exports.DEBUG) {
    console.log(state.step, "JMPR[]", o);
  }
  state.ip += o - 1;
}
function SCVTCI(state) {
  var n = state.stack.pop();
  if (exports.DEBUG) {
    console.log(state.step, "SCVTCI[]", n);
  }
  state.cvCutIn = n / 64;
}
function DUP(state) {
  var stack = state.stack;
  if (exports.DEBUG) {
    console.log(state.step, "DUP[]");
  }
  stack.push(stack[stack.length - 1]);
}
function POP(state) {
  if (exports.DEBUG) {
    console.log(state.step, "POP[]");
  }
  state.stack.pop();
}
function CLEAR(state) {
  if (exports.DEBUG) {
    console.log(state.step, "CLEAR[]");
  }
  state.stack.length = 0;
}
function SWAP(state) {
  var stack = state.stack;
  var a = stack.pop();
  var b = stack.pop();
  if (exports.DEBUG) {
    console.log(state.step, "SWAP[]");
  }
  stack.push(a);
  stack.push(b);
}
function DEPTH(state) {
  var stack = state.stack;
  if (exports.DEBUG) {
    console.log(state.step, "DEPTH[]");
  }
  stack.push(stack.length);
}
function LOOPCALL(state) {
  var stack = state.stack;
  var fn2 = stack.pop();
  var c2 = stack.pop();
  if (exports.DEBUG) {
    console.log(state.step, "LOOPCALL[]", fn2, c2);
  }
  var cip = state.ip;
  var cprog = state.prog;
  state.prog = state.funcs[fn2];
  for (var i2 = 0; i2 < c2; i2++) {
    exec(state);
    if (exports.DEBUG) {
      console.log(
        ++state.step,
        i2 + 1 < c2 ? "next loopcall" : "done loopcall",
        i2
      );
    }
  }
  state.ip = cip;
  state.prog = cprog;
}
function CALL(state) {
  var fn2 = state.stack.pop();
  if (exports.DEBUG) {
    console.log(state.step, "CALL[]", fn2);
  }
  var cip = state.ip;
  var cprog = state.prog;
  state.prog = state.funcs[fn2];
  exec(state);
  state.ip = cip;
  state.prog = cprog;
  if (exports.DEBUG) {
    console.log(++state.step, "returning from", fn2);
  }
}
function CINDEX(state) {
  var stack = state.stack;
  var k = stack.pop();
  if (exports.DEBUG) {
    console.log(state.step, "CINDEX[]", k);
  }
  stack.push(stack[stack.length - k]);
}
function MINDEX(state) {
  var stack = state.stack;
  var k = stack.pop();
  if (exports.DEBUG) {
    console.log(state.step, "MINDEX[]", k);
  }
  stack.push(stack.splice(stack.length - k, 1)[0]);
}
function FDEF(state) {
  if (state.env !== "fpgm") {
    throw new Error("FDEF not allowed here");
  }
  var stack = state.stack;
  var prog = state.prog;
  var ip = state.ip;
  var fn2 = stack.pop();
  var ipBegin = ip;
  if (exports.DEBUG) {
    console.log(state.step, "FDEF[]", fn2);
  }
  while (prog[++ip] !== 45) {
  }
  state.ip = ip;
  state.funcs[fn2] = prog.slice(ipBegin + 1, ip);
}
function MDAP(round, state) {
  var pi = state.stack.pop();
  var p = state.z0[pi];
  var fv = state.fv;
  var pv = state.pv;
  if (exports.DEBUG) {
    console.log(state.step, "MDAP[" + round + "]", pi);
  }
  var d = pv.distance(p, HPZero);
  if (round) {
    d = state.round(d);
  }
  fv.setRelative(p, HPZero, d, pv);
  fv.touch(p);
  state.rp0 = state.rp1 = pi;
}
function IUP(v, state) {
  var z2 = state.z2;
  var pLen = z2.length - 2;
  var cp;
  var pp;
  var np;
  if (exports.DEBUG) {
    console.log(state.step, "IUP[" + v.axis + "]");
  }
  for (var i2 = 0; i2 < pLen; i2++) {
    cp = z2[i2];
    if (v.touched(cp)) {
      continue;
    }
    pp = cp.prevTouched(v);
    if (pp === cp) {
      continue;
    }
    np = cp.nextTouched(v);
    if (pp === np) {
      v.setRelative(cp, cp, v.distance(pp, pp, false, true), v, true);
    }
    v.interpolate(cp, pp, np, v);
  }
}
function SHP(a, state) {
  var stack = state.stack;
  var rpi = a ? state.rp1 : state.rp2;
  var rp = (a ? state.z0 : state.z1)[rpi];
  var fv = state.fv;
  var pv = state.pv;
  var loop = state.loop;
  var z2 = state.z2;
  while (loop--) {
    var pi = stack.pop();
    var p = z2[pi];
    var d = pv.distance(rp, rp, false, true);
    fv.setRelative(p, p, d, pv);
    fv.touch(p);
    if (exports.DEBUG) {
      console.log(
        state.step,
        (state.loop > 1 ? "loop " + (state.loop - loop) + ": " : "") + "SHP[" + (a ? "rp1" : "rp2") + "]",
        pi
      );
    }
  }
  state.loop = 1;
}
function SHC(a, state) {
  var stack = state.stack;
  var rpi = a ? state.rp1 : state.rp2;
  var rp = (a ? state.z0 : state.z1)[rpi];
  var fv = state.fv;
  var pv = state.pv;
  var ci = stack.pop();
  var sp = state.z2[state.contours[ci]];
  var p = sp;
  if (exports.DEBUG) {
    console.log(state.step, "SHC[" + a + "]", ci);
  }
  var d = pv.distance(rp, rp, false, true);
  do {
    if (p !== rp) {
      fv.setRelative(p, p, d, pv);
    }
    p = p.nextPointOnContour;
  } while (p !== sp);
}
function SHZ(a, state) {
  var stack = state.stack;
  var rpi = a ? state.rp1 : state.rp2;
  var rp = (a ? state.z0 : state.z1)[rpi];
  var fv = state.fv;
  var pv = state.pv;
  var e = stack.pop();
  if (exports.DEBUG) {
    console.log(state.step, "SHZ[" + a + "]", e);
  }
  var z;
  switch (e) {
    case 0:
      z = state.tZone;
      break;
    case 1:
      z = state.gZone;
      break;
    default:
      throw new Error("Invalid zone");
  }
  var p;
  var d = pv.distance(rp, rp, false, true);
  var pLen = z.length - 2;
  for (var i2 = 0; i2 < pLen; i2++) {
    p = z[i2];
    fv.setRelative(p, p, d, pv);
  }
}
function SHPIX(state) {
  var stack = state.stack;
  var loop = state.loop;
  var fv = state.fv;
  var d = stack.pop() / 64;
  var z2 = state.z2;
  while (loop--) {
    var pi = stack.pop();
    var p = z2[pi];
    if (exports.DEBUG) {
      console.log(
        state.step,
        (state.loop > 1 ? "loop " + (state.loop - loop) + ": " : "") + "SHPIX[]",
        pi,
        d
      );
    }
    fv.setRelative(p, p, d);
    fv.touch(p);
  }
  state.loop = 1;
}
function IP(state) {
  var stack = state.stack;
  var rp1i = state.rp1;
  var rp2i = state.rp2;
  var loop = state.loop;
  var rp1 = state.z0[rp1i];
  var rp2 = state.z1[rp2i];
  var fv = state.fv;
  var pv = state.dpv;
  var z2 = state.z2;
  while (loop--) {
    var pi = stack.pop();
    var p = z2[pi];
    if (exports.DEBUG) {
      console.log(
        state.step,
        (state.loop > 1 ? "loop " + (state.loop - loop) + ": " : "") + "IP[]",
        pi,
        rp1i,
        "<->",
        rp2i
      );
    }
    fv.interpolate(p, rp1, rp2, pv);
    fv.touch(p);
  }
  state.loop = 1;
}
function MSIRP(a, state) {
  var stack = state.stack;
  var d = stack.pop() / 64;
  var pi = stack.pop();
  var p = state.z1[pi];
  var rp0 = state.z0[state.rp0];
  var fv = state.fv;
  var pv = state.pv;
  fv.setRelative(p, rp0, d, pv);
  fv.touch(p);
  if (exports.DEBUG) {
    console.log(state.step, "MSIRP[" + a + "]", d, pi);
  }
  state.rp1 = state.rp0;
  state.rp2 = pi;
  if (a) {
    state.rp0 = pi;
  }
}
function ALIGNRP(state) {
  var stack = state.stack;
  var rp0i = state.rp0;
  var rp0 = state.z0[rp0i];
  var loop = state.loop;
  var fv = state.fv;
  var pv = state.pv;
  var z1 = state.z1;
  while (loop--) {
    var pi = stack.pop();
    var p = z1[pi];
    if (exports.DEBUG) {
      console.log(
        state.step,
        (state.loop > 1 ? "loop " + (state.loop - loop) + ": " : "") + "ALIGNRP[]",
        pi
      );
    }
    fv.setRelative(p, rp0, 0, pv);
    fv.touch(p);
  }
  state.loop = 1;
}
function RTDG(state) {
  if (exports.DEBUG) {
    console.log(state.step, "RTDG[]");
  }
  state.round = roundToDoubleGrid;
}
function MIAP(round, state) {
  var stack = state.stack;
  var n = stack.pop();
  var pi = stack.pop();
  var p = state.z0[pi];
  var fv = state.fv;
  var pv = state.pv;
  var cv = state.cvt[n];
  if (exports.DEBUG) {
    console.log(
      state.step,
      "MIAP[" + round + "]",
      n,
      "(",
      cv,
      ")",
      pi
    );
  }
  var d = pv.distance(p, HPZero);
  if (round) {
    if (Math.abs(d - cv) < state.cvCutIn) {
      d = cv;
    }
    d = state.round(d);
  }
  fv.setRelative(p, HPZero, d, pv);
  if (state.zp0 === 0) {
    p.xo = p.x;
    p.yo = p.y;
  }
  fv.touch(p);
  state.rp0 = state.rp1 = pi;
}
function NPUSHB(state) {
  var prog = state.prog;
  var ip = state.ip;
  var stack = state.stack;
  var n = prog[++ip];
  if (exports.DEBUG) {
    console.log(state.step, "NPUSHB[]", n);
  }
  for (var i2 = 0; i2 < n; i2++) {
    stack.push(prog[++ip]);
  }
  state.ip = ip;
}
function NPUSHW(state) {
  var ip = state.ip;
  var prog = state.prog;
  var stack = state.stack;
  var n = prog[++ip];
  if (exports.DEBUG) {
    console.log(state.step, "NPUSHW[]", n);
  }
  for (var i2 = 0; i2 < n; i2++) {
    var w = prog[++ip] << 8 | prog[++ip];
    if (w & 32768) {
      w = -((w ^ 65535) + 1);
    }
    stack.push(w);
  }
  state.ip = ip;
}
function WS(state) {
  var stack = state.stack;
  var store = state.store;
  if (!store) {
    store = state.store = [];
  }
  var v = stack.pop();
  var l = stack.pop();
  if (exports.DEBUG) {
    console.log(state.step, "WS", v, l);
  }
  store[l] = v;
}
function RS(state) {
  var stack = state.stack;
  var store = state.store;
  var l = stack.pop();
  if (exports.DEBUG) {
    console.log(state.step, "RS", l);
  }
  var v = store && store[l] || 0;
  stack.push(v);
}
function WCVTP(state) {
  var stack = state.stack;
  var v = stack.pop();
  var l = stack.pop();
  if (exports.DEBUG) {
    console.log(state.step, "WCVTP", v, l);
  }
  state.cvt[l] = v / 64;
}
function RCVT(state) {
  var stack = state.stack;
  var cvte = stack.pop();
  if (exports.DEBUG) {
    console.log(state.step, "RCVT", cvte);
  }
  stack.push(state.cvt[cvte] * 64);
}
function GC(a, state) {
  var stack = state.stack;
  var pi = stack.pop();
  var p = state.z2[pi];
  if (exports.DEBUG) {
    console.log(state.step, "GC[" + a + "]", pi);
  }
  stack.push(state.dpv.distance(p, HPZero, a, false) * 64);
}
function MD(a, state) {
  var stack = state.stack;
  var pi2 = stack.pop();
  var pi1 = stack.pop();
  var p2 = state.z1[pi2];
  var p1 = state.z0[pi1];
  var d = state.dpv.distance(p1, p2, a, a);
  if (exports.DEBUG) {
    console.log(state.step, "MD[" + a + "]", pi2, pi1, "->", d);
  }
  state.stack.push(Math.round(d * 64));
}
function MPPEM(state) {
  if (exports.DEBUG) {
    console.log(state.step, "MPPEM[]");
  }
  state.stack.push(state.ppem);
}
function FLIPON(state) {
  if (exports.DEBUG) {
    console.log(state.step, "FLIPON[]");
  }
  state.autoFlip = true;
}
function LT(state) {
  var stack = state.stack;
  var e2 = stack.pop();
  var e1 = stack.pop();
  if (exports.DEBUG) {
    console.log(state.step, "LT[]", e2, e1);
  }
  stack.push(e1 < e2 ? 1 : 0);
}
function LTEQ(state) {
  var stack = state.stack;
  var e2 = stack.pop();
  var e1 = stack.pop();
  if (exports.DEBUG) {
    console.log(state.step, "LTEQ[]", e2, e1);
  }
  stack.push(e1 <= e2 ? 1 : 0);
}
function GT(state) {
  var stack = state.stack;
  var e2 = stack.pop();
  var e1 = stack.pop();
  if (exports.DEBUG) {
    console.log(state.step, "GT[]", e2, e1);
  }
  stack.push(e1 > e2 ? 1 : 0);
}
function GTEQ(state) {
  var stack = state.stack;
  var e2 = stack.pop();
  var e1 = stack.pop();
  if (exports.DEBUG) {
    console.log(state.step, "GTEQ[]", e2, e1);
  }
  stack.push(e1 >= e2 ? 1 : 0);
}
function EQ(state) {
  var stack = state.stack;
  var e2 = stack.pop();
  var e1 = stack.pop();
  if (exports.DEBUG) {
    console.log(state.step, "EQ[]", e2, e1);
  }
  stack.push(e2 === e1 ? 1 : 0);
}
function NEQ(state) {
  var stack = state.stack;
  var e2 = stack.pop();
  var e1 = stack.pop();
  if (exports.DEBUG) {
    console.log(state.step, "NEQ[]", e2, e1);
  }
  stack.push(e2 !== e1 ? 1 : 0);
}
function ODD(state) {
  var stack = state.stack;
  var n = stack.pop();
  if (exports.DEBUG) {
    console.log(state.step, "ODD[]", n);
  }
  stack.push(Math.trunc(n) % 2 ? 1 : 0);
}
function EVEN(state) {
  var stack = state.stack;
  var n = stack.pop();
  if (exports.DEBUG) {
    console.log(state.step, "EVEN[]", n);
  }
  stack.push(Math.trunc(n) % 2 ? 0 : 1);
}
function IF(state) {
  var test = state.stack.pop();
  if (exports.DEBUG) {
    console.log(state.step, "IF[]", test);
  }
  if (!test) {
    skip(state, true);
    if (exports.DEBUG) {
      console.log(state.step, "EIF[]");
    }
  }
}
function EIF(state) {
  if (exports.DEBUG) {
    console.log(state.step, "EIF[]");
  }
}
function AND(state) {
  var stack = state.stack;
  var e2 = stack.pop();
  var e1 = stack.pop();
  if (exports.DEBUG) {
    console.log(state.step, "AND[]", e2, e1);
  }
  stack.push(e2 && e1 ? 1 : 0);
}
function OR(state) {
  var stack = state.stack;
  var e2 = stack.pop();
  var e1 = stack.pop();
  if (exports.DEBUG) {
    console.log(state.step, "OR[]", e2, e1);
  }
  stack.push(e2 || e1 ? 1 : 0);
}
function NOT(state) {
  var stack = state.stack;
  var e = stack.pop();
  if (exports.DEBUG) {
    console.log(state.step, "NOT[]", e);
  }
  stack.push(e ? 0 : 1);
}
function DELTAP123(b, state) {
  var stack = state.stack;
  var n = stack.pop();
  var fv = state.fv;
  var pv = state.pv;
  var ppem = state.ppem;
  var base = state.deltaBase + (b - 1) * 16;
  var ds = state.deltaShift;
  var z02 = state.z0;
  if (exports.DEBUG) {
    console.log(state.step, "DELTAP[" + b + "]", n, stack);
  }
  for (var i2 = 0; i2 < n; i2++) {
    var pi = stack.pop();
    var arg = stack.pop();
    var appem = base + ((arg & 240) >> 4);
    if (appem !== ppem) {
      continue;
    }
    var mag = (arg & 15) - 8;
    if (mag >= 0) {
      mag++;
    }
    if (exports.DEBUG) {
      console.log(state.step, "DELTAPFIX", pi, "by", mag * ds);
    }
    var p = z02[pi];
    fv.setRelative(p, p, mag * ds, pv);
  }
}
function SDB(state) {
  var stack = state.stack;
  var n = stack.pop();
  if (exports.DEBUG) {
    console.log(state.step, "SDB[]", n);
  }
  state.deltaBase = n;
}
function SDS(state) {
  var stack = state.stack;
  var n = stack.pop();
  if (exports.DEBUG) {
    console.log(state.step, "SDS[]", n);
  }
  state.deltaShift = Math.pow(0.5, n);
}
function ADD(state) {
  var stack = state.stack;
  var n2 = stack.pop();
  var n1 = stack.pop();
  if (exports.DEBUG) {
    console.log(state.step, "ADD[]", n2, n1);
  }
  stack.push(n1 + n2);
}
function SUB(state) {
  var stack = state.stack;
  var n2 = stack.pop();
  var n1 = stack.pop();
  if (exports.DEBUG) {
    console.log(state.step, "SUB[]", n2, n1);
  }
  stack.push(n1 - n2);
}
function DIV(state) {
  var stack = state.stack;
  var n2 = stack.pop();
  var n1 = stack.pop();
  if (exports.DEBUG) {
    console.log(state.step, "DIV[]", n2, n1);
  }
  stack.push(n1 * 64 / n2);
}
function MUL(state) {
  var stack = state.stack;
  var n2 = stack.pop();
  var n1 = stack.pop();
  if (exports.DEBUG) {
    console.log(state.step, "MUL[]", n2, n1);
  }
  stack.push(n1 * n2 / 64);
}
function ABS(state) {
  var stack = state.stack;
  var n = stack.pop();
  if (exports.DEBUG) {
    console.log(state.step, "ABS[]", n);
  }
  stack.push(Math.abs(n));
}
function NEG(state) {
  var stack = state.stack;
  var n = stack.pop();
  if (exports.DEBUG) {
    console.log(state.step, "NEG[]", n);
  }
  stack.push(-n);
}
function FLOOR(state) {
  var stack = state.stack;
  var n = stack.pop();
  if (exports.DEBUG) {
    console.log(state.step, "FLOOR[]", n);
  }
  stack.push(Math.floor(n / 64) * 64);
}
function CEILING(state) {
  var stack = state.stack;
  var n = stack.pop();
  if (exports.DEBUG) {
    console.log(state.step, "CEILING[]", n);
  }
  stack.push(Math.ceil(n / 64) * 64);
}
function ROUND(dt2, state) {
  var stack = state.stack;
  var n = stack.pop();
  if (exports.DEBUG) {
    console.log(state.step, "ROUND[]");
  }
  stack.push(state.round(n / 64) * 64);
}
function WCVTF(state) {
  var stack = state.stack;
  var v = stack.pop();
  var l = stack.pop();
  if (exports.DEBUG) {
    console.log(state.step, "WCVTF[]", v, l);
  }
  state.cvt[l] = v * state.ppem / state.font.unitsPerEm;
}
function DELTAC123(b, state) {
  var stack = state.stack;
  var n = stack.pop();
  var ppem = state.ppem;
  var base = state.deltaBase + (b - 1) * 16;
  var ds = state.deltaShift;
  if (exports.DEBUG) {
    console.log(state.step, "DELTAC[" + b + "]", n, stack);
  }
  for (var i2 = 0; i2 < n; i2++) {
    var c2 = stack.pop();
    var arg = stack.pop();
    var appem = base + ((arg & 240) >> 4);
    if (appem !== ppem) {
      continue;
    }
    var mag = (arg & 15) - 8;
    if (mag >= 0) {
      mag++;
    }
    var delta = mag * ds;
    if (exports.DEBUG) {
      console.log(state.step, "DELTACFIX", c2, "by", delta);
    }
    state.cvt[c2] += delta;
  }
}
function SROUND(state) {
  var n = state.stack.pop();
  if (exports.DEBUG) {
    console.log(state.step, "SROUND[]", n);
  }
  state.round = roundSuper;
  var period;
  switch (n & 192) {
    case 0:
      period = 0.5;
      break;
    case 64:
      period = 1;
      break;
    case 128:
      period = 2;
      break;
    default:
      throw new Error("invalid SROUND value");
  }
  state.srPeriod = period;
  switch (n & 48) {
    case 0:
      state.srPhase = 0;
      break;
    case 16:
      state.srPhase = 0.25 * period;
      break;
    case 32:
      state.srPhase = 0.5 * period;
      break;
    case 48:
      state.srPhase = 0.75 * period;
      break;
    default:
      throw new Error("invalid SROUND value");
  }
  n &= 15;
  if (n === 0) {
    state.srThreshold = 0;
  } else {
    state.srThreshold = (n / 8 - 0.5) * period;
  }
}
function S45ROUND(state) {
  var n = state.stack.pop();
  if (exports.DEBUG) {
    console.log(state.step, "S45ROUND[]", n);
  }
  state.round = roundSuper;
  var period;
  switch (n & 192) {
    case 0:
      period = Math.sqrt(2) / 2;
      break;
    case 64:
      period = Math.sqrt(2);
      break;
    case 128:
      period = 2 * Math.sqrt(2);
      break;
    default:
      throw new Error("invalid S45ROUND value");
  }
  state.srPeriod = period;
  switch (n & 48) {
    case 0:
      state.srPhase = 0;
      break;
    case 16:
      state.srPhase = 0.25 * period;
      break;
    case 32:
      state.srPhase = 0.5 * period;
      break;
    case 48:
      state.srPhase = 0.75 * period;
      break;
    default:
      throw new Error("invalid S45ROUND value");
  }
  n &= 15;
  if (n === 0) {
    state.srThreshold = 0;
  } else {
    state.srThreshold = (n / 8 - 0.5) * period;
  }
}
function ROFF(state) {
  if (exports.DEBUG) {
    console.log(state.step, "ROFF[]");
  }
  state.round = roundOff;
}
function RUTG(state) {
  if (exports.DEBUG) {
    console.log(state.step, "RUTG[]");
  }
  state.round = roundUpToGrid;
}
function RDTG(state) {
  if (exports.DEBUG) {
    console.log(state.step, "RDTG[]");
  }
  state.round = roundDownToGrid;
}
function SCANCTRL(state) {
  var n = state.stack.pop();
  if (exports.DEBUG) {
    console.log(state.step, "SCANCTRL[]", n);
  }
}
function SDPVTL(a, state) {
  var stack = state.stack;
  var p2i = stack.pop();
  var p1i = stack.pop();
  var p2 = state.z2[p2i];
  var p1 = state.z1[p1i];
  if (exports.DEBUG) {
    console.log(state.step, "SDPVTL[" + a + "]", p2i, p1i);
  }
  var dx;
  var dy;
  if (!a) {
    dx = p1.x - p2.x;
    dy = p1.y - p2.y;
  } else {
    dx = p2.y - p1.y;
    dy = p1.x - p2.x;
  }
  state.dpv = getUnitVector(dx, dy);
}
function GETINFO(state) {
  var stack = state.stack;
  var sel = stack.pop();
  var r = 0;
  if (exports.DEBUG) {
    console.log(state.step, "GETINFO[]", sel);
  }
  if (sel & 1) {
    r = 35;
  }
  if (sel & 32) {
    r |= 4096;
  }
  stack.push(r);
}
function ROLL(state) {
  var stack = state.stack;
  var a = stack.pop();
  var b = stack.pop();
  var c2 = stack.pop();
  if (exports.DEBUG) {
    console.log(state.step, "ROLL[]");
  }
  stack.push(b);
  stack.push(a);
  stack.push(c2);
}
function MAX(state) {
  var stack = state.stack;
  var e2 = stack.pop();
  var e1 = stack.pop();
  if (exports.DEBUG) {
    console.log(state.step, "MAX[]", e2, e1);
  }
  stack.push(Math.max(e1, e2));
}
function MIN(state) {
  var stack = state.stack;
  var e2 = stack.pop();
  var e1 = stack.pop();
  if (exports.DEBUG) {
    console.log(state.step, "MIN[]", e2, e1);
  }
  stack.push(Math.min(e1, e2));
}
function SCANTYPE(state) {
  var n = state.stack.pop();
  if (exports.DEBUG) {
    console.log(state.step, "SCANTYPE[]", n);
  }
}
function INSTCTRL(state) {
  var s = state.stack.pop();
  var v = state.stack.pop();
  if (exports.DEBUG) {
    console.log(state.step, "INSTCTRL[]", s, v);
  }
  switch (s) {
    case 1:
      state.inhibitGridFit = !!v;
      return;
    case 2:
      state.ignoreCvt = !!v;
      return;
    default:
      throw new Error("invalid INSTCTRL[] selector");
  }
}
function PUSHB(n, state) {
  var stack = state.stack;
  var prog = state.prog;
  var ip = state.ip;
  if (exports.DEBUG) {
    console.log(state.step, "PUSHB[" + n + "]");
  }
  for (var i2 = 0; i2 < n; i2++) {
    stack.push(prog[++ip]);
  }
  state.ip = ip;
}
function PUSHW(n, state) {
  var ip = state.ip;
  var prog = state.prog;
  var stack = state.stack;
  if (exports.DEBUG) {
    console.log(state.ip, "PUSHW[" + n + "]");
  }
  for (var i2 = 0; i2 < n; i2++) {
    var w = prog[++ip] << 8 | prog[++ip];
    if (w & 32768) {
      w = -((w ^ 65535) + 1);
    }
    stack.push(w);
  }
  state.ip = ip;
}
function MDRP_MIRP(indirect, setRp0, keepD, ro2, dt2, state) {
  var stack = state.stack;
  var cvte = indirect && stack.pop();
  var pi = stack.pop();
  var rp0i = state.rp0;
  var rp = state.z0[rp0i];
  var p = state.z1[pi];
  var md = state.minDis;
  var fv = state.fv;
  var pv = state.dpv;
  var od;
  var d;
  var sign;
  var cv;
  d = od = pv.distance(p, rp, true, true);
  sign = d >= 0 ? 1 : -1;
  d = Math.abs(d);
  if (indirect) {
    cv = state.cvt[cvte];
    if (ro2 && Math.abs(d - cv) < state.cvCutIn) {
      d = cv;
    }
  }
  if (keepD && d < md) {
    d = md;
  }
  if (ro2) {
    d = state.round(d);
  }
  fv.setRelative(p, rp, sign * d, pv);
  fv.touch(p);
  if (exports.DEBUG) {
    console.log(
      state.step,
      (indirect ? "MIRP[" : "MDRP[") + (setRp0 ? "M" : "m") + (keepD ? ">" : "_") + (ro2 ? "R" : "_") + (dt2 === 0 ? "Gr" : dt2 === 1 ? "Bl" : dt2 === 2 ? "Wh" : "") + "]",
      indirect ? cvte + "(" + state.cvt[cvte] + "," + cv + ")" : "",
      pi,
      "(d =",
      od,
      "->",
      sign * d,
      ")"
    );
  }
  state.rp1 = state.rp0;
  state.rp2 = pi;
  if (setRp0) {
    state.rp0 = pi;
  }
}
function Token(char) {
  this.char = char;
  this.state = {};
  this.activeState = null;
}
function ContextRange(startIndex, endOffset, contextName) {
  this.contextName = contextName;
  this.startIndex = startIndex;
  this.endOffset = endOffset;
}
function ContextChecker(contextName, checkStart, checkEnd) {
  this.contextName = contextName;
  this.openRange = null;
  this.ranges = [];
  this.checkStart = checkStart;
  this.checkEnd = checkEnd;
}
function ContextParams(context, currentIndex) {
  this.context = context;
  this.index = currentIndex;
  this.length = context.length;
  this.current = context[currentIndex];
  this.backtrack = context.slice(0, currentIndex);
  this.lookahead = context.slice(currentIndex + 1);
}
function Event(eventId) {
  this.eventId = eventId;
  this.subscribers = [];
}
function initializeCoreEvents(events) {
  var this$1 = this;
  var coreEvents = [
    "start",
    "end",
    "next",
    "newToken",
    "contextStart",
    "contextEnd",
    "insertToken",
    "removeToken",
    "removeRange",
    "replaceToken",
    "replaceRange",
    "composeRUD",
    "updateContextsRanges"
  ];
  coreEvents.forEach(function(eventId) {
    Object.defineProperty(this$1.events, eventId, {
      value: new Event(eventId)
    });
  });
  if (!!events) {
    coreEvents.forEach(function(eventId) {
      var event = events[eventId];
      if (typeof event === "function") {
        this$1.events[eventId].subscribe(event);
      }
    });
  }
  var requiresContextUpdate = [
    "insertToken",
    "removeToken",
    "removeRange",
    "replaceToken",
    "replaceRange",
    "composeRUD"
  ];
  requiresContextUpdate.forEach(function(eventId) {
    this$1.events[eventId].subscribe(
      this$1.updateContextsRanges
    );
  });
}
function Tokenizer(events) {
  this.tokens = [];
  this.registeredContexts = {};
  this.contextCheckers = [];
  this.events = {};
  this.registeredModifiers = [];
  initializeCoreEvents.call(this, events);
}
function isArabicChar(c2) {
  return /[\u0600-\u065F\u066A-\u06D2\u06FA-\u06FF]/.test(c2);
}
function isIsolatedArabicChar(char) {
  return /[\u0630\u0690\u0621\u0631\u0661\u0671\u0622\u0632\u0672\u0692\u06C2\u0623\u0673\u0693\u06C3\u0624\u0694\u06C4\u0625\u0675\u0695\u06C5\u06E5\u0676\u0696\u06C6\u0627\u0677\u0697\u06C7\u0648\u0688\u0698\u06C8\u0689\u0699\u06C9\u068A\u06CA\u066B\u068B\u06CB\u068C\u068D\u06CD\u06FD\u068E\u06EE\u06FE\u062F\u068F\u06CF\u06EF]/.test(char);
}
function isTashkeelArabicChar(char) {
  return /[\u0600-\u0605\u060C-\u060E\u0610-\u061B\u061E\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E4\u06E7\u06E8\u06EA-\u06ED]/.test(char);
}
function isLatinChar(c2) {
  return /[A-z]/.test(c2);
}
function isWhiteSpace(c2) {
  return /\s/.test(c2);
}
function FeatureQuery(font) {
  this.font = font;
  this.features = {};
}
function SubstitutionAction(action) {
  this.id = action.id;
  this.tag = action.tag;
  this.substitution = action.substitution;
}
function lookupCoverage(glyphIndex, coverage) {
  if (!glyphIndex) {
    return -1;
  }
  switch (coverage.format) {
    case 1:
      return coverage.glyphs.indexOf(glyphIndex);
    case 2:
      var ranges = coverage.ranges;
      for (var i2 = 0; i2 < ranges.length; i2++) {
        var range = ranges[i2];
        if (glyphIndex >= range.start && glyphIndex <= range.end) {
          var offset = glyphIndex - range.start;
          return range.index + offset;
        }
      }
      break;
    default:
      return -1;
  }
  return -1;
}
function singleSubstitutionFormat1(glyphIndex, subtable) {
  var substituteIndex = lookupCoverage(glyphIndex, subtable.coverage);
  if (substituteIndex === -1) {
    return null;
  }
  return glyphIndex + subtable.deltaGlyphId;
}
function singleSubstitutionFormat2(glyphIndex, subtable) {
  var substituteIndex = lookupCoverage(glyphIndex, subtable.coverage);
  if (substituteIndex === -1) {
    return null;
  }
  return subtable.substitute[substituteIndex];
}
function lookupCoverageList(coverageList, contextParams) {
  var lookupList = [];
  for (var i2 = 0; i2 < coverageList.length; i2++) {
    var coverage = coverageList[i2];
    var glyphIndex = contextParams.current;
    glyphIndex = Array.isArray(glyphIndex) ? glyphIndex[0] : glyphIndex;
    var lookupIndex = lookupCoverage(glyphIndex, coverage);
    if (lookupIndex !== -1) {
      lookupList.push(lookupIndex);
    }
  }
  if (lookupList.length !== coverageList.length) {
    return -1;
  }
  return lookupList;
}
function chainingSubstitutionFormat3(contextParams, subtable) {
  var lookupsCount = subtable.inputCoverage.length + subtable.lookaheadCoverage.length + subtable.backtrackCoverage.length;
  if (contextParams.context.length < lookupsCount) {
    return [];
  }
  var inputLookups = lookupCoverageList(
    subtable.inputCoverage,
    contextParams
  );
  if (inputLookups === -1) {
    return [];
  }
  var lookaheadOffset = subtable.inputCoverage.length - 1;
  if (contextParams.lookahead.length < subtable.lookaheadCoverage.length) {
    return [];
  }
  var lookaheadContext = contextParams.lookahead.slice(lookaheadOffset);
  while (lookaheadContext.length && isTashkeelArabicChar(lookaheadContext[0].char)) {
    lookaheadContext.shift();
  }
  var lookaheadParams = new ContextParams(lookaheadContext, 0);
  var lookaheadLookups = lookupCoverageList(
    subtable.lookaheadCoverage,
    lookaheadParams
  );
  var backtrackContext = [].concat(contextParams.backtrack);
  backtrackContext.reverse();
  while (backtrackContext.length && isTashkeelArabicChar(backtrackContext[0].char)) {
    backtrackContext.shift();
  }
  if (backtrackContext.length < subtable.backtrackCoverage.length) {
    return [];
  }
  var backtrackParams = new ContextParams(backtrackContext, 0);
  var backtrackLookups = lookupCoverageList(
    subtable.backtrackCoverage,
    backtrackParams
  );
  var contextRulesMatch = inputLookups.length === subtable.inputCoverage.length && lookaheadLookups.length === subtable.lookaheadCoverage.length && backtrackLookups.length === subtable.backtrackCoverage.length;
  var substitutions = [];
  if (contextRulesMatch) {
    for (var i2 = 0; i2 < subtable.lookupRecords.length; i2++) {
      var lookupRecord = subtable.lookupRecords[i2];
      var lookupListIndex = lookupRecord.lookupListIndex;
      var lookupTable = this.getLookupByIndex(lookupListIndex);
      for (var s = 0; s < lookupTable.subtables.length; s++) {
        var subtable$1 = lookupTable.subtables[s];
        var lookup = this.getLookupMethod(lookupTable, subtable$1);
        var substitutionType = this.getSubstitutionType(lookupTable, subtable$1);
        if (substitutionType === "12") {
          for (var n = 0; n < inputLookups.length; n++) {
            var glyphIndex = contextParams.get(n);
            var substitution = lookup(glyphIndex);
            if (substitution) {
              substitutions.push(substitution);
            }
          }
        }
      }
    }
  }
  return substitutions;
}
function ligatureSubstitutionFormat1(contextParams, subtable) {
  var glyphIndex = contextParams.current;
  var ligSetIndex = lookupCoverage(glyphIndex, subtable.coverage);
  if (ligSetIndex === -1) {
    return null;
  }
  var ligature;
  var ligatureSet = subtable.ligatureSets[ligSetIndex];
  for (var s = 0; s < ligatureSet.length; s++) {
    ligature = ligatureSet[s];
    for (var l = 0; l < ligature.components.length; l++) {
      var lookaheadItem = contextParams.lookahead[l];
      var component = ligature.components[l];
      if (lookaheadItem !== component) {
        break;
      }
      if (l === ligature.components.length - 1) {
        return ligature;
      }
    }
  }
  return null;
}
function decompositionSubstitutionFormat1(glyphIndex, subtable) {
  var substituteIndex = lookupCoverage(glyphIndex, subtable.coverage);
  if (substituteIndex === -1) {
    return null;
  }
  return subtable.sequences[substituteIndex];
}
function arabicWordStartCheck(contextParams) {
  var char = contextParams.current;
  var prevChar = contextParams.get(-1);
  return (
    // ? arabic first char
    prevChar === null && isArabicChar(char) || // ? arabic char preceded with a non arabic char
    !isArabicChar(prevChar) && isArabicChar(char)
  );
}
function arabicWordEndCheck(contextParams) {
  var nextChar = contextParams.get(1);
  return (
    // ? last arabic char
    nextChar === null || // ? next char is not arabic
    !isArabicChar(nextChar)
  );
}
function arabicSentenceStartCheck(contextParams) {
  var char = contextParams.current;
  var prevChar = contextParams.get(-1);
  return (
    // ? an arabic char preceded with a non arabic char
    (isArabicChar(char) || isTashkeelArabicChar(char)) && !isArabicChar(prevChar)
  );
}
function arabicSentenceEndCheck(contextParams) {
  var nextChar = contextParams.get(1);
  switch (true) {
    case nextChar === null:
      return true;
    case (!isArabicChar(nextChar) && !isTashkeelArabicChar(nextChar)):
      var nextIsWhitespace = isWhiteSpace(nextChar);
      if (!nextIsWhitespace) {
        return true;
      }
      if (nextIsWhitespace) {
        var arabicCharAhead = false;
        arabicCharAhead = contextParams.lookahead.some(
          function(c2) {
            return isArabicChar(c2) || isTashkeelArabicChar(c2);
          }
        );
        if (!arabicCharAhead) {
          return true;
        }
      }
      break;
    default:
      return false;
  }
}
function singleSubstitutionFormat1$1(action, tokens, index) {
  tokens[index].setState(action.tag, action.substitution);
}
function singleSubstitutionFormat2$1(action, tokens, index) {
  tokens[index].setState(action.tag, action.substitution);
}
function chainingSubstitutionFormat3$1(action, tokens, index) {
  action.substitution.forEach(function(subst, offset) {
    var token = tokens[index + offset];
    token.setState(action.tag, subst);
  });
}
function ligatureSubstitutionFormat1$1(action, tokens, index) {
  var token = tokens[index];
  token.setState(action.tag, action.substitution.ligGlyph);
  var compsCount = action.substitution.components.length;
  for (var i2 = 0; i2 < compsCount; i2++) {
    token = tokens[index + i2 + 1];
    token.setState("deleted", true);
  }
}
function applySubstitution(action, tokens, index) {
  if (action instanceof SubstitutionAction && SUBSTITUTIONS[action.id]) {
    SUBSTITUTIONS[action.id](action, tokens, index);
  }
}
function willConnectPrev(charContextParams) {
  var backtrack = [].concat(charContextParams.backtrack);
  for (var i2 = backtrack.length - 1; i2 >= 0; i2--) {
    var prevChar = backtrack[i2];
    var isolated = isIsolatedArabicChar(prevChar);
    var tashkeel = isTashkeelArabicChar(prevChar);
    if (!isolated && !tashkeel) {
      return true;
    }
    if (isolated) {
      return false;
    }
  }
  return false;
}
function willConnectNext(charContextParams) {
  if (isIsolatedArabicChar(charContextParams.current)) {
    return false;
  }
  for (var i2 = 0; i2 < charContextParams.lookahead.length; i2++) {
    var nextChar = charContextParams.lookahead[i2];
    var tashkeel = isTashkeelArabicChar(nextChar);
    if (!tashkeel) {
      return true;
    }
  }
  return false;
}
function arabicPresentationForms(range) {
  var this$1 = this;
  var script = "arab";
  var tags = this.featuresTags[script];
  var tokens = this.tokenizer.getRangeTokens(range);
  if (tokens.length === 1) {
    return;
  }
  var contextParams = new ContextParams(
    tokens.map(
      function(token) {
        return token.getState("glyphIndex");
      }
    ),
    0
  );
  var charContextParams = new ContextParams(
    tokens.map(
      function(token) {
        return token.char;
      }
    ),
    0
  );
  tokens.forEach(function(token, index) {
    if (isTashkeelArabicChar(token.char)) {
      return;
    }
    contextParams.setCurrentIndex(index);
    charContextParams.setCurrentIndex(index);
    var CONNECT = 0;
    if (willConnectPrev(charContextParams)) {
      CONNECT |= 1;
    }
    if (willConnectNext(charContextParams)) {
      CONNECT |= 2;
    }
    var tag;
    switch (CONNECT) {
      case 1:
        tag = "fina";
        break;
      case 2:
        tag = "init";
        break;
      case 3:
        tag = "medi";
        break;
    }
    if (tags.indexOf(tag) === -1) {
      return;
    }
    var substitutions = this$1.query.lookupFeature({
      tag,
      script,
      contextParams
    });
    if (substitutions instanceof Error) {
      return console.info(substitutions.message);
    }
    substitutions.forEach(function(action, index2) {
      if (action instanceof SubstitutionAction) {
        applySubstitution(action, tokens, index2);
        contextParams.context[index2] = action.substitution;
      }
    });
  });
}
function getContextParams(tokens, index) {
  var context = tokens.map(function(token) {
    return token.activeState.value;
  });
  return new ContextParams(context, index || 0);
}
function arabicRequiredLigatures(range) {
  var this$1 = this;
  var script = "arab";
  var tokens = this.tokenizer.getRangeTokens(range);
  var contextParams = getContextParams(tokens);
  contextParams.context.forEach(function(glyphIndex, index) {
    contextParams.setCurrentIndex(index);
    var substitutions = this$1.query.lookupFeature({
      tag: "rlig",
      script,
      contextParams
    });
    if (substitutions.length) {
      substitutions.forEach(
        function(action) {
          return applySubstitution(action, tokens, index);
        }
      );
      contextParams = getContextParams(tokens);
    }
  });
}
function latinWordStartCheck(contextParams) {
  var char = contextParams.current;
  var prevChar = contextParams.get(-1);
  return (
    // ? latin first char
    prevChar === null && isLatinChar(char) || // ? latin char preceded with a non latin char
    !isLatinChar(prevChar) && isLatinChar(char)
  );
}
function latinWordEndCheck(contextParams) {
  var nextChar = contextParams.get(1);
  return (
    // ? last latin char
    nextChar === null || // ? next char is not latin
    !isLatinChar(nextChar)
  );
}
function getContextParams$1(tokens, index) {
  var context = tokens.map(function(token) {
    return token.activeState.value;
  });
  return new ContextParams(context, index || 0);
}
function latinLigature(range) {
  var this$1 = this;
  var script = "latn";
  var tokens = this.tokenizer.getRangeTokens(range);
  var contextParams = getContextParams$1(tokens);
  contextParams.context.forEach(function(glyphIndex, index) {
    contextParams.setCurrentIndex(index);
    var substitutions = this$1.query.lookupFeature({
      tag: "liga",
      script,
      contextParams
    });
    if (substitutions.length) {
      substitutions.forEach(
        function(action) {
          return applySubstitution(action, tokens, index);
        }
      );
      contextParams = getContextParams$1(tokens);
    }
  });
}
function Bidi(baseDir) {
  this.baseDir = baseDir || "ltr";
  this.tokenizer = new Tokenizer();
  this.featuresTags = {};
}
function registerContextChecker(checkId) {
  var check2 = this.contextChecks[checkId + "Check"];
  return this.tokenizer.registerContextChecker(
    checkId,
    check2.startCheck,
    check2.endCheck
  );
}
function tokenizeText() {
  registerContextChecker.call(this, "latinWord");
  registerContextChecker.call(this, "arabicWord");
  registerContextChecker.call(this, "arabicSentence");
  return this.tokenizer.tokenize(this.text);
}
function reverseArabicSentences() {
  var this$1 = this;
  var ranges = this.tokenizer.getContextRanges("arabicSentence");
  ranges.forEach(function(range) {
    var rangeTokens = this$1.tokenizer.getRangeTokens(range);
    this$1.tokenizer.replaceRange(
      range.startIndex,
      range.endOffset,
      rangeTokens.reverse()
    );
  });
}
function checkGlyphIndexStatus() {
  if (this.tokenizer.registeredModifiers.indexOf("glyphIndex") === -1) {
    throw new Error(
      "glyphIndex modifier is required to apply arabic presentation features."
    );
  }
}
function applyArabicPresentationForms() {
  var this$1 = this;
  var script = "arab";
  if (!this.featuresTags.hasOwnProperty(script)) {
    return;
  }
  checkGlyphIndexStatus.call(this);
  var ranges = this.tokenizer.getContextRanges("arabicWord");
  ranges.forEach(function(range) {
    arabicPresentationForms.call(this$1, range);
  });
}
function applyArabicRequireLigatures() {
  var this$1 = this;
  var script = "arab";
  if (!this.featuresTags.hasOwnProperty(script)) {
    return;
  }
  var tags = this.featuresTags[script];
  if (tags.indexOf("rlig") === -1) {
    return;
  }
  checkGlyphIndexStatus.call(this);
  var ranges = this.tokenizer.getContextRanges("arabicWord");
  ranges.forEach(function(range) {
    arabicRequiredLigatures.call(this$1, range);
  });
}
function applyLatinLigatures() {
  var this$1 = this;
  var script = "latn";
  if (!this.featuresTags.hasOwnProperty(script)) {
    return;
  }
  var tags = this.featuresTags[script];
  if (tags.indexOf("liga") === -1) {
    return;
  }
  checkGlyphIndexStatus.call(this);
  var ranges = this.tokenizer.getContextRanges("latinWord");
  ranges.forEach(function(range) {
    latinLigature.call(this$1, range);
  });
}
function Font(options) {
  options = options || {};
  options.tables = options.tables || {};
  if (!options.empty) {
    checkArgument(
      options.familyName,
      "When creating a new Font object, familyName is required."
    );
    checkArgument(
      options.styleName,
      "When creating a new Font object, styleName is required."
    );
    checkArgument(
      options.unitsPerEm,
      "When creating a new Font object, unitsPerEm is required."
    );
    checkArgument(
      options.ascender,
      "When creating a new Font object, ascender is required."
    );
    checkArgument(
      options.descender <= 0,
      "When creating a new Font object, negative descender value is required."
    );
    this.unitsPerEm = options.unitsPerEm || 1e3;
    this.ascender = options.ascender;
    this.descender = options.descender;
    this.createdTimestamp = options.createdTimestamp;
    this.tables = Object.assign(options.tables, {
      os2: Object.assign(
        {
          usWeightClass: options.weightClass || this.usWeightClasses.MEDIUM,
          usWidthClass: options.widthClass || this.usWidthClasses.MEDIUM,
          fsSelection: options.fsSelection || this.fsSelectionValues.REGULAR
        },
        options.tables.os2
      )
    });
  }
  this.supported = true;
  this.glyphs = new glyphset.GlyphSet(this, options.glyphs || []);
  this.encoding = new DefaultEncoding(this);
  this.position = new Position(this);
  this.substitution = new Substitution(this);
  this.tables = this.tables || {};
  this._push = null;
  this._hmtxTableData = {};
  Object.defineProperty(this, "hinting", {
    get: /* @__PURE__ */ __name(function() {
      if (this._hinting) {
        return this._hinting;
      }
      if (this.outlinesFormat === "truetype") {
        return this._hinting = new Hinting(this);
      }
    }, "get")
  });
}
function parseCmapTableFormat12(cmap2, p) {
  p.parseUShort();
  cmap2.length = p.parseULong();
  cmap2.language = p.parseULong();
  var groupCount;
  cmap2.groupCount = groupCount = p.parseULong();
  cmap2.glyphIndexMap = {};
  for (var i2 = 0; i2 < groupCount; i2 += 1) {
    var startCharCode = p.parseULong();
    var endCharCode = p.parseULong();
    var startGlyphId = p.parseULong();
    for (var c2 = startCharCode; c2 <= endCharCode; c2 += 1) {
      cmap2.glyphIndexMap[c2] = startGlyphId;
      startGlyphId++;
    }
  }
}
function parseCmapTableFormat4(cmap2, p, data, start, offset) {
  cmap2.length = p.parseUShort();
  cmap2.language = p.parseUShort();
  var segCount;
  cmap2.segCount = segCount = p.parseUShort() >> 1;
  p.skip("uShort", 3);
  cmap2.glyphIndexMap = {};
  var endCountParser = new parse.Parser(data, start + offset + 14);
  var startCountParser = new parse.Parser(
    data,
    start + offset + 16 + segCount * 2
  );
  var idDeltaParser = new parse.Parser(
    data,
    start + offset + 16 + segCount * 4
  );
  var idRangeOffsetParser = new parse.Parser(
    data,
    start + offset + 16 + segCount * 6
  );
  var glyphIndexOffset = start + offset + 16 + segCount * 8;
  for (var i2 = 0; i2 < segCount - 1; i2 += 1) {
    var glyphIndex = void 0;
    var endCount = endCountParser.parseUShort();
    var startCount = startCountParser.parseUShort();
    var idDelta = idDeltaParser.parseShort();
    var idRangeOffset = idRangeOffsetParser.parseUShort();
    for (var c2 = startCount; c2 <= endCount; c2 += 1) {
      if (idRangeOffset !== 0) {
        glyphIndexOffset = idRangeOffsetParser.offset + idRangeOffsetParser.relativeOffset - 2;
        glyphIndexOffset += idRangeOffset;
        glyphIndexOffset += (c2 - startCount) * 2;
        glyphIndex = parse.getUShort(data, glyphIndexOffset);
        if (glyphIndex !== 0) {
          glyphIndex = glyphIndex + idDelta & 65535;
        }
      } else {
        glyphIndex = c2 + idDelta & 65535;
      }
      cmap2.glyphIndexMap[c2] = glyphIndex;
    }
  }
}
function parseCmapTable(data, start) {
  var cmap2 = {};
  cmap2.version = parse.getUShort(data, start);
  check.argument(cmap2.version === 0, "cmap table version should be 0.");
  cmap2.numTables = parse.getUShort(data, start + 2);
  var offset = -1;
  for (var i2 = cmap2.numTables - 1; i2 >= 0; i2 -= 1) {
    var platformId = parse.getUShort(data, start + 4 + i2 * 8);
    var encodingId = parse.getUShort(data, start + 4 + i2 * 8 + 2);
    if (platformId === 3 && (encodingId === 0 || encodingId === 1 || encodingId === 10) || platformId === 0 && (encodingId === 0 || encodingId === 1 || encodingId === 2 || encodingId === 3 || encodingId === 4)) {
      offset = parse.getULong(data, start + 4 + i2 * 8 + 4);
      break;
    }
  }
  if (offset === -1) {
    throw new Error("No valid cmap sub-tables found.");
  }
  var p = new parse.Parser(data, start + offset);
  cmap2.format = p.parseUShort();
  if (cmap2.format === 12) {
    parseCmapTableFormat12(cmap2, p);
  } else if (cmap2.format === 4) {
    parseCmapTableFormat4(cmap2, p, data, start, offset);
  } else {
    throw new Error(
      "Only format 4 and 12 cmap tables are supported (found format " + cmap2.format + ")."
    );
  }
  return cmap2;
}
function calcCFFSubroutineBias(subrs) {
  var bias;
  if (subrs.length < 1240) {
    bias = 107;
  } else if (subrs.length < 33900) {
    bias = 1131;
  } else {
    bias = 32768;
  }
  return bias;
}
function parseCFFIndex(data, start, conversionFn) {
  var offsets = [];
  var objects = [];
  var count = parse.getCard16(data, start);
  var objectOffset;
  var endOffset;
  if (count !== 0) {
    var offsetSize = parse.getByte(data, start + 2);
    objectOffset = start + (count + 1) * offsetSize + 2;
    var pos = start + 3;
    for (var i2 = 0; i2 < count + 1; i2 += 1) {
      offsets.push(parse.getOffset(data, pos, offsetSize));
      pos += offsetSize;
    }
    endOffset = objectOffset + offsets[count];
  } else {
    endOffset = start + 2;
  }
  for (var i$1 = 0; i$1 < offsets.length - 1; i$1 += 1) {
    var value = parse.getBytes(
      data,
      objectOffset + offsets[i$1],
      objectOffset + offsets[i$1 + 1]
    );
    if (conversionFn) {
      value = conversionFn(value);
    }
    objects.push(value);
  }
  return { objects, startOffset: start, endOffset };
}
function parseCFFIndexLowMemory(data, start) {
  var offsets = [];
  var count = parse.getCard16(data, start);
  var objectOffset;
  var endOffset;
  if (count !== 0) {
    var offsetSize = parse.getByte(data, start + 2);
    objectOffset = start + (count + 1) * offsetSize + 2;
    var pos = start + 3;
    for (var i2 = 0; i2 < count + 1; i2 += 1) {
      offsets.push(parse.getOffset(data, pos, offsetSize));
      pos += offsetSize;
    }
    endOffset = objectOffset + offsets[count];
  } else {
    endOffset = start + 2;
  }
  return { offsets, startOffset: start, endOffset };
}
function getCffIndexObject(i2, offsets, data, start, conversionFn) {
  var count = parse.getCard16(data, start);
  var objectOffset = 0;
  if (count !== 0) {
    var offsetSize = parse.getByte(data, start + 2);
    objectOffset = start + (count + 1) * offsetSize + 2;
  }
  var value = parse.getBytes(
    data,
    objectOffset + offsets[i2],
    objectOffset + offsets[i2 + 1]
  );
  if (conversionFn) {
    value = conversionFn(value);
  }
  return value;
}
function parseFloatOperand(parser) {
  var s = "";
  var eof = 15;
  var lookup = [
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    ".",
    "E",
    "E-",
    null,
    "-"
  ];
  while (true) {
    var b = parser.parseByte();
    var n1 = b >> 4;
    var n2 = b & 15;
    if (n1 === eof) {
      break;
    }
    s += lookup[n1];
    if (n2 === eof) {
      break;
    }
    s += lookup[n2];
  }
  return parseFloat(s);
}
function parseOperand(parser, b0) {
  var b1;
  var b2;
  var b3;
  var b4;
  if (b0 === 28) {
    b1 = parser.parseByte();
    b2 = parser.parseByte();
    return b1 << 8 | b2;
  }
  if (b0 === 29) {
    b1 = parser.parseByte();
    b2 = parser.parseByte();
    b3 = parser.parseByte();
    b4 = parser.parseByte();
    return b1 << 24 | b2 << 16 | b3 << 8 | b4;
  }
  if (b0 === 30) {
    return parseFloatOperand(parser);
  }
  if (b0 >= 32 && b0 <= 246) {
    return b0 - 139;
  }
  if (b0 >= 247 && b0 <= 250) {
    b1 = parser.parseByte();
    return (b0 - 247) * 256 + b1 + 108;
  }
  if (b0 >= 251 && b0 <= 254) {
    b1 = parser.parseByte();
    return -(b0 - 251) * 256 - b1 - 108;
  }
  throw new Error("Invalid b0 " + b0);
}
function entriesToObject(entries) {
  var o = {};
  for (var i2 = 0; i2 < entries.length; i2 += 1) {
    var key = entries[i2][0];
    var values = entries[i2][1];
    var value = void 0;
    if (values.length === 1) {
      value = values[0];
    } else {
      value = values;
    }
    if (o.hasOwnProperty(key) && !isNaN(o[key])) {
      throw new Error("Object " + o + " already has key " + key);
    }
    o[key] = value;
  }
  return o;
}
function parseCFFDict(data, start, size) {
  start = start !== void 0 ? start : 0;
  var parser = new parse.Parser(data, start);
  var entries = [];
  var operands = [];
  size = size !== void 0 ? size : data.length;
  while (parser.relativeOffset < size) {
    var op = parser.parseByte();
    if (op <= 21) {
      if (op === 12) {
        op = 1200 + parser.parseByte();
      }
      entries.push([op, operands]);
      operands = [];
    } else {
      operands.push(parseOperand(parser, op));
    }
  }
  return entriesToObject(entries);
}
function getCFFString(strings, index) {
  if (index <= 390) {
    index = cffStandardStrings[index];
  } else {
    index = strings[index - 391];
  }
  return index;
}
function interpretDict(dict, meta2, strings) {
  var newDict = {};
  var value;
  for (var i2 = 0; i2 < meta2.length; i2 += 1) {
    var m2 = meta2[i2];
    if (Array.isArray(m2.type)) {
      var values = [];
      values.length = m2.type.length;
      for (var j2 = 0; j2 < m2.type.length; j2++) {
        value = dict[m2.op] !== void 0 ? dict[m2.op][j2] : void 0;
        if (value === void 0) {
          value = m2.value !== void 0 && m2.value[j2] !== void 0 ? m2.value[j2] : null;
        }
        if (m2.type[j2] === "SID") {
          value = getCFFString(strings, value);
        }
        values[j2] = value;
      }
      newDict[m2.name] = values;
    } else {
      value = dict[m2.op];
      if (value === void 0) {
        value = m2.value !== void 0 ? m2.value : null;
      }
      if (m2.type === "SID") {
        value = getCFFString(strings, value);
      }
      newDict[m2.name] = value;
    }
  }
  return newDict;
}
function parseCFFHeader(data, start) {
  var header = {};
  header.formatMajor = parse.getCard8(data, start);
  header.formatMinor = parse.getCard8(data, start + 1);
  header.size = parse.getCard8(data, start + 2);
  header.offsetSize = parse.getCard8(data, start + 3);
  header.startOffset = start;
  header.endOffset = start + 4;
  return header;
}
function parseCFFTopDict(data, strings) {
  var dict = parseCFFDict(data, 0, data.byteLength);
  return interpretDict(dict, TOP_DICT_META, strings);
}
function parseCFFPrivateDict(data, start, size, strings) {
  var dict = parseCFFDict(data, start, size);
  return interpretDict(dict, PRIVATE_DICT_META, strings);
}
function gatherCFFTopDicts(data, start, cffIndex, strings) {
  var topDictArray = [];
  for (var iTopDict = 0; iTopDict < cffIndex.length; iTopDict += 1) {
    var topDictData = new DataView(
      new Uint8Array(cffIndex[iTopDict]).buffer
    );
    var topDict = parseCFFTopDict(topDictData, strings);
    topDict._subrs = [];
    topDict._subrsBias = 0;
    topDict._defaultWidthX = 0;
    topDict._nominalWidthX = 0;
    var privateSize = topDict.private[0];
    var privateOffset = topDict.private[1];
    if (privateSize !== 0 && privateOffset !== 0) {
      var privateDict = parseCFFPrivateDict(
        data,
        privateOffset + start,
        privateSize,
        strings
      );
      topDict._defaultWidthX = privateDict.defaultWidthX;
      topDict._nominalWidthX = privateDict.nominalWidthX;
      if (privateDict.subrs !== 0) {
        var subrOffset = privateOffset + privateDict.subrs;
        var subrIndex = parseCFFIndex(data, subrOffset + start);
        topDict._subrs = subrIndex.objects;
        topDict._subrsBias = calcCFFSubroutineBias(topDict._subrs);
      }
      topDict._privateDict = privateDict;
    }
    topDictArray.push(topDict);
  }
  return topDictArray;
}
function parseCFFCharset(data, start, nGlyphs, strings) {
  var sid;
  var count;
  var parser = new parse.Parser(data, start);
  nGlyphs -= 1;
  var charset = [".notdef"];
  var format = parser.parseCard8();
  if (format === 0) {
    for (var i2 = 0; i2 < nGlyphs; i2 += 1) {
      sid = parser.parseSID();
      charset.push(getCFFString(strings, sid));
    }
  } else if (format === 1) {
    while (charset.length <= nGlyphs) {
      sid = parser.parseSID();
      count = parser.parseCard8();
      for (var i$1 = 0; i$1 <= count; i$1 += 1) {
        charset.push(getCFFString(strings, sid));
        sid += 1;
      }
    }
  } else if (format === 2) {
    while (charset.length <= nGlyphs) {
      sid = parser.parseSID();
      count = parser.parseCard16();
      for (var i$2 = 0; i$2 <= count; i$2 += 1) {
        charset.push(getCFFString(strings, sid));
        sid += 1;
      }
    }
  } else {
    throw new Error("Unknown charset format " + format);
  }
  return charset;
}
function parseCFFEncoding(data, start, charset) {
  var code;
  var enc = {};
  var parser = new parse.Parser(data, start);
  var format = parser.parseCard8();
  if (format === 0) {
    var nCodes = parser.parseCard8();
    for (var i2 = 0; i2 < nCodes; i2 += 1) {
      code = parser.parseCard8();
      enc[code] = i2;
    }
  } else if (format === 1) {
    var nRanges = parser.parseCard8();
    code = 1;
    for (var i$1 = 0; i$1 < nRanges; i$1 += 1) {
      var first = parser.parseCard8();
      var nLeft = parser.parseCard8();
      for (var j2 = first; j2 <= first + nLeft; j2 += 1) {
        enc[j2] = code;
        code += 1;
      }
    }
  } else {
    throw new Error("Unknown encoding format " + format);
  }
  return new CffEncoding(enc, charset);
}
function parseCFFCharstring(font, glyph, code) {
  var c1x;
  var c1y;
  var c2x;
  var c2y;
  var p = new Path();
  var stack = [];
  var nStems = 0;
  var haveWidth = false;
  var open = false;
  var x2 = 0;
  var y = 0;
  var subrs;
  var subrsBias;
  var defaultWidthX;
  var nominalWidthX;
  if (font.isCIDFont) {
    var fdIndex = font.tables.cff.topDict._fdSelect[glyph.index];
    var fdDict = font.tables.cff.topDict._fdArray[fdIndex];
    subrs = fdDict._subrs;
    subrsBias = fdDict._subrsBias;
    defaultWidthX = fdDict._defaultWidthX;
    nominalWidthX = fdDict._nominalWidthX;
  } else {
    subrs = font.tables.cff.topDict._subrs;
    subrsBias = font.tables.cff.topDict._subrsBias;
    defaultWidthX = font.tables.cff.topDict._defaultWidthX;
    nominalWidthX = font.tables.cff.topDict._nominalWidthX;
  }
  var width = defaultWidthX;
  function newContour(x22, y2) {
    if (open) {
      p.closePath();
    }
    p.moveTo(x22, y2);
    open = true;
  }
  __name(newContour, "newContour");
  function parseStems() {
    var hasWidthArg;
    hasWidthArg = stack.length % 2 !== 0;
    if (hasWidthArg && !haveWidth) {
      width = stack.shift() + nominalWidthX;
    }
    nStems += stack.length >> 1;
    stack.length = 0;
    haveWidth = true;
  }
  __name(parseStems, "parseStems");
  function parse22(code2) {
    var b1;
    var b2;
    var b3;
    var b4;
    var codeIndex;
    var subrCode;
    var jpx;
    var jpy;
    var c3x;
    var c3y;
    var c4x;
    var c4y;
    var i2 = 0;
    while (i2 < code2.length) {
      var v = code2[i2];
      i2 += 1;
      switch (v) {
        case 1:
          parseStems();
          break;
        case 3:
          parseStems();
          break;
        case 4:
          if (stack.length > 1 && !haveWidth) {
            width = stack.shift() + nominalWidthX;
            haveWidth = true;
          }
          y += stack.pop();
          newContour(x2, y);
          break;
        case 5:
          while (stack.length > 0) {
            x2 += stack.shift();
            y += stack.shift();
            p.lineTo(x2, y);
          }
          break;
        case 6:
          while (stack.length > 0) {
            x2 += stack.shift();
            p.lineTo(x2, y);
            if (stack.length === 0) {
              break;
            }
            y += stack.shift();
            p.lineTo(x2, y);
          }
          break;
        case 7:
          while (stack.length > 0) {
            y += stack.shift();
            p.lineTo(x2, y);
            if (stack.length === 0) {
              break;
            }
            x2 += stack.shift();
            p.lineTo(x2, y);
          }
          break;
        case 8:
          while (stack.length > 0) {
            c1x = x2 + stack.shift();
            c1y = y + stack.shift();
            c2x = c1x + stack.shift();
            c2y = c1y + stack.shift();
            x2 = c2x + stack.shift();
            y = c2y + stack.shift();
            p.curveTo(c1x, c1y, c2x, c2y, x2, y);
          }
          break;
        case 10:
          codeIndex = stack.pop() + subrsBias;
          subrCode = subrs[codeIndex];
          if (subrCode) {
            parse22(subrCode);
          }
          break;
        case 11:
          return;
        case 12:
          v = code2[i2];
          i2 += 1;
          switch (v) {
            case 35:
              c1x = x2 + stack.shift();
              c1y = y + stack.shift();
              c2x = c1x + stack.shift();
              c2y = c1y + stack.shift();
              jpx = c2x + stack.shift();
              jpy = c2y + stack.shift();
              c3x = jpx + stack.shift();
              c3y = jpy + stack.shift();
              c4x = c3x + stack.shift();
              c4y = c3y + stack.shift();
              x2 = c4x + stack.shift();
              y = c4y + stack.shift();
              stack.shift();
              p.curveTo(c1x, c1y, c2x, c2y, jpx, jpy);
              p.curveTo(c3x, c3y, c4x, c4y, x2, y);
              break;
            case 34:
              c1x = x2 + stack.shift();
              c1y = y;
              c2x = c1x + stack.shift();
              c2y = c1y + stack.shift();
              jpx = c2x + stack.shift();
              jpy = c2y;
              c3x = jpx + stack.shift();
              c3y = c2y;
              c4x = c3x + stack.shift();
              c4y = y;
              x2 = c4x + stack.shift();
              p.curveTo(c1x, c1y, c2x, c2y, jpx, jpy);
              p.curveTo(c3x, c3y, c4x, c4y, x2, y);
              break;
            case 36:
              c1x = x2 + stack.shift();
              c1y = y + stack.shift();
              c2x = c1x + stack.shift();
              c2y = c1y + stack.shift();
              jpx = c2x + stack.shift();
              jpy = c2y;
              c3x = jpx + stack.shift();
              c3y = c2y;
              c4x = c3x + stack.shift();
              c4y = c3y + stack.shift();
              x2 = c4x + stack.shift();
              p.curveTo(c1x, c1y, c2x, c2y, jpx, jpy);
              p.curveTo(c3x, c3y, c4x, c4y, x2, y);
              break;
            case 37:
              c1x = x2 + stack.shift();
              c1y = y + stack.shift();
              c2x = c1x + stack.shift();
              c2y = c1y + stack.shift();
              jpx = c2x + stack.shift();
              jpy = c2y + stack.shift();
              c3x = jpx + stack.shift();
              c3y = jpy + stack.shift();
              c4x = c3x + stack.shift();
              c4y = c3y + stack.shift();
              if (Math.abs(c4x - x2) > Math.abs(c4y - y)) {
                x2 = c4x + stack.shift();
              } else {
                y = c4y + stack.shift();
              }
              p.curveTo(c1x, c1y, c2x, c2y, jpx, jpy);
              p.curveTo(c3x, c3y, c4x, c4y, x2, y);
              break;
            default:
              console.log(
                "Glyph " + glyph.index + ": unknown operator 1200" + v
              );
              stack.length = 0;
          }
          break;
        case 14:
          if (stack.length > 0 && !haveWidth) {
            width = stack.shift() + nominalWidthX;
            haveWidth = true;
          }
          if (open) {
            p.closePath();
            open = false;
          }
          break;
        case 18:
          parseStems();
          break;
        case 19:
        case 20:
          parseStems();
          i2 += nStems + 7 >> 3;
          break;
        case 21:
          if (stack.length > 2 && !haveWidth) {
            width = stack.shift() + nominalWidthX;
            haveWidth = true;
          }
          y += stack.pop();
          x2 += stack.pop();
          newContour(x2, y);
          break;
        case 22:
          if (stack.length > 1 && !haveWidth) {
            width = stack.shift() + nominalWidthX;
            haveWidth = true;
          }
          x2 += stack.pop();
          newContour(x2, y);
          break;
        case 23:
          parseStems();
          break;
        case 24:
          while (stack.length > 2) {
            c1x = x2 + stack.shift();
            c1y = y + stack.shift();
            c2x = c1x + stack.shift();
            c2y = c1y + stack.shift();
            x2 = c2x + stack.shift();
            y = c2y + stack.shift();
            p.curveTo(c1x, c1y, c2x, c2y, x2, y);
          }
          x2 += stack.shift();
          y += stack.shift();
          p.lineTo(x2, y);
          break;
        case 25:
          while (stack.length > 6) {
            x2 += stack.shift();
            y += stack.shift();
            p.lineTo(x2, y);
          }
          c1x = x2 + stack.shift();
          c1y = y + stack.shift();
          c2x = c1x + stack.shift();
          c2y = c1y + stack.shift();
          x2 = c2x + stack.shift();
          y = c2y + stack.shift();
          p.curveTo(c1x, c1y, c2x, c2y, x2, y);
          break;
        case 26:
          if (stack.length % 2) {
            x2 += stack.shift();
          }
          while (stack.length > 0) {
            c1x = x2;
            c1y = y + stack.shift();
            c2x = c1x + stack.shift();
            c2y = c1y + stack.shift();
            x2 = c2x;
            y = c2y + stack.shift();
            p.curveTo(c1x, c1y, c2x, c2y, x2, y);
          }
          break;
        case 27:
          if (stack.length % 2) {
            y += stack.shift();
          }
          while (stack.length > 0) {
            c1x = x2 + stack.shift();
            c1y = y;
            c2x = c1x + stack.shift();
            c2y = c1y + stack.shift();
            x2 = c2x + stack.shift();
            y = c2y;
            p.curveTo(c1x, c1y, c2x, c2y, x2, y);
          }
          break;
        case 28:
          b1 = code2[i2];
          b2 = code2[i2 + 1];
          stack.push((b1 << 24 | b2 << 16) >> 16);
          i2 += 2;
          break;
        case 29:
          codeIndex = stack.pop() + font.gsubrsBias;
          subrCode = font.gsubrs[codeIndex];
          if (subrCode) {
            parse22(subrCode);
          }
          break;
        case 30:
          while (stack.length > 0) {
            c1x = x2;
            c1y = y + stack.shift();
            c2x = c1x + stack.shift();
            c2y = c1y + stack.shift();
            x2 = c2x + stack.shift();
            y = c2y + (stack.length === 1 ? stack.shift() : 0);
            p.curveTo(c1x, c1y, c2x, c2y, x2, y);
            if (stack.length === 0) {
              break;
            }
            c1x = x2 + stack.shift();
            c1y = y;
            c2x = c1x + stack.shift();
            c2y = c1y + stack.shift();
            y = c2y + stack.shift();
            x2 = c2x + (stack.length === 1 ? stack.shift() : 0);
            p.curveTo(c1x, c1y, c2x, c2y, x2, y);
          }
          break;
        case 31:
          while (stack.length > 0) {
            c1x = x2 + stack.shift();
            c1y = y;
            c2x = c1x + stack.shift();
            c2y = c1y + stack.shift();
            y = c2y + stack.shift();
            x2 = c2x + (stack.length === 1 ? stack.shift() : 0);
            p.curveTo(c1x, c1y, c2x, c2y, x2, y);
            if (stack.length === 0) {
              break;
            }
            c1x = x2;
            c1y = y + stack.shift();
            c2x = c1x + stack.shift();
            c2y = c1y + stack.shift();
            x2 = c2x + stack.shift();
            y = c2y + (stack.length === 1 ? stack.shift() : 0);
            p.curveTo(c1x, c1y, c2x, c2y, x2, y);
          }
          break;
        default:
          if (v < 32) {
            console.log(
              "Glyph " + glyph.index + ": unknown operator " + v
            );
          } else if (v < 247) {
            stack.push(v - 139);
          } else if (v < 251) {
            b1 = code2[i2];
            i2 += 1;
            stack.push((v - 247) * 256 + b1 + 108);
          } else if (v < 255) {
            b1 = code2[i2];
            i2 += 1;
            stack.push(-(v - 251) * 256 - b1 - 108);
          } else {
            b1 = code2[i2];
            b2 = code2[i2 + 1];
            b3 = code2[i2 + 2];
            b4 = code2[i2 + 3];
            i2 += 4;
            stack.push(
              (b1 << 24 | b2 << 16 | b3 << 8 | b4) / 65536
            );
          }
      }
    }
  }
  __name(parse22, "parse2");
  parse22(code);
  glyph.advanceWidth = width;
  return p;
}
function parseCFFFDSelect(data, start, nGlyphs, fdArrayCount) {
  var fdSelect = [];
  var fdIndex;
  var parser = new parse.Parser(data, start);
  var format = parser.parseCard8();
  if (format === 0) {
    for (var iGid = 0; iGid < nGlyphs; iGid++) {
      fdIndex = parser.parseCard8();
      if (fdIndex >= fdArrayCount) {
        throw new Error(
          "CFF table CID Font FDSelect has bad FD index value " + fdIndex + " (FD count " + fdArrayCount + ")"
        );
      }
      fdSelect.push(fdIndex);
    }
  } else if (format === 3) {
    var nRanges = parser.parseCard16();
    var first = parser.parseCard16();
    if (first !== 0) {
      throw new Error(
        "CFF Table CID Font FDSelect format 3 range has bad initial GID " + first
      );
    }
    var next;
    for (var iRange = 0; iRange < nRanges; iRange++) {
      fdIndex = parser.parseCard8();
      next = parser.parseCard16();
      if (fdIndex >= fdArrayCount) {
        throw new Error(
          "CFF table CID Font FDSelect has bad FD index value " + fdIndex + " (FD count " + fdArrayCount + ")"
        );
      }
      if (next > nGlyphs) {
        throw new Error(
          "CFF Table CID Font FDSelect format 3 range has bad GID " + next
        );
      }
      for (; first < next; first++) {
        fdSelect.push(fdIndex);
      }
      first = next;
    }
    if (next !== nGlyphs) {
      throw new Error(
        "CFF Table CID Font FDSelect format 3 range has bad final GID " + next
      );
    }
  } else {
    throw new Error(
      "CFF Table CID Font FDSelect table has unsupported format " + format
    );
  }
  return fdSelect;
}
function parseCFFTable(data, start, font, opt) {
  font.tables.cff = {};
  var header = parseCFFHeader(data, start);
  var nameIndex = parseCFFIndex(
    data,
    header.endOffset,
    parse.bytesToString
  );
  var topDictIndex = parseCFFIndex(data, nameIndex.endOffset);
  var stringIndex = parseCFFIndex(
    data,
    topDictIndex.endOffset,
    parse.bytesToString
  );
  var globalSubrIndex = parseCFFIndex(data, stringIndex.endOffset);
  font.gsubrs = globalSubrIndex.objects;
  font.gsubrsBias = calcCFFSubroutineBias(font.gsubrs);
  var topDictArray = gatherCFFTopDicts(
    data,
    start,
    topDictIndex.objects,
    stringIndex.objects
  );
  if (topDictArray.length !== 1) {
    throw new Error(
      "CFF table has too many fonts in 'FontSet' - count of fonts NameIndex.length = " + topDictArray.length
    );
  }
  var topDict = topDictArray[0];
  font.tables.cff.topDict = topDict;
  if (topDict._privateDict) {
    font.defaultWidthX = topDict._privateDict.defaultWidthX;
    font.nominalWidthX = topDict._privateDict.nominalWidthX;
  }
  if (topDict.ros[0] !== void 0 && topDict.ros[1] !== void 0) {
    font.isCIDFont = true;
  }
  if (font.isCIDFont) {
    var fdArrayOffset = topDict.fdArray;
    var fdSelectOffset = topDict.fdSelect;
    if (fdArrayOffset === 0 || fdSelectOffset === 0) {
      throw new Error(
        "Font is marked as a CID font, but FDArray and/or FDSelect information is missing"
      );
    }
    fdArrayOffset += start;
    var fdArrayIndex = parseCFFIndex(data, fdArrayOffset);
    var fdArray = gatherCFFTopDicts(
      data,
      start,
      fdArrayIndex.objects,
      stringIndex.objects
    );
    topDict._fdArray = fdArray;
    fdSelectOffset += start;
    topDict._fdSelect = parseCFFFDSelect(
      data,
      fdSelectOffset,
      font.numGlyphs,
      fdArray.length
    );
  }
  var privateDictOffset = start + topDict.private[1];
  var privateDict = parseCFFPrivateDict(
    data,
    privateDictOffset,
    topDict.private[0],
    stringIndex.objects
  );
  font.defaultWidthX = privateDict.defaultWidthX;
  font.nominalWidthX = privateDict.nominalWidthX;
  if (privateDict.subrs !== 0) {
    var subrOffset = privateDictOffset + privateDict.subrs;
    var subrIndex = parseCFFIndex(data, subrOffset);
    font.subrs = subrIndex.objects;
    font.subrsBias = calcCFFSubroutineBias(font.subrs);
  } else {
    font.subrs = [];
    font.subrsBias = 0;
  }
  var charStringsIndex;
  if (opt.lowMemory) {
    charStringsIndex = parseCFFIndexLowMemory(
      data,
      start + topDict.charStrings
    );
    font.nGlyphs = charStringsIndex.offsets.length;
  } else {
    charStringsIndex = parseCFFIndex(data, start + topDict.charStrings);
    font.nGlyphs = charStringsIndex.objects.length;
  }
  var charset = parseCFFCharset(
    data,
    start + topDict.charset,
    font.nGlyphs,
    stringIndex.objects
  );
  if (topDict.encoding === 0) {
    font.cffEncoding = new CffEncoding(cffStandardEncoding, charset);
  } else if (topDict.encoding === 1) {
    font.cffEncoding = new CffEncoding(cffExpertEncoding, charset);
  } else {
    font.cffEncoding = parseCFFEncoding(
      data,
      start + topDict.encoding,
      charset
    );
  }
  font.encoding = font.encoding || font.cffEncoding;
  font.glyphs = new glyphset.GlyphSet(font);
  if (opt.lowMemory) {
    font._push = function(i22) {
      var charString2 = getCffIndexObject(
        i22,
        charStringsIndex.offsets,
        data,
        start + topDict.charStrings
      );
      font.glyphs.push(
        i22,
        glyphset.cffGlyphLoader(font, i22, parseCFFCharstring, charString2)
      );
    };
  } else {
    for (var i2 = 0; i2 < font.nGlyphs; i2 += 1) {
      var charString = charStringsIndex.objects[i2];
      font.glyphs.push(
        i2,
        glyphset.cffGlyphLoader(font, i2, parseCFFCharstring, charString)
      );
    }
  }
}
function parseFvarAxis(data, start, names) {
  var axis = {};
  var p = new parse.Parser(data, start);
  axis.tag = p.parseTag();
  axis.minValue = p.parseFixed();
  axis.defaultValue = p.parseFixed();
  axis.maxValue = p.parseFixed();
  p.skip("uShort", 1);
  axis.name = names[p.parseUShort()] || {};
  return axis;
}
function parseFvarInstance(data, start, axes, names) {
  var inst = {};
  var p = new parse.Parser(data, start);
  inst.name = names[p.parseUShort()] || {};
  p.skip("uShort", 1);
  inst.coordinates = {};
  for (var i2 = 0; i2 < axes.length; ++i2) {
    inst.coordinates[axes[i2].tag] = p.parseFixed();
  }
  return inst;
}
function parseFvarTable(data, start, names) {
  var p = new parse.Parser(data, start);
  var tableVersion = p.parseULong();
  check.argument(
    tableVersion === 65536,
    "Unsupported fvar table version."
  );
  var offsetToData = p.parseOffset16();
  p.skip("uShort", 1);
  var axisCount = p.parseUShort();
  var axisSize = p.parseUShort();
  var instanceCount = p.parseUShort();
  var instanceSize = p.parseUShort();
  var axes = [];
  for (var i2 = 0; i2 < axisCount; i2++) {
    axes.push(
      parseFvarAxis(data, start + offsetToData + i2 * axisSize, names)
    );
  }
  var instances = [];
  var instanceStart = start + offsetToData + axisCount * axisSize;
  for (var j2 = 0; j2 < instanceCount; j2++) {
    instances.push(
      parseFvarInstance(
        data,
        instanceStart + j2 * instanceSize,
        axes,
        names
      )
    );
  }
  return { axes, instances };
}
function parseGDEFTable(data, start) {
  start = start || 0;
  var p = new Parser(data, start);
  var tableVersion = p.parseVersion(1);
  check.argument(
    tableVersion === 1 || tableVersion === 1.2 || tableVersion === 1.3,
    "Unsupported GDEF table version."
  );
  var gdef2 = {
    version: tableVersion,
    classDef: p.parsePointer(Parser.classDef),
    attachList: p.parsePointer(attachList),
    ligCaretList: p.parsePointer(ligCaretList),
    markAttachClassDef: p.parsePointer(Parser.classDef)
  };
  if (tableVersion >= 1.2) {
    gdef2.markGlyphSets = p.parsePointer(markGlyphSets);
  }
  return gdef2;
}
function parseGposTable(data, start) {
  start = start || 0;
  var p = new Parser(data, start);
  var tableVersion = p.parseVersion(1);
  check.argument(
    tableVersion === 1 || tableVersion === 1.1,
    "Unsupported GPOS table version " + tableVersion
  );
  if (tableVersion === 1) {
    return {
      version: tableVersion,
      scripts: p.parseScriptList(),
      features: p.parseFeatureList(),
      lookups: p.parseLookupList(subtableParsers)
    };
  } else {
    return {
      version: tableVersion,
      scripts: p.parseScriptList(),
      features: p.parseFeatureList(),
      lookups: p.parseLookupList(subtableParsers),
      variations: p.parseFeatureVariationsList()
    };
  }
}
function parseGsubTable(data, start) {
  start = start || 0;
  var p = new Parser(data, start);
  var tableVersion = p.parseVersion(1);
  check.argument(
    tableVersion === 1 || tableVersion === 1.1,
    "Unsupported GSUB table version."
  );
  if (tableVersion === 1) {
    return {
      version: tableVersion,
      scripts: p.parseScriptList(),
      features: p.parseFeatureList(),
      lookups: p.parseLookupList(subtableParsers$1)
    };
  } else {
    return {
      version: tableVersion,
      scripts: p.parseScriptList(),
      features: p.parseFeatureList(),
      lookups: p.parseLookupList(subtableParsers$1),
      variations: p.parseFeatureVariationsList()
    };
  }
}
function parseHeadTable(data, start) {
  var head2 = {};
  var p = new parse.Parser(data, start);
  head2.version = p.parseVersion();
  head2.fontRevision = Math.round(p.parseFixed() * 1e3) / 1e3;
  head2.checkSumAdjustment = p.parseULong();
  head2.magicNumber = p.parseULong();
  check.argument(
    head2.magicNumber === 1594834165,
    "Font header has wrong magic number."
  );
  head2.flags = p.parseUShort();
  head2.unitsPerEm = p.parseUShort();
  head2.created = p.parseLongDateTime();
  head2.modified = p.parseLongDateTime();
  head2.xMin = p.parseShort();
  head2.yMin = p.parseShort();
  head2.xMax = p.parseShort();
  head2.yMax = p.parseShort();
  head2.macStyle = p.parseUShort();
  head2.lowestRecPPEM = p.parseUShort();
  head2.fontDirectionHint = p.parseShort();
  head2.indexToLocFormat = p.parseShort();
  head2.glyphDataFormat = p.parseShort();
  return head2;
}
function parseHheaTable(data, start) {
  var hhea2 = {};
  var p = new parse.Parser(data, start);
  hhea2.version = p.parseVersion();
  hhea2.ascender = p.parseShort();
  hhea2.descender = p.parseShort();
  hhea2.lineGap = p.parseShort();
  hhea2.advanceWidthMax = p.parseUShort();
  hhea2.minLeftSideBearing = p.parseShort();
  hhea2.minRightSideBearing = p.parseShort();
  hhea2.xMaxExtent = p.parseShort();
  hhea2.caretSlopeRise = p.parseShort();
  hhea2.caretSlopeRun = p.parseShort();
  hhea2.caretOffset = p.parseShort();
  p.relativeOffset += 8;
  hhea2.metricDataFormat = p.parseShort();
  hhea2.numberOfHMetrics = p.parseUShort();
  return hhea2;
}
function parseHmtxTableAll(data, start, numMetrics, numGlyphs, glyphs) {
  var advanceWidth;
  var leftSideBearing;
  var p = new parse.Parser(data, start);
  for (var i2 = 0; i2 < numGlyphs; i2 += 1) {
    if (i2 < numMetrics) {
      advanceWidth = p.parseUShort();
      leftSideBearing = p.parseShort();
    }
    var glyph = glyphs.get(i2);
    glyph.advanceWidth = advanceWidth;
    glyph.leftSideBearing = leftSideBearing;
  }
}
function parseHmtxTableOnLowMemory(font, data, start, numMetrics, numGlyphs) {
  font._hmtxTableData = {};
  var advanceWidth;
  var leftSideBearing;
  var p = new parse.Parser(data, start);
  for (var i2 = 0; i2 < numGlyphs; i2 += 1) {
    if (i2 < numMetrics) {
      advanceWidth = p.parseUShort();
      leftSideBearing = p.parseShort();
    }
    font._hmtxTableData[i2] = {
      advanceWidth,
      leftSideBearing
    };
  }
}
function parseHmtxTable(font, data, start, numMetrics, numGlyphs, glyphs, opt) {
  if (opt.lowMemory) {
    parseHmtxTableOnLowMemory(font, data, start, numMetrics, numGlyphs);
  } else {
    parseHmtxTableAll(data, start, numMetrics, numGlyphs, glyphs);
  }
}
function parseWindowsKernTable(p) {
  var pairs = {};
  p.skip("uShort");
  var subtableVersion = p.parseUShort();
  check.argument(subtableVersion === 0, "Unsupported kern sub-table version.");
  p.skip("uShort", 2);
  var nPairs = p.parseUShort();
  p.skip("uShort", 3);
  for (var i2 = 0; i2 < nPairs; i2 += 1) {
    var leftIndex = p.parseUShort();
    var rightIndex = p.parseUShort();
    var value = p.parseShort();
    pairs[leftIndex + "," + rightIndex] = value;
  }
  return pairs;
}
function parseMacKernTable(p) {
  var pairs = {};
  p.skip("uShort");
  var nTables = p.parseULong();
  if (nTables > 1) {
    console.warn("Only the first kern subtable is supported.");
  }
  p.skip("uLong");
  var coverage = p.parseUShort();
  var subtableVersion = coverage & 255;
  p.skip("uShort");
  if (subtableVersion === 0) {
    var nPairs = p.parseUShort();
    p.skip("uShort", 3);
    for (var i2 = 0; i2 < nPairs; i2 += 1) {
      var leftIndex = p.parseUShort();
      var rightIndex = p.parseUShort();
      var value = p.parseShort();
      pairs[leftIndex + "," + rightIndex] = value;
    }
  }
  return pairs;
}
function parseKernTable(data, start) {
  var p = new parse.Parser(data, start);
  var tableVersion = p.parseUShort();
  if (tableVersion === 0) {
    return parseWindowsKernTable(p);
  } else if (tableVersion === 1) {
    return parseMacKernTable(p);
  } else {
    throw new Error("Unsupported kern table version (" + tableVersion + ").");
  }
}
function parseLtagTable(data, start) {
  var p = new parse.Parser(data, start);
  var tableVersion = p.parseULong();
  check.argument(tableVersion === 1, "Unsupported ltag table version.");
  p.skip("uLong", 1);
  var numTags = p.parseULong();
  var tags = [];
  for (var i2 = 0; i2 < numTags; i2++) {
    var tag = "";
    var offset = start + p.parseUShort();
    var length = p.parseUShort();
    for (var j2 = offset; j2 < offset + length; ++j2) {
      tag += String.fromCharCode(data.getInt8(j2));
    }
    tags.push(tag);
  }
  return tags;
}
function parseLocaTable(data, start, numGlyphs, shortVersion) {
  var p = new parse.Parser(data, start);
  var parseFn = shortVersion ? p.parseUShort : p.parseULong;
  var glyphOffsets = [];
  for (var i2 = 0; i2 < numGlyphs + 1; i2 += 1) {
    var glyphOffset = parseFn.call(p);
    if (shortVersion) {
      glyphOffset *= 2;
    }
    glyphOffsets.push(glyphOffset);
  }
  return glyphOffsets;
}
function parseMaxpTable(data, start) {
  var maxp2 = {};
  var p = new parse.Parser(data, start);
  maxp2.version = p.parseVersion();
  maxp2.numGlyphs = p.parseUShort();
  if (maxp2.version === 1) {
    maxp2.maxPoints = p.parseUShort();
    maxp2.maxContours = p.parseUShort();
    maxp2.maxCompositePoints = p.parseUShort();
    maxp2.maxCompositeContours = p.parseUShort();
    maxp2.maxZones = p.parseUShort();
    maxp2.maxTwilightPoints = p.parseUShort();
    maxp2.maxStorage = p.parseUShort();
    maxp2.maxFunctionDefs = p.parseUShort();
    maxp2.maxInstructionDefs = p.parseUShort();
    maxp2.maxStackElements = p.parseUShort();
    maxp2.maxSizeOfInstructions = p.parseUShort();
    maxp2.maxComponentElements = p.parseUShort();
    maxp2.maxComponentDepth = p.parseUShort();
  }
  return maxp2;
}
function parseOS2Table(data, start) {
  var os22 = {};
  var p = new parse.Parser(data, start);
  os22.version = p.parseUShort();
  os22.xAvgCharWidth = p.parseShort();
  os22.usWeightClass = p.parseUShort();
  os22.usWidthClass = p.parseUShort();
  os22.fsType = p.parseUShort();
  os22.ySubscriptXSize = p.parseShort();
  os22.ySubscriptYSize = p.parseShort();
  os22.ySubscriptXOffset = p.parseShort();
  os22.ySubscriptYOffset = p.parseShort();
  os22.ySuperscriptXSize = p.parseShort();
  os22.ySuperscriptYSize = p.parseShort();
  os22.ySuperscriptXOffset = p.parseShort();
  os22.ySuperscriptYOffset = p.parseShort();
  os22.yStrikeoutSize = p.parseShort();
  os22.yStrikeoutPosition = p.parseShort();
  os22.sFamilyClass = p.parseShort();
  os22.panose = [];
  for (var i2 = 0; i2 < 10; i2++) {
    os22.panose[i2] = p.parseByte();
  }
  os22.ulUnicodeRange1 = p.parseULong();
  os22.ulUnicodeRange2 = p.parseULong();
  os22.ulUnicodeRange3 = p.parseULong();
  os22.ulUnicodeRange4 = p.parseULong();
  os22.achVendID = String.fromCharCode(
    p.parseByte(),
    p.parseByte(),
    p.parseByte(),
    p.parseByte()
  );
  os22.fsSelection = p.parseUShort();
  os22.usFirstCharIndex = p.parseUShort();
  os22.usLastCharIndex = p.parseUShort();
  os22.sTypoAscender = p.parseShort();
  os22.sTypoDescender = p.parseShort();
  os22.sTypoLineGap = p.parseShort();
  os22.usWinAscent = p.parseUShort();
  os22.usWinDescent = p.parseUShort();
  if (os22.version >= 1) {
    os22.ulCodePageRange1 = p.parseULong();
    os22.ulCodePageRange2 = p.parseULong();
  }
  if (os22.version >= 2) {
    os22.sxHeight = p.parseShort();
    os22.sCapHeight = p.parseShort();
    os22.usDefaultChar = p.parseUShort();
    os22.usBreakChar = p.parseUShort();
    os22.usMaxContent = p.parseUShort();
  }
  return os22;
}
function parsePostTable(data, start) {
  var post2 = {};
  var p = new parse.Parser(data, start);
  post2.version = p.parseVersion();
  post2.italicAngle = p.parseFixed();
  post2.underlinePosition = p.parseShort();
  post2.underlineThickness = p.parseShort();
  post2.isFixedPitch = p.parseULong();
  post2.minMemType42 = p.parseULong();
  post2.maxMemType42 = p.parseULong();
  post2.minMemType1 = p.parseULong();
  post2.maxMemType1 = p.parseULong();
  post2.names = [];
  switch (post2.version) {
    case 1:
      break;
    case 2:
      post2.numberOfGlyphs = p.parseUShort();
      post2.glyphNameIndex = new Array(post2.numberOfGlyphs);
      for (var i2 = 0; i2 < post2.numberOfGlyphs; i2++) {
        post2.glyphNameIndex[i2] = p.parseUShort();
      }
      break;
    case 2.5:
      post2.numberOfGlyphs = p.parseUShort();
      post2.offset = new Array(post2.numberOfGlyphs);
      for (var i$1 = 0; i$1 < post2.numberOfGlyphs; i$1++) {
        post2.offset[i$1] = p.parseChar();
      }
      break;
  }
  return post2;
}
function parseMetaTable(data, start) {
  var p = new parse.Parser(data, start);
  var tableVersion = p.parseULong();
  check.argument(tableVersion === 1, "Unsupported META table version.");
  p.parseULong();
  p.parseULong();
  var numDataMaps = p.parseULong();
  var tags = {};
  for (var i2 = 0; i2 < numDataMaps; i2++) {
    var tag = p.parseTag();
    var dataOffset = p.parseULong();
    var dataLength = p.parseULong();
    var text = decode.UTF8(data, start + dataOffset, dataLength);
    tags[tag] = text;
  }
  return tags;
}
function parseOpenTypeTableEntries(data, numTables) {
  var tableEntries = [];
  var p = 12;
  for (var i2 = 0; i2 < numTables; i2 += 1) {
    var tag = parse.getTag(data, p);
    var checksum = parse.getULong(data, p + 4);
    var offset = parse.getULong(data, p + 8);
    var length = parse.getULong(data, p + 12);
    tableEntries.push({
      tag,
      checksum,
      offset,
      length,
      compression: false
    });
    p += 16;
  }
  return tableEntries;
}
function parseWOFFTableEntries(data, numTables) {
  var tableEntries = [];
  var p = 44;
  for (var i2 = 0; i2 < numTables; i2 += 1) {
    var tag = parse.getTag(data, p);
    var offset = parse.getULong(data, p + 4);
    var compLength = parse.getULong(data, p + 8);
    var origLength = parse.getULong(data, p + 12);
    var compression = void 0;
    if (compLength < origLength) {
      compression = "WOFF";
    } else {
      compression = false;
    }
    tableEntries.push({
      tag,
      offset,
      compression,
      compressedLength: compLength,
      length: origLength
    });
    p += 20;
  }
  return tableEntries;
}
function uncompressTable(data, tableEntry) {
  if (tableEntry.compression === "WOFF") {
    var inBuffer = new Uint8Array(
      data.buffer,
      tableEntry.offset + 2,
      tableEntry.compressedLength - 2
    );
    var outBuffer = new Uint8Array(tableEntry.length);
    inflateSync(inBuffer, outBuffer);
    if (outBuffer.byteLength !== tableEntry.length) {
      throw new Error(
        "Decompression error: " + tableEntry.tag + " decompressed length doesn't match recorded length"
      );
    }
    var view = new DataView(outBuffer.buffer, 0);
    return { data: view, offset: 0 };
  } else {
    return { data, offset: tableEntry.offset };
  }
}
function parseBuffer(buffer, opt) {
  opt = opt === void 0 || opt === null ? {} : opt;
  var indexToLocFormat;
  var font = new Font({ empty: true });
  var data = new DataView(buffer, 0);
  var numTables;
  var tableEntries = [];
  var signature = parse.getTag(data, 0);
  if (signature === String.fromCharCode(0, 1, 0, 0) || signature === "true" || signature === "typ1") {
    font.outlinesFormat = "truetype";
    numTables = parse.getUShort(data, 4);
    tableEntries = parseOpenTypeTableEntries(data, numTables);
  } else if (signature === "OTTO") {
    font.outlinesFormat = "cff";
    numTables = parse.getUShort(data, 4);
    tableEntries = parseOpenTypeTableEntries(data, numTables);
  } else if (signature === "wOFF") {
    var flavor = parse.getTag(data, 4);
    if (flavor === String.fromCharCode(0, 1, 0, 0)) {
      font.outlinesFormat = "truetype";
    } else if (flavor === "OTTO") {
      font.outlinesFormat = "cff";
    } else {
      throw new Error("Unsupported OpenType flavor " + signature);
    }
    numTables = parse.getUShort(data, 12);
    tableEntries = parseWOFFTableEntries(data, numTables);
  } else {
    throw new Error("Unsupported OpenType signature " + signature);
  }
  var cffTableEntry;
  var fvarTableEntry;
  var glyfTableEntry;
  var gdefTableEntry;
  var gposTableEntry;
  var gsubTableEntry;
  var hmtxTableEntry;
  var kernTableEntry;
  var locaTableEntry;
  var metaTableEntry;
  var p;
  for (var i2 = 0; i2 < numTables; i2 += 1) {
    var tableEntry = tableEntries[i2];
    var table = void 0;
    switch (tableEntry.tag) {
      case "cmap":
        table = uncompressTable(data, tableEntry);
        font.tables.cmap = cmap.parse(table.data, table.offset);
        font.encoding = new CmapEncoding(font.tables.cmap);
        break;
      case "cvt ":
        table = uncompressTable(data, tableEntry);
        p = new parse.Parser(table.data, table.offset);
        font.tables.cvt = p.parseShortList(tableEntry.length / 2);
        break;
      case "fvar":
        fvarTableEntry = tableEntry;
        break;
      case "fpgm":
        table = uncompressTable(data, tableEntry);
        p = new parse.Parser(table.data, table.offset);
        font.tables.fpgm = p.parseByteList(tableEntry.length);
        break;
      case "head":
        table = uncompressTable(data, tableEntry);
        font.tables.head = head.parse(table.data, table.offset);
        font.unitsPerEm = font.tables.head.unitsPerEm;
        indexToLocFormat = font.tables.head.indexToLocFormat;
        break;
      case "hhea":
        table = uncompressTable(data, tableEntry);
        font.tables.hhea = hhea.parse(table.data, table.offset);
        font.ascender = font.tables.hhea.ascender;
        font.descender = font.tables.hhea.descender;
        font.numberOfHMetrics = font.tables.hhea.numberOfHMetrics;
        break;
      case "hmtx":
        hmtxTableEntry = tableEntry;
        break;
      case "ltag":
        table = uncompressTable(data, tableEntry);
        ltagTable = ltag.parse(table.data, table.offset);
        break;
      case "maxp":
        table = uncompressTable(data, tableEntry);
        font.tables.maxp = maxp.parse(table.data, table.offset);
        font.numGlyphs = font.tables.maxp.numGlyphs;
        break;
      case "OS/2":
        table = uncompressTable(data, tableEntry);
        font.tables.os2 = os2.parse(table.data, table.offset);
        break;
      case "post":
        table = uncompressTable(data, tableEntry);
        font.tables.post = post.parse(table.data, table.offset);
        break;
      case "prep":
        table = uncompressTable(data, tableEntry);
        p = new parse.Parser(table.data, table.offset);
        font.tables.prep = p.parseByteList(tableEntry.length);
        break;
      case "glyf":
        glyfTableEntry = tableEntry;
        break;
      case "loca":
        locaTableEntry = tableEntry;
        break;
      case "CFF ":
        cffTableEntry = tableEntry;
        break;
      case "kern":
        kernTableEntry = tableEntry;
        break;
      case "GDEF":
        gdefTableEntry = tableEntry;
        break;
      case "GPOS":
        gposTableEntry = tableEntry;
        break;
      case "GSUB":
        gsubTableEntry = tableEntry;
        break;
      case "meta":
        metaTableEntry = tableEntry;
        break;
    }
  }
  if (glyfTableEntry && locaTableEntry) {
    var shortVersion = indexToLocFormat === 0;
    var locaTable = uncompressTable(data, locaTableEntry);
    var locaOffsets = loca.parse(
      locaTable.data,
      locaTable.offset,
      font.numGlyphs,
      shortVersion
    );
    var glyfTable = uncompressTable(data, glyfTableEntry);
    font.glyphs = glyf.parse(
      glyfTable.data,
      glyfTable.offset,
      locaOffsets,
      font,
      opt
    );
  } else if (cffTableEntry) {
    var cffTable = uncompressTable(data, cffTableEntry);
    cff.parse(cffTable.data, cffTable.offset, font, opt);
  } else {
    throw new Error("Font doesn't contain TrueType or CFF outlines.");
  }
  var hmtxTable = uncompressTable(data, hmtxTableEntry);
  hmtx.parse(
    font,
    hmtxTable.data,
    hmtxTable.offset,
    font.numberOfHMetrics,
    font.numGlyphs,
    font.glyphs,
    opt
  );
  addGlyphNames(font, opt);
  if (kernTableEntry) {
    var kernTable = uncompressTable(data, kernTableEntry);
    font.kerningPairs = kern.parse(kernTable.data, kernTable.offset);
  } else {
    font.kerningPairs = {};
  }
  if (gdefTableEntry) {
    var gdefTable = uncompressTable(data, gdefTableEntry);
    font.tables.gdef = gdef.parse(gdefTable.data, gdefTable.offset);
  }
  if (gposTableEntry) {
    var gposTable = uncompressTable(data, gposTableEntry);
    font.tables.gpos = gpos.parse(gposTable.data, gposTable.offset);
    font.position.init();
  }
  if (gsubTableEntry) {
    var gsubTable = uncompressTable(data, gsubTableEntry);
    font.tables.gsub = gsub.parse(gsubTable.data, gsubTable.offset);
  }
  if (fvarTableEntry) {
    var fvarTable = uncompressTable(data, fvarTableEntry);
    font.tables.fvar = fvar.parse(
      fvarTable.data,
      fvarTable.offset,
      font.names
    );
  }
  if (metaTableEntry) {
    var metaTable = uncompressTable(data, metaTableEntry);
    font.tables.meta = meta.parse(metaTable.data, metaTable.offset);
    font.metas = font.tables.meta;
  }
  return font;
}
function load() {
}
function loadSync() {
}
async function Qu() {
  return {};
}
function Ku(e) {
  ot = e;
}
async function Ce() {
  return ot || (gt ? (await gt, ot) : (gt = Promise.resolve().then(() => (ko(), So)).then((e) => e.getYogaModule()).then((e) => ot = e), await gt, gt = null, ot));
}
function tn(e) {
  if (/\.\D?$/.test(e))
    throw new Error("The dot should be followed by a number");
  if (/^[+-]{2}/.test(e))
    throw new Error("Only one leading +/- is allowed");
  if (il(e) > 1)
    throw new Error("Only one dot is allowed");
  if (/%$/.test(e)) {
    this.type = "percentage", this.value = en(e), this.unit = "%";
    return;
  }
  var t = sl(e);
  if (!t) {
    this.type = "number", this.value = en(e);
    return;
  }
  this.type = ul(t), this.value = en(e.substr(0, e.length - t.length)), this.unit = t;
}
function ze(e) {
  return new tn(e);
}
function il(e) {
  var t = e.match(/\./g);
  return t ? t.length : 0;
}
function en(e) {
  var t = parseFloat(e);
  if (isNaN(t))
    throw new Error("Invalid number: " + e);
  return t;
}
function sl(e) {
  var t = e.match(/\D+$/), n = t && t[0];
  if (n && ol.indexOf(n) === -1)
    throw new Error("Invalid unit: " + n);
  return n;
}
function br(e, t) {
  return Object.fromEntries(e.map((n) => [n, t]));
}
function ul(e) {
  return al[e] || "length";
}
function sn(e) {
  let t = typeof e;
  return !(t === "number" || t === "bigint" || t === "string" || t === "boolean");
}
function Ao(e) {
  return /^class\s/.test(e.toString());
}
function Io(e) {
  return "dangerouslySetInnerHTML" in e;
}
function Ro(e) {
  let t = typeof e > "u" ? [] : [].concat(e).flat(1 / 0), n = [];
  for (let r = 0; r < t.length; r++) {
    let i2 = t[r];
    typeof i2 > "u" || typeof i2 == "boolean" || i2 === null || (typeof i2 == "number" && (i2 = String(i2)), typeof i2 == "string" && n.length && typeof n[n.length - 1] == "string" ? n[n.length - 1] += i2 : n.push(i2));
  }
  return n;
}
function xe(e, t, n, r, i2 = false) {
  if (typeof e == "number")
    return e;
  try {
    if (e = e.trim(), /[ /\(,]/.test(e))
      return;
    if (e === String(+e))
      return +e;
    let s = new ze(e);
    if (s.type === "length")
      switch (s.unit) {
        case "em":
          return s.value * t;
        case "rem":
          return s.value * 16;
        case "vw":
          return ~~(s.value * r._viewportWidth / 100);
        case "vh":
          return ~~(s.value * r._viewportHeight / 100);
        default:
          return s.value;
      }
    else if (s.type === "angle")
      switch (s.unit) {
        case "deg":
          return s.value;
        case "rad":
          return s.value * 180 / Math.PI;
        default:
          return s.value;
      }
    else if (s.type === "percentage" && i2)
      return s.value / 100 * n;
  } catch {
  }
}
function bt(e, t) {
  return [e[0] * t[0] + e[2] * t[1], e[1] * t[0] + e[3] * t[1], e[0] * t[2] + e[2] * t[3], e[1] * t[2] + e[3] * t[3], e[0] * t[4] + e[2] * t[5] + e[4], e[1] * t[4] + e[3] * t[5] + e[5]];
}
function de(e, t, n, r) {
  let i2 = t[e];
  if (typeof i2 > "u") {
    if (r && typeof e < "u")
      throw new Error(`Invalid value for CSS property "${r}". Allowed values: ${Object.keys(t).map((s) => `"${s}"`).join(" | ")}. Received: "${e}".`);
    i2 = n;
  }
  return i2;
}
function ce(e, t, n) {
  if (!rn || !nn) {
    if (!(typeof Intl < "u" && "Segmenter" in Intl))
      throw new Error("Intl.Segmenter does not exist, please use import a polyfill.");
    rn = new Intl.Segmenter(n, { granularity: "word" }), nn = new Intl.Segmenter(n, { granularity: "grapheme" });
  }
  return t === "word" ? [...rn.segment(e)].map((r) => r.segment) : [...nn.segment(e)].map((r) => r.segment);
}
function R(e, t, n) {
  let r = "";
  for (let [i2, s] of Object.entries(t))
    typeof s < "u" && (r += ` ${i2}="${s}"`);
  return n ? `<${e}${r}>${n}</${e}>` : `<${e}${r}/>`;
}
function Co(e = 20) {
  let t = /* @__PURE__ */ new Map();
  function n(i2, s) {
    if (t.size >= e) {
      let o = t.keys().next().value;
      t.delete(o);
    }
    t.set(i2, s);
  }
  __name(n, "n");
  function r(i2) {
    if (!t.has(i2))
      return;
    let o = t.get(i2);
    return t.delete(i2), t.set(i2, o), o;
  }
  __name(r, "r");
  return { set: n, get: r };
}
function on(e, t) {
  if (!e)
    return "";
  if (Array.isArray(e))
    return e.map((a) => on(a, t)).join("");
  if (typeof e != "object")
    return String(e);
  let n = e.type;
  if (n === "text")
    throw new Error("<text> nodes are not currently supported, please convert them to <path>");
  let { children: r, style: i2, ...s } = e.props || {}, o = (i2 == null ? void 0 : i2.color) || t;
  return `<${n}${Object.entries(s).map(([a, u]) => (typeof u == "string" && u.toLowerCase() === "currentcolor" && (u = o), ` ${Do[a] || a}="${u}"`)).join("")}>${on(r, o)}</${n}>`;
}
function yt(e) {
  return e ? e.split(/[, ]/).filter(Boolean).map(Number) : null;
}
function Fo(e, t) {
  let { viewBox: n, viewbox: r, width: i2, height: s, className: o, style: a, children: u, ...l } = e.props || {};
  n ||= r, l.xmlns = "http://www.w3.org/2000/svg";
  let f = (a == null ? void 0 : a.color) || t, d = yt(n), g = d ? d[3] / d[2] : null;
  return i2 = i2 || g && s ? s / g : null, s = s || g && i2 ? i2 * g : null, l.width = i2, l.height = s, n && (l.viewBox = n), `data:image/svg+xml;utf8,${`<svg ${Object.entries(l).map(([h, p]) => (typeof p == "string" && p.toLowerCase() === "currentcolor" && (p = f), ` ${Do[h] || h}="${p}"`)).join("")}>${on(u, f)}</svg>`.replace(fl2, encodeURIComponent)}`;
}
function No(e) {
  return typeof e == "string";
}
function Mo(e, t) {
  if (t === "break-all")
    return { words: ce(e, "grapheme"), requiredBreaks: [] };
  if (t === "keep-all")
    return { words: ce(e, "word"), requiredBreaks: [] };
  let n = new $557adaaeb0c7885f$exports(e), r = 0, i2 = n.nextBreak(), s = [], o = [false];
  for (; i2; ) {
    let a = e.slice(r, i2.position);
    s.push(a), i2.required ? o.push(true) : o.push(false), r = i2.position, i2 = n.nextBreak();
  }
  return { words: s, requiredBreaks: o };
}
function an(e) {
  let t = {};
  for (let n in e)
    cl.has(n) && (t[n] = e[n]);
  return t;
}
function pl(e, t) {
  try {
    let n = new ze(e);
    switch (n.unit) {
      case "px":
        return { absolute: n.value };
      case "em":
        return { absolute: n.value * t };
      case "rem":
        return { absolute: n.value * 16 };
      case "%":
        return { relative: n.value };
      default:
        return {};
    }
  } catch {
    return {};
  }
}
function un(e, t, n) {
  switch (e) {
    case "top":
      return { yRelative: 0 };
    case "left":
      return { xRelative: 0 };
    case "right":
      return { xRelative: 100 };
    case "bottom":
      return { yRelative: 100 };
    case "center":
      return {};
    default: {
      let r = pl(e, t);
      return r.absolute ? { [n ? "xAbsolute" : "yAbsolute"]: r.absolute } : r.relative ? { [n ? "xRelative" : "yRelative"]: r.relative } : {};
    }
  }
}
function ln(e, t) {
  if (typeof e == "number")
    return { xAbsolute: e };
  let n;
  try {
    n = (0, import_postcss_value_parser.default)(e).nodes.filter((r) => r.type === "word").map((r) => r.value);
  } catch {
    return {};
  }
  return n.length === 1 ? un(n[0], t, true) : n.length === 2 ? ((n[0] === "top" || n[0] === "bottom" || n[1] === "left" || n[1] === "right") && n.reverse(), { ...un(n[0], t, true), ...un(n[1], t, false) }) : {};
}
function yl(e, t, n, r) {
  return e === "textDecoration" && !n.includes(t.textDecorationColor) && (t.textDecorationColor = r), t;
}
function xt(e, t) {
  return typeof t == "number" ? vl.has(e) ? bl.has(e) ? t : String(t) : t + "px" : t;
}
function xl(e, t, n) {
  if (e === "lineHeight")
    return { lineHeight: xt(e, t) };
  if (e === "fontFamily")
    return { fontFamily: t.split(",").map((r) => r.trim().replace(/(^['"])|(['"]$)/g, "").toLocaleLowerCase()) };
  if (e === "borderRadius") {
    if (typeof t != "string" || !t.includes("/"))
      return;
    let [r, i2] = t.split("/"), s = (0, import_css_to_react_native.getStylesForProperty)(e, r, true), o = (0, import_css_to_react_native.getStylesForProperty)(e, i2, true);
    for (let a in s)
      o[a] = xt(e, s[a]) + " " + xt(e, o[a]);
    return o;
  }
  if (/^border(Top|Right|Bottom|Left)?$/.test(e)) {
    let r = (0, import_css_to_react_native.getStylesForProperty)("border", t, true);
    r.borderWidth === 1 && !String(t).includes("1px") && (r.borderWidth = 3), r.borderColor === "black" && !String(t).includes("black") && (r.borderColor = n);
    let i2 = { Width: xt(e + "Width", r.borderWidth), Style: de(r.borderStyle, { solid: "solid", dashed: "dashed" }, "solid", e + "Style"), Color: r.borderColor }, s = {};
    for (let o of e === "border" ? ["Top", "Right", "Bottom", "Left"] : [e.slice(6)])
      for (let a in i2)
        s["border" + o + a] = i2[a];
    return s;
  }
  if (e === "boxShadow") {
    if (!t)
      throw new Error('Invalid `boxShadow` value: "' + t + '".');
    return { [e]: typeof t == "string" ? (0, import_css_box_shadow.parse)(t) : t };
  }
  if (e === "transform") {
    if (typeof t != "string")
      throw new Error("Invalid `transform` value.");
    let r = {}, i2 = t.replace(/(-?[\d.]+%)/g, (o, a) => {
      let u = ~~(Math.random() * 1e9);
      return r[u] = a, u + "px";
    }), s = (0, import_css_to_react_native.getStylesForProperty)("transform", i2, true);
    for (let o of s.transform)
      for (let a in o)
        r[o[a]] && (o[a] = r[o[a]]);
    return s;
  }
  if (e === "background")
    return t = t.toString().trim(), /^(linear-gradient|radial-gradient|url)\(/.test(t) ? (0, import_css_to_react_native.getStylesForProperty)("backgroundImage", t, true) : (0, import_css_to_react_native.getStylesForProperty)("background", t, true);
}
function Wo(e) {
  return e === "transform" ? " Only absolute lengths such as `10px` are supported." : "";
}
function Bo(e) {
  if (typeof e == "string" && qo.test(e.trim()))
    return e.trim().replace(qo, (t, n, r, i2, s) => `rgba(${n}, ${r}, ${i2}, ${s})`);
  if (typeof e == "object" && e !== null) {
    for (let t in e)
      e[t] = Bo(e[t]);
    return e;
  }
  return e;
}
function yr(e, t) {
  let n = {};
  if (e) {
    let i2 = wl(e.color, t.color);
    n.color = i2;
    for (let s in e) {
      if (s.startsWith("_")) {
        n[s] = e[s];
        continue;
      }
      if (s === "color")
        continue;
      let o = (0, import_css_to_react_native.getPropertyName)(s), a = Sl(e[s], i2);
      try {
        let u = xl(o, a, i2) || yl(o, (0, import_css_to_react_native.getStylesForProperty)(o, xt(o, a), true), a, i2);
        Object.assign(n, u);
      } catch (u) {
        throw new Error(u.message + (u.message.includes(a) ? `
  ` + Wo(o) : `
  in CSS rule \`${o}: ${a}\`.${Wo(o)}`));
      }
    }
  }
  if (n.backgroundImage) {
    let { backgrounds: i2 } = (0, import_css_background_parser.parseElementStyle)(n);
    n.backgroundImage = i2;
  }
  let r = typeof n.fontSize == "number" ? n.fontSize : t.fontSize;
  if (typeof r == "string")
    try {
      let i2 = new ze(r);
      switch (i2.unit) {
        case "em":
          r = i2.value * t.fontSize;
          break;
        case "rem":
          r = i2.value * 16;
          break;
      }
    } catch {
      r = 16;
    }
  typeof n.fontSize < "u" && (n.fontSize = r), n.transformOrigin && (n.transformOrigin = ln(n.transformOrigin, r));
  for (let i2 in n) {
    let s = n[i2];
    if (i2 === "lineHeight")
      typeof s == "string" && (s = n[i2] = xe(s, r, r, t, true) / r);
    else {
      if (typeof s == "string") {
        let o = xe(s, r, r, t);
        typeof o < "u" && (n[i2] = o), s = n[i2];
      }
      if (typeof s == "string" || typeof s == "object") {
        let o = Bo(s);
        o && (n[i2] = o), s = n[i2];
      }
    }
    if (i2 === "opacity" && (s = n[i2] = s * t.opacity), i2 === "transform") {
      let o = s;
      for (let a of o) {
        let u = Object.keys(a)[0], l = a[u], f = typeof l == "string" ? xe(l, r, r, t) ?? l : l;
        a[u] = f;
      }
    }
  }
  return n;
}
function wl(e, t) {
  return e && e.toLowerCase() !== "currentcolor" ? e : t;
}
function _l(e, t) {
  return e.replace(/currentcolor/gi, t);
}
function Sl(e, t) {
  return No(e) && (e = _l(e, t)), e;
}
function jo(e) {
  let t = new DataView(e), n = 4, r = t.byteLength;
  for (; n < r; ) {
    let i2 = t.getUint16(n, false);
    if (i2 > r)
      throw new TypeError("Invalid JPEG");
    let s = t.getUint8(i2 + 1 + n);
    if (s === 192 || s === 193 || s === 194)
      return [t.getUint16(i2 + 7 + n, false), t.getUint16(i2 + 5 + n, false)];
    n += i2 + 2;
  }
  throw new TypeError("Invalid JPEG");
}
function Ho(e) {
  let t = new Uint8Array(e.slice(6, 10));
  return [t[0] | t[1] << 8, t[2] | t[3] << 8];
}
function Vo(e) {
  let t = new DataView(e);
  return [t.getUint16(18, false), t.getUint16(22, false)];
}
function El(e) {
  let t = "", n = new Uint8Array(e);
  for (let r = 0; r < n.byteLength; r++)
    t += String.fromCharCode(n[r]);
  return btoa(t);
}
function Pl(e) {
  let t = atob(e), n = t.length, r = new Uint8Array(n);
  for (let i2 = 0; i2 < n; i2++)
    r[i2] = t.charCodeAt(i2);
  return r.buffer;
}
function zo(e, t) {
  let n = t.match(/<svg[^>]*>/)[0], r = n.match(/viewBox=['"](.+)['"]/), i2 = r ? yt(r[1]) : null, s = n.match(/width=['"](\d*\.\d+|\d+)['"]/), o = n.match(/height=['"](\d*\.\d+|\d+)['"]/);
  if (!i2 && (!s || !o))
    throw new Error(`Failed to parse SVG from ${e}: missing "viewBox"`);
  let a = i2 ? [i2[2], i2[3]] : [+s[1], +o[1]], u = a[0] / a[1];
  return s && o ? [+s[1], +o[1]] : s ? [+s[1], +s[1] / u] : o ? [+o[1] * u, +o[1]] : [a[0], a[1]];
}
function Go(e) {
  let t, n = Al(new Uint8Array(e));
  switch (n) {
    case xr:
      t = Vo(e);
      break;
    case _r:
      t = Ho(e);
      break;
    case wr:
      t = jo(e);
      break;
  }
  if (!Ol.includes(n))
    throw new Error(`Unsupported image type: ${n || "unknown"}`);
  return [`data:${n};base64,${El(e)}`, t];
}
async function Sr(e) {
  if (!e)
    throw new Error("Image source is not provided.");
  if (typeof e == "object") {
    let [i2, s] = Go(e);
    return [i2, ...s];
  }
  if ((e.startsWith('"') && e.endsWith('"') || e.startsWith("'") && e.endsWith("'")) && (e = e.slice(1, -1)), e.startsWith("data:")) {
    let i2;
    try {
      i2 = /data:(?<imageType>[a-z/+]+)(;(?<encodingType>base64|utf8))?,(?<dataString>.*)/g.exec(e).groups;
    } catch {
      return console.warn("Image data URI resolved without size:" + e), [e];
    }
    let { imageType: s, encodingType: o, dataString: a } = i2;
    if (s === cn) {
      let u = o === "base64" ? atob(a) : decodeURIComponent(a.replace(/ /g, "%20")), l = o === "base64" ? e : `data:image/svg+xml;base64,${btoa(u)}`, f = zo(e, u);
      return [l, ...f];
    } else if (o === "base64") {
      let u, l = Pl(a);
      switch (s) {
        case xr:
          u = Vo(l);
          break;
        case _r:
          u = Ho(l);
          break;
        case wr:
          u = jo(l);
          break;
      }
      return [e, ...u];
    } else
      return console.warn("Image data URI resolved without size:" + e), [e];
  }
  if (!globalThis.fetch)
    throw new Error("`fetch` is required to be polyfilled to load images.");
  if (fn.has(e))
    return fn.get(e);
  let t = Uo.get(e);
  if (t)
    return t;
  let n = e, r = fetch(n).then((i2) => {
    let s = i2.headers.get("content-type");
    return s === "image/svg+xml" || s === "application/svg+xml" ? i2.text() : i2.arrayBuffer();
  }).then((i2) => {
    if (typeof i2 == "string")
      try {
        let a = `data:image/svg+xml;base64,${btoa(i2)}`, u = zo(n, i2);
        return [a, ...u];
      } catch (a) {
        throw new Error(`Failed to parse SVG image: ${a.message}`);
      }
    let [s, o] = Go(i2);
    return [s, ...o];
  }).then((i2) => (Uo.set(n, i2), i2)).catch((i2) => (console.error(`Can't load image ${n}: ` + i2.message), []));
  return fn.set(n, r), r;
}
function Al(e) {
  return [255, 216, 255].every((t, n) => e[n] === t) ? wr : [137, 80, 78, 71, 13, 10, 26, 10].every((t, n) => e[n] === t) ? xr : [71, 73, 70, 56].every((t, n) => e[n] === t) ? _r : [82, 73, 70, 70, 0, 0, 0, 0, 87, 69, 66, 80].every((t, n) => !t || e[n] === t) ? Tl : [60, 63, 120, 109, 108].every((t, n) => e[n] === t) ? cn : [0, 0, 0, 0, 102, 116, 121, 112, 97, 118, 105, 102].every((t, n) => !t || e[n] === t) ? kl : null;
}
async function dn(e, t, n, r, i2) {
  let s = await Ce(), o = { ...n, ...yr($o[t], n), ...yr(r, n) };
  if (t === "img") {
    let [a, u, l] = await Sr(i2.src);
    if (u === void 0 && l === void 0) {
      if (i2.width === void 0 || i2.height === void 0)
        throw new Error("Image size cannot be determined. Please provide the width and height of the image.");
      u = parseInt(i2.width), l = parseInt(i2.height);
    }
    let f = l / u, d = (o.borderLeftWidth || 0) + (o.borderRightWidth || 0) + (o.paddingLeft || 0) + (o.paddingRight || 0), g = (o.borderTopWidth || 0) + (o.borderBottomWidth || 0) + (o.paddingTop || 0) + (o.paddingBottom || 0), h = o.width || i2.width, p = o.height || i2.height, v = typeof h != "string" && typeof p != "string";
    typeof h == "number" && v && (h -= d), typeof p == "number" && v && (p -= g), h === void 0 && p === void 0 ? (h = u, p = l) : h === void 0 ? typeof p == "number" ? h = p / f : e.setAspectRatio(1 / f) : p === void 0 && (typeof h == "number" ? p = h * f : e.setAspectRatio(1 / f)), o.width = v ? h + d : h, o.height = v ? p + g : p, o.__src = a;
  }
  if (t === "svg") {
    let a = i2.viewBox || i2.viewbox, u = yt(a), l = u ? u[3] / u[2] : null, { width: f, height: d } = i2;
    typeof f > "u" && d ? l == null ? f = 0 : typeof d == "string" && d.endsWith("%") ? f = parseInt(d) / l + "%" : (d = xe(d, n.fontSize, 1, n), f = d / l) : typeof d > "u" && f ? l == null ? f = 0 : typeof f == "string" && f.endsWith("%") ? d = parseInt(f) * l + "%" : (f = xe(f, n.fontSize, 1, n), d = f * l) : (typeof f < "u" && (f = xe(f, n.fontSize, 1, n) || f), typeof d < "u" && (d = xe(d, n.fontSize, 1, n) || d), f ||= u == null ? void 0 : u[2], d ||= u == null ? void 0 : u[3]), !o.width && f && (o.width = f), !o.height && d && (o.height = d);
  }
  return e.setDisplay(de(o.display, { flex: s.DISPLAY_FLEX, none: s.DISPLAY_NONE }, s.DISPLAY_FLEX, "display")), e.setAlignContent(de(o.alignContent, { stretch: s.ALIGN_STRETCH, center: s.ALIGN_CENTER, "flex-start": s.ALIGN_FLEX_START, "flex-end": s.ALIGN_FLEX_END, "space-between": s.ALIGN_SPACE_BETWEEN, "space-around": s.ALIGN_SPACE_AROUND, baseline: s.ALIGN_BASELINE, normal: s.ALIGN_AUTO }, s.ALIGN_AUTO, "alignContent")), e.setAlignItems(de(o.alignItems, { stretch: s.ALIGN_STRETCH, center: s.ALIGN_CENTER, "flex-start": s.ALIGN_FLEX_START, "flex-end": s.ALIGN_FLEX_END, baseline: s.ALIGN_BASELINE, normal: s.ALIGN_AUTO }, s.ALIGN_STRETCH, "alignItems")), e.setAlignSelf(de(o.alignSelf, { stretch: s.ALIGN_STRETCH, center: s.ALIGN_CENTER, "flex-start": s.ALIGN_FLEX_START, "flex-end": s.ALIGN_FLEX_END, baseline: s.ALIGN_BASELINE, normal: s.ALIGN_AUTO }, s.ALIGN_AUTO, "alignSelf")), e.setJustifyContent(de(o.justifyContent, { center: s.JUSTIFY_CENTER, "flex-start": s.JUSTIFY_FLEX_START, "flex-end": s.JUSTIFY_FLEX_END, "space-between": s.JUSTIFY_SPACE_BETWEEN, "space-around": s.JUSTIFY_SPACE_AROUND }, s.JUSTIFY_FLEX_START, "justifyContent")), e.setFlexDirection(de(o.flexDirection, { row: s.FLEX_DIRECTION_ROW, column: s.FLEX_DIRECTION_COLUMN, "row-reverse": s.FLEX_DIRECTION_ROW_REVERSE, "column-reverse": s.FLEX_DIRECTION_COLUMN_REVERSE }, s.FLEX_DIRECTION_ROW, "flexDirection")), e.setFlexWrap(de(o.flexWrap, { wrap: s.WRAP_WRAP, nowrap: s.WRAP_NO_WRAP, "wrap-reverse": s.WRAP_WRAP_REVERSE }, s.WRAP_NO_WRAP, "flexWrap")), typeof e.setGap < "u" && typeof e.getGap < "u" && (typeof o.gap < "u" && e.setGap(s.GUTTER_ALL, o.gap), typeof o.rowGap < "u" && e.setGap(s.GUTTER_ROW, o.rowGap), typeof o.columnGap < "u" && e.setGap(s.GUTTER_COLUMN, o.columnGap)), typeof o.flexBasis < "u" && e.setFlexBasis(o.flexBasis), e.setFlexGrow(typeof o.flexGrow > "u" ? 0 : o.flexGrow), e.setFlexShrink(typeof o.flexShrink > "u" ? 0 : o.flexShrink), typeof o.maxHeight < "u" && e.setMaxHeight(o.maxHeight), typeof o.maxWidth < "u" && e.setMaxWidth(o.maxWidth), typeof o.minHeight < "u" && e.setMinHeight(o.minHeight), typeof o.minWidth < "u" && e.setMinWidth(o.minWidth), e.setOverflow(de(o.overflow, { visible: s.OVERFLOW_VISIBLE, hidden: s.OVERFLOW_HIDDEN }, s.OVERFLOW_VISIBLE, "overflow")), e.setMargin(s.EDGE_TOP, o.marginTop || 0), e.setMargin(s.EDGE_BOTTOM, o.marginBottom || 0), e.setMargin(s.EDGE_LEFT, o.marginLeft || 0), e.setMargin(s.EDGE_RIGHT, o.marginRight || 0), e.setBorder(s.EDGE_TOP, o.borderTopWidth || 0), e.setBorder(s.EDGE_BOTTOM, o.borderBottomWidth || 0), e.setBorder(s.EDGE_LEFT, o.borderLeftWidth || 0), e.setBorder(s.EDGE_RIGHT, o.borderRightWidth || 0), e.setPadding(s.EDGE_TOP, o.paddingTop || 0), e.setPadding(s.EDGE_BOTTOM, o.paddingBottom || 0), e.setPadding(s.EDGE_LEFT, o.paddingLeft || 0), e.setPadding(s.EDGE_RIGHT, o.paddingRight || 0), e.setPositionType(de(o.position, { absolute: s.POSITION_TYPE_ABSOLUTE, relative: s.POSITION_TYPE_RELATIVE }, s.POSITION_TYPE_RELATIVE, "position")), typeof o.top < "u" && e.setPosition(s.EDGE_TOP, o.top), typeof o.bottom < "u" && e.setPosition(s.EDGE_BOTTOM, o.bottom), typeof o.left < "u" && e.setPosition(s.EDGE_LEFT, o.left), typeof o.right < "u" && e.setPosition(s.EDGE_RIGHT, o.right), typeof o.height < "u" ? e.setHeight(o.height) : e.setHeightAuto(), typeof o.width < "u" ? e.setWidth(o.width) : e.setWidthAuto(), [o, an(o)];
}
function Il(e, t, n) {
  let r = [...Yo];
  for (let i2 of e) {
    let s = Object.keys(i2)[0], o = i2[s];
    if (typeof o == "string")
      if (s === "translateX")
        o = parseFloat(o) / 100 * t, i2[s] = o;
      else if (s === "translateY")
        o = parseFloat(o) / 100 * n, i2[s] = o;
      else
        throw new Error(`Invalid transform: "${s}: ${o}".`);
    let a = o, u = [...Yo];
    switch (s) {
      case "translateX":
        u[4] = a;
        break;
      case "translateY":
        u[5] = a;
        break;
      case "scale":
        u[0] = a, u[3] = a;
        break;
      case "scaleX":
        u[0] = a;
        break;
      case "scaleY":
        u[3] = a;
        break;
      case "rotate": {
        let l = a * Math.PI / 180, f = Math.cos(l), d = Math.sin(l);
        u[0] = f, u[1] = d, u[2] = -d, u[3] = f;
        break;
      }
      case "skewX":
        u[2] = Math.tan(a * Math.PI / 180);
        break;
      case "skewY":
        u[1] = Math.tan(a * Math.PI / 180);
        break;
    }
    r = bt(u, r);
  }
  e.splice(0, e.length), e.push(...r), e.__resolved = true;
}
function wt({ left: e, top: t, width: n, height: r }, i2, s, o) {
  let a;
  i2.__resolved || Il(i2, n, r);
  let u = i2;
  if (s)
    a = u;
  else {
    let l = (o == null ? void 0 : o.xAbsolute) ?? ((o == null ? void 0 : o.xRelative) ?? 50) * n / 100, f = (o == null ? void 0 : o.yAbsolute) ?? ((o == null ? void 0 : o.yRelative) ?? 50) * r / 100, d = e + l, g = t + f;
    a = bt([1, 0, 0, 1, d, g], bt(u, [1, 0, 0, 1, -d, -g])), u.__parent && (a = bt(u.__parent, a)), u.splice(0, 6, ...a);
  }
  return `matrix(${a.map((l) => l.toFixed(2)).join(",")})`;
}
function Xo({ left: e, top: t, width: n, height: r, isInheritingTransform: i2 }, s) {
  let o = "", a = 1;
  return s.transform && (o = wt({ left: e, top: t, width: n, height: r }, s.transform, i2, s.transformOrigin)), s.opacity !== void 0 && (a = +s.opacity), { matrix: o, opacity: a };
}
function pn({ id: e, content: t, filter: n, left: r, top: i2, width: s, height: o, matrix: a, opacity: u, image: l, clipPathId: f, debug: d, shape: g, decorationShape: h }, p) {
  let v = "";
  if (d && (v = R("rect", { x: r, y: i2 - o, width: s, height: o, fill: "transparent", stroke: "#575eff", "stroke-width": 1, transform: a || void 0, "clip-path": f ? `url(#${f})` : void 0 })), l) {
    let b = { href: l, x: r, y: i2, width: s, height: o, transform: a || void 0, "clip-path": f ? `url(#${f})` : void 0, style: p.filter ? `filter:${p.filter}` : void 0 };
    return [(n ? `${n}<g filter="url(#satori_s-${e})">` : "") + R("image", { ...b, opacity: u !== 1 ? u : void 0 }) + (h || "") + (n ? "</g>" : "") + v, ""];
  }
  let _ = { x: r, y: i2, width: s, height: o, "font-weight": p.fontWeight, "font-style": p.fontStyle, "font-size": p.fontSize, "font-family": p.fontFamily, "letter-spacing": p.letterSpacing || void 0, transform: a || void 0, "clip-path": f ? `url(#${f})` : void 0, style: p.filter ? `filter:${p.filter}` : void 0 };
  return [(n ? `${n}<g filter="url(#satori_s-${e})">` : "") + R("text", { ..._, fill: p.color, opacity: u !== 1 ? u : void 0 }, t) + (h || "") + (n ? "</g>" : "") + v, g ? R("text", _, t) : ""];
}
function Rl(e, t, n) {
  return e.replace(/([MA])([0-9.-]+),([0-9.-]+)/g, function(r, i2, s, o) {
    return i2 + (parseFloat(s) + t) + "," + (parseFloat(o) + n);
  });
}
function Qo({ id: e, width: t, height: n }, r) {
  if (!r.shadowColor || !r.shadowOffset || typeof r.shadowRadius > "u")
    return "";
  let i2 = r.shadowRadius * r.shadowRadius / 4, s = Math.min(r.shadowOffset.width - i2, 0), o = Math.max(r.shadowOffset.width + i2 + t, t), a = Math.min(r.shadowOffset.height - i2, 0), u = Math.max(r.shadowOffset.height + i2 + n, n);
  return `<defs><filter id="satori_s-${e}" x="${s / t * 100}%" y="${a / n * 100}%" width="${(o - s) / t * 100}%" height="${(u - a) / n * 100}%"><feDropShadow dx="${r.shadowOffset.width}" dy="${r.shadowOffset.height}" stdDeviation="${r.shadowRadius / 2}" flood-color="${r.shadowColor}" flood-opacity="1"/></filter></defs>`;
}
function Ko({ width: e, height: t, shape: n, opacity: r, id: i2 }, s) {
  if (!s.boxShadow)
    return null;
  let o = "", a = "";
  for (let u = s.boxShadow.length - 1; u >= 0; u--) {
    let l = "", f = s.boxShadow[u];
    f.spreadRadius && f.inset && (f.spreadRadius = -f.spreadRadius);
    let d = f.blurRadius * f.blurRadius / 4 + (f.spreadRadius || 0), g = Math.min(-d - (f.inset ? f.offsetX : 0), 0), h = Math.max(d + e - (f.inset ? f.offsetX : 0), e), p = Math.min(-d - (f.inset ? f.offsetY : 0), 0), v = Math.max(d + t - (f.inset ? f.offsetY : 0), t), _ = `satori_s-${i2}-${u}`, b = `satori_ms-${i2}-${u}`, y = f.spreadRadius ? n.replace('stroke-width="0"', `stroke-width="${f.spreadRadius * 2}"`) : n;
    l += R("mask", { id: b, maskUnits: "userSpaceOnUse" }, R("rect", { x: 0, y: 0, width: s._viewportWidth, height: s._viewportHeight, fill: f.inset ? "#000" : "#fff" }) + y.replace('fill="#fff"', f.inset ? 'fill="#fff"' : 'fill="#000"').replace('stroke="#fff"', ""));
    let S = y.replace(/d="([^"]+)"/, (E, T) => 'd="' + Rl(T, f.offsetX, f.offsetY) + '"').replace(/x="([^"]+)"/, (E, T) => 'x="' + (parseFloat(T) + f.offsetX) + '"').replace(/y="([^"]+)"/, (E, T) => 'y="' + (parseFloat(T) + f.offsetY) + '"');
    f.spreadRadius && f.spreadRadius < 0 && (l += R("mask", { id: b + "-neg", maskUnits: "userSpaceOnUse" }, S.replace('stroke="#fff"', 'stroke="#000"').replace(/stroke-width="[^"]+"/, `stroke-width="${-f.spreadRadius * 2}"`))), f.spreadRadius && f.spreadRadius < 0 && (S = R("g", { mask: `url(#${b}-neg)` }, S)), l += R("defs", {}, R("filter", { id: _, x: `${g / e * 100}%`, y: `${p / t * 100}%`, width: `${(h - g) / e * 100}%`, height: `${(v - p) / t * 100}%` }, R("feGaussianBlur", { stdDeviation: f.blurRadius / 2, result: "b" }) + R("feFlood", { "flood-color": f.color, in: "SourceGraphic", result: "f" }) + R("feComposite", { in: "f", in2: "b", operator: f.inset ? "out" : "in" }))) + R("g", { mask: `url(#${b})`, filter: `url(#${_})`, opacity: r }, S), f.inset ? a += l : o += l;
  }
  return [o, a];
}
function hn({ width: e, left: t, top: n, ascender: r, clipPathId: i2 }, s) {
  let { textDecorationColor: o, textDecorationStyle: a, textDecorationLine: u, fontSize: l } = s;
  if (!u || u === "none")
    return "";
  let f = Math.max(1, l * 0.1), d = u === "line-through" ? n + r * 0.5 : u === "underline" ? n + r * 1.1 : n, g = a === "dashed" ? `${f * 1.2} ${f * 2}` : a === "dotted" ? `0 ${f * 2}` : void 0;
  return R("line", { x1: t, y1: d, x2: t + e, y2: d, stroke: o, "stroke-width": f, "stroke-dasharray": g, "stroke-linecap": a === "dotted" ? "round" : "square", "clip-path": i2 ? `url(#${i2})` : void 0 });
}
async function* mn(e, t) {
  var wo;
  let n = await Ce(), { parentStyle: r, inheritedStyle: i2, parent: s, font: o, id: a, isInheritingTransform: u, debug: l, embedFont: f, graphemeImages: d, locale: g, canLoadAdditionalAssets: h } = t, { textAlign: p, textOverflow: v, whiteSpace: _, wordBreak: b, lineHeight: y, filter: S, _inheritedBackgroundClipTextPath: E } = r;
  r.textTransform === "uppercase" ? e = e.toLocaleUpperCase(g) : r.textTransform === "lowercase" ? e = e.toLocaleLowerCase(g) : r.textTransform === "capitalize" && (e = ce(e, "word", g).map((W) => ce(W, "grapheme", g).map((B, q) => q === 0 ? B.toLocaleUpperCase(g) : B).join("")).join(""));
  let T = ["pre", "pre-wrap", "pre-line"].includes(_), D = !["pre", "pre-wrap"].includes(_);
  T || (e = e.replace(/\n/g, " ")), D && (e = e.replace(/[ ]+/g, " "), e = e.trim());
  let F = b === "break-word", { words: L, requiredBreaks: H } = Mo(e, b), U = n.Node.create();
  U.setAlignItems(n.ALIGN_BASELINE), U.setJustifyContent(de(r.textAlign, { left: n.JUSTIFY_FLEX_START, right: n.JUSTIFY_FLEX_END, center: n.JUSTIFY_CENTER, justify: n.JUSTIFY_SPACE_BETWEEN, start: n.JUSTIFY_FLEX_START, end: n.JUSTIFY_FLEX_END }, n.JUSTIFY_FLEX_START, "textAlign")), s.insertChild(U, s.getChildCount());
  let J = r.fontSize, M = o.getEngine(J, y, r, g), V = h ? ce(e, "grapheme").filter((W) => !M.has(W)) : [];
  yield V.map((W) => ({ word: W, locale: g })), V.length && (M = o.getEngine(J, y, r, g));
  let ne = /* @__PURE__ */ new Map();
  function te(W) {
    if (ne.has(W))
      return ne.get(W);
    let B = M.measure(W, r);
    return ne.set(W, B), B;
  }
  __name(te, "te");
  function ie(W) {
    let B = 0, q = false;
    for (let oe of W)
      d && d[oe] ? (B += r.fontSize, q = true) : B += te(oe);
    return { width: B, isImage: q };
  }
  __name(ie, "ie");
  let Me2 = /* @__PURE__ */ __name((W) => {
    if (W.length === 0)
      return { originWidth: 0, endingSpacesWidth: 0, isImage: false };
    let { width: B, isImage: q } = ie(ce(W, "grapheme")), oe = W.trimEnd() === W ? B : ie(ce(W.trimEnd(), "grapheme")).width;
    return { originWidth: B, endingSpacesWidth: B - oe, isImage: q };
  }, "Me2");
  typeof r.flexShrink > "u" && s.setFlexShrink(1);
  let I = [], $ = [], z = [], N = [];
  function be(W) {
    let B = 0, q = 0, oe = 0, ge = -1, ve = 0, re = 0, ae = 0;
    I = [], z = [0], N = [];
    for (let Pe = 0; Pe < L.length; Pe++) {
      let K = L[Pe], Ye = T && H[Pe], ye = 0, qe = 0, { originWidth: it, endingSpacesWidth: Be, isImage: ue } = Me2(K);
      ye = it, qe = Be, Ye && re === 0 && (re = M.height(K));
      let fe = ",.!?:-@)>]}%#".indexOf(K[0]) < 0, Ue = !q, mt2 = Pe && fe && q + ye > W + qe && _ !== "nowrap" && _ !== "pre";
      if (F && ye > W && (!q || mt2 || Ye)) {
        let hr = ce(K, "grapheme");
        L.splice(Pe, 1, "", ...hr), q > 0 && (I.push(q), $.push(ae), B++, ve += re, q = 0, re = 0, ae = 0, z.push(1), ge = -1);
        continue;
      }
      if (Ye || mt2)
        D && K === " " && (ye = 0), I.push(q), $.push(ae), B++, ve += re, q = ye, re = ye ? M.height(K) : 0, ae = ye ? M.baseline(K) : 0, z.push(1), ge = -1, Ye || (oe = Math.max(oe, W));
      else {
        q += ye;
        let hr = M.height(K);
        hr > re && (re = hr, ae = M.baseline(K)), Ue && z[z.length - 1]++;
      }
      Ue && ge++, oe = Math.max(oe, q), N[Pe] = { y: ve, x: q - ye, width: ue ? it - Be : ye, line: B, lineIndex: ge };
    }
    return q && (B++, I.push(q), $.push(ae), ve += re), { width: oe, height: ve };
  }
  __name(be, "be");
  U.setMeasureFunc((W) => {
    let { width: B, height: q } = be(W);
    if (r.textWrap === "balance") {
      let oe = B / 2, ge = B, ve = B;
      for (; oe + 1 < ge; ) {
        ve = (oe + ge) / 2;
        let { height: re } = be(ve);
        re > q ? oe = ve : ge = ve;
      }
      return be(ge), { width: ge, height: q };
    }
    return { width: B, height: q };
  });
  let [pt, Uu] = yield, Xr = "", ur = "", $e = i2._inheritedClipPathId, ho = i2._inheritedMaskId, { left: mo, top: go, width: lr, height: vo } = U.getComputedLayout(), Qr = s.getComputedWidth() - s.getComputedPadding(n.EDGE_LEFT) - s.getComputedPadding(n.EDGE_RIGHT) - s.getComputedBorder(n.EDGE_LEFT) - s.getComputedBorder(n.EDGE_RIGHT), rt = pt + mo, nt = Uu + go, { matrix: Le, opacity: fr } = Xo({ left: mo, top: go, width: lr, height: vo, isInheritingTransform: u }, r), cr = "";
  r.textShadowOffset && (cr = Qo({ width: lr, height: vo, id: a }, { shadowColor: r.textShadowColor, shadowOffset: r.textShadowOffset, shadowRadius: r.textShadowRadius }));
  let ht = "", dr = "", bo = "", Kr = -1, yo = v === "ellipsis" ? ie(["\u2026"]).width : 0, zu = v === "ellipsis" ? ie([" "]).width : 0, pr = {}, We = null, xo = 0;
  for (let W = 0; W < L.length; W++) {
    let B = N[W];
    if (!B)
      continue;
    let q = L[W], oe = null, ge = false, ve = d ? d[ce(q, "grapheme")[0]] : null, re = B.y, ae = B.x, Pe = B.width, K = B.line;
    if (K === Kr)
      continue;
    let Ye = false;
    if (I.length > 1) {
      let ue = lr - I[K];
      if (p === "right" || p === "end")
        ae += ue;
      else if (p === "center")
        ae += ue / 2;
      else if (p === "justify" && K < I.length - 1) {
        let fe = z[K];
        ae += (fe > 1 ? ue / (fe - 1) : 0) * B.lineIndex, Ye = true;
      }
    }
    if (pr[K] || (pr[K] = [ae, Ye ? lr : I[K]]), v === "ellipsis" && I[K] > Qr && B.x + Pe + yo + zu > Qr) {
      let ue = ce(q, "grapheme", g), fe = "", Ue = 0;
      for (let mt2 of ue) {
        let Jr = B.x + ie([fe + mt2]).width;
        if (fe && Jr + yo > Qr)
          break;
        fe += mt2, Ue = Jr;
      }
      q = fe + "\u2026", Kr = K, pr[K][1] = Ue, ge = true;
    }
    let ye = $[K], qe = M.baseline(q), it = M.height(q), Be = ye - qe;
    if (ve)
      re += 0;
    else if (f) {
      if (!Lo.includes(q) && L[W + 1] && !d[ce(L[W + 1], "grapheme")[0]] && N[W + 1] && re === N[W + 1].y && !ge) {
        We === null && (xo = ae), We = We === null ? q : We + q;
        continue;
      }
      let ue = We === null ? q : We + q, fe = We === null ? ae : xo, Ue = B.width + ae - fe;
      oe = M.getSVG(ue, { ...r, left: rt + fe, top: nt + re + qe + Be, letterSpacing: r.letterSpacing }), We = null, l && (bo += R("rect", { x: rt + fe, y: nt + re + Be, width: Ue, height: it, fill: "transparent", stroke: "#575eff", "stroke-width": 1, transform: Le || void 0, "clip-path": $e ? `url(#${$e})` : void 0 }) + R("line", { x1: rt + ae, x2: rt + ae + B.width, y1: nt + re + Be + qe, y2: nt + re + Be + qe, stroke: "#14c000", "stroke-width": 1, transform: Le || void 0, "clip-path": $e ? `url(#${$e})` : void 0 }));
    } else
      re += qe + Be;
    if (r.textDecorationLine && (K !== ((wo = N[W + 1]) == null ? void 0 : wo.line) || Kr === K)) {
      let ue = pr[K];
      ue && !ue[2] && (ht += hn({ left: rt + ue[0], top: nt + it * +K, width: ue[1], ascender: M.baseline(q), clipPathId: $e }, r), ue[2] = 1);
    }
    if (oe !== null)
      dr += oe + " ";
    else {
      let [ue, fe] = pn({ content: q, filter: cr, id: a, left: rt + ae, top: nt + re, width: Pe, height: it, matrix: Le, opacity: fr, image: ve, clipPathId: $e, debug: l, shape: !!E, decorationShape: ht }, r);
      Xr += ue, ur += fe, ht = "";
    }
  }
  if (dr) {
    let W = r.color !== "transparent" && fr !== 0 ? R("path", { fill: r.color, d: dr, transform: Le || void 0, opacity: fr !== 1 ? fr : void 0, "clip-path": $e ? `url(#${$e})` : void 0, mask: ho ? `url(#${ho})` : void 0, style: S ? `filter:${S}` : void 0 }) : "";
    E && (ur = R("path", { d: dr, transform: Le || void 0 })), Xr += (cr ? cr + R("g", { filter: `url(#satori_s-${a})` }, W + ht) : W + ht) + bo;
  }
  return ur && (r._inheritedBackgroundClipTextPath.value += ur), Xr;
}
function Ll(e) {
  return e.type === "literal" ? e.value : e.type === "hex" ? `#${e.value}` : e.type === "rgb" ? `rgb(${e.value.join(",")})` : e.type === "rgba" ? `rgba(${e.value.join(",")})` : "transparent";
}
function Cl(e) {
  let t = 0, n = 0, r = 0, i2 = 0;
  return e.includes("top") ? n = 1 : e.includes("bottom") && (i2 = 1), e.includes("left") ? t = 1 : e.includes("right") && (r = 1), !t && !r && !n && !i2 && (n = 1), [t, n, r, i2];
}
function Dl(e, t) {
  return typeof e == "string" && e.endsWith("%") ? t * parseFloat(e) / 100 : +e;
}
function bn(e, { x: t, y: n, defaultX: r, defaultY: i2 }) {
  return (e ? e.split(" ").map((s) => {
    try {
      let o = new ze(s);
      return o.type === "length" || o.type === "number" ? o.value : o.value + o.unit;
    } catch {
      return null;
    }
  }).filter((s) => s !== null) : [r, i2]).map((s, o) => Dl(s, [t, n][o]));
}
function Zo(e, t) {
  let n = [];
  for (let o of t) {
    let a = Ll(o);
    if (!n.length && (n.push({ offset: 0, color: a }), typeof o.length > "u" || o.length.value === "0"))
      continue;
    let u = typeof o.length > "u" ? void 0 : o.length.type === "%" ? o.length.value / 100 : o.length.value / e;
    n.push({ offset: u, color: a });
  }
  n.length || n.push({ offset: 0, color: "transparent" });
  let r = n[n.length - 1];
  r.offset !== 1 && (typeof r.offset > "u" ? r.offset = 1 : n.push({ offset: 1, color: r.color }));
  let i2 = 0, s = 1;
  for (let o = 0; o < n.length; o++)
    if (typeof n[o].offset > "u") {
      for (s < o && (s = o); typeof n[s].offset > "u"; )
        s++;
      n[o].offset = (n[s].offset - n[i2].offset) / (s - i2) * (o - i2) + n[i2].offset;
    } else
      i2 = o;
  return n;
}
async function yn({ id: e, width: t, height: n, left: r, top: i2 }, { image: s, size: o, position: a, repeat: u }) {
  u = u || "repeat";
  let l = u === "repeat-x" || u === "repeat", f = u === "repeat-y" || u === "repeat", d = bn(o, { x: t, y: n, defaultX: t, defaultY: n }), g = bn(a, { x: t, y: n, defaultX: 0, defaultY: 0 });
  if (s.startsWith("linear-gradient(")) {
    let h = vn.parse(s)[0], [p, v] = d, _, b, y, S;
    if (h.orientation.type === "directional")
      [_, b, y, S] = Cl(h.orientation.value);
    else if (h.orientation.type === "angular") {
      let L = +h.orientation.value / 180 * Math.PI - Math.PI / 2, H = Math.cos(L), U = Math.sin(L);
      _ = 0, b = 0, y = H, S = U, y < 0 && (_ -= y, y = 0), S < 0 && (b -= S, S = 0);
    }
    let E = Zo(t, h.colorStops), T = `satori_bi${e}`, D = `satori_pattern_${e}`, F = R("pattern", { id: D, x: g[0] / t, y: g[1] / n, width: l ? p / t : "1", height: f ? v / n : "1", patternUnits: "objectBoundingBox" }, R("linearGradient", { id: T, x1: _, y1: b, x2: y, y2: S }, E.map((L) => R("stop", { offset: L.offset * 100 + "%", "stop-color": L.color })).join("")) + R("rect", { x: 0, y: 0, width: p, height: v, fill: `url(#${T})` }));
    return [D, F];
  }
  if (s.startsWith("radial-gradient(")) {
    let h = vn.parse(s)[0], p = h.orientation[0], [v, _] = d, b = "circle", y = v / 2, S = _ / 2;
    if (p.type === "shape") {
      if (b = p.value, p.at)
        if (p.at.type === "position")
          y = p.at.value.x.value, S = p.at.value.y.value;
        else
          throw new Error("orientation.at.type not implemented: " + p.at.type);
    } else
      throw new Error("orientation.type not implemented: " + p.type);
    let E = Zo(t, h.colorStops), T = `satori_radial_${e}`, D = `satori_pattern_${e}`, F = `satori_mask_${e}`, L = {}, H = Math.max(Math.abs(v - y), Math.abs(y)), U = Math.max(Math.abs(_ - S), Math.abs(S));
    if (b === "circle")
      L.r = Math.sqrt(H * H + U * U);
    else if (b === "ellipse") {
      let V = U !== 0 ? H / U : 1;
      L.ry = Math.sqrt(H * H + U * U * V * V) / V, L.rx = L.ry * V;
    }
    let J = R("pattern", { id: D, x: g[0] / t, y: g[1] / n, width: l ? v / t : "1", height: f ? _ / n : "1", patternUnits: "objectBoundingBox" }, R("radialGradient", { id: T }, E.map((V) => R("stop", { offset: V.offset, "stop-color": V.color })).join("")) + R("mask", { id: F }, R("rect", { x: 0, y: 0, width: v, height: _, fill: "#fff" })) + R(b, { cx: y, cy: S, width: v, height: _, ...L, fill: `url(#${T})`, mask: `url(#${F})` }));
    return [D, J];
  }
  if (s.startsWith("url(")) {
    let h = bn(o, { x: t, y: n, defaultX: 0, defaultY: 0 }), [p, v, _] = await Sr(s.slice(4, -1)), b = h[0] || v, y = h[1] || _;
    return [`satori_bi${e}`, R("pattern", { id: `satori_bi${e}`, patternContentUnits: "userSpaceOnUse", patternUnits: "userSpaceOnUse", x: g[0] + r, y: g[1] + i2, width: l ? b : "100%", height: f ? y : "100%" }, R("image", { x: 0, y: 0, width: b, height: y, preserveAspectRatio: "none", href: p }))];
  }
  throw new Error(`Invalid background image: "${s}"`);
}
function Fl([e, t]) {
  return Math.round(e * 1e3) === 0 && Math.round(t * 1e3) === 0 ? 0 : Math.round(e * t / Math.sqrt(e * e + t * t) * 1e3) / 1e3;
}
function kr(e, t, n) {
  return n < e + t && (n / 2 < e && n / 2 < t ? e = t = n / 2 : n / 2 < e ? e = n - t : n / 2 < t && (t = n - e)), [e, t];
}
function Tr(e) {
  e[0] = e[1] = Math.min(e[0], e[1]);
}
function Or(e, t, n, r, i2) {
  if (typeof e == "string") {
    let s = e.split(" ").map((a) => a.trim()), o = !s[1] && !s[0].endsWith("%");
    return s[1] = s[1] || s[0], [o, [Math.min(xe(s[0], r, t, i2, true), t), Math.min(xe(s[1], r, n, i2, true), n)]];
  }
  return typeof e == "number" ? [true, [Math.min(e, t), Math.min(e, n)]] : [true, void 0];
}
function st({ left: e, top: t, width: n, height: r }, i2, s) {
  let { borderTopLeftRadius: o, borderTopRightRadius: a, borderBottomLeftRadius: u, borderBottomRightRadius: l, fontSize: f } = i2, d, g, h, p;
  if ([d, o] = Or(o, n, r, f, i2), [g, a] = Or(a, n, r, f, i2), [h, u] = Or(u, n, r, f, i2), [p, l] = Or(l, n, r, f, i2), !s && !Er(o) && !Er(a) && !Er(u) && !Er(l))
    return "";
  o ||= [0, 0], a ||= [0, 0], u ||= [0, 0], l ||= [0, 0], [o[0], a[0]] = kr(o[0], a[0], n), [u[0], l[0]] = kr(u[0], l[0], n), [o[1], u[1]] = kr(o[1], u[1], r), [a[1], l[1]] = kr(a[1], l[1], r), d && Tr(o), g && Tr(a), h && Tr(u), p && Tr(l);
  let v = [];
  v[0] = [a, a], v[1] = [l, [-l[0], l[1]]], v[2] = [u, [-u[0], -u[1]]], v[3] = [o, [o[0], -o[1]]];
  let _ = `h${n - o[0] - a[0]} a${v[0][0]} 0 0 1 ${v[0][1]}`, b = `v${r - a[1] - l[1]} a${v[1][0]} 0 0 1 ${v[1][1]}`, y = `h${l[0] + u[0] - n} a${v[2][0]} 0 0 1 ${v[2][1]}`, S = `v${u[1] + o[1] - r} a${v[3][0]} 0 0 1 ${v[3][1]}`;
  if (s) {
    let T = /* @__PURE__ */ __name(function(M) {
      let V = Fl([o, a, l, u][M]);
      return M === 0 ? [[e + o[0] - V, t + o[1] - V], [e + o[0], t]] : M === 1 ? [[e + n - a[0] + V, t + a[1] - V], [e + n, t + a[1]]] : M === 2 ? [[e + n - l[0] + V, t + r - l[1] + V], [e + n - l[0], t + r]] : [[e + u[0] - V, t + r - u[1] + V], [e, t + r - u[1]]];
    }, "T"), E = s.indexOf(false);
    if (!s.includes(true))
      throw new Error("Invalid `partialSides`.");
    if (E === -1)
      E = 0;
    else
      for (; !s[E]; )
        E = (E + 1) % 4;
    let D = "", F = T(E), L = `M${F[0]} A${v[(E + 3) % 4][0]} 0 0 1 ${F[1]}`, H = 0;
    for (; H < 4 && s[(E + H) % 4]; H++)
      D += L + " ", L = [_, b, y, S][(E + H) % 4];
    let U = (E + H) % 4;
    D += L.split(" ")[0];
    let J = T(U);
    return D += ` A${v[(U + 3) % 4][0]} 0 0 1 ${J[0]}`, D;
  }
  return `M${e + o[0]},${t} ${_} ${b} ${y} ${S}`;
}
function es(e, t, n) {
  return n[e + "Width"] === n[t + "Width"] && n[e + "Style"] === n[t + "Style"] && n[e + "Color"] === n[t + "Color"];
}
function ts({ id: e, currentClipPathId: t, borderPath: n, borderType: r, left: i2, top: s, width: o, height: a }, u) {
  if (!(u.borderTopWidth || u.borderRightWidth || u.borderBottomWidth || u.borderLeftWidth))
    return null;
  let f = `satori_bc-${e}`;
  return [R("clipPath", { id: f, "clip-path": t ? `url(#${t})` : void 0 }, R(r, { x: i2, y: s, width: o, height: a, d: n || void 0 })), f];
}
function _t({ left: e, top: t, width: n, height: r, props: i2, asContentMask: s, maskBorderOnly: o }, a) {
  let u = ["borderTop", "borderRight", "borderBottom", "borderLeft"];
  if (!s && !u.some((h) => a[h + "Width"]))
    return "";
  let l = "", f = 0;
  for (; f > 0 && es(u[f], u[(f + 3) % 4], a); )
    f = (f + 3) % 4;
  let d = [false, false, false, false], g = [];
  for (let h = 0; h < 4; h++) {
    let p = (f + h) % 4, v = (f + h + 1) % 4, _ = u[p], b = u[v];
    if (d[p] = true, g = [a[_ + "Width"], a[_ + "Style"], a[_ + "Color"], _], !es(_, b, a)) {
      let y = (g[0] || 0) + (s && !o && a[_.replace("border", "padding")] || 0);
      y && (l += R("path", { width: n, height: r, ...i2, fill: "none", stroke: s ? "#000" : g[2], "stroke-width": y * 2, "stroke-dasharray": !s && g[1] === "dashed" ? y * 2 + " " + y : void 0, d: st({ left: e, top: t, width: n, height: r }, a, d) })), d = [false, false, false, false];
    }
  }
  if (d.some(Boolean)) {
    let h = (g[0] || 0) + (s && !o && a[g[3].replace("border", "padding")] || 0);
    h && (l += R("path", { width: n, height: r, ...i2, fill: "none", stroke: s ? "#000" : g[2], "stroke-width": h * 2, "stroke-dasharray": !s && g[1] === "dashed" ? h * 2 + " " + h : void 0, d: st({ left: e, top: t, width: n, height: r }, a, d) }));
  }
  return l;
}
function xn({ id: e, left: t, top: n, width: r, height: i2, matrix: s, borderOnly: o }, a) {
  let u = (a.borderLeftWidth || 0) + (o ? 0 : a.paddingLeft || 0), l = (a.borderTopWidth || 0) + (o ? 0 : a.paddingTop || 0), f = (a.borderRightWidth || 0) + (o ? 0 : a.paddingRight || 0), d = (a.borderBottomWidth || 0) + (o ? 0 : a.paddingBottom || 0), g = { x: t + u, y: n + l, width: r - u - f, height: i2 - l - d };
  return R("mask", { id: e }, R("rect", { ...g, fill: "#fff", mask: a._inheritedMaskId ? `url(#${a._inheritedMaskId})` : void 0 }) + _t({ left: t, top: n, width: r, height: i2, props: { transform: s || void 0 }, asContentMask: true, maskBorderOnly: o }, a));
}
function wn({ left: e, top: t, width: n, height: r, path: i2, matrix: s, id: o, currentClipPath: a, src: u }, l) {
  if (l.overflow !== "hidden" && !u)
    return "";
  let f = xn({ id: `satori_om-${o}`, left: e, top: t, width: n, height: r, matrix: s, borderOnly: !u }, l);
  return R("clipPath", { id: `satori_cp-${o}`, "clip-path": a }, R(i2 ? "path" : "rect", { x: e, y: t, width: n, height: r, d: i2 || void 0 })) + f;
}
async function St({ id: e, left: t, top: n, width: r, height: i2, isInheritingTransform: s, src: o, debug: a }, u) {
  if (u.display === "none")
    return "";
  let l = !!o, f = "rect", d = "", g = "", h = [], p = 1, v = "";
  u.backgroundColor && h.push(u.backgroundColor), u.opacity !== void 0 && (p = +u.opacity), u.transform && (d = wt({ left: t, top: n, width: r, height: i2 }, u.transform, s, u.transformOrigin));
  let _ = "";
  if (u.backgroundImage) {
    let J = [];
    for (let M = 0; M < u.backgroundImage.length; M++) {
      let V = u.backgroundImage[M], ne = await yn({ id: e + "_" + M, width: r, height: i2, left: t, top: n }, V);
      ne && J.unshift(ne);
    }
    for (let M of J)
      h.push(`url(#${M[0]})`), g += M[1], M[2] && (_ += M[2]);
  }
  let b = st({ left: t, top: n, width: r, height: i2 }, u);
  b && (f = "path");
  let y = u._inheritedClipPathId, S = u._inheritedMaskId;
  a && (v = R("rect", { x: t, y: n, width: r, height: i2, fill: "transparent", stroke: "#ff5757", "stroke-width": 1, transform: d || void 0, "clip-path": y ? `url(#${y})` : void 0 }));
  let { backgroundClip: E, filter: T } = u, D = E === "text" ? `url(#satori_bct-${e})` : y ? `url(#${y})` : void 0, F = wn({ left: t, top: n, width: r, height: i2, path: b, id: e, matrix: d, currentClipPath: D, src: o }, u), L = h.map((J) => R(f, { x: t, y: n, width: r, height: i2, fill: J, d: b || void 0, transform: d || void 0, "clip-path": D, style: T ? `filter:${T}` : void 0, mask: S ? `url(#${S})` : void 0 })).join(""), H = ts({ id: e, left: t, top: n, width: r, height: i2, currentClipPathId: y, borderPath: b, borderType: f }, u);
  if (l) {
    let J = (u.borderLeftWidth || 0) + (u.paddingLeft || 0), M = (u.borderTopWidth || 0) + (u.paddingTop || 0), V = (u.borderRightWidth || 0) + (u.paddingRight || 0), ne = (u.borderBottomWidth || 0) + (u.paddingBottom || 0), te = u.objectFit === "contain" ? "xMidYMid" : u.objectFit === "cover" ? "xMidYMid slice" : "none";
    L += R("image", { x: t + J, y: n + M, width: r - J - V, height: i2 - M - ne, href: o, preserveAspectRatio: te, transform: d || void 0, style: T ? `filter:${T}` : void 0, "clip-path": `url(#satori_cp-${e})`, mask: `url(#satori_om-${e})` });
  }
  if (H) {
    g += H[0];
    let J = H[1];
    L += _t({ left: t, top: n, width: r, height: i2, props: { transform: d || void 0, "clip-path": `url(#${J})` } }, u);
  }
  let U = Ko({ width: r, height: i2, id: e, opacity: p, shape: R(f, { x: t, y: n, width: r, height: i2, fill: "#fff", stroke: "#fff", "stroke-width": 0, d: b || void 0, transform: d || void 0, "clip-path": D, mask: S ? `url(#${S})` : void 0 }) }, u);
  return (g ? R("defs", {}, g) : "") + (U ? U[0] : "") + F + (p !== 1 ? `<g opacity="${p}">` : "") + (_ || L) + (p !== 1 ? "</g>" : "") + (U ? U[1] : "") + v;
}
function rs(e) {
  return Pr.includes(e);
}
function ns(e, t) {
  if (t && kt[t] && kt[t].test(e))
    return t;
  for (let n of Object.keys(_n))
    if (_n[n].test(e))
      return n;
  for (let n of Object.keys(kt))
    if (kt[n].test(e))
      return n;
  return "unknown";
}
function is(e) {
  if (e)
    return Pr.find((t) => t.toLowerCase() === e.toLowerCase() || t.toLowerCase().startsWith(e.toLowerCase()));
}
async function* Tt(e, t) {
  let n = await Ce(), { id: r, inheritedStyle: i2, parent: s, font: o, debug: a, locale: u, embedFont: l = true, graphemeImages: f, canLoadAdditionalAssets: d, getTwStyles: g } = t;
  if (e === null || typeof e > "u")
    return yield, yield, "";
  if (!sn(e) || typeof e.type == "function") {
    let N;
    if (!sn(e))
      N = mn(String(e), t), yield (await N.next()).value;
    else {
      if (Ao(e.type))
        throw new Error("Class component is not supported.");
      N = Tt(e.type(e.props), t), yield (await N.next()).value;
    }
    await N.next();
    let be = yield;
    return (await N.next(be)).value;
  }
  let { type: h, props: p } = e;
  if (p && Io(p))
    throw new Error("dangerouslySetInnerHTML property is not supported. See documentation for more information https://github.com/vercel/satori#jsx.");
  let { style: v, children: _, tw: b, lang: y = u } = p || {}, S = is(y);
  if (b) {
    let N = g(b, v);
    v = Object.assign(N, v);
  }
  let E = n.Node.create();
  s.insertChild(E, s.getChildCount());
  let [T, D] = await dn(E, h, i2, v, p), F = T.transform === i2.transform;
  if (F || (T.transform.__parent = i2.transform), T.overflow === "hidden" && (D._inheritedClipPathId = `satori_cp-${r}`, D._inheritedMaskId = `satori_om-${r}`), T.backgroundClip === "text") {
    let N = { value: "" };
    D._inheritedBackgroundClipTextPath = N, T._inheritedBackgroundClipTextPath = N;
  }
  let L = Ro(_), H = [], U = 0, J = [];
  for (let N of L) {
    let be = Tt(N, { id: r + "-" + U++, parentStyle: T, inheritedStyle: D, isInheritingTransform: true, parent: E, font: o, embedFont: l, debug: a, graphemeImages: f, canLoadAdditionalAssets: d, locale: S, getTwStyles: g });
    d ? J.push(...(await be.next()).value || []) : await be.next(), H.push(be);
  }
  yield J;
  for (let N of H)
    await N.next();
  let [M, V] = yield, { left: ne, top: te, width: ie, height: Me2 } = E.getComputedLayout();
  ne += M, te += V;
  let I = "", $ = "", z = "";
  if (h === "img") {
    let N = T.__src;
    $ = await St({ id: r, left: ne, top: te, width: ie, height: Me2, src: N, isInheritingTransform: F, debug: a }, T);
  } else if (h === "svg") {
    let N = T.color, be = Fo(e, N);
    $ = await St({ id: r, left: ne, top: te, width: ie, height: Me2, src: be, isInheritingTransform: F, debug: a }, T);
  } else {
    let N = v == null ? void 0 : v.display;
    if (h === "div" && _ && typeof _ != "string" && N !== "flex" && N !== "none")
      throw new Error('Expected <div> to have explicit "display: flex" or "display: none" if it has more than one child node.');
    $ = await St({ id: r, left: ne, top: te, width: ie, height: Me2, isInheritingTransform: F, debug: a }, T);
  }
  for (let N of H)
    I += (await N.next([ne, te])).value;
  return T._inheritedBackgroundClipTextPath && (z += R("clipPath", { id: `satori_bct-${r}`, "clip-path": T._inheritedClipPathId ? `url(#${T._inheritedClipPathId})` : void 0 }, T._inheritedBackgroundClipTextPath.value)), z + $ + I;
}
function $l(e, t, [n, r], [i2, s]) {
  if (n !== i2)
    return n ? !i2 || n === e ? -1 : i2 === e ? 1 : e === 400 && n === 500 || e === 500 && n === 400 ? -1 : e === 400 && i2 === 500 || e === 500 && i2 === 400 ? 1 : e < 400 ? n < e && i2 < e ? i2 - n : n < e ? -1 : i2 < e ? 1 : n - i2 : e < n && e < i2 ? n - i2 : e < n ? -1 : e < i2 ? 1 : i2 - n : 1;
  if (r !== s) {
    if (r === t)
      return -1;
    if (s === t)
      return 1;
  }
  return -1;
}
function Wl(e) {
  let t = e.split("_"), n = t[t.length - 1];
  return n === os ? void 0 : n;
}
function kn({ width: e, height: t, content: n }) {
  return R("svg", { width: e, height: t, viewBox: `0 0 ${e} ${t}`, xmlns: "http://www.w3.org/2000/svg" }, n);
}
function vu(e) {
  return O0.includes(e);
}
function bu(e) {
  return E0.includes(e);
}
function Qi(e) {
  return typeof e == "string";
}
function Ki(e) {
  return typeof e == "object";
}
function m(e) {
  return { kind: "complete", style: e };
}
function se(e, t = {}) {
  let { fractions: n } = t;
  if (n && e.includes("/")) {
    let [s = "", o = ""] = e.split("/", 2), a = se(s), u = se(o);
    return !a || !u ? null : [a[0] / u[0], u[1]];
  }
  let r = parseFloat(e);
  if (Number.isNaN(r))
    return null;
  let i2 = e.match(/(([a-z]{2,}|%))$/);
  if (!i2)
    return [r, j.none];
  switch (i2 == null ? void 0 : i2[1]) {
    case "rem":
      return [r, j.rem];
    case "px":
      return [r, j.px];
    case "em":
      return [r, j.em];
    case "%":
      return [r, j.percent];
    case "vw":
      return [r, j.vw];
    case "vh":
      return [r, j.vh];
    default:
      return null;
  }
}
function Ne(e, t, n = {}) {
  let r = Ie(t, n);
  return r === null ? null : m({ [e]: r });
}
function Hr(e, t, n) {
  let r = Ie(t);
  return r !== null && (n[e] = r), n;
}
function xu(e, t) {
  let n = Ie(t);
  return n === null ? null : { [e]: n };
}
function Ie(e, t = {}) {
  if (e === void 0)
    return null;
  let n = se(String(e), t);
  return n ? Ve(...n, t) : null;
}
function Ve(e, t, n = {}) {
  let { isNegative: r, device: i2 } = n;
  switch (t) {
    case j.rem:
      return e * 16 * (r ? -1 : 1);
    case j.px:
      return e * (r ? -1 : 1);
    case j.percent:
      return `${r ? "-" : ""}${e}%`;
    case j.none:
      return e * (r ? -1 : 1);
    case j.vw:
      return i2 != null && i2.windowDimensions ? i2.windowDimensions.width * (e / 100) : (me("`vw` CSS unit requires configuration with `useDeviceContext()`"), null);
    case j.vh:
      return i2 != null && i2.windowDimensions ? i2.windowDimensions.height * (e / 100) : (me("`vh` CSS unit requires configuration with `useDeviceContext()`"), null);
    default:
      return null;
  }
}
function Zi(e) {
  let t = se(e);
  if (!t)
    return null;
  let [n, r] = t;
  switch (r) {
    case j.rem:
      return n * 16;
    case j.px:
      return n;
    default:
      return null;
  }
}
function eo(e) {
  return P0[e ?? ""] || "All";
}
function to(e) {
  let t = "All";
  return [e.replace(/^-(t|b|r|l|tr|tl|br|bl)(-|$)/, (r, i2) => (t = eo(i2), "")), t];
}
function et2(e, t = {}) {
  if (e.includes("/")) {
    let n = yu(e, { ...t, fractions: true });
    if (n)
      return n;
  }
  return e[0] === "[" && (e = e.slice(1, -1)), yu(e, t);
}
function Oe(e, t, n = {}) {
  let r = et2(t, n);
  return r === null ? null : m({ [e]: r });
}
function yu(e, t = {}) {
  if (e === "px")
    return 1;
  let n = se(e, t);
  if (!n)
    return null;
  let [r, i2] = n;
  return t.fractions && (i2 = j.percent, r *= 100), i2 === j.none && (r = r / 4, i2 = j.rem), Ve(r, i2, t);
}
function A0(...e) {
  console.warn(...e);
}
function I0(...e) {
}
function nr(e) {
  return { kind: "dependent", complete(t) {
    (!t.fontVariant || !Array.isArray(t.fontVariant)) && (t.fontVariant = []), t.fontVariant.push(e);
  } };
}
function no(e, t, n = {}) {
  let r = t == null ? void 0 : t[e];
  if (!r)
    return Oe("fontSize", e, n);
  if (typeof r == "string")
    return Ne("fontSize", r);
  let i2 = {}, [s, o] = r, a = xu("fontSize", s);
  if (a && (i2 = a), typeof o == "string")
    return m(Hr("lineHeight", wu(o, i2), i2));
  let { lineHeight: u, letterSpacing: l } = o;
  return u && Hr("lineHeight", wu(u, i2), i2), l && Hr("letterSpacing", l, i2), m(i2);
}
function wu(e, t) {
  let n = se(e);
  if (n) {
    let [r, i2] = n;
    if ((i2 === j.none || i2 === j.em) && typeof t.fontSize == "number")
      return t.fontSize * r;
  }
  return e;
}
function io(e, t) {
  var n;
  let r = (n = t == null ? void 0 : t[e]) !== null && n !== void 0 ? n : e.startsWith("[") ? e.slice(1, -1) : e, i2 = se(r);
  if (!i2)
    return null;
  let [s, o] = i2;
  if (o === j.none)
    return { kind: "dependent", complete(u) {
      if (typeof u.fontSize != "number")
        return "relative line-height utilities require that font-size be set";
      u.lineHeight = u.fontSize * s;
    } };
  let a = Ve(s, o);
  return a !== null ? m({ lineHeight: a }) : null;
}
function oo(e, t, n, r, i2) {
  let s = "";
  if (r[0] === "[")
    s = r.slice(1, -1);
  else {
    let l = i2 == null ? void 0 : i2[r];
    if (l)
      s = l;
    else {
      let f = et2(r);
      return f && typeof f == "number" ? _u(f, j.px, t, e) : null;
    }
  }
  if (s === "auto")
    return Su(t, e, "auto");
  let o = se(s);
  if (!o)
    return null;
  let [a, u] = o;
  return n && (a = -a), _u(a, u, t, e);
}
function _u(e, t, n, r) {
  let i2 = Ve(e, t);
  return i2 === null ? null : Su(n, r, i2);
}
function Su(e, t, n) {
  switch (e) {
    case "All":
      return { kind: "complete", style: { [`${t}Top`]: n, [`${t}Right`]: n, [`${t}Bottom`]: n, [`${t}Left`]: n } };
    case "Bottom":
    case "Top":
    case "Left":
    case "Right":
      return { kind: "complete", style: { [`${t}${e}`]: n } };
    case "Vertical":
      return { kind: "complete", style: { [`${t}Top`]: n, [`${t}Bottom`]: n } };
    case "Horizontal":
      return { kind: "complete", style: { [`${t}Left`]: n, [`${t}Right`]: n } };
    default:
      return null;
  }
}
function so(e) {
  if (!e)
    return {};
  let t = Object.entries(e).reduce((i2, [s, o]) => {
    let a = [0, 1 / 0, 0], u = typeof o == "string" ? { min: o } : o, l = u.min ? Zi(u.min) : 0;
    l === null ? me(`invalid screen config value: ${s}->min: ${u.min}`) : a[0] = l;
    let f = u.max ? Zi(u.max) : 1 / 0;
    return f === null ? me(`invalid screen config value: ${s}->max: ${u.max}`) : a[1] = f, i2[s] = a, i2;
  }, {}), n = Object.values(t);
  n.sort((i2, s) => {
    let [o, a] = i2, [u, l] = s;
    return a === 1 / 0 || l === 1 / 0 ? o - u : a - l;
  });
  let r = 0;
  return n.forEach((i2) => i2[2] = r++), t;
}
function ao(e, t) {
  let n = t == null ? void 0 : t[e];
  if (!n)
    return null;
  if (typeof n == "string")
    return m({ fontFamily: n });
  let r = n[0];
  return r ? m({ fontFamily: r }) : null;
}
function tt(e, t, n) {
  if (!n)
    return null;
  let r;
  t.includes("/") && ([t = "", r] = t.split("/", 2));
  let i2 = "";
  if (t.startsWith("[#") || t.startsWith("[rgb") ? i2 = t.slice(1, -1) : i2 = Ou(t, n), !i2)
    return null;
  if (r) {
    let s = Number(r);
    if (!Number.isNaN(s))
      return i2 = ku(i2, s / 100), m({ [Vr[e].color]: i2 });
  }
  return { kind: "dependent", complete(s) {
    let o = Vr[e].opacity, a = s[o];
    typeof a == "number" && (i2 = ku(i2, a)), s[Vr[e].color] = i2;
  } };
}
function or(e, t) {
  let n = parseInt(t, 10);
  if (Number.isNaN(n))
    return null;
  let r = n / 100, i2 = { [Vr[e].opacity]: r };
  return { kind: "complete", style: i2 };
}
function ku(e, t) {
  return e.startsWith("#") ? e = L0(e) : e.startsWith("rgb(") && (e = e.replace(/^rgb\(/, "rgba(").replace(/\)$/, ", 1)")), e.replace(/, ?\d*\.?(\d+)\)$/, `, ${t})`);
}
function Tu(e) {
  for (let t in e)
    t.startsWith("__opacity_") && delete e[t];
}
function L0(e) {
  let t = e;
  e = e.replace(C0, (o, a, u, l) => a + a + u + u + l + l);
  let n = D0.exec(e);
  if (!n)
    return me(`invalid config hex color value: ${t}`), "rgba(0, 0, 0, 1)";
  let r = parseInt(n[1], 16), i2 = parseInt(n[2], 16), s = parseInt(n[3], 16);
  return `rgba(${r}, ${i2}, ${s}, 1)`;
}
function Ou(e, t) {
  let n = t[e];
  if (Qi(n))
    return n;
  if (Ki(n) && Qi(n.DEFAULT))
    return n.DEFAULT;
  let [r = "", ...i2] = e.split("-");
  for (; r !== e; ) {
    let s = t[r];
    if (Ki(s))
      return Ou(i2.join("-"), s);
    if (i2.length === 0)
      return "";
    r = `${r}-${i2.shift()}`;
  }
  return "";
}
function Pu(e, t) {
  let [n, r] = to(e);
  if (n.match(/^(-?(\d)+)?$/))
    return F0(n, r, t == null ? void 0 : t.borderWidth);
  if (n = n.replace(/^-/, ""), ["dashed", "solid", "dotted"].includes(n))
    return m({ borderStyle: n });
  let s = "border";
  switch (r) {
    case "Bottom":
      s = "borderBottom";
      break;
    case "Top":
      s = "borderTop";
      break;
    case "Left":
      s = "borderLeft";
      break;
    case "Right":
      s = "borderRight";
      break;
  }
  let o = tt(s, n, t == null ? void 0 : t.borderColor);
  if (o)
    return o;
  let a = `border${r === "All" ? "" : r}Width`;
  n = n.replace(/^-/, "");
  let u = n.slice(1, -1), l = Oe(a, u);
  return typeof (l == null ? void 0 : l.style[a]) != "number" ? null : l;
}
function F0(e, t, n) {
  if (!n)
    return null;
  e = e.replace(/^-/, "");
  let i2 = n[e === "" ? "DEFAULT" : e];
  if (i2 === void 0)
    return null;
  let s = `border${t === "All" ? "" : t}Width`;
  return Ne(s, i2);
}
function Au(e, t) {
  if (!t)
    return null;
  let [n, r] = to(e);
  n = n.replace(/^-/, ""), n === "" && (n = "DEFAULT");
  let i2 = `border${r === "All" ? "" : r}Radius`, s = t[n];
  if (s)
    return Eu(Ne(i2, s));
  let o = Oe(i2, n);
  return typeof (o == null ? void 0 : o.style[i2]) != "number" ? null : Eu(o);
}
function Eu(e) {
  if ((e == null ? void 0 : e.kind) !== "complete")
    return e;
  let t = e.style.borderTopRadius;
  t !== void 0 && (e.style.borderTopLeftRadius = t, e.style.borderTopRightRadius = t, delete e.style.borderTopRadius);
  let n = e.style.borderBottomRadius;
  n !== void 0 && (e.style.borderBottomLeftRadius = n, e.style.borderBottomRightRadius = n, delete e.style.borderBottomRadius);
  let r = e.style.borderLeftRadius;
  r !== void 0 && (e.style.borderBottomLeftRadius = r, e.style.borderTopLeftRadius = r, delete e.style.borderLeftRadius);
  let i2 = e.style.borderRightRadius;
  return i2 !== void 0 && (e.style.borderBottomRightRadius = i2, e.style.borderTopRightRadius = i2, delete e.style.borderRightRadius), e;
}
function ct(e, t, n, r) {
  let i2 = null;
  e === "inset" && (t = t.replace(/^(x|y)-/, (a, u) => (i2 = u === "x" ? "x" : "y", "")));
  let s = r == null ? void 0 : r[t];
  if (s) {
    let a = Ie(s, { isNegative: n });
    if (a !== null)
      return Iu(e, i2, a);
  }
  let o = et2(t, { isNegative: n });
  return o !== null ? Iu(e, i2, o) : null;
}
function Iu(e, t, n) {
  if (e !== "inset")
    return m({ [e]: n });
  switch (t) {
    case null:
      return m({ top: n, left: n, right: n, bottom: n });
    case "y":
      return m({ top: n, bottom: n });
    case "x":
      return m({ left: n, right: n });
  }
}
function sr(e, t, n) {
  var r;
  t = t.replace(/^-/, "");
  let i2 = t === "" ? "DEFAULT" : t, s = Number((r = n == null ? void 0 : n[i2]) !== null && r !== void 0 ? r : t);
  return Number.isNaN(s) ? null : m({ [`flex${e}`]: s });
}
function Ru(e, t) {
  var n, r;
  if (e = (t == null ? void 0 : t[e]) || e, ["min-content", "revert", "unset"].includes(e))
    return null;
  if (e.match(/^\d+(\.\d+)?$/))
    return m({ flexGrow: Number(e), flexBasis: "0%" });
  let i2 = e.match(/^(\d+)\s+(\d+)$/);
  if (i2)
    return m({ flexGrow: Number(i2[1]), flexShrink: Number(i2[2]) });
  if (i2 = e.match(/^(\d+)\s+([^ ]+)$/), i2) {
    let s = Ie((n = i2[2]) !== null && n !== void 0 ? n : "");
    return s ? m({ flexGrow: Number(i2[1]), flexBasis: s }) : null;
  }
  if (i2 = e.match(/^(\d+)\s+(\d+)\s+(.+)$/), i2) {
    let s = Ie((r = i2[3]) !== null && r !== void 0 ? r : "");
    return s ? m({ flexGrow: Number(i2[1]), flexShrink: Number(i2[2]), flexBasis: s }) : null;
  }
  return null;
}
function uo(e, t, n = {}, r) {
  let i2 = r == null ? void 0 : r[t];
  return i2 !== void 0 ? Ne(e, i2, n) : Oe(e, t, n);
}
function ar(e, t, n = {}, r) {
  let i2 = Ie(r == null ? void 0 : r[t], n);
  return i2 ? m({ [e]: i2 }) : (t === "screen" && (t = e.includes("Width") ? "100vw" : "100vh"), Oe(e, t, n));
}
function Lu(e, t, n) {
  let r = n == null ? void 0 : n[e];
  if (r) {
    let i2 = se(r, { isNegative: t });
    if (!i2)
      return null;
    let [s, o] = i2;
    if (o === j.em)
      return N0(s);
    if (o === j.percent)
      return me("percentage-based letter-spacing configuration currently unsupported, switch to `em`s, or open an issue if you'd like to see support added."), null;
    let a = Ve(s, o, { isNegative: t });
    return a !== null ? m({ letterSpacing: a }) : null;
  }
  return Oe("letterSpacing", e, { isNegative: t });
}
function N0(e) {
  return { kind: "dependent", complete(t) {
    let n = t.fontSize;
    if (typeof n != "number" || Number.isNaN(n))
      return "tracking-X relative letter spacing classes require font-size to be set";
    t.letterSpacing = Math.round((e * n + Number.EPSILON) * 100) / 100;
  } };
}
function Cu(e, t) {
  let n = t == null ? void 0 : t[e];
  if (n) {
    let i2 = se(String(n));
    if (i2)
      return m({ opacity: i2[0] });
  }
  let r = se(e);
  return r ? m({ opacity: r[0] / 100 }) : null;
}
function Du(e) {
  let t = parseInt(e, 10);
  return Number.isNaN(t) ? null : { kind: "complete", style: { shadowOpacity: t / 100 } };
}
function Fu(e) {
  if (e.includes("/")) {
    let [n = "", r = ""] = e.split("/", 2), i2 = lo(n), s = lo(r);
    return i2 === null || s === null ? null : { kind: "complete", style: { shadowOffset: { width: i2, height: s } } };
  }
  let t = lo(e);
  return t === null ? null : { kind: "complete", style: { shadowOffset: { width: t, height: t } } };
}
function lo(e) {
  let t = et2(e);
  return typeof t == "number" ? t : null;
}
function Nu(e) {
  let t = [], n = null;
  return e.forEach((r) => {
    if (typeof r == "string")
      t = [...t, ...fo(r)];
    else if (Array.isArray(r))
      t = [...t, ...r.flatMap(fo)];
    else if (typeof r == "object" && r !== null)
      for (let [i2, s] of Object.entries(r))
        typeof s == "boolean" ? t = [...t, ...s ? fo(i2) : []] : n ? n[i2] = s : n = { [i2]: s };
  }), [t.filter(Boolean).filter(M0), n];
}
function fo(e) {
  return e.trim().split(/\s+/);
}
function M0(e, t, n) {
  return n.indexOf(e) === t;
}
function Mu(e) {
  var t;
  return (t = e == null ? void 0 : e.reduce((n, r) => ({ ...n, ...$0(r.handler) }), {})) !== null && t !== void 0 ? t : {};
}
function $0(e) {
  let t = {};
  return e({ addUtilities: /* @__PURE__ */ __name((n) => {
    t = n;
  }, "addUtilities"), ...W0 }), t;
}
function Re(e) {
  throw new Error(`tailwindcss plugin function argument object prop "${e}" not implemented`);
}
function Wu(e, t) {
  let n = (0, $u.default)(q0(e)), r = {}, i2 = Mu(n.plugins), s = {}, o = Object.entries(i2).map(([p, v]) => typeof v == "string" ? (s[p] = v, [p, { kind: "null" }]) : [p, m(v)]).filter(([, p]) => p.kind !== "null");
  function a() {
    return [r.windowDimensions ? `w${r.windowDimensions.width}` : false, r.windowDimensions ? `h${r.windowDimensions.height}` : false, r.fontScale ? `fs${r.fontScale}` : false, r.colorScheme === "dark" ? "dark" : false, r.pixelDensity === 2 ? "retina" : false].filter(Boolean).join("--") || "default";
  }
  __name(a, "a");
  let u = a(), l = {};
  function f() {
    let p = l[u];
    if (p)
      return p;
    let v = new ir(o);
    return l[u] = v, v;
  }
  __name(f, "f");
  function d(...p) {
    let v = f(), _ = {}, b = [], y = [], [S, E] = Nu(p), T = S.join(" "), D = v.getStyle(T);
    if (D)
      return { ...D, ...E || {} };
    for (let F of S) {
      let L = v.getIr(F);
      if (!L && F in s) {
        let U = d(s[F]);
        v.setIr(F, m(U)), _ = { ..._, ...U };
        continue;
      }
      switch (L = new dt(F, n, v, r, t).parse(), L.kind) {
        case "complete":
          _ = { ..._, ...L.style }, v.setIr(F, L);
          break;
        case "dependent":
          b.push(L);
          break;
        case "ordered":
          y.push(L);
          break;
        case "null":
          v.setIr(F, L);
          break;
      }
    }
    if (y.length > 0) {
      y.sort((F, L) => F.order - L.order);
      for (let F of y)
        switch (F.styleIr.kind) {
          case "complete":
            _ = { ..._, ...F.styleIr.style };
            break;
          case "dependent":
            b.push(F.styleIr);
            break;
        }
    }
    if (b.length > 0) {
      for (let F of b) {
        let L = F.complete(_);
        L && me(L);
      }
      Tu(_);
    }
    return T !== "" && v.setStyle(T, _), E && (_ = { ..._, ...E }), _;
  }
  __name(d, "d");
  function g(p) {
    let v = d(p.split(/\s+/g).map((_) => _.replace(/^(bg|text|border)-/, "")).map((_) => `bg-${_}`).join(" "));
    return typeof v.backgroundColor == "string" ? v.backgroundColor : void 0;
  }
  __name(g, "g");
  let h = /* @__PURE__ */ __name((p, ...v) => {
    let _ = "";
    return p.forEach((b, y) => {
      var S;
      _ += b + ((S = v[y]) !== null && S !== void 0 ? S : "");
    }), d(_);
  }, "h");
  return h.style = d, h.color = g, h.prefixMatch = (...p) => {
    let v = p.sort().join(":"), _ = f(), b = _.getPrefixMatch(v);
    if (b !== void 0)
      return b;
    let E = new dt(`${v}:flex`, n, _, r, t).parse().kind !== "null";
    return _.setPrefixMatch(v, E), E;
  }, h.setWindowDimensions = (p) => {
    r.windowDimensions = p, u = a();
  }, h.setFontScale = (p) => {
    r.fontScale = p, u = a();
  }, h.setPixelDensity = (p) => {
    r.pixelDensity = p, u = a();
  }, h.setColorScheme = (p) => {
    r.colorScheme = p, u = a();
  }, h;
}
function q0(e) {
  return { ...e, content: ["_no_warnings_please"] };
}
function z0(e) {
  return Wu({ ...e, plugins: [...(e == null ? void 0 : e.plugins) ?? [], U0] }, "web");
}
function co({ width: e, height: t, config: n }) {
  return Yr || (Yr = z0(n)), Yr.setWindowDimensions({ width: +e, height: +t }), Yr;
}
async function Bu(e, t) {
  let n = await Ce();
  if (!n || !n.Node)
    throw new Error("Satori is not initialized: expect `yoga` to be loaded, got " + n);
  t.fonts = t.fonts || [];
  let r;
  po.has(t.fonts) ? r = po.get(t.fonts) : po.set(t.fonts, r = new Ot(t.fonts));
  let i2 = "width" in t ? t.width : void 0, s = "height" in t ? t.height : void 0, o = n.Node.create();
  i2 && o.setWidth(i2), s && o.setHeight(s), o.setFlexDirection(n.FLEX_DIRECTION_ROW), o.setFlexWrap(n.WRAP_WRAP), o.setAlignContent(n.ALIGN_AUTO), o.setAlignItems(n.ALIGN_FLEX_START), o.setJustifyContent(n.JUSTIFY_FLEX_START), o.setOverflow(n.OVERFLOW_HIDDEN);
  let a = { ...t.graphemeImages }, u = /* @__PURE__ */ new Set(), l = Tt(e, { id: "id", parentStyle: {}, inheritedStyle: { fontSize: 16, fontWeight: "normal", fontFamily: "serif", fontStyle: "normal", lineHeight: 1.2, color: "black", opacity: 1, whiteSpace: "normal", _viewportWidth: i2, _viewportHeight: s }, parent: o, font: r, embedFont: t.embedFont, debug: t.debug, graphemeImages: a, canLoadAdditionalAssets: !!t.loadAdditionalAsset, getTwStyles: /* @__PURE__ */ __name((p, v) => {
    let b = { ...co({ width: i2, height: s, config: t.tailwindConfig })([p]) };
    return typeof b.lineHeight == "number" && (b.lineHeight = b.lineHeight / (+b.fontSize || v.fontSize || 16)), b.shadowColor && b.boxShadow && (b.boxShadow = b.boxShadow.replace(/rgba?\([^)]+\)/, b.shadowColor)), b;
  }, "getTwStyles") }), f = (await l.next()).value;
  if (t.loadAdditionalAsset && f.length) {
    let p = G0(f), v = [], _ = {};
    await Promise.all(Object.entries(p).flatMap(([b, y]) => y.map((S) => {
      let E = `${b}_${S}`;
      return u.has(E) ? null : (u.add(E), t.loadAdditionalAsset(b, S).then((T) => {
        typeof T == "string" ? _[S] = T : T && v.push(T);
      }));
    }))), r.addFonts(v), Object.assign(a, _);
  }
  await l.next(), o.calculateLayout(i2, s, n.DIRECTION_LTR);
  let d = (await l.next([0, 0])).value, g = o.getComputedWidth(), h = o.getComputedHeight();
  return o.freeRecursive(), kn({ width: g, height: h, content: d });
}
function G0(e) {
  let t = {}, n = {};
  for (let { word: r, locale: i2 } of e) {
    let s = ns(r, i2);
    n[s] = n[s] || "", n[s] += r;
  }
  return Object.keys(n).forEach((r) => {
    t[r] = t[r] || [], r === "emoji" ? t[r].push(...qu(ce(n[r], "grapheme"))) : (t[r][0] = t[r][0] || "", t[r][0] += qu(ce(n[r], "grapheme", r === "unknown" ? void 0 : r)).join(""));
  }), t;
}
function qu(e) {
  return Array.from(new Set(e));
}
function At2(y, l) {
  return l;
}
async function xn2(y) {
  let l = await Me({ instantiateWasm(f, T) {
    return WebAssembly.instantiate(y, f).then((g) => {
      T(g.instance || g);
    }), {};
  }, locateFile() {
    return "";
  } });
  return (0, je.default)(At2, l);
}
function addHeapObject(obj) {
  if (heap_next === heap.length)
    heap.push(heap.length + 1);
  const idx = heap_next;
  heap_next = heap[idx];
  heap[idx] = obj;
  return idx;
}
function getObject(idx) {
  return heap[idx];
}
function dropObject(idx) {
  if (idx < 132)
    return;
  heap[idx] = heap_next;
  heap_next = idx;
}
function takeObject(idx) {
  const ret = getObject(idx);
  dropObject(idx);
  return ret;
}
function getUint8Memory0() {
  if (cachedUint8Memory0 === null || cachedUint8Memory0.byteLength === 0) {
    cachedUint8Memory0 = new Uint8Array(wasm.memory.buffer);
  }
  return cachedUint8Memory0;
}
function passStringToWasm0(arg, malloc, realloc) {
  if (realloc === void 0) {
    const buf = cachedTextEncoder.encode(arg);
    const ptr2 = malloc(buf.length);
    getUint8Memory0().subarray(ptr2, ptr2 + buf.length).set(buf);
    WASM_VECTOR_LEN = buf.length;
    return ptr2;
  }
  let len = arg.length;
  let ptr = malloc(len);
  const mem = getUint8Memory0();
  let offset = 0;
  for (; offset < len; offset++) {
    const code = arg.charCodeAt(offset);
    if (code > 127)
      break;
    mem[ptr + offset] = code;
  }
  if (offset !== len) {
    if (offset !== 0) {
      arg = arg.slice(offset);
    }
    ptr = realloc(ptr, len, len = offset + arg.length * 3);
    const view = getUint8Memory0().subarray(ptr + offset, ptr + len);
    const ret = encodeString(arg, view);
    offset += ret.written;
  }
  WASM_VECTOR_LEN = offset;
  return ptr;
}
function isLikeNone(x2) {
  return x2 === void 0 || x2 === null;
}
function getInt32Memory0() {
  if (cachedInt32Memory0 === null || cachedInt32Memory0.byteLength === 0) {
    cachedInt32Memory0 = new Int32Array(wasm.memory.buffer);
  }
  return cachedInt32Memory0;
}
function getStringFromWasm0(ptr, len) {
  return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
}
function _assertClass(instance, klass) {
  if (!(instance instanceof klass)) {
    throw new Error(`expected instance of ${klass.name}`);
  }
  return instance.ptr;
}
async function load2(module, imports) {
  if (typeof Response === "function" && module instanceof Response) {
    if (typeof WebAssembly.instantiateStreaming === "function") {
      try {
        return await WebAssembly.instantiateStreaming(module, imports);
      } catch (e) {
        if (module.headers.get("Content-Type") != "application/wasm") {
          console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);
        } else {
          throw e;
        }
      }
    }
    const bytes = await module.arrayBuffer();
    return await WebAssembly.instantiate(bytes, imports);
  } else {
    const instance = await WebAssembly.instantiate(module, imports);
    if (instance instanceof WebAssembly.Instance) {
      return { instance, module };
    } else {
      return instance;
    }
  }
}
function getImports() {
  const imports = {};
  imports.wbg = {};
  imports.wbg.__wbg_new_15d3966e9981a196 = function(arg0, arg1) {
    const ret = new Error(getStringFromWasm0(arg0, arg1));
    return addHeapObject(ret);
  };
  imports.wbg.__wbindgen_memory = function() {
    const ret = wasm.memory;
    return addHeapObject(ret);
  };
  imports.wbg.__wbg_buffer_cf65c07de34b9a08 = function(arg0) {
    const ret = getObject(arg0).buffer;
    return addHeapObject(ret);
  };
  imports.wbg.__wbg_newwithbyteoffsetandlength_9fb2f11355ecadf5 = function(arg0, arg1, arg2) {
    const ret = new Uint8Array(getObject(arg0), arg1 >>> 0, arg2 >>> 0);
    return addHeapObject(ret);
  };
  imports.wbg.__wbindgen_object_drop_ref = function(arg0) {
    takeObject(arg0);
  };
  imports.wbg.__wbg_new_537b7341ce90bb31 = function(arg0) {
    const ret = new Uint8Array(getObject(arg0));
    return addHeapObject(ret);
  };
  imports.wbg.__wbg_instanceof_Uint8Array_01cebe79ca606cca = function(arg0) {
    let result;
    try {
      result = getObject(arg0) instanceof Uint8Array;
    } catch (e) {
      result = false;
    }
    const ret = result;
    return ret;
  };
  imports.wbg.__wbindgen_string_get = function(arg0, arg1) {
    const obj = getObject(arg1);
    const ret = typeof obj === "string" ? obj : void 0;
    var ptr0 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len0;
    getInt32Memory0()[arg0 / 4 + 0] = ptr0;
  };
  imports.wbg.__wbg_new_b525de17f44a8943 = function() {
    const ret = new Array();
    return addHeapObject(ret);
  };
  imports.wbg.__wbindgen_string_new = function(arg0, arg1) {
    const ret = getStringFromWasm0(arg0, arg1);
    return addHeapObject(ret);
  };
  imports.wbg.__wbg_push_49c286f04dd3bf59 = function(arg0, arg1) {
    const ret = getObject(arg0).push(getObject(arg1));
    return ret;
  };
  imports.wbg.__wbg_length_27a2afe8ab42b09f = function(arg0) {
    const ret = getObject(arg0).length;
    return ret;
  };
  imports.wbg.__wbg_set_17499e8aa4003ebd = function(arg0, arg1, arg2) {
    getObject(arg0).set(getObject(arg1), arg2 >>> 0);
  };
  imports.wbg.__wbindgen_throw = function(arg0, arg1) {
    throw new Error(getStringFromWasm0(arg0, arg1));
  };
  return imports;
}
function initMemory(imports, maybe_memory) {
}
function finalizeInit(instance, module) {
  wasm = instance.exports;
  init.__wbindgen_wasm_module = module;
  cachedInt32Memory0 = null;
  cachedUint8Memory0 = null;
  return wasm;
}
async function init(input) {
  if (typeof input === "undefined") {
    input = new URL("index_bg.wasm", void 0);
  }
  const imports = getImports();
  if (typeof input === "string" || typeof Request === "function" && input instanceof Request || typeof URL === "function" && input instanceof URL) {
    input = fetch(input);
  }
  initMemory(imports);
  const { instance, module } = await load2(await input, imports);
  return finalizeInit(instance, module);
}
var __create2, __defProp2, __getOwnPropDesc2, __getOwnPropNames2, __getProtoOf2, __hasOwnProp2, __commonJS2, __export, __copyProps2, __toESM2, require_tiny_inflate, require_swap, require_unicode_trie, require_b64, require_parse, require_walk, require_stringify, require_unit, require_lib, require_camelize, require_colors, require_css_color_keywords, require_css_to_react_native, require_css_background_parser, require_css_box_shadow, U200D, UFE0Fg, apis, languageFontMap, assetCache, loadDynamicAsset, import_unicode_trie, import_base64_js, $557adaaeb0c7885f$exports, $1627905f8be2ef3f$export$fb4028874a74450, $1627905f8be2ef3f$export$1bb1140fe1358b00, $1627905f8be2ef3f$export$f3e416a182673355, $1627905f8be2ef3f$export$24aa617c849a894a, $1627905f8be2ef3f$export$a73c4d14459b698d, $1627905f8be2ef3f$export$9e5d732f3676a9ba, $1627905f8be2ef3f$export$1dff41d5c0caca01, $1627905f8be2ef3f$export$30a74a373318dec6, $1627905f8be2ef3f$export$d710c5f50fc7496a, $1627905f8be2ef3f$export$66498d28055820a9, $1627905f8be2ef3f$export$eb6c6d0b7c8826f2, $1627905f8be2ef3f$export$de92be486109a1df, $1627905f8be2ef3f$export$606cfc2a8896c91f, $1627905f8be2ef3f$export$e51d3c675bb0140d, $1627905f8be2ef3f$export$da51c6332ad11d7b, $1627905f8be2ef3f$export$bea437c40441867d, $1627905f8be2ef3f$export$c4c7eecbfed13dc9, $1627905f8be2ef3f$export$98e1f8a379849661, $32627af916ac1b00$export$98f50d781a474745, $32627af916ac1b00$export$12ee1f8f5315ca7e, $32627af916ac1b00$export$e4965ce242860454, $32627af916ac1b00$export$8f14048969dcd45e, $32627af916ac1b00$export$133eb141bf58aff4, $32627af916ac1b00$export$5bdb8ccbf5c57afc, $557adaaeb0c7885f$var$data, $557adaaeb0c7885f$var$classTrie, $557adaaeb0c7885f$var$mapClass, $557adaaeb0c7885f$var$mapFirst, $557adaaeb0c7885f$var$Break, $557adaaeb0c7885f$var$LineBreaker, import_css_to_react_native, import_css_background_parser, import_css_box_shadow, import_postcss_value_parser, emoji_regex_default, u8, u16, u32, fleb, fdeb, clim, freb, _a, fl, revfl, _b, fd, rev, x, i, hMap, flt, i, i, i, i, fdt, i, flrm, fdrm, max, bits, bits16, shft, slc, ec, err, inflt, et, td, tds, cffStandardStrings, cffStandardEncoding, cffExpertEncoding, check, glyphset, typeOffsets, langSysTable, parse, glyf, instructionTable, exec, execGlyph, execComponent, roundSuper, xUnitVector, yUnitVector, HPZero, defaultState, arabicWordCheck, arabicSentenceCheck, SUBSTITUTIONS, latinWordCheck, cmap, TOP_DICT_META, PRIVATE_DICT_META, cff, fvar, attachList, caretValue, ligGlyph, ligCaretList, markGlyphSets, gdef, subtableParsers, gpos, subtableParsers$1, lookupRecordDesc, gsub, head, hhea, hmtx, kern, ltag, loca, maxp, os2, post, decode, eightBitMacEncodings, meta, opentype, opentype_module_default, Gu, mr, ju, Hu, Vu, Yu, gr, C, Zr, _o, Xu, vr, c, So, ko, On, ss, as, An, Ar, zl, Ir, ls, fs, cs, ps, hs, ms, Mn, bs, xs, _s, At, De, le, Nr, qn, Un, Mr, jn, Vn, Xn, $r, Jn, ei, ri, Hs, ui, fi, di, hi, Zs, mi, na, ca, pa, ha, ba, ya, _a2, Sa, Ta, Li, Di, La, Da, Na, za, Ka, Ja, nu, iu, p0, ou, lu, cu, pu, mu, ot, gt, vt, Ju, Zu, el, tl, rl, nl, To, Oo, Eo, Po, ol, al, rn, nn, Lo, Do, fl2, we, $o, cl, vl, bl, qo, kl, Tl, xr, wr, _r, cn, Uo, fn, Ol, Yo, gn, Jo, vn, Er, Ml, _n, kt, Pr, os, Ot, $u, O0, E0, gu, j, Ji, P0, me, R0, ro, ir, Vr, C0, D0, dt, W0, U0, Yr, po, Nn, He, Sn, Fn, Un2, Ln, Dn, Tt2, Wn, mt, Pt, wt2, je, Hn, Me, resvg_wasm_exports, wasm, heap, heap_next, WASM_VECTOR_LEN, cachedUint8Memory0, cachedTextEncoder, encodeString, cachedInt32Memory0, cachedTextDecoder, BBox, RenderedImage, Resvg, dist_default, initialized, initWasm, Resvg2, initializedResvg, initializedYoga, _a3, _b2, isDev, ImageResponse;
var init_api = __esm({
  "../node_modules/@cloudflare/pages-plugin-vercel-og/dist/src/api/index.js"() {
    init_functionsRoutes_0_7918156147864959();
    init_checked_fetch();
    __create2 = Object.create;
    __defProp2 = Object.defineProperty;
    __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    __getOwnPropNames2 = Object.getOwnPropertyNames;
    __getProtoOf2 = Object.getPrototypeOf;
    __hasOwnProp2 = Object.prototype.hasOwnProperty;
    __commonJS2 = /* @__PURE__ */ __name((cb, mod) => /* @__PURE__ */ __name(function __require() {
      return mod || (0, cb[__getOwnPropNames2(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
    }, "__require"), "__commonJS");
    __export = /* @__PURE__ */ __name((target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    }, "__export");
    __copyProps2 = /* @__PURE__ */ __name((to2, from, except, desc) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames2(from))
          if (!__hasOwnProp2.call(to2, key) && key !== except)
            __defProp2(to2, key, { get: /* @__PURE__ */ __name(() => from[key], "get"), enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
      }
      return to2;
    }, "__copyProps");
    __toESM2 = /* @__PURE__ */ __name((mod, isNodeMode, target) => (target = mod != null ? __create2(__getProtoOf2(mod)) : {}, __copyProps2(
      // If the importer is in node compatibility mode or this is not an ESM
      // file that has been converted to a CommonJS file using a Babel-
      // compatible transform (i.e. "__esModule" has not been set), then set
      // "default" to the CommonJS "module.exports" for node compatibility.
      isNodeMode || !mod || !mod.__esModule ? __defProp2(target, "default", { value: mod, enumerable: true }) : target,
      mod
    )), "__toESM");
    require_tiny_inflate = __commonJS2({
      "../../node_modules/tiny-inflate/index.js"(exports2, module) {
        var TINF_OK = 0;
        var TINF_DATA_ERROR = -3;
        function Tree() {
          this.table = new Uint16Array(16);
          this.trans = new Uint16Array(288);
        }
        __name(Tree, "Tree");
        function Data(source, dest) {
          this.source = source;
          this.sourceIndex = 0;
          this.tag = 0;
          this.bitcount = 0;
          this.dest = dest;
          this.destLen = 0;
          this.ltree = new Tree();
          this.dtree = new Tree();
        }
        __name(Data, "Data");
        var sltree = new Tree();
        var sdtree = new Tree();
        var length_bits = new Uint8Array(30);
        var length_base = new Uint16Array(30);
        var dist_bits = new Uint8Array(30);
        var dist_base = new Uint16Array(30);
        var clcidx = new Uint8Array([
          16,
          17,
          18,
          0,
          8,
          7,
          9,
          6,
          10,
          5,
          11,
          4,
          12,
          3,
          13,
          2,
          14,
          1,
          15
        ]);
        var code_tree = new Tree();
        var lengths = new Uint8Array(288 + 32);
        function tinf_build_bits_base(bits2, base, delta, first) {
          var i2, sum;
          for (i2 = 0; i2 < delta; ++i2)
            bits2[i2] = 0;
          for (i2 = 0; i2 < 30 - delta; ++i2)
            bits2[i2 + delta] = i2 / delta | 0;
          for (sum = first, i2 = 0; i2 < 30; ++i2) {
            base[i2] = sum;
            sum += 1 << bits2[i2];
          }
        }
        __name(tinf_build_bits_base, "tinf_build_bits_base");
        function tinf_build_fixed_trees(lt, dt2) {
          var i2;
          for (i2 = 0; i2 < 7; ++i2)
            lt.table[i2] = 0;
          lt.table[7] = 24;
          lt.table[8] = 152;
          lt.table[9] = 112;
          for (i2 = 0; i2 < 24; ++i2)
            lt.trans[i2] = 256 + i2;
          for (i2 = 0; i2 < 144; ++i2)
            lt.trans[24 + i2] = i2;
          for (i2 = 0; i2 < 8; ++i2)
            lt.trans[24 + 144 + i2] = 280 + i2;
          for (i2 = 0; i2 < 112; ++i2)
            lt.trans[24 + 144 + 8 + i2] = 144 + i2;
          for (i2 = 0; i2 < 5; ++i2)
            dt2.table[i2] = 0;
          dt2.table[5] = 32;
          for (i2 = 0; i2 < 32; ++i2)
            dt2.trans[i2] = i2;
        }
        __name(tinf_build_fixed_trees, "tinf_build_fixed_trees");
        var offs = new Uint16Array(16);
        function tinf_build_tree(t, lengths2, off, num) {
          var i2, sum;
          for (i2 = 0; i2 < 16; ++i2)
            t.table[i2] = 0;
          for (i2 = 0; i2 < num; ++i2)
            t.table[lengths2[off + i2]]++;
          t.table[0] = 0;
          for (sum = 0, i2 = 0; i2 < 16; ++i2) {
            offs[i2] = sum;
            sum += t.table[i2];
          }
          for (i2 = 0; i2 < num; ++i2) {
            if (lengths2[off + i2])
              t.trans[offs[lengths2[off + i2]]++] = i2;
          }
        }
        __name(tinf_build_tree, "tinf_build_tree");
        function tinf_getbit(d) {
          if (!d.bitcount--) {
            d.tag = d.source[d.sourceIndex++];
            d.bitcount = 7;
          }
          var bit = d.tag & 1;
          d.tag >>>= 1;
          return bit;
        }
        __name(tinf_getbit, "tinf_getbit");
        function tinf_read_bits(d, num, base) {
          if (!num)
            return base;
          while (d.bitcount < 24) {
            d.tag |= d.source[d.sourceIndex++] << d.bitcount;
            d.bitcount += 8;
          }
          var val = d.tag & 65535 >>> 16 - num;
          d.tag >>>= num;
          d.bitcount -= num;
          return val + base;
        }
        __name(tinf_read_bits, "tinf_read_bits");
        function tinf_decode_symbol(d, t) {
          while (d.bitcount < 24) {
            d.tag |= d.source[d.sourceIndex++] << d.bitcount;
            d.bitcount += 8;
          }
          var sum = 0, cur = 0, len = 0;
          var tag = d.tag;
          do {
            cur = 2 * cur + (tag & 1);
            tag >>>= 1;
            ++len;
            sum += t.table[len];
            cur -= t.table[len];
          } while (cur >= 0);
          d.tag = tag;
          d.bitcount -= len;
          return t.trans[sum + cur];
        }
        __name(tinf_decode_symbol, "tinf_decode_symbol");
        function tinf_decode_trees(d, lt, dt2) {
          var hlit, hdist, hclen;
          var i2, num, length;
          hlit = tinf_read_bits(d, 5, 257);
          hdist = tinf_read_bits(d, 5, 1);
          hclen = tinf_read_bits(d, 4, 4);
          for (i2 = 0; i2 < 19; ++i2)
            lengths[i2] = 0;
          for (i2 = 0; i2 < hclen; ++i2) {
            var clen = tinf_read_bits(d, 3, 0);
            lengths[clcidx[i2]] = clen;
          }
          tinf_build_tree(code_tree, lengths, 0, 19);
          for (num = 0; num < hlit + hdist; ) {
            var sym = tinf_decode_symbol(d, code_tree);
            switch (sym) {
              case 16:
                var prev = lengths[num - 1];
                for (length = tinf_read_bits(d, 2, 3); length; --length) {
                  lengths[num++] = prev;
                }
                break;
              case 17:
                for (length = tinf_read_bits(d, 3, 3); length; --length) {
                  lengths[num++] = 0;
                }
                break;
              case 18:
                for (length = tinf_read_bits(d, 7, 11); length; --length) {
                  lengths[num++] = 0;
                }
                break;
              default:
                lengths[num++] = sym;
                break;
            }
          }
          tinf_build_tree(lt, lengths, 0, hlit);
          tinf_build_tree(dt2, lengths, hlit, hdist);
        }
        __name(tinf_decode_trees, "tinf_decode_trees");
        function tinf_inflate_block_data(d, lt, dt2) {
          while (1) {
            var sym = tinf_decode_symbol(d, lt);
            if (sym === 256) {
              return TINF_OK;
            }
            if (sym < 256) {
              d.dest[d.destLen++] = sym;
            } else {
              var length, dist, offs2;
              var i2;
              sym -= 257;
              length = tinf_read_bits(d, length_bits[sym], length_base[sym]);
              dist = tinf_decode_symbol(d, dt2);
              offs2 = d.destLen - tinf_read_bits(d, dist_bits[dist], dist_base[dist]);
              for (i2 = offs2; i2 < offs2 + length; ++i2) {
                d.dest[d.destLen++] = d.dest[i2];
              }
            }
          }
        }
        __name(tinf_inflate_block_data, "tinf_inflate_block_data");
        function tinf_inflate_uncompressed_block(d) {
          var length, invlength;
          var i2;
          while (d.bitcount > 8) {
            d.sourceIndex--;
            d.bitcount -= 8;
          }
          length = d.source[d.sourceIndex + 1];
          length = 256 * length + d.source[d.sourceIndex];
          invlength = d.source[d.sourceIndex + 3];
          invlength = 256 * invlength + d.source[d.sourceIndex + 2];
          if (length !== (~invlength & 65535))
            return TINF_DATA_ERROR;
          d.sourceIndex += 4;
          for (i2 = length; i2; --i2)
            d.dest[d.destLen++] = d.source[d.sourceIndex++];
          d.bitcount = 0;
          return TINF_OK;
        }
        __name(tinf_inflate_uncompressed_block, "tinf_inflate_uncompressed_block");
        function tinf_uncompress(source, dest) {
          var d = new Data(source, dest);
          var bfinal, btype, res;
          do {
            bfinal = tinf_getbit(d);
            btype = tinf_read_bits(d, 2, 0);
            switch (btype) {
              case 0:
                res = tinf_inflate_uncompressed_block(d);
                break;
              case 1:
                res = tinf_inflate_block_data(d, sltree, sdtree);
                break;
              case 2:
                tinf_decode_trees(d, d.ltree, d.dtree);
                res = tinf_inflate_block_data(d, d.ltree, d.dtree);
                break;
              default:
                res = TINF_DATA_ERROR;
            }
            if (res !== TINF_OK)
              throw new Error("Data error");
          } while (!bfinal);
          if (d.destLen < d.dest.length) {
            if (typeof d.dest.slice === "function")
              return d.dest.slice(0, d.destLen);
            else
              return d.dest.subarray(0, d.destLen);
          }
          return d.dest;
        }
        __name(tinf_uncompress, "tinf_uncompress");
        tinf_build_fixed_trees(sltree, sdtree);
        tinf_build_bits_base(length_bits, length_base, 4, 3);
        tinf_build_bits_base(dist_bits, dist_base, 2, 1);
        length_bits[28] = 0;
        length_base[28] = 258;
        module.exports = tinf_uncompress;
      }
    });
    require_swap = __commonJS2({
      "../../node_modules/unicode-trie/swap.js"(exports2, module) {
        var isBigEndian = new Uint8Array(new Uint32Array([305419896]).buffer)[0] === 18;
        var swap = /* @__PURE__ */ __name((b, n, m2) => {
          let i2 = b[n];
          b[n] = b[m2];
          b[m2] = i2;
        }, "swap");
        var swap32 = /* @__PURE__ */ __name((array) => {
          const len = array.length;
          for (let i2 = 0; i2 < len; i2 += 4) {
            swap(array, i2, i2 + 3);
            swap(array, i2 + 1, i2 + 2);
          }
        }, "swap32");
        var swap32LE = /* @__PURE__ */ __name((array) => {
          if (isBigEndian) {
            swap32(array);
          }
        }, "swap32LE");
        module.exports = {
          swap32LE
        };
      }
    });
    require_unicode_trie = __commonJS2({
      "../../node_modules/unicode-trie/index.js"(exports2, module) {
        var inflate = require_tiny_inflate();
        var { swap32LE } = require_swap();
        var SHIFT_1 = 6 + 5;
        var SHIFT_2 = 5;
        var SHIFT_1_2 = SHIFT_1 - SHIFT_2;
        var OMITTED_BMP_INDEX_1_LENGTH = 65536 >> SHIFT_1;
        var INDEX_2_BLOCK_LENGTH = 1 << SHIFT_1_2;
        var INDEX_2_MASK = INDEX_2_BLOCK_LENGTH - 1;
        var INDEX_SHIFT = 2;
        var DATA_BLOCK_LENGTH = 1 << SHIFT_2;
        var DATA_MASK = DATA_BLOCK_LENGTH - 1;
        var LSCP_INDEX_2_OFFSET = 65536 >> SHIFT_2;
        var LSCP_INDEX_2_LENGTH = 1024 >> SHIFT_2;
        var INDEX_2_BMP_LENGTH = LSCP_INDEX_2_OFFSET + LSCP_INDEX_2_LENGTH;
        var UTF8_2B_INDEX_2_OFFSET = INDEX_2_BMP_LENGTH;
        var UTF8_2B_INDEX_2_LENGTH = 2048 >> 6;
        var INDEX_1_OFFSET = UTF8_2B_INDEX_2_OFFSET + UTF8_2B_INDEX_2_LENGTH;
        var DATA_GRANULARITY = 1 << INDEX_SHIFT;
        var UnicodeTrie = class {
          static {
            __name(this, "UnicodeTrie");
          }
          constructor(data) {
            const isBuffer = typeof data.readUInt32BE === "function" && typeof data.slice === "function";
            if (isBuffer || data instanceof Uint8Array) {
              let uncompressedLength;
              if (isBuffer) {
                this.highStart = data.readUInt32LE(0);
                this.errorValue = data.readUInt32LE(4);
                uncompressedLength = data.readUInt32LE(8);
                data = data.slice(12);
              } else {
                const view = new DataView(data.buffer);
                this.highStart = view.getUint32(0, true);
                this.errorValue = view.getUint32(4, true);
                uncompressedLength = view.getUint32(8, true);
                data = data.subarray(12);
              }
              data = inflate(data, new Uint8Array(uncompressedLength));
              data = inflate(data, new Uint8Array(uncompressedLength));
              swap32LE(data);
              this.data = new Uint32Array(data.buffer);
            } else {
              ({ data: this.data, highStart: this.highStart, errorValue: this.errorValue } = data);
            }
          }
          get(codePoint) {
            let index;
            if (codePoint < 0 || codePoint > 1114111) {
              return this.errorValue;
            }
            if (codePoint < 55296 || codePoint > 56319 && codePoint <= 65535) {
              index = (this.data[codePoint >> SHIFT_2] << INDEX_SHIFT) + (codePoint & DATA_MASK);
              return this.data[index];
            }
            if (codePoint <= 65535) {
              index = (this.data[LSCP_INDEX_2_OFFSET + (codePoint - 55296 >> SHIFT_2)] << INDEX_SHIFT) + (codePoint & DATA_MASK);
              return this.data[index];
            }
            if (codePoint < this.highStart) {
              index = this.data[INDEX_1_OFFSET - OMITTED_BMP_INDEX_1_LENGTH + (codePoint >> SHIFT_1)];
              index = this.data[index + (codePoint >> SHIFT_2 & INDEX_2_MASK)];
              index = (index << INDEX_SHIFT) + (codePoint & DATA_MASK);
              return this.data[index];
            }
            return this.data[this.data.length - DATA_GRANULARITY];
          }
        };
        module.exports = UnicodeTrie;
      }
    });
    require_b64 = __commonJS2({
      "../../node_modules/linebreak/node_modules/base64-js/lib/b64.js"(exports2) {
        var lookup = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
        (function(exports3) {
          "use strict";
          var Arr = typeof Uint8Array !== "undefined" ? Uint8Array : Array;
          var PLUS = "+".charCodeAt(0);
          var SLASH = "/".charCodeAt(0);
          var NUMBER = "0".charCodeAt(0);
          var LOWER = "a".charCodeAt(0);
          var UPPER = "A".charCodeAt(0);
          var PLUS_URL_SAFE = "-".charCodeAt(0);
          var SLASH_URL_SAFE = "_".charCodeAt(0);
          function decode2(elt) {
            var code = elt.charCodeAt(0);
            if (code === PLUS || code === PLUS_URL_SAFE)
              return 62;
            if (code === SLASH || code === SLASH_URL_SAFE)
              return 63;
            if (code < NUMBER)
              return -1;
            if (code < NUMBER + 10)
              return code - NUMBER + 26 + 26;
            if (code < UPPER + 26)
              return code - UPPER;
            if (code < LOWER + 26)
              return code - LOWER + 26;
          }
          __name(decode2, "decode2");
          function b64ToByteArray(b64) {
            var i2, j2, l, tmp, placeHolders, arr;
            if (b64.length % 4 > 0) {
              throw new Error("Invalid string. Length must be a multiple of 4");
            }
            var len = b64.length;
            placeHolders = "=" === b64.charAt(len - 2) ? 2 : "=" === b64.charAt(len - 1) ? 1 : 0;
            arr = new Arr(b64.length * 3 / 4 - placeHolders);
            l = placeHolders > 0 ? b64.length - 4 : b64.length;
            var L = 0;
            function push(v) {
              arr[L++] = v;
            }
            __name(push, "push");
            for (i2 = 0, j2 = 0; i2 < l; i2 += 4, j2 += 3) {
              tmp = decode2(b64.charAt(i2)) << 18 | decode2(b64.charAt(i2 + 1)) << 12 | decode2(b64.charAt(i2 + 2)) << 6 | decode2(b64.charAt(i2 + 3));
              push((tmp & 16711680) >> 16);
              push((tmp & 65280) >> 8);
              push(tmp & 255);
            }
            if (placeHolders === 2) {
              tmp = decode2(b64.charAt(i2)) << 2 | decode2(b64.charAt(i2 + 1)) >> 4;
              push(tmp & 255);
            } else if (placeHolders === 1) {
              tmp = decode2(b64.charAt(i2)) << 10 | decode2(b64.charAt(i2 + 1)) << 4 | decode2(b64.charAt(i2 + 2)) >> 2;
              push(tmp >> 8 & 255);
              push(tmp & 255);
            }
            return arr;
          }
          __name(b64ToByteArray, "b64ToByteArray");
          function uint8ToBase64(uint8) {
            var i2, extraBytes = uint8.length % 3, output = "", temp, length;
            function encode(num) {
              return lookup.charAt(num);
            }
            __name(encode, "encode");
            function tripletToBase64(num) {
              return encode(num >> 18 & 63) + encode(num >> 12 & 63) + encode(num >> 6 & 63) + encode(num & 63);
            }
            __name(tripletToBase64, "tripletToBase64");
            for (i2 = 0, length = uint8.length - extraBytes; i2 < length; i2 += 3) {
              temp = (uint8[i2] << 16) + (uint8[i2 + 1] << 8) + uint8[i2 + 2];
              output += tripletToBase64(temp);
            }
            switch (extraBytes) {
              case 1:
                temp = uint8[uint8.length - 1];
                output += encode(temp >> 2);
                output += encode(temp << 4 & 63);
                output += "==";
                break;
              case 2:
                temp = (uint8[uint8.length - 2] << 8) + uint8[uint8.length - 1];
                output += encode(temp >> 10);
                output += encode(temp >> 4 & 63);
                output += encode(temp << 2 & 63);
                output += "=";
                break;
            }
            return output;
          }
          __name(uint8ToBase64, "uint8ToBase64");
          exports3.toByteArray = b64ToByteArray;
          exports3.fromByteArray = uint8ToBase64;
        })(typeof exports2 === "undefined" ? exports2.base64js = {} : exports2);
      }
    });
    require_parse = __commonJS2({
      "../../node_modules/postcss-value-parser/lib/parse.js"(exports2, module) {
        var openParentheses = "(".charCodeAt(0);
        var closeParentheses = ")".charCodeAt(0);
        var singleQuote = "'".charCodeAt(0);
        var doubleQuote = '"'.charCodeAt(0);
        var backslash = "\\".charCodeAt(0);
        var slash = "/".charCodeAt(0);
        var comma = ",".charCodeAt(0);
        var colon = ":".charCodeAt(0);
        var star = "*".charCodeAt(0);
        var uLower = "u".charCodeAt(0);
        var uUpper = "U".charCodeAt(0);
        var plus = "+".charCodeAt(0);
        var isUnicodeRange = /^[a-f0-9?-]+$/i;
        module.exports = function(input) {
          var tokens = [];
          var value = input;
          var next, quote, prev, token, escape, escapePos, whitespacePos, parenthesesOpenPos;
          var pos = 0;
          var code = value.charCodeAt(pos);
          var max2 = value.length;
          var stack = [{ nodes: tokens }];
          var balanced = 0;
          var parent;
          var name = "";
          var before = "";
          var after = "";
          while (pos < max2) {
            if (code <= 32) {
              next = pos;
              do {
                next += 1;
                code = value.charCodeAt(next);
              } while (code <= 32);
              token = value.slice(pos, next);
              prev = tokens[tokens.length - 1];
              if (code === closeParentheses && balanced) {
                after = token;
              } else if (prev && prev.type === "div") {
                prev.after = token;
                prev.sourceEndIndex += token.length;
              } else if (code === comma || code === colon || code === slash && value.charCodeAt(next + 1) !== star && (!parent || parent && parent.type === "function" && parent.value !== "calc")) {
                before = token;
              } else {
                tokens.push({
                  type: "space",
                  sourceIndex: pos,
                  sourceEndIndex: next,
                  value: token
                });
              }
              pos = next;
            } else if (code === singleQuote || code === doubleQuote) {
              next = pos;
              quote = code === singleQuote ? "'" : '"';
              token = {
                type: "string",
                sourceIndex: pos,
                quote
              };
              do {
                escape = false;
                next = value.indexOf(quote, next + 1);
                if (~next) {
                  escapePos = next;
                  while (value.charCodeAt(escapePos - 1) === backslash) {
                    escapePos -= 1;
                    escape = !escape;
                  }
                } else {
                  value += quote;
                  next = value.length - 1;
                  token.unclosed = true;
                }
              } while (escape);
              token.value = value.slice(pos + 1, next);
              token.sourceEndIndex = token.unclosed ? next : next + 1;
              tokens.push(token);
              pos = next + 1;
              code = value.charCodeAt(pos);
            } else if (code === slash && value.charCodeAt(pos + 1) === star) {
              next = value.indexOf("*/", pos);
              token = {
                type: "comment",
                sourceIndex: pos,
                sourceEndIndex: next + 2
              };
              if (next === -1) {
                token.unclosed = true;
                next = value.length;
                token.sourceEndIndex = next;
              }
              token.value = value.slice(pos + 2, next);
              tokens.push(token);
              pos = next + 2;
              code = value.charCodeAt(pos);
            } else if ((code === slash || code === star) && parent && parent.type === "function" && parent.value === "calc") {
              token = value[pos];
              tokens.push({
                type: "word",
                sourceIndex: pos - before.length,
                sourceEndIndex: pos + token.length,
                value: token
              });
              pos += 1;
              code = value.charCodeAt(pos);
            } else if (code === slash || code === comma || code === colon) {
              token = value[pos];
              tokens.push({
                type: "div",
                sourceIndex: pos - before.length,
                sourceEndIndex: pos + token.length,
                value: token,
                before,
                after: ""
              });
              before = "";
              pos += 1;
              code = value.charCodeAt(pos);
            } else if (openParentheses === code) {
              next = pos;
              do {
                next += 1;
                code = value.charCodeAt(next);
              } while (code <= 32);
              parenthesesOpenPos = pos;
              token = {
                type: "function",
                sourceIndex: pos - name.length,
                value: name,
                before: value.slice(parenthesesOpenPos + 1, next)
              };
              pos = next;
              if (name === "url" && code !== singleQuote && code !== doubleQuote) {
                next -= 1;
                do {
                  escape = false;
                  next = value.indexOf(")", next + 1);
                  if (~next) {
                    escapePos = next;
                    while (value.charCodeAt(escapePos - 1) === backslash) {
                      escapePos -= 1;
                      escape = !escape;
                    }
                  } else {
                    value += ")";
                    next = value.length - 1;
                    token.unclosed = true;
                  }
                } while (escape);
                whitespacePos = next;
                do {
                  whitespacePos -= 1;
                  code = value.charCodeAt(whitespacePos);
                } while (code <= 32);
                if (parenthesesOpenPos < whitespacePos) {
                  if (pos !== whitespacePos + 1) {
                    token.nodes = [
                      {
                        type: "word",
                        sourceIndex: pos,
                        sourceEndIndex: whitespacePos + 1,
                        value: value.slice(pos, whitespacePos + 1)
                      }
                    ];
                  } else {
                    token.nodes = [];
                  }
                  if (token.unclosed && whitespacePos + 1 !== next) {
                    token.after = "";
                    token.nodes.push({
                      type: "space",
                      sourceIndex: whitespacePos + 1,
                      sourceEndIndex: next,
                      value: value.slice(whitespacePos + 1, next)
                    });
                  } else {
                    token.after = value.slice(whitespacePos + 1, next);
                    token.sourceEndIndex = next;
                  }
                } else {
                  token.after = "";
                  token.nodes = [];
                }
                pos = next + 1;
                token.sourceEndIndex = token.unclosed ? next : pos;
                code = value.charCodeAt(pos);
                tokens.push(token);
              } else {
                balanced += 1;
                token.after = "";
                token.sourceEndIndex = pos + 1;
                tokens.push(token);
                stack.push(token);
                tokens = token.nodes = [];
                parent = token;
              }
              name = "";
            } else if (closeParentheses === code && balanced) {
              pos += 1;
              code = value.charCodeAt(pos);
              parent.after = after;
              parent.sourceEndIndex += after.length;
              after = "";
              balanced -= 1;
              stack[stack.length - 1].sourceEndIndex = pos;
              stack.pop();
              parent = stack[balanced];
              tokens = parent.nodes;
            } else {
              next = pos;
              do {
                if (code === backslash) {
                  next += 1;
                }
                next += 1;
                code = value.charCodeAt(next);
              } while (next < max2 && !(code <= 32 || code === singleQuote || code === doubleQuote || code === comma || code === colon || code === slash || code === openParentheses || code === star && parent && parent.type === "function" && parent.value === "calc" || code === slash && parent.type === "function" && parent.value === "calc" || code === closeParentheses && balanced));
              token = value.slice(pos, next);
              if (openParentheses === code) {
                name = token;
              } else if ((uLower === token.charCodeAt(0) || uUpper === token.charCodeAt(0)) && plus === token.charCodeAt(1) && isUnicodeRange.test(token.slice(2))) {
                tokens.push({
                  type: "unicode-range",
                  sourceIndex: pos,
                  sourceEndIndex: next,
                  value: token
                });
              } else {
                tokens.push({
                  type: "word",
                  sourceIndex: pos,
                  sourceEndIndex: next,
                  value: token
                });
              }
              pos = next;
            }
          }
          for (pos = stack.length - 1; pos; pos -= 1) {
            stack[pos].unclosed = true;
            stack[pos].sourceEndIndex = value.length;
          }
          return stack[0].nodes;
        };
      }
    });
    require_walk = __commonJS2({
      "../../node_modules/postcss-value-parser/lib/walk.js"(exports2, module) {
        module.exports = /* @__PURE__ */ __name(function walk(nodes, cb, bubble) {
          var i2, max2, node, result;
          for (i2 = 0, max2 = nodes.length; i2 < max2; i2 += 1) {
            node = nodes[i2];
            if (!bubble) {
              result = cb(node, i2, nodes);
            }
            if (result !== false && node.type === "function" && Array.isArray(node.nodes)) {
              walk(node.nodes, cb, bubble);
            }
            if (bubble) {
              cb(node, i2, nodes);
            }
          }
        }, "walk");
      }
    });
    require_stringify = __commonJS2({
      "../../node_modules/postcss-value-parser/lib/stringify.js"(exports2, module) {
        function stringifyNode(node, custom) {
          var type = node.type;
          var value = node.value;
          var buf;
          var customResult;
          if (custom && (customResult = custom(node)) !== void 0) {
            return customResult;
          } else if (type === "word" || type === "space") {
            return value;
          } else if (type === "string") {
            buf = node.quote || "";
            return buf + value + (node.unclosed ? "" : buf);
          } else if (type === "comment") {
            return "/*" + value + (node.unclosed ? "" : "*/");
          } else if (type === "div") {
            return (node.before || "") + value + (node.after || "");
          } else if (Array.isArray(node.nodes)) {
            buf = stringify(node.nodes, custom);
            if (type !== "function") {
              return buf;
            }
            return value + "(" + (node.before || "") + buf + (node.after || "") + (node.unclosed ? "" : ")");
          }
          return value;
        }
        __name(stringifyNode, "stringifyNode");
        function stringify(nodes, custom) {
          var result, i2;
          if (Array.isArray(nodes)) {
            result = "";
            for (i2 = nodes.length - 1; ~i2; i2 -= 1) {
              result = stringifyNode(nodes[i2], custom) + result;
            }
            return result;
          }
          return stringifyNode(nodes, custom);
        }
        __name(stringify, "stringify");
        module.exports = stringify;
      }
    });
    require_unit = __commonJS2({
      "../../node_modules/postcss-value-parser/lib/unit.js"(exports2, module) {
        var minus = "-".charCodeAt(0);
        var plus = "+".charCodeAt(0);
        var dot = ".".charCodeAt(0);
        var exp = "e".charCodeAt(0);
        var EXP = "E".charCodeAt(0);
        function likeNumber(value) {
          var code = value.charCodeAt(0);
          var nextCode;
          if (code === plus || code === minus) {
            nextCode = value.charCodeAt(1);
            if (nextCode >= 48 && nextCode <= 57) {
              return true;
            }
            var nextNextCode = value.charCodeAt(2);
            if (nextCode === dot && nextNextCode >= 48 && nextNextCode <= 57) {
              return true;
            }
            return false;
          }
          if (code === dot) {
            nextCode = value.charCodeAt(1);
            if (nextCode >= 48 && nextCode <= 57) {
              return true;
            }
            return false;
          }
          if (code >= 48 && code <= 57) {
            return true;
          }
          return false;
        }
        __name(likeNumber, "likeNumber");
        module.exports = function(value) {
          var pos = 0;
          var length = value.length;
          var code;
          var nextCode;
          var nextNextCode;
          if (length === 0 || !likeNumber(value)) {
            return false;
          }
          code = value.charCodeAt(pos);
          if (code === plus || code === minus) {
            pos++;
          }
          while (pos < length) {
            code = value.charCodeAt(pos);
            if (code < 48 || code > 57) {
              break;
            }
            pos += 1;
          }
          code = value.charCodeAt(pos);
          nextCode = value.charCodeAt(pos + 1);
          if (code === dot && nextCode >= 48 && nextCode <= 57) {
            pos += 2;
            while (pos < length) {
              code = value.charCodeAt(pos);
              if (code < 48 || code > 57) {
                break;
              }
              pos += 1;
            }
          }
          code = value.charCodeAt(pos);
          nextCode = value.charCodeAt(pos + 1);
          nextNextCode = value.charCodeAt(pos + 2);
          if ((code === exp || code === EXP) && (nextCode >= 48 && nextCode <= 57 || (nextCode === plus || nextCode === minus) && nextNextCode >= 48 && nextNextCode <= 57)) {
            pos += nextCode === plus || nextCode === minus ? 3 : 2;
            while (pos < length) {
              code = value.charCodeAt(pos);
              if (code < 48 || code > 57) {
                break;
              }
              pos += 1;
            }
          }
          return {
            number: value.slice(0, pos),
            unit: value.slice(pos)
          };
        };
      }
    });
    require_lib = __commonJS2({
      "../../node_modules/postcss-value-parser/lib/index.js"(exports2, module) {
        var parse22 = require_parse();
        var walk = require_walk();
        var stringify = require_stringify();
        function ValueParser(value) {
          if (this instanceof ValueParser) {
            this.nodes = parse22(value);
            return this;
          }
          return new ValueParser(value);
        }
        __name(ValueParser, "ValueParser");
        ValueParser.prototype.toString = function() {
          return Array.isArray(this.nodes) ? stringify(this.nodes) : "";
        };
        ValueParser.prototype.walk = function(cb, bubble) {
          walk(this.nodes, cb, bubble);
          return this;
        };
        ValueParser.unit = require_unit();
        ValueParser.walk = walk;
        ValueParser.stringify = stringify;
        module.exports = ValueParser;
      }
    });
    require_camelize = __commonJS2({
      "../../node_modules/camelize/index.js"(exports2, module) {
        "use strict";
        module.exports = function(obj) {
          if (typeof obj === "string") {
            return camelCase(obj);
          }
          return walk(obj);
        };
        function walk(obj) {
          if (!obj || typeof obj !== "object") {
            return obj;
          }
          if (isDate(obj) || isRegex(obj)) {
            return obj;
          }
          if (isArray(obj)) {
            return map(obj, walk);
          }
          return reduce(objectKeys(obj), function(acc, key) {
            var camel = camelCase(key);
            acc[camel] = walk(obj[key]);
            return acc;
          }, {});
        }
        __name(walk, "walk");
        function camelCase(str) {
          return str.replace(/[_.-](\w|$)/g, function(_, x2) {
            return x2.toUpperCase();
          });
        }
        __name(camelCase, "camelCase");
        var isArray = Array.isArray || function(obj) {
          return Object.prototype.toString.call(obj) === "[object Array]";
        };
        var isDate = /* @__PURE__ */ __name(function(obj) {
          return Object.prototype.toString.call(obj) === "[object Date]";
        }, "isDate");
        var isRegex = /* @__PURE__ */ __name(function(obj) {
          return Object.prototype.toString.call(obj) === "[object RegExp]";
        }, "isRegex");
        var has = Object.prototype.hasOwnProperty;
        var objectKeys = Object.keys || function(obj) {
          var keys = [];
          for (var key in obj) {
            if (has.call(obj, key)) {
              keys.push(key);
            }
          }
          return keys;
        };
        function map(xs2, f) {
          if (xs2.map) {
            return xs2.map(f);
          }
          var res = [];
          for (var i2 = 0; i2 < xs2.length; i2++) {
            res.push(f(xs2[i2], i2));
          }
          return res;
        }
        __name(map, "map");
        function reduce(xs2, f, acc) {
          if (xs2.reduce) {
            return xs2.reduce(f, acc);
          }
          for (var i2 = 0; i2 < xs2.length; i2++) {
            acc = f(acc, xs2[i2], i2);
          }
          return acc;
        }
        __name(reduce, "reduce");
      }
    });
    require_colors = __commonJS2({
      "../../node_modules/css-color-keywords/colors.json"(exports2, module) {
        module.exports = {
          black: "#000000",
          silver: "#c0c0c0",
          gray: "#808080",
          white: "#ffffff",
          maroon: "#800000",
          red: "#ff0000",
          purple: "#800080",
          fuchsia: "#ff00ff",
          green: "#008000",
          lime: "#00ff00",
          olive: "#808000",
          yellow: "#ffff00",
          navy: "#000080",
          blue: "#0000ff",
          teal: "#008080",
          aqua: "#00ffff",
          orange: "#ffa500",
          aliceblue: "#f0f8ff",
          antiquewhite: "#faebd7",
          aquamarine: "#7fffd4",
          azure: "#f0ffff",
          beige: "#f5f5dc",
          bisque: "#ffe4c4",
          blanchedalmond: "#ffebcd",
          blueviolet: "#8a2be2",
          brown: "#a52a2a",
          burlywood: "#deb887",
          cadetblue: "#5f9ea0",
          chartreuse: "#7fff00",
          chocolate: "#d2691e",
          coral: "#ff7f50",
          cornflowerblue: "#6495ed",
          cornsilk: "#fff8dc",
          crimson: "#dc143c",
          darkblue: "#00008b",
          darkcyan: "#008b8b",
          darkgoldenrod: "#b8860b",
          darkgray: "#a9a9a9",
          darkgreen: "#006400",
          darkgrey: "#a9a9a9",
          darkkhaki: "#bdb76b",
          darkmagenta: "#8b008b",
          darkolivegreen: "#556b2f",
          darkorange: "#ff8c00",
          darkorchid: "#9932cc",
          darkred: "#8b0000",
          darksalmon: "#e9967a",
          darkseagreen: "#8fbc8f",
          darkslateblue: "#483d8b",
          darkslategray: "#2f4f4f",
          darkslategrey: "#2f4f4f",
          darkturquoise: "#00ced1",
          darkviolet: "#9400d3",
          deeppink: "#ff1493",
          deepskyblue: "#00bfff",
          dimgray: "#696969",
          dimgrey: "#696969",
          dodgerblue: "#1e90ff",
          firebrick: "#b22222",
          floralwhite: "#fffaf0",
          forestgreen: "#228b22",
          gainsboro: "#dcdcdc",
          ghostwhite: "#f8f8ff",
          gold: "#ffd700",
          goldenrod: "#daa520",
          greenyellow: "#adff2f",
          grey: "#808080",
          honeydew: "#f0fff0",
          hotpink: "#ff69b4",
          indianred: "#cd5c5c",
          indigo: "#4b0082",
          ivory: "#fffff0",
          khaki: "#f0e68c",
          lavender: "#e6e6fa",
          lavenderblush: "#fff0f5",
          lawngreen: "#7cfc00",
          lemonchiffon: "#fffacd",
          lightblue: "#add8e6",
          lightcoral: "#f08080",
          lightcyan: "#e0ffff",
          lightgoldenrodyellow: "#fafad2",
          lightgray: "#d3d3d3",
          lightgreen: "#90ee90",
          lightgrey: "#d3d3d3",
          lightpink: "#ffb6c1",
          lightsalmon: "#ffa07a",
          lightseagreen: "#20b2aa",
          lightskyblue: "#87cefa",
          lightslategray: "#778899",
          lightslategrey: "#778899",
          lightsteelblue: "#b0c4de",
          lightyellow: "#ffffe0",
          limegreen: "#32cd32",
          linen: "#faf0e6",
          mediumaquamarine: "#66cdaa",
          mediumblue: "#0000cd",
          mediumorchid: "#ba55d3",
          mediumpurple: "#9370db",
          mediumseagreen: "#3cb371",
          mediumslateblue: "#7b68ee",
          mediumspringgreen: "#00fa9a",
          mediumturquoise: "#48d1cc",
          mediumvioletred: "#c71585",
          midnightblue: "#191970",
          mintcream: "#f5fffa",
          mistyrose: "#ffe4e1",
          moccasin: "#ffe4b5",
          navajowhite: "#ffdead",
          oldlace: "#fdf5e6",
          olivedrab: "#6b8e23",
          orangered: "#ff4500",
          orchid: "#da70d6",
          palegoldenrod: "#eee8aa",
          palegreen: "#98fb98",
          paleturquoise: "#afeeee",
          palevioletred: "#db7093",
          papayawhip: "#ffefd5",
          peachpuff: "#ffdab9",
          peru: "#cd853f",
          pink: "#ffc0cb",
          plum: "#dda0dd",
          powderblue: "#b0e0e6",
          rosybrown: "#bc8f8f",
          royalblue: "#4169e1",
          saddlebrown: "#8b4513",
          salmon: "#fa8072",
          sandybrown: "#f4a460",
          seagreen: "#2e8b57",
          seashell: "#fff5ee",
          sienna: "#a0522d",
          skyblue: "#87ceeb",
          slateblue: "#6a5acd",
          slategray: "#708090",
          slategrey: "#708090",
          snow: "#fffafa",
          springgreen: "#00ff7f",
          steelblue: "#4682b4",
          tan: "#d2b48c",
          thistle: "#d8bfd8",
          tomato: "#ff6347",
          turquoise: "#40e0d0",
          violet: "#ee82ee",
          wheat: "#f5deb3",
          whitesmoke: "#f5f5f5",
          yellowgreen: "#9acd32",
          rebeccapurple: "#663399"
        };
      }
    });
    require_css_color_keywords = __commonJS2({
      "../../node_modules/css-color-keywords/index.js"(exports2, module) {
        "use strict";
        module.exports = require_colors();
      }
    });
    require_css_to_react_native = __commonJS2({
      "../../node_modules/css-to-react-native/index.js"(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", {
          value: true
        });
        function _interopDefault(ex) {
          return ex && typeof ex === "object" && "default" in ex ? ex["default"] : ex;
        }
        __name(_interopDefault, "_interopDefault");
        var parse22 = require_lib();
        var parse__default = _interopDefault(parse22);
        var camelizeStyleName = _interopDefault(require_camelize());
        var cssColorKeywords = _interopDefault(require_css_color_keywords());
        var matchString = /* @__PURE__ */ __name(function matchString2(node) {
          if (node.type !== "string")
            return null;
          return node.value.replace(/\\([0-9a-f]{1,6})(?:\s|$)/gi, function(match2, charCode) {
            return String.fromCharCode(parseInt(charCode, 16));
          }).replace(/\\/g, "");
        }, "matchString2");
        var hexColorRe = /^(#(?:[0-9a-f]{3,4}){1,2})$/i;
        var cssFunctionNameRe = /^(rgba?|hsla?|hwb|lab|lch|gray|color)$/;
        var matchColor = /* @__PURE__ */ __name(function matchColor2(node) {
          if (node.type === "word" && (hexColorRe.test(node.value) || node.value in cssColorKeywords || node.value === "transparent")) {
            return node.value;
          } else if (node.type === "function" && cssFunctionNameRe.test(node.value)) {
            return parse22.stringify(node);
          }
          return null;
        }, "matchColor2");
        var noneRe = /^(none)$/i;
        var autoRe = /^(auto)$/i;
        var identRe = /(^-?[_a-z][_a-z0-9-]*$)/i;
        var numberRe = /^([+-]?(?:\d*\.)?\d+(?:e[+-]?\d+)?)$/i;
        var lengthRe = /^(0$|(?:[+-]?(?:\d*\.)?\d+(?:e[+-]?\d+)?)(?=px$))/i;
        var unsupportedUnitRe = /^([+-]?(?:\d*\.)?\d+(?:e[+-]?\d+)?(ch|em|ex|rem|vh|vw|vmin|vmax|cm|mm|in|pc|pt))$/i;
        var angleRe = /^([+-]?(?:\d*\.)?\d+(?:e[+-]?\d+)?(?:deg|rad))$/i;
        var percentRe = /^([+-]?(?:\d*\.)?\d+(?:e[+-]?\d+)?%)$/i;
        var noopToken = /* @__PURE__ */ __name(function noopToken2(predicate) {
          return function(node) {
            return predicate(node) ? "<token>" : null;
          };
        }, "noopToken2");
        var valueForTypeToken = /* @__PURE__ */ __name(function valueForTypeToken2(type) {
          return function(node) {
            return node.type === type ? node.value : null;
          };
        }, "valueForTypeToken2");
        var regExpToken = /* @__PURE__ */ __name(function regExpToken2(regExp, transform2) {
          if (transform2 === void 0) {
            transform2 = String;
          }
          return function(node) {
            if (node.type !== "word")
              return null;
            var match2 = node.value.match(regExp);
            if (match2 === null)
              return null;
            var value = transform2(match2[1]);
            return value;
          };
        }, "regExpToken2");
        var SPACE = noopToken(function(node) {
          return node.type === "space";
        });
        var SLASH = noopToken(function(node) {
          return node.type === "div" && node.value === "/";
        });
        var COMMA = noopToken(function(node) {
          return node.type === "div" && node.value === ",";
        });
        var WORD = valueForTypeToken("word");
        var NONE = regExpToken(noneRe);
        var AUTO = regExpToken(autoRe);
        var NUMBER = regExpToken(numberRe, Number);
        var LENGTH = regExpToken(lengthRe, Number);
        var UNSUPPORTED_LENGTH_UNIT = regExpToken(unsupportedUnitRe);
        var ANGLE = regExpToken(angleRe, function(angle) {
          return angle.toLowerCase();
        });
        var PERCENT = regExpToken(percentRe);
        var IDENT = regExpToken(identRe);
        var STRING = matchString;
        var COLOR = matchColor;
        var LINE = regExpToken(/^(none|underline|line-through)$/i);
        var aspectRatio = /* @__PURE__ */ __name(function aspectRatio2(tokenStream) {
          var aspectRatio3 = tokenStream.expect(NUMBER);
          if (tokenStream.hasTokens()) {
            tokenStream.expect(SLASH);
            aspectRatio3 /= tokenStream.expect(NUMBER);
          }
          return {
            aspectRatio: aspectRatio3
          };
        }, "aspectRatio2");
        var BORDER_STYLE = regExpToken(/^(solid|dashed|dotted)$/);
        var defaultBorderWidth = 1;
        var defaultBorderColor = "black";
        var defaultBorderStyle = "solid";
        var border = /* @__PURE__ */ __name(function border2(tokenStream) {
          var borderWidth2;
          var borderColor2;
          var borderStyle;
          if (tokenStream.matches(NONE)) {
            tokenStream.expectEmpty();
            return {
              borderWidth: 0,
              borderColor: "black",
              borderStyle: "solid"
            };
          }
          var partsParsed = 0;
          while (partsParsed < 3 && tokenStream.hasTokens()) {
            if (partsParsed !== 0)
              tokenStream.expect(SPACE);
            if (borderWidth2 === void 0 && tokenStream.matches(LENGTH, UNSUPPORTED_LENGTH_UNIT)) {
              borderWidth2 = tokenStream.lastValue;
            } else if (borderColor2 === void 0 && tokenStream.matches(COLOR)) {
              borderColor2 = tokenStream.lastValue;
            } else if (borderStyle === void 0 && tokenStream.matches(BORDER_STYLE)) {
              borderStyle = tokenStream.lastValue;
            } else {
              tokenStream["throw"]();
            }
            partsParsed += 1;
          }
          tokenStream.expectEmpty();
          if (borderWidth2 === void 0)
            borderWidth2 = defaultBorderWidth;
          if (borderColor2 === void 0)
            borderColor2 = defaultBorderColor;
          if (borderStyle === void 0)
            borderStyle = defaultBorderStyle;
          return {
            borderWidth: borderWidth2,
            borderColor: borderColor2,
            borderStyle
          };
        }, "border2");
        var directionFactory = /* @__PURE__ */ __name(function directionFactory2(_ref) {
          var _ref$types = _ref.types, types = _ref$types === void 0 ? [LENGTH, UNSUPPORTED_LENGTH_UNIT, PERCENT] : _ref$types, _ref$directions = _ref.directions, directions = _ref$directions === void 0 ? ["Top", "Right", "Bottom", "Left"] : _ref$directions, _ref$prefix = _ref.prefix, prefix = _ref$prefix === void 0 ? "" : _ref$prefix, _ref$suffix = _ref.suffix, suffix = _ref$suffix === void 0 ? "" : _ref$suffix;
          return function(tokenStream) {
            var _ref2;
            var values = [];
            values.push(tokenStream.expect.apply(tokenStream, types));
            while (values.length < 4 && tokenStream.hasTokens()) {
              tokenStream.expect(SPACE);
              values.push(tokenStream.expect.apply(tokenStream, types));
            }
            tokenStream.expectEmpty();
            var top = values[0], _values$ = values[1], right = _values$ === void 0 ? top : _values$, _values$2 = values[2], bottom = _values$2 === void 0 ? top : _values$2, _values$3 = values[3], left = _values$3 === void 0 ? right : _values$3;
            var keyFor = /* @__PURE__ */ __name(function keyFor2(n) {
              return "" + prefix + directions[n] + suffix;
            }, "keyFor2");
            return _ref2 = {}, _ref2[keyFor(0)] = top, _ref2[keyFor(1)] = right, _ref2[keyFor(2)] = bottom, _ref2[keyFor(3)] = left, _ref2;
          };
        }, "directionFactory2");
        var parseShadowOffset = /* @__PURE__ */ __name(function parseShadowOffset2(tokenStream) {
          var width = tokenStream.expect(LENGTH);
          var height = tokenStream.matches(SPACE) ? tokenStream.expect(LENGTH) : width;
          tokenStream.expectEmpty();
          return {
            width,
            height
          };
        }, "parseShadowOffset2");
        var parseShadow = /* @__PURE__ */ __name(function parseShadow2(tokenStream) {
          var offsetX;
          var offsetY;
          var radius;
          var color;
          if (tokenStream.matches(NONE)) {
            tokenStream.expectEmpty();
            return {
              offset: {
                width: 0,
                height: 0
              },
              radius: 0,
              color: "black"
            };
          }
          var didParseFirst = false;
          while (tokenStream.hasTokens()) {
            if (didParseFirst)
              tokenStream.expect(SPACE);
            if (offsetX === void 0 && tokenStream.matches(LENGTH, UNSUPPORTED_LENGTH_UNIT)) {
              offsetX = tokenStream.lastValue;
              tokenStream.expect(SPACE);
              offsetY = tokenStream.expect(LENGTH, UNSUPPORTED_LENGTH_UNIT);
              tokenStream.saveRewindPoint();
              if (tokenStream.matches(SPACE) && tokenStream.matches(LENGTH, UNSUPPORTED_LENGTH_UNIT)) {
                radius = tokenStream.lastValue;
              } else {
                tokenStream.rewind();
              }
            } else if (color === void 0 && tokenStream.matches(COLOR)) {
              color = tokenStream.lastValue;
            } else {
              tokenStream["throw"]();
            }
            didParseFirst = true;
          }
          if (offsetX === void 0)
            tokenStream["throw"]();
          return {
            offset: {
              width: offsetX,
              height: offsetY
            },
            radius: radius !== void 0 ? radius : 0,
            color: color !== void 0 ? color : "black"
          };
        }, "parseShadow2");
        var boxShadow = /* @__PURE__ */ __name(function boxShadow2(tokenStream) {
          var _parseShadow = parseShadow(tokenStream), offset = _parseShadow.offset, radius = _parseShadow.radius, color = _parseShadow.color;
          return {
            shadowOffset: offset,
            shadowRadius: radius,
            shadowColor: color,
            shadowOpacity: 1
          };
        }, "boxShadow2");
        var defaultFlexGrow = 1;
        var defaultFlexShrink = 1;
        var defaultFlexBasis = 0;
        var flex = /* @__PURE__ */ __name(function flex2(tokenStream) {
          var flexGrow;
          var flexShrink;
          var flexBasis;
          if (tokenStream.matches(NONE)) {
            tokenStream.expectEmpty();
            return {
              flexGrow: 0,
              flexShrink: 0,
              flexBasis: "auto"
            };
          }
          tokenStream.saveRewindPoint();
          if (tokenStream.matches(AUTO) && !tokenStream.hasTokens()) {
            return {
              flexGrow: 1,
              flexShrink: 1,
              flexBasis: "auto"
            };
          }
          tokenStream.rewind();
          var partsParsed = 0;
          while (partsParsed < 2 && tokenStream.hasTokens()) {
            if (partsParsed !== 0)
              tokenStream.expect(SPACE);
            if (flexGrow === void 0 && tokenStream.matches(NUMBER)) {
              flexGrow = tokenStream.lastValue;
              tokenStream.saveRewindPoint();
              if (tokenStream.matches(SPACE) && tokenStream.matches(NUMBER)) {
                flexShrink = tokenStream.lastValue;
              } else {
                tokenStream.rewind();
              }
            } else if (flexBasis === void 0 && tokenStream.matches(LENGTH, UNSUPPORTED_LENGTH_UNIT, PERCENT)) {
              flexBasis = tokenStream.lastValue;
            } else if (flexBasis === void 0 && tokenStream.matches(AUTO)) {
              flexBasis = "auto";
            } else {
              tokenStream["throw"]();
            }
            partsParsed += 1;
          }
          tokenStream.expectEmpty();
          if (flexGrow === void 0)
            flexGrow = defaultFlexGrow;
          if (flexShrink === void 0)
            flexShrink = defaultFlexShrink;
          if (flexBasis === void 0)
            flexBasis = defaultFlexBasis;
          return {
            flexGrow,
            flexShrink,
            flexBasis
          };
        }, "flex2");
        var FLEX_WRAP = regExpToken(/(nowrap|wrap|wrap-reverse)/);
        var FLEX_DIRECTION = regExpToken(/(row|row-reverse|column|column-reverse)/);
        var defaultFlexWrap = "nowrap";
        var defaultFlexDirection = "row";
        var flexFlow = /* @__PURE__ */ __name(function flexFlow2(tokenStream) {
          var flexWrap;
          var flexDirection;
          var partsParsed = 0;
          while (partsParsed < 2 && tokenStream.hasTokens()) {
            if (partsParsed !== 0)
              tokenStream.expect(SPACE);
            if (flexWrap === void 0 && tokenStream.matches(FLEX_WRAP)) {
              flexWrap = tokenStream.lastValue;
            } else if (flexDirection === void 0 && tokenStream.matches(FLEX_DIRECTION)) {
              flexDirection = tokenStream.lastValue;
            } else {
              tokenStream["throw"]();
            }
            partsParsed += 1;
          }
          tokenStream.expectEmpty();
          if (flexWrap === void 0)
            flexWrap = defaultFlexWrap;
          if (flexDirection === void 0)
            flexDirection = defaultFlexDirection;
          return {
            flexWrap,
            flexDirection
          };
        }, "flexFlow2");
        var fontFamily = /* @__PURE__ */ __name(function fontFamily2(tokenStream) {
          var fontFamily3;
          if (tokenStream.matches(STRING)) {
            fontFamily3 = tokenStream.lastValue;
          } else {
            fontFamily3 = tokenStream.expect(IDENT);
            while (tokenStream.hasTokens()) {
              tokenStream.expect(SPACE);
              var nextIdent = tokenStream.expect(IDENT);
              fontFamily3 += " " + nextIdent;
            }
          }
          tokenStream.expectEmpty();
          return {
            fontFamily: fontFamily3
          };
        }, "fontFamily2");
        var NORMAL = regExpToken(/^(normal)$/);
        var STYLE = regExpToken(/^(italic)$/);
        var WEIGHT = regExpToken(/^([1-9]00|bold)$/);
        var VARIANT = regExpToken(/^(small-caps)$/);
        var defaultFontStyle = "normal";
        var defaultFontWeight = "normal";
        var defaultFontVariant = [];
        var font = /* @__PURE__ */ __name(function font2(tokenStream) {
          var fontStyle;
          var fontWeight2;
          var fontVariant2;
          var lineHeight;
          var numStyleWeightVariantMatched = 0;
          while (numStyleWeightVariantMatched < 3 && tokenStream.hasTokens()) {
            if (tokenStream.matches(NORMAL))
              ;
            else if (fontStyle === void 0 && tokenStream.matches(STYLE)) {
              fontStyle = tokenStream.lastValue;
            } else if (fontWeight2 === void 0 && tokenStream.matches(WEIGHT)) {
              fontWeight2 = tokenStream.lastValue;
            } else if (fontVariant2 === void 0 && tokenStream.matches(VARIANT)) {
              fontVariant2 = [tokenStream.lastValue];
            } else {
              break;
            }
            tokenStream.expect(SPACE);
            numStyleWeightVariantMatched += 1;
          }
          var fontSize = tokenStream.expect(LENGTH, UNSUPPORTED_LENGTH_UNIT);
          if (tokenStream.matches(SLASH)) {
            lineHeight = tokenStream.expect(LENGTH, UNSUPPORTED_LENGTH_UNIT);
          }
          tokenStream.expect(SPACE);
          var _fontFamily = fontFamily(tokenStream), fontFamily$1 = _fontFamily.fontFamily;
          if (fontStyle === void 0)
            fontStyle = defaultFontStyle;
          if (fontWeight2 === void 0)
            fontWeight2 = defaultFontWeight;
          if (fontVariant2 === void 0)
            fontVariant2 = defaultFontVariant;
          var out = {
            fontStyle,
            fontWeight: fontWeight2,
            fontVariant: fontVariant2,
            fontSize,
            fontFamily: fontFamily$1
          };
          if (lineHeight !== void 0)
            out.lineHeight = lineHeight;
          return out;
        }, "font2");
        var fontVariant = /* @__PURE__ */ __name(function fontVariant2(tokenStream) {
          var values = [tokenStream.expect(IDENT)];
          while (tokenStream.hasTokens()) {
            tokenStream.expect(SPACE);
            values.push(tokenStream.expect(IDENT));
          }
          return {
            fontVariant: values
          };
        }, "fontVariant2");
        var ALIGN_CONTENT = regExpToken(/(flex-(?:start|end)|center|stretch|space-(?:between|around))/);
        var JUSTIFY_CONTENT = regExpToken(/(flex-(?:start|end)|center|space-(?:between|around|evenly))/);
        var placeContent = /* @__PURE__ */ __name(function placeContent2(tokenStream) {
          var alignContent = tokenStream.expect(ALIGN_CONTENT);
          var justifyContent;
          if (tokenStream.hasTokens()) {
            tokenStream.expect(SPACE);
            justifyContent = tokenStream.expect(JUSTIFY_CONTENT);
          } else {
            justifyContent = "stretch";
          }
          tokenStream.expectEmpty();
          return {
            alignContent,
            justifyContent
          };
        }, "placeContent2");
        var STYLE$1 = regExpToken(/^(solid|double|dotted|dashed)$/);
        var defaultTextDecorationLine = "none";
        var defaultTextDecorationStyle = "solid";
        var defaultTextDecorationColor = "black";
        var textDecoration = /* @__PURE__ */ __name(function textDecoration2(tokenStream) {
          var line;
          var style;
          var color;
          var didParseFirst = false;
          while (tokenStream.hasTokens()) {
            if (didParseFirst)
              tokenStream.expect(SPACE);
            if (line === void 0 && tokenStream.matches(LINE)) {
              var lines = [tokenStream.lastValue.toLowerCase()];
              tokenStream.saveRewindPoint();
              if (lines[0] !== "none" && tokenStream.matches(SPACE) && tokenStream.matches(LINE)) {
                lines.push(tokenStream.lastValue.toLowerCase());
                lines.sort().reverse();
              } else {
                tokenStream.rewind();
              }
              line = lines.join(" ");
            } else if (style === void 0 && tokenStream.matches(STYLE$1)) {
              style = tokenStream.lastValue;
            } else if (color === void 0 && tokenStream.matches(COLOR)) {
              color = tokenStream.lastValue;
            } else {
              tokenStream["throw"]();
            }
            didParseFirst = true;
          }
          return {
            textDecorationLine: line !== void 0 ? line : defaultTextDecorationLine,
            textDecorationColor: color !== void 0 ? color : defaultTextDecorationColor,
            textDecorationStyle: style !== void 0 ? style : defaultTextDecorationStyle
          };
        }, "textDecoration2");
        var textDecorationLine = /* @__PURE__ */ __name(function textDecorationLine2(tokenStream) {
          var lines = [];
          var didParseFirst = false;
          while (tokenStream.hasTokens()) {
            if (didParseFirst)
              tokenStream.expect(SPACE);
            lines.push(tokenStream.expect(LINE).toLowerCase());
            didParseFirst = true;
          }
          lines.sort().reverse();
          return {
            textDecorationLine: lines.join(" ")
          };
        }, "textDecorationLine2");
        var textShadow = /* @__PURE__ */ __name(function textShadow2(tokenStream) {
          var _parseShadow2 = parseShadow(tokenStream), offset = _parseShadow2.offset, radius = _parseShadow2.radius, color = _parseShadow2.color;
          return {
            textShadowOffset: offset,
            textShadowRadius: radius,
            textShadowColor: color
          };
        }, "textShadow2");
        var oneOfType = /* @__PURE__ */ __name(function oneOfType2(tokenType) {
          return function(functionStream) {
            var value = functionStream.expect(tokenType);
            functionStream.expectEmpty();
            return value;
          };
        }, "oneOfType2");
        var singleNumber = oneOfType(NUMBER);
        var singleLength = oneOfType(LENGTH);
        var singleAngle = oneOfType(ANGLE);
        var xyTransformFactory = /* @__PURE__ */ __name(function xyTransformFactory2(tokenType) {
          return function(key, valueIfOmitted) {
            return function(functionStream) {
              var _ref3, _ref4;
              var x2 = functionStream.expect(tokenType);
              var y;
              if (functionStream.hasTokens()) {
                functionStream.expect(COMMA);
                y = functionStream.expect(tokenType);
              } else if (valueIfOmitted !== void 0) {
                y = valueIfOmitted;
              } else {
                return x2;
              }
              functionStream.expectEmpty();
              return [(_ref3 = {}, _ref3[key + "Y"] = y, _ref3), (_ref4 = {}, _ref4[key + "X"] = x2, _ref4)];
            };
          };
        }, "xyTransformFactory2");
        var xyNumber = xyTransformFactory(NUMBER);
        var xyLength = xyTransformFactory(LENGTH);
        var xyAngle = xyTransformFactory(ANGLE);
        var partTransforms = {
          perspective: singleNumber,
          scale: xyNumber("scale"),
          scaleX: singleNumber,
          scaleY: singleNumber,
          translate: xyLength("translate", 0),
          translateX: singleLength,
          translateY: singleLength,
          rotate: singleAngle,
          rotateX: singleAngle,
          rotateY: singleAngle,
          rotateZ: singleAngle,
          skewX: singleAngle,
          skewY: singleAngle,
          skew: xyAngle("skew", "0deg")
        };
        var transform = /* @__PURE__ */ __name(function transform2(tokenStream) {
          var transforms2 = [];
          var didParseFirst = false;
          while (tokenStream.hasTokens()) {
            if (didParseFirst)
              tokenStream.expect(SPACE);
            var functionStream = tokenStream.expectFunction();
            var functionName = functionStream.functionName;
            var transformedValues = partTransforms[functionName](functionStream);
            if (!Array.isArray(transformedValues)) {
              var _ref5;
              transformedValues = [(_ref5 = {}, _ref5[functionName] = transformedValues, _ref5)];
            }
            transforms2 = transformedValues.concat(transforms2);
            didParseFirst = true;
          }
          return {
            transform: transforms2
          };
        }, "transform2");
        var background = /* @__PURE__ */ __name(function background2(tokenStream) {
          return {
            backgroundColor: tokenStream.expect(COLOR)
          };
        }, "background2");
        var borderColor = directionFactory({
          types: [COLOR],
          prefix: "border",
          suffix: "Color"
        });
        var borderRadius = directionFactory({
          directions: ["TopLeft", "TopRight", "BottomRight", "BottomLeft"],
          prefix: "border",
          suffix: "Radius"
        });
        var borderWidth = directionFactory({
          prefix: "border",
          suffix: "Width"
        });
        var margin = directionFactory({
          types: [LENGTH, UNSUPPORTED_LENGTH_UNIT, PERCENT, AUTO],
          prefix: "margin"
        });
        var padding = directionFactory({
          prefix: "padding"
        });
        var fontWeight = /* @__PURE__ */ __name(function fontWeight2(tokenStream) {
          return {
            fontWeight: tokenStream.expect(WORD)
            // Also match numbers as strings
          };
        }, "fontWeight2");
        var shadowOffset = /* @__PURE__ */ __name(function shadowOffset2(tokenStream) {
          return {
            shadowOffset: parseShadowOffset(tokenStream)
          };
        }, "shadowOffset2");
        var textShadowOffset = /* @__PURE__ */ __name(function textShadowOffset2(tokenStream) {
          return {
            textShadowOffset: parseShadowOffset(tokenStream)
          };
        }, "textShadowOffset2");
        var transforms = {
          aspectRatio,
          background,
          border,
          borderColor,
          borderRadius,
          borderWidth,
          boxShadow,
          flex,
          flexFlow,
          font,
          fontFamily,
          fontVariant,
          fontWeight,
          margin,
          padding,
          placeContent,
          shadowOffset,
          textShadow,
          textShadowOffset,
          textDecoration,
          textDecorationLine,
          transform
        };
        var propertiesWithoutUnits;
        if (true) {
          propertiesWithoutUnits = ["aspectRatio", "elevation", "flexGrow", "flexShrink", "opacity", "shadowOpacity", "zIndex"];
        }
        var devPropertiesWithUnitsRegExp = propertiesWithoutUnits != null ? new RegExp(propertiesWithoutUnits.join("|")) : null;
        var SYMBOL_MATCH = "SYMBOL_MATCH";
        var TokenStream = /* @__PURE__ */ function() {
          function TokenStream2(nodes, parent) {
            this.index = 0;
            this.nodes = nodes;
            this.functionName = parent != null ? parent.value : null;
            this.lastValue = null;
            this.rewindIndex = -1;
          }
          __name(TokenStream2, "TokenStream2");
          var _proto = TokenStream2.prototype;
          _proto.hasTokens = /* @__PURE__ */ __name(function hasTokens() {
            return this.index <= this.nodes.length - 1;
          }, "hasTokens");
          _proto[SYMBOL_MATCH] = function() {
            if (!this.hasTokens())
              return null;
            var node = this.nodes[this.index];
            for (var i2 = 0; i2 < arguments.length; i2 += 1) {
              var tokenDescriptor = i2 < 0 || arguments.length <= i2 ? void 0 : arguments[i2];
              var value = tokenDescriptor(node);
              if (value !== null) {
                this.index += 1;
                this.lastValue = value;
                return value;
              }
            }
            return null;
          };
          _proto.matches = /* @__PURE__ */ __name(function matches() {
            return this[SYMBOL_MATCH].apply(this, arguments) !== null;
          }, "matches");
          _proto.expect = /* @__PURE__ */ __name(function expect() {
            var value = this[SYMBOL_MATCH].apply(this, arguments);
            return value !== null ? value : this["throw"]();
          }, "expect");
          _proto.matchesFunction = /* @__PURE__ */ __name(function matchesFunction() {
            var node = this.nodes[this.index];
            if (node.type !== "function")
              return null;
            var value = new TokenStream2(node.nodes, node);
            this.index += 1;
            this.lastValue = null;
            return value;
          }, "matchesFunction");
          _proto.expectFunction = /* @__PURE__ */ __name(function expectFunction() {
            var value = this.matchesFunction();
            return value !== null ? value : this["throw"]();
          }, "expectFunction");
          _proto.expectEmpty = /* @__PURE__ */ __name(function expectEmpty() {
            if (this.hasTokens())
              this["throw"]();
          }, "expectEmpty");
          _proto["throw"] = /* @__PURE__ */ __name(function _throw() {
            throw new Error("Unexpected token type: " + this.nodes[this.index].type);
          }, "_throw");
          _proto.saveRewindPoint = /* @__PURE__ */ __name(function saveRewindPoint() {
            this.rewindIndex = this.index;
          }, "saveRewindPoint");
          _proto.rewind = /* @__PURE__ */ __name(function rewind() {
            if (this.rewindIndex === -1)
              throw new Error("Internal error");
            this.index = this.rewindIndex;
            this.lastValue = null;
          }, "rewind");
          return TokenStream2;
        }();
        var numberOrLengthRe = /^([+-]?(?:\d*\.)?\d+(?:e[+-]?\d+)?)(?:px)?$/i;
        var numberOnlyRe = /^[+-]?(?:\d*\.\d*|[1-9]\d*)(?:e[+-]?\d+)?$/i;
        var boolRe = /^true|false$/i;
        var nullRe = /^null$/i;
        var undefinedRe = /^undefined$/i;
        var transformRawValue = /* @__PURE__ */ __name(function transformRawValue2(propName, value) {
          if (true) {
            var needsUnit = !devPropertiesWithUnitsRegExp.test(propName);
            var isNumberWithoutUnit = numberOnlyRe.test(value);
            if (needsUnit && isNumberWithoutUnit) {
              console.warn('Expected style "' + propName + ": " + value + '" to contain units');
            }
            if (!needsUnit && value !== "0" && !isNumberWithoutUnit) {
              console.warn('Expected style "' + propName + ": " + value + '" to be unitless');
            }
          }
          var numberMatch = value.match(numberOrLengthRe);
          if (numberMatch !== null)
            return Number(numberMatch[1]);
          var boolMatch = value.match(boolRe);
          if (boolMatch !== null)
            return boolMatch[0].toLowerCase() === "true";
          var nullMatch = value.match(nullRe);
          if (nullMatch !== null)
            return null;
          var undefinedMatch = value.match(undefinedRe);
          if (undefinedMatch !== null)
            return void 0;
          return value;
        }, "transformRawValue2");
        var baseTransformShorthandValue = /* @__PURE__ */ __name(function baseTransformShorthandValue2(propName, value) {
          var ast = parse__default(value);
          var tokenStream = new TokenStream(ast.nodes);
          return transforms[propName](tokenStream);
        }, "baseTransformShorthandValue2");
        var transformShorthandValue = false ? baseTransformShorthandValue : function(propName, value) {
          try {
            return baseTransformShorthandValue(propName, value);
          } catch (e) {
            throw new Error('Failed to parse declaration "' + propName + ": " + value + '"');
          }
        };
        var getStylesForProperty = /* @__PURE__ */ __name(function getStylesForProperty2(propName, inputValue, allowShorthand) {
          var _ref6;
          var isRawValue = allowShorthand === false || !(propName in transforms);
          var value = inputValue.trim();
          var propValues = isRawValue ? (_ref6 = {}, _ref6[propName] = transformRawValue(propName, value), _ref6) : transformShorthandValue(propName, value);
          return propValues;
        }, "getStylesForProperty2");
        var getPropertyName = /* @__PURE__ */ __name(function getPropertyName2(propName) {
          var isCustomProp = /^--\w+/.test(propName);
          if (isCustomProp) {
            return propName;
          }
          return camelizeStyleName(propName);
        }, "getPropertyName2");
        var index = /* @__PURE__ */ __name(function index2(rules, shorthandBlacklist) {
          if (shorthandBlacklist === void 0) {
            shorthandBlacklist = [];
          }
          return rules.reduce(function(accum, rule) {
            var propertyName = getPropertyName(rule[0]);
            var value = rule[1];
            var allowShorthand = shorthandBlacklist.indexOf(propertyName) === -1;
            return Object.assign(accum, getStylesForProperty(propertyName, value, allowShorthand));
          }, {});
        }, "index2");
        exports2["default"] = index;
        exports2.getPropertyName = getPropertyName;
        exports2.getStylesForProperty = getStylesForProperty;
        exports2.transformRawValue = transformRawValue;
      }
    });
    require_css_background_parser = __commonJS2({
      "../../node_modules/css-background-parser/index.js"(exports2, module) {
        (function(exports3) {
          function BackgroundList(backgrounds) {
            if (!(this instanceof BackgroundList)) {
              return new BackgroundList();
            }
            this.backgrounds = backgrounds || [];
          }
          __name(BackgroundList, "BackgroundList");
          BackgroundList.prototype.toString = function() {
            return this.backgrounds.join(", ");
          };
          function Background(props) {
            if (!(this instanceof Background)) {
              return new Background(props);
            }
            props = props || {};
            var bg = this;
            function defprop(name, defaultValue) {
              bg[name] = name in props ? props[name] : defaultValue;
            }
            __name(defprop, "defprop");
            defprop("color", "");
            defprop("image", "none");
            defprop("attachment", "scroll");
            defprop("clip", "border-box");
            defprop("origin", "padding-box");
            defprop("position", "0% 0%");
            defprop("repeat", "repeat");
            defprop("size", "auto");
          }
          __name(Background, "Background");
          Background.prototype.toString = function() {
            var list = [
              this.image,
              this.repeat,
              this.attachment,
              this.position + " / " + this.size,
              this.origin,
              this.clip
            ];
            if (this.color) {
              list.unshift(this.color);
            }
            return list.join(" ");
          };
          exports3.BackgroundList = BackgroundList;
          exports3.Background = Background;
          function parseImages(cssText) {
            var images = [];
            var tokens = /[,\(\)]/;
            var parens = 0;
            var buffer = "";
            if (cssText == null) {
              return images;
            }
            while (cssText.length) {
              var match2 = tokens.exec(cssText);
              if (!match2) {
                break;
              }
              var char = match2[0];
              var ignoreChar = false;
              switch (char) {
                case ",":
                  if (!parens) {
                    images.push(buffer.trim());
                    buffer = "";
                    ignoreChar = true;
                  }
                  break;
                case "(":
                  parens++;
                  break;
                case ")":
                  parens--;
                  break;
              }
              var index = match2.index + 1;
              buffer += cssText.slice(0, ignoreChar ? index - 1 : index);
              cssText = cssText.slice(index);
            }
            if (buffer.length || cssText.length) {
              images.push((buffer + cssText).trim());
            }
            return images;
          }
          __name(parseImages, "parseImages");
          function trim(str) {
            return str.trim();
          }
          __name(trim, "trim");
          function parseSimpleList(cssText) {
            return (cssText || "").split(",").map(trim);
          }
          __name(parseSimpleList, "parseSimpleList");
          exports3.parseElementStyle = function(styleObject) {
            var list = new BackgroundList();
            if (styleObject == null) {
              return list;
            }
            var bgImage = parseImages(styleObject.backgroundImage);
            var bgColor = styleObject.backgroundColor;
            var bgAttachment = parseSimpleList(styleObject.backgroundAttachment);
            var bgClip = parseSimpleList(styleObject.backgroundClip);
            var bgOrigin = parseSimpleList(styleObject.backgroundOrigin);
            var bgPosition = parseSimpleList(styleObject.backgroundPosition);
            var bgRepeat = parseSimpleList(styleObject.backgroundRepeat);
            var bgSize = parseSimpleList(styleObject.backgroundSize);
            var background;
            for (var i2 = 0, ii = bgImage.length; i2 < ii; i2++) {
              background = new Background({
                image: bgImage[i2],
                attachment: bgAttachment[i2 % bgAttachment.length],
                clip: bgClip[i2 % bgClip.length],
                origin: bgOrigin[i2 % bgOrigin.length],
                position: bgPosition[i2 % bgPosition.length],
                repeat: bgRepeat[i2 % bgRepeat.length],
                size: bgSize[i2 % bgSize.length]
              });
              if (i2 === ii - 1) {
                background.color = bgColor;
              }
              list.backgrounds.push(background);
            }
            return list;
          };
        })(function(root) {
          if (typeof module !== "undefined" && module.exports !== void 0)
            return module.exports;
          return root.cssBgParser = {};
        }(exports2));
      }
    });
    require_css_box_shadow = __commonJS2({
      "../../node_modules/css-box-shadow/index.js"(exports2, module) {
        var VALUES_REG = /,(?![^\(]*\))/;
        var PARTS_REG = /\s(?![^(]*\))/;
        var LENGTH_REG = /^[0-9]+[a-zA-Z%]+?$/;
        var parseValue = /* @__PURE__ */ __name((str) => {
          const parts = str.split(PARTS_REG);
          const inset = parts.includes("inset");
          const last = parts.slice(-1)[0];
          const color = !isLength(last) ? last : void 0;
          const nums = parts.filter((n) => n !== "inset").filter((n) => n !== color).map(toNum);
          const [offsetX, offsetY, blurRadius, spreadRadius] = nums;
          return {
            inset,
            offsetX,
            offsetY,
            blurRadius,
            spreadRadius,
            color
          };
        }, "parseValue");
        var stringifyValue = /* @__PURE__ */ __name((obj) => {
          const {
            inset,
            offsetX = 0,
            offsetY = 0,
            blurRadius = 0,
            spreadRadius,
            color
          } = obj || {};
          return [
            inset ? "inset" : null,
            offsetX,
            offsetY,
            blurRadius,
            spreadRadius,
            color
          ].filter((v) => v !== null && v !== void 0).map(toPx).map((s) => ("" + s).trim()).join(" ");
        }, "stringifyValue");
        var isLength = /* @__PURE__ */ __name((v) => v === "0" || LENGTH_REG.test(v), "isLength");
        var toNum = /* @__PURE__ */ __name((v) => {
          if (!/px$/.test(v) && v !== "0")
            return v;
          const n = parseFloat(v);
          return !isNaN(n) ? n : v;
        }, "toNum");
        var toPx = /* @__PURE__ */ __name((n) => typeof n === "number" && n !== 0 ? n + "px" : n, "toPx");
        var parse22 = /* @__PURE__ */ __name((str) => str.split(VALUES_REG).map((s) => s.trim()).map(parseValue), "parse2");
        var stringify = /* @__PURE__ */ __name((arr) => arr.map(stringifyValue).join(", "), "stringify");
        module.exports = {
          parse: parse22,
          stringify
        };
      }
    });
    U200D = String.fromCharCode(8205);
    UFE0Fg = /\uFE0F/g;
    __name(getIconCode, "getIconCode");
    __name(toCodePoint, "toCodePoint");
    apis = {
      twemoji: /* @__PURE__ */ __name((code) => "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/" + code.toLowerCase() + ".svg", "twemoji"),
      openmoji: "https://cdn.jsdelivr.net/npm/@svgmoji/openmoji@2.0.0/svg/",
      blobmoji: "https://cdn.jsdelivr.net/npm/@svgmoji/blob@2.0.0/svg/",
      noto: "https://cdn.jsdelivr.net/gh/svgmoji/svgmoji/packages/svgmoji__noto/svg/",
      fluent: /* @__PURE__ */ __name((code) => "https://cdn.jsdelivr.net/gh/shuding/fluentui-emoji-unicode/assets/" + code.toLowerCase() + "_color.svg", "fluent"),
      fluentFlat: /* @__PURE__ */ __name((code) => "https://cdn.jsdelivr.net/gh/shuding/fluentui-emoji-unicode/assets/" + code.toLowerCase() + "_flat.svg", "fluentFlat")
    };
    __name(loadEmoji, "loadEmoji");
    languageFontMap = {
      "ja-JP": "Noto+Sans+JP",
      "ko-KR": "Noto+Sans+KR",
      "zh-CN": "Noto+Sans+SC",
      "zh-TW": "Noto+Sans+TC",
      "zh-HK": "Noto+Sans+HK",
      "th-TH": "Noto+Sans+Thai",
      "bn-IN": "Noto+Sans+Bengali",
      "ar-AR": "Noto+Sans+Arabic",
      "ta-IN": "Noto+Sans+Tamil",
      "ml-IN": "Noto+Sans+Malayalam",
      "he-IL": "Noto+Sans+Hebrew",
      "te-IN": "Noto+Sans+Telugu",
      devanagari: "Noto+Sans+Devanagari",
      kannada: "Noto+Sans+Kannada",
      symbol: ["Noto+Sans+Symbols", "Noto+Sans+Symbols+2"],
      math: "Noto+Sans+Math",
      unknown: "Noto+Sans"
    };
    __name(loadGoogleFont, "loadGoogleFont");
    assetCache = /* @__PURE__ */ new Map();
    loadDynamicAsset = /* @__PURE__ */ __name(({ emoji }) => {
      const fn2 = /* @__PURE__ */ __name(async (code, text) => {
        if (code === "emoji") {
          return `data:image/svg+xml;base64,` + btoa(await (await loadEmoji(getIconCode(text), emoji)).text());
        }
        if (!languageFontMap[code])
          code = "unknown";
        try {
          const data = await loadGoogleFont(languageFontMap[code], text);
          if (data) {
            return {
              name: `satori_${code}_fallback_${text}`,
              data,
              weight: 400,
              style: "normal"
            };
          }
        } catch (e) {
          console.error("Failed to load dynamic font for", text, ". Error:", e);
        }
      }, "fn2");
      return async (...args) => {
        const key = JSON.stringify(args);
        const cache = assetCache.get(key);
        if (cache)
          return cache;
        const asset = await fn2(...args);
        assetCache.set(key, asset);
        return asset;
      };
    }, "loadDynamicAsset");
    __name(render, "render");
    import_unicode_trie = __toESM2(require_unicode_trie(), 1);
    import_base64_js = __toESM2(require_b64(), 1);
    $557adaaeb0c7885f$exports = {};
    $1627905f8be2ef3f$export$fb4028874a74450 = 5;
    $1627905f8be2ef3f$export$1bb1140fe1358b00 = 12;
    $1627905f8be2ef3f$export$f3e416a182673355 = 13;
    $1627905f8be2ef3f$export$24aa617c849a894a = 16;
    $1627905f8be2ef3f$export$a73c4d14459b698d = 17;
    $1627905f8be2ef3f$export$9e5d732f3676a9ba = 22;
    $1627905f8be2ef3f$export$1dff41d5c0caca01 = 28;
    $1627905f8be2ef3f$export$30a74a373318dec6 = 31;
    $1627905f8be2ef3f$export$d710c5f50fc7496a = 33;
    $1627905f8be2ef3f$export$66498d28055820a9 = 34;
    $1627905f8be2ef3f$export$eb6c6d0b7c8826f2 = 35;
    $1627905f8be2ef3f$export$de92be486109a1df = 36;
    $1627905f8be2ef3f$export$606cfc2a8896c91f = 37;
    $1627905f8be2ef3f$export$e51d3c675bb0140d = 38;
    $1627905f8be2ef3f$export$da51c6332ad11d7b = 39;
    $1627905f8be2ef3f$export$bea437c40441867d = 40;
    $1627905f8be2ef3f$export$c4c7eecbfed13dc9 = 41;
    $1627905f8be2ef3f$export$98e1f8a379849661 = 42;
    $32627af916ac1b00$export$98f50d781a474745 = 0;
    $32627af916ac1b00$export$12ee1f8f5315ca7e = 1;
    $32627af916ac1b00$export$e4965ce242860454 = 2;
    $32627af916ac1b00$export$8f14048969dcd45e = 3;
    $32627af916ac1b00$export$133eb141bf58aff4 = 4;
    $32627af916ac1b00$export$5bdb8ccbf5c57afc = [
      //OP   , CL    , CP    , QU    , GL    , NS    , EX    , SY    , IS    , PR    , PO    , NU    , AL    , HL    , ID    , IN    , HY    , BA    , BB    , B2    , ZW    , CM    , WJ    , H2    , H3    , JL    , JV    , JT    , RI    , EB    , EM    , ZWJ   , CB
      [
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$8f14048969dcd45e,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$133eb141bf58aff4
      ],
      [
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$e4965ce242860454,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$98f50d781a474745
      ],
      [
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$e4965ce242860454,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$98f50d781a474745
      ],
      [
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$e4965ce242860454,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e
      ],
      [
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$e4965ce242860454,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e
      ],
      [
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$e4965ce242860454,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$98f50d781a474745
      ],
      [
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$e4965ce242860454,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$98f50d781a474745
      ],
      [
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$e4965ce242860454,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$98f50d781a474745
      ],
      [
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$e4965ce242860454,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$98f50d781a474745
      ],
      [
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$e4965ce242860454,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$98f50d781a474745
      ],
      [
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$e4965ce242860454,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$98f50d781a474745
      ],
      [
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$e4965ce242860454,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$98f50d781a474745
      ],
      [
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$e4965ce242860454,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$98f50d781a474745
      ],
      [
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$e4965ce242860454,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$98f50d781a474745
      ],
      [
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$e4965ce242860454,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$98f50d781a474745
      ],
      [
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$e4965ce242860454,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$98f50d781a474745
      ],
      [
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$e4965ce242860454,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$98f50d781a474745
      ],
      [
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$e4965ce242860454,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$98f50d781a474745
      ],
      [
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$e4965ce242860454,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$98f50d781a474745
      ],
      [
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$e4965ce242860454,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$98f50d781a474745
      ],
      [
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745
      ],
      [
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$e4965ce242860454,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$98f50d781a474745
      ],
      [
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$e4965ce242860454,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e
      ],
      [
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$e4965ce242860454,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$98f50d781a474745
      ],
      [
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$e4965ce242860454,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$98f50d781a474745
      ],
      [
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$e4965ce242860454,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$98f50d781a474745
      ],
      [
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$e4965ce242860454,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$98f50d781a474745
      ],
      [
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$e4965ce242860454,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$98f50d781a474745
      ],
      [
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$e4965ce242860454,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$98f50d781a474745
      ],
      [
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$e4965ce242860454,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$98f50d781a474745
      ],
      [
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$e4965ce242860454,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$98f50d781a474745
      ],
      [
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$e4965ce242860454,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$98f50d781a474745
      ],
      [
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$e4965ce242860454,
        $32627af916ac1b00$export$133eb141bf58aff4,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$98f50d781a474745,
        $32627af916ac1b00$export$12ee1f8f5315ca7e,
        $32627af916ac1b00$export$98f50d781a474745
      ]
      // CB
    ];
    $557adaaeb0c7885f$var$data = import_base64_js.default.toByteArray("AAgOAAAAAAAQ4QAAAQ0P8vDtnQuMXUUZx+eyu7d7797d9m5bHoWltKVUlsjLWE0VJNigQoMVqkStEoNQQUl5GIo1KKmogEgqkKbBRki72lYabZMGKoGAjQRtJJDaCCIRiiigREBQS3z+xzOTnZ3O+3HOhd5NfpkzZx7fN9988zivu2M9hGwB28F94DnwEngd/Asc1EtIs9c/bIPDwCxwLDgezHcodyo4w5C+CCwBS8FnwSXgCnA1uFbI93XwbXAbWAfWgx+CzWAb+An4KfgFeAzsYWWfYuFz4CXwGvgb+Dfo6yNkEEwGh4CZYB44FpwI3g1OY+kfBItZOo2fB84Hy8DF4HJwNbiWpV8PVoO1LH4n2NRXyN+KcAd4kNVP9XsY4aPgcfAbsBfs6SniL4K/sPjfEf6HlanXCRkCw2BGvUh/keWfXS/CY+pFXs7x9XHmM94LTmWIeU2cgbxnS/k/B3kf86jDhU8L9V2E40vAFWAlWFUfb++NOL4F3C7JX4/4GiE+hvgWsF0oS7mXldspnN+F493gyXrh9xTav0cg3EvzgVfBG6wsmVSEkxBOBgdPGpd7JI6PnqRvJ68/xlbHof53gPeA94OzwLngk+ACsAwsByvASrAK3MB0Ws3CtQjvBJvAVrADPMDSHkb4CNijaccTwvnf4fiPEs8Lxy+D18A/QU8/xjgYBjPAbDAKTgYLwOngTHAO+EQ/8wuEF4EvsPiVCFf2+9tsFStzA8LVHuXXBsi6QyqzUYiPMR/7Mc7dAx7oL8bzw/3u/Bw8Bp4Az4AXwCtgHzsmDXP5fiF9iiVvly5d0sHngar16NKlS5cuXbp06fLmYlqHXrcd3ph4P0THUY3iXh49novju4S0tzfs5d+JPKewfAsRntZb3K9ZhOMlrO6lCC8An28U9+OuovcPcPxlVu5rCL/VmHh/iHIrzn3fIPu7SN8Axmg+8AOwEWwCm7tp3bRuWjetm5Y8bSu4B9zbKO6ZVsnORrVU3f4uXTqZ2H3sLoyx3eDXjfDndE9qyj6L838CfwVvgFpzYnof4oNgOhgBc8Fos9DrZIQLmtXPP1MmF6wGj4H+KXoWguvADkXaPil+YpuQy8Am8Ey7ODdtmJDF4HowBp4De6HDTNjhfHAHeBr0DBBy0kDxfPbcgSIusgrcWhtnJ8vL+TPix7UIOQtcBq4C28Cr4KRBnANbwSuDE+s50JgyNNFuXbp06XIgsXjIvPafjvXozKY+fVFz/z0LT1uCtKVSWbrOLWPnztG8e0Xfy7ol8XtZJi7WtG+5od2UFXQ/A12vUeS7jp27yVKHjdsU9lXB869TyNvAzt0lpP2oWbwLdjiO78bx/Sz+EMJHwK9Y/LcIfw+eZ3F67/Hl5vh9xX80J+rwX8SvRDhpgL17iPAQMHNArfPrqHPewLheI+AERV6efwV418B4nOZ/H+IfYHV8GOF5LJ3eAz0fx8sM9S0fUNud39O9CulfGZhY5huI3wzWgNvBelbHZoTbNPVpfYjKQpkHwUNgl0LWblbnk0LbbDxr0OMFpL3iqWdu9nWYPlVAWkXY39LnGdCkDbeqv1YNbfcMQ3t9oe8lzm6NH9N1ZB6Ln4BwfkJZJk7RyFnYKt6b/JDQXx9p5X+eFdqOjzM9P9MB/lUlFzr20aXIdzlY4dmn9F3YqtvoO76/2hp/D/xA5Zue88nNyL8GbFbs075X0tyUig3Qd2MCnf//HjnzpbsR3g9+1kHzzVjdnE71/qVBX9rGPUh/ysNWe1neFzvIDi5zAufV1sT0N0poR22wkFUfTOPfA4N2mbZ5fSrqOHSw+IbkSBbOGSzSRgf91/GTUWYBOB2cIZQ/G8cfBZ8CFwrnL8XxF8FKcA24jqXdiPA7Qr61OF7H4mMItwzuv2/YLth1ISt3Hzu3k4W7EH5JqPdRHD/O4k+z8A8IX5Lq3y7Z4nXE9xn6kX6vQ4bKfy+ok+hH+xf3hq9dnTTHhjKd2GmDuWA242iHMq4cC7A8kJ7i8o1+skSa7Jieo38HCWnoNjKFhdSFBxzpZ7QE6lI8N4S14aASZcryaV/WWHw66f6NHuCoxuQxmvM56GX9QMd8Q4D65ywGP+ZzRJuM+zQvx/MOS2VFeqQ4IXnH26zM9Xe6/E6D+4foAzzuajPZp8Qyw5ayZVDWuH0z0BtYRkeIDqH9KO9VbH1btd/lhNqCzvl8zeLnG0S/hnU6baHfpiuO6yy0rd+DHURo/zYF5H26j03rQsip2ndzz82u1z9N4VjWKWeb68Tedpt95HRVXp7H1R6p+/Wt4FPy/PpWwscOLRJ+PVWF/+W0iVyGzs18TIvXkOJ1Wxm66vSXz+vylenrZcj1ub439W+K8RNCGTJi2p/TJ1K23VaXr35tRpnzmjxequgfcfyk6B/TGBVlyedsNgpdd/h+W1U3P99QyFPNo1X3TwpM/WLTIWYfoBqXrv6iskHZ/RFr79R6hIyHBrH3f1nrUVnjP8SnZZ+rYtzr9Exld5MNbPNErusAPg+77u/eDOPftU9yj39TH7rezxd1LvsZQJlzkWlOirG/79zjMj/mtHUKu7vKy+3/LnXr9okyKedjX5/0He9iP/j63LwOQdarEVlfy8OO/Lqw023j6xcqmwxLiOd6heM2i9cV9LJy8jMJ23yQ+rpbfu7EQ/pXE8KYvUSqvVnb4XzZa6LrHMXHR+zcLvqWbm/Bn0/HzIs6fWPHoat8XfnDKmZGxRxeMbn2UqZ5Q94nmcZRbqqUXbZ8+lcjE+cPX11t814orvvAXNcG8vqj2vvk1MGn3anlj0bIT72v47bvE+Lc98T9b6r7AKn6j+8Duf7D0nnZx/j7Zjn0j9nbpSTndaLr9WNLivP+iN23xF7L+fqv6ZouFyb78jxVXvv5jJ9YUs9/sddO8h7KNg5jrhfaJGztT6G7KF+1d6yCmD5Kdb2fan60rSc552fZr3zeQ9DpnPp+Si5cx5Ktv2QfSzF/mMbWdOm46rFI4XstnU9xeqX4NKb7TKEdcr6pZOK3ID1k/LvFHkVczEuZLEDr499YqvqBym1aEHWgcvoYOtv0M91qQl5TfpO/in6rWx8OVpT1Wedkv3f5xom3T/xeR/6Gx6V86PWAOB4bBpqWdN+yTcVxjIyGRz/FrDGu6w/3d7kPm8StX8RyPu+uuvpNju/vTLJV37GpvoM0oZPnW87VLnL/5pDno1NoW1R6yedU6TyUv3u19a3KFnIbTLYz+ZCLP4T0tU1uivFgso0pnsJ/UtXvarNY28Xq5cvkBDrQP/E5ZaiuQwwfmTlsOiQRU1fMuqrDd/3ISSuwjOwXOfTyGUMpZIXq4GpLn3pUcdfzch2x7XO1u2uZHOPb1G6b3Xg9PH1IIWeEpJlPQtqos2EKW8b0u8rnuP1UeVLoXJb9be0uG9nnbchjU+XTszT5VeNBThPHnc5OKj1U9aj0GTHIVaGy1YhEWT4ixns00DT+XEzWn/7VAsIc63Cov3OdyhwjrnaqQqZvWKXdypRdlq+k8msZ031U+Rm4fA+3TtyeR9hwfW9G9yxDN0fZMN33F+9TE6md4hwoxumfaUzI9fN3PFT3xVV2msrQ3UsnChm6Nulk8TndpS28D3zX9tTIPsF/z7Am5OkTjm1tI1JZW74+4VgsZ0N3L1yXV3WeP5uR7TGHHdvC3JQlxybfpd22tDlk/2eofRK8TzrN/qnar/K/OUTth6I/+jAnEptNbPvFHP2gs40N3+dfMWtwqvVct7/wfd8gtQ7imifial9ZJ9/3IHLYU6eDj3+4PhsNhX+vwvcWLnu6kGfEMe8DuciPfUfGZB8X/7HJy/Gefe5n+VRGFd/wyP2ta7/LO4yh/sbLV/k9lev6kfO9Dt/5U67b1/6u/epqB1U9Me23jfHY9sscAg4tkbLl+e4/U36rJ9ddxfd6sg5vq5ice42Wpk/pb9FOJ36/W9tpv4kbC79nUbZceX8Zu6/qJ+P3WvhvA8v3reh7Jbn2d6rrNC7XNZTLma4Ba0JI9efX2uLzF5scG/w9UNU1ZxW+ymUfzELeTllXlQ1rUuhzjS5fp9c964iFBOqeSz63bU065nZKdU+mDEz3qHIjjifquw0pnb/raRtvrnsYcb46ihT3taoYz6brdNW9l6rWRnE/navdPn1XlR1km7hcz1WlH/elKuSOSvLLuE8U6m8uzwRdfcGl73VyTHuyMvzJ1Sa2cWDTP/Z63Kc94n2B1PYr24dz1JlyHLlcP+S4B6vD1c9EW4q2LWstCvUjeVy63k/LMYdUNd5D1xQfvVTzX1VjkMsUv88N8VH5fReVn/Fjn++/h6X6Q8a6b1/q3g/i/ewi0/Scs8zxXeV6mWIOUPlPzBgdFerW+bZrm2P18dnjuK6HunEp+rHvPMXbr+sHVb/lnL+pTP57jPw9Cvk3PW178JD9qChfzuvTf7Htl38L1QUf/VKu9SFjwWbTWPvFEvu7Uq76y7+31g6QlYPc669pbsm9Xur2LWI9Pu8ypfDXqm3A2z8s1FWGn4ntL9NfQu2oSlftX9uetvTtv7J8Ql4zxfXGZ3zk8PeQ9w59x2uMfqI8/q5eKh/l9cb2rwsu9rSNl06ZP2Pmxtz+rNMx93yno0n2/82rVH7rQ+y9P15H6FyRun9ViH81ATmffI7nJ5r8uXXW6enbP6b/B8/l5OifVHYLnb9S39s2zcc+Ph+rh8+eQgVPS72elzGWY/tUtbbabBpDiI7yN1q6/4th2y+ErAc5+9BVvu/7KamJbWNZeuqI/R4tRf+YyD1HmOZM1bMV3/14Sn10c0Xu+Sj1nOXb5jL73ncdy02uvlXZNde65dOHYl7Vs4KYuS6FzWLn2zJlpZqPXPVPOa5yzKOyn1VhT9lmMfdbfH7D11Wf2PXN5h9y+dD287+qxgSnaYmnIrRtIb8pJe6/Uv9OVer6Whn0zfGO/BEloZI9ojmfAlUflClDd178bTmVHVTpZXOkAlk/lb42UujmI89HH5V+cl7XtowY6vTxLVWok6UrGzoGTHN+bB+6ri05687VNpvfuvRfaP2uMlNQth1D5JjGelm/8yn+9p3p/7qk9gnfeddXZmq/Sm333PJT659Kv1zjNbZ9uv2Oi//67CV8/N1nj1DmviyXDNVeJkaeaX8UsyesYg8cu2+NvdaPfb+lLDu5tvt/");
    $557adaaeb0c7885f$var$classTrie = new import_unicode_trie.default($557adaaeb0c7885f$var$data);
    $557adaaeb0c7885f$var$mapClass = /* @__PURE__ */ __name(function(c2) {
      switch (c2) {
        case $1627905f8be2ef3f$export$d710c5f50fc7496a:
          return $1627905f8be2ef3f$export$1bb1140fe1358b00;
        case $1627905f8be2ef3f$export$da51c6332ad11d7b:
        case $1627905f8be2ef3f$export$bea437c40441867d:
        case $1627905f8be2ef3f$export$98e1f8a379849661:
          return $1627905f8be2ef3f$export$1bb1140fe1358b00;
        case $1627905f8be2ef3f$export$eb6c6d0b7c8826f2:
          return $1627905f8be2ef3f$export$fb4028874a74450;
        default:
          return c2;
      }
    }, "$557adaaeb0c7885f$var$mapClass");
    $557adaaeb0c7885f$var$mapFirst = /* @__PURE__ */ __name(function(c2) {
      switch (c2) {
        case $1627905f8be2ef3f$export$606cfc2a8896c91f:
        case $1627905f8be2ef3f$export$e51d3c675bb0140d:
          return $1627905f8be2ef3f$export$66498d28055820a9;
        case $1627905f8be2ef3f$export$c4c7eecbfed13dc9:
          return $1627905f8be2ef3f$export$9e5d732f3676a9ba;
        default:
          return c2;
      }
    }, "$557adaaeb0c7885f$var$mapFirst");
    $557adaaeb0c7885f$var$Break = class {
      static {
        __name(this, "$557adaaeb0c7885f$var$Break");
      }
      constructor(position, required = false) {
        this.position = position;
        this.required = required;
      }
    };
    $557adaaeb0c7885f$var$LineBreaker = class {
      static {
        __name(this, "$557adaaeb0c7885f$var$LineBreaker");
      }
      nextCodePoint() {
        const code = this.string.charCodeAt(this.pos++);
        const next = this.string.charCodeAt(this.pos);
        if (55296 <= code && code <= 56319 && 56320 <= next && next <= 57343) {
          this.pos++;
          return (code - 55296) * 1024 + (next - 56320) + 65536;
        }
        return code;
      }
      nextCharClass() {
        return $557adaaeb0c7885f$var$mapClass($557adaaeb0c7885f$var$classTrie.get(this.nextCodePoint()));
      }
      getSimpleBreak() {
        switch (this.nextClass) {
          case $1627905f8be2ef3f$export$c4c7eecbfed13dc9:
            return false;
          case $1627905f8be2ef3f$export$66498d28055820a9:
          case $1627905f8be2ef3f$export$606cfc2a8896c91f:
          case $1627905f8be2ef3f$export$e51d3c675bb0140d:
            this.curClass = $1627905f8be2ef3f$export$66498d28055820a9;
            return false;
          case $1627905f8be2ef3f$export$de92be486109a1df:
            this.curClass = $1627905f8be2ef3f$export$de92be486109a1df;
            return false;
        }
        return null;
      }
      getPairTableBreak(lastClass) {
        let shouldBreak = false;
        switch ($32627af916ac1b00$export$5bdb8ccbf5c57afc[this.curClass][this.nextClass]) {
          case $32627af916ac1b00$export$98f50d781a474745:
            shouldBreak = true;
            break;
          case $32627af916ac1b00$export$12ee1f8f5315ca7e:
            shouldBreak = lastClass === $1627905f8be2ef3f$export$c4c7eecbfed13dc9;
            break;
          case $32627af916ac1b00$export$e4965ce242860454:
            shouldBreak = lastClass === $1627905f8be2ef3f$export$c4c7eecbfed13dc9;
            if (!shouldBreak) {
              shouldBreak = false;
              return shouldBreak;
            }
            break;
          case $32627af916ac1b00$export$8f14048969dcd45e:
            if (lastClass !== $1627905f8be2ef3f$export$c4c7eecbfed13dc9)
              return shouldBreak;
            break;
          case $32627af916ac1b00$export$133eb141bf58aff4:
            break;
        }
        if (this.LB8a)
          shouldBreak = false;
        if (this.LB21a && (this.curClass === $1627905f8be2ef3f$export$24aa617c849a894a || this.curClass === $1627905f8be2ef3f$export$a73c4d14459b698d)) {
          shouldBreak = false;
          this.LB21a = false;
        } else
          this.LB21a = this.curClass === $1627905f8be2ef3f$export$f3e416a182673355;
        if (this.curClass === $1627905f8be2ef3f$export$1dff41d5c0caca01) {
          this.LB30a++;
          if (this.LB30a == 2 && this.nextClass === $1627905f8be2ef3f$export$1dff41d5c0caca01) {
            shouldBreak = true;
            this.LB30a = 0;
          }
        } else
          this.LB30a = 0;
        this.curClass = this.nextClass;
        return shouldBreak;
      }
      nextBreak() {
        if (this.curClass == null) {
          let firstClass = this.nextCharClass();
          this.curClass = $557adaaeb0c7885f$var$mapFirst(firstClass);
          this.nextClass = firstClass;
          this.LB8a = firstClass === $1627905f8be2ef3f$export$30a74a373318dec6;
          this.LB30a = 0;
        }
        while (this.pos < this.string.length) {
          this.lastPos = this.pos;
          const lastClass = this.nextClass;
          this.nextClass = this.nextCharClass();
          if (this.curClass === $1627905f8be2ef3f$export$66498d28055820a9 || this.curClass === $1627905f8be2ef3f$export$de92be486109a1df && this.nextClass !== $1627905f8be2ef3f$export$606cfc2a8896c91f) {
            this.curClass = $557adaaeb0c7885f$var$mapFirst($557adaaeb0c7885f$var$mapClass(this.nextClass));
            return new $557adaaeb0c7885f$var$Break(this.lastPos, true);
          }
          let shouldBreak = this.getSimpleBreak();
          if (shouldBreak === null)
            shouldBreak = this.getPairTableBreak(lastClass);
          this.LB8a = this.nextClass === $1627905f8be2ef3f$export$30a74a373318dec6;
          if (shouldBreak)
            return new $557adaaeb0c7885f$var$Break(this.lastPos);
        }
        if (this.lastPos < this.string.length) {
          this.lastPos = this.string.length;
          return new $557adaaeb0c7885f$var$Break(this.string.length);
        }
        return null;
      }
      constructor(string) {
        this.string = string;
        this.pos = 0;
        this.lastPos = 0;
        this.curClass = null;
        this.nextClass = null;
        this.LB8a = false;
        this.LB21a = false;
        this.LB30a = 0;
      }
    };
    $557adaaeb0c7885f$exports = $557adaaeb0c7885f$var$LineBreaker;
    import_css_to_react_native = __toESM2(require_css_to_react_native(), 1);
    import_css_background_parser = __toESM2(require_css_background_parser(), 1);
    import_css_box_shadow = __toESM2(require_css_box_shadow(), 1);
    import_postcss_value_parser = __toESM2(require_lib(), 1);
    emoji_regex_default = /* @__PURE__ */ __name(() => {
      return /[#*0-9]\uFE0F?\u20E3|[\xA9\xAE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9\u21AA\u231A\u231B\u2328\u23CF\u23ED-\u23EF\u23F1\u23F2\u23F8-\u23FA\u24C2\u25AA\u25AB\u25B6\u25C0\u25FB\u25FC\u25FE\u2600-\u2604\u260E\u2611\u2614\u2615\u2618\u2620\u2622\u2623\u2626\u262A\u262E\u262F\u2638-\u263A\u2640\u2642\u2648-\u2653\u265F\u2660\u2663\u2665\u2666\u2668\u267B\u267E\u267F\u2692\u2694-\u2697\u2699\u269B\u269C\u26A0\u26A7\u26AA\u26B0\u26B1\u26BD\u26BE\u26C4\u26C8\u26CF\u26D1\u26D3\u26E9\u26F0-\u26F5\u26F7\u26F8\u26FA\u2702\u2708\u2709\u270F\u2712\u2714\u2716\u271D\u2721\u2733\u2734\u2744\u2747\u2757\u2763\u27A1\u2934\u2935\u2B05-\u2B07\u2B1B\u2B1C\u2B55\u3030\u303D\u3297\u3299]\uFE0F?|[\u261D\u270C\u270D](?:\uFE0F|\uD83C[\uDFFB-\uDFFF])?|[\u270A\u270B](?:\uD83C[\uDFFB-\uDFFF])?|[\u23E9-\u23EC\u23F0\u23F3\u25FD\u2693\u26A1\u26AB\u26C5\u26CE\u26D4\u26EA\u26FD\u2705\u2728\u274C\u274E\u2753-\u2755\u2795-\u2797\u27B0\u27BF\u2B50]|\u26F9(?:\uFE0F|\uD83C[\uDFFB-\uDFFF])?(?:\u200D[\u2640\u2642]\uFE0F?)?|\u2764\uFE0F?(?:\u200D(?:\uD83D\uDD25|\uD83E\uDE79))?|\uD83C(?:[\uDC04\uDD70\uDD71\uDD7E\uDD7F\uDE02\uDE37\uDF21\uDF24-\uDF2C\uDF36\uDF7D\uDF96\uDF97\uDF99-\uDF9B\uDF9E\uDF9F\uDFCD\uDFCE\uDFD4-\uDFDF\uDFF5\uDFF7]\uFE0F?|[\uDF85\uDFC2\uDFC7](?:\uD83C[\uDFFB-\uDFFF])?|[\uDFC3\uDFC4\uDFCA](?:\uD83C[\uDFFB-\uDFFF])?(?:\u200D[\u2640\u2642]\uFE0F?)?|[\uDFCB\uDFCC](?:\uFE0F|\uD83C[\uDFFB-\uDFFF])?(?:\u200D[\u2640\u2642]\uFE0F?)?|[\uDCCF\uDD8E\uDD91-\uDD9A\uDE01\uDE1A\uDE2F\uDE32-\uDE36\uDE38-\uDE3A\uDE50\uDE51\uDF00-\uDF20\uDF2D-\uDF35\uDF37-\uDF7C\uDF7E-\uDF84\uDF86-\uDF93\uDFA0-\uDFC1\uDFC5\uDFC6\uDFC8\uDFC9\uDFCF-\uDFD3\uDFE0-\uDFF0\uDFF8-\uDFFF]|\uDDE6\uD83C[\uDDE8-\uDDEC\uDDEE\uDDF1\uDDF2\uDDF4\uDDF6-\uDDFA\uDDFC\uDDFD\uDDFF]|\uDDE7\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEF\uDDF1-\uDDF4\uDDF6-\uDDF9\uDDFB\uDDFC\uDDFE\uDDFF]|\uDDE8\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDEE\uDDF0-\uDDF5\uDDF7\uDDFA-\uDDFF]|\uDDE9\uD83C[\uDDEA\uDDEC\uDDEF\uDDF0\uDDF2\uDDF4\uDDFF]|\uDDEA\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDED\uDDF7-\uDDFA]|\uDDEB\uD83C[\uDDEE-\uDDF0\uDDF2\uDDF4\uDDF7]|\uDDEC\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEE\uDDF1-\uDDF3\uDDF5-\uDDFA\uDDFC\uDDFE]|\uDDED\uD83C[\uDDF0\uDDF2\uDDF3\uDDF7\uDDF9\uDDFA]|\uDDEE\uD83C[\uDDE8-\uDDEA\uDDF1-\uDDF4\uDDF6-\uDDF9]|\uDDEF\uD83C[\uDDEA\uDDF2\uDDF4\uDDF5]|\uDDF0\uD83C[\uDDEA\uDDEC-\uDDEE\uDDF2\uDDF3\uDDF5\uDDF7\uDDFC\uDDFE\uDDFF]|\uDDF1\uD83C[\uDDE6-\uDDE8\uDDEE\uDDF0\uDDF7-\uDDFB\uDDFE]|\uDDF2\uD83C[\uDDE6\uDDE8-\uDDED\uDDF0-\uDDFF]|\uDDF3\uD83C[\uDDE6\uDDE8\uDDEA-\uDDEC\uDDEE\uDDF1\uDDF4\uDDF5\uDDF7\uDDFA\uDDFF]|\uDDF4\uD83C\uDDF2|\uDDF5\uD83C[\uDDE6\uDDEA-\uDDED\uDDF0-\uDDF3\uDDF7-\uDDF9\uDDFC\uDDFE]|\uDDF6\uD83C\uDDE6|\uDDF7\uD83C[\uDDEA\uDDF4\uDDF8\uDDFA\uDDFC]|\uDDF8\uD83C[\uDDE6-\uDDEA\uDDEC-\uDDF4\uDDF7-\uDDF9\uDDFB\uDDFD-\uDDFF]|\uDDF9\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDED\uDDEF-\uDDF4\uDDF7\uDDF9\uDDFB\uDDFC\uDDFF]|\uDDFA\uD83C[\uDDE6\uDDEC\uDDF2\uDDF3\uDDF8\uDDFE\uDDFF]|\uDDFB\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDEE\uDDF3\uDDFA]|\uDDFC\uD83C[\uDDEB\uDDF8]|\uDDFD\uD83C\uDDF0|\uDDFE\uD83C[\uDDEA\uDDF9]|\uDDFF\uD83C[\uDDE6\uDDF2\uDDFC]|\uDFF3\uFE0F?(?:\u200D(?:\u26A7\uFE0F?|\uD83C\uDF08))?|\uDFF4(?:\u200D\u2620\uFE0F?|\uDB40\uDC67\uDB40\uDC62\uDB40(?:\uDC65\uDB40\uDC6E\uDB40\uDC67|\uDC73\uDB40\uDC63\uDB40\uDC74|\uDC77\uDB40\uDC6C\uDB40\uDC73)\uDB40\uDC7F)?)|\uD83D(?:[\uDC08\uDC26](?:\u200D\u2B1B)?|[\uDC3F\uDCFD\uDD49\uDD4A\uDD6F\uDD70\uDD73\uDD76-\uDD79\uDD87\uDD8A-\uDD8D\uDDA5\uDDA8\uDDB1\uDDB2\uDDBC\uDDC2-\uDDC4\uDDD1-\uDDD3\uDDDC-\uDDDE\uDDE1\uDDE3\uDDE8\uDDEF\uDDF3\uDDFA\uDECB\uDECD-\uDECF\uDEE0-\uDEE5\uDEE9\uDEF0\uDEF3]\uFE0F?|[\uDC42\uDC43\uDC46-\uDC50\uDC66\uDC67\uDC6B-\uDC6D\uDC72\uDC74-\uDC76\uDC78\uDC7C\uDC83\uDC85\uDC8F\uDC91\uDCAA\uDD7A\uDD95\uDD96\uDE4C\uDE4F\uDEC0\uDECC](?:\uD83C[\uDFFB-\uDFFF])?|[\uDC6E\uDC70\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6](?:\uD83C[\uDFFB-\uDFFF])?(?:\u200D[\u2640\u2642]\uFE0F?)?|[\uDD74\uDD90](?:\uFE0F|\uD83C[\uDFFB-\uDFFF])?|[\uDC00-\uDC07\uDC09-\uDC14\uDC16-\uDC25\uDC27-\uDC3A\uDC3C-\uDC3E\uDC40\uDC44\uDC45\uDC51-\uDC65\uDC6A\uDC79-\uDC7B\uDC7D-\uDC80\uDC84\uDC88-\uDC8E\uDC90\uDC92-\uDCA9\uDCAB-\uDCFC\uDCFF-\uDD3D\uDD4B-\uDD4E\uDD50-\uDD67\uDDA4\uDDFB-\uDE2D\uDE2F-\uDE34\uDE37-\uDE44\uDE48-\uDE4A\uDE80-\uDEA2\uDEA4-\uDEB3\uDEB7-\uDEBF\uDEC1-\uDEC5\uDED0-\uDED2\uDED5-\uDED7\uDEDC-\uDEDF\uDEEB\uDEEC\uDEF4-\uDEFC\uDFE0-\uDFEB\uDFF0]|\uDC15(?:\u200D\uD83E\uDDBA)?|\uDC3B(?:\u200D\u2744\uFE0F?)?|\uDC41\uFE0F?(?:\u200D\uD83D\uDDE8\uFE0F?)?|\uDC68(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:\uDC8B\u200D\uD83D)?\uDC68|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D(?:[\uDC68\uDC69]\u200D\uD83D(?:\uDC66(?:\u200D\uD83D\uDC66)?|\uDC67(?:\u200D\uD83D[\uDC66\uDC67])?)|[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uDC66(?:\u200D\uD83D\uDC66)?|\uDC67(?:\u200D\uD83D[\uDC66\uDC67])?)|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C(?:\uDFFB(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:\uDC8B\u200D\uD83D)?\uDC68\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF-\uDDB3\uDDBC\uDDBD]|\uDD1D\u200D\uD83D\uDC68\uD83C[\uDFFC-\uDFFF])))?|\uDFFC(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:\uDC8B\u200D\uD83D)?\uDC68\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF-\uDDB3\uDDBC\uDDBD]|\uDD1D\u200D\uD83D\uDC68\uD83C[\uDFFB\uDFFD-\uDFFF])))?|\uDFFD(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:\uDC8B\u200D\uD83D)?\uDC68\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF-\uDDB3\uDDBC\uDDBD]|\uDD1D\u200D\uD83D\uDC68\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF])))?|\uDFFE(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:\uDC8B\u200D\uD83D)?\uDC68\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF-\uDDB3\uDDBC\uDDBD]|\uDD1D\u200D\uD83D\uDC68\uD83C[\uDFFB-\uDFFD\uDFFF])))?|\uDFFF(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:\uDC8B\u200D\uD83D)?\uDC68\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF-\uDDB3\uDDBC\uDDBD]|\uDD1D\u200D\uD83D\uDC68\uD83C[\uDFFB-\uDFFE])))?))?|\uDC69(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:\uDC8B\u200D\uD83D)?[\uDC68\uDC69]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D(?:[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uDC66(?:\u200D\uD83D\uDC66)?|\uDC67(?:\u200D\uD83D[\uDC66\uDC67])?|\uDC69\u200D\uD83D(?:\uDC66(?:\u200D\uD83D\uDC66)?|\uDC67(?:\u200D\uD83D[\uDC66\uDC67])?))|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C(?:\uDFFB(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:[\uDC68\uDC69]|\uDC8B\u200D\uD83D[\uDC68\uDC69])\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF-\uDDB3\uDDBC\uDDBD]|\uDD1D\u200D\uD83D[\uDC68\uDC69]\uD83C[\uDFFC-\uDFFF])))?|\uDFFC(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:[\uDC68\uDC69]|\uDC8B\u200D\uD83D[\uDC68\uDC69])\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF-\uDDB3\uDDBC\uDDBD]|\uDD1D\u200D\uD83D[\uDC68\uDC69]\uD83C[\uDFFB\uDFFD-\uDFFF])))?|\uDFFD(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:[\uDC68\uDC69]|\uDC8B\u200D\uD83D[\uDC68\uDC69])\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF-\uDDB3\uDDBC\uDDBD]|\uDD1D\u200D\uD83D[\uDC68\uDC69]\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF])))?|\uDFFE(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:[\uDC68\uDC69]|\uDC8B\u200D\uD83D[\uDC68\uDC69])\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF-\uDDB3\uDDBC\uDDBD]|\uDD1D\u200D\uD83D[\uDC68\uDC69]\uD83C[\uDFFB-\uDFFD\uDFFF])))?|\uDFFF(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:[\uDC68\uDC69]|\uDC8B\u200D\uD83D[\uDC68\uDC69])\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF-\uDDB3\uDDBC\uDDBD]|\uDD1D\u200D\uD83D[\uDC68\uDC69]\uD83C[\uDFFB-\uDFFE])))?))?|\uDC6F(?:\u200D[\u2640\u2642]\uFE0F?)?|\uDD75(?:\uFE0F|\uD83C[\uDFFB-\uDFFF])?(?:\u200D[\u2640\u2642]\uFE0F?)?|\uDE2E(?:\u200D\uD83D\uDCA8)?|\uDE35(?:\u200D\uD83D\uDCAB)?|\uDE36(?:\u200D\uD83C\uDF2B\uFE0F?)?)|\uD83E(?:[\uDD0C\uDD0F\uDD18-\uDD1F\uDD30-\uDD34\uDD36\uDD77\uDDB5\uDDB6\uDDBB\uDDD2\uDDD3\uDDD5\uDEC3-\uDEC5\uDEF0\uDEF2-\uDEF8](?:\uD83C[\uDFFB-\uDFFF])?|[\uDD26\uDD35\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDCD-\uDDCF\uDDD4\uDDD6-\uDDDD](?:\uD83C[\uDFFB-\uDFFF])?(?:\u200D[\u2640\u2642]\uFE0F?)?|[\uDDDE\uDDDF](?:\u200D[\u2640\u2642]\uFE0F?)?|[\uDD0D\uDD0E\uDD10-\uDD17\uDD20-\uDD25\uDD27-\uDD2F\uDD3A\uDD3F-\uDD45\uDD47-\uDD76\uDD78-\uDDB4\uDDB7\uDDBA\uDDBC-\uDDCC\uDDD0\uDDE0-\uDDFF\uDE70-\uDE7C\uDE80-\uDE88\uDE90-\uDEBD\uDEBF-\uDEC2\uDECE-\uDEDB\uDEE0-\uDEE8]|\uDD3C(?:\u200D[\u2640\u2642]\uFE0F?|\uD83C[\uDFFB-\uDFFF])?|\uDDD1(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF-\uDDB3\uDDBC\uDDBD]|\uDD1D\u200D\uD83E\uDDD1))|\uD83C(?:\uDFFB(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1\uD83C[\uDFFC-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF-\uDDB3\uDDBC\uDDBD]|\uDD1D\u200D\uD83E\uDDD1\uD83C[\uDFFB-\uDFFF])))?|\uDFFC(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1\uD83C[\uDFFB\uDFFD-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF-\uDDB3\uDDBC\uDDBD]|\uDD1D\u200D\uD83E\uDDD1\uD83C[\uDFFB-\uDFFF])))?|\uDFFD(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF-\uDDB3\uDDBC\uDDBD]|\uDD1D\u200D\uD83E\uDDD1\uD83C[\uDFFB-\uDFFF])))?|\uDFFE(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1\uD83C[\uDFFB-\uDFFD\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF-\uDDB3\uDDBC\uDDBD]|\uDD1D\u200D\uD83E\uDDD1\uD83C[\uDFFB-\uDFFF])))?|\uDFFF(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1\uD83C[\uDFFB-\uDFFE]|\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF-\uDDB3\uDDBC\uDDBD]|\uDD1D\u200D\uD83E\uDDD1\uD83C[\uDFFB-\uDFFF])))?))?|\uDEF1(?:\uD83C(?:\uDFFB(?:\u200D\uD83E\uDEF2\uD83C[\uDFFC-\uDFFF])?|\uDFFC(?:\u200D\uD83E\uDEF2\uD83C[\uDFFB\uDFFD-\uDFFF])?|\uDFFD(?:\u200D\uD83E\uDEF2\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF])?|\uDFFE(?:\u200D\uD83E\uDEF2\uD83C[\uDFFB-\uDFFD\uDFFF])?|\uDFFF(?:\u200D\uD83E\uDEF2\uD83C[\uDFFB-\uDFFE])?))?)/g;
    }, "emoji_regex_default");
    u8 = Uint8Array;
    u16 = Uint16Array;
    u32 = Uint32Array;
    fleb = new u8([
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      1,
      1,
      1,
      1,
      2,
      2,
      2,
      2,
      3,
      3,
      3,
      3,
      4,
      4,
      4,
      4,
      5,
      5,
      5,
      5,
      0,
      /* unused */
      0,
      0,
      /* impossible */
      0
    ]);
    fdeb = new u8([
      0,
      0,
      0,
      0,
      1,
      1,
      2,
      2,
      3,
      3,
      4,
      4,
      5,
      5,
      6,
      6,
      7,
      7,
      8,
      8,
      9,
      9,
      10,
      10,
      11,
      11,
      12,
      12,
      13,
      13,
      /* unused */
      0,
      0
    ]);
    clim = new u8([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]);
    freb = /* @__PURE__ */ __name(function(eb, start) {
      var b = new u16(31);
      for (var i2 = 0; i2 < 31; ++i2) {
        b[i2] = start += 1 << eb[i2 - 1];
      }
      var r = new u32(b[30]);
      for (var i2 = 1; i2 < 30; ++i2) {
        for (var j2 = b[i2]; j2 < b[i2 + 1]; ++j2) {
          r[j2] = j2 - b[i2] << 5 | i2;
        }
      }
      return [b, r];
    }, "freb");
    _a = freb(fleb, 2);
    fl = _a[0];
    revfl = _a[1];
    fl[28] = 258, revfl[258] = 28;
    _b = freb(fdeb, 0);
    fd = _b[0];
    rev = new u16(32768);
    for (i = 0; i < 32768; ++i) {
      x = (i & 43690) >>> 1 | (i & 21845) << 1;
      x = (x & 52428) >>> 2 | (x & 13107) << 2;
      x = (x & 61680) >>> 4 | (x & 3855) << 4;
      rev[i] = ((x & 65280) >>> 8 | (x & 255) << 8) >>> 1;
    }
    hMap = /* @__PURE__ */ __name(function(cd, mb, r) {
      var s = cd.length;
      var i2 = 0;
      var l = new u16(mb);
      for (; i2 < s; ++i2) {
        if (cd[i2]) {
          ++l[cd[i2] - 1];
        }
      }
      var le2 = new u16(mb);
      for (i2 = 0; i2 < mb; ++i2) {
        le2[i2] = le2[i2 - 1] + l[i2 - 1] << 1;
      }
      var co2;
      if (r) {
        co2 = new u16(1 << mb);
        var rvb = 15 - mb;
        for (i2 = 0; i2 < s; ++i2) {
          if (cd[i2]) {
            var sv = i2 << 4 | cd[i2];
            var r_1 = mb - cd[i2];
            var v = le2[cd[i2] - 1]++ << r_1;
            for (var m2 = v | (1 << r_1) - 1; v <= m2; ++v) {
              co2[rev[v] >>> rvb] = sv;
            }
          }
        }
      } else {
        co2 = new u16(s);
        for (i2 = 0; i2 < s; ++i2) {
          if (cd[i2]) {
            co2[i2] = rev[le2[cd[i2] - 1]++] >>> 15 - cd[i2];
          }
        }
      }
      return co2;
    }, "hMap");
    flt = new u8(288);
    for (i = 0; i < 144; ++i) {
      flt[i] = 8;
    }
    for (i = 144; i < 256; ++i) {
      flt[i] = 9;
    }
    for (i = 256; i < 280; ++i) {
      flt[i] = 7;
    }
    for (i = 280; i < 288; ++i) {
      flt[i] = 8;
    }
    fdt = new u8(32);
    for (i = 0; i < 32; ++i) {
      fdt[i] = 5;
    }
    flrm = /* @__PURE__ */ hMap(flt, 9, 1);
    fdrm = /* @__PURE__ */ hMap(fdt, 5, 1);
    max = /* @__PURE__ */ __name(function(a) {
      var m2 = a[0];
      for (var i2 = 1; i2 < a.length; ++i2) {
        if (a[i2] > m2) {
          m2 = a[i2];
        }
      }
      return m2;
    }, "max");
    bits = /* @__PURE__ */ __name(function(d, p, m2) {
      var o = p / 8 | 0;
      return (d[o] | d[o + 1] << 8) >> (p & 7) & m2;
    }, "bits");
    bits16 = /* @__PURE__ */ __name(function(d, p) {
      var o = p / 8 | 0;
      return (d[o] | d[o + 1] << 8 | d[o + 2] << 16) >> (p & 7);
    }, "bits16");
    shft = /* @__PURE__ */ __name(function(p) {
      return (p + 7) / 8 | 0;
    }, "shft");
    slc = /* @__PURE__ */ __name(function(v, s, e) {
      if (s == null || s < 0) {
        s = 0;
      }
      if (e == null || e > v.length) {
        e = v.length;
      }
      var n = new (v.BYTES_PER_ELEMENT == 2 ? u16 : v.BYTES_PER_ELEMENT == 4 ? u32 : u8)(e - s);
      n.set(v.subarray(s, e));
      return n;
    }, "slc");
    ec = [
      "unexpected EOF",
      "invalid block type",
      "invalid length/literal",
      "invalid distance",
      "stream finished",
      "no stream handler",
      ,
      "no callback",
      "invalid UTF-8 data",
      "extra field too long",
      "date not in range 1980-2099",
      "filename too long",
      "stream finishing",
      "invalid zip data"
      // determined by unknown compression method
    ];
    err = /* @__PURE__ */ __name(function(ind, msg, nt) {
      var e = new Error(msg || ec[ind]);
      e.code = ind;
      if (Error.captureStackTrace) {
        Error.captureStackTrace(e, err);
      }
      if (!nt) {
        throw e;
      }
      return e;
    }, "err");
    inflt = /* @__PURE__ */ __name(function(dat, buf, st2) {
      var sl2 = dat.length;
      if (!sl2 || st2 && st2.f && !st2.l) {
        return buf || new u8(0);
      }
      var noBuf = !buf || st2;
      var noSt = !st2 || st2.i;
      if (!st2) {
        st2 = {};
      }
      if (!buf) {
        buf = new u8(sl2 * 3);
      }
      var cbuf = /* @__PURE__ */ __name(function(l2) {
        var bl2 = buf.length;
        if (l2 > bl2) {
          var nbuf = new u8(Math.max(bl2 * 2, l2));
          nbuf.set(buf);
          buf = nbuf;
        }
      }, "cbuf");
      var final = st2.f || 0, pos = st2.p || 0, bt2 = st2.b || 0, lm = st2.l, dm = st2.d, lbt = st2.m, dbt = st2.n;
      var tbts = sl2 * 8;
      do {
        if (!lm) {
          final = bits(dat, pos, 1);
          var type = bits(dat, pos + 1, 3);
          pos += 3;
          if (!type) {
            var s = shft(pos) + 4, l = dat[s - 4] | dat[s - 3] << 8, t = s + l;
            if (t > sl2) {
              if (noSt) {
                err(0);
              }
              break;
            }
            if (noBuf) {
              cbuf(bt2 + l);
            }
            buf.set(dat.subarray(s, t), bt2);
            st2.b = bt2 += l, st2.p = pos = t * 8, st2.f = final;
            continue;
          } else if (type == 1) {
            lm = flrm, dm = fdrm, lbt = 9, dbt = 5;
          } else if (type == 2) {
            var hLit = bits(dat, pos, 31) + 257, hcLen = bits(dat, pos + 10, 15) + 4;
            var tl2 = hLit + bits(dat, pos + 5, 31) + 1;
            pos += 14;
            var ldt = new u8(tl2);
            var clt = new u8(19);
            for (var i2 = 0; i2 < hcLen; ++i2) {
              clt[clim[i2]] = bits(dat, pos + i2 * 3, 7);
            }
            pos += hcLen * 3;
            var clb = max(clt), clbmsk = (1 << clb) - 1;
            var clm = hMap(clt, clb, 1);
            for (var i2 = 0; i2 < tl2; ) {
              var r = clm[bits(dat, pos, clbmsk)];
              pos += r & 15;
              var s = r >>> 4;
              if (s < 16) {
                ldt[i2++] = s;
              } else {
                var c2 = 0, n = 0;
                if (s == 16) {
                  n = 3 + bits(dat, pos, 3), pos += 2, c2 = ldt[i2 - 1];
                } else if (s == 17) {
                  n = 3 + bits(dat, pos, 7), pos += 3;
                } else if (s == 18) {
                  n = 11 + bits(dat, pos, 127), pos += 7;
                }
                while (n--) {
                  ldt[i2++] = c2;
                }
              }
            }
            var lt = ldt.subarray(0, hLit), dt2 = ldt.subarray(hLit);
            lbt = max(lt);
            dbt = max(dt2);
            lm = hMap(lt, lbt, 1);
            dm = hMap(dt2, dbt, 1);
          } else {
            err(1);
          }
          if (pos > tbts) {
            if (noSt) {
              err(0);
            }
            break;
          }
        }
        if (noBuf) {
          cbuf(bt2 + 131072);
        }
        var lms = (1 << lbt) - 1, dms = (1 << dbt) - 1;
        var lpos = pos;
        for (; ; lpos = pos) {
          var c2 = lm[bits16(dat, pos) & lms], sym = c2 >>> 4;
          pos += c2 & 15;
          if (pos > tbts) {
            if (noSt) {
              err(0);
            }
            break;
          }
          if (!c2) {
            err(2);
          }
          if (sym < 256) {
            buf[bt2++] = sym;
          } else if (sym == 256) {
            lpos = pos, lm = null;
            break;
          } else {
            var add = sym - 254;
            if (sym > 264) {
              var i2 = sym - 257, b = fleb[i2];
              add = bits(dat, pos, (1 << b) - 1) + fl[i2];
              pos += b;
            }
            var d = dm[bits16(dat, pos) & dms], dsym = d >>> 4;
            if (!d) {
              err(3);
            }
            pos += d & 15;
            var dt2 = fd[dsym];
            if (dsym > 3) {
              var b = fdeb[dsym];
              dt2 += bits16(dat, pos) & (1 << b) - 1, pos += b;
            }
            if (pos > tbts) {
              if (noSt) {
                err(0);
              }
              break;
            }
            if (noBuf) {
              cbuf(bt2 + 131072);
            }
            var end = bt2 + add;
            for (; bt2 < end; bt2 += 4) {
              buf[bt2] = buf[bt2 - dt2];
              buf[bt2 + 1] = buf[bt2 + 1 - dt2];
              buf[bt2 + 2] = buf[bt2 + 2 - dt2];
              buf[bt2 + 3] = buf[bt2 + 3 - dt2];
            }
            bt2 = end;
          }
        }
        st2.l = lm, st2.p = lpos, st2.b = bt2, st2.f = final;
        if (lm) {
          final = 1, st2.m = lbt, st2.d = dm, st2.n = dbt;
        }
      } while (!final);
      return bt2 == buf.length ? buf : slc(buf, 0, bt2);
    }, "inflt");
    et = /* @__PURE__ */ new u8(0);
    __name(inflateSync, "inflateSync");
    td = typeof TextDecoder != "undefined" && /* @__PURE__ */ new TextDecoder();
    tds = 0;
    try {
      td.decode(et, { stream: true });
      tds = 1;
    } catch (e) {
    }
    __name(Path, "Path");
    Path.prototype.moveTo = function(x2, y) {
      this.commands.push({
        type: "M",
        x: x2,
        y
      });
    };
    Path.prototype.lineTo = function(x2, y) {
      this.commands.push({
        type: "L",
        x: x2,
        y
      });
    };
    Path.prototype.curveTo = Path.prototype.bezierCurveTo = function(x1, y1, x2, y2, x3, y) {
      this.commands.push({
        type: "C",
        x1,
        y1,
        x2,
        y2,
        x: x3,
        y
      });
    };
    Path.prototype.quadTo = Path.prototype.quadraticCurveTo = function(x1, y1, x2, y) {
      this.commands.push({
        type: "Q",
        x1,
        y1,
        x: x2,
        y
      });
    };
    Path.prototype.close = Path.prototype.closePath = function() {
      this.commands.push({
        type: "Z"
      });
    };
    Path.prototype.extend = function(pathOrCommands) {
      if (pathOrCommands.commands) {
        pathOrCommands = pathOrCommands.commands;
      }
      Array.prototype.push.apply(this.commands, pathOrCommands);
    };
    Path.prototype.toPathData = function(decimalPlaces) {
      decimalPlaces = decimalPlaces !== void 0 ? decimalPlaces : 2;
      function floatToString(v) {
        if (Math.round(v) === v) {
          return "" + Math.round(v);
        } else {
          return v.toFixed(decimalPlaces);
        }
      }
      __name(floatToString, "floatToString");
      function packValues() {
        var arguments$1 = arguments;
        var s = "";
        for (var i22 = 0; i22 < arguments.length; i22 += 1) {
          var v = arguments$1[i22];
          if (v >= 0 && i22 > 0) {
            s += " ";
          }
          s += floatToString(v);
        }
        return s;
      }
      __name(packValues, "packValues");
      var d = "";
      for (var i2 = 0; i2 < this.commands.length; i2 += 1) {
        var cmd = this.commands[i2];
        if (cmd.type === "M") {
          d += "M" + packValues(cmd.x, cmd.y);
        } else if (cmd.type === "L") {
          d += "L" + packValues(cmd.x, cmd.y);
        } else if (cmd.type === "C") {
          d += "C" + packValues(cmd.x1, cmd.y1, cmd.x2, cmd.y2, cmd.x, cmd.y);
        } else if (cmd.type === "Q") {
          d += "Q" + packValues(cmd.x1, cmd.y1, cmd.x, cmd.y);
        } else if (cmd.type === "Z") {
          d += "Z";
        }
      }
      return d;
    };
    cffStandardStrings = [
      ".notdef",
      "space",
      "exclam",
      "quotedbl",
      "numbersign",
      "dollar",
      "percent",
      "ampersand",
      "quoteright",
      "parenleft",
      "parenright",
      "asterisk",
      "plus",
      "comma",
      "hyphen",
      "period",
      "slash",
      "zero",
      "one",
      "two",
      "three",
      "four",
      "five",
      "six",
      "seven",
      "eight",
      "nine",
      "colon",
      "semicolon",
      "less",
      "equal",
      "greater",
      "question",
      "at",
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
      "G",
      "H",
      "I",
      "J",
      "K",
      "L",
      "M",
      "N",
      "O",
      "P",
      "Q",
      "R",
      "S",
      "T",
      "U",
      "V",
      "W",
      "X",
      "Y",
      "Z",
      "bracketleft",
      "backslash",
      "bracketright",
      "asciicircum",
      "underscore",
      "quoteleft",
      "a",
      "b",
      "c",
      "d",
      "e",
      "f",
      "g",
      "h",
      "i",
      "j",
      "k",
      "l",
      "m",
      "n",
      "o",
      "p",
      "q",
      "r",
      "s",
      "t",
      "u",
      "v",
      "w",
      "x",
      "y",
      "z",
      "braceleft",
      "bar",
      "braceright",
      "asciitilde",
      "exclamdown",
      "cent",
      "sterling",
      "fraction",
      "yen",
      "florin",
      "section",
      "currency",
      "quotesingle",
      "quotedblleft",
      "guillemotleft",
      "guilsinglleft",
      "guilsinglright",
      "fi",
      "fl",
      "endash",
      "dagger",
      "daggerdbl",
      "periodcentered",
      "paragraph",
      "bullet",
      "quotesinglbase",
      "quotedblbase",
      "quotedblright",
      "guillemotright",
      "ellipsis",
      "perthousand",
      "questiondown",
      "grave",
      "acute",
      "circumflex",
      "tilde",
      "macron",
      "breve",
      "dotaccent",
      "dieresis",
      "ring",
      "cedilla",
      "hungarumlaut",
      "ogonek",
      "caron",
      "emdash",
      "AE",
      "ordfeminine",
      "Lslash",
      "Oslash",
      "OE",
      "ordmasculine",
      "ae",
      "dotlessi",
      "lslash",
      "oslash",
      "oe",
      "germandbls",
      "onesuperior",
      "logicalnot",
      "mu",
      "trademark",
      "Eth",
      "onehalf",
      "plusminus",
      "Thorn",
      "onequarter",
      "divide",
      "brokenbar",
      "degree",
      "thorn",
      "threequarters",
      "twosuperior",
      "registered",
      "minus",
      "eth",
      "multiply",
      "threesuperior",
      "copyright",
      "Aacute",
      "Acircumflex",
      "Adieresis",
      "Agrave",
      "Aring",
      "Atilde",
      "Ccedilla",
      "Eacute",
      "Ecircumflex",
      "Edieresis",
      "Egrave",
      "Iacute",
      "Icircumflex",
      "Idieresis",
      "Igrave",
      "Ntilde",
      "Oacute",
      "Ocircumflex",
      "Odieresis",
      "Ograve",
      "Otilde",
      "Scaron",
      "Uacute",
      "Ucircumflex",
      "Udieresis",
      "Ugrave",
      "Yacute",
      "Ydieresis",
      "Zcaron",
      "aacute",
      "acircumflex",
      "adieresis",
      "agrave",
      "aring",
      "atilde",
      "ccedilla",
      "eacute",
      "ecircumflex",
      "edieresis",
      "egrave",
      "iacute",
      "icircumflex",
      "idieresis",
      "igrave",
      "ntilde",
      "oacute",
      "ocircumflex",
      "odieresis",
      "ograve",
      "otilde",
      "scaron",
      "uacute",
      "ucircumflex",
      "udieresis",
      "ugrave",
      "yacute",
      "ydieresis",
      "zcaron",
      "exclamsmall",
      "Hungarumlautsmall",
      "dollaroldstyle",
      "dollarsuperior",
      "ampersandsmall",
      "Acutesmall",
      "parenleftsuperior",
      "parenrightsuperior",
      "266 ff",
      "onedotenleader",
      "zerooldstyle",
      "oneoldstyle",
      "twooldstyle",
      "threeoldstyle",
      "fouroldstyle",
      "fiveoldstyle",
      "sixoldstyle",
      "sevenoldstyle",
      "eightoldstyle",
      "nineoldstyle",
      "commasuperior",
      "threequartersemdash",
      "periodsuperior",
      "questionsmall",
      "asuperior",
      "bsuperior",
      "centsuperior",
      "dsuperior",
      "esuperior",
      "isuperior",
      "lsuperior",
      "msuperior",
      "nsuperior",
      "osuperior",
      "rsuperior",
      "ssuperior",
      "tsuperior",
      "ff",
      "ffi",
      "ffl",
      "parenleftinferior",
      "parenrightinferior",
      "Circumflexsmall",
      "hyphensuperior",
      "Gravesmall",
      "Asmall",
      "Bsmall",
      "Csmall",
      "Dsmall",
      "Esmall",
      "Fsmall",
      "Gsmall",
      "Hsmall",
      "Ismall",
      "Jsmall",
      "Ksmall",
      "Lsmall",
      "Msmall",
      "Nsmall",
      "Osmall",
      "Psmall",
      "Qsmall",
      "Rsmall",
      "Ssmall",
      "Tsmall",
      "Usmall",
      "Vsmall",
      "Wsmall",
      "Xsmall",
      "Ysmall",
      "Zsmall",
      "colonmonetary",
      "onefitted",
      "rupiah",
      "Tildesmall",
      "exclamdownsmall",
      "centoldstyle",
      "Lslashsmall",
      "Scaronsmall",
      "Zcaronsmall",
      "Dieresissmall",
      "Brevesmall",
      "Caronsmall",
      "Dotaccentsmall",
      "Macronsmall",
      "figuredash",
      "hypheninferior",
      "Ogoneksmall",
      "Ringsmall",
      "Cedillasmall",
      "questiondownsmall",
      "oneeighth",
      "threeeighths",
      "fiveeighths",
      "seveneighths",
      "onethird",
      "twothirds",
      "zerosuperior",
      "foursuperior",
      "fivesuperior",
      "sixsuperior",
      "sevensuperior",
      "eightsuperior",
      "ninesuperior",
      "zeroinferior",
      "oneinferior",
      "twoinferior",
      "threeinferior",
      "fourinferior",
      "fiveinferior",
      "sixinferior",
      "seveninferior",
      "eightinferior",
      "nineinferior",
      "centinferior",
      "dollarinferior",
      "periodinferior",
      "commainferior",
      "Agravesmall",
      "Aacutesmall",
      "Acircumflexsmall",
      "Atildesmall",
      "Adieresissmall",
      "Aringsmall",
      "AEsmall",
      "Ccedillasmall",
      "Egravesmall",
      "Eacutesmall",
      "Ecircumflexsmall",
      "Edieresissmall",
      "Igravesmall",
      "Iacutesmall",
      "Icircumflexsmall",
      "Idieresissmall",
      "Ethsmall",
      "Ntildesmall",
      "Ogravesmall",
      "Oacutesmall",
      "Ocircumflexsmall",
      "Otildesmall",
      "Odieresissmall",
      "OEsmall",
      "Oslashsmall",
      "Ugravesmall",
      "Uacutesmall",
      "Ucircumflexsmall",
      "Udieresissmall",
      "Yacutesmall",
      "Thornsmall",
      "Ydieresissmall",
      "001.000",
      "001.001",
      "001.002",
      "001.003",
      "Black",
      "Bold",
      "Book",
      "Light",
      "Medium",
      "Regular",
      "Roman",
      "Semibold"
    ];
    cffStandardEncoding = [
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "space",
      "exclam",
      "quotedbl",
      "numbersign",
      "dollar",
      "percent",
      "ampersand",
      "quoteright",
      "parenleft",
      "parenright",
      "asterisk",
      "plus",
      "comma",
      "hyphen",
      "period",
      "slash",
      "zero",
      "one",
      "two",
      "three",
      "four",
      "five",
      "six",
      "seven",
      "eight",
      "nine",
      "colon",
      "semicolon",
      "less",
      "equal",
      "greater",
      "question",
      "at",
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
      "G",
      "H",
      "I",
      "J",
      "K",
      "L",
      "M",
      "N",
      "O",
      "P",
      "Q",
      "R",
      "S",
      "T",
      "U",
      "V",
      "W",
      "X",
      "Y",
      "Z",
      "bracketleft",
      "backslash",
      "bracketright",
      "asciicircum",
      "underscore",
      "quoteleft",
      "a",
      "b",
      "c",
      "d",
      "e",
      "f",
      "g",
      "h",
      "i",
      "j",
      "k",
      "l",
      "m",
      "n",
      "o",
      "p",
      "q",
      "r",
      "s",
      "t",
      "u",
      "v",
      "w",
      "x",
      "y",
      "z",
      "braceleft",
      "bar",
      "braceright",
      "asciitilde",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "exclamdown",
      "cent",
      "sterling",
      "fraction",
      "yen",
      "florin",
      "section",
      "currency",
      "quotesingle",
      "quotedblleft",
      "guillemotleft",
      "guilsinglleft",
      "guilsinglright",
      "fi",
      "fl",
      "",
      "endash",
      "dagger",
      "daggerdbl",
      "periodcentered",
      "",
      "paragraph",
      "bullet",
      "quotesinglbase",
      "quotedblbase",
      "quotedblright",
      "guillemotright",
      "ellipsis",
      "perthousand",
      "",
      "questiondown",
      "",
      "grave",
      "acute",
      "circumflex",
      "tilde",
      "macron",
      "breve",
      "dotaccent",
      "dieresis",
      "",
      "ring",
      "cedilla",
      "",
      "hungarumlaut",
      "ogonek",
      "caron",
      "emdash",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "AE",
      "",
      "ordfeminine",
      "",
      "",
      "",
      "",
      "Lslash",
      "Oslash",
      "OE",
      "ordmasculine",
      "",
      "",
      "",
      "",
      "",
      "ae",
      "",
      "",
      "",
      "dotlessi",
      "",
      "",
      "lslash",
      "oslash",
      "oe",
      "germandbls"
    ];
    cffExpertEncoding = [
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "space",
      "exclamsmall",
      "Hungarumlautsmall",
      "",
      "dollaroldstyle",
      "dollarsuperior",
      "ampersandsmall",
      "Acutesmall",
      "parenleftsuperior",
      "parenrightsuperior",
      "twodotenleader",
      "onedotenleader",
      "comma",
      "hyphen",
      "period",
      "fraction",
      "zerooldstyle",
      "oneoldstyle",
      "twooldstyle",
      "threeoldstyle",
      "fouroldstyle",
      "fiveoldstyle",
      "sixoldstyle",
      "sevenoldstyle",
      "eightoldstyle",
      "nineoldstyle",
      "colon",
      "semicolon",
      "commasuperior",
      "threequartersemdash",
      "periodsuperior",
      "questionsmall",
      "",
      "asuperior",
      "bsuperior",
      "centsuperior",
      "dsuperior",
      "esuperior",
      "",
      "",
      "isuperior",
      "",
      "",
      "lsuperior",
      "msuperior",
      "nsuperior",
      "osuperior",
      "",
      "",
      "rsuperior",
      "ssuperior",
      "tsuperior",
      "",
      "ff",
      "fi",
      "fl",
      "ffi",
      "ffl",
      "parenleftinferior",
      "",
      "parenrightinferior",
      "Circumflexsmall",
      "hyphensuperior",
      "Gravesmall",
      "Asmall",
      "Bsmall",
      "Csmall",
      "Dsmall",
      "Esmall",
      "Fsmall",
      "Gsmall",
      "Hsmall",
      "Ismall",
      "Jsmall",
      "Ksmall",
      "Lsmall",
      "Msmall",
      "Nsmall",
      "Osmall",
      "Psmall",
      "Qsmall",
      "Rsmall",
      "Ssmall",
      "Tsmall",
      "Usmall",
      "Vsmall",
      "Wsmall",
      "Xsmall",
      "Ysmall",
      "Zsmall",
      "colonmonetary",
      "onefitted",
      "rupiah",
      "Tildesmall",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "exclamdownsmall",
      "centoldstyle",
      "Lslashsmall",
      "",
      "",
      "Scaronsmall",
      "Zcaronsmall",
      "Dieresissmall",
      "Brevesmall",
      "Caronsmall",
      "",
      "Dotaccentsmall",
      "",
      "",
      "Macronsmall",
      "",
      "",
      "figuredash",
      "hypheninferior",
      "",
      "",
      "Ogoneksmall",
      "Ringsmall",
      "Cedillasmall",
      "",
      "",
      "",
      "onequarter",
      "onehalf",
      "threequarters",
      "questiondownsmall",
      "oneeighth",
      "threeeighths",
      "fiveeighths",
      "seveneighths",
      "onethird",
      "twothirds",
      "",
      "",
      "zerosuperior",
      "onesuperior",
      "twosuperior",
      "threesuperior",
      "foursuperior",
      "fivesuperior",
      "sixsuperior",
      "sevensuperior",
      "eightsuperior",
      "ninesuperior",
      "zeroinferior",
      "oneinferior",
      "twoinferior",
      "threeinferior",
      "fourinferior",
      "fiveinferior",
      "sixinferior",
      "seveninferior",
      "eightinferior",
      "nineinferior",
      "centinferior",
      "dollarinferior",
      "periodinferior",
      "commainferior",
      "Agravesmall",
      "Aacutesmall",
      "Acircumflexsmall",
      "Atildesmall",
      "Adieresissmall",
      "Aringsmall",
      "AEsmall",
      "Ccedillasmall",
      "Egravesmall",
      "Eacutesmall",
      "Ecircumflexsmall",
      "Edieresissmall",
      "Igravesmall",
      "Iacutesmall",
      "Icircumflexsmall",
      "Idieresissmall",
      "Ethsmall",
      "Ntildesmall",
      "Ogravesmall",
      "Oacutesmall",
      "Ocircumflexsmall",
      "Otildesmall",
      "Odieresissmall",
      "OEsmall",
      "Oslashsmall",
      "Ugravesmall",
      "Uacutesmall",
      "Ucircumflexsmall",
      "Udieresissmall",
      "Yacutesmall",
      "Thornsmall",
      "Ydieresissmall"
    ];
    __name(DefaultEncoding, "DefaultEncoding");
    DefaultEncoding.prototype.charToGlyphIndex = function(c2) {
      var code = c2.codePointAt(0);
      var glyphs = this.font.glyphs;
      if (glyphs) {
        for (var i2 = 0; i2 < glyphs.length; i2 += 1) {
          var glyph = glyphs.get(i2);
          for (var j2 = 0; j2 < glyph.unicodes.length; j2 += 1) {
            if (glyph.unicodes[j2] === code) {
              return i2;
            }
          }
        }
      }
      return null;
    };
    __name(CmapEncoding, "CmapEncoding");
    CmapEncoding.prototype.charToGlyphIndex = function(c2) {
      return this.cmap.glyphIndexMap[c2.codePointAt(0)] || 0;
    };
    __name(CffEncoding, "CffEncoding");
    CffEncoding.prototype.charToGlyphIndex = function(s) {
      var code = s.codePointAt(0);
      var charName = this.encoding[code];
      return this.charset.indexOf(charName);
    };
    __name(addGlyphNamesAll, "addGlyphNamesAll");
    __name(addGlyphNamesToUnicodeMap, "addGlyphNamesToUnicodeMap");
    __name(addGlyphNames, "addGlyphNames");
    __name(fail, "fail");
    __name(argument, "argument");
    check = { fail, argument, assert: argument };
    __name(getPathDefinition, "getPathDefinition");
    __name(Glyph, "Glyph");
    Glyph.prototype.bindConstructorValues = function(options) {
      this.index = options.index || 0;
      this.name = options.name || null;
      this.unicode = options.unicode || void 0;
      this.unicodes = options.unicodes || options.unicode !== void 0 ? [options.unicode] : [];
      if ("xMin" in options) {
        this.xMin = options.xMin;
      }
      if ("yMin" in options) {
        this.yMin = options.yMin;
      }
      if ("xMax" in options) {
        this.xMax = options.xMax;
      }
      if ("yMax" in options) {
        this.yMax = options.yMax;
      }
      if ("advanceWidth" in options) {
        this.advanceWidth = options.advanceWidth;
      }
      Object.defineProperty(this, "path", getPathDefinition(this, options.path));
    };
    Glyph.prototype.addUnicode = function(unicode) {
      if (this.unicodes.length === 0) {
        this.unicode = unicode;
      }
      this.unicodes.push(unicode);
    };
    Glyph.prototype.getPath = function(x2, y, fontSize, options, font) {
      x2 = x2 !== void 0 ? x2 : 0;
      y = y !== void 0 ? y : 0;
      fontSize = fontSize !== void 0 ? fontSize : 72;
      var commands;
      var hPoints;
      if (!options) {
        options = {};
      }
      var xScale = options.xScale;
      var yScale = options.yScale;
      if (options.hinting && font && font.hinting) {
        hPoints = this.path && font.hinting.exec(this, fontSize);
      }
      if (hPoints) {
        commands = font.hinting.getCommands(hPoints);
        x2 = Math.round(x2);
        y = Math.round(y);
        xScale = yScale = 1;
      } else {
        commands = this.path.commands;
        var scale = 1 / (this.path.unitsPerEm || 1e3) * fontSize;
        if (xScale === void 0) {
          xScale = scale;
        }
        if (yScale === void 0) {
          yScale = scale;
        }
      }
      var p = new Path();
      for (var i2 = 0; i2 < commands.length; i2 += 1) {
        var cmd = commands[i2];
        if (cmd.type === "M") {
          p.moveTo(x2 + cmd.x * xScale, y + -cmd.y * yScale);
        } else if (cmd.type === "L") {
          p.lineTo(x2 + cmd.x * xScale, y + -cmd.y * yScale);
        } else if (cmd.type === "Q") {
          p.quadraticCurveTo(
            x2 + cmd.x1 * xScale,
            y + -cmd.y1 * yScale,
            x2 + cmd.x * xScale,
            y + -cmd.y * yScale
          );
        } else if (cmd.type === "C") {
          p.curveTo(
            x2 + cmd.x1 * xScale,
            y + -cmd.y1 * yScale,
            x2 + cmd.x2 * xScale,
            y + -cmd.y2 * yScale,
            x2 + cmd.x * xScale,
            y + -cmd.y * yScale
          );
        } else if (cmd.type === "Z") {
          p.closePath();
        }
      }
      return p;
    };
    Glyph.prototype.getContours = function() {
      if (this.points === void 0) {
        return [];
      }
      var contours = [];
      var currentContour = [];
      for (var i2 = 0; i2 < this.points.length; i2 += 1) {
        var pt = this.points[i2];
        currentContour.push(pt);
        if (pt.lastPointOfContour) {
          contours.push(currentContour);
          currentContour = [];
        }
      }
      check.argument(
        currentContour.length === 0,
        "There are still points left in the current contour."
      );
      return contours;
    };
    Glyph.prototype.getMetrics = function() {
      var commands = this.path.commands;
      var xCoords = [];
      var yCoords = [];
      for (var i2 = 0; i2 < commands.length; i2 += 1) {
        var cmd = commands[i2];
        if (cmd.type !== "Z") {
          xCoords.push(cmd.x);
          yCoords.push(cmd.y);
        }
        if (cmd.type === "Q" || cmd.type === "C") {
          xCoords.push(cmd.x1);
          yCoords.push(cmd.y1);
        }
        if (cmd.type === "C") {
          xCoords.push(cmd.x2);
          yCoords.push(cmd.y2);
        }
      }
      var metrics = {
        xMin: Math.min.apply(null, xCoords),
        yMin: Math.min.apply(null, yCoords),
        xMax: Math.max.apply(null, xCoords),
        yMax: Math.max.apply(null, yCoords),
        leftSideBearing: this.leftSideBearing
      };
      if (!isFinite(metrics.xMin)) {
        metrics.xMin = 0;
      }
      if (!isFinite(metrics.xMax)) {
        metrics.xMax = this.advanceWidth;
      }
      if (!isFinite(metrics.yMin)) {
        metrics.yMin = 0;
      }
      if (!isFinite(metrics.yMax)) {
        metrics.yMax = 0;
      }
      metrics.rightSideBearing = this.advanceWidth - metrics.leftSideBearing - (metrics.xMax - metrics.xMin);
      return metrics;
    };
    __name(defineDependentProperty, "defineDependentProperty");
    __name(GlyphSet, "GlyphSet");
    GlyphSet.prototype.get = function(index) {
      if (this.glyphs[index] === void 0) {
        this.font._push(index);
        if (typeof this.glyphs[index] === "function") {
          this.glyphs[index] = this.glyphs[index]();
        }
        var glyph = this.glyphs[index];
        var unicodeObj = this.font._IndexToUnicodeMap[index];
        if (unicodeObj) {
          for (var j2 = 0; j2 < unicodeObj.unicodes.length; j2++) {
            glyph.addUnicode(unicodeObj.unicodes[j2]);
          }
        }
        this.glyphs[index].advanceWidth = this.font._hmtxTableData[index].advanceWidth;
        this.glyphs[index].leftSideBearing = this.font._hmtxTableData[index].leftSideBearing;
      } else {
        if (typeof this.glyphs[index] === "function") {
          this.glyphs[index] = this.glyphs[index]();
        }
      }
      return this.glyphs[index];
    };
    GlyphSet.prototype.push = function(index, loader) {
      this.glyphs[index] = loader;
      this.length++;
    };
    __name(glyphLoader, "glyphLoader");
    __name(ttfGlyphLoader, "ttfGlyphLoader");
    __name(cffGlyphLoader, "cffGlyphLoader");
    glyphset = { GlyphSet, glyphLoader, ttfGlyphLoader, cffGlyphLoader };
    __name(searchTag, "searchTag");
    __name(binSearch, "binSearch");
    __name(searchRange, "searchRange");
    __name(Layout, "Layout");
    Layout.prototype = {
      /**
       * Binary search an object by "tag" property
       * @instance
       * @function searchTag
       * @memberof opentype.Layout
       * @param  {Array} arr
       * @param  {string} tag
       * @return {number}
       */
      searchTag,
      /**
       * Binary search in a list of numbers
       * @instance
       * @function binSearch
       * @memberof opentype.Layout
       * @param  {Array} arr
       * @param  {number} value
       * @return {number}
       */
      binSearch,
      /**
       * Get or create the Layout table (GSUB, GPOS etc).
       * @param  {boolean} create - Whether to create a new one.
       * @return {Object} The GSUB or GPOS table.
       */
      getTable: /* @__PURE__ */ __name(function(create) {
        var layout = this.font.tables[this.tableName];
        if (!layout && create) {
          layout = this.font.tables[this.tableName] = this.createDefaultTable();
        }
        return layout;
      }, "getTable"),
      /**
       * Returns the best bet for a script name.
       * Returns 'DFLT' if it exists.
       * If not, returns 'latn' if it exists.
       * If neither exist, returns undefined.
       */
      getDefaultScriptName: /* @__PURE__ */ __name(function() {
        var layout = this.getTable();
        if (!layout) {
          return;
        }
        var hasLatn = false;
        for (var i2 = 0; i2 < layout.scripts.length; i2++) {
          var name = layout.scripts[i2].tag;
          if (name === "DFLT") {
            return name;
          }
          if (name === "latn") {
            hasLatn = true;
          }
        }
        if (hasLatn) {
          return "latn";
        }
      }, "getDefaultScriptName"),
      /**
       * Returns all LangSysRecords in the given script.
       * @instance
       * @param {string} [script='DFLT']
       * @param {boolean} create - forces the creation of this script table if it doesn't exist.
       * @return {Object} An object with tag and script properties.
       */
      getScriptTable: /* @__PURE__ */ __name(function(script, create) {
        var layout = this.getTable(create);
        if (layout) {
          script = script || "DFLT";
          var scripts = layout.scripts;
          var pos = searchTag(layout.scripts, script);
          if (pos >= 0) {
            return scripts[pos].script;
          } else if (create) {
            var scr = {
              tag: script,
              script: {
                defaultLangSys: {
                  reserved: 0,
                  reqFeatureIndex: 65535,
                  featureIndexes: []
                },
                langSysRecords: []
              }
            };
            scripts.splice(-1 - pos, 0, scr);
            return scr.script;
          }
        }
      }, "getScriptTable"),
      /**
       * Returns a language system table
       * @instance
       * @param {string} [script='DFLT']
       * @param {string} [language='dlft']
       * @param {boolean} create - forces the creation of this langSysTable if it doesn't exist.
       * @return {Object}
       */
      getLangSysTable: /* @__PURE__ */ __name(function(script, language, create) {
        var scriptTable = this.getScriptTable(script, create);
        if (scriptTable) {
          if (!language || language === "dflt" || language === "DFLT") {
            return scriptTable.defaultLangSys;
          }
          var pos = searchTag(scriptTable.langSysRecords, language);
          if (pos >= 0) {
            return scriptTable.langSysRecords[pos].langSys;
          } else if (create) {
            var langSysRecord = {
              tag: language,
              langSys: {
                reserved: 0,
                reqFeatureIndex: 65535,
                featureIndexes: []
              }
            };
            scriptTable.langSysRecords.splice(-1 - pos, 0, langSysRecord);
            return langSysRecord.langSys;
          }
        }
      }, "getLangSysTable"),
      /**
       * Get a specific feature table.
       * @instance
       * @param {string} [script='DFLT']
       * @param {string} [language='dlft']
       * @param {string} feature - One of the codes listed at https://www.microsoft.com/typography/OTSPEC/featurelist.htm
       * @param {boolean} create - forces the creation of the feature table if it doesn't exist.
       * @return {Object}
       */
      getFeatureTable: /* @__PURE__ */ __name(function(script, language, feature, create) {
        var langSysTable2 = this.getLangSysTable(script, language, create);
        if (langSysTable2) {
          var featureRecord;
          var featIndexes = langSysTable2.featureIndexes;
          var allFeatures = this.font.tables[this.tableName].features;
          for (var i2 = 0; i2 < featIndexes.length; i2++) {
            featureRecord = allFeatures[featIndexes[i2]];
            if (featureRecord.tag === feature) {
              return featureRecord.feature;
            }
          }
          if (create) {
            var index = allFeatures.length;
            check.assert(
              index === 0 || feature >= allFeatures[index - 1].tag,
              "Features must be added in alphabetical order."
            );
            featureRecord = {
              tag: feature,
              feature: { params: 0, lookupListIndexes: [] }
            };
            allFeatures.push(featureRecord);
            featIndexes.push(index);
            return featureRecord.feature;
          }
        }
      }, "getFeatureTable"),
      /**
       * Get the lookup tables of a given type for a script/language/feature.
       * @instance
       * @param {string} [script='DFLT']
       * @param {string} [language='dlft']
       * @param {string} feature - 4-letter feature code
       * @param {number} lookupType - 1 to 9
       * @param {boolean} create - forces the creation of the lookup table if it doesn't exist, with no subtables.
       * @return {Object[]}
       */
      getLookupTables: /* @__PURE__ */ __name(function(script, language, feature, lookupType, create) {
        var featureTable = this.getFeatureTable(
          script,
          language,
          feature,
          create
        );
        var tables = [];
        if (featureTable) {
          var lookupTable;
          var lookupListIndexes = featureTable.lookupListIndexes;
          var allLookups = this.font.tables[this.tableName].lookups;
          for (var i2 = 0; i2 < lookupListIndexes.length; i2++) {
            lookupTable = allLookups[lookupListIndexes[i2]];
            if (lookupTable.lookupType === lookupType) {
              tables.push(lookupTable);
            }
          }
          if (tables.length === 0 && create) {
            lookupTable = {
              lookupType,
              lookupFlag: 0,
              subtables: [],
              markFilteringSet: void 0
            };
            var index = allLookups.length;
            allLookups.push(lookupTable);
            lookupListIndexes.push(index);
            return [lookupTable];
          }
        }
        return tables;
      }, "getLookupTables"),
      /**
       * Find a glyph in a class definition table
       * https://docs.microsoft.com/en-us/typography/opentype/spec/chapter2#class-definition-table
       * @param {object} classDefTable - an OpenType Layout class definition table
       * @param {number} glyphIndex - the index of the glyph to find
       * @returns {number} -1 if not found
       */
      getGlyphClass: /* @__PURE__ */ __name(function(classDefTable, glyphIndex) {
        switch (classDefTable.format) {
          case 1:
            if (classDefTable.startGlyph <= glyphIndex && glyphIndex < classDefTable.startGlyph + classDefTable.classes.length) {
              return classDefTable.classes[glyphIndex - classDefTable.startGlyph];
            }
            return 0;
          case 2:
            var range = searchRange(classDefTable.ranges, glyphIndex);
            return range ? range.classId : 0;
        }
      }, "getGlyphClass"),
      /**
       * Find a glyph in a coverage table
       * https://docs.microsoft.com/en-us/typography/opentype/spec/chapter2#coverage-table
       * @param {object} coverageTable - an OpenType Layout coverage table
       * @param {number} glyphIndex - the index of the glyph to find
       * @returns {number} -1 if not found
       */
      getCoverageIndex: /* @__PURE__ */ __name(function(coverageTable, glyphIndex) {
        switch (coverageTable.format) {
          case 1:
            var index = binSearch(coverageTable.glyphs, glyphIndex);
            return index >= 0 ? index : -1;
          case 2:
            var range = searchRange(coverageTable.ranges, glyphIndex);
            return range ? range.index + glyphIndex - range.start : -1;
        }
      }, "getCoverageIndex"),
      /**
       * Returns the list of glyph indexes of a coverage table.
       * Format 1: the list is stored raw
       * Format 2: compact list as range records.
       * @instance
       * @param  {Object} coverageTable
       * @return {Array}
       */
      expandCoverage: /* @__PURE__ */ __name(function(coverageTable) {
        if (coverageTable.format === 1) {
          return coverageTable.glyphs;
        } else {
          var glyphs = [];
          var ranges = coverageTable.ranges;
          for (var i2 = 0; i2 < ranges.length; i2++) {
            var range = ranges[i2];
            var start = range.start;
            var end = range.end;
            for (var j2 = start; j2 <= end; j2++) {
              glyphs.push(j2);
            }
          }
          return glyphs;
        }
      }, "expandCoverage")
    };
    __name(Position, "Position");
    Position.prototype = Layout.prototype;
    Position.prototype.init = function() {
      var script = this.getDefaultScriptName();
      this.defaultKerningTables = this.getKerningTables(script);
    };
    Position.prototype.getKerningValue = function(kerningLookups, leftIndex, rightIndex) {
      for (var i2 = 0; i2 < kerningLookups.length; i2++) {
        var subtables = kerningLookups[i2].subtables;
        for (var j2 = 0; j2 < subtables.length; j2++) {
          var subtable = subtables[j2];
          var covIndex = this.getCoverageIndex(subtable.coverage, leftIndex);
          if (covIndex < 0) {
            continue;
          }
          switch (subtable.posFormat) {
            case 1:
              var pairSet = subtable.pairSets[covIndex];
              for (var k = 0; k < pairSet.length; k++) {
                var pair = pairSet[k];
                if (pair.secondGlyph === rightIndex) {
                  return pair.value1 && pair.value1.xAdvance || 0;
                }
              }
              break;
            case 2:
              var class1 = this.getGlyphClass(subtable.classDef1, leftIndex);
              var class2 = this.getGlyphClass(subtable.classDef2, rightIndex);
              var pair$1 = subtable.classRecords[class1][class2];
              return pair$1.value1 && pair$1.value1.xAdvance || 0;
          }
        }
      }
      return 0;
    };
    Position.prototype.getKerningTables = function(script, language) {
      if (this.font.tables.gpos) {
        return this.getLookupTables(script, language, "kern", 2);
      }
    };
    __name(Substitution, "Substitution");
    __name(arraysEqual, "arraysEqual");
    __name(getSubstFormat, "getSubstFormat");
    Substitution.prototype = Layout.prototype;
    Substitution.prototype.createDefaultTable = function() {
      return {
        version: 1,
        scripts: [
          {
            tag: "DFLT",
            script: {
              defaultLangSys: {
                reserved: 0,
                reqFeatureIndex: 65535,
                featureIndexes: []
              },
              langSysRecords: []
            }
          }
        ],
        features: [],
        lookups: []
      };
    };
    Substitution.prototype.getSingle = function(feature, script, language) {
      var substitutions = [];
      var lookupTables = this.getLookupTables(script, language, feature, 1);
      for (var idx = 0; idx < lookupTables.length; idx++) {
        var subtables = lookupTables[idx].subtables;
        for (var i2 = 0; i2 < subtables.length; i2++) {
          var subtable = subtables[i2];
          var glyphs = this.expandCoverage(subtable.coverage);
          var j2 = void 0;
          if (subtable.substFormat === 1) {
            var delta = subtable.deltaGlyphId;
            for (j2 = 0; j2 < glyphs.length; j2++) {
              var glyph = glyphs[j2];
              substitutions.push({ sub: glyph, by: glyph + delta });
            }
          } else {
            var substitute = subtable.substitute;
            for (j2 = 0; j2 < glyphs.length; j2++) {
              substitutions.push({ sub: glyphs[j2], by: substitute[j2] });
            }
          }
        }
      }
      return substitutions;
    };
    Substitution.prototype.getMultiple = function(feature, script, language) {
      var substitutions = [];
      var lookupTables = this.getLookupTables(script, language, feature, 2);
      for (var idx = 0; idx < lookupTables.length; idx++) {
        var subtables = lookupTables[idx].subtables;
        for (var i2 = 0; i2 < subtables.length; i2++) {
          var subtable = subtables[i2];
          var glyphs = this.expandCoverage(subtable.coverage);
          var j2 = void 0;
          for (j2 = 0; j2 < glyphs.length; j2++) {
            var glyph = glyphs[j2];
            var replacements = subtable.sequences[j2];
            substitutions.push({ sub: glyph, by: replacements });
          }
        }
      }
      return substitutions;
    };
    Substitution.prototype.getAlternates = function(feature, script, language) {
      var alternates = [];
      var lookupTables = this.getLookupTables(script, language, feature, 3);
      for (var idx = 0; idx < lookupTables.length; idx++) {
        var subtables = lookupTables[idx].subtables;
        for (var i2 = 0; i2 < subtables.length; i2++) {
          var subtable = subtables[i2];
          var glyphs = this.expandCoverage(subtable.coverage);
          var alternateSets = subtable.alternateSets;
          for (var j2 = 0; j2 < glyphs.length; j2++) {
            alternates.push({ sub: glyphs[j2], by: alternateSets[j2] });
          }
        }
      }
      return alternates;
    };
    Substitution.prototype.getLigatures = function(feature, script, language) {
      var ligatures = [];
      var lookupTables = this.getLookupTables(script, language, feature, 4);
      for (var idx = 0; idx < lookupTables.length; idx++) {
        var subtables = lookupTables[idx].subtables;
        for (var i2 = 0; i2 < subtables.length; i2++) {
          var subtable = subtables[i2];
          var glyphs = this.expandCoverage(subtable.coverage);
          var ligatureSets = subtable.ligatureSets;
          for (var j2 = 0; j2 < glyphs.length; j2++) {
            var startGlyph = glyphs[j2];
            var ligSet = ligatureSets[j2];
            for (var k = 0; k < ligSet.length; k++) {
              var lig = ligSet[k];
              ligatures.push({
                sub: [startGlyph].concat(lig.components),
                by: lig.ligGlyph
              });
            }
          }
        }
      }
      return ligatures;
    };
    Substitution.prototype.addSingle = function(feature, substitution, script, language) {
      var lookupTable = this.getLookupTables(
        script,
        language,
        feature,
        1,
        true
      )[0];
      var subtable = getSubstFormat(lookupTable, 2, {
        // lookup type 1 subtable, format 2, coverage format 1
        substFormat: 2,
        coverage: { format: 1, glyphs: [] },
        substitute: []
      });
      check.assert(
        subtable.coverage.format === 1,
        "Single: unable to modify coverage table format " + subtable.coverage.format
      );
      var coverageGlyph = substitution.sub;
      var pos = this.binSearch(subtable.coverage.glyphs, coverageGlyph);
      if (pos < 0) {
        pos = -1 - pos;
        subtable.coverage.glyphs.splice(pos, 0, coverageGlyph);
        subtable.substitute.splice(pos, 0, 0);
      }
      subtable.substitute[pos] = substitution.by;
    };
    Substitution.prototype.addMultiple = function(feature, substitution, script, language) {
      check.assert(
        substitution.by instanceof Array && substitution.by.length > 1,
        'Multiple: "by" must be an array of two or more ids'
      );
      var lookupTable = this.getLookupTables(
        script,
        language,
        feature,
        2,
        true
      )[0];
      var subtable = getSubstFormat(lookupTable, 1, {
        // lookup type 2 subtable, format 1, coverage format 1
        substFormat: 1,
        coverage: { format: 1, glyphs: [] },
        sequences: []
      });
      check.assert(
        subtable.coverage.format === 1,
        "Multiple: unable to modify coverage table format " + subtable.coverage.format
      );
      var coverageGlyph = substitution.sub;
      var pos = this.binSearch(subtable.coverage.glyphs, coverageGlyph);
      if (pos < 0) {
        pos = -1 - pos;
        subtable.coverage.glyphs.splice(pos, 0, coverageGlyph);
        subtable.sequences.splice(pos, 0, 0);
      }
      subtable.sequences[pos] = substitution.by;
    };
    Substitution.prototype.addAlternate = function(feature, substitution, script, language) {
      var lookupTable = this.getLookupTables(
        script,
        language,
        feature,
        3,
        true
      )[0];
      var subtable = getSubstFormat(lookupTable, 1, {
        // lookup type 3 subtable, format 1, coverage format 1
        substFormat: 1,
        coverage: { format: 1, glyphs: [] },
        alternateSets: []
      });
      check.assert(
        subtable.coverage.format === 1,
        "Alternate: unable to modify coverage table format " + subtable.coverage.format
      );
      var coverageGlyph = substitution.sub;
      var pos = this.binSearch(subtable.coverage.glyphs, coverageGlyph);
      if (pos < 0) {
        pos = -1 - pos;
        subtable.coverage.glyphs.splice(pos, 0, coverageGlyph);
        subtable.alternateSets.splice(pos, 0, 0);
      }
      subtable.alternateSets[pos] = substitution.by;
    };
    Substitution.prototype.addLigature = function(feature, ligature, script, language) {
      var lookupTable = this.getLookupTables(
        script,
        language,
        feature,
        4,
        true
      )[0];
      var subtable = lookupTable.subtables[0];
      if (!subtable) {
        subtable = {
          // lookup type 4 subtable, format 1, coverage format 1
          substFormat: 1,
          coverage: { format: 1, glyphs: [] },
          ligatureSets: []
        };
        lookupTable.subtables[0] = subtable;
      }
      check.assert(
        subtable.coverage.format === 1,
        "Ligature: unable to modify coverage table format " + subtable.coverage.format
      );
      var coverageGlyph = ligature.sub[0];
      var ligComponents = ligature.sub.slice(1);
      var ligatureTable = {
        ligGlyph: ligature.by,
        components: ligComponents
      };
      var pos = this.binSearch(subtable.coverage.glyphs, coverageGlyph);
      if (pos >= 0) {
        var ligatureSet = subtable.ligatureSets[pos];
        for (var i2 = 0; i2 < ligatureSet.length; i2++) {
          if (arraysEqual(ligatureSet[i2].components, ligComponents)) {
            return;
          }
        }
        ligatureSet.push(ligatureTable);
      } else {
        pos = -1 - pos;
        subtable.coverage.glyphs.splice(pos, 0, coverageGlyph);
        subtable.ligatureSets.splice(pos, 0, [ligatureTable]);
      }
    };
    Substitution.prototype.getFeature = function(feature, script, language) {
      if (/ss\d\d/.test(feature)) {
        return this.getSingle(feature, script, language);
      }
      switch (feature) {
        case "aalt":
        case "salt":
          return this.getSingle(feature, script, language).concat(
            this.getAlternates(feature, script, language)
          );
        case "dlig":
        case "liga":
        case "rlig":
          return this.getLigatures(feature, script, language);
        case "ccmp":
          return this.getMultiple(feature, script, language).concat(
            this.getLigatures(feature, script, language)
          );
        case "stch":
          return this.getMultiple(feature, script, language);
      }
      return void 0;
    };
    Substitution.prototype.add = function(feature, sub, script, language) {
      if (/ss\d\d/.test(feature)) {
        return this.addSingle(feature, sub, script, language);
      }
      switch (feature) {
        case "aalt":
        case "salt":
          if (typeof sub.by === "number") {
            return this.addSingle(feature, sub, script, language);
          }
          return this.addAlternate(feature, sub, script, language);
        case "dlig":
        case "liga":
        case "rlig":
          return this.addLigature(feature, sub, script, language);
        case "ccmp":
          if (sub.by instanceof Array) {
            return this.addMultiple(feature, sub, script, language);
          }
          return this.addLigature(feature, sub, script, language);
      }
      return void 0;
    };
    __name(checkArgument, "checkArgument");
    __name(getByte, "getByte");
    __name(getUShort, "getUShort");
    __name(getShort, "getShort");
    __name(getULong, "getULong");
    __name(getFixed, "getFixed");
    __name(getTag, "getTag");
    __name(getOffset, "getOffset");
    __name(getBytes, "getBytes");
    __name(bytesToString, "bytesToString");
    typeOffsets = {
      byte: 1,
      uShort: 2,
      short: 2,
      uLong: 4,
      fixed: 4,
      longDateTime: 8,
      tag: 4
    };
    __name(Parser, "Parser");
    Parser.prototype.parseByte = function() {
      var v = this.data.getUint8(this.offset + this.relativeOffset);
      this.relativeOffset += 1;
      return v;
    };
    Parser.prototype.parseChar = function() {
      var v = this.data.getInt8(this.offset + this.relativeOffset);
      this.relativeOffset += 1;
      return v;
    };
    Parser.prototype.parseCard8 = Parser.prototype.parseByte;
    Parser.prototype.parseUShort = function() {
      var v = this.data.getUint16(this.offset + this.relativeOffset);
      this.relativeOffset += 2;
      return v;
    };
    Parser.prototype.parseCard16 = Parser.prototype.parseUShort;
    Parser.prototype.parseSID = Parser.prototype.parseUShort;
    Parser.prototype.parseOffset16 = Parser.prototype.parseUShort;
    Parser.prototype.parseShort = function() {
      var v = this.data.getInt16(this.offset + this.relativeOffset);
      this.relativeOffset += 2;
      return v;
    };
    Parser.prototype.parseF2Dot14 = function() {
      var v = this.data.getInt16(this.offset + this.relativeOffset) / 16384;
      this.relativeOffset += 2;
      return v;
    };
    Parser.prototype.parseULong = function() {
      var v = getULong(this.data, this.offset + this.relativeOffset);
      this.relativeOffset += 4;
      return v;
    };
    Parser.prototype.parseOffset32 = Parser.prototype.parseULong;
    Parser.prototype.parseFixed = function() {
      var v = getFixed(this.data, this.offset + this.relativeOffset);
      this.relativeOffset += 4;
      return v;
    };
    Parser.prototype.parseString = function(length) {
      var dataView = this.data;
      var offset = this.offset + this.relativeOffset;
      var string = "";
      this.relativeOffset += length;
      for (var i2 = 0; i2 < length; i2++) {
        string += String.fromCharCode(dataView.getUint8(offset + i2));
      }
      return string;
    };
    Parser.prototype.parseTag = function() {
      return this.parseString(4);
    };
    Parser.prototype.parseLongDateTime = function() {
      var v = getULong(this.data, this.offset + this.relativeOffset + 4);
      v -= 2082844800;
      this.relativeOffset += 8;
      return v;
    };
    Parser.prototype.parseVersion = function(minorBase) {
      var major = getUShort(this.data, this.offset + this.relativeOffset);
      var minor = getUShort(this.data, this.offset + this.relativeOffset + 2);
      this.relativeOffset += 4;
      if (minorBase === void 0) {
        minorBase = 4096;
      }
      return major + minor / minorBase / 10;
    };
    Parser.prototype.skip = function(type, amount) {
      if (amount === void 0) {
        amount = 1;
      }
      this.relativeOffset += typeOffsets[type] * amount;
    };
    Parser.prototype.parseULongList = function(count) {
      if (count === void 0) {
        count = this.parseULong();
      }
      var offsets = new Array(count);
      var dataView = this.data;
      var offset = this.offset + this.relativeOffset;
      for (var i2 = 0; i2 < count; i2++) {
        offsets[i2] = dataView.getUint32(offset);
        offset += 4;
      }
      this.relativeOffset += count * 4;
      return offsets;
    };
    Parser.prototype.parseOffset16List = Parser.prototype.parseUShortList = function(count) {
      if (count === void 0) {
        count = this.parseUShort();
      }
      var offsets = new Array(count);
      var dataView = this.data;
      var offset = this.offset + this.relativeOffset;
      for (var i2 = 0; i2 < count; i2++) {
        offsets[i2] = dataView.getUint16(offset);
        offset += 2;
      }
      this.relativeOffset += count * 2;
      return offsets;
    };
    Parser.prototype.parseShortList = function(count) {
      var list = new Array(count);
      var dataView = this.data;
      var offset = this.offset + this.relativeOffset;
      for (var i2 = 0; i2 < count; i2++) {
        list[i2] = dataView.getInt16(offset);
        offset += 2;
      }
      this.relativeOffset += count * 2;
      return list;
    };
    Parser.prototype.parseByteList = function(count) {
      var list = new Array(count);
      var dataView = this.data;
      var offset = this.offset + this.relativeOffset;
      for (var i2 = 0; i2 < count; i2++) {
        list[i2] = dataView.getUint8(offset++);
      }
      this.relativeOffset += count;
      return list;
    };
    Parser.prototype.parseList = function(count, itemCallback) {
      if (!itemCallback) {
        itemCallback = count;
        count = this.parseUShort();
      }
      var list = new Array(count);
      for (var i2 = 0; i2 < count; i2++) {
        list[i2] = itemCallback.call(this);
      }
      return list;
    };
    Parser.prototype.parseList32 = function(count, itemCallback) {
      if (!itemCallback) {
        itemCallback = count;
        count = this.parseULong();
      }
      var list = new Array(count);
      for (var i2 = 0; i2 < count; i2++) {
        list[i2] = itemCallback.call(this);
      }
      return list;
    };
    Parser.prototype.parseRecordList = function(count, recordDescription) {
      if (!recordDescription) {
        recordDescription = count;
        count = this.parseUShort();
      }
      var records = new Array(count);
      var fields = Object.keys(recordDescription);
      for (var i2 = 0; i2 < count; i2++) {
        var rec = {};
        for (var j2 = 0; j2 < fields.length; j2++) {
          var fieldName = fields[j2];
          var fieldType = recordDescription[fieldName];
          rec[fieldName] = fieldType.call(this);
        }
        records[i2] = rec;
      }
      return records;
    };
    Parser.prototype.parseRecordList32 = function(count, recordDescription) {
      if (!recordDescription) {
        recordDescription = count;
        count = this.parseULong();
      }
      var records = new Array(count);
      var fields = Object.keys(recordDescription);
      for (var i2 = 0; i2 < count; i2++) {
        var rec = {};
        for (var j2 = 0; j2 < fields.length; j2++) {
          var fieldName = fields[j2];
          var fieldType = recordDescription[fieldName];
          rec[fieldName] = fieldType.call(this);
        }
        records[i2] = rec;
      }
      return records;
    };
    Parser.prototype.parseStruct = function(description) {
      if (typeof description === "function") {
        return description.call(this);
      } else {
        var fields = Object.keys(description);
        var struct = {};
        for (var j2 = 0; j2 < fields.length; j2++) {
          var fieldName = fields[j2];
          var fieldType = description[fieldName];
          struct[fieldName] = fieldType.call(this);
        }
        return struct;
      }
    };
    Parser.prototype.parseValueRecord = function(valueFormat) {
      if (valueFormat === void 0) {
        valueFormat = this.parseUShort();
      }
      if (valueFormat === 0) {
        return;
      }
      var valueRecord = {};
      if (valueFormat & 1) {
        valueRecord.xPlacement = this.parseShort();
      }
      if (valueFormat & 2) {
        valueRecord.yPlacement = this.parseShort();
      }
      if (valueFormat & 4) {
        valueRecord.xAdvance = this.parseShort();
      }
      if (valueFormat & 8) {
        valueRecord.yAdvance = this.parseShort();
      }
      if (valueFormat & 16) {
        valueRecord.xPlaDevice = void 0;
        this.parseShort();
      }
      if (valueFormat & 32) {
        valueRecord.yPlaDevice = void 0;
        this.parseShort();
      }
      if (valueFormat & 64) {
        valueRecord.xAdvDevice = void 0;
        this.parseShort();
      }
      if (valueFormat & 128) {
        valueRecord.yAdvDevice = void 0;
        this.parseShort();
      }
      return valueRecord;
    };
    Parser.prototype.parseValueRecordList = function() {
      var valueFormat = this.parseUShort();
      var valueCount = this.parseUShort();
      var values = new Array(valueCount);
      for (var i2 = 0; i2 < valueCount; i2++) {
        values[i2] = this.parseValueRecord(valueFormat);
      }
      return values;
    };
    Parser.prototype.parsePointer = function(description) {
      var structOffset = this.parseOffset16();
      if (structOffset > 0) {
        return new Parser(this.data, this.offset + structOffset).parseStruct(description);
      }
      return void 0;
    };
    Parser.prototype.parsePointer32 = function(description) {
      var structOffset = this.parseOffset32();
      if (structOffset > 0) {
        return new Parser(this.data, this.offset + structOffset).parseStruct(description);
      }
      return void 0;
    };
    Parser.prototype.parseListOfLists = function(itemCallback) {
      var offsets = this.parseOffset16List();
      var count = offsets.length;
      var relativeOffset = this.relativeOffset;
      var list = new Array(count);
      for (var i2 = 0; i2 < count; i2++) {
        var start = offsets[i2];
        if (start === 0) {
          list[i2] = void 0;
          continue;
        }
        this.relativeOffset = start;
        if (itemCallback) {
          var subOffsets = this.parseOffset16List();
          var subList = new Array(subOffsets.length);
          for (var j2 = 0; j2 < subOffsets.length; j2++) {
            this.relativeOffset = start + subOffsets[j2];
            subList[j2] = itemCallback.call(this);
          }
          list[i2] = subList;
        } else {
          list[i2] = this.parseUShortList();
        }
      }
      this.relativeOffset = relativeOffset;
      return list;
    };
    Parser.prototype.parseCoverage = function() {
      var startOffset = this.offset + this.relativeOffset;
      var format = this.parseUShort();
      var count = this.parseUShort();
      if (format === 1) {
        return {
          format: 1,
          glyphs: this.parseUShortList(count)
        };
      } else if (format === 2) {
        var ranges = new Array(count);
        for (var i2 = 0; i2 < count; i2++) {
          ranges[i2] = {
            start: this.parseUShort(),
            end: this.parseUShort(),
            index: this.parseUShort()
          };
        }
        return {
          format: 2,
          ranges
        };
      }
      throw new Error("0x" + startOffset.toString(16) + ": Coverage format must be 1 or 2.");
    };
    Parser.prototype.parseClassDef = function() {
      var startOffset = this.offset + this.relativeOffset;
      var format = this.parseUShort();
      if (format === 1) {
        return {
          format: 1,
          startGlyph: this.parseUShort(),
          classes: this.parseUShortList()
        };
      } else if (format === 2) {
        return {
          format: 2,
          ranges: this.parseRecordList({
            start: Parser.uShort,
            end: Parser.uShort,
            classId: Parser.uShort
          })
        };
      }
      throw new Error("0x" + startOffset.toString(16) + ": ClassDef format must be 1 or 2.");
    };
    Parser.list = function(count, itemCallback) {
      return function() {
        return this.parseList(count, itemCallback);
      };
    };
    Parser.list32 = function(count, itemCallback) {
      return function() {
        return this.parseList32(count, itemCallback);
      };
    };
    Parser.recordList = function(count, recordDescription) {
      return function() {
        return this.parseRecordList(count, recordDescription);
      };
    };
    Parser.recordList32 = function(count, recordDescription) {
      return function() {
        return this.parseRecordList32(count, recordDescription);
      };
    };
    Parser.pointer = function(description) {
      return function() {
        return this.parsePointer(description);
      };
    };
    Parser.pointer32 = function(description) {
      return function() {
        return this.parsePointer32(description);
      };
    };
    Parser.tag = Parser.prototype.parseTag;
    Parser.byte = Parser.prototype.parseByte;
    Parser.uShort = Parser.offset16 = Parser.prototype.parseUShort;
    Parser.uShortList = Parser.prototype.parseUShortList;
    Parser.uLong = Parser.offset32 = Parser.prototype.parseULong;
    Parser.uLongList = Parser.prototype.parseULongList;
    Parser.struct = Parser.prototype.parseStruct;
    Parser.coverage = Parser.prototype.parseCoverage;
    Parser.classDef = Parser.prototype.parseClassDef;
    langSysTable = {
      reserved: Parser.uShort,
      reqFeatureIndex: Parser.uShort,
      featureIndexes: Parser.uShortList
    };
    Parser.prototype.parseScriptList = function() {
      return this.parsePointer(Parser.recordList({
        tag: Parser.tag,
        script: Parser.pointer({
          defaultLangSys: Parser.pointer(langSysTable),
          langSysRecords: Parser.recordList({
            tag: Parser.tag,
            langSys: Parser.pointer(langSysTable)
          })
        })
      })) || [];
    };
    Parser.prototype.parseFeatureList = function() {
      return this.parsePointer(Parser.recordList({
        tag: Parser.tag,
        feature: Parser.pointer({
          featureParams: Parser.offset16,
          lookupListIndexes: Parser.uShortList
        })
      })) || [];
    };
    Parser.prototype.parseLookupList = function(lookupTableParsers) {
      return this.parsePointer(Parser.list(Parser.pointer(function() {
        var lookupType = this.parseUShort();
        check.argument(1 <= lookupType && lookupType <= 9, "GPOS/GSUB lookup type " + lookupType + " unknown.");
        var lookupFlag = this.parseUShort();
        var useMarkFilteringSet = lookupFlag & 16;
        return {
          lookupType,
          lookupFlag,
          subtables: this.parseList(Parser.pointer(lookupTableParsers[lookupType])),
          markFilteringSet: useMarkFilteringSet ? this.parseUShort() : void 0
        };
      }))) || [];
    };
    Parser.prototype.parseFeatureVariationsList = function() {
      return this.parsePointer32(function() {
        var majorVersion = this.parseUShort();
        var minorVersion = this.parseUShort();
        check.argument(majorVersion === 1 && minorVersion < 1, "GPOS/GSUB feature variations table unknown.");
        var featureVariations = this.parseRecordList32({
          conditionSetOffset: Parser.offset32,
          featureTableSubstitutionOffset: Parser.offset32
        });
        return featureVariations;
      }) || [];
    };
    parse = {
      getByte,
      getCard8: getByte,
      getUShort,
      getCard16: getUShort,
      getShort,
      getULong,
      getFixed,
      getTag,
      getOffset,
      getBytes,
      bytesToString,
      Parser
    };
    __name(parseGlyphCoordinate, "parseGlyphCoordinate");
    __name(parseGlyph, "parseGlyph");
    __name(transformPoints, "transformPoints");
    __name(getContours, "getContours");
    __name(getPath, "getPath");
    __name(buildPath, "buildPath");
    __name(parseGlyfTableAll, "parseGlyfTableAll");
    __name(parseGlyfTableOnLowMemory, "parseGlyfTableOnLowMemory");
    __name(parseGlyfTable, "parseGlyfTable");
    glyf = { getPath, parse: parseGlyfTable };
    __name(Hinting, "Hinting");
    __name(roundOff, "roundOff");
    __name(roundToGrid, "roundToGrid");
    __name(roundToDoubleGrid, "roundToDoubleGrid");
    __name(roundToHalfGrid, "roundToHalfGrid");
    __name(roundUpToGrid, "roundUpToGrid");
    __name(roundDownToGrid, "roundDownToGrid");
    roundSuper = /* @__PURE__ */ __name(function(v) {
      var period = this.srPeriod;
      var phase = this.srPhase;
      var threshold = this.srThreshold;
      var sign = 1;
      if (v < 0) {
        v = -v;
        sign = -1;
      }
      v += threshold - phase;
      v = Math.trunc(v / period) * period;
      v += phase;
      if (v < 0) {
        return phase * sign;
      }
      return v * sign;
    }, "roundSuper");
    xUnitVector = {
      x: 1,
      y: 0,
      axis: "x",
      // Gets the projected distance between two points.
      // o1/o2 ... if true, respective original position is used.
      distance: /* @__PURE__ */ __name(function(p1, p2, o1, o2) {
        return (o1 ? p1.xo : p1.x) - (o2 ? p2.xo : p2.x);
      }, "distance"),
      // Moves point p so the moved position has the same relative
      // position to the moved positions of rp1 and rp2 than the
      // original positions had.
      //
      // See APPENDIX on INTERPOLATE at the bottom of this file.
      interpolate: /* @__PURE__ */ __name(function(p, rp1, rp2, pv) {
        var do1;
        var do2;
        var doa1;
        var doa2;
        var dm1;
        var dm2;
        var dt2;
        if (!pv || pv === this) {
          do1 = p.xo - rp1.xo;
          do2 = p.xo - rp2.xo;
          dm1 = rp1.x - rp1.xo;
          dm2 = rp2.x - rp2.xo;
          doa1 = Math.abs(do1);
          doa2 = Math.abs(do2);
          dt2 = doa1 + doa2;
          if (dt2 === 0) {
            p.x = p.xo + (dm1 + dm2) / 2;
            return;
          }
          p.x = p.xo + (dm1 * doa2 + dm2 * doa1) / dt2;
          return;
        }
        do1 = pv.distance(p, rp1, true, true);
        do2 = pv.distance(p, rp2, true, true);
        dm1 = pv.distance(rp1, rp1, false, true);
        dm2 = pv.distance(rp2, rp2, false, true);
        doa1 = Math.abs(do1);
        doa2 = Math.abs(do2);
        dt2 = doa1 + doa2;
        if (dt2 === 0) {
          xUnitVector.setRelative(p, p, (dm1 + dm2) / 2, pv, true);
          return;
        }
        xUnitVector.setRelative(p, p, (dm1 * doa2 + dm2 * doa1) / dt2, pv, true);
      }, "interpolate"),
      // Slope of line normal to this
      normalSlope: Number.NEGATIVE_INFINITY,
      // Sets the point 'p' relative to point 'rp'
      // by the distance 'd'.
      //
      // See APPENDIX on SETRELATIVE at the bottom of this file.
      //
      // p   ... point to set
      // rp  ... reference point
      // d   ... distance on projection vector
      // pv  ... projection vector (undefined = this)
      // org ... if true, uses the original position of rp as reference.
      setRelative: /* @__PURE__ */ __name(function(p, rp, d, pv, org) {
        if (!pv || pv === this) {
          p.x = (org ? rp.xo : rp.x) + d;
          return;
        }
        var rpx = org ? rp.xo : rp.x;
        var rpy = org ? rp.yo : rp.y;
        var rpdx = rpx + d * pv.x;
        var rpdy = rpy + d * pv.y;
        p.x = rpdx + (p.y - rpdy) / pv.normalSlope;
      }, "setRelative"),
      // Slope of vector line.
      slope: 0,
      // Touches the point p.
      touch: /* @__PURE__ */ __name(function(p) {
        p.xTouched = true;
      }, "touch"),
      // Tests if a point p is touched.
      touched: /* @__PURE__ */ __name(function(p) {
        return p.xTouched;
      }, "touched"),
      // Untouches the point p.
      untouch: /* @__PURE__ */ __name(function(p) {
        p.xTouched = false;
      }, "untouch")
    };
    yUnitVector = {
      x: 0,
      y: 1,
      axis: "y",
      // Gets the projected distance between two points.
      // o1/o2 ... if true, respective original position is used.
      distance: /* @__PURE__ */ __name(function(p1, p2, o1, o2) {
        return (o1 ? p1.yo : p1.y) - (o2 ? p2.yo : p2.y);
      }, "distance"),
      // Moves point p so the moved position has the same relative
      // position to the moved positions of rp1 and rp2 than the
      // original positions had.
      //
      // See APPENDIX on INTERPOLATE at the bottom of this file.
      interpolate: /* @__PURE__ */ __name(function(p, rp1, rp2, pv) {
        var do1;
        var do2;
        var doa1;
        var doa2;
        var dm1;
        var dm2;
        var dt2;
        if (!pv || pv === this) {
          do1 = p.yo - rp1.yo;
          do2 = p.yo - rp2.yo;
          dm1 = rp1.y - rp1.yo;
          dm2 = rp2.y - rp2.yo;
          doa1 = Math.abs(do1);
          doa2 = Math.abs(do2);
          dt2 = doa1 + doa2;
          if (dt2 === 0) {
            p.y = p.yo + (dm1 + dm2) / 2;
            return;
          }
          p.y = p.yo + (dm1 * doa2 + dm2 * doa1) / dt2;
          return;
        }
        do1 = pv.distance(p, rp1, true, true);
        do2 = pv.distance(p, rp2, true, true);
        dm1 = pv.distance(rp1, rp1, false, true);
        dm2 = pv.distance(rp2, rp2, false, true);
        doa1 = Math.abs(do1);
        doa2 = Math.abs(do2);
        dt2 = doa1 + doa2;
        if (dt2 === 0) {
          yUnitVector.setRelative(p, p, (dm1 + dm2) / 2, pv, true);
          return;
        }
        yUnitVector.setRelative(p, p, (dm1 * doa2 + dm2 * doa1) / dt2, pv, true);
      }, "interpolate"),
      // Slope of line normal to this.
      normalSlope: 0,
      // Sets the point 'p' relative to point 'rp'
      // by the distance 'd'
      //
      // See APPENDIX on SETRELATIVE at the bottom of this file.
      //
      // p   ... point to set
      // rp  ... reference point
      // d   ... distance on projection vector
      // pv  ... projection vector (undefined = this)
      // org ... if true, uses the original position of rp as reference.
      setRelative: /* @__PURE__ */ __name(function(p, rp, d, pv, org) {
        if (!pv || pv === this) {
          p.y = (org ? rp.yo : rp.y) + d;
          return;
        }
        var rpx = org ? rp.xo : rp.x;
        var rpy = org ? rp.yo : rp.y;
        var rpdx = rpx + d * pv.x;
        var rpdy = rpy + d * pv.y;
        p.y = rpdy + pv.normalSlope * (p.x - rpdx);
      }, "setRelative"),
      // Slope of vector line.
      slope: Number.POSITIVE_INFINITY,
      // Touches the point p.
      touch: /* @__PURE__ */ __name(function(p) {
        p.yTouched = true;
      }, "touch"),
      // Tests if a point p is touched.
      touched: /* @__PURE__ */ __name(function(p) {
        return p.yTouched;
      }, "touched"),
      // Untouches the point p.
      untouch: /* @__PURE__ */ __name(function(p) {
        p.yTouched = false;
      }, "untouch")
    };
    Object.freeze(xUnitVector);
    Object.freeze(yUnitVector);
    __name(UnitVector, "UnitVector");
    UnitVector.prototype.distance = function(p1, p2, o1, o2) {
      return this.x * xUnitVector.distance(p1, p2, o1, o2) + this.y * yUnitVector.distance(p1, p2, o1, o2);
    };
    UnitVector.prototype.interpolate = function(p, rp1, rp2, pv) {
      var dm1;
      var dm2;
      var do1;
      var do2;
      var doa1;
      var doa2;
      var dt2;
      do1 = pv.distance(p, rp1, true, true);
      do2 = pv.distance(p, rp2, true, true);
      dm1 = pv.distance(rp1, rp1, false, true);
      dm2 = pv.distance(rp2, rp2, false, true);
      doa1 = Math.abs(do1);
      doa2 = Math.abs(do2);
      dt2 = doa1 + doa2;
      if (dt2 === 0) {
        this.setRelative(p, p, (dm1 + dm2) / 2, pv, true);
        return;
      }
      this.setRelative(p, p, (dm1 * doa2 + dm2 * doa1) / dt2, pv, true);
    };
    UnitVector.prototype.setRelative = function(p, rp, d, pv, org) {
      pv = pv || this;
      var rpx = org ? rp.xo : rp.x;
      var rpy = org ? rp.yo : rp.y;
      var rpdx = rpx + d * pv.x;
      var rpdy = rpy + d * pv.y;
      var pvns = pv.normalSlope;
      var fvs = this.slope;
      var px = p.x;
      var py = p.y;
      p.x = (fvs * px - pvns * rpdx + rpdy - py) / (fvs - pvns);
      p.y = fvs * (p.x - px) + py;
    };
    UnitVector.prototype.touch = function(p) {
      p.xTouched = true;
      p.yTouched = true;
    };
    __name(getUnitVector, "getUnitVector");
    __name(HPoint, "HPoint");
    HPoint.prototype.nextTouched = function(v) {
      var p = this.nextPointOnContour;
      while (!v.touched(p) && p !== this) {
        p = p.nextPointOnContour;
      }
      return p;
    };
    HPoint.prototype.prevTouched = function(v) {
      var p = this.prevPointOnContour;
      while (!v.touched(p) && p !== this) {
        p = p.prevPointOnContour;
      }
      return p;
    };
    HPZero = Object.freeze(new HPoint(0, 0));
    defaultState = {
      cvCutIn: 17 / 16,
      // control value cut in
      deltaBase: 9,
      deltaShift: 0.125,
      loop: 1,
      // loops some instructions
      minDis: 1,
      // minimum distance
      autoFlip: true
    };
    __name(State, "State");
    Hinting.prototype.exec = function(glyph, ppem) {
      if (typeof ppem !== "number") {
        throw new Error("Point size is not a number!");
      }
      if (this._errorState > 2) {
        return;
      }
      var font = this.font;
      var prepState = this._prepState;
      if (!prepState || prepState.ppem !== ppem) {
        var fpgmState = this._fpgmState;
        if (!fpgmState) {
          State.prototype = defaultState;
          fpgmState = this._fpgmState = new State("fpgm", font.tables.fpgm);
          fpgmState.funcs = [];
          fpgmState.font = font;
          if (exports.DEBUG) {
            console.log("---EXEC FPGM---");
            fpgmState.step = -1;
          }
          try {
            exec(fpgmState);
          } catch (e) {
            console.log("Hinting error in FPGM:" + e);
            this._errorState = 3;
            return;
          }
        }
        State.prototype = fpgmState;
        prepState = this._prepState = new State("prep", font.tables.prep);
        prepState.ppem = ppem;
        var oCvt = font.tables.cvt;
        if (oCvt) {
          var cvt = prepState.cvt = new Array(oCvt.length);
          var scale = ppem / font.unitsPerEm;
          for (var c2 = 0; c2 < oCvt.length; c2++) {
            cvt[c2] = oCvt[c2] * scale;
          }
        } else {
          prepState.cvt = [];
        }
        if (exports.DEBUG) {
          console.log("---EXEC PREP---");
          prepState.step = -1;
        }
        try {
          exec(prepState);
        } catch (e) {
          if (this._errorState < 2) {
            console.log("Hinting error in PREP:" + e);
          }
          this._errorState = 2;
        }
      }
      if (this._errorState > 1) {
        return;
      }
      try {
        return execGlyph(glyph, prepState);
      } catch (e) {
        if (this._errorState < 1) {
          console.log("Hinting error:" + e);
          console.log("Note: further hinting errors are silenced");
        }
        this._errorState = 1;
        return void 0;
      }
    };
    execGlyph = /* @__PURE__ */ __name(function(glyph, prepState) {
      var xScale = prepState.ppem / prepState.font.unitsPerEm;
      var yScale = xScale;
      var components = glyph.components;
      var contours;
      var gZone;
      var state;
      State.prototype = prepState;
      if (!components) {
        state = new State("glyf", glyph.instructions);
        if (exports.DEBUG) {
          console.log("---EXEC GLYPH---");
          state.step = -1;
        }
        execComponent(glyph, state, xScale, yScale);
        gZone = state.gZone;
      } else {
        var font = prepState.font;
        gZone = [];
        contours = [];
        for (var i2 = 0; i2 < components.length; i2++) {
          var c2 = components[i2];
          var cg = font.glyphs.get(c2.glyphIndex);
          state = new State("glyf", cg.instructions);
          if (exports.DEBUG) {
            console.log("---EXEC COMP " + i2 + "---");
            state.step = -1;
          }
          execComponent(cg, state, xScale, yScale);
          var dx = Math.round(c2.dx * xScale);
          var dy = Math.round(c2.dy * yScale);
          var gz = state.gZone;
          var cc = state.contours;
          for (var pi = 0; pi < gz.length; pi++) {
            var p = gz[pi];
            p.xTouched = p.yTouched = false;
            p.xo = p.x = p.x + dx;
            p.yo = p.y = p.y + dy;
          }
          var gLen = gZone.length;
          gZone.push.apply(gZone, gz);
          for (var j2 = 0; j2 < cc.length; j2++) {
            contours.push(cc[j2] + gLen);
          }
        }
        if (glyph.instructions && !state.inhibitGridFit) {
          state = new State("glyf", glyph.instructions);
          state.gZone = state.z0 = state.z1 = state.z2 = gZone;
          state.contours = contours;
          gZone.push(
            new HPoint(0, 0),
            new HPoint(Math.round(glyph.advanceWidth * xScale), 0)
          );
          if (exports.DEBUG) {
            console.log("---EXEC COMPOSITE---");
            state.step = -1;
          }
          exec(state);
          gZone.length -= 2;
        }
      }
      return gZone;
    }, "execGlyph");
    execComponent = /* @__PURE__ */ __name(function(glyph, state, xScale, yScale) {
      var points = glyph.points || [];
      var pLen = points.length;
      var gZone = state.gZone = state.z0 = state.z1 = state.z2 = [];
      var contours = state.contours = [];
      var cp;
      for (var i2 = 0; i2 < pLen; i2++) {
        cp = points[i2];
        gZone[i2] = new HPoint(
          cp.x * xScale,
          cp.y * yScale,
          cp.lastPointOfContour,
          cp.onCurve
        );
      }
      var sp;
      var np;
      for (var i$1 = 0; i$1 < pLen; i$1++) {
        cp = gZone[i$1];
        if (!sp) {
          sp = cp;
          contours.push(i$1);
        }
        if (cp.lastPointOfContour) {
          cp.nextPointOnContour = sp;
          sp.prevPointOnContour = cp;
          sp = void 0;
        } else {
          np = gZone[i$1 + 1];
          cp.nextPointOnContour = np;
          np.prevPointOnContour = cp;
        }
      }
      if (state.inhibitGridFit) {
        return;
      }
      if (exports.DEBUG) {
        console.log("PROCESSING GLYPH", state.stack);
        for (var i$2 = 0; i$2 < pLen; i$2++) {
          console.log(i$2, gZone[i$2].x, gZone[i$2].y);
        }
      }
      gZone.push(
        new HPoint(0, 0),
        new HPoint(Math.round(glyph.advanceWidth * xScale), 0)
      );
      exec(state);
      gZone.length -= 2;
      if (exports.DEBUG) {
        console.log("FINISHED GLYPH", state.stack);
        for (var i$3 = 0; i$3 < pLen; i$3++) {
          console.log(i$3, gZone[i$3].x, gZone[i$3].y);
        }
      }
    }, "execComponent");
    exec = /* @__PURE__ */ __name(function(state) {
      var prog = state.prog;
      if (!prog) {
        return;
      }
      var pLen = prog.length;
      var ins;
      for (state.ip = 0; state.ip < pLen; state.ip++) {
        if (exports.DEBUG) {
          state.step++;
        }
        ins = instructionTable[prog[state.ip]];
        if (!ins) {
          throw new Error(
            "unknown instruction: 0x" + Number(prog[state.ip]).toString(16)
          );
        }
        ins(state);
      }
    }, "exec");
    __name(initTZone, "initTZone");
    __name(skip, "skip");
    __name(SVTCA, "SVTCA");
    __name(SPVTCA, "SPVTCA");
    __name(SFVTCA, "SFVTCA");
    __name(SPVTL, "SPVTL");
    __name(SFVTL, "SFVTL");
    __name(SPVFS, "SPVFS");
    __name(SFVFS, "SFVFS");
    __name(GPV, "GPV");
    __name(GFV, "GFV");
    __name(SFVTPV, "SFVTPV");
    __name(ISECT, "ISECT");
    __name(SRP0, "SRP0");
    __name(SRP1, "SRP1");
    __name(SRP2, "SRP2");
    __name(SZP0, "SZP0");
    __name(SZP1, "SZP1");
    __name(SZP2, "SZP2");
    __name(SZPS, "SZPS");
    __name(SLOOP, "SLOOP");
    __name(RTG, "RTG");
    __name(RTHG, "RTHG");
    __name(SMD, "SMD");
    __name(ELSE, "ELSE");
    __name(JMPR, "JMPR");
    __name(SCVTCI, "SCVTCI");
    __name(DUP, "DUP");
    __name(POP, "POP");
    __name(CLEAR, "CLEAR");
    __name(SWAP, "SWAP");
    __name(DEPTH, "DEPTH");
    __name(LOOPCALL, "LOOPCALL");
    __name(CALL, "CALL");
    __name(CINDEX, "CINDEX");
    __name(MINDEX, "MINDEX");
    __name(FDEF, "FDEF");
    __name(MDAP, "MDAP");
    __name(IUP, "IUP");
    __name(SHP, "SHP");
    __name(SHC, "SHC");
    __name(SHZ, "SHZ");
    __name(SHPIX, "SHPIX");
    __name(IP, "IP");
    __name(MSIRP, "MSIRP");
    __name(ALIGNRP, "ALIGNRP");
    __name(RTDG, "RTDG");
    __name(MIAP, "MIAP");
    __name(NPUSHB, "NPUSHB");
    __name(NPUSHW, "NPUSHW");
    __name(WS, "WS");
    __name(RS, "RS");
    __name(WCVTP, "WCVTP");
    __name(RCVT, "RCVT");
    __name(GC, "GC");
    __name(MD, "MD");
    __name(MPPEM, "MPPEM");
    __name(FLIPON, "FLIPON");
    __name(LT, "LT");
    __name(LTEQ, "LTEQ");
    __name(GT, "GT");
    __name(GTEQ, "GTEQ");
    __name(EQ, "EQ");
    __name(NEQ, "NEQ");
    __name(ODD, "ODD");
    __name(EVEN, "EVEN");
    __name(IF, "IF");
    __name(EIF, "EIF");
    __name(AND, "AND");
    __name(OR, "OR");
    __name(NOT, "NOT");
    __name(DELTAP123, "DELTAP123");
    __name(SDB, "SDB");
    __name(SDS, "SDS");
    __name(ADD, "ADD");
    __name(SUB, "SUB");
    __name(DIV, "DIV");
    __name(MUL, "MUL");
    __name(ABS, "ABS");
    __name(NEG, "NEG");
    __name(FLOOR, "FLOOR");
    __name(CEILING, "CEILING");
    __name(ROUND, "ROUND");
    __name(WCVTF, "WCVTF");
    __name(DELTAC123, "DELTAC123");
    __name(SROUND, "SROUND");
    __name(S45ROUND, "S45ROUND");
    __name(ROFF, "ROFF");
    __name(RUTG, "RUTG");
    __name(RDTG, "RDTG");
    __name(SCANCTRL, "SCANCTRL");
    __name(SDPVTL, "SDPVTL");
    __name(GETINFO, "GETINFO");
    __name(ROLL, "ROLL");
    __name(MAX, "MAX");
    __name(MIN, "MIN");
    __name(SCANTYPE, "SCANTYPE");
    __name(INSTCTRL, "INSTCTRL");
    __name(PUSHB, "PUSHB");
    __name(PUSHW, "PUSHW");
    __name(MDRP_MIRP, "MDRP_MIRP");
    instructionTable = [
      /* 0x00 */
      SVTCA.bind(void 0, yUnitVector),
      /* 0x01 */
      SVTCA.bind(void 0, xUnitVector),
      /* 0x02 */
      SPVTCA.bind(void 0, yUnitVector),
      /* 0x03 */
      SPVTCA.bind(void 0, xUnitVector),
      /* 0x04 */
      SFVTCA.bind(void 0, yUnitVector),
      /* 0x05 */
      SFVTCA.bind(void 0, xUnitVector),
      /* 0x06 */
      SPVTL.bind(void 0, 0),
      /* 0x07 */
      SPVTL.bind(void 0, 1),
      /* 0x08 */
      SFVTL.bind(void 0, 0),
      /* 0x09 */
      SFVTL.bind(void 0, 1),
      /* 0x0A */
      SPVFS,
      /* 0x0B */
      SFVFS,
      /* 0x0C */
      GPV,
      /* 0x0D */
      GFV,
      /* 0x0E */
      SFVTPV,
      /* 0x0F */
      ISECT,
      /* 0x10 */
      SRP0,
      /* 0x11 */
      SRP1,
      /* 0x12 */
      SRP2,
      /* 0x13 */
      SZP0,
      /* 0x14 */
      SZP1,
      /* 0x15 */
      SZP2,
      /* 0x16 */
      SZPS,
      /* 0x17 */
      SLOOP,
      /* 0x18 */
      RTG,
      /* 0x19 */
      RTHG,
      /* 0x1A */
      SMD,
      /* 0x1B */
      ELSE,
      /* 0x1C */
      JMPR,
      /* 0x1D */
      SCVTCI,
      /* 0x1E */
      void 0,
      // TODO SSWCI
      /* 0x1F */
      void 0,
      // TODO SSW
      /* 0x20 */
      DUP,
      /* 0x21 */
      POP,
      /* 0x22 */
      CLEAR,
      /* 0x23 */
      SWAP,
      /* 0x24 */
      DEPTH,
      /* 0x25 */
      CINDEX,
      /* 0x26 */
      MINDEX,
      /* 0x27 */
      void 0,
      // TODO ALIGNPTS
      /* 0x28 */
      void 0,
      /* 0x29 */
      void 0,
      // TODO UTP
      /* 0x2A */
      LOOPCALL,
      /* 0x2B */
      CALL,
      /* 0x2C */
      FDEF,
      /* 0x2D */
      void 0,
      // ENDF (eaten by FDEF)
      /* 0x2E */
      MDAP.bind(void 0, 0),
      /* 0x2F */
      MDAP.bind(void 0, 1),
      /* 0x30 */
      IUP.bind(void 0, yUnitVector),
      /* 0x31 */
      IUP.bind(void 0, xUnitVector),
      /* 0x32 */
      SHP.bind(void 0, 0),
      /* 0x33 */
      SHP.bind(void 0, 1),
      /* 0x34 */
      SHC.bind(void 0, 0),
      /* 0x35 */
      SHC.bind(void 0, 1),
      /* 0x36 */
      SHZ.bind(void 0, 0),
      /* 0x37 */
      SHZ.bind(void 0, 1),
      /* 0x38 */
      SHPIX,
      /* 0x39 */
      IP,
      /* 0x3A */
      MSIRP.bind(void 0, 0),
      /* 0x3B */
      MSIRP.bind(void 0, 1),
      /* 0x3C */
      ALIGNRP,
      /* 0x3D */
      RTDG,
      /* 0x3E */
      MIAP.bind(void 0, 0),
      /* 0x3F */
      MIAP.bind(void 0, 1),
      /* 0x40 */
      NPUSHB,
      /* 0x41 */
      NPUSHW,
      /* 0x42 */
      WS,
      /* 0x43 */
      RS,
      /* 0x44 */
      WCVTP,
      /* 0x45 */
      RCVT,
      /* 0x46 */
      GC.bind(void 0, 0),
      /* 0x47 */
      GC.bind(void 0, 1),
      /* 0x48 */
      void 0,
      // TODO SCFS
      /* 0x49 */
      MD.bind(void 0, 0),
      /* 0x4A */
      MD.bind(void 0, 1),
      /* 0x4B */
      MPPEM,
      /* 0x4C */
      void 0,
      // TODO MPS
      /* 0x4D */
      FLIPON,
      /* 0x4E */
      void 0,
      // TODO FLIPOFF
      /* 0x4F */
      void 0,
      // TODO DEBUG
      /* 0x50 */
      LT,
      /* 0x51 */
      LTEQ,
      /* 0x52 */
      GT,
      /* 0x53 */
      GTEQ,
      /* 0x54 */
      EQ,
      /* 0x55 */
      NEQ,
      /* 0x56 */
      ODD,
      /* 0x57 */
      EVEN,
      /* 0x58 */
      IF,
      /* 0x59 */
      EIF,
      /* 0x5A */
      AND,
      /* 0x5B */
      OR,
      /* 0x5C */
      NOT,
      /* 0x5D */
      DELTAP123.bind(void 0, 1),
      /* 0x5E */
      SDB,
      /* 0x5F */
      SDS,
      /* 0x60 */
      ADD,
      /* 0x61 */
      SUB,
      /* 0x62 */
      DIV,
      /* 0x63 */
      MUL,
      /* 0x64 */
      ABS,
      /* 0x65 */
      NEG,
      /* 0x66 */
      FLOOR,
      /* 0x67 */
      CEILING,
      /* 0x68 */
      ROUND.bind(void 0, 0),
      /* 0x69 */
      ROUND.bind(void 0, 1),
      /* 0x6A */
      ROUND.bind(void 0, 2),
      /* 0x6B */
      ROUND.bind(void 0, 3),
      /* 0x6C */
      void 0,
      // TODO NROUND[ab]
      /* 0x6D */
      void 0,
      // TODO NROUND[ab]
      /* 0x6E */
      void 0,
      // TODO NROUND[ab]
      /* 0x6F */
      void 0,
      // TODO NROUND[ab]
      /* 0x70 */
      WCVTF,
      /* 0x71 */
      DELTAP123.bind(void 0, 2),
      /* 0x72 */
      DELTAP123.bind(void 0, 3),
      /* 0x73 */
      DELTAC123.bind(void 0, 1),
      /* 0x74 */
      DELTAC123.bind(void 0, 2),
      /* 0x75 */
      DELTAC123.bind(void 0, 3),
      /* 0x76 */
      SROUND,
      /* 0x77 */
      S45ROUND,
      /* 0x78 */
      void 0,
      // TODO JROT[]
      /* 0x79 */
      void 0,
      // TODO JROF[]
      /* 0x7A */
      ROFF,
      /* 0x7B */
      void 0,
      /* 0x7C */
      RUTG,
      /* 0x7D */
      RDTG,
      /* 0x7E */
      POP,
      // actually SANGW, supposed to do only a pop though
      /* 0x7F */
      POP,
      // actually AA, supposed to do only a pop though
      /* 0x80 */
      void 0,
      // TODO FLIPPT
      /* 0x81 */
      void 0,
      // TODO FLIPRGON
      /* 0x82 */
      void 0,
      // TODO FLIPRGOFF
      /* 0x83 */
      void 0,
      /* 0x84 */
      void 0,
      /* 0x85 */
      SCANCTRL,
      /* 0x86 */
      SDPVTL.bind(void 0, 0),
      /* 0x87 */
      SDPVTL.bind(void 0, 1),
      /* 0x88 */
      GETINFO,
      /* 0x89 */
      void 0,
      // TODO IDEF
      /* 0x8A */
      ROLL,
      /* 0x8B */
      MAX,
      /* 0x8C */
      MIN,
      /* 0x8D */
      SCANTYPE,
      /* 0x8E */
      INSTCTRL,
      /* 0x8F */
      void 0,
      /* 0x90 */
      void 0,
      /* 0x91 */
      void 0,
      /* 0x92 */
      void 0,
      /* 0x93 */
      void 0,
      /* 0x94 */
      void 0,
      /* 0x95 */
      void 0,
      /* 0x96 */
      void 0,
      /* 0x97 */
      void 0,
      /* 0x98 */
      void 0,
      /* 0x99 */
      void 0,
      /* 0x9A */
      void 0,
      /* 0x9B */
      void 0,
      /* 0x9C */
      void 0,
      /* 0x9D */
      void 0,
      /* 0x9E */
      void 0,
      /* 0x9F */
      void 0,
      /* 0xA0 */
      void 0,
      /* 0xA1 */
      void 0,
      /* 0xA2 */
      void 0,
      /* 0xA3 */
      void 0,
      /* 0xA4 */
      void 0,
      /* 0xA5 */
      void 0,
      /* 0xA6 */
      void 0,
      /* 0xA7 */
      void 0,
      /* 0xA8 */
      void 0,
      /* 0xA9 */
      void 0,
      /* 0xAA */
      void 0,
      /* 0xAB */
      void 0,
      /* 0xAC */
      void 0,
      /* 0xAD */
      void 0,
      /* 0xAE */
      void 0,
      /* 0xAF */
      void 0,
      /* 0xB0 */
      PUSHB.bind(void 0, 1),
      /* 0xB1 */
      PUSHB.bind(void 0, 2),
      /* 0xB2 */
      PUSHB.bind(void 0, 3),
      /* 0xB3 */
      PUSHB.bind(void 0, 4),
      /* 0xB4 */
      PUSHB.bind(void 0, 5),
      /* 0xB5 */
      PUSHB.bind(void 0, 6),
      /* 0xB6 */
      PUSHB.bind(void 0, 7),
      /* 0xB7 */
      PUSHB.bind(void 0, 8),
      /* 0xB8 */
      PUSHW.bind(void 0, 1),
      /* 0xB9 */
      PUSHW.bind(void 0, 2),
      /* 0xBA */
      PUSHW.bind(void 0, 3),
      /* 0xBB */
      PUSHW.bind(void 0, 4),
      /* 0xBC */
      PUSHW.bind(void 0, 5),
      /* 0xBD */
      PUSHW.bind(void 0, 6),
      /* 0xBE */
      PUSHW.bind(void 0, 7),
      /* 0xBF */
      PUSHW.bind(void 0, 8),
      /* 0xC0 */
      MDRP_MIRP.bind(void 0, 0, 0, 0, 0, 0),
      /* 0xC1 */
      MDRP_MIRP.bind(void 0, 0, 0, 0, 0, 1),
      /* 0xC2 */
      MDRP_MIRP.bind(void 0, 0, 0, 0, 0, 2),
      /* 0xC3 */
      MDRP_MIRP.bind(void 0, 0, 0, 0, 0, 3),
      /* 0xC4 */
      MDRP_MIRP.bind(void 0, 0, 0, 0, 1, 0),
      /* 0xC5 */
      MDRP_MIRP.bind(void 0, 0, 0, 0, 1, 1),
      /* 0xC6 */
      MDRP_MIRP.bind(void 0, 0, 0, 0, 1, 2),
      /* 0xC7 */
      MDRP_MIRP.bind(void 0, 0, 0, 0, 1, 3),
      /* 0xC8 */
      MDRP_MIRP.bind(void 0, 0, 0, 1, 0, 0),
      /* 0xC9 */
      MDRP_MIRP.bind(void 0, 0, 0, 1, 0, 1),
      /* 0xCA */
      MDRP_MIRP.bind(void 0, 0, 0, 1, 0, 2),
      /* 0xCB */
      MDRP_MIRP.bind(void 0, 0, 0, 1, 0, 3),
      /* 0xCC */
      MDRP_MIRP.bind(void 0, 0, 0, 1, 1, 0),
      /* 0xCD */
      MDRP_MIRP.bind(void 0, 0, 0, 1, 1, 1),
      /* 0xCE */
      MDRP_MIRP.bind(void 0, 0, 0, 1, 1, 2),
      /* 0xCF */
      MDRP_MIRP.bind(void 0, 0, 0, 1, 1, 3),
      /* 0xD0 */
      MDRP_MIRP.bind(void 0, 0, 1, 0, 0, 0),
      /* 0xD1 */
      MDRP_MIRP.bind(void 0, 0, 1, 0, 0, 1),
      /* 0xD2 */
      MDRP_MIRP.bind(void 0, 0, 1, 0, 0, 2),
      /* 0xD3 */
      MDRP_MIRP.bind(void 0, 0, 1, 0, 0, 3),
      /* 0xD4 */
      MDRP_MIRP.bind(void 0, 0, 1, 0, 1, 0),
      /* 0xD5 */
      MDRP_MIRP.bind(void 0, 0, 1, 0, 1, 1),
      /* 0xD6 */
      MDRP_MIRP.bind(void 0, 0, 1, 0, 1, 2),
      /* 0xD7 */
      MDRP_MIRP.bind(void 0, 0, 1, 0, 1, 3),
      /* 0xD8 */
      MDRP_MIRP.bind(void 0, 0, 1, 1, 0, 0),
      /* 0xD9 */
      MDRP_MIRP.bind(void 0, 0, 1, 1, 0, 1),
      /* 0xDA */
      MDRP_MIRP.bind(void 0, 0, 1, 1, 0, 2),
      /* 0xDB */
      MDRP_MIRP.bind(void 0, 0, 1, 1, 0, 3),
      /* 0xDC */
      MDRP_MIRP.bind(void 0, 0, 1, 1, 1, 0),
      /* 0xDD */
      MDRP_MIRP.bind(void 0, 0, 1, 1, 1, 1),
      /* 0xDE */
      MDRP_MIRP.bind(void 0, 0, 1, 1, 1, 2),
      /* 0xDF */
      MDRP_MIRP.bind(void 0, 0, 1, 1, 1, 3),
      /* 0xE0 */
      MDRP_MIRP.bind(void 0, 1, 0, 0, 0, 0),
      /* 0xE1 */
      MDRP_MIRP.bind(void 0, 1, 0, 0, 0, 1),
      /* 0xE2 */
      MDRP_MIRP.bind(void 0, 1, 0, 0, 0, 2),
      /* 0xE3 */
      MDRP_MIRP.bind(void 0, 1, 0, 0, 0, 3),
      /* 0xE4 */
      MDRP_MIRP.bind(void 0, 1, 0, 0, 1, 0),
      /* 0xE5 */
      MDRP_MIRP.bind(void 0, 1, 0, 0, 1, 1),
      /* 0xE6 */
      MDRP_MIRP.bind(void 0, 1, 0, 0, 1, 2),
      /* 0xE7 */
      MDRP_MIRP.bind(void 0, 1, 0, 0, 1, 3),
      /* 0xE8 */
      MDRP_MIRP.bind(void 0, 1, 0, 1, 0, 0),
      /* 0xE9 */
      MDRP_MIRP.bind(void 0, 1, 0, 1, 0, 1),
      /* 0xEA */
      MDRP_MIRP.bind(void 0, 1, 0, 1, 0, 2),
      /* 0xEB */
      MDRP_MIRP.bind(void 0, 1, 0, 1, 0, 3),
      /* 0xEC */
      MDRP_MIRP.bind(void 0, 1, 0, 1, 1, 0),
      /* 0xED */
      MDRP_MIRP.bind(void 0, 1, 0, 1, 1, 1),
      /* 0xEE */
      MDRP_MIRP.bind(void 0, 1, 0, 1, 1, 2),
      /* 0xEF */
      MDRP_MIRP.bind(void 0, 1, 0, 1, 1, 3),
      /* 0xF0 */
      MDRP_MIRP.bind(void 0, 1, 1, 0, 0, 0),
      /* 0xF1 */
      MDRP_MIRP.bind(void 0, 1, 1, 0, 0, 1),
      /* 0xF2 */
      MDRP_MIRP.bind(void 0, 1, 1, 0, 0, 2),
      /* 0xF3 */
      MDRP_MIRP.bind(void 0, 1, 1, 0, 0, 3),
      /* 0xF4 */
      MDRP_MIRP.bind(void 0, 1, 1, 0, 1, 0),
      /* 0xF5 */
      MDRP_MIRP.bind(void 0, 1, 1, 0, 1, 1),
      /* 0xF6 */
      MDRP_MIRP.bind(void 0, 1, 1, 0, 1, 2),
      /* 0xF7 */
      MDRP_MIRP.bind(void 0, 1, 1, 0, 1, 3),
      /* 0xF8 */
      MDRP_MIRP.bind(void 0, 1, 1, 1, 0, 0),
      /* 0xF9 */
      MDRP_MIRP.bind(void 0, 1, 1, 1, 0, 1),
      /* 0xFA */
      MDRP_MIRP.bind(void 0, 1, 1, 1, 0, 2),
      /* 0xFB */
      MDRP_MIRP.bind(void 0, 1, 1, 1, 0, 3),
      /* 0xFC */
      MDRP_MIRP.bind(void 0, 1, 1, 1, 1, 0),
      /* 0xFD */
      MDRP_MIRP.bind(void 0, 1, 1, 1, 1, 1),
      /* 0xFE */
      MDRP_MIRP.bind(void 0, 1, 1, 1, 1, 2),
      /* 0xFF */
      MDRP_MIRP.bind(void 0, 1, 1, 1, 1, 3)
    ];
    __name(Token, "Token");
    __name(ContextRange, "ContextRange");
    __name(ContextChecker, "ContextChecker");
    __name(ContextParams, "ContextParams");
    __name(Event, "Event");
    __name(initializeCoreEvents, "initializeCoreEvents");
    __name(Tokenizer, "Tokenizer");
    Token.prototype.setState = function(key, value) {
      this.state[key] = value;
      this.activeState = { key, value: this.state[key] };
      return this.activeState;
    };
    Token.prototype.getState = function(stateId) {
      return this.state[stateId] || null;
    };
    Tokenizer.prototype.inboundIndex = function(index) {
      return index >= 0 && index < this.tokens.length;
    };
    Tokenizer.prototype.composeRUD = function(RUDs) {
      var this$1 = this;
      var silent = true;
      var state = RUDs.map(function(RUD) {
        return this$1[RUD[0]].apply(this$1, RUD.slice(1).concat(silent));
      });
      var hasFAILObject = /* @__PURE__ */ __name(function(obj) {
        return typeof obj === "object" && obj.hasOwnProperty("FAIL");
      }, "hasFAILObject");
      if (state.every(hasFAILObject)) {
        return {
          FAIL: "composeRUD: one or more operations hasn't completed successfully",
          report: state.filter(hasFAILObject)
        };
      }
      this.dispatch("composeRUD", [state.filter(function(op) {
        return !hasFAILObject(op);
      })]);
    };
    Tokenizer.prototype.replaceRange = function(startIndex, offset, tokens, silent) {
      offset = offset !== null ? offset : this.tokens.length;
      var isTokenType = tokens.every(function(token) {
        return token instanceof Token;
      });
      if (!isNaN(startIndex) && this.inboundIndex(startIndex) && isTokenType) {
        var replaced = this.tokens.splice.apply(
          this.tokens,
          [startIndex, offset].concat(tokens)
        );
        if (!silent) {
          this.dispatch("replaceToken", [startIndex, offset, tokens]);
        }
        return [replaced, tokens];
      } else {
        return { FAIL: "replaceRange: invalid tokens or startIndex." };
      }
    };
    Tokenizer.prototype.replaceToken = function(index, token, silent) {
      if (!isNaN(index) && this.inboundIndex(index) && token instanceof Token) {
        var replaced = this.tokens.splice(index, 1, token);
        if (!silent) {
          this.dispatch("replaceToken", [index, token]);
        }
        return [replaced[0], token];
      } else {
        return { FAIL: "replaceToken: invalid token or index." };
      }
    };
    Tokenizer.prototype.removeRange = function(startIndex, offset, silent) {
      offset = !isNaN(offset) ? offset : this.tokens.length;
      var tokens = this.tokens.splice(startIndex, offset);
      if (!silent) {
        this.dispatch("removeRange", [tokens, startIndex, offset]);
      }
      return tokens;
    };
    Tokenizer.prototype.removeToken = function(index, silent) {
      if (!isNaN(index) && this.inboundIndex(index)) {
        var token = this.tokens.splice(index, 1);
        if (!silent) {
          this.dispatch("removeToken", [token, index]);
        }
        return token;
      } else {
        return { FAIL: "removeToken: invalid token index." };
      }
    };
    Tokenizer.prototype.insertToken = function(tokens, index, silent) {
      var tokenType = tokens.every(
        function(token) {
          return token instanceof Token;
        }
      );
      if (tokenType) {
        this.tokens.splice.apply(
          this.tokens,
          [index, 0].concat(tokens)
        );
        if (!silent) {
          this.dispatch("insertToken", [tokens, index]);
        }
        return tokens;
      } else {
        return { FAIL: "insertToken: invalid token(s)." };
      }
    };
    Tokenizer.prototype.registerModifier = function(modifierId, condition, modifier) {
      this.events.newToken.subscribe(function(token, contextParams) {
        var conditionParams = [token, contextParams];
        var canApplyModifier = condition === null || condition.apply(this, conditionParams) === true;
        var modifierParams = [token, contextParams];
        if (canApplyModifier) {
          var newStateValue = modifier.apply(this, modifierParams);
          token.setState(modifierId, newStateValue);
        }
      });
      this.registeredModifiers.push(modifierId);
    };
    Event.prototype.subscribe = function(eventHandler) {
      if (typeof eventHandler === "function") {
        return this.subscribers.push(eventHandler) - 1;
      } else {
        return { FAIL: "invalid '" + this.eventId + "' event handler" };
      }
    };
    Event.prototype.unsubscribe = function(subsId) {
      this.subscribers.splice(subsId, 1);
    };
    ContextParams.prototype.setCurrentIndex = function(index) {
      this.index = index;
      this.current = this.context[index];
      this.backtrack = this.context.slice(0, index);
      this.lookahead = this.context.slice(index + 1);
    };
    ContextParams.prototype.get = function(offset) {
      switch (true) {
        case offset === 0:
          return this.current;
        case (offset < 0 && Math.abs(offset) <= this.backtrack.length):
          return this.backtrack.slice(offset)[0];
        case (offset > 0 && offset <= this.lookahead.length):
          return this.lookahead[offset - 1];
        default:
          return null;
      }
    };
    Tokenizer.prototype.rangeToText = function(range) {
      if (range instanceof ContextRange) {
        return this.getRangeTokens(range).map(function(token) {
          return token.char;
        }).join("");
      }
    };
    Tokenizer.prototype.getText = function() {
      return this.tokens.map(function(token) {
        return token.char;
      }).join("");
    };
    Tokenizer.prototype.getContext = function(contextName) {
      var context = this.registeredContexts[contextName];
      return !!context ? context : null;
    };
    Tokenizer.prototype.on = function(eventName, eventHandler) {
      var event = this.events[eventName];
      if (!!event) {
        return event.subscribe(eventHandler);
      } else {
        return null;
      }
    };
    Tokenizer.prototype.dispatch = function(eventName, args) {
      var this$1 = this;
      var event = this.events[eventName];
      if (event instanceof Event) {
        event.subscribers.forEach(function(subscriber) {
          subscriber.apply(this$1, args || []);
        });
      }
    };
    Tokenizer.prototype.registerContextChecker = function(contextName, contextStartCheck, contextEndCheck) {
      if (!!this.getContext(contextName)) {
        return {
          FAIL: "context name '" + contextName + "' is already registered."
        };
      }
      if (typeof contextStartCheck !== "function") {
        return {
          FAIL: "missing context start check."
        };
      }
      if (typeof contextEndCheck !== "function") {
        return {
          FAIL: "missing context end check."
        };
      }
      var contextCheckers = new ContextChecker(
        contextName,
        contextStartCheck,
        contextEndCheck
      );
      this.registeredContexts[contextName] = contextCheckers;
      this.contextCheckers.push(contextCheckers);
      return contextCheckers;
    };
    Tokenizer.prototype.getRangeTokens = function(range) {
      var endIndex = range.startIndex + range.endOffset;
      return [].concat(
        this.tokens.slice(range.startIndex, endIndex)
      );
    };
    Tokenizer.prototype.getContextRanges = function(contextName) {
      var context = this.getContext(contextName);
      if (!!context) {
        return context.ranges;
      } else {
        return { FAIL: "context checker '" + contextName + "' is not registered." };
      }
    };
    Tokenizer.prototype.resetContextsRanges = function() {
      var registeredContexts = this.registeredContexts;
      for (var contextName in registeredContexts) {
        if (registeredContexts.hasOwnProperty(contextName)) {
          var context = registeredContexts[contextName];
          context.ranges = [];
        }
      }
    };
    Tokenizer.prototype.updateContextsRanges = function() {
      this.resetContextsRanges();
      var chars = this.tokens.map(function(token) {
        return token.char;
      });
      for (var i2 = 0; i2 < chars.length; i2++) {
        var contextParams = new ContextParams(chars, i2);
        this.runContextCheck(contextParams);
      }
      this.dispatch("updateContextsRanges", [this.registeredContexts]);
    };
    Tokenizer.prototype.setEndOffset = function(offset, contextName) {
      var startIndex = this.getContext(contextName).openRange.startIndex;
      var range = new ContextRange(startIndex, offset, contextName);
      var ranges = this.getContext(contextName).ranges;
      range.rangeId = contextName + "." + ranges.length;
      ranges.push(range);
      this.getContext(contextName).openRange = null;
      return range;
    };
    Tokenizer.prototype.runContextCheck = function(contextParams) {
      var this$1 = this;
      var index = contextParams.index;
      this.contextCheckers.forEach(function(contextChecker) {
        var contextName = contextChecker.contextName;
        var openRange = this$1.getContext(contextName).openRange;
        if (!openRange && contextChecker.checkStart(contextParams)) {
          openRange = new ContextRange(index, null, contextName);
          this$1.getContext(contextName).openRange = openRange;
          this$1.dispatch("contextStart", [contextName, index]);
        }
        if (!!openRange && contextChecker.checkEnd(contextParams)) {
          var offset = index - openRange.startIndex + 1;
          var range = this$1.setEndOffset(offset, contextName);
          this$1.dispatch("contextEnd", [contextName, range]);
        }
      });
    };
    Tokenizer.prototype.tokenize = function(text) {
      this.tokens = [];
      this.resetContextsRanges();
      var chars = Array.from(text);
      this.dispatch("start");
      for (var i2 = 0; i2 < chars.length; i2++) {
        var char = chars[i2];
        var contextParams = new ContextParams(chars, i2);
        this.dispatch("next", [contextParams]);
        this.runContextCheck(contextParams);
        var token = new Token(char);
        this.tokens.push(token);
        this.dispatch("newToken", [token, contextParams]);
      }
      this.dispatch("end", [this.tokens]);
      return this.tokens;
    };
    __name(isArabicChar, "isArabicChar");
    __name(isIsolatedArabicChar, "isIsolatedArabicChar");
    __name(isTashkeelArabicChar, "isTashkeelArabicChar");
    __name(isLatinChar, "isLatinChar");
    __name(isWhiteSpace, "isWhiteSpace");
    __name(FeatureQuery, "FeatureQuery");
    __name(SubstitutionAction, "SubstitutionAction");
    __name(lookupCoverage, "lookupCoverage");
    __name(singleSubstitutionFormat1, "singleSubstitutionFormat1");
    __name(singleSubstitutionFormat2, "singleSubstitutionFormat2");
    __name(lookupCoverageList, "lookupCoverageList");
    __name(chainingSubstitutionFormat3, "chainingSubstitutionFormat3");
    __name(ligatureSubstitutionFormat1, "ligatureSubstitutionFormat1");
    __name(decompositionSubstitutionFormat1, "decompositionSubstitutionFormat1");
    FeatureQuery.prototype.getDefaultScriptFeaturesIndexes = function() {
      var scripts = this.font.tables.gsub.scripts;
      for (var s = 0; s < scripts.length; s++) {
        var script = scripts[s];
        if (script.tag === "DFLT") {
          return script.script.defaultLangSys.featureIndexes;
        }
      }
      return [];
    };
    FeatureQuery.prototype.getScriptFeaturesIndexes = function(scriptTag) {
      var tables = this.font.tables;
      if (!tables.gsub) {
        return [];
      }
      if (!scriptTag) {
        return this.getDefaultScriptFeaturesIndexes();
      }
      var scripts = this.font.tables.gsub.scripts;
      for (var i2 = 0; i2 < scripts.length; i2++) {
        var script = scripts[i2];
        if (script.tag === scriptTag && script.script.defaultLangSys) {
          return script.script.defaultLangSys.featureIndexes;
        } else {
          var langSysRecords = script.langSysRecords;
          if (!!langSysRecords) {
            for (var j2 = 0; j2 < langSysRecords.length; j2++) {
              var langSysRecord = langSysRecords[j2];
              if (langSysRecord.tag === scriptTag) {
                var langSys = langSysRecord.langSys;
                return langSys.featureIndexes;
              }
            }
          }
        }
      }
      return this.getDefaultScriptFeaturesIndexes();
    };
    FeatureQuery.prototype.mapTagsToFeatures = function(features, scriptTag) {
      var tags = {};
      for (var i2 = 0; i2 < features.length; i2++) {
        var tag = features[i2].tag;
        var feature = features[i2].feature;
        tags[tag] = feature;
      }
      this.features[scriptTag].tags = tags;
    };
    FeatureQuery.prototype.getScriptFeatures = function(scriptTag) {
      var features = this.features[scriptTag];
      if (this.features.hasOwnProperty(scriptTag)) {
        return features;
      }
      var featuresIndexes = this.getScriptFeaturesIndexes(scriptTag);
      if (!featuresIndexes) {
        return null;
      }
      var gsub2 = this.font.tables.gsub;
      features = featuresIndexes.map(function(index) {
        return gsub2.features[index];
      });
      this.features[scriptTag] = features;
      this.mapTagsToFeatures(features, scriptTag);
      return features;
    };
    FeatureQuery.prototype.getSubstitutionType = function(lookupTable, subtable) {
      var lookupType = lookupTable.lookupType.toString();
      var substFormat = subtable.substFormat.toString();
      return lookupType + substFormat;
    };
    FeatureQuery.prototype.getLookupMethod = function(lookupTable, subtable) {
      var this$1 = this;
      var substitutionType = this.getSubstitutionType(lookupTable, subtable);
      switch (substitutionType) {
        case "11":
          return function(glyphIndex) {
            return singleSubstitutionFormat1.apply(
              this$1,
              [glyphIndex, subtable]
            );
          };
        case "12":
          return function(glyphIndex) {
            return singleSubstitutionFormat2.apply(
              this$1,
              [glyphIndex, subtable]
            );
          };
        case "63":
          return function(contextParams) {
            return chainingSubstitutionFormat3.apply(
              this$1,
              [contextParams, subtable]
            );
          };
        case "41":
          return function(contextParams) {
            return ligatureSubstitutionFormat1.apply(
              this$1,
              [contextParams, subtable]
            );
          };
        case "21":
          return function(glyphIndex) {
            return decompositionSubstitutionFormat1.apply(
              this$1,
              [glyphIndex, subtable]
            );
          };
        default:
          throw new Error(
            "lookupType: " + lookupTable.lookupType + " - substFormat: " + subtable.substFormat + " is not yet supported"
          );
      }
    };
    FeatureQuery.prototype.lookupFeature = function(query) {
      var contextParams = query.contextParams;
      var currentIndex = contextParams.index;
      var feature = this.getFeature({
        tag: query.tag,
        script: query.script
      });
      if (!feature) {
        return new Error(
          "font '" + this.font.names.fullName.en + "' doesn't support feature '" + query.tag + "' for script '" + query.script + "'."
        );
      }
      var lookups = this.getFeatureLookups(feature);
      var substitutions = [].concat(contextParams.context);
      for (var l = 0; l < lookups.length; l++) {
        var lookupTable = lookups[l];
        var subtables = this.getLookupSubtables(lookupTable);
        for (var s = 0; s < subtables.length; s++) {
          var subtable = subtables[s];
          var substType = this.getSubstitutionType(lookupTable, subtable);
          var lookup = this.getLookupMethod(lookupTable, subtable);
          var substitution = void 0;
          switch (substType) {
            case "11":
              substitution = lookup(contextParams.current);
              if (substitution) {
                substitutions.splice(currentIndex, 1, new SubstitutionAction({
                  id: 11,
                  tag: query.tag,
                  substitution
                }));
              }
              break;
            case "12":
              substitution = lookup(contextParams.current);
              if (substitution) {
                substitutions.splice(currentIndex, 1, new SubstitutionAction({
                  id: 12,
                  tag: query.tag,
                  substitution
                }));
              }
              break;
            case "63":
              substitution = lookup(contextParams);
              if (Array.isArray(substitution) && substitution.length) {
                substitutions.splice(currentIndex, 1, new SubstitutionAction({
                  id: 63,
                  tag: query.tag,
                  substitution
                }));
              }
              break;
            case "41":
              substitution = lookup(contextParams);
              if (substitution) {
                substitutions.splice(currentIndex, 1, new SubstitutionAction({
                  id: 41,
                  tag: query.tag,
                  substitution
                }));
              }
              break;
            case "21":
              substitution = lookup(contextParams.current);
              if (substitution) {
                substitutions.splice(currentIndex, 1, new SubstitutionAction({
                  id: 21,
                  tag: query.tag,
                  substitution
                }));
              }
              break;
          }
          contextParams = new ContextParams(substitutions, currentIndex);
          if (Array.isArray(substitution) && !substitution.length) {
            continue;
          }
          substitution = null;
        }
      }
      return substitutions.length ? substitutions : null;
    };
    FeatureQuery.prototype.supports = function(query) {
      if (!query.script) {
        return false;
      }
      this.getScriptFeatures(query.script);
      var supportedScript = this.features.hasOwnProperty(query.script);
      if (!query.tag) {
        return supportedScript;
      }
      var supportedFeature = this.features[query.script].some(function(feature) {
        return feature.tag === query.tag;
      });
      return supportedScript && supportedFeature;
    };
    FeatureQuery.prototype.getLookupSubtables = function(lookupTable) {
      return lookupTable.subtables || null;
    };
    FeatureQuery.prototype.getLookupByIndex = function(index) {
      var lookups = this.font.tables.gsub.lookups;
      return lookups[index] || null;
    };
    FeatureQuery.prototype.getFeatureLookups = function(feature) {
      return feature.lookupListIndexes.map(this.getLookupByIndex.bind(this));
    };
    FeatureQuery.prototype.getFeature = /* @__PURE__ */ __name(function getFeature(query) {
      if (!this.font) {
        return { FAIL: "No font was found" };
      }
      if (!this.features.hasOwnProperty(query.script)) {
        this.getScriptFeatures(query.script);
      }
      var scriptFeatures = this.features[query.script];
      if (!scriptFeatures) {
        return { FAIL: "No feature for script " + query.script };
      }
      if (!scriptFeatures.tags[query.tag]) {
        return null;
      }
      return this.features[query.script].tags[query.tag];
    }, "getFeature");
    __name(arabicWordStartCheck, "arabicWordStartCheck");
    __name(arabicWordEndCheck, "arabicWordEndCheck");
    arabicWordCheck = {
      startCheck: arabicWordStartCheck,
      endCheck: arabicWordEndCheck
    };
    __name(arabicSentenceStartCheck, "arabicSentenceStartCheck");
    __name(arabicSentenceEndCheck, "arabicSentenceEndCheck");
    arabicSentenceCheck = {
      startCheck: arabicSentenceStartCheck,
      endCheck: arabicSentenceEndCheck
    };
    __name(singleSubstitutionFormat1$1, "singleSubstitutionFormat1$1");
    __name(singleSubstitutionFormat2$1, "singleSubstitutionFormat2$1");
    __name(chainingSubstitutionFormat3$1, "chainingSubstitutionFormat3$1");
    __name(ligatureSubstitutionFormat1$1, "ligatureSubstitutionFormat1$1");
    SUBSTITUTIONS = {
      11: singleSubstitutionFormat1$1,
      12: singleSubstitutionFormat2$1,
      63: chainingSubstitutionFormat3$1,
      41: ligatureSubstitutionFormat1$1
    };
    __name(applySubstitution, "applySubstitution");
    __name(willConnectPrev, "willConnectPrev");
    __name(willConnectNext, "willConnectNext");
    __name(arabicPresentationForms, "arabicPresentationForms");
    __name(getContextParams, "getContextParams");
    __name(arabicRequiredLigatures, "arabicRequiredLigatures");
    __name(latinWordStartCheck, "latinWordStartCheck");
    __name(latinWordEndCheck, "latinWordEndCheck");
    latinWordCheck = {
      startCheck: latinWordStartCheck,
      endCheck: latinWordEndCheck
    };
    __name(getContextParams$1, "getContextParams$1");
    __name(latinLigature, "latinLigature");
    __name(Bidi, "Bidi");
    Bidi.prototype.setText = function(text) {
      this.text = text;
    };
    Bidi.prototype.contextChecks = {
      latinWordCheck,
      arabicWordCheck,
      arabicSentenceCheck
    };
    __name(registerContextChecker, "registerContextChecker");
    __name(tokenizeText, "tokenizeText");
    __name(reverseArabicSentences, "reverseArabicSentences");
    Bidi.prototype.registerFeatures = function(script, tags) {
      var this$1 = this;
      var supportedTags = tags.filter(
        function(tag) {
          return this$1.query.supports({ script, tag });
        }
      );
      if (!this.featuresTags.hasOwnProperty(script)) {
        this.featuresTags[script] = supportedTags;
      } else {
        this.featuresTags[script] = this.featuresTags[script].concat(supportedTags);
      }
    };
    Bidi.prototype.applyFeatures = function(font, features) {
      if (!font) {
        throw new Error(
          "No valid font was provided to apply features"
        );
      }
      if (!this.query) {
        this.query = new FeatureQuery(font);
      }
      for (var f = 0; f < features.length; f++) {
        var feature = features[f];
        if (!this.query.supports({ script: feature.script })) {
          continue;
        }
        this.registerFeatures(feature.script, feature.tags);
      }
    };
    Bidi.prototype.registerModifier = function(modifierId, condition, modifier) {
      this.tokenizer.registerModifier(modifierId, condition, modifier);
    };
    __name(checkGlyphIndexStatus, "checkGlyphIndexStatus");
    __name(applyArabicPresentationForms, "applyArabicPresentationForms");
    __name(applyArabicRequireLigatures, "applyArabicRequireLigatures");
    __name(applyLatinLigatures, "applyLatinLigatures");
    Bidi.prototype.checkContextReady = function(contextId) {
      return !!this.tokenizer.getContext(contextId);
    };
    Bidi.prototype.applyFeaturesToContexts = function() {
      if (this.checkContextReady("arabicWord")) {
        applyArabicPresentationForms.call(this);
        applyArabicRequireLigatures.call(this);
      }
      if (this.checkContextReady("latinWord")) {
        applyLatinLigatures.call(this);
      }
      if (this.checkContextReady("arabicSentence")) {
        reverseArabicSentences.call(this);
      }
    };
    Bidi.prototype.processText = function(text) {
      if (!this.text || this.text !== text) {
        this.setText(text);
        tokenizeText.call(this);
        this.applyFeaturesToContexts();
      }
    };
    Bidi.prototype.getBidiText = function(text) {
      this.processText(text);
      return this.tokenizer.getText();
    };
    Bidi.prototype.getTextGlyphs = function(text) {
      this.processText(text);
      var indexes = [];
      for (var i2 = 0; i2 < this.tokenizer.tokens.length; i2++) {
        var token = this.tokenizer.tokens[i2];
        if (token.state.deleted) {
          continue;
        }
        var index = token.activeState.value;
        indexes.push(Array.isArray(index) ? index[0] : index);
      }
      return indexes;
    };
    __name(Font, "Font");
    Font.prototype.hasChar = function(c2) {
      return this.encoding.charToGlyphIndex(c2) !== null;
    };
    Font.prototype.charToGlyphIndex = function(s) {
      return this.encoding.charToGlyphIndex(s);
    };
    Font.prototype.charToGlyph = function(c2) {
      var glyphIndex = this.charToGlyphIndex(c2);
      var glyph = this.glyphs.get(glyphIndex);
      if (!glyph) {
        glyph = this.glyphs.get(0);
      }
      return glyph;
    };
    Font.prototype.updateFeatures = function(options) {
      return this.defaultRenderOptions.features.map(function(feature) {
        if (feature.script === "latn") {
          return {
            script: "latn",
            tags: feature.tags.filter(function(tag) {
              return options[tag];
            })
          };
        } else {
          return feature;
        }
      });
    };
    Font.prototype.stringToGlyphs = function(s, options) {
      var this$1 = this;
      var bidi = new Bidi();
      var charToGlyphIndexMod = /* @__PURE__ */ __name(function(token) {
        return this$1.charToGlyphIndex(token.char);
      }, "charToGlyphIndexMod");
      bidi.registerModifier("glyphIndex", null, charToGlyphIndexMod);
      var features = options ? this.updateFeatures(options.features) : this.defaultRenderOptions.features;
      bidi.applyFeatures(this, features);
      var indexes = bidi.getTextGlyphs(s);
      var length = indexes.length;
      var glyphs = new Array(length);
      var notdef = this.glyphs.get(0);
      for (var i2 = 0; i2 < length; i2 += 1) {
        glyphs[i2] = this.glyphs.get(indexes[i2]) || notdef;
      }
      return glyphs;
    };
    Font.prototype.getKerningValue = function(leftGlyph, rightGlyph) {
      leftGlyph = leftGlyph.index || leftGlyph;
      rightGlyph = rightGlyph.index || rightGlyph;
      var gposKerning = this.position.defaultKerningTables;
      if (gposKerning) {
        return this.position.getKerningValue(
          gposKerning,
          leftGlyph,
          rightGlyph
        );
      }
      return this.kerningPairs[leftGlyph + "," + rightGlyph] || 0;
    };
    Font.prototype.defaultRenderOptions = {
      kerning: true,
      features: [
        /**
         * these 4 features are required to render Arabic text properly
         * and shouldn't be turned off when rendering arabic text.
         */
        { script: "arab", tags: ["init", "medi", "fina", "rlig"] },
        { script: "latn", tags: ["liga", "rlig"] }
      ]
    };
    Font.prototype.forEachGlyph = function(text, x2, y, fontSize, options, callback) {
      x2 = x2 !== void 0 ? x2 : 0;
      y = y !== void 0 ? y : 0;
      fontSize = fontSize !== void 0 ? fontSize : 72;
      options = Object.assign({}, this.defaultRenderOptions, options);
      var fontScale = 1 / this.unitsPerEm * fontSize;
      var glyphs = this.stringToGlyphs(text, options);
      var kerningLookups;
      if (options.kerning) {
        var script = options.script || this.position.getDefaultScriptName();
        kerningLookups = this.position.getKerningTables(
          script,
          options.language
        );
      }
      for (var i2 = 0; i2 < glyphs.length; i2 += 1) {
        var glyph = glyphs[i2];
        callback.call(this, glyph, x2, y, fontSize, options);
        if (glyph.advanceWidth) {
          x2 += glyph.advanceWidth * fontScale;
        }
        if (options.kerning && i2 < glyphs.length - 1) {
          var kerningValue = kerningLookups ? this.position.getKerningValue(
            kerningLookups,
            glyph.index,
            glyphs[i2 + 1].index
          ) : this.getKerningValue(glyph, glyphs[i2 + 1]);
          x2 += kerningValue * fontScale;
        }
        if (options.letterSpacing) {
          x2 += options.letterSpacing * fontSize;
        } else if (options.tracking) {
          x2 += options.tracking / 1e3 * fontSize;
        }
      }
      return x2;
    };
    Font.prototype.getPath = function(text, x2, y, fontSize, options) {
      var fullPath = new Path();
      this.forEachGlyph(
        text,
        x2,
        y,
        fontSize,
        options,
        function(glyph, gX, gY, gFontSize) {
          var glyphPath = glyph.getPath(gX, gY, gFontSize, options, this);
          fullPath.extend(glyphPath);
        }
      );
      return fullPath;
    };
    Font.prototype.getPaths = function(text, x2, y, fontSize, options) {
      var glyphPaths = [];
      this.forEachGlyph(
        text,
        x2,
        y,
        fontSize,
        options,
        function(glyph, gX, gY, gFontSize) {
          var glyphPath = glyph.getPath(gX, gY, gFontSize, options, this);
          glyphPaths.push(glyphPath);
        }
      );
      return glyphPaths;
    };
    Font.prototype.getAdvanceWidth = function(text, fontSize, options) {
      return this.forEachGlyph(text, 0, 0, fontSize, options, function() {
      });
    };
    Font.prototype.fsSelectionValues = {
      ITALIC: 1,
      //1
      UNDERSCORE: 2,
      //2
      NEGATIVE: 4,
      //4
      OUTLINED: 8,
      //8
      STRIKEOUT: 16,
      //16
      BOLD: 32,
      //32
      REGULAR: 64,
      //64
      USER_TYPO_METRICS: 128,
      //128
      WWS: 256,
      //256
      OBLIQUE: 512
      //512
    };
    Font.prototype.usWidthClasses = {
      ULTRA_CONDENSED: 1,
      EXTRA_CONDENSED: 2,
      CONDENSED: 3,
      SEMI_CONDENSED: 4,
      MEDIUM: 5,
      SEMI_EXPANDED: 6,
      EXPANDED: 7,
      EXTRA_EXPANDED: 8,
      ULTRA_EXPANDED: 9
    };
    Font.prototype.usWeightClasses = {
      THIN: 100,
      EXTRA_LIGHT: 200,
      LIGHT: 300,
      NORMAL: 400,
      MEDIUM: 500,
      SEMI_BOLD: 600,
      BOLD: 700,
      EXTRA_BOLD: 800,
      BLACK: 900
    };
    __name(parseCmapTableFormat12, "parseCmapTableFormat12");
    __name(parseCmapTableFormat4, "parseCmapTableFormat4");
    __name(parseCmapTable, "parseCmapTable");
    cmap = { parse: parseCmapTable };
    __name(calcCFFSubroutineBias, "calcCFFSubroutineBias");
    __name(parseCFFIndex, "parseCFFIndex");
    __name(parseCFFIndexLowMemory, "parseCFFIndexLowMemory");
    __name(getCffIndexObject, "getCffIndexObject");
    __name(parseFloatOperand, "parseFloatOperand");
    __name(parseOperand, "parseOperand");
    __name(entriesToObject, "entriesToObject");
    __name(parseCFFDict, "parseCFFDict");
    __name(getCFFString, "getCFFString");
    __name(interpretDict, "interpretDict");
    __name(parseCFFHeader, "parseCFFHeader");
    TOP_DICT_META = [
      { name: "version", op: 0, type: "SID" },
      { name: "notice", op: 1, type: "SID" },
      { name: "copyright", op: 1200, type: "SID" },
      { name: "fullName", op: 2, type: "SID" },
      { name: "familyName", op: 3, type: "SID" },
      { name: "weight", op: 4, type: "SID" },
      { name: "isFixedPitch", op: 1201, type: "number", value: 0 },
      { name: "italicAngle", op: 1202, type: "number", value: 0 },
      { name: "underlinePosition", op: 1203, type: "number", value: -100 },
      { name: "underlineThickness", op: 1204, type: "number", value: 50 },
      { name: "paintType", op: 1205, type: "number", value: 0 },
      { name: "charstringType", op: 1206, type: "number", value: 2 },
      {
        name: "fontMatrix",
        op: 1207,
        type: ["real", "real", "real", "real", "real", "real"],
        value: [1e-3, 0, 0, 1e-3, 0, 0]
      },
      { name: "uniqueId", op: 13, type: "number" },
      {
        name: "fontBBox",
        op: 5,
        type: ["number", "number", "number", "number"],
        value: [0, 0, 0, 0]
      },
      { name: "strokeWidth", op: 1208, type: "number", value: 0 },
      { name: "xuid", op: 14, type: [], value: null },
      { name: "charset", op: 15, type: "offset", value: 0 },
      { name: "encoding", op: 16, type: "offset", value: 0 },
      { name: "charStrings", op: 17, type: "offset", value: 0 },
      { name: "private", op: 18, type: ["number", "offset"], value: [0, 0] },
      { name: "ros", op: 1230, type: ["SID", "SID", "number"] },
      { name: "cidFontVersion", op: 1231, type: "number", value: 0 },
      { name: "cidFontRevision", op: 1232, type: "number", value: 0 },
      { name: "cidFontType", op: 1233, type: "number", value: 0 },
      { name: "cidCount", op: 1234, type: "number", value: 8720 },
      { name: "uidBase", op: 1235, type: "number" },
      { name: "fdArray", op: 1236, type: "offset" },
      { name: "fdSelect", op: 1237, type: "offset" },
      { name: "fontName", op: 1238, type: "SID" }
    ];
    PRIVATE_DICT_META = [
      { name: "subrs", op: 19, type: "offset", value: 0 },
      { name: "defaultWidthX", op: 20, type: "number", value: 0 },
      { name: "nominalWidthX", op: 21, type: "number", value: 0 }
    ];
    __name(parseCFFTopDict, "parseCFFTopDict");
    __name(parseCFFPrivateDict, "parseCFFPrivateDict");
    __name(gatherCFFTopDicts, "gatherCFFTopDicts");
    __name(parseCFFCharset, "parseCFFCharset");
    __name(parseCFFEncoding, "parseCFFEncoding");
    __name(parseCFFCharstring, "parseCFFCharstring");
    __name(parseCFFFDSelect, "parseCFFFDSelect");
    __name(parseCFFTable, "parseCFFTable");
    cff = { parse: parseCFFTable };
    __name(parseFvarAxis, "parseFvarAxis");
    __name(parseFvarInstance, "parseFvarInstance");
    __name(parseFvarTable, "parseFvarTable");
    fvar = { parse: parseFvarTable };
    attachList = /* @__PURE__ */ __name(function() {
      return {
        coverage: this.parsePointer(Parser.coverage),
        attachPoints: this.parseList(Parser.pointer(Parser.uShortList))
      };
    }, "attachList");
    caretValue = /* @__PURE__ */ __name(function() {
      var format = this.parseUShort();
      check.argument(
        format === 1 || format === 2 || format === 3,
        "Unsupported CaretValue table version."
      );
      if (format === 1) {
        return { coordinate: this.parseShort() };
      } else if (format === 2) {
        return { pointindex: this.parseShort() };
      } else if (format === 3) {
        return { coordinate: this.parseShort() };
      }
    }, "caretValue");
    ligGlyph = /* @__PURE__ */ __name(function() {
      return this.parseList(Parser.pointer(caretValue));
    }, "ligGlyph");
    ligCaretList = /* @__PURE__ */ __name(function() {
      return {
        coverage: this.parsePointer(Parser.coverage),
        ligGlyphs: this.parseList(Parser.pointer(ligGlyph))
      };
    }, "ligCaretList");
    markGlyphSets = /* @__PURE__ */ __name(function() {
      this.parseUShort();
      return this.parseList(Parser.pointer(Parser.coverage));
    }, "markGlyphSets");
    __name(parseGDEFTable, "parseGDEFTable");
    gdef = { parse: parseGDEFTable };
    subtableParsers = new Array(10);
    subtableParsers[1] = /* @__PURE__ */ __name(function parseLookup1() {
      var start = this.offset + this.relativeOffset;
      var posformat = this.parseUShort();
      if (posformat === 1) {
        return {
          posFormat: 1,
          coverage: this.parsePointer(Parser.coverage),
          value: this.parseValueRecord()
        };
      } else if (posformat === 2) {
        return {
          posFormat: 2,
          coverage: this.parsePointer(Parser.coverage),
          values: this.parseValueRecordList()
        };
      }
      check.assert(
        false,
        "0x" + start.toString(16) + ": GPOS lookup type 1 format must be 1 or 2."
      );
    }, "parseLookup1");
    subtableParsers[2] = /* @__PURE__ */ __name(function parseLookup2() {
      var start = this.offset + this.relativeOffset;
      var posFormat = this.parseUShort();
      check.assert(
        posFormat === 1 || posFormat === 2,
        "0x" + start.toString(16) + ": GPOS lookup type 2 format must be 1 or 2."
      );
      var coverage = this.parsePointer(Parser.coverage);
      var valueFormat1 = this.parseUShort();
      var valueFormat2 = this.parseUShort();
      if (posFormat === 1) {
        return {
          posFormat,
          coverage,
          valueFormat1,
          valueFormat2,
          pairSets: this.parseList(
            Parser.pointer(
              Parser.list(function() {
                return {
                  // pairValueRecord
                  secondGlyph: this.parseUShort(),
                  value1: this.parseValueRecord(valueFormat1),
                  value2: this.parseValueRecord(valueFormat2)
                };
              })
            )
          )
        };
      } else if (posFormat === 2) {
        var classDef1 = this.parsePointer(Parser.classDef);
        var classDef2 = this.parsePointer(Parser.classDef);
        var class1Count = this.parseUShort();
        var class2Count = this.parseUShort();
        return {
          // Class Pair Adjustment
          posFormat,
          coverage,
          valueFormat1,
          valueFormat2,
          classDef1,
          classDef2,
          class1Count,
          class2Count,
          classRecords: this.parseList(
            class1Count,
            Parser.list(class2Count, function() {
              return {
                value1: this.parseValueRecord(valueFormat1),
                value2: this.parseValueRecord(valueFormat2)
              };
            })
          )
        };
      }
    }, "parseLookup2");
    subtableParsers[3] = /* @__PURE__ */ __name(function parseLookup3() {
      return { error: "GPOS Lookup 3 not supported" };
    }, "parseLookup3");
    subtableParsers[4] = /* @__PURE__ */ __name(function parseLookup4() {
      return { error: "GPOS Lookup 4 not supported" };
    }, "parseLookup4");
    subtableParsers[5] = /* @__PURE__ */ __name(function parseLookup5() {
      return { error: "GPOS Lookup 5 not supported" };
    }, "parseLookup5");
    subtableParsers[6] = /* @__PURE__ */ __name(function parseLookup6() {
      return { error: "GPOS Lookup 6 not supported" };
    }, "parseLookup6");
    subtableParsers[7] = /* @__PURE__ */ __name(function parseLookup7() {
      return { error: "GPOS Lookup 7 not supported" };
    }, "parseLookup7");
    subtableParsers[8] = /* @__PURE__ */ __name(function parseLookup8() {
      return { error: "GPOS Lookup 8 not supported" };
    }, "parseLookup8");
    subtableParsers[9] = /* @__PURE__ */ __name(function parseLookup9() {
      return { error: "GPOS Lookup 9 not supported" };
    }, "parseLookup9");
    __name(parseGposTable, "parseGposTable");
    gpos = { parse: parseGposTable };
    subtableParsers$1 = new Array(9);
    subtableParsers$1[1] = /* @__PURE__ */ __name(function parseLookup12() {
      var start = this.offset + this.relativeOffset;
      var substFormat = this.parseUShort();
      if (substFormat === 1) {
        return {
          substFormat: 1,
          coverage: this.parsePointer(Parser.coverage),
          deltaGlyphId: this.parseUShort()
        };
      } else if (substFormat === 2) {
        return {
          substFormat: 2,
          coverage: this.parsePointer(Parser.coverage),
          substitute: this.parseOffset16List()
        };
      }
      check.assert(
        false,
        "0x" + start.toString(16) + ": lookup type 1 format must be 1 or 2."
      );
    }, "parseLookup12");
    subtableParsers$1[2] = /* @__PURE__ */ __name(function parseLookup22() {
      var substFormat = this.parseUShort();
      check.argument(
        substFormat === 1,
        "GSUB Multiple Substitution Subtable identifier-format must be 1"
      );
      return {
        substFormat,
        coverage: this.parsePointer(Parser.coverage),
        sequences: this.parseListOfLists()
      };
    }, "parseLookup22");
    subtableParsers$1[3] = /* @__PURE__ */ __name(function parseLookup32() {
      var substFormat = this.parseUShort();
      check.argument(
        substFormat === 1,
        "GSUB Alternate Substitution Subtable identifier-format must be 1"
      );
      return {
        substFormat,
        coverage: this.parsePointer(Parser.coverage),
        alternateSets: this.parseListOfLists()
      };
    }, "parseLookup32");
    subtableParsers$1[4] = /* @__PURE__ */ __name(function parseLookup42() {
      var substFormat = this.parseUShort();
      check.argument(
        substFormat === 1,
        "GSUB ligature table identifier-format must be 1"
      );
      return {
        substFormat,
        coverage: this.parsePointer(Parser.coverage),
        ligatureSets: this.parseListOfLists(function() {
          return {
            ligGlyph: this.parseUShort(),
            components: this.parseUShortList(this.parseUShort() - 1)
          };
        })
      };
    }, "parseLookup42");
    lookupRecordDesc = {
      sequenceIndex: Parser.uShort,
      lookupListIndex: Parser.uShort
    };
    subtableParsers$1[5] = /* @__PURE__ */ __name(function parseLookup52() {
      var start = this.offset + this.relativeOffset;
      var substFormat = this.parseUShort();
      if (substFormat === 1) {
        return {
          substFormat,
          coverage: this.parsePointer(Parser.coverage),
          ruleSets: this.parseListOfLists(function() {
            var glyphCount2 = this.parseUShort();
            var substCount2 = this.parseUShort();
            return {
              input: this.parseUShortList(glyphCount2 - 1),
              lookupRecords: this.parseRecordList(
                substCount2,
                lookupRecordDesc
              )
            };
          })
        };
      } else if (substFormat === 2) {
        return {
          substFormat,
          coverage: this.parsePointer(Parser.coverage),
          classDef: this.parsePointer(Parser.classDef),
          classSets: this.parseListOfLists(function() {
            var glyphCount2 = this.parseUShort();
            var substCount2 = this.parseUShort();
            return {
              classes: this.parseUShortList(glyphCount2 - 1),
              lookupRecords: this.parseRecordList(
                substCount2,
                lookupRecordDesc
              )
            };
          })
        };
      } else if (substFormat === 3) {
        var glyphCount = this.parseUShort();
        var substCount = this.parseUShort();
        return {
          substFormat,
          coverages: this.parseList(
            glyphCount,
            Parser.pointer(Parser.coverage)
          ),
          lookupRecords: this.parseRecordList(substCount, lookupRecordDesc)
        };
      }
      check.assert(
        false,
        "0x" + start.toString(16) + ": lookup type 5 format must be 1, 2 or 3."
      );
    }, "parseLookup52");
    subtableParsers$1[6] = /* @__PURE__ */ __name(function parseLookup62() {
      var start = this.offset + this.relativeOffset;
      var substFormat = this.parseUShort();
      if (substFormat === 1) {
        return {
          substFormat: 1,
          coverage: this.parsePointer(Parser.coverage),
          chainRuleSets: this.parseListOfLists(function() {
            return {
              backtrack: this.parseUShortList(),
              input: this.parseUShortList(this.parseShort() - 1),
              lookahead: this.parseUShortList(),
              lookupRecords: this.parseRecordList(lookupRecordDesc)
            };
          })
        };
      } else if (substFormat === 2) {
        return {
          substFormat: 2,
          coverage: this.parsePointer(Parser.coverage),
          backtrackClassDef: this.parsePointer(Parser.classDef),
          inputClassDef: this.parsePointer(Parser.classDef),
          lookaheadClassDef: this.parsePointer(Parser.classDef),
          chainClassSet: this.parseListOfLists(function() {
            return {
              backtrack: this.parseUShortList(),
              input: this.parseUShortList(this.parseShort() - 1),
              lookahead: this.parseUShortList(),
              lookupRecords: this.parseRecordList(lookupRecordDesc)
            };
          })
        };
      } else if (substFormat === 3) {
        return {
          substFormat: 3,
          backtrackCoverage: this.parseList(Parser.pointer(Parser.coverage)),
          inputCoverage: this.parseList(Parser.pointer(Parser.coverage)),
          lookaheadCoverage: this.parseList(Parser.pointer(Parser.coverage)),
          lookupRecords: this.parseRecordList(lookupRecordDesc)
        };
      }
      check.assert(
        false,
        "0x" + start.toString(16) + ": lookup type 6 format must be 1, 2 or 3."
      );
    }, "parseLookup62");
    subtableParsers$1[7] = /* @__PURE__ */ __name(function parseLookup72() {
      var substFormat = this.parseUShort();
      check.argument(
        substFormat === 1,
        "GSUB Extension Substitution subtable identifier-format must be 1"
      );
      var extensionLookupType = this.parseUShort();
      var extensionParser = new Parser(
        this.data,
        this.offset + this.parseULong()
      );
      return {
        substFormat: 1,
        lookupType: extensionLookupType,
        extension: subtableParsers$1[extensionLookupType].call(extensionParser)
      };
    }, "parseLookup72");
    subtableParsers$1[8] = /* @__PURE__ */ __name(function parseLookup82() {
      var substFormat = this.parseUShort();
      check.argument(
        substFormat === 1,
        "GSUB Reverse Chaining Contextual Single Substitution Subtable identifier-format must be 1"
      );
      return {
        substFormat,
        coverage: this.parsePointer(Parser.coverage),
        backtrackCoverage: this.parseList(Parser.pointer(Parser.coverage)),
        lookaheadCoverage: this.parseList(Parser.pointer(Parser.coverage)),
        substitutes: this.parseUShortList()
      };
    }, "parseLookup82");
    __name(parseGsubTable, "parseGsubTable");
    gsub = { parse: parseGsubTable };
    __name(parseHeadTable, "parseHeadTable");
    head = { parse: parseHeadTable };
    __name(parseHheaTable, "parseHheaTable");
    hhea = { parse: parseHheaTable };
    __name(parseHmtxTableAll, "parseHmtxTableAll");
    __name(parseHmtxTableOnLowMemory, "parseHmtxTableOnLowMemory");
    __name(parseHmtxTable, "parseHmtxTable");
    hmtx = { parse: parseHmtxTable };
    __name(parseWindowsKernTable, "parseWindowsKernTable");
    __name(parseMacKernTable, "parseMacKernTable");
    __name(parseKernTable, "parseKernTable");
    kern = { parse: parseKernTable };
    __name(parseLtagTable, "parseLtagTable");
    ltag = { parse: parseLtagTable };
    __name(parseLocaTable, "parseLocaTable");
    loca = { parse: parseLocaTable };
    __name(parseMaxpTable, "parseMaxpTable");
    maxp = { parse: parseMaxpTable };
    __name(parseOS2Table, "parseOS2Table");
    os2 = { parse: parseOS2Table };
    __name(parsePostTable, "parsePostTable");
    post = { parse: parsePostTable };
    decode = {};
    decode.UTF8 = function(data, offset, numBytes) {
      var codePoints = [];
      var numChars = numBytes;
      for (var j2 = 0; j2 < numChars; j2++, offset += 1) {
        codePoints[j2] = data.getUint8(offset);
      }
      return String.fromCharCode.apply(null, codePoints);
    };
    decode.UTF16 = function(data, offset, numBytes) {
      var codePoints = [];
      var numChars = numBytes / 2;
      for (var j2 = 0; j2 < numChars; j2++, offset += 2) {
        codePoints[j2] = data.getUint16(offset);
      }
      return String.fromCharCode.apply(null, codePoints);
    };
    eightBitMacEncodings = {
      "x-mac-croatian": (
        // Python: 'mac_croatian'
        "\xC4\xC5\xC7\xC9\xD1\xD6\xDC\xE1\xE0\xE2\xE4\xE3\xE5\xE7\xE9\xE8\xEA\xEB\xED\xEC\xEE\xEF\xF1\xF3\xF2\xF4\xF6\xF5\xFA\xF9\xFB\xFC\u2020\xB0\xA2\xA3\xA7\u2022\xB6\xDF\xAE\u0160\u2122\xB4\xA8\u2260\u017D\xD8\u221E\xB1\u2264\u2265\u2206\xB5\u2202\u2211\u220F\u0161\u222B\xAA\xBA\u03A9\u017E\xF8\xBF\xA1\xAC\u221A\u0192\u2248\u0106\xAB\u010C\u2026\xA0\xC0\xC3\xD5\u0152\u0153\u0110\u2014\u201C\u201D\u2018\u2019\xF7\u25CA\uF8FF\xA9\u2044\u20AC\u2039\u203A\xC6\xBB\u2013\xB7\u201A\u201E\u2030\xC2\u0107\xC1\u010D\xC8\xCD\xCE\xCF\xCC\xD3\xD4\u0111\xD2\xDA\xDB\xD9\u0131\u02C6\u02DC\xAF\u03C0\xCB\u02DA\xB8\xCA\xE6\u02C7"
      ),
      "x-mac-cyrillic": (
        // Python: 'mac_cyrillic'
        "\u0410\u0411\u0412\u0413\u0414\u0415\u0416\u0417\u0418\u0419\u041A\u041B\u041C\u041D\u041E\u041F\u0420\u0421\u0422\u0423\u0424\u0425\u0426\u0427\u0428\u0429\u042A\u042B\u042C\u042D\u042E\u042F\u2020\xB0\u0490\xA3\xA7\u2022\xB6\u0406\xAE\xA9\u2122\u0402\u0452\u2260\u0403\u0453\u221E\xB1\u2264\u2265\u0456\xB5\u0491\u0408\u0404\u0454\u0407\u0457\u0409\u0459\u040A\u045A\u0458\u0405\xAC\u221A\u0192\u2248\u2206\xAB\xBB\u2026\xA0\u040B\u045B\u040C\u045C\u0455\u2013\u2014\u201C\u201D\u2018\u2019\xF7\u201E\u040E\u045E\u040F\u045F\u2116\u0401\u0451\u044F\u0430\u0431\u0432\u0433\u0434\u0435\u0436\u0437\u0438\u0439\u043A\u043B\u043C\u043D\u043E\u043F\u0440\u0441\u0442\u0443\u0444\u0445\u0446\u0447\u0448\u0449\u044A\u044B\u044C\u044D\u044E"
      ),
      "x-mac-gaelic": (
        // http://unicode.org/Public/MAPPINGS/VENDORS/APPLE/GAELIC.TXT
        "\xC4\xC5\xC7\xC9\xD1\xD6\xDC\xE1\xE0\xE2\xE4\xE3\xE5\xE7\xE9\xE8\xEA\xEB\xED\xEC\xEE\xEF\xF1\xF3\xF2\xF4\xF6\xF5\xFA\xF9\xFB\xFC\u2020\xB0\xA2\xA3\xA7\u2022\xB6\xDF\xAE\xA9\u2122\xB4\xA8\u2260\xC6\xD8\u1E02\xB1\u2264\u2265\u1E03\u010A\u010B\u1E0A\u1E0B\u1E1E\u1E1F\u0120\u0121\u1E40\xE6\xF8\u1E41\u1E56\u1E57\u027C\u0192\u017F\u1E60\xAB\xBB\u2026\xA0\xC0\xC3\xD5\u0152\u0153\u2013\u2014\u201C\u201D\u2018\u2019\u1E61\u1E9B\xFF\u0178\u1E6A\u20AC\u2039\u203A\u0176\u0177\u1E6B\xB7\u1EF2\u1EF3\u204A\xC2\xCA\xC1\xCB\xC8\xCD\xCE\xCF\xCC\xD3\xD4\u2663\xD2\xDA\xDB\xD9\u0131\xDD\xFD\u0174\u0175\u1E84\u1E85\u1E80\u1E81\u1E82\u1E83"
      ),
      "x-mac-greek": (
        // Python: 'mac_greek'
        "\xC4\xB9\xB2\xC9\xB3\xD6\xDC\u0385\xE0\xE2\xE4\u0384\xA8\xE7\xE9\xE8\xEA\xEB\xA3\u2122\xEE\xEF\u2022\xBD\u2030\xF4\xF6\xA6\u20AC\xF9\xFB\xFC\u2020\u0393\u0394\u0398\u039B\u039E\u03A0\xDF\xAE\xA9\u03A3\u03AA\xA7\u2260\xB0\xB7\u0391\xB1\u2264\u2265\xA5\u0392\u0395\u0396\u0397\u0399\u039A\u039C\u03A6\u03AB\u03A8\u03A9\u03AC\u039D\xAC\u039F\u03A1\u2248\u03A4\xAB\xBB\u2026\xA0\u03A5\u03A7\u0386\u0388\u0153\u2013\u2015\u201C\u201D\u2018\u2019\xF7\u0389\u038A\u038C\u038E\u03AD\u03AE\u03AF\u03CC\u038F\u03CD\u03B1\u03B2\u03C8\u03B4\u03B5\u03C6\u03B3\u03B7\u03B9\u03BE\u03BA\u03BB\u03BC\u03BD\u03BF\u03C0\u03CE\u03C1\u03C3\u03C4\u03B8\u03C9\u03C2\u03C7\u03C5\u03B6\u03CA\u03CB\u0390\u03B0\xAD"
      ),
      "x-mac-icelandic": (
        // Python: 'mac_iceland'
        "\xC4\xC5\xC7\xC9\xD1\xD6\xDC\xE1\xE0\xE2\xE4\xE3\xE5\xE7\xE9\xE8\xEA\xEB\xED\xEC\xEE\xEF\xF1\xF3\xF2\xF4\xF6\xF5\xFA\xF9\xFB\xFC\xDD\xB0\xA2\xA3\xA7\u2022\xB6\xDF\xAE\xA9\u2122\xB4\xA8\u2260\xC6\xD8\u221E\xB1\u2264\u2265\xA5\xB5\u2202\u2211\u220F\u03C0\u222B\xAA\xBA\u03A9\xE6\xF8\xBF\xA1\xAC\u221A\u0192\u2248\u2206\xAB\xBB\u2026\xA0\xC0\xC3\xD5\u0152\u0153\u2013\u2014\u201C\u201D\u2018\u2019\xF7\u25CA\xFF\u0178\u2044\u20AC\xD0\xF0\xDE\xFE\xFD\xB7\u201A\u201E\u2030\xC2\xCA\xC1\xCB\xC8\xCD\xCE\xCF\xCC\xD3\xD4\uF8FF\xD2\xDA\xDB\xD9\u0131\u02C6\u02DC\xAF\u02D8\u02D9\u02DA\xB8\u02DD\u02DB\u02C7"
      ),
      "x-mac-inuit": (
        // http://unicode.org/Public/MAPPINGS/VENDORS/APPLE/INUIT.TXT
        "\u1403\u1404\u1405\u1406\u140A\u140B\u1431\u1432\u1433\u1434\u1438\u1439\u1449\u144E\u144F\u1450\u1451\u1455\u1456\u1466\u146D\u146E\u146F\u1470\u1472\u1473\u1483\u148B\u148C\u148D\u148E\u1490\u1491\xB0\u14A1\u14A5\u14A6\u2022\xB6\u14A7\xAE\xA9\u2122\u14A8\u14AA\u14AB\u14BB\u14C2\u14C3\u14C4\u14C5\u14C7\u14C8\u14D0\u14EF\u14F0\u14F1\u14F2\u14F4\u14F5\u1505\u14D5\u14D6\u14D7\u14D8\u14DA\u14DB\u14EA\u1528\u1529\u152A\u152B\u152D\u2026\xA0\u152E\u153E\u1555\u1556\u1557\u2013\u2014\u201C\u201D\u2018\u2019\u1558\u1559\u155A\u155D\u1546\u1547\u1548\u1549\u154B\u154C\u1550\u157F\u1580\u1581\u1582\u1583\u1584\u1585\u158F\u1590\u1591\u1592\u1593\u1594\u1595\u1671\u1672\u1673\u1674\u1675\u1676\u1596\u15A0\u15A1\u15A2\u15A3\u15A4\u15A5\u15A6\u157C\u0141\u0142"
      ),
      "x-mac-ce": (
        // Python: 'mac_latin2'
        "\xC4\u0100\u0101\xC9\u0104\xD6\xDC\xE1\u0105\u010C\xE4\u010D\u0106\u0107\xE9\u0179\u017A\u010E\xED\u010F\u0112\u0113\u0116\xF3\u0117\xF4\xF6\xF5\xFA\u011A\u011B\xFC\u2020\xB0\u0118\xA3\xA7\u2022\xB6\xDF\xAE\xA9\u2122\u0119\xA8\u2260\u0123\u012E\u012F\u012A\u2264\u2265\u012B\u0136\u2202\u2211\u0142\u013B\u013C\u013D\u013E\u0139\u013A\u0145\u0146\u0143\xAC\u221A\u0144\u0147\u2206\xAB\xBB\u2026\xA0\u0148\u0150\xD5\u0151\u014C\u2013\u2014\u201C\u201D\u2018\u2019\xF7\u25CA\u014D\u0154\u0155\u0158\u2039\u203A\u0159\u0156\u0157\u0160\u201A\u201E\u0161\u015A\u015B\xC1\u0164\u0165\xCD\u017D\u017E\u016A\xD3\xD4\u016B\u016E\xDA\u016F\u0170\u0171\u0172\u0173\xDD\xFD\u0137\u017B\u0141\u017C\u0122\u02C7"
      ),
      macintosh: (
        // Python: 'mac_roman'
        "\xC4\xC5\xC7\xC9\xD1\xD6\xDC\xE1\xE0\xE2\xE4\xE3\xE5\xE7\xE9\xE8\xEA\xEB\xED\xEC\xEE\xEF\xF1\xF3\xF2\xF4\xF6\xF5\xFA\xF9\xFB\xFC\u2020\xB0\xA2\xA3\xA7\u2022\xB6\xDF\xAE\xA9\u2122\xB4\xA8\u2260\xC6\xD8\u221E\xB1\u2264\u2265\xA5\xB5\u2202\u2211\u220F\u03C0\u222B\xAA\xBA\u03A9\xE6\xF8\xBF\xA1\xAC\u221A\u0192\u2248\u2206\xAB\xBB\u2026\xA0\xC0\xC3\xD5\u0152\u0153\u2013\u2014\u201C\u201D\u2018\u2019\xF7\u25CA\xFF\u0178\u2044\u20AC\u2039\u203A\uFB01\uFB02\u2021\xB7\u201A\u201E\u2030\xC2\xCA\xC1\xCB\xC8\xCD\xCE\xCF\xCC\xD3\xD4\uF8FF\xD2\xDA\xDB\xD9\u0131\u02C6\u02DC\xAF\u02D8\u02D9\u02DA\xB8\u02DD\u02DB\u02C7"
      ),
      "x-mac-romanian": (
        // Python: 'mac_romanian'
        "\xC4\xC5\xC7\xC9\xD1\xD6\xDC\xE1\xE0\xE2\xE4\xE3\xE5\xE7\xE9\xE8\xEA\xEB\xED\xEC\xEE\xEF\xF1\xF3\xF2\xF4\xF6\xF5\xFA\xF9\xFB\xFC\u2020\xB0\xA2\xA3\xA7\u2022\xB6\xDF\xAE\xA9\u2122\xB4\xA8\u2260\u0102\u0218\u221E\xB1\u2264\u2265\xA5\xB5\u2202\u2211\u220F\u03C0\u222B\xAA\xBA\u03A9\u0103\u0219\xBF\xA1\xAC\u221A\u0192\u2248\u2206\xAB\xBB\u2026\xA0\xC0\xC3\xD5\u0152\u0153\u2013\u2014\u201C\u201D\u2018\u2019\xF7\u25CA\xFF\u0178\u2044\u20AC\u2039\u203A\u021A\u021B\u2021\xB7\u201A\u201E\u2030\xC2\xCA\xC1\xCB\xC8\xCD\xCE\xCF\xCC\xD3\xD4\uF8FF\xD2\xDA\xDB\xD9\u0131\u02C6\u02DC\xAF\u02D8\u02D9\u02DA\xB8\u02DD\u02DB\u02C7"
      ),
      "x-mac-turkish": (
        // Python: 'mac_turkish'
        "\xC4\xC5\xC7\xC9\xD1\xD6\xDC\xE1\xE0\xE2\xE4\xE3\xE5\xE7\xE9\xE8\xEA\xEB\xED\xEC\xEE\xEF\xF1\xF3\xF2\xF4\xF6\xF5\xFA\xF9\xFB\xFC\u2020\xB0\xA2\xA3\xA7\u2022\xB6\xDF\xAE\xA9\u2122\xB4\xA8\u2260\xC6\xD8\u221E\xB1\u2264\u2265\xA5\xB5\u2202\u2211\u220F\u03C0\u222B\xAA\xBA\u03A9\xE6\xF8\xBF\xA1\xAC\u221A\u0192\u2248\u2206\xAB\xBB\u2026\xA0\xC0\xC3\xD5\u0152\u0153\u2013\u2014\u201C\u201D\u2018\u2019\xF7\u25CA\xFF\u0178\u011E\u011F\u0130\u0131\u015E\u015F\u2021\xB7\u201A\u201E\u2030\xC2\xCA\xC1\xCB\xC8\xCD\xCE\xCF\xCC\xD3\xD4\uF8FF\xD2\xDA\xDB\xD9\uF8A0\u02C6\u02DC\xAF\u02D8\u02D9\u02DA\xB8\u02DD\u02DB\u02C7"
      )
    };
    decode.MACSTRING = function(dataView, offset, dataLength, encoding) {
      var table = eightBitMacEncodings[encoding];
      if (table === void 0) {
        return void 0;
      }
      var result = "";
      for (var i2 = 0; i2 < dataLength; i2++) {
        var c2 = dataView.getUint8(offset + i2);
        if (c2 <= 127) {
          result += String.fromCharCode(c2);
        } else {
          result += table[c2 & 127];
        }
      }
      return result;
    };
    __name(parseMetaTable, "parseMetaTable");
    meta = { parse: parseMetaTable };
    __name(parseOpenTypeTableEntries, "parseOpenTypeTableEntries");
    __name(parseWOFFTableEntries, "parseWOFFTableEntries");
    __name(uncompressTable, "uncompressTable");
    __name(parseBuffer, "parseBuffer");
    __name(load, "load");
    __name(loadSync, "loadSync");
    opentype = /* @__PURE__ */ Object.freeze({
      __proto__: null,
      Font,
      Glyph,
      Path,
      _parse: parse,
      parse: parseBuffer,
      load,
      loadSync
    });
    opentype_module_default = opentype;
    Gu = Object.create;
    mr = Object.defineProperty;
    ju = Object.getOwnPropertyDescriptor;
    Hu = Object.getOwnPropertyNames;
    Vu = Object.getPrototypeOf;
    Yu = Object.prototype.hasOwnProperty;
    gr = /* @__PURE__ */ __name((e, t) => () => (e && (t = e(e = 0)), t), "gr");
    C = /* @__PURE__ */ __name((e, t) => () => (t || e((t = { exports: {} }).exports, t), t.exports), "C");
    Zr = /* @__PURE__ */ __name((e, t) => {
      for (var n in t)
        mr(e, n, { get: t[n], enumerable: true });
    }, "Zr");
    _o = /* @__PURE__ */ __name((e, t, n, r) => {
      if (t && typeof t == "object" || typeof t == "function")
        for (let i2 of Hu(t))
          !Yu.call(e, i2) && i2 !== n && mr(e, i2, { get: /* @__PURE__ */ __name(() => t[i2], "get"), enumerable: !(r = ju(t, i2)) || r.enumerable });
      return e;
    }, "_o");
    Xu = /* @__PURE__ */ __name((e, t, n) => (n = e != null ? Gu(Vu(e)) : {}, _o(t || !e || !e.__esModule ? mr(n, "default", { value: e, enumerable: true }) : n, e)), "Xu");
    vr = /* @__PURE__ */ __name((e) => _o(mr({}, "__esModule", { value: true }), e), "vr");
    c = gr(() => {
    });
    So = {};
    Zr(So, { getYogaModule: /* @__PURE__ */ __name(() => Qu, "getYogaModule") });
    __name(Qu, "Qu");
    ko = gr(() => {
      c();
    });
    On = C((Tn) => {
      "use strict";
      c();
      Object.defineProperty(Tn, "__esModule", { value: true });
      Object.defineProperty(Tn, "default", { enumerable: true, get: /* @__PURE__ */ __name(() => ql, "get") });
      function ql(e) {
        if (e = `${e}`, e === "0")
          return "0";
        if (/^[+-]?(\d+|\d*\.\d+)(e[+-]?\d+)?(%|\w+)?$/.test(e))
          return e.replace(/^[+-]?/, (t) => t === "-" ? "" : "-");
        if (e.includes("var(") || e.includes("calc("))
          return `calc(${e} * -1)`;
      }
      __name(ql, "ql");
    });
    ss = C((En) => {
      "use strict";
      c();
      Object.defineProperty(En, "__esModule", { value: true });
      Object.defineProperty(En, "default", { enumerable: true, get: /* @__PURE__ */ __name(() => Bl, "get") });
      var Bl = ["preflight", "container", "accessibility", "pointerEvents", "visibility", "position", "inset", "isolation", "zIndex", "order", "gridColumn", "gridColumnStart", "gridColumnEnd", "gridRow", "gridRowStart", "gridRowEnd", "float", "clear", "margin", "boxSizing", "display", "aspectRatio", "height", "maxHeight", "minHeight", "width", "minWidth", "maxWidth", "flex", "flexShrink", "flexGrow", "flexBasis", "tableLayout", "borderCollapse", "borderSpacing", "transformOrigin", "translate", "rotate", "skew", "scale", "transform", "animation", "cursor", "touchAction", "userSelect", "resize", "scrollSnapType", "scrollSnapAlign", "scrollSnapStop", "scrollMargin", "scrollPadding", "listStylePosition", "listStyleType", "appearance", "columns", "breakBefore", "breakInside", "breakAfter", "gridAutoColumns", "gridAutoFlow", "gridAutoRows", "gridTemplateColumns", "gridTemplateRows", "flexDirection", "flexWrap", "placeContent", "placeItems", "alignContent", "alignItems", "justifyContent", "justifyItems", "gap", "space", "divideWidth", "divideStyle", "divideColor", "divideOpacity", "placeSelf", "alignSelf", "justifySelf", "overflow", "overscrollBehavior", "scrollBehavior", "textOverflow", "whitespace", "wordBreak", "borderRadius", "borderWidth", "borderStyle", "borderColor", "borderOpacity", "backgroundColor", "backgroundOpacity", "backgroundImage", "gradientColorStops", "boxDecorationBreak", "backgroundSize", "backgroundAttachment", "backgroundClip", "backgroundPosition", "backgroundRepeat", "backgroundOrigin", "fill", "stroke", "strokeWidth", "objectFit", "objectPosition", "padding", "textAlign", "textIndent", "verticalAlign", "fontFamily", "fontSize", "fontWeight", "textTransform", "fontStyle", "fontVariantNumeric", "lineHeight", "letterSpacing", "textColor", "textOpacity", "textDecoration", "textDecorationColor", "textDecorationStyle", "textDecorationThickness", "textUnderlineOffset", "fontSmoothing", "placeholderColor", "placeholderOpacity", "caretColor", "accentColor", "opacity", "backgroundBlendMode", "mixBlendMode", "boxShadow", "boxShadowColor", "outlineStyle", "outlineWidth", "outlineOffset", "outlineColor", "ringWidth", "ringColor", "ringOpacity", "ringOffsetWidth", "ringOffsetColor", "blur", "brightness", "contrast", "dropShadow", "grayscale", "hueRotate", "invert", "saturate", "sepia", "filter", "backdropBlur", "backdropBrightness", "backdropContrast", "backdropGrayscale", "backdropHueRotate", "backdropInvert", "backdropOpacity", "backdropSaturate", "backdropSepia", "backdropFilter", "transitionProperty", "transitionDelay", "transitionDuration", "transitionTimingFunction", "willChange", "content"];
    });
    as = C((Pn) => {
      "use strict";
      c();
      Object.defineProperty(Pn, "__esModule", { value: true });
      Object.defineProperty(Pn, "default", { enumerable: true, get: /* @__PURE__ */ __name(() => Ul, "get") });
      function Ul(e, t) {
        return e === void 0 ? t : Array.isArray(e) ? e : [...new Set(t.filter((r) => e !== false && e[r] !== false).concat(Object.keys(e).filter((r) => e[r] !== false)))];
      }
      __name(Ul, "Ul");
    });
    An = C((kg, us) => {
      c();
      us.exports = { content: [], presets: [], darkMode: "media", theme: { screens: { sm: "640px", md: "768px", lg: "1024px", xl: "1280px", "2xl": "1536px" }, colors: /* @__PURE__ */ __name(({ colors: e }) => ({ inherit: e.inherit, current: e.current, transparent: e.transparent, black: e.black, white: e.white, slate: e.slate, gray: e.gray, zinc: e.zinc, neutral: e.neutral, stone: e.stone, red: e.red, orange: e.orange, amber: e.amber, yellow: e.yellow, lime: e.lime, green: e.green, emerald: e.emerald, teal: e.teal, cyan: e.cyan, sky: e.sky, blue: e.blue, indigo: e.indigo, violet: e.violet, purple: e.purple, fuchsia: e.fuchsia, pink: e.pink, rose: e.rose }), "colors"), columns: { auto: "auto", 1: "1", 2: "2", 3: "3", 4: "4", 5: "5", 6: "6", 7: "7", 8: "8", 9: "9", 10: "10", 11: "11", 12: "12", "3xs": "16rem", "2xs": "18rem", xs: "20rem", sm: "24rem", md: "28rem", lg: "32rem", xl: "36rem", "2xl": "42rem", "3xl": "48rem", "4xl": "56rem", "5xl": "64rem", "6xl": "72rem", "7xl": "80rem" }, spacing: { px: "1px", 0: "0px", 0.5: "0.125rem", 1: "0.25rem", 1.5: "0.375rem", 2: "0.5rem", 2.5: "0.625rem", 3: "0.75rem", 3.5: "0.875rem", 4: "1rem", 5: "1.25rem", 6: "1.5rem", 7: "1.75rem", 8: "2rem", 9: "2.25rem", 10: "2.5rem", 11: "2.75rem", 12: "3rem", 14: "3.5rem", 16: "4rem", 20: "5rem", 24: "6rem", 28: "7rem", 32: "8rem", 36: "9rem", 40: "10rem", 44: "11rem", 48: "12rem", 52: "13rem", 56: "14rem", 60: "15rem", 64: "16rem", 72: "18rem", 80: "20rem", 96: "24rem" }, animation: { none: "none", spin: "spin 1s linear infinite", ping: "ping 1s cubic-bezier(0, 0, 0.2, 1) infinite", pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite", bounce: "bounce 1s infinite" }, aspectRatio: { auto: "auto", square: "1 / 1", video: "16 / 9" }, backdropBlur: /* @__PURE__ */ __name(({ theme: e }) => e("blur"), "backdropBlur"), backdropBrightness: /* @__PURE__ */ __name(({ theme: e }) => e("brightness"), "backdropBrightness"), backdropContrast: /* @__PURE__ */ __name(({ theme: e }) => e("contrast"), "backdropContrast"), backdropGrayscale: /* @__PURE__ */ __name(({ theme: e }) => e("grayscale"), "backdropGrayscale"), backdropHueRotate: /* @__PURE__ */ __name(({ theme: e }) => e("hueRotate"), "backdropHueRotate"), backdropInvert: /* @__PURE__ */ __name(({ theme: e }) => e("invert"), "backdropInvert"), backdropOpacity: /* @__PURE__ */ __name(({ theme: e }) => e("opacity"), "backdropOpacity"), backdropSaturate: /* @__PURE__ */ __name(({ theme: e }) => e("saturate"), "backdropSaturate"), backdropSepia: /* @__PURE__ */ __name(({ theme: e }) => e("sepia"), "backdropSepia"), backgroundColor: /* @__PURE__ */ __name(({ theme: e }) => e("colors"), "backgroundColor"), backgroundImage: { none: "none", "gradient-to-t": "linear-gradient(to top, var(--tw-gradient-stops))", "gradient-to-tr": "linear-gradient(to top right, var(--tw-gradient-stops))", "gradient-to-r": "linear-gradient(to right, var(--tw-gradient-stops))", "gradient-to-br": "linear-gradient(to bottom right, var(--tw-gradient-stops))", "gradient-to-b": "linear-gradient(to bottom, var(--tw-gradient-stops))", "gradient-to-bl": "linear-gradient(to bottom left, var(--tw-gradient-stops))", "gradient-to-l": "linear-gradient(to left, var(--tw-gradient-stops))", "gradient-to-tl": "linear-gradient(to top left, var(--tw-gradient-stops))" }, backgroundOpacity: /* @__PURE__ */ __name(({ theme: e }) => e("opacity"), "backgroundOpacity"), backgroundPosition: { bottom: "bottom", center: "center", left: "left", "left-bottom": "left bottom", "left-top": "left top", right: "right", "right-bottom": "right bottom", "right-top": "right top", top: "top" }, backgroundSize: { auto: "auto", cover: "cover", contain: "contain" }, blur: { 0: "0", none: "0", sm: "4px", DEFAULT: "8px", md: "12px", lg: "16px", xl: "24px", "2xl": "40px", "3xl": "64px" }, brightness: { 0: "0", 50: ".5", 75: ".75", 90: ".9", 95: ".95", 100: "1", 105: "1.05", 110: "1.1", 125: "1.25", 150: "1.5", 200: "2" }, borderColor: /* @__PURE__ */ __name(({ theme: e }) => ({ ...e("colors"), DEFAULT: e("colors.gray.200", "currentColor") }), "borderColor"), borderOpacity: /* @__PURE__ */ __name(({ theme: e }) => e("opacity"), "borderOpacity"), borderRadius: { none: "0px", sm: "0.125rem", DEFAULT: "0.25rem", md: "0.375rem", lg: "0.5rem", xl: "0.75rem", "2xl": "1rem", "3xl": "1.5rem", full: "9999px" }, borderSpacing: /* @__PURE__ */ __name(({ theme: e }) => ({ ...e("spacing") }), "borderSpacing"), borderWidth: { DEFAULT: "1px", 0: "0px", 2: "2px", 4: "4px", 8: "8px" }, boxShadow: { sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)", DEFAULT: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)", md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)", lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)", xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)", "2xl": "0 25px 50px -12px rgb(0 0 0 / 0.25)", inner: "inset 0 2px 4px 0 rgb(0 0 0 / 0.05)", none: "none" }, boxShadowColor: /* @__PURE__ */ __name(({ theme: e }) => e("colors"), "boxShadowColor"), caretColor: /* @__PURE__ */ __name(({ theme: e }) => e("colors"), "caretColor"), accentColor: /* @__PURE__ */ __name(({ theme: e }) => ({ ...e("colors"), auto: "auto" }), "accentColor"), contrast: { 0: "0", 50: ".5", 75: ".75", 100: "1", 125: "1.25", 150: "1.5", 200: "2" }, container: {}, content: { none: "none" }, cursor: { auto: "auto", default: "default", pointer: "pointer", wait: "wait", text: "text", move: "move", help: "help", "not-allowed": "not-allowed", none: "none", "context-menu": "context-menu", progress: "progress", cell: "cell", crosshair: "crosshair", "vertical-text": "vertical-text", alias: "alias", copy: "copy", "no-drop": "no-drop", grab: "grab", grabbing: "grabbing", "all-scroll": "all-scroll", "col-resize": "col-resize", "row-resize": "row-resize", "n-resize": "n-resize", "e-resize": "e-resize", "s-resize": "s-resize", "w-resize": "w-resize", "ne-resize": "ne-resize", "nw-resize": "nw-resize", "se-resize": "se-resize", "sw-resize": "sw-resize", "ew-resize": "ew-resize", "ns-resize": "ns-resize", "nesw-resize": "nesw-resize", "nwse-resize": "nwse-resize", "zoom-in": "zoom-in", "zoom-out": "zoom-out" }, divideColor: /* @__PURE__ */ __name(({ theme: e }) => e("borderColor"), "divideColor"), divideOpacity: /* @__PURE__ */ __name(({ theme: e }) => e("borderOpacity"), "divideOpacity"), divideWidth: /* @__PURE__ */ __name(({ theme: e }) => e("borderWidth"), "divideWidth"), dropShadow: { sm: "0 1px 1px rgb(0 0 0 / 0.05)", DEFAULT: ["0 1px 2px rgb(0 0 0 / 0.1)", "0 1px 1px rgb(0 0 0 / 0.06)"], md: ["0 4px 3px rgb(0 0 0 / 0.07)", "0 2px 2px rgb(0 0 0 / 0.06)"], lg: ["0 10px 8px rgb(0 0 0 / 0.04)", "0 4px 3px rgb(0 0 0 / 0.1)"], xl: ["0 20px 13px rgb(0 0 0 / 0.03)", "0 8px 5px rgb(0 0 0 / 0.08)"], "2xl": "0 25px 25px rgb(0 0 0 / 0.15)", none: "0 0 #0000" }, fill: /* @__PURE__ */ __name(({ theme: e }) => e("colors"), "fill"), grayscale: { 0: "0", DEFAULT: "100%" }, hueRotate: { 0: "0deg", 15: "15deg", 30: "30deg", 60: "60deg", 90: "90deg", 180: "180deg" }, invert: { 0: "0", DEFAULT: "100%" }, flex: { 1: "1 1 0%", auto: "1 1 auto", initial: "0 1 auto", none: "none" }, flexBasis: /* @__PURE__ */ __name(({ theme: e }) => ({ auto: "auto", ...e("spacing"), "1/2": "50%", "1/3": "33.333333%", "2/3": "66.666667%", "1/4": "25%", "2/4": "50%", "3/4": "75%", "1/5": "20%", "2/5": "40%", "3/5": "60%", "4/5": "80%", "1/6": "16.666667%", "2/6": "33.333333%", "3/6": "50%", "4/6": "66.666667%", "5/6": "83.333333%", "1/12": "8.333333%", "2/12": "16.666667%", "3/12": "25%", "4/12": "33.333333%", "5/12": "41.666667%", "6/12": "50%", "7/12": "58.333333%", "8/12": "66.666667%", "9/12": "75%", "10/12": "83.333333%", "11/12": "91.666667%", full: "100%" }), "flexBasis"), flexGrow: { 0: "0", DEFAULT: "1" }, flexShrink: { 0: "0", DEFAULT: "1" }, fontFamily: { sans: ["ui-sans-serif", "system-ui", "-apple-system", "BlinkMacSystemFont", '"Segoe UI"', "Roboto", '"Helvetica Neue"', "Arial", '"Noto Sans"', "sans-serif", '"Apple Color Emoji"', '"Segoe UI Emoji"', '"Segoe UI Symbol"', '"Noto Color Emoji"'], serif: ["ui-serif", "Georgia", "Cambria", '"Times New Roman"', "Times", "serif"], mono: ["ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", '"Liberation Mono"', '"Courier New"', "monospace"] }, fontSize: { xs: ["0.75rem", { lineHeight: "1rem" }], sm: ["0.875rem", { lineHeight: "1.25rem" }], base: ["1rem", { lineHeight: "1.5rem" }], lg: ["1.125rem", { lineHeight: "1.75rem" }], xl: ["1.25rem", { lineHeight: "1.75rem" }], "2xl": ["1.5rem", { lineHeight: "2rem" }], "3xl": ["1.875rem", { lineHeight: "2.25rem" }], "4xl": ["2.25rem", { lineHeight: "2.5rem" }], "5xl": ["3rem", { lineHeight: "1" }], "6xl": ["3.75rem", { lineHeight: "1" }], "7xl": ["4.5rem", { lineHeight: "1" }], "8xl": ["6rem", { lineHeight: "1" }], "9xl": ["8rem", { lineHeight: "1" }] }, fontWeight: { thin: "100", extralight: "200", light: "300", normal: "400", medium: "500", semibold: "600", bold: "700", extrabold: "800", black: "900" }, gap: /* @__PURE__ */ __name(({ theme: e }) => e("spacing"), "gap"), gradientColorStops: /* @__PURE__ */ __name(({ theme: e }) => e("colors"), "gradientColorStops"), gridAutoColumns: { auto: "auto", min: "min-content", max: "max-content", fr: "minmax(0, 1fr)" }, gridAutoRows: { auto: "auto", min: "min-content", max: "max-content", fr: "minmax(0, 1fr)" }, gridColumn: { auto: "auto", "span-1": "span 1 / span 1", "span-2": "span 2 / span 2", "span-3": "span 3 / span 3", "span-4": "span 4 / span 4", "span-5": "span 5 / span 5", "span-6": "span 6 / span 6", "span-7": "span 7 / span 7", "span-8": "span 8 / span 8", "span-9": "span 9 / span 9", "span-10": "span 10 / span 10", "span-11": "span 11 / span 11", "span-12": "span 12 / span 12", "span-full": "1 / -1" }, gridColumnEnd: { auto: "auto", 1: "1", 2: "2", 3: "3", 4: "4", 5: "5", 6: "6", 7: "7", 8: "8", 9: "9", 10: "10", 11: "11", 12: "12", 13: "13" }, gridColumnStart: { auto: "auto", 1: "1", 2: "2", 3: "3", 4: "4", 5: "5", 6: "6", 7: "7", 8: "8", 9: "9", 10: "10", 11: "11", 12: "12", 13: "13" }, gridRow: { auto: "auto", "span-1": "span 1 / span 1", "span-2": "span 2 / span 2", "span-3": "span 3 / span 3", "span-4": "span 4 / span 4", "span-5": "span 5 / span 5", "span-6": "span 6 / span 6", "span-full": "1 / -1" }, gridRowStart: { auto: "auto", 1: "1", 2: "2", 3: "3", 4: "4", 5: "5", 6: "6", 7: "7" }, gridRowEnd: { auto: "auto", 1: "1", 2: "2", 3: "3", 4: "4", 5: "5", 6: "6", 7: "7" }, gridTemplateColumns: { none: "none", 1: "repeat(1, minmax(0, 1fr))", 2: "repeat(2, minmax(0, 1fr))", 3: "repeat(3, minmax(0, 1fr))", 4: "repeat(4, minmax(0, 1fr))", 5: "repeat(5, minmax(0, 1fr))", 6: "repeat(6, minmax(0, 1fr))", 7: "repeat(7, minmax(0, 1fr))", 8: "repeat(8, minmax(0, 1fr))", 9: "repeat(9, minmax(0, 1fr))", 10: "repeat(10, minmax(0, 1fr))", 11: "repeat(11, minmax(0, 1fr))", 12: "repeat(12, minmax(0, 1fr))" }, gridTemplateRows: { none: "none", 1: "repeat(1, minmax(0, 1fr))", 2: "repeat(2, minmax(0, 1fr))", 3: "repeat(3, minmax(0, 1fr))", 4: "repeat(4, minmax(0, 1fr))", 5: "repeat(5, minmax(0, 1fr))", 6: "repeat(6, minmax(0, 1fr))" }, height: /* @__PURE__ */ __name(({ theme: e }) => ({ auto: "auto", ...e("spacing"), "1/2": "50%", "1/3": "33.333333%", "2/3": "66.666667%", "1/4": "25%", "2/4": "50%", "3/4": "75%", "1/5": "20%", "2/5": "40%", "3/5": "60%", "4/5": "80%", "1/6": "16.666667%", "2/6": "33.333333%", "3/6": "50%", "4/6": "66.666667%", "5/6": "83.333333%", full: "100%", screen: "100vh", min: "min-content", max: "max-content", fit: "fit-content" }), "height"), inset: /* @__PURE__ */ __name(({ theme: e }) => ({ auto: "auto", ...e("spacing"), "1/2": "50%", "1/3": "33.333333%", "2/3": "66.666667%", "1/4": "25%", "2/4": "50%", "3/4": "75%", full: "100%" }), "inset"), keyframes: { spin: { to: { transform: "rotate(360deg)" } }, ping: { "75%, 100%": { transform: "scale(2)", opacity: "0" } }, pulse: { "50%": { opacity: ".5" } }, bounce: { "0%, 100%": { transform: "translateY(-25%)", animationTimingFunction: "cubic-bezier(0.8,0,1,1)" }, "50%": { transform: "none", animationTimingFunction: "cubic-bezier(0,0,0.2,1)" } } }, letterSpacing: { tighter: "-0.05em", tight: "-0.025em", normal: "0em", wide: "0.025em", wider: "0.05em", widest: "0.1em" }, lineHeight: { none: "1", tight: "1.25", snug: "1.375", normal: "1.5", relaxed: "1.625", loose: "2", 3: ".75rem", 4: "1rem", 5: "1.25rem", 6: "1.5rem", 7: "1.75rem", 8: "2rem", 9: "2.25rem", 10: "2.5rem" }, listStyleType: { none: "none", disc: "disc", decimal: "decimal" }, margin: /* @__PURE__ */ __name(({ theme: e }) => ({ auto: "auto", ...e("spacing") }), "margin"), maxHeight: /* @__PURE__ */ __name(({ theme: e }) => ({ ...e("spacing"), full: "100%", screen: "100vh", min: "min-content", max: "max-content", fit: "fit-content" }), "maxHeight"), maxWidth: /* @__PURE__ */ __name(({ theme: e, breakpoints: t }) => ({ none: "none", 0: "0rem", xs: "20rem", sm: "24rem", md: "28rem", lg: "32rem", xl: "36rem", "2xl": "42rem", "3xl": "48rem", "4xl": "56rem", "5xl": "64rem", "6xl": "72rem", "7xl": "80rem", full: "100%", min: "min-content", max: "max-content", fit: "fit-content", prose: "65ch", ...t(e("screens")) }), "maxWidth"), minHeight: { 0: "0px", full: "100%", screen: "100vh", min: "min-content", max: "max-content", fit: "fit-content" }, minWidth: { 0: "0px", full: "100%", min: "min-content", max: "max-content", fit: "fit-content" }, objectPosition: { bottom: "bottom", center: "center", left: "left", "left-bottom": "left bottom", "left-top": "left top", right: "right", "right-bottom": "right bottom", "right-top": "right top", top: "top" }, opacity: { 0: "0", 5: "0.05", 10: "0.1", 20: "0.2", 25: "0.25", 30: "0.3", 40: "0.4", 50: "0.5", 60: "0.6", 70: "0.7", 75: "0.75", 80: "0.8", 90: "0.9", 95: "0.95", 100: "1" }, order: { first: "-9999", last: "9999", none: "0", 1: "1", 2: "2", 3: "3", 4: "4", 5: "5", 6: "6", 7: "7", 8: "8", 9: "9", 10: "10", 11: "11", 12: "12" }, padding: /* @__PURE__ */ __name(({ theme: e }) => e("spacing"), "padding"), placeholderColor: /* @__PURE__ */ __name(({ theme: e }) => e("colors"), "placeholderColor"), placeholderOpacity: /* @__PURE__ */ __name(({ theme: e }) => e("opacity"), "placeholderOpacity"), outlineColor: /* @__PURE__ */ __name(({ theme: e }) => e("colors"), "outlineColor"), outlineOffset: { 0: "0px", 1: "1px", 2: "2px", 4: "4px", 8: "8px" }, outlineWidth: { 0: "0px", 1: "1px", 2: "2px", 4: "4px", 8: "8px" }, ringColor: /* @__PURE__ */ __name(({ theme: e }) => ({ DEFAULT: e("colors.blue.500", "#3b82f6"), ...e("colors") }), "ringColor"), ringOffsetColor: /* @__PURE__ */ __name(({ theme: e }) => e("colors"), "ringOffsetColor"), ringOffsetWidth: { 0: "0px", 1: "1px", 2: "2px", 4: "4px", 8: "8px" }, ringOpacity: /* @__PURE__ */ __name(({ theme: e }) => ({ DEFAULT: "0.5", ...e("opacity") }), "ringOpacity"), ringWidth: { DEFAULT: "3px", 0: "0px", 1: "1px", 2: "2px", 4: "4px", 8: "8px" }, rotate: { 0: "0deg", 1: "1deg", 2: "2deg", 3: "3deg", 6: "6deg", 12: "12deg", 45: "45deg", 90: "90deg", 180: "180deg" }, saturate: { 0: "0", 50: ".5", 100: "1", 150: "1.5", 200: "2" }, scale: { 0: "0", 50: ".5", 75: ".75", 90: ".9", 95: ".95", 100: "1", 105: "1.05", 110: "1.1", 125: "1.25", 150: "1.5" }, scrollMargin: /* @__PURE__ */ __name(({ theme: e }) => ({ ...e("spacing") }), "scrollMargin"), scrollPadding: /* @__PURE__ */ __name(({ theme: e }) => e("spacing"), "scrollPadding"), sepia: { 0: "0", DEFAULT: "100%" }, skew: { 0: "0deg", 1: "1deg", 2: "2deg", 3: "3deg", 6: "6deg", 12: "12deg" }, space: /* @__PURE__ */ __name(({ theme: e }) => ({ ...e("spacing") }), "space"), stroke: /* @__PURE__ */ __name(({ theme: e }) => e("colors"), "stroke"), strokeWidth: { 0: "0", 1: "1", 2: "2" }, textColor: /* @__PURE__ */ __name(({ theme: e }) => e("colors"), "textColor"), textDecorationColor: /* @__PURE__ */ __name(({ theme: e }) => e("colors"), "textDecorationColor"), textDecorationThickness: { auto: "auto", "from-font": "from-font", 0: "0px", 1: "1px", 2: "2px", 4: "4px", 8: "8px" }, textUnderlineOffset: { auto: "auto", 0: "0px", 1: "1px", 2: "2px", 4: "4px", 8: "8px" }, textIndent: /* @__PURE__ */ __name(({ theme: e }) => ({ ...e("spacing") }), "textIndent"), textOpacity: /* @__PURE__ */ __name(({ theme: e }) => e("opacity"), "textOpacity"), transformOrigin: { center: "center", top: "top", "top-right": "top right", right: "right", "bottom-right": "bottom right", bottom: "bottom", "bottom-left": "bottom left", left: "left", "top-left": "top left" }, transitionDelay: { 75: "75ms", 100: "100ms", 150: "150ms", 200: "200ms", 300: "300ms", 500: "500ms", 700: "700ms", 1e3: "1000ms" }, transitionDuration: { DEFAULT: "150ms", 75: "75ms", 100: "100ms", 150: "150ms", 200: "200ms", 300: "300ms", 500: "500ms", 700: "700ms", 1e3: "1000ms" }, transitionProperty: { none: "none", all: "all", DEFAULT: "color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter", colors: "color, background-color, border-color, text-decoration-color, fill, stroke", opacity: "opacity", shadow: "box-shadow", transform: "transform" }, transitionTimingFunction: { DEFAULT: "cubic-bezier(0.4, 0, 0.2, 1)", linear: "linear", in: "cubic-bezier(0.4, 0, 1, 1)", out: "cubic-bezier(0, 0, 0.2, 1)", "in-out": "cubic-bezier(0.4, 0, 0.2, 1)" }, translate: /* @__PURE__ */ __name(({ theme: e }) => ({ ...e("spacing"), "1/2": "50%", "1/3": "33.333333%", "2/3": "66.666667%", "1/4": "25%", "2/4": "50%", "3/4": "75%", full: "100%" }), "translate"), width: /* @__PURE__ */ __name(({ theme: e }) => ({ auto: "auto", ...e("spacing"), "1/2": "50%", "1/3": "33.333333%", "2/3": "66.666667%", "1/4": "25%", "2/4": "50%", "3/4": "75%", "1/5": "20%", "2/5": "40%", "3/5": "60%", "4/5": "80%", "1/6": "16.666667%", "2/6": "33.333333%", "3/6": "50%", "4/6": "66.666667%", "5/6": "83.333333%", "1/12": "8.333333%", "2/12": "16.666667%", "3/12": "25%", "4/12": "33.333333%", "5/12": "41.666667%", "6/12": "50%", "7/12": "58.333333%", "8/12": "66.666667%", "9/12": "75%", "10/12": "83.333333%", "11/12": "91.666667%", full: "100%", screen: "100vw", min: "min-content", max: "max-content", fit: "fit-content" }), "width"), willChange: { auto: "auto", scroll: "scroll-position", contents: "contents", transform: "transform" }, zIndex: { auto: "auto", 0: "0", 10: "10", 20: "20", 30: "30", 40: "40", 50: "50" } }, variantOrder: ["first", "last", "odd", "even", "visited", "checked", "empty", "read-only", "group-hover", "group-focus", "focus-within", "hover", "focus", "focus-visible", "active", "disabled"], plugins: [] };
    });
    Ar = {};
    Zr(Ar, { default: /* @__PURE__ */ __name(() => zl, "default") });
    Ir = gr(() => {
      c();
      zl = { info(e, t) {
        console.info(...Array.isArray(e) ? [e] : [t, e]);
      }, warn(e, t) {
        console.warn(...Array.isArray(e) ? [e] : [t, e]);
      }, risk(e, t) {
        console.error(...Array.isArray(e) ? [e] : [t, e]);
      } };
    });
    ls = C((In) => {
      "use strict";
      c();
      Object.defineProperty(In, "__esModule", { value: true });
      Object.defineProperty(In, "default", { enumerable: true, get: /* @__PURE__ */ __name(() => Hl, "get") });
      var Gl = jl((Ir(), vr(Ar)));
      function jl(e) {
        return e && e.__esModule ? e : { default: e };
      }
      __name(jl, "jl");
      function Et({ version: e, from: t, to: n }) {
        Gl.default.warn(`${t}-color-renamed`, [`As of Tailwind CSS ${e}, \`${t}\` has been renamed to \`${n}\`.`, "Update your configuration file to silence this warning."]);
      }
      __name(Et, "Et");
      var Hl = { inherit: "inherit", current: "currentColor", transparent: "transparent", black: "#000", white: "#fff", slate: { 50: "#f8fafc", 100: "#f1f5f9", 200: "#e2e8f0", 300: "#cbd5e1", 400: "#94a3b8", 500: "#64748b", 600: "#475569", 700: "#334155", 800: "#1e293b", 900: "#0f172a" }, gray: { 50: "#f9fafb", 100: "#f3f4f6", 200: "#e5e7eb", 300: "#d1d5db", 400: "#9ca3af", 500: "#6b7280", 600: "#4b5563", 700: "#374151", 800: "#1f2937", 900: "#111827" }, zinc: { 50: "#fafafa", 100: "#f4f4f5", 200: "#e4e4e7", 300: "#d4d4d8", 400: "#a1a1aa", 500: "#71717a", 600: "#52525b", 700: "#3f3f46", 800: "#27272a", 900: "#18181b" }, neutral: { 50: "#fafafa", 100: "#f5f5f5", 200: "#e5e5e5", 300: "#d4d4d4", 400: "#a3a3a3", 500: "#737373", 600: "#525252", 700: "#404040", 800: "#262626", 900: "#171717" }, stone: { 50: "#fafaf9", 100: "#f5f5f4", 200: "#e7e5e4", 300: "#d6d3d1", 400: "#a8a29e", 500: "#78716c", 600: "#57534e", 700: "#44403c", 800: "#292524", 900: "#1c1917" }, red: { 50: "#fef2f2", 100: "#fee2e2", 200: "#fecaca", 300: "#fca5a5", 400: "#f87171", 500: "#ef4444", 600: "#dc2626", 700: "#b91c1c", 800: "#991b1b", 900: "#7f1d1d" }, orange: { 50: "#fff7ed", 100: "#ffedd5", 200: "#fed7aa", 300: "#fdba74", 400: "#fb923c", 500: "#f97316", 600: "#ea580c", 700: "#c2410c", 800: "#9a3412", 900: "#7c2d12" }, amber: { 50: "#fffbeb", 100: "#fef3c7", 200: "#fde68a", 300: "#fcd34d", 400: "#fbbf24", 500: "#f59e0b", 600: "#d97706", 700: "#b45309", 800: "#92400e", 900: "#78350f" }, yellow: { 50: "#fefce8", 100: "#fef9c3", 200: "#fef08a", 300: "#fde047", 400: "#facc15", 500: "#eab308", 600: "#ca8a04", 700: "#a16207", 800: "#854d0e", 900: "#713f12" }, lime: { 50: "#f7fee7", 100: "#ecfccb", 200: "#d9f99d", 300: "#bef264", 400: "#a3e635", 500: "#84cc16", 600: "#65a30d", 700: "#4d7c0f", 800: "#3f6212", 900: "#365314" }, green: { 50: "#f0fdf4", 100: "#dcfce7", 200: "#bbf7d0", 300: "#86efac", 400: "#4ade80", 500: "#22c55e", 600: "#16a34a", 700: "#15803d", 800: "#166534", 900: "#14532d" }, emerald: { 50: "#ecfdf5", 100: "#d1fae5", 200: "#a7f3d0", 300: "#6ee7b7", 400: "#34d399", 500: "#10b981", 600: "#059669", 700: "#047857", 800: "#065f46", 900: "#064e3b" }, teal: { 50: "#f0fdfa", 100: "#ccfbf1", 200: "#99f6e4", 300: "#5eead4", 400: "#2dd4bf", 500: "#14b8a6", 600: "#0d9488", 700: "#0f766e", 800: "#115e59", 900: "#134e4a" }, cyan: { 50: "#ecfeff", 100: "#cffafe", 200: "#a5f3fc", 300: "#67e8f9", 400: "#22d3ee", 500: "#06b6d4", 600: "#0891b2", 700: "#0e7490", 800: "#155e75", 900: "#164e63" }, sky: { 50: "#f0f9ff", 100: "#e0f2fe", 200: "#bae6fd", 300: "#7dd3fc", 400: "#38bdf8", 500: "#0ea5e9", 600: "#0284c7", 700: "#0369a1", 800: "#075985", 900: "#0c4a6e" }, blue: { 50: "#eff6ff", 100: "#dbeafe", 200: "#bfdbfe", 300: "#93c5fd", 400: "#60a5fa", 500: "#3b82f6", 600: "#2563eb", 700: "#1d4ed8", 800: "#1e40af", 900: "#1e3a8a" }, indigo: { 50: "#eef2ff", 100: "#e0e7ff", 200: "#c7d2fe", 300: "#a5b4fc", 400: "#818cf8", 500: "#6366f1", 600: "#4f46e5", 700: "#4338ca", 800: "#3730a3", 900: "#312e81" }, violet: { 50: "#f5f3ff", 100: "#ede9fe", 200: "#ddd6fe", 300: "#c4b5fd", 400: "#a78bfa", 500: "#8b5cf6", 600: "#7c3aed", 700: "#6d28d9", 800: "#5b21b6", 900: "#4c1d95" }, purple: { 50: "#faf5ff", 100: "#f3e8ff", 200: "#e9d5ff", 300: "#d8b4fe", 400: "#c084fc", 500: "#a855f7", 600: "#9333ea", 700: "#7e22ce", 800: "#6b21a8", 900: "#581c87" }, fuchsia: { 50: "#fdf4ff", 100: "#fae8ff", 200: "#f5d0fe", 300: "#f0abfc", 400: "#e879f9", 500: "#d946ef", 600: "#c026d3", 700: "#a21caf", 800: "#86198f", 900: "#701a75" }, pink: { 50: "#fdf2f8", 100: "#fce7f3", 200: "#fbcfe8", 300: "#f9a8d4", 400: "#f472b6", 500: "#ec4899", 600: "#db2777", 700: "#be185d", 800: "#9d174d", 900: "#831843" }, rose: { 50: "#fff1f2", 100: "#ffe4e6", 200: "#fecdd3", 300: "#fda4af", 400: "#fb7185", 500: "#f43f5e", 600: "#e11d48", 700: "#be123c", 800: "#9f1239", 900: "#881337" }, get lightBlue() {
        return Et({ version: "v2.2", from: "lightBlue", to: "sky" }), this.sky;
      }, get warmGray() {
        return Et({ version: "v3.0", from: "warmGray", to: "stone" }), this.stone;
      }, get trueGray() {
        return Et({ version: "v3.0", from: "trueGray", to: "neutral" }), this.neutral;
      }, get coolGray() {
        return Et({ version: "v3.0", from: "coolGray", to: "gray" }), this.gray;
      }, get blueGray() {
        return Et({ version: "v3.0", from: "blueGray", to: "slate" }), this.slate;
      } };
    });
    fs = C((Rn) => {
      "use strict";
      c();
      Object.defineProperty(Rn, "__esModule", { value: true });
      Object.defineProperty(Rn, "defaults", { enumerable: true, get: /* @__PURE__ */ __name(() => Vl, "get") });
      function Vl(e, ...t) {
        for (let i2 of t) {
          for (let s in i2) {
            var n;
            !(e == null || (n = e.hasOwnProperty) === null || n === void 0) && n.call(e, s) || (e[s] = i2[s]);
          }
          for (let s of Object.getOwnPropertySymbols(i2)) {
            var r;
            !(e == null || (r = e.hasOwnProperty) === null || r === void 0) && r.call(e, s) || (e[s] = i2[s]);
          }
        }
        return e;
      }
      __name(Vl, "Vl");
    });
    cs = C((Ln2) => {
      "use strict";
      c();
      Object.defineProperty(Ln2, "__esModule", { value: true });
      Object.defineProperty(Ln2, "toPath", { enumerable: true, get: /* @__PURE__ */ __name(() => Yl, "get") });
      function Yl(e) {
        if (Array.isArray(e))
          return e;
        let t = e.split("[").length - 1, n = e.split("]").length - 1;
        if (t !== n)
          throw new Error(`Path is invalid. Has unbalanced brackets: ${e}`);
        return e.split(/\.(?![^\[]*\])|[\[\]]/g).filter(Boolean);
      }
      __name(Yl, "Yl");
    });
    ps = C((Cn) => {
      "use strict";
      c();
      Object.defineProperty(Cn, "__esModule", { value: true });
      Object.defineProperty(Cn, "normalizeConfig", { enumerable: true, get: /* @__PURE__ */ __name(() => Ql, "get") });
      var Pt2 = Xl((Ir(), vr(Ar)));
      function ds(e) {
        if (typeof WeakMap != "function")
          return null;
        var t = /* @__PURE__ */ new WeakMap(), n = /* @__PURE__ */ new WeakMap();
        return (ds = /* @__PURE__ */ __name(function(r) {
          return r ? n : t;
        }, "ds"))(e);
      }
      __name(ds, "ds");
      function Xl(e, t) {
        if (!t && e && e.__esModule)
          return e;
        if (e === null || typeof e != "object" && typeof e != "function")
          return { default: e };
        var n = ds(t);
        if (n && n.has(e))
          return n.get(e);
        var r = {}, i2 = Object.defineProperty && Object.getOwnPropertyDescriptor;
        for (var s in e)
          if (s !== "default" && Object.prototype.hasOwnProperty.call(e, s)) {
            var o = i2 ? Object.getOwnPropertyDescriptor(e, s) : null;
            o && (o.get || o.set) ? Object.defineProperty(r, s, o) : r[s] = e[s];
          }
        return r.default = e, n && n.set(e, r), r;
      }
      __name(Xl, "Xl");
      function Ql(e) {
        if ((() => {
          if (e.purge || !e.content || !Array.isArray(e.content) && !(typeof e.content == "object" && e.content !== null))
            return false;
          if (Array.isArray(e.content))
            return e.content.every((r) => typeof r == "string" ? true : !(typeof (r == null ? void 0 : r.raw) != "string" || (r == null ? void 0 : r.extension) && typeof (r == null ? void 0 : r.extension) != "string"));
          if (typeof e.content == "object" && e.content !== null) {
            if (Object.keys(e.content).some((r) => !["files", "extract", "transform"].includes(r)))
              return false;
            if (Array.isArray(e.content.files)) {
              if (!e.content.files.every((r) => typeof r == "string" ? true : !(typeof (r == null ? void 0 : r.raw) != "string" || (r == null ? void 0 : r.extension) && typeof (r == null ? void 0 : r.extension) != "string")))
                return false;
              if (typeof e.content.extract == "object") {
                for (let r of Object.values(e.content.extract))
                  if (typeof r != "function")
                    return false;
              } else if (!(e.content.extract === void 0 || typeof e.content.extract == "function"))
                return false;
              if (typeof e.content.transform == "object") {
                for (let r of Object.values(e.content.transform))
                  if (typeof r != "function")
                    return false;
              } else if (!(e.content.transform === void 0 || typeof e.content.transform == "function"))
                return false;
            }
            return true;
          }
          return false;
        })() || Pt2.default.warn("purge-deprecation", ["The `purge`/`content` options have changed in Tailwind CSS v3.0.", "Update your configuration file to eliminate this warning.", "https://tailwindcss.com/docs/upgrade-guide#configure-content-sources"]), e.safelist = (() => {
          var r;
          let { content: i2, purge: s, safelist: o } = e;
          return Array.isArray(o) ? o : Array.isArray(i2 == null ? void 0 : i2.safelist) ? i2.safelist : Array.isArray(s == null ? void 0 : s.safelist) ? s.safelist : Array.isArray(s == null || (r = s.options) === null || r === void 0 ? void 0 : r.safelist) ? s.options.safelist : [];
        })(), typeof e.prefix == "function")
          Pt2.default.warn("prefix-function", ["As of Tailwind CSS v3.0, `prefix` cannot be a function.", "Update `prefix` in your configuration to be a string to eliminate this warning.", "https://tailwindcss.com/docs/upgrade-guide#prefix-cannot-be-a-function"]), e.prefix = "";
        else {
          var n;
          e.prefix = (n = e.prefix) !== null && n !== void 0 ? n : "";
        }
        e.content = { files: (() => {
          let { content: r, purge: i2 } = e;
          return Array.isArray(i2) ? i2 : Array.isArray(i2 == null ? void 0 : i2.content) ? i2.content : Array.isArray(r) ? r : Array.isArray(r == null ? void 0 : r.content) ? r.content : Array.isArray(r == null ? void 0 : r.files) ? r.files : [];
        })(), extract: (() => {
          let r = (() => {
            var o, a, u, l, f, d, g, h, p, v;
            return !((o = e.purge) === null || o === void 0) && o.extract ? e.purge.extract : !((a = e.content) === null || a === void 0) && a.extract ? e.content.extract : !((u = e.purge) === null || u === void 0 || (l = u.extract) === null || l === void 0) && l.DEFAULT ? e.purge.extract.DEFAULT : !((f = e.content) === null || f === void 0 || (d = f.extract) === null || d === void 0) && d.DEFAULT ? e.content.extract.DEFAULT : !((g = e.purge) === null || g === void 0 || (h = g.options) === null || h === void 0) && h.extractors ? e.purge.options.extractors : !((p = e.content) === null || p === void 0 || (v = p.options) === null || v === void 0) && v.extractors ? e.content.options.extractors : {};
          })(), i2 = {}, s = (() => {
            var o, a, u, l;
            if (!((o = e.purge) === null || o === void 0 || (a = o.options) === null || a === void 0) && a.defaultExtractor)
              return e.purge.options.defaultExtractor;
            if (!((u = e.content) === null || u === void 0 || (l = u.options) === null || l === void 0) && l.defaultExtractor)
              return e.content.options.defaultExtractor;
          })();
          if (s !== void 0 && (i2.DEFAULT = s), typeof r == "function")
            i2.DEFAULT = r;
          else if (Array.isArray(r))
            for (let { extensions: o, extractor: a } of r ?? [])
              for (let u of o)
                i2[u] = a;
          else
            typeof r == "object" && r !== null && Object.assign(i2, r);
          return i2;
        })(), transform: (() => {
          let r = (() => {
            var s, o, a, u, l, f;
            return !((s = e.purge) === null || s === void 0) && s.transform ? e.purge.transform : !((o = e.content) === null || o === void 0) && o.transform ? e.content.transform : !((a = e.purge) === null || a === void 0 || (u = a.transform) === null || u === void 0) && u.DEFAULT ? e.purge.transform.DEFAULT : !((l = e.content) === null || l === void 0 || (f = l.transform) === null || f === void 0) && f.DEFAULT ? e.content.transform.DEFAULT : {};
          })(), i2 = {};
          return typeof r == "function" && (i2.DEFAULT = r), typeof r == "object" && r !== null && Object.assign(i2, r), i2;
        })() };
        for (let r of e.content.files)
          if (typeof r == "string" && /{([^,]*?)}/g.test(r)) {
            Pt2.default.warn("invalid-glob-braces", [`The glob pattern ${(0, Pt2.dim)(r)} in your Tailwind CSS configuration is invalid.`, `Update it to ${(0, Pt2.dim)(r.replace(/{([^,]*?)}/g, "$1"))} to silence this warning.`]);
            break;
          }
        return e;
      }
      __name(Ql, "Ql");
    });
    hs = C((Dn2) => {
      "use strict";
      c();
      Object.defineProperty(Dn2, "__esModule", { value: true });
      Object.defineProperty(Dn2, "default", { enumerable: true, get: /* @__PURE__ */ __name(() => Kl, "get") });
      function Kl(e) {
        if (Object.prototype.toString.call(e) !== "[object Object]")
          return false;
        let t = Object.getPrototypeOf(e);
        return t === null || t === Object.prototype;
      }
      __name(Kl, "Kl");
    });
    ms = C((Nn2) => {
      "use strict";
      c();
      Object.defineProperty(Nn2, "__esModule", { value: true });
      Object.defineProperty(Nn2, "cloneDeep", { enumerable: true, get: /* @__PURE__ */ __name(() => Fn2, "get") });
      function Fn2(e) {
        return Array.isArray(e) ? e.map((t) => Fn2(t)) : typeof e == "object" && e !== null ? Object.fromEntries(Object.entries(e).map(([t, n]) => [t, Fn2(n)])) : e;
      }
      __name(Fn2, "Fn2");
    });
    Mn = C((Rr, gs) => {
      "use strict";
      c();
      Rr.__esModule = true;
      Rr.default = ef;
      function Jl(e) {
        for (var t = e.toLowerCase(), n = "", r = false, i2 = 0; i2 < 6 && t[i2] !== void 0; i2++) {
          var s = t.charCodeAt(i2), o = s >= 97 && s <= 102 || s >= 48 && s <= 57;
          if (r = s === 32, !o)
            break;
          n += t[i2];
        }
        if (n.length !== 0) {
          var a = parseInt(n, 16), u = a >= 55296 && a <= 57343;
          return u || a === 0 || a > 1114111 ? ["\uFFFD", n.length + (r ? 1 : 0)] : [String.fromCodePoint(a), n.length + (r ? 1 : 0)];
        }
      }
      __name(Jl, "Jl");
      var Zl = /\\/;
      function ef(e) {
        var t = Zl.test(e);
        if (!t)
          return e;
        for (var n = "", r = 0; r < e.length; r++) {
          if (e[r] === "\\") {
            var i2 = Jl(e.slice(r + 1, r + 7));
            if (i2 !== void 0) {
              n += i2[0], r += i2[1];
              continue;
            }
            if (e[r + 1] === "\\") {
              n += "\\", r++;
              continue;
            }
            e.length === r + 1 && (n += e[r]);
            continue;
          }
          n += e[r];
        }
        return n;
      }
      __name(ef, "ef");
      gs.exports = Rr.default;
    });
    bs = C((Lr, vs) => {
      "use strict";
      c();
      Lr.__esModule = true;
      Lr.default = tf;
      function tf(e) {
        for (var t = arguments.length, n = new Array(t > 1 ? t - 1 : 0), r = 1; r < t; r++)
          n[r - 1] = arguments[r];
        for (; n.length > 0; ) {
          var i2 = n.shift();
          if (!e[i2])
            return;
          e = e[i2];
        }
        return e;
      }
      __name(tf, "tf");
      vs.exports = Lr.default;
    });
    xs = C((Cr, ys) => {
      "use strict";
      c();
      Cr.__esModule = true;
      Cr.default = rf;
      function rf(e) {
        for (var t = arguments.length, n = new Array(t > 1 ? t - 1 : 0), r = 1; r < t; r++)
          n[r - 1] = arguments[r];
        for (; n.length > 0; ) {
          var i2 = n.shift();
          e[i2] || (e[i2] = {}), e = e[i2];
        }
      }
      __name(rf, "rf");
      ys.exports = Cr.default;
    });
    _s = C((Dr, ws) => {
      "use strict";
      c();
      Dr.__esModule = true;
      Dr.default = nf;
      function nf(e) {
        for (var t = "", n = e.indexOf("/*"), r = 0; n >= 0; ) {
          t = t + e.slice(r, n);
          var i2 = e.indexOf("*/", n + 2);
          if (i2 < 0)
            return t;
          r = i2 + 2, n = e.indexOf("/*", r);
        }
        return t = t + e.slice(r), t;
      }
      __name(nf, "nf");
      ws.exports = Dr.default;
    });
    At = C((Ae) => {
      "use strict";
      c();
      Ae.__esModule = true;
      Ae.stripComments = Ae.ensureObject = Ae.getProp = Ae.unesc = void 0;
      var of = Fr(Mn());
      Ae.unesc = of.default;
      var sf = Fr(bs());
      Ae.getProp = sf.default;
      var af = Fr(xs());
      Ae.ensureObject = af.default;
      var uf = Fr(_s());
      Ae.stripComments = uf.default;
      function Fr(e) {
        return e && e.__esModule ? e : { default: e };
      }
      __name(Fr, "Fr");
    });
    De = C((It, Ts) => {
      "use strict";
      c();
      It.__esModule = true;
      It.default = void 0;
      var Ss = At();
      function ks(e, t) {
        for (var n = 0; n < t.length; n++) {
          var r = t[n];
          r.enumerable = r.enumerable || false, r.configurable = true, "value" in r && (r.writable = true), Object.defineProperty(e, r.key, r);
        }
      }
      __name(ks, "ks");
      function lf(e, t, n) {
        return t && ks(e.prototype, t), n && ks(e, n), e;
      }
      __name(lf, "lf");
      var ff = /* @__PURE__ */ __name(function e(t, n) {
        if (typeof t != "object" || t === null)
          return t;
        var r = new t.constructor();
        for (var i2 in t)
          if (!!t.hasOwnProperty(i2)) {
            var s = t[i2], o = typeof s;
            i2 === "parent" && o === "object" ? n && (r[i2] = n) : s instanceof Array ? r[i2] = s.map(function(a) {
              return e(a, r);
            }) : r[i2] = e(s, r);
          }
        return r;
      }, "e"), cf = function() {
        function e(n) {
          n === void 0 && (n = {}), Object.assign(this, n), this.spaces = this.spaces || {}, this.spaces.before = this.spaces.before || "", this.spaces.after = this.spaces.after || "";
        }
        __name(e, "e");
        var t = e.prototype;
        return t.remove = function() {
          return this.parent && this.parent.removeChild(this), this.parent = void 0, this;
        }, t.replaceWith = function() {
          if (this.parent) {
            for (var r in arguments)
              this.parent.insertBefore(this, arguments[r]);
            this.remove();
          }
          return this;
        }, t.next = function() {
          return this.parent.at(this.parent.index(this) + 1);
        }, t.prev = function() {
          return this.parent.at(this.parent.index(this) - 1);
        }, t.clone = function(r) {
          r === void 0 && (r = {});
          var i2 = ff(this);
          for (var s in r)
            i2[s] = r[s];
          return i2;
        }, t.appendToPropertyAndEscape = function(r, i2, s) {
          this.raws || (this.raws = {});
          var o = this[r], a = this.raws[r];
          this[r] = o + i2, a || s !== i2 ? this.raws[r] = (a || o) + s : delete this.raws[r];
        }, t.setPropertyAndEscape = function(r, i2, s) {
          this.raws || (this.raws = {}), this[r] = i2, this.raws[r] = s;
        }, t.setPropertyWithoutEscape = function(r, i2) {
          this[r] = i2, this.raws && delete this.raws[r];
        }, t.isAtPosition = function(r, i2) {
          if (this.source && this.source.start && this.source.end)
            return !(this.source.start.line > r || this.source.end.line < r || this.source.start.line === r && this.source.start.column > i2 || this.source.end.line === r && this.source.end.column < i2);
        }, t.stringifyProperty = function(r) {
          return this.raws && this.raws[r] || this[r];
        }, t.valueToString = function() {
          return String(this.stringifyProperty("value"));
        }, t.toString = function() {
          return [this.rawSpaceBefore, this.valueToString(), this.rawSpaceAfter].join("");
        }, lf(e, [{ key: "rawSpaceBefore", get: /* @__PURE__ */ __name(function() {
          var r = this.raws && this.raws.spaces && this.raws.spaces.before;
          return r === void 0 && (r = this.spaces && this.spaces.before), r || "";
        }, "get"), set: /* @__PURE__ */ __name(function(r) {
          (0, Ss.ensureObject)(this, "raws", "spaces"), this.raws.spaces.before = r;
        }, "set") }, { key: "rawSpaceAfter", get: /* @__PURE__ */ __name(function() {
          var r = this.raws && this.raws.spaces && this.raws.spaces.after;
          return r === void 0 && (r = this.spaces.after), r || "";
        }, "get"), set: /* @__PURE__ */ __name(function(r) {
          (0, Ss.ensureObject)(this, "raws", "spaces"), this.raws.spaces.after = r;
        }, "set") }]), e;
      }();
      It.default = cf;
      Ts.exports = It.default;
    });
    le = C((X) => {
      "use strict";
      c();
      X.__esModule = true;
      X.UNIVERSAL = X.ATTRIBUTE = X.CLASS = X.COMBINATOR = X.COMMENT = X.ID = X.NESTING = X.PSEUDO = X.ROOT = X.SELECTOR = X.STRING = X.TAG = void 0;
      var df = "tag";
      X.TAG = df;
      var pf = "string";
      X.STRING = pf;
      var hf = "selector";
      X.SELECTOR = hf;
      var mf = "root";
      X.ROOT = mf;
      var gf = "pseudo";
      X.PSEUDO = gf;
      var vf = "nesting";
      X.NESTING = vf;
      var bf = "id";
      X.ID = bf;
      var yf = "comment";
      X.COMMENT = yf;
      var xf = "combinator";
      X.COMBINATOR = xf;
      var wf = "class";
      X.CLASS = wf;
      var _f = "attribute";
      X.ATTRIBUTE = _f;
      var Sf = "universal";
      X.UNIVERSAL = Sf;
    });
    Nr = C((Rt, As) => {
      "use strict";
      c();
      Rt.__esModule = true;
      Rt.default = void 0;
      var kf = Of(De()), Fe = Tf(le());
      function Ps() {
        if (typeof WeakMap != "function")
          return null;
        var e = /* @__PURE__ */ new WeakMap();
        return Ps = /* @__PURE__ */ __name(function() {
          return e;
        }, "Ps"), e;
      }
      __name(Ps, "Ps");
      function Tf(e) {
        if (e && e.__esModule)
          return e;
        if (e === null || typeof e != "object" && typeof e != "function")
          return { default: e };
        var t = Ps();
        if (t && t.has(e))
          return t.get(e);
        var n = {}, r = Object.defineProperty && Object.getOwnPropertyDescriptor;
        for (var i2 in e)
          if (Object.prototype.hasOwnProperty.call(e, i2)) {
            var s = r ? Object.getOwnPropertyDescriptor(e, i2) : null;
            s && (s.get || s.set) ? Object.defineProperty(n, i2, s) : n[i2] = e[i2];
          }
        return n.default = e, t && t.set(e, n), n;
      }
      __name(Tf, "Tf");
      function Of(e) {
        return e && e.__esModule ? e : { default: e };
      }
      __name(Of, "Of");
      function Ef(e, t) {
        var n;
        if (typeof Symbol > "u" || e[Symbol.iterator] == null) {
          if (Array.isArray(e) || (n = Pf(e)) || t && e && typeof e.length == "number") {
            n && (e = n);
            var r = 0;
            return function() {
              return r >= e.length ? { done: true } : { done: false, value: e[r++] };
            };
          }
          throw new TypeError(`Invalid attempt to iterate non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
        }
        return n = e[Symbol.iterator](), n.next.bind(n);
      }
      __name(Ef, "Ef");
      function Pf(e, t) {
        if (!!e) {
          if (typeof e == "string")
            return Os(e, t);
          var n = Object.prototype.toString.call(e).slice(8, -1);
          if (n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set")
            return Array.from(e);
          if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
            return Os(e, t);
        }
      }
      __name(Pf, "Pf");
      function Os(e, t) {
        (t == null || t > e.length) && (t = e.length);
        for (var n = 0, r = new Array(t); n < t; n++)
          r[n] = e[n];
        return r;
      }
      __name(Os, "Os");
      function Es(e, t) {
        for (var n = 0; n < t.length; n++) {
          var r = t[n];
          r.enumerable = r.enumerable || false, r.configurable = true, "value" in r && (r.writable = true), Object.defineProperty(e, r.key, r);
        }
      }
      __name(Es, "Es");
      function Af(e, t, n) {
        return t && Es(e.prototype, t), n && Es(e, n), e;
      }
      __name(Af, "Af");
      function If(e, t) {
        e.prototype = Object.create(t.prototype), e.prototype.constructor = e, $n(e, t);
      }
      __name(If, "If");
      function $n(e, t) {
        return $n = Object.setPrototypeOf || function(r, i2) {
          return r.__proto__ = i2, r;
        }, $n(e, t);
      }
      __name($n, "$n");
      var Rf = function(e) {
        If(t, e);
        function t(r) {
          var i2;
          return i2 = e.call(this, r) || this, i2.nodes || (i2.nodes = []), i2;
        }
        __name(t, "t");
        var n = t.prototype;
        return n.append = function(i2) {
          return i2.parent = this, this.nodes.push(i2), this;
        }, n.prepend = function(i2) {
          return i2.parent = this, this.nodes.unshift(i2), this;
        }, n.at = function(i2) {
          return this.nodes[i2];
        }, n.index = function(i2) {
          return typeof i2 == "number" ? i2 : this.nodes.indexOf(i2);
        }, n.removeChild = function(i2) {
          i2 = this.index(i2), this.at(i2).parent = void 0, this.nodes.splice(i2, 1);
          var s;
          for (var o in this.indexes)
            s = this.indexes[o], s >= i2 && (this.indexes[o] = s - 1);
          return this;
        }, n.removeAll = function() {
          for (var i2 = Ef(this.nodes), s; !(s = i2()).done; ) {
            var o = s.value;
            o.parent = void 0;
          }
          return this.nodes = [], this;
        }, n.empty = function() {
          return this.removeAll();
        }, n.insertAfter = function(i2, s) {
          s.parent = this;
          var o = this.index(i2);
          this.nodes.splice(o + 1, 0, s), s.parent = this;
          var a;
          for (var u in this.indexes)
            a = this.indexes[u], o <= a && (this.indexes[u] = a + 1);
          return this;
        }, n.insertBefore = function(i2, s) {
          s.parent = this;
          var o = this.index(i2);
          this.nodes.splice(o, 0, s), s.parent = this;
          var a;
          for (var u in this.indexes)
            a = this.indexes[u], a <= o && (this.indexes[u] = a + 1);
          return this;
        }, n._findChildAtPosition = function(i2, s) {
          var o = void 0;
          return this.each(function(a) {
            if (a.atPosition) {
              var u = a.atPosition(i2, s);
              if (u)
                return o = u, false;
            } else if (a.isAtPosition(i2, s))
              return o = a, false;
          }), o;
        }, n.atPosition = function(i2, s) {
          if (this.isAtPosition(i2, s))
            return this._findChildAtPosition(i2, s) || this;
        }, n._inferEndPosition = function() {
          this.last && this.last.source && this.last.source.end && (this.source = this.source || {}, this.source.end = this.source.end || {}, Object.assign(this.source.end, this.last.source.end));
        }, n.each = function(i2) {
          this.lastEach || (this.lastEach = 0), this.indexes || (this.indexes = {}), this.lastEach++;
          var s = this.lastEach;
          if (this.indexes[s] = 0, !!this.length) {
            for (var o, a; this.indexes[s] < this.length && (o = this.indexes[s], a = i2(this.at(o), o), a !== false); )
              this.indexes[s] += 1;
            if (delete this.indexes[s], a === false)
              return false;
          }
        }, n.walk = function(i2) {
          return this.each(function(s, o) {
            var a = i2(s, o);
            if (a !== false && s.length && (a = s.walk(i2)), a === false)
              return false;
          });
        }, n.walkAttributes = function(i2) {
          var s = this;
          return this.walk(function(o) {
            if (o.type === Fe.ATTRIBUTE)
              return i2.call(s, o);
          });
        }, n.walkClasses = function(i2) {
          var s = this;
          return this.walk(function(o) {
            if (o.type === Fe.CLASS)
              return i2.call(s, o);
          });
        }, n.walkCombinators = function(i2) {
          var s = this;
          return this.walk(function(o) {
            if (o.type === Fe.COMBINATOR)
              return i2.call(s, o);
          });
        }, n.walkComments = function(i2) {
          var s = this;
          return this.walk(function(o) {
            if (o.type === Fe.COMMENT)
              return i2.call(s, o);
          });
        }, n.walkIds = function(i2) {
          var s = this;
          return this.walk(function(o) {
            if (o.type === Fe.ID)
              return i2.call(s, o);
          });
        }, n.walkNesting = function(i2) {
          var s = this;
          return this.walk(function(o) {
            if (o.type === Fe.NESTING)
              return i2.call(s, o);
          });
        }, n.walkPseudos = function(i2) {
          var s = this;
          return this.walk(function(o) {
            if (o.type === Fe.PSEUDO)
              return i2.call(s, o);
          });
        }, n.walkTags = function(i2) {
          var s = this;
          return this.walk(function(o) {
            if (o.type === Fe.TAG)
              return i2.call(s, o);
          });
        }, n.walkUniversals = function(i2) {
          var s = this;
          return this.walk(function(o) {
            if (o.type === Fe.UNIVERSAL)
              return i2.call(s, o);
          });
        }, n.split = function(i2) {
          var s = this, o = [];
          return this.reduce(function(a, u, l) {
            var f = i2.call(s, u);
            return o.push(u), f ? (a.push(o), o = []) : l === s.length - 1 && a.push(o), a;
          }, []);
        }, n.map = function(i2) {
          return this.nodes.map(i2);
        }, n.reduce = function(i2, s) {
          return this.nodes.reduce(i2, s);
        }, n.every = function(i2) {
          return this.nodes.every(i2);
        }, n.some = function(i2) {
          return this.nodes.some(i2);
        }, n.filter = function(i2) {
          return this.nodes.filter(i2);
        }, n.sort = function(i2) {
          return this.nodes.sort(i2);
        }, n.toString = function() {
          return this.map(String).join("");
        }, Af(t, [{ key: "first", get: /* @__PURE__ */ __name(function() {
          return this.at(0);
        }, "get") }, { key: "last", get: /* @__PURE__ */ __name(function() {
          return this.at(this.length - 1);
        }, "get") }, { key: "length", get: /* @__PURE__ */ __name(function() {
          return this.nodes.length;
        }, "get") }]), t;
      }(kf.default);
      Rt.default = Rf;
      As.exports = Rt.default;
    });
    qn = C((Lt, Rs) => {
      "use strict";
      c();
      Lt.__esModule = true;
      Lt.default = void 0;
      var Lf = Df(Nr()), Cf = le();
      function Df(e) {
        return e && e.__esModule ? e : { default: e };
      }
      __name(Df, "Df");
      function Is(e, t) {
        for (var n = 0; n < t.length; n++) {
          var r = t[n];
          r.enumerable = r.enumerable || false, r.configurable = true, "value" in r && (r.writable = true), Object.defineProperty(e, r.key, r);
        }
      }
      __name(Is, "Is");
      function Ff(e, t, n) {
        return t && Is(e.prototype, t), n && Is(e, n), e;
      }
      __name(Ff, "Ff");
      function Nf(e, t) {
        e.prototype = Object.create(t.prototype), e.prototype.constructor = e, Wn2(e, t);
      }
      __name(Nf, "Nf");
      function Wn2(e, t) {
        return Wn2 = Object.setPrototypeOf || function(r, i2) {
          return r.__proto__ = i2, r;
        }, Wn2(e, t);
      }
      __name(Wn2, "Wn2");
      var Mf = function(e) {
        Nf(t, e);
        function t(r) {
          var i2;
          return i2 = e.call(this, r) || this, i2.type = Cf.ROOT, i2;
        }
        __name(t, "t");
        var n = t.prototype;
        return n.toString = function() {
          var i2 = this.reduce(function(s, o) {
            return s.push(String(o)), s;
          }, []).join(",");
          return this.trailingComma ? i2 + "," : i2;
        }, n.error = function(i2, s) {
          return this._error ? this._error(i2, s) : new Error(i2);
        }, Ff(t, [{ key: "errorGenerator", set: /* @__PURE__ */ __name(function(i2) {
          this._error = i2;
        }, "set") }]), t;
      }(Lf.default);
      Lt.default = Mf;
      Rs.exports = Lt.default;
    });
    Un = C((Ct, Ls) => {
      "use strict";
      c();
      Ct.__esModule = true;
      Ct.default = void 0;
      var $f = qf(Nr()), Wf = le();
      function qf(e) {
        return e && e.__esModule ? e : { default: e };
      }
      __name(qf, "qf");
      function Bf(e, t) {
        e.prototype = Object.create(t.prototype), e.prototype.constructor = e, Bn(e, t);
      }
      __name(Bf, "Bf");
      function Bn(e, t) {
        return Bn = Object.setPrototypeOf || function(r, i2) {
          return r.__proto__ = i2, r;
        }, Bn(e, t);
      }
      __name(Bn, "Bn");
      var Uf = function(e) {
        Bf(t, e);
        function t(n) {
          var r;
          return r = e.call(this, n) || this, r.type = Wf.SELECTOR, r;
        }
        __name(t, "t");
        return t;
      }($f.default);
      Ct.default = Uf;
      Ls.exports = Ct.default;
    });
    Mr = C((Cg, Cs) => {
      "use strict";
      c();
      var zf = {}, Gf = zf.hasOwnProperty, jf = /* @__PURE__ */ __name(function(t, n) {
        if (!t)
          return n;
        var r = {};
        for (var i2 in n)
          r[i2] = Gf.call(t, i2) ? t[i2] : n[i2];
        return r;
      }, "jf"), Hf = /[ -,\.\/:-@\[-\^`\{-~]/, Vf = /[ -,\.\/:-@\[\]\^`\{-~]/, Yf = /(^|\\+)?(\\[A-F0-9]{1,6})\x20(?![a-fA-F0-9\x20])/g, zn = /* @__PURE__ */ __name(function e(t, n) {
        n = jf(n, e.options), n.quotes != "single" && n.quotes != "double" && (n.quotes = "single");
        for (var r = n.quotes == "double" ? '"' : "'", i2 = n.isIdentifier, s = t.charAt(0), o = "", a = 0, u = t.length; a < u; ) {
          var l = t.charAt(a++), f = l.charCodeAt(), d = void 0;
          if (f < 32 || f > 126) {
            if (f >= 55296 && f <= 56319 && a < u) {
              var g = t.charCodeAt(a++);
              (g & 64512) == 56320 ? f = ((f & 1023) << 10) + (g & 1023) + 65536 : a--;
            }
            d = "\\" + f.toString(16).toUpperCase() + " ";
          } else
            n.escapeEverything ? Hf.test(l) ? d = "\\" + l : d = "\\" + f.toString(16).toUpperCase() + " " : /[\t\n\f\r\x0B]/.test(l) ? d = "\\" + f.toString(16).toUpperCase() + " " : l == "\\" || !i2 && (l == '"' && r == l || l == "'" && r == l) || i2 && Vf.test(l) ? d = "\\" + l : d = l;
          o += d;
        }
        return i2 && (/^-[-\d]/.test(o) ? o = "\\-" + o.slice(1) : /\d/.test(s) && (o = "\\3" + s + " " + o.slice(1))), o = o.replace(Yf, function(h, p, v) {
          return p && p.length % 2 ? h : (p || "") + v;
        }), !i2 && n.wrap ? r + o + r : o;
      }, "e");
      zn.options = { escapeEverything: false, isIdentifier: false, quotes: "single", wrap: false };
      zn.version = "3.0.0";
      Cs.exports = zn;
    });
    jn = C((Dt, Ns) => {
      "use strict";
      c();
      Dt.__esModule = true;
      Dt.default = void 0;
      var Xf = Fs(Mr()), Qf = At(), Kf = Fs(De()), Jf = le();
      function Fs(e) {
        return e && e.__esModule ? e : { default: e };
      }
      __name(Fs, "Fs");
      function Ds(e, t) {
        for (var n = 0; n < t.length; n++) {
          var r = t[n];
          r.enumerable = r.enumerable || false, r.configurable = true, "value" in r && (r.writable = true), Object.defineProperty(e, r.key, r);
        }
      }
      __name(Ds, "Ds");
      function Zf(e, t, n) {
        return t && Ds(e.prototype, t), n && Ds(e, n), e;
      }
      __name(Zf, "Zf");
      function ec2(e, t) {
        e.prototype = Object.create(t.prototype), e.prototype.constructor = e, Gn(e, t);
      }
      __name(ec2, "ec2");
      function Gn(e, t) {
        return Gn = Object.setPrototypeOf || function(r, i2) {
          return r.__proto__ = i2, r;
        }, Gn(e, t);
      }
      __name(Gn, "Gn");
      var tc = function(e) {
        ec2(t, e);
        function t(r) {
          var i2;
          return i2 = e.call(this, r) || this, i2.type = Jf.CLASS, i2._constructed = true, i2;
        }
        __name(t, "t");
        var n = t.prototype;
        return n.valueToString = function() {
          return "." + e.prototype.valueToString.call(this);
        }, Zf(t, [{ key: "value", get: /* @__PURE__ */ __name(function() {
          return this._value;
        }, "get"), set: /* @__PURE__ */ __name(function(i2) {
          if (this._constructed) {
            var s = (0, Xf.default)(i2, { isIdentifier: true });
            s !== i2 ? ((0, Qf.ensureObject)(this, "raws"), this.raws.value = s) : this.raws && delete this.raws.value;
          }
          this._value = i2;
        }, "set") }]), t;
      }(Kf.default);
      Dt.default = tc;
      Ns.exports = Dt.default;
    });
    Vn = C((Ft, Ms) => {
      "use strict";
      c();
      Ft.__esModule = true;
      Ft.default = void 0;
      var rc = ic(De()), nc = le();
      function ic(e) {
        return e && e.__esModule ? e : { default: e };
      }
      __name(ic, "ic");
      function oc(e, t) {
        e.prototype = Object.create(t.prototype), e.prototype.constructor = e, Hn2(e, t);
      }
      __name(oc, "oc");
      function Hn2(e, t) {
        return Hn2 = Object.setPrototypeOf || function(r, i2) {
          return r.__proto__ = i2, r;
        }, Hn2(e, t);
      }
      __name(Hn2, "Hn2");
      var sc = function(e) {
        oc(t, e);
        function t(n) {
          var r;
          return r = e.call(this, n) || this, r.type = nc.COMMENT, r;
        }
        __name(t, "t");
        return t;
      }(rc.default);
      Ft.default = sc;
      Ms.exports = Ft.default;
    });
    Xn = C((Nt, $s) => {
      "use strict";
      c();
      Nt.__esModule = true;
      Nt.default = void 0;
      var ac = lc(De()), uc = le();
      function lc(e) {
        return e && e.__esModule ? e : { default: e };
      }
      __name(lc, "lc");
      function fc(e, t) {
        e.prototype = Object.create(t.prototype), e.prototype.constructor = e, Yn(e, t);
      }
      __name(fc, "fc");
      function Yn(e, t) {
        return Yn = Object.setPrototypeOf || function(r, i2) {
          return r.__proto__ = i2, r;
        }, Yn(e, t);
      }
      __name(Yn, "Yn");
      var cc = function(e) {
        fc(t, e);
        function t(r) {
          var i2;
          return i2 = e.call(this, r) || this, i2.type = uc.ID, i2;
        }
        __name(t, "t");
        var n = t.prototype;
        return n.valueToString = function() {
          return "#" + e.prototype.valueToString.call(this);
        }, t;
      }(ac.default);
      Nt.default = cc;
      $s.exports = Nt.default;
    });
    $r = C((Mt, Bs) => {
      "use strict";
      c();
      Mt.__esModule = true;
      Mt.default = void 0;
      var dc = qs(Mr()), pc = At(), hc = qs(De());
      function qs(e) {
        return e && e.__esModule ? e : { default: e };
      }
      __name(qs, "qs");
      function Ws(e, t) {
        for (var n = 0; n < t.length; n++) {
          var r = t[n];
          r.enumerable = r.enumerable || false, r.configurable = true, "value" in r && (r.writable = true), Object.defineProperty(e, r.key, r);
        }
      }
      __name(Ws, "Ws");
      function mc(e, t, n) {
        return t && Ws(e.prototype, t), n && Ws(e, n), e;
      }
      __name(mc, "mc");
      function gc(e, t) {
        e.prototype = Object.create(t.prototype), e.prototype.constructor = e, Qn(e, t);
      }
      __name(gc, "gc");
      function Qn(e, t) {
        return Qn = Object.setPrototypeOf || function(r, i2) {
          return r.__proto__ = i2, r;
        }, Qn(e, t);
      }
      __name(Qn, "Qn");
      var vc = function(e) {
        gc(t, e);
        function t() {
          return e.apply(this, arguments) || this;
        }
        __name(t, "t");
        var n = t.prototype;
        return n.qualifiedName = function(i2) {
          return this.namespace ? this.namespaceString + "|" + i2 : i2;
        }, n.valueToString = function() {
          return this.qualifiedName(e.prototype.valueToString.call(this));
        }, mc(t, [{ key: "namespace", get: /* @__PURE__ */ __name(function() {
          return this._namespace;
        }, "get"), set: /* @__PURE__ */ __name(function(i2) {
          if (i2 === true || i2 === "*" || i2 === "&") {
            this._namespace = i2, this.raws && delete this.raws.namespace;
            return;
          }
          var s = (0, dc.default)(i2, { isIdentifier: true });
          this._namespace = i2, s !== i2 ? ((0, pc.ensureObject)(this, "raws"), this.raws.namespace = s) : this.raws && delete this.raws.namespace;
        }, "set") }, { key: "ns", get: /* @__PURE__ */ __name(function() {
          return this._namespace;
        }, "get"), set: /* @__PURE__ */ __name(function(i2) {
          this.namespace = i2;
        }, "set") }, { key: "namespaceString", get: /* @__PURE__ */ __name(function() {
          if (this.namespace) {
            var i2 = this.stringifyProperty("namespace");
            return i2 === true ? "" : i2;
          } else
            return "";
        }, "get") }]), t;
      }(hc.default);
      Mt.default = vc;
      Bs.exports = Mt.default;
    });
    Jn = C(($t, Us) => {
      "use strict";
      c();
      $t.__esModule = true;
      $t.default = void 0;
      var bc = xc($r()), yc = le();
      function xc(e) {
        return e && e.__esModule ? e : { default: e };
      }
      __name(xc, "xc");
      function wc(e, t) {
        e.prototype = Object.create(t.prototype), e.prototype.constructor = e, Kn(e, t);
      }
      __name(wc, "wc");
      function Kn(e, t) {
        return Kn = Object.setPrototypeOf || function(r, i2) {
          return r.__proto__ = i2, r;
        }, Kn(e, t);
      }
      __name(Kn, "Kn");
      var _c = function(e) {
        wc(t, e);
        function t(n) {
          var r;
          return r = e.call(this, n) || this, r.type = yc.TAG, r;
        }
        __name(t, "t");
        return t;
      }(bc.default);
      $t.default = _c;
      Us.exports = $t.default;
    });
    ei = C((Wt, zs) => {
      "use strict";
      c();
      Wt.__esModule = true;
      Wt.default = void 0;
      var Sc = Tc(De()), kc = le();
      function Tc(e) {
        return e && e.__esModule ? e : { default: e };
      }
      __name(Tc, "Tc");
      function Oc(e, t) {
        e.prototype = Object.create(t.prototype), e.prototype.constructor = e, Zn(e, t);
      }
      __name(Oc, "Oc");
      function Zn(e, t) {
        return Zn = Object.setPrototypeOf || function(r, i2) {
          return r.__proto__ = i2, r;
        }, Zn(e, t);
      }
      __name(Zn, "Zn");
      var Ec = function(e) {
        Oc(t, e);
        function t(n) {
          var r;
          return r = e.call(this, n) || this, r.type = kc.STRING, r;
        }
        __name(t, "t");
        return t;
      }(Sc.default);
      Wt.default = Ec;
      zs.exports = Wt.default;
    });
    ri = C((qt, Gs) => {
      "use strict";
      c();
      qt.__esModule = true;
      qt.default = void 0;
      var Pc = Ic(Nr()), Ac = le();
      function Ic(e) {
        return e && e.__esModule ? e : { default: e };
      }
      __name(Ic, "Ic");
      function Rc(e, t) {
        e.prototype = Object.create(t.prototype), e.prototype.constructor = e, ti(e, t);
      }
      __name(Rc, "Rc");
      function ti(e, t) {
        return ti = Object.setPrototypeOf || function(r, i2) {
          return r.__proto__ = i2, r;
        }, ti(e, t);
      }
      __name(ti, "ti");
      var Lc = function(e) {
        Rc(t, e);
        function t(r) {
          var i2;
          return i2 = e.call(this, r) || this, i2.type = Ac.PSEUDO, i2;
        }
        __name(t, "t");
        var n = t.prototype;
        return n.toString = function() {
          var i2 = this.length ? "(" + this.map(String).join(",") + ")" : "";
          return [this.rawSpaceBefore, this.stringifyProperty("value"), i2, this.rawSpaceAfter].join("");
        }, t;
      }(Pc.default);
      qt.default = Lc;
      Gs.exports = qt.default;
    });
    Hs = C((Dg, js) => {
      c();
      js.exports = function(t, n) {
        return function(...r) {
          return console.warn(n), t(...r);
        };
      };
    });
    ui = C((zt) => {
      "use strict";
      c();
      zt.__esModule = true;
      zt.unescapeValue = ai;
      zt.default = void 0;
      var Bt = si(Mr()), Cc = si(Mn()), Dc = si($r()), Fc = le(), ni;
      function si(e) {
        return e && e.__esModule ? e : { default: e };
      }
      __name(si, "si");
      function Vs(e, t) {
        for (var n = 0; n < t.length; n++) {
          var r = t[n];
          r.enumerable = r.enumerable || false, r.configurable = true, "value" in r && (r.writable = true), Object.defineProperty(e, r.key, r);
        }
      }
      __name(Vs, "Vs");
      function Nc(e, t, n) {
        return t && Vs(e.prototype, t), n && Vs(e, n), e;
      }
      __name(Nc, "Nc");
      function Mc(e, t) {
        e.prototype = Object.create(t.prototype), e.prototype.constructor = e, oi(e, t);
      }
      __name(Mc, "Mc");
      function oi(e, t) {
        return oi = Object.setPrototypeOf || function(r, i2) {
          return r.__proto__ = i2, r;
        }, oi(e, t);
      }
      __name(oi, "oi");
      var Ut = Hs(), $c = /^('|")([^]*)\1$/, Wc = Ut(function() {
      }, "Assigning an attribute a value containing characters that might need to be escaped is deprecated. Call attribute.setValue() instead."), qc = Ut(function() {
      }, "Assigning attr.quoted is deprecated and has no effect. Assign to attr.quoteMark instead."), Bc = Ut(function() {
      }, "Constructing an Attribute selector with a value without specifying quoteMark is deprecated. Note: The value should be unescaped now.");
      function ai(e) {
        var t = false, n = null, r = e, i2 = r.match($c);
        return i2 && (n = i2[1], r = i2[2]), r = (0, Cc.default)(r), r !== e && (t = true), { deprecatedUsage: t, unescaped: r, quoteMark: n };
      }
      __name(ai, "ai");
      function Uc(e) {
        if (e.quoteMark !== void 0 || e.value === void 0)
          return e;
        Bc();
        var t = ai(e.value), n = t.quoteMark, r = t.unescaped;
        return e.raws || (e.raws = {}), e.raws.value === void 0 && (e.raws.value = e.value), e.value = r, e.quoteMark = n, e;
      }
      __name(Uc, "Uc");
      var Wr = function(e) {
        Mc(t, e);
        function t(r) {
          var i2;
          return r === void 0 && (r = {}), i2 = e.call(this, Uc(r)) || this, i2.type = Fc.ATTRIBUTE, i2.raws = i2.raws || {}, Object.defineProperty(i2.raws, "unquoted", { get: Ut(function() {
            return i2.value;
          }, "attr.raws.unquoted is deprecated. Call attr.value instead."), set: Ut(function() {
            return i2.value;
          }, "Setting attr.raws.unquoted is deprecated and has no effect. attr.value is unescaped by default now.") }), i2._constructed = true, i2;
        }
        __name(t, "t");
        var n = t.prototype;
        return n.getQuotedValue = function(i2) {
          i2 === void 0 && (i2 = {});
          var s = this._determineQuoteMark(i2), o = ii[s], a = (0, Bt.default)(this._value, o);
          return a;
        }, n._determineQuoteMark = function(i2) {
          return i2.smart ? this.smartQuoteMark(i2) : this.preferredQuoteMark(i2);
        }, n.setValue = function(i2, s) {
          s === void 0 && (s = {}), this._value = i2, this._quoteMark = this._determineQuoteMark(s), this._syncRawValue();
        }, n.smartQuoteMark = function(i2) {
          var s = this.value, o = s.replace(/[^']/g, "").length, a = s.replace(/[^"]/g, "").length;
          if (o + a === 0) {
            var u = (0, Bt.default)(s, { isIdentifier: true });
            if (u === s)
              return t.NO_QUOTE;
            var l = this.preferredQuoteMark(i2);
            if (l === t.NO_QUOTE) {
              var f = this.quoteMark || i2.quoteMark || t.DOUBLE_QUOTE, d = ii[f], g = (0, Bt.default)(s, d);
              if (g.length < u.length)
                return f;
            }
            return l;
          } else
            return a === o ? this.preferredQuoteMark(i2) : a < o ? t.DOUBLE_QUOTE : t.SINGLE_QUOTE;
        }, n.preferredQuoteMark = function(i2) {
          var s = i2.preferCurrentQuoteMark ? this.quoteMark : i2.quoteMark;
          return s === void 0 && (s = i2.preferCurrentQuoteMark ? i2.quoteMark : this.quoteMark), s === void 0 && (s = t.DOUBLE_QUOTE), s;
        }, n._syncRawValue = function() {
          var i2 = (0, Bt.default)(this._value, ii[this.quoteMark]);
          i2 === this._value ? this.raws && delete this.raws.value : this.raws.value = i2;
        }, n._handleEscapes = function(i2, s) {
          if (this._constructed) {
            var o = (0, Bt.default)(s, { isIdentifier: true });
            o !== s ? this.raws[i2] = o : delete this.raws[i2];
          }
        }, n._spacesFor = function(i2) {
          var s = { before: "", after: "" }, o = this.spaces[i2] || {}, a = this.raws.spaces && this.raws.spaces[i2] || {};
          return Object.assign(s, o, a);
        }, n._stringFor = function(i2, s, o) {
          s === void 0 && (s = i2), o === void 0 && (o = Ys);
          var a = this._spacesFor(s);
          return o(this.stringifyProperty(i2), a);
        }, n.offsetOf = function(i2) {
          var s = 1, o = this._spacesFor("attribute");
          if (s += o.before.length, i2 === "namespace" || i2 === "ns")
            return this.namespace ? s : -1;
          if (i2 === "attributeNS" || (s += this.namespaceString.length, this.namespace && (s += 1), i2 === "attribute"))
            return s;
          s += this.stringifyProperty("attribute").length, s += o.after.length;
          var a = this._spacesFor("operator");
          s += a.before.length;
          var u = this.stringifyProperty("operator");
          if (i2 === "operator")
            return u ? s : -1;
          s += u.length, s += a.after.length;
          var l = this._spacesFor("value");
          s += l.before.length;
          var f = this.stringifyProperty("value");
          if (i2 === "value")
            return f ? s : -1;
          s += f.length, s += l.after.length;
          var d = this._spacesFor("insensitive");
          return s += d.before.length, i2 === "insensitive" && this.insensitive ? s : -1;
        }, n.toString = function() {
          var i2 = this, s = [this.rawSpaceBefore, "["];
          return s.push(this._stringFor("qualifiedAttribute", "attribute")), this.operator && (this.value || this.value === "") && (s.push(this._stringFor("operator")), s.push(this._stringFor("value")), s.push(this._stringFor("insensitiveFlag", "insensitive", function(o, a) {
            return o.length > 0 && !i2.quoted && a.before.length === 0 && !(i2.spaces.value && i2.spaces.value.after) && (a.before = " "), Ys(o, a);
          }))), s.push("]"), s.push(this.rawSpaceAfter), s.join("");
        }, Nc(t, [{ key: "quoted", get: /* @__PURE__ */ __name(function() {
          var i2 = this.quoteMark;
          return i2 === "'" || i2 === '"';
        }, "get"), set: /* @__PURE__ */ __name(function(i2) {
          qc();
        }, "set") }, { key: "quoteMark", get: /* @__PURE__ */ __name(function() {
          return this._quoteMark;
        }, "get"), set: /* @__PURE__ */ __name(function(i2) {
          if (!this._constructed) {
            this._quoteMark = i2;
            return;
          }
          this._quoteMark !== i2 && (this._quoteMark = i2, this._syncRawValue());
        }, "set") }, { key: "qualifiedAttribute", get: /* @__PURE__ */ __name(function() {
          return this.qualifiedName(this.raws.attribute || this.attribute);
        }, "get") }, { key: "insensitiveFlag", get: /* @__PURE__ */ __name(function() {
          return this.insensitive ? "i" : "";
        }, "get") }, { key: "value", get: /* @__PURE__ */ __name(function() {
          return this._value;
        }, "get"), set: /* @__PURE__ */ __name(function(i2) {
          if (this._constructed) {
            var s = ai(i2), o = s.deprecatedUsage, a = s.unescaped, u = s.quoteMark;
            if (o && Wc(), a === this._value && u === this._quoteMark)
              return;
            this._value = a, this._quoteMark = u, this._syncRawValue();
          } else
            this._value = i2;
        }, "set") }, { key: "attribute", get: /* @__PURE__ */ __name(function() {
          return this._attribute;
        }, "get"), set: /* @__PURE__ */ __name(function(i2) {
          this._handleEscapes("attribute", i2), this._attribute = i2;
        }, "set") }]), t;
      }(Dc.default);
      zt.default = Wr;
      Wr.NO_QUOTE = null;
      Wr.SINGLE_QUOTE = "'";
      Wr.DOUBLE_QUOTE = '"';
      var ii = (ni = { "'": { quotes: "single", wrap: true }, '"': { quotes: "double", wrap: true } }, ni[null] = { isIdentifier: true }, ni);
      function Ys(e, t) {
        return "" + t.before + e + t.after;
      }
      __name(Ys, "Ys");
    });
    fi = C((Gt, Xs) => {
      "use strict";
      c();
      Gt.__esModule = true;
      Gt.default = void 0;
      var zc = jc($r()), Gc = le();
      function jc(e) {
        return e && e.__esModule ? e : { default: e };
      }
      __name(jc, "jc");
      function Hc(e, t) {
        e.prototype = Object.create(t.prototype), e.prototype.constructor = e, li(e, t);
      }
      __name(Hc, "Hc");
      function li(e, t) {
        return li = Object.setPrototypeOf || function(r, i2) {
          return r.__proto__ = i2, r;
        }, li(e, t);
      }
      __name(li, "li");
      var Vc = function(e) {
        Hc(t, e);
        function t(n) {
          var r;
          return r = e.call(this, n) || this, r.type = Gc.UNIVERSAL, r.value = "*", r;
        }
        __name(t, "t");
        return t;
      }(zc.default);
      Gt.default = Vc;
      Xs.exports = Gt.default;
    });
    di = C((jt, Qs) => {
      "use strict";
      c();
      jt.__esModule = true;
      jt.default = void 0;
      var Yc = Qc(De()), Xc = le();
      function Qc(e) {
        return e && e.__esModule ? e : { default: e };
      }
      __name(Qc, "Qc");
      function Kc(e, t) {
        e.prototype = Object.create(t.prototype), e.prototype.constructor = e, ci(e, t);
      }
      __name(Kc, "Kc");
      function ci(e, t) {
        return ci = Object.setPrototypeOf || function(r, i2) {
          return r.__proto__ = i2, r;
        }, ci(e, t);
      }
      __name(ci, "ci");
      var Jc = function(e) {
        Kc(t, e);
        function t(n) {
          var r;
          return r = e.call(this, n) || this, r.type = Xc.COMBINATOR, r;
        }
        __name(t, "t");
        return t;
      }(Yc.default);
      jt.default = Jc;
      Qs.exports = jt.default;
    });
    hi = C((Ht, Ks) => {
      "use strict";
      c();
      Ht.__esModule = true;
      Ht.default = void 0;
      var Zc = td2(De()), ed = le();
      function td2(e) {
        return e && e.__esModule ? e : { default: e };
      }
      __name(td2, "td2");
      function rd(e, t) {
        e.prototype = Object.create(t.prototype), e.prototype.constructor = e, pi(e, t);
      }
      __name(rd, "rd");
      function pi(e, t) {
        return pi = Object.setPrototypeOf || function(r, i2) {
          return r.__proto__ = i2, r;
        }, pi(e, t);
      }
      __name(pi, "pi");
      var nd = function(e) {
        rd(t, e);
        function t(n) {
          var r;
          return r = e.call(this, n) || this, r.type = ed.NESTING, r.value = "&", r;
        }
        __name(t, "t");
        return t;
      }(Zc.default);
      Ht.default = nd;
      Ks.exports = Ht.default;
    });
    Zs = C((qr, Js) => {
      "use strict";
      c();
      qr.__esModule = true;
      qr.default = id;
      function id(e) {
        return e.sort(function(t, n) {
          return t - n;
        });
      }
      __name(id, "id");
      Js.exports = qr.default;
    });
    mi = C((A) => {
      "use strict";
      c();
      A.__esModule = true;
      A.combinator = A.word = A.comment = A.str = A.tab = A.newline = A.feed = A.cr = A.backslash = A.bang = A.slash = A.doubleQuote = A.singleQuote = A.space = A.greaterThan = A.pipe = A.equals = A.plus = A.caret = A.tilde = A.dollar = A.closeSquare = A.openSquare = A.closeParenthesis = A.openParenthesis = A.semicolon = A.colon = A.comma = A.at = A.asterisk = A.ampersand = void 0;
      var od = 38;
      A.ampersand = od;
      var sd = 42;
      A.asterisk = sd;
      var ad = 64;
      A.at = ad;
      var ud = 44;
      A.comma = ud;
      var ld = 58;
      A.colon = ld;
      var fd2 = 59;
      A.semicolon = fd2;
      var cd = 40;
      A.openParenthesis = cd;
      var dd = 41;
      A.closeParenthesis = dd;
      var pd = 91;
      A.openSquare = pd;
      var hd = 93;
      A.closeSquare = hd;
      var md = 36;
      A.dollar = md;
      var gd = 126;
      A.tilde = gd;
      var vd = 94;
      A.caret = vd;
      var bd = 43;
      A.plus = bd;
      var yd = 61;
      A.equals = yd;
      var xd = 124;
      A.pipe = xd;
      var wd = 62;
      A.greaterThan = wd;
      var _d = 32;
      A.space = _d;
      var ea = 39;
      A.singleQuote = ea;
      var Sd = 34;
      A.doubleQuote = Sd;
      var kd = 47;
      A.slash = kd;
      var Td = 33;
      A.bang = Td;
      var Od = 92;
      A.backslash = Od;
      var Ed = 13;
      A.cr = Ed;
      var Pd = 12;
      A.feed = Pd;
      var Ad = 10;
      A.newline = Ad;
      var Id = 9;
      A.tab = Id;
      var Rd = ea;
      A.str = Rd;
      var Ld = -1;
      A.comment = Ld;
      var Cd = -2;
      A.word = Cd;
      var Dd = -3;
      A.combinator = Dd;
    });
    na = C((Vt) => {
      "use strict";
      c();
      Vt.__esModule = true;
      Vt.default = Bd;
      Vt.FIELDS = void 0;
      var O = Fd(mi()), at, Y;
      function ra() {
        if (typeof WeakMap != "function")
          return null;
        var e = /* @__PURE__ */ new WeakMap();
        return ra = /* @__PURE__ */ __name(function() {
          return e;
        }, "ra"), e;
      }
      __name(ra, "ra");
      function Fd(e) {
        if (e && e.__esModule)
          return e;
        if (e === null || typeof e != "object" && typeof e != "function")
          return { default: e };
        var t = ra();
        if (t && t.has(e))
          return t.get(e);
        var n = {}, r = Object.defineProperty && Object.getOwnPropertyDescriptor;
        for (var i2 in e)
          if (Object.prototype.hasOwnProperty.call(e, i2)) {
            var s = r ? Object.getOwnPropertyDescriptor(e, i2) : null;
            s && (s.get || s.set) ? Object.defineProperty(n, i2, s) : n[i2] = e[i2];
          }
        return n.default = e, t && t.set(e, n), n;
      }
      __name(Fd, "Fd");
      var Nd = (at = {}, at[O.tab] = true, at[O.newline] = true, at[O.cr] = true, at[O.feed] = true, at), Md = (Y = {}, Y[O.space] = true, Y[O.tab] = true, Y[O.newline] = true, Y[O.cr] = true, Y[O.feed] = true, Y[O.ampersand] = true, Y[O.asterisk] = true, Y[O.bang] = true, Y[O.comma] = true, Y[O.colon] = true, Y[O.semicolon] = true, Y[O.openParenthesis] = true, Y[O.closeParenthesis] = true, Y[O.openSquare] = true, Y[O.closeSquare] = true, Y[O.singleQuote] = true, Y[O.doubleQuote] = true, Y[O.plus] = true, Y[O.pipe] = true, Y[O.tilde] = true, Y[O.greaterThan] = true, Y[O.equals] = true, Y[O.dollar] = true, Y[O.caret] = true, Y[O.slash] = true, Y), gi = {}, ta = "0123456789abcdefABCDEF";
      for (Br = 0; Br < ta.length; Br++)
        gi[ta.charCodeAt(Br)] = true;
      var Br;
      function $d(e, t) {
        var n = t, r;
        do {
          if (r = e.charCodeAt(n), Md[r])
            return n - 1;
          r === O.backslash ? n = Wd(e, n) + 1 : n++;
        } while (n < e.length);
        return n - 1;
      }
      __name($d, "$d");
      function Wd(e, t) {
        var n = t, r = e.charCodeAt(n + 1);
        if (!Nd[r])
          if (gi[r]) {
            var i2 = 0;
            do
              n++, i2++, r = e.charCodeAt(n + 1);
            while (gi[r] && i2 < 6);
            i2 < 6 && r === O.space && n++;
          } else
            n++;
        return n;
      }
      __name(Wd, "Wd");
      var qd = { TYPE: 0, START_LINE: 1, START_COL: 2, END_LINE: 3, END_COL: 4, START_POS: 5, END_POS: 6 };
      Vt.FIELDS = qd;
      function Bd(e) {
        var t = [], n = e.css.valueOf(), r = n, i2 = r.length, s = -1, o = 1, a = 0, u = 0, l, f, d, g, h, p, v, _, b, y, S, E, T;
        function D(F, L) {
          if (e.safe)
            n += L, b = n.length - 1;
          else
            throw e.error("Unclosed " + F, o, a - s, a);
        }
        __name(D, "D");
        for (; a < i2; ) {
          switch (l = n.charCodeAt(a), l === O.newline && (s = a, o += 1), l) {
            case O.space:
            case O.tab:
            case O.newline:
            case O.cr:
            case O.feed:
              b = a;
              do
                b += 1, l = n.charCodeAt(b), l === O.newline && (s = b, o += 1);
              while (l === O.space || l === O.newline || l === O.tab || l === O.cr || l === O.feed);
              T = O.space, g = o, d = b - s - 1, u = b;
              break;
            case O.plus:
            case O.greaterThan:
            case O.tilde:
            case O.pipe:
              b = a;
              do
                b += 1, l = n.charCodeAt(b);
              while (l === O.plus || l === O.greaterThan || l === O.tilde || l === O.pipe);
              T = O.combinator, g = o, d = a - s, u = b;
              break;
            case O.asterisk:
            case O.ampersand:
            case O.bang:
            case O.comma:
            case O.equals:
            case O.dollar:
            case O.caret:
            case O.openSquare:
            case O.closeSquare:
            case O.colon:
            case O.semicolon:
            case O.openParenthesis:
            case O.closeParenthesis:
              b = a, T = l, g = o, d = a - s, u = b + 1;
              break;
            case O.singleQuote:
            case O.doubleQuote:
              E = l === O.singleQuote ? "'" : '"', b = a;
              do
                for (h = false, b = n.indexOf(E, b + 1), b === -1 && D("quote", E), p = b; n.charCodeAt(p - 1) === O.backslash; )
                  p -= 1, h = !h;
              while (h);
              T = O.str, g = o, d = a - s, u = b + 1;
              break;
            default:
              l === O.slash && n.charCodeAt(a + 1) === O.asterisk ? (b = n.indexOf("*/", a + 2) + 1, b === 0 && D("comment", "*/"), f = n.slice(a, b + 1), _ = f.split(`
`), v = _.length - 1, v > 0 ? (y = o + v, S = b - _[v].length) : (y = o, S = s), T = O.comment, o = y, g = y, d = b - S) : l === O.slash ? (b = a, T = l, g = o, d = a - s, u = b + 1) : (b = $d(n, a), T = O.word, g = o, d = b - s), u = b + 1;
              break;
          }
          t.push([T, o, a - s, g, d, a, u]), S && (s = S, S = null), a = u;
        }
        return t;
      }
      __name(Bd, "Bd");
    });
    ca = C((Yt, fa) => {
      "use strict";
      c();
      Yt.__esModule = true;
      Yt.default = void 0;
      var Ud = _e(qn()), vi = _e(Un()), zd = _e(jn()), ia = _e(Vn()), Gd = _e(Xn()), jd = _e(Jn()), bi = _e(ei()), Hd = _e(ri()), oa = Ur(ui()), Vd = _e(fi()), yi = _e(di()), Yd = _e(hi()), Xd = _e(Zs()), k = Ur(na()), P = Ur(mi()), Qd = Ur(le()), Z = At(), Qe, xi;
      function la() {
        if (typeof WeakMap != "function")
          return null;
        var e = /* @__PURE__ */ new WeakMap();
        return la = /* @__PURE__ */ __name(function() {
          return e;
        }, "la"), e;
      }
      __name(la, "la");
      function Ur(e) {
        if (e && e.__esModule)
          return e;
        if (e === null || typeof e != "object" && typeof e != "function")
          return { default: e };
        var t = la();
        if (t && t.has(e))
          return t.get(e);
        var n = {}, r = Object.defineProperty && Object.getOwnPropertyDescriptor;
        for (var i2 in e)
          if (Object.prototype.hasOwnProperty.call(e, i2)) {
            var s = r ? Object.getOwnPropertyDescriptor(e, i2) : null;
            s && (s.get || s.set) ? Object.defineProperty(n, i2, s) : n[i2] = e[i2];
          }
        return n.default = e, t && t.set(e, n), n;
      }
      __name(Ur, "Ur");
      function _e(e) {
        return e && e.__esModule ? e : { default: e };
      }
      __name(_e, "_e");
      function sa(e, t) {
        for (var n = 0; n < t.length; n++) {
          var r = t[n];
          r.enumerable = r.enumerable || false, r.configurable = true, "value" in r && (r.writable = true), Object.defineProperty(e, r.key, r);
        }
      }
      __name(sa, "sa");
      function Kd(e, t, n) {
        return t && sa(e.prototype, t), n && sa(e, n), e;
      }
      __name(Kd, "Kd");
      var Si = (Qe = {}, Qe[P.space] = true, Qe[P.cr] = true, Qe[P.feed] = true, Qe[P.newline] = true, Qe[P.tab] = true, Qe), Jd = Object.assign({}, Si, (xi = {}, xi[P.comment] = true, xi));
      function aa(e) {
        return { line: e[k.FIELDS.START_LINE], column: e[k.FIELDS.START_COL] };
      }
      __name(aa, "aa");
      function ua(e) {
        return { line: e[k.FIELDS.END_LINE], column: e[k.FIELDS.END_COL] };
      }
      __name(ua, "ua");
      function Ke(e, t, n, r) {
        return { start: { line: e, column: t }, end: { line: n, column: r } };
      }
      __name(Ke, "Ke");
      function ut(e) {
        return Ke(e[k.FIELDS.START_LINE], e[k.FIELDS.START_COL], e[k.FIELDS.END_LINE], e[k.FIELDS.END_COL]);
      }
      __name(ut, "ut");
      function wi(e, t) {
        if (!!e)
          return Ke(e[k.FIELDS.START_LINE], e[k.FIELDS.START_COL], t[k.FIELDS.END_LINE], t[k.FIELDS.END_COL]);
      }
      __name(wi, "wi");
      function lt(e, t) {
        var n = e[t];
        if (typeof n == "string")
          return n.indexOf("\\") !== -1 && ((0, Z.ensureObject)(e, "raws"), e[t] = (0, Z.unesc)(n), e.raws[t] === void 0 && (e.raws[t] = n)), e;
      }
      __name(lt, "lt");
      function _i(e, t) {
        for (var n = -1, r = []; (n = e.indexOf(t, n + 1)) !== -1; )
          r.push(n);
        return r;
      }
      __name(_i, "_i");
      function Zd() {
        var e = Array.prototype.concat.apply([], arguments);
        return e.filter(function(t, n) {
          return n === e.indexOf(t);
        });
      }
      __name(Zd, "Zd");
      var ep = function() {
        function e(n, r) {
          r === void 0 && (r = {}), this.rule = n, this.options = Object.assign({ lossy: false, safe: false }, r), this.position = 0, this.css = typeof this.rule == "string" ? this.rule : this.rule.selector, this.tokens = (0, k.default)({ css: this.css, error: this._errorGenerator(), safe: this.options.safe });
          var i2 = wi(this.tokens[0], this.tokens[this.tokens.length - 1]);
          this.root = new Ud.default({ source: i2 }), this.root.errorGenerator = this._errorGenerator();
          var s = new vi.default({ source: { start: { line: 1, column: 1 } } });
          this.root.append(s), this.current = s, this.loop();
        }
        __name(e, "e");
        var t = e.prototype;
        return t._errorGenerator = function() {
          var r = this;
          return function(i2, s) {
            return typeof r.rule == "string" ? new Error(i2) : r.rule.error(i2, s);
          };
        }, t.attribute = function() {
          var r = [], i2 = this.currToken;
          for (this.position++; this.position < this.tokens.length && this.currToken[k.FIELDS.TYPE] !== P.closeSquare; )
            r.push(this.currToken), this.position++;
          if (this.currToken[k.FIELDS.TYPE] !== P.closeSquare)
            return this.expected("closing square bracket", this.currToken[k.FIELDS.START_POS]);
          var s = r.length, o = { source: Ke(i2[1], i2[2], this.currToken[3], this.currToken[4]), sourceIndex: i2[k.FIELDS.START_POS] };
          if (s === 1 && !~[P.word].indexOf(r[0][k.FIELDS.TYPE]))
            return this.expected("attribute", r[0][k.FIELDS.START_POS]);
          for (var a = 0, u = "", l = "", f = null, d = false; a < s; ) {
            var g = r[a], h = this.content(g), p = r[a + 1];
            switch (g[k.FIELDS.TYPE]) {
              case P.space:
                if (d = true, this.options.lossy)
                  break;
                if (f) {
                  (0, Z.ensureObject)(o, "spaces", f);
                  var v = o.spaces[f].after || "";
                  o.spaces[f].after = v + h;
                  var _ = (0, Z.getProp)(o, "raws", "spaces", f, "after") || null;
                  _ && (o.raws.spaces[f].after = _ + h);
                } else
                  u = u + h, l = l + h;
                break;
              case P.asterisk:
                if (p[k.FIELDS.TYPE] === P.equals)
                  o.operator = h, f = "operator";
                else if ((!o.namespace || f === "namespace" && !d) && p) {
                  u && ((0, Z.ensureObject)(o, "spaces", "attribute"), o.spaces.attribute.before = u, u = ""), l && ((0, Z.ensureObject)(o, "raws", "spaces", "attribute"), o.raws.spaces.attribute.before = u, l = ""), o.namespace = (o.namespace || "") + h;
                  var b = (0, Z.getProp)(o, "raws", "namespace") || null;
                  b && (o.raws.namespace += h), f = "namespace";
                }
                d = false;
                break;
              case P.dollar:
                if (f === "value") {
                  var y = (0, Z.getProp)(o, "raws", "value");
                  o.value += "$", y && (o.raws.value = y + "$");
                  break;
                }
              case P.caret:
                p[k.FIELDS.TYPE] === P.equals && (o.operator = h, f = "operator"), d = false;
                break;
              case P.combinator:
                if (h === "~" && p[k.FIELDS.TYPE] === P.equals && (o.operator = h, f = "operator"), h !== "|") {
                  d = false;
                  break;
                }
                p[k.FIELDS.TYPE] === P.equals ? (o.operator = h, f = "operator") : !o.namespace && !o.attribute && (o.namespace = true), d = false;
                break;
              case P.word:
                if (p && this.content(p) === "|" && r[a + 2] && r[a + 2][k.FIELDS.TYPE] !== P.equals && !o.operator && !o.namespace)
                  o.namespace = h, f = "namespace";
                else if (!o.attribute || f === "attribute" && !d) {
                  u && ((0, Z.ensureObject)(o, "spaces", "attribute"), o.spaces.attribute.before = u, u = ""), l && ((0, Z.ensureObject)(o, "raws", "spaces", "attribute"), o.raws.spaces.attribute.before = l, l = ""), o.attribute = (o.attribute || "") + h;
                  var S = (0, Z.getProp)(o, "raws", "attribute") || null;
                  S && (o.raws.attribute += h), f = "attribute";
                } else if (!o.value && o.value !== "" || f === "value" && !d) {
                  var E = (0, Z.unesc)(h), T = (0, Z.getProp)(o, "raws", "value") || "", D = o.value || "";
                  o.value = D + E, o.quoteMark = null, (E !== h || T) && ((0, Z.ensureObject)(o, "raws"), o.raws.value = (T || D) + h), f = "value";
                } else {
                  var F = h === "i" || h === "I";
                  (o.value || o.value === "") && (o.quoteMark || d) ? (o.insensitive = F, (!F || h === "I") && ((0, Z.ensureObject)(o, "raws"), o.raws.insensitiveFlag = h), f = "insensitive", u && ((0, Z.ensureObject)(o, "spaces", "insensitive"), o.spaces.insensitive.before = u, u = ""), l && ((0, Z.ensureObject)(o, "raws", "spaces", "insensitive"), o.raws.spaces.insensitive.before = l, l = "")) : (o.value || o.value === "") && (f = "value", o.value += h, o.raws.value && (o.raws.value += h));
                }
                d = false;
                break;
              case P.str:
                if (!o.attribute || !o.operator)
                  return this.error("Expected an attribute followed by an operator preceding the string.", { index: g[k.FIELDS.START_POS] });
                var L = (0, oa.unescapeValue)(h), H = L.unescaped, U = L.quoteMark;
                o.value = H, o.quoteMark = U, f = "value", (0, Z.ensureObject)(o, "raws"), o.raws.value = h, d = false;
                break;
              case P.equals:
                if (!o.attribute)
                  return this.expected("attribute", g[k.FIELDS.START_POS], h);
                if (o.value)
                  return this.error('Unexpected "=" found; an operator was already defined.', { index: g[k.FIELDS.START_POS] });
                o.operator = o.operator ? o.operator + h : h, f = "operator", d = false;
                break;
              case P.comment:
                if (f)
                  if (d || p && p[k.FIELDS.TYPE] === P.space || f === "insensitive") {
                    var J = (0, Z.getProp)(o, "spaces", f, "after") || "", M = (0, Z.getProp)(o, "raws", "spaces", f, "after") || J;
                    (0, Z.ensureObject)(o, "raws", "spaces", f), o.raws.spaces[f].after = M + h;
                  } else {
                    var V = o[f] || "", ne = (0, Z.getProp)(o, "raws", f) || V;
                    (0, Z.ensureObject)(o, "raws"), o.raws[f] = ne + h;
                  }
                else
                  l = l + h;
                break;
              default:
                return this.error('Unexpected "' + h + '" found.', { index: g[k.FIELDS.START_POS] });
            }
            a++;
          }
          lt(o, "attribute"), lt(o, "namespace"), this.newNode(new oa.default(o)), this.position++;
        }, t.parseWhitespaceEquivalentTokens = function(r) {
          r < 0 && (r = this.tokens.length);
          var i2 = this.position, s = [], o = "", a = void 0;
          do
            if (Si[this.currToken[k.FIELDS.TYPE]])
              this.options.lossy || (o += this.content());
            else if (this.currToken[k.FIELDS.TYPE] === P.comment) {
              var u = {};
              o && (u.before = o, o = ""), a = new ia.default({ value: this.content(), source: ut(this.currToken), sourceIndex: this.currToken[k.FIELDS.START_POS], spaces: u }), s.push(a);
            }
          while (++this.position < r);
          if (o) {
            if (a)
              a.spaces.after = o;
            else if (!this.options.lossy) {
              var l = this.tokens[i2], f = this.tokens[this.position - 1];
              s.push(new bi.default({ value: "", source: Ke(l[k.FIELDS.START_LINE], l[k.FIELDS.START_COL], f[k.FIELDS.END_LINE], f[k.FIELDS.END_COL]), sourceIndex: l[k.FIELDS.START_POS], spaces: { before: o, after: "" } }));
            }
          }
          return s;
        }, t.convertWhitespaceNodesToSpace = function(r, i2) {
          var s = this;
          i2 === void 0 && (i2 = false);
          var o = "", a = "";
          r.forEach(function(l) {
            var f = s.lossySpace(l.spaces.before, i2), d = s.lossySpace(l.rawSpaceBefore, i2);
            o += f + s.lossySpace(l.spaces.after, i2 && f.length === 0), a += f + l.value + s.lossySpace(l.rawSpaceAfter, i2 && d.length === 0);
          }), a === o && (a = void 0);
          var u = { space: o, rawSpace: a };
          return u;
        }, t.isNamedCombinator = function(r) {
          return r === void 0 && (r = this.position), this.tokens[r + 0] && this.tokens[r + 0][k.FIELDS.TYPE] === P.slash && this.tokens[r + 1] && this.tokens[r + 1][k.FIELDS.TYPE] === P.word && this.tokens[r + 2] && this.tokens[r + 2][k.FIELDS.TYPE] === P.slash;
        }, t.namedCombinator = function() {
          if (this.isNamedCombinator()) {
            var r = this.content(this.tokens[this.position + 1]), i2 = (0, Z.unesc)(r).toLowerCase(), s = {};
            i2 !== r && (s.value = "/" + r + "/");
            var o = new yi.default({ value: "/" + i2 + "/", source: Ke(this.currToken[k.FIELDS.START_LINE], this.currToken[k.FIELDS.START_COL], this.tokens[this.position + 2][k.FIELDS.END_LINE], this.tokens[this.position + 2][k.FIELDS.END_COL]), sourceIndex: this.currToken[k.FIELDS.START_POS], raws: s });
            return this.position = this.position + 3, o;
          } else
            this.unexpected();
        }, t.combinator = function() {
          var r = this;
          if (this.content() === "|")
            return this.namespace();
          var i2 = this.locateNextMeaningfulToken(this.position);
          if (i2 < 0 || this.tokens[i2][k.FIELDS.TYPE] === P.comma) {
            var s = this.parseWhitespaceEquivalentTokens(i2);
            if (s.length > 0) {
              var o = this.current.last;
              if (o) {
                var a = this.convertWhitespaceNodesToSpace(s), u = a.space, l = a.rawSpace;
                l !== void 0 && (o.rawSpaceAfter += l), o.spaces.after += u;
              } else
                s.forEach(function(T) {
                  return r.newNode(T);
                });
            }
            return;
          }
          var f = this.currToken, d = void 0;
          i2 > this.position && (d = this.parseWhitespaceEquivalentTokens(i2));
          var g;
          if (this.isNamedCombinator() ? g = this.namedCombinator() : this.currToken[k.FIELDS.TYPE] === P.combinator ? (g = new yi.default({ value: this.content(), source: ut(this.currToken), sourceIndex: this.currToken[k.FIELDS.START_POS] }), this.position++) : Si[this.currToken[k.FIELDS.TYPE]] || d || this.unexpected(), g) {
            if (d) {
              var h = this.convertWhitespaceNodesToSpace(d), p = h.space, v = h.rawSpace;
              g.spaces.before = p, g.rawSpaceBefore = v;
            }
          } else {
            var _ = this.convertWhitespaceNodesToSpace(d, true), b = _.space, y = _.rawSpace;
            y || (y = b);
            var S = {}, E = { spaces: {} };
            b.endsWith(" ") && y.endsWith(" ") ? (S.before = b.slice(0, b.length - 1), E.spaces.before = y.slice(0, y.length - 1)) : b.startsWith(" ") && y.startsWith(" ") ? (S.after = b.slice(1), E.spaces.after = y.slice(1)) : E.value = y, g = new yi.default({ value: " ", source: wi(f, this.tokens[this.position - 1]), sourceIndex: f[k.FIELDS.START_POS], spaces: S, raws: E });
          }
          return this.currToken && this.currToken[k.FIELDS.TYPE] === P.space && (g.spaces.after = this.optionalSpace(this.content()), this.position++), this.newNode(g);
        }, t.comma = function() {
          if (this.position === this.tokens.length - 1) {
            this.root.trailingComma = true, this.position++;
            return;
          }
          this.current._inferEndPosition();
          var r = new vi.default({ source: { start: aa(this.tokens[this.position + 1]) } });
          this.current.parent.append(r), this.current = r, this.position++;
        }, t.comment = function() {
          var r = this.currToken;
          this.newNode(new ia.default({ value: this.content(), source: ut(r), sourceIndex: r[k.FIELDS.START_POS] })), this.position++;
        }, t.error = function(r, i2) {
          throw this.root.error(r, i2);
        }, t.missingBackslash = function() {
          return this.error("Expected a backslash preceding the semicolon.", { index: this.currToken[k.FIELDS.START_POS] });
        }, t.missingParenthesis = function() {
          return this.expected("opening parenthesis", this.currToken[k.FIELDS.START_POS]);
        }, t.missingSquareBracket = function() {
          return this.expected("opening square bracket", this.currToken[k.FIELDS.START_POS]);
        }, t.unexpected = function() {
          return this.error("Unexpected '" + this.content() + "'. Escaping special characters with \\ may help.", this.currToken[k.FIELDS.START_POS]);
        }, t.namespace = function() {
          var r = this.prevToken && this.content(this.prevToken) || true;
          if (this.nextToken[k.FIELDS.TYPE] === P.word)
            return this.position++, this.word(r);
          if (this.nextToken[k.FIELDS.TYPE] === P.asterisk)
            return this.position++, this.universal(r);
        }, t.nesting = function() {
          if (this.nextToken) {
            var r = this.content(this.nextToken);
            if (r === "|") {
              this.position++;
              return;
            }
          }
          var i2 = this.currToken;
          this.newNode(new Yd.default({ value: this.content(), source: ut(i2), sourceIndex: i2[k.FIELDS.START_POS] })), this.position++;
        }, t.parentheses = function() {
          var r = this.current.last, i2 = 1;
          if (this.position++, r && r.type === Qd.PSEUDO) {
            var s = new vi.default({ source: { start: aa(this.tokens[this.position - 1]) } }), o = this.current;
            for (r.append(s), this.current = s; this.position < this.tokens.length && i2; )
              this.currToken[k.FIELDS.TYPE] === P.openParenthesis && i2++, this.currToken[k.FIELDS.TYPE] === P.closeParenthesis && i2--, i2 ? this.parse() : (this.current.source.end = ua(this.currToken), this.current.parent.source.end = ua(this.currToken), this.position++);
            this.current = o;
          } else {
            for (var a = this.currToken, u = "(", l; this.position < this.tokens.length && i2; )
              this.currToken[k.FIELDS.TYPE] === P.openParenthesis && i2++, this.currToken[k.FIELDS.TYPE] === P.closeParenthesis && i2--, l = this.currToken, u += this.parseParenthesisToken(this.currToken), this.position++;
            r ? r.appendToPropertyAndEscape("value", u, u) : this.newNode(new bi.default({ value: u, source: Ke(a[k.FIELDS.START_LINE], a[k.FIELDS.START_COL], l[k.FIELDS.END_LINE], l[k.FIELDS.END_COL]), sourceIndex: a[k.FIELDS.START_POS] }));
          }
          if (i2)
            return this.expected("closing parenthesis", this.currToken[k.FIELDS.START_POS]);
        }, t.pseudo = function() {
          for (var r = this, i2 = "", s = this.currToken; this.currToken && this.currToken[k.FIELDS.TYPE] === P.colon; )
            i2 += this.content(), this.position++;
          if (!this.currToken)
            return this.expected(["pseudo-class", "pseudo-element"], this.position - 1);
          if (this.currToken[k.FIELDS.TYPE] === P.word)
            this.splitWord(false, function(o, a) {
              i2 += o, r.newNode(new Hd.default({ value: i2, source: wi(s, r.currToken), sourceIndex: s[k.FIELDS.START_POS] })), a > 1 && r.nextToken && r.nextToken[k.FIELDS.TYPE] === P.openParenthesis && r.error("Misplaced parenthesis.", { index: r.nextToken[k.FIELDS.START_POS] });
            });
          else
            return this.expected(["pseudo-class", "pseudo-element"], this.currToken[k.FIELDS.START_POS]);
        }, t.space = function() {
          var r = this.content();
          this.position === 0 || this.prevToken[k.FIELDS.TYPE] === P.comma || this.prevToken[k.FIELDS.TYPE] === P.openParenthesis || this.current.nodes.every(function(i2) {
            return i2.type === "comment";
          }) ? (this.spaces = this.optionalSpace(r), this.position++) : this.position === this.tokens.length - 1 || this.nextToken[k.FIELDS.TYPE] === P.comma || this.nextToken[k.FIELDS.TYPE] === P.closeParenthesis ? (this.current.last.spaces.after = this.optionalSpace(r), this.position++) : this.combinator();
        }, t.string = function() {
          var r = this.currToken;
          this.newNode(new bi.default({ value: this.content(), source: ut(r), sourceIndex: r[k.FIELDS.START_POS] })), this.position++;
        }, t.universal = function(r) {
          var i2 = this.nextToken;
          if (i2 && this.content(i2) === "|")
            return this.position++, this.namespace();
          var s = this.currToken;
          this.newNode(new Vd.default({ value: this.content(), source: ut(s), sourceIndex: s[k.FIELDS.START_POS] }), r), this.position++;
        }, t.splitWord = function(r, i2) {
          for (var s = this, o = this.nextToken, a = this.content(); o && ~[P.dollar, P.caret, P.equals, P.word].indexOf(o[k.FIELDS.TYPE]); ) {
            this.position++;
            var u = this.content();
            if (a += u, u.lastIndexOf("\\") === u.length - 1) {
              var l = this.nextToken;
              l && l[k.FIELDS.TYPE] === P.space && (a += this.requiredSpace(this.content(l)), this.position++);
            }
            o = this.nextToken;
          }
          var f = _i(a, ".").filter(function(p) {
            var v = a[p - 1] === "\\", _ = /^\d+\.\d+%$/.test(a);
            return !v && !_;
          }), d = _i(a, "#").filter(function(p) {
            return a[p - 1] !== "\\";
          }), g = _i(a, "#{");
          g.length && (d = d.filter(function(p) {
            return !~g.indexOf(p);
          }));
          var h = (0, Xd.default)(Zd([0].concat(f, d)));
          h.forEach(function(p, v) {
            var _ = h[v + 1] || a.length, b = a.slice(p, _);
            if (v === 0 && i2)
              return i2.call(s, b, h.length);
            var y, S = s.currToken, E = S[k.FIELDS.START_POS] + h[v], T = Ke(S[1], S[2] + p, S[3], S[2] + (_ - 1));
            if (~f.indexOf(p)) {
              var D = { value: b.slice(1), source: T, sourceIndex: E };
              y = new zd.default(lt(D, "value"));
            } else if (~d.indexOf(p)) {
              var F = { value: b.slice(1), source: T, sourceIndex: E };
              y = new Gd.default(lt(F, "value"));
            } else {
              var L = { value: b, source: T, sourceIndex: E };
              lt(L, "value"), y = new jd.default(L);
            }
            s.newNode(y, r), r = null;
          }), this.position++;
        }, t.word = function(r) {
          var i2 = this.nextToken;
          return i2 && this.content(i2) === "|" ? (this.position++, this.namespace()) : this.splitWord(r);
        }, t.loop = function() {
          for (; this.position < this.tokens.length; )
            this.parse(true);
          return this.current._inferEndPosition(), this.root;
        }, t.parse = function(r) {
          switch (this.currToken[k.FIELDS.TYPE]) {
            case P.space:
              this.space();
              break;
            case P.comment:
              this.comment();
              break;
            case P.openParenthesis:
              this.parentheses();
              break;
            case P.closeParenthesis:
              r && this.missingParenthesis();
              break;
            case P.openSquare:
              this.attribute();
              break;
            case P.dollar:
            case P.caret:
            case P.equals:
            case P.word:
              this.word();
              break;
            case P.colon:
              this.pseudo();
              break;
            case P.comma:
              this.comma();
              break;
            case P.asterisk:
              this.universal();
              break;
            case P.ampersand:
              this.nesting();
              break;
            case P.slash:
            case P.combinator:
              this.combinator();
              break;
            case P.str:
              this.string();
              break;
            case P.closeSquare:
              this.missingSquareBracket();
            case P.semicolon:
              this.missingBackslash();
            default:
              this.unexpected();
          }
        }, t.expected = function(r, i2, s) {
          if (Array.isArray(r)) {
            var o = r.pop();
            r = r.join(", ") + " or " + o;
          }
          var a = /^[aeiou]/.test(r[0]) ? "an" : "a";
          return s ? this.error("Expected " + a + " " + r + ', found "' + s + '" instead.', { index: i2 }) : this.error("Expected " + a + " " + r + ".", { index: i2 });
        }, t.requiredSpace = function(r) {
          return this.options.lossy ? " " : r;
        }, t.optionalSpace = function(r) {
          return this.options.lossy ? "" : r;
        }, t.lossySpace = function(r, i2) {
          return this.options.lossy ? i2 ? " " : "" : r;
        }, t.parseParenthesisToken = function(r) {
          var i2 = this.content(r);
          return r[k.FIELDS.TYPE] === P.space ? this.requiredSpace(i2) : i2;
        }, t.newNode = function(r, i2) {
          return i2 && (/^ +$/.test(i2) && (this.options.lossy || (this.spaces = (this.spaces || "") + i2), i2 = true), r.namespace = i2, lt(r, "namespace")), this.spaces && (r.spaces.before = this.spaces, this.spaces = ""), this.current.append(r);
        }, t.content = function(r) {
          return r === void 0 && (r = this.currToken), this.css.slice(r[k.FIELDS.START_POS], r[k.FIELDS.END_POS]);
        }, t.locateNextMeaningfulToken = function(r) {
          r === void 0 && (r = this.position + 1);
          for (var i2 = r; i2 < this.tokens.length; )
            if (Jd[this.tokens[i2][k.FIELDS.TYPE]]) {
              i2++;
              continue;
            } else
              return i2;
          return -1;
        }, Kd(e, [{ key: "currToken", get: /* @__PURE__ */ __name(function() {
          return this.tokens[this.position];
        }, "get") }, { key: "nextToken", get: /* @__PURE__ */ __name(function() {
          return this.tokens[this.position + 1];
        }, "get") }, { key: "prevToken", get: /* @__PURE__ */ __name(function() {
          return this.tokens[this.position - 1];
        }, "get") }]), e;
      }();
      Yt.default = ep;
      fa.exports = Yt.default;
    });
    pa = C((Xt, da) => {
      "use strict";
      c();
      Xt.__esModule = true;
      Xt.default = void 0;
      var tp = rp(ca());
      function rp(e) {
        return e && e.__esModule ? e : { default: e };
      }
      __name(rp, "rp");
      var np = function() {
        function e(n, r) {
          this.func = n || function() {
          }, this.funcRes = null, this.options = r;
        }
        __name(e, "e");
        var t = e.prototype;
        return t._shouldUpdateSelector = function(r, i2) {
          i2 === void 0 && (i2 = {});
          var s = Object.assign({}, this.options, i2);
          return s.updateSelector === false ? false : typeof r != "string";
        }, t._isLossy = function(r) {
          r === void 0 && (r = {});
          var i2 = Object.assign({}, this.options, r);
          return i2.lossless === false;
        }, t._root = function(r, i2) {
          i2 === void 0 && (i2 = {});
          var s = new tp.default(r, this._parseOptions(i2));
          return s.root;
        }, t._parseOptions = function(r) {
          return { lossy: this._isLossy(r) };
        }, t._run = function(r, i2) {
          var s = this;
          return i2 === void 0 && (i2 = {}), new Promise(function(o, a) {
            try {
              var u = s._root(r, i2);
              Promise.resolve(s.func(u)).then(function(l) {
                var f = void 0;
                return s._shouldUpdateSelector(r, i2) && (f = u.toString(), r.selector = f), { transform: l, root: u, string: f };
              }).then(o, a);
            } catch (l) {
              a(l);
              return;
            }
          });
        }, t._runSync = function(r, i2) {
          i2 === void 0 && (i2 = {});
          var s = this._root(r, i2), o = this.func(s);
          if (o && typeof o.then == "function")
            throw new Error("Selector processor returned a promise to a synchronous call.");
          var a = void 0;
          return i2.updateSelector && typeof r != "string" && (a = s.toString(), r.selector = a), { transform: o, root: s, string: a };
        }, t.ast = function(r, i2) {
          return this._run(r, i2).then(function(s) {
            return s.root;
          });
        }, t.astSync = function(r, i2) {
          return this._runSync(r, i2).root;
        }, t.transform = function(r, i2) {
          return this._run(r, i2).then(function(s) {
            return s.transform;
          });
        }, t.transformSync = function(r, i2) {
          return this._runSync(r, i2).transform;
        }, t.process = function(r, i2) {
          return this._run(r, i2).then(function(s) {
            return s.string || s.root.toString();
          });
        }, t.processSync = function(r, i2) {
          var s = this._runSync(r, i2);
          return s.string || s.root.toString();
        }, e;
      }();
      Xt.default = np;
      da.exports = Xt.default;
    });
    ha = C((Q) => {
      "use strict";
      c();
      Q.__esModule = true;
      Q.universal = Q.tag = Q.string = Q.selector = Q.root = Q.pseudo = Q.nesting = Q.id = Q.comment = Q.combinator = Q.className = Q.attribute = void 0;
      var ip = Se(ui()), op = Se(jn()), sp = Se(di()), ap = Se(Vn()), up = Se(Xn()), lp = Se(hi()), fp = Se(ri()), cp = Se(qn()), dp = Se(Un()), pp = Se(ei()), hp = Se(Jn()), mp = Se(fi());
      function Se(e) {
        return e && e.__esModule ? e : { default: e };
      }
      __name(Se, "Se");
      var gp = /* @__PURE__ */ __name(function(t) {
        return new ip.default(t);
      }, "gp");
      Q.attribute = gp;
      var vp = /* @__PURE__ */ __name(function(t) {
        return new op.default(t);
      }, "vp");
      Q.className = vp;
      var bp = /* @__PURE__ */ __name(function(t) {
        return new sp.default(t);
      }, "bp");
      Q.combinator = bp;
      var yp = /* @__PURE__ */ __name(function(t) {
        return new ap.default(t);
      }, "yp");
      Q.comment = yp;
      var xp = /* @__PURE__ */ __name(function(t) {
        return new up.default(t);
      }, "xp");
      Q.id = xp;
      var wp = /* @__PURE__ */ __name(function(t) {
        return new lp.default(t);
      }, "wp");
      Q.nesting = wp;
      var _p = /* @__PURE__ */ __name(function(t) {
        return new fp.default(t);
      }, "_p");
      Q.pseudo = _p;
      var Sp = /* @__PURE__ */ __name(function(t) {
        return new cp.default(t);
      }, "Sp");
      Q.root = Sp;
      var kp = /* @__PURE__ */ __name(function(t) {
        return new dp.default(t);
      }, "kp");
      Q.selector = kp;
      var Tp = /* @__PURE__ */ __name(function(t) {
        return new pp.default(t);
      }, "Tp");
      Q.string = Tp;
      var Op = /* @__PURE__ */ __name(function(t) {
        return new hp.default(t);
      }, "Op");
      Q.tag = Op;
      var Ep = /* @__PURE__ */ __name(function(t) {
        return new mp.default(t);
      }, "Ep");
      Q.universal = Ep;
    });
    ba = C((G) => {
      "use strict";
      c();
      G.__esModule = true;
      G.isNode = ki;
      G.isPseudoElement = va;
      G.isPseudoClass = $p;
      G.isContainer = Wp;
      G.isNamespace = qp;
      G.isUniversal = G.isTag = G.isString = G.isSelector = G.isRoot = G.isPseudo = G.isNesting = G.isIdentifier = G.isComment = G.isCombinator = G.isClassName = G.isAttribute = void 0;
      var ee = le(), pe, Pp = (pe = {}, pe[ee.ATTRIBUTE] = true, pe[ee.CLASS] = true, pe[ee.COMBINATOR] = true, pe[ee.COMMENT] = true, pe[ee.ID] = true, pe[ee.NESTING] = true, pe[ee.PSEUDO] = true, pe[ee.ROOT] = true, pe[ee.SELECTOR] = true, pe[ee.STRING] = true, pe[ee.TAG] = true, pe[ee.UNIVERSAL] = true, pe);
      function ki(e) {
        return typeof e == "object" && Pp[e.type];
      }
      __name(ki, "ki");
      function ke(e, t) {
        return ki(t) && t.type === e;
      }
      __name(ke, "ke");
      var ma = ke.bind(null, ee.ATTRIBUTE);
      G.isAttribute = ma;
      var Ap = ke.bind(null, ee.CLASS);
      G.isClassName = Ap;
      var Ip = ke.bind(null, ee.COMBINATOR);
      G.isCombinator = Ip;
      var Rp = ke.bind(null, ee.COMMENT);
      G.isComment = Rp;
      var Lp = ke.bind(null, ee.ID);
      G.isIdentifier = Lp;
      var Cp = ke.bind(null, ee.NESTING);
      G.isNesting = Cp;
      var Ti = ke.bind(null, ee.PSEUDO);
      G.isPseudo = Ti;
      var Dp = ke.bind(null, ee.ROOT);
      G.isRoot = Dp;
      var Fp = ke.bind(null, ee.SELECTOR);
      G.isSelector = Fp;
      var Np = ke.bind(null, ee.STRING);
      G.isString = Np;
      var ga = ke.bind(null, ee.TAG);
      G.isTag = ga;
      var Mp = ke.bind(null, ee.UNIVERSAL);
      G.isUniversal = Mp;
      function va(e) {
        return Ti(e) && e.value && (e.value.startsWith("::") || e.value.toLowerCase() === ":before" || e.value.toLowerCase() === ":after" || e.value.toLowerCase() === ":first-letter" || e.value.toLowerCase() === ":first-line");
      }
      __name(va, "va");
      function $p(e) {
        return Ti(e) && !va(e);
      }
      __name($p, "$p");
      function Wp(e) {
        return !!(ki(e) && e.walk);
      }
      __name(Wp, "Wp");
      function qp(e) {
        return ma(e) || ga(e);
      }
      __name(qp, "qp");
    });
    ya = C((Ee) => {
      "use strict";
      c();
      Ee.__esModule = true;
      var Oi = le();
      Object.keys(Oi).forEach(function(e) {
        e === "default" || e === "__esModule" || e in Ee && Ee[e] === Oi[e] || (Ee[e] = Oi[e]);
      });
      var Ei = ha();
      Object.keys(Ei).forEach(function(e) {
        e === "default" || e === "__esModule" || e in Ee && Ee[e] === Ei[e] || (Ee[e] = Ei[e]);
      });
      var Pi = ba();
      Object.keys(Pi).forEach(function(e) {
        e === "default" || e === "__esModule" || e in Ee && Ee[e] === Pi[e] || (Ee[e] = Pi[e]);
      });
    });
    _a2 = C((Qt, wa) => {
      "use strict";
      c();
      Qt.__esModule = true;
      Qt.default = void 0;
      var Bp = Gp(pa()), Up = zp(ya());
      function xa() {
        if (typeof WeakMap != "function")
          return null;
        var e = /* @__PURE__ */ new WeakMap();
        return xa = /* @__PURE__ */ __name(function() {
          return e;
        }, "xa"), e;
      }
      __name(xa, "xa");
      function zp(e) {
        if (e && e.__esModule)
          return e;
        if (e === null || typeof e != "object" && typeof e != "function")
          return { default: e };
        var t = xa();
        if (t && t.has(e))
          return t.get(e);
        var n = {}, r = Object.defineProperty && Object.getOwnPropertyDescriptor;
        for (var i2 in e)
          if (Object.prototype.hasOwnProperty.call(e, i2)) {
            var s = r ? Object.getOwnPropertyDescriptor(e, i2) : null;
            s && (s.get || s.set) ? Object.defineProperty(n, i2, s) : n[i2] = e[i2];
          }
        return n.default = e, t && t.set(e, n), n;
      }
      __name(zp, "zp");
      function Gp(e) {
        return e && e.__esModule ? e : { default: e };
      }
      __name(Gp, "Gp");
      var Ai = /* @__PURE__ */ __name(function(t) {
        return new Bp.default(t);
      }, "Ai");
      Object.assign(Ai, Up);
      delete Ai.__esModule;
      var jp = Ai;
      Qt.default = jp;
      wa.exports = Qt.default;
    });
    Sa = C((Ii) => {
      "use strict";
      c();
      Object.defineProperty(Ii, "__esModule", { value: true });
      Object.defineProperty(Ii, "default", { enumerable: true, get: /* @__PURE__ */ __name(() => Hp, "get") });
      function Hp(e) {
        return e.replace(/\\,/g, "\\2c ");
      }
      __name(Hp, "Hp");
    });
    Ta = C((Ug, ka) => {
      "use strict";
      c();
      ka.exports = { aliceblue: [240, 248, 255], antiquewhite: [250, 235, 215], aqua: [0, 255, 255], aquamarine: [127, 255, 212], azure: [240, 255, 255], beige: [245, 245, 220], bisque: [255, 228, 196], black: [0, 0, 0], blanchedalmond: [255, 235, 205], blue: [0, 0, 255], blueviolet: [138, 43, 226], brown: [165, 42, 42], burlywood: [222, 184, 135], cadetblue: [95, 158, 160], chartreuse: [127, 255, 0], chocolate: [210, 105, 30], coral: [255, 127, 80], cornflowerblue: [100, 149, 237], cornsilk: [255, 248, 220], crimson: [220, 20, 60], cyan: [0, 255, 255], darkblue: [0, 0, 139], darkcyan: [0, 139, 139], darkgoldenrod: [184, 134, 11], darkgray: [169, 169, 169], darkgreen: [0, 100, 0], darkgrey: [169, 169, 169], darkkhaki: [189, 183, 107], darkmagenta: [139, 0, 139], darkolivegreen: [85, 107, 47], darkorange: [255, 140, 0], darkorchid: [153, 50, 204], darkred: [139, 0, 0], darksalmon: [233, 150, 122], darkseagreen: [143, 188, 143], darkslateblue: [72, 61, 139], darkslategray: [47, 79, 79], darkslategrey: [47, 79, 79], darkturquoise: [0, 206, 209], darkviolet: [148, 0, 211], deeppink: [255, 20, 147], deepskyblue: [0, 191, 255], dimgray: [105, 105, 105], dimgrey: [105, 105, 105], dodgerblue: [30, 144, 255], firebrick: [178, 34, 34], floralwhite: [255, 250, 240], forestgreen: [34, 139, 34], fuchsia: [255, 0, 255], gainsboro: [220, 220, 220], ghostwhite: [248, 248, 255], gold: [255, 215, 0], goldenrod: [218, 165, 32], gray: [128, 128, 128], green: [0, 128, 0], greenyellow: [173, 255, 47], grey: [128, 128, 128], honeydew: [240, 255, 240], hotpink: [255, 105, 180], indianred: [205, 92, 92], indigo: [75, 0, 130], ivory: [255, 255, 240], khaki: [240, 230, 140], lavender: [230, 230, 250], lavenderblush: [255, 240, 245], lawngreen: [124, 252, 0], lemonchiffon: [255, 250, 205], lightblue: [173, 216, 230], lightcoral: [240, 128, 128], lightcyan: [224, 255, 255], lightgoldenrodyellow: [250, 250, 210], lightgray: [211, 211, 211], lightgreen: [144, 238, 144], lightgrey: [211, 211, 211], lightpink: [255, 182, 193], lightsalmon: [255, 160, 122], lightseagreen: [32, 178, 170], lightskyblue: [135, 206, 250], lightslategray: [119, 136, 153], lightslategrey: [119, 136, 153], lightsteelblue: [176, 196, 222], lightyellow: [255, 255, 224], lime: [0, 255, 0], limegreen: [50, 205, 50], linen: [250, 240, 230], magenta: [255, 0, 255], maroon: [128, 0, 0], mediumaquamarine: [102, 205, 170], mediumblue: [0, 0, 205], mediumorchid: [186, 85, 211], mediumpurple: [147, 112, 219], mediumseagreen: [60, 179, 113], mediumslateblue: [123, 104, 238], mediumspringgreen: [0, 250, 154], mediumturquoise: [72, 209, 204], mediumvioletred: [199, 21, 133], midnightblue: [25, 25, 112], mintcream: [245, 255, 250], mistyrose: [255, 228, 225], moccasin: [255, 228, 181], navajowhite: [255, 222, 173], navy: [0, 0, 128], oldlace: [253, 245, 230], olive: [128, 128, 0], olivedrab: [107, 142, 35], orange: [255, 165, 0], orangered: [255, 69, 0], orchid: [218, 112, 214], palegoldenrod: [238, 232, 170], palegreen: [152, 251, 152], paleturquoise: [175, 238, 238], palevioletred: [219, 112, 147], papayawhip: [255, 239, 213], peachpuff: [255, 218, 185], peru: [205, 133, 63], pink: [255, 192, 203], plum: [221, 160, 221], powderblue: [176, 224, 230], purple: [128, 0, 128], rebeccapurple: [102, 51, 153], red: [255, 0, 0], rosybrown: [188, 143, 143], royalblue: [65, 105, 225], saddlebrown: [139, 69, 19], salmon: [250, 128, 114], sandybrown: [244, 164, 96], seagreen: [46, 139, 87], seashell: [255, 245, 238], sienna: [160, 82, 45], silver: [192, 192, 192], skyblue: [135, 206, 235], slateblue: [106, 90, 205], slategray: [112, 128, 144], slategrey: [112, 128, 144], snow: [255, 250, 250], springgreen: [0, 255, 127], steelblue: [70, 130, 180], tan: [210, 180, 140], teal: [0, 128, 128], thistle: [216, 191, 216], tomato: [255, 99, 71], turquoise: [64, 224, 208], violet: [238, 130, 238], wheat: [245, 222, 179], white: [255, 255, 255], whitesmoke: [245, 245, 245], yellow: [255, 255, 0], yellowgreen: [154, 205, 50] };
    });
    Li = C((Ri) => {
      "use strict";
      c();
      Object.defineProperty(Ri, "__esModule", { value: true });
      function Vp(e, t) {
        for (var n in t)
          Object.defineProperty(e, n, { enumerable: true, get: t[n] });
      }
      __name(Vp, "Vp");
      Vp(Ri, { parseColor: /* @__PURE__ */ __name(() => Zp, "parseColor"), formatColor: /* @__PURE__ */ __name(() => eh, "formatColor") });
      var Oa = Yp(Ta());
      function Yp(e) {
        return e && e.__esModule ? e : { default: e };
      }
      __name(Yp, "Yp");
      var Xp = /^#([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})?$/i, Qp = /^#([a-f\d])([a-f\d])([a-f\d])([a-f\d])?$/i, Ge = /(?:\d+|\d*\.\d+)%?/, zr = /(?:\s*,\s*|\s+)/, Ea = /\s*[,/]\s*/, je2 = /var\(--(?:[^ )]*?)\)/, Kp = new RegExp(`^(rgb)a?\\(\\s*(${Ge.source}|${je2.source})(?:${zr.source}(${Ge.source}|${je2.source}))?(?:${zr.source}(${Ge.source}|${je2.source}))?(?:${Ea.source}(${Ge.source}|${je2.source}))?\\s*\\)$`), Jp = new RegExp(`^(hsl)a?\\(\\s*((?:${Ge.source})(?:deg|rad|grad|turn)?|${je2.source})(?:${zr.source}(${Ge.source}|${je2.source}))?(?:${zr.source}(${Ge.source}|${je2.source}))?(?:${Ea.source}(${Ge.source}|${je2.source}))?\\s*\\)$`);
      function Zp(e, { loose: t = false } = {}) {
        var n, r;
        if (typeof e != "string")
          return null;
        if (e = e.trim(), e === "transparent")
          return { mode: "rgb", color: ["0", "0", "0"], alpha: "0" };
        if (e in Oa.default)
          return { mode: "rgb", color: Oa.default[e].map((u) => u.toString()) };
        let i2 = e.replace(Qp, (u, l, f, d, g) => ["#", l, l, f, f, d, d, g ? g + g : ""].join("")).match(Xp);
        if (i2 !== null)
          return { mode: "rgb", color: [parseInt(i2[1], 16), parseInt(i2[2], 16), parseInt(i2[3], 16)].map((u) => u.toString()), alpha: i2[4] ? (parseInt(i2[4], 16) / 255).toString() : void 0 };
        var s;
        let o = (s = e.match(Kp)) !== null && s !== void 0 ? s : e.match(Jp);
        if (o === null)
          return null;
        let a = [o[2], o[3], o[4]].filter(Boolean).map((u) => u.toString());
        return !t && a.length !== 3 || a.length < 3 && !a.some((u) => /^var\(.*?\)$/.test(u)) ? null : { mode: o[1], color: a, alpha: (n = o[5]) === null || n === void 0 || (r = n.toString) === null || r === void 0 ? void 0 : r.call(n) };
      }
      __name(Zp, "Zp");
      function eh({ mode: e, color: t, alpha: n }) {
        let r = n !== void 0;
        return `${e}(${t.join(" ")}${r ? ` / ${n}` : ""})`;
      }
      __name(eh, "eh");
    });
    Di = C((Ci) => {
      "use strict";
      c();
      Object.defineProperty(Ci, "__esModule", { value: true });
      function th(e, t) {
        for (var n in t)
          Object.defineProperty(e, n, { enumerable: true, get: t[n] });
      }
      __name(th, "th");
      th(Ci, { withAlphaValue: /* @__PURE__ */ __name(() => rh, "withAlphaValue"), default: /* @__PURE__ */ __name(() => nh, "default") });
      var Gr = Li();
      function rh(e, t, n) {
        if (typeof e == "function")
          return e({ opacityValue: t });
        let r = (0, Gr.parseColor)(e, { loose: true });
        return r === null ? n : (0, Gr.formatColor)({ ...r, alpha: t });
      }
      __name(rh, "rh");
      function nh({ color: e, property: t, variable: n }) {
        let r = [].concat(t);
        if (typeof e == "function")
          return { [n]: "1", ...Object.fromEntries(r.map((s) => [s, e({ opacityVariable: n, opacityValue: `var(${n})` })])) };
        let i2 = (0, Gr.parseColor)(e);
        return i2 === null ? Object.fromEntries(r.map((s) => [s, e])) : i2.alpha !== void 0 ? Object.fromEntries(r.map((s) => [s, e])) : { [n]: "1", ...Object.fromEntries(r.map((s) => [s, (0, Gr.formatColor)({ ...i2, alpha: `var(${n})` })])) };
      }
      __name(nh, "nh");
    });
    La = C((Fi) => {
      "use strict";
      c();
      Object.defineProperty(Fi, "__esModule", { value: true });
      function ih(e, t) {
        for (var n in t)
          Object.defineProperty(e, n, { enumerable: true, get: t[n] });
      }
      __name(ih, "ih");
      ih(Fi, { pattern: /* @__PURE__ */ __name(() => sh, "pattern"), withoutCapturing: /* @__PURE__ */ __name(() => Aa, "withoutCapturing"), any: /* @__PURE__ */ __name(() => Ia, "any"), optional: /* @__PURE__ */ __name(() => ah, "optional"), zeroOrMore: /* @__PURE__ */ __name(() => uh, "zeroOrMore"), nestedBrackets: /* @__PURE__ */ __name(() => Ra, "nestedBrackets"), escape: /* @__PURE__ */ __name(() => Je, "escape") });
      var Pa = /[\\^$.*+?()[\]{}|]/g, oh = RegExp(Pa.source);
      function Kt(e) {
        return e = Array.isArray(e) ? e : [e], e = e.map((t) => t instanceof RegExp ? t.source : t), e.join("");
      }
      __name(Kt, "Kt");
      function sh(e) {
        return new RegExp(Kt(e), "g");
      }
      __name(sh, "sh");
      function Aa(e) {
        return new RegExp(`(?:${Kt(e)})`, "g");
      }
      __name(Aa, "Aa");
      function Ia(e) {
        return `(?:${e.map(Kt).join("|")})`;
      }
      __name(Ia, "Ia");
      function ah(e) {
        return `(?:${Kt(e)})?`;
      }
      __name(ah, "ah");
      function uh(e) {
        return `(?:${Kt(e)})*`;
      }
      __name(uh, "uh");
      function Ra(e, t, n = 1) {
        return Aa([Je(e), /[^\s]*/, n === 1 ? `[^${Je(e)}${Je(t)}s]*` : Ia([`[^${Je(e)}${Je(t)}s]*`, Ra(e, t, n - 1)]), /[^\s]*/, Je(t)]);
      }
      __name(Ra, "Ra");
      function Je(e) {
        return e && oh.test(e) ? e.replace(Pa, "\\$&") : e || "";
      }
      __name(Je, "Je");
    });
    Da = C((Ni) => {
      "use strict";
      c();
      Object.defineProperty(Ni, "__esModule", { value: true });
      Object.defineProperty(Ni, "splitAtTopLevelOnly", { enumerable: true, get: /* @__PURE__ */ __name(() => ch, "get") });
      var lh = fh(La());
      function Ca(e) {
        if (typeof WeakMap != "function")
          return null;
        var t = /* @__PURE__ */ new WeakMap(), n = /* @__PURE__ */ new WeakMap();
        return (Ca = /* @__PURE__ */ __name(function(r) {
          return r ? n : t;
        }, "Ca"))(e);
      }
      __name(Ca, "Ca");
      function fh(e, t) {
        if (!t && e && e.__esModule)
          return e;
        if (e === null || typeof e != "object" && typeof e != "function")
          return { default: e };
        var n = Ca(t);
        if (n && n.has(e))
          return n.get(e);
        var r = {}, i2 = Object.defineProperty && Object.getOwnPropertyDescriptor;
        for (var s in e)
          if (s !== "default" && Object.prototype.hasOwnProperty.call(e, s)) {
            var o = i2 ? Object.getOwnPropertyDescriptor(e, s) : null;
            o && (o.get || o.set) ? Object.defineProperty(r, s, o) : r[s] = e[s];
          }
        return r.default = e, n && n.set(e, r), r;
      }
      __name(fh, "fh");
      function* ch(e, t) {
        let n = new RegExp(`[(){}\\[\\]${lh.escape(t)}]`, "g"), r = 0, i2 = 0, s = false, o = 0, a = 0, u = t.length;
        for (let l of e.matchAll(n)) {
          let f = l[0] === t[o], d = o === u - 1, g = f && d;
          l[0] === "(" && r++, l[0] === ")" && r--, l[0] === "[" && r++, l[0] === "]" && r--, l[0] === "{" && r++, l[0] === "}" && r--, f && r === 0 && (a === 0 && (a = l.index), o++), g && r === 0 && (s = true, yield e.substring(i2, a), i2 = a + u), o === u && (o = 0, a = 0);
        }
        s ? yield e.substring(i2) : yield e;
      }
      __name(ch, "ch");
    });
    Na = C((Mi) => {
      "use strict";
      c();
      Object.defineProperty(Mi, "__esModule", { value: true });
      function dh(e, t) {
        for (var n in t)
          Object.defineProperty(e, n, { enumerable: true, get: t[n] });
      }
      __name(dh, "dh");
      dh(Mi, { parseBoxShadowValue: /* @__PURE__ */ __name(() => gh, "parseBoxShadowValue"), formatBoxShadowValue: /* @__PURE__ */ __name(() => vh, "formatBoxShadowValue") });
      var ph = Da(), hh = /* @__PURE__ */ new Set(["inset", "inherit", "initial", "revert", "unset"]), mh = /\ +(?![^(]*\))/g, Fa = /^-?(\d+|\.\d+)(.*?)$/g;
      function gh(e) {
        return Array.from((0, ph.splitAtTopLevelOnly)(e, ",")).map((n) => {
          let r = n.trim(), i2 = { raw: r }, s = r.split(mh), o = /* @__PURE__ */ new Set();
          for (let a of s)
            Fa.lastIndex = 0, !o.has("KEYWORD") && hh.has(a) ? (i2.keyword = a, o.add("KEYWORD")) : Fa.test(a) ? o.has("X") ? o.has("Y") ? o.has("BLUR") ? o.has("SPREAD") || (i2.spread = a, o.add("SPREAD")) : (i2.blur = a, o.add("BLUR")) : (i2.y = a, o.add("Y")) : (i2.x = a, o.add("X")) : i2.color ? (i2.unknown || (i2.unknown = []), i2.unknown.push(a)) : i2.color = a;
          return i2.valid = i2.x !== void 0 && i2.y !== void 0, i2;
        });
      }
      __name(gh, "gh");
      function vh(e) {
        return e.map((t) => t.valid ? [t.keyword, t.x, t.y, t.blur, t.spread, t.color].filter(Boolean).join(" ") : t.raw).join(", ");
      }
      __name(vh, "vh");
    });
    za = C((Wi) => {
      "use strict";
      c();
      Object.defineProperty(Wi, "__esModule", { value: true });
      function bh(e, t) {
        for (var n in t)
          Object.defineProperty(e, n, { enumerable: true, get: t[n] });
      }
      __name(bh, "bh");
      bh(Wi, { normalize: /* @__PURE__ */ __name(() => He2, "normalize"), url: /* @__PURE__ */ __name(() => Wa, "url"), number: /* @__PURE__ */ __name(() => wh, "number"), percentage: /* @__PURE__ */ __name(() => qa, "percentage"), length: /* @__PURE__ */ __name(() => Ba, "length"), lineWidth: /* @__PURE__ */ __name(() => kh, "lineWidth"), shadow: /* @__PURE__ */ __name(() => Th, "shadow"), color: /* @__PURE__ */ __name(() => Oh, "color"), image: /* @__PURE__ */ __name(() => Eh, "image"), gradient: /* @__PURE__ */ __name(() => Ua, "gradient"), position: /* @__PURE__ */ __name(() => Ih, "position"), familyName: /* @__PURE__ */ __name(() => Rh, "familyName"), genericName: /* @__PURE__ */ __name(() => Ch, "genericName"), absoluteSize: /* @__PURE__ */ __name(() => Fh, "absoluteSize"), relativeSize: /* @__PURE__ */ __name(() => Mh, "relativeSize") });
      var yh = Li(), xh = Na(), $i = ["min", "max", "clamp", "calc"], $a = /,(?![^(]*\))/g, jr = /_(?![^(]*\))/g;
      function He2(e, t = true) {
        return e.includes("url(") ? e.split(/(url\(.*?\))/g).filter(Boolean).map((n) => /^url\(.*?\)$/.test(n) ? n : He2(n, false)).join("") : (e = e.replace(/([^\\])_+/g, (n, r) => r + " ".repeat(n.length - 1)).replace(/^_/g, " ").replace(/\\_/g, "_"), t && (e = e.trim()), e = e.replace(/(calc|min|max|clamp)\(.+\)/g, (n) => n.replace(/(-?\d*\.?\d(?!\b-.+[,)](?![^+\-/*])\D)(?:%|[a-z]+)?|\))([+\-/*])/g, "$1 $2 ")), e);
      }
      __name(He2, "He2");
      function Wa(e) {
        return e.startsWith("url(");
      }
      __name(Wa, "Wa");
      function wh(e) {
        return !isNaN(Number(e)) || $i.some((t) => new RegExp(`^${t}\\(.+?`).test(e));
      }
      __name(wh, "wh");
      function qa(e) {
        return e.split(jr).every((t) => /%$/g.test(t) || $i.some((n) => new RegExp(`^${n}\\(.+?%`).test(t)));
      }
      __name(qa, "qa");
      var _h = ["cm", "mm", "Q", "in", "pc", "pt", "px", "em", "ex", "ch", "rem", "lh", "vw", "vh", "vmin", "vmax"], Ma = `(?:${_h.join("|")})`;
      function Ba(e) {
        return e.split(jr).every((t) => t === "0" || new RegExp(`${Ma}$`).test(t) || $i.some((n) => new RegExp(`^${n}\\(.+?${Ma}`).test(t)));
      }
      __name(Ba, "Ba");
      var Sh = /* @__PURE__ */ new Set(["thin", "medium", "thick"]);
      function kh(e) {
        return Sh.has(e);
      }
      __name(kh, "kh");
      function Th(e) {
        let t = (0, xh.parseBoxShadowValue)(He2(e));
        for (let n of t)
          if (!n.valid)
            return false;
        return true;
      }
      __name(Th, "Th");
      function Oh(e) {
        let t = 0;
        return e.split(jr).every((r) => (r = He2(r), r.startsWith("var(") ? true : (0, yh.parseColor)(r, { loose: true }) !== null ? (t++, true) : false)) ? t > 0 : false;
      }
      __name(Oh, "Oh");
      function Eh(e) {
        let t = 0;
        return e.split($a).every((r) => (r = He2(r), r.startsWith("var(") ? true : Wa(r) || Ua(r) || ["element(", "image(", "cross-fade(", "image-set("].some((i2) => r.startsWith(i2)) ? (t++, true) : false)) ? t > 0 : false;
      }
      __name(Eh, "Eh");
      var Ph = /* @__PURE__ */ new Set(["linear-gradient", "radial-gradient", "repeating-linear-gradient", "repeating-radial-gradient", "conic-gradient"]);
      function Ua(e) {
        e = He2(e);
        for (let t of Ph)
          if (e.startsWith(`${t}(`))
            return true;
        return false;
      }
      __name(Ua, "Ua");
      var Ah = /* @__PURE__ */ new Set(["center", "top", "right", "bottom", "left"]);
      function Ih(e) {
        let t = 0;
        return e.split(jr).every((r) => (r = He2(r), r.startsWith("var(") ? true : Ah.has(r) || Ba(r) || qa(r) ? (t++, true) : false)) ? t > 0 : false;
      }
      __name(Ih, "Ih");
      function Rh(e) {
        let t = 0;
        return e.split($a).every((r) => (r = He2(r), r.startsWith("var(") ? true : r.includes(" ") && !/(['"])([^"']+)\1/g.test(r) || /^\d/g.test(r) ? false : (t++, true))) ? t > 0 : false;
      }
      __name(Rh, "Rh");
      var Lh = /* @__PURE__ */ new Set(["serif", "sans-serif", "monospace", "cursive", "fantasy", "system-ui", "ui-serif", "ui-sans-serif", "ui-monospace", "ui-rounded", "math", "emoji", "fangsong"]);
      function Ch(e) {
        return Lh.has(e);
      }
      __name(Ch, "Ch");
      var Dh = /* @__PURE__ */ new Set(["xx-small", "x-small", "small", "medium", "large", "x-large", "x-large", "xxx-large"]);
      function Fh(e) {
        return Dh.has(e);
      }
      __name(Fh, "Fh");
      var Nh = /* @__PURE__ */ new Set(["larger", "smaller"]);
      function Mh(e) {
        return Nh.has(e);
      }
      __name(Mh, "Mh");
    });
    Ka = C((Ui) => {
      "use strict";
      c();
      Object.defineProperty(Ui, "__esModule", { value: true });
      function $h(e, t) {
        for (var n in t)
          Object.defineProperty(e, n, { enumerable: true, get: t[n] });
      }
      __name($h, "$h");
      $h(Ui, { updateAllClasses: /* @__PURE__ */ __name(() => Bh, "updateAllClasses"), asValue: /* @__PURE__ */ __name(() => Zt, "asValue"), parseColorFormat: /* @__PURE__ */ __name(() => qi, "parseColorFormat"), asColor: /* @__PURE__ */ __name(() => Ya, "asColor"), asLookupValue: /* @__PURE__ */ __name(() => Xa, "asLookupValue"), coerceValue: /* @__PURE__ */ __name(() => jh, "coerceValue") });
      var Wh = Bi(_a2()), qh = Bi(Sa()), Ga = Di(), he = za(), ja = Bi(On());
      function Bi(e) {
        return e && e.__esModule ? e : { default: e };
      }
      __name(Bi, "Bi");
      function Bh(e, t) {
        return (0, Wh.default)((i2) => {
          i2.walkClasses((s) => {
            let o = t(s.value);
            s.value = o, s.raws && s.raws.value && (s.raws.value = (0, qh.default)(s.raws.value));
          });
        }).processSync(e);
      }
      __name(Bh, "Bh");
      function Va(e, t) {
        if (!Jt(e))
          return;
        let n = e.slice(1, -1);
        if (!!t(n))
          return (0, he.normalize)(n);
      }
      __name(Va, "Va");
      function Uh(e, t = {}, n) {
        let r = t[e];
        if (r !== void 0)
          return (0, ja.default)(r);
        if (Jt(e)) {
          let i2 = Va(e, n);
          return i2 === void 0 ? void 0 : (0, ja.default)(i2);
        }
      }
      __name(Uh, "Uh");
      function Zt(e, t = {}, { validate: n = /* @__PURE__ */ __name(() => true, "n") } = {}) {
        var r;
        let i2 = (r = t.values) === null || r === void 0 ? void 0 : r[e];
        return i2 !== void 0 ? i2 : t.supportsNegativeValues && e.startsWith("-") ? Uh(e.slice(1), t.values, n) : Va(e, n);
      }
      __name(Zt, "Zt");
      function Jt(e) {
        return e.startsWith("[") && e.endsWith("]");
      }
      __name(Jt, "Jt");
      function zh(e) {
        let t = e.lastIndexOf("/");
        return t === -1 || t === e.length - 1 ? [e] : [e.slice(0, t), e.slice(t + 1)];
      }
      __name(zh, "zh");
      function qi(e) {
        if (typeof e == "string" && e.includes("<alpha-value>")) {
          let t = e;
          return ({ opacityValue: n = 1 }) => t.replace("<alpha-value>", n);
        }
        return e;
      }
      __name(qi, "qi");
      function Ya(e, t = {}, { tailwindConfig: n = {} } = {}) {
        var r;
        if (((r = t.values) === null || r === void 0 ? void 0 : r[e]) !== void 0) {
          var i2;
          return qi((i2 = t.values) === null || i2 === void 0 ? void 0 : i2[e]);
        }
        let [s, o] = zh(e);
        if (o !== void 0) {
          var a, u, l, f;
          let d = (f = (a = t.values) === null || a === void 0 ? void 0 : a[s]) !== null && f !== void 0 ? f : Jt(s) ? s.slice(1, -1) : void 0;
          return d === void 0 ? void 0 : (d = qi(d), Jt(o) ? (0, Ga.withAlphaValue)(d, o.slice(1, -1)) : ((u = n.theme) === null || u === void 0 || (l = u.opacity) === null || l === void 0 ? void 0 : l[o]) === void 0 ? void 0 : (0, Ga.withAlphaValue)(d, n.theme.opacity[o]));
        }
        return Zt(e, t, { validate: he.color });
      }
      __name(Ya, "Ya");
      function Xa(e, t = {}) {
        var n;
        return (n = t.values) === null || n === void 0 ? void 0 : n[e];
      }
      __name(Xa, "Xa");
      function Te(e) {
        return (t, n) => Zt(t, n, { validate: e });
      }
      __name(Te, "Te");
      var Qa = { any: Zt, color: Ya, url: Te(he.url), image: Te(he.image), length: Te(he.length), percentage: Te(he.percentage), position: Te(he.position), lookup: Xa, "generic-name": Te(he.genericName), "family-name": Te(he.familyName), number: Te(he.number), "line-width": Te(he.lineWidth), "absolute-size": Te(he.absoluteSize), "relative-size": Te(he.relativeSize), shadow: Te(he.shadow) }, Ha = Object.keys(Qa);
      function Gh(e, t) {
        let n = e.indexOf(t);
        return n === -1 ? [void 0, e] : [e.slice(0, n), e.slice(n + 1)];
      }
      __name(Gh, "Gh");
      function jh(e, t, n, r) {
        if (Jt(t)) {
          let i2 = t.slice(1, -1), [s, o] = Gh(i2, ":");
          if (!/^[\w-_]+$/g.test(s))
            o = i2;
          else if (s !== void 0 && !Ha.includes(s))
            return [];
          if (o.length > 0 && Ha.includes(s))
            return [Zt(`[${o}]`, n), s];
        }
        for (let i2 of [].concat(e)) {
          let s = Qa[i2](t, n, { tailwindConfig: r });
          if (s !== void 0)
            return [s, i2];
        }
        return [];
      }
      __name(jh, "jh");
    });
    Ja = C((zi) => {
      "use strict";
      c();
      Object.defineProperty(zi, "__esModule", { value: true });
      Object.defineProperty(zi, "default", { enumerable: true, get: /* @__PURE__ */ __name(() => Hh, "get") });
      function Hh(e) {
        return typeof e == "function" ? e({}) : e;
      }
      __name(Hh, "Hh");
    });
    nu = C((ji) => {
      "use strict";
      c();
      Object.defineProperty(ji, "__esModule", { value: true });
      Object.defineProperty(ji, "default", { enumerable: true, get: /* @__PURE__ */ __name(() => d0, "get") });
      var Vh = Ze(On()), Yh = Ze(ss()), Xh = Ze(as()), Qh = Ze(An()), Kh = Ze(ls()), tu = fs(), Za = cs(), Jh = ps(), Zh = Ze(hs()), e0 = ms(), t0 = Ka(), r0 = Di(), n0 = Ze(Ja());
      function Ze(e) {
        return e && e.__esModule ? e : { default: e };
      }
      __name(Ze, "Ze");
      function ft(e) {
        return typeof e == "function";
      }
      __name(ft, "ft");
      function er(e) {
        return typeof e == "object" && e !== null;
      }
      __name(er, "er");
      function tr(e, ...t) {
        let n = t.pop();
        for (let r of t)
          for (let i2 in r) {
            let s = n(e[i2], r[i2]);
            s === void 0 ? er(e[i2]) && er(r[i2]) ? e[i2] = tr(e[i2], r[i2], n) : e[i2] = r[i2] : e[i2] = s;
          }
        return e;
      }
      __name(tr, "tr");
      var Gi = { colors: Kh.default, negative(e) {
        return Object.keys(e).filter((t) => e[t] !== "0").reduce((t, n) => {
          let r = (0, Vh.default)(e[n]);
          return r !== void 0 && (t[`-${n}`] = r), t;
        }, {});
      }, breakpoints(e) {
        return Object.keys(e).filter((t) => typeof e[t] == "string").reduce((t, n) => ({ ...t, [`screen-${n}`]: e[n] }), {});
      } };
      function i0(e, ...t) {
        return ft(e) ? e(...t) : e;
      }
      __name(i0, "i0");
      function o0(e) {
        return e.reduce((t, { extend: n }) => tr(t, n, (r, i2) => r === void 0 ? [i2] : Array.isArray(r) ? [i2, ...r] : [i2, r]), {});
      }
      __name(o0, "o0");
      function s0(e) {
        return { ...e.reduce((t, n) => (0, tu.defaults)(t, n), {}), extend: o0(e) };
      }
      __name(s0, "s0");
      function eu(e, t) {
        if (Array.isArray(e) && er(e[0]))
          return e.concat(t);
        if (Array.isArray(t) && er(t[0]) && er(e))
          return [e, ...t];
        if (Array.isArray(t))
          return t;
      }
      __name(eu, "eu");
      function a0({ extend: e, ...t }) {
        return tr(t, e, (n, r) => !ft(n) && !r.some(ft) ? tr({}, n, ...r, eu) : (i2, s) => tr({}, ...[n, ...r].map((o) => i0(o, i2, s)), eu));
      }
      __name(a0, "a0");
      function* u0(e) {
        let t = (0, Za.toPath)(e);
        if (t.length === 0 || (yield t, Array.isArray(e)))
          return;
        let n = /^(.*?)\s*\/\s*([^/]+)$/, r = e.match(n);
        if (r !== null) {
          let [, i2, s] = r, o = (0, Za.toPath)(i2);
          o.alpha = s, yield o;
        }
      }
      __name(u0, "u0");
      function l0(e) {
        let t = /* @__PURE__ */ __name((n, r) => {
          for (let i2 of u0(n)) {
            let s = 0, o = e;
            for (; o != null && s < i2.length; )
              o = o[i2[s++]], o = ft(o) && (i2.alpha === void 0 || s <= i2.length - 1) ? o(t, Gi) : o;
            if (o !== void 0) {
              if (i2.alpha !== void 0) {
                let a = (0, t0.parseColorFormat)(o);
                return (0, r0.withAlphaValue)(a, i2.alpha, (0, n0.default)(a));
              }
              return (0, Zh.default)(o) ? (0, e0.cloneDeep)(o) : o;
            }
          }
          return r;
        }, "t");
        return Object.assign(t, { theme: t, ...Gi }), Object.keys(e).reduce((n, r) => (n[r] = ft(e[r]) ? e[r](t, Gi) : e[r], n), {});
      }
      __name(l0, "l0");
      function ru(e) {
        let t = [];
        return e.forEach((n) => {
          t = [...t, n];
          var r;
          let i2 = (r = n == null ? void 0 : n.plugins) !== null && r !== void 0 ? r : [];
          i2.length !== 0 && i2.forEach((s) => {
            s.__isOptionsFunction && (s = s());
            var o;
            t = [...t, ...ru([(o = s == null ? void 0 : s.config) !== null && o !== void 0 ? o : {}])];
          });
        }), t;
      }
      __name(ru, "ru");
      function f0(e) {
        return [...e].reduceRight((n, r) => ft(r) ? r({ corePlugins: n }) : (0, Xh.default)(r, n), Yh.default);
      }
      __name(f0, "f0");
      function c0(e) {
        return [...e].reduceRight((n, r) => [...n, ...r], []);
      }
      __name(c0, "c0");
      function d0(e) {
        let t = [...ru(e), { prefix: "", important: false, separator: ":", variantOrder: Qh.default.variantOrder }];
        var n, r;
        return (0, Jh.normalizeConfig)((0, tu.defaults)({ theme: l0(a0(s0(t.map((i2) => (n = i2 == null ? void 0 : i2.theme) !== null && n !== void 0 ? n : {})))), corePlugins: f0(t.map((i2) => i2.corePlugins)), plugins: c0(e.map((i2) => (r = i2 == null ? void 0 : i2.plugins) !== null && r !== void 0 ? r : [])) }, ...t));
      }
      __name(d0, "d0");
    });
    iu = {};
    Zr(iu, { default: /* @__PURE__ */ __name(() => p0, "default") });
    ou = gr(() => {
      c();
      p0 = { yellow: /* @__PURE__ */ __name((e) => e, "yellow") };
    });
    lu = C((Hi) => {
      "use strict";
      c();
      Object.defineProperty(Hi, "__esModule", { value: true });
      function h0(e, t) {
        for (var n in t)
          Object.defineProperty(e, n, { enumerable: true, get: t[n] });
      }
      __name(h0, "h0");
      h0(Hi, { flagEnabled: /* @__PURE__ */ __name(() => v0, "flagEnabled"), issueFlagNotices: /* @__PURE__ */ __name(() => b0, "issueFlagNotices"), default: /* @__PURE__ */ __name(() => y0, "default") });
      var m0 = uu((ou(), vr(iu))), g0 = uu((Ir(), vr(Ar)));
      function uu(e) {
        return e && e.__esModule ? e : { default: e };
      }
      __name(uu, "uu");
      var su = { optimizeUniversalDefaults: false }, rr = { future: ["hoverOnlyWhenSupported", "respectDefaultRingColorOpacity"], experimental: ["optimizeUniversalDefaults", "matchVariant"] };
      function v0(e, t) {
        if (rr.future.includes(t)) {
          var n, r, i2;
          return e.future === "all" || ((i2 = (r = e == null || (n = e.future) === null || n === void 0 ? void 0 : n[t]) !== null && r !== void 0 ? r : su[t]) !== null && i2 !== void 0 ? i2 : false);
        }
        if (rr.experimental.includes(t)) {
          var s, o, a;
          return e.experimental === "all" || ((a = (o = e == null || (s = e.experimental) === null || s === void 0 ? void 0 : s[t]) !== null && o !== void 0 ? o : su[t]) !== null && a !== void 0 ? a : false);
        }
        return false;
      }
      __name(v0, "v0");
      function au(e) {
        if (e.experimental === "all")
          return rr.experimental;
        var t;
        return Object.keys((t = e == null ? void 0 : e.experimental) !== null && t !== void 0 ? t : {}).filter((n) => rr.experimental.includes(n) && e.experimental[n]);
      }
      __name(au, "au");
      function b0(e) {
        if (process.env.JEST_WORKER_ID === void 0 && au(e).length > 0) {
          let t = au(e).map((n) => m0.default.yellow(n)).join(", ");
          g0.default.warn("experimental-flags-enabled", [`You have enabled experimental features: ${t}`, "Experimental features in Tailwind CSS are not covered by semver, may introduce breaking changes, and can change at any time."]);
        }
      }
      __name(b0, "b0");
      var y0 = rr;
    });
    cu = C((Vi) => {
      "use strict";
      c();
      Object.defineProperty(Vi, "__esModule", { value: true });
      Object.defineProperty(Vi, "default", { enumerable: true, get: /* @__PURE__ */ __name(() => fu, "get") });
      var x0 = _0(An()), w0 = lu();
      function _0(e) {
        return e && e.__esModule ? e : { default: e };
      }
      __name(_0, "_0");
      function fu(e) {
        var t;
        let n = ((t = e == null ? void 0 : e.presets) !== null && t !== void 0 ? t : [x0.default]).slice().reverse().flatMap((s) => fu(typeof s == "function" ? s() : s)), r = { respectDefaultRingColorOpacity: { theme: { ringColor: { DEFAULT: "#3b82f67f" } } } }, i2 = Object.keys(r).filter((s) => (0, w0.flagEnabled)(e, s)).map((s) => r[s]);
        return [e, ...i2, ...n];
      }
      __name(fu, "fu");
    });
    pu = C((Yi) => {
      "use strict";
      c();
      Object.defineProperty(Yi, "__esModule", { value: true });
      Object.defineProperty(Yi, "default", { enumerable: true, get: /* @__PURE__ */ __name(() => T0, "get") });
      var S0 = du(nu()), k0 = du(cu());
      function du(e) {
        return e && e.__esModule ? e : { default: e };
      }
      __name(du, "du");
      function T0(...e) {
        let [, ...t] = (0, k0.default)(e[0]);
        return (0, S0.default)([...e, ...t]);
      }
      __name(T0, "T0");
    });
    mu = C((tv, hu) => {
      c();
      var Xi = pu();
      hu.exports = (Xi.__esModule ? Xi : { default: Xi }).default;
    });
    c();
    c();
    c();
    __name(Ku, "Ku");
    gt = null;
    __name(Ce, "Ce");
    c();
    c();
    c();
    vt = /* @__PURE__ */ __name((e, t) => () => (t || e((t = { exports: {} }).exports, t), t.exports), "vt");
    Ju = vt((e, t) => {
      t.exports = ["em", "ex", "ch", "rem", "vh", "vw", "vmin", "vmax", "px", "mm", "cm", "in", "pt", "pc", "mozmm"];
    });
    Zu = vt((e, t) => {
      t.exports = ["deg", "grad", "rad", "turn"];
    });
    el = vt((e, t) => {
      t.exports = ["dpi", "dpcm", "dppx"];
    });
    tl = vt((e, t) => {
      t.exports = ["Hz", "kHz"];
    });
    rl = vt((e, t) => {
      t.exports = ["s", "ms"];
    });
    nl = Ju();
    To = Zu();
    Oo = el();
    Eo = tl();
    Po = rl();
    __name(tn, "tn");
    tn.prototype.valueOf = function() {
      return this.value;
    };
    tn.prototype.toString = function() {
      return this.value + (this.unit || "");
    };
    __name(ze, "ze");
    __name(il, "il");
    __name(en, "en");
    ol = [].concat(To, Eo, nl, Oo, Po);
    __name(sl, "sl");
    al = Object.assign(br(To, "angle"), br(Eo, "frequency"), br(Oo, "resolution"), br(Po, "time"));
    __name(br, "br");
    __name(ul, "ul");
    __name(sn, "sn");
    __name(Ao, "Ao");
    __name(Io, "Io");
    __name(Ro, "Ro");
    __name(xe, "xe");
    __name(bt, "bt");
    __name(de, "de");
    Lo = [32, 160, 4961, 65792, 65793, 4153, 4241, 10].map((e) => String.fromCodePoint(e));
    __name(ce, "ce");
    __name(R, "R");
    __name(Co, "Co");
    Do = { accentHeight: "accent-height", alignmentBaseline: "alignment-baseline", arabicForm: "arabic-form", baselineShift: "baseline-shift", capHeight: "cap-height", clipPath: "clip-path", clipRule: "clip-rule", colorInterpolation: "color-interpolation", colorInterpolationFilters: "color-interpolation-filters", colorProfile: "color-profile", colorRendering: "color-rendering", dominantBaseline: "dominant-baseline", enableBackground: "enable-background", fillOpacity: "fill-opacity", fillRule: "fill-rule", floodColor: "flood-color", floodOpacity: "flood-opacity", fontFamily: "font-family", fontSize: "font-size", fontSizeAdjust: "font-size-adjust", fontStretch: "font-stretch", fontStyle: "font-style", fontVariant: "font-variant", fontWeight: "font-weight", glyphName: "glyph-name", glyphOrientationHorizontal: "glyph-orientation-horizontal", glyphOrientationVertical: "glyph-orientation-vertical", horizAdvX: "horiz-adv-x", horizOriginX: "horiz-origin-x", imageRendering: "image-rendering", letterSpacing: "letter-spacing", lightingColor: "lighting-color", markerEnd: "marker-end", markerMid: "marker-mid", markerStart: "marker-start", overlinePosition: "overline-position", overlineThickness: "overline-thickness", paintOrder: "paint-order", panose1: "panose-1", pointerEvents: "pointer-events", renderingIntent: "rendering-intent", shapeRendering: "shape-rendering", stopColor: "stop-color", stopOpacity: "stop-opacity", strikethroughPosition: "strikethrough-position", strikethroughThickness: "strikethrough-thickness", strokeDasharray: "stroke-dasharray", strokeDashoffset: "stroke-dashoffset", strokeLinecap: "stroke-linecap", strokeLinejoin: "stroke-linejoin", strokeMiterlimit: "stroke-miterlimit", strokeOpacity: "stroke-opacity", strokeWidth: "stroke-width", textAnchor: "text-anchor", textDecoration: "text-decoration", textRendering: "text-rendering", underlinePosition: "underline-position", underlineThickness: "underline-thickness", unicodeBidi: "unicode-bidi", unicodeRange: "unicode-range", unitsPerEm: "units-per-em", vAlphabetic: "v-alphabetic", vHanging: "v-hanging", vIdeographic: "v-ideographic", vMathematical: "v-mathematical", vectorEffect: "vector-effect", vertAdvY: "vert-adv-y", vertOriginX: "vert-origin-x", vertOriginY: "vert-origin-y", wordSpacing: "word-spacing", writingMode: "writing-mode", xHeight: "x-height", xlinkActuate: "xlink:actuate", xlinkArcrole: "xlink:arcrole", xlinkHref: "xlink:href", xlinkRole: "xlink:role", xlinkShow: "xlink:show", xlinkTitle: "xlink:title", xlinkType: "xlink:type", xmlBase: "xml:base", xmlLang: "xml:lang", xmlSpace: "xml:space", xmlnsXlink: "xmlns:xlink" };
    fl2 = /[\r\n%#()<>?[\\\]^`{|}"']/g;
    __name(on, "on");
    __name(yt, "yt");
    __name(Fo, "Fo");
    __name(No, "No");
    __name(Mo, "Mo");
    c();
    c();
    we = "flex";
    $o = { p: { display: we, marginTop: "1em", marginBottom: "1em" }, div: { display: we }, blockquote: { display: we, marginTop: "1em", marginBottom: "1em", marginLeft: 40, marginRight: 40 }, center: { display: we, textAlign: "center" }, hr: { display: we, marginTop: "0.5em", marginBottom: "0.5em", marginLeft: "auto", marginRight: "auto", borderWidth: 1, borderStyle: "solid" }, h1: { display: we, fontSize: "2em", marginTop: "0.67em", marginBottom: "0.67em", marginLeft: 0, marginRight: 0, fontWeight: "bold" }, h2: { display: we, fontSize: "1.5em", marginTop: "0.83em", marginBottom: "0.83em", marginLeft: 0, marginRight: 0, fontWeight: "bold" }, h3: { display: we, fontSize: "1.17em", marginTop: "1em", marginBottom: "1em", marginLeft: 0, marginRight: 0, fontWeight: "bold" }, h4: { display: we, marginTop: "1.33em", marginBottom: "1.33em", marginLeft: 0, marginRight: 0, fontWeight: "bold" }, h5: { display: we, fontSize: "0.83em", marginTop: "1.67em", marginBottom: "1.67em", marginLeft: 0, marginRight: 0, fontWeight: "bold" }, h6: { display: we, fontSize: "0.67em", marginTop: "2.33em", marginBottom: "2.33em", marginLeft: 0, marginRight: 0, fontWeight: "bold" }, u: { textDecoration: "underline" }, strong: { fontWeight: "bold" }, b: { fontWeight: "bold" }, i: { fontStyle: "italic" }, em: { fontStyle: "italic" }, code: { fontFamily: "monospace" }, kbd: { fontFamily: "monospace" }, pre: { display: we, fontFamily: "monospace", whiteSpace: "pre", marginTop: "1em", marginBottom: "1em" }, mark: { backgroundColor: "yellow", color: "black" }, big: { fontSize: "larger" }, small: { fontSize: "smaller" }, s: { textDecoration: "line-through" } };
    c();
    cl = /* @__PURE__ */ new Set(["color", "font", "fontFamily", "fontSize", "fontStyle", "fontWeight", "letterSpacing", "lineHeight", "textAlign", "textTransform", "textShadowOffset", "textShadowColor", "textShadowRadius", "textDecorationLine", "textDecorationStyle", "textDecorationColor", "whiteSpace", "transform", "wordBreak", "opacity", "filter", "_viewportWidth", "_viewportHeight", "_inheritedClipPathId", "_inheritedMaskId", "_inheritedBackgroundClipTextPath"]);
    __name(an, "an");
    c();
    c();
    __name(pl, "pl");
    __name(un, "un");
    __name(ln, "ln");
    vl = /* @__PURE__ */ new Set(["flex", "flexGrow", "flexShrink", "flexBasis", "fontWeight", "lineHeight", "opacity", "scale", "scaleX", "scaleY"]);
    bl = /* @__PURE__ */ new Set(["lineHeight"]);
    __name(yl, "yl");
    __name(xt, "xt");
    __name(xl, "xl");
    __name(Wo, "Wo");
    qo = /rgb\((\d+)\s+(\d+)\s+(\d+)\s*\/\s*([\.\d]+)\)/;
    __name(Bo, "Bo");
    __name(yr, "yr");
    __name(wl, "wl");
    __name(_l, "_l");
    __name(Sl, "Sl");
    c();
    kl = "image/avif";
    Tl = "image/webp";
    xr = "image/png";
    wr = "image/jpeg";
    _r = "image/gif";
    cn = "image/svg+xml";
    __name(jo, "jo");
    __name(Ho, "Ho");
    __name(Vo, "Vo");
    Uo = Co(100);
    fn = /* @__PURE__ */ new Map();
    Ol = [xr, wr, _r, cn];
    __name(El, "El");
    __name(Pl, "Pl");
    __name(zo, "zo");
    __name(Go, "Go");
    __name(Sr, "Sr");
    __name(Al, "Al");
    __name(dn, "dn");
    c();
    c();
    c();
    Yo = [1, 0, 0, 1, 0, 0];
    __name(Il, "Il");
    __name(wt, "wt");
    __name(Xo, "Xo");
    __name(pn, "pn");
    c();
    __name(Rl, "Rl");
    __name(Qo, "Qo");
    __name(Ko, "Ko");
    c();
    __name(hn, "hn");
    __name(mn, "mn");
    c();
    c();
    c();
    gn = gn || {};
    Jo = { type: "directional", value: "bottom" };
    gn.parse = /* @__PURE__ */ function() {
      var e = { linearGradient: /^(\-(webkit|o|ms|moz)\-)?(linear\-gradient)/i, repeatingLinearGradient: /^(\-(webkit|o|ms|moz)\-)?(repeating\-linear\-gradient)/i, radialGradient: /^(\-(webkit|o|ms|moz)\-)?(radial\-gradient)/i, repeatingRadialGradient: /^(\-(webkit|o|ms|moz)\-)?(repeating\-radial\-gradient)/i, sideOrCorner: /^to (left (top|bottom)|right (top|bottom)|top (left|right)|bottom (left|right)|left|right|top|bottom)/i, extentKeywords: /^(closest\-side|closest\-corner|farthest\-side|farthest\-corner|contain|cover)/, positionKeywords: /^(left|center|right|top|bottom)/i, pixelValue: /^(-?(([0-9]*\.[0-9]+)|([0-9]+\.?)))px/, percentageValue: /^(-?(([0-9]*\.[0-9]+)|([0-9]+\.?)))\%/, emValue: /^(-?(([0-9]*\.[0-9]+)|([0-9]+\.?)))em/, angleValue: /^(-?(([0-9]*\.[0-9]+)|([0-9]+\.?)))deg/, zeroValue: /[0]/, startCall: /^\(/, endCall: /^\)/, comma: /^,/, hexColor: /^\#([0-9a-fA-F]+)/, literalColor: /^([a-zA-Z]+)/, rgbColor: /^rgb/i, rgbaColor: /^rgba/i, number: /^(([0-9]*\.[0-9]+)|([0-9]+\.?))/ }, t = "";
      function n(I) {
        var $ = new Error(t + ": " + I);
        throw $.source = t, $;
      }
      __name(n, "n");
      function r() {
        var I = i2();
        return t.length > 0 && n("Invalid input not EOF"), I;
      }
      __name(r, "r");
      function i2() {
        return E(s);
      }
      __name(i2, "i");
      function s() {
        return o("linear-gradient", e.linearGradient, u, Jo) || o("repeating-linear-gradient", e.repeatingLinearGradient, u, Jo) || o("radial-gradient", e.radialGradient, g) || o("repeating-radial-gradient", e.repeatingRadialGradient, g);
      }
      __name(s, "s");
      function o(I, $, z, N) {
        return a($, function(be) {
          var pt = z();
          return pt ? ie(e.comma) || n("Missing comma before color stops") : pt = N, { type: I, orientation: pt, colorStops: E(T) };
        });
      }
      __name(o, "o");
      function a(I, $) {
        var z = ie(I);
        if (z) {
          ie(e.startCall) || n("Missing (");
          var N = $(z);
          return ie(e.endCall) || n("Missing )"), N;
        }
      }
      __name(a, "a");
      function u() {
        return l() || f() || d();
      }
      __name(u, "u");
      function l() {
        return te("directional", e.sideOrCorner, 1);
      }
      __name(l, "l");
      function f() {
        return te("angular", e.angleValue, 1);
      }
      __name(f, "f");
      function d() {
        return te("directional", e.zeroValue, 0);
      }
      __name(d, "d");
      function g() {
        var I, $ = h(), z;
        return $ && (I = [], I.push($), z = t, ie(e.comma) && ($ = h(), $ ? I.push($) : t = z)), I;
      }
      __name(g, "g");
      function h() {
        var I = p() || v();
        if (I)
          I.at = b();
        else {
          var $ = _();
          if ($) {
            I = $;
            var z = b();
            z && (I.at = z);
          } else {
            var z = b();
            if (z)
              I = { type: "shape", value: "ellipse", at: z };
            else {
              var N = y();
              N && (I = { type: "default-radial", at: N });
            }
          }
        }
        return I;
      }
      __name(h, "h");
      function p() {
        var I = te("shape", /^(circle)/i, 0);
        return I && (I.style = ne() || _()), I;
      }
      __name(p, "p");
      function v() {
        var I = te("shape", /^(ellipse)/i, 0);
        return I && (I.style = M() || _()), I;
      }
      __name(v, "v");
      function _() {
        return te("extent-keyword", e.extentKeywords, 1);
      }
      __name(_, "_");
      function b() {
        if (te("position", /^at/, 0)) {
          var I = y();
          return I || n("Missing positioning value"), I;
        }
      }
      __name(b, "b");
      function y() {
        var I = S();
        if (I.x || I.y)
          return { type: "position", value: I };
      }
      __name(y, "y");
      function S() {
        return { x: M(), y: M() };
      }
      __name(S, "S");
      function E(I) {
        var $ = I(), z = [];
        if ($)
          for (z.push($); ie(e.comma); )
            $ = I(), $ ? z.push($) : n("One extra comma");
        return z;
      }
      __name(E, "E");
      function T() {
        var I = D();
        return I || n("Expected color definition"), I.length = M(), I;
      }
      __name(T, "T");
      function D() {
        return L() || U() || H() || F();
      }
      __name(D, "D");
      function F() {
        return te("literal", e.literalColor, 0);
      }
      __name(F, "F");
      function L() {
        return te("hex", e.hexColor, 1);
      }
      __name(L, "L");
      function H() {
        return a(e.rgbColor, function() {
          return { type: "rgb", value: E(J) };
        });
      }
      __name(H, "H");
      function U() {
        return a(e.rgbaColor, function() {
          return { type: "rgba", value: E(J) };
        });
      }
      __name(U, "U");
      function J() {
        return ie(e.number)[1];
      }
      __name(J, "J");
      function M() {
        return te("%", e.percentageValue, 1) || V() || ne();
      }
      __name(M, "M");
      function V() {
        return te("position-keyword", e.positionKeywords, 1);
      }
      __name(V, "V");
      function ne() {
        return te("px", e.pixelValue, 1) || te("em", e.emValue, 1);
      }
      __name(ne, "ne");
      function te(I, $, z) {
        var N = ie($);
        if (N)
          return { type: I, value: N[z] };
      }
      __name(te, "te");
      function ie(I) {
        var $, z;
        return z = /^[\n\r\t\s]+/.exec(t), z && Me2(z[0].length), $ = I.exec(t), $ && Me2($[0].length), $;
      }
      __name(ie, "ie");
      function Me2(I) {
        t = t.substr(I);
      }
      __name(Me2, "Me2");
      return function(I) {
        return t = I.toString(), r();
      };
    }();
    vn = gn;
    __name(Ll, "Ll");
    __name(Cl, "Cl");
    __name(Dl, "Dl");
    __name(bn, "bn");
    __name(Zo, "Zo");
    __name(yn, "yn");
    c();
    __name(Fl, "Fl");
    __name(kr, "kr");
    __name(Tr, "Tr");
    __name(Or, "Or");
    Er = /* @__PURE__ */ __name((e) => e && e[0] !== 0 && e[1] !== 0, "Er");
    __name(st, "st");
    c();
    c();
    c();
    __name(es, "es");
    __name(ts, "ts");
    __name(_t, "_t");
    __name(xn, "xn");
    __name(wn, "wn");
    __name(St, "St");
    c();
    Ml = new RegExp(emoji_regex_default(), "");
    _n = { emoji: Ml, symbol: /\p{Symbol}/u, math: /\p{Math}/u };
    kt = { "ja-JP": /\p{scx=Hira}|\p{scx=Kana}|\p{scx=Han}|[\u3000]|[\uFF00-\uFFEF]/u, "ko-KR": /\p{scx=Hangul}/u, "zh-CN": /\p{scx=Han}/u, "zh-TW": /\p{scx=Han}/u, "zh-HK": /\p{scx=Han}/u, "th-TH": /\p{scx=Thai}/u, "bn-IN": /\p{scx=Bengali}/u, "ar-AR": /\p{scx=Arabic}/u, "ta-IN": /\p{scx=Tamil}/u, "ml-IN": /\p{scx=Malayalam}/u, "he-IL": /\p{scx=Hebrew}/u, "te-IN": /\p{scx=Telugu}/u, devanagari: /\p{scx=Devanagari}/u, kannada: /\p{scx=Kannada}/u };
    Pr = Object.keys({ ...kt, ..._n });
    __name(rs, "rs");
    __name(ns, "ns");
    __name(is, "is");
    __name(Tt, "Tt");
    c();
    os = "unknown";
    __name($l, "$l");
    Ot = class {
      static {
        __name(this, "Ot");
      }
      constructor(t) {
        this.fonts = /* @__PURE__ */ new Map();
        this.addFonts(t);
      }
      get({ name: t, weight: n, style: r }) {
        if (!this.fonts.has(t))
          return null;
        n === "normal" && (n = 400), n === "bold" && (n = 700), typeof n == "string" && (n = Number.parseInt(n, 10));
        let i2 = [...this.fonts.get(t)], s = i2[0];
        for (let o = 1; o < i2.length; o++) {
          let [, a, u] = s, [, l, f] = i2[o];
          $l(n, r, [a, u], [l, f]) > 0 && (s = i2[o]);
        }
        return s[0];
      }
      addFonts(t) {
        for (let n of t) {
          let { name: r, data: i2, lang: s } = n;
          if (s && !rs(s))
            throw new Error(`Invalid value for props \`lang\`: "${s}". The value must be one of the following: ${Pr.join(", ")}.`);
          let o = s ?? os, a = opentype_module_default.parse("buffer" in i2 ? i2.buffer.slice(i2.byteOffset, i2.byteOffset + i2.byteLength) : i2, { lowMemory: true }), u = a.charToGlyphIndex;
          a.charToGlyphIndex = (f) => {
            let d = u.call(a, f);
            return d === 0 && a._trackBrokenChars && a._trackBrokenChars.push(f), d;
          }, this.defaultFont || (this.defaultFont = a);
          let l = `${r.toLowerCase()}_${o}`;
          this.fonts.has(l) || this.fonts.set(l, []), this.fonts.get(l).push([a, n.weight, n.style]);
        }
      }
      getEngine(t = 16, n = 1.2, { fontFamily: r, fontWeight: i2 = 400, fontStyle: s = "normal" }, o) {
        if (!this.fonts.size)
          throw new Error("No fonts are loaded. At least one font is required to calculate the layout.");
        r = (Array.isArray(r) ? r : [r]).map((y) => y.toLowerCase());
        let a = [];
        r.forEach((y) => {
          let S = this.get({ name: y, weight: i2, style: s });
          if (S) {
            a.push(S);
            return;
          }
          let E = this.get({ name: y + "_unknown", weight: i2, style: s });
          if (E) {
            a.push(E);
            return;
          }
        });
        let u = Array.from(this.fonts.keys()), l = [], f = [], d = [];
        for (let y of u)
          if (!r.includes(y))
            if (o) {
              let S = Wl(y);
              S ? S === o ? l.push(this.get({ name: y, weight: i2, style: s })) : f.push(this.get({ name: y, weight: i2, style: s })) : d.push(this.get({ name: y, weight: i2, style: s }));
            } else
              d.push(this.get({ name: y, weight: i2, style: s }));
        let g = /* @__PURE__ */ new Map(), h = /* @__PURE__ */ __name((y, S = true) => {
          let E = y.charCodeAt(0);
          if (g.has(E))
            return g.get(E);
          let T = [...a, ...d, ...l, ...S ? f : []], D = T.find((F, L) => !!F.charToGlyphIndex(y) || S && L === T.length - 1);
          return D && g.set(E, D), D;
        }, "h"), p = /* @__PURE__ */ __name((y, S = false) => {
          var T, D;
          return ((S ? (D = (T = y.tables) == null ? void 0 : T.os2) == null ? void 0 : D.sTypoAscender : 0) || y.ascender) / y.unitsPerEm * t;
        }, "p"), v = /* @__PURE__ */ __name((y, S = false) => {
          var T, D;
          return ((S ? (D = (T = y.tables) == null ? void 0 : T.os2) == null ? void 0 : D.sTypoDescender : 0) || y.descender) / y.unitsPerEm * t;
        }, "v"), _ = /* @__PURE__ */ __name((y) => h(y, false), "_"), b = { has: /* @__PURE__ */ __name((y) => {
          if (y === `
`)
            return true;
          let S = _(y);
          return S ? (S._trackBrokenChars = [], S.stringToGlyphs(y), S._trackBrokenChars.length ? (S._trackBrokenChars = void 0, false) : true) : false;
        }, "has"), baseline: /* @__PURE__ */ __name((y, S = typeof y > "u" ? a[0] : h(y)) => {
          let E = p(S, true), T = v(S, true), D = b.height(y, S), { yMax: F, yMin: L } = S.tables.head, H = E - T, U = (F / (F - L) - 1) * H;
          return D * ((1.2 / n + 1) / 2) + U;
        }, "baseline"), height: /* @__PURE__ */ __name((y, S = typeof y > "u" ? a[0] : h(y)) => (p(S) - v(S)) * (n / 1.2), "height"), measure: /* @__PURE__ */ __name((y, S) => this.measure(h, y, S), "measure"), getSVG: /* @__PURE__ */ __name((y, S) => this.getSVG(h, y, S), "getSVG") };
        return b;
      }
      patchFontFallbackResolver(t, n) {
        let r = [];
        t._trackBrokenChars = r;
        let i2 = t.stringToGlyphs;
        return t.stringToGlyphs = (s, ...o) => {
          let a = i2.call(t, s, ...o);
          for (let u = 0; u < a.length; u++)
            if (a[u].unicode === void 0) {
              let l = r.shift(), f = n(l);
              if (f !== t) {
                let d = f.charToGlyph(l), g = t.unitsPerEm / f.unitsPerEm, h = new opentype_module_default.Path();
                h.unitsPerEm = t.unitsPerEm, h.commands = d.path.commands.map((v) => {
                  let _ = { ...v };
                  for (let b in _)
                    typeof _[b] == "number" && (_[b] *= g);
                  return _;
                });
                let p = new opentype_module_default.Glyph({ ...d, advanceWidth: d.advanceWidth * g, xMin: d.xMin * g, xMax: d.xMax * g, yMin: d.yMin * g, yMax: d.yMax * g, path: h });
                a[u] = p;
              }
            }
          return a;
        }, () => {
          t.stringToGlyphs = i2, t._trackBrokenChars = void 0;
        };
      }
      measure(t, n, { fontSize: r, letterSpacing: i2 = 0 }) {
        let s = t(n), o = this.patchFontFallbackResolver(s, t);
        try {
          return s.getAdvanceWidth(n, r, { letterSpacing: i2 / r });
        } finally {
          o();
        }
      }
      getSVG(t, n, { fontSize: r, top: i2, left: s, letterSpacing: o = 0 }) {
        let a = t(n), u = this.patchFontFallbackResolver(a, t);
        try {
          return r === 0 ? "" : a.getPath(n.replace(/\n/g, ""), s, i2, r, { letterSpacing: o / r }).toPathData(1);
        } finally {
          u();
        }
      }
    };
    __name(Wl, "Wl");
    c();
    __name(kn, "kn");
    c();
    c();
    $u = Xu(mu());
    c();
    c();
    c();
    c();
    O0 = ["ios", "android", "windows", "macos", "web"];
    __name(vu, "vu");
    E0 = ["portrait", "landscape"];
    __name(bu, "bu");
    (function(e) {
      e.fontSize = "fontSize", e.lineHeight = "lineHeight";
    })(gu || (gu = {}));
    (function(e) {
      e.rem = "rem", e.em = "em", e.px = "px", e.percent = "%", e.vw = "vw", e.vh = "vh", e.none = "<no-css-unit>";
    })(j || (j = {}));
    __name(Qi, "Qi");
    __name(Ki, "Ki");
    __name(m, "m");
    __name(se, "se");
    __name(Ne, "Ne");
    __name(Hr, "Hr");
    __name(xu, "xu");
    __name(Ie, "Ie");
    __name(Ve, "Ve");
    __name(Zi, "Zi");
    P0 = { t: "Top", tr: "TopRight", tl: "TopLeft", b: "Bottom", br: "BottomRight", bl: "BottomLeft", l: "Left", r: "Right", x: "Horizontal", y: "Vertical" };
    __name(eo, "eo");
    __name(to, "to");
    __name(et2, "et2");
    __name(Oe, "Oe");
    __name(yu, "yu");
    __name(A0, "A0");
    __name(I0, "I0");
    me = typeof process > "u" || ((Ji = process == null ? void 0 : process.env) === null || Ji === void 0 ? void 0 : Ji.JEST_WORKER_ID) === void 0 ? A0 : I0;
    R0 = [["aspect-square", m({ aspectRatio: 1 })], ["aspect-video", m({ aspectRatio: 16 / 9 })], ["items-center", m({ alignItems: "center" })], ["items-start", m({ alignItems: "flex-start" })], ["items-end", m({ alignItems: "flex-end" })], ["items-baseline", m({ alignItems: "baseline" })], ["items-stretch", m({ alignItems: "stretch" })], ["justify-start", m({ justifyContent: "flex-start" })], ["justify-end", m({ justifyContent: "flex-end" })], ["justify-center", m({ justifyContent: "center" })], ["justify-between", m({ justifyContent: "space-between" })], ["justify-around", m({ justifyContent: "space-around" })], ["justify-evenly", m({ justifyContent: "space-evenly" })], ["content-start", m({ alignContent: "flex-start" })], ["content-end", m({ alignContent: "flex-end" })], ["content-between", m({ alignContent: "space-between" })], ["content-around", m({ alignContent: "space-around" })], ["content-stretch", m({ alignContent: "stretch" })], ["content-center", m({ alignContent: "center" })], ["self-auto", m({ alignSelf: "auto" })], ["self-start", m({ alignSelf: "flex-start" })], ["self-end", m({ alignSelf: "flex-end" })], ["self-center", m({ alignSelf: "center" })], ["self-stretch", m({ alignSelf: "stretch" })], ["self-baseline", m({ alignSelf: "baseline" })], ["direction-inherit", m({ direction: "inherit" })], ["direction-ltr", m({ direction: "ltr" })], ["direction-rtl", m({ direction: "rtl" })], ["hidden", m({ display: "none" })], ["flex", m({ display: "flex" })], ["flex-row", m({ flexDirection: "row" })], ["flex-row-reverse", m({ flexDirection: "row-reverse" })], ["flex-col", m({ flexDirection: "column" })], ["flex-col-reverse", m({ flexDirection: "column-reverse" })], ["flex-wrap", m({ flexWrap: "wrap" })], ["flex-wrap-reverse", m({ flexWrap: "wrap-reverse" })], ["flex-nowrap", m({ flexWrap: "nowrap" })], ["flex-auto", m({ flexGrow: 1, flexShrink: 1, flexBasis: "auto" })], ["flex-initial", m({ flexGrow: 0, flexShrink: 1, flexBasis: "auto" })], ["flex-none", m({ flexGrow: 0, flexShrink: 0, flexBasis: "auto" })], ["overflow-hidden", m({ overflow: "hidden" })], ["overflow-visible", m({ overflow: "visible" })], ["overflow-scroll", m({ overflow: "scroll" })], ["absolute", m({ position: "absolute" })], ["relative", m({ position: "relative" })], ["italic", m({ fontStyle: "italic" })], ["not-italic", m({ fontStyle: "normal" })], ["oldstyle-nums", nr("oldstyle-nums")], ["small-caps", nr("small-caps")], ["lining-nums", nr("lining-nums")], ["tabular-nums", nr("tabular-nums")], ["proportional-nums", nr("proportional-nums")], ["font-thin", m({ fontWeight: "100" })], ["font-100", m({ fontWeight: "100" })], ["font-extralight", m({ fontWeight: "200" })], ["font-200", m({ fontWeight: "200" })], ["font-light", m({ fontWeight: "300" })], ["font-300", m({ fontWeight: "300" })], ["font-normal", m({ fontWeight: "normal" })], ["font-400", m({ fontWeight: "400" })], ["font-medium", m({ fontWeight: "500" })], ["font-500", m({ fontWeight: "500" })], ["font-semibold", m({ fontWeight: "600" })], ["font-600", m({ fontWeight: "600" })], ["font-bold", m({ fontWeight: "bold" })], ["font-700", m({ fontWeight: "700" })], ["font-extrabold", m({ fontWeight: "800" })], ["font-800", m({ fontWeight: "800" })], ["font-black", m({ fontWeight: "900" })], ["font-900", m({ fontWeight: "900" })], ["include-font-padding", m({ includeFontPadding: true })], ["remove-font-padding", m({ includeFontPadding: false })], ["max-w-none", m({ maxWidth: "99999%" })], ["text-left", m({ textAlign: "left" })], ["text-center", m({ textAlign: "center" })], ["text-right", m({ textAlign: "right" })], ["text-justify", m({ textAlign: "justify" })], ["text-auto", m({ textAlign: "auto" })], ["underline", m({ textDecorationLine: "underline" })], ["line-through", m({ textDecorationLine: "line-through" })], ["no-underline", m({ textDecorationLine: "none" })], ["uppercase", m({ textTransform: "uppercase" })], ["lowercase", m({ textTransform: "lowercase" })], ["capitalize", m({ textTransform: "capitalize" })], ["normal-case", m({ textTransform: "none" })], ["w-auto", m({ width: "auto" })], ["h-auto", m({ height: "auto" })], ["shadow-sm", m({ shadowOffset: { width: 1, height: 1 }, shadowColor: "#000", shadowRadius: 1, shadowOpacity: 0.025, elevation: 1 })], ["shadow", m({ shadowOffset: { width: 1, height: 1 }, shadowColor: "#000", shadowRadius: 1, shadowOpacity: 0.075, elevation: 2 })], ["shadow-md", m({ shadowOffset: { width: 1, height: 1 }, shadowColor: "#000", shadowRadius: 3, shadowOpacity: 0.125, elevation: 3 })], ["shadow-lg", m({ shadowOffset: { width: 1, height: 1 }, shadowColor: "#000", shadowOpacity: 0.15, shadowRadius: 8, elevation: 8 })], ["shadow-xl", m({ shadowOffset: { width: 1, height: 1 }, shadowColor: "#000", shadowOpacity: 0.19, shadowRadius: 20, elevation: 12 })], ["shadow-2xl", m({ shadowOffset: { width: 1, height: 1 }, shadowColor: "#000", shadowOpacity: 0.25, shadowRadius: 30, elevation: 16 })], ["shadow-none", m({ shadowOffset: { width: 0, height: 0 }, shadowColor: "#000", shadowRadius: 0, shadowOpacity: 0, elevation: 0 })]];
    ro = R0;
    __name(nr, "nr");
    ir = class {
      static {
        __name(this, "ir");
      }
      constructor(t) {
        this.ir = new Map(ro), this.styles = /* @__PURE__ */ new Map(), this.prefixes = /* @__PURE__ */ new Map(), this.ir = new Map([...ro, ...t ?? []]);
      }
      getStyle(t) {
        return this.styles.get(t);
      }
      setStyle(t, n) {
        this.styles.set(t, n);
      }
      getIr(t) {
        return this.ir.get(t);
      }
      setIr(t, n) {
        this.ir.set(t, n);
      }
      getPrefixMatch(t) {
        return this.prefixes.get(t);
      }
      setPrefixMatch(t, n) {
        this.prefixes.set(t, n);
      }
    };
    c();
    c();
    __name(no, "no");
    __name(wu, "wu");
    c();
    __name(io, "io");
    c();
    __name(oo, "oo");
    __name(_u, "_u");
    __name(Su, "Su");
    c();
    __name(so, "so");
    c();
    __name(ao, "ao");
    c();
    __name(tt, "tt");
    __name(or, "or");
    __name(ku, "ku");
    __name(Tu, "Tu");
    Vr = { bg: { opacity: "__opacity_bg", color: "backgroundColor" }, text: { opacity: "__opacity_text", color: "color" }, border: { opacity: "__opacity_border", color: "borderColor" }, borderTop: { opacity: "__opacity_border", color: "borderTopColor" }, borderBottom: { opacity: "__opacity_border", color: "borderBottomColor" }, borderLeft: { opacity: "__opacity_border", color: "borderLeftColor" }, borderRight: { opacity: "__opacity_border", color: "borderRightColor" }, shadow: { opacity: "__opacity_shadow", color: "shadowColor" }, tint: { opacity: "__opacity_tint", color: "tintColor" } };
    __name(L0, "L0");
    __name(Ou, "Ou");
    C0 = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    D0 = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i;
    c();
    __name(Pu, "Pu");
    __name(F0, "F0");
    __name(Au, "Au");
    __name(Eu, "Eu");
    c();
    __name(ct, "ct");
    __name(Iu, "Iu");
    c();
    __name(sr, "sr");
    __name(Ru, "Ru");
    c();
    __name(uo, "uo");
    __name(ar, "ar");
    c();
    __name(Lu, "Lu");
    __name(N0, "N0");
    c();
    __name(Cu, "Cu");
    c();
    __name(Du, "Du");
    __name(Fu, "Fu");
    __name(lo, "lo");
    dt = class {
      static {
        __name(this, "dt");
      }
      constructor(t, n = {}, r, i2, s) {
        var o, a, u, l, f, d;
        this.config = n, this.cache = r, this.position = 0, this.isNull = false, this.isNegative = false, this.context = {}, this.context.device = i2;
        let g = t.trim().split(":"), h = [];
        g.length === 1 ? this.string = t : (this.string = (o = g.pop()) !== null && o !== void 0 ? o : "", h = g), this.char = this.string[0];
        let p = so((a = this.config.theme) === null || a === void 0 ? void 0 : a.screens);
        for (let v of h)
          if (p[v]) {
            let _ = (u = p[v]) === null || u === void 0 ? void 0 : u[2];
            _ !== void 0 && (this.order = ((l = this.order) !== null && l !== void 0 ? l : 0) + _);
            let b = (f = i2.windowDimensions) === null || f === void 0 ? void 0 : f.width;
            if (b) {
              let [y, S] = (d = p[v]) !== null && d !== void 0 ? d : [0, 0];
              (b <= y || b > S) && (this.isNull = true);
            } else
              this.isNull = true;
          } else
            vu(v) ? this.isNull = v !== s : bu(v) ? i2.windowDimensions ? (i2.windowDimensions.width > i2.windowDimensions.height ? "landscape" : "portrait") !== v ? this.isNull = true : this.incrementOrder() : this.isNull = true : v === "retina" ? i2.pixelDensity === 2 ? this.incrementOrder() : this.isNull = true : v === "dark" ? i2.colorScheme !== "dark" ? this.isNull = true : this.incrementOrder() : this.handlePossibleArbitraryBreakpointPrefix(v) || (this.isNull = true);
      }
      parse() {
        if (this.isNull)
          return { kind: "null" };
        let t = this.cache.getIr(this.rest);
        if (t)
          return t;
        this.parseIsNegative();
        let n = this.parseUtility();
        return n ? this.order !== void 0 ? { kind: "ordered", order: this.order, styleIr: n } : n : { kind: "null" };
      }
      parseUtility() {
        var t, n, r, i2, s;
        let o = this.config.theme, a = null;
        switch (this.char) {
          case "m":
          case "p": {
            let u = this.peekSlice(1, 3).match(/^(t|b|r|l|x|y)?-/);
            if (u) {
              let l = this.char === "m" ? "margin" : "padding";
              this.advance(((n = (t = u[0]) === null || t === void 0 ? void 0 : t.length) !== null && n !== void 0 ? n : 0) + 1);
              let f = eo(u[1]), d = oo(l, f, this.isNegative, this.rest, (r = this.config.theme) === null || r === void 0 ? void 0 : r[l]);
              if (d)
                return d;
            }
          }
        }
        if (this.consumePeeked("h-") && (a = uo("height", this.rest, this.context, o == null ? void 0 : o.height), a) || this.consumePeeked("w-") && (a = uo("width", this.rest, this.context, o == null ? void 0 : o.width), a) || this.consumePeeked("min-w-") && (a = ar("minWidth", this.rest, this.context, o == null ? void 0 : o.minWidth), a) || this.consumePeeked("min-h-") && (a = ar("minHeight", this.rest, this.context, o == null ? void 0 : o.minHeight), a) || this.consumePeeked("max-w-") && (a = ar("maxWidth", this.rest, this.context, o == null ? void 0 : o.maxWidth), a) || this.consumePeeked("max-h-") && (a = ar("maxHeight", this.rest, this.context, o == null ? void 0 : o.maxHeight), a) || this.consumePeeked("leading-") && (a = io(this.rest, o == null ? void 0 : o.lineHeight), a) || this.consumePeeked("text-") && (a = no(this.rest, o == null ? void 0 : o.fontSize, this.context), a || (a = tt("text", this.rest, o == null ? void 0 : o.textColor), a) || this.consumePeeked("opacity-") && (a = or("text", this.rest), a)) || this.consumePeeked("font-") && (a = ao(this.rest, o == null ? void 0 : o.fontFamily), a) || this.consumePeeked("aspect-") && (this.consumePeeked("ratio-") && me("`aspect-ratio-{ratio}` is deprecated, use `aspect-{ratio}` instead"), a = Ne("aspectRatio", this.rest, { fractions: true }), a) || this.consumePeeked("tint-") && (a = tt("tint", this.rest, o == null ? void 0 : o.colors), a) || this.consumePeeked("bg-") && (a = tt("bg", this.rest, o == null ? void 0 : o.backgroundColor), a || this.consumePeeked("opacity-") && (a = or("bg", this.rest), a)) || this.consumePeeked("border") && (a = Pu(this.rest, o), a || this.consumePeeked("-opacity-") && (a = or("border", this.rest), a)) || this.consumePeeked("rounded") && (a = Au(this.rest, o == null ? void 0 : o.borderRadius), a) || this.consumePeeked("bottom-") && (a = ct("bottom", this.rest, this.isNegative, o == null ? void 0 : o.inset), a) || this.consumePeeked("top-") && (a = ct("top", this.rest, this.isNegative, o == null ? void 0 : o.inset), a) || this.consumePeeked("left-") && (a = ct("left", this.rest, this.isNegative, o == null ? void 0 : o.inset), a) || this.consumePeeked("right-") && (a = ct("right", this.rest, this.isNegative, o == null ? void 0 : o.inset), a) || this.consumePeeked("inset-") && (a = ct("inset", this.rest, this.isNegative, o == null ? void 0 : o.inset), a) || this.consumePeeked("flex-") && (this.consumePeeked("grow") ? a = sr("Grow", this.rest, o == null ? void 0 : o.flexGrow) : this.consumePeeked("shrink") ? a = sr("Shrink", this.rest, o == null ? void 0 : o.flexShrink) : a = Ru(this.rest, o == null ? void 0 : o.flex), a) || this.consumePeeked("grow") && (a = sr("Grow", this.rest, o == null ? void 0 : o.flexGrow), a) || this.consumePeeked("shrink") && (a = sr("Shrink", this.rest, o == null ? void 0 : o.flexShrink), a) || this.consumePeeked("shadow-color-opacity-") && (a = or("shadow", this.rest), a) || this.consumePeeked("shadow-opacity-") && (a = Du(this.rest), a) || this.consumePeeked("shadow-offset-") && (a = Fu(this.rest), a) || this.consumePeeked("shadow-radius-") && (a = Oe("shadowRadius", this.rest), a) || this.consumePeeked("shadow-") && (a = tt("shadow", this.rest, o == null ? void 0 : o.colors), a))
          return a;
        if (this.consumePeeked("elevation-")) {
          let u = parseInt(this.rest, 10);
          if (!Number.isNaN(u))
            return m({ elevation: u });
        }
        if (this.consumePeeked("opacity-") && (a = Cu(this.rest, o == null ? void 0 : o.opacity), a) || this.consumePeeked("tracking-") && (a = Lu(this.rest, this.isNegative, o == null ? void 0 : o.letterSpacing), a))
          return a;
        if (this.consumePeeked("z-")) {
          let u = Number((s = (i2 = o == null ? void 0 : o.zIndex) === null || i2 === void 0 ? void 0 : i2[this.rest]) !== null && s !== void 0 ? s : this.rest);
          if (!Number.isNaN(u))
            return m({ zIndex: u });
        }
        return me(`\`${this.rest}\` unknown or invalid utility`), null;
      }
      handlePossibleArbitraryBreakpointPrefix(t) {
        var n;
        if (t[0] !== "m")
          return false;
        let r = t.match(/^(min|max)-(w|h)-\[([^\]]+)\]$/);
        if (!r)
          return false;
        if (!(!((n = this.context.device) === null || n === void 0) && n.windowDimensions))
          return this.isNull = true, true;
        let i2 = this.context.device.windowDimensions, [, s = "", o = "", a = ""] = r, u = o === "w" ? i2.width : i2.height, l = se(a, this.context);
        if (l === null)
          return this.isNull = true, true;
        let [f, d] = l;
        return d !== "px" && (this.isNull = true), (s === "min" ? u >= f : u <= f) ? this.incrementOrder() : this.isNull = true, true;
      }
      advance(t = 1) {
        this.position += t, this.char = this.string[this.position];
      }
      get rest() {
        return this.peekSlice(0, this.string.length);
      }
      peekSlice(t, n) {
        return this.string.slice(this.position + t, this.position + n);
      }
      consumePeeked(t) {
        return this.peekSlice(0, t.length) === t ? (this.advance(t.length), true) : false;
      }
      parseIsNegative() {
        this.char === "-" && (this.advance(), this.isNegative = true, this.context.isNegative = true);
      }
      incrementOrder() {
        var t;
        this.order = ((t = this.order) !== null && t !== void 0 ? t : 0) + 1;
      }
    };
    c();
    __name(Nu, "Nu");
    __name(fo, "fo");
    __name(M0, "M0");
    c();
    __name(Mu, "Mu");
    __name($0, "$0");
    __name(Re, "Re");
    W0 = { addComponents: Re, addBase: Re, addVariant: Re, e: Re, prefix: Re, theme: Re, variants: Re, config: Re, corePlugins: Re, matchUtilities: Re, postcss: null };
    __name(Wu, "Wu");
    __name(q0, "q0");
    U0 = { handler: /* @__PURE__ */ __name(({ addUtilities: e }) => {
      e({ "shadow-sm": { boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)" }, shadow: { boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)" }, "shadow-md": { boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)" }, "shadow-lg": { boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)" }, "shadow-xl": { boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)" }, "shadow-2xl": { boxShadow: "0 25px 50px -12px rgb(0 0 0 / 0.25)" }, "shadow-inner": { boxShadow: "inset 0 2px 4px 0 rgb(0 0 0 / 0.05)" }, "shadow-none": { boxShadow: "0 0 #0000" } });
    }, "handler") };
    __name(z0, "z0");
    __name(co, "co");
    po = /* @__PURE__ */ new WeakMap();
    __name(Bu, "Bu");
    __name(G0, "G0");
    __name(qu, "qu");
    Nn = Object.create;
    He = Object.defineProperty;
    Sn = Object.getOwnPropertyDescriptor;
    Fn = Object.getOwnPropertyNames;
    Un2 = Object.getPrototypeOf;
    Ln = Object.prototype.hasOwnProperty;
    Dn = /* @__PURE__ */ __name((y) => He(y, "__esModule", { value: true }), "Dn");
    Tt2 = /* @__PURE__ */ __name((y, l) => () => (l || y((l = { exports: {} }).exports, l), l.exports), "Tt2");
    Wn = /* @__PURE__ */ __name((y, l, f, T) => {
      if (l && typeof l == "object" || typeof l == "function")
        for (let g of Fn(l))
          !Ln.call(y, g) && (f || g !== "default") && He(y, g, { get: /* @__PURE__ */ __name(() => l[g], "get"), enumerable: !(T = Sn(l, g)) || T.enumerable });
      return y;
    }, "Wn");
    mt = /* @__PURE__ */ __name((y, l) => Wn(Dn(He(y != null ? Nn(Un2(y)) : {}, "default", !l && y && y.__esModule ? { get: /* @__PURE__ */ __name(() => y.default, "get"), enumerable: true } : { value: y, enumerable: true })), y), "mt");
    Pt = Tt2((jn2, Et) => {
      var Vn2 = { ALIGN_COUNT: 8, ALIGN_AUTO: 0, ALIGN_FLEX_START: 1, ALIGN_CENTER: 2, ALIGN_FLEX_END: 3, ALIGN_STRETCH: 4, ALIGN_BASELINE: 5, ALIGN_SPACE_BETWEEN: 6, ALIGN_SPACE_AROUND: 7, DIMENSION_COUNT: 2, DIMENSION_WIDTH: 0, DIMENSION_HEIGHT: 1, DIRECTION_COUNT: 3, DIRECTION_INHERIT: 0, DIRECTION_LTR: 1, DIRECTION_RTL: 2, DISPLAY_COUNT: 2, DISPLAY_FLEX: 0, DISPLAY_NONE: 1, EDGE_COUNT: 9, EDGE_LEFT: 0, EDGE_TOP: 1, EDGE_RIGHT: 2, EDGE_BOTTOM: 3, EDGE_START: 4, EDGE_END: 5, EDGE_HORIZONTAL: 6, EDGE_VERTICAL: 7, EDGE_ALL: 8, EXPERIMENTAL_FEATURE_COUNT: 1, EXPERIMENTAL_FEATURE_WEB_FLEX_BASIS: 0, FLEX_DIRECTION_COUNT: 4, FLEX_DIRECTION_COLUMN: 0, FLEX_DIRECTION_COLUMN_REVERSE: 1, FLEX_DIRECTION_ROW: 2, FLEX_DIRECTION_ROW_REVERSE: 3, GUTTER_COUNT: 3, GUTTER_COLUMN: 0, GUTTER_ROW: 1, GUTTER_ALL: 2, JUSTIFY_COUNT: 6, JUSTIFY_FLEX_START: 0, JUSTIFY_CENTER: 1, JUSTIFY_FLEX_END: 2, JUSTIFY_SPACE_BETWEEN: 3, JUSTIFY_SPACE_AROUND: 4, JUSTIFY_SPACE_EVENLY: 5, LOG_LEVEL_COUNT: 6, LOG_LEVEL_ERROR: 0, LOG_LEVEL_WARN: 1, LOG_LEVEL_INFO: 2, LOG_LEVEL_DEBUG: 3, LOG_LEVEL_VERBOSE: 4, LOG_LEVEL_FATAL: 5, MEASURE_MODE_COUNT: 3, MEASURE_MODE_UNDEFINED: 0, MEASURE_MODE_EXACTLY: 1, MEASURE_MODE_AT_MOST: 2, NODE_TYPE_COUNT: 2, NODE_TYPE_DEFAULT: 0, NODE_TYPE_TEXT: 1, OVERFLOW_COUNT: 3, OVERFLOW_VISIBLE: 0, OVERFLOW_HIDDEN: 1, OVERFLOW_SCROLL: 2, POSITION_TYPE_COUNT: 3, POSITION_TYPE_STATIC: 0, POSITION_TYPE_RELATIVE: 1, POSITION_TYPE_ABSOLUTE: 2, PRINT_OPTIONS_COUNT: 3, PRINT_OPTIONS_LAYOUT: 1, PRINT_OPTIONS_STYLE: 2, PRINT_OPTIONS_CHILDREN: 4, UNIT_COUNT: 4, UNIT_UNDEFINED: 0, UNIT_POINT: 1, UNIT_PERCENT: 2, UNIT_AUTO: 3, WRAP_COUNT: 3, WRAP_NO_WRAP: 0, WRAP_WRAP: 1, WRAP_WRAP_REVERSE: 2 };
      Et.exports = Vn2;
    });
    wt2 = Tt2((Gn, bt2) => {
      var $ = mt(Pt()), Ct = class {
        static {
          __name(this, "Ct");
        }
        left;
        right;
        top;
        bottom;
        width;
        height;
        constructor(l, f, T, g, W, R2) {
          this.left = l, this.right = f, this.top = T, this.bottom = g, this.width = W, this.height = R2;
        }
        fromJS(l) {
          l(this.left, this.right, this.top, this.bottom, this.width, this.height);
        }
        toString() {
          return `<Layout#${this.left}:${this.right};${this.top}:${this.bottom};${this.width}:${this.height}>`;
        }
      }, ye = class {
        static {
          __name(this, "ye");
        }
        static fromJS({ width: l, height: f }) {
          return new ye(l, f);
        }
        width;
        height;
        constructor(l, f) {
          this.width = l, this.height = f;
        }
        fromJS(l) {
          l(this.width, this.height);
        }
        toString() {
          return `<Size#${this.width}x${this.height}>`;
        }
      }, ke = class {
        static {
          __name(this, "ke");
        }
        unit;
        value;
        constructor(l, f) {
          this.unit = l, this.value = f;
        }
        fromJS(l) {
          l(this.unit, this.value);
        }
        toString() {
          switch (this.unit) {
            case $.default.UNIT_POINT:
              return String(this.value);
            case $.default.UNIT_PERCENT:
              return `${this.value}%`;
            case $.default.UNIT_AUTO:
              return "auto";
            default:
              return `${this.value}?`;
          }
        }
        valueOf() {
          return this.value;
        }
      };
      function J(y, l, f) {
        let T = y[l];
        y[l] = function(...g) {
          return f.call(this, T, ...g);
        };
      }
      __name(J, "J");
      bt2.exports = (y, l) => {
        for (let T of ["setPosition", "setMargin", "setFlexBasis", "setWidth", "setHeight", "setMinWidth", "setMinHeight", "setMaxWidth", "setMaxHeight", "setPadding"]) {
          let g = { [$.default.UNIT_POINT]: l.Node.prototype[T], [$.default.UNIT_PERCENT]: l.Node.prototype[`${T}Percent`], [$.default.UNIT_AUTO]: l.Node.prototype[`${T}Auto`] };
          J(l.Node.prototype, T, function(W, ...R2) {
            let A = R2.pop(), N, C2;
            if (A === "auto")
              N = $.default.UNIT_AUTO, C2 = void 0;
            else if (A instanceof ke)
              N = A.unit, C2 = A.valueOf();
            else if (N = typeof A == "string" && A.endsWith("%") ? $.default.UNIT_PERCENT : $.default.UNIT_POINT, C2 = parseFloat(A), !Number.isNaN(A) && Number.isNaN(C2))
              throw new Error(`Invalid value ${A} for ${T}`);
            if (!g[N])
              throw new Error(`Failed to execute "${T}": Unsupported unit '${A}'`);
            return C2 !== void 0 ? g[N].call(this, ...R2, C2) : g[N].call(this, ...R2);
          });
        }
        J(l.Config.prototype, "free", function() {
          l.Config.destroy(this);
        }), J(l.Node, "create", function(T, g) {
          return g ? l.Node.createWithConfig(g) : l.Node.createDefault();
        }), J(l.Node.prototype, "free", function() {
          l.Node.destroy(this);
        }), J(l.Node.prototype, "freeRecursive", function() {
          for (let T = 0, g = this.getChildCount(); T < g; ++T)
            this.getChild(0).freeRecursive();
          this.free();
        });
        function f(T) {
          return l.MeasureCallback.implement({ measure: /* @__PURE__ */ __name((...g) => {
            let { width: W, height: R2 } = T(...g);
            return { width: W ?? 0, height: R2 ?? 0 };
          }, "measure") });
        }
        __name(f, "f");
        return J(l.Node.prototype, "setMeasureFunc", function(T, g) {
          T.call(this, f(g));
        }), J(l.Node.prototype, "calculateLayout", function(T, g = NaN, W = NaN, R2 = $.default.DIRECTION_LTR) {
          return T.call(this, g, W, R2);
        }), { Config: l.Config, Node: l.Node, Layout: y("Layout", Ct), Size: y("Size", ye), Value: y("Value", ke), ...$.default };
      };
    });
    je = mt(wt2(), 1);
    Hn = (() => {
      var y = typeof document < "u" && document.currentScript ? document.currentScript.src : void 0;
      return function(l) {
        l = l || {};
        var f;
        f || (f = typeof l < "u" ? l : {});
        var T, g;
        f.ready = new Promise(function(t, e) {
          T = t, g = e;
        });
        var W = Object.assign({}, f), R2 = [], A = true, N = false, C2 = "";
        function Ot2(t) {
          return f.locateFile ? f.locateFile(t, C2) : C2 + t;
        }
        __name(Ot2, "Ot2");
        var It, $t, Te, Rt;
        (A || N) && (N ? C2 = self.location.href : typeof document < "u" && document.currentScript && (C2 = document.currentScript.src), y && (C2 = y), C2.indexOf("blob:") !== 0 ? C2 = C2.substr(0, C2.replace(/[?#].*/, "").lastIndexOf("/") + 1) : C2 = "", It = /* @__PURE__ */ __name((t) => {
          var e = new XMLHttpRequest();
          return e.open("GET", t, false), e.send(null), e.responseText;
        }, "It"), N && (Te = /* @__PURE__ */ __name((t) => {
          var e = new XMLHttpRequest();
          return e.open("GET", t, false), e.responseType = "arraybuffer", e.send(null), new Uint8Array(e.response);
        }, "Te")), $t = /* @__PURE__ */ __name((t, e, r) => {
          var n = new XMLHttpRequest();
          n.open("GET", t, true), n.responseType = "arraybuffer", n.onload = () => {
            if (n.status == 200 || n.status == 0 && n.response) {
              e(n.response);
              return;
            }
            r();
          }, n.onerror = r, n.send(null);
        }, "$t"), Rt = /* @__PURE__ */ __name((t) => document.title = t, "Rt"));
        var Nt = console.log.bind(console), z = console.warn.bind(console);
        Object.assign(f, W), W = null;
        var St2 = 4, oe;
        typeof WebAssembly != "object" && re("no native wasm support detected");
        var se2, Ge = false, Ft;
        function Ut(t, e) {
          t || re(e);
        }
        __name(Ut, "Ut");
        function Be(t, e, r) {
          for (var n = e + r, i2 = ""; !(e >= n); ) {
            var o = t[e++];
            if (!o)
              return i2;
            if (!(o & 128)) {
              i2 += String.fromCharCode(o);
              continue;
            }
            var s = t[e++] & 63;
            if ((o & 224) == 192) {
              i2 += String.fromCharCode((o & 31) << 6 | s);
              continue;
            }
            var a = t[e++] & 63;
            if ((o & 240) == 224 ? o = (o & 15) << 12 | s << 6 | a : o = (o & 7) << 18 | s << 12 | a << 6 | t[e++] & 63, o < 65536)
              i2 += String.fromCharCode(o);
            else {
              var u = o - 65536;
              i2 += String.fromCharCode(55296 | u >> 10, 56320 | u & 1023);
            }
          }
          return i2;
        }
        __name(Be, "Be");
        function Ye(t, e) {
          return t ? Be(O, t, e) : "";
        }
        __name(Ye, "Ye");
        function Lt(t, e, r, n) {
          if (!(n > 0))
            return 0;
          for (var i2 = r, o = r + n - 1, s = 0; s < t.length; ++s) {
            var a = t.charCodeAt(s);
            if (a >= 55296 && a <= 57343) {
              var u = t.charCodeAt(++s);
              a = 65536 + ((a & 1023) << 10) | u & 1023;
            }
            if (a <= 127) {
              if (r >= o)
                break;
              e[r++] = a;
            } else if (a <= 2047) {
              if (r + 1 >= o)
                break;
              e[r++] = 192 | a >> 6, e[r++] = 128 | a & 63;
            } else if (a <= 65535) {
              if (r + 2 >= o)
                break;
              e[r++] = 224 | a >> 12, e[r++] = 128 | a >> 6 & 63, e[r++] = 128 | a & 63;
            } else {
              if (r + 3 >= o)
                break;
              e[r++] = 240 | a >> 18, e[r++] = 128 | a >> 12 & 63, e[r++] = 128 | a >> 6 & 63, e[r++] = 128 | a & 63;
            }
          }
          return e[r] = 0, r - i2;
        }
        __name(Lt, "Lt");
        function Dt(t, e, r) {
          return Lt(t, O, e, r);
        }
        __name(Dt, "Dt");
        function Wt(t) {
          for (var e = 0, r = 0; r < t.length; ++r) {
            var n = t.charCodeAt(r);
            n <= 127 ? e++ : n <= 2047 ? e += 2 : n >= 55296 && n <= 57343 ? (e += 4, ++r) : e += 3;
          }
          return e;
        }
        __name(Wt, "Wt");
        var me2, Y, O, q, Ee, I, m2, xe2, Xe2;
        function Je(t) {
          me2 = t, f.HEAP8 = Y = new Int8Array(t), f.HEAP16 = q = new Int16Array(t), f.HEAP32 = I = new Int32Array(t), f.HEAPU8 = O = new Uint8Array(t), f.HEAPU16 = Ee = new Uint16Array(t), f.HEAPU32 = m2 = new Uint32Array(t), f.HEAPF32 = xe2 = new Float32Array(t), f.HEAPF64 = Xe2 = new Float64Array(t);
        }
        __name(Je, "Je");
        var ze2, Vt = [], qe = [], Ht = [], kt2 = false;
        function Mt() {
          Ce2(Vt);
        }
        __name(Mt, "Mt");
        function jt() {
          kt2 = true, Ce2(qe);
        }
        __name(jt, "jt");
        function Gt() {
          Ce2(Ht);
        }
        __name(Gt, "Gt");
        function Bt(t) {
          qe.unshift(t);
        }
        __name(Bt, "Bt");
        var ee = 0, Pe = null, te = null;
        function Yt(t) {
          ee++;
        }
        __name(Yt, "Yt");
        function xt2(t) {
          if (ee--, ee == 0 && (Pe !== null && (clearInterval(Pe), Pe = null), te)) {
            var e = te;
            te = null, e();
          }
        }
        __name(xt2, "xt2");
        function re(t) {
          t = "Aborted(" + t + ")", z(t), Ge = true, Ft = 1, t += ". Build with -sASSERTIONS for more info.";
          var e = new WebAssembly.RuntimeError(t);
          throw g(e), e;
        }
        __name(re, "re");
        var Xt = "data:application/octet-stream;base64,";
        function Ze(t) {
          return t.startsWith(Xt);
        }
        __name(Ze, "Ze");
        var S;
        S = "yoga.wasm", Ze(S) || (S = Ot2(S));
        function Ke(t) {
          try {
            if (t == S && oe)
              return new Uint8Array(oe);
            if (Te)
              return Te(t);
            throw "both async and sync fetching of the wasm failed";
          } catch (e) {
            re(e);
          }
        }
        __name(Ke, "Ke");
        function Jt() {
          return !oe && (A || N) && typeof fetch == "function" ? fetch(S, { credentials: "same-origin" }).then(function(t) {
            if (!t.ok)
              throw "failed to load wasm binary file at '" + S + "'";
            return t.arrayBuffer();
          }).catch(function() {
            return Ke(S);
          }) : Promise.resolve().then(function() {
            return Ke(S);
          });
        }
        __name(Jt, "Jt");
        function zt() {
          var t = { a: On2 };
          function e(s, a) {
            var u = s.exports;
            f.asm = u, se2 = f.asm.F, Je(se2.buffer), ze2 = f.asm.K, Bt(f.asm.G), xt2("wasm-instantiate");
          }
          __name(e, "e");
          Yt("wasm-instantiate");
          function r(s) {
            e(s.instance);
          }
          __name(r, "r");
          function n(s) {
            return Jt().then(function(a) {
              return WebAssembly.instantiate(a, t);
            }).then(function(a) {
              return a;
            }).then(s, function(a) {
              z("failed to asynchronously prepare wasm: " + a), re(a);
            });
          }
          __name(n, "n");
          function i2() {
            return !oe && typeof WebAssembly.instantiateStreaming == "function" && !Ze(S) && typeof fetch == "function" ? fetch(S, { credentials: "same-origin" }).then(function(s) {
              var a = WebAssembly.instantiateStreaming(s, t);
              return a.then(r, function(u) {
                return z("wasm streaming compile failed: " + u), z("falling back to ArrayBuffer instantiation"), n(r);
              });
            }) : n(r);
          }
          __name(i2, "i");
          if (f.instantiateWasm)
            try {
              var o = f.instantiateWasm(t, e);
              return o;
            } catch (s) {
              z("Module.instantiateWasm callback failed with error: " + s), g(s);
            }
          return i2().catch(g), {};
        }
        __name(zt, "zt");
        function Ce2(t) {
          for (; t.length > 0; )
            t.shift()(f);
        }
        __name(Ce2, "Ce2");
        function qt(t) {
          return ve(t + 24) + 24;
        }
        __name(qt, "qt");
        function Zt(t) {
          this.excPtr = t, this.ptr = t - 24, this.set_type = function(e) {
            m2[this.ptr + 4 >> 2] = e;
          }, this.get_type = function() {
            return m2[this.ptr + 4 >> 2];
          }, this.set_destructor = function(e) {
            m2[this.ptr + 8 >> 2] = e;
          }, this.get_destructor = function() {
            return m2[this.ptr + 8 >> 2];
          }, this.set_refcount = function(e) {
            I[this.ptr >> 2] = e;
          }, this.set_caught = function(e) {
            e = e ? 1 : 0, Y[this.ptr + 12 >> 0] = e;
          }, this.get_caught = function() {
            return Y[this.ptr + 12 >> 0] != 0;
          }, this.set_rethrown = function(e) {
            e = e ? 1 : 0, Y[this.ptr + 13 >> 0] = e;
          }, this.get_rethrown = function() {
            return Y[this.ptr + 13 >> 0] != 0;
          }, this.init = function(e, r) {
            this.set_adjusted_ptr(0), this.set_type(e), this.set_destructor(r), this.set_refcount(0), this.set_caught(false), this.set_rethrown(false);
          }, this.add_ref = function() {
            var e = I[this.ptr >> 2];
            I[this.ptr >> 2] = e + 1;
          }, this.release_ref = function() {
            var e = I[this.ptr >> 2];
            return I[this.ptr >> 2] = e - 1, e === 1;
          }, this.set_adjusted_ptr = function(e) {
            m2[this.ptr + 16 >> 2] = e;
          }, this.get_adjusted_ptr = function() {
            return m2[this.ptr + 16 >> 2];
          }, this.get_exception_ptr = function() {
            var e = ht(this.get_type());
            if (e)
              return m2[this.excPtr >> 2];
            var r = this.get_adjusted_ptr();
            return r !== 0 ? r : this.excPtr;
          };
        }
        __name(Zt, "Zt");
        var Kt = 0, Qt = 0;
        function er(t, e, r) {
          var n = new Zt(t);
          throw n.init(e, r), Kt = t, Qt++, t;
        }
        __name(er, "er");
        var tr = 48, rr = 57;
        function Qe(t) {
          if (t === void 0)
            return "_unknown";
          t = t.replace(/[^a-zA-Z0-9_]/g, "$");
          var e = t.charCodeAt(0);
          return e >= tr && e <= rr ? "_" + t : t;
        }
        __name(Qe, "Qe");
        function be(t, e) {
          return t = Qe(t), function() {
            return e.apply(this, arguments);
          };
        }
        __name(be, "be");
        var F = [{}, { value: void 0 }, { value: null }, { value: true }, { value: false }], we2 = [];
        function ue(t, e) {
          var r = be(e, function(n) {
            this.name = e, this.message = n;
            var i2 = new Error(n).stack;
            i2 !== void 0 && (this.stack = this.toString() + `
` + i2.replace(/^Error(:[^\n]*)?\n/, ""));
          });
          return r.prototype = Object.create(t.prototype), r.prototype.constructor = r, r.prototype.toString = function() {
            return this.message === void 0 ? this.name : this.name + ": " + this.message;
          }, r;
        }
        __name(ue, "ue");
        var Z = void 0;
        function v(t) {
          throw new Z(t);
        }
        __name(v, "v");
        function nr2() {
          for (var t = 0, e = 5; e < F.length; ++e)
            F[e] !== void 0 && ++t;
          return t;
        }
        __name(nr2, "nr2");
        function ir2() {
          for (var t = 5; t < F.length; ++t)
            if (F[t] !== void 0)
              return F[t];
          return null;
        }
        __name(ir2, "ir2");
        function ar2() {
          f.count_emval_handles = nr2, f.get_first_emval = ir2;
        }
        __name(ar2, "ar2");
        var V = { toValue: /* @__PURE__ */ __name((t) => (t || v("Cannot use deleted val. handle = " + t), F[t].value), "toValue"), toHandle: /* @__PURE__ */ __name((t) => {
          switch (t) {
            case void 0:
              return 1;
            case null:
              return 2;
            case true:
              return 3;
            case false:
              return 4;
            default: {
              var e = we2.length ? we2.pop() : F.length;
              return F[e] = { refcount: 1, value: t }, e;
            }
          }
        }, "toHandle") }, et3 = void 0;
        function or2() {
          for (var t = new Array(256), e = 0; e < 256; ++e)
            t[e] = String.fromCharCode(e);
          tt2 = t;
        }
        __name(or2, "or2");
        var tt2 = void 0;
        function b(t) {
          for (var e = "", r = t; O[r]; )
            e += tt2[O[r++]];
          return e;
        }
        __name(b, "b");
        function sr2() {
          return Object.keys(H).length;
        }
        __name(sr2, "sr2");
        function ur() {
          var t = [];
          for (var e in H)
            H.hasOwnProperty(e) && t.push(H[e]);
          return t;
        }
        __name(ur, "ur");
        var ne = [];
        function Ae() {
          for (; ne.length; ) {
            var t = ne.pop();
            t.$$.deleteScheduled = false, t.delete();
          }
        }
        __name(Ae, "Ae");
        var ie = void 0;
        function fr(t) {
          ie = t, ne.length && ie && ie(Ae);
        }
        __name(fr, "fr");
        function cr() {
          f.getInheritedInstanceCount = sr2, f.getLiveInheritedInstances = ur, f.flushPendingDeletes = Ae, f.setDelayFunction = fr;
        }
        __name(cr, "cr");
        var H = {};
        function Oe2(t, e) {
          for (e === void 0 && v("ptr should not be undefined"); t.baseClass; )
            e = t.upcast(e), t = t.baseClass;
          return e;
        }
        __name(Oe2, "Oe2");
        function lr(t, e, r) {
          e = Oe2(t, e), H.hasOwnProperty(e) ? v("Tried to register registered instance: " + e) : H[e] = r;
        }
        __name(lr, "lr");
        var x2 = {};
        function rt(t) {
          var e = _t2(t), r = b(e);
          return j2(e), r;
        }
        __name(rt, "rt");
        function nt(t, e) {
          var r = x2[t];
          return r === void 0 && v(e + " has unknown type " + rt(t)), r;
        }
        __name(nt, "nt");
        function dr(t, e) {
          e = Oe2(t, e), H.hasOwnProperty(e) ? delete H[e] : v("Tried to unregister unregistered instance: " + e);
        }
        __name(dr, "dr");
        function fe(t) {
        }
        __name(fe, "fe");
        var Ie2 = false;
        function _r2(t) {
          t.smartPtr ? t.smartPtrType.rawDestructor(t.smartPtr) : t.ptrType.registeredClass.rawDestructor(t.ptr);
        }
        __name(_r2, "_r2");
        function it(t) {
          t.count.value -= 1;
          var e = t.count.value === 0;
          e && _r2(t);
        }
        __name(it, "it");
        function at(t, e, r) {
          if (e === r)
            return t;
          if (r.baseClass === void 0)
            return null;
          var n = at(t, e, r.baseClass);
          return n === null ? null : r.downcast(n);
        }
        __name(at, "at");
        var ot2 = {};
        function hr(t, e) {
          return e = Oe2(t, e), H[e];
        }
        __name(hr, "hr");
        var st2 = void 0;
        function ce2(t) {
          throw new st2(t);
        }
        __name(ce2, "ce2");
        function le2(t, e) {
          (!e.ptrType || !e.ptr) && ce2("makeClassHandle requires ptr and ptrType");
          var r = !!e.smartPtrType, n = !!e.smartPtr;
          return r !== n && ce2("Both smartPtrType and smartPtr must be specified"), e.count = { value: 1 }, K(Object.create(t, { $$: { value: e } }));
        }
        __name(le2, "le2");
        function pr(t) {
          var e = this.getPointee(t);
          if (!e)
            return this.destructor(t), null;
          var r = hr(this.registeredClass, e);
          if (r !== void 0) {
            if (r.$$.count.value === 0)
              return r.$$.ptr = e, r.$$.smartPtr = t, r.clone();
            var n = r.clone();
            return this.destructor(t), n;
          }
          function i2() {
            return this.isSmartPointer ? le2(this.registeredClass.instancePrototype, { ptrType: this.pointeeType, ptr: e, smartPtrType: this, smartPtr: t }) : le2(this.registeredClass.instancePrototype, { ptrType: this, ptr: t });
          }
          __name(i2, "i");
          var o = this.registeredClass.getActualType(e), s = ot2[o];
          if (!s)
            return i2.call(this);
          var a;
          this.isConst ? a = s.constPointerType : a = s.pointerType;
          var u = at(e, this.registeredClass, a.registeredClass);
          return u === null ? i2.call(this) : this.isSmartPointer ? le2(a.registeredClass.instancePrototype, { ptrType: a, ptr: u, smartPtrType: this, smartPtr: t }) : le2(a.registeredClass.instancePrototype, { ptrType: a, ptr: u });
        }
        __name(pr, "pr");
        function K(t) {
          return typeof FinalizationRegistry > "u" ? (K = /* @__PURE__ */ __name((e) => e, "K"), t) : (Ie2 = new FinalizationRegistry((e) => {
            it(e.$$);
          }), K = /* @__PURE__ */ __name((e) => {
            var r = e.$$, n = !!r.smartPtr;
            if (n) {
              var i2 = { $$: r };
              Ie2.register(e, i2, e);
            }
            return e;
          }, "K"), fe = /* @__PURE__ */ __name((e) => Ie2.unregister(e), "fe"), K(t));
        }
        __name(K, "K");
        function vr2(t, e, r) {
          t = b(t), e = nt(e, "wrapper"), r = V.toValue(r);
          var n = [].slice, i2 = e.registeredClass, o = i2.instancePrototype, s = i2.baseClass, a = s.instancePrototype, u = i2.baseClass.constructor, c2 = be(t, function() {
            i2.baseClass.pureVirtualFunctions.forEach(function(_) {
              if (this[_] === a[_])
                throw new et3("Pure virtual function " + _ + " must be implemented in JavaScript");
            }.bind(this)), Object.defineProperty(this, "__parent", { value: o }), this.__construct.apply(this, n.call(arguments));
          });
          o.__construct = function() {
            this === o && v("Pass correct 'this' to __construct");
            var h = u.implement.apply(void 0, [this].concat(n.call(arguments)));
            fe(h);
            var p = h.$$;
            h.notifyOnDestruction(), p.preservePointerOnDelete = true, Object.defineProperties(this, { $$: { value: p } }), K(this), lr(i2, p.ptr, this);
          }, o.__destruct = function() {
            this === o && v("Pass correct 'this' to __destruct"), fe(this), dr(i2, this.$$.ptr);
          }, c2.prototype = Object.create(o);
          for (var d in r)
            c2.prototype[d] = r[d];
          return V.toHandle(c2);
        }
        __name(vr2, "vr2");
        var de2 = {};
        function $e(t) {
          for (; t.length; ) {
            var e = t.pop(), r = t.pop();
            r(e);
          }
        }
        __name($e, "$e");
        function ae(t) {
          return this.fromWireType(I[t >> 2]);
        }
        __name(ae, "ae");
        var Q = {}, _e = {};
        function G(t, e, r) {
          t.forEach(function(a) {
            _e[a] = e;
          });
          function n(a) {
            var u = r(a);
            u.length !== t.length && ce2("Mismatched type converter count");
            for (var c2 = 0; c2 < t.length; ++c2)
              k(t[c2], u[c2]);
          }
          __name(n, "n");
          var i2 = new Array(e.length), o = [], s = 0;
          e.forEach((a, u) => {
            x2.hasOwnProperty(a) ? i2[u] = x2[a] : (o.push(a), Q.hasOwnProperty(a) || (Q[a] = []), Q[a].push(() => {
              i2[u] = x2[a], ++s, s === o.length && n(i2);
            }));
          }), o.length === 0 && n(i2);
        }
        __name(G, "G");
        function gr2(t) {
          var e = de2[t];
          delete de2[t];
          var r = e.rawConstructor, n = e.rawDestructor, i2 = e.fields, o = i2.map((s) => s.getterReturnType).concat(i2.map((s) => s.setterArgumentType));
          G([t], o, (s) => {
            var a = {};
            return i2.forEach((u, c2) => {
              var d = u.fieldName, _ = s[c2], h = u.getter, p = u.getterContext, E = s[c2 + i2.length], P = u.setter, L = u.setterContext;
              a[d] = { read: /* @__PURE__ */ __name((D) => _.fromWireType(h(p, D)), "read"), write: /* @__PURE__ */ __name((D, X) => {
                var w = [];
                P(L, D, E.toWireType(w, X)), $e(w);
              }, "write") };
            }), [{ name: e.name, fromWireType: /* @__PURE__ */ __name(function(u) {
              var c2 = {};
              for (var d in a)
                c2[d] = a[d].read(u);
              return n(u), c2;
            }, "fromWireType"), toWireType: /* @__PURE__ */ __name(function(u, c2) {
              for (var d in a)
                if (!(d in c2))
                  throw new TypeError('Missing field:  "' + d + '"');
              var _ = r();
              for (d in a)
                a[d].write(_, c2[d]);
              return u !== null && u.push(n, _), _;
            }, "toWireType"), argPackAdvance: 8, readValueFromPointer: ae, destructorFunction: n }];
          });
        }
        __name(gr2, "gr2");
        function yr2(t, e, r, n, i2) {
        }
        __name(yr2, "yr2");
        function Re2(t) {
          switch (t) {
            case 1:
              return 0;
            case 2:
              return 1;
            case 4:
              return 2;
            case 8:
              return 3;
            default:
              throw new TypeError("Unknown type size: " + t);
          }
        }
        __name(Re2, "Re2");
        function k(t, e, r = {}) {
          if (!("argPackAdvance" in e))
            throw new TypeError("registerType registeredInstance requires argPackAdvance");
          var n = e.name;
          if (t || v('type "' + n + '" must have a positive integer typeid pointer'), x2.hasOwnProperty(t)) {
            if (r.ignoreDuplicateRegistrations)
              return;
            v("Cannot register type '" + n + "' twice");
          }
          if (x2[t] = e, delete _e[t], Q.hasOwnProperty(t)) {
            var i2 = Q[t];
            delete Q[t], i2.forEach((o) => o());
          }
        }
        __name(k, "k");
        function Tr2(t, e, r, n, i2) {
          var o = Re2(r);
          e = b(e), k(t, { name: e, fromWireType: /* @__PURE__ */ __name(function(s) {
            return !!s;
          }, "fromWireType"), toWireType: /* @__PURE__ */ __name(function(s, a) {
            return a ? n : i2;
          }, "toWireType"), argPackAdvance: 8, readValueFromPointer: /* @__PURE__ */ __name(function(s) {
            var a;
            if (r === 1)
              a = Y;
            else if (r === 2)
              a = q;
            else if (r === 4)
              a = I;
            else
              throw new TypeError("Unknown boolean type size: " + e);
            return this.fromWireType(a[s >> o]);
          }, "readValueFromPointer"), destructorFunction: null });
        }
        __name(Tr2, "Tr2");
        function mr2(t) {
          if (!(this instanceof B) || !(t instanceof B))
            return false;
          for (var e = this.$$.ptrType.registeredClass, r = this.$$.ptr, n = t.$$.ptrType.registeredClass, i2 = t.$$.ptr; e.baseClass; )
            r = e.upcast(r), e = e.baseClass;
          for (; n.baseClass; )
            i2 = n.upcast(i2), n = n.baseClass;
          return e === n && r === i2;
        }
        __name(mr2, "mr2");
        function Er2(t) {
          return { count: t.count, deleteScheduled: t.deleteScheduled, preservePointerOnDelete: t.preservePointerOnDelete, ptr: t.ptr, ptrType: t.ptrType, smartPtr: t.smartPtr, smartPtrType: t.smartPtrType };
        }
        __name(Er2, "Er2");
        function Ne2(t) {
          function e(r) {
            return r.$$.ptrType.registeredClass.name;
          }
          __name(e, "e");
          v(e(t) + " instance already deleted");
        }
        __name(Ne2, "Ne2");
        function Pr2() {
          if (this.$$.ptr || Ne2(this), this.$$.preservePointerOnDelete)
            return this.$$.count.value += 1, this;
          var t = K(Object.create(Object.getPrototypeOf(this), { $$: { value: Er2(this.$$) } }));
          return t.$$.count.value += 1, t.$$.deleteScheduled = false, t;
        }
        __name(Pr2, "Pr2");
        function Cr() {
          this.$$.ptr || Ne2(this), this.$$.deleteScheduled && !this.$$.preservePointerOnDelete && v("Object already scheduled for deletion"), fe(this), it(this.$$), this.$$.preservePointerOnDelete || (this.$$.smartPtr = void 0, this.$$.ptr = void 0);
        }
        __name(Cr, "Cr");
        function br2() {
          return !this.$$.ptr;
        }
        __name(br2, "br2");
        function wr2() {
          return this.$$.ptr || Ne2(this), this.$$.deleteScheduled && !this.$$.preservePointerOnDelete && v("Object already scheduled for deletion"), ne.push(this), ne.length === 1 && ie && ie(Ae), this.$$.deleteScheduled = true, this;
        }
        __name(wr2, "wr2");
        function Ar2() {
          B.prototype.isAliasOf = mr2, B.prototype.clone = Pr2, B.prototype.delete = Cr, B.prototype.isDeleted = br2, B.prototype.deleteLater = wr2;
        }
        __name(Ar2, "Ar2");
        function B() {
        }
        __name(B, "B");
        function Se(t, e, r) {
          if (t[e].overloadTable === void 0) {
            var n = t[e];
            t[e] = function() {
              return t[e].overloadTable.hasOwnProperty(arguments.length) || v("Function '" + r + "' called with an invalid number of arguments (" + arguments.length + ") - expects one of (" + t[e].overloadTable + ")!"), t[e].overloadTable[arguments.length].apply(this, arguments);
            }, t[e].overloadTable = [], t[e].overloadTable[n.argCount] = n;
          }
        }
        __name(Se, "Se");
        function Or2(t, e, r) {
          f.hasOwnProperty(t) ? ((r === void 0 || f[t].overloadTable !== void 0 && f[t].overloadTable[r] !== void 0) && v("Cannot register public name '" + t + "' twice"), Se(f, t, t), f.hasOwnProperty(r) && v("Cannot register multiple overloads of a function with the same number of arguments (" + r + ")!"), f[t].overloadTable[r] = e) : (f[t] = e, r !== void 0 && (f[t].numArguments = r));
        }
        __name(Or2, "Or2");
        function Ir2(t, e, r, n, i2, o, s, a) {
          this.name = t, this.constructor = e, this.instancePrototype = r, this.rawDestructor = n, this.baseClass = i2, this.getActualType = o, this.upcast = s, this.downcast = a, this.pureVirtualFunctions = [];
        }
        __name(Ir2, "Ir2");
        function Fe(t, e, r) {
          for (; e !== r; )
            e.upcast || v("Expected null or instance of " + r.name + ", got an instance of " + e.name), t = e.upcast(t), e = e.baseClass;
          return t;
        }
        __name(Fe, "Fe");
        function $r2(t, e) {
          if (e === null)
            return this.isReference && v("null is not a valid " + this.name), 0;
          e.$$ || v('Cannot pass "' + We(e) + '" as a ' + this.name), e.$$.ptr || v("Cannot pass deleted object as a pointer of type " + this.name);
          var r = e.$$.ptrType.registeredClass, n = Fe(e.$$.ptr, r, this.registeredClass);
          return n;
        }
        __name($r2, "$r2");
        function Rr(t, e) {
          var r;
          if (e === null)
            return this.isReference && v("null is not a valid " + this.name), this.isSmartPointer ? (r = this.rawConstructor(), t !== null && t.push(this.rawDestructor, r), r) : 0;
          e.$$ || v('Cannot pass "' + We(e) + '" as a ' + this.name), e.$$.ptr || v("Cannot pass deleted object as a pointer of type " + this.name), !this.isConst && e.$$.ptrType.isConst && v("Cannot convert argument of type " + (e.$$.smartPtrType ? e.$$.smartPtrType.name : e.$$.ptrType.name) + " to parameter type " + this.name);
          var n = e.$$.ptrType.registeredClass;
          if (r = Fe(e.$$.ptr, n, this.registeredClass), this.isSmartPointer)
            switch (e.$$.smartPtr === void 0 && v("Passing raw pointer to smart pointer is illegal"), this.sharingPolicy) {
              case 0:
                e.$$.smartPtrType === this ? r = e.$$.smartPtr : v("Cannot convert argument of type " + (e.$$.smartPtrType ? e.$$.smartPtrType.name : e.$$.ptrType.name) + " to parameter type " + this.name);
                break;
              case 1:
                r = e.$$.smartPtr;
                break;
              case 2:
                if (e.$$.smartPtrType === this)
                  r = e.$$.smartPtr;
                else {
                  var i2 = e.clone();
                  r = this.rawShare(r, V.toHandle(function() {
                    i2.delete();
                  })), t !== null && t.push(this.rawDestructor, r);
                }
                break;
              default:
                v("Unsupporting sharing policy");
            }
          return r;
        }
        __name(Rr, "Rr");
        function Nr2(t, e) {
          if (e === null)
            return this.isReference && v("null is not a valid " + this.name), 0;
          e.$$ || v('Cannot pass "' + We(e) + '" as a ' + this.name), e.$$.ptr || v("Cannot pass deleted object as a pointer of type " + this.name), e.$$.ptrType.isConst && v("Cannot convert argument of type " + e.$$.ptrType.name + " to parameter type " + this.name);
          var r = e.$$.ptrType.registeredClass, n = Fe(e.$$.ptr, r, this.registeredClass);
          return n;
        }
        __name(Nr2, "Nr2");
        function Sr2(t) {
          return this.rawGetPointee && (t = this.rawGetPointee(t)), t;
        }
        __name(Sr2, "Sr2");
        function Fr(t) {
          this.rawDestructor && this.rawDestructor(t);
        }
        __name(Fr, "Fr");
        function Ur(t) {
          t !== null && t.delete();
        }
        __name(Ur, "Ur");
        function Lr() {
          M.prototype.getPointee = Sr2, M.prototype.destructor = Fr, M.prototype.argPackAdvance = 8, M.prototype.readValueFromPointer = ae, M.prototype.deleteObject = Ur, M.prototype.fromWireType = pr;
        }
        __name(Lr, "Lr");
        function M(t, e, r, n, i2, o, s, a, u, c2, d) {
          this.name = t, this.registeredClass = e, this.isReference = r, this.isConst = n, this.isSmartPointer = i2, this.pointeeType = o, this.sharingPolicy = s, this.rawGetPointee = a, this.rawConstructor = u, this.rawShare = c2, this.rawDestructor = d, !i2 && e.baseClass === void 0 ? n ? (this.toWireType = $r2, this.destructorFunction = null) : (this.toWireType = Nr2, this.destructorFunction = null) : this.toWireType = Rr;
        }
        __name(M, "M");
        function Dr(t, e, r) {
          f.hasOwnProperty(t) || ce2("Replacing nonexistant public symbol"), f[t].overloadTable !== void 0 && r !== void 0 ? f[t].overloadTable[r] = e : (f[t] = e, f[t].argCount = r);
        }
        __name(Dr, "Dr");
        function Wr(t, e, r) {
          var n = f["dynCall_" + t];
          return r && r.length ? n.apply(null, [e].concat(r)) : n.call(null, e);
        }
        __name(Wr, "Wr");
        function ut(t) {
          return ze2.get(t);
        }
        __name(ut, "ut");
        function Vr2(t, e, r) {
          if (t.includes("j"))
            return Wr(t, e, r);
          var n = ut(e).apply(null, r);
          return n;
        }
        __name(Vr2, "Vr2");
        function Hr2(t, e) {
          var r = [];
          return function() {
            return r.length = 0, Object.assign(r, arguments), Vr2(t, e, r);
          };
        }
        __name(Hr2, "Hr2");
        function U(t, e) {
          t = b(t);
          function r() {
            return t.includes("j") ? Hr2(t, e) : ut(e);
          }
          __name(r, "r");
          var n = r();
          return typeof n != "function" && v("unknown function pointer with signature " + t + ": " + e), n;
        }
        __name(U, "U");
        var ft = void 0;
        function he(t, e) {
          var r = [], n = {};
          function i2(o) {
            if (!n[o] && !x2[o]) {
              if (_e[o]) {
                _e[o].forEach(i2);
                return;
              }
              r.push(o), n[o] = true;
            }
          }
          __name(i2, "i");
          throw e.forEach(i2), new ft(t + ": " + r.map(rt).join([", "]));
        }
        __name(he, "he");
        function kr2(t, e, r, n, i2, o, s, a, u, c2, d, _, h) {
          d = b(d), o = U(i2, o), a && (a = U(s, a)), c2 && (c2 = U(u, c2)), h = U(_, h);
          var p = Qe(d);
          Or2(p, function() {
            he("Cannot construct " + d + " due to unbound types", [n]);
          }), G([t, e, r], n ? [n] : [], function(E) {
            E = E[0];
            var P, L;
            n ? (P = E.registeredClass, L = P.instancePrototype) : L = B.prototype;
            var D = be(p, function() {
              if (Object.getPrototypeOf(this) !== X)
                throw new Z("Use 'new' to construct " + d);
              if (w.constructor_body === void 0)
                throw new Z(d + " has no accessible constructor");
              var yt2 = w.constructor_body[arguments.length];
              if (yt2 === void 0)
                throw new Z("Tried to invoke ctor of " + d + " with invalid number of parameters (" + arguments.length + ") - expected (" + Object.keys(w.constructor_body).toString() + ") parameters instead!");
              return yt2.apply(this, arguments);
            }), X = Object.create(L, { constructor: { value: D } });
            D.prototype = X;
            var w = new Ir2(d, D, X, h, P, o, a, c2), Ve2 = new M(d, w, true, false, false), vt2 = new M(d + "*", w, false, false, false), gt2 = new M(d + " const*", w, false, true, false);
            return ot2[t] = { pointerType: vt2, constPointerType: gt2 }, Dr(p, D), [Ve2, vt2, gt2];
          });
        }
        __name(kr2, "kr2");
        function Ue(t, e, r, n, i2) {
          var o = e.length;
          o < 2 && v("argTypes array size mismatch! Must at least get return value and 'this' types!");
          for (var s = e[1] !== null && r !== null, a = false, u = 1; u < e.length; ++u)
            if (e[u] !== null && e[u].destructorFunction === void 0) {
              a = true;
              break;
            }
          var c2 = e[0].name !== "void", d = o - 2, _ = new Array(d), h = [], p = [];
          return function() {
            arguments.length !== d && v("function " + t + " called with " + arguments.length + " arguments, expected " + d + " args!"), p.length = 0;
            var E;
            h.length = s ? 2 : 1, h[0] = i2, s && (E = e[1].toWireType(p, this), h[1] = E);
            for (var P = 0; P < d; ++P)
              _[P] = e[P + 2].toWireType(p, arguments[P]), h.push(_[P]);
            var L = n.apply(null, h);
            function D(X) {
              if (a)
                $e(p);
              else
                for (var w = s ? 1 : 2; w < e.length; w++) {
                  var Ve2 = w === 1 ? E : _[w - 2];
                  e[w].destructorFunction !== null && e[w].destructorFunction(Ve2);
                }
              if (c2)
                return e[0].fromWireType(X);
            }
            __name(D, "D");
            return D(L);
          };
        }
        __name(Ue, "Ue");
        function Le(t, e) {
          for (var r = [], n = 0; n < t; n++)
            r.push(m2[e + n * 4 >> 2]);
          return r;
        }
        __name(Le, "Le");
        function Mr2(t, e, r, n, i2, o, s) {
          var a = Le(r, n);
          e = b(e), o = U(i2, o), G([], [t], function(u) {
            u = u[0];
            var c2 = u.name + "." + e;
            function d() {
              he("Cannot call " + c2 + " due to unbound types", a);
            }
            __name(d, "d");
            e.startsWith("@@") && (e = Symbol[e.substring(2)]);
            var _ = u.registeredClass.constructor;
            return _[e] === void 0 ? (d.argCount = r - 1, _[e] = d) : (Se(_, e, c2), _[e].overloadTable[r - 1] = d), G([], a, function(h) {
              var p = [h[0], null].concat(h.slice(1)), E = Ue(c2, p, null, o, s);
              return _[e].overloadTable === void 0 ? (E.argCount = r - 1, _[e] = E) : _[e].overloadTable[r - 1] = E, [];
            }), [];
          });
        }
        __name(Mr2, "Mr2");
        function jr(t, e, r, n, i2, o) {
          Ut(e > 0);
          var s = Le(e, r);
          i2 = U(n, i2), G([], [t], function(a) {
            a = a[0];
            var u = "constructor " + a.name;
            if (a.registeredClass.constructor_body === void 0 && (a.registeredClass.constructor_body = []), a.registeredClass.constructor_body[e - 1] !== void 0)
              throw new Z("Cannot register multiple constructors with identical number of parameters (" + (e - 1) + ") for class '" + a.name + "'! Overload resolution is currently only performed using the parameter count, not actual type info!");
            return a.registeredClass.constructor_body[e - 1] = () => {
              he("Cannot construct " + a.name + " due to unbound types", s);
            }, G([], s, function(c2) {
              return c2.splice(1, 0, null), a.registeredClass.constructor_body[e - 1] = Ue(u, c2, null, i2, o), [];
            }), [];
          });
        }
        __name(jr, "jr");
        function Gr(t, e, r, n, i2, o, s, a) {
          var u = Le(r, n);
          e = b(e), o = U(i2, o), G([], [t], function(c2) {
            c2 = c2[0];
            var d = c2.name + "." + e;
            e.startsWith("@@") && (e = Symbol[e.substring(2)]), a && c2.registeredClass.pureVirtualFunctions.push(e);
            function _() {
              he("Cannot call " + d + " due to unbound types", u);
            }
            __name(_, "_");
            var h = c2.registeredClass.instancePrototype, p = h[e];
            return p === void 0 || p.overloadTable === void 0 && p.className !== c2.name && p.argCount === r - 2 ? (_.argCount = r - 2, _.className = c2.name, h[e] = _) : (Se(h, e, d), h[e].overloadTable[r - 2] = _), G([], u, function(E) {
              var P = Ue(d, E, c2, o, s);
              return h[e].overloadTable === void 0 ? (P.argCount = r - 2, h[e] = P) : h[e].overloadTable[r - 2] = P, [];
            }), [];
          });
        }
        __name(Gr, "Gr");
        function De2(t) {
          t > 4 && --F[t].refcount === 0 && (F[t] = void 0, we2.push(t));
        }
        __name(De2, "De2");
        function Br(t, e) {
          e = b(e), k(t, { name: e, fromWireType: /* @__PURE__ */ __name(function(r) {
            var n = V.toValue(r);
            return De2(r), n;
          }, "fromWireType"), toWireType: /* @__PURE__ */ __name(function(r, n) {
            return V.toHandle(n);
          }, "toWireType"), argPackAdvance: 8, readValueFromPointer: ae, destructorFunction: null });
        }
        __name(Br, "Br");
        function We(t) {
          if (t === null)
            return "null";
          var e = typeof t;
          return e === "object" || e === "array" || e === "function" ? t.toString() : "" + t;
        }
        __name(We, "We");
        function Yr2(t, e) {
          switch (e) {
            case 2:
              return function(r) {
                return this.fromWireType(xe2[r >> 2]);
              };
            case 3:
              return function(r) {
                return this.fromWireType(Xe2[r >> 3]);
              };
            default:
              throw new TypeError("Unknown float type: " + t);
          }
        }
        __name(Yr2, "Yr2");
        function xr2(t, e, r) {
          var n = Re2(r);
          e = b(e), k(t, { name: e, fromWireType: /* @__PURE__ */ __name(function(i2) {
            return i2;
          }, "fromWireType"), toWireType: /* @__PURE__ */ __name(function(i2, o) {
            return o;
          }, "toWireType"), argPackAdvance: 8, readValueFromPointer: Yr2(e, n), destructorFunction: null });
        }
        __name(xr2, "xr2");
        function Xr(t, e, r) {
          switch (e) {
            case 0:
              return r ? function(i2) {
                return Y[i2];
              } : function(i2) {
                return O[i2];
              };
            case 1:
              return r ? function(i2) {
                return q[i2 >> 1];
              } : function(i2) {
                return Ee[i2 >> 1];
              };
            case 2:
              return r ? function(i2) {
                return I[i2 >> 2];
              } : function(i2) {
                return m2[i2 >> 2];
              };
            default:
              throw new TypeError("Unknown integer type: " + t);
          }
        }
        __name(Xr, "Xr");
        function Jr(t, e, r, n, i2) {
          e = b(e), i2 === -1 && (i2 = 4294967295);
          var o = Re2(r), s = /* @__PURE__ */ __name((_) => _, "s");
          if (n === 0) {
            var a = 32 - 8 * r;
            s = /* @__PURE__ */ __name((_) => _ << a >>> a, "s");
          }
          var u = e.includes("unsigned"), c2 = /* @__PURE__ */ __name((_, h) => {
          }, "c2"), d;
          u ? d = /* @__PURE__ */ __name(function(_, h) {
            return c2(h, this.name), h >>> 0;
          }, "d") : d = /* @__PURE__ */ __name(function(_, h) {
            return c2(h, this.name), h;
          }, "d"), k(t, { name: e, fromWireType: s, toWireType: d, argPackAdvance: 8, readValueFromPointer: Xr(e, o, n !== 0), destructorFunction: null });
        }
        __name(Jr, "Jr");
        function zr(t, e, r) {
          var n = [Int8Array, Uint8Array, Int16Array, Uint16Array, Int32Array, Uint32Array, Float32Array, Float64Array], i2 = n[e];
          function o(s) {
            s = s >> 2;
            var a = m2, u = a[s], c2 = a[s + 1];
            return new i2(me2, c2, u);
          }
          __name(o, "o");
          r = b(r), k(t, { name: r, fromWireType: o, argPackAdvance: 8, readValueFromPointer: o }, { ignoreDuplicateRegistrations: true });
        }
        __name(zr, "zr");
        function qr(t, e) {
          e = b(e);
          var r = e === "std::string";
          k(t, { name: e, fromWireType: /* @__PURE__ */ __name(function(n) {
            var i2 = m2[n >> 2], o = n + 4, s;
            if (r)
              for (var a = o, u = 0; u <= i2; ++u) {
                var c2 = o + u;
                if (u == i2 || O[c2] == 0) {
                  var d = c2 - a, _ = Ye(a, d);
                  s === void 0 ? s = _ : (s += String.fromCharCode(0), s += _), a = c2 + 1;
                }
              }
            else {
              for (var h = new Array(i2), u = 0; u < i2; ++u)
                h[u] = String.fromCharCode(O[o + u]);
              s = h.join("");
            }
            return j2(n), s;
          }, "fromWireType"), toWireType: /* @__PURE__ */ __name(function(n, i2) {
            i2 instanceof ArrayBuffer && (i2 = new Uint8Array(i2));
            var o, s = typeof i2 == "string";
            s || i2 instanceof Uint8Array || i2 instanceof Uint8ClampedArray || i2 instanceof Int8Array || v("Cannot pass non-string to std::string"), r && s ? o = Wt(i2) : o = i2.length;
            var a = ve(4 + o + 1), u = a + 4;
            if (m2[a >> 2] = o, r && s)
              Dt(i2, u, o + 1);
            else if (s)
              for (var c2 = 0; c2 < o; ++c2) {
                var d = i2.charCodeAt(c2);
                d > 255 && (j2(u), v("String has UTF-16 code units that do not fit in 8 bits")), O[u + c2] = d;
              }
            else
              for (var c2 = 0; c2 < o; ++c2)
                O[u + c2] = i2[c2];
            return n !== null && n.push(j2, a), a;
          }, "toWireType"), argPackAdvance: 8, readValueFromPointer: ae, destructorFunction: /* @__PURE__ */ __name(function(n) {
            j2(n);
          }, "destructorFunction") });
        }
        __name(qr, "qr");
        function Zr2(t, e) {
          for (var r = "", n = 0; !(n >= e / 2); ++n) {
            var i2 = q[t + n * 2 >> 1];
            if (i2 == 0)
              break;
            r += String.fromCharCode(i2);
          }
          return r;
        }
        __name(Zr2, "Zr2");
        function Kr(t, e, r) {
          if (r === void 0 && (r = 2147483647), r < 2)
            return 0;
          r -= 2;
          for (var n = e, i2 = r < t.length * 2 ? r / 2 : t.length, o = 0; o < i2; ++o) {
            var s = t.charCodeAt(o);
            q[e >> 1] = s, e += 2;
          }
          return q[e >> 1] = 0, e - n;
        }
        __name(Kr, "Kr");
        function Qr(t) {
          return t.length * 2;
        }
        __name(Qr, "Qr");
        function en2(t, e) {
          for (var r = 0, n = ""; !(r >= e / 4); ) {
            var i2 = I[t + r * 4 >> 2];
            if (i2 == 0)
              break;
            if (++r, i2 >= 65536) {
              var o = i2 - 65536;
              n += String.fromCharCode(55296 | o >> 10, 56320 | o & 1023);
            } else
              n += String.fromCharCode(i2);
          }
          return n;
        }
        __name(en2, "en2");
        function tn2(t, e, r) {
          if (r === void 0 && (r = 2147483647), r < 4)
            return 0;
          for (var n = e, i2 = n + r - 4, o = 0; o < t.length; ++o) {
            var s = t.charCodeAt(o);
            if (s >= 55296 && s <= 57343) {
              var a = t.charCodeAt(++o);
              s = 65536 + ((s & 1023) << 10) | a & 1023;
            }
            if (I[e >> 2] = s, e += 4, e + 4 > i2)
              break;
          }
          return I[e >> 2] = 0, e - n;
        }
        __name(tn2, "tn2");
        function rn2(t) {
          for (var e = 0, r = 0; r < t.length; ++r) {
            var n = t.charCodeAt(r);
            n >= 55296 && n <= 57343 && ++r, e += 4;
          }
          return e;
        }
        __name(rn2, "rn2");
        function nn2(t, e, r) {
          r = b(r);
          var n, i2, o, s, a;
          e === 2 ? (n = Zr2, i2 = Kr, s = Qr, o = /* @__PURE__ */ __name(() => Ee, "o"), a = 1) : e === 4 && (n = en2, i2 = tn2, s = rn2, o = /* @__PURE__ */ __name(() => m2, "o"), a = 2), k(t, { name: r, fromWireType: /* @__PURE__ */ __name(function(u) {
            for (var c2 = m2[u >> 2], d = o(), _, h = u + 4, p = 0; p <= c2; ++p) {
              var E = u + 4 + p * e;
              if (p == c2 || d[E >> a] == 0) {
                var P = E - h, L = n(h, P);
                _ === void 0 ? _ = L : (_ += String.fromCharCode(0), _ += L), h = E + e;
              }
            }
            return j2(u), _;
          }, "fromWireType"), toWireType: /* @__PURE__ */ __name(function(u, c2) {
            typeof c2 != "string" && v("Cannot pass non-string to C++ string type " + r);
            var d = s(c2), _ = ve(4 + d + e);
            return m2[_ >> 2] = d >> a, i2(c2, _ + 4, d + e), u !== null && u.push(j2, _), _;
          }, "toWireType"), argPackAdvance: 8, readValueFromPointer: ae, destructorFunction: /* @__PURE__ */ __name(function(u) {
            j2(u);
          }, "destructorFunction") });
        }
        __name(nn2, "nn2");
        function an2(t, e, r, n, i2, o) {
          de2[t] = { name: b(e), rawConstructor: U(r, n), rawDestructor: U(i2, o), fields: [] };
        }
        __name(an2, "an2");
        function on2(t, e, r, n, i2, o, s, a, u, c2) {
          de2[t].fields.push({ fieldName: b(e), getterReturnType: r, getter: U(n, i2), getterContext: o, setterArgumentType: s, setter: U(a, u), setterContext: c2 });
        }
        __name(on2, "on2");
        function sn2(t, e) {
          e = b(e), k(t, { isVoid: true, name: e, argPackAdvance: 0, fromWireType: /* @__PURE__ */ __name(function() {
          }, "fromWireType"), toWireType: /* @__PURE__ */ __name(function(r, n) {
          }, "toWireType") });
        }
        __name(sn2, "sn2");
        function un2(t) {
          var e = [];
          return m2[t >> 2] = V.toHandle(e), e;
        }
        __name(un2, "un2");
        var fn2 = {};
        function ct2(t) {
          var e = fn2[t];
          return e === void 0 ? b(t) : e;
        }
        __name(ct2, "ct2");
        var pe = [];
        function cn2(t, e, r, n, i2) {
          return t = pe[t], e = V.toValue(e), r = ct2(r), t(e, r, un2(n), i2);
        }
        __name(cn2, "cn2");
        function ln2(t, e, r, n) {
          t = pe[t], e = V.toValue(e), r = ct2(r), t(e, r, null, n);
        }
        __name(ln2, "ln2");
        function dn2(t) {
          var e = pe.length;
          return pe.push(t), e;
        }
        __name(dn2, "dn2");
        function _n2(t, e) {
          for (var r = new Array(t), n = 0; n < t; ++n)
            r[n] = nt(m2[e + n * St2 >> 2], "parameter " + n);
          return r;
        }
        __name(_n2, "_n2");
        var lt = [];
        function hn2(t, e) {
          var r = _n2(t, e), n = r[0], i2 = n.name + "_$" + r.slice(1).map(function(u) {
            return u.name;
          }).join("_") + "$", o = lt[i2];
          if (o !== void 0)
            return o;
          var s = new Array(t - 1), a = /* @__PURE__ */ __name((u, c2, d, _) => {
            for (var h = 0, p = 0; p < t - 1; ++p)
              s[p] = r[p + 1].readValueFromPointer(_ + h), h += r[p + 1].argPackAdvance;
            for (var E = u[c2].apply(u, s), p = 0; p < t - 1; ++p)
              r[p + 1].deleteObject && r[p + 1].deleteObject(s[p]);
            if (!n.isVoid)
              return n.toWireType(d, E);
          }, "a");
          return o = dn2(a), lt[i2] = o, o;
        }
        __name(hn2, "hn2");
        function pn2(t) {
          t > 4 && (F[t].refcount += 1);
        }
        __name(pn2, "pn2");
        function vn2(t) {
          var e = V.toValue(t);
          $e(e), De2(t);
        }
        __name(vn2, "vn2");
        function gn2() {
          re("");
        }
        __name(gn2, "gn2");
        function yn2(t, e, r) {
          O.copyWithin(t, e, e + r);
        }
        __name(yn2, "yn2");
        function Tn() {
          return 2147483648;
        }
        __name(Tn, "Tn");
        function mn2(t) {
          try {
            return se2.grow(t - me2.byteLength + 65535 >>> 16), Je(se2.buffer), 1;
          } catch {
          }
        }
        __name(mn2, "mn2");
        function En(t) {
          var e = O.length;
          t = t >>> 0;
          var r = Tn();
          if (t > r)
            return false;
          let n = /* @__PURE__ */ __name((u, c2) => u + (c2 - u % c2) % c2, "n");
          for (var i2 = 1; i2 <= 4; i2 *= 2) {
            var o = e * (1 + 0.2 / i2);
            o = Math.min(o, t + 100663296);
            var s = Math.min(r, n(Math.max(t, o), 65536)), a = mn2(s);
            if (a)
              return true;
          }
          return false;
        }
        __name(En, "En");
        var dt2 = { varargs: void 0, get: /* @__PURE__ */ __name(function() {
          dt2.varargs += 4;
          var t = I[dt2.varargs - 4 >> 2];
          return t;
        }, "get"), getStr: /* @__PURE__ */ __name(function(t) {
          var e = Ye(t);
          return e;
        }, "getStr") };
        function Pn(t) {
          return 52;
        }
        __name(Pn, "Pn");
        function Cn(t, e, r, n, i2) {
          return 70;
        }
        __name(Cn, "Cn");
        var bn2 = [null, [], []];
        function wn2(t, e) {
          var r = bn2[t];
          e === 0 || e === 10 ? ((t === 1 ? Nt : z)(Be(r, 0)), r.length = 0) : r.push(e);
        }
        __name(wn2, "wn2");
        function An2(t, e, r, n) {
          for (var i2 = 0, o = 0; o < r; o++) {
            var s = m2[e >> 2], a = m2[e + 4 >> 2];
            e += 8;
            for (var u = 0; u < a; u++)
              wn2(t, O[s + u]);
            i2 += a;
          }
          return m2[n >> 2] = i2, 0;
        }
        __name(An2, "An2");
        Z = f.BindingError = ue(Error, "BindingError"), ar2(), et3 = f.PureVirtualError = ue(Error, "PureVirtualError"), or2(), cr(), st2 = f.InternalError = ue(Error, "InternalError"), Ar2(), Lr(), ft = f.UnboundTypeError = ue(Error, "UnboundTypeError");
        var On2 = { h: qt, g: er, p: vr2, i: gr2, t: yr2, z: Tr2, e: kr2, d: Mr2, l: jr, a: Gr, y: Br, n: xr2, c: Jr, b: zr, o: qr, k: nn2, j: an2, f: on2, A: sn2, D: cn2, r: ln2, E: De2, q: hn2, B: pn2, C: vn2, m: gn2, v: yn2, u: En, x: Pn, s: Cn, w: An2 }, kn2 = zt(), In = f.___wasm_call_ctors = function() {
          return (In = f.___wasm_call_ctors = f.asm.G).apply(null, arguments);
        }, _t2 = f.___getTypeName = function() {
          return (_t2 = f.___getTypeName = f.asm.H).apply(null, arguments);
        }, $n = f.__embind_initialize_bindings = function() {
          return ($n = f.__embind_initialize_bindings = f.asm.I).apply(null, arguments);
        }, ve = f._malloc = function() {
          return (ve = f._malloc = f.asm.J).apply(null, arguments);
        }, j2 = f._free = function() {
          return (j2 = f._free = f.asm.L).apply(null, arguments);
        }, ht = f.___cxa_is_pointer_type = function() {
          return (ht = f.___cxa_is_pointer_type = f.asm.M).apply(null, arguments);
        }, Rn = f.dynCall_jiji = function() {
          return (Rn = f.dynCall_jiji = f.asm.N).apply(null, arguments);
        }, ge;
        te = /* @__PURE__ */ __name(function t() {
          ge || pt(), ge || (te = t);
        }, "t");
        function pt(t) {
          if (t = t || R2, ee > 0 || (Mt(), ee > 0))
            return;
          function e() {
            ge || (ge = true, f.calledRun = true, !Ge && (jt(), T(f), Gt()));
          }
          __name(e, "e");
          e();
        }
        __name(pt, "pt");
        return pt(), l.ready;
      };
    })();
    Me = Hn;
    __name(At2, "At2");
    __name(xn2, "xn2");
    resvg_wasm_exports = {};
    __export(resvg_wasm_exports, {
      Resvg: /* @__PURE__ */ __name(() => Resvg2, "Resvg"),
      initWasm: /* @__PURE__ */ __name(() => initWasm, "initWasm")
    });
    heap = new Array(128).fill(void 0);
    heap.push(void 0, null, true, false);
    heap_next = heap.length;
    __name(addHeapObject, "addHeapObject");
    __name(getObject, "getObject");
    __name(dropObject, "dropObject");
    __name(takeObject, "takeObject");
    WASM_VECTOR_LEN = 0;
    cachedUint8Memory0 = null;
    __name(getUint8Memory0, "getUint8Memory0");
    cachedTextEncoder = new TextEncoder("utf-8");
    encodeString = typeof cachedTextEncoder.encodeInto === "function" ? function(arg, view) {
      return cachedTextEncoder.encodeInto(arg, view);
    } : function(arg, view) {
      const buf = cachedTextEncoder.encode(arg);
      view.set(buf);
      return {
        read: arg.length,
        written: buf.length
      };
    };
    __name(passStringToWasm0, "passStringToWasm0");
    __name(isLikeNone, "isLikeNone");
    cachedInt32Memory0 = null;
    __name(getInt32Memory0, "getInt32Memory0");
    cachedTextDecoder = new TextDecoder("utf-8", { ignoreBOM: true, fatal: true });
    cachedTextDecoder.decode();
    __name(getStringFromWasm0, "getStringFromWasm0");
    __name(_assertClass, "_assertClass");
    BBox = class {
      static {
        __name(this, "BBox");
      }
      static __wrap(ptr) {
        const obj = Object.create(BBox.prototype);
        obj.ptr = ptr;
        return obj;
      }
      __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;
        return ptr;
      }
      free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_bbox_free(ptr);
      }
      /**
      * @returns {number}
      */
      get x() {
        const ret = wasm.__wbg_get_bbox_x(this.ptr);
        return ret;
      }
      /**
      * @param {number} arg0
      */
      set x(arg0) {
        wasm.__wbg_set_bbox_x(this.ptr, arg0);
      }
      /**
      * @returns {number}
      */
      get y() {
        const ret = wasm.__wbg_get_bbox_y(this.ptr);
        return ret;
      }
      /**
      * @param {number} arg0
      */
      set y(arg0) {
        wasm.__wbg_set_bbox_y(this.ptr, arg0);
      }
      /**
      * @returns {number}
      */
      get width() {
        const ret = wasm.__wbg_get_bbox_width(this.ptr);
        return ret;
      }
      /**
      * @param {number} arg0
      */
      set width(arg0) {
        wasm.__wbg_set_bbox_width(this.ptr, arg0);
      }
      /**
      * @returns {number}
      */
      get height() {
        const ret = wasm.__wbg_get_bbox_height(this.ptr);
        return ret;
      }
      /**
      * @param {number} arg0
      */
      set height(arg0) {
        wasm.__wbg_set_bbox_height(this.ptr, arg0);
      }
    };
    RenderedImage = class {
      static {
        __name(this, "RenderedImage");
      }
      static __wrap(ptr) {
        const obj = Object.create(RenderedImage.prototype);
        obj.ptr = ptr;
        return obj;
      }
      __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;
        return ptr;
      }
      free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_renderedimage_free(ptr);
      }
      /**
      * Get the PNG width
      * @returns {number}
      */
      get width() {
        const ret = wasm.renderedimage_width(this.ptr);
        return ret >>> 0;
      }
      /**
      * Get the PNG height
      * @returns {number}
      */
      get height() {
        const ret = wasm.renderedimage_height(this.ptr);
        return ret >>> 0;
      }
      /**
      * Write the image data to Uint8Array
      * @returns {Uint8Array}
      */
      asPng() {
        try {
          const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
          wasm.renderedimage_asPng(retptr, this.ptr);
          var r0 = getInt32Memory0()[retptr / 4 + 0];
          var r1 = getInt32Memory0()[retptr / 4 + 1];
          var r2 = getInt32Memory0()[retptr / 4 + 2];
          if (r2) {
            throw takeObject(r1);
          }
          return takeObject(r0);
        } finally {
          wasm.__wbindgen_add_to_stack_pointer(16);
        }
      }
      /**
      * Get the RGBA pixels of the image
      * @returns {Uint8Array}
      */
      get pixels() {
        const ret = wasm.renderedimage_pixels(this.ptr);
        return takeObject(ret);
      }
    };
    Resvg = class {
      static {
        __name(this, "Resvg");
      }
      static __wrap(ptr) {
        const obj = Object.create(Resvg.prototype);
        obj.ptr = ptr;
        return obj;
      }
      __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;
        return ptr;
      }
      free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_resvg_free(ptr);
      }
      /**
      * @param {Uint8Array | string} svg
      * @param {string | undefined} options
      */
      constructor(svg, options) {
        try {
          const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
          var ptr0 = isLikeNone(options) ? 0 : passStringToWasm0(options, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
          var len0 = WASM_VECTOR_LEN;
          wasm.resvg_new(retptr, addHeapObject(svg), ptr0, len0);
          var r0 = getInt32Memory0()[retptr / 4 + 0];
          var r1 = getInt32Memory0()[retptr / 4 + 1];
          var r2 = getInt32Memory0()[retptr / 4 + 2];
          if (r2) {
            throw takeObject(r1);
          }
          return Resvg.__wrap(r0);
        } finally {
          wasm.__wbindgen_add_to_stack_pointer(16);
        }
      }
      /**
      * Get the SVG width
      * @returns {number}
      */
      get width() {
        const ret = wasm.resvg_width(this.ptr);
        return ret;
      }
      /**
      * Get the SVG height
      * @returns {number}
      */
      get height() {
        const ret = wasm.resvg_height(this.ptr);
        return ret;
      }
      /**
      * Renders an SVG in Wasm
      * @returns {RenderedImage}
      */
      render() {
        try {
          const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
          wasm.resvg_render(retptr, this.ptr);
          var r0 = getInt32Memory0()[retptr / 4 + 0];
          var r1 = getInt32Memory0()[retptr / 4 + 1];
          var r2 = getInt32Memory0()[retptr / 4 + 2];
          if (r2) {
            throw takeObject(r1);
          }
          return RenderedImage.__wrap(r0);
        } finally {
          wasm.__wbindgen_add_to_stack_pointer(16);
        }
      }
      /**
      * Output usvg-simplified SVG string
      * @returns {string}
      */
      toString() {
        try {
          const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
          wasm.resvg_toString(retptr, this.ptr);
          var r0 = getInt32Memory0()[retptr / 4 + 0];
          var r1 = getInt32Memory0()[retptr / 4 + 1];
          return getStringFromWasm0(r0, r1);
        } finally {
          wasm.__wbindgen_add_to_stack_pointer(16);
          wasm.__wbindgen_free(r0, r1);
        }
      }
      /**
      * Calculate a maximum bounding box of all visible elements in this SVG.
      *
      * Note: path bounding box are approx values.
      * @returns {BBox | undefined}
      */
      innerBBox() {
        const ret = wasm.resvg_innerBBox(this.ptr);
        return ret === 0 ? void 0 : BBox.__wrap(ret);
      }
      /**
      * Calculate a maximum bounding box of all visible elements in this SVG.
      * This will first apply transform.
      * Similar to `SVGGraphicsElement.getBBox()` DOM API.
      * @returns {BBox | undefined}
      */
      getBBox() {
        const ret = wasm.resvg_getBBox(this.ptr);
        return ret === 0 ? void 0 : BBox.__wrap(ret);
      }
      /**
      * Use a given `BBox` to crop the svg. Currently this method simply changes
      * the viewbox/size of the svg and do not move the elements for simplicity
      * @param {BBox} bbox
      */
      cropByBBox(bbox) {
        _assertClass(bbox, BBox);
        wasm.resvg_cropByBBox(this.ptr, bbox.ptr);
      }
      /**
      * @returns {Array<any>}
      */
      imagesToResolve() {
        try {
          const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
          wasm.resvg_imagesToResolve(retptr, this.ptr);
          var r0 = getInt32Memory0()[retptr / 4 + 0];
          var r1 = getInt32Memory0()[retptr / 4 + 1];
          var r2 = getInt32Memory0()[retptr / 4 + 2];
          if (r2) {
            throw takeObject(r1);
          }
          return takeObject(r0);
        } finally {
          wasm.__wbindgen_add_to_stack_pointer(16);
        }
      }
      /**
      * @param {string} href
      * @param {Uint8Array} buffer
      */
      resolveImage(href, buffer) {
        try {
          const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
          const ptr0 = passStringToWasm0(href, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
          const len0 = WASM_VECTOR_LEN;
          wasm.resvg_resolveImage(retptr, this.ptr, ptr0, len0, addHeapObject(buffer));
          var r0 = getInt32Memory0()[retptr / 4 + 0];
          var r1 = getInt32Memory0()[retptr / 4 + 1];
          if (r1) {
            throw takeObject(r0);
          }
        } finally {
          wasm.__wbindgen_add_to_stack_pointer(16);
        }
      }
    };
    __name(load2, "load2");
    __name(getImports, "getImports");
    __name(initMemory, "initMemory");
    __name(finalizeInit, "finalizeInit");
    __name(init, "init");
    dist_default = init;
    initialized = false;
    initWasm = /* @__PURE__ */ __name(async (module_or_path) => {
      if (initialized) {
        throw new Error("Already initialized. The `initWasm()` function can be used only once.");
      }
      await dist_default(await module_or_path);
      initialized = true;
    }, "initWasm");
    Resvg2 = class extends Resvg {
      static {
        __name(this, "Resvg2");
      }
      /**
       * @param {Uint8Array | string} svg
       * @param {ResvgRenderOptions | undefined} options
       */
      constructor(svg, options) {
        if (!initialized)
          throw new Error("Wasm has not been initialized. Call `initWasm()` function.");
        super(svg, JSON.stringify(options));
      }
    };
    initializedResvg = initWasm(resvg_wasm);
    initializedYoga = xn2(yoga_wasm).then((yoga) => Ku(yoga));
    isDev = ((_b2 = (_a3 = globalThis == null ? void 0 : globalThis.process) == null ? void 0 : _a3.env) == null ? void 0 : _b2.NODE_ENV) === "development";
    ImageResponse = class {
      static {
        __name(this, "ImageResponse");
      }
      constructor(element, options = {}) {
        const result = new ReadableStream({
          async start(controller) {
            await initializedYoga;
            await initializedResvg;
            const fontData = await fallbackFont;
            const fonts = [
              {
                name: "sans serif",
                data: fontData,
                weight: 700,
                style: "normal"
              }
            ];
            const result2 = await render(Bu, resvg_wasm_exports, options, fonts, element);
            controller.enqueue(result2);
            controller.close();
          }
        });
        return new Response(result, {
          headers: {
            "content-type": "image/png",
            "cache-control": isDev ? "no-cache, no-store" : "public, immutable, no-transform, max-age=31536000",
            ...options.headers
          },
          status: options.status,
          statusText: options.statusText
        });
      }
    };
  }
});

// api/generate.tsx
var React, onRequestGet;
var init_generate = __esm({
  "api/generate.tsx"() {
    init_functionsRoutes_0_7918156147864959();
    init_checked_fetch();
    React = __toESM(require_react(), 1);
    init_api();
    onRequestGet = /* @__PURE__ */ __name(async ({ request }) => {
      try {
        const url = new URL(request.url);
        const queryParams = Object.fromEntries(url.searchParams.entries());
        const baseURL = "https://pingonsol.com";
        const baseCharacterImage = `${baseURL}/ping.png`;
        const baseImageScaleMultiplier = 1.4;
        const baseImageSize = 512 * baseImageScaleMultiplier;
        const baseImageOffset = -1 * (baseImageSize - 512) / 2;
        const traitOrder = ["aura", "body", "face", "mouth", "head", "right_hand", "left_hand", "accessory"];
        const traitsIndexUrl = new URL("/traits-index.json", request.url);
        const traitsIndexRes = await fetch(traitsIndexUrl.href);
        const traitsIndex = await traitsIndexRes.json();
        const validCategories = Object.keys(traitsIndex);
        const traitSelectionsByCategory = [];
        for (const [category, trait] of Object.entries(queryParams)) {
          if (!validCategories.includes(category)) {
            return new Response(`Invalid category "${category}". Valid categories are: ${validCategories.join(", ")}`, {
              status: 400
            });
          }
          if (!traitsIndex[category].includes(trait)) {
            return new Response(`Invalid trait "${trait}" for category "${category}", valid traits are: ${traitsIndex[category].join(", ")}`, {
              status: 400
            });
          }
          traitSelectionsByCategory.push({ category, trait });
        }
        traitSelectionsByCategory.sort((a, b) => traitOrder.indexOf(a.category) - traitOrder.indexOf(b.category));
        const selectedTraits = traitSelectionsByCategory.map(({ category, trait }) => {
          const traitKey = `trait-${trait}_${category}`;
          return `${baseURL}/traits/${traitKey}.png`;
        });
        if (selectedTraits.length === 0) {
          return new Response("No valid traits provided in query.", { status: 400 });
        }
        return new ImageResponse(
          /* @__PURE__ */ React.createElement(
            "div",
            {
              style: {
                width: 512,
                height: 512,
                display: "flex",
                position: "relative"
              }
            },
            /* @__PURE__ */ React.createElement(
              "img",
              {
                key: "base-character",
                src: baseCharacterImage,
                width: baseImageSize,
                height: baseImageSize,
                style: { position: "absolute", top: baseImageOffset, left: baseImageOffset }
              }
            ),
            selectedTraits.map((src, i2) => /* @__PURE__ */ React.createElement(
              "img",
              {
                key: i2,
                src,
                width: "512",
                height: "512",
                style: { position: "absolute", top: 0, left: 0 }
              }
            ))
          ),
          {
            width: 512,
            height: 512
          }
        );
      } catch (err2) {
        return new Response(`Internal error: ${err2}`, { status: 500 });
      }
    }, "onRequestGet");
  }
});

// ../.wrangler/tmp/pages-Jplw7X/functionsRoutes-0.7918156147864959.mjs
var routes;
var init_functionsRoutes_0_7918156147864959 = __esm({
  "../.wrangler/tmp/pages-Jplw7X/functionsRoutes-0.7918156147864959.mjs"() {
    init_generate();
    routes = [
      {
        routePath: "/api/generate",
        mountPath: "/api",
        method: "GET",
        middlewares: [],
        modules: [onRequestGet]
      }
    ];
  }
});

// ../.wrangler/tmp/bundle-80xBYF/middleware-loader.entry.ts
init_functionsRoutes_0_7918156147864959();
init_checked_fetch();

// ../.wrangler/tmp/bundle-80xBYF/middleware-insertion-facade.js
init_functionsRoutes_0_7918156147864959();
init_checked_fetch();

// ../node_modules/wrangler/templates/pages-template-worker.ts
init_functionsRoutes_0_7918156147864959();
init_checked_fetch();

// ../node_modules/path-to-regexp/dist.es2015/index.js
init_functionsRoutes_0_7918156147864959();
init_checked_fetch();
function lexer(str) {
  var tokens = [];
  var i2 = 0;
  while (i2 < str.length) {
    var char = str[i2];
    if (char === "*" || char === "+" || char === "?") {
      tokens.push({ type: "MODIFIER", index: i2, value: str[i2++] });
      continue;
    }
    if (char === "\\") {
      tokens.push({ type: "ESCAPED_CHAR", index: i2++, value: str[i2++] });
      continue;
    }
    if (char === "{") {
      tokens.push({ type: "OPEN", index: i2, value: str[i2++] });
      continue;
    }
    if (char === "}") {
      tokens.push({ type: "CLOSE", index: i2, value: str[i2++] });
      continue;
    }
    if (char === ":") {
      var name = "";
      var j2 = i2 + 1;
      while (j2 < str.length) {
        var code = str.charCodeAt(j2);
        if (
          // `0-9`
          code >= 48 && code <= 57 || // `A-Z`
          code >= 65 && code <= 90 || // `a-z`
          code >= 97 && code <= 122 || // `_`
          code === 95
        ) {
          name += str[j2++];
          continue;
        }
        break;
      }
      if (!name)
        throw new TypeError("Missing parameter name at ".concat(i2));
      tokens.push({ type: "NAME", index: i2, value: name });
      i2 = j2;
      continue;
    }
    if (char === "(") {
      var count = 1;
      var pattern = "";
      var j2 = i2 + 1;
      if (str[j2] === "?") {
        throw new TypeError('Pattern cannot start with "?" at '.concat(j2));
      }
      while (j2 < str.length) {
        if (str[j2] === "\\") {
          pattern += str[j2++] + str[j2++];
          continue;
        }
        if (str[j2] === ")") {
          count--;
          if (count === 0) {
            j2++;
            break;
          }
        } else if (str[j2] === "(") {
          count++;
          if (str[j2 + 1] !== "?") {
            throw new TypeError("Capturing groups are not allowed at ".concat(j2));
          }
        }
        pattern += str[j2++];
      }
      if (count)
        throw new TypeError("Unbalanced pattern at ".concat(i2));
      if (!pattern)
        throw new TypeError("Missing pattern at ".concat(i2));
      tokens.push({ type: "PATTERN", index: i2, value: pattern });
      i2 = j2;
      continue;
    }
    tokens.push({ type: "CHAR", index: i2, value: str[i2++] });
  }
  tokens.push({ type: "END", index: i2, value: "" });
  return tokens;
}
__name(lexer, "lexer");
function parse2(str, options) {
  if (options === void 0) {
    options = {};
  }
  var tokens = lexer(str);
  var _a4 = options.prefixes, prefixes = _a4 === void 0 ? "./" : _a4, _b3 = options.delimiter, delimiter = _b3 === void 0 ? "/#?" : _b3;
  var result = [];
  var key = 0;
  var i2 = 0;
  var path = "";
  var tryConsume = /* @__PURE__ */ __name(function(type) {
    if (i2 < tokens.length && tokens[i2].type === type)
      return tokens[i2++].value;
  }, "tryConsume");
  var mustConsume = /* @__PURE__ */ __name(function(type) {
    var value2 = tryConsume(type);
    if (value2 !== void 0)
      return value2;
    var _a5 = tokens[i2], nextType = _a5.type, index = _a5.index;
    throw new TypeError("Unexpected ".concat(nextType, " at ").concat(index, ", expected ").concat(type));
  }, "mustConsume");
  var consumeText = /* @__PURE__ */ __name(function() {
    var result2 = "";
    var value2;
    while (value2 = tryConsume("CHAR") || tryConsume("ESCAPED_CHAR")) {
      result2 += value2;
    }
    return result2;
  }, "consumeText");
  var isSafe = /* @__PURE__ */ __name(function(value2) {
    for (var _i = 0, delimiter_1 = delimiter; _i < delimiter_1.length; _i++) {
      var char2 = delimiter_1[_i];
      if (value2.indexOf(char2) > -1)
        return true;
    }
    return false;
  }, "isSafe");
  var safePattern = /* @__PURE__ */ __name(function(prefix2) {
    var prev = result[result.length - 1];
    var prevText = prefix2 || (prev && typeof prev === "string" ? prev : "");
    if (prev && !prevText) {
      throw new TypeError('Must have text between two parameters, missing text after "'.concat(prev.name, '"'));
    }
    if (!prevText || isSafe(prevText))
      return "[^".concat(escapeString(delimiter), "]+?");
    return "(?:(?!".concat(escapeString(prevText), ")[^").concat(escapeString(delimiter), "])+?");
  }, "safePattern");
  while (i2 < tokens.length) {
    var char = tryConsume("CHAR");
    var name = tryConsume("NAME");
    var pattern = tryConsume("PATTERN");
    if (name || pattern) {
      var prefix = char || "";
      if (prefixes.indexOf(prefix) === -1) {
        path += prefix;
        prefix = "";
      }
      if (path) {
        result.push(path);
        path = "";
      }
      result.push({
        name: name || key++,
        prefix,
        suffix: "",
        pattern: pattern || safePattern(prefix),
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    var value = char || tryConsume("ESCAPED_CHAR");
    if (value) {
      path += value;
      continue;
    }
    if (path) {
      result.push(path);
      path = "";
    }
    var open = tryConsume("OPEN");
    if (open) {
      var prefix = consumeText();
      var name_1 = tryConsume("NAME") || "";
      var pattern_1 = tryConsume("PATTERN") || "";
      var suffix = consumeText();
      mustConsume("CLOSE");
      result.push({
        name: name_1 || (pattern_1 ? key++ : ""),
        pattern: name_1 && !pattern_1 ? safePattern(prefix) : pattern_1,
        prefix,
        suffix,
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    mustConsume("END");
  }
  return result;
}
__name(parse2, "parse");
function match(str, options) {
  var keys = [];
  var re = pathToRegexp(str, keys, options);
  return regexpToFunction(re, keys, options);
}
__name(match, "match");
function regexpToFunction(re, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a4 = options.decode, decode2 = _a4 === void 0 ? function(x2) {
    return x2;
  } : _a4;
  return function(pathname) {
    var m2 = re.exec(pathname);
    if (!m2)
      return false;
    var path = m2[0], index = m2.index;
    var params = /* @__PURE__ */ Object.create(null);
    var _loop_1 = /* @__PURE__ */ __name(function(i3) {
      if (m2[i3] === void 0)
        return "continue";
      var key = keys[i3 - 1];
      if (key.modifier === "*" || key.modifier === "+") {
        params[key.name] = m2[i3].split(key.prefix + key.suffix).map(function(value) {
          return decode2(value, key);
        });
      } else {
        params[key.name] = decode2(m2[i3], key);
      }
    }, "_loop_1");
    for (var i2 = 1; i2 < m2.length; i2++) {
      _loop_1(i2);
    }
    return { path, index, params };
  };
}
__name(regexpToFunction, "regexpToFunction");
function escapeString(str) {
  return str.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
}
__name(escapeString, "escapeString");
function flags(options) {
  return options && options.sensitive ? "" : "i";
}
__name(flags, "flags");
function regexpToRegexp(path, keys) {
  if (!keys)
    return path;
  var groupsRegex = /\((?:\?<(.*?)>)?(?!\?)/g;
  var index = 0;
  var execResult = groupsRegex.exec(path.source);
  while (execResult) {
    keys.push({
      // Use parenthesized substring match if available, index otherwise
      name: execResult[1] || index++,
      prefix: "",
      suffix: "",
      modifier: "",
      pattern: ""
    });
    execResult = groupsRegex.exec(path.source);
  }
  return path;
}
__name(regexpToRegexp, "regexpToRegexp");
function arrayToRegexp(paths, keys, options) {
  var parts = paths.map(function(path) {
    return pathToRegexp(path, keys, options).source;
  });
  return new RegExp("(?:".concat(parts.join("|"), ")"), flags(options));
}
__name(arrayToRegexp, "arrayToRegexp");
function stringToRegexp(path, keys, options) {
  return tokensToRegexp(parse2(path, options), keys, options);
}
__name(stringToRegexp, "stringToRegexp");
function tokensToRegexp(tokens, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a4 = options.strict, strict = _a4 === void 0 ? false : _a4, _b3 = options.start, start = _b3 === void 0 ? true : _b3, _c = options.end, end = _c === void 0 ? true : _c, _d = options.encode, encode = _d === void 0 ? function(x2) {
    return x2;
  } : _d, _e = options.delimiter, delimiter = _e === void 0 ? "/#?" : _e, _f = options.endsWith, endsWith = _f === void 0 ? "" : _f;
  var endsWithRe = "[".concat(escapeString(endsWith), "]|$");
  var delimiterRe = "[".concat(escapeString(delimiter), "]");
  var route = start ? "^" : "";
  for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
    var token = tokens_1[_i];
    if (typeof token === "string") {
      route += escapeString(encode(token));
    } else {
      var prefix = escapeString(encode(token.prefix));
      var suffix = escapeString(encode(token.suffix));
      if (token.pattern) {
        if (keys)
          keys.push(token);
        if (prefix || suffix) {
          if (token.modifier === "+" || token.modifier === "*") {
            var mod = token.modifier === "*" ? "?" : "";
            route += "(?:".concat(prefix, "((?:").concat(token.pattern, ")(?:").concat(suffix).concat(prefix, "(?:").concat(token.pattern, "))*)").concat(suffix, ")").concat(mod);
          } else {
            route += "(?:".concat(prefix, "(").concat(token.pattern, ")").concat(suffix, ")").concat(token.modifier);
          }
        } else {
          if (token.modifier === "+" || token.modifier === "*") {
            throw new TypeError('Can not repeat "'.concat(token.name, '" without a prefix and suffix'));
          }
          route += "(".concat(token.pattern, ")").concat(token.modifier);
        }
      } else {
        route += "(?:".concat(prefix).concat(suffix, ")").concat(token.modifier);
      }
    }
  }
  if (end) {
    if (!strict)
      route += "".concat(delimiterRe, "?");
    route += !options.endsWith ? "$" : "(?=".concat(endsWithRe, ")");
  } else {
    var endToken = tokens[tokens.length - 1];
    var isEndDelimited = typeof endToken === "string" ? delimiterRe.indexOf(endToken[endToken.length - 1]) > -1 : endToken === void 0;
    if (!strict) {
      route += "(?:".concat(delimiterRe, "(?=").concat(endsWithRe, "))?");
    }
    if (!isEndDelimited) {
      route += "(?=".concat(delimiterRe, "|").concat(endsWithRe, ")");
    }
  }
  return new RegExp(route, flags(options));
}
__name(tokensToRegexp, "tokensToRegexp");
function pathToRegexp(path, keys, options) {
  if (path instanceof RegExp)
    return regexpToRegexp(path, keys);
  if (Array.isArray(path))
    return arrayToRegexp(path, keys, options);
  return stringToRegexp(path, keys, options);
}
__name(pathToRegexp, "pathToRegexp");

// ../node_modules/wrangler/templates/pages-template-worker.ts
var escapeRegex = /[.+?^${}()|[\]\\]/g;
function* executeRequest(request) {
  const requestPath = new URL(request.url).pathname;
  for (const route of [...routes].reverse()) {
    if (route.method && route.method !== request.method) {
      continue;
    }
    const routeMatcher = match(route.routePath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const mountMatcher = match(route.mountPath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const matchResult = routeMatcher(requestPath);
    const mountMatchResult = mountMatcher(requestPath);
    if (matchResult && mountMatchResult) {
      for (const handler of route.middlewares.flat()) {
        yield {
          handler,
          params: matchResult.params,
          path: mountMatchResult.path
        };
      }
    }
  }
  for (const route of routes) {
    if (route.method && route.method !== request.method) {
      continue;
    }
    const routeMatcher = match(route.routePath.replace(escapeRegex, "\\$&"), {
      end: true
    });
    const mountMatcher = match(route.mountPath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const matchResult = routeMatcher(requestPath);
    const mountMatchResult = mountMatcher(requestPath);
    if (matchResult && mountMatchResult && route.modules.length) {
      for (const handler of route.modules.flat()) {
        yield {
          handler,
          params: matchResult.params,
          path: matchResult.path
        };
      }
      break;
    }
  }
}
__name(executeRequest, "executeRequest");
var pages_template_worker_default = {
  async fetch(originalRequest, env, workerContext) {
    let request = originalRequest;
    const handlerIterator = executeRequest(request);
    let data = {};
    let isFailOpen = false;
    const next = /* @__PURE__ */ __name(async (input, init2) => {
      if (input !== void 0) {
        let url = input;
        if (typeof input === "string") {
          url = new URL(input, request.url).toString();
        }
        request = new Request(url, init2);
      }
      const result = handlerIterator.next();
      if (result.done === false) {
        const { handler, params, path } = result.value;
        const context = {
          request: new Request(request.clone()),
          functionPath: path,
          next,
          params,
          get data() {
            return data;
          },
          set data(value) {
            if (typeof value !== "object" || value === null) {
              throw new Error("context.data must be an object");
            }
            data = value;
          },
          env,
          waitUntil: workerContext.waitUntil.bind(workerContext),
          passThroughOnException: /* @__PURE__ */ __name(() => {
            isFailOpen = true;
          }, "passThroughOnException")
        };
        const response = await handler(context);
        if (!(response instanceof Response)) {
          throw new Error("Your Pages function should return a Response");
        }
        return cloneResponse(response);
      } else if ("ASSETS") {
        const response = await env["ASSETS"].fetch(request);
        return cloneResponse(response);
      } else {
        const response = await fetch(request);
        return cloneResponse(response);
      }
    }, "next");
    try {
      return await next();
    } catch (error) {
      if (isFailOpen) {
        const response = await env["ASSETS"].fetch(request);
        return cloneResponse(response);
      }
      throw error;
    }
  }
};
var cloneResponse = /* @__PURE__ */ __name((response) => (
  // https://fetch.spec.whatwg.org/#null-body-status
  new Response(
    [101, 204, 205, 304].includes(response.status) ? null : response.body,
    response
  )
), "cloneResponse");

// ../node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
init_functionsRoutes_0_7918156147864959();
init_checked_fetch();
var drainBody = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// ../node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
init_functionsRoutes_0_7918156147864959();
init_checked_fetch();
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e) {
    const error = reduceError(e);
    return Response.json(error, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// ../.wrangler/tmp/bundle-80xBYF/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = pages_template_worker_default;

// ../node_modules/wrangler/templates/middleware/common.ts
init_functionsRoutes_0_7918156147864959();
init_checked_fetch();
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env, ctx, dispatch, middlewareChain) {
  const [head2, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head2(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// ../.wrangler/tmp/bundle-80xBYF/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class ___Facade_ScheduledController__ {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  static {
    __name(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init2) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init2.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name((request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name((type, init2) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init2.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default
};
/*! Bundled license information:

react/cjs/react.development.js:
  (**
   * @license React
   * react.development.js
   *
   * Copyright (c) Facebook, Inc. and its affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)

@cloudflare/pages-plugin-vercel-og/dist/src/api/index.js:
  (*! Bundled license information:
  
  css-background-parser/index.js:
    (*!
     * https://github.com/gilmoreorless/css-background-parser
     * Copyright © 2015 Gilmore Davidson under the MIT license: http://gilmoreorless.mit-license.org/
     *)
  
  @vercel/og/dist/chunk-GIRBQXLD.js:
    (*! Copyright Twitter Inc. and other contributors. Licensed under MIT *)
  *)
*/
//# sourceMappingURL=functionsWorker-0.618368159942712.mjs.map
