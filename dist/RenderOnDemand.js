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
import React, { PureComponent, createRef } from "react";
var RenderOnDemand = /** @class */ (function (_super) {
    __extends(RenderOnDemand, _super);
    function RenderOnDemand() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.myRef = createRef();
        _this.observer = undefined;
        _this.state = {
            append: false
        };
        return _this;
    }
    RenderOnDemand.prototype.componentDidMount = function () {
        var _this = this;
        var append = function () { return _this.setState({ append: true }); }, current = this.myRef.current;
        if (!current)
            return append();
        var _a = this.props.root, _r = _a === void 0 ? document.body : _a, root = typeof _r === 'string'
            ? document.querySelector(_r)
            : _r;
        if (!root)
            return append();
        var observer = (new IntersectionObserver(function (entries) {
            var e_1, _a;
            try {
                for (var entries_1 = __values(entries), entries_1_1 = entries_1.next(); !entries_1_1.done; entries_1_1 = entries_1.next()) {
                    var _b = entries_1_1.value, isIntersecting = _b.isIntersecting, intersectionRatio = _b.intersectionRatio;
                    if (isIntersecting && intersectionRatio) {
                        _this.observer = _this.observer && _this.observer.disconnect();
                        //@ts-ignore Property 'requestIdleCallback' does not exist on type 'Window & typeof globalThis'.
                        window.requestIdleCallback(append); // return id
                        return;
                    }
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
        observer.observe(current);
        this.observer = observer;
    };
    RenderOnDemand.prototype.componentWillUnmount = function () {
        this.observer && this.observer.disconnect();
    };
    RenderOnDemand.prototype.render = function () {
        var _a = this.props, _b = _a.children, children = _b === void 0 ? null : _b, _c = _a.replaceNotAppend, replaceNotAppend = _c === void 0 ? false : _c, etc = __rest(_a, ["children", "replaceNotAppend"]), append = this.state.append, ref = this.myRef, props = __assign({ ref: ref }, etc);
        return replaceNotAppend
            ? (!append
                ? React.createElement("div", __assign({}, props))
                : children)
            : React.createElement("div", __assign({}, props), !append
                ? null
                : children);
    };
    return RenderOnDemand;
}(PureComponent));
export default RenderOnDemand;
//# sourceMappingURL=RenderOnDemand.js.map