import {
  ORDER_DATA,
  SELECTED_POLICY_DATA,
  UPDATED_POLICY_DATA,
  SET_CPA_OPTED,
  RESET_ADDON_DATA,
  RESET_GST_DATA,
  RESET_SELECTED_POLICY_DATA,
  AADHAR_DATA,
  UNCHECK_AADHAR_SELECT,
  PAYMENT_DATA,
  GST_DATA,
  SUBSCRIPTION_DATA,
  TRADE_IN_DATA,
  CLEAR_TRADE_IN_DATA,
  AADHAR_VERIFIED,
  ADDRESS_DATA,
  HOME_DELIVERY_SELECTED,
  RESET_INDIVIDUAL_ADDRESS_DATA,
  OFFER_DATA
} from "./purchaseConfigTypes";
import { loadState } from "../../../site/scripts/utils/localStorageUtils";

const persistedState = loadState()?.purchaseConfigReducer;
// const initialState = persistedState?.order
//   ? persistedState
//   : {
//       order: {
//         orderId: "",
//         opportunityId: "",
//         orderIncrementId: "",
//         orderType: ""
//       },
//       branchId: "",
//       productData: {
//         name: "",
//         color: "",
//         sku: "",
//         range: "",
//         accelerator: "",
//         chargingTime: "",
//         topSpeed: "",
//         variantSku: "",
//         variantName: "",
//         productId: "",
//         eccentricImage: ""
//       },
//       aadhar: {
//         aadharSelected: true, // getting "0" in GetSalesOrderDetails response
//         aadharNumber: "",
//         aadharUsedForRegister: true,
//         fameSubsidyEligibleAmount: 0,
//         fameSubsidyAmount: 0,
//         empsSubsidyEligibleAmount: 0,
//         empsSubsidyAmount: 0
//       },
//       gst: {
//         gstSelected: false, // getting "0" in GetSalesOrderDetails response
//         gstNumber: "",
//         companyName: "",
//         companyEmail: ""
//       },
//       payment: {
//         basePrice: 0,
//         prebookingPricePaid: 0,
//         gstAmount: 0,
//         configurePrice: 0,
//         paymentMethod: "",
//         loan: {
//           status: "",
//           amount: 0
//         },
//         lease: {
//           status: "",
//           amount: 0
//         },
//         orderGrandTotal: 0,
//         updatedOrderGrandTotal: 0,
//         otherCharges: 0,
//         addonsPrice: 0,
//         updatedOrderTax: 0,
//         finalPrice: 0
//       },
//       insurance: {
//         insurerId: "",
//         insurerName: "",
//         insuranceLogo: "",
//         insuranceAmount: 0,
//         insuranceGstAmount: 0,
//         insuranceBasePrice: 0,
//         insuranceAddons: "",
//         insuranceAddonsList: [],
//         cpaOpted: true,
//         cpaNotOptedReason: ""
//       },
//       offers: {
//         offersName: "",
//         offerPrice: 0
//       },
//       billingAddresses: {
//         addressLine1: "",
//         addressLine2: "",
//         addressLandmark: "",
//         pincode: "",
//         city: "",
//         state: ""
//       },
//       shippingAddresses: {
//         addressLine1: "",
//         addressLine2: "",
//         addressLandmark: "",
//         pincode: "",
//         city: "",
//         state: "",
//         sameAsBilling: false
//       },
//       subscriptionPlan: {
//         name: "",
//         billing_term_unit: "",
//         package_id: "",
//         price: 0,
//         tax_amount: 0,
//         tax_percentage: ""
//       },
//       tradeIn: {
//         tradeInSelected: false,
//         sf_order_id: "",
//         vehicle_make: "",
//         vehicle_model: "",
//         vehicle_type: "",
//         vehicle_cc: "",
//         purchase_date: "",
//         purchase_city: "",
//         purchase_state: "",
//         register_number: "",
//         number_of_owner: "",
//         ownership_type: "",
//         insurance_validity: "",
//         rate_the_condition: "",
//         kms_run: "",
//         remark: "",
//         year_mfg: "",
//         exchange_amount: 0,
//         exchange_approved: false,
//         challan_info: true,
//         hypothecation_info: true,
//         month_mfg: "",
//         popupError: false
//       },
//       aadharVerified: false,
//       homeDelivery: {
//         amount: 0,
//         tax_amount: 0,
//         homeDeliverySelected: false
//       }
//     };

const initialState = {
  order: {
    orderId: "",
    opportunityId: "",
    orderIncrementId: "",
    orderType: ""
  },
  branchId: "",
  productData: {
    name: "",
    color: "",
    sku: "",
    range: "",
    accelerator: "",
    chargingTime: "",
    topSpeed: "",
    variantSku: "",
    variantName: "",
    productId: "",
    eccentricImage: "",
    vaahan_color: ""
  },
  aadhar: {
    aadharSelected: true, // getting "0" in GetSalesOrderDetails response
    aadharNumber: "",
    aadharUsedForRegister: true,
    fameSubsidyEligibleAmount: 0,
    fameSubsidyAmount: 0,
    empsSubsidyEligibleAmount: 0,
    empsSubsidyAmount: 0,
    govtSubsidyAmount: 0,
    govtSubsidyEligibleAmount: 0
  },
  gst: {
    gstSelected: false, // getting "0" in GetSalesOrderDetails response
    gstNumber: "",
    companyName: "",
    companyEmail: ""
  },
  payment: {
    basePrice: 0,
    prebookingPricePaid: 0,
    gstAmount: 0,
    configurePrice: 0,
    paymentMethod: "",
    loan: {
      status: "",
      amount: 0
    },
    lease: {
      status: "",
      amount: 0
    },
    orderGrandTotal: 0,
    updatedOrderGrandTotal: 0,
    otherCharges: 0,
    addonsPrice: 0,
    updatedOrderTax: 0,
    finalPrice: 0
  },
  insurance: {
    insurerId: "",
    insurerName: "",
    insuranceLogo: "",
    insuranceAmount: 0,
    insuranceGstAmount: 0,
    insuranceBasePrice: 0,
    insuranceAddons: "",
    insuranceAddonsList: [],
    cpaOpted: true,
    cpaNotOptedReason: ""
  },
  offers: {
    offersName: "",
    offerPrice: 0,
    offersGST: 0,
    offerTotal: 0
  },
  billingAddresses: {
    addressLine1: "",
    addressLine2: "",
    addressLandmark: "",
    pincode: "",
    city: "",
    state: ""
  },
  shippingAddresses: {
    addressLine1: "",
    addressLine2: "",
    addressLandmark: "",
    pincode: "",
    city: "",
    state: "",
    sameAsBilling: false
  },
  subscriptionPlan: {
    name: "",
    billing_term_unit: "",
    package_id: "",
    price: 0,
    tax_amount: 0,
    tax_percentage: ""
  },
  tradeIn: {
    tradeInSelected: false,
    sf_order_id: "",
    vehicle_make: "",
    vehicle_model: "",
    vehicle_type: "",
    vehicle_cc: "",
    purchase_date: "",
    purchase_city: "",
    purchase_state: "",
    register_number: "",
    number_of_owner: "",
    ownership_type: "",
    insurance_validity: "",
    rate_the_condition: "",
    kms_run: "",
    remark: "",
    year_mfg: "",
    exchange_amount: 0,
    exchange_approved: false,
    challan_info: true,
    hypothecation_info: true,
    month_mfg: "",
    popupError: false
  },
  aadharVerified: false,
  homeDelivery: {
    amount: 0,
    tax_amount: 0,
    homeDeliverySelected: false
  }
};

const getAmount = (value) => {
  return value && value.trim() !== "" ? parseFloat(value) : 0;
};

/* Purchase Config Data Reducer */
export default function purchaseConfigReducer(state = initialState, action) {
  switch (action.type) {
    case TRADE_IN_DATA:
      return {
        ...state,
        tradeIn: {
          ...state.tradeIn,
          ...action.payload
        }
      };
    case AADHAR_VERIFIED:
      return {
        ...state,
        aadharVerified: action.payload
      };
    case CLEAR_TRADE_IN_DATA:
      return {
        ...state,
        tradeIn: {
          ...initialState.tradeIn
        }
      };
    case ORDER_DATA:
      const selectedAddOns = [];
      let addOnOptions = "";
      if (action.payload.insurance_addons !== "") {
        addOnOptions = JSON.parse(action.payload.insurance_addons);
        addOnOptions.forEach((option) => {
          selectedAddOns.push(option.addonId);
        });
      }

      return {
        ...state,
        order: {
          orderId: action.payload.order_id,
          opportunityId: action.payload.opportunity_id,
          orderIncrementId: action.payload.order_increment_id,
          orderType: action.payload.order_type
        },
        offers: {
          offersName:
            action.payload.discount_data.length > 0
              ? action.payload.discount_data[0].discount_name
              : "",
          offerPrice:
            action.payload.discount_data.length > 0
              ? action.payload.discount_data[0].discount_amount
              : 0,
          offersGST:
            action.payload.discount_data.length > 0
              ? action.payload.discount_data[0].gst_discounted_amount
              : 0,
          offerTotal:
            action.payload.discount_data.length > 0
              ? action.payload.discount_data[0].net_benefit_tocustomer
              : 0,
          offerExpiryDate:
            action.payload.discount_data.length > 0
              ? action.payload.discount_data[0].dateEffectiveTill__c
              : ""
        },
        branchId: action.payload.branch_id,
        productId: action.payload.sf_item_id,
        productData: {
          name: action.payload.product_data.name,
          color: action.payload.product_data.color,
          sku: action.payload.product_data.sku,
          range: action.payload.product_data.range,
          accelerator: action.payload.product_data.accelerator,
          chargingTime: action.payload.product_data.charging_time,
          topSpeed: action.payload.product_data.top_speed,
          variantSku: action.payload.product_data.variant_sku,
          variantName: action.payload.product_data.variant_name,
          eccentricImage: action.payload.eccentric_image_url,
          vaahan_color: action.payload.product_data.vaahan_color
        },
        aadhar: {
          aadharSelected: action.payload.aadhar_selected === "1",
          aadharNumber: action.payload.aadhar_number,
          aadharUsedForRegister:
            action.payload.aadhar_used_for_register === "1",
          fameSubsidyEligibleAmount: getAmount(
            action.payload.fame_subsidy_eligible_amount
          ),
          fameSubsidyAmount: getAmount(action.payload.fame_subsidy_amount),
          empsSubsidyEligibleAmount: getAmount(
            action.payload.emps_subsidy_eligible_amount
          ),
          empsSubsidyAmount: getAmount(action.payload.emps_subsidy_amount),
          //common subsidy
          govtSubsidyAmount: getAmount(action.payload.govt_subsidy_amount),
          govtSubsidyEligibleAmount: getAmount(
            action.payload.govt_subsidy_eligible_amount
          )
        },
        gst: {
          gstSelected: action.payload.gst_selected === "1",
          gstNumber: action.payload.gst_number,
          companyName: action.payload.company_name,
          companyEmail: action.payload.company_email
        },
        payment: {
          basePrice: getAmount(action.payload.base_price),
          buybackOpted: action.payload.buyback_opted,
          showBuybackOpted: action.payload.show_buyback_opted,
          gstAmount: getAmount(action.payload.gst_amount),
          configurePrice: getAmount(action.payload.configure_price),
          paymentMethod: action.payload.selected_payment,
          loan: {
            status: action.payload.loan_status,
            amount: getAmount(action.payload.loan_amount)
          },
          lease: {
            status: action.payload.lease_status,
            amount: getAmount(action.payload.lease_amount)
          },
          orderGrandTotal: getAmount(action.payload.order_grand_total),
          updatedOrderGrandTotal: getAmount(
            action.payload.updated_order_grand_total
          ),
          otherCharges: getAmount(action.payload.other_charges),
          addonsPrice: getAmount(action.payload.addons_price),
          updatedOrderTax: getAmount(action.payload.updated_order_tax),
          prebookingPricePaid: getAmount(action.payload.prebooking_price_paid),
          finalPrice: 0
        },
        insurance: {
          insurerId: action.payload.insurer_id,
          insurerName: action.payload.insurer_name,
          insuranceLogo: action.payload.logo_path,
          insuranceAmount: getAmount(action.payload.insurance_amount),
          insuranceGstAmount: getAmount(action.payload.insurance_gst_amount),
          insuranceBasePrice: getAmount(action.payload.insurance_base_price),
          insuranceAddons: selectedAddOns.toString(),
          insuranceAddonsList: addOnOptions,
          cpaOpted: action.payload.cpa_opted === "Y",
          cpaNotOptedReason: action.payload.cpa_reason
        },
        billingAddresses: {
          addressLine1: action.payload.billing_address.address_line1,
          addressLine2: action.payload.billing_address.address_line2,
          addressLandmark: action.payload.billing_address.address_landmark,
          pincode: action.payload.billing_address.pincode,
          city: action.payload.billing_address.city,
          state: action.payload.billing_address.state
        },
        shippingAddresses: {
          addressLine1:
            action.payload.shipping_address.same_as_billing === "1"
              ? action.payload.billing_address.address_line1
              : action.payload.shipping_address.address_line1,
          addressLine2:
            action.payload.shipping_address.same_as_billing === "1"
              ? action.payload.billing_address.address_line2
              : action.payload.shipping_address.address_line2,
          addressLandmark:
            action.payload.shipping_address.same_as_billing === "1"
              ? action.payload.billing_address.address_landmark
              : action.payload.shipping_address.address_landmark,
          pincode: action.payload.shipping_address.pincode,
          city: action.payload.shipping_address.city,
          state: action.payload.shipping_address.state,
          sameAsBilling: action.payload.shipping_address.same_as_billing === "1"
        },
        subscriptionPlan: {
          name: action.payload.subscription_plan_name,
          billing_term_unit: action.payload.billing_term_unit || "",
          package_id: action.payload.subscription_plan_id,
          price: action.payload.subscription_plan_amount,
          tax_amount: action.payload.subscription_plan_tax,
          tax_percentage: action.payload.subscription_plan_tax_percent
        },
        homeDelivery: {
          amount: action.payload.home_delivery_amount || "",
          tax_amount: action.payload.home_delivery_tax_amount,
          homeDeliverySelected: action.payload.home_delivery_opt_in
        }
      };
    case SELECTED_POLICY_DATA:
      const addOnsList = [];
      const addOns = [];
      //if (action.payload.validAddons) {
      action.payload.validAddons.forEach((addOn) => {
        if (addOn.selected) {
          addOnsList.push(addOn);
        }
      });
      addOnsList.forEach((option) => {
        addOns.push(option.addonId);
      });
      //}
      return {
        ...state,
        insurance: {
          ...state.insurance,
          insurerId: action.payload.insurancerId,
          insurerName: action.payload.name,
          insuranceLogo: action.payload.logoPath,
          insuranceAmount: getAmount(action.payload.gross_prem),
          insuranceGstAmount: getAmount(action.payload.gst_cal_amount),
          insuranceBasePrice: getAmount(action.payload.grand_total),
          insuranceAddons: addOns.toString(),
          insuranceAddonsList: addOnsList
        }
      };
    case UPDATED_POLICY_DATA:
      const updateAddOnsList = [];
      const updateAddOns = [];
      // if (action.payload.validAddons) {
      action.payload.validAddons.forEach((addOn) => {
        if (addOn.selected) {
          updateAddOnsList.push(addOn);
        }
      });
      updateAddOnsList.forEach((option) => {
        updateAddOns.push(option.addonId);
      });
      // }

      return {
        ...state,
        insurance: {
          ...state.insurance,
          ...{
            insuranceAmount: action.payload.premium
              ? action.payload.premium
              : state.insurance.insuranceAmount,
            insuranceGstAmount: getAmount(action.payload.gst_cal_amount),
            insuranceBasePrice: getAmount(action.payload.grand_total)
          },
          insuranceAddonsList: updateAddOnsList,
          insuranceAddons: updateAddOns.toString()
        }
      };
    case RESET_ADDON_DATA:
      return {
        ...state,
        insurance: {
          ...state.insurance,
          insuranceAddons: "",
          insuranceAddonsList: []
        }
      };
    case RESET_GST_DATA:
      return {
        ...state,
        gst: {
          gstSelected: false,
          gstNumber: "",
          companyName: "",
          companyEmail: ""
        }
      };
    case HOME_DELIVERY_SELECTED:
      return {
        ...state,
        homeDelivery: {
          ...state.homeDelivery,
          homeDeliverySelected: action.payload
        }
      };

    case SET_CPA_OPTED:
      return {
        ...state,
        insurance: {
          ...state.insurance,
          cpaOpted: action.payload.cpaOpted,
          cpaNotOptedReason: action.payload.cpaNotOptedReason
        }
      };
    case RESET_SELECTED_POLICY_DATA:
      return {
        ...state,
        insurance: {
          insurerId: "",
          insurerName: "",
          insuranceLogo: "",
          insuranceAmount: 0,
          insuranceGstAmount: 0,
          insuranceBasePrice: 0,
          insuranceAddons: "",
          insuranceAddonsList: [],
          cpaOpted: true,
          cpaNotOptedReason: ""
        }
      };
    case AADHAR_DATA:
      return {
        ...state,
        aadhar: {
          ...state.aadhar,
          ...action.payload
        }
      };
    case UNCHECK_AADHAR_SELECT:
      return {
        ...state,
        aadhar: {
          ...state.aadhar,
          aadharSelected: false,
          aadharNumber: "",
          aadharUsedForRegister: false
        }
      };
    case PAYMENT_DATA:
      return {
        ...state,
        payment: {
          ...state.payment,
          ...action.payload
        }
      };
    case GST_DATA:
      return {
        ...state,
        gst: {
          ...state.gst,
          ...action.payload
        }
      };
    case ADDRESS_DATA:
      return {
        ...state,
        billingAddresses: {
          ...state.billingAddresses,
          ...action.payload.billingAddresses
        },
        shippingAddresses: {
          ...state.shippingAddresses,
          ...action.payload.shippingAddresses
        }
      };
    case RESET_INDIVIDUAL_ADDRESS_DATA:
      return {
        ...state,
        billingAddresses: {
          ...state.billingAddresses,
          addressLine1: "",
          addressLine2: "",
          addressLandmark: ""
        }
      };
    case SUBSCRIPTION_DATA:
      return {
        ...state,
        subscriptionPlan: {
          ...state.subscriptionPlan,
          name: action.payload.name,
          billing_term_unit: action.payload.billing_term_unit,
          package_id: action.payload.package_id,
          price: action.payload.price,
          tax_amount: action.payload.tax_amount,
          tax_percentage: action.payload.tax_percentage
        }
      };
    case OFFER_DATA:
      return {
        ...state,
        offers: {
          ...state.offers,
          offersName: action.payload.offersName,
          offerPrice: action.payload.offerPrice,
          offersGST: action.payload.offersGST,
          offerTotal: action.payload.offerTotal,
          offerExpiryDate: action.payload.offerExpiryDate
        }
      };

    default:
      return state;
  }
}
