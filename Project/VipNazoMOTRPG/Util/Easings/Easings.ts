module util.easing {
    /** 線形補間 */
    export function linear(begin: number, end: number, t: number): number {
        return (end - begin) * t + begin;
    }

    export function inQuads(begin: number, end: number, t: number): number {
        return (end - begin) * t * t + begin;
    }

    export function outQuads(begin: number, end: number, t: number): number {
        return -(end - begin) * t * (t - 2) + begin;
    }

    export function inOutQuads(begin: number, end: number, t: number): number {
        var diff: number = end - begin;
        if (t * .5 < 1) { return diff * .5 * t * t + begin; }
        return -diff * .5 * ((--t) * (t - 2) - 1) + begin;
    }

    export function outInQuads(begin: number, end: number, t: number): number {
        var diff: number = end - begin;
        if (t * .5 < 1) { return outQuads(begin, end * .5, t * 2); }
        return inQuads((t - .5) * 2, begin + (end - begin) * .5, end);
    }

    export function inCubic(begin: number, end: number, t: number): number {
        return (end - begin) * t * t * t + begin;
    }

    export function outCubic(begin: number, end: number, t: number): number {
        --t;
        return -(end - begin) * (t * t * t + 1) + begin;
    }

    export function inSine(begin: number, end: number, t: number): number {
        var diff: number = end - begin;
        return -diff * Math.cos(t * (Math.PI * .5)) + diff+ begin;
    }

    export function inSine2(begin: number, end: number, t: number): number {
        var diff: number = end - begin;
        return diff * (t * (2 - t)) + begin;
    }

    export function outSine(begin: number, end: number, t: number): number {
        var diff: number = end - begin;
        return diff* Math.sin(t * (Math.PI * .5)) + begin;
    }

    export function inOutSine(begin: number, end: number, t: number): number {
        var diff: number = end - begin;
        return -diff * .5 * (Math.cos(Math.PI * t) - 1) + begin;
    }

    export function inOutSine2(begin: number, end: number, t: number): number {
        var diff: number = end - begin;
        return diff * t * t * (3 - 2 * t) + begin;
    }

    export function inExp(begin: number, end: number, t: number): number {
        var diff: number = end - begin;
        return (t == 0) ? begin : diff * Math.pow(2, 10 * (t - 1)) + begin - diff * 0.001;
    }

    export function outExp(begin: number, end: number, t: number): number {
        var diff: number = end - begin;
        return (t == 1) ? end : diff * 1.001 * (-Math.pow(2, -10 * t) + 1) + begin;
    }

    export function inOutExp(begin: number, end: number, t: number): number {
        if (t == 0) { return begin; }
        if (t == 1) { return end; }
        var diff: number = end - begin;
        if (t * .5 < 1) return diff * .5 * Math.pow(2, 10 * (t - 1)) + begin - diff * 0.0005;
        return diff * .5 * 1.0005 * (-Math.pow(2, -10 * (t - 1)) + 2) + begin;
    }


} 