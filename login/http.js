var http = require('http');                    //引入http
var querystring = require('querystring');
var url = require('url');                      //引入url
var fs = require('fs');                        //引入文件管理

// http.createServer(function(req, res) {
//   console.log('链接成功');
//  //向请求的客户端发送响应头
//   res.writeHead(200,{'Content-Type': 'text/html; charset=urf-8'});
//   res.end('hello word');
// }).listen(3000) //与数据库端口不一致不影响使用。测试链接

http.createServer(function (req, res) {
  if (req.url == '/favicon.ico') {
    return;
  };
  var pathname = url.parse(req.url).pathname;
  var body = '';    //定义一个放post数据的变量

  req.on('data', function (chunk) {    //接受post参数并赋值给body
    body = '';
    body += chunk;
    body = querystring.parse(body);
  });

  fs.readFile(pathname.substring(1) + '.html', function (err, data) {
    if (err) {
      res.writeHead(404, {
        'Content-Type': 'text/html; charset=utf-8'
      });
      res.write('404页面不存在');
    } else {
      res.writeHead(200, {
        'Content-Type': 'text/html; charset=urf-8'
      });

      if (body) {    //如果body存在 说明进行了post请求
        switch (pathname) {   //判断登录还是注册
          case '/login':   //执行登录事件   并传入对应参数
            query.emit('login', body.username, body.password, connection);
            break;
          case '/regsiter':  //执行注册事件   并传入对应参数
            query.emit('regsiter', body.username, body.password, connection);
            break;
        }
      };

      res.write(data);
    };
    res.end();
  })
}).listen(3000);




var mysql = require('mysql');     //引入mysql模块

var mysql_user = {                 //编写数据库链接数据
  host: 'localhost',         //地址
  user: 'root',              //用户名
  password: 'root',              //密码 
  database: 'my_sql'         //链接的数据库
};

var connection = mysql.createConnection(mysql_user);    //建立数据库链接
connection.connect(function (err) {                     //链接数据库
  if (err) {      //链接错误执行
    console.log('[错误]' + err);
    connection.end();
    return;
  };
  console.log('链接成功');    //否则链接成功
});


//登录
var Event = require('events').EventEmitter;    //引入事件模块
var query = new Event();                       //创建事件对象

//绑定login事件  传入 username password  链接数据库对象
query.on('login', function (username, password, connection) {
  //编写sql查询语句;
  var find = 'SELECT * FROM userinfo WHERE UserName = ' + username;
  //执行sql语句
  connection.query(find, function (err, result) {
    if (err) {   //链接失败 直接return;
      console.log('[错误]' + err);
      return;
    };

    if (result.length) {   //如果查到了数据
      console.log('------------start----------------');
      var string = JSON.stringify(result);
      var json = JSON.parse(string)[0];
      console.log(string)
      if (json.UserPass == password) {
        console.log('密码校验正确');
      } else {
        console.log('密码校验错误');
      }
      console.log('--------------end-----------------');
    } else {
      console.log('账号不存在')
    }
  })
})


//注册
query.on('regsiter', function (username, password, connection) {
  //编写查询语句
  var find = 'SELECT * FROM userinfo WHERE UserName = ' + username;
  //编写添加语句
  var insert = 'INSERT INTO userinfo (Id,UserName,UserPass) VALUES (0,?,?)';
  //执行sql语句
  connection.query(find, function (err, result) {
    if (err) {   //链接失败 直接return;
      console.log('[错误]' + err);
      return;
    };

    if (result.length) {   //如果数据库返回数据 说明账号已存在
      console.log('账号已存在');
      return;
    } else {               //否则不存在   可以进行注册
      var inserInfo = [username, password];  //定义插入数据
      //执行插入数据语句
      connection.query(insert, inserInfo, function (err, result) {
        if (err) {   //链接失败 直接return;
          console.log('[注册错误]' + err);
          return;
        };
        console.log('------------start----------------');
        console.log('注册成功');
        console.log(result);
        console.log('--------------end-----------------');
      });
    };
  });
})