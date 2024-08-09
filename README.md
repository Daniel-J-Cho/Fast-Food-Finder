# fast-food-finder

A full stack JavaScript web application for busy people who want to quickly find
a fast-food restaurant location.

This was a project I wanted to build because I wanted to learn how to implement
a map and learn how to use the Google Maps JavaScript API along with their 'Places'
library.

## Live Demo

Try the application live at https://fast-food-finder.danielcho.dev/#sign-in

## Technologies Used

- HTML5
- CSS3
- JavaScript (ES5/ES6)
- ReactJS
- NodeJS
- Express
- Babel
- Webpack
- Node-Fetch
- Google Maps JavaScript API
- Google Maps React-wrapper


## Features

- Users can select a fast-food franchise from a dropdown menu.
- Users can choose to use their current location by clicking on an icon.
- Users can see the nearest locations of the selected fast-food franchise on a map.
- Users can click on a fast-food location on the map and have a pop-up appear containing the location's general information.
- Users can enter an address and have said address's location appear on the map.
- Users can create an entry of a location by clicking a button.
- Users can delete an entry.
- Users can add comments to an entry.
- Users can edit comments of an entry.
- Users can delete comments of an entry.

## Stretch Features

- Create a sign-in/register-an-account system.
- Utilize account system to allow users to share their lists of favorite fast-food restaurant locations with each other.

## Preview

![Fast Food Finder](server/public/images/fast-food-finder-1.gif)

## System Requirements

- Node.js 16 or higher
- NPM 8.5 or higher

### Getting Started

1. Clone the repository.

  ```shell
  git clone https://github.com/Daniel-J-Cho/Fast-Food-Finder.git
  cd fast-food-finder
  ```

2. Install all dependencies with NPM.

  ```shell
  npm install
  ```

3. Start PostgreSQL server.

  ```shell
  sudo service postgresql start
  ```

4. Run the dev script.

  ```shell
  npm run dev
  ```

5. Enter 'localhost:3000' in your browser's address bar.

  ```shell
  localhost:3000
  ```
