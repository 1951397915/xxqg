"ui";
var 获取内容 = http.get("https://1951397915.github.io/qiangguoyanzheng/gonggao.txt");
var 公告 = 获取内容.body.string();
//机器码
var jqm=device.getAndroidId()
主题颜色 = "#87CEFA";
this.卡片圆角 = "15dp";
this.卡片外边距 = "10dp";
this.卡片高度 = "15dp";
this.卡片内边距 = "5dp";
ui.layout(
    <vertical>
        <card h='auto' w='*' cardCornerRadius={this.卡片圆角} margin={this.卡片外边距} cardElevation={this.卡片高度} padding={this.卡片内边距}>
            <vertical>
            <text gravity='center' text='权限服务' w='*' h='auto' textSize='18sp' textColor='#ffffff' padding='10dp' bg='{{主题颜色}}'></text>
            <Switch id="autoService" text="无障碍服务" checked="{{auto.service != null}}" padding="8 8 8 8" textSize="15sp"></Switch>
            <Switch id="switchEnbleFloating" text="悬浮窗权限" checked="{{$floaty.checkPermission()}}" padding='8dp' textSize='15sp'></Switch>
        </vertical>
        </card>
        <card h='auto' w='*' cardCornerRadius={this.卡片圆角} margin={this.卡片外边距} cardElevation={this.卡片高度} padding={this.卡片内边距}>
            <vertical>
                <text gravity='center' text='公告' w='*' h='auto' textSize='18sp' textColor='#ffffff' padding='10dp' bg='{{主题颜色}}'></text>
                <text padding='8dp' text='{{公告}}' textColor="red" textSize='14sp'></text>
            </vertical>
        </card>
        <card h='auto' w='*' cardCornerRadius={this.卡片圆角} margin={this.卡片外边距} cardElevation={this.卡片高度} padding={this.卡片内边距}>
            <ScrollView>
                 <horizontal padding="8 8" h="auto">
                     <text textSize="16sp" textColor="gray" text=" 机器码: " />
                     <text id="jqm" textSize="16sp" textColor={主题颜色} text={jqm} />
                 </horizontal>
            </ScrollView>
        </card>
                            <input id="卡密" hint="请输入:1234" />\
                            <card w="*" h="50" cardCornerRadius="10dp" cardElevation="0dp" margin="20 15" >
                                 <View w="*" h="*" bg="#99CCCC"/>
                                 <text id="登录" text="登录"  color="#FFFFFF"  gravity="center" textSize="20" marginTop="0" bg="?attr/selectableItemBackground" clickable="true"/>
                            </card>
                          
    </vertical>
    );
    

//保存卡密
var 本地存储=storages.create("卡密数据")
var 内容=本地存储.get("卡密");
if(内容){
   ui.卡密.setText(内容);
}

//设置状态颜色
ui.statusBarColor(主题颜色);
//机器码复制
function aaa(xx) {
  ui[xx].click(function () {
    var text=ui[xx].getText()
    setClip(text);
    toast("复制成功"+text);
  });
}
aaa("jqm");
//无障碍
ui.autoService.on("check", function (checked) {
    // 用户勾选无障碍服务的选项时，跳转到页面让用户去开启
    if (checked && auto.service == null) {
        app.startActivity({
            action: "android.settings.ACCESSIBILITY_SETTINGS"
        });
    }
    if (!checked && auto.service != null) {
        auto.service.disableSelf();
    }
});
//悬浮窗
ui.switchEnbleFloating.on("check", function (checked) {
    if (checked && !$floaty.checkPermission()) {
        $floaty.requestPermission(); 
    }
    if (!checked && $floaty.checkPermission()) {
        ui.switchEnbleFloating.checked = true;
        toast("悬浮窗权限已处于开启状态，不能关闭！");
    }
});
// 当用户回到本界面时，resume事件会被触发
ui.emitter.on("resume", function () {
    // 此时根据无障碍服务的开启情况，同步开关的状态
    ui.autoService.checked = auto.service != null;
    ui.switchEnbleFloating.checked = $floaty.checkPermission();
});
//按钮点击事件

/*开始运行，先检查授权信息在运行*/
ui['登录']['click'](() => {
var 内容=ui.卡密.text();
本地存储.put("卡密",内容)
var 获取链接内容_ = http.get("https://api.uomg.com/api/get.weiyun?wid=70011730166370cfb7dc2bfdc5e75bd0&format=json").body.json().text;
var result = CheckId(内容);
    //storages.remove("设备ID存储")//删除本地存储，作者测试用
    if (result.授权状态_ == "已授权") {
        //授权了可以执行什么
         toast("😃")
        toastLog("恭喜，你的设备已授权");
       
        engines.execScriptFile("学习小手电.js")
        toastLog("有效至期:"+v.授权时间_)
        
    } else {
        //未授权该怎么做，这里是结束脚本
        toastLog("\n抱歉，你的设备未授权，如需授权请联系管理员");
    }
function CheckId(id) {
    for (v of 获取链接内容_) {
        if (v.授权id_ == id && v.授权状态_ == "已授权") {
            return {
                "授权状态_": "已授权",
                "过期时间_": v.授权时间_
            }
        }
    }
    return {
        "授权状态": "未授权",
        "过期时间_": v.授权时间_
    };
}

//心跳线程检查过期时间
threads.start(function() {
    setInterval(() => {
        var nowTime = IntTime();
        if (nowTime > result.过期时间_ && 内容 != null) {
            toastLog("你的设备授权已过期,如需继续使用，请联系管理员");
            exit();
        }
    },1000)
})

/*获取网络时间，防止本地时间被修改*/
function IntTime() {
    try {
        var recode_suning = http.get("http://quan.suning.com/getSysTime.do");
        var suningTime = recode_suning.body.json();
        return suningTime.sysTime2;
    } catch (e) {
        toastLog("网络错误,请检查...")
        exit();
    }
};
});


