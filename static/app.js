document.body.onload = function(){

    /* initialize components */
    var div_genre_rock_music = document.getElementById("div_genre_rock_music")
    var popup_genre_rock_music = document.getElementById("popup_genre_rock_music")

    /* attach handlers */
    div_genre_rock_music.onclick = function(){
        if(popup_genre_rock_music.style.visibility=="collapse")
            popup_genre_rock_music.style.visibility="visible"
        else
            popup_genre_rock_music.style.visibility="collapse"
    }

}

