(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['exports', './echarts-en.min'], factory);
    } else if (typeof exports === 'object' && typeof exports.nodeName !== 'string') {
        // CommonJS
        factory(exports, require('./echarts-en.min'));
    } else {
        // Browser globals
        factory({}, root.echarts);
    }
}(this, function (exports, echarts) {
    var log = function (msg) {
        if (typeof console !== 'undefined') {
            console && console.error && console.error(msg);
        }
    };
    if (!echarts) {
        log('ECharts is not Loaded');
        return;
    }
    var contrastColor = '#eee';
    var axisCommon = function () {
        return {
            axisLine: {
                lineStyle: {
                    color: contrastColor
                }
            },
            axisTick: {
                lineStyle: {
                    color: contrastColor
                }
            },
            axisLabel: {
                textStyle: {
                    color: contrastColor
                }
            },
            splitLine: {
                lineStyle: {
                    type: 'dashed',
                    color: '#aaa'
                }
            },
            splitArea: {
                areaStyle: {
                    color: contrastColor
                }
            }
        };
    };

    //var colorPalette = ['#dd6b66','#759aa0','#e69d87','#8dc1a9','#ea7e53','#eedd78','#73a373','#73b9bc','#7289ab', '#91ca8c','#f49f42'];
	var colorPalette = [
	  '#7EB26D',
	  '#EAB839',
	  '#6ED0E0',
	  '#EF843C',
	  '#E24D42',
	  '#1F78C1',
	  '#BA43A9',
	  '#705DA0',
	  '#508642',
	  '#CCA300',
	  '#447EBC',
	  '#C15C17',
	  '#890F02',
	  '#0A437C',
	  '#6D1F62',
	  '#584477',
	  '#B7DBAB',
	  '#F4D598',
	  '#70DBED',
	  '#F9BA8F',
	  '#F29191',
	  '#82B5D8',
	  '#E5A8E2',
	  '#AEA2E0',
	  '#629E51',
	  '#E5AC0E',
	  '#64B0C8',
	  '#E0752D',
	  '#BF1B00',
	  '#0A50A1',
	  '#962D82',
	  '#614D93',
	  '#9AC48A',
	  '#F2C96D',
	  '#65C5DB',
	  '#F9934E',
	  '#EA6460',
	  '#5195CE',
	  '#D683CE',
	  '#806EB7',
	  '#3F6833',
	  '#967302',
	  '#2F575E',
	  '#99440A',
	  '#58140C',
	  '#052B51',
	  '#511749',
	  '#3F2B5B',
	  '#E0F9D7',
	  '#FCEACA',
	  '#CFFAFF',
	  '#F9E2D2',
	  '#FCE2DE',
	  '#BADFF4',
	  '#F9D9F9',
	  '#DEDAF7',
	];
    var theme = {
        color: colorPalette,
        
        tooltip: {
            axisPointer: {
                lineStyle: {
                    color: contrastColor
                },
                crossStyle: {
                    color: contrastColor
                }
            }
        },
        legend: {
            textStyle: {
                color: contrastColor
            }
        },
        textStyle: {
            color: contrastColor
        },
        title: {
            textStyle: {
                color: contrastColor
            }
        },
        toolbox: {
            iconStyle: {
                normal: {
                    borderColor: contrastColor
                }
            }
        },
        dataZoom: {
            textStyle: {
                color: contrastColor
            },
			dataBackground: {
				lineStyle: {
					color: '#ffffff'
				}
			}
        },
        timeline: {
            lineStyle: {
                color: contrastColor
            },
            itemStyle: {
                normal: {
                    color: colorPalette[1]
                }
            },
            label: {
                normal: {
                    textStyle: {
                        color: contrastColor
                    }
                }
            },
            controlStyle: {
                normal: {
                    color: contrastColor,
                    borderColor: contrastColor
                }
            }
        },
        timeAxis: axisCommon(),
        logAxis: axisCommon(),
        valueAxis: axisCommon(),
        categoryAxis: axisCommon(),

        line: {
            symbol: 'circle',
			symbolSize: 1
        },
        graph: {
            color: colorPalette
        },
        gauge: {
            title: {
                textStyle: {
                    color: contrastColor
                }
            }
        },
        candlestick: {
            itemStyle: {
                normal: {
                    color: '#FD1050',
                    color0: '#0CF49B',
                    borderColor: '#FD1050',
                    borderColor0: '#0CF49B'
                }
            }
        }
    };
    theme.categoryAxis.splitLine.show = false;
    echarts.registerTheme('dark', theme);
}));