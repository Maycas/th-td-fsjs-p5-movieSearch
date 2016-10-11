var app = (function ($) {

    var app = {
        omdbAPI: "https://www.omdbapi.com/?",
        imdbBaseURL: "http://www.imdb.com/title/",
        $movieList: $("#movies"),
        $movieDetail: $("#movie-detail"),
        movieDetails: {
            $movieTitle: $(".movie-detail-title"),
            $movieRating: $(".movie-detail-rating span"),
            $moviePoster: $(".movie-detail-poster img"),
            $movieSynopsis: $("#movie-detail-synopsis"),
            $imdb: $(".view-imdb")
        },

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

        searchMovieDetails: function (title) {
            $.getJSON(this.omdbAPI, {
                t: title,
                plot: "short",
                type: "movie"
            }).done(this.printMovieDetails).fail(this.showError);
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
                    html += "<a href='#'>";
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

                    html += "</a>";
                    html += "</li>";
                });
            }

            // Append the result to the html
            $("#movies").append(html);
        },

        printMovieDetails: function (movie) {
            if (movie.Response === "False") {
                alert("Something went wrong. Please refresh the page");
            } else {
                var plot;

                // Hide the list
                app.$movieList.hide();

                // Fill in the data inside the movie details page
                app.movieDetails.$movieTitle.text(movie.Title + " (" + movie.Year + ")");

                app.movieDetails.$movieRating.text(movie.imdbRating);

                if (movie.Poster !== "N/A") {
                    app.movieDetails.$moviePoster.attr("src", movie.Poster);
                } else {
                    // TODO: When there's no poster needs a fix. CSS also needs a fix on image size
                }

                if (movie.Plot === "N/A") {
                    plot = "There's no synopsis available for this movie";
                } else {
                    plot = movie.Plot;
                }
                app.movieDetails.$movieSynopsis.text(plot);

                app.movieDetails.$imdb.attr("href", app.imdbBaseURL + movie.imdbID);

                // Show the details
                app.$movieDetail.show();
            }
        },

        showError: function () {
            alert("Something went wrong with your request. Please refresh your browser");
        },

        registerMainMovieListListeners: function () {
            // Submit the form
            $("#submit").click(function (event) {
                event.preventDefault();

                // Hide the movie detail and show the list
                app.$movieDetail.hide();
                app.$movieList.show();

                // Reset the list
                app.$movieList.html("");

                // Build the new list
                app.searchMovies();
            });

            this.$movieList.on("click", "li a", function (event) {
                var clickedTitle = $(this).children(".movie-title").text();
                app.searchMovieDetails(clickedTitle);
            });
        },

        registerMovieDetailListeners: function () {
            // Back button
            $("#back").click(function (event) {
                event.preventDefault();
                app.$movieDetail.hide();
                app.$movieList.show();
            });
        },

        init: function () {
            this.$movieList.show();
            this.registerMainMovieListListeners();

            this.registerMovieDetailListeners();
        }
    };


    app.init();

    return app;

})(jQuery);