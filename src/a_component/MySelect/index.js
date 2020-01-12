import React from "react";
import P from "prop-types";
import "./index.scss";
import { message, Select } from "antd";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { callAPI } from "../../a_action/sys-action";
const { Option } = Select;

@connect(
  state => ({
    userinfo: state.app.userinfo,
    powers: state.app.powers
  }),
  dispatch => ({
    actions: bindActionCreators(
      {
        callAPI
      },
      dispatch
    )
  })
)
export default class Com extends Select {
  static propTypes = {
    data: P.array,
    url: P.any
  };

  componentDidMount() {
    this.props.actions.callAPI("get", this.props.url).then(res => {
      if (res.status === 200) {
        this.setState({ data: res.data.content });
      }
    });
  }

  constructor(props) {
    super(props);
    this.state = {
      data: []
    };
  }
  render() {
    const { data } = this.state;
    this.props.children = data.map(r => {
      return (
        <Option key={r.id} value={r.id}>
          {r.name}
        </Option>
      );
    });
    return super.render();
  }
}
