import React from "react";
import "./index.scss";
import CrudPage from "../../../a_component/CurdPage";

export default class UserAdminContainer extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const options = {
      entity: "user",
      listEmbedded: "role,branch",
      columns: [
        {
          title: "Username",
          dataIndex: "username",
          search: true,
          type: "text",
          rules: [{ required: true, whitespace: true }, { max: 32 }]
        },
        {
          title: "Password",
          dataIndex: "password",
          type: "password",
          rules: [
            { required: true, whitespace: true },
            { min: 6 },
            { max: 18 }
          ],
          hiddenInList: true
        },
        {
          title: "ConfirmPassword",
          dataIndex: "confirmPassword",
          type: "password",
          rules: [
            { required: true, whitespace: true },
            { min: 6 },
            { max: 18 }
          ],
          hiddenInList: true
        },
        {
          title: "Email",
          dataIndex: "email",
          search: true,
          type: "text",
          rules: [{ required: true, whitespace: true }]
        },
        {
          title: "Role",
          dataIndex: "role.id",
          dataDisplay: "role.name",
          type: "select",
          url: "v1/role",
          entity: "roles"
        },
        {
          title: "Branch",
          dataIndex: "branch.id",
          dataDisplay: "branch.name",
          type: "select",
          url: "v1/branch",
          entity: "branches"
        }
      ],
      columnActions: [
        {
          url: "v1/user/verify",
          httpMethod: "put",
          type: "confirm",
          title: "Verify",
          permissionRequired: "update user",
          icon: "edit"
        }
      ]
    };
    return <CrudPage options={options} />;
  }
}
