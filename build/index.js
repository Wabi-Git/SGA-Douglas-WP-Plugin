/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/edit.js":
/*!*********************!*\
  !*** ./src/edit.js ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__);


const MOCK_DATA = [{
  TagName: "WhyanbeelWTP.WHYLT5500_PV1",
  ReservoirName: "Whyanbeel",
  Units: "%",
  Description: "LT5500 Treated Water Reservoir Level",
  DateTime: "2024-12-19T14:06:00.0000000Z",
  Value: 85.0437436785017,
  AverageDailyUse: 160,
  DailyUseChange: -0.5,
  MonthWaterLevelChange: -2.0
}, {
  TagName: "MossmanWTP.MOSLT5133_PV1",
  ReservoirName: "Mossman",
  Units: "%",
  Description: "LT5133 Clearwell Mossman Reservoir Level",
  DateTime: "2024-12-20T03:54:00.0000000Z",
  Value: 94.9312545157768,
  AverageDailyUse: 156,
  DailyUseChange: -0.8,
  MonthWaterLevelChange: 1.5
}, {
  TagName: "MossmanWTP.MOSLT5132_PV1",
  ReservoirName: "Port Douglas",
  Units: "%",
  Description: "LT5132 Clearwell Port Douglas Reservoir Level",
  DateTime: "2024-12-20T03:54:15.0000000Z",
  Value: 92.8984355926514,
  AverageDailyUse: 161,
  DailyUseChange: -0.3,
  MonthWaterLevelChange: 0.5
}, {
  TagName: "DWTP.DAILT5175_PV1",
  ReservoirName: "Daintree",
  Units: "%",
  Description: "LT5175 Treated Water Reservoir Level",
  DateTime: "2024-12-20T03:54:30.0000000Z",
  Value: 89.1531181335449,
  AverageDailyUse: 163,
  DailyUseChange: -1.0,
  MonthWaterLevelChange: 2.5
}];
const RESERVOIR_COORDINATES = {
  Whyanbeel: {
    x: 43,
    y: 48
  },
  Mossman: {
    x: 56.5,
    y: 65.5
  },
  PortDouglas: {
    x: 73,
    y: 71.5
  },
  Daintree: {
    x: 53,
    y: 62
  }
};

// use react class component instead of function component for clearer lifecycle management

class Edit extends react__WEBPACK_IMPORTED_MODULE_0__.Component {
  constructor(props) {
    super(props);
    // Create refs for each reservoir
    this.reservoirRefs = [];
    this.mapContainerRef = (0,react__WEBPACK_IMPORTED_MODULE_0__.createRef)();
    this.blueDotRef = (0,react__WEBPACK_IMPORTED_MODULE_0__.createRef)();
  }

  // Dynamically create refs for reservoirs
  createReservoirRef = index => {
    if (!this.reservoirRefs[index]) {
      this.reservoirRefs[index] = (0,react__WEBPACK_IMPORTED_MODULE_0__.createRef)();
    }
    return this.reservoirRefs[index];
  };
  componentDidMount() {
    console.log("mounting...");

    // Dynamically fetch the SVG content
    const mapSvgUrl = `${PluginAssets.images}map.svg`; // Use the dynamically provided assets path
    fetch(mapSvgUrl).then(response => {
      if (!response.ok) {
        throw new Error("Failed to fetch map.svg");
      }
      return response.text();
    }).then(svgContent => {
      // Inject the SVG content directly into the map-container
      if (this.mapContainerRef.current) {
        this.mapContainerRef.current.innerHTML += svgContent;
      }
    }).catch(error => {
      console.error("Error fetching the SVG:", error);
    });

    // Iterate over refs and perform DOM manipulation
    this.reservoirRefs.forEach(ref => {
      // update water levels
      if (ref.current) {
        const levelElement = ref.current.querySelector(".level");
        const percentage = parseFloat(levelElement.getAttribute("data-level"));
        const fill = document.createElement("div");
        fill.classList.add("reservoir-fill");
        ref.current.appendChild(fill);
        setTimeout(() => {
          fill.style.height = `${percentage}%`;
        }, 100);
      }

      // attach event handlers
      if (ref.current) {
        ref.current.addEventListener("mouseenter", () => this.handleMouseEnter(ref.current));
        ref.current.addEventListener("mouseleave", this.handleMouseLeave);
        ref.current.addEventListener("click", () => this.handleClick(ref.current));
      }
    });
    window.addEventListener("resize", this.handleResize);
  }
  componentWillUnmount() {
    this.reservoirRefs.forEach(ref => {
      if (ref.current) {
        ref.current.removeEventListener("mouseenter", this.handleMouseEnter);
        ref.current.removeEventListener("mouseleave", this.handleMouseLeave);
        ref.current.removeEventListener("click", this.handleClick);
      }
    });
    window.removeEventListener("resize", this.handleResize);
  }
  handleMouseEnter = reservoir => {
    const {
      x,
      y
    } = this.calculateDotPosition(reservoir);
    if (this.blueDotRef.current) {
      this.blueDotRef.current.style.left = `${x}px`;
      this.blueDotRef.current.style.top = `${y}px`;
      this.blueDotRef.current.style.transform = "scale(1)";
    }
  };
  handleMouseLeave = () => {
    if (this.blueDotRef.current) {
      this.blueDotRef.current.style.transform = "scale(0)";
    }
  };
  handleClick = reservoir => {
    const {
      x,
      y
    } = this.calculateDotPosition(reservoir);
    if (this.blueDotRef.current) {
      const isActive = this.blueDotRef.current.style.transform === "scale(1)";
      if (isActive) {
        this.handleMouseLeave();
      } else {
        this.blueDotRef.current.style.left = `${x}px`;
        this.blueDotRef.current.style.top = `${y}px`;
        this.blueDotRef.current.style.transform = "scale(1)";
      }
    }
  };
  handleResize = () => {
    const activeReservoir = this.reservoirRefs.find(ref => ref.current && ref.current.matches(":hover"));
    if (activeReservoir) {
      const {
        x,
        y
      } = this.calculateDotPosition(activeReservoir.current);
      if (this.blueDotRef.current) {
        this.blueDotRef.current.style.left = `${x}px`;
        this.blueDotRef.current.style.top = `${y}px`;
      }
    }
  };
  calculateDotPosition = reservoir => {
    const xPercent = parseFloat(reservoir.getAttribute("data-x"));
    const yPercent = parseFloat(reservoir.getAttribute("data-y"));
    const svgElement = this.mapContainerRef.current.querySelector("svg");
    if (!svgElement) return {
      x: 0,
      y: 0
    };
    const svgRect = svgElement.getBoundingClientRect();
    const x = xPercent / 100 * svgRect.width;
    const y = yPercent / 100 * svgRect.height;
    return {
      x,
      y
    };
  };
  getRoundedValue = value => parseFloat(value.toFixed(1));
  render() {
    const reservoirsByColumn = Array.from({
      length: Math.ceil(MOCK_DATA.length / 2)
    }, (_, i) => MOCK_DATA.slice(i * 2, i * 2 + 2));
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
      className: "wp-block-create-block-reservoir-levels-widget",
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
        className: "single-index clearfix",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
          className: "single-entry",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
            className: "single-content",
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
              className: "reservoir-widget",
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("h2", {
                children: "How full are our reservoirs?"
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
                className: "reservoir-details",
                children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
                  className: "reservoir-column",
                  children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
                    className: "reservoir total-reservoir",
                    ref: this.createReservoirRef(0),
                    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
                      className: "level",
                      "data-level": "90.5",
                      children: "90.5%"
                    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("h3", {
                      children: "Total Reservoir Level"
                    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
                      className: "line-divider-thick"
                    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
                      className: "total-usage",
                      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("img", {
                        decoding: "async",
                        src: `${PluginAssets.images}water-icon.svg` // Dynamically fetch the correct URL
                        ,
                        alt: "Water Usage Icon",
                        className: "total-water-icon"
                      }), "640L/day"]
                    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
                      className: "paragraph",
                      children: "Average Daily Use Per Person"
                    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
                      className: "grounding-boxes",
                      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
                        className: "grounding-box",
                        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
                          className: "box-value positive",
                          children: "2.5%"
                        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("span", {
                          className: "label",
                          "data-default": "Change in Total",
                          "data-hover": "Change in Total Reservoir Level since Last Week"
                        })]
                      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
                        className: "grounding-box",
                        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
                          className: "box-value negative",
                          children: "-2.6%"
                        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("span", {
                          className: "label",
                          "data-default": "Change in Use",
                          "data-hover": "Change In Use Per Person Since Last Month"
                        })]
                      })]
                    })]
                  })
                }), reservoirsByColumn.map((column, columnIndex) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
                  className: "reservoir-column",
                  children: column.map((reservoir, reservoirIndex) => {
                    const overallIndex = columnIndex * 2 + reservoirIndex + 1; // Calculate the overall index
                    const {
                      x,
                      y
                    } = RESERVOIR_COORDINATES[reservoir.ReservoirName] || {
                      x: 0,
                      y: 0
                    };
                    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
                      className: "reservoir",
                      ref: this.createReservoirRef(overallIndex),
                      "data-name": reservoir.ReservoirName,
                      "data-x": x,
                      "data-y": y,
                      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
                        className: "tag",
                        children: reservoir.ReservoirName
                      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
                        className: "level",
                        "data-level": reservoir.Value,
                        children: [this.getRoundedValue(reservoir.Value), "%"]
                      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
                        className: "line-divider"
                      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
                        className: "usage",
                        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("img", {
                          decoding: "async",
                          src: `${PluginAssets.images}water-icon.svg` // Dynamically fetch the correct URL
                          ,
                          alt: "Water Usage Icon",
                          className: "total-water-icon"
                        }), reservoir.AverageDailyUse, "L/day"]
                      })]
                    }, overallIndex);
                  })
                }, columnIndex)), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
                  className: "map-container",
                  ref: this.mapContainerRef,
                  children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
                    className: "blue-dot",
                    ref: this.blueDotRef,
                    style: {
                      left: "222.832px",
                      top: "286px",
                      transform: "scale(0)"
                    }
                  })
                })]
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
                className: "updated-daily",
                children: "\u2139\uFE0F Updated Daily"
              })]
            })
          })
        })
      })
    });
  }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Edit);

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./style.scss */ "./src/style.scss");
/* harmony import */ var _edit__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./edit */ "./src/edit.js");
/* harmony import */ var _save__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./save */ "./src/save.js");
/* harmony import */ var _block_json__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./block.json */ "./src/block.json");
/**
 * Registers a new block provided a unique name and an object defining its behavior.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-registration/
 */


/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * All files containing `style` keyword are bundled together. The code used
 * gets applied both to the front of your site and to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */


/**
 * Internal dependencies
 */




/**
 * Every block starts by registering a new block type definition.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-registration/
 */
(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.registerBlockType)(_block_json__WEBPACK_IMPORTED_MODULE_4__.name, {
  /**
   * @see ./edit.js
   */
  edit: _edit__WEBPACK_IMPORTED_MODULE_2__["default"],
  /**
   * @see ./save.js
   */
  save: _save__WEBPACK_IMPORTED_MODULE_3__["default"]
});

/***/ }),

/***/ "./src/save.js":
/*!*********************!*\
  !*** ./src/save.js ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ save)
/* harmony export */ });
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__);
/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 */


/**
 * The save function defines the way in which the different attributes should
 * be combined into the final markup, which is then serialized by the block
 * editor into `post_content`.
 *
 * @return {Element} Element to render.
 */
function save() {
  return null; // Use server-side rendering, so save function returns null.
}

/***/ }),

/***/ "./src/style.scss":
/*!************************!*\
  !*** ./src/style.scss ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "React" ***!
  \************************/
/***/ ((module) => {

module.exports = window["React"];

/***/ }),

/***/ "react/jsx-runtime":
/*!**********************************!*\
  !*** external "ReactJSXRuntime" ***!
  \**********************************/
/***/ ((module) => {

module.exports = window["ReactJSXRuntime"];

/***/ }),

/***/ "@wordpress/block-editor":
/*!*************************************!*\
  !*** external ["wp","blockEditor"] ***!
  \*************************************/
/***/ ((module) => {

module.exports = window["wp"]["blockEditor"];

/***/ }),

/***/ "@wordpress/blocks":
/*!********************************!*\
  !*** external ["wp","blocks"] ***!
  \********************************/
/***/ ((module) => {

module.exports = window["wp"]["blocks"];

/***/ }),

/***/ "./src/block.json":
/*!************************!*\
  !*** ./src/block.json ***!
  \************************/
/***/ ((module) => {

module.exports = /*#__PURE__*/JSON.parse('{"$schema":"https://schemas.wp.org/trunk/block.json","apiVersion":3,"name":"create-block/reservoir-levels-widget","version":"0.1.0","title":"reservoir Levels Widget","category":"widgets","icon":"smiley","description":"Example block scaffolded with Create Block tool.","example":{},"supports":{"html":false},"textdomain":"reservoir-levels-widget","editorScript":"file:./index.js","editorStyle":"file:./index.css","style":"file:./style-index.css","viewScript":"file:./view.js"}');

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"index": 0,
/******/ 			"./style-index": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = globalThis["webpackChunkreservoir_levels_widget"] = globalThis["webpackChunkreservoir_levels_widget"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["./style-index"], () => (__webpack_require__("./src/index.js")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;
//# sourceMappingURL=index.js.map