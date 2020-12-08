
<p align="center">
  <img src="https://experts-cb-sdk-giphy.herokuapp.com/images/experts-logo.png" width="150" title="Marketing Cloud Experts">
</p>

# Content Builder SDK - Giphy Selector 9000

<p align="center">
  <img src="https://experts-cb-sdk-giphy.herokuapp.com/images/giphy-selector.png" width="100%" title="Giphy Selector 9000">
</p>

## App Overview

* This SDK app provides a way search giphy for an image, take additional input from the block, and render the image in the email.

## Code Overview
* The application was written in Node.js. Express is used as the framework with [EJS](https://github.com/mde/ejs) as the view engine. Leveraged [Salesforce Lightning Design System](https://github.com/salesforce-ux/design-system) for the User Interface, [Giphy Core SDK for JS](https://github.com/Giphy/giphy-js-sdk-core) for interacting with Giphy API, and [Salesforce Marketing Cloud Block SDK](https://github.com/salesforce-marketingcloud/blocksdk) for interacting with Content Builder.
* 3 Total Routes - 1 View
  * index - home page for app that provides the interface the user will engage with.
  * getTrending - retrieves the most recent trending gifs as the block initializes.
  * getSearch - retrieves the gifs based on the user's search.

## Install In Your Environment
* Must have a working Heroku Account to host app
* Select the Deploy to Heroku button below
* Fill out the environment variables
	* apikey - use key from creating a new Giphy app.
		* Create a new Giphy app - https://developers.giphy.com/dashboard/?create=true
		    * Standard giphy API limits apply based on the API key provided in configuration.
  * limit - Number of results to return, maximum 100
  * rating - Limit results to those rated (g, pg, pg-13 or r)
  * language - Default country for regional content; format is 2-letter ISO 639-1 country code
  * sort - Sort order of the results returned (recent | relevant)
* Create an Installed Package and add a component type of Custom Content Block. Use the Heroku app URL as the Endpoint URL when configuring this component.


<a href="https://www.heroku.com/deploy/?template=https://github.com/acates1982/cbSdkGiphy">
  <img src="https://www.herokucdn.com/deploy/button.svg" alt="Deploy">
</a>
