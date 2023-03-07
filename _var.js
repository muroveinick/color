let arrayData = [];
let arrayOfColors = [];

const selectedColors = document.querySelector('[class*="selectedColors"]');
const drag = document.querySelector(".drag");

const on_input = function (index, key) {
  const ctrl = document.getElementById(`${key}${index}`);
  const value = ctrl.type === "number" ? +ctrl.value : ctrl.value;
  if (value) arrayOfColors[index][key] = value;
};

let colorObj = (obj, index) => 
`
<div class="flex ${obj.selected ? "selected" : ''}">
  <div class="output" style="background-color: rgb(${obj.colorArr.join(',')})"></div>
  <label>Цвета,&nbsp;%: </label>
  <span id="percent">${obj.percent}</span>
  <label>Название: </label>
  <input id="phaseName${index}" style="min-width: 20px" value="${obj.phaseName}" oninput="on_input(${index}, 'phaseName')" />
  <label>Разброс: </label>
  <input type="number" id="delta${index}" style="min-width: 20px" value="${obj.delta}" oninput="on_input(${index}, 'delta')" />
  <button class="cancel"> &#10060;</button>
  <button onclick="redrawPixels()">&#9989;</button>
  <label class="switch">
    <input type="checkbox" unchecked id="lasso${index}">
    <span class="slider round"></span>
  </label>
</div>
`;

colorData = class {
  constructor(color, id) {
    this.id = id;
    this.colorArr = color.split(",");
    this.selected = true;
  }
  percent = 0;
  selected = false;
  delta = 0;
  phaseName = "";
  pixelIndexes = new Set();
  set(delta, phaseName) {
    this.delta = delta;
    this.phaseName = phaseName;
  }
};
