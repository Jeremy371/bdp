/**
 * Created by Dongwook on 2018/08/01.
 */
'use strict';
cBoard.service('chartGoogleMapService', function (dataService, $compile, $filter) {

    var translate = $filter('translate');

    this.render = function (containerDom, option, scope, persist) {
        var render = new CBoardGoogleMapRender(containerDom, option); //이부분 갔다오면, 프리뷰에 차트 그리기 사전작업 하는 것임, containerDom에는 div#Preview/선택자 #preview, option에는 kpi옵션들: value, style, edit, refresh값이 들어가 있다.
        var html = render.html(persist);
        if (scope) {
            containerDom.append($compile(html)(scope));
        } else {
            containerDom.html(html);
        }
        //return render.realTimeTicket();
        makeGoogleMap(); //함수 정의하기
    };

    this.parseOption = function (data) {
        var option = {};
        var config = data.chartConfig;
        var casted_keys = data.keys;
        var casted_values = data.series;
        var aggregate_data = data.data;
        var newValuesConfig = data.seriesConfig;

        option.kpiValue = aggregate_data.length > 0 ? aggregate_data[0][0] : 'N/A';
        if (config.values[0].format) {
            option.kpiValue = numbro(option.kpiValue).format(config.values[0].format);
        }
        option.kpiName = config.values[0].name;
        option.style = config.values[0].style;
        option.edit = translate("COMMON.EDIT");
        option.refresh = translate("COMMON.REFRESH");
        return option;
    };
});