# Welcome to Minesweeper!
Hi! This project is a React app supported by a Ruby on Rails backend made for you to have fun.

## How it works
The user can start playing with the game, and start the game as long as he wants. The user can make a signup and save its prefered games, so he can continue on it later.

## Tecnologies
The project uses `React` for the APP and `Ruby on Rails` for the backend API, and `Postgres` for persistence. All the project was build using `Docker` and `Docker-Compose` for better development support.

## Why React and Rails?
My first idea was to build the whole logic of the game in the backend, and only show the result on the frontend. Actually instead of that I have used the backend API only for persistence, and the logic goes in the front, so we dont have the lattency of the network

## Building the project

`docker-compose build`

## Running the project
`docker-compose up`

The Minesweeper app will be available at `http://localhost:3000`
