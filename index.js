const express = require("express");
var path = require('path');
const methodOverride = require("method-override");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("express-flash");
const moment = require("moment")


require("dotenv").config();

const database = require("./config/database");

const systemConfig = require("./config/system");

const routeAdmin = require("./routes/admin/index.route");
const route = require("./routes/client/index.route");

database.connect();

const app = express();
const port = process.env.PORT;

app.use(methodOverride("_method"));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

app.set("views", `${__dirname}/views`);
app.set("view engine", "pug");

//Flash
app.use(cookieParser("NGUYENHONGQUANG"));
app.use(session({ cookie: { maxAge: 60000 } }));
app.use(flash());
//End Flash

//TinyMCE
app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));
// ENd Tiny MCE

//App local Variable
app.locals.prefixAdmin = systemConfig.prefixAdmin;
app.locals.moment = moment;


app.use(express.static(`${__dirname}/public`));

//Routes
routeAdmin(app);
route(app);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
