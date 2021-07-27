import { useLayoutEffect, useRef } from "react";

import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import { dataProvider } from "../DataProvider";

const MessagesGraph = () => {
    const chartDiv = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        let container = am4core.create(chartDiv.current!, am4core.Container);
        container.width = am4core.percent(100);
        container.height = am4core.percent(100);
        container.layout = "vertical";
        
        /*

        chart.cursor = new am4charts.XYCursor();
        chart.cursor.behavior = "none";
        chart.cursor.lineX.disabled = true;
        chart.cursor.lineY.disabled = true;*/

        const createChart = (data: any) => {
            let chart = container.createChild(am4charts.XYChart);
            chart.zoomOutButton.disabled = true;
            
            let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
            //dateAxis.periodChangeDateFormats.setKey("month", "[bold]yyyy[/]");

            let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
            valueAxis.maxPrecision = 0;
            valueAxis.min = 0;
            //valueAxis.title.text = "Messages sent";
            valueAxis.cursorTooltipEnabled = false;

            valueAxis.marginTop = 10;
            valueAxis.marginBottom = 10;
            valueAxis.align = "right";
    
            let series = chart.series.push(new am4charts.StepLineSeries());
            series.xAxis = dateAxis;
            series.yAxis = valueAxis;
            series.data = data;
            series.dataFields.dateX = "date";
            series.dataFields.valueY = "messages";
            series.tooltipText = "{dateX}: [bold]{valueY}[/]";
            series.fill = am4core.color("#479ADB");
            series.stroke = am4core.color("#479ADB");
            series.noRisers = true;
            series.strokeWidth = 2;
            series.fillOpacity = 0.2;
            series.sequencedInterpolation = true;

            return chart;
        };


        /*
        let title = chart.titles.create();
        title.text = "Messages sent per day";
        title.fontSize = 20;
        title.marginBottom = 10;

        */
       let charts = [
           createChart(dataProvider.getPerDayData()),
           createChart(dataProvider.getPerMonthData())
       ];

        const onZoom = () => charts.forEach(c => (c.xAxes.getIndex(0) as am4charts.DateAxis).zoomToDates(dataProvider.getStart(), dataProvider.getEnd(), true, true));
        const onDataUpdated = () => charts.forEach(c => c.invalidateRawData());

        onZoom();

        dataProvider.on('updated-data', onDataUpdated);
        dataProvider.on('updated-zoom', onZoom);

        return () => {
            dataProvider.off('updated-data', onDataUpdated);
            dataProvider.off('updated-zoom', onZoom);
            container.dispose();
        };
    }, []);

    return <div ref={chartDiv} style={{ width: "100%", height: "700px" }}></div>;
};

export default MessagesGraph;
