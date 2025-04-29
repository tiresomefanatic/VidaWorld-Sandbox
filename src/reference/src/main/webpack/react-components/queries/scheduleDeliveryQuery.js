import gql from "graphql-tag";

export const SCHEDULE_DELIVERY_QUERY = gql`
  mutation scheduleDelivery(
    $order_id: String!
    $delivery_order_id: String!
    $requestedDeliveryDate: String!
    $requestedDeliveryTimeSlotId: String!
    $atEC_c: Boolean!
    $atHome_c: Boolean!
    $branch_id: String
    $utm_params: UtmParamsTypes
  ) {
    scheduleDelivery(
      order_id: $order_id
      delivery_order_id: $delivery_order_id
      requestedDeliveryDate: $requestedDeliveryDate
      requestedDeliveryTimeSlotId: $requestedDeliveryTimeSlotId
      atEC_c: $atEC_c
      atHome_c: $atHome_c
      branch_id: $branch_id
      utm_params: $utm_params
    ) {
      message
      status
    }
  }
`;
