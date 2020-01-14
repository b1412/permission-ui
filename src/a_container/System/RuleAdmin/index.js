import React from "react";
import "./index.scss";
import CrudPage from "../../../a_component/CurdPage";

export default class RuleAdminContainer extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const options = {
      entity: "rule",
      columns: [
        {
          title: "name",
          dataIndex: "name",
          search: true,
          type: "text",
          rules: [{ required: true, whitespace: true }, { max: 12 }]
        }
      ],
      columnActions: []
    };

    return <CrudPage options={options} />;
  }
}
