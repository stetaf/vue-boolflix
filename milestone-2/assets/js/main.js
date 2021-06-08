const app = new Vue({
    el: '#app',
    data: {
        moviesUrl: 'https://api.themoviedb.org/3/search/movie?api_key=5eb5e38903b62b2d5616df76724f5b67&language=en-US&page=1&include_adult=false&query=',
        moviesRes: '',
        seriesUrl: 'https://api.themoviedb.org/3/search/tv?api_key=5eb5e38903b62b2d5616df76724f5b67&language=it_IT&query=',
        seriesRes: ''
    },
    methods: {
        /**
         * ### getFlag
         * Retrieve the flag image for a specific language
         * @param {String} code 
         * @returns the flag image url
         */
        getFlag(code) {
            let flagUrl = '';
            switch (code) {
                case "en":
                    flagUrl = "https://www.countryflags.io/us/shiny/32.png";
                    break;
                default: 
                    flagUrl = `https://www.countryflags.io/${code}/shiny/32.png`;
                    break;
            }     
            return flagUrl;
        }
    },
    // Add an event listener to the search button for the API calls
    mounted: function() {
        let button = document.querySelector('#search_btn')
        
        button.addEventListener("click", () => {
            let search = document.querySelector('#search_value').value;
            
            const movies = axios.get(this.moviesUrl + search);
            const tvshows = axios.get(this.seriesUrl + search);

            axios
            .all([movies, tvshows])
            .then(axios.spread((...responses) => {
                const movies_res = responses[0];
                const tvshows_res = responses[1];
                
                console.log(movies_res);

                this.moviesRes = movies_res.data.results;
                this.seriesRes = tvshows_res.data.results;
            }));
        });
    }
});