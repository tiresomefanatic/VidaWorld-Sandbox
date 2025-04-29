window.appConfig = Object.assign(window.appConfig || {}, {
  analyticsConfig: {
    isAnalyticsEnabled: true
  },
  globalConfig: {
    magentoAPIUrl:
      "https://integration-5ojmyuq-b5gpcg435vm6u.ap-3.magentosite.cloud/graphql",
    // "https://mcstaging.vidaworld.com/graphql",
    // magentoAPIUrl:
    // "https://integration2-hohc4oi-b5gpcg435vm6u.ap-3.magentosite.cloud/graphql",
    tokenExpirtyInDays: 10,
    imgPath: "/clientlib-site/images/png/",
    resourcePath: "/clientlib-site/",
    freedoBookingLimit: 10,
    currency: "INR",
    currencyCountry: "en-IN",
    currencySymbol: "₹",
    authorMode: "false",
    phNumberStartsWith: ["9", "8", "7", "6"],
    phNumberLength: 10,
    defaultCountry: "India",
    defaultCountryCode: "+91",
    isEncryptionSupportRequired: false,
    isShortTermTestRideEnabled: true,
    isLongTermTestRideEnabled: true,
    isMyScooterEnabled: true,
    isRecentEnabled: true,
    apiUrl: {
      geoDataUrl:
        "https://dev.vidaworld.com/content/dam/vida/config/mastergeodata.$COUNTRY.json",
      shortTermServiceableCitiesUrl:
        "https://dev.vidaworld.com/content/dam/vida/config/dealersbranches.$COUNTRY.json",
      longTermServiceableCitiesUrl:
        "https://dev.vidaworld.com/content/dam/vida/config/lttr-city-master.json",
      availableDealerCities:
        "https://dev.vidaworld.com/content/dam/vida/config/availableDealerCities.$COUNTRY.json",
      availableTestRideCities:
        "https://dev.vidaworld.com/content/dam/vida/config/availableTestRideCities.$COUNTRY.json",
      availableLTTRStateCities:
        "https://dev.vidaworld.com/content/dam/vida/config/lttrStateCities.$COUNTRY.json",
      lttrPackageMasterUrl:
        "https://dev.vidaworld.com/content/dam/vida/config/lttr-package-master.json",
      lttrVehicleMasterUrl:
        "https://dev.vidaworld.com/content/vida/in/en/sf-master/jcr:content.vehicleavailability.$CITYID.json",
      serviceableBranchesUrl:
        "https://dev.vidaworld.com/content/vida/in/en/sf-master/jcr:content.nearbybranches.$CITY.json",
      getBranchesByIdAPIUrl:
        "https://dev.vidaworld.com/content/vida/in/en/sf-master/jcr:content.dealerDetails.$branchId.json",
      serviceablePincodesUrl:
        "https://dev.vidaworld.com/content/vida/in/en/sf-master/jcr:content.pincodecity.$COUNTRY.$STATE.$CITY.json",
      productListUrl:
        "https://dev.vidaworld.com/content/dam/vida/config/product-master.json",
      lttrRelationMasterUrl:
        "https://dev.vidaworld.com/content/dam/vida/config/lttr-relation-master.json",
      productBranchesUrl:
        "https://dev.vidaworld.com/content/dam/vida/config/city-master.json",
      productPriceUrl:
        "https://dev.vidaworld.com/content/dam/vida/config/price-master.json",
      addressTypesUrl:
        "https://dev.vidaworld.com//content/dam/vida/config/kyc-document-type.json",
      heroSureUrl:
        "https://run.mocky.io/v3/5ce25029-b439-43bb-be21-2d27b50151d8",
      exchangeVehicleMasterUrl:
        "https://dev.vidaworld.com/content/dam/vida/config/master-brand-list.json",
      masterBandList:
        "https://run.mocky.io/v3/f9851050-865a-4116-90f4-39dd3940f70b",
      googleMapUrl:
        "https://maps.googleapis.com/maps/api/geocode/json?address=$CITY,$STATE&key=$GOOGLEAPIKEY",
      getInTouchUrl:
        "https://dev.vidaworld.com/content/dam/vida/config/contactus.json",
      storeDetailsUrl:
        "https://dev.vidaworld.com/content/dam/vida/map/map.json",
      contactUsUrl:
        "https://dev.vidaworld.com/content/dam/vida/config/case.json",
      internalUserUrl:
        "https://dev.vidaworld.com/content/vida/language-masters/en/internal_complain/jcr:content.systemlist.json",
      pickupLocationUrl:
        "https://dev.vidaworld.com/content/vida/in/en/sf-master/jcr:content.pickuplocation.$CITY.$STATE.json",
      leadCreationUrl:
        "https://dev.vidaworld.com/content/vida/in/en/jcr:content.newleadcontactus.json",
      currentPagePath:
        "https://publish-p62973-e632652.adobeaemcloud.com/content/vida/language-masters/en/charging-locator"
    },
    pageList: {
      faqUrl: "/faq.html",
      chargingUrl: "/charging.html",
      loginUrl: "/login.html",
      profileUrl: "/profile.html",
      testDriveSelectorUrl: "/test-drive-selector.html",
      testDriveUrl: "/test-drive.html",
      shortTermTestDriveUrl: "/test-drive-short-term.html",
      longTermTestDriveUrl: "/test-drive-long-term.html",
      longTermTestDriveNewUrl: "/test-drive-long-term-new.html",
      preBookingUrl: "/pre-booking.html",
      quickReserveUrl: "/quick-reserve.html",
      preBookingStatusUrl: "/prebooking-payment-status.html",
      purchaseConfigUrl: "/purchase-configurator.html",
      billingShippingUrl: "/billing-shipping-details.html",
      billingPricingUrl: "/billing-pricing-details.html",
      billingPricingNewUrl: "/billing-pricing-details-new.html",
      bookingStatusUrl: "/booking-payment-status.html",
      nomineeDetailsUrl: "/nominee-details.html",
      uploadDocumentsUrl: "/vida-upload-documents.html",
      lttrTestDriveUploadDocumentsUrl:
        "/test-drive-long-term-upload-documents.html",
      lttrTestDriveSummaryUrl: "/test-drive-long-term-summary.html",
      lttrTestDriveStatusUrl: "/test-drive-long-term-status.html",
      advantageUrl: "/advantage.html",
      offersUrl: "/offers.html",
      aadharValidationUrl: "/aadharValidation.html",
      deliveryTrackerUrl: "/delivery-tracker.html",
      aadharValidationStatusUrl: "/aadharValidationStatus.html",
      configurationUrl: "/configuration.html",
      aadharVerificationUrl: "/aadhar-verification.html",
      emiCalculatorUrl: "/emi-calculator.html",
      dealerLocatorUrl: "/dealer-locator.html",
      scooterVariantsUrl: "/scooter-variants.html",
      testDriveLoginUrl: "/test-drive-login.html",
      blogDetailsUrl: "/blog-details.html",
      vidaFooterUrl: "/vida-product-page.html",
      vidaEvCategoryUrl: "/vida-ev-category-page.html",
      vidaLoginUrl: "/vida-login.html",
      vidaBookingUrl: "/vida-booking.html",
      paymentPageUrl: "/vida-payment.html",
      vidaTestRideUrl: "/vida-test-ride.html",
      vidaProfileUrl: "/vida-profile.html",
      ordersUrl: "/vida-orders.html",
      vidaCancelBookingUrl: "/vida-cancel-booking.html",
      lovePageUrl: "/vida-love.html",
      vidaDealershipLocatorUrl: "/vida-dealership-locator.html",
      vidaCityPageUrl: "/vida-city-page.html",
      vidaChargingLocatorUrl: "/vida-charging-locator.html",
      vidaTestRideNewUrl: "/vida-test-ride-new.html",
      vidaPrivacyPolicyUrl: "/vida-privacy-policy.html",
      vidaOffersPageUrl: "/vida-offers-page.html",
      vidaFeatureTemplateUrl: "/vida-feature-template.html",
      vidaBrandPageUrl: "/vida-brand-page.html",
      vidaPurchaseSummaryUrl: "/vida-purchase-summary.html",
      vidaFaqPageUrl: "/vida-faq-page.html",
      vidaEmiCalculatorUrl: "/vida-emi-calculator.html",
      vidaSavingCalculatorUrl: "/vida-savings-calculator.html",
      designYourVidaUrl: "/design-your-vida.html",
      signUpUrl: "/vida-register.html",
      vidaTrackDeliveryUrl: "/vida-track-delivery.html",
      vidaBookingPaymentStatusUrl: "/vida-booking-payment-status.html",
      vidaProductUrl: "/vida-v1-pro.html",
      vidaPartialPaymentUrl: "vida-partial-payment.html",
      vidaProductUrl: "/vida-v1-pro.html",
      vidaServiceUrl: "/vida-service.html",
      vidaOffersPageUrl: "/vida-offers-page.html"
    },
    productColorCodes: {
      Blue: "linear-gradient(180deg, #00A1E7 0%, #0F78A6 65.1%, #00A1E7 100%)",
      Red: "linear-gradient(180deg, #FF0000 0%, #B51818 67.71%, #FF0000 100%)",
      "Matt Grey":
        "linear-gradient(180deg, #5B5B5B 0%, #7D7D7D 64.06%, #5B5B5B 100%)",
      "Metallic Silver":
        "linear-gradient(180deg, #FFFFFF 0%, #D9D9D9 63.54%, #FFFFFF 100%)",
      Grey: "#808080",
      White: "#fff",
      Black: "#000",
      Orange: "#fd7343"
    },
    dropDown: {
      minSearchCharacter: 1,
      noResultMessage: "No result found",
      debounceTime: 100
    }
  },
  pageConfig: {
    showLeavePageNotification: "false"
  }
});
