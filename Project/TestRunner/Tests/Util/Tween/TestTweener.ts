/// <reference path="../../../../VipNazoMOTRPG/Util/Easing.ts" />
/// <reference path="../../../../VipNazoMOTRPG/Util/Easings/Easings.ts" />
/// <reference path="../../../../VipNazoMOTRPG/Util/Timer.ts" />
/// <reference path="../../../../VipNazoMOTRPG/Util/impl/Timer.ts" />
/// <reference path="../../../../VipNazoMOTRPG/Util/TimeUnit.ts" />
/// <reference path="../../../../VipNazoMOTRPG/Util/Tween/Tweener.ts" />
/// <reference path="../../../Scripts/typings/jasmine/jasmine.d.ts" />
try {
    // テスト書きにくいのでとりあえず処理を呼び出すだけ。
    (function () {
        var o = { x: 100 };
        console.log('animate呼び出し');
        var context = util.tween.Tweener.animate(
            o,
            { x: 200 },
            new util.tween.TweenParameter({
                delay: util.TimeUnit.fromSeconds(5),
                time: util.TimeUnit.fromSeconds(10),
                onStart: () => {
                    console.log('開始:' + new Date().getTime());
                },
                onUpdate: () => {
                    console.log(o['x']);
                },
                onComplete: () => {
                    console.log('終了:' + new Date().getTime());
                }
            }));
    })();
} catch (e) {
    console.log(e);
}