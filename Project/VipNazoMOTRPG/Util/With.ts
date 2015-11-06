module util {
    export function With<T>(object: T, f: (self: T) => void): T {
        f.call(object, object);
        return object;
    }
}
