import { Component, OnInit } from '@angular/core';
import { ColDef } from 'ag-grid-community';
import { AuthService } from '../../services/auth.service';
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title,
  DoughnutController,
  ArcElement
} from 'chart.js';

interface SalesData {
  documentNo: string;
  docDate: string;
  recordType: string;
  docType: string;
  salesOrg: string;
  customerId: string;
  totalOrders: number;
  totalOrderValue: number;
  totalBilled: number;
  currency: string;
}

interface DocValue {
  docType: string;
  value: number;
}

interface DateDocValues {
  date: string;
  values: DocValue[];
}

interface OrgValues {
  org: string;
  orders: number;
  billing: number;
}

@Component({
  selector: 'app-ovsales',
  standalone: false,
  templateUrl: './ovsales.component.html',
  styleUrl: './ovsales.component.scss'
})
export class OvsalesComponent implements OnInit {
  rowData: SalesData[] = [];
  filteredData: SalesData[] = [];
  customerId: string = '';
  showInsights: boolean = false;
  selectedCurrency: string = 'All';
  availableCurrencies: string[] = [];

  overallSalesColumnDefs: ColDef[] = [
    { headerName: 'Document No', field: 'documentNo' },
    { headerName: 'Doc Date', field: 'docDate' },
    { headerName: 'Record Type', field: 'recordType' },
    { headerName: 'Doc Type', field: 'docType' },
    { headerName: 'Sales Org', field: 'salesOrg' },
    { headerName: 'Customer ID', field: 'customerId' },
    { headerName: 'Total Orders', field: 'totalOrders' },
    { headerName: 'Order Value', field: 'totalOrderValue', valueFormatter: this.currencyFormatter },
    { headerName: 'Total Billed', field: 'totalBilled', valueFormatter: this.currencyFormatter },
    { headerName: 'Currency', field: 'currency' }
  ];

  defaultColDef: ColDef = { flex: 1, resizable: true, sortable: true, filter: true, headerClass: 'custom-header' };
  totalOrderValueByDate: DateDocValues[] = [];
  orderVsBillingByOrg: OrgValues[] = [];

  constructor(private authService: AuthService) {
    Chart.register(
      LineController, LineElement, PointElement,
      CategoryScale, LinearScale,
      Tooltip, Legend, Title,
      DoughnutController, ArcElement
    );
  }

  ngOnInit(): void {
    const user = this.authService.getUserInfo();
    if (user?.id) {
      this.customerId = user.id;
      this.fetchCustomerOverallSales(this.customerId);
    }
  }

   currencySymbols: { [code: string]: string } = {
    USD: '$', INR: '₹', EUR: '€', GBP: '£', JPY: '¥', AUD: 'A$', CAD: 'C$', CHF: 'CHF', CNY: '¥', KRW: '₩'
  };

  onCurrencyClick(currency: string): void {
    this.selectedCurrency = currency;
    this.applyCurrencyFilter();
  }

  fetchCustomerOverallSales(customerId: string): void {
    this.authService.getCustomerOverallSales().subscribe({
      next: (res: { data: SalesData[] }) => {
        this.rowData = res?.data ?? [];
        this.availableCurrencies = Array.from(new Set(this.rowData.map(d => d.currency))).filter(c => c);
        this.availableCurrencies.unshift('All');
        this.applyCurrencyFilter();
      },
      error: (err: any) => {
        console.error('Error loading data:', err);
        this.rowData = [];
      }
    });
  }

  applyCurrencyFilter(): void {
    this.filteredData = this.selectedCurrency === 'All' ? this.rowData : this.rowData.filter(d => d.currency === this.selectedCurrency);
    this.prepareInsights();
    if (this.showInsights) setTimeout(() => this.renderCharts(), 100);
  }

  prepareInsights(): void {
    const orderMap = new Map<string, Map<string, number>>();
    const billingMap = new Map<string, { orders: number, billing: number }>();

    for (const entry of this.filteredData) {
      const date = entry.docDate || 'UNKNOWN';
      const docType = entry.docType || 'UNKNOWN';
      const org = entry.salesOrg || 'UNKNOWN';
      const orderVal = Number(entry.totalOrderValue || 0);
      const billedVal = Number(entry.totalBilled || 0);

      if (!orderMap.has(date)) orderMap.set(date, new Map());
      const docMap = orderMap.get(date)!;
      docMap.set(docType, (docMap.get(docType) || 0) + orderVal);

      if (!billingMap.has(org)) billingMap.set(org, { orders: 0, billing: 0 });
      const orgData = billingMap.get(org)!;
      orgData.orders += orderVal;
      orgData.billing += billedVal;
    }

    this.totalOrderValueByDate = Array.from(orderMap.entries()).map(([date, docMap]) => ({
      date,
      values: Array.from(docMap.entries()).map(([docType, value]) => ({ docType, value }))
    }));

    this.orderVsBillingByOrg = Array.from(billingMap.entries()).map(([org, { orders, billing }]) => ({ org, orders, billing }));
  }

  toggleInsights(): void {
    this.showInsights = !this.showInsights;
    if (this.showInsights) setTimeout(() => this.renderCharts(), 100);
  }

  // ... [imports and class definition unchanged] ...

renderCharts(): void {
  ['chart1', 'chart2'].forEach(id => Chart.getChart(id)?.destroy());

  const validData = this.totalOrderValueByDate.map(d => ({
    date: d.date,
    values: d.values.filter(v => v.docType !== 'UNKNOWN')
  })).filter(d => d.values.length > 0);

  if (!validData.length || !this.orderVsBillingByOrg.length) {
    alert('No data available for charts.');
    return;
  }

  const commonOptions = { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top' } } };

  const docTypes = Array.from(new Set(validData.flatMap(d => d.values.map(v => v.docType))));
  const datasets = docTypes.map(docType => ({
    label: docType,
    data: validData.map(d => d.values.find(v => v.docType === docType)?.value || 0),
    borderColor: '#' + Math.floor(Math.random() * 16777215).toString(16),
    fill: false, tension: 0.4, pointStyle: 'circle', pointRadius: 5
  }));

  new Chart('chart1', {
    type: 'line',
    data: { labels: validData.map(d => d.date), datasets },
    options: { ...commonOptions, plugins: { title: { display: true, text: `Order Value Trend (${this.selectedCurrency})` }, legend: { position: 'bottom' } }, scales: { y: { beginAtZero: true } } }
  });

  const totalOrders = this.orderVsBillingByOrg.reduce((sum, d) => sum + d.orders, 0);
  const totalBilling = this.orderVsBillingByOrg.reduce((sum, d) => sum + d.billing, 0);

  new Chart('chart2', {
    type: 'doughnut',
    data: {
      labels: ['Order Value', 'Billed Amount'],
      datasets: [{
        data: [totalOrders, totalBilling],
        backgroundColor: ['#36A2EB', '#FF6384'],
        hoverOffset: 10
      }]
    },
    options: {
      ...commonOptions,
      cutout: '50%', // Correct placement
      plugins: {
        title: { display: true, text: `Order vs Billing (${this.selectedCurrency})` },
        legend: { position: 'bottom' },
        tooltip: {
          callbacks: {
            label: function(context) {
              const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
              const value = context.raw as number;
              const percentage = ((value / total) * 100).toFixed(1);
              return `${context.label}: ${value} (${percentage}%)`;
            }
          }
        }
      },
      onClick: (event, elements) => {
        if (elements.length > 0) {
          const index = elements[0].index;
          const label = ['Order Value', 'Billed Amount'][index];
          console.log(`Clicked on ${label}`);
        }
      }
    }
  });
}


  currencyFormatter(params: any): string {
    const value = params.value;
    const currencyCode = params.data?.currency || 'INR';
    const symbols: { [code: string]: string } = { USD: '$', INR: '₹', EUR: '€', GBP: '£', JPY: '¥', AUD: 'A$', CAD: 'C$', CHF: 'CHF', CNY: '¥', KRW: '₩' };
    const symbol = symbols[currencyCode.toUpperCase()] || currencyCode;
    return value != null ? `${symbol} ${new Intl.NumberFormat(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value)}` : value;
  }
}
