import { admin_directory_v1 } from "googleapis";
import { admin, catchAsync } from "@utils";

export const getAllOrgUnits = catchAsync(async (_, res) => {
  const result = await admin.orgunits.list({
    customerId: process.env.GOOGLE_CUSTOMER_ID,
    type: "ALL",
  });

  type OrgUnit = admin_directory_v1.Schema$OrgUnit & {
    children?: OrgUnit[];
  };

  function getNestedChildren(arr: OrgUnit[], parent: string) {
    var out: OrgUnit[] = [];
    for (var i in arr) {
      if (arr[i].parentOrgUnitPath == parent) {
        var children = getNestedChildren(arr, arr[i].orgUnitPath!);
        if (children.length) {
          arr[i].children = children;
        }
        out.push(arr[i]);
      }
    }
    return out;
  }

  const orgUnits = getNestedChildren(result.data.organizationUnits!, "/");

  res.sendJson(200, { orgUnits });
});
