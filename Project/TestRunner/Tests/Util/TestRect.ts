/// <reference path="../../../VipNazoMOTRPG/Util/Point.ts" />
/// <reference path="../../../VipNazoMOTRPG/Util/Rect.ts" />
/// <reference path="../../Scripts/typings/jasmine/jasmine.d.ts" />
describe('util.Rect', () => {
    var rect: util.Rect;

    beforeEach(() => {
        rect = new util.Rect(1, 2, 10, 10);
    });

    it('center', () => {
        var center:util.Point = rect.center;
        expect(center.x).toBe(1 + 10 * .5);
        expect(center.y).toBe(2 + 10 * .5);
    });

    it('isCross', () => {
        expect(rect.isCross(2, 3)).toBe(true);
        expect(rect.isCross(12, 3)).toBe(false);
        expect(rect.isCross(2, 13)).toBe(false);
    });
} );