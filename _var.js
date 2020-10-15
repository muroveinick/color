let currcol = "";
let colorObj = () => `<div class="flex"> 
                       <div class="output" style="background-color: rgb(${currcol})"></div>
                       <label>Цвета, %:</label>
                       <span id="percent" style="min-width: 20px"></span>
                       <button class="ok">OK</button>
                       <button class="cansel">X</button>
                      </div>`;
