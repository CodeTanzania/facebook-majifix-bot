# Dawasco Facebook BOT 
- Node >= 7.6
- [bottender](https://github.com/Yoctol/bottender)
- Yarn (Dependency Manager)
- Winston (Logger)

This is the facebook messenger bot to help many dawasco customers who are using facebook to report water related problems direct to dawasco. 

This BOT is just another channel among many other channels that dawasco use to reach their customers.

## Contributing

1. Fork it!
2. Create your feature branch based on git flow 
3. Commit your changes
4. Push to the branch
5. Submit a pull request

## Usage
To run this app on any environment you must set the following environmental variable.

Variable | Desc
--------| -------
PAGE_ACCESS_TOKEN | Facebook page access token
APP_VERIFY_TOKEN | Verify token, this is local created and set in the facebook page
APP_ID | Bot App Id as provided by facebook
APP_SECRET_TOKEN | Bot secret token
BASE_API_URL | Base api url e.g `https://dawasco.herokuapp.com/open311/`

Note:
Make sure you understand basic concept of [bottender](https://github.com/Yoctol/bottender) as that
will make your life easy to understand whats going on.


## Folder Structure

The project files are organized as follows;

```
.
├── README.md
├── app
│   ├── actions.js
│   ├── api.js
│   ├── bottender.config.js
│   ├── handlers
│   │   ├── changeLocale.js
│   │   ├── changePhoneNum.js
│   │   ├── main.js
│   │   └── submitProblem.js
│   ├── index.js
│   ├── locales
│   │   ├── en.json
│   │   └── sw.json
│   └── winston.js
├── package.json
└── yarn.lock
```


### app/index.js

All functionalities start from here.\
Mainly it's a server which listen on port 5000. You are encouraged to add more [event listener](https://bottender.js.org/docs/APIReference-Event)
and [handler](https://bottender.js.org/docs/APIReference-Handler) to enrich the bot.

### app/actions.js
It contains functions that when executed they send command to user to prompt them to do something with the bot. They stay in this file so that they can be reusable. If action to be sent to user is not expected to be reused
somewhere else then we don't recommend to put it here.

### bottender.config.js

The config file for the bot.\
We suggests you to put all platform configs into this file and use it as a parameter
of createServer.

## Available Scripts

There are two default scripts you can run:

### `npm run dev`

Run the bot in the development mode.\
It will automatically restart the bot if there are any changes in `app/index.js`.\
For more information, check [nodemon's repo](https://github.com/remy/nodemon)

### `npm start`

Run the bot without being monitored.\
The bot won't be restarted when you change anything in `app/index.js`

