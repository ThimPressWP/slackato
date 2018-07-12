# Slackato

https://slackato.thimpress.com

## 1. Prerequisites

- [MongoDB](https://www.mongodb.org/downloads)
- [Node.js 6.0+](http://nodejs.org)

## 2. Getting Started

```
# Clone this project to your local.
git clone https://github.com/ThimPressWP/slackato.git slackato

# Change directory
cd slackato

# Install package dependencies
npm install || yarn
```

## 3. Configuration

- Copy file `example.env` and named it is `.env`.
- Create a slack app (https://api.slack.com/apps) and a envato app (https://build.envato.com/)
- Change file `.env` with app id and app key 2 apps just be created.

## 4. Run

- You can run by [PM2](http://pm2.keymetrics.io/) with command:

```
NODE_ENV=production pm2 start index.js --name slackato
```

## 5. Add to slack

Go to your site which is installed **Slackato** app and click to button `ADD TO SLACK`.

![Demo Slackato](/slackato.png)
