require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/// <reference path="../_references" />
var utils_1 = require('../utils');
var reflection_1 = require('../reflection');
var di_1 = require('../di');
(function (StateChangeEvent) {
    StateChangeEvent[StateChangeEvent["STATE_CHANGE_START"] = 0] = "STATE_CHANGE_START";
    StateChangeEvent[StateChangeEvent["STATE_CHANGE_SUCCESS"] = 1] = "STATE_CHANGE_SUCCESS";
    StateChangeEvent[StateChangeEvent["STATE_CHANGE_ERROR"] = 2] = "STATE_CHANGE_ERROR";
})(exports.StateChangeEvent || (exports.StateChangeEvent = {}));
var StateChangeEvent = exports.StateChangeEvent;
(function (ViewLoadEvent) {
    ViewLoadEvent[ViewLoadEvent["VIEW_CONTENT_LOADING"] = 4] = "VIEW_CONTENT_LOADING";
    ViewLoadEvent[ViewLoadEvent["VIEW_CONTENT_LOADED"] = 5] = "VIEW_CONTENT_LOADED";
})(exports.ViewLoadEvent || (exports.ViewLoadEvent = {}));
var ViewLoadEvent = exports.ViewLoadEvent;
var EVENTS_MAP = [
    '$stateChangeStart',
    '$stateChangeSuccess',
    '$stateChangeError',
    '$stateNotFound',
    '$viewContentLoading',
    '$viewContentLoaded'
];
var UiRouterEventListenerAnnotation = (function () {
    function UiRouterEventListenerAnnotation(event, handler) {
        this.event = event;
        this.handler = handler;
    }
    return UiRouterEventListenerAnnotation;
})();
exports.UiRouterEventListenerAnnotation = UiRouterEventListenerAnnotation;
exports.On = utils_1.makeDecorator(UiRouterEventListenerAnnotation);
function publishListeners(moduleController, ngModule) {
    var listenerNotes = reflection_1.getAnnotations(moduleController, UiRouterEventListenerAnnotation).reverse();
    if (listenerNotes.length) {
        ngModule.run(di_1.bind(['$rootScope'], function ($rootScope) {
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

},{"../di":"tng/di","../reflection":"tng/reflection","../utils":"tng/utils"}],"tng/animation":[function(require,module,exports){
/// <reference path="./_references" />
var reflection_1 = require('./reflection');
var di_1 = require('./di');
var utils_1 = require('./utils');
var utils_2 = require('./utils');
var AnimationAnnotation = (function () {
    function AnimationAnnotation(options) {
        this.name = null;
        utils_1.setIfInterface(this, options);
    }
    return AnimationAnnotation;
})();
exports.AnimationAnnotation = AnimationAnnotation;
exports.Animation = utils_1.makeDecorator(AnimationAnnotation);
function registerAnimation(animationClass, ngModule) {
    var aux = reflection_1.getAnnotations(animationClass, AnimationAnnotation).reverse();
    if (!aux.length) {
        throw new Error("Filter annotation not found");
    }
    var name = reflection_1.mergeAnnotations.apply(void 0, [utils_2.create(AnimationAnnotation)].concat(aux)).name;
    ngModule.animation(name, di_1.bind(['$injector'], function ($injector) {
        var singleton = $injector.instantiate(animationClass);
        utils_2.bindAll(singleton);
        return singleton;
    }));
}
exports.registerAnimation = registerAnimation;

},{"./di":"tng/di","./reflection":"tng/reflection","./utils":"tng/utils"}],"tng/application":[function(require,module,exports){
/// <reference path="./_references" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var assert_1 = require('./assert');
var utils_1 = require('./utils');
var module_1 = require('./module');
var ApplicationAnnotation = (function (_super) {
    __extends(ApplicationAnnotation, _super);
    function ApplicationAnnotation(elementOroptions) {
        _super.call(this, options);
        this.element = void 0;
        var options = utils_1.isElement(elementOroptions) ? { element: elementOroptions } : elementOroptions;
        assert_1.assert(options && options.element, 'element must be provided');
        utils_1.setIfInterface(this, options);
    }
    return ApplicationAnnotation;
})(module_1.ModuleAnnotation);
exports.ApplicationAnnotation = ApplicationAnnotation;
exports.Application = utils_1.makeDecorator(ApplicationAnnotation);

},{"./assert":"tng/assert","./module":"tng/module","./utils":"tng/utils"}],"tng/assert":[function(require,module,exports){
/// <reference path="./_references" />
var utils_1 = require('./utils');
var slice = Array.prototype.slice;
function AssertionError(message) {
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

},{"./utils":"tng/utils"}],"tng/bootstrap":[function(require,module,exports){
/// <reference path="./_references" />
var assert_1 = require('./assert');
var reflection_1 = require('./reflection');
var module_1 = require('./module');
function bootstrap(moduleClass, element) {
    var aux = reflection_1.getAnnotations(moduleClass, module_1.ModuleAnnotation).reverse();
    assert_1.assert.notEmpty(aux, 'Missing @Application or @Module decoration');
    var annotation = reflection_1.mergeAnnotations.apply(void 0, [{}].concat(aux));
    element = element || annotation.element;
    assert_1.assert(element, 'element must be provided');
    var ngModule = module_1.publishModule(moduleClass);
    return angular.bootstrap(element, [ngModule.name]);
}
exports.bootstrap = bootstrap;

},{"./assert":"tng/assert","./module":"tng/module","./reflection":"tng/reflection"}],"tng/component-view":[function(require,module,exports){
/// <reference path="./_references" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var utils_1 = require('./utils');
var view_1 = require('./view');
(function (ComponentTemplateNamespace) {
    ComponentTemplateNamespace[ComponentTemplateNamespace["HTML"] = 0] = "HTML";
    ComponentTemplateNamespace[ComponentTemplateNamespace["SVG"] = 1] = "SVG";
    ComponentTemplateNamespace[ComponentTemplateNamespace["MathML"] = 2] = "MathML";
})(exports.ComponentTemplateNamespace || (exports.ComponentTemplateNamespace = {}));
var ComponentTemplateNamespace = exports.ComponentTemplateNamespace;
exports.NAMESPACE_MAP = ['html', 'svg', 'math'];
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
exports.ComponentView = utils_1.makeDecorator(ComponentViewAnnotation);

},{"./utils":"tng/utils","./view":"tng/view"}],"tng/component":[function(require,module,exports){
/// <reference path="./_references" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var assert_1 = require('./assert');
var di_1 = require('./di');
var utils_1 = require('./utils');
var reflection_1 = require('./reflection');
var view_1 = require('./view');
var component_view_1 = require('./component-view');
var directive_1 = require('./directive');
var directive_2 = require('./directive');
var ComponentAnnotation = (function (_super) {
    __extends(ComponentAnnotation, _super);
    function ComponentAnnotation() {
        _super.apply(this, arguments);
    }
    return ComponentAnnotation;
})(directive_1.CommonDirectiveAnnotation);
exports.ComponentAnnotation = ComponentAnnotation;
exports.Component = utils_1.makeDecorator(ComponentAnnotation);
function publishComponent(componentClass, ngModule, selector) {
    assert_1.assert(reflection_1.hasAnnotation(componentClass, ComponentAnnotation), 'Missing @Component decoration');
    assert_1.assert(reflection_1.hasAnnotation(componentClass, view_1.ViewAnnotation), 'Missing @View decoration');
    var _a = makeComponentFactory(componentClass), name = _a.name, factory = _a.factory;
    ngModule.directive(name, factory);
    return ngModule;
}
exports.publishComponent = publishComponent;
function makeComponentDO(componentClass) {
    var cdo = directive_2.makeCommonDO(componentClass);
    var aux = reflection_1.getAnnotations(componentClass, component_view_1.ComponentViewAnnotation).reverse();
    var view = {};
    reflection_1.mergeAnnotations.apply(void 0, [view].concat(aux));
    if (view.controllerAs != null) {
        cdo.controllerAs = view.controllerAs;
    }
    if (view.namespace != null) {
        cdo.templateNamespace = component_view_1.NAMESPACE_MAP[view.namespace];
    }
    if (view.template != null) {
        cdo.template = view.template;
    }
    else if (view.templateUrl != null) {
        cdo.templateUrl = view.templateUrl;
    }
    else {
        throw new Error('Component has no template. Use either template or templateUrl');
    }
    return cdo;
}
exports.makeComponentDO = makeComponentDO;
function inFactory(cdo, $injector) {
    if (utils_1.isFunction(cdo.template)) {
        cdo.template = !di_1.hasInjectAnnotation(cdo.template) ? cdo.template : function (tElement, tAttrs) {
            return $injector.invoke(cdo.template, null, {
                element: tElement,
                attributes: tAttrs
            });
        };
    }
    if (utils_1.isFunction(cdo.templateUrl)) {
        cdo.templateUrl = !di_1.hasInjectAnnotation(cdo.templateUrl) ? cdo.templateUrl : function (tElement, tAttrs) {
            return $injector.invoke(cdo.templateUrl, null, {
                element: tElement,
                attributes: tAttrs
            });
        };
    }
    return cdo;
}
exports.inFactory = inFactory;
function makeComponentFactory(componentClass) {
    var cdo = makeComponentDO(componentClass);
    var factory = di_1.bind(['$injector'], function directiveFactory($injector) {
        return inFactory(directive_2.inFactory(cdo, $injector), $injector);
    });
    return {
        name: cdo.imperativeName,
        factory: factory
    };
}
exports.makeComponentFactory = makeComponentFactory;

},{"./assert":"tng/assert","./component-view":"tng/component-view","./di":"tng/di","./directive":"tng/directive","./reflection":"tng/reflection","./utils":"tng/utils","./view":"tng/view"}],"tng/constant":[function(require,module,exports){
/// <reference path="./_references" />
var assert_1 = require('./assert');
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
function Constant(name, value) {
    assert_1.assert.notEmpty(name, 'name cannot be null or empty');
    return new ConstantWrapper(name, value);
}
exports.Constant = Constant;
function publishConstant(constant, ngModule, name) {
    assert_1.assert(constant instanceof ConstantWrapper, 'constant must be a ConstantWrapper');
    name = name != null ? name : constant.name;
    ngModule.constant(name, constant.value);
    return ngModule;
}
exports.publishConstant = publishConstant;

},{"./assert":"tng/assert"}],"tng/controller":[function(require,module,exports){
/// <reference path="./_references" />

},{}],"tng/decorator":[function(require,module,exports){
/// <reference path="./_references" />
var di_1 = require('./di');
var reflection_1 = require('./reflection');
var utils_1 = require('./utils');
var DecoratorAnnotation = (function () {
    function DecoratorAnnotation(options) {
        this.name = null;
        utils_1.setIfInterface(this, options);
    }
    return DecoratorAnnotation;
})();
exports.DecoratorAnnotation = DecoratorAnnotation;
exports.Decorator = utils_1.makeDecorator(DecoratorAnnotation);
function publishDecorator(decoratorClass, ngModule, name) {
    var aux = reflection_1.getAnnotations(decoratorClass, DecoratorAnnotation).reverse();
    if (!aux.length) {
        throw new Error("Decorator annotation not found");
    }
    var annotation = reflection_1.mergeAnnotations.apply(void 0, [utils_1.create(DecoratorAnnotation)].concat(aux));
    name = name != null ? name : annotation.name;
    if (!utils_1.isFunction(decoratorClass.prototype.decorate)) {
        throw new Error("Decorator \"" + name + "\" does not implement a decorate method");
    }
    ngModule.config(di_1.bind(['$provide'], function ($provide) {
        $provide.decorator(name, di_1.bind(['$delegate', '$injector'], function ($delegate, $injector) {
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

},{"./di":"tng/di","./reflection":"tng/reflection","./utils":"tng/utils"}],"tng/directive":[function(require,module,exports){
/// <reference path="./_references" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var assert_1 = require('./assert');
var di_1 = require('./di');
var utils_1 = require('./utils');
var utils_2 = require('./utils');
var reflection_1 = require('./reflection');
(function (Transclusion) {
    Transclusion[Transclusion["Content"] = 0] = "Content";
    Transclusion[Transclusion["Element"] = 1] = "Element";
})(exports.Transclusion || (exports.Transclusion = {}));
var Transclusion = exports.Transclusion;
var TRANSCLUSION_MAP = [true, 'element'];
var CommonDirectiveAnnotation = (function () {
    function CommonDirectiveAnnotation(options) {
        this.selector = void 0;
        this.scope = void 0;
        this.bind = void 0;
        this.require = void 0;
        this.transclude = void 0;
        this.compile = void 0;
        this.link = void 0;
        assert_1.assert.notNull(options, 'options must not be null');
        assert_1.assert.notEmpty(options.selector, 'selector must not be null or empty');
        utils_1.setIfInterface(this, options);
    }
    return CommonDirectiveAnnotation;
})();
exports.CommonDirectiveAnnotation = CommonDirectiveAnnotation;
var DirectiveAnnotation = (function (_super) {
    __extends(DirectiveAnnotation, _super);
    function DirectiveAnnotation(options) {
        _super.call(this, options);
        this.multiElement = void 0;
        this.priority = void 0;
        this.terminal = void 0;
        utils_1.setIfInterface(this, options);
    }
    return DirectiveAnnotation;
})(CommonDirectiveAnnotation);
exports.DirectiveAnnotation = DirectiveAnnotation;
exports.Directive = utils_1.makeDecorator(DirectiveAnnotation);
function publishDirective(directiveClass, ngModule, selector) {
    assert_1.assert(reflection_1.hasAnnotation(directiveClass, DirectiveAnnotation), 'Did you decorate it with @Directive?');
    var _a = makeDirectiveFactory(directiveClass), name = _a.name, factory = _a.factory;
    ngModule.directive(name, factory);
    return ngModule;
}
exports.publishDirective = publishDirective;
var RESTRICTION_MAP = (_a = {},
    _a[0] = 'A',
    _a[2] = 'E',
    _a[1] = 'C',
    _a
);
function makeCommonDO(directiveClass) {
    var aux = reflection_1.getAnnotations(directiveClass, CommonDirectiveAnnotation).reverse();
    var annotation = {};
    reflection_1.mergeAnnotations.apply(void 0, [annotation].concat(aux));
    var selectorData = utils_2.parseSelector(annotation.selector);
    var ddo = {
        semanticName: selectorData.semanticeName,
        imperativeName: selectorData.imperativeName,
        restrict: RESTRICTION_MAP[selectorData.type],
        controller: directiveClass
    };
    if (annotation.scope != null)
        ddo.scope = annotation.scope;
    if (annotation.bind != null)
        ddo.bindToController = annotation.bind;
    if (annotation.transclude != null)
        ddo.transclude = TRANSCLUSION_MAP[annotation.transclude];
    if (annotation.compile != null)
        ddo.compile = annotation.compile;
    if (annotation.link != null)
        ddo.link = annotation.link;
    return ddo;
}
exports.makeCommonDO = makeCommonDO;
function makeDirectiveDO(directiveClass) {
    var ddo = makeCommonDO(directiveClass);
    var aux = reflection_1.getAnnotations(directiveClass, DirectiveAnnotation).reverse();
    var annotation = {};
    reflection_1.mergeAnnotations.apply(void 0, [annotation].concat(aux));
    if (annotation.multiElement != null)
        ddo.multiElement = annotation.multiElement;
    if (annotation.priority != null)
        ddo.priority = annotation.priority;
    if (annotation.terminal != null)
        ddo.terminal = annotation.terminal;
    return ddo;
}
exports.makeDirectiveDO = makeDirectiveDO;
function inFactory(ddo, $injector) {
    if (utils_1.isFunction(ddo.compile)) {
        ddo.compile = !di_1.hasInjectAnnotation(ddo.compile) ? ddo.compile :
            function (tElement, tAttrs, transclude) {
                return $injector.invoke(ddo.compile, null, {
                    element: tElement,
                    attributes: tAttrs,
                    transclude: transclude
                });
            };
    }
    if (utils_1.isFunction(ddo.link)) {
        ddo.link = !di_1.hasInjectAnnotation(ddo.link) ? ddo.link :
            function (scope, iElement, iAttrs, controllers, transclude) {
                return $injector.invoke(ddo.link, null, {
                    scope: scope,
                    element: iElement,
                    attributes: iAttrs,
                    controller: controllers,
                    transclude: transclude
                });
            };
    }
    return ddo;
}
exports.inFactory = inFactory;
function makeDirectiveFactory(directiveClass) {
    var ddo = makeDirectiveDO(directiveClass);
    var factory = di_1.bind(['$injector'], function directiveFactory($injector) {
        return inFactory(ddo, $injector);
    });
    return {
        name: ddo.imperativeName,
        factory: factory
    };
}
exports.makeDirectiveFactory = makeDirectiveFactory;
var _a;

},{"./assert":"tng/assert","./di":"tng/di","./reflection":"tng/reflection","./utils":"tng/utils"}],"tng/di":[function(require,module,exports){
/// <reference path="./_references" />
function bind(dependencies, func) {
    // TODO warn about overriding annotation
    // TODO warn about mismatching number of parameters and dependencies
    func.$inject = dependencies.slice();
    return func;
}
exports.bind = bind;
function Inject(dependency) {
    return function (target, propertyKey, parameterIndex) {
        // TODO warn about overriding annotation
        // TODO warn about mismatching number of parameters and dependencies
        target = (typeof propertyKey == 'undefined') ? target : target = target[propertyKey];
        var $inject = (target.$inject = target.$inject || []);
        $inject[parameterIndex] = dependency;
    };
}
exports.Inject = Inject;
function hasInjectAnnotation(target) {
    return !target ? false : target.hasOwnProperty('$inject');
}
exports.hasInjectAnnotation = hasInjectAnnotation;

},{}],"tng/filter":[function(require,module,exports){
/// <reference path="./_references" />
var reflection_1 = require('./reflection');
var utils_1 = require('./utils');
var di_1 = require('./di');
var FilterAnnotation = (function () {
    function FilterAnnotation(options) {
        this.name = null;
        utils_1.setIfInterface(this, options);
    }
    return FilterAnnotation;
})();
exports.FilterAnnotation = FilterAnnotation;
exports.Filter = utils_1.makeDecorator(FilterAnnotation);
function registerFilter(filterClass, ngModule) {
    var aux = reflection_1.getAnnotations(filterClass, FilterAnnotation).reverse();
    if (!aux.length) {
        throw new Error("Filter annotation not found");
    }
    var name = reflection_1.mergeAnnotations.apply(void 0, [utils_1.create(FilterAnnotation)].concat(aux)).name;
    if (!utils_1.isFunction(filterClass.prototype.filter)) {
        throw new Error("Filter \"" + name + "\" does not implement a filter method");
    }
    ngModule.filter(name, di_1.bind(['$injector'], function ($injector) {
        var filterSingleton = $injector.instantiate(filterClass);
        return filterSingleton.filter.bind(filterSingleton);
    }));
}
exports.registerFilter = registerFilter;

},{"./di":"tng/di","./reflection":"tng/reflection","./utils":"tng/utils"}],"tng/module":[function(require,module,exports){
/// <reference path="./_references" />
var assert_1 = require('./assert');
var reflection_1 = require('./reflection');
var utils_1 = require('./utils');
var utils_2 = require('./utils');
var value_1 = require('./value');
var constant_1 = require('./constant');
var filter_1 = require('./filter');
var animation_1 = require('./animation');
var service_1 = require('./service');
var decorator_1 = require('./decorator');
var directive_1 = require('./directive');
var component_1 = require('./component');
var states_1 = require('./ui-router/states');
var routes_1 = require('./ui-router/routes');
var PUBLISHED_ANNOTATION_KEY = 'tng:module-published-as';
var ModuleAnnotation = (function () {
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
exports.Module = utils_1.makeDecorator(ModuleAnnotation);
var moduleCount = 0;
function getNewModuleName() {
    return "tng_generated_module#" + ++moduleCount;
}
function publishModule(moduleClass, name) {
    var aux = reflection_1.getAnnotations(moduleClass, ModuleAnnotation).reverse();
    assert_1.assert.notEmpty(aux, 'Missing @Module decoration');
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
    if (annotation.dependencies) {
        for (var _i = 0, _a = annotation.dependencies; _i < _a.length; _i++) {
            var dep = _a[_i];
            if (utils_2.isString(dep)) {
                modules.push(dep);
            }
            else if (reflection_1.hasAnnotation(dep, ModuleAnnotation)) {
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
                throw new Error("I don't recognize what kind of dependency this is: " + dep);
            }
        }
    }
    name = name || annotation.name || getNewModuleName();
    var ngModule = angular.module(name, modules);
    var module = new moduleClass(ngModule);
    var configFns = [];
    if (utils_2.isFunction(module.onConfig))
        configFns.push(utils_2.safeBind(module.onConfig, module));
    if (annotation.config) {
        if (utils_2.isFunction(annotation.config))
            configFns.push(annotation.config);
        else if (utils_2.isArray(annotation.config))
            configFns = configFns.concat(annotation.config);
    }
    for (var _b = 0; _b < configFns.length; _b++) {
        var fn = configFns[_b];
        ngModule.config(fn);
    }
    var runFns = [];
    if (utils_2.isFunction(module.onRun))
        runFns.push(utils_2.safeBind(module.onRun, module));
    if (annotation.run) {
        if (utils_2.isFunction(annotation.run))
            runFns.push(annotation.run);
        else if (utils_2.isArray(annotation.run))
            runFns = runFns.concat(annotation.run);
    }
    for (var _c = 0; _c < runFns.length; _c++) {
        var fn = runFns[_c];
        ngModule.run(fn);
    }
    states_1.publishStates(moduleClass, ngModule);
    routes_1.registerRoutes(moduleClass, ngModule);
    for (var _d = 0; _d < values.length; _d++) {
        var item = values[_d];
        value_1.publishValue(item, ngModule);
    }
    for (var _e = 0; _e < constants.length; _e++) {
        var item = constants[_e];
        constant_1.publishConstant(item, ngModule);
    }
    for (var _f = 0; _f < filters.length; _f++) {
        var item = filters[_f];
        filter_1.registerFilter(item, ngModule);
    }
    for (var _g = 0; _g < animations.length; _g++) {
        var item = animations[_g];
        animation_1.registerAnimation(item, ngModule);
    }
    for (var _h = 0; _h < services.length; _h++) {
        var item = services[_h];
        service_1.publishService(item, ngModule);
    }
    for (var _j = 0; _j < decorators.length; _j++) {
        var item = decorators[_j];
        decorator_1.publishDecorator(item, ngModule);
    }
    for (var _k = 0; _k < components.length; _k++) {
        var item = components[_k];
        component_1.publishComponent(item, ngModule);
    }
    for (var _l = 0; _l < directives.length; _l++) {
        var item = directives[_l];
        directive_1.publishDirective(item, ngModule);
    }
    reflection_1.Reflect.defineMetadata(PUBLISHED_ANNOTATION_KEY, name, moduleClass);
    return ngModule;
}
exports.publishModule = publishModule;

},{"./animation":"tng/animation","./assert":"tng/assert","./component":"tng/component","./constant":"tng/constant","./decorator":"tng/decorator","./directive":"tng/directive","./filter":"tng/filter","./reflection":"tng/reflection","./service":"tng/service","./ui-router/routes":"tng/ui-router/routes","./ui-router/states":"tng/ui-router/states","./utils":"tng/utils","./value":"tng/value"}],"tng/reflection":[function(require,module,exports){
/// <reference path="./_references" />
var utils_1 = require('./utils');
exports.ANNOTATIONS_METADATA_KEY = 'tng';
var _Reflect = Reflect;
exports.Reflect = _Reflect;
function getKey(key) {
    return !key ? exports.ANNOTATIONS_METADATA_KEY : exports.ANNOTATIONS_METADATA_KEY + ":" + key;
}
function getAnnotations(target, type, key) {
    var annotations = Reflect.getOwnMetadata(getKey(key), target) || [];
    if (type) {
        return annotations.filter(function (value) { return value instanceof type; });
    }
    return annotations;
}
exports.getAnnotations = getAnnotations;
function setAnnotations(target, annotations, key) {
    Reflect.defineMetadata(getKey(key), annotations, target);
}
exports.setAnnotations = setAnnotations;
function addAnnotation(target, annotation, key) {
    var annotations = getAnnotations(target, null, key);
    annotations.push(annotation);
    setAnnotations(target, annotations, key);
}
exports.addAnnotation = addAnnotation;
function hasAnnotation(target, type, key) {
    if (!type) {
        return Reflect.hasOwnMetadata(getKey(key), target);
    }
    return getAnnotations(target, type, key).length > 0;
}
exports.hasAnnotation = hasAnnotation;
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
            if (utils_1.isDefined(value)) {
                dest[key] = value;
            }
        });
    }
    return dest;
}
exports.mergeAnnotations = mergeAnnotations;

},{"./utils":"tng/utils"}],"tng/service":[function(require,module,exports){
/// <reference path="./_references" />
var assert_1 = require('./assert');
var reflection_1 = require('./reflection');
var utils_1 = require('./utils');
var ServiceAnnotation = (function () {
    function ServiceAnnotation(options) {
        this.name = void 0;
        this.provider = void 0;
        this.factory = void 0;
        assert_1.assert.notNull(options, 'options must not be null');
        assert_1.assert.notEmpty(options.name, 'name cannot be null or empty');
        utils_1.setIfInterface(this, options);
    }
    return ServiceAnnotation;
})();
exports.ServiceAnnotation = ServiceAnnotation;
exports.Service = utils_1.makeDecorator(ServiceAnnotation);
function publishService(serviceClass, ngModule, name) {
    var aux = reflection_1.getAnnotations(serviceClass, ServiceAnnotation).reverse();
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

},{"./assert":"tng/assert","./reflection":"tng/reflection","./utils":"tng/utils"}],"tng/ui-router/routes":[function(require,module,exports){
/// <reference path="../_references" />
var di_1 = require('../di');
var utils_1 = require('../utils');
var reflection_1 = require('../reflection');
var RoutesAnnotation = (function () {
    function RoutesAnnotation(routes) {
        this.routes = routes;
    }
    return RoutesAnnotation;
})();
exports.RoutesAnnotation = RoutesAnnotation;
exports.Routes = utils_1.makeDecorator(RoutesAnnotation);
function registerRoutes(moduleController, ngModule) {
    var notes = reflection_1.getAnnotations(moduleController, RoutesAnnotation).reverse();
    if (!notes.length)
        return;
    var routes = {};
    notes.forEach(function (note) { return reflection_1.mergeAnnotations(routes, note.routes); });
    ngModule.config(di_1.bind(['$urlRouterProvider'], function ($urlRouterProvider) {
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

},{"../di":"tng/di","../reflection":"tng/reflection","../utils":"tng/utils"}],"tng/ui-router/states":[function(require,module,exports){
/// <reference path="../_references" />
var di_1 = require('../di');
var utils_1 = require('../utils');
var reflection_1 = require('../reflection');
var view_1 = require('../view');
var events_1 = require('./events');
var StatesAnnotation = (function () {
    function StatesAnnotation(states) {
        utils_1.forEach(states, function (state, name) { return state.name = name; });
        this.states = states;
    }
    return StatesAnnotation;
})();
exports.StatesAnnotation = StatesAnnotation;
exports.States = utils_1.makeDecorator(StatesAnnotation);
exports.States.on = events_1.On;
function publishStates(moduleController, ngModule) {
    var statesAnnotation = reflection_1.getAnnotations(moduleController, StatesAnnotation).reverse();
    if (statesAnnotation.length) {
        var states = [];
        utils_1.forEach(statesAnnotation, function (note) {
            return utils_1.forEach(note.states, function (state) {
                return states.push(translateToUiState(state));
            });
        });
        ngModule.config(di_1.bind(['$stateProvider'], function ($stateProvider) {
            for (var _i = 0; _i < states.length; _i++) {
                var state = states[_i];
                $stateProvider.state(state);
            }
        }));
    }
    events_1.publishListeners(moduleController, ngModule);
}
exports.publishStates = publishStates;
function translateToUiState(state) {
    var translatedState = {};
    if (utils_1.isDefined(state.name))
        translatedState.name = state.name;
    if (utils_1.isDefined(state.url))
        translatedState.url = state.url;
    if (utils_1.isDefined(state.abstract))
        translatedState.abstract = state.abstract;
    if (utils_1.isDefined(state.parent)) {
        var parent_1 = state.parent;
        if (!utils_1.isString(parent_1)) {
            parent_1 = parent_1.name;
        }
        translatedState.parent = parent_1;
    }
    if (state.view && state.views) {
        throw Error('Cannot provide both view and views');
    }
    else if (!state.view && !state.views) {
        throw Error('Must provide either view or views');
    }
    else {
        var views = {};
        if (state.view) {
            views[''] = extractViewData(state.view);
        }
        else {
            utils_1.forEach(state.views, function (controller, outlet) { return views[outlet] = extractViewData(controller); });
        }
        translatedState.views = views;
    }
    return translatedState;
}
function extractViewData(viewModel) {
    var notes = reflection_1.getAnnotations(viewModel, view_1.ViewAnnotation).reverse();
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
    return data;
}

},{"../di":"tng/di","../reflection":"tng/reflection","../utils":"tng/utils","../view":"tng/view","./events":1}],"tng/ui-router":[function(require,module,exports){
var routes_1 = require('./ui-router/routes');
exports.Routes = routes_1.Routes;
var states_1 = require('./ui-router/states');
exports.States = states_1.States;

},{"./ui-router/routes":"tng/ui-router/routes","./ui-router/states":"tng/ui-router/states"}],"tng/utils":[function(require,module,exports){
/// <reference path="./_references" />
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
    SelectorType[SelectorType["Tag"] = 2] = "Tag";
})(exports.SelectorType || (exports.SelectorType = {}));
var SelectorType = exports.SelectorType;
;
var RE_SELECTOR_ATTRIBUTE = /^\[([a-z\-_]+)\]$/i;
var RE_SELECTOR_CLASS = /^\.([a-z\-_]+)$/i;
var RE_SELECTOR_TAG = /^([a-z\-_]+)$/i;
function parseSelector(selector) {
    var semanticeName;
    var type;
    var m;
    if (m = RE_SELECTOR_TAG.exec(selector)) {
        type = 2;
    }
    else if (m = RE_SELECTOR_ATTRIBUTE.exec(selector)) {
        type = 0;
    }
    else if (m = RE_SELECTOR_CLASS.exec(selector)) {
        type = 1;
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
function toCamelCase(str) {
    str = str.replace(/[\-_]/g, ' ')
        .replace(/\s[a-z]/g, upperCase)
        .replace(/\s+/g, '')
        .replace(/^[A-Z]/g, lowerCase);
    return str;
}
function upperCase(str) {
    return str.toUpperCase();
}
function lowerCase(str) {
    return str.toLowerCase();
}
function bindAll(host) {
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
exports.bindAll = bindAll;
function safeBind(func, context) {
    var bound = func.bind(context);
    exports.forEach(func, function (value, name) { return bound[name] = value; });
    return bound;
}
exports.safeBind = safeBind;
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

},{"./reflection":"tng/reflection"}],"tng/value":[function(require,module,exports){
/// <reference path="./_references" />
var assert_1 = require('./assert');
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
function Value(name, value) {
    assert_1.assert.notEmpty(name, 'name cannot be null or empty');
    return new ValueWrapper(name, value);
}
exports.Value = Value;
function publishValue(value, ngModule, name) {
    assert_1.assert(value instanceof ValueWrapper, 'constant must be a ConstantWrapper');
    name = name != null ? name : value.name;
    ngModule.value(name, value.value);
    return ngModule;
}
exports.publishValue = publishValue;

},{"./assert":"tng/assert"}],"tng/view":[function(require,module,exports){
/// <reference path="./_references" />
var assert_1 = require('./assert');
var utils_1 = require('./utils');
var ViewAnnotation = (function () {
    function ViewAnnotation(options) {
        this.template = void 0;
        this.templateUrl = void 0;
        this.styleUrl = void 0;
        this.controllerAs = void 0;
        assert_1.assert.notNull(options, 'options must not be null');
        assert_1.assert.notEmpty(options.controllerAs, 'controllerAs cannot be null or empty');
        utils_1.setIfInterface(this, options);
    }
    return ViewAnnotation;
})();
exports.ViewAnnotation = ViewAnnotation;
exports.View = utils_1.makeDecorator(ViewAnnotation);

},{"./assert":"tng/assert","./utils":"tng/utils"}],"tng":[function(require,module,exports){
var di_1 = require('./di');
exports.Inject = di_1.Inject;
exports.bind = di_1.bind;
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
var directive_1 = require('./directive');
exports.Directive = directive_1.Directive;
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