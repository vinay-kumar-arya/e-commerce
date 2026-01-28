import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import { ChartDataService } from '../../core/services/chart-data.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.css'],
})
export class ChartsComponent implements OnInit {
  selected: 'day' | 'weekly' | 'monthly' | 'yearly' = 'day';

  chartType: 'column' | 'line' | 'area' = 'column';
  chartData: 'user' | 'product' | 'category' | 'order' = 'user';

  Highcharts: typeof Highcharts = Highcharts;
  updateFlag = false;
  private chartRef?: Highcharts.Chart;

  chartCallback: Highcharts.ChartCallbackFunction = (chart) => {
    this.chartRef = chart;
  };

  chartOptions: Highcharts.Options = {
    chart: { type: 'column' },
    title: { text: '' },
    legend: { enabled: true },
    credits: { enabled: false },
    tooltip: { shared: true },
    xAxis: { categories: [] },
    yAxis: { title: { text: 'Count' } },
    plotOptions: {
      column: {
        dataLabels: { enabled: true },
        pointPadding: 0.2,
        borderWidth: 0,
      },
    },
    responsive: { rules: [] },
    series: [],
  };

  constructor(
    private chartService: ChartDataService,
    private datePipe: DatePipe,
  ) {}

  ngOnInit(): void {
    this.loadChart();
  }

  changeChartType(type: 'column' | 'line' | 'area') {
    this.chartType = type;
    this.loadChart();
  }

  changeChartData(data: 'user' | 'product' | 'category' | 'order') {
    this.chartData = data;
    this.loadChart();
  }

  dateFormat(timestamp: string | number) {
    const ms =
      typeof timestamp === 'number'
        ? timestamp
        : // handle numeric strings like "1700000000000"
          /^\d+$/.test(timestamp)
          ? Number(timestamp)
          : timestamp;

    const date = new Date(ms as any);
    const endDate = new Date(date);
    endDate.setDate(date.getDate() + 6);

    if (this.selected === 'day')
      return this.datePipe.transform(date, 'mediumDate');
    if (this.selected === 'weekly')
      return `${this.datePipe.transform(
        date,
        'dd MMM',
      )}-${this.datePipe.transform(
        endDate,
        'dd MMM',
      )} ${this.datePipe.transform(date, 'yyyy')}`;
    if (this.selected === 'monthly')
      return this.datePipe.transform(date, 'MMMM yy');
    return this.datePipe.transform(date, 'yyyy');
  }

  loadChart() {
    this.updateFlag = false;
    const meta =
      this.chartData === 'order'
        ? [
            { name: 'Newly Created Order', key: 'newlyCreated' },
            { name: 'Total Order', key: 'total' },
            { name: 'Pending Order', key: 'totalPending' },
            { name: 'Processing Order', key: 'totalProcessing' },
            { name: 'Shipped Order', key: 'totalShipped' },
            { name: 'Delivered Order', key: 'totalDelivered' },
            { name: 'Cancelled Order', key: 'totalCancelled' },
          ]
        : [
            { name: `Newly Created ${this.chartData}s`, key: 'newlyCreated' },
            { name: `Total ${this.chartData}s`, key: 'total' },
            { name: `Active ${this.chartData}s`, key: 'totalActive' },
            { name: `Inactive ${this.chartData}s`, key: 'totalInactive' },
            { name: `Deleted ${this.chartData}s`, key: 'totalDeleted' },
          ];

    this.chartService.chartData(this.chartData).subscribe((res) => {
      const raw = res.data[this.selected] ?? [];

      const categories = raw.map((r: any) => this.dateFormat(r.period) ?? '');
      const series = meta.map((m) => ({
        type: this.chartType,
        name: m.name,
        data: raw.map((r: any) => Number(r?.[m.key] ?? 0)),
      }));

      this.chartOptions = {
        ...this.chartOptions,
        chart: { type: this.chartType },
        title: { text: `${this.chartData}s Statistics Over Date` },
        xAxis: { categories },
        series,
      };

      this.chartRef?.update(this.chartOptions as any, true, true);
      setTimeout(() => (this.updateFlag = true), 0);
    });
  }
}
