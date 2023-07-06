<script type="text/javascript">
const orderStateOption = [
    {
      label: "缺货",
      value: 0,
    },
    {
      label: "订购",
      value: 1,
    },
    {
      label: "待调度",
      value: 2,
    },
    {
      label: "订单出库",
      value: 3,
    },{
        label: "订单运输",
        value: 4
    },{
        label: "验货入库",
        value: 5
    },{
        label: "待分配",
        value: 6
    },{
        label: "配送出库",
        value: 7
    },{
        label: "领货配送",
        value: 8
    },{
        label: "回执录入",
        value: 9
    },{
      label: "部分完成",
      value: 10
    },{
      label: "失败",
      value: 11
    }
  ]

  const orderTypeOption = [
    {
      label: "新订",
      value: 1,
    },
    {
      label: "退订",
      value: 2,
    },
    {
      label: "换货",
      value: 3,
    },
    {
      label: "退货",
      value: 4,
    },
  ]
function parseOrderType(orderType){
    return this.orderTypeOption.find((res) => {
        return res.value == orderType;
      }).label;
}

function parseOrderState(state){
    return this.orderStateOption.find((res) => {
        return res.value == state;
      }).label;
}
export default
{
  orderStateOption,
  orderTypeOption,
  parseOrderType,
  parseOrderState
}
</script>