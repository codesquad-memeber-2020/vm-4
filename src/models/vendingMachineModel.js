import Observable from "../util/observable.js";

export default class VendingMachineModel extends Observable {
  constructor(requestUrl, httpRequestModule) {
    super();
    this.url = requestUrl;
    this.http = httpRequestModule;
    this.menu = null;
    this.selectedMenu = [];
  }
  getInitialData() {
    this.http.get(this.url).then(data => {
      this.menu = data;
      this.notify("onLoad", this.menu);
    });
    // response받은 데이터를 this.menu에 할당
    // 데이터 로드가 완료되면 notify 메소드 실행하여 observers(Views) 업데이트
  }

  matchingMenu(price) {
    this.menu.forEach(menu => {
      if (menu.price <= price) return this.selectedMenu.push(menu);
    });
    this.notify("onInputMoney", this.selectedMenu);
  }
}
