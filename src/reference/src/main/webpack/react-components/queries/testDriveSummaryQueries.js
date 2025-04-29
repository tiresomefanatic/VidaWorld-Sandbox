import gql from "graphql-tag";

export const GET_LONG_TERM_TEST_RIDE_DATA = gql`
  query GetLongTermTestRideDataByID($bookingId: Int!) {
    GetLongTermTestRideDataByID(bookingId: $bookingId) {
      statusCode
      message
      bookingId
      startDate
      packageId
      skuId
      price
      cityId
      startTime
      endTime
      modeOfPickup
      locationId
      cityName
      address1
      address2
      zip
      landmark
      Latitude
      Longitude
      currentAddress
      state
      country
      modelVariant
    }
  }
`;

export const GET_PAYMENT_DATA = gql`
  mutation freedoCreatePayment($testRideId: Int) {
    freedoCreatePayment(test_ride_id: $testRideId) {
      message
      status
      payment_url
    }
  }
`;
