import { PureComponent, RefObject, PropsWithChildren, createElement, Attributes } from "react";
declare type iMainProps = {
    /**
     * [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API), optionally as CSS selector to
     * @default null means viewport
     */
    root: Element | string | null;
    /**
     * @default "div"
     */
    tag: Parameters<typeof createElement>[0];
    /**
     * DOM attribute of dataset to use for ghosts
     * @default "key"
     */
    dataSetKey: string;
};
export declare type iProps = PropsWithChildren<Partial<iMainProps>> & Attributes;
declare type iState = {
    statuses: Record<string, RefObject<HTMLInputElement> | null>;
};
export default class MountOnDemand extends PureComponent<PropsWithChildren<iProps>, iState, unknown> {
    static defaultProps: iMainProps;
    observer: IntersectionObserver | undefined;
    state: iState;
    constructor(props: PropsWithChildren<iProps>, ctx: unknown);
    componentDidMount(): void;
    componentWillUnmount(): void;
    componentDidUpdate(): void;
    render(): {}[] | null | undefined;
}
export {};
