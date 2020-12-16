var trendingErrorStatus, trendingErrorText, imageurl, searchTerm;
//$(document).ready(getTrending);
$(function() {
  // Handler for .ready() called.
  getTrending();
});

function getTrending() {
  $.get('/getTrending/', function(data) {})
    .done(function(data) {
      $.each(JSON.parse(data), function(key, value) {
        $("#gif-images").append('Title: '+value.title+'<img class="slds-p-around_xxx-small grow" sdkimg = "' + value.url + '" src="' + value.url + '" style="width:90px;height:90px;">');
      })
      $('#gif-images>img').css('cursor', 'pointer');
    })
    .fail(function(data) {
      trendingErrorStatus = data.status;
      trendingErrorText = data.statusText;
      $("#gif-images").append('<div class="slds-text-heading_medium slds-text-align_left slds-text-color_destructive">' + trendingErrorStatus + ': ' + trendingErrorText + 'TEST: '+JSON.stringify(data)+'</div>');
    })
}

function getSearch() {
  searchTerm = document.getElementById('search-text').value;
  $("#gif-images").empty();
  var postData = {
    'searchTerm': searchTerm
  };
  $.post('/getSearch/', postData, function(data) {})
    .done(function(data) {
      $.each(JSON.parse(data), function(key, value) {
        $("#gif-images").append('<img class="slds-p-around_xxx-small grow" sdkimg = "' + value.webp_url + '" src="' + value.preview_url + '" style="width:90px;height:90px;">');
      })
      $('#gif-images>img').css('cursor', 'pointer');
    })
    .fail(function(data) {
      searchErrorStatus = data.status;
      searchErrorText = data.statusText;
      $("#gif-images").append('<div class="slds-text-heading_medium slds-text-align_left slds-text-color_destructive">' + trendingErrorStatus + ': ' + trendingErrorText + '</div>');
    })
}

// SDK logic to set and retrieve attributes of block

var sdk = new window.sfdc.BlockSDK({
  tabs: ['stylingblock', 'htmlblock']
});

var link, width, height, scale, alignment, imageurl;

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
  link = document.getElementById('image-link').value;
  width = document.getElementById('slider-image-width').value;
  height = document.getElementById('slider-image-height').value;
  alignment = document.querySelector('input[name="alignment"]:checked').value;
  scale = document.querySelector('input[name="scale"]:checked').value;

  if (scale === "yes") {
      //sdk.setSuperContent('<div style="text-align: ' + alignment + ';"> <a href="' + link + '"><img style="width: 100%" src="' + imageurl + '" /></a></div><div style="text-align: center"><img src="https://experts-cb-sdk-giphy.herokuapp.com/images/Poweredby_100px-White_VertLogo.png"></div>'); 
    sdk.setContent('<div style="text-align: ' + alignment + ';"> <a href="' + link + '"><img style="width: 100%" src="' + imageurl + '" /></a></div><div style="text-align: center"><img src="https://experts-cb-sdk-giphy.herokuapp.com/images/Poweredby_100px-White_VertLogo.png"></div>');
  } else {
    //sdk.setSuperContent('<div style="text-align: ' + alignment + ';"> <a href="' + link + '"><img style="width: 100%" src="' + imageurl + '" /></a></div><div style="text-align: center"><img src="https://experts-cb-sdk-giphy.herokuapp.com/images/Poweredby_100px-White_VertLogo.png"></div>')
    sdk.setContent('<div style="text-align: ' + alignment + ';"> <a href="' + link + '"><img height="' + height + '" width="' + width + '" src="' + imageurl + '" /></a></div><div style="text-align: center"><img src="https://experts-cb-sdk-giphy.herokuapp.com/images/Poweredby_100px-White_VertLogo.png"></div>');
  }

  sdk.setData({
    link: link,
    width: width,
    height: height,
    imageurl: imageurl,
    alignment: alignment,
    scale: scale
  });
}

sdk.getData(function(data) {
  link = data.link || '';
  width = data.width || '300';
  height = data.height || '300';
  imageurl = data.imageurl || 'https://media3.giphy.com/media/YJBNjrvG5Ctmo/giphy.gif';
  alignment = data.alignment || 'center';
  scale = data.scale || 'no';
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

$('#search')
  .click(getSearch)

$('body').on('click', 'img', function() {
  imageurl = $(this).attr('sdkimg');
  setImage();
})

$('#search-text').keypress(function(event) {
  var keycode = (event.keyCode ? event.keyCode : event.which);
  if (keycode == '13') {
    getSearch();
  }
});
