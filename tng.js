require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/// <reference path="./_references" />
var utils_1 = require('./utils');
var slice = Array.prototype.slice;
function AssertionError(message) {
    // Error.apply(this, arguments);
    this.name = 'AssertionError';
    this.message = message != null ? message : '';
}
exports.AssertionError = AssertionError;
(function () {
    function __() { this.constructor = AssertionError; }
    __.prototype = Error.prototype;
    AssertionError.prototype = new __();
})();
function _assert(condition, errorOrMessage) {
    if (!condition) {
        throw (errorOrMessage instanceof Error) ? errorOrMessage :
            new AssertionError(errorOrMessage || 'Assertion failed');
    }
}
function _notNull(value, errorOrMessage) {
    _assert(value != null, errorOrMessage);
}
function _notEmpty(value, errorOrMessage) {
    _notNull(value, errorOrMessage);
    if (utils_1.isString(value)) {
        _assert(value.trim().length > 0, errorOrMessage);
    }
    else {
        _assert(value.length > 0, errorOrMessage);
    }
}
_assert.notNull = _notNull;
_assert.notEmpty = _notEmpty;
exports.assert = _assert;
},{"./utils":6}],2:[function(require,module,exports){
/// <reference path="./_references" />
var utils_1 = require('./utils');
exports.ANNOTATIONS_METADATA_KEY = 'tng';
var _Reflect = Reflect;
exports.Reflect = _Reflect;
var functionPrototype = Object.getPrototypeOf(Function);
function GetPrototypeOf(O) {
    var proto = Object.getPrototypeOf(O);
    if (typeof O !== "function" || O === functionPrototype) {
        return proto;
    }
    // TypeScript doesn't set __proto__ in ES5, as it's non-standard.
    // Try to determine the superclass constructor. Compatible implementations
    // must either set __proto__ on a subclass constructor to the superclass constructor,
    // or ensure each class has a valid `constructor` property on its prototype that
    // points back to the constructor.
    // If this is not the same as Function.[[Prototype]], then this is definately inherited.
    // This is the case when in ES6 or when using __proto__ in a compatible browser.
    if (proto !== functionPrototype) {
        return proto;
    }
    // If the super prototype is Object.prototype, null, or undefined, then we cannot determine the heritage.
    var prototype = O.prototype;
    var prototypeProto = Object.getPrototypeOf(prototype);
    if (prototypeProto == null || prototypeProto === Object.prototype) {
        return proto;
    }
    // if the constructor was not a function, then we cannot determine the heritage.
    var constructor = prototypeProto.constructor;
    if (typeof constructor !== "function") {
        return proto;
    }
    // if we have some kind of self-reference, then we cannot determine the heritage.
    if (constructor === O) {
        return proto;
    }
    // we have a pretty good guess at the heritage.
    return constructor;
}
function getKey(key) {
    return !key ? exports.ANNOTATIONS_METADATA_KEY : exports.ANNOTATIONS_METADATA_KEY + ":" + key;
}
function getAnnotations(target, type, key) {
    var metas = [];
    var proto = target;
    do {
        metas.push(getOwnAnnotations(proto, type, key));
        proto = GetPrototypeOf(proto);
    } while (typeof proto === "function" && proto !== functionPrototype);
    metas.reverse();
    var annotations = [];
    for (var i = 0; i < metas.length; i++) {
        annotations = annotations.concat(metas[i]);
    }
    return annotations;
}
exports.getAnnotations = getAnnotations;
// export function getAnnotations(target: any, type?: Function, key?: string): any[] {
// 	var annotations = <any[]> Reflect.getMetadata(getKey(key), target) || [];
// 	if (type) {
// 		return annotations.filter((value) => value instanceof type);
// 	}
// 	return annotations.slice(0);
// }
function getOwnAnnotations(target, type, key) {
    var annotations = Reflect.getOwnMetadata(getKey(key), target) || [];
    if (type) {
        return annotations.filter(function (value) { return value instanceof type; }).reverse();
    }
    return annotations.slice(0).reverse();
}
exports.getOwnAnnotations = getOwnAnnotations;
function setAnnotations(target, annotations, key) {
    Reflect.defineMetadata(getKey(key), annotations, target);
}
exports.setAnnotations = setAnnotations;
function addAnnotation(target, annotation, key) {
    var annotations = getOwnAnnotations(target, null, key);
    annotations.push(annotation);
    setAnnotations(target, annotations, key);
}
exports.addAnnotation = addAnnotation;
function hasAnnotation(target, type, key) {
    if (!type) {
        return Reflect.hasMetadata(getKey(key), target);
    }
    return getAnnotations(target, type, key).length > 0;
}
exports.hasAnnotation = hasAnnotation;
function hasOwnAnnotation(target, type, key) {
    if (!type) {
        return Reflect.hasOwnMetadata(getKey(key), target);
    }
    return getAnnotations(target, type, key).length > 0;
}
exports.hasOwnAnnotation = hasOwnAnnotation;
function mergeAnnotations() {
    var annotations = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        annotations[_i - 0] = arguments[_i];
    }
    if (!annotations.length) {
        return null;
    }
    else if (annotations.length == 1) {
        return annotations[0];
    }
    var dest = annotations.shift();
    for (var _a = 0; _a < annotations.length; _a++) {
        var source = annotations[_a];
        utils_1.forEach(source, function (value, key) {
            // We only replace if defined (nulls are ok, they remove previously set values)
            if (utils_1.isDefined(value)) {
                dest[key] = value;
            }
        });
    }
    return dest;
}
exports.mergeAnnotations = mergeAnnotations;
},{"./utils":6}],3:[function(require,module,exports){
/// <reference path="../../_references.ts" />
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var di_1 = require('../../di');
var decorator_1 = require('../../decorator');
var modal_1 = require('./modal');
var ModalServiceDecorator = (function () {
    function ModalServiceDecorator() {
    }
    ModalServiceDecorator.prototype.decorate = function ($modal, $injector) {
        var originalOpen = $modal.open;
        $modal.open = function (optionsOrModal, scope) {
            // Usign @Modal decorator?
            if (typeof optionsOrModal === 'function') {
                var handler = modal_1.getModalHandler(optionsOrModal, scope);
                return $injector.invoke(handler.open, handler);
            }
            else {
                return originalOpen.call($modal, optionsOrModal);
            }
        };
        return $modal;
    };
    __decorate([
        __param(0, di_1.Inject('$delegate')),
        __param(1, di_1.Inject('$injector'))
    ], ModalServiceDecorator.prototype, "decorate", null);
    ModalServiceDecorator = __decorate([
        decorator_1.Decorator({
            name: '$modal'
        })
    ], ModalServiceDecorator);
    return ModalServiceDecorator;
})();
exports.ModalServiceDecorator = ModalServiceDecorator;
},{"../../decorator":"tng/decorator","../../di":"tng/di","./modal":"tng/ui/bootstrap/modal"}],4:[function(require,module,exports){
/// <reference path="../../_references.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var utils_1 = require('../../utils');
var view_1 = require('../../view');
(function (ModalBackdrop) {
    ModalBackdrop[ModalBackdrop["Show"] = 0] = "Show";
    ModalBackdrop[ModalBackdrop["Hide"] = 1] = "Hide";
    ModalBackdrop[ModalBackdrop["Static"] = 2] = "Static";
})(exports.ModalBackdrop || (exports.ModalBackdrop = {}));
var ModalBackdrop = exports.ModalBackdrop;
/**
 * @internal
 */
exports.MODAL_BACKDROP_MAP = [true, false, 'static'];
/**
 * @internal
 */
var ModalViewAnnotation = (function (_super) {
    __extends(ModalViewAnnotation, _super);
    function ModalViewAnnotation(options) {
        _super.call(this, options);
        this.animation = void 0;
        this.backdrop = void 0;
        this.backdropClass = void 0;
        this.keyboard = void 0;
        this.windowClass = void 0;
        this.windowTemplateUrl = void 0;
        this.size = void 0;
        utils_1.setIfInterface(this, options);
    }
    return ModalViewAnnotation;
})(view_1.ViewAnnotation);
exports.ModalViewAnnotation = ModalViewAnnotation;
/**
 * A decorator to annotate a modal with view information
 */
exports.ModalView = utils_1.makeDecorator(ModalViewAnnotation);
},{"../../utils":6,"../../view":"tng/view"}],5:[function(require,module,exports){
/// <reference path="../../_references.ts" />
var utils_1 = require('../../utils');
var reflection_1 = require('../../reflection');
var di_1 = require('../../di');
/**
 * Enumeration of events related to the transition of states.
 */
(function (StateChangeEvent) {
    /**
     * Fired when the transition begins.
     *
     * Translates to the UI-Router $stateChangeStart event.
     *
     * The $rootScope broadcasts this event down to child scopes.
     *
     * The handler function receives the following parameters:
     *
     * - event: ng.IAngularEvent
     * - toState:
     * - toParams:
     * - fromState:
     * - fromParams:
     *
     * Note: Use event.preventDefault() to prevent the transition from happening.
     */
    StateChangeEvent[StateChangeEvent["STATE_CHANGE_START"] = 0] = "STATE_CHANGE_START";
    /**
     * Fired once the state transition is complete.
     *
     * Translates to the UI-Router $stateChangeSuccess event.
     *
     * The $rootScope broadcasts this event down to child scopes.
     *
     * The handler function receives the following parameters:
     *
     * - event: ng.IAngularEvent
     * - toState:
     * - toParams:
     * - fromState:
     * - fromParams:
     */
    StateChangeEvent[StateChangeEvent["STATE_CHANGE_SUCCESS"] = 1] = "STATE_CHANGE_SUCCESS";
    /**
     * Fired when an error occurs during transition.
     *
     * Translates to the UI-Router $stateChangeError event.
     *
     * The $rootScope broadcasts this event down to child scopes.
     *
     * The handler function receives the following parameters:
     *
     * - event: ng.IAngularEvent
     * - toState:
     * - toParams:
     * - fromState:
     * - fromParams:
     * - error: Error
     *
     * Note: It's important to note that if you have any errors in your
     * resolve functions (JavaScript errors, non-existent services, etc)
     * they will not throw traditionally. You must listen for this
     * event to catch ALL errors. Use event.preventDefault() to prevent
     * the $UrlRouter from reverting the URL to the previous valid location
     * (in case of a URL navigation).
     */
    StateChangeEvent[StateChangeEvent["STATE_CHANGE_ERROR"] = 2] = "STATE_CHANGE_ERROR";
})(exports.StateChangeEvent || (exports.StateChangeEvent = {}));
var StateChangeEvent = exports.StateChangeEvent;
/**
 * Enumeration of events related to the loading of view contents.
 */
(function (ViewLoadEvent) {
    /**
     * Fired once the view begins loading, before the DOM is rendered.
     *
     * Translates to the UI-Router $viewContentLoading event.
     *
     * The $rootScope broadcasts this event down to child scopes.
     *
     * The handler function receives the following parameters:
     *
     * - event: ng.IAngularEvent
     * - viewConfig:
     */
    ViewLoadEvent[ViewLoadEvent["VIEW_CONTENT_LOADING"] = 4] = "VIEW_CONTENT_LOADING";
    /**
     * Fired once the view is loaded, after the DOM is rendered.
     *
     * Translates to the UI-Router $viewContentLoaded event.
     *
     * The '$scope' of the view emits the event up to the $rootScope.
     *
     * The handler function receives the following parameter:
     *
     * - event: ng.IAngularEvent
     */
    ViewLoadEvent[ViewLoadEvent["VIEW_CONTENT_LOADED"] = 5] = "VIEW_CONTENT_LOADED";
})(exports.ViewLoadEvent || (exports.ViewLoadEvent = {}));
var ViewLoadEvent = exports.ViewLoadEvent;
/**
 * Maps the event enums to the actual event names used by the UI-Router.
 * @internal
 */
var EVENTS_MAP = [
    '$stateChangeStart',
    '$stateChangeSuccess',
    '$stateChangeError',
    '$stateNotFound',
    '$viewContentLoading',
    '$viewContentLoaded'
];
/**
 * @internal
 */
var UiRouterEventListenerAnnotation = (function () {
    function UiRouterEventListenerAnnotation(event, handler) {
        this.event = event;
        this.handler = handler;
        // TODO validate arguments
    }
    return UiRouterEventListenerAnnotation;
})();
exports.UiRouterEventListenerAnnotation = UiRouterEventListenerAnnotation;
/**
 * @internal
 */
exports.On = utils_1.makeDecorator(UiRouterEventListenerAnnotation);
/**
 * @internal
 */
function publishListeners(moduleController, ngModule) {
    // Reflect.decorate apply decorators reversely, so we need to reverse
    // the extracted annotations to ge them on the original order
    // var listenerNotes = <UiRouterEventListenerAnnotation[]> getAnnotations(moduleController, UiRouterEventListenerAnnotation).reverse();
    var listenerNotes = reflection_1.getAnnotations(moduleController, UiRouterEventListenerAnnotation);
    if (listenerNotes.length) {
        ngModule.run(di_1.injectable(['$rootScope'], function ($rootScope) {
            for (var _i = 0; _i < listenerNotes.length; _i++) {
                var listenerAnnotation = listenerNotes[_i];
                var event_1 = listenerAnnotation.event;
                if (utils_1.isNumber(event_1)) {
                    event_1 = EVENTS_MAP[listenerAnnotation.event];
                }
                $rootScope.$on(event_1, listenerAnnotation.handler);
            }
        }));
    }
}
exports.publishListeners = publishListeners;
},{"../../di":"tng/di","../../reflection":2,"../../utils":6}],6:[function(require,module,exports){
/// <reference path="./_references.ts" />
var reflection_1 = require('./reflection');
exports.isDefined = angular.isDefined;
exports.isString = angular.isString;
exports.isNumber = angular.isNumber;
exports.isObject = angular.isObject;
exports.isElement = angular.isElement;
exports.isDate = angular.isDate;
exports.isArray = angular.isArray;
exports.isFunction = angular.isFunction;
exports.forEach = angular.forEach;
exports.extend = angular.extend;
exports.copy = angular.copy;
exports.merge = angular.merge;
exports.mergeIfValue = _mergeIfValue;
function create(constructor) {
    return Object.create(constructor.prototype);
}
exports.create = create;
function setIf(target, source) {
    if (target == null || source == null) {
        return;
    }
    for (var key in source) {
        if (source.hasOwnProperty(key) && exports.isDefined(source[key])) {
            target[key] = source[key];
        }
    }
}
exports.setIf = setIf;
function setIfInterface(target, source) {
    if (target == null || source == null) {
        return;
    }
    for (var key in source) {
        if (source.hasOwnProperty(key) && exports.isDefined(source[key])) {
            if (target.hasOwnProperty(key)) {
                target[key] = source[key];
            }
        }
    }
}
exports.setIfInterface = setIfInterface;
function makeDecorator(annotationClass) {
    return function () {
        var annotationInstance = Object.create(annotationClass.prototype);
        annotationClass.apply(annotationInstance, arguments);
        return function (target) {
            reflection_1.addAnnotation(target, annotationInstance);
            return target;
        };
    };
}
exports.makeDecorator = makeDecorator;
function makeParamDecorator(annotationClass) {
    return function () {
        var annotationInstance = Object.create(annotationClass.prototype);
        annotationClass.apply(annotationInstance, arguments);
        return function (target, unusedKey, index) {
            var parameters = reflection_1.Reflect.getMetadata('parameters', target);
            parameters = parameters || [];
            // there might be gaps if some in between parameters do not have annotations.
            // we pad with nulls.
            while (parameters.length <= index) {
                parameters.push(null);
            }
            parameters[index] = annotationInstance;
            reflection_1.Reflect.defineMetadata('parameters', parameters, target);
            return target;
        };
    };
}
exports.makeParamDecorator = makeParamDecorator;
(function (SelectorType) {
    SelectorType[SelectorType["Attribute"] = 0] = "Attribute";
    SelectorType[SelectorType["Class"] = 1] = "Class";
    //Comment,
    SelectorType[SelectorType["Tag"] = 2] = "Tag";
})(exports.SelectorType || (exports.SelectorType = {}));
var SelectorType = exports.SelectorType;
;
var RE_SELECTOR_ATTRIBUTE = /^\[([a-z_][a-z\-_0-9]+)\]$/i;
var RE_SELECTOR_CLASS = /^\.([a-z_][a-z\-_0-9]+)$/i;
//const RE_SELECTOR_COMMENT = /^\/\/([a-z_][a-z\-_0-9]+)$/i;
var RE_SELECTOR_TAG = /^([a-z_][a-z\-_0-9]+)$/i;
function parseSelector(selector) {
    var semanticeName;
    var type;
    var m;
    if (m = RE_SELECTOR_TAG.exec(selector)) {
        type = 2 /* Tag */;
    }
    else if (m = RE_SELECTOR_ATTRIBUTE.exec(selector)) {
        type = 0 /* Attribute */;
    }
    else if (m = RE_SELECTOR_CLASS.exec(selector)) {
        type = 1 /* Class */;
    }
    else {
        throw new Error("Invalid selector: " + selector);
    }
    return {
        semanticeName: m[1],
        imperativeName: toCamelCase(m[1]),
        type: type
    };
}
exports.parseSelector = parseSelector;
// from mout @ https://github.com/mout/mout/blob/v0.11.0/src/string/camelCase.js
function toCamelCase(str) {
    str = str.replace(/[\-_]/g, ' ') //convert all hyphens and underscores to spaces
        .replace(/\s[a-z]/g, upperCase) //convert first char of each word to UPPERCASE
        .replace(/\s+/g, '') //remove spaces
        .replace(/^[A-Z]/g, lowerCase); //convert first char to lowercase
    return str;
}
function upperCase(str) {
    return str.toUpperCase();
}
function lowerCase(str) {
    return str.toLowerCase();
}
/**
 * @internal
 */
function bindFunctions(host) {
    var aux = host;
    if (aux) {
        for (var key in aux) {
            if (exports.isFunction(aux[key])) {
                aux[key] = safeBind(aux[key], aux);
            }
        }
    }
    return host;
}
exports.bindFunctions = bindFunctions;
function safeBind(func, context) {
    var bound = func.bind(context);
    exports.forEach(func, function (value, name) { return bound[name] = value; });
    return bound;
}
exports.safeBind = safeBind;
// --
/**
 * Set or clear the hashkey for an object.
 * @param obj object
 * @param h the hashkey (!truthy to delete the hashkey)
 */
function setHashKey(obj, h) {
    if (h) {
        obj.$$hashKey = h;
    }
    else {
        delete obj.$$hashKey;
    }
}
function baseExtend(dst, objs, deep, ifValue) {
    if (ifValue === void 0) { ifValue = false; }
    var h = dst.$$hashKey;
    for (var i = 0, ii = objs.length; i < ii; ++i) {
        var obj = objs[i];
        if (!exports.isObject(obj) && !exports.isFunction(obj))
            continue;
        var keys = Object.keys(obj);
        for (var j = 0, jj = keys.length; j < jj; j++) {
            var key = keys[j];
            var src = obj[key];
            if (deep && exports.isObject(src)) {
                if (!exports.isObject(dst[key]))
                    dst[key] = exports.isArray(src) ? [] : {};
                baseExtend(dst[key], [src], true);
            }
            else if (!ifValue || src != null) {
                dst[key] = src;
            }
        }
    }
    setHashKey(dst, h);
    return dst;
}
function _mergeIfValue(dst) {
    return baseExtend(dst, [].slice.call(arguments, 1), true, true);
}
},{"./reflection":2}],"tng/animation":[function(require,module,exports){
/// <reference path="./_references.ts" />
var reflection_1 = require('./reflection');
var di_1 = require('./di');
var utils_1 = require('./utils');
var utils_2 = require('./utils');
/**
 * @internal
 */
var AnimationAnnotation = (function () {
    function AnimationAnnotation(options) {
        this.name = null;
        utils_1.setIfInterface(this, options);
    }
    return AnimationAnnotation;
})();
exports.AnimationAnnotation = AnimationAnnotation;
/**
 * A decorator to annotate a class as being an animation controller
 */
exports.Animation = utils_1.makeDecorator(AnimationAnnotation);
/**
 * @internal
 */
function registerAnimation(animationClass, ngModule) {
    // Reflect.decorate apply decorators reversely, so we need to reverse
    // the extracted annotations before merging them
    // var aux = getAnnotations(animationClass, AnimationAnnotation).reverse();
    var aux = reflection_1.getAnnotations(animationClass, AnimationAnnotation);
    if (!aux.length) {
        throw new Error("Filter annotation not found");
    }
    var name = reflection_1.mergeAnnotations.apply(void 0, [utils_2.create(AnimationAnnotation)].concat(aux)).name;
    // TODO validate implementation?
    ngModule.animation(name, di_1.injectable(['$injector'], function ($injector) {
        var singleton = $injector.instantiate(animationClass);
        utils_2.bindFunctions(singleton);
        return singleton;
    }));
}
exports.registerAnimation = registerAnimation;
},{"./di":"tng/di","./reflection":2,"./utils":6}],"tng/application":[function(require,module,exports){
/// <reference path="./_references.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
// TODO debug only?
var assert_1 = require('./assert');
var utils_1 = require('./utils');
var module_1 = require('./module');
/**
 * @internal
 */
var ApplicationAnnotation = (function (_super) {
    __extends(ApplicationAnnotation, _super);
    function ApplicationAnnotation(elementOroptions) {
        _super.call(this, options);
        // selector: string = void 0;
        this.element = void 0;
        var options = utils_1.isElement(elementOroptions) ? { element: elementOroptions } : elementOroptions;
        // TODO debug only?
        assert_1.assert(options && options.element, 'element must be provided');
        // assert(options.element || options.selector, 'Either element or selector must be provided');
        // assert(!(options.element && options.selector), 'Provide either selector or element, but not both');
        utils_1.setIfInterface(this, options);
    }
    return ApplicationAnnotation;
})(module_1.ModuleAnnotation);
exports.ApplicationAnnotation = ApplicationAnnotation;
/**
 * A decorator to annotate a class as being an application
 */
exports.Application = utils_1.makeDecorator(ApplicationAnnotation);
},{"./assert":1,"./module":"tng/module","./utils":6}],"tng/bootstrap":[function(require,module,exports){
/// <reference path="./_references" />
/*
Applications must have:
    - Module annotation

Steps to bootstrap:

    - Process submodules (recursively)
    - Process the application module
    - Bootstrap

To process a module is to:
    - Iterate through it's submodules and process them (recurse)
        - Register the module on Angular
        - Register services on Angular
        - Register directives on Angular
        - Register components on Angular
            - Gather route annotations
        - Register config and run functions
*/
// TODO debug only?
var assert_1 = require('./assert');
var reflection_1 = require('./reflection');
var module_1 = require('./module');
function bootstrap(moduleClass, element, dependencies, constructorParameters) {
    // Reflect.decorate apply decorators reversely, so we need to reverse
    // the extracted annotations before merging them
    // var aux = getAnnotations(moduleClass, ModuleAnnotation).reverse();
    var aux = reflection_1.getAnnotations(moduleClass, module_1.ModuleAnnotation);
    // TODO debug only?
    assert_1.assert.notEmpty(aux, 'Missing @Application or @Module decoration');
    var annotation = reflection_1.mergeAnnotations.apply(void 0, [{}].concat(aux));
    element = element || annotation.element;
    // TODO debug only?
    assert_1.assert(element, 'element must be provided');
    var ngModule = module_1.publishModule(moduleClass, null, dependencies, constructorParameters);
    return angular.bootstrap(element, [ngModule.name]);
}
exports.bootstrap = bootstrap;
//export function bootstrapWhenReady(moduleClass: ModuleConstructor): Promise<ng.auto.IInjectorService>;
//export function bootstrapWhenReady(moduleClass: ModuleConstructor, element: Element): Promise<ng.auto.IInjectorService>;
//export function bootstrapWhenReady(moduleClass: ModuleConstructor, selector: string): Promise<ng.auto.IInjectorService>;
//export function bootstrapWhenReady(moduleClass: ModuleConstructor, selectorOrElement?: any): Promise<ng.auto.IInjectorService> {
//
//    var promise = new Promise<ng.auto.IInjectorService>((resolve, reject) => {
//        // TODO
//    });
//
//    return promise;
//
//} 
},{"./assert":1,"./module":"tng/module","./reflection":2}],"tng/component-view":[function(require,module,exports){
/// <reference path="./_references.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var utils_1 = require('./utils');
var view_1 = require('./view');
/**
 * TODO document
 */
(function (ComponentTemplateNamespace) {
    ComponentTemplateNamespace[ComponentTemplateNamespace["HTML"] = 0] = "HTML";
    ComponentTemplateNamespace[ComponentTemplateNamespace["SVG"] = 1] = "SVG";
    ComponentTemplateNamespace[ComponentTemplateNamespace["MathML"] = 2] = "MathML";
})(exports.ComponentTemplateNamespace || (exports.ComponentTemplateNamespace = {}));
var ComponentTemplateNamespace = exports.ComponentTemplateNamespace;
/**
 * @internal
 */
exports.NAMESPACE_MAP = ['html', 'svg', 'math'];
/**
 * @internal
 */
var ComponentViewAnnotation = (function (_super) {
    __extends(ComponentViewAnnotation, _super);
    function ComponentViewAnnotation(options) {
        _super.call(this, options);
        this.namespace = void 0;
        this.replace = void 0;
        utils_1.setIfInterface(this, options);
    }
    return ComponentViewAnnotation;
})(view_1.ViewAnnotation);
exports.ComponentViewAnnotation = ComponentViewAnnotation;
/**
 * A decorator to annotate a component with view information
 */
exports.ComponentView = utils_1.makeDecorator(ComponentViewAnnotation);
},{"./utils":6,"./view":"tng/view"}],"tng/component":[function(require,module,exports){
/// <reference path="./_references.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var assert_1 = require('./assert');
var di_1 = require('./di');
var utils_1 = require("./utils");
var reflection_1 = require('./reflection');
var view_1 = require('./view');
var component_view_1 = require('./component-view');
var directive_1 = require('./directive');
var directive_2 = require('./directive');
var directive_3 = require('./directive');
exports.Bind = directive_3.Bind;
/**
 * @internal
 */
var ComponentAnnotation = (function (_super) {
    __extends(ComponentAnnotation, _super);
    function ComponentAnnotation(options) {
        _super.call(this, options); // TODO WTF needs casting?
        //setIfInterface(this, options); nothing to do so far
    }
    return ComponentAnnotation;
})(directive_1.CommonDirectiveAnnotation);
exports.ComponentAnnotation = ComponentAnnotation;
/**
 * A decorator to annotate a class as being a component controller
 */
exports.Component = utils_1.makeDecorator(ComponentAnnotation);
function publishComponent(componentClass, ngModule, selector) {
    // TODO debug only?
    assert_1.assert(reflection_1.hasOwnAnnotation(componentClass, ComponentAnnotation), 'Missing @Component decoration');
    assert_1.assert(reflection_1.hasAnnotation(componentClass, view_1.ViewAnnotation), 'Missing @View decoration');
    var _a = makeComponentFactory(componentClass), name = _a.name, factory = _a.factory;
    // TODO Allow for selector override through parameter
    ngModule.directive(name, factory);
    return ngModule;
}
exports.publishComponent = publishComponent;
/**
 * @internal
 */
function makeComponentDO(componentClass) {
    var cdo = directive_2.makeCommonDO(componentClass);
    // Reflect.decorate apply decorators reversely, so we need to reverse
    // the extracted annotations before merging them
    // var aux = getAnnotations(componentClass, ViewAnnotation).reverse();
    var aux = reflection_1.getAnnotations(componentClass, view_1.ViewAnnotation);
    var view = {};
    reflection_1.mergeAnnotations.apply(void 0, [view].concat(aux));
    if (!utils_1.isDefined(cdo.scope))
        cdo.scope = {}; // Default scope is isolate
    if (!utils_1.isDefined(cdo.bindToController))
        cdo.bindToController = true; // Default bindToController value
    if (utils_1.isDefined(view.controllerAs))
        cdo.controllerAs = view.controllerAs;
    if (utils_1.isDefined(view.namespace))
        cdo.templateNamespace = component_view_1.NAMESPACE_MAP[view.namespace];
    if (utils_1.isDefined(view.styles)) {
        cdo.styles = typeof view.styles === "string" ? [view.styles] : view.styles;
    }
    // else if (isDefined(view.stylesUrls)) cdo.stylesUrls = view.stylesUrls;
    if (utils_1.isDefined(view.template))
        cdo.template = view.template;
    else if (utils_1.isDefined(view.templateUrl))
        cdo.templateUrl = view.templateUrl;
    else
        throw new Error('Component has no template. Use either template or templateUrl');
    return cdo;
}
exports.makeComponentDO = makeComponentDO;
/**
 * @internal
 */
function inFactory(cdo, $injector) {
    if (utils_1.isFunction(cdo.template)) {
        cdo.template = !di_1.isAnnotated(cdo.template) ? cdo.template : function (tElement, tAttrs) {
            return $injector.invoke(cdo.template, null, {
                element: tElement,
                attributes: tAttrs
            });
        };
    }
    if (utils_1.isFunction(cdo.templateUrl)) {
        cdo.templateUrl = !di_1.isAnnotated(cdo.templateUrl) ? cdo.templateUrl : function (tElement, tAttrs) {
            return $injector.invoke(cdo.templateUrl, null, {
                element: tElement,
                attributes: tAttrs
            });
        };
    }
    // TODO styleUrl
    return cdo;
}
exports.inFactory = inFactory;
/**
 * @internal
 */
function makeComponentFactory(componentClass) {
    var cdo = makeComponentDO(componentClass);
    var factory = di_1.injectable(['$injector'], function directiveFactory($injector) {
        if (cdo.styles) {
            for (var i = 0; i < cdo.styles.length; i++) {
                insertStyle(cdo.styles[i], "tng-component_" + cdo.imperativeName + "_" + i);
            }
        }
        // else if (cdo.stylesUrls) {
        // TODO
        // }
        return inFactory(directive_2.inFactory(cdo, $injector), $injector);
    });
    return {
        name: cdo.imperativeName,
        factory: factory
    };
}
exports.makeComponentFactory = makeComponentFactory;
function insertStyle(style, id) {
    id = "#" + id;
    var head = document.head;
    if (head.querySelector(id)) {
        return;
    }
    var el = document.createElement("style");
    el.id = id;
    el.type = "text/css";
    el.textContent = style;
    head.insertBefore(el, head.querySelector("style"));
}
},{"./assert":1,"./component-view":"tng/component-view","./di":"tng/di","./directive":"tng/directive","./reflection":2,"./utils":6,"./view":"tng/view"}],"tng/constant":[function(require,module,exports){
/// <reference path="./_references" />
// TODO debug only?
var assert_1 = require('./assert');
/**
 * A framework envelope for constants
 */
var ConstantWrapper = (function () {
    function ConstantWrapper(_name, _value) {
        this._name = _name;
        this._value = _value;
    }
    Object.defineProperty(ConstantWrapper.prototype, "name", {
        get: function () {
            return this._name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ConstantWrapper.prototype, "value", {
        get: function () {
            return this._value;
        },
        enumerable: true,
        configurable: true
    });
    return ConstantWrapper;
})();
exports.ConstantWrapper = ConstantWrapper;
/**
 * Wraps a constant to be made available for dependency injection
 *
 * @param name The name of the constant through which it will made available
 * @param value The constant value to be injected, as is
 *
 * @return A wrapper, to be used as a module dependency
 */
function Constant(name, value) {
    // TODO debug only?
    assert_1.assert.notEmpty(name, 'name cannot be null or empty');
    return new ConstantWrapper(name, value);
}
exports.Constant = Constant;
function publishConstant(constant, ngModule, name) {
    // TODO debug only?
    assert_1.assert(constant instanceof ConstantWrapper, 'constant must be a ConstantWrapper');
    name = name != null ? name : constant.name;
    ngModule.constant(name, constant.value);
    return ngModule;
}
exports.publishConstant = publishConstant;
},{"./assert":1}],"tng/controller":[function(require,module,exports){
/// <reference path="./_references" />
// import {makeDecorator} from './utils';
// export interface ControllerOptions {
// }
// export class ControllerAnnotation {
//     constructor(options:ControllerOptions) {
//     }
// }
// type ControllerAnnotationDecorator = (options:ControllerOptions) => ClassDecorator;
// export var Controller = <ControllerAnnotationDecorator> makeDecorator(ControllerAnnotation);
},{}],"tng/decorator":[function(require,module,exports){
/// <reference path="./_references" />
var di_1 = require('./di');
var reflection_1 = require('./reflection');
var utils_1 = require('./utils');
/**
 * @internal
 */
var DecoratorAnnotation = (function () {
    function DecoratorAnnotation(options) {
        this.name = null;
        utils_1.setIfInterface(this, options);
    }
    return DecoratorAnnotation;
})();
exports.DecoratorAnnotation = DecoratorAnnotation;
/**
 * A decorator to annotate a class as being a service decorator
 */
exports.Decorator = utils_1.makeDecorator(DecoratorAnnotation);
function publishDecorator(decoratorClass, ngModule, name) {
    // Reflect.decorate apply decorators reversely, so we need to reverse
    // the extracted annotations before merging them
    // var aux = getAnnotations(decoratorClass, DecoratorAnnotation).reverse();
    var aux = reflection_1.getAnnotations(decoratorClass, DecoratorAnnotation);
    if (!aux.length) {
        throw new Error("Decorator annotation not found");
    }
    var annotation = reflection_1.mergeAnnotations.apply(void 0, [utils_1.create(DecoratorAnnotation)].concat(aux));
    name = name != null ? name : annotation.name;
    if (!utils_1.isFunction(decoratorClass.prototype.decorate)) {
        throw new Error("Decorator \"" + name + "\" does not implement a decorate method");
    }
    ngModule.config(di_1.injectable(['$provide'], function ($provide) {
        $provide.decorator(name, di_1.injectable(['$delegate', '$injector'], function ($delegate, $injector) {
            var instance = $injector.instantiate(decoratorClass, {
                $delegate: $delegate
            });
            return $injector.invoke(instance.decorate, instance, {
                $delegate: $delegate
            });
        }));
    }));
    return ngModule;
}
exports.publishDecorator = publishDecorator;
},{"./di":"tng/di","./reflection":2,"./utils":6}],"tng/directive":[function(require,module,exports){
/// <reference path="./_references.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
// TODO debug only?
var assert_1 = require('./assert');
var di_1 = require('./di');
var utils_1 = require('./utils');
var utils_2 = require('./utils');
var reflection_1 = require('./reflection');
/**
 * TODO document
 */
(function (Transclusion) {
    Transclusion[Transclusion["Content"] = 0] = "Content";
    Transclusion[Transclusion["Element"] = 1] = "Element";
})(exports.Transclusion || (exports.Transclusion = {}));
var Transclusion = exports.Transclusion;
var TRANSCLUSION_MAP = [true, 'element'];
/**
 * @internal
 */
var CommonDirectiveAnnotation = (function () {
    function CommonDirectiveAnnotation(options) {
        this.selector = void 0;
        this.scope = void 0;
        this.bindToController = void 0;
        this.require = void 0;
        this.transclude = void 0;
        this.compile = void 0;
        this.link = void 0;
        // TODO debug only?
        assert_1.assert.notNull(options, 'options must not be null');
        assert_1.assert.notEmpty(options.selector, 'selector must not be null or empty');
        utils_1.setIfInterface(this, options);
    }
    return CommonDirectiveAnnotation;
})();
exports.CommonDirectiveAnnotation = CommonDirectiveAnnotation;
/**
 * @internal
 */
var DirectiveAnnotation = (function (_super) {
    __extends(DirectiveAnnotation, _super);
    function DirectiveAnnotation(options) {
        _super.call(this, options); // TODO WTF needs casting?
        this.multiElement = void 0;
        this.priority = void 0;
        this.terminal = void 0;
        utils_1.setIfInterface(this, options);
    }
    return DirectiveAnnotation;
})(CommonDirectiveAnnotation);
exports.DirectiveAnnotation = DirectiveAnnotation;
/**
 *
 */
exports.Directive = utils_1.makeDecorator(DirectiveAnnotation);
// ---
// @Bind
var BindAnnotation = (function () {
    function BindAnnotation(propertyKey, binding) {
        this.propertyKey = propertyKey;
        this.binding = binding;
    }
    return BindAnnotation;
})();
exports.BindAnnotation = BindAnnotation;
function bindDecorator(binding) {
    return function (target, propertyKey) {
        var newBind = new BindAnnotation(propertyKey, binding);
        reflection_1.addAnnotation(target.constructor, newBind);
    };
}
exports.Bind = bindDecorator;
// ---
function publishDirective(directiveClass, ngModule, selector) {
    // TODO debug only?
    assert_1.assert(reflection_1.hasOwnAnnotation(directiveClass, DirectiveAnnotation), 'Did you decorate it with @Directive?');
    var _a = makeDirectiveFactory(directiveClass), name = _a.name, factory = _a.factory;
    // TODO consider provided selector, if any
    ngModule.directive(name, factory);
    return ngModule;
}
exports.publishDirective = publishDirective;
var RESTRICTION_MAP = (_a = {},
    _a[0 /* Attribute */] = 'A',
    _a[2 /* Tag */] = 'E',
    _a[1 /* Class */] = 'C',
    _a
);
/**
 * @internal
 */
function makeCommonDO(directiveClass) {
    // Reflect.decorate apply decorators reversely, so we need to reverse
    // the extracted annotations before merging them
    // var aux = getAnnotations(directiveClass, CommonDirectiveAnnotation).reverse();
    var aux = reflection_1.getAnnotations(directiveClass, CommonDirectiveAnnotation);
    var annotation = {};
    reflection_1.mergeAnnotations.apply(void 0, [annotation].concat(aux));
    var selectorData = utils_2.parseSelector(annotation.selector);
    var ddo = {
        semanticName: selectorData.semanticeName,
        imperativeName: selectorData.imperativeName,
        restrict: RESTRICTION_MAP[selectorData.type],
        controller: directiveClass
    };
    if (utils_1.isDefined(annotation.transclude))
        ddo.transclude = TRANSCLUSION_MAP[annotation.transclude];
    if (utils_1.isDefined(annotation.compile))
        ddo.compile = annotation.compile;
    if (utils_1.isDefined(annotation.link))
        ddo.link = annotation.link;
    // scope
    if (utils_1.isDefined(annotation.scope))
        ddo.scope = annotation.scope;
    // bindToController
    // let bindAnnotations = <BindAnnotation[]> getAnnotations(directiveClass, BindAnnotation).reverse();
    var bindAnnotations = reflection_1.getAnnotations(directiveClass, BindAnnotation);
    if (bindAnnotations.length) {
        var map = {};
        for (var _i = 0; _i < bindAnnotations.length; _i++) {
            var bind = bindAnnotations[_i];
            map[bind.propertyKey] = bind.binding;
        }
        ddo.bindToController = map;
    }
    else if (utils_1.isDefined(annotation.bindToController))
        ddo.bindToController = annotation.bindToController;
    return ddo;
}
exports.makeCommonDO = makeCommonDO;
/**
 * @internal
 */
function makeDirectiveDO(directiveClass) {
    var ddo = makeCommonDO(directiveClass);
    // Reflect.decorate apply decorators reversely, so we need to reverse
    // the extracted annotations before merging them
    // var aux = getAnnotations(directiveClass, DirectiveAnnotation).reverse();
    var aux = reflection_1.getAnnotations(directiveClass, DirectiveAnnotation);
    var annotation = {};
    reflection_1.mergeAnnotations.apply(void 0, [annotation].concat(aux));
    if (utils_1.isDefined(annotation.multiElement))
        ddo.multiElement = annotation.multiElement;
    if (utils_1.isDefined(annotation.priority))
        ddo.priority = annotation.priority;
    if (utils_1.isDefined(annotation.terminal))
        ddo.terminal = annotation.terminal;
    return ddo;
}
exports.makeDirectiveDO = makeDirectiveDO;
/**
 * @internal
 */
function inFactory(ddo, $injector) {
    if (utils_1.isFunction(ddo.compile)) {
        ddo.compile = !di_1.isAnnotated(ddo.compile) ? ddo.compile :
            function (tElement, tAttrs, transclude) {
                return $injector.invoke(ddo.compile, null, {
                    $element: tElement,
                    $attrs: tAttrs,
                    $transclude: transclude
                });
            };
    }
    if (typeof ddo.link === "string") {
        var linkFn = ddo.controller.prototype[ddo.link];
        if (!di_1.isAnnotated(linkFn)) {
            ddo.link = function (scope, iElement, iAttrs, controllers, transclude) {
                var controller = angular.isArray(controllers) ? controllers[controllers.lenght - 1] : controllers;
                linkFn.apply(controller || null, [].slice.call(arguments, 0));
            };
        }
        else {
            ddo.link = function (scope, iElement, iAttrs, controllers, transclude) {
                var controller = angular.isArray(controllers) ? controllers[controllers.lenght - 1] : controllers;
                return $injector.invoke(linkFn, controller, {
                    $scope: scope,
                    $element: iElement,
                    $attrs: iAttrs,
                    $controller: controllers,
                    $controllers: controllers,
                    $transclude: transclude
                });
            };
        }
    }
    else if (di_1.isAnnotated(ddo.link)) {
        var linkFn = ddo.link;
        ddo.link = function (scope, iElement, iAttrs, controllers, transclude) {
            return $injector.invoke(linkFn, null, {
                $scope: scope,
                $element: iElement,
                $attrs: iAttrs,
                $controller: controllers,
                $controllers: controllers,
                $transclude: transclude
            });
        };
    }
    return ddo;
}
exports.inFactory = inFactory;
/**
 * @internal
 */
function makeDirectiveFactory(directiveClass) {
    var ddo = makeDirectiveDO(directiveClass);
    var factory = di_1.injectable(['$injector'], function directiveFactory($injector) {
        return inFactory(ddo, $injector);
    });
    return {
        name: ddo.imperativeName,
        factory: factory
    };
}
exports.makeDirectiveFactory = makeDirectiveFactory;
var _a;
},{"./assert":1,"./di":"tng/di","./reflection":2,"./utils":6}],"tng/di":[function(require,module,exports){
/// <reference path="./_references.ts" />
/**
 * Annotates a function with information of dependencies to be injected as parameters
 *
 * * Overrides previous annotation (logs warning)
 * * All parameters should be annotated (logs warning)
 * * Dependencies will be injected in the order they are specified in the dependencies parameter
 *
 * @param dependencies Names of the dependencies to be injected, in order
 * @returns The provided function
 */
function injectable(dependencies, func) {
    // TODO warn about overriding annotation
    // TODO warn about mismatching number of parameters and dependencies
    func.$inject = dependencies.slice();
    return func;
}
exports.injectable = injectable;
/**
 * Binds a function to a context and preservers it's annotated dependencies
 *
 * @param func The function to be bound
 * @param context The object to which bind the funcion
 * @returns A bound function
 */
function safeBind(func, context) {
    var bound = func.bind(context);
    if (func.$inject) {
        bound.$inject = func.$inject;
    }
    return bound;
}
exports.safeBind = safeBind;
/**
 * A decorator to annotate method parameterss with dependencies to be injected
 *
 * * Overrides previous annotation (logs warning)
 * * All parameters should be annotated (logs warning)
 *
 * @param dependency The name of the dependency to be injected
 */
function Inject(dependency) {
    return function (target, propertyKey, parameterIndex) {
        // TODO warn about overriding annotation
        // TODO warn about mismatching number of parameters and dependencies
        // If propertyKey is defined, we're decorating a parameter of a method
        // If not, we're decorating a parameter of class constructor
        target = (typeof propertyKey == 'undefined') ? target : target = target[propertyKey];
        // TODO what about missing elements in the $inject array?
        // ie. annotated the 2nd but not the 1st parameter
        var $inject = (target.$inject = target.$inject || []);
        $inject[parameterIndex] = dependency;
    };
}
exports.Inject = Inject;
/**
 * Inspects a function for dependency injection annotation
 *
 * @param func The object to be inspected
 */
function isAnnotated(func) {
    return func && func.hasOwnProperty('$inject');
}
exports.isAnnotated = isAnnotated;
},{}],"tng/filter":[function(require,module,exports){
/// <reference path="./_references.ts" />
var reflection_1 = require('./reflection');
var utils_1 = require('./utils');
var di_1 = require('./di');
/**
 * @internal
 */
var FilterAnnotation = (function () {
    function FilterAnnotation(options) {
        this.name = void 0;
        this.stateful = void 0;
        utils_1.setIfInterface(this, options);
    }
    return FilterAnnotation;
})();
exports.FilterAnnotation = FilterAnnotation;
/**
 * A decorator to annotate a class as being a filter
 */
exports.Filter = utils_1.makeDecorator(FilterAnnotation);
/**
 * @internal
 */
function registerFilter(filterClass, ngModule) {
    // Reflect.decorate apply decorators reversely, so we need to reverse
    // the extracted annotations before merging them
    // var aux = getAnnotations(filterClass, FilterAnnotation).reverse();
    var aux = reflection_1.getAnnotations(filterClass, FilterAnnotation);
    if (!aux.length) {
        throw new Error("Filter annotation not found");
    }
    var notes = reflection_1.mergeAnnotations.apply(void 0, [utils_1.create(FilterAnnotation)].concat(aux));
    if (!utils_1.isFunction(filterClass.prototype.filter)) {
        throw new Error("Filter \"" + notes.name + "\" does not implement a filter method");
    }
    ngModule.filter(notes.name, di_1.injectable(['$injector'], function ($injector) {
        var filterSingleton = $injector.instantiate(filterClass);
        var boundFilterMethod = filterSingleton.filter.bind(filterSingleton);
        if (notes.stateful) {
            boundFilterMethod.$stateful = true;
        }
        return boundFilterMethod;
    }));
}
exports.registerFilter = registerFilter;
},{"./di":"tng/di","./reflection":2,"./utils":6}],"tng/module":[function(require,module,exports){
/// <reference path="./_references.ts" />
// TODO debug only?
var assert_1 = require('./assert');
var reflection_1 = require('./reflection');
var utils_1 = require('./utils');
var di_1 = require('./di');
var utils_2 = require('./utils');
var value_1 = require('./value');
var constant_1 = require('./constant');
var filter_1 = require('./filter');
var animation_1 = require('./animation');
var service_1 = require('./service');
var decorator_1 = require('./decorator');
var directive_1 = require('./directive');
var component_1 = require('./component');
var states_1 = require('./ui/router/states');
var routes_1 = require('./ui/router/routes');
var PUBLISHED_ANNOTATION_KEY = 'tng:module-published-as';
/**
 * @internal
 */
var ModuleAnnotation = (function () {
    // modules: (string|Function)[] = void 0;
    // components: Function[] = void 0;
    // services: Function[] = void 0;
    // filters: Function[] = void 0;
    // decorators: Function[] = void 0;
    // animations: Function[] = void 0;
    // values: Function[] = void 0;
    // constants: Function[] = void 0;
    function ModuleAnnotation(options) {
        this.name = void 0;
        this.dependencies = void 0;
        this.config = void 0;
        this.run = void 0;
        utils_1.setIfInterface(this, options);
    }
    return ModuleAnnotation;
})();
exports.ModuleAnnotation = ModuleAnnotation;
/**
 * A decorator to annotate a class as being a module
 */
exports.Module = utils_1.makeDecorator(ModuleAnnotation);
var moduleCount = 0;
function getNewModuleName() {
    return "tng_generated_module#" + ++moduleCount;
}
/**
 * @internal
 */
function publishModule(moduleClass, name, dependencies, constructorParameters) {
    // Reflect.decorate apply decorators reversely, so we need to reverse
    // the extracted annotations before merging them
    // var aux = getAnnotations(moduleClass, ModuleAnnotation).reverse();
    var aux = reflection_1.getAnnotations(moduleClass, ModuleAnnotation);
    // TODO debug only?
    assert_1.assert.notEmpty(aux, 'Missing @Module decoration');
    // Has this module already been published?
    var publishedAs;
    if (publishedAs = reflection_1.Reflect.getOwnMetadata(PUBLISHED_ANNOTATION_KEY, moduleClass)) {
        return angular.module(publishedAs);
    }
    var annotation = reflection_1.mergeAnnotations.apply(void 0, [Object.create(null)].concat(aux));
    var constants = [];
    var values = [];
    var services = [];
    var decorators = [];
    var filters = [];
    var animations = [];
    var components = [];
    var directives = [];
    var modules = [];
    // TODO optimize this.. too much reflection queries
    function processDependency(dep) {
        // Regular angular module
        if (utils_2.isString(dep)) {
            modules.push(dep);
        }
        else if (utils_2.isArray(dep)) {
            for (var _i = 0, _a = dep; _i < _a.length; _i++) {
                var _dep = _a[_i];
                processDependency(_dep);
            }
        }
        else if (reflection_1.hasAnnotation(dep, ModuleAnnotation)) {
            // If the module has alrady been published, we just push it's name
            // if (publishedAs = Reflect.getOwnMetadata(PUBLISHED_ANNOTATION_KEY, dep)) {
            // modules.push(publishedAs);
            // }
            // else {
            modules.push(publishModule(dep).name);
        }
        else if (dep instanceof constant_1.ConstantWrapper) {
            constants.push(dep);
        }
        else if (dep instanceof value_1.ValueWrapper) {
            values.push(dep);
        }
        else if (reflection_1.hasAnnotation(dep, service_1.ServiceAnnotation)) {
            services.push(dep);
        }
        else if (reflection_1.hasAnnotation(dep, decorator_1.DecoratorAnnotation)) {
            decorators.push(dep);
        }
        else if (reflection_1.hasAnnotation(dep, filter_1.FilterAnnotation)) {
            filters.push(dep);
        }
        else if (reflection_1.hasAnnotation(dep, animation_1.AnimationAnnotation)) {
            animations.push(dep);
        }
        else if (reflection_1.hasAnnotation(dep, component_1.ComponentAnnotation)) {
            components.push(dep);
        }
        else if (reflection_1.hasAnnotation(dep, directive_1.DirectiveAnnotation)) {
            directives.push(dep);
        }
        else {
            // TODO WTF?
            throw new Error("I don't recognize what kind of dependency this is: " + dep);
        }
    }
    var allDeps = [].concat((annotation.dependencies || []), (dependencies || []));
    allDeps.forEach(function (dep) { return processDependency(dep); });
    name = name || annotation.name || getNewModuleName();
    // Register the module on Angular
    var ngModule = angular.module(name, modules);
    // Instantiate the module
    // var module = new moduleClass(ngModule);
    var module = Object.create(moduleClass.prototype);
    moduleClass.apply(module, [ngModule].concat(constructorParameters || []));
    // Register config functions
    var configFns = [];
    if (utils_2.isFunction(module.onConfig))
        configFns.push(di_1.safeBind(module.onConfig, module));
    if (annotation.config) {
        if (utils_2.isFunction(annotation.config))
            configFns.push(annotation.config);
        else if (utils_2.isArray(annotation.config))
            configFns = configFns.concat(annotation.config);
    }
    for (var _i = 0; _i < configFns.length; _i++) {
        var fn = configFns[_i];
        ngModule.config(fn);
    }
    // Register initialization functions
    var runFns = [];
    if (utils_2.isFunction(module.onRun))
        runFns.push(di_1.safeBind(module.onRun, module));
    if (annotation.run) {
        if (utils_2.isFunction(annotation.run))
            runFns.push(annotation.run);
        else if (utils_2.isArray(annotation.run))
            runFns = runFns.concat(annotation.run);
    }
    for (var _a = 0; _a < runFns.length; _a++) {
        var fn = runFns[_a];
        ngModule.run(fn);
    }
    states_1.publishStates(moduleClass, ngModule);
    routes_1.registerRoutes(moduleClass, ngModule);
    for (var _b = 0; _b < values.length; _b++) {
        var item = values[_b];
        value_1.publishValue(item, ngModule);
    }
    for (var _c = 0; _c < constants.length; _c++) {
        var item = constants[_c];
        constant_1.publishConstant(item, ngModule);
    }
    for (var _d = 0; _d < filters.length; _d++) {
        var item = filters[_d];
        filter_1.registerFilter(item, ngModule);
    }
    for (var _e = 0; _e < animations.length; _e++) {
        var item = animations[_e];
        animation_1.registerAnimation(item, ngModule);
    }
    for (var _f = 0; _f < services.length; _f++) {
        var item = services[_f];
        service_1.publishService(item, ngModule);
    }
    for (var _g = 0; _g < decorators.length; _g++) {
        var item = decorators[_g];
        decorator_1.publishDecorator(item, ngModule);
    }
    for (var _h = 0; _h < components.length; _h++) {
        var item = components[_h];
        component_1.publishComponent(item, ngModule);
    }
    for (var _j = 0; _j < directives.length; _j++) {
        var item = directives[_j];
        directive_1.publishDirective(item, ngModule);
    }
    reflection_1.Reflect.defineMetadata(PUBLISHED_ANNOTATION_KEY, name, moduleClass);
    return ngModule;
}
exports.publishModule = publishModule;
},{"./animation":"tng/animation","./assert":1,"./component":"tng/component","./constant":"tng/constant","./decorator":"tng/decorator","./di":"tng/di","./directive":"tng/directive","./filter":"tng/filter","./reflection":2,"./service":"tng/service","./ui/router/routes":"tng/ui/router/routes","./ui/router/states":"tng/ui/router/states","./utils":6,"./value":"tng/value"}],"tng/service":[function(require,module,exports){
/// <reference path="./_references" />
// TODO debug only?
var assert_1 = require('./assert');
var reflection_1 = require('./reflection');
var utils_1 = require('./utils');
/**
 * @internal
 */
var ServiceAnnotation = (function () {
    function ServiceAnnotation(options) {
        this.name = void 0;
        this.provider = void 0;
        this.factory = void 0;
        // TODO debug only?
        assert_1.assert.notNull(options, 'options must not be null');
        assert_1.assert.notEmpty(options.name, 'name cannot be null or empty');
        utils_1.setIfInterface(this, options);
    }
    return ServiceAnnotation;
})();
exports.ServiceAnnotation = ServiceAnnotation;
/**
 * A decorator to annotate a class as being a service
 */
exports.Service = utils_1.makeDecorator(ServiceAnnotation);
/**
 * @internal
 */
function publishService(serviceClass, ngModule, name) {
    // Reflect.decorate apply decorators reversely, so we need to reverse
    // the extracted annotations before merging them
    // var aux = getAnnotations(serviceClass, ServiceAnnotation).reverse();
    var aux = reflection_1.getAnnotations(serviceClass, ServiceAnnotation);
    // TODO debug only?
    assert_1.assert.notEmpty(aux, 'Did you decorate it with @Service?');
    var annotation = {};
    reflection_1.mergeAnnotations.apply(void 0, [annotation].concat(aux));
    var name = name != null ? name : annotation.name;
    if (annotation.provider) {
        ngModule.provider(name, annotation.provider);
    }
    else if (annotation.factory) {
        ngModule.factory(name, annotation.factory);
    }
    else {
        ngModule.service(name, serviceClass);
    }
    return ngModule;
}
exports.publishService = publishService;
},{"./assert":1,"./reflection":2,"./utils":6}],"tng/ui/bootstrap/modal":[function(require,module,exports){
/// <reference path="../../_references.ts" />
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
// TODO debug only?
var assert_1 = require('../../assert');
var di_1 = require('../../di');
var utils_1 = require('../../utils');
var reflection_1 = require('../../reflection');
var modal_view_1 = require('./modal-view');
var modal_view_2 = require('./modal-view');
exports.ModalView = modal_view_2.ModalView;
exports.ModalBackdrop = modal_view_2.ModalBackdrop;
/**
 * @internal
 */
var ModalAnnotation = (function () {
    function ModalAnnotation(options) {
        this.scope = void 0;
        this.bindToController = true; // defautls to true; differs from the original
        // resolve: Map<string|Function> = void 0; // It doesn't really support strings, as stated in the docs
        this.resolve = void 0;
        this.keyboard = void 0;
        this.dismissAll = void 0;
        utils_1.setIfInterface(this, options);
    }
    return ModalAnnotation;
})();
exports.ModalAnnotation = ModalAnnotation;
/**
 * A decorator to annotate a class as being a modal controller
 */
exports.Modal = utils_1.makeDecorator(ModalAnnotation);
/**
 * @internal
 */
var ModalHandler = (function () {
    function ModalHandler(modalNotes, viewNotes, settings) {
        this.modalNotes = modalNotes;
        this.viewNotes = viewNotes;
        this.settings = settings;
        this.instance = null;
    }
    ModalHandler.prototype.open = function ($injector, $modal, $modalStack) {
        var view = this.viewNotes;
        var modal = this.modalNotes;
        var calltimeSettings = angular.copy(this.settings);
        if (modal.dismissAll) {
            $modalStack.dismissAll();
        }
        if (utils_1.isDefined(modal.scope)) {
            calltimeSettings.scope = utils_1.isFunction(modal.scope) ?
                $injector.invoke(modal.scope) :
                modal.scope;
        }
        if (utils_1.isDefined(view.template)) {
            calltimeSettings.template = utils_1.isFunction(view.template) ?
                $injector.invoke(view.template) :
                view.template;
        }
        if (utils_1.isDefined(view.templateUrl)) {
            calltimeSettings.templateUrl = utils_1.isFunction(view.templateUrl) ?
                $injector.invoke(view.templateUrl) :
                view.templateUrl;
        }
        this.instance = $modal.open(calltimeSettings);
        return this.instance;
    };
    ModalHandler.prototype.dismiss = function ($modalStack) {
        if (this.modalNotes.dismissAll) {
            $modalStack.dismissAll();
        }
        else {
            this.instance.dismiss();
        }
    };
    __decorate([
        __param(0, di_1.Inject('$injector')),
        __param(1, di_1.Inject('$modal')),
        __param(2, di_1.Inject('$modalStack'))
    ], ModalHandler.prototype, "open", null);
    __decorate([
        __param(0, di_1.Inject('$modalStack'))
    ], ModalHandler.prototype, "dismiss", null);
    return ModalHandler;
})();
exports.ModalHandler = ModalHandler;
/**
 * @internal
 */
function getModalHandler(modalClass, scope) {
    var modalNotes = reflection_1.getAnnotations(modalClass, ModalAnnotation);
    var viewNotes = reflection_1.getAnnotations(modalClass, modal_view_1.ModalViewAnnotation);
    // TODO debug only?
    assert_1.assert(modalNotes, 'Missing @Modal decoration');
    assert_1.assert(viewNotes, 'Missing @ModalView decoration');
    var settings = {
        controller: modalClass
    };
    var modal = {};
    reflection_1.mergeAnnotations.apply(void 0, [modal].concat(modalNotes));
    // Deferred to be handled by ModalHandler to allow DI
    // if (isDefined(modal.scope)) {
    //     settings.scope = modal.scope;
    // }
    if (scope) {
        modal.scope = scope;
    }
    if (utils_1.isDefined(modal.bindToController)) {
        settings.bindToController = modal.bindToController;
    }
    if (utils_1.isDefined(modal.resolve)) {
        settings.resolve = modal.resolve;
    }
    if (utils_1.isDefined(modal.keyboard)) {
        settings.keyboard = modal.keyboard;
    }
    var view = {};
    reflection_1.mergeAnnotations.apply(void 0, [view].concat(viewNotes));
    if (utils_1.isDefined(view.animation)) {
        settings.animation = view.animation;
    }
    if (utils_1.isDefined(view.backdrop)) {
        settings.backdrop = modal_view_1.MODAL_BACKDROP_MAP[view.backdrop];
    }
    if (utils_1.isDefined(view.backdropClass)) {
        settings.backdropClass = view.backdropClass;
    }
    if (utils_1.isDefined(view.keyboard)) {
        settings.keyboard = view.keyboard;
    }
    if (utils_1.isDefined(view.windowClass)) {
        settings.windowClass = view.windowClass;
    }
    if (utils_1.isDefined(view.windowTemplateUrl)) {
        settings.windowTemplateUrl = view.windowTemplateUrl;
    }
    if (utils_1.isDefined(view.size)) {
        settings.size = view.size;
    }
    if (utils_1.isDefined(view.controllerAs)) {
        settings.controllerAs = view.controllerAs;
    }
    // Deferred to be handled by ModalHandler to allow DI
    // if (isDefined(view.templateUrl)) {
    //     settings.templateUrl = view.templateUrl;
    // }
    // Deferred to be handled by ModalHandler to allow DI
    // if (isDefined(view.template)) {
    //     settings.template = <string> view.template;
    // }
    // TODO styleUrl
    return new ModalHandler(modal, view, settings);
}
exports.getModalHandler = getModalHandler;
},{"../../assert":1,"../../di":"tng/di","../../reflection":2,"../../utils":6,"./modal-view":4}],"tng/ui/bootstrap":[function(require,module,exports){
/// <reference path="../../_references.ts" />
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var module_1 = require('../../module');
var modal_service_decorator_1 = require('./modal-service-decorator');
// export {Modal, ModalOptions} from './modal'
// export {ModalView, ModalBackdrop, ModalViewOptions} from './modal-view'
var TngUiBootstrapModule = (function () {
    function TngUiBootstrapModule() {
    }
    TngUiBootstrapModule = __decorate([
        module_1.Module({
            name: 'tng.ui.bootstrap',
            dependencies: [
                modal_service_decorator_1.ModalServiceDecorator
            ]
        })
    ], TngUiBootstrapModule);
    return TngUiBootstrapModule;
})();
exports.TngUiBootstrapModule = TngUiBootstrapModule;
},{"../../module":"tng/module","./modal-service-decorator":3}],"tng/ui/router/routes":[function(require,module,exports){
/// <reference path="../../_references.ts" />
var di_1 = require('../../di');
var utils_1 = require('../../utils');
var reflection_1 = require('../../reflection');
/**
 * @internal
 */
var RoutesAnnotation = (function () {
    function RoutesAnnotation(routes) {
        this.routes = routes;
    }
    return RoutesAnnotation;
})();
exports.RoutesAnnotation = RoutesAnnotation;
/**
 * A decorator to annotate a class with states
 */
exports.Routes = utils_1.makeDecorator(RoutesAnnotation);
/**
 * @internal
 */
function registerRoutes(moduleController, ngModule) {
    // Reflect.decorate apply decorators reversely, so we need to reverse
    // the extracted annotations before merging them
    // var notes = <RoutesAnnotation[]> getAnnotations(moduleController, RoutesAnnotation).reverse();
    var notes = reflection_1.getAnnotations(moduleController, RoutesAnnotation);
    if (!notes.length)
        return;
    var routes = {};
    notes.forEach(function (note) { return reflection_1.mergeAnnotations(routes, note.routes); });
    ngModule.config(di_1.injectable(['$urlRouterProvider'], function ($urlRouterProvider) {
        utils_1.forEach(routes, function (handler, route) {
            if (route === '?') {
                $urlRouterProvider.otherwise(handler);
            }
            else {
                $urlRouterProvider.when(route, handler);
            }
        });
    }));
}
exports.registerRoutes = registerRoutes;
},{"../../di":"tng/di","../../reflection":2,"../../utils":6}],"tng/ui/router/states":[function(require,module,exports){
/// <reference path="../../_references.ts" />
var di_1 = require('../../di');
var utils_1 = require('../../utils');
var reflection_1 = require('../../reflection');
var view_1 = require('../../view');
var events_1 = require('./events');
var modal_1 = require('../bootstrap/modal');
var view_2 = require('../../view');
exports.View = view_2.View;
var events_2 = require('./events');
exports.StateChangeEvent = events_2.StateChangeEvent;
exports.ViewLoadEvent = events_2.ViewLoadEvent;
/**
 * @internal
 */
var StatesAnnotation = (function () {
    function StatesAnnotation(states) {
        utils_1.forEach(states, function (state, name) { return state.name = name; });
        this.states = states;
    }
    return StatesAnnotation;
})();
exports.StatesAnnotation = StatesAnnotation;
/**
 * A decorator to annotate a class with states
 */
exports.States = utils_1.makeDecorator(StatesAnnotation);
exports.States.on = events_1.On;
/**
 * @internal
 */
function publishStates(moduleController, ngModule) {
    // Reflect.decorate apply decorators reversely, so we need to reverse
    // the extracted annotations to ge them on the original order
    // var statesAnnotation = <StatesAnnotation[]> getAnnotations(moduleController, StatesAnnotation).reverse();
    var statesAnnotation = reflection_1.getAnnotations(moduleController, StatesAnnotation);
    if (statesAnnotation.length) {
        var states = [];
        // Translate each state from each annotation and stack them in an array
        utils_1.forEach(statesAnnotation, function (note) {
            return utils_1.forEach(note.states, function (state) {
                return states.push(translateToUiState(state));
            });
        });
        ngModule.config(di_1.injectable(['$stateProvider'], function ($stateProvider) {
            for (var _i = 0; _i < states.length; _i++) {
                var state = states[_i];
                $stateProvider.state(state);
            }
        }));
    }
    events_1.publishListeners(moduleController, ngModule);
}
exports.publishStates = publishStates;
/**
 * @internal
 */
function translateToUiState(state) {
    var translatedState = {};
    if (utils_1.isDefined(state.name))
        translatedState.name = state.name;
    if (utils_1.isDefined(state.url))
        translatedState.url = state.url;
    if (utils_1.isDefined(state.abstract))
        translatedState.abstract = state.abstract;
    if (utils_1.isDefined(state.reloadOnSearch))
        translatedState.reloadOnSearch = state.reloadOnSearch;
    if (utils_1.isDefined(state.onEnter))
        translatedState.onEnter = state.onEnter;
    if (utils_1.isDefined(state.onExit))
        translatedState.onExit = state.onExit;
    if (utils_1.isDefined(state.resolve))
        translatedState.resolve = state.resolve;
    // If the state has a parent, we force the string way
    if (utils_1.isDefined(state.parent)) {
        var parent_1 = state.parent;
        if (!utils_1.isString(parent_1)) {
            parent_1 = parent_1.name;
        }
        // ng.ui.IState is missing parent
        translatedState.parent = parent_1;
    }
    // if (state.view && state.views) {
    //     throw Error('Cannot provide both view and views');
    // }
    // else if (!state.view && !state.views) {
    //     throw Error('Must provide either view or views');
    // }
    // else {
    if (state.view || state.views) {
        var views = {};
        if (state.view) {
            views[''] = extractViewData(state.view);
        }
        else {
            utils_1.forEach(state.views, function (controller, outlet) { return views[outlet] = extractViewData(controller); });
        }
        translatedState.views = views;
    }
    else if (state.modal) {
        var handler = modal_1.getModalHandler(state.modal);
        if (translatedState.onEnter) {
            var onEnter = translatedState.onEnter;
            translatedState.onEnter = di_1.injectable(['$injector'], function ($injector) {
                $injector.invoke(onEnter);
                $injector.invoke(handler.open, handler);
            });
        }
        else {
            translatedState.onEnter = di_1.safeBind(handler.open, handler);
        }
        if (translatedState.onExit) {
            var onExit = translatedState.onExit;
            translatedState.onExit = di_1.injectable(['$injector'], function ($injector) {
                $injector.invoke(handler.dismiss, handler);
                $injector.invoke(onExit);
            });
        }
        else {
            translatedState.onExit = di_1.safeBind(handler.dismiss, handler);
        }
    }
    return translatedState;
}
/**
 * @internal
 */
function extractViewData(viewModel) {
    // Reflect.decorate apply decorators reversely, so we need to reverse
    // the extracted annotations before merging them
    // let notes = getAnnotations(viewModel, ViewAnnotation).reverse();
    var notes = reflection_1.getAnnotations(viewModel, view_1.ViewAnnotation);
    if (!notes.length) {
        throw new Error('Template not defined');
    }
    var template = reflection_1.mergeAnnotations.apply(void 0, [{}].concat(notes));
    var data = {};
    data.controller = viewModel;
    if (template.controllerAs)
        data.controllerAs = template.controllerAs;
    if (template.template)
        data.template = template.template;
    if (template.templateUrl)
        data.templateUrl = template.templateUrl;
    // TODO style?
    return data;
}
},{"../../di":"tng/di","../../reflection":2,"../../utils":6,"../../view":"tng/view","../bootstrap/modal":"tng/ui/bootstrap/modal","./events":5}],"tng/value":[function(require,module,exports){
/// <reference path="./_references" />
// TODO debug only?
var assert_1 = require('./assert');
/**
 * A framework envelope for values
 */
var ValueWrapper = (function () {
    function ValueWrapper(_name, _value) {
        this._name = _name;
        this._value = _value;
    }
    Object.defineProperty(ValueWrapper.prototype, "name", {
        get: function () {
            return this._name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ValueWrapper.prototype, "value", {
        get: function () {
            return this._value;
        },
        enumerable: true,
        configurable: true
    });
    return ValueWrapper;
})();
exports.ValueWrapper = ValueWrapper;
/**
 * Wraps a value to be made available for dependency injection
 *
 * @param name The name of the value through which it will made available
 * @param value The value to be injected, as is
 *
 * @return A wrapper instance, to be used as a module dependency
 */
function Value(name, value) {
    // TODO debug only?
    assert_1.assert.notEmpty(name, 'name cannot be null or empty');
    return new ValueWrapper(name, value);
}
exports.Value = Value;
function publishValue(value, ngModule, name) {
    // TODO debug only?
    assert_1.assert(value instanceof ValueWrapper, 'constant must be a ConstantWrapper');
    name = name != null ? name : value.name;
    ngModule.value(name, value.value);
    return ngModule;
}
exports.publishValue = publishValue;
},{"./assert":1}],"tng/view":[function(require,module,exports){
/// <reference path="./_references.ts" />
// TODO debug only?
var assert_1 = require('./assert');
var utils_1 = require('./utils');
/**
 * @internal
 */
var ViewAnnotation = (function () {
    function ViewAnnotation(options) {
        this.template = void 0;
        this.templateUrl = void 0;
        this.styles = void 0;
        // stylesUrls: string[] = void 0;
        this.controllerAs = void 0;
        // TODO debug only?
        assert_1.assert.notNull(options, 'options must not be null');
        assert_1.assert.notEmpty(options.controllerAs, 'controllerAs cannot be null or empty');
        utils_1.setIfInterface(this, options);
    }
    return ViewAnnotation;
})();
exports.ViewAnnotation = ViewAnnotation;
/**
 * A decorator to annotate a controller with view information
 */
exports.View = utils_1.makeDecorator(ViewAnnotation);
},{"./assert":1,"./utils":6}],"tng":[function(require,module,exports){
var di_1 = require('./di');
exports.Inject = di_1.Inject;
exports.injectable = di_1.injectable;
var value_1 = require('./value');
exports.Value = value_1.Value;
var constant_1 = require('./constant');
exports.Constant = constant_1.Constant;
var filter_1 = require('./filter');
exports.Filter = filter_1.Filter;
var animation_1 = require('./animation');
exports.Animation = animation_1.Animation;
var service_1 = require('./service');
exports.Service = service_1.Service;
var decorator_1 = require('./decorator');
exports.Decorator = decorator_1.Decorator;
var view_1 = require('./view');
exports.View = view_1.View;
var component_view_1 = require('./component-view');
exports.ComponentView = component_view_1.ComponentView;
exports.ComponentTemplateNamespace = component_view_1.ComponentTemplateNamespace;
var directive_1 = require('./directive');
exports.Directive = directive_1.Directive;
exports.Transclusion = directive_1.Transclusion;
exports.Bind = directive_1.Bind;
var component_1 = require('./component');
exports.Component = component_1.Component;
var module_1 = require('./module');
exports.Module = module_1.Module;
exports.publishModule = module_1.publishModule;
var application_1 = require('./application');
exports.Application = application_1.Application;
var bootstrap_1 = require('./bootstrap');
exports.bootstrap = bootstrap_1.bootstrap;
},{"./animation":"tng/animation","./application":"tng/application","./bootstrap":"tng/bootstrap","./component":"tng/component","./component-view":"tng/component-view","./constant":"tng/constant","./decorator":"tng/decorator","./di":"tng/di","./directive":"tng/directive","./filter":"tng/filter","./module":"tng/module","./service":"tng/service","./value":"tng/value","./view":"tng/view"}]},{},[])


//# sourceMappingURL=tng.js.map
