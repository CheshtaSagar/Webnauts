//entry point of the project
var express=require('express');

var app=express();

//setting up template engine
app.set('view engine','ejs');

//for using static files
app.use(express.static('/public'));

app.get('/',function(req,res)
{
res.render('index');
});

app.listen(3000);
console.log('server is running at port 3000');