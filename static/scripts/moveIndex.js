(function() {
  const $ = document.querySelector.bind(document);
  const orderButton = $(".listtitle > button");
  const orderText = $(".listtitle > span");
  let currentOrder = orderButton.dataset.order;
  orderButton.addEventListener("click", () => {
    if (currentOrder === "1") {
      orderButton.innerText = "从新到旧排序";
      orderText.innerText = '影片列表 - 从旧到新'
      orderButton.dataset.order = "2";
    } else {
      orderButton.innerText = "从旧到新排序";
      orderText.innerText = '影片列表 - 从新到旧'
      orderButton.dataset.order = "1";
    }
    currentOrder = orderButton.dataset.order;
    const listContainer = $("div.listContainer");
    const listChildren = listContainer.children;
    for (let i = listChildren.length - 1; i--; ) {
      listContainer.appendChild(listChildren[i]);
    }
    listContainer.children = listChildren;
  });
})();
