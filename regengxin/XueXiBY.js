//engines.execScriptFile("qgxx.js");
"ui";
importClass(android.database.sqlite.SQLiteDatabase);
var path = files.path("tiku.db");
console.setGlobalLogConfig({ "file": "/sdcard/qgxx/运行日志.txt" });
var storage = storages.create("form") //本地存储文件建立
var formDefault = {//默认选择项为空
    challenge_quiz: true,
    daily_quiz: true,
    sr_quiz: true,
    zsy_quiz: true,
    weekly_quiz: false,
    special_quiz: false,
    article_quiz: true,
    video_quiz: true,
    local_quiz: true,
    weekly_scroll: 5,
    spec_scroll: 5,
    challenge_all: false,
    dian_full: false,
    self_kill: false,
    battle_delay: 500
}
var form = storage.get("form", formDefault);

/********************************************UI部分***********************************************/
ui.layout(
    <vertical>
        <vertical padding="10 6 0 6" bg="#ffffff" w="*" h="auto" margin="0 5" elevation="1dp">
            <Switch id="autoService" text="无障碍服务" checked="{{auto.service != null}}" textStyle="bold" padding="8 8 8 8" textSize="15sp" />
        </vertical>
        <ScrollView>
            <vertical>
                <card w="*" h="*" margin="10 5" cardCornerRadius="2dp"
                    cardElevation="1dp" gravity="center_vertical">
                    <ScrollView>
                        <horizontal padding="8 8" h="auto">
                            <text textSize="16sp" textColor="gray" text=" 题库条数：" />
                            <text id="total" textSize="16sp" textColor="red" text={app.versionName} />
                        </horizontal>
                    </ScrollView>
                    <View bg="#4caf50" h="*" w="10" />
                </card>
                <card w="*" h="*" margin="10 5" cardCornerRadius="2dp"
                    cardElevation="1dp" gravity="center_vertical">
                    <ScrollView>
                        <vertical h="auto" w="*">
                            <text text=" 自定义刷题：" marginLeft="10" textColor="#222222" />
                            <horizontal marginLeft="15" h="auto" w="*">
                                <text text="每周答题翻动" />
                                <input id="weekly_scroll" inputType="number" text="{{form.weekly_scroll}}" />
                                <text text="页  " />
                                <text text="专项答题翻动" />
                                <input id="spec_scroll" inputType="number" text="{{form.spec_scroll}}" />
                                <text text="页" />
                            </horizontal>
                            <horizontal marginLeft="15" h="auto" w="*">
                                <text text="对战延时" />
                                <input id="battle_delay" inputType="number" text="{{form.battle_delay}}" />
                            </horizontal>
                            <horizontal marginLeft="10" h="auto">
                                <checkbox id="challenge_all" text="无限挑战" checked="{{form.challenge_all}}" w="auto" />
                                <checkbox id="dian_full" text="刷满点点通" checked="{{form.dian_full}}" w="auto" marginLeft="15" />
                                <checkbox id="self_kill" text="平衡胜率" checked="{{form.self_kill}}" w="auto" marginLeft="15" />
                            </horizontal>
                        </vertical>
                    </ScrollView>
                    <View bg="#2196f3" h="*" w="10" />
                </card>
                <card w="*" h="*" margin="10 5" cardCornerRadius="2dp"
                    cardElevation="1dp" gravity="center_vertical">
                    <ScrollView>
                        <vertical padding="8 8" h="auto">
                            <text text=" 自选任务选择：" textColor="#222222" />
                            <horizontal gravity="left" marginTop="5" w="*">
                                <checkbox id="article_quiz" text="选读文章" checked="{{form.article_quiz}}" />
                                <checkbox id="video_quiz" text="视听学习" checked="{{form.video_quiz}}" marginLeft="15"/>
                                <checkbox id="local_quiz" text="本地频道" checked="{{form.local_quiz}}" marginLeft="15"/>
                            </horizontal>
                            <horizontal gravity="left" marginTop="5" w="*">
                                <checkbox id="challenge_quiz" text="挑战答题" checked="{{form.challenge_quiz}}" />
                                <checkbox id="daily_quiz" text="每日答题" checked="{{form.daily_quiz}}" marginLeft="15"/>
                                <checkbox id="sr_quiz" text="双人对战" checked="{{form.sr_quiz}}" marginLeft="15"/>
                            </horizontal>
                            <horizontal gravity="left" marginTop="5" w="*">
                                <checkbox id="zsy_quiz" text="四人赛" checked="{{form.zsy_quiz}}" />
                                <checkbox id="weekly_quiz" text="每周答题" checked="{{form.weekly_quiz}}" marginLeft="15"/>
                                <checkbox id="special_quiz" text="专项答题" checked="{{form.special_quiz}}" marginLeft="15"/>
                            </horizontal>

                        </vertical>
                    </ScrollView>
                    <View bg="#2196f3" h="*" w="10" />
                </card>
                <card w="*" h="*" margin="10 5" cardCornerRadius="2dp"
                    cardElevation="1dp" gravity="center_vertical" layout_gravity="center">
                    <ScrollView>
                        <vertical padding="8 8" h="auto" gravity="center_horizontal">
                            <button id="showFloating" h="50" text="显示悬浮窗" w="300dp" />
                        </vertical>
                    </ScrollView>
                    <View bg="#007730" h="*" w="10" />
                </card>
            </vertical>
        </ScrollView>
    </vertical>
);

//加载悬浮窗
ui.showFloating.click(() => {
    storage.put("form", form);
//网络验证
threads.start(function(){
      function 验证(){
      try{
           var 获取内容 = http.get("https://1951397915.github.io/qiangguoyanzheng/ksxx.txt");
           var 返回内容 = 获取内容.body.string();
           return 返回内容;
     }catch(e){}
     }
      if(验证().search("一只有趣") == -1){
            console.log("验证失败");
            toast("该版本停止使用");
            exit()
     }
     else{
     engines.execScriptFile("XueXi.js");   
     console.log("验证成功")
     toast("开始学习");
}})
});

/**------------------------------UI设置---------------------------------- */
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

// 当用户回到本界面时，resume事件会被触发
ui.emitter.on("resume", function () {
    // 此时根据无障碍服务的开启情况，同步开关的状态
    ui.autoService.checked = auto.service != null;
});

//进度条不可见
ui.run(() => {
    let dbCount = allCaseNum("tiku");
    ui.total.setText(String(dbCount));
});

ui.weekly_scroll.addTextChangedListener({
    afterTextChanged: (string) => {
        form.weekly_scroll = parseInt(string);
        storage.put("form", form);
    }
})


ui.spec_scroll.addTextChangedListener({
    afterTextChanged: (string) => {
        form.spec_scroll = parseInt(string);
        storage.put("form", form);
    }
})

ui.battle_delay.addTextChangedListener({
    afterTextChanged: (string) => {
        form.battle_delay = parseInt(string);
        storage.put("form", form);
    }
})

ui.challenge_all.on("check", function (check) {
    if (check)
        form.challenge_all = true;
    else
        form.challenge_all = false;

    storage.put("form", form);
});

ui.dian_full.on("check", function (check) {
    if (check)
        form.dian_full = true;
    else
        form.dian_full = false;

    storage.put("form", form);
});

ui.self_kill.on("check", function (check) {
    if (check) {
        form.self_kill = true;
        toast("答题得分后会继续两轮全错，用以平衡胜率");
    }
    else
        form.self_kill = false;

    storage.put("form", form);
});

ui.article_quiz.on("check", function (check) {
    if (check)
        form.article_quiz = true;
    else
        form.article_quiz = false;

    storage.put("form", form);
});

ui.video_quiz.on("check", function (check) {
    if (check)
        form.video_quiz = true;
    else
        form.video_quiz = false;

    storage.put("form", form);
});

ui.local_quiz.on("check", function (check) {
    if (check)
        form.local_quiz = true;
    else
        form.local_quiz = false;

    storage.put("form", form);
});

ui.challenge_quiz.on("check", function (check) {
    if (check)
        form.challenge_quiz = true;
    else
        form.challenge_quiz = false;

    storage.put("form", form);
});

ui.daily_quiz.on("check", function (check) {
    if (check)
        form.daily_quiz = true;
    else
        form.daily_quiz = false;

    storage.put("form", form);
});

ui.sr_quiz.on("check", function (check) {
    if (check)
        form.sr_quiz = true;
    else
        form.sr_quiz = false;

    storage.put("form", form);
});

ui.zsy_quiz.on("check", function (check) {
    if (check)
        form.zsy_quiz = true;
    else
        form.zsy_quiz = false;

    storage.put("form", form);
});

ui.weekly_quiz.on("check", function (check) {
    if (check)
        form.weekly_quiz = true;
    else
        form.weekly_quiz = false;

    storage.put("form", form);
});

ui.special_quiz.on("check", function (check) {
    if (check)
        form.special_quiz = true;
    else
        form.special_quiz = false;

    storage.put("form", form);
});





/*ui.update.click(function () {//在线更新题库
    if (thread != null && thread.isAlive()) {
        alert("注意!", "当前程序正在运行，请结束之前进程");
        return;
    }
    confirm("确认更新在线题库吗?")
    .then(c => {
        if(c){
            console.show();
            thread = threads.start(function () {
          try {
            updateTikunet();
            } catch (e) {
             alert("在线更新题库出错！");
             }
            });
         threads.shutDownAll();
         console.hide();
         engines.stopAll();
         exit();
        }
    });
});*/

/**
 * @description: 判断题库是否存在
 * @param: null
 * @return: boolean
 */
function judge_tiku_existence() {
    if (!files.exists(path)) {
        console.error("未找到题库！请将题库文件放置与js文件同一目录下再运行！");
        return false;
    }
    var db = SQLiteDatabase.openOrCreateDatabase(path, null);
    var createTable = "CREATE TABLE IF NOT EXISTS tiku(question CHAR(253),option CHAR(100), answer CHAR(100),wrongAnswer CHAR(100));";
    db.execSQL(createTable);

    db.close();
    return true;
}

/**
 * 查询数据库中的总条数.
 * @return count
 */
function allCaseNum(tableName) {
    if (!files.exists(path)) {
        files.createWithDirs(path);
    }
    let count = 0;
    if (judge_tiku_existence()) {
        let db = SQLiteDatabase.openOrCreateDatabase(path, null);
        let sql = "select count(*) from " + tableName;
        let cursor = db.rawQuery(sql, null);
        cursor.moveToFirst();
        count = cursor.getLong(0);
        cursor.close();
        db.close();
    }
    return count;
}
