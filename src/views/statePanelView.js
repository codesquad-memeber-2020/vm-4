import { selectorNames } from "../util/constant.js";
import { statePanel } from "./template.js";

export default class StatePanelView {
  constructor(vendingMachineModel, walletModel) {
    this.vendingMachineModel = vendingMachineModel;
    this.walletModel = walletModel;
    this.messageEl = null;
    this.money = null;
    this.selectItem = [];
    this.statusMoney = null;
  }

  registerAsObserver() {
    // 각각의 모델에 StatePanelView를 observer로 등록
    this.vendingMachineModel.addObserver("loadData", this.render.bind(this));
    this.vendingMachineModel.addObserver(
      "inputMoney",
      this.updateStatePanelView.bind(this)
    );
    this.vendingMachineModel.addObserver(
      "purchaseItem",
      this.updateMessageView.bind(this)
    );
    this.vendingMachineModel.addObserver(
      "purchaseItem",
      this.updateCalcMoney.bind(this)
    );
    this.walletModel.addObserver(
      "purchaseItem",
      this.clearStatePanelView.bind(this)
    );
  }

  render(data) {
    const vendingMachine = document.getElementById(selectorNames.VM);
    const statePanelView = statePanel`${data}`;
    vendingMachine.insertAdjacentHTML("beforeend", statePanelView);
    this.messageEl = document.querySelector(".state-message");
    this.moneyEl = document.querySelector(".state-money span");
  }

  updateMessageView(data) {
    // 현황판 업데이트
    this.selectItem.push(data);
    const a = this.selectItem.reduce(
      (v, n) => (v += `<p>${n.name} 선택했습니다.</p>`),
      ""
    );
    this.messageEl.innerHTML = a;
  }
  
  updateStatePanelView(data) {
    this.statusMoney = data;
    this.updateMoneyView();
  }
  updateCalcMoney(data) {
    this.statusMoney -= data.price;
    this.updateMoneyView();
  }
  updateMoneyView(){
    this.moneyEl.innerHTML = `${this.statusMoney}`;
  }

  clearStatePanelView() {
    // 상태 패널 초기화
  }

  bindOnClickListener(handler) {
    const statePanelButtonArea = document.querySelector(".state-numbers");
    statePanelButtonArea.addEventListener("click", e => {
      if (e.target.nodeName !== "BUTTON") return;
      handler(e.target.value);
    });
  }
}
