let currcol = "";
let colorObj = () => `<div class="flex"> 
                       <div class="output" style="background-color: rgb(${currcol})"></div>
                       <label>Цвета, %: </label>
                       <span id="percent" style="min-width: 20px"> </span>
                       <label>Название: </label>
                       <span id="phaseName" style="min-width: 20px"> </span>
                       <button class="ok">OK</button>
                       <button class="cansel">X</button>
                      </div>`;
colorData = class {
  constructor(delta, color, name) {
    this.delta = delta;
    this.color = color;
    this.colorArr = this.color.split(",");
    this.phaseName = name;
  }
};
