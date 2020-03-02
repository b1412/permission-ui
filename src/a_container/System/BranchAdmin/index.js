import React from "react";
import "./index.scss";
import CrudPage from "../../../a_component/CurdPage";

export default class BranchAdminContainer extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const options = {
      entity: "branch",
      columns: [
        {
          title: "name",
          dataIndex: "name",
          search: true,
          type: "text",
          rules: [{ required: true, whitespace: true }, { max: 32 }]
        }
      ],
      columnActions: []
    };

    return <CrudPage options={options} />;
  }
}
