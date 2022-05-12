export interface EmployeeResponse {
  FullName(FullName: any);
  role: string;
  _id:string
  fullName: string,
  lastName: string,
  email: string,
  phone: string,
  locationName: string,
  locationId:string
  assistantEmail: string,
  assistSms: string,
  loginTime:string,
  logoutTime:string
}

export interface EmployeeSignInResponse{
  employeeId:string,
  type:string,
  time:string,
  signedOutMessage:string,
  isRemoteSignedIn:string,
 }

 export interface EmployeeSignOutResponse{
  employeeId:string,
  type:string,
  time:string,
  signedOutMessage:string,
  isRemoteSignedIn:string,
 }
