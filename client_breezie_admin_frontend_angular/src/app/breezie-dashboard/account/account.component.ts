import {
  AfterContentChecked,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { country } from './country';
import {
  Form,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { EmployeeService } from 'src/app/services/employee.service';
import { Router } from '@angular/router';
import { LoginComponent } from 'src/app/auth/login/login.component';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { RegisterService } from 'src/app/services/register.service';
import { LocationService } from 'src/app/services/location.service';
import { VisitorResponse } from 'src/app/models/visitor';
import { VisitorService } from 'src/app/services/visitor.service';
import { T } from '@angular/cdk/keycodes';
import { AccountsService } from 'src/app/services/accounts.service';
import { AccountAddOnsResponse } from 'src/app/models/account';
import { fakeAsync } from '@angular/core/testing';
import { PaymentService } from 'src/app/services/payment/payment.service';
import { jsPDF } from 'jspdf';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { PaymentSuccessComponent } from 'src/app/modules/payment-success/payment-success.component';
import { PaymentFailedComponent } from 'src/app/modules/payment-failed/payment-failed.component';
declare var Razorpay: any;
export interface PeriodicElement {
  Date: number;
  Description: string;
  TransactionStatus: number;
  symbol: string;
  ReceiptDownload: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {
    Date: 1,
    Description: 'Hydrogen',
    TransactionStatus: 1.0079,
    symbol: 'H',
    ReceiptDownload: 'Bangalore',
  },
];
@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css'],
})
export class AccountComponent implements OnInit, AfterContentChecked {
  pincode: number = 0;
  // displayedColumns: string[] = ['Date', 'Description', 'TransactionStatus', 'Total', 'ReceiptDownload'];
  // dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  // selection = new SelectionModel<PeriodicElement>(true, []);
  visitors: VisitorResponse[];
  account: AccountAddOnsResponse[];
  displayedColumns: string[] = [
    'Visitor',
    'Host',
    'Visit',
    'Location',
    'CustomField',
  ];
  dataSource = new MatTableDataSource([]);
  selection = new SelectionModel<VisitorResponse>(true, []);
  country = country;
  setBusinessPayment = true;
  forMoreLocations = false;
  setEnterpricePayment = true;
  forMoreLocationsInEnterprice = false;
  // addOnsBreazie=false
  addOnsBreazie = true;
  starterPlanDetalis = false;
  bussinessPlan = false;
  spinner: boolean = false;
  // bussinessPlanButton=true
  enterpricePlan = false;
  detailsOfEnterpricePlan = false;
  detailsOfStarterPlanUSD = true;
  detailsOfBusinessPlan = false;
  detailsOfStarterPlanEUR = false;
  locationBusiness = false;
  AccountDetailsForm: FormGroup;
  InvoiceAddressForm: FormGroup;
  creditForm: FormGroup;
  businessForm: FormGroup;
  ordersForm: FormGroup;

  currenctSelected = 'USD';

  options = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];

  plansDataAddOns;
  plansCatering;
  plansCateringMonthlyPrice;
  plansDeliveries;
  planDeliveriesMonthlyPlan;
  plansSms;
  planSmsMonthlyPrice;

  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog,
    private address: EmployeeService,
    private divice: LocationService,
    private visitorService: VisitorService,
    private router: Router,
    private toastr: ToastrService,
    private accountService: AccountsService,
    private changeDetector: ChangeDetectorRef,
    private paymentService: PaymentService
  ) {
    this.getINR();
    (this.AccountDetailsForm = this.fb.group({
      accountName: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.pattern(/^[a-zA-Z0-9][a-zA-Z0-9/._ ]*$/),
        Validators.maxLength(50),
      ]),
      billingContactName: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.pattern(/^[a-zA-Z][a-zA-Z ]*$/),
        Validators.maxLength(30),
      ]),
      billingContactEmail: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9._]+@[a-zA-Z0-9.]+\.[a-zA-Z]{2,4}$/),
        Validators.email,
      ]),
    })),
      (this.InvoiceAddressForm = this.fb.group({
        fullName: new FormControl(
          {
            value: '',
            disabled: true,
          },
          [
            Validators.required,
            Validators.minLength(3),
            Validators.pattern(/^[a-zA-Z][a-zA-Z ]*$/),
            Validators.maxLength(30),
          ]
        ),
        hostingRegion: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(30),
        ]),
        address: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          Validators.pattern(/^[#.0-9a-zA-Z\s,-]+$/),
          Validators.maxLength(40),
        ]),
        state: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          Validators.pattern(/^[a-zA-Z][a-zA-Z ]*$/),
          Validators.maxLength(30),
        ]),
        pincode: new FormControl('', [
          Validators.required,
          Validators.minLength(6),
          Validators.pattern(/^[0-9]+$/),
          Validators.maxLength(6),
        ]),
        city: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          Validators.pattern(/^[a-zA-Z]+(?:[\s-][a-zA-Z]+)*$/),
          Validators.maxLength(30),
        ]),
        phone: new FormControl('', [
          Validators.required,
          Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$'),
        ]),
        countries: new FormControl({
          value: '',
          disabled: true,
        }),
      })),
      (this.creditForm = this.fb.group({
        cardHoldersName: new FormControl('', [Validators.required]),
        cardDetails: new FormControl('', [Validators.required]),
      }));
    this.ordersForm = this.fb.group({
      name: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.pattern(/^[a-zA-Z][a-zA-Z ]*$/),
        Validators.maxLength(30),
      ]),
      email: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9._]+@[a-zA-Z0-9.]+\.[a-zA-Z]{2,4}$/),
        Validators.email,
      ]),
      country: new FormControl('', Validators.required),
      address: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
        Validators.pattern(/^[#.0-9a-zA-Z\s,-]+$/),
        Validators.maxLength(50),
      ]),
      state: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
        Validators.pattern(/^[a-zA-Z][a-zA-Z ]*$/),
        Validators.maxLength(30),
      ]),
      zip: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern(/^[0-9]+$/),
        Validators.maxLength(6),
      ]),
      city: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
        Validators.pattern(/^[a-zA-Z]+(?:[\s-][a-zA-Z]+)*$/),
        Validators.maxLength(30),
      ]),
      phone: new FormControl('', [
        Validators.required,
        Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$'),
      ]),
    });

    this.getDeivice();
    this.getAddOns();
    // this.getAllVisitors()
  }

  ngOnInit(): void {
    this.businessForm = this.fb.group({});
    this.getRegister();
    this.getAccounts();
    this.getAddress();
    this.getPlans();
    this.getAddOns();
    this.usdCurrency = true;
    let event = { value: 'monthly' };
    setTimeout(() => {
      this.paymentValue(event);
    }, 500);
  }

  userDisplayName: any;
  ngAfterContentChecked() {
    this.changeDetector.detectChanges();
    this.userDisplayName = localStorage.getItem('userName');
  }

  countryCode: any;
  onCountryChange(e: any) {
    this.countryCode = e.dialCode;
  }

  creditSubmit() {}

  numberOnly(event: any): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  data: any = [];
  State: string = '';
  City: string = '';
  Country: string = '';
  pincodeError: boolean = false;
  getAddress() {
    this.spinner = true;
    if (this.AccountDetailsForm.value.pincode) {
      this.address
        .getAddress(this.AccountDetailsForm.value.pincode)
        .subscribe((res) => {
          this.spinner = false;
          this.data = res;
          if (res.result.length > 0) {
            this.pincodeError = false;
            this.State = this.data.result[0].state;
            this.City = this.data.result[0].city;
            // this.Country = "INDIA"
            this.AccountDetailsForm.get('city')?.patchValue(this.City);
            this.AccountDetailsForm.get('state')?.patchValue(this.State);
            this.AccountDetailsForm.get('country')?.patchValue(this.Country);
          } else {
            this.pincodeError = true;
          }
        });
    }
  }
  submit() {
    this.accountService
      .accountDetails(this.AccountDetailsForm.value)
      .subscribe((res) => {
        if(!res.error){
          this.toastr.success(res.message)
        }else{
          this.toastr.error(res.message)
        }
      }, err => {
        if (err.status) {
          this.spinner=false;
          this.toastr.error(err.error.message);
          this.logOut();
        } else {
          this.toastr.error("CONNECTION_ERROR");
          this.spinner=false;
        }
      });
  }
  history;
  accountNameOrder: string;
  getAccounts() {
    this.accountService.getAccounts().subscribe((res) => {
      if (!res.error) {
        this.history = res.accountdetails[0].history;

        this.dataSource = new MatTableDataSource([...this.history]);
        this.accountNameOrder =
          res.accountdetails[0].accountDetails.accountName;

        this.AccountDetailsForm.patchValue(
          res.accountdetails[0].accountDetails
        );
        this.InvoiceAddressForm.patchValue(
          res.accountdetails[0].invoiceAddress
        );
        this.ordersForm.patchValue({
          name: res.accountdetails[0].accountDetails.billingContactName,
          email: res.accountdetails[0].accountDetails.billingContactEmail,
          country: res.accountdetails[0].invoiceAddress.hostingRegion,
          address: res.accountdetails[0].invoiceAddress.address,
          state: res.accountdetails[0].invoiceAddress.state,
          zip: res.accountdetails[0].invoiceAddress.pincode,
          city: res.accountdetails[0].invoiceAddress.city,
          phone: res.accountdetails[0].invoiceAddress.phone,
        });
      }
    });
  }

  invoiceSubmit() {
    this.accountService
      .invoiceAddress(this.InvoiceAddressForm.value)
      .subscribe((res) => {
        if(!res.error){
          this.toastr.success(res.message);
        }else{
          this.toastr.error(res.message)
        }
      }, err => {
        if (err.status) {
          this.spinner=false;
          this.toastr.error(err.error.message);
          this.logOut();
        } else {
          this.toastr.error("CONNECTION_ERROR");
          this.spinner=false;
        }
      });
  }
  logOut() {
    this.router.navigate(['/auth/login']);
    localStorage.clear();
  }
  getDeivice() {
    this.spinner = true;
    this.divice.getDeiviceLocation().subscribe((res) => {
      this.spinner = false;
      res.deviceData;

      res.deviceData.forEach((ele) => {
        let location = {
          accountName: ele.deviceIdentifier,
        };
        // this.AccountDetailsForm.patchValue({
        //   accountName: location.accountName,

        // })
      });
    });
  }

  // getAllVisitors() {
  //   this.spinner = true
  //   var start = 'All'
  //   var end = 'All'
  //   this.accountService.getVisitor(start, end).subscribe(res => {
  //     this.spinner = false
  //     this.visitors = res.visitorArray;
  //     this.dataSource = new MatTableDataSource([
  //       ...res.visitorArray
  //     ]);
  //   })
  // }

  planId;
  currencySelect;
  starterPlan: boolean = true;
  dataStarter = false;
  usdCurrency: boolean = true;
  eruCurrency: boolean = false;
  detailsPlanName;
  startUpMonthAmount: number = 0;
  startUpYearAmount: number = 0;
  businessMonthAmount: number = 0;
  businessYearAmount: number = 0;
  enterPriseMonthAmount: number = 0;
  enterPriseYearAmount: number = 0;
  onStarterPlan(data, currenctSelected, id) {
    this.backButtonShow = false;
    this.currencySelect = currenctSelected;
    this.planId = id;
    this.detailsPlanName = data.DisplayName;
    if (currenctSelected === 'USD') {
      this.usdCurrency = true;
      this.eruCurrency = false;
      if (data.DisplayName === 'Starter Plan') {
        data.price.forEach((ele) => {
          if (ele.currency === 'USD') {
            this.startUpMonthAmount = ele.monthlyprice;
            this.startUpYearAmount = ele.annualprice * 12;
            this.monthPayment = `$${ele.monthlyprice} USD/month`;
            this.annualPayment = `$${ele.annualprice} USD/month`;
          }
        });
      } else if (data.DisplayName === 'Business Plan') {
        data.price.forEach((ele) => {
          if (ele.currency === 'USD') {
            this.businessMonthAmount = ele.monthlyprice;
            this.businessYearAmount = ele.annualprice * 12;
            this.monthBusinessPayment = `$${ele.monthlyprice} USD/month`;
            this.annualBusinessPayment = `$${ele.annualprice} USD/month`;
          }
        });
      } else if (data.DisplayName === 'Enterprise Plan') {
        data.price.forEach((ele) => {
          if (ele.currency === 'USD') {
            this.enterPriseMonthAmount = ele.monthlyprice;
            this.enterPriseYearAmount = ele.annualprice * 12;
            this.monthEnterprisePayment = `$${ele.monthlyprice} USD/month`;
            this.annualEnterprisePayment = `$${ele.annualprice} USD/month`;
          }
        });
      }
    } else {
      this.usdCurrency = false;
      this.eruCurrency = true;
      if (data.DisplayName === 'Starter Plan') {
        data.price.forEach((ele) => {
          if (ele.currency === 'ERU') {
            this.startUpMonthAmount = ele.monthlyprice;
            this.startUpYearAmount = ele.annualprice * 12;
            this.monthPayment = `€${ele.monthlyprice} EUR/month`;
            this.annualPayment = `€${ele.annualprice} EUR/month`;
          }
        });
      } else if (data.DisplayName === 'Business Plan') {
        data.price.forEach((ele) => {
          if (ele.currency === 'ERU') {
            this.businessMonthAmount = ele.monthlyprice;
            this.businessYearAmount = ele.annualprice * 12;
            this.monthBusinessPayment = `€${ele.monthlyprice} EUR/month`;
            this.annualBusinessPayment = `€${ele.annualprice} EUR/month`;
          }
        });
      } else if (data.DisplayName === 'Enterprise Plan') {
        data.price.forEach((ele) => {
          if (ele.currency === 'ERU') {
            this.enterPriseMonthAmount = ele.monthlyprice;
            this.enterPriseYearAmount = ele.annualprice * 12;
            this.monthEnterprisePayment = `€${ele.monthlyprice} EUR/month`;
            this.annualEnterprisePayment = `€${ele.annualprice} EUR/month`;
          }
        });
      }
    }

    if (data.name === 'Starter Plan') {
      this.detailsOfStarterPlanUSD = true;
      this.detailsOfBusinessPlan = false;
      this.detailsOfEnterpricePlan = false;
    } else if (data.name === 'Business Plan (per location)') {
      this.detailsOfStarterPlanUSD = false;
      this.detailsOfBusinessPlan = true;
      this.detailsOfEnterpricePlan = false;
    } else {
      this.detailsOfStarterPlanUSD = false;
      this.detailsOfBusinessPlan = false;
      this.detailsOfEnterpricePlan = true;
    }
    this.starterPlan = false;
    this.orderListData = false;
    if (data.planId == 'plan-starter') {
      this.dataStarter = true;
      this.starterPlanDetalis = true;
    } else {
      this.bussinessPlan = false;
      // this.detailsOfBusinessPlan=true
      this.starterPlanDetalis = true;
    }
    let event = { value: 'monthly' };
    this.paymentValue(event);
  }

  noOfLocation: number = 1;
  amountUsd: number = 0;
  amountEUR: number = 0;
  // startUpMonthAmount:number = 0
  // businessMonthAmount:number = 0
  // enterPriseMonthAmount:number = 0
  // startUpYearAmount:number = 0
  // businessYearAmount:number = 0
  // enterPriseYearAmount:number = 0
  getLocation(location) {
    this.noOfLocation = location;
  }

  dataOfAddOns = false;
  redirectToAddons() {
    if (this.usdCurrency) {
      if (this.monthlyValue) {
        if (this.detailsOfStarterPlanUSD) {
          this.amountUsd = this.startUpMonthAmount * 1;
        } else if (this.detailsOfBusinessPlan) {
          this.amountUsd = this.businessMonthAmount * this.noOfLocation;
        } else if (this.detailsOfEnterpricePlan) {
          this.amountUsd = this.enterPriseMonthAmount * this.noOfLocation;
        }
      } else if (this.annualValue) {
        if (this.detailsOfStarterPlanUSD) {
          this.amountUsd = this.startUpYearAmount * 1;
        } else if (this.detailsOfEnterpricePlan) {
          this.amountUsd = this.enterPriseYearAmount * this.noOfLocation;
        } else if (this.detailsOfBusinessPlan) {
          this.amountUsd = this.businessYearAmount * this.noOfLocation;
        }
        // this.amountUsd=this.yearAmount*location
      }
    } else if (this.eruCurrency) {
      if (this.monthlyValue) {
        if (this.detailsOfStarterPlanUSD) {
          this.amountEUR = this.startUpMonthAmount * 1;
        } else if (this.detailsOfBusinessPlan) {
          this.amountEUR = this.businessMonthAmount * this.noOfLocation;
        } else if (this.detailsOfEnterpricePlan) {
          this.amountEUR = this.enterPriseMonthAmount * this.noOfLocation;
        }
      } else if (this.annualValue) {
        if (this.detailsOfStarterPlanUSD) {
          this.amountEUR = this.startUpYearAmount * 1;
        } else if (this.detailsOfEnterpricePlan) {
          this.amountEUR = this.enterPriseYearAmount * this.noOfLocation;
        } else if (this.detailsOfBusinessPlan) {
          this.amountEUR = this.businessYearAmount * this.noOfLocation;
        }
        // this.amountUsd=this.yearAmount*location
      }
    }
    this.dataOfAddOns = true;
    this.starterPlanDetalis = false;
  }

  monthPayment = '$59 USD/month';
  annualPayment = '$49 USD/month';
  monthBusinessPayment = '$115 USD/month';
  annualBusinessPayment = '$99 USD/month';
  monthEnterprisePayment = '$169 USD/month';
  annualEnterprisePayment = '$149 USD/month';

  confirmPlan(events) {
    this.currencySelect = events;
    if (events === 'USD') {
      this.usdCurrency = true;
      this.eruCurrency = false;
      this.plansData.forEach((data) => {
        if (data.DisplayName === 'Starter Plan') {
          data.price.forEach((ele) => {
            if (ele.currency === 'USD') {
              this.startUpMonthAmount = ele.monthlyprice;
              this.startUpYearAmount = ele.annualprice * 12;
              this.monthPayment = `$${ele.monthlyprice} USD/month`;
              this.annualPayment = `$${ele.annualprice} USD/month`;
            }
          });
        } else if (data.DisplayName === 'Business Plan') {
          data.price.forEach((ele) => {
            if (ele.currency === 'USD') {
              this.businessMonthAmount = ele.monthlyprice;
              this.businessYearAmount = ele.annualprice * 12;
              this.monthBusinessPayment = `$${ele.monthlyprice} USD/month`;
              this.annualBusinessPayment = `$${ele.annualprice} USD/month`;
            }
          });
        } else if (data.DisplayName === 'Enterprise Plan') {
          data.price.forEach((ele) => {
            if (ele.currency === 'USD') {
              this.enterPriseMonthAmount = ele.monthlyprice;
              this.enterPriseYearAmount = ele.annualprice * 12;
              this.monthEnterprisePayment = `$${ele.monthlyprice} USD/month`;
              this.annualEnterprisePayment = `$${ele.annualprice} USD/month`;
            }
          });
        }
      });
    } else {
      this.usdCurrency = false;
      this.eruCurrency = true;
      this.plansData.forEach((data) => {
        if (data.DisplayName === 'Starter Plan') {
          data.price.forEach((ele) => {
            if (ele.currency === 'EUR') {
              this.startUpMonthAmount = ele.monthlyprice;
              this.startUpYearAmount = ele.annualprice * 12;
              this.monthPayment = `€${ele.monthlyprice} EUR/month`;
              this.annualPayment = `€${ele.annualprice} EUR/month`;
            }
          });
        } else if (data.DisplayName === 'Business Plan') {
          data.price.forEach((ele) => {
            if (ele.currency === 'EUR') {
              this.businessMonthAmount = ele.monthlyprice;
              this.businessYearAmount = ele.annualprice * 12;
              this.monthBusinessPayment = `€${ele.monthlyprice} EUR/month`;
              this.annualBusinessPayment = `€${ele.annualprice} EUR/month`;
            }
          });
        } else if (data.DisplayName === 'Enterprise Plan') {
          data.price.forEach((ele) => {
            if (ele.currency === 'EUR') {
              this.enterPriseMonthAmount = ele.monthlyprice;
              this.enterPriseYearAmount = ele.annualprice * 12;
              this.monthEnterprisePayment = `€${ele.monthlyprice} EUR/month`;
              this.annualEnterprisePayment = `€${ele.annualprice} EUR/month`;
            }
          });
        }
      });
    }
    let event = { value: 'monthly' };
    this.paymentValue(event);
    this.getLocation(this.noOfLocation);
  }

  onSelectedPlan(data) {
    this.starterPlan = false;
    this.starterPlanDetalis = true;
    this.orderListData = false;
    this.dataStarter = true;
  }

  durations = 'monthly';
  cateringAddOn;
  smsAddOn;
  deliveriesAddOn;
  eventValue;
  monthlyValue: boolean = true;
  annualValue: boolean = false;
  subscriptionType = 'Monthly';
  paymentValue(event) {
    this.durations = event.value;
    if (event.value === 'monthly') {
      this.monthlyValue = true;
      this.annualValue = false;
      this.subscriptionType = 'Monthly';
    } else {
      this.monthlyValue = false;
      this.annualValue = true;
      this.subscriptionType = 'Annual';
    }

    if (this.usdCurrency) {
      if (event.value === 'monthly') {
        this.plansDataAddOns.forEach((ele) => {
          if (ele.name === 'SMS') {
            ele.price.forEach((value) => {
              if (value.currency === 'USD') {
                this.smsAddOn = value.monthlyprice + ' ' + 'USD';
              }
            });
          }
          if (ele.name === 'Catering') {
            ele.price.forEach((value) => {
              if (value.currency === 'USD') {
                this.cateringAddOn = value.monthlyprice + ' ' + 'USD';
              }
            });
          }
          if (ele.name === 'Deliveries') {
            ele.price.forEach((value) => {
              if (value.currency === 'USD') {
                this.deliveriesAddOn = value.monthlyprice + ' ' + 'USD';
              }
            });
          }
        });
      } else if (event.value === 'annual') {
        this.plansDataAddOns.forEach((ele) => {
          if (ele.name === 'SMS') {
            ele.price.forEach((value) => {
              if (value.currency === 'USD') {
                this.smsAddOn = value.annualprice * 12 + ' ' + 'USD';
              }
            });
          }
          if (ele.name === 'Catering') {
            ele.price.forEach((value) => {
              if (value.currency === 'USD') {
                this.cateringAddOn = value.annualprice + ' ' + 'USD';
              }
            });
          }
          if (ele.name === 'Deliveries') {
            ele.price.forEach((value) => {
              if (value.currency === 'USD') {
                this.deliveriesAddOn = value.annualprice + ' ' + 'USD';
              }
            });
          }
        });
      }
    } else {
      if (event.value === 'monthly') {
        this.plansDataAddOns.forEach((ele) => {
          if (ele.name === 'SMS') {
            ele.price.forEach((value) => {
              if (value.currency === 'EUR') {
                this.smsAddOn = value.monthlyprice + ' ' + 'EUR';
              }
            });
          }
          if (ele.name === 'Catering') {
            ele.price.forEach((value) => {
              if (value.currency === 'EUR') {
                this.cateringAddOn = value.monthlyprice + ' ' + 'EUR';
              }
            });
          }
          if (ele.name === 'Deliveries') {
            ele.price.forEach((value) => {
              if (value.currency === 'EUR') {
                this.deliveriesAddOn = value.monthlyprice + ' ' + 'EUR';
              }
            });
          }
        });
      } else if (event.value === 'annual') {
        this.plansDataAddOns.forEach((ele) => {
          if (ele.name === 'SMS') {
            ele.price.forEach((value) => {
              if (value.currency === 'EUR') {
                this.smsAddOn = value.annualprice + ' ' + 'EUR';
              }
            });
          }
          if (ele.name === 'Catering') {
            ele.price.forEach((value) => {
              if (value.currency === 'EUR') {
                this.cateringAddOn = value.annualprice + ' ' + 'EUR';
              }
            });
          }
          if (ele.name === 'Deliveries') {
            ele.price.forEach((value) => {
              if (value.currency === 'EUR') {
                this.deliveriesAddOn = value.annualprice + ' ' + 'EUR';
              }
            });
          }
        });
      }
    }
    this.getLocation(this.noOfLocation);
  }

  cateringId = null;
  cateringAmountUsd = 0;
  cateringAmountEur = 0;
  cateringShow: boolean = false;
  cateingName;
  nextDisable: boolean = true;
  cateringCheck(event, value) {
    if (event.checked) {
      this.plansDataAddOns.forEach((ele) => {
        if (ele.name === 'Catering') {
          this.cateringId = ele._id;
        }
      });
    } else {
      this.cateringId = null;
    }
    this.cateringShow = event.checked;
    this.cateingName = 'Catering';
    if (event.checked) {
      value = value.split(' ');
      if (value[1] === 'USD') {
        if (this.monthlyValue) {
          this.cateringAmountUsd = value[0] * this.noOfLocation;
        } else {
          this.cateringAmountUsd = value[0] * this.noOfLocation * 12;
        }
      } else {
        this.cateringAmountEur = value[0] * this.noOfLocation;
      }
    }
  }

  onedayAmount: any = 0;
  remainingDays: any = 0;
  cateringCheckAfter(event, value) {
    if (event.checked) {
      this.addOnCheckArray.push(value);
      this.plansDataAddOns.forEach((ele) => {
        if (ele.name === 'Catering') {
          this.cateringId = ele._id;
        }
      });
    } else {
      this.addOnCheckArray.pop();
      this.cateringId = null;
    }
    if (this.addOnCheckArray.length > 0) {
      this.nextDisable = false;
    } else {
      this.nextDisable = true;
    }
    this.cateringShow = event.checked;
    this.cateingName = 'Catering';
    if (event.checked) {
      value = value.split(' ');
      if (this.registeredPlansData.plan.planName === 'FreeTrial') {
        if (value[1] === 'USD') {
          if (this.monthlyValue) {
            this.cateringAmountUsd = value[0] * this.noOfLocation;
          } else {
            this.cateringAmountUsd = value[0] * this.noOfLocation * 12;
          }
        } else {
          this.cateringAmountEur = value[0] * this.noOfLocation;
        }
      } else {
        this.onedayAmount = (value[0] / 30).toFixed(2);
        let lastDay = this.registeredPlansData.plan.endDate;
        let lastDate: any = new Date(lastDay);
        let todayDate: any = new Date();
        var time_difference = lastDate.getTime() - todayDate.getTime();
        this.remainingDays = Math.ceil(time_difference / (1000 * 60 * 60 * 24));
        if (value[1] === 'USD') {
          if (this.monthlyValue) {
            this.cateringAmountUsd = Math.ceil(
              this.onedayAmount * this.remainingDays * this.noOfLocation
            );
          } else {
            this.cateringAmountUsd = Math.ceil(
              this.onedayAmount * this.remainingDays * this.noOfLocation
            );
          }
        } else {
          this.cateringAmountEur =
            this.onedayAmount * this.remainingDays * this.noOfLocation;
        }
      }

      //
    }
  }

  smsId = null;
  smsAmountUsd = 0;
  smsAmountEur = 0;
  smsShow: boolean = false;
  smsName;
  smsCheck(event, value) {
    if (event.checked) {
      this.plansDataAddOns.forEach((ele) => {
        if (ele.name === 'SMS') {
          this.smsId = ele._id;
        }
      });
    } else {
      this.smsId = null;
    }
    this.smsShow = event.checked;
    this.smsName = 'Unlimited SMS';
    if (event.checked) {
      value = value.split(' ');
      if (value[1] === 'USD') {
        this.smsAmountUsd = value[0] * this.noOfLocation;
      } else {
        this.smsAmountEur = value[0] * this.noOfLocation;
      }
    }
  }

  deliveryId = null;
  deliveryAmountUsd = 0;
  deliveryAmountEur = 0;
  deliveryShow: boolean = false;
  deliveryName;

  addOnCheckArray = [];
  deliveryCheck(event, value) {
    if (event.checked) {
      this.plansDataAddOns.forEach((ele) => {
        if (ele.name === 'Deliveries') {
          this.deliveryId = ele._id;
        }
      });
    } else {
      this.deliveryId = null;
    }
    this.deliveryShow = event.checked;
    this.deliveryName = 'Delivery';
    if (event.checked) {
      value = value.split(' ');
      if (value[1] === 'USD') {
        if (this.monthlyValue) {
          this.deliveryAmountUsd = value[0] * this.noOfLocation;
        } else {
          this.deliveryAmountUsd = value[0] * this.noOfLocation * 12;
        }
      } else {
        this.deliveryAmountEur = value[0] * this.noOfLocation;
      }
    }
  }
  deliveryCheckAfter(event, value) {
    if (event.checked) {
      this.addOnCheckArray.push(value);
      this.plansDataAddOns.forEach((ele) => {
        if (ele.name === 'Deliveries') {
          this.deliveryId = ele._id;
        }
      });
    } else {
      this.addOnCheckArray.pop();
      this.deliveryId = null;
    }
    if (this.addOnCheckArray.length > 0) {
      this.nextDisable = false;
    } else {
      this.nextDisable = true;
    }

    this.deliveryShow = event.checked;
    this.deliveryName = 'Delivery';
    if (event.checked) {
      value = value.split(' ');
      if (this.registeredPlansData.plan.planName === 'FreeTrial') {
        if (value[1] === 'USD') {
          if (this.monthlyValue) {
            this.deliveryAmountUsd = value[0] * this.noOfLocation;
          } else {
            this.deliveryAmountUsd = value[0] * this.noOfLocation * 12;
          }
        } else {
          this.deliveryAmountEur = value[0] * this.noOfLocation;
        }
      } else {
        this.onedayAmount = (value[0] / 30).toFixed(2);
        let lastDay = this.registeredPlansData.plan.endDate;
        let lastDate: any = new Date(lastDay);
        let todayDate: any = new Date();
        var time_difference = lastDate.getTime() - todayDate.getTime();
        this.remainingDays = Math.ceil(time_difference / (1000 * 60 * 60 * 24));
        if (value[1] === 'USD') {
          if (this.monthlyValue) {
            this.deliveryAmountUsd = Math.ceil(
              this.onedayAmount * this.remainingDays * this.noOfLocation
            );
          } else {
            this.deliveryAmountUsd = Math.ceil(
              this.onedayAmount * this.remainingDays * this.noOfLocation
            );
          }
        } else {
          this.cateringAmountEur = Math.ceil(
            this.onedayAmount * this.remainingDays * this.noOfLocation
          );
        }
      }
    }
  }

  dueAmountUsr;
  dueAmountEur;
  orderListData = false;
  ordersData() {
    if (this.usdCurrency) {
      this.dueAmountUsr =
        this.amountUsd +
        this.cateringAmountUsd +
        this.smsAmountUsd +
        this.deliveryAmountUsd;
    } else if (this.eruCurrency) {
      this.dueAmountEur =
        this.amountEUR +
        this.cateringAmountEur +
        this.smsAmountEur +
        this.deliveryAmountEur;
    }
    this.orderListData = true;
    this.dataOfAddOns = false;
  }

  ordersDataAfter() {
    if (this.usdCurrency) {
      this.dueAmountUsr =
        this.amountUsd +
        this.cateringAmountUsd +
        this.smsAmountUsd +
        this.deliveryAmountUsd;
    } else if (this.eruCurrency) {
      this.dueAmountEur =
        this.amountEUR +
        this.cateringAmountEur +
        this.smsAmountEur +
        this.deliveryAmountEur;
    }
    this.orderListData = true;
    this.dataOfAddOns = false;
  }

  plansData;
  getPlans() {
    this.spinner = true;
    this.accountService.getPlans().subscribe((res) => {
      this.spinner = false;
      this.plansData = res.plandetails;
      if (this.plansData.contactlessSignIn === false) {
      }
    });
  }

  getAddOns() {
    this.spinner = true;
    this.accountService.getAddOns().subscribe((res) => {
      this.spinner = false;
      this.plansDataAddOns = res.plandetails;
      this.plansDataAddOns.forEach((ele) => {
        if (ele.addOnId === 'addon-catering') {
          this.plansCatering = ele.name;
          this.plansCateringMonthlyPrice = ele.monthlyprice;
        }
        if (ele.addOnId === 'addon-deliveries') {
          this.plansDeliveries = ele.name;
          this.planDeliveriesMonthlyPlan = ele.monthlyprice;
        }
        if (ele.addOnId === 'addon-sms') {
          this.plansSms = ele.name;
          this.planSmsMonthlyPrice = ele.monthlyprice;
        }
      });
    });
  }

  onBussinesPlan() {
    this.bussinessPlan = false;
    this.starterPlan = false;
    // this.detailsOfBusinessPlan=true
    this.starterPlanDetalis = true;
    this.orderListData = false;
    // this.detailsOfStarterPlanUSD=false
  }

  onEnterpricePlan() {
    this.enterpricePlan = false;
    this.starterPlan = false;
    this.starterPlanDetalis = true;
    this.orderListData = false;
    // this.detailsOfEnterpricePlan=true
  }

  backToStarterPlan() {
    this.backButtonShow = true;
    if (this.freeTrialShow == true) {
      this.starterPlanDetalis = false;
      this.starterPlan = true;
    } else {
      this.starterPlanDetalis = false;
      this.starterPlan = false;
      this.businessPlanShow = true;
    }

    // this.addOnsBreazie=true
  }

  backToStarterPlanFromPlans() {
    this.backButtonShow = true;
    this.planShow = true;
    this.addOnPrePlan = true;
    this.addOnAfterPlan = false;
    if (this.freeTrialShow == true) {
      this.starterPlan = true;
      this.dataOfAddOns = false;
    } else {
      this.starterPlan = false;
      this.dataOfAddOns = false;
      this.businessPlanShow = true;
    }

    // this.addOnsBreazie=true
  }

  backToStarterPlanFromOrder() {
    this.backButtonShow = true;
    (this.planId = null),
      (this.currencySelect = null),
      (this.durations = null),
      (this.cateringId = null),
      (this.smsId = null),
      (this.deliveryId = null),
      (this.noOfLocation = 0),
      (this.noOfLocation = 1);
    this.deliveryAmountUsd = 0;
    this.deliveryAmountEur = 0;
    this.deliveryShow = false;
    this.smsAmountUsd = 0;
    this.smsAmountEur = 0;
    this.smsShow = false;
    this.cateringAmountUsd = 0;
    this.cateringAmountEur = 0;
    this.cateringShow = false;
    this.planShow = true;
    this.addOnPrePlan = true;
    this.addOnAfterPlan = false;
    if (this.freeTrialShow == true) {
      this.starterPlan = true;
      this.starterPlanDetalis = false;
      this.orderListData = false;
    } else {
      this.starterPlan = false;
      this.starterPlanDetalis = false;
      this.orderListData = false;
      this.businessPlanShow = true;
    }
  }

  backToStarterPlanFromLocation() {
    this.starterPlanDetalis = false;
    this.starterPlan = true;
    this.bussinessPlan = false;
  }

  backToEnterpricePlanFromLocation() {
    this.starterPlanDetalis = false;
    this.starterPlan = true;
    this.bussinessPlan = false;
    this.enterpricePlan = false;
  }
  forParticularLocations = true;
  moreLocations() {
    this.setBusinessPayment = false;
    this.forMoreLocations = true;
    this.forParticularLocations = false;
  }

  particularLocation() {
    this.forMoreLocations = false;
    this.forParticularLocations = true;
  }

  forParticularLocationsInEnterprice = true;
  entrtpriceParticularLocation() {
    this.forParticularLocationsInEnterprice = true;
    this.forMoreLocationsInEnterprice = false;
  }

  moreLocationsEnterprice() {
    this.forMoreLocationsInEnterprice = true;
    this.forParticularLocationsInEnterprice = false;
  }

  staterPlanDetails() {
    this.detailsPlanName = 'Starter Plan';
    this.durations = 'monthly';
    if (this.usdCurrency) {
      this.plansData.forEach((data) => {
        if (data.DisplayName === 'Starter Plan') {
          this.planId = data._id;
          data.price.forEach((ele) => {
            if (ele.currency === 'USD') {
              this.startUpMonthAmount = ele.monthlyprice;
              this.startUpYearAmount = ele.annualprice * 12;
              this.monthPayment = `$${ele.monthlyprice} USD/month`;
              this.annualPayment = `$${ele.annualprice} USD/month`;
            }
          });
        }
      });
    } else {
      this.plansData.forEach((data) => {
        if (data.DisplayName === 'Starter Plan') {
          this.planId = data._id;
          data.price.forEach((ele) => {
            if (ele.currency === 'ERU') {
              this.startUpMonthAmount = ele.monthlyprice;
              this.startUpYearAmount = ele.annualprice * 12;
              this.monthPayment = `€${ele.monthlyprice} EUR/month`;
              this.annualPayment = `€${ele.annualprice} EUR/month`;
            }
          });
        }
      });
    }
    this.detailsOfStarterPlanUSD = true;
    this.detailsOfBusinessPlan = false;
    this.detailsOfEnterpricePlan = false;
    this.monthlyValue = true;
    this.getLocation(this.noOfLocation);
  }

  businessPlanDetails() {
    this.detailsPlanName = 'Business Plan';
    this.durations = 'monthly';
    if (this.usdCurrency) {
      this.plansData.forEach((data) => {
        if (data.DisplayName === 'Business Plan') {
          this.planId = data._id;
          data.price.forEach((ele) => {
            if (ele.currency === 'USD') {
              this.businessMonthAmount = ele.monthlyprice;
              this.businessYearAmount = ele.annualprice * 12;
              this.monthBusinessPayment = `$${ele.monthlyprice} USD/month`;
              this.annualBusinessPayment = `$${ele.annualprice} USD/month`;
            }
          });
        }
      });
    } else {
      this.plansData.forEach((data) => {
        if (data.DisplayName === 'Business Plan') {
          this.planId = data._id;
          data.price.forEach((ele) => {
            if (ele.currency === 'EUR') {
              this.businessMonthAmount = ele.monthlyprice;
              this.businessYearAmount = ele.annualprice * 12;
              this.monthBusinessPayment = `€${ele.monthlyprice} EUR/month`;
              this.annualBusinessPayment = `€${ele.annualprice} EUR/month`;
            }
          });
        }
      });
    }
    this.detailsOfBusinessPlan = true;
    this.detailsOfStarterPlanUSD = false;
    this.detailsOfEnterpricePlan = false;
    this.monthlyValue = true;
    this.getLocation(this.noOfLocation);
  }

  enterpricePlanDetails() {
    this.detailsPlanName = 'Enterprise Plan';
    this.durations = 'monthly';
    if (this.usdCurrency) {
      this.plansData.forEach((data) => {
        if (data.DisplayName === 'Enterprise Plan') {
          this.planId = data._id;
          data.price.forEach((ele) => {
            if (ele.currency === 'USD') {
              this.enterPriseMonthAmount = ele.monthlyprice;
              this.enterPriseYearAmount = ele.annualprice * 12;
              this.monthEnterprisePayment = `$${ele.monthlyprice} USD/month`;
              this.annualEnterprisePayment = `$${ele.annualprice} USD/month`;
            }
          });
        }
      });
    } else {
      this.plansData.forEach((data) => {
        if (data.DisplayName === 'Enterprise Plan') {
          this.planId = data._id;
          data.price.forEach((ele) => {
            if (ele.currency === 'EUR') {
              this.enterPriseMonthAmount = ele.monthlyprice;
              this.enterPriseYearAmount = ele.annualprice * 12;
              this.monthEnterprisePayment = `€${ele.monthlyprice} EUR/month`;
              this.annualEnterprisePayment = `€${ele.annualprice} EUR/month`;
            }
          });
        }
      });
    }
    this.detailsOfEnterpricePlan = true;
    this.detailsOfBusinessPlan = false;
    this.detailsOfStarterPlanUSD = false;
    this.monthlyValue = true;
    this.getLocation(this.noOfLocation);
  }
  detailsOfBusinessPlanEUR = false;
  // enterpriceEUR() {
  //   this.detailsOfEnterpricePlan = false
  //   this.detailsOfBusinessPlan = false
  //   this.detailsOfStarterPlanUSD = false
  //   this.detailsOfStarterPlanEUR = true
  //   this.detailsOfBusinessPlanEUR = false
  // }

  businessLocation() {
    this.bussinessPlan = true;
    this.detailsOfStarterPlanUSD = false;
    this.starterPlanDetalis = false;
  }
  addBusinessEnquery() {}
  redirectToEnterprice() {
    this.enterpricePlan = true;
    this.detailsOfStarterPlanUSD = false;
    this.starterPlanDetalis = false;
    this.starterPlan = false;
  }

  ////////////////////////////////////////////////////////////////
  plansName: string = '';
  freeTrialShow: boolean = true;
  businessPlanShow: boolean = false;
  joinedDate;
  renewalDate;
  priceValue: string = '';
  locationValue;
  ipadNumber: string = '0';
  employeeNumber: string = '25';
  addOnDuration;
  activeStatus: Boolean = false;
  registeredPlansData: any;
  getRegister() {
    this.accountService.getRegister().subscribe((res) => {
      this.registeredPlansData = res.registeredData;
      if (res.registeredData.deliveryAddOn.endDate) {
        let lastDay = res.registeredData.plan.endDate;
        let lastDate: any = new Date(lastDay);
        let todayDate: any = new Date();
        var difference = lastDate - todayDate;
        let days = Math.ceil(difference / (1000 * 3600 * 24));
        if (days <= 0) {
          this.activeStatus = true;
        } else {
          this.activeStatus = false;
        }
      } else {
        this.activeStatus = false;
      }
      this.addOnDuration = res.registeredData.plan.duration;
      this.currencySelect = 'USD';
      if (res.registeredData.plan.duration === 'monthly') {
        this.priceValue = `$ ${res.registeredData.plan.price} ${res.registeredData.plan.currency}/monthly`;
      } else {
        this.priceValue = `$ ${res.registeredData.plan.price} ${res.registeredData.plan.currency}/year`;
      }
      if (res.registeredData.plan.planName === 'Starter Plan') {
        this.ipadNumber = '1';
        this.employeeNumber = '25';
      } else {
        this.ipadNumber = 'multiple';
        this.employeeNumber = 'unlimited';
      }
      this.locationValue = res.registeredData.plan.location;
      this.joinedDate = res.registeredData.plan.startDate;
      this.renewalDate = res.registeredData.plan.endDate;
      if (res.registeredData.plan.planName === 'FreeTrial') {
        this.freeTrialShow = true;
        this.businessPlanShow = false;
      } else {
        this.businessPlanShow = true;
        this.freeTrialShow = false;
        this.plansName = res.registeredData.plan.planName;
      }
    });
  }

  buyPlanShow: Boolean = true;
  backButtonShow: Boolean = false;
  buyPlan() {
    this.freeTrialShow = true;
    this.buyPlanShow = false;
    this.bussinessPlan = false;
    this.starterPlanDetalis = false;
    this.businessPlanShow = false;
    this.backButtonShow = true;
  }

  backToBuyPlans() {
    this.freeTrialShow = false;
    this.buyPlanShow = true;
    this.businessPlanShow = true;
    this.backButtonShow = false;
  }

  changePlan() {
    this.starterPlanDetalis = true;
    this.businessPlanShow = false;
    let events = 'USD';
    this.confirmPlan(events);
    this.staterPlanDetails();
  }
  addOnPrePlan: boolean = true;
  addOnAfterPlan: boolean = false;
  planShow: boolean = true;
  addOnsData() {
    this.durations = this.addOnDuration;
    if (this.durations === 'monthly') {
      this.monthlyValue = true;
      this.subscriptionType = 'Monthly';
    } else {
      this.monthlyValue = false;
      this.subscriptionType = 'Annual';
    }
    this.currencySelect = 'USD';
    this.planShow = false;
    this.addOnPrePlan = false;
    this.addOnAfterPlan = true;
    this.dataOfAddOns = true;
    this.starterPlanDetalis = false;
    this.businessPlanShow = false;
  }

  yourOrders() {
    let accountDetails = {
      accountName: this.accountNameOrder,
      billingContactName: this.ordersForm.value.name,
      billingContactEmail: this.ordersForm.value.email,
    };

    let invoiceAddress = {
      hostingRegion: this.ordersForm.value.country,
      address: this.ordersForm.value.address,
      state: this.ordersForm.value.state,
      pincode: this.ordersForm.value.zip,
      city: this.ordersForm.value.city,
      phone: this.ordersForm.value.phone,
    };
    this.accountService.accountDetails(accountDetails).subscribe((res) => {});
    this.accountService.invoiceAddress(invoiceAddress).subscribe((res) => {});
  }
  razorPayOptions = {
    key: '', // Enter the Key ID generated from the Dashboard
    amount: '', // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise or INR 500.
    currency: 'INR',
    name: 'Breazie',
    description: 'Breazie Bill Payment',
    order_id: 'ORDERID_FROM_BACKEND',
    image:
      'https://breezie-prod-files.s3.ap-south-1.amazonaws.com/images/employee/Mask+Group+1@2x.png',
    handler: function (response, error) {},
    notes: {
      address: 'Thank you for saving people in need',
    },
    theme: {
      color: '#1561CF',
    },

    // http_post:this.apiService
  };

  INRPRICE;
  getINR() {
    this.paymentService.getCurrency().subscribe((dataResp) => {
      this.INRPRICE = dataResp.rates.INR;
    });
  }
  payment_creation_id = null;
  onSubmitForm() {
    const coun = this.ordersForm.value.country.replace('\t', '');
    let data = {
      planId: this.planId,
      currencySelect: this.currencySelect,
      durations: this.durations,
      cateringId: this.cateringId,
      smsId: this.smsId,
      deliveryId: this.deliveryId,
      location: this.noOfLocation,
      indianPrice: this.INRPRICE,
      recipient_name: this.ordersForm.value.name,
      recipient_email: this.ordersForm.value.email,
      user_email: this.ordersForm.value.name,
      user_name: this.ordersForm.value.email,
      address: {
        street: this.ordersForm.value.address,
        zip: this.ordersForm.value.zip,
        city: this.ordersForm.value.city,
        state: this.ordersForm.value.state,
      },
      country: coun,
      phone: this.ordersForm.value.phone,
    };

    this.paymentService.createPayment(data).subscribe(
      (res) => {
        this.razorPayOptions.key = res.response.key;
        this.razorPayOptions.order_id = res.response.id;
        this.razorPayOptions.amount = res.response.amount;

        this.razorPayOptions.handler = this.razorPayResponseHandler;
        //  this.payment_creation_id = res.response._id
        //  data["_id"] =res.response._id
        data['amount'] = res.response.amount;
        data['userId'] = res.response.userId;
        sessionStorage.setItem('temp', JSON.stringify(data));
        var rzp1 = new Razorpay(this.razorPayOptions);
        rzp1.open();
      },
      (error) => {}
    );
  }

  static API_SERVICE: PaymentService;
  razorPayResponseHandler = (response, error) => {
    let storage_data = sessionStorage.getItem('temp');
    let sess = JSON.parse(storage_data);

    let paymentObject = {
      // _id:sess._id,
      userId: sess.userId,
      cateringId: sess.cateringId,
      currencySelect: sess.currencySelect,
      deliveryId: sess.deliveryId,
      durations: sess.durations,
      indianPrice: sess.indianPrice,
      location: sess.location,
      phone: sess.phone,
      recipient_name: sess.recipient_name,
      smsId: sess.smsId,
      planId: sess.planId,
      payment: response,
      user_name: sess.user_email,
      amount: sess.amount,
      recipient_email: sess.recipient_email,
      user_email: sess.user_name,
      address: sess.address,
      country: sess.country,
    };

    this.paymentService.verifyPayment(paymentObject).subscribe(
      (res) => {
        this.getAccounts();
        if (!res.error) {
          this.getAccounts();
          this.toastr.success(res.message);
          // this.openSuccessDialog();
          this.router.navigate(['/thank/you']);
        }
      },
      (error) => {
        this.toastr.success(error.message);
        this.openFailureDialog();
      }
    );
  };

  openSuccessDialog() {
    const dialogRef = this.dialog.open(PaymentSuccessComponent, {
      maxWidth: '50vw',
      width: '100%',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      // if (result === 'add') {
      // }
    });
  }

  openFailureDialog() {
    const dialogRef = this.dialog.open(PaymentFailedComponent, {
      maxWidth: '25vw',
      width: '100%',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      // if (result === 'add') {
      // }
    });
  }

  duration: any;
  downloadPDF(data: any) {
    let amountValue = data.amount;
    let amount = Math.round(amountValue);

    let addonExtra = 0;
    let createdDate = new Date(data.created_at);
    const date = createdDate.toLocaleDateString('en-US', {
      day: 'numeric',
      year: 'numeric',
      month: 'short',
    });

    let doc = new jsPDF();
    doc.setFontSize(17);
    doc.setTextColor(0);
    doc.setDrawColor(238, 238, 238);
    doc.setFillColor(255, 255, 255);
    doc.rect(15, 20, 180, 17, 'F');
    doc.setFont('helvetica', 'bold');
    doc.addImage('../../../assets/images/logo.png', 'JPEG', 15, 18, 30, 15);
    doc.text('RECEIPT', 100, 30, null, 'center');
    doc.setFontSize(10);
    doc.setTextColor(105, 105, 105);
    doc.setFont('helvetica', 'normal');
    doc.text('Breazie', 195, 25, null, 'right');
    doc.text('C29, Sector 6, Noida 201301,', 195, 30, null, 'right');
    doc.text('India', 195, 35, null, 'right');
    doc.setLineWidth(0.3);
    doc.setDrawColor(0);
    doc.line(15, 43, 195, 43);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(0);
    doc.text('RECEIPT TO', 15, 52, null, 'left');
    doc.text('TOTAL AMOUNT USD', 195, 52, null, 'right');
    doc.setTextColor(0);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text(`${data.name}`, 15, 62, null, 'left');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`${data.address.street}`, 15, 68, null, 'left');
    doc.text(`${data.address.state} ${data.address.zip}`, 15, 73, null, 'left');
    doc.text(`${data.country}`, 15, 78, null, 'left');
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(21, 97, 207);
    doc.setFontSize(42);
    doc.text(`$${amount}.00`, 195, 75, null, 'right');
    doc.setLineWidth(0.3);
    doc.line(15, 85, 195, 85);
    doc.setTextColor(0);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text('RECEIPT NO', 15, 95, null, 'left');
    doc.text('REC-0119158', 15, 102, null, 'left');
    doc.text('GST NUMBER', 15, 113, null, 'left');
    doc.text('09AAECD1112D1ZC', 15, 120, null, 'left');
    doc.text('RECEIPT DATE', 195, 95, null, 'right');
    doc.text(`${date}`, 195, 102, null, 'right');
    doc.setLineWidth(0.3);
    doc.line(15, 130, 195, 130);
    doc.text('DESCRIPTION ', 15, 140, null, 'left');
    doc.text('QTY UNIT PRICE', 130, 140, null, null);
    doc.text('AMOUNT USD', 195, 140, null, 'right');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('Subscription Fees', 15, 150, null, 'left');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    if (data.plans) {
      let planStart = new Date(data.plans.startDate);
      let planEnd = new Date(data.plans.endDate);
      const planStartDate = planStart.toLocaleDateString('en-US', {
        day: 'numeric',
        year: 'numeric',
        month: 'short',
      });
      const planEndDate = planEnd.toLocaleDateString('en-US', {
        day: 'numeric',
        year: 'numeric',
        month: 'short',
      });

      doc.text(
        `${data.locations} × Breazie - ${data.plans.planName} (at $${data.plans.price}.00 / ${data.plans.duration})`,
        15,
        163,
        null,
        'left'
      );
      doc.text(`${data.locations}`, 130, 163, null, null);
      doc.text(
        `$${data.plans.price / data.locations}.00`,
        140,
        163,
        null,
        null
      );
      doc.text(`$${data.plans.price}.00`, 195, 163, null, 'right');
      doc.text(`${planStartDate} – ${planEndDate}`, 15, 168, null, 'left');
    }
    // doc.text("16 Dec 2021 – 16 Dec 2022",15,168,null,"left");
    if (data.CateringAddOn || data.deliveryAddOn) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.text('Breazie AddOns', 15, 178, null, 'left');
    }
    if (data.CateringAddOn) {
      let planStart = new Date(data.CateringAddOn.startDate);
      let planEnd = new Date(data.CateringAddOn.endDate);
      const planStartDate = planStart.toLocaleDateString('en-US', {
        day: 'numeric',
        year: 'numeric',
        month: 'short',
      });
      const planEndDate = planEnd.toLocaleDateString('en-US', {
        day: 'numeric',
        year: 'numeric',
        month: 'short',
      });
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.text('Breazie Catering', 15, 188, null, 'left');
      doc.text('1', 130, 188, null, null);
      doc.text(
        `$${data.CateringAddOn.price / data.locations}.00`,
        140,
        188,
        null,
        null
      );
      doc.text(`$${data.CateringAddOn.price}.00`, 195, 188, null, 'right');
      doc.text(`${planStartDate} – ${planEndDate}`, 15, 193, null, 'left');
      addonExtra = 10;
    }
    if (data.deliveryAddOn) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      let planStart = new Date(data.deliveryAddOn.startDate);
      let planEnd = new Date(data.deliveryAddOn.endDate);
      let planStartDate = planStart.toLocaleDateString('en-US', {
        day: 'numeric',
        year: 'numeric',
        month: 'short',
      });
      let planEndDate = planEnd.toLocaleDateString('en-US', {
        day: 'numeric',
        year: 'numeric',
        month: 'short',
      });
      doc.text('Breazie Delivery', 15, 193 + addonExtra, null, 'left');
      doc.text(`${data.locations}`, 130, 193 + addonExtra, null, null);
      doc.text(
        `$${data.deliveryAddOn.price / data.locations}.00`,
        140,
        193 + addonExtra,
        null,
        null
      );
      doc.text(
        `$${data.deliveryAddOn.price}.00`,
        195,
        193 + addonExtra,
        null,
        'right'
      );
      doc.text(
        `${planStartDate} – ${planEndDate}`,
        15,
        198 + addonExtra,
        null,
        'left'
      );
    }
    // doc.text("Unused time on SwipedOn - Starter Plan after 16 Dec 2021",15,178,null,"left");
    // doc.text("1",130,178,null,null);
    // doc.text("$0.00",140,178,null,null);
    // doc.text("$0.00",195,178,null,"right");
    // doc.text("Remaining time on SwipedOn - Starter Plan after 16 Dec 2021",15,188,null,"left");
    // doc.text("1",130,188,null,null);
    // doc.text("$0.00",140,188,null,null);
    // doc.text("$0.00",195,188,null,"right");
    doc.setLineWidth(0.3);
    doc.line(15, 228, 195, 228);
    doc.text('SUBTOTAL', 140, 238, null, null);
    doc.text(`$${amount}.00`, 195, 238, null, 'right');
    doc.setLineWidth(0.3);
    doc.line(195, 242, 140, 242);
    doc.text('TOTAL PAID', 140, 252, null, null);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(26);
    doc.text(`$${amount}.00`, 195, 252, null, 'right');
    doc.setLineWidth(0.3);
    doc.line(15, 260, 195, 260);
    doc.save(`Settlement${Date.now()}.pdf`);
  }
}
