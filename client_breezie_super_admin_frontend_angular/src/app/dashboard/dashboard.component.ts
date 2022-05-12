import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { ToastrService } from 'ngx-toastr';
import { AuthServiceService } from '../services/auth-service.service';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  isLoading:boolean=true;
  arrayList: string;
  constructor(
    private authService: AuthServiceService,
    private toastr: ToastrService
  ) {
    Chart.register(...registerables);
  }
  dashboardCardData;
  isCardDataLoading: boolean = false;
  revenueList = []
  ngOnInit(): void {
    this.getDashboardCardData();
  }

  basedOnPlan() {
    const basedOnPlanChartDetails = new Chart('basedOnPlanChartDetailsid', {
      type: 'doughnut',
      data: {
        labels:
          [
            'Starter Plan', 'Business Plan', 'Enterprise Plan'
          ],
        datasets: [{
          label: 'My First Dataset',
          data: [this.dashboardCardData?.starterPlan, this.dashboardCardData?.businessPlan, this.dashboardCardData?.enterprisePlan],
          backgroundColor: [
            'rgb(0,255,255)',
            'rgb(245,60,86)',
            'rgb(54,162,235)'
          ],
          hoverOffset: 4
        }]
      },
      options: {
        responsive: false,
        aspectRatio: 1.2,
        cutout: 70,
        plugins: {
          legend: {
            display: false,
            position: 'right',
            labels: {
              boxWidth: 10,
              usePointStyle: true,
              color: '#5B3F94',
              padding: 40
            }
          }
        },
      }
    },
    );
  }

  totalRevenueChart() {
   
    const totalRevenueChartDetails = new Chart('totalRevenueChartDetailsid', {
      type: 'bar',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [{
          data: this.revenueList,
          backgroundColor: [
            '#5B3F94'
          ],
          borderColor: [
            '#5B3F94'
          ],
          borderWidth: 0.1,
          borderRadius: Number.MAX_VALUE,
          barPercentage: 0.2,
          borderSkipped: false,
        }]
      },
      options: {
        plugins: {
          legend: {
            display: false
          }
        },
        responsive: true,
        scales: {
               
          y: {
            // max: 60,
            // min: 0,
            grid: {
              display: true,
              drawBorder: false,
              borderDash: [8, 4],
            },
             ticks: {
                  
                    callback: function(value, index, ticks) {
                        return '$' + value;
                    }
                }
          },
          x: {
            grid: {
              display: false,
              drawBorder: false,
            },
          }
        }
      }
    });
  }

  currencyConverter(currency, flag) {
    // Nine Zeroes for Billions
    if (flag === 'amount') {
      return (Math.abs(Number(currency)) >= 1.0e+9

        ? (Math.abs(Number(currency)) / 1.0e+9).
          toLocaleString("en-US", { style: "currency", currency: "INR" }) + "B"
        // Six Zeroes for Millions
        : (Math.abs(Number(currency))) >= 1.0e+6

          ? (Math.abs(Number(currency)) / 1.0e+6).
            toLocaleString("en-US", { style: "currency", currency: "INR" }) + "M"
          // Three Zeroes for Thousands
          : Math.abs(Number(currency)) >= 1.0e+3

            ? (Math.abs(Number(currency)) / 1.0e+3).toLocaleString("en-US", { style: "currency", currency: "INR" }) + "K"

            : Math.abs(Number(currency))).toLocaleString("en-US", { style: "currency", currency: "INR" });
    }
    else if (flag === 'count') {
      return (Math.abs(Number(currency)) >= 1.0e+9

        ? (Math.abs(Number(currency)) / 1.0e+9)
        + "B"
        // Six Zeroes for Millions
        : (Math.abs(Number(currency))) >= 1.0e+6

          ? (Math.abs(Number(currency)) / 1.0e+6)
          + "M"
          // Three Zeroes for Thousands
          : Math.abs(Number(currency)) >= 1.0e+3

            ? (Math.abs(Number(currency)) / 1.0e+3) + "K"

            : Math.abs(Number(currency)));
    }
  }

  getDashboardCardData() {
    this.isCardDataLoading = true;
    this.authService.dashboardData().subscribe((res) => {
      this.isLoading=false
      this.isCardDataLoading = false;
      this.dashboardCardData = res;
      for (let i = 0; i < this.dashboardCardData.totalRevenue.length; i++) {
        this.revenueList.push(this.dashboardCardData.totalRevenue[i] === null || this.dashboardCardData.totalRevenue[i] === undefined ? 0 : this.dashboardCardData.totalRevenue[i]?.value);
      }
      this.basedOnPlan()
      this.totalRevenueChart();

    }, err => {
      this.isCardDataLoading = false;
      this.toastr.error("Sorry, something went wrong!");
    });
  }
}


// xAxes: [
//   {
//     ticks: {
//       fontSize: 8,
//       fontColor: 'black',
//       autoSkip: false,
//       maxRotation: 0,
//       minRotation: 0,
//     },
//     scaleLabel: {
//       display: false,
//     },
//     barPercentage: 0.2,
//     gridLines: {
//       display: false,
//       drawBorder: false,
//     },
//   },
// ],
// yAxes: [
//   {
//     id: 'count1',
//     display: true,
//     position: 'right',
//     ticks: {
//       fontSize: 7,
//       fontColor: 'black',
//       beginAtZero: true,
//       callback: (value, index, values) => {
//         return this.currencyConverter(value, 'count');
//       },
//     },
//     scaleLabel: {
//       display: true,
//       minRotation: 0,
//       fontStyle: 'bold',
//       labelString: 'Count',
//       fontColor: 'black',
//       fontSize: 9,
//     },
//     gridLines: {
//       display: true,
//       drawBorder: false,
//     },
//   },
//   {
//     id: 'count2',
//     display: true,
//     position: 'left',
//     ticks: {
//       fontSize: 7,
//       fontColor: 'black',
//       beginAtZero: true,
//       callback: (value, index, values) => {
//         return this.currencyConverter(value, 'amount');
//       },
//     },
//     scaleLabel: {
//       display: true,
//       minRotation: 0,
//       fontStyle: 'bold',
//       labelString: 'Amount',
//       fontColor: 'black',
//       fontSize: 9,
//     },
//     gridLines: {
//       drawBorder: false,
//       display: false,
//     },
//   },
// ],
