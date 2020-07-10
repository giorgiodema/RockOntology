var current_genre = null

var MusicGenre = function(name,origin){
    this.name = name
    this.origin = origin
    this.container_id = 'div_genre_'+this.name
    this.popup_id = 'popup_genre_'+this.name
    this.sub_genres = []
    this.fus_genres = []
    this.artists = []
    this.groups = []
}
MusicGenre.prototype.draw = function(){
    /*
    /*  html code for a genre container (rounded container with
    /*  name and year)
    */
    var container =     '<div class="item_genre_container" id="div_genre_'+this.name+'" name='+this.name+'>\
                            <p class="genre_title">'+this.name.replace(/_/g," ")+'</p>\
                            <p class="genre_origin">'+this.origin+'</p>\
                        </div>'
    /*
    /*  html code for the popup menu of the genre item 
    */
    var popup = '       <ul class=popup_genre id="popup_genre_'+this.name+'">\
                            <li class="genre_inf" id=popup_genre_'+this.name+'_inf><p>More Info</p></li>\
                            <li class="genre_sub" id=popup_genre_'+this.name+'_sub><p>Subgenres</p></li>\
                            <li class="genre_fus" id=popup_genre_'+this.name+'_fus><p>Fusion Genres</p></li>\
                            <li class="genre_art" id=popup_genre_'+this.name+'_art><p>Artists</p></li>\
                            <li class="genre_gro" id=popup_genre_'+this.name+'_gro><p>Groups</p></li>\
                        </ul>'
    /*
    /* attach new items to the html page
    */
    document.getElementById('main_container').innerHTML += container + popup
}

var SubItem = function(name){
    this.name = name
    this.container_id = 'subitem_container'+this.name
}
SubItem.prototype.draw = function(){
    /*
    /*  html code for a genre container (rounded container with
    /*  name and year)
    */
    var container =     '<div class="subitem_container" id="subitem_container'+this.name+'" name='+this.name+'>\
                            <p class="subitem_title">'+this.name.replace(/_/g," ")+'</p>\
                        </div>'
    /*
    /* attach new items to the html page
    */
    document.getElementById('main_container').innerHTML += container
}

function clickListeners(e){
        /*
        /*  click listener on the genre container
        /*  the listner shows the corresponding 
        /*  popup menu 
        */
       if(e.target && e.target.className=="item_genre_container"){
        var popup = document.getElementById("popup_genre_"+e.target.getAttribute("name"))
        if(popup.style.display=="flex")
            popup.style.display="none"
        else
            popup.style.display="flex"
    }
    /*
    /*  listeners for the items of the popup menu:
    /*  -> INF: display the long description of the genre
    /*          and the image
    /*  -> SUB: display all the subgenres of the
    /*          current genre
    /*  -> FUS: display all the fusion genres
    /*          with the current genre
    /*  -> ART: display all the artists of the
    /*          current genre
    /*  -> GRO: display all the groups of the current genre
    */
    if(e.target && (e.target.className=="genre_inf" || e.target.parentElement.className=="genre_inf")){
        console.log("genre_inf")
        var oReq = new XMLHttpRequest()
        oReq.addEventListener("load", infoResponseListener)
        oReq.open("GET", document.location.origin + "/query/genre/info"+"?"+"genre="+current_genre.name)
        oReq.send()
        var genreContainer = document.getElementById(current_genre.container_id)
        var genrePopup = document.getElementById(current_genre.popup_id)
        fadeOutElement(genreContainer)
        fadeOutElement(genrePopup)
    }
    if(e.target && (e.target.className=="genre_sub" || e.target.parentElement.className=="genre_sub")){
        console.log("genre_sub")
        var oReq = new XMLHttpRequest()
        oReq.addEventListener("load", subgenresResponseListener)
        oReq.open("GET", document.location.origin + "/query/genre/subgenres"+"?"+"genre="+current_genre.name)
        oReq.send()
        var genreContainer = document.getElementById(current_genre.container_id)
        var genrePopup = document.getElementById(current_genre.popup_id)
        fadeOutElement(genreContainer)
        fadeOutElement(genrePopup)
    }
    if(e.target && (e.target.className=="genre_fus" || e.target.parentElement.className=="genre_fus")){
        console.log("genre_fus")
    }
    if(e.target && (e.target.className=="genre_art" || e.target.parentElement.className=="genre_art")){
        console.log("genre_art")
    }
    if(e.target && (e.target.className=="genre_gro" || e.target.parentElement.className=="genre_gro")){
        console.log("genre_gro")
    }
}


/*
/*  Listeners for the responses for the
/*  asynchronous http requests
*/
function infoResponseListener(e){
    console.log(this.response)
    var data = JSON.parse(this.responseText)        

    var genreContainer = document.getElementById(current_genre.container_id)
    var genrePopup = document.getElementById(current_genre.popup_id)
    var infoContainer = document.getElementById("item_abstract_container")
    var infoTitle = document.getElementById("item_abstract_title")
    var infoDesc = document.getElementById("item_abstract_description")

    infoTitle.innerText = current_genre.name.replace(/_/g," ")
    infoDesc.innerText = data["data"]["abstract"]

    genreContainer.style.display="none"
    genrePopup.style.display="none"
    infoContainer.style.display="block"

    fadeInElement(infoContainer)
}

function subgenresResponseListener(e){
    var genreContainer = document.getElementById(current_genre.container_id)
    var genrePopup = document.getElementById(current_genre.popup_id)
    genreContainer.style.display="none"
    genrePopup.style.display="none"

    console.log(this.response)
    var data = JSON.parse(this.responseText)
    var subgenres = data["data"]
    for(var i=0;i<subgenres.length;i++){
        var subgenre = subgenres[i]
        var subItem = new SubItem(subgenre)
        subItem.draw()
    }
}

/*
/* Helper functions to perform
/* animations
*/
function fadeOutElement(element){
    element.style.animation = "fadeOut 5s"
    element.style.animationFillMode="forwards"
    for(var i=0;i<element.children.length;i++){
        element.children[i].style.animation = "fadeOut 5s"
        element.children[i].style.animationFillMode="forwards"
    }
}

function fadeInElement(element){
    element.style.animation = "fadeIn 5s"
    element.style.animationFillMode="forwards"
    for(var i=0;i<element.children.length;i++){
        element.children[i].style.animation = "fadeIn 5s"
        element.children[i].style.animationFillMode="forwards"
    }
}


document.body.onload = function(){
    document.addEventListener('click',clickListeners)
    current_genre = new MusicGenre("Rock_music","1960")
    current_genre.draw()
}

