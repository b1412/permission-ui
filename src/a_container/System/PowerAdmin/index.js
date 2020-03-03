import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import P from "prop-types";
import _ from "lodash";
import "./index.scss";
import CrudPage from "../../../a_component/CurdPage";
import { Form, Tree } from "antd";
import {
  callAPI,
  getMenus,
  getPowerDataByMenuId
} from "../../../a_action/sys-action";

const { TreeNode } = Tree;
const FormItem = Form.Item;
@connect(
  state => ({
    powers: state.app.powers
  }),
  dispatch => ({
    actions: bindActionCreators(
      { getMenus, getPowerDataByMenuId, callAPI },
      dispatch
    )
  })
)
@Form.create()
export default class PowerAdminContainer extends React.Component {
  static propTypes = {
    location: P.any,
    history: P.any,
    actions: P.any,
    form: P.any,
    menus: P.array,
    powers: P.array
  };

  constructor(props) {
    super(props);
    this.state = {
      data: [], // 当前所选菜单下的权限数据
      sourceData: [], // 所有的菜单数据（分层级）
      loading: false, // 页面主要数据是否正在加载中
      treeSelect: {}, // 当前Menu树被选中的节点数据
      nowData: null, // 当前选中的那条数据
      operateType: "add", // 操作类型 add新增，up修改, see查看
      modalShow: false, // 新增&修改 模态框是否显示
      modalLoading: false, // 新增&修改 模态框是否正在执行请求
      menuChoseShow: false // 菜单选择树是否出现
    };
  }

  componentDidMount() {
    const { actions } = this.props;
    actions.getMenus().then(res => {
      console.log(res.data);
      this.setState({
        menus: res.data
      });
      this.makeSourceData(this.state.menus);
    });
  }

  UNSAFE_componentWillReceiveProps(nextP) {
    if (nextP.menus !== this.state.menus) {
      this.makeSourceData(nextP.menus);
    }
  }

  /** 根据所选菜单id获取其下权限数据 **/
  getData(menuId = null) {
    if (menuId == null) {
      return;
    }
    this.setState({
      loading: true
    });
    const params = {
      menuId: Number(menuId) || null
    };
    this.props.actions
      .getPowerDataByMenuId(params)
      .then(res => {
        if (res.status === 200) {
          this.setState({
            data: res.data
          });
        }
        this.setState({
          loading: false
        });
      })
      .catch(() => {
        this.setState({
          loading: false
        });
      });
  }
  /** 处理原始数据，将原始数据处理为层级关系 **/
  makeSourceData(data) {
    const d = _.cloneDeep(data);
    //
    d.sort((a, b) => {
      return a.sorts - b.sorts;
    });
    const sourceData = this.dataToJson(null, d) || [];
    console.log("source data");
    console.log(sourceData);
    this.setState({
      sourceData
    });
  }

  /** 工具 - 递归将扁平数据转换为层级数据 **/
  dataToJson(one, data) {
    let kids;
    if (!one) {
      kids = data.filter(item => !item.parent);
    } else {
      kids = data.filter(item => item.parent === one.id);
    }
    kids.forEach(item => (item.children = this.dataToJson(item, data)));
    return kids.length ? kids : null;
  }

  /** 递归构建树结构 **/
  makeTreeDom(data) {
    return data.map(item => {
      if (item.children) {
        return (
          <TreeNode title={item.title} key={`${item.id}`} p={item.parent}>
            {this.makeTreeDom(item.children)}
          </TreeNode>
        );
      } else {
        return (
          <TreeNode
            title={item.title}
            key={`${item.id}`}
            id={item.id}
            p={item.parent}
          />
        );
      }
    });
  }

  /** 点击树目录时触发 **/
  onTreeSelect = (keys, e) => {
    if (e.selected) {
      // 选中时才触发
      const p = e.node.props;
      this.getData(p.eventKey);
      this.setState({
        treeSelect: { title: p.title, id: p.eventKey }
      });
    } else {
      this.setState({
        treeSelect: {},
        data: []
      });
    }
  };

  render() {
    const options = {
      entity: "permission",
      columns: [
        {
          title: "Entity",
          dataIndex: "entity",
          search: true,
          type: "text",
          rules: [{ required: true, whitespace: true }, { max: 32 }]
        },
        {
          title: "Display",
          dataIndex: "display",
          search: true,
          type: "text",
          rules: [{ required: true, whitespace: true }, { max: 32 }]
        },
        {
          title: "AuthUris",
          dataIndex: "authUris",
          search: true,
          type: "text",
          rules: [{ required: true, whitespace: true }, { max: 32 }]
        }
      ],
      columnActions: []
    };
    const entity = this.state.treeSelect.title;
    if (entity) {
      options.queryParams = `f_entity=${entity}&f_entity_op==`;
    }
    return (
      <div className="page-power-admin flex-row">
        <div className="l">
          <div>
            <Tree defaultExpandedKeys={["0"]} onSelect={this.onTreeSelect}>
              <TreeNode title="Root" key="0" selectable={false}>
                {this.makeTreeDom(this.state.sourceData)}
              </TreeNode>
            </Tree>
          </div>
        </div>
        <div className="r flex-auto">
          <CrudPage options={options} />
        </div>
      </div>
    );
  }
}
