## Running the project
`docker-compose up`

## Making request to the API
 - `curl http://localhost:5000/api/v1/users/`
 - `curl -X POST -H "Content-Type: application/json" -d '{"username":"eduardo", "password":"pass"}' http://localhost:5000/api/v1/users/`
 - `curl -X POST -H "Content-Type: application/json" -d '{"username":"eduardo", "password":"pass"}' http://localhost:5000/api/v1/users/signin`
 - `curl -X POST -H "Content-Type: application/json" -d '{"games": [{}]]}' http://localhost:5000/api/v1/users/1/games`
