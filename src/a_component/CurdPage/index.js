import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import P from "prop-types";
import {
  Button,
  Divider,
  Form,
  Icon,
  Input,
  message,
  Modal,
  Popconfirm,
  Table,
  Tooltip
} from "antd";
import "./index.scss";
import { callAPI, createQueryString } from "../../a_action/sys-action";
import MySelect from "../MySelect";
import tools from "../../util/tools";

const FormItem = Form.Item;

@connect(
  state => ({
    userinfo: state.app.userinfo,
    powers: state.app.powers
  }),
  dispatch => ({
    actions: bindActionCreators(
      {
        callAPI,
        createQueryString
      },
      dispatch
    )
  })
)
@Form.create()
export default class CrudPage extends React.Component {
  static propTypes = {
    options: P.object,
    actions: P.any,
    powers: P.array,
    form: P.any,
    children: P.any
  };

  constructor(props) {
    super(props);
    const { options } = props;
    const defaultOptions = {
      columnActions: [],
      queryParams: undefined
    };
    this.state = {
      ...defaultOptions,
      ...options,
      ...{
        data: [],
        operateType: "add",
        loading: false,
        filter: {},
        modalShow: false,
        modalLoading: false,
        nowData: null,
        pageNum: 0,
        pageSize: 10,
        total: 0
      }
    };
  }

  componentDidMount() {
    this.onGetData();
  }

  componentWillReceiveProps(nextProp, nextContext) {
    this.setState(nextProp.options);
    this.onGetData();
  }
  onGetData() {
    let filter = this.state.filter;
    filter.pageNum = this.state.pageNum;
    filter.pageSize = this.state.pageSize;
    filter.embedded = this.state.listEmbedded;
    this.setState({ loading: true });
    let queryString = createQueryString(tools.clearNull(filter));
    if (this.state.queryParams) {
      queryString += `&${this.state.queryParams}`;
    }
    this.props.actions
      .callAPI("get", `v1/${this.state.entity}?${queryString}`)
      .then(res => {
        if (res.status === 200) {
          this.setState({
            data: res.data.content,
            total: res.data.totalElements
          });
        } else {
          message.error(res.message);
        }
        this.setState({ loading: false });
      })
      .catch(() => {
        this.setState({ loading: false });
      });
  }

  filterChange(param) {
    const { filter } = this.state;
    Object.keys(param).forEach(key => {
      filter[key] = param[key];
    });
    this.setState({
      filter: filter
    });
  }

  onSearch() {
    this.onGetData();
  }

  onModalShow(data, type) {
    const { form, actions } = this.props;
    if (type === "add") {
      form.resetFields();
    } else {
      let url = `v1/${this.state.entity}/${data.id}`;
      if (this.state.listEmbedded) {
        url += `?embedded=${this.state.listEmbedded}`;
      }
      actions.callAPI("get", url).then(res => {
        form.setFieldsValue(res.data);
      });
    }
    this.setState({
      modalShow: true,
      nowData: data,
      operateType: type
    });
  }

  onOk() {
    const { form } = this.props;
    if (this.state.operateType === "see") {
      this.onClose();
      return;
    }
    form.validateFields(
      this.state.columns.map(item => item.dataIndex),
      (err, values) => {
        if (err) {
          return false;
        }
        this.setState({ modalLoading: true });
        if (this.state.operateType === "add") {
          this.props.actions
            .callAPI("post", `v1/${this.state.entity}`, values)
            .then(res => {
              if (res.status === 200) {
                message.success("Success");
                this.onGetData();
                this.onClose();
              } else {
                message.error(res.message);
              }
              this.setState({ modalLoading: false });
            })
            .catch(() => {
              this.setState({ modalLoading: false });
            });
        } else {
          this.props.actions
            .callAPI(
              "put",
              `v1/${this.state.entity}/${this.state.nowData.id}`,
              values
            )
            .then(res => {
              if (res.status === 200) {
                message.success("Success");
                this.onGetData();
                this.onClose();
              } else {
                message.error(res.message);
              }
              this.setState({ modalLoading: false });
            })
            .catch(() => {
              this.setState({ modalLoading: false });
            });
        }
      }
    );
  }

  onDel(id) {
    this.setState({ loading: true });
    this.props.actions
      .callAPI("delete", `v1/${this.state.entity}/${id}`)
      .then(res => {
        if (res.status === 200) {
          message.success("Successfully");
          this.onGetData(this.state.pageNum, this.state.pageSize);
        } else {
          message.error(res.message);
          this.setState({ loading: false });
        }
      })
      .catch(() => {
        this.setState({ loading: false });
      });
  }

  onHttp(method, url) {
    this.setState({ loading: true });
    this.props.actions
      .callAPI(method, url)
      .then(res => {
        if (res.status === 200) {
          message.success("Successfully");
          this.onGetData();
        } else {
          message.error(res.message);
          this.setState({ loading: false });
        }
      })
      .catch(() => {
        this.setState({ loading: false });
      });
  }

  onClose() {
    this.setState({
      modalShow: false
    });
  }

  makeColumns(columnActions) {
    return this.state.columns
      .filter(it => !it.hiddenInList)
      .map(it => {
        if (it.type === "select") {
          let target = {};
          target = Object.assign(target, it, { dataIndex: it["dataDisplay"] });
          return target;
        } else {
          return it;
        }
      })
      .concat(columnActions);
  }

  render() {
    const columnActions = {
      title: "Operations",
      key: "control",
      width: 200,
      render: (text, record) => {
        const controls = [];
        const p = this.props.powers;
        p.includes(`update ${this.state.entity}`) &&
          controls.push(
            <span
              key="0"
              className="control-btn green"
              onClick={() => this.onModalShow(record, "see")}
            >
              <Tooltip placement="top" title="View">
                <Icon type="eye" />
              </Tooltip>
            </span>
          );
        p.includes(`update ${this.state.entity}`) &&
          controls.push(
            <span
              key="1"
              className="control-btn blue"
              onClick={() => this.onModalShow(record, "up")}
            >
              <Tooltip placement="top" title="Update">
                <Icon type="edit" />
              </Tooltip>
            </span>
          );

        p.includes(`delete ${this.state.entity}`) &&
          controls.push(
            <Popconfirm
              key="3"
              title="Are you sure?"
              onConfirm={() => this.onDel(record.id)}
              okText="Yes"
              cancelText="No"
            >
              <span className="control-btn red">
                <Tooltip placement="top" title="Delete">
                  <Icon type="delete" />
                </Tooltip>
              </span>
            </Popconfirm>
          );

        this.state.columnActions.forEach((item, index, array) => {
          if (!p.includes(item.permissionRequired)) {
            return;
          }
          if (item.type === "confirm") {
            controls.push(
              <Popconfirm
                key={index}
                title="Are you sure?"
                onConfirm={() =>
                  this.onHttp(item.httpMethod, `${item.url}/${record.id}`)
                }
                okText="Yes"
                cancelText="No"
              >
                <span className="control-btn blue">
                  <Tooltip placement="top" title={item.title}>
                    <Icon type={item.icon} />
                  </Tooltip>
                </span>
              </Popconfirm>
            );
          }else if (item.type === "customer"){
            controls.push(item.com(record));
          }
        });

        const result = [];
        controls.forEach((item, index) => {
          if (index) {
            result.push(<Divider key={`line${index}`} type="vertical" />);
          }
          result.push(item);
        });
        return result;
      }
    };
    const { form, powers } = this.props;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 19 }
      }
    };

    const formItems = [];
    this.state.columns.forEach(item => {
      if (item.type === "text" || item.type === "password") {
        formItems.push(
          <FormItem label={item.title} {...formItemLayout}>
            {getFieldDecorator(item.dataIndex, {
              initialValue: undefined,
              rules: item.rules
            })(
              <Input
                type={item.type}
                disabled={this.state.operateType === "see"}
              />
            )}
          </FormItem>
        );
      } else if (item.type === "select") {
        formItems.push(
          <FormItem label={item.title} {...formItemLayout}>
            {getFieldDecorator(item.dataIndex, {
              initialValue: undefined,
              rules: [
                {
                  required: true,
                  message: "please select a " + item.title.toLowerCase()
                }
              ]
            })(
              <MySelect
                url={item.url}
                disabled={this.state.operateType === "see"}
                name={"name"}
              />
            )}
          </FormItem>
        );
      }
    });

    const searchItems = [];
    this.state.columns
      .filter(it => it.search)
      .map(it =>
        searchItems.push(
          <li>
            <Input
              placeholder={it.title}
              onChange={e => {
                const param = {};
                param["f_" + it.dataIndex] = e.target.value;
                param["f_" + it.dataIndex + "_op"] = "like";
                this.filterChange(param);
              }}
              value={this.state.filter["f_" + it.dataIndex]}
            />
          </li>
        )
      );
    return (
      <div>
        <div className="g-search">
          <ul className="search-func">
            <li>
              <Button
                type="primary"
                disabled={!powers.includes("create user")}
                onClick={() => this.onModalShow(null, "add")}
              >
                <Icon type="plus-circle-o" />
                Add
              </Button>
            </li>
          </ul>
          <Divider type="vertical" />
          <ul className="search-ul">
            {searchItems.map((component, index) => (
              <React.Fragment key={index}>{component}</React.Fragment>
            ))}
            <li>
              <Button
                icon="search"
                type="primary"
                onClick={() => this.onSearch()}
              >
                Search
              </Button>
            </li>
          </ul>
        </div>
        <div className="diy-table">
          <Table
            columns={this.makeColumns(columnActions)}
            loading={this.state.loading}
            dataSource={this.state.data}
            pagination={{
              total: this.state.total,
              current: this.state.pageNum,
              pageSize: this.state.pageSize,
              showQuickJumper: true,
              showTotal: (total, range) => `${total} records in total`,
              onChange: (pageNum, pageSize) => {
                this.setState({
                  pageNum: pageNum,
                  pageSize: pageSize
                });
                this.onGetData();
              }
            }}
          />
        </div>
        <Modal
          title={this.state.operateType.toUpperCase()}
          visible={this.state.modalShow}
          onOk={() => this.onOk()}
          onCancel={() => this.onClose()}
          confirmLoading={this.state.modalLoading}
        >
          <Form>
            {formItems.map((component, index) => (
              <React.Fragment key={index}>{component}</React.Fragment>
            ))}
          </Form>
        </Modal>
        {this.props.children}
      </div>
    );
  }
}
