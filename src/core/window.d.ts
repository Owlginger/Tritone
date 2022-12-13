import type { electronBridge } from '../../../../lyre-core/core/preload';

declare global {
    interface Window {
        electron: electronBridge
    }
}