var app = (function ($) {

    var app = {
        omdbAPI: "https://www.omdbapi.com/?",
        $movieList: $("#movies"),

        getTitle: function () {
            return $("#search").val();
        },

        getYear: function () {
            return $("#year").val();
        },

        searchMovies: function () {
            var title = this.getTitle();
            var year = this.getYear();

            $.getJSON(this.omdbAPI, {
                s: title,
                y: year,
                type: "movie"
            }).done(this.printMoviesResults).fail(this.showError);
        },

        printMoviesResults: function (movies) {
            var html = "";

            if (movies.Response === "False") {
                // No results being returned by the API
                html += "<li class='no-movies'><i class='material-icons icon-help'>help_outline</i>No movies found that match: " + app.getTitle() + ".</li>";
            } else {
                // The API returns a list of movies
                var moviesArray = movies.Search;

                $.each(moviesArray, function (idx, movie) {
                    html += "<li>";
                    html += "<div class='poster-wrap'>";

                    // Check if the poster is available
                    if (movie.Poster === "N/A") {
                        html += "<i class='material-icons poster-placeholder'>crop_original</i>";
                    } else {
                        html += "<img class='movie-poster' src='" + movie.Poster + "'>";
                    }
                    html += "</div>";

                    // Add movie title
                    html += "<span class='movie-title'>" + movie.Title + "</span>";

                    // Add movie year
                    html += "<span class='movie-year'>" + movie.Year + "</span>";

                    html += "</li>";
                });
            }

            // Append the result to the html
            app.$movieList.append(html);
        },

        showError: function () {
            alert("Something went wrong with your request. Please refresh your browser");
        },

        registerListeners: function () {
            // Submit the form
            $("#submit").click(function (event) {
                event.preventDefault();
                app.$movieList.html("");
                app.searchMovies();
            });
        },

        init: function () {
            this.registerListeners();
        }

    };

    app.init();

    return app;

})(jQuery);