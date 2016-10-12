(function ($) {

    /**
     * Main app object literal
     */
    var app = {
        /**
         * @property {string} omdbAPI   - Base API URL to OMDB
         */
        omdbAPI: "https://www.omdbapi.com/?",

        /**
         * @property {string} imdbBaseURL   - Base API URL to IMDB 
         */
        imdbBaseURL: "http://www.imdb.com/title/",

        /**
         * @property {object} $movieList   - jQuery object with the movie list placeholder reference 
         */
        $movieList: $("#movies"),

        /**
         * @property {object} $movieDetail  - jQuery object with the movie detail placeholder reference 
         */
        $movieDetail: $("#movie-detail"),

        /**
         * @property {object} movieDetails  - object with a collection of references to the movie details page 
         */
        movieDetails: {
            /**
             * @property {object} $movieTitle    - jQuery object with the movie title placeholder reference 
             */
            $movieTitle: $(".movie-detail-title"),

            /**
             * @property {object} $movieRating   - jQuery object with the movie rating placeholder reference  
             */
            $movieRating: $(".movie-detail-rating span"),

            /**
             * @property {object} $moviePoster   - jQuery object with the movie poster placeholder reference 
             */
            $moviePoster: $(".movie-detail-poster img"),

            /**
             * @property {object} $movieSynopsis - jQuery object with the movie synopsis placeholder reference 
             */
            $movieSynopsis: $("#movie-detail-synopsis"),

            /**
             * @property {object} $imdb          - jQuery object with the 'view on IMDB' button reference
             */
            $imdb: $(".view-imdb")
        },

        /**
         * Gets the value of the title introduced in the form 
         * 
         * @returns {string}    - Title introduced in the form
         */
        getTitle: function () {
            return $("#search").val();
        },

        /**
         * Gets the value of the year introduced in the form
         * 
         * @returns {string}    - Year introduced in the form 
         */
        getYear: function () {
            return $("#year").val();
        },

        /**
         * Performs an AJAX request to the OMDB API to search for a list of movies
         * The title is acquired by the form value
         */
        searchMovies: function () {
            var title = this.getTitle();
            var year = this.getYear();

            $.getJSON(this.omdbAPI, {
                s: title,
                y: year,
                type: "movie",
                r: "json"
            }).done(this.printMoviesResults).fail(this.showError);
        },

        /**
         * Performs an AJAX request to the OMDB API by movie title
         * 
         * @param {string} title    - Movie title string to search for
         */
        searchMovieDetails: function (title) {
            $.getJSON(this.omdbAPI, {
                t: title,
                plot: "full",
                type: "movie",
                r: "json"
            }).done(this.printMovieDetails).fail(this.showError);
        },

        /**
         * Prints the movie list on the movie list page
         * 
         * @param {object} movies   - Movies JSON object returned from the API AJAX requests
         * when searching a movie by a string
         */
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

        /**
         * Prints the movie information on the movie details page
         * 
         * @param {object} movie  - Movie JSON object returned from the API AJAX requests
         * when searching a movie by its title
         */
        printMovieDetails: function (movie) {
            if (movie.Response === "False") {
                alert("Something went wrong. Please refresh the page");
            } else {
                var plot, posterURL;

                // Hide the list
                app.$movieList.hide();

                // Fill in the data inside the movie details page
                // Title
                app.movieDetails.$movieTitle.text(movie.Title + " (" + movie.Year + ")");

                // IMDB rating
                app.movieDetails.$movieRating.text(movie.imdbRating);

                // Movie Poster
                if (movie.Poster !== "N/A") {
                    posterURL = movie.Poster;
                } else {
                    posterURL = "https://dummyimage.com/300x400/bbbbbb/fff.png&text=No+poster+available";
                }
                app.movieDetails.$moviePoster.attr("src", posterURL);

                // Movie Plot
                if (movie.Plot === "N/A") {
                    plot = "There's no synopsis available for this movie";
                } else {
                    plot = movie.Plot;
                }
                app.movieDetails.$movieSynopsis.text(plot);

                // IMDB link
                app.movieDetails.$imdb.attr("href", app.imdbBaseURL + movie.imdbID);

                // Show the details
                app.$movieDetail.show();
            }
        },

        /**
         * Shows an alert if the AJAX request has failed for any specific reason
         */
        showError: function () {
            alert("Something went wrong with your request. Please refresh your browser");
        },

        /**
         * Registers the event listeners for the back button in the movie details page
         */
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

            // Movie links to the detail page
            this.$movieList.on("click", "li a", function (event) {
                event.preventDefault();

                // Use the title from the clicked movie to search the information on its details
                var clickedTitle = $(this).children(".movie-title").text();
                app.searchMovieDetails(clickedTitle);
            });
        },

        /**
         * Register the event listeners for the back button in the movie details page
         */
        registerMovieDetailListeners: function () {
            // Back button
            $("#back").click(function (event) {
                event.preventDefault();

                app.$movieDetail.hide();
                app.$movieList.show();
            });
        },

        /**
         * Initializes the application by showing the list of movies placeholder
         * and registering the listeners for both the list and the details placeholder
         */
        init: function () {
            this.$movieList.show();
            this.registerMainMovieListListeners();

            this.registerMovieDetailListeners();
        }
    };

    // Initialize the workflow of the application
    app.init();

})(jQuery);