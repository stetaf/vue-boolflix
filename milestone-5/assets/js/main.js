const app = new Vue({
    el: '#app',
    data: {
        moviesUrl: 'https://api.themoviedb.org/3/search/movie?api_key=5eb5e38903b62b2d5616df76724f5b67&language=en-US&page=1&include_adult=false&query=',
        moviesRes: '',
        moviesCast: 'https://api.themoviedb.org/3/movie/{movie_id}/credits?api_key=5eb5e38903b62b2d5616df76724f5b67&language=en-US',
        seriesUrl: 'https://api.themoviedb.org/3/search/tv?api_key=5eb5e38903b62b2d5616df76724f5b67&language=it_IT&query=',
        seriesRes: '',
        seriesCast: 'https://api.themoviedb.org/3/tv/{tv_id}/credits?api_key=5eb5e38903b62b2d5616df76724f5b67&language=en-US',
        genreUrl: 'https://api.themoviedb.org/3/genre/movie/list?api_key=5eb5e38903b62b2d5616df76724f5b67&language=en-US',
        genre: null,
        notFound: './assets/img/not-found.jpg'
    },
    methods: {
        /**
         * ### getFlag
         * Retrieve the flag image for a specific language
         * @param {String} code 
         * @returns the flag image url
         */
        getFlag(code) {
            let flagUrl = 'https://www.unknown.nu/flags/images/' + code + '-100';
            return flagUrl;
        },
        /**
         * ### getGenres
         * Retreieves all the genres avalaible
         */
        getGenres() {
            axios
            .get(this.genreUrl)
            .then(response => {
                this.genre = response.data.genres;
            });
        },
        /**
         * ### openModalMovie
         * Given an index, populate the modal with all the infos and show it 
         * @param {Number} id 
         */
        openModalMovie(id) {
            document.querySelector('#modal').style.display = 'block';
            document.querySelector('#mtitle').innerText = this.moviesRes[id]['title'];  
            document.querySelector('#overview').innerText = this.moviesRes[id]['overview'];  
            let cast = '';
            for (i = 0; i < 5; i++) {
                cast += '<li>' + this.moviesRes[id]['cast'][i]['name'] + '</li>';
            }
            document.querySelector('#cast').innerHTML = cast;
            let genre = '';
            for (h = 0; h < this.moviesRes[id]['genre_ids'].length; h++) {
                let filmGenre = this.moviesRes[id]['genre_ids'][h];
                for (y = 0; y < this.genre.length; y++) {
                    if (this.genre[y].id == filmGenre) genre += this.genre[y].name;
                }
                if ((h+1) < this.moviesRes[id]['genre_ids'].length) genre += ', ';
            }
            document.querySelector('#genre').innerHTML = genre;
        },
         /**
         * ### openModalShow
         * Given an index, populate the modal with all the infos and show it 
         * @param {Number} id 
         */
        openModalShow(id) {
            document.querySelector('#modal').style.display = 'block';
            document.querySelector('#mtitle').innerText = this.seriesRes[id]['name'];  
            document.querySelector('#overview').innerText = this.seriesRes[id]['overview'];  
            let cast = '';
            for (i = 0; i < 5; i++) {
                cast += '<li>' + this.seriesRes[id]['cast'][i]['name'] + '</li>';
            }
            document.querySelector('#cast').innerHTML = cast;
            let genre = '';
            for (h = 0; h < this.seriesRes[id]['genre_ids'].length; h++) {
                let filmGenre = this.seriesRes[id]['genre_ids'][h];
                for (y = 0; y < this.genre.length; y++) {
                    if (this.genre[y].id == filmGenre) genre += this.genre[y].name;
                }
                if ((h+1) < this.seriesRes[id]['genre_ids'].length) genre += ', ';
            }
            document.querySelector('#genre').innerHTML = genre;
        },
        /**
         * ### closeModal
         * Close the modal
         */
        closeModal() {
            document.querySelector('#modal').style.display = 'none';
        }
    },
    // Instantly calls the API for the movies/shows genres
    // Add an event listener to the search button for the API calls, gathering all the movies and the casts 
    mounted: function() {
        this.getGenres();

        let button = document.querySelector('#search_btn')
        
        button.addEventListener("click", () => {
            let search = document.querySelector('#search_value').value;
            
            const movies = axios.get(this.moviesUrl + search);
            const tvshows = axios.get(this.seriesUrl + search);

            axios
            .all([movies, tvshows])
            .then(axios.spread((...responses) => {
                this.moviesRes = responses[0].data.results;
                this.moviesRes.forEach(element => {
                    element.stars = Math.ceil(5 * (element.vote_average / 10));
                    axios
                    .get(this.moviesCast.replace('{movie_id}', element.id))
                    .then(response => {
                        element.cast = response.data.cast;
                    })
                });
                this.seriesRes = responses[1].data.results;
                this.seriesRes.forEach(element => {
                    element.stars = Math.ceil(5 * (element.vote_average / 10));
                    axios
                    .get(this.seriesCast.replace('{tv_id}', element.id))
                    .then(response => {
                        element.cast = response.data.cast;
                    })
                });
            }));
        });
    }
});