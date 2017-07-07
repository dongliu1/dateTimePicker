/**
 * Created by liudong on 2017/6/9.
 */
/**
 设置日期：$(selector).skdatepicker('setDate',time,callback);
 获取日期：$(selector).skdatepicker('getDate'，callback);
 */
(function ($) {																//闭包限定命名空间
    $.extend({
        skdaterange: function () {
            var obj1 = $(arguments[0]);
            var obj2 = $(arguments[1]);
            if (obj1.length && obj2.length) {
                var opt = arguments[2];
                if ($.isPlainObject(opt)) {
                    var _defaultDate = new Date().valueOf();
                    var _default = {
                        rangeStartObj:obj1,
                        rangeEndObj:obj2,
                        startDate: {defaultDate: _defaultDate},
                        endDate: {defaultDate: _defaultDate + 1000}
                    };
                    delete opt.rangeStartObj;
                    delete opt.rangeEndObj;
                    opt = $.extend(true, {}, _default, opt);
                    if (isNaN(opt.startDate.defaultDate)) opt.startDate.defaultDate = new Date(opt.startDate.defaultDate).valueOf();
                    if (isNaN(opt.endDate.defaultDate)) opt.endDate.defaultDate = new Date(opt.endDate.defaultDate).valueOf();
                    if (isNaN(opt.startDate.defaultDate)) {
                        opt.startDate.defaultDate = _defaultDate;
                        console.log("#error:已将开始时间设为当前时间，请检查开始时间是否正确")
                    }
                    if (isNaN(opt.endDate.defaultDate)) {
                        opt.startDate.defaultDate = opt.startDate.defaultDate + 1000;
                        console.log("#error:已将结束时间设为开始时间1秒后，请检查结束时间是否正确")
                    }
                    if (opt.startDate.defaultDate < opt.endDate.defaultDate) {
                        opt.rangeStart = true;
                        opt.rangeEnd = false;
                        $(obj1).skdatepicker(opt);
                        opt.rangeStart = false;
                        opt.rangeEnd = true;
                        console.log(JSON.stringify(opt));
                        $(obj2).skdatepicker(opt);
                    } else {
                        console.log("#error:开始时间不能大于结束时间");
                        return false;
                    }
                } else {
                    console.log("#error:请检查传入参数格式是否正确");
                    return false;
                }
            } else {
                console.log("#error:请检查传入参数格式是否正确");
                return false;
            }
        }
    });
})(window.jQuery);
(function ($) {																//闭包限定命名空间
    $.fn.skdatepicker = function(){
        var data;
        if($(this)[0].tagName!=="INPUT"){
            console.log("#error:这不是input元素，无法加载插件");
            return false;
        }
        if(arguments.length === 0 || typeof arguments[0] === 'object'){
            var option = arguments[0]
                , options = $.extend(true, {}, $.fn.skdatepicker.defaults, option);
            data = this.data('skdatepicker');
            if (!data) {
                data = new Skdate(this[0], options);
                data._init_check_opt();
                data._init();
                this.data('skdatepicker', data);
            }
            return $.extend(true, this, data);
        }
        if(typeof arguments[0] === 'string'){
            data = this.data('skdatepicker');
            if($.isPlainObject(arguments[1])){
                $.extend(data.default,arguments[1]);
                data._init_check_opt();
            }
            var fn =  data["_"+arguments[0]];
            if(fn){
                if(arguments[2])arguments[2](fn);
                var args = Array.prototype.slice.call(arguments);
                return fn.apply(data,args.slice(1));
            }
        }
    };

    $.fn.skdatepicker.defaults = {
        dateFormat:"YYYY/MM/DD HH:mm:ss",           //时间显示格式
        defaultDate:new Date().valueOf(),           //默认日期时间戳
        yearChanged:false,                          //改变年
        monthChanged:false,                         //改变月
        dateTime:"1970/01/01 08:00:00",              //当前时间
        dateType:"second",                           //日期显示类型，"second":显示到秒，"minute":显示到分钟,"day":显示到日
        calendarIcon:true,                           //是否绑定日历图标
        rangeStart:false,                           //禁用开始时间
        rangeEnd:false,                             //禁用结束时间
        theme:"dark",                                //默认主题
        isDarkTheme:false,                          //是否添加背景色
    };

    var Skdate=function (element,opt) {
        this.$scope=$(element);
        this.default=opt;
    };

    Skdate.prototype={
        _init:function () {
            var opt=this.default;
            this._init_renderInput();
            var _html=this._init_element();
            opt.bindCalendarObj=$(_html).appendTo("body");
            if(opt.yearChanged)this._bind_yearChange();
            if(opt.monthChanged)this._bind_monthChange();
            this._init_monthChange();
            this._bind_dayChange();
            if(opt.dateType!="day")this._bind_timeChange();
            this._bind_nowChange();
            this._init_renderElem();
        },
        _init_renderInput:function () {
            var _this=this.$scope;
            var opt=this.default;
            if(opt.calendarIcon){
                $(_this).wrap("<div class='sk-datepicker-"+opt.theme+" sk-datepicker-group sk-datepicker-input'></div>");
                var _html="<div class='sk-datepicker-calendarIcon'><i class='icon-calendar'></i></div>";
                opt.calendarObj=$(_html).insertAfter($(_this));
            }else{
                $(_this).wrap("<div class='sk-datepicker-"+opt.theme+" sk-datepicker-input'></div>");
            }
        },
        _init_element:function () {
            var _this=this.$scope;
            var opt=this.default;
            var pst=_this.offset();
            var _height=$(_this).height();
            var timeInfo=this._init_getTime(opt.defaultDate);
            var yearHtml="<span class='sk-datepicker-year'>"+timeInfo.year+"</span>";
            var monthHtml="<span class='sk-datepicker-month'>"+timeInfo.month+"</span>";
            if(opt.yearChanged)yearHtml=this._init_selectYears(timeInfo.year);
            if(opt.monthChanged)monthHtml=this._init_selectmonths(timeInfo.month);
            var num=0;
            $("[skNum]").each(function(){
                num=Math.max($(this).attr("skNum")-0,num);
            });
            num=num+1;
            $(_this).attr("skDateId","sk-datepicker-contain-"+num);
            var _html="<div skNum='"+num+"' id='sk-datepicker-contain-"+num+"' class='"+(opt.isDarkTheme?"sk-datepicker-bgDark ":"")+"sk-datepicker-"+opt.theme+" sk-datepicker-contain' style='left:"+pst.left+"px;top:"+(pst.top+_height+7)+"px;'>";
            _html+="<div class='sk-datepicker-header'>" ;
            _html+= "<div class='sk-datepicker-prev'><a href='javascript:void(0)' title='上月'><i class='icon-left-circled'></i></a></div>" ;
            _html+= "<div class='sk-datepicker-next'><a href='javascript:void(0)' title='下月'><i class='icon-right-circled'></i></a></div>" ;
            _html+= "<div class='clear'></div>" ;
            _html+= "<div class='sk-datepicker-date'>" ;
            _html+=yearHtml+"<span>年</span>" ;
            _html+= monthHtml+"<span>月</span>" ;
            _html+="</div></div>" ;
            _html+="<table class='sk-datepicker-calendar'>" ;
            _html+="<thead><tr><th>一</th><th>二</th><th>三</th><th>四</th><th>五</th><th>六</th><th>日</th></tr></thead>" ;
            _html+="<tbody>";
            _html+=this._init_tbody(timeInfo);
            _html+="</tbody></table>" ;
            if(opt.dateType!="day"){
                _html+=this._init_footer(timeInfo);
            }
            _html+="<div class='sk-datepicker-button'>今天</div>";
            _html+="</div>";
            return _html;
        },
        _init_check_opt:function () {
            var opt=this.default;
            if(opt.rangeStart){
                opt.defaultDate=opt.startDate.defaultDate;
            }else if(opt.rangeEnd){
                opt.defaultDate=opt.endDate.defaultDate;
            }
            if(Object.prototype.toString.call(opt.defaultDate) === "[object String]"){
                if(opt.defaultDate===""){
                    opt.defaultDate=new Date().valueOf();
                }else{
                    opt.defaultDate=new Date(opt.defaultDate).valueOf();
                }
            }
            if(!opt.defaultDate&&opt.defaultDate!==0){
                opt.defaultDate=new Date().valueOf();
                console.log("#error:已将时间设定为当前时间,请检查时间格式");
            }
            this._init_dateTime();
        },
        _init_dateTime:function () {
            var opt=this.default;
            var _this=this.$scope;
            var timeJson=this._init_dateFormat(opt.defaultDate);
            opt.dateTime=timeJson.dateTime;
            opt.dateType=timeJson.dateType;
            $(_this).val(opt.dateTime);
            opt.timeInfo=timeJson.timeInfo;
            //console.log(opt.dateTime,opt.rangeStart,opt.rangeEnd);
            if(opt.rangeStart || opt.rangeEnd){
                this._init_rangeDateTime();
            }
        },
        _init_dateFormat:function (defaultDate) {
            var opt=this.default;
            var timeInfo=this._init_getTime(defaultDate);
            var year=timeInfo.year;
            var month=timeInfo.month<10?"0"+timeInfo.month:timeInfo.month;
            var day=timeInfo.day<10?"0"+timeInfo.day:timeInfo.day;
            var hour=timeInfo.hour<10?"0"+timeInfo.hour:timeInfo.hour;
            var minute=timeInfo.minute<10?"0"+timeInfo.minute:timeInfo.minute;
            var second=timeInfo.second<10?"0"+timeInfo.second:timeInfo.second;
            var dateTime=year+"/"+month+"/"+day+" "+hour+":"+minute+":"+second;
            var dateType="second";
            switch(opt.dateFormat){
                case "YYYY-MM-DD HH:mm:ss":
                    dateTime=year+"-"+month+"-"+day+" "+hour+":"+minute+":"+second;
                    break;
                case "yyyy-mm-dd HH:mm:ss":
                    dateTime=year+"-"+month+"-"+day+" "+hour+":"+minute+":"+second;
                    break;
                case "MM-DD-YYYY HH:mm:ss":
                    dateTime=month+"-"+day+"-"+year+" "+hour+":"+minute+":"+second;
                    break;
                case "MM/DD/YYYY HH:mm:ss":
                    dateTime=month+"/"+day+"/"+year+" "+hour+":"+minute+":"+second;
                    break;
                case "mm/dd/yyyy HH:mm:ss":
                    dateTime=month+"/"+day+"/"+year+" "+hour+":"+minute+":"+second;
                    break;
                case "YYYY-MM-DD HH:mm":
                    dateTime=year+"-"+month+"-"+day+" "+hour+":"+minute;
                    dateType="minute";
                    break;
                case "yyyy-mm-dd HH:mm":
                    dateTime=year+"-"+month+"-"+day+" "+hour+":"+minute;
                    dateType="minute";
                    break;
                case "MM-DD-YYYY HH:mm":
                    dateTime=month+"-"+day+"-"+year+" "+hour+":"+minute;
                    dateType="minute";
                    break;
                case "mm-dd-yyyy HH:mm":
                    dateTime=month+"-"+day+"-"+year+" "+hour+":"+minute;
                    dateType="minute";
                    break;
                case "MM/DD/YYYY HH:mm":
                    dateTime=month+"/"+day+"/"+year+" "+hour+":"+minute;
                    dateType="minute";
                    break;
                case "mm/dd/yyyy HH:mm":
                    dateTime=month+"/"+day+"/"+year+" "+hour+":"+minute;
                    dateType="minute";
                    break;
                case "YYYY/MM/DD HH:mm":
                    dateTime=year+"/"+month+"/"+day+" "+hour+":"+minute;
                    dateType="minute";
                    break;
                case "yyyy/mm/dd HH:mm":
                    dateTime=year+"/"+month+"/"+day+" "+hour+":"+minute;
                    dateType="minute";
                    break;
                case "YYYY-MM-DD":
                    dateTime=year+"-"+month+"-"+day;
                    dateType="day";
                    break;
                case "yyyy-mm-dd":
                    dateTime=year+"-"+month+"-"+day;
                    dateType="day";
                    break;
                case "MM-DD-YYYY":
                    dateTime=month+"-"+day+"-"+year;
                    dateType="day";
                    break;
                case "mm-dd-yyyy":
                    dateTime=month+"-"+day+"-"+year;
                    dateType="day";
                    break;
                case "YYYY/MM/DD":
                    dateTime=year+"/"+month+"/"+day;
                    dateType="day";
                    break;
                case "yyyy/mm/dd":
                    dateTime=year+"/"+month+"/"+day;
                    dateType="day";
                    break;
                case "MM/DD/YYYY":
                    dateTime=month+"/"+day+"/"+year;
                    dateType="day";
                    break;
                case "mm/dd/yyyy":
                    dateTime=month+"/"+day+"/"+year;
                    dateType="day";
                    break;
                default:
                    break;
            }
            return {
                dateTime:dateTime,
                dateType:dateType,
                timeInfo:timeInfo
            }
        },
        _init_rangeDateTime:function () {
            var opt=this.default;
            var oppositeObj=opt.rangeEndObj;
            var prop="startDate";
            var unProp="endDate";
            if(opt.rangeEnd){
                oppositeObj=opt.rangeStartObj;
                prop="endDate";
                unProp="startDate";
            }
            opt[prop].defaultDate=opt.defaultDate;
            if(!opt[unProp].defaultDate)opt[unProp].defaultDate=new Date($(oppositeObj).val()).valueOf();
            if(opt.rangeEnd&&opt[prop].defaultDate<=opt[unProp].defaultDate){
                opt[unProp].defaultDate=opt[prop].defaultDate-1000;
            }else if(opt.rangeStart&&opt[prop].defaultDate>=opt[unProp].defaultDate){
                opt[unProp].defaultDate=opt[prop].defaultDate+1000;
            }else{
                opt[unProp].defaultDate=new Date($(oppositeObj).val()).valueOf();
            }
            var timeJson=this._init_dateFormat(opt[unProp].defaultDate);
            $(oppositeObj).val(timeJson.dateTime);
        },
        _init_selectYears:function (curYear) {
            var _html="<select class='sk-datepicker-selectYear'>" ;
            for(var i=0;i<11;i++){
                var _curyear=curYear+i-5;
                _html+="<option value='"+_curyear+"' "+(curYear==_curyear?"selected='selected'":"")+">"+_curyear+"</option>";
            }
            _html+="</select>";
            return _html;
        },
        _init_selectmonths:function (curMonth) {
            var _html="<select class='sk-datepicker-selectMonth'>" ;
            for(var i=0;i<12;i++){
                var _curmonth=(i+1<10?"0"+(i+1):i+1);
                _html+="<option value='"+_curmonth+"' "+(curMonth==i+1?"selected='selected'":"")+">"+_curmonth+"</option>";
            }
            _html+="</select>";
            return _html;
        },
        _init_tbody:function (timeInfo) {
            var opt=this.default;
            var year=timeInfo.year;
            var month=timeInfo.month;
            var monthDays=timeInfo.monthDays;
            var day=opt.timeInfo.day;
            if(day>monthDays)day=monthDays;
            var startDate=opt.defaultDate;
            var endDate=opt.defaultDate;
            if(opt.rangeStart || opt.rangeEnd){
                startDate=opt.startDate.defaultDate;
                endDate=opt.endDate.defaultDate;
            }
            var rows=5;
            if(36-timeInfo.week<timeInfo.monthDays)rows=6;
            var _html="";
            for(var i=0;i<rows;i++){
                _html+="<tr>";
                for(var j=0;j<7;j++){
                    var _date=i*7+j+2-timeInfo.week;
                    var isDisabled=false;
                    if(_date<1||_date>timeInfo.monthDays){
                        _date="";
                    }else{
                        var curDate=new Date(year,month-1,_date).valueOf();
                        if(opt.rangeStart){
                            if(curDate>endDate){
                                isDisabled=true;
                            }
                            //console.log("start",isDisabled,_date);
                        }else if(opt.rangeEnd){
                            if(curDate<startDate){
                                isDisabled=true;
                            }
                            //console.log("end",isDisabled,_date);
                        }
                        _date="<a href='javascript:void(0)' class='sk-datepicker-selectDay "+((day===_date)?"sk-datepicker-active":"")+" "+(isDisabled?"sk-datepicker-disabled":"")+"'>"+_date+"</a>";
                    }
                    _html+="<td>"+_date+"</td>";
                }
                _html+="</tr>"
            }
            return _html;
        },
        _init_footer:function (timeInfo) {
            var opt=this.default;
            //console.log("2",opt.dateType);
            var _html="";
            _html+="<div class='sk-datepicker-footer'><div class='sk-datepicker-time'>";
            _html+="<div class='sk-datepicker-title'>时间</div><div class='sk-datepicker-times'>";
            _html+="<select class='sk-datepicker-hours'>" ;
            for(var h=0;h<24;h++){
                _html+="<option value='"+(h<10?"0"+h:h)+"' "+(timeInfo.hour==h?"selected='selected'":"")+">"+(h<10?"0"+h:h)+"</option>";
            }
            _html+="</select>:" ;
            _html+= "<select class='sk-datepicker-minutes'>" ;
            for(var m=0;m<60;m++){
                _html+="<option value='"+(m<10?"0"+m:m)+"' "+(timeInfo.minute==m?"selected='selected'":"")+">"+(m<10?"0"+m:m)+"</option>";
            }
            _html+="</select>" ;
            if(opt.dateType=="second"){
                _html+=":<select class='sk-datepicker-seconds'>";
                for(var s=0;s<60;s++){
                    _html+="<option value='"+(s<10?"0"+s:s)+"' "+(timeInfo.second==s?"selected='selected'":"")+">"+(s<10?"0"+s:s)+"</option>";
                }
                _html+="</select>" ;
            }
            _html+= "</div><div class='clear'></div></div>" ;
            _html+= "</div>";
            return _html;
        },
        _init_getTime:function (_date) {
            var _curDay=new Date();
            if(_date)_curDay=new Date(_date);
            var curWeek=_curDay.getDay();
            var year=_curDay.getFullYear();
            var month=_curDay.getMonth()+1;
            var day=_curDay.getDate();
            var hour=_curDay.getHours();
            var minute=_curDay.getMinutes();
            var second=_curDay.getSeconds();
            var millisecond=_curDay.getMilliseconds();
            var week=new Date(year+"/"+month+"/1").getDay();
            var monthDays=new Date(year,month,0).getDate();
            if(week==0)week=7;
            return {
                year:year,
                month:month,
                day:day,
                hour:hour,
                minute:minute,
                second:second,
                millisecond:millisecond,
                week:week,
                curWeek:curWeek,
                monthDays:monthDays
            };
        },
        _init_curDate:function () {
            var opt=this.default;
            var monthDays=new Date(opt.timeInfo.year,opt.timeInfo.month,0).getDate();
            if(opt.timeInfo.day>monthDays)opt.timeInfo.day=monthDays;
            var _curDate=opt.timeInfo.year+"/"+opt.timeInfo.month+"/"+opt.timeInfo.day+" "+opt.timeInfo.hour+":"+opt.timeInfo.minute+":"+opt.timeInfo.second;
            opt.defaultDate=new Date(_curDate).valueOf();
            console.log(_curDate);
        },
        _init_renderElem:function () {
            var opt=this.default;
            opt.tdUnixTime=new Date(new Date(new Date().toLocaleDateString()).getTime()).valueOf();
            opt.tmrUnixTime=opt.tdUnixTime+24*60*60*1000;
            $(".sk-datepicker-button",opt.bindCalendarObj).removeClass("sk-datepicker-button-disabled");
            if(opt.defaultDate>=opt.tdUnixTime&&opt.defaultDate<opt.tmrUnixTime)
                $(".sk-datepicker-button",opt.bindCalendarObj).addClass("sk-datepicker-button-disabled");
            if(opt.rangeStart){
                var maxDate=opt.endDate.defaultDate;
                if(opt.tdUnixTime>=maxDate)
                    $(".sk-datepicker-button",opt.bindCalendarObj).addClass("sk-datepicker-button-disabled");
            }else if(opt.rangeEnd){
                var minDate=opt.startDate.defaultDate;
                //console.log("render",opt.tdUnixTime<=minDate);
                if(opt.tdUnixTime<=minDate)
                    $(".sk-datepicker-button",opt.bindCalendarObj).addClass("sk-datepicker-button-disabled");
            }
            return true;
        },
        _bind_yearChange:function () {
            var opt=this.default;
            var that=this;
            $(opt.bindCalendarObj).bind("change",".sk-datepicker-selectYear",function (e) {
                if($(e.target).closest(".sk-datepicker-selectYear").length) {
                    var _slctYearObj = $(this).find(".sk-datepicker-selectYear");
                    var _curYear = parseInt(_slctYearObj.val());
                    var _slctHtml = that._init_selectYears(_curYear);
                    $(_slctYearObj).after(_slctHtml).remove();
                    that._set_changeYears()
                    return false;
                }
            })
        },
        _bind_monthChange:function () {
            var opt=this.default;
            var that=this;
            $(opt.bindCalendarObj).bind("change",".sk-datepicker-selectMonth",function (e) {
                if($(e.target).closest(".sk-datepicker-selectMonth").length) {
                    that._set_changeYears()
                }
            });
        },
        _init_monthChange:function () {
            var opt=this.default;
            var that=this;
            $(".sk-datepicker-next",opt.bindCalendarObj).bind("click",function () {
                that._init_calculateMonth(true);
                that._set_changeYears();
                return false;
            });
            $(".sk-datepicker-prev",opt.bindCalendarObj).bind("click",function () {
                that._init_calculateMonth(false);
                that._set_changeYears();
                return false;
            });
        },
        _init_calculateMonth:function (isAdd) {
            var opt=this.default;
            var _month=parseInt($(".sk-datepicker-selectMonth", opt.bindCalendarObj).val());
            if(!_month)_month=parseInt($(".sk-datepicker-month", opt.bindCalendarObj).text());
            var _year=parseInt($(".sk-datepicker-selectYear", opt.bindCalendarObj).val());
            if(!_year)_year=parseInt($(".sk-datepicker-year", opt.bindCalendarObj).text());
            var _yearChanged=false;
            if(isAdd){
                _month += 1;
                if (_month === 13) {
                    _month = 1;
                    _year += 1;
                    _yearChanged=true;
                }
            }else{
                _month -= 1;
                if (_month === 0) {
                    _month = 12;
                    _year -= 1;
                    _yearChanged=true;
                }
            }

            if(_yearChanged){
                var _slctHtml=this._init_selectYears(_year);
                $(".sk-datepicker-selectYear",opt.bindCalendarObj).after(_slctHtml).remove();
                $(".sk-datepicker-year",opt.bindCalendarObj).text(_year);
            }
            var month = _month < 10 ? ("0" + _month) : _month;
            $(".sk-datepicker-selectMonth", opt.bindCalendarObj).val(month);
            $(".sk-datepicker-month",opt.bindCalendarObj).text(_month);
        },
        _set_changeYears:function () {
            var opt=this.default;
            var _month=parseInt($(".sk-datepicker-selectMonth", opt.bindCalendarObj).val());
            if(!_month)_month=parseInt($(".sk-datepicker-month", opt.bindCalendarObj).text());
            var _year=parseInt($(".sk-datepicker-selectYear", opt.bindCalendarObj).val());
            if(!_year)_year=parseInt($(".sk-datepicker-year", opt.bindCalendarObj).text());
            var _curDate=new Date(_year,_month-1,1).valueOf();
            var timeInfo=this._init_getTime(_curDate);
            var _tbodyHtml = this._init_tbody(timeInfo);
            $("tbody", opt.bindCalendarObj).html(_tbodyHtml);
            this._init_renderElem();
        },
        _bind_dayChange:function () {
            var opt=this.default;
            var that=this;
            var _this=this.$scope;
            $(opt.bindCalendarObj).off("click").on("click",".sk-datepicker-selectDay",function () {
                var _slctDayObj=$(this);
                if(!_slctDayObj.hasClass("sk-datepicker-disabled")){
                    var _month=parseInt($(".sk-datepicker-selectMonth", opt.bindCalendarObj).val());
                    if(!_month)_month=parseInt($(".sk-datepicker-month", opt.bindCalendarObj).text());
                    var _year=parseInt($(".sk-datepicker-selectYear", opt.bindCalendarObj).val());
                    if(!_year)_year=parseInt($(".sk-datepicker-year", opt.bindCalendarObj).text());
                    opt.timeInfo.year=_year;
                    opt.timeInfo.month=_month;
                    opt.timeInfo.day=parseInt(_slctDayObj.text());
                    //console.log(_year,_month,opt.timeInfo.day);
                    that._init_curDate();
                    that._init_dateTime();
                    $(opt.bindCalendarObj).hide();
                    var _tbodyHtml=that._init_tbody(opt.timeInfo);
                    $("tbody",opt.bindCalendarObj).html(_tbodyHtml);
                    that._init_renderElem();
                }
                return false;
            });
            $(document).off("click").on("click",function (e) {
                if(!$(e.target).closest(".sk-datepicker-contain").length){
                    $(".sk-datepicker-contain").hide();
                }
                return false;
            });
            $(_this).bind("click",function () {
                //捕获光标位置
                var pos=that._init_getCursortPosition(_this);
                //重新设置时间
                var time=$(this).val();
                $(".sk-datepicker-contain").hide();
                $(opt.bindCalendarObj).show();
                that._setDate(time);
                //设置光标位置
                that._init_setCaretPosition(_this,pos);
                return false;
            }).bind("change",function () {
                var time=$(this).val();
                that._setDate(time);
            });
            $(opt.calendarObj).off("click").on("click",function () {
                $(opt.bindCalendarObj).toggle();
                var id=$(opt.bindCalendarObj).attr("id");
                $(".sk-datepicker-contain").each(function () {
                    var _id=$(this).attr("id");
                    if(_id!==id)$(this).hide();
                });
                var time=$(_this).val();
                that._setDate(time);
                return false;
            })
        },
        //捕获光标
        _init_getCursortPosition:function(ctrl) {
            var el = $(ctrl).get(0);
            var pos = 0;
            if ('selectionStart' in el) {
                pos = el.selectionStart;
            } else if ('selection' in document) {
                el.focus();
                var Sel = document.selection.createRange();
                var SelLength = document.selection.createRange().text.length;
                Sel.moveStart('character', -el.value.length);
                pos = Sel.text.length - SelLength;
            }
            return pos;
        },
        //设置光标
        _init_setCaretPosition:function(ctrl, pos) {
            if(ctrl.setSelectionRange)
            {
                ctrl.focus();
                ctrl.setSelectionRange(pos,pos);
            }
            else if (ctrl.createTextRange) {
                var range = ctrl.createTextRange();
                range.collapse(true);
                range.moveEnd('character', pos);
                range.moveStart('character', pos);
                range.select();
            }
        },
        _bind_timeChange:function () {
            var opt=this.default;
            var that=this;
            $(opt.bindCalendarObj).bind("change",".sk-datepicker-hours,.sk-datepicker-minutes,.sk-datepicker-seconds",function (e) {
                if($(e.target).closest(".sk-datepicker-hours,.sk-datepicker-minutes,.sk-datepicker-seconds").length) {
                    var _slctHourObj = $(".sk-datepicker-hours", opt.bindCalendarObj);
                    var _slctMinuteObj = $(".sk-datepicker-minutes", opt.bindCalendarObj);
                    var _slctSecondObj = $(".sk-datepicker-seconds", opt.bindCalendarObj);
                    opt.timeInfo.hour = parseInt(_slctHourObj.val());
                    opt.timeInfo.minute = parseInt(_slctMinuteObj.val());
                    opt.timeInfo.second = parseInt(_slctSecondObj.val());
                    that._init_curDate();
                    that._init_dateTime();
                    return false;
                }
            })
        },
        _bind_nowChange:function () {
            var opt=this.default;
            var that=this;
            $(opt.bindCalendarObj).bind("click",".sk-datepicker-button",function (e) {
                var cdt1=$(e.target).closest(".sk-datepicker-button").length;
                var cdt2=$(e.target).closest(".sk-datepicker-button").hasClass("sk-datepicker-button-disabled");
                if(cdt1&&!cdt2){
                    that._setDate();
                    $(this).hide();
                }
            })
        },
        _setDate:function (time) {
            var opt=this.default;
            opt.defaultDate=new Date().valueOf();
            if(time)opt.defaultDate=new Date(time).valueOf();
            if(opt.defaultDate>=0){
                this._init_dateTime();
                var month=opt.timeInfo.month<10?("0"+opt.timeInfo.month):opt.timeInfo.month;
                var hour=opt.timeInfo.hour<10?("0"+opt.timeInfo.hour):opt.timeInfo.hour;
                var minute=opt.timeInfo.minute<10?("0"+opt.timeInfo.minute):opt.timeInfo.minute;
                var second=opt.timeInfo.second<10?("0"+opt.timeInfo.second):opt.timeInfo.second;
                var _slctHtml=this._init_selectYears(opt.timeInfo.year);
                var _tbodyHtml=this._init_tbody(opt.timeInfo);
                $("tbody",opt.bindCalendarObj).html(_tbodyHtml);
                $(".sk-datepicker-selectYear",opt.bindCalendarObj).after(_slctHtml).remove();
                $(".sk-datepicker-year",opt.bindCalendarObj).text(opt.timeInfo.year);
                $(".sk-datepicker-selectMonth",opt.bindCalendarObj).val(month);
                $(".sk-datepicker-month",opt.bindCalendarObj).text(opt.timeInfo.month);
                $(".sk-datepicker-hours",opt.bindCalendarObj).val(hour);
                $(".sk-datepicker-minutes",opt.bindCalendarObj).val(minute);
                $(".sk-datepicker-seconds",opt.bindCalendarObj).val(second);
                this._init_renderElem();
            }else{
                $(this.$scope).val(opt.dateTime);
                opt.defaultDate=new Date(opt.dateTime).valueOf();
                console.log("#error:修改未成功,时间错误,请输入正确的时间。")
            }
        },
        _getDate:function () {
            return $(this.$scope).val();
        },
        _getUnixDate:function () {
            return new Date($(this.$scope).val()).valueOf();
        },
    }
})(window.jQuery);

