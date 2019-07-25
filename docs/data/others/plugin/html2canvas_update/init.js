(function (TYRANO) {
    var html2canvasOrigin = window.html2canvas;
    window.html2canvas = function (target, config) {
        var onrendered = config.onrendered;
        delete config.onrendered;
        config.logging = false;
        config.isDisableTransformOfWrapper = true;
        html2canvasOrigin(target, config).then(onrendered);
    };
}(window.TYRANO));