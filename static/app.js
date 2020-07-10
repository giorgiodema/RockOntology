var current_genre = null

var MusicGenre = function(name,origin){
    this.name = name
    this.origin = origin
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
                            <p class="genre_title">'+this.name.replace("_"," ")+'</p>\
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

function clickListeners(e){
        /*
        /*  click listener on the genre container
        /*  the listner shows the corresponding 
        /*  popup menu 
        */
       if(e.target && e.target.className=="item_genre_container"){
        var popup = document.getElementById("popup_genre_"+e.target.getAttribute("name"))
        if(popup.style.visibility=="collapse")
            popup.style.visibility="visible"
        else
            popup.style.visibility="collapse"
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
    }
    if(e.target && (e.target.className=="genre_sub" || e.target.parentElement.className=="genre_sub")){
        console.log("genre_sub")
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

function infoResponseListener(e){
    console.log(this.responseText)
}


document.body.onload = function(){
    document.addEventListener('click',clickListeners)
    current_genre = new MusicGenre("Rock_music","1960")
    current_genre.draw()
}

