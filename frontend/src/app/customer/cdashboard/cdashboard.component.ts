import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { CustomerService } from '../../services/customer/customer.service';

Chart.register(...registerables);

@Component({
  selector: 'app-cdashboard',
  standalone: false,
  templateUrl: './cdashboard.component.html',
  styleUrls: ['./cdashboard.component.scss']
})
export class CdashboardComponent implements OnInit {
  constructor(private cuService: CustomerService) {}

  ngOnInit() {
    this.cuService.getCustomerBI().subscribe((response) => {
      const data = response?.data || {};


      this.populateKPIs(data);


      this.createTopProductsChart(data.salesItems || []);


      this.createPaymentsOutstandingChart(data.payments || [], data.invoiceHeader || []);


      this.createDeliveryQuantityChart(data.deliveryItems || []);


      this.createAgingSummaryChart(data.aging || []);
    });
  }

  private populateKPIs(data: any) {
    const totalCredit = (data.credit || []).reduce(
      (acc: number, item: { NETWR: string }) => acc + parseFloat(item.NETWR),
      0
    );
    const totalDebit = (data.debit || []).reduce(
      (acc: number, item: { NETWR: string }) => acc + parseFloat(item.NETWR),
      0
    );
    const availableCredit = totalCredit - totalDebit;
    this.setKPI('available-credit', `${availableCredit.toFixed(2)}`, 'Available Credit');

    const totalOrders = (data.salesHeader || []).length;
    this.setKPI('total-orders', totalOrders, 'Total Orders');

    const pendingDeliveries = (data.deliveryItems || []).filter((item: any) => 
      item.STATUS?.toLowerCase() === 'pending' || item.STATUS == null
    ).length;
    this.setKPI('open-inquiries', pendingDeliveries, 'Pending Deliveries');

    const totalAgingDays = (data.aging || []).reduce(
      (acc: number, item: { AGEING_DAYS: string }) => acc + parseFloat(item.AGEING_DAYS),
      0
    );
    const agingCount = (data.aging || []).length;
    const averageAgingDays = agingCount > 0 ? totalAgingDays / agingCount : 0;
    this.setKPI('total-payments', `${averageAgingDays.toFixed(1)} days`, 'Average Aging Days');
  }

  private createTopProductsChart(salesItems: any[]) {
    const productRevenueMap: { [key: string]: number } = {};
    salesItems.forEach((item) => {
      const product = item.ARKTX || 'Unknown';
      const revenue = parseFloat(item.NETWR) || 0;
      productRevenueMap[product] = (productRevenueMap[product] || 0) + revenue;
    });
    const sortedProducts = Object.entries(productRevenueMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
    new Chart('top-products-chart', {
      type: 'bar',
      data: {
        labels: sortedProducts.map(([product]) => product),
        datasets: [{
          label: 'Revenue',
          data: sortedProducts.map(([, revenue]) => revenue),
          backgroundColor: ['#4caf50', '#2196f3', '#ff9800', '#f44336', '#9c27b0']
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: { title: { display: true, text: 'Top 5 Products by Price' }, legend: { display: false } }
      }
    });
  }

  private createPaymentsOutstandingChart(payments: any[], invoices: any[]) {
    const totalPayments = payments.reduce((acc, item) => acc + parseFloat(item.AMOUNT || item.NETWR || '0'), 0);
    const totalOutstanding = invoices.filter(i => i.STATUS !== 'Paid')
      .reduce((acc, item) => acc + parseFloat(item.NETWR || '0'), 0);
    new Chart('payments-outstanding-chart', {
      type: 'doughnut',
      data: {
        labels: ['Total Payments', 'Outstanding Invoices'],
        datasets: [{ data: [totalPayments, totalOutstanding], backgroundColor: ['#4caf50', '#f44336'] }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { title: { display: true, text: 'Payments vs Outstanding' }, legend: { position: 'bottom' } }
      }
    });
  }

  private createDeliveryQuantityChart(deliveryItems: any[]) {
    const deliveryQuantityMap: { [key: string]: number } = {};
    deliveryItems.forEach(item => {
      const product = item.ARKTX || 'Unknown';
      const quantity = parseFloat(item.LFIMG) || 0;
      deliveryQuantityMap[product] = (deliveryQuantityMap[product] || 0) + quantity;
    });
    const deliveryProducts = Object.entries(deliveryQuantityMap).sort((a, b) => b[1] - a[1]);
    new Chart('delivery-quantity-chart', {
      type: 'bar',
      data: {
        labels: deliveryProducts.map(([product]) => product),
        datasets: [{ label: 'Delivery Quantity', data: deliveryProducts.map(([, q]) => q), backgroundColor: '#2196f3' }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { title: { display: true, text: 'Quantity (KG) delivered by Product' }, legend: { display: false } }
      }
    });
  }

  private createAgingSummaryChart(aging: any[]) {
    const agingData = aging.sort((a, b) => new Date(a.FKDAT).getTime() - new Date(b.FKDAT).getTime());
    new Chart('aging-summary-chart', {
      type: 'line',
      data: {
        labels: agingData.map(a => a.FKDAT),
        datasets: [{
          label: 'Aging Days',
          data: agingData.map(a => parseFloat(a.AGEING_DAYS)),
          borderColor: '#ff9800',
          backgroundColor: 'rgba(255,152,0,0.2)',
          fill: true,
          tension: 0.3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { title: { display: true, text: 'Aging Days Trend Over Time' } }
      }
    });
  }

  private setKPI(elementId: string, value: any, label: string) {
    const element = document.getElementById(elementId);
    if (element) {
      element.innerHTML = `<h3>${value}</h3><p>${label}</p>`;
    }
  }
}
