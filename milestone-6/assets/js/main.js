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
        genre: '',
        notFound: './assets/img/not-found.jpg',
        resultsFilter: '',
        movieEmpty: null,
        tvshowEmpty: null,
        movControls: false,
        tvControls: false
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
         * ### getResults
         * Populates the movies and tvshows array upon search
         */
        getResults() {
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
                this.handleControls(0);
                this.handleControls(1);
            }));
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
        },
        /**
         * ### noResults
         * Upon selecting an option in the genre filter, determine whether there are results given the genre id or not
         * @param {Number} fil 
         */
        async noResults(fil) {
            await this.$nextTick();

            let counter = 0;

            this.moviesRes.forEach(el => {
                el.genre_ids.forEach(id => {
                    (id == fil.target.value) ? counter++ : '';
                })
            });
            (counter > 0 || (fil.target.value == '')) ? this.movieEmpty = false : this.movieEmpty = true;
            
            counter = 0;

            this.seriesRes.forEach(el => {
                el.genre_ids.forEach(id => {
                    (id == fil.target.value) ? counter++ : '';
                })
            });
            (counter > 0 || (fil.target.value == ''))  ? this.tvshowEmpty = false : this.tvshowEmpty = true;

            this.handleControls(0);
            this.handleControls(1);
        },
        /**
         * ### scrollRight
         * Scroll right movies or shows section
         * @param {Number} id 
         */
        scrollRight(id) {
            if (id == 0) {
                document.querySelector('.movies').scrollLeft += 20;
            } else {
                document.querySelector('.shows').scrollLeft += 20;
            }
        },
         /**
          * ### scrollLeft
         * Scroll left movies or shows section
         * @param {Number} id 
         */       
        scrollLeft(id) {
            if (id == 0) {
                document.querySelector('.movies').scrollLeft -= 20;
            } else {
                document.querySelector('.shows').scrollLeft -= 20;
            }
        },
        /**
         * ### handleControls
         * Show or hide the arrow controls for movies or shows section
         * @param {Number} id 
         */
        handleControls(id) {
            if (id == 0) {
                timer = setTimeout(() => {
                    const mov = document.querySelector('.movies');
                    (mov.scrollWidth > mov.clientWidth) ? this.movControls = true : this.movControls = false;
                }, 10);
            } 
            if (id == 1) {
                timer = setTimeout(() => {
                    const tv = document.querySelector('.shows');
                    (tv.scrollWidth > tv.clientWidth) ? this.tvControls = true : this.tvControls = false;
                }, 10);
            }
        }        
    },
    // Calls the API for the movies/shows genres
    mounted: function() {
        this.getGenres();
        let timer = null;

        const rightArrowM = document.querySelector('.controls .right_arrow');
        const leftArrowM = document.querySelector('.controls .left_arrow');
        const rightArrowS = document.querySelector('.s_controls .right_arrow');
        const leftArrowS = document.querySelector('.s_controls .left_arrow');
        
        rightArrowM.addEventListener("mousedown", () => {
            timer = setInterval(() => {
                this.scrollRight(0);
           }, 10);
        });

        leftArrowM.addEventListener("mousedown", () => {
            timer = setInterval(() => {
                this.scrollLeft(0);
           }, 10);
        });

        rightArrowS.addEventListener("mousedown", () => {
            timer = setInterval(() => {
                this.scrollRight(1);
           }, 10);
        });

        leftArrowS.addEventListener("mousedown", () => {
            timer = setInterval(() => {
                this.scrollLeft(1);
           }, 10);
        });

        document.addEventListener("mouseup", function(){
            if (timer) clearInterval(timer);
        });
    }
});