### END Goal

- [ ] User Dashboard with Analytics
- [ ] Calling feature & Whatsapp Message Redirect
- [ ] User report Download facility
- [ ] Visit tracking (location wise, customer wise)
- [ ] Travel Summary
- [ ] Expense Structure
- [ ] User Attendance Marking
- [ ] Leave Management Structure
- [ ] Lead Inward and Follow up
- [ ] Order status, review, & followup
- [ ] Email sending provision for Followup and Quotation.
- [ ] ToDo list & remainder Facility
- [ ] Reminder with alarm and visit updates
- [x] User Data should link with ERP data update status.
- [ ] Social Media Links in application.

### Changes After Lead Testing

- Contact person should be selected from Contacts. ### Done
- Visiting card attachment
- Hide Category ### Done
- Document no shouldn't be focusable ### Done
- Document Date should be editable ### Done
- Currency should be by default selected ### Done
- Product list table as per company
- Application list as per sowolink
- Add a lead source "existing customer" ### To be done on premise cz of permission issues
- Mandatory field with \* mark ### Done
- Lead Note should be textarea ### Done

### Changes to be made in database

- Edit this CRM_ReferenceTransactionGetUserIdCategoryId_2361

```SQL
USE [PGPLCRM]
GO
/****** Object:  StoredProcedure [dbo].[CRM_ReferenceTransactionGetUserIdCategoryId_2361]    Script Date: 17-07-2024 23:48:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER PROCEDURE [dbo].[CRM_ReferenceTransactionGetUserIdCategoryId_2361]
    (
	@ApplicableFormId INT,
    @UserCode NVARCHAR(255),
	@Currency NVARCHAR(255)
	)
AS
BEGIN
    SET NOCOUNT ON
	DECLARE @CategoryID BIGINT
    DECLARE @UserID BIGINT
	DECLARE @CurrencyID BIGINT
	declare @CategoryName nvarchar(200)
	declare @dbname nvarchar(50)

	Set @dbname=(Case When DB_NAME()='PGPL_temp' then 'PGPL' When DB_NAME()='PGPLCRM' THEN 'PGPL' ELSE DB_NAME() END)

	-- Fetch the user ID
    SELECT Top 1 @UserID = UserMasterId
    FROM dbo.UserMaster With(NoLock)
    WHERE UserCode = @UserCode;

	-- Fetch the category ID
	select @CategoryName=parametervalue
	from Sowolink.dbo.CRM_Dropdownparameter with(nolock)
	where dbname=@dbname and subtag=@UserID and parameter='Category'

    SELECT Top 1 @CategoryID = CategoryMasterId
    FROM dbo.CategoryMaster With(NoLock)
    WHERE ApplicableFormId = @ApplicableFormId
      AND CategoryName = @CategoryName;

	Select Top 1 @CurrencyID = CurrencySetupId
	from [Sowolink].[dbo].[CRM_CurrencySetup] With(NoLock)
	where Currency = @Currency

	SELECT @CategoryID AS CategoryID, @UserID AS UserID, @CurrencyID as CurrencyID;
END;
```

- Edit this SP CRM_RefrenceTransactionDetailsInsertUpdateSP_2361

```SQL
USE [PGPLCRM]
GO
/****** Object:  StoredProcedure [dbo].[CRM_RefrenceTransactionDetailsInsertUpdateSP_2361]    Script Date: 18-07-2024 12:25:09 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER PROCEDURE [dbo].[CRM_RefrenceTransactionDetailsInsertUpdateSP_2361]
    (@Mode NVARCHAR(10),
	@CompanyName NVARCHAR(255),
    @FormId BIGINT,
	@DocumentDate NVARCHAR(400),
    @CategoryId BIGINT,
    @ScreenName NVARCHAR(255),
    @UserId BIGINT,
	@RecordId BIGINT,
	@CurrencyId BIGINT,
    @UDF_CompanyName_2361 NVARCHAR(1800),
    @UDF_ContactPerson_2361 NVARCHAR(1800),
    @UDF_Designation_2361 NVARCHAR(200),
    @UDF_MobileNo_2361 NVARCHAR(70),
    @UDF_EmailId_2361 NVARCHAR(120),
    @UDF_Product_2361 NVARCHAR(780),
    @UDF_LeadSource_2361 NVARCHAR(300),
    @UDF_CompetitionWith_2361 NVARCHAR(600),
    @UDF_TimeFrame_2361 NVARCHAR(400),
    @UDF_LeadRemindDate_2361 NVARCHAR(400),
    @UDF_CustomerApplication_2361 NVARCHAR(1800),
    @UDF_CustomerExistingMachine_2361 NVARCHAR(2000),
    @UDF_LeadNotes_2361 NVARCHAR(2000),
	@Output Bigint output)
AS
BEGIN
    SET NOCOUNT ON;
	DECLARE @ReferenceTransaction_2361Id         BIGINT
	DECLARE @ReferenceTransaction_2361DetailsId  BIGINT
	Set     @ReferenceTransaction_2361Id         =0;
	Set     @ReferenceTransaction_2361DetailsId  =0;

	Declare @YearId				Bigint
	Declare @OpeningDate		Date
	Declare @ClosingDate		Date
	Declare @EntryVersion		Nvarchar(30)
	Declare @MaxDocumentNo      BigInt
    Declare @EntryDepartmentId  BigInt

	Select Top 1 @YearId=YearId,@OpeningDate=OpeningDate,@ClosingDate=ClosingDate From CompanyGroupChild With(NoLock) Order By YearId Desc
	Select Top 1 @EntryVersion=EntryVersion From DBVersionUpdateLog Order By DBVersionUpdateLogId Desc
	Select Top 1 @MaxDocumentNo=isnull(max(DocumentNo),0)+1 From ReferenceTransaction_2361 With(NoLock) Where YearId=@YearId and CategoryMasterId=@CategoryId
	Select Top 1 @EntryDepartmentId=DepartmentMasterId From UserMaster With(NoLock) Where UserMasterId=@UserId


    IF @Mode = 'INSERT'
    BEGIN
		 Begin Try
			 Begin Tran
				Insert Into ReferenceTransaction_2361
				(CompanyMasterId
				,DivisionMasterId
				,BranchGodownMasterId
				,CategoryMasterId
				,LoginDetailsTransactionId
				,TransactionCurrencySetupId
				,DocumentDate
				,DocumentNo
				,ReferenceDate
				,ReferenceNo
				,CompanyCurrencyRate
				,BranchCurrencyRate
				,SpecialNote
				,AuthorizationRequired
				,YearId
				,AmendNo
				,AmendDate
				,EntryDateTime
				,EntryComputer
				,EntryUserMasterId
				,EntryDepartmentMasterId
				,EntryVersion
				,EditDateTime
				,EditComputer
				,EditUserMasterId
				,EditDepartmentMasterId
				,EditVersion
				,SourceFormId
				,CommonSerialId
				,AllowNewRecord
				,HideNonMappedFields)
				Values (1,1,2,@CategoryId,0,@CurrencyId,Convert(Date,@DocumentDate,102),@MaxDocumentNo,Convert(Date,GETDATE(),102),'',1,1,'',0,@YearId,0,'1900-01-01',GETDATE(),'PRASHANTTS',@UserId,@EntryDepartmentId,@EntryVersion,'1900-01-01 00:00:00.000','',0,0,'',@FormId,0,0,0 )

				SET @ReferenceTransaction_2361Id = SCOPE_IDENTITY();
				Insert Into ReferenceTransaction_2361Terms (ReferenceTransaction_2361Id,TermsAndCondition1,TermsAndCondition2)
				Values (@ReferenceTransaction_2361Id,'','')

				Insert Into ReferenceTransaction_2361Details (ReferenceTransaction_2361Id,ReferenceId,TableName,DetailDescription,Remarks)
				Values (@ReferenceTransaction_2361Id,56,'AccountMaster','','')
				Set @ReferenceTransaction_2361DetailsId=SCOPE_IDENTITY();

				Insert Into ReferenceTransaction_2361DetailsUDF (ReferenceTransaction_2361DetailsId,	ReferenceTransaction_2361Id,UDF_Remarks_2361)
				Values (@ReferenceTransaction_2361DetailsId,@ReferenceTransaction_2361Id,'')

				INSERT INTO ReferenceTransaction_2361UDF (
					ReferenceTransaction_2361Id,
					UDF_CompanyName_2361,
					UDF_ContactPerson_2361,
					UDF_Designation_2361,
					UDF_MobileNo_2361,
					UDF_EmailId_2361,
					UDF_Product_2361,
					UDF_LeadSource_2361,
					UDF_CompetitionWith_2361,
					UDF_TimeFrame_2361,
					UDF_LeadRemindDate_2361,
					UDF_CustomerApplication_2361,
					UDF_CustomerExistingMachine_2361,
					UDF_LeadNotes_2361,
					UDF_InquiryStatus_2361
				)
				VALUES (
					@ReferenceTransaction_2361Id,
					@UDF_CompanyName_2361,
					@UDF_ContactPerson_2361,
					@UDF_Designation_2361,
					@UDF_MobileNo_2361,
					@UDF_EmailId_2361,
					@UDF_Product_2361,
					@UDF_LeadSource_2361,
					@UDF_CompetitionWith_2361,
					@UDF_TimeFrame_2361,
					CONVERT(DATE,@UDF_LeadRemindDate_2361,102),
					@UDF_CustomerApplication_2361,
					@UDF_CustomerExistingMachine_2361,
					@UDF_LeadNotes_2361,
					0
				);
				SET @Output = 1
			Commit Tran
		End Try
		Begin Catch
		    Rollback Tran
			SET @Output=0
		End Catch
    END
    ELSE IF @Mode = 'UPDATE'
    BEGIN
		Begin try
			Begin tran
        UPDATE ReferenceTransaction_2361UDF
        SET
            UDF_CompanyName_2361 = ISNULL(@UDF_CompanyName_2361, UDF_CompanyName_2361),
            UDF_ContactPerson_2361 = ISNULL(@UDF_ContactPerson_2361, UDF_ContactPerson_2361),
            UDF_Designation_2361 = ISNULL(@UDF_Designation_2361, UDF_Designation_2361),
            UDF_MobileNo_2361 = ISNULL(@UDF_MobileNo_2361, UDF_MobileNo_2361),
            UDF_EmailId_2361 = ISNULL(@UDF_EmailId_2361, UDF_EmailId_2361),
            UDF_Product_2361 = ISNULL(@UDF_Product_2361, UDF_Product_2361),
            UDF_LeadSource_2361 = ISNULL(@UDF_LeadSource_2361, UDF_LeadSource_2361),
            UDF_CompetitionWith_2361 = ISNULL(@UDF_CompetitionWith_2361, UDF_CompetitionWith_2361),
            UDF_TimeFrame_2361 = ISNULL(@UDF_TimeFrame_2361, UDF_TimeFrame_2361),
            UDF_LeadRemindDate_2361 = ISNULL(CONVERT(Date,@UDF_LeadRemindDate_2361,102), UDF_LeadRemindDate_2361),
            UDF_CustomerApplication_2361 = ISNULL(@UDF_CustomerApplication_2361, UDF_CustomerApplication_2361),
            UDF_CustomerExistingMachine_2361 = ISNULL(@UDF_CustomerExistingMachine_2361, UDF_CustomerExistingMachine_2361),
            UDF_LeadNotes_2361 = ISNULL(@UDF_LeadNotes_2361, UDF_LeadNotes_2361)

        WHERE ReferenceTransaction_2361Id = @RecordId;

		UPDATE ReferenceTransaction_2361
		SET
			TransactionCurrencySetupId = ISNULL(@CurrencyId,TransactionCurrencySetupId)
		WHERE ReferenceTransaction_2361Id = @RecordId;

		SET @Output = 1
		Commit Tran
		End try
		Begin Catch
			Rollback tran
			SET @Output=0
		End Catch
    END
    ELSE IF @Mode = 'DELETE'
    BEGIN
        DELETE FROM ReferenceTransaction_2361UDF
        WHERE ReferenceTransaction_2361Id = @ReferenceTransaction_2361Id;
    END
    ELSE IF @Mode = 'SELECT'
    BEGIN
        SELECT *
        FROM ReferenceTransaction_2361UDF
        WHERE ReferenceTransaction_2361Id = @ReferenceTransaction_2361Id;
    END
    ELSE
    BEGIN
        RAISERROR('Invalid mode. Use INSERT, UPDATE, DELETE, or SELECT.', 16, 1);
    END
END;
```

- Add existing parameter option after increasing the size
- Add new constant SP

### Changes to be done after followup

- Fields to be hidden
  1. Category,
  2. Document No,
  3. Ref No, Ref Date,
  4. Communicated By,
  5. Followup Start date,
  6. Follow up End date.
- Change "Document Date" to "Date"
-
