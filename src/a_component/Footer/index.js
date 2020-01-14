/* Footer 页面底部 */
import React from "react";
import { Layout } from "antd";
import "./index.scss";

const { Footer } = Layout;
export default class Com extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Footer className="footer">
        © 2019-2020{" "}
        <a
          href="https://github.io/b1412"
          target="_blank"
          rel="noopener noreferrer"
        >
          https://github.io/b1412
        </a>
        , Inc.
      </Footer>
    );
  }
}

Com.propTypes = {};
