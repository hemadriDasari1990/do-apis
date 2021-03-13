import {
  activeDepartmentsLookup,
  departmentAddFields,
  departmentsLookup,
  inActiveDepartmentsLookup,
} from "./departmentFilters";

const organizationLookup = {
  departmentsLookup,
  activeDepartmentsLookup,
  inActiveDepartmentsLookup,
  departmentAddFields,
};

export { organizationLookup };
