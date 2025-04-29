import gql from "graphql-tag";

export const GET_USER_DATA_QUERY = gql`
  query {
    customer {
      firstname
      lastname
      customer_primary_email
      mobile_number
      customer_city
      customer_state
      customer_country
      country_code
      customer_pincode
      profile_pic
      email_verified
      sf_customer_number
      customer_pincode
    }
  }
`;

export const GET_ELLIGIBLE_ADDRESS_UPDATE_QUERY = gql`
  query {
    customer {
      isEligibleForAddressUpdate
    }
  }
`;

export const GET_PROFILE_PICTURE_QUERY = gql`
  query {
    customer {
      profile_pic
    }
  }
`;

export const UPDATE_USER_DATA_QUERY = gql`
  mutation updateProfile(
    $country_code: String!
    $mobile_number: String!
    $email: String!
    $firstname: String!
    $lastname: String
    $customer_state: String!
    $customer_city: String!
    $customer_country: String!
    $customer_pincode: String!
  ) {
    updateProfile(
      country_code: $country_code
      mobile_number: $mobile_number
      customer_primary_email: $email
      firstname: $firstname
      lastname: $lastname
      customer_state: $customer_state
      customer_city: $customer_city
      customer_country: $customer_country
      customer_pincode: $customer_pincode
    ) {
      SF_ID
      status_code
      message
    }
  }
`;

export const UPDATE_USER_DATA_FOR_NOTIFICATION_QUERY = gql`
  mutation updateProfile($whatapp_consent: Boolean!) {
    updateProfile(whatsapp_consent: $whatapp_consent) {
      status_code
      message
    }
  }
`;

export const VERIFY_UPDATED_USER_DATA_QUERY = gql`
  mutation updateProfile(
    $SF_ID: String
    $otp: String
    $country_code: String!
    $mobile_number: String!
    $email: String!
    $firstname: String!
    $lastname: String
    $customer_state: String!
    $customer_city: String!
    $customer_country: String!
    $customer_pincode: String!
  ) {
    updateProfile(
      SF_ID: $SF_ID
      otp: $otp
      country_code: $country_code
      mobile_number: $mobile_number
      customer_primary_email: $email
      firstname: $firstname
      lastname: $lastname
      customer_state: $customer_state
      customer_city: $customer_city
      customer_country: $customer_country
      customer_pincode: $customer_pincode
    ) {
      status_code
      message
    }
  }
`;

export const GET_ALL_USER_TEST_RIDES_QUERY = gql`
  query getAllTestRide {
    getAllTestRide {
      items {
        Id
        OwnerId
        IsDeleted
        Name
        CreatedDate
        CreatedById
        City__c
        State__c
        PostalCode__c
        IsLTTR
        ItemName__c
        SKUId__c
        SKUName__c
        DemoStartAndEndTime__c
        LastModifiedDate
        LastModifiedById
        SystemModstamp
        LastActivityDate
        LastViewedDate
        LastReferencedDate
        dmpl__AccountId__c
        dmpl__BranchId__c
        dmpl__CancellationReason__c
        dmpl__CustomerVoice__c
        Test_Drive_Geolocation__Longitude__s
        Test_Drive_Geolocation__Latitude__s
        Google_Address__c
        dmpl__DemoAddress__c
        dmpl__DemoAssetId__c
        dmpl__DemoAssetNumber__c
        dmpl__DemoDateTime__c
        dmpl__DemoDate__c
        dmpl__DemoRating__c
        dmpl__DemoSlotId__c
        dmpl__DemoTimeSlotBookingId__c
        dmpl__DemoTime__c
        dmpl__ExternalId__c
        dmpl__IsCancelled__c
        dmpl__IsConfirmed__c
        dmpl__IsDemoOnsite__c
        dmpl__ItemId__c
        dmpl__KYCDocumentNumber__c
        dmpl__PartnerAccountId__c
        dmpl__Remarks__c
        dmpl__SaleOrderId__c
        dmpl__SalesExecutiveId__c
        dmpl__Status__c
        dmpl__LeadId__c
        dmpl__OpportunityId__c
        ValueForMoney__c
        SalesExecutiveName__c
        FeatureThatNeedsImprovement__c
        Comments__c
        SeatComfort__c
        MaterialQuality__c
        EnginePower__c
        Accelaration__c
        IntentofBuying__c
        MostLikedFeature__c
        productSku
      }
    }
  }
`;

export const GET_ALL_USER_LONG_TEST_RIDES_QUERY = gql`
  query GetRentalByAccount {
    GetRentalByAccount {
      status_code
      message
      rentalRecord {
        bookingId
        SfRentalId
        freedoBookingId
        name
        accountId
        address1
        address2
        cityId
        homeDelivery
        itemId
        sku
        locationId
        location
        landmark
        numberOfReschedules
        packageId
        postalCode
        price
        rentalCity
        rentalPackage
        rentalProvider
        bookingStatus
        startDate
        startTime
        IsDocumentVerified
      }
    }
  }
`;

export const CANCEL_USER_TEST_RIDES_QUERY = gql`
  mutation cancelTestDrive(
    $SF_Booking_Id: String!
    $dmpl__Status__c: String!
    $dmpl__CancellationReason__c: String!
    $dmpl__Remarks__c: String!
  ) {
    cancelTestDrive(
      SF_Booking_Id: $SF_Booking_Id
      dmpl__Status__c: $dmpl__Status__c
      dmpl__CancellationReason__c: $dmpl__CancellationReason__c
      dmpl__Remarks__c: $dmpl__Remarks__c
    ) {
      status_code
      message
    }
  }
`;

export const CANCEL_USER_LONG_TEST_RIDES_QUERY = gql`
  mutation cancelTestRide($testRideId: String!) {
    cancelTestRide(test_ride_id: $testRideId) {
      status_code
      message
      country
      modelVariant
    }
  }
`;

export const GET_USER_ORDERS_QUERY = gql`
  query getAllSfOrders {
    getAllSfOrders {
      items {
        orderCollectionData {
          aadhaar_verified
          eccentric_image_url
          exchange_amount
          exchange_selected
          exchange_calculate_price
          exchange_approved
          exchange_id
          configure_price
          productSku
          productName
          itemId
          itemSkuId
          remainingDownPayment
          loanStatus
          leaseStatus
          home_delivery_amount
          home_delivery_opt_in
          selectedPayment
          partial_payment_opt_in
          partial_minimum_amount
          printName
          order_type
          paymentInformation {
            payId
            paymentName
            amount
            branchName
            paymentMode
            paymentType
            paymentDate
          }
          orderSummary {
            name
            amount
            unitPrice
            itemId
            itemType
            itemSubType
            variantSku
            variantName
          }
          discount_data {
            discount_amount
            discountgroup_id
            discount_grouprule_id
            discount_name
            dateEffectiveFrom__c
            dateEffectiveTill__c
            gst_discounted_amount
            is_default_discount
            net_benefit_tocustomer
          }
          bookingId
          orderId
          orderDate
          typeDetails
          status
          orderTotal
          outStandingAmount
          bookingAmount
          financeAmount
          customerName
          customerEmail
          customerMobilePhone
          customerAddress
          basePrice
          fame_subsidy_amount
          emps_subsidy_amount
          govt_subsidy_amount
          other_charges
          addons_price
          insurance_gst_amount
          insurance_base_price
          orderTax
          gst
          isPreBooked
          reserveDate
          reservePrice
          deliveryOrderStatus
          deliveryOrderId
          deliveryOrderCreatedDate
          registrationNumber
          readyForDeliveryOrderDate
          branchId
          deliveryBranchId
          shippingAddress
          scheduledDate
          scheduledTime
          registrationName
          vehicleType
          vehicleColor
          vehicleName
          expectedDelivery
          sfOrderInsuranceId
          document_uploaded
          opportunity_id
          city
          country
          state
          pincode
          cancellationReason
          isFameSubsidyRejected
          fameSubsidyRejectionReason
          isGovtSubsidyRejected
          govtSubsidyRejectionReason
          subscription_plan_amount
          subscription_plan_id
          subscription_plan_name
          orderUpdatedInMagento
          fulfillmentTimeStampSF
          cancellationEligibilityTime
          cancellationEligibilityFlag
          magentoOrderStatus
          invoiceDocumentIds {
            group
            id
            printName
          }
        }
        preBookCollectionData {
          eccentric_image_url
          productName
          productSku
          itemId
          itemSkuId
          bookingId
          amount
          customerName
          customerEmail
          customerMobilePhone
          orderDate
          isPreBooked
          isPreBookingCancelled
          prebookingStatus
        }
        show_purchase_btn
      }
    }
  }
`;

export const CANCEL_USER_PRE_BOOKING_QUERY = gql`
  mutation cancelPayment($increment_id: String!, $reason: String!) {
    cancelPayment(increment_id: $increment_id, reason: $reason) {
      status
      message
    }
  }
`;

export const CANCEL_USER_ORDER = gql`
  mutation cancelSaleOrder(
    $sf_order_id: String!
    $cancellationReason: String!
  ) {
    cancelSaleOrder(
      sf_order_id: $sf_order_id
      cancellationReason: $cancellationReason
    ) {
      status_code
      message
    }
  }
`;

export const UPLOAD_PROFILE_IMAGE_QUERY = gql`
  mutation uploadProfileImage($file: String!) {
    uploadProfileImage(file: $file) {
      status
      message
    }
  }
`;

export const GET_ORDERS_INVOICE_QUERY = gql`
  query GetInvoice($document_id: String!, $printType: String) {
    GetInvoice(document_id: $document_id, printType: $printType) {
      message
      status
      pdf_data
    }
  }
`;

export const GET_ACTIVE_RESERVATION = gql`
  query checkActiveReservation {
    checkActiveReservation {
      is_active_reservation
    }
  }
`;
