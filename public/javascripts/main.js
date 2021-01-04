var cmsImageErrorStatus, cmsImageErrorText, imageurl, searchTerm;
var link, width, height, scale, alignment, imageurl, title, htmlBody, contentType;

//$(document).ready(getTrending); //.ready deprecated
$(function() {
  // Handler for .ready() called.
  getCMSImages();
});

function getCMSImages() {
  $.get('/getCMSImages/', function(data) {})
    .done(function(data) {
      if(JSON.parse(data)[0].message === 'The requested resource does not exist'){
        $("#cms-images").append('<div class="slds-box slds-theme--error"><strong>Error : </strong>CMS Channel does not exist</div>');
      }else{
        $.each(JSON.parse(data), function(key, value) {
          $("#cms-images").append('<div class="slds-col slds-size_1-of-3"><img class="slds-p-around_xxx-small grow" sdkimg = "' + value.url + '" src="' + value.url + '" title="'+value.title+'" contentType="'+value.contentType+'" style="width:128px;height:80px"></div>');
        })
        $('#cms-images>img').css('cursor', 'pointer');
      }
      $('#image-link').val('');
    })
    .fail(function(data) {
      cmsImageErrorStatus = data.status;
      cmsImageErrorText = data.statusText;
      $("#cms-images").append('<div class="slds-text-heading_medium slds-text-align_left slds-text-color_destructive">' + cmsImageErrorStatus + ': ' + cmsImageErrorText + '</div>');
    })
}

function getCMSDocuments() {
  $.get('/getCMSDocuments/', function(data) {})
    .done(function(data) {
      if(JSON.parse(data)[0].message === 'The requested resource does not exist'){
        $("#cms-images").append('<div class="slds-box slds-theme--error"><strong>Error : </strong>CMS Channel does not exist</div>');
      }else{
        $.each(JSON.parse(data), function(key, value) {
          $("#cms-images").append('<div class="slds-col slds-size_1-of-3"><img class="slds-p-around_xxx-small grow" link="'+value.url+'" sdkimg = "' + value.thumburl + '" src="' + value.thumburl + '" title="'+value.title+'" contentType="'+value.contentType+'" style="width:128px;height:80px;"><div class="slds-line-clamp_small">'+value.title+'</div></div>');
        })
        $('#cms-images>img').css('cursor', 'pointer');
      }
    })
    .fail(function(data) {
      cmsImageErrorStatus = data.status;
      cmsImageErrorText = data.statusText;
      $("#cms-images").append('<div class="slds-text-heading_medium slds-text-align_left slds-text-color_destructive">' + cmsImageErrorStatus + ': ' + cmsImageErrorText + '</div>');
    })
}

function getCMSNews() {
  $.get('/getCMSNews/', function(data) {})
    .done(function(data) {
      if(JSON.parse(data)[0].message === 'The requested resource does not exist'){
        $("#cms-images").append('<div class="slds-box slds-theme--error"><strong>Error : </strong>CMS Channel does not exist</div>');
      }else{
        $.each(JSON.parse(data), function(key, value) {
         $("#cms-images").append('<div class="slds-col slds-size_1-of-2"><img class="slds-p-around_xxx-small grow" link="" sdkimg = "' + value.bannerImage + '" src="' + value.bannerImage + '" htmlBody="'+value.htmlBody+'" title="'+value.title+'" contentType="'+value.contentType+'" style="width:188px;height:140px;"><div class="slds-line-clamp_small">'+value.excerpt+'</div></div>');
         })
        $('#cms-images>img').css('cursor', 'pointer');
      }
    })
    .fail(function(data) {
      cmsImageErrorStatus = data.status;
      cmsImageErrorText = data.statusText;
      $("#cms-images").append('<div class="slds-text-heading_medium slds-text-align_left slds-text-color_destructive">' + cmsImageErrorStatus + ': ' + cmsImageErrorText + '</div>');
    })
}

// SDK logic to set and retrieve attributes of block
var sdk = new window.sfdc.BlockSDK({
  tabs: ['stylingblock', 'htmlblock']
});


function blockSettings() {
  document.getElementById('image-link').value = link;
  document.getElementById('slider-image-width').value = width;
  document.getElementById('slider-image-height').value = height;
  document.getElementById('slider-image-width-val').innerHTML = width;
  document.getElementById('slider-image-height-val').innerHTML = height;

  if (scale === "yes") {
    document.getElementById('scale-yes').setAttribute("checked", "checked");
  } else {
    document.getElementById('scale-yes').removeAttribute("checked");
    document.getElementById('scale-no').setAttribute("checked", "checked");
  }

  if (alignment === "left") {
    document.getElementById('image-left').setAttribute("checked", "checked");
    document.getElementById('image-center').removeAttribute("checked");
    document.getElementById('image-right').removeAttribute("checked");
  } else if (alignment === "right") {
    document.getElementById('image-left').removeAttribute("checked");
    document.getElementById('image-center').removeAttribute("checked");
    document.getElementById('image-right').setAttribute("checked", "checked");
  } else {
    document.getElementById('image-left').removeAttribute("checked");
    document.getElementById('image-center').setAttribute("checked", "checked");
    document.getElementById('image-right').removeAttribute("checked");
  }
  disableOptions();
}

function sliderValues() {
  document.getElementById('slider-image-width-val').innerHTML = document.getElementById('slider-image-width').value;
  document.getElementById('slider-image-height-val').innerHTML = document.getElementById('slider-image-height').value;
}

function setImage() {
  if(link==''){
    link = document.getElementById('image-link').value;
  }
  width = document.getElementById('slider-image-width').value;
  height = document.getElementById('slider-image-height').value;
  alignment = document.querySelector('input[name="alignment"]:checked').value;
  scale = document.querySelector('input[name="scale"]:checked').value;

  if (scale === "yes") {
    //sdk.setContent('<div style="text-align: ' + alignment + ';"> <a href="' + link + '"><img style="width: 100%" src="' + imageurl + '" /></a></div>');
    sdk.setContent('<div style="font-size: 0.85rem !important;font-family:Helvetica,Arial,sans-serif !important;text-align: ' + alignment + ';"> <a href="' + link + '"><img style="width: 100%" src="' + imageurl + '" /></a><br>'+title+'<br><br>'+htmlBody+'</div>');
  } else {
    sdk.setContent('<div style="font-size: 0.85rem !important;font-family:Helvetica,Arial,sans-serif !important;text-align: ' + alignment + ';"> <a href="' + link + '"><img height="' + height + '" width="' + width + '" src="' + imageurl + '" /></a><br>'+title+'<br><br>'+htmlBody+'</div>');
  }

  sdk.setData({
    link: link,
    width: width,
    height: height,
    imageurl: imageurl,
    alignment: alignment,
    scale: scale,
    title: title,
    htmlBody: htmlBody
  });
}

sdk.getData(function(data) {
  link = data.link || '';
  width = data.width || '300';
  height = data.height || '200';
  imageurl = data.imageurl || 'https://c1.sfdcstatic.com/content/dam/sfdc-docs/www/logos/logo-salesforce.svg';
  alignment = data.alignment || 'center';
  scale = data.scale || 'no';
  title = data.title || '';
  htmlBody = data.htmlBody || '';
  blockSettings();
  setImage();
});

//disable slider values & alignment when scale to fit is selected
function disableOptions() {
  if (document.querySelector('input[name="scale"]:checked').value === "yes") {
    document.getElementById('slider-image-height').setAttribute("disabled", "");
    document.getElementById('slider-image-width').setAttribute("disabled", "");
    document.getElementById('image-left').setAttribute("disabled", "");
    document.getElementById('image-center').setAttribute("disabled", "");
    document.getElementById('image-right').setAttribute("disabled", "");
  } else {
    document.getElementById('slider-image-height').removeAttribute("disabled");
    document.getElementById('slider-image-width').removeAttribute("disabled");
    document.getElementById('image-left').removeAttribute("disabled");
    document.getElementById('image-center').removeAttribute("disabled");
    document.getElementById('image-right').removeAttribute("disabled");
  }
}
// Event Listeners
document.getElementById("image-scale").addEventListener("click", disableOptions);
document.getElementById("slider-image-width").addEventListener("change", sliderValues);
document.getElementById("slider-image-width").addEventListener("change", setImage);
document.getElementById("slider-image-height").addEventListener("change", sliderValues);
document.getElementById("slider-image-height").addEventListener("change", setImage);
document.getElementById("image-link").addEventListener("change", setImage);
document.getElementById("image-alignment").addEventListener("change", setImage);
document.getElementById("image-scale").addEventListener("change", setImage);

$('#news').on('click',function(){
  $('#cms-images').empty();
  $('#image-link').val('');
  resetClassName("#svg-news");
  //disableImageOptions();
  getCMSNews();
});

$('#documents').on('click',function(){
  $('#cms-images').empty();
  $('#image-link').val('');
  resetClassName("#svg-documents");
  //disableImageOptions();
  getCMSDocuments();
});

$('#images').on('click',function(){
  $('#cms-images').empty();
  $('#image-link').val('');
  resetClassName("#svg-images");
  //enableImageOptions();
  getCMSImages();
});

$('body').on('click', 'img', function() {
  imageurl = $(this).attr('sdkimg');
  link = $(this).attr('link') || '';
  //display title for contentType news and cms_documents
  title = $(this).attr('contentType')!= 'cms_image' ? $(this).attr('title') : ''; //$(this).attr('title') || '';
  htmlBody = $(this).attr('htmlBody') || '';
  setImage();
})

function disableImageOptions() {
  document.getElementById('image-link').disabled = true; 
  document.getElementById('scale-yes').setAttribute("disabled", "");
  document.getElementById('scale-no').setAttribute("disabled", "");
  document.getElementById('slider-image-height').setAttribute("disabled", "");
  document.getElementById('slider-image-width').setAttribute("disabled", "");
  document.getElementById('image-left').setAttribute("disabled", "");
  document.getElementById('image-center').setAttribute("disabled", "");
  document.getElementById('image-right').setAttribute("disabled", "");
}

function enableImageOptions() {
  document.getElementById('image-link').disabled = false;
  document.getElementById('scale-yes').removeAttribute("disabled");
  document.getElementById('scale-no').removeAttribute("disabled");
  document.getElementById('slider-image-height').removeAttribute("disabled");
  document.getElementById('slider-image-width').removeAttribute("disabled");
  document.getElementById('image-left').removeAttribute("disabled");
  document.getElementById('image-center').removeAttribute("disabled");
  document.getElementById('image-right').removeAttribute("disabled");
}

function resetClassName(htmlEle){
  let cssElements = ['#svg-documents','#svg-images','#svg-news'];
  cssElements.forEach(cssEle =>{
    if(cssEle===htmlEle){
      if(!$(htmlEle).hasClass("slds-icon-text-success")){
        $(htmlEle).addClass("slds-icon-text-success");
      }
    }else{
      if($(cssEle).hasClass("slds-icon-text-success")){
        $(cssEle).removeClass("slds-icon-text-success");
        $(cssEle).addClass("slds-icon-text-light");
      }
    }
  });
}

