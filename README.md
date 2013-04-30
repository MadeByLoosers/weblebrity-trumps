# Weblebrity Trumps

Like a who’s who of the information superhighway websphere, Weblebrity Trumps turns the web's elite into a gamification experience based on social media and internet proliferation.

## Front end

To view the front-end of the site, set up a new virtual host with */static* as the root directory.

To update the CSS you need [SASS](http://sass-lang.com) (SCSS) installed.

To update the CSS automatically when you change the SCSS files, navigate to the */static/_includes/* directory through terminal, and run the
command:

```
sass --watch scss:css
```


## Updating script

To run the updating script that gets the latest values you need Node (v0.8+)

In terminal navigate to the root of the site and run:

```
npm install
```

Then start the information gathering with:

```
node app.js
```

This should update the json file used to populate the cards