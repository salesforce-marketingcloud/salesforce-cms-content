
# Content Builder SDK - Salesforce CMS Selector

<p align="center">
  <img src="https://user-images.githubusercontent.com/7657958/103181639-5933bf80-4871-11eb-9d54-4eaf0963351f.png" width="100%" title="Salesforce CMS Selector">
</p>

## App Overview

* This SDK app provides a way select a Salesforce CMS image, take additional input from the block, and render the image in the email.

## Code Overview
* The application was written in Node.js. Express is used as the framework with [EJS](https://github.com/mde/ejs) as the view engine. Leveraged [Salesforce Lightning Design System](https://github.com/salesforce-ux/design-system) for the User Interface, and [Salesforce Marketing Cloud Block SDK](https://github.com/salesforce-marketingcloud/blocksdk) for interacting with Content Builder.
* 3 Total Routes - 1 View
  * index - home page for app that provides the interface the user will engage with.
  * getCMSDocuments - retrieves cms documents based on the standard cms_document content type for the specified channelId.
  * getCMSImages - retrieves cms images based on the standard cms_image content type for the specified channelId.
  * getCMSNews - retrieves cms news based on the standard news content type for the specified channelId.

## Install In Your Environment
* Must have a working Heroku Account to host app
* Select the Deploy to Heroku button below
* Fill out the environment variables
	* clientID - Client ID from Salesforce connected app
  * privateKey - Server key
  * channelID - Salesforce CMS Channel Id
  * limit - Number of results to return, maximum 100
* Create an Installed Package and add a component type of Custom Content Block. Use the Heroku app URL as the Endpoint URL when configuring this component.


<a href="https://www.heroku.com/deploy/?template=https://github.com/raj-rao/cmscontentdemo.git">
  <img src="https://www.herokucdn.com/deploy/button.svg" alt="Deploy">
</a>
