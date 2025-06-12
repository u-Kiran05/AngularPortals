import { Component, OnInit } from '@angular/core';
import { VendorService } from '../../services/vendor/vendor.service';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-vdashboard',
  standalone: false,
  templateUrl: './vdashboard.component.html',
  styleUrls: ['./vdashboard.component.scss']
})
export class VdashboardComponent implements OnInit {

  constructor(private vendorService: VendorService) {}
  
  ngOnInit(): void {
    this.vendorService.getVendorBIData().subscribe(data => {
      this.populateKPIs(data);
      this.createSpendDistributionChart(data.creditTotal, data.debitTotal);
      this.createInvoiceStatsChart(data.invoiceCount, data.avgInvoiceValue);
      this.createCreditDebitChart(data.creditTotal, data.debitTotal);
      this.createAvgSpendInvoiceChart(data.avgSpendPerPo, data.avgInvoiceValue);
    });
  }

  private populateKPIs(data: any) {
    this.setKPI('total-spend', data.totalSpend.toFixed(2), 'Total Spend');
    this.setKPI('total-po', data.totalPoCount, 'Total PO Count');
    this.setKPI('Average Spend per PO', data.avgSpendPerPo, 'Average Spend per PO');
    this.setKPI('aging-days', `${data.avgAgingDays} days`, 'Avg Aging Days');
  }

private createSpendDistributionChart(credit: number, debit: number) {
  const net = credit - debit;
  new Chart('spend-distribution-chart', {
    type: 'radar',
    data: {
      labels: ['Credit', 'Debit', 'Net Balance'],
      datasets: [{
        label: 'INR',
        data: [credit, debit, net],
        backgroundColor: 'rgba(63,81,181,0.2)',
        borderColor: '#3f51b5',
        pointBackgroundColor: '#3f51b5'
      }]
    },
    options: {
      plugins: { title: { display: true, text: 'Spend Radar View' } },
      responsive: true,
      maintainAspectRatio: false
    }
  });
}



  private createCreditDebitChart(credit: number, debit: number) {
    new Chart('credit-debit-chart', {
      type: 'doughnut',
      data: {
        labels: ['Credit', 'Debit'],
        datasets: [{
          data: [credit, debit],
          backgroundColor: ['#03a9f4', '#e91e63']
        }]
      },
      options: {
        plugins: { title: { display: true, text: 'Credit vs Debit' } },
        responsive: true,
        maintainAspectRatio: false,
        cutout: '60%'
      }
    });
  }

  private createAvgSpendInvoiceChart(avgSpend: number, avgInvoice: number) {
    new Chart('avg-spend-invoice-chart', {
      type: 'bar',
      data: {
        labels: ['Avg Spend / PO', 'Avg Invoice Value'],
        datasets: [{
          label: 'Value',
          data: [avgSpend, avgInvoice],
          backgroundColor: ['#ff9800', '#9c27b0']
        }]
      },
      options: {
        plugins: { title: { display: true, text: 'Average Spend & Invoice Value' } },
        responsive: true,
        maintainAspectRatio: false
      }
    });
  }
private createInvoiceStatsChart(count: number, avgValue: number) {
  new Chart('invoice-stats-chart', {
    type: 'bar',
    data: {
      labels: ['Invoice Count', 'Avg Invoice Value'],
      datasets: [{
        label: 'Metrics',
        data: [count, avgValue],
        backgroundColor: ['#673ab7', '#ff9800']
      }]
    },
    options: {
      indexAxis: 'y',
      plugins: { title: { display: true, text: 'Invoice Statistics' } },
      responsive: true,
      maintainAspectRatio: false
    }
  });
}

  private setKPI(id: string, value: string | number, label: string) {
    const el = document.getElementById(id);
    if (el) el.innerHTML = `<h3>${value}</h3><p>${label}</p>`;
  }
}
