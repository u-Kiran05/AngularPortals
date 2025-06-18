import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../../services/employee/employee.service';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-edashboard',
  standalone:false,
  templateUrl: './edashboard.component.html',
  styleUrls: ['./edashboard.component.scss']
})
export class EdashboardComponent implements OnInit {
  kpi: any = {};

  constructor(private employeeService: EmployeeService) {}

  ngOnInit(): void {
    this.fetchKPI();
    this.initCharts();
  }

  fetchKPI(): void {
    this.employeeService.getEmployeeKPI().subscribe({
      next: (res) => {
        if (res.success) {
          this.kpi = res.data;
        }
      },
      error: (err) => {
        console.error('Error fetching KPI:', err);
      }
    });
  }

  initCharts(): void {
    // Attendance Line Chart
    new Chart('attendance-line-chart', {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
          label: 'Attendance (%)',
          data: [96, 92, 88, 94, 90, 93],
          fill: false,
          borderColor: 'rgba(75, 192, 192, 1)',
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: true } }
      }
    });

    // Leave Type Bar Chart
    new Chart('leave-type-bar-chart', {
      type: 'bar',
      data: {
        labels: ['Sick Leave', 'Casual Leave', 'Earned Leave'],
        datasets: [{
          label: 'Leaves Taken',
          data: [4, 2, 5],
          backgroundColor: ['#ff6384', '#36a2eb', '#ffce56']
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } }
      }
    });

    // Leave Summary Donut Chart
    new Chart('leave-summary-donut', {
      type: 'doughnut',
      data: {
        labels: ['Used', 'Remaining'],
        datasets: [{
          label: 'Leave Balance',
          data: [8, 12],
          backgroundColor: ['#4caf50', '#cfd8dc']
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { position: 'bottom' } }
      }
    });

    // Project Hours Chart
    new Chart('project-hours-chart', {
      type: 'bar',
      data: {
        labels: ['Project A', 'Project B', 'Project C'],
        datasets: [{
          label: 'Hours Logged',
          data: [120, 95, 130],
          backgroundColor: '#7986cb'
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } }
      }
    });
  }
}
