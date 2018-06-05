/*动态改变模块信息*/
function show_module(module_info, id) {
    module_info = module_info.split('replaceFlag');
    var a = $(id);
    a.empty();
    for (var i = 0; i < module_info.length; i++) {
        if (module_info[i] !== "") {
            var value = module_info[i].split('^=');
            a.prepend("<option value='" + value[0] + "' >" + value[1] + "</option>")
        }
    }
    a.prepend("<option value='请选择' >请选择</option>");

}

function show_case(case_info, id) {
    case_info = case_info.split('replaceFlag');
    var a = $(id);
    a.empty();
    for (var i = 0; i < case_info.length; i++) {
        if (case_info[i] !== "") {
            var value = case_info[i].split('^=');
            a.prepend("<option value='" + value[0] + "' >" + value[1] + "</option>")
        }
    }
    a.prepend("<option value='请选择' >单接口用例，无需依赖</option>");

}

/*表单信息异步传输*/
function info_ajax(id, url) {
    var data = $(id).serializeJSON();
    if (id === '#add_task') {
        var include = [];
        var i = 0;
        $("ul#pre_case li a").each(function () {
            include[i++] = [$(this).attr('id'), $(this).text()];
        });
        data['module'] = include;
    }

    $.ajax({
        type: 'post',
        url: url,
        data: JSON.stringify(data),
        contentType: "application/json",
        success: function (data) {
            if (data !== 'ok') {
                if (data.indexOf('/api/') !== -1) {
                    window.location.href = data;
                } else {
                    myAlert(data);
                }
            }
            else {
                window.location.reload();
            }
        }
        ,
        error: function () {
            myAlert('Sorry，服务器可能开小差啦, 请重试!');
        }
    });

}

function auto_load(id, url, target, type) {
    var data = $(id).serializeJSON();
    if (id === '#form_message') {
        data = {
            "test": {
                "name": data,
                "type": type
            }
        }
    } else if (id === '#form_config') {
        data = {
            "config": {
                "name": data,
                "type": type
            }
        }
    } else {
        data = {
            "task": {
                "name": data,
            }
        }
    }
    $.ajax({
        type: 'post',
        url: url,
        data: JSON.stringify(data),
        contentType: "application/json",
        success: function (data) {
            if (type === 'module') {
                show_module(data, target)
            } else {
                show_case(data, target)
            }
        }
        ,
        error: function () {
            myAlert('Sorry，服务器可能开小差啦, 请重试!');
        }
    });

}

function update_data_ajax(id, url) {
    var data = $(id).serializeJSON();
    $.ajax({
        type: 'post',
        url: url,
        data: JSON.stringify(data),
        contentType: "application/json",
        success: function (data) {
            if (data !== 'ok') {
                myAlert(data);
            }
            else {
                window.location.reload();
            }
        },
        error: function () {
            myAlert('Sorry，服务器可能开小差啦, 请重试!');
        }
    });
}

function del_data_ajax(id, url) {
    var data = {
        "id": id,
        'mode': 'del'
    };
    $.ajax({
        type: 'post',
        url: url,
        data: JSON.stringify(data),
        contentType: "application/json",
        success: function (data) {
            if (data !== 'ok') {
                myAlert(data);
            }
            else {
                window.location.reload();
            }
        },
        error: function () {
            myAlert('Sorry，服务器可能开小差啦, 请重试!');
        }
    });
}

function copy_data_ajax(id, url) {
    var data = {
        "data": $(id).serializeJSON(),
        'mode': 'copy'
    };
    $.ajax({
        type: 'post',
        url: url,
        data: JSON.stringify(data),
        contentType: "application/json",
        success: function (data) {
            if (data !== 'ok') {
                myAlert(data);
            }
            else {
                window.location.reload();
            }
        },
        error: function () {
            myAlert('Sorry，服务器可能开小差啦, 请重试!');
        }
    });
}

function case_ajax(type) {
    var url = {'url':$("#url").find("option:selected").text()};
    var method = $("#method").serializeJSON();
    var dataType = $("#DataType").serializeJSON();
    var caseInfo = $("#form_message").serializeJSON();
    var variables = $("#form_variables").serializeJSON();
    var request_data = null;
    if (dataType.DataType === 'json') {
        try {
            request_data = eval('(' + $('#json-input').val() + ')');
        }
        catch (err) {
            myAlert('Json格式输入有误！')
            return
        }
    } else {
        request_data = $("#form_request_querys").serializeJSON();
    }
    var headers = $("#form_request_headers").serializeJSON();
    var extract = $("#form_extract").serializeJSON();
    var validate = $("#form_validate").serializeJSON();
    var parameters = $('#form_params').serializeJSON();
    var hooks = $('#form_hooks').serializeJSON();
    var include = [];
    var i = 0;
    $("ul#pre_case li a").each(function () {
        include[i++] = [$(this).attr('id'), $(this).text()];
    });
    caseInfo['include'] = include;
    const test = {
        "test": {
            "name": caseInfo,
            "parameters": parameters,
            "variables": variables,
            "request": {
                "url": url.url,
                "method": method.method,
                "headers": headers,
                "type": dataType.DataType,
                "request_data": request_data
            },
            "extract": extract,
            "validate": validate,
            "hooks": hooks,
        }
    };
    if (type === 'edit') {
        url = '/api/edit_case/';
    } else {
        url = '/api/add_case/';
    }
    $.ajax({
        type: 'post',
        url: url,
        data: JSON.stringify(test),
        contentType: "application/json",
        success: function (data) {
            if (data === 'session invalid') {
                window.location.href = "/api/login/";
            } else {
                if (data.indexOf('/api/') != -1) {
                    window.location.href = data;
                } else {
                    myAlert(data);
                }
            }
        },
        error: function () {
            myAlert('Sorry，服务器可能开小差啦, 请重试!');
        }
    });
}

function config_ajax(type) {
    var dataType = $("#config_data_type").serializeJSON();
    var caseInfo = $("#form_config").serializeJSON();
    var variables = $("#config_variables").serializeJSON();
    var parameters = $('#config_params').serializeJSON();
    var hooks = $('#config_hooks').serializeJSON();
    var request_data = null;
    if (dataType.DataType === 'json') {
        try {
            request_data = eval('(' + $('#json-input').val() + ')');
        }
        catch (err) {
            myAlert('Json格式输入有误！')
            return
        }
    } else {
        request_data = $("#config_request_data").serializeJSON();
    }
    var headers = $("#config_request_headers").serializeJSON();

    const config = {
        "config": {
            "name": caseInfo,
            "variables": variables,
            "parameters": parameters,
            "request": {
                "headers": headers,
                "type": dataType.DataType,
                "request_data": request_data
            },
            "hooks": hooks,

        }
    };
    if (type === 'edit') {
        url = '/api/edit_config/';
    } else {
        url = '/api/add_config/';
    }
    $.ajax({
        type: 'post',
        url: url,
        data: JSON.stringify(config),
        contentType: "application/json",
        success: function (data) {
            if (data === 'session invalid') {
                window.location.href = "/api/login/";
            } else {
                if (data.indexOf('/api/') != -1) {
                    window.location.href = data;
                } else {
                    myAlert(data);
                }
            }
        },
        error: function () {
            myAlert('Sorry，服务器可能开小差啦, 请重试!');
        }
    });
}

//加载项目列表
function loadProjectList(target) {

     var url = "/api/get_project_list"
    $.ajax({
    type:"get",
        url:url,
        success:function (data) {
            $(target).empty();
            var optionContent = "";
            $.each(data.data,function (index,item) {
                optionContent += "<option value='"+item.id+"'>"+item.project_name+"</option>";
            })
            optionContent += "<option value='0'>请选择项目</option>";
            $(target).append(optionContent);


            $(target).trigger("change");
        }
    });
}

//加载项目列表
function loadModuleList(target,belong_project_id) {

     var url = "/api/get_module_list/?belong_project_id="+belong_project_id
    $.ajax({
    type:"get",
        url:url,
        success:function (data) {
            // alert(JSON.stringify(data));
            $(target).empty();
            var optionContent = "";
            $.each(data.data,function (index,item) {
                optionContent += "<option value='"+item.id+"'>"+item.module_name+"</option>";
            })
            optionContent += "<option value='0'>请选择项目</option>";
            $(target).append(optionContent);

           $(target).trigger("change");
        }
    });
}

//加载接口列表
function loadUrlList(target,belong_module_id) {
    
    var url = "/api/get_api_list/?belong_module_id="+belong_module_id
    $.ajax({
        type:"get",
        url:url,
        success:function (data) {
            $(target).empty();
            var optionContent = "";
            $.each(data.data,function (index,item) {
                optionContent += "<option value='"+item.id+"'>"+item.api_name+"</option>";
            })
            optionContent += "<option value='0'>请选择url</option>";
            $(target).append(optionContent);
        }
    });
}
//是否为空对象
function isEmptyObject(obj) {
    for (var key in obj) {
        return false;
    }
    return true;
}
//判断对象类型：数组和对象
function isType(obj){
    var type = Object.prototype.toString.call(obj);
    if(type == '[object Array]'){
          return 'Array';
    }else if(type == '[object Object]'){
          return 'Object';
    }else{
          return 'string';
    }
}
/**
 * 新增参数
 * @param obj dom 点击的对象
 * @param key string input的name值
 * @param addType int 新增的类型，0：只新增一个input，1：新增一个object对象
 * @param parentType string 递归时，父层级的类型
 */
function addParam(obj,key,addType,parentType){
    var $this = $(obj);
    var data = $this.attr("data-obj");
    var html = [];
    var $target = $this.parent().siblings(["id^=content-"]).children('.am-panel-bd');
    if(addType == "1"){
        data = JSON.parse(data);
        html.push(renderHtml(data,key+'-'+$target.children().length,parentType));
    }else{
        var thisKey = key;
         var thisKey = thisKey.replace(/-\d+$/,'');
        html.push('<input type="text" name="' + thisKey +'" placeholder="" class="am-form-field" style="margin-bottom: 5px;" />');
        html.push('<span class="am-icon-trash-o am-text-danger am-icon-sm" style="float: right;margin-right: -2rem;margin-top: -2.7rem;cursor: pointer;" onclick="deleteParam(this,'+ addType +')"></span>');
    }
    $target.append(html);
    event.stopPropagation();
}
/**
 * 删除参数
 * @param obj dom 点击的对象
 * @param addType 删除的类型，0：只删除一个input，1：删除一个object对象
 */
function deleteParam(obj,addType){
    var $this = $(obj);
    if(addType=="1"){
        var $object = $this.parent().parent().parent();
        var $container = $object.parent();
        $object.remove();
        // 重置序号
        $container.children('.am-panel-group').each(function(index,element){
            var $head = $(element).children('.am-panel').children('.am-panel-hd');
            var $title = $head.find('[data-title="1"]');
            var oldTitle = $title.text();
            var newTitle = oldTitle.replace(/(-)\d+$/,'$1'+index);
            var reg = new RegExp(oldTitle,'g');
            //重置pannel的id和data-am-collapse
            $head.attr('data-am-collapse',$head.attr('data-am-collapse').replace(reg,newTitle));
            $(element).attr('id',$(element).attr('id').replace(reg,newTitle));
            var $body = $(element).children('.am-panel').children('[id^=content-]');
            $body.attr('id',$body.attr('id').replace(reg,newTitle));
            $title.text(newTitle);
        });
    }else{
        $this.prev('input').remove();
        $this.remove();
    }
    event.stopPropagation();
}
/**
 * 递归生成key:value的label:input框
 * @param args json 需要生成html的json
 * @param key string key值
 * @param parentType string 递归时，父层级的类型
 */
function renderHtml(args,key,parentType){
    var self = arguments.callee;
    var html = [];
    var type = isType(args);
    if(key!=''){
        html.push('<div class="am-panel-group" id="pannel-' + key +'">');
        html.push('<div class="am-panel am-panel-default">');
        html.push('<div class="am-panel-hd" data-am-collapse="{parent: \'#pannel-' + key +'\', target: \'#content-' + key +'\'}">');
        var addType=1;
        if(type == "Array" && (args.length == 0 || (args.length > 0 && isType(args[0]) == 'string'))){
            addType=0;
        }
        if(type == 'Array'){
            if(parentType == 'Array'){
                html.push('<span data-title="1">'+key+'</span>'+'&#12288;');
                html.push('<span class="am-icon-trash-o am-text-danger am-icon-sm" style="float: right;" onclick="deleteParam(this,1)"></span>');
            }
            html.push('<button class="am-btn am-btn-primary am-round am-btn-xs am-icon-plus" type="button" onclick="addParam(this,\''+ key + '\',' +addType+',\''+type+'\')" data-obj=\'' + (addType==1?JSON.stringify(args[0]):'') +'\'> 新增</button>');
        }else{
            html.push('<span data-title="1">'+key+'</span>');
            html.push('<span class="am-icon-trash-o am-text-danger am-icon-sm" style="float: right;" onclick="deleteParam(this,' +addType+')"></span>');
        }
        html.push('</div>');
        html.push('<div id="content-' + key +'" class="am-panel-collapse am-collapse am-in">');
        var style='';
        if(addType==0){
            style='padding-right:3.2rem;';
        }
        html.push('<div class="am-panel-bd" style="' + style +'">');
    }
    if(type == "Object"){
        var num = key.match(/-(\d+)$/);
        for (var key1 in args) {
            var thisValue = args[key1];
            // var name = key1 + (num && num[1] ? num[1] : '');
            html.push('<div class="am-form-group am-form-group-sm">');
            html.push('<label class="am-u-sm-3 am-form-label">' + key1 +'</label>');
            html.push('<div class="am-u-sm-9">');
            if(isType(thisValue) == 'Array' || isType(thisValue) == 'Object'){
                html.push(self(thisValue,key1,"Object"));
            }else{
                html.push('<input type="text" name="' + key1 +'" placeholder="' + args[key1] +'" class="am-form-field" />');
            }
            html.push('</div></div>');
        }
    }else if(type == "Array"){
        for(var i=0,len=args.length;i<len;i++){
            var thisValue=args[i];
            var newKey = key+'-'+i;
            if(isType(thisValue) == 'Array'){
                html.push(self(thisValue,newKey,'Array'));
            }else if(isType(thisValue) == 'Object'){
                html.push(self(thisValue,newKey));
            }else{
                var thisKey = key;
                if(parentType && parentType == 'Array'){
                    var thisKey = thisKey.replace(/-\d+$/,'');
                }
                html.push('<input type="text" name="' + thisKey +'" placeholder="' + thisValue +'" class="am-form-field" style="margin-bottom: 5px;" />');
                html.push('<span class="am-icon-trash-o am-text-danger am-icon-sm" style="float: right;margin-right: -2rem;margin-top: -2.7rem;cursor: pointer;" onclick="deleteParam(this,0)"></span>');
            }
        }
    }
    if(key!=''){
        html.push('</div></div></div></div>');
    }
    return html.join('');
}
//选择URL
function ChangeURL(target,id) {

    var url = "/api/get_api_info/?id="+id
    $.ajax({
        type:"get",
        url:url,
        success:function (data) {
            //修改请求方式
            var method = data.data.requests;
             $("#method").val(method.toUpperCase());
            //带入参数
            var body = data.data.body;
            // console.log(DataType)
            if (body != 'null'){
                $("#DataType").val('json');
                $('#json-input').val(body);
                //遍历设置key：value
                var paramsObj = new Object();
                try{
                    paramsObj = JSON.parse(body);
                }catch (e){
                    myAlert("Json 格式有误,无法解析！");
                }
                // paramsObj = {"avatar": "string", "bigImage": "string", "lbsStatus": 0, "locationCoordinate": "string", "sceneId": 0, "sex": 0, "subtitle": "string", "title": "string", "vCardValueList": [{"fieldId": 0, "fieldValue": "string","fieldTest":["a","b"],"fieldStr":[{"str1":"aa","str2":"bb"}]}],"test":[1,2,3,4,5,"s"],"my":[["wang","li"]]}
                var html=[];
                if(!isEmptyObject(paramsObj)){
                    html=renderHtml(paramsObj,'');
                }else{
                    html.push('<p>参数为空</p>');
                }
                $('#form_request_data').html(html);
                 $('#json-text').show();
                 $('#btn-json-viewer').click();
            } else {
                $('#json-text').hide();
                $("#DataType").val('params');

            }

            //修改请求方法列表
            //修改params
            //带入参数信息
                 //json
                //data
                //params

        }
    });
}

/*提示 弹出*/
function myAlert(data) {
    $('#my-alert_print').text(data);
    $('#my-alert').modal({
        relatedTarget: this
    });
}

function post(url, params) {
    var temp = document.createElement("form");
    temp.action = url;
    temp.method = "post";
    temp.style.display = "none";
    for (var x in params) {
        var opt = document.createElement("input");
        opt.name = x;
        opt.value = params[x];
        temp.appendChild(opt);
    }
    document.body.appendChild(temp);
    temp.submit();
    return temp;
}

function del_row(id) {
    var attribute = id;
    var chkObj = document.getElementsByName(attribute);
    var tabObj = document.getElementById(id);
    for (var k = 0; k < chkObj.length; k++) {
        if (chkObj[k].checked) {
            tabObj.deleteRow(k + 1);
            k = -1;
        }
    }
}


function add_row(id) {
    var tabObj = document.getElementById(id);//获取添加数据的表格
    var rowsNum = tabObj.rows.length;  //获取当前行数
    var style = 'width:100%; border: none';
    var cell_check = "<input type='checkbox' name='" + id + "' style='width:55px' />";
    var cell_key = "<input type='text' name='test[][key]'  value='' style='" + style + "' />";
    var cell_value = "<input type='text' name='test[][value]'  value='' style='" + style + "' />";
    var cell_type = "<select name='test[][type]' class='form-control' style='height: 25px; font-size: 15px; " +
        "padding-top: 0px; padding-left: 0px; border: none'> " +
        "<option>string</option><option>int</option><option>float</option><option>boolean</option></select>";
    var cell_comparator = "<select name='test[][comparator]' class='form-control' style='height: 25px; font-size: 15px; " +
        "padding-top: 0px; padding-left: 0px; border: none'> " +
        "<option>equals</option> <option>contains</option> <option>startswith</option> <option>endswith</option> <option>regex_match</option> <option>type_match</option> <option>contained_by</option> <option>less_than</option> <option>less_than_or_equals</option> <option>greater_than</option> <option>greater_than_or_equals</option> <option>not_equals</option> <option>string_equals</option> <option>length_equals</option> <option>length_greater_than</option> <option>length_greater_than_or_equals</option> <option>length_less_than</option> <option>length_less_than_or_equals</option></select>";

    var myNewRow = tabObj.insertRow(rowsNum);
    var newTdObj0 = myNewRow.insertCell(0);
    var newTdObj1 = myNewRow.insertCell(1);
    var newTdObj2 = myNewRow.insertCell(2);


    newTdObj0.innerHTML = cell_check
    newTdObj1.innerHTML = cell_key;
    if (id === 'variables' || id === 'querys') {
        var newTdObj3 = myNewRow.insertCell(3);
        newTdObj2.innerHTML = cell_type;
        newTdObj3.innerHTML = cell_value;
    } else if (id === 'validate') {
        var newTdObj3 = myNewRow.insertCell(3);
        newTdObj2.innerHTML = cell_comparator;
        newTdObj3.innerHTML = cell_type;
        var newTdObj4 = myNewRow.insertCell(4);
        newTdObj4.innerHTML = cell_value;
    } else {
        newTdObj2.innerHTML = cell_value;
    }
}

function add_params(id) {
    var tabObj = document.getElementById(id);//获取添加数据的表格
    var rowsNum = tabObj.rows.length;  //获取当前行数
    var style = 'width:100%; border: none';
    var check = "<input type='checkbox' name='" + id + "' style='width:55px' />";
    var placeholder = '单个:["value1", "value2],  多个:[["name1", "pwd1"],["name2","pwd2"]]';
    var key = "<textarea  name='test[][key]'  placeholder='单个:key, 多个:key1-key2'  style='" + style + "' />";
    var value = "<textarea  name='test[][value]'  placeholder='" + placeholder + "' style='" + style + "' />";
    var myNewRow = tabObj.insertRow(rowsNum);
    var newTdObj0 = myNewRow.insertCell(0);
    var newTdObj1 = myNewRow.insertCell(1);
    var newTdObj2 = myNewRow.insertCell(2);
    newTdObj0.innerHTML = check;
    newTdObj1.innerHTML = key;
    newTdObj2.innerHTML = value;
}




