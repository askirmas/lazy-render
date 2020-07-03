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
var MountOnDemand = /** @class */ (function (_super) {
    __extends(MountOnDemand, _super);
    function MountOnDemand(props, ctx) {
        var _this = _super.call(this, props, ctx) || this;
        _this.observer = undefined;
        _this.state = {
            statuses: {}
        };
        var children = props.children, statuses = _this.state.statuses;
        Children.forEach(children, function (child, i) {
            // TODO pick from child
            return statuses[getKey(child, i)] = createRef();
        });
        return _this;
    }
    MountOnDemand.prototype.componentDidMount = function () {
        var _this = this;
        var _a = this.props.root, _r = _a === void 0 ? null : _a, root = typeof _r === 'string'
            ? document.querySelector(_r)
            : _r;
        //TODO: External observer may be in props
        var observer = (new IntersectionObserver(function (entries) {
            var e_1, _a;
            var _loop_1 = function (entry) {
                var isIntersecting = entry.isIntersecting, intersectionRatio = entry.intersectionRatio, key = entry.target.dataset.key;
                if (key &&
                    isIntersecting && intersectionRatio
                // && isVisible 
                // && (width || height)
                )
                    _this.setState(function (_a) {
                        var _b;
                        var _c, _d;
                        var statuses = _a.statuses;
                        var el = (_c = statuses[key]) === null || _c === void 0 ? void 0 : _c.current;
                        if (!el)
                            return null; //{statuses}
                        (_d = _this.observer) === null || _d === void 0 ? void 0 : _d.unobserve(el);
                        return { statuses: __assign(__assign({}, statuses), (_b = {}, _b[key] = null, _b)) };
                    });
            };
            try {
                for (var entries_1 = __values(entries), entries_1_1 = entries_1.next(); !entries_1_1.done; entries_1_1 = entries_1.next()) {
                    var entry = entries_1_1.value;
                    _loop_1(entry);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (entries_1_1 && !entries_1_1.done && (_a = entries_1.return)) _a.call(entries_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
        }, {
            root: root
        }));
        this.observer = observer;
        this.componentDidUpdate();
    };
    MountOnDemand.prototype.componentWillUnmount = function () {
        this.observer && this.observer.disconnect();
    };
    MountOnDemand.prototype.componentDidUpdate = function () {
        var observer = this.observer, statuses = this.state.statuses;
        if (!observer)
            return;
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
    };
    MountOnDemand.prototype.render = function () {
        var _a = this.props, children = _a.children, _b = _a.tag, tag = _b === void 0 ? 'div' : _b, root = _a.root, etc = __rest(_a, ["children", "tag", "root"]), statuses = this.state.statuses;
        return Children.map(children, function (child, i) {
            var key = getKey(child, i);
            switch (statuses[key]) {
                case null:
                    return child;
                case undefined:
                    statuses[key] = createRef();
                default:
                    return createElement(tag, __assign(__assign({}, etc), {
                        key: key,
                        "ref": statuses[key],
                        "data-key": key
                    }));
            }
        });
    };
    return MountOnDemand;
}(PureComponent));
export default MountOnDemand;
function getKey(child, index) {
    var _a;
    //@ts-ignore
    return (_a = child === null || child === void 0 ? void 0 : child.key) !== null && _a !== void 0 ? _a : "" + index;
}
//# sourceMappingURL=MountOnDemand.js.map