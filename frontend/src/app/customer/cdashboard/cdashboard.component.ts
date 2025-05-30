import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { AuthService } from '../../services/auth.service';

Chart.register(...registerables);

@Component({
  selector: 'app-cdashboard',
  standalone: false,
  templateUrl: './cdashboard.component.html',
  styleUrls: ['./cdashboard.component.scss']
})
export class CdashboardComponent implements OnInit {
  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.getCustomerBI().subscribe((response) => {
      const data = response.data;
      
      // 1️⃣ KPIs
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

      const pendingDeliveries = (data.deliveryItems || []).filter((item: any) => {
        return item.STATUS?.toLowerCase() === 'pending' || item.STATUS == null;
      }).length;
      this.setKPI('open-inquiries', pendingDeliveries, 'Pending Deliveries');

      const totalAgingDays = (data.aging || []).reduce(
        (acc: number, item: { AGEING_DAYS: string }) => acc + parseFloat(item.AGEING_DAYS),
        0
      );
      const agingCount = (data.aging || []).length;
      const averageAgingDays = agingCount > 0 ? totalAgingDays / agingCount : 0;
      this.setKPI('total-payments', `${averageAgingDays.toFixed(1)} days`, 'Average Aging Days');

      // 2️⃣ Top 5 Products by Revenue (Horizontal Bar Chart)
      const productRevenueMap: { [key: string]: number } = {};
      (data.salesItems || []).forEach((item: any) => {
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
          plugins: {
            title: { 
              display: true, 
              text: 'Top 5 Products by Revenue',
              font: { size: 14 } // Reduced font size to match screenshot
            },
            legend: { display: false }
          },
          scales: {
            x: { 
              title: { 
                display: true, 
                text: 'Revenue',
                font: { size: 12 } // Smaller font for axis title
              },
              ticks: {
                font: { size: 10 } // Smaller font for axis labels
              }
            },
            y: { 
              title: { 
                display: true, 
                text: 'Product',
                font: { size: 12 }
              },
              ticks: {
                font: { size: 10 }
              }
            }
          }
        }
      });

      // 3️⃣ Payments vs Outstanding (Doughnut Chart)
      const totalPayments = (data.payments || []).reduce(
        (acc: number, item: any) => acc + parseFloat(item.AMOUNT || item.NETWR || '0'), 
        0
      );
      
      const totalOutstanding = (data.invoiceHeader || [])
        .filter((item: any) => item.STATUS !== 'Paid')
        .reduce((acc: number, item: any) => acc + parseFloat(item.NETWR || '0'), 0);
      
      new Chart('payments-outstanding-chart', {
        type: 'doughnut',
        data: {
          labels: ['Total Payments', 'Outstanding Invoices'],
          datasets: [{
            data: [totalPayments, totalOutstanding],
            backgroundColor: ['#4caf50', '#f44336'],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: { 
              display: true, 
              text: 'Payments vs Outstanding',
              font: { size: 14 } // Reduced font size
            },
            legend: {
              position: 'bottom',
              labels: {
                font: { size: 12 } // Smaller font for legend
              }
            }
          }
        }
      });

      // 4️⃣ Delivery Quantity by Product (Bar Chart)
      const deliveryQuantityMap: { [key: string]: number } = {};
      (data.deliveryItems || []).forEach((item: any) => {
        const product = item.ARKTX || 'Unknown';
        const quantity = parseFloat(item.LFIMG) || 0;
        if (product) {
          deliveryQuantityMap[product] = (deliveryQuantityMap[product] || 0) + quantity;
        }
      });
      
      const deliveryProducts = Object.entries(deliveryQuantityMap)
        .sort((a, b) => b[1] - a[1]);
      
      new Chart('delivery-quantity-chart', {
        type: 'bar',
        data: {
          labels: deliveryProducts.map(([product]) => product),
          datasets: [{
            label: 'Delivery Quantity',
            data: deliveryProducts.map(([, quantity]) => quantity),
            backgroundColor: '#2196f3'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: { 
              display: true, 
              text: 'Delivery Quantity by Product',
              font: { size: 14 } // Reduced font size
            },
            legend: { display: false }
          },
          scales: {
            y: { 
              title: { 
                display: true, 
                text: 'Quantity',
                font: { size: 12 }
              },
              ticks: {
                font: { size: 10 }
              }
            },
            x: { 
              title: { 
                display: true, 
                text: 'Product',
                font: { size: 12 }
              },
              ticks: {
                font: { size: 10 }
              }
            }
          }
        }
      });

      // 5️⃣ Aging Summary (Line Chart)
      const agingData = (data.aging || [])
        .sort((a: { FKDAT: string }, b: { FKDAT: string }) => 
          new Date(a.FKDAT).getTime() - new Date(b.FKDAT).getTime()
        );
      
      new Chart('aging-summary-chart', {
        type: 'line',
        data: {
          labels: agingData.map((row: { FKDAT: string }) => row.FKDAT),
          datasets: [{
            label: 'Aging Days',
            data: agingData.map((row: { AGEING_DAYS: string }) => parseFloat(row.AGEING_DAYS)),
            borderColor: '#ff9800',
            backgroundColor: 'rgba(255, 152, 0, 0.2)',
            fill: true,
            tension: 0.3
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: { 
              display: true, 
              text: 'Aging Days Trend Over Time',
              font: { size: 14 } // Reduced font size
            }
          },
          scales: {
            x: { 
              title: { 
                display: true, 
                text: 'Invoice Date (FKDAT)',
                font: { size: 12 }
              },
              ticks: {
                font: { size: 10 }
              }
            },
            y: { 
              title: { 
                display: true, 
                text: 'Aging Days',
                font: { size: 12 }
              },
              ticks: {
                font: { size: 10 }
              }
            }
          }
        }
      });
    });
  }

  private setKPI(elementId: string, value: any, label: string) {
    const element = document.getElementById(elementId);
    if (element) {
      element.innerHTML = `<h3>${value}</h3><p>${label}</p>`;
    }
  }
}