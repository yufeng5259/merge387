var Logs = {};

Logs.Level = {
  Info: 1,
  Log: 2,
  Warning: 3,
  Error: 4,
}

//Log 等级
Logs.m_Level = Logs.Level.Log;
//是否输出debug消息
Logs.enableDebug = false;

Logs.Debug = function(...values) {
    if (!Logs.enableDebug)
      return;
    console.log( ...values );
}

Logs.Info = function(...values) {
  if (Logs.m_Level > Logs.Level.Info)
    return;
  console.log( ...values );
}

Logs.Log = function(...values) {
  if (Logs.m_Level > Logs.Level.Log)
    return;
  console.log( ...values );
}

Logs.Warning = function(...values) {
  if (Logs.m_Level > Logs.Level.Warning)
    return;
  console.log("~~## Warning ##~~", ...values );
}

Logs.Error = function(...values) {
  if (Logs.m_Level > Logs.Level.Error)
    return;
  console.log("~~## ERROR ##~~", ...values );
  AppMain.instance.logerror({msg:"".concat(...values), url:"", line:""})
}

global.Logs = Logs;