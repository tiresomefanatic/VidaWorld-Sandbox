import gql from "graphql-tag";

export const GET_PRICE_BY_EXCHANGE = gql`
  mutation getPriceByExchangeData(
    $sf_order_id: String!
    $vehicle_make: String!
    $vehicle_model: String!
    $vehicle_type: String!
    $vehicle_cc: String!
    $purchase_date: String!
    $purchase_city: String!
    $purchase_state: String!
    $register_number: String!
    $number_of_owner: String!
    $ownership_type: String!
    $insurance_validity: String!
    $rate_the_condition: String!
    $kms_run: String!
    $remark: String!
    $year_mfg: String!
    $month_mfg: String!
    $challan_info: String!
    $hypothecation_info: String!
  ) {
    getPriceByExchangeData(
      sf_order_id: $sf_order_id
      vehicle_make: $vehicle_make
      vehicle_model: $vehicle_model
      vehicle_type: $vehicle_type
      vehicle_cc: $vehicle_cc
      purchase_date: $purchase_date
      purchase_city: $purchase_city
      purchase_state: $purchase_state
      register_number: $register_number
      number_of_owner: $number_of_owner
      ownership_type: $ownership_type
      insurance_validity: $insurance_validity
      rate_the_condition: $rate_the_condition
      kms_run: $kms_run
      remark: $remark
      year_mfg: $year_mfg
      month_mfg: $month_mfg
      challan_info: $challan_info
      hypothecation_info: $hypothecation_info
    ) {
      higher_amount
      lower_amount
      exchange_calculate_price
      message
      status
    }
  }
`;

export const CREATE_ORDER_QUERY = gql`
  mutation CreateSaleOrder($order_increment_id: String!) {
    CreateSaleOrder(order_increment_id: $order_increment_id) {
      status_code
      order_id
      opportunity_id
      message
    }
  }
`;

export const GET_STOCK_AVAILABILITY = gql`
  query GetStockAvailabilityCheck($booking_id: String, $order_id: String) {
    GetStockAvailabilityCheck(booking_id: $booking_id, order_id: $order_id) {
      status
      message
      code
    }
  }
`;

export const GET_AADHAR_VERIFIED = gql`
  query OpGetAadhaarVerifyStatus($opportunity_id: String!) {
    OpGetAadhaarVerifyStatus(opportunity_id: $opportunity_id) {
      aadhaar_verified
      message
      status
    }
  }
`;

export const CREATE_AADHAR_VERIFICATION = gql`
  mutation GenerateAadhaarVerificationUrl(
    $opportunity_id: String!
    $aadhaar_number: String!
    $request_data: String!
  ) {
    generateAadhaarVerificationUrl(
      opportunity_id: $opportunity_id
      aadhaar_number: $aadhaar_number
      request_data: $request_data
    ) {
      url
      message
      aadhaar_verified
    }
  }
`;

export const VERIFY_SIGNZY_VERIFICATION = gql`
  mutation OpUpdateAadharStatus(
    $opportunity_id: String!
    $request_id: String!
    $status: String!
    $order_id: String!
  ) {
    OpUpdateAadharStatus(
      opportunity_id: $opportunity_id
      request_id: $request_id
      status: $status
      order_id: $order_id
    ) {
      status
      message
    }
  }
`;

export const GET_ORDER_QUERY = gql`
  query GetSalesOrderDetails($order_id: String, $opportunity_id: String) {
    GetSalesOrderDetails(order_id: $order_id, opportunity_id: $opportunity_id) {
      configure_price
      eccentric_image_url
      entity_id
      order_id
      opportunity_id
      account_id
      buyback_opted
      show_buyback_opted
      magento_customer_id
      sf_item_id
      sf_sku_id
      branch_id
      partneraccount_id
      base_price
      prebooking_price_paid
      gst_amount
      fame_subsidy_eligible_amount
      fame_subsidy_amount
      emps_subsidy_amount
      emps_subsidy_eligible_amount
      configure_price
      ownership_price
      aadhar_selected
      aadhar_number
      gst_selected
      gst_number
      company_name
      company_email
      configurator_details
      configurator_amount
      subscription_plan_id
      subscription_plan_name
      subscription_plan_amount
      subscription_plan_tax
      subscription_plan_tax_percent
      insurer_id
      insurer_name
      insurance_amount
      insurance_addons
      insurance_gst_amount
      insurance_base_price
      cpa_opted
      cpa_reason
      other_charges
      addons_price
      updated_order_tax
      logo_path
      selected_payment
      loan_amount
      loan_status
      lease_amount
      lease_status
      order_grand_total
      updated_order_grand_total
      sf_order_status
      payment_method
      magento_order_status
      order_increment_id
      aadhar_used_for_register
      addresses {
        entity_id
        address_type
        address_line1
        address_line2
        address_landmark
        pincode
        city
        state
        same_as_billing
      }
      sale_order_line {
        lineitem_id
        sf_amount
        discount_amount
        unit_price
        item_id
        Item_type
        line_name
        item_subtype
      }
      product_data {
        name
        color
        sku
        range
        accelerator
        charging_time
        top_speed
        variant_sku
        variant_name
      }
      exchange_amount
      lower_limit_price
      upper_limit_price
      exchange_data {
        insurance_validity
        kms_run
        number_of_owner
        ownership_type
        purchase_city
        purchase_date
        purchase_state
        rate_the_condition
        register_number
        remark
        sf_order_id
        vehicle_cc
        vehicle_make
        vehicle_model
        vehicle_type
        year_mfg
        month_mfg
      }
      exchange_selected
    }
  }
`;
export const GET_OPTIMIZED_ORDER_QUERY = gql`
  query OpGetSaleOrderDetails($order_id: String, $opportunity_id: String) {
    OpGetSaleOrderDetails(
      order_id: $order_id
      opportunity_id: $opportunity_id
    ) {
      home_delivery_amount
      home_delivery_tax_amount
      home_delivery_opt_in
      configure_price
      eccentric_image_url
      entity_id
      allowEdit
      order_id
      opportunity_id
      account_id
      buyback_opted
      show_buyback_opted
      magento_customer_id
      sf_item_id
      sf_sku_id
      order_type
      branch_id
      partneraccount_id
      base_price
      prebooking_price_paid
      gst_amount
      fame_subsidy_eligible_amount
      fame_subsidy_amount
      emps_subsidy_amount
      emps_subsidy_eligible_amount
      govt_subsidy_amount
      govt_subsidy_eligible_amount
      configure_price
      ownership_price
      aadhar_selected
      aadhar_number
      gst_selected
      gst_number
      company_name
      company_email
      configurator_details
      configurator_amount
      subscription_plan_id
      subscription_plan_name
      subscription_plan_amount
      subscription_plan_tax
      subscription_plan_tax_percent
      insurer_id
      insurer_name
      insurance_amount
      insurance_addons
      insurance_gst_amount
      insurance_base_price
      cpa_opted
      cpa_reason
      other_charges
      addons_price
      updated_order_tax
      logo_path
      selected_payment
      loan_amount
      loan_status
      lease_amount
      lease_status
      order_grand_total
      updated_order_grand_total
      sf_order_status
      payment_method
      magento_order_status
      order_increment_id
      aadhar_used_for_register
      addresses {
        entity_id
        address_type
        address_line1
        address_line2
        address_landmark
        pincode
        city
        state
        same_as_billing
      }
      sale_order_line {
        lineitem_id
        sf_amount
        discount_amount
        unit_price
        item_id
        Item_type
        line_name
        item_subtype
      }
      product_data {
        name
        color
        vaahan_color
        sku
        range
        accelerator
        charging_time
        top_speed
        variant_sku
        variant_name
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
      exchange_amount
      exchange_approved
      exchange_calculate_price
      lower_limit_price
      upper_limit_price
      exchange_data {
        insurance_validity
        kms_run
        number_of_owner
        ownership_type
        purchase_city
        purchase_date
        purchase_state
        rate_the_condition
        register_number
        remark
        sf_order_id
        vehicle_cc
        vehicle_make
        vehicle_model
        vehicle_type
        year_mfg
        month_mfg
      }
      exchange_selected
    }
  }
`;

export const UPDATE_OPTIMIZED_ORDER_QUERY = gql`
  mutation opUpdateSaleOrder(
    $order_id: String!
    $subscription_plan_id: String!
    $aadhar_selected: Boolean!
    $aadhar_number: String!
    $aadhar_used_for_register: Boolean!
    $gst_selected: Boolean!
    $gst_number: String!
    $company_name: String!
    $company_email: String!
    $selected_payment: String!
    $payment_method: String!
    $insurer_id: String!
    $insurance_addons: String!
    $cpa_opted: String!
    $cpa_reason: String!
    $buyBack: Boolean!
    $address: ShippingAndBillingAddressInput!
    $paymentType: AvailablePaymentTypeEnum!
    $exchange_selected: String!
    $customer_remarks: String!
    $home_delivery_opt_in: Boolean!
    $isPaymentUrlReceived: Boolean
  ) {
    opUpdateSaleOrder(
      order_id: $order_id
      subscription_plan_id: $subscription_plan_id
      aadhar_selected: $aadhar_selected
      aadhar_number: $aadhar_number
      aadhar_used_for_register: $aadhar_used_for_register
      gst_selected: $gst_selected
      gst_number: $gst_number
      company_name: $company_name
      company_email: $company_email
      selected_payment: $selected_payment
      payment_method: $payment_method
      insurer_id: $insurer_id
      insurance_addons: $insurance_addons
      cpa_opted: $cpa_opted
      cpa_reason: $cpa_reason
      buyBack: $buyBack
      address: $address
      paymentType: $paymentType
      exchange_selected: $exchange_selected
      customer_remarks: $customer_remarks
      home_delivery_opt_in: $home_delivery_opt_in
      isPaymentUrlReceived: $isPaymentUrlReceived
    ) {
      message
      status_code
      payment_url
    }
  }
`;

export const UPDATE_ORDER_DATA = gql`
  mutation updateSaleOrder(
    $order_id: String!
    $subscription_plan_id: String!
    $aadhar_selected: Boolean!
    $aadhar_number: String!
    $aadhar_used_for_register: Boolean!
    $gst_selected: Boolean!
    $gst_number: String!
    $company_name: String!
    $company_email: String!
    $selected_payment: String!
    $payment_method: String!
    $insurer_id: String!
    $insurance_addons: String!
    $cpa_opted: String!
    $cpa_reason: String!
    $exchange_selected: String!
  ) {
    updateSaleOrder(
      order_id: $order_id
      subscription_plan_id: $subscription_plan_id
      aadhar_selected: $aadhar_selected
      aadhar_number: $aadhar_number
      aadhar_used_for_register: $aadhar_used_for_register
      gst_selected: $gst_selected
      gst_number: $gst_number
      company_name: $company_name
      company_email: $company_email
      selected_payment: $selected_payment
      payment_method: $payment_method
      insurer_id: $insurer_id
      insurance_addons: $insurance_addons
      cpa_opted: $cpa_opted
      cpa_reason: $cpa_reason
      exchange_selected: $exchange_selected
    ) {
      message
      status_code
    }
  }
`;

export const GET_INSURANCE_QUOTATION_QUERY = gql`
  query getQuotation(
    $opportunity_id: String!
    $order_id: String!
    $sf_itemsku_id: String!
    $sf_item_id: String!
    $addons: String!
    $cpa_opted: String!
  ) {
    getQuotation(
      opportunity_id: $opportunity_id
      order_id: $order_id
      sf_itemsku_id: $sf_itemsku_id
      sf_item_id: $sf_item_id
      addons: $addons
      cpa_opted: $cpa_opted
    ) {
      items {
        addonsItems {
          name
          tooltips
          insuranceName {
            insurancerId
            addonId
            name
            amount
          }
        }
        insurancePremium {
          insurancerId
          gst_cal_amount
          name
          logoPath
          premium
          covers {
            name
            eligible
          }
          policyno
          opportunity_id
          hero_qoute_id
          basic_idv
          tariff_disc
          tppd_vehicle_prem
          ext_tppd
          pa_owner_driver
          lliab_paid_driver
          total_liability_prem_b
          total_prem_a_b
          grand_total
          gross_prem
          rtoid
          first_sale_date
          policy_effetive_date
          show_room_price
          cubic_capacity
          is_IMT43
          cpa_tenure
          oem_DMapId
          is_electric
        }
      }
    }
  }
`;

export const GET_GST_DETAILS_QUERY = gql`
  query VerifyGst($gstin: String!, $order_id: String!) {
    VerifyGst(gstin: $gstin, order_id: $order_id) {
      legalNameOfBusiness
      gstinStatus
      email
      buildingName
      buildingNo
      flatNo
      street
      Locality
      City
      District
      State
      Pincode
      message
      address_line1
      address_line2
      address_landmark
      pincode
      city
      state
    }
  }
`;

export const UPDATE_ORDER_ADDRESS_DATA = gql`
  mutation UpdateSaleOrderAddress(
    $sale_order_id: String!
    $billing_address_line1: String!
    $billing_address_line2: String!
    $billing_address_landmark: String!
    $billing_pincode: String!
    $billing_city: String!
    $billing_state: String!
    $billing_country: String!
    $shipping_address_line1: String!
    $shipping_address_line2: String!
    $shipping_address_landmark: String!
    $shipping_pincode: String!
    $shipping_city: String!
    $shipping_state: String!
    $shipping_country: String!
    $same_as_billing: String!
  ) {
    UpdateSaleOrderAddress(
      sale_order_id: $sale_order_id
      billing_address_line1: $billing_address_line1
      billing_address_line2: $billing_address_line2
      billing_address_landmark: $billing_address_landmark
      billing_pincode: $billing_pincode
      billing_city: $billing_city
      billing_state: $billing_state
      billing_country: $billing_country
      shipping_address_line1: $shipping_address_line1
      shipping_address_line2: $shipping_address_line2
      shipping_address_landmark: $shipping_address_landmark
      shipping_pincode: $shipping_pincode
      shipping_city: $shipping_city
      shipping_state: $shipping_state
      shipping_country: $shipping_country
      same_as_billing: $same_as_billing
    ) {
      message
      status
    }
  }
`;

export const AUTOVERT_QUERY = gql`
  query getAutoVertOffers($order_id: String!, $application_type: String!) {
    getAutoVertOffers(
      order_id: $order_id
      application_type: $application_type
    ) {
      status
      response
      application_link
    }
  }
`;

export const SUBSCRIPTION_PLAN_QUERY = gql`
  query ($order_id: String) {
    getSubscriptionPlan(order_id: $order_id) {
      items {
        allow_service
        billing_frequency
        billing_term_unit
        charge_type
        description
        effective_form_date
        effective_till_date
        entity_id
        is_active
        item_code
        items_data {
          name
          feature_id
          is_active
        }
        name
        package_id
        price
        tax_amount
        tax_percentage
      }
    }
  }
`;

export const EXCHANGE_AGREED_QUERY = gql`
  mutation ExchangeAgreed($order_id: String!, $agreed_flag: String!) {
    ExchangeAgreed(order_id: $order_id, agreed_flag: $agreed_flag) {
      status
      message
    }
  }
`;

export const GET_DISCOUNT_OFFERS = gql`
  query ($order_id: String!) {
    orderDiscount(order_id: $order_id) {
      items {
        discount_amount
        discount_description
        discount_description
        discountgroup_id
        item_id
        discount_grouprule_id
        sf_order_id
        sf_orderline_id
        sku_id
        discount_appliedinso
        discount_name
        dateEffectiveTill__c
        dateEffectiveFrom__c
        gst_discounted_amount
        net_benefit_tocustomer
        is_default_discount
      }
    }
  }
`;

export const UPDATE_ORDER_DISCOUNT = gql`
  mutation updateOrderDiscount(
    $items: [updateOrderDiscountInput]
    $order_id: String!
  ) {
    updateOrderDiscount(items: $items, order_id: $order_id) {
      status
      message
    }
  }
`;
