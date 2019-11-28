const express = require('express');
const chalk = require('chalk');
const debug = require('debug')('app:main');
const morgan = require('morgan');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const methodOverride = require('method-override');
const navigation = require('./src/config/navigation');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(morgan('tiny'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({ secret: 'library' }));
// override with POST having ?_method=DELETE
app.use(methodOverride('_method'));

require('./src/config/passport.js')(app);

app.use(express.static(path.join(__dirname, 'public/')));
app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')));
app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')));
app.use('/js', express.static(path.join(__dirname, 'node_modules/jquery/dist')));
app.set('views', path.join(__dirname, 'src/views/'));
app.set('view engine', 'ejs');

const rootRouter = require('./src/routes/rootRoutes')(navigation);
const authRouter = require('./src/routes/authRoutes')(navigation);
const bookRouter = require('./src/routes/bookRoutes')(navigation);

app.use('/', rootRouter);
app.use('/auth', authRouter);
app.use('/books', bookRouter);

app.listen(port, () => {
  debug(`${chalk.green(port)} yess, im listening...`);
});
