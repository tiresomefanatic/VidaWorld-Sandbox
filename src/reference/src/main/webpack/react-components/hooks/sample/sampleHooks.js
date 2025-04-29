import apolloClient from "../../../services/graphql.service";
import { useQuery } from "@apollo/react-hooks";
import COUNTRY_LIST_QUERY from "../../queries/sampleQueries";
import { setCountriesDataDispatcher } from "../../store/sample/sampleActions";
import Logger from "../../../services/logger.service";

const useCountryList = () => {
  /* Fetch graphQL data using 'useQuery' and push it to Action */
  useQuery(COUNTRY_LIST_QUERY, {
    client: apolloClient,
    fetchPolicy: "no-cache",
    onCompleted: (data) => {
      data && setCountriesDataDispatcher(data.countries);
    },
    onError: (error) => {
      Logger.error(error);
    }
  });
};

export { useCountryList };
