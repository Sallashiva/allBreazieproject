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
  isRemoteUser: string,
  loginTime:string,
  logoutTime:string,
  acceess:boolean
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
