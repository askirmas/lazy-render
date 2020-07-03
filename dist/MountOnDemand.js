var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
import { PureComponent, createRef, createElement, Children } from "react";
var $values = Object.values;
// TODO self in DOM?
// TODO props for ghosts
// TODO if ghost visible from the start, observer will not fire
var MountOnDemand = /** @class */ (function (_super) {
    __extends(MountOnDemand, _super);
    function MountOnDemand(props, ctx) {
        var _this = _super.call(this, props, ctx) || this;
        _this.observer = undefined;
        _this.state = { statuses: {} };
        var children = props.children, statuses = _this.state.statuses;
        Children.forEach(children, function (child, i) {
            var key = getKey(child, i);
            statuses[key] === undefined && (statuses[key] = /*TODO pick from child*/ createRef());
        });
        return _this;
    }
    MountOnDemand.prototype.componentDidMount = function () {
        var _this = this;
        var _r = this.props.root, root = typeof _r === 'string'
            ? document.querySelector(_r)
            : _r;
        //TODO: External observer may be in props
        var observer = (new IntersectionObserver(function (entries) {
            var observer = _this.observer;
            if (!observer)
                return;
            var dataSetKey = _this.props.dataSetKey;
            _this.setState(function (_a) {
                var statuses = _a.statuses;
                var nextStatuses = onIntersectionEntries(observer, dataSetKey, entries, statuses);
                return nextStatuses && { statuses: nextStatuses };
            });
        }, {
            root: root
        }));
        this.observer = observer;
        this.componentDidUpdate();
    };
    MountOnDemand.prototype.componentWillUnmount = function () {
        var observer = this.observer;
        observer && observer.disconnect();
    };
    MountOnDemand.prototype.componentDidUpdate = function () {
        var _this = this;
        var observer = this.observer;
        observer && observeStatused(observer, this.state.statuses);
        this.setState(function (_a) {
            var statuses = _a.statuses;
            var next = nextStatuses(statuses, _this.props.children);
            return next && { statuses: next };
        });
    };
    MountOnDemand.prototype.render = function () {
        var _a = this.props, children = _a.children, tag = _a.tag, root = _a.root, dataSetKey = _a.dataSetKey, etc = __rest(_a, ["children", "tag", "root", "dataSetKey"]), statuses = this.state.statuses, attribute = "data-" + dataSetKey;
        return Children.map(children, function (child, i) {
            var _a;
            var key = getKey(child, i);
            switch (statuses[key]) {
                case null:
                    return child;
                // case undefined:
                //   return null
                default:
                    return createElement(tag, __assign(__assign({}, etc), (_a = {
                            key: key,
                            "ref": statuses[key]
                        },
                        _a[attribute] = key,
                        _a)));
            }
        });
    };
    MountOnDemand.defaultProps = {
        root: null,
        tag: "div",
        dataSetKey: "key"
    };
    return MountOnDemand;
}(PureComponent));
export default MountOnDemand;
function getKey(child, index) {
    var _a;
    //@ts-ignore
    return (_a = child === null || child === void 0 ? void 0 : child.key) !== null && _a !== void 0 ? _a : "" + index;
}
function observeStatused(observer, statuses) {
    $values(statuses)
        .forEach(function (ref) {
        var el = ref === null || ref === void 0 ? void 0 : ref.current;
        if (el)
            observer.observe(el);
    });
    // Alternative way:
    // for (const key in statuses) {
    //   const el = statuses[key]?.current
    //   if (el)
    //     observer?.observe(el)
    // }
}
function nextStatuses(statuses, children) {
    var e_1, _a;
    var nextStatuses = {}, deletedChildren = new Set(), commonChildren = new Set();
    var hasNew = false;
    Children.forEach(children, function (child, i) {
        var key = getKey(child, i);
        if (statuses[key] !== undefined) {
            commonChildren.add(key);
        }
        else {
            hasNew || (hasNew = true);
            nextStatuses[key] = createRef();
        }
    });
    for (var key in statuses) {
        if (statuses[key] === undefined)
            continue;
        if (commonChildren.has(key))
            continue;
        deletedChildren.add(key);
    }
    if (deletedChildren.size === 0)
        return !hasNew
            ? null
            : __assign(__assign({}, statuses), nextStatuses);
    else {
        try {
            for (var commonChildren_1 = __values(commonChildren), commonChildren_1_1 = commonChildren_1.next(); !commonChildren_1_1.done; commonChildren_1_1 = commonChildren_1.next()) {
                var key = commonChildren_1_1.value;
                nextStatuses[key] = statuses[key];
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (commonChildren_1_1 && !commonChildren_1_1.done && (_a = commonChildren_1.return)) _a.call(commonChildren_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return nextStatuses;
    }
}
function onIntersectionEntries(observer, dataSetKey, entries, statuses) {
    var _a;
    var appeared = {};
    var changed = false;
    for (var i = entries.length; i--;) {
        var _b = entries[i], isIntersecting = _b.isIntersecting, intersectionRatio = _b.intersectionRatio, target = _b.target, _c = dataSetKey, key = _b.target.dataset[_c];
        if (!(key &&
            isIntersecting && intersectionRatio
        // && isVisible 
        // && (width || height)
        ))
            continue;
        var el = (_a = statuses[key]) === null || _a === void 0 ? void 0 : _a.current;
        if (!el)
            continue;
        if (el !== target)
            continue;
        observer.unobserve(el);
        appeared[key] = null;
        changed || (changed = true);
    }
    return !changed
        ? null
        : appeared;
}
//# sourceMappingURL=MountOnDemand.js.map