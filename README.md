
# Content Builder SDK - Salesforce CMS Selector

<p align="center">
  <img src="./images/salesforce-cms-selector.png" width="100%" title="Salesforce CMS Selector">
</p>

## App Overview

* This SDK app provides a way select a Salesforce CMS image, take additional input from the block, and render the image in the email.

## Code Overview
* The application was written in Node.js. Express is used as the framework with [EJS](https://github.com/mde/ejs) as the view engine. Leveraged [Salesforce Lightning Design System](https://github.com/salesforce-ux/design-system) for the User Interface, and [Salesforce Marketing Cloud Block SDK](https://github.com/salesforce-marketingcloud/blocksdk) for interacting with Content Builder.
* 3 Total Routes - 1 View
  * index - home page for app that provides the interface the user will engage with.
  * getTrending - retrieves the most recent trending gifs as the block initializes.
  * getSearch - retrieves the gifs based on the user's search.

## Install In Your Environment
* Must have a working Heroku Account to host app
* Select the Deploy to Heroku button below
* Fill out the environment variables
	* clientID - Client ID from Salesforce connected app
  * privateKey - Servey key
  * channelID - Salesforce CMS Channel Id
  * limit - Number of results to return, maximum 100
* Create an Installed Package and add a component type of Custom Content Block. Use the Heroku app URL as the Endpoint URL when configuring this component.


<a href="https://www.heroku.com/deploy/?template=https://github.com/raj-rao/cmscontentdemo.git">
  <img src="https://www.herokucdn.com/deploy/button.svg" alt="Deploy">
</a>
