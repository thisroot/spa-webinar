# Материалы к вебинару "Разработка SPA на React, NodeJS, Express и MongoDB"

### План вебинара

 - Краткое введение в NodeJS и npm
 - Написание простого сервера на NodeJS
 - Кратко о MongoDB, взаимодействие с базой данных
 - Написание компонентов на ReactJS
 - Кратко об архитектуре Flux
 - Получение и обработка данных с API
 - Распределение данных внутри приложения
 - Динамика в приложении

### Вспомогательные материлы

В рамках данного вебинара мы напишем небольшое приложение для создания и хранения заметок ([такое](ccылка)) на NodeJS, Express, MongoDB и React.

#### 1. Введение в Node.js и npm

Node.js - программная платформа, основанная на движке Javascript V8. Она позволяет выполнять Javascript код на сервере.

Первое, что нужно сделать - это установить Node.js. Вместе с ним в комплекте идет также и npm (Node Package Manager) - менеджер пакетов. В зависимости от используемой операционной системы, у Вас естьтакие варианты:

 - Для Windows: [скачать .msi установщик](https://nodejs.org/en/download)
 - Для Linux: запустить ```curl -L https://npmjs.org/install.sh | sh``` в терминале
 - Для Mac: [скачать .pkg установщик](https://nodejs.org/en/download) или ```brew install node```, если используете [Homebrew](http://brew.sh/)

После установки, можно проверить наличие Node.js и npm на Вашем компьютере.

```
node -v
v5.1.0

npm -v
3.3.12
```

#### 2. Hello world на Node.js

Давайте приступим к делу и напишем наше первое Node.js приложение «Hello world».

Откройте любой редактор и создайте файл под названием helloworld.js. В нем мы хотим вывести строку «Hello world» в консоль, для этого пишем следующий код:

```
console.log("Hello World");
```

Сохраняем файл и выполняем его посредством Node.js из терминала:

```
node helloworld.js
```

Эта команда должна вывести Hello World в вашем терминале.

#### 3. Постановка задачи

Мы будем создавать приложения для работы с заметками с таким функционалом:

    1. Добавить заметку
    2. Просмотреть заметки
    3. Удалить заметку

В самом начале, нам нужно спроектировать API сервера. Исходя из определенного выше функционала и опираясь на методолгию REST, нам понадобятся такие вызовы:

    `GET /notes` - получить все заметки
    `POST /notes` - создать новую заметку
    `DELETE /notes/:id` - удалить заметку

#### 4. Использование Express

[Express](http://expressjs.com/) - это минималистичный и гибкий веб-фреймворк для приложений Node.js, предоставляющий обширный набор функций. Он значительно упрощает маршрутизацию, использование промежуточных обработчиков (middleware), обработку запросов и отладку.

Создадим новую папку для проекта. Добавим в нее файл `package.json` приблизительно такого содержания:

```
{
  "name": "NotesApp",
  "version": "0.0.1",
  "description": "Notes application",
  "scripts": {
    "server": "babel-node server/app.js",
  },
  "author": {
    "name": "Kateryna Porshnieva",
    "email": "k.porshnieva@gmail.com",
    "url": "https://github.com/krambertech"
  },
  "dependencies": {
    "body-parser": "*",
    "cors": "*",
    "express": "*",
    "mongoose": "*"
  },
  "devDependencies": {
    "babel": "5.x",
    "babel-loader": "5.x"
  }
}

```

Создадим папку `/server` - в ней будет храниться весь код, относящийся к серверной части приложения (бекенд). В ней создадим файл `app.js` - главный файл нашего сервера.

**Примечание:** Весь последующий код будет написан в стандарте ES2015 (ES6).

```
import express from 'express';

const app = express();

const server = app.listen(8080, () => {
    console.log(`Server is up and running on port 8080`);
});
```

Здесь мы создали express-приложение и запустили веб-сервер на порте 8080. Для того, чтобы запустить его нужно выполнить в терминале `babel-node server/app.js`.

Пока что наш сервер ничего не умеет делать, давайте создадим для него новый маршрут:

```
import express from 'express';

const app = express();

app.get('/', (req, res) => {
    res.send('Hello World!');
});

const server = app.listen(8080, () => {
    console.log(`Server is up and running on port 8080`);
});
```

Теперь если открыть http://localhost:8080/ то вы увидите надпись "Hello world". Маршруты в Express описываются очень просто:

```
app.get('/grapes', (req, res) => {});
app.post('/grapes', (req, res) => {});
app.put('/grapes', (req, res) => {});
app.delete('/grapes', (req, res) => {});
```

Вы пишете `app.метод(маршрут, функция)`. Маршрут затем будет трансформирован в резулярное выражение, чтобы сервер понимал какие запросы как нужно обработать. Функция принимает объекты req ([объект запроса](http://expressjs.com/ru/4x/api.html#req)), res ([объект ответа](http://expressjs.com/ru/4x/api.html#res)) и next (функцию для вызова следующего обработчика).

#### 5. MongoDB и mongoose

MongoDB - это документо-ориентированная СУБД. Данные в MongoDB хранятся в документах, которые объединяются в коллекции. Каждый документ представляет собой JSON-подобную структуру (BSON). Проведя аналогию с реляционными СУБД, можно сказать, что коллекциям соответствуют таблицы, а документам — строки в таблицах. В отличие от РСУБД MongoDB не требует какого-либо описания схемы базы данных — она может постепенно меняться по мере развития приложения, что есть удобно.

Cначала нужно установить MongoDB на свой компьютер. Cсылка для скачивания и инструкции по установке: https://www.mongodb.org/downloads

Mongoose — самый популярный модуль для работы с mongodb на javascript. Он позволяет очень удобно работать с базой данных, в нем все строится на схемах данных. То есть вы создаете модель хранимых данных в базе, а он уже помогает их типизировать, валидировать, строить бизнес логику поверх них, создавать запросы и т.д.

В базе данных мы будем хранить заметки. Так как в mongoose все строится на моделях данных, нам нужно создать модель (схему) для заметок. Делается это очень просто:

```
import mongoose from "mongoose";

const Schema = mongoose.Schema;

const NoteSchema = new Schema({
    title     : { type: String },
    text      : { type: String, required: true },
    color     : { type: String },
    createdAt : { type: Date }
});

const Note = mongoose.model('Note', NoteSchema);
```

Есть огромное множество встроенных типов и приемов для работы с данными - все их вы можете найти в документации - http://mongoosejs.com/docs/

Сейчас мы создали схему для заметки, а потом, на основе этой схемы, модель. Модель - это класс, с помощью которого будут строиться документы в коллекции. В этом случае, каждый документ будет заметкой с параметрами и поведением, которое мы определили. Например, у каждой заметки есть заголовок, текст, цвет и дата создания. Из всех полей, только тект является обязательным - он помечен `required`.

Также к схемам можно добавлять методы:

```
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/kittens');

var kittySchema = mongoose.Schema({
    name: String
});

kittySchema.methods.speak = function () {
  var greeting = this.name
    ? "Meow name is " + this.name
    : "I don't have a name";
  console.log(greeting);
}

var Kitten = mongoose.model('Kitten', kittySchema);

var fluffy = new Kitten({ name: 'fluffy' });

fluffy.speak();
```

Мы с вами создали говорящих котят. Для того, чтобы сохранить Флаффи в базу данных, нам нужно просто написать:

```
fluffy.save(function (err, fluffy) {
  if (err) return console.error(err);
  fluffy.speak();
});
```

Теперь для того, чтобы получить всех котят, мы можем использовать метод find:

```
Kitten.find(function (err, kittens) {
  if (err) return console.error(err);
  console.log(kittens);
})
```

Чтобы найти всех котят по имени fluffy:

```
Kitten.find({ name: "fluffy" }, callback);
```

Теперь давайте отойдем от котят и вернемся к нашим заметкам. Сохраним модель заметки в папке `/server/models/Note.js`. Теперь нужно связать взаимодействие с базой данных и запросы. Для работы с базой мы создадим утилиту `server/utils/DataBaseUtils.js`, в которой просто изолируем методы для работы с базой.

Сначала нам нужно настроить соединение:

```
import mongoose from "mongoose";

import '../models/Note';

const Note = mongoose.model('Note');

export function setUpConnection() {
    mongoose.connect(`mongodb://localhost/notes`);
}
```

И добавим несколько методов для взаимодействия с базой:

```
export function listNotes(id) {
    return Note.find();
}

export function createNote(data) {
    const note = new Note({
        title: data.title,
        text: data.text,
        color: data.color,
        createdAt: new Date()
    });

    return note.save();
}

export function deleteNote(id) {
    return Note.findById(id).remove();
}
```

Теперь нужно создать соответствующие маршруты. Вернемся к файлу `/server/app.js`.

Данные мы будем получать в формате json, для того, чтобы удобно с ними взаимодействовать мы будем использовать промежуточный обработчик [body-parser](https://github.com/expressjs/body-parser). Он будет вызван всякий раз, когда прийдет запрос - он сначала преобразует данные, а затем передаст управление нашим обработчикам.

Используется он таким образом:

```
import bodyParser from 'body-parser';

// ...

app.use( bodyParser.json() );
```

Теперь данные, полученые в json формате будут обработаны корректно.

В итоге, наш файл `app.js` выглядит вот так:

```
import express from 'express';
import bodyParser from 'body-parser';

import * as db from './utils/DataBaseUtils';

// Initialization of express application
const app = express();

// Set up connection of database
db.setUpConnection();

// Using bodyParser middleware
app.use( bodyParser.json() );

// RESTful api handlers
app.get('/notes', (req, res) => {
    db.listNotes().then(data => res.send(data));
});

app.post('/notes', (req, res) => {
    db.createNote(req.body).then(data => res.send(data));
});

app.delete('/notes/:id', (req, res) => {
    db.deleteNote(req.params.id).then(data => res.send(data));
});

const server = app.listen(8080, function() {
    console.log(`Server is up and running on port 8080`);
```

После обращения к базе мы используем промисы (Promise), они предоставляют удобный способ организации асинхронного кода.

На этом почти все, мы создали серверное приложение на node.js. Еще было бы неплохо создать для него конфигурацию, то есть вынести некоторые переменные в конфиг. Создадим файл `/etc/config.json`:

```
{
    "apiPrefix": "http://localhost:8080",
    "serverPort": "8080",
    "db":{
        "name": "notes",
        "host": "localhost",
        "port": 27017
    }
}
```

Теперь при использовании этих переменных, будем обращаться к этому файлу.

**app.js**
```
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

import { serverPort } from '../etc/config.json';

import * as db from './utils/DataBaseUtils';

// Initialization of express application
const app = express();

// Set up connection of database
db.setUpConnection();

// Using bodyParser middleware
app.use( bodyParser.json() );

// Allow requests from any origin
app.use(cors({ origin: '*' }));

// RESTful api handlers
app.get('/notes', (req, res) => {
    db.listNotes().then(data => res.send(data));
});

app.post('/notes', (req, res) => {
    db.createNote(req.body).then(data => res.send(data));
});

app.delete('/notes/:id', (req, res) => {
    db.deleteNote(req.params.id).then(data => res.send(data));
});

const server = app.listen(serverPort, function() {
    console.log(`Server is up and running on port ${serverPort}`);
});
```

**DataBaseUtils.js**
```
import mongoose from "mongoose";

import config from '../../etc/config.json';

import '../models/Note';

const Note = mongoose.model('Note');

export function setUpConnection() {
    mongoose.connect(`mongodb://${config.db.host}:${config.db.port}/${config.db.name}`);
}

export function listNotes(id) {
    return Note.find();
}

export function createNote(data) {
    const note = new Note({
        title: data.title,
        text: data.text,
        color: data.color,
        createdAt: new Date()
    });

    return note.save();
}

export function deleteNote(id) {
    return Note.findById(id).remove();
}
```

#### 6. Введение в React

ReactJS - это JаvaScript библиотека для построения пользовательских интерфейсов. Это не MVC фреймворк. К нему можно применить только V из этой аббревиатуры. Такая узкая сфера применения дает свободу использования React в различных системах в комбинации с другими библиотеками.

React был представлен Facebook в 2013 году, и очень быстро обрел популярность. Сегодня его используют многие известные компании включая Instagram, Airbnb, Ebay, Netflix, Yahoo и другие.

Основным отличием React от других JavaScript фреймворков является то, как он управляет состоянием приложения. Если вспомнить, как пользователи взаимодействовали с веб-страницами еще 10-15 лет назад, то увидим такую картину:

![](https://github.com/krambertech/react-essential-course/raw/master/01-introduction-to-react/images/001.png)

Сервер всегда возвращал статическую страницу, и реакцией на действия пользователя была полная перезагрузка страницы. Преимуществами такого подхода, была простота в реализации и понимании, недостатками - скорость работы, отзывчивость, UX и потеря состояния при каждой перезагрузке.

Все очень изменилось с появлением AJAX, это подход к построению интерактивных веб-приложений, заключающийся в «фоновом» обмене данными браузера с веб-сервером. То есть, в фоновом режиме отправляются запросы на сервер, приходят с него ответы, изменяется состояние приложения и, соответственно, внешний вид. Именно такой подход породил понятие Single Page Application.

![](https://github.com/krambertech/react-essential-course/raw/master/01-introduction-to-react/images/002.png)

Но каждое визуальное изменение на странице соответствует изменению ее DOM дерева. Не секрет, что все манипуляции с DOM деревом являются очень ресурсоемкими операциями, т.к. изначально DOM дерево было статическим и никакой динамики не предусматривало.

![](https://github.com/krambertech/react-essential-course/raw/master/01-introduction-to-react/images/006.png)

Именно поэтому в React используется виртуальный DOM. Это такая легковесная копия реального DOM дерева на Javascript. Таким образом, React манипулирует не с реальным (синоним - медленным) DOM деревом, а с виртуальным.

![](https://github.com/krambertech/react-essential-course/raw/master/01-introduction-to-react/images/003.png)

Он сравнивает предыдущее состояние виртуального DOM дерева с его следующим состоянием и находит минимальное количество манипуляций, которые можно произвести уже с реальным DOM, чтобы обновить вид приложения согласно его новому состоянию.

![](https://github.com/krambertech/react-essential-course/raw/master/01-introduction-to-react/images/004.png)

И это действительно быстро работает. А все что вам нужно делать - это просто менять состояние вашего приложения, а все остальное React сделает уже за вас!


### Запуск проекта

1. Clone this repo
2. `cd spa-webinar`
3. `npm install`
4. Скопируйте `etc/config.js.sample` в `etc/config.js`
4. `npm run server`
5. `npm run webpack-devserver`
6. Откройте http://localhost:8090 в браузере
