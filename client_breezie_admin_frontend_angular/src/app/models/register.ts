export interface RegisterResponse {
  deliveryAddOn: {
      deliveryFreeTrialUsed: Boolean
      planName: string,
      startDate: string,
      endDate: string,
    },
    CateringAddOn: {
      cateringFreeTrialUsed: Boolean
      planName: string,
      startDate: string,
      endDate: string,
    }
  accountId: string
  address: string
  agreeTerms: true
  agreementId: any
  cateringFreeTrialUsed: Boolean
  companyName: string
  created_at: string
  dataHostingRegion: string
  deliveryFreeTrialUsed: Boolean
  deviceAndLocationIds: any
  emailId: string
  expireTime: Number
  firstName: string

  plan: {
      planName: string,
      startDate: string,
      endDate: string,

      location: number
    },
    freeTrial: {
      activate: Boolean,
      startDate: string,
      endDate: string
    },
    isEmailVerified: Boolean
  lastName: string
  phone: string
  settingId: string
  totalLocation: Number
  __v: Number
  _id: string
}
