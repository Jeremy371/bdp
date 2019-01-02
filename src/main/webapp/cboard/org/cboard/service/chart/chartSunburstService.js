/**
 * Created by Owlnest on 2018/10/08.
 */
'use strict';
cBoard.service('chartSunburstService', function ($state, $window) {

    this.render = function (containerDom, option, scope, persist, drill, relations, chartConfig) {
        var render = new CBoardEChartRender(containerDom, option);
        render.addClick(chartConfig, relations, $state, $window);
        return render.chart(null, persist);
    };

    this.parseOption = function (data) {
    	
    	var data = [{
    	    name: 'Grandpa',
    	    children: [{
    	        name: 'Uncle Leo',
    	        value: 15,
    	        children: [{
    	            name: 'Cousin Jack',
    	            value: 2
    	        }, {
    	            name: 'Cousin Mary',
    	            value: 5,
    	            children: [{
    	                name: 'Jackson',
    	                value: 2
    	            }]
    	        }, {
    	            name: 'Cousin Ben',
    	            value: 4
    	        }]
    	    }, {
    	        name: 'Father',
    	        value: 10,
    	        children: [{
    	            name: 'Me',
    	            value: 5
    	        }, {
    	            name: 'Brother Peter',
    	            value: 1
    	        }]
    	    }]
    	}, {
    	    name: 'Nancy',
    	    children: [{
    	        name: 'Uncle Nike',
    	        children: [{
    	            name: 'Cousin Betty',
    	            value: 1
    	        }, {
    	            name: 'Cousin Jenny',
    	            value: 2
    	        }]
    	    }]
    	}];
    	
    	var option = {
    		    series: {
    		        type: 'sunburst',
    		        // highlightPolicy: 'ancestor',
    		        data: data,
    		        radius: [0, '90%'],
    		        label: {
    		            rotate: 'radial'
    		        }
    		    }
    	};

        return option;
    }; //parseOption 함수 끝
});
