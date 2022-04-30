import { useState } from "react";

export function useChartZoom(props: { onZoomReset: () => void }) {
    const [cursorPos, setCursorPos] = useState<{ x: number; y: number }>({
        x: 0,
        y: 0,
    });

    const onMouseDown = (x: number, y: number) => {
        setCursorPos({
            x: x,
            y: y,
        });
    };

    const onMouseUp = (x: number, y: number) => {
        if (Math.abs(cursorPos.x - x) < 15 && Math.abs(cursorPos.y - y) < 15) {
            props.onZoomReset();
        }
    };

    return [onMouseDown, onMouseUp];
}
