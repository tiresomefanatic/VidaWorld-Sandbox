import gql from "graphql-tag";

export const GET_MODEL_VARIANT_QUERY = gql`
  query variantModel($type_id: String!) {
    products(
      filter: { type_id: { eq: $type_id }, test_ride_applicable: { eq: "1" } }
    ) {
      items {
        name
        sku
        sf_id
      }
    }
  }
`;

export const GET_TEST_DRIVE_QUERY = gql`
  query getTestRide($SF_id: String!) {
    getTestRide(SF_id: $SF_id) {
      Id
      OwnerId
      IsDeleted
      Name
      CreatedDate
      CreatedById
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
      dmpl__DemoAddress__c
      PostalCode__c
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
    }
  }
`;

export const BOOK_TEST_DRIVE_QUERY = gql`
  mutation bookTestDrive(
    $dmpl__PartnerAccountId__c: String
    $dmpl__BranchId__c: String
    $dmpl__ItemId__c: String
    $dmpl__DemoSlotId__c: String
    $dmpl__DemoDate__c: String
    $dmpl__IsDemoOnsite__c: Boolean
    $Test_Drive_Geolocation__Longitude__s: String
    $Test_Drive_Geolocation__Latitude__s: String
    $Google_Address__c: String
    $dmpl__DemoAddress__c: String
    $dmpl__City__c: String
    $dmpl__State__c: String
    $dmpl__PostalCode__c: String
    $utm_params: UtmParamsTypes
  ) {
    bookTestDrive(
      dmpl__PartnerAccountId__c: $dmpl__PartnerAccountId__c
      dmpl__BranchId__c: $dmpl__BranchId__c
      dmpl__ItemId__c: $dmpl__ItemId__c
      dmpl__DemoSlotId__c: $dmpl__DemoSlotId__c
      dmpl__DemoDate__c: $dmpl__DemoDate__c
      dmpl__IsDemoOnsite__c: $dmpl__IsDemoOnsite__c
      Test_Drive_Geolocation__Longitude__s: $Test_Drive_Geolocation__Longitude__s
      Test_Drive_Geolocation__Latitude__s: $Test_Drive_Geolocation__Latitude__s
      Google_Address__c: $Google_Address__c
      dmpl__DemoAddress__c: $dmpl__DemoAddress__c
      dmpl__City__c: $dmpl__City__c
      dmpl__State__c: $dmpl__State__c
      dmpl__PostalCode__c: $dmpl__PostalCode__c
      utm_params: $utm_params
    ) {
      id
      success
      errors
      account_id
      opportunity_id
    }
  }
`;

export const BOOK_LONG_TERM_TEST_DRIVE_QUERY = gql`
  mutation LttrBookTestDrive(
    $dmpl__PartnerAccountId__c: String
    $dmpl__BranchId__c: String
    $dmpl__State__c: String
    $dmpl__City__c: String
    $dmpl__ItemId__c: String
    $dmpl__DemoAddress__c: String
    $IsLttr: Boolean
    $dmpl__PostalCode__c: String
  ) {
    LttrBookTestDrive(
      dmpl__PartnerAccountId__c: $dmpl__PartnerAccountId__c
      dmpl__BranchId__c: $dmpl__BranchId__c
      dmpl__State__c: $dmpl__State__c
      dmpl__City__c: $dmpl__City__c
      dmpl__ItemId__c: $dmpl__ItemId__c
      dmpl__DemoAddress__c: $dmpl__DemoAddress__c
      IsLttr: $IsLttr
      dmpl__PostalCode__c: $dmpl__PostalCode__c
    ) {
      id
      success
      errors
      account_id
      testRideId
      opportunity_id
    }
  }
`;

export const RESCHEDULE_TEST_DRIVE_QUERY = gql`
  mutation rescheduleTestDrive(
    $SF_Booking_Id: String!
    $dmpl__PartnerAccountId__c: String!
    $dmpl__BranchId__c: String!
    $dmpl__ItemId__c: String!
    $dmpl__DemoSlotId__c: String!
    $dmpl__DemoDate__c: String!
    $dmpl__IsDemoOnsite__c: Boolean!
    $dmpl__DemoAddress__c: String!
    $dmpl__PostalCode__c: String!
  ) {
    rescheduleTestDrive(
      SF_Booking_Id: $SF_Booking_Id
      dmpl__PartnerAccountId__c: $dmpl__PartnerAccountId__c
      dmpl__BranchId__c: $dmpl__BranchId__c
      dmpl__ItemId__c: $dmpl__ItemId__c
      dmpl__DemoSlotId__c: $dmpl__DemoSlotId__c
      dmpl__DemoDate__c: $dmpl__DemoDate__c
      dmpl__IsDemoOnsite__c: $dmpl__IsDemoOnsite__c
      dmpl__DemoAddress__c: $dmpl__DemoAddress__c
      dmpl__PostalCode__c: $dmpl__PostalCode__c
    ) {
      status_code
      message
    }
  }
`;

export const GET_BOOKING_DATE_QUERY = gql`
  query getBranchDateSlots(
    $transactionType: String!
    $branchId: String!
    $itemId: String!
    $daysCount: String!
  ) {
    getBranchDateSlots(
      transactionType: $transactionType
      branchId: $branchId
      itemId: $itemId
      daysCount: $daysCount
    ) {
      items {
        bookingDate
      }
    }
  }
`;

export const GET_BOOKING_DATE_DELIVERY_QUERY = gql`
  query getOrderDeliveryBranchDateSlots(
    $transactionType: String!
    $branchId: String!
    $itemId: String!
    $daysCount: String!
  ) {
    getOrderDeliveryBranchDateSlots(
      transactionType: $transactionType
      branchId: $branchId
      itemId: $itemId
      daysCount: $daysCount
    ) {
      experience_centre {
        bookingDate
      }
      home_delivery {
        bookingDate
      }
    }
  }
`;

export const GET_BOOKING_TIME_SLOT_QUERY = gql`
  query getBranchTimeSlots(
    $transactionType: String!
    $branchId: String!
    $itemId: String!
    $bookingDate: String!
  ) {
    getBranchTimeSlots(
      transactionType: $transactionType
      branchId: $branchId
      itemId: $itemId
      bookingDate: $bookingDate
    ) {
      items {
        id
        timeslot
        maximum_capacity
      }
    }
  }
`;

export const GET_NEARBY_BRANCHES = gql`
  query getNearByBranches($postcode: String!) {
    getNearByBranches(postcode: $postcode) {
      items {
        categoryname
        branches {
          id
          name
          isActive
          partnerAccountId
          geoLocation_latitude
          geoLocation_longitude
        }
      }
    }
  }
`;

export const UPDATE_TEST_RIDE_DATE = gql`
  mutation updateTestRideTentativeDate(
    $opportunity_id: String
    $tentative_date_count: String
  ) {
    updateTestRideTentativeDate(
      opportunity_id: $opportunity_id
      tentative_date_count: $tentative_date_count
    ) {
      status_code
      message
    }
  }
`;

export const REGISTER_TO_FREEDO = gql`
  mutation freedoRegistration($cityId: Int!) {
    freedoRegistration(cityId: $cityId) {
      status_code
      message
    }
  }
`;

export const CHECK_AVAILABILITY = gql`
  query CheckAvailability(
    $startDate: String!
    $packageId: String!
    $skuId: String!
    $cityId: Int!
  ) {
    CheckAvailability(
      startDate: $startDate
      packageId: $packageId
      skuId: $skuId
      cityId: $cityId
    ) {
      message
      result {
        modelId
        selfPickup {
          location_data {
            id
            location_name
            Address1
            Address2
            CityName
            StateName
            AddressZip
            ContactNumber
            ContactName
            Latitude
            Longitude
          }
          slot_info {
            fromTime
            toTime
          }
          self_pickup_available
        }
        homeDelivery {
          home_pickup_available
          slot_info {
            fromTime
            toTime
          }
        }
      }
      statusCode
    }
  }
`;

export const BOOK_LONG_TERM_SELF_PICKUP_TEST_DRIVE_QUERY = gql`
  mutation ScheduleLongTermTestRide(
    $startDate: String!
    $packageId: Int!
    $skuId: String!
    $cityId: Int!
    $startTime: String!
    $endTime: String!
    $modeOfPickup: Int!
    $locationId: Int!
    $cityName: String!
    $address1: String!
    $address2: String!
    $zip: String!
    $landmark: String!
    $latitude: String!
    $longitude: String!
    $current_address: String!
    $state: String!
  ) {
    ScheduleLongTermTestRide(
      startDate: $startDate
      packageId: $packageId
      skuId: $skuId
      cityId: $cityId
      startTime: $startTime
      endTime: $endTime
      modeOfPickup: $modeOfPickup
      locationId: $locationId
      cityName: $cityName
      address1: $address1
      address2: $address2
      zip: $zip
      landmark: $landmark
      latitude: $latitude
      longitude: $longitude
      current_address: $current_address
      state: $state
    ) {
      bookingId
      statusCode
      message
    }
  }
`;

export const UPDATE_LONG_TERM_SELF_PICKUP_TEST_DRIVE_QUERY = gql`
  mutation ScheduleLongTermTestRide(
    $bookingId: Int!
    $startDate: String!
    $packageId: Int!
    $skuId: String!
    $cityId: Int!
    $startTime: String!
    $endTime: String!
    $modeOfPickup: Int!
    $locationId: Int!
    $cityName: String!
    $address1: String!
    $address2: String!
    $zip: String!
    $landmark: String!
    $latitude: String!
    $longitude: String!
    $current_address: String!
    $state: String!
  ) {
    ScheduleLongTermTestRide(
      bookingId: $bookingId
      startDate: $startDate
      packageId: $packageId
      skuId: $skuId
      cityId: $cityId
      startTime: $startTime
      endTime: $endTime
      modeOfPickup: $modeOfPickup
      locationId: $locationId
      cityName: $cityName
      address1: $address1
      address2: $address2
      zip: $zip
      landmark: $landmark
      latitude: $latitude
      longitude: $longitude
      current_address: $current_address
      state: $state
    ) {
      bookingId
      statusCode
      message
    }
  }
`;

export const BOOK_LONG_TERM_AT_HOME_TEST_DRIVE_QUERY = gql`
  mutation ScheduleLongTermTestRide(
    $startDate: String!
    $packageId: Int!
    $skuId: String!
    $cityId: Int!
    $startTime: String!
    $endTime: String!
    $modeOfPickup: Int!
    $cityName: String!
    $address1: String!
    $address2: String!
    $zip: String!
    $landmark: String!
    $latitude: String!
    $longitude: String!
    $current_address: String!
    $state: String!
  ) {
    ScheduleLongTermTestRide(
      startDate: $startDate
      packageId: $packageId
      skuId: $skuId
      cityId: $cityId
      startTime: $startTime
      endTime: $endTime
      modeOfPickup: $modeOfPickup
      cityName: $cityName
      address1: $address1
      address2: $address2
      zip: $zip
      landmark: $landmark
      latitude: $latitude
      longitude: $longitude
      current_address: $current_address
      state: $state
    ) {
      bookingId
      statusCode
      message
    }
  }
`;

export const UPDATE_LONG_TERM_AT_HOME_TEST_DRIVE_QUERY = gql`
  mutation ScheduleLongTermTestRide(
    $bookingId: Int!
    $startDate: String!
    $packageId: Int!
    $skuId: String!
    $cityId: Int!
    $startTime: String!
    $endTime: String!
    $modeOfPickup: Int!
    $cityName: String!
    $address1: String!
    $address2: String!
    $zip: String!
    $landmark: String!
    $latitude: String!
    $longitude: String!
    $current_address: String!
    $state: String!
  ) {
    ScheduleLongTermTestRide(
      bookingId: $bookingId
      startDate: $startDate
      packageId: $packageId
      skuId: $skuId
      cityId: $cityId
      startTime: $startTime
      endTime: $endTime
      modeOfPickup: $modeOfPickup
      cityName: $cityName
      address1: $address1
      address2: $address2
      zip: $zip
      landmark: $landmark
      latitude: $latitude
      longitude: $longitude
      current_address: $current_address
      state: $state
    ) {
      bookingId
      statusCode
      message
    }
  }
`;

export const RESCHEDULE_LONG_TERM_SELF_PICKUP_TEST_DRIVE_QUERY = gql`
  mutation rescheduleRide(
    $bookingId: Int!
    $locationId: Int!
    $modeOfPickup: Int!
    $startDate: String!
    $startTime: String!
    $endTime: String!
    $skuId: String!
    $cityId: Int!
    $address1: String!
    $address2: String!
    $zip: String!
    $landmark: String!
    $latitude: String
    $longitude: String
    $current_address: String
  ) {
    rescheduleRide(
      bookingId: $bookingId
      locationId: $locationId
      modeOfPickup: $modeOfPickup
      startDate: $startDate
      startTime: $startTime
      endTime: $endTime
      skuId: $skuId
      cityId: $cityId
      address1: $address1
      address2: $address2
      zip: $zip
      landmark: $landmark
      latitude: $latitude
      longitude: $longitude
      current_address: $current_address
    ) {
      message
      status_code
    }
  }
`;

export const RESCHEDULE_LONG_TERM_AT_HOME_TEST_DRIVE_QUERY = gql`
  mutation rescheduleRide(
    $bookingId: Int!
    $modeOfPickup: Int!
    $startDate: String!
    $startTime: String!
    $endTime: String!
    $skuId: String!
    $cityId: Int!
    $address1: String!
    $address2: String!
    $zip: String!
    $landmark: String!
    $latitude: String
    $longitude: String
    $current_address: String
  ) {
    rescheduleRide(
      bookingId: $bookingId
      modeOfPickup: $modeOfPickup
      startDate: $startDate
      startTime: $startTime
      endTime: $endTime
      skuId: $skuId
      cityId: $cityId
      address1: $address1
      address2: $address2
      zip: $zip
      landmark: $landmark
      latitude: $latitude
      longitude: $longitude
      current_address: $current_address
    ) {
      message
      status_code
    }
  }
`;

export const GET_FREEDO_RENTAL_COUNT = gql`
  query GetRentalCount {
    GetRentalCount {
      message
      totalSize
      status_code
    }
  }
`;
