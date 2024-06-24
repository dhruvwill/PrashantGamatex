type LeadInsertData = {
  category: string;
  currency: string;
  customerCompanyName: string;
  contactPerson: string;
  designation: string;
  mobileNo: string;
  emailId: string;
  product: string;
  leadSource: string;
  competition: string;
  timeFrame: string;
  leadRemindDate: Date;
  customerApplication: string;
  customerExistingMachine: string;
  leadNote: string;
};

type LeadUpdateData = {
  ReferenceTransaction_2361Id: number;
  currency: string;
  customerCompanyName: string;
  contactPerson: string;
  designation: string;
  mobileNo: string;
  emailId: string;
  product: string;
  leadSource: string;
  competition: string;
  timeFrame: string;
  leadRemindDate: Date;
  customerApplication: string;
  customerExistingMachine: string;
  leadNote: string;
};

type LeadData = {
  DocumentDate: string;
  DocumentNo: number;
  ReferenceTransaction_2361UDFId: number;
  ReferenceTransaction_2361Id: number;
  UDF_CompanyName_2361: string;
  UDF_ContactPerson_2361: string;
  UDF_Designation_2361: string;
  UDF_MobileNo_2361: string;
  UDF_EmailId_2361: string;
  UDF_Product_2361: string;
  UDF_LeadSource_2361: string;
  UDF_CompetitionWith_2361: string;
  UDF_TimeFrame_2361: string;
  UDF_LeadRemindDate_2361: Date;
  UDF_CustomerApplication_2361: string;
  UDF_CustomerExistingMachine_2361: string;
  UDF_LeadNotes_2361: string;
  UDF_InquiryStatus_2361: number;
};
