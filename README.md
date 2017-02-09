# My Athletics Club

### Requirements

- [Node v. 4.x.](https://nodejs.org/en/)
- [Git](https://git-scm.com/downloads)
- [.NET Core 1.1 SDK](https://www.microsoft.com/net/download/core#/current)

### Clone it

```
git clone https://github.com/joensindholt/my-athletics-club.git
cd my-athletics-club
```

### Backend

Start the backend api:

```
cd api/src/MyAthleticsClub.Api/
dotnet restore
dotnet run
```

Open up a browser at `http://localhost:5000/swagger` to check it out

### Frontend

Build and run the frontend by running:

```
cd frontend
npm install -g bower && npm install -g tsd && npm run build
gulp watch
```

Then open a browser at `http://localhost:8000`

If all is well you should see the app running.
