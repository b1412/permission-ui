import React from "react";
import "./index.less";
import ImgLoading from "../../assets/loading.gif";
export default class LoadingComponent extends React.PureComponent {
  static propTypes = {};

  constructor(props) {
    super(props);
    this.state = {};
  }

  makeType(p) {
    let msg;
    if (p.error) {
      msg = "Load error,please refresh the page";
    } else if (p.timedOut) {
      msg = "Load timeout";
    } else if (p.pastDelay) {
      msg = "Loading…";
    }
    return msg;
  }

  render() {
    return (
      <div className="loading">
        <img src={ImgLoading} />
        <div>{this.makeType(this.props)}</div>
      </div>
    );
  }
}
