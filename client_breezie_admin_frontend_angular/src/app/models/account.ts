export interface AccountResponse {
  name: string,
    location: string
  ipad: string
  qrcode: string,
    employees: string,
    contactlessSignIn: boolean,
    vaccinationProofUpload: boolean,
    employeeScreening: boolean,
    remoteWorking: boolean,
    multipleVisitoflows: boolean,
    integrations: boolean,
    monthlyprice: string,
    annualprice: string,

}

export interface AccountAddOnsResponse {
  name: string,
    monthlyprice: string,
    annualprice: string
}


export interface AccountDetails {
  accountDetails: {
    billingContactName: string,
    billingContactEmail: string
  }
  created_at: string
  history: [{
    plans: {
      locations: Number
      planId: string
      price: string
    }
  }]
  invoiceAddress: {
    hostingRegion: '\tIndia',
    address: string,
    state: string,
    pincode: Number,
    city: string
  }
  userId: string
  __v: Number
  _id: string
}
