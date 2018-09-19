/* eslint no-eval: 0 */

import { MetricsPanelCtrl } from 'app/plugins/sdk';
import _ from 'lodash';
import kbn from 'app/core/utils/kbn';

import echarts from './libs/echarts-en.min';
//import ecUtil from './libs/echarts-en.common.min';
import ecStat from './libs/ecStat.min.js';
import './libs/extra';
import './libs/dark';
import './libs/leaflet';
import './libs/bmap.min.js';
import './libs/dataTool.min.js';
import './libs/echarts-leaflet';
import './libs/leaflet.css!';
import './style.css!';
import './libs/Canada.js';
import './libs/moment-with-locales.min.js';
import './libs/moment-with-locales.min';
import './libs/moment-timezone-with-data';
import ace from './node_modules/brace/index.js';
import './node_modules/brace/ext/language_tools.js';
import './node_modules/brace/theme/tomorrow_night_bright.js';
import './node_modules/brace/mode/javascript.js';

//import './libs/bmap.js';
//import './libs/getBmap.js';
//import './libs/echarts-gl';

import DataFormatter from './data_formatter';

//echarts.util = ecUtil;

export class Controller extends MetricsPanelCtrl {

    constructor($scope, $injector) {
        super($scope, $injector);

        const panelDefaults = {
            EchartsOption: 'option = {};',
            IS_UCD: false,
            METHODS: ['POST', 'GET'],
            ETYPE: ['line', 'pie', 'map'],
            url: '',
            method: 'POST',
            upInterval: 60000,
            esMetric: 'Count'
        };

        _.defaults(this.panel, panelDefaults);

        this.dataFormatter = new DataFormatter(this, kbn);

        this.events.on('data-received', this.onDataReceived.bind(this));
        this.events.on('data-error', this.onDataError.bind(this));
        this.events.on('data-snapshot-load', this.onDataReceived.bind(this));
        this.events.on('init-edit-mode', this.onInitEditMode.bind(this));
        this.events.on('panel-initialized', this.render.bind(this));
        this.editors = {};
        
        this.refreshData();
    }


    onDataReceived(dataList) {
        this.data = this.panel.IS_UCD ? this.customizeData : dataList;

        if (this.panel.type == 'map') {
            const data  = [];
            this.dataFormatter.setGeohashValues(dataList, data);
            this.data = this.dataFormatter.aggByProvince(data);
        }

        this.refreshed = true;
        this.render();
        this.refreshed = false;
    }


    onDataError(err) {
        this.render();
    }


    onInitEditMode() {
        this.addEditorTab('Customize Data', 'public/plugins/grafana-echarts-panel/partials/editor-ds.html', 2);
        this.addEditorTab('Echarts Option', 'public/plugins/grafana-echarts-panel/partials/editor-echarts.html', 3);
        this.panel.doInit = Function('ctrl', 'svgnode', this.panel.EchartsOption); // jshint ignore:line
    }
    
    doShowAceJs(nodeId) {
      setTimeout(function() {
          if ($('#'+nodeId).length === 1) {
              this.editors[nodeId] = ace.edit(nodeId);
              $('#'+nodeId).attr('id', nodeId + '_initialized');
              this.editors[nodeId] .setValue(this.panel[nodeId], 1);
              this.editors[nodeId] .getSession().on('change', function() {
                  var val = this.editors[nodeId] .getSession().getValue();
                  this.panel[nodeId] = val;
                  try {
                    this.setInitFunction();
                    this.render();
                  }
                  catch (err) {
                      console.error(err);
                  }
              }.bind(this));
              this.editors[nodeId] .setOptions({
                  enableBasicAutocompletion: true,
                  enableLiveAutocompletion: true,
                  theme: 'ace/theme/tomorrow_night_bright',
                  mode: 'ace/mode/javascript',
                  showPrintMargin: false
              });
          }
      }.bind(this), 100);
      return true;
    }
    
    setInitFunction() {
        this.panel.doInit = Function('ctrl', 'svgnode', this.panel.EchartsOption); // jshint ignore:line
    }
    
    refreshData() {
        let _this = this, xmlhttp;

        if (window.XMLHttpRequest) {
            xmlhttp = new XMLHttpRequest();
        } else {
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }

        let data = [];
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                _this.customizeData = JSON.parse(xmlhttp.responseText);
                _this.onDataReceived();
            }
        };

        if (this.panel.IS_UCD) {
            xmlhttp.open(_this.panel.method, _this.panel.url, true);
            xmlhttp.send();
        } else {
            xmlhttp = null;
        }

        this.$timeout(() => { this.refreshData(); }, _this.panel.upInterval);
    }


    getPanelPath() {
        // the system loader preprends publib to the url, add a .. to go back one level
        return '../' + grafanaBootData.settings.panels[this.pluginId].baseUrl + '/';
    }


    link(scope, elem, attrs, ctrl) {
        const $panelContainer = elem.find('.echarts_container')[0];
        let option = {}, echartsData = [];

        ctrl.refreshed = true;

        function setHeight() {
            let height = ctrl.height || panel.height || ctrl.row.height;
            if (_.isString(height)) {
                height = parseInt(height.replace('px', ''), 10);
            }

            $panelContainer.style.height = height + 'px';
        }

        setHeight();

        let myChart = echarts.init($panelContainer, 'dark');

        setTimeout(function () {
            myChart.resize();
        }, 1000);

        var callInterval = function callInterval() {
            var timeout, result;

            function func(callBack, interval) {
                var context = this; // jshint ignore:line
                var args = arguments;

                if (timeout) clearInterval(timeout);

                timeout = setInterval(function () {
                    result = callBack.apply(context, args);
                }, interval);

                return result;
            }

            return func;
        }();

        function render() {

            if (!myChart) {
                return;
            }

            setHeight();
            myChart.resize();

            if (ctrl.refreshed) {
                myChart.clear();
                echartsData = ctrl.data;

				try {
					eval(ctrl.panel.EchartsOption); // jshint ignore:line
				} catch (ex) {
					console.error(ex);
				}

                myChart.setOption(option);
            }
        }

        this.events.on('render', function () {
            render();
            ctrl.renderingCompleted();
        });
    }
}

Controller.templateUrl = 'partials/module.html';
