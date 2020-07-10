var MusicGenre = function(name,origin){
    this.name = name
    this.origin = origin
}
MusicGenre.prototype.draw = function(){
    /*  html code for a genre container (rounded container with
    /*  name and year) */
    var container =     '<div class="item_genre_container" id="div_genre_'+this.name+'" name='+this.name+'>\
                            <p class="genre_title">'+this.name.replace("_"," ")+'</p>\
                            <p class="genre_origin">'+this.origin+'</p>\
                        </div>'
    /*  html code for the popup menu of the genre item */
    var popup = '       <ul class=popup_genre id="popup_genre_'+this.name+'">\
                            <li id=popup_genre_'+this.name+'_inf><p>More Info</p></li>\
                            <li id=popup_genre_'+this.name+'_sub><p>Subgenres</p></li>\
                            <li id=popup_genre_'+this.name+'_fus><p>Fusion Genres</p></li>\
                            <li id=popup_genre_'+this.name+'_art><p>Artists</p></li>\
                            <li id=popup_genre_'+this.name+'_gro><p>Groups</p></li>\
                        </ul>'
    /* attach new items to the html page */
    document.getElementById('main_container').innerHTML += container + popup

    /*  add event listeners to the new
    /*  added elements */
    document.addEventListener('click',function(e){
        if(e.target && e.target.className=="item_genre_container"){
            var popup = document.getElementById("popup_genre_"+e.target.getAttribute("name"))
            if(popup.style.visibility=="collapse")
                popup.style.visibility="visible"
            else
                popup.style.visibility="collapse"
        }
    })
}


document.body.onload = function(){
    var rock_music = new MusicGenre("Rock_music","1960")
    rock_music.draw()
}

