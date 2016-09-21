# My Athletics Club

### Requirements

- Node v. 4.x. Get it here: https://nodejs.org/en/
- Git. Get it here: https://git-scm.com/downloads

### Get it

```
git clone https://github.com/joensindholt/my-athletics-club.git
cd my-athletics-club
```

### Backend

Before running the backend you must add Auth0 credentials. 

[HOWTO TO COME]

Then start the server:

```
cd api
tsc
node dist/server.js
```

A succesful start should result in:

```
Server listening at: http://localhost:8889
```

### Frontend

Build and run the frontend by running:

```
cd frontend
npm install -g bower && npm install -g tsd && npm run build
gulp watch
```

Then open a browser at `http://localhost:8000`

If all is well you should see the app running and a couple of tasks already added.
