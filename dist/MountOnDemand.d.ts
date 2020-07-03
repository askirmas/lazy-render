import { PureComponent, RefObject, PropsWithChildren, createElement, Attributes } from "react";
declare type iState = {
    statuses: Record<string, RefObject<HTMLInputElement> | null>;
};
export declare type iProps = PropsWithChildren<Partial<{
    /**
     * [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API), optionally as CSS selector to
     * @default null means viewport
     */
    root: Element | string;
    /**
     * @default "div"
     */
    tag: Parameters<typeof createElement>[0];
}>> & Attributes;
export default class MountOnDemand extends PureComponent<PropsWithChildren<iProps>, iState, unknown> {
    observer: IntersectionObserver | undefined;
    state: iState;
    constructor(props: PropsWithChildren<iProps>, ctx: unknown);
    componentDidMount(): void;
    componentWillUnmount(): void;
    componentDidUpdate(): void;
    render(): {}[] | null | undefined;
}
export {};
