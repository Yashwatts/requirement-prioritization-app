declare module "infinite-scroll" {
  interface InfiniteScrollOptions {
    path?: string | (() => string);
    scrollThreshold?: number | boolean;
    loadOnScroll?: boolean;
    elementScroll?: boolean | HTMLElement;
    checkLastPage?: boolean | string;
    responseBody?: "text" | "json";
    history?: "replace" | "push" | false;
  }

  export default class InfiniteScroll {
    constructor(element: HTMLElement | string, options?: InfiniteScrollOptions);
    on(event: string, listener: (...args: unknown[]) => void): void;
    off(event: string, listener: (...args: unknown[]) => void): void;
    destroy(): void;
  }
}

