import { setSampleDataDispatcher } from "../../store/sample/sampleActions";
import API from "../../../services/rest.service";

function getSampleData(url) {
  API.getData(url).then((response) => {
    if (response) {
      const data = response.data;
      const sampleData = {
        firstName: data.firstName,
        lastName: data.lastName
      };
      setSampleDataDispatcher(sampleData);
    }
  });
}

export { getSampleData };
