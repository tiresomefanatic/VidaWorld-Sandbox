import apolloClient from "../../../services/graphql.service";
import { useMutation, useLazyQuery } from "@apollo/react-hooks";
import {
  GET_TEST_DRIVE_QUERY,
  BOOK_TEST_DRIVE_QUERY,
  BOOK_LONG_TERM_TEST_DRIVE_QUERY,
  RESCHEDULE_TEST_DRIVE_QUERY,
  GET_BOOKING_DATE_QUERY,
  GET_BOOKING_DATE_DELIVERY_QUERY,
  GET_BOOKING_TIME_SLOT_QUERY,
  GET_MODEL_VARIANT_QUERY,
  GET_NEARBY_BRANCHES,
  REGISTER_TO_FREEDO,
  CHECK_AVAILABILITY,
  BOOK_LONG_TERM_SELF_PICKUP_TEST_DRIVE_QUERY,
  UPDATE_LONG_TERM_SELF_PICKUP_TEST_DRIVE_QUERY,
  BOOK_LONG_TERM_AT_HOME_TEST_DRIVE_QUERY,
  UPDATE_LONG_TERM_AT_HOME_TEST_DRIVE_QUERY,
  RESCHEDULE_LONG_TERM_SELF_PICKUP_TEST_DRIVE_QUERY,
  RESCHEDULE_LONG_TERM_AT_HOME_TEST_DRIVE_QUERY,
  GET_FREEDO_RENTAL_COUNT,
  UPDATE_TEST_RIDE_DATE
} from "../../queries/testDriveQueries";
import Logger from "../../../services/logger.service";
import {
  setModelVariantListDispatcher,
  setBookingDatesDispatcher,
  setBookingDatesForDeliveryDispatcher,
  setBookingTimeSlotsDispatcher
} from "../../store/testDrive/testDriveActions";
import { setSpinnerActionDispatcher } from "../../store/spinner/spinnerActions";

export const useModelVariantList = () => {
  const [getModelVariantList] = useLazyQuery(GET_MODEL_VARIANT_QUERY, {
    client: apolloClient,
    fetchPolicy: "no-cache",
    onCompleted: (data) => {
      if (data && data.products && data.products.items) {
        const modelVariantList = data.products.items.map((item) => {
          return {
            ...item,
            label: item.name,
            value: item.sf_id
          };
        });

        setModelVariantListDispatcher(modelVariantList);
        setSpinnerActionDispatcher(false);
      }
    },
    onError: (error) => {
      setSpinnerActionDispatcher(false);
      Logger.error(error);
    }
  });
  return getModelVariantList;
};

export const useGetTestDrive = () => {
  const [getTestDrive] = useLazyQuery(GET_TEST_DRIVE_QUERY, {
    client: apolloClient,
    fetchPolicy: "no-cache",
    onCompleted: () => {
      setSpinnerActionDispatcher(false);
    },
    onError: (error) => {
      setSpinnerActionDispatcher(false);
      Logger.error(error);
    }
  });
  return getTestDrive;
};

export const useBookTestDrive = () => {
  const [bookTestDrive] = useMutation(BOOK_TEST_DRIVE_QUERY, {
    client: apolloClient,
    fetchPolicy: "no-cache",
    onCompleted: () => {
      setSpinnerActionDispatcher(false);
    },
    onError: (error) => {
      setSpinnerActionDispatcher(false);
      Logger.error(error);
    }
  });
  return bookTestDrive;
};

export const useBookLongTermTestDrive = () => {
  const [bookLongTermTestDrive] = useMutation(BOOK_LONG_TERM_TEST_DRIVE_QUERY, {
    client: apolloClient,
    fetchPolicy: "no-cache",
    onCompleted: () => {
      setSpinnerActionDispatcher(false);
    },
    onError: (error) => {
      setSpinnerActionDispatcher(false);
      Logger.error(error);
    }
  });
  return bookLongTermTestDrive;
};

export const useRescheduleTestDrive = () => {
  const [rescheduleTestDrive] = useMutation(RESCHEDULE_TEST_DRIVE_QUERY, {
    client: apolloClient,
    fetchPolicy: "no-cache",
    onCompleted: () => {
      setSpinnerActionDispatcher(false);
    },
    onError: (error) => {
      setSpinnerActionDispatcher(false);
      Logger.error(error);
    }
  });
  return rescheduleTestDrive;
};

export const useBookingDates = () => {
  const [getBookingDates] = useLazyQuery(GET_BOOKING_DATE_QUERY, {
    client: apolloClient,
    fetchPolicy: "no-cache",
    onCompleted: (data) => {
      if (
        data &&
        data.getBranchDateSlots &&
        data.getBranchDateSlots.items &&
        data.getBranchDateSlots.items.length
      ) {
        const bookingDates = data.getBranchDateSlots.items.map((date) => {
          return {
            label: date.bookingDate,
            value: date.bookingDate
          };
        });

        setBookingDatesDispatcher([...bookingDates]);
      }
      setSpinnerActionDispatcher(false);
    },
    onError: (error) => {
      setSpinnerActionDispatcher(false);
      Logger.error(error);
    }
  });
  return getBookingDates;
};

export const useBookingDatesForTracking = () => {
  const [getBookingDatesForTracking] = useLazyQuery(
    GET_BOOKING_DATE_DELIVERY_QUERY,
    {
      client: apolloClient,
      fetchPolicy: "no-cache",
      onCompleted: (data) => {
        const processedData = {
          experience_centre: [],
          home_delivery: []
        };
        if (
          data &&
          data.getOrderDeliveryBranchDateSlots &&
          data.getOrderDeliveryBranchDateSlots.experience_centre &&
          data.getOrderDeliveryBranchDateSlots.experience_centre.length
        ) {
          const bookingDates =
            data.getOrderDeliveryBranchDateSlots.experience_centre.map(
              (date) => {
                return {
                  label: date.bookingDate,
                  value: date.bookingDate
                };
              }
            );
          processedData.experience_centre = [...bookingDates];
        }
        if (
          data &&
          data.getOrderDeliveryBranchDateSlots &&
          data.getOrderDeliveryBranchDateSlots.home_delivery &&
          data.getOrderDeliveryBranchDateSlots.home_delivery.length
        ) {
          const bookingDates =
            data.getOrderDeliveryBranchDateSlots.home_delivery.map((date) => {
              return {
                label: date.bookingDate,
                value: date.bookingDate
              };
            });
          processedData.home_delivery = [...bookingDates];
        }
        setBookingDatesForDeliveryDispatcher(processedData);
        setSpinnerActionDispatcher(false);
      },
      onError: (error) => {
        setSpinnerActionDispatcher(false);
        Logger.error(error);
      }
    }
  );
  return getBookingDatesForTracking;
};

export const useBookingTimeSlot = () => {
  const [getBookingTimeSlot] = useLazyQuery(GET_BOOKING_TIME_SLOT_QUERY, {
    client: apolloClient,
    fetchPolicy: "no-cache",
    onCompleted: (data) => {
      if (data && data.getBranchTimeSlots && data.getBranchTimeSlots.items) {
        const bookingTimeSlots = data.getBranchTimeSlots.items.map((date) => {
          return {
            label: date.timeslot,
            value: date.id
          };
        });

        setBookingTimeSlotsDispatcher([...bookingTimeSlots]);
      }
      setSpinnerActionDispatcher(false);
    },
    onError: (error) => {
      setSpinnerActionDispatcher(false);
      Logger.error(error);
    }
  });
  return getBookingTimeSlot;
};

export const useNearbyBranches = () => {
  const [getNearbyBranches] = useLazyQuery(GET_NEARBY_BRANCHES, {
    client: apolloClient,
    fetchPolicy: "no-cache",
    onCompleted: () => {
      setSpinnerActionDispatcher(false);
    },
    onError: (error) => {
      setSpinnerActionDispatcher(false);
      Logger.error(error);
    }
  });
  return getNearbyBranches;
};

export const useUpdateTestRideDate = () => {
  const [updateTestRideTentativeDate] = useMutation(UPDATE_TEST_RIDE_DATE, {
    client: apolloClient,
    fetchPolicy: "no-cache",
    onCompleted: () => {
      setSpinnerActionDispatcher(false);
    },
    onError: (error) => {
      setSpinnerActionDispatcher(false);
      Logger.error(error);
    }
  });
  return updateTestRideTentativeDate;
};

export const useRegisterToFreedo = () => {
  const [registerToFreedo] = useMutation(REGISTER_TO_FREEDO, {
    client: apolloClient,
    fetchPolicy: "no-cache",
    onCompleted: () => {
      setSpinnerActionDispatcher(false);
    },
    onError: (error) => {
      setSpinnerActionDispatcher(false);
      Logger.error(error);
    }
  });
  return registerToFreedo;
};

export const useCheckAvailability = () => {
  const [getAvailability] = useLazyQuery(CHECK_AVAILABILITY, {
    client: apolloClient,
    fetchPolicy: "no-cache",
    onCompleted: () => {
      setSpinnerActionDispatcher(false);
    },
    onError: (error) => {
      setSpinnerActionDispatcher(false);
      Logger.error(error);
    }
  });
  return getAvailability;
};

export const useBookLongTermSelfPickupTestDrive = (isUpdate) => {
  const [bookTestDrive] = useMutation(
    isUpdate
      ? UPDATE_LONG_TERM_SELF_PICKUP_TEST_DRIVE_QUERY
      : BOOK_LONG_TERM_SELF_PICKUP_TEST_DRIVE_QUERY,
    {
      client: apolloClient,
      fetchPolicy: "no-cache",
      onCompleted: () => {
        setSpinnerActionDispatcher(false);
      },
      onError: (error) => {
        setSpinnerActionDispatcher(false);
        Logger.error(error);
      }
    }
  );
  return bookTestDrive;
};

export const useBookLongTermAtHomeTestDrive = (isUpdate) => {
  const [bookTestDrive] = useMutation(
    isUpdate
      ? UPDATE_LONG_TERM_AT_HOME_TEST_DRIVE_QUERY
      : BOOK_LONG_TERM_AT_HOME_TEST_DRIVE_QUERY,
    {
      client: apolloClient,
      fetchPolicy: "no-cache",
      onCompleted: () => {
        setSpinnerActionDispatcher(false);
      },
      onError: (error) => {
        setSpinnerActionDispatcher(false);
        Logger.error(error);
      }
    }
  );
  return bookTestDrive;
};

export const useRescheduleLongTermTestDrive = (isSelfPickup) => {
  const [bookTestDrive] = useMutation(
    isSelfPickup
      ? RESCHEDULE_LONG_TERM_SELF_PICKUP_TEST_DRIVE_QUERY
      : RESCHEDULE_LONG_TERM_AT_HOME_TEST_DRIVE_QUERY,
    {
      client: apolloClient,
      fetchPolicy: "no-cache",
      onCompleted: () => {
        setSpinnerActionDispatcher(false);
      },
      onError: (error) => {
        setSpinnerActionDispatcher(false);
        Logger.error(error);
      }
    }
  );
  return bookTestDrive;
};

export const useFreedoRentalCount = () => {
  const [getFreedoRentalCount] = useLazyQuery(GET_FREEDO_RENTAL_COUNT, {
    client: apolloClient,
    fetchPolicy: "no-cache",
    onCompleted: () => {
      setSpinnerActionDispatcher(false);
    },
    onError: (error) => {
      setSpinnerActionDispatcher(false);
      Logger.error(error);
    }
  });
  return getFreedoRentalCount;
};
