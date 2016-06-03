//Author    :   狼Robot
//Contact   :   robot@k2046.cn
//Date      :   2008-04-19
//Explain   :   使Table可以点击排序.
/*使用说明  :
 方法1:
 new TableSorter("tb1");
 效果:
 id为tb1的table的第一行任意单元格都可以点击进行排序.
 方法2:
 new TableSorter("tb1", 0, 1, 3);
 效果:
 id为tb1的table的第一行0,1,3单元格可以进行点击排序.
 */
function TableSorter(table){
    this.Table = this.$(table);
    // console.log(this.Table.tHead);
    // console.log(this.Table.tBodies[0]);
    if(this.Table.rows.length <= 1){
        return;
    }
    this.Init(arguments);
}
//以下样式针对表头的单元格.
TableSorter.prototype.NormalCss = "NormalCss";//没有执行排序时的样式.
TableSorter.prototype.SortAscCss = "SortAscCss";//升序排序时的样式.
TableSorter.prototype.SortDescCss = "SortDescCss";//降序排序时的样式.
//初始化table的信息和操作.
TableSorter.prototype.Init = function(args){
    this.ViewState = [];
    for(var x = 0; x < this.Table.rows[0].cells.length; x++){
        this.ViewState[x] = false;
    }
    // 设置部分列可排序
    if(args.length > 1){
        for(var x = 1; x < args.length; x++){
            if(args[x] > this.Table.rows[0].cells.length){
                continue;
            }else{
                this.Table.rows[0].cells[args[x]].onclick = this.GetFunction(this,"Sort",args[x]);
                this.Table.rows[0].cells[args[x]].style.cursor = "pointer";
                this.Table.rows[0].cells[args[x]].className = this.NormalCss;
            }
        }
    }else{// 设置全部列可排序
        for(var x = 0; x < this.Table.rows[0].cells.length; x++){
            this.Table.rows[0].cells[x].onclick = this.GetFunction(this,"Sort",x);
            this.Table.rows[0].cells[x].style.cursor = "pointer";
            this.Table.rows[0].cells[x].className = this.NormalCss;
        }
    }
}
//简写document.getElementById方法.
TableSorter.prototype.$ = function(element){
    return document.getElementById(element);
}
//取得指定对象的脱壳函数.
TableSorter.prototype.GetFunction = function(variable,method,param){
    return function(){
        variable[method](param);
    }
}
//执行排序.
TableSorter.prototype.Sort = function(col){
    var SortAsNumber = true;
    // 重置列的排序样式为非排序状态
    for(var x = 0; x < this.Table.rows[0].cells.length; x++){
        //this.Table.rows[0].cells[x].className = this.NormalCss;
        var thisClassName = this.Table.rows[0].cells[x].className;
        if(thisClassName == this.SortAscCss || thisClassName == this.SortDescCss){
            this.Table.rows[0].cells[x].className = this.NormalCss;
        }
    }
    var Sorter = [];
    for(var x = 1; x < this.Table.rows.length; x++){
        Sorter[x-1] = [this.Table.rows[x].cells[col].innerHTML, x];
        // 是否是数值排序
        SortAsNumber = SortAsNumber && this.IsNumeric(Sorter[x-1][0]);
    }
    // 排序
    if(SortAsNumber){
        for(var x = 0; x < Sorter.length; x++){
            for(var y = x + 1; y < Sorter.length; y++){
                if(parseFloat(Sorter[y][0]) < parseFloat(Sorter[x][0])){
                    var tmp = Sorter[x];
                    Sorter[x] = Sorter[y];
                    Sorter[y] = tmp;
                }
            }
        }
    }else{
        // console.log(Sorter);
        Sorter.sort();
        //默认按ASCII码排序，stringObject.localeCompare(target)，
        // 如果 stringObject 小于 target，则 localeCompare() 返回小于 0 的数。
        // 如果 stringObject 大于 target，则该方法返回大于 0 的数。
        // 如果两个字符串相等，或根据本地排序规则没有区别，该方法返回 0，
        // 器比较使用的是本地的规则，本地规则意思就是使用操作系统底层对这些本地字符排序的规则进行排序，
        // 默认情况下比如使用大于号这样的比较只是纯粹比较两个字符的unicode的数大小，会与很多语言不符。
        //Sorter.sort(function(x, y){
        //    return x[0].localeCompare(y[0]);
        //});
    }
    if(this.ViewState[col]){
        Sorter.reverse();
        this.ViewState[col] = false;
        this.Table.rows[0].cells[col].className = this.SortDescCss;
    }else{
        this.ViewState[col] = true;
        this.Table.rows[0].cells[col].className = this.SortAscCss;
    }
    var Rank = [];
    for(var x = 0; x < Sorter.length; x++){
        Rank[x] = this.GetRowHtml(this.Table.rows[Sorter[x][1]]);
    }
    // table内容重排
    for(var x = 1; x < this.Table.rows.length; x++){
        for(var y = 0; y < this.Table.rows[x].cells.length; y++){
            this.Table.rows[x].cells[y].innerHTML = Rank[x-1][y];
        }
    }
    this.OnSorted(this.Table.rows[0].cells[col], this.ViewState[col]);
}
//取得指定行的内容.
TableSorter.prototype.GetRowHtml = function(row){
    var result = [];
    for(var x = 0; x < row.cells.length; x++){
        result[x] = row.cells[x].innerHTML;
    }
    return result;
}
TableSorter.prototype.IsNumeric = function(num){
    return /^\d+(\.\d+)?$/.test(num);
}
//可自行实现排序后的动作.
TableSorter.prototype.OnSorted = function(cell, IsAsc){
    return;
}