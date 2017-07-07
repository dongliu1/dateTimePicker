# dateTimePicker
日历插件
<div class="contain">
    <div class="plugin-used">
        <h3>使用方法</h3>
        <h4>日历初始化:</h4>
        <div class="code-contain">
            <table>
                <tr>
                    <td>var </td>
                    <td>opt={</td>
                </tr>
                <tr>
                    <td></td>
                    <td>defaultDate:"2017-7-16 16:44:00",</td>
                </tr>
                <tr>
                    <td></td>
                    <td>dateFormat:"YYYY-MM-DD HH:mm:ss",</td>
                </tr>
                <tr>
                    <td></td>
                    <td>yearChanged:true,</td>
                </tr>
                <tr>
                    <td></td>
                    <td>monthChanged:true,</td>
                </tr>
                <tr>
                    <td></td>
                    <td>calendarIcon:true,</td>
                </tr>
                <tr>
                    <td></td>
                    <td>theme:"dark",</td>
                </tr>
                <tr>
                    <td></td>
                    <td>isDarkTheme:false,</td>
                </tr>
                <tr>
                    <td>}</td>
                    <td></td>
                </tr>
            </table>
            <div>$(element).skdatepicker(opt)</div>
        </div>
        <h4>起始时间设置:</h4>
        <div class="code-contain">
            <table>
                <tr>
                    <td>var </td>
                    <td>opt={</td>
                </tr>
                <tr>
                    <td></td>
                    <td>dateFormat:"YYYY-MM-DD HH:mm:ss",</td>
                </tr>
                <tr>
                    <td></td>
                    <td>yearChanged:false,</td>
                </tr>
                <tr>
                    <td></td>
                    <td>monthChanged:false,</td>
                </tr>
                <tr>
                    <td></td>
                    <td>calendarIcon:true,</td>
                </tr>
                <tr>
                    <td></td>
                    <td>startDate:{defaultDate:"2017-7-15"},</td>
                </tr>
                <tr>
                    <td></td>
                    <td>endDate:{defaultDate:"2017-7-25"},</td>
                </tr>
                <tr>
                    <td></td>
                    <td>theme:"blue",</td>
                </tr>
                <tr>
                    <td></td>
                    <td>isDarkTheme:true,</td>
                </tr>
                <tr>
                    <td>}</td>
                    <td></td>
                </tr>
            </table>
            <div>$.skdaterange($(element1),$(element2),opt)</div>
        </div>
    </div>
    <div class="plugin-readme">
        <h3>属性API</h3>
        <table width="100%" cellpadding="10" cellspacing="0">
            <thead>
            <tr>
                <th>属性</th>
                <th>类型</th>
                <th>默认值</th>
                <th>属性说明</th>
            </tr>
            </thead>
            <tbody>
            <tr>
                <td width="150px">dateFormat</td>
                <td width="100px">string</td>
                <td width="350px">"YYYY-MM-DD HH:mm:ss"</td>
                <td >用于规定时间显示格式，支持以下几种格式:<br/>"yyyy-mm-dd HH:mm:ss","MM/DD/YYYY HH:mm:ss","mm/dd/yyyy HH:mm:ss",<br/>"YYYY-MM-DD HH:mm","yyyy-mm-dd HH:mm","MM/DD/YYYY HH:mm",<br/>"mm/dd/yyyy HH:mm","YYYY/MM/DD HH:mm","yyyy/mm/dd HH:mm",<br/>"YYYY-MM-DD","yyyy-mm-dd","YYYY/MM/DD",<br/>"yyyy/mm/dd","MM/DD/YYYY","mm/dd/yyyy"</td>
            </tr>
            <tr>
                <td>yearChanged</td>
                <td>boolean</td>
                <td>false</td>
                <td>年份是否可选</td>
            </tr>
            <tr>
                <td>monthChanged</td>
                <td>boolean</td>
                <td>false</td>
                <td>月份是否可选</td>
            </tr>
            <tr>
                <td>calendarIcon</td>
                <td>boolean</td>
                <td>true</td>
                <td>是否显示日历图标</td>
            </tr>
            <tr>
                <td>theme</td>
                <td>string</td>
                <td>"dark"</td>
                <td>主题，参数值："dark","red","orange","blue","green"</td>
            </tr>
            <tr>
                <td>isDarkTheme</td>
                <td>boolean</td>
                <td>false</td>
                <td>是否显示主题背景</td>
            </tr>
            <tr>
                <td>defaultDate</td>
                <td>int或string</td>
                <td>当前时间戳</td>
                <td>可以是任意时间或时间戳</td>
            </tr>
            <tr>
                <td>startDate</td>
                <td>object</td>
                <td>{defaultDate:new Date().valueOf()}</td>
                <td>用于设置起始时间的参数，表示开始时间，默认为当前时间戳。可配置startDate下的defaultDate值，类型与属性值与defaultDate属性相同。</td>
            </tr>
            <tr>
                <td>endDate</td>
                <td>object</td>
                <td>{defaultDate:new Date().valueOf()+1000}</td>
                <td>用于设置起始时间的参数，表示结束时间，默认为当前时间戳后1秒。可配置endDate下的defaultDate值，类型与属性值与defaultDate属性相同，不可小于或等于startDate.defaultDate。</td>
            </tr>
            </tbody>
        </table>
        <h3>日历操作</h3>
        <h5>1、设置时间</h5>
        <div>$(element).skdatepicker("setDate","2017-7-17 15:00:00",callback)</div>
        <h5>2、获取时间</h5>
        <div>$(element).skdatepicker("getDate")</div>
        <h6>其它功能待定......</h6>
    </div>
</div>
</html>