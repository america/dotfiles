(() => {
    "use strict";
    var browserInstance = (typeof chrome != 'undefined') ? chrome : (typeof browser != 'undefined' ? browser : {});
    const extId = browserInstance?.runtime?.id ?? "kdfieneakcjfaiglcfcgkidlkmlijjnh";
    try {
        window._docs_annotate_canvas_by_ext = extId;
        document?.documentElement.setAttribute("ginger-ext-for", "gdocs");
    } catch (error) {
        console.log(error);
    }
    const LINE_COLORS = ["#dd0000", "#4285f4"];
    const RECT_COLORS = ["#fce8e6", "#e8f0fe"];
    const widgetDisabled = document.querySelectorAll(".ginger-floatingG-disabled");

    const isDisabled = () => {
        return !!widgetDisabled.length;
    }

    const lineToPrototype = CanvasRenderingContext2D.prototype.lineTo;
    CanvasRenderingContext2D.prototype.lineTo = function (t, s) {
        if ((!this.strokeStyle  || !LINE_COLORS.includes(this.strokeStyle.toLowerCase()))  && !isDisabled()) {
            return lineToPrototype.apply(this, arguments)
        }
    };

    const fillRectPrototype = CanvasRenderingContext2D.prototype.fillRect;
    CanvasRenderingContext2D.prototype.fillRect = function (t, e, n, r) {
        if (
            (!this.fillStyle
            || !RECT_COLORS.includes(this.fillStyle.toLowerCase()))
            && !isDisabled()
        ) {
            return fillRectPrototype.apply(this, arguments);
        }
    };

    const strokePrototype = CanvasRenderingContext2D.prototype.stroke;
    CanvasRenderingContext2D.prototype.stroke = function () {
        if (arguments[0]) {
            const strokeStyle = this.strokeStyle.toString();
            if (LINE_COLORS.includes(strokeStyle.toLowerCase()) && !isDisabled()) {
                return;
            }
        }
        return strokePrototype.apply(this, arguments);
    };
})();