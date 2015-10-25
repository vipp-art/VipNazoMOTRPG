/// <reference path="../../../VipNazoMOTRPG/Util/TimeUnit.ts" />
/// <reference path="../../Scripts/typings/jasmine/jasmine.d.ts" />
describe('uti.TimeUnit', () => {

    var time: util.TimeUnit;

    beforeEach(() => {
        time = util.TimeUnit.fromMillis(24 * 60 * 60 *1000);
    });

    it('check millis', () => {
        expect(time.toMillis()).toBe(24 * 60 * 60 * 1000);
    });

    it('check seconds', () => {
        expect(time.toSeconds()).toBe(86400);
        expect(time.toMillis()).toBe(util.TimeUnit.fromSeconds(86400).toMillis());
    });

    it('check minutes', () => {
        expect(time.toMinutes()).toBe(1440);
        expect(time.toMillis()).toBe(util.TimeUnit.fromMinutes(1440).toMillis());
    });

    it('check hours', () => {
        expect(time.toHours()).toBe(24);
        expect(time.toMillis()).toBe(util.TimeUnit.fromHours(24).toMillis());
    });

    it('check days', () => {
        expect(time.toDays()).toBe(1);
        expect(time.toMillis()).toBe(util.TimeUnit.fromDay(1).toMillis());
    });
});