"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
self["webpackHotUpdate_N_E"]("app/stock/page",{

/***/ "(app-pages-browser)/./components/TechnicalIndicators.tsx":
/*!********************************************!*\
  !*** ./components/TechnicalIndicators.tsx ***!
  \********************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

eval(__webpack_require__.ts("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ TechnicalIndicators)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"(app-pages-browser)/./node_modules/next/dist/compiled/react/jsx-dev-runtime.js\");\n/* harmony import */ var _TiltedCard__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./TiltedCard */ \"(app-pages-browser)/./components/TiltedCard.tsx\");\n/* __next_internal_client_entry_do_not_use__ default auto */ \n\nfunction SignalOverlay(param) {\n    let { title, value, signal } = param;\n    const isPositive = signal.toLowerCase() === 'bullish';\n    const isNeutral = signal.toLowerCase() === 'neutral';\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n        className: \"w-full h-full p-6 flex flex-col justify-between backdrop-blur-[2px]\",\n        children: [\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                className: \"flex items-center justify-between\",\n                children: [\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"h3\", {\n                        className: \"text-white text-sm font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]\",\n                        children: title\n                    }, void 0, false, {\n                        fileName: \"/Users/varriza/Documents/PROJECTS/FULL-BASE/backend_python/FluxCore/frontend/components/TechnicalIndicators.tsx\",\n                        lineNumber: 52,\n                        columnNumber: 9\n                    }, this),\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                        className: \"px-3 py-1 rounded-full text-sm font-bold \".concat(isNeutral ? 'bg-gray-500/60 text-white' : isPositive ? 'bg-green-500/60 text-white' : 'bg-red-500/60 text-white', \" shadow-lg backdrop-blur-md\"),\n                        children: signal\n                    }, void 0, false, {\n                        fileName: \"/Users/varriza/Documents/PROJECTS/FULL-BASE/backend_python/FluxCore/frontend/components/TechnicalIndicators.tsx\",\n                        lineNumber: 53,\n                        columnNumber: 9\n                    }, this)\n                ]\n            }, void 0, true, {\n                fileName: \"/Users/varriza/Documents/PROJECTS/FULL-BASE/backend_python/FluxCore/frontend/components/TechnicalIndicators.tsx\",\n                lineNumber: 51,\n                columnNumber: 7\n            }, this),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                className: \"text-4xl text-white font-bold text-center drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]\",\n                children: value\n            }, void 0, false, {\n                fileName: \"/Users/varriza/Documents/PROJECTS/FULL-BASE/backend_python/FluxCore/frontend/components/TechnicalIndicators.tsx\",\n                lineNumber: 60,\n                columnNumber: 7\n            }, this)\n        ]\n    }, void 0, true, {\n        fileName: \"/Users/varriza/Documents/PROJECTS/FULL-BASE/backend_python/FluxCore/frontend/components/TechnicalIndicators.tsx\",\n        lineNumber: 50,\n        columnNumber: 5\n    }, this);\n}\n_c = SignalOverlay;\nfunction TechnicalIndicators(param) {\n    let { data } = param;\n    const { signals, summary } = data.data;\n    const getBackgroundForSignal = (signal, indicator)=>{\n        // Special backgrounds for each indicator\n        if (indicator === 'RSI') {\n            return 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=2832'; // Digital grid pattern\n        }\n        if (indicator === 'MACD') {\n            return 'https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=2832'; // Abstract lines\n        }\n        // Default backgrounds based on signal\n        const isPositive = signal.toLowerCase() === 'bullish';\n        const isNeutral = signal.toLowerCase() === 'neutral';\n        return isNeutral ? 'https://images.unsplash.com/photo-1557683311-eac922347aa1?q=80&w=2029' : isPositive ? 'https://images.unsplash.com/photo-1640340434855-6084b1f4901c?q=80&w=1964' : 'https://images.unsplash.com/photo-1607893378714-007fd47c8719?q=80&w=2070';\n    };\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n        className: \"space-y-8\",\n        children: [\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                className: \"grid grid-cols-1 lg:grid-cols-2 gap-6\",\n                children: [\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_TiltedCard__WEBPACK_IMPORTED_MODULE_1__[\"default\"], {\n                        imageSrc: getBackgroundForSignal(signals.rsi.signal, 'RSI'),\n                        altText: \"Relative Strength Index\",\n                        captionText: \"RSI (Relative Strength Index): \".concat(signals.rsi.value.toFixed(2)),\n                        containerHeight: \"200px\",\n                        containerWidth: \"100%\",\n                        imageHeight: \"200px\",\n                        imageWidth: \"100%\",\n                        rotateAmplitude: 20,\n                        scaleOnHover: 1.1,\n                        showMobileWarning: false,\n                        showTooltip: false,\n                        displayOverlayContent: true,\n                        overlayContent: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(SignalOverlay, {\n                            title: \"Relative Strength Index (14)\",\n                            value: signals.rsi.value.toFixed(2),\n                            signal: signals.rsi.signal\n                        }, void 0, false, {\n                            fileName: \"/Users/varriza/Documents/PROJECTS/FULL-BASE/backend_python/FluxCore/frontend/components/TechnicalIndicators.tsx\",\n                            lineNumber: 105,\n                            columnNumber: 13\n                        }, void 0)\n                    }, void 0, false, {\n                        fileName: \"/Users/varriza/Documents/PROJECTS/FULL-BASE/backend_python/FluxCore/frontend/components/TechnicalIndicators.tsx\",\n                        lineNumber: 91,\n                        columnNumber: 9\n                    }, this),\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_TiltedCard__WEBPACK_IMPORTED_MODULE_1__[\"default\"], {\n                        imageSrc: getBackgroundForSignal(signals.macd.trend, 'MACD'),\n                        altText: \"Moving Average Convergence Divergence\",\n                        captionText: \"MACD: \".concat(signals.macd.value.toFixed(2)),\n                        containerHeight: \"200px\",\n                        containerWidth: \"100%\",\n                        imageHeight: \"200px\",\n                        imageWidth: \"100%\",\n                        rotateAmplitude: 20,\n                        scaleOnHover: 1.1,\n                        showMobileWarning: false,\n                        showTooltip: false,\n                        displayOverlayContent: true,\n                        overlayContent: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(SignalOverlay, {\n                            title: \"Moving Average Convergence Divergence\",\n                            value: signals.macd.value.toFixed(2),\n                            signal: signals.macd.trend\n                        }, void 0, false, {\n                            fileName: \"/Users/varriza/Documents/PROJECTS/FULL-BASE/backend_python/FluxCore/frontend/components/TechnicalIndicators.tsx\",\n                            lineNumber: 127,\n                            columnNumber: 13\n                        }, void 0)\n                    }, void 0, false, {\n                        fileName: \"/Users/varriza/Documents/PROJECTS/FULL-BASE/backend_python/FluxCore/frontend/components/TechnicalIndicators.tsx\",\n                        lineNumber: 113,\n                        columnNumber: 9\n                    }, this),\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_TiltedCard__WEBPACK_IMPORTED_MODULE_1__[\"default\"], {\n                        imageSrc: getBackgroundForSignal(signals.moving_averages.trend, 'MA'),\n                        altText: \"Moving Averages\",\n                        captionText: \"Moving Averages Strength: \".concat(signals.moving_averages.strength.toFixed(2), \"%\"),\n                        containerHeight: \"200px\",\n                        containerWidth: \"100%\",\n                        imageHeight: \"200px\",\n                        imageWidth: \"100%\",\n                        rotateAmplitude: 20,\n                        scaleOnHover: 1.1,\n                        showMobileWarning: false,\n                        showTooltip: false,\n                        displayOverlayContent: true,\n                        overlayContent: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(SignalOverlay, {\n                            title: \"Moving Averages (50/200)\",\n                            value: \"\".concat(signals.moving_averages.strength.toFixed(2), \"%\"),\n                            signal: signals.moving_averages.trend\n                        }, void 0, false, {\n                            fileName: \"/Users/varriza/Documents/PROJECTS/FULL-BASE/backend_python/FluxCore/frontend/components/TechnicalIndicators.tsx\",\n                            lineNumber: 149,\n                            columnNumber: 13\n                        }, void 0)\n                    }, void 0, false, {\n                        fileName: \"/Users/varriza/Documents/PROJECTS/FULL-BASE/backend_python/FluxCore/frontend/components/TechnicalIndicators.tsx\",\n                        lineNumber: 135,\n                        columnNumber: 9\n                    }, this)\n                ]\n            }, void 0, true, {\n                fileName: \"/Users/varriza/Documents/PROJECTS/FULL-BASE/backend_python/FluxCore/frontend/components/TechnicalIndicators.tsx\",\n                lineNumber: 90,\n                columnNumber: 7\n            }, this),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                className: \"bg-[#1E1F25]/30 rounded-3xl p-6 backdrop-blur-sm\",\n                children: [\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"h3\", {\n                        className: \"text-white/60 text-sm font-medium mb-4\",\n                        children: \"Market Summary\"\n                    }, void 0, false, {\n                        fileName: \"/Users/varriza/Documents/PROJECTS/FULL-BASE/backend_python/FluxCore/frontend/components/TechnicalIndicators.tsx\",\n                        lineNumber: 160,\n                        columnNumber: 9\n                    }, this),\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                        className: \"grid grid-cols-2 gap-4\",\n                        children: [\n                            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                                children: [\n                                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                                        className: \"text-white/50 text-sm mb-1\",\n                                        children: \"Short Term\"\n                                    }, void 0, false, {\n                                        fileName: \"/Users/varriza/Documents/PROJECTS/FULL-BASE/backend_python/FluxCore/frontend/components/TechnicalIndicators.tsx\",\n                                        lineNumber: 163,\n                                        columnNumber: 13\n                                    }, this),\n                                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                                        className: \"text-lg font-medium \".concat(summary.short_term === 'Bullish' ? 'text-green-400' : 'text-red-400'),\n                                        children: summary.short_term\n                                    }, void 0, false, {\n                                        fileName: \"/Users/varriza/Documents/PROJECTS/FULL-BASE/backend_python/FluxCore/frontend/components/TechnicalIndicators.tsx\",\n                                        lineNumber: 164,\n                                        columnNumber: 13\n                                    }, this)\n                                ]\n                            }, void 0, true, {\n                                fileName: \"/Users/varriza/Documents/PROJECTS/FULL-BASE/backend_python/FluxCore/frontend/components/TechnicalIndicators.tsx\",\n                                lineNumber: 162,\n                                columnNumber: 11\n                            }, this),\n                            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                                children: [\n                                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                                        className: \"text-white/50 text-sm mb-1\",\n                                        children: \"Long Term\"\n                                    }, void 0, false, {\n                                        fileName: \"/Users/varriza/Documents/PROJECTS/FULL-BASE/backend_python/FluxCore/frontend/components/TechnicalIndicators.tsx\",\n                                        lineNumber: 169,\n                                        columnNumber: 13\n                                    }, this),\n                                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                                        className: \"text-lg font-medium \".concat(summary.long_term === 'Bullish' ? 'text-green-400' : 'text-red-400'),\n                                        children: summary.long_term\n                                    }, void 0, false, {\n                                        fileName: \"/Users/varriza/Documents/PROJECTS/FULL-BASE/backend_python/FluxCore/frontend/components/TechnicalIndicators.tsx\",\n                                        lineNumber: 170,\n                                        columnNumber: 13\n                                    }, this)\n                                ]\n                            }, void 0, true, {\n                                fileName: \"/Users/varriza/Documents/PROJECTS/FULL-BASE/backend_python/FluxCore/frontend/components/TechnicalIndicators.tsx\",\n                                lineNumber: 168,\n                                columnNumber: 11\n                            }, this),\n                            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                                children: [\n                                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                                        className: \"text-white/50 text-sm mb-1\",\n                                        children: \"Volatility\"\n                                    }, void 0, false, {\n                                        fileName: \"/Users/varriza/Documents/PROJECTS/FULL-BASE/backend_python/FluxCore/frontend/components/TechnicalIndicators.tsx\",\n                                        lineNumber: 175,\n                                        columnNumber: 13\n                                    }, this),\n                                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                                        className: \"text-lg font-medium text-white\",\n                                        children: summary.volatility\n                                    }, void 0, false, {\n                                        fileName: \"/Users/varriza/Documents/PROJECTS/FULL-BASE/backend_python/FluxCore/frontend/components/TechnicalIndicators.tsx\",\n                                        lineNumber: 176,\n                                        columnNumber: 13\n                                    }, this)\n                                ]\n                            }, void 0, true, {\n                                fileName: \"/Users/varriza/Documents/PROJECTS/FULL-BASE/backend_python/FluxCore/frontend/components/TechnicalIndicators.tsx\",\n                                lineNumber: 174,\n                                columnNumber: 11\n                            }, this),\n                            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                                children: [\n                                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                                        className: \"text-white/50 text-sm mb-1\",\n                                        children: \"Price Strength\"\n                                    }, void 0, false, {\n                                        fileName: \"/Users/varriza/Documents/PROJECTS/FULL-BASE/backend_python/FluxCore/frontend/components/TechnicalIndicators.tsx\",\n                                        lineNumber: 179,\n                                        columnNumber: 13\n                                    }, this),\n                                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                                        className: \"text-lg font-medium text-blue-400\",\n                                        children: summary.price_strength\n                                    }, void 0, false, {\n                                        fileName: \"/Users/varriza/Documents/PROJECTS/FULL-BASE/backend_python/FluxCore/frontend/components/TechnicalIndicators.tsx\",\n                                        lineNumber: 180,\n                                        columnNumber: 13\n                                    }, this)\n                                ]\n                            }, void 0, true, {\n                                fileName: \"/Users/varriza/Documents/PROJECTS/FULL-BASE/backend_python/FluxCore/frontend/components/TechnicalIndicators.tsx\",\n                                lineNumber: 178,\n                                columnNumber: 11\n                            }, this)\n                        ]\n                    }, void 0, true, {\n                        fileName: \"/Users/varriza/Documents/PROJECTS/FULL-BASE/backend_python/FluxCore/frontend/components/TechnicalIndicators.tsx\",\n                        lineNumber: 161,\n                        columnNumber: 9\n                    }, this)\n                ]\n            }, void 0, true, {\n                fileName: \"/Users/varriza/Documents/PROJECTS/FULL-BASE/backend_python/FluxCore/frontend/components/TechnicalIndicators.tsx\",\n                lineNumber: 159,\n                columnNumber: 7\n            }, this)\n        ]\n    }, void 0, true, {\n        fileName: \"/Users/varriza/Documents/PROJECTS/FULL-BASE/backend_python/FluxCore/frontend/components/TechnicalIndicators.tsx\",\n        lineNumber: 88,\n        columnNumber: 5\n    }, this);\n}\n_c1 = TechnicalIndicators;\nvar _c, _c1;\n$RefreshReg$(_c, \"SignalOverlay\");\n$RefreshReg$(_c1, \"TechnicalIndicators\");\n\n\n;\n    // Wrapped in an IIFE to avoid polluting the global scope\n    ;\n    (function () {\n        var _a, _b;\n        // Legacy CSS implementations will `eval` browser code in a Node.js context\n        // to extract CSS. For backwards compatibility, we need to check we're in a\n        // browser context before continuing.\n        if (typeof self !== 'undefined' &&\n            // AMP / No-JS mode does not inject these helpers:\n            '$RefreshHelpers$' in self) {\n            // @ts-ignore __webpack_module__ is global\n            var currentExports = module.exports;\n            // @ts-ignore __webpack_module__ is global\n            var prevSignature = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevSignature) !== null && _b !== void 0 ? _b : null;\n            // This cannot happen in MainTemplate because the exports mismatch between\n            // templating and execution.\n            self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);\n            // A module can be accepted automatically based on its exports, e.g. when\n            // it is a Refresh Boundary.\n            if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {\n                // Save the previous exports signature on update so we can compare the boundary\n                // signatures. We avoid saving exports themselves since it causes memory leaks (https://github.com/vercel/next.js/pull/53797)\n                module.hot.dispose(function (data) {\n                    data.prevSignature =\n                        self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports);\n                });\n                // Unconditionally accept an update to this module, we'll check if it's\n                // still a Refresh Boundary later.\n                // @ts-ignore importMeta is replaced in the loader\n                module.hot.accept();\n                // This field is set when the previous version of this module was a\n                // Refresh Boundary, letting us know we need to check for invalidation or\n                // enqueue an update.\n                if (prevSignature !== null) {\n                    // A boundary can become ineligible if its exports are incompatible\n                    // with the previous exports.\n                    //\n                    // For example, if you add/remove/change exports, we'll want to\n                    // re-execute the importing modules, and force those components to\n                    // re-render. Similarly, if you convert a class component to a\n                    // function, we want to invalidate the boundary.\n                    if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevSignature, self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports))) {\n                        module.hot.invalidate();\n                    }\n                    else {\n                        self.$RefreshHelpers$.scheduleUpdate();\n                    }\n                }\n            }\n            else {\n                // Since we just executed the code for the module, it's possible that the\n                // new exports made it ineligible for being a boundary.\n                // We only care about the case when we were _previously_ a boundary,\n                // because we already accepted this update (accidental side effect).\n                var isNoLongerABoundary = prevSignature !== null;\n                if (isNoLongerABoundary) {\n                    module.hot.invalidate();\n                }\n            }\n        }\n    })();\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwcC1wYWdlcy1icm93c2VyKS8uL2NvbXBvbmVudHMvVGVjaG5pY2FsSW5kaWNhdG9ycy50c3giLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUdxQztBQXFDckMsU0FBU0MsY0FBYyxLQUl0QjtRQUpzQixFQUFFQyxLQUFLLEVBQUVDLEtBQUssRUFBRUMsTUFBTSxFQUk1QyxHQUpzQjtJQUtyQixNQUFNQyxhQUFhRCxPQUFPRSxXQUFXLE9BQU87SUFDNUMsTUFBTUMsWUFBWUgsT0FBT0UsV0FBVyxPQUFPO0lBRTNDLHFCQUNFLDhEQUFDRTtRQUFJQyxXQUFVOzswQkFDYiw4REFBQ0Q7Z0JBQUlDLFdBQVU7O2tDQUNiLDhEQUFDQzt3QkFBR0QsV0FBVTtrQ0FBd0VQOzs7Ozs7a0NBQ3RGLDhEQUFDTTt3QkFBSUMsV0FBVyw0Q0FHZixPQUZDRixZQUFZLDhCQUNaRixhQUFhLCtCQUErQiw0QkFDN0M7a0NBQ0VEOzs7Ozs7Ozs7Ozs7MEJBR0wsOERBQUNJO2dCQUFJQyxXQUFVOzBCQUFxRk47Ozs7Ozs7Ozs7OztBQUcxRztLQXRCU0Y7QUF3Qk0sU0FBU1Usb0JBQW9CLEtBQWlDO1FBQWpDLEVBQUVDLElBQUksRUFBMkIsR0FBakM7SUFDMUMsTUFBTSxFQUFFQyxPQUFPLEVBQUVDLE9BQU8sRUFBRSxHQUFHRixLQUFLQSxJQUFJO0lBRXRDLE1BQU1HLHlCQUF5QixDQUFDWCxRQUFnQlk7UUFDOUMseUNBQXlDO1FBQ3pDLElBQUlBLGNBQWMsT0FBTztZQUN2QixPQUFPLDRFQUE0RSx1QkFBdUI7UUFDNUc7UUFDQSxJQUFJQSxjQUFjLFFBQVE7WUFDeEIsT0FBTyw0RUFBNEUsaUJBQWlCO1FBQ3RHO1FBRUEsc0NBQXNDO1FBQ3RDLE1BQU1YLGFBQWFELE9BQU9FLFdBQVcsT0FBTztRQUM1QyxNQUFNQyxZQUFZSCxPQUFPRSxXQUFXLE9BQU87UUFDM0MsT0FBT0MsWUFDSCwwRUFDQUYsYUFDRSw2RUFDQTtJQUNSO0lBRUEscUJBQ0UsOERBQUNHO1FBQUlDLFdBQVU7OzBCQUVi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QyxXQUFVO2tEQUE2Qjs7Ozs7O2tEQUM1Qyw4REFBQ0Q7d0NBQUlDLFdBQVU7a0RBQXFDSyxRQUFReUIsY0FBYzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBTXRGO01Bekh3QjVCIiwic291cmNlcyI6WyIvVXNlcnMvdmFycml6YS9Eb2N1bWVudHMvUFJPSkVDVFMvRlVMTC1CQVNFL2JhY2tlbmRfcHl0aG9uL0ZsdXhDb3JlL2Zyb250ZW5kL2NvbXBvbmVudHMvVGVjaG5pY2FsSW5kaWNhdG9ycy50c3giXSwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBjbGllbnQnXG5cbmltcG9ydCB7IEFycm93VHJlbmRpbmdVcEljb24sIEFycm93VHJlbmRpbmdEb3duSWNvbiB9IGZyb20gJ0BoZXJvaWNvbnMvcmVhY3QvMjQvb3V0bGluZSdcbmltcG9ydCBUaWx0ZWRDYXJkIGZyb20gJy4vVGlsdGVkQ2FyZCdcblxuaW50ZXJmYWNlIEluZGljYXRvckRhdGEge1xuICBzdGF0dXM6IHN0cmluZztcbiAgbWVzc2FnZTogc3RyaW5nO1xuICBkYXRhOiB7XG4gICAgc3ltYm9sOiBzdHJpbmc7XG4gICAgY29tcGFueV9uYW1lOiBzdHJpbmc7XG4gICAgY3VycmVudF9wcmljZTogbnVtYmVyO1xuICAgIHNpZ25hbHM6IHtcbiAgICAgIHJzaToge1xuICAgICAgICB2YWx1ZTogbnVtYmVyO1xuICAgICAgICBzaWduYWw6IHN0cmluZztcbiAgICAgICAgc3RyZW5ndGg6IHN0cmluZztcbiAgICAgIH07XG4gICAgICBtYWNkOiB7XG4gICAgICAgIHZhbHVlOiBudW1iZXI7XG4gICAgICAgIHNpZ25hbDogbnVtYmVyO1xuICAgICAgICBoaXN0b2dyYW06IG51bWJlcjtcbiAgICAgICAgdHJlbmQ6IHN0cmluZztcbiAgICAgIH07XG4gICAgICBtb3ZpbmdfYXZlcmFnZXM6IHtcbiAgICAgICAgbWE1MDogbnVtYmVyO1xuICAgICAgICBtYTIwMDogbnVtYmVyO1xuICAgICAgICB0cmVuZDogc3RyaW5nO1xuICAgICAgICBzdHJlbmd0aDogbnVtYmVyO1xuICAgICAgfTtcbiAgICB9O1xuICAgIHN1bW1hcnk6IHtcbiAgICAgIHNob3J0X3Rlcm06IHN0cmluZztcbiAgICAgIGxvbmdfdGVybTogc3RyaW5nO1xuICAgICAgdm9sYXRpbGl0eTogc3RyaW5nO1xuICAgICAgcHJpY2Vfc3RyZW5ndGg6IHN0cmluZztcbiAgICB9O1xuICB9O1xufVxuXG5mdW5jdGlvbiBTaWduYWxPdmVybGF5KHsgdGl0bGUsIHZhbHVlLCBzaWduYWwgfTogeyBcbiAgdGl0bGU6IHN0cmluZztcbiAgdmFsdWU6IHN0cmluZyB8IG51bWJlcjtcbiAgc2lnbmFsOiBzdHJpbmc7XG59KSB7XG4gIGNvbnN0IGlzUG9zaXRpdmUgPSBzaWduYWwudG9Mb3dlckNhc2UoKSA9PT0gJ2J1bGxpc2gnO1xuICBjb25zdCBpc05ldXRyYWwgPSBzaWduYWwudG9Mb3dlckNhc2UoKSA9PT0gJ25ldXRyYWwnO1xuICBcbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cInctZnVsbCBoLWZ1bGwgcC02IGZsZXggZmxleC1jb2wganVzdGlmeS1iZXR3ZWVuIGJhY2tkcm9wLWJsdXItWzJweF1cIj5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1iZXR3ZWVuXCI+XG4gICAgICAgIDxoMyBjbGFzc05hbWU9XCJ0ZXh0LXdoaXRlIHRleHQtc20gZm9udC1ib2xkIGRyb3Atc2hhZG93LVswXzJweF80cHhfcmdiYSgwLDAsMCwwLjgpXVwiPnt0aXRsZX08L2gzPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT17YHB4LTMgcHktMSByb3VuZGVkLWZ1bGwgdGV4dC1zbSBmb250LWJvbGQgJHtcbiAgICAgICAgICBpc05ldXRyYWwgPyAnYmctZ3JheS01MDAvNjAgdGV4dC13aGl0ZScgOlxuICAgICAgICAgIGlzUG9zaXRpdmUgPyAnYmctZ3JlZW4tNTAwLzYwIHRleHQtd2hpdGUnIDogJ2JnLXJlZC01MDAvNjAgdGV4dC13aGl0ZSdcbiAgICAgICAgfSBzaGFkb3ctbGcgYmFja2Ryb3AtYmx1ci1tZGB9PlxuICAgICAgICAgIHtzaWduYWx9XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtNHhsIHRleHQtd2hpdGUgZm9udC1ib2xkIHRleHQtY2VudGVyIGRyb3Atc2hhZG93LVswXzRweF84cHhfcmdiYSgwLDAsMCwwLjgpXVwiPnt2YWx1ZX08L2Rpdj5cbiAgICA8L2Rpdj5cbiAgKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gVGVjaG5pY2FsSW5kaWNhdG9ycyh7IGRhdGEgfTogeyBkYXRhOiBJbmRpY2F0b3JEYXRhIH0pIHtcbiAgY29uc3QgeyBzaWduYWxzLCBzdW1tYXJ5IH0gPSBkYXRhLmRhdGE7XG5cbiAgY29uc3QgZ2V0QmFja2dyb3VuZEZvclNpZ25hbCA9IChzaWduYWw6IHN0cmluZywgaW5kaWNhdG9yOiBzdHJpbmcpID0+IHtcbiAgICAvLyBTcGVjaWFsIGJhY2tncm91bmRzIGZvciBlYWNoIGluZGljYXRvclxuICAgIGlmIChpbmRpY2F0b3IgPT09ICdSU0knKSB7XG4gICAgICByZXR1cm4gJ2h0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNjM5NzYyNjgxNDg1LTA3NGI3ZjkzOGJhMD9xPTgwJnc9MjgzMic7IC8vIERpZ2l0YWwgZ3JpZCBwYXR0ZXJuXG4gICAgfVxuICAgIGlmIChpbmRpY2F0b3IgPT09ICdNQUNEJykge1xuICAgICAgcmV0dXJuICdodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTYzOTMyMjUzNzIyOC1mNzEwZDg0NjMxMGE/cT04MCZ3PTI4MzInOyAvLyBBYnN0cmFjdCBsaW5lc1xuICAgIH1cbiAgICBcbiAgICAvLyBEZWZhdWx0IGJhY2tncm91bmRzIGJhc2VkIG9uIHNpZ25hbFxuICAgIGNvbnN0IGlzUG9zaXRpdmUgPSBzaWduYWwudG9Mb3dlckNhc2UoKSA9PT0gJ2J1bGxpc2gnO1xuICAgIGNvbnN0IGlzTmV1dHJhbCA9IHNpZ25hbC50b0xvd2VyQ2FzZSgpID09PSAnbmV1dHJhbCc7XG4gICAgcmV0dXJuIGlzTmV1dHJhbCBcbiAgICAgID8gJ2h0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNTU3NjgzMzExLWVhYzkyMjM0N2FhMT9xPTgwJnc9MjAyOSdcbiAgICAgIDogaXNQb3NpdGl2ZVxuICAgICAgICA/ICdodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTY0MDM0MDQzNDg1NS02MDg0YjFmNDkwMWM/cT04MCZ3PTE5NjQnXG4gICAgICAgIDogJ2h0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNjA3ODkzMzc4NzE0LTAwN2ZkNDdjODcxOT9xPTgwJnc9MjA3MCc7XG4gIH07XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cInNwYWNlLXktOFwiPlxuICAgICAgey8qIFNpZ25hbCBjYXJkcyB1c2luZyBUaWx0ZWRDYXJkICovfVxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJncmlkIGdyaWQtY29scy0xIGxnOmdyaWQtY29scy0yIGdhcC02XCI+XG4gICAgICAgIDxUaWx0ZWRDYXJkXG4gICAgICAgICAgaW1hZ2VTcmM9e2dldEJhY2tncm91bmRGb3JTaWduYWwoc2lnbmFscy5yc2kuc2lnbmFsLCAnUlNJJyl9XG4gICAgICAgICAgYWx0VGV4dD1cIlJlbGF0aXZlIFN0cmVuZ3RoIEluZGV4XCJcbiAgICAgICAgICBjYXB0aW9uVGV4dD17YFJTSSAoUmVsYXRpdmUgU3RyZW5ndGggSW5kZXgpOiAke3NpZ25hbHMucnNpLnZhbHVlLnRvRml4ZWQoMil9YH1cbiAgICAgICAgICBjb250YWluZXJIZWlnaHQ9XCIyMDBweFwiXG4gICAgICAgICAgY29udGFpbmVyV2lkdGg9XCIxMDAlXCJcbiAgICAgICAgICBpbWFnZUhlaWdodD1cIjIwMHB4XCJcbiAgICAgICAgICBpbWFnZVdpZHRoPVwiMTAwJVwiXG4gICAgICAgICAgcm90YXRlQW1wbGl0dWRlPXsyMH1cbiAgICAgICAgICBzY2FsZU9uSG92ZXI9ezEuMX1cbiAgICAgICAgICBzaG93TW9iaWxlV2FybmluZz17ZmFsc2V9XG4gICAgICAgICAgc2hvd1Rvb2x0aXA9e2ZhbHNlfVxuICAgICAgICAgIGRpc3BsYXlPdmVybGF5Q29udGVudD17dHJ1ZX1cbiAgICAgICAgICBvdmVybGF5Q29udGVudD17XG4gICAgICAgICAgICA8U2lnbmFsT3ZlcmxheVxuICAgICAgICAgICAgICB0aXRsZT1cIlJlbGF0aXZlIFN0cmVuZ3RoIEluZGV4ICgxNClcIlxuICAgICAgICAgICAgICB2YWx1ZT17c2lnbmFscy5yc2kudmFsdWUudG9GaXhlZCgyKX1cbiAgICAgICAgICAgICAgc2lnbmFsPXtzaWduYWxzLnJzaS5zaWduYWx9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgIH1cbiAgICAgICAgLz5cblxuICAgICAgICA8VGlsdGVkQ2FyZFxuICAgICAgICAgIGltYWdlU3JjPXtnZXRCYWNrZ3JvdW5kRm9yU2lnbmFsKHNpZ25hbHMubWFjZC50cmVuZCwgJ01BQ0QnKX1cbiAgICAgICAgICBhbHRUZXh0PVwiTW92aW5nIEF2ZXJhZ2UgQ29udmVyZ2VuY2UgRGl2ZXJnZW5jZVwiXG4gICAgICAgICAgY2FwdGlvblRleHQ9e2BNQUNEOiAke3NpZ25hbHMubWFjZC52YWx1ZS50b0ZpeGVkKDIpfWB9XG4gICAgICAgICAgY29udGFpbmVySGVpZ2h0PVwiMjAwcHhcIlxuICAgICAgICAgIGNvbnRhaW5lcldpZHRoPVwiMTAwJVwiXG4gICAgICAgICAgaW1hZ2VIZWlnaHQ9XCIyMDBweFwiXG4gICAgICAgICAgaW1hZ2VXaWR0aD1cIjEwMCVcIlxuICAgICAgICAgIHJvdGF0ZUFtcGxpdHVkZT17MjB9XG4gICAgICAgICAgc2NhbGVPbkhvdmVyPXsxLjF9XG4gICAgICAgICAgc2hvd01vYmlsZVdhcm5pbmc9e2ZhbHNlfVxuICAgICAgICAgIHNob3dUb29sdGlwPXtmYWxzZX1cbiAgICAgICAgICBkaXNwbGF5T3ZlcmxheUNvbnRlbnQ9e3RydWV9XG4gICAgICAgICAgb3ZlcmxheUNvbnRlbnQ9e1xuICAgICAgICAgICAgPFNpZ25hbE92ZXJsYXlcbiAgICAgICAgICAgICAgdGl0bGU9XCJNb3ZpbmcgQXZlcmFnZSBDb252ZXJnZW5jZSBEaXZlcmdlbmNlXCJcbiAgICAgICAgICAgICAgdmFsdWU9e3NpZ25hbHMubWFjZC52YWx1ZS50b0ZpeGVkKDIpfVxuICAgICAgICAgICAgICBzaWduYWw9e3NpZ25hbHMubWFjZC50cmVuZH1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgfVxuICAgICAgICAvPlxuXG4gICAgICAgIDxUaWx0ZWRDYXJkXG4gICAgICAgICAgaW1hZ2VTcmM9e2dldEJhY2tncm91bmRGb3JTaWduYWwoc2lnbmFscy5tb3ZpbmdfYXZlcmFnZXMudHJlbmQsICdNQScpfVxuICAgICAgICAgIGFsdFRleHQ9XCJNb3ZpbmcgQXZlcmFnZXNcIlxuICAgICAgICAgIGNhcHRpb25UZXh0PXtgTW92aW5nIEF2ZXJhZ2VzIFN0cmVuZ3RoOiAke3NpZ25hbHMubW92aW5nX2F2ZXJhZ2VzLnN0cmVuZ3RoLnRvRml4ZWQoMil9JWB9XG4gICAgICAgICAgY29udGFpbmVySGVpZ2h0PVwiMjAwcHhcIlxuICAgICAgICAgIGNvbnRhaW5lcldpZHRoPVwiMTAwJVwiXG4gICAgICAgICAgaW1hZ2VIZWlnaHQ9XCIyMDBweFwiXG4gICAgICAgICAgaW1hZ2VXaWR0aD1cIjEwMCVcIlxuICAgICAgICAgIHJvdGF0ZUFtcGxpdHVkZT17MjB9XG4gICAgICAgICAgc2NhbGVPbkhvdmVyPXsxLjF9XG4gICAgICAgICAgc2hvd01vYmlsZVdhcm5pbmc9e2ZhbHNlfVxuICAgICAgICAgIHNob3dUb29sdGlwPXtmYWxzZX1cbiAgICAgICAgICBkaXNwbGF5T3ZlcmxheUNvbnRlbnQ9e3RydWV9XG4gICAgICAgICAgb3ZlcmxheUNvbnRlbnQ9e1xuICAgICAgICAgICAgPFNpZ25hbE92ZXJsYXlcbiAgICAgICAgICAgICAgdGl0bGU9XCJNb3ZpbmcgQXZlcmFnZXMgKDUwLzIwMClcIlxuICAgICAgICAgICAgICB2YWx1ZT17YCR7c2lnbmFscy5tb3ZpbmdfYXZlcmFnZXMuc3RyZW5ndGgudG9GaXhlZCgyKX0lYH1cbiAgICAgICAgICAgICAgc2lnbmFsPXtzaWduYWxzLm1vdmluZ19hdmVyYWdlcy50cmVuZH1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgfVxuICAgICAgICAvPlxuICAgICAgPC9kaXY+XG5cbiAgICAgIHsvKiBTdW1tYXJ5IENhcmQgKi99XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImJnLVsjMUUxRjI1XS8zMCByb3VuZGVkLTN4bCBwLTYgYmFja2Ryb3AtYmx1ci1zbVwiPlxuICAgICAgICA8aDMgY2xhc3NOYW1lPVwidGV4dC13aGl0ZS82MCB0ZXh0LXNtIGZvbnQtbWVkaXVtIG1iLTRcIj5NYXJrZXQgU3VtbWFyeTwvaDM+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ3JpZCBncmlkLWNvbHMtMiBnYXAtNFwiPlxuICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtd2hpdGUvNTAgdGV4dC1zbSBtYi0xXCI+U2hvcnQgVGVybTwvZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9e2B0ZXh0LWxnIGZvbnQtbWVkaXVtICR7XG4gICAgICAgICAgICAgIHN1bW1hcnkuc2hvcnRfdGVybSA9PT0gJ0J1bGxpc2gnID8gJ3RleHQtZ3JlZW4tNDAwJyA6ICd0ZXh0LXJlZC00MDAnXG4gICAgICAgICAgICB9YH0+e3N1bW1hcnkuc2hvcnRfdGVybX08L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LXdoaXRlLzUwIHRleHQtc20gbWItMVwiPkxvbmcgVGVybTwvZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9e2B0ZXh0LWxnIGZvbnQtbWVkaXVtICR7XG4gICAgICAgICAgICAgIHN1bW1hcnkubG9uZ190ZXJtID09PSAnQnVsbGlzaCcgPyAndGV4dC1ncmVlbi00MDAnIDogJ3RleHQtcmVkLTQwMCdcbiAgICAgICAgICAgIH1gfT57c3VtbWFyeS5sb25nX3Rlcm19PC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC13aGl0ZS81MCB0ZXh0LXNtIG1iLTFcIj5Wb2xhdGlsaXR5PC9kaXY+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtbGcgZm9udC1tZWRpdW0gdGV4dC13aGl0ZVwiPntzdW1tYXJ5LnZvbGF0aWxpdHl9PC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC13aGl0ZS81MCB0ZXh0LXNtIG1iLTFcIj5QcmljZSBTdHJlbmd0aDwvZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LWxnIGZvbnQtbWVkaXVtIHRleHQtYmx1ZS00MDBcIj57c3VtbWFyeS5wcmljZV9zdHJlbmd0aH08L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgKTtcbn0gIl0sIm5hbWVzIjpbIlRpbHRlZENhcmQiLCJTaWduYWxPdmVybGF5IiwidGl0bGUiLCJ2YWx1ZSIsInNpZ25hbCIsImlzUG9zaXRpdmUiLCJ0b0xvd2VyQ2FzZSIsImlzTmV1dHJhbCIsImRpdiIsImNsYXNzTmFtZSIsImgzIiwiVGVjaG5pY2FsSW5kaWNhdG9ycyIsImRhdGEiLCJzaWduYWxzIiwic3VtbWFyeSIsImdldEJhY2tncm91bmRGb3JTaWduYWwiLCJpbmRpY2F0b3IiLCJpbWFnZVNyYyIsInJzaSIsImFsdFRleHQiLCJjYXB0aW9uVGV4dCIsInRvRml4ZWQiLCJjb250YWluZXJIZWlnaHQiLCJjb250YWluZXJXaWR0aCIsImltYWdlSGVpZ2h0IiwiaW1hZ2VXaWR0aCIsInJvdGF0ZUFtcGxpdHVkZSIsInNjYWxlT25Ib3ZlciIsInNob3dNb2JpbGVXYXJuaW5nIiwic2hvd1Rvb2x0aXAiLCJkaXNwbGF5T3ZlcmxheUNvbnRlbnQiLCJvdmVybGF5Q29udGVudCIsIm1hY2QiLCJ0cmVuZCIsIm1vdmluZ19hdmVyYWdlcyIsInN0cmVuZ3RoIiwic2hvcnRfdGVybSIsImxvbmdfdGVybSIsInZvbGF0aWxpdHkiLCJwcmljZV9zdHJlbmd0aCJdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(app-pages-browser)/./components/TechnicalIndicators.tsx\n"));

/***/ })

});