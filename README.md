# Minklub

### Requirements

- Node v. 4.x. Get it here: https://nodejs.org/en/
- Git. Get it here: https://git-scm.com/downloads

### Get it

Clone the repo by running the following in a terminal

```
git clone https://github.com/joensindholt/minklub.git
cd minklub
```

### Backend

Before running the backend you must add AWS credentials (supplied via different channel) by running the following commands:

```
cd api
node credgen {accessKeyId} {secretAccessKey}
```

Then start the server:

```
npm install
npm start
```

A succesful start should show

```
Server listening at: http://localhost:8888
```

...in the terminal.

### Frontend

Build and run the frontend by running:

```
cd frontend
npm install -g bower && npm install -g tsd && npm run build
npm start
```

Then open a browser at `http://localhost:8000`

If all is well you should see the app running and a couple of tasks already added.
