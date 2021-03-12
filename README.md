
# Content Builder SDK - Salesforce CMS Selector

<p align="center">
  <img src="https://user-images.githubusercontent.com/7657958/103909133-533fa900-50d1-11eb-803d-d94c0f463579.png">
</p>

## App Overview

* This SDK app provides a way select a Salesforce CMS Content Types, select a CMS asset, take additional input from the block, and render the CMS asset in the email.

## &#x1f6d1; STOP 
[Download the step-by-step guide] (https://salesforce.quip.com/ic1PAduK3Y76) - How to integrate Salesforce CMS with Marketing Cloud Content Builder before deploying this App

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
	* channelID - Enter the Salesforce CMS channelID 
  * clientID - Enter the Consumer Key from your Connected App
  * cmsUser - Enter the Salesforce CMS Username
  * instanceURL - Enter the Salesforce login URL - https://login.salesforce.com or https://test.salesforce.com 
  * limit - Enter the number of CMS records to display (default is 25, max 100)
  * privateKey - Copy and paste the contents of the server.key file
* Create an Installed Package and add a component type of Custom Content Block. Use the Heroku app URL as the Endpoint URL when configuring this component.


<a href="https://www.heroku.com/deploy/?template=https://github.com/salesforce-marketingcloud/salesforce-cms-content.git">
  <img src="https://www.herokucdn.com/deploy/button.svg" alt="Deploy">
</a>
