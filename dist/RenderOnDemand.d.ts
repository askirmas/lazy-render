import { PureComponent, RefObject, PropsWithChildren } from "react";
declare type iState = {
    append: boolean;
};
export declare type iProps = Partial<{
    /**
     * - `false` - append children to host
     * - `true` - replace host with children
     */
    replaceNotAppend: boolean;
    /**
     * [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API), optionally as CSS selector to
     */
    root: Element | string;
}>;
export default class RenderOnDemand extends PureComponent<PropsWithChildren<iProps>, iState> {
    myRef: RefObject<any>;
    observer: IntersectionObserver | void;
    state: {
        append: boolean;
    };
    componentDidMount(): void;
    componentWillUnmount(): void;
    render(): {} | null;
}
export {};
