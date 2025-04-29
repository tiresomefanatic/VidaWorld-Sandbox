import gql from "graphql-tag";

export const PREBOOKING_PAYMENT_QUERY = gql`
  mutation createPayment(
    $sf_itemsku_id: String!
    $sf_item_id: String!
    $first_name: String!
    $last_name: String!
    $email_id: String!
    $pincode: String!
    $branchId: String!
    $partnerId: String!
    $customer_city: String
    $utm_params: UtmParamsTypes
  ) {
    createPayment(
      sf_itemsku_id: $sf_itemsku_id
      sf_item_id: $sf_item_id
      first_name: $first_name
      last_name: $last_name
      email_id: $email_id
      pincode: $pincode
      branchId: $branchId
      partnerId: $partnerId
      customer_city: $customer_city
      utm_params: $utm_params
    ) {
      status
      message
      payment_url
      test_response
    }
  }
`;

export const PREBOOKING_UPDATE_PAYMENT_QUERY = gql`
  mutation updatePayment($encrypted_response: String!) {
    updatePayment(encrypted_response: $encrypted_response) {
      status_code
      payment_status
      message
      ccavenue_status
      increment_order_id
      city
      state
      country
      pinCode
      orderID
      orderStatus
      orderValue
      paymentType
      modelColor
      modelVaahanColor
      modelVariant
      productID
      productSku
      modelSku
      opportunity_id
      customerToken
    }
  }
`;

export const BOOKING_PAYMENT_QUERY = gql`
  mutation CreateSaleOrderPayment(
    $order_id: String!
    $payment_mode: String!
    $buyback_opted: Boolean
    $payment_type: PaymentTypeEnum
  ) {
    CreateSaleOrderPayment(
      order_id: $order_id
      payment_mode: $payment_mode
      payment_type: $payment_type
      buyback_opted: $buyback_opted
    ) {
      payment_url
      message
      status
      test_response
    }
  }
`;

export const UPDATE_BOOKING_PAYMENT_QUERY = gql`
  mutation updateSaleOrderPayment($encrypted_response: String!) {
    updateSaleOrderPayment(encrypted_response: $encrypted_response) {
      order_id
      ccavenue_status
      status_code
      payment_status
      message
      insurance_id
      city
      state
      country
      pinCode
      orderID
      orderStatus
      orderValue
      paymentType
      paymentMethod
      modelColor
      modelVariant
      productID
      productSku
      modelSku
      ownershipPlan
      aadharCardUsedStatus
      gstNumber
      paymentOption
      paymentMode
      configurationPrice
      owenershipPlanPrice
      insurancePrice
      gstAmount
      fameIISubsidy
      empsIISubsidy
      govtIISubsidy
      otherCharges
      exchange_selected
      exchange_amount
      modelVaahanColor
      partial_payment_opt_in
      outstanding_amount
      updated_order_grand_total
      accessories {
        itemName
        itemType
        itemId
      }
      addonsCharges
      insuranceDetail {
        insuranceName
        addons
      }
      showNextSteps
    }
  }
`;

export const UPDATE_BOOKING_PAYMENT_WITH_ORDER_ID_QUERY = gql`
  mutation updateSaleOrderPayment($order_id: String) {
    updateSaleOrderPayment(order_id: $order_id) {
      order_id
      status_code
      payment_status
      message
      insurance_id
      city
      state
      country
      pinCode
      orderID
      orderStatus
      orderValue
      paymentMethod
      modelColor
      modelVariant
      productID
      productSku
      modelSku
      ownershipPlan
      aadharCardUsedStatus
      gstNumber
      paymentOption
      paymentMode
      configurationPrice
      owenershipPlanPrice
      insurancePrice
      gstAmount
      fameIISubsidy
      empsIISubsidy
      otherCharges
      exchange_selected
      addonsCharges
      exchange_amount
      modelVaahanColor
      partial_payment_opt_in
      outstanding_amount
      accessories {
        itemName
        itemType
        itemId
      }
      insuranceDetail {
        insuranceName
        addons
      }
      showNextSteps
    }
  }
`;

export const BOOKING_PARTIAL_PAYMENT_QUERY = gql`
  mutation CreateSaleOrderPayment(
    $order_id: String!
    $payment_mode: String!
    $payment_type: PaymentTypeEnum
    $partial_amount: Float!
  ) {
    CreateSaleOrderPayment(
      order_id: $order_id
      payment_mode: $payment_mode
      payment_type: $payment_type
      partial_amount: $partial_amount
    ) {
      payment_url
      message
      status
      test_response
    }
  }
`;
