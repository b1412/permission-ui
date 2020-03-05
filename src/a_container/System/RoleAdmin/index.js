import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import "./index.scss";
import {
  callAPI,
  createQueryString,
  getMenus,
  getRoleById
} from "../../../a_action/sys-action";
import CrudPage from "../../../a_component/CurdPage";
import P from "prop-types";
import { Icon, message, Tooltip } from "antd";
import TreeTable from "../../../a_component/TreeChose/PowerTreeTable";

@connect(
  state => ({}),
  dispatch => ({
    actions: bindActionCreators(
      {
        callAPI,
        getMenus,
        getRoleById,
        createQueryString
      },
      dispatch
    )
  })
)
export default class RoleAdminContainer extends React.Component {
  static propTypes = {
    actions: P.any,
    powerTreeData: P.array
  };

  constructor(props) {
    super(props);
    this.state = {
      data: [], // 当前页面全部数据
      operateType: "add", // 操作类型 add新增，up修改, see查看
      loading: false, // 表格数据是否正在加载中
      searchTitle: undefined, // 搜索 - 角色名
      searchConditions: undefined, // 搜索 - 状态
      modalShow: false, // 添加/修改/查看 模态框是否显示
      modalLoading: false, // 添加/修改/查看 是否正在请求中
      nowData: null, // 当前选中用户的信息，用于查看详情、修改、分配菜单
      powerTreeShow: false, // 菜单树是否显示
      powerTreeDefault: { menus: [], powers: [] }, // 用于菜单树，默认需要选中的项
      pageNum: 0, // 当前第几页
      pageSize: 10, // 每页多少条
      total: 0, // 数据库总共多少条数据
      treeLoading: false, // 控制树的loading状态，因为要先加载当前role的菜单，才能显示树
      treeOnOkLoading: false // 是否正在分配菜单
    };
  }

  onGetPowerTreeData() {
    const { actions } = this.props;
    actions.getMenus().then(res => {
      console.log(res.data);
      this.setState({
        powerTreeData: res.data
      });
    });
  }

  onMenuTreeClose() {
    this.setState({
      powerTreeShow: false
    });
  }

  // 菜单树确定 给角色分配菜单
  onMenuTreeOk(arr) {
    const params = {
      menus: arr.menus,
      powers: arr.powers
    };
    console.log(params);
    let rolePermissions = arr.powers.map(it => {
      return {
        permission: { id: it },
        rules: [
          {
            id: 1
          }
        ]
      };
    });

    let role = {
      rolePermissions: rolePermissions
    };

    this.props.actions
      .callAPI("put", `v1/role/${this.state.nowData.id}`, role)
      .then(res => {
        if (res.status === 204) {
          this.onGetData(this.state.pageNum, this.state.pageSize);
          this.onMenuTreeClose();
        } else {
          message.error(res.message || "assign permission fail");
        }
        this.setState({
          treeOnOkLoading: false
        });
      })
      .catch(() => {
        this.setState({
          treeOnOkLoading: false
        });
      });
    console.log(params);
    this.setState({
      treeOnOkLoading: true
    });
  }

  /** 分配权限按钮点击，权限控件出现 **/
  onAllotPowerClick(record) {
    console.log(record);
    const { actions } = this.props;
    actions.getMenus().then(res => {
      const menus = [];
      const powers = [];
      this.setState({
        powerTreeData: res.data,
        nowData: record,
        powerTreeShow: true,
        powerTreeDefault: { menus, powers }
      });
    });
  }

  render() {
    const options = {
      entity: "role",
      columns: [
        {
          title: "name",
          dataIndex: "name",
          search: true,
          type: "text",
          rules: [{ required: true, whitespace: true }, { max: 32 }]
        }
      ],
      columnActions: [
        {
          com: record => (
            <span
              key="2"
              className="control-btn blue"
              onClick={() => this.onAllotPowerClick(record)}
            >
              <Tooltip placement="top" title="Assign">
                <Icon type="tool" />
              </Tooltip>
            </span>
          ),
          type: "customer",
          permissionRequired: "update user"
        }
      ]
    };
    console.log(this.state.powerTreeData);
    return (
      <CrudPage options={options}>
        <TreeTable
          title={"分配权限"}
          data={this.state.powerTreeData}
          defaultChecked={this.state.powerTreeDefault}
          initloading={this.state.treeLoading}
          loading={this.state.treeOnOkLoading}
          modalShow={this.state.powerTreeShow}
          onOk={arr => this.onMenuTreeOk(arr)}
          onClose={() => this.onMenuTreeClose()}
        />
      </CrudPage>
    );
  }
}
